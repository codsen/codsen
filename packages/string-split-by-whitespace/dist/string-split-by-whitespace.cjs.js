'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var checkTypes = _interopDefault(require('check-types-mini'));
var within = _interopDefault(require('ranges-is-index-within'));

function split(str, originalOpts) {
  if (str === undefined) {
    throw new Error("string-split-by-whitespace: [THROW_ID_01] The input is missing!");
  }

  if (typeof str !== "string") {
    return str;
  } // early ending:


  if (str.trim() === "") {
    return [];
  }

  var defaults = {
    ignoreRanges: []
  };
  var opts = Object.assign({}, defaults, originalOpts);
  checkTypes(opts, defaults, {
    msg: "string-split-by-whitespace: [THROW_ID_02*]",
    ignorePaths: ["ignoreRanges.*"]
  });

  if (opts.ignoreRanges.length > 0 && !opts.ignoreRanges.every(function (arr) {
    return Array.isArray(arr);
  })) {
    throw new Error("string-split-by-whitespace: [THROW_ID_03] The opts.ignoreRanges contains elements which are not arrays!");
  } // if reached this far, traverse and slice accordingly


  var nonWhitespaceSubStringStartsAt = null;
  var res = [];

  for (var i = 0, len = str.length; i < len; i++) {
    // catch the first non-whitespace character
    if (nonWhitespaceSubStringStartsAt === null && str[i].trim() !== "" && (opts.ignoreRanges.length === 0 || opts.ignoreRanges.length !== 0 && !within(i, opts.ignoreRanges.map(function (arr) {
      return [arr[0], arr[1] - 1];
    }), {
      inclusiveRangeEnds: true
    }))) {
      nonWhitespaceSubStringStartsAt = i;
    } // catch the first whitespace char when recording substring


    if (nonWhitespaceSubStringStartsAt !== null) {
      if (str[i].trim() === "") {
        res.push(str.slice(nonWhitespaceSubStringStartsAt, i));
        nonWhitespaceSubStringStartsAt = null;
      } else if (opts.ignoreRanges.length && within(i, opts.ignoreRanges)) {
        res.push(str.slice(nonWhitespaceSubStringStartsAt, i - 1));
        nonWhitespaceSubStringStartsAt = null;
      } else if (str[i + 1] === undefined) {
        res.push(str.slice(nonWhitespaceSubStringStartsAt, i + 1));
      }
    }
  }

  return res;
}

module.exports = split;
