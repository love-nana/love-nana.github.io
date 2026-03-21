import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { rmSync, readFileSync, writeFileSync, existsSync } from 'fs'

function flattenHtmlOutput(distDir: string, pagesDir: string) {
  const renames = [
    ['index/index.html', 'about.html'],
    ['nav/index.html', 'index.html'],
    ['gallery/index.html', 'gallery.html'],
    ['gallery-edit/index.html', 'gallery-edit.html'],
    ['detail/index.html', 'detail.html'],
  ]
  for (const [src, dest] of renames) {
    const from = resolve(pagesDir, src)
    const to = resolve(distDir, dest)
    if (existsSync(from)) {
      let content = readFileSync(from, 'utf8')
      // Fix asset paths: from '../../../assets/' to './assets/'
      content = content.replace(/\.\.\/\.\.\/\.\.\/assets\//g, './assets/')
      // Fix component css paths: from '../../../components/' to './components/'
      content = content.replace(/\.\.\/\.\.\/\.\.\/components\//g, './components/')
      // Fix gallery-edit specific paths: from '../../../src/pages/gallery-edit/' to './'
      content = content.replace(/\.\.\/\.\.\/\.\.\/src\/pages\/gallery-edit\//g, './')
      // Fix imgs path
      content = content.replace(/\.\.\/\.\.\/imgs\//g, './imgs/')
      writeFileSync(to, content)
    }
  }
  rmSync(pagesDir, { recursive: true, force: true })
  rmSync(resolve(distDir, 'src'), { recursive: true, force: true })
}

// 开发服务器路径重写：支持旧路径（如 /gallery.html）访问 src/pages 下的入口
const devPageRewritePlugin = () => ({
  name: 'dev-page-rewrite',
  configureServer(server: any) {
    const rewrites: Record<string, string> = {
      '/': '/src/pages/nav/index.html',
      '/index.html': '/src/pages/nav/index.html',
      '/about.html': '/src/pages/index/index.html',
      '/gallery.html': '/src/pages/gallery/index.html',
      '/gallery-edit.html': '/src/pages/gallery-edit/index.html',
      '/detail.html': '/src/pages/detail/index.html',
    }
    server.middlewares.use((req: any, res: any, next: any) => {
      const url = req.url?.split('?')[0]
      if (rewrites[url]) {
        req.url = rewrites[url]
      }
      next()
    })
  }
})

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    devPageRewritePlugin(),
    {
      name: 'flatten-html-output',
      closeBundle() {
        const distDir = resolve(__dirname, 'dist')
        const pagesDir = resolve(distDir, 'src/pages')
        flattenHtmlOutput(distDir, pagesDir)
      }
    }
  ],
  base: './',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        about: resolve(__dirname, 'src/pages/index/index.html'),
        index: resolve(__dirname, 'src/pages/nav/index.html'),
        gallery: resolve(__dirname, 'src/pages/gallery/index.html'),
        'gallery-edit': resolve(__dirname, 'src/pages/gallery-edit/index.html'),
        detail: resolve(__dirname, 'src/pages/detail/index.html'),
      },
    },
  },
  server: {
    open: '/src/pages/nav/index.html'
  }
})
