---
title: 프롬프트 모음
sidebar: false
aside: false
---

<script setup>
import { ref, computed } from 'vue'
const query = ref('')
const topic = ref('전체')
const notice = ref('')
const cards = [
 ['면접','꼬리 질문까지 연습하기','[직무] 신입 면접관이 되어 [주제]에 관한 질문을 하나씩 해줘. 내 답을 기다린 뒤 구체성이 부족한 부분을 짚어 꼬리 질문을 해줘. 세 번 답한 뒤 개선 전후 답변을 비교해줘.'],
 ['면접','프로젝트 경험 다듬기','[프로젝트 경험]을 읽고 내가 내린 기술적 결정과 그 근거를 물어봐 줘. 내 답에 있는 사실만 사용해 1분 면접 답변을 구성해줘.'],
 ['개발','코드 리뷰 받기','[코드]의 의도를 한 문장으로 요약하고, 실패할 수 있는 입력 예시 하나를 들어줘. 먼저 내가 수정 방향을 생각하도록 질문하고 내 답을 기다려줘.'],
 ['개발','버그 원인 좁히기','기대 동작은 [기대 결과]이고 실제로는 [관찰 결과]가 나와. 가능한 원인을 두 가지로 좁히고 두 원인을 구별할 관찰 방법을 하나 알려줘.'],
 ['학습','개념을 내 말로 설명하기','[개념]을 일상 예시 하나와 개발 예시 하나로 설명해줘. 마지막에 이해 확인 질문을 하나 하고, 내가 답하면 틀린 부분만 짚어줘.'],
 ['학습','동료평가 리허설','[구현 요약]을 읽고 동료 평가자 역할을 해줘. 설계 이유, 예외 처리, 테스트 중 한 가지를 골라 질문하고 내가 답할 때까지 기다려줘.']
]
const topics = ['전체', ...new Set(cards.map(card => card[0]))]
const matches = computed(() => cards.filter(card => (topic.value === '전체' || topic.value === card[0]) && card.join(' ').includes(query.value.trim())))
async function copy(card) {
  try {
    await navigator.clipboard.writeText(card[2])
    notice.value = card[1] + ' 프롬프트를 복사했어요.'
  } catch {
    notice.value = '본문을 길게 누르거나 드래그해서 복사해 주세요.'
  }
}
</script>

# 프롬프트 모음

연습하고 싶은 상황을 고르고, 대괄호 안을 내 주제나 코드로 바꿔 사용하세요.

<div class="prompt-library">
<input v-model="query" type="search" aria-label="프롬프트 검색" placeholder="제목이나 내용으로 검색" />
<div class="filters"><button v-for="item in topics" :key="item" :aria-pressed="topic === item" @click="topic = item">{{ item }}</button></div>
<span role="status">{{ notice }}</span>
<div class="cards">
<article v-for="card in matches" :key="card[1]">
<small>{{ card[0] }}</small>
<h2>{{ card[1] }}</h2>
<p>{{ card[2] }}</p>
<button @click="copy(card)">프롬프트 복사</button>
</article>
</div>
<p v-if="!matches.length">검색 결과가 없어요. 다른 단어나 주제를 선택해 주세요.</p>
</div>

<style scoped>
.prompt-library input,.prompt-library article,.filters button {border:1px solid var(--vp-c-divider);border-radius:12px}
.prompt-library input {width:100%;padding:12px 16px;background:var(--vp-c-bg-soft)}
.filters {display:flex;gap:8px;flex-wrap:wrap;margin:16px 0}
.filters button,.cards button {padding:5px 14px}
.filters button[aria-pressed=true],.cards button {background:var(--vp-c-brand-soft);color:var(--vp-c-brand-1)}
.cards {display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:16px;margin-top:16px}
.cards article {display:flex;flex-direction:column;padding:20px;background:var(--vp-c-bg-soft)}
.cards small {color:var(--vp-c-brand-1)}
.cards h2 {margin:8px 0;border:0;padding:0;font-size:1.2rem}
.cards button {margin-top:auto;align-self:flex-start;border-radius:8px}
</style>
