import { defineAddon } from "sv";
import { options } from "./utils/options.js";
import { transforms } from "@sveltejs/sv-utils";
import { writeAuthHooks } from "./utils/auth-hooks.js";
import { writePocketBaseClient } from "./utils/pb-client.js";
import { writeEnvFiles } from "./utils/env.js";
import { writeDockerCompose } from "./utils/docker.js";
import { downloadPocketBaseBinary } from "./utils/pb-binary-helper.js";

export default defineAddon({
  id: "@svelbase/svelbase",
  options,

  setup: ({ isKit, unsupported }) => {
    if (!isKit) unsupported("svelbase requires a SvelteKit project");
  },

  run: ({ sv, options, cancel }) => {
    //INFO: Sets pocketbase as a runtime dependency
    sv.dependency("pocketbase", "^0.28.0");

    sv.dependency("adm-zip", "^0.6.0")

    //INFO: Typed client wrapper - src/lib/pocketbase.ts
    writePocketBaseClient(sv)

    //INFO: Auth hooks - src/hooks.server.ts
    writeAuthHooks(sv, cancel)

    //INFO: Auth UI - src/routes/login & src/routes/register

    //INFO: .env / .env.example
    writeEnvFiles(sv)

    //INFO: Docker vs Local binary
    options.pocketbase === "docker" ? writeDockerCompose(sv) : downloadPocketBaseBinary(cancel)

  },
  nextSteps: ({ options }) => {
    const steps = ["Run `(p)npm install` if you haven't already"];
    steps.push(
      options.pocketbase === "docker"
        ? "Run `docker compose up -d` to start PocketBase"
        : "Run `./pocketbase serve` from a seperate terminal.",
    );
    steps.push("Run `(p)npm run dev` to start your app")
    return steps;
  },
});
