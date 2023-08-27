<script lang="ts">
	import { onMount } from 'svelte';

	onMount(async () => {
		// get user's tracks
		await fetch('https://api.spotify.com/v1/me/tracks?offset=0&limit=20', {
			// authorization header
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		})
			.then((r) => r.json())
			.then(console.log);
	});
</script>

<button
	on:click={() => {
		localStorage.removeItem('token');
		window.location.reload();
	}}>Logout</button
>
