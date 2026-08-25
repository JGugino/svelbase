const ENV_LINE = "PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090\n";

/**
 *
 * @param {import("sv").SvApi} sv
 * @param {boolean} overwrite
 */
export async function writeEnvFiles(sv, overwrite) {
  sv.file(".env", (existing) => {
    if (existing && existing.trim().length > 0) {
      if (!overwrite) {
        if (existing.includes("PUBLIC_POCKETBASE_URL")) {
          return existing;
        }
        return existing + ENV_LINE;
      }
    }
    return ENV_LINE;
  });

  sv.file(".env.example", (existing) => {
    if (existing && existing.trim().length > 0) {
      if (!overwrite) {
        if (existing.includes("PUBLIC_POCKETBASE_URL")) {
          return existing;
        }
        return existing + ENV_LINE;
      }
    }
    return ENV_LINE;
  });
}
