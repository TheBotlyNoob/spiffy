import { browser } from '$app/environment';
import { base } from '$app/paths';

export const CLIENT_ID = browser ? localStorage.getItem('clientID') : null;
export const CLIENT_SECRET = browser ? localStorage.getItem('clientSecret') : null;
export const TOKEN = browser ? localStorage.getItem('token') : null;

export const REDIRECT_URI = browser
	? `${window.location.origin}${base}/callback`
	: 'https://example.com/callback';
