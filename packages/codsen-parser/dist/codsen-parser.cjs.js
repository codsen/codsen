/**
 * codsen-parser
 * Parser aiming at broken code, especially HTML & CSS
 * Version: 0.1.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/codsen-parser
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var tokenizer = _interopDefault(require('codsen-tokenizer'));
var op = _interopDefault(require('object-path'));

function _typeof(obj) {
  "@babel/helpers - typeof";

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

function incrementStringNumber(str) {
  if (/^\d*$/.test(str)) {
    return Number.parseInt(str, 10) + 1;
  }
  return str;
}
function pathNext(str) {
  if (typeof str !== "string" || !str.length) {
    return str;
  }
  if (str.includes(".") && /^\d*$/.test(str.slice(str.lastIndexOf(".") + 1))) {
    return "".concat(str.slice(0, str.lastIndexOf(".") + 1)).concat(incrementStringNumber(str.slice(str.lastIndexOf(".") + 1)));
  } else if (/^\d*$/.test(str)) {
    return "".concat(incrementStringNumber(str));
  }
  return str;
}

function decrementStringNumber(str) {
  if (/^\d*$/.test(str)) {
    return Number.parseInt(str, 10) - 1;
  }
  return str;
}
function pathPrev(str) {
  if (typeof str !== "string" || !str.length) {
    return null;
  }
  var extractedValue = str.slice(str.lastIndexOf(".") + 1);
  if (extractedValue === "0") {
    return null;
  } else if (str.includes(".") && /^\d*$/.test(extractedValue)) {
    return "".concat(str.slice(0, str.lastIndexOf(".") + 1)).concat(decrementStringNumber(str.slice(str.lastIndexOf(".") + 1)));
  } else if (/^\d*$/.test(str)) {
    return "".concat(decrementStringNumber(str));
  }
  return null;
}

function pathUp(str) {
  if (typeof str === "string") {
    if (!str.includes(".") || !str.slice(str.indexOf(".") + 1).includes(".")) {
      return "0";
    }
    var dotsCount = 0;
    for (var i = str.length; i--;) {
      if (str[i] === ".") {
        dotsCount++;
      }
      if (dotsCount === 2) {
        return str.slice(0, i);
      }
    }
  }
  return str;
}

function isObj(something) {
  return something && _typeof(something) === "object" && !Array.isArray(something);
}
function cparser(str, originalOpts) {
  if (typeof str !== "string") {
    if (str === undefined) {
      throw new Error("codsen-tokenizer: [THROW_ID_01] the first input argument is completely missing! It should be given as string.");
    } else {
      throw new Error("codsen-tokenizer: [THROW_ID_02] the first input argument must be string! It was given as \"".concat(_typeof(str), "\", equal to:\n").concat(JSON.stringify(str, null, 4)));
    }
  }
  if (originalOpts && !isObj(originalOpts)) {
    throw new Error("codsen-tokenizer: [THROW_ID_03] the second input argument, an options object, should be a plain object but it was given as type ".concat(_typeof(originalOpts), ", equal to ").concat(JSON.stringify(originalOpts, null, 4)));
  }
  if (isObj(originalOpts) && originalOpts.tagCb && typeof originalOpts.tagCb !== "function") {
    throw new Error("codsen-tokenizer: [THROW_ID_04] the opts.tagCb, callback function, should be a function but it was given as type ".concat(_typeof(originalOpts.tagCb), ", equal to ").concat(JSON.stringify(originalOpts.tagCb, null, 4)));
  }
  if (isObj(originalOpts) && originalOpts.charCb && typeof originalOpts.charCb !== "function") {
    throw new Error("codsen-tokenizer: [THROW_ID_05] the opts.charCb, callback function, should be a function but it was given as type ".concat(_typeof(originalOpts.charCb), ", equal to ").concat(JSON.stringify(originalOpts.charCb, null, 4)));
  }
  if (isObj(originalOpts) && originalOpts.reportProgressFunc && typeof originalOpts.reportProgressFunc !== "function") {
    throw new Error("codsen-tokenizer: [THROW_ID_06] the opts.reportProgressFunc, callback function, should be a function but it was given as type ".concat(_typeof(originalOpts.reportProgressFunc), ", equal to ").concat(JSON.stringify(originalOpts.reportProgressFunc, null, 4)));
  }
  if (isObj(originalOpts) && originalOpts.errCb && typeof originalOpts.errCb !== "function") {
    throw new Error("codsen-tokenizer: [THROW_ID_07] the opts.errCb, callback function, should be a function but it was given as type ".concat(_typeof(originalOpts.errCb), ", equal to ").concat(JSON.stringify(originalOpts.errCb, null, 4)));
  }
  var defaults = {
    reportProgressFunc: null,
    reportProgressFuncFrom: 0,
    reportProgressFuncTo: 100,
    tagCb: null,
    charCb: null,
    errCb: null
  };
  var opts = Object.assign({}, defaults, originalOpts);
  var res = [];
  var path;
  var nestNext = false;
  tokenizer(str, {
    reportProgressFunc: opts.reportProgressFunc,
    reportProgressFuncFrom: opts.reportProgressFuncFrom,
    reportProgressFuncTo: opts.reportProgressFuncTo,
    tagCb: function tagCb(tokenObj) {
      console.log("-".repeat(80));
      console.log("173 \u2588\u2588 ".concat("\x1B[".concat(33, "m", "INCOMING TOKEN", "\x1B[", 39, "m"), ":\n", JSON.stringify({
        type: tokenObj.type,
        tagName: tokenObj.tagName,
        start: tokenObj.start,
        end: tokenObj.end
      }, null, 4)));
      if (typeof opts.tagCb === "function") {
        opts.tagCb(tokenObj);
      }
      var prevToken = op.get(res, path);
      if (!isObj(prevToken)) {
        prevToken = null;
      }
      console.log("203 FIY, ".concat("\x1B[".concat(33, "m", "prevToken", "\x1B[", 39, "m"), " = ", JSON.stringify(prevToken, null, 4)));
      if (nestNext && (
      !prevToken || !(prevToken.tagName === tokenObj.tagName && !prevToken.closing && tokenObj.closing))) {
        nestNext = false;
        console.log("226 ".concat("\x1B[".concat(35, "m", "\u2588\u2588 NEST", "\x1B[", 39, "m")));
        path = "".concat(path, ".children.0");
      } else if (tokenObj.closing && typeof path === "string" && path.includes(".")) {
        console.log("235 ".concat("\x1B[".concat(35, "m", "\u2588\u2588 UP", "\x1B[", 39, "m")));
        path = pathNext(pathUp(path));
      } else if (!path) {
        console.log("239 ".concat("\x1B[".concat(35, "m", "\u2588\u2588 FIRST", "\x1B[", 39, "m")));
        path = "0";
      } else {
        console.log("244 ".concat("\x1B[".concat(35, "m", "\u2588\u2588 BUMP", "\x1B[", 39, "m")));
        path = pathNext(path);
      }
      if (["tag", "comment"].includes(tokenObj.type) && !tokenObj["void"] && !tokenObj.closing) {
        nestNext = true;
        console.log("256 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "nestNext", "\x1B[", 39, "m"), " = true"));
      }
      console.log("261 FIY, ".concat("\x1B[".concat(33, "m", "path", "\x1B[", 39, "m"), " = ", JSON.stringify(path, null, 4)));
      var previousPath = pathPrev(path);
      console.log("272 ".concat("\x1B[".concat(33, "m", "previousPath", "\x1B[", 39, "m"), " = ", JSON.stringify(previousPath, null, 4)));
      var previousTagsToken;
      if (previousPath) {
        previousTagsToken = op.get(res, previousPath);
      }
      console.log("283 ".concat("\x1B[".concat(33, "m", "previousTagsToken", "\x1B[", 39, "m"), " = ", JSON.stringify(previousTagsToken, null, 4)));
      console.log("290 ".concat("\x1B[".concat(33, "m", "tokenObj.closing", "\x1B[", 39, "m"), " = ", JSON.stringify(tokenObj.closing, null, 4)));
      if (["tag", "comment"].includes(tokenObj.type) && tokenObj.closing && (!previousPath || !isObj(previousTagsToken) || previousTagsToken.closing || previousTagsToken.type !== tokenObj.type || previousTagsToken.tagName !== tokenObj.tagName)) {
        console.log("307 ".concat("\x1B[".concat(31, "m", "\u2588\u2588 RAISE ERROR ".concat(tokenObj.type, "-").concat(tokenObj.type === "comment" ? tokenObj.kind : "", "-missing-opening"), "\x1B[", 39, "m")));
        if (opts.errCb) {
          opts.errCb({
            ruleId: "".concat(tokenObj.type).concat(tokenObj.type === "comment" ? "-".concat(tokenObj.kind) : "", "-missing-opening"),
            idxFrom: tokenObj.start,
            idxTo: tokenObj.end
          });
        }
      }
      console.log("323 ".concat("\x1B[".concat(33, "m", "res", "\x1B[", 39, "m"), " BEFORE: ", JSON.stringify(res, null, 4)));
      op.set(res, path, Object.assign(tokenObj.type === "tag" ? {
        children: []
      } : {}, tokenObj));
      console.log("335 ".concat("\x1B[".concat(33, "m", "res", "\x1B[", 39, "m"), " AFTER: ", JSON.stringify(res, null, 4)));
      console.log("343 ENDING ".concat("\x1B[".concat(33, "m", "path", "\x1B[", 39, "m"), " = ", JSON.stringify(path, null, 4)));
      console.log("".concat("\x1B[".concat(90, "m", "---", "\x1B[", 39, "m")));
      console.log("".concat("\x1B[".concat(90, "m", "\u2588\u2588 nestNext = ".concat("\x1B[".concat(nestNext ? 32 : 31, "m").concat(nestNext, "\x1B[", 39, "m")), "\x1B[", 39, "m")));
    },
    charCb: opts.charCb
  });
  console.log("-".repeat(80));
  console.log("381 ".concat("\x1B[".concat(32, "m", "FINAL RETURN", "\x1B[", 39, "m"), " ", JSON.stringify(res, null, 4)));
  return res;
}

module.exports = cparser;
