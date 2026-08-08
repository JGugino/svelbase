import * as prompt from "@clack/prompts";
import picocolors from "picocolors";
import { scaffoldSvelteProject } from "./svelte";
import { setupPocketBase } from "./pocketbase";
import { writeEnvFile } from "./env";
import { execa } from "execa";

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

  let useTailwind: boolean = false

  if (svelteType === "sveltekit") {
    useTailwind = options.useTailwind || ((await prompt.confirm({
      message: "Add Tailwind CSS?",
      initialValue: false
    })) as boolean)
  }

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

  spinner.start(`Setting up PocketBase (${useDocker ? "docker" : "binary"})`)
  await setupPocketBase({ name: projectName, useDocker }, svelteType as string)
  spinner.stop('PocketBase configured')


  //TODO: Fix error that occurs while attempting to install sdk
  // const installSDK = await prompt.confirm({
  //   message: "Install the PocketBase Client SDK?",
  //   initialValue: true
  // })

  // if (installSDK) {
  //   spinner.start("Installing client SDK")
  //   //INFO: Pocketbase Client SDK install
  //   const installArgs = [
  //     "install",
  //     "pocketbase",
  //     "--save"
  //   ]

  //   await execa({ cwd: options.name })("npm", installArgs, { stdio: 'inherit' })
  //   spinner.stop("Client SDK installed")


  spinner.start("Creating enviroment files")
  await writeEnvFile(projectName)
  spinner.stop("Enviroment files created")

  prompt.outro(`${picocolors.greenBright("Done!")} Next Steps: \n\n` +
              `cd ${projectName}\n` +
              `npm install pocketbase --save\n` +
              `npm install\n` +
              (useDocker ? `docker compose up -d ${picocolors.dim("# starts PocketBase")}\n` : `./pocketbase serve ${picocolors.dim("# in a separate terminal")}\n`) +
              'npm run dev'
  )

}
