'use strict';

/* eslint no-underscore-dangle:0, consistent-return:0, no-param-reassign:0 */

var remove = require('email-remove-unused-css');
var gutil = require('gulp-util');

var _require = require('stream'),
    Transform = _require.Transform;

var PLUGIN_NAME = 'gulp-email-remove-unused-css';

function geruc(options) {
  var stream = new Transform({ objectMode: true });
  stream._transform = function (file, encoding, cb) {
    if (file.isStream()) {
      var error = 'Streaming not supported';
      return cb(new gutil.PluginError(PLUGIN_NAME, error));
    } else if (file.isBuffer()) {
      var contents = String(file.contents);
      if (!contents.length) {
        // Don't crash on empty files
        return cb(null, file);
      }
      file.contents = Buffer.from(remove(contents, options).result);
      cb(null, file);
    } else {
      // Pass through when null
      cb(null, file);
    }
  };
  return stream;
}

module.exports = geruc;
