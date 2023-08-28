<script lang="ts">
	import { onMount } from 'svelte';
	import { spotifySDK } from '$lib/spotify';
	import type { SpotifyApi } from '@spotify/web-api-ts-sdk';

	$: tracks = $spotifySDK?.currentUser.tracks.savedTracks();
</script>

{#await tracks}
	<p>loading tracks...</p>
{:then tracks}
	{#if tracks}
		<ul>
			{#each tracks.items as track}
				<li>{track.track.name} - {track.track.artists[0].name}</li>
			{/each}
		</ul>
	{:else}
		<p>no tracks</p>
	{/if}
{:catch error}
	<p>error: {error.message}</p>
{/await}
