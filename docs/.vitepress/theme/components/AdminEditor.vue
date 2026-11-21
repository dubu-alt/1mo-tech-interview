<script setup lang="ts">
// 페이지 위에서 바로 글을 고치거나 새로 쓰는 편집 창
// - 저장하면 GitHub 저장소(main)에 바로 커밋되고 1~2분 뒤 사이트에 반영된다
// - 커밋 메시지는 관리자 페이지와 같은 규칙: "docs: <파일이름> 글 수정/추가"
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { buildDoc, editor, newFileName, parseDoc, readFile, uploadImage, writeFile, REPO, type Doc } from '../admin'

const doc = ref<Doc>({ title: '', sidebar: '', draft: false, extra: [], body: '' })
const original = ref('')
const sha = ref<string | undefined>()
const path = ref(editor.value?.path || '')
const mode = ref(editor.value?.mode || 'edit')
const loading = ref(true)
const saving = ref(false)
const uploading = ref(false)
const error = ref('')
const savedMsg = ref('')
const view = ref<'edit' | 'split' | 'preview'>(typeof window !== 'undefined' && window.innerWidth >= 1100 ? 'split' : 'edit')
const area = ref<HTMLTextAreaElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const dirty = computed(() => buildDoc(doc.value) !== original.value)
const fileName = computed(() => path.value.split('/').pop()?.replace(/\.md$/, '') || '')

// 미리보기: 처음 열 때만 markdown-it을 불러온다 (사이트 첫 화면 속도에 영향 없음)
let md: any = null
const previewHtml = ref('')
async function renderPreview() {
  if (view.value === 'edit') return
  if (!md) {
    const MarkdownIt = (await import('markdown-it')).default
    md = new MarkdownIt({ html: true, linkify: true })
  }
  previewHtml.value = md.render(`# ${doc.value.title || '(제목 없음)'}\n\n${doc.value.body}`)
}
let timer: any
function schedulePreview() {
  clearTimeout(timer)
  timer = setTimeout(renderPreview, 200)
}

onMounted(async () => {
  document.documentElement.classList.add('sl-lock')
  window.addEventListener('keydown', onKey)
  try {
    if (mode.value === 'edit') {
      const f = await readFile(path.value)
      if (!f) throw new Error('GitHub에서 이 글을 찾지 못했어요. 파일 이름이 바뀌었을 수 있어요.')
      sha.value = f.sha
      doc.value = parseDoc(f.text)
    }
    original.value = mode.value === 'edit' ? buildDoc(doc.value) : ''
  } catch (e: any) {
    error.value = e?.message || '글을 불러오지 못했어요.'
  } finally {
    loading.value = false
    renderPreview()
  }
})
onBeforeUnmount(() => {
  document.documentElement.classList.remove('sl-lock')
  window.removeEventListener('keydown', onKey)
})

function onKey(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
    e.preventDefault()
    save()
  } else if (e.key === 'Escape') {
    close()
  }
}

function close() {
  if (saving.value) return
  if (dirty.value && !confirm('저장하지 않은 내용이 있어요. 닫을까요?')) return
  editor.value = null
}

function onTab(e: KeyboardEvent) {
  const el = e.target as HTMLTextAreaElement
  e.preventDefault()
  const { selectionStart: s, selectionEnd: t } = el
  doc.value.body = doc.value.body.slice(0, s) + '  ' + doc.value.body.slice(t)
  nextTick(() => el.setSelectionRange(s + 2, s + 2))
}

function insertAtCursor(text: string) {
  const el = area.value
  const s = el?.selectionStart ?? doc.value.body.length
  const t = el?.selectionEnd ?? s
  doc.value.body = doc.value.body.slice(0, s) + text + doc.value.body.slice(t)
  schedulePreview()
  nextTick(() => {
    el?.focus()
    el?.setSelectionRange(s + text.length, s + text.length)
  })
}

