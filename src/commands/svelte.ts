import * as prompt from "@clack/prompts";
import { execa, ExecaError } from "execa"
import picocolors from "picocolors";
import { errorNote } from "../prompt-helper";

export interface ScaffoldOptions {
  name: string,
  type: string,
  useTypescript: boolean,
  useTailwind: boolean
}

export async function scaffoldSvelteProject(options: ScaffoldOptions) {
  const svelteKitArgs = [
    "-y",
    `sv`,
    "create",
    "--template",
    "minimal",
    "--types",
    options.useTypescript ? "ts" : "none",
    "--no-install",
    options.name
  ]

  if (options.useTailwind) {
    svelteKitArgs.push("--add", 'tailwindcss=plugins:none')
  }

  const svelteArgs = [
    "-y",
    "create",
    `vite`,
    "--",
    "--template",
    `svelte${options.useTypescript ? "-ts" : ""}`,
    "--no-interactive",
    options.name
  ]

  if (options.type === "svelte") {
    try {
      await execa("npm", svelteArgs, {stdio: 'inherit'})
    } catch (err) {
      if (err == typeof ExecaError) {
        const execaError: ExecaError = err as ExecaError
        errorNote(execaError.message)
        process.exit(1)
      }
    }

  } else {
    try {
      await execa("npx", svelteKitArgs, {stdio: 'inherit'})
    } catch (err) {
      if (err == typeof ExecaError) {
        const execaError: ExecaError = err as ExecaError
        errorNote(execaError.message)
        process.exit(1)
      }
    }
  }
}
