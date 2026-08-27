import { defineAddon } from "sv";
import { options } from "./utils/options.js";
import { fileExists, loadPackageJson } from "@sveltejs/sv-utils";
import { writeAuthHooks } from "./utils/auth-hooks.js";
import { writePocketBaseClient } from "./utils/pb-client.js";
import { writeEnvFiles } from "./utils/env.js";
import { writeDockerCompose } from "./utils/docker.js";
import { downloadPocketBaseBinary } from "./utils/pb-binary-helper.js";
import path from "node:path";
import { writeAuthUi } from "./utils/auth-ui.js";

export default defineAddon({
  id: "@svelbase/svelbase",
  options,

  setup: ({ isKit, unsupported, directory, cwd, addOption }) => {
    //INFO: Make sure project is SvelteKit
    if (!isKit) unsupported("svelbase requires a SvelteKit project");

    //INFO: Check for existing pocketbase client
    if (fileExists(cwd, path.join(directory.lib, "pocketbase.js"))) {
      addOption("clientOverwrite", {
        question: "Do you want to overwrite the existing pocketbase client?",
        type: "boolean",
        default: false
      })
    }

    //INFO: Checks for existing server hooks
    if (fileExists(cwd, path.join(directory.src, "hooks.server.js"))) {
      addOption("hooksOverwrite", {
        question: "Do you want to overwrite the existing server hooks.server.js?",
        type: "boolean",
        default: false
      })
    }

    //INFO: Checks for existing .env
    if (fileExists(cwd, ".env")) {
      addOption("envOverwrite", {
        question: "Do you want to overwrite the existing .env?",
        type: "boolean",
        default: false
      })
    }

    //INFO: Checks for existing .env
    if (fileExists(cwd, "docker-compose.yml")) {
      addOption("dockerOverwrite", {
        question: "Do you want to overwrite the existing docker-compose.yml?",
        type: "boolean",
        default: false
      })
    }
  },

  run: ({ sv, options, cancel }) => {
    //INFO: Sets pocketbase as a runtime dependency
    sv.devDependency("pocketbase", "^0.28.0");

    //INFO: Typed client wrapper - src/lib/pocketbase.ts
    const clientOverwrite = /**@type {boolean}*/(options.clientOverwrite)

    writePocketBaseClient(sv, clientOverwrite)

    //INFO: Auth hooks - src/hooks.server.ts
    const hooksOverwrite = /**@type {boolean}*/(options.hooksOverwrite)

    writeAuthHooks(sv, cancel, hooksOverwrite)

    //INFO: Auth UI - src/routes/login & src/routes/register
    if (options.authUi) {
      writeAuthUi(sv)
    }

    //INFO: .env / .env.example
    const envOverwrite = /**@type {boolean}*/(options.envOverwrite)
    writeEnvFiles(sv, envOverwrite)

    //INFO: Docker vs Local binary
    const dockerOverwrite = /**@type {boolean}*/(options.dockerOverwrite)

    if (options.pb === "docker") {
      writeDockerCompose(sv, dockerOverwrite, options.pbVersion)
    } else if (options.pb === "local") {
      downloadPocketBaseBinary(cancel, options.pbVersion)
    }
  },
  nextSteps: ({ options, cwd, packageManager }) => {
    const pkgJson = loadPackageJson(cwd)

    const steps = [`Run '${packageManager} install' if you haven't already`];
    steps.push(
      options.pb === "docker"
        ? "Run `docker compose up -d` to start PocketBase"
        : "Run `./pb/pocketbase serve` from a seperate terminal.",
    );
    steps.push(`Run '${packageManager} run dev' to start your app`)
    return steps;
  },
});
