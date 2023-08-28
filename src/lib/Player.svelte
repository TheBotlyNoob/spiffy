<script lang="ts">
	import { spotifySDK } from '$lib/spotify';
	import { PUBLIC_INVIDIOUS_INSTANCE } from '$env/static/public';

	let tracksElem: HTMLOListElement | null;

	$: tracks = $spotifySDK?.currentUser.tracks.savedTracks();

	$: {
		tracks?.then((tracks) => {
			for (const child of tracksElem?.children as unknown as HTMLElement[]) {
				const { trackName, artist } = child.dataset;
				if (!trackName || !artist) {
					continue;
				}
				(async () => {
					// await fetch(
					// 	PUBLIC_INVIDIOUS_INSTANCE +
					// 		'/api/v1/search?' +
					// 		new URLSearchParams({
					// 			q: trackName + ' ' + artist
					// 		})
					// )
					// 	.then((r) => r.json())
					// 	.then((r) => console.log(r));
				})();
			}
		});
	}
</script>

{#await tracks}
	<p>loading tracks...</p>
{:then tracks}
	{#if tracks}
		<ol bind:this={tracksElem}>
			{#each tracks.items as track}
				<li data-track-name={track.track.name} data-artist={track.track.artists[0].name}>
					{track.track.name} - {track.track.artists[0].name}
				</li>
			{/each}
		</ol>
	{:else}
		<p>no tracks</p>
	{/if}
{:catch error}
	<p>error: {error.message}</p>
{/await}
