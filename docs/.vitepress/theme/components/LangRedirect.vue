<script setup lang="ts">
// 처음 들어온 페이지의 언어가 방문자와 맞지 않으면 같은 글의 다른 언어 페이지로 옮긴다
// - 기억된 선택(KO/EN 버튼)이 있으면 그것을, 없으면 브라우저 언어·시간대로 판단 (한국 → 한국어, 그 외 → 영어)
// - 사이트 안에서 링크를 따라 이동할 때는 다시 판단하지 않는다 (처음 한 번만)
// - 옮길 언어의 글이 아직 없으면 그대로 둔다
import { onMounted } from 'vue'
import { useRoute, useRouter, withBase } from 'vitepress'
import { detectLang, langOfPath, pathFor, savedLang } from '../i18n'
import { exists } from '../langRoute'

const route = useRoute()
const router = useRouter()

onMounted(async () => {
  // 검색엔진 로봇은 옮기지 않는다
  if (/bot|crawler|spider|crawling/i.test(navigator.userAgent)) return
  const want = savedLang() ?? detectLang()
  const now = langOfPath(route.path)
  if (want === now) return
  const next = pathFor(route.path, want)
  if (await exists(next)) router.go(withBase(next) + location.hash)
})
</script>

<template><span hidden /></template>
