import mongoose from 'mongoose';
import config from 'config';
import q from 'q';

/**
 * The setup class for all the dependencies of the application
 */
class SetUp {
	/**
	 * The function is called to help start up dependent services that the application will need
	 */
	static initialize() {
		this.setupMongoose();
		const apiVersion = config.get('api.versions').pop();
		this.setupApiVersion(apiVersion);
	}

	/**
	 * This will setup mongodb that will be used for the data store
	 */
	static setupMongoose() {
		mongoose.Promise = q.Promise;
		mongoose.connection.on('open', () => {
			console.log('Mongoose connected to mongo shell.');
			console.log('mongodb url ', config.get('db.url'));
		});
		mongoose.connection.on('error', (err) => {
			console.log('Mongoose could not connect to mongo shell!');
			console.log(err);
		});
		mongoose.connection.on('disconnected', function () {
			console.log('Mongoose connection to mongo shell disconnected');
		});
		mongoose.connect(config.get('db.url'));
	}

	/**
	 * @param {Number} version The configuration object
	 * This will setup default api version.
	 */
	static setupApiVersion(version) {
		console.log('Setting api version ', version);
		process.env.API_VERSION = `v${version}`;
	}
}

export default SetUp;
