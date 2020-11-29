/**
 * html-table-patcher
 * Visual helper to place templating code around table tags into correct places
 * Version: 3.0.2
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/html-table-patcher/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var parser = require('codsen-parser');
var Ranges = require('ranges-push');
var apply = require('ranges-apply');
var traverse = require('ast-monkey-traverse-with-lookahead');
var htmlCommentRegex = require('html-comment-regex');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var parser__default = /*#__PURE__*/_interopDefaultLegacy(parser);
var Ranges__default = /*#__PURE__*/_interopDefaultLegacy(Ranges);
var apply__default = /*#__PURE__*/_interopDefaultLegacy(apply);
var traverse__default = /*#__PURE__*/_interopDefaultLegacy(traverse);
var htmlCommentRegex__default = /*#__PURE__*/_interopDefaultLegacy(htmlCommentRegex);

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

var version = "3.0.2";

var ranges = new Ranges__default['default']();
function isStr(something) {
  return typeof something === "string";
}
function isObj(something) {
  return something && _typeof(something) === "object" && !Array.isArray(something);
}
var defaults = {
  cssStylesContent: "",
  alwaysCenter: false
};
function patcher(str, generalOpts) {
  if (typeof str !== "string" || str.length === 0) {
    return {
      result: str
    };
  }
  var opts = _objectSpread2(_objectSpread2({}, defaults), generalOpts);
  if (opts.cssStylesContent && (
  !isStr(opts.cssStylesContent) ||
  !opts.cssStylesContent.trim())) {
    opts.cssStylesContent = "";
  }
  var knownCommentTokenPaths = [];
  traverse__default['default'](parser__default['default'](str), function (key, val, innerObj) {
    /* istanbul ignore else */
    if (isObj(key) && key.type === "comment" && !knownCommentTokenPaths.some(function (oneOfRecordedPaths) {
      return innerObj.path.startsWith(oneOfRecordedPaths);
    })) {
      knownCommentTokenPaths.push(innerObj.path);
    } else if (
    isObj(key) &&
    key.type === "tag" && key.tagName === "table" && !knownCommentTokenPaths.some(function (oneOfKnownCommentPaths) {
      return innerObj.path.startsWith(oneOfKnownCommentPaths);
    }) &&
    !key.closing &&
    key.children.some(function (childNodeObj) {
      return ["text", "esp"].includes(childNodeObj.type);
    })) {
      var colspanVal = 1;
      var centered = false;
      var firstTrFound;
      if (
      key.children.some(function (childNodeObj) {
        return childNodeObj.type === "tag" && childNodeObj.tagName === "tr" && !childNodeObj.closing && (firstTrFound = childNodeObj);
      })) {
        var count = 0;
        for (var i = 0, len = firstTrFound.children.length; i < len; i++) {
          var obj = firstTrFound.children[i];
          if (obj.type === "tag" && obj.tagName === "td") {
            if (!obj.closing) {
              centered = obj.attribs.some(function (attrib) {
                return attrib.attribName === "align" && attrib.attribValueRaw === "center" || attrib.attribName === "style" && /text-align:\s*center/i.test(attrib.attribValueRaw);
              });
              count++;
              if (count > colspanVal) {
                colspanVal = count;
              }
            }
          } else if (obj.type !== "text" || obj.value.replace(htmlCommentRegex__default['default'], "").trim()) {
            count = 0;
          }
        }
      }
      key.children
      .filter(function (childNodeObj) {
        return ["text", "esp"].includes(childNodeObj.type);
      })
      .forEach(function (obj) {
        if (obj.value.replace(htmlCommentRegex__default['default'], "").trim()) {
          ranges.push(obj.start, obj.end, "\n<tr>\n  <td".concat(colspanVal > 1 ? " colspan=\"".concat(colspanVal, "\"") : "").concat(opts.alwaysCenter || centered ? " align=\"center\"" : "").concat(opts.cssStylesContent ? " style=\"".concat(opts.cssStylesContent, "\"") : "", ">\n    ").concat(obj.value.trim(), "\n  </td>\n</tr>\n"));
        }
      });
      key.children
      .filter(function (obj) {
        return obj.type === "tag" && obj.tagName === "tr" && !obj.closing;
      }).forEach(function (trTag) {
        var doNothing = false;
        for (var _i = 0, _len = trTag.children.length; _i < _len; _i++) {
          var childNodeObj = trTag.children[_i];
          if (doNothing && childNodeObj.type === "comment" && childNodeObj.closing) {
            doNothing = false;
            continue;
          }
          if (!doNothing && childNodeObj.type === "comment" && !childNodeObj.closing) {
            doNothing = true;
          }
          if (!doNothing && ["text", "esp"].includes(childNodeObj.type) && childNodeObj.value.trim()) {
            if (childNodeObj.value.trim()) {
              if (!_i) {
                ranges.push(childNodeObj.start, childNodeObj.end, "\n  <td".concat(colspanVal > 1 ? " colspan=\"".concat(colspanVal, "\"") : "").concat(opts.alwaysCenter || centered ? " align=\"center\"" : "").concat(opts.cssStylesContent ? " style=\"".concat(opts.cssStylesContent, "\"") : "", ">\n    ").concat(childNodeObj.value.trim(), "\n  </td>\n</tr>\n<tr>\n"));
              } else if (_i && _len > 1 && _i === _len - 1) {
                ranges.push(childNodeObj.start, childNodeObj.end, "\n</tr>\n<tr>\n  <td".concat(colspanVal > 1 ? " colspan=\"".concat(colspanVal, "\"") : "").concat(opts.alwaysCenter || centered ? " align=\"center\"" : "").concat(opts.cssStylesContent ? " style=\"".concat(opts.cssStylesContent, "\"") : "", ">\n    ").concat(childNodeObj.value.trim(), "\n  </td>\n"));
              } else {
                ranges.push(childNodeObj.start, childNodeObj.end, "\n</tr>\n<tr>\n  <td".concat(colspanVal > 1 ? " colspan=\"".concat(colspanVal, "\"") : "").concat(opts.alwaysCenter || centered ? " align=\"center\"" : "").concat(opts.cssStylesContent ? " style=\"".concat(opts.cssStylesContent, "\"") : "", ">\n    ").concat(childNodeObj.value.trim(), "\n  </td>\n</tr>\n<tr>\n"));
              }
            }
          }
        }
      });
    }
  });
  if (ranges.current()) {
    var result = apply__default['default'](str, ranges.current());
    ranges.wipe();
    return {
      result: result
    };
  }
  return {
    result: str
  };
}

exports.defaults = defaults;
exports.patcher = patcher;
exports.version = version;
