/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * To mock dependencies in ESM, we use __fixtures__ that export mock
 * functions and jest.unstable_mockModule() with dynamic imports.
 */
import { jest } from '@jest/globals'
import * as core from '../__fixtures__/core.js'
import * as tc from '../__fixtures__/tool-cache.js'

// Mocks must be declared before the module being tested is imported.
jest.unstable_mockModule('@actions/core', () => core)
jest.unstable_mockModule('@actions/tool-cache', () => tc)

// The module being tested must be imported dynamically so mocks are applied.
const { run } = await import('../src/main.js')

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    tc.downloadTool.mockResolvedValue('path/to/sdk.zip')
    tc.extractZip.mockResolvedValue('path/to/sdk')
  })

  it('downloads the nightly artifacts', async () => {
    core.getInput.mockImplementation((name: string): string => {
      switch (name) {
        case 'version':
          return 'nightly'
        default:
          return ''
      }
    })

    core.getMultilineInput.mockImplementation((name: string): string[] => {
      switch (name) {
        case 'platforms':
          return ['x64-windows', 'arm64-osx']
        default:
          return []
      }
    })

    await run()

    expect(core.debug).toHaveBeenNthCalledWith(
      1,
      'Retrieving artifacts from GitHub Actions'
    )
    expect(core.setOutput).toHaveBeenLastCalledWith(
      'path',
      expect.stringContaining('sdk')
    )
    expect(core.error).not.toHaveBeenCalled()
  }, 10000)

  it('sets a failed status on unknown platform', async () => {
    core.getInput.mockImplementation((name: string): string => {
      switch (name) {
        case 'version':
          return 'nightly'
        default:
          return ''
      }
    })

    core.getMultilineInput.mockImplementation((name: string): string[] => {
      switch (name) {
        case 'platforms':
          return ['x86-windows', 'arm64-osx']
        default:
          return []
      }
    })

    await run()

    expect(core.debug).toHaveBeenNthCalledWith(
      1,
      'Retrieving artifacts from GitHub Actions'
    )
    expect(core.setFailed).toHaveBeenNthCalledWith(
      1,
      'No x86-windows nightly build found'
    )
  })
})
