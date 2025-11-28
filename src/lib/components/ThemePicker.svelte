<script>
	import { browser } from '$app/environment';
	import { theme, THEME_LOCAL_STORAGE_KEY } from '$lib/state/theme.svelte';

	$: theme.subscribe((value) => {
		if (browser) document.documentElement.setAttribute('data-theme', value);
	});
</script>

<label class="toggle text-base-content">
	<input
		type="checkbox"
		value="synthwave"
		class="theme-controller"
		data-toggle-theme="dark,light"
		on:change={(e) => {
			theme.set(e.currentTarget.checked ? 'dark' : 'light');
			localStorage.setItem(THEME_LOCAL_STORAGE_KEY, $theme);
		}}
		checked={$theme === 'dark'}
	/>

	<i class="fas fa-sun"></i>
	<i class="fas fa-moon"></i>
</label>

<style>
	.fas {
		width: 0.5rem;
		height: 0.5rem;
		font-size: 0.6rem;
		padding: 0.2175rem 0.17rem;
		border-radius: 0.5rem;
	}
</style>
