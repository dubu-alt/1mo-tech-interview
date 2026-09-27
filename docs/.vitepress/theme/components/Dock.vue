<script setup lang="ts">
// 화면 하단에 떠 있는 독(Dock) 내비게이션
// 21st.dev의 "Dock" (anurag-mishra22/dock-two, MIT) 디자인을 참고해 Vue + CSS로 옮긴 것
// - 둥실 떠 있는 애니메이션, 호버 시 살짝 커지며 위로 올라가는 아이콘, 라벨 툴팁
// - 현재 보고 있는 분류는 점(•)으로 표시
// - 글을 읽으며 아래로 스크롤하면 자동으로 숨고, 위로 스크롤하거나 페이지 맨 위/끝에 오면 다시 나타남
// - 접기 버튼으로 동그란 버튼 하나로 줄일 수 있고, 접은 상태는 다음 방문 때도 기억함
import { computed, inject, onMounted, onUnmounted, ref, watch } from 'vue'
import { useData, useRoute, withBase } from 'vitepress'
import { dockSections, flattenLinks, normalizePath } from '../categories'
import { ICONS } from '../icons'
import { openSpotlight } from '../spotlight'

const { theme, isDark } = useData()
const route = useRoute()


const current = computed(() => normalizePath(route.path))

const navItems = computed(() => {
  const links = flattenLinks(theme.value.sidebar)
  const home = { id: 'home', label: '홈', icon: 'home', href: withBase('/'), active: current.value === '/' }
  const sections = dockSections.map((s) => {
    const first = links.find(s.match)
    return {
      id: s.id,
      label: s.label,
      icon: s.icon,
      href: withBase(first ?? '/'),
      active: s.match(current.value),
    }
  })
  return [home, ...sections]
})

// Spotlight 검색 창 열기
function openSearch() {
  openSpotlight()
}

// VitePress 기본 다크 모드 토글 재사용 (전환 애니메이션 포함)
const toggleAppearance = inject<() => void>('toggle-appearance', () => {
  isDark.value = !isDark.value
})

// ---- 접기 (localStorage에 기억) ----
const STORAGE_KEY = '1mo-dock-collapsed'
const collapsed = ref(false)
function setCollapsed(v: boolean) {
  collapsed.value = v
  hidden.value = false
  try {
    localStorage.setItem(STORAGE_KEY, v ? '1' : '0')
  } catch {}
}

// ---- 스크롤 방향에 따른 자동 숨김 ----
const hidden = ref(false)
const ready = ref(false) // 저장된 접기 상태를 읽기 전 깜빡임 방지
const focused = ref(false) // 키보드로 독에 들어오면 숨기지 않음
const THRESHOLD = 6 // 이만큼(px) 이상 움직였을 때만 방향으로 인정
let lastY = 0
let ticking = false

function update() {
  const y = window.scrollY
  const dy = y - lastY
  const atTop = y < 80
  const atBottom = window.innerHeight + y >= document.documentElement.scrollHeight - 48
  if (atTop || atBottom) hidden.value = false
  else if (dy > THRESHOLD) hidden.value = true
  else if (dy < -THRESHOLD) hidden.value = false
  if (Math.abs(dy) > THRESHOLD || atTop || atBottom) lastY = y
  ticking = false
}
function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(update)
}

onMounted(() => {
  try {
    collapsed.value = localStorage.getItem(STORAGE_KEY) === '1'
  } catch {}
  lastY = window.scrollY
  window.addEventListener('scroll', onScroll, { passive: true })
  requestAnimationFrame(() => (ready.value = true))
})
onUnmounted(() => window.removeEventListener('scroll', onScroll))

// 다른 페이지로 이동하면 다시 보여 줌
watch(
  () => route.path,
  () => {
    hidden.value = false
    lastY = 0
  },
)
</script>

