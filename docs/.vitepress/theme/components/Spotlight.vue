<script setup lang="ts">
// macOS Spotlight 스타일 검색창
// 21st.dev의 "Apple Spotlight" (React + framer-motion) 컴포넌트를 참고해 Vue + CSS로 옮긴 것
// - 검색 데이터는 VitePress 기본 로컬 검색 인덱스(MiniSearch)를 그대로 사용
// - 열릴 때 흐림(blur) + 살짝 늘어났다 돌아오는 애니메이션
// - 데스크톱: 검색창에 마우스를 올리면 분류 바로가기 버블이 끈적하게(gooey) 튀어나옴
// - 모바일: 검색어가 없을 때 분류 바로가기를 아이콘 줄로 표시
// - ⌘K / Ctrl+K / "/" 로 열고, ↑↓ 로 이동, Enter 로 열기, Esc 로 닫기
// @ts-ignore - VitePress가 빌드 시 만들어 주는 가상 모듈
import localSearchIndex from '@localSearchIndex'
import MiniSearch from 'minisearch'
import { computed, markRaw, nextTick, onMounted, onUnmounted, ref, shallowRef, watch } from 'vue'
import { useData, useRoute, useRouter, withBase } from 'vitepress'
import { categories, dockSections, flattenLinks, normalizePath } from '../categories'
import { ICONS } from '../icons'
import { closeSpotlight, openSpotlight, spotlightOpen, toggleSpotlight } from '../spotlight'

interface Result {
  id: string
  title: string
  desc: string
  icon: string
  html: string
}

const { theme, localeIndex } = useData()
const router = useRouter()
const route = useRoute()

const mounted = ref(false)
const canHover = ref(false) // 마우스 호버가 가능한 넓은 화면인지
const isMac = ref(true)
const query = ref('')
const selected = ref(0)
const rowHovered = ref(false)
const hoveredShortcut = ref<number | null>(null)
const inputEl = ref<HTMLInputElement | null>(null)
const listEl = ref<HTMLElement | null>(null)
let lastFocused: HTMLElement | null = null

// ---- 검색 인덱스 (처음 열 때 한 번만 불러옴) ----
const mini = shallowRef<MiniSearch<any> | null>(null)
let loading: Promise<void> | null = null
function loadIndex() {
  if (mini.value || loading) return
  loading = (async () => {
    const mod = await (localSearchIndex as Record<string, () => Promise<any>>)[localeIndex.value]?.()
    if (!mod) return
    mini.value = markRaw(
      MiniSearch.loadJSON(mod.default, {
        fields: ['title', 'titles', 'text'],
        storeFields: ['title', 'titles'],
        searchOptions: { fuzzy: 0.2, prefix: true, boost: { title: 4, text: 2, titles: 1 } },
      }),
    )
  })().catch(() => {
    loading = null
  })
}

// ---- 분류 바로가기 (독과 같은 5개 분류) ----
const shortcuts = computed(() => {
  const links = flattenLinks(theme.value.sidebar)
  return dockSections.map((s) => ({
    id: s.id,
    label: s.label,
    short: s.label === 'Computer Science' ? 'CS' : s.label,
    icon: s.icon,
    href: withBase(links.find(s.match) ?? '/'),
  }))
})

const showBubbles = computed(() => canHover.value && rowHovered.value && !query.value)

const placeholder = computed(() =>
  hoveredShortcut.value !== null
    ? `${shortcuts.value[hoveredShortcut.value].short} 바로가기`
    : '무엇이든 검색해 보세요',
)

// ---- 검색 결과 ----
const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
// 인덱스의 제목은 HTML 엔티티(&amp; 등)가 들어 있어서 한 번 풀어 준다
let decoder: HTMLTextAreaElement | null = null
function decodeEntities(s: string) {
  if (!s || !s.includes('&')) return s
  decoder ??= document.createElement('textarea')
  decoder.innerHTML = s
  return decoder.value
}
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

