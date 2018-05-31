import lang from '../lang';
/**
 * The Base controller class where other controller inherits or
 * overrides pre defined and existing properties
 */
class BaseController {
	/**
	 * @param {Model} model The default model object
	 * for the controller. Will be required to create
	 * an instance of the controller
	 */
	constructor(model) {
		if (new.target === BaseController) {
			throw new TypeError('Cannot construct Abstract instances directly');
		}
		this._model = model;
		this.lang = lang;
	}
}

export default BaseController;
