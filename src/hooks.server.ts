import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { building } from '$app/environment';
import { ALLOWED_ORIGINS } from '$lib/config/origins';

process.on('SIGINT', function () {
	process.exit();
});

const handleRemoteFunctionsProxy: Handle = async ({ event, resolve }) => {
	console.log('Incoming request for:', event.url.href);
	const origin = event.request.headers.get('origin');
	const isRemoteCall = event.request.headers.has('X-SvelteKit-Remote');
	const isRemotePath = event.url.pathname.startsWith('/_app/remote/');
	const isAuthApiCall = event.url.pathname.startsWith('/api/auth/');
	const isAllowedOrigin = origin && ALLOWED_ORIGINS.includes(origin);
	const isGetRequest = event.request.method === 'GET' || event.request.method === 'HEAD';

	// Handle OPTIONS preflight for remote function calls (needed when sending custom headers like X-SvelteKit-Remote)
	if (event.request.method === 'OPTIONS') {
		// Echo requested headers if provided, otherwise allow common ones
		const requestHeaders =
			event.request.headers.get('access-control-request-headers') ||
			'content-type,x-sveltekit-remote';
		const allowedOrigin = isAllowedOrigin ? origin! : ALLOWED_ORIGINS[0];

		return new Response(null, {
			status: 204,
			headers: {
				'Access-Control-Allow-Origin': allowedOrigin,
				'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
				'Access-Control-Allow-Headers': requestHeaders,
				'Access-Control-Allow-Credentials': 'true',
				'Access-Control-Max-Age': '600',
				Vary: 'Origin'
			}
		});
	}

	const res = await resolve(event);

	// Add CORS headers for remote function calls
	if (isRemoteCall || isRemotePath || isAuthApiCall) {
		res.headers.append('Vary', 'Origin');

		if (isAllowedOrigin) {
			res.headers.set('Access-Control-Allow-Origin', origin!);
			res.headers.set('Access-Control-Allow-Credentials', 'true');
		} else if (!origin && isGetRequest) {
			res.headers.set('Access-Control-Allow-Origin', '*');
			// Note: do not set Allow-Credentials with '*'
		} else if (origin && isGetRequest) {
			res.headers.set('Access-Control-Allow-Origin', origin);
		}
	}

	return res;
};

const handleAuthApiRequests: Handle = ({ event, resolve }) => {
	return svelteKitHandler({ event, resolve, auth, building });
};

const handleAuthSession: Handle = async ({ event, resolve }) => {
	const session = await auth.api.getSession({
		headers: event.request.headers
	});
	console.log('Session loaded in handle:', session);
	event.locals.auth = session;
	return resolve(event);
};

export const handle = sequence(
	handleRemoteFunctionsProxy,
	handleAuthApiRequests,
	handleAuthSession
);
