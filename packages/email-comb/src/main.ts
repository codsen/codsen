import { matchRightIncl, matchRight, matchLeft } from "string-match-left-right";
import { emptyCondCommentRegex } from "regex-empty-conditional-comments";
import { extract } from "string-extract-class-names";
import { pull } from "array-pull-all-with-glob";
import { left, right } from "string-left-right";
import { expander } from "string-range-expander";

import type { Range } from "../../../ops/typedefs/common";
import { uglifyArr } from "string-uglify";
import { rApply } from "ranges-apply";
import { crush } from "html-crush";
import type { Opts as HtmlCrushOpts } from "html-crush";
import { Ranges } from "ranges-push";
import { matcher, isMatch } from "matcher";
import {
  hasOwnProp,
  compareFn,
  isPlainObject as isObj,
  isLatinLetter,
  uniq,
  intersection,
  pullAll,
  detectEol,
  EolChar,
} from "codsen-utils";

import { version as v } from "../package.json";
import {
  regexEmptyStyleTag,
  regexEmptyMediaQuery,
  regexEmptyUnclosedMediaQuery,
} from "./util";

const version: string = v;

declare let DEV: boolean;

interface NumValObj {
  [key: string]: number;
}

export interface HeadsAndTailsObj {
  heads: string;
  tails: string;
}

export interface Opts {
  whitelist: string[];
  backend: HeadsAndTailsObj[];
  uglify: boolean;
  removeHTMLComments: boolean;
  removeCSSComments: boolean;
  doNotRemoveHTMLCommentsWhoseOpeningTagContains: string[];
  htmlCrushOpts: Partial<HtmlCrushOpts>;
  reportProgressFunc: null | ((percDone: number) => void);
  reportProgressFuncFrom: number;
  reportProgressFuncTo: number;
}

type StringifiedLegend = [string, string];

export interface Res {
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
    uglified: null | StringifiedLegend[];
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
  htmlCrushOpts: {
    removeLineBreaks: false,
    removeIndentations: false,
    removeHTMLComments: false,
    removeCSSComments: false,
    lineLengthLimit: 500,
  },
  reportProgressFunc: null,
  reportProgressFuncFrom: 0,
  reportProgressFuncTo: 100,
};

/**
 * Remove unused CSS from email templates
 */
