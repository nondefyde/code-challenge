/**
 * The App Error class
 */
class AppError extends Error {
	/**
	 * @param {String} message The error message
	 * @param {Number} code The status code of the error
	 * @param {Object} messages The optional error messages
	 * @param {Number} type The optional type for status code
	 */
	constructor(message, code, messages = null, type = 0) {
		super(message);
		if (type > 0) {
			this._type = type;
		}
		this._code = code;
		if (messages) {
			this._messages = messages;
		}
		// Error.captureStackTrace(this, AppError);
	}

	/**
	 * @return {Number}
	 */
	get code() {
		return this._code;
	}

	/**
	 * @return {String}
	 */
	get message() {
		return this._message;
	}

	/**
	 * @return {Array}
	 */
	get messages() {
		return this._messages;
	}

	/**
	 * @return {Object} The instance of AppError
	 */
	format() {
		const obj = {code: this._code, message: this.message};
		if (this._messages) {
			obj.messages = this._messages.errors || this._messages;
		}
		if (this._type > 0) {
			obj.type = this._type;
		}
		console.log('obj : ', obj);
		return obj;
	}
}

export default AppError;
