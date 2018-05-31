import Validator from 'validatorjs';
import util from 'util';
import {Schema} from 'mongoose';

/**
 * The Base schema object where other schema inherits or
 * overrides pre defined and static methods
 */
function BaseSchema(...args) {
	Schema.apply(this, args);
	/**
	 * @param {Object} obj The object to perform validation on
	 * @return {Validator} The validator object with the specified rules.
	 */
	this.statics.validateCreate = (obj = {}) => {
		let rules = {};
		return new Validator(obj, rules);
	};
}

util.inherits(BaseSchema, Schema);
/**
 * @typedef BaseSchema
 */
export default BaseSchema;
