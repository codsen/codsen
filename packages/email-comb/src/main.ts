import { matchRightIncl, matchRight, matchLeft } from "string-match-left-right";
import { emptyCondCommentRegex } from "regex-empty-conditional-comments";
import { extract } from "string-extract-class-names";
import { pull } from "array-pull-all-with-glob";
import { left, right } from "string-left-right";
import { version as v } from "../package.json";
import intersection from "lodash.intersection";
import { expander } from "string-range-expander";
import { uglifyArr } from "string-uglify";
import { rApply } from "ranges-apply";
import pullAll from "lodash.pullall";
import { crush } from "html-crush";
import { Ranges } from "ranges-push";
import uniq from "lodash.uniq";
import matcher from "matcher";
const version: string = v;

interface NumValObj {
  [key: string]: number;
}

import {
  Obj,
  isObj,
  hasOwnProp,
  isLatinLetter,
  regexEmptyStyleTag,
  regexEmptyMediaQuery,
  regexEmptyUnclosedMediaQuery,
} from "./util";

interface HeadsAndTailsObj {
  heads: string;
  tails: string;
}

interface Opts {
  whitelist: string[];
  backend: HeadsAndTailsObj[];
  uglify: boolean;
  removeHTMLComments: boolean;
  removeCSSComments: boolean;
  doNotRemoveHTMLCommentsWhoseOpeningTagContains: string[];
  reportProgressFunc: null | ((percDone: number) => void);
  reportProgressFuncFrom: number;
  reportProgressFuncTo: number;
}

interface Res {
  log: {
    timeTakenInMilliseconds: number;
    traversedTotalCharacters: number;
    traversedTimesInputLength: number;
    originalLength: number;
    cleanedLength: number;
    bytesSaved: number;
    percentageReducedOfOriginal: number;
    nonIndentationsWhitespaceLength: number;
    nonIndentationsTakeUpPercentageOfOriginal: number;
    commentsLength: number;
    commentsTakeUpPercentageOfOriginal: number;
    uglified: null | Obj;
  };
  result: string;
  countAfterCleaning: number;
  countBeforeCleaning: number;
  allInHead: string[];
  allInBody: string[];
  deletedFromHead: string[];
  deletedFromBody: string[];
}

const defaults: Opts = {
  whitelist: [],
  backend: [], // pass the ESP head & tail sets as separate objects inside this array
  uglify: false,
  removeHTMLComments: true,
  removeCSSComments: true,
  doNotRemoveHTMLCommentsWhoseOpeningTagContains: ["[if", "[endif"],
  reportProgressFunc: null,
  reportProgressFuncFrom: 0,
  reportProgressFuncTo: 100,
};

/**
 * Remove unused CSS from email templates
 */
