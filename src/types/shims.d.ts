declare module 'pulltorefreshjs' {
  interface PullToRefreshOptions {
    mainElement?: string
    onRefresh: () => void
    instructionsPullToRefresh?: string
    instructionsReleaseToRefresh?: string
    instructionsRefreshing?: string
  }

  function init(options: PullToRefreshOptions): void
  function destroyAll(): void

  export default { init, destroyAll }
}

declare module '*.png' {
  const content: string
  export default content
}

declare module '*.jpg' {
  const content: string
  export default content
}

declare module '*.jpeg' {
  const content: string
  export default content
}

declare module '*.gif' {
  const content: string
  export default content
}

declare module '*.svg' {
  const content: string
  export default content
}

declare module 'pikaday' {
  interface PikadayOptions {
    field?: HTMLElement
    format?: string
    i18n?: {
      previousMonth?: string
      nextMonth?: string
      months?: string[]
      weekdays?: string[]
      weekdaysShort?: string[]
    }
    onSelect?: (date: Date) => void
  }

  class Pikaday {
    constructor(options: PikadayOptions)
    toString(): string
    getDate(): Date
    setDate(date: string): void
    destroy(): void
  }

  export default Pikaday
}

declare module 'cos-js-sdk-v5' {
  export interface CosCredentials {
    SecretId: string
    SecretKey: string
  }

  export interface GetObjectUrlParams {
    Bucket: string
    Region: string
    Key: string
    Sign?: boolean
    Protocol?: string
  }

  export interface PutObjectParams {
    Bucket: string
    Region: string
    Key: string
    Body: File | string
    ContentType?: string
  }

  export default class COS {
    constructor(credentials: CosCredentials)
    getObjectUrl(params: GetObjectUrlParams, callback?: (err: Error | null, data: { Url: string }) => void): Promise<string | { Url: string }>
    putObject(params: PutObjectParams, callback?: (err: Error | null, data: unknown) => void): Promise<unknown>
  }
}
