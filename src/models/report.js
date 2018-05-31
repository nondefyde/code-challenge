/**
 * Report Schema
 */
import BaseSchema from './base';
import mongoose from 'mongoose';
import Validator from 'validatorjs';

const ReportSchema = new BaseSchema({
	user: {
		type: String,
	},
	song: {
		type: String,
	},
	location: {
		street: String,
		city: String,
		state: String,
		country: String,
		zipcode: String,
		coordinates: [Number],
	},
}, {timestamps: true});


/**
 * @param {Object} obj The object to perform validation on
 * @return {Validator} The validator object with the specified rules.
 */
ReportSchema.statics.validateCreate = (obj = {}) => {
	const rules = {
		'user': 'required',
		'song': 'required',
		'location': 'required',
	};
	return new Validator(obj, rules);
};

/**
 * @typedef ReportSchema
 */
export default mongoose.model('Report', ReportSchema);
