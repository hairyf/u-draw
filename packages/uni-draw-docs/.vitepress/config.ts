import type { DefaultTheme } from 'vitepress'
import { defineConfig } from 'vitepress'

const sidebar: DefaultTheme.Sidebar = [
  {
    text: '介绍',
    items: [
      { text: '快速开始', link: '/guide/' },
      { text: '使用建议', link: '/guide/proposal' },

    ],
  },
  {
    text: '基础',
    items: [
      { text: '绘制上下文（ctx）', link: '/basic/context' },
      { text: '绘制实例（dp）', link: '/basic/instance' },
    ],
  },
  {
    text: '插件',
    items: [
      { text: '声明绘制（painter）', link: '/plugins/painter' },
      { text: '表格绘制（table）', link: '/plugins/table' },
    ],
  },
  {
    text: '其他',
    items: [
      { text: '在 Vue 3 + VITE 中使用', link: '/other/vite-vue3' },
      { text: '常见问题', link: '/other/problem' },
    ],
  },
]

const nav: DefaultTheme.NavItem[] = [
  {
    text: '指南',
    link: '/guide/',
  },
  {
    text: 'Github',
    link: 'https://github.com/TuiMao233/u-draw',
  },
  {
    text: 'Hairy\'s Blog',
    link: 'https://hairy.blog/',
  },
]

const config = defineConfig({
  title: '绘制（Uni Draw Poster）',
  lastUpdated: true,
  themeConfig: {
    sidebar,
    nav,
    footer: {
      message: 'MIT Licensed',
      copyright: 'Copyright © 2019-present TuiMao233',
    },
  },
})

export default config
