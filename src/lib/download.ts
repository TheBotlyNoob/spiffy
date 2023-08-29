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

export const downloadTrack = async (track: Track, index: number, youtubeId: string) => {
	const url =
		// 'https://cros.deno.dev/' + // TODO: cors
		PUBLIC_INVIDIOUS_INSTANCE +
		'/latest_version?' +
		new URLSearchParams({
			id: youtubeId,
			itag: '139'
		});

	const blob = await fetch(url).then((r) => r.blob());
	const base64: string = await new Promise((res) => {
		const reader = new FileReader();
		reader.onloadend = () => res(reader.result as string);
		reader.readAsDataURL(blob);
	});

	const db = new DownloadedTrackDexie();
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
