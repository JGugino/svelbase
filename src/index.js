import { defineAddon, defineAddonOptions } from "sv";

const options = defineAddonOptions()
  .add("pocketbase", {
    question: "Docker or Local binary?",
    type: "select",
    default: "docker",
    options: [
      { label: "Docker", value: "docker", hint: "Use a docker-compose for pb" },
      { label: "Local", value: "local", hint: "Download pocketbase binary" },
    ],
  })
  .build();

export default defineAddon({
  id: "@svelbase/svelbase",
  options,

  setup: ({ isKit, unsupported, dependsOn, runsAfter }) => {
    if (!isKit) unsupported("svelbase requires a SvelteKit project");
    dependsOn("eslint");
  },

  run: ({ directory, sv, options, cancel, file }) => {
    //Sets pocketbase as a runtime dependency
    sv.dependency("pocketbase", "^0.28.0");

    //INFO: Typed client wrapper - src/lib/pocketbase.ts
    //INFO: Auth hooks - src/hooks.server.ts
    //INFO: .env / .env.example
    //INFO: Docker vs Local binary
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
