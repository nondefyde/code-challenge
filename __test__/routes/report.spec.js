// Require the dev-dependencies
import mongoose from 'mongoose';
import supertest from 'supertest';
import chai from 'chai';
import app from '../../src/app';
import {REPORT_URL, TEST_API_KEY} from '../config';
import {getReportForUpdate, getReportObject} from '../data.seed';
import {BAD_REQUEST, NOT_FOUND, OK} from '../../src/utils/status-codes';

const Report = mongoose.model('Report');
const server = supertest(app);
const should = chai.should();
const ObjectId = mongoose.Types.ObjectId;
let report = null;

describe('Suite: Report Integration Test', () => {
	/**
	 * @function Function to run before test begins
	 * @param {function} done
	 */
	before((done) => {
		Report.remove({}).then(() => done());
	});
	/**
	 * @function Function to run after test ends
	 * @param {function} done
	 */
	after((done) => { // Before each test we empty the database
		Report.remove({}).then(() => done());
	});
	describe('Create a test report', () => {
		it(`Should error out when report payload is invalid`, async () => {
			let response = await server.post(REPORT_URL)
				.send({})
				.set('x-api-key', TEST_API_KEY)
				.set('Accept', 'application/json')
				.expect('Content-type', /json/)
				.expect(BAD_REQUEST);
			response.body.should.have.property('_meta').which.is.an('object').and.not.empty;
			response.body._meta.should.have.property('error').which.is.an.instanceOf(Object);
			response.body._meta.error.should.have.property('message').which.is.a('string');
			response.body._meta.error.should.have.property('messages');
		});
		it('Should create a report record with valid payload', async () => {
			let response = await server.post(REPORT_URL)
				.send(getReportObject())
				.set('x-api-key', TEST_API_KEY)
				.set('Accept', 'application/json')
				.expect('Content-type', /json/)
				.expect(OK);
			response.body.should.be.an('object');
			response.body.should.have.property('_meta').which.is.an('object').and.not.empty;
			response.body.should.have.property('data').which.is.an('object').and.not.empty;
			response.body._meta.should.have.property('success').which.is.true;
			report = response.body.data;
		});
	});
	describe(`/GET ${REPORT_URL}`, () => {
		it('Should return all reports', async () => {
			let response = await server.get(REPORT_URL)
				.set('x-api-key', TEST_API_KEY)
				.set('Accept', 'application/json')
				.expect('Content-type', /json/)
				.expect(OK);
			response.body.should.be.an('object');
			response.body.should.have.property('_meta').which.is.an('object').and.not.empty;
			response.body._meta.should.have.property('success').which.is.true;
			response.body.should.have.property('data').which.is.an('array');
		});

		it(`Should return a single report if exist`, async () => {
			let response = await server.get(`${REPORT_URL}/${report._id}`)
				.set('x-api-key', TEST_API_KEY)
				.set('Accept', 'application/json')
				.expect(OK);
			response.body.should.be.an('object');
			response.body.should.have.property('_meta').which.is.an('object').and.not.empty;
			response.body._meta.should.have.property('success').which.is.true;
			response.body.should.have.property('data').which.is.an('object');
		});
	});
	describe(`/PUT ${REPORT_URL}/:id`, () => {
		it(`Should error out when report doesn't exist`, async () => {
			const wrongObjectId = new ObjectId();
			let response = await server.put(`${REPORT_URL}/${wrongObjectId}`)
				.set('x-api-key', TEST_API_KEY)
				.set('Accept', 'application/json')
				.expect('Content-type', /json/)
				.expect(NOT_FOUND);
			response.body.should.be.an('object');
			response.body.should.have.property('_meta').which.is.an('object').and.not.empty;
			response.body._meta.should.have.property('error').which.is.an.instanceOf(Object);
			response.body._meta.error.should.have.property('message').which.is.a('string');
			response.body._meta.error.should.not.have.property('messages');
		});
		it(`Should error out when on empty input`, async () => {
			let response = await server.put(`${REPORT_URL}/${report._id}`)
				.send({})
				.set('x-api-key', TEST_API_KEY)
				.set('Accept', 'application/json')
				.expect('Content-type', /json/)
				.expect(BAD_REQUEST);
			response.body.should.be.an('object');
			response.body.should.have.property('_meta').which.is.an('object').and.not.empty;
			response.body._meta.should.have.property('error').which.is.an.instanceOf(Object);
			response.body._meta.error.should.have.property('message').which.is.a('string');
			response.body._meta.error.should.not.have.property('messages');
		});
		it(`Should update with valid inputs`, async () => {
			let response = await server.put(`${REPORT_URL}/${report._id}`)
				.send(getReportForUpdate())
				.set('x-api-key', TEST_API_KEY)
				.set('Accept', 'application/json')
				.expect('Content-type', /json/)
				.expect(OK);
			response.body.should.be.an('object');
			response.body.should.have.property('_meta').which.is.an('object').and.not.empty;
			response.body.should.have.property('data').which.is.an('object').and.not.empty;
			response.body._meta.should.have.property('success').which.is.true;
			response.body.data.should.have.property('_id').which.is.equal(report._id);
		});
	});
	describe(`/DEL ${REPORT_URL}/:id`, () => {
		it(`Should error out when report doesn't exist`, async () => {
			const wrongObjectId = new ObjectId();
			let response = await server.del(`${REPORT_URL}/${wrongObjectId}`)
				.set('x-api-key', TEST_API_KEY)
				.set('Accept', 'application/json')
				.expect('Content-type', /json/)
				.expect(NOT_FOUND);
			response.body.should.be.an('object');
			response.body.should.have.property('_meta').which.is.an('object').and.not.empty;
			response.body._meta.should.have.property('error').which.is.an.instanceOf(Object);
			response.body._meta.error.should.have.property('message').which.is.a('string');
			response.body._meta.error.should.not.have.property('messages');
		});
		it(`Should delete a single report if exist`, async () => {
			let response = await server.del(`${REPORT_URL}/${report._id}`)
				.set('x-api-key', TEST_API_KEY)
				.set('Accept', 'application/json')
				.expect('Content-type', /json/)
				.expect(OK);
			response.body.should.be.an('object');
			response.body.should.have.property('_meta').which.is.an('object').and.not.empty;
			response.body._meta.should.have.property('success').which.is.true;
			response.body.should.have.property('data');
		});
	});
});
