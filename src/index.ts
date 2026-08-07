#!/usr/bin/env node

import { Command, Option } from "commander";
import * as prompt from "@clack/prompts";
import picocolors from "picocolors";
import { createProject } from "./commands/create";

const program = new Command();

program
  .name("svelbase")
  .description(
    "A CLI tool for creating Svelte projects with Pocketbase intergrations such as auth.",
  )
  .argument("[project-name]", "name of the project")
  .addOption(new Option("--ts, --typescript", "Use Typescript").default(true).conflicts(["--js", "--javascript"]))
  .addOption(new Option("--js, --javascript", "Use JavaScript").conflicts(["--ts", "--typescript"]))
  .addOption(new Option("--tw, --tailwind", "Use Tailwind (Only SvelteKit)"))
  .addOption(new Option("--docker", "Include a docker-compose for PocketBase"))
  .action(async (projectName: string | undefined, opts) => {
    prompt.intro(picocolors.bgCyan(picocolors.black("svelbase")))

    //Create project
    try {
      await createProject({
        name: projectName,
        useTypescript: !opts.js,
        useTailwind: Boolean(opts.tailwind),
        docker: Boolean(opts.docker)
      })
    } catch (err) {
      prompt.cancel(err instanceof Error ? err.message : "Something went wrong")
      process.exit(1)
    }

  });

program.parseAsync()
