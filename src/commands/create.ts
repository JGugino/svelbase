import * as prompt from "@clack/prompts";
import picocolors from "picocolors";
import { scaffoldSvelteProject } from "./svelte";

export interface CreateOptions {
  name: string | undefined;
  useTypescript: boolean;
  useTailwind: boolean;
  docker: boolean;
}

export async function createProject(options: CreateOptions) {
  const projectName =
    options.name ??
    ((await prompt.text({
      message: "Project name?",
      placeholder: "Example project",
      validate: (val) => {
        if (!val) return "Please enter a name";
        if (!/^[a-z0-9-_]+$/i.test(val)) {
          return "Use letters, numbers, hyphens, and underscores only."
        }
      }
    })) as string);

  if (prompt.isCancel(projectName)) {
    prompt.cancel("Cancelled.")
    process.exit(0)
  }

  const svelteType = await prompt.select({
    message: "Svelte or SvelteKit?",
    options: [
      { label: "SvelteKit", value: "sveltekit" },
      { label: "Svelte (Vite)", value: "svelte" },
    ],
  });

  const useTailwind = options.useTailwind || ((await prompt.confirm({
    message: "Add Tailwind CSS?",
    initialValue: false
  })) as boolean)

  const useDocker = options.docker || ((await prompt.confirm({
    message: "Include a docker-compose for local",
    initialValue: false
  })) as boolean)

  const spinner = prompt.spinner();

  spinner.start(`Scaffolding ${svelteType === "svelte" ? "Svelte" : "SvelteKit"} project`)

  await scaffoldSvelteProject({
    name: projectName,
    type: svelteType as string,
    useTailwind,
    useTypescript: options.useTypescript
  })

  spinner.stop(`${svelteType === "svelte" ? "Svelte" : "SvelteKit"} scaffolding complete.`)

}
