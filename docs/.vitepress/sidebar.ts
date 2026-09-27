// 사이드바 자동 생성
// 폴더 안의 .md 파일을 읽어서 사이드바를 만든다.
// - 관리자 페이지(/admin)에서 새 글을 쓰면 다음 배포 때 사이드바와 홈 목록에 자동으로 나타난다
// - 이름표: frontmatter의 sidebar → title → 본문 첫 번째 # 제목 → 파일 이름 순으로 사용
// - 정렬: 파일 이름 순 (숫자는 크기 순, 예: 2 < 10 < 20260927)
// - draft: true 인 글은 사이드바에서 숨김
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const DOCS = fileURLToPath(new URL('..', import.meta.url))

type Item = { text: string; link?: string; collapsed?: boolean; items?: Item[] }

function unquote(v: string): string {
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

// 간단한 frontmatter 읽기 (한 줄 값, 여러 줄로 접힌 값 >- | 모두 지원)
function readFrontmatter(src: string): Record<string, string> {
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(src)
  const out: Record<string, string> = {}
  if (!m) return out
  const lines = m[1].split(/\r?\n/)
  for (let i = 0; i < lines.length; i++) {
    const kv = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(lines[i])
    if (!kv) continue
    let value = kv[2]
    const cont: string[] = []
    while (i + 1 < lines.length && /^\s+\S/.test(lines[i + 1])) cont.push(lines[++i].trim())
    if (/^[>|][-+]?$/.test(value.trim())) value = cont.join(value.trim().startsWith('|') ? '\n' : ' ')
    else if (cont.length) value = [value, ...cont].join(' ')
    out[kv[1]] = unquote(value)
  }
  return out
}

function readMeta(file: string) {
  const src = fs.readFileSync(file, 'utf8')
  const fm = readFrontmatter(src)
  const h1 = /^#\s+(.+)$/m.exec(src.replace(/^---[\s\S]*?\n---/, ''))?.[1]?.trim()
  return {
    text: fm.sidebar || fm.title || h1 || path.basename(file, '.md'),
    draft: fm.draft === 'true',
  }
}

// 폴더 하나의 글 목록 (하위 폴더는 포함하지 않음)
function items(dir: string): Item[] {
  const abs = path.join(DOCS, dir)
  if (!fs.existsSync(abs)) return []
  return fs
    .readdirSync(abs)
    .filter((f) => f.endsWith('.md') && f !== 'index.md')
    .sort((a, b) => a.localeCompare(b, 'ko', { numeric: true }))
    .map((f) => ({ file: f, meta: readMeta(path.join(abs, f)) }))
    .filter(({ meta }) => !meta.draft)
    .map(({ file, meta }) => ({ text: meta.text, link: `/${dir}/${file.replace(/\.md$/, '')}` }))
}

const group = (text: string, children: Item[]): Item => ({ text, collapsed: true, items: children })

export function buildSidebar(): Item[] {
  return [
    group('📌 Web', [
      group('주요 기능', items('web/features')),
      group('CSS', items('web/css')),
    ]),
    group('📌 Language', items('language/python')),
    group('📌 Computer Science', [
      group('Linux', items('cs/linux')),
      group('Operating System', items('cs/os')),
      group('Data Structure', items('cs/data-structure')),
      group('Database', items('cs/database')),
    ]),
    group('📌 Algorithm', [
      group('Mini Git 구현', items('algorithm')),
      group('Git 협업 (B2-2)', items('algorithm/git-collaboration')),
    ]),
    group('📌 Cloud', items('cloud')),
  ]
}

// draft: true 인 글은 빌드에서도 제외 (사이트에 공개되지 않음)
export function draftFiles(): string[] {
  const out: string[] = []
  const walk = (rel: string) => {
    for (const e of fs.readdirSync(path.join(DOCS, rel), { withFileTypes: true })) {
      if (e.name.startsWith('.') || e.name === 'public') continue
      const r = rel ? `${rel}/${e.name}` : e.name
      if (e.isDirectory()) walk(r)
      else if (e.name.endsWith('.md') && readMeta(path.join(DOCS, r)).draft) out.push(r)
    }
  }
  walk('')
  return out
}
