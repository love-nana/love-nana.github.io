# 部署说明

本项目使用 GitHub Actions 自动部署到 GitHub Pages。

## 仓库设置（首次）

### 1. 启用 GitHub Pages

1. 进入仓库 **Settings** → **Pages**
2. **Source**: Deploy from a branch
3. **Branch**: 选择 `gh-pages` / `(root)`（取决于 Actions workflow 配置）

### 2. 自定义域名（如需）

1. 在 Pages 设置中添加自定义域名 `love-nana.cn`
2. 在 DNS 服务商添加 CNAME 记录：
   - **类型**: CNAME
   - **主机记录**: `@` (或 `www`)
   - **记录值**: `charmingchen.github.io`

> 注意：DNS 传播可能需要几分钟到 48 小时

## 部署流程

### 自动部署（推荐）

push 到 `master` 分支后，GitHub Actions 自动构建部署：

```bash
# 1. 本地开发
npm run dev

# 2. 本地构建
npm run build

# 3. 本地预览（可选）
npm run preview

# 4. 提交代码
git add .
git commit -m "update"
git push origin master

# 5. 等待 GitHub Actions 完成（约 1-2 分钟）
```

### 手动部署

```bash
# 构建
npm run build

# 使用 GitHub CLI 部署
ghpages-deploy
```

## 访问地址

- **GitHub Pages**: https://charmingchen.github.io
- **自定义域名**: https://love-nana.cn

## 分支策略

| 分支 | 说明 |
|-----|-----|
| `master` | 开发分支，push 后自动触发 GitHub Actions |
| `gh-pages` | 由 Actions 自动创建和维护，无需手动管理 |

## 故障排查

### 1. 构建失败

本地运行构建检查错误：

```bash
npm run build
```

### 2. 部署后页面空白

1. 打开浏览器开发者工具 → Console
2. 检查资源加载错误
3. 确认 `vite.config.ts` 中 `base: './'` 配置正确

### 3. 自定义域名不生效

1. 检查 DNS 记录是否正确传播
2. 确认 GitHub Pages 设置中已启用自定义域名
3. 等待 DNS 传播完成（最多 48 小时）

### 4. Actions 执行失败

1. 进入仓库 → **Actions** 查看构建日志
2. 常见错误：
   - `npm ci` 失败：检查 `package-lock.json` 是否最新
   - 构建错误：本地运行 `npm run build` 复现

## 工作流文件

`.github/workflows/deploy.yml` 定义了完整的构建和部署流程：

1. Checkout 代码
2. 安装 Node.js 20
3. 运行 `npm ci` 安装依赖
4. 运行 `npm run build` 构建
5. 配置 GitHub Pages
6. 上传构建产物
7. 部署到 GitHub Pages
