'use strict';

const readMultipleFiles = require('.');
const test = require('tape');

const expected = [
	Buffer.from('.nyc_output\nnode_modules\ncoverage\n'),
	Buffer.from('* text=auto\n')
];

test('readMultipleFiles()', t => {
	t.plan(13);

	readMultipleFiles(new Set(['.gitignore', '.gitattributes'])).subscribe({
		next({path, contents}) {
			if (path === '.gitignore') {
				t.ok(contents.equals(expected[0]), 'should read files.');
				return;
			}

			t.equal(path, '.gitattributes', 'should set `path` property to the every result.');
			t.ok(contents.equals(expected[1]), 'should set `contents` property to the every result.');
		},
		error: t.fail,
		complete() {
			t.pass('should invoke `complete` function of the observer');
		}
	});

	readMultipleFiles(['.gitattributes'], 'hex').subscribe({
		next({contents}) {
			t.equal(
				contents,
				expected[1].toString('hex'),
				'should reflect `encoding` string to the result.'
			);
		},
		error: t.fail
	});

	readMultipleFiles([Buffer.from('./.gitignore')], {encoding: 'base64'}).subscribe({
		next({contents}) {
			t.equal(
				contents,
				expected[0].toString('base64'),
				'should reflect `encoding` option to the result.'
			);
		},
		error: t.fail
	});

	readMultipleFiles([]).forEach(t.fail).then(() => {
		t.pass('should support an empty array.');
	}, t.fail);

	const complete = t.fail.bind(t, 'Unexpectedly completed.');

	readMultipleFiles(['.gitattributes', 'node_modules', 'index.js']).subscribe({
		error({code}) {
			t.equal(
				code,
				'EISDIR',
				'should fail when it canot read at least one of te paths.'
			);
		},
		complete
	});

	readMultipleFiles('test.js').subscribe({
		error(err) {
			t.equal(
				err.toString(),
				'TypeError: Expected file paths (<Array> or <Set>), but got \'test.js\' (string) instead.',
				'should throw an error when the first argument is neither an Array nor Set.'
			);
		},
		complete
	});

	readMultipleFiles(['test.js', ['index.js']]).subscribe({
		error(err) {
			t.equal(
				err.toString(),
				'TypeError: path must be a string or Buffer',
				'should throw an error when the array contains non-path values.'
			);
		},
		complete
	});

	const fail = t.fail.bind('Unexpectedly completed.');

	readMultipleFiles(['test.js'], {encoding: 'utf7'}).subscribe({
		error({code}) {
			t.equal(
				code,
				'ERR_INVALID_OPT_VALUE_ENCODING',
				'should fail when it takes an invalid fs.readFile option.'
			);
		},
		complete: fail
	});

	readMultipleFiles().subscribe({
		error({message}) {
			t.equal(
				message,
				'Expected 1 or 2 arguments (paths: <Array|Set>[, options: <Object>]), but got no arguments instead.',
				'should fail when it takes no arguments.'
			);
		},
		complete: fail
	});

	readMultipleFiles('a', 'b', 'c').subscribe({
		error({message}) {
			t.equal(
				message,
				'Expected 1 or 2 arguments (paths: <Array|Set>[, options: <Object>]), but got 3 arguments instead.',
				'should fail when it takes no arguments.'
			);
		},
		complete: fail
	});
});
