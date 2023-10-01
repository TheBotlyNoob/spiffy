import { CLIENT_ID, TOKEN } from '$lib/spotify';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import type { LayoutLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const prerender = false;
export const ssr = false;

export const load: LayoutLoad = ({ url }): { sdk: SpotifyApi } => {
	if (TOKEN && CLIENT_ID) {
		return {
			sdk: SpotifyApi.withAccessToken(CLIENT_ID, TOKEN)
		};
	} else if (!['/login', '/callback'].includes(url.pathname)) {
		throw redirect(302, '/login');
	} else {
		return {
			// @ts-expect-error login and callback pages don't need the sdk
			sdk: null
		};
	}
};
