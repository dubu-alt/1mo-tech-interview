import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitepress'
import { buildSidebar, draftFiles } from './sidebar'

export default defineConfig({
  title: '1mo.dev',
  description: '신입 개발자 전공 지식 & 기술 면접 백과사전',
  lang: 'ko-KR',
  base: '/',
  head: [['link', { rel: 'icon', href: '/favicon.svg' }]],
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
    logo: '/favicon.svg',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'GitHub', link: 'https://github.com/dubu-alt/Codyssey-B1' },
    ],
    // 폴더의 글을 읽어서 자동 생성 (sidebar.ts)
    sidebar: buildSidebar(),
    socialLinks: [
      { icon: 'github', link: 'https://github.com/dubu-alt' }
    ],
    search: { provider: 'local' },
    outline: { label: '이 페이지 목차' },
    docFooter: { prev: '이전', next: '다음' },
    darkModeSwitchLabel: '다크 모드',
    returnToTopLabel: '맨 위로'
  }
})
