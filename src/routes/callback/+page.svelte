<script lang="ts">
	import { base } from '$app/paths';
	import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } from '$lib/spotify';
	import type { AccessToken } from '@spotify/web-api-ts-sdk';
	import { onMount } from 'svelte';

	onMount(async () => {
		const code = [...new URLSearchParams(window.location.search)].find(([k]) => k === 'code')![1];

		if (!CLIENT_ID || !CLIENT_SECRET) {
			alert(
				'Please login first. If you are trying to login, please delete your cookies and try again.'
			);
			window.location.href = base || '/';
			return;
		}

		const accessToken: AccessToken = await fetch('https://accounts.spotify.com/api/token', {
			headers: {
				Authorization: `Basic ${btoa(CLIENT_ID + ':' + CLIENT_SECRET)}`
			},
			body: new URLSearchParams({
				grant_type: 'authorization_code',
				code,
				redirect_uri: REDIRECT_URI
			}),
			method: 'POST'
		}).then((r) => r.json());

		localStorage.setItem('token', JSON.stringify(accessToken));

		window.location.href = base || '/';
	});
</script>
