import { PUBLIC_INVIDIOUS_INSTANCE } from '$env/static/public';
import type { Track } from '@spotify/web-api-ts-sdk';
import Dexie from 'dexie';

interface DownloadedTrack {
	id: string;
	index: number;
	name: string;
	artists: string[];
	album: string;
	data: string;
}

class DownloadedTrackDexie extends Dexie {
	tracks: Dexie.Table<DownloadedTrack, string>;

	constructor() {
		super('tracks');
		this.version(1).stores({
			tracks: 'id, index, name, artists, album, url'
		});
		this.tracks = this.table('tracks');
	}
}

export const db = new DownloadedTrackDexie();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const LOW_QUALITY_ITAG = '599'; // doesn't always appear
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MEDIUM_QUALITY_ITAG = '139';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const HIGH_QUALITY_ITAG = '140';

export const downloadTrack = async (track: Track, index: number, youtubeId: string) => {
	const url =
		'https://corsproxy.io/?' + // TODO: cors
		PUBLIC_INVIDIOUS_INSTANCE +
		'/latest_version?' +
		new URLSearchParams({
			id: youtubeId,
			itag: MEDIUM_QUALITY_ITAG
		});

	const blob = await fetch(url).then((r) => {
		// if it's a partial content response, we need to get the full content
		if (r.status === 206) {
			const range = r.headers.get('content-range');
			if (range) {
				const [, end] = range.split('/');
				return fetch(url, {
					headers: {
						range: `bytes=0-${end}`
					}
				}).then((r) => r.blob());
			}
		}
		return r.blob();
	});
	const base64: string = await new Promise((res) => {
		const reader = new FileReader();
		reader.onloadend = () => res(reader.result as string);
		reader.readAsDataURL(blob);
	});

	db.version(1).stores({
		tracks: 'id, name, artists, album, url'
	});

	await db.tracks.put({
		id: track.id,
		index,
		name: track.name,
		artists: track.artists.map((a) => a.name),
		album: track.album.album_group,
		data: base64
	});
};
