// 기본 테마를 확장해서 홈 3x3 목록과 하단 독을 끼워 넣는다
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import Dock from './components/Dock.vue'
import CategoryGrid from './components/CategoryGrid.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      'home-hero-after': () => h(CategoryGrid),
      'layout-bottom': () => h(Dock),
    }),
} satisfies Theme
