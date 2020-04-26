const { comb } = require("email-comb");
const PluginError = require("plugin-error");
const { Transform } = require("stream");

const PLUGIN_NAME = "gulp-email-remove-unused-css";

function geruc(options) {
  const stream = new Transform({ objectMode: true });
  // eslint-disable-next-line no-underscore-dangle
  stream._transform = (file, encoding, cb) => {
    if (file.isStream()) {
      const error = "Streaming not supported";
      return cb(new PluginError(PLUGIN_NAME, error));
    }
    if (file.isBuffer()) {
      const contents = String(file.contents);
      if (!contents.length) {
        // Don't crash on empty files
        return cb(null, file);
      }
      file.contents = Buffer.from(comb(contents, options).result);
      cb(null, file);
    } else {
      // Pass through when null
      cb(null, file);
    }
  };
  return stream;
}

module.exports = geruc;
