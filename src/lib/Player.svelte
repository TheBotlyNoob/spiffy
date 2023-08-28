<script lang="ts">
	import { spotifySDK } from '$lib/spotify';
	import { PUBLIC_INVIDIOUS_INSTANCE } from '$env/static/public';
	import type { Track } from '@spotify/web-api-ts-sdk';
	import { Howl, Howler } from 'howler';

	$: tracks = $spotifySDK?.currentUser.tracks.savedTracks();

	const onClick = (track: Track): ((e: MouseEvent) => Promise<void>) => {
		return async (e) => {
			interface Results {
				type: string;
				title: string;
				videoId: string;
			}

			const results: Results[] = await fetch(
				PUBLIC_INVIDIOUS_INSTANCE +
					'/api/v1/search?' +
					new URLSearchParams({
						q: track.name + ' ' + track.artists[0].name
					})
			)
				.then((r) => r.json())
				.then((r: Results[]) => r.filter((v) => v.type === 'video'));

			let sound = new Howl({
				src: [
					PUBLIC_INVIDIOUS_INSTANCE +
						'/latest_version?' +
						new URLSearchParams({
							id: results[0].videoId,
							itag: '139'
						})
				],
				html5: true
			});
			sound.play();
			alert('clicked');
		};
	};
</script>

{#await tracks}
	<p>loading tracks...</p>
{:then tracks}
	{#if tracks}
		<ol>
			{#each tracks.items as { track }}
				<li>
					<button class="btn btn-active" on:click={onClick(track)}>
						{track.name} - {track.artists[0].name}
					</button>
				</li>
			{/each}
		</ol>
	{:else}
		<p>no tracks</p>
	{/if}
{:catch error}
	<p>error: {error.message}</p>
{/await}
