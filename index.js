"use strict";

var ejs = require('nano-ejs'),
    Path = require('path');

module.exports = function (log, data) {
	if (data.encoding !== 'utf8')
		throw TypeError('data.encoding is not "utf8"');

	var args_names = data.ejs_args ? Object.keys(data.ejs_args) : [],
	    args = args_names.map(function (v) { return data.ejs_args[v]; });

	try {
		var fn = ejs.compile(data.content, args_names);
	} catch (e) {
		return log.writeListing(data.id+'.js', e.source).then(function () {
			throw e;
		});
	}
	data.content = fn.apply(null, args);
};
