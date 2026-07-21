# Guia do template — Addon Development

Este repositório é um **template** para criar addons do Minecraft Bedrock com TypeScript. Antes de começar o seu projeto de verdade, configure o template com o nome, os UUIDs e o caminho de deploy do seu addon.

---

## 1. Criar o seu repositório a partir do template

Como este projeto é pensado como **template do GitHub**, o primeiro passo é gerar o repositório do **seu** addon a partir dele:

1. Abra a página do template no GitHub.
2. Clique em **Use this template** → **Create a new repository**.
3. Escolha o nome do repositório, a visibilidade (público/privado) e confirme.
4. Clone o repositório no seu computador:

```bash
git clone https://github.com/SEU_USUARIO/SEU_REPO.git
cd SEU_REPO
```

A partir daí, o código já está na sua conta e você pode personalizar, desenvolver e versionar o addon. O fluxo de commits, branches e merge está na [seção 5](#5-versionar-o-addon-com-git).

---

## 2. Personalizar o template

### 2.1 Nome e descrição (Behavior Pack e Resource Pack)

Abra os manifests e altere `name` e `description` nos **dois** packs:

- `behavior_packs/<nome-do-projeto>/manifest.json`
- `resource_packs/<nome-do-projeto>/manifest.json`

Exemplo:

```json
"name": "Meu Addon Incrível",
"description": "Descrição do meu addon"
```

Os campos devem refletir o seu projeto — não deixe os valores de placeholder.

### 2.2 Trocar os UUIDs (atenção às dependências)

Todo addon precisa de UUIDs **únicos**. Os valores que vêm no template são só exemplos — **gere UUIDs novos** no [UUID Generator](https://www.uuidgenerator.net/) e substitua todos os campos `uuid` abaixo.

No total são **4 UUIDs “próprios”** (2 no BP + 2 no RP) e **2 referências cruzadas** (a dependência de um pack aponta para o `header.uuid` do outro).

#### Behavior Pack — `behavior_packs/.../manifest.json`

Campos `uuid` que você precisa trocar (comentários só para a doc; JSON real não aceita `//`):

```json
{
  "format_version": 2,
  "header": {
    "name": "Change this name",
    "description": "Change this description",
    "uuid": "14e467b4-e3aa-49d3-8352-f8439fd7b2ee",
    // ▲ TROCAR — UUID do Behavior Pack (identidade do pack)
    "version": [1, 0, 0],
    "min_engine_version": [1, 26, 0]
  },
  "modules": [
    {
      "description": "Script resources",
      "language": "javascript",
      "type": "script",
      "uuid": "7c7e693f-99f4-41a9-95e0-1f57b37e1e12",
      // ▲ TROCAR — UUID do módulo de script (outro UUID novo, diferente do header)
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
      // ▲ TROCAR — mas NÃO invente um valor aleatório aqui:
      //    este UUID DEVE ser IGUAL ao header.uuid do Resource Pack
      "version": [1, 0, 0]
    }
  ]
}
```

Resumo no BP:

| Campo | O que fazer |
| --- | --- |
| `header.uuid` | Gerar UUID novo (UUID do Behavior Pack) |
| `modules[0].uuid` | Gerar **outro** UUID novo (módulo de script) |
| `dependencies` com `uuid` | Colocar o **mesmo** valor do `header.uuid` do Resource Pack |
| Dependências `@minecraft/server` / `@minecraft/server-ui` | **Não** são UUIDs do seu pack — não troque |

#### Resource Pack — `resource_packs/.../manifest.json`

```json
{
  "format_version": 2,
  "header": {
    "name": "Change this name",
    "description": "Change this description",
    "uuid": "2d7ed858-97eb-48a0-b180-7c80d1ce9a48",
    // ▲ TROCAR — UUID do Resource Pack (identidade do pack)
    "version": [1, 0, 0],
    "min_engine_version": [1, 20, 30]
  },
  "modules": [
    {
      "description": "My Resource Pack",
      "type": "resources",
      "uuid": "503fe660-142b-46a2-8fec-34a54e944720",
      // ▲ TROCAR — UUID do módulo de resources (outro UUID novo, diferente do header)
      "version": [1, 0, 0]
    }
  ],
  "dependencies": [
    {
      "uuid": "14e467b4-e3aa-49d3-8352-f8439fd7b2ee",
      // ▲ TROCAR — mas NÃO invente um valor aleatório aqui:
      //    este UUID DEVE ser IGUAL ao header.uuid do Behavior Pack
      "version": [1, 0, 0]
    }
  ]
}
```

Resumo no RP:

| Campo | O que fazer |
| --- | --- |
| `header.uuid` | Gerar UUID novo (UUID do Resource Pack) |
| `modules[0].uuid` | Gerar **outro** UUID novo (módulo de resources) |
| `dependencies[0].uuid` | Colocar o **mesmo** valor do `header.uuid` do Behavior Pack |

#### Como as dependências se ligam

No template, os valores já estão cruzados assim:

```text
BP header.uuid  = 14e467b4-...  ←→  RP dependencies.uuid  = 14e467b4-...
RP header.uuid  = 2d7ed858-...  ←→  BP dependencies.uuid  = 2d7ed858-...
```

Ordem prática sugerida:

1. Gere 4 UUIDs novos no [UUID Generator](https://www.uuidgenerator.net/).
2. Coloque dois no BP (`header` + `module`) e dois no RP (`header` + `module`).
3. Copie o `header.uuid` do RP para a dependência com `uuid` no BP.
4. Copie o `header.uuid` do BP para a dependência com `uuid` no RP.

Se esses pares não baterem, o Minecraft pode carregar um pack sem o outro (ou nenhum dos dois).

### 2.3 Nome do projeto no `.env` e nas pastas

No arquivo `.env`, altere:

```env
PROJECT_NAME="change-this-name"
```

O valor de `PROJECT_NAME` **deve ser igual** ao nome das pastas:

- `behavior_packs/<PROJECT_NAME>`
- `resource_packs/<PROJECT_NAME>`

Se o `.env` tiver `meu-addon`, as pastas precisam se chamar `behavior_packs/meu-addon` e `resource_packs/meu-addon`. Renomeie as pastas `change-this-name` ao mesmo tempo em que atualiza o `.env`.

### 2.4 Caminho de deploy (`MINECRAFT_PRODUCT`)

#### Windows (caminho padrão do jogo)

Se o Minecraft estiver instalado no local padrão, deixe:

```env
MINECRAFT_PRODUCT="BedrockGDK"
CUSTOM_DEPLOYMENT_PATH=""
```

O build copia o addon automaticamente para a pasta de desenvolvimento do jogo.

Valores possíveis: `BedrockGDK`, `PreviewGDK`, `Custom`.

#### Linux ou caminho customizado

Use `Custom` e aponte `CUSTOM_DEPLOYMENT_PATH` para a pasta `com.mojang` onde o jogo guarda os addons:

```env
MINECRAFT_PRODUCT="Custom"
CUSTOM_DEPLOYMENT_PATH="/home/perfect/OrionBE/instances/dev/game/Minecraft Bedrock/Users/Shared/games/com.mojang/"
```

Ajuste o caminho para o seu ambiente (launcher, Flatpak, instância dedicada, etc.).

---

## 3. Preparar o ambiente

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão LTS)
- Editor de código (recomendado: [Visual Studio Code](https://code.visualstudio.com/))

### Windows — política de execução do PowerShell

No PowerShell, na pasta do projeto, rode **uma vez por sessão**:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

Isso permite que scripts npm rodem corretamente nesta sessão do terminal.

**Usuários Linux:** podem ignorar este passo.

### Instalar dependências

```bash
npm i
```

Depois disso, o template está pronto para desenvolvimento.

### Testar o projeto

Compile e envie o addon para a pasta do jogo, com recarregamento automático ao salvar arquivos:

```bash
npm run local-deploy -- --watch
```

No Minecraft, crie ou abra um mundo, ative o Behavior Pack (e o Resource Pack, se necessário) e jogue. Ao alterar scripts, use `/reload` ou saia e entre no mundo de novo para ver as mudanças.

---

## 4. Próximos passos

1. Personalizar nomes, UUIDs e `.env`
2. `npm i`
3. `npm run local-deploy -- --watch`
4. Editar `scripts/main.ts` e construir o seu addon
5. Commits e push no GitHub para backup e histórico

---

## 5. Versionar o addon com Git

Depois de personalizar e começar a desenvolver, use o Git para salvar o progresso no GitHub.

### Commits e push

```bash
git add .
git commit -m "Descreva o que mudou"
git push
```

### Branches, pull requests e merge

Quando quiser isolar uma feature ou correção:

1. Crie uma branch (`git checkout -b minha-feature`).
2. Faça commits nela.
3. Abra um pull request no GitHub.
4. Depois da revisão (se houver), faça o **merge** na branch principal.

### Por que versionar no GitHub?

- **Backup** do código do addon fora da sua máquina
- **Histórico de versões** — voltar a um estado antigo se algo quebrar
- Colaboração com outras pessoas via branches, reviews e merge
- Base clara para releases (por exemplo, anexar o `.mcaddon` gerado)

---

## 6. Bônus — funcionalidades do ambiente de desenvolvimento

Além do fluxo básico, este template traz um pipeline completo baseado em TypeScript, `just-scripts` e `@minecraft/core-build-tasks`.

### Visão geral dos comandos

| Recurso | Comando | O que faz |
| --- | --- | --- |
| Deploy local com watch | `npm run local-deploy -- --watch` | Compila e copia packs/scripts para a pasta do jogo a cada alteração |
| Build | `npm run build` | Compila TypeScript e gera o bundle |
| Build de produção | `npm run build:production` | Igual ao build, mas remove trechos com label `dev:` |
| Lint | `npm run lint` | Analisa o código |
| Lint com correção | `npm run lint -- --fix` | Tenta corrigir problemas automaticamente |
| Pacote `.mcaddon` | `npm run mcaddon` | Gera um arquivo compartilhável do addon |
| Pacote de produção | `npm run mcaddon:production` | `.mcaddon` com build de produção |
| Limpeza | `npm run clean` | Remove artefatos de build (`dist/`, etc.) |

### Label `dev:` (código só para desenvolvimento)

O bundler (esbuild, via `just.config.ts`) pode **remover** trechos de código marcados com o label `dev:` quando você gera um build de produção.

Em desenvolvimento (`npm run build` / `local-deploy`), o código com `dev:` **permanece**.  
Em produção (`npm run build:production` / `mcaddon:production`), esses trechos são **retirados** do JavaScript final.

Exemplo:

```typescript
import { world } from "@minecraft/server";

world.afterEvents.playerSpawn.subscribe((event) => {
  // Roda sempre (dev e produção)
  world.sendMessage(`Bem-vindo, ${event.player.name}!`);

  // Só existe no build de desenvolvimento
  dev: {
    world.sendMessage("[DEBUG] playerSpawn disparado");
    console.warn("spawn at", event.player.location);
  }
});
```

Use isso para logs, cheats de teste, overlays de debug e qualquer lógica que não deve ir no `.mcaddon` que você compartilha.

### Watch e deploy local

`npm run local-deploy -- --watch` observa mudanças em:

- `scripts/**/*.ts`
- arquivos dos behavior/resource packs (`.json`, `.lang`, `.png`, etc.)

A cada mudança válida, o projeto é recompilado e copiado para a pasta configurada no `.env` (`BedrockGDK`, `PreviewGDK` ou `CUSTOM_DEPLOYMENT_PATH`). Você não precisa copiar packs manualmente.

### TypeScript e APIs oficiais

O template já inclui:

- `@minecraft/server` e `@minecraft/server-ui` — Script API
- `@minecraft/vanilla-data` — IDs tipados de blocos, itens, entidades, etc.
- `@minecraft/math` — utilitários de vetor/matemática

Isso dá tipagem, autocomplete e menos erro de digitação em IDs do jogo.

### Empacotar para compartilhar

- `npm run mcaddon` — gera `dist/packages/<PROJECT_NAME>.mcaddon`
- `npm run mcaddon:production` — mesma coisa, sem o código `dev:`

Ideal para enviar a amigos, publicar ou anexar em uma release no GitHub.

### Lint

`npm run lint` ajuda a manter o código consistente (incluindo regras voltadas a Minecraft). Use `--fix` quando quiser correções automáticas simples.

### Resumo

Você escreve TypeScript, o ambiente compila, empacota e (com o caminho certo) já coloca o addon na pasta do Minecraft. O label `dev:` separa debug do que vai para o público — sem manter duas bases de código.
