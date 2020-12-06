/**
 * stristri
 * Extracts or deletes HTML, CSS, text and/or templating tags from string
 * Version: 1.1.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/stristri/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tokenizer = require('codsen-tokenizer');
var collapse = require('string-collapse-white-space');
var applyR = require('ranges-apply');
var mergeR = require('ranges-merge');
var detectLang = require('detect-templating-language');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var tokenizer__default = /*#__PURE__*/_interopDefaultLegacy(tokenizer);
var collapse__default = /*#__PURE__*/_interopDefaultLegacy(collapse);
var applyR__default = /*#__PURE__*/_interopDefaultLegacy(applyR);
var mergeR__default = /*#__PURE__*/_interopDefaultLegacy(mergeR);
var detectLang__default = /*#__PURE__*/_interopDefaultLegacy(detectLang);

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

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

var defaultOpts = {
  html: true,
  css: true,
  text: false,
  templatingTags: false
};

var version = "1.1.0";

function returnHelper(result, ranges, applicableOpts, templatingLang) {
  /* istanbul ignore next */
  if (arguments.length !== 4) {
    throw new Error("stristri/returnHelper(): should be 3 input args but ".concat(arguments.length, " were given!"));
  }
  /* istanbul ignore next */
  if (typeof result !== "string") {
    throw new Error("stristri/returnHelper(): first arg missing!");
  }
  /* istanbul ignore next */
  if (_typeof(applicableOpts) !== "object") {
    throw new Error("stristri/returnHelper(): second arg missing!");
  }
  return {
    result: result,
    ranges: ranges,
    applicableOpts: applicableOpts,
    templatingLang: templatingLang
  };
}
function stri(input, originalOpts) {
  if (typeof input !== "string") {
    throw new Error("stristri: [THROW_ID_01] the first input arg must be string! It was given as ".concat(JSON.stringify(input, null, 4), " (").concat(_typeof(input), ")"));
  }
  if (originalOpts && _typeof(originalOpts) !== "object") {
    throw new Error("stristri: [THROW_ID_02] the second input arg must be a plain object! It was given as ".concat(JSON.stringify(originalOpts, null, 4), " (").concat(_typeof(originalOpts), ")"));
  }
  var opts = _objectSpread2(_objectSpread2({}, defaultOpts), originalOpts);
  var applicableOpts = Object.keys(opts).reduce(function (acc, key) {
    /* istanbul ignore else */
    if (typeof opts[key] === "boolean") {
      acc[key] = false;
    }
    return acc;
  }, {});
  if (!input) {
    returnHelper("", null, applicableOpts, detectLang__default['default'](input));
  }
  var gatheredRanges = [];
  var withinHTMLComment = false;
  var withinXML = false;
  var withinCSS = false;
  tokenizer__default['default'](input, {
    tagCb: function tagCb(token) {
      /* istanbul ignore else */
      if (token.type === "comment") {
        if (withinCSS) {
          if (!applicableOpts.css) {
            applicableOpts.css = true;
          }
          if (opts.css) {
            gatheredRanges.push([token.start, token.end, " "]);
          }
        } else {
          if (!applicableOpts.html) {
            applicableOpts.html = true;
          }
          if (!token.closing && !withinXML && !withinHTMLComment) {
            withinHTMLComment = true;
          } else if (token.closing && withinHTMLComment) {
            withinHTMLComment = false;
          }
          if (opts.html) {
            gatheredRanges.push([token.start, token.end, " "]);
          }
        }
      } else if (token.type === "tag" || !withinCSS && token.type === "comment") {
        if (!applicableOpts.html) {
          applicableOpts.html = true;
        }
        if (opts.html) {
          gatheredRanges.push([token.start, token.end, " "]);
        }
        if (token.tagName === "style" && !token.closing) {
          withinCSS = true;
        } else if (
        withinCSS && token.tagName === "style" && token.closing) {
          withinCSS = false;
        }
        if (token.tagName === "xml") {
          if (!token.closing && !withinXML && !withinHTMLComment) {
            withinXML = true;
          } else if (token.closing && withinXML) {
            withinXML = false;
          }
        }
      } else if (["at", "rule"].includes(token.type)) {
        if (!applicableOpts.css) {
          applicableOpts.css = true;
        }
        if (opts.css) {
          gatheredRanges.push([token.start, token.end, " "]);
        }
      } else if (token.type === "text") {
        if (!withinCSS && !withinHTMLComment && !withinXML && !applicableOpts.text && token.value.trim()) {
          applicableOpts.text = true;
        }
        if (withinCSS && opts.css || withinHTMLComment && opts.html || !withinCSS && !withinHTMLComment && !withinXML && opts.text) {
          if (token.value.includes("\n")) {
            gatheredRanges.push([token.start, token.end, "\n"]);
          } else {
            gatheredRanges.push([token.start, token.end, " "]);
          }
        }
      } else if (token.type === "esp") {
        if (!applicableOpts.templatingTags) {
          applicableOpts.templatingTags = true;
        }
        if (opts.templatingTags) {
          gatheredRanges.push([token.start, token.end, " "]);
        }
      }
    }
  });
  return returnHelper(collapse__default['default'](applyR__default['default'](input, gatheredRanges), {
    trimLines: true,
    removeEmptyLines: true,
    limitConsecutiveEmptyLinesTo: 1
  }).result, mergeR__default['default'](gatheredRanges), applicableOpts, detectLang__default['default'](input));
}

exports.defaults = defaultOpts;
exports.stri = stri;
exports.version = version;
