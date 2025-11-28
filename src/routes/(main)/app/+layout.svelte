<script lang="ts">
	import ThemePicker from '$lib/components/ThemePicker.svelte';
	import { RUNTIME } from '$lib/config/env';

	let { children } = $props();
</script>

<div class="drawer lg:drawer-open">
	<input id="my-drawer-4" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content">
		<nav class="navbar w-full bg-base-300">
			<label for="my-drawer-4" aria-label="open sidebar" class="btn btn-square btn-ghost">
				<i class="fas fa-bars"></i>
			</label>
			<div class="px-4">dskmgr {RUNTIME == 'desktop' ? '- Desktop' : ''}</div>
			<div class="flex-1"></div>
			<ThemePicker />
		</nav>
		<div class="p-4">
			{@render children()}
		</div>
	</div>

	<div class="drawer-side is-drawer-close:overflow-visible">
		<label for="my-drawer-4" aria-label="close sidebar" class="drawer-overlay"></label>
		<div
			class="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64"
		>
			<ul class="menu w-full grow">
				<li>
					<button class="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Homepage">
						<i class="fas fa-home"> </i>
						<span class="is-drawer-close:hidden">Homepage</span>
					</button>
				</li>

				<li>
					<button class="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Settings">
						<i class="fas fa-cog"> </i>
						<span class="is-drawer-close:hidden">Settings</span>
					</button>
				</li>
			</ul>
		</div>
	</div>
</div>
