/**
 * codsen-tokenizer
 * Tokenizer for mixed inputs aiming at broken code, especially HTML & CSS
 * Version: 1.0.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/codsen-tokenizer
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var isObj = _interopDefault(require('lodash.isplainobject'));
var isTagOpening = _interopDefault(require('is-html-tag-opening'));

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

function isStr(something) {
  return typeof something === "string";
}
var defaults = {
  reportProgressFunc: null,
  reportProgressFuncFrom: 0,
  reportProgressFuncTo: 100
};
var espChars = "{}%-$_()*|";
function flipEspTag(str) {
  var res = "";
  for (var i = 0, len = str.length; i < len; i++) {
    if (str[i] === "{") {
      res = "}".concat(res);
    } else if (str[i] === "(") {
      res = ")".concat(res);
    } else {
      res = "".concat(str[i]).concat(res);
    }
  }
  return res;
}
function tokenizer(str, cb, originalOpts) {
  if (!isStr(str)) {
    if (str === undefined) {
      throw new Error("html-crush: [THROW_ID_01] the first input argument is completely missing! It should be given as string.");
    } else {
      throw new Error("html-crush: [THROW_ID_02] the first input argument must be string! It was given as \"".concat(_typeof(str), "\", equal to:\n").concat(JSON.stringify(str, null, 4)));
    }
  }
  if (typeof cb !== "function") {
    throw new Error("html-crush: [THROW_ID_03] the second input argument, callback function, should be a function but it was given as type ".concat(_typeof(cb), ", equal to ").concat(JSON.stringify(cb, null, 4)));
  }
  if (originalOpts && !isObj(originalOpts)) {
    throw new Error("html-crush: [THROW_ID_04] the third input argument, options object, should be a plain object but it was given as type ".concat(_typeof(originalOpts), ", equal to ").concat(JSON.stringify(originalOpts, null, 4)));
  }
  var opts = Object.assign({}, defaults, originalOpts);
  var currentPercentageDone;
  var lastPercentage = 0;
  var len = str.length;
  var midLen = Math.floor(len / 2);
  var doNothing;
  var token = {};
  var tokenDefault = {
    type: null,
    start: null,
    end: null,
    tail: null
  };
  function tokenReset() {
    token = Object.assign({}, tokenDefault);
  }
  tokenReset();
  var layers = [];
  function pingcb(incomingToken) {
    cb(incomingToken);
    tokenReset();
  }
  function dumpCurrentToken(token, i) {
    if (token.start !== null) {
      token.end = i;
      pingcb(token);
    }
  }
  for (var i = 0; i < len; i++) {
    if (opts.reportProgressFunc) {
      if (len > 1000 && len < 2000) {
        if (i === midLen) {
          opts.reportProgressFunc(Math.floor((opts.reportProgressFuncTo - opts.reportProgressFuncFrom) / 2));
        }
      } else if (len >= 2000) {
        currentPercentageDone = opts.reportProgressFuncFrom + Math.floor(i / len);
        if (currentPercentageDone !== lastPercentage) {
          lastPercentage = currentPercentageDone;
          opts.reportProgressFunc(currentPercentageDone);
        }
      }
    }
    if (Number.isInteger(doNothing) && i >= doNothing) {
      doNothing = false;
    }
    if (!doNothing && ["html", "text"].includes(token.type) && ["\"", "'"].includes(str[i])) {
      if (layers.length && layers[layers.length - 1] === str[i]) {
        layers.pop();
      } else {
        layers.push(str[i]);
      }
    }
    if (!doNothing) {
      if (!layers.length && str[i] === "<" && isTagOpening(str, i)) {
        dumpCurrentToken(token, i);
        token.start = i;
        token.type = "html";
      } else if (token.type !== "esp" && espChars.includes(str[i]) && str[i + 1] && espChars.includes(str[i + 1])) {
        dumpCurrentToken(token, i);
        token.start = i;
        token.type = "esp";
        var wholeEspTagOpening = "";
        for (var y = i; y < len; y++) {
          if (espChars.includes(str[y])) {
            wholeEspTagOpening = wholeEspTagOpening + str[y];
          } else {
            break;
          }
        }
        doNothing = i + wholeEspTagOpening.length;
        token.tail = flipEspTag(wholeEspTagOpening);
      } else if (token.start === null || token.end === i) {
        if (token.end) {
          pingcb(token);
        }
        token.start = i;
        token.type = "text";
      }
    }
    if (!doNothing) {
      if (token.type === "html" && !layers.length && str[i] === ">") {
        token.end = i + 1;
      } else if (token.type === "esp" && token.end === null && isStr(token.tail) && token.tail.includes(str[i])) {
        var wholeEspTagClosing = "";
        for (var _y = i; _y < len; _y++) {
          if (espChars.includes(str[_y])) {
            wholeEspTagClosing = wholeEspTagClosing + str[_y];
          } else {
            break;
          }
        }
        token.end = i + wholeEspTagClosing.length;
        doNothing = i + wholeEspTagClosing.length;
      }
    }
    if (!str[i + 1] && token.start !== null) {
      token.end = i + 1;
      pingcb(token);
    }
  }
}

module.exports = tokenizer;
