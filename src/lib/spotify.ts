import { browser } from '$app/environment';
import type { SpotifyApi } from '@spotify/web-api-ts-sdk';
import { writable } from 'svelte/store';
import { base } from '$app/paths';

export const CLIENT_ID = browser ? localStorage.getItem('clientID') : null;
export const CLIENT_SECRET = browser ? localStorage.getItem('clientSecret') : null;
export const TOKEN = browser ? localStorage.getItem('token') : null;

export const REDIRECT_URI = browser
	? `${window.location.origin}${base}/callback`
	: 'https://example.com/callback';

export const spotifySDK = writable<SpotifyApi | null>();