<template>
  <nav
    class="dock-wrap"
    :class="{ ready, collapsed, hidden: hidden && !focused }"
    aria-label="빠른 이동"
    @focusin="focused = true"
    @focusout="focused = false"
  >
    <!-- type="transition": 독의 무한 떠다님 애니메이션 때문에 전환이 안 끝나는 문제 방지 -->
    <Transition name="dock-swap" mode="out-in" type="transition">
    <div v-if="!collapsed" key="dock" class="dock">
      <a
        v-for="item in navItems"
        :key="item.id"
        :href="item.href"
        class="dock-btn"
        :class="{ active: item.active }"
        :aria-label="item.label"
        :aria-current="item.active ? 'page' : undefined"
      >
        <svg class="dock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="ICONS[item.icon]" />
        <span class="dock-tip">{{ item.label }}</span>
      </a>

      <span class="dock-sep" aria-hidden="true" />

      <button type="button" class="dock-btn" aria-label="검색" @click="openSearch">
        <svg class="dock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="ICONS.search" />
        <span class="dock-tip">검색</span>
      </button>
      <button type="button" class="dock-btn" :aria-label="isDark ? '라이트 모드' : '다크 모드'" @click="toggleAppearance">
        <svg class="dock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="isDark ? ICONS.sun : ICONS.moon" />
        <span class="dock-tip">{{ isDark ? '라이트 모드' : '다크 모드' }}</span>
      </button>
      <button type="button" class="dock-btn dock-fold" aria-label="독 접기" @click="setCollapsed(true)">
        <svg class="dock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="ICONS.fold" />
        <span class="dock-tip">접기</span>
      </button>
    </div>

    <!-- 접힌 상태: 오른쪽 아래 동그란 버튼 하나 -->
    <button v-else key="fab" type="button" class="dock-fab" aria-label="메뉴 펼치기" @click="setCollapsed(false)">
      <svg class="dock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="ICONS.grid" />
      <span class="dock-tip">메뉴 펼치기</span>
    </button>
    </Transition>
  </nav>
</template>

<style scoped>
.dock-wrap {
  position: fixed;
  left: 0;
  right: 0;
  bottom: calc(16px + env(safe-area-inset-bottom, 0px));
  z-index: 25; /* 모바일 사이드바(64)·검색창보다 아래 */
  display: flex;
  justify-content: center;
  pointer-events: none;
  opacity: 0;
  transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.25s;
}
.dock-wrap.ready {
  opacity: 1;
}
/* 스크롤 중 자동 숨김: 화면 아래로 쏙 내려감 */
.dock-wrap.hidden {
  transform: translateY(calc(100% + 40px));
  opacity: 0;
}
.dock-wrap.hidden > * {
  pointer-events: none !important;
}
/* 접힌 상태: 오른쪽 아래로 */
.dock-wrap.collapsed {
  justify-content: flex-end;
  padding-right: 20px;
}
.dock-swap-enter-active,
.dock-swap-leave-active {
  transition: opacity 0.18s ease;
}
.dock-swap-enter-from,
.dock-swap-leave-to {
  opacity: 0;
}

.dock-fab {
  pointer-events: auto;
  position: relative;
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  padding: 0;
  border-radius: 50%;
  border: 1px solid var(--vp-c-divider);
  background: color-mix(in srgb, var(--vp-c-bg) 88%, transparent);
  -webkit-backdrop-filter: blur(16px) saturate(160%);
  backdrop-filter: blur(16px) saturate(160%);
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.25), 0 2px 6px rgba(0, 0, 0, 0.06);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.2s;
  -webkit-tap-highlight-color: transparent;
}
.dock-fab:hover {
  color: var(--vp-c-brand-1);
  transform: translateY(-2px) scale(1.06);
}
.dock-fab:active {
  transform: scale(0.94);
}
.dock-fab:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}
.dock-fab:hover .dock-tip,
.dock-fab:focus-visible .dock-tip {
  opacity: 1;
}
.dock-fab .dock-tip {
  left: auto;
  right: 0;
  transform: none;
}

