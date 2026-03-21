// localStorage 缓存工具

const CACHE_TTL = 14 * 60 * 1000 // 14 分钟缓存

interface CacheItem {
  url: string
  timestamp: number
}

/**
 * 保存图片 URL 到缓存
 */
export function savePicToCache(imageName: string, imgUrl: string): void {
  const item: CacheItem = {
    url: imgUrl,
    timestamp: Date.now(),
  }
  localStorage.setItem(imageName, JSON.stringify(item))
}

/**
 * 从缓存获取图片 URL，过期返回 null
 */
export function getPicFromCache(imageName: string): string | null {
  const cache = localStorage.getItem(imageName)
  if (!cache) return null

  try {
    // 尝试解析新版 JSON 格式
    const item: CacheItem = JSON.parse(cache)
    const diff = Date.now() - item.timestamp

    if (diff >= CACHE_TTL) {
      localStorage.removeItem(imageName)
      return null
    }
    return item.url
  } catch {
    // 兼容旧版字符串格式: "url,timestamp"
    const parts = cache.split(',')
    if (parts.length >= 2) {
      const url = parts[0]
      const timestamp = parseInt(parts[1])
      const diff = Date.now() - timestamp
      const minutesDiff = Math.ceil(diff / (1000 * 60))

      if (minutesDiff >= 14) {
        localStorage.removeItem(imageName)
        return null
      }
      return url
    }
    return null
  }
}

/**
 * 清除所有图片缓存
 */
export function clearPicCache(): void {
  const keysToRemove: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith('nana/')) {
      keysToRemove.push(key)
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key))
}
