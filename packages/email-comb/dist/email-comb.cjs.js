/**
 * @name email-comb
 * @fileoverview Remove unused CSS from email templates
 * @version 5.0.16
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/email-comb/}
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _toConsumableArray = require('@babel/runtime/helpers/toConsumableArray');
var _typeof = require('@babel/runtime/helpers/typeof');
var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var stringMatchLeftRight = require('string-match-left-right');
var regexEmptyConditionalComments = require('regex-empty-conditional-comments');
var stringExtractClassNames = require('string-extract-class-names');
var arrayPullAllWithGlob = require('array-pull-all-with-glob');
var stringLeftRight = require('string-left-right');
var intersection = require('lodash.intersection');
var stringRangeExpander = require('string-range-expander');
var stringUglify = require('string-uglify');
var rangesApply = require('ranges-apply');
var pullAll = require('lodash.pullall');
var htmlCrush = require('html-crush');
var rangesPush = require('ranges-push');
var uniq = require('lodash.uniq');
var matcher = require('matcher');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _toConsumableArray__default = /*#__PURE__*/_interopDefaultLegacy(_toConsumableArray);
var _typeof__default = /*#__PURE__*/_interopDefaultLegacy(_typeof);
var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);
var intersection__default = /*#__PURE__*/_interopDefaultLegacy(intersection);
var pullAll__default = /*#__PURE__*/_interopDefaultLegacy(pullAll);
var uniq__default = /*#__PURE__*/_interopDefaultLegacy(uniq);
var matcher__default = /*#__PURE__*/_interopDefaultLegacy(matcher);

var version$1 = "5.0.16";

