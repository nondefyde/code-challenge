require('dotenv').config();
const PORT = process.env.PORT || 3000;
module.exports = {
	app: {
		name: 'MUSIC REPORT',
		port: PORT,
		baseUrl: `http://localhost:${PORT}`,
	},
	api: {
		prefix: '^/api/v[1-9]/',
		versions: [1],
		patch_version: '1.0.0',
	},
	lang: 'en',
	authToken: {
		superSecret: 'ipa-BUhBOJAm',
		expiresIn: 86400,
	},
	db: {
		url: process.env.DB_URL,
	},
	itemsPerPage: {
		default: 10,
	},
};
