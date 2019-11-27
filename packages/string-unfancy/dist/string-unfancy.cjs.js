/**
 * string-unfancy
 * Replace all fancy dashes, quotes etc with their simpler equivalents
 * Version: 3.9.49
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-unfancy
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var he = _interopDefault(require('he'));

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function existy(x) {
  return x != null;
}
function unfancy(str) {
  var CHARS = {
    "\xB4": "'",
    ʻ: "'",
    ʼ: "'",
    ʽ: "'",
    ˈ: "'",
    ʹ: "'",
    "\u0312": "'",
    "\u0313": "'",
    "\u0314": "'",
    "\u0315": "'",
    ʺ: '"',
    "\u201C": '"',
    "\u201D": '"',
    "\u2012": "-",
    "\u2013": "-",
    "\u2014": "-",
    "\u2018": "'",
    "\u2019": "'",
    "\u2026": "...",
    "\u2212": "-",
    "\uFE49": "-",
    "\xA0": " "
  };
  if (!existy(str)) {
    throw new Error("string-unfancy/unfancy(): [THROW_ID_01] The input is missing!");
  }
  if (typeof str !== "string") {
    throw new Error("string-unfancy/unfancy(): [THROW_ID_02] The input is not a string! It's: ".concat(_typeof(str)));
  }
  var res = str;
  while (he.decode(res) !== res) {
    res = he.decode(res);
  }
  for (var i = 0, len = res.length; i < len; i++) {
    if (Object.prototype.hasOwnProperty.call(CHARS, res[i])) {
      res = res.slice(0, i) + CHARS[res[i]] + res.slice(i + 1);
    }
  }
  return res;
}

module.exports = unfancy;
