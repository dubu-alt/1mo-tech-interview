<script setup lang="ts">
// 상단 내비게이션의 검색 버튼
// VitePress 기본 VPNavBarSearch를 대체한다 (config.mts의 vite alias 참고)
// 누르면 Spotlight 검색창이 열린다
import { onMounted, ref } from 'vue'
import { ICONS } from '../icons'
import { openSpotlight } from '../spotlight'

const mod = ref('⌘')
onMounted(() => {
  if (!/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)) mod.value = 'Ctrl'
})
</script>

<template>
  <div class="VPNavBarSearch">
    <button type="button" class="ns-btn" aria-label="검색" @click="openSpotlight">
      <svg class="ns-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="ICONS.search" />
      <span class="ns-text">검색</span>
      <span class="ns-keys"><kbd>{{ mod }}</kbd><kbd>K</kbd></span>
    </button>
  </div>
</template>

<style>
.VPNavBarSearch {
  display: flex;
  align-items: center;
}
@media (min-width: 768px) {
  .VPNavBarSearch {
    flex-grow: 1;
    padding-left: 24px;
  }
}
@media (min-width: 960px) {
  .VPNavBarSearch {
    padding-left: 32px;
  }
}
</style>

<style scoped>
.ns-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 40px;
  height: 55px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: color 0.25s, border-color 0.25s, background-color 0.25s;
}
.ns-btn:hover {
  color: var(--vp-c-text-1);
}
.ns-icon {
  width: 18px;
  height: 18px;
  flex: none;
}
.ns-text,
.ns-keys {
  display: none;
}

@media (min-width: 768px) {
  .ns-btn {
    justify-content: flex-start;
    width: auto;
    min-width: 176px;
    height: 40px;
    padding: 0 8px 0 14px;
    border-radius: 999px;
    border: 1px solid transparent;
    background: var(--vp-c-bg-alt);
  }
  .ns-btn:hover {
    border-color: var(--vp-c-brand-1);
    background: var(--vp-c-bg-alt);
  }
  .ns-icon {
    width: 16px;
    height: 16px;
  }
  .ns-text {
    display: inline;
    font-size: 13px;
    font-weight: 500;
  }
  .ns-keys {
    display: inline-flex;
    gap: 2px;
    margin-left: auto;
    padding-left: 16px;
  }
  .ns-keys kbd {
    min-width: 20px;
    padding: 0 5px;
    border-radius: 6px;
    border: 1px solid var(--vp-c-divider);
    background: var(--vp-c-bg);
    font-family: inherit;
    font-size: 11px;
    line-height: 20px;
    color: var(--vp-c-text-3);
  }
}
</style>
