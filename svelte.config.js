import adapterStatic from '@sveltejs/adapter-static';
import adapterNode from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	kit: {
		adapter:
			process.env.ADAPTER == 'static'
				? adapterStatic({
						fallback: 'index.html',
						pages: 'build-static',
						assets: 'build-static'
					})
				: adapterNode({
						out: 'build-node'
					}),
		experimental: {
			remoteFunctions: true
		},
		csrf: {
			trustedOrigins: [
				'https://localhost:9527',
				'http://localhost:9527',
				'https://localhost:5173',
				'http://localhost:5173'
			]
		},
		serviceWorker: {
			register: process.env.ADAPTER == 'static'
		}
	},
	compilerOptions: {
		experimental: {
			async: true
		}
	}
};

export default config;