function highlight(text: string, terms: string[]) {
  const safe = escapeHtml(text)
  const words = terms.filter(Boolean).sort((a, b) => b.length - a.length).map((t) => escapeRe(escapeHtml(t)))
  if (!words.length) return safe
  return safe.replace(new RegExp(`(${words.join('|')})`, 'gi'), '<mark>$1</mark>')
}

const results = computed<Result[]>(() => {
  const q = query.value.trim()
  if (!q || !mini.value) return []
  const terms = q.split(/\s+/)
  return mini.value
    .search(q)
    .slice(0, 30)
    .map((r: any) => {
      const path = normalizePath(String(r.id).split('#')[0])
      const sec = dockSections.find((s) => s.match(path))
      const cat = categories.find((c) => c.match(path)) // 홈 목록의 세부 분류 (예: 데이터베이스)
      const title = decodeEntities(r.title)
      const parents = (r.titles || []).map(decodeEntities)
      return {
        id: r.id,
        title,
        desc: [cat?.title ?? sec?.label, ...parents].filter(Boolean).join(' › '),
        icon: sec?.icon ?? 'file',
        html: highlight(title, [...terms, ...(r.terms || [])]),
      }
    })
})

watch(query, () => {
  selected.value = 0
  if (listEl.value) listEl.value.scrollTop = 0
})

// ---- 이동 ----
function go(href: string) {
  closeSpotlight()
  router.go(href)
}
// ⌘/Ctrl/Shift+클릭은 브라우저 기본 동작(새 탭 등)에 맡김
function onLinkClick(e: MouseEvent, href: string) {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
  e.preventDefault()
  go(href)
}

function moveSelection(step: number) {
  const n = results.value.length
  if (!n) return
  selected.value = (selected.value + step + n) % n
  nextTick(() => {
    listEl.value?.querySelector('.sl-card.active')?.scrollIntoView({ block: 'nearest' })
  })
}

function onInputKeydown(e: KeyboardEvent) {
  if (e.isComposing) return // 한글 입력 조합 중에는 무시
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    moveSelection(1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    moveSelection(-1)
  } else if (e.key === 'Enter') {
    const r = results.value[selected.value]
    if (r) {
      e.preventDefault()
      go(r.id)
    }
  }
}

// ---- 단축키 ----
function isEditing(e: KeyboardEvent) {
  const el = e.target as HTMLElement | null
  if (!el) return false
  return el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName)
}
function onGlobalKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    toggleSpotlight()
  } else if (e.key === '/' && !spotlightOpen.value && !isEditing(e)) {
    e.preventDefault()
    openSpotlight()
  } else if (e.key === 'Escape' && spotlightOpen.value) {
    e.preventDefault()
    closeSpotlight()
  }
}

// ---- 열림/닫힘 처리 ----
watch(spotlightOpen, async (open) => {
  const root = document.documentElement
  if (open) {
    lastFocused = document.activeElement as HTMLElement | null
    query.value = ''
    loadIndex()
    root.classList.add('sl-lock')
    await nextTick()
    inputEl.value?.focus()
  } else {
    root.classList.remove('sl-lock')
    rowHovered.value = false
    hoveredShortcut.value = null
    if (lastFocused && document.contains(lastFocused)) lastFocused.focus({ preventScroll: true })
  }
})
watch(
  () => route.path,
  () => closeSpotlight(),
)

onMounted(() => {
  mounted.value = true
  const mq = window.matchMedia('(hover: hover) and (min-width: 768px)')
  canHover.value = mq.matches
  mq.addEventListener?.('change', (ev) => (canHover.value = ev.matches))
  isMac.value = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)
  window.addEventListener('keydown', onGlobalKeydown)
})
onUnmounted(() => {
  window.removeEventListener('keydown', onGlobalKeydown)
  document.documentElement.classList.remove('sl-lock')
})
</script>

