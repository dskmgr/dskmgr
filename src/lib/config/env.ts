import { browser } from '$app/environment';

export const RUNTIME: 'web' | 'desktop' = !!(browser && (window as any).__TAURI_INTERNALS__)
	? 'desktop'
	: 'web';
