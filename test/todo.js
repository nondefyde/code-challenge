import mongoose, {Schema} from 'mongoose';
import BaseSchema from '../src/models/base';

const TodoSchema = new BaseSchema({
	name: {type: String},
	description: {type: String},
	file: {type: Number},
}, {timestamps: true});

/**
 * @param {Object} obj The object to perform validation on
 * @return {Validator} The validator object with the specified rules.
 */
TodoSchema.statics.Object = (obj = {}) => {
	return {
		name: 'New To do',
	};
};


/**
 * @typedef TodoSchema
 */
export default mongoose.model('Todo', TodoSchema);
