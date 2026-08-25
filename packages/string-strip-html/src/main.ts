import {
  formatDiagnosticValue,
  hasOwnProp,
  isPlainObject as isObj,
  pullAll,
  trimChars,
} from "codsen-utils";
import { decode } from "html-entities";
import { rApply } from "ranges-apply";
import { Ranges } from "ranges-push";
import { right } from "string-left-right";
import type { Range, Ranges as RangesType } from "../../../ops/typedefs/common";
import { version as v } from "../package.json";
import {
  characterSuitableForNames,
  containsOnlyDashes,
  countInstancesOf,
  definitelyTagNames,
  hasMoreKeysThan,
  inlineTags,
  isCasedCharAt,
  isWhitespaceCode,
  notWithinAttrQuotes,
  type Obj,
  openingQuoteOrParenthesis,
  prepHopefullyAnArray,
  punctuation,
  punctuationTrailing,
  sentencePunctuation,
  singleLetterTags,
} from "./util";

const version: string = v;

// The main loop branches on the same handful of punctuation marks at every
// character of the input. `str[i] === "<"` has to mint a one-character string
// before it can compare; reading a char code compares two integers instead,
// so the loop keeps one per iteration and matches it against these.
const CODE_SPACE = 32; // " "
const CODE_EXCLAMATION = 33; // !
const CODE_DOUBLE_QUOTE = 34; // "
const CODE_PERCENT = 37; // %
const CODE_SINGLE_QUOTE = 39; // '
const CODE_SLASH = 47; // /
const CODE_LEFT_BRACKET = 60; // <
const CODE_EQUALS = 61; // =
const CODE_RIGHT_BRACKET = 62; // >

declare let DEV: boolean;

// a range as it sits in the Ranges instance, before ranges-merge normalises it:
// the "what to insert" slot may or may not be there
type GatheredRange = [number, number, (string | null | undefined)?];

export interface Attribute {
  readonly nameStarts?: number;
  readonly nameEnds?: number;
  readonly equalsAt?: number;
  readonly name?: string;
  readonly valueStarts?: number;
  readonly valueEnds?: number;
  readonly value?: string;
}

interface TokenBase {
  readonly start: number;
  readonly end: number;
}

interface NamedTagBase extends TokenBase {
  readonly kind: "tag";
  readonly attributes: readonly Attribute[];
  readonly slashPresent: number | false;
  readonly leftOuterWhitespace: number;
  readonly onlyPlausible: boolean;
  readonly nameStarts: number;
  readonly nameContainsLetters: boolean;
  readonly nameEnds: number;
  readonly name: string;
}

export interface CompleteTag extends NamedTagBase {
  readonly status: "complete";
  readonly lastClosingBracketAt: number;
  readonly lastOpeningBracketAt: number;
}

export interface IncompleteTag extends NamedTagBase {
  readonly status: "incomplete";
  readonly lastClosingBracketAt?: never;
  readonly lastOpeningBracketAt: number;
}

export interface InferredTag extends TokenBase {
  readonly kind: "tag";
  readonly status: "inferred";
  readonly nameStarts: number;
  readonly nameContainsLetters: boolean;
  readonly nameEnds: number;
  readonly name: string;
}

export interface CommentTag extends TokenBase {
  readonly kind: "comment";
}

export interface CdataTag extends TokenBase {
  readonly kind: "cdata";
}

export type CallbackToken =
  | CompleteTag
  | IncompleteTag
  | InferredTag
  | CommentTag
  | CdataTag;

export type Tag = CallbackToken;

export type CallbackRange = readonly [
  from: number,
  to: number,
  whatToInsert: string | null | undefined,
];

export interface CbObj {
  readonly tag: Tag;
  readonly deleteFrom: null | number;
  readonly deleteTo: null | number;
  readonly insert: null | undefined | string;
  readonly rangesArr: Ranges;
  readonly proposedReturn: CallbackRange | null;
}

interface InternalCbObj extends Omit<CbObj, "tag"> {
  tag: Obj;
}

type InternalTokenMeta =
  | {
      kind: "comment" | "cdata";
      start: number;
      end: number;
    }
  | {
      kind: "tag";
      status: "complete" | "incomplete" | "inferred";
      start: number;
      end: number;
    };

export interface Opts {
  ignoreTags: string[];
  ignoreTagsWithTheirContents: string[];
  onlyStripTags: string[];
  stripTogetherWithTheirContents: string[];
  skipHtmlDecoding: boolean;
  trimOnlySpaces: boolean;
  stripRecognisedHTMLOnly: boolean;
  dumpLinkHrefsNearby: {
    enabled?: boolean;
    putOnNewLine?: boolean;
    wrapHeads?: string;
    wrapTails?: string;
  };
  ignoreIndentations: boolean;
  cb: null | ((cbObj: CbObj) => void);
  reportProgressFunc: null | ((percDone: number) => void);
  reportProgressFuncFrom: number;
  reportProgressFuncTo: number;
}

const defaults: Opts = {
  ignoreTags: [],
  ignoreTagsWithTheirContents: [],
  onlyStripTags: [],
  stripTogetherWithTheirContents: ["script", "style", "xml"],
  skipHtmlDecoding: false,
  trimOnlySpaces: false,
  stripRecognisedHTMLOnly: false,
  dumpLinkHrefsNearby: {
    enabled: false,
    putOnNewLine: false,
    wrapHeads: "",
    wrapTails: "",
  },
  ignoreIndentations: false,
  cb: null,
  reportProgressFunc: null,
  reportProgressFuncFrom: 0,
  reportProgressFuncTo: 100,
};

export interface Res {
  /** Best-effort elapsed time for user-facing completion feedback. */
  log: {
    timeTakenInMilliseconds: number;
  };
  result: string;
  ranges: RangesType;
  allTagLocations: [number, number][];
  filteredTagLocations: [number, number][];
}

/**
 * Strips HTML tags from strings. No parser, accepts mixed sources.
 */
