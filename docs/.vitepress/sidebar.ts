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
function itemsIn(dir: string): Item[] {
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

const groupOf = (text: string, children: Item[]): Item => ({ text, collapsed: true, items: children })

// 영어판 사이드바 묶음 이름 (영어 글은 docs/en/ 아래 같은 경로에 있다)
const EN_LABELS: Record<string, string> = {
  '웹 지식': 'Web Knowledge',
  '주요 기능': 'Features',
  '변수와 자료형': 'Variables & Types',
  '흐름 제어': 'Control Flow',
  '함수': 'Functions',
  '클래스와 객체': 'Classes & Objects',
  'CLI와 파일 입출력': 'CLI & File I/O',
  '데이터 분석': 'Data Analysis',
  '정렬': 'Sorting',
  '탐색': 'Searching',
  '그래프': 'Graphs',
  '동적 계획법 · 기법': 'DP & Techniques',
  'Mini Git 구현 (B5-2)': 'Building Mini Git (B5-2)',
  'Git 기초': 'Git Basics',
  '브랜치': 'Branches',
  '되돌리기': 'Undoing Changes',
  '원격 저장소': 'Remote Repositories',
  '협업 (B2-2)': 'Collaboration (B2-2)',
  'AWS 인프라': 'AWS Infrastructure',
  'LLM API 활용': 'Working with LLM APIs',
}

export function buildSidebar(locale: 'ko' | 'en' = 'ko'): Item[] {
  const en = locale === 'en'
  const items = (dir: string) => itemsIn(en ? `en/${dir}` : dir)
  const group = (text: string, children: Item[]): Item => groupOf(en ? EN_LABELS[text] ?? text : text, children)
  return [
    group('📌 Web', [
      group('웹 지식', items('web/knowledge')),
      group('주요 기능', items('web/features')),
      group('CSS', items('web/css')),
    ]),
    group('📌 Language', [
      group('Python', [
        group('변수와 자료형', items('language/python/basics')),
        group('흐름 제어', items('language/python/control-flow')),
        group('함수', items('language/python/functions')),
        group('클래스와 객체', items('language/python/classes')),
        group('CLI와 파일 입출력', items('language/python/cli-file')),
      ]),
    ]),
    group('📌 Computer Science', [
      group('Linux', items('cs/linux')),
      group('Computer Architecture', items('cs/computer-architecture')),
      group('Operating System', items('cs/os')),
      group('Data Structure', items('cs/data-structure')),
      group('Database', [
        ...items('cs/database'),
        group('데이터 분석', items('cs/database/data-analysis')),
      ]),
    ]),
    group('📌 Algorithm', [
      group('정렬', items('algorithm/sort')),
      group('탐색', items('algorithm/search')),
      group('그래프', items('algorithm/graph')),
      group('동적 계획법 · 기법', items('algorithm/dp')),
      group('Mini Git 구현 (B5-2)', items('algorithm/mini-git')),
    ]),
    group('📌 Git', [
      group('Git 기초', items('git/basics')),
      group('브랜치', items('git/branch')),
      group('되돌리기', items('git/undo')),
      group('원격 저장소', items('git/remote')),
      group('협업 (B2-2)', items('git/collaboration')),
    ]),
    group('📌 Cloud', [
      group('AWS 인프라', items('cloud/aws')),
      group('LLM API 활용', items('cloud/llm-api')),
      ...items('cloud'),
    ]),
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
