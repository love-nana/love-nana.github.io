import COS from 'cos-js-sdk-v5'
import { computed, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { getPicFromCache, savePicToCache } from '@/utils/cache'
import type { PhotoData } from '@/types'

// COS 配置
const COS_CONFIG = {
  bucket: 'lovel-nana-1259397844',
  region: 'ap-guangzhou',
}

export function useCos() {
  const authStore = useAuthStore()

  // COS 实例（惰性初始化）
  const cos = computed(() => {
    if (!authStore.credentials) return null
    return new COS({
      SecretId: authStore.credentials.secretId,
      SecretKey: authStore.credentials.secretKey,
    })
  })

  // 错误状态
  const error = ref<string | null>(null)

  /**
   * 获取单个图片的 URL（带缓存）
   */
  async function getPhotoUrl(filePath: string, useCache = true): Promise<string | null> {
    if (!cos.value) {
      error.value = '未登录'
      return null
    }

    if (filePath.length > 1000) {
      error.value = '路径错误'
      return null
    }

    // 先检查缓存
    if (useCache) {
      const cached = getPicFromCache(filePath)
      if (cached) return cached
    }

    try {
      const result = await cos.value.getObjectUrl({
        Bucket: COS_CONFIG.bucket,
        Region: COS_CONFIG.region,
        Key: filePath,
        Sign: true,
        Protocol: 'https:',
      })

      const url = typeof result === 'string' ? result : (result as { Url: string }).Url

      // 保存到缓存
      if (useCache && url) {
        savePicToCache(filePath, url)
      }

      return url
    } catch (err) {
      error.value = '获取图片 URL 失败'
      console.error('getPhotoUrl error:', err)
      return null
    }
  }

  /**
   * 批量获取图片 URL
   */
  async function getPhotoUrls(filePaths: string[]): Promise<(string | null)[]> {
    const promises = filePaths.map(path => getPhotoUrl(path))
    return Promise.all(promises)
  }

  /**
   * 上传图片文件
   */
  async function uploadPhotos(files: File[]): Promise<string[]> {
    if (!cos.value) {
      throw new Error('未登录')
    }

    const uploadPromises = files.map(async (file) => {
      const ext = file.name.split('.').pop() || 'jpg'
      const fileName = `nana/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`

      await cos.value!.putObject({
        Bucket: COS_CONFIG.bucket,
        Region: COS_CONFIG.region,
        Key: fileName,
        Body: file,
      })

      return fileName
    })

    return Promise.all(uploadPromises)
  }

  /**
   * 上传 JSON 文件
   */
  async function uploadJson(filename: string, data: unknown): Promise<void> {
    if (!cos.value) {
      throw new Error('未登录')
    }

    const content = JSON.stringify(data, null, 2)

    await cos.value.putObject({
      Bucket: COS_CONFIG.bucket,
      Region: COS_CONFIG.region,
      Key: filename,
      Body: content,
      ContentType: 'application/json',
    })
  }

  /**
   * 加载 JSON 文件
   */
  async function loadJson<T>(filename: string): Promise<T | null> {
    try {
      // 先获取 URL
      const url = await getPhotoUrl(filename, false)
      if (!url) return null

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      return await response.json() as T
    } catch (err) {
      error.value = '加载数据失败'
      console.error('loadJson error:', err)
      return null
    }
  }

  /**
   * 加载照片数据
   */
  async function loadPhotos(): Promise<PhotoData | null> {
    return loadJson<PhotoData>('foodData.json')
  }

  /**
   * 保存照片数据
   */
  async function savePhotos(data: PhotoData): Promise<void> {
    return uploadJson('foodData.json', data)
  }

  return {
    cos,
    error,
    getPhotoUrl,
    getPhotoUrls,
    uploadPhotos,
    uploadJson,
    loadJson,
    loadPhotos,
    savePhotos,
  }
}
