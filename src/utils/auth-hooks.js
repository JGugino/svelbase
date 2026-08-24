const HOOKS_TEMPLATE = `import PocketBase from 'pocketbase';
import type { Handle } from '@sveltejs/kit';
import { PB_URL } from '$env/static/private';

export const handle: Handle = async ({ event, resolve }) => {
	//Create new PocketBase instance
	event.locals.pb = new PocketBase(PB_URL);

	// Load the store data from the request cookie string
	const authCookie = event.cookies.get('auth');

	if (authCookie) {
		event.locals.pb.authStore.loadFromCookie(authCookie, 'auth');
	}

	try {
		// Get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
		if (event.locals.pb.authStore.isValid) {
			await event.locals.pb.collection('users').authRefresh();
			event.cookies.set('auth', event.locals.pb.authStore.exportToCookie({}, 'auth'), {
				path: '/'
			});
		}
	} catch (e) {
		// Clear the auth store on failed refresh
		event.locals.pb.authStore.clear();
	}

	const response = await resolve(event);
	return response;
};`;

/**
 * @callback requestCancel
 * @param {string} reason
 * @returns {void}
 */

/**
 *
 * @param {import("sv").SvApi} sv
 * @param {requestCancel} cancel
 */
export async function writeAuthHooks(sv, cancel) {
	// TODO: this existence check is pseudocode — depends on what sv actually
	// exposes for "does this file exist / read current content" (possibly
	// sv.file's callback receives current content as an argument, similar
	// to the transform() pattern mentioned in the docs for AST-based edits).
	// Two real options once that's confirmed:
	//   1. If empty/missing: write HOOKS_TEMPLATE directly.
	//   2. If non-empty: attempt to detect a `handle` export and either
	//      merge (wrap the existing handle in sequence()) or cancel() with
	//      a clear message telling the user to wire it in manually.
	// Stubbing the "safe" path only for this rough draft:


	sv.file('src/hooks.server.ts', (/** @type {String} */ existingContent) => {
		if (existingContent && existingContent.trim().length > 0) {
			// Bail out rather than risk clobbering another add-on's hooks.
			cancel(
				'src/hooks.server.ts already exists. Please wire up PocketBase auth manually — see the svelbase README for the snippet to add.'
			);
			return existingContent; // no-op if cancel() doesn't throw immediately
		}
		return HOOKS_TEMPLATE;
	});
}
