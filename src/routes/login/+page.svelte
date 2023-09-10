<script lang="ts">
	import { CLIENT_ID, REDIRECT_URI } from '$lib/spotify';

	let clientID: string | null;
	let clientSecret: string | null;

	const onSubmit = (e: SubmitEvent) => {
		e.preventDefault();

		if (!CLIENT_ID) {
			localStorage.setItem('clientID', clientID!);
			localStorage.setItem('clientSecret', clientSecret!);
		} else {
			clientID = localStorage.getItem('clientID')!;
		}

		window.location.href =
			'https://accounts.spotify.com/authorize?' +
			new URLSearchParams({
				client_id: clientID!,
				response_type: 'code',
				redirect_uri: REDIRECT_URI,
				scope: 'user-library-read'
			});
	};
</script>

<h1>
	Make a Spotify application at <a
		class="link link-hover text-blue-500"
		href="https://developer.spotify.com/dashboard">https://developer.spotify.com/dashboard</a
	>
</h1>
<form on:submit={onSubmit} class="form-control">
	{#if !CLIENT_ID}
		<input
			class="input input-bordered mt-4"
			type="text"
			placeholder="Spotify Client ID"
			required
			bind:value={clientID}
		/>
		<input
			class="input input-bordered mt-4"
			type="text"
			placeholder="Spotify Client Secret"
			required
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
	{:else}
		<button
			class="btn btn-active mt-4"
			value="Clear Cookies"
			on:click={(e) => {
				e.preventDefault();
				localStorage.clear();
				window.location.reload();
			}}
		>
			Clear Cookies
		</button>
	{/if}
	<input class="btn btn-active mt-4" type="submit" value="Login" />
</form>
