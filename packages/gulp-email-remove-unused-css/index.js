import { comb } from "email-comb";
import PluginError from "plugin-error";
import { Transform } from "stream";

const PLUGIN_NAME = "gulp-email-remove-unused-css";

function geruc(options) {
  let stream = new Transform({ objectMode: true });

  stream._transform = (file, encoding, cb) => {
    if (file.isStream()) {
      let error = "Streaming not supported";
      cb(new PluginError(PLUGIN_NAME, error));
      return;
    }
    if (file.isBuffer()) {
      let contents = String(file.contents);
      if (!contents.length) {
        // Don't crash on empty files
        cb(null, file);
        return;
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

export default geruc;
