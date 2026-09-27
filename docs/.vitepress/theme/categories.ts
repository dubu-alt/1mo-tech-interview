// 홈 3x3 목록과 하단 독(Dock)이 함께 쓰는 카테고리 정의
// - 문서 개수와 첫 문서 링크는 config.mts의 sidebar에서 자동으로 계산한다
//   (새 문서를 sidebar에 추가하기만 하면 목록/독이 알아서 따라온다)

export interface Category {
  id: string
  icon: string
  title: string
  desc: string
  match: (link: string) => boolean
}

const under = (...prefixes: string[]) => (link: string) =>
  prefixes.some((p) => link.startsWith(p))

// 홈 화면 3x3 목록 (9칸)
export const categories: Category[] = [
  {
    id: 'web',
    icon: '🧩',
    title: '웹 기능 구현',
    desc: '반응형, 다크 모드, API 연동 등 포트폴리오 기능과 JS 설계',
    match: under('/web/features/'),
  },
  {
    id: 'css',
    icon: '🎨',
    title: 'CSS',
    desc: 'CSS 기초 문법부터 변수, Flexbox, Grid 설계까지',
    match: under('/web/css-basics/', '/web/css/'),
  },
  {
    id: 'python',
    icon: '🐍',
    title: 'Python',
    desc: 'argparse, dataclass, 제너레이터, 데코레이터',
    match: under('/language/'),
  },
  {
    id: 'os',
    icon: '🐧',
    title: '운영체제 · Linux',
    desc: '권한, 프로세스, 메모리, 데드락까지 실습 기반 OS 개념',
    match: under('/cs/os/'),
  },
  {
    id: 'ds',
    icon: '🗂️',
    title: '자료구조',
    desc: 'Redis를 직접 만들며 배운 해시맵, 힙, LRU, TTL',
    match: under('/cs/data-structure/'),
  },
  {
    id: 'db',
    icon: '🗄️',
    title: '데이터베이스',
    desc: 'SNS 서비스 설계, 키와 관계, 정규화, ERD, 조인',
    match: under('/cs/database/'),
  },
  {
    id: 'algo',
    icon: '🧮',
    title: '알고리즘',
    desc: 'Mini Git 구현: 그래프, DAG, 위상 정렬, BFS/DFS',
    match: (l) => l.startsWith('/algorithm/') && !l.startsWith('/algorithm/git-collaboration/'),
  },
  {
    id: 'git',
    icon: '🤝',
    title: 'Git 협업',
    desc: 'PR, 머지 전략, 브랜치 보호, 코드 리뷰, CI',
    match: under('/algorithm/git-collaboration/'),
  },
  {
    id: 'cloud',
    icon: '☁️',
    title: 'Cloud',
    desc: 'AWS 인프라, AI 커밋 메시지 생성기, Docker',
    match: under('/cloud/'),
  },
]

// 하단 독에 들어가는 큰 분류 (사이드바 최상위 그룹과 1:1)
export interface DockSection {
  id: string
  label: string
  icon: string // lucide 아이콘 이름 (Dock.vue의 ICONS 참고)
  match: (link: string) => boolean
}

export const dockSections: DockSection[] = [
  { id: 'web', label: 'Web', icon: 'globe', match: under('/web/') },
  { id: 'language', label: 'Language', icon: 'code', match: under('/language/') },
  { id: 'cs', label: 'Computer Science', icon: 'cpu', match: under('/cs/') },
  { id: 'algorithm', label: 'Algorithm', icon: 'branch', match: under('/algorithm/') },
  { id: 'cloud', label: 'Cloud', icon: 'cloud', match: under('/cloud/') },
]

// sidebar 트리를 평탄화해서 링크 목록만 뽑는다 (순서 유지)
export function flattenLinks(sidebar: unknown): string[] {
  const out: string[] = []
  const walk = (items: any[]) => {
    for (const it of items || []) {
      if (it?.link) out.push(it.link)
      if (Array.isArray(it?.items)) walk(it.items)
    }
  }
  if (Array.isArray(sidebar)) walk(sidebar)
  else if (sidebar && typeof sidebar === 'object') {
    for (const v of Object.values(sidebar as Record<string, any>)) {
      walk(Array.isArray(v) ? v : v?.items)
    }
  }
  return out
}

// URL 경로(인코딩됨, .html 포함 가능)를 sidebar 링크 형태로 맞춘다
export function normalizePath(path: string): string {
  let p = path
  try {
    p = decodeURI(p)
  } catch {}
  return p.replace(/\.html$/, '').replace(/\/index$/, '/')
}
