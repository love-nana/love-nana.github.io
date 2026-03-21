# CLAUDE.md

本文档为 Claude Code (claude.ai/code) 在本仓库中工作时提供指导。

## 项目概述

这是一个基于 Vue 3 + Vite + TypeScript 的静态网站（托管于 love-nana.cn），用于记录情侣的感情回忆。照片存储使用腾讯云 COS，通过 GitHub Pages 部署。

## 技术栈

- **框架**: Vue 3 (Composition API) + TypeScript
- **构建工具**: Vite 5
- **状态管理**: Pinia
- **存储**: 腾讯云 COS (cos-js-sdk-v5)
- **样式**: 原生 CSS（无预处理器）
- **类库**: Masonry-layout、imagesLoaded、PullToRefresh.js、@vueuse/core

## 开发命令

```bash
npm run dev      # 启动开发服务器，热更新
npm run build    # 类型检查 + 构建到 dist/
npm run preview  # 预览构建产物
```

开发服务器默认打开 `/src/pages/nav/index.html`。

## 架构

### 多页面应用结构

Vite 构建 5 个入口点（配置于 `vite.config.ts`）：
- `src/pages/nav/index.html` → 主页（导航页）
- `src/pages/index/index.html` → 关于页（恋爱统计、天数计数）
- `src/pages/gallery/index.html` → 照片瀑布流画廊
- `src/pages/gallery-edit/index.html` → 照片管理后台（上传/删除）
- `src/pages/detail/index.html` → 单张照片详情页

构建后 HTML 文件会被展平到 `dist/` 根目录：
- `dist/index.html`（导航页）
- `dist/about.html`（恋爱统计页）
- `dist/gallery.html`
- `dist/gallery-edit.html`
- `dist/detail.html`

### 源码目录结构

```
src/
├── pages/
│   ├── nav/                # 主页 Vue 应用（导航）
│   │   ├── App.vue
│   │   ├── main.ts
│   │   ├── index.html
│   │   └── nav.css
│   ├── index/              # 关于页 Vue 应用（恋爱统计）
│   │   ├── App.vue
│   │   ├── main.ts
│   │   ├── index.html
│   │   └── index.css
│   ├── gallery/            # 画廊 Vue 应用
│   │   ├── App.vue
│   │   ├── main.ts
│   │   ├── index.html
│   │   └── gallery.css
│   ├── gallery-edit/       # 画廊管理后台 Vue 应用
│   │   ├── App.vue
│   │   ├── main.ts
│   │   ├── index.html
│   │   ├── gallery-edit.css
│   │   ├── load-more.css
│   │   ├── loading.css
│   │   ├── login.css
│   │   └── notification.css
│   └── detail/             # 照片详情 Vue 应用
│       ├── App.vue
│       ├── main.ts
│       ├── index.html
│       └── detail.css
├── components/              # 共享 Vue 组件
│   ├── MasonryGrid.vue
│   ├── CategoryFilter.vue
│   ├── LoadingOverlay.vue
│   ├── NotificationContainer.vue
│   └── CosLoginModal.vue
├── assets/
│   └── imgs/                # 静态资源（favicon、emoji 表情）
├── stores/                  # Pinia 状态库
│   ├── gallery.ts           # 照片状态、分页、筛选
│   ├── auth.ts              # COS 凭证
│   └── ui.ts                # UI 状态（loading、notifications）
├── composables/
│   └── useCos.ts            # COS 操作（上传、获取签名 URL）
├── utils/
│   ├── cache.ts             # 签名 URL 缓存（localStorage，14分钟 TTL）
│   └── date.ts              # 纪念日日期计算
└── types/
    ├── index.ts             # TypeScript 接口定义
    └── shims.d.ts           # 模块类型声明
```

### 核心类型定义

```typescript
type Category = 'all' | '我们' | '日常' | '心情' | '美食' | '旅行' | '心愿'

interface Photo {
  id: string           // 唯一标识（使用 image 路径）
  image: string        # COS 路径，如 "nana/xxx.jpg"
  imageUrl?: string    // 运行时生成的完整 URL（签名后）
  images?: string[]    // 多图支持
  title: string
  desc?: string
  date?: string
  category: Category
  user?: string        # "娜宝" 或 "温宝"
}

interface PhotoData {
  list: Photo[]
}

interface CosCredentials {
  secretId: string
  secretKey: string
  user: string
}

interface CategoryConfig {
  key: Category
  label: string
  icon: string
  colorClass?: string
}
```

### 存储架构

**腾讯云 COS** 作为主要数据存储：

- `useCos()` composable 处理所有 COS 操作
- 照片上传至 COS 存储桶 `lovel-nana-1259397844`（广州区）
- 照片元数据（标题、描述、分类、日期）存储在 COS 的 `foodData.json` 文件中
- 签名 URL 缓存在 localStorage 中，有效期 14 分钟，减少重复签名
- COS 凭证通过登录弹窗输入，支持新旧格式兼容存储

### 数据流程

1. 画廊页面通过签名 URL 从 COS 加载 `foodData.json`
2. `getPhotoUrl()` 将 COS 路径转换为签名 URL（带缓存）
3. 图片加载完成后应用瀑布流布局（MasonryGrid 组件）
4. 分页：每页 10 张照片，滚动加载更多

### 认证

编辑页面（`gallery-edit.html`）需要 COS 凭证。`CosLoginModal` 组件弹窗输入 SecretId/SecretKey，通过 `auth` Pinia store 存入 localStorage（key: `cos_auth`），并兼容旧版 localStorage 格式。

## 构建流程

Vite 配置包含两个自定义插件：

1. **`devPageRewritePlugin`**: 开发服务器路径重写，支持旧路径访问
2. **`flatten-html-output`**: 构建时将 `dist/src/pages/*/index.html` 展平到 `dist/*.html`，并修复资源路径

## 部署

- **分支**: `master`
- **构建产物**: `dist/` 目录
- **自定义域名**: `love-nana.cn`（`CNAME` 文件配置）
- **CI/CD**: GitHub Actions（`.github/workflows/deploy.yml`）
- GitHub Pages 自动从 `master` 分支部署

## 重要实现细节

- **恋爱里程碑**: 2025 年 6 月 19 日（相遇）、2025 年 8 月 3 日（在一起）
- **图片质量**: 画廊使用 `&imageMogr2/quality/30` 腾讯云压缩缩略图
- **缓存有效期**: 签名 URL 在 localStorage 中缓存 14 分钟（`cache.ts`）
- **分类筛选**: 客户端筛选，由 `gallery` Pinia store 管理
- **瀑布流布局**: Masonry-layout 库，响应式列数（桌面4列、平板3列、手机2列）
- **多图支持**: Photo 的 `images` 数组字段支持多张图片
