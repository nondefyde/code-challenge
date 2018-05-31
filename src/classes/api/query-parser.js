import _ from 'underscore';

/**
 * The QueryParser class
 */
class QueryParser {
	/**
	 * @constructor
	 * @param {String} query This is a query object of the request
	 */
	constructor(query) {
		const excluded = ['per_page', 'page','limit', 'population', 'sort', 'all', 'custom'];
		this.obj = _.pick(query, ...excluded);
		console.log('this.obj : ', this.obj);
		query = _.omit(query, ...excluded);
		console.log('query : ', query);
		this._query = query;
		Object.assign(this, query); // TODO: Show emma
	}

	/**
	 * @return {Object} get the parsed query
	 */
	get getAll() {
		return this.obj['all'];
	}

	/**
	 * @return {Object} get the parsed query
	 */
	get query() {
		return this._query;
	}

	/**
	 * @return {Object} get the population object for query
	 */
	get population() {
		if (this._population) {
			return this._population;
		}
		return [];
	}

	/**
	 * @return {Object} get the population object for query
	 */
	get sort() {
		if (this._sort) {
			return this._sort;
		}
		return '-createdAt';
	}

	/**
	 * @return {Boolean} get the value for all data status
	 */
	get all() {
		return this._all;
	}
}

/**
 * @typedef Pagination
 */

export default QueryParser;