async function onImage(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0]
  if (!f) return
  uploading.value = true
  error.value = ''
  try {
    const url = await uploadImage(f)
    insertAtCursor(`\n![${f.name.replace(/\.[^.]+$/, '')}](${url})\n`)
  } catch (err: any) {
    error.value = err?.message || '이미지를 올리지 못했어요.'
  } finally {
    uploading.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

async function save() {
  if (saving.value || loading.value) return
  error.value = ''
  savedMsg.value = ''
  if (!doc.value.title.trim()) {
    error.value = '제목을 입력해 주세요.'
    return
  }
  if (mode.value === 'edit' && !dirty.value) {
    savedMsg.value = '바뀐 내용이 없어요.'
    return
  }
  saving.value = true
  try {
    if (mode.value === 'new') path.value = `docs/${editor.value?.folder}/${newFileName(doc.value.title)}`
    const text = buildDoc(doc.value)
    const verb = mode.value === 'new' ? '추가' : '수정'
    const r = await writeFile(path.value, text, `docs: ${fileName.value} 글 ${verb}`, sha.value)
    sha.value = r.sha
    original.value = text
    mode.value = 'edit'
    savedMsg.value = `저장했어요. 1~2분 뒤 사이트에 반영돼요.`
  } catch (e: any) {
    error.value = e?.message || '저장하지 못했어요.'
  } finally {
    saving.value = false
  }
}

const sitePath = computed(() => '/' + path.value.replace(/^docs\//, '').replace(/\.md$/, ''))
</script>

<template>
  <Teleport to="body">
    <div class="ae-overlay" @click.self="close">
      <div class="ae" role="dialog" aria-label="글 편집">
        <header class="ae-head">
          <strong>{{ mode === 'new' ? '새 글 쓰기' : '글 수정' }}</strong>
          <span class="ae-path">{{ mode === 'new' ? `docs/${editor?.folder}/` : path }}</span>
          <span class="ae-grow" />
          <div class="ae-tabs">
            <button type="button" :class="{ on: view === 'edit' }" @click="view = 'edit'">편집</button>
            <button type="button" :class="{ on: view === 'split' }" @click="view = 'split'; renderPreview()">나란히</button>
            <button type="button" :class="{ on: view === 'preview' }" @click="view = 'preview'; renderPreview()">미리보기</button>
          </div>
          <button type="button" class="ae-ghost" @click="close">닫기</button>
          <button type="button" class="ae-primary" :disabled="saving || loading" @click="save">
            {{ saving ? '저장 중…' : '저장' }}
          </button>
        </header>

        <div v-if="loading" class="ae-msg">글을 불러오는 중…</div>
        <template v-else>
          <div class="ae-meta">
            <label class="ae-field ae-title">
              <span>제목</span>
              <input v-model="doc.title" placeholder="페이지 맨 위 제목" @input="schedulePreview" />
            </label>
            <label class="ae-field">
              <span>사이드바 이름 (선택)</span>
              <input v-model="doc.sidebar" placeholder="비워 두면 제목을 그대로 써요" />
            </label>
            <label class="ae-check">
              <input v-model="doc.draft" type="checkbox" />
              <span>비공개 (임시저장)</span>
            </label>
          </div>

          <div class="ae-status">
            <span v-if="error" class="ae-error">{{ error }}</span>
            <span v-else-if="savedMsg" class="ae-ok">
              {{ savedMsg }}
              <a :href="`https://github.com/${REPO}/actions`" target="_blank" rel="noopener">배포 상태</a>
              <a v-if="!doc.draft" :href="sitePath" target="_blank" rel="noopener">글 보기</a>
            </span>
            <span v-else-if="dirty" class="ae-dirty">저장하지 않은 변경이 있어요 (⌘/Ctrl + S로 저장)</span>
            <span class="ae-grow" />
            <button type="button" class="ae-ghost ae-small" :disabled="uploading" @click="fileInput?.click()">
              {{ uploading ? '이미지 올리는 중…' : '이미지 넣기' }}
            </button>
            <input ref="fileInput" type="file" accept="image/*" hidden @change="onImage" />
          </div>

          <div class="ae-body" :class="view">
            <textarea
              v-show="view !== 'preview'"
              ref="area"
              v-model="doc.body"
              spellcheck="false"
              placeholder="## 소제목부터 쓰면 돼요. 제목(#)은 위 칸에 적어요."
              @input="schedulePreview"
              @keydown.tab="onTab"
            />
            <div v-show="view !== 'edit'" class="ae-preview vp-doc" v-html="previewHtml" />
          </div>
        </template>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.ae-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: stretch;
  justify-content: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.5);
  z-index: 300;
}
.ae {
  display: flex;
  flex-direction: column;
  width: min(1400px, 100%);
  border-radius: 16px;
  background: var(--vp-c-bg);
  box-shadow: var(--vp-shadow-5);
  overflow: hidden;
}
.ae-head,
.ae-meta,
.ae-status {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--vp-c-divider);
}
.ae-path {
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  color: var(--vp-c-text-3);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 40vw;
}
.ae-grow {
  flex: 1;
}
.ae-tabs {
  display: flex;
  padding: 2px;
  border-radius: 10px;
  background: var(--vp-c-default-soft);
}
.ae-tabs button {
  padding: 5px 10px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 13px;
  cursor: pointer;
}
.ae-tabs button.on {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}
.ae-ghost,
.ae-primary {
  padding: 7px 14px;
  border-radius: 10px;
  font-size: 14px;
  cursor: pointer;
}
.ae-ghost {
  border: 1px solid var(--vp-c-divider);
  background: transparent;
  color: var(--vp-c-text-1);
}
.ae-small {
  padding: 4px 10px;
  font-size: 13px;
}
.ae-primary {
  border: 0;
  background: var(--vp-c-brand-1);
  color: #fff;
}
.ae-primary:disabled,
.ae-ghost:disabled {
  opacity: 0.6;
}
.ae-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: var(--vp-c-text-2);
}
.ae-title {
  flex: 1;
  min-width: 260px;
}
.ae-field input {
  padding: 8px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 15px;
}
.ae-field input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}
.ae-check {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--vp-c-text-2);
}
.ae-status {
  padding: 8px 16px;
  font-size: 13px;
}
.ae-error {
  color: var(--vp-c-danger-1);
}
.ae-ok {
  color: var(--vp-c-green-1, #18794e);
}
.ae-ok a {
  margin-left: 8px;
}
.ae-dirty {
  color: var(--vp-c-warning-1);
}
.ae-msg {
  padding: 40px;
  text-align: center;
  color: var(--vp-c-text-2);
}
.ae-body {
  flex: 1;
  display: flex;
  min-height: 0;
}
.ae-body textarea {
  flex: 1;
  min-width: 0;
  padding: 16px;
  border: 0;
  resize: none;
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
  font-family: var(--vp-font-family-mono);
  font-size: 14px;
  line-height: 1.7;
}
.ae-body textarea:focus {
  outline: none;
}
.ae-preview {
  flex: 1;
  min-width: 0;
  padding: 16px 24px;
  overflow: auto;
}
.ae-body.split textarea {
  border-right: 1px solid var(--vp-c-divider);
}
@media (max-width: 768px) {
  .ae-overlay {
    padding: 0;
  }
  .ae {
    border-radius: 0;
  }
  .ae-path {
    display: none;
  }
}
</style>