<template>
  <Teleport v-if="mounted" to="body">
    <Transition name="sl">
      <div
        v-if="spotlightOpen"
        class="sl-overlay"
        role="dialog"
        aria-modal="true"
        aria-label="문서 검색"
        @mousedown.self="closeSpotlight"
      >
        <!-- 버블이 끈적하게 붙었다 떨어지는 효과용 SVG 필터 -->
        <svg class="sl-svg" width="0" height="0" aria-hidden="true">
          <filter id="sl-blob">
            <feGaussianBlur stdDeviation="10" in="SourceGraphic" />
            <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -9" result="blob" />
            <feBlend in="SourceGraphic" in2="blob" />
          </filter>
        </svg>

        <div
          class="sl-row"
          :class="{ goo: showBubbles }"
          @mouseenter="rowHovered = true"
          @mouseleave="rowHovered = false; hoveredShortcut = null"
        >
          <div class="sl-box">
            <div class="sl-input-row">
              <svg class="sl-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" v-html="ICONS.search" />
              <div class="sl-input-wrap">
                <Transition name="ph">
                  <span v-if="!query" :key="placeholder" class="sl-ph">{{ placeholder }}</span>
                </Transition>
                <input
                  ref="inputEl"
                  v-model="query"
                  class="sl-input"
                  type="text"
                  enterkeyhint="search"
                  autocomplete="off"
                  autocapitalize="off"
                  spellcheck="false"
                  aria-label="문서 검색"
                  @keydown="onInputKeydown"
                />
              </div>
              <button type="button" class="sl-close" aria-label="검색 닫기" @click="closeSpotlight">
                <span class="sl-close-kbd">esc</span>
                <span class="sl-close-text">취소</span>
              </button>
            </div>

            <!-- 모바일/터치: 검색어가 없을 때 분류 바로가기 -->
            <nav v-if="!query" class="sl-quick" aria-label="분류 바로가기">
              <a
                v-for="s in shortcuts"
                :key="s.id"
                :href="s.href"
                class="sl-quick-item"
                @click="onLinkClick($event, s.href)"
              >
                <span class="sl-quick-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" v-html="ICONS[s.icon]" />
                </span>
                <span class="sl-quick-label">{{ s.short }}</span>
              </a>
            </nav>

            <div v-if="query" ref="listEl" class="sl-results" role="listbox" aria-label="검색 결과">
              <template v-if="results.length">
                <a
                  v-for="(r, i) in results"
                  :key="r.id"
                  :href="r.id"
                  class="sl-card"
                  :class="{ active: i === selected }"
                  role="option"
                  :aria-selected="i === selected"
                  :style="{ '--d': Math.min(i, 8) * 35 + 'ms' }"
                  @mousemove="selected = i"
                  @click="onLinkClick($event, r.id)"
                >
                  <span class="sl-card-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" v-html="ICONS[r.icon]" />
                  </span>
                  <span class="sl-card-text">
                    <span class="sl-card-title" v-html="r.html" />
                    <span class="sl-card-desc">{{ r.desc }}</span>
                  </span>
                  <svg class="sl-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="ICONS.chevronRight" />
                </a>
              </template>
              <p v-else-if="mini" class="sl-empty">‘{{ query }}’에 대한 결과가 없어요</p>
              <p v-else class="sl-empty">검색 준비 중…</p>
            </div>

            <div v-if="query && results.length" class="sl-foot">
              <span><kbd>↑</kbd><kbd>↓</kbd> 이동</span>
              <span><kbd>Enter</kbd> 열기</span>
              <span><kbd>Esc</kbd> 닫기</span>
            </div>
          </div>

          <!-- 데스크톱: 호버 시 튀어나오는 분류 버블 -->
          <TransitionGroup name="sc">
            <template v-if="showBubbles">
              <a
                v-for="(s, i) in shortcuts"
                :key="s.id"
                :href="s.href"
                class="sl-sc"
                :style="{ '--i': i }"
                :aria-label="s.label"
                @mouseenter="hoveredShortcut = i"
                @click="onLinkClick($event, s.href)"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" v-html="ICONS[s.icon]" />
              </a>
            </template>
          </TransitionGroup>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.sl-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 14vh 24px 24px;
  background: rgba(0, 0, 0, 0.18);
  -webkit-backdrop-filter: blur(3px);
  backdrop-filter: blur(3px);
}
:global(.dark) .sl-overlay {
  background: rgba(0, 0, 0, 0.45);
}
.sl-svg {
  position: absolute;
  width: 0;
  height: 0;
}

