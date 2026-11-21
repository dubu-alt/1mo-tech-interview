// 사이트 안 관리자 모드
// - 관리자 페이지(/admin, Sveltia CMS)와 같은 로그인 정보(localStorage 'sveltia-cms.user')를 함께 쓴다
//   → 사이트에서 로그인하면 /admin도 로그인된 상태가 되고, 반대도 마찬가지
// - 글을 읽고 저장할 때는 GitHub API로 저장소(main)에 바로 커밋한다
//   → GitHub Actions가 1~2분 안에 사이트에 다시 배포한다
import { computed, ref } from 'vue'

export const REPO = 'dubu-alt/1mo-tech-interview'
export const BRANCH = 'main'
const KEY = 'sveltia-cms.user'

export interface AdminUser {
  login: string
  name?: string
  avatarURL?: string
  token: string
}

export const adminUser = ref<AdminUser | null>(null)
export const isAdmin = computed(() => !!adminUser.value)

// 편집 창 상태 (상단 바와 편집 창이 함께 쓴다)
export const editor = ref<{ mode: 'edit' | 'new'; path: string; folder: string } | null>(null)

export function loadAdmin() {
  try {
    const raw = localStorage.getItem(KEY)
    const u = raw ? JSON.parse(raw) : null
    adminUser.value = u?.token ? u : null
  } catch {
    adminUser.value = null
  }
}

let watching = false
// 다른 탭(예: /admin)에서 로그인하거나 로그아웃하면 따라간다
export function watchAdmin() {
  if (watching) return
  watching = true
  window.addEventListener('storage', (e) => {
    if (e.key === KEY || e.key === null) loadAdmin()
  })
}

async function gh(path: string, init: RequestInit = {}, token = adminUser.value?.token) {
  const res = await fetch(`https://api.github.com${path}`, {
    ...init,
    cache: 'no-store',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(init.headers || {}),
    },
  })
  if (res.status === 401 && token === adminUser.value?.token) {
    logout()
    throw new Error('로그인이 만료됐어요. 다시 로그인해 주세요.')
  }
  return res
}

export async function login(rawToken: string) {
  const token = rawToken.trim()
  if (!token) throw new Error('토큰을 입력해 주세요.')
  const u = await gh('/user', {}, token)
  if (!u.ok) throw new Error('토큰이 올바르지 않아요. 다시 확인해 주세요.')
  const user = await u.json()
  const r = await gh(`/repos/${REPO}`, {}, token)
  const repo = r.ok ? await r.json() : null
  if (!repo?.permissions?.push) throw new Error('이 토큰으로는 글을 저장할 수 없어요. 저장소 쓰기(Contents) 권한이 필요해요.')
  // /admin(Sveltia CMS)이 저장하는 형식과 같게 저장한다
  const saved = {
    backendName: 'github',
    id: user.id,
    name: user.name || user.login,
    login: user.login,
    email: user.email || '',
    avatarURL: user.avatar_url,
    profileURL: user.html_url,
    bot: false,
    token,
  }
  localStorage.setItem(KEY, JSON.stringify(saved))
  adminUser.value = saved
}

export function logout() {
  localStorage.removeItem(KEY)
  adminUser.value = null
  editor.value = null
}

const encodePath = (p: string) => p.split('/').map(encodeURIComponent).join('/')

function b64decode(b64: string) {
  const bin = atob(b64.replace(/\n/g, ''))
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)))
}
function b64encode(text: string) {
  const bytes = new TextEncoder().encode(text)
  let bin = ''
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  return btoa(bin)
}

export async function readFile(path: string): Promise<{ text: string; sha: string } | null> {
  const res = await gh(`/repos/${REPO}/contents/${encodePath(path)}?ref=${BRANCH}`)
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`글을 불러오지 못했어요. (GitHub 응답 ${res.status})`)
  const j = await res.json()
  return { text: b64decode(j.content), sha: j.sha }
}

