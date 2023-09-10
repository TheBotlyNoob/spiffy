import { CLIENT_ID, TOKEN } from '$lib/spotify';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import type { LayoutLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { browser } from '$app/environment';

export const prerender = false;

export const load: LayoutLoad = ({ url }) => {
	if (!browser)
		return {
			sdk: null
		};

	if (TOKEN && CLIENT_ID) {
		return {
			sdk: SpotifyApi.withAccessToken(CLIENT_ID, JSON.parse(TOKEN))
		};
	} else if (url.pathname !== '/login') {
		console.log(url.pathname);
		throw redirect(302, '/login');
	} else {
		return {
			sdk: null
		};
	}
};
