'use strict'

var remove = require('gulp-email-remove-unused-css')
var gutil = require('gulp-util')
var Transform = require('stream').Transform

var PLUGIN_NAME = 'gulp-email-remove-unused-css'

module.exports = function (options) {
  var stream = new Transform({objectMode: true})
  stream._transform = function (file, encoding, cb) {
    if (file.isStream()) {
      var error = 'Streaming not supported'
      return cb(new gutil.PluginError(PLUGIN_NAME, error))
    } else if (file.isBuffer()) {
      var contents = String(file.contents)
      if (!contents.length) {
        // Don't crash on empty files
        return cb(null, file)
      }
      file.contents = new Buffer(remove(contents, options)[0])
      cb(null, file)
    } else {
      // Pass through when null
      cb(null, file)
    }
  }
  return stream
}
