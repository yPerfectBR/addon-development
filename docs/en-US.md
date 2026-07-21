# Template guide — Addon Development

This repository is a **template** for creating Minecraft Bedrock addons with TypeScript. Before you start your real project, configure the template with your addon's name, UUIDs, and deployment path.

---

## 1. Create your repository from the template

This project is meant to be a **GitHub template**, so the first step is to create **your** addon repository from it:

1. Open the template page on GitHub.
2. Click **Use this template** → **Create a new repository**.
3. Choose the repository name, visibility (public/private), and confirm.
4. Clone the repository to your machine:

```bash
git clone https://github.com/YOUR_USER/YOUR_REPO.git
cd YOUR_REPO
```

From there, the code lives under your account and you can customize, develop, and version the addon. Commit, branch, and merge flow is in [section 5](#5-version-the-addon-with-git).

---

## 2. Customize the template

### 2.1 Name and description (Behavior Pack and Resource Pack)

Open the manifests and change `name` and `description` in **both** packs:

- `behavior_packs/<project-name>/manifest.json`
- `resource_packs/<project-name>/manifest.json`

Example:

```json
"name": "My Awesome Addon",
"description": "Description of my addon"
```

These fields should reflect your project — do not leave the placeholder values.

### 2.2 Replace the UUIDs (watch the dependencies)

Every addon needs **unique** UUIDs. The values shipped in the template are examples only — **generate new UUIDs** at [UUID Generator](https://www.uuidgenerator.net/) and replace every `uuid` field below.

In total there are **4 “own” UUIDs** (2 in the BP + 2 in the RP) and **2 cross-references** (each pack’s dependency points at the other pack’s `header.uuid`).

#### Behavior Pack — `behavior_packs/.../manifest.json`

`uuid` fields you must change (comments are for this doc only; real JSON does not allow `//`):

```json
{
  "format_version": 2,
  "header": {
    "name": "Change this name",
    "description": "Change this description",
    "uuid": "14e467b4-e3aa-49d3-8352-f8439fd7b2ee",
    // ▲ REPLACE — Behavior Pack UUID (pack identity)
    "version": [1, 0, 0],
    "min_engine_version": [1, 26, 0]
  },
  "modules": [
    {
      "description": "Script resources",
      "language": "javascript",
      "type": "script",
      "uuid": "7c7e693f-99f4-41a9-95e0-1f57b37e1e12",
      // ▲ REPLACE — script module UUID (another new UUID, different from header)
      "version": [1, 0, 0],
      "entry": "scripts/main.js"
    }
  ],
  "dependencies": [
    {
      "module_name": "@minecraft/server",
      "version": "2.8.0"
    },
    {
      "module_name": "@minecraft/server-ui",
      "version": "2.1.0"
    },
    {
      "uuid": "2d7ed858-97eb-48a0-b180-7c80d1ce9a48",
      // ▲ REPLACE — but do NOT invent a random value here:
      //    this UUID MUST EQUAL the Resource Pack header.uuid
      "version": [1, 0, 0]
    }
  ]
}
```

BP summary:

| Field | What to do |
| --- | --- |
| `header.uuid` | Generate a new UUID (Behavior Pack UUID) |
| `modules[0].uuid` | Generate **another** new UUID (script module) |
| `dependencies` entry with `uuid` | Set it to the **same** value as the Resource Pack `header.uuid` |
| `@minecraft/server` / `@minecraft/server-ui` dependencies | These are **not** your pack UUIDs — leave them |

#### Resource Pack — `resource_packs/.../manifest.json`

```json
{
  "format_version": 2,
  "header": {
    "name": "Change this name",
    "description": "Change this description",
    "uuid": "2d7ed858-97eb-48a0-b180-7c80d1ce9a48",
    // ▲ REPLACE — Resource Pack UUID (pack identity)
    "version": [1, 0, 0],
    "min_engine_version": [1, 20, 30]
  },
  "modules": [
    {
      "description": "My Resource Pack",
      "type": "resources",
      "uuid": "503fe660-142b-46a2-8fec-34a54e944720",
      // ▲ REPLACE — resources module UUID (another new UUID, different from header)
      "version": [1, 0, 0]
    }
  ],
  "dependencies": [
    {
      "uuid": "14e467b4-e3aa-49d3-8352-f8439fd7b2ee",
      // ▲ REPLACE — but do NOT invent a random value here:
      //    this UUID MUST EQUAL the Behavior Pack header.uuid
      "version": [1, 0, 0]
    }
  ]
}
```

RP summary:

| Field | What to do |
| --- | --- |
| `header.uuid` | Generate a new UUID (Resource Pack UUID) |
| `modules[0].uuid` | Generate **another** new UUID (resources module) |
| `dependencies[0].uuid` | Set it to the **same** value as the Behavior Pack `header.uuid` |

#### How the dependencies link

In the template, the values are already crossed like this:

```text
BP header.uuid  = 14e467b4-...  ←→  RP dependencies.uuid  = 14e467b4-...
RP header.uuid  = 2d7ed858-...  ←→  BP dependencies.uuid  = 2d7ed858-...
```

Suggested practical order:

1. Generate 4 new UUIDs at [UUID Generator](https://www.uuidgenerator.net/).
2. Put two in the BP (`header` + `module`) and two in the RP (`header` + `module`).
3. Copy the RP `header.uuid` into the BP dependency that has a `uuid`.
4. Copy the BP `header.uuid` into the RP dependency that has a `uuid`.

If those pairs do not match, Minecraft may load one pack without the other (or neither).

### 2.3 Project name in `.env` and folder names

In the `.env` file, change:

```env
PROJECT_NAME="change-this-name"
```

The `PROJECT_NAME` value **must match** the folder names:

- `behavior_packs/<PROJECT_NAME>`
- `resource_packs/<PROJECT_NAME>`

If `.env` has `my-addon`, the folders must be named `behavior_packs/my-addon` and `resource_packs/my-addon`. Rename the `change-this-name` folders at the same time you update `.env`.

### 2.4 Deployment path (`MINECRAFT_PRODUCT`)

#### Windows (default game path)

If Minecraft is installed in the default location, leave:

```env
MINECRAFT_PRODUCT="BedrockGDK"
CUSTOM_DEPLOYMENT_PATH=""
```

The build copies the addon automatically into the game's development folder.

Possible values: `BedrockGDK`, `PreviewGDK`, `Custom`.

#### Linux or a custom path

Use `Custom` and set `CUSTOM_DEPLOYMENT_PATH` to the `com.mojang` folder where the game stores addons:

```env
MINECRAFT_PRODUCT="Custom"
CUSTOM_DEPLOYMENT_PATH="/home/perfect/OrionBE/instances/dev/game/Minecraft Bedrock/Users/Shared/games/com.mojang/"
```

Adjust the path for your environment (launcher, Flatpak, dedicated instance, etc.).

---

## 3. Set up the environment

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version)
- A code editor (recommended: [Visual Studio Code](https://code.visualstudio.com/))

### Windows — PowerShell execution policy

In PowerShell, inside the project folder, run **once per session**:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

This allows npm scripts to run correctly in that terminal session.

**Linux users:** you can skip this step.

### Install dependencies

```bash
npm i
```

After that, the template is ready for development.

### Test the project

Compile and deploy the addon to the game folder, with automatic rebuild on save:

```bash
npm run local-deploy -- --watch
```

In Minecraft, create or open a world, enable the Behavior Pack (and Resource Pack if needed), and play. After script changes, use `/reload` or leave and re-enter the world to see updates.

---

## 4. Next steps

1. Customize names, UUIDs, and `.env`
2. `npm i`
3. `npm run local-deploy -- --watch`
4. Edit `scripts/main.ts` and build your addon
5. Commit and push to GitHub for backup and history

---

## 5. Version the addon with Git

After customizing and starting development, use Git to save progress on GitHub.

### Commits and push

```bash
git add .
git commit -m "Describe what changed"
git push
```

### Branches, pull requests, and merge

When you want to isolate a feature or fix:

1. Create a branch (`git checkout -b my-feature`).
2. Commit on that branch.
3. Open a pull request on GitHub.
4. After review (if any), **merge** into the main branch.

### Why version on GitHub?

- **Backup** of your addon code off your machine
- **Version history** — restore an older state if something breaks
- Collaboration via branches, reviews, and merge
- A clear base for releases (for example, attaching the generated `.mcaddon`)

---

## 6. Bonus — development environment features

Beyond the basic flow, this template ships a full pipeline based on TypeScript, `just-scripts`, and `@minecraft/core-build-tasks`.

### Command overview

| Feature | Command | What it does |
| --- | --- | --- |
| Local deploy with watch | `npm run local-deploy -- --watch` | Compiles and copies packs/scripts into the game folder on every change |
| Build | `npm run build` | Compiles TypeScript and produces the bundle |
| Production build | `npm run build:production` | Same as build, but strips `dev:`-labeled blocks |
| Lint | `npm run lint` | Analyzes the code |
| Lint with autofix | `npm run lint -- --fix` | Attempts to fix issues automatically |
| `.mcaddon` package | `npm run mcaddon` | Builds a shareable addon file |
| Production package | `npm run mcaddon:production` | `.mcaddon` with a production build |
| Clean | `npm run clean` | Removes build artifacts (`dist/`, etc.) |

### The `dev:` label (development-only code)

The bundler (esbuild, via `just.config.ts`) can **strip** code blocks marked with the `dev:` label when you produce a production build.

In development (`npm run build` / `local-deploy`), `dev:` code **stays**.  
In production (`npm run build:production` / `mcaddon:production`), those blocks are **removed** from the final JavaScript.

Example:

```typescript
import { world } from "@minecraft/server";

world.afterEvents.playerSpawn.subscribe((event) => {
  // Runs always (dev and production)
  world.sendMessage(`Welcome, ${event.player.name}!`);

  // Only exists in development builds
  dev: {
    world.sendMessage("[DEBUG] playerSpawn fired");
    console.warn("spawn at", event.player.location);
  }
});
```

Use this for logs, test cheats, debug overlays, and any logic that should not ship in the `.mcaddon` you share.

### Watch and local deploy

`npm run local-deploy -- --watch` watches:

- `scripts/**/*.ts`
- behavior/resource pack files (`.json`, `.lang`, `.png`, etc.)

On each valid change, the project recompiles and copies into the folder configured in `.env` (`BedrockGDK`, `PreviewGDK`, or `CUSTOM_DEPLOYMENT_PATH`). No manual pack copying.

### TypeScript and official APIs

The template already includes:

- `@minecraft/server` and `@minecraft/server-ui` — Script API
- `@minecraft/vanilla-data` — typed IDs for blocks, items, entities, etc.
- `@minecraft/math` — vector/math helpers

You get typing, autocomplete, and fewer typos in game IDs.

### Package to share

- `npm run mcaddon` — writes `dist/packages/<PROJECT_NAME>.mcaddon`
- `npm run mcaddon:production` — same thing, without `dev:` code

Ideal for sharing with friends, publishing, or attaching to a GitHub release.

### Lint

`npm run lint` helps keep the code consistent (including Minecraft-oriented rules). Use `--fix` for simple automatic fixes.

### Summary

You write TypeScript; the environment compiles, packages, and (with the right path) drops the addon into the Minecraft folder. The `dev:` label keeps debug code out of what you ship — without maintaining two codebases.
