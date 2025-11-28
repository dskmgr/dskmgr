<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/client/auth';

	let email = $state('');
	let password = $state('');
	let name = $state('');
	let loading = $state(false);
	let errorMessage = $state('');

	async function signUp() {
		loading = true;
		errorMessage = '';

		const { data, error } = await authClient.signUp.email(
			{
				email,
				password,
				name,
				callbackURL: '/app/welcome'
			},
			{
				onRequest: (ctx) => {
					loading = true;
				},
				onSuccess: (ctx) => {
					loading = false;
					// somehow the redirect does not work
					goto('/app/welcome');
				},
				onError: (ctx) => {
					loading = false;
					errorMessage = ctx.error.message;
				}
			}
		);
	}
</script>

<h2 class="card-title mb-4">Create your account</h2>

<form
	onsubmit={(e) => {
		e.preventDefault();
		signUp();
	}}
>
	<!-- Name Input -->
	<label class="input mb-4">
		<span class="label">Name</span>
		<input type="text" placeholder="Enter your name" class="input" bind:value={name} required />
	</label>

	<!-- Email Input -->
	<label class="input mb-4">
		<span class="label">Email</span>
		<input type="email" placeholder="Enter your email" class="input" bind:value={email} required />
	</label>

	<!-- Password Input -->
	<label class="input mb-4">
		<span class="label">Password</span>
		<input
			type="password"
			placeholder="Enter your password (min 8 characters)"
			class="input"
			bind:value={password}
			required
			minlength="8"
		/>
	</label>

	<!-- Error Alert -->
	{#if errorMessage}
		<div role="alert" class="alert alert-error mb-4">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6 shrink-0"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			<span>{errorMessage}</span>
		</div>
	{/if}

	<!-- Submit Button -->
	<button type="submit" class="btn btn-primary btn-block" disabled={loading}>
		{#if loading}
			<span class="loading loading-spinner loading-sm"></span>
			Creating account...
		{:else}
			Sign Up
		{/if}
	</button>
</form>

<div class="divider">OR</div>

<p class="text-center text-sm">
	Already have an account?
	<a href="/auth/sign-in" class="link link-primary">Sign in here</a>
</p>
