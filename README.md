# Impuls Windows Desktop

<p align="center">
  <img src="Telegram/Resources/art/icon256.png" width="128" height="128" alt="Impuls Logo">
</p>

<h3 align="center">Official Impuls Client for Windows Desktop</h3>

<p align="center">
  <b>Version:</b> <code>1.0.0</code> &bull; 
  <b>App ID:</b> <code>{49D79F12-7A12-4BD8-95F4-6F2913A17B80}</code> &bull; 
  <b>Protocol:</b> <code>MTProto 2.0</code>
</p>

---

## Overview

**Impuls Windows Desktop** is the native Windows client for the private Impuls Telegram Network. Built with C++20 and Qt 6, it features high-performance encrypted messaging, custom minimalist obsidian & cyan branding, and preconfigured endpoints to connect directly to your Impuls server.

---

## Features

- **Rebranded Client**: AppName `Impuls`, custom titlebar, and minimalist vector icon suite.
- **Dedicated DC Options**: Configured in `Telegram/SourceFiles/mtproto/mtproto_dc_options.cpp` pointing to `80.201.130.248:20443`.
- **Pro Features**: All accounts registered on your Impuls network automatically receive full Telegram Premium perks.
- **MTProto 2.0 Encryption**: Safe Diffie-Hellman 2048-bit key exchange and AES-256-IGE packet security.
- **Automated Releases**: GitHub Actions triggers on every release tag to publish release notes and assets.

---

## Releases & Changelog
See [CHANGELOG.md](CHANGELOG.md) for version history and release notes.
