<script lang="ts">
	import { HAS_SPOTIFY_APP, REDIRECT_URI } from '$lib/spotify';

	let clientID: string;
	let clientSecret: string;

	const onSubmit = (e: SubmitEvent) => {
		e.preventDefault();

		if (!HAS_SPOTIFY_APP) {
			localStorage.setItem('clientID', clientID);
			localStorage.setItem('clientSecret', clientSecret);
		} else {
			clientID = localStorage.getItem('clientID')!;
			clientSecret = localStorage.getItem('clientSecret')!;
		}

		window.location.href =
			'https://accounts.spotify.com/authorize?' +
			new URLSearchParams({
				client_id: clientID,
				response_type: 'code',
				redirect_uri: REDIRECT_URI,
				scope: 'user-library-read'
			});
	};
</script>

<form on:submit={onSubmit} class="form-control">
	{#if !HAS_SPOTIFY_APP}
		<input
			class="input input-bordered mt-4"
			type="text"
			placeholder="Spotify Client ID"
			bind:value={clientID}
		/>
		<input
			class="input input-bordered mt-4"
			type="text"
			placeholder="Spotify Client Secret"
			bind:value={clientSecret}
		/>
		<div class="alert alert-warning mt-4 py-3">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="stroke-current shrink-0 h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
				/></svg
			>
			<div>
				Make sure the Redirect URI is set to:
				<code class="kbd text-slate-200 ml-1">
					{REDIRECT_URI}
				</code>
			</div>
		</div>
	{/if}
	<input class="btn btn-active mt-4" type="submit" value="Login" />
</form>
