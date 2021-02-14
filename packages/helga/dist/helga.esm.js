/**
 * helga
 * Your next best friend when editing complex nested code
 * Version: 1.3.5
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/helga/
 */

var version = "1.3.5";

const version$1 = version;
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
  }; // console.log(
  //   `011 using ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
  //     opts,
  //     null,
  //     4
  //   )}`
  // );
  // 1. beautification:
  // ---------------------------------------------------------------------------

  const beautified = unescape(str); // 2. minification:
  // ---------------------------------------------------------------------------

  let minified = unescape(str);

  if (opts.targetJSON) {
    // if target is JSON, replace all tabs with two spaces, then JSON stringify
    minified = JSON.stringify(minified.replace(/\t/g, "  "), null, 0); // remove wrapper quotes

    minified = minified.slice(1, minified.length - 1);
  } // ---------------------------------------------------------------------------


  return {
    minified,
    beautified
  };
}

export { defaults, helga, version$1 as version };
