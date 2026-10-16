# Changelog - Impuls Windows Desktop

All notable changes to the Impuls Windows Desktop application will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v1.0.5] - 2026-10-16

### 🚀 Added & Enhanced
- **Live Server Integration**:
  - Connected `AuthCard` directly to `POST http://80.201.130.248:8088/api/client/auth` for live account creation and verification in MongoDB.
  - Connected `App.tsx` to `GET/POST http://80.201.130.248:8088/api/client/messages` for real-time persistent messaging.
  - Implemented Server-Sent Events (SSE) live stream subscriber (`/api/client/stream`) for instant cross-device message synchronization.
  - Graceful fallback for offline mode and local encrypted session preservation.

---

## [v1.0.4] - 2026-10-16

### 🚀 Added & Rebuilt
- **Custom Impuls Desktop Client**:
  - Completely custom matte obsidian & dark slate interface (strictly **NO NEON**).
  - Native **Impuls ID / Username + Security PIN** authentication (zero carrier phone screens, zero country flags, zero QR codes).
  - Modern **3-Zone Workspace Layout**:
    - Zone 1: Far-left activity rail with quick navigation for Direct Messages, Channels, Media Vault, and Profile Settings.
    - Zone 2: Searchable conversation list with unread markers and instant chat/channel creation.
    - Zone 3: Expansive, distraction-free chat pane with flat message cards, timestamps, and read receipts.
  - Built-in automated **Impuls System** greeting and connection status telemetry (`80.201.130.248:20443`).
  - Self-hosted clean build using official verified runtime packages.

---

## [v1.0.3] - 2026-10-16

### 🚀 Added
- **Dedicated Windows Build Runner Optimization**:
  - Pruned extraneous upstream workflows (Docker, Snap, macOS, Linux) to prioritize Windows release runner dispatch.
  - Streamlined `build-windows.yml` workflow with standalone `tools/README.txt` deployment.
- **Official Executable & Portable Release Assets**:
  - `Impuls.exe` standalone executable for Windows 10/11 x64.
  - `Impuls-v1.0.3-Windows-x64.zip` zero-dependency portable package.
  - Embedded kinetic cyan/obsidian icon and native Windows PE metadata.
  - Preconfigured MTProto 2.0 connection pointing to Impuls server (`80.201.130.248:20443`).

### ⚙️ Version Metadata
- Version: `1.0.3`
- Internal Version Code: `1000003`
- Target Platform: Windows 10 / 11 (x64) Portable

---

## [v1.0.2] - 2026-10-16

### 🚀 Added
- **Automated CI/CD Release Pipeline**:
  - GitHub Actions workflow (`.github/workflows/build-windows.yml`) with automated binary patching and icon injection.

---

## [v1.0.1] - 2026-10-16

### 🚀 Added
- **Binary Patching Infrastructure**:
  - Initial binary patcher scripts and icon injection tooling.

---

## [v1.0.0] - 2026-10-16

### 🚀 Added
- **Impuls Desktop Branding**:
  - Rebranded application from Telegram Desktop to **Impuls** (`AppName = "Impuls"`, `AppFile = "Impuls"`).
  - Custom geometric kinetic pulse vector icon rendered across all Windows asset densities (`icon16` through `icon512` and `icon256.ico`).
  - Generated dedicated Windows AppId (`{49D79F12-7A12-4BD8-95F4-6F2913A17B80}`).
- **Private MTProto 2.0 Server Connection**:
  - Preconfigured native DC discovery endpoints in `mtproto_dc_options.cpp` pointing directly to Impuls Server (`80.201.130.248:20443`).
  - Automatic fallback to high-speed media CDN on port `20543`.
- **CI/CD Cloud Build Pipeline**:
  - GitHub Actions workflow configured to package releases on every tagged release.

### ⚙️ Version Metadata
- Version: `1.0.0`
- Internal Version Code: `1000000`
- Target Platform: Windows 10/11 (x64) & Windows 7+ compatible toolset
