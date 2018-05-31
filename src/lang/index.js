import glob from 'glob';
import _ from 'underscore';
import config from 'config';

const language = config.get('lang');
const file = glob.sync(`${__dirname}/${language}.js`);

/* eslint-disable no-invalid-this, require-jsdoc*/
function get(prop) { //
	if (this.hasOwnProperty(prop)) return this[prop];
	else throw new Error(`There's no property defined as ${prop} in your translations`);
}

/* eslint-enable no-invalid-this, require-jsdoc*/
const lang = {
	get,
};

let obj = require(`./${language}.js`).default;
_.each(Object.getOwnPropertyNames(obj), (property) => {
	const prop = property;
	lang[prop] = Object.assign({}, obj[prop], {get});
});

export default lang;
