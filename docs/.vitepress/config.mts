import fs from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitepress'
import { buildSidebar, draftFiles } from './sidebar'

// 관리자 페이지(/admin) 설정에서 "폴더 → 분류 이름"을 읽는다
// 사이트의 "관리자 페이지에서 열기" 버튼이 같은 글을 /admin 에서 바로 열 때 쓴다
function adminCollections(): Record<string, string> {
  const src = fs.readFileSync(fileURLToPath(new URL('../public/admin/config.yml', import.meta.url)), 'utf8')
  const out: Record<string, string> = {}
  let name = ''
  for (const line of src.split('\n')) {
    const n = /^\s*- name:\s*(\S+)/.exec(line)
    if (n) name = n[1]
    const f = /^\s*folder:\s*docs\/(\S+)/.exec(line)
    if (f && name) out[f[1]] = name
  }
  return out
}

// 한국어 글 ↔ 영어 글 주소 (검색엔진에 두 언어판이 있다고 알려 준다)
function altLinks(relativePath: string) {
  const ko = relativePath.replace(/^en\//, '')
  const toUrl = (p: string) => 'https://1mo.dev/' + p.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '.html')
  const koPath = fileURLToPath(new URL(`../${ko}`, import.meta.url))
  const enPath = fileURLToPath(new URL(`../en/${ko}`, import.meta.url))
  if (!fs.existsSync(koPath) || !fs.existsSync(enPath)) return []
  return [
    ['link', { rel: 'alternate', hreflang: 'ko', href: toUrl(ko) }],
    ['link', { rel: 'alternate', hreflang: 'en', href: toUrl(`en/${ko}`) }],
    ['link', { rel: 'alternate', hreflang: 'x-default', href: toUrl(ko) }],
  ] as any
}

export default defineConfig({
  title: '1mo.dev',
  description: '신입 개발자 전공 지식 & 기술 면접 백과사전',
  lang: 'ko-KR',
  base: '/',
  head: [
    // 탭 아이콘: 구형 브라우저용 ico + 선명한 png
    ['link', { rel: 'icon', href: '/favicon.ico', sizes: '16x16 32x32 48x48' }],
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon.png', sizes: '96x96' }],
    // 아이폰 홈 화면에 추가할 때 쓰는 아이콘 (iOS는 SVG 아이콘을 쓰지 않음)
    ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }],
    ['meta', { name: 'theme-color', content: '#2e7659' }],
    // 본문 폰트는 첫 화면에 바로 필요하므로 미리 받아 둠
    ['link', { rel: 'preload', href: '/fonts/Cafe24OhsquareAir.woff2', as: 'font', type: 'font/woff2', crossorigin: '' }],
  ],
  transformHead: ({ pageData }) => altLinks(pageData.relativePath),
  // 한국어(기본)와 영어(/en/). 언어 자동 선택과 KO/EN 버튼은 theme/i18n.ts, components/LangRedirect.vue 참고
  locales: {
    root: { label: '한국어', lang: 'ko-KR' },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      description: 'Tech interview encyclopedia for junior developers',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'GitHub', link: 'https://github.com/dubu-alt/Codyssey-B1' },
        ],
        sidebar: buildSidebar('en'),
        outline: { level: [2, 4], label: 'On this page' },
        docFooter: { prev: 'Previous', next: 'Next' },
        darkModeSwitchLabel: 'Dark mode',
        returnToTopLabel: 'Back to top',
        sidebarMenuLabel: 'Menu',
        langMenuLabel: 'Language',
        notFound: { title: 'PAGE NOT FOUND', quote: 'This page does not exist, or it is only available in Korean.', linkText: 'Go to home' },
      },
    },
  },
  // draft: true 인 글은 공개하지 않음
  srcExclude: draftFiles(),
  markdown: {
    config(md) {
      // frontmatter의 title을 페이지 맨 위 # 제목으로 그려 준다
      // (관리자 페이지에서 쓴 글은 제목이 frontmatter에만 있으므로)
      md.core.ruler.after('block', 'frontmatter-title', (state) => {
        const fm = (state.env as any)?.frontmatter
        const title = fm?.title
        if (!title || fm?.layout === 'home') return
        const first = state.tokens[0]
        if (first?.type === 'heading_open' && first.tag === 'h1') return
        const open = new state.Token('heading_open', 'h1', 1)
        open.markup = '#'
        open.block = true
        open.map = [0, 1]
        const inline = new state.Token('inline', '', 0)
        inline.content = String(title)
        inline.map = [0, 1]
        inline.children = []
        const close = new state.Token('heading_close', 'h1', -1)
        close.markup = '#'
        close.block = true
        state.tokens.unshift(open, inline, close)
      })
    },
  },
  vite: {
    resolve: {
      alias: [
        {
          // 기본 검색 버튼(VPNavBarSearch)을 Spotlight 검색 버튼으로 교체
          find: /^.*\/VPNavBarSearch\.vue$/,
          replacement: fileURLToPath(new URL('./theme/components/NavSearch.vue', import.meta.url)),
        },
      ],
    },
  },
  themeConfig: {
    logo: '/logo.png',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'GitHub', link: 'https://github.com/dubu-alt/Codyssey-B1' },
    ],
    // 폴더의 글을 읽어서 자동 생성 (sidebar.ts)
    sidebar: buildSidebar(),
    // 사이트 안 관리자 모드에서 쓰는 폴더 → /admin 분류 이름
    adminCollections: adminCollections(),
    socialLinks: [
      { icon: 'github', link: 'https://github.com/dubu-alt' }
    ],
    search: { provider: 'local' },
    outline: { level: [2, 4], label: '이 페이지 목차' },
    docFooter: { prev: '이전', next: '다음' },
    darkModeSwitchLabel: '다크 모드',
    sidebarMenuLabel: '메뉴',
    langMenuLabel: '언어',
    returnToTopLabel: '맨 위로'
  }
})
