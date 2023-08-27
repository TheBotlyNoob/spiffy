<script lang="ts">
	import { onMount } from 'svelte';

	onMount(async () => {
		const code = [...new URLSearchParams(window.location.search)].find(([k]) => k === 'code')![1];

		const form = new FormData();
		form.append('grant_type', 'authorization_code');
		form.append('code', code);
		form.append('redirect_uri', 'http://localhost:5173/callback');

		const { access_token, expires_in } = await fetch('https://accounts.spotify.com/api/token', {
			headers: {
				Authorization: `Basic ${btoa(
					'2c3464f9bfb04436b2fefb1f6746e4f9:8765fcf5da754b5bbe32453428e1ffe0'
				)}`
			},
			body: form,
			method: 'POST'
		}).then((r) => r.json());

		localStorage.setItem('token', access_token);

		window.location.href = '/';
	});
</script>
