<script lang="ts">
	import Login from '$lib/Login.svelte';
	import { TOKEN } from '$lib/spotify';
	import Player from '$lib/Player.svelte';
</script>

{#if !TOKEN}
	<Login />
{:else}
	<button
		class="btn btn-active"
		on:click={() => {
			localStorage.removeItem('token');
			window.location.reload();
		}}>Logout</button
	>

	<Player />
{/if}