function stripHtml(str: string, opts?: Partial<Opts>): Res {
  const start = Date.now();
  // const
  // ===========================================================================
  // we'll gather opening tags from ranged-pairs here
  // so that we can tackle resolvedOpts.stripTogetherWithTheirContents
  const rangedOpeningTagsForDeletion: Obj[] = [];

  // same way, we gather tags from ranged-pairs for
  // ignoring purposes:
  const rangedOpeningTagsForIgnoring: Obj[] = [];

  // we'll put tag locations here
  const allTagLocations: [number, number][] = [];
  let filteredTagLocations: [number, number][] = [];

  // variables
  // ===========================================================================

  // records the info about the suspected tag:
  let tag: Obj = {};
  function resetTag(): void {
    tag = { attributes: [] };
  }
  resetTag();

  // records the beginning of the current whitespace chunk:
  let chunkOfWhitespaceStartsAt: number | null = null;

  // records the beginning of the current chunk of spaces (strictly spaces-only):
  let chunkOfSpacesStartsAt: number | null = null;

  // records the last LF or CR
  let lastLFCRAt: number | null = null;

  // records, have any non-whitespace characters been met since the last line break
  let nonWhitespaceCharMetSinceLastLFCR = false;

  // temporary variable to assemble the attribute pieces:
  let attrObj: Obj = {};

  // marker to store captured href, used in resolvedOpts.dumpLinkHrefsNearby?.enabled
  let hrefDump: {
    tagName: string;
    hrefValue: string;
    openingTagEnds: number | undefined;
  } = {
    tagName: "",
    hrefValue: "",
    openingTagEnds: undefined,
  };

  // used to insert extra things when pushing into ranges array
  let stringToInsertAfter = "";

  // state flag
  let hrefInsertionActive = false;

  // marker to keep a note where does the whitespace chunk that follows closing bracket end.
  // It's necessary for resolvedOpts.trimOnlySpaces when there's closing bracket, whitespace, non-space
  // whitespace character ("\n", "\t" etc), whitespace, end-of-file. Trim will kick in and will
  // try to trim up until the EOF, be we'll have to pull the end of trim back, back to the first
  // character of aforementioned non-space whitespace character sequence.
  // This variable will tell exactly where it is located.
  let spacesChunkWhichFollowsTheClosingBracketEndsAt = null;

  // when resolvedOpts.ignoreTagsWithTheirContents activates, we flip this
  // flag to mark that tags should not be stripped. The challenge is,
  // this program still reports all tags, independently were they
  // stripped or not (because they were whitelisted)
  let strip = true;

  // the covered-prefix tracker below (see coveredFromStartUpTo) - how far from
  // index zero the ranges gathered so far reach without a gap, -1 while nothing
  // is anchored at zero yet:
  let coveredPrefixEnd = -1;
  // how many entries of rangesToDelete.ranges have been folded into it
  let foldedRangeCount = 0;
  // ranges that start beyond the covered prefix, parked here in case a later
  // range bridges the gap to them
  const rangesAwaitingPrefix: GatheredRange[] = [];

  // functions
  // ===========================================================================

  function treatRangedTags(
    i: number,
    resolvedOpts: Opts,
    rangesToDelete: Ranges,
  ): void {
    DEV && console.log(`treatRangedTags(${i}) called`);
    DEV &&
      console.log(
        `resolvedOpts.stripTogetherWithTheirContents = ${JSON.stringify(
          resolvedOpts.stripTogetherWithTheirContents,
          null,
          0,
        )}; tag.name = ${tag.name}`,
      );
    DEV &&
      console.log(
        `FIY, ${`\u001b[${33}m${`rangedOpeningTagsForDeletion`}\u001b[${39}m`} = ${JSON.stringify(
          rangedOpeningTagsForDeletion,
          null,
          4,
        )}; ${`\u001b[${33}m${`rangedOpeningTagsForIgnoring`}\u001b[${39}m`} = ${JSON.stringify(
          rangedOpeningTagsForIgnoring,
          null,
          4,
        )}`,
      );

    // 1. deletion resolvedOpts.stripTogetherWithTheirContents
    if (
      Array.isArray(resolvedOpts.stripTogetherWithTheirContents) &&
      (resolvedOpts.stripTogetherWithTheirContents.includes("*") ||
        (typeof tag.name === "string" &&
          resolvedOpts.stripTogetherWithTheirContents.includes(
            tag.name.toLowerCase(),
          )))
    ) {
      DEV && console.log();
      // it depends, is it opening or closing range tag:

      // We could try to distinguish opening from closing tags by presence of
      // slash, but that would be a liability for dirty code cases where clash
      // is missing. Better, instead, just see if an entry for that tag name
      // already exists in the rangesToDelete[].

      if (
        tag.slashPresent &&
        Array.isArray(rangedOpeningTagsForDeletion) &&
        rangedOpeningTagsForDeletion.some(
          (obj) => obj.name?.toLowerCase() === tag.name?.toLowerCase(),
        )
      ) {
        DEV &&
          console.log(
            `\u001b[${31}m${`treatRangedTags():`}\u001b[${39}m closing ranged tag`,
          );
        // closing tag.
        // filter and remove the found tag
        for (let y = rangedOpeningTagsForDeletion.length; y--; ) {
          if (
            rangedOpeningTagsForDeletion[y].name?.toLowerCase() ===
            tag.name?.toLowerCase()
          ) {
            // we'll remove from opening tag's opening bracket to closing tag's
            // closing bracket because whitespace will be taken care of separately,
            // when tags themselves will be removed.
            // Basically, for each range tag there will be 3 removals:
            // opening tag, closing tag and all from opening to closing tag.
            // We keep removing opening and closing tags along whole range
            // because of few reasons: 1. cases of broken/dirty code, 2. keeping
            // the algorithm simpler, 3. resolvedOpts that control whitespace
            // removal around tags.

            // 1. add range without caring about surrounding whitespace around
            // the range
            DEV &&
              console.log(
                `rangesToDelete.ranges: ${JSON.stringify(
                  rangesToDelete.ranges,
                  null,
                  0,
                )}`,
              );

            const combinedRangeEnd = tag.lastClosingBracketAt === i ? i + 1 : i;

            DEV &&
              console.log(
                `ABOUT TO cb()-PUSH RANGE: [${rangedOpeningTagsForDeletion[y].lastOpeningBracketAt}, ${combinedRangeEnd}]`,
              );

            // also, tend filteredTagLocations in the output - tags which are to be
            // deleted with contents should be reported as one large range in
            // filteredTagLocations - from opening to closing - not two ranges

            DEV &&
              console.log(
                `FIY, ${`\u001b[${33}m${`rangedOpeningTagsForDeletion`}\u001b[${39}m`} = ${JSON.stringify(
                  rangedOpeningTagsForDeletion,
                  null,
                  4,
                )}`,
              );

            DEV &&
              console.log(
                `${`\u001b[${33}m${`filteredTagLocations`}\u001b[${39}m`} BEFORE: ${JSON.stringify(
                  filteredTagLocations,
                  null,
                  4,
                )}`,
              );
            filteredTagLocations = filteredTagLocations.filter(
              ([from, upto]) =>
                (from < rangedOpeningTagsForDeletion[y].lastOpeningBracketAt ||
                  from >= i + 1) &&
                (upto <= rangedOpeningTagsForDeletion[y].lastOpeningBracketAt ||
                  upto > i + 1),
            );
            DEV &&
              console.log(
                `${`\u001b[${33}m${`filteredTagLocations`}\u001b[${39}m`} AFTER: ${JSON.stringify(
                  filteredTagLocations,
                  null,
                  4,
                )}`,
              );

            let endingIdx = i + 1;
            if (tag.lastClosingBracketAt) {
              endingIdx = tag.lastClosingBracketAt + 1;
            }

            DEV &&
              console.log(
                `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                  rangedOpeningTagsForDeletion[y].lastOpeningBracketAt
                }, ${endingIdx}] to filteredTagLocations`,
              );
            filteredTagLocations.push([
              rangedOpeningTagsForDeletion[y].lastOpeningBracketAt,
              endingIdx,
            ]);

            /* c8 ignore next */
            if (punctuation.has(str[i]) && resolvedOpts.cb) {
              DEV &&
                console.log(`${`\u001b[${32}m${`PING CB()`}\u001b[${39}m`}`);
              emitCallback(
                {
                  tag,
                  deleteFrom:
                    rangedOpeningTagsForDeletion[y].lastOpeningBracketAt,
                  deleteTo: combinedRangeEnd,
                  insert: null,
                  rangesArr: rangesToDelete,
                  proposedReturn: [
                    rangedOpeningTagsForDeletion[y].lastOpeningBracketAt,
                    combinedRangeEnd,
                    null,
                  ],
                },
                {
                  kind: "tag",
                  status:
                    typeof tag.lastClosingBracketAt === "number"
                      ? "complete"
                      : "incomplete",
                  start: tag.lastOpeningBracketAt,
                  end:
                    typeof tag.lastClosingBracketAt === "number"
                      ? tag.lastClosingBracketAt + 1
                      : isOpeningAt(i)
                        ? i
                        : i + 1,
                },
              );
              // null will remove any spaces added so far. Opening and closing range tags might
              // have received spaces as separate entities, but those might not be necessary for range:
              // "text <script>deleteme</script>."
            } else if (resolvedOpts.cb) {
              DEV &&
                console.log(`${`\u001b[${32}m${`PING CB()`}\u001b[${39}m`}`);
              emitCallback(
                {
                  tag,
                  deleteFrom:
                    rangedOpeningTagsForDeletion[y].lastOpeningBracketAt,
                  deleteTo: combinedRangeEnd,
                  insert: "",
                  rangesArr: rangesToDelete,
                  proposedReturn: [
                    rangedOpeningTagsForDeletion[y].lastOpeningBracketAt,
                    combinedRangeEnd,
                    "",
                  ],
                },
                {
                  kind: "tag",
                  status:
                    typeof tag.lastClosingBracketAt === "number"
                      ? "complete"
                      : "incomplete",
                  start: tag.lastOpeningBracketAt,
                  end:
                    typeof tag.lastClosingBracketAt === "number"
                      ? tag.lastClosingBracketAt + 1
                      : isOpeningAt(i)
                        ? i
                        : i + 1,
                },
              );
            }
            // 2. delete the reference to this range from rangedOpeningTagsForDeletion[]
            // because there might be more ranged tags of the same name or
            // different, overlapping or encompassing ranged tags with same
            // or different name.
            rangedOpeningTagsForDeletion.splice(y, 1);
            DEV &&
              console.log(
                `new \u001b[${33}m${`rangedOpeningTagsForDeletion`}\u001b[${39}m = ${JSON.stringify(
                  rangedOpeningTagsForDeletion,
                  null,
                  4,
                )}`,
              );
            // 3. stop the loop
            break;
          }
        }
      } else if (!tag.slashPresent) {
        // opening tag.
        DEV &&
          console.log(
            `\u001b[${31}m${`treatRangedTags():`}\u001b[${39}m opening ranged tag`,
          );
        rangedOpeningTagsForDeletion.push(tag);
        DEV &&
          console.log(
            `pushed tag{} to \u001b[${33}m${`rangedOpeningTagsForDeletion`}\u001b[${39}m\nwhich is now equal to:\n${JSON.stringify(
              rangedOpeningTagsForDeletion,
              null,
              4,
            )}`,
          );
      }
    } else if (
      Array.isArray(resolvedOpts.ignoreTagsWithTheirContents) &&
      checkIgnoreTagsWithTheirContents(i, resolvedOpts, tag)
    ) {
      DEV && console.log();
      strip = false;
      DEV &&
        console.log(
          `${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`strip`}\u001b[${39}m`} = ${JSON.stringify(
            strip,
            null,
            4,
          )}`,
        );
    }
  }

  // Answers "is everything from the string start up to idx already scheduled
  // for deletion?" - the question rangesToDelete.firstCovers() answers by
  // re-deriving it from scratch on every call.
  //
  // That re-derivation is what made this program quadratic. firstCovers() walks
  // every range gathered so far, and when the ranges did not arrive in
  // ascending order it walks them repeatedly, until a whole pass changes
  // nothing - with no early exit. Ranges stop arriving in order on the first
  // <script> or <style>, because treatRangedTags() pushes the opening tag, then
  // the closing tag, then the span between them, which starts before the
  // closing tag it just pushed. That is the default
  // stripTogetherWithTheirContents, so ordinary HTML hits it, and every tag
  // after the first such block pays for every range recorded before it.
  //
  // While the loop runs, rangesToDelete is only appended to, so the covered
  // prefix can only grow. Each range is therefore folded in once and then
  // forgotten; the ones that do not connect to the prefix wait in
  // rangesAwaitingPrefix, and are only reconsidered when the prefix actually
  // moves. Starts are never negative here - Ranges.add() throws on anything
  // that is not a natural number - so firstCovers()'s negative-start bail has
  // no equivalent below.
  function coveredFromStartUpTo(idx: number): boolean {
    idx = originalStart(idx);
    const ranges = rangesToDelete.ranges as GatheredRange[] | null;
    const total = ranges ? ranges.length : 0;
    if (!total) {
      return false;
    }

    // ranges-push extends the last range in place when the next one starts
    // where it ends, so everything except the last entry is final
    const finalCount = total - 1;
    let prefixMoved = false;
    while (foldedRangeCount < finalCount) {
      const oneRange = (ranges as GatheredRange[])[foldedRangeCount];
      foldedRangeCount += 1;
      if (!countsTowardsCoverage(oneRange)) {
        continue;
      }
      if (
        coveredPrefixEnd === -1
          ? oneRange[0] === 0
          : oneRange[0] <= coveredPrefixEnd
      ) {
        // either it extends the prefix or it sits inside it - either way it is
        // spent, because the prefix never shrinks
        if (oneRange[1] > coveredPrefixEnd) {
          coveredPrefixEnd = oneRange[1];
          prefixMoved = true;
        }
      } else {
        rangesAwaitingPrefix.push(oneRange);
      }
    }
    if (prefixMoved) {
      coveredPrefixEnd = drainRangesAwaitingPrefix(coveredPrefixEnd, true);
    }

    // the last range is still growable, so read it fresh instead of folding it
    let reach = coveredPrefixEnd;
    const lastRange = (ranges as GatheredRange[])[finalCount];
    if (
      countsTowardsCoverage(lastRange) &&
      (reach === -1 ? lastRange[0] === 0 : lastRange[0] <= reach) &&
      lastRange[1] > reach
    ) {
      reach = drainRangesAwaitingPrefix(lastRange[1], false);
    }

    return reach !== -1 && reach >= idx;
  }

  // ranges-merge drops zero-width ranges that insert nothing, so they cannot
  // contribute to coverage either
  function countsTowardsCoverage(oneRange: GatheredRange): boolean {
    return (
      Array.isArray(oneRange) &&
      (oneRange[2] !== undefined || oneRange[0] !== oneRange[1])
    );
  }

  // pulls in every parked range the moved prefix now reaches, repeating while
  // it keeps moving. Only removes them from the parking list when the caller
  // owns the result (commit) - the growable last range is applied on a copy of
  // the prefix end, so what it reaches must stay parked.
  function drainRangesAwaitingPrefix(reach: number, commit: boolean): number {
    let moved = true;
    while (moved && rangesAwaitingPrefix.length) {
      moved = false;
      let keptCount = 0;
      for (let y = 0, len2 = rangesAwaitingPrefix.length; y < len2; y++) {
        const oneRange = rangesAwaitingPrefix[y];
        if (oneRange[0] <= reach) {
          if (oneRange[1] > reach) {
            reach = oneRange[1];
            moved = true;
          }
        } else if (commit) {
          rangesAwaitingPrefix[keptCount] = oneRange;
          keptCount += 1;
        }
      }
      if (commit) {
        rangesAwaitingPrefix.length = keptCount;
      }
    }
    return reach;
  }

  function calculateWhitespaceToInsert(
    str2: string, // whole string
    currCharIdx: number, // current index
    fromIdx: null | number, // leftmost whitespace edge around tag
    toIdx: null | number, // rightmost whitespace edge around tag
    lastOpeningBracketAt: number, // tag actually starts here (<)
    lastClosingBracketAt: number, // tag actually ends here (>)
  ): string | null {
    DEV &&
      console.log(
        `\u001b[${35}m${`calculateWhitespaceToInsert() called`}\u001b[${39}m`,
      );
    DEV &&
      console.log(
        `${`\u001b[${36}m${`currCharIdx`}\u001b[${39}m`} = ${JSON.stringify(
          currCharIdx,
          null,
          4,
        )}`,
      );
    DEV &&
      console.log(
        `${`\u001b[${36}m${`fromIdx`}\u001b[${39}m`} = ${JSON.stringify(
          fromIdx,
          null,
          4,
        )}`,
      );
    DEV &&
      console.log(
        `${`\u001b[${36}m${`toIdx`}\u001b[${39}m`} = ${JSON.stringify(
          toIdx,
          null,
          4,
        )}`,
      );
    DEV &&
      console.log(
        `${`\u001b[${36}m${`lastOpeningBracketAt`}\u001b[${39}m`} = ${JSON.stringify(
          lastOpeningBracketAt,
          null,
          4,
        )}`,
      );
    DEV &&
      console.log(
        `${`\u001b[${36}m${`lastClosingBracketAt`}\u001b[${39}m`} = ${JSON.stringify(
          lastClosingBracketAt,
          null,
          4,
        )}`,
      );

    // early exit to tackle frontal line breaks
    // imagine we have:
    // test/whitespace-control.js test #17:
    //
    // <a>\n<b>\n<c>x</c>\n</b>\n</a>
    //           ^
    //          we're here,
    //          the ranges so-far are: [[0,4]]
    //          without this precaution we're about to add, we would add
    //          the standard line break compensation, [3, 8, "\n"]
    //          because that's correct for the middle of the string:
    //          <a>\n<b>\n<c>x</c>\n</b>\n</a>
    //          |  |------|
    //          0  3      8
    //
    //          but that's wrong for the range which will be merged to the frontal
    //          [0, 4], because ranges-merge will join them:
    //          [0,4] + [3,8,"\n"] = [0,8,"\n"]
    //                                     ^^^
    //                              frontal whitespace as result

    // coveredFromStartUpTo() reads that off the gathered ranges as they lie,
    // incrementally - this runs once per stripped tag, so anything that
    // re-derives it from the whole pile makes the program quadratic.
    if (typeof fromIdx === "number" && coveredFromStartUpTo(fromIdx)) {
      return "";
    }

    // The trailing whitespace avoiding is harder because we traverse from
    // the front, so we add compensating whitespace all the way, which
    // suddenly needs to be all wiped because we reached the end of string.
    // This wiping "killer" range "insert" value is null.
    // If ranges-merge detects "null" to be inserted, it will wipe all "insert"
    // coming from whatever is merged:
    // [0, 1, null] + [1, 2, "\n\n\n"] = [0, 2]

    if (
      str.length === toIdx &&
      lastClosingBracketAt &&
      !resolvedOpts?.dumpLinkHrefsNearby?.enabled
    ) {
      DEV &&
        console.log(
          `${`\u001b[${35}m${`calculateWhitespaceToInsert(): return null to tackle EOB`}\u001b[${39}m`}`,
        );
      return null;
    }

    let strToEvaluateForLineBreaks = "";
    if (
      Number.isInteger(fromIdx) &&
      (fromIdx as number) < lastOpeningBracketAt
    ) {
      strToEvaluateForLineBreaks += str2.slice(
        fromIdx as number,
        lastOpeningBracketAt,
      );
      DEV &&
        console.log(
          `strToEvaluateForLineBreaks = ${JSON.stringify(
            strToEvaluateForLineBreaks,
            null,
            0,
          )} (length ${
            strToEvaluateForLineBreaks.length
          }; sliced [${fromIdx}, ${lastOpeningBracketAt}])`,
        );
    }
    if (
      Number.isInteger(toIdx) &&
      (toIdx as number) > lastClosingBracketAt + 1
    ) {
      // limit whitespace that follows the tag, stop at linebreak. That's to make
      // the algorithm composable - we include linebreaks in front but not after.
      let temp = str2.slice(lastClosingBracketAt + 1, toIdx as number);
      // don't include the trailing whitespace
      if (toIdx && !right(str, toIdx - 1)) {
        DEV && console.log(`trim ${`\u001b[${33}m${`temp`}\u001b[${39}m`} end`);
        temp = temp.trimRight();
        DEV &&
          console.log(
            `now ${`\u001b[${33}m${`temp`}\u001b[${39}m`} = ${JSON.stringify(
              temp,
              null,
              4,
            )}`,
          );
      }

      if (temp.includes("\n") && isOpeningAt(toIdx, str2)) {
        strToEvaluateForLineBreaks += " ";
      } else {
        strToEvaluateForLineBreaks += temp;
      }
      DEV &&
        console.log(
          `strToEvaluateForLineBreaks = ${JSON.stringify(
            strToEvaluateForLineBreaks,
            null,
            0,
          )} (length ${strToEvaluateForLineBreaks.length}; sliced [${
            lastClosingBracketAt + 1
          }, ${toIdx}])`,
        );
    }
    DEV &&
      console.log(
        `strToEvaluateForLineBreaks = ${JSON.stringify(
          strToEvaluateForLineBreaks,
          null,
          0,
        )} (length ${strToEvaluateForLineBreaks.length})`,
      );

    const R0 = !punctuation.has(str2[currCharIdx]);
    const R1 =
      str2[(toIdx as number) - 1] !== ">" || !str2[fromIdx as number].trim();
    const R2 = !openingQuoteOrParenthesis.has(str2[lastOpeningBracketAt - 1]);
    const R3 = !sentencePunctuation.has(str2[currCharIdx]);
    if (
      (R0 || (R1 && R2 && R3)) &&
      // tag must be closed with a bracket, that is, it's not a case:
      // 111 <br class="zz"\n<img> 222
      //                           ^
      //                    we're here
      //
      // we target cases like:
      // <li>"<a href="/Foo/bar">zzz</a>"</li>
      //      ^^^^^^^^^^^^^^^^^^^
      //    does not need whitespace added!
      (R1 || R2) &&
      str2[currCharIdx] !== "!" &&
      // either the tag is not inline-tag
      (!inlineTags.has(tag.name?.toLowerCase()) ||
        // that tag already has some whitespace around
        (typeof fromIdx === "number" && fromIdx < lastOpeningBracketAt) ||
        (typeof toIdx === "number" && toIdx > lastClosingBracketAt + 1))
    ) {
      DEV &&
        console.log(
          `space compensation will be added, R0 ${`\u001b[${
            R0 ? 32 : 31
          }m${`██`}\u001b[${39}m`} R1 ${`\u001b[${
            R1 ? 32 : 31
          }m${`██`}\u001b[${39}m`} R2 ${`\u001b[${
            R2 ? 32 : 31
          }m${`██`}\u001b[${39}m`} R3 ${`\u001b[${
            R3 ? 32 : 31
          }m${`██`}\u001b[${39}m`}`,
        );
      // String.match() would allocate an array of matched line breaks for a
      // count that stops mattering past three, and this runs per stripped tag
      let foundLineBreaks = 0;
      for (
        let y = strToEvaluateForLineBreaks.indexOf("\n");
        y !== -1 && foundLineBreaks < 3;
        y = strToEvaluateForLineBreaks.indexOf("\n", y + 1)
      ) {
        foundLineBreaks += 1;
      }
      if (foundLineBreaks) {
        if (foundLineBreaks === 1) {
          return "\n";
        }
        if (foundLineBreaks === 2) {
          return "\n\n";
        }
        DEV &&
          console.log(
            `${`\u001b[${35}m${`calculateWhitespaceToInsert(): return three line breaks maximum`}\u001b[${39}m`}`,
          );
        return "\n\n\n";
      }
      DEV &&
        console.log(
          `${`\u001b[${35}m${`calculateWhitespaceToInsert(): default - a single space`}\u001b[${39}m`}`,
        );
      return " ";
    } else {
      DEV &&
        console.log(
          `space compensation won't be added, R0 ${`\u001b[${
            R0 ? 32 : 31
          }m${`██`}\u001b[${39}m`} R1 ${`\u001b[${
            R1 ? 32 : 31
          }m${`██`}\u001b[${39}m`} R2 ${`\u001b[${
            R2 ? 32 : 31
          }m${`██`}\u001b[${39}m`} R3 ${`\u001b[${
            R3 ? 32 : 31
          }m${`██`}\u001b[${39}m`}`,
        );
    }
    DEV &&
      console.log(
        `${`\u001b[${35}m${`calculateWhitespaceToInsert(): default case - nothing`}\u001b[${39}m`}`,
      );
    return "";
  }

  function calculateHrefToBeInserted(resolvedOpts: Opts, toIdx?: number): void {
    DEV && console.log(`calculateHrefToBeInserted() called`);
    if (
      resolvedOpts.dumpLinkHrefsNearby?.enabled &&
      hrefDump.tagName &&
      hrefDump.tagName.toLowerCase() === tag.name?.toLowerCase() &&
      tag.lastOpeningBracketAt &&
      ((hrefDump.openingTagEnds &&
        tag.lastOpeningBracketAt > hrefDump.openingTagEnds) ||
        !hrefDump.openingTagEnds)
    ) {
      hrefInsertionActive = true;
      DEV &&
        console.log(
          `calculateHrefToBeInserted(): hrefInsertionActive = "${hrefInsertionActive}"`,
        );
    }

    if (hrefInsertionActive) {
      const lineBreaks = resolvedOpts.dumpLinkHrefsNearby?.putOnNewLine
        ? "\n\n"
        : "";
      stringToInsertAfter = `${lineBreaks}${hrefDump.hrefValue}`;
      // append trailing whitespace only if a non-whitespace character
      // follows the toIdx, that is "right(str, toIdx)" is not "null"
      if (typeof toIdx !== "number" || right(str, toIdx - 1)) {
        stringToInsertAfter += lineBreaks;
      }
      DEV &&
        console.log(
          `calculateHrefToBeInserted(): stringToInsertAfter = ${stringToInsertAfter}`,
        );
    }
  }

  // These two run several times per character of the input. `str[i]` has to
  // mint a one-character string before it can be compared; charCodeAt() reads
  // an integer. Past either end of the string it yields NaN, which is !== 37
  // just as `undefined` was, so the "%" lookaround answers the same.
  //
  // The null check is not decoration: callers pass indexes that right() may
  // report as null, and `toIdx` may be undefined. Bracket access answered
  // `undefined` for those, but charCodeAt() coerces both to zero and would
  // read the first character of the input instead.
  function isOpeningAt(
    i: number | null | undefined,
    customStr?: string,
  ): boolean {
    if (i == null) {
      return false;
    }
    if (customStr) {
      return (
        customStr.charCodeAt(i) === CODE_LEFT_BRACKET &&
        customStr.charCodeAt(i + 1) !== CODE_PERCENT
      );
    }
    return (
      str.charCodeAt(i) === CODE_LEFT_BRACKET &&
      str.charCodeAt(i + 1) !== CODE_PERCENT
    );
  }

  function isClosingAt(i: number | null | undefined): boolean {
    return (
      i != null &&
      str.charCodeAt(i) === CODE_RIGHT_BRACKET &&
      str.charCodeAt(i - 1) !== CODE_PERCENT
    );
  }

  function checkIgnoreTagsWithTheirContents(
    i: number,
    resolvedOpts: Opts,
    tag2: Obj,
  ): boolean {
    if (resolvedOpts.ignoreTagsWithTheirContents.includes("*")) {
      DEV && console.log(`ignored tag contents: RETURN TRUE`);
      return true;
    }
    // past the "*" case above, the only way out of here that is not false is
    // the very last line, so a tag nobody listed is a "false" already - worth
    // establishing before the two str.indexOf() below, which each scan the rest
    // of the input, for every tag, on the default (empty) setting too
    if (!resolvedOpts.ignoreTagsWithTheirContents.includes(tag2.name)) {
      DEV && console.log(`checkIgnoreTagsWithTheirContents(): RETURN FALSE`);
      return false;
    }
    // edge case - two opening ranged tags in sequence
    // <table>... <tr>... <tr>... ... </tr> </table>
    //             #1      #2           #1
    //
    // in such case, we treat #1 as normal tag, we don't ignore
    // anything for it, only for #2. It's to prevent a loophole.
    const nextOpeningPos = str.indexOf(`<${tag2.name}`, i);
    // TODO: replace below with regexp:
    const nextClosingPos = str.indexOf(`</${tag2.name}`, i);
    if (
      // EITHER it's an opening tag
      (!tag2.slashPresent &&
        // and there's no closing
        nextClosingPos === -1) ||
      // OR it's a closing tag
      (tag2.slashPresent &&
        // and there haven't been any opening tag encountered so far
        !rangedOpeningTagsForIgnoring.some(
          (tagObj) => tagObj.name === tag2.name,
        )) ||
      // OR both opening and closing tags follow further
      (nextClosingPos > -1 &&
        nextOpeningPos > -1 &&
        // and that opening is before next closing
        nextOpeningPos < nextClosingPos)
    ) {
      DEV && console.log(`checkIgnoreTagsWithTheirContents(): RETURN FALSE`);
      return false;
    }
    DEV &&
      console.log(
        `checkIgnoreTagsWithTheirContents(): RETURN ${resolvedOpts.ignoreTagsWithTheirContents.includes(
          tag2.name,
        )}`,
      );
    return resolvedOpts.ignoreTagsWithTheirContents.includes(tag2.name);
  }

  // validation
  // ===========================================================================
  if (typeof str !== "string") {
    throw new TypeError(
      `string-strip-html/stripHtml(): [THROW_ID_01] Input must be string! Currently it's: ${(typeof str).toLowerCase()}, equal to:\n${formatDiagnosticValue(str, 4)}`,
    );
  }
  if (opts) {
    if (!isObj(opts)) {
      throw new TypeError(
        `string-strip-html/stripHtml(): [THROW_ID_02] Optional Options Object must be a plain object! Currently it's: ${(typeof opts).toLowerCase()}, equal to:\n${formatDiagnosticValue(opts, 4)}`,
      );
    } else {
      if (
        opts.reportProgressFunc &&
        typeof opts.reportProgressFunc !== "function"
      ) {
        throw new Error(
          `string-strip-html/stripHtml(): [THROW_ID_03] The Optional Options Object's key reportProgressFunc, callback function, should be a function but it was given as type ${typeof opts.reportProgressFunc}, equal to ${formatDiagnosticValue(opts.reportProgressFunc, 4)}`,
        );
      }
      if (
        typeof opts.dumpLinkHrefsNearby === "boolean" &&
        opts.dumpLinkHrefsNearby != null
      ) {
        throw new Error(
          `string-strip-html/stripHtml(): [THROW_ID_04] The Optional Options Object's key should be a plain object but it was given as type ${typeof opts.dumpLinkHrefsNearby}, equal to ${formatDiagnosticValue(opts.dumpLinkHrefsNearby, 4)}`,
        );
      }
    }
  }

  function resetHrefMarkers(): void {
    // reset the hrefDump
    if (hrefInsertionActive) {
      hrefDump = {
        tagName: "",
        hrefValue: "",
        openingTagEnds: undefined,
      };
      hrefInsertionActive = false;
    }
  }

  // prep resolvedOpts
  // ===========================================================================
  const userProvidedCb = Boolean(opts?.cb);
  const resolvedOpts: Opts = {
    ...defaults,
    ...opts,
    dumpLinkHrefsNearby: Object.assign(
      {},
      defaults.dumpLinkHrefsNearby,
      opts?.dumpLinkHrefsNearby,
    ),
  };

  if (hasOwnProp(resolvedOpts, "returnRangesOnly")) {
    throw new TypeError(
      `string-strip-html/stripHtml(): [THROW_ID_05] The Optional Options Object's key returnRangesOnly has been removed from the API since v.5 release.`,
    );
  }

  if (resolvedOpts.reportProgressFunc) {
    if (typeof resolvedOpts.reportProgressFuncFrom !== "number") {
      throw new Error(
        `string-strip-html/stripHtml(): [THROW_ID_06] The Optional Options Object's key reportProgressFuncFrom, callback function's "from" range, should be a number but it was given as type ${typeof resolvedOpts.reportProgressFuncFrom}, equal to ${formatDiagnosticValue(resolvedOpts.reportProgressFuncFrom, 4)}`,
      );
    }
    if (typeof resolvedOpts.reportProgressFuncTo !== "number") {
      throw new Error(
        `string-strip-html/stripHtml(): [THROW_ID_07] The Optional Options Object's key reportProgressFuncTo, callback function's "to" range, should be a number but it was given as type ${typeof resolvedOpts.reportProgressFuncTo}, equal to ${formatDiagnosticValue(resolvedOpts.reportProgressFuncTo, 4)}`,
      );
    }
  }

  // filter non-string or whitespace entries from the following arrays or turn
  // them into arrays:
  resolvedOpts.ignoreTags = prepHopefullyAnArray(
    resolvedOpts.ignoreTags,
    "resolvedOpts.ignoreTags",
  );
  resolvedOpts.onlyStripTags = prepHopefullyAnArray(
    resolvedOpts.onlyStripTags,
    "resolvedOpts.onlyStripTags",
  );

  // let's define the onlyStripTagsMode. Since resolvedOpts.onlyStripTags can cancel
  // out the entries in resolvedOpts.onlyStripTags, it can be empty but this mode has
  // to be switched on:
  const onlyStripTagsMode = !!resolvedOpts.onlyStripTags.length;

  // if both resolvedOpts.onlyStripTags and resolvedOpts.ignoreTags are set, latter is respected,
  // we simply exclude ignored tags from the resolvedOpts.onlyStripTags.
  if (resolvedOpts.onlyStripTags.length && resolvedOpts.ignoreTags.length) {
    resolvedOpts.onlyStripTags = pullAll(
      resolvedOpts.onlyStripTags,
      resolvedOpts.ignoreTags,
    );
  }

  if (!resolvedOpts.stripTogetherWithTheirContents) {
    resolvedOpts.stripTogetherWithTheirContents = [];
  } else if (
    typeof resolvedOpts.stripTogetherWithTheirContents === "string" &&
    (resolvedOpts.stripTogetherWithTheirContents as string).length
  ) {
    resolvedOpts.stripTogetherWithTheirContents = [
      resolvedOpts.stripTogetherWithTheirContents,
    ];
  }

  const somethingCaught: Obj = {};
  if (
    resolvedOpts.stripTogetherWithTheirContents &&
    Array.isArray(resolvedOpts.stripTogetherWithTheirContents) &&
    resolvedOpts.stripTogetherWithTheirContents.length &&
    !resolvedOpts.stripTogetherWithTheirContents.every((el, i) => {
      if (!(typeof el === "string")) {
        somethingCaught.el = el;
        somethingCaught.i = i;
        return false;
      }
      return true;
    })
  ) {
    throw new TypeError(
      `string-strip-html/stripHtml(): [THROW_ID_09] Optional Options Object's key stripTogetherWithTheirContents was set to contain not just string elements! For example, element at index ${
        somethingCaught.i
      } has a value ${
        somethingCaught.el
      } which is not string but ${(typeof somethingCaught.el).toLowerCase()}.`,
    );
  }

  if (Array.isArray(resolvedOpts.stripTogetherWithTheirContents)) {
    resolvedOpts.stripTogetherWithTheirContents =
      resolvedOpts.stripTogetherWithTheirContents.map((name) =>
        name.toLowerCase(),
      );
  }

  // prep the resolvedOpts.cb
  DEV && console.log(`resolvedOpts.cb type = ${typeof resolvedOpts.cb}`);
  if (!resolvedOpts.cb) {
    resolvedOpts.cb = ({ rangesArr, proposedReturn }) => {
      DEV &&
        console.log(
          `cb(): ${`\u001b[${33}m${`proposedReturn`}\u001b[${39}m`} = ${JSON.stringify(
            proposedReturn,
            null,
            4,
          )}`,
        );
      if (proposedReturn) {
        (rangesArr as any).push(...proposedReturn);
      }
    };
  }

  DEV &&
    console.log(
      `string-strip-html: final ${`\u001b[${33}m${`resolvedOpts`}\u001b[${39}m`} = ${JSON.stringify(
        resolvedOpts,
        null,
        4,
      )}; ${`\u001b[${33}m${`input`}\u001b[${39}m`} = "${str}"`,
    );

  // if the links have to be on a new line, we need to increase the allowance for line breaks
  // in Ranges class, it's the ranges-push API setting resolvedOpts.limitLinebreaksCount
  // see https://www.npmjs.com/package/ranges-push#optional-options-object
  function createRangesAccumulator(): Ranges {
    return new Ranges({
      limitToBeAddedWhitespace: true,
      limitLinebreaksCount: 2,
    });
  }

  const rangesToDelete = createRangesAccumulator();
  let callbackRangesMatchDefaultProposals = true;

  function copyRanges(ranges: RangesType): RangesType {
    return ranges ? ranges.map((range) => [...range] as Range) : null;
  }

  function rangesAreEqual(left: RangesType, right: RangesType): boolean {
    if (left === null || right === null) {
      return left === right;
    }
    return (
      left.length === right.length &&
      left.every(
        (range, idx) =>
          range.length === right[idx].length &&
          range.every((value, valueIdx) => value === right[idx][valueIdx]),
      )
    );
  }

  function rangesWithProposal(
    ranges: RangesType,
    proposedReturn: Range | CallbackRange | null,
  ): RangesType {
    const accumulator = createRangesAccumulator();
    ranges?.forEach((range) => {
      accumulator.push([...range] as Range);
    });
    if (proposedReturn) {
      accumulator.push([...proposedReturn] as Range);
    }
    return accumulator.current();
  }

  function emitCallback(
    cbObj: InternalCbObj,
    tokenMeta: InternalTokenMeta,
  ): void {
    const proposedReturn = cbObj.proposedReturn
      ? mapDecodedRange(cbObj.proposedReturn, str, decodeSegments)
      : null;

    if (!userProvidedCb) {
      if (proposedReturn) {
        rangesToDelete.push([...proposedReturn] as Range);
      }
      return;
    }

    const originalCbObj: CbObj = {
      tag: mapTokenToOriginal(cbObj.tag, tokenMeta, str, decodeSegments),
      deleteFrom: proposedReturn ? proposedReturn[0] : null,
      deleteTo: proposedReturn ? proposedReturn[1] : null,
      insert: proposedReturn ? proposedReturn[2] : null,
      rangesArr: rangesToDelete,
      proposedReturn: proposedReturn ? [...proposedReturn] : null,
    };
    const shouldCompare = callbackRangesMatchDefaultProposals;
    const rangesBefore = shouldCompare
      ? copyRanges(rangesToDelete.current())
      : null;

    resolvedOpts.cb?.(originalCbObj);

    if (
      shouldCompare &&
      !rangesAreEqual(
        rangesToDelete.current(),
        rangesWithProposal(rangesBefore, proposedReturn),
      )
    ) {
      callbackRangesMatchDefaultProposals = false;
    }
  }

  // Keep positions anchored to the caller's string while parsing its decoded form.
  const originalStr = str;
  const entityDecodeRanges = resolvedOpts.skipHtmlDecoding
    ? null
    : collectEntityDecodeRanges(str);
  if (entityDecodeRanges) {
    str = rApply(str, entityDecodeRanges);
  }
  const decodeSegments = buildDecodeSegments(
    originalStr,
    str,
    entityDecodeRanges,
  );

  function originalStart(idx: number): number {
    return mapDecodedStart(idx, str, decodeSegments).idx;
  }

  function pushDecodedRange(range: Range): void {
    rangesToDelete.push(mapDecodedRange(range, str, decodeSegments));
  }

  let isInsideScript = false;
  let isDoctype = false;
  let pendingMalformedStart: number | null = null;
  let currentPercentageDone = 0;
  let lastPercentage = 0;
  const len = str.length;
  const midLen = Math.floor(len / 2);

  function clearCurrentTagState(): void {
    resetTag();
    attrObj = {};
    isDoctype = false;
  }

  function releaseFinalizedTagState(): void {
    if (tag.name?.length === 6 && tag.name.toLowerCase() === "script") {
      isInsideScript = !tag.slashPresent;
    }
    pendingMalformedStart = null;
    clearCurrentTagState();
  }

  // step 1.
  // ===========================================================================

  for (let i = 0; i < len; i++) {
    // The character under the cursor, read once for the many comparisons
    // below, along with the two bracket questions asked of it - each of those
    // is a pure function of the cursor and gets asked a dozen times per
    // character. `i` jumps ahead in two places inside this body: the ESP
    // token skip restarts the loop with `continue`, and the comment/CDATA
    // skip retakes all three readings after moving the cursor.
    let charCode = str.charCodeAt(i);
    let opensHere =
      charCode === CODE_LEFT_BRACKET && str.charCodeAt(i + 1) !== CODE_PERCENT;
    let closesHere =
      charCode === CODE_RIGHT_BRACKET && str.charCodeAt(i - 1) !== CODE_PERCENT;

    // Logging:
    // -------------------------------------------------------------------------
    DEV &&
      console.log(
        `\u001b[${36}m${`===============================`}\u001b[${39}m \u001b[${35}m${`str[ ${i} ] = ${`\u001b[${31}m${
          str[i]?.trim() === ""
            ? str[i] === null
              ? "null"
              : str[i] === "\n"
                ? "line break"
                : str[i] === "\t"
                  ? "tab"
                  : "space"
            : `${str[i]} (${str[i].charCodeAt(0)})`
        }\u001b[${39}m`}`}\u001b[${39}m \u001b[${36}m${`===============================`}\u001b[${39}m`,
      );

    // Progress:
    // -------------------------------------------------------------------------
    if (resolvedOpts.reportProgressFunc) {
      if (len > 1000 && len < 2000) {
        if (i === midLen) {
          resolvedOpts.reportProgressFunc(
            resolvedOpts.reportProgressFuncFrom +
              Math.floor(
                (resolvedOpts.reportProgressFuncTo -
                  resolvedOpts.reportProgressFuncFrom) /
                  2,
              ),
          );
        }
      } else if (len >= 2000) {
        // defaults:
        // resolvedOpts.reportProgressFuncFrom = 0
        // resolvedOpts.reportProgressFuncTo = 100

        currentPercentageDone =
          resolvedOpts.reportProgressFuncFrom +
          Math.floor(
            (i / len) *
              (resolvedOpts.reportProgressFuncTo -
                resolvedOpts.reportProgressFuncFrom),
          );

        if (currentPercentageDone !== lastPercentage) {
          lastPercentage = currentPercentageDone;
          resolvedOpts.reportProgressFunc(currentPercentageDone);
          DEV && console.log(`DONE ${currentPercentageDone}%`);
        }
      }
    }

    // catch the first ending of the spaces chunk that follows the closing bracket.
    // -------------------------------------------------------------------------
    // There can be no space after bracket, in that case, the result will be that character that
    // follows the closing bracket.
    // There can be bunch of spaces that end with EOF. In that case it's fine, this variable will
    // be null.
    if (
      // cheapest clauses first, and this runs on every character of the
      // input: a local and a char code before the tag object's properties,
      // and the key count - the only clause that walks the object - last
      spacesChunkWhichFollowsTheClosingBracketEndsAt === null &&
      charCode !== CODE_SPACE &&
      tag.lastClosingBracketAt &&
      tag.lastClosingBracketAt < i &&
      // tag.lastClosingBracketAt above is already one own key, so a second
      // known one settles the count without walking the object
      (tag.attributes !== undefined || hasMoreKeysThan(tag, 1))
    ) {
      spacesChunkWhichFollowsTheClosingBracketEndsAt = i;
    }

    // skip known ESP token pairs
    // -------------------------------------------------------------------------
    if (
      !isInsideScript &&
      charCode === CODE_PERCENT &&
      str[i - 1] === "{" &&
      str.includes("%}", i + 1)
    ) {
      lastLFCRAt = null;
      DEV &&
        console.log(
          `ESP TOKEN! ${`\u001b[${31}m${`WIPE`}\u001b[${39}m`} ${`\u001b[${33}m${`lastLFCRAt`}\u001b[${39}m`} = ${JSON.stringify(
            lastLFCRAt,
            null,
            4,
          )}`,
        );
      const newPosition = str.indexOf("%}", i) - 1;
      // beware not to set it backwards, perform a check
      // otherwise, there's a risk of perpetual loop
      if (newPosition > i) {
        i = newPosition;
        DEV &&
          console.log(
            `offset i = ${i}; then ${`\u001b[${32}m${`CONTINUE`}\u001b[${39}m`}`,
          );
        continue;
      }
      // else, do nothing
    }

    // catch the closing bracket of dirty tags with missing opening brackets
    // -------------------------------------------------------------------------
    if (!isInsideScript && closesHere) {
      DEV && console.log(`closing bracket caught`);
      // tend cases where opening bracket of a tag is missing:
      if ((!tag || !hasMoreKeysThan(tag, 1)) && i > 1) {
        DEV && console.log("TRAVERSE BACKWARDS");

        // traverse backwards either until start of string or ">" is found
        for (let y = i; y--; ) {
          DEV &&
            console.log(`\u001b[${35}m${`str[${y}] = ${str[y]}`}\u001b[${39}m`);
          if (str[y - 1] === undefined || isClosingAt(y)) {
            DEV && console.log("BREAK");

            const startingPoint = str[y - 1] === undefined ? y : y + 1;
            const culprit = str.slice(startingPoint, i + 1) || "";
            DEV &&
              console.log(
                `CULPRIT: "${`\u001b[${31}m${culprit}\u001b[${39}m`}"`,
              );

            // Check if the culprit starts with a tag that's more likely a tag
            // name (like "body" or "article"). Single-letter tag names are excluded
            // because they can be plausible, ie. in math texts and so on.
            // Nobody uses puts comparison signs between words like: "article > ",
            // but single letter names can be plausible: "a > b" in math.

            const trimmedCulprit = culprit.trim();
            const candidateTagName = trimChars(
              trimmedCulprit.split(/\s+/, 1)[0] || "",
              "/>",
            );
            const normalizedCulprit = trimChars(trimmedCulprit, "/>");
            const candidateTagNameLower = candidateTagName.toLowerCase();

            DEV && console.log(`"${candidateTagName}"`);

            if (
              // quick, more efficient catches:
              (culprit.includes(`/>`) ||
                culprit.includes(`/ >`) ||
                culprit.includes(`="`) ||
                culprit.includes(`='`)) &&
              str !== `<${normalizedCulprit}>` && // recursion prevention
              definitelyTagNames.has(candidateTagNameLower) &&
              // Validate fabricated input with an isolated parser configuration.
              // Caller callbacks and progress reporting must only observe the
              // caller's source, and callback decisions must not affect whether
              // this candidate is recognised as a tag.
              stripHtml(`<${trimmedCulprit}>`, {
                skipHtmlDecoding: true,
                cb: null,
                reportProgressFunc: null,
              }).result === ""
            ) {
              /* c8 ignore next */
              if (
                !allTagLocations.length ||
                allTagLocations[allTagLocations.length - 1][0] !==
                  tag.lastOpeningBracketAt
              ) {
                allTagLocations.push([startingPoint, i + 1]);
                DEV &&
                  console.log(
                    `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                      tag.lastOpeningBracketAt
                    }, ${tag.lastClosingBracketAt + 1}] to allTagLocations`,
                  );
              }

              /* c8 ignore next */
              if (
                !filteredTagLocations.length ||
                filteredTagLocations[filteredTagLocations.length - 1][0] !==
                  tag.lastOpeningBracketAt
              ) {
                filteredTagLocations.push([startingPoint, i + 1]);
                DEV &&
                  console.log(
                    `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                      tag.lastOpeningBracketAt
                    }, ${
                      tag.lastClosingBracketAt + 1
                    }] to filteredTagLocations`,
                  );
              }

              const whiteSpaceCompensation = calculateWhitespaceToInsert(
                str,
                i,
                startingPoint,
                i + 1,
                startingPoint,
                i + 1,
              );
              DEV &&
                console.log(
                  `\u001b[${33}m${`SUBMIT RANGE #3: [${startingPoint}, ${
                    i + 1
                  }, "${whiteSpaceCompensation}"]`}\u001b[${39}m`,
                );
              let deleteUpTo = i + 1;
              if (
                str[deleteUpTo] &&
                isWhitespaceCode(str.charCodeAt(deleteUpTo))
              ) {
                for (let z = deleteUpTo; z < len; z++) {
                  if (!isWhitespaceCode(str.charCodeAt(z))) {
                    deleteUpTo = z;
                    break;
                  }
                }
              }
              DEV &&
                console.log(
                  `cb()-PUSHING [${startingPoint}, ${deleteUpTo}, "${whiteSpaceCompensation}"]`,
                );
              const nameOffset = culprit.indexOf(candidateTagName);
              const nameStarts = startingPoint + nameOffset;
              emitCallback(
                {
                  tag: {
                    name: candidateTagName,
                    nameStarts,
                    nameEnds: nameStarts + candidateTagName.length,
                    nameContainsLetters: true,
                  },
                  deleteFrom: startingPoint,
                  deleteTo: deleteUpTo,
                  insert: whiteSpaceCompensation,
                  rangesArr: rangesToDelete,
                  proposedReturn: [
                    startingPoint,
                    deleteUpTo,
                    whiteSpaceCompensation,
                  ],
                },
                {
                  kind: "tag",
                  status: "inferred",
                  start: startingPoint,
                  end: i + 1,
                },
              );
            }
            break;
          }
        }
      }
    }

    // catch slash
    // -------------------------------------------------------------------------
    if (
      !isDoctype &&
      charCode === CODE_SLASH &&
      !tag.quotes?.value &&
      Number.isInteger(tag.lastOpeningBracketAt) &&
      !Number.isInteger(tag.lastClosingBracketAt)
    ) {
      DEV &&
        console.log(`\u001b[${33}m${`tag.slashPresent`}\u001b[${39}m = true`);
      tag.slashPresent = i;
    }

    // catch double or single quotes
    // -------------------------------------------------------------------------
    if (charCode === CODE_DOUBLE_QUOTE || charCode === CODE_SINGLE_QUOTE) {
      DEV && console.log(`quote clauses`);
      if (!isDoctype && tag.nameStarts && tag?.quotes?.value === str[i]) {
        // If empty quotes, skip processing and reset
        if (attrObj.valueStarts === undefined) {
          // reset:
          attrObj = {};
          // delete the quotes marker
          delete tag.quotes;
        }
        // Otherwise, build the attrObj
        else {
          // 1. finish assembling the "attrObj{}"
          attrObj.valueEnds = i;
          attrObj.value = str.slice(attrObj.valueStarts, i);
          DEV &&
            console.log(
              `PUSHING ${`\u001b[${33}m${`attrObj`}\u001b[${39}m`} = ${JSON.stringify(
                attrObj,
                null,
                4,
              )}`,
            );
          tag.attributes.push(attrObj);
          // reset:
          attrObj = {};
          // 2. finally, delete the quotes marker, we don't need it any more
          delete tag.quotes;
          // 3. if resolvedOpts.dumpLinkHrefsNearby?.enabled is on, catch href
          let hrefVal: string | undefined;
          if (
            resolvedOpts.dumpLinkHrefsNearby?.enabled &&
            !rangedOpeningTagsForDeletion.length &&
            tag.attributes.some((obj: Obj) => {
              if (
                typeof obj.name === "string" &&
                obj.name.toLowerCase() === "href"
              ) {
                hrefVal = `${resolvedOpts.dumpLinkHrefsNearby?.wrapHeads || ""}${
                  obj.value
                }${resolvedOpts.dumpLinkHrefsNearby?.wrapTails || ""}`;
                return true;
              }
              return false;
            })
          ) {
            hrefDump = {
              tagName: tag.name,
              hrefValue: hrefVal as any,
              openingTagEnds: undefined,
            };
            DEV &&
              console.log(
                `${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`hrefDump`}\u001b[${39}m`} = ${JSON.stringify(
                  hrefDump,
                  null,
                  4,
                )}`,
              );
          }
        }
      } else if (!isDoctype && !tag.quotes && tag.nameStarts) {
        // 1. if it's an opening quote, record its type and location
        DEV &&
          console.log(
            `${`\u001b[${32}m${`SET`}\u001b[${39}m`} tag.quotes = {}, tag.quotes.value = ${
              str[i]
            }, tag.quotes.start = ${i}`,
          );
        tag.quotes = {};
        tag.quotes.value = str[i];
        tag.quotes.start = i;
        tag.quotes.next = str.indexOf(str[i], i + 1);
        // 2. start assembling the attribute object which we'll dump into tag.attributes[] array:
        if (
          attrObj.nameStarts &&
          attrObj.nameEnds &&
          attrObj.nameEnds < i &&
          attrObj.nameStarts < i &&
          !attrObj.valueStarts
        ) {
          attrObj.name = str.slice(attrObj.nameStarts, attrObj.nameEnds);
          DEV &&
            console.log(
              `${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrObj`}\u001b[${39}m`} = ${JSON.stringify(
                attrObj,
                null,
                4,
              )}`,
            );
        }
      }
    }

    // catch the ending of the tag name:
    // -------------------------------------------------------------------------
    if (
      tag.nameStarts !== undefined &&
      tag.nameEnds === undefined &&
      (isWhitespaceCode(charCode) || !characterSuitableForNames(charCode))
    ) {
      // 1. mark the name ending
      tag.nameEnds = i;
      DEV &&
        console.log(
          `${`\u001b[${32}m${`SET`}\u001b[${39}m`} \u001b[${33}m${`tag.nameEnds`}\u001b[${39}m = ${
            tag.nameEnds
          }`,
        );
      // 2. extract the full name string
      /* c8 ignore next */
      tag.name = str.slice(
        tag.nameStarts,
        tag.nameEnds +
          /* c8 ignore next */
          (!closesHere && charCode !== CODE_SLASH && str[i + 1] === undefined
            ? 1
            : 0),
      );
      DEV &&
        console.log(
          `${`\u001b[${32}m${`SET`}\u001b[${39}m`} \u001b[${33}m${`tag.name`}\u001b[${39}m = ${
            tag.name
          }`,
        );

      DEV &&
        console.log(
          `${`\u001b[${33}m${`tag`}\u001b[${39}m`} is currently = ${JSON.stringify(
            tag,
            null,
            4,
          )}`,
        );

      if (
        // if we caught "----" from "<----" or "---->", bail:
        (str[tag.nameStarts - 1] !== "!" && // protection against <!--
          containsOnlyDashes(tag.name)) ||
        // if tag name starts with a number character
        (tag.name.charCodeAt(0) > 47 && tag.name.charCodeAt(0) < 58)
      ) {
        tag = {};
        continue;
      }

      if (
        typeof tag.name === "string" &&
        tag.name.toLowerCase() === "doctype"
      ) {
        isDoctype = true;
        DEV &&
          console.log(
            `${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`isDoctype`}\u001b[${39}m`} = ${JSON.stringify(
              isDoctype,
              null,
              4,
            )}`,
          );
      }

      if (opensHere) {
        // process it because we need to tackle this new tag
        DEV && console.log(`opening bracket caught`);

        calculateHrefToBeInserted(resolvedOpts);
        DEV &&
          console.log(
            `${`\u001b[${33}m${`stringToInsertAfter`}\u001b[${39}m`} = ${JSON.stringify(
              stringToInsertAfter,
              null,
              4,
            )}`,
          );

        // calculateWhitespaceToInsert() API:
        // str, // whole string
        // currCharIdx, // current index
        // fromIdx, // leftmost whitespace edge around tag
        // toIdx, // rightmost whitespace edge around tag
        // lastOpeningBracketAt, // tag actually starts here (<)
        // lastClosingBracketAt // tag actually ends here (>)
        const whiteSpaceCompensation = calculateWhitespaceToInsert(
          str,
          i,
          tag.leftOuterWhitespace,
          i,
          tag.lastOpeningBracketAt,
          i,
        );

        DEV &&
          console.log(
            `\u001b[${33}m${`cb()-PUSH: [${tag.leftOuterWhitespace}, ${i}, "${whiteSpaceCompensation}${stringToInsertAfter}${whiteSpaceCompensation}"]`}\u001b[${39}m`,
          );
        DEV &&
          console.log(
            `${`\u001b[${33}m${`tag`}\u001b[${39}m`} = ${JSON.stringify(
              tag,
              null,
              4,
            )}`,
          );

        // only on pair tags, exclude the opening counterpart and closing
        // counterpart if whole pair is to be deleted
        if (
          resolvedOpts.stripTogetherWithTheirContents.includes("*") ||
          (typeof tag.name === "string" &&
            resolvedOpts.stripTogetherWithTheirContents.includes(
              tag.name.toLowerCase(),
            ))
        ) {
          DEV &&
            console.log(
              `${`\u001b[${33}m${`filteredTagLocations`}\u001b[${39}m`} BEFORE: ${JSON.stringify(
                filteredTagLocations,
                null,
                4,
              )}`,
            );
          /* c8 ignore next */
          filteredTagLocations = filteredTagLocations.filter(
            ([from, upto]) => !(from === tag.leftOuterWhitespace && upto === i),
          );
          DEV &&
            console.log(
              `${`\u001b[${33}m${`filteredTagLocations`}\u001b[${39}m`} AFTER: ${JSON.stringify(
                filteredTagLocations,
                null,
                4,
              )}`,
            );
        }

        // DEV && console.log(
        //   `1453 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
        //     tag.leftOuterWhitespace
        //   }, ${i}] to filteredTagLocations`
        // );
        // filteredTagLocations.push([tag.leftOuterWhitespace, i]);

        DEV && console.log(`${`\u001b[${32}m${`PING CB()`}\u001b[${39}m`}`);
        emitCallback(
          {
            tag,
            deleteFrom: tag.leftOuterWhitespace,
            deleteTo: i,
            insert: `${whiteSpaceCompensation}${stringToInsertAfter}${whiteSpaceCompensation}`,
            rangesArr: rangesToDelete,
            proposedReturn: [
              tag.leftOuterWhitespace,
              i,
              `${whiteSpaceCompensation}${stringToInsertAfter}${whiteSpaceCompensation}`,
            ],
          },
          {
            kind: "tag",
            status: "incomplete",
            start: tag.lastOpeningBracketAt,
            end: i,
          },
        );
        resetHrefMarkers();

        // also,
        treatRangedTags(i, resolvedOpts, rangesToDelete);
        releaseFinalizedTagState();
      }
    }

    // catch beginning of an attribute value
    // -------------------------------------------------------------------------
    if (
      attrObj.nameEnds &&
      attrObj.equalsAt &&
      !attrObj.valueStarts &&
      tag.quotes?.start &&
      tag.quotes.start < i &&
      !tag.quotes.end
    ) {
      DEV &&
        console.log(
          `${`\u001b[${32}m${`SET`}\u001b[${39}m`} \u001b[${33}m${`attrObj.valueStarts`}\u001b[${39}m = ${
            attrObj.valueStarts
          }`,
        );
      attrObj.valueStarts = i;
    }

    // catch rare cases when attributes name has some space after it, before equals
    // -------------------------------------------------------------------------
    if (
      charCode === CODE_EQUALS &&
      attrObj.nameEnds &&
      !attrObj.valueStarts &&
      !attrObj.equalsAt &&
      !tag.quotes
    ) {
      attrObj.equalsAt = i;

      DEV &&
        console.log(
          `${`\u001b[${32}m${`SET`}\u001b[${39}m`} \u001b[${33}m${`attrObj.equalsAt`}\u001b[${39}m = ${
            attrObj.equalsAt
          }`,
        );
    }

    // catch the ending of the whole attribute
    // -------------------------------------------------------------------------
    // for example, <a b c> this "c" ends "b" because it's not "equals" sign.
    // We even anticipate for cases where whitespace anywhere between attribute parts:
    // < article class = " something " / >
    if (
      attrObj.nameEnds &&
      attrObj.nameStarts &&
      !attrObj.valueStarts &&
      !isWhitespaceCode(charCode) &&
      charCode !== CODE_EQUALS &&
      !tag.quotes
    ) {
      // if (!tag.attributes) {
      //   tag.attributes = [];
      // }
      tag.attributes.push(attrObj);
      DEV && console.log("PUSHED attrObj into tag.attributes, reset attrObj");
      attrObj = {};
    }

    // catch the ending of an attribute's name
    // -------------------------------------------------------------------------
    if (attrObj.nameStarts && !attrObj.nameEnds && !tag.quotes) {
      DEV && console.log();
      if (isDoctype && `'"`.includes(str[attrObj.nameStarts])) {
        // nesting here so that "normal" attr name clauses would not
        // be calculated in further if-else clauses
        if (
          // opening is in front:
          // <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
          //                       ^                  ^
          //               attrObj.nameStarts      we're here let's say
          attrObj.nameStarts < i &&
          // quote pair is matched
          str[i] === str[attrObj.nameStarts]
        ) {
          attrObj.nameEnds = i + 1;
          DEV &&
            console.log(
              `${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrObj.nameEnds`}\u001b[${39}m`} = ${JSON.stringify(
                attrObj.nameEnds,
                null,
                4,
              )}`,
            );
          attrObj.name = str.slice(attrObj.nameStarts, attrObj.nameEnds);
        }
      } else if (isWhitespaceCode(charCode)) {
        attrObj.nameEnds = i;
        DEV &&
          console.log(
            `${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrObj.nameEnds`}\u001b[${39}m`} = ${JSON.stringify(
              attrObj.nameEnds,
              null,
              4,
            )}`,
          );
        attrObj.name = str.slice(attrObj.nameStarts, attrObj.nameEnds);
      } else if (charCode === CODE_EQUALS) {
        DEV && console.log(`equal char clauses`);
        /* c8 ignore next */
        if (!attrObj.equalsAt) {
          DEV && console.log(`equal hasn't been met`);
          attrObj.nameEnds = i;
          DEV &&
            console.log(
              `${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrObj.nameEnds`}\u001b[${39}m`} = ${JSON.stringify(
                attrObj.nameEnds,
                null,
                4,
              )}`,
            );
          attrObj.equalsAt = i;
          DEV &&
            console.log(
              `${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrObj.equalsAt`}\u001b[${39}m`} = ${JSON.stringify(
                attrObj.equalsAt,
                null,
                4,
              )}`,
            );
          attrObj.name = str.slice(attrObj.nameStarts, attrObj.nameEnds);
        }
      } else if (charCode === CODE_SLASH || closesHere) {
        DEV &&
          console.log(
            `${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrObj.nameEnds`}\u001b[${39}m`} = ${JSON.stringify(
              attrObj.nameEnds,
              null,
              4,
            )}`,
          );
        attrObj.nameEnds = i;
        attrObj.name = str.slice(attrObj.nameStarts, attrObj.nameEnds);
        DEV &&
          console.log(`\u001b[${33}m${`PUSH attrObj and wipe`}\u001b[${39}m`);
        // if (!tag.attributes) {
        //   tag.attributes = [];
        // }
        tag.attributes.push(attrObj);
        attrObj = {};
      } else if (opensHere) {
        DEV &&
          console.log(
            `\u001b[${33}m${`ATTR NAME ENDS WITH NEW TAG`}\u001b[${39}m - ${`\u001b[${31}m${`TODO`}\u001b[${39}m`}`,
          );
        // TODO - address both cases of onlyPlausible
        attrObj.nameEnds = i;
        attrObj.name = str.slice(attrObj.nameStarts, attrObj.nameEnds);
        // if (!tag.attributes) {
        //   tag.attributes = [];
        // }
        tag.attributes.push(attrObj);
        attrObj = {};
      }
    }

    // catch the beginning of an attribute's name
    // -------------------------------------------------------------------------
    if (
      // most selective clause first: an attribute name can only start right
      // after whitespace, which rules out the bulk of the input before any
      // of the tag object's properties have to be read
      isWhitespaceCode(str.charCodeAt(i - 1)) &&
      !isWhitespaceCode(charCode) &&
      charCode !== CODE_LEFT_BRACKET &&
      charCode !== CODE_RIGHT_BRACKET &&
      charCode !== CODE_SLASH &&
      charCode !== CODE_EXCLAMATION &&
      !attrObj.nameStarts &&
      tag.nameEnds < i &&
      !tag.lastClosingBracketAt &&
      !tag.quotes
    ) {
      attrObj.nameStarts = i;
      DEV &&
        console.log(
          `${`\u001b[${32}m${`SET`}\u001b[${39}m`} \u001b[${33}m${`attrObj.nameStarts`}\u001b[${39}m = ${
            attrObj.nameStarts
          }`,
        );
    }

    // catch "< /" - turn off "onlyPlausible"
    // -------------------------------------------------------------------------
    if (
      charCode === CODE_SLASH &&
      tag.lastOpeningBracketAt !== null &&
      tag.lastOpeningBracketAt < i &&
      tag.onlyPlausible
    ) {
      tag.onlyPlausible = false;
    }

    // catch character that follows an opening bracket:
    // -------------------------------------------------------------------------
    if (
      tag.lastOpeningBracketAt !== null &&
      tag.lastOpeningBracketAt < i &&
      charCode !== CODE_SLASH // there can be closing slashes in various places, legit and not
    ) {
      // 1. identify, is it definite or just plausible tag
      if (tag.onlyPlausible === undefined) {
        if ((isWhitespaceCode(charCode) || opensHere) && !tag.slashPresent) {
          tag.onlyPlausible = true;
        } else {
          tag.onlyPlausible = false;
        }
        DEV &&
          console.log(
            `${`\u001b[${32}m${`SET`}\u001b[${39}m`} \u001b[${33}m${`tag.onlyPlausible`}\u001b[${39}m = ${
              tag.onlyPlausible
            }`,
          );
      }
      // 2. catch the beginning of the tag name. Consider custom HTML tag names
      // and also known (X)HTML tags:
      if (
        !isWhitespaceCode(charCode) &&
        tag.nameStarts === undefined &&
        !opensHere &&
        charCode !== CODE_SLASH &&
        !closesHere &&
        charCode !== CODE_EXCLAMATION
      ) {
        // the /[-?_A-Za-z]/ test, spelled out in char codes
        if (
          (charCode > 96 && charCode < 123) || // a-z
          (charCode > 64 && charCode < 91) || // A-Z
          charCode === 45 || // -
          charCode === 63 || // ?
          charCode === 95 // _
        ) {
          tag.nameStarts = i;
          tag.nameContainsLetters = false;
          DEV &&
            console.log(
              `\u001b[${33}m${`tag.nameStarts`}\u001b[${39}m = ${
                tag.nameStarts
              }`,
            );
        } else {
          resetTag();
          attrObj = {};
        }
      }
    }

    // Catch letters in the tag name. Necessary to filter out false positives like "<------"
    if (tag.nameStarts && !tag.quotes && isCasedCharAt(charCode, str, i)) {
      tag.nameContainsLetters = true;
    }

    // catch closing bracket
    // -------------------------------------------------------------------------
    if (
      // it's closing bracket
      closesHere &&
      //
      // precaution against JSP comparison
      // .. <c:when test="${!empty ab.cd && ab.cd > 0.00}"> ..
      //                                          ^
      //                                        we're here, it's false ending
      //
      (notWithinAttrQuotes(tag, str, i) ||
        //
        // precaution against double opening quotes
        // a<div class=""zzzz">x</div>b
        //                    ^
        //            we're here
        (tag.quotes.value &&
          typeof tag.lastOpeningBracketAt === "number" &&
          countInstancesOf(
            tag.quotes.value,
            str.slice(tag.lastOpeningBracketAt, i),
          ) %
            2 ===
            1 &&
          // precaution against tags within attributes:
          //
          // <a href="<b>c</b>">d</a>
          //            ^
          //     we're here
          !str.slice(tag.lastOpeningBracketAt + 1, i).includes("<") &&
          !str.slice(tag.lastOpeningBracketAt + 1, i).includes(">")))
    ) {
      DEV && console.log(`caught a closing bracket`);

      if (tag.lastOpeningBracketAt !== undefined) {
        // 1. mark the index
        tag.lastClosingBracketAt = i;

        DEV &&
          console.log(
            `${`\u001b[${32}m${`SET`}\u001b[${39}m`} tag.lastClosingBracketAt = ${
              tag.lastClosingBracketAt
            }`,
          );
        // 2. reset the spacesChunkWhichFollowsTheClosingBracketEndsAt
        spacesChunkWhichFollowsTheClosingBracketEndsAt = null;
        // 3. push attrObj into tag.attributes[]
        if (Object.keys(attrObj).length) {
          DEV &&
            console.log(
              `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} \u001b[${33}m${`attrObj`}\u001b[${39}m & reset`,
            );
          // if (!tag.attributes) {
          //   tag.attributes = [];
          // }
          tag.attributes.push(attrObj);
          attrObj = {};
        }
        // 4. if resolvedOpts.dumpLinkHrefsNearby?.enabled is on and we just recorded an href,
        if (
          resolvedOpts.dumpLinkHrefsNearby?.enabled &&
          hrefDump.tagName &&
          !hrefDump.openingTagEnds
        ) {
          // finish assembling the hrefDump{}
          hrefDump.openingTagEnds = i; // or tag.lastClosingBracketAt, same
          DEV &&
            console.log(
              `${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`hrefDump`}\u001b[${39}m`} openingTagEnds, now = ${JSON.stringify(
                hrefDump,
                null,
                4,
              )}`,
            );
        }
      }
    } else {
      DEV &&
        console.log(
          `ELSE CLAUSES: R1=${closesHere} && R2=${notWithinAttrQuotes(
            tag,
            str,
            i,
          )}`,
        );
    }

    // catch the ending of the tag
    // -------------------------------------------------------------------------
    // the tag is "released" into "rApply":

    if (
      (!isDoctype || charCode === CODE_RIGHT_BRACKET) &&
      tag.lastOpeningBracketAt !== undefined
    ) {
      DEV && console.log(`opening bracket has been met`);
      DEV &&
        console.log(
          `FIY, ${`\u001b[${33}m${`tag.lastClosingBracketAt`}\u001b[${39}m`} = ${JSON.stringify(
            tag.lastClosingBracketAt,
            null,
            4,
          )}`,
        );
      if (tag.lastClosingBracketAt === undefined) {
        if (
          tag.lastOpeningBracketAt < i &&
          !opensHere && // to prevent cases like "text <<<<<< text"
          (str[i + 1] === undefined ||
            (isOpeningAt(i + 1) && !tag?.quotes?.value)) &&
          tag.nameContainsLetters &&
          typeof tag.nameStarts === "number"
        ) {
          let candidateFinalized = false;
          DEV && console.log(`str[i + 1] = ${str[i + 1]}`);
          // find out the tag name earlier than dedicated tag name ending catching section:
          tag.nameEnds ??= i + 1;
          tag.name = str.slice(tag.nameStarts, tag.nameEnds).toLowerCase();

          DEV &&
            console.log(
              `${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`tag.name`}\u001b[${39}m`} = ${JSON.stringify(
                tag.name,
                null,
                4,
              )}`,
            );

          // submit tag to allTagLocations
          /* c8 ignore next */
          if (
            !allTagLocations.length ||
            allTagLocations[allTagLocations.length - 1][0] !==
              tag.lastOpeningBracketAt
          ) {
            allTagLocations.push([tag.lastOpeningBracketAt, i + 1]);
            DEV &&
              console.log(
                `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                  tag.lastOpeningBracketAt
                }, ${i + 1}] to allTagLocations`,
              );
          }

          if (
            // if it's an ignored tag
            resolvedOpts.ignoreTags.includes(tag.name) ||
            // or ignored ranged tag
            checkIgnoreTagsWithTheirContents(i, resolvedOpts, tag) ||
            // it's not a known HTML tag and...
            (!definitelyTagNames.has(tag.name) &&
              // ...EITHER situation is suspicious
              (tag.onlyPlausible ||
                // ...OR user instructed to strip only definitely HTML
                resolvedOpts.stripRecognisedHTMLOnly))
          ) {
            DEV &&
              console.log(
                `Ignored tag - \u001b[${31}m${`WIPE AND RESET`}\u001b[${39}m`,
              );
            pendingMalformedStart = null;
            clearCurrentTagState();
            continue;
          }

          // if the tag is only plausible (there's space after opening bracket) and it's not among
          // recognised tags, leave it as it is:

          DEV && console.log();
          if (
            ((definitelyTagNames.has(tag.name) ||
              singleLetterTags.has(tag.name)) &&
              (tag.onlyPlausible === false ||
                (tag.onlyPlausible === true && tag.attributes.length))) ||
            (str[i + 1] === undefined && tag.onlyPlausible !== true)
          ) {
            calculateHrefToBeInserted(resolvedOpts);
            DEV &&
              console.log(
                `${`\u001b[${33}m${`stringToInsertAfter`}\u001b[${39}m`} = ${JSON.stringify(
                  stringToInsertAfter,
                  null,
                  4,
                )}`,
              );

            const whiteSpaceCompensation = calculateWhitespaceToInsert(
              str,
              i,
              tag.leftOuterWhitespace,
              i + 1,
              tag.lastOpeningBracketAt,
              tag.lastClosingBracketAt,
            );

            DEV &&
              console.log(
                `\u001b[${33}m${`cb()-PUSH: [${tag.leftOuterWhitespace}, ${
                  i + 1
                }, "${whiteSpaceCompensation || ""}${
                  stringToInsertAfter || ""
                }${whiteSpaceCompensation || ""}"]`}\u001b[${39}m`,
              );
            DEV &&
              console.log(
                `${`\u001b[${33}m${`tag`}\u001b[${39}m`} = ${JSON.stringify(
                  tag,
                  null,
                  4,
                )}`,
              );

            if (
              isInsideScript &&
              tag.name?.length === 6 &&
              tag.name.toLowerCase() === "script" &&
              tag.slashPresent
            ) {
              isInsideScript = false;
              DEV &&
                console.log(
                  `${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`isInsideScript`}\u001b[${39}m`} = ${JSON.stringify(
                    isInsideScript,
                    null,
                    4,
                  )}`,
                );
            }

            let insert: string | null;
            if (
              whiteSpaceCompensation === null ||
              stringToInsertAfter === null
            ) {
              insert = null;
            } else {
              insert = `${whiteSpaceCompensation}${stringToInsertAfter}${whiteSpaceCompensation}`;
            }
            DEV &&
              console.log(
                `${`\u001b[${33}m${`insert`}\u001b[${39}m`} = ${JSON.stringify(
                  insert,
                  null,
                  4,
                )}`,
              );

            DEV && console.log(`${`\u001b[${32}m${`PING CB()`}\u001b[${39}m`}`);
            emitCallback(
              {
                tag,
                deleteFrom: tag.leftOuterWhitespace,
                deleteTo: i + 1,
                insert,
                rangesArr: rangesToDelete,
                proposedReturn: [tag.leftOuterWhitespace, i + 1, insert],
              },
              {
                kind: "tag",
                status: "incomplete",
                start: tag.lastOpeningBracketAt,
                end: i + 1,
              },
            );
            candidateFinalized = true;
            resetHrefMarkers();

            // also,
            treatRangedTags(i, resolvedOpts, rangesToDelete);
          }
          DEV && console.log();

          /* c8 ignore next */
          if (
            !filteredTagLocations.length ||
            (filteredTagLocations[filteredTagLocations.length - 1][0] !==
              tag.lastOpeningBracketAt &&
              filteredTagLocations[filteredTagLocations.length - 1][1] !==
                i + 1)
          ) {
            DEV && console.log();

            // filter out opening/closing tag pair because whole chunk
            // from opening's opening to closing's closing will be pushed
            if (
              resolvedOpts.stripTogetherWithTheirContents.includes("*") ||
              (typeof tag.name === "string" &&
                resolvedOpts.stripTogetherWithTheirContents.includes(
                  tag.name.toLowerCase(),
                ))
            ) {
              DEV &&
                console.log(
                  `FIY, ${`\u001b[${33}m${`rangedOpeningTagsForDeletion`}\u001b[${39}m`} = ${JSON.stringify(
                    rangedOpeningTagsForDeletion,
                    null,
                    4,
                  )}`,
                );

              // get the last opening counterpart of the pair
              // iterate rangedOpeningTagsForDeletion from the, pick the first
              // ranged opening tag whose name is same like current, closing's
              let lastRangedOpeningTag: any;
              for (let z = rangedOpeningTagsForDeletion.length; z--; ) {
                /* c8 ignore next */
                if (
                  rangedOpeningTagsForDeletion[z].name?.toLowerCase() ===
                  tag.name?.toLowerCase()
                ) {
                  lastRangedOpeningTag = rangedOpeningTagsForDeletion[z];
                  DEV &&
                    console.log(
                      `${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`lastRangedOpeningTag`}\u001b[${39}m`} = ${JSON.stringify(
                        lastRangedOpeningTag,
                        null,
                        4,
                      )}`,
                    );
                  DEV && console.log(`BREAK`);
                }
              }

              /* c8 ignore next */
              if (lastRangedOpeningTag) {
                DEV &&
                  console.log(
                    `${`\u001b[${33}m${`filteredTagLocations`}\u001b[${39}m`} BEFORE: ${JSON.stringify(
                      filteredTagLocations,
                      null,
                      4,
                    )}`,
                  );
                filteredTagLocations = filteredTagLocations.filter(
                  ([from]) =>
                    from !== lastRangedOpeningTag.lastOpeningBracketAt,
                );
                DEV &&
                  console.log(
                    `${`\u001b[${33}m${`filteredTagLocations`}\u001b[${39}m`} AFTER: ${JSON.stringify(
                      filteredTagLocations,
                      null,
                      4,
                    )}`,
                  );

                filteredTagLocations.push([
                  lastRangedOpeningTag.lastOpeningBracketAt,
                  i + 1,
                ]);
                DEV &&
                  console.log(
                    `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                      lastRangedOpeningTag.lastOpeningBracketAt
                    }, ${i + 1}] to filteredTagLocations`,
                  );
              } else {
                /* c8 ignore next */
                filteredTagLocations.push([tag.lastOpeningBracketAt, i + 1]);
                DEV &&
                  console.log(
                    `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                      tag.lastOpeningBracketAt
                    }, ${i + 1}] to filteredTagLocations`,
                  );
              }
            } else {
              // if it's not ranged tag, just push it as it is to filteredTagLocations
              filteredTagLocations.push([tag.lastOpeningBracketAt, i + 1]);
              DEV &&
                console.log(
                  `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                    tag.lastOpeningBracketAt
                  }, ${i + 1}] to filteredTagLocations`,
                );
            }
          }
          if (candidateFinalized) {
            releaseFinalizedTagState();
          } else {
            pendingMalformedStart =
              tag.onlyPlausible === false
                ? (pendingMalformedStart ?? tag.leftOuterWhitespace)
                : null;
            clearCurrentTagState();
          }
        }
        DEV && console.log(`end`);
      } else if (
        (i > tag.lastClosingBracketAt && !isWhitespaceCode(charCode)) ||
        str[i + 1] === undefined ||
        // on markdown-friendly settings, when indentations are ignored,
        // stop at the first line break
        (resolvedOpts.ignoreIndentations && `\r\n`.includes(str[i]))
      ) {
        DEV && console.log(`closing bracket has been met`);
        // case 2. closing bracket HAS BEEN met
        // we'll look for a non-whitespace character and delete up to it
        // BUT, we'll wipe the tag object only if that non-whitespace character
        // is not a ">". This way we'll catch and delete sequences of closing brackets.

        // part 1.

        let endingRangeIndex = tag.lastClosingBracketAt === i ? i + 1 : i;
        DEV &&
          console.log(
            `${`\u001b[${33}m${`endingRangeIndex`}\u001b[${39}m`} = ${JSON.stringify(
              endingRangeIndex,
              null,
              4,
            )}`,
          );

        if (
          resolvedOpts.trimOnlySpaces &&
          endingRangeIndex === len - 1 &&
          spacesChunkWhichFollowsTheClosingBracketEndsAt !== null &&
          spacesChunkWhichFollowsTheClosingBracketEndsAt < i
        ) {
          endingRangeIndex = spacesChunkWhichFollowsTheClosingBracketEndsAt;
        }

        // if it's a dodgy suspicious tag where space follows opening bracket, there's an extra requirement
        // for this tag to be considered a tag - there has to be at least one attribute with equals if
        // the tag name is not recognised.

        DEV &&
          console.log(
            `${`\u001b[${33}m${`tag.name`}\u001b[${39}m`} = ${JSON.stringify(
              tag.name,
              null,
              4,
            )}`,
          );

        // submit tag to allTagLocations
        /* c8 ignore next */
        if (
          !allTagLocations.length ||
          allTagLocations[allTagLocations.length - 1][0] !==
            tag.lastOpeningBracketAt
        ) {
          allTagLocations.push([
            tag.lastOpeningBracketAt,
            tag.lastClosingBracketAt + 1,
          ]);
          DEV &&
            console.log(
              `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                tag.lastOpeningBracketAt
              }, ${tag.lastClosingBracketAt + 1}] to allTagLocations`,
            );
        }

        // let's define the flags here to prevent repetition and
        // make it easier to nest logical clauses
        const ignoreTags = resolvedOpts.ignoreTags.includes(tag.name);
        const ignoreTagsWithTheirContents = checkIgnoreTagsWithTheirContents(
          i,
          resolvedOpts,
          tag,
        );
        DEV &&
          console.log(
            `SET ignoreTags = ${ignoreTags}; ignoreTagsWithTheirContents = ${ignoreTagsWithTheirContents}`,
          );

        DEV && console.log(`onlyStripTagsMode = ${onlyStripTagsMode}`);
        // if we should not strip this tag
        if (
          !strip ||
          (resolvedOpts.stripRecognisedHTMLOnly &&
            typeof tag.name === "string" &&
            !definitelyTagNames.has(tag.name.toLowerCase()) &&
            !singleLetterTags.has(tag.name.toLowerCase())) ||
          (!onlyStripTagsMode && (ignoreTags || ignoreTagsWithTheirContents)) ||
          (onlyStripTagsMode &&
            !resolvedOpts.onlyStripTags.includes(tag.name)) ||
          resolvedOpts.ignoreTagsWithTheirContents.includes(tag.name)
        ) {
          DEV && console.log();
          // if the "strip" flag is not activated, if we're not already between
          // ranged ignored tags, activate the "strip" flag
          if (ignoreTagsWithTheirContents) {
            // it depends, is it an opening tag
            if (tag.slashPresent) {
              DEV && console.log(`it's an closing closing ranged tag`);

              for (let y = rangedOpeningTagsForIgnoring.length; y--; ) {
                if (rangedOpeningTagsForIgnoring[y].name === tag.name) {
                  // 2. delete the reference to this tag
                  rangedOpeningTagsForIgnoring.splice(y, 1);
                  DEV &&
                    console.log(
                      `new \u001b[${33}m${`rangedOpeningTagsForIgnoring`}\u001b[${39}m = ${JSON.stringify(
                        rangedOpeningTagsForIgnoring,
                        null,
                        4,
                      )}`,
                    );
                  // 3. stop the loop
                  break;
                }
              }

              // if by now the rangedOpeningTagsForIgnoring[] is empty,
              // disable the "strip" to resume the tag stripping
              if (!rangedOpeningTagsForIgnoring.length) {
                strip = true;
                DEV &&
                  console.log(
                    `${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`strip`}\u001b[${39}m`} = ${JSON.stringify(
                      strip,
                      null,
                      4,
                    )}`,
                  );
              }
            } else {
              DEV && console.log(`it's an opening closing ranged tag`);
              if (strip) {
                strip = false;
                DEV &&
                  console.log(
                    `${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`strip`}\u001b[${39}m`} = ${JSON.stringify(
                      strip,
                      null,
                      4,
                    )}`,
                  );
              }

              rangedOpeningTagsForIgnoring.push(tag);
              DEV &&
                console.log(
                  `pushed tag{} to \u001b[${33}m${`rangedOpeningTagsForIgnoring`}\u001b[${39}m\nwhich is now equal to:\n${JSON.stringify(
                    rangedOpeningTagsForIgnoring,
                    null,
                    4,
                  )}`,
                );
            }
          }

          DEV &&
            console.log(
              `${`\u001b[${32}m${`PING CB() with nulls`}\u001b[${39}m`}`,
            );
          emitCallback(
            {
              tag,
              deleteFrom: null,
              deleteTo: null,
              insert: null,
              rangesArr: rangesToDelete,
              proposedReturn: null,
            },
            {
              kind: "tag",
              status: "complete",
              start: tag.lastOpeningBracketAt,
              end: tag.lastClosingBracketAt + 1,
            },
          );

          // don't submit the tag onto "filteredTagLocations"

          // then reset:
          DEV &&
            console.log(
              `Ignored tag - \u001b[${31}m${`WIPE AND RESET`}\u001b[${39}m`,
            );
          tag = {};
          attrObj = {};
          pendingMalformedStart = null;
        } else if (
          !tag.onlyPlausible ||
          // tag name is recognised and there are no attributes:
          (tag.attributes.length === 0 &&
            tag.name &&
            (definitelyTagNames.has(tag.name.toLowerCase()) ||
              singleLetterTags.has(tag.name.toLowerCase()))) ||
          // OR there is at least one equals that follow the attribute's name:
          tag.attributes?.some((attrObj2: any) => attrObj2.equalsAt)
        ) {
          // submit tag to filteredTagLocations
          /* c8 ignore next */
          if (
            !filteredTagLocations.length ||
            filteredTagLocations[filteredTagLocations.length - 1][0] !==
              tag.lastOpeningBracketAt
          ) {
            filteredTagLocations.push([
              tag.lastOpeningBracketAt,
              tag.lastClosingBracketAt + 1,
            ]);
            DEV &&
              console.log(
                `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                  tag.lastOpeningBracketAt
                }, ${tag.lastClosingBracketAt + 1}] to filteredTagLocations`,
              );
          }

          // if this was an ignored tag name, algorithm would have bailed earlier,
          // in stage "catch the ending of the tag name".

          const whiteSpaceCompensation = calculateWhitespaceToInsert(
            str,
            i, // currCharIdx
            tag.leftOuterWhitespace, // fromIdx
            endingRangeIndex, // toIdx
            tag.lastOpeningBracketAt, // lastOpeningBracketAt
            tag.lastClosingBracketAt, // lastClosingBracketAt
          );
          DEV &&
            console.log(
              `${`\u001b[${33}m${`whiteSpaceCompensation`}\u001b[${39}m`} = ${JSON.stringify(
                whiteSpaceCompensation,
                null,
                4,
              )} (length: ${whiteSpaceCompensation?.length})`,
            );

          // calculate optional resolvedOpts.dumpLinkHrefsNearby?.enabled HREF to insert
          stringToInsertAfter = "";
          hrefInsertionActive = false;

          // extracts href attribute's value, without any whitespace compensation,
          // just the actual, (think trimmed) value, http: or mailto:
          calculateHrefToBeInserted(resolvedOpts, endingRangeIndex);

          DEV &&
            console.log(
              `${`\u001b[${33}m${`stringToInsertAfter`}\u001b[${39}m`} = ${JSON.stringify(
                stringToInsertAfter,
                null,
                4,
              )}`,
            );
          let insert: string | null | undefined;
          if (
            typeof stringToInsertAfter === "string" &&
            stringToInsertAfter.length
          ) {
            insert = `${whiteSpaceCompensation}${stringToInsertAfter}${
              whiteSpaceCompensation === "\n\n" ? "\n" : whiteSpaceCompensation
            }`;
            DEV &&
              console.log(
                `SET ${`\u001b[${33}m${`insert`}\u001b[${39}m`} = ${JSON.stringify(
                  insert,
                  null,
                  4,
                )}`,
              );
            // correction: add missing space after
            // for example
            // a<a href="https://codsen.com" target="_blank"><div>z</div></a>b
            //                                                               ^
            //                                                       we're here
            // the suggested rage was: [58, 62, "https://codsen.com"]
            // which means, when it composes with existing ranges:
            // [[1,51," "],[52,58," "]]
            // merged ranges come:
            // [[1,51," "],[52,62," https://codsen.com"]]
            // the trailing space is missing, which means, result is
            // "a z https://codsen.comb"
            //                       ^^
            // here we take precautions against such cases
            if (
              // if there is no whitespace after the tag we're deleting
              // (equivalent to calculateWhitespaceToInsert(): toIdx === lastClosingBracketAt + 1)
              endingRangeIndex === tag.lastClosingBracketAt + 1 &&
              // but don't add space if there's a trailing punctuation
              // imagine a full stop instead of "b" above!
              (!str[endingRangeIndex] ||
                !punctuationTrailing.has(str[endingRangeIndex]))
            ) {
              DEV &&
                console.log(
                  `${`\u001b[${32}m${`append`}\u001b[${39}m`} trailing space to "insert"`,
                );
              insert += " ";
            }
            DEV &&
              console.log(
                `${`\u001b[${36}m${`latest`}\u001b[${39}m`} rangesToDelete.ranges: ${JSON.stringify(
                  rangesToDelete.ranges,
                  null,
                  4,
                )}`,
              );

            // precaution against accidental concatenation, missing frontal space
            // imagine:
            // a<a href="https://codsen.com" target="_blank"><div>z</div></a>b
            //                                                               ^
            //                                                        we're here
            // imagine we're deleting the </a> and <div> is among "ignoreTags"
            // in such case, to achieve the desired "a <div>z</div> [https://codsen.com] b"
            // we'd need to add a hardcoded frontal space to "insert", like above
            if (
              // no whitespace in front detected:
              tag.leftOuterWhitespace === tag.lastOpeningBracketAt &&
              // (because any frontal whitespace tag.leftOuterWhitespace would extend in
              //  front of tag.leftOuterWhitespace)
              //
              // and there are ranges recorded so far
              rangesToDelete.last() &&
              // and the last of the recorded ranges does not extend to this range
              // we're about to push (meaning we're about to cut out tightly and make
              // a concatenation)
              (rangesToDelete.last() as Range)[1] <
                originalStart(tag.lastOpeningBracketAt) &&
              (!resolvedOpts?.dumpLinkHrefsNearby?.putOnNewLine ||
                !punctuationTrailing.has(str[endingRangeIndex]))
            ) {
              insert = ` ${insert}`;
              DEV &&
                console.log(
                  `${`\u001b[${32}m${`prepend`}\u001b[${39}m`} trailing space to "insert"`,
                );
            }

            DEV &&
              console.log(
                `${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`insert`}\u001b[${39}m`} = ${JSON.stringify(
                  insert,
                  null,
                  4,
                )}`,
              );
          } else {
            insert = whiteSpaceCompensation;
            DEV &&
              console.log(
                `${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`insert`}\u001b[${39}m`} = ${JSON.stringify(
                  insert,
                  null,
                  4,
                )}`,
              );
          }

          // wipe the insertion value, but be careful not to mess up
          // the dumpLinkHrefsNearby
          if (
            insert !== null &&
            (tag.leftOuterWhitespace === 0 ||
              !right(str, endingRangeIndex - 1)) &&
            (!resolvedOpts.dumpLinkHrefsNearby?.enabled ||
              tag.name?.toLowerCase() !== "a")
          ) {
            insert = undefined;
            DEV &&
              console.log(
                `${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`insert`}\u001b[${39}m`} = ${JSON.stringify(
                  insert,
                  null,
                  4,
                )}`,
              );
          }

          // correction to omit the trailing punctuation
          // for example:
          // Here's a <a href="https://codsen.com">link</a>.
          //                                               ^
          //                                        we're here
          //
          // now, the current range on opts.dumpLinkHrefsNearby enabled
          // would end up [42, 46, " https://codsen.com"] which would mean,
          // rendered string would be:
          // Here's a link https://codsen.com.
          //                                 ^
          // But we don't want this trailing dot.
          // So, here we detect this condition and extend the "toIdx" by one index position.
          let punctuationCorrection = 0;
          DEV && console.log(`███████████████████████████████████████`);
          DEV &&
            console.log(
              `${`\u001b[${33}m${`punctuationTrailing.has(str[endingRangeIndex])`}\u001b[${39}m`} = ${JSON.stringify(
                punctuationTrailing.has(str[endingRangeIndex]),
                null,
                4,
              )}`,
            );
          if (
            hrefInsertionActive &&
            punctuationTrailing.has(str[endingRangeIndex])
          ) {
            DEV && console.log();
            if (resolvedOpts.dumpLinkHrefsNearby?.putOnNewLine) {
              DEV &&
                console.log(
                  `bring ${str[endingRangeIndex]} forward from index ${endingRangeIndex} to ${tag.leftOuterWhitespace}`,
                );
              insert = `${str[endingRangeIndex]}${insert ? insert : ""}`;
            }

            const nextCharOnTheRight = right(str, endingRangeIndex);
            DEV &&
              console.log(
                `███████████████████████████████████████ ${`\u001b[${33}m${`nextCharOnTheRight`}\u001b[${39}m`} = ${JSON.stringify(
                  nextCharOnTheRight,
                  null,
                  4,
                )}`,
              );

            if (nextCharOnTheRight && insert?.endsWith("\n")) {
              DEV && console.log();
              punctuationCorrection += nextCharOnTheRight - i;
            } else if (!nextCharOnTheRight || nextCharOnTheRight > i) {
              DEV && console.log();
              punctuationCorrection++;
            }

            DEV &&
              console.log(
                `${`\u001b[${32}m${`BUMP`}\u001b[${39}m`} ${`\u001b[${33}m${`punctuationCorrection`}\u001b[${39}m`} to ${JSON.stringify(
                  punctuationCorrection,
                  null,
                  4,
                )}`,
              );
          }

          // pass the range onto the callback function, be it default or user's
          DEV &&
            console.log(
              `\u001b[${33}m${`cb()-SUBMIT RANGE #2: [${
                tag.leftOuterWhitespace
              }, ${endingRangeIndex}, ${JSON.stringify(
                insert,
                null,
                0,
              )}]`}\u001b[${39}m`,
            );
          emitCallback(
            {
              tag,
              deleteFrom: tag.leftOuterWhitespace,
              deleteTo: endingRangeIndex + punctuationCorrection,
              insert,
              rangesArr: rangesToDelete,
              proposedReturn: [
                tag.leftOuterWhitespace,
                endingRangeIndex + punctuationCorrection,
                insert,
              ],
            },
            {
              kind: "tag",
              status: "complete",
              start: tag.lastOpeningBracketAt,
              end: tag.lastClosingBracketAt + 1,
            },
          );
          resetHrefMarkers();

          // also,
          treatRangedTags(i, resolvedOpts, rangesToDelete);
          pendingMalformedStart = null;
        } else {
          DEV && console.log(`\u001b[${33}m${`RESET tag{}`}\u001b[${39}m`);
          tag = {};
          pendingMalformedStart = null;
        }

        // part 2.
        if (!closesHere) {
          DEV && console.log(`\u001b[${33}m${`RESET tag{}`}\u001b[${39}m`);
          tag = {};
        }
      }

      // toggle off the isDoctype
      if (isDoctype) {
        isDoctype = false;
        DEV &&
          console.log(
            `${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`isDoctype`}\u001b[${39}m`} = ${JSON.stringify(
              isDoctype,
              null,
              4,
            )}`,
          );
      }
    }

    // catch an opening bracket
    // -------------------------------------------------------------------------
    if (
      // Don't catch tags inside <script>:
      //
      // EITHER it's not inside <script>
      (!isInsideScript ||
        // OR it's the same script tag's closing counterpart
        //
        // < body > text < script > zzz <    /    script < / body >
        //                              ^
        //                          we're here
        (charCode === CODE_LEFT_BRACKET &&
          right(str, right(str, i)) &&
          str[right(str, i) as number] === "/" &&
          /^script/i.test(str.slice(right(str, right(str, i)) as number)))) &&
      opensHere &&
      !isOpeningAt(i - 1) &&
      !`'"`.includes(str[i + 1]) &&
      (!`'"`.includes(str[i + 2]) || /\w/.test(str[i + 1])) &&
      //
      // precaution JSP,
      // against <c:
      !(str[i + 1] === "c" && str[i + 2] === ":") &&
      // against <fmt:
      !(
        str[i + 1] === "f" &&
        str[i + 2] === "m" &&
        str[i + 3] === "t" &&
        str[i + 4] === ":"
      ) &&
      // against <sql:
      !(
        str[i + 1] === "s" &&
        str[i + 2] === "q" &&
        str[i + 3] === "l" &&
        str[i + 4] === ":"
      ) &&
      // against <x:
      !(str[i + 1] === "x" && str[i + 2] === ":") &&
      // against <fn:
      !(str[i + 1] === "f" && str[i + 2] === "n" && str[i + 3] === ":") &&
      //
      // kl <c:when test="${!empty ab.cd && ab.cd < 0.00}"> mn
      //                                          ^
      //                                  we're here, it's false alarm
      notWithinAttrQuotes(tag, str, i)
    ) {
      DEV &&
        console.log(
          `${`\u001b[${32}m${`caught opening bracket`}\u001b[${39}m`}`,
        );
      // cater sequences of opening brackets "<<<<div>>>"
      if (isClosingAt(right(str, i))) {
        // cater cases like: "<><><>"
        DEV && console.log(`cases like <><><>`);
        continue;
      } else {
        DEV && console.log(`opening brackets else clauses`);
        // 1. Before (re)setting flags, check, do we have a case of a tag with a
        // missing closing bracket, and this is a new tag following it.

        DEV &&
          console.log(
            `R1: ${!!tag.nameEnds}; R2: ${
              tag.nameEnds < i
            }; R3: ${!tag.lastClosingBracketAt}`,
          );
        if (tag.nameEnds && tag.nameEnds < i && !tag.lastClosingBracketAt) {
          DEV && console.log();
          DEV &&
            console.log(
              `R1: ${!!tag.onlyPlausible}; R2: ${!definitelyTagNames.has(
                tag.name,
              )}; R3: ${!singleLetterTags.has(tag.name)}; R4: ${!tag.attributes
                ?.length}`,
            );
          if (
            (tag.onlyPlausible === true && tag.attributes?.length) ||
            tag.onlyPlausible === false
          ) {
            DEV && console.log();
            // tag.onlyPlausible can be undefined too
            const whiteSpaceCompensation = calculateWhitespaceToInsert(
              str,
              i,
              tag.leftOuterWhitespace,
              i,
              tag.lastOpeningBracketAt,
              i,
            );

            DEV &&
              console.log(
                `cb()-PUSH range [${tag.leftOuterWhitespace}, ${i}, "${whiteSpaceCompensation}"]`,
              );
            emitCallback(
              {
                tag,
                deleteFrom: tag.leftOuterWhitespace,
                deleteTo: i,
                insert: whiteSpaceCompensation,
                rangesArr: rangesToDelete,
                proposedReturn: [
                  tag.leftOuterWhitespace,
                  i,
                  whiteSpaceCompensation,
                ],
              },
              {
                kind: "tag",
                status: "incomplete",
                start: tag.lastOpeningBracketAt,
                end: i,
              },
            );

            // also,
            treatRangedTags(i, resolvedOpts, rangesToDelete);

            // then, for continuity, mark everything up accordingly if it's a new bracket:
            releaseFinalizedTagState();
          }
        }

        // 2. if new tag starts, reset:
        if (
          tag.lastOpeningBracketAt !== undefined &&
          tag.onlyPlausible &&
          tag.name &&
          !tag.quotes
        ) {
          // This candidate was not finalized. Preserve its outer boundary so
          // malformed chains such as "< < < tag>" can still be treated as one
          // plausible candidate, but clear the fields which identify its most
          // recent opening.
          DEV && console.log(`${`\u001b[${31}m${`RESET`}\u001b[${39}m`} tag`);
          tag.lastOpeningBracketAt = undefined;
          tag.name = undefined;
          tag.onlyPlausible = false;
          DEV &&
            console.log(
              `NOW ${`\u001b[${33}m${`tag`}\u001b[${39}m`} = ${JSON.stringify(
                tag,
                null,
                4,
              )}`,
            );
        }

        if (
          (tag.lastOpeningBracketAt === undefined || !tag.onlyPlausible) &&
          !tag.quotes
        ) {
          tag.lastOpeningBracketAt = i;
          tag.slashPresent = false;
          tag.attributes = [];

          // since 2.1.0 we started to care about not trimming outer whitespace which is not spaces.
          // For example, " \t <a> \n ". Tag's whitespace boundaries should not extend to string
          // edges but until "\t" on the left and "\n" on the right IF resolvedOpts.trimOnlySpaces is on.

          if (chunkOfWhitespaceStartsAt === null) {
            tag.leftOuterWhitespace = i;
          } else if (
            resolvedOpts.trimOnlySpaces &&
            chunkOfWhitespaceStartsAt === 0
          ) {
            // if whitespace extends to the beginning of a string, there's a risk it might include
            // not only spaces. To fix that, switch to space-only range marker:

            /* c8 ignore next */
            tag.leftOuterWhitespace = chunkOfSpacesStartsAt || i;
          } else {
            tag.leftOuterWhitespace = chunkOfWhitespaceStartsAt;
          }

          if (pendingMalformedStart !== null) {
            tag.leftOuterWhitespace = pendingMalformedStart;
          }

          // tag.leftOuterWhitespace =
          //   chunkOfWhitespaceStartsAt === null ? i : chunkOfWhitespaceStartsAt;

          DEV &&
            console.log(
              `${`\u001b[${32}m${`SET`}\u001b[${39}m`} \u001b[${33}m${`tag.leftOuterWhitespace`}\u001b[${39}m = ${
                tag.leftOuterWhitespace
              }; \u001b[${33}m${`tag.lastOpeningBracketAt`}\u001b[${39}m = ${
                tag.lastOpeningBracketAt
              }; \u001b[${33}m${`tag.slashPresent`}\u001b[${39}m = false`,
            );

          // tend the HTML comments: <!-- --> or CDATA: <![CDATA[ ... ]]>
          // if opening comment tag is detected, traverse forward aggressively
          // until EOL or "-->" is reached and offset outer index "i".
          if (
            str.startsWith("!--", i + 1) ||
            str.startsWith("![CDATA[", i + 1)
          ) {
            DEV &&
              console.log(
                `\u001b[${31}m${`███████████████████████████████████████`}\u001b[${39}m`,
              );
            // make a note which one it is:
            let cdata = true;
            if (str[i + 2] === "-") {
              cdata = false;
            }
            DEV && console.log("traversing forward");
            let closingFoundAt: number | undefined;
            for (let y = i; y < len; y++) {
              DEV &&
                console.log(
                  `${`\u001b[${33}m${`str[${y}]`}\u001b[${39}m`} = ${str[y]}`,
                );
              if (
                // startsWith() clamps a negative index to zero, which the
                // three-character concatenation this replaces did not
                y > 1 &&
                ((!closingFoundAt && cdata && str.startsWith("]]>", y - 2)) ||
                  (!cdata && str.startsWith("-->", y - 2)))
              ) {
                closingFoundAt = y;
                DEV && console.log(`closingFoundAt = ${closingFoundAt}`);
              }

              if (
                closingFoundAt &&
                ((closingFoundAt < y && !isWhitespaceCode(str.charCodeAt(y))) ||
                  str[y + 1] === undefined)
              ) {
                DEV && console.log("END detected");
                let rangeEnd = y;
                if (
                  (str[y + 1] === undefined &&
                    isWhitespaceCode(str.charCodeAt(y))) ||
                  str[y] === ">"
                ) {
                  rangeEnd += 1;
                }

                // submit the tag
                /* c8 ignore next */
                if (
                  !allTagLocations.length ||
                  allTagLocations[allTagLocations.length - 1][0] !==
                    tag.lastOpeningBracketAt
                ) {
                  allTagLocations.push([
                    tag.lastOpeningBracketAt,
                    closingFoundAt + 1,
                  ]);
                  DEV &&
                    console.log(
                      `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                        tag.lastOpeningBracketAt
                      }, ${closingFoundAt + 1}] to allTagLocations`,
                    );
                }

                /* c8 ignore next */
                if (
                  !filteredTagLocations.length ||
                  filteredTagLocations[filteredTagLocations.length - 1][0] !==
                    tag.lastOpeningBracketAt
                ) {
                  filteredTagLocations.push([
                    tag.lastOpeningBracketAt,
                    closingFoundAt + 1,
                  ]);
                  DEV &&
                    console.log(
                      `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                        tag.lastOpeningBracketAt
                      }, ${closingFoundAt + 1}] to filteredTagLocations`,
                    );
                }

                const whiteSpaceCompensation = calculateWhitespaceToInsert(
                  str,
                  y,
                  tag.leftOuterWhitespace,
                  rangeEnd,
                  tag.lastOpeningBracketAt,
                  closingFoundAt,
                );
                DEV &&
                  console.log(
                    `cb()-PUSH range [${tag.leftOuterWhitespace}, ${rangeEnd}, "${whiteSpaceCompensation}"]`,
                  );
                emitCallback(
                  {
                    tag,
                    deleteFrom: tag.leftOuterWhitespace,
                    deleteTo: rangeEnd,
                    insert: whiteSpaceCompensation,
                    rangesArr: rangesToDelete,
                    proposedReturn: [
                      tag.leftOuterWhitespace,
                      rangeEnd,
                      whiteSpaceCompensation,
                    ],
                  },
                  {
                    kind: cdata ? "cdata" : "comment",
                    start: tag.lastOpeningBracketAt,
                    end: closingFoundAt + 1,
                  },
                );
                pendingMalformedStart = null;

                // offset:
                i = y - 1;
                if (str[y] === ">") {
                  i = y;
                }
                // the cursor moved, so the readings taken at the top of this
                // iteration have to be taken again
                charCode = str.charCodeAt(i);
                opensHere = isOpeningAt(i);
                closesHere = isClosingAt(i);
                // resets:
                tag = {};
                attrObj = {};
                // finally,
                break;
              }
            }
          }
        }
      }
    }

    // catch whitespace
    // -------------------------------------------------------------------------
    if (isWhitespaceCode(charCode) || charCode === 847) {
      // 1. catch chunk boundaries:
      if (chunkOfWhitespaceStartsAt === null) {
        chunkOfWhitespaceStartsAt = i;
        DEV &&
          console.log(
            `${`\u001b[${32}m${`SET`}\u001b[${39}m`} \u001b[${33}m${`chunkOfWhitespaceStartsAt`}\u001b[${39}m = ${chunkOfWhitespaceStartsAt}`,
          );
        if (
          tag.lastOpeningBracketAt !== undefined &&
          tag.lastOpeningBracketAt < i &&
          tag.nameStarts &&
          tag.nameStarts < tag.lastOpeningBracketAt &&
          i === tag.lastOpeningBracketAt + 1 &&
          // insurance against tail part of ranged tag being deleted:
          !rangedOpeningTagsForDeletion.some(
            (rangedTagObj) =>
              rangedTagObj.name?.toLowerCase() === tag.name?.toLowerCase(),
          )
        ) {
          DEV &&
            console.log(
              `RESET ALL \u001b[${31}m${`███████████████████████████████████████`}\u001b[${39}m`,
            );
          tag.onlyPlausible = true;
          tag.name = undefined;
          tag.nameStarts = undefined;
        }
      }

      // 2. catch LF and CR
      if (charCode === 10 || charCode === 13) {
        lastLFCRAt = i;
        DEV &&
          console.log(
            `${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`lastLFCRAt`}\u001b[${39}m`} = ${JSON.stringify(
              lastLFCRAt,
              null,
              4,
            )}`,
          );
        // reset the indentation catcher
        if (nonWhitespaceCharMetSinceLastLFCR) {
          nonWhitespaceCharMetSinceLastLFCR = false;
          DEV &&
            console.log(
              `${`\u001b[${32}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`nonWhitespaceCharMetSinceLastLFCR`}\u001b[${39}m`} = ${JSON.stringify(
                nonWhitespaceCharMetSinceLastLFCR,
                null,
                4,
              )}`,
            );
        }
      }
    } else {
      DEV && console.log(`non-whitespace`);

      // 1. tackle whitespace chunks
      if (chunkOfWhitespaceStartsAt !== null) {
        DEV && console.log();
        // 1. piggyback the catching of the attributes with equal and no value
        if (
          !tag.quotes &&
          attrObj.equalsAt > chunkOfWhitespaceStartsAt - 1 &&
          attrObj.nameEnds &&
          attrObj.equalsAt > attrObj.nameEnds &&
          charCode !== CODE_DOUBLE_QUOTE &&
          charCode !== CODE_SINGLE_QUOTE
        ) {
          /* c8 ignore next */
          if (isObj(attrObj)) {
            DEV &&
              console.log(
                `PUSHING ${`\u001b[${33}m${`attrObj`}\u001b[${39}m`} = ${JSON.stringify(
                  attrObj,
                  null,
                  4,
                )}`,
              );
            tag.attributes.push(attrObj);
          }

          // reset:
          attrObj = {};
          tag.equalsSpottedAt = undefined;
        }
        // 2. reset whitespace marker
        chunkOfWhitespaceStartsAt = null;
        DEV &&
          console.log(
            `${`\u001b[${32}m${`SET`}\u001b[${39}m`} \u001b[${33}m${`chunkOfWhitespaceStartsAt`}\u001b[${39}m = ${chunkOfWhitespaceStartsAt}`,
          );
      }

      // 2. deal with indentation
      if (!nonWhitespaceCharMetSinceLastLFCR) {
        nonWhitespaceCharMetSinceLastLFCR = true;
        DEV &&
          console.log(
            `${`\u001b[${32}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`nonWhitespaceCharMetSinceLastLFCR`}\u001b[${39}m`} = ${JSON.stringify(
              nonWhitespaceCharMetSinceLastLFCR,
              null,
              4,
            )}`,
          );

        // wipe the indentation
        if (
          strip &&
          !isInsideScript &&
          typeof lastLFCRAt === "number" &&
          i &&
          lastLFCRAt < i - 1
        ) {
          if (
            // belt and braces, double-check maybe something went wrong
            // and some non-whitespace got in
            str.slice(lastLFCRAt + 1, i).trim()
          ) {
            lastLFCRAt = null;
            DEV &&
              console.log(
                `${`\u001b[${31}m${`WIPE`}\u001b[${39}m`} ${`\u001b[${33}m${`lastLFCRAt`}\u001b[${39}m`} = ${JSON.stringify(
                  lastLFCRAt,
                  null,
                  4,
                )}`,
              );
          } else if (!resolvedOpts.ignoreIndentations) {
            // the range recorded for the tag in front of this indentation
            // usually reaches right up to here already, having swallowed it -
            // re-pushing it only gives ranges-merge more to collapse later.
            // The end has to match exactly: this range being last, with this
            // end, is something the dumpLinkHrefsNearby branch reads later
            const lastRange = rangesToDelete.last() as Range | null;
            const indentationRange = mapDecodedRange(
              [lastLFCRAt + 1, i],
              str,
              decodeSegments,
            );
            if (
              !lastRange ||
              lastRange[0] > indentationRange[0] ||
              lastRange[1] !== indentationRange[1]
            ) {
              DEV &&
                console.log(
                  `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [lastLFCRAt + 1=${
                    lastLFCRAt + 1
                  }, ${i}]`,
                );
              rangesToDelete.push(indentationRange);
            }
          }
        }
      }
    }

    // catch spaces-only chunks (needed for outer trim option resolvedOpts.trimOnlySpaces)
    // -------------------------------------------------------------------------

    if (charCode === CODE_SPACE) {
      // 1. catch spaces boundaries:
      if (chunkOfSpacesStartsAt === null) {
        chunkOfSpacesStartsAt = i;
        DEV &&
          console.log(
            `${`\u001b[${32}m${`SET`}\u001b[${39}m`} \u001b[${33}m${`chunkOfSpacesStartsAt`}\u001b[${39}m = ${chunkOfSpacesStartsAt}`,
          );
      }
    } else if (chunkOfSpacesStartsAt !== null) {
      // 2. reset the marker
      chunkOfSpacesStartsAt = null;
      DEV &&
        console.log(
          `${`\u001b[${32}m${`SET`}\u001b[${39}m`} \u001b[${33}m${`chunkOfSpacesStartsAt`}\u001b[${39}m = ${chunkOfSpacesStartsAt}`,
        );
    }

    // activate
    // -----------------------------------------------------------------------------
    if (tag.name?.length === 6 && tag.name.toLowerCase() === "script") {
      isInsideScript = !tag.slashPresent;
      DEV &&
        console.log(
          `${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`isInsideScript`}\u001b[${39}m`} = ${JSON.stringify(
            isInsideScript,
            null,
            4,
          )}`,
        );
    }

    // log all
    // -------------------------------------------------------------------------
    DEV && console.log(`\u001b[${32}m${`===============`}\u001b[${39}m`);
    // DEV && console.log(
    //   `${`\u001b[${33}m${`chunkOfSpacesStartsAt`}\u001b[${39}m`} = ${JSON.stringify(
    //     chunkOfSpacesStartsAt,
    //     null,
    //     4
    //   )}`
    // );
    DEV &&
      console.log(
        `${`\u001b[${33}m${`rangedOpeningTagsForDeletion`}\u001b[${39}m`} = ${JSON.stringify(
          rangedOpeningTagsForDeletion,
          null,
          4,
        )}`,
      );
    DEV &&
      console.log(
        `${`\u001b[${33}m${`rangedOpeningTagsForIgnoring`}\u001b[${39}m`} = ${JSON.stringify(
          rangedOpeningTagsForIgnoring,
          null,
          4,
        )}`,
      );
    DEV &&
      console.log(
        `${`\u001b[${33}m${`filteredTagLocations`}\u001b[${39}m`} = ${JSON.stringify(
          filteredTagLocations,
          null,
          4,
        )}`,
      );
    DEV &&
      console.log(
        `${`\u001b[${33}m${`spacesChunkWhichFollowsTheClosingBracketEndsAt`}\u001b[${39}m`} = ${JSON.stringify(
          spacesChunkWhichFollowsTheClosingBracketEndsAt,
          null,
          4,
        )}`,
      );
    // DEV && console.log(
    //   `${`\u001b[${33}m${`chunkOfWhitespaceStartsAt`}\u001b[${39}m`} = ${JSON.stringify(
    //     chunkOfWhitespaceStartsAt,
    //     null,
    //     4
    //   )}`
    // );
    DEV &&
      console.log(
        `${`\u001b[${33}m${`hrefDump`}\u001b[${39}m`} = ${JSON.stringify(
          hrefDump,
          null,
          4,
        )}`,
      );
    DEV &&
      console.log(
        `${`\u001b[${33}m${`attrObj`}\u001b[${39}m`} = ${JSON.stringify(
          attrObj,
          null,
          4,
        )}`,
      );
    DEV &&
      console.log(
        `${
          Object.keys(tag).length
            ? `${`\u001b[${35}m${`tag`}\u001b[${39}m`} = ${Object.keys(tag)

                .map((key) => {
                  return `${`\u001b[${90}m${`\u001b[${7}m${key}\u001b[${27}m`}\u001b[${39}m`} ${`\u001b[${90}m: ${
                    isObj(tag[key]) || Array.isArray(tag[key])
                      ? JSON.stringify(tag[key], null, 4)
                      : tag[key]
                  }\u001b[${39}m`}`;
                })
                .join(",\n")}\n`
            : ""
        }${
          rangesToDelete.ranges?.length
            ? `RANGES: ${JSON.stringify(rangesToDelete.ranges, null, 0)}`
            : ""
        }`,
      );
    DEV &&
      console.log(
        `${`\u001b[${33}m${`strip`}\u001b[${39}m`} = ${`\u001b[${
          strip ? 32 : 31
        }m${JSON.stringify(strip, null, 0)}\u001b[${39}m`}`,
      );
    DEV &&
      console.log(
        `${`\u001b[${33}m${`isInsideScript`}\u001b[${39}m`} = ${`\u001b[${
          isInsideScript ? 32 : 31
        }m${JSON.stringify(isInsideScript, null, 0)}\u001b[${39}m`}`,
      );
    DEV &&
      console.log(
        `${`\u001b[${33}m${`isDoctype`}\u001b[${39}m`} = ${`\u001b[${
          isDoctype ? 32 : 31
        }m${JSON.stringify(isDoctype, null, 0)}\u001b[${39}m`}`,
      );
  }

  DEV && console.log("\n\n\n\n\n\n END \n\n\n\n\n\n");

  // trim but in ranges
  // first tackle the beginning on the string
  if (
    str &&
    // indentations can be trimmed
    !resolvedOpts.ignoreIndentations &&
    // if only spaces were meant to be trimmed,
    ((resolvedOpts.trimOnlySpaces &&
      // and first character is a space
      str[0] === " ") ||
      // if normal trim is requested
      (!resolvedOpts.trimOnlySpaces &&
        // and the first character is whitespace character
        isWhitespaceCode(str.charCodeAt(0))))
  ) {
    DEV && console.log(`trim frontal part`);
    for (let i2 = 0; i2 < len; i2++) {
      if (
        (resolvedOpts.trimOnlySpaces && str[i2] !== " ") ||
        (!resolvedOpts.trimOnlySpaces && !isWhitespaceCode(str.charCodeAt(i2)))
      ) {
        DEV && console.log(`PUSH [0, ${i2}]`);
        pushDecodedRange([0, i2]);
        break;
      } else if (!str[i2 + 1]) {
        // if end has been reached and whole string has been trim-able
        DEV && console.log(`PUSH [0, ${i2 + 1}]`);
        pushDecodedRange([0, i2 + 1]);
      }
    }
  }

  if (
    str &&
    // if only spaces were meant to be trimmed,
    ((resolvedOpts.trimOnlySpaces &&
      // and last character is a space
      str[~-str.length] === " ") ||
      // if normal trim is requested
      (!resolvedOpts.trimOnlySpaces &&
        // and the last character is whitespace character
        isWhitespaceCode(str.charCodeAt(~-str.length))))
  ) {
    for (let i3 = str.length; i3--; ) {
      if (
        (resolvedOpts.trimOnlySpaces && str[i3] !== " ") ||
        (!resolvedOpts.trimOnlySpaces && !isWhitespaceCode(str.charCodeAt(i3)))
      ) {
        DEV && console.log(`PUSH [${i3 + 1}, ${len}]`);
        pushDecodedRange([i3 + 1, len]);
        break;
      }
      // don't tackle end-to-end because it would have been already caught on the
      // start-to-end direction loop above.
    }
  }

  // last correction, imagine we've got text-whitespace-tag.
  // That last part "tag" was removed but "whitespace" in between is on the left.
  // We need to trim() that too if applicable.
  // By now we'll be able to tell, is starting/ending range array touching
  // the start (index 0) or end (str.length - 1) character indexes, and if so,
  // their inner sides will need to be trimmed accordingly, considering the
  // "resolvedOpts.trimOnlySpaces" of course.
  const curr = rangesToDelete.current();
  if ((!userProvidedCb || callbackRangesMatchDefaultProposals) && curr) {
    // check front - the first range of gathered ranges, does it touch start (0)
    if (curr[0] && !curr[0][0]) {
      DEV &&
        console.log(
          `${`\u001b[${33}m${`the first range`}\u001b[${39}m`} = ${JSON.stringify(
            curr[0],
            null,
            4,
          )}`,
        );
      const startingIdx = curr[0][1];
      // check the character at str[startingIdx]
      DEV &&
        console.log(
          `${`\u001b[${33}m${`startingIdx`}\u001b[${39}m`} = ${JSON.stringify(
            startingIdx,
            null,
            4,
          )}`,
        );

      const backupWhatToAdd = rangesToDelete.ranges?.[0]?.[2];

      // manually edit Ranges class:
      (rangesToDelete.ranges as any)[0] = [
        (rangesToDelete.ranges as any)[0][0],
        (rangesToDelete.ranges as any)[0][1],
      ];

      // Default proposals can contain spacing which is redundant at the
      // beginning of the final result. Preserve meaningful callback
      // replacements while removing only that edge whitespace.
      if (backupWhatToAdd?.trim()) {
        (rangesToDelete.ranges as any)[0].push(backupWhatToAdd);
      }
    }

    // check end - the last range of gathered ranges, does it touch the end (str.length)
    // PS. remember ending is not inclusive, so ranges covering the whole ending
    // would go up to str.length, not up to str.length - 1!
    if (curr[curr.length - 1]?.[1] === originalStr.length) {
      DEV &&
        console.log(
          `${`\u001b[${33}m${`the last range`}\u001b[${39}m`} = ${JSON.stringify(
            curr[curr.length - 1],
            null,
            4,
          )}; originalStr.length = ${originalStr.length}`,
        );
      const startingIdx = curr[curr.length - 1][0];
      // check character at str[startingIdx - 1]
      DEV &&
        console.log(
          `${`\u001b[${33}m${`startingIdx`}\u001b[${39}m`} = ${JSON.stringify(
            startingIdx,
            null,
            4,
          )}`,
        );
      // remove third element from the last range "what to add" - because
      // ranges will crop aggressively, covering all whitespace, but they
      // then restore missing spaces (in which case it's not missing).
      // We already have tight crop, we just need to remove that "what to add"
      // third element.

      // hard edit:

      /* c8 ignore next */
      if (rangesToDelete.ranges) {
        let startingIdx2 =
          rangesToDelete.ranges[rangesToDelete.ranges.length - 1][0];

        if (
          originalStr[startingIdx2 - 1] &&
          ((resolvedOpts.trimOnlySpaces &&
            originalStr[startingIdx2 - 1] === " ") ||
            (!resolvedOpts.trimOnlySpaces &&
              isWhitespaceCode(originalStr.charCodeAt(startingIdx2 - 1))))
        ) {
          startingIdx2 -= 1;
        }

        const backupWhatToAdd =
          rangesToDelete.ranges[rangesToDelete.ranges.length - 1][2];

        rangesToDelete.ranges[rangesToDelete.ranges.length - 1] = [
          startingIdx2,
          rangesToDelete.ranges[rangesToDelete.ranges.length - 1][1],
        ];

        // for cases of resolvedOpts.dumpLinkHrefsNearby
        if (backupWhatToAdd?.trim()) {
          rangesToDelete.ranges[rangesToDelete.ranges.length - 1].push(
            backupWhatToAdd.trimRight() as any,
          );
        }
      }
    }
  }

  const ranges = composeOriginalRanges(
    entityDecodeRanges,
    rangesToDelete.current(),
  );

  return {
    log: { timeTakenInMilliseconds: Date.now() - start },
    result: rApply(originalStr, ranges),
    ranges,
    allTagLocations: mapLocationsToOriginal(
      allTagLocations,
      str,
      decodeSegments,
    ),
    filteredTagLocations: mapLocationsToOriginal(
      filteredTagLocations,
      str,
      decodeSegments,
    ),
  };
}

interface DecodeSegment {
  decodedFrom: number;
  decodedTo: number;
  originalFrom: number;
  originalTo: number;
  replacement: boolean;
}

// This mirrors ranges-ent-decode's recursive-entity catch while retaining the
// exact strict decoding semantics this package has always used.
function collectEntityDecodeRanges(str: string): RangesType {
  const entityRegex = /&(?:#?[^;\W]+;)+/g;
  const ranges: Range[] = [];
  let match: RegExpExecArray | null;

  for (match = entityRegex.exec(str); match; match = entityRegex.exec(str)) {
    let decoded = match[0];
    let next = decode(decoded, { scope: "strict" });

    while (decoded !== next) {
      decoded = next;
      next = decode(decoded, { scope: "strict" });
    }

    if (decoded !== match[0]) {
      ranges.push([match.index, match.index + match[0].length, decoded]);
    }
  }

  return ranges.length ? ranges : null;
}

function buildDecodeSegments(
  originalStr: string,
  decodedStr: string,
  entityDecodeRanges: RangesType,
): DecodeSegment[] {
  if (!entityDecodeRanges) {
    return [
      {
        decodedFrom: 0,
        decodedTo: decodedStr.length,
        originalFrom: 0,
        originalTo: originalStr.length,
        replacement: false,
      },
    ];
  }

  const segments: DecodeSegment[] = [];
  let originalAt = 0;
  let decodedAt = 0;

  entityDecodeRanges.forEach(([from, to, insert]) => {
    if (originalAt < from) {
      const length = from - originalAt;
      segments.push({
        decodedFrom: decodedAt,
        decodedTo: decodedAt + length,
        originalFrom: originalAt,
        originalTo: from,
        replacement: false,
      });
      decodedAt += length;
    }

    const replacement = insert || "";
    segments.push({
      decodedFrom: decodedAt,
      decodedTo: decodedAt + replacement.length,
      originalFrom: from,
      originalTo: to,
      replacement: true,
    });
    decodedAt += replacement.length;
    originalAt = to;
  });

  if (originalAt < originalStr.length) {
    segments.push({
      decodedFrom: decodedAt,
      decodedTo: decodedStr.length,
      originalFrom: originalAt,
      originalTo: originalStr.length,
      replacement: false,
    });
  }

  return segments;
}

function mapDecodedStart(
  idx: number,
  decodedStr: string,
  segments: DecodeSegment[],
): { idx: number; prefix: string; segment: DecodeSegment | undefined } {
  let low = 0;
  let high = segments.length - 1;
  let segment: DecodeSegment | undefined;
  while (low <= high) {
    const middle = (low + high) >> 1;
    const candidate = segments[middle];
    if (idx < candidate.decodedFrom) {
      high = middle - 1;
    } else if (idx >= candidate.decodedTo) {
      low = middle + 1;
    } else {
      segment = candidate;
      break;
    }
  }

  if (!segment) {
    return {
      idx: segments.length ? segments[segments.length - 1].originalTo : 0,
      prefix: "",
      segment: undefined,
    };
  }
  if (!segment.replacement) {
    return {
      idx: segment.originalFrom + idx - segment.decodedFrom,
      prefix: "",
      segment,
    };
  }
  return {
    idx: segment.originalFrom,
    prefix: decodedStr.slice(segment.decodedFrom, idx),
    segment,
  };
}

function mapDecodedEnd(
  idx: number,
  decodedStr: string,
  segments: DecodeSegment[],
): { idx: number; suffix: string; segment: DecodeSegment | undefined } {
  if (!idx) {
    return { idx: 0, suffix: "", segment: undefined };
  }

  let low = 0;
  let high = segments.length - 1;
  let segment: DecodeSegment | undefined;
  while (low <= high) {
    const middle = (low + high) >> 1;
    const candidate = segments[middle];
    if (idx <= candidate.decodedFrom) {
      high = middle - 1;
    } else if (idx > candidate.decodedTo) {
      low = middle + 1;
    } else {
      segment = candidate;
      break;
    }
  }

  if (!segment) {
    return {
      idx: segments.length ? segments[segments.length - 1].originalTo : 0,
      suffix: "",
      segment: undefined,
    };
  }
  if (!segment.replacement) {
    return {
      idx: segment.originalFrom + idx - segment.decodedFrom,
      suffix: "",
      segment,
    };
  }
  return {
    idx: segment.originalTo,
    suffix: decodedStr.slice(idx, segment.decodedTo),
    segment,
  };
}

function mapDecodedRange(
  range: CallbackRange,
  decodedStr: string,
  segments: DecodeSegment[],
): CallbackRange;
function mapDecodedRange(
  range: Range,
  decodedStr: string,
  segments: DecodeSegment[],
): Range;
function mapDecodedRange(
  range: Range | CallbackRange,
  decodedStr: string,
  segments: DecodeSegment[],
): Range | CallbackRange {
  const [from, to, insert] = range;
  const mappedFrom = mapDecodedStart(from, decodedStr, segments);
  const mappedTo = mapDecodedEnd(to, decodedStr, segments);
  const hasInsertion = range.length === 3;
  const hasBoundaryContent = Boolean(mappedFrom.prefix || mappedTo.suffix);

  if (hasBoundaryContent) {
    const replacement = `${mappedFrom.prefix}${insert || ""}${mappedTo.suffix}`;
    return replacement
      ? [mappedFrom.idx, mappedTo.idx, replacement]
      : hasInsertion
        ? [mappedFrom.idx, mappedTo.idx, insert]
        : [mappedFrom.idx, mappedTo.idx];
  }

  return hasInsertion
    ? [mappedFrom.idx, mappedTo.idx, insert]
    : [mappedFrom.idx, mappedTo.idx];
}

function mapAttributeToOriginal(
  attribute: Obj,
  decodedStr: string,
  segments: DecodeSegment[],
): Attribute {
  const mapped: { -readonly [Key in keyof Attribute]: Attribute[Key] } = {};
  if (typeof attribute.nameStarts === "number") {
    mapped.nameStarts = mapDecodedStart(
      attribute.nameStarts,
      decodedStr,
      segments,
    ).idx;
  }
  if (typeof attribute.nameEnds === "number") {
    mapped.nameEnds = mapDecodedEnd(
      attribute.nameEnds,
      decodedStr,
      segments,
    ).idx;
  }
  if (typeof attribute.equalsAt === "number") {
    mapped.equalsAt = mapDecodedStart(
      attribute.equalsAt,
      decodedStr,
      segments,
    ).idx;
  }
  if (typeof attribute.name === "string") {
    mapped.name = attribute.name;
  }
  if (typeof attribute.valueStarts === "number") {
    mapped.valueStarts = mapDecodedStart(
      attribute.valueStarts,
      decodedStr,
      segments,
    ).idx;
  }
  if (typeof attribute.valueEnds === "number") {
    mapped.valueEnds = mapDecodedEnd(
      attribute.valueEnds,
      decodedStr,
      segments,
    ).idx;
  }
  if (typeof attribute.value === "string") {
    mapped.value = attribute.value;
  }
  return mapped;
}

function mapTokenToOriginal(
  parserTag: Obj,
  tokenMeta: InternalTokenMeta,
  decodedStr: string,
  segments: DecodeSegment[],
): Tag {
  const start = mapDecodedStart(
    tokenMeta.start,
    decodedStr,
    segments,
  ).idx;
  const end = mapDecodedEnd(tokenMeta.end, decodedStr, segments).idx;

  if (tokenMeta.kind !== "tag") {
    return { kind: tokenMeta.kind, start, end };
  }

  const rawName =
    typeof parserTag.name === "string"
      ? parserTag.name
      : typeof parserTag.nameStarts === "number" &&
          typeof parserTag.nameEnds === "number"
        ? decodedStr.slice(parserTag.nameStarts, parserTag.nameEnds)
        : "";
  const nameStarts =
    typeof parserTag.nameStarts === "number"
      ? mapDecodedStart(parserTag.nameStarts, decodedStr, segments).idx
      : start;
  const nameEnds =
    typeof parserTag.nameEnds === "number"
      ? mapDecodedEnd(parserTag.nameEnds, decodedStr, segments).idx
      : nameStarts + rawName.length;
  const nameContainsLetters =
    typeof parserTag.nameContainsLetters === "boolean"
      ? parserTag.nameContainsLetters
      : /[A-Za-z]/.test(rawName);

  if (tokenMeta.status === "inferred") {
    return {
      kind: "tag",
      status: "inferred",
      start,
      end,
      nameStarts,
      nameContainsLetters,
      nameEnds,
      name: rawName,
    };
  }

  const common: NamedTagBase = {
    kind: "tag",
    start,
    end,
    attributes: Array.isArray(parserTag.attributes)
      ? parserTag.attributes.map((attribute) =>
          mapAttributeToOriginal(attribute, decodedStr, segments),
        )
      : [],
    slashPresent:
      typeof parserTag.slashPresent === "number"
        ? mapDecodedStart(parserTag.slashPresent, decodedStr, segments).idx
        : false,
    leftOuterWhitespace:
      typeof parserTag.leftOuterWhitespace === "number"
        ? mapDecodedStart(
            parserTag.leftOuterWhitespace,
            decodedStr,
            segments,
          ).idx
        : start,
    onlyPlausible:
      typeof parserTag.onlyPlausible === "boolean"
        ? parserTag.onlyPlausible
        : false,
    nameStarts,
    nameContainsLetters,
    nameEnds,
    name: rawName,
  };

  const lastOpeningBracketAt =
    typeof parserTag.lastOpeningBracketAt === "number"
      ? mapDecodedStart(
          parserTag.lastOpeningBracketAt,
          decodedStr,
          segments,
        ).idx
      : start;

  if (tokenMeta.status === "incomplete") {
    return {
      ...common,
      status: "incomplete",
      lastOpeningBracketAt,
    };
  }

  const lastClosingBracketAt =
    typeof parserTag.lastClosingBracketAt === "number"
      ? mapDecodedEnd(
          parserTag.lastClosingBracketAt + 1,
          decodedStr,
          segments,
        ).idx - 1
      : end - 1;
  return {
    ...common,
    status: "complete",
    lastOpeningBracketAt,
    lastClosingBracketAt,
  };
}

function mergeTouchingRanges(ranges: Range[]): RangesType {
  const sorted = [...ranges].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const merged: Range[] = [];

  sorted.forEach((range) => {
    const last = merged.length ? merged[merged.length - 1] : undefined;
    if (last && last[1] === range[0]) {
      const replacement = `${last[2] || ""}${range[2] || ""}`;
      last[1] = range[1];
      if (replacement) {
        last[2] = replacement;
      } else {
        last.length = 2;
      }
    } else {
      merged.push([...range] as Range);
    }
  });

  return merged.length ? merged : null;
}

function composeOriginalRanges(
  entityDecodeRanges: RangesType,
  parserRanges: RangesType,
): RangesType {
  if (!entityDecodeRanges) {
    return parserRanges;
  }

  const originalParserRanges = parserRanges || [];
  const survivingEntityRanges = entityDecodeRanges.filter(
    ([entityFrom, entityTo]) =>
      !originalParserRanges.some(
        ([parserFrom, parserTo]) =>
          parserFrom < entityTo && parserTo > entityFrom,
      ),
  );

  return mergeTouchingRanges([
    ...survivingEntityRanges,
    ...originalParserRanges,
  ]);
}

function mapLocationsToOriginal(
  locations: [number, number][],
  decodedStr: string,
  segments: DecodeSegment[],
): [number, number][] {
  return locations.map(([from, to]) => [
    mapDecodedStart(from, decodedStr, segments).idx,
    mapDecodedEnd(to, decodedStr, segments).idx,
  ]);
}

export { defaults, stripHtml, version };
