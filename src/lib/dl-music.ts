const PIPED_API_BASE = 'https://pipedapi.kavin.rocks';

export const getHLS = async (ytId: string): Promise<string> =>
	await fetch(PIPED_API_BASE + '/streams/' + ytId)
		.then((r) => r.json())
		.then((stream) => stream.hls);
