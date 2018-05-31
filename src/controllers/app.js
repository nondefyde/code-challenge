import _ from 'underscore';
import Q from 'q';
import lang from '../lang';
import BaseController from '../controllers/base';
import {BAD_REQUEST, CREATED, NOT_FOUND, OK} from '../utils/status-codes';
import QueryParser from '../classes/api/query-parser';
import AppResponse from '../classes/api/app-response';
import AppError from '../classes/api/app-error';
import Pagination from '../classes/api/pagination';

/**
 * The App controller class where other controller inherits or
 * overrides pre defined and existing properties
 */
class AppController extends BaseController {
	/**
	 * @param {Model} model The default model object
	 * for the controller. Will be required to create
	 * an instance of the controller
	 */
	constructor(model) {
		super(...arguments);
		this.id = this.id.bind(this);
		this.create = this.create.bind(this);
		this.find = this.find.bind(this);
		this.findOne = this.findOne.bind(this);
		this.update = this.update.bind(this);
		this.delete = this.delete.bind(this);
	}

	/**
	 * @param {Object} req The request object
	 * @param {Object} res The response object
	 * @param {callback} next The callback to the next program handler
	 * @param {String} id The id from the url parameter
	 */
	id(req, res, next, id) {
		const queryParser = new QueryParser(Object.assign({}, req.query));
		let query = this._model.findById(id);
		if (queryParser.population) {
			query = query.populate(queryParser.population);
		}
		query.then((object) => {
			if (object) {
				req.object = object;
				return next();
			} else {
				const appError = new AppError(lang.get('error').not_found, NOT_FOUND);
				return next(appError);
			}
		}, (err) => {
			return next(err);
		});
	}

	/**
	 * @param {Object} req The request object
	 * @param {Object} res The response object
	 * @param {callback} next The callback to the next program handler
	 * @return {Object} res The response object
	 */
	create(req, res, next) {
		const queryParser = new QueryParser(Object.assign({}, req.query));
		const obj = req.body;
		const validator = this._model.validateCreate(obj);
		if (validator.fails()) {
			const appError = new AppError(lang.get('error').inputs, BAD_REQUEST, validator.errors.all());
			return next(appError);
		}
		const object = new this._model(obj);
		object.save()
			.then(async (savedObject) => {
				const meta = AppResponse.getSuccessMeta();
				_.extend(meta, {status_code: CREATED});
				if (queryParser.population) {
					savedObject = await this._model.populate(savedObject, queryParser.population);
				}
				meta.message = 'Operation was successful';
				console.log('meta : ', meta);
				return res.status(OK).json(AppResponse.format(meta, savedObject));
			}, (err) => {
				return next(err);
			});
	}

	/**
	 * @param {Object} req The request object
	 * @param {Object} res The response object
	 * @return {Object} The response object
	 */
	findOne(req, res) {
		const queryParser = new QueryParser(Object.assign({}, req.query));
		const meta = AppResponse.getSuccessMeta();
		let object = req.object;
		if (queryParser.population) {
			(async function () {
				object = await this._model.populate(object, queryParser.population);
			}());
		}
		return res.status(OK).json(AppResponse.format(meta, object));
	}

	/**
	 * @param {Object} req The request object
	 * @param {Object} res The response object
	 * @param {callback} next The callback to the next program handler
	 */
	find(req, res, next) {
		const queryParser = new QueryParser(Object.assign({}, req.query));
		let query = this._model.find(queryParser.query);
		if (queryParser.population) {
			query = query.populate(queryParser.population);
		}
		const pagination = new Pagination(req.originalUrl);
		if (!queryParser.getAll) {
			query = query.skip(pagination.skip)
				.limit(pagination.perPage)
				.sort(
					(pagination && pagination.sort) ?
						Object.assign(pagination.sort, {createdAt: -1}) : '-createdAt');
		}
		const meta = AppResponse.getSuccessMeta();
		Q.all([
			query.exec(),
			this._model.count(queryParser.query).exec(),
		]).spread((objects, count) => {
			if (!queryParser.getAll) {
				pagination.totalCount = count;
				if (pagination.morePages(count)) {
					pagination.next = pagination.current + 1;
				}
				meta.pagination = pagination.done();
				console.log('pagination', pagination);
			}
			return res.status(OK).json(AppResponse.format(meta, objects));
		}, (err) => {
			return next(err);
		});
	}

	/**
	 * @param {Object} req The request object
	 * @param {Object} res The response object
	 * @param {callback} next The callback to the next program handler
	 */
	update(req, res, next) {
		const queryParser = new QueryParser(Object.assign({}, req.query));
		const object = req.object;
		const update = req.body;
		if (_.isEmpty(update)) {
			const appError = new AppError(lang.get('error').no_update_input, BAD_REQUEST);
			next(appError);
			return;
		}
		_.extend(object, update);
		object.save()
			.then(async (savedObject) => {
				const meta = AppResponse.getSuccessMeta();
				meta.message = 'Operation was successful';
				if (queryParser.population) {
					savedObject = await this._model.populate(savedObject, queryParser.population);
				}
				return res.status(OK).json(AppResponse.format(meta, savedObject));
			}, (err) => {
				return next(err);
			});
	}

	/**
	 * @param {Object} req The request object
	 * @param {Object} res The response object
	 * @param {callback} next The callback to the next program handler
	 */
	delete(req, res, next) {
		const object = req.object;
		object.remove()
			.then((removedObject) => {
				const meta = AppResponse.getSuccessMeta();
				meta.message = 'Operation was successful';
				return res.status(OK).json(AppResponse.format(meta, {_id: removedObject._id}));
			}, (err) => {
				return next(err);
			});
	}
}

export default AppController;

