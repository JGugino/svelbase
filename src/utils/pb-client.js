const CLIENT_TEMPLATE = `import PocketBase from 'pocketbase';
import { env } from '$env/dynamic/public';

/**
 *
 * @param {string} cookie
 * @returns {PocketBase}
 */
export function createPocketBase(cookie) {

  /**
  * @type {PocketBase}
  */
	const pb = new PocketBase(env.PUBLIC_POCKETBASE_URL ?? 'http://127.0.0.1:8090');

	if (cookie) {
		pb.authStore.loadFromCookie(cookie);
	}

	return pb;
}`;

/**
 *
 * @param {import("sv").SvApi} sv
 */
export async function writePocketBaseClient(sv) {
	// TODO: confirm whether sv.file overwrites unconditionally or expects
	// the caller to check existence first. If a project already has
	// src/lib/pocketbase.ts (e.g. from re-running the add-on), decide
	// whether to skip, prompt, or overwrite.

	sv.file('src/lib/pocketbase.js', () => CLIENT_TEMPLATE);
}