function comb(str: string, opts?: Partial<Opts>): Res {
  let start = Date.now();
  let finalIndexesToDelete = new Ranges({ limitToBeAddedWhitespace: true });
  let currentChunksMinifiedSelectors = new Ranges();
  let lineBreaksToDelete = new Ranges();

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
  let headSelectorsArr = [];
  let bodyClassesArr = [];
  let bodyIdsArr = [];
  // const selectorsRemovedDuringRoundOne = [];

  let commentStartedAt: number | null;
  let commentNearlyStartedAt;
  let bodyStartedAt;
  let bodyClass: BodyClassOrId;
  let bodyId: BodyClassOrId;

  let headSelectorsCount: NumValObj = {};

  // for each single character traversed on any FOR loop, we increment this counter:
  let totalCounter = 0;
  let selectorSinceLinebreakDetected;
  let checkingInsideCurlyBraces;
  let insideCurlyBraces;
  let uglified: null | StringifiedLegend[] = null;
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
  let singleSelectorType: "." | "#" | undefined;

  // ---------------------------------------------------------------------------

  // marker to identify when we can delete the whole CSS declaration (or "line" if you keep one style-per-line)

  //       <style type="text/css">
  //         .unused1[z].unused2, .unused3[z] {a:1;}
  //         |                                     |
  //    ---> | means we can delete all this        | <---
  let headWholeLineCanBeDeleted: boolean;

  // if used chunk is followed by bunch of unused chunks, that comma that follows
  // used chunk needs to be deleted. Last chunk's comma is registered at index:
  // lastKeptChunksCommaAt and flag which instructs to delete it is the
  // "onlyDeletedChunksFollow":
  let lastKeptChunksCommaAt: number | null = null;
  let onlyDeletedChunksFollow = false;

  // marker to identify when we can delete the whole id or class, not just some of classes/id's inside
  let bodyClassOrIdCanBeDeleted: boolean;

  // copy of the first round's ranges, used to skip the same ranges
  // in round 2:
  let round1RangesClone: null | Range[] = null;

  // counters:
  let nonIndentationsWhitespaceLength = 0;
  let commentsLength = 0;

  // same as used in string-extract-class-names
  let badChars = `.# ~\\!@$%^&*()+=,/';:"?><[]{}|\`\t\n`;

  // Rules which might wrap the media queries, for example:
  // @supports (display: grid) {...
  // We need to process their contents only (and disregard their curlies).
  let atRulesWhichMightWrapStyles = ["media", "supports", "document"];

  // One-liners like:
  // "@charset "utf-8";"
  // and one-liners with URL's:
  // @import url("https://codsen.com/style.css");
  let atRulesWhichNeedToBeIgnored = [
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

  let atRuleBreakCharacters = ["{", "(", "<", '"', "'", "@", ";"];

  // insurance
  if (typeof str !== "string") {
    throw new TypeError(
      `email-comb: [THROW_ID_01] Input must be string! Currently it's ${typeof str}`,
    );
  }
  let originalLength = str.length;

  if (opts && !isObj(opts)) {
    throw new TypeError(
      `email-comb: [THROW_ID_02] Options, second input argument, must be a plain object! Currently it's ${typeof opts}, equal to: ${JSON.stringify(
        opts,
        null,
        4,
      )}`,
    );
  }
  let resolvedOpts: Opts = { ...defaults, ...opts };
  // arrayiffy if string:
  if (
    typeof resolvedOpts.doNotRemoveHTMLCommentsWhoseOpeningTagContains ===
    "string"
  ) {
    resolvedOpts.doNotRemoveHTMLCommentsWhoseOpeningTagContains = [
      resolvedOpts.doNotRemoveHTMLCommentsWhoseOpeningTagContains,
    ].filter((val: string) => val.trim());
  }

  if (typeof resolvedOpts.whitelist === "string") {
    resolvedOpts.whitelist = [resolvedOpts.whitelist];
  } else if (!Array.isArray(resolvedOpts.whitelist)) {
    throw new TypeError(
      `email-comb: [THROW_ID_03] resolvedOpts.whitelist should be an array, but it was customised to a wrong thing, ${JSON.stringify(
        resolvedOpts.whitelist,
        null,
        4,
      )}`,
    );
  }
  if (
    resolvedOpts.whitelist.length &&
    !resolvedOpts.whitelist.every((el) => typeof el === "string")
  ) {
    throw new TypeError(
      `email-comb: [THROW_ID_04] resolvedOpts.whitelist array should contain only string-type elements. Currently we\ve got:\n${JSON.stringify(
        resolvedOpts.whitelist,
        null,
        4,
      )}`,
    );
  }
  if (!Array.isArray(resolvedOpts.backend)) {
    throw new TypeError(
      `email-comb: [THROW_ID_05] resolvedOpts.backend should be an array, but it was customised to a wrong thing, ${JSON.stringify(
        resolvedOpts.backend,
        null,
        4,
      )}`,
    );
  }
  if (
    resolvedOpts.backend.length &&
    resolvedOpts.backend.some((val) => !isObj(val))
  ) {
    throw new TypeError(
      `email-comb: [THROW_ID_06] resolvedOpts.backend array should contain only plain objects but it contains something else:\n${JSON.stringify(
        resolvedOpts.backend,
        null,
        4,
      )}`,
    );
  }
  if (
    resolvedOpts.backend.length &&
    !resolvedOpts.backend.every(
      (obj) => hasOwnProp(obj, "heads") && hasOwnProp(obj, "tails"),
    )
  ) {
    throw new TypeError(
      `email-comb: [THROW_ID_07] every object within resolvedOpts.backend should contain keys "heads" and "tails" but currently it's not the case. Whole "resolvedOpts.backend" value array is currently equal to:\n${JSON.stringify(
        resolvedOpts.backend,
        null,
        4,
      )}`,
    );
  }
  if (typeof resolvedOpts.uglify !== "boolean") {
    if (resolvedOpts.uglify === 1 || resolvedOpts.uglify === 0) {
      resolvedOpts.uglify = !!resolvedOpts.uglify; // turn it into a Boolean
    } else {
      throw new TypeError(
        `email-comb: [THROW_ID_08] resolvedOpts.uglify should be a Boolean. Currently it's set to: ${JSON.stringify(
          resolvedOpts.uglify,
          null,
          4,
        )}}`,
      );
    }
  }
  if (
    resolvedOpts.reportProgressFunc &&
    typeof resolvedOpts.reportProgressFunc !== "function"
  ) {
    throw new TypeError(
      `email-comb: [THROW_ID_09] resolvedOpts.reportProgressFunc should be a function but it was given as :\n${JSON.stringify(
        resolvedOpts.reportProgressFunc,
        null,
        4,
      )} (${typeof resolvedOpts.reportProgressFunc})`,
    );
  }

  let allHeads = null;
  let allTails = null;

  if (Array.isArray(resolvedOpts.backend) && resolvedOpts.backend.length) {
    allHeads = resolvedOpts.backend.map(
      (headsAndTailsObj) => headsAndTailsObj.heads,
    );
    allTails = resolvedOpts.backend.map(
      (headsAndTailsObj) => headsAndTailsObj.tails,
    );
  }

  // resolvedOpts.whitelist accepts classes or id's:
  // [".dont__delete-me", "#keep-me-too"]
  // but also since v6.1 it also accepts raw strings
  // which are matched on the whole chunk, for example
  //
  // [data-ogsc] .sm-text-red-500{display: none;}
  // |------------+-------------|
  //              |
  //            chunk
  //
  let strArrToMatchAgainstChunks: string[] = resolvedOpts.whitelist.filter(
    (c) => !c.startsWith("#") && !c.startsWith("."),
  );

  let trailingNewline: EolChar | "" = "";
  if (str.length && ["\n", "\r"].includes(str[~-str.length])) {
    trailingNewline = detectEol(str) || "";
  }

  str = str.trim().replace(/\r?\n\s+\r?\n/g, "");
  // restore trailing newline
  if (trailingNewline) {
    str += trailingNewline;
  }

  let len = str.length;

  let leavePercForLastStage = 0.06; // in range of [0, 1]

  let ceil = 1;

  if (resolvedOpts.reportProgressFunc) {
    // ceil is middle of the range [0, 100], or whatever it was customised to,
    // [resolvedOpts.reportProgressFuncFrom, resolvedOpts.reportProgressFuncTo].
    // Also, leavePercForLastStage needs to be left to next stage, so "100" or
    // "resolvedOpts.reportProgressFuncTo" is multiplied by (1 - leavePercForLastStage).
    ceil = Math.floor(
      (resolvedOpts.reportProgressFuncTo -
        (resolvedOpts.reportProgressFuncTo -
          resolvedOpts.reportProgressFuncFrom) *
          leavePercForLastStage -
        resolvedOpts.reportProgressFuncFrom) /
        2,
    );
    DEV &&
      console.log(
        `462 ${`\u001b[${33}m${`ceil`}\u001b[${39}m`} = ${JSON.stringify(
          ceil,
          null,
          4,
        )}`,
      );
  }

  let trailingLinebreakLengthCorrection = 0;
  if (!str.length || !"\r\n".includes(str[str.length - 1])) {
    // if there's no trailing line break in the input, mark this because
    // output will have it and we need to consider this for mathematically
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
  let stateWithinBodyInlineStyle: number | null;
  let bodyIdsToDelete: string[] = [];
  let bodyCssToDelete: string[] = [];
  let headCssToDelete: string[] = [];
  let currentChunk;
  let canDelete;
  let usedOnce;

  // ---------------------------------------------------------------------------

  // this is the main FOR loop which will traverse the input string twice:
  for (let round = 1; round <= 2; round++) {
    // all cleaning will be achieved within two traversals. The traversal is
    // identified by a number assigned to a variable "round". Either "round" is
    // 1 or 2.

    // During the FIRST traversal we count all the classes and id's in style tags
    // (which can be located also within body) and all inline styles within body.
    // During the SECOND traversal we use that info to mark class and id names
    // for deletion (if they're unused) or for replacement (uglified).

    // We group both traversals because otherwise, code would be repeated twice -
    // all bits that track where class attribute started and ended, where media
    // queries started and ended - everything would be repeated twice.

    // Instead, we use conditional clauses to track, which round it is and
    // perform the unique actions, not applicable to other round, within those
    // clauses.

    if (round === 1) {
      DEV &&
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
      DEV &&
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
    stateWithinBodyInlineStyle = null;
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

    stepOuter: for (let i = 0; i < len; i++) {
      // logging:
      if (round !== 9) {
        DEV &&
          console.log(
            `${`\u001b[${39}m${`---${`\u001b[${32}m round ${round} \u001b[${39}m`}-----------------------`}\u001b[${36}m`} str[${`\u001b[${35}m${i}\u001b[${39}m`}] = ${
              str[i] && str[i].trim() !== ""
                ? str[i]
                : JSON.stringify(str[i], null, 0)
            }`,
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
      // resolvedOpts.reportProgressFuncFrom and resolvedOpts.reportProgressFuncTo are 0-to-100.
      // If either is skewed then the value will be in that range accordingly.
      if (resolvedOpts.reportProgressFunc) {
        if (len > 1000 && len < 2000) {
          // if input is too short, just call once, for the middle value
          if (round === 1 && i === 0) {
            resolvedOpts.reportProgressFunc(
              Math.floor(
                (resolvedOpts.reportProgressFuncTo -
                  resolvedOpts.reportProgressFuncFrom) /
                  2,
              ), // if range is [0, 100], this would be 50
            );
          }
        } else if (len >= 2000) {
          // defaults:
          // resolvedOpts.reportProgressFuncFrom = 0
          // resolvedOpts.reportProgressFuncTo = 100

          currentPercentageDone =
            resolvedOpts.reportProgressFuncFrom +
            Math.floor((i / len) * ceil) +
            (round === 1 ? 0 : ceil);

          if (currentPercentageDone !== lastPercentage) {
            lastPercentage = currentPercentageDone;
            resolvedOpts.reportProgressFunc(currentPercentageDone);
          }
        }
      }

      let chr = str[i];

      if (
        !stateWithinStyleTag &&
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
        DEV && console.log(`703 activate "stateWithinStyleTag" state`);
        DEV &&
          console.log(
            `706 ${`\u001b[${33}m${`styleStartedAt`}\u001b[${39}m`} = ${JSON.stringify(
              styleStartedAt,
              null,
              4,
            )}`,
          );
        DEV &&
          console.log(
            `714 ${`\u001b[${33}m${`styleEndedAt`}\u001b[${39}m`} = ${JSON.stringify(
              styleEndedAt,
              null,
              4,
            )}`,
          );

        // ---------------------------------------------------------------------

        stateWithinStyleTag = true;
        stateWithinBody = false;
        stateWithinBodyInlineStyle = null;
      } else if (
        !stateWithinBody &&
        bodyStartedAt !== null &&
        (styleStartedAt === null || styleStartedAt < i) &&
        (styleEndedAt === null || styleEndedAt < i)
      ) {
        DEV &&
          console.log(
            `734 activate "stateWithinBody" state (stateWithinBody was previously ${stateWithinBody})`,
          );
        stateWithinBody = true;
        stateWithinStyleTag = false;
      }

      // catch inline style's end, for example
      // <a style="zzz"
      //              ^
      //            this

      DEV &&
        console.log(
          `747 ${`\u001b[${33}m${`commentStartedAt`}\u001b[${39}m`} = ${JSON.stringify(
            commentStartedAt,
            null,
            4,
          )}`,
        );
      if (
        stateWithinBody &&
        // it might be some piece of the comment, for example imagine
        // <a style="color: red;/*">z<id style="*/padding-top: 10px;">
        //                        ^            ^                    ^
        //                     false      also false              real
        commentStartedAt === null &&
        // opening has been caught:
        stateWithinBodyInlineStyle !== null &&
        // we're past the opening:
        i > stateWithinBodyInlineStyle &&
        // that's the same quotes as opening-ones:
        str[i] === str[stateWithinBodyInlineStyle]
      ) {
        DEV &&
          console.log(
            `769 ███████████████████████████████████████ INLINE STYLE END CAUGHT`,
          );
        stateWithinBodyInlineStyle = null;
        DEV &&
          console.log(
            `774 SET ${`\u001b[${33}m${`stateWithinBodyInlineStyle`}\u001b[${39}m`} = ${stateWithinBodyInlineStyle}`,
          );
      }

      // catch inline style's start, for example
      // <a style="zzz"
      //          ^
      //        this
      if (
        stateWithinBody &&
        commentStartedAt === null &&
        stateWithinBodyInlineStyle === null &&
        str.startsWith("style=", i) &&
        (str[i + 6] === `'` || str[i + 6] === `"`)
      ) {
        DEV &&
          console.log(
            `791 ███████████████████████████████████████ INLINE STYLE START CAUGHT`,
          );
        stateWithinBodyInlineStyle = i + 6;
        DEV &&
          console.log(
            `796 SET ${`\u001b[${33}m${`stateWithinBodyInlineStyle`}\u001b[${39}m`} = ${stateWithinBodyInlineStyle} (at character "${
              str[stateWithinBodyInlineStyle]
            }")`,
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
          let leftSideIdx = left(str, i);
          if (
            typeof leftSideIdx === "number" &&
            ((stateWithinStyleTag && ["(", ","].includes(str[leftSideIdx])) ||
              (stateWithinBody &&
                !stateWithinStyleTag &&
                ["(", ",", ":", "="].includes(str[leftSideIdx])))
          ) {
            currentlyWithinQuotes = str[i];
            DEV &&
              console.log(
                `842 SET ${`\u001b[${33}m${`currentlyWithinQuotes`}\u001b[${39}m`} = ${currentlyWithinQuotes}`,
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
          DEV &&
            console.log(`855 BUMP i=${right(str, right(str, i))}, step outer`);
          continue;
        } else if (currentlyWithinQuotes === str[i]) {
          currentlyWithinQuotes = null;
          DEV &&
            console.log(
              `861 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`currentlyWithinQuotes`}\u001b[${39}m`} = null`,
            );
        }

        if (stateWithinBody) {
          // body: quotes in attributes
          if (
            typeof styleAttributeStartedAt === "number" &&
            styleAttributeStartedAt < i
          ) {
            styleAttributeStartedAt = null;
            DEV &&
              console.log(
                `874 ${`\u001b[${31}m${`██`}\u001b[${39}m`} SET ${`\u001b[${33}m${`styleAttributeStartedAt`}\u001b[${39}m`} = null`,
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
          DEV &&
            console.log(
              `\u001b[${31}m${`0750 something went wrong, doNothing is truthy but doNothingUntil is not set! Turning off doNothing back to false.`}\u001b[${39}m`,
            );
          doNothing = false;
          // just turn it off and move on.
        } else if (doNothingUntil && matchRightIncl(str, i, doNothingUntil)) {
          DEV && console.log(`896 doNothingUntil="${doNothingUntil}" MATCHED`);
          // Normally doNothingUntil is a single character.
          // However, when matching back-end characters, it can be multiple chars.
          // That's why above we can't compare with '===' and need the
          // "string-match-left-right" library.

          // 1. COMMENTS-RELATED SKIPS ARE TENDED SEPARATELY:
          if (commentStartedAt !== null) {
            // submit the comment characters range for deletion:

            // logging:
            DEV &&
              console.log(
                `909 CSS comment-block ends, let's tackle the doNothing`,
              );

            if (round === 1 && resolvedOpts.removeCSSComments) {
              let lineBreakPresentOnTheLeft = matchLeft(str, commentStartedAt, [
                "\r\n",
                "\n",
                "\r",
              ]);
              DEV &&
                console.log(
                  `${`\u001b[${33}m${`lineBreakPresentOnTheLeft`}\u001b[${39}m`} = ${JSON.stringify(
                    lineBreakPresentOnTheLeft,
                    null,
                    4,
                  )}`,
                );
              let startingIndex = commentStartedAt;
              if (
                typeof lineBreakPresentOnTheLeft === "string" &&
                lineBreakPresentOnTheLeft.length
              ) {
                startingIndex -= lineBreakPresentOnTheLeft.length;
                DEV &&
                  console.log(
                    `934 NEW \u001b[${33}m${`startingIndex`}\u001b[${39}m = ${startingIndex}`,
                  );
              }
              if (
                str[startingIndex - 1] &&
                characterSuitableForNames(str[startingIndex - 1]) &&
                str[i + doNothingUntil.length] &&
                characterSuitableForNames(str[i + doNothingUntil.length])
              ) {
                DEV &&
                  console.log(
                    `945 PUSH [${startingIndex}, ${
                      i + doNothingUntil.length
                    }, ";"]`,
                  );
                finalIndexesToDelete.push(
                  startingIndex,
                  i + doNothingUntil.length,
                  ";",
                );
                commentsLength += i + doNothingUntil.length - startingIndex;
              } else {
                DEV &&
                  console.log(
                    `958 PUSH [${startingIndex}, ${i + doNothingUntil.length}]`,
                  );
                finalIndexesToDelete.push(
                  startingIndex,
                  i + doNothingUntil.length,
                );
                commentsLength += i + doNothingUntil.length - startingIndex;
              }
            }
            commentStartedAt = null;
            DEV &&
              console.log(
                `970 SET ${`\u001b[${33}m${`commentStartedAt`}\u001b[${39}m`} = ${commentStartedAt}`,
              );
          }

          // 2. ALL OTHER CASES OF "DO-NOTHING":

          // offset the index:
          i = i + doNothingUntil.length - 1;
          DEV && console.log(`978 AFTER OFFSET, THE NEW i IS NOW: ${i}`);

          // Switch off the mode
          doNothingUntil = null;
          DEV &&
            console.log(
              `984 SET ${`\u001b[${33}m${`doNothingUntil`}\u001b[${39}m`} = ${doNothingUntil}`,
            );
          doNothing = false;
          DEV &&
            console.log(
              `989 SET ${`\u001b[${33}m${`doNothing`}\u001b[${39}m`} = ${doNothing}, then step out`,
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
        DEV &&
          console.log(
            `1009 SET ${`\u001b[${33}m${`checkingInsideCurlyBraces`}\u001b[${39}m`} = ${checkingInsideCurlyBraces}`,
          );

        DEV &&
          console.log(
            `1014 \u001b[${36}m${`\n * style tag begins`}\u001b[${39}m`,
          );
        if (!stateWithinStyleTag) {
          stateWithinStyleTag = true;
          DEV &&
            console.log(
              `1020 SET stateWithinStyleTag = ${stateWithinStyleTag}`,
            );
        }

        DEV &&
          console.log(
            `1026 \u001b[${36}m${`\n marching forward until ">":`}\u001b[${39}m`,
          );
        for (let y = i; y < len; y++) {
          totalCounter += 1;
          DEV &&
            console.log(
              `1032 \u001b[${36}m${`str[i=${y}]=${str[y]}`}\u001b[${39}m`,
            );
          if (str[y] === ">") {
            DEV &&
              console.log(
                `1037 \u001b[${36}m${` > found, stopping`}\u001b[${39}m`,
              );
            styleStartedAt = y + 1;
            ruleChunkStartedAt = y + 1;
            DEV &&
              console.log(
                `1043 SET ${`\u001b[${33}m${`styleStartedAt`}\u001b[${39}m`} = ${styleStartedAt}; SET ${`\u001b[${33}m${`ruleChunkStartedAt`}\u001b[${39}m`} = ${ruleChunkStartedAt} THEN BREAK`,
              );
            // We can offset the main index ("jump" to an already-traversed closing
            // closing bracket character of <style.....> tag because this tag
            // will not have any CLASS or ID attributes).
            // We would not do that with BODY tag for example.

            // Offset the index because we traversed it already:
            // i = y;
            DEV &&
              console.log(
                `1054 \u001b[${36}m${`stopped marching forward`}\u001b[${39}m`,
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
        DEV &&
          console.log(
            `1082 SET ${`\u001b[${33}m${`checkingInsideCurlyBraces`}\u001b[${39}m`} = ${checkingInsideCurlyBraces}`,
          );
        DEV &&
          console.log(
            `1086 SET ${`\u001b[${33}m${`styleEndedAt`}\u001b[${39}m`} = ${styleEndedAt}`,
          );

        // we don't need the chunk end tracking marker any more
        ruleChunkStartedAt = null;
        checkingInsideCurlyBraces = false;

        if (stateWithinStyleTag) {
          stateWithinStyleTag = false;
          DEV &&
            console.log(
              `1097 SET stateWithinStyleTag = ${stateWithinStyleTag}`,
            );
        }
      }

      // mark where CSS comments start - ROUND 1-only rule
      // ================
      DEV &&
        console.log(
          `1106 ${`\u001b[${33}m${`stateWithinBodyInlineStyle`}\u001b[${39}m`} = ${JSON.stringify(
            stateWithinBodyInlineStyle,
            null,
            4,
          )}`,
        );
      if (
        round === 1 &&
        (stateWithinStyleTag ||
          (stateWithinBodyInlineStyle !== null &&
            stateWithinBodyInlineStyle < i)) &&
        str[i] === "/" &&
        str[i + 1] === "*" &&
        commentStartedAt === null
      ) {
        // 1. mark the beginning
        commentStartedAt = i;
        DEV &&
          console.log(
            `1125 SET ${`\u001b[${33}m${`commentStartedAt`}\u001b[${39}m`} = ${i}`,
          );

        // 2. activate doNothing:
        doNothing = true;
        DEV &&
          console.log(
            `1132 SET ${`\u001b[${33}m${`doNothing`}\u001b[${39}m`} = true`,
          );
        doNothingUntil = "*/";

        // just over the "*":
        i += 1;
        continue;
      }

      // pinpoint "@"
      if (!doNothing && stateWithinStyleTag && str[i] === "@") {
        DEV && console.log(`1143 (i=${i})`);
        // since we are going to march forward, rest the whitespaceStartedAt
        // marker since it might not get reset otherwise
        if (whitespaceStartedAt) {
          whitespaceStartedAt = null;
        }

        let matchedAtTagsName =
          matchRight(str, i, atRulesWhichMightWrapStyles) ||
          matchRight(str, i, atRulesWhichNeedToBeIgnored);
        if (typeof matchedAtTagsName === "string") {
          DEV && console.log(`1154 @${matchedAtTagsName} detected`);
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
            DEV && console.log(`1171 BLANK AT-RULE DETECTED`);
            finalIndexesToDelete.push(
              i,
              temp || i + matchedAtTagsName.length + 2,
            );
          }

          // these can wrap styles and each other and their pesky curlies can throw
          // our algorithm off-track. We need to jump past the chunk from "@..."
          // to, and including, first curly bracket. But mind the dirty code cases.

          let secondaryStopper;
          DEV && console.log("\n");
          DEV &&
            console.log(
              `1186 \u001b[${36}m${`march forward`}\u001b[${39}m:\n-----`,
            );

          for (let z = i + 1; z < len; z++) {
            totalCounter += 1;
            DEV &&
              console.log(
                `1193 \u001b[${36}m${`str[${z}] = ${str[z]}`}\u001b[${39}m; ${`\u001b[${33}m${`secondaryStopper`}\u001b[${39}m`} = ${secondaryStopper}`,
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
              DEV &&
                console.log(
                  `1211 ${`\u001b[${33}m${`espTails`}\u001b[${39}m`} = ${espTails}`,
                );
            }
            if (str[z] === "{" && str[z + 1] === "%") {
              espTails = "%}";
              DEV &&
                console.log(
                  `1218 ${`\u001b[${33}m${`espTails`}\u001b[${39}m`} = ${espTails}`,
                );
            }
            if (espTails && str.includes(espTails, z + 1)) {
              DEV &&
                console.log(
                  `1224 ${`\u001b[${32}m${`ESP Nunjucks/Jinja heads detected`}\u001b[${39}m`}`,
                );
              z = str.indexOf(espTails, z + 1) + espTails.length - 1;
              DEV &&
                console.log(
                  `1229 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} z = ${z}; then ${`\u001b[${31}m${`CONTINUE`}\u001b[${39}m`}`,
                );
              continue;
            } else if (espTails) {
              // if tails are not present, wipe them, for perf reasons
              DEV &&
                console.log(
                  `1236 ${`\u001b[${31}m${`WIPE`}\u001b[${39}m`} ${`\u001b[${33}m${`espTails`}\u001b[${39}m`}`,
                );
              espTails = "";
            }

            // catch the ending of a secondary stopper
            if (secondaryStopper && str[z] === secondaryStopper) {
              DEV &&
                console.log(
                  `1245 \u001b[${36}m${`atRulesWhichNeedToBeIgnored = ${JSON.stringify(
                    atRulesWhichNeedToBeIgnored,
                    null,
                    0,
                  )} - VS - matchedAtTagsName = ${matchedAtTagsName}\natRulesWhichMightWrapStyles = ${JSON.stringify(
                    atRulesWhichMightWrapStyles,
                    null,
                    0,
                  )} - VS - matchedAtTagsName = ${matchedAtTagsName}`}\u001b[${39}m`,
                );
              if (
                (str[z] === "}" &&
                  atRulesWhichNeedToBeIgnored.includes(matchedAtTagsName)) ||
                (str[z] === "{" &&
                  atRulesWhichMightWrapStyles.includes(matchedAtTagsName))
              ) {
                i = z;
                DEV &&
                  console.log(
                    `1264 ! SET \u001b[${31}m${`i = ${i}`}\u001b[${39}m - THEN, STEP OUT`,
                  );
                ruleChunkStartedAt = z + 1;
                DEV &&
                  console.log(
                    `1269 SET ${`\u001b[${33}m${`ruleChunkStartedAt`}\u001b[${39}m`} = ${ruleChunkStartedAt}`,
                  );
                continue stepOuter;
              } else {
                secondaryStopper = undefined;
                DEV &&
                  console.log(
                    `---- 1054 SET \u001b[${35}m${`secondaryStopper`}\u001b[${39}m = undefined`,
                  );
                continue;
                // continue stepouter;
              }
            }

            // set the secondary stopper
            if (str[z] === '"' && !secondaryStopper) {
              secondaryStopper = '"';
              DEV &&
                console.log(
                  `1288 SET \u001b[${35}m${`secondaryStopper`}\u001b[${39}m = ${secondaryStopper}`,
                );
            } else if (str[z] === "'" && !secondaryStopper) {
              secondaryStopper = "'";
              DEV &&
                console.log(
                  `1294 SET \u001b[${35}m${`secondaryStopper`}\u001b[${39}m = ${secondaryStopper}`,
                );
            } else if (str[z] === "(" && !secondaryStopper) {
              secondaryStopper = ")";
              DEV &&
                console.log(
                  `1300 SET \u001b[${35}m${`secondaryStopper`}\u001b[${39}m = ${secondaryStopper}`,
                );
            } else if (
              atRulesWhichNeedToBeIgnored.includes(matchedAtTagsName) &&
              str[z] === "{" &&
              !secondaryStopper
            ) {
              secondaryStopper = "}";
              DEV &&
                console.log(
                  `1310 SET \u001b[${35}m${`secondaryStopper`}\u001b[${39}m = ${secondaryStopper}`,
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

              DEV &&
                console.log(
                  `1325 AT-RULE BREAK CHAR: index=${z}, value="${str[z]}"`,
                );

              // bail out clauses
              let pushRangeFrom;
              let pushRangeTo;

              // normal cases:
              if (str[z] === "{" || str[z] === ";") {
                insideCurlyBraces = false;
                ruleChunkStartedAt = z + 1;
                DEV &&
                  console.log(
                    `1338 SET ${`\u001b[${33}m${`insideCurlyBraces`}\u001b[${39}m`} = false; ${`\u001b[${33}m${`ruleChunkStartedAt`}\u001b[${39}m`} = ${ruleChunkStartedAt}; THEN STEP OUT`,
                  );
                i = z;
                continue stepOuter;
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
                  DEV &&
                    console.log(
                      `1354 BROKEN AT-RULE DETECTED, pushing [${pushRangeFrom}, ${pushRangeTo}] = "${str.slice(
                        pushRangeFrom,
                        pushRangeTo,
                      )}" THEN STEP OUT`,
                    );
                  finalIndexesToDelete.push(pushRangeFrom, pushRangeTo);
                }
              }
              DEV &&
                console.log(
                  `1364 ${`\u001b[${33}m${`pushRangeTo`}\u001b[${39}m`} = ${pushRangeTo}; ${`\u001b[${33}m${`z`}\u001b[${39}m`} = ${z}`,
                );
              let iOffset = pushRangeTo
                ? pushRangeTo - 1
                : z - 1 + (str[z] === "{" ? 1 : 0);
              DEV &&
                console.log(
                  `1371 ${`\u001b[${33}m${`iOffset`}\u001b[${39}m`} = ${iOffset}`,
                );
              DEV &&
                console.log(
                  `1375 ! SET \u001b[${31}m${`i = ${iOffset}; ruleChunkStartedAt = ${
                    iOffset + 1
                  };`}\u001b[${39}m - THEN, STEP OUT.`,
                );
              i = iOffset;
              ruleChunkStartedAt = iOffset + 1;
              continue stepOuter;
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
        DEV &&
          console.log(
            `1400 ${`\u001b[${32}m${`██`}\u001b[${39}m`} pinpointing closing curly braces`,
          );

        // submit whole chunk for deletion if applicable:
        if (round === 2 && headWholeLineCanBeDeleted && ruleChunkStartedAt) {
          finalIndexesToDelete.push(ruleChunkStartedAt, i + 1);
          DEV &&
            console.log(
              `1408 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${ruleChunkStartedAt}, ${
                i + 1
              }]; finalIndexesToDelete now = ${JSON.stringify(
                finalIndexesToDelete,
                null,
                4,
              )}`,
            );
        }

        insideCurlyBraces = false;
        DEV &&
          console.log(
            `1421 SET ${`\u001b[${33}m${`insideCurlyBraces`}\u001b[${39}m`} = false`,
          );

        DEV &&
          console.log(
            `1426 FIY, \u001b[${31}m${`headWholeLineCanBeDeleted = ${headWholeLineCanBeDeleted}`}\u001b[${39}m; \u001b[${31}m${`lastKeptChunksCommaAt = ${lastKeptChunksCommaAt}`}\u001b[${39}m; \u001b[${31}m${`onlyDeletedChunksFollow = ${onlyDeletedChunksFollow}`}\u001b[${39}m
            `,
          );

        if (ruleChunkStartedAt) {
          ruleChunkStartedAt = i + 1;
          DEV &&
            console.log(
              `1434 SET ${`\u001b[${33}m${`ruleChunkStartedAt`}\u001b[${39}m`} = ${ruleChunkStartedAt}`,
            );
        }

        // reset selectorChunkStartedAt:
        selectorChunkStartedAt = null;
        selectorChunkCanBeDeleted = false;
        headWholeLineCanBeDeleted = true;
        singleSelectorStartedAt = null;
        lastKeptChunksCommaAt = null;
        onlyDeletedChunksFollow = false;

        DEV &&
          console.log(
            `1448 RESET: ${`\u001b[${33}m${`selectorChunkStartedAt`}\u001b[${39}m`} = null; ${`\u001b[${33}m${`singleSelectorStartedAt`}\u001b[${39}m`} = null; ${`\u001b[${33}m${`headWholeLineCanBeDeleted`}\u001b[${39}m`} = true;
          ${`\u001b[${33}m${`selectorChunkCanBeDeleted`}\u001b[${39}m`} = false;
          ${`\u001b[${33}m${`lastKeptChunksCommaAt`}\u001b[${39}m`} = null;
          ${`\u001b[${33}m${`onlyDeletedChunksFollow`}\u001b[${39}m`} = false;`,
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
        DEV &&
          console.log(
            `1482 catching the beginning/ending of CSS selectors in head`,
          );
        // TODO: skip all false-positive characters within quotes, like curlies

        // PART 1.

        // catch the START of single selectors (for example, "#head-only-id-2")
        // any character, not permitted in CSS class/id names stops the recording
        if (singleSelectorStartedAt === null) {
          // catch the start of a single
          if (chr === "." || chr === "#") {
            singleSelectorStartedAt = i;
            DEV &&
              console.log(
                `1496 SET ${`\u001b[${33}m${`singleSelectorStartedAt`}\u001b[${39}m`} = ${singleSelectorStartedAt}`,
              );
          } else if (matchLeft(str, i, "[class=")) {
            DEV &&
              console.log(
                `1501 ${`\u001b[${33}m${`██`}\u001b[${39}m`} [class= detected`,
              );
            if (isLatinLetter(chr)) {
              singleSelectorStartedAt = i;
              singleSelectorType = ".";
              DEV &&
                console.log(
                  `1508 SET ${`\u001b[${33}m${`singleSelectorStartedAt`}\u001b[${39}m`} = ${singleSelectorStartedAt}; ${`\u001b[${33}m${`singleSelectorType`}\u001b[${39}m`} = ${singleSelectorType}`,
                );
            } else if (
              `"'`.includes(chr) &&
              isLatinLetter(str[right(str, i) as number])
            ) {
              singleSelectorStartedAt = right(str, i);
              singleSelectorType = ".";
              DEV &&
                console.log(
                  `1518 SET ${`\u001b[${33}m${`singleSelectorStartedAt`}\u001b[${39}m`} = ${singleSelectorStartedAt}; ${`\u001b[${33}m${`singleSelectorType`}\u001b[${39}m`} = ${singleSelectorType}`,
                );
            }
          } else if (matchLeft(str, i, "[id=")) {
            DEV &&
              console.log(
                `1524 ${`\u001b[${33}m${`██`}\u001b[${39}m`} [id= detected`,
              );
            if (isLatinLetter(chr)) {
              singleSelectorStartedAt = i;
              singleSelectorType = "#";
              DEV &&
                console.log(
                  `1531 SET ${`\u001b[${33}m${`singleSelectorStartedAt`}\u001b[${39}m`} = ${singleSelectorStartedAt}; ${`\u001b[${33}m${`singleSelectorType`}\u001b[${39}m`} = ${singleSelectorType}`,
                );
            } else if (
              `"'`.includes(chr) &&
              isLatinLetter(str[right(str, i) as number])
            ) {
              singleSelectorStartedAt = right(str, i);
              singleSelectorType = "#";
              DEV &&
                console.log(
                  `1541 SET ${`\u001b[${33}m${`singleSelectorStartedAt`}\u001b[${39}m`} = ${singleSelectorStartedAt}; ${`\u001b[${33}m${`singleSelectorType`}\u001b[${39}m`} = ${singleSelectorType}`,
                );
            }
          } else if (chr.trim()) {
            // logging:
            DEV && console.log("1546 ██");
            if (chr === "}") {
              ruleChunkStartedAt = i + 1;
              currentChunk = null;
              DEV &&
                console.log(
                  `1552 SET ${`\u001b[${33}m${`ruleChunkStartedAt`}\u001b[${39}m`} = ${
                    i + 1
                  }; ${`\u001b[${33}m${`currentChunk`}\u001b[${39}m`} = null;`,
                );
            } else if (chr === "<" && str[i + 1] === "!") {
              // catch comment blocks, probably Outlook conditional comments
              // like <!--[if mso]>
              DEV &&
                console.log(
                  `1561 \u001b[${36}m${`conditional comment detected, traverse forward`}\u001b[${39}m`,
                );
              for (let y = i; y < len; y++) {
                totalCounter += 1;
                DEV &&
                  console.log(
                    `\u001b[${36}m${`-----str[${y}]=${str[y]}`}\u001b[${39}m`,
                  );
                if (str[y] === ">") {
                  ruleChunkStartedAt = y + 1;
                  selectorChunkStartedAt = y + 1;
                  DEV &&
                    console.log(
                      `\u001b[${36}m${`1323 ruleChunkStartedAt=${ruleChunkStartedAt}`}\u001b[${39}m; \u001b[${36}m${`selectorChunkStartedAt=${selectorChunkStartedAt}`}\u001b[${39}m; THEN BREAK`,
                    );
                  i = y;
                  continue stepOuter;
                }
              }
            } else if (str[i] === ",") {
              // it can be end of a tag, for example:
              // <style>
              // .a, li, .b, .c {}
              //       ^
              // we're here
              lastKeptChunksCommaAt = i;
              DEV &&
                console.log(
                  `1589 SET ${`\u001b[${33}m${`lastKeptChunksCommaAt`}\u001b[${39}m`} = ${lastKeptChunksCommaAt}; ${`\u001b[${33}m${`onlyDeletedChunksFollow`}\u001b[${39}m`} = ${onlyDeletedChunksFollow};`,
                );
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
          DEV &&
            console.log(
              `1606 CARVED OUT A SINGLE SELECTOR'S NAME: "\u001b[${32}m${singleSelector}\u001b[${39}m"`,
            );

          if (
            round === 2 &&
            !selectorChunkCanBeDeleted &&
            headCssToDelete.includes(singleSelector)
          ) {
            selectorChunkCanBeDeleted = true;
            DEV &&
              console.log(
                `1617 SET selectorChunkCanBeDeleted = true - ${`\u001b[${31}m${`CHUNK CAN BE DELETED`}\u001b[${39}m`}`,
              );
            onlyDeletedChunksFollow = true;
            DEV &&
              console.log(
                `1622 SET ${`\u001b[${33}m${`onlyDeletedChunksFollow`}\u001b[${39}m`} = true`,
              );
          } else if (round === 2 && !selectorChunkCanBeDeleted) {
            DEV &&
              console.log(
                `1627 ${`\u001b[${32}m${`BTW, THIS CHUNK MIGHT BE RETAINED`}\u001b[${39}m`}`,
              );
            DEV &&
              console.log(
                `1631 ${`\u001b[${33}m${`resolvedOpts.whitelist`}\u001b[${39}m`} = ${JSON.stringify(
                  resolvedOpts.whitelist,
                  null,
                  4,
                )}`,
              );
            // 1. uglify part
            if (
              resolvedOpts.uglify &&
              (!Array.isArray(resolvedOpts.whitelist) ||
                !resolvedOpts.whitelist.length ||
                !matcher([singleSelector], resolvedOpts.whitelist).length)
            ) {
              DEV &&
                console.log(
                  `1646 ${`\u001b[${31}m${`PUSH [${singleSelectorStartedAt}, ${i}, ${
                    allClassesAndIdsWithinHeadFinalUglified[
                      allClassesAndIdsWithinHeadFinal.indexOf(singleSelector)
                    ]
                  }]`}\u001b[${39}m`}`,
                );
              currentChunksMinifiedSelectors.push(
                singleSelectorStartedAt,
                i,
                allClassesAndIdsWithinHeadFinalUglified[
                  allClassesAndIdsWithinHeadFinal.indexOf(singleSelector)
                ],
              );
            }
            // 2. tend trailing comma issue (lastKeptChunksCommaAt and
            // onlyDeletedChunksFollow):
            if (chr === ",") {
              lastKeptChunksCommaAt = i;
              onlyDeletedChunksFollow = false;
              DEV &&
                console.log(
                  `1667 SET ${`\u001b[${33}m${`lastKeptChunksCommaAt`}\u001b[${39}m`} = ${lastKeptChunksCommaAt}; ${`\u001b[${33}m${`onlyDeletedChunksFollow`}\u001b[${39}m`} = ${onlyDeletedChunksFollow};`,
                );
            } else {
              // IF it's whitespace, traverse forward, look for comma
            }
          }

          if (chr === "." || chr === "#") {
            singleSelectorStartedAt = i;
            DEV &&
              console.log(
                `1678 ${`\u001b[${33}m${`singleSelectorStartedAt`}\u001b[${39}m`} = ${singleSelectorStartedAt}`,
              );
          } else {
            singleSelectorStartedAt = null;
            DEV && console.log(`1682 WIPE singleSelectorStartedAt = null`);
          }
        }

        // PART 2.

        // catch the selectorChunks (for example, #head-only-id-2.real-class-1[lang|en]):
        // only opening curly brace or comma stops the recording.
        if (selectorChunkStartedAt === null) {
          DEV && console.log(`1691 catching the start of a chunk`);
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
            DEV &&
              console.log(
                `1704 ${`\u001b[${33}m${`selectorChunkCanBeDeleted`}\u001b[${39}m`} = ${selectorChunkCanBeDeleted}`,
              );

            // set the chunk's starting marker:
            selectorChunkStartedAt = i;
            DEV &&
              console.log(
                `1711 ${`\u001b[${33}m${`selectorChunkStartedAt`}\u001b[${39}m`} = ${selectorChunkStartedAt}`,
              );
          }
        }
        // catch the ending of a chunk
        else if (",{".includes(chr)) {
          let sliceTo = whitespaceStartedAt || i;
          currentChunk = str.slice(selectorChunkStartedAt, sliceTo);
          DEV &&
            console.log(
              `1721 ${`\u001b[${33}m${`currentChunk`}\u001b[${39}m`} = ${JSON.stringify(
                currentChunk,
                null,
                0,
              )} (sliced [${selectorChunkStartedAt}, ${sliceTo}])`,
            );

          // if it's round #2 and chunk is about to be deleted, give it the last
          // chance, match it against whitelist strArrToMatchAgainstChunks[]
          if (
            round === 2 &&
            selectorChunkCanBeDeleted &&
            strArrToMatchAgainstChunks.length &&
            matcher([currentChunk], strArrToMatchAgainstChunks).length
          ) {
            selectorChunkCanBeDeleted = false;
            DEV &&
              console.log(
                `1739 ${`\u001b[${31}m${`██ CHUNK MATCHED ONE OF resolvedOpts.whitelist RAW STRINGS AND WON'T BE DELETED`}\u001b[${39}m`}`,
              );
            DEV &&
              console.log(
                `1743 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`selectorChunkCanBeDeleted`}\u001b[${39}m`} = ${selectorChunkCanBeDeleted}`,
              );
          }

          if (round === 1) {
            // delete whitespace in front of commas or more than two spaces
            // in front of opening curly braces:
            if (whitespaceStartedAt) {
              if (chr === "," && whitespaceStartedAt < i) {
                finalIndexesToDelete.push(whitespaceStartedAt, i);
                DEV &&
                  console.log(
                    `1755 PUSH WHITESPACE [${whitespaceStartedAt}, ${i}]`,
                  );
                nonIndentationsWhitespaceLength += i - whitespaceStartedAt;
              } else if (chr === "{" && whitespaceStartedAt < i - 1) {
                finalIndexesToDelete.push(whitespaceStartedAt, i - 1);
                DEV &&
                  console.log(
                    `1762 PUSH WHITESPACE [${whitespaceStartedAt}, ${i - 1}]`,
                  );
                nonIndentationsWhitespaceLength += i - 1 - whitespaceStartedAt;
              }
            }

            headSelectorsArr.push(currentChunk);
            DEV &&
              console.log(
                `1771 PUSH CHUNK "${`\u001b[${32}m${currentChunk}\u001b[${39}m`}" to headSelectorsArr which is now = ${JSON.stringify(
                  headSelectorsArr,
                  null,
                  0,
                )}`,
              );
          }
          // it's round 2
          else if (selectorChunkCanBeDeleted) {
            let fromIndex = selectorChunkStartedAt;
            let toIndex = i;
            DEV &&
              console.log(
                `1784 STARTING ${`\u001b[${33}m${`fromIndex`}\u001b[${39}m`} = ${fromIndex}`,
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
              DEV &&
                console.log(
                  `1802 \u001b[${36}m${`traverse backwards`}\u001b[${39}m`,
                );
              for (let y = selectorChunkStartedAt; y--; ) {
                totalCounter += 1;
                DEV &&
                  console.log(
                    `\u001b[${36}m${`----- str[${y}]=${str[y]}`}\u001b[${39}m`,
                  );
                if (str[y].trim() && str[y] !== ",") {
                  fromIndex = y + 1;
                  break;
                }
              }
              DEV &&
                console.log(
                  `1817 SET ${`\u001b[${33}m${`fromIndex`}\u001b[${39}m`} = ${JSON.stringify(
                    fromIndex,
                    null,
                    4,
                  )}`,
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
            DEV &&
              console.log(
                `1854 ENDING ${`\u001b[${33}m${`fromIndex`}\u001b[${39}m`} = ${fromIndex}`,
              );
            DEV &&
              console.log(
                `1858 ENDING ${`\u001b[${33}m${`toIndex`}\u001b[${39}m`} = ${toIndex}`,
              );

            let resToPush = expander({
              str,
              from: fromIndex,
              to: toIndex,
              ifRightSideIncludesThisThenCropTightly: ".#",
              ifRightSideIncludesThisCropItToo: ",",
              extendToOneSide: "right",
            });
            DEV &&
              console.log(
                `1871 ${`\u001b[${33}m${`resToPush`}\u001b[${39}m`} = ${JSON.stringify(
                  resToPush,
                  null,
                  4,
                )}`,
              );

            (finalIndexesToDelete as any).push(...resToPush);
            DEV &&
              console.log(
                `1881 PUSH CHUNK ${JSON.stringify(resToPush, null, 0)}`,
              );

            // wipe any gathered selectors to be uglified
            if (resolvedOpts.uglify) {
              currentChunksMinifiedSelectors.wipe();
            }
          } else {
            // not selectorChunkCanBeDeleted

            // 1. reset headWholeLineCanBeDeleted
            if (headWholeLineCanBeDeleted) {
              headWholeLineCanBeDeleted = false;
              DEV &&
                console.log(
                  `1896 ${`\u001b[${32}m${`BTW, WHOLE LINE CAN'T BE DELETED NOW`}\u001b[${39}m`}`,
                );
            }

            // 2. reset onlyDeletedChunksFollow because this chunk was not
            // deleted, so this breaks the chain of "onlyDeletedChunksFollow"
            if (onlyDeletedChunksFollow) {
              onlyDeletedChunksFollow = false;
            }

            // 3. tend uglification
            if (resolvedOpts.uglify) {
              DEV &&
                console.log(
                  `1910 ${`\u001b[${31}m${`MERGE WITH FINAL INDEXES`}\u001b[${39}m`} - ${JSON.stringify(
                    currentChunksMinifiedSelectors.current(),
                    null,
                    0,
                  )}`,
                );
              finalIndexesToDelete.push(
                currentChunksMinifiedSelectors.current(),
              );
              currentChunksMinifiedSelectors.wipe();
            }
          }

          // wipe the marker:
          if (chr !== "{") {
            selectorChunkStartedAt = null;
            DEV &&
              console.log(
                `1928 WIPE ${`\u001b[${33}m${`selectorChunkStartedAt`}\u001b[${39}m`} = null`,
              );
          } else if (round === 2) {
            // the last chunk was reached so let's evaluate, can we delete
            // the whole "row":

            DEV &&
              console.log(
                `1936 ██ ${`\u001b[${33}m${`headWholeLineCanBeDeleted`}\u001b[${39}m`} = ${headWholeLineCanBeDeleted}`,
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
              DEV &&
                console.log(
                  `1950 ${`\u001b[${33}m${`deleteUpTo`}\u001b[${39}m`} = ${JSON.stringify(
                    deleteUpTo,
                    null,
                    4,
                  )}`,
                );
              if ("\n\r".includes(str[lastKeptChunksCommaAt + 1])) {
                for (let y = lastKeptChunksCommaAt + 1; y < len; y++) {
                  if (str[y].trim()) {
                    deleteUpTo = y;
                    break;
                  }
                }
              }

              finalIndexesToDelete.push(lastKeptChunksCommaAt, deleteUpTo);
              DEV &&
                console.log(
                  `1968 PUSH COMMA [${lastKeptChunksCommaAt}, ${deleteUpTo}] (${str.slice(
                    lastKeptChunksCommaAt,
                    deleteUpTo,
                  )})`,
                );

              // reset:
              lastKeptChunksCommaAt = null;
              onlyDeletedChunksFollow = false;
              DEV &&
                console.log(
                  `1979 RESET: lastKeptChunksCommaAt = null; onlyDeletedChunksFollow = false;`,
                );
            }
          }
        }

        //
      } else if (selectorSinceLinebreakDetected) {
        // reset the "selectorSinceLinebreakDetected"
        selectorSinceLinebreakDetected = false;
        DEV &&
          console.log(
            `1991 RESET ${`\u001b[${33}m${`selectorSinceLinebreakDetected`}\u001b[${39}m`} = false`,
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
                  DEV &&
                    console.log(
                      `2028 ${`\u001b[${33}m${`PUSH`}\u001b[${39}m`} [${i}, ${index}, "<body"]`,
                    );
                  finalIndexesToDelete.push(i, index, "<body");
                  // remove the whitespace between < and body
                  nonIndentationsWhitespaceLength += index - i - 5;
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
        DEV &&
          console.log(
            `2049 \u001b[${36}m${`march forward to find the ending of the opening body tag:`}\u001b[${39}m`,
          );
        for (let y = i; y < len; y++) {
          totalCounter += 1;
          if (str[y] === ">") {
            bodyStartedAt = y + 1;
            DEV &&
              console.log(
                `2057 SET ${`\u001b[${33}m${`bodyStartedAt`}\u001b[${39}m`} = ${bodyStartedAt}, then BREAK`,
              );
            // we can't offset the index because there might be unused classes
            // or id's on the body tag itself.
            break;
          }
        }
        DEV &&
          console.log(
            `2066 \u001b[${36}m${`stop marching forward`}\u001b[${39}m`,
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
          DEV &&
            console.log(
              `2089 ${`\u001b[${33}m${`styleAttributeStartedAt`}\u001b[${39}m`} = ${styleAttributeStartedAt}`,
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

        DEV && console.log("2113");
        let valuesStart;
        let quoteless = false;

        if (str[i + 5] === "=") {
          if (str[i + 6] === '"' || str[i + 6] === "'") {
            valuesStart = i + 7;
            DEV && console.log(`2120 SET valuesStart = ${valuesStart}`);
          } else if (characterSuitableForNames(str[i + 6])) {
            valuesStart = i + 6;
            DEV && console.log(`2123 SET valuesStart = ${valuesStart}`);
            quoteless = true;
          } else if (
            str[i + 6] &&
            (!str[i + 6].trim() || "/>".includes(str[i + 6]))
          ) {
            let calculatedRange = expander({
              str,
              from: i,
              to: i + 6,
              ifRightSideIncludesThisThenCropTightly: "/>",
              wipeAllWhitespaceOnLeft: true,
            });
            DEV &&
              console.log(
                `2138 PUSH ${JSON.stringify(calculatedRange, null, 0)}`,
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
                  DEV && console.log(`2151 PUSH [${i + 5}, ${y}]`);
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
                        DEV && console.log(`2165 PUSH [${y + 1}, ${z}]`);
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
              //   DEV && console.log(
              //     `1856 PUSH ${JSON.stringify(calculatedRange, null, 0)}`
              //   );
              //   finalIndexesToDelete.push(...calculatedRange);
              // }

              // 2. stop anyway
              break;
            }
          }
        }

        DEV &&
          console.log(
            `2201 ${`\u001b[${33}m${`valuesStart`}\u001b[${39}m`} = ${valuesStart}`,
          );

        if (valuesStart) {
          // 1. mark it
          bodyClass = resetBodyClassOrId({
            valuesStart,
            quoteless,
            nameStart: i,
          });
          DEV &&
            console.log(
              `2213 SET ${`\u001b[${33}m${`bodyClass`}\u001b[${39}m`} = ${JSON.stringify(
                bodyClass,
                null,
                4,
              )}`,
            );

          // 2. resets:
          if (round === 1) {
            bodyItsTheFirstClassOrId = true;
            DEV &&
              console.log(
                `2225 SET ${`\u001b[${33}m${`bodyItsTheFirstClassOrId`}\u001b[${39}m`} = true`,
              );
          } else if (round === 2) {
            // 2. reset the we-can-delete-whole-class/id marker:
            bodyClassOrIdCanBeDeleted = true;
            DEV &&
              console.log(
                `2232 SET ${`\u001b[${33}m${`bodyClassOrIdCanBeDeleted`}\u001b[${39}m`} = true`,
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
        DEV && console.log("2252");
        let valuesStart;
        let quoteless = false;

        if (str[i + 2] === "=") {
          if (str[i + 3] === '"' || str[i + 3] === "'") {
            valuesStart = i + 4;
            DEV && console.log(`2259 SET valuesStart = ${valuesStart}`);
          } else if (characterSuitableForNames(str[i + 3])) {
            valuesStart = i + 3;
            DEV && console.log(`2262 SET valuesStart = ${valuesStart}`);
            quoteless = true;
          } else if (
            str[i + 3] &&
            (!str[i + 3].trim() || "/>".includes(str[i + 3]))
          ) {
            let calculatedRange = expander({
              str,
              from: i,
              to: i + 3,
              ifRightSideIncludesThisThenCropTightly: "/>",
              wipeAllWhitespaceOnLeft: true,
            });
            DEV &&
              console.log(
                `2277 PUSH ${JSON.stringify(calculatedRange, null, 0)}`,
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
                  DEV && console.log(`2290 PUSH [${i + 2}, ${y}]`);
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
                        DEV && console.log(`2304 PUSH [${y + 1}, ${z}]`);
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
              //   DEV && console.log(
              //     `1987 PUSH ${JSON.stringify(calculatedRange, null, 0)}`
              //   );
              //   finalIndexesToDelete.push(...calculatedRange);
              // }

              // 2. stop anyway
              break;
            }
          }
        }

        DEV &&
          console.log(
            `2340 ${`\u001b[${33}m${`valuesStart`}\u001b[${39}m`} = ${valuesStart}`,
          );

        if (valuesStart) {
          // 1. mark it
          bodyId = resetBodyClassOrId({ valuesStart, quoteless, nameStart: i });
          DEV &&
            console.log(
              `2348 SET ${`\u001b[${33}m${`bodyId`}\u001b[${39}m`} = ${JSON.stringify(
                bodyId,
                null,
                4,
              )}`,
            );

          // 2. resets:
          if (round === 1) {
            bodyItsTheFirstClassOrId = true;
            DEV &&
              console.log(
                `2360 SET ${`\u001b[${33}m${`bodyItsTheFirstClassOrId`}\u001b[${39}m`} = true`,
              );
          } else if (round === 2) {
            // 2. reset the we-can-delete-whole-class/id marker:
            bodyClassOrIdCanBeDeleted = true;
            DEV &&
              console.log(
                `2367 SET ${`\u001b[${33}m${`bodyClassOrIdCanBeDeleted`}\u001b[${39}m`} = true`,
              );
          }
        }
      }

      // body: catch the first letter within each class attribute
      // ================
      if (
        !doNothing &&
        bodyClass.valuesStart !== null &&
        i >= bodyClass.valuesStart &&
        bodyClass.valueStart === null
      ) {
        if (allHeads && matchRightIncl(str, i, allHeads)) {
          // 1. activate do-nothing flag
          doNothing = true;
          DEV &&
            console.log(
              `2386 SET ${`\u001b[${33}m${`doNothing`}\u001b[${39}m`} = true`,
            );

          // 2. mark this class as not to be removed (as a whole)
          bodyClassOrIdCanBeDeleted = false;

          if (whitespaceStartedAt && i > whitespaceStartedAt + 1) {
            let calculatedRange = expander({
              str,
              from: whitespaceStartedAt,
              to: i,
              ifLeftSideIncludesThisThenCropTightly: "\"'",
              ifRightSideIncludesThisThenCropTightly: "\"'",
            });
            (finalIndexesToDelete as any).push(...calculatedRange);
            DEV &&
              console.log(
                `2403 PUSH ${JSON.stringify(calculatedRange, null, 4)}`,
              );
            whitespaceStartedAt = null;
            DEV &&
              console.log(
                `2408 SET ${`\u001b[${33}m${`whitespaceStartedAt`}\u001b[${39}m`} = null`,
              );
          } else if (whitespaceStartedAt) {
            whitespaceStartedAt = null;
          }

          // 3. set doNothingUntil to corresponding tails
          let matchedHeads = matchRightIncl(str, i, allHeads);
          DEV &&
            console.log(
              `2418 ${`\u001b[${33}m${`matchedHeads`}\u001b[${39}m`} = ${matchedHeads}`,
            );
          let findings = resolvedOpts.backend.find(
            (headsTailsObj) => headsTailsObj.heads === matchedHeads,
          );
          DEV &&
            console.log(
              `2425 ${`\u001b[${33}m${`findings`}\u001b[${39}m`} = ${JSON.stringify(
                findings,
                null,
                4,
              )}`,
            );
          if (findings?.tails) {
            doNothingUntil = findings.tails;
            DEV &&
              console.log(
                `2435 SET ${`\u001b[${33}m${`doNothingUntil`}\u001b[${39}m`} = ${doNothingUntil}`,
              );
          }
        } else if (characterSuitableForNames(chr)) {
          // 1. mark the class' starting index
          bodyClass.valueStart = i;
          DEV &&
            console.log(
              `2443 SET ${`\u001b[${33}m${`bodyClass.valueStart`}\u001b[${39}m`} = ${
                bodyClass.valueStart
              }`,
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
              DEV &&
                console.log(
                  `2461 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} LEADING WHITESPACE [${
                    bodyClass.valuesStart
                  }, ${i}]`,
                );
              nonIndentationsWhitespaceLength += i - bodyClass.valuesStart;
              // 2. disable bodyItsTheFirstClassOrId flag so we won't waste resources on
              // further classes/id's:
              bodyItsTheFirstClassOrId = false;
              DEV &&
                console.log(
                  `2471 SET ${`\u001b[${33}m${`bodyItsTheFirstClassOrId`}\u001b[${39}m`} = false`,
                );
            } else if (
              whitespaceStartedAt !== null &&
              whitespaceStartedAt < i - 1
            ) {
              // maybe there's whitespace between classes?
              finalIndexesToDelete.push(whitespaceStartedAt + 1, i);
              DEV &&
                console.log(
                  `2481 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                    whitespaceStartedAt + 1
                  }, ${i}]`,
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
          DEV &&
            console.log(
              `2507 SET ${`\u001b[${33}m${`bodyClass.valueStart`}\u001b[${39}m`} = null`,
            );

          bodyClass = resetBodyClassOrId();
          DEV && console.log(`2511 RESET bodyClass`);

          let matchedHeads = matchRightIncl(str, i, allHeads);
          DEV &&
            console.log(
              `2516 ${`\u001b[${33}m${`matchedHeads`}\u001b[${39}m`} = ${matchedHeads}`,
            );
          let findings = resolvedOpts.backend.find(
            (headsTailsObj) => headsTailsObj.heads === matchedHeads,
          );
          DEV &&
            console.log(
              `2523 ${`\u001b[${33}m${`findings`}\u001b[${39}m`} = ${JSON.stringify(
                findings,
                null,
                4,
              )}`,
            );
          if (findings?.tails) {
            doNothingUntil = findings.tails;
            DEV &&
              console.log(
                `2533 SET ${`\u001b[${33}m${`doNothingUntil`}\u001b[${39}m`} = ${doNothingUntil}`,
              );
          }
        } else {
          // normal operations can continue
          let carvedClass = `${str.slice(bodyClass.valueStart, i)}`;
          DEV &&
            console.log(
              `2541 CARVED OUT BODY CLASS "${`\u001b[${32}m${carvedClass}\u001b[${39}m`}"`,
            );
          DEV &&
            console.log(
              `2545 ██ ${`\u001b[${33}m${`allTails`}\u001b[${39}m`} = ${JSON.stringify(
                allTails,
                null,
                4,
              )}`,
            );
          // DEV && console.log(
          //   `2206 R1 = ${!!(allTails && matchRightIncl(str, i, allTails))}`
          // );
          // DEV && console.log(`2208 R2 = ${!!matchRightIncl(str, i, allTails)}`);
          // DEV && console.log(
          //   `2210 R3 = ${!!(allHeads && matchRightIncl(str, i, allHeads))}`
          // );

          if (round === 1) {
            bodyClassesArr.push(`.${carvedClass}`);
            DEV &&
              console.log(
                `2563 \u001b[${35}m${`PUSH`}\u001b[${39}m slice ".${carvedClass}" to bodyClassesArr which becomes:\n${JSON.stringify(
                  bodyClassesArr,
                  null,
                  0,
                )}`,
              );
          }
          // round 2
          else if (
            bodyClass.valueStart != null &&
            bodyClassesToDelete.includes(carvedClass)
          ) {
            // submit this class for deletion
            DEV &&
              console.log(
                `2578 ${`\u001b[${33}m${`carvedClass`}\u001b[${39}m`} = ${carvedClass}`,
              );
            DEV &&
              console.log(
                `2582 before expanding, ${`\u001b[${33}m${`bodyClass.valueStart`}\u001b[${39}m`} = ${JSON.stringify(
                  bodyClass.valueStart,
                  null,
                  0,
                )}`,
              );

            let expandedRange = expander({
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
              str[expandedRange[0] - 1]?.trim() &&
              str[expandedRange[1]]?.trim() &&
              (allHeads || allTails) &&
              ((allHeads &&
                matchLeft(str, expandedRange[0], allTails as string[])) ||
                (allTails &&
                  matchRightIncl(str, expandedRange[1], allHeads as string[])))
            ) {
              whatToInsert = " ";
            }

            (finalIndexesToDelete as any).push(...expandedRange, whatToInsert);
            DEV &&
              console.log(
                `2615 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
                  [expandedRange[0], expandedRange[1], whatToInsert],
                  null,
                  0,
                )}`,
              );
          } else {
            // 1. turn off the bodyClassOrIdCanBeDeleted
            bodyClassOrIdCanBeDeleted = false;
            DEV &&
              console.log(
                `2626 SET ${`\u001b[${33}m${`bodyClassOrIdCanBeDeleted`}\u001b[${39}m`} = false`,
              );

            // 2. uglify?
            if (
              resolvedOpts.uglify &&
              !(
                Array.isArray(resolvedOpts.whitelist) &&
                resolvedOpts.whitelist.length &&
                matcher([`.${carvedClass}`], resolvedOpts.whitelist).length
              )
            ) {
              DEV &&
                console.log(
                  `2640 ${`\u001b[${31}m${`PUSH [${bodyClass.valueStart}, ${i},
                  ${
                    allClassesAndIdsWithinHeadFinalUglified[
                      allClassesAndIdsWithinHeadFinal.indexOf(`.${carvedClass}`)
                    ]
                  }]`}\u001b[${39}m`}`,
                );
              finalIndexesToDelete.push(
                bodyClass.valueStart,
                i,
                allClassesAndIdsWithinHeadFinalUglified[
                  allClassesAndIdsWithinHeadFinal.indexOf(`.${carvedClass}`)
                ].slice(1),
              );
            }
          }

          bodyClass.valueStart = null;
          DEV &&
            console.log(
              `2660 SET ${`\u001b[${33}m${`bodyClass.valueStart`}\u001b[${39}m`} = null`,
            );
        }
      }

      // catch the ending of an id name
      // ================
      if (
        !doNothing &&
        bodyId?.valueStart !== null &&
        i > bodyId.valueStart &&
        (!characterSuitableForNames(chr) ||
          (allTails && matchRightIncl(str, i, allTails)))
      ) {
        DEV && console.log("2674");
        let carvedId = str.slice(bodyId.valueStart, i);
        DEV &&
          console.log(
            `2678 CARVED OUT BODY ID "${`\u001b[${32}m${carvedId}\u001b[${39}m`}"`,
          );
        if (round === 1) {
          bodyIdsArr.push(`#${carvedId}`);
          DEV &&
            console.log(
              `2684 \u001b[${35}m${`PUSH`}\u001b[${39}m slice "${`#${carvedId}`}" to bodyIdsArr which is now:\n${JSON.stringify(
                bodyIdsArr,
                null,
                4,
              )}`,
            );
        }
        // round 2
        else if (
          bodyId.valueStart != null &&
          bodyIdsToDelete.includes(carvedId)
        ) {
          // submit this id for deletion
          DEV &&
            console.log(
              `2699 ${`\u001b[${33}m${`carvedId`}\u001b[${39}m`} = ${carvedId}`,
            );
          DEV &&
            console.log(
              `2703 before expanding, ${`\u001b[${33}m${`bodyId.valueStart`}\u001b[${39}m`} = ${JSON.stringify(
                bodyId.valueStart,
                null,
                4,
              )}`,
            );

          let expandedRange = expander({
            str,
            from: bodyId.valueStart,
            to: i,
            ifRightSideIncludesThisThenCropTightly: `"'`,
            wipeAllWhitespaceOnLeft: true,
          });

          // precaution against too tight crop when backend markers are involved
          if (
            str[expandedRange[0] - 1]?.trim() &&
            str[expandedRange[1]]?.trim() &&
            (allHeads || allTails) &&
            ((allHeads && matchLeft(str, expandedRange[0], allTails || [])) ||
              (allTails &&
                matchRightIncl(str, expandedRange[1], allHeads || [])))
          ) {
            expandedRange[0] += 1;
            DEV && console.log(`2728 REDUCE expandedRange[0] by one`);
          }

          (finalIndexesToDelete as any).push(...expandedRange);
          DEV &&
            console.log(
              `2734 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
                expandedRange,
                null,
                0,
              )}`,
            );
        } else {
          // 1. turn off the bodyClassOrIdCanBeDeleted
          bodyClassOrIdCanBeDeleted = false;
          DEV &&
            console.log(
              `2745 SET ${`\u001b[${33}m${`bodyClassOrIdCanBeDeleted`}\u001b[${39}m`} = false`,
            );
          DEV &&
            console.log(
              `2749 ${`\u001b[${33}m${`carvedId`}\u001b[${39}m`} = ${JSON.stringify(
                carvedId,
                null,
                4,
              )}`,
            );
          DEV &&
            console.log(
              `2757 resolvedOpts.whitelist = ${JSON.stringify(
                resolvedOpts.whitelist,
                null,
                4,
              )}`,
            );
          DEV &&
            console.log(
              `2765 matcher([#${carvedId}], resolvedOpts.whitelist) = ${matcher(
                [`#${carvedId}`],
                resolvedOpts.whitelist,
              )}`,
            );

          // 2. uglify?
          if (
            resolvedOpts.uglify &&
            !(
              Array.isArray(resolvedOpts.whitelist) &&
              resolvedOpts.whitelist.length &&
              matcher([`#${carvedId}`], resolvedOpts.whitelist).length
            )
          ) {
            DEV &&
              console.log(
                `2782 ${`\u001b[${31}m${`PUSH [${bodyId.valueStart}, ${i},
                ${
                  allClassesAndIdsWithinHeadFinalUglified[
                    allClassesAndIdsWithinHeadFinal.indexOf(`#${carvedId}`)
                  ]
                }]`}\u001b[${39}m`}`,
              );
            finalIndexesToDelete.push(
              bodyId.valueStart,
              i,
              allClassesAndIdsWithinHeadFinalUglified[
                allClassesAndIdsWithinHeadFinal.indexOf(`#${carvedId}`)
              ].slice(1),
            );
          }
        }

        bodyId.valueStart = null;
        DEV &&
          console.log(
            `2802 SET ${`\u001b[${33}m${`bodyId.valueStart`}\u001b[${39}m`} = null`,
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
        DEV && console.log("2816");
        if (i === bodyClass.valuesStart) {
          DEV && console.log(`2818 EMPTY CLASS DETECTED!`);
          if (round === 1) {
            DEV &&
              console.log(
                `2822 PUSH ${JSON.stringify(
                  expander({
                    str,
                    from: bodyClass.nameStart as number,
                    to: i + 1,
                    ifRightSideIncludesThisThenCropTightly: "/>",
                    wipeAllWhitespaceOnLeft: true,
                  }),
                  null,
                  0,
                )}`,
              );
            (finalIndexesToDelete as any).push(
              ...expander({
                str,
                from: bodyClass.nameStart as number,
                to: i + 1,
                ifRightSideIncludesThisThenCropTightly: "/>",
                wipeAllWhitespaceOnLeft: true,
              }),
            );
          }
        } else {
          // 1. if it's second round and by now the delete-whole-class/id marker
          // is active (no skipped classes/id which had turn it off yet) then
          // delete this class or id completely:
          if (round === 2 && bodyClassOrIdCanBeDeleted) {
            // 1. submit the range of whole class/id for deletion
            // finalIndexesToDelete.push(bodyClass.valuesStart - 7, i + 1);
            DEV &&
              console.log(
                `2853 ${`\u001b[${33}m${`initial range`}\u001b[${39}m`}: [${
                  bodyClass.valuesStart - 7
                }, ${`'"`.includes(str[i]) ? i + 1 : i}]`,
              );
            let expandedRange = expander({
              str,
              from: bodyClass.valuesStart - 7,
              to: `'"`.includes(str[i]) ? i + 1 : i,
              ifRightSideIncludesThisThenCropTightly: "/>",
              wipeAllWhitespaceOnLeft: true,
            });
            DEV &&
              console.log(
                `2866 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`expandedRange`}\u001b[${39}m`}: ${JSON.stringify(
                  expandedRange,
                  null,
                  4,
                )}`,
              );

            // precaution against too tight crop when backend markers are involved
            let whatToInsert = "";
            if (
              str[expandedRange[0] - 1]?.trim() &&
              str[expandedRange[1]]?.trim() &&
              !"/>".includes(str[expandedRange[1]])
              // (allHeads || allTails) &&
              // ((allHeads && matchLeft(str, expandedRange[0], allHeads)) ||
              //   (allTails && matchRightIncl(str, expandedRange[1], allTails)))
            ) {
              whatToInsert = " ";
              DEV &&
                console.log(
                  `2886 SET whatToInsert = " " because str[expandedRange[0] - 1] = str[${
                    expandedRange[0] - 1
                  }] = ${
                    str[expandedRange[0] - 1]
                  } and str[expandedRange[1]] = str[${expandedRange[1]}] = ${
                    str[expandedRange[1]]
                  }`,
                );
            }

            (finalIndexesToDelete as any).push(...expandedRange, whatToInsert);
            DEV &&
              console.log(
                `2899 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
                  [expandedRange[0], expandedRange[1], whatToInsert],
                  null,
                  4,
                )}`,
              );
          }

          // 3. tend the trailing whitespace, as in class="zzzz  "
          if (whitespaceStartedAt !== null) {
            finalIndexesToDelete.push(whitespaceStartedAt, i);
            DEV &&
              console.log(
                `2912 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} TRAILING WHITESPACE [${whitespaceStartedAt}, ${i}]`,
              );
          }
        }

        // 2. reset the marker
        bodyClass = resetBodyClassOrId();
        DEV &&
          console.log(
            `2921 RESET ${`\u001b[${33}m${`bodyClass`}\u001b[${39}m`}`,
          );
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
        DEV && console.log("2935");
        if (i === bodyId.valuesStart) {
          DEV && console.log(`2937 EMPTY ID DETECTED!`);
          if (round === 1) {
            DEV &&
              console.log(
                `2941 [bodyId.nameStart=${bodyId.nameStart}, i+1=${
                  i + 1
                }] => [${
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
                }]`,
              );
            DEV &&
              console.log(
                `2963 PUSH ${JSON.stringify(
                  expander({
                    str,
                    from: bodyId.nameStart as number,
                    to: i + 1,
                    ifRightSideIncludesThisThenCropTightly: "/>",
                    wipeAllWhitespaceOnLeft: true,
                  }),
                  null,
                  0,
                )}`,
              );
            (finalIndexesToDelete as any).push(
              ...expander({
                str,
                from: bodyId.nameStart as number,
                to: i + 1,
                ifRightSideIncludesThisThenCropTightly: "/>",
                wipeAllWhitespaceOnLeft: true,
              }),
            );
          }
        } else {
          // not an empty id attribute
          // 1. if it's second round and by now the delete-whole-class/id marker
          // is active (no skipped classes/id which had turn it off yet) then
          // delete this class or id completely:
          if (round === 2 && bodyClassOrIdCanBeDeleted) {
            // 1. submit the range of whole class/id for deletion

            let expandedRange = expander({
              str,
              from: bodyId.valuesStart - 4,
              to: i + 1,
              ifRightSideIncludesThisThenCropTightly: "/>",
              wipeAllWhitespaceOnLeft: true,
            });

            // precaution against too tight crop when backend markers are involved
            let whatToInsert = "";
            if (
              str[expandedRange[0] - 1]?.trim() &&
              str[expandedRange[1]]?.trim() &&
              !"/>".includes(str[expandedRange[1]])
              // (allHeads || allTails) &&
              // ((allHeads && matchLeft(str, expandedRange[0], allHeads)) ||
              //   (allTails && matchRightIncl(str, expandedRange[1], allTails)))
            ) {
              whatToInsert = " ";
              DEV && console.log(`3012 SET whatToInsert = " "`);
            }

            (finalIndexesToDelete as any).push(...expandedRange, whatToInsert);
            DEV &&
              console.log(
                `3018 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
                  [expandedRange[0], expandedRange[1], whatToInsert],
                  null,
                  4,
                )}`,
              );
          }

          // 3. tend the trailing whitespace, as in id="zzzz  "
          if (whitespaceStartedAt !== null) {
            finalIndexesToDelete.push(whitespaceStartedAt, i);
            DEV &&
              console.log(
                `3031 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} TRAILING WHITESPACE [${whitespaceStartedAt}, ${i}]`,
              );
          }
        }

        // reset the marker in either case
        bodyId = resetBodyClassOrId();
        DEV &&
          console.log(`3039 RESET ${`\u001b[${33}m${`bodyId`}\u001b[${39}m`}`);
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
          DEV &&
            console.log(
              `3055 SET ${`\u001b[${33}m${`doNothing`}\u001b[${39}m`} = true`,
            );

          // 2. mark this id as not to be removed (as a whole)
          bodyClassOrIdCanBeDeleted = false;

          if (whitespaceStartedAt && i > whitespaceStartedAt + 1) {
            let calculatedRange = expander({
              str,
              from: whitespaceStartedAt,
              to: i,
              ifLeftSideIncludesThisThenCropTightly: "\"'",
              ifRightSideIncludesThisThenCropTightly: "\"'",
            });
            (finalIndexesToDelete as any).push(...calculatedRange);
            DEV &&
              console.log(
                `3072 PUSH ${JSON.stringify(calculatedRange, null, 4)}`,
              );
            whitespaceStartedAt = null;
            DEV &&
              console.log(
                `3077 SET ${`\u001b[${33}m${`whitespaceStartedAt`}\u001b[${39}m`} = null`,
              );
          } else if (whitespaceStartedAt) {
            whitespaceStartedAt = null;
          }

          // 3. set doNothingUntil to corresponding tails
          let matchedHeads = matchRightIncl(str, i, allHeads);
          DEV &&
            console.log(
              `3087 ${`\u001b[${33}m${`matchedHeads`}\u001b[${39}m`} = ${matchedHeads}`,
            );
          let findings = resolvedOpts.backend.find(
            (headsTailsObj) => headsTailsObj.heads === matchedHeads,
          );
          DEV &&
            console.log(
              `3094 ${`\u001b[${33}m${`findings`}\u001b[${39}m`} = ${JSON.stringify(
                findings,
                null,
                4,
              )}`,
            );
          if (findings?.tails) {
            doNothingUntil = findings.tails;
            DEV &&
              console.log(
                `3104 SET ${`\u001b[${33}m${`doNothingUntil`}\u001b[${39}m`} = ${doNothingUntil}`,
              );
          }
        } else if (characterSuitableForNames(chr)) {
          // 1. mark the id's starting index
          bodyId.valueStart = i;
          DEV &&
            console.log(
              `3112 SET ${`\u001b[${33}m${`bodyId.valueStart`}\u001b[${39}m`} = ${
                bodyId.valueStart
              }`,
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
              DEV &&
                console.log(
                  `3130 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                    bodyId.valuesStart
                  }, ${i}]`,
                );
              nonIndentationsWhitespaceLength += i - bodyId.valuesStart;
              // 2. disable bodyItsTheFirstClassOrId flag so we won't waste resources on
              // further classes/id's:
              bodyItsTheFirstClassOrId = false;
              DEV &&
                console.log(
                  `3140 SET ${`\u001b[${33}m${`bodyItsTheFirstClassOrId`}\u001b[${39}m`} = false`,
                );
            } else if (
              whitespaceStartedAt !== null &&
              whitespaceStartedAt < i - 1
            ) {
              // maybe there's whitespace between classes?
              finalIndexesToDelete.push(whitespaceStartedAt + 1, i);
              DEV &&
                console.log(
                  `3150 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                    whitespaceStartedAt + 1
                  }, ${i}]`,
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
        // resolvedOpts.doNotRemoveHTMLCommentsWhoseOpeningTagContains)
        // ==================================
        if (
          commentStartedAt !== null &&
          commentStartedAt < i &&
          str[i] === ">" &&
          !usedOnce
        ) {
          DEV && console.log(`I.`);
          DEV &&
            console.log(
              `3176 ${`\u001b[${33}m${`str.slice(commentStartedAt, i)`}\u001b[${39}m`} = ${JSON.stringify(
                str.slice(commentStartedAt, i),
                null,
                4,
              )}`,
            );

          if (
            resolvedOpts.doNotRemoveHTMLCommentsWhoseOpeningTagContains &&
            Array.isArray(
              resolvedOpts.doNotRemoveHTMLCommentsWhoseOpeningTagContains,
            ) &&
            resolvedOpts.doNotRemoveHTMLCommentsWhoseOpeningTagContains
              .length &&
            resolvedOpts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.some(
              (val) =>
                val.trim() &&
                str
                  .slice(commentStartedAt as number, i)
                  .toLowerCase()
                  .includes(val),
            )
          ) {
            canDelete = false;
            DEV &&
              console.log(
                `3202 SET ${`\u001b[${33}m${`canDelete`}\u001b[${39}m`} = ${canDelete}`,
              );
          }
          usedOnce = true;
          DEV &&
            console.log(
              `3208 SET \u001b[${33}m${`usedOnce`}\u001b[${39}m = ${usedOnce}`,
            );
        }

        // 2. catch the HTML comments' ending
        // ==================================
        if (commentStartedAt !== null && str[i] === ">") {
          DEV && console.log(`II.`);
          DEV &&
            console.log(
              `3218 BTW, ${`\u001b[${33}m${`canDelete`}\u001b[${39}m`} = ${JSON.stringify(
                canDelete,
                null,
                4,
              )}`,
            );
          // 1. catch healthy comment ending
          if (!bogusHTMLComment && str[i - 1] === "-" && str[i - 2] === "-") {
            // not bogus

            let calculatedRange = expander({
              str,
              from: commentStartedAt,
              to: i + 1,
              wipeAllWhitespaceOnLeft: true,
              addSingleSpaceToPreventAccidentalConcatenation: true,
            });
            if (resolvedOpts.removeHTMLComments && canDelete) {
              // Instead of finalIndexesToDelete.push(i, y + 3); use expander()
              // so that we manage the whitespace outwards properly:
              DEV &&
                console.log(
                  `3240 PUSH COMMENT ${JSON.stringify(
                    calculatedRange,
                    null,
                    0,
                  )}`,
                );
              (finalIndexesToDelete as any).push(...calculatedRange);
            }
            commentsLength += calculatedRange[1] - calculatedRange[0];

            // reset the markers:
            commentStartedAt = null;
            bogusHTMLComment = undefined;
            DEV &&
              console.log(
                `3255 RESET ${`\u001b[${33}m${`commentStartedAt`}\u001b[${39}m`} = null; ${`\u001b[${33}m${`bogusHTMLComment`}\u001b[${39}m`} = undefined`,
              );
          } else if (bogusHTMLComment) {
            let calculatedRange = expander({
              str,
              from: commentStartedAt,
              to: i + 1,
              wipeAllWhitespaceOnLeft: true,
              addSingleSpaceToPreventAccidentalConcatenation: true,
            });
            if (resolvedOpts.removeHTMLComments && canDelete) {
              DEV &&
                console.log(
                  `3268 PUSH BOGUS COMMENT ${JSON.stringify(
                    calculatedRange,
                    null,
                    0,
                  )}`,
                );
              (finalIndexesToDelete as any).push(...calculatedRange);
            }
            commentsLength += calculatedRange[1] - calculatedRange[0];

            // reset the markers:
            commentStartedAt = null;
            bogusHTMLComment = undefined;
            DEV &&
              console.log(
                `3283 RESET ${`\u001b[${33}m${`commentStartedAt`}\u001b[${39}m`} = null; ${`\u001b[${33}m${`bogusHTMLComment`}\u001b[${39}m`} = undefined`,
              );
          }
        }

        // 3. catch the HTML comments' starting
        // ====================================
        if (
          resolvedOpts.removeHTMLComments &&
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
            DEV && console.log(`3306 III. catch HTML comments clauses`);
            DEV &&
              console.log(
                `3309 ${`\u001b[${33}m${`commentNearlyStartedAt`}\u001b[${39}m`} = ${JSON.stringify(
                  commentNearlyStartedAt,
                  null,
                  4,
                )}`,
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
                  resolvedOpts.doNotRemoveHTMLCommentsWhoseOpeningTagContains,
                ) &&
                resolvedOpts.doNotRemoveHTMLCommentsWhoseOpeningTagContains
                  .length &&
                matchRight(
                  str,
                  i + 3,
                  resolvedOpts.doNotRemoveHTMLCommentsWhoseOpeningTagContains,
                  { trimBeforeMatching: true },
                )
              )
            ) {
              commentStartedAt = i;
              usedOnce = false;
              canDelete = true;
              DEV &&
                console.log(
                  `3343 SET ${`\u001b[${33}m${`commentStartedAt`}\u001b[${39}m`} = ${commentStartedAt}; ${`\u001b[${33}m${`usedOnce`}\u001b[${39}m`} = ${usedOnce}; ${`\u001b[${33}m${`canDelete`}\u001b[${39}m`} = ${canDelete};`,
                );
            }

            // 3.2. detect, is it healthy or bogus comment (bogusHTMLComment = true/false)
            bogusHTMLComment = !(str[i + 2] === "-" && str[i + 3] === "-");
            DEV &&
              console.log(
                `3351 SET ${`\u001b[${33}m${`bogusHTMLComment`}\u001b[${39}m`} = ${bogusHTMLComment}`,
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
        DEV && console.log(`3390 REDUCE curliesDepth now = ${curliesDepth}`);
      }

      // pinpoint opening curly braces (in head styles), but not @media's.
      // ================
      if (!doNothing && chr === "{" && checkingInsideCurlyBraces) {
        if (!insideCurlyBraces) {
          // 1. flip the flag
          insideCurlyBraces = true;
          DEV &&
            console.log(
              `3401 SET ${`\u001b[${33}m${`insideCurlyBraces`}\u001b[${39}m`} = true`,
            );

          // 2. if the whitespace was in front and it contained line breaks, wipe
          // that whitespace:
          if (
            whitespaceStartedAt !== null &&
            (str.slice(whitespaceStartedAt, i).includes("\n") ||
              str.slice(whitespaceStartedAt, i).includes("\r"))
          ) {
            finalIndexesToDelete.push(whitespaceStartedAt, i);
            DEV &&
              console.log(
                `3414 PUSH LEADING WHITESPACE [${whitespaceStartedAt}, ${i}]`,
              );
          }
        } else {
          curliesDepth += 1;
          DEV && console.log(`3419 BUMP curliesDepth now = ${curliesDepth}`);
        }
      }

      // catch the whitespace
      if (!doNothing) {
        if (!str[i].trim()) {
          if (whitespaceStartedAt === null) {
            whitespaceStartedAt = i;
            // DEV && console.log(
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
        DEV && console.log("\n");
        let temp = round1RangesClone.shift();
        DEV &&
          console.log(
            `3455 ${`\u001b[${33}m${`temp`}\u001b[${39}m`} = ${JSON.stringify(
              temp,
              null,
              0,
            )}`,
          );
        if (temp && temp[1] - 1 > i) {
          DEV &&
            console.log(
              `3464 \u001b[${31}m${`██ OFFSET MAIN INDEX FROM ${i} TO ${
                temp[1] - 1
              }`}\u001b[${39}m, then step out`,
            );
          i = temp[1] - 1;
        }
        continue;
      }

      // catch would-have-been comment endings
      if (commentNearlyStartedAt !== null && str[i] === ">") {
        // 1. reset the marker
        commentNearlyStartedAt = null;
        DEV &&
          console.log(
            `3479 ${`\u001b[${33}m${`commentNearlyStartedAt`}\u001b[${39}m`} = null`,
          );

        // 2. check, is there empty comment block on the right which sometimes
        // follows outlook conditionals
        let temp = 0;
        if (
          resolvedOpts.removeHTMLComments &&
          Array.isArray(
            resolvedOpts.doNotRemoveHTMLCommentsWhoseOpeningTagContains,
          ) &&
          resolvedOpts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.length &&
          (resolvedOpts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.some(
            (val) => val.includes("if"),
          ) ||
            resolvedOpts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.some(
              (val) => val.includes("mso"),
            ) ||
            resolvedOpts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.some(
              (val) => val.includes("ie"),
            )) &&
          matchRight(str, i, "<!--", {
            trimBeforeMatching: true,
            cb: (_char, _theRemainderOfTheString, index) => {
              temp = index as number;
              return true;
            },
          })
        ) {
          DEV &&
            console.log(
              `3510 I ${`\u001b[${33}m${`temp`}\u001b[${39}m`} = ${JSON.stringify(
                temp,
                null,
                4,
              )}, string that follows: "${JSON.stringify(
                str.slice(temp, temp + 10),
                null,
                4,
              )}"`,
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
            DEV &&
              console.log(
                `3531 II. ${`\u001b[${33}m${`temp`}\u001b[${39}m`} = ${JSON.stringify(
                  temp,
                  null,
                  4,
                )}, string that follows: "${JSON.stringify(
                  str.slice(temp, temp + 10),
                  null,
                  4,
                )}"`,
              );
          }

          if (typeof temp === "number") {
            i = temp - 1;
          }
          DEV &&
            console.log(
              `3548 SET ${`\u001b[${33}m${`i`}\u001b[${39}m`} = ${JSON.stringify(
                i,
                null,
                4,
              )}; THEN ${`\u001b[${32}m${`CONTINUE`}\u001b[${39}m`}`,
            );
          continue;
        }
      }

      // LOGGING:
      // ================

      // NOTE: logging switch below
      /* if (round === 1) {
        if (stateWithinBody) {
          DEV &&
            console.log(
              `3493 bodyClass.valueStart=${bodyClass.valueStart}\nbodyId.valueStart=${bodyId.valueStart}\nbodyClass.valuesStart=${bodyClass.valuesStart}${bodyId.valuesStart}`
            );
          // logging:
          // DEV && console.log(
          //   `3149 ${`\u001b[${90}m${`bodyClassOrIdCanBeDeleted`}\u001b[${39}m`} = ${JSON.stringify(
          //     bodyClassOrIdCanBeDeleted,
          //     null,
          //     0
          //   )}`
          // );
          // DEV && console.log(
          //   `3156 ${`\u001b[${90}m${`whitespaceStartedAt`}\u001b[${39}m`} = ${JSON.stringify(
          //     whitespaceStartedAt,
          //     null,
          //     0
          //   )}`
          // );
          DEV &&
            console.log(
              `3512 bodyItsTheFirstClassOrId=${bodyItsTheFirstClassOrId}\nheadWholeLineCanBeDeleted=${headWholeLineCanBeDeleted}`
            );
        } else if (stateWithinStyleTag) {
          // it's still within head:

          DEV &&
            console.log(
              `ENDING: \u001b[${36}m${`headWholeLineCanBeDeleted = ${headWholeLineCanBeDeleted}`}\u001b[${39}m
\u001b[${36}m${`headWholeLineCanBeDeleted = ${headWholeLineCanBeDeleted}`}\u001b[${39}m
\u001b[${36}m${`insideCurlyBraces = ${insideCurlyBraces}`}\u001b[${39}m
\u001b[${36}m${`curliesDepth = ${curliesDepth}`}\u001b[${39}m`
            );

          //

          // LOGGING for stage 1:
          if (round === 1) {
            DEV &&
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

        DEV &&
          console.log(
            `${`\u001b[${
              stateWithinBody ? 32 : 31
            }m${`stateWithinBody`}\u001b[${39}m`}; ${`\u001b[${
              stateWithinStyleTag ? 32 : 31
            }m${`stateWithinStyleTag`}\u001b[${39}m`}; \u001b[${33}m${`lastKeptChunksCommaAt`}\u001b[${39}m = ${lastKeptChunksCommaAt}; \u001b[${33}m${`onlyDeletedChunksFollow`}\u001b[${39}m = ${onlyDeletedChunksFollow};`
          );
      } */

      // DEV && console.log(`styleStartedAt = ${styleStartedAt}`);
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

      DEV && console.log(`3656 \u001b[${35}m${`\nAFTER STEP 1:`}\u001b[${39}m`);
      DEV &&
        console.log(
          `3659 headSelectorsArr = ${JSON.stringify(
            headSelectorsArr,
            null,
            4,
          )}`,
        );
      DEV &&
        console.log(
          `3667 bodyClassesArr = ${JSON.stringify(bodyClassesArr, null, 4)}`,
        );
      DEV &&
        console.log(`3670 bodyIdsArr = ${JSON.stringify(bodyIdsArr, null, 4)}`);
      DEV &&
        console.log(
          `3673 allClassesAndIdsWithinBody = ${JSON.stringify(
            allClassesAndIdsWithinBody,
            null,
            4,
          )}`,
        );
      DEV &&
        console.log(
          `3681 \nopts.whitelist = ${JSON.stringify(
            resolvedOpts.whitelist,
            null,
            4,
          )}`,
        );

      // extract all classes or id's from `headSelectorsArr` and get count of each.
      // That's so we can later exclude joined classes. Each time "collateral"
      // legit, but joined with false-one class gets deleted, we keep count, and
      // later compare totals with these below.
      // If it turns out that a class was in both head and body, but it was joined
      // with unused classes and removed as collateral, we need to remove it from body too.

      // starting point is the selectors, removed from head during first stage.

      DEV &&
        console.log(
          `3699 \n\n███████████████████████████████████████\n\n${`\u001b[${32}m${`starting headSelectorsCount`}\u001b[${39}m`} = ${JSON.stringify(
            headSelectorsCount,
            null,
            4,
          )}`,
        );

      headSelectorsArr.forEach((el) => {
        extract(el).res.forEach((selector) => {
          if (hasOwnProp(headSelectorsCount, selector)) {
            headSelectorsCount[selector] += 1;
          } else {
            headSelectorsCount[selector] = 1;
          }
        });
      });
      DEV &&
        console.log(
          `\n3290 headSelectorsCount = ${JSON.stringify(
            headSelectorsCount,
            null,
            4,
          )}`,
        );
      // create a working copy of `headSelectorsCount` which we'll mutate, subtracting
      // each deleted class/id:
      headSelectorsCountClone = { ...headSelectorsCount };

      // compile list of to-be-terminated
      // ================

      allClassesAndIdsWithinHead = uniq(
        headSelectorsArr.reduce(
          (arr, el) => arr.concat(extract(el).res as any),
          [],
        ),
      );

      countBeforeCleaning = allClassesAndIdsWithinHead.length;

      DEV &&
        console.log(
          `${`\u001b[${33}m${`1238 AFTER TRAVERSAL,\nallClassesAndIdsWithinHead`}\u001b[${39}m`} = ${JSON.stringify(
            allClassesAndIdsWithinHead,
            null,
            4,
          )}`,
        );

      // to avoid false positives, let's apply two cycles when removing unused classes/id's from head:

      // ---------------------------------------
      // TWO-CYCLE UNUSED CSS IDENTIFICATION:
      // ---------------------------------------

      // cycle #1 - remove comparing separate classes/id's from body against
      // potentially joined lumps from head. Let's see what's left afterwards.
      // ================

      let preppedHeadSelectorsArr = Array.from(headSelectorsArr);
      let deletedFromHeadArr = [];
      DEV &&
        console.log(
          `\u001b[${36}m${`3330 LOOP preppedHeadSelectorsArr = ${JSON.stringify(
            preppedHeadSelectorsArr,
            null,
            4,
          )}`}\u001b[${39}m`,
        );
      for (let y = 0, len2 = preppedHeadSelectorsArr.length; y < len2; y++) {
        totalCounter += 1;
        DEV && console.log(`\u001b[${36}m${`------------`}\u001b[${39}m`);
        DEV &&
          console.log(
            `3773 ${`\u001b[${36}m${`██`}\u001b[${39}m`} preppedHeadSelectorsArr[${y}] = ${JSON.stringify(
              preppedHeadSelectorsArr[y],
              null,
              4,
            )}`,
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
          DEV &&
            console.log(
              `3791 PUSH to deletedFromHeadArr[] [${JSON.stringify(
                extract(preppedHeadSelectorsArr[y]),
                null,
                4,
              )}]`,
            );
          deletedFromHeadArr.push(...extract(preppedHeadSelectorsArr[y]).res);
          DEV &&
            console.log(
              `3800 deletedFromHeadArr becomes = ${JSON.stringify(
                deletedFromHeadArr,
                null,
                4,
              )}`,
            );
          preppedHeadSelectorsArr.splice(y, 1);
          y -= 1;
          len2 -= 1;
        }
      }
      DEV && console.log(`\u001b[${36}m${`------------`}\u001b[${39}m`);

      deletedFromHeadArr = uniq(
        pull(deletedFromHeadArr, resolvedOpts.whitelist),
      );

      let preppedAllClassesAndIdsWithinHead: string[];
      if (preppedHeadSelectorsArr?.length) {
        preppedAllClassesAndIdsWithinHead = preppedHeadSelectorsArr.reduce(
          (acc, curr) => acc.concat(extract(curr).res as any),
          [],
        );
        DEV &&
          console.log(
            `3825 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`preppedAllClassesAndIdsWithinHead`}\u001b[${39}m`} = ${JSON.stringify(
              preppedAllClassesAndIdsWithinHead,
              null,
              4,
            )}`,
          );
      } else {
        preppedAllClassesAndIdsWithinHead = [];
      }
      // DEV && console.log(`\n* preppedAllClassesAndIdsWithinHead = ${JSON.stringify(preppedAllClassesAndIdsWithinHead, null, 4)}`)

      // cycle #2 - now treat remaining lumps as definite sources of
      // "what classes or id's are present in the head"
      // use "preppedAllClassesAndIdsWithinHead" as a head selector reference when comparing
      // against the body classes/id's.
      // ================

      headCssToDelete = pull(
        pullAll(
          uniq(Array.from(allClassesAndIdsWithinHead)),
          bodyClassesArr.concat(bodyIdsArr),
        ),
        resolvedOpts.whitelist,
      );
      DEV &&
        console.log(
          `3851 OLD ${`\u001b[${32}m${`headCssToDelete`}\u001b[${39}m`} = ${JSON.stringify(
            headCssToDelete,
            null,
            4,
          )}`,
        );

      bodyCssToDelete = uniq(
        pull(
          pullAll(
            bodyClassesArr.concat(bodyIdsArr),
            preppedAllClassesAndIdsWithinHead,
          ),
          resolvedOpts.whitelist,
        ),
      );
      DEV &&
        console.log(
          `3869 ${`\u001b[${32}m${`bodyCssToDelete`}\u001b[${39}m`} = ${JSON.stringify(
            bodyCssToDelete,
            null,
            4,
          )}`,
        );

      // now that we know final to-be-deleted selectors list, compare them with `deletedFromHeadArr`
      // and fill any missing CSS in `headCssToDelete`:
      headCssToDelete = uniq(
        headCssToDelete.concat(
          intersection(deletedFromHeadArr, bodyCssToDelete),
        ),
      );
      DEV &&
        console.log(
          `3885 NEW ${`\u001b[${32}m${`headCssToDelete`}\u001b[${39}m`} = ${JSON.stringify(
            headCssToDelete,
            null,
            4,
          )}`,
        );

      bodyClassesToDelete = bodyCssToDelete
        .filter((s) => s.startsWith("."))
        .map((s) => s.slice(1));
      DEV &&
        console.log(
          `3897 bodyClassesToDelete = ${JSON.stringify(
            bodyClassesToDelete,
            null,
            4,
          )}`,
        );
      bodyIdsToDelete = bodyCssToDelete
        .filter((s) => s.startsWith("#"))
        .map((s) => s.slice(1));
      DEV &&
        console.log(
          `3908 ${`\u001b[${33}m${`bodyIdsToDelete`}\u001b[${39}m`} = ${JSON.stringify(
            bodyIdsToDelete,
            null,
            4,
          )}`,
        );

      DEV &&
        console.log(
          `3917 CURRENT RANGES AFTER STEP 1: ${JSON.stringify(
            finalIndexesToDelete.current(),
            null,
            4,
          )}`,
        );

      allClassesAndIdsThatWereCompletelyDeletedFromHead = Object.keys(
        headSelectorsCountClone,
      ).filter((singleSelector) => headSelectorsCountClone[singleSelector] < 1);
      DEV &&
        console.log(
          `3929 ${`\u001b[${33}m${`allClassesAndIdsThatWereCompletelyDeletedFromHead`}\u001b[${39}m`} = ${JSON.stringify(
            allClassesAndIdsThatWereCompletelyDeletedFromHead,
            null,
            4,
          )}`,
        );

      // at this point, if any classes in `headSelectorsCountClone` have zero counters
      // that means those have all been deleted from head.

      bodyClassesToDelete = uniq(
        bodyClassesToDelete.concat(
          intersection(
            pull(allClassesAndIdsWithinBody, resolvedOpts.whitelist),
            allClassesAndIdsThatWereCompletelyDeletedFromHead,
          )
            .filter((val) => val[0] === ".") // filter out all classes
            .map((val) => val.slice(1)),
        ),
      ); // remove dots from them
      DEV &&
        console.log(
          `3951 ${`\u001b[${33}m${`bodyClassesToDelete`}\u001b[${39}m`} = ${JSON.stringify(
            bodyClassesToDelete,
            null,
            4,
          )}`,
        );

      let allClassesAndIdsWithinBodyThatWereWhitelisted = matcher(
        allClassesAndIdsWithinBody,
        resolvedOpts.whitelist,
      );
      DEV &&
        console.log(
          `3964 ${`\u001b[${31}m${`██ ██ ██`}\u001b[${39}m`} ${`\u001b[${33}m${`allClassesAndIdsWithinBodyThatWereWhitelisted`}\u001b[${39}m`} = ${JSON.stringify(
            allClassesAndIdsWithinBodyThatWereWhitelisted,
            null,
            4,
          )}`,
        );

      // update `bodyCssToDelete` with joined classes, because will be
      // used in reporting
      bodyCssToDelete = uniq(
        bodyCssToDelete.concat(
          bodyClassesToDelete.map((val) => `.${val}`),
          bodyIdsToDelete.map((val) => `#${val}`),
        ),
      );
      DEV &&
        console.log(
          `3981 ${`\u001b[${90}m${`bodyCssToDelete`}\u001b[${39}m`} = ${JSON.stringify(
            bodyCssToDelete,
            null,
            4,
          )}`,
        );

      allClassesAndIdsWithinHeadFinal = pullAll(
        pullAll(Array.from(allClassesAndIdsWithinHead), bodyCssToDelete),
        headCssToDelete,
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

      if (resolvedOpts.uglify) {
        allClassesAndIdsWithinHeadFinalUglified = uglifyArr(
          allClassesAndIdsWithinHeadFinal,
        );
      }

      countAfterCleaning = allClassesAndIdsWithinHeadFinal.length;

      uglified = resolvedOpts.uglify
        ? (allClassesAndIdsWithinHeadFinal
            .map((name, id) => [
              name,
              allClassesAndIdsWithinHeadFinalUglified[id],
            ])
            .filter(
              (arr) =>
                !resolvedOpts.whitelist.some((whitelistVal) =>
                  isMatch(arr[0], whitelistVal),
                ),
            ) as StringifiedLegend[])
        : null;

      DEV &&
        console.log(
          `4027 AFTER STEP 1, ${`\u001b[${33}m${`finalIndexesToDelete.current()`}\u001b[${39}m`} =
          ███████████████████████████████████████
          ███████████████████████████████████████
          ███████████████████V███████████████████
          ${JSON.stringify(finalIndexesToDelete.current(), null, 4)}
          ███████████████████^███████████████████
          ███████████████████████████████████████
          ███████████████████████████████████████
          `,
        );
      DEV &&
        console.log(
          `4039 ${`\u001b[${33}m${`uglified`}\u001b[${39}m`} = ${JSON.stringify(
            uglified,
            null,
            4,
          )}`,
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

      DEV &&
        console.log(
          `4081: allClassesAndIdsWithinHeadFinal = ${JSON.stringify(
            allClassesAndIdsWithinHeadFinal,
            null,
            4,
          )}`,
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
  //                     inner FOR loop ends

  //
  //
  //
  //                   F I N A L   P R O C E S S I N G
  //

  DEV &&
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

  DEV &&
    console.log(
      `4154 BEFORE 3RD STEP PREP ${`\u001b[${33}m${`str`}\u001b[${39}m`} = "${str}"`,
    );

  DEV &&
    console.log(
      `4159 AFTER 3ND ROUND, finalIndexesToDelete.current() = ${JSON.stringify(
        finalIndexesToDelete.current(),
        null,
        4,
      )}`,
    );
  if (str.length && finalIndexesToDelete.current()) {
    let finalRanges = finalIndexesToDelete.current()!;
    DEV &&
      console.log(
        `4169 BEFORE CLEANING, ${`\u001b[${33}m${`finalRanges`}\u001b[${39}m`} = ${JSON.stringify(finalRanges, null, 4)}`,
      );
    // run the last check, if any of the ranges span between
    // comma and opening curly bracket, extend the range left,
    // to include the comma.
    finalRanges = finalRanges.map((range) => {
      DEV &&
        console.log(
          `4177 ███████████████████████████████████████ processing: ${JSON.stringify(range, null, 4)}`,
        );
      let charOnTheLeft = left(str, range[0]);
      let charOnTheRight = right(str, range[1] - 1);
      // ^ this right(.. - 1) will step left, then march right until it meets the first
      // non-whitespace character. This is insurance against the case when range
      // ending is on whitespace character. Otherwise, we could just:
      // let charOnTheRight = range[1];

      if (
        typeof charOnTheLeft === "number" &&
        typeof charOnTheRight === "number" &&
        !range[2]?.trim() // something's being added
      ) {
        DEV &&
          console.log(
            `4193 range[2]=${JSON.stringify(range[2])} charOnTheLeft = ${str[charOnTheLeft || 0]}(${charOnTheLeft}); charOnTheRight = ${str[charOnTheRight || 0]}(${charOnTheRight})`,
          );

        if (str[charOnTheLeft] === "," && str[charOnTheRight] === "{") {
          DEV &&
            console.log(
              `4199 ${`\u001b[${31}m${`CHANGED TO [${charOnTheLeft}, ${charOnTheRight}, ${JSON.stringify(range[2])}]`}\u001b[${39}m`}`,
            );
          return [charOnTheLeft, charOnTheRight, range[2]];
        }
      }
      return range;
    });
    DEV &&
      console.log(
        `4208 AFTER CLEANING, ${`\u001b[${33}m${`finalRanges`}\u001b[${39}m`} = ${JSON.stringify(finalRanges, null, 4)}`,
      );

    str = rApply(str, finalRanges);
    finalIndexesToDelete.wipe();
  }

  let startingPercentageDone =
    resolvedOpts.reportProgressFuncTo -
    (resolvedOpts.reportProgressFuncTo - resolvedOpts.reportProgressFuncFrom) *
      leavePercForLastStage;
  DEV &&
    console.log(
      `4221 ${`\u001b[${33}m${`startingPercentageDone`}\u001b[${39}m`} = ${JSON.stringify(
        startingPercentageDone,
        null,
        4,
      )}`,
    );

  if (resolvedOpts.reportProgressFunc && len >= 2000) {
    // resolvedOpts.reportProgressFunc(95);
    currentPercentageDone = Math.floor(
      startingPercentageDone +
        (resolvedOpts.reportProgressFuncTo - startingPercentageDone) / 5, // * 1
    );
    if (currentPercentageDone !== lastPercentage) {
      lastPercentage = currentPercentageDone;
      resolvedOpts.reportProgressFunc(currentPercentageDone);
    }
  }
  DEV && console.log("\n\n");
  DEV && console.log(`4240 string after ROUND 3:\n${str}\n\n`);

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
  if (resolvedOpts.reportProgressFunc && len >= 2000) {
    // resolvedOpts.reportProgressFunc(96);
    currentPercentageDone = Math.floor(
      startingPercentageDone +
        ((resolvedOpts.reportProgressFuncTo - startingPercentageDone) / 5) * 2,
    );
    if (currentPercentageDone !== lastPercentage) {
      lastPercentage = currentPercentageDone;
      resolvedOpts.reportProgressFunc(currentPercentageDone);
    }
  }

  // remove empty style tags:
  str = str.replace(regexEmptyStyleTag, trailingNewline || "\n");
  totalCounter += str.length;
  if (resolvedOpts.reportProgressFunc && len >= 2000) {
    // resolvedOpts.reportProgressFunc(97);
    currentPercentageDone = Math.floor(
      startingPercentageDone +
        ((resolvedOpts.reportProgressFuncTo - startingPercentageDone) / 5) * 3,
    );
    if (currentPercentageDone !== lastPercentage) {
      lastPercentage = currentPercentageDone;
      resolvedOpts.reportProgressFunc(currentPercentageDone);
    }
  }

  // remove empty Outlook conditional comments:
  let tempLen = str.length;
  str = str.replace(emptyCondCommentRegex(), "");
  totalCounter += str.length;
  if (tempLen !== str.length) {
    commentsLength += str.length - tempLen;
  }
  if (resolvedOpts.reportProgressFunc && len >= 2000) {
    // resolvedOpts.reportProgressFunc(98);
    currentPercentageDone = Math.floor(
      startingPercentageDone +
        ((resolvedOpts.reportProgressFuncTo - startingPercentageDone) / 5) * 4,
    );
    if (currentPercentageDone !== lastPercentage) {
      lastPercentage = currentPercentageDone;
      resolvedOpts.reportProgressFunc(currentPercentageDone);
    }
  }

  // minify, limit the line length
  str = crush(str, resolvedOpts.htmlCrushOpts).result;

  if (tempLen !== str.length) {
    nonIndentationsWhitespaceLength += str.length - tempLen;
  }
  totalCounter += str.length;
  if (resolvedOpts.reportProgressFunc && len >= 2000) {
    // resolvedOpts.reportProgressFunc(99);
    currentPercentageDone = Math.floor(
      startingPercentageDone +
        (resolvedOpts.reportProgressFuncTo - startingPercentageDone),
    );
    if (currentPercentageDone !== lastPercentage) {
      lastPercentage = currentPercentageDone;
      resolvedOpts.reportProgressFunc(currentPercentageDone);
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

  DEV &&
    console.log(
      `4331 ${`\u001b[${33}m${`allClassesAndIdsWithinHeadFinal`}\u001b[${39}m`} = ${JSON.stringify(
        allClassesAndIdsWithinHeadFinal,
        null,
        4,
      )}`,
    );

  // remove first character, space, inside classes/id's - it might
  // be a leftover after class/id removal
  str = str.replace(/ ((class|id)=["']) /g, " $1");

  return {
    log: {
      timeTakenInMilliseconds: Date.now() - start,
      traversedTotalCharacters: totalCounter,
      traversedTimesInputLength: len
        ? Math.round((totalCounter / originalLength) * 100) / 100
        : 0,
      originalLength,
      cleanedLength: str.length,
      bytesSaved: Math.max(originalLength - str.length, 0),
      percentageReducedOfOriginal: len
        ? Math.round(
            (Math.max(originalLength - str.length, 0) * 100) / originalLength,
          )
        : 0,
      nonIndentationsWhitespaceLength: Math.max(
        nonIndentationsWhitespaceLength - trailingLinebreakLengthCorrection,
        0,
      ),
      nonIndentationsTakeUpPercentageOfOriginal:
        len &&
        Math.max(
          nonIndentationsWhitespaceLength - trailingLinebreakLengthCorrection,
          0,
        )
          ? Math.round(
              (Math.max(nonIndentationsWhitespaceLength, 0) * 100) /
                originalLength,
            )
          : 0,
      commentsLength,
      commentsTakeUpPercentageOfOriginal:
        len && commentsLength
          ? Math.round((commentsLength * 100) / originalLength)
          : 0,
      uglified,
    },
    result: str,
    countAfterCleaning,
    countBeforeCleaning,
    allInHead: allClassesAndIdsWithinHead.sort(compareFn),
    allInBody: allClassesAndIdsWithinBody.sort(compareFn),
    deletedFromHead: headCssToDelete.sort(compareFn),
    deletedFromBody: bodyCssToDelete.sort(compareFn),
  };
}

export { comb, defaults, version };
