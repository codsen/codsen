import { matchRightIncl, matchRight, matchLeft } from "string-match-left-right";
import emptyCondCommentRegex from "regex-empty-conditional-comments";
import pullAllWithGlob from "array-pull-all-with-glob";
import extract from "string-extract-class-names";
import intersection from "lodash.intersection";
import expander from "string-range-expander";
import { generateShortname } from "./util";
import isObj from "lodash.isplainobject";
import applySlices from "ranges-apply";
import pullAll from "lodash.pullall";
import isEmpty from "ast-is-empty";
import Slices from "ranges-push";
import uniq from "lodash.uniq";
import matcher from "matcher";
const isArr = Array.isArray;

function comb(str, opts) {
  const start = Date.now();
  const finalIndexesToDelete = new Slices({ limitToBeAddedWhitespace: true });
  const currentChunksMinifiedSelectors = new Slices();
  const lineBreaksToDelete = new Slices();

  // TODO: badChars is also used, maybe characterSuitableForNames() is redundant?
  function characterSuitableForNames(char) {
    return /[-_A-Za-z0-9]/.test(char); // notice, there's no dot or hash!
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
  function resetBodyClassOrId(initObj = {}) {
    return Object.assign(
      {
        valuesStart: null,
        valueStart: null,
        nameStart: null
      },
      initObj
    );
  }

  let i;
  let prevailingEOL;

  let styleStartedAt;
  let styleEndedAt;

  let styleAttributeStartedAt;
  const headSelectorsArr = [];
  const bodyClassesArr = [];
  const bodyIdsArr = [];
  // const selectorsRemovedDuringRoundOne = [];

  let commentStartedAt;
  let commentNearlyStartedAt;
  let bodyStartedAt;
  let bodyClass;
  let bodyId;

  const headSelectorsCount = {};

  // for each single character traversed on any FOR loop, we increment this counter:
  let totalCounter = 0;
  let selectorSinceLinebreakDetected;
  let checkingInsideCurlyBraces;
  let insideCurlyBraces;
  let beingCurrentlyAt;

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
  let headSelectorChunkStartedAt;

  // flag used to mark can the selector chunk be deleted (in Round 2 only)
  let selectorChunkCanBeDeleted = false;

  //               ALSO,

  //       <style type="text/css">
  //         .unused1[z].unused2, .used[z] {a:1;}
  //         |         |
  //         | single  |
  //    ---> | selector| <---

  let singleSelectorStartedAt;

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

  const regexEmptyStyleTag = /[\n]?\s*<style[^>]*>\s*<\/style\s*>/g;
  const regexEmptyMediaQuery = /[\n]?\s*@(media|supports|document)[^{]*{\s*}/g;

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
    "page"
  ];

  const atRuleBreakCharacters = ["{", "(", "<", '"', "'", "@", ";"];

  // insurance
  if (typeof str !== "string") {
    throw new TypeError(
      `email-remove-unused-css: [THROW_ID_01] Input must be string! Currently it's ${typeof str}`
    );
  }
  if (!isObj(opts)) {
    if (opts === undefined || opts === null) {
      opts = {};
    } else {
      throw new TypeError(
        `email-remove-unused-css: [THROW_ID_02] Options, second input argument, must be a plain object! Currently it's ${typeof opts}, equal to: ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
    }
  }
  // arrayiffy if string:
  if (isStr(opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains)) {
    if (opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.length) {
      opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains = [
        opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains
      ];
    } else {
      opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains = [];
    }
  }

  // checking opts
  const defaults = {
    whitelist: [],
    backend: [], // pass the ESP head & tail sets as separate objects inside this array
    uglify: false,
    removeHTMLComments: true,
    doNotRemoveHTMLCommentsWhoseOpeningTagContains: ["[if", "[endif"]
  };
  if (isObj(opts) && hasOwnProp(opts, "backend") && isEmpty(opts.backend)) {
    opts.backend = [];
  }
  opts = Object.assign({}, defaults, opts);
  // sweeping:
  if (isStr(opts.whitelist)) {
    opts.whitelist = [opts.whitelist];
  }
  // throws:
  if (!isArr(opts.whitelist)) {
    throw new TypeError(
      `email-remove-unused-css: [THROW_ID_03] opts.whitelist should be an array, but it was customised to a wrong thing, ${JSON.stringify(
        opts.whitelist,
        null,
        4
      )}`
    );
  }
  if (opts.whitelist.length > 0 && !opts.whitelist.every(el => isStr(el))) {
    throw new TypeError(
      `email-remove-unused-css: [THROW_ID_04] opts.whitelist array should contain only string-type elements. Currently we\ve got:\n${JSON.stringify(
        opts.whitelist,
        null,
        4
      )}`
    );
  }
  if (!isArr(opts.backend)) {
    throw new TypeError(
      `email-remove-unused-css: [THROW_ID_05] opts.backend should be an array, but it was customised to a wrong thing, ${JSON.stringify(
        opts.backend,
        null,
        4
      )}`
    );
  }
  if (opts.backend.length > 0 && opts.backend.some(val => !isObj(val))) {
    throw new TypeError(
      `email-remove-unused-css: [THROW_ID_06] opts.backend array should contain only plain objects but it contains something else:\n${JSON.stringify(
        opts.backend,
        null,
        4
      )}`
    );
  }
  if (
    opts.backend.length > 0 &&
    !opts.backend.every(
      obj => hasOwnProp(obj, "heads") && hasOwnProp(obj, "tails")
    )
  ) {
    throw new TypeError(
      `email-remove-unused-css: [THROW_ID_07] every object within opts.backend should contain keys "heads" and "tails" but currently it's not the case. Whole "opts.backend" value array is currently equal to:\n${JSON.stringify(
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
        `email-remove-unused-css: [THROW_ID_08] opts.uglify should be a Boolean. Currently it's set to: ${JSON.stringify(
          opts.uglify,
          null,
          4
        )}}`
      );
    }
  }

  let allHeads = null;
  let allTails = null;

  if (isArr(opts.backend) && opts.backend.length) {
    allHeads = opts.backend.map(headsAndTailsObj => headsAndTailsObj.heads);
    allTails = opts.backend.map(headsAndTailsObj => headsAndTailsObj.tails);
  }

  const len = str.length;
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

  let allClassesAndIdsThatWereCompletelyDeletedFromHead;
  let allClassesAndIdsWithinHeadFinal;
  let allClassesAndIdsWithinHead;
  let allClassesAndIdsWithinBody;
  let headSelectorsCountClone;
  let stateWithinHeadStyles;
  let currentlyWithinQuotes;
  let whitespaceStartedAt;
  let bodyClassesToDelete;
  let stateWithinBody;
  let bodyIdsToDelete;
  let bodyCssToDelete;
  let headCssToDelete;
  let currentChunk;
  let canDelete;
  let usedOnce;

  // ---------------------------------------------------------------------------

  // Calculate the prevailing line ending sign: is it \r, \n or \r\n?
  const endingsCount = {
    n: 0,
    r: 0,
    rn: 0
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
      console.log(`\n\n\n\n\n\n\n
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
      console.log(`\n\n\n\n\n\n\n
                                                         222222222222222
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
    stateWithinHeadStyles = false;
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
    stepouter: for (i = 0; i < len; i++) {
      // logging:
      if (round === 2) {
        console.log(
          `${`\u001b[${39}m${`---${`\u001b[${32}m ${round} \u001b[${39}m`}-----------------------`}\u001b[${36}m`} str[${`\u001b[${35}m${i}\u001b[${39}m`}] = ${
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

      const chr = str[i];

      // count line endings:
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

      if (
        stateWithinHeadStyles !== true &&
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
        console.log(`538 activate "stateWithinHeadStyles" state`);
        console.log(
          `540 ${`\u001b[${33}m${`styleStartedAt`}\u001b[${39}m`} = ${JSON.stringify(
            styleStartedAt,
            null,
            4
          )}`
        );
        console.log(
          `547 ${`\u001b[${33}m${`styleEndedAt`}\u001b[${39}m`} = ${JSON.stringify(
            styleEndedAt,
            null,
            4
          )}`
        );

        // ---------------------------------------------------------------------

        stateWithinHeadStyles = true;
        stateWithinBody = false;
      } else if (
        stateWithinBody !== true &&
        bodyStartedAt !== null &&
        (styleStartedAt === null || styleStartedAt < i) &&
        (styleEndedAt === null || styleEndedAt < i)
      ) {
        console.log(
          `565 activate "stateWithinBody" state (stateWithinBody was previously ${stateWithinBody})`
        );
        stateWithinBody = true;
        stateWithinHeadStyles = false;
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
        if (insideCurlyBraces) {
          // head bits to catch being within quotes in head styles
          if (!currentlyWithinQuotes) {
            currentlyWithinQuotes = str[i];
          } else {
            currentlyWithinQuotes = null;
          }
          console.log(
            `606 SET ${`\u001b[${33}m${`currentlyWithinQuotes`}\u001b[${39}m`} = ${currentlyWithinQuotes}`
          );
        } else if (stateWithinBody) {
          // body: quotes in attributes
          if (styleAttributeStartedAt !== null && styleAttributeStartedAt < i) {
            styleAttributeStartedAt = null;
            console.log(
              `613 ${`\u001b[${31}m${`██`}\u001b[${39}m`} SET ${`\u001b[${33}m${`styleAttributeStartedAt`}\u001b[${39}m`} = null`
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
          (typeof doNothingUntil === "string" && doNothingUntil.length === 0)
        ) {
          // it's some bad case scenario/bug, just turn off the "doNothing"
          console.log(
            `\u001b[${31}m${`629 something went wrong, doNothing is truthy but doNothingUntil is not set! Turning off doNothing back to false.`}\u001b[${39}m`
          );
          doNothing = false;
          // just turn it off and move on.
        } else if (matchRightIncl(str, i, doNothingUntil)) {
          console.log(`634 doNothingUntil="${doNothingUntil}" MATCHED`);
          // Normally doNothingUntil is a single character.
          // However, when matching back-end characters, it can be multiple chars.
          // That's why above we can't compare with '===' and need the
          // "string-match-left-right" library.

          // 1. COMMENTS-RELATED SKIPS ARE TENDED SEPARATELY:
          if (commentStartedAt !== null) {
            // submit the comment characters range for deletion:

            // logging:
            console.log(`645`);

            if (round === 1) {
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
              if (lineBreakPresentOnTheLeft) {
                startingIndex -= lineBreakPresentOnTheLeft.length;
                console.log(
                  `664 NEW \u001b[${33}m${`startingIndex`}\u001b[${39}m = ${startingIndex}`
                );
              }
              if (
                str[startingIndex - 1] &&
                characterSuitableForNames(str[startingIndex - 1]) &&
                str[i + doNothingUntil.length] &&
                characterSuitableForNames(str[i + doNothingUntil.length])
              ) {
                console.log(
                  `674 PUSH [${startingIndex}, ${i +
                    doNothingUntil.length}, ";"]`
                );
                finalIndexesToDelete.push(
                  startingIndex,
                  i + doNothingUntil.length,
                  ";"
                );
                commentsLength += i + doNothingUntil.length - startingIndex;
              } else {
                console.log(
                  `685 PUSH [${startingIndex}, ${i + doNothingUntil.length}]`
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
              `696 SET ${`\u001b[${33}m${`commentStartedAt`}\u001b[${39}m`} = ${commentStartedAt}`
            );
          }

          // 2. ALL OTHER CASES OF "DO-NOTHING":

          // offset the index:
          i = i + doNothingUntil.length - 1;
          console.log(`704 AFTER OFFSET, THE NEW i IS NOW: ${i}`);

          // Switch off the mode
          doNothingUntil = null;
          console.log(
            `709 SET ${`\u001b[${33}m${`doNothingUntil`}\u001b[${39}m`} = ${doNothingUntil}`
          );
          doNothing = false;
          console.log(
            `713 SET ${`\u001b[${33}m${`doNothing`}\u001b[${39}m`} = ${doNothing}, then step out`
          );
          continue stepouter;
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
          `732 SET ${`\u001b[${33}m${`checkingInsideCurlyBraces`}\u001b[${39}m`} = ${checkingInsideCurlyBraces}`
        );

        console.log(`735 \u001b[${36}m${`\n * style tag begins`}\u001b[${39}m`);
        console.log(
          `737 \u001b[${36}m${`\n marching forward until ">":`}\u001b[${39}m`
        );
        for (let y = i; y < len; y++) {
          totalCounter++;
          console.log(
            `742 \u001b[${36}m${`str[i=${y}]=${str[y]}`}\u001b[${39}m`
          );
          if (str[y] === ">") {
            console.log(
              `746 \u001b[${36}m${` > found, stopping`}\u001b[${39}m`
            );
            styleStartedAt = y + 1;
            ruleChunkStartedAt = y + 1;
            console.log(
              `751 SET ${`\u001b[${33}m${`styleStartedAt`}\u001b[${39}m`} = ${styleStartedAt}; SET ${`\u001b[${33}m${`ruleChunkStartedAt`}\u001b[${39}m`} = ${ruleChunkStartedAt} THEN BREAK`
            );
            // We can offset the main index ("jump" to an already-traversed closing
            // closing bracket character of <style.....> tag because this tag
            // will not have any CLASS or ID attributes).
            // We would not do that with BODY tag for example.

            // Offset the index because we traversed it already:
            // i = y;
            console.log(
              `761 \u001b[${36}m${`stopped marching forward`}\u001b[${39}m`
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
        stateWithinHeadStyles &&
        str[i] === "<" &&
        str[i + 1] === "/" &&
        str[i + 2] === "s" &&
        str[i + 3] === "t" &&
        str[i + 4] === "y" &&
        str[i + 5] === "l" &&
        str[i + 6] === "e"
      ) {
        // TODO: take care of any spaces around: 1. slash; 2. brackets
        checkingInsideCurlyBraces = false;
        styleEndedAt = i - 1;
        console.log(
          `788 SET ${`\u001b[${33}m${`checkingInsideCurlyBraces`}\u001b[${39}m`} = ${checkingInsideCurlyBraces}`
        );
        console.log(
          `791 SET ${`\u001b[${33}m${`styleEndedAt`}\u001b[${39}m`} = ${styleEndedAt}`
        );

        // we don't need the chunk end tracking marker any more
        ruleChunkStartedAt = null;
      }

      // head/body: mark where style comments end - ROUND-1-only rule
      // ================
      if (
        round === 1 &&
        commentStartedAt !== null &&
        str[i] === "*" &&
        str[i + 1] === "/"
      ) {
        let deleteUpTo = i + 2;
        if (
          str[i + 2] === "\n" ||
          (str[i + 2] === "\r" && str[i + 3] !== "\n")
        ) {
          deleteUpTo = i + 3;
        } else if (str[i + 2] === "\r" && str[i + 3] === "\n") {
          deleteUpTo = i + 4;
        }

        // 1. instantly push this comment to be deleted
        const calculatedRange = expander({
          str,
          from: commentStartedAt,
          to: deleteUpTo,
          wipeAllWhitespaceOnLeft: true
        });
        console.log(
          `824 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
            calculatedRange,
            null,
            0
          )} - that's slice: "${str.slice(...calculatedRange)}"`
        );
        finalIndexesToDelete.push(...calculatedRange);

        // 2. reset the marker
        commentStartedAt = null;
        console.log(
          `835 SET ${`\u001b[${33}m${`commentStartedAt`}\u001b[${39}m`} = null`
        );

        // 3. reset global flip switch doNothing
        doNothing = false;
        console.log(
          `841 SET ${`\u001b[${33}m${`doNothing`}\u001b[${39}m`} = false`
        );
      }

      // mark where CSS comments start - ROUND 1-only rule
      // ================
      if (
        round === 1 &&
        (stateWithinHeadStyles || stateWithinBody) &&
        str[i] === "/" &&
        str[i + 1] === "*" &&
        !commentStartedAt
      ) {
        // 1. mark the beginning
        commentStartedAt = i;
        console.log(
          `857 SET ${`\u001b[${33}m${`commentStartedAt`}\u001b[${39}m`} = ${i}`
        );

        // 2. activate doNothing:
        doNothing = true;
        console.log(
          `863 SET ${`\u001b[${33}m${`doNothing`}\u001b[${39}m`} = true`
        );
        doNothingUntil = "*/";

        // just over the "*":
        i++;
        continue stepouter;
      }

      // pinpoint "@"
      if (!doNothing && stateWithinHeadStyles && str[i] === "@") {
        console.log(`874 (i=${i})`);
        // since we are going to march forward, rest the whitespaceStartedAt
        // marker since it might not get reset otherwise
        if (whitespaceStartedAt) {
          whitespaceStartedAt = null;
        }

        const matchedAtTagsName =
          matchRight(str, i, atRulesWhichMightWrapStyles) ||
          matchRight(str, i, atRulesWhichNeedToBeIgnored);
        if (matchedAtTagsName) {
          console.log(`885 @${matchedAtTagsName} detected`);
          let temp;

          // rare case when semicolon follows the at-tag - in that
          // case, we remove the at-rule because it's broken
          if (
            str[i + matchedAtTagsName.length + 1] === ";" ||
            (str[i + matchedAtTagsName.length + 1] &&
              !str[i + matchedAtTagsName.length + 1].trim().length &&
              matchRight(str, i + matchedAtTagsName.length + 1, ";", {
                trimBeforeMatching: true,
                cb: (char, theRemainderOfTheString, index) => {
                  temp = index;
                  return true;
                }
              }))
          ) {
            console.log(`902 BLANK AT-RULE DETECTED`);
            finalIndexesToDelete.push(
              i,
              temp ? temp : i + matchedAtTagsName.length + 2
            );
          }

          // these can wrap styles and each other and their pesky curlies can throw
          // our algorithm off-track. We need to jump past the chunk from "@..."
          // to, and including, first curly bracket. But mind the dirty code cases.

          let secondaryStopper;
          console.log("\n");
          console.log(
            `916 \u001b[${36}m${`march forward`}\u001b[${39}m:\n-----`
          );

          for (let z = i + 1; z < len; z++) {
            totalCounter++;
            console.log(
              `922 \u001b[${36}m${`str[${z}] = ${
                str[z]
              }`}\u001b[${39}m; ${`\u001b[${33}m${`secondaryStopper`}\u001b[${39}m`} = ${secondaryStopper}`
            );

            // ------------------------------------------------------------------

            // a secondary stopper is any character which must be matched with its
            // closing counterpart before anything continues. For example, we look
            // for semicolon. On the way, we encounter an opening bracket. Now,
            // we must march forward until we meet closing bracket. If, in the way,
            // we encounter semicolon, it will be ignored, only closing bracket is
            // what we look. When it is found, THEN continue looking for (new) semicolon.

            // catch the ending of a secondary stopper
            if (secondaryStopper && str[z] === secondaryStopper) {
              console.log(
                `939 \u001b[${36}m${`atRulesWhichNeedToBeIgnored = ${JSON.stringify(
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
                  `957 ! SET \u001b[${31}m${`i = ${i}`}\u001b[${39}m - THEN, STEP OUT`
                );
                ruleChunkStartedAt = z + 1;
                console.log(
                  `961 SET ${`\u001b[${33}m${`ruleChunkStartedAt`}\u001b[${39}m`} = ${ruleChunkStartedAt}`
                );
                continue stepouter;
              } else {
                secondaryStopper = undefined;
                console.log(
                  `---- 967 SET \u001b[${35}m${`secondaryStopper`}\u001b[${39}m = undefined`
                );
                continue;
                // continue stepouter;
              }
            }

            // set the seconddary stopper
            if (str[z] === '"' && !secondaryStopper) {
              secondaryStopper = '"';
              console.log(
                `978 SET \u001b[${35}m${`secondaryStopper`}\u001b[${39}m = ${secondaryStopper}`
              );
            } else if (str[z] === "'" && !secondaryStopper) {
              secondaryStopper = "'";
              console.log(
                `983 SET \u001b[${35}m${`secondaryStopper`}\u001b[${39}m = ${secondaryStopper}`
              );
            } else if (str[z] === "(" && !secondaryStopper) {
              secondaryStopper = ")";
              console.log(
                `988 SET \u001b[${35}m${`secondaryStopper`}\u001b[${39}m = ${secondaryStopper}`
              );
            } else if (
              atRulesWhichNeedToBeIgnored.includes(matchedAtTagsName) &&
              str[z] === "{" &&
              !secondaryStopper
            ) {
              secondaryStopper = "}";
              console.log(
                `997 SET \u001b[${35}m${`secondaryStopper`}\u001b[${39}m = ${secondaryStopper}`
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
                `1011 AT-RULE BREAK CHAR: index=${z}, value="${str[z]}"`
              );

              // bail out clauses
              console.log(
                `1016 \u001b[${31}m${`███████████████████████████████████████`}\u001b[${39}m`
              );
              let pushRangeFrom;
              let pushRangeTo;

              // normal cases:
              if (str[z] === "{" || str[z] === ";") {
                insideCurlyBraces = false;
                ruleChunkStartedAt = z + 1;
                console.log(
                  `1026 SET ${`\u001b[${33}m${`insideCurlyBraces`}\u001b[${39}m`} = false; ${`\u001b[${33}m${`ruleChunkStartedAt`}\u001b[${39}m`} = ${ruleChunkStartedAt}; THEN STEP OUT`
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
                    `1041 BROKEN AT-RULE DETECTED, pushing [${pushRangeFrom}, ${pushRangeTo}] = "${str.slice(
                      pushRangeFrom,
                      pushRangeTo
                    )}" THEN STEP OUT`
                  );
                  finalIndexesToDelete.push(pushRangeFrom, pushRangeTo);
                }
              }
              console.log(
                `1050 ${`\u001b[${33}m${`pushRangeTo`}\u001b[${39}m`} = ${pushRangeTo}; ${`\u001b[${33}m${`z`}\u001b[${39}m`} = ${z}`
              );
              const iOffset = pushRangeTo
                ? pushRangeTo - 1
                : z - 1 + (str[z] === "{" ? 1 : 0);
              console.log(
                `1056 ${`\u001b[${33}m${`iOffset`}\u001b[${39}m`} = ${iOffset}`
              );
              console.log(
                `1059 ! SET \u001b[${31}m${`i = ${iOffset}; ruleChunkStartedAt = ${iOffset +
                  1};`}\u001b[${39}m - THEN, STEP OUT.`
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
        stateWithinHeadStyles &&
        insideCurlyBraces &&
        checkingInsideCurlyBraces &&
        chr === "}" &&
        !currentlyWithinQuotes
      ) {
        insideCurlyBraces = false;
        console.log(
          `1082 SET ${`\u001b[${33}m${`insideCurlyBraces`}\u001b[${39}m`} = false`
        );

        console.log(
          `1086 FIY, \u001b[${31}m${`headWholeLineCanBeDeleted = ${headWholeLineCanBeDeleted}`}\u001b[${39}m; \u001b[${31}m${`lastKeptChunksCommaAt = ${lastKeptChunksCommaAt}`}\u001b[${39}m; \u001b[${31}m${`onlyDeletedChunksFollow = ${onlyDeletedChunksFollow}`}\u001b[${39}m
            `
        );
        // submit whole chunk for deletion if applicable:
        if (round === 2 && headWholeLineCanBeDeleted && ruleChunkStartedAt) {
          finalIndexesToDelete.push(ruleChunkStartedAt, i + 1);
          console.log(
            `1093 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${ruleChunkStartedAt}, ${i +
              1}]; finalIndexesToDelete now = ${JSON.stringify(
              finalIndexesToDelete,
              null,
              4
            )}`
          );
        }

        if (ruleChunkStartedAt) {
          ruleChunkStartedAt = i + 1;
          console.log(
            `1105 SET ${`\u001b[${33}m${`ruleChunkStartedAt`}\u001b[${39}m`} = ${ruleChunkStartedAt}`
          );
        }

        // reset headSelectorChunkStartedAt:
        headSelectorChunkStartedAt = null;
        selectorChunkCanBeDeleted = false;
        headWholeLineCanBeDeleted = true;
        singleSelectorStartedAt = null;
        lastKeptChunksCommaAt = null;
        onlyDeletedChunksFollow = false;

        console.log(
          `1118 RESET: ${`\u001b[${33}m${`headSelectorChunkStartedAt`}\u001b[${39}m`} = null; ${`\u001b[${33}m${`singleSelectorStartedAt`}\u001b[${39}m`} = null; ${`\u001b[${33}m${`headWholeLineCanBeDeleted`}\u001b[${39}m`} = true;
          ${`\u001b[${33}m${`selectorChunkCanBeDeleted`}\u001b[${39}m`} = false;
          ${`\u001b[${33}m${`lastKeptChunksCommaAt`}\u001b[${39}m`} = null;
          ${`\u001b[${33}m${`onlyDeletedChunksFollow`}\u001b[${39}m`} = false;`
        );
      }

      // catch the beginning/ending of CSS selectors in head
      // ================

      // markers we'll be dealing with:
      // * headSelectorChunkStartedAt
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
        // it's closing yet:
        ((styleEndedAt === null && i >= styleStartedAt) ||
          // b) or, style tag was closed, later another-one was opened and we
          // haven't traversed through its closing tag yet:
          (styleStartedAt > styleEndedAt && styleStartedAt < i)) &&
        i >= beingCurrentlyAt &&
        !insideCurlyBraces
      ) {
        // TODO: skip all false positive characters within quotes, like curlies

        // PART 1.

        // catch the singleSelectors (for example, "#head-only-id-2")
        // any character, not permitted in CSS class/id names stops the recording
        if (singleSelectorStartedAt === null) {
          // catch the start of a single
          if (chr === "." || chr === "#") {
            singleSelectorStartedAt = i;
            console.log(
              `1160 ${`\u001b[${33}m${`singleSelectorStartedAt`}\u001b[${39}m`} = ${singleSelectorStartedAt}`
            );
          } else if (chr.trim().length !== 0) {
            // logging:
            // console.log("1164 ██");
            if (chr === "}") {
              ruleChunkStartedAt = i + 1;
              currentChunk = null;
              console.log(
                `1169 SET ${`\u001b[${33}m${`ruleChunkStartedAt`}\u001b[${39}m`} = ${i +
                  1}; ${`\u001b[${33}m${`currentChunk`}\u001b[${39}m`} = null;`
              );
            } else if (chr === "<" && str[i + 1] === "!") {
              // catch comment blocks, probably Outlook conditional comments
              // like <!--[if mso]>
              console.log(
                `1176 \u001b[${36}m${`conditional comment detected, traverse forward`}\u001b[${39}m`
              );
              for (let y = i; y < len; y++) {
                totalCounter++;
                console.log(
                  `\u001b[${36}m${`-----str[${y}]=${str[y]}`}\u001b[${39}m`
                );
                if (str[y] === ">") {
                  ruleChunkStartedAt = y + 1;
                  headSelectorChunkStartedAt = y + 1;
                  console.log(
                    `\u001b[${36}m${`1187 ruleChunkStartedAt=${ruleChunkStartedAt}`}\u001b[${39}m; \u001b[${36}m${`headSelectorChunkStartedAt=${headSelectorChunkStartedAt}`}\u001b[${39}m; THEN BREAK`
                  );
                  i = y;
                  continue stepouter;
                }
              }
            }
          }
        } else {
          // catch the ending of a single
          if (
            singleSelectorStartedAt !== null &&
            !characterSuitableForNames(chr)
          ) {
            const singleSelector = str.slice(singleSelectorStartedAt, i);
            console.log(
              `1203 CARVED OUT A SINGLE SELECTOR'S NAME: "\u001b[${32}m${singleSelector}\u001b[${39}m"`
            );

            if (
              round === 2 &&
              !selectorChunkCanBeDeleted &&
              headCssToDelete.includes(singleSelector)
            ) {
              selectorChunkCanBeDeleted = true;
              console.log(
                `1213 SET selectorChunkCanBeDeleted = true - ${`\u001b[${31}m${`CHUNK CAN BE DELETED`}\u001b[${39}m`}`
              );
              onlyDeletedChunksFollow = true;
              console.log(
                `1217 SET ${`\u001b[${33}m${`onlyDeletedChunksFollow`}\u001b[${39}m`} = true`
              );
            } else if (round === 2 && !selectorChunkCanBeDeleted) {
              console.log(
                `1221 ${`\u001b[${32}m${`BTW, THIS CHUNK MIGHT NOT BE DELETED`}\u001b[${39}m`}`
              );
              console.log(
                `1224 ${`\u001b[${33}m${`opts.whitelist`}\u001b[${39}m`} = ${JSON.stringify(
                  opts.whitelist,
                  null,
                  4
                )}`
              );
              // 1. uglify part
              if (
                opts.uglify &&
                (!isArr(opts.whitelist) ||
                  !opts.whitelist.length ||
                  !matcher([singleSelector], opts.whitelist).length) &&
                isStr(
                  generateShortname(
                    allClassesAndIdsWithinHeadFinal.indexOf(singleSelector)
                  )
                )
              ) {
                console.log(
                  `1243 ${`\u001b[${31}m${`PUSH [${singleSelectorStartedAt +
                    1}, ${i}, ${generateShortname(
                    allClassesAndIdsWithinHeadFinal.indexOf(singleSelector)
                  )}]`}\u001b[${39}m`}`
                );
                currentChunksMinifiedSelectors.push(
                  singleSelectorStartedAt + 1,
                  i,
                  generateShortname(
                    allClassesAndIdsWithinHeadFinal.indexOf(singleSelector)
                  )
                );
              }
              // 2. tend trailing comma issue (lastKeptChunksCommaAt and
              // onlyDeletedChunksFollow):
              if (chr === ",") {
                lastKeptChunksCommaAt = i;
                onlyDeletedChunksFollow = false;
                console.log(
                  `1262 SET ${`\u001b[${33}m${`lastKeptChunksCommaAt`}\u001b[${39}m`} = ${lastKeptChunksCommaAt}; ${`\u001b[${33}m${`onlyDeletedChunksFollow`}\u001b[${39}m`} = ${onlyDeletedChunksFollow};`
                );
              } else {
                // IF it's whitespace, traverse forward, look for comma
              }
            }

            if (chr === "." || chr === "#") {
              singleSelectorStartedAt = i;
              console.log(
                `1272 ${`\u001b[${33}m${`singleSelectorStartedAt`}\u001b[${39}m`} = ${singleSelectorStartedAt}`
              );
            } else {
              singleSelectorStartedAt = null;
              console.log(`1276 WIPE singleSelectorStartedAt = null`);
            }
          }
        }

        // PART 2.

        // catch the selectorChunks (for example, #head-only-id-2.real-class-1[lang|en]):
        // only opening curly brace or comma stops the recording.
        if (headSelectorChunkStartedAt === null) {
          // catch the start of a chunk
          // if (chr === "." || chr === "#") {
          if (
            chr.trim().length !== 0 &&
            chr !== "}" &&
            chr !== ";" &&
            !(str[i] === "/" && str[i + 1] === "*")
          ) {
            // reset the deletion flag:
            selectorChunkCanBeDeleted = false;
            console.log(
              `1297 ${`\u001b[${33}m${`selectorChunkCanBeDeleted`}\u001b[${39}m`} = ${selectorChunkCanBeDeleted}`
            );

            // set the chunk's starting marker:
            headSelectorChunkStartedAt = i;
            console.log(
              `1303 ${`\u001b[${33}m${`headSelectorChunkStartedAt`}\u001b[${39}m`} = ${headSelectorChunkStartedAt}`
            );
          }
        } else {
          // catch the ending of a chunk
          if (",{".includes(chr)) {
            const sliceTo = whitespaceStartedAt ? whitespaceStartedAt : i;
            currentChunk = str.slice(headSelectorChunkStartedAt, sliceTo);
            console.log(
              `1312 ${`\u001b[${33}m${`currentChunk`}\u001b[${39}m`} = ${JSON.stringify(
                currentChunk,
                null,
                0
              )} (sliced [${headSelectorChunkStartedAt}, ${sliceTo}])`
            );
            if (round === 1) {
              // delete whitespace in front of commas or more than two spaces
              // in front of opening curly braces:
              if (whitespaceStartedAt) {
                if (chr === "," && whitespaceStartedAt < i) {
                  finalIndexesToDelete.push(whitespaceStartedAt, i);
                  console.log(
                    `1325 PUSH WHITESPACE [${whitespaceStartedAt}, ${i}]`
                  );
                  nonIndentationsWhitespaceLength += i - whitespaceStartedAt;
                } else if (chr === "{" && whitespaceStartedAt < i - 1) {
                  finalIndexesToDelete.push(whitespaceStartedAt, i - 1);
                  console.log(
                    `1331 PUSH WHITESPACE [${whitespaceStartedAt}, ${i - 1}]`
                  );
                  nonIndentationsWhitespaceLength +=
                    i - 1 - whitespaceStartedAt;
                }
              }

              headSelectorsArr.push(currentChunk);
              console.log(
                `1340 PUSH CHUNK "${`\u001b[${32}m${currentChunk}\u001b[${39}m`}" to headSelectorsArr which is now = ${JSON.stringify(
                  headSelectorsArr,
                  null,
                  0
                )}`
              );
            } else {
              // it's round 2
              if (selectorChunkCanBeDeleted) {
                let fromIndex = headSelectorChunkStartedAt;
                let toIndex = i;
                console.log(
                  `1352 STARTING ${`\u001b[${33}m${`fromIndex`}\u001b[${39}m`} = ${fromIndex}`
                );
                let tempFindingIndex;
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
                    `1369 \u001b[${36}m${`traverse backwards`}\u001b[${39}m`
                  );
                  for (let y = headSelectorChunkStartedAt; y--; ) {
                    totalCounter++;
                    console.log(
                      `\u001b[${36}m${`----- str[${y}]=${str[y]}`}\u001b[${39}m`
                    );
                    if (str[y].trim().length !== 0 && str[y] !== ",") {
                      fromIndex = y + 1;
                      break;
                    }
                  }
                  console.log(
                    `1382 SET ${`\u001b[${33}m${`fromIndex`}\u001b[${39}m`} = ${JSON.stringify(
                      fromIndex,
                      null,
                      4
                    )}`
                  );

                  // 2. if we're on the opening curly brace currently and there's
                  // a space in front of it, we need to go back by 1 character
                  // to retain that single space in front of opening curly.
                  // Otherwise, we'd crop tightly up to curly which would be wrong.
                  if (str[i - 1].trim().length === 0) {
                    toIndex = i - 1;
                  }
                } else if (chr === "," && str[i + 1].trim().length === 0) {
                  for (let y = i + 1; y < len; y++) {
                    totalCounter++;
                    if (str[y].trim().length !== 0) {
                      toIndex = y;
                      break;
                    }
                  }
                } else if (
                  matchLeft(str, fromIndex, "{", {
                    trimBeforeMatching: true,
                    cb: (char, theRemainderOfTheString, index) => {
                      tempFindingIndex = index;
                      return true;
                    }
                  })
                ) {
                  fromIndex = tempFindingIndex + 2; // "1" being the length of
                  // the finding, the "{" then another + "1" to get to the right
                  // side of opening curly.
                }
                console.log(
                  `1418 ENDING ${`\u001b[${33}m${`fromIndex`}\u001b[${39}m`} = ${fromIndex}`
                );
                console.log(
                  `1421 ENDING ${`\u001b[${33}m${`toIndex`}\u001b[${39}m`} = ${toIndex}`
                );

                const resToPush = expander({
                  str,
                  from: fromIndex,
                  to: toIndex,
                  ifRightSideIncludesThisThenCropTightly: ".#",
                  ifRightSideIncludesThisCropItToo: ",",
                  extendToOneSide: "right"
                });
                console.log(
                  `1433 ${`\u001b[${33}m${`resToPush`}\u001b[${39}m`} = ${JSON.stringify(
                    resToPush,
                    null,
                    4
                  )}`
                );

                finalIndexesToDelete.push(...resToPush);
                console.log(
                  `1442 PUSH CHUNK ${JSON.stringify(resToPush, null, 0)}`
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
                    `1459 ${`\u001b[${32}m${`BTW, WHOLE LINE CAN'T BE DELETED NOW`}\u001b[${39}m`}`
                  );
                }

                // 2. reset onlyDeletedChunksFollow because this chunk was not
                // deleted, so this breaks the chain of "onlyDeletedChunksFollow"
                if (onlyDeletedChunksFollow) {
                  onlyDeletedChunksFollow = false;
                }

                // 2. tend uglification
                if (opts.uglify) {
                  console.log(
                    `1466 ${`\u001b[${31}m${`MERGE WITH FINAL INDEXES`}\u001b[${39}m`} - ${JSON.stringify(
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
            }

            // wipe the marker:
            if (chr !== "{") {
              headSelectorChunkStartedAt = null;
              console.log(
                `1484 WIPE ${`\u001b[${33}m${`headSelectorChunkStartedAt`}\u001b[${39}m`} = null`
              );
            } else if (round === 2) {
              // the last chunk was reached so let's evaluate, can we delete
              // the whole "row":

              console.log(
                `1491 ███████████████████████████████████████ ${`\u001b[${33}m${`headWholeLineCanBeDeleted`}\u001b[${39}m`} = ${headWholeLineCanBeDeleted}`
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
                    if (str[y].trim().length) {
                      deleteUpTo = y;
                      break;
                    }
                  }
                }

                finalIndexesToDelete.push(lastKeptChunksCommaAt, deleteUpTo);
                console.log(
                  `1514 PUSH COMMA [${lastKeptChunksCommaAt}, ${deleteUpTo}]`
                );

                // reset:
                lastKeptChunksCommaAt = null;
                onlyDeletedChunksFollow = false;
                console.log(
                  `1521 RESET: lastKeptChunksCommaAt = null; onlyDeletedChunksFollow = false;`
                );
              }
            }
          }
        }

        //
      } else if (selectorSinceLinebreakDetected) {
        // reset the "selectorSinceLinebreakDetected"
        selectorSinceLinebreakDetected = false;
        console.log(
          `1533 RESET ${`\u001b[${33}m${`selectorSinceLinebreakDetected`}\u001b[${39}m`} = false`
        );
      }

      // catch the closing body tag
      // ================
      if (
        !doNothing &&
        !stateWithinHeadStyles &&
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
          cb: (char, theRemainderOfTheString, index) => {
            // remove any whitespace after opening bracket of a body tag:
            if (round === 1) {
              if (char !== undefined && (char.trim() === "" || char === ">")) {
                if (index - i > 5) {
                  console.log(
                    `1565 ${`\u001b[${33}m${`PUSH`}\u001b[${39}m`} [${i}, ${index}, "<body"]`
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
          }
        })
      ) {
        // Find the ending of the body tag:
        console.log(
          `1585 \u001b[${36}m${`march forward to find the ending of the opening body tag:`}\u001b[${39}m`
        );
        for (let y = i; y < len; y++) {
          totalCounter++;
          if (str[y] === ">") {
            bodyStartedAt = y + 1;
            console.log(
              `1592 SET ${`\u001b[${33}m${`bodyStartedAt`}\u001b[${39}m`} = ${bodyStartedAt}, then BREAK`
            );
            // we can't offset the index because there might be unused classes
            // or id's on the body tag itself.
            break;
          }
        }
        console.log(
          `1600 \u001b[${36}m${`stop marching forward`}\u001b[${39}m`
        );
      }

      // catch the start of a style attribute within body
      // ================
      if (
        !doNothing &&
        stateWithinBody &&
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
            `1621 ${`\u001b[${33}m${`styleAttributeStartedAt`}\u001b[${39}m`} = ${styleAttributeStartedAt}`
          );
        }
      }

      // catch the start of a class attribute within body
      // ================
      if (
        !doNothing &&
        stateWithinBody &&
        str[i] === "c" &&
        str[i + 1] === "l" &&
        str[i + 2] === "a" &&
        str[i + 3] === "s" &&
        str[i + 4] === "s" &&
        badChars.includes(str[i - 1]) // this is to prevent false positives like attribute superclass=...
      ) {
        // TODO: record which double quote it was exactly, single or double

        console.log("1640");
        let valuesStart;

        if (str[i + 5] === "=") {
          if (str[i + 6] === '"' || str[i + 6] === "'") {
            valuesStart = i + 7;
          } else if (
            str[i + 6] &&
            (!str[i + 6].trim().length || "/>".includes(str[i + 6]))
          ) {
            const calculatedRange = expander({
              str,
              from: i,
              to: i + 6,
              ifRightSideIncludesThisThenCropTightly: "/>",
              wipeAllWhitespaceOnLeft: true
            });
            console.log(
              `1658 PUSH ${JSON.stringify(calculatedRange, null, 0)}`
            );
            finalIndexesToDelete.push(...calculatedRange);
          }
        } else if (str[i + 5].trim().length === 0) {
          // loop forward:
          for (let y = i + 5; y < len; y++) {
            totalCounter++;
            if (str[y].trim().length) {
              // 1. is it the "equals" character?
              if (str[y] === "=") {
                // 1-1. remove this gap:
                if (y > i + 5 && round === 1) {
                  console.log(`1671 PUSH [${i + 5}, ${y}]`);
                  finalIndexesToDelete.push(i + 5, y);
                }

                // 1-2. check what's next:
                if ((str[y + 1] === '"' || str[y + 1] === "'") && str[y + 2]) {
                  // 1-2-1. we found where values start:
                  valuesStart = y + 2;
                } else if (str[y + 1] && str[y + 1].trim().length === 0) {
                  // 1-2-2. traverse even more forward:
                  for (let z = y + 1; z < len; z++) {
                    totalCounter++;
                    if (str[z].trim().length) {
                      if (z > y + 1 && round === 1) {
                        console.log(`1685 PUSH [${y + 1}, ${z}]`);
                        finalIndexesToDelete.push(y + 1, z);
                      }

                      if ((str[z] === '"' || str[z] === "'") && str[z + 1]) {
                        valuesStart = z + 1;
                      }

                      break;
                    }
                  }
                }
              } else {
                // not equals is followed by "class" attribute's name
                if (round === 1) {
                  const calculatedRange = expander({
                    str,
                    from: i,
                    to: y - 1, // leave that space in front
                    ifRightSideIncludesThisThenCropTightly: "/>",
                    wipeAllWhitespaceOnLeft: true
                  });
                  console.log(
                    `1708 PUSH ${JSON.stringify(calculatedRange, null, 0)}`
                  );
                  finalIndexesToDelete.push(...calculatedRange);
                }
              }

              // 2. stop anyway
              break;
            }
          }
        }

        console.log(
          `1721 ${`\u001b[${33}m${`valuesStart`}\u001b[${39}m`} = ${valuesStart}`
        );

        if (valuesStart) {
          // 1. mark it
          bodyClass = resetBodyClassOrId({
            valuesStart,
            nameStart: i
          });
          console.log(
            `1731 SET ${`\u001b[${33}m${`bodyClass`}\u001b[${39}m`} = ${JSON.stringify(
              bodyClass,
              null,
              4
            )}`
          );

          // 2. resets:
          if (round === 1) {
            bodyItsTheFirstClassOrId = true;
            console.log(
              `1742 SET ${`\u001b[${33}m${`bodyItsTheFirstClassOrId`}\u001b[${39}m`} = true`
            );
          } else if (round === 2) {
            // 2. reset the we-can-delete-whole-class/id marker:
            bodyClassOrIdCanBeDeleted = true;
            console.log(
              `1748 SET ${`\u001b[${33}m${`bodyClassOrIdCanBeDeleted`}\u001b[${39}m`} = true`
            );
          }
        }
      }

      // catch the start of an id attribute within body
      // ================
      if (
        !doNothing &&
        bodyStartedAt !== null &&
        str[i] === "i" &&
        str[i + 1] === "d" &&
        badChars.includes(str[i - 1]) // this is to prevent false positives like attribute "urlid=..."
      ) {
        console.log("1763");
        let valuesStart;

        if (str[i + 2] === "=") {
          if (str[i + 3] === '"' || str[i + 3] === "'") {
            valuesStart = i + 4;
          } else if (
            str[i + 3] &&
            (!str[i + 3].trim().length || "/>".includes(str[i + 3]))
          ) {
            const calculatedRange = expander({
              str,
              from: i,
              to: i + 3,
              ifRightSideIncludesThisThenCropTightly: "/>",
              wipeAllWhitespaceOnLeft: true
            });
            console.log(
              `1781 PUSH ${JSON.stringify(calculatedRange, null, 0)}`
            );
            finalIndexesToDelete.push(...calculatedRange);
          }
        } else if (str[i + 2].trim().length === 0) {
          // loop forward:
          for (let y = i + 2; y < len; y++) {
            totalCounter++;
            if (str[y].trim().length) {
              // 1. is it the "equals" character?
              if (str[y] === "=") {
                // 1-1. remove this gap:
                if (y > i + 2 && round === 1) {
                  console.log(`1794 PUSH [${i + 2}, ${y}]`);
                  finalIndexesToDelete.push(i + 2, y);
                }

                // 1-2. check what's next:
                if ((str[y + 1] === '"' || str[y + 1] === "'") && str[y + 2]) {
                  // 1-2-1. we found where values start:
                  valuesStart = y + 2;
                } else if (str[y + 1] && str[y + 1].trim().length === 0) {
                  // 1-2-2. traverse even more forward:
                  for (let z = y + 1; z < len; z++) {
                    totalCounter++;
                    if (str[z].trim().length) {
                      if (z > y + 1 && round === 1) {
                        console.log(`1808 PUSH [${y + 1}, ${z}]`);
                        finalIndexesToDelete.push(y + 1, z);
                      }

                      if ((str[z] === '"' || str[z] === "'") && str[z + 1]) {
                        valuesStart = z + 1;
                      }

                      break;
                    }
                  }
                }
              } else {
                // not equals is followed by "id" attribute's name
                if (round === 1) {
                  const calculatedRange = expander({
                    str,
                    from: i,
                    to: y - 1, // leave that space in front
                    ifRightSideIncludesThisThenCropTightly: "/>",
                    wipeAllWhitespaceOnLeft: true
                  });
                  console.log(
                    `1831 PUSH ${JSON.stringify(calculatedRange, null, 0)}`
                  );
                  finalIndexesToDelete.push(...calculatedRange);
                }
              }

              // 2. stop anyway
              break;
            }
          }
        }

        console.log(
          `1844 ${`\u001b[${33}m${`valuesStart`}\u001b[${39}m`} = ${valuesStart}`
        );

        if (valuesStart) {
          // 1. mark it
          bodyId = resetBodyClassOrId({
            valuesStart,
            nameStart: i
          });
          console.log(
            `1854 SET ${`\u001b[${33}m${`bodyId`}\u001b[${39}m`} = ${JSON.stringify(
              bodyId,
              null,
              4
            )}`
          );

          // 2. resets:
          if (round === 1) {
            bodyItsTheFirstClassOrId = true;
            console.log(
              `1865 SET ${`\u001b[${33}m${`bodyItsTheFirstClassOrId`}\u001b[${39}m`} = true`
            );
          } else if (round === 2) {
            // 2. reset the we-can-delete-whole-class/id marker:
            bodyClassOrIdCanBeDeleted = true;
            console.log(
              `1871 SET ${`\u001b[${33}m${`bodyClassOrIdCanBeDeleted`}\u001b[${39}m`} = true`
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
          console.log(
            `1889 SET ${`\u001b[${33}m${`doNothing`}\u001b[${39}m`} = true`
          );

          // 2. mark this class as not to be removed (as a whole)
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
            console.log(
              `1905 PUSH ${JSON.stringify(calculatedRange, null, 4)}`
            );
            whitespaceStartedAt = null;
            console.log(
              `1909 SET ${`\u001b[${33}m${`whitespaceStartedAt`}\u001b[${39}m`} = null`
            );
          } else if (whitespaceStartedAt) {
            whitespaceStartedAt = null;
          }

          // 3. set doNothingUntil to corresponding tails
          const matchedHeads = matchRightIncl(str, i, allHeads);
          console.log(
            `1918 ${`\u001b[${33}m${`matchedHeads`}\u001b[${39}m`} = ${matchedHeads}`
          );
          const findings = opts.backend.find(
            headsTailsObj => headsTailsObj.heads === matchedHeads
          );
          console.log(
            `1924 ${`\u001b[${33}m${`findings`}\u001b[${39}m`} = ${JSON.stringify(
              findings,
              null,
              4
            )}`
          );
          doNothingUntil = findings["tails"];

          console.log(
            `1933 SET ${`\u001b[${33}m${`doNothingUntil`}\u001b[${39}m`} = ${doNothingUntil}`
          );
        } else if (characterSuitableForNames(chr)) {
          // 1. mark the class' starting index
          bodyClass.valueStart = i;
          console.log(
            `1939 SET ${`\u001b[${33}m${`bodyClass.valueStart`}\u001b[${39}m`} = ${
              bodyClass.valueStart
            }`
          );

          // 2. maybe there was whitespace between quotes and this?, like class="  zzz"
          if (round === 1) {
            if (
              bodyItsTheFirstClassOrId &&
              bodyClass.valuesStart !== null &&
              str.slice(bodyClass.valuesStart, i).trim().length === 0 &&
              bodyClass.valuesStart < i
            ) {
              // 1. submit the whitespace characters in the range for deletion:
              finalIndexesToDelete.push(bodyClass.valuesStart, i);
              console.log(
                `1955 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} LEADING WHITESPACE [${
                  bodyClass.valuesStart
                }, ${i}]`
              );
              nonIndentationsWhitespaceLength += i - bodyClass.valuesStart;
              // 2. disable bodyItsTheFirstClassOrId flag so we won't waste resources on
              // further classes/id's:
              bodyItsTheFirstClassOrId = false;
              console.log(
                `1964 SET ${`\u001b[${33}m${`bodyItsTheFirstClassOrId`}\u001b[${39}m`} = false`
              );
            } else if (
              whitespaceStartedAt !== null &&
              whitespaceStartedAt < i - 1
            ) {
              // maybe there's whitespace between classes?
              finalIndexesToDelete.push(whitespaceStartedAt + 1, i);
              console.log(
                `1973 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${whitespaceStartedAt +
                  1}, ${i}]`
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
        const carvedClass = `${str.slice(bodyClass.valueStart, i)}`;
        console.log(
          `1993 CARVED OUT BODY CLASS "${`\u001b[${32}m${carvedClass}\u001b[${39}m`}"`
        );
        if (round === 1) {
          bodyClassesArr.push(`.${carvedClass}`);
          console.log(
            `1998 \u001b[${35}m${`PUSH`}\u001b[${39}m slice ".${carvedClass}" to bodyClassesArr which becomes:\n${JSON.stringify(
              bodyClassesArr,
              null,
              4
            )}`
          );
        } else {
          // round 2
          if (
            bodyClass.valueStart != null &&
            bodyClassesToDelete.includes(carvedClass)
          ) {
            // submit this class for deletion
            console.log(
              `2012 ${`\u001b[${33}m${`carvedClass`}\u001b[${39}m`} = ${carvedClass}`
            );
            console.log(
              `2015 before expanding, ${`\u001b[${33}m${`bodyClass.valueStart`}\u001b[${39}m`} = ${JSON.stringify(
                bodyClass.valueStart,
                null,
                4
              )}`
            );

            const expandedRange = expander({
              str,
              from: bodyClass.valueStart,
              to: i,
              ifLeftSideIncludesThisThenCropTightly: `"'`,
              ifRightSideIncludesThisThenCropTightly: `"'`,
              wipeAllWhitespaceOnLeft: true
            });

            // precaution against too tight crop when backend markers are involved
            if (
              str[expandedRange[0] - 1] &&
              str[expandedRange[0] - 1].trim().length &&
              str[expandedRange[1]] &&
              str[expandedRange[1]].trim().length &&
              (allHeads || allTails) &&
              ((allHeads && matchLeft(str, expandedRange[0], allTails)) ||
                (allTails && matchRightIncl(str, expandedRange[1], allHeads)))
            ) {
              expandedRange[0] += 1;
              console.log(`2042 REDUCE expandedRange[0] by one`);
            }

            finalIndexesToDelete.push(...expandedRange);
            console.log(
              `2047 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
                expandedRange,
                null,
                0
              )}`
            );
          } else {
            // 1. turn off the bodyClassOrIdCanBeDeleted
            bodyClassOrIdCanBeDeleted = false;
            console.log(
              `2057 SET ${`\u001b[${33}m${`bodyClassOrIdCanBeDeleted`}\u001b[${39}m`} = false`
            );

            // 2. uglify?
            if (
              opts.uglify &&
              isStr(
                generateShortname(
                  allClassesAndIdsWithinHeadFinal.indexOf(`.${carvedClass}`)
                )
              )
            ) {
              console.log(
                `2070 ${`\u001b[${31}m${`PUSH [${bodyClass.valueStart}, ${i},
                ${generateShortname(
                  allClassesAndIdsWithinHeadFinal.indexOf(`.${carvedClass}`)
                )}]`}\u001b[${39}m`}`
              );
              finalIndexesToDelete.push(
                bodyClass.valueStart,
                i,
                generateShortname(
                  allClassesAndIdsWithinHeadFinal.indexOf(`.${carvedClass}`)
                )
              );
            }
          }
        }
        bodyClass.valueStart = null;
        console.log(
          `2087 SET ${`\u001b[${33}m${`bodyClass.valueStart`}\u001b[${39}m`} = null`
        );
      }

      // catch the ending of an id name
      // ================
      if (
        !doNothing &&
        bodyId.valueStart !== null &&
        i > bodyId.valueStart &&
        (!characterSuitableForNames(chr) ||
          (allTails && matchRightIncl(str, i, allTails)))
      ) {
        console.log("2100");
        const carvedId = str.slice(bodyId.valueStart, i);
        console.log(
          `2103 CARVED OUT BODY ID "${`\u001b[${32}m${carvedId}\u001b[${39}m`}"`
        );
        if (round === 1) {
          bodyIdsArr.push(`#${carvedId}`);
          console.log(
            `2108 \u001b[${35}m${`PUSH`}\u001b[${39}m slice "${`#${carvedId}`}" to bodyIdsArr which is now:\n${JSON.stringify(
              bodyIdsArr,
              null,
              4
            )}`
          );
        } else {
          // round 2
          if (bodyId.valueStart != null && bodyIdsToDelete.includes(carvedId)) {
            // submit this id for deletion
            console.log(
              `2119 ${`\u001b[${33}m${`carvedId`}\u001b[${39}m`} = ${carvedId}`
            );
            console.log(
              `2122 before expanding, ${`\u001b[${33}m${`bodyId.valueStart`}\u001b[${39}m`} = ${JSON.stringify(
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
              wipeAllWhitespaceOnLeft: true
            });

            // precaution against too tight crop when backend markers are involved
            if (
              str[expandedRange[0] - 1] &&
              str[expandedRange[0] - 1].trim().length &&
              str[expandedRange[1]] &&
              str[expandedRange[1]].trim().length &&
              (allHeads || allTails) &&
              ((allHeads && matchLeft(str, expandedRange[0], allTails)) ||
                (allTails && matchRightIncl(str, expandedRange[1], allHeads)))
            ) {
              expandedRange[0] += 1;
              console.log(`2148 REDUCE expandedRange[0] by one`);
            }

            finalIndexesToDelete.push(...expandedRange);
            console.log(
              `2153 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
                expandedRange,
                null,
                0
              )}`
            );
          } else {
            // 1. turn off the bodyClassOrIdCanBeDeleted
            bodyClassOrIdCanBeDeleted = false;
            console.log(
              `2163 SET ${`\u001b[${33}m${`bodyClassOrIdCanBeDeleted`}\u001b[${39}m`} = false`
            );

            // 2. uglify?
            if (
              opts.uglify &&
              isStr(
                generateShortname(
                  allClassesAndIdsWithinHeadFinal.indexOf(`#${carvedId}`)
                )
              )
            ) {
              console.log(
                `2176 ${`\u001b[${31}m${`PUSH [${bodyId.valueStart}, ${i},
                ${generateShortname(
                  allClassesAndIdsWithinHeadFinal.indexOf(`#${carvedId}`)
                )}]`}\u001b[${39}m`}`
              );
              finalIndexesToDelete.push(
                bodyId.valueStart,
                i,
                generateShortname(
                  allClassesAndIdsWithinHeadFinal.indexOf(`#${carvedId}`)
                )
              );
            }
          }
        }
        bodyId.valueStart = null;
        console.log(
          `2193 SET ${`\u001b[${33}m${`bodyId.valueStart`}\u001b[${39}m`} = null`
        );
      }

      // body: stop the class attribute's recording if closing single/double quote encountered
      // ================
      if (
        !doNothing &&
        bodyClass.valuesStart != null &&
        (chr === "'" || chr === '"') && // TODO: replace chr check against any quote with exact quote that was previously recorded on opening
        i >= bodyClass.valuesStart
      ) {
        console.log("2205");
        if (i === bodyClass.valuesStart) {
          console.log(`2207 EMPTY CLASS DETECTED!`);
          if (round === 1) {
            console.log(
              `2210 PUSH ${JSON.stringify(
                expander({
                  str,
                  from: bodyClass.nameStart,
                  to: i + 1,
                  ifRightSideIncludesThisThenCropTightly: "/>",
                  wipeAllWhitespaceOnLeft: true
                }),
                null,
                0
              )}`
            );
            finalIndexesToDelete.push(
              ...expander({
                str,
                from: bodyClass.nameStart,
                to: i + 1,
                ifRightSideIncludesThisThenCropTightly: "/>",
                wipeAllWhitespaceOnLeft: true
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
            const expandedRange = expander({
              str,
              from: bodyClass.valuesStart - 7,
              to: i + 1,
              ifRightSideIncludesThisThenCropTightly: "/>",
              wipeAllWhitespaceOnLeft: true
            });

            // precaution against too tight crop when backend markers are involved
            if (
              str[expandedRange[0] - 1] &&
              str[expandedRange[0] - 1].trim().length &&
              str[expandedRange[1]] &&
              str[expandedRange[1]].trim().length &&
              (allHeads || allTails) &&
              ((allHeads && matchLeft(str, expandedRange[0], allHeads)) ||
                (allTails && matchRightIncl(str, expandedRange[1], allTails)))
            ) {
              expandedRange[0] += 1;
            }

            console.log(
              `2261 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
                expandedRange,
                null,
                4
              )}`
            );
            finalIndexesToDelete.push(...expandedRange);
          }

          // 3. tend the trailing whitespace, as in class="zzzz  "
          if (whitespaceStartedAt !== null) {
            finalIndexesToDelete.push(whitespaceStartedAt, i);
            console.log(
              `2274 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} TRAILING WHITESPACE [${whitespaceStartedAt}, ${i}]`
            );
          }
        }

        // 2. reset the marker
        bodyClass = resetBodyClassOrId();
        console.log(`2281 RESET ${`\u001b[${33}m${`bodyClass`}\u001b[${39}m`}`);
      }

      // body: stop the id attribute's recording if closing single/double quote encountered
      // ================
      if (
        !doNothing &&
        bodyId.valuesStart !== null &&
        (chr === "'" || chr === '"') && // TODO: replace chr check against any quote with exact quote that was previously
        i >= bodyId.valuesStart
      ) {
        console.log("2292");
        if (i === bodyId.valuesStart) {
          console.log(`2294 EMPTY ID DETECTED!`);
          if (round === 1) {
            console.log(
              `2297 [bodyId.nameStart=${bodyId.nameStart}, i+1=${i + 1}] => [${
                expander({
                  str,
                  from: bodyId.nameStart,
                  to: i + 1,
                  ifRightSideIncludesThisThenCropTightly: "/>",
                  wipeAllWhitespaceOnLeft: true
                })[0]
              }, ${
                expander({
                  str,
                  from: bodyId.nameStart,
                  to: i + 1,
                  ifRightSideIncludesThisThenCropTightly: "/>",
                  wipeAllWhitespaceOnLeft: true
                })[1]
              }]`
            );
            console.log(
              `2316 PUSH ${JSON.stringify(
                expander({
                  str,
                  from: bodyId.nameStart,
                  to: i + 1,
                  ifRightSideIncludesThisThenCropTightly: "/>",
                  wipeAllWhitespaceOnLeft: true
                }),
                null,
                0
              )}`
            );
            finalIndexesToDelete.push(
              ...expander({
                str,
                from: bodyId.nameStart,
                to: i + 1,
                ifRightSideIncludesThisThenCropTightly: "/>",
                wipeAllWhitespaceOnLeft: true
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
              wipeAllWhitespaceOnLeft: true
            });

            // precaution against too tight crop when backend markers are involved
            if (
              str[expandedRange[0] - 1] &&
              str[expandedRange[0] - 1].trim().length &&
              str[expandedRange[1]] &&
              str[expandedRange[1]].trim().length &&
              (allHeads || allTails) &&
              ((allHeads && matchLeft(str, expandedRange[0], allHeads)) ||
                (allTails && matchRightIncl(str, expandedRange[1], allTails)))
            ) {
              expandedRange[0] += 1;
            }

            console.log(
              `2368 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
                expandedRange,
                null,
                4
              )}`
            );
            finalIndexesToDelete.push(...expandedRange);
          }

          // 3. tend the trailing whitespace, as in id="zzzz  "
          if (whitespaceStartedAt !== null) {
            finalIndexesToDelete.push(whitespaceStartedAt, i);
            console.log(
              `2381 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} TRAILING WHITESPACE [${whitespaceStartedAt}, ${i}]`
            );
          }
        }

        // reset the marker in either case
        bodyId = resetBodyClassOrId();
        console.log(`2388 RESET ${`\u001b[${33}m${`bodyId`}\u001b[${39}m`}`);
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
            `2403 SET ${`\u001b[${33}m${`doNothing`}\u001b[${39}m`} = true`
          );

          // 2. mark this id as not to be removed (as a whole)
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
            console.log(
              `2419 PUSH ${JSON.stringify(calculatedRange, null, 4)}`
            );
            whitespaceStartedAt = null;
            console.log(
              `2423 SET ${`\u001b[${33}m${`whitespaceStartedAt`}\u001b[${39}m`} = null`
            );
          } else if (whitespaceStartedAt) {
            whitespaceStartedAt = null;
          }

          // 3. set doNothingUntil to corresponding tails
          const matchedHeads = matchRightIncl(str, i, allHeads);
          console.log(
            `2432 ${`\u001b[${33}m${`matchedHeads`}\u001b[${39}m`} = ${matchedHeads}`
          );
          const findings = opts.backend.find(
            headsTailsObj => headsTailsObj.heads === matchedHeads
          );
          console.log(
            `2438 ${`\u001b[${33}m${`findings`}\u001b[${39}m`} = ${JSON.stringify(
              findings,
              null,
              4
            )}`
          );
          doNothingUntil = findings["tails"];

          console.log(
            `2447 SET ${`\u001b[${33}m${`doNothingUntil`}\u001b[${39}m`} = ${doNothingUntil}`
          );
        } else if (characterSuitableForNames(chr)) {
          // 1. mark the id's starting index
          bodyId.valueStart = i;
          console.log(
            `2453 SET ${`\u001b[${33}m${`bodyId.valueStart`}\u001b[${39}m`} = ${
              bodyId.valueStart
            }`
          );

          // 2. maybe there was whitespace between quotes and this?, like id="  zzz"
          if (round === 1) {
            if (
              bodyItsTheFirstClassOrId &&
              bodyId.valuesStart !== null &&
              str.slice(bodyId.valuesStart, i).trim().length === 0 &&
              bodyId.valuesStart < i
            ) {
              // 1. submit the whitespace characters in the range for deletion:
              finalIndexesToDelete.push(bodyId.valuesStart, i);
              console.log(
                `2469 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                  bodyId.valuesStart
                }, ${i}]`
              );
              nonIndentationsWhitespaceLength += i - bodyId.valuesStart;
              // 2. disable bodyItsTheFirstClassOrId flag so we won't waste resources on
              // further classes/id's:
              bodyItsTheFirstClassOrId = false;
              console.log(
                `2478 SET ${`\u001b[${33}m${`bodyItsTheFirstClassOrId`}\u001b[${39}m`} = false`
              );
            } else if (
              whitespaceStartedAt !== null &&
              whitespaceStartedAt < i - 1
            ) {
              // maybe there's whitespace between classes?
              finalIndexesToDelete.push(whitespaceStartedAt + 1, i);
              console.log(
                `2487 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${whitespaceStartedAt +
                  1}, ${i}]`
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
            `2511 ${`\u001b[${33}m${`str.slice(commentStartedAt, i)`}\u001b[${39}m`} = ${JSON.stringify(
              str.slice(commentStartedAt, i),
              null,
              4
            )}`
          );

          if (
            opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains &&
            isArr(opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains) &&
            opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.length &&
            opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.some(
              val =>
                val.trim().length &&
                str
                  .slice(commentStartedAt, i)
                  .toLowerCase()
                  .includes(val)
            )
          ) {
            canDelete = false;
            console.log(
              `2533 SET ${`\u001b[${33}m${`canDelete`}\u001b[${39}m`} = ${canDelete}`
            );
          }
          usedOnce = true;
          console.log(
            `2538 SET \u001b[${33}m${`usedOnce`}\u001b[${39}m = ${usedOnce}`
          );
        }

        // 2. catch the HTML comments' ending
        // ==================================
        if (commentStartedAt !== null && str[i] === ">") {
          console.log(`II.`);
          console.log(
            `2547 BTW, ${`\u001b[${33}m${`canDelete`}\u001b[${39}m`} = ${JSON.stringify(
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
              addSingleSpaceToPreventAccidentalConcatenation: true
            });
            if (opts.removeHTMLComments && canDelete) {
              // Instead of finalIndexesToDelete.push(i, y + 3); use expander()
              // so that we manage the whitespace outwards properly:
              console.log(
                `2568 PUSH COMMENT ${JSON.stringify(calculatedRange, null, 0)}`
              );
              finalIndexesToDelete.push(...calculatedRange);
            }
            commentsLength += calculatedRange[1] - calculatedRange[0];

            // reset the markers:
            commentStartedAt = null;
            bogusHTMLComment = undefined;
            console.log(
              `2578 RESET ${`\u001b[${33}m${`commentStartedAt`}\u001b[${39}m`} = null; ${`\u001b[${33}m${`bogusHTMLComment`}\u001b[${39}m`} = undefined`
            );
          } else if (bogusHTMLComment) {
            const calculatedRange = expander({
              str,
              from: commentStartedAt,
              to: i + 1,
              wipeAllWhitespaceOnLeft: true,
              addSingleSpaceToPreventAccidentalConcatenation: true
            });
            if (opts.removeHTMLComments && canDelete) {
              console.log(
                `2590 PUSH BOGUS COMMENT ${JSON.stringify(
                  calculatedRange,
                  null,
                  0
                )}`
              );
              finalIndexesToDelete.push(...calculatedRange);
            }
            commentsLength += calculatedRange[1] - calculatedRange[0];

            // reset the markers:
            commentStartedAt = null;
            bogusHTMLComment = undefined;
            console.log(
              `2604 RESET ${`\u001b[${33}m${`commentStartedAt`}\u001b[${39}m`} = null; ${`\u001b[${33}m${`bogusHTMLComment`}\u001b[${39}m`} = undefined`
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
              (isArr(allHeads) &&
                allHeads.length &&
                !allHeads.includes("<!"))) &&
            (!allTails ||
              (isArr(allTails) && allTails.length && !allTails.includes("<!")))
          ) {
            console.log(`2625 III. catch HTML comments clauses`);
            console.log(
              `2627 ${`\u001b[${33}m${`commentNearlyStartedAt`}\u001b[${39}m`} = ${JSON.stringify(
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
                trimBeforeMatching: true
              }) &&
              !(
                str[i + 2] === "-" &&
                str[i + 3] === "-" &&
                isArr(opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains) &&
                opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.length &&
                matchRight(
                  str,
                  i + 3,
                  opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains,
                  {
                    trimBeforeMatching: true
                  }
                )
              )
            ) {
              commentStartedAt = i;
              usedOnce = false;
              canDelete = true;
              console.log(
                `2659 SET ${`\u001b[${33}m${`commentStartedAt`}\u001b[${39}m`} = ${commentStartedAt}; ${`\u001b[${33}m${`usedOnce`}\u001b[${39}m`} = ${usedOnce}; ${`\u001b[${33}m${`canDelete`}\u001b[${39}m`} = ${canDelete};`
              );
            }

            // 3.2. detect, is it healthy or bogus comment (bogusHTMLComment = true/false)
            bogusHTMLComment = !(str[i + 2] === "-" && str[i + 3] === "-");
            console.log(
              `2666 SET ${`\u001b[${33}m${`bogusHTMLComment`}\u001b[${39}m`} = ${bogusHTMLComment}`
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

      // pinpoint opening curly braces (in head styles), but not @media's.
      // ================
      if (
        !doNothing &&
        chr === "{" &&
        checkingInsideCurlyBraces &&
        !insideCurlyBraces
      ) {
        // 1. flip the flag
        insideCurlyBraces = true;
        console.log(
          `2712 SET ${`\u001b[${33}m${`insideCurlyBraces`}\u001b[${39}m`} = true`
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
            `2724 PUSH LEADING WHITESPACE [${whitespaceStartedAt}, ${i}]`
          );
        }
      }

      // catch the whitespace
      if (!doNothing) {
        if (!str[i].trim().length) {
          if (whitespaceStartedAt === null) {
            whitespaceStartedAt = i;
            console.log(
              `2735 SET ${`\u001b[${33}m${`whitespaceStartedAt`}\u001b[${39}m`} = ${whitespaceStartedAt}`
            );
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
        isArr(round1RangesClone) &&
        round1RangesClone.length &&
        i === round1RangesClone[0][0]
      ) {
        // offset index, essentially "jumping over" what was submitted for deletion in round 1
        console.log("\n");
        const temp = round1RangesClone.shift();
        console.log(
          `2760 ${`\u001b[${33}m${`temp`}\u001b[${39}m`} = ${JSON.stringify(
            temp,
            null,
            0
          )}`
        );
        if (temp[1] - 1 > i) {
          console.log(
            `2768 \u001b[${31}m${`██ OFFSET MAIN INDEX FROM ${i} TO ${temp[1] -
              1}`}\u001b[${39}m, then step out`
          );
          i = temp[1] - 1;
        }
        // if (doNothing) {
        //   doNothing = false;
        //   console.log(
        //     `2776 SET ${`\u001b[${33}m${`doNothing`}\u001b[${39}m`} = false`
        //   );
        // }
        // if (ruleChunkStartedAt !== null) {
        //   ruleChunkStartedAt = i + 1;
        //   console.log(
        //     `2782 SET \u001b[${33}m${`ruleChunkStartedAt`}\u001b[${39}m = ${ruleChunkStartedAt}`
        //   );
        // }
        // if (headSelectorChunkStartedAt !== null) {
        //   headSelectorChunkStartedAt = i + 1;
        //   console.log(
        //     `2788 SET \u001b[${33}m${`headSelectorChunkStartedAt`}\u001b[${39}m = ${headSelectorChunkStartedAt}`
        //   );
        // }
        continue stepouter;
      }

      // catch would-have-been comment endings
      if (commentNearlyStartedAt !== null && str[i] === ">") {
        // 1. reset the marker
        commentNearlyStartedAt = null;
        console.log(
          `2799 ${`\u001b[${33}m${`commentNearlyStartedAt`}\u001b[${39}m`} = null`
        );

        // 2. check, is there empty comment block on the right which sometimes
        // follows outlook conditionals
        let temp;
        if (
          opts.removeHTMLComments &&
          isArr(opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains) &&
          opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.length &&
          (opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.some(val =>
            val.includes("if")
          ) ||
            opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.some(val =>
              val.includes("mso")
            ) ||
            opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.some(val =>
              val.includes("ie")
            )) &&
          matchRight(str, i, "<!--", {
            trimBeforeMatching: true,
            cb: (char, theRemainderOfTheString, index) => {
              temp = index;
              return true;
            }
          })
        ) {
          console.log(
            `2827 I ${`\u001b[${33}m${`temp`}\u001b[${39}m`} = ${JSON.stringify(
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
              cb: (char, theRemainderOfTheString, index) => {
                temp = index;
                return true;
              }
            })
          ) {
            console.log(
              `2847 II. ${`\u001b[${33}m${`temp`}\u001b[${39}m`} = ${JSON.stringify(
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

          i = temp - 1;
          console.log(
            `2861 SET ${`\u001b[${33}m${`i`}\u001b[${39}m`} = ${JSON.stringify(
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
      if (round === 2) {
        if (stateWithinBody) {
          console.log(
            `2878 ${
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
                    4
                  )}`
                : ""
            }${
              bodyId.valuesStart
                ? `\n* ${`\u001b[${90}m${`bodyId`}\u001b[${39}m`} = ${JSON.stringify(
                    bodyId,
                    null,
                    4
                  )}`
                : ""
            }`
          );
          // logging:
          console.log(
            `2910 ${`\u001b[${90}m${`bodyClassOrIdCanBeDeleted`}\u001b[${39}m`} = ${JSON.stringify(
              bodyClassOrIdCanBeDeleted,
              null,
              4
            )}`
          );
          console.log(
            `2917 ${`\u001b[${90}m${`whitespaceStartedAt`}\u001b[${39}m`} = ${JSON.stringify(
              whitespaceStartedAt,
              null,
              4
            )}`
          );
          console.log(
            `2924 ${`\u001b[${33}m${`bodyItsTheFirstClassOrId`}\u001b[${39}m`} = ${bodyItsTheFirstClassOrId}; \u001b[${34}m${`headWholeLineCanBeDeleted = ${headWholeLineCanBeDeleted}`}\u001b[${39}m`
          );
        } else if (stateWithinHeadStyles) {
          // it's still within head:

          // console.log(
          //   `ENDING: \u001b[${31}m${`headWholeLineCanBeDeleted = ${headWholeLineCanBeDeleted}`}\u001b[${39}m`
          // );

          // ${`\u001b[${90}m${`ruleChunkStartedAt`}\u001b[${39}m = ${ruleChunkStartedAt}`};
          // ${`\u001b[${90}m${`headSelectorChunkStartedAt`}\u001b[${39}m = ${headSelectorChunkStartedAt}`};
          // ${`\u001b[${90}m${`selectorChunkCanBeDeleted`}\u001b[${39}m = ${selectorChunkCanBeDeleted}`};
          // ${`\u001b[${90}m${`currentChunk`}\u001b[${39}m = ${currentChunk}`};

          //

          // LOGGING:
          if (round === 1) {
            console.log(
              `
${`\u001b[${90}m${`whitespaceStartedAt`}\u001b[${39}m = ${whitespaceStartedAt}`};
${`\u001b[${90}m${`singleSelectorStartedAt`}\u001b[${39}m = ${singleSelectorStartedAt}`};
${`\u001b[${90}m${`commentStartedAt`}\u001b[${39}m = ${commentStartedAt}`};
`
            );
          }
        }

        console.log(
          `${`\u001b[${
            stateWithinBody ? 32 : 31
          }m${`stateWithinBody`}\u001b[${39}m`}; ${`\u001b[${
            stateWithinHeadStyles ? 32 : 31
          }m${`stateWithinHeadStyles`}\u001b[${39}m`}; \u001b[${33}m${`lastKeptChunksCommaAt`}\u001b[${39}m = ${lastKeptChunksCommaAt}; \u001b[${33}m${`onlyDeletedChunksFollow`}\u001b[${39}m = ${onlyDeletedChunksFollow};`
        );
      }

      // console.log(`styleStartedAt = ${styleStartedAt}`);

      // logging:
      // console.log(
      //   `2965 ${
      //     existy(doNothingUntil)
      //       ? `ended with ${`\u001b[${31}m${doNothingUntil}\u001b[${39}m`}`
      //       : ""
      //   }`
      // );
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

      allClassesAndIdsWithinBody = uniq(
        bodyClassesArr.concat(bodyIdsArr).sort()
      );

      console.log(`3000 \u001b[${35}m${`\nAFTER STEP 1:`}\u001b[${39}m`);
      console.log(
        `3002 headSelectorsArr = ${JSON.stringify(headSelectorsArr, null, 4)}`
      );
      console.log(
        `3005 bodyClassesArr = ${JSON.stringify(bodyClassesArr, null, 4)}`
      );
      console.log(`3007 bodyIdsArr = ${JSON.stringify(bodyIdsArr, null, 4)}`);
      console.log(
        `3009 allClassesAndIdsWithinBody = ${JSON.stringify(
          allClassesAndIdsWithinBody,
          null,
          4
        )}`
      );
      console.log(
        `3016 \nopts.whitelist = ${JSON.stringify(opts.whitelist, null, 4)}`
      );

      // extract all classes or id's from `headSelectorsArr` and get count of each.
      // That's so we can later exclude sandwitched classes. Each time "collateral"
      // legit, but sandwitched with false-one class gets deleted, we keep count, and
      // later compare totals with these below.
      // If it turns out that a class was in both head and body, but it was sandwitched
      // with unused classes and removed as collateral, we need to remove it from body too.

      // starting point is the selectors, removed from head during first stage.

      console.log(
        `3029 \n\n███████████████████████████████████████\n\n${`\u001b[${32}m${`starting headSelectorsCount`}\u001b[${39}m`} = ${JSON.stringify(
          headSelectorsCount,
          null,
          4
        )}`
      );

      headSelectorsArr.forEach(el => {
        extract(el).forEach(selector => {
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
        `\n1220 headSelectorsCount = ${JSON.stringify(
          headSelectorsCount,
          null,
          4
        )}`
      );
      // create a working copy of `headSelectorsCount` which we'll mutate, subtracting
      // each deleted class/id:
      headSelectorsCountClone = Object.assign({}, headSelectorsCount);

      // compile list of to-be-terminated
      // ================

      allClassesAndIdsWithinHead = uniq(
        headSelectorsArr.reduce((arr, el) => arr.concat(extract(el)), [])
      ).sort();

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
        `\u001b[${36}m${`3086 LOOP preppedHeadSelectorsArr = ${JSON.stringify(
          preppedHeadSelectorsArr,
          null,
          4
        )}`}\u001b[${39}m`
      );
      for (let y = 0, len2 = preppedHeadSelectorsArr.length; y < len2; y++) {
        totalCounter++;
        console.log(`\u001b[${36}m${`------------`}\u001b[${39}m`);
        console.log(
          `3096 ${`\u001b[${36}m${`██`}\u001b[${39}m`} preppedHeadSelectorsArr[${y}] = ${JSON.stringify(
            preppedHeadSelectorsArr[y],
            null,
            4
          )}`
        );
        let temp;
        if (existy(preppedHeadSelectorsArr[y])) {
          temp = extract(preppedHeadSelectorsArr[y]);
        }
        if (!temp.every(el => allClassesAndIdsWithinBody.includes(el))) {
          console.log(
            `3108 PUSH to deletedFromHeadArr[] [${extract(
              preppedHeadSelectorsArr[y]
            )}]`
          );
          deletedFromHeadArr.push(...extract(preppedHeadSelectorsArr[y]));
          console.log(
            `3114 deletedFromHeadArr becomes = ${JSON.stringify(
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

      deletedFromHeadArr = uniq(
        pullAllWithGlob(deletedFromHeadArr, opts.whitelist)
      );

      let preppedAllClassesAndIdsWithinHead;
      if (preppedHeadSelectorsArr.length > 0) {
        preppedAllClassesAndIdsWithinHead = preppedHeadSelectorsArr.reduce(
          (arr, el) => arr.concat(extract(el)),
          []
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

      headCssToDelete = pullAllWithGlob(
        pullAll(
          uniq(Array.from(allClassesAndIdsWithinHead)),
          bodyClassesArr.concat(bodyIdsArr)
        ),
        opts.whitelist
      );
      console.log(
        `3156 OLD ${`\u001b[${32}m${`headCssToDelete`}\u001b[${39}m`} = ${JSON.stringify(
          headCssToDelete,
          null,
          4
        )}`
      );

      bodyCssToDelete = uniq(
        pullAllWithGlob(
          pullAll(
            bodyClassesArr.concat(bodyIdsArr),
            preppedAllClassesAndIdsWithinHead
          ),
          opts.whitelist
        )
      );
      console.log(
        `3173 ${`\u001b[${32}m${`bodyCssToDelete`}\u001b[${39}m`} = ${JSON.stringify(
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
      ).sort();
      console.log(
        `3188 NEW ${`\u001b[${32}m${`headCssToDelete`}\u001b[${39}m`} = ${JSON.stringify(
          headCssToDelete,
          null,
          4
        )}`
      );

      bodyClassesToDelete = bodyCssToDelete
        .filter(s => s.startsWith("."))
        .map(s => s.slice(1));
      console.log(
        `3199 bodyClassesToDelete = ${JSON.stringify(
          bodyClassesToDelete,
          null,
          4
        )}`
      );
      bodyIdsToDelete = bodyCssToDelete
        .filter(s => s.startsWith("#"))
        .map(s => s.slice(1));
      console.log(
        `3209 ${`\u001b[${33}m${`bodyIdsToDelete`}\u001b[${39}m`} = ${JSON.stringify(
          bodyIdsToDelete,
          null,
          4
        )}`
      );

      console.log(
        `3217 CURENT RANGES AFTER STEP 1: ${JSON.stringify(
          finalIndexesToDelete.current(),
          null,
          4
        )}`
      );

      allClassesAndIdsThatWereCompletelyDeletedFromHead = Object.keys(
        headSelectorsCountClone
      ).filter(singleSelector => headSelectorsCountClone[singleSelector] < 1);
      console.log(
        `3228 ${`\u001b[${33}m${`allClassesAndIdsThatWereCompletelyDeletedFromHead`}\u001b[${39}m`} = ${JSON.stringify(
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
            pullAllWithGlob(allClassesAndIdsWithinBody, opts.whitelist),
            allClassesAndIdsThatWereCompletelyDeletedFromHead
          )
            .filter(val => val[0] === ".") // filter out all classes
            .map(val => val.slice(1))
        )
      ); // remove dots from them
      console.log(
        `3249 ${`\u001b[${33}m${`bodyClassesToDelete`}\u001b[${39}m`} = ${JSON.stringify(
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
        `3261 ${`\u001b[${31}m${`██ ██ ██`}\u001b[${39}m`} ${`\u001b[${33}m${`allClassesAndIdsWithinBodyThatWereWhitelisted`}\u001b[${39}m`} = ${JSON.stringify(
          allClassesAndIdsWithinBodyThatWereWhitelisted,
          null,
          4
        )}`
      );

      // update `bodyCssToDelete` with sandwitched classes, because will be
      // used in reporting
      bodyCssToDelete = uniq(
        bodyCssToDelete.concat(
          bodyClassesToDelete.map(val => `.${val}`),
          bodyIdsToDelete.map(val => `#${val}`)
        )
      ).sort();
      console.log(
        `3277 ${`\u001b[${90}m${`bodyCssToDelete`}\u001b[${39}m`} = ${JSON.stringify(
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
        isArr(allClassesAndIdsWithinBodyThatWereWhitelisted) &&
        allClassesAndIdsWithinBodyThatWereWhitelisted.length
      ) {
        allClassesAndIdsWithinHeadFinal = allClassesAndIdsWithinHeadFinal.concat(
          allClassesAndIdsWithinBodyThatWereWhitelisted
        );
      }

      console.log(
        `3298 ${`\u001b[${33}m${`allClassesAndIdsWithinHeadFinal`}\u001b[${39}m`} = ${JSON.stringify(
          allClassesAndIdsWithinHeadFinal,
          null,
          4
        )}`
      );

      console.log(
        `3306 AFTER STEP 1, ${`\u001b[${33}m${`finalIndexesToDelete.current()`}\u001b[${39}m`} =
          ███████████████████████████████████████
          ███████████████████████████████████████
          ███████████████████V███████████████████
          ${JSON.stringify(finalIndexesToDelete.current(), null, 4)}
          ███████████████████^███████████████████
          ███████████████████████████████████████
          ███████████████████████████████████████
          `
      );

      if (finalIndexesToDelete.current()) {
        round1RangesClone = Array.from(finalIndexesToDelete.current());
      } else {
        round1RangesClone = null;
      }

      // EOL dealings:
      if (
        endingsCount.rn > endingsCount.r &&
        endingsCount.rn > endingsCount.n
      ) {
        prevailingEOL = "\r\n";
      } else if (
        endingsCount.r > endingsCount.rn &&
        endingsCount.r > endingsCount.n
      ) {
        prevailingEOL = "\r";
      } else {
        prevailingEOL = "\n";
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

      // if there's no trailing linebreak, add it
      if (!"\r\n".includes(str[len - 1])) {
        finalIndexesToDelete.push(len, len, prevailingEOL);
      }

      console.log(
        `3371: allClassesAndIdsWithinHeadFinal = ${JSON.stringify(
          allClassesAndIdsWithinHeadFinal,
          null,
          4
        )}`
      );
      console.log(
        opts.uglify
          ? `\n\n\n\n\n\n   ====== ${`\u001b[${36}m${`UGLIFICATION`}\u001b[${39}m`} ======
${(allClassesAndIdsWithinHeadFinal.reduce((accum, val) => {
  return `${accum}   ${`\u001b[${33}m${generateShortname(
    allClassesAndIdsWithinHeadFinal.indexOf(val)
  )}\u001b[${39}m`} --- ${`\u001b[${31}m${val}\u001b[${39}m`}`;
}),
"\n")}   ==========================\n`
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

  console.log(`\n\n\n\n\n\n\n
                                                              333333333333333
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

  // TODO:
  finalIndexesToDelete.push(lineBreaksToDelete.current());

  console.log(
    `3454 BEFORE 3RD STEP PREP ${`\u001b[${33}m${`str`}\u001b[${39}m`} = "${str}"`
  );

  console.log(
    `3458 AFTER 3ND ROUND, finalIndexesToDelete.current() = ${JSON.stringify(
      finalIndexesToDelete.current(),
      null,
      4
    )}`
  );
  if (str.length && finalIndexesToDelete.current()) {
    str = applySlices(str, finalIndexesToDelete.current());
    finalIndexesToDelete.wipe();
  }
  console.log("\n\n");
  console.log(`3469 string after ROUND 3:\n${str}\n\n`);

  // final fixing:
  // =============

  // remove empty media queries:
  while (regexEmptyMediaQuery.test(str)) {
    str = str.replace(regexEmptyMediaQuery, "");
    totalCounter += str.length;
  }

  // remove empty style tags:
  str = str.replace(regexEmptyStyleTag, "\n");
  totalCounter += str.length;

  // remove empty Outlook conditional comments:
  let tempLen = str.length;
  str = str.replace(emptyCondCommentRegex(), "");
  totalCounter += str.length;
  if (tempLen !== str.length) {
    commentsLength += str.length - tempLen;
  }

  // remove empty lines:
  tempLen = str.length;
  str = str.replace(/(\r?\n|\r)*[ ]*(\r?\n|\r)+/g, prevailingEOL);
  if (tempLen !== str.length) {
    nonIndentationsWhitespaceLength += str.length - tempLen;
  }
  totalCounter += str.length;

  if (str.length) {
    if (
      (!str[0].trim().length || !str[str.length - 1].trim().length) &&
      str.length !== str.trim().length
    ) {
      nonIndentationsWhitespaceLength += str.length - str.trim().length;
    }
    str = `${str.trim()}${prevailingEOL}`;
  }

  return {
    log: {
      timeTakenInMiliseconds: Date.now() - start,
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
        len && commentsLength ? Math.round((commentsLength * 100) / len) : 0
    },
    result: str,
    allInHead: allClassesAndIdsWithinHead,
    allInBody: allClassesAndIdsWithinBody,
    deletedFromHead: headCssToDelete.sort(),
    deletedFromBody: bodyCssToDelete.sort()
  };
}

export default comb;
