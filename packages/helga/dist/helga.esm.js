/**
 * @name helga
 * @fileoverview Your next best friend when editing complex nested code
 * @version 1.3.14
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/helga/}
 */

var version$1 = "1.3.14";

const version = version$1;
const defaults = {
  targetJSON: false
};
const escapes = {
  b: "\b",
  f: "\f",
  n: "\n",
  r: "\r",
  t: "\t",
  v: "\v",
  "'": "'",
  '"': '"',
  "\\": "\\",
  "0": "\0"
};
function unescape(str) {
  return str.replace(/\\([bfnrtv'"\\0])/g, match => {
    return escapes[match] || match && (match.startsWith(`\\`) ? escapes[match.slice(1)] : "");
  });
}
function helga(str, originalOpts) {
  const opts = { ...defaults,
    ...originalOpts
  };
  const beautified = unescape(str);
  let minified = unescape(str);
  if (opts.targetJSON) {
    minified = JSON.stringify(minified.replace(/\t/g, "  "), null, 0);
    minified = minified.slice(1, minified.length - 1);
  }
  return {
    minified,
    beautified
  };
}

export { defaults, helga, version };
