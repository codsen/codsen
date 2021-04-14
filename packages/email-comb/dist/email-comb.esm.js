/**
 * @name email-comb
 * @fileoverview Remove unused CSS from email templates
 * @version 5.0.16
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/email-comb/}
 */

import { matchRightIncl, matchLeft, matchRight } from 'string-match-left-right';
import { emptyCondCommentRegex } from 'regex-empty-conditional-comments';
import { extract } from 'string-extract-class-names';
import { pull } from 'array-pull-all-with-glob';
import { left, right } from 'string-left-right';
import intersection from 'lodash.intersection';
import { expander } from 'string-range-expander';
import { uglifyArr } from 'string-uglify';
import { rApply } from 'ranges-apply';
import pullAll from 'lodash.pullall';
import { crush } from 'html-crush';
import { Ranges } from 'ranges-push';
import uniq from 'lodash.uniq';
import matcher from 'matcher';

var version$1 = "5.0.16";

const regexEmptyStyleTag = /[\n]?\s*<style[^>]*>\s*<\/style\s*>/g;
const regexEmptyMediaQuery = /[\n]?\s*@(media|supports|document)[^{]*{\s*}/g;
const regexEmptyUnclosedMediaQuery = /@media[^{@}]+{(?=\s*<\/style>)/g;
function isObj(something) {
  return something && typeof something === "object" && !Array.isArray(something);
}
function hasOwnProp(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
function isLatinLetter(char) {
  return typeof char === "string" && char.length === 1 && (char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91 || char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123);
}

const version = version$1;
const defaults = {
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
  const start = Date.now();
  const finalIndexesToDelete = new Ranges({
    limitToBeAddedWhitespace: true
  });
  const currentChunksMinifiedSelectors = new Ranges();
  const lineBreaksToDelete = new Ranges();
  function characterSuitableForNames(char) {
    return /[-_A-Za-z0-9]/.test(char);
  }
  function resetBodyClassOrId(initObj = {}) {
    return {
      valuesStart: null,
      valueStart: null,
      nameStart: null,
      quoteless: false,
      ...initObj
    };
  }
  let styleStartedAt;
  let styleEndedAt;
  const headSelectorsArr = [];
  const bodyClassesArr = [];
  const bodyIdsArr = [];
  let commentStartedAt;
  let commentNearlyStartedAt;
  let bodyStartedAt;
  let bodyClass;
  let bodyId;
  const headSelectorsCount = {};
  let totalCounter = 0;
  let checkingInsideCurlyBraces;
  let insideCurlyBraces;
  let uglified = null;
  let allClassesAndIdsWithinHeadFinalUglified = [];
  let countAfterCleaning = 0;
  let countBeforeCleaning = 0;
  let curliesDepth = 0;
  let bodyItsTheFirstClassOrId;
  let bogusHTMLComment;
  let ruleChunkStartedAt;
  let selectorChunkStartedAt;
  let selectorChunkCanBeDeleted = false;
  let singleSelectorStartedAt;
  let singleSelectorType;
  let headWholeLineCanBeDeleted;
  let lastKeptChunksCommaAt = null;
  let onlyDeletedChunksFollow = false;
  let bodyClassOrIdCanBeDeleted;
  let round1RangesClone;
  let nonIndentationsWhitespaceLength = 0;
  let commentsLength = 0;
  const badChars = `.# ~\\!@$%^&*()+=,/';:"?><[]{}|\`\t\n`;
  const atRulesWhichMightWrapStyles = ["media", "supports", "document"];
  const atRulesWhichNeedToBeIgnored = ["font-feature-values", "counter-style", "namespace", "font-face", "keyframes", "viewport", "charset", "import", "page"];
  const atRuleBreakCharacters = ["{", "(", "<", '"', "'", "@", ";"];
  if (typeof str !== "string") {
    throw new TypeError(`email-comb: [THROW_ID_01] Input must be string! Currently it's ${typeof str}`);
  }
  if (originalOpts && !isObj(originalOpts)) {
    throw new TypeError(`email-comb: [THROW_ID_02] Options, second input argument, must be a plain object! Currently it's ${typeof originalOpts}, equal to: ${JSON.stringify(originalOpts, null, 4)}`);
  }
  const opts = { ...defaults,
    ...originalOpts
  };
  if (typeof opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains === "string") {
    opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains = [opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains].filter(val => val.trim());
  }
  if (typeof opts.whitelist === "string") {
    opts.whitelist = [opts.whitelist];
  } else if (!Array.isArray(opts.whitelist)) {
    throw new TypeError(`email-comb: [THROW_ID_03] opts.whitelist should be an array, but it was customised to a wrong thing, ${JSON.stringify(opts.whitelist, null, 4)}`);
  }
  if (opts.whitelist.length > 0 && !opts.whitelist.every(el => typeof el === "string")) {
    throw new TypeError(`email-comb: [THROW_ID_04] opts.whitelist array should contain only string-type elements. Currently we\ve got:\n${JSON.stringify(opts.whitelist, null, 4)}`);
  }
  if (!Array.isArray(opts.backend)) {
    throw new TypeError(`email-comb: [THROW_ID_05] opts.backend should be an array, but it was customised to a wrong thing, ${JSON.stringify(opts.backend, null, 4)}`);
  }
  if (opts.backend.length > 0 && opts.backend.some(val => !isObj(val))) {
    throw new TypeError(`email-comb: [THROW_ID_06] opts.backend array should contain only plain objects but it contains something else:\n${JSON.stringify(opts.backend, null, 4)}`);
  }
  if (opts.backend.length > 0 && !opts.backend.every(obj => hasOwnProp(obj, "heads") && hasOwnProp(obj, "tails"))) {
    throw new TypeError(`email-comb: [THROW_ID_07] every object within opts.backend should contain keys "heads" and "tails" but currently it's not the case. Whole "opts.backend" value array is currently equal to:\n${JSON.stringify(opts.backend, null, 4)}`);
  }
  if (typeof opts.uglify !== "boolean") {
    if (opts.uglify === 1 || opts.uglify === 0) {
      opts.uglify = !!opts.uglify;
    } else {
      throw new TypeError(`email-comb: [THROW_ID_08] opts.uglify should be a Boolean. Currently it's set to: ${JSON.stringify(opts.uglify, null, 4)}}`);
    }
  }
  if (opts.reportProgressFunc && typeof opts.reportProgressFunc !== "function") {
    throw new TypeError(`email-comb: [THROW_ID_09] opts.reportProgressFunc should be a function but it was given as :\n${JSON.stringify(opts.reportProgressFunc, null, 4)} (${typeof opts.reportProgressFunc})`);
  }
  let allHeads = null;
  let allTails = null;
  if (Array.isArray(opts.backend) && opts.backend.length) {
    allHeads = opts.backend.map(headsAndTailsObj => headsAndTailsObj.heads);
    allTails = opts.backend.map(headsAndTailsObj => headsAndTailsObj.tails);
  }
  const len = str.length;
  const leavePercForLastStage = 0.06;
  let ceil = 1;
  if (opts.reportProgressFunc) {
    ceil = Math.floor((opts.reportProgressFuncTo - (opts.reportProgressFuncTo - opts.reportProgressFuncFrom) * leavePercForLastStage - opts.reportProgressFuncFrom) / 2);
  }
  let trailingLinebreakLengthCorrection = 0;
  if (!str.length || !"\r\n".includes(str[str.length - 1])) {
    trailingLinebreakLengthCorrection = 1;
  }
  let doNothing;
  let doNothingUntil;
  let allClassesAndIdsThatWereCompletelyDeletedFromHead = [];
  let allClassesAndIdsWithinHeadFinal = [];
  let allClassesAndIdsWithinHead = [];
  let allClassesAndIdsWithinBody = [];
  let headSelectorsCountClone = {};
  let currentPercentageDone;
  let stateWithinStyleTag;
  let currentlyWithinQuotes;
  let whitespaceStartedAt;
  let bodyClassesToDelete = [];
  let lastPercentage = 0;
  let stateWithinBody;
  let bodyIdsToDelete = [];
  let bodyCssToDelete = [];
  let headCssToDelete = [];
  let currentChunk;
  let canDelete;
  let usedOnce;
  for (let round = 1; round <= 2; round++) {
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
    stepouter: for (let i = 0; i < len; i++) {
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
      const chr = str[i];
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
          const leftSideIdx = left(str, i);
          if (typeof leftSideIdx === "number" && (stateWithinStyleTag && ["(", ",", ":"].includes(str[leftSideIdx]) || stateWithinBody && !stateWithinStyleTag && ["(", ",", ":", "="].includes(str[leftSideIdx]))) {
            currentlyWithinQuotes = str[i];
          }
        } else if (str[i] === `"` && str[right(str, i)] === `'` && str[right(str, right(str, i))] === `"` || str[i] === `'` && str[right(str, i)] === `"` && str[right(str, right(str, i))] === `'`) {
          i = right(str, right(str, i));
          continue;
        } else if (currentlyWithinQuotes === str[i]) {
          currentlyWithinQuotes = null;
        }
      }
      if (doNothing) {
        if (doNothingUntil === null || typeof doNothingUntil !== "string" || typeof doNothingUntil === "string" && !doNothingUntil) {
          doNothing = false;
        } else if (matchRightIncl(str, i, doNothingUntil)) {
          if (commentStartedAt !== null) {
            if (round === 1 && opts.removeCSSComments) {
              const lineBreakPresentOnTheLeft = matchLeft(str, commentStartedAt, ["\r\n", "\n", "\r"]);
              let startingIndex = commentStartedAt;
              if (typeof lineBreakPresentOnTheLeft === "string" && lineBreakPresentOnTheLeft.length) {
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
        for (let y = i; y < len; y++) {
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
      if (round === 1 && (stateWithinStyleTag || stateWithinBody) && str[i] === "/" && str[i + 1] === "*" && commentStartedAt === null) {
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
        const matchedAtTagsName = matchRight(str, i, atRulesWhichMightWrapStyles) || matchRight(str, i, atRulesWhichNeedToBeIgnored);
        if (typeof matchedAtTagsName === "string") {
          let temp;
          if (str[i + matchedAtTagsName.length + 1] === ";" || str[i + matchedAtTagsName.length + 1] && !str[i + matchedAtTagsName.length + 1].trim() && matchRight(str, i + matchedAtTagsName.length + 1, ";", {
            trimBeforeMatching: true,
            cb: (_char, _theRemainderOfTheString, index) => {
              temp = index;
              return true;
            }
          })) {
            finalIndexesToDelete.push(i, temp || i + matchedAtTagsName.length + 2);
          }
          let secondaryStopper;
          for (let z = i + 1; z < len; z++) {
            totalCounter += 1;
            let espTails = "";
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
              let pushRangeFrom;
              let pushRangeTo;
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
              const iOffset = pushRangeTo ? pushRangeTo - 1 : z - 1 + (str[z] === "{" ? 1 : 0);
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
      styleEndedAt && styleStartedAt > styleEndedAt && styleStartedAt <= i) && !insideCurlyBraces) {
        if (singleSelectorStartedAt === null) {
          if (chr === "." || chr === "#") {
            singleSelectorStartedAt = i;
          } else if (matchLeft(str, i, "[class=")) {
            if (isLatinLetter(chr)) {
              singleSelectorStartedAt = i;
              singleSelectorType = ".";
            } else if (`"'`.includes(chr) && isLatinLetter(str[right(str, i)])) {
              singleSelectorStartedAt = right(str, i);
              singleSelectorType = ".";
            }
          } else if (matchLeft(str, i, "[id=")) {
            if (isLatinLetter(chr)) {
              singleSelectorStartedAt = i;
              singleSelectorType = "#";
            } else if (`"'`.includes(chr) && isLatinLetter(str[right(str, i)])) {
              singleSelectorStartedAt = right(str, i);
              singleSelectorType = "#";
            }
          } else if (chr.trim()) {
            if (chr === "}") {
              ruleChunkStartedAt = i + 1;
              currentChunk = null;
            } else if (chr === "<" && str[i + 1] === "!") {
              for (let y = i; y < len; y++) {
                totalCounter += 1;
                if (str[y] === ">") {
                  ruleChunkStartedAt = y + 1;
                  selectorChunkStartedAt = y + 1;
                  i = y;
                  continue stepouter;
                }
              }
            }
          }
        }
        else if (singleSelectorStartedAt !== null && !characterSuitableForNames(chr)) {
            let singleSelector = str.slice(singleSelectorStartedAt, i);
            if (singleSelectorType) {
              singleSelector = `${singleSelectorType}${singleSelector}`;
              singleSelectorType = undefined;
            }
            if (round === 2 && !selectorChunkCanBeDeleted && headCssToDelete.includes(singleSelector)) {
              selectorChunkCanBeDeleted = true;
              onlyDeletedChunksFollow = true;
            } else if (round === 2 && !selectorChunkCanBeDeleted) {
              if (opts.uglify && (!Array.isArray(opts.whitelist) || !opts.whitelist.length || !matcher([singleSelector], opts.whitelist).length)) {
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
            const sliceTo = whitespaceStartedAt || i;
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
                let fromIndex = selectorChunkStartedAt;
                let toIndex = i;
                let tempFindingIndex = 0;
                if (chr === "{" && str[fromIndex - 1] !== ">" && str[fromIndex - 1] !== "}") {
                  for (let y = selectorChunkStartedAt; y--;) {
                    totalCounter += 1;
                    if (str[y].trim() && str[y] !== ",") {
                      fromIndex = y + 1;
                      break;
                    }
                  }
                  if (!str[i - 1].trim()) {
                    toIndex = i - 1;
                  }
                } else if (chr === "," && !str[i + 1].trim()) {
                  for (let y = i + 1; y < len; y++) {
                    totalCounter += 1;
                    if (str[y].trim()) {
                      toIndex = y;
                      break;
                    }
                  }
                } else if (matchLeft(str, fromIndex, "{", {
                  trimBeforeMatching: true,
                  cb: (_char, _theRemainderOfTheString, index) => {
                    tempFindingIndex = index;
                    return true;
                  }
                })) {
                  fromIndex = tempFindingIndex + 2;
                }
                const resToPush = expander({
                  str,
                  from: fromIndex,
                  to: toIndex,
                  ifRightSideIncludesThisThenCropTightly: ".#",
                  ifRightSideIncludesThisCropItToo: ",",
                  extendToOneSide: "right"
                });
                finalIndexesToDelete.push(...resToPush);
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
                let deleteUpTo = lastKeptChunksCommaAt + 1;
                if ("\n\r".includes(str[lastKeptChunksCommaAt + 1])) {
                  for (let y = lastKeptChunksCommaAt + 1; y < len; y++) {
                    if (str[y].trim()) {
                      deleteUpTo = y;
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
      if (!doNothing && !stateWithinStyleTag && stateWithinBody && str[i] === "/" && matchRight(str, i, "body", {
        trimBeforeMatching: true,
        i: true
      }) && matchLeft(str, i, "<", {
        trimBeforeMatching: true
      })) {
        stateWithinBody = false;
        bodyStartedAt = null;
      }
      if (!doNothing && str[i] === "<" && matchRight(str, i, "body", {
        i: true,
        trimBeforeMatching: true,
        cb: (char, _theRemainderOfTheString, index) => {
          if (round === 1) {
            if (char !== undefined && (char.trim() === "" || char === ">") && typeof index === "number") {
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
        for (let y = i; y < len; y++) {
          totalCounter += 1;
          if (str[y] === ">") {
            bodyStartedAt = y + 1;
            break;
          }
        }
      }
      if (!doNothing && stateWithinBody && !stateWithinStyleTag && str[i] === "s" && str[i + 1] === "t" && str[i + 2] === "y" && str[i + 3] === "l" && str[i + 4] === "e" && str[i + 5] === "=" && badChars.includes(str[i - 1])
      ) {
          if (`"'`.includes(str[i + 6])) ;
        }
      if (!doNothing && stateWithinBody && !stateWithinStyleTag && !currentlyWithinQuotes && str[i] === "c" && str[i + 1] === "l" && str[i + 2] === "a" && str[i + 3] === "s" && str[i + 4] === "s" &&
      str[i - 1] &&
      !str[i - 1].trim()) {
        let valuesStart;
        let quoteless = false;
        if (str[i + 5] === "=") {
          if (str[i + 6] === '"' || str[i + 6] === "'") {
            valuesStart = i + 7;
          } else if (characterSuitableForNames(str[i + 6])) {
            valuesStart = i + 6;
            quoteless = true;
          } else if (str[i + 6] && (!str[i + 6].trim() || "/>".includes(str[i + 6]))) {
            const calculatedRange = expander({
              str,
              from: i,
              to: i + 6,
              ifRightSideIncludesThisThenCropTightly: "/>",
              wipeAllWhitespaceOnLeft: true
            });
            finalIndexesToDelete.push(...calculatedRange);
          }
        } else if (!str[i + 5].trim()) {
          for (let y = i + 5; y < len; y++) {
            totalCounter += 1;
            if (str[y].trim()) {
              if (str[y] === "=") {
                if (y > i + 5 && round === 1) {
                  finalIndexesToDelete.push(i + 5, y);
                }
                if ((str[y + 1] === '"' || str[y + 1] === "'") && str[y + 2]) {
                  valuesStart = y + 2;
                } else if (str[y + 1] && !str[y + 1].trim()) {
                  for (let z = y + 1; z < len; z++) {
                    totalCounter += 1;
                    if (str[z].trim()) {
                      if (z > y + 1 && round === 1) {
                        finalIndexesToDelete.push(y + 1, z);
                      }
                      if ((str[z] === '"' || str[z] === "'") && str[z + 1]) {
                        valuesStart = z + 1;
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
            valuesStart,
            quoteless,
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
        let valuesStart;
        let quoteless = false;
        if (str[i + 2] === "=") {
          if (str[i + 3] === '"' || str[i + 3] === "'") {
            valuesStart = i + 4;
          } else if (characterSuitableForNames(str[i + 3])) {
            valuesStart = i + 3;
            quoteless = true;
          } else if (str[i + 3] && (!str[i + 3].trim() || "/>".includes(str[i + 3]))) {
            const calculatedRange = expander({
              str,
              from: i,
              to: i + 3,
              ifRightSideIncludesThisThenCropTightly: "/>",
              wipeAllWhitespaceOnLeft: true
            });
            finalIndexesToDelete.push(...calculatedRange);
          }
        } else if (!str[i + 2].trim()) {
          for (let y = i + 2; y < len; y++) {
            totalCounter += 1;
            if (str[y].trim()) {
              if (str[y] === "=") {
                if (y > i + 2 && round === 1) {
                  finalIndexesToDelete.push(i + 2, y);
                }
                if ((str[y + 1] === '"' || str[y + 1] === "'") && str[y + 2]) {
                  valuesStart = y + 2;
                } else if (str[y + 1] && !str[y + 1].trim()) {
                  for (let z = y + 1; z < len; z++) {
                    totalCounter += 1;
                    if (str[z].trim()) {
                      if (z > y + 1 && round === 1) {
                        finalIndexesToDelete.push(y + 1, z);
                      }
                      if ((str[z] === '"' || str[z] === "'") && str[z + 1]) {
                        valuesStart = z + 1;
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
          bodyId = resetBodyClassOrId({
            valuesStart,
            quoteless,
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
        if (allHeads && matchRightIncl(str, i, allHeads)) {
          doNothing = true;
          bodyClassOrIdCanBeDeleted = false;
          if (whitespaceStartedAt && i > whitespaceStartedAt + 1) {
            const calculatedRange = expander({
              str,
              from: whitespaceStartedAt,
              to: i,
              ifLeftSideIncludesThisThenCropTightly: "\"'",
              ifRightSideIncludesThisThenCropTightly: "\"'"
            });
            finalIndexesToDelete.push(...calculatedRange);
            whitespaceStartedAt = null;
          } else if (whitespaceStartedAt) {
            whitespaceStartedAt = null;
          }
          const matchedHeads = matchRightIncl(str, i, allHeads);
          const findings = opts.backend.find(headsTailsObj => headsTailsObj.heads === matchedHeads);
          if (findings && findings.tails) {
            doNothingUntil = findings.tails;
          }
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
      if (!doNothing && bodyClass.valueStart !== null && i > bodyClass.valueStart && (!characterSuitableForNames(chr) || allTails && matchRightIncl(str, i, allTails))) {
        if (allHeads && matchRightIncl(str, i, allHeads)) {
          bodyClass.valueStart = null;
          bodyClass = resetBodyClassOrId();
          const matchedHeads = matchRightIncl(str, i, allHeads);
          const findings = opts.backend.find(headsTailsObj => headsTailsObj.heads === matchedHeads);
          if (findings && findings.tails) {
            doNothingUntil = findings.tails;
          }
        } else {
          const carvedClass = `${str.slice(bodyClass.valueStart, i)}`;
          if (round === 1) {
            bodyClassesArr.push(`.${carvedClass}`);
          }
          else if (bodyClass.valueStart != null && bodyClassesToDelete.includes(carvedClass)) {
              const expandedRange = expander({
                str,
                from: bodyClass.valueStart,
                to: i,
                ifLeftSideIncludesThisThenCropTightly: `"'`,
                ifRightSideIncludesThisThenCropTightly: `"'`,
                wipeAllWhitespaceOnLeft: true
              });
              let whatToInsert = "";
              if (str[expandedRange[0] - 1] && str[expandedRange[0] - 1].trim() && str[expandedRange[1]] && str[expandedRange[1]].trim() && (allHeads || allTails) && (allHeads && matchLeft(str, expandedRange[0], allTails) || allTails && matchRightIncl(str, expandedRange[1], allHeads))) {
                whatToInsert = " ";
              }
              finalIndexesToDelete.push(...expandedRange, whatToInsert);
            } else {
              bodyClassOrIdCanBeDeleted = false;
              if (opts.uglify && !(Array.isArray(opts.whitelist) && opts.whitelist.length && matcher([`.${carvedClass}`], opts.whitelist).length)) {
                finalIndexesToDelete.push(bodyClass.valueStart, i, allClassesAndIdsWithinHeadFinalUglified[allClassesAndIdsWithinHeadFinal.indexOf(`.${carvedClass}`)].slice(1));
              }
            }
          bodyClass.valueStart = null;
        }
      }
      if (!doNothing && bodyId && bodyId.valueStart !== null && i > bodyId.valueStart && (!characterSuitableForNames(chr) || allTails && matchRightIncl(str, i, allTails))) {
        const carvedId = str.slice(bodyId.valueStart, i);
        if (round === 1) {
          bodyIdsArr.push(`#${carvedId}`);
        }
        else if (bodyId.valueStart != null && bodyIdsToDelete.includes(carvedId)) {
            const expandedRange = expander({
              str,
              from: bodyId.valueStart,
              to: i,
              ifRightSideIncludesThisThenCropTightly: `"'`,
              wipeAllWhitespaceOnLeft: true
            });
            if (str[expandedRange[0] - 1] && str[expandedRange[0] - 1].trim() && str[expandedRange[1]] && str[expandedRange[1]].trim() && (allHeads || allTails) && (allHeads && matchLeft(str, expandedRange[0], allTails || []) || allTails && matchRightIncl(str, expandedRange[1], allHeads || []))) {
              expandedRange[0] += 1;
            }
            finalIndexesToDelete.push(...expandedRange);
          } else {
            bodyClassOrIdCanBeDeleted = false;
            if (opts.uglify && !(Array.isArray(opts.whitelist) && opts.whitelist.length && matcher([`#${carvedId}`], opts.whitelist).length)) {
              finalIndexesToDelete.push(bodyId.valueStart, i, allClassesAndIdsWithinHeadFinalUglified[allClassesAndIdsWithinHeadFinal.indexOf(`#${carvedId}`)].slice(1));
            }
          }
        bodyId.valueStart = null;
      }
      if (!doNothing && bodyClass.valuesStart != null && (!bodyClass.quoteless && (chr === "'" || chr === '"') || bodyClass.quoteless && !characterSuitableForNames(str[i])) && i >= bodyClass.valuesStart) {
        if (i === bodyClass.valuesStart) {
          if (round === 1) {
            finalIndexesToDelete.push(...expander({
              str,
              from: bodyClass.nameStart,
              to: i + 1,
              ifRightSideIncludesThisThenCropTightly: "/>",
              wipeAllWhitespaceOnLeft: true
            }));
          }
        } else {
          if (round === 2 && bodyClassOrIdCanBeDeleted) {
            const expandedRange = expander({
              str,
              from: bodyClass.valuesStart - 7,
              to: `'"`.includes(str[i]) ? i + 1 : i,
              ifRightSideIncludesThisThenCropTightly: "/>",
              wipeAllWhitespaceOnLeft: true
            });
            let whatToInsert = "";
            if (str[expandedRange[0] - 1] && str[expandedRange[0] - 1].trim() && str[expandedRange[1]] && str[expandedRange[1]].trim() && !"/>".includes(str[expandedRange[1]])
            ) {
                whatToInsert = " ";
              }
            finalIndexesToDelete.push(...expandedRange, whatToInsert);
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
            finalIndexesToDelete.push(...expander({
              str,
              from: bodyId.nameStart,
              to: i + 1,
              ifRightSideIncludesThisThenCropTightly: "/>",
              wipeAllWhitespaceOnLeft: true
            }));
          }
        } else {
          if (round === 2 && bodyClassOrIdCanBeDeleted) {
            const expandedRange = expander({
              str,
              from: bodyId.valuesStart - 4,
              to: i + 1,
              ifRightSideIncludesThisThenCropTightly: "/>",
              wipeAllWhitespaceOnLeft: true
            });
            let whatToInsert = "";
            if (str[expandedRange[0] - 1] && str[expandedRange[0] - 1].trim() && str[expandedRange[1]] && str[expandedRange[1]].trim() && !"/>".includes(str[expandedRange[1]])
            ) {
                whatToInsert = " ";
              }
            finalIndexesToDelete.push(...expandedRange, whatToInsert);
          }
          if (whitespaceStartedAt !== null) {
            finalIndexesToDelete.push(whitespaceStartedAt, i);
          }
        }
        bodyId = resetBodyClassOrId();
      }
      if (!doNothing && bodyId.valuesStart && i >= bodyId.valuesStart && bodyId.valueStart === null) {
        if (allHeads && matchRightIncl(str, i, allHeads)) {
          doNothing = true;
          bodyClassOrIdCanBeDeleted = false;
          if (whitespaceStartedAt && i > whitespaceStartedAt + 1) {
            const calculatedRange = expander({
              str,
              from: whitespaceStartedAt,
              to: i,
              ifLeftSideIncludesThisThenCropTightly: "\"'",
              ifRightSideIncludesThisThenCropTightly: "\"'"
            });
            finalIndexesToDelete.push(...calculatedRange);
            whitespaceStartedAt = null;
          } else if (whitespaceStartedAt) {
            whitespaceStartedAt = null;
          }
          const matchedHeads = matchRightIncl(str, i, allHeads);
          const findings = opts.backend.find(headsTailsObj => headsTailsObj.heads === matchedHeads);
          if (findings && findings.tails) {
            doNothingUntil = findings.tails;
          }
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
          if (opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains && Array.isArray(opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains) && opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.length && opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.some(val => val.trim() && str.slice(commentStartedAt, i).toLowerCase().includes(val))) {
            canDelete = false;
          }
          usedOnce = true;
        }
        if (commentStartedAt !== null && str[i] === ">") {
          if (!bogusHTMLComment && str[i - 1] === "-" && str[i - 2] === "-") {
            const calculatedRange = expander({
              str,
              from: commentStartedAt,
              to: i + 1,
              wipeAllWhitespaceOnLeft: true,
              addSingleSpaceToPreventAccidentalConcatenation: true
            });
            if (opts.removeHTMLComments && canDelete) {
              finalIndexesToDelete.push(...calculatedRange);
            }
            commentsLength += calculatedRange[1] - calculatedRange[0];
            commentStartedAt = null;
            bogusHTMLComment = undefined;
          } else if (bogusHTMLComment) {
            const calculatedRange = expander({
              str,
              from: commentStartedAt,
              to: i + 1,
              wipeAllWhitespaceOnLeft: true,
              addSingleSpaceToPreventAccidentalConcatenation: true
            });
            if (opts.removeHTMLComments && canDelete) {
              finalIndexesToDelete.push(...calculatedRange);
            }
            commentsLength += calculatedRange[1] - calculatedRange[0];
            commentStartedAt = null;
            bogusHTMLComment = undefined;
          }
        }
        if (opts.removeHTMLComments && commentStartedAt === null && str[i] === "<" && str[i + 1] === "!") {
          if ((!allHeads || Array.isArray(allHeads) && allHeads.length && !allHeads.includes("<!")) && (!allTails || Array.isArray(allTails) && allTails.length && !allTails.includes("<!"))) {
            if (!matchRight(str, i + 1, "doctype", {
              i: true,
              trimBeforeMatching: true
            }) && !(str[i + 2] === "-" && str[i + 3] === "-" && Array.isArray(opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains) && opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.length && matchRight(str, i + 3, opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains, {
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
        const temp = round1RangesClone.shift();
        if (temp && temp[1] - 1 > i) {
          i = temp[1] - 1;
        }
        continue;
      }
      if (commentNearlyStartedAt !== null && str[i] === ">") {
        commentNearlyStartedAt = null;
        let temp = 0;
        if (opts.removeHTMLComments && Array.isArray(opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains) && opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.length && (opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.some(val => val.includes("if")) || opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.some(val => val.includes("mso")) || opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.some(val => val.includes("ie"))) && matchRight(str, i, "<!--", {
          trimBeforeMatching: true,
          cb: (_char, _theRemainderOfTheString, index) => {
            temp = index;
            return true;
          }
        })) {
          if (matchRight(str, temp - 1, "-->", {
            trimBeforeMatching: true,
            cb: (_char, _theRemainderOfTheString, index) => {
              temp = index;
              return true;
            }
          })) ;
          if (typeof temp === "number") {
            i = temp - 1;
          }
          continue;
        }
      }
    }
    if (round === 1) {
      allClassesAndIdsWithinBody = uniq(bodyClassesArr.concat(bodyIdsArr));
      headSelectorsArr.forEach(el => {
        extract(el).res.forEach(selector => {
          if (Object.prototype.hasOwnProperty.call(headSelectorsCount, selector)) {
            headSelectorsCount[selector] += 1;
          } else {
            headSelectorsCount[selector] = 1;
          }
        });
      });
      headSelectorsCountClone = { ...headSelectorsCount
      };
      allClassesAndIdsWithinHead = uniq(headSelectorsArr.reduce((arr, el) => arr.concat(extract(el).res), []));
      countBeforeCleaning = allClassesAndIdsWithinHead.length;
      const preppedHeadSelectorsArr = Array.from(headSelectorsArr);
      let deletedFromHeadArr = [];
      for (let y = 0, len2 = preppedHeadSelectorsArr.length; y < len2; y++) {
        totalCounter += 1;
        let temp;
        if (preppedHeadSelectorsArr[y] != null) {
          temp = extract(preppedHeadSelectorsArr[y]).res;
        }
        if (temp && !temp.every(el => allClassesAndIdsWithinBody.includes(el))) {
          deletedFromHeadArr.push(...extract(preppedHeadSelectorsArr[y]).res);
          preppedHeadSelectorsArr.splice(y, 1);
          y -= 1;
          len2 -= 1;
        }
      }
      deletedFromHeadArr = uniq(pull(deletedFromHeadArr, opts.whitelist));
      let preppedAllClassesAndIdsWithinHead;
      if (preppedHeadSelectorsArr && preppedHeadSelectorsArr.length) {
        preppedAllClassesAndIdsWithinHead = preppedHeadSelectorsArr.reduce((acc, curr) => acc.concat(extract(curr).res), []);
      } else {
        preppedAllClassesAndIdsWithinHead = [];
      }
      headCssToDelete = pull(pullAll(uniq(Array.from(allClassesAndIdsWithinHead)), bodyClassesArr.concat(bodyIdsArr)), opts.whitelist);
      bodyCssToDelete = uniq(pull(pullAll(bodyClassesArr.concat(bodyIdsArr), preppedAllClassesAndIdsWithinHead), opts.whitelist));
      headCssToDelete = uniq(headCssToDelete.concat(intersection(deletedFromHeadArr, bodyCssToDelete)));
      bodyClassesToDelete = bodyCssToDelete.filter(s => s.startsWith(".")).map(s => s.slice(1));
      bodyIdsToDelete = bodyCssToDelete.filter(s => s.startsWith("#")).map(s => s.slice(1));
      allClassesAndIdsThatWereCompletelyDeletedFromHead = Object.keys(headSelectorsCountClone).filter(singleSelector => headSelectorsCountClone[singleSelector] < 1);
      bodyClassesToDelete = uniq(bodyClassesToDelete.concat(intersection(pull(allClassesAndIdsWithinBody, opts.whitelist), allClassesAndIdsThatWereCompletelyDeletedFromHead).filter(val => val[0] === ".")
      .map(val => val.slice(1))));
      const allClassesAndIdsWithinBodyThatWereWhitelisted = matcher(allClassesAndIdsWithinBody, opts.whitelist);
      bodyCssToDelete = uniq(bodyCssToDelete.concat(bodyClassesToDelete.map(val => `.${val}`), bodyIdsToDelete.map(val => `#${val}`)));
      allClassesAndIdsWithinHeadFinal = pullAll(pullAll(Array.from(allClassesAndIdsWithinHead), bodyCssToDelete), headCssToDelete);
      if (Array.isArray(allClassesAndIdsWithinBodyThatWereWhitelisted) && allClassesAndIdsWithinBodyThatWereWhitelisted.length) {
        allClassesAndIdsWithinBodyThatWereWhitelisted.forEach(classOrId => {
          if (!allClassesAndIdsWithinHeadFinal.includes(classOrId)) {
            allClassesAndIdsWithinHeadFinal.push(classOrId);
          }
        });
      }
      if (opts.uglify) {
        allClassesAndIdsWithinHeadFinalUglified = uglifyArr(allClassesAndIdsWithinHeadFinal);
      }
      countAfterCleaning = allClassesAndIdsWithinHeadFinal.length;
      uglified = opts.uglify ? allClassesAndIdsWithinHeadFinal.map((name, id) => [name, allClassesAndIdsWithinHeadFinalUglified[id]]).filter(arr => !opts.whitelist.some(whitelistVal => matcher.isMatch(arr[0], whitelistVal))) : null;
      if (finalIndexesToDelete.current()) {
        round1RangesClone = Array.from(finalIndexesToDelete.current() || []);
      } else {
        round1RangesClone = null;
      }
    }
  }
  finalIndexesToDelete.push(lineBreaksToDelete.current());
  if (str.length && finalIndexesToDelete.current()) {
    str = rApply(str, finalIndexesToDelete.current());
    finalIndexesToDelete.wipe();
  }
  const startingPercentageDone = opts.reportProgressFuncTo - (opts.reportProgressFuncTo - opts.reportProgressFuncFrom) * leavePercForLastStage;
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
  let tempLen = str.length;
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
  str = crush(str, {
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
      commentsLength,
      commentsTakeUpPercentageOfOriginal: len && commentsLength ? Math.round(commentsLength * 100 / len) : 0,
      uglified
    },
    result: str,
    countAfterCleaning,
    countBeforeCleaning,
    allInHead: allClassesAndIdsWithinHead.sort(),
    allInBody: allClassesAndIdsWithinBody.sort(),
    deletedFromHead: headCssToDelete.sort(),
    deletedFromBody: bodyCssToDelete.sort()
  };
}

export { comb, defaults, version };
