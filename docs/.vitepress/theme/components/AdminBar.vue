<script setup lang="ts">
// 로그인한 관리자에게만 글 맨 위에 보이는 도구 막대
// - 이 글 수정: 페이지 위에서 바로 편집하고 저장 (GitHub에 커밋)
// - 이 분류에 새 글: 지금 보고 있는 글과 같은 폴더에 새 글 쓰기
// - 관리자 페이지에서 열기: /admin 에서 같은 글 열기 (서식 편집, 이미지 관리 등)
import { computed, onMounted } from 'vue'
import { useData } from 'vitepress'
import { editor, isAdmin, loadAdmin } from '../admin'
import AdminEditor from './AdminEditor.vue'

const { page, frontmatter, theme } = useData()

onMounted(loadAdmin)

const file = computed(() => page.value.relativePath) // 예: cs/database/02-키.md
const folder = computed(() => file.value.split('/').slice(0, -1).join('/'))
const slug = computed(() => file.value.split('/').pop()?.replace(/\.md$/, '') || '')
const show = computed(() => isAdmin.value && !!file.value && frontmatter.value.layout !== 'home' && !page.value.isNotFound)
const cmsLink = computed(() => {
  const col = (theme.value as any).adminCollections?.[folder.value]
  return col ? `/admin/#/collections/${col}/entries/${encodeURIComponent(slug.value)}` : '/admin/'
})

function edit() {
  editor.value = { mode: 'edit', path: `docs/${file.value}`, folder: folder.value }
}
function create() {
  editor.value = { mode: 'new', path: '', folder: folder.value }
}
</script>

<template>
  <div v-if="show" class="ab">
    <span class="ab-label">관리자</span>
    <button type="button" class="ab-btn ab-main" @click="edit">이 글 수정</button>
    <button type="button" class="ab-btn" @click="create">이 분류에 새 글</button>
    <a class="ab-btn" :href="cmsLink" target="_blank" rel="noopener">관리자 페이지에서 열기</a>
  </div>
  <AdminEditor v-if="editor" />
</template>

<style scoped>
.ab {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  padding: 8px 10px;
  border: 1px dashed var(--vp-c-brand-1);
  border-radius: 12px;
  background: var(--vp-c-brand-soft);
}
.ab-label {
  margin-right: 4px;
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}
.ab-btn {
  padding: 5px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 13px;
  text-decoration: none;
  cursor: pointer;
}
.ab-btn:hover {
  border-color: var(--vp-c-brand-1);
}
.ab-main {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-1);
  color: #fff;
}
</style>
