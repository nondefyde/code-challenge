import config from 'config';
import report from './report';
import AppError from '../classes/api/app-error';
import lang from '../lang';
import {NOT_FOUND} from '../utils/status-codes';
import apiAuth from '../middlewares/api_auth';

const prefix = config.get('api.prefix');
/**
 * The routes will add all the application defined routes
 * @param {express} app The app is an instance of an express application
 */
const routes = async (app) => {
	app.use(prefix, apiAuth);
	// Prevent unauthorized access
	app.use(prefix, report);
	app.use('*', (req, res, next) => {
		const appError = new AppError(lang.get('error').resource_not_found, NOT_FOUND);
		return next(appError);
	});
};

export default routes;
