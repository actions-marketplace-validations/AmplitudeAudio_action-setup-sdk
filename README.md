# Setup Amplitude Audio SDK - GitHub Action

[![GitHub Super-Linter](https://github.com/AmplitudeAudio/action-setup-sdk/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/AmplitudeAudio/action-setup-sdk/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/AmplitudeAudio/action-setup-sdk/actions/workflows/check-dist.yml/badge.svg)](https://github.com/AmplitudeAudio/action-setup-sdk/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/AmplitudeAudio/action-setup-sdk/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/AmplitudeAudio/action-setup-sdk/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

This GitHub Action helps you download and install Amplitude Audio SDK binaries
in your pipelines. It is mainly helpful for plugins and projects that use
Amplitude and need it at compile time in their GitHub Action based CI/CD
workflows.

## Usage

To include the action in a workflow, you can use the `uses` syntax with the `@`
symbol to reference a specific branch, tag, or commit hash.

```yaml
steps:
  - name: Checkout
    id: checkout
    uses: actions/checkout@v4

  - name: Setup Amplitude Audio SDK
    id: setup-sdk
    uses: AmplitudeAudio/action-setup-sdk@main
    with:
      platforms: | # The list of platforms you want to install
        x64-windows
        x86_64-linux
        arm64-macosx
      version: nightly # The SDK version to install. Use "nightly" or a release tag like "v1.0.0"
      install-dir: ./amplitude_audio # Where to install the SDK. Can be relative or absolute
      config: release # The SDK build configuration to install. Either release or debug
    env:
      # This is mandatory, as the action will make use of GitHub APIs to fetch and download the SDK
      # from the settings you provided.
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  - name: Print SDK Install Path
    id: output
    run: echo "${{ steps.setup-sdk.outputs.path }}" # The action outputs the install dir in a `path` field
```

## Supported Platforms

| Platform | Identifier |
| --- | --- |
| Windows (x64, MSVC) | `x64-windows` |
| Linux (x86_64, GCC) | `x86_64-linux` |
| Linux (x86_64, Clang) | `x86_64-linux-clang` |
| macOS (x86_64) | `x86_64-macosx` |
| macOS (arm64) | `arm64-macosx` |
| Android (x86_64) | `x86_64-android` |
| Android (arm64-v8a) | `arm64-v8a-android` |
| Android (x86) | `x86-android` |
| Android (armeabi-v7a) | `armeabi-v7a-android` |
| iOS (arm64) | `arm64-iphoneos` |
| iOS (x86_64) | `x86_64-iphoneos` |

## Inputs

| Input | Description | Required | Default |
| --- | --- | --- | --- |
| `platforms` | The list of SDK platforms to install (multiline) | Yes | - |
| `version` | The SDK version. Use `nightly` for latest develop builds, or a release tag like `v1.0.0` | Yes | `nightly` |
| `install-dir` | The directory where to install the SDK | No | `./amplitude_audio` |
| `config` | The build configuration. Either `debug` or `release` | Yes | `debug` |

## Outputs

| Output | Description |
| --- | --- |
| `path` | The path where the SDK has been installed |

## License

Copyright © Sparky Studios. Licensed under the MIT License.
