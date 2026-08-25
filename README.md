# svelbase

**A [sv](https://svelte.dev/docs/cli/overview) community add-on for [PocketBase](https://pocketbase.io) integration in SvelteKit projects.**

[![npm version](https://img.shields.io/npm/v/@svelbase/sv.svg)](https://www.npmjs.com/package/@svelbase/sv)
[![license](https://img.shields.io/npm/l/@svelbase/sv.svg)](./LICENSE)

> [!IMPORTANT]
> Svelte maintainers have not reviewed community add-ons for malicious code. Use at your own discretion.

---

## Usage

Add to an **existing** SvelteKit project:

```shell
npx sv add @svelbase/sv
```

Or include it when **creating** a new one:

```shell
npx sv create my-app --add @svelbase/sv
```

## What you get

- 🔌 **One-command setup** — works on new or existing SvelteKit projects
- 🗄️ **Typed PocketBase client** — a ready-to-use wrapper at `src/lib/pocketbase.js`
- 🔐 **SSR-ready auth** — cookie-based auth wired into `src/hooks.server.ts`
- ⚙️ **Environment config** — `.env` / `.env.example` set up with `PUBLIC_POCKETBASE_URL`
- 🐳 **Docker or local binary** — run PocketBase however you prefer
- 🖥️ **Optional starter UI** — login/register pages, ready to customize

## Options

| Option | Description | Default |
|---|---|---|
| `pb` | How to run PocketBase — `local` (downloads a binary) or `docker` | `local` |
| `authUi` | Add starter login/register pages | `true` |

Pass options directly instead of answering the interactive prompts:

```shell
npx sv add @svelbase/sv="pb:docker,authUi:false"
```

## Local development

```shell
git clone https://github.com/JGugino/svelbase
cd svelbase
npm install
npm run build
```

Test against a scratch SvelteKit project without publishing:

```shell
npx sv add file:../svelbase
```

## Contributing

Issues and PRs are welcome — see [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

GNU GPL-3.0
