const ENV_LINE = 'PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090\n';

/**
 *
 * @param {import("sv").SvApi} sv
 */
export async function writeEnvFiles(sv) {
	// TODO: merge rather than overwrite if .env already has content —
	// other add-ons (databases, auth providers) commonly write env vars
	// too. For this draft, naive append-if-missing:
	sv.file('.env', (existing) =>
		existing.includes('PUBLIC_POCKETBASE_URL') ? existing : existing + ENV_LINE
	);

	sv.file('.env.example', (existing) =>
		existing.includes('PUBLIC_POCKETBASE_URL') ? existing : existing + ENV_LINE
	);
}
