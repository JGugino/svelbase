import { execa } from "execa"

export interface ScaffoldOptions {
  name: string,
  type: string,
  useTypescript: boolean,
  useTailwind: boolean
}

const currentSVVersion = "0.17.0"
const currentViteVersion = "8.2.1"

export async function scaffoldSvelteProject(options: ScaffoldOptions) {
  const svelteKitArgs = [
    `sv@${currentSVVersion}`,
    "create",
    options.name,
    "--template",
    "minimal",
    "--types",
    options.useTypescript ? "ts" : "none",
    "--no-install"
  ]

  if (options.useTailwind) {
    svelteKitArgs.push("--add", 'tailwindcss=plugins:none')
  }

  const svelteArgs = [
    "create",
    `vite@${currentViteVersion}`,
    "--",
    "--template",
    `svelte${options.useTypescript ? "-ts" : ""}`,
    "--no-interactive",
    options.name
  ]

  if (options.type === "svelte") {
   await execa("npm", svelteArgs, {stdio: 'inherit'})
  } else {
   await execa("npx", svelteKitArgs, {stdio: 'inherit'})
  }
}
