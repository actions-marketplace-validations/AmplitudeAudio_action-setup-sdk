import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import * as path from 'path'
import { execFileSync } from 'node:child_process'

function getAuthHeaders(): Record<string, string> {
  if (process.env.GITHUB_TOKEN !== undefined) {
    return { Authorization: `token ${process.env.GITHUB_TOKEN}` }
  }
  return {}
}

export async function download(
  platforms: Platform[],
  version: Version
): Promise<void> {
  if (version === 'nightly') {
    return downloadNightly(platforms)
  }

  if (version.match(/^v\d+\.\d+\.\d+$/)) {
    return downloadRelease(platforms, version)
  }

  throw new Error(`Unsupported version: ${version}`)
}

async function downloadNightly(platforms: Platform[]): Promise<void> {
  const artifactsUrl =
    'https://api.github.com/repos/AmplitudeAudio/sdk/actions/artifacts'

  const headers = getAuthHeaders()

  core.debug('Retrieving artifacts from GitHub Actions')
  const response = await fetch(artifactsUrl, { headers })
  if (!response.ok) {
    throw new Error(`Failed to fetch artifacts: ${response.status}`)
  }

  const { artifacts } = (await response.json()) as {
    total_count: number
    artifacts: Artifact[]
  }

  const buildConfig = core.getInput('config')
  const installDir = core.getInput('install-dir')

  for (const platform of platforms) {
    const expectedName = `${buildConfig}_sdk_${platform}`
    const artifact = artifacts.find(
      a =>
        a.name === expectedName &&
        a.workflow_run.head_branch === 'develop' &&
        a.expired === false
    )

    if (artifact === undefined) {
      throw new Error(`No ${platform} nightly build found`)
    }

    const downloadedPath = await tc.downloadTool(
      artifact.archive_download_url,
      undefined,
      headers.Authorization
    )
    const extractedFolder = await tc.extractZip(downloadedPath, installDir)

    const installPath = path.resolve(extractedFolder)
    const sdkPath = path.join(installPath, 'sdk')

    core.addPath(installPath)
    core.exportVariable('AM_SDK_PATH', sdkPath)
    core.info(`Downloaded ${platform} nightly build to ${installPath}`)
    core.setOutput('path', installPath)
  }
}

async function downloadRelease(
  platforms: Platform[],
  version: string
): Promise<void> {
  const releaseUrl = `https://api.github.com/repos/AmplitudeAudio/sdk/releases/tags/${version}`

  const headers = getAuthHeaders()

  core.debug(`Retrieving release ${version}`)
  const response = await fetch(releaseUrl, { headers })
  if (!response.ok) {
    throw new Error(`Failed to fetch release: ${response.status}`)
  }

  const release = (await response.json()) as Release

  const buildConfig = core.getInput('config')
  const installDir = core.getInput('install-dir')

  for (const platform of platforms) {
    const expectedAssetName = `${buildConfig}_sdk_${platform}.7z`
    const asset = release.assets.find(a => a.name === expectedAssetName)

    if (asset === undefined) {
      throw new Error(
        `No ${platform} ${buildConfig} build found for version ${version}`
      )
    }

    const downloadedPath = await tc.downloadTool(
      asset.browser_download_url,
      undefined,
      headers.Authorization
    )

    execFileSync('7z', ['x', downloadedPath, `-o${installDir}`, '-y'])

    const installPath = path.resolve(installDir)
    const sdkPath = path.join(installPath, 'sdk')

    core.addPath(installPath)
    core.exportVariable('AM_SDK_PATH', sdkPath)
    core.info(`Downloaded ${platform} ${version} build to ${installPath}`)
    core.setOutput('path', installPath)
  }
}
