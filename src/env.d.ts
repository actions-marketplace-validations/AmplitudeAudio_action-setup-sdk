type Platform =
  | 'x64-windows'
  | 'x86_64-linux'
  | 'x86_64-linux-clang'
  | 'x86_64-macosx'
  | 'arm64-macosx'
  | 'x86_64-android'
  | 'arm64-v8a-android'
  | 'x86-android'
  | 'armeabi-v7a-android'
  | 'arm64-iphoneos'
  | 'x86_64-iphoneos'

type Version = 'nightly' | `v${number}.${number}.${number}`

type Artifact = {
  id: number
  node_id: string
  name: string
  size_in_bytes: number
  url: string
  archive_download_url: string
  expired: boolean
  created_at: string
  updated_at: string
  expires_at: string
  workflow_run: {
    id: number
    repository_id: number
    head_repository_id: number
    head_branch: string
    head_sha: string
  }
}

type ReleaseAsset = {
  name: string
  browser_download_url: string
}

type Release = {
  tag_name: string
  assets: ReleaseAsset[]
}
