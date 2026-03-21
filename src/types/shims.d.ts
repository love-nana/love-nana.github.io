declare module 'masonry-layout' {
  export interface MasonryOptions {
    itemSelector?: string
    gutter?: number
    fitWidth?: boolean
    transitionDuration?: string
    [key: string]: unknown
  }

  export default class Masonry {
    constructor(element: Element | null, options?: MasonryOptions)
    reloadItems(): void
    layout(): void
    destroy(): void
  }
}

declare module 'imagesloaded' {
  function imagesLoaded(element: Element | null, callback?: () => void): void
  export default imagesLoaded
}

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
