# ZenCord

High-performance, modular, and privacy-centric Discord client modification.

[![License: GPL-3.0](https://img.shields.io/badge/License-GPLv3-0969da.svg?style=flat-square)](LICENSE)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178c6.svg?style=flat-square)](https://www.typescriptlang.org/)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20Linux%20%7C%20macOS-2ea44f.svg?style=flat-square)](#platform-support)
[![Website](https://img.shields.io/badge/Website-zencord--theta.vercel.app-5865f2.svg?style=flat-square)](https://www.zencord.site/)

---

## Overview

ZenCord is an advanced Discord client modification engineered for high execution speed, minimal resource consumption, and granular user privacy. Built on a modular TypeScript architecture, ZenCord provides runtime patching capabilities, an extensible plugin system, native Arabic localization support, and a Monaco-powered live CSS editing environment without introducing latency or stability regressions.

## Architectural Highlights

- **Low-Overhead Runtime Patching:** Bytecode-level injection and Webpack module hooking minimize memory usage and eliminate UI stutter.
- **Privacy Architecture:** Built-in telemetry blocking, tracker neutralization, and crash-reporter isolation enabled out of the box with user-level toggles.
- **Extensible Plugin Core:** Decoupled, lifecycle-managed plugin API supporting dynamic injection, reactive settings, and hot reloading.
- **Bilingual GUI Installer:** Dedicated Windows native installer featuring seamless single-click installation, uninstallation, cache sanitization, and real-time dual-language (Arabic / English) switching.
- **Monaco Code Studio:** Full-featured integrated code editor for custom stylesheets with live syntax validation and instant DOM reflection.
- **Cross-Environment Compatibility:** Full interoperability across Discord Desktop, browser extensions (Chromium and Firefox), and standalone web runtimes.

## Repository Layout

```
ZenCord/
├── packages/           # Workspace type definitions and discord interfaces
├── scripts/            # Build toolchains, GUI installer source, and bundlers
│   ├── build/          # esbuild pipelines for desktop and web targets
│   └── ZenCordGuiInstaller.cs # C# Windows Forms installer and maintenance tool
├── src/
│   ├── components/     # React UI components and settings tab interfaces
│   ├── main/           # Electron main-process hooks and IPC handlers
│   ├── plugins/        # Core and optional feature plugins
│   │   ├── _core/      # Essential subsystems (Settings, QuickCSS, NoTrack)
│   │   └── arabicUI/   # Localization engines and bidirectional typography
│   ├── utils/          # Webpack finders, updater clients, and logging
│   └── Vencord.ts      # Client initialization and patch lifecycle manager
└── banner.png          # Brand assets and installer resources
```

## Prerequisites

Ensure the following tools are installed before building from source:

- **Node.js:** Version 18.0.0 or higher (v20+ recommended)
- **Package Manager:** `pnpm` (recommended) or `npm`
- **Compiler (Windows Installer only):** .NET Framework 4.0+ (`csc.exe`)

## Building from Source

### 1. Clone Repository

```bash
git clone https://github.com/turki-basha/ZenCord.git
cd ZenCord
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Build Targets

To compile the standalone desktop distribution:

```bash
pnpm build --standalone
```

To watch files during active development:

```bash
pnpm watch
```

To build browser extension bundles:

```bash
pnpm buildWeb
```

### 4. Compiling the Windows GUI Installer

ZenCord includes a standalone single-binary maintenance and installation utility compiled directly via Roslyn / .NET Framework:

```powershell
Compress-Archive -Path dist\* -DestinationPath ZenCordPayload.zip -Force
C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe /nologo /target:winexe /out:ZenCordInstaller.exe /win32icon:ZenCord.ico /resource:banner.png /resource:ZenCord.ico /resource:ZenCordPayload.zip /r:System.Windows.Forms.dll /r:System.Drawing.dll /r:System.IO.Compression.FileSystem.dll /r:System.IO.Compression.dll scripts\ZenCordGuiInstaller.cs
```

## Configuration & Customization

Custom CSS and plugin settings are maintained independently of the host Discord client to ensure settings persist across Discord client updates.

Settings storage path:
- **Windows:** `%APPDATA%\ZenCord`
- **Linux:** `~/.config/ZenCord`
- **macOS:** `~/Library/Application Support/ZenCord`

## Official Channels

- **Portal:** [https://www.zencord.site/](https://www.zencord.site/)
- **Community:** [https://discord.gg/EYzpnZuSba](https://discord.gg/EYzpnZuSba)
- **Source Code:** [https://github.com/turki-basha/ZenCord](https://github.com/turki-basha/ZenCord)

## License and Attribution

ZenCord is open source software distributed under the terms of the [GNU General Public License v3.0](LICENSE).

This project is derived from Vencord, with architectural revisions, native maintenance utilities, specialized localization layers, and performance optimizations developed by the ZenCord Team.
