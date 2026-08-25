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
 */
export async function writeDockerCompose(sv) {
  sv.file('docker-compose.yml', () => COMPOSE_TEMPLATE);
}
