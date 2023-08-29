<script lang="ts">
	import '$lib/tailwind.postcss';
	import { CLIENT_ID, TOKEN, spotifySDK } from '$lib/spotify';
	import { onMount } from 'svelte';
	import { SpotifyApi } from '@spotify/web-api-ts-sdk';

	onMount(() => {
		if (TOKEN && CLIENT_ID) {
			spotifySDK.set(SpotifyApi.withAccessToken(CLIENT_ID, JSON.parse(TOKEN)));
		}
	});
</script>

<main class="px-16 py-8">
	<slot />
</main>
