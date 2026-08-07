import { execa } from "execa"

export interface ScaffoldOptions {
  name: string,
  type: string,
  useTypescript: boolean,
  useTailwind: boolean
}

export async function scaffoldSvelteProject(options: ScaffoldOptions) {
  const svelteKitArgs = [
    "sv",
    "create",
    options.name,
    "--template",
    "minimal",
    "--types",
    options.useTypescript ? "typescript" : "none",
    "--no-install"
  ]

  if (options.useTailwind) {
    svelteKitArgs.push("--add-on", "tailwindcss")
  }

  const svelteArgs = [
    "create",
    "vite",
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

  //TODO: Copy contents of template files into newly created project
}
