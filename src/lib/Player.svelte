<script lang="ts">
	import { spotifySDK } from '$lib/spotify';
	import { PUBLIC_INVIDIOUS_INSTANCE } from '$env/static/public';
	import type { Track } from '@spotify/web-api-ts-sdk';
	import { Howl, Howler } from 'howler';
	import { db, downloadTrack } from '$lib/download';

	import Play from '~icons/zondicons/play-outline';
	import Pause from '~icons/zondicons/pause-outline';
	import Download from '~icons/solar/download-linear';
	import Loading from '~icons/line-md/loading-loop';

	const getYoutubeId = async (track: Track) => {
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
		return results[0].videoId;
	};

	$: tracks = $spotifySDK?.currentUser.tracks.savedTracks();

	let trackData = new Proxy(
		{} as {
			[key: string]: {
				track: Track;
				youtubeId: string | null;
				element: HTMLLIElement;
				index: number;

				sound: Howl | null;
				downloading: boolean;
			};
		},
		{
			// the getter automatically creates a new object if the key doesn't exist
			get: (target, key: string) => {
				if (!(key in target)) {
					target[key] = {
						// @ts-expect-error
						track: null,
						youtubeId: null,
						// @ts-expect-error
						element: null,
						// @ts-expect-error
						index: null,
						playing: false,
						downloading: false
					};
				}
				return target[key];
			}
		}
	);

	const play = (track: Track): ((e: MouseEvent) => Promise<void>) => {
		return async () => {
			if (trackData[track.id].sound?.playing()) {
				trackData[track.id].sound?.pause();
				return;
			}

			let url = await db.tracks.get(track.id).then(async (savedTrack) => {
				if (savedTrack) {
					return savedTrack.data;
				} else {
					if (!trackData[track.id].youtubeId) {
						trackData[track.id].youtubeId = await getYoutubeId(track);
					}
					return (
						PUBLIC_INVIDIOUS_INSTANCE +
						'/latest_version?' +
						new URLSearchParams({
							id: trackData[track.id].youtubeId!,
							itag: '139'
						})
					);
				}
			});

			let sound = new Howl({
				src: [url],
				html5: true
			});
			Howler.stop();
			trackData[track.id].sound = sound;
			sound.play();
		};
	};
	const download = (track: Track, idx: number): ((e: MouseEvent) => Promise<void>) => {
		return async () => {
			if (trackData[track.id].downloading) return;

			trackData[track.id].downloading = true;

			if (!trackData[track.id].youtubeId) {
				trackData[track.id].youtubeId = await getYoutubeId(track);
			}

			// download the url and add it to IndexedDB
			await downloadTrack(track, idx, trackData[track.id].youtubeId!);
			trackData[track.id].downloading = false;
		};
	};

	// const downloadAll = () => {
	// 	let target = e.target as HTMLButtonElement;
	// 	let items = target.parentElement?.querySelectorAll('li');
	// 	if (items) {
	// 	}
	// };
</script>

{#await tracks}
	<p>loading tracks...</p>
{:then tracks}
	{#if tracks}
		<!-- <button on:click={downloadAll}>download all</button> -->
		<ol class="join join-vertical">
			{#each tracks.items as { track }, idx (trackData[track.id])}
				<li bind:this={trackData[track.id].element}>
					<span class="btn btn-active join-item">
						{track.name} - {track.artists[0].name}
						<button on:click={play(track)}>
							{#if trackData[track.id].sound?.playing()}
								<Pause />
							{:else}
								<Play />
							{/if}
						</button>
						<button on:click={download(track, idx)}>
							{#if trackData[track.id].downloading}
								<Loading />
							{:else}
								<Download />
							{/if}
						</button>
					</span>
				</li>
			{/each}
		</ol>
	{:else}
		<p>no tracks</p>
	{/if}
{:catch error}
	<p>error: {error.message}</p>
{/await}
