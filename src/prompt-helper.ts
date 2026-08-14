import picocolors from "picocolors";
import * as prompt from "@clack/prompts";

export function errorNote(message: string | undefined) {
  prompt.note(message, picocolors.bgRedBright(picocolors.blackBright("Error")))
}

export function cancelNote(message: string | undefined) {
  prompt.note(message, picocolors.bgYellow(picocolors.black("Cancelled")))
}
