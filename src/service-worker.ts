// Disables access to DOM typings like `HTMLElement` which are not available
// inside a service worker and instantiates the correct globals
/// <reference no-default-lib="true"/>
/// <reference lib="webworker" />

// Only necessary if you have an import from `$env/static/public`
/// <reference types="../.svelte-kit/ambient.d.ts" />

import * as env from '$env/static/public';

// This gives `self` the correct types
const self = globalThis.self as unknown as ServiceWorkerGlobalScope;

// Force service worker to activate immediately and claim all clients
self.addEventListener('install', () => {
	self.skipWaiting(); // Force activate new service worker immediately
});

self.addEventListener('activate', (event) => {
	event.waitUntil(self.clients.claim()); // Take control of all clients immediately
});

const targetURL = new URL(
	(env as unknown as { PUBLIC_BACKEND_ENDPOINT: string }).PUBLIC_BACKEND_ENDPOINT
);

self.addEventListener('fetch', (event) => {
	const url = new URL(event.request.url);
	const isRemoteFunctionCall = url.pathname.startsWith('/_app/remote/');
	const isAuthAPICall = url.pathname.startsWith('/api/auth/');

	// Only proxy remote function calls and auth API calls
	if (!isRemoteFunctionCall && !isAuthAPICall) {
		return; // Let the request proceed as normal
	}

	const newUrl = new URL(event.request.url);
	newUrl.host = targetURL.host;
	newUrl.protocol = targetURL.protocol;

	async function respond() {
		try {
			const req = event.request.clone();
			const headers = new Headers(req.headers);

			if (isRemoteFunctionCall) {
				// Always mark as remote function call to ensure CORS headers
				headers.set('X-SvelteKit-Remote', 'true');
			}

			const init: RequestInit = {
				method: req.method,
				headers,
				credentials: 'include',
				referrer: req.referrer,
				referrerPolicy: req.referrerPolicy,
				redirect: req.redirect,
				cache: req.cache
			};

			if (req.method !== 'GET' && req.method !== 'HEAD') {
				// Use arrayBuffer for binary-safe forwarding, then convert back
				const bodyBuffer = await req.arrayBuffer();
				init.body = bodyBuffer.byteLength > 0 ? bodyBuffer : null;
			}

			const response = await fetch(newUrl.toString(), init);

			// Validate response before returning
			if (!response.ok) {
				console.error(
					`[SW] Backend error ${response.status}: ${response.statusText} for ${newUrl}`
				);
				return new Response(
					JSON.stringify({
						type: 'error',
						status: response.status,
						error: `Backend server error: ${response.statusText}`
					}),
					{
						status: response.status,
						headers: { 'Content-Type': 'application/json' }
					}
				);
			}

			return response;
		} catch (error) {
			console.error(`[SW] Network error for ${newUrl}:`, error);
			return new Response(
				JSON.stringify({
					type: 'error',
					status: 503,
					error: 'Backend server unreachable'
				}),
				{
					status: 503,
					headers: { 'Content-Type': 'application/json' }
				}
			);
		}
	}

	event.respondWith(respond());
});