export async function writeFile(path: string, text: string, message: string, sha?: string) {
  const res = await gh(`/repos/${REPO}/contents/${encodePath(path)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, content: b64encode(text), branch: BRANCH, ...(sha ? { sha } : {}) }),
  })
  if (res.status === 409 || (res.status === 422 && sha)) {
    throw new Error('그사이 다른 곳(관리자 페이지 등)에서 이 글이 바뀌었어요. 창을 닫고 다시 열어 최신 내용으로 수정해 주세요.')
  }
  if (res.status === 422 && !sha) throw new Error('같은 이름의 글이 이미 있어요. 제목을 바꿔 주세요.')
  if (!res.ok) throw new Error(`저장하지 못했어요. (GitHub 응답 ${res.status})`)
  const j = await res.json()
  return { sha: j.content?.sha as string, commitUrl: j.commit?.html_url as string }
}

// ───────── frontmatter 읽기/쓰기 (title, sidebar, draft만 편집하고 나머지 줄은 그대로 둔다) ─────────
export interface Doc {
  title: string
  sidebar: string
  draft: boolean
  extra: string[]
  body: string
}

function unquote(v: string) {
  const s = v.trim()
  if (s.startsWith('"')) {
    try {
      return JSON.parse(s)
    } catch {
      return s.slice(1, -1)
    }
  }
  if (s.startsWith("'")) return s.slice(1, -1).replace(/''/g, "'")
  return s
}

export function parseDoc(text: string): Doc {
  const m = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/.exec(text)
  const doc: Doc = { title: '', sidebar: '', draft: false, extra: [], body: text }
  if (!m) return doc
  doc.body = text.slice(m[0].length).replace(/^(\r?\n)+/, '')
  const lines = m[1].split(/\r?\n/)
  for (let i = 0; i < lines.length; i++) {
    const kv = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(lines[i])
    const block = [lines[i]]
    while (i + 1 < lines.length && /^\s+\S/.test(lines[i + 1])) block.push(lines[++i])
    if (kv && block.length === 1 && kv[1] === 'title') doc.title = unquote(kv[2])
    else if (kv && block.length === 1 && kv[1] === 'sidebar') doc.sidebar = unquote(kv[2])
    else if (kv && block.length === 1 && kv[1] === 'draft') doc.draft = kv[2].trim() === 'true'
    else doc.extra.push(...block)
  }
  return doc
}

export function buildDoc(d: Doc) {
  const fm = [`title: ${JSON.stringify(d.title.trim())}`]
  if (d.sidebar.trim()) fm.push(`sidebar: ${JSON.stringify(d.sidebar.trim())}`)
  if (d.draft) fm.push('draft: true')
  fm.push(...d.extra)
  return `---\n${fm.join('\n')}\n---\n\n${d.body.replace(/^\s*\n/, '').replace(/\s*$/, '')}\n`
}

// 새 글 파일 이름: 관리자 페이지와 같은 규칙 (날짜-제목, 한글 유지)
export function newFileName(title: string) {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  const slug = title
    .trim()
    .replace(/[\s/\\?%*:|"<>#.,!'()[\]{}]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}-${slug}.md`
}

// 이미지 올리기: 관리자 페이지와 같은 곳(docs/public/images)에 저장하고, 글에 넣을 주소(/images/...)를 돌려준다
export async function uploadImage(file: File) {
  const buf = new Uint8Array(await file.arrayBuffer())
  let bin = ''
  for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode(...buf.subarray(i, i + 0x8000))
  const ext = (/\.[a-z0-9]+$/i.exec(file.name)?.[0] || '.png').toLowerCase()
  const base = file.name.replace(/\.[^.]+$/, '').replace(/[^\w가-힣-]+/g, '-').replace(/^-+|-+$/g, '') || 'image'
  const name = `${base}-${Date.now().toString(36)}${ext}`
  const path = `docs/public/images/${name}`
  const res = await gh(`/repos/${REPO}/contents/${encodePath(path)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: `docs: 이미지 업로드 (${path})`, content: btoa(bin), branch: BRANCH }),
  })
  if (!res.ok) throw new Error(`이미지를 올리지 못했어요. (GitHub 응답 ${res.status})`)
  return `/images/${name}`
}
