import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { rmSync, readFileSync, writeFileSync, existsSync } from 'fs'

function devPageRewritePlugin() {
  // 开发环境路径映射：扁平化后的路径 → 实际源码路径
  const pathRewrite = [
    ['./about.html', '/src/pages/index/index.html'],
    ['./gallery.html', '/src/pages/gallery/index.html'],
    ['./gallery-edit.html', '/src/pages/gallery-edit/index.html'],
    ['./detail.html', '/src/pages/detail/index.html'],
  ]

  return {
    name: 'dev-page-rewrite',
    transform(code, id) {
      if (!id.endsWith('.vue')) return

      for (const [from, to] of pathRewrite) {
        // 转义正则特殊字符
        const escapedFrom = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        // 匹配模板中的 href="./about.html"
        code = code.replace(new RegExp(`href="${escapedFrom}"`, 'g'), `href="${to}"`)
        // 匹配 JS 中的 window.location.href = './about.html'
        // 以及 window.open('./detail.html')
        // 统一替换引号内的路径为双引号格式
        code = code.replace(new RegExp(`["']${escapedFrom}["']`, 'g'), `"${to}"`)
      }
      return code
    }
  }
}

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
