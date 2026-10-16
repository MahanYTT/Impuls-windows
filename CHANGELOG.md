# Changelog - Impuls Windows Desktop

All notable changes to the Impuls Windows Desktop application will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [v1.0.2] - 2026-10-16

### 🚀 Added
- **Official Compiled Windows Executable & Portable Package**:
  - Standalone executable `Impuls.exe` compiled and attached to GitHub release.
  - Zero-dependency portable package `Impuls-v1.0.2-Windows-x64.zip` bundled with runtime modules and DirectX/ANGLE acceleration.
- **Embedded Native Branding & PE Metadata**:
  - High-resolution kinetic pulse icon injected directly into PE resources (`RT_GROUP_ICON` & `RT_ICON`).
  - PE Version Info updated with Product Name `Impuls Desktop`, Company `Impuls Team`, and File Description.
- **Automated CI/CD Release Pipeline**:
  - Robust GitHub Actions workflow (`.github/workflows/build-windows.yml`) with automated binary patching and icon injection.
  - Native MTProto 2.0 connection preconfigured for Impuls Server (`80.201.130.248:20443`).
  - RSA authentication keypair synchronized with `loyldg/mytelegram` backend for instant handshake verification.

### ⚙️ Version Metadata
- Version: `1.0.2`
- Internal Version Code: `1000002`
- Target Platform: Windows 10 / 11 (x64) Portable

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
