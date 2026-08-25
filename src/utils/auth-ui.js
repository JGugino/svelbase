const LOGIN_UI_TEMPLATE = `
  <div id="account-login">
    <h2>Login</h2>
    <form action="?/login" method="POST">
      <input type="email" name="login-email" placeholder="Email" required>
      <input type="password" name="login-password" placeholder="Password" required>
      <button type="submit">Login</button>
    </form>
  </div>
  `
const LOGIN_ACTION_TEMPLATE = `
  import type { Actions } from '@sveltejs/kit';
  import { json, redirect } from '@sveltejs/kit';

  export const actions: Actions = {
	login: async ({ request, locals, cookies }) => {
		const data = await request.formData();

		const email = data.get('login-email')?.toString();
		const password = data.get('login-password')?.toString();

		if (!email || !password) {
			return json({ status: 'error', code: 'invalid-request', msg: 'Invalid form request' });
		}

		const loggedIn = await locals.pb.collection("users").authWithPassword(email, password);

		if (loggedIn) {
			cookies.set('auth', locals.pb.authStore.exportToCookie({}, 'auth'), { path: '/' });

			return redirect(303, '/dashboard');
		}

		return {
			status: 'error',
			code: 'user-login-failed',
			msg: 'Something went wrong while loggin in the user'
		};
	}
  };
  `
const REGISTER_UI_TEMPLATE = `
  <div id="account-register">
    <h2>Register</h2>
    <form action="?/register" method="POST">
      <input type="text" name="register-name" placeholder="Name" required>
      <input type="email" name="register-email" placeholder="Email" required>
      <input type="password" name="register-password" placeholder="Password" required>
      <input type="password" name="register-password-confirm" placeholder="Password Confirm" required>
      <button type="submit">Register</button>
    </form>
  </div>
  `

const REGISTER_ACTION_TEMPLATE = `
  import { CustomReqestType } from '$lib/scripts/pb/request.enums';
  import { type CustomPBRequestInfo, type UserCreateInfo } from '$lib/scripts/pb/requests.types.js';
  import { json } from '@sveltejs/kit';

  export const actions = {
	default: async (event) => {
		const data = await event.request.formData();

		const name = data.get('register-name')?.toString();
		const email = data.get('register-email')?.toString();
		const password = data.get('register-password')?.toString();
		const passwordConfirm = data.get('register-password-confirm')?.toString();

		if (!name || !email || !password || !passwordConfirm) {
			return json({ status: 'error', code: 'invalid-request', msg: 'Invalid form request' });
		}

		const requestInfo: CustomPBRequestInfo = {
			requestType: CustomReqestType.USER_CREATE,
			subRequestType: null,
			data: {
				name,
				email,
				password,
				passwordConfirm,
				role: 'admin'
			} as UserCreateInfo
		};

		const res = await event.fetch('/api/maintenance/crud', {
			method: 'POST',
			body: JSON.stringify({
				requestInfo
			})
		});

		const resJson = await res.json();

		console.log(resJson);

		if (resJson.success) {
			return {
				success: true
			};
		}

		return {
			success: false
		};
	}
  };  `

/**
 *
 * @param {import("sv").SvApi} sv
 */
export function writeAuthUi(sv) {
//INFO: Create login pages for ui and form action
 sv.file("src/routes/login/+page.svelte", () => LOGIN_UI_TEMPLATE)
 sv.file("src/routes/login/+page.server.svelte", () => LOGIN_ACTION_TEMPLATE)

  //INFO: Create register pages for ui and form action
 sv.file("src/routes/register/+page.svelte", () => REGISTER_UI_TEMPLATE)
 sv.file("src/routes/register/+page.server.svelte", () => REGISTER_ACTION_TEMPLATE)
}
