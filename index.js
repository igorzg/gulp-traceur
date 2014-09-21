'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var traceur = require('traceur');
var applySourceMap = require('vinyl-sourcemaps-apply');
var objectAssign = require('object-assign');

module.exports = function (options) {
	options = options || {};

	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			this.push(file);
			cb();
			return;
		}

		if (file.isStream()) {
			this.emit('error', new gutil.PluginError('gulp-traceur', 'Streaming not supported'));
			cb();
			return;
		}
		var ret;
		var fileOptions = objectAssign({}, options);
		try {
			ret = traceur.compile(file.contents.toString(), fileOptions);
			if (ret) {
				file.contents = new Buffer(ret);
                this.push(file);
			}
		} catch (err) {
			this.emit('error', new gutil.PluginError('gulp-traceur', err, {
				fileName: file.path
			}));
		}

		cb();
	});
};

module.exports.RUNTIME_PATH = traceur.RUNTIME_PATH;