/* 열림/닫힘: 흐림 + 가로로 살짝 늘어났다 돌아옴 */
.sl-enter-active,
.sl-leave-active {
  transition: opacity 0.25s ease;
}
.sl-enter-from,
.sl-leave-to {
  opacity: 0;
}
.sl-enter-active .sl-row {
  animation: sl-in 0.4s cubic-bezier(0.2, 0.9, 0.25, 1.05) both;
}
.sl-leave-active .sl-row {
  animation: sl-out 0.22s ease-in both;
}
@keyframes sl-in {
  from {
    opacity: 0;
    filter: blur(20px);
    transform: translateY(-10px) scale(1.3, 1.1);
  }
  to {
    opacity: 1;
    filter: blur(0);
    transform: none;
  }
}
@keyframes sl-out {
  to {
    opacity: 0;
    filter: blur(20px);
    transform: translateY(10px) scale(1.3, 1.1);
  }
}

.sl-row {
  display: flex;
  align-items: flex-start;
  width: 100%;
  max-width: 768px;
}
.sl-row.goo {
  filter: url(#sl-blob);
}

.sl-box {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  border-radius: 30px;
  border: 1px solid var(--sl-border);
  background: var(--sl-surface);
  color: var(--vp-c-text-1);
  box-shadow: 0 18px 50px -12px rgba(0, 0, 0, 0.35);
  overflow: hidden;
}

.sl-input-row {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 64px;
  padding: 0 14px 0 24px;
  flex: none;
}
.sl-search-icon {
  flex: none;
  width: 26px;
  height: 26px;
  color: var(--vp-c-text-2);
}
.sl-input-wrap {
  position: relative;
  flex: 1;
  min-width: 0;
  height: 100%;
  font-size: 22px;
}
.sl-input {
  width: 100%;
  height: 100%;
  border: 0;
  outline: none;
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: 22px;
}
.sl-ph {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  color: var(--vp-c-text-3);
  white-space: nowrap;
  overflow: hidden;
  pointer-events: none;
}
.ph-enter-active,
.ph-leave-active {
  transition: opacity 0.2s ease-out, transform 0.2s ease-out, filter 0.2s ease-out;
}
.ph-enter-from {
  opacity: 0;
  transform: translateY(10px);
  filter: blur(5px);
}
.ph-leave-to {
  opacity: 0;
  transform: translateY(-10px);
  filter: blur(5px);
}

.sl-close {
  flex: none;
  padding: 4px 8px;
  border-radius: 8px;
  border: 1px solid var(--sl-border);
  background: transparent;
  color: var(--vp-c-text-3);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
}
.sl-close:hover {
  color: var(--vp-c-text-1);
}
.sl-close-text {
  display: none;
}

/* 검색 결과 */
.sl-results {
  max-height: min(24rem, calc(100dvh - 14vh - 150px));
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 8px;
  border-top: 1px solid var(--sl-border);
  background: var(--sl-surface-2);
}
.sl-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 10px;
  border-radius: 12px;
  color: inherit;
  text-decoration: none;
  animation: sl-fade 0.2s ease-out both;
  animation-delay: var(--d);
}
.sl-card.active {
  background: var(--sl-card-hover);
  box-shadow: 0 6px 16px -8px rgba(0, 0, 0, 0.25);
}
@keyframes sl-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
.sl-card-icon {
  flex: none;
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  color: var(--vp-c-text-2);
}
.sl-card-icon svg {
  width: 22px;
  height: 22px;
}
.sl-card.active .sl-card-icon {
  color: var(--vp-c-brand-1);
}
.sl-card-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
}
.sl-card-title {
  font-size: 15px;
  font-weight: 500;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.sl-card-title :deep(mark) {
  background: transparent;
  color: var(--vp-c-brand-1);
  font-weight: 700;
}
.sl-card-desc {
  font-size: 12px;
  line-height: 1.4;
  color: var(--vp-c-text-2);
  opacity: 0.8;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.sl-chev {
  flex: none;
  width: 20px;
  height: 20px;
  color: var(--vp-c-text-3);
  opacity: 0;
  transition: opacity 0.2s;
}
.sl-card.active .sl-chev {
  opacity: 1;
}
.sl-empty {
  padding: 20px 12px;
  text-align: center;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.sl-foot {
  display: flex;
  justify-content: flex-end;
  gap: 14px;
  padding: 8px 18px;
  border-top: 1px solid var(--sl-border);
  background: var(--sl-surface-2);
  font-size: 12px;
  color: var(--vp-c-text-3);
}
.sl-foot kbd {
  display: inline-block;
  min-width: 18px;
  margin-right: 3px;
  padding: 0 4px;
  border-radius: 4px;
  border: 1px solid var(--sl-border);
  background: var(--sl-surface);
  font-family: inherit;
  font-size: 11px;
  text-align: center;
}

/* 데스크톱 호버 버블 */
.sl-sc {
  flex: none;
  display: grid;
  place-items: center;
  width: 58px;
  height: 58px;
  margin-top: 3px;
  margin-left: 12px;
  border-radius: 50%;
  border: 1px solid var(--sl-border);
  background: var(--sl-surface);
  color: var(--vp-c-text-1);
  box-shadow: 0 18px 50px -12px rgba(0, 0, 0, 0.35);
  transition: width 0.5s cubic-bezier(0.34, 1.3, 0.64, 1), margin 0.5s cubic-bezier(0.34, 1.3, 0.64, 1),
    transform 0.6s cubic-bezier(0.34, 1.4, 0.64, 1), opacity 0.3s;
  transition-delay: calc(var(--i) * 50ms);
}
.sl-sc svg {
  width: 26px;
  height: 26px;
  opacity: 0.35;
  transition: opacity 0.2s;
}
.sl-sc:hover svg {
  opacity: 1;
}
.sc-enter-from,
.sc-leave-to {
  width: 0;
  margin-left: 0;
  opacity: 0;
  transform: translateX(calc((var(--i) + 1) * -58px)) scale(0.7);
}
.sc-leave-active {
  transition-delay: 0s;
}

/* 모바일/터치용 분류 바로가기 */
.sl-quick {
  display: none;
}
@media (hover: none), (max-width: 767px) {
  .sl-quick {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 4px;
    padding: 4px 10px 14px;
  }
  .sl-quick-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 6px 0;
    border-radius: 12px;
    color: var(--vp-c-text-2);
    text-decoration: none;
    -webkit-tap-highlight-color: transparent;
  }
  .sl-quick-item:active {
    background: var(--sl-surface-2);
  }
  .sl-quick-icon {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: var(--sl-surface-2);
    color: var(--vp-c-text-1);
  }
  .sl-quick-icon svg {
    width: 22px;
    height: 22px;
  }
  .sl-quick-label {
    font-size: 11px;
    line-height: 1.2;
  }
}

/* 모바일 */
@media (max-width: 640px) {
  .sl-overlay {
    padding: 12px 12px 16px;
  }
  .sl-box {
    border-radius: 24px;
  }
  .sl-input-row {
    height: 56px;
    padding: 0 10px 0 18px;
  }
  .sl-search-icon {
    width: 22px;
    height: 22px;
  }
  .sl-input-wrap,
  .sl-input {
    font-size: 17px; /* 16px 이상이어야 iOS가 확대하지 않음 */
  }
  .sl-close {
    border: 0;
    font-size: 15px;
    color: var(--vp-c-brand-1);
  }
  .sl-close-kbd {
    display: none;
  }
  .sl-close-text {
    display: inline;
  }
  .sl-results {
    max-height: calc(100dvh - 12px - 56px - 40px);
  }
  .sl-foot {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sl-enter-active .sl-row,
  .sl-leave-active .sl-row,
  .sl-card {
    animation: none;
  }
  .sl-sc,
  .ph-enter-active,
  .ph-leave-active {
    transition: none;
  }
}
</style>
