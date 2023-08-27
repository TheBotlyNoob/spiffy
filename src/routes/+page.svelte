<script lang="ts">
	import { getHLS } from '$lib/dl-music';
	import { onMount } from 'svelte';

	let video: HTMLVideoElement;

	onMount(async () => {
		const { default: shaka } = await import('shaka-player');

		if (!shaka.Player.isBrowserSupported()) {
			alert('Unsupported browser.');
			throw new Error('unsupported browser.');
		}

		const HLS = await getHLS('6_aqeCDk1Yk');

		const player = new shaka.Player(video);

		await player.load(HLS);
	});
</script>

<svelte:head>
	<script src="./mux.min.js" async></script>
</svelte:head>

<!-- svelte-ignore a11y-media-has-caption -->
<video bind:this={video} controls autoplay />

<h1>Spiffy</h1>
