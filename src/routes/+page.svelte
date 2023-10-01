<script lang="ts">
	import { PUBLIC_INVIDIOUS_INSTANCE } from '$env/static/public';
	import type { Track } from '@spotify/web-api-ts-sdk';
	import { Howl, Howler } from 'howler';
	import { db, downloadTrack } from '$lib/download';
	import type { LayoutData } from './$types';

	import Play from '~icons/zondicons/play-outline';
	import Pause from '~icons/zondicons/pause-outline';
	import Download from '~icons/solar/download-linear';
	import Loading from '~icons/line-md/loading-loop';

	export let data: LayoutData;

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

	let tracks = data.sdk.currentUser.tracks.savedTracks();

	let trackData = new Proxy(
		{} as {
			[key: string]: {
				track: Track;
				youtubeId: string | null;
				element: HTMLLIElement;
				index: number;

				sound: Howl | null;
				playing: boolean;
				downloading: boolean;
				downloaded: boolean;
			};
		},
		{
			// the getter automatically creates a new object if the key doesn't exist
			get: (target, key: string) => {
				if (!(key in target)) {
					// @ts-expect-error
					target[key] = {};
				}
				return target[key];
			}
		}
	);

	const play = (track: Track): (() => Promise<void>) => {
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
			sound.on('play', () => {
				trackData[track.id].playing = true;
			});
			sound.on('pause', () => {
				trackData[track.id].playing = false;
			});
			sound.on('end', () => {
				let nextTrack = Object.values(trackData).find(
					(v) => v.index === trackData[track.id].index + 1
				);
				if (nextTrack) {
					play(nextTrack.track)();
				}
			});
			sound.play();
		};
	};
	const download = (track: Track, idx: number): (() => Promise<void>) => {
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

	const downloadAll = async () => {
		// download 3 tracks at a time asynchronously, and wait for all of them to finish
		// then download the next 3 tracks
		let tracks = Object.values(trackData);
		for (let i = 0; i < tracks.length; i += 3) {
			let promises = [];
			for (let j = 0; j < 3; j++) {
				if (i + j >= tracks.length) break;
				console.log(tracks[i + j]);
				promises.push(download(tracks[i + j].track, tracks[i + j].index)());
			}
			await Promise.all(promises);
		}
	};
</script>

<button
	class="btn btn-active"
	on:click={() => {
		localStorage.removeItem('token');
		window.location.reload();
	}}
>
	Logout
</button>
{#await tracks}
	<p>loading tracks...</p>
{:then tracks}
	{#if tracks}
		<button on:click={downloadAll}>download all</button>
		<ol class="join join-vertical">
			{#each tracks.items as { track }, idx (trackData[track.id])}
				<li bind:this={trackData[track.id].element}>
					<span class="btn btn-active join-item">
						{track.name} - {track.artists[0].name}
						<button on:click={play(track)}>
							{#if trackData[track.id].playing}
								<Pause />
							{:else}
								<Play />
							{/if}
						</button>
						<button on:click={download(track, idx)}>
							{#if trackData[track.id].downloading}
								<Loading />
								<!-- {:else if trackData[track.id].playing}
								<Downloaded /> -->
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
