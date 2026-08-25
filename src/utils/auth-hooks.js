const HOOKS_TEMPLATE = `import PocketBase from 'pocketbase';
import { env } from '$env/dynamic/public';

export const handle = async ({ event, resolve }) => {
	//Create new PocketBase instance
	event.locals.pb = new PocketBase(env.PUBLIC_POCKETBASE_URL);

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
 * @param {boolean} overwrite
 */
export async function writeAuthHooks(sv, cancel, overwrite) {
  sv.file("src/hooks.server.js", (/** @type {String} */ existingContent) => {

    //INFO: Check for existing content inside the hooks.server.js
    if (existingContent && existingContent.trim().length > 0) {

      //INFO: Cancel
      if (!overwrite) {
        //TODO: Find better solution for outputing custom messages to the cli
        console.log(`Overwrite hooks.server.js: ${overwrite ? "yes" : "no"} | Skipping hooks.server.js`)
        // cancel(
        //   "src/hooks.server.js already exists. Please add PocketBase auth manually to the hooks.server.js file — see the svelbase wiki for the snippet to add.",
        // );
        return existingContent; // no-op if cancel() doesn't throw immediately
      }
      return HOOKS_TEMPLATE
    }
    return HOOKS_TEMPLATE;
  });
}
