/**
 * emlint
 * Detects errors in HTML/CSS, proposes fixes, email-template friendly
 * Version: 0.3.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://bitbucket.org/codsen/codsen/src/master/packages/emlint
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var clone = _interopDefault(require('lodash.clonedeep'));
var isObj = _interopDefault(require('lodash.isplainobject'));

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

var version = "0.3.0";

function isLowerCaseLetter(char) {
  return isStr(char) && char.length === 1 && char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123;
}
function isStr(something) {
  return typeof something === "string";
}
function charSuitableForTagName(char) {
  return isLowerCaseLetter(char);
}

function emlint(str, originalOpts) {
  if (!isStr(str)) {
    throw new Error("emlint: [THROW_ID_01] the first input argument must be a string. It was given as:\n".concat(JSON.stringify(str, null, 4), " (type ").concat(_typeof(str), ")"));
  }
  if (originalOpts && !isObj(originalOpts)) {
    throw new Error("emlint: [THROW_ID_02] the second input argument must be a plain object. It was given as:\n".concat(JSON.stringify(originalOpts, null, 4), " (type ").concat(_typeof(originalOpts), ")"));
  }
  var logTag;
  var defaultLogTag = {
    tagStartAt: null,
    tagNameStartAt: null,
    tagNameEndAt: null,
    tagName: null,
    attributes: []
  };
  function resetLogTag() {
    logTag = clone(defaultLogTag);
  }
  resetLogTag();
  var logWhitespace;
  var defaultLogWhitespace = {
    startAt: null,
    includesLinebreaks: false,
    lastLinebreakAt: null
  };
  function resetLogWhitespace() {
    logWhitespace = clone(defaultLogWhitespace);
  }
  resetLogWhitespace();
  var retObj = {
    issues: []
  };
  for (var i = 0, len = str.length; i < len; i++) {
    console.log("\x1B[".concat(36, "m", "===============================", "\x1B[", 39, "m \x1B[", 35, "m", "str[ ".concat(i, " ] = ").concat(str[i].trim().length ? str[i] : JSON.stringify(str[i], null, 0)), "\x1B[", 39, "m \x1B[", 36, "m", "===============================", "\x1B[", 39, "m"));
    if (logWhitespace.startAt !== null && str[i].trim().length) {
      resetLogWhitespace();
      console.log("131 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "logWhitespace.startAt", "\x1B[", 39, "m"), " = ", JSON.stringify(logWhitespace.startAt, null, 4)));
    }
    if (!str[i].trim().length && logWhitespace.startAt === null) {
      logWhitespace.startAt = i;
      console.log("143 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "logWhitespace.startAt", "\x1B[", 39, "m"), " = ", JSON.stringify(logWhitespace.startAt, null, 4)));
    }
    if (str[i] === "\n" || str[i] === "\r") {
      if (logWhitespace.startAt !== null && !logWhitespace.includesLinebreaks) {
        logWhitespace.includesLinebreaks = true;
        console.log("156 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "logWhitespace.includesLinebreaks", "\x1B[", 39, "m"), " = ", JSON.stringify(logWhitespace.includesLinebreaks, null, 4)));
      }
      logWhitespace.lastLinebreakAt = i;
    }
    if (logTag.tagNameStartAt !== null && !charSuitableForTagName(str[i])) {
      console.log("168 character not suitable for tag name");
      logTag.tagNameEndAt = i;
      logTag.tagName = str.slice(logTag.tagNameStartAt, i);
      console.log("172 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "logTag.tagNameEndAt", "\x1B[", 39, "m"), " = ", logTag.tagNameEndAt, "; ", "\x1B[".concat(33, "m", "logTag.tagName", "\x1B[", 39, "m"), " = ").concat(JSON.stringify(logTag.tagName, null, 0)));
    }
    if (logTag.tagStartAt !== null && logTag.tagNameStartAt === null && charSuitableForTagName(str[i]) && logTag.tagStartAt < i) {
      logTag.tagNameStartAt = i;
      console.log("191 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "logTag.tagNameStartAt", "\x1B[", 39, "m"), " = ", logTag.tagNameStartAt));
      if (logTag.tagStartAt < i - 1) {
        retObj.issues.push({
          name: "space-after-opening-bracket",
          position: [[logTag.tagStartAt + 1, i]]
        });
      }
    }
    if (str[i] === "<" && logTag.tagStartAt === null) {
      logTag.tagStartAt = i;
      console.log("209 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "logTag.tagStartAt", "\x1B[", 39, "m"), " = ", logTag.tagStartAt));
    }
    if (str[i] === ">" && logTag.tagStartAt !== null) {
      resetLogTag();
      console.log("219 end of tag - ".concat("\x1B[".concat(32, "m", "RESET", "\x1B[", 39, "m"), " logTag"));
    }
    var output = {
      logTag: true,
      logWhitespace: true
    };
    console.log("".concat("\x1B[".concat(31, "m", "\u2588 ", "\x1B[", 39, "m"), output.logTag && logTag.tagStartAt !== null ? "".concat("\x1B[".concat(33, "m", "logTag", "\x1B[", 39, "m"), " ", JSON.stringify(logTag, null, 0), "; ") : "").concat(output.logWhitespace && logWhitespace.startAt !== null ? "".concat("\x1B[".concat(33, "m", "logWhitespace", "\x1B[", 39, "m"), " ", JSON.stringify(logWhitespace, null, 0), "; ") : ""));
  }
  return retObj;
}

exports.emlint = emlint;
exports.version = version;
