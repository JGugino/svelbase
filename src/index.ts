#!/usr/bin/env node

import { Command, Option } from "commander";
import * as prompt from "@clack/prompts";

const program = new Command();

program
  .name("svelbase")
  .description(
    "A CLI tool for creating SvelteKit projects with Pocketbase intergrations such as auth.",
  )
  .argument("[project-name]", "name of the project")
  .addOption(new Option("--ts, --typescript", "Use Typescript").default(true).conflicts(["--js", "--javascript"]))
  .addOption(new Option("--js, --javascript", "Use JavaScript").conflicts(["--ts", "--typescript"]))
  .addOption(new Option("--tw, --tailwind", "Use Tailwind"))
  .addOption(new Option("--docker", "Include a docker-compose for PocketBase"))
  .action(async (projectName: string | undefined, opts) => {
    prompt.intro(`svelbase (Typescript)`)
    const name = projectName ?? await prompt.text({ message: "Project name?" })

    const svelteType = await prompt.select({
      message: "Svelte or SvelteKit?",
      options: [
        {label: "Svelte (Vite)", value: "svelte"},
        {label: "SvelteKit", value: "sveltekit"}
      ]
    })

    prompt.note(`Name: ${String(name)} | Type: ${String(svelteType)}`)
    //Create project

    prompt.outro("Project setup complete!")
  });

program.parseAsync()
