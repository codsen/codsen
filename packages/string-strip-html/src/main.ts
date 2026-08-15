import {
  formatDiagnosticValue,
  hasOwnProp,
  isPlainObject as isObj,
} from "codsen-utils";
import { decode } from "html-entities";
import { trim, without } from "lodash-es";
import { rApply } from "ranges-apply";
import { Ranges } from "ranges-push";
import { right } from "string-left-right";
import type { Range, Ranges as RangesType } from "../../../ops/typedefs/common";
import { version as v } from "../package.json";
import {
  characterSuitableForNames,
  countInstancesOf,
  definitelyTagNames,
  inlineTags,
  notWithinAttrQuotes,
  type Obj,
  prepHopefullyAnArray,
  punctuation,
  punctuationTrailing,
  singleLetterTags,
} from "./util";

const version: string = v;

declare let DEV: boolean;

export interface Attribute {
  nameStarts: number;
  nameEnds: number;
  equalsAt?: number;
  name: string;
  valueStarts?: number;
  valueEnds?: number;
  value?: string;
}
export interface Tag {
  attributes: Attribute[];
  lastClosingBracketAt: number;
  lastOpeningBracketAt: number;
  slashPresent: number | false;
  leftOuterWhitespace: number;
  onlyPlausible: boolean;
  nameStarts: number;
  nameContainsLetters: boolean;
  nameEnds: number;
  name: string;
}

