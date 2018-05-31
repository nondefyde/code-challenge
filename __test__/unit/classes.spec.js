import {expect} from 'chai';
import Pagination from '../../src/classes/api/pagination';
import {data} from '../data.seed';
import QueryParser from '../../src/classes/api/query-parser';

describe('Pagination', () => {
	let pagination;
	it('Throws error without options', () => {
		expect(() => {
			pagination = new Pagination(null);
		}).to.throw(Error);
	});

	it('Throws error where url property in not valid', () => {
		expect(() => {
			pagination = new Pagination();
		}).to.throw(Error);
	});

	it(`Expects total count to be ${data.length}`, () => {
		const url = 'http://localhost:3000/api/v1/reports?page=1&per_page=2&limit=10';
		const pagination = new Pagination(url);
		expect(pagination.totalCount).to.equal(0);
		pagination.totalCount = data.length;
		expect(pagination.totalCount).to.equal(data.length);
	});
});
