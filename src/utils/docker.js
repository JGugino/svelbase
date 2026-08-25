const COMPOSE_TEMPLATE = `services:
  pocketbase:
    image: ghcr.io/muchobien/pocketbase:latest
    ports:
      - "8090:8090"
    volumes:
      - ./pb_data:/pb_data
    restart: unless-stopped
`;

/**
 *
 * @param {import("sv").SvApi} sv
 *  @param {boolean} overwrite
 */
export async function writeDockerCompose(sv, overwrite) {
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
