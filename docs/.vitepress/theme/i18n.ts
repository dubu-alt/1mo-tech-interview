// 한국어/영어 전환 도우미
// - 한국어 글은 docs/..., 영어 글은 docs/en/... (같은 파일 이름)
// - 처음 들어온 방문자는 브라우저 언어나 시간대가 한국이면 한국어, 아니면 영어로 자동 이동
// - 상단 KO/EN 버튼으로 바꾸면 그 선택을 기억하고, 다음부터는 자동 판단보다 선택을 따른다
import { computed } from 'vue'
import { useData } from 'vitepress'

export type Lang = 'ko' | 'en'
export const LANG_KEY = '1mo-lang'

export function useLang() {
  const { localeIndex } = useData()
  return computed<Lang>(() => (localeIndex.value === 'en' ? 'en' : 'ko'))
}

// '/en/cs/os/01-x.html' → '/cs/os/01-x.html'
export const stripLocale = (path: string) => path.replace(/^\/en(?=\/|$)/, '') || '/'

// 같은 글의 다른 언어 주소
export function pathFor(path: string, lang: Lang) {
  const base = stripLocale(path)
  return lang === 'en' ? (base === '/' ? '/en/' : `/en${base}`) : base
}

export const langOfPath = (path: string): Lang => (/^\/en(\/|$)/.test(path) ? 'en' : 'ko')

// 한국어를 쓰는 브라우저이거나 한국 시간대면 한국어
export function detectLang(): Lang {
  try {
    const langs = navigator.languages?.length ? navigator.languages : [navigator.language]
    if (langs.some((l) => /^ko\b/i.test(l || ''))) return 'ko'
    if (Intl.DateTimeFormat().resolvedOptions().timeZone === 'Asia/Seoul') return 'ko'
  } catch {}
  return 'en'
}

export function savedLang(): Lang | null {
  try {
    const v = localStorage.getItem(LANG_KEY)
    return v === 'ko' || v === 'en' ? v : null
  } catch {
    return null
  }
}

export function saveLang(lang: Lang) {
  try {
    localStorage.setItem(LANG_KEY, lang)
  } catch {}
}

// 화면 문구
const dict = {
  ko: {
    categories: '목록',
    docsTotal: (n: number) => `문서 ${n}개`,
    docsCount: (n: number) => `${n}개 문서`,
    home: '홈',
    quickNav: '빠른 이동',
    search: '검색',
    lightMode: '라이트 모드',
    darkMode: '다크 모드',
    foldDock: '독 접기',
    unfoldDock: '메뉴 펼치기',
    searchAnything: '무엇이든 검색해 보세요',
    goTo: (s: string) => `${s} 바로가기`,
    cancel: '취소',
    noResult: (q: string) => `‘${q}’에 대한 결과가 없어요`,
    searchLoading: '검색 준비 중…',
    move: '이동',
    open: '열기',
    close: '닫기',
    switchLang: 'English로 보기',
    adminLogin: '관리자 로그인',
  },
  en: {
    categories: 'Categories',
    docsTotal: (n: number) => `${n} docs`,
    docsCount: (n: number) => `${n} docs`,
    home: 'Home',
    quickNav: 'Quick navigation',
    search: 'Search',
    lightMode: 'Light mode',
    darkMode: 'Dark mode',
    foldDock: 'Collapse dock',
    unfoldDock: 'Expand menu',
    searchAnything: 'Search anything',
    goTo: (s: string) => `Go to ${s}`,
    cancel: 'Cancel',
    noResult: (q: string) => `No results for “${q}”`,
    searchLoading: 'Preparing search…',
    move: 'Move',
    open: 'Open',
    close: 'Close',
    switchLang: '한국어로 보기',
    adminLogin: 'Admin sign-in',
  },
}

export type Dict = typeof dict.ko

export function useT() {
  const lang = useLang()
  return computed<Dict>(() => dict[lang.value] as Dict)
}
