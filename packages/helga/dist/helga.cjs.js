/**
 * helga
 * Your next best friend when editing complex nested code
 * Version: 1.3.3
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/helga/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);

var version = "1.3.3";

var version$1 = version;
var defaults = {
  targetJSON: false
};
var escapes = {
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
  return str.replace(/\\([bfnrtv'"\\0])/g, function (match) {
    return escapes[match] || match && (match.startsWith("\\") ? escapes[match.slice(1)] : "");
  });
}

function helga(str, originalOpts) {
  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), originalOpts); // console.log(
  //   `011 using ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
  //     opts,
  //     null,
  //     4
  //   )}`
  // );
  // 1. beautification:
  // ---------------------------------------------------------------------------


  var beautified = unescape(str); // 2. minification:
  // ---------------------------------------------------------------------------

  var minified = unescape(str);

  if (opts.targetJSON) {
    // if target is JSON, replace all tabs with two spaces, then JSON stringify
    minified = JSON.stringify(minified.replace(/\t/g, "  "), null, 0); // remove wrapper quotes

    minified = minified.slice(1, minified.length - 1);
  } // ---------------------------------------------------------------------------


  return {
    minified: minified,
    beautified: beautified
  };
}

exports.defaults = defaults;
exports.helga = helga;
exports.version = version$1;