function comb(str: string, originalOpts?: Partial<Opts>): Res {
  const start = Date.now();
  const finalIndexesToDelete = new Ranges({ limitToBeAddedWhitespace: true });
  const currentChunksMinifiedSelectors = new Ranges();
  const lineBreaksToDelete = new Ranges();

  // PS. badChars is also used
  function characterSuitableForNames(char: string): boolean {
    return /[-_A-Za-z0-9]/.test(char); // notice, there's no dot or hash!
  }

  interface BodyClassOrId {
    valuesStart: number | null;
    valueStart: number | null;
    nameStart: number | null;
    quoteless: boolean;
  }
  function resetBodyClassOrId(initObj = {}): BodyClassOrId {
    return {
      valuesStart: null,
      valueStart: null,
      nameStart: null,
      quoteless: false,
      ...initObj,
    };
  }

  let styleStartedAt;
  let styleEndedAt;

  let styleAttributeStartedAt;
  const headSelectorsArr = [];
  const bodyClassesArr = [];
  const bodyIdsArr = [];
  // const selectorsRemovedDuringRoundOne = [];

  let commentStartedAt: number | null;
  let commentNearlyStartedAt;
  let bodyStartedAt;
  let bodyClass: BodyClassOrId;
  let bodyId: BodyClassOrId;

  const headSelectorsCount: NumValObj = {};

  // for each single character traversed on any FOR loop, we increment this counter:
  let totalCounter = 0;
  let selectorSinceLinebreakDetected;
  let checkingInsideCurlyBraces;
  let insideCurlyBraces;
  let uglified: Obj | null = null;
  let allClassesAndIdsWithinHeadFinalUglified: string[] = [];
  let countAfterCleaning = 0;
  let countBeforeCleaning = 0;
  let curliesDepth = 0;

  // this flag is on just for the first class or id value on the class/id within body
  // we use it to check leading whitespace, not to waste resources on 2nd class/id
  // onwards..
  let bodyItsTheFirstClassOrId;

  // marker to identify bogus comments. Bogus comments according to the HTML spec
  // are when there's opening bracket and exclamation mark, not followed by doctype
  // or two dashes. In that case, comment is considered to be everything up to
  // the first encountered closing bracket. That's opposed to the healthy comment
  // where only "-->" is considered to be a closing mark.
  let bogusHTMLComment;

  // ---------------------------------------------------------------------------

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
  let ruleChunkStartedAt;

  // ---------------------------------------------------------------------------

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
  let selectorChunkStartedAt;

  // flag used to mark can the selector chunk be deleted (in Round 2 only)
  let selectorChunkCanBeDeleted = false;

  //               ALSO,

  //       <style type="text/css">
  //         .unused1[z].unused2, .used[z] {a:1;}
  //         |         |
  //         | single  |
  //    ---> | selector| <---

  let singleSelectorStartedAt;

  // Used in marking is it class or id (because there's no dot/hash in front
  // when square bracket notation is used), for example:
  //
  // a[class="used"]{x:1;}
  //
  // in which case, singleSelectorType would be === "."
  let singleSelectorType;

  // ---------------------------------------------------------------------------

  // marker to identify when we can delete the whole CSS declaration (or "line" if you keep one style-per-line)

  //       <style type="text/css">
  //         .unused1[z].unused2, .unused3[z] {a:1;}
  //         |                                     |
  //    ---> | means we can delete all this        | <---
  let headWholeLineCanBeDeleted;

  // if used chunk is followed by bunch of unused chunks, that comma that follows
  // used chunk needs to be deleted. Last chunk's comma is registered at index:
  // lastKeptChunksCommaAt and flag which instructs to delete it is the
  // "onlyDeletedChunksFollow":
  let lastKeptChunksCommaAt = null;
  let onlyDeletedChunksFollow = false;

  // marker to identify when we can delete the whole id or class, not just some of classes/id's inside
  let bodyClassOrIdCanBeDeleted;

  // copy of the first round's ranges, used to skip the same ranges
  // in round 2:
  let round1RangesClone;

  // counters:
  let nonIndentationsWhitespaceLength = 0;
  let commentsLength = 0;

  // same as used in string-extract-class-names
  const badChars = `.# ~\\!@$%^&*()+=,/';:"?><[]{}|\`\t\n`;

  // Rules which might wrap the media queries, for example:
  // @supports (display: grid) {...
  // We need to process their contents only (and disregard their curlies).
  const atRulesWhichMightWrapStyles = ["media", "supports", "document"];

  // One-liners like:
  // "@charset "utf-8";"
  // and one-liners with URL's:
  // @import url("https://codsen.com/style.css");
  const atRulesWhichNeedToBeIgnored = [
    "font-feature-values",
    "counter-style",
    "namespace",
    "font-face",
    "keyframes",
    "viewport",
    "charset",
    "import",
    "page",
  ];

  const atRuleBreakCharacters = ["{", "(", "<", '"', "'", "@", ";"];

  // insurance
  if (typeof str !== "string") {
    throw new TypeError(
      `email-comb: [THROW_ID_01] Input must be string! Currently it's ${typeof str}`
    );
  }

  if (originalOpts && !isObj(originalOpts)) {
    throw new TypeError(
      `email-comb: [THROW_ID_02] Options, second input argument, must be a plain object! Currently it's ${typeof originalOpts}, equal to: ${JSON.stringify(
        originalOpts,
        null,
        4
      )}`
    );
  }
  const opts: Opts = { ...defaults, ...originalOpts };
  // arrayiffy if string:
  if (typeof opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains === "string") {
    opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains = [
      opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains,
    ].filter((val: string) => val.trim());
  }

  if (typeof opts.whitelist === "string") {
    opts.whitelist = [opts.whitelist];
  } else if (!Array.isArray(opts.whitelist)) {
    throw new TypeError(
      `email-comb: [THROW_ID_03] opts.whitelist should be an array, but it was customised to a wrong thing, ${JSON.stringify(
        opts.whitelist,
        null,
        4
      )}`
    );
  }
  if (
    opts.whitelist.length > 0 &&
    !opts.whitelist.every((el) => typeof el === "string")
  ) {
    throw new TypeError(
      `email-comb: [THROW_ID_04] opts.whitelist array should contain only string-type elements. Currently we\ve got:\n${JSON.stringify(
        opts.whitelist,
        null,
        4
      )}`
    );
  }
  if (!Array.isArray(opts.backend)) {
    throw new TypeError(
      `email-comb: [THROW_ID_05] opts.backend should be an array, but it was customised to a wrong thing, ${JSON.stringify(
        opts.backend,
        null,
        4
      )}`
    );
  }
  if (opts.backend.length > 0 && opts.backend.some((val) => !isObj(val))) {
    throw new TypeError(
      `email-comb: [THROW_ID_06] opts.backend array should contain only plain objects but it contains something else:\n${JSON.stringify(
        opts.backend,
        null,
        4
      )}`
    );
  }
  if (
    opts.backend.length > 0 &&
    !opts.backend.every(
      (obj) => hasOwnProp(obj, "heads") && hasOwnProp(obj, "tails")
    )
  ) {
    throw new TypeError(
      `email-comb: [THROW_ID_07] every object within opts.backend should contain keys "heads" and "tails" but currently it's not the case. Whole "opts.backend" value array is currently equal to:\n${JSON.stringify(
        opts.backend,
        null,
        4
      )}`
    );
  }
  if (typeof opts.uglify !== "boolean") {
    if (opts.uglify === 1 || opts.uglify === 0) {
      opts.uglify = !!opts.uglify; // turn it into a Boolean
    } else {
      throw new TypeError(
        `email-comb: [THROW_ID_08] opts.uglify should be a Boolean. Currently it's set to: ${JSON.stringify(
          opts.uglify,
          null,
          4
        )}}`
      );
    }
  }
  if (
    opts.reportProgressFunc &&
    typeof opts.reportProgressFunc !== "function"
  ) {
    throw new TypeError(
      `email-comb: [THROW_ID_09] opts.reportProgressFunc should be a function but it was given as :\n${JSON.stringify(
        opts.reportProgressFunc,
        null,
        4
      )} (${typeof opts.reportProgressFunc})`
    );
  }

  let allHeads = null;
  let allTails = null;

  if (Array.isArray(opts.backend) && opts.backend.length) {
    allHeads = opts.backend.map((headsAndTailsObj) => headsAndTailsObj.heads);
    allTails = opts.backend.map((headsAndTailsObj) => headsAndTailsObj.tails);
  }

  const len = str.length;

  const leavePercForLastStage = 0.06; // in range of [0, 1]

  let ceil = 1;

  if (opts.reportProgressFunc) {
    // ceil is middle of the range [0, 100], or whatever it was customised to,
    // [opts.reportProgressFuncFrom, opts.reportProgressFuncTo].
    // Also, leavePercForLastStage needs to be left to next stage, so "100" or
    // "opts.reportProgressFuncTo" is multiplied by (1 - leavePercForLastStage).
    ceil = Math.floor(
      (opts.reportProgressFuncTo -
        (opts.reportProgressFuncTo - opts.reportProgressFuncFrom) *
          leavePercForLastStage -
        opts.reportProgressFuncFrom) /
        2
    );
    console.log(
      `404 ${`\u001b[${33}m${`ceil`}\u001b[${39}m`} = ${JSON.stringify(
        ceil,
        null,
        4
      )}`
    );
  }

  let trailingLinebreakLengthCorrection = 0;
  if (!str.length || !"\r\n".includes(str[str.length - 1])) {
    // if there's no trailing line break in the input, mark this because
    // output will have it and we need to consider this for matematically
    // precise calculations:
    trailingLinebreakLengthCorrection = 1;
  }

  // global "do nothing" flag. When active, nothing is done, characters are just skipped.
  let doNothing;
  // when "doNothing" is on, only the following value can stop it:
  let doNothingUntil;

  let allClassesAndIdsThatWereCompletelyDeletedFromHead: string[] = [];
  let allClassesAndIdsWithinHeadFinal: string[] = [];
  let allClassesAndIdsWithinHead: string[] = [];
  let allClassesAndIdsWithinBody: string[] = [];
  let headSelectorsCountClone: NumValObj = {};
  let currentPercentageDone;
  let stateWithinStyleTag;
  let currentlyWithinQuotes;
  let whitespaceStartedAt;
  let bodyClassesToDelete: string[] = [];
  let lastPercentage = 0;
  let stateWithinBody;
  let bodyIdsToDelete: string[] = [];
  let bodyCssToDelete: string[] = [];
  let headCssToDelete: string[] = [];
  let currentChunk;
  let canDelete;
  let usedOnce;

  // ---------------------------------------------------------------------------

  // Calculate the prevailing line ending sign: is it \r, \n or \r\n?
  const endingsCount = {
    n: 0,
    r: 0,
    rn: 0,
  };

  // ---------------------------------------------------------------------------

  // this is the main FOR loop which will traverse the input string twice:
  for (let round = 1; round <= 2; round++) {
    // all cleaning will be achieved within two traversals. The traversal is
    // identified by a number assigned to a variable "round". Either "round" is
    // 1 or 2.

    // During the FIRST traversal we count all the classes and id's in style tags
    // (which can be located also withing body) and all inline styles within body.
    // During the SECOND traversal we use that info to mark class and id names
    // for deletion (if they're unused) or for replacement (uglified).

    // We group both traversals because otherwise, code would be repeated twice -
    // all bits that track where class attribute started and ended, where media
    // queries started and ended - everything would be repeated twice.

    // Instead, we use conditional clauses to track, which round it is and
    // perform the unique actions, not applicable to other round, within those
    // clauses.

    if (round === 1) {
      console.log(`.\n\n\n\n\n\n\n
                                                       1111111111111111
                                                      1:::::::::::::::1
                                                     1::::::::::::::::1
                                                     111::::::::::::::1
                                                            1:::::::::1
                                                            1:::::::::1
                                                            1:::::::::1
                                                            1:::::::::l
                                                            1:::::::::l
                                                            1:::::::::l
                                                            1:::::::::l
                                                            1:::::::::l
                                                     111:::::::::::::::::::::111
                                                     1:::::::::::::::::::::::::1
                                                     1:::::::::::::::::::::::::1
                                                     111111111111111111111111111
\n\n\n\n\n\n\n`);
    } else {
      console.log(`.\n\n\n\n\n\n\n
                                                          22222222222222
                                                        2:::::::::::::::22
                                                        2::::::222222:::::2
                                                        2222222     2:::::2
                                                                    2:::::2
                                                                    2:::::2
                                                                 2222::::2
                                                            22222::::::22
                                                          22::::::::222
                                                         2:::::22222
                                                        2:::::2
                                                        2:::::2
                                                        2:::::2       222222
                                                        2::::::2222222:::::2
                                                        2::::::::::::::::::2
                                                        22222222222222222222
\n\n\n\n\n\n\n`);
    }

    //                all setup before the for loop
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

    // counters/markers/flags get reset before each round:
    selectorSinceLinebreakDetected = false;
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

    //                    inner FOR loop starts
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

    totalCounter += len;
    // eslint-disable-next-line no-restricted-syntax
    stepouter: for (let i = 0; i < len; i++) {
      // logging:
      if (round === 1) {
        console.log(
          `${`\u001b[${39}m${`---${`\u001b[${32}m round ${round} \u001b[${39}m`}-----------------------`}\u001b[${36}m`} str[${`\u001b[${35}m${i}\u001b[${39}m`}] = ${
            str[i] && str[i].trim() !== ""
              ? str[i]
              : JSON.stringify(str[i], null, 0)
          }`
        );
      }

      //                                S
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
            opts.reportProgressFunc(
              Math.floor(
                (opts.reportProgressFuncTo - opts.reportProgressFuncFrom) / 2
              ) // if range is [0, 100], this would be 50
            );
          }
        } else if (len >= 2000) {
          // defaults:
          // opts.reportProgressFuncFrom = 0
          // opts.reportProgressFuncTo = 100

          currentPercentageDone =
            opts.reportProgressFuncFrom +
            Math.floor((i / len) * ceil) +
            (round === 1 ? 0 : ceil);

          if (currentPercentageDone !== lastPercentage) {
            lastPercentage = currentPercentageDone;
            opts.reportProgressFunc(currentPercentageDone);
          }
        }
      }

      const chr = str[i];

      // count line endings:
      if (str[i] === "\n") {
        if (str[i - 1] === "\r") {
          if (round === 1) {
            endingsCount.rn += 1;
          }
        } else if (round === 1) {
          endingsCount.n += 1;
        }
      } else if (str[i] === "\r" && str[i + 1] !== "\n") {
        if (round === 1) {
          endingsCount.r += 1;
        }
      }

      if (
        stateWithinStyleTag !== true &&
        // a) either it's the first style tag and currently we haven't traversed
        // it's closing yet:
        ((styleEndedAt === null &&
          styleStartedAt !== null &&
          i >= styleStartedAt) ||
          // b) or, style tag was closed, later another-one was opened and we
          // haven't traversed through its closing tag yet:
          (styleStartedAt !== null &&
            styleEndedAt !== null &&
            styleStartedAt > styleEndedAt &&
            styleStartedAt < i))
      ) {
        console.log(`662 activate "stateWithinStyleTag" state`);
        console.log(
          `664 ${`\u001b[${33}m${`styleStartedAt`}\u001b[${39}m`} = ${JSON.stringify(
            styleStartedAt,
            null,
            4
          )}`
        );
        console.log(
          `671 ${`\u001b[${33}m${`styleEndedAt`}\u001b[${39}m`} = ${JSON.stringify(
            styleEndedAt,
            null,
            4
          )}`
        );

        // ---------------------------------------------------------------------

        stateWithinStyleTag = true;
        stateWithinBody = false;
      } else if (
        stateWithinBody !== true &&
        bodyStartedAt !== null &&
        (styleStartedAt === null || styleStartedAt < i) &&
        (styleEndedAt === null || styleEndedAt < i)
      ) {
        console.log(
          `689 activate "stateWithinBody" state (stateWithinBody was previously ${stateWithinBody})`
        );
        stateWithinBody = true;
        stateWithinStyleTag = false;
      }

      //                                S
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
          if (
            typeof leftSideIdx === "number" &&
            ((stateWithinStyleTag &&
              ["(", ",", ":"].includes(str[leftSideIdx])) ||
              (stateWithinBody &&
                !stateWithinStyleTag &&
                ["(", ",", ":", "="].includes(str[leftSideIdx])))
          ) {
            currentlyWithinQuotes = str[i];
            console.log(
              `735 SET ${`\u001b[${33}m${`currentlyWithinQuotes`}\u001b[${39}m`} = ${currentlyWithinQuotes}`
            );
          }
        } else if (
          (str[i] === `"` &&
            str[right(str, i) as number] === `'` &&
            str[right(str, right(str, i) as number) as number] === `"`) ||
          (str[i] === `'` &&
            str[right(str, i) as number] === `"` &&
            str[right(str, right(str, i) as number) as number] === `'`)
        ) {
          i = right(str, right(str, i)) as number;
          console.log(`747 BUMP i=${right(str, right(str, i))}, step outer`);
          continue;
        } else if (currentlyWithinQuotes === str[i]) {
          currentlyWithinQuotes = null;
          console.log(
            `752 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`currentlyWithinQuotes`}\u001b[${39}m`} = null`
          );
        }

        if (stateWithinBody) {
          // body: quotes in attributes
          if (
            typeof styleAttributeStartedAt === "number" &&
            styleAttributeStartedAt < i
          ) {
            styleAttributeStartedAt = null;
            console.log(
              `764 ${`\u001b[${31}m${`██`}\u001b[${39}m`} SET ${`\u001b[${33}m${`styleAttributeStartedAt`}\u001b[${39}m`} = null`
            );
          }
        }
      }

      // everywhere: stop the "doNothing"
      // ================
      if (doNothing) {
        if (
          doNothingUntil === null ||
          typeof doNothingUntil !== "string" ||
          (typeof doNothingUntil === "string" && !doNothingUntil)
        ) {
          // it's some bad case scenario/bug, just turn off the "doNothing"
          console.log(
            `\u001b[${31}m${`0750 something went wrong, doNothing is truthy but doNothingUntil is not set! Turning off doNothing back to false.`}\u001b[${39}m`
          );
          doNothing = false;
          // just turn it off and move on.
        } else if (matchRightIncl(str, i, doNothingUntil)) {
          console.log(`785 doNothingUntil="${doNothingUntil}" MATCHED`);
          // Normally doNothingUntil is a single character.
          // However, when matching back-end characters, it can be multiple chars.
          // That's why above we can't compare with '===' and need the
          // "string-match-left-right" library.

          // 1. COMMENTS-RELATED SKIPS ARE TENDED SEPARATELY:
          if (commentStartedAt !== null) {
            // submit the comment characters range for deletion:

            // logging:
            console.log(
              `797 CSS comment-block ends, let's tackle the doNothing`
            );

            if (round === 1 && opts.removeCSSComments) {
              const lineBreakPresentOnTheLeft = matchLeft(
                str,
                commentStartedAt,
                ["\r\n", "\n", "\r"]
              );
              console.log(
                `${`\u001b[${33}m${`lineBreakPresentOnTheLeft`}\u001b[${39}m`} = ${JSON.stringify(
                  lineBreakPresentOnTheLeft,
                  null,
                  4
                )}`
              );
              let startingIndex = commentStartedAt;
              if (
                typeof lineBreakPresentOnTheLeft === "string" &&
                lineBreakPresentOnTheLeft.length
              ) {
                startingIndex -= lineBreakPresentOnTheLeft.length;
                console.log(
                  `820 NEW \u001b[${33}m${`startingIndex`}\u001b[${39}m = ${startingIndex}`
                );
              }
              if (
                str[startingIndex - 1] &&
                characterSuitableForNames(str[startingIndex - 1]) &&
                str[i + doNothingUntil.length] &&
                characterSuitableForNames(str[i + doNothingUntil.length])
              ) {
                console.log(
                  `830 PUSH [${startingIndex}, ${
                    i + doNothingUntil.length
                  }, ";"]`
                );
                finalIndexesToDelete.push(
                  startingIndex,
                  i + doNothingUntil.length,
                  ";"
                );
                commentsLength += i + doNothingUntil.length - startingIndex;
              } else {
                console.log(
                  `842 PUSH [${startingIndex}, ${i + doNothingUntil.length}]`
                );
                finalIndexesToDelete.push(
                  startingIndex,
                  i + doNothingUntil.length
                );
                commentsLength += i + doNothingUntil.length - startingIndex;
              }
            }
            commentStartedAt = null;
            console.log(
              `853 SET ${`\u001b[${33}m${`commentStartedAt`}\u001b[${39}m`} = ${commentStartedAt}`
            );
          }

          // 2. ALL OTHER CASES OF "DO-NOTHING":

          // offset the index:
          i = i + doNothingUntil.length - 1;
          console.log(`861 AFTER OFFSET, THE NEW i IS NOW: ${i}`);

          // Switch off the mode
          doNothingUntil = null;
          console.log(
            `866 SET ${`\u001b[${33}m${`doNothingUntil`}\u001b[${39}m`} = ${doNothingUntil}`
          );
          doNothing = false;
          console.log(
            `870 SET ${`\u001b[${33}m${`doNothing`}\u001b[${39}m`} = ${doNothing}, then step out`
          );
          continue;
        }
      }

      // head: pinpoint any <style... tag, anywhere within the given HTML
      // ================
      if (
        !doNothing &&
        str[i] === "<" &&
        str[i + 1] === "s" &&
        str[i + 2] === "t" &&
        str[i + 3] === "y" &&
        str[i + 4] === "l" &&
        str[i + 5] === "e"
      ) {
        checkingInsideCurlyBraces = true;
        console.log(
          `889 SET ${`\u001b[${33}m${`checkingInsideCurlyBraces`}\u001b[${39}m`} = ${checkingInsideCurlyBraces}`
        );

        console.log(`892 \u001b[${36}m${`\n * style tag begins`}\u001b[${39}m`);
        if (!stateWithinStyleTag) {
          stateWithinStyleTag = true;
          console.log(`895 SET stateWithinStyleTag = ${stateWithinStyleTag}`);
        }

        console.log(
          `899 \u001b[${36}m${`\n marching forward until ">":`}\u001b[${39}m`
        );
        for (let y = i; y < len; y++) {
          totalCounter += 1;
          console.log(
            `904 \u001b[${36}m${`str[i=${y}]=${str[y]}`}\u001b[${39}m`
          );
          if (str[y] === ">") {
            console.log(
              `908 \u001b[${36}m${` > found, stopping`}\u001b[${39}m`
            );
            styleStartedAt = y + 1;
            ruleChunkStartedAt = y + 1;
            console.log(
              `913 SET ${`\u001b[${33}m${`styleStartedAt`}\u001b[${39}m`} = ${styleStartedAt}; SET ${`\u001b[${33}m${`ruleChunkStartedAt`}\u001b[${39}m`} = ${ruleChunkStartedAt} THEN BREAK`
            );
            // We can offset the main index ("jump" to an already-traversed closing
            // closing bracket character of <style.....> tag because this tag
            // will not have any CLASS or ID attributes).
            // We would not do that with BODY tag for example.

            // Offset the index because we traversed it already:
            // i = y;
            console.log(
              `923 \u001b[${36}m${`stopped marching forward`}\u001b[${39}m`
            );
            break;
            // continue stepouter;
          }
        }
      }

      // head: pinpoint closing style tag, </style>
      // It's not that easy.
      // There can be whitespace to the left and right of closing slash.
      // ================
      if (
        !doNothing &&
        stateWithinStyleTag &&
        str[i] === "<" &&
        str[i + 1] === "/" &&
        str[i + 2] === "s" &&
        str[i + 3] === "t" &&
        str[i + 4] === "y" &&
        str[i + 5] === "l" &&
        str[i + 6] === "e"
      ) {
        // TODO: take care of any spaces around: 1. slash; 2. brackets

        styleEndedAt = i - 1;
        console.log(
          `950 SET ${`\u001b[${33}m${`checkingInsideCurlyBraces`}\u001b[${39}m`} = ${checkingInsideCurlyBraces}`
        );
        console.log(
          `953 SET ${`\u001b[${33}m${`styleEndedAt`}\u001b[${39}m`} = ${styleEndedAt}`
        );

        // we don't need the chunk end tracking marker any more
        ruleChunkStartedAt = null;
        checkingInsideCurlyBraces = false;

        if (stateWithinStyleTag) {
          stateWithinStyleTag = false;
          console.log(`962 SET stateWithinStyleTag = ${stateWithinStyleTag}`);
        }
      }

      // mark where CSS comments start - ROUND 1-only rule
      // ================
      if (
        round === 1 &&
        (stateWithinStyleTag || stateWithinBody) &&
        str[i] === "/" &&
        str[i + 1] === "*" &&
        commentStartedAt === null
      ) {
        // 1. mark the beginning
        commentStartedAt = i;
        console.log(
          `978 SET ${`\u001b[${33}m${`commentStartedAt`}\u001b[${39}m`} = ${i}`
        );

        // 2. activate doNothing:
        doNothing = true;
        console.log(
          `984 SET ${`\u001b[${33}m${`doNothing`}\u001b[${39}m`} = true`
        );
        doNothingUntil = "*/";

        // just over the "*":
        i += 1;
        continue;
      }

      // pinpoint "@"
      if (!doNothing && stateWithinStyleTag && str[i] === "@") {
        console.log(`995 (i=${i})`);
        // since we are going to march forward, rest the whitespaceStartedAt
        // marker since it might not get reset otherwise
        if (whitespaceStartedAt) {
          whitespaceStartedAt = null;
        }

        const matchedAtTagsName =
          matchRight(str, i, atRulesWhichMightWrapStyles) ||
          matchRight(str, i, atRulesWhichNeedToBeIgnored);
        if (typeof matchedAtTagsName === "string") {
          console.log(`1006 @${matchedAtTagsName} detected`);
          let temp;

          // rare case when semicolon follows the at-tag - in that
          // case, we remove the at-rule because it's broken
          if (
            str[i + matchedAtTagsName.length + 1] === ";" ||
            (str[i + matchedAtTagsName.length + 1] &&
              !str[i + matchedAtTagsName.length + 1].trim() &&
              matchRight(str, i + matchedAtTagsName.length + 1, ";", {
                trimBeforeMatching: true,
                cb: (_char, _theRemainderOfTheString, index) => {
                  temp = index;
                  return true;
                },
              }))
          ) {
            console.log(`1023 BLANK AT-RULE DETECTED`);
            finalIndexesToDelete.push(
              i,
              temp || i + matchedAtTagsName.length + 2
            );
          }

          // these can wrap styles and each other and their pesky curlies can throw
          // our algorithm off-track. We need to jump past the chunk from "@..."
          // to, and including, first curly bracket. But mind the dirty code cases.

          let secondaryStopper;
          console.log("\n");
          console.log(
            `1037 \u001b[${36}m${`march forward`}\u001b[${39}m:\n-----`
          );

          for (let z = i + 1; z < len; z++) {
            totalCounter += 1;
            console.log(
              `1043 \u001b[${36}m${`str[${z}] = ${str[z]}`}\u001b[${39}m; ${`\u001b[${33}m${`secondaryStopper`}\u001b[${39}m`} = ${secondaryStopper}`
            );

            // ------------------------------------------------------------------

            // a secondary stopper is any character which must be matched with its
            // closing counterpart before anything continues. For example, we look
            // for semicolon. On the way, we encounter an opening bracket. Now,
            // we must march forward until we meet closing bracket. If, in the way,
            // we encounter semicolon, it will be ignored, only closing bracket is
            // what we look. When it is found, THEN continue looking for (new) semicolon.

            // catch the start of Liquid/Nunjucks double opening curlies {{
            let espTails = "";
            if (str[z] === "{" && str[z + 1] === "{") {
              espTails = "}}";
              console.log(
                `1060 ${`\u001b[${33}m${`espTails`}\u001b[${39}m`} = ${espTails}`
              );
            }
            if (str[z] === "{" && str[z + 1] === "%") {
              espTails = "%}";
              console.log(
                `1066 ${`\u001b[${33}m${`espTails`}\u001b[${39}m`} = ${espTails}`
              );
            }
            if (espTails && str.includes(espTails, z + 1)) {
              console.log(
                `1071 ${`\u001b[${32}m${`ESP Nunjucks/Jinja heads detected`}\u001b[${39}m`}`
              );
              z = str.indexOf(espTails, z + 1) + espTails.length - 1;
              console.log(
                `1075 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} z = ${z}; then ${`\u001b[${31}m${`CONTINUE`}\u001b[${39}m`}`
              );
              continue;
            } else if (espTails) {
              // if tails are not present, wipe them, for perf reasons
              console.log(
                `1081 ${`\u001b[${31}m${`WIPE`}\u001b[${39}m`} ${`\u001b[${33}m${`espTails`}\u001b[${39}m`}`
              );
              espTails = "";
            }

            // catch the ending of a secondary stopper
            if (secondaryStopper && str[z] === secondaryStopper) {
              console.log(
                `1089 \u001b[${36}m${`atRulesWhichNeedToBeIgnored = ${JSON.stringify(
                  atRulesWhichNeedToBeIgnored,
                  null,
                  0
                )} - VS - matchedAtTagsName = ${matchedAtTagsName}\natRulesWhichMightWrapStyles = ${JSON.stringify(
                  atRulesWhichMightWrapStyles,
                  null,
                  0
                )} - VS - matchedAtTagsName = ${matchedAtTagsName}`}\u001b[${39}m`
              );
              if (
                (str[z] === "}" &&
                  atRulesWhichNeedToBeIgnored.includes(matchedAtTagsName)) ||
                (str[z] === "{" &&
                  atRulesWhichMightWrapStyles.includes(matchedAtTagsName))
              ) {
                i = z;
                console.log(
                  `1107 ! SET \u001b[${31}m${`i = ${i}`}\u001b[${39}m - THEN, STEP OUT`
                );
                ruleChunkStartedAt = z + 1;
                console.log(
                  `1111 SET ${`\u001b[${33}m${`ruleChunkStartedAt`}\u001b[${39}m`} = ${ruleChunkStartedAt}`
                );
                continue stepouter;
              } else {
                secondaryStopper = undefined;
                console.log(
                  `---- 1054 SET \u001b[${35}m${`secondaryStopper`}\u001b[${39}m = undefined`
                );
                continue;
                // continue stepouter;
              }
            }

            // set the seconddary stopper
            if (str[z] === '"' && !secondaryStopper) {
              secondaryStopper = '"';
              console.log(
                `1128 SET \u001b[${35}m${`secondaryStopper`}\u001b[${39}m = ${secondaryStopper}`
              );
            } else if (str[z] === "'" && !secondaryStopper) {
              secondaryStopper = "'";
              console.log(
                `1133 SET \u001b[${35}m${`secondaryStopper`}\u001b[${39}m = ${secondaryStopper}`
              );
            } else if (str[z] === "(" && !secondaryStopper) {
              secondaryStopper = ")";
              console.log(
                `1138 SET \u001b[${35}m${`secondaryStopper`}\u001b[${39}m = ${secondaryStopper}`
              );
            } else if (
              atRulesWhichNeedToBeIgnored.includes(matchedAtTagsName) &&
              str[z] === "{" &&
              !secondaryStopper
            ) {
              secondaryStopper = "}";
              console.log(
                `1147 SET \u001b[${35}m${`secondaryStopper`}\u001b[${39}m = ${secondaryStopper}`
              );
            }

            // catch the final, closing character
            if (!secondaryStopper && atRuleBreakCharacters.includes(str[z])) {
              // ensure that any wrapped chunks get completely covered and their
              // contents don't trigger any clauses. There can be links with "@"
              // for example, and there can be stray tags like @media @media.
              // These two different cases can be recognised by requiring that any
              // wrapped chunks like {...} or (...) or "..." or '...' get covered
              // completely before anything else is considered.

              console.log(
                `1161 AT-RULE BREAK CHAR: index=${z}, value="${str[z]}"`
              );

              // bail out clauses
              let pushRangeFrom;
              let pushRangeTo;

              // normal cases:
              if (str[z] === "{" || str[z] === ";") {
                insideCurlyBraces = false;
                ruleChunkStartedAt = z + 1;
                console.log(
                  `1173 SET ${`\u001b[${33}m${`insideCurlyBraces`}\u001b[${39}m`} = false; ${`\u001b[${33}m${`ruleChunkStartedAt`}\u001b[${39}m`} = ${ruleChunkStartedAt}; THEN STEP OUT`
                );
                i = z;
                continue stepouter;
              } else if (str[z] === "@" || str[z] === "<") {
                if (
                  round === 1 &&
                  !str.slice(i, z).includes("{") &&
                  !str.slice(i, z).includes("(") &&
                  !str.slice(i, z).includes('"') &&
                  !str.slice(i, z).includes("'")
                ) {
                  pushRangeFrom = i;
                  pushRangeTo = z + (str[z] === ";" ? 1 : 0);
                  console.log(
                    `1188 BROKEN AT-RULE DETECTED, pushing [${pushRangeFrom}, ${pushRangeTo}] = "${str.slice(
                      pushRangeFrom,
                      pushRangeTo
                    )}" THEN STEP OUT`
                  );
                  finalIndexesToDelete.push(pushRangeFrom, pushRangeTo);
                }
              }
              console.log(
                `1197 ${`\u001b[${33}m${`pushRangeTo`}\u001b[${39}m`} = ${pushRangeTo}; ${`\u001b[${33}m${`z`}\u001b[${39}m`} = ${z}`
              );
              const iOffset = pushRangeTo
                ? pushRangeTo - 1
                : z - 1 + (str[z] === "{" ? 1 : 0);
              console.log(
                `1203 ${`\u001b[${33}m${`iOffset`}\u001b[${39}m`} = ${iOffset}`
              );
              console.log(
                `1206 ! SET \u001b[${31}m${`i = ${iOffset}; ruleChunkStartedAt = ${
                  iOffset + 1
                };`}\u001b[${39}m - THEN, STEP OUT.`
              );
              i = iOffset;
              ruleChunkStartedAt = iOffset + 1;
              continue stepouter;
            }
          }
        }
      }

      // pinpoint closing curly braces
      // ================
      if (
        !doNothing &&
        stateWithinStyleTag &&
        insideCurlyBraces &&
        checkingInsideCurlyBraces &&
        chr === "}" &&
        !currentlyWithinQuotes &&
        !curliesDepth
      ) {
        console.log(
          `1230 ${`\u001b[${32}m${`██`}\u001b[${39}m`} pinpointing closing curly braces`
        );

        // submit whole chunk for deletion if applicable:
        if (round === 2 && headWholeLineCanBeDeleted && ruleChunkStartedAt) {
          finalIndexesToDelete.push(ruleChunkStartedAt, i + 1);
          console.log(
            `1237 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${ruleChunkStartedAt}, ${
              i + 1
            }]; finalIndexesToDelete now = ${JSON.stringify(
              finalIndexesToDelete,
              null,
              4
            )}`
          );
        }

        insideCurlyBraces = false;
        console.log(
          `1249 SET ${`\u001b[${33}m${`insideCurlyBraces`}\u001b[${39}m`} = false`
        );

        console.log(
          `1253 FIY, \u001b[${31}m${`headWholeLineCanBeDeleted = ${headWholeLineCanBeDeleted}`}\u001b[${39}m; \u001b[${31}m${`lastKeptChunksCommaAt = ${lastKeptChunksCommaAt}`}\u001b[${39}m; \u001b[${31}m${`onlyDeletedChunksFollow = ${onlyDeletedChunksFollow}`}\u001b[${39}m
            `
        );

        if (ruleChunkStartedAt) {
          ruleChunkStartedAt = i + 1;
          console.log(
            `1260 SET ${`\u001b[${33}m${`ruleChunkStartedAt`}\u001b[${39}m`} = ${ruleChunkStartedAt}`
          );
        }

        // reset selectorChunkStartedAt:
        selectorChunkStartedAt = null;
        selectorChunkCanBeDeleted = false;
        headWholeLineCanBeDeleted = true;
        singleSelectorStartedAt = null;
        lastKeptChunksCommaAt = null;
        onlyDeletedChunksFollow = false;

        console.log(
          `1273 RESET: ${`\u001b[${33}m${`selectorChunkStartedAt`}\u001b[${39}m`} = null; ${`\u001b[${33}m${`singleSelectorStartedAt`}\u001b[${39}m`} = null; ${`\u001b[${33}m${`headWholeLineCanBeDeleted`}\u001b[${39}m`} = true;
          ${`\u001b[${33}m${`selectorChunkCanBeDeleted`}\u001b[${39}m`} = false;
          ${`\u001b[${33}m${`lastKeptChunksCommaAt`}\u001b[${39}m`} = null;
          ${`\u001b[${33}m${`onlyDeletedChunksFollow`}\u001b[${39}m`} = false;`
        );
      }

      // catch the beginning/ending of CSS selectors in head
      // ================

      // markers we'll be dealing with:
      // * selectorChunkStartedAt
      // * ruleChunkStartedAt
      // * selectorChunkCanBeDeleted
      // * singleSelectorStartedAt
      // * headWholeLineCanBeDeleted

      if (
        !doNothing &&
        !commentStartedAt &&
        styleStartedAt &&
        i >= styleStartedAt &&
        // a) either it's the first style tag and currently we haven't traversed
        // its closing yet:
        ((styleEndedAt === null && i >= styleStartedAt) ||
          // b) or, style tag was closed, later another-one was opened and we
          // haven't traversed through its closing tag yet:
          (styleEndedAt &&
            styleStartedAt > styleEndedAt &&
            styleStartedAt <= i)) &&
        !insideCurlyBraces
      ) {
        console.log(
          `1306 catching the beginning/ending of CSS selectors in head`
        );
        // TODO: skip all false-positive characters within quotes, like curlies

        // PART 1.

        // catch the START of single selectors (for example, "#head-only-id-2")
        // any character, not permitted in CSS class/id names stops the recording
        if (singleSelectorStartedAt === null) {
          // catch the start of a single
          if (chr === "." || chr === "#") {
            singleSelectorStartedAt = i;
            console.log(
              `1319 SET ${`\u001b[${33}m${`singleSelectorStartedAt`}\u001b[${39}m`} = ${singleSelectorStartedAt}`
            );
          } else if (matchLeft(str, i, "[class=")) {
            console.log(
              `1323 ${`\u001b[${33}m${`██`}\u001b[${39}m`} [class= detected`
            );
            if (isLatinLetter(chr)) {
              singleSelectorStartedAt = i;
              singleSelectorType = ".";
              console.log(
                `1329 SET ${`\u001b[${33}m${`singleSelectorStartedAt`}\u001b[${39}m`} = ${singleSelectorStartedAt}; ${`\u001b[${33}m${`singleSelectorType`}\u001b[${39}m`} = ${singleSelectorType}`
              );
            } else if (
              `"'`.includes(chr) &&
              isLatinLetter(str[right(str, i) as number])
            ) {
              singleSelectorStartedAt = right(str, i);
              singleSelectorType = ".";
              console.log(
                `1338 SET ${`\u001b[${33}m${`singleSelectorStartedAt`}\u001b[${39}m`} = ${singleSelectorStartedAt}; ${`\u001b[${33}m${`singleSelectorType`}\u001b[${39}m`} = ${singleSelectorType}`
              );
            }
          } else if (matchLeft(str, i, "[id=")) {
            console.log(
              `1343 ${`\u001b[${33}m${`██`}\u001b[${39}m`} [id= detected`
            );
            if (isLatinLetter(chr)) {
              singleSelectorStartedAt = i;
              singleSelectorType = "#";
              console.log(
                `1349 SET ${`\u001b[${33}m${`singleSelectorStartedAt`}\u001b[${39}m`} = ${singleSelectorStartedAt}; ${`\u001b[${33}m${`singleSelectorType`}\u001b[${39}m`} = ${singleSelectorType}`
              );
            } else if (
              `"'`.includes(chr) &&
              isLatinLetter(str[right(str, i) as number])
            ) {
              singleSelectorStartedAt = right(str, i);
              singleSelectorType = "#";
              console.log(
                `1358 SET ${`\u001b[${33}m${`singleSelectorStartedAt`}\u001b[${39}m`} = ${singleSelectorStartedAt}; ${`\u001b[${33}m${`singleSelectorType`}\u001b[${39}m`} = ${singleSelectorType}`
              );
            }
          } else if (chr.trim()) {
            // logging:
            console.log("1363 ██");
            if (chr === "}") {
              ruleChunkStartedAt = i + 1;
              currentChunk = null;
              console.log(
                `1368 SET ${`\u001b[${33}m${`ruleChunkStartedAt`}\u001b[${39}m`} = ${
                  i + 1
                }; ${`\u001b[${33}m${`currentChunk`}\u001b[${39}m`} = null;`
              );
            } else if (chr === "<" && str[i + 1] === "!") {
              // catch comment blocks, probably Outlook conditional comments
              // like <!--[if mso]>
              console.log(
                `1376 \u001b[${36}m${`conditional comment detected, traverse forward`}\u001b[${39}m`
              );
              for (let y = i; y < len; y++) {
                totalCounter += 1;
                console.log(
                  `\u001b[${36}m${`-----str[${y}]=${str[y]}`}\u001b[${39}m`
                );
                if (str[y] === ">") {
                  ruleChunkStartedAt = y + 1;
                  selectorChunkStartedAt = y + 1;
                  console.log(
                    `\u001b[${36}m${`1323 ruleChunkStartedAt=${ruleChunkStartedAt}`}\u001b[${39}m; \u001b[${36}m${`selectorChunkStartedAt=${selectorChunkStartedAt}`}\u001b[${39}m; THEN BREAK`
                  );
                  i = y;
                  continue stepouter;
                }
              }
            }
          }
        }
        // catch the END of a single selectors
        else if (
          singleSelectorStartedAt !== null &&
          !characterSuitableForNames(chr)
        ) {
          let singleSelector = str.slice(singleSelectorStartedAt, i);
          if (singleSelectorType) {
            singleSelector = `${singleSelectorType}${singleSelector}`;
            singleSelectorType = undefined;
          }
          console.log(
            `1407 CARVED OUT A SINGLE SELECTOR'S NAME: "\u001b[${32}m${singleSelector}\u001b[${39}m"`
          );

          if (
            round === 2 &&
            !selectorChunkCanBeDeleted &&
            headCssToDelete.includes(singleSelector)
          ) {
            selectorChunkCanBeDeleted = true;
            console.log(
              `1417 SET selectorChunkCanBeDeleted = true - ${`\u001b[${31}m${`CHUNK CAN BE DELETED`}\u001b[${39}m`}`
            );
            onlyDeletedChunksFollow = true;
            console.log(
              `1421 SET ${`\u001b[${33}m${`onlyDeletedChunksFollow`}\u001b[${39}m`} = true`
            );
          } else if (round === 2 && !selectorChunkCanBeDeleted) {
            console.log(
              `1425 ${`\u001b[${32}m${`BTW, THIS CHUNK MIGHT NOT BE DELETED`}\u001b[${39}m`}`
            );
            console.log(
              `1428 ${`\u001b[${33}m${`opts.whitelist`}\u001b[${39}m`} = ${JSON.stringify(
                opts.whitelist,
                null,
                4
              )}`
            );
            // 1. uglify part
            if (
              opts.uglify &&
              (!Array.isArray(opts.whitelist) ||
                !opts.whitelist.length ||
                !matcher([singleSelector], opts.whitelist).length)
            ) {
              console.log(
                `1442 ${`\u001b[${31}m${`PUSH [${singleSelectorStartedAt}, ${i}, ${
                  allClassesAndIdsWithinHeadFinalUglified[
                    allClassesAndIdsWithinHeadFinal.indexOf(singleSelector)
                  ]
                }]`}\u001b[${39}m`}`
              );
              currentChunksMinifiedSelectors.push(
                singleSelectorStartedAt,
                i,
                allClassesAndIdsWithinHeadFinalUglified[
                  allClassesAndIdsWithinHeadFinal.indexOf(singleSelector)
                ]
              );
            }
            // 2. tend trailing comma issue (lastKeptChunksCommaAt and
            // onlyDeletedChunksFollow):
            if (chr === ",") {
              lastKeptChunksCommaAt = i;
              onlyDeletedChunksFollow = false;
              console.log(
                `1462 SET ${`\u001b[${33}m${`lastKeptChunksCommaAt`}\u001b[${39}m`} = ${lastKeptChunksCommaAt}; ${`\u001b[${33}m${`onlyDeletedChunksFollow`}\u001b[${39}m`} = ${onlyDeletedChunksFollow};`
              );
            } else {
              // IF it's whitespace, traverse forward, look for comma
            }
          }

          if (chr === "." || chr === "#") {
            singleSelectorStartedAt = i;
            console.log(
              `1472 ${`\u001b[${33}m${`singleSelectorStartedAt`}\u001b[${39}m`} = ${singleSelectorStartedAt}`
            );
          } else {
            singleSelectorStartedAt = null;
            console.log(`1476 WIPE singleSelectorStartedAt = null`);
          }
        }

        // PART 2.

        // catch the selectorChunks (for example, #head-only-id-2.real-class-1[lang|en]):
        // only opening curly brace or comma stops the recording.
        if (selectorChunkStartedAt === null) {
          console.log(`1485 catching the start of a chunk`);
          // catch the start of a chunk
          // if (chr === "." || chr === "#") {
          if (
            chr.trim() &&
            chr !== "}" &&
            chr !== ";" &&
            !(str[i] === "/" && str[i + 1] === "*")
          ) {
            // reset the deletion flag:
            selectorChunkCanBeDeleted = false;
            console.log(
              `1497 ${`\u001b[${33}m${`selectorChunkCanBeDeleted`}\u001b[${39}m`} = ${selectorChunkCanBeDeleted}`
            );

            // set the chunk's starting marker:
            selectorChunkStartedAt = i;
            console.log(
              `1503 ${`\u001b[${33}m${`selectorChunkStartedAt`}\u001b[${39}m`} = ${selectorChunkStartedAt}`
            );
          }
        }
        // catch the ending of a chunk
        else if (",{".includes(chr)) {
          const sliceTo = whitespaceStartedAt || i;
          currentChunk = str.slice(selectorChunkStartedAt, sliceTo);
          console.log(
            `1512 ${`\u001b[${33}m${`currentChunk`}\u001b[${39}m`} = ${JSON.stringify(
              currentChunk,
              null,
              0
            )} (sliced [${selectorChunkStartedAt}, ${sliceTo}])`
          );
          if (round === 1) {
            // delete whitespace in front of commas or more than two spaces
            // in front of opening curly braces:
            if (whitespaceStartedAt) {
              if (chr === "," && whitespaceStartedAt < i) {
                finalIndexesToDelete.push(whitespaceStartedAt, i);
                console.log(
                  `1525 PUSH WHITESPACE [${whitespaceStartedAt}, ${i}]`
                );
                nonIndentationsWhitespaceLength += i - whitespaceStartedAt;
              } else if (chr === "{" && whitespaceStartedAt < i - 1) {
                finalIndexesToDelete.push(whitespaceStartedAt, i - 1);
                console.log(
                  `1531 PUSH WHITESPACE [${whitespaceStartedAt}, ${i - 1}]`
                );
                nonIndentationsWhitespaceLength += i - 1 - whitespaceStartedAt;
              }
            }

            headSelectorsArr.push(currentChunk);
            console.log(
              `1539 PUSH CHUNK "${`\u001b[${32}m${currentChunk}\u001b[${39}m`}" to headSelectorsArr which is now = ${JSON.stringify(
                headSelectorsArr,
                null,
                0
              )}`
            );
          }
          // it's round 2
          else if (selectorChunkCanBeDeleted) {
            let fromIndex = selectorChunkStartedAt;
            let toIndex = i;
            console.log(
              `1551 STARTING ${`\u001b[${33}m${`fromIndex`}\u001b[${39}m`} = ${fromIndex}`
            );
            let tempFindingIndex = 0;
            if (
              chr === "{" &&
              str[fromIndex - 1] !== ">" &&
              str[fromIndex - 1] !== "}"
            ) {
              // take care not to loop backwards from ending of <!--[if mso]>
              // also, not to loop then CSS is minified, imagine,
              // we're at here:
              // .col-3{z:2%}.col-4{y:3%}
              //             ^
              //            here
              //
              // 1. expand the left side to include comma, if such is present
              console.log(
                `1568 \u001b[${36}m${`traverse backwards`}\u001b[${39}m`
              );
              for (let y = selectorChunkStartedAt; y--; ) {
                totalCounter += 1;
                console.log(
                  `\u001b[${36}m${`----- str[${y}]=${str[y]}`}\u001b[${39}m`
                );
                if (str[y].trim() && str[y] !== ",") {
                  fromIndex = y + 1;
                  break;
                }
              }
              console.log(
                `1581 SET ${`\u001b[${33}m${`fromIndex`}\u001b[${39}m`} = ${JSON.stringify(
                  fromIndex,
                  null,
                  4
                )}`
              );

              // 2. if we're on the opening curly brace currently and there's
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
            } else if (
              matchLeft(str, fromIndex, "{", {
                trimBeforeMatching: true,
                cb: (_char, _theRemainderOfTheString, index) => {
                  tempFindingIndex = index as number;
                  return true;
                },
              })
            ) {
              fromIndex = tempFindingIndex + 2; // "1" being the length of
              // the finding, the "{" then another + "1" to get to the right
              // side of opening curly.
            }
            console.log(
              `1617 ENDING ${`\u001b[${33}m${`fromIndex`}\u001b[${39}m`} = ${fromIndex}`
            );
            console.log(
              `1620 ENDING ${`\u001b[${33}m${`toIndex`}\u001b[${39}m`} = ${toIndex}`
            );

            const resToPush = expander({
              str,
              from: fromIndex,
              to: toIndex,
              ifRightSideIncludesThisThenCropTightly: ".#",
              ifRightSideIncludesThisCropItToo: ",",
              extendToOneSide: "right",
            });
            console.log(
              `1632 ${`\u001b[${33}m${`resToPush`}\u001b[${39}m`} = ${JSON.stringify(
                resToPush,
                null,
                4
              )}`
            );

            (finalIndexesToDelete as any).push(...resToPush);
            console.log(
              `1641 PUSH CHUNK ${JSON.stringify(resToPush, null, 0)}`
            );

            // wipe any gathered selectors to be uglified
            if (opts.uglify) {
              currentChunksMinifiedSelectors.wipe();
            }
          } else {
            // not selectorChunkCanBeDeleted

            // 1. reset headWholeLineCanBeDeleted
            if (headWholeLineCanBeDeleted) {
              headWholeLineCanBeDeleted = false;
              console.log(
                `1655 ${`\u001b[${32}m${`BTW, WHOLE LINE CAN'T BE DELETED NOW`}\u001b[${39}m`}`
              );
            }

            // 2. reset onlyDeletedChunksFollow because this chunk was not
            // deleted, so this breaks the chain of "onlyDeletedChunksFollow"
            if (onlyDeletedChunksFollow) {
              onlyDeletedChunksFollow = false;
            }

            // 3. tend uglification
            if (opts.uglify) {
              console.log(
                `1668 ${`\u001b[${31}m${`MERGE WITH FINAL INDEXES`}\u001b[${39}m`} - ${JSON.stringify(
                  currentChunksMinifiedSelectors.current(),
                  null,
                  0
                )}`
              );
              finalIndexesToDelete.push(
                currentChunksMinifiedSelectors.current()
              );
              currentChunksMinifiedSelectors.wipe();
            }
          }

          // wipe the marker:
          if (chr !== "{") {
            selectorChunkStartedAt = null;
            console.log(
              `1685 WIPE ${`\u001b[${33}m${`selectorChunkStartedAt`}\u001b[${39}m`} = null`
            );
          } else if (round === 2) {
            // the last chunk was reached so let's evaluate, can we delete
            // the whole "row":

            console.log(
              `1692 ██ ${`\u001b[${33}m${`headWholeLineCanBeDeleted`}\u001b[${39}m`} = ${headWholeLineCanBeDeleted}`
            );

            // Cater the case when there was used class/id, comma, then at
            // least one unused class/id after (only unused-ones after, no
            // used classes/id's follow).
            if (
              !headWholeLineCanBeDeleted &&
              lastKeptChunksCommaAt !== null &&
              onlyDeletedChunksFollow
            ) {
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
              console.log(
                `1715 PUSH COMMA [${lastKeptChunksCommaAt}, ${deleteUpTo}]`
              );

              // reset:
              lastKeptChunksCommaAt = null;
              onlyDeletedChunksFollow = false;
              console.log(
                `1722 RESET: lastKeptChunksCommaAt = null; onlyDeletedChunksFollow = false;`
              );
            }
          }
        }

        //
      } else if (selectorSinceLinebreakDetected) {
        // reset the "selectorSinceLinebreakDetected"
        selectorSinceLinebreakDetected = false;
        console.log(
          `1733 RESET ${`\u001b[${33}m${`selectorSinceLinebreakDetected`}\u001b[${39}m`} = false`
        );
      }

      // catch the closing body tag
      // ================
      if (
        !doNothing &&
        !stateWithinStyleTag &&
        stateWithinBody &&
        str[i] === "/" &&
        matchRight(str, i, "body", { trimBeforeMatching: true, i: true }) &&
        matchLeft(str, i, "<", { trimBeforeMatching: true })
      ) {
        stateWithinBody = false;
        bodyStartedAt = null;
      }

      // catch the opening body tag
      // ================
      if (
        !doNothing &&
        str[i] === "<" &&
        matchRight(str, i, "body", {
          i: true,
          trimBeforeMatching: true,
          cb: (char, _theRemainderOfTheString, index) => {
            // remove any whitespace after opening bracket of a body tag:
            if (round === 1) {
              if (
                char !== undefined &&
                (char.trim() === "" || char === ">") &&
                typeof index === "number"
              ) {
                if (index - i > 5) {
                  console.log(
                    `1769 ${`\u001b[${33}m${`PUSH`}\u001b[${39}m`} [${i}, ${index}, "<body"]`
                  );
                  finalIndexesToDelete.push(i, index, "<body");
                  // remove the whitespace between < and body
                  nonIndentationsWhitespaceLength += (index as number) - i - 5;
                } else {
                  // do nothing
                  return true;
                }
              }
              return true;
            }
            // do nothing in round 2 because fix will already be implemented
            // during round 1:
            return true;
          },
        })
      ) {
        // Find the ending of the body tag:
        console.log(
          `1789 \u001b[${36}m${`march forward to find the ending of the opening body tag:`}\u001b[${39}m`
        );
        for (let y = i; y < len; y++) {
          totalCounter += 1;
          if (str[y] === ">") {
            bodyStartedAt = y + 1;
            console.log(
              `1796 SET ${`\u001b[${33}m${`bodyStartedAt`}\u001b[${39}m`} = ${bodyStartedAt}, then BREAK`
            );
            // we can't offset the index because there might be unused classes
            // or id's on the body tag itself.
            break;
          }
        }
        console.log(
          `1804 \u001b[${36}m${`stop marching forward`}\u001b[${39}m`
        );
      }

      // catch the start of a style attribute within body
      // ================
      if (
        !doNothing &&
        stateWithinBody &&
        !stateWithinStyleTag &&
        str[i] === "s" &&
        str[i + 1] === "t" &&
        str[i + 2] === "y" &&
        str[i + 3] === "l" &&
        str[i + 4] === "e" &&
        str[i + 5] === "=" &&
        badChars.includes(str[i - 1]) // this is to prevent false positives like attribute "urlid=..."
      ) {
        // TODO - tend the case when there are spaces around equal in style attribute
        if (`"'`.includes(str[i + 6])) {
          styleAttributeStartedAt = i + 7;
          console.log(
            `1826 ${`\u001b[${33}m${`styleAttributeStartedAt`}\u001b[${39}m`} = ${styleAttributeStartedAt}`
          );
        }
      }

      // catch the start of a class attribute within body
      // ================
      if (
        !doNothing &&
        stateWithinBody &&
        !stateWithinStyleTag &&
        !currentlyWithinQuotes &&
        str[i] === "c" &&
        str[i + 1] === "l" &&
        str[i + 2] === "a" &&
        str[i + 3] === "s" &&
        str[i + 4] === "s" &&
        // a character in front exists
        str[i - 1] &&
        // it's a whitespace character
        !str[i - 1].trim()
      ) {
        // TODO: record which double quote it was exactly, single or double

        console.log("1850");
        let valuesStart;
        let quoteless = false;

        if (str[i + 5] === "=") {
          if (str[i + 6] === '"' || str[i + 6] === "'") {
            valuesStart = i + 7;
            console.log(`1857 SET valuesStart = ${valuesStart}`);
          } else if (characterSuitableForNames(str[i + 6])) {
            valuesStart = i + 6;
            console.log(`1860 SET valuesStart = ${valuesStart}`);
            quoteless = true;
          } else if (
            str[i + 6] &&
            (!str[i + 6].trim() || "/>".includes(str[i + 6]))
          ) {
            const calculatedRange = expander({
              str,
              from: i,
              to: i + 6,
              ifRightSideIncludesThisThenCropTightly: "/>",
              wipeAllWhitespaceOnLeft: true,
            });
            console.log(
              `1874 PUSH ${JSON.stringify(calculatedRange, null, 0)}`
            );
            (finalIndexesToDelete as any).push(...calculatedRange);
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
                  console.log(`1887 PUSH [${i + 5}, ${y}]`);
                  finalIndexesToDelete.push(i + 5, y);
                }

                // 1-2. check what's next:
                if ((str[y + 1] === '"' || str[y + 1] === "'") && str[y + 2]) {
                  // 1-2-1. we found where values start:
                  valuesStart = y + 2;
                } else if (str[y + 1] && !str[y + 1].trim()) {
                  // 1-2-2. traverse even more forward:
                  for (let z = y + 1; z < len; z++) {
                    totalCounter += 1;
                    if (str[z].trim()) {
                      if (z > y + 1 && round === 1) {
                        console.log(`1901 PUSH [${y + 1}, ${z}]`);
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
              // // not equals is followed by "class" attribute's name
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

        console.log(
          `1936 ${`\u001b[${33}m${`valuesStart`}\u001b[${39}m`} = ${valuesStart}`
        );

        if (valuesStart) {
          // 1. mark it
          bodyClass = resetBodyClassOrId({
            valuesStart,
            quoteless,
            nameStart: i,
          });
          console.log(
            `1947 SET ${`\u001b[${33}m${`bodyClass`}\u001b[${39}m`} = ${JSON.stringify(
              bodyClass,
              null,
              4
            )}`
          );

          // 2. resets:
          if (round === 1) {
            bodyItsTheFirstClassOrId = true;
            console.log(
              `1958 SET ${`\u001b[${33}m${`bodyItsTheFirstClassOrId`}\u001b[${39}m`} = true`
            );
          } else if (round === 2) {
            // 2. reset the we-can-delete-whole-class/id marker:
            bodyClassOrIdCanBeDeleted = true;
            console.log(
              `1964 SET ${`\u001b[${33}m${`bodyClassOrIdCanBeDeleted`}\u001b[${39}m`} = true`
            );
          }
        }
      }

      // catch the start of an id attribute within body
      // ================
      if (
        !doNothing &&
        stateWithinBody &&
        !stateWithinStyleTag &&
        !currentlyWithinQuotes &&
        str[i] === "i" &&
        str[i + 1] === "d" &&
        // a character in front exists
        str[i - 1] &&
        // it's a whitespace character
        !str[i - 1].trim()
      ) {
        console.log("1984");
        let valuesStart;
        let quoteless = false;

        if (str[i + 2] === "=") {
          if (str[i + 3] === '"' || str[i + 3] === "'") {
            valuesStart = i + 4;
            console.log(`1991 SET valuesStart = ${valuesStart}`);
          } else if (characterSuitableForNames(str[i + 3])) {
            valuesStart = i + 3;
            console.log(`1994 SET valuesStart = ${valuesStart}`);
            quoteless = true;
          } else if (
            str[i + 3] &&
            (!str[i + 3].trim() || "/>".includes(str[i + 3]))
          ) {
            const calculatedRange = expander({
              str,
              from: i,
              to: i + 3,
              ifRightSideIncludesThisThenCropTightly: "/>",
              wipeAllWhitespaceOnLeft: true,
            });
            console.log(
              `2008 PUSH ${JSON.stringify(calculatedRange, null, 0)}`
            );
            (finalIndexesToDelete as any).push(...calculatedRange);
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
                  console.log(`2021 PUSH [${i + 2}, ${y}]`);
                  finalIndexesToDelete.push(i + 2, y);
                }

                // 1-2. check what's next:
                if ((str[y + 1] === '"' || str[y + 1] === "'") && str[y + 2]) {
                  // 1-2-1. we found where values start:
                  valuesStart = y + 2;
                } else if (str[y + 1] && !str[y + 1].trim()) {
                  // 1-2-2. traverse even more forward:
                  for (let z = y + 1; z < len; z++) {
                    totalCounter += 1;
                    if (str[z].trim()) {
                      if (z > y + 1 && round === 1) {
                        console.log(`2035 PUSH [${y + 1}, ${z}]`);
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
              // // not equals is followed by "id" attribute's name
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

        console.log(
          `2070 ${`\u001b[${33}m${`valuesStart`}\u001b[${39}m`} = ${valuesStart}`
        );

        if (valuesStart) {
          // 1. mark it
          bodyId = resetBodyClassOrId({
            valuesStart,
            quoteless,
            nameStart: i,
          });
          console.log(
            `2081 SET ${`\u001b[${33}m${`bodyId`}\u001b[${39}m`} = ${JSON.stringify(
              bodyId,
              null,
              4
            )}`
          );

          // 2. resets:
          if (round === 1) {
            bodyItsTheFirstClassOrId = true;
            console.log(
              `2092 SET ${`\u001b[${33}m${`bodyItsTheFirstClassOrId`}\u001b[${39}m`} = true`
            );
          } else if (round === 2) {
            // 2. reset the we-can-delete-whole-class/id marker:
            bodyClassOrIdCanBeDeleted = true;
            console.log(
              `2098 SET ${`\u001b[${33}m${`bodyClassOrIdCanBeDeleted`}\u001b[${39}m`} = true`
            );
          }
        }
      }

      // body: catch the first letter within each class attribute
      // ================
      if (
        !doNothing &&
        bodyClass.valuesStart !== null &&
        i >= (bodyClass.valuesStart as number) &&
        bodyClass.valueStart === null
      ) {
        if (allHeads && matchRightIncl(str, i, allHeads)) {
          // 1. activate do-nothing flag
          doNothing = true;
          console.log(
            `2116 SET ${`\u001b[${33}m${`doNothing`}\u001b[${39}m`} = true`
          );

          // 2. mark this class as not to be removed (as a whole)
          bodyClassOrIdCanBeDeleted = false;

          if (whitespaceStartedAt && i > whitespaceStartedAt + 1) {
            const calculatedRange = expander({
              str,
              from: whitespaceStartedAt,
              to: i,
              ifLeftSideIncludesThisThenCropTightly: "\"'",
              ifRightSideIncludesThisThenCropTightly: "\"'",
            });
            (finalIndexesToDelete as any).push(...calculatedRange);
            console.log(
              `2132 PUSH ${JSON.stringify(calculatedRange, null, 4)}`
            );
            whitespaceStartedAt = null;
            console.log(
              `2136 SET ${`\u001b[${33}m${`whitespaceStartedAt`}\u001b[${39}m`} = null`
            );
          } else if (whitespaceStartedAt) {
            whitespaceStartedAt = null;
          }

          // 3. set doNothingUntil to corresponding tails
          const matchedHeads = matchRightIncl(str, i, allHeads);
          console.log(
            `2145 ${`\u001b[${33}m${`matchedHeads`}\u001b[${39}m`} = ${matchedHeads}`
          );
          const findings = opts.backend.find(
            (headsTailsObj) => headsTailsObj.heads === matchedHeads
          );
          console.log(
            `2151 ${`\u001b[${33}m${`findings`}\u001b[${39}m`} = ${JSON.stringify(
              findings,
              null,
              4
            )}`
          );
          if (findings && findings.tails) {
            doNothingUntil = findings.tails;
            console.log(
              `2160 SET ${`\u001b[${33}m${`doNothingUntil`}\u001b[${39}m`} = ${doNothingUntil}`
            );
          }
        } else if (characterSuitableForNames(chr)) {
          // 1. mark the class' starting index
          bodyClass.valueStart = i;
          console.log(
            `2167 SET ${`\u001b[${33}m${`bodyClass.valueStart`}\u001b[${39}m`} = ${
              bodyClass.valueStart
            }`
          );

          // 2. maybe there was whitespace between quotes and this?, like class="  zzz"
          if (round === 1) {
            //
            if (
              bodyItsTheFirstClassOrId &&
              bodyClass.valuesStart !== null &&
              !str.slice(bodyClass.valuesStart, i).trim() &&
              bodyClass.valuesStart < i
            ) {
              // 1. submit the whitespace characters in the range for deletion:
              finalIndexesToDelete.push(bodyClass.valuesStart, i);
              console.log(
                `2184 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} LEADING WHITESPACE [${
                  bodyClass.valuesStart
                }, ${i}]`
              );
              nonIndentationsWhitespaceLength += i - bodyClass.valuesStart;
              // 2. disable bodyItsTheFirstClassOrId flag so we won't waste resources on
              // further classes/id's:
              bodyItsTheFirstClassOrId = false;
              console.log(
                `2193 SET ${`\u001b[${33}m${`bodyItsTheFirstClassOrId`}\u001b[${39}m`} = false`
              );
            } else if (
              whitespaceStartedAt !== null &&
              whitespaceStartedAt < i - 1
            ) {
              // maybe there's whitespace between classes?
              finalIndexesToDelete.push(whitespaceStartedAt + 1, i);
              console.log(
                `2202 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                  whitespaceStartedAt + 1
                }, ${i}]`
              );
              nonIndentationsWhitespaceLength += i - whitespaceStartedAt + 1;
            }
          }
        }
      }

      // catch the ending of a class name
      // ================
      if (
        !doNothing &&
        bodyClass.valueStart !== null &&
        i > bodyClass.valueStart &&
        (!characterSuitableForNames(chr) ||
          (allTails && matchRightIncl(str, i, allTails)))
      ) {
        // insurance against ESP tag joined with a class
        // <table class="zzz-{{ loop.index }}">

        if (allHeads && matchRightIncl(str, i, allHeads)) {
          bodyClass.valueStart = null;
          console.log(
            `2227 SET ${`\u001b[${33}m${`bodyClass.valueStart`}\u001b[${39}m`} = null`
          );

          bodyClass = resetBodyClassOrId();
          console.log(`2231 RESET bodyClass`);

          const matchedHeads = matchRightIncl(str, i, allHeads);
          console.log(
            `2235 ${`\u001b[${33}m${`matchedHeads`}\u001b[${39}m`} = ${matchedHeads}`
          );
          const findings = opts.backend.find(
            (headsTailsObj) => headsTailsObj.heads === matchedHeads
          );
          console.log(
            `2241 ${`\u001b[${33}m${`findings`}\u001b[${39}m`} = ${JSON.stringify(
              findings,
              null,
              4
            )}`
          );
          if (findings && findings.tails) {
            doNothingUntil = findings.tails;
            console.log(
              `2250 SET ${`\u001b[${33}m${`doNothingUntil`}\u001b[${39}m`} = ${doNothingUntil}`
            );
          }
        } else {
          // normal operations can continue
          const carvedClass = `${str.slice(bodyClass.valueStart, i)}`;
          console.log(
            `2257 CARVED OUT BODY CLASS "${`\u001b[${32}m${carvedClass}\u001b[${39}m`}"`
          );
          console.log(
            `2260 ██ ${`\u001b[${33}m${`allTails`}\u001b[${39}m`} = ${JSON.stringify(
              allTails,
              null,
              4
            )}`
          );
          // console.log(
          //   `2206 R1 = ${!!(allTails && matchRightIncl(str, i, allTails))}`
          // );
          // console.log(`2208 R2 = ${!!matchRightIncl(str, i, allTails)}`);
          // console.log(
          //   `2210 R3 = ${!!(allHeads && matchRightIncl(str, i, allHeads))}`
          // );

          if (round === 1) {
            bodyClassesArr.push(`.${carvedClass}`);
            console.log(
              `2277 \u001b[${35}m${`PUSH`}\u001b[${39}m slice ".${carvedClass}" to bodyClassesArr which becomes:\n${JSON.stringify(
                bodyClassesArr,
                null,
                0
              )}`
            );
          }
          // round 2
          else if (
            bodyClass.valueStart != null &&
            bodyClassesToDelete.includes(carvedClass)
          ) {
            // submit this class for deletion
            console.log(
              `2291 ${`\u001b[${33}m${`carvedClass`}\u001b[${39}m`} = ${carvedClass}`
            );
            console.log(
              `2294 before expanding, ${`\u001b[${33}m${`bodyClass.valueStart`}\u001b[${39}m`} = ${JSON.stringify(
                bodyClass.valueStart,
                null,
                0
              )}`
            );

            const expandedRange = expander({
              str,
              from: bodyClass.valueStart,
              to: i,
              ifLeftSideIncludesThisThenCropTightly: `"'`,
              ifRightSideIncludesThisThenCropTightly: `"'`,
              wipeAllWhitespaceOnLeft: true,
            });

            // precaution against too tight crop when backend markers are involved
            let whatToInsert = "";
            if (
              str[expandedRange[0] - 1] &&
              str[expandedRange[0] - 1].trim() &&
              str[expandedRange[1]] &&
              str[expandedRange[1]].trim() &&
              (allHeads || allTails) &&
              ((allHeads &&
                matchLeft(str, expandedRange[0], allTails as string[])) ||
                (allTails &&
                  matchRightIncl(str, expandedRange[1], allHeads as string[])))
            ) {
              whatToInsert = " ";
            }

            (finalIndexesToDelete as any).push(...expandedRange, whatToInsert);
            console.log(
              `2328 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
                [expandedRange[0], expandedRange[1], whatToInsert],
                null,
                0
              )}`
            );
          } else {
            // 1. turn off the bodyClassOrIdCanBeDeleted
            bodyClassOrIdCanBeDeleted = false;
            console.log(
              `2338 SET ${`\u001b[${33}m${`bodyClassOrIdCanBeDeleted`}\u001b[${39}m`} = false`
            );

            // 2. uglify?
            if (
              opts.uglify &&
              !(
                Array.isArray(opts.whitelist) &&
                opts.whitelist.length &&
                matcher([`.${carvedClass}`], opts.whitelist).length
              )
            ) {
              console.log(
                `2351 ${`\u001b[${31}m${`PUSH [${bodyClass.valueStart}, ${i},
                  ${
                    allClassesAndIdsWithinHeadFinalUglified[
                      allClassesAndIdsWithinHeadFinal.indexOf(`.${carvedClass}`)
                    ]
                  }]`}\u001b[${39}m`}`
              );
              finalIndexesToDelete.push(
                bodyClass.valueStart,
                i,
                allClassesAndIdsWithinHeadFinalUglified[
                  allClassesAndIdsWithinHeadFinal.indexOf(`.${carvedClass}`)
                ].slice(1)
              );
            }
          }

          bodyClass.valueStart = null;
          console.log(
            `2370 SET ${`\u001b[${33}m${`bodyClass.valueStart`}\u001b[${39}m`} = null`
          );
        }
      }

      // catch the ending of an id name
      // ================
      if (
        !doNothing &&
        bodyId &&
        bodyId.valueStart !== null &&
        i > bodyId.valueStart &&
        (!characterSuitableForNames(chr) ||
          (allTails && matchRightIncl(str, i, allTails)))
      ) {
        console.log("2385");
        const carvedId = str.slice(bodyId.valueStart, i);
        console.log(
          `2388 CARVED OUT BODY ID "${`\u001b[${32}m${carvedId}\u001b[${39}m`}"`
        );
        if (round === 1) {
          bodyIdsArr.push(`#${carvedId}`);
          console.log(
            `2393 \u001b[${35}m${`PUSH`}\u001b[${39}m slice "${`#${carvedId}`}" to bodyIdsArr which is now:\n${JSON.stringify(
              bodyIdsArr,
              null,
              4
            )}`
          );
        }
        // round 2
        else if (
          bodyId.valueStart != null &&
          bodyIdsToDelete.includes(carvedId)
        ) {
          // submit this id for deletion
          console.log(
            `2407 ${`\u001b[${33}m${`carvedId`}\u001b[${39}m`} = ${carvedId}`
          );
          console.log(
            `2410 before expanding, ${`\u001b[${33}m${`bodyId.valueStart`}\u001b[${39}m`} = ${JSON.stringify(
              bodyId.valueStart,
              null,
              4
            )}`
          );

          const expandedRange = expander({
            str,
            from: bodyId.valueStart,
            to: i,
            ifRightSideIncludesThisThenCropTightly: `"'`,
            wipeAllWhitespaceOnLeft: true,
          });

          // precaution against too tight crop when backend markers are involved
          if (
            str[expandedRange[0] - 1] &&
            str[expandedRange[0] - 1].trim() &&
            str[expandedRange[1]] &&
            str[expandedRange[1]].trim() &&
            (allHeads || allTails) &&
            ((allHeads && matchLeft(str, expandedRange[0], allTails || [])) ||
              (allTails &&
                matchRightIncl(str, expandedRange[1], allHeads || [])))
          ) {
            expandedRange[0] += 1;
            console.log(`2437 REDUCE expandedRange[0] by one`);
          }

          (finalIndexesToDelete as any).push(...expandedRange);
          console.log(
            `2442 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
              expandedRange,
              null,
              0
            )}`
          );
        } else {
          // 1. turn off the bodyClassOrIdCanBeDeleted
          bodyClassOrIdCanBeDeleted = false;
          console.log(
            `2452 SET ${`\u001b[${33}m${`bodyClassOrIdCanBeDeleted`}\u001b[${39}m`} = false`
          );
          console.log(
            `2455 ${`\u001b[${33}m${`carvedId`}\u001b[${39}m`} = ${JSON.stringify(
              carvedId,
              null,
              4
            )}`
          );
          console.log(
            `2462 opts.whitelist = ${JSON.stringify(opts.whitelist, null, 4)}`
          );
          console.log(
            `2465 matcher([#${carvedId}], opts.whitelist) = ${matcher(
              [`#${carvedId}`],
              opts.whitelist
            )}`
          );

          // 2. uglify?
          if (
            opts.uglify &&
            !(
              Array.isArray(opts.whitelist) &&
              opts.whitelist.length &&
              matcher([`#${carvedId}`], opts.whitelist).length
            )
          ) {
            console.log(
              `2481 ${`\u001b[${31}m${`PUSH [${bodyId.valueStart}, ${i},
                ${
                  allClassesAndIdsWithinHeadFinalUglified[
                    allClassesAndIdsWithinHeadFinal.indexOf(`#${carvedId}`)
                  ]
                }]`}\u001b[${39}m`}`
            );
            finalIndexesToDelete.push(
              bodyId.valueStart,
              i,
              allClassesAndIdsWithinHeadFinalUglified[
                allClassesAndIdsWithinHeadFinal.indexOf(`#${carvedId}`)
              ].slice(1)
            );
          }
        }

        bodyId.valueStart = null;
        console.log(
          `2500 SET ${`\u001b[${33}m${`bodyId.valueStart`}\u001b[${39}m`} = null`
        );
      }

      // body: stop the class attribute's recording if closing single/double quote encountered
      // ================
      // TODO: replace chr check against any quote with exact quote that was previously recorded on opening
      if (
        !doNothing &&
        bodyClass.valuesStart != null &&
        ((!bodyClass.quoteless && (chr === "'" || chr === '"')) ||
          (bodyClass.quoteless && !characterSuitableForNames(str[i]))) &&
        i >= bodyClass.valuesStart
      ) {
        console.log("2514");
        if (i === bodyClass.valuesStart) {
          console.log(`2516 EMPTY CLASS DETECTED!`);
          if (round === 1) {
            console.log(
              `2519 PUSH ${JSON.stringify(
                expander({
                  str,
                  from: bodyClass.nameStart as number,
                  to: i + 1,
                  ifRightSideIncludesThisThenCropTightly: "/>",
                  wipeAllWhitespaceOnLeft: true,
                }),
                null,
                0
              )}`
            );
            (finalIndexesToDelete as any).push(
              ...expander({
                str,
                from: bodyClass.nameStart as number,
                to: i + 1,
                ifRightSideIncludesThisThenCropTightly: "/>",
                wipeAllWhitespaceOnLeft: true,
              })
            );
          }
        } else {
          // 1. if it's second round and by now the delete-whole-class/id marker
          // is active (no skipped classes/id which had turn it off yet) then
          // delete this class or id completely:
          if (round === 2 && bodyClassOrIdCanBeDeleted) {
            // 1. submit the range of whole class/id for deletion
            // finalIndexesToDelete.push(bodyClass.valuesStart - 7, i + 1);
            console.log(
              `2549 ${`\u001b[${33}m${`initial range`}\u001b[${39}m`}: [${
                bodyClass.valuesStart - 7
              }, ${`'"`.includes(str[i]) ? i + 1 : i}]`
            );
            const expandedRange = expander({
              str,
              from: bodyClass.valuesStart - 7,
              to: `'"`.includes(str[i]) ? i + 1 : i,
              ifRightSideIncludesThisThenCropTightly: "/>",
              wipeAllWhitespaceOnLeft: true,
            });
            console.log(
              `2561 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`expandedRange`}\u001b[${39}m`}: ${JSON.stringify(
                expandedRange,
                null,
                4
              )}`
            );

            // precaution against too tight crop when backend markers are involved
            let whatToInsert = "";
            if (
              str[expandedRange[0] - 1] &&
              str[expandedRange[0] - 1].trim() &&
              str[expandedRange[1]] &&
              str[expandedRange[1]].trim() &&
              !"/>".includes(str[expandedRange[1]])
              // (allHeads || allTails) &&
              // ((allHeads && matchLeft(str, expandedRange[0], allHeads)) ||
              //   (allTails && matchRightIncl(str, expandedRange[1], allTails)))
            ) {
              whatToInsert = " ";
              console.log(
                `2582 SET whatToInsert = " " because str[expandedRange[0] - 1] = str[${
                  expandedRange[0] - 1
                }] = ${
                  str[expandedRange[0] - 1]
                } and str[expandedRange[1]] = str[${expandedRange[1]}] = ${
                  str[expandedRange[1]]
                }`
              );
            }

            (finalIndexesToDelete as any).push(...expandedRange, whatToInsert);
            console.log(
              `2594 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
                [expandedRange[0], expandedRange[1], whatToInsert],
                null,
                4
              )}`
            );
          }

          // 3. tend the trailing whitespace, as in class="zzzz  "
          if (whitespaceStartedAt !== null) {
            finalIndexesToDelete.push(whitespaceStartedAt, i);
            console.log(
              `2606 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} TRAILING WHITESPACE [${whitespaceStartedAt}, ${i}]`
            );
          }
        }

        // 2. reset the marker
        bodyClass = resetBodyClassOrId();
        console.log(`2613 RESET ${`\u001b[${33}m${`bodyClass`}\u001b[${39}m`}`);
      }

      // body: stop the id attribute's recording if closing single/double quote encountered
      // ================
      // TODO: replace chr check against any quote with exact quote that was previously
      if (
        !doNothing &&
        bodyId.valuesStart !== null &&
        ((!bodyId.quoteless && (chr === "'" || chr === '"')) ||
          (bodyId.quoteless && !characterSuitableForNames(str[i]))) &&
        i >= bodyId.valuesStart
      ) {
        console.log("2626");
        if (i === bodyId.valuesStart) {
          console.log(`2628 EMPTY ID DETECTED!`);
          if (round === 1) {
            console.log(
              `2631 [bodyId.nameStart=${bodyId.nameStart}, i+1=${i + 1}] => [${
                expander({
                  str,
                  from: bodyId.nameStart as number,
                  to: i + 1,
                  ifRightSideIncludesThisThenCropTightly: "/>",
                  wipeAllWhitespaceOnLeft: true,
                })[0]
              }, ${
                expander({
                  str,
                  from: bodyId.nameStart as number,
                  to: i + 1,
                  ifRightSideIncludesThisThenCropTightly: "/>",
                  wipeAllWhitespaceOnLeft: true,
                })[1]
              }]`
            );
            console.log(
              `2650 PUSH ${JSON.stringify(
                expander({
                  str,
                  from: bodyId.nameStart as number,
                  to: i + 1,
                  ifRightSideIncludesThisThenCropTightly: "/>",
                  wipeAllWhitespaceOnLeft: true,
                }),
                null,
                0
              )}`
            );
            (finalIndexesToDelete as any).push(
              ...expander({
                str,
                from: bodyId.nameStart as number,
                to: i + 1,
                ifRightSideIncludesThisThenCropTightly: "/>",
                wipeAllWhitespaceOnLeft: true,
              })
            );
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
              wipeAllWhitespaceOnLeft: true,
            });

            // precaution against too tight crop when backend markers are involved
            let whatToInsert = "";
            if (
              str[expandedRange[0] - 1] &&
              str[expandedRange[0] - 1].trim() &&
              str[expandedRange[1]] &&
              str[expandedRange[1]].trim() &&
              !"/>".includes(str[expandedRange[1]])
              // (allHeads || allTails) &&
              // ((allHeads && matchLeft(str, expandedRange[0], allHeads)) ||
              //   (allTails && matchRightIncl(str, expandedRange[1], allTails)))
            ) {
              whatToInsert = " ";
              console.log(`2701 SET whatToInsert = " "`);
            }

            (finalIndexesToDelete as any).push(...expandedRange, whatToInsert);
            console.log(
              `2706 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
                [expandedRange[0], expandedRange[1], whatToInsert],
                null,
                4
              )}`
            );
          }

          // 3. tend the trailing whitespace, as in id="zzzz  "
          if (whitespaceStartedAt !== null) {
            finalIndexesToDelete.push(whitespaceStartedAt, i);
            console.log(
              `2718 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} TRAILING WHITESPACE [${whitespaceStartedAt}, ${i}]`
            );
          }
        }

        // reset the marker in either case
        bodyId = resetBodyClassOrId();
        console.log(`2725 RESET ${`\u001b[${33}m${`bodyId`}\u001b[${39}m`}`);
      }

      // body: catch the first letter within each id attribute
      // ================
      if (
        !doNothing &&
        bodyId.valuesStart &&
        i >= bodyId.valuesStart &&
        bodyId.valueStart === null
      ) {
        if (allHeads && matchRightIncl(str, i, allHeads)) {
          // 1. activate do-nothing flag
          doNothing = true;
          console.log(
            `2740 SET ${`\u001b[${33}m${`doNothing`}\u001b[${39}m`} = true`
          );

          // 2. mark this id as not to be removed (as a whole)
          bodyClassOrIdCanBeDeleted = false;

          if (whitespaceStartedAt && i > whitespaceStartedAt + 1) {
            const calculatedRange = expander({
              str,
              from: whitespaceStartedAt,
              to: i,
              ifLeftSideIncludesThisThenCropTightly: "\"'",
              ifRightSideIncludesThisThenCropTightly: "\"'",
            });
            (finalIndexesToDelete as any).push(...calculatedRange);
            console.log(
              `2756 PUSH ${JSON.stringify(calculatedRange, null, 4)}`
            );
            whitespaceStartedAt = null;
            console.log(
              `2760 SET ${`\u001b[${33}m${`whitespaceStartedAt`}\u001b[${39}m`} = null`
            );
          } else if (whitespaceStartedAt) {
            whitespaceStartedAt = null;
          }

          // 3. set doNothingUntil to corresponding tails
          const matchedHeads = matchRightIncl(str, i, allHeads);
          console.log(
            `2769 ${`\u001b[${33}m${`matchedHeads`}\u001b[${39}m`} = ${matchedHeads}`
          );
          const findings = opts.backend.find(
            (headsTailsObj) => headsTailsObj.heads === matchedHeads
          );
          console.log(
            `2775 ${`\u001b[${33}m${`findings`}\u001b[${39}m`} = ${JSON.stringify(
              findings,
              null,
              4
            )}`
          );
          if (findings && findings.tails) {
            doNothingUntil = findings.tails;
            console.log(
              `2784 SET ${`\u001b[${33}m${`doNothingUntil`}\u001b[${39}m`} = ${doNothingUntil}`
            );
          }
        } else if (characterSuitableForNames(chr)) {
          // 1. mark the id's starting index
          bodyId.valueStart = i;
          console.log(
            `2791 SET ${`\u001b[${33}m${`bodyId.valueStart`}\u001b[${39}m`} = ${
              bodyId.valueStart
            }`
          );

          // 2. maybe there was whitespace between quotes and this?, like id="  zzz"
          if (round === 1) {
            //
            if (
              bodyItsTheFirstClassOrId &&
              bodyId.valuesStart !== null &&
              !str.slice(bodyId.valuesStart, i).trim() &&
              bodyId.valuesStart < i
            ) {
              // 1. submit the whitespace characters in the range for deletion:
              finalIndexesToDelete.push(bodyId.valuesStart, i);
              console.log(
                `2808 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                  bodyId.valuesStart
                }, ${i}]`
              );
              nonIndentationsWhitespaceLength += i - bodyId.valuesStart;
              // 2. disable bodyItsTheFirstClassOrId flag so we won't waste resources on
              // further classes/id's:
              bodyItsTheFirstClassOrId = false;
              console.log(
                `2817 SET ${`\u001b[${33}m${`bodyItsTheFirstClassOrId`}\u001b[${39}m`} = false`
              );
            } else if (
              whitespaceStartedAt !== null &&
              whitespaceStartedAt < i - 1
            ) {
              // maybe there's whitespace between classes?
              finalIndexesToDelete.push(whitespaceStartedAt + 1, i);
              console.log(
                `2826 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                  whitespaceStartedAt + 1
                }, ${i}]`
              );
              nonIndentationsWhitespaceLength += i - whitespaceStartedAt + 1;
            }
          }
        }
      }

      // body: catch the start and end of HTML comments
      // ================
      if (!doNothing && round === 1) {
        // 1. catch the HTML comments' cut off point to check for blocking
        // characters (mso, IE, whatever given in the
        // opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains)
        // ==================================
        if (
          commentStartedAt !== null &&
          commentStartedAt < i &&
          str[i] === ">" &&
          !usedOnce
        ) {
          console.log(`I.`);
          console.log(
            `2851 ${`\u001b[${33}m${`str.slice(commentStartedAt, i)`}\u001b[${39}m`} = ${JSON.stringify(
              str.slice(commentStartedAt, i),
              null,
              4
            )}`
          );

          if (
            opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains &&
            Array.isArray(
              opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains
            ) &&
            opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.length &&
            opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.some(
              (val) =>
                val.trim() &&
                str
                  .slice(commentStartedAt as number, i)
                  .toLowerCase()
                  .includes(val)
            )
          ) {
            canDelete = false;
            console.log(
              `2875 SET ${`\u001b[${33}m${`canDelete`}\u001b[${39}m`} = ${canDelete}`
            );
          }
          usedOnce = true;
          console.log(
            `2880 SET \u001b[${33}m${`usedOnce`}\u001b[${39}m = ${usedOnce}`
          );
        }

        // 2. catch the HTML comments' ending
        // ==================================
        if (commentStartedAt !== null && str[i] === ">") {
          console.log(`II.`);
          console.log(
            `2889 BTW, ${`\u001b[${33}m${`canDelete`}\u001b[${39}m`} = ${JSON.stringify(
              canDelete,
              null,
              4
            )}`
          );
          // 1. catch healthy comment ending
          if (!bogusHTMLComment && str[i - 1] === "-" && str[i - 2] === "-") {
            // not bogus

            const calculatedRange = expander({
              str,
              from: commentStartedAt,
              to: i + 1,
              wipeAllWhitespaceOnLeft: true,
              addSingleSpaceToPreventAccidentalConcatenation: true,
            });
            if (opts.removeHTMLComments && canDelete) {
              // Instead of finalIndexesToDelete.push(i, y + 3); use expander()
              // so that we manage the whitespace outwards properly:
              console.log(
                `2910 PUSH COMMENT ${JSON.stringify(calculatedRange, null, 0)}`
              );
              (finalIndexesToDelete as any).push(...calculatedRange);
            }
            commentsLength += calculatedRange[1] - calculatedRange[0];

            // reset the markers:
            commentStartedAt = null;
            bogusHTMLComment = undefined;
            console.log(
              `2920 RESET ${`\u001b[${33}m${`commentStartedAt`}\u001b[${39}m`} = null; ${`\u001b[${33}m${`bogusHTMLComment`}\u001b[${39}m`} = undefined`
            );
          } else if (bogusHTMLComment) {
            const calculatedRange = expander({
              str,
              from: commentStartedAt,
              to: i + 1,
              wipeAllWhitespaceOnLeft: true,
              addSingleSpaceToPreventAccidentalConcatenation: true,
            });
            if (opts.removeHTMLComments && canDelete) {
              console.log(
                `2932 PUSH BOGUS COMMENT ${JSON.stringify(
                  calculatedRange,
                  null,
                  0
                )}`
              );
              (finalIndexesToDelete as any).push(...calculatedRange);
            }
            commentsLength += calculatedRange[1] - calculatedRange[0];

            // reset the markers:
            commentStartedAt = null;
            bogusHTMLComment = undefined;
            console.log(
              `2946 RESET ${`\u001b[${33}m${`commentStartedAt`}\u001b[${39}m`} = null; ${`\u001b[${33}m${`bogusHTMLComment`}\u001b[${39}m`} = undefined`
            );
          }
        }

        // 3. catch the HTML comments' starting
        // ====================================
        if (
          opts.removeHTMLComments &&
          commentStartedAt === null &&
          str[i] === "<" &&
          str[i + 1] === "!"
        ) {
          if (
            (!allHeads ||
              (Array.isArray(allHeads) &&
                allHeads.length &&
                !allHeads.includes("<!"))) &&
            (!allTails ||
              (Array.isArray(allTails) &&
                allTails.length &&
                !allTails.includes("<!")))
          ) {
            console.log(`2969 III. catch HTML comments clauses`);
            console.log(
              `2971 ${`\u001b[${33}m${`commentNearlyStartedAt`}\u001b[${39}m`} = ${JSON.stringify(
                commentNearlyStartedAt,
                null,
                4
              )}`
            );
            // 3.1. if there's no DOCTYPE on the right, mark the comment's start,
            // except in cases when it's been whitelisted (Outlook conditionals for example):
            if (
              !matchRight(str, i + 1, "doctype", {
                i: true,
                trimBeforeMatching: true,
              }) &&
              !(
                str[i + 2] === "-" &&
                str[i + 3] === "-" &&
                Array.isArray(
                  opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains
                ) &&
                opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.length &&
                matchRight(
                  str,
                  i + 3,
                  opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains,
                  {
                    trimBeforeMatching: true,
                  }
                )
              )
            ) {
              commentStartedAt = i;
              usedOnce = false;
              canDelete = true;
              console.log(
                `3005 SET ${`\u001b[${33}m${`commentStartedAt`}\u001b[${39}m`} = ${commentStartedAt}; ${`\u001b[${33}m${`usedOnce`}\u001b[${39}m`} = ${usedOnce}; ${`\u001b[${33}m${`canDelete`}\u001b[${39}m`} = ${canDelete};`
              );
            }

            // 3.2. detect, is it healthy or bogus comment (bogusHTMLComment = true/false)
            bogusHTMLComment = !(str[i + 2] === "-" && str[i + 3] === "-");
            console.log(
              `3012 SET ${`\u001b[${33}m${`bogusHTMLComment`}\u001b[${39}m`} = ${bogusHTMLComment}`
            );
          }

          // if the comment beginning rule was not triggered, mark it as
          // would-have-been comment anyway because we need to cater empty
          // comment chunks ("<!-- -->") which follow conditional not-Outlook
          // comment chunks and without this, there's no way to know that
          // regular comment chunk was in front.
          if (commentStartedAt !== i) {
            commentNearlyStartedAt = i;
          }
        }
      }

      //                                S
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
        console.log(`3051 REDUCE curliesDepth now = ${curliesDepth}`);
      }

      // pinpoint opening curly braces (in head styles), but not @media's.
      // ================
      if (!doNothing && chr === "{" && checkingInsideCurlyBraces) {
        if (!insideCurlyBraces) {
          // 1. flip the flag
          insideCurlyBraces = true;
          console.log(
            `3061 SET ${`\u001b[${33}m${`insideCurlyBraces`}\u001b[${39}m`} = true`
          );

          // 2. if the whitespace was in front and it contained line breaks, wipe
          // that whitespace:
          if (
            whitespaceStartedAt !== null &&
            (str.slice(whitespaceStartedAt, i).includes("\n") ||
              str.slice(whitespaceStartedAt, i).includes("\r"))
          ) {
            finalIndexesToDelete.push(whitespaceStartedAt, i);
            console.log(
              `3073 PUSH LEADING WHITESPACE [${whitespaceStartedAt}, ${i}]`
            );
          }
        } else {
          curliesDepth += 1;
          console.log(`3078 BUMP curliesDepth now = ${curliesDepth}`);
        }
      }

      // catch the whitespace
      if (!doNothing) {
        if (!str[i].trim()) {
          if (whitespaceStartedAt === null) {
            whitespaceStartedAt = i;
            // console.log(
            //   `2974 SET ${`\u001b[${33}m${`whitespaceStartedAt`}\u001b[${39}m`} = ${whitespaceStartedAt}`
            // );
          }
        } else if (whitespaceStartedAt !== null) {
          // reset the marker
          whitespaceStartedAt = null;
        }
      }

      // query the ranges clone from round 1, get the first range,
      // if current index is at the "start" index of that range,
      // offset the current index to its "to" index. This way,
      // in round 2 we "jump" over what was submitted for deletion
      // in round 1.
      if (
        !doNothing &&
        round === 2 &&
        Array.isArray(round1RangesClone) &&
        round1RangesClone.length &&
        i === round1RangesClone[0][0]
      ) {
        // offset index, essentially "jumping over" what was submitted for deletion in round 1
        console.log("\n");
        const temp = round1RangesClone.shift();
        console.log(
          `3113 ${`\u001b[${33}m${`temp`}\u001b[${39}m`} = ${JSON.stringify(
            temp,
            null,
            0
          )}`
        );
        if (temp && temp[1] - 1 > i) {
          console.log(
            `3121 \u001b[${31}m${`██ OFFSET MAIN INDEX FROM ${i} TO ${
              temp[1] - 1
            }`}\u001b[${39}m, then step out`
          );
          i = temp[1] - 1;
        }
        // if (doNothing) {
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
      }

      // catch would-have-been comment endings
      if (commentNearlyStartedAt !== null && str[i] === ">") {
        // 1. reset the marker
        commentNearlyStartedAt = null;
        console.log(
          `3153 ${`\u001b[${33}m${`commentNearlyStartedAt`}\u001b[${39}m`} = null`
        );

        // 2. check, is there empty comment block on the right which sometimes
        // follows outlook conditionals
        let temp = 0;
        if (
          opts.removeHTMLComments &&
          Array.isArray(opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains) &&
          opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.length &&
          (opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.some((val) =>
            val.includes("if")
          ) ||
            opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.some((val) =>
              val.includes("mso")
            ) ||
            opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.some((val) =>
              val.includes("ie")
            )) &&
          matchRight(str, i, "<!--", {
            trimBeforeMatching: true,
            cb: (_char, _theRemainderOfTheString, index) => {
              temp = index as number;
              return true;
            },
          })
        ) {
          console.log(
            `3181 I ${`\u001b[${33}m${`temp`}\u001b[${39}m`} = ${JSON.stringify(
              temp,
              null,
              4
            )}, string that follows: "${JSON.stringify(
              str.slice(temp, temp + 10),
              null,
              4
            )}"`
          );
          if (
            matchRight(str, temp - 1, "-->", {
              trimBeforeMatching: true,
              cb: (_char, _theRemainderOfTheString, index) => {
                temp = index as number;
                return true;
              },
            })
          ) {
            console.log(
              `3201 II. ${`\u001b[${33}m${`temp`}\u001b[${39}m`} = ${JSON.stringify(
                temp,
                null,
                4
              )}, string that follows: "${JSON.stringify(
                str.slice(temp, temp + 10),
                null,
                4
              )}"`
            );
          }

          if (typeof temp === "number") {
            i = temp - 1;
          }
          console.log(
            `3217 SET ${`\u001b[${33}m${`i`}\u001b[${39}m`} = ${JSON.stringify(
              i,
              null,
              4
            )}; THEN ${`\u001b[${32}m${`CONTINUE`}\u001b[${39}m`}`
          );
          continue;
        }
      }

      // LOGGING:
      // ================

      // NOTE: logging switch below
      if (round === 9) {
        if (stateWithinBody) {
          console.log(
            `3234 ${
              bodyClass.valueStart
                ? `\n* ${`\u001b[${90}m${`bodyClass.valueStart`}\u001b[${39}m`} = ${
                    bodyClass.valueStart
                  }`
                : ""
            }${
              bodyId.valueStart
                ? `\n* ${`\u001b[${90}m${`bodyId.valueStart`}\u001b[${39}m`} = ${
                    bodyId.valueStart
                  }`
                : ""
            }${
              bodyClass.valuesStart
                ? `\n* ${`\u001b[${90}m${`bodyClass`}\u001b[${39}m`} = ${JSON.stringify(
                    bodyClass,
                    null,
                    0
                  )}`
                : ""
            }${
              bodyId.valuesStart
                ? `\n* ${`\u001b[${90}m${`bodyId`}\u001b[${39}m`} = ${JSON.stringify(
                    bodyId,
                    null,
                    0
                  )}`
                : ""
            }`
          );
          // logging:
          // console.log(
          //   `3149 ${`\u001b[${90}m${`bodyClassOrIdCanBeDeleted`}\u001b[${39}m`} = ${JSON.stringify(
          //     bodyClassOrIdCanBeDeleted,
          //     null,
          //     0
          //   )}`
          // );
          // console.log(
          //   `3156 ${`\u001b[${90}m${`whitespaceStartedAt`}\u001b[${39}m`} = ${JSON.stringify(
          //     whitespaceStartedAt,
          //     null,
          //     0
          //   )}`
          // );
          console.log(
            `3280 ${`\u001b[${33}m${`bodyItsTheFirstClassOrId`}\u001b[${39}m`} = ${bodyItsTheFirstClassOrId}; \u001b[${34}m${`headWholeLineCanBeDeleted = ${headWholeLineCanBeDeleted}`}\u001b[${39}m`
          );
        } else if (stateWithinStyleTag) {
          // it's still within head:

          console.log(
            `ENDING: \u001b[${36}m${`headWholeLineCanBeDeleted = ${headWholeLineCanBeDeleted}`}\u001b[${39}m
\u001b[${36}m${`headWholeLineCanBeDeleted = ${headWholeLineCanBeDeleted}`}\u001b[${39}m
\u001b[${36}m${`insideCurlyBraces = ${insideCurlyBraces}`}\u001b[${39}m
\u001b[${36}m${`curliesDepth = ${curliesDepth}`}\u001b[${39}m`
          );

          //

          // LOGGING for stage 1:
          if (round === 9) {
            console.log(
              `
${`\u001b[${90}m${`ruleChunkStartedAt`}\u001b[${39}m = ${ruleChunkStartedAt}`};
${`\u001b[${90}m${`selectorChunkStartedAt`}\u001b[${39}m = ${selectorChunkStartedAt}`};
${`\u001b[${90}m${`selectorChunkCanBeDeleted`}\u001b[${39}m = ${selectorChunkCanBeDeleted}`};
${`\u001b[${90}m${`currentChunk`}\u001b[${39}m = ${currentChunk}`};
${`\u001b[${90}m${`whitespaceStartedAt`}\u001b[${39}m = ${whitespaceStartedAt}`};
${`\u001b[${90}m${`singleSelectorStartedAt`}\u001b[${39}m = ${singleSelectorStartedAt}`};
${`\u001b[${90}m${`commentStartedAt`}\u001b[${39}m = ${commentStartedAt}`};
${`\u001b[${90}m${`checkingInsideCurlyBraces`}\u001b[${39}m = ${checkingInsideCurlyBraces}`};
${`\u001b[${90}m${`insideCurlyBraces`}\u001b[${39}m = ${insideCurlyBraces}`};`
            );
          }
        }

        console.log(
          `${`\u001b[${
            stateWithinBody ? 32 : 31
          }m${`stateWithinBody`}\u001b[${39}m`}; ${`\u001b[${
            stateWithinStyleTag ? 32 : 31
          }m${`stateWithinStyleTag`}\u001b[${39}m`}; \u001b[${33}m${`lastKeptChunksCommaAt`}\u001b[${39}m = ${lastKeptChunksCommaAt}; \u001b[${33}m${`onlyDeletedChunksFollow`}\u001b[${39}m = ${onlyDeletedChunksFollow};`
        );
      }

      // console.log(`styleStartedAt = ${styleStartedAt}`);
    }

    //
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

      allClassesAndIdsWithinBody = uniq(bodyClassesArr.concat(bodyIdsArr));

      console.log(`3348 \u001b[${35}m${`\nAFTER STEP 1:`}\u001b[${39}m`);
      console.log(
        `3350 headSelectorsArr = ${JSON.stringify(headSelectorsArr, null, 4)}`
      );
      console.log(
        `3353 bodyClassesArr = ${JSON.stringify(bodyClassesArr, null, 4)}`
      );
      console.log(`3355 bodyIdsArr = ${JSON.stringify(bodyIdsArr, null, 4)}`);
      console.log(
        `3357 allClassesAndIdsWithinBody = ${JSON.stringify(
          allClassesAndIdsWithinBody,
          null,
          4
        )}`
      );
      console.log(
        `3364 \nopts.whitelist = ${JSON.stringify(opts.whitelist, null, 4)}`
      );

      // extract all classes or id's from `headSelectorsArr` and get count of each.
      // That's so we can later exclude sandwitched classes. Each time "collateral"
      // legit, but sandwitched with false-one class gets deleted, we keep count, and
      // later compare totals with these below.
      // If it turns out that a class was in both head and body, but it was sandwitched
      // with unused classes and removed as collateral, we need to remove it from body too.

      // starting point is the selectors, removed from head during first stage.

      console.log(
        `3377 \n\n███████████████████████████████████████\n\n${`\u001b[${32}m${`starting headSelectorsCount`}\u001b[${39}m`} = ${JSON.stringify(
          headSelectorsCount,
          null,
          4
        )}`
      );

      headSelectorsArr.forEach((el) => {
        extract(el).res.forEach((selector) => {
          if (
            Object.prototype.hasOwnProperty.call(headSelectorsCount, selector)
          ) {
            headSelectorsCount[selector] += 1;
          } else {
            headSelectorsCount[selector] = 1;
          }
        });
      });
      console.log(
        `\n3290 headSelectorsCount = ${JSON.stringify(
          headSelectorsCount,
          null,
          4
        )}`
      );
      // create a working copy of `headSelectorsCount` which we'll mutate, subtracting
      // each deleted class/id:
      headSelectorsCountClone = { ...headSelectorsCount };

      // compile list of to-be-terminated
      // ================

      allClassesAndIdsWithinHead = uniq(
        headSelectorsArr.reduce(
          (arr, el) => arr.concat(extract(el).res as any),
          []
        )
      );

      countBeforeCleaning = allClassesAndIdsWithinHead.length;

      console.log(
        `${`\u001b[${33}m${`1238 AFTER TRAVERSAL,\nallClassesAndIdsWithinHead`}\u001b[${39}m`} = ${JSON.stringify(
          allClassesAndIdsWithinHead,
          null,
          4
        )}`
      );

      // to avoid false positives, let's apply two cycles when removing unused classes/id's from head:

      // ---------------------------------------
      // TWO-CYCLE UNUSED CSS IDENTIFICATION:
      // ---------------------------------------

      // cycle #1 - remove comparing separate classes/id's from body against
      // potentially sandwitched lumps from head. Let's see what's left afterwards.
      // ================

      const preppedHeadSelectorsArr = Array.from(headSelectorsArr);
      let deletedFromHeadArr = [];
      console.log(
        `\u001b[${36}m${`3330 LOOP preppedHeadSelectorsArr = ${JSON.stringify(
          preppedHeadSelectorsArr,
          null,
          4
        )}`}\u001b[${39}m`
      );
      for (let y = 0, len2 = preppedHeadSelectorsArr.length; y < len2; y++) {
        totalCounter += 1;
        console.log(`\u001b[${36}m${`------------`}\u001b[${39}m`);
        console.log(
          `3449 ${`\u001b[${36}m${`██`}\u001b[${39}m`} preppedHeadSelectorsArr[${y}] = ${JSON.stringify(
            preppedHeadSelectorsArr[y],
            null,
            4
          )}`
        );
        let temp;

        // intentional loose comparison !=, that's existy():
        if (preppedHeadSelectorsArr[y] != null) {
          temp = extract(preppedHeadSelectorsArr[y]).res;
        }
        if (
          temp &&
          !temp.every((el) => allClassesAndIdsWithinBody.includes(el))
        ) {
          console.log(
            `3466 PUSH to deletedFromHeadArr[] [${extract(
              preppedHeadSelectorsArr[y]
            )}]`
          );
          deletedFromHeadArr.push(...extract(preppedHeadSelectorsArr[y]).res);
          console.log(
            `3472 deletedFromHeadArr becomes = ${JSON.stringify(
              deletedFromHeadArr,
              null,
              4
            )}`
          );
          preppedHeadSelectorsArr.splice(y, 1);
          y -= 1;
          len2 -= 1;
        }
      }
      console.log(`\u001b[${36}m${`------------`}\u001b[${39}m`);

      deletedFromHeadArr = uniq(pull(deletedFromHeadArr, opts.whitelist));

      let preppedAllClassesAndIdsWithinHead: string[];
      if (preppedHeadSelectorsArr && preppedHeadSelectorsArr.length) {
        preppedAllClassesAndIdsWithinHead = preppedHeadSelectorsArr.reduce(
          (acc, curr) => acc.concat(extract(curr).res as any),
          []
        );
        console.log(
          `3494 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`preppedAllClassesAndIdsWithinHead`}\u001b[${39}m`} = ${JSON.stringify(
            preppedAllClassesAndIdsWithinHead,
            null,
            4
          )}`
        );
      } else {
        preppedAllClassesAndIdsWithinHead = [];
      }
      // console.log(`\n* preppedAllClassesAndIdsWithinHead = ${JSON.stringify(preppedAllClassesAndIdsWithinHead, null, 4)}`)

      // cycle #2 - now treat remaining lumps as definite sources of
      // "what classes or id's are present in the head"
      // use "preppedAllClassesAndIdsWithinHead" as a head selector reference when comparing
      // against the body classes/id's.
      // ================

      headCssToDelete = pull(
        pullAll(
          uniq(Array.from(allClassesAndIdsWithinHead)),
          bodyClassesArr.concat(bodyIdsArr)
        ),
        opts.whitelist
      );
      console.log(
        `3519 OLD ${`\u001b[${32}m${`headCssToDelete`}\u001b[${39}m`} = ${JSON.stringify(
          headCssToDelete,
          null,
          4
        )}`
      );

      bodyCssToDelete = uniq(
        pull(
          pullAll(
            bodyClassesArr.concat(bodyIdsArr),
            preppedAllClassesAndIdsWithinHead
          ),
          opts.whitelist
        )
      );
      console.log(
        `3536 ${`\u001b[${32}m${`bodyCssToDelete`}\u001b[${39}m`} = ${JSON.stringify(
          bodyCssToDelete,
          null,
          4
        )}`
      );

      // now that we know final to-be-deleted selectors list, compare them with `deletedFromHeadArr`
      // and fill any missing CSS in `headCssToDelete`:
      headCssToDelete = uniq(
        headCssToDelete.concat(
          intersection(deletedFromHeadArr, bodyCssToDelete)
        )
      );
      console.log(
        `3551 NEW ${`\u001b[${32}m${`headCssToDelete`}\u001b[${39}m`} = ${JSON.stringify(
          headCssToDelete,
          null,
          4
        )}`
      );

      bodyClassesToDelete = bodyCssToDelete
        .filter((s) => s.startsWith("."))
        .map((s) => s.slice(1));
      console.log(
        `3562 bodyClassesToDelete = ${JSON.stringify(
          bodyClassesToDelete,
          null,
          4
        )}`
      );
      bodyIdsToDelete = bodyCssToDelete
        .filter((s) => s.startsWith("#"))
        .map((s) => s.slice(1));
      console.log(
        `3572 ${`\u001b[${33}m${`bodyIdsToDelete`}\u001b[${39}m`} = ${JSON.stringify(
          bodyIdsToDelete,
          null,
          4
        )}`
      );

      console.log(
        `3580 CURENT RANGES AFTER STEP 1: ${JSON.stringify(
          finalIndexesToDelete.current(),
          null,
          4
        )}`
      );

      allClassesAndIdsThatWereCompletelyDeletedFromHead = Object.keys(
        headSelectorsCountClone
      ).filter((singleSelector) => headSelectorsCountClone[singleSelector] < 1);
      console.log(
        `3591 ${`\u001b[${33}m${`allClassesAndIdsThatWereCompletelyDeletedFromHead`}\u001b[${39}m`} = ${JSON.stringify(
          allClassesAndIdsThatWereCompletelyDeletedFromHead,
          null,
          4
        )}`
      );

      // at this point, if any classes in `headSelectorsCountClone` have zero counters
      // that means those have all been deleted from head.

      bodyClassesToDelete = uniq(
        bodyClassesToDelete.concat(
          intersection(
            pull(allClassesAndIdsWithinBody, opts.whitelist),
            allClassesAndIdsThatWereCompletelyDeletedFromHead
          )
            .filter((val) => val[0] === ".") // filter out all classes
            .map((val) => val.slice(1))
        )
      ); // remove dots from them
      console.log(
        `3612 ${`\u001b[${33}m${`bodyClassesToDelete`}\u001b[${39}m`} = ${JSON.stringify(
          bodyClassesToDelete,
          null,
          4
        )}`
      );

      const allClassesAndIdsWithinBodyThatWereWhitelisted = matcher(
        allClassesAndIdsWithinBody,
        opts.whitelist
      );
      console.log(
        `3624 ${`\u001b[${31}m${`██ ██ ██`}\u001b[${39}m`} ${`\u001b[${33}m${`allClassesAndIdsWithinBodyThatWereWhitelisted`}\u001b[${39}m`} = ${JSON.stringify(
          allClassesAndIdsWithinBodyThatWereWhitelisted,
          null,
          4
        )}`
      );

      // update `bodyCssToDelete` with sandwitched classes, because will be
      // used in reporting
      bodyCssToDelete = uniq(
        bodyCssToDelete.concat(
          bodyClassesToDelete.map((val) => `.${val}`),
          bodyIdsToDelete.map((val) => `#${val}`)
        )
      );
      console.log(
        `3640 ${`\u001b[${90}m${`bodyCssToDelete`}\u001b[${39}m`} = ${JSON.stringify(
          bodyCssToDelete,
          null,
          4
        )}`
      );

      allClassesAndIdsWithinHeadFinal = pullAll(
        pullAll(Array.from(allClassesAndIdsWithinHead), bodyCssToDelete),
        headCssToDelete
      );
      if (
        Array.isArray(allClassesAndIdsWithinBodyThatWereWhitelisted) &&
        allClassesAndIdsWithinBodyThatWereWhitelisted.length
      ) {
        allClassesAndIdsWithinBodyThatWereWhitelisted.forEach((classOrId) => {
          if (!allClassesAndIdsWithinHeadFinal.includes(classOrId)) {
            allClassesAndIdsWithinHeadFinal.push(classOrId);
          }
        });
      }

      if (opts.uglify) {
        allClassesAndIdsWithinHeadFinalUglified = uglifyArr(
          allClassesAndIdsWithinHeadFinal
        );
      }

      countAfterCleaning = allClassesAndIdsWithinHeadFinal.length;

      uglified = opts.uglify
        ? allClassesAndIdsWithinHeadFinal
            .map((name, id) => [
              name,
              allClassesAndIdsWithinHeadFinalUglified[id],
            ])
            .filter(
              (arr) =>
                !opts.whitelist.some((whitelistVal) =>
                  matcher.isMatch(arr[0], whitelistVal)
                )
            )
        : null;

      console.log(
        `3685 AFTER STEP 1, ${`\u001b[${33}m${`finalIndexesToDelete.current()`}\u001b[${39}m`} =
          ███████████████████████████████████████
          ███████████████████████████████████████
          ███████████████████V███████████████████
          ${JSON.stringify(finalIndexesToDelete.current(), null, 4)}
          ███████████████████^███████████████████
          ███████████████████████████████████████
          ███████████████████████████████████████
          `
      );
      console.log(
        `3696 ${`\u001b[${33}m${`uglified`}\u001b[${39}m`} = ${JSON.stringify(
          uglified,
          null,
          4
        )}`
      );

      if (finalIndexesToDelete.current()) {
        round1RangesClone = Array.from(finalIndexesToDelete.current() || []);
      } else {
        round1RangesClone = null;
      }

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
      //
    } else if (round === 2) {
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

      console.log(
        `3737: allClassesAndIdsWithinHeadFinal = ${JSON.stringify(
          allClassesAndIdsWithinHeadFinal,
          null,
          4
        )}`
      );
      console.log(
        opts.uglify
          ? `\n\n\n\n\n\n   ====== ${`\u001b[${36}m${`UGLIFICATION`}\u001b[${39}m`} ======
${
  (allClassesAndIdsWithinHeadFinal.reduce((accum, val) => {
    return `${accum}   ${`\u001b[${33}m${
      allClassesAndIdsWithinHeadFinalUglified[
        allClassesAndIdsWithinHeadFinal.indexOf(val)
      ]
    }\u001b[${39}m`} --- ${`\u001b[${31}m${val}\u001b[${39}m`}`;
  }),
  "\n")
}   ==========================\n`
          : ""
      );

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
  }
  //                              ^
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
  //

  console.log(`.\n\n\n\n\n\n\n
                                                              33333333333333
                                                            3:::::::::::::::33
                                                            3::::::33333::::::3
                                                            3333333     3:::::3
                                                                        3:::::3
                                                                        3:::::3
                                                                33333333:::::3
                                                                3:::::::::::3
                                                                33333333:::::3
                                                                        3:::::3
                                                                        3:::::3
                                                                        3:::::3
                                                            3333333     3:::::3
                                                            3::::::33333::::::3
                                                            3:::::::::::::::33
                                                             333333333333333
\n\n\n\n\n\n\n`);

  //
  //
  //
  //
  //
  //

  // actual deletion/insertion:
  // ==========================

  finalIndexesToDelete.push(lineBreaksToDelete.current());

  console.log(
    `3823 BEFORE 3RD STEP PREP ${`\u001b[${33}m${`str`}\u001b[${39}m`} = "${str}"`
  );

  console.log(
    `3827 AFTER 3ND ROUND, finalIndexesToDelete.current() = ${JSON.stringify(
      finalIndexesToDelete.current(),
      null,
      4
    )}`
  );
  if (str.length && finalIndexesToDelete.current()) {
    str = rApply(str, finalIndexesToDelete.current());
    finalIndexesToDelete.wipe();
  }

  const startingPercentageDone =
    opts.reportProgressFuncTo -
    (opts.reportProgressFuncTo - opts.reportProgressFuncFrom) *
      leavePercForLastStage;
  console.log(
    `3843 ${`\u001b[${33}m${`startingPercentageDone`}\u001b[${39}m`} = ${JSON.stringify(
      startingPercentageDone,
      null,
      4
    )}`
  );

  if (opts.reportProgressFunc && len >= 2000) {
    // opts.reportProgressFunc(95);
    currentPercentageDone = Math.floor(
      startingPercentageDone +
        (opts.reportProgressFuncTo - startingPercentageDone) / 5 // * 1
    );
    if (currentPercentageDone !== lastPercentage) {
      lastPercentage = currentPercentageDone;
      opts.reportProgressFunc(currentPercentageDone);
    }
  }
  console.log("\n\n");
  console.log(`3862 string after ROUND 3:\n${str}\n\n`);

  // final fixing:
  // =============

  // remove empty media queries:
  while (
    regexEmptyMediaQuery.test(str) ||
    regexEmptyUnclosedMediaQuery.test(str)
  ) {
    str = str.replace(regexEmptyMediaQuery, "");
    str = str.replace(regexEmptyUnclosedMediaQuery, "");
    totalCounter += str.length;
  }
  if (opts.reportProgressFunc && len >= 2000) {
    // opts.reportProgressFunc(96);
    currentPercentageDone = Math.floor(
      startingPercentageDone +
        ((opts.reportProgressFuncTo - startingPercentageDone) / 5) * 2
    );
    if (currentPercentageDone !== lastPercentage) {
      lastPercentage = currentPercentageDone;
      opts.reportProgressFunc(currentPercentageDone);
    }
  }

  // remove empty style tags:
  str = str.replace(regexEmptyStyleTag, "\n");
  totalCounter += str.length;
  if (opts.reportProgressFunc && len >= 2000) {
    // opts.reportProgressFunc(97);
    currentPercentageDone = Math.floor(
      startingPercentageDone +
        ((opts.reportProgressFuncTo - startingPercentageDone) / 5) * 3
    );
    if (currentPercentageDone !== lastPercentage) {
      lastPercentage = currentPercentageDone;
      opts.reportProgressFunc(currentPercentageDone);
    }
  }

  // remove empty Outlook conditional comments:
  let tempLen = str.length;
  str = str.replace(emptyCondCommentRegex(), "");
  totalCounter += str.length;
  if (tempLen !== str.length) {
    commentsLength += str.length - tempLen;
  }
  if (opts.reportProgressFunc && len >= 2000) {
    // opts.reportProgressFunc(98);
    currentPercentageDone = Math.floor(
      startingPercentageDone +
        ((opts.reportProgressFuncTo - startingPercentageDone) / 5) * 4
    );
    if (currentPercentageDone !== lastPercentage) {
      lastPercentage = currentPercentageDone;
      opts.reportProgressFunc(currentPercentageDone);
    }
  }

  // minify, limit the line length
  str = crush(str, {
    removeLineBreaks: false,
    removeIndentations: false,
    removeHTMLComments: false,
    removeCSSComments: false,
    lineLengthLimit: 500,
  }).result;

  tempLen = str.length;
  if (tempLen !== str.length) {
    nonIndentationsWhitespaceLength += str.length - tempLen;
  }
  totalCounter += str.length;
  if (opts.reportProgressFunc && len >= 2000) {
    // opts.reportProgressFunc(99);
    currentPercentageDone = Math.floor(
      startingPercentageDone +
        (opts.reportProgressFuncTo - startingPercentageDone)
    );
    if (currentPercentageDone !== lastPercentage) {
      lastPercentage = currentPercentageDone;
      opts.reportProgressFunc(currentPercentageDone);
    }
  }

  if (str.length) {
    if (
      (!str[0].trim() || !str[str.length - 1].trim()) &&
      str.length !== str.trim().length
    ) {
      nonIndentationsWhitespaceLength += str.length - str.trim().length;
    }
    str = str.trimStart();
  }

  console.log(
    `3959 ${`\u001b[${33}m${`allClassesAndIdsWithinHeadFinal`}\u001b[${39}m`} = ${JSON.stringify(
      allClassesAndIdsWithinHeadFinal,
      null,
      4
    )}`
  );

  // remove first character, space, inside classes/id's - it might
  // be a leftover after class/id removal
  str = str.replace(/ ((class|id)=["']) /g, " $1");

  return {
    log: {
      timeTakenInMilliseconds: Date.now() - start,
      traversedTotalCharacters: totalCounter,
      traversedTimesInputLength: len
        ? Math.round((totalCounter / len) * 100) / 100
        : 0,
      originalLength: len,
      cleanedLength: str.length,
      bytesSaved: Math.max(len - str.length, 0),
      percentageReducedOfOriginal: len
        ? Math.round((Math.max(len - str.length, 0) * 100) / len)
        : 0,
      nonIndentationsWhitespaceLength: Math.max(
        nonIndentationsWhitespaceLength - trailingLinebreakLengthCorrection,
        0
      ),
      nonIndentationsTakeUpPercentageOfOriginal:
        len &&
        Math.max(
          nonIndentationsWhitespaceLength - trailingLinebreakLengthCorrection,
          0
        )
          ? Math.round(
              (Math.max(nonIndentationsWhitespaceLength, 0) * 100) / len
            )
          : 0,
      commentsLength,
      commentsTakeUpPercentageOfOriginal:
        len && commentsLength ? Math.round((commentsLength * 100) / len) : 0,
      uglified,
    },
    result: str,
    countAfterCleaning,
    countBeforeCleaning,
    allInHead: allClassesAndIdsWithinHead.sort(),
    allInBody: allClassesAndIdsWithinBody.sort(),
    deletedFromHead: headCssToDelete.sort(),
    deletedFromBody: bodyCssToDelete.sort(),
  };
}

export { comb, defaults, version };
