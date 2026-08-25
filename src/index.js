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
      addOption("client-overwrite", {
        question: "Do you want to overwrite the existing pocketbase client?",
        type: "boolean",
        default: false
      })
    }

    //INFO: Checks for existing server hooks
    if (fileExists(cwd, path.join(directory.src, "hooks.server.js"))) {
      addOption("hooks-overwrite", {
        question: "Do you want to overwrite the existing server hooks.server.js?",
        type: "boolean",
        default: false
      })
    }

    //INFO: Checks for existing .env
    if (fileExists(cwd, ".env")) {
      addOption("env-overwrite", {
        question: "Do you want to overwrite the existing .env?",
        type: "boolean",
        default: false
      })
    }

    //INFO: Checks for existing .env
    if (fileExists(cwd, "docker-compose.yml")) {
      addOption("docker-overwrite", {
        question: "Do you want to overwrite the existing docker-compose.yml?",
        type: "boolean",
        default: false
      })
    }
  },

  run: ({ sv, options, cancel }) => {
    //INFO: Sets pocketbase as a runtime dependency
    sv.dependency("pocketbase", "^0.28.0");

    //INFO: Unzipper used for unzipping the downloaded pocketbase binary
    sv.dependency("adm-zip", "^0.6.0")

    //INFO: Typed client wrapper - src/lib/pocketbase.ts
    writePocketBaseClient(sv)

    //INFO: Auth hooks - src/hooks.server.ts
    writeAuthHooks(sv, cancel)

    //INFO: Auth UI - src/routes/login & src/routes/register
    if (options.authUi) {
      writeAuthUi(sv)
    }

    //INFO: .env / .env.example
    writeEnvFiles(sv)

    //INFO: Docker vs Local binary
    options.pocketbase === "docker" ? writeDockerCompose(sv) : downloadPocketBaseBinary(cancel)

  },
  nextSteps: ({ options, cwd }) => {
    const pkgJson = loadPackageJson(cwd)

    const steps = [`cd ${pkgJson.data.name}/`,"Run `(p)npm install` if you haven't already"];
    steps.push(
      options.pocketbase === "docker"
        ? "Run `docker compose up -d` to start PocketBase"
        : "Run `./pocketbase serve` from a seperate terminal.",
    );
    steps.push("Run `(p)npm run dev` to start your app")
    return steps;
  },
});
