import { browser } from '$app/environment';
import type { SpotifyApi } from '@spotify/web-api-ts-sdk';
import { writable } from 'svelte/store';

export const HAS_SPOTIFY_APP = browser && !!localStorage.getItem('clientID');
export const LOGGED_IN = browser && !!localStorage.getItem('token');

export const REDIRECT_URI = browser
	? `${window.location.origin}/callback`
	: 'https://example.com/callback';

export const spotifySDK = writable<SpotifyApi | null>();
