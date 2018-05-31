import config from 'config';
import http from 'http';
import Todo from './todo';
import TodoRoute from './todo.route';
// Require the dev-dependencies
import chai from 'chai';
import supertest from 'supertest';
import app from '../src/app';
const prefix = config.get('api.prefix');
app.use(prefix, TodoRoute);

import {describe, after, before} from 'mocha';

let should = chai.should();
let server = supertest(app);

let apiKey = 'dfvsdgvdssvd';
let stateCode = 'tx';
let apiVersion = 'v1';
let url = '/api/' + apiVersion + '/' + stateCode;
let todoUrl = url + '/todos';

// Our parent block
describe('App', () => {
	/*
	 * Function to run before test begins
	 */
	before((done) => {
		Todo.remove({}, (err) => {
			done();
		});
	});
	/*
	 * Function to run after test is completec
	 */
	after((done) => { // Before each test we empty the database
		Todo.remove({}, (err) => {
			done();
		});
	});
	/*
	 * Test a new report registration /auth/register route
	 */
	describe('/POST ' + todoUrl, () => {
		it('Create a todo with app controller', (done) => {
			server
				.post(todoUrl)
				.send({
					name: 'New Todo',
					description: 'Todo description',
				})
				.expect('Content-type', /json/)
				.set('x-api-key', apiKey)
				.expect(404)
				.end((err, res) => {
					console.log('res: ', res.body);
					res.status.should.equal(404);
					res.body.should.be.instanceOf(Object);
					res.body.should.have.property('_meta');
					res.body._meta.should.have.property('status_code');
					res.body._meta.should.have.property('error');
					res.body._meta.error.should.be.instanceOf(Object);
					done();
				});
		});
	});
});
