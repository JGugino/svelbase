/**
 *
 * @param {import("sv").SvApi} sv
 *  @param {boolean} overwrite
 * @param {string} pbVersion
 */
export async function writeDockerCompose(sv, overwrite, pbVersion) {
  const COMPOSE_TEMPLATE = `services:
    pocketbase:
      image: ghcr.io/muchobien/pocketbase:${pbVersion}
      ports:
        - "8090:8090"
      volumes:
        - ./pb_data:/pb_data
      restart: unless-stopped
    `;

  sv.file('docker-compose.yml', (existing) => {
    if (existing && existing.trim().length > 0) {
      if (!overwrite) {
        //TODO: Find better solution for outputing custom messages to the cli
        console.log(`Overwrite docker-compose.yml: ${overwrite ? "yes" : "no"} | Skipping docker-compose`)
        return existing
      }
    }

    return COMPOSE_TEMPLATE
  });
}
