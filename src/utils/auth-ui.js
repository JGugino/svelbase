const LOGIN_UI_TEMPLATE = `
  <div id="account-login">
    <h2>Login</h2>
    <form action="?/login" method="POST">
      <input type="email" name="login-email" placeholder="Email" required>
      <input type="password" name="login-password" placeholder="Password" required>
      <button type="submit">Login</button>
    </form>
  </div>
  `;
const LOGIN_ACTION_TEMPLATE = `
  import { json, redirect } from '@sveltejs/kit';

  export const actions = {
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

			return redirect(303, '/');
		}

		return {
			status: 'error',
			code: 'user-login-failed',
			msg: 'Something went wrong while logging in the user'
		};
	}
  };
  `;
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
  `;

const REGISTER_ACTION_TEMPLATE = `
  import { json } from '@sveltejs/kit';

  export const actions = {
	register: async (event, locals) => {
		const data = await event.request.formData();

		const name = data.get('register-name')?.toString();
		const email = data.get('register-email')?.toString();
		const password = data.get('register-password')?.toString();
		const passwordConfirm = data.get('register-password-confirm')?.toString();

		if (!name || !email || !password || !passwordConfirm) {
			return json({ status: 'error', code: 'invalid-request', msg: 'Invalid form request' });
		}

		const regData = {
			name,
			email,
			password,
			passwordConfirm,
		}

		const created = await locals.pb.collection('users').create(regData)

		if (created) {
			return {
				success: true
			};
		}

		return {
			success: false
		};
	}
  };  `;

/**
 *
 * @param {import("sv").SvApi} sv
 */
export function writeAuthUi(sv) {
  //INFO: Create login pages for ui and form action
  sv.file("src/routes/login/+page.svelte", (existing) => {
    if (existing && existing.trim().length > 0) {
      return existing;
    }

    return LOGIN_UI_TEMPLATE;
  });
  sv.file("src/routes/login/+page.server.js", (existing) => {
    if (existing && existing.trim().length > 0) {
      return existing;
    }

    return LOGIN_ACTION_TEMPLATE;
  });

  //INFO: Create register pages for ui and form action
  sv.file("src/routes/register/+page.svelte", (existing) => {
    if (existing && existing.trim().length > 0) {
      return existing;
    }

    return REGISTER_UI_TEMPLATE;
  });
  sv.file("src/routes/register/+page.server.js", (existing) => {
    if (existing && existing.trim().length > 0) {
      return existing;
    }

    return REGISTER_ACTION_TEMPLATE;
  });
}
