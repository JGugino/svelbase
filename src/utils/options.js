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
  }).add("authUi", {
    question: "Do you want to add starter login/register pages?",
    type: "boolean",
    default: true
  })
  .build();
