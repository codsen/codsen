'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var he = require('he');
function existy(x) {
  return x != null;
}

function unfancy(str) {
  var CHARS = {
    '\xB4': '\'',
    '\u02BB': '\'',
    '\u02BC': '\'',
    '\u02BD': '\'',
    '\u02C8': '\'',
    '\u02B9': '\'',
    '\u0312': '\'',
    '\u0313': '\'',
    '\u0314': '\'',
    '\u0315': '\'',
    '\u02BA': '"',
    '\u201C': '"',
    '\u201D': '"',
    '\u2012': '-',
    '\u2013': '-',
    '\u2014': '-',
    '\u2018': '\'',
    '\u2019': '\'',
    '\u2026': '...',
    '\u2212': '-',
    '\uFE49': '-',
    '\xA0': ' '
  };
  if (!existy(str)) {
    throw new Error('string-unfancy/unfancy(): [THROW_ID_01] The input is missing!');
  }
  if (typeof str !== 'string') {
    throw new Error('string-unfancy/unfancy(): [THROW_ID_02] The input is not a string! It\'s: ' + (typeof str === 'undefined' ? 'undefined' : _typeof(str)));
  }
  // decode anticipating multiple encoding on top of one another
  while (he.decode(str) !== str) {
    str = he.decode(str);
  }
  for (var i = 0, len = str.length; i < len; i++) {
    if (CHARS.hasOwnProperty(str[i])) {
      str = str.slice(0, i) + CHARS[str[i]] + str.slice(i + 1);
    }
  }
  return str;
}

module.exports = unfancy;