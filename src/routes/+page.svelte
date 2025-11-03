<script lang="ts">
	import { upperCase } from './test.remote';

	let value = $state('Initial Value');
</script>

<input bind:value />
<button onclick={async () => (value = await upperCase(value))}>To Uppercase</button>
