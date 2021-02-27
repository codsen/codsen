/**
 * email-comb
 * Remove unused CSS from email templates
 * Version: 5.0.6
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/email-comb/
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

var version$1 = "5.0.6";

/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */
const regexEmptyStyleTag = /[\n]?\s*<style[^>]*>\s*<\/style\s*>/g;
const regexEmptyMediaQuery = /[\n]?\s*@(media|supports|document)[^{]*{\s*}/g;
const regexEmptyUnclosedMediaQuery = /@media[^{@}]+{(?=\s*<\/style>)/g; // proper plain object checks such as lodash's cost more perf than this below

function isObj(something) {
  return something && typeof something === "object" && !Array.isArray(something);
}

function hasOwnProp(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

function isLatinLetter(char) {
  // we mean Latin letters A-Z, a-z
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
/**
 * Remove unused CSS from email templates
 */

function comb(str, originalOpts) {
  const start = Date.now();
  const finalIndexesToDelete = new Ranges({
    limitToBeAddedWhitespace: true
  });
  const currentChunksMinifiedSelectors = new Ranges();
  const lineBreaksToDelete = new Ranges(); // PS. badChars is also used

  function characterSuitableForNames(char) {
    return /[-_A-Za-z0-9]/.test(char); // notice, there's no dot or hash!
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
  const bodyIdsArr = []; // const selectorsRemovedDuringRoundOne = [];

  let commentStartedAt;
  let commentNearlyStartedAt;
  let bodyStartedAt;
  let bodyClass;
  let bodyId;
  const headSelectorsCount = {}; // for each single character traversed on any FOR loop, we increment this counter:

  let totalCounter = 0;
  let checkingInsideCurlyBraces;
  let insideCurlyBraces;
  let uglified = null;
  let allClassesAndIdsWithinHeadFinalUglified = [];
  let countAfterCleaning = 0;
  let countBeforeCleaning = 0;
  let curliesDepth = 0; // this flag is on just for the first class or id value on the class/id within body
  // we use it to check leading whitespace, not to waste resources on 2nd class/id
  // onwards..

  let bodyItsTheFirstClassOrId; // marker to identify bogus comments. Bogus comments according to the HTML spec
  // are when there's opening bracket and exclamation mark, not followed by doctype
  // or two dashes. In that case, comment is considered to be everything up to
  // the first encountered closing bracket. That's opposed to the healthy comment
  // where only "-->" is considered to be a closing mark.

  let bogusHTMLComment; // ---------------------------------------------------------------------------
  // the two below are used to identify where to delete the selectors:
  // the following marker is for marking the beginning of where we would delete
  // the whole "line" in head CSS. For example:
  //
  // <style type="text/css"><----------- rule chunk #1 starts here
  //   .unused1[z], .unused2 {a:1;}<---- rule chunk #1 ends here
  //   .used[z] {a:2;}<----------------- rule chunk #2 ends here
  //
  // * In case of "unused1" class (chunk #1), "ruleChunkStartedAt" would be the
  // index of line break after ">".
  // * In case of "used" class, the "ruleChunkStartedAt" would be the line
  // break after "{a:1;}".
  //
  // TLDR; It's used to mark from where to delete the whole "style" (line if you may):

  let ruleChunkStartedAt; // ---------------------------------------------------------------------------
  // the following marker is for marking the beginning of a selector, where we
  // would delete only that particular selector. It will be used when we can't
  // delete the whole line.
  // For example:
  //
  //       <style type="text/css">
  //         .unused1[z].unused2, .used[z] {a:1;}
  //         |                 |
  //         <-selector chunk ->
  //
  //
  // We've got two classes, "used" and "unused". We must delete only
  // ".unused1[z].unused2".
  // The following marker would mark where to delete from.
  // When we traverse the whole string, it will be reassigned again and again
  // as we shift through each selector:
  //
  // TLDR; It's used to mark from where to delete only that selector, usually
  // marking pieces between commas and brackets and curlies:

  let selectorChunkStartedAt; // flag used to mark can the selector chunk be deleted (in Round 2 only)

  let selectorChunkCanBeDeleted = false; //               ALSO,
  //       <style type="text/css">
  //         .unused1[z].unused2, .used[z] {a:1;}
  //         |         |
  //         | single  |
  //    ---> | selector| <---

  let singleSelectorStartedAt; // Used in marking is it class or id (because there's no dot/hash in front
  // when square bracket notation is used), for example:
  //
  // a[class="used"]{x:1;}
  //
  // in which case, singleSelectorType would be === "."

  let singleSelectorType; // ---------------------------------------------------------------------------
  // marker to identify when we can delete the whole CSS declaration (or "line" if you keep one style-per-line)
  //       <style type="text/css">
  //         .unused1[z].unused2, .unused3[z] {a:1;}
  //         |                                     |
  //    ---> | means we can delete all this        | <---

  let headWholeLineCanBeDeleted; // if used chunk is followed by bunch of unused chunks, that comma that follows
  // used chunk needs to be deleted. Last chunk's comma is registered at index:
  // lastKeptChunksCommaAt and flag which instructs to delete it is the
  // "onlyDeletedChunksFollow":

  let lastKeptChunksCommaAt = null;
  let onlyDeletedChunksFollow = false; // marker to identify when we can delete the whole id or class, not just some of classes/id's inside

  let bodyClassOrIdCanBeDeleted; // copy of the first round's ranges, used to skip the same ranges
  // in round 2:

  let round1RangesClone; // counters:

  let nonIndentationsWhitespaceLength = 0;
  let commentsLength = 0; // same as used in string-extract-class-names

  const badChars = `.# ~\\!@$%^&*()+=,/';:"?><[]{}|\`\t\n`; // Rules which might wrap the media queries, for example:
  // @supports (display: grid) {...
  // We need to process their contents only (and disregard their curlies).

  const atRulesWhichMightWrapStyles = ["media", "supports", "document"]; // One-liners like:
  // "@charset "utf-8";"
  // and one-liners with URL's:
  // @import url("https://codsen.com/style.css");

  const atRulesWhichNeedToBeIgnored = ["font-feature-values", "counter-style", "namespace", "font-face", "keyframes", "viewport", "charset", "import", "page"];
  const atRuleBreakCharacters = ["{", "(", "<", '"', "'", "@", ";"]; // insurance

  if (typeof str !== "string") {
    throw new TypeError(`email-remove-unused-css: [THROW_ID_01] Input must be string! Currently it's ${typeof str}`);
  }

  if (originalOpts && !isObj(originalOpts)) {
    throw new TypeError(`email-remove-unused-css: [THROW_ID_02] Options, second input argument, must be a plain object! Currently it's ${typeof originalOpts}, equal to: ${JSON.stringify(originalOpts, null, 4)}`);
  }

  const opts = { ...defaults,
    ...originalOpts
  }; // arrayiffy if string:

  if (typeof opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains === "string") {
    opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains = [opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains].filter(val => val.trim());
  }

  if (typeof opts.whitelist === "string") {
    opts.whitelist = [opts.whitelist];
  } else if (!Array.isArray(opts.whitelist)) {
    throw new TypeError(`email-remove-unused-css: [THROW_ID_03] opts.whitelist should be an array, but it was customised to a wrong thing, ${JSON.stringify(opts.whitelist, null, 4)}`);
  }

  if (opts.whitelist.length > 0 && !opts.whitelist.every(el => typeof el === "string")) {
    throw new TypeError(`email-remove-unused-css: [THROW_ID_04] opts.whitelist array should contain only string-type elements. Currently we\ve got:\n${JSON.stringify(opts.whitelist, null, 4)}`);
  }

  if (!Array.isArray(opts.backend)) {
    throw new TypeError(`email-remove-unused-css: [THROW_ID_05] opts.backend should be an array, but it was customised to a wrong thing, ${JSON.stringify(opts.backend, null, 4)}`);
  }

  if (opts.backend.length > 0 && opts.backend.some(val => !isObj(val))) {
    throw new TypeError(`email-remove-unused-css: [THROW_ID_06] opts.backend array should contain only plain objects but it contains something else:\n${JSON.stringify(opts.backend, null, 4)}`);
  }

  if (opts.backend.length > 0 && !opts.backend.every(obj => hasOwnProp(obj, "heads") && hasOwnProp(obj, "tails"))) {
    throw new TypeError(`email-remove-unused-css: [THROW_ID_07] every object within opts.backend should contain keys "heads" and "tails" but currently it's not the case. Whole "opts.backend" value array is currently equal to:\n${JSON.stringify(opts.backend, null, 4)}`);
  }

  if (typeof opts.uglify !== "boolean") {
    if (opts.uglify === 1 || opts.uglify === 0) {
      opts.uglify = !!opts.uglify; // turn it into a Boolean
    } else {
      throw new TypeError(`email-remove-unused-css: [THROW_ID_08] opts.uglify should be a Boolean. Currently it's set to: ${JSON.stringify(opts.uglify, null, 4)}}`);
    }
  }

  if (opts.reportProgressFunc && typeof opts.reportProgressFunc !== "function") {
    throw new TypeError(`email-remove-unused-css: [THROW_ID_09] opts.reportProgressFunc should be a function but it was given as :\n${JSON.stringify(opts.reportProgressFunc, null, 4)} (${typeof opts.reportProgressFunc})`);
  }

  let allHeads = null;
  let allTails = null;

  if (Array.isArray(opts.backend) && opts.backend.length) {
    allHeads = opts.backend.map(headsAndTailsObj => headsAndTailsObj.heads);
    allTails = opts.backend.map(headsAndTailsObj => headsAndTailsObj.tails);
  }

  const len = str.length;
  const leavePercForLastStage = 0.06; // in range of [0, 1]

  let ceil = 1;

  if (opts.reportProgressFunc) {
    // ceil is middle of the range [0, 100], or whatever it was customised to,
    // [opts.reportProgressFuncFrom, opts.reportProgressFuncTo].
    // Also, leavePercForLastStage needs to be left to next stage, so "100" or
    // "opts.reportProgressFuncTo" is multiplied by (1 - leavePercForLastStage).
    ceil = Math.floor((opts.reportProgressFuncTo - (opts.reportProgressFuncTo - opts.reportProgressFuncFrom) * leavePercForLastStage - opts.reportProgressFuncFrom) / 2);
  }

  let trailingLinebreakLengthCorrection = 0;

  if (!str.length || !"\r\n".includes(str[str.length - 1])) {
    // if there's no trailing line break in the input, mark this because
    // output will have it and we need to consider this for matematically
    // precise calculations:
    trailingLinebreakLengthCorrection = 1;
  } // global "do nothing" flag. When active, nothing is done, characters are just skipped.


  let doNothing; // when "doNothing" is on, only the following value can stop it:

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
  let usedOnce; // ---------------------------------------------------------------------------
  // this is the main FOR loop which will traverse the input string twice:

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
    doNothing = false; //                    inner FOR loop starts
    //                              |
    //                              |
    //                              |
    //                              |
    //                              |
    //                              |
    //                              |
    //                              |
    //                              |
    //                              V

    totalCounter += len; // eslint-disable-next-line no-restricted-syntax

    stepouter: for (let i = 0; i < len; i++) {
      //                                S
      //                                S
      //                                S
      //                                S
      //                                S
      //                                S
      //                                S
      //
      //                        RULES AT THE TOP
      //
      //                                S
      //                                S
      //                                S
      //                                S
      //                                S
      //                                S
      //                                S
      //                                S
      // Report the progress. We'll allocate 94% (47% + 47% on each traversal)
      // of the total progress bar to this stage. Now that's considering the
      // opts.reportProgressFuncFrom and opts.reportProgressFuncTo are 0-to-100.
      // If either is skewed then the value will be in that range accordingly.


      if (opts.reportProgressFunc) {
        if (len > 1000 && len < 2000) {
          // if input is too short, just call once, for the middle value
          if (round === 1 && i === 0) {
            opts.reportProgressFunc(Math.floor((opts.reportProgressFuncTo - opts.reportProgressFuncFrom) / 2) // if range is [0, 100], this would be 50
            );
          }
        } else if (len >= 2000) {
          // defaults:
          // opts.reportProgressFuncFrom = 0
          // opts.reportProgressFuncTo = 100
          currentPercentageDone = opts.reportProgressFuncFrom + Math.floor(i / len * ceil) + (round === 1 ? 0 : ceil);

          if (currentPercentageDone !== lastPercentage) {
            lastPercentage = currentPercentageDone;
            opts.reportProgressFunc(currentPercentageDone);
          }
        }
      }

      const chr = str[i]; // count line endings:

      if (str[i] === "\n") {
        if (str[i - 1] === "\r") ;
      } else if (str[i] === "\r" && str[i + 1] !== "\n") ;

      if (stateWithinStyleTag !== true && ( // a) either it's the first style tag and currently we haven't traversed
      // it's closing yet:
      styleEndedAt === null && styleStartedAt !== null && i >= styleStartedAt || // b) or, style tag was closed, later another-one was opened and we
      // haven't traversed through its closing tag yet:
      styleStartedAt !== null && styleEndedAt !== null && styleStartedAt > styleEndedAt && styleStartedAt < i)) { // ---------------------------------------------------------------------

        stateWithinStyleTag = true;
        stateWithinBody = false;
      } else if (stateWithinBody !== true && bodyStartedAt !== null && (styleStartedAt === null || styleStartedAt < i) && (styleEndedAt === null || styleEndedAt < i)) {
        stateWithinBody = true;
        stateWithinStyleTag = false;
      } //                                S
      //                                S
      //                                S
      //                                S
      //                                S
      //                                S
      //                                S
      //                                S
      //
      //                       RULES AT THE MIDDLE
      //
      //                                S
      //                                S
      //                                S
      //                                S
      //                                S
      //                                S
      //                                S
      //                                S
      // =============================================


      if (!doNothing && (str[i] === '"' || str[i] === "'")) {
        // head: protection against false early curlie endings
        // if we are "insideCurlyBraces" and any kind of quote is detected,
        // traverse until the same is met again, ignore any curlies within.
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
      } // everywhere: stop the "doNothing"
      // ================


      if (doNothing) {
        if (doNothingUntil === null || typeof doNothingUntil !== "string" || typeof doNothingUntil === "string" && !doNothingUntil) {
          // it's some bad case scenario/bug, just turn off the "doNothing"
          doNothing = false; // just turn it off and move on.
        } else if (matchRightIncl(str, i, doNothingUntil)) { // Normally doNothingUntil is a single character.
          // However, when matching back-end characters, it can be multiple chars.
          // That's why above we can't compare with '===' and need the
          // "string-match-left-right" library.
          // 1. COMMENTS-RELATED SKIPS ARE TENDED SEPARATELY:

          if (commentStartedAt !== null) {
            // submit the comment characters range for deletion:
            // logging:

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
          } // 2. ALL OTHER CASES OF "DO-NOTHING":
          // offset the index:


          i = i + doNothingUntil.length - 1; // Switch off the mode

          doNothingUntil = null;
          doNothing = false;
          continue;
        }
      } // head: pinpoint any <style... tag, anywhere within the given HTML
      // ================


      if (!doNothing && str[i] === "<" && str[i + 1] === "s" && str[i + 2] === "t" && str[i + 3] === "y" && str[i + 4] === "l" && str[i + 5] === "e") {
        checkingInsideCurlyBraces = true;

        if (!stateWithinStyleTag) {
          stateWithinStyleTag = true;
        }

        for (let y = i; y < len; y++) {
          totalCounter += 1;

          if (str[y] === ">") {
            styleStartedAt = y + 1;
            ruleChunkStartedAt = y + 1; // We can offset the main index ("jump" to an already-traversed closing
            // closing bracket character of <style.....> tag because this tag
            // will not have any CLASS or ID attributes).
            // We would not do that with BODY tag for example.
            // Offset the index because we traversed it already:
            // i = y;
            break; // continue stepouter;
          }
        }
      } // head: pinpoint closing style tag, </style>
      // It's not that easy.
      // There can be whitespace to the left and right of closing slash.
      // ================


      if (!doNothing && stateWithinStyleTag && str[i] === "<" && str[i + 1] === "/" && str[i + 2] === "s" && str[i + 3] === "t" && str[i + 4] === "y" && str[i + 5] === "l" && str[i + 6] === "e") {
        // TODO: take care of any spaces around: 1. slash; 2. brackets
        styleEndedAt = i - 1; // we don't need the chunk end tracking marker any more

        ruleChunkStartedAt = null;
        checkingInsideCurlyBraces = false;

        if (stateWithinStyleTag) {
          stateWithinStyleTag = false;
        }
      } // mark where CSS comments start - ROUND 1-only rule
      // ================


      if (round === 1 && (stateWithinStyleTag || stateWithinBody) && str[i] === "/" && str[i + 1] === "*" && commentStartedAt === null) {
        // 1. mark the beginning
        commentStartedAt = i; // 2. activate doNothing:

        doNothing = true;
        doNothingUntil = "*/"; // just over the "*":

        i += 1;
        continue;
      } // pinpoint "@"


      if (!doNothing && stateWithinStyleTag && str[i] === "@") { // since we are going to march forward, rest the whitespaceStartedAt
        // marker since it might not get reset otherwise

        if (whitespaceStartedAt) {
          whitespaceStartedAt = null;
        }

        const matchedAtTagsName = matchRight(str, i, atRulesWhichMightWrapStyles) || matchRight(str, i, atRulesWhichNeedToBeIgnored);

        if (typeof matchedAtTagsName === "string") {
          let temp; // rare case when semicolon follows the at-tag - in that
          // case, we remove the at-rule because it's broken

          if (str[i + matchedAtTagsName.length + 1] === ";" || str[i + matchedAtTagsName.length + 1] && !str[i + matchedAtTagsName.length + 1].trim() && matchRight(str, i + matchedAtTagsName.length + 1, ";", {
            trimBeforeMatching: true,
            cb: (_char, _theRemainderOfTheString, index) => {
              temp = index;
              return true;
            }
          })) {
            finalIndexesToDelete.push(i, temp || i + matchedAtTagsName.length + 2);
          } // these can wrap styles and each other and their pesky curlies can throw
          // our algorithm off-track. We need to jump past the chunk from "@..."
          // to, and including, first curly bracket. But mind the dirty code cases.


          let secondaryStopper;

          for (let z = i + 1; z < len; z++) {
            totalCounter += 1; // ------------------------------------------------------------------
            // a secondary stopper is any character which must be matched with its
            // closing counterpart before anything continues. For example, we look
            // for semicolon. On the way, we encounter an opening bracket. Now,
            // we must march forward until we meet closing bracket. If, in the way,
            // we encounter semicolon, it will be ignored, only closing bracket is
            // what we look. When it is found, THEN continue looking for (new) semicolon.
            // catch the ending of a secondary stopper

            if (secondaryStopper && str[z] === secondaryStopper) {

              if (str[z] === "}" && atRulesWhichNeedToBeIgnored.includes(matchedAtTagsName) || str[z] === "{" && atRulesWhichMightWrapStyles.includes(matchedAtTagsName)) {
                i = z;
                ruleChunkStartedAt = z + 1;
                continue stepouter;
              } else {
                secondaryStopper = undefined;
                continue; // continue stepouter;
              }
            } // set the seconddary stopper


            if (str[z] === '"' && !secondaryStopper) {
              secondaryStopper = '"';
            } else if (str[z] === "'" && !secondaryStopper) {
              secondaryStopper = "'";
            } else if (str[z] === "(" && !secondaryStopper) {
              secondaryStopper = ")";
            } else if (atRulesWhichNeedToBeIgnored.includes(matchedAtTagsName) && str[z] === "{" && !secondaryStopper) {
              secondaryStopper = "}";
            } // catch the final, closing character


            if (!secondaryStopper && atRuleBreakCharacters.includes(str[z])) {
              // ensure that any wrapped chunks get completely covered and their
              // contents don't trigger any clauses. There can be links with "@"
              // for example, and there can be stray tags like @media @media.
              // These two different cases can be recognised by requiring that any
              // wrapped chunks like {...} or (...) or "..." or '...' get covered
              // completely before anything else is considered. // bail out clauses

              let pushRangeFrom;
              let pushRangeTo; // normal cases:

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
      } // pinpoint closing curly braces
      // ================


      if (!doNothing && stateWithinStyleTag && insideCurlyBraces && checkingInsideCurlyBraces && chr === "}" && !currentlyWithinQuotes && !curliesDepth) { // submit whole chunk for deletion if applicable:

        if (round === 2 && headWholeLineCanBeDeleted && ruleChunkStartedAt) {
          finalIndexesToDelete.push(ruleChunkStartedAt, i + 1);
        }

        insideCurlyBraces = false;

        if (ruleChunkStartedAt) {
          ruleChunkStartedAt = i + 1;
        } // reset selectorChunkStartedAt:


        selectorChunkStartedAt = null;
        selectorChunkCanBeDeleted = false;
        headWholeLineCanBeDeleted = true;
        singleSelectorStartedAt = null;
        lastKeptChunksCommaAt = null;
        onlyDeletedChunksFollow = false;
      } // catch the beginning/ending of CSS selectors in head
      // ================
      // markers we'll be dealing with:
      // * selectorChunkStartedAt
      // * ruleChunkStartedAt
      // * selectorChunkCanBeDeleted
      // * singleSelectorStartedAt
      // * headWholeLineCanBeDeleted


      if (!doNothing && !commentStartedAt && styleStartedAt && i >= styleStartedAt && ( // a) either it's the first style tag and currently we haven't traversed
      // its closing yet:
      styleEndedAt === null && i >= styleStartedAt || // b) or, style tag was closed, later another-one was opened and we
      // haven't traversed through its closing tag yet:
      styleEndedAt && styleStartedAt > styleEndedAt && styleStartedAt <= i) && !insideCurlyBraces) { // TODO: skip all false-positive characters within quotes, like curlies
        // PART 1.
        // catch the START of single selectors (for example, "#head-only-id-2")
        // any character, not permitted in CSS class/id names stops the recording

        if (singleSelectorStartedAt === null) {
          // catch the start of a single
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
            // logging:

            if (chr === "}") {
              ruleChunkStartedAt = i + 1;
              currentChunk = null;
            } else if (chr === "<" && str[i + 1] === "!") {
              // catch comment blocks, probably Outlook conditional comments
              // like <!--[if mso]>

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
        } // catch the END of a single selectors
        else if (singleSelectorStartedAt !== null && !characterSuitableForNames(chr)) {
            let singleSelector = str.slice(singleSelectorStartedAt, i);

            if (singleSelectorType) {
              singleSelector = `${singleSelectorType}${singleSelector}`;
              singleSelectorType = undefined;
            }

            if (round === 2 && !selectorChunkCanBeDeleted && headCssToDelete.includes(singleSelector)) {
              selectorChunkCanBeDeleted = true;
              onlyDeletedChunksFollow = true;
            } else if (round === 2 && !selectorChunkCanBeDeleted) { // 1. uglify part

              if (opts.uglify && (!Array.isArray(opts.whitelist) || !opts.whitelist.length || !matcher([singleSelector], opts.whitelist).length)) {
                currentChunksMinifiedSelectors.push(singleSelectorStartedAt, i, allClassesAndIdsWithinHeadFinalUglified[allClassesAndIdsWithinHeadFinal.indexOf(singleSelector)]);
              } // 2. tend trailing comma issue (lastKeptChunksCommaAt and
              // onlyDeletedChunksFollow):


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
          } // PART 2.
        // catch the selectorChunks (for example, #head-only-id-2.real-class-1[lang|en]):
        // only opening curly brace or comma stops the recording.


        if (selectorChunkStartedAt === null) { // catch the start of a chunk
          // if (chr === "." || chr === "#") {

          if (chr.trim() && chr !== "}" && chr !== ";" && !(str[i] === "/" && str[i + 1] === "*")) {
            // reset the deletion flag:
            selectorChunkCanBeDeleted = false; // set the chunk's starting marker:

            selectorChunkStartedAt = i;
          }
        } // catch the ending of a chunk
        else if (",{".includes(chr)) {
            const sliceTo = whitespaceStartedAt || i;
            currentChunk = str.slice(selectorChunkStartedAt, sliceTo);

            if (round === 1) {
              // delete whitespace in front of commas or more than two spaces
              // in front of opening curly braces:
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
            } // it's round 2
            else if (selectorChunkCanBeDeleted) {
                let fromIndex = selectorChunkStartedAt;
                let toIndex = i;
                let tempFindingIndex = 0;

                if (chr === "{" && str[fromIndex - 1] !== ">" && str[fromIndex - 1] !== "}") {
                  // take care not to loop backwards from ending of <!--[if mso]>
                  // also, not to loop then CSS is minified, imagine,
                  // we're at here:
                  // .col-3{z:2%}.col-4{y:3%}
                  //             ^
                  //            here
                  //
                  // 1. expand the left side to include comma, if such is present

                  for (let y = selectorChunkStartedAt; y--;) {
                    totalCounter += 1;

                    if (str[y].trim() && str[y] !== ",") {
                      fromIndex = y + 1;
                      break;
                    }
                  } // 2. if we're on the opening curly brace currently and there's
                  // a space in front of it, we need to go back by 1 character
                  // to retain that single space in front of opening curly.
                  // Otherwise, we'd crop tightly up to curly which would be wrong.

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
                  fromIndex = tempFindingIndex + 2; // "1" being the length of
                  // the finding, the "{" then another + "1" to get to the right
                  // side of opening curly.
                }
                const resToPush = expander({
                  str,
                  from: fromIndex,
                  to: toIndex,
                  ifRightSideIncludesThisThenCropTightly: ".#",
                  ifRightSideIncludesThisCropItToo: ",",
                  extendToOneSide: "right"
                });
                finalIndexesToDelete.push(...resToPush); // wipe any gathered selectors to be uglified

                if (opts.uglify) {
                  currentChunksMinifiedSelectors.wipe();
                }
              } else {
                // not selectorChunkCanBeDeleted
                // 1. reset headWholeLineCanBeDeleted
                if (headWholeLineCanBeDeleted) {
                  headWholeLineCanBeDeleted = false;
                } // 2. reset onlyDeletedChunksFollow because this chunk was not
                // deleted, so this breaks the chain of "onlyDeletedChunksFollow"


                if (onlyDeletedChunksFollow) {
                  onlyDeletedChunksFollow = false;
                } // 3. tend uglification


                if (opts.uglify) {
                  finalIndexesToDelete.push(currentChunksMinifiedSelectors.current());
                  currentChunksMinifiedSelectors.wipe();
                }
              } // wipe the marker:


            if (chr !== "{") {
              selectorChunkStartedAt = null;
            } else if (round === 2) {
              // the last chunk was reached so let's evaluate, can we delete
              // the whole "row": // Cater the case when there was used class/id, comma, then at
              // least one unused class/id after (only unused-ones after, no
              // used classes/id's follow).

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

                finalIndexesToDelete.push(lastKeptChunksCommaAt, deleteUpTo); // reset:

                lastKeptChunksCommaAt = null;
                onlyDeletedChunksFollow = false;
              }
            }
          } //

      } // catch the closing body tag
      // ================


      if (!doNothing && !stateWithinStyleTag && stateWithinBody && str[i] === "/" && matchRight(str, i, "body", {
        trimBeforeMatching: true,
        i: true
      }) && matchLeft(str, i, "<", {
        trimBeforeMatching: true
      })) {
        stateWithinBody = false;
        bodyStartedAt = null;
      } // catch the opening body tag
      // ================


      if (!doNothing && str[i] === "<" && matchRight(str, i, "body", {
        i: true,
        trimBeforeMatching: true,
        cb: (char, _theRemainderOfTheString, index) => {
          // remove any whitespace after opening bracket of a body tag:
          if (round === 1) {
            if (char !== undefined && (char.trim() === "" || char === ">") && typeof index === "number") {
              if (index - i > 5) {
                finalIndexesToDelete.push(i, index, "<body"); // remove the whitespace between < and body

                nonIndentationsWhitespaceLength += index - i - 5;
              } else {
                // do nothing
                return true;
              }
            }

            return true;
          } // do nothing in round 2 because fix will already be implemented
          // during round 1:


          return true;
        }
      })) {
        // Find the ending of the body tag:

        for (let y = i; y < len; y++) {
          totalCounter += 1;

          if (str[y] === ">") {
            bodyStartedAt = y + 1; // we can't offset the index because there might be unused classes
            // or id's on the body tag itself.

            break;
          }
        }
      } // catch the start of a style attribute within body
      // ================


      if (!doNothing && stateWithinBody && !stateWithinStyleTag && str[i] === "s" && str[i + 1] === "t" && str[i + 2] === "y" && str[i + 3] === "l" && str[i + 4] === "e" && str[i + 5] === "=" && badChars.includes(str[i - 1]) // this is to prevent false positives like attribute "urlid=..."
      ) {
          // TODO - tend the case when there are spaces around equal in style attribute
          if (`"'`.includes(str[i + 6])) ;
        } // catch the start of a class attribute within body
      // ================


      if (!doNothing && stateWithinBody && !stateWithinStyleTag && !currentlyWithinQuotes && str[i] === "c" && str[i + 1] === "l" && str[i + 2] === "a" && str[i + 3] === "s" && str[i + 4] === "s" && // a character in front exists
      str[i - 1] && // it's a whitespace character
      !str[i - 1].trim()) {
        // TODO: record which double quote it was exactly, single or double
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
          // loop forward:
          for (let y = i + 5; y < len; y++) {
            totalCounter += 1;

            if (str[y].trim()) {
              // 1. is it the "equals" character?
              if (str[y] === "=") {
                // 1-1. remove this gap:
                if (y > i + 5 && round === 1) {
                  finalIndexesToDelete.push(i + 5, y);
                } // 1-2. check what's next:


                if ((str[y + 1] === '"' || str[y + 1] === "'") && str[y + 2]) {
                  // 1-2-1. we found where values start:
                  valuesStart = y + 2;
                } else if (str[y + 1] && !str[y + 1].trim()) {
                  // 1-2-2. traverse even more forward:
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
              } // // not equals is followed by "class" attribute's name
              // else if (round === 1) {
              //   const calculatedRange = expander({
              //     str,
              //     from: i,
              //     to: y - 1, // leave that space in front
              //     ifRightSideIncludesThisThenCropTightly: "/>",
              //     wipeAllWhitespaceOnLeft: true,
              //   });
              //   console.log(
              //     `1856 PUSH ${JSON.stringify(calculatedRange, null, 0)}`
              //   );
              //   finalIndexesToDelete.push(...calculatedRange);
              // }
              // 2. stop anyway


              break;
            }
          }
        }

        if (valuesStart) {
          // 1. mark it
          bodyClass = resetBodyClassOrId({
            valuesStart,
            quoteless,
            nameStart: i
          }); // 2. resets:

          if (round === 1) {
            bodyItsTheFirstClassOrId = true;
          } else if (round === 2) {
            // 2. reset the we-can-delete-whole-class/id marker:
            bodyClassOrIdCanBeDeleted = true;
          }
        }
      } // catch the start of an id attribute within body
      // ================


      if (!doNothing && stateWithinBody && !stateWithinStyleTag && !currentlyWithinQuotes && str[i] === "i" && str[i + 1] === "d" && // a character in front exists
      str[i - 1] && // it's a whitespace character
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
          // loop forward:
          for (let y = i + 2; y < len; y++) {
            totalCounter += 1;

            if (str[y].trim()) {
              // 1. is it the "equals" character?
              if (str[y] === "=") {
                // 1-1. remove this gap:
                if (y > i + 2 && round === 1) {
                  finalIndexesToDelete.push(i + 2, y);
                } // 1-2. check what's next:


                if ((str[y + 1] === '"' || str[y + 1] === "'") && str[y + 2]) {
                  // 1-2-1. we found where values start:
                  valuesStart = y + 2;
                } else if (str[y + 1] && !str[y + 1].trim()) {
                  // 1-2-2. traverse even more forward:
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
              } // // not equals is followed by "id" attribute's name
              // else if (round === 1) {
              //   const calculatedRange = expander({
              //     str,
              //     from: i,
              //     to: y - 1, // leave that space in front
              //     ifRightSideIncludesThisThenCropTightly: "/>",
              //     wipeAllWhitespaceOnLeft: true,
              //   });
              //   console.log(
              //     `1987 PUSH ${JSON.stringify(calculatedRange, null, 0)}`
              //   );
              //   finalIndexesToDelete.push(...calculatedRange);
              // }
              // 2. stop anyway


              break;
            }
          }
        }

        if (valuesStart) {
          // 1. mark it
          bodyId = resetBodyClassOrId({
            valuesStart,
            quoteless,
            nameStart: i
          }); // 2. resets:

          if (round === 1) {
            bodyItsTheFirstClassOrId = true;
          } else if (round === 2) {
            // 2. reset the we-can-delete-whole-class/id marker:
            bodyClassOrIdCanBeDeleted = true;
          }
        }
      } // body: catch the first letter within each class attribute
      // ================


      if (!doNothing && bodyClass.valuesStart !== null && i >= bodyClass.valuesStart && bodyClass.valueStart === null) {
        if (allHeads && matchRightIncl(str, i, allHeads)) {
          // 1. activate do-nothing flag
          doNothing = true; // 2. mark this class as not to be removed (as a whole)

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
          } // 3. set doNothingUntil to corresponding tails


          const matchedHeads = matchRightIncl(str, i, allHeads);
          const findings = opts.backend.find(headsTailsObj => headsTailsObj.heads === matchedHeads);

          if (findings && findings.tails) {
            doNothingUntil = findings.tails;
          }
        } else if (characterSuitableForNames(chr)) {
          // 1. mark the class' starting index
          bodyClass.valueStart = i; // 2. maybe there was whitespace between quotes and this?, like class="  zzz"

          if (round === 1) {
            //
            if (bodyItsTheFirstClassOrId && bodyClass.valuesStart !== null && !str.slice(bodyClass.valuesStart, i).trim() && bodyClass.valuesStart < i) {
              // 1. submit the whitespace characters in the range for deletion:
              finalIndexesToDelete.push(bodyClass.valuesStart, i);
              nonIndentationsWhitespaceLength += i - bodyClass.valuesStart; // 2. disable bodyItsTheFirstClassOrId flag so we won't waste resources on
              // further classes/id's:

              bodyItsTheFirstClassOrId = false;
            } else if (whitespaceStartedAt !== null && whitespaceStartedAt < i - 1) {
              // maybe there's whitespace between classes?
              finalIndexesToDelete.push(whitespaceStartedAt + 1, i);
              nonIndentationsWhitespaceLength += i - whitespaceStartedAt + 1;
            }
          }
        }
      } // catch the ending of a class name
      // ================


      if (!doNothing && bodyClass.valueStart !== null && i > bodyClass.valueStart && (!characterSuitableForNames(chr) || allTails && matchRightIncl(str, i, allTails))) {
        // insurance against ESP tag joined with a class
        // <table class="zzz-{{ loop.index }}">
        if (allHeads && matchRightIncl(str, i, allHeads)) {
          bodyClass.valueStart = null;
          bodyClass = resetBodyClassOrId();
          const matchedHeads = matchRightIncl(str, i, allHeads);
          const findings = opts.backend.find(headsTailsObj => headsTailsObj.heads === matchedHeads);

          if (findings && findings.tails) {
            doNothingUntil = findings.tails;
          }
        } else {
          // normal operations can continue
          const carvedClass = `${str.slice(bodyClass.valueStart, i)}`; // console.log(
          //   `2206 R1 = ${!!(allTails && matchRightIncl(str, i, allTails))}`
          // );
          // console.log(`2208 R2 = ${!!matchRightIncl(str, i, allTails)}`);
          // console.log(
          //   `2210 R3 = ${!!(allHeads && matchRightIncl(str, i, allHeads))}`
          // );

          if (round === 1) {
            bodyClassesArr.push(`.${carvedClass}`);
          } // round 2
          else if (bodyClass.valueStart != null && bodyClassesToDelete.includes(carvedClass)) {
              // submit this class for deletion
              const expandedRange = expander({
                str,
                from: bodyClass.valueStart,
                to: i,
                ifLeftSideIncludesThisThenCropTightly: `"'`,
                ifRightSideIncludesThisThenCropTightly: `"'`,
                wipeAllWhitespaceOnLeft: true
              }); // precaution against too tight crop when backend markers are involved

              let whatToInsert = "";

              if (str[expandedRange[0] - 1] && str[expandedRange[0] - 1].trim() && str[expandedRange[1]] && str[expandedRange[1]].trim() && (allHeads || allTails) && (allHeads && matchLeft(str, expandedRange[0], allTails) || allTails && matchRightIncl(str, expandedRange[1], allHeads))) {
                whatToInsert = " ";
              }

              finalIndexesToDelete.push(...expandedRange, whatToInsert);
            } else {
              // 1. turn off the bodyClassOrIdCanBeDeleted
              bodyClassOrIdCanBeDeleted = false; // 2. uglify?

              if (opts.uglify && !(Array.isArray(opts.whitelist) && opts.whitelist.length && matcher([`.${carvedClass}`], opts.whitelist).length)) {
                finalIndexesToDelete.push(bodyClass.valueStart, i, allClassesAndIdsWithinHeadFinalUglified[allClassesAndIdsWithinHeadFinal.indexOf(`.${carvedClass}`)].slice(1));
              }
            }

          bodyClass.valueStart = null;
        }
      } // catch the ending of an id name
      // ================


      if (!doNothing && bodyId && bodyId.valueStart !== null && i > bodyId.valueStart && (!characterSuitableForNames(chr) || allTails && matchRightIncl(str, i, allTails))) {
        const carvedId = str.slice(bodyId.valueStart, i);

        if (round === 1) {
          bodyIdsArr.push(`#${carvedId}`);
        } // round 2
        else if (bodyId.valueStart != null && bodyIdsToDelete.includes(carvedId)) {
            // submit this id for deletion
            const expandedRange = expander({
              str,
              from: bodyId.valueStart,
              to: i,
              ifRightSideIncludesThisThenCropTightly: `"'`,
              wipeAllWhitespaceOnLeft: true
            }); // precaution against too tight crop when backend markers are involved

            if (str[expandedRange[0] - 1] && str[expandedRange[0] - 1].trim() && str[expandedRange[1]] && str[expandedRange[1]].trim() && (allHeads || allTails) && (allHeads && matchLeft(str, expandedRange[0], allTails || []) || allTails && matchRightIncl(str, expandedRange[1], allHeads || []))) {
              expandedRange[0] += 1;
            }

            finalIndexesToDelete.push(...expandedRange);
          } else {
            // 1. turn off the bodyClassOrIdCanBeDeleted
            bodyClassOrIdCanBeDeleted = false; // 2. uglify?

            if (opts.uglify && !(Array.isArray(opts.whitelist) && opts.whitelist.length && matcher([`#${carvedId}`], opts.whitelist).length)) {
              finalIndexesToDelete.push(bodyId.valueStart, i, allClassesAndIdsWithinHeadFinalUglified[allClassesAndIdsWithinHeadFinal.indexOf(`#${carvedId}`)].slice(1));
            }
          }

        bodyId.valueStart = null;
      } // body: stop the class attribute's recording if closing single/double quote encountered
      // ================
      // TODO: replace chr check against any quote with exact quote that was previously recorded on opening


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
          // 1. if it's second round and by now the delete-whole-class/id marker
          // is active (no skipped classes/id which had turn it off yet) then
          // delete this class or id completely:
          if (round === 2 && bodyClassOrIdCanBeDeleted) {
            // 1. submit the range of whole class/id for deletion
            // finalIndexesToDelete.push(bodyClass.valuesStart - 7, i + 1);
            const expandedRange = expander({
              str,
              from: bodyClass.valuesStart - 7,
              to: `'"`.includes(str[i]) ? i + 1 : i,
              ifRightSideIncludesThisThenCropTightly: "/>",
              wipeAllWhitespaceOnLeft: true
            }); // precaution against too tight crop when backend markers are involved

            let whatToInsert = "";

            if (str[expandedRange[0] - 1] && str[expandedRange[0] - 1].trim() && str[expandedRange[1]] && str[expandedRange[1]].trim() && !"/>".includes(str[expandedRange[1]]) // (allHeads || allTails) &&
            // ((allHeads && matchLeft(str, expandedRange[0], allHeads)) ||
            //   (allTails && matchRightIncl(str, expandedRange[1], allTails)))
            ) {
                whatToInsert = " ";
              }

            finalIndexesToDelete.push(...expandedRange, whatToInsert);
          } // 3. tend the trailing whitespace, as in class="zzzz  "


          if (whitespaceStartedAt !== null) {
            finalIndexesToDelete.push(whitespaceStartedAt, i);
          }
        } // 2. reset the marker


        bodyClass = resetBodyClassOrId();
      } // body: stop the id attribute's recording if closing single/double quote encountered
      // ================
      // TODO: replace chr check against any quote with exact quote that was previously


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
          // not an empty id attribute
          // 1. if it's second round and by now the delete-whole-class/id marker
          // is active (no skipped classes/id which had turn it off yet) then
          // delete this class or id completely:
          if (round === 2 && bodyClassOrIdCanBeDeleted) {
            // 1. submit the range of whole class/id for deletion
            const expandedRange = expander({
              str,
              from: bodyId.valuesStart - 4,
              to: i + 1,
              ifRightSideIncludesThisThenCropTightly: "/>",
              wipeAllWhitespaceOnLeft: true
            }); // precaution against too tight crop when backend markers are involved

            let whatToInsert = "";

            if (str[expandedRange[0] - 1] && str[expandedRange[0] - 1].trim() && str[expandedRange[1]] && str[expandedRange[1]].trim() && !"/>".includes(str[expandedRange[1]]) // (allHeads || allTails) &&
            // ((allHeads && matchLeft(str, expandedRange[0], allHeads)) ||
            //   (allTails && matchRightIncl(str, expandedRange[1], allTails)))
            ) {
                whatToInsert = " ";
              }

            finalIndexesToDelete.push(...expandedRange, whatToInsert);
          } // 3. tend the trailing whitespace, as in id="zzzz  "


          if (whitespaceStartedAt !== null) {
            finalIndexesToDelete.push(whitespaceStartedAt, i);
          }
        } // reset the marker in either case


        bodyId = resetBodyClassOrId();
      } // body: catch the first letter within each id attribute
      // ================


      if (!doNothing && bodyId.valuesStart && i >= bodyId.valuesStart && bodyId.valueStart === null) {
        if (allHeads && matchRightIncl(str, i, allHeads)) {
          // 1. activate do-nothing flag
          doNothing = true; // 2. mark this id as not to be removed (as a whole)

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
          } // 3. set doNothingUntil to corresponding tails


          const matchedHeads = matchRightIncl(str, i, allHeads);
          const findings = opts.backend.find(headsTailsObj => headsTailsObj.heads === matchedHeads);

          if (findings && findings.tails) {
            doNothingUntil = findings.tails;
          }
        } else if (characterSuitableForNames(chr)) {
          // 1. mark the id's starting index
          bodyId.valueStart = i; // 2. maybe there was whitespace between quotes and this?, like id="  zzz"

          if (round === 1) {
            //
            if (bodyItsTheFirstClassOrId && bodyId.valuesStart !== null && !str.slice(bodyId.valuesStart, i).trim() && bodyId.valuesStart < i) {
              // 1. submit the whitespace characters in the range for deletion:
              finalIndexesToDelete.push(bodyId.valuesStart, i);
              nonIndentationsWhitespaceLength += i - bodyId.valuesStart; // 2. disable bodyItsTheFirstClassOrId flag so we won't waste resources on
              // further classes/id's:

              bodyItsTheFirstClassOrId = false;
            } else if (whitespaceStartedAt !== null && whitespaceStartedAt < i - 1) {
              // maybe there's whitespace between classes?
              finalIndexesToDelete.push(whitespaceStartedAt + 1, i);
              nonIndentationsWhitespaceLength += i - whitespaceStartedAt + 1;
            }
          }
        }
      } // body: catch the start and end of HTML comments
      // ================


      if (!doNothing && round === 1) {
        // 1. catch the HTML comments' cut off point to check for blocking
        // characters (mso, IE, whatever given in the
        // opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains)
        // ==================================
        if (commentStartedAt !== null && commentStartedAt < i && str[i] === ">" && !usedOnce) {

          if (opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains && Array.isArray(opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains) && opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.length && opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.some(val => val.trim() && str.slice(commentStartedAt, i).toLowerCase().includes(val))) {
            canDelete = false;
          }

          usedOnce = true;
        } // 2. catch the HTML comments' ending
        // ==================================


        if (commentStartedAt !== null && str[i] === ">") { // 1. catch healthy comment ending

          if (!bogusHTMLComment && str[i - 1] === "-" && str[i - 2] === "-") {
            // not bogus
            const calculatedRange = expander({
              str,
              from: commentStartedAt,
              to: i + 1,
              wipeAllWhitespaceOnLeft: true,
              addSingleSpaceToPreventAccidentalConcatenation: true
            });

            if (opts.removeHTMLComments && canDelete) {
              // Instead of finalIndexesToDelete.push(i, y + 3); use expander()
              // so that we manage the whitespace outwards properly:
              finalIndexesToDelete.push(...calculatedRange);
            }

            commentsLength += calculatedRange[1] - calculatedRange[0]; // reset the markers:

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

            commentsLength += calculatedRange[1] - calculatedRange[0]; // reset the markers:

            commentStartedAt = null;
            bogusHTMLComment = undefined;
          }
        } // 3. catch the HTML comments' starting
        // ====================================


        if (opts.removeHTMLComments && commentStartedAt === null && str[i] === "<" && str[i + 1] === "!") {
          if ((!allHeads || Array.isArray(allHeads) && allHeads.length && !allHeads.includes("<!")) && (!allTails || Array.isArray(allTails) && allTails.length && !allTails.includes("<!"))) { // 3.1. if there's no DOCTYPE on the right, mark the comment's start,
            // except in cases when it's been whitelisted (Outlook conditionals for example):

            if (!matchRight(str, i + 1, "doctype", {
              i: true,
              trimBeforeMatching: true
            }) && !(str[i + 2] === "-" && str[i + 3] === "-" && Array.isArray(opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains) && opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.length && matchRight(str, i + 3, opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains, {
              trimBeforeMatching: true
            }))) {
              commentStartedAt = i;
              usedOnce = false;
              canDelete = true;
            } // 3.2. detect, is it healthy or bogus comment (bogusHTMLComment = true/false)


            bogusHTMLComment = !(str[i + 2] === "-" && str[i + 3] === "-");
          } // if the comment beginning rule was not triggered, mark it as
          // would-have-been comment anyway because we need to cater empty
          // comment chunks ("<!-- -->") which follow conditional not-Outlook
          // comment chunks and without this, there's no way to know that
          // regular comment chunk was in front.


          if (commentStartedAt !== i) {
            commentNearlyStartedAt = i;
          }
        }
      } //                                S
      //                                S
      //                                S
      //                                S
      //                                S
      //                                S
      //                                S
      //                                S
      //
      //                       RULES AT THE BOTTOM
      //
      //                                S
      //                                S
      //                                S
      //                                S
      //                                S
      //                                S
      //                                S
      //                                S
      // reduce curliesDepth on each closing curlie met
      // ================


      if (chr === "}" && curliesDepth) {
        curliesDepth -= 1;
      } // pinpoint opening curly braces (in head styles), but not @media's.
      // ================


      if (!doNothing && chr === "{" && checkingInsideCurlyBraces) {
        if (!insideCurlyBraces) {
          // 1. flip the flag
          insideCurlyBraces = true; // 2. if the whitespace was in front and it contained line breaks, wipe
          // that whitespace:

          if (whitespaceStartedAt !== null && (str.slice(whitespaceStartedAt, i).includes("\n") || str.slice(whitespaceStartedAt, i).includes("\r"))) {
            finalIndexesToDelete.push(whitespaceStartedAt, i);
          }
        } else {
          curliesDepth += 1;
        }
      } // catch the whitespace


      if (!doNothing) {
        if (!str[i].trim()) {
          if (whitespaceStartedAt === null) {
            whitespaceStartedAt = i; // console.log(
            //   `2974 SET ${`\u001b[${33}m${`whitespaceStartedAt`}\u001b[${39}m`} = ${whitespaceStartedAt}`
            // );
          }
        } else if (whitespaceStartedAt !== null) {
          // reset the marker
          whitespaceStartedAt = null;
        }
      } // query the ranges clone from round 1, get the first range,
      // if current index is at the "start" index of that range,
      // offset the current index to its "to" index. This way,
      // in round 2 we "jump" over what was submitted for deletion
      // in round 1.


      if (!doNothing && round === 2 && Array.isArray(round1RangesClone) && round1RangesClone.length && i === round1RangesClone[0][0]) {
        // offset index, essentially "jumping over" what was submitted for deletion in round 1
        const temp = round1RangesClone.shift();

        if (temp && temp[1] - 1 > i) {
          i = temp[1] - 1;
        } // if (doNothing) {
        //   doNothing = false;
        //   console.log(
        //     `3015 SET ${`\u001b[${33}m${`doNothing`}\u001b[${39}m`} = false`
        //   );
        // }
        // if (ruleChunkStartedAt !== null) {
        //   ruleChunkStartedAt = i + 1;
        //   console.log(
        //     `3021 SET \u001b[${33}m${`ruleChunkStartedAt`}\u001b[${39}m = ${ruleChunkStartedAt}`
        //   );
        // }
        // if (selectorChunkStartedAt !== null) {
        //   selectorChunkStartedAt = i + 1;
        //   console.log(
        //     `3027 SET \u001b[${33}m${`selectorChunkStartedAt`}\u001b[${39}m = ${selectorChunkStartedAt}`
        //   );
        // }


        continue;
      } // catch would-have-been comment endings


      if (commentNearlyStartedAt !== null && str[i] === ">") {
        // 1. reset the marker
        commentNearlyStartedAt = null; // 2. check, is there empty comment block on the right which sometimes
        // follows outlook conditionals

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
      } // LOGGING:

    } //
    //
    //
    //
    //
    //
    //              F R U I T S   O F   T H E   L A B O U R
    //
    //
    //
    //
    //
    //


    if (round === 1) {
      //
      //
      //
      //
      //
      //
      //
      //
      allClassesAndIdsWithinBody = uniq(bodyClassesArr.concat(bodyIdsArr)); // extract all classes or id's from `headSelectorsArr` and get count of each.
      // That's so we can later exclude sandwitched classes. Each time "collateral"
      // legit, but sandwitched with false-one class gets deleted, we keep count, and
      // later compare totals with these below.
      // If it turns out that a class was in both head and body, but it was sandwitched
      // with unused classes and removed as collateral, we need to remove it from body too.
      // starting point is the selectors, removed from head during first stage.
      headSelectorsArr.forEach(el => {
        extract(el).res.forEach(selector => {
          if (Object.prototype.hasOwnProperty.call(headSelectorsCount, selector)) {
            headSelectorsCount[selector] += 1;
          } else {
            headSelectorsCount[selector] = 1;
          }
        });
      }); // create a working copy of `headSelectorsCount` which we'll mutate, subtracting
      // each deleted class/id:

      headSelectorsCountClone = { ...headSelectorsCount
      }; // compile list of to-be-terminated
      // ================

      allClassesAndIdsWithinHead = uniq(headSelectorsArr.reduce((arr, el) => arr.concat(extract(el).res), []));
      countBeforeCleaning = allClassesAndIdsWithinHead.length; // to avoid false positives, let's apply two cycles when removing unused classes/id's from head:
      // ---------------------------------------
      // TWO-CYCLE UNUSED CSS IDENTIFICATION:
      // ---------------------------------------
      // cycle #1 - remove comparing separate classes/id's from body against
      // potentially sandwitched lumps from head. Let's see what's left afterwards.
      // ================

      const preppedHeadSelectorsArr = Array.from(headSelectorsArr);
      let deletedFromHeadArr = [];

      for (let y = 0, len2 = preppedHeadSelectorsArr.length; y < len2; y++) {
        totalCounter += 1;
        let temp; // intentional loose comparison !=, that's existy():

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
      } // console.log(`\n* preppedAllClassesAndIdsWithinHead = ${JSON.stringify(preppedAllClassesAndIdsWithinHead, null, 4)}`)
      // cycle #2 - now treat remaining lumps as definite sources of
      // "what classes or id's are present in the head"
      // use "preppedAllClassesAndIdsWithinHead" as a head selector reference when comparing
      // against the body classes/id's.
      // ================


      headCssToDelete = pull(pullAll(uniq(Array.from(allClassesAndIdsWithinHead)), bodyClassesArr.concat(bodyIdsArr)), opts.whitelist);
      bodyCssToDelete = uniq(pull(pullAll(bodyClassesArr.concat(bodyIdsArr), preppedAllClassesAndIdsWithinHead), opts.whitelist)); // now that we know final to-be-deleted selectors list, compare them with `deletedFromHeadArr`
      // and fill any missing CSS in `headCssToDelete`:

      headCssToDelete = uniq(headCssToDelete.concat(intersection(deletedFromHeadArr, bodyCssToDelete)));
      bodyClassesToDelete = bodyCssToDelete.filter(s => s.startsWith(".")).map(s => s.slice(1));
      bodyIdsToDelete = bodyCssToDelete.filter(s => s.startsWith("#")).map(s => s.slice(1));
      allClassesAndIdsThatWereCompletelyDeletedFromHead = Object.keys(headSelectorsCountClone).filter(singleSelector => headSelectorsCountClone[singleSelector] < 1); // at this point, if any classes in `headSelectorsCountClone` have zero counters
      // that means those have all been deleted from head.

      bodyClassesToDelete = uniq(bodyClassesToDelete.concat(intersection(pull(allClassesAndIdsWithinBody, opts.whitelist), allClassesAndIdsThatWereCompletelyDeletedFromHead).filter(val => val[0] === ".") // filter out all classes
      .map(val => val.slice(1)))); // remove dots from them
      const allClassesAndIdsWithinBodyThatWereWhitelisted = matcher(allClassesAndIdsWithinBody, opts.whitelist); // update `bodyCssToDelete` with sandwitched classes, because will be
      // used in reporting

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
      } //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //

    }
  } //                              ^
  //                              |
  //                              |
  //                              |
  //                              |
  //                              |
  //                              |
  //                              |
  //                              |
  //                              |
  //                     inned FOR loop ends
  //
  //
  //
  //                   F I N A L   P R O C E S S I N G
  // //
  //
  //
  //
  //
  //
  // actual deletion/insertion:
  // ==========================

  finalIndexesToDelete.push(lineBreaksToDelete.current());

  if (str.length && finalIndexesToDelete.current()) {
    str = rApply(str, finalIndexesToDelete.current());
    finalIndexesToDelete.wipe();
  }

  const startingPercentageDone = opts.reportProgressFuncTo - (opts.reportProgressFuncTo - opts.reportProgressFuncFrom) * leavePercForLastStage;

  if (opts.reportProgressFunc && len >= 2000) {
    // opts.reportProgressFunc(95);
    currentPercentageDone = Math.floor(startingPercentageDone + (opts.reportProgressFuncTo - startingPercentageDone) / 5 // * 1
    );

    if (currentPercentageDone !== lastPercentage) {
      lastPercentage = currentPercentageDone;
      opts.reportProgressFunc(currentPercentageDone);
    }
  } // final fixing:
  // =============
  // remove empty media queries:

  while (regexEmptyMediaQuery.test(str) || regexEmptyUnclosedMediaQuery.test(str)) {
    str = str.replace(regexEmptyMediaQuery, "");
    str = str.replace(regexEmptyUnclosedMediaQuery, "");
    totalCounter += str.length;
  }

  if (opts.reportProgressFunc && len >= 2000) {
    // opts.reportProgressFunc(96);
    currentPercentageDone = Math.floor(startingPercentageDone + (opts.reportProgressFuncTo - startingPercentageDone) / 5 * 2);

    if (currentPercentageDone !== lastPercentage) {
      lastPercentage = currentPercentageDone;
      opts.reportProgressFunc(currentPercentageDone);
    }
  } // remove empty style tags:


  str = str.replace(regexEmptyStyleTag, "\n");
  totalCounter += str.length;

  if (opts.reportProgressFunc && len >= 2000) {
    // opts.reportProgressFunc(97);
    currentPercentageDone = Math.floor(startingPercentageDone + (opts.reportProgressFuncTo - startingPercentageDone) / 5 * 3);

    if (currentPercentageDone !== lastPercentage) {
      lastPercentage = currentPercentageDone;
      opts.reportProgressFunc(currentPercentageDone);
    }
  } // remove empty Outlook conditional comments:


  let tempLen = str.length;
  str = str.replace(emptyCondCommentRegex(), "");
  totalCounter += str.length;

  if (tempLen !== str.length) {
    commentsLength += str.length - tempLen;
  }

  if (opts.reportProgressFunc && len >= 2000) {
    // opts.reportProgressFunc(98);
    currentPercentageDone = Math.floor(startingPercentageDone + (opts.reportProgressFuncTo - startingPercentageDone) / 5 * 4);

    if (currentPercentageDone !== lastPercentage) {
      lastPercentage = currentPercentageDone;
      opts.reportProgressFunc(currentPercentageDone);
    }
  } // minify, limit the line length


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
    // opts.reportProgressFunc(99);
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
  } // remove first character, space, inside classes/id's - it might
  // be a leftover after class/id removal

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