var regexEmptyStyleTag = /[\n]?\s*<style[^>]*>\s*<\/style\s*>/g;
var regexEmptyMediaQuery = /[\n]?\s*@(media|supports|document)[^{]*{\s*}/g;
var regexEmptyUnclosedMediaQuery = /@media[^{@}]+{(?=\s*<\/style>)/g;
function isObj(something) {
  return something && _typeof__default['default'](something) === "object" && !Array.isArray(something);
}
function hasOwnProp(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
function isLatinLetter(_char) {
  return typeof _char === "string" && _char.length === 1 && (_char.charCodeAt(0) > 64 && _char.charCodeAt(0) < 91 || _char.charCodeAt(0) > 96 && _char.charCodeAt(0) < 123);
}

var version = version$1;
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
function comb(str, originalOpts) {
  var start = Date.now();
  var finalIndexesToDelete = new rangesPush.Ranges({
    limitToBeAddedWhitespace: true
  });
  var currentChunksMinifiedSelectors = new rangesPush.Ranges();
  var lineBreaksToDelete = new rangesPush.Ranges();
  function characterSuitableForNames(_char2) {
    return /[-_A-Za-z0-9]/.test(_char2);
  }
  function resetBodyClassOrId() {
    var initObj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return _objectSpread__default['default']({
      valuesStart: null,
      valueStart: null,
      nameStart: null,
      quoteless: false
    }, initObj);
  }
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
  var uglified = null;
  var allClassesAndIdsWithinHeadFinalUglified = [];
  var countAfterCleaning = 0;
  var countBeforeCleaning = 0;
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
    throw new TypeError("email-comb: [THROW_ID_01] Input must be string! Currently it's ".concat(_typeof__default['default'](str)));
  }
  if (originalOpts && !isObj(originalOpts)) {
    throw new TypeError("email-comb: [THROW_ID_02] Options, second input argument, must be a plain object! Currently it's ".concat(_typeof__default['default'](originalOpts), ", equal to: ").concat(JSON.stringify(originalOpts, null, 4)));
  }
  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), originalOpts);
  if (typeof opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains === "string") {
    opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains = [opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains].filter(function (val) {
      return val.trim();
    });
  }
  if (typeof opts.whitelist === "string") {
    opts.whitelist = [opts.whitelist];
  } else if (!Array.isArray(opts.whitelist)) {
    throw new TypeError("email-comb: [THROW_ID_03] opts.whitelist should be an array, but it was customised to a wrong thing, ".concat(JSON.stringify(opts.whitelist, null, 4)));
  }
  if (opts.whitelist.length > 0 && !opts.whitelist.every(function (el) {
    return typeof el === "string";
  })) {
    throw new TypeError("email-comb: [THROW_ID_04] opts.whitelist array should contain only string-type elements. Currently we\x0Be got:\n".concat(JSON.stringify(opts.whitelist, null, 4)));
  }
  if (!Array.isArray(opts.backend)) {
    throw new TypeError("email-comb: [THROW_ID_05] opts.backend should be an array, but it was customised to a wrong thing, ".concat(JSON.stringify(opts.backend, null, 4)));
  }
  if (opts.backend.length > 0 && opts.backend.some(function (val) {
    return !isObj(val);
  })) {
    throw new TypeError("email-comb: [THROW_ID_06] opts.backend array should contain only plain objects but it contains something else:\n".concat(JSON.stringify(opts.backend, null, 4)));
  }
  if (opts.backend.length > 0 && !opts.backend.every(function (obj) {
    return hasOwnProp(obj, "heads") && hasOwnProp(obj, "tails");
  })) {
    throw new TypeError("email-comb: [THROW_ID_07] every object within opts.backend should contain keys \"heads\" and \"tails\" but currently it's not the case. Whole \"opts.backend\" value array is currently equal to:\n".concat(JSON.stringify(opts.backend, null, 4)));
  }
  if (typeof opts.uglify !== "boolean") {
    if (opts.uglify === 1 || opts.uglify === 0) {
      opts.uglify = !!opts.uglify;
    } else {
      throw new TypeError("email-comb: [THROW_ID_08] opts.uglify should be a Boolean. Currently it's set to: ".concat(JSON.stringify(opts.uglify, null, 4), "}"));
    }
  }
  if (opts.reportProgressFunc && typeof opts.reportProgressFunc !== "function") {
    throw new TypeError("email-comb: [THROW_ID_09] opts.reportProgressFunc should be a function but it was given as :\n".concat(JSON.stringify(opts.reportProgressFunc, null, 4), " (").concat(_typeof__default['default'](opts.reportProgressFunc), ")"));
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
  var ceil = 1;
  if (opts.reportProgressFunc) {
    ceil = Math.floor((opts.reportProgressFuncTo - (opts.reportProgressFuncTo - opts.reportProgressFuncFrom) * leavePercForLastStage - opts.reportProgressFuncFrom) / 2);
  }
  var trailingLinebreakLengthCorrection = 0;
  if (!str.length || !"\r\n".includes(str[str.length - 1])) {
    trailingLinebreakLengthCorrection = 1;
  }
  var doNothing;
  var doNothingUntil;
  var allClassesAndIdsThatWereCompletelyDeletedFromHead = [];
  var allClassesAndIdsWithinHeadFinal = [];
  var allClassesAndIdsWithinHead = [];
  var allClassesAndIdsWithinBody = [];
  var headSelectorsCountClone = {};
  var currentPercentageDone;
  var stateWithinStyleTag;
  var currentlyWithinQuotes;
  var whitespaceStartedAt;
  var bodyClassesToDelete = [];
  var lastPercentage = 0;
  var stateWithinBody;
  var bodyIdsToDelete = [];
  var bodyCssToDelete = [];
  var headCssToDelete = [];
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
    lastKeptChunksCommaAt = null;
    currentlyWithinQuotes = null;
    stateWithinStyleTag = false;
    whitespaceStartedAt = null;
    insideCurlyBraces = false;
    ruleChunkStartedAt = null;
    stateWithinBody = false;
    commentStartedAt = null;
    doNothingUntil = null;
    styleStartedAt = null;
    bodyStartedAt = null;
    currentChunk = null;
    styleEndedAt = null;
    doNothing = false;
    totalCounter += len;
    var _loop2 = function _loop2(_i) {
      if (opts.reportProgressFunc) {
        if (len > 1000 && len < 2000) {
          if (round === 1 && _i === 0) {
            opts.reportProgressFunc(Math.floor((opts.reportProgressFuncTo - opts.reportProgressFuncFrom) / 2)
            );
          }
        } else if (len >= 2000) {
          currentPercentageDone = opts.reportProgressFuncFrom + Math.floor(_i / len * ceil) + (round === 1 ? 0 : ceil);
          if (currentPercentageDone !== lastPercentage) {
            lastPercentage = currentPercentageDone;
            opts.reportProgressFunc(currentPercentageDone);
          }
        }
      }
      var chr = str[_i];
      if (str[_i] === "\n") {
        if (str[_i - 1] === "\r") ;
      } else if (str[_i] === "\r" && str[_i + 1] !== "\n") ;
      if (stateWithinStyleTag !== true && (
      styleEndedAt === null && styleStartedAt !== null && _i >= styleStartedAt ||
      styleStartedAt !== null && styleEndedAt !== null && styleStartedAt > styleEndedAt && styleStartedAt < _i)) {
        stateWithinStyleTag = true;
        stateWithinBody = false;
      } else if (stateWithinBody !== true && bodyStartedAt !== null && (styleStartedAt === null || styleStartedAt < _i) && (styleEndedAt === null || styleEndedAt < _i)) {
        stateWithinBody = true;
        stateWithinStyleTag = false;
      }
      if (!doNothing && (str[_i] === '"' || str[_i] === "'")) {
        if (!currentlyWithinQuotes) {
          var leftSideIdx = stringLeftRight.left(str, _i);
          if (typeof leftSideIdx === "number" && (stateWithinStyleTag && ["(", ",", ":"].includes(str[leftSideIdx]) || stateWithinBody && !stateWithinStyleTag && ["(", ",", ":", "="].includes(str[leftSideIdx]))) {
            currentlyWithinQuotes = str[_i];
          }
        } else if (str[_i] === "\"" && str[stringLeftRight.right(str, _i)] === "'" && str[stringLeftRight.right(str, stringLeftRight.right(str, _i))] === "\"" || str[_i] === "'" && str[stringLeftRight.right(str, _i)] === "\"" && str[stringLeftRight.right(str, stringLeftRight.right(str, _i))] === "'") {
          _i = stringLeftRight.right(str, stringLeftRight.right(str, _i));
          i = _i;
          return "continue";
        } else if (currentlyWithinQuotes === str[_i]) {
          currentlyWithinQuotes = null;
        }
      }
      if (doNothing) {
        if (doNothingUntil === null || typeof doNothingUntil !== "string" || typeof doNothingUntil === "string" && !doNothingUntil) {
          doNothing = false;
        } else if (stringMatchLeftRight.matchRightIncl(str, _i, doNothingUntil)) {
          if (commentStartedAt !== null) {
            if (round === 1 && opts.removeCSSComments) {
              var lineBreakPresentOnTheLeft = stringMatchLeftRight.matchLeft(str, commentStartedAt, ["\r\n", "\n", "\r"]);
              var startingIndex = commentStartedAt;
              if (typeof lineBreakPresentOnTheLeft === "string" && lineBreakPresentOnTheLeft.length) {
                startingIndex -= lineBreakPresentOnTheLeft.length;
              }
              if (str[startingIndex - 1] && characterSuitableForNames(str[startingIndex - 1]) && str[_i + doNothingUntil.length] && characterSuitableForNames(str[_i + doNothingUntil.length])) {
                finalIndexesToDelete.push(startingIndex, _i + doNothingUntil.length, ";");
                commentsLength += _i + doNothingUntil.length - startingIndex;
              } else {
                finalIndexesToDelete.push(startingIndex, _i + doNothingUntil.length);
                commentsLength += _i + doNothingUntil.length - startingIndex;
              }
            }
            commentStartedAt = null;
          }
          _i = _i + doNothingUntil.length - 1;
          doNothingUntil = null;
          doNothing = false;
          i = _i;
          return "continue";
        }
      }
      if (!doNothing && str[_i] === "<" && str[_i + 1] === "s" && str[_i + 2] === "t" && str[_i + 3] === "y" && str[_i + 4] === "l" && str[_i + 5] === "e") {
        checkingInsideCurlyBraces = true;
        if (!stateWithinStyleTag) {
          stateWithinStyleTag = true;
        }
        for (var _y = _i; _y < len; _y++) {
          totalCounter += 1;
          if (str[_y] === ">") {
            styleStartedAt = _y + 1;
            ruleChunkStartedAt = _y + 1;
            break;
          }
        }
      }
      if (!doNothing && stateWithinStyleTag && str[_i] === "<" && str[_i + 1] === "/" && str[_i + 2] === "s" && str[_i + 3] === "t" && str[_i + 4] === "y" && str[_i + 5] === "l" && str[_i + 6] === "e") {
        styleEndedAt = _i - 1;
        ruleChunkStartedAt = null;
        checkingInsideCurlyBraces = false;
        if (stateWithinStyleTag) {
          stateWithinStyleTag = false;
        }
      }
      if (round === 1 && (stateWithinStyleTag || stateWithinBody) && str[_i] === "/" && str[_i + 1] === "*" && commentStartedAt === null) {
        commentStartedAt = _i;
        doNothing = true;
        doNothingUntil = "*/";
        _i += 1;
        i = _i;
        return "continue";
      }
      if (!doNothing && stateWithinStyleTag && str[_i] === "@") {
        if (whitespaceStartedAt) {
          whitespaceStartedAt = null;
        }
        var matchedAtTagsName = stringMatchLeftRight.matchRight(str, _i, atRulesWhichMightWrapStyles) || stringMatchLeftRight.matchRight(str, _i, atRulesWhichNeedToBeIgnored);
        if (typeof matchedAtTagsName === "string") {
          var _temp;
          if (str[_i + matchedAtTagsName.length + 1] === ";" || str[_i + matchedAtTagsName.length + 1] && !str[_i + matchedAtTagsName.length + 1].trim() && stringMatchLeftRight.matchRight(str, _i + matchedAtTagsName.length + 1, ";", {
            trimBeforeMatching: true,
            cb: function cb(_char, _theRemainderOfTheString, index) {
              _temp = index;
              i = _i;
              return true;
            }
          })) {
            finalIndexesToDelete.push(_i, _temp || _i + matchedAtTagsName.length + 2);
          }
          var secondaryStopper;
          for (var z = _i + 1; z < len; z++) {
            totalCounter += 1;
            var espTails = "";
            if (str[z] === "{" && str[z + 1] === "{") {
              espTails = "}}";
            }
            if (str[z] === "{" && str[z + 1] === "%") {
              espTails = "%}";
            }
            if (espTails && str.includes(espTails, z + 1)) {
              z = str.indexOf(espTails, z + 1) + espTails.length - 1;
              continue;
            } else if (espTails) {
              espTails = "";
            }
            if (secondaryStopper && str[z] === secondaryStopper) {
              if (str[z] === "}" && atRulesWhichNeedToBeIgnored.includes(matchedAtTagsName) || str[z] === "{" && atRulesWhichMightWrapStyles.includes(matchedAtTagsName)) {
                _i = z;
                ruleChunkStartedAt = z + 1;
                i = _i;
                return "continue|stepouter";
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
                _i = z;
                i = _i;
                return "continue|stepouter";
              } else if (str[z] === "@" || str[z] === "<") {
                if (round === 1 && !str.slice(_i, z).includes("{") && !str.slice(_i, z).includes("(") && !str.slice(_i, z).includes('"') && !str.slice(_i, z).includes("'")) {
                  pushRangeFrom = _i;
                  pushRangeTo = z + (str[z] === ";" ? 1 : 0);
                  finalIndexesToDelete.push(pushRangeFrom, pushRangeTo);
                }
              }
              var iOffset = pushRangeTo ? pushRangeTo - 1 : z - 1 + (str[z] === "{" ? 1 : 0);
              _i = iOffset;
              ruleChunkStartedAt = iOffset + 1;
              i = _i;
              return "continue|stepouter";
            }
          }
        }
      }
      if (!doNothing && stateWithinStyleTag && insideCurlyBraces && checkingInsideCurlyBraces && chr === "}" && !currentlyWithinQuotes && !curliesDepth) {
        if (round === 2 && headWholeLineCanBeDeleted && ruleChunkStartedAt) {
          finalIndexesToDelete.push(ruleChunkStartedAt, _i + 1);
        }
        insideCurlyBraces = false;
        if (ruleChunkStartedAt) {
          ruleChunkStartedAt = _i + 1;
        }
        selectorChunkStartedAt = null;
        selectorChunkCanBeDeleted = false;
        headWholeLineCanBeDeleted = true;
        singleSelectorStartedAt = null;
        lastKeptChunksCommaAt = null;
        onlyDeletedChunksFollow = false;
      }
      if (!doNothing && !commentStartedAt && styleStartedAt && _i >= styleStartedAt && (
      styleEndedAt === null && _i >= styleStartedAt ||
      styleEndedAt && styleStartedAt > styleEndedAt && styleStartedAt <= _i) && !insideCurlyBraces) {
        if (singleSelectorStartedAt === null) {
          if (chr === "." || chr === "#") {
            singleSelectorStartedAt = _i;
          } else if (stringMatchLeftRight.matchLeft(str, _i, "[class=")) {
            if (isLatinLetter(chr)) {
              singleSelectorStartedAt = _i;
              singleSelectorType = ".";
            } else if ("\"'".includes(chr) && isLatinLetter(str[stringLeftRight.right(str, _i)])) {
              singleSelectorStartedAt = stringLeftRight.right(str, _i);
              singleSelectorType = ".";
            }
          } else if (stringMatchLeftRight.matchLeft(str, _i, "[id=")) {
            if (isLatinLetter(chr)) {
              singleSelectorStartedAt = _i;
              singleSelectorType = "#";
            } else if ("\"'".includes(chr) && isLatinLetter(str[stringLeftRight.right(str, _i)])) {
              singleSelectorStartedAt = stringLeftRight.right(str, _i);
              singleSelectorType = "#";
            }
          } else if (chr.trim()) {
            if (chr === "}") {
              ruleChunkStartedAt = _i + 1;
              currentChunk = null;
            } else if (chr === "<" && str[_i + 1] === "!") {
              for (var _y2 = _i; _y2 < len; _y2++) {
                totalCounter += 1;
                if (str[_y2] === ">") {
                  ruleChunkStartedAt = _y2 + 1;
                  selectorChunkStartedAt = _y2 + 1;
                  _i = _y2;
                  i = _i;
                  return "continue|stepouter";
                }
              }
            }
          }
        }
        else if (singleSelectorStartedAt !== null && !characterSuitableForNames(chr)) {
            var singleSelector = str.slice(singleSelectorStartedAt, _i);
            if (singleSelectorType) {
              singleSelector = "".concat(singleSelectorType).concat(singleSelector);
              singleSelectorType = undefined;
            }
            if (round === 2 && !selectorChunkCanBeDeleted && headCssToDelete.includes(singleSelector)) {
              selectorChunkCanBeDeleted = true;
              onlyDeletedChunksFollow = true;
            } else if (round === 2 && !selectorChunkCanBeDeleted) {
              if (opts.uglify && (!Array.isArray(opts.whitelist) || !opts.whitelist.length || !matcher__default['default']([singleSelector], opts.whitelist).length)) {
                currentChunksMinifiedSelectors.push(singleSelectorStartedAt, _i, allClassesAndIdsWithinHeadFinalUglified[allClassesAndIdsWithinHeadFinal.indexOf(singleSelector)]);
              }
              if (chr === ",") {
                lastKeptChunksCommaAt = _i;
                onlyDeletedChunksFollow = false;
              }
            }
            if (chr === "." || chr === "#") {
              singleSelectorStartedAt = _i;
            } else {
              singleSelectorStartedAt = null;
            }
          }
        if (selectorChunkStartedAt === null) {
          if (chr.trim() && chr !== "}" && chr !== ";" && !(str[_i] === "/" && str[_i + 1] === "*")) {
            selectorChunkCanBeDeleted = false;
            selectorChunkStartedAt = _i;
          }
        }
        else if (",{".includes(chr)) {
            var sliceTo = whitespaceStartedAt || _i;
            currentChunk = str.slice(selectorChunkStartedAt, sliceTo);
            if (round === 1) {
              if (whitespaceStartedAt) {
                if (chr === "," && whitespaceStartedAt < _i) {
                  finalIndexesToDelete.push(whitespaceStartedAt, _i);
                  nonIndentationsWhitespaceLength += _i - whitespaceStartedAt;
                } else if (chr === "{" && whitespaceStartedAt < _i - 1) {
                  finalIndexesToDelete.push(whitespaceStartedAt, _i - 1);
                  nonIndentationsWhitespaceLength += _i - 1 - whitespaceStartedAt;
                }
              }
              headSelectorsArr.push(currentChunk);
            }
            else if (selectorChunkCanBeDeleted) {
                var fromIndex = selectorChunkStartedAt;
                var toIndex = _i;
                var tempFindingIndex = 0;
                if (chr === "{" && str[fromIndex - 1] !== ">" && str[fromIndex - 1] !== "}") {
                  for (var _y3 = selectorChunkStartedAt; _y3--;) {
                    totalCounter += 1;
                    if (str[_y3].trim() && str[_y3] !== ",") {
                      fromIndex = _y3 + 1;
                      break;
                    }
                  }
                  if (!str[_i - 1].trim()) {
                    toIndex = _i - 1;
                  }
                } else if (chr === "," && !str[_i + 1].trim()) {
                  for (var _y4 = _i + 1; _y4 < len; _y4++) {
                    totalCounter += 1;
                    if (str[_y4].trim()) {
                      toIndex = _y4;
                      break;
                    }
                  }
                } else if (stringMatchLeftRight.matchLeft(str, fromIndex, "{", {
                  trimBeforeMatching: true,
                  cb: function cb(_char, _theRemainderOfTheString, index) {
                    tempFindingIndex = index;
                    i = _i;
                    return true;
                  }
                })) {
                  fromIndex = tempFindingIndex + 2;
                }
                var resToPush = stringRangeExpander.expander({
                  str: str,
                  from: fromIndex,
                  to: toIndex,
                  ifRightSideIncludesThisThenCropTightly: ".#",
                  ifRightSideIncludesThisCropItToo: ",",
                  extendToOneSide: "right"
                });
                finalIndexesToDelete.push.apply(finalIndexesToDelete, _toConsumableArray__default['default'](resToPush));
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
                  for (var _y5 = lastKeptChunksCommaAt + 1; _y5 < len; _y5++) {
                    if (str[_y5].trim()) {
                      deleteUpTo = _y5;
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
      if (!doNothing && !stateWithinStyleTag && stateWithinBody && str[_i] === "/" && stringMatchLeftRight.matchRight(str, _i, "body", {
        trimBeforeMatching: true,
        i: true
      }) && stringMatchLeftRight.matchLeft(str, _i, "<", {
        trimBeforeMatching: true
      })) {
        stateWithinBody = false;
        bodyStartedAt = null;
      }
      if (!doNothing && str[_i] === "<" && stringMatchLeftRight.matchRight(str, _i, "body", {
        i: true,
        trimBeforeMatching: true,
        cb: function cb(_char3, _theRemainderOfTheString, index) {
          if (round === 1) {
            if (_char3 !== undefined && (_char3.trim() === "" || _char3 === ">") && typeof index === "number") {
              if (index - _i > 5) {
                finalIndexesToDelete.push(_i, index, "<body");
                nonIndentationsWhitespaceLength += index - _i - 5;
              } else {
                i = _i;
                return true;
              }
            }
            i = _i;
            return true;
          }
          i = _i;
          return true;
        }
      })) {
        for (var _y6 = _i; _y6 < len; _y6++) {
          totalCounter += 1;
          if (str[_y6] === ">") {
            bodyStartedAt = _y6 + 1;
            break;
          }
        }
      }
      if (!doNothing && stateWithinBody && !stateWithinStyleTag && str[_i] === "s" && str[_i + 1] === "t" && str[_i + 2] === "y" && str[_i + 3] === "l" && str[_i + 4] === "e" && str[_i + 5] === "=" && badChars.includes(str[_i - 1])
      ) {
          if ("\"'".includes(str[_i + 6])) ;
        }
      if (!doNothing && stateWithinBody && !stateWithinStyleTag && !currentlyWithinQuotes && str[_i] === "c" && str[_i + 1] === "l" && str[_i + 2] === "a" && str[_i + 3] === "s" && str[_i + 4] === "s" &&
      str[_i - 1] &&
      !str[_i - 1].trim()) {
        var valuesStart;
        var quoteless = false;
        if (str[_i + 5] === "=") {
          if (str[_i + 6] === '"' || str[_i + 6] === "'") {
            valuesStart = _i + 7;
          } else if (characterSuitableForNames(str[_i + 6])) {
            valuesStart = _i + 6;
            quoteless = true;
          } else if (str[_i + 6] && (!str[_i + 6].trim() || "/>".includes(str[_i + 6]))) {
            var calculatedRange = stringRangeExpander.expander({
              str: str,
              from: _i,
              to: _i + 6,
              ifRightSideIncludesThisThenCropTightly: "/>",
              wipeAllWhitespaceOnLeft: true
            });
            finalIndexesToDelete.push.apply(finalIndexesToDelete, _toConsumableArray__default['default'](calculatedRange));
          }
        } else if (!str[_i + 5].trim()) {
          for (var _y7 = _i + 5; _y7 < len; _y7++) {
            totalCounter += 1;
            if (str[_y7].trim()) {
              if (str[_y7] === "=") {
                if (_y7 > _i + 5 && round === 1) {
                  finalIndexesToDelete.push(_i + 5, _y7);
                }
                if ((str[_y7 + 1] === '"' || str[_y7 + 1] === "'") && str[_y7 + 2]) {
                  valuesStart = _y7 + 2;
                } else if (str[_y7 + 1] && !str[_y7 + 1].trim()) {
                  for (var _z = _y7 + 1; _z < len; _z++) {
                    totalCounter += 1;
                    if (str[_z].trim()) {
                      if (_z > _y7 + 1 && round === 1) {
                        finalIndexesToDelete.push(_y7 + 1, _z);
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
            nameStart: _i
          });
          if (round === 1) {
            bodyItsTheFirstClassOrId = true;
          } else if (round === 2) {
            bodyClassOrIdCanBeDeleted = true;
          }
        }
      }
      if (!doNothing && stateWithinBody && !stateWithinStyleTag && !currentlyWithinQuotes && str[_i] === "i" && str[_i + 1] === "d" &&
      str[_i - 1] &&
      !str[_i - 1].trim()) {
        var _valuesStart;
        var _quoteless = false;
        if (str[_i + 2] === "=") {
          if (str[_i + 3] === '"' || str[_i + 3] === "'") {
            _valuesStart = _i + 4;
          } else if (characterSuitableForNames(str[_i + 3])) {
            _valuesStart = _i + 3;
            _quoteless = true;
          } else if (str[_i + 3] && (!str[_i + 3].trim() || "/>".includes(str[_i + 3]))) {
            var _calculatedRange = stringRangeExpander.expander({
              str: str,
              from: _i,
              to: _i + 3,
              ifRightSideIncludesThisThenCropTightly: "/>",
              wipeAllWhitespaceOnLeft: true
            });
            finalIndexesToDelete.push.apply(finalIndexesToDelete, _toConsumableArray__default['default'](_calculatedRange));
          }
        } else if (!str[_i + 2].trim()) {
          for (var _y8 = _i + 2; _y8 < len; _y8++) {
            totalCounter += 1;
            if (str[_y8].trim()) {
              if (str[_y8] === "=") {
                if (_y8 > _i + 2 && round === 1) {
                  finalIndexesToDelete.push(_i + 2, _y8);
                }
                if ((str[_y8 + 1] === '"' || str[_y8 + 1] === "'") && str[_y8 + 2]) {
                  _valuesStart = _y8 + 2;
                } else if (str[_y8 + 1] && !str[_y8 + 1].trim()) {
                  for (var _z2 = _y8 + 1; _z2 < len; _z2++) {
                    totalCounter += 1;
                    if (str[_z2].trim()) {
                      if (_z2 > _y8 + 1 && round === 1) {
                        finalIndexesToDelete.push(_y8 + 1, _z2);
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
            nameStart: _i
          });
          if (round === 1) {
            bodyItsTheFirstClassOrId = true;
          } else if (round === 2) {
            bodyClassOrIdCanBeDeleted = true;
          }
        }
      }
      if (!doNothing && bodyClass.valuesStart !== null && _i >= bodyClass.valuesStart && bodyClass.valueStart === null) {
        if (allHeads && stringMatchLeftRight.matchRightIncl(str, _i, allHeads)) {
          doNothing = true;
          bodyClassOrIdCanBeDeleted = false;
          if (whitespaceStartedAt && _i > whitespaceStartedAt + 1) {
            var _calculatedRange2 = stringRangeExpander.expander({
              str: str,
              from: whitespaceStartedAt,
              to: _i,
              ifLeftSideIncludesThisThenCropTightly: "\"'",
              ifRightSideIncludesThisThenCropTightly: "\"'"
            });
            finalIndexesToDelete.push.apply(finalIndexesToDelete, _toConsumableArray__default['default'](_calculatedRange2));
            whitespaceStartedAt = null;
          } else if (whitespaceStartedAt) {
            whitespaceStartedAt = null;
          }
          var matchedHeads = stringMatchLeftRight.matchRightIncl(str, _i, allHeads);
          var findings = opts.backend.find(function (headsTailsObj) {
            return headsTailsObj.heads === matchedHeads;
          });
          if (findings && findings.tails) {
            doNothingUntil = findings.tails;
          }
        } else if (characterSuitableForNames(chr)) {
          bodyClass.valueStart = _i;
          if (round === 1) {
            if (bodyItsTheFirstClassOrId && bodyClass.valuesStart !== null && !str.slice(bodyClass.valuesStart, _i).trim() && bodyClass.valuesStart < _i) {
              finalIndexesToDelete.push(bodyClass.valuesStart, _i);
              nonIndentationsWhitespaceLength += _i - bodyClass.valuesStart;
              bodyItsTheFirstClassOrId = false;
            } else if (whitespaceStartedAt !== null && whitespaceStartedAt < _i - 1) {
              finalIndexesToDelete.push(whitespaceStartedAt + 1, _i);
              nonIndentationsWhitespaceLength += _i - whitespaceStartedAt + 1;
            }
          }
        }
      }
      if (!doNothing && bodyClass.valueStart !== null && _i > bodyClass.valueStart && (!characterSuitableForNames(chr) || allTails && stringMatchLeftRight.matchRightIncl(str, _i, allTails))) {
        if (allHeads && stringMatchLeftRight.matchRightIncl(str, _i, allHeads)) {
          bodyClass.valueStart = null;
          bodyClass = resetBodyClassOrId();
          var _matchedHeads = stringMatchLeftRight.matchRightIncl(str, _i, allHeads);
          var _findings = opts.backend.find(function (headsTailsObj) {
            return headsTailsObj.heads === _matchedHeads;
          });
          if (_findings && _findings.tails) {
            doNothingUntil = _findings.tails;
          }
        } else {
          var carvedClass = "".concat(str.slice(bodyClass.valueStart, _i));
          if (round === 1) {
            bodyClassesArr.push(".".concat(carvedClass));
          }
          else if (bodyClass.valueStart != null && bodyClassesToDelete.includes(carvedClass)) {
              var expandedRange = stringRangeExpander.expander({
                str: str,
                from: bodyClass.valueStart,
                to: _i,
                ifLeftSideIncludesThisThenCropTightly: "\"'",
                ifRightSideIncludesThisThenCropTightly: "\"'",
                wipeAllWhitespaceOnLeft: true
              });
              var whatToInsert = "";
              if (str[expandedRange[0] - 1] && str[expandedRange[0] - 1].trim() && str[expandedRange[1]] && str[expandedRange[1]].trim() && (allHeads || allTails) && (allHeads && stringMatchLeftRight.matchLeft(str, expandedRange[0], allTails) || allTails && stringMatchLeftRight.matchRightIncl(str, expandedRange[1], allHeads))) {
                whatToInsert = " ";
              }
              finalIndexesToDelete.push.apply(finalIndexesToDelete, _toConsumableArray__default['default'](expandedRange).concat([whatToInsert]));
            } else {
              bodyClassOrIdCanBeDeleted = false;
              if (opts.uglify && !(Array.isArray(opts.whitelist) && opts.whitelist.length && matcher__default['default']([".".concat(carvedClass)], opts.whitelist).length)) {
                finalIndexesToDelete.push(bodyClass.valueStart, _i, allClassesAndIdsWithinHeadFinalUglified[allClassesAndIdsWithinHeadFinal.indexOf(".".concat(carvedClass))].slice(1));
              }
            }
          bodyClass.valueStart = null;
        }
      }
      if (!doNothing && bodyId && bodyId.valueStart !== null && _i > bodyId.valueStart && (!characterSuitableForNames(chr) || allTails && stringMatchLeftRight.matchRightIncl(str, _i, allTails))) {
        var carvedId = str.slice(bodyId.valueStart, _i);
        if (round === 1) {
          bodyIdsArr.push("#".concat(carvedId));
        }
        else if (bodyId.valueStart != null && bodyIdsToDelete.includes(carvedId)) {
            var _expandedRange = stringRangeExpander.expander({
              str: str,
              from: bodyId.valueStart,
              to: _i,
              ifRightSideIncludesThisThenCropTightly: "\"'",
              wipeAllWhitespaceOnLeft: true
            });
            if (str[_expandedRange[0] - 1] && str[_expandedRange[0] - 1].trim() && str[_expandedRange[1]] && str[_expandedRange[1]].trim() && (allHeads || allTails) && (allHeads && stringMatchLeftRight.matchLeft(str, _expandedRange[0], allTails || []) || allTails && stringMatchLeftRight.matchRightIncl(str, _expandedRange[1], allHeads || []))) {
              _expandedRange[0] += 1;
            }
            finalIndexesToDelete.push.apply(finalIndexesToDelete, _toConsumableArray__default['default'](_expandedRange));
          } else {
            bodyClassOrIdCanBeDeleted = false;
            if (opts.uglify && !(Array.isArray(opts.whitelist) && opts.whitelist.length && matcher__default['default'](["#".concat(carvedId)], opts.whitelist).length)) {
              finalIndexesToDelete.push(bodyId.valueStart, _i, allClassesAndIdsWithinHeadFinalUglified[allClassesAndIdsWithinHeadFinal.indexOf("#".concat(carvedId))].slice(1));
            }
          }
        bodyId.valueStart = null;
      }
      if (!doNothing && bodyClass.valuesStart != null && (!bodyClass.quoteless && (chr === "'" || chr === '"') || bodyClass.quoteless && !characterSuitableForNames(str[_i])) && _i >= bodyClass.valuesStart) {
        if (_i === bodyClass.valuesStart) {
          if (round === 1) {
            finalIndexesToDelete.push.apply(finalIndexesToDelete, _toConsumableArray__default['default'](stringRangeExpander.expander({
              str: str,
              from: bodyClass.nameStart,
              to: _i + 1,
              ifRightSideIncludesThisThenCropTightly: "/>",
              wipeAllWhitespaceOnLeft: true
            })));
          }
        } else {
          if (round === 2 && bodyClassOrIdCanBeDeleted) {
            var _expandedRange2 = stringRangeExpander.expander({
              str: str,
              from: bodyClass.valuesStart - 7,
              to: "'\"".includes(str[_i]) ? _i + 1 : _i,
              ifRightSideIncludesThisThenCropTightly: "/>",
              wipeAllWhitespaceOnLeft: true
            });
            var _whatToInsert = "";
            if (str[_expandedRange2[0] - 1] && str[_expandedRange2[0] - 1].trim() && str[_expandedRange2[1]] && str[_expandedRange2[1]].trim() && !"/>".includes(str[_expandedRange2[1]])
            ) {
                _whatToInsert = " ";
              }
            finalIndexesToDelete.push.apply(finalIndexesToDelete, _toConsumableArray__default['default'](_expandedRange2).concat([_whatToInsert]));
          }
          if (whitespaceStartedAt !== null) {
            finalIndexesToDelete.push(whitespaceStartedAt, _i);
          }
        }
        bodyClass = resetBodyClassOrId();
      }
      if (!doNothing && bodyId.valuesStart !== null && (!bodyId.quoteless && (chr === "'" || chr === '"') || bodyId.quoteless && !characterSuitableForNames(str[_i])) && _i >= bodyId.valuesStart) {
        if (_i === bodyId.valuesStart) {
          if (round === 1) {
            finalIndexesToDelete.push.apply(finalIndexesToDelete, _toConsumableArray__default['default'](stringRangeExpander.expander({
              str: str,
              from: bodyId.nameStart,
              to: _i + 1,
              ifRightSideIncludesThisThenCropTightly: "/>",
              wipeAllWhitespaceOnLeft: true
            })));
          }
        } else {
          if (round === 2 && bodyClassOrIdCanBeDeleted) {
            var _expandedRange3 = stringRangeExpander.expander({
              str: str,
              from: bodyId.valuesStart - 4,
              to: _i + 1,
              ifRightSideIncludesThisThenCropTightly: "/>",
              wipeAllWhitespaceOnLeft: true
            });
            var _whatToInsert2 = "";
            if (str[_expandedRange3[0] - 1] && str[_expandedRange3[0] - 1].trim() && str[_expandedRange3[1]] && str[_expandedRange3[1]].trim() && !"/>".includes(str[_expandedRange3[1]])
            ) {
                _whatToInsert2 = " ";
              }
            finalIndexesToDelete.push.apply(finalIndexesToDelete, _toConsumableArray__default['default'](_expandedRange3).concat([_whatToInsert2]));
          }
          if (whitespaceStartedAt !== null) {
            finalIndexesToDelete.push(whitespaceStartedAt, _i);
          }
        }
        bodyId = resetBodyClassOrId();
      }
      if (!doNothing && bodyId.valuesStart && _i >= bodyId.valuesStart && bodyId.valueStart === null) {
        if (allHeads && stringMatchLeftRight.matchRightIncl(str, _i, allHeads)) {
          doNothing = true;
          bodyClassOrIdCanBeDeleted = false;
          if (whitespaceStartedAt && _i > whitespaceStartedAt + 1) {
            var _calculatedRange3 = stringRangeExpander.expander({
              str: str,
              from: whitespaceStartedAt,
              to: _i,
              ifLeftSideIncludesThisThenCropTightly: "\"'",
              ifRightSideIncludesThisThenCropTightly: "\"'"
            });
            finalIndexesToDelete.push.apply(finalIndexesToDelete, _toConsumableArray__default['default'](_calculatedRange3));
            whitespaceStartedAt = null;
          } else if (whitespaceStartedAt) {
            whitespaceStartedAt = null;
          }
          var _matchedHeads2 = stringMatchLeftRight.matchRightIncl(str, _i, allHeads);
          var _findings2 = opts.backend.find(function (headsTailsObj) {
            return headsTailsObj.heads === _matchedHeads2;
          });
          if (_findings2 && _findings2.tails) {
            doNothingUntil = _findings2.tails;
          }
        } else if (characterSuitableForNames(chr)) {
          bodyId.valueStart = _i;
          if (round === 1) {
            if (bodyItsTheFirstClassOrId && bodyId.valuesStart !== null && !str.slice(bodyId.valuesStart, _i).trim() && bodyId.valuesStart < _i) {
              finalIndexesToDelete.push(bodyId.valuesStart, _i);
              nonIndentationsWhitespaceLength += _i - bodyId.valuesStart;
              bodyItsTheFirstClassOrId = false;
            } else if (whitespaceStartedAt !== null && whitespaceStartedAt < _i - 1) {
              finalIndexesToDelete.push(whitespaceStartedAt + 1, _i);
              nonIndentationsWhitespaceLength += _i - whitespaceStartedAt + 1;
            }
          }
        }
      }
      if (!doNothing && round === 1) {
        if (commentStartedAt !== null && commentStartedAt < _i && str[_i] === ">" && !usedOnce) {
          if (opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains && Array.isArray(opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains) && opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.length && opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.some(function (val) {
            return val.trim() && str.slice(commentStartedAt, _i).toLowerCase().includes(val);
          })) {
            canDelete = false;
          }
          usedOnce = true;
        }
        if (commentStartedAt !== null && str[_i] === ">") {
          if (!bogusHTMLComment && str[_i - 1] === "-" && str[_i - 2] === "-") {
            var _calculatedRange4 = stringRangeExpander.expander({
              str: str,
              from: commentStartedAt,
              to: _i + 1,
              wipeAllWhitespaceOnLeft: true,
              addSingleSpaceToPreventAccidentalConcatenation: true
            });
            if (opts.removeHTMLComments && canDelete) {
              finalIndexesToDelete.push.apply(finalIndexesToDelete, _toConsumableArray__default['default'](_calculatedRange4));
            }
            commentsLength += _calculatedRange4[1] - _calculatedRange4[0];
            commentStartedAt = null;
            bogusHTMLComment = undefined;
          } else if (bogusHTMLComment) {
            var _calculatedRange5 = stringRangeExpander.expander({
              str: str,
              from: commentStartedAt,
              to: _i + 1,
              wipeAllWhitespaceOnLeft: true,
              addSingleSpaceToPreventAccidentalConcatenation: true
            });
            if (opts.removeHTMLComments && canDelete) {
              finalIndexesToDelete.push.apply(finalIndexesToDelete, _toConsumableArray__default['default'](_calculatedRange5));
            }
            commentsLength += _calculatedRange5[1] - _calculatedRange5[0];
            commentStartedAt = null;
            bogusHTMLComment = undefined;
          }
        }
        if (opts.removeHTMLComments && commentStartedAt === null && str[_i] === "<" && str[_i + 1] === "!") {
          if ((!allHeads || Array.isArray(allHeads) && allHeads.length && !allHeads.includes("<!")) && (!allTails || Array.isArray(allTails) && allTails.length && !allTails.includes("<!"))) {
            if (!stringMatchLeftRight.matchRight(str, _i + 1, "doctype", {
              i: true,
              trimBeforeMatching: true
            }) && !(str[_i + 2] === "-" && str[_i + 3] === "-" && Array.isArray(opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains) && opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.length && stringMatchLeftRight.matchRight(str, _i + 3, opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains, {
              trimBeforeMatching: true
            }))) {
              commentStartedAt = _i;
              usedOnce = false;
              canDelete = true;
            }
            bogusHTMLComment = !(str[_i + 2] === "-" && str[_i + 3] === "-");
          }
          if (commentStartedAt !== _i) {
            commentNearlyStartedAt = _i;
          }
        }
      }
      if (chr === "}" && curliesDepth) {
        curliesDepth -= 1;
      }
      if (!doNothing && chr === "{" && checkingInsideCurlyBraces) {
        if (!insideCurlyBraces) {
          insideCurlyBraces = true;
          if (whitespaceStartedAt !== null && (str.slice(whitespaceStartedAt, _i).includes("\n") || str.slice(whitespaceStartedAt, _i).includes("\r"))) {
            finalIndexesToDelete.push(whitespaceStartedAt, _i);
          }
        } else {
          curliesDepth += 1;
        }
      }
      if (!doNothing) {
        if (!str[_i].trim()) {
          if (whitespaceStartedAt === null) {
            whitespaceStartedAt = _i;
          }
        } else if (whitespaceStartedAt !== null) {
          whitespaceStartedAt = null;
        }
      }
      if (!doNothing && round === 2 && Array.isArray(round1RangesClone) && round1RangesClone.length && _i === round1RangesClone[0][0]) {
        var _temp2 = round1RangesClone.shift();
        if (_temp2 && _temp2[1] - 1 > _i) {
          _i = _temp2[1] - 1;
        }
        i = _i;
        return "continue";
      }
      if (commentNearlyStartedAt !== null && str[_i] === ">") {
        commentNearlyStartedAt = null;
        var _temp3 = 0;
        if (opts.removeHTMLComments && Array.isArray(opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains) && opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.length && (opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.some(function (val) {
          return val.includes("if");
        }) || opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.some(function (val) {
          return val.includes("mso");
        }) || opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.some(function (val) {
          return val.includes("ie");
        })) && stringMatchLeftRight.matchRight(str, _i, "<!--", {
          trimBeforeMatching: true,
          cb: function cb(_char, _theRemainderOfTheString, index) {
            _temp3 = index;
            i = _i;
            return true;
          }
        })) {
          if (stringMatchLeftRight.matchRight(str, _temp3 - 1, "-->", {
            trimBeforeMatching: true,
            cb: function cb(_char, _theRemainderOfTheString, index) {
              _temp3 = index;
              i = _i;
              return true;
            }
          })) ;
          if (typeof _temp3 === "number") {
            _i = _temp3 - 1;
          }
          i = _i;
          return "continue";
        }
      }
      i = _i;
    };
    stepouter: for (var i = 0; i < len; i++) {
      var _ret = _loop2(i);
      if (_ret === "continue") continue;
      if (_ret === "continue|stepouter") continue stepouter;
    }
    if (round === 1) {
      allClassesAndIdsWithinBody = uniq__default['default'](bodyClassesArr.concat(bodyIdsArr));
      headSelectorsArr.forEach(function (el) {
        stringExtractClassNames.extract(el).res.forEach(function (selector) {
          if (Object.prototype.hasOwnProperty.call(headSelectorsCount, selector)) {
            headSelectorsCount[selector] += 1;
          } else {
            headSelectorsCount[selector] = 1;
          }
        });
      });
      headSelectorsCountClone = _objectSpread__default['default']({}, headSelectorsCount);
      allClassesAndIdsWithinHead = uniq__default['default'](headSelectorsArr.reduce(function (arr, el) {
        return arr.concat(stringExtractClassNames.extract(el).res);
      }, []));
      countBeforeCleaning = allClassesAndIdsWithinHead.length;
      var preppedHeadSelectorsArr = Array.from(headSelectorsArr);
      var deletedFromHeadArr = [];
      for (var y = 0, len2 = preppedHeadSelectorsArr.length; y < len2; y++) {
        totalCounter += 1;
        var temp = void 0;
        if (preppedHeadSelectorsArr[y] != null) {
          temp = stringExtractClassNames.extract(preppedHeadSelectorsArr[y]).res;
        }
        if (temp && !temp.every(function (el) {
          return allClassesAndIdsWithinBody.includes(el);
        })) {
          var _deletedFromHeadArr;
          (_deletedFromHeadArr = deletedFromHeadArr).push.apply(_deletedFromHeadArr, _toConsumableArray__default['default'](stringExtractClassNames.extract(preppedHeadSelectorsArr[y]).res));
          preppedHeadSelectorsArr.splice(y, 1);
          y -= 1;
          len2 -= 1;
        }
      }
      deletedFromHeadArr = uniq__default['default'](arrayPullAllWithGlob.pull(deletedFromHeadArr, opts.whitelist));
      var preppedAllClassesAndIdsWithinHead;
      if (preppedHeadSelectorsArr && preppedHeadSelectorsArr.length) {
        preppedAllClassesAndIdsWithinHead = preppedHeadSelectorsArr.reduce(function (acc, curr) {
          return acc.concat(stringExtractClassNames.extract(curr).res);
        }, []);
      } else {
        preppedAllClassesAndIdsWithinHead = [];
      }
      headCssToDelete = arrayPullAllWithGlob.pull(pullAll__default['default'](uniq__default['default'](Array.from(allClassesAndIdsWithinHead)), bodyClassesArr.concat(bodyIdsArr)), opts.whitelist);
      bodyCssToDelete = uniq__default['default'](arrayPullAllWithGlob.pull(pullAll__default['default'](bodyClassesArr.concat(bodyIdsArr), preppedAllClassesAndIdsWithinHead), opts.whitelist));
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
      bodyClassesToDelete = uniq__default['default'](bodyClassesToDelete.concat(intersection__default['default'](arrayPullAllWithGlob.pull(allClassesAndIdsWithinBody, opts.whitelist), allClassesAndIdsThatWereCompletelyDeletedFromHead).filter(function (val) {
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
        round1RangesClone = Array.from(finalIndexesToDelete.current() || []);
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
    str = rangesApply.rApply(str, finalIndexesToDelete.current());
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
  str = str.replace(regexEmptyConditionalComments.emptyCondCommentRegex(), "");
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
    if ((!str[0].trim() || !str[str.length - 1].trim()) && str.length !== str.trim().length) {
      nonIndentationsWhitespaceLength += str.length - str.trim().length;
    }
    str = str.trimStart();
  }
  str = str.replace(/ ((class|id)=["']) /g, " $1");
  return {
    log: {
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
