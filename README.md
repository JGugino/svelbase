# svelbase

Scaffold a SvelteKit + PocketBase project in one command.

## Usage

```bash
npx svelbase my-app
```

You'll be prompted for Svelte(w/ Vite)/SvelteKit, TypeScript/JavaScript, Tailwind CSS, and whether to run PocketBase via Docker. svelbase then:

- Scaffolds SvelteKit using `sv create`
- Adds a typed PocketBase client at `src/lib/pocketbase.ts`
- Wires up cookie-based SSR auth in `src/hooks.server.ts`
- Writes `.env` / `.env.example` with `PUBLIC_POCKETBASE_URL`
- Optionally adds a `docker-compose.yml` for local PocketBase

## Local development

```bash
npm install
npm run dev     # watch mode via tsdown
npm link        # test the `svelbase` command locally
```


## License

GPL-3.0
