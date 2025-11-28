<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import '../app.css';
	import { theme } from '$lib/state/theme.svelte';

	let { children } = $props();

	const localStorageKey = 'theme-preference';

	onMount(() => {
		const storedTheme = localStorage.getItem(localStorageKey) as 'light' | 'dark' | null;
		if (storedTheme) {
			theme.set(storedTheme);
		} else {
			const prefersDark =
				window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
			theme.set(prefersDark ? 'dark' : 'light');
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
