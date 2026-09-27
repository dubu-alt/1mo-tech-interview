<script setup lang="ts">
// 홈 화면의 3x3 카테고리 목록
// 카드를 누르면 해당 분류의 첫 문서로 바로 이동한다 (모바일도 3열 유지)
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { categories, flattenLinks } from '../categories'

const { theme } = useData()

const items = computed(() => {
  const links = flattenLinks(theme.value.sidebar)
  return categories.map((c) => {
    const mine = links.filter(c.match)
    return { ...c, count: mine.length, href: mine[0] ? withBase(mine[0]) : withBase('/') }
  })
})

const total = computed(() => items.value.reduce((n, c) => n + c.count, 0))
</script>

<template>
  <section id="categories" class="cat-section">
    <div class="cat-inner">
    <div class="cat-head">
      <h2 class="cat-title">목록</h2>
      <span class="cat-total">문서 {{ total }}개</span>
    </div>
    <div class="cat-grid">
      <a v-for="c in items" :key="c.id" class="cat-card" :href="c.href">
        <span class="cat-icon" aria-hidden="true">{{ c.icon }}</span>
        <span class="cat-name">{{ c.title }}</span>
        <span class="cat-desc">{{ c.desc }}</span>
        <span class="cat-count">{{ c.count }}개 문서 <span class="cat-arrow">→</span></span>
      </a>
    </div>
    </div>
  </section>
</template>

<style scoped>
.cat-section {
  padding: 8px 24px 32px;
}
.cat-inner {
  max-width: 1152px;
  margin: 0 auto;
}
@media (min-width: 640px) {
  .cat-section { padding: 8px 48px 40px; }
}
@media (min-width: 960px) {
  .cat-section { padding: 8px 64px 48px; }
}
.cat-head {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 16px;
}
.cat-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}
.cat-total {
  font-size: 13px;
  color: var(--vp-c-text-3);
}
.cat-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}
.cat-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 22px;
  border-radius: 14px;
  border: 1px solid var(--vp-c-bg-soft);
  background: var(--vp-c-bg-soft);
  color: inherit;
  text-decoration: none;
  transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
  -webkit-tap-highlight-color: transparent;
}
.cat-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-3px);
  box-shadow: 0 10px 24px -12px rgba(0, 0, 0, 0.25);
}
.cat-card:active {
  transform: scale(0.97);
}
.cat-icon {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: var(--vp-c-default-soft);
  font-size: 24px;
  line-height: 1;
}
.cat-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  line-height: 1.4;
}
.cat-desc {
  flex: 1;
  font-size: 14px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}
.cat-count {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}
.cat-arrow {
  display: inline-block;
  transition: transform 0.25s;
}
.cat-card:hover .cat-arrow {
  transform: translateX(3px);
}

/* 태블릿 */
@media (max-width: 960px) {
  .cat-grid { gap: 12px; }
  .cat-card { padding: 16px; }
  .cat-desc { font-size: 13px; }
}

/* 모바일: 3열 유지, 정사각형에 가까운 컴팩트 카드 */
@media (max-width: 640px) {
  .cat-section { padding: 0 24px 24px; }
  .cat-inner { max-width: none; }
  .cat-head { margin-bottom: 12px; }
  .cat-title { font-size: 18px; }
  .cat-grid { gap: 8px; }
  .cat-card {
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 6px;
    padding: 14px 6px 12px;
    min-height: 108px;
    border-radius: 12px;
  }
  .cat-icon {
    width: 40px;
    height: 40px;
    font-size: 22px;
  }
  .cat-name {
    font-size: 13px;
    line-height: 1.3;
    word-break: keep-all;
  }
  .cat-desc,
  .cat-arrow { display: none; }
  .cat-count {
    font-size: 11px;
    font-weight: 500;
    color: var(--vp-c-text-3);
  }
}
@media (max-width: 360px) {
  .cat-section { padding: 0 16px 20px; }
  .cat-grid { gap: 6px; }
  .cat-name { font-size: 12px; }
}
</style>
