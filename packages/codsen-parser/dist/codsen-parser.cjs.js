/**
 * codsen-parser
 * Parser aiming at broken code, especially HTML & CSS
 * Version: 0.4.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/codsen-parser
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var astMonkeyUtil = require('ast-monkey-util');
var strFindMalformed = _interopDefault(require('string-find-malformed'));
var stringLeftRight = require('string-left-right');
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
  console.log("013 layerPending() received: ");
  console.log("015 - 1.".concat("\x1B[".concat(33, "m", "layers", "\x1B[", 39, "m"), " = ", JSON.stringify(layers, null, 4)));
  console.log("022 - 2. ".concat("\x1B[".concat(33, "m", "tokenObj", "\x1B[", 39, "m"), " = ", JSON.stringify(tokenObj, null, 4)));
  console.log("029 >>>>>> ".concat("\x1B[".concat(33, "m", "layers[layers.length - 1].tagName", "\x1B[", 39, "m"), " = ", JSON.stringify(layers.length && isObj(layers[layers.length - 1]) && layers[layers.length - 1].tagName ? layers[layers.length - 1].tagName : null, null, 4)));
  console.log("040 >>>>>> ".concat("\x1B[".concat(33, "m", "tokenObj.tagName", "\x1B[", 39, "m"), " = ", JSON.stringify(tokenObj.tagName, null, 4)));
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
  var opts = Object.assign({}, defaults, originalOpts);
  var layers = [];
  var res = [];
  var path;
  var nestNext = false;
  var lastProcessedToken = {};
  var tokensWithChildren = ["tag", "comment"];
  var tagNamesThatDontHaveClosings = ["doctype"];
  tokenizer(str, {
    reportProgressFunc: opts.reportProgressFunc,
    reportProgressFuncFrom: opts.reportProgressFuncFrom,
    reportProgressFuncTo: opts.reportProgressFuncTo,
    tagCbLookahead: 2,
    tagCb: function tagCb(tokenObj, next) {
      console.log("-".repeat(80));
      console.log("247 \u2588\u2588 ".concat("\x1B[".concat(33, "m", "INCOMING TOKEN", "\x1B[", 39, "m"), ":\n", JSON.stringify({
        type: tokenObj.type,
        tagName: tokenObj.tagName,
        start: tokenObj.start,
        end: tokenObj.end,
        value: tokenObj.value,
        kind: tokenObj.kind,
        closing: tokenObj.closing
      }, null, 4)));
      console.log("262 FIY, ".concat("\x1B[".concat(33, "m", "NEXT", "\x1B[", 39, "m"), " = ", JSON.stringify(next, null, 4)));
      console.log("269 FIY, STARTING ".concat("\x1B[".concat(33, "m", "layers", "\x1B[", 39, "m"), " = ", JSON.stringify(layers, null, 4)));
      if (typeof opts.tagCb === "function") {
        opts.tagCb(tokenObj);
      }
      var prevToken = op.get(res, path);
      if (!isObj(prevToken)) {
        prevToken = null;
      }
      console.log("294 FIY, ".concat("\x1B[".concat(33, "m", "prevToken", "\x1B[", 39, "m"), " = ", JSON.stringify(prevToken, null, 4)));
      console.log("301 FIY, ".concat("\x1B[".concat(33, "m", "lastProcessedToken", "\x1B[", 39, "m"), " = ", JSON.stringify(lastProcessedToken, null, 4)));
      if (nestNext &&
      !tokenObj.closing && (!prevToken || !(prevToken.tagName === tokenObj.tagName && !prevToken.closing && tokenObj.closing)) && !layerPending(layers, tokenObj)) {
        nestNext = false;
        console.log("326 ".concat("\x1B[".concat(35, "m", "\u2588\u2588 NEST", "\x1B[", 39, "m")));
        path = "".concat(path, ".children.0");
      } else if (tokenObj.closing && typeof path === "string" && path.includes(".") && (
      !tokenObj.tagName || lastProcessedToken.tagName !== tokenObj.tagName || lastProcessedToken.closing)) {
        console.log("339 ".concat("\x1B[".concat(35, "m", "\u2588\u2588 UP", "\x1B[", 39, "m")));
        path = astMonkeyUtil.pathNext(astMonkeyUtil.pathUp(path));
        if (layerPending(layers, tokenObj)) {
          console.log("344 current token was pending, so we pop() it from layers");
          while (layers.length && layers[layers.length - 1].type !== tokenObj.type && layers[layers.length - 1].kind !== tokenObj.kind) {
            layers.pop();
          }
          layers.pop();
          console.log("362 POP layers, now equals to: ".concat(JSON.stringify(layers, null, 4)));
          nestNext = false;
          console.log("367 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "nestNext", "\x1B[", 39, "m"), ": ", nestNext));
        } else {
          console.log("371 ".concat("\x1B[".concat(31, "m", "layer for \"".concat(tokenObj.value, "\" was not pending!"), "\x1B[", 39, "m")));
          console.log("374 ".concat("\x1B[".concat(31, "m", "yet this was a closing token", "\x1B[", 39, "m")));
          if (layers.length > 1 && tokenObj.tagName && tokenObj.tagName === layers[layers.length - 2].tagName) {
            console.log("385 ".concat("\x1B[".concat(32, "m", "THIS WAS A GAP", "\x1B[", 39, "m")));
            path = astMonkeyUtil.pathNext(astMonkeyUtil.pathUp(path));
            console.log("390 ".concat("\x1B[".concat(35, "m", "\u2588\u2588 UP again", "\x1B[", 39, "m")));
            if (opts.errCb) {
              var lastLayersToken = layers[layers.length - 1];
              console.log("397 ".concat("\x1B[".concat(31, "m", "\u2588\u2588 RAISE ERROR", "\x1B[", 39, "m"), " ", lastLayersToken.type).concat(lastLayersToken.type === "comment" ? "-".concat(lastLayersToken.kind) : "", "-missing-closing"));
              opts.errCb({
                ruleId: "".concat(lastLayersToken.type).concat(lastLayersToken.type === "comment" ? "-".concat(lastLayersToken.kind) : "", "-missing-closing"),
                idxFrom: lastLayersToken.start,
                idxTo: lastLayersToken.end,
                tokenObj: lastLayersToken
              });
            }
            layers.pop();
            layers.pop();
            console.log("422 POP layers twice, now equals to: ".concat(JSON.stringify(layers, null, 4)));
          } else if (
          layers.length > 2 && layers[layers.length - 3].type === tokenObj.type && layers[layers.length - 3].type === tokenObj.type && layers[layers.length - 3].tagName === tokenObj.tagName) {
            console.log("443 ".concat("\x1B[".concat(32, "m", "PREVIOUS TAG WAS ROGUE OPENING", "\x1B[", 39, "m")));
            path = astMonkeyUtil.pathNext(astMonkeyUtil.pathUp(path));
            console.log("448 ".concat("\x1B[".concat(35, "m", "\u2588\u2588 UP again", "\x1B[", 39, "m")));
            if (opts.errCb) {
              var _lastLayersToken = layers[layers.length - 1];
              console.log("455 ".concat("\x1B[".concat(31, "m", "\u2588\u2588 RAISE ERROR", "\x1B[", 39, "m"), " tag-rogue [", _lastLayersToken.start, ", ").concat(_lastLayersToken.end, "]"));
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
            console.log("488 ".concat("\x1B[".concat(32, "m", "PREVIOUS TAG WAS ROGUE CLOSING", "\x1B[", 39, "m")));
            if (opts.errCb) {
              var _lastLayersToken2 = layers[layers.length - 1];
              console.log("499 ".concat("\x1B[".concat(31, "m", "\u2588\u2588 RAISE ERROR", "\x1B[", 39, "m"), " tag-rogue [", _lastLayersToken2.start, ", ").concat(_lastLayersToken2.end, "]"));
              opts.errCb({
                ruleId: "tag-rogue",
                idxFrom: _lastLayersToken2.start,
                idxTo: _lastLayersToken2.end,
                tokenObj: _lastLayersToken2
              });
            }
            layers.pop();
            layers.pop();
          } else {
            console.log("515 ELSE clauses - TODO");
          }
        }
      } else if (!path) {
        console.log("526 ".concat("\x1B[".concat(35, "m", "\u2588\u2588 FIRST", "\x1B[", 39, "m")));
        path = "0";
      } else {
        console.log("531 ".concat("\x1B[".concat(35, "m", "\u2588\u2588 BUMP", "\x1B[", 39, "m")));
        path = astMonkeyUtil.pathNext(path);
        if (layerPending(layers, tokenObj)) {
          layers.pop();
          console.log("537 POP layers, now equals to: ".concat(JSON.stringify(layers, null, 4)));
        }
      }
      console.log("".concat("\x1B[".concat(90, "m", "----------------- path calculations done -----------------", "\x1B[", 39, "m")));
      if (tokensWithChildren.includes(tokenObj.type) && !tokenObj["void"] && Object.prototype.hasOwnProperty.call(tokenObj, "closing") && !tokenObj.closing) {
        nestNext = true;
        console.log("555 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "nestNext", "\x1B[", 39, "m"), " = true"));
        if (!tagNamesThatDontHaveClosings.includes(tokenObj.kind)) {
          layers.push(Object.assign({}, tokenObj));
          console.log("561 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " to layers, which is now: ", JSON.stringify(layers, null, 4)));
        }
      }
      console.log("571 FIY, ".concat("\x1B[".concat(33, "m", "path", "\x1B[", 39, "m"), " = ", path));
      var previousPath = astMonkeyUtil.pathPrev(path);
      var parentPath = astMonkeyUtil.pathUp(path);
      console.log("586 ".concat("\x1B[".concat(33, "m", "parentPath", "\x1B[", 39, "m"), " = ", JSON.stringify(parentPath, null, 4)));
      var parentTagsToken;
      if (parentPath && path.includes(".")) {
        parentTagsToken = op.get(res, parentPath);
      }
      console.log("598 ".concat("\x1B[".concat(33, "m", "parentTagsToken", "\x1B[", 39, "m"), " at path \"", "\x1B[".concat(33, "m", parentPath, "\x1B[", 39, "m"), "\" - ", JSON.stringify(parentTagsToken ? Object.assign({}, parentTagsToken, {
        children: "..."
      }) : parentTagsToken, null, 4)));
      var previousTagsToken;
      if (previousPath) {
        previousTagsToken = op.get(res, previousPath);
      }
      console.log("614 NOW ".concat("\x1B[".concat(33, "m", "previousTagsToken", "\x1B[", 39, "m"), " at path \"", "\x1B[".concat(33, "m", previousPath, "\x1B[", 39, "m"), "\" - ", JSON.stringify(previousTagsToken, null, 4)));
      console.log("621 FIY, ".concat("\x1B[".concat(33, "m", "tokenObj.closing", "\x1B[", 39, "m"), " = ", JSON.stringify(tokenObj.closing, null, 4)));
      console.log("635 ".concat("\x1B[".concat(33, "m", "res", "\x1B[", 39, "m"), " BEFORE: ", JSON.stringify(res, null, 4)));
      var suspiciousCommentTagEndingRegExp = /(-+|-+[^>])>/;
      var parentsLastChildTokenValue;
      var parentsLastChildTokenPath;
      if (isObj(previousTagsToken) && Array.isArray(previousTagsToken.children) && previousTagsToken.children.length && previousTagsToken.children[previousTagsToken.children.length - 1]) {
        parentsLastChildTokenValue = previousTagsToken.children[previousTagsToken.children.length - 1];
        parentsLastChildTokenPath = "".concat(previousPath, ".children.").concat(op.get(res, previousPath).children.length - 1);
      }
      var tokenTakenCareOf = false;
      console.log("663 FIY, ".concat("\x1B[".concat(33, "m", "layers", "\x1B[", 39, "m"), " = ", JSON.stringify(layers, null, 4)));
      if (tokenObj.type === "text" && isObj(parentTagsToken) && parentTagsToken.type === "comment" && parentTagsToken.kind === "simple" && !parentTagsToken.closing && suspiciousCommentTagEndingRegExp.test(tokenObj.value)) {
        console.log("678 ".concat("\x1B[".concat(31, "m", "\u2588\u2588 intervention needed", "\x1B[", 39, "m")));
        var suspiciousEndingStartsAt = suspiciousCommentTagEndingRegExp.exec(tokenObj.value).index;
        var suspiciousEndingEndsAt = suspiciousEndingStartsAt + tokenObj.value.slice(suspiciousEndingStartsAt).indexOf(">") + 1;
        console.log("688 SUSPICIOUS ENDING: [".concat("\x1B[".concat(33, "m", "suspiciousEndingStartsAt", "\x1B[", 39, "m"), " = ", JSON.stringify(suspiciousEndingStartsAt, null, 4), ", ", "\x1B[".concat(33, "m", "suspiciousEndingEndsAt", "\x1B[", 39, "m"), " = ").concat(JSON.stringify(suspiciousEndingEndsAt, null, 4), "] - value: \"").concat(tokenObj.value.slice(suspiciousEndingStartsAt, suspiciousEndingEndsAt), "\""));
        if (suspiciousEndingStartsAt > 0) {
          console.log("707 ".concat("\x1B[".concat(32, "m", "ADD", "\x1B[", 39, "m"), " text leading up to \"->\""));
          console.log("710 ".concat("\x1B[".concat(33, "m", "res", "\x1B[", 39, "m"), " BEFORE: ", JSON.stringify(res, null, 4)));
          op.set(res, path, Object.assign({}, tokenObj, {
            end: tokenObj.start + suspiciousEndingStartsAt,
            value: tokenObj.value.slice(0, suspiciousEndingStartsAt)
          }));
          if (tokensWithChildren.includes(tokenObj.type)) {
            tokenObj.children = [];
          }
          console.log("728 ".concat("\x1B[".concat(33, "m", "res", "\x1B[", 39, "m"), " AFTER: ", JSON.stringify(res, null, 4)));
        }
        console.log("739 OLD ".concat("\x1B[".concat(33, "m", "path", "\x1B[", 39, "m"), " = ", path));
        path = astMonkeyUtil.pathNext(astMonkeyUtil.pathUp(path));
        console.log("743 NEW ".concat("\x1B[".concat(33, "m", "path", "\x1B[", 39, "m"), " = ", path));
        op.set(res, path, {
          type: "comment",
          kind: "simple",
          closing: true,
          start: tokenObj.start + suspiciousEndingStartsAt,
          end: tokenObj.start + suspiciousEndingEndsAt,
          value: tokenObj.value.slice(suspiciousEndingStartsAt, suspiciousEndingEndsAt),
          children: []
        });
        console.log("758 ".concat("\x1B[".concat(33, "m", "res", "\x1B[", 39, "m"), " AFTER: ", JSON.stringify(res, null, 4)));
        if (suspiciousEndingEndsAt < tokenObj.value.length) {
          console.log("769 OLD ".concat("\x1B[".concat(33, "m", "path", "\x1B[", 39, "m"), " = ", path));
          path = astMonkeyUtil.pathNext(path);
          console.log("773 NEW ".concat("\x1B[".concat(33, "m", "path", "\x1B[", 39, "m"), " = ", path));
          op.set(res, path, {
            type: "text",
            start: tokenObj.start + suspiciousEndingEndsAt,
            end: tokenObj.end,
            value: tokenObj.value.slice(suspiciousEndingEndsAt)
          });
          console.log("782 ".concat("\x1B[".concat(33, "m", "res", "\x1B[", 39, "m"), " AFTER: ", JSON.stringify(res, null, 4)));
        }
        tokenTakenCareOf = true;
      } else if (tokenObj.type === "comment" && tokenObj.kind === "only" && isObj(previousTagsToken)) {
        console.log("800 ".concat("\x1B[".concat(31, "m", "\u2588\u2588 intervention needed", "\x1B[", 39, "m")));
        if (previousTagsToken.type === "text" && previousTagsToken.value.trim().length && "<!-".includes(previousTagsToken.value[stringLeftRight.left(previousTagsToken.value, previousTagsToken.value.length)])) {
          console.log("821 ".concat("\x1B[".concat(31, "m", "MALFORMED \"NOT\" COMMENT", "\x1B[", 39, "m")));
          var capturedMalformedTagRanges = [];
          strFindMalformed(previousTagsToken.value, "<!--", function (obj) {
            capturedMalformedTagRanges.push(obj);
          }, {
            maxDistance: 2
          });
          console.log("841 ".concat("\x1B[".concat(33, "m", "capturedMalformedTagRanges", "\x1B[", 39, "m"), " = ", JSON.stringify(capturedMalformedTagRanges, null, 4)));
          if (capturedMalformedTagRanges.length && !stringLeftRight.right(previousTagsToken.value, capturedMalformedTagRanges[capturedMalformedTagRanges.length - 1].idxTo - 1)) {
            console.log("855 picking the last malformed range");
            var malformedRange = capturedMalformedTagRanges.pop();
            console.log("861 ".concat("\x1B[".concat(33, "m", "malformedRange", "\x1B[", 39, "m"), " = ", JSON.stringify(malformedRange, null, 4)));
            if (!stringLeftRight.left(previousTagsToken.value, malformedRange.idxFrom) && previousPath && isObj(previousTagsToken)) {
              console.log("877 whole token is malformed <!--");
              if (tokensWithChildren.includes(tokenObj.type)) {
                tokenObj.children = [];
              }
              path = previousPath;
              op.set(res, path, Object.assign({}, tokenObj, {
                start: malformedRange.idxFrom + previousTagsToken.start,
                kind: "not",
                value: "".concat(previousTagsToken.value).concat(tokenObj.value)
              }));
              tokenTakenCareOf = true;
            } else if (previousPath && isObj(previousTagsToken)) {
              console.log("900 there are characters in front of <!--");
              op.set(res, previousPath, Object.assign({}, previousTagsToken, {
                end: malformedRange.idxFrom + previousTagsToken.start,
                value: previousTagsToken.value.slice(0, malformedRange.idxFrom)
              }));
              if (tokensWithChildren.includes(tokenObj.type)) {
                tokenObj.children = [];
              }
              op.set(res, path, Object.assign({}, tokenObj, {
                start: malformedRange.idxFrom + previousTagsToken.start,
                kind: "not",
                value: "".concat(previousTagsToken.value.slice(malformedRange.idxFrom)).concat(tokenObj.value)
              }));
              tokenTakenCareOf = true;
            }
          }
        } else if (isObj(parentsLastChildTokenValue) && parentsLastChildTokenValue.type === "text" && parentsLastChildTokenValue.value.trim().length && "<!-".includes(parentsLastChildTokenValue.value[stringLeftRight.left(parentsLastChildTokenValue.value, parentsLastChildTokenValue.value.length)])) {
          console.log("955 ".concat("\x1B[".concat(31, "m", "MALFORMED \"NOT\" COMMENT", "\x1B[", 39, "m")));
          var _capturedMalformedTagRanges = [];
          strFindMalformed(parentsLastChildTokenValue.value, "<!--", function (obj) {
            _capturedMalformedTagRanges.push(obj);
          }, {
            maxDistance: 2
          });
          console.log("975 ".concat("\x1B[".concat(33, "m", "capturedMalformedTagRanges", "\x1B[", 39, "m"), " = ", JSON.stringify(_capturedMalformedTagRanges, null, 4)));
          if (_capturedMalformedTagRanges.length && !stringLeftRight.right(parentsLastChildTokenValue.value, _capturedMalformedTagRanges[_capturedMalformedTagRanges.length - 1].idxTo - 1)) {
            console.log("989 picking the last malformed range");
            var _malformedRange = _capturedMalformedTagRanges.pop();
            console.log("995 ".concat("\x1B[".concat(33, "m", "malformedRange", "\x1B[", 39, "m"), " = ", JSON.stringify(_malformedRange, null, 4)));
            if (!stringLeftRight.left(parentsLastChildTokenValue.value, _malformedRange.idxFrom) && previousPath && isObj(parentsLastChildTokenValue)) {
              console.log("1011 whole token is malformed <!--");
              if (tokensWithChildren.includes(tokenObj.type)) {
                tokenObj.children = [];
              }
              op.set(res, path, Object.assign({}, tokenObj, {
                start: _malformedRange.idxFrom + parentsLastChildTokenValue.start,
                kind: "not",
                value: "".concat(parentsLastChildTokenValue.value).concat(tokenObj.value)
              }));
              console.log("1035 \u2588\u2588 ".concat("\x1B[".concat(33, "m", "previousPath", "\x1B[", 39, "m"), " = ", JSON.stringify(previousPath, null, 4)));
              console.log("1042 DELETING TEXT NODE - RES BEFORE: ".concat(JSON.stringify(res, null, 4)));
              op.del(res, "".concat(previousPath, ".children.").concat(op.get(res, previousPath).children.length - 1));
              console.log("1055 DELETING TEXT NODE - RES AFTER: ".concat(JSON.stringify(res, null, 4)));
              tokenTakenCareOf = true;
            } else if (previousPath && isObj(parentsLastChildTokenValue) && parentsLastChildTokenPath) {
              console.log("1069 there are characters preceding <!--");
              console.log("1074 FIY, ".concat("\x1B[".concat(33, "m", "parentsLastChildTokenPath", "\x1B[", 39, "m"), " = ", JSON.stringify(parentsLastChildTokenPath, null, 4)));
              op.set(res, parentsLastChildTokenPath, Object.assign({}, parentsLastChildTokenValue, {
                end: _malformedRange.idxFrom + parentsLastChildTokenValue.start,
                value: parentsLastChildTokenValue.value.slice(0, _malformedRange.idxFrom)
              }));
              if (tokensWithChildren.includes(tokenObj.type)) {
                tokenObj.children = [];
              }
              op.set(res, path, Object.assign({}, tokenObj, {
                start: _malformedRange.idxFrom + parentsLastChildTokenValue.start,
                kind: "not",
                value: "".concat(parentsLastChildTokenValue.value.slice(_malformedRange.idxFrom)).concat(tokenObj.value)
              }));
              tokenTakenCareOf = true;
            }
          }
        }
      }
      console.log("1119 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588");
      console.log("1121 FIY, ".concat("\x1B[".concat(33, "m", "next", "\x1B[", 39, "m"), " = ", JSON.stringify(next, null, 4)));
      console.log("1128 FIY, ".concat("\x1B[".concat(33, "m", "layers", "\x1B[", 39, "m"), " = ", JSON.stringify(layers, null, 4)));
      if (!tokenTakenCareOf) {
        console.log("1137 setting as usual");
        if (tokensWithChildren.includes(tokenObj.type)) {
          tokenObj.children = [];
        }
        op.set(res, path, tokenObj);
      }
      console.log("1145 ".concat("\x1B[".concat(33, "m", "res", "\x1B[", 39, "m"), " AFTER: ", JSON.stringify(res, null, 4)));
      console.log("1153 ENDING ".concat("\x1B[".concat(33, "m", "path", "\x1B[", 39, "m"), " = ", JSON.stringify(path, null, 4)));
      if (tokensWithChildren.includes(tokenObj.type) && tokenObj.closing && (!previousPath || !isObj(previousTagsToken) || previousTagsToken.closing || previousTagsToken.type !== tokenObj.type || previousTagsToken.tagName !== tokenObj.tagName)) {
        if (tokenObj["void"]) {
          console.log("1175 frontal slash must be removed because it's a void tag");
          if (opts.errCb) {
            console.log("1179 ".concat("\x1B[".concat(31, "m", "\u2588\u2588 RAISE ERROR tag-void-frontal-slash", "\x1B[", 39, "m")));
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
          console.log("1190 it's an unpaired tag");
          if (opts.errCb) {
            console.log("1193 ".concat("\x1B[".concat(31, "m", "\u2588\u2588 RAISE ERROR", "\x1B[", 39, "m"), " ", tokenObj.type).concat(tokenObj.type === "comment" ? "-".concat(tokenObj.kind) : "", "-missing-opening"));
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
      console.log("".concat("\x1B[".concat(90, "m", "---", "\x1B[", 39, "m")));
      console.log("".concat("\x1B[".concat(90, "m", "\u2588\u2588 nestNext = ".concat("\x1B[".concat(nestNext ? 32 : 31, "m").concat(nestNext, "\x1B[", 39, "m")), "\x1B[", 39, "m")));
      console.log("".concat("\x1B[".concat(90, "m", "\u2588\u2588 layers = ".concat(JSON.stringify(layers, null, 4)), "\x1B[", 39, "m")));
    },
    charCb: opts.charCb
  });
  console.log("-".repeat(80));
  console.log("1254 FIY, ENDING ".concat("\x1B[".concat(33, "m", "layers", "\x1B[", 39, "m"), " = ", JSON.stringify(layers, null, 4)));
  if (layers.length) {
    layers.forEach(function (tokenObj) {
      if (opts.errCb) {
        console.log("1265 ".concat("\x1B[".concat(31, "m", "\u2588\u2588 RAISE ERROR", "\x1B[", 39, "m"), " ", tokenObj.type).concat(tokenObj.type === "comment" ? "-".concat(tokenObj.kind) : "", "-missing-closing"));
        opts.errCb({
          ruleId: "".concat(tokenObj.type).concat(tokenObj.type === "comment" ? "-".concat(tokenObj.kind) : "", "-missing-closing"),
          idxFrom: tokenObj.start,
          idxTo: tokenObj.end,
          tokenObj: tokenObj
        });
      }
    });
  }
  console.log("1284 ".concat("\x1B[".concat(32, "m", "FINAL RETURN", "\x1B[", 39, "m"), " ", JSON.stringify(res, null, 4)));
  return res;
}

module.exports = cparser;
