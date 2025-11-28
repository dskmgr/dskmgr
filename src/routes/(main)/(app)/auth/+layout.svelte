<script>
	import ThemePicker from '$lib/components/ThemePicker.svelte';
	import { page } from '$app/stores';

	let { children } = $props();

	let isSignUp = $derived($page.url.pathname.includes('sign-up'));
	let isSignIn = $derived($page.url.pathname.includes('sign-in'));
</script>

<div class="min-h-screen flex items-center justify-center bg-base-200 p-4">
	<div class="absolute top-4 right-4">
		<ThemePicker />
	</div>

	<div class="card card-border w-full max-w-md bg-base-100">
		<!-- Tabs for Sign In / Sign Up -->
		<div role="tablist" class="tabs tabs-box tabs-border">
			<a href="/auth/sign-in" role="tab" class="tab" class:tab-active={isSignIn}> Sign In </a>
			<a href="/auth/sign-up" role="tab" class="tab" class:tab-active={isSignUp}> Sign Up </a>
		</div>

		<!-- Card Body -->
		<div class="card-body">
			{@render children()}
		</div>
	</div>
</div>
