/**
 * email-comb
 * Remove unused CSS from email templates
 * Version: 3.8.14
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/email-comb
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var stringMatchLeftRight = require('string-match-left-right');
var emptyCondCommentRegex = _interopDefault(require('regex-empty-conditional-comments'));
var pullAllWithGlob = _interopDefault(require('array-pull-all-with-glob'));
var extract = _interopDefault(require('string-extract-class-names'));
var intersection = _interopDefault(require('lodash.intersection'));
var expander = _interopDefault(require('string-range-expander'));
var stringLeftRight = require('string-left-right');
var stringUglify = require('string-uglify');
var isObj = _interopDefault(require('lodash.isplainobject'));
var applyRanges = _interopDefault(require('ranges-apply'));
var pullAll = _interopDefault(require('lodash.pullall'));
var isEmpty = _interopDefault(require('ast-is-empty'));
var Ranges = _interopDefault(require('ranges-push'));
var uniq = _interopDefault(require('lodash.uniq'));
var matcher = _interopDefault(require('matcher'));

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

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

var version = "3.8.14";

var isArr = Array.isArray;
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
function comb(str, opts) {
  var start = Date.now();
  var finalIndexesToDelete = new Ranges({
    limitToBeAddedWhitespace: true
  });
  var currentChunksMinifiedSelectors = new Ranges();
  var lineBreaksToDelete = new Ranges();
  function characterSuitableForNames(_char) {
    return /[-_A-Za-z0-9]/.test(_char);
  }
  function hasOwnProp(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  }
  function existy(x) {
    return x != null;
  }
  function isStr(something) {
    return typeof something === "string";
  }
  function resetBodyClassOrId() {
    var initObj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return Object.assign({
      valuesStart: null,
      valueStart: null,
      nameStart: null
    }, initObj);
  }
  function isLatinLetter(_char2) {
    return typeof _char2 === "string" && _char2.length === 1 && (_char2.charCodeAt(0) > 64 && _char2.charCodeAt(0) < 91 || _char2.charCodeAt(0) > 96 && _char2.charCodeAt(0) < 123);
  }
  var i;
  var prevailingEOL;
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
  var headSelectorChunkStartedAt;
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
  var regexEmptyStyleTag = /[\n]?\s*<style[^>]*>\s*<\/style\s*>/g;
  var regexEmptyMediaQuery = /[\n]?\s*@(media|supports|document)[^{]*{\s*}/g;
  var regexEmptyUnclosedMediaQuery = /@media[^{@}]+{(?=\s*<\/style>)/g;
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
  if (isObj(opts) && hasOwnProp(opts, "backend") && isEmpty(opts.backend)) {
    opts.backend = [];
  }
  opts = Object.assign({}, defaults, opts);
  if (isStr(opts.whitelist)) {
    opts.whitelist = [opts.whitelist];
  }
  if (!isArr(opts.whitelist)) {
    throw new TypeError("email-remove-unused-css: [THROW_ID_03] opts.whitelist should be an array, but it was customised to a wrong thing, ".concat(JSON.stringify(opts.whitelist, null, 4)));
  }
  if (opts.whitelist.length > 0 && !opts.whitelist.every(function (el) {
    return isStr(el);
  })) {
    throw new TypeError("email-remove-unused-css: [THROW_ID_04] opts.whitelist array should contain only string-type elements. Currently we\x0Be got:\n".concat(JSON.stringify(opts.whitelist, null, 4)));
  }
  if (!isArr(opts.backend)) {
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
  if (isArr(opts.backend) && opts.backend.length) {
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
  var endingsCount = {
    n: 0,
    r: 0,
    rn: 0
  };
  var _loop = function _loop(round) {
    checkingInsideCurlyBraces = false;
    headSelectorChunkStartedAt = null;
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
        if (str[i - 1] === "\r") {
          if (round === 1) {
            endingsCount.rn++;
          }
        } else {
          if (round === 1) {
            endingsCount.n++;
          }
        }
      } else if (str[i] === "\r" && str[i + 1] !== "\n") {
        if (round === 1) {
          endingsCount.r++;
        }
      }
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
          continue stepouter;
        } else if (currentlyWithinQuotes === str[i]) {
          currentlyWithinQuotes = null;
        }
      }
      if (doNothing) {
        if (doNothingUntil === null || typeof doNothingUntil !== "string" || typeof doNothingUntil === "string" && doNothingUntil.length === 0) {
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
          continue stepouter;
        }
      }
      if (!doNothing && str[i] === "<" && str[i + 1] === "s" && str[i + 2] === "t" && str[i + 3] === "y" && str[i + 4] === "l" && str[i + 5] === "e") {
        checkingInsideCurlyBraces = true;
        if (!stateWithinStyleTag) {
          stateWithinStyleTag = true;
        }
        for (var y = i; y < len; y++) {
          totalCounter++;
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
        i++;
        continue stepouter;
      }
      if (!doNothing && stateWithinStyleTag && str[i] === "@") {
        if (whitespaceStartedAt) {
          whitespaceStartedAt = null;
        }
        var matchedAtTagsName = stringMatchLeftRight.matchRight(str, i, atRulesWhichMightWrapStyles) || stringMatchLeftRight.matchRight(str, i, atRulesWhichNeedToBeIgnored);
        if (matchedAtTagsName) {
          var temp = void 0;
          if (str[i + matchedAtTagsName.length + 1] === ";" || str[i + matchedAtTagsName.length + 1] && !str[i + matchedAtTagsName.length + 1].trim().length && stringMatchLeftRight.matchRight(str, i + matchedAtTagsName.length + 1, ";", {
            trimBeforeMatching: true,
            cb: function cb(_char3, theRemainderOfTheString, index) {
              temp = index;
              return true;
            }
          })) {
            finalIndexesToDelete.push(i, temp ? temp : i + matchedAtTagsName.length + 2);
          }
          var secondaryStopper = void 0;
          for (var z = i + 1; z < len; z++) {
            totalCounter++;
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
        headSelectorChunkStartedAt = null;
        selectorChunkCanBeDeleted = false;
        headWholeLineCanBeDeleted = true;
        singleSelectorStartedAt = null;
        lastKeptChunksCommaAt = null;
        onlyDeletedChunksFollow = false;
      }
      if (!doNothing && !commentStartedAt && styleStartedAt && i >= styleStartedAt && (
      styleEndedAt === null && i >= styleStartedAt ||
      styleStartedAt > styleEndedAt && styleStartedAt < i) && i >= beingCurrentlyAt && !insideCurlyBraces) {
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
          } else if (chr.trim().length !== 0) {
            if (chr === "}") {
              ruleChunkStartedAt = i + 1;
              currentChunk = null;
            } else if (chr === "<" && str[i + 1] === "!") {
              for (var _y = i; _y < len; _y++) {
                totalCounter++;
                if (str[_y] === ">") {
                  ruleChunkStartedAt = _y + 1;
                  headSelectorChunkStartedAt = _y + 1;
                  i = _y;
                  continue stepouter;
                }
              }
            }
          }
        } else {
          if (singleSelectorStartedAt !== null && !characterSuitableForNames(chr)) {
            var singleSelector = str.slice(singleSelectorStartedAt, i);
            if (singleSelectorType) {
              singleSelector = "".concat(singleSelectorType).concat(singleSelector);
              singleSelectorType = undefined;
            }
            if (round === 2 && !selectorChunkCanBeDeleted && headCssToDelete.includes(singleSelector)) {
              selectorChunkCanBeDeleted = true;
              onlyDeletedChunksFollow = true;
            } else if (round === 2 && !selectorChunkCanBeDeleted) {
              if (opts.uglify && (!isArr(opts.whitelist) || !opts.whitelist.length || !matcher([singleSelector], opts.whitelist).length)) {
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
        }
        if (headSelectorChunkStartedAt === null) {
          if (chr.trim().length !== 0 && chr !== "}" && chr !== ";" && !(str[i] === "/" && str[i + 1] === "*")) {
            selectorChunkCanBeDeleted = false;
            headSelectorChunkStartedAt = i;
          }
        } else {
          if (",{".includes(chr)) {
            var sliceTo = whitespaceStartedAt ? whitespaceStartedAt : i;
            currentChunk = str.slice(headSelectorChunkStartedAt, sliceTo);
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
            } else {
              if (selectorChunkCanBeDeleted) {
                var fromIndex = headSelectorChunkStartedAt;
                var toIndex = i;
                var tempFindingIndex = void 0;
                if (chr === "{" && str[fromIndex - 1] !== ">" && str[fromIndex - 1] !== "}") {
                  for (var _y2 = headSelectorChunkStartedAt; _y2--;) {
                    totalCounter++;
                    if (str[_y2].trim().length !== 0 && str[_y2] !== ",") {
                      fromIndex = _y2 + 1;
                      break;
                    }
                  }
                  if (str[i - 1].trim().length === 0) {
                    toIndex = i - 1;
                  }
                } else if (chr === "," && str[i + 1].trim().length === 0) {
                  for (var _y3 = i + 1; _y3 < len; _y3++) {
                    totalCounter++;
                    if (str[_y3].trim().length !== 0) {
                      toIndex = _y3;
                      break;
                    }
                  }
                } else if (stringMatchLeftRight.matchLeft(str, fromIndex, "{", {
                  trimBeforeMatching: true,
                  cb: function cb(_char4, theRemainderOfTheString, index) {
                    tempFindingIndex = index;
                    return true;
                  }
                })) {
                  fromIndex = tempFindingIndex + 2;
                }
                var resToPush = expander({
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
            }
            if (chr !== "{") {
              headSelectorChunkStartedAt = null;
            } else if (round === 2) {
              if (!headWholeLineCanBeDeleted && lastKeptChunksCommaAt !== null && onlyDeletedChunksFollow) {
                var deleteUpTo = lastKeptChunksCommaAt + 1;
                if ("\n\r".includes(str[lastKeptChunksCommaAt + 1])) {
                  for (var _y4 = lastKeptChunksCommaAt + 1; _y4 < len; _y4++) {
                    if (str[_y4].trim().length) {
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
        cb: function cb(_char5, theRemainderOfTheString, index) {
          if (round === 1) {
            if (_char5 !== undefined && (_char5.trim() === "" || _char5 === ">")) {
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
          totalCounter++;
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
      if (!doNothing && stateWithinBody && !stateWithinStyleTag && !currentlyWithinQuotes && str[i] === "c" && str[i + 1] === "l" && str[i + 2] === "a" && str[i + 3] === "s" && str[i + 4] === "s" && badChars.includes(str[i - 1])
      ) {
          var valuesStart = void 0;
          var quoteless = false;
          if (str[i + 5] === "=") {
            if (str[i + 6] === '"' || str[i + 6] === "'") {
              valuesStart = i + 7;
            } else if (characterSuitableForNames(str[i + 6])) {
              valuesStart = i + 6;
              quoteless = true;
            } else if (str[i + 6] && (!str[i + 6].trim().length || "/>".includes(str[i + 6]))) {
              var calculatedRange = expander({
                str: str,
                from: i,
                to: i + 6,
                ifRightSideIncludesThisThenCropTightly: "/>",
                wipeAllWhitespaceOnLeft: true
              });
              finalIndexesToDelete.push.apply(finalIndexesToDelete, _toConsumableArray(calculatedRange));
            }
          } else if (str[i + 5].trim().length === 0) {
            for (var _y6 = i + 5; _y6 < len; _y6++) {
              totalCounter++;
              if (str[_y6].trim().length) {
                if (str[_y6] === "=") {
                  if (_y6 > i + 5 && round === 1) {
                    finalIndexesToDelete.push(i + 5, _y6);
                  }
                  if ((str[_y6 + 1] === '"' || str[_y6 + 1] === "'") && str[_y6 + 2]) {
                    valuesStart = _y6 + 2;
                  } else if (str[_y6 + 1] && str[_y6 + 1].trim().length === 0) {
                    for (var _z = _y6 + 1; _z < len; _z++) {
                      totalCounter++;
                      if (str[_z].trim().length) {
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
                } else {
                  if (round === 1) {
                    var _calculatedRange = expander({
                      str: str,
                      from: i,
                      to: _y6 - 1,
                      ifRightSideIncludesThisThenCropTightly: "/>",
                      wipeAllWhitespaceOnLeft: true
                    });
                    finalIndexesToDelete.push.apply(finalIndexesToDelete, _toConsumableArray(_calculatedRange));
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
      if (!doNothing && stateWithinBody && !stateWithinStyleTag && !currentlyWithinQuotes && str[i] === "i" && str[i + 1] === "d" && badChars.includes(str[i - 1])
      ) {
          var _valuesStart = void 0;
          var _quoteless = false;
          if (str[i + 2] === "=") {
            if (str[i + 3] === '"' || str[i + 3] === "'") {
              _valuesStart = i + 4;
            } else if (characterSuitableForNames(str[i + 3])) {
              _valuesStart = i + 3;
              _quoteless = true;
            } else if (str[i + 3] && (!str[i + 3].trim().length || "/>".includes(str[i + 3]))) {
              var _calculatedRange2 = expander({
                str: str,
                from: i,
                to: i + 3,
                ifRightSideIncludesThisThenCropTightly: "/>",
                wipeAllWhitespaceOnLeft: true
              });
              finalIndexesToDelete.push.apply(finalIndexesToDelete, _toConsumableArray(_calculatedRange2));
            }
          } else if (str[i + 2].trim().length === 0) {
            for (var _y7 = i + 2; _y7 < len; _y7++) {
              totalCounter++;
              if (str[_y7].trim().length) {
                if (str[_y7] === "=") {
                  if (_y7 > i + 2 && round === 1) {
                    finalIndexesToDelete.push(i + 2, _y7);
                  }
                  if ((str[_y7 + 1] === '"' || str[_y7 + 1] === "'") && str[_y7 + 2]) {
                    _valuesStart = _y7 + 2;
                  } else if (str[_y7 + 1] && str[_y7 + 1].trim().length === 0) {
                    for (var _z2 = _y7 + 1; _z2 < len; _z2++) {
                      totalCounter++;
                      if (str[_z2].trim().length) {
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
                } else {
                  if (round === 1) {
                    var _calculatedRange3 = expander({
                      str: str,
                      from: i,
                      to: _y7 - 1,
                      ifRightSideIncludesThisThenCropTightly: "/>",
                      wipeAllWhitespaceOnLeft: true
                    });
                    finalIndexesToDelete.push.apply(finalIndexesToDelete, _toConsumableArray(_calculatedRange3));
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
              var _calculatedRange4 = expander({
                str: str,
                from: whitespaceStartedAt,
                to: i,
                ifLeftSideIncludesThisThenCropTightly: "\"'",
                ifRightSideIncludesThisThenCropTightly: "\"'"
              });
              finalIndexesToDelete.push.apply(finalIndexesToDelete, _toConsumableArray(_calculatedRange4));
              whitespaceStartedAt = null;
            } else if (whitespaceStartedAt) {
              whitespaceStartedAt = null;
            }
            var matchedHeads = stringMatchLeftRight.matchRightIncl(str, i, allHeads);
            var findings = opts.backend.find(function (headsTailsObj) {
              return headsTailsObj.heads === matchedHeads;
            });
            doNothingUntil = findings["tails"];
          })();
        } else if (characterSuitableForNames(chr)) {
          bodyClass.valueStart = i;
          if (round === 1) {
            if (bodyClass.quoteless) {
              finalIndexesToDelete.push(i, i, "\"");
            }
            if (bodyItsTheFirstClassOrId && bodyClass.valuesStart !== null && str.slice(bodyClass.valuesStart, i).trim().length === 0 && bodyClass.valuesStart < i) {
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
        var carvedClass = "".concat(str.slice(bodyClass.valueStart, i));
        if (round === 1) {
          bodyClassesArr.push(".".concat(carvedClass));
          if (bodyClass.quoteless) {
            if (!"\"'".includes(str[i])) {
              finalIndexesToDelete.push(i, i, "\"");
            }
          }
        } else {
          if (bodyClass.valueStart != null && bodyClassesToDelete.includes(carvedClass)) {
            var expandedRange = expander({
              str: str,
              from: bodyClass.valueStart,
              to: i,
              ifLeftSideIncludesThisThenCropTightly: "\"'",
              ifRightSideIncludesThisThenCropTightly: "\"'",
              wipeAllWhitespaceOnLeft: true
            });
            var whatToInsert = "";
            if (str[expandedRange[0] - 1] && str[expandedRange[0] - 1].trim().length && str[expandedRange[1]] && str[expandedRange[1]].trim().length && (allHeads || allTails) && (allHeads && stringMatchLeftRight.matchLeft(str, expandedRange[0], allTails) || allTails && stringMatchLeftRight.matchRightIncl(str, expandedRange[1], allHeads))) {
              whatToInsert = " ";
            }
            finalIndexesToDelete.push.apply(finalIndexesToDelete, _toConsumableArray(expandedRange).concat([whatToInsert]));
          } else {
            bodyClassOrIdCanBeDeleted = false;
            if (opts.uglify && !(isArr(opts.whitelist) && opts.whitelist.length && matcher([".".concat(carvedClass)], opts.whitelist).length)) {
              finalIndexesToDelete.push(bodyClass.valueStart, i, allClassesAndIdsWithinHeadFinalUglified[allClassesAndIdsWithinHeadFinal.indexOf(".".concat(carvedClass))].slice(1));
            }
          }
        }
        bodyClass.valueStart = null;
      }
      if (!doNothing && bodyId.valueStart !== null && i > bodyId.valueStart && (!characterSuitableForNames(chr) || allTails && stringMatchLeftRight.matchRightIncl(str, i, allTails))) {
        var carvedId = str.slice(bodyId.valueStart, i);
        if (round === 1) {
          bodyIdsArr.push("#".concat(carvedId));
          if (bodyId.quoteless) {
            if (!"\"'".includes(str[i])) {
              finalIndexesToDelete.push(i, i, "\"");
            }
          }
        } else {
          if (bodyId.valueStart != null && bodyIdsToDelete.includes(carvedId)) {
            var _expandedRange = expander({
              str: str,
              from: bodyId.valueStart,
              to: i,
              ifRightSideIncludesThisThenCropTightly: "\"'",
              wipeAllWhitespaceOnLeft: true
            });
            if (str[_expandedRange[0] - 1] && str[_expandedRange[0] - 1].trim().length && str[_expandedRange[1]] && str[_expandedRange[1]].trim().length && (allHeads || allTails) && (allHeads && stringMatchLeftRight.matchLeft(str, _expandedRange[0], allTails) || allTails && stringMatchLeftRight.matchRightIncl(str, _expandedRange[1], allHeads))) {
              _expandedRange[0] += 1;
            }
            finalIndexesToDelete.push.apply(finalIndexesToDelete, _toConsumableArray(_expandedRange));
          } else {
            bodyClassOrIdCanBeDeleted = false;
            if (opts.uglify && !(isArr(opts.whitelist) && opts.whitelist.length && matcher(["#".concat(carvedId)], opts.whitelist).length)) {
              finalIndexesToDelete.push(bodyId.valueStart, i, allClassesAndIdsWithinHeadFinalUglified[allClassesAndIdsWithinHeadFinal.indexOf("#".concat(carvedId))].slice(1));
            }
          }
        }
        bodyId.valueStart = null;
      }
      if (!doNothing && bodyClass.valuesStart != null && (!bodyClass.quoteless && (chr === "'" || chr === '"') || bodyClass.quoteless && !characterSuitableForNames(str[i])) && i >= bodyClass.valuesStart) {
        if (i === bodyClass.valuesStart) {
          if (round === 1) {
            finalIndexesToDelete.push.apply(finalIndexesToDelete, _toConsumableArray(expander({
              str: str,
              from: bodyClass.nameStart,
              to: i + 1,
              ifRightSideIncludesThisThenCropTightly: "/>",
              wipeAllWhitespaceOnLeft: true
            })));
          }
        } else {
          if (round === 2 && bodyClassOrIdCanBeDeleted) {
            var _expandedRange2 = expander({
              str: str,
              from: bodyClass.valuesStart - 7,
              to: i + 1,
              ifRightSideIncludesThisThenCropTightly: "/>",
              wipeAllWhitespaceOnLeft: true
            });
            var _whatToInsert = "";
            if (str[_expandedRange2[0] - 1] && str[_expandedRange2[0] - 1].trim().length && str[_expandedRange2[1]] && str[_expandedRange2[1]].trim().length && !"/>".includes(str[_expandedRange2[1]])
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
            finalIndexesToDelete.push.apply(finalIndexesToDelete, _toConsumableArray(expander({
              str: str,
              from: bodyId.nameStart,
              to: i + 1,
              ifRightSideIncludesThisThenCropTightly: "/>",
              wipeAllWhitespaceOnLeft: true
            })));
          }
        } else {
          if (round === 2 && bodyClassOrIdCanBeDeleted) {
            var _expandedRange3 = expander({
              str: str,
              from: bodyId.valuesStart - 4,
              to: i + 1,
              ifRightSideIncludesThisThenCropTightly: "/>",
              wipeAllWhitespaceOnLeft: true
            });
            var _whatToInsert2 = "";
            if (str[_expandedRange3[0] - 1] && str[_expandedRange3[0] - 1].trim().length && str[_expandedRange3[1]] && str[_expandedRange3[1]].trim().length && !"/>".includes(str[_expandedRange3[1]])
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
              var _calculatedRange5 = expander({
                str: str,
                from: whitespaceStartedAt,
                to: i,
                ifLeftSideIncludesThisThenCropTightly: "\"'",
                ifRightSideIncludesThisThenCropTightly: "\"'"
              });
              finalIndexesToDelete.push.apply(finalIndexesToDelete, _toConsumableArray(_calculatedRange5));
              whitespaceStartedAt = null;
            } else if (whitespaceStartedAt) {
              whitespaceStartedAt = null;
            }
            var matchedHeads = stringMatchLeftRight.matchRightIncl(str, i, allHeads);
            var findings = opts.backend.find(function (headsTailsObj) {
              return headsTailsObj.heads === matchedHeads;
            });
            doNothingUntil = findings["tails"];
          })();
        } else if (characterSuitableForNames(chr)) {
          bodyId.valueStart = i;
          if (round === 1) {
            if (bodyId.quoteless) {
              finalIndexesToDelete.push(i, i, "\"");
            }
            if (bodyItsTheFirstClassOrId && bodyId.valuesStart !== null && str.slice(bodyId.valuesStart, i).trim().length === 0 && bodyId.valuesStart < i) {
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
          if (opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains && isArr(opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains) && opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.length && opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.some(function (val) {
            return val.trim().length && str.slice(commentStartedAt, i).toLowerCase().includes(val);
          })) {
            canDelete = false;
          }
          usedOnce = true;
        }
        if (commentStartedAt !== null && str[i] === ">") {
          if (!bogusHTMLComment && str[i - 1] === "-" && str[i - 2] === "-") {
            var _calculatedRange6 = expander({
              str: str,
              from: commentStartedAt,
              to: i + 1,
              wipeAllWhitespaceOnLeft: true,
              addSingleSpaceToPreventAccidentalConcatenation: true
            });
            if (opts.removeHTMLComments && canDelete) {
              finalIndexesToDelete.push.apply(finalIndexesToDelete, _toConsumableArray(_calculatedRange6));
            }
            commentsLength += _calculatedRange6[1] - _calculatedRange6[0];
            commentStartedAt = null;
            bogusHTMLComment = undefined;
          } else if (bogusHTMLComment) {
            var _calculatedRange7 = expander({
              str: str,
              from: commentStartedAt,
              to: i + 1,
              wipeAllWhitespaceOnLeft: true,
              addSingleSpaceToPreventAccidentalConcatenation: true
            });
            if (opts.removeHTMLComments && canDelete) {
              finalIndexesToDelete.push.apply(finalIndexesToDelete, _toConsumableArray(_calculatedRange7));
            }
            commentsLength += _calculatedRange7[1] - _calculatedRange7[0];
            commentStartedAt = null;
            bogusHTMLComment = undefined;
          }
        }
        if (opts.removeHTMLComments && commentStartedAt === null && str[i] === "<" && str[i + 1] === "!") {
          if ((!allHeads || isArr(allHeads) && allHeads.length && !allHeads.includes("<!")) && (!allTails || isArr(allTails) && allTails.length && !allTails.includes("<!"))) {
            if (!stringMatchLeftRight.matchRight(str, i + 1, "doctype", {
              i: true,
              trimBeforeMatching: true
            }) && !(str[i + 2] === "-" && str[i + 3] === "-" && isArr(opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains) && opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.length && stringMatchLeftRight.matchRight(str, i + 3, opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains, {
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
        curliesDepth--;
      }
      if (!doNothing && chr === "{" && checkingInsideCurlyBraces) {
        if (!insideCurlyBraces) {
          insideCurlyBraces = true;
          if (whitespaceStartedAt !== null && (str.slice(whitespaceStartedAt, i).includes("\n") || str.slice(whitespaceStartedAt, i).includes("\r"))) {
            finalIndexesToDelete.push(whitespaceStartedAt, i);
          }
        } else {
          curliesDepth++;
        }
      }
      if (!doNothing) {
        if (!str[i].trim().length) {
          if (whitespaceStartedAt === null) {
            whitespaceStartedAt = i;
          }
        } else if (whitespaceStartedAt !== null) {
          whitespaceStartedAt = null;
        }
      }
      if (!doNothing && round === 2 && isArr(round1RangesClone) && round1RangesClone.length && i === round1RangesClone[0][0]) {
        var _temp = round1RangesClone.shift();
        if (_temp[1] - 1 > i) {
          i = _temp[1] - 1;
        }
        continue stepouter;
      }
      if (commentNearlyStartedAt !== null && str[i] === ">") {
        commentNearlyStartedAt = null;
        var _temp2 = void 0;
        if (opts.removeHTMLComments && isArr(opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains) && opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.length && (opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.some(function (val) {
          return val.includes("if");
        }) || opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.some(function (val) {
          return val.includes("mso");
        }) || opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.some(function (val) {
          return val.includes("ie");
        })) && stringMatchLeftRight.matchRight(str, i, "<!--", {
          trimBeforeMatching: true,
          cb: function cb(_char6, theRemainderOfTheString, index) {
            _temp2 = index;
            return true;
          }
        })) {
          if (stringMatchLeftRight.matchRight(str, _temp2 - 1, "-->", {
            trimBeforeMatching: true,
            cb: function cb(_char7, theRemainderOfTheString, index) {
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
      allClassesAndIdsWithinBody = uniq(bodyClassesArr.concat(bodyIdsArr).sort());
      headSelectorsArr.forEach(function (el) {
        extract(el).forEach(function (selector) {
          if (Object.prototype.hasOwnProperty.call(headSelectorsCount, selector)) {
            headSelectorsCount[selector] += 1;
          } else {
            headSelectorsCount[selector] = 1;
          }
        });
      });
      headSelectorsCountClone = Object.assign({}, headSelectorsCount);
      allClassesAndIdsWithinHead = uniq(headSelectorsArr.reduce(function (arr, el) {
        return arr.concat(extract(el));
      }, [])).sort();
      countBeforeCleaning = allClassesAndIdsWithinHead.length;
      var preppedHeadSelectorsArr = Array.from(headSelectorsArr);
      var deletedFromHeadArr = [];
      for (var _y8 = 0, len2 = preppedHeadSelectorsArr.length; _y8 < len2; _y8++) {
        totalCounter++;
        var _temp3 = void 0;
        if (existy(preppedHeadSelectorsArr[_y8])) {
          _temp3 = extract(preppedHeadSelectorsArr[_y8]);
        }
        if (!_temp3.every(function (el) {
          return allClassesAndIdsWithinBody.includes(el);
        })) {
          var _deletedFromHeadArr;
          (_deletedFromHeadArr = deletedFromHeadArr).push.apply(_deletedFromHeadArr, _toConsumableArray(extract(preppedHeadSelectorsArr[_y8])));
          preppedHeadSelectorsArr.splice(_y8, 1);
          _y8 -= 1;
          len2 -= 1;
        }
      }
      deletedFromHeadArr = uniq(pullAllWithGlob(deletedFromHeadArr, opts.whitelist));
      var preppedAllClassesAndIdsWithinHead;
      if (preppedHeadSelectorsArr.length > 0) {
        preppedAllClassesAndIdsWithinHead = preppedHeadSelectorsArr.reduce(function (arr, el) {
          return arr.concat(extract(el));
        }, []);
      } else {
        preppedAllClassesAndIdsWithinHead = [];
      }
      headCssToDelete = pullAllWithGlob(pullAll(uniq(Array.from(allClassesAndIdsWithinHead)), bodyClassesArr.concat(bodyIdsArr)), opts.whitelist);
      bodyCssToDelete = uniq(pullAllWithGlob(pullAll(bodyClassesArr.concat(bodyIdsArr), preppedAllClassesAndIdsWithinHead), opts.whitelist));
      headCssToDelete = uniq(headCssToDelete.concat(intersection(deletedFromHeadArr, bodyCssToDelete))).sort();
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
      bodyClassesToDelete = uniq(bodyClassesToDelete.concat(intersection(pullAllWithGlob(allClassesAndIdsWithinBody, opts.whitelist), allClassesAndIdsThatWereCompletelyDeletedFromHead).filter(function (val) {
        return val[0] === ".";
      })
      .map(function (val) {
        return val.slice(1);
      })));
      var allClassesAndIdsWithinBodyThatWereWhitelisted = matcher(allClassesAndIdsWithinBody, opts.whitelist);
      bodyCssToDelete = uniq(bodyCssToDelete.concat(bodyClassesToDelete.map(function (val) {
        return ".".concat(val);
      }), bodyIdsToDelete.map(function (val) {
        return "#".concat(val);
      }))).sort();
      allClassesAndIdsWithinHeadFinal = pullAll(pullAll(Array.from(allClassesAndIdsWithinHead), bodyCssToDelete), headCssToDelete);
      if (isArr(allClassesAndIdsWithinBodyThatWereWhitelisted) && allClassesAndIdsWithinBodyThatWereWhitelisted.length) {
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
          return matcher.isMatch(arr[0], whitelistVal);
        });
      }) : null;
      if (finalIndexesToDelete.current()) {
        round1RangesClone = Array.from(finalIndexesToDelete.current());
      } else {
        round1RangesClone = null;
      }
      if (endingsCount.rn > endingsCount.r && endingsCount.rn > endingsCount.n) {
        prevailingEOL = "\r\n";
      } else if (endingsCount.r > endingsCount.rn && endingsCount.r > endingsCount.n) {
        prevailingEOL = "\r";
      } else {
        prevailingEOL = "\n";
      }
    } else if (round === 2) {
      if (!"\r\n".includes(str[len - 1])) {
        finalIndexesToDelete.push(len, len, prevailingEOL);
      }
    }
  };
  for (var round = 1; round <= 2; round++) {
    _loop(round);
  }
  finalIndexesToDelete.push(lineBreaksToDelete.current());
  if (str.length && finalIndexesToDelete.current()) {
    str = applyRanges(str, finalIndexesToDelete.current());
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
  str = str.replace(emptyCondCommentRegex(), "");
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
  tempLen = str.length;
  str = str.replace(/(\r?\n|\r)*[ ]*(\r?\n|\r)+/g, prevailingEOL);
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
    if ((!str[0].trim().length || !str[str.length - 1].trim().length) && str.length !== str.trim().length) {
      nonIndentationsWhitespaceLength += str.length - str.trim().length;
    }
    str = "".concat(str.trim()).concat(prevailingEOL);
  }
  str = str.replace(/ ((class|id)=["']) /g, " $1");
  return {
    log: {
      timeTakenInMiliseconds: Date.now() - start,
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
    allInHead: allClassesAndIdsWithinHead,
    allInBody: allClassesAndIdsWithinBody,
    deletedFromHead: headCssToDelete.sort(),
    deletedFromBody: bodyCssToDelete.sort()
  };
}

exports.comb = comb;
exports.defaults = defaults;
exports.version = version;
