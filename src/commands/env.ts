import { writeFile } from "node:fs/promises"
import path from "node:path"

export async function writeEnvFile(projectName: string) {
  const content = `PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090\n`
  await writeFile(path.join(projectName, ".env"), content)
  await writeFile(path.join(projectName, ".env.example"), content)
}
