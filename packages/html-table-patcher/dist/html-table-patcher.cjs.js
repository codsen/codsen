/**
 * @name html-table-patcher
 * @fileoverview Visual helper to place templating code around table tags into correct places
 * @version 4.0.14
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/html-table-patcher/}
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var _typeof = require('@babel/runtime/helpers/typeof');
var codsenParser = require('codsen-parser');
var rangesPush = require('ranges-push');
var rangesApply = require('ranges-apply');
var astMonkeyTraverseWithLookahead = require('ast-monkey-traverse-with-lookahead');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);
var _typeof__default = /*#__PURE__*/_interopDefaultLegacy(_typeof);

var version$1 = "4.0.14";

var version = version$1;
var htmlCommentRegex = /<!--([\s\S]*?)-->/g;
var ranges = new rangesPush.Ranges();
function isObj(something) {
  return something && _typeof__default['default'](something) === "object" && !Array.isArray(something);
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
  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), generalOpts);
  if (opts.cssStylesContent && (
  typeof opts.cssStylesContent !== "string" ||
  !opts.cssStylesContent.trim())) {
    opts.cssStylesContent = "";
  }
  var knownCommentTokenPaths = [];
  astMonkeyTraverseWithLookahead.traverse(codsenParser.cparser(str), function (token, _val, innerObj) {
    /* istanbul ignore else */
    if (isObj(token) && token.type === "comment" && !knownCommentTokenPaths.some(function (oneOfRecordedPaths) {
      return innerObj.path.startsWith(oneOfRecordedPaths);
    })) {
      knownCommentTokenPaths.push(innerObj.path);
    } else if (
    isObj(token) &&
    token.type === "tag" && token.tagName === "table" && !knownCommentTokenPaths.some(function (oneOfKnownCommentPaths) {
      return innerObj.path.startsWith(oneOfKnownCommentPaths);
    }) &&
    !token.closing &&
    token.children.some(function (childNodeObj) {
      return ["text", "esp"].includes(childNodeObj.type);
    })) {
      var colspanVal = 1;
      var centered = false;
      var firstTrFound = {};
      if (
      token.children.some(function (childNodeObj) {
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
          } else if (obj.type !== "text" || obj.value.replace(htmlCommentRegex, "").trim()) {
            count = 0;
          }
        }
      }
      token.children
      .filter(function (childNodeObj) {
        return ["text", "esp"].includes(childNodeObj.type);
      })
      .forEach(function (obj) {
        if (obj.value.replace(htmlCommentRegex, "").trim()) {
          ranges.push(obj.start, obj.end, "\n<tr>\n  <td".concat(colspanVal > 1 ? " colspan=\"".concat(colspanVal, "\"") : "").concat(opts.alwaysCenter || centered ? " align=\"center\"" : "").concat(opts.cssStylesContent ? " style=\"".concat(opts.cssStylesContent, "\"") : "", ">\n    ").concat(obj.value.trim(), "\n  </td>\n</tr>\n"));
        }
      });
      token.children
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
    var result = rangesApply.rApply(str, ranges.current());
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
