<script setup lang="ts">
// 화면 하단에 떠 있는 독(Dock) 내비게이션
// 21st.dev의 "Dock" (anurag-mishra22/dock-two, MIT) 디자인을 참고해 Vue + CSS로 옮긴 것
// - 둥실 떠 있는 애니메이션, 호버 시 살짝 커지며 위로 올라가는 아이콘, 라벨 툴팁
// - 현재 보고 있는 분류는 점(•)으로 표시
import { computed, inject } from 'vue'
import { useData, useRoute, withBase } from 'vitepress'
import { dockSections, flattenLinks, normalizePath } from '../categories'

const { theme, isDark } = useData()
const route = useRoute()

// lucide 아이콘 (ISC/MIT) path 데이터
const ICONS: Record<string, string> = {
  home: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
  cpu: '<rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/>',
  branch: '<line x1="6" x2="6" y1="3" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>',
  cloud: '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
}

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

// VitePress 기본 검색(⌘K) 창 열기
function openSearch() {
  const btn = document.querySelector<HTMLButtonElement>('.VPNavBarSearch button, #local-search button')
  if (btn) btn.click()
  else window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, ctrlKey: true }))
}

// VitePress 기본 다크 모드 토글 재사용 (전환 애니메이션 포함)
const toggleAppearance = inject<() => void>('toggle-appearance', () => {
  isDark.value = !isDark.value
})
</script>

<template>
  <nav class="dock-wrap" aria-label="빠른 이동">
    <div class="dock">
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
    </div>
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
  .dock-btn:active { background: var(--vp-c-default-soft); transform: scale(0.92); }
}

/* 모바일: 8개 아이콘이 한 줄에 들어가도록 축소 */
@media (max-width: 640px) {
  .dock-wrap { bottom: calc(12px + env(safe-area-inset-bottom, 0px)); }
  .dock { gap: 2px; padding: 6px; border-radius: 16px; }
  .dock-btn { width: 38px; height: 38px; border-radius: 10px; }
  .dock-icon { width: 19px; height: 19px; }
  .dock-sep { margin: 0 2px; height: 20px; }
}
@media (max-width: 350px) {
  .dock-btn { width: 33px; height: 33px; }
  .dock-icon { width: 17px; height: 17px; }
}

@media (prefers-reduced-motion: reduce) {
  .dock { animation: none; }
  .dock-btn { transition: none; }
}
@media print {
  .dock-wrap { display: none; }
}
</style>
