import { browser } from '$app/environment';
import { base } from '$app/paths';
import type { AccessToken } from '@spotify/web-api-ts-sdk';

export const CLIENT_ID = browser ? localStorage.getItem('clientID') : null;
export const CLIENT_SECRET = browser ? localStorage.getItem('clientSecret') : null;
// @ts-expect-error  JSON.parse(null) -> null
export const TOKEN: AccessToken | null = browser ? JSON.parse(localStorage.getItem('token')) : null;

export const REDIRECT_URI = browser
	? `${window.location.origin}${base}/callback`
	: 'https://example.com/callback';
