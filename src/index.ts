#!/usr/bin/env node

import { Command } from "commander";
import * as prompt from "@clack/prompts";

const program = new Command();

program
  .name("svelbase")
  .description(
    "A CLI tool for creating SvelteKit projects with Pocketbase intergrations such as auth.",
  )
  .argument("[project-name]", "name of the project")
  .action(async (projName) => {
    prompt.intro("svelbase")
    const name = projName ?? await prompt.text({ message: "Project name?" })
    prompt.outro("Project setup complete!")
  });

program.parse()
