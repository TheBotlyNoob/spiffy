<script lang="ts">
	import { REDIRECT_URI } from '$lib/spotify';
	import type { AccessToken } from '@spotify/web-api-ts-sdk';
	import { onMount } from 'svelte';

	onMount(async () => {
		const code = [...new URLSearchParams(window.location.search)].find(([k]) => k === 'code')![1];

		const clientID = localStorage.getItem('clientID');
		const clientSecret = localStorage.getItem('clientSecret');
		if (!clientID || !clientSecret) {
			alert(
				'Please login first. If you are trying to login, please delete your cookies and try again.'
			);
			window.location.href = '/';
			return;
		}

		const accessToken: AccessToken = await fetch('https://accounts.spotify.com/api/token', {
			headers: {
				Authorization: `Basic ${btoa(clientID + ':' + clientSecret)}`
			},
			body: new URLSearchParams({
				grant_type: 'authorization_code',
				code,
				redirect_uri: REDIRECT_URI
			}),
			method: 'POST'
		}).then((r) => r.json());

		localStorage.setItem('token', JSON.stringify(accessToken));

		window.location.href = '/';
	});
</script>
