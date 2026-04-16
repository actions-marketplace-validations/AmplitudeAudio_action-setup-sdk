import { jest } from '@jest/globals'

export const debug = jest.fn<(message: string) => void>()
export const error = jest.fn<(message: string | Error) => void>()
export const info = jest.fn<(message: string) => void>()
export const getInput = jest.fn<(name: string) => string>()
export const getMultilineInput = jest.fn<(name: string) => string[]>()
export const setFailed = jest.fn<(message: string | Error) => void>()
export const setOutput = jest.fn<(name: string, value: string) => void>()
export const addPath = jest.fn<(inputPath: string) => void>()
