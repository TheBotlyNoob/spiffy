<script lang="ts">
	import { onMount } from 'svelte';
	import { Howl, Howler } from 'howler';
	import { PUBLIC_INVIDIOUS_INSTANCE } from '$env/static/public';

	// TODO: configure this- make the user generate it
	const CLIENT_ID = '2c3464f9bfb04436b2fefb1f6746e4f9';
	const CLIENT_SECRET = '8765fcf5da754b5bbe32453428e1ffe0';
	const REDIRECT_URI = 'http://localhost:5173/callback';

	// let button: HTMLButtonElement;
	// onMount(() => {
	// 	button.addEventListener('click', async () => {
	// 		// this will have to be converted to base64 data-uri
	// 		const musicFile = await fetch(
	// 			PUBLIC_INVIDIOUS_INSTANCE + '/latest_version?id=hTWKbfoikeg&itag=139'
	// 		).then((res) => res.blob());

	// 		const dataURI: string = await new Promise((resolve, reject) => {
	// 			const reader = new FileReader();
	// 			reader.onload = () => resolve(reader.result as unknown as string);
	// 			reader.onerror = reject;
	// 			reader.readAsDataURL(musicFile);
	// 		});

	// 		let sound = new Howl({
	// 			src: [dataURI],
	// 			html5: true
	// 		});
	// 		sound.play();
	// 		alert('clicked');
	// 	});
	// });
</script>

<a
	href={`https://accounts.spotify.com/authorize?` +
		new URLSearchParams({
			client_id: CLIENT_ID,
			response_type: 'code',
			redirect_uri: REDIRECT_URI,
			scope: 'user-library-read'
		})}>Login</a
>
