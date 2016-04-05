"use strict";

var assert = require('core-assert'),
    timer = require('nano-timer'),
    Promise = require('nano-promise'),
    util = require('util');


/* ------------------------------------------------------------------------ */
function Logger(stage, job) {

	var context = job.sched.name + ':' + job.name + '#' + stage;

	this.stage = stage;
	this.job = job;
	this.acc = [];
	this.dumps = [];

	this.log = function (code, format, a, b, etc) {
		acc.push(util.format('  %s: %s', context, util.format.apply(util.format, Array.prototype.slice.call(arguments, 1))));
	};

	this.trace = function () {
		this.log.apply(this, Array.prototype.concat.apply(['trace'], arguments));
	};

	this.warn = function (code, format, a, b, etc) {
		acc.push(util.format('W.%s: warning: %s', context, util.format.apply(util.format, Array.prototype.slice.call(arguments, 1))));
	};

	this.error = function (format, a, b, etc) {
		acc.push(util.format('E.%s: error: %s', context, util.format.apply(util.format, Array.prototype.slice.call(arguments, 1))));
	};

	this.fail = function (format, a, b, etc) {
		acc.push(util.format('F.%s: FAIL: %s', context, util.format.apply(util.format, arguments)));
	};

	this.writeListing = function (name, data) {
		this.dumps.push({
			name: name, 
			data: data
		});

		return Promise.resolve();
	};
}

Logger.prototype = {
};


var ejs_plugin = require('../index.js'),
    opts = {},
    job = {
		name: 'test',
		sched: {
			name: 'test',
			opts: opts
		}
	};

suite('ejs', function () {
	test('fine', function (done) {

		var log = new Logger('ejs', job),
		    data = {
					opts: opts,
					encoding: 'utf8',
					content: '--<?=44?>--',
					result: '--44--'
				};

		Promise.resolve(log, data)
			.then(ejs_plugin)
			.then(function () {
				assert.deepStrictEqual(data.content, data.result);
				done();
			}).catch(done);
	});

	test('fine with args', function (done) {

		var log = new Logger('ejs', job),
		    data = {
					opts: opts,
					encoding: 'utf8',
					ejs_args: { o: 5, a: '23432' },
					content: '--<?=a?>--<?=o?>--',
					result: '--23432--5--'
				};

		Promise.resolve(log, data)
			.then(ejs_plugin)
			.then(function () {
				assert.deepStrictEqual(data.content, data.result);
				done();
			}).catch(done);
	});

	test('bad encoding', function (done) {
		var log = new Logger('ejs', job),
		    data = {
					opts: opts,
					encoding: 'utf',
					content: '--<%=44%>--',
					result: '--44--'
				};

		Promise.resolve(log, data)
			.then(ejs_plugin)
			.then(function () {
				done(Error('not failed'));
			}, function (e) {
				done();
			}).catch(done);
	});
});