.dock {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px;
  border-radius: 18px;
  border: 1px solid var(--vp-c-divider);
  background: color-mix(in srgb, var(--vp-c-bg) 88%, transparent);
  -webkit-backdrop-filter: blur(16px) saturate(160%);
  backdrop-filter: blur(16px) saturate(160%);
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.25), 0 2px 6px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.3s;
  animation: dock-float 4s ease-in-out infinite;
}
.dock:hover {
  box-shadow: 0 16px 40px -12px rgba(0, 0, 0, 0.35), 0 2px 8px rgba(0, 0, 0, 0.08);
}
@keyframes dock-float {
  0%, 100% { transform: translateY(-2px); }
  50% { transform: translateY(2px); }
}

.dock-btn {
  position: relative;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: var(--vp-c-text-2);
  cursor: pointer;
  text-decoration: none;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.2s, color 0.2s;
  -webkit-tap-highlight-color: transparent;
}
.dock-btn:hover {
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-1);
  transform: translateY(-2px) scale(1.1);
}
.dock-btn:active {
  transform: scale(0.95);
}
.dock-btn:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}
.dock-btn.active {
  color: var(--vp-c-brand-1);
}
.dock-btn.active::after {
  content: '';
  position: absolute;
  bottom: 3px;
  left: 50%;
  width: 4px;
  height: 4px;
  margin-left: -2px;
  border-radius: 50%;
  background: currentColor;
}
.dock-icon {
  width: 20px;
  height: 20px;
}

.dock-tip {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.3;
  white-space: nowrap;
  color: var(--vp-c-bg);
  background: var(--vp-c-text-1);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
}
.dock-btn:hover .dock-tip,
.dock-btn:focus-visible .dock-tip {
  opacity: 1;
}

.dock-fold {
  width: 30px;
  color: var(--vp-c-text-3);
}

.dock-sep {
  width: 1px;
  height: 24px;
  margin: 0 4px;
  background: var(--vp-c-divider);
}

/* 터치 기기: 호버 효과/툴팁 대신 눌림 효과만 */
@media (hover: none) {
  .dock-btn:hover {
    transform: none;
    background: transparent;
    color: var(--vp-c-text-2);
  }
  .dock-btn.active:hover { color: var(--vp-c-brand-1); }
  .dock-btn:hover .dock-tip { opacity: 0; }
  .dock-fab:hover { transform: none; color: var(--vp-c-text-2); }
  .dock-fab:hover .dock-tip { opacity: 0; }
  .dock-btn:active { background: var(--vp-c-default-soft); transform: scale(0.92); }
}

/* 모바일: 8개 아이콘이 한 줄에 들어가도록 축소 */
@media (max-width: 640px) {
  .dock-wrap { bottom: calc(12px + env(safe-area-inset-bottom, 0px)); }
  .dock { gap: 2px; padding: 6px; border-radius: 16px; }
  .dock-btn { width: 38px; height: 38px; border-radius: 10px; }
  .dock-fold { width: 26px; }
  .dock-icon { width: 19px; height: 19px; }
  .dock-sep { margin: 0 2px; height: 20px; }
  .dock-wrap.collapsed { padding-right: 16px; }
  .dock-fab { width: 44px; height: 44px; }
}
@media (max-width: 400px) {
  .dock-btn { width: 35px; height: 35px; }
  .dock-fold { width: 24px; }
  .dock-icon { width: 18px; height: 18px; }
}
@media (max-width: 350px) {
  .dock-btn { width: 31px; height: 31px; }
  .dock-fold { width: 22px; }
  .dock-icon { width: 16px; height: 16px; }
}

@media (prefers-reduced-motion: reduce) {
  .dock { animation: none; }
  .dock-btn,
  .dock-fab,
  .dock-wrap { transition: none; }
}
@media print {
  .dock-wrap { display: none; }
}
</style>
