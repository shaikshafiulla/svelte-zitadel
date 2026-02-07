import adapter from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		serviceWorker: {
			register: true
		}
	}
};

export default config;
