// 홈 3x3 목록과 하단 독(Dock)이 함께 쓰는 카테고리 정의
// - 문서 개수와 첫 문서 링크는 config.mts의 sidebar에서 자동으로 계산한다
//   (새 문서를 sidebar에 추가하기만 하면 목록/독이 알아서 따라온다)

import { stripLocale } from './i18n'

export interface Category {
  id: string
  icon: string
  title: string
  desc: string
  titleEn: string
  descEn: string
  match: (link: string) => boolean
}

// 영어 글(/en/...)도 같은 분류로 센다
const under = (...prefixes: string[]) => (link: string) =>
  prefixes.some((p) => stripLocale(link).startsWith(p))

// 홈 화면 3x3 목록 (9칸)
export const categories: Category[] = [
  {
    id: 'web',
    icon: '🧩',
    title: '웹 지식 · 기능 구현',
    desc: '브라우저 렌더링, HTTP, REST, 쿠키·세션, JWT, 웹 보안부터 포트폴리오 기능 구현까지',
    titleEn: 'Web Knowledge · Features',
    descEn: 'Browser rendering, HTTP, REST, cookies and sessions, JWT, web security, and building portfolio features',
    match: under('/web/knowledge/', '/web/features/'),
  },
  {
    id: 'css',
    icon: '🎨',
    title: 'CSS',
    desc: 'CSS 기초 문법부터 변수, Flexbox, Grid 설계까지',
    titleEn: 'CSS',
    descEn: 'From CSS basics to variables, Flexbox, and Grid layouts',
    match: under('/web/css/'),
  },
  {
    id: 'python',
    icon: '🐍',
    title: 'Python',
    desc: '기초 문법(자료형·조건문·함수·클래스)부터 argparse, 제너레이터까지',
    titleEn: 'Python',
    descEn: 'Basics (types, conditionals, functions, classes) to argparse and generators',
    match: under('/language/'),
  },
  {
    id: 'os',
    icon: '🐧',
    title: '컴퓨터 구조 · 운영체제 · Linux',
    desc: 'CPU와 캐시, 프로세스, 스케줄링, 메모리 관리, 데드락, 리눅스 실습',
    titleEn: 'Computer Architecture · OS · Linux',
    descEn: 'CPU and cache, processes, scheduling, memory management, deadlock, Linux practice',
    match: under('/cs/linux/', '/cs/os/', '/cs/computer-architecture/'),
  },
  {
    id: 'ds',
    icon: '🗂️',
    title: '자료구조',
    desc: 'Redis를 직접 만들며 배운 해시맵, 힙, LRU, TTL',
    titleEn: 'Data Structures',
    descEn: 'Hash maps, heaps, LRU, and TTL learned by building Redis',
    match: under('/cs/data-structure/'),
  },
  {
    id: 'db',
    icon: '🗄️',
    title: '데이터베이스 · 데이터 분석',
    desc: 'SNS 서비스 설계, 키와 관계, 정규화, ERD, 조인부터 NumPy·Pandas 데이터 분석까지',
    titleEn: 'Databases · Data Analysis',
    descEn: 'SNS service design, keys and relations, normalization, ERD, joins, and NumPy·Pandas data analysis',
    match: under('/cs/database/'),
  },
  {
    id: 'algo',
    icon: '🧮',
    title: '알고리즘',
    desc: '정렬 8가지, 이분 탐색, DFS/BFS, 다익스트라, DP부터 Mini Git 구현까지',
    titleEn: 'Algorithms',
    descEn: '8 sorting algorithms, binary search, DFS/BFS, Dijkstra, DP, and building Mini Git',
    match: under('/algorithm/'),
  },
  {
    id: 'git',
    icon: '🤝',
    title: 'Git',
    desc: 'reset, 브랜치, merge, rebase, stash부터 PR과 브랜치 전략까지',
    titleEn: 'Git',
    descEn: 'reset, branches, merge, rebase, stash, PRs and branching strategies',
    match: under('/git/'),
  },
  {
    id: 'cloud',
    icon: '☁️',
    title: 'Cloud',
    desc: 'AWS 인프라(VPC, 보안 그룹, IAM), LLM API 활용(키 관리, 마스킹, 출력 검증), Docker',
    titleEn: 'Cloud',
    descEn: 'AWS infrastructure (VPC, security groups, IAM), working with LLM APIs (key management, masking, output validation), Docker',
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
  { id: 'algorithm', label: 'Algorithm', icon: 'grid', match: under('/algorithm/') },
  { id: 'git', label: 'Git', icon: 'branch', match: under('/git/') },
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