export interface CbObj {
  tag: Tag;
  deleteFrom: null | number;
  deleteTo: null | number;
  insert: null | undefined | string;
  rangesArr: Ranges;
  proposedReturn: Range | null;
}

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

  // functions
  // ===========================================================================

  function treatRangedTags(
    i: number,
    resolvedOpts: Opts,
    rangesToDelete: Ranges,
  ): void {
    DEV && console.log(`0197 treatRangedTags(${i}) called`);
    DEV &&
      console.log(
        `0200 resolvedOpts.stripTogetherWithTheirContents = ${JSON.stringify(
          resolvedOpts.stripTogetherWithTheirContents,
          null,
          0,
        )}; tag.name = ${tag.name}`,
      );
    DEV &&
      console.log(
        `0208 FIY, ${`\u001b[${33}m${`rangedOpeningTagsForDeletion`}\u001b[${39}m`} = ${JSON.stringify(
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
      DEV && console.log(`228`);
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
            `0245 \u001b[${31}m${`treatRangedTags():`}\u001b[${39}m closing ranged tag`,
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
                `0268 rangesToDelete.current(): ${JSON.stringify(
                  rangesToDelete.current(),
                  null,
                  0,
                )}`,
              );

            DEV &&
              console.log(
                `0277 ABOUT TO cb()-PUSH RANGE: [${rangedOpeningTagsForDeletion[y].lastOpeningBracketAt}, ${i}]`,
              );

            // also, tend filteredTagLocations in the output - tags which are to be
            // deleted with contents should be reported as one large range in
            // filteredTagLocations - from opening to closing - not two ranges

            DEV &&
              console.log(
                `0286 FIY, ${`\u001b[${33}m${`rangedOpeningTagsForDeletion`}\u001b[${39}m`} = ${JSON.stringify(
                  rangedOpeningTagsForDeletion,
                  null,
                  4,
                )}`,
              );

            DEV &&
              console.log(
                `0295 ${`\u001b[${33}m${`filteredTagLocations`}\u001b[${39}m`} BEFORE: ${JSON.stringify(
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
                `0310 ${`\u001b[${33}m${`filteredTagLocations`}\u001b[${39}m`} AFTER: ${JSON.stringify(
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
                `0324 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
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
                console.log(
                  `0337 ${`\u001b[${32}m${`PING CB()`}\u001b[${39}m`}`,
                );
              resolvedOpts.cb({
                tag: tag as Tag,
                deleteFrom:
                  rangedOpeningTagsForDeletion[y].lastOpeningBracketAt,
                deleteTo: i + 1,
                insert: null,
                rangesArr: rangesToDelete,
                proposedReturn: [
                  rangedOpeningTagsForDeletion[y].lastOpeningBracketAt,
                  i,
                  null,
                ],
              });
              // null will remove any spaces added so far. Opening and closing range tags might
              // have received spaces as separate entities, but those might not be necessary for range:
              // "text <script>deleteme</script>."
            } else if (resolvedOpts.cb) {
              DEV &&
                console.log(
                  `0358 ${`\u001b[${32}m${`PING CB()`}\u001b[${39}m`}`,
                );
              resolvedOpts.cb({
                tag: tag as any,
                deleteFrom:
                  rangedOpeningTagsForDeletion[y].lastOpeningBracketAt,
                deleteTo: i,
                insert: "",
                rangesArr: rangesToDelete,
                proposedReturn: [
                  rangedOpeningTagsForDeletion[y].lastOpeningBracketAt,
                  i,
                  "",
                ],
              });
            }
            // 2. delete the reference to this range from rangedOpeningTagsForDeletion[]
            // because there might be more ranged tags of the same name or
            // different, overlapping or encompassing ranged tags with same
            // or different name.
            rangedOpeningTagsForDeletion.splice(y, 1);
            DEV &&
              console.log(
                `0381 new \u001b[${33}m${`rangedOpeningTagsForDeletion`}\u001b[${39}m = ${JSON.stringify(
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
            `0395 \u001b[${31}m${`treatRangedTags():`}\u001b[${39}m opening ranged tag`,
          );
        rangedOpeningTagsForDeletion.push(tag);
        DEV &&
          console.log(
            `0400 pushed tag{} to \u001b[${33}m${`rangedOpeningTagsForDeletion`}\u001b[${39}m\nwhich is now equal to:\n${JSON.stringify(
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
      DEV && console.log(`411`);
      strip = false;
      DEV &&
        console.log(
          `0415 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`strip`}\u001b[${39}m`} = ${JSON.stringify(
            strip,
            null,
            4,
          )}`,
        );
    }
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
        `0434 \u001b[${35}m${`calculateWhitespaceToInsert() called`}\u001b[${39}m`,
      );
    DEV &&
      console.log(
        `0438 ${`\u001b[${36}m${`currCharIdx`}\u001b[${39}m`} = ${JSON.stringify(
          currCharIdx,
          null,
          4,
        )}`,
      );
    DEV &&
      console.log(
        `0446 ${`\u001b[${36}m${`fromIdx`}\u001b[${39}m`} = ${JSON.stringify(
          fromIdx,
          null,
          4,
        )}`,
      );
    DEV &&
      console.log(
        `0454 ${`\u001b[${36}m${`toIdx`}\u001b[${39}m`} = ${JSON.stringify(
          toIdx,
          null,
          4,
        )}`,
      );
    DEV &&
      console.log(
        `0462 ${`\u001b[${36}m${`lastOpeningBracketAt`}\u001b[${39}m`} = ${JSON.stringify(
          lastOpeningBracketAt,
          null,
          4,
        )}`,
      );
    DEV &&
      console.log(
        `0470 ${`\u001b[${36}m${`lastClosingBracketAt`}\u001b[${39}m`} = ${JSON.stringify(
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

    // firstCovers() reads that off the gathered ranges as they lie. current()
    // answers it too, but it re-merges, re-sorts and re-collapses everything
    // gathered so far, and this runs once per stripped tag, so asking current()
    // here made the whole program quadratic on ordinary HTML.
    if (typeof fromIdx === "number" && rangesToDelete.firstCovers(fromIdx)) {
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
          `0521 ${`\u001b[${35}m${`calculateWhitespaceToInsert(): return null to tackle EOB`}\u001b[${39}m`}`,
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
          `0537 strToEvaluateForLineBreaks = ${JSON.stringify(
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
        DEV &&
          console.log(`0556 trim ${`\u001b[${33}m${`temp`}\u001b[${39}m`} end`);
        temp = temp.trimRight();
        DEV &&
          console.log(
            `0560 now ${`\u001b[${33}m${`temp`}\u001b[${39}m`} = ${JSON.stringify(
              temp,
              null,
              4,
            )}`,
          );
      }

      if (temp.includes("\n") && isOpeningAt(toIdx as number, str2)) {
        strToEvaluateForLineBreaks += " ";
      } else {
        strToEvaluateForLineBreaks += temp;
      }
      DEV &&
        console.log(
          `0575 strToEvaluateForLineBreaks = ${JSON.stringify(
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
        `0586 strToEvaluateForLineBreaks = ${JSON.stringify(
          strToEvaluateForLineBreaks,
          null,
          0,
        )} (length ${strToEvaluateForLineBreaks.length})`,
      );

    const R0 = !punctuation.has(str2[currCharIdx]);
    const R1 =
      str2[(toIdx as number) - 1] !== ">" || !str2[fromIdx as number].trim();
    const R2 = ![`"`, `(`].includes(str2[lastOpeningBracketAt - 1]);
    const R3 = ![";", ".", ":", "!"].includes(str2[currCharIdx]);
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
          `0619 space compensation will be added, R0 ${`\u001b[${
            R0 ? 32 : 31
          }m${`██`}\u001b[${39}m`} R1 ${`\u001b[${
            R1 ? 32 : 31
          }m${`██`}\u001b[${39}m`} R2 ${`\u001b[${
            R2 ? 32 : 31
          }m${`██`}\u001b[${39}m`} R3 ${`\u001b[${
            R3 ? 32 : 31
          }m${`██`}\u001b[${39}m`}`,
        );
      const foundLineBreaks = strToEvaluateForLineBreaks.match(/\n/g);
      if (Array.isArray(foundLineBreaks) && foundLineBreaks.length) {
        if (foundLineBreaks.length === 1) {
          return "\n";
        }
        if (foundLineBreaks.length === 2) {
          return "\n\n";
        }
        DEV &&
          console.log(
            `0639 ${`\u001b[${35}m${`calculateWhitespaceToInsert(): return three line breaks maximum`}\u001b[${39}m`}`,
          );
        return "\n\n\n";
      }
      DEV &&
        console.log(
          `0645 ${`\u001b[${35}m${`calculateWhitespaceToInsert(): default - a single space`}\u001b[${39}m`}`,
        );
      return " ";
    } else {
      DEV &&
        console.log(
          `0651 space compensation won't be added, R0 ${`\u001b[${
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
        `0664 ${`\u001b[${35}m${`calculateWhitespaceToInsert(): default case - nothing`}\u001b[${39}m`}`,
      );
    return "";
  }

  function calculateHrefToBeInserted(resolvedOpts: Opts, toIdx?: number): void {
    DEV && console.log(`0670 calculateHrefToBeInserted() called`);
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
          `0683 calculateHrefToBeInserted(): hrefInsertionActive = "${hrefInsertionActive}"`,
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
          `0699 calculateHrefToBeInserted(): stringToInsertAfter = ${stringToInsertAfter}`,
        );
    }
  }

  function isOpeningAt(i: number, customStr?: string): boolean {
    if (customStr) {
      return customStr[i] === "<" && customStr[i + 1] !== "%";
    }
    return str[i] === "<" && str[i + 1] !== "%";
  }

  function isClosingAt(i: number): boolean {
    return str[i] === ">" && str[i - 1] !== "%";
  }

  function checkIgnoreTagsWithTheirContents(
    i: number,
    resolvedOpts: Opts,
    tag2: Obj,
  ): boolean {
    if (resolvedOpts.ignoreTagsWithTheirContents.includes("*")) {
      DEV && console.log(`0721 ignored tag contents: RETURN TRUE`);
      return true;
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
      DEV &&
        console.log(`0751 checkIgnoreTagsWithTheirContents(): RETURN FALSE`);
      return false;
    }
    DEV &&
      console.log(
        `0756 checkIgnoreTagsWithTheirContents(): RETURN ${resolvedOpts.ignoreTagsWithTheirContents.includes(
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
    resolvedOpts.onlyStripTags = without(
      resolvedOpts.onlyStripTags,
      ...resolvedOpts.ignoreTags,
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
  DEV && console.log(`0905 resolvedOpts.cb type = ${typeof resolvedOpts.cb}`);
  if (!resolvedOpts.cb) {
    resolvedOpts.cb = ({ rangesArr, proposedReturn }) => {
      DEV &&
        console.log(
          `0910 cb(): ${`\u001b[${33}m${`proposedReturn`}\u001b[${39}m`} = ${JSON.stringify(
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
      `0924 string-strip-html: final ${`\u001b[${33}m${`resolvedOpts`}\u001b[${39}m`} = ${JSON.stringify(
        resolvedOpts,
        null,
        4,
      )}; ${`\u001b[${33}m${`input`}\u001b[${39}m`} = "${str}"`,
    );

  // if the links have to be on a new line, we need to increase the allowance for line breaks
  // in Ranges class, it's the ranges-push API setting resolvedOpts.limitLinebreaksCount
  // see https://www.npmjs.com/package/ranges-push#optional-options-object
  const rangesToDelete = new Ranges({
    limitToBeAddedWhitespace: true,
    limitLinebreaksCount: 2,
  });

  // Keep positions anchored to the caller's string while parsing its decoded form.
  const originalStr = str;
  const entityDecodeRanges = resolvedOpts.skipHtmlDecoding
    ? null
    : collectEntityDecodeRanges(str);
  if (entityDecodeRanges) {
    str = rApply(str, entityDecodeRanges);
  }

  let isInsideScript = false;
  let isDoctype = false;
  let currentPercentageDone = 0;
  let lastPercentage = 0;
  const len = str.length;
  const midLen = Math.floor(len / 2);

  // step 1.
  // ===========================================================================

  for (let i = 0; i < len; i++) {
    // Logging:
    // -------------------------------------------------------------------------
    DEV &&
      console.log(
        `0963 \u001b[${36}m${`===============================`}\u001b[${39}m \u001b[${35}m${`str[ ${i} ] = ${`\u001b[${31}m${
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
          DEV && console.log(`1006 DONE ${currentPercentageDone}%`);
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
      Object.keys(tag).length > 1 &&
      tag.lastClosingBracketAt &&
      tag.lastClosingBracketAt < i &&
      str[i] !== " " &&
      spacesChunkWhichFollowsTheClosingBracketEndsAt === null
    ) {
      spacesChunkWhichFollowsTheClosingBracketEndsAt = i;
    }

    // skip known ESP token pairs
    // -------------------------------------------------------------------------
    if (
      !isInsideScript &&
      str[i] === "%" &&
      str[i - 1] === "{" &&
      str.includes("%}", i + 1)
    ) {
      lastLFCRAt = null;
      DEV &&
        console.log(
          `1038 ESP TOKEN! ${`\u001b[${31}m${`WIPE`}\u001b[${39}m`} ${`\u001b[${33}m${`lastLFCRAt`}\u001b[${39}m`} = ${JSON.stringify(
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
            `1051 offset i = ${i}; then ${`\u001b[${32}m${`CONTINUE`}\u001b[${39}m`}`,
          );
        continue;
      }
      // else, do nothing
    }

    // catch the closing bracket of dirty tags with missing opening brackets
    // -------------------------------------------------------------------------
    if (!isInsideScript && isClosingAt(i)) {
      DEV && console.log(`1061 closing bracket caught`);
      // tend cases where opening bracket of a tag is missing:
      if ((!tag || Object.keys(tag).length < 2) && i > 1) {
        DEV && console.log("1064 TRAVERSE BACKWARDS");

        // traverse backwards either until start of string or ">" is found
        for (let y = i; y--; ) {
          DEV &&
            console.log(
              `1070 \u001b[${35}m${`str[${y}] = ${str[y]}`}\u001b[${39}m`,
            );
          if (str[y - 1] === undefined || isClosingAt(y)) {
            DEV && console.log("1073 BREAK");

            const startingPoint = str[y - 1] === undefined ? y : y + 1;
            const culprit = str.slice(startingPoint, i + 1) || "";
            DEV &&
              console.log(
                `1079 CULPRIT: "${`\u001b[${31}m${culprit}\u001b[${39}m`}"`,
              );

            // Check if the culprit starts with a tag that's more likely a tag
            // name (like "body" or "article"). Single-letter tag names are excluded
            // because they can be plausible, ie. in math texts and so on.
            // Nobody uses puts comparison signs between words like: "article > ",
            // but single letter names can be plausible: "a > b" in math.

            DEV &&
              console.log(
                `1090 "${trim(
                  (culprit as any)
                    .trim()
                    .split(/\s+/)
                    .filter((val2: string) => val2.trim())
                    .filter((_val3: string, i3: number) => i3 === 0),
                  "/>",
                )}"`,
              );

            if (
              // quick, more efficient catches:
              (culprit.includes(`/>`) ||
                culprit.includes(`/ >`) ||
                culprit.includes(`="`) ||
                culprit.includes(`='`)) &&
              str !== `<${trim(culprit.trim(), "/>")}>` && // recursion prevention
              [...definitelyTagNames].some(
                (val) =>
                  trim(
                    (culprit as any)
                      .trim()
                      .split(/\s+/)
                      .filter((val2: string) => val2.trim())
                      .filter((_val3: string, i3: number) => i3 === 0),
                    "/>",
                  ).toLowerCase() === val,
              ) &&
              stripHtml(`<${culprit.trim()}>`, resolvedOpts).result === ""
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
                    `1129 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
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
                    `1144 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
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
                  `1162 \u001b[${33}m${`SUBMIT RANGE #3: [${startingPoint}, ${
                    i + 1
                  }, "${whiteSpaceCompensation}"]`}\u001b[${39}m`,
                );
              let deleteUpTo = i + 1;
              if (str[deleteUpTo] && !str[deleteUpTo].trim()) {
                for (let z = deleteUpTo; z < len; z++) {
                  if (str[z].trim()) {
                    deleteUpTo = z;
                    break;
                  }
                }
              }
              DEV &&
                console.log(
                  `1177 cb()-PUSHING [${startingPoint}, ${deleteUpTo}, "${whiteSpaceCompensation}"]`,
                );
              resolvedOpts.cb({
                tag: tag as any,
                deleteFrom: startingPoint,
                deleteTo: deleteUpTo,
                insert: whiteSpaceCompensation,
                rangesArr: rangesToDelete,
                proposedReturn: [
                  startingPoint,
                  deleteUpTo,
                  whiteSpaceCompensation,
                ],
              });
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
      str[i] === "/" &&
      !tag.quotes?.value &&
      Number.isInteger(tag.lastOpeningBracketAt) &&
      !Number.isInteger(tag.lastClosingBracketAt)
    ) {
      DEV &&
        console.log(
          `1209 \u001b[${33}m${`tag.slashPresent`}\u001b[${39}m = true`,
        );
      tag.slashPresent = i;
    }

    // catch double or single quotes
    // -------------------------------------------------------------------------
    if (str[i] === '"' || str[i] === "'") {
      DEV && console.log(`1217 quote clauses`);
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
              `1233 PUSHING ${`\u001b[${33}m${`attrObj`}\u001b[${39}m`} = ${JSON.stringify(
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
                `1269 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`hrefDump`}\u001b[${39}m`} = ${JSON.stringify(
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
            `1281 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} tag.quotes = {}, tag.quotes.value = ${
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
              `1300 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrObj`}\u001b[${39}m`} = ${JSON.stringify(
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
      (!str[i].trim() || !characterSuitableForNames(str[i]))
    ) {
      // 1. mark the name ending
      tag.nameEnds = i;
      DEV &&
        console.log(
          `1321 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} \u001b[${33}m${`tag.nameEnds`}\u001b[${39}m = ${
            tag.nameEnds
          }`,
        );
      // 2. extract the full name string
      /* c8 ignore next */
      tag.name = str.slice(
        tag.nameStarts,
        tag.nameEnds +
          /* c8 ignore next */
          (!isClosingAt(i) && str[i] !== "/" && str[i + 1] === undefined
            ? 1
            : 0),
      );
      DEV &&
        console.log(
          `1337 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} \u001b[${33}m${`tag.name`}\u001b[${39}m = ${
            tag.name
          }`,
        );

      DEV &&
        console.log(
          `1344 ${`\u001b[${33}m${`tag`}\u001b[${39}m`} is currently = ${JSON.stringify(
            tag,
            null,
            4,
          )}`,
        );

      if (
        // if we caught "----" from "<----" or "---->", bail:
        (str[tag.nameStarts - 1] !== "!" && // protection against <!--
          !tag.name.replace(/-/g, "").length) ||
        // if tag name starts with a number character
        /^\d+$/.test(tag.name[0])
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
            `1369 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`isDoctype`}\u001b[${39}m`} = ${JSON.stringify(
              isDoctype,
              null,
              4,
            )}`,
          );
      }

      if (isOpeningAt(i)) {
        // process it because we need to tackle this new tag
        DEV && console.log(`1379 opening bracket caught`);

        calculateHrefToBeInserted(resolvedOpts);
        DEV &&
          console.log(
            `1384 ${`\u001b[${33}m${`stringToInsertAfter`}\u001b[${39}m`} = ${JSON.stringify(
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
            `1409 \u001b[${33}m${`cb()-PUSH: [${tag.leftOuterWhitespace}, ${i}, "${whiteSpaceCompensation}${stringToInsertAfter}${whiteSpaceCompensation}"]`}\u001b[${39}m`,
          );
        DEV &&
          console.log(
            `1413 ${`\u001b[${33}m${`tag`}\u001b[${39}m`} = ${JSON.stringify(
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
              `1431 ${`\u001b[${33}m${`filteredTagLocations`}\u001b[${39}m`} BEFORE: ${JSON.stringify(
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
              `1443 ${`\u001b[${33}m${`filteredTagLocations`}\u001b[${39}m`} AFTER: ${JSON.stringify(
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

        DEV &&
          console.log(`1459 ${`\u001b[${32}m${`PING CB()`}\u001b[${39}m`}`);
        resolvedOpts.cb({
          tag: tag as Tag,
          deleteFrom: tag.leftOuterWhitespace,
          deleteTo: i,
          insert: `${whiteSpaceCompensation}${stringToInsertAfter}${whiteSpaceCompensation}`,
          rangesArr: rangesToDelete,
          proposedReturn: [
            tag.leftOuterWhitespace,
            i,
            `${whiteSpaceCompensation}${stringToInsertAfter}${whiteSpaceCompensation}`,
          ],
        });
        resetHrefMarkers();

        // also,
        treatRangedTags(i, resolvedOpts, rangesToDelete);
      }
    }

    // catch beginning of an attribute value
    // -------------------------------------------------------------------------
    if (
      tag.quotes?.start &&
      tag.quotes.start < i &&
      !tag.quotes.end &&
      attrObj.nameEnds &&
      attrObj.equalsAt &&
      !attrObj.valueStarts
    ) {
      DEV &&
        console.log(
          `1491 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} \u001b[${33}m${`attrObj.valueStarts`}\u001b[${39}m = ${
            attrObj.valueStarts
          }`,
        );
      attrObj.valueStarts = i;
    }

    // catch rare cases when attributes name has some space after it, before equals
    // -------------------------------------------------------------------------
    if (
      !tag.quotes &&
      attrObj.nameEnds &&
      str[i] === "=" &&
      !attrObj.valueStarts &&
      !attrObj.equalsAt
    ) {
      attrObj.equalsAt = i;

      DEV &&
        console.log(
          `1511 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} \u001b[${33}m${`attrObj.equalsAt`}\u001b[${39}m = ${
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
      !tag.quotes &&
      attrObj.nameStarts &&
      attrObj.nameEnds &&
      !attrObj.valueStarts &&
      str[i].trim() &&
      str[i] !== "="
    ) {
      // if (!tag.attributes) {
      //   tag.attributes = [];
      // }
      tag.attributes.push(attrObj);
      DEV &&
        console.log("1535 PUSHED attrObj into tag.attributes, reset attrObj");
      attrObj = {};
    }

    // catch the ending of an attribute's name
    // -------------------------------------------------------------------------
    if (!tag.quotes && attrObj.nameStarts && !attrObj.nameEnds) {
      DEV && console.log("1542");
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
              `1558 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrObj.nameEnds`}\u001b[${39}m`} = ${JSON.stringify(
                attrObj.nameEnds,
                null,
                4,
              )}`,
            );
          attrObj.name = str.slice(attrObj.nameStarts, attrObj.nameEnds);
        }
      } else if (!str[i].trim()) {
        attrObj.nameEnds = i;
        DEV &&
          console.log(
            `1570 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrObj.nameEnds`}\u001b[${39}m`} = ${JSON.stringify(
              attrObj.nameEnds,
              null,
              4,
            )}`,
          );
        attrObj.name = str.slice(attrObj.nameStarts, attrObj.nameEnds);
      } else if (str[i] === "=") {
        DEV && console.log(`1578 equal char clauses`);
        /* c8 ignore next */
        if (!attrObj.equalsAt) {
          DEV && console.log(`1581 equal hasn't been met`);
          attrObj.nameEnds = i;
          DEV &&
            console.log(
              `1585 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrObj.nameEnds`}\u001b[${39}m`} = ${JSON.stringify(
                attrObj.nameEnds,
                null,
                4,
              )}`,
            );
          attrObj.equalsAt = i;
          DEV &&
            console.log(
              `1594 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrObj.equalsAt`}\u001b[${39}m`} = ${JSON.stringify(
                attrObj.equalsAt,
                null,
                4,
              )}`,
            );
          attrObj.name = str.slice(attrObj.nameStarts, attrObj.nameEnds);
        }
      } else if (str[i] === "/" || isClosingAt(i)) {
        DEV &&
          console.log(
            `1605 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrObj.nameEnds`}\u001b[${39}m`} = ${JSON.stringify(
              attrObj.nameEnds,
              null,
              4,
            )}`,
          );
        attrObj.nameEnds = i;
        attrObj.name = str.slice(attrObj.nameStarts, attrObj.nameEnds);
        DEV &&
          console.log(
            `1615 \u001b[${33}m${`PUSH attrObj and wipe`}\u001b[${39}m`,
          );
        // if (!tag.attributes) {
        //   tag.attributes = [];
        // }
        tag.attributes.push(attrObj);
        attrObj = {};
      } else if (isOpeningAt(i)) {
        DEV &&
          console.log(
            `1625 \u001b[${33}m${`ATTR NAME ENDS WITH NEW TAG`}\u001b[${39}m - ${`\u001b[${31}m${`TODO`}\u001b[${39}m`}`,
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
      !tag.quotes &&
      tag.nameEnds < i &&
      !str[i - 1].trim() &&
      str[i].trim() &&
      !`<>/!`.includes(str[i]) &&
      !attrObj.nameStarts &&
      !tag.lastClosingBracketAt
    ) {
      attrObj.nameStarts = i;
      DEV &&
        console.log(
          `1652 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} \u001b[${33}m${`attrObj.nameStarts`}\u001b[${39}m = ${
            attrObj.nameStarts
          }`,
        );
    }

    // catch "< /" - turn off "onlyPlausible"
    // -------------------------------------------------------------------------
    if (
      tag.lastOpeningBracketAt !== null &&
      tag.lastOpeningBracketAt < i &&
      str[i] === "/" &&
      tag.onlyPlausible
    ) {
      tag.onlyPlausible = false;
    }

    // catch character that follows an opening bracket:
    // -------------------------------------------------------------------------
    if (
      tag.lastOpeningBracketAt !== null &&
      tag.lastOpeningBracketAt < i &&
      str[i] !== "/" // there can be closing slashes in various places, legit and not
    ) {
      // 1. identify, is it definite or just plausible tag
      if (tag.onlyPlausible === undefined) {
        if ((!str[i].trim() || isOpeningAt(i)) && !tag.slashPresent) {
          tag.onlyPlausible = true;
        } else {
          tag.onlyPlausible = false;
        }
        DEV &&
          console.log(
            `1685 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} \u001b[${33}m${`tag.onlyPlausible`}\u001b[${39}m = ${
              tag.onlyPlausible
            }`,
          );
      }
      // 2. catch the beginning of the tag name. Consider custom HTML tag names
      // and also known (X)HTML tags:
      if (
        str[i].trim() &&
        tag.nameStarts === undefined &&
        !isOpeningAt(i) &&
        str[i] !== "/" &&
        !isClosingAt(i) &&
        str[i] !== "!"
      ) {
        if (/[-?_A-Za-z]/.test(str[i])) {
          tag.nameStarts = i;
          tag.nameContainsLetters = false;
          DEV &&
            console.log(
              `1705 \u001b[${33}m${`tag.nameStarts`}\u001b[${39}m = ${
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
    if (
      tag.nameStarts &&
      !tag.quotes &&
      typeof str[i] === "string" &&
      str[i].toLowerCase() !== str[i].toUpperCase()
    ) {
      tag.nameContainsLetters = true;
    }

    // catch closing bracket
    // -------------------------------------------------------------------------
    if (
      // it's closing bracket
      isClosingAt(i) &&
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
      DEV && console.log(`1759 caught a closing bracket`);

      if (tag.lastOpeningBracketAt !== undefined) {
        // 1. mark the index
        tag.lastClosingBracketAt = i;

        DEV &&
          console.log(
            `1767 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} tag.lastClosingBracketAt = ${
              tag.lastClosingBracketAt
            }`,
          );
        // 2. reset the spacesChunkWhichFollowsTheClosingBracketEndsAt
        spacesChunkWhichFollowsTheClosingBracketEndsAt = null;
        // 3. push attrObj into tag.attributes[]
        if (Object.keys(attrObj).length) {
          DEV &&
            console.log(
              `1777 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} \u001b[${33}m${`attrObj`}\u001b[${39}m & reset`,
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
              `1795 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`hrefDump`}\u001b[${39}m`} openingTagEnds, now = ${JSON.stringify(
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
          `1806 ELSE CLAUSES: R1=${isClosingAt(i)} && R2=${notWithinAttrQuotes(
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
      (!isDoctype || str[i] === ">") &&
      tag.lastOpeningBracketAt !== undefined
    ) {
      DEV && console.log(`1822 opening bracket has been met`);
      DEV &&
        console.log(
          `1825 FIY, ${`\u001b[${33}m${`tag.lastClosingBracketAt`}\u001b[${39}m`} = ${JSON.stringify(
            tag.lastClosingBracketAt,
            null,
            4,
          )}`,
        );
      if (tag.lastClosingBracketAt === undefined) {
        if (
          tag.lastOpeningBracketAt < i &&
          !isOpeningAt(i) && // to prevent cases like "text <<<<<< text"
          (str[i + 1] === undefined ||
            (isOpeningAt(i + 1) && !tag?.quotes?.value)) &&
          tag.nameContainsLetters &&
          typeof tag.nameStarts === "number"
        ) {
          DEV && console.log(`1840 str[i + 1] = ${str[i + 1]}`);
          // find out the tag name earlier than dedicated tag name ending catching section:
          tag.name = str
            .slice(tag.nameStarts, tag.nameEnds || i + 1)
            .toLowerCase();

          DEV &&
            console.log(
              `1848 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`tag.name`}\u001b[${39}m`} = ${JSON.stringify(
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
                `1865 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
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
                `1885 Ignored tag - \u001b[${31}m${`WIPE AND RESET`}\u001b[${39}m`,
              );
            tag = {};
            attrObj = {};
            continue;
          }

          // if the tag is only plausible (there's space after opening bracket) and it's not among
          // recognised tags, leave it as it is:

          DEV && console.log(`1895`);
          if (
            ((definitelyTagNames.has(tag.name) ||
              singleLetterTags.has(tag.name)) &&
              (tag.onlyPlausible === false ||
                (tag.onlyPlausible === true && tag.attributes.length))) ||
            str[i + 1] === undefined
          ) {
            calculateHrefToBeInserted(resolvedOpts);
            DEV &&
              console.log(
                `1906 ${`\u001b[${33}m${`stringToInsertAfter`}\u001b[${39}m`} = ${JSON.stringify(
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
                `1924 \u001b[${33}m${`cb()-PUSH: [${tag.leftOuterWhitespace}, ${
                  i + 1
                }, "${whiteSpaceCompensation || ""}${
                  stringToInsertAfter || ""
                }${whiteSpaceCompensation || ""}"]`}\u001b[${39}m`,
              );
            DEV &&
              console.log(
                `1932 ${`\u001b[${33}m${`tag`}\u001b[${39}m`} = ${JSON.stringify(
                  tag,
                  null,
                  4,
                )}`,
              );

            if (
              isInsideScript &&
              tag.name?.toLowerCase() === "script" &&
              tag.slashPresent
            ) {
              isInsideScript = false;
              DEV &&
                console.log(
                  `1947 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`isInsideScript`}\u001b[${39}m`} = ${JSON.stringify(
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
                `1966 ${`\u001b[${33}m${`insert`}\u001b[${39}m`} = ${JSON.stringify(
                  insert,
                  null,
                  4,
                )}`,
              );

            DEV &&
              console.log(`1974 ${`\u001b[${32}m${`PING CB()`}\u001b[${39}m`}`);
            resolvedOpts.cb({
              tag: tag as Tag,
              deleteFrom: tag.leftOuterWhitespace,
              deleteTo: i + 1,
              insert,
              rangesArr: rangesToDelete,
              proposedReturn: [tag.leftOuterWhitespace, i + 1, insert],
            });
            resetHrefMarkers();

            // also,
            treatRangedTags(i, resolvedOpts, rangesToDelete);
          }
          DEV && console.log(`1988`);

          /* c8 ignore next */
          if (
            !filteredTagLocations.length ||
            (filteredTagLocations[filteredTagLocations.length - 1][0] !==
              tag.lastOpeningBracketAt &&
              filteredTagLocations[filteredTagLocations.length - 1][1] !==
                i + 1)
          ) {
            DEV && console.log(`1998`);

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
                  `2011 FIY, ${`\u001b[${33}m${`rangedOpeningTagsForDeletion`}\u001b[${39}m`} = ${JSON.stringify(
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
                      `2031 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`lastRangedOpeningTag`}\u001b[${39}m`} = ${JSON.stringify(
                        lastRangedOpeningTag,
                        null,
                        4,
                      )}`,
                    );
                  DEV && console.log(`2037 BREAK`);
                }
              }

              /* c8 ignore next */
              if (lastRangedOpeningTag) {
                DEV &&
                  console.log(
                    `2045 ${`\u001b[${33}m${`filteredTagLocations`}\u001b[${39}m`} BEFORE: ${JSON.stringify(
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
                    `2057 ${`\u001b[${33}m${`filteredTagLocations`}\u001b[${39}m`} AFTER: ${JSON.stringify(
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
                    `2070 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                      lastRangedOpeningTag.lastOpeningBracketAt
                    }, ${i + 1}] to filteredTagLocations`,
                  );
              } else {
                /* c8 ignore next */
                filteredTagLocations.push([tag.lastOpeningBracketAt, i + 1]);
                DEV &&
                  console.log(
                    `2079 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                      tag.lastOpeningBracketAt
                    }, ${i + 1}] to filteredTagLocations`,
                  );
              }
            } else {
              // if it's not ranged tag, just push it as it is to filteredTagLocations
              filteredTagLocations.push([tag.lastOpeningBracketAt, i + 1]);
              DEV &&
                console.log(
                  `2089 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                    tag.lastOpeningBracketAt
                  }, ${i + 1}] to filteredTagLocations`,
                );
            }
          }
        }
        DEV && console.log(`2096 end`);
      } else if (
        (i > tag.lastClosingBracketAt && str[i].trim()) ||
        str[i + 1] === undefined ||
        // on markdown-friendly settings, when indentations are ignored,
        // stop at the first line break
        (resolvedOpts.ignoreIndentations && `\r\n`.includes(str[i]))
      ) {
        DEV && console.log(`2104 closing bracket has been met`);
        // case 2. closing bracket HAS BEEN met
        // we'll look for a non-whitespace character and delete up to it
        // BUT, we'll wipe the tag object only if that non-whitespace character
        // is not a ">". This way we'll catch and delete sequences of closing brackets.

        // part 1.

        let endingRangeIndex = tag.lastClosingBracketAt === i ? i + 1 : i;
        DEV &&
          console.log(
            `2115 ${`\u001b[${33}m${`endingRangeIndex`}\u001b[${39}m`} = ${JSON.stringify(
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
            `2137 ${`\u001b[${33}m${`tag.name`}\u001b[${39}m`} = ${JSON.stringify(
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
              `2157 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
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
            `2173 SET ignoreTags = ${ignoreTags}; ignoreTagsWithTheirContents = ${ignoreTagsWithTheirContents}`,
          );

        DEV && console.log(`2176 onlyStripTagsMode = ${onlyStripTagsMode}`);
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
          DEV && console.log(`2189`);
          // if the "strip" flag is not activated, if we're not already between
          // ranged ignored tags, activate the "strip" flag
          if (ignoreTagsWithTheirContents) {
            // it depends, is it an opening tag
            if (tag.slashPresent) {
              DEV && console.log(`2195 it's an closing closing ranged tag`);

              for (let y = rangedOpeningTagsForIgnoring.length; y--; ) {
                if (rangedOpeningTagsForIgnoring[y].name === tag.name) {
                  // 2. delete the reference to this tag
                  rangedOpeningTagsForIgnoring.splice(y, 1);
                  DEV &&
                    console.log(
                      `2203 new \u001b[${33}m${`rangedOpeningTagsForIgnoring`}\u001b[${39}m = ${JSON.stringify(
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
                    `2220 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`strip`}\u001b[${39}m`} = ${JSON.stringify(
                      strip,
                      null,
                      4,
                    )}`,
                  );
              }
            } else {
              DEV && console.log(`2228 it's an opening closing ranged tag`);
              if (strip) {
                strip = false;
                DEV &&
                  console.log(
                    `2233 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`strip`}\u001b[${39}m`} = ${JSON.stringify(
                      strip,
                      null,
                      4,
                    )}`,
                  );
              }

              rangedOpeningTagsForIgnoring.push(tag);
              DEV &&
                console.log(
                  `2244 pushed tag{} to \u001b[${33}m${`rangedOpeningTagsForIgnoring`}\u001b[${39}m\nwhich is now equal to:\n${JSON.stringify(
                    rangedOpeningTagsForIgnoring,
                    null,
                    4,
                  )}`,
                );
            }
          }

          DEV &&
            console.log(
              `2255 ${`\u001b[${32}m${`PING CB() with nulls`}\u001b[${39}m`}`,
            );
          resolvedOpts.cb({
            tag: tag as Tag,
            deleteFrom: null,
            deleteTo: null,
            insert: null,
            rangesArr: rangesToDelete,
            proposedReturn: null,
          });

          // don't submit the tag onto "filteredTagLocations"

          // then reset:
          DEV &&
            console.log(
              `2271 Ignored tag - \u001b[${31}m${`WIPE AND RESET`}\u001b[${39}m`,
            );
          tag = {};
          attrObj = {};
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
                `2298 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
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
              `2317 ${`\u001b[${33}m${`whiteSpaceCompensation`}\u001b[${39}m`} = ${JSON.stringify(
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
              `2334 ${`\u001b[${33}m${`stringToInsertAfter`}\u001b[${39}m`} = ${JSON.stringify(
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
                `2350 SET ${`\u001b[${33}m${`insert`}\u001b[${39}m`} = ${JSON.stringify(
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
                  `2381 ${`\u001b[${32}m${`append`}\u001b[${39}m`} trailing space to "insert"`,
                );
              insert += " ";
            }
            DEV &&
              console.log(
                `2387 ${`\u001b[${36}m${`latest`}\u001b[${39}m`} rangesToDelete.current(): ${JSON.stringify(
                  rangesToDelete.current(),
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
              (rangesToDelete.last() as Range)[1] < tag.lastOpeningBracketAt &&
              (!resolvedOpts?.dumpLinkHrefsNearby?.putOnNewLine ||
                !punctuationTrailing.has(str[endingRangeIndex]))
            ) {
              insert = ` ${insert}`;
              DEV &&
                console.log(
                  `2420 ${`\u001b[${32}m${`prepend`}\u001b[${39}m`} trailing space to "insert"`,
                );
            }

            DEV &&
              console.log(
                `2426 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`insert`}\u001b[${39}m`} = ${JSON.stringify(
                  insert,
                  null,
                  4,
                )}`,
              );
          } else {
            insert = whiteSpaceCompensation;
            DEV &&
              console.log(
                `2436 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`insert`}\u001b[${39}m`} = ${JSON.stringify(
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
                `2456 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`insert`}\u001b[${39}m`} = ${JSON.stringify(
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
          DEV && console.log(`2478 ███████████████████████████████████████`);
          DEV &&
            console.log(
              `2481 ${`\u001b[${33}m${`punctuationTrailing.has(str[endingRangeIndex])`}\u001b[${39}m`} = ${JSON.stringify(
                punctuationTrailing.has(str[endingRangeIndex]),
                null,
                4,
              )}`,
            );
          if (
            hrefInsertionActive &&
            punctuationTrailing.has(str[endingRangeIndex])
          ) {
            DEV && console.log(`2491`);
            if (resolvedOpts.dumpLinkHrefsNearby?.putOnNewLine) {
              DEV &&
                console.log(
                  `2495 bring ${str[endingRangeIndex]} forward from index ${endingRangeIndex} to ${tag.leftOuterWhitespace}`,
                );
              insert = `${str[endingRangeIndex]}${insert ? insert : ""}`;
            }

            const nextCharOnTheRight = right(str, endingRangeIndex);
            DEV &&
              console.log(
                `2503 ███████████████████████████████████████ ${`\u001b[${33}m${`nextCharOnTheRight`}\u001b[${39}m`} = ${JSON.stringify(
                  nextCharOnTheRight,
                  null,
                  4,
                )}`,
              );

            if (nextCharOnTheRight && insert?.endsWith("\n")) {
              DEV && console.log(`2511`);
              punctuationCorrection += nextCharOnTheRight - i;
            } else if (!nextCharOnTheRight || nextCharOnTheRight > i) {
              DEV && console.log(`2514`);
              punctuationCorrection++;
            }

            DEV &&
              console.log(
                `2520 ${`\u001b[${32}m${`BUMP`}\u001b[${39}m`} ${`\u001b[${33}m${`punctuationCorrection`}\u001b[${39}m`} to ${JSON.stringify(
                  punctuationCorrection,
                  null,
                  4,
                )}`,
              );
          }

          // pass the range onto the callback function, be it default or user's
          DEV &&
            console.log(
              `2531 \u001b[${33}m${`cb()-SUBMIT RANGE #2: [${
                tag.leftOuterWhitespace
              }, ${endingRangeIndex}, ${JSON.stringify(
                insert,
                null,
                0,
              )}]`}\u001b[${39}m`,
            );
          resolvedOpts.cb({
            tag: tag as Tag,
            deleteFrom: tag.leftOuterWhitespace,
            deleteTo: endingRangeIndex + punctuationCorrection,
            insert,
            rangesArr: rangesToDelete,
            proposedReturn: [
              tag.leftOuterWhitespace,
              endingRangeIndex + punctuationCorrection,
              insert,
            ],
          });
          resetHrefMarkers();

          // also,
          treatRangedTags(i, resolvedOpts, rangesToDelete);
        } else {
          DEV && console.log(`2556 \u001b[${33}m${`RESET tag{}`}\u001b[${39}m`);
          tag = {};
        }

        // part 2.
        if (!isClosingAt(i)) {
          DEV && console.log(`2562 \u001b[${33}m${`RESET tag{}`}\u001b[${39}m`);
          tag = {};
        }
      }

      // toggle off the isDoctype
      if (isDoctype) {
        isDoctype = false;
        DEV &&
          console.log(
            `2572 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`isDoctype`}\u001b[${39}m`} = ${JSON.stringify(
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
        (str[i] === "<" &&
          right(str, right(str, i)) &&
          str[right(str, i) as number] === "/" &&
          /^script/i.test(str.slice(right(str, right(str, i)) as number)))) &&
      isOpeningAt(i) &&
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
          `2631 ${`\u001b[${32}m${`caught opening bracket`}\u001b[${39}m`}`,
        );
      // cater sequences of opening brackets "<<<<div>>>"
      if (isClosingAt(right(str, i) as number)) {
        // cater cases like: "<><><>"
        DEV && console.log(`2636 cases like <><><>`);
        continue;
      } else {
        DEV && console.log(`2639 opening brackets else clauses`);
        // 1. Before (re)setting flags, check, do we have a case of a tag with a
        // missing closing bracket, and this is a new tag following it.

        DEV &&
          console.log(
            `2645 R1: ${!!tag.nameEnds}; R2: ${
              tag.nameEnds < i
            }; R3: ${!tag.lastClosingBracketAt}`,
          );
        if (tag.nameEnds && tag.nameEnds < i && !tag.lastClosingBracketAt) {
          DEV && console.log(`2650`);
          DEV &&
            console.log(
              `2653 R1: ${!!tag.onlyPlausible}; R2: ${!definitelyTagNames.has(
                tag.name,
              )}; R3: ${!singleLetterTags.has(tag.name)}; R4: ${!tag.attributes
                ?.length}`,
            );
          if (
            (tag.onlyPlausible === true && tag.attributes?.length) ||
            tag.onlyPlausible === false
          ) {
            DEV && console.log(`2662`);
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
                `2675 cb()-PUSH range [${tag.leftOuterWhitespace}, ${i}, "${whiteSpaceCompensation}"]`,
              );
            resolvedOpts.cb({
              tag: tag as Tag,
              deleteFrom: tag.leftOuterWhitespace,
              deleteTo: i,
              insert: whiteSpaceCompensation,
              rangesArr: rangesToDelete,
              proposedReturn: [
                tag.leftOuterWhitespace,
                i,
                whiteSpaceCompensation,
              ],
            });

            // also,
            treatRangedTags(i, resolvedOpts, rangesToDelete);

            // then, for continuity, mark everything up accordingly if it's a new bracket:
            tag = {};
            attrObj = {};
          }
        }

        // 2. if new tag starts, reset:
        if (
          tag.lastOpeningBracketAt !== undefined &&
          tag.onlyPlausible &&
          tag.name &&
          !tag.quotes
        ) {
          // reset:
          DEV &&
            console.log(`2708 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} tag`);
          tag.lastOpeningBracketAt = undefined;
          tag.name = undefined;
          tag.onlyPlausible = false;
          DEV &&
            console.log(
              `2714 NOW ${`\u001b[${33}m${`tag`}\u001b[${39}m`} = ${JSON.stringify(
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

          // tag.leftOuterWhitespace =
          //   chunkOfWhitespaceStartsAt === null ? i : chunkOfWhitespaceStartsAt;

          DEV &&
            console.log(
              `2754 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} \u001b[${33}m${`tag.leftOuterWhitespace`}\u001b[${39}m = ${
                tag.leftOuterWhitespace
              }; \u001b[${33}m${`tag.lastOpeningBracketAt`}\u001b[${39}m = ${
                tag.lastOpeningBracketAt
              }; \u001b[${33}m${`tag.slashPresent`}\u001b[${39}m = false`,
            );

          // tend the HTML comments: <!-- --> or CDATA: <![CDATA[ ... ]]>
          // if opening comment tag is detected, traverse forward aggressively
          // until EOL or "-->" is reached and offset outer index "i".
          if (
            `${str[i + 1]}${str[i + 2]}${str[i + 3]}` === "!--" ||
            `${str[i + 1]}${str[i + 2]}${str[i + 3]}${str[i + 4]}${str[i + 5]}${
              str[i + 6]
            }${str[i + 7]}${str[i + 8]}` === "![CDATA["
          ) {
            DEV &&
              console.log(
                `2772 \u001b[${31}m${`███████████████████████████████████████`}\u001b[${39}m`,
              );
            // make a note which one it is:
            let cdata = true;
            if (str[i + 2] === "-") {
              cdata = false;
            }
            DEV && console.log("2779 traversing forward");
            let closingFoundAt: number | undefined;
            for (let y = i; y < len; y++) {
              DEV &&
                console.log(
                  `2784 ${`\u001b[${33}m${`str[${y}]`}\u001b[${39}m`} = ${str[y]}`,
                );
              if (
                (!closingFoundAt &&
                  cdata &&
                  `${str[y - 2]}${str[y - 1]}${str[y]}` === "]]>") ||
                (!cdata && `${str[y - 2]}${str[y - 1]}${str[y]}` === "-->")
              ) {
                closingFoundAt = y;
                DEV && console.log(`2793 closingFoundAt = ${closingFoundAt}`);
              }

              if (
                closingFoundAt &&
                ((closingFoundAt < y && str[y].trim()) ||
                  str[y + 1] === undefined)
              ) {
                DEV && console.log("2801 END detected");
                let rangeEnd = y;
                if (
                  (str[y + 1] === undefined && !str[y].trim()) ||
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
                      `2823 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
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
                      `2841 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
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
                    `2857 cb()-PUSH range [${tag.leftOuterWhitespace}, ${rangeEnd}, "${whiteSpaceCompensation}"]`,
                  );
                resolvedOpts.cb({
                  tag: tag as Tag,
                  deleteFrom: tag.leftOuterWhitespace,
                  deleteTo: rangeEnd,
                  insert: whiteSpaceCompensation,
                  rangesArr: rangesToDelete,
                  proposedReturn: [
                    tag.leftOuterWhitespace,
                    rangeEnd,
                    whiteSpaceCompensation,
                  ],
                });

                // offset:
                i = y - 1;
                if (str[y] === ">") {
                  i = y;
                }
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
    if (!str[i].trim() || str[i].charCodeAt(0) === 847) {
      // 1. catch chunk boundaries:
      if (chunkOfWhitespaceStartsAt === null) {
        chunkOfWhitespaceStartsAt = i;
        DEV &&
          console.log(
            `2897 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} \u001b[${33}m${`chunkOfWhitespaceStartsAt`}\u001b[${39}m = ${chunkOfWhitespaceStartsAt}`,
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
              `2913 RESET ALL \u001b[${31}m${`███████████████████████████████████████`}\u001b[${39}m`,
            );
          tag.onlyPlausible = true;
          tag.name = undefined;
          tag.nameStarts = undefined;
        }
      }

      // 2. catch LF and CR
      if (str[i] === "\n" || str[i] === "\r") {
        lastLFCRAt = i;
        DEV &&
          console.log(
            `2926 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`lastLFCRAt`}\u001b[${39}m`} = ${JSON.stringify(
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
              `2937 ${`\u001b[${32}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`nonWhitespaceCharMetSinceLastLFCR`}\u001b[${39}m`} = ${JSON.stringify(
                nonWhitespaceCharMetSinceLastLFCR,
                null,
                4,
              )}`,
            );
        }
      }
    } else {
      DEV && console.log(`2946 non-whitespace`);

      // 1. tackle whitespace chunks
      if (chunkOfWhitespaceStartsAt !== null) {
        DEV && console.log("2950");
        // 1. piggyback the catching of the attributes with equal and no value
        if (
          !tag.quotes &&
          attrObj.equalsAt > chunkOfWhitespaceStartsAt - 1 &&
          attrObj.nameEnds &&
          attrObj.equalsAt > attrObj.nameEnds &&
          str[i] !== '"' &&
          str[i] !== "'"
        ) {
          /* c8 ignore next */
          if (isObj(attrObj)) {
            DEV &&
              console.log(
                `2964 PUSHING ${`\u001b[${33}m${`attrObj`}\u001b[${39}m`} = ${JSON.stringify(
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
            `2981 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} \u001b[${33}m${`chunkOfWhitespaceStartsAt`}\u001b[${39}m = ${chunkOfWhitespaceStartsAt}`,
          );
      }

      // 2. deal with indentation
      if (!nonWhitespaceCharMetSinceLastLFCR) {
        nonWhitespaceCharMetSinceLastLFCR = true;
        DEV &&
          console.log(
            `2990 ${`\u001b[${32}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`nonWhitespaceCharMetSinceLastLFCR`}\u001b[${39}m`} = ${JSON.stringify(
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
                `3013 ${`\u001b[${31}m${`WIPE`}\u001b[${39}m`} ${`\u001b[${33}m${`lastLFCRAt`}\u001b[${39}m`} = ${JSON.stringify(
                  lastLFCRAt,
                  null,
                  4,
                )}`,
              );
          } else if (!resolvedOpts.ignoreIndentations) {
            DEV &&
              console.log(
                `3022 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [lastLFCRAt + 1=${
                  lastLFCRAt + 1
                }, ${i}]`,
              );
            rangesToDelete.push([lastLFCRAt + 1, i]);
          }
        }
      }
    }

    // catch spaces-only chunks (needed for outer trim option resolvedOpts.trimOnlySpaces)
    // -------------------------------------------------------------------------

    if (str[i] === " ") {
      // 1. catch spaces boundaries:
      if (chunkOfSpacesStartsAt === null) {
        chunkOfSpacesStartsAt = i;
        DEV &&
          console.log(
            `3041 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} \u001b[${33}m${`chunkOfSpacesStartsAt`}\u001b[${39}m = ${chunkOfSpacesStartsAt}`,
          );
      }
    } else if (chunkOfSpacesStartsAt !== null) {
      // 2. reset the marker
      chunkOfSpacesStartsAt = null;
      DEV &&
        console.log(
          `3049 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} \u001b[${33}m${`chunkOfSpacesStartsAt`}\u001b[${39}m = ${chunkOfSpacesStartsAt}`,
        );
    }

    // activate
    // -----------------------------------------------------------------------------
    if (tag.name?.toLowerCase() === "script") {
      isInsideScript = !tag.slashPresent;
      DEV &&
        console.log(
          `3059 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`isInsideScript`}\u001b[${39}m`} = ${JSON.stringify(
            isInsideScript,
            null,
            4,
          )}`,
        );
    }

    // log all
    // -------------------------------------------------------------------------
    DEV && console.log(`3069 \u001b[${32}m${`===============`}\u001b[${39}m`);
    // DEV && console.log(
    //   `${`\u001b[${33}m${`chunkOfSpacesStartsAt`}\u001b[${39}m`} = ${JSON.stringify(
    //     chunkOfSpacesStartsAt,
    //     null,
    //     4
    //   )}`
    // );
    DEV &&
      console.log(
        `3079 ${`\u001b[${33}m${`rangedOpeningTagsForDeletion`}\u001b[${39}m`} = ${JSON.stringify(
          rangedOpeningTagsForDeletion,
          null,
          4,
        )}`,
      );
    DEV &&
      console.log(
        `3087 ${`\u001b[${33}m${`rangedOpeningTagsForIgnoring`}\u001b[${39}m`} = ${JSON.stringify(
          rangedOpeningTagsForIgnoring,
          null,
          4,
        )}`,
      );
    DEV &&
      console.log(
        `3095 ${`\u001b[${33}m${`filteredTagLocations`}\u001b[${39}m`} = ${JSON.stringify(
          filteredTagLocations,
          null,
          4,
        )}`,
      );
    DEV &&
      console.log(
        `3103 ${`\u001b[${33}m${`spacesChunkWhichFollowsTheClosingBracketEndsAt`}\u001b[${39}m`} = ${JSON.stringify(
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
        `3118 ${`\u001b[${33}m${`hrefDump`}\u001b[${39}m`} = ${JSON.stringify(
          hrefDump,
          null,
          4,
        )}`,
      );
    DEV &&
      console.log(
        `3126 ${`\u001b[${33}m${`attrObj`}\u001b[${39}m`} = ${JSON.stringify(
          attrObj,
          null,
          4,
        )}`,
      );
    DEV &&
      console.log(
        `3134 ${
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
          rangesToDelete.current()
            ? `RANGES: ${JSON.stringify(rangesToDelete.current(), null, 0)}`
            : ""
        }`,
      );
    DEV &&
      console.log(
        `3155 ${`\u001b[${33}m${`strip`}\u001b[${39}m`} = ${`\u001b[${
          strip ? 32 : 31
        }m${JSON.stringify(strip, null, 0)}\u001b[${39}m`}`,
      );
    DEV &&
      console.log(
        `3161 ${`\u001b[${33}m${`isInsideScript`}\u001b[${39}m`} = ${`\u001b[${
          isInsideScript ? 32 : 31
        }m${JSON.stringify(isInsideScript, null, 0)}\u001b[${39}m`}`,
      );
    DEV &&
      console.log(
        `3167 ${`\u001b[${33}m${`isDoctype`}\u001b[${39}m`} = ${`\u001b[${
          isDoctype ? 32 : 31
        }m${JSON.stringify(isDoctype, null, 0)}\u001b[${39}m`}`,
      );
  }

  DEV && console.log("3173 \n\n\n\n\n\n END \n\n\n\n\n\n");

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
        !str[0].trim()))
  ) {
    DEV && console.log(`3190 trim frontal part`);
    for (let i2 = 0; i2 < len; i2++) {
      if (
        (resolvedOpts.trimOnlySpaces && str[i2] !== " ") ||
        (!resolvedOpts.trimOnlySpaces && str[i2].trim())
      ) {
        DEV && console.log(`3196 PUSH [0, ${i2}]`);
        rangesToDelete.push([0, i2]);
        break;
      } else if (!str[i2 + 1]) {
        // if end has been reached and whole string has been trim-able
        DEV && console.log(`3201 PUSH [0, ${i2 + 1}]`);
        rangesToDelete.push([0, i2 + 1]);
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
        !str[~-str.length].trim()))
  ) {
    for (let i3 = str.length; i3--; ) {
      if (
        (resolvedOpts.trimOnlySpaces && str[i3] !== " ") ||
        (!resolvedOpts.trimOnlySpaces && str[i3].trim())
      ) {
        DEV && console.log(`3223 PUSH [${i3 + 1}, ${len}]`);
        rangesToDelete.push([i3 + 1, len]);
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
  if (!opts?.cb && curr) {
    // check front - the first range of gathered ranges, does it touch start (0)
    if (curr[0] && !curr[0][0]) {
      DEV &&
        console.log(
          `3245 ${`\u001b[${33}m${`the first range`}\u001b[${39}m`} = ${JSON.stringify(
            curr[0],
            null,
            4,
          )}`,
        );
      const startingIdx = curr[0][1];
      // check the character at str[startingIdx]
      DEV &&
        console.log(
          `3255 ${`\u001b[${33}m${`startingIdx`}\u001b[${39}m`} = ${JSON.stringify(
            startingIdx,
            null,
            4,
          )}`,
        );

      // manually edit Ranges class:
      (rangesToDelete.ranges as any)[0] = [
        (rangesToDelete.ranges as any)[0][0],
        (rangesToDelete.ranges as any)[0][1],
      ];
    }

    // check end - the last range of gathered ranges, does it touch the end (str.length)
    // PS. remember ending is not inclusive, so ranges covering the whole ending
    // would go up to str.length, not up to str.length - 1!
    if (curr[curr.length - 1]?.[1] === str.length) {
      DEV &&
        console.log(
          `3275 ${`\u001b[${33}m${`the last range`}\u001b[${39}m`} = ${JSON.stringify(
            curr[curr.length - 1],
            null,
            4,
          )}; str.length = ${str.length}`,
        );
      const startingIdx = curr[curr.length - 1][0];
      // check character at str[startingIdx - 1]
      DEV &&
        console.log(
          `3285 ${`\u001b[${33}m${`startingIdx`}\u001b[${39}m`} = ${JSON.stringify(
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
          str[startingIdx2 - 1] &&
          ((resolvedOpts.trimOnlySpaces && str[startingIdx2 - 1] === " ") ||
            (!resolvedOpts.trimOnlySpaces && !str[startingIdx2 - 1].trim()))
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
    originalStr,
    str,
    entityDecodeRanges,
    rangesToDelete.current(),
  );

  return {
    log: { timeTakenInMilliseconds: Date.now() - start },
    result: rApply(originalStr, ranges),
    ranges,
    allTagLocations: mapLocationsToOriginal(
      allTagLocations,
      originalStr,
      str,
      entityDecodeRanges,
    ),
    filteredTagLocations: mapLocationsToOriginal(
      filteredTagLocations,
      originalStr,
      str,
      entityDecodeRanges,
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
  const segment = segments.find(
    ({ decodedFrom, decodedTo }) => idx >= decodedFrom && idx < decodedTo,
  );

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

  const segment = segments.find(
    ({ decodedFrom, decodedTo }) => idx > decodedFrom && idx <= decodedTo,
  );

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
  range: Range,
  decodedStr: string,
  segments: DecodeSegment[],
): Range {
  const [from, to, insert] = range;
  const mappedFrom = mapDecodedStart(from, decodedStr, segments);
  const mappedTo = mapDecodedEnd(to, decodedStr, segments);
  const replacement = `${mappedFrom.prefix}${insert || ""}${mappedTo.suffix}`;

  return replacement
    ? [mappedFrom.idx, mappedTo.idx, replacement]
    : [mappedFrom.idx, mappedTo.idx];
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
  originalStr: string,
  decodedStr: string,
  entityDecodeRanges: RangesType,
  parserRanges: RangesType,
): RangesType {
  if (!entityDecodeRanges) {
    return parserRanges;
  }

  const segments = buildDecodeSegments(
    originalStr,
    decodedStr,
    entityDecodeRanges,
  );
  const mappedParserRanges =
    parserRanges?.map((range) =>
      mapDecodedRange(range, decodedStr, segments),
    ) || [];
  const survivingEntityRanges = entityDecodeRanges.filter(
    ([entityFrom, entityTo]) =>
      !mappedParserRanges.some(
        ([parserFrom, parserTo]) =>
          parserFrom < entityTo && parserTo > entityFrom,
      ),
  );

  return mergeTouchingRanges([...survivingEntityRanges, ...mappedParserRanges]);
}

function mapLocationsToOriginal(
  locations: [number, number][],
  originalStr: string,
  decodedStr: string,
  entityDecodeRanges: RangesType,
): [number, number][] {
  if (!entityDecodeRanges) {
    return locations;
  }

  const segments = buildDecodeSegments(
    originalStr,
    decodedStr,
    entityDecodeRanges,
  );
  return locations.map(([from, to]) => [
    mapDecodedStart(from, decodedStr, segments).idx,
    mapDecodedEnd(to, decodedStr, segments).idx,
  ]);
}

export { defaults, stripHtml, version };
