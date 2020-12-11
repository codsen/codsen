/**
 * email-comb
 * Remove unused CSS from email templates
 * Version: 4.1.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/email-comb/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var stringMatchLeftRight = require('string-match-left-right');
var emptyCondCommentRegex = require('regex-empty-conditional-comments');
var pullAllWithGlob = require('array-pull-all-with-glob');
var extract = require('string-extract-class-names');
var intersection = require('lodash.intersection');
var expander = require('string-range-expander');
var stringLeftRight = require('string-left-right');
var stringUglify = require('string-uglify');
var applyRanges = require('ranges-apply');
var pullAll = require('lodash.pullall');
var htmlCrush = require('html-crush');
var isEmpty = require('ast-is-empty');
var Ranges = require('ranges-push');
var uniq = require('lodash.uniq');
var matcher = require('matcher');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var emptyCondCommentRegex__default = /*#__PURE__*/_interopDefaultLegacy(emptyCondCommentRegex);
var pullAllWithGlob__default = /*#__PURE__*/_interopDefaultLegacy(pullAllWithGlob);
var extract__default = /*#__PURE__*/_interopDefaultLegacy(extract);
var intersection__default = /*#__PURE__*/_interopDefaultLegacy(intersection);
var expander__default = /*#__PURE__*/_interopDefaultLegacy(expander);
var applyRanges__default = /*#__PURE__*/_interopDefaultLegacy(applyRanges);
var pullAll__default = /*#__PURE__*/_interopDefaultLegacy(pullAll);
var isEmpty__default = /*#__PURE__*/_interopDefaultLegacy(isEmpty);
var Ranges__default = /*#__PURE__*/_interopDefaultLegacy(Ranges);
var uniq__default = /*#__PURE__*/_interopDefaultLegacy(uniq);
var matcher__default = /*#__PURE__*/_interopDefaultLegacy(matcher);

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

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var version = "4.1.0";

