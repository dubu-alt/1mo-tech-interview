<script setup lang="ts">
// 상단 KO / EN 전환 버튼
// - 누르면 같은 글의 다른 언어 페이지로 이동하고, 그 선택을 기억한다 (자동 판단보다 우선)
// - 그 언어로 된 글이 아직 없으면 그 언어의 홈으로 간다
import { useRoute, useRouter, withBase } from 'vitepress'
import { pathFor, saveLang, useLang, useT, type Lang } from '../i18n'
import { exists } from '../langRoute'

const route = useRoute()
const router = useRouter()
const lang = useLang()
const t = useT()

async function switchTo(target: Lang) {
  saveLang(target)
  if (target === lang.value) return
  const next = pathFor(route.path, target)
  router.go(withBase((await exists(next)) ? next : target === 'en' ? '/en/' : '/'))
}
</script>

<template>
  <div class="nl" role="group" aria-label="Language">
    <button type="button" :class="{ on: lang === 'ko' }" :aria-pressed="lang === 'ko'" title="한국어" @click="switchTo('ko')">KO</button>
    <button type="button" :class="{ on: lang === 'en' }" :aria-pressed="lang === 'en'" title="English" @click="switchTo('en')">EN</button>
  </div>
</template>

<style scoped>
.nl {
  display: flex;
  align-items: center;
  margin-left: 12px;
  padding: 2px;
  border-radius: 999px;
  background: var(--vp-c-default-soft);
}
.nl button {
  padding: 3px 9px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;
}
.nl button.on {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12);
}
</style>
