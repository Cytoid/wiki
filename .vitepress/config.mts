import { defineConfigWithTheme } from 'vitepress'
import type { DefaultTheme } from 'vitepress/theme-without-fonts'
import { resolve } from 'pathe'

import Unfonts from 'unplugin-fonts/vite'
import AutoImport from 'unplugin-auto-import/vite'
import * as locales from './locales'

// https://vitepress.dev/reference/site-config
export default defineConfigWithTheme<DefaultTheme.Config>({
  title: 'Cytoid Wiki',
  description: 'Cytoid is a music game where you can create, share and play your own levels!',

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    search: {
      provider: 'local',
      options: {
        locales: getSearchLocales(),
      },
    },

    logo: { src: '/pic/cytoid-girl.webp', alt: 'Cytoid' },

    socialLinks: [
      { icon: 'discord', link: 'https://discord.gg/cytoid' },
      { icon: 'x', link: 'https://x.com/cytoidio' },
      { icon: 'github', link: 'https://github.com/cytoid' },
      {
        icon:
        {
          svg: useSocialLinkIcon('simple-icons:bilibili'),
        },
        link: 'https://space.bilibili.com/35114681',
      },
      {
        icon:
        {
          svg: useSocialLinkIcon('mdi:patreon'),
        },
        link: 'https://www.patreon.com/tigerhix',
      },
    ],

    // override by locales settings
    nav: [
      { text: 'English', link: '/en/' },
      { text: '中文 (简体)', link: '/zh/' },
    ],
  },
  locales,

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
  ],

  appearance: {
    onChanged: async (isDark, defaultHandler, mode) => {
      defaultHandler(mode)
      try {
        document.querySelector('html')?.classList[isDark ? 'add' : 'remove']('tw-dark')
        document.querySelector('html')?.setAttribute('data-theme', isDark ? 'dark' : 'light')
      }
      catch (e) {
        // ignore
      }
    },
  },

  lastUpdated: true,
  markdown: {
    math: true,
  },

  cleanUrls: true,
  srcDir: 'docs',
  sitemap: {
    hostname: 'https://cytoid.wiki',
  },

  vite: {
    publicDir: '../public',
    plugins: [
      Unfonts({
        google: {
          families: [
            ...[
              'Nunito',
              'Noto Sans',
              'Noto Sans SC',
              'Noto Sans TC',
              'Noto Sans JP',
              'Noto Sans KR',
            ].map(name => ({
              name,
              styles: 'ital,wght@0,400;0,700;1,400;1,700',
              defer: true,
            })),
          ],
          display: 'swap',
        },
      }),
      AutoImport({
        imports: [
          'vue',
          'vitepress',
          {
            vitepress: ['inBrowser'],
          },
          '@vueuse/core',
        ],
        dts: resolve(__dirname, './types/auto-imports.generated.d.ts'),
      }),
    ],
  },
})

function getSearchLocales() {
  const searchLocales = {}
  for (const locale in locales) {
    searchLocales[locale] = locales[locale].search
  }
  return searchLocales
}

function useSocialLinkIcon(name: string): string {
  const icons = {
    'simple-icons:bilibili': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574c1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76c1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373c.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373c.347 0 .662.151.929.4c.267.249.391.551.391.907c0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773c-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893c.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773c.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894c-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373c.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96c-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c0-.373.129-.689.386-.947c.258-.257.574-.386.947-.386m8 0c.373 0 .684.124.933.373c.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96c-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96c.249-.249.56-.373.933-.373"/></svg>',
    'mdi:patreon': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M14.82 2.41c3.96 0 7.18 3.24 7.18 7.21c0 3.96-3.22 7.18-7.18 7.18c-3.97 0-7.21-3.22-7.21-7.18c0-3.97 3.24-7.21 7.21-7.21M2 21.6h3.5V2.41H2z"/></svg>',
  }
  return icons[name] || name
}
