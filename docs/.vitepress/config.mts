import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitepress'
import { buildSidebar, draftFiles } from './sidebar'
import { imageSizePlugin } from './imageSize'

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

// 한쪽 언어로만 있는 글 목록 (언어 자동 이동에서 빼기 위해)
function untranslated(): string[] {
  const DOCS = fileURLToPath(new URL('..', import.meta.url))
  const list = (dir: string): string[] => {
    const out: string[] = []
    const walk = (rel: string) => {
      const abs = path.join(dir, rel)
      if (!fs.existsSync(abs)) return
      for (const e of fs.readdirSync(abs, { withFileTypes: true })) {
        if (e.name.startsWith('.') || e.name === 'public' || (rel === '' && e.name === 'en' && dir === DOCS)) continue
        const r = rel ? `${rel}/${e.name}` : e.name
        if (e.isDirectory()) walk(r)
        else if (e.name.endsWith('.md')) out.push(r.replace(/\.md$/, '').replace(/(^|\/)index$/, '$1').replace(/\/$/, ''))
      }
    }
    walk('')
    return out
  }
  const ko = new Set(list(DOCS))
  const en = new Set(list(path.join(DOCS, 'en')))
  return [...ko].filter((k) => !en.has(k)).concat([...en].filter((k) => !ko.has(k)))
}

// 화면을 그리기 전에 언어를 판단해 바로 옮긴다 (한국어가 잠깐 보였다가 바뀌는 깜빡임 방지)
// - KO/EN 버튼으로 고른 언어(localStorage '1mo-lang')가 있으면 그것, 없으면 브라우저 언어·시간대 (한국 → 한국어)
// - 한쪽 언어로만 있는 글과 검색엔진 로봇은 옮기지 않는다
const langRedirectScript = `(function(){try{
var M=${JSON.stringify(untranslated())};
if(/bot|crawler|spider|crawling/i.test(navigator.userAgent))return;
var p=decodeURIComponent(location.pathname),en=/^\\/en(\\/|$)/.test(p),base=en?(p.slice(3)||'/'):p;
var key=base.replace(/^\\//,'').replace(/\\.html$/,'').replace(/(^|\\/)index$/,'$1').replace(/\\/$/,'');
var want=null;try{want=localStorage.getItem('1mo-lang')}catch(e){}
if(want!=='ko'&&want!=='en'){want='en';var ls=navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language];
for(var i=0;i<ls.length;i++){if(/^ko\\b/i.test(ls[i]||'')){want='ko';break}}
if(want==='en'){try{if(Intl.DateTimeFormat().resolvedOptions().timeZone==='Asia/Seoul')want='ko'}catch(e){}}}
if(want===(en?'en':'ko')||M.indexOf(key)>=0)return;
location.replace((want==='en'?'/en':'')+base+location.search+location.hash);
}catch(e){}})();`

const SITE = 'https://1mo.dev'
const pageUrl = (relativePath: string) =>
  `${SITE}/` + relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '.html')

// 글의 첫 문단으로 검색 결과·링크 미리보기용 설명을 만든다 (frontmatter에 description이 있으면 그것을 씀)
function firstParagraph(relativePath: string): string {
  try {
    const src = fs.readFileSync(fileURLToPath(new URL(`../${relativePath}`, import.meta.url)), 'utf8')
    const lines = src.replace(/^---[\s\S]*?\n---\n/, '').split(/\r?\n/)
    const para: string[] = []
    let code = false
    for (const raw of lines) {
      const line = raw.trim()
      if (line.startsWith('```')) { code = !code; if (para.length) break; continue }
      if (code) continue
      if (!line) { if (para.length) break; continue }
      if (/^(#|!\[|\||<|>|[-*+] |\d+\. |\*.*\*$)/.test(line)) { if (para.length) break; continue }
      para.push(line)
    }
    let text = para.join(' ')
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/\s+/g, ' ')
      .trim()
    if (text.length > 155) text = text.slice(0, 154).replace(/\s+\S*$/, '') + '…'
    return text
  } catch {
    return ''
  }
}

// 카카오톡·LinkedIn 등에 링크를 붙였을 때 보이는 미리보기(Open Graph)와 대표 주소
function shareTags(relativePath: string, title: string, description: string, home: boolean) {
  const url = pageUrl(relativePath)
  const en = relativePath.startsWith('en/')
  const image = `${SITE}/og-image.png`
  return [
    ['link', { rel: 'canonical', href: url }],
    ['meta', { property: 'og:type', content: home ? 'website' : 'article' }],
    ['meta', { property: 'og:site_name', content: '1mo.dev' }],
    ['meta', { property: 'og:title', content: title }],
    ['meta', { property: 'og:description', content: description }],
    ['meta', { property: 'og:url', content: url }],
    ['meta', { property: 'og:image', content: image }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { property: 'og:locale', content: en ? 'en_US' : 'ko_KR' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: title }],
    ['meta', { name: 'twitter:description', content: description }],
    ['meta', { name: 'twitter:image', content: image }],
  ] as any
}

export default defineConfig({
  title: '1mo.dev',
  description: '신입 개발자 전공 지식 & 기술 면접 백과사전',
  lang: 'ko-KR',
  base: '/',
  head: [
    // 언어 자동 이동 (가장 먼저 실행)
    ['script', {}, langRedirectScript],
    // 탭 아이콘: 구형 브라우저용 ico + 선명한 png
    ['link', { rel: 'icon', href: '/favicon.ico', sizes: '16x16 32x32 48x48' }],
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon.png', sizes: '96x96' }],
    // 아이폰 홈 화면에 추가할 때 쓰는 아이콘 (iOS는 SVG 아이콘을 쓰지 않음)
    ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }],
    ['meta', { name: 'theme-color', content: '#2e7659' }],
    // 본문 폰트는 첫 화면에 바로 필요하므로 미리 받아 둠
    ['link', { rel: 'preload', href: '/fonts/Cafe24OhsquareAir.woff2', as: 'font', type: 'font/woff2', crossorigin: '' }],
  ],
  // 검색엔진용 사이트맵 (https://1mo.dev/sitemap.xml)
  sitemap: { hostname: SITE },
  // 설명이 없는 글은 첫 문단을 설명으로 쓴다
  transformPageData(pageData) {
    if (!pageData.frontmatter.description && pageData.frontmatter.layout !== 'home' && pageData.relativePath) {
      const d = firstParagraph(pageData.relativePath)
      if (d) pageData.description = d
    }
  },
  transformHead: ({ pageData, title, description }) => [
    ...altLinks(pageData.relativePath),
    ...shareTags(pageData.relativePath, title, description, pageData.frontmatter.layout === 'home'),
  ],
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
      // 그림에 가로·세로 크기와 지연 로딩을 넣는다 (imageSize.ts)
      md.use(imageSizePlugin)
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
