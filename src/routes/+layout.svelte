<script lang="ts">
	import '$lib/tailwind.postcss';
	import { LOGGED_IN, spotifySDK } from '$lib/spotify';
	import { onMount } from 'svelte';
	import { SpotifyApi } from '@spotify/web-api-ts-sdk';

	onMount(() => {
		if (LOGGED_IN) {
			$spotifySDK = SpotifyApi.withAccessToken(
				localStorage.getItem('clientID')!,
				JSON.parse(localStorage.getItem('token')!)
			);
		}
	});
</script>

<main class="px-16 py-8">
	<slot />
</main>
