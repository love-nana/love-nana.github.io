// 照片分类
export type Category = 'all' | '我们' | '日常' | '心情' | '美食' | '旅行' | '心愿'

// 照片数据
export interface Photo {
  id: string           // 唯一标识（使用 image 路径）
  image: string        // COS 路径，如 "nana/xxx.jpg"
  imageUrl?: string    // 运行时生成的完整 URL
  images?: string[]    // 多图支持
  title: string
  desc?: string
  date?: string
  category: Category
  user?: string        // 上传者：娜宝/温宝
}

// 从 COS 加载的照片数据结构
export interface PhotoData {
  list: Photo[]
}

// COS 凭证
export interface CosCredentials {
  secretId: string
  secretKey: string
  user: string
}

// 分类按钮配置
export interface CategoryConfig {
  key: Category
  label: string
  icon: string
  colorClass?: string
}
