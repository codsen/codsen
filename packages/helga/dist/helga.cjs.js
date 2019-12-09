/**
 * helga
 * Your next best friend when editing complex nested code
 * Version: 1.1.25
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/helga
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var unescapeJs = _interopDefault(require('unescape-js'));

var version = "1.1.25";

var defaults = {
  targetJSON: false
};
function helga(str, originalOpts) {
  var opts = Object.assign({}, defaults, originalOpts);
  var beautified = unescapeJs(str);
  var minified = unescapeJs(str);
  if (opts.targetJSON) {
    minified = JSON.stringify(minified.replace(/\t/g, "  "), null, 0);
    minified = minified.slice(1, minified.length - 1);
  }
  return {
    minified: minified,
    beautified: beautified
  };
}

exports.defaults = defaults;
exports.helga = helga;
exports.version = version;
