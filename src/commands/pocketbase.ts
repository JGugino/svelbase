import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import os from "node:os";
import { execa } from "execa";
import { spinner } from "@clack/prompts";
import fs from "node:fs";
import unzipper from "unzipper";

export interface PocketBaseOptions {
  name: string;
  useDocker: boolean;
}

const currentPocketBaseVersion = "0.39.10";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templatesDirectory = path.join(__dirname, "..", "templates");

export async function setupPocketBase(
  options: PocketBaseOptions,
  svleteType: string,
) {
  //INFO: Make lib folder
  const libDir: string = path.join(options.name, "src", "lib");
  await mkdir(libDir, { recursive: true });

  if (svleteType === "svelte") {
    //INFO: Copy pocketbase client
    await copyFile(
      path.join(templatesDirectory, "pb-client.ts.tmpl"),
      path.join(libDir, "pocketbase.ts"),
    );
  }

  if (svleteType === "sveltekit") {
    //INFO: Copy hooks
    await copyFile(
      path.join(templatesDirectory, "hooks.server.ts.tmpl"),
      path.join(options.name, "src", "hooks.server.ts"),
    );
  }

  if (options.useDocker) {
    //INFO: Copy docker-compose
    await copyFile(
      path.join(templatesDirectory, "docker-compose.yml"),
      path.join(options.name, "docker-compose.yml"),
    );
  } else {

    //TODO: Fix downloading of correct pb version of os, and extracting zip
    // const s = spinner();

    // s.start(`Downloading PocketBase v${currentPocketBaseVersion}`);
    // await downloadFileWithCurl(os.type());
    // s.stop("Pocketbase binary downloaded");

    // s.start("Unzipping PocketBase download");
    // fs.createReadStream(`./pocketbase_${currentPocketBaseVersion}.zip`)
    //   .pipe(unzipper.Extract({ path: path.join(options.name, "pocketbase") }))
    //   .on("close", () => {});
    // s.stop("PocketBase unzipped");
  }
}

async function downloadFileWithCurl(type: string) {
  //Linux = Linux
  //Windows = Windows_NT
  //MacOS == Darwin

  let downloadURL: string = "";

  switch (type) {
    case "Linux":
      downloadURL = `https://github.com/pocketbase/pocketbase/releases/download/v${currentPocketBaseVersion}/pocketbase_${currentPocketBaseVersion}_darwin_amd64.zip`;
      break;
    case "Darwin":
      downloadURL = `https://github.com/pocketbase/pocketbase/releases/download/v${currentPocketBaseVersion}/pocketbase_${currentPocketBaseVersion}_windows_amd64.zip`;
      break;
    case "Windows_NT":
      downloadURL = `https://github.com/pocketbase/pocketbase/releases/download/v${currentPocketBaseVersion}/pocketbase_${currentPocketBaseVersion}_windows_amd64.zip`;
      break;
  }
  const downloadArgs = [
    "-o -L",
    `pocketbase_${currentPocketBaseVersion}.zip`,
    downloadURL,
  ];

  await execa("curl", downloadArgs, { stdio: "inherit" });
}
