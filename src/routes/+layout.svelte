<script lang="ts">
	import '$lib/app.postcss';
	import { onMount } from 'svelte';

	onMount(() => {
		if (
			!localStorage.getItem('token') &&
			!['/login', '/callback'].includes(window.location.pathname.toLowerCase())
		) {
			window.location.href = '/login';
		}
	});
</script>

<slot />
