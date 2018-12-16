'use strict';

const {promisify} = require('util');
const {readFile} = require('fs');

const inspectWithKind = require('inspect-with-kind');
const Observable = require('zen-observable');

const promisifiedReadFile = promisify(readFile);

module.exports = function readMultipleFiles(...args) {
	return new Observable(observer => {
		const argLen = args.length;

		if (argLen !== 1 && argLen !== 2) {
			throw new RangeError(`Expected 1 or 2 arguments (paths: <Array|Set>[, options: <Object>]), but got ${
				argLen === 0 ? 'no' : argLen
			} arguments instead.`);
		}

		const [paths, options] = args;

		if (!Array.isArray(paths) && !(paths instanceof Set)) {
			const error = new TypeError(`Expected file paths (<Array> or <Set>), but got ${
				inspectWithKind(paths)
			} instead.`);

			error.code = 'ERR_INVALID_ARG_TYPE';
			throw error;
		}

		(async () => {
			try {
				await Promise.all([...paths].map(async path => observer.next({
					path,
					contents: await promisifiedReadFile(path, options)
				})));
			} catch (err) {
				observer.error(err);
			}

			observer.complete();
		})();
	});
};
