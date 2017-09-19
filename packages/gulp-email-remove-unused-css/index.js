/* eslint no-underscore-dangle:0, consistent-return:0, no-param-reassign:0 */

const remove = require('email-remove-unused-css')
const gutil = require('gulp-util')
const { Transform } = require('stream')

const PLUGIN_NAME = 'gulp-email-remove-unused-css'

function geruc(options) {
  const stream = new Transform({ objectMode: true })
  stream._transform = (file, encoding, cb) => {
    if (file.isStream()) {
      const error = 'Streaming not supported'
      return cb(new gutil.PluginError(PLUGIN_NAME, error))
    } else if (file.isBuffer()) {
      const contents = String(file.contents)
      if (!contents.length) {
        // Don't crash on empty files
        return cb(null, file)
      }
      file.contents = Buffer.from(remove(contents, options).result)
      cb(null, file)
    } else {
      // Pass through when null
      cb(null, file)
    }
  }
  return stream
}

module.exports = geruc