var regexEmptyStyleTag = /[\n]?\s*<style[^>]*>\s*<\/style\s*>/g;
var regexEmptyMediaQuery = /[\n]?\s*@(media|supports|document)[^{]*{\s*}/g;
var regexEmptyUnclosedMediaQuery = /@media[^{@}]+{(?=\s*<\/style>)/g;
var defaults = {
  whitelist: [],
  backend: [],
  uglify: false,
  removeHTMLComments: true,
  removeCSSComments: true,
  doNotRemoveHTMLCommentsWhoseOpeningTagContains: ["[if", "[endif"],
  reportProgressFunc: null,
  reportProgressFuncFrom: 0,
  reportProgressFuncTo: 100
};
function isObj(something) {
  return something && _typeof(something) === "object" && !Array.isArray(something);
}
function hasOwnProp(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
function isLatinLetter(char) {
  return typeof char === "string" && char.length === 1 && (char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91 || char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123);
}

function comb(str, opts) {
  var start = Date.now();
  var finalIndexesToDelete = new Ranges__default['default']({
    limitToBeAddedWhitespace: true
  });
  var currentChunksMinifiedSelectors = new Ranges__default['default']();
  var lineBreaksToDelete = new Ranges__default['default']();
  function characterSuitableForNames(char) {
    return /[-_A-Za-z0-9]/.test(char);
  }
  function isStr(something) {
    return typeof something === "string";
  }
  function resetBodyClassOrId() {
    var initObj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return _objectSpread2({
      valuesStart: null,
      valueStart: null,
      nameStart: null
    }, initObj);
  }
  var i;
  var styleStartedAt;
  var styleEndedAt;
  var headSelectorsArr = [];
  var bodyClassesArr = [];
  var bodyIdsArr = [];
  var commentStartedAt;
  var commentNearlyStartedAt;
  var bodyStartedAt;
  var bodyClass;
  var bodyId;
  var headSelectorsCount = {};
  var totalCounter = 0;
  var checkingInsideCurlyBraces;
  var insideCurlyBraces;
  var beingCurrentlyAt;
  var uglified;
  var allClassesAndIdsWithinHeadFinalUglified;
  var countAfterCleaning;
  var countBeforeCleaning;
  var curliesDepth = 0;
  var bodyItsTheFirstClassOrId;
  var bogusHTMLComment;
  var ruleChunkStartedAt;
  var selectorChunkStartedAt;
  var selectorChunkCanBeDeleted = false;
  var singleSelectorStartedAt;
  var singleSelectorType;
  var headWholeLineCanBeDeleted;
  var lastKeptChunksCommaAt = null;
  var onlyDeletedChunksFollow = false;
  var bodyClassOrIdCanBeDeleted;
  var round1RangesClone;
  var nonIndentationsWhitespaceLength = 0;
  var commentsLength = 0;
  var badChars = ".# ~\\!@$%^&*()+=,/';:\"?><[]{}|`\t\n";
  var atRulesWhichMightWrapStyles = ["media", "supports", "document"];
  var atRulesWhichNeedToBeIgnored = ["font-feature-values", "counter-style", "namespace", "font-face", "keyframes", "viewport", "charset", "import", "page"];
  var atRuleBreakCharacters = ["{", "(", "<", '"', "'", "@", ";"];
  if (typeof str !== "string") {
    throw new TypeError("email-remove-unused-css: [THROW_ID_01] Input must be string! Currently it's ".concat(_typeof(str)));
  }
  if (!isObj(opts)) {
    if (opts === undefined || opts === null) {
      opts = {};
    } else {
      throw new TypeError("email-remove-unused-css: [THROW_ID_02] Options, second input argument, must be a plain object! Currently it's ".concat(_typeof(opts), ", equal to: ").concat(JSON.stringify(opts, null, 4)));
    }
  }
  if (isStr(opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains)) {
    if (opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.length) {
      opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains = [opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains];
    } else {
      opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains = [];
    }
  }
  if (isObj(opts) && hasOwnProp(opts, "backend") && isEmpty__default['default'](opts.backend)) {
    opts.backend = [];
  }
  opts = _objectSpread2(_objectSpread2({}, defaults), opts);
  if (isStr(opts.whitelist)) {
    opts.whitelist = [opts.whitelist];
  }
  if (!Array.isArray(opts.whitelist)) {
    throw new TypeError("email-remove-unused-css: [THROW_ID_03] opts.whitelist should be an array, but it was customised to a wrong thing, ".concat(JSON.stringify(opts.whitelist, null, 4)));
  }
  if (opts.whitelist.length > 0 && !opts.whitelist.every(function (el) {
    return isStr(el);
  })) {
    throw new TypeError("email-remove-unused-css: [THROW_ID_04] opts.whitelist array should contain only string-type elements. Currently we\x0Be got:\n".concat(JSON.stringify(opts.whitelist, null, 4)));
  }
  if (!Array.isArray(opts.backend)) {
    throw new TypeError("email-remove-unused-css: [THROW_ID_05] opts.backend should be an array, but it was customised to a wrong thing, ".concat(JSON.stringify(opts.backend, null, 4)));
  }
  if (opts.backend.length > 0 && opts.backend.some(function (val) {
    return !isObj(val);
  })) {
    throw new TypeError("email-remove-unused-css: [THROW_ID_06] opts.backend array should contain only plain objects but it contains something else:\n".concat(JSON.stringify(opts.backend, null, 4)));
  }
  if (opts.backend.length > 0 && !opts.backend.every(function (obj) {
    return hasOwnProp(obj, "heads") && hasOwnProp(obj, "tails");
  })) {
    throw new TypeError("email-remove-unused-css: [THROW_ID_07] every object within opts.backend should contain keys \"heads\" and \"tails\" but currently it's not the case. Whole \"opts.backend\" value array is currently equal to:\n".concat(JSON.stringify(opts.backend, null, 4)));
  }
  if (typeof opts.uglify !== "boolean") {
    if (opts.uglify === 1 || opts.uglify === 0) {
      opts.uglify = !!opts.uglify;
    } else {
      throw new TypeError("email-remove-unused-css: [THROW_ID_08] opts.uglify should be a Boolean. Currently it's set to: ".concat(JSON.stringify(opts.uglify, null, 4), "}"));
    }
  }
  if (opts.reportProgressFunc && typeof opts.reportProgressFunc !== "function") {
    throw new TypeError("email-remove-unused-css: [THROW_ID_09] opts.reportProgressFunc should be a function but it was given as :\n".concat(JSON.stringify(opts.reportProgressFunc, null, 4), " (").concat(_typeof(opts.reportProgressFunc), ")"));
  }
  var allHeads = null;
  var allTails = null;
  if (Array.isArray(opts.backend) && opts.backend.length) {
    allHeads = opts.backend.map(function (headsAndTailsObj) {
      return headsAndTailsObj.heads;
    });
    allTails = opts.backend.map(function (headsAndTailsObj) {
      return headsAndTailsObj.tails;
    });
  }
  var len = str.length;
  var leavePercForLastStage = 0.06;
  var ceil;
  if (opts.reportProgressFunc) {
    ceil = Math.floor((opts.reportProgressFuncTo - (opts.reportProgressFuncTo - opts.reportProgressFuncFrom) * leavePercForLastStage - opts.reportProgressFuncFrom) / 2);
  }
  var trailingLinebreakLengthCorrection = 0;
  if (!str.length || !"\r\n".includes(str[str.length - 1])) {
    trailingLinebreakLengthCorrection = 1;
  }
  var doNothing;
  var doNothingUntil;
  var allClassesAndIdsThatWereCompletelyDeletedFromHead;
  var allClassesAndIdsWithinHeadFinal;
  var allClassesAndIdsWithinHead;
  var allClassesAndIdsWithinBody;
  var headSelectorsCountClone;
  var currentPercentageDone;
  var stateWithinStyleTag;
  var currentlyWithinQuotes;
  var whitespaceStartedAt;
  var bodyClassesToDelete;
  var lastPercentage = 0;
  var stateWithinBody;
  var bodyIdsToDelete;
  var bodyCssToDelete;
  var headCssToDelete;
  var currentChunk;
  var canDelete;
  var usedOnce;
  var _loop = function _loop(round) {
    checkingInsideCurlyBraces = false;
    selectorChunkStartedAt = null;
    selectorChunkCanBeDeleted = false;
    bodyClassOrIdCanBeDeleted = true;
    headWholeLineCanBeDeleted = true;
    bodyClass = resetBodyClassOrId();
    bodyItsTheFirstClassOrId = true;
    onlyDeletedChunksFollow = false;
    singleSelectorStartedAt = null;
    bodyId = resetBodyClassOrId();
    commentNearlyStartedAt = null;
    stateWithinStyleTag = false;
    lastKeptChunksCommaAt = null;
    currentlyWithinQuotes = null;
    whitespaceStartedAt = null;
    insideCurlyBraces = false;
    ruleChunkStartedAt = null;
    beingCurrentlyAt = null;
    stateWithinBody = false;
    commentStartedAt = null;
    doNothingUntil = null;
    styleStartedAt = null;
    bodyStartedAt = null;
    currentChunk = null;
    styleEndedAt = null;
    doNothing = false;
    totalCounter += len;
    stepouter: for (i = 0; i < len; i++) {
      if (opts.reportProgressFunc) {
        if (len > 1000 && len < 2000) {
          if (round === 1 && i === 0) {
            opts.reportProgressFunc(Math.floor((opts.reportProgressFuncTo - opts.reportProgressFuncFrom) / 2)
            );
          }
        } else if (len >= 2000) {
          currentPercentageDone = opts.reportProgressFuncFrom + Math.floor(i / len * ceil) + (round === 1 ? 0 : ceil);
          if (currentPercentageDone !== lastPercentage) {
            lastPercentage = currentPercentageDone;
            opts.reportProgressFunc(currentPercentageDone);
          }
        }
      }
      var chr = str[i];
      if (str[i] === "\n") {
        if (str[i - 1] === "\r") ;
      } else if (str[i] === "\r" && str[i + 1] !== "\n") ;
      if (stateWithinStyleTag !== true && (
      styleEndedAt === null && styleStartedAt !== null && i >= styleStartedAt ||
      styleStartedAt !== null && styleEndedAt !== null && styleStartedAt > styleEndedAt && styleStartedAt < i)) {
        stateWithinStyleTag = true;
        stateWithinBody = false;
      } else if (stateWithinBody !== true && bodyStartedAt !== null && (styleStartedAt === null || styleStartedAt < i) && (styleEndedAt === null || styleEndedAt < i)) {
        stateWithinBody = true;
        stateWithinStyleTag = false;
      }
      if (!doNothing && (str[i] === '"' || str[i] === "'")) {
        if (!currentlyWithinQuotes) {
          var leftSideIdx = stringLeftRight.left(str, i);
          if (stateWithinStyleTag && ["(", ",", ":"].includes(str[leftSideIdx]) || stateWithinBody && !stateWithinStyleTag && ["(", ",", ":", "="].includes(str[leftSideIdx])) {
            currentlyWithinQuotes = str[i];
          }
        } else if (str[i] === "\"" && str[stringLeftRight.right(str, i)] === "'" && str[stringLeftRight.right(str, stringLeftRight.right(str, i))] === "\"" || str[i] === "'" && str[stringLeftRight.right(str, i)] === "\"" && str[stringLeftRight.right(str, stringLeftRight.right(str, i))] === "'") {
          i = stringLeftRight.right(str, stringLeftRight.right(str, i));
          continue;
        } else if (currentlyWithinQuotes === str[i]) {
          currentlyWithinQuotes = null;
        }
      }
      if (doNothing) {
        if (doNothingUntil === null || typeof doNothingUntil !== "string" || typeof doNothingUntil === "string" && !doNothingUntil) {
          doNothing = false;
        } else if (stringMatchLeftRight.matchRightIncl(str, i, doNothingUntil)) {
          if (commentStartedAt !== null) {
            if (round === 1 && opts.removeCSSComments) {
              var lineBreakPresentOnTheLeft = stringMatchLeftRight.matchLeft(str, commentStartedAt, ["\r\n", "\n", "\r"]);
              var startingIndex = commentStartedAt;
              if (lineBreakPresentOnTheLeft) {
                startingIndex -= lineBreakPresentOnTheLeft.length;
              }
              if (str[startingIndex - 1] && characterSuitableForNames(str[startingIndex - 1]) && str[i + doNothingUntil.length] && characterSuitableForNames(str[i + doNothingUntil.length])) {
                finalIndexesToDelete.push(startingIndex, i + doNothingUntil.length, ";");
                commentsLength += i + doNothingUntil.length - startingIndex;
              } else {
                finalIndexesToDelete.push(startingIndex, i + doNothingUntil.length);
                commentsLength += i + doNothingUntil.length - startingIndex;
              }
            }
            commentStartedAt = null;
          }
          i = i + doNothingUntil.length - 1;
          doNothingUntil = null;
          doNothing = false;
          continue;
        }
      }
      if (!doNothing && str[i] === "<" && str[i + 1] === "s" && str[i + 2] === "t" && str[i + 3] === "y" && str[i + 4] === "l" && str[i + 5] === "e") {
        checkingInsideCurlyBraces = true;
        if (!stateWithinStyleTag) {
          stateWithinStyleTag = true;
        }
        for (var y = i; y < len; y++) {
          totalCounter += 1;
          if (str[y] === ">") {
            styleStartedAt = y + 1;
            ruleChunkStartedAt = y + 1;
            break;
          }
        }
      }
      if (!doNothing && stateWithinStyleTag && str[i] === "<" && str[i + 1] === "/" && str[i + 2] === "s" && str[i + 3] === "t" && str[i + 4] === "y" && str[i + 5] === "l" && str[i + 6] === "e") {
        styleEndedAt = i - 1;
        ruleChunkStartedAt = null;
        checkingInsideCurlyBraces = false;
        if (stateWithinStyleTag) {
          stateWithinStyleTag = false;
        }
      }
      if (round === 1 && (stateWithinStyleTag || stateWithinBody) && str[i] === "/" && str[i + 1] === "*" && !commentStartedAt) {
        commentStartedAt = i;
        doNothing = true;
        doNothingUntil = "*/";
        i += 1;
        continue;
      }
      if (!doNothing && stateWithinStyleTag && str[i] === "@") {
        if (whitespaceStartedAt) {
          whitespaceStartedAt = null;
        }
        var matchedAtTagsName = stringMatchLeftRight.matchRight(str, i, atRulesWhichMightWrapStyles) || stringMatchLeftRight.matchRight(str, i, atRulesWhichNeedToBeIgnored);
        if (matchedAtTagsName) {
          var temp = void 0;
          if (str[i + matchedAtTagsName.length + 1] === ";" || str[i + matchedAtTagsName.length + 1] && !str[i + matchedAtTagsName.length + 1].trim() && stringMatchLeftRight.matchRight(str, i + matchedAtTagsName.length + 1, ";", {
            trimBeforeMatching: true,
            cb: function cb(char, theRemainderOfTheString, index) {
              temp = index;
              return true;
            }
          })) {
            finalIndexesToDelete.push(i, temp || i + matchedAtTagsName.length + 2);
          }
          var secondaryStopper = void 0;
          for (var z = i + 1; z < len; z++) {
            totalCounter += 1;
            if (secondaryStopper && str[z] === secondaryStopper) {
              if (str[z] === "}" && atRulesWhichNeedToBeIgnored.includes(matchedAtTagsName) || str[z] === "{" && atRulesWhichMightWrapStyles.includes(matchedAtTagsName)) {
                i = z;
                ruleChunkStartedAt = z + 1;
                continue stepouter;
              } else {
                secondaryStopper = undefined;
                continue;
              }
            }
            if (str[z] === '"' && !secondaryStopper) {
              secondaryStopper = '"';
            } else if (str[z] === "'" && !secondaryStopper) {
              secondaryStopper = "'";
            } else if (str[z] === "(" && !secondaryStopper) {
              secondaryStopper = ")";
            } else if (atRulesWhichNeedToBeIgnored.includes(matchedAtTagsName) && str[z] === "{" && !secondaryStopper) {
              secondaryStopper = "}";
            }
            if (!secondaryStopper && atRuleBreakCharacters.includes(str[z])) {
              var pushRangeFrom = void 0;
              var pushRangeTo = void 0;
              if (str[z] === "{" || str[z] === ";") {
                insideCurlyBraces = false;
                ruleChunkStartedAt = z + 1;
                i = z;
                continue stepouter;
              } else if (str[z] === "@" || str[z] === "<") {
                if (round === 1 && !str.slice(i, z).includes("{") && !str.slice(i, z).includes("(") && !str.slice(i, z).includes('"') && !str.slice(i, z).includes("'")) {
                  pushRangeFrom = i;
                  pushRangeTo = z + (str[z] === ";" ? 1 : 0);
                  finalIndexesToDelete.push(pushRangeFrom, pushRangeTo);
                }
              }
              var iOffset = pushRangeTo ? pushRangeTo - 1 : z - 1 + (str[z] === "{" ? 1 : 0);
              i = iOffset;
              ruleChunkStartedAt = iOffset + 1;
              continue stepouter;
            }
          }
        }
      }
      if (!doNothing && stateWithinStyleTag && insideCurlyBraces && checkingInsideCurlyBraces && chr === "}" && !currentlyWithinQuotes && !curliesDepth) {
        if (round === 2 && headWholeLineCanBeDeleted && ruleChunkStartedAt) {
          finalIndexesToDelete.push(ruleChunkStartedAt, i + 1);
        }
        insideCurlyBraces = false;
        if (ruleChunkStartedAt) {
          ruleChunkStartedAt = i + 1;
        }
        selectorChunkStartedAt = null;
        selectorChunkCanBeDeleted = false;
        headWholeLineCanBeDeleted = true;
        singleSelectorStartedAt = null;
        lastKeptChunksCommaAt = null;
        onlyDeletedChunksFollow = false;
      }
      if (!doNothing && !commentStartedAt && styleStartedAt && i >= styleStartedAt && (
      styleEndedAt === null && i >= styleStartedAt ||
      styleStartedAt > styleEndedAt && styleStartedAt <= i) && i >= beingCurrentlyAt && !insideCurlyBraces) {
        if (singleSelectorStartedAt === null) {
          if (chr === "." || chr === "#") {
            singleSelectorStartedAt = i;
          } else if (stringMatchLeftRight.matchLeft(str, i, "[class=")) {
            if (isLatinLetter(chr)) {
              singleSelectorStartedAt = i;
              singleSelectorType = ".";
            } else if ("\"'".includes(chr) && isLatinLetter(str[stringLeftRight.right(str, i)])) {
              singleSelectorStartedAt = stringLeftRight.right(str, i);
              singleSelectorType = ".";
            }
          } else if (stringMatchLeftRight.matchLeft(str, i, "[id=")) {
            if (isLatinLetter(chr)) {
              singleSelectorStartedAt = i;
              singleSelectorType = "#";
            } else if ("\"'".includes(chr) && isLatinLetter(str[stringLeftRight.right(str, i)])) {
              singleSelectorStartedAt = stringLeftRight.right(str, i);
              singleSelectorType = "#";
            }
          } else if (chr.trim()) {
            if (chr === "}") {
              ruleChunkStartedAt = i + 1;
              currentChunk = null;
            } else if (chr === "<" && str[i + 1] === "!") {
              for (var _y = i; _y < len; _y++) {
                totalCounter += 1;
                if (str[_y] === ">") {
                  ruleChunkStartedAt = _y + 1;
                  selectorChunkStartedAt = _y + 1;
                  i = _y;
                  continue stepouter;
                }
              }
            }
          }
        }
        else if (singleSelectorStartedAt !== null && !characterSuitableForNames(chr)) {
            var singleSelector = str.slice(singleSelectorStartedAt, i);
            if (singleSelectorType) {
              singleSelector = "".concat(singleSelectorType).concat(singleSelector);
              singleSelectorType = undefined;
            }
            if (round === 2 && !selectorChunkCanBeDeleted && headCssToDelete.includes(singleSelector)) {
              selectorChunkCanBeDeleted = true;
              onlyDeletedChunksFollow = true;
            } else if (round === 2 && !selectorChunkCanBeDeleted) {
              if (opts.uglify && (!Array.isArray(opts.whitelist) || !opts.whitelist.length || !matcher__default['default']([singleSelector], opts.whitelist).length)) {
                currentChunksMinifiedSelectors.push(singleSelectorStartedAt, i, allClassesAndIdsWithinHeadFinalUglified[allClassesAndIdsWithinHeadFinal.indexOf(singleSelector)]);
              }
              if (chr === ",") {
                lastKeptChunksCommaAt = i;
                onlyDeletedChunksFollow = false;
              }
            }
            if (chr === "." || chr === "#") {
              singleSelectorStartedAt = i;
            } else {
              singleSelectorStartedAt = null;
            }
          }
        if (selectorChunkStartedAt === null) {
          if (chr.trim() && chr !== "}" && chr !== ";" && !(str[i] === "/" && str[i + 1] === "*")) {
            selectorChunkCanBeDeleted = false;
            selectorChunkStartedAt = i;
          }
        }
        else if (",{".includes(chr)) {
            var sliceTo = whitespaceStartedAt || i;
            currentChunk = str.slice(selectorChunkStartedAt, sliceTo);
            if (round === 1) {
              if (whitespaceStartedAt) {
                if (chr === "," && whitespaceStartedAt < i) {
                  finalIndexesToDelete.push(whitespaceStartedAt, i);
                  nonIndentationsWhitespaceLength += i - whitespaceStartedAt;
                } else if (chr === "{" && whitespaceStartedAt < i - 1) {
                  finalIndexesToDelete.push(whitespaceStartedAt, i - 1);
                  nonIndentationsWhitespaceLength += i - 1 - whitespaceStartedAt;
                }
              }
              headSelectorsArr.push(currentChunk);
            }
            else if (selectorChunkCanBeDeleted) {
                var fromIndex = selectorChunkStartedAt;
                var toIndex = i;
                var tempFindingIndex = void 0;
                if (chr === "{" && str[fromIndex - 1] !== ">" && str[fromIndex - 1] !== "}") {
                  for (var _y2 = selectorChunkStartedAt; _y2--;) {
                    totalCounter += 1;
                    if (str[_y2].trim() && str[_y2] !== ",") {
                      fromIndex = _y2 + 1;
                      break;
                    }
                  }
                  if (!str[i - 1].trim()) {
                    toIndex = i - 1;
                  }
                } else if (chr === "," && !str[i + 1].trim()) {
                  for (var _y3 = i + 1; _y3 < len; _y3++) {
                    totalCounter += 1;
                    if (str[_y3].trim()) {
                      toIndex = _y3;
                      break;
                    }
                  }
                } else if (stringMatchLeftRight.matchLeft(str, fromIndex, "{", {
                  trimBeforeMatching: true,
                  cb: function cb(char, theRemainderOfTheString, index) {
                    tempFindingIndex = index;
                    return true;
                  }
                })) {
                  fromIndex = tempFindingIndex + 2;
                }
                var resToPush = expander__default['default']({
                  str: str,
                  from: fromIndex,
                  to: toIndex,
                  ifRightSideIncludesThisThenCropTightly: ".#",
                  ifRightSideIncludesThisCropItToo: ",",
                  extendToOneSide: "right"
                });
                finalIndexesToDelete.push.apply(finalIndexesToDelete, _toConsumableArray(resToPush));
                if (opts.uglify) {
                  currentChunksMinifiedSelectors.wipe();
                }
              } else {
                if (headWholeLineCanBeDeleted) {
                  headWholeLineCanBeDeleted = false;
                }
                if (onlyDeletedChunksFollow) {
                  onlyDeletedChunksFollow = false;
                }
                if (opts.uglify) {
                  finalIndexesToDelete.push(currentChunksMinifiedSelectors.current());
                  currentChunksMinifiedSelectors.wipe();
                }
              }
            if (chr !== "{") {
              selectorChunkStartedAt = null;
            } else if (round === 2) {
              if (!headWholeLineCanBeDeleted && lastKeptChunksCommaAt !== null && onlyDeletedChunksFollow) {
                var deleteUpTo = lastKeptChunksCommaAt + 1;
                if ("\n\r".includes(str[lastKeptChunksCommaAt + 1])) {
                  for (var _y4 = lastKeptChunksCommaAt + 1; _y4 < len; _y4++) {
                    if (str[_y4].trim()) {
                      deleteUpTo = _y4;
                      break;
                    }
                  }
                }
                finalIndexesToDelete.push(lastKeptChunksCommaAt, deleteUpTo);
                lastKeptChunksCommaAt = null;
                onlyDeletedChunksFollow = false;
              }
            }
          }
      }
      if (!doNothing && !stateWithinStyleTag && stateWithinBody && str[i] === "/" && stringMatchLeftRight.matchRight(str, i, "body", {
        trimBeforeMatching: true,
        i: true
      }) && stringMatchLeftRight.matchLeft(str, i, "<", {
        trimBeforeMatching: true
      })) {
        stateWithinBody = false;
        bodyStartedAt = null;
      }
      if (!doNothing && str[i] === "<" && stringMatchLeftRight.matchRight(str, i, "body", {
        i: true,
        trimBeforeMatching: true,
        cb: function cb(char, theRemainderOfTheString, index) {
          if (round === 1) {
            if (char !== undefined && (char.trim() === "" || char === ">")) {
              if (index - i > 5) {
                finalIndexesToDelete.push(i, index, "<body");
                nonIndentationsWhitespaceLength += index - i - 5;
              } else {
                return true;
              }
            }
            return true;
          }
          return true;
        }
      })) {
        for (var _y5 = i; _y5 < len; _y5++) {
          totalCounter += 1;
          if (str[_y5] === ">") {
            bodyStartedAt = _y5 + 1;
            break;
          }
        }
      }
      if (!doNothing && stateWithinBody && !stateWithinStyleTag && str[i] === "s" && str[i + 1] === "t" && str[i + 2] === "y" && str[i + 3] === "l" && str[i + 4] === "e" && str[i + 5] === "=" && badChars.includes(str[i - 1])
      ) {
          if ("\"'".includes(str[i + 6])) ;
        }
      if (!doNothing && stateWithinBody && !stateWithinStyleTag && !currentlyWithinQuotes && str[i] === "c" && str[i + 1] === "l" && str[i + 2] === "a" && str[i + 3] === "s" && str[i + 4] === "s" &&
      str[i - 1] &&
      !str[i - 1].trim()) {
        var valuesStart = void 0;
        var quoteless = false;
        if (str[i + 5] === "=") {
          if (str[i + 6] === '"' || str[i + 6] === "'") {
            valuesStart = i + 7;
          } else if (characterSuitableForNames(str[i + 6])) {
            valuesStart = i + 6;
            quoteless = true;
          } else if (str[i + 6] && (!str[i + 6].trim() || "/>".includes(str[i + 6]))) {
            var calculatedRange = expander__default['default']({
              str: str,
              from: i,
              to: i + 6,
              ifRightSideIncludesThisThenCropTightly: "/>",
              wipeAllWhitespaceOnLeft: true
            });
            finalIndexesToDelete.push.apply(finalIndexesToDelete, _toConsumableArray(calculatedRange));
          }
        } else if (!str[i + 5].trim()) {
          for (var _y6 = i + 5; _y6 < len; _y6++) {
            totalCounter += 1;
            if (str[_y6].trim()) {
              if (str[_y6] === "=") {
                if (_y6 > i + 5 && round === 1) {
                  finalIndexesToDelete.push(i + 5, _y6);
                }
                if ((str[_y6 + 1] === '"' || str[_y6 + 1] === "'") && str[_y6 + 2]) {
                  valuesStart = _y6 + 2;
                } else if (str[_y6 + 1] && !str[_y6 + 1].trim()) {
                  for (var _z = _y6 + 1; _z < len; _z++) {
                    totalCounter += 1;
                    if (str[_z].trim()) {
                      if (_z > _y6 + 1 && round === 1) {
                        finalIndexesToDelete.push(_y6 + 1, _z);
                      }
                      if ((str[_z] === '"' || str[_z] === "'") && str[_z + 1]) {
                        valuesStart = _z + 1;
                      }
                      break;
                    }
                  }
                }
              }
              break;
            }
          }
        }
        if (valuesStart) {
          bodyClass = resetBodyClassOrId({
            valuesStart: valuesStart,
            quoteless: quoteless,
            nameStart: i
          });
          if (round === 1) {
            bodyItsTheFirstClassOrId = true;
          } else if (round === 2) {
            bodyClassOrIdCanBeDeleted = true;
          }
        }
      }
      if (!doNothing && stateWithinBody && !stateWithinStyleTag && !currentlyWithinQuotes && str[i] === "i" && str[i + 1] === "d" &&
      str[i - 1] &&
      !str[i - 1].trim()) {
        var _valuesStart = void 0;
        var _quoteless = false;
        if (str[i + 2] === "=") {
          if (str[i + 3] === '"' || str[i + 3] === "'") {
            _valuesStart = i + 4;
          } else if (characterSuitableForNames(str[i + 3])) {
            _valuesStart = i + 3;
            _quoteless = true;
          } else if (str[i + 3] && (!str[i + 3].trim() || "/>".includes(str[i + 3]))) {
            var _calculatedRange = expander__default['default']({
              str: str,
              from: i,
              to: i + 3,
              ifRightSideIncludesThisThenCropTightly: "/>",
              wipeAllWhitespaceOnLeft: true
            });
            finalIndexesToDelete.push.apply(finalIndexesToDelete, _toConsumableArray(_calculatedRange));
          }
        } else if (!str[i + 2].trim()) {
          for (var _y7 = i + 2; _y7 < len; _y7++) {
            totalCounter += 1;
            if (str[_y7].trim()) {
              if (str[_y7] === "=") {
                if (_y7 > i + 2 && round === 1) {
                  finalIndexesToDelete.push(i + 2, _y7);
                }
                if ((str[_y7 + 1] === '"' || str[_y7 + 1] === "'") && str[_y7 + 2]) {
                  _valuesStart = _y7 + 2;
                } else if (str[_y7 + 1] && !str[_y7 + 1].trim()) {
                  for (var _z2 = _y7 + 1; _z2 < len; _z2++) {
                    totalCounter += 1;
                    if (str[_z2].trim()) {
                      if (_z2 > _y7 + 1 && round === 1) {
                        finalIndexesToDelete.push(_y7 + 1, _z2);
                      }
                      if ((str[_z2] === '"' || str[_z2] === "'") && str[_z2 + 1]) {
                        _valuesStart = _z2 + 1;
                      }
                      break;
                    }
                  }
                }
              }
              break;
            }
          }
        }
        if (_valuesStart) {
          bodyId = resetBodyClassOrId({
            valuesStart: _valuesStart,
            quoteless: _quoteless,
            nameStart: i
          });
          if (round === 1) {
            bodyItsTheFirstClassOrId = true;
          } else if (round === 2) {
            bodyClassOrIdCanBeDeleted = true;
          }
        }
      }
      if (!doNothing && bodyClass.valuesStart !== null && i >= bodyClass.valuesStart && bodyClass.valueStart === null) {
        if (allHeads && stringMatchLeftRight.matchRightIncl(str, i, allHeads)) {
          (function () {
            doNothing = true;
            bodyClassOrIdCanBeDeleted = false;
            if (whitespaceStartedAt && i > whitespaceStartedAt + 1) {
              var _calculatedRange2 = expander__default['default']({
                str: str,
                from: whitespaceStartedAt,
                to: i,
                ifLeftSideIncludesThisThenCropTightly: "\"'",
                ifRightSideIncludesThisThenCropTightly: "\"'"
              });
              finalIndexesToDelete.push.apply(finalIndexesToDelete, _toConsumableArray(_calculatedRange2));
              whitespaceStartedAt = null;
            } else if (whitespaceStartedAt) {
              whitespaceStartedAt = null;
            }
            var matchedHeads = stringMatchLeftRight.matchRightIncl(str, i, allHeads);
            var findings = opts.backend.find(function (headsTailsObj) {
              return headsTailsObj.heads === matchedHeads;
            });
            doNothingUntil = findings.tails;
          })();
        } else if (characterSuitableForNames(chr)) {
          bodyClass.valueStart = i;
          if (round === 1) {
            if (bodyItsTheFirstClassOrId && bodyClass.valuesStart !== null && !str.slice(bodyClass.valuesStart, i).trim() && bodyClass.valuesStart < i) {
              finalIndexesToDelete.push(bodyClass.valuesStart, i);
              nonIndentationsWhitespaceLength += i - bodyClass.valuesStart;
              bodyItsTheFirstClassOrId = false;
            } else if (whitespaceStartedAt !== null && whitespaceStartedAt < i - 1) {
              finalIndexesToDelete.push(whitespaceStartedAt + 1, i);
              nonIndentationsWhitespaceLength += i - whitespaceStartedAt + 1;
            }
          }
        }
      }
      if (!doNothing && bodyClass.valueStart !== null && i > bodyClass.valueStart && (!characterSuitableForNames(chr) || allTails && stringMatchLeftRight.matchRightIncl(str, i, allTails))) {
        if (allHeads && stringMatchLeftRight.matchRightIncl(str, i, allHeads)) {
          (function () {
            bodyClass.valueStart = null;
            bodyClass = resetBodyClassOrId();
            var matchedHeads = stringMatchLeftRight.matchRightIncl(str, i, allHeads);
            var findings = opts.backend.find(function (headsTailsObj) {
              return headsTailsObj.heads === matchedHeads;
            });
            doNothingUntil = findings.tails;
          })();
        } else {
          var carvedClass = "".concat(str.slice(bodyClass.valueStart, i));
          if (round === 1) {
            bodyClassesArr.push(".".concat(carvedClass));
          }
          else if (bodyClass.valueStart != null && bodyClassesToDelete.includes(carvedClass)) {
              var expandedRange = expander__default['default']({
                str: str,
                from: bodyClass.valueStart,
                to: i,
                ifLeftSideIncludesThisThenCropTightly: "\"'",
                ifRightSideIncludesThisThenCropTightly: "\"'",
                wipeAllWhitespaceOnLeft: true
              });
              var whatToInsert = "";
              if (str[expandedRange[0] - 1] && str[expandedRange[0] - 1].trim() && str[expandedRange[1]] && str[expandedRange[1]].trim() && (allHeads || allTails) && (allHeads && stringMatchLeftRight.matchLeft(str, expandedRange[0], allTails) || allTails && stringMatchLeftRight.matchRightIncl(str, expandedRange[1], allHeads))) {
                whatToInsert = " ";
              }
              finalIndexesToDelete.push.apply(finalIndexesToDelete, _toConsumableArray(expandedRange).concat([whatToInsert]));
            } else {
              bodyClassOrIdCanBeDeleted = false;
              if (opts.uglify && !(Array.isArray(opts.whitelist) && opts.whitelist.length && matcher__default['default']([".".concat(carvedClass)], opts.whitelist).length)) {
                finalIndexesToDelete.push(bodyClass.valueStart, i, allClassesAndIdsWithinHeadFinalUglified[allClassesAndIdsWithinHeadFinal.indexOf(".".concat(carvedClass))].slice(1));
              }
            }
          bodyClass.valueStart = null;
        }
      }
      if (!doNothing && bodyId.valueStart !== null && i > bodyId.valueStart && (!characterSuitableForNames(chr) || allTails && stringMatchLeftRight.matchRightIncl(str, i, allTails))) {
        var carvedId = str.slice(bodyId.valueStart, i);
        if (round === 1) {
          bodyIdsArr.push("#".concat(carvedId));
        }
        else if (bodyId.valueStart != null && bodyIdsToDelete.includes(carvedId)) {
            var _expandedRange = expander__default['default']({
              str: str,
              from: bodyId.valueStart,
              to: i,
              ifRightSideIncludesThisThenCropTightly: "\"'",
              wipeAllWhitespaceOnLeft: true
            });
            if (str[_expandedRange[0] - 1] && str[_expandedRange[0] - 1].trim() && str[_expandedRange[1]] && str[_expandedRange[1]].trim() && (allHeads || allTails) && (allHeads && stringMatchLeftRight.matchLeft(str, _expandedRange[0], allTails) || allTails && stringMatchLeftRight.matchRightIncl(str, _expandedRange[1], allHeads))) {
              _expandedRange[0] += 1;
            }
            finalIndexesToDelete.push.apply(finalIndexesToDelete, _toConsumableArray(_expandedRange));
          } else {
            bodyClassOrIdCanBeDeleted = false;
            if (opts.uglify && !(Array.isArray(opts.whitelist) && opts.whitelist.length && matcher__default['default'](["#".concat(carvedId)], opts.whitelist).length)) {
              finalIndexesToDelete.push(bodyId.valueStart, i, allClassesAndIdsWithinHeadFinalUglified[allClassesAndIdsWithinHeadFinal.indexOf("#".concat(carvedId))].slice(1));
            }
          }
        bodyId.valueStart = null;
      }
      if (!doNothing && bodyClass.valuesStart != null && (!bodyClass.quoteless && (chr === "'" || chr === '"') || bodyClass.quoteless && !characterSuitableForNames(str[i])) && i >= bodyClass.valuesStart) {
        if (i === bodyClass.valuesStart) {
          if (round === 1) {
            finalIndexesToDelete.push.apply(finalIndexesToDelete, _toConsumableArray(expander__default['default']({
              str: str,
              from: bodyClass.nameStart,
              to: i + 1,
              ifRightSideIncludesThisThenCropTightly: "/>",
              wipeAllWhitespaceOnLeft: true
            })));
          }
        } else {
          if (round === 2 && bodyClassOrIdCanBeDeleted) {
            var _expandedRange2 = expander__default['default']({
              str: str,
              from: bodyClass.valuesStart - 7,
              to: "'\"".includes(str[i]) ? i + 1 : i,
              ifRightSideIncludesThisThenCropTightly: "/>",
              wipeAllWhitespaceOnLeft: true
            });
            var _whatToInsert = "";
            if (str[_expandedRange2[0] - 1] && str[_expandedRange2[0] - 1].trim() && str[_expandedRange2[1]] && str[_expandedRange2[1]].trim() && !"/>".includes(str[_expandedRange2[1]])
            ) {
                _whatToInsert = " ";
              }
            finalIndexesToDelete.push.apply(finalIndexesToDelete, _toConsumableArray(_expandedRange2).concat([_whatToInsert]));
          }
          if (whitespaceStartedAt !== null) {
            finalIndexesToDelete.push(whitespaceStartedAt, i);
          }
        }
        bodyClass = resetBodyClassOrId();
      }
      if (!doNothing && bodyId.valuesStart !== null && (!bodyId.quoteless && (chr === "'" || chr === '"') || bodyId.quoteless && !characterSuitableForNames(str[i])) && i >= bodyId.valuesStart) {
        if (i === bodyId.valuesStart) {
          if (round === 1) {
            finalIndexesToDelete.push.apply(finalIndexesToDelete, _toConsumableArray(expander__default['default']({
              str: str,
              from: bodyId.nameStart,
              to: i + 1,
              ifRightSideIncludesThisThenCropTightly: "/>",
              wipeAllWhitespaceOnLeft: true
            })));
          }
        } else {
          if (round === 2 && bodyClassOrIdCanBeDeleted) {
            var _expandedRange3 = expander__default['default']({
              str: str,
              from: bodyId.valuesStart - 4,
              to: i + 1,
              ifRightSideIncludesThisThenCropTightly: "/>",
              wipeAllWhitespaceOnLeft: true
            });
            var _whatToInsert2 = "";
            if (str[_expandedRange3[0] - 1] && str[_expandedRange3[0] - 1].trim() && str[_expandedRange3[1]] && str[_expandedRange3[1]].trim() && !"/>".includes(str[_expandedRange3[1]])
            ) {
                _whatToInsert2 = " ";
              }
            finalIndexesToDelete.push.apply(finalIndexesToDelete, _toConsumableArray(_expandedRange3).concat([_whatToInsert2]));
          }
          if (whitespaceStartedAt !== null) {
            finalIndexesToDelete.push(whitespaceStartedAt, i);
          }
        }
        bodyId = resetBodyClassOrId();
      }
      if (!doNothing && bodyId.valuesStart && i >= bodyId.valuesStart && bodyId.valueStart === null) {
        if (allHeads && stringMatchLeftRight.matchRightIncl(str, i, allHeads)) {
          (function () {
            doNothing = true;
            bodyClassOrIdCanBeDeleted = false;
            if (whitespaceStartedAt && i > whitespaceStartedAt + 1) {
              var _calculatedRange3 = expander__default['default']({
                str: str,
                from: whitespaceStartedAt,
                to: i,
                ifLeftSideIncludesThisThenCropTightly: "\"'",
                ifRightSideIncludesThisThenCropTightly: "\"'"
              });
              finalIndexesToDelete.push.apply(finalIndexesToDelete, _toConsumableArray(_calculatedRange3));
              whitespaceStartedAt = null;
            } else if (whitespaceStartedAt) {
              whitespaceStartedAt = null;
            }
            var matchedHeads = stringMatchLeftRight.matchRightIncl(str, i, allHeads);
            var findings = opts.backend.find(function (headsTailsObj) {
              return headsTailsObj.heads === matchedHeads;
            });
            doNothingUntil = findings.tails;
          })();
        } else if (characterSuitableForNames(chr)) {
          bodyId.valueStart = i;
          if (round === 1) {
            if (bodyItsTheFirstClassOrId && bodyId.valuesStart !== null && !str.slice(bodyId.valuesStart, i).trim() && bodyId.valuesStart < i) {
              finalIndexesToDelete.push(bodyId.valuesStart, i);
              nonIndentationsWhitespaceLength += i - bodyId.valuesStart;
              bodyItsTheFirstClassOrId = false;
            } else if (whitespaceStartedAt !== null && whitespaceStartedAt < i - 1) {
              finalIndexesToDelete.push(whitespaceStartedAt + 1, i);
              nonIndentationsWhitespaceLength += i - whitespaceStartedAt + 1;
            }
          }
        }
      }
      if (!doNothing && round === 1) {
        if (commentStartedAt !== null && commentStartedAt < i && str[i] === ">" && !usedOnce) {
          if (opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains && Array.isArray(opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains) && opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.length && opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.some(function (val) {
            return val.trim() && str.slice(commentStartedAt, i).toLowerCase().includes(val);
          })) {
            canDelete = false;
          }
          usedOnce = true;
        }
        if (commentStartedAt !== null && str[i] === ">") {
          if (!bogusHTMLComment && str[i - 1] === "-" && str[i - 2] === "-") {
            var _calculatedRange4 = expander__default['default']({
              str: str,
              from: commentStartedAt,
              to: i + 1,
              wipeAllWhitespaceOnLeft: true,
              addSingleSpaceToPreventAccidentalConcatenation: true
            });
            if (opts.removeHTMLComments && canDelete) {
              finalIndexesToDelete.push.apply(finalIndexesToDelete, _toConsumableArray(_calculatedRange4));
            }
            commentsLength += _calculatedRange4[1] - _calculatedRange4[0];
            commentStartedAt = null;
            bogusHTMLComment = undefined;
          } else if (bogusHTMLComment) {
            var _calculatedRange5 = expander__default['default']({
              str: str,
              from: commentStartedAt,
              to: i + 1,
              wipeAllWhitespaceOnLeft: true,
              addSingleSpaceToPreventAccidentalConcatenation: true
            });
            if (opts.removeHTMLComments && canDelete) {
              finalIndexesToDelete.push.apply(finalIndexesToDelete, _toConsumableArray(_calculatedRange5));
            }
            commentsLength += _calculatedRange5[1] - _calculatedRange5[0];
            commentStartedAt = null;
            bogusHTMLComment = undefined;
          }
        }
        if (opts.removeHTMLComments && commentStartedAt === null && str[i] === "<" && str[i + 1] === "!") {
          if ((!allHeads || Array.isArray(allHeads) && allHeads.length && !allHeads.includes("<!")) && (!allTails || Array.isArray(allTails) && allTails.length && !allTails.includes("<!"))) {
            if (!stringMatchLeftRight.matchRight(str, i + 1, "doctype", {
              i: true,
              trimBeforeMatching: true
            }) && !(str[i + 2] === "-" && str[i + 3] === "-" && Array.isArray(opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains) && opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.length && stringMatchLeftRight.matchRight(str, i + 3, opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains, {
              trimBeforeMatching: true
            }))) {
              commentStartedAt = i;
              usedOnce = false;
              canDelete = true;
            }
            bogusHTMLComment = !(str[i + 2] === "-" && str[i + 3] === "-");
          }
          if (commentStartedAt !== i) {
            commentNearlyStartedAt = i;
          }
        }
      }
      if (chr === "}" && curliesDepth) {
        curliesDepth -= 1;
      }
      if (!doNothing && chr === "{" && checkingInsideCurlyBraces) {
        if (!insideCurlyBraces) {
          insideCurlyBraces = true;
          if (whitespaceStartedAt !== null && (str.slice(whitespaceStartedAt, i).includes("\n") || str.slice(whitespaceStartedAt, i).includes("\r"))) {
            finalIndexesToDelete.push(whitespaceStartedAt, i);
          }
        } else {
          curliesDepth += 1;
        }
      }
      if (!doNothing) {
        if (!str[i].trim()) {
          if (whitespaceStartedAt === null) {
            whitespaceStartedAt = i;
          }
        } else if (whitespaceStartedAt !== null) {
          whitespaceStartedAt = null;
        }
      }
      if (!doNothing && round === 2 && Array.isArray(round1RangesClone) && round1RangesClone.length && i === round1RangesClone[0][0]) {
        var _temp = round1RangesClone.shift();
        if (_temp[1] - 1 > i) {
          i = _temp[1] - 1;
        }
        continue;
      }
      if (commentNearlyStartedAt !== null && str[i] === ">") {
        commentNearlyStartedAt = null;
        var _temp2 = void 0;
        if (opts.removeHTMLComments && Array.isArray(opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains) && opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.length && (opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.some(function (val) {
          return val.includes("if");
        }) || opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.some(function (val) {
          return val.includes("mso");
        }) || opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.some(function (val) {
          return val.includes("ie");
        })) && stringMatchLeftRight.matchRight(str, i, "<!--", {
          trimBeforeMatching: true,
          cb: function cb(char, theRemainderOfTheString, index) {
            _temp2 = index;
            return true;
          }
        })) {
          if (stringMatchLeftRight.matchRight(str, _temp2 - 1, "-->", {
            trimBeforeMatching: true,
            cb: function cb(char, theRemainderOfTheString, index) {
              _temp2 = index;
              return true;
            }
          })) ;
          i = _temp2 - 1;
          continue;
        }
      }
    }
    if (round === 1) {
      allClassesAndIdsWithinBody = uniq__default['default'](bodyClassesArr.concat(bodyIdsArr));
      headSelectorsArr.forEach(function (el) {
        extract__default['default'](el).forEach(function (selector) {
          if (Object.prototype.hasOwnProperty.call(headSelectorsCount, selector)) {
            headSelectorsCount[selector] += 1;
          } else {
            headSelectorsCount[selector] = 1;
          }
        });
      });
      headSelectorsCountClone = _objectSpread2({}, headSelectorsCount);
      allClassesAndIdsWithinHead = uniq__default['default'](headSelectorsArr.reduce(function (arr, el) {
        return arr.concat(extract__default['default'](el));
      }, []));
      countBeforeCleaning = allClassesAndIdsWithinHead.length;
      var preppedHeadSelectorsArr = Array.from(headSelectorsArr);
      var deletedFromHeadArr = [];
      for (var _y8 = 0, len2 = preppedHeadSelectorsArr.length; _y8 < len2; _y8++) {
        totalCounter += 1;
        var _temp3 = void 0;
        if (preppedHeadSelectorsArr[_y8] != null) {
          _temp3 = extract__default['default'](preppedHeadSelectorsArr[_y8]);
        }
        if (!_temp3.every(function (el) {
          return allClassesAndIdsWithinBody.includes(el);
        })) {
          var _deletedFromHeadArr;
          (_deletedFromHeadArr = deletedFromHeadArr).push.apply(_deletedFromHeadArr, _toConsumableArray(extract__default['default'](preppedHeadSelectorsArr[_y8])));
          preppedHeadSelectorsArr.splice(_y8, 1);
          _y8 -= 1;
          len2 -= 1;
        }
      }
      deletedFromHeadArr = uniq__default['default'](pullAllWithGlob__default['default'](deletedFromHeadArr, opts.whitelist));
      var preppedAllClassesAndIdsWithinHead;
      if (preppedHeadSelectorsArr.length > 0) {
        preppedAllClassesAndIdsWithinHead = preppedHeadSelectorsArr.reduce(function (arr, el) {
          return arr.concat(extract__default['default'](el));
        }, []);
      } else {
        preppedAllClassesAndIdsWithinHead = [];
      }
      headCssToDelete = pullAllWithGlob__default['default'](pullAll__default['default'](uniq__default['default'](Array.from(allClassesAndIdsWithinHead)), bodyClassesArr.concat(bodyIdsArr)), opts.whitelist);
      bodyCssToDelete = uniq__default['default'](pullAllWithGlob__default['default'](pullAll__default['default'](bodyClassesArr.concat(bodyIdsArr), preppedAllClassesAndIdsWithinHead), opts.whitelist));
      headCssToDelete = uniq__default['default'](headCssToDelete.concat(intersection__default['default'](deletedFromHeadArr, bodyCssToDelete)));
      bodyClassesToDelete = bodyCssToDelete.filter(function (s) {
        return s.startsWith(".");
      }).map(function (s) {
        return s.slice(1);
      });
      bodyIdsToDelete = bodyCssToDelete.filter(function (s) {
        return s.startsWith("#");
      }).map(function (s) {
        return s.slice(1);
      });
      allClassesAndIdsThatWereCompletelyDeletedFromHead = Object.keys(headSelectorsCountClone).filter(function (singleSelector) {
        return headSelectorsCountClone[singleSelector] < 1;
      });
      bodyClassesToDelete = uniq__default['default'](bodyClassesToDelete.concat(intersection__default['default'](pullAllWithGlob__default['default'](allClassesAndIdsWithinBody, opts.whitelist), allClassesAndIdsThatWereCompletelyDeletedFromHead).filter(function (val) {
        return val[0] === ".";
      })
      .map(function (val) {
        return val.slice(1);
      })));
      var allClassesAndIdsWithinBodyThatWereWhitelisted = matcher__default['default'](allClassesAndIdsWithinBody, opts.whitelist);
      bodyCssToDelete = uniq__default['default'](bodyCssToDelete.concat(bodyClassesToDelete.map(function (val) {
        return ".".concat(val);
      }), bodyIdsToDelete.map(function (val) {
        return "#".concat(val);
      })));
      allClassesAndIdsWithinHeadFinal = pullAll__default['default'](pullAll__default['default'](Array.from(allClassesAndIdsWithinHead), bodyCssToDelete), headCssToDelete);
      if (Array.isArray(allClassesAndIdsWithinBodyThatWereWhitelisted) && allClassesAndIdsWithinBodyThatWereWhitelisted.length) {
        allClassesAndIdsWithinBodyThatWereWhitelisted.forEach(function (classOrId) {
          if (!allClassesAndIdsWithinHeadFinal.includes(classOrId)) {
            allClassesAndIdsWithinHeadFinal.push(classOrId);
          }
        });
      }
      if (opts.uglify) {
        allClassesAndIdsWithinHeadFinalUglified = stringUglify.uglifyArr(allClassesAndIdsWithinHeadFinal);
      }
      countAfterCleaning = allClassesAndIdsWithinHeadFinal.length;
      uglified = opts.uglify ? allClassesAndIdsWithinHeadFinal.map(function (name, id) {
        return [name, allClassesAndIdsWithinHeadFinalUglified[id]];
      }).filter(function (arr) {
        return !opts.whitelist.some(function (whitelistVal) {
          return matcher__default['default'].isMatch(arr[0], whitelistVal);
        });
      }) : null;
      if (finalIndexesToDelete.current()) {
        round1RangesClone = Array.from(finalIndexesToDelete.current());
      } else {
        round1RangesClone = null;
      }
    }
  };
  for (var round = 1; round <= 2; round++) {
    _loop(round);
  }
  finalIndexesToDelete.push(lineBreaksToDelete.current());
  if (str.length && finalIndexesToDelete.current()) {
    str = applyRanges__default['default'](str, finalIndexesToDelete.current());
    finalIndexesToDelete.wipe();
  }
  var startingPercentageDone = opts.reportProgressFuncTo - (opts.reportProgressFuncTo - opts.reportProgressFuncFrom) * leavePercForLastStage;
  if (opts.reportProgressFunc && len >= 2000) {
    currentPercentageDone = Math.floor(startingPercentageDone + (opts.reportProgressFuncTo - startingPercentageDone) / 5
    );
    if (currentPercentageDone !== lastPercentage) {
      lastPercentage = currentPercentageDone;
      opts.reportProgressFunc(currentPercentageDone);
    }
  }
  while (regexEmptyMediaQuery.test(str) || regexEmptyUnclosedMediaQuery.test(str)) {
    str = str.replace(regexEmptyMediaQuery, "");
    str = str.replace(regexEmptyUnclosedMediaQuery, "");
    totalCounter += str.length;
  }
  if (opts.reportProgressFunc && len >= 2000) {
    currentPercentageDone = Math.floor(startingPercentageDone + (opts.reportProgressFuncTo - startingPercentageDone) / 5 * 2);
    if (currentPercentageDone !== lastPercentage) {
      lastPercentage = currentPercentageDone;
      opts.reportProgressFunc(currentPercentageDone);
    }
  }
  str = str.replace(regexEmptyStyleTag, "\n");
  totalCounter += str.length;
  if (opts.reportProgressFunc && len >= 2000) {
    currentPercentageDone = Math.floor(startingPercentageDone + (opts.reportProgressFuncTo - startingPercentageDone) / 5 * 3);
    if (currentPercentageDone !== lastPercentage) {
      lastPercentage = currentPercentageDone;
      opts.reportProgressFunc(currentPercentageDone);
    }
  }
  var tempLen = str.length;
  str = str.replace(emptyCondCommentRegex__default['default'](), "");
  totalCounter += str.length;
  if (tempLen !== str.length) {
    commentsLength += str.length - tempLen;
  }
  if (opts.reportProgressFunc && len >= 2000) {
    currentPercentageDone = Math.floor(startingPercentageDone + (opts.reportProgressFuncTo - startingPercentageDone) / 5 * 4);
    if (currentPercentageDone !== lastPercentage) {
      lastPercentage = currentPercentageDone;
      opts.reportProgressFunc(currentPercentageDone);
    }
  }
  str = htmlCrush.crush(str, {
    removeLineBreaks: false,
    removeIndentations: false,
    removeHTMLComments: false,
    removeCSSComments: false,
    lineLengthLimit: 500
  }).result;
  tempLen = str.length;
  if (tempLen !== str.length) {
    nonIndentationsWhitespaceLength += str.length - tempLen;
  }
  totalCounter += str.length;
  if (opts.reportProgressFunc && len >= 2000) {
    currentPercentageDone = Math.floor(startingPercentageDone + (opts.reportProgressFuncTo - startingPercentageDone));
    if (currentPercentageDone !== lastPercentage) {
      lastPercentage = currentPercentageDone;
      opts.reportProgressFunc(currentPercentageDone);
    }
  }
  if (str.length) {
    if ((!str[0].trim() || !str[str.length - 1].trim()) && str.length !== str.trim()) {
      nonIndentationsWhitespaceLength += str.length - str.trim();
    }
    str = str.trimStart();
  }
  str = str.replace(/ ((class|id)=["']) /g, " $1");
  return {
    log: {
      timeTakenInMiliseconds: Date.now() - start,
      timeTakenInMilliseconds: Date.now() - start,
      traversedTotalCharacters: totalCounter,
      traversedTimesInputLength: len ? Math.round(totalCounter / len * 100) / 100 : 0,
      originalLength: len,
      cleanedLength: str.length,
      bytesSaved: Math.max(len - str.length, 0),
      percentageReducedOfOriginal: len ? Math.round(Math.max(len - str.length, 0) * 100 / len) : 0,
      nonIndentationsWhitespaceLength: Math.max(nonIndentationsWhitespaceLength - trailingLinebreakLengthCorrection, 0),
      nonIndentationsTakeUpPercentageOfOriginal: len && Math.max(nonIndentationsWhitespaceLength - trailingLinebreakLengthCorrection, 0) ? Math.round(Math.max(nonIndentationsWhitespaceLength, 0) * 100 / len) : 0,
      commentsLength: commentsLength,
      commentsTakeUpPercentageOfOriginal: len && commentsLength ? Math.round(commentsLength * 100 / len) : 0,
      uglified: uglified
    },
    result: str,
    countAfterCleaning: countAfterCleaning,
    countBeforeCleaning: countBeforeCleaning,
    allInHead: allClassesAndIdsWithinHead.sort(),
    allInBody: allClassesAndIdsWithinBody.sort(),
    deletedFromHead: headCssToDelete.sort(),
    deletedFromBody: bodyCssToDelete.sort()
  };
}

exports.comb = comb;
exports.defaults = defaults;
exports.version = version;
