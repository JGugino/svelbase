import { defineAddonOptions } from "sv";

export const options = defineAddonOptions()
  .add("pb", {
    question: "Docker or Local binary?",
    type: "select",
    default: "docker",
    options: [
      { label: "Docker", value: "docker", hint: "Use a docker-compose for pb" },
      { label: "Local", value: "local", hint: "Download pocketbase binary" },
    ],
  })
  .add("pbVersion", {
    question: "Pick a PocketBase Version",
    type: "select",
    default: "0.40.1",
    options: [
      { label: "v0.40.1", value: "0.40.1", hint: "latest" },
      { label: "v0.39.11", value: "0.39.11"},
      { label: "v0.38.2", value: "0.38.2" },
    ],
  })
  .add("authUi", {
    question: "Do you want to add starter login/register pages?",
    type: "boolean",
    default: true,
  })
  .build();
