# Minecraft Bedrock Addon Template

TypeScript template for creating Minecraft Bedrock Edition addons, with build, local deploy, and `.mcaddon` packaging.

> **Before you start developing:** customize the template (name, UUIDs, folders, and `.env`).  
> Full guide: **[docs/en-US.md](docs/en-US.md)** · **[docs/pt-BR.md](docs/pt-BR.md)**

---

## Quick start

1. Use this repository as a **GitHub template** (*Use this template*) or clone it.
2. Follow the guide in [`docs/`](docs/) to rename packs, generate UUIDs, and configure `.env`.
3. Install dependencies and deploy:

```bash
npm i
npm run local-deploy -- --watch
```

On Windows, if npm fails due to PowerShell script policy:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

Linux users can skip that command.

---

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- [Visual Studio Code](https://code.visualstudio.com/) (recommended)

---

## Useful scripts

| Command | Description |
| --- | --- |
| `npm run local-deploy -- --watch` | Compiles and copies the addon into the game folder (watch) |
| `npm run build` | Compiles the project |
| `npm run build:production` | Production build (strips `dev:` labels) |
| `npm run lint` | Analyzes the code |
| `npm run mcaddon` | Builds the `.mcaddon` file |
| `npm run mcaddon:production` | `.mcaddon` in production mode |
| `npm run clean` | Removes build artifacts |

Configuration details, Linux/Windows deploy, and GitHub usage are in [`docs/`](docs/).

---

## Structure

- `scripts/` — addon TypeScript code
- `behavior_packs/` — Behavior Pack
- `resource_packs/` — Resource Pack
- `.env` — project name and deploy path
- `just.config.ts` — build pipeline
- `docs/` — full documentation (en-US and pt-BR)
