/**
 * codsen-parser
 * Parser aiming at broken or mixed code, especially HTML & CSS
 * Version: 0.7.9
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/codsen-parser/
 */

'use strict';

var astMonkeyUtil = require('ast-monkey-util');
var strFindMalformed = require('string-find-malformed');
var stringLeftRight = require('string-left-right');
var tokenizer = require('codsen-tokenizer');
var op = require('object-path');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var strFindMalformed__default = /*#__PURE__*/_interopDefaultLegacy(strFindMalformed);
var tokenizer__default = /*#__PURE__*/_interopDefaultLegacy(tokenizer);
var op__default = /*#__PURE__*/_interopDefaultLegacy(op);

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

function isObj(something) {
  return something && _typeof(something) === "object" && !Array.isArray(something);
}
function layerPending(layers, tokenObj) {
  return (
    tokenObj.closing && layers.length && (layers[layers.length - 1].type === tokenObj.type && Object.prototype.hasOwnProperty.call(layers[layers.length - 1], "tagName") && Object.prototype.hasOwnProperty.call(tokenObj, "tagName") && layers[layers.length - 1].tagName === tokenObj.tagName && layers[layers.length - 1].closing === false ||
    tokenObj.type === "comment" && layers.some(function (layerObjToken) {
      return Object.prototype.hasOwnProperty.call(layerObjToken, "closing") && !layerObjToken.closing;
    }))
  );
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
  var opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts);
  var layers = [];
  var res = [];
  var path;
  var nestNext = false;
  var lastProcessedToken = {};
  var tokensWithChildren = ["tag", "comment"];
  var tagNamesThatDontHaveClosings = ["doctype"];
  tokenizer__default['default'](str, {
    reportProgressFunc: opts.reportProgressFunc,
    reportProgressFuncFrom: opts.reportProgressFuncFrom,
    reportProgressFuncTo: opts.reportProgressFuncTo,
    tagCbLookahead: 2,
    tagCb: function tagCb(tokenObj, next) {
      if (typeof opts.tagCb === "function") {
        opts.tagCb(tokenObj);
      }
      if (!tokenObj.nested) {
        var prevToken = op__default['default'].get(res, path);
        if (!isObj(prevToken)) {
          prevToken = null;
        }
        if (nestNext &&
        !tokenObj.closing && (!prevToken || !(prevToken.tagName === tokenObj.tagName && !prevToken.closing && tokenObj.closing)) && !layerPending(layers, tokenObj) && (
        !next.length || !(tokenObj.type === "text" && next[0].type === "tag" && (next[0].closing && lastProcessedToken.closing ||
        layers[layers.length - 3] && next[0].tagName !== layers[layers.length - 1].tagName && layers[layers.length - 3].type === "tag" && !layers[layers.length - 3].closing && next[0].tagName === layers[layers.length - 3].tagName)))) {
          nestNext = false;
          path = "".concat(path, ".children.0");
        } else if (tokenObj.closing && typeof path === "string" && path.includes(".") && (
        !tokenObj.tagName || lastProcessedToken.tagName !== tokenObj.tagName || lastProcessedToken.closing)) {
          path = astMonkeyUtil.pathNext(astMonkeyUtil.pathUp(path));
          if (layerPending(layers, tokenObj)) {
            while (layers.length && layers[layers.length - 1].type !== tokenObj.type && layers[layers.length - 1].kind !== tokenObj.kind) {
              layers.pop();
            }
            layers.pop();
            nestNext = false;
          } else {
            if (layers.length > 1 && tokenObj.tagName && tokenObj.tagName === layers[layers.length - 2].tagName) {
              path = astMonkeyUtil.pathNext(astMonkeyUtil.pathUp(path));
              if (opts.errCb) {
                var lastLayersToken = layers[layers.length - 1];
                opts.errCb({
                  ruleId: "".concat(lastLayersToken.type).concat(lastLayersToken.type === "comment" ? "-".concat(lastLayersToken.kind) : "", "-missing-closing"),
                  idxFrom: lastLayersToken.start,
                  idxTo: lastLayersToken.end,
                  tokenObj: lastLayersToken
                });
              }
              layers.pop();
              layers.pop();
            } else if (
            layers.length > 2 && layers[layers.length - 3].type === tokenObj.type && layers[layers.length - 3].type === tokenObj.type && layers[layers.length - 3].tagName === tokenObj.tagName) {
              path = astMonkeyUtil.pathNext(astMonkeyUtil.pathUp(path));
              if (opts.errCb) {
                var _lastLayersToken = layers[layers.length - 1];
                opts.errCb({
                  ruleId: "tag-rogue",
                  idxFrom: _lastLayersToken.start,
                  idxTo: _lastLayersToken.end,
                  tokenObj: _lastLayersToken
                });
              }
              layers.pop();
              layers.pop();
              layers.pop();
            } else if (
            layers.length > 1 && layers[layers.length - 2].type === tokenObj.type && layers[layers.length - 2].type === tokenObj.type && layers[layers.length - 2].tagName === tokenObj.tagName) {
              if (opts.errCb) {
                var _lastLayersToken2 = layers[layers.length - 1];
                opts.errCb({
                  ruleId: "tag-rogue",
                  idxFrom: _lastLayersToken2.start,
                  idxTo: _lastLayersToken2.end,
                  tokenObj: _lastLayersToken2
                });
              }
              layers.pop();
              layers.pop();
            } else ;
          }
        } else if (!path) {
          path = "0";
        } else {
          path = astMonkeyUtil.pathNext(path);
          if (layerPending(layers, tokenObj)) {
            layers.pop();
          }
        }
        if (tokensWithChildren.includes(tokenObj.type) && !tokenObj.void && Object.prototype.hasOwnProperty.call(tokenObj, "closing") && !tokenObj.closing) {
          nestNext = true;
          if (!tagNamesThatDontHaveClosings.includes(tokenObj.kind)) {
            layers.push(_objectSpread2({}, tokenObj));
          }
        }
        var previousPath = astMonkeyUtil.pathPrev(path);
        var parentPath = astMonkeyUtil.pathUp(path);
        var parentTagsToken;
        if (parentPath && path.includes(".")) {
          parentTagsToken = op__default['default'].get(res, parentPath);
        }
        var previousTagsToken;
        if (previousPath) {
          previousTagsToken = op__default['default'].get(res, previousPath);
        }
        var suspiciousCommentTagEndingRegExp = /(-+|-+[^>])>/;
        var parentsLastChildTokenValue;
        var parentsLastChildTokenPath;
        if (isObj(previousTagsToken) && Array.isArray(previousTagsToken.children) && previousTagsToken.children.length && previousTagsToken.children[previousTagsToken.children.length - 1]) {
          parentsLastChildTokenValue = previousTagsToken.children[previousTagsToken.children.length - 1];
          parentsLastChildTokenPath = "".concat(previousPath, ".children.").concat(op__default['default'].get(res, previousPath).children.length - 1);
        }
        var tokenTakenCareOf = false;
        if (tokenObj.type === "text" && isObj(parentTagsToken) && parentTagsToken.type === "comment" && parentTagsToken.kind === "simple" && !parentTagsToken.closing && suspiciousCommentTagEndingRegExp.test(tokenObj.value)) {
          var suspiciousEndingStartsAt = suspiciousCommentTagEndingRegExp.exec(tokenObj.value).index;
          var suspiciousEndingEndsAt = suspiciousEndingStartsAt + tokenObj.value.slice(suspiciousEndingStartsAt).indexOf(">") + 1;
          if (suspiciousEndingStartsAt > 0) {
            op__default['default'].set(res, path, _objectSpread2(_objectSpread2({}, tokenObj), {}, {
              end: tokenObj.start + suspiciousEndingStartsAt,
              value: tokenObj.value.slice(0, suspiciousEndingStartsAt)
            }));
            if (tokensWithChildren.includes(tokenObj.type)) {
              tokenObj.children = [];
            }
          }
          path = astMonkeyUtil.pathNext(astMonkeyUtil.pathUp(path));
          op__default['default'].set(res, path, {
            type: "comment",
            kind: "simple",
            closing: true,
            start: tokenObj.start + suspiciousEndingStartsAt,
            end: tokenObj.start + suspiciousEndingEndsAt,
            value: tokenObj.value.slice(suspiciousEndingStartsAt, suspiciousEndingEndsAt),
            children: []
          });
          if (suspiciousEndingEndsAt < tokenObj.value.length) {
            path = astMonkeyUtil.pathNext(path);
            op__default['default'].set(res, path, {
              type: "text",
              start: tokenObj.start + suspiciousEndingEndsAt,
              end: tokenObj.end,
              value: tokenObj.value.slice(suspiciousEndingEndsAt)
            });
          }
          tokenTakenCareOf = true;
        } else if (tokenObj.type === "comment" && tokenObj.kind === "only" && isObj(previousTagsToken)) {
          if (previousTagsToken.type === "text" && previousTagsToken.value.trim() && "<!-".includes(previousTagsToken.value[stringLeftRight.left(previousTagsToken.value, previousTagsToken.value.length)])) {
            var capturedMalformedTagRanges = [];
            strFindMalformed__default['default'](previousTagsToken.value, "<!--", function (obj) {
              capturedMalformedTagRanges.push(obj);
            }, {
              maxDistance: 2
            });
            if (capturedMalformedTagRanges.length && !stringLeftRight.right(previousTagsToken.value, capturedMalformedTagRanges[capturedMalformedTagRanges.length - 1].idxTo - 1)) {
              var malformedRange = capturedMalformedTagRanges.pop();
              if (!stringLeftRight.left(previousTagsToken.value, malformedRange.idxFrom) && previousPath && isObj(previousTagsToken)) {
                if (tokensWithChildren.includes(tokenObj.type)) {
                  tokenObj.children = [];
                }
                path = previousPath;
                op__default['default'].set(res, path, _objectSpread2(_objectSpread2({}, tokenObj), {}, {
                  start: malformedRange.idxFrom + previousTagsToken.start,
                  kind: "not",
                  value: "".concat(previousTagsToken.value).concat(tokenObj.value)
                }));
                tokenTakenCareOf = true;
              } else if (previousPath && isObj(previousTagsToken)) {
                op__default['default'].set(res, previousPath, _objectSpread2(_objectSpread2({}, previousTagsToken), {}, {
                  end: malformedRange.idxFrom + previousTagsToken.start,
                  value: previousTagsToken.value.slice(0, malformedRange.idxFrom)
                }));
                if (tokensWithChildren.includes(tokenObj.type)) {
                  tokenObj.children = [];
                }
                op__default['default'].set(res, path, _objectSpread2(_objectSpread2({}, tokenObj), {}, {
                  start: malformedRange.idxFrom + previousTagsToken.start,
                  kind: "not",
                  value: "".concat(previousTagsToken.value.slice(malformedRange.idxFrom)).concat(tokenObj.value)
                }));
                tokenTakenCareOf = true;
              }
            }
          } else if (isObj(parentsLastChildTokenValue) && parentsLastChildTokenValue.type === "text" && parentsLastChildTokenValue.value.trim() && "<!-".includes(parentsLastChildTokenValue.value[stringLeftRight.left(parentsLastChildTokenValue.value, parentsLastChildTokenValue.value.length)])) {
            var _capturedMalformedTagRanges = [];
            strFindMalformed__default['default'](parentsLastChildTokenValue.value, "<!--", function (obj) {
              _capturedMalformedTagRanges.push(obj);
            }, {
              maxDistance: 2
            });
            if (_capturedMalformedTagRanges.length && !stringLeftRight.right(parentsLastChildTokenValue.value, _capturedMalformedTagRanges[_capturedMalformedTagRanges.length - 1].idxTo - 1)) {
              var _malformedRange = _capturedMalformedTagRanges.pop();
              if (!stringLeftRight.left(parentsLastChildTokenValue.value, _malformedRange.idxFrom) && previousPath && isObj(parentsLastChildTokenValue)) {
                if (tokensWithChildren.includes(tokenObj.type)) {
                  tokenObj.children = [];
                }
                op__default['default'].set(res, path, _objectSpread2(_objectSpread2({}, tokenObj), {}, {
                  start: _malformedRange.idxFrom + parentsLastChildTokenValue.start,
                  kind: "not",
                  value: "".concat(parentsLastChildTokenValue.value).concat(tokenObj.value)
                }));
                op__default['default'].del(res, "".concat(previousPath, ".children.").concat(op__default['default'].get(res, previousPath).children.length - 1));
                tokenTakenCareOf = true;
              } else if (previousPath && isObj(parentsLastChildTokenValue) && parentsLastChildTokenPath) {
                op__default['default'].set(res, parentsLastChildTokenPath, _objectSpread2(_objectSpread2({}, parentsLastChildTokenValue), {}, {
                  end: _malformedRange.idxFrom + parentsLastChildTokenValue.start,
                  value: parentsLastChildTokenValue.value.slice(0, _malformedRange.idxFrom)
                }));
                if (tokensWithChildren.includes(tokenObj.type)) {
                  tokenObj.children = [];
                }
                op__default['default'].set(res, path, _objectSpread2(_objectSpread2({}, tokenObj), {}, {
                  start: _malformedRange.idxFrom + parentsLastChildTokenValue.start,
                  kind: "not",
                  value: "".concat(parentsLastChildTokenValue.value.slice(_malformedRange.idxFrom)).concat(tokenObj.value)
                }));
                tokenTakenCareOf = true;
              }
            }
          }
        }
        if (!tokenTakenCareOf) {
          if (tokensWithChildren.includes(tokenObj.type)) {
            tokenObj.children = [];
          }
          op__default['default'].set(res, path, tokenObj);
        }
        if (tokensWithChildren.includes(tokenObj.type) && tokenObj.closing && (!previousPath || !isObj(previousTagsToken) || previousTagsToken.closing || previousTagsToken.type !== tokenObj.type || previousTagsToken.tagName !== tokenObj.tagName)) {
          if (tokenObj.void) {
            if (opts.errCb) {
              opts.errCb({
                ruleId: "tag-void-frontal-slash",
                idxFrom: tokenObj.start,
                idxTo: tokenObj.end,
                fix: {
                  ranges: [[tokenObj.start + 1, tokenObj.tagNameStartsAt]]
                },
                tokenObj: tokenObj
              });
            }
          } else {
            if (opts.errCb) {
              opts.errCb({
                ruleId: "".concat(tokenObj.type).concat(tokenObj.type === "comment" ? "-".concat(tokenObj.kind) : "", "-missing-opening"),
                idxFrom: tokenObj.start,
                idxTo: tokenObj.end,
                tokenObj: tokenObj
              });
            }
          }
        }
        lastProcessedToken = _objectSpread2({}, tokenObj);
      }
    },
    charCb: opts.charCb
  });
  if (layers.length) {
    layers.forEach(function (tokenObj) {
      if (opts.errCb) {
        opts.errCb({
          ruleId: "".concat(tokenObj.type).concat(tokenObj.type === "comment" ? "-".concat(tokenObj.kind) : "", "-missing-closing"),
          idxFrom: tokenObj.start,
          idxTo: tokenObj.end,
          tokenObj: tokenObj
        });
      }
    });
  }
  return res;
}

module.exports = cparser;
