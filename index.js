"use strict";

var ejs = require('nano-ejs'),
    Path = require('path');

module.exports = function (log, data) {
	if (data.encoding !== 'utf8')
		throw TypeError('data.encoding is not "utf8"');

	var ejs_args = data.ejs_args || (data.opts && data.opts.globals);

	if (ejs_args)
		var args_names = Object.keys(ejs_args),
		    args = args_names.map(function (v) { return ejs_args[v]; });
	else
		var args_names = '', args = [];

	try {
		var fn = ejs.compile(data.content, args_names);
	} catch (e) {
		return log.writeListing(data.id+'.js', e.source).then(function () {
			throw e;
		});
	}
	data.content = fn.apply(null, args);
};
