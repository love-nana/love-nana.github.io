// 日期计算工具

/**
 * 计算从目标日期到今天的差值（天数）
 */
export function dayDiff(targetDate: string): number {
  const now = new Date()
  now.setHours(0, 0, 0, 0)

  const target = new Date(targetDate)
  target.setHours(0, 0, 0, 0)

  return Math.floor((now.getTime() - target.getTime()) / (1000 * 60 * 60 * 24))
}

/**
 * 获取当前日期字符串（YYYY-MM-DD）
 */
export function curDateStr(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * 获取格式化的当前日期（YYYY年MM月DD日）
 */
export function formatCurDate(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}年${month}月${day}日`
}

/**
 * 计算认识的天数（从 2025-06-19）
 */
export function dayTouch(): number {
  return dayDiff('2025-06-19')
}

/**
 * 计算在一起的天数（从 2025-08-03）
 */
export function dayRan(): number {
  return dayDiff('2025-08-03')
}
