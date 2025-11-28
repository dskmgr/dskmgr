<script lang="ts">
	import { authClient } from '$lib/client/auth';

	let { user } = $props<{ user: { name?: string; email?: string; image?: string | null } }>();

	// Get initials from name or email
	function getInitials(name?: string, email?: string): string {
		if (name) {
			return name
				.split(' ')
				.map((n) => n[0])
				.join('')
				.toUpperCase()
				.slice(0, 2);
		}
		if (email) {
			return email[0].toUpperCase();
		}
		return 'U';
	}

	async function handleLogout() {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					window.location.href = '/auth/sign-in';
				}
			}
		});
	}

	let initials = $derived(getInitials(user.name, user.email));
</script>

<details class="dropdown dropdown-end">
	<summary class="btn btn-ghost btn-circle avatar placeholder">
		<div class="w-10 rounded-full bg-neutral text-neutral-content">
			{#if user.image}
				<img src={user.image} alt={user.name || user.email} />
			{:else}
				<span class="text-sm">{initials}</span>
			{/if}
		</div>
	</summary>
	<ul class="dropdown-content menu bg-base-100 rounded-box z-[1] w-64 p-2 shadow-lg mt-3">
		<!-- User Info Header -->
		<li class="menu-title">
			<div class="flex flex-col gap-1 px-2 py-3">
				{#if user.name}
					<div class="font-semibold text-base-content">{user.name}</div>
				{/if}
				{#if user.email}
					<div class="text-sm text-base-content/70">{user.email}</div>
				{/if}
			</div>
		</li>
		<hr class="my-2" />

		<!-- Menu Items -->
		<li>
			<a href="/app/profile">
				<i class="fas fa-user"></i>
				Profile
			</a>
		</li>
		<li>
			<a href="/app/settings">
				<i class="fas fa-cog"></i>
				Settings
			</a>
		</li>
		<hr class="my-2" />
		<li>
			<button onclick={handleLogout} class="text-error">
				<i class="fas fa-sign-out-alt"></i>
				Logout
			</button>
		</li>
	</ul>
</details>
