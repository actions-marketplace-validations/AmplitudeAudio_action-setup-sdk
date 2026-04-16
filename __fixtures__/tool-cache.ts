import { jest } from '@jest/globals'

export const downloadTool =
  jest.fn<(url: string, dest?: string, auth?: string) => Promise<string>>()
export const extractZip =
  jest.fn<(file: string, dest?: string) => Promise<string>>()
