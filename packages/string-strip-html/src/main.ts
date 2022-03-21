/* eslint-disable @typescript-eslint/restrict-plus-operands */
import isObj from "lodash.isplainobject";
import trim from "lodash.trim";
import without from "lodash.without";
import { decode } from "html-entities";
import { rApply } from "ranges-apply";
import { Ranges } from "ranges-push";
import { right } from "string-left-right";

import {
  characterSuitableForNames,
  prepHopefullyAnArray,
  notWithinAttrQuotes,
  Obj,
} from "./util";
import { version as v } from "../package.json";
import { Range, Ranges as RangesType } from "../../../ops/typedefs/common";

const version: string = v;

declare let DEV: boolean;

interface Attribute {
  nameStarts: number;
  nameEnds: number;
  equalsAt?: number;
  name: string;
  valueStarts?: number;
  valueEnds?: number;
  value?: string;
}
interface Tag {
  attributes: Attribute[];
  lastClosingBracketAt: number;
  lastOpeningBracketAt: number;
  slashPresent: number;
  leftOuterWhitespace: number;
  onlyPlausible: boolean;
  nameStarts: number;
  nameContainsLetters: boolean;
  nameEnds: number;
  name: string;
}

interface CbObj {
  tag: Tag;
  deleteFrom: null | number;
  deleteTo: null | number;
  insert: null | string;
  rangesArr: Ranges;
  proposedReturn: Range | null;
}

interface Opts {
  ignoreTags: string[];
  ignoreTagsWithTheirContents: string[];
  onlyStripTags: string[];
  stripTogetherWithTheirContents: string[];
  skipHtmlDecoding: boolean;
  trimOnlySpaces: boolean;
  stripRecognisedHTMLOnly: boolean;
  dumpLinkHrefsNearby: {
    enabled: boolean;
    putOnNewLine: boolean;
    wrapHeads: string;
    wrapTails: string;
  };
  cb: null | ((cbObj: CbObj) => void);
}

const defaults = {
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
  cb: null,
};

interface Res {
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
function stripHtml(str: string, originalOpts?: Partial<Opts>): Res {
  // const
  // ===========================================================================
  let start = Date.now();

  let definitelyTagNames = new Set([
    "!doctype",
    "abbr",
    "address",
    "area",
    "article",
    "aside",
    "audio",
    "base",
    "bdi",
    "bdo",
    "blockquote",
    "body",
    "br",
    "button",
    "canvas",
    "caption",
    "cite",
    "code",
    "col",
    "colgroup",
    "data",
    "datalist",
    "dd",
    "del",
    "details",
    "dfn",
    "dialog",
    "div",
    "dl",
    "doctype",
    "dt",
    "em",
    "embed",
    "fieldset",
    "figcaption",
    "figure",
    "footer",
    "form",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "head",
    "header",
    "hgroup",
    "hr",
    "html",
    "iframe",
    "img",
    "input",
    "ins",
    "kbd",
    "keygen",
    "label",
    "legend",
    "li",
    "link",
    "main",
    "map",
    "mark",
    "math",
    "menu",
    "menuitem",
    "meta",
    "meter",
    "nav",
    "noscript",
    "object",
    "ol",
    "optgroup",
    "option",
    "output",
    "param",
    "picture",
    "pre",
    "progress",
    "rb",
    "rp",
    "rt",
    "rtc",
    "ruby",
    "samp",
    "script",
    "section",
    "select",
    "slot",
    "small",
    "source",
    "span",
    "strong",
    "style",
    "sub",
    "summary",
    "sup",
    "svg",
    "table",
    "tbody",
    "td",
    "template",
    "textarea",
    "tfoot",
    "th",
    "thead",
    "time",
    "title",
    "tr",
    "track",
    "ul",
    "var",
    "video",
    "wbr",
    "xml",
  ]);
  let singleLetterTags = new Set(["a", "b", "i", "p", "q", "s", "u"]);

  let punctuation = new Set([".", ",", "?", ";", ")", "\u2026", '"', "\u00BB"]);
  // \u00BB is &raquo; - guillemet - right angled quote
  // \u2026 is &hellip; - ellipsis

  // we'll gather opening tags from ranged-pairs here
  // so that we can tackle opts.stripTogetherWithTheirContents
  let rangedOpeningTagsForDeletion: Obj[] = [];

  // same way, we gather tags from ranged-pairs for
  // ignoring purposes:
  let rangedOpeningTagsForIgnoring: Obj[] = [];

  // we'll put tag locations here
  let allTagLocations: [number, number][] = [];
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
  let chunkOfWhitespaceStartsAt = null;

  // records the beginning of the current chunk of spaces (strictly spaces-only):
  let chunkOfSpacesStartsAt = null;

  // temporary variable to assemble the attribute pieces:
  let attrObj: Obj = {};

  // marker to store captured href, used in opts.dumpLinkHrefsNearby.enabled
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
  // It's necessary for opts.trimOnlySpaces when there's closing bracket, whitespace, non-space
  // whitespace character ("\n", "\t" etc), whitspace, end-of-file. Trim will kick in and will
  // try to trim up until the EOF, be we'll have to pull the end of trim back, back to the first
  // character of aforementioned non-space whitespace character sequence.
  // This variable will tell exactly where it is located.
  let spacesChunkWhichFollowsTheClosingBracketEndsAt = null;

  // when opts.ignoreTagsWithTheirContents activates, we flip this
  // flag to mark that tags should not be stripped. The challenge is,
  // this program still reports all tags, independently were they
  // stripped or not (because they were whitelisted)
  let strip = true;

  // functions
  // ===========================================================================

  function existy(x: any): boolean {
    return x != null;
  }
  function isStr(something: any): boolean {
    return typeof something === "string";
  }

  function treatRangedTags(
    i: number,
    opts: Opts,
    rangesToDelete: Ranges
  ): void {
    DEV && console.log(`305 treatRangedTags(${i}) called`);
    DEV &&
      console.log(
        `308 opts.stripTogetherWithTheirContents = ${JSON.stringify(
          opts.stripTogetherWithTheirContents,
          null,
          0
        )}; tag.name = ${tag.name}`
      );
    DEV &&
      console.log(
        `316 FIY, ${`\u001b[${33}m${`rangedOpeningTagsForDeletion`}\u001b[${39}m`} = ${JSON.stringify(
          rangedOpeningTagsForDeletion,
          null,
          4
        )}; ${`\u001b[${33}m${`rangedOpeningTagsForIgnoring`}\u001b[${39}m`} = ${JSON.stringify(
          rangedOpeningTagsForIgnoring,
          null,
          4
        )}`
      );

    // 1. deletion opts.stripTogetherWithTheirContents
    if (
      Array.isArray(opts.stripTogetherWithTheirContents) &&
      (opts.stripTogetherWithTheirContents.includes(tag.name) ||
        opts.stripTogetherWithTheirContents.includes("*"))
    ) {
      DEV && console.log(`333`);
      // it depends, is it opening or closing range tag:

      // We could try to distinguish opening from closing tags by presence of
      // slash, but that would be a liability for dirty code cases where clash
      // is missing. Better, instead, just see if an entry for that tag name
      // already exists in the rangesToDelete[].

      if (
        tag.slashPresent &&
        Array.isArray(rangedOpeningTagsForDeletion) &&
        rangedOpeningTagsForDeletion.some((obj) => obj.name === tag.name)
      ) {
        DEV &&
          console.log(
            `348 \u001b[${31}m${`treatRangedTags():`}\u001b[${39}m closing ranged tag`
          );
        // closing tag.
        // filter and remove the found tag
        for (let y = rangedOpeningTagsForDeletion.length; y--; ) {
          if (rangedOpeningTagsForDeletion[y].name === tag.name) {
            // we'll remove from opening tag's opening bracket to closing tag's
            // closing bracket because whitespace will be taken care of separately,
            // when tags themselves will be removed.
            // Basically, for each range tag there will be 3 removals:
            // opening tag, closing tag and all from opening to closing tag.
            // We keep removing opening and closing tags along whole range
            // because of few reasons: 1. cases of broken/dirty code, 2. keeping
            // the algorithm simpler, 3. opts that control whitespace removal
            // around tags.

            // 1. add range without caring about surrounding whitespace around
            // the range
            DEV &&
              console.log(
                `rangesToDelete.current(): ${JSON.stringify(
                  rangesToDelete.current(),
                  null,
                  0
                )}`
              );

            DEV &&
              console.log(
                `377 ABOUT TO cb()-PUSH RANGE: [${rangedOpeningTagsForDeletion[y].lastOpeningBracketAt}, ${i}]`
              );

            // also, tend filteredTagLocations in the output - tags which are to be
            // deleted with contents should be reported as one large range in
            // filteredTagLocations - from opening to closing - not two ranges

            DEV &&
              console.log(
                `386 FIY, ${`\u001b[${33}m${`rangedOpeningTagsForDeletion`}\u001b[${39}m`} = ${JSON.stringify(
                  rangedOpeningTagsForDeletion,
                  null,
                  4
                )}`
              );

            DEV &&
              console.log(
                `395 ${`\u001b[${33}m${`filteredTagLocations`}\u001b[${39}m`} BEFORE: ${JSON.stringify(
                  filteredTagLocations,
                  null,
                  4
                )}`
              );
            filteredTagLocations = filteredTagLocations.filter(
              ([from, upto]) =>
                (from < rangedOpeningTagsForDeletion[y].lastOpeningBracketAt ||
                  from >= i + 1) &&
                (upto <= rangedOpeningTagsForDeletion[y].lastOpeningBracketAt ||
                  upto > i + 1)
            );
            DEV &&
              console.log(
                `410 ${`\u001b[${33}m${`filteredTagLocations`}\u001b[${39}m`} AFTER: ${JSON.stringify(
                  filteredTagLocations,
                  null,
                  4
                )}`
              );

            let endingIdx = i + 1;
            if (tag.lastClosingBracketAt) {
              endingIdx = tag.lastClosingBracketAt + 1;
            }

            DEV &&
              console.log(
                `424 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                  rangedOpeningTagsForDeletion[y].lastOpeningBracketAt
                }, ${endingIdx}] to filteredTagLocations`
              );
            filteredTagLocations.push([
              rangedOpeningTagsForDeletion[y].lastOpeningBracketAt,
              endingIdx,
            ]);

            /* istanbul ignore else */
            if (punctuation.has(str[i]) && opts.cb) {
              opts.cb({
                tag: tag as Tag,
                deleteFrom:
                  rangedOpeningTagsForDeletion[y].lastOpeningBracketAt,
                deleteTo: i + 1,
                insert: null,
                rangesArr: rangesToDelete as any,
                proposedReturn: [
                  rangedOpeningTagsForDeletion[y].lastOpeningBracketAt,
                  i,
                  null,
                ],
              });
              // null will remove any spaces added so far. Opening and closing range tags might
              // have received spaces as separate entities, but those might not be necessary for range:
              // "text <script>deleteme</script>."
            } else if (opts.cb) {
              opts.cb({
                tag: tag as any,
                deleteFrom:
                  rangedOpeningTagsForDeletion[y].lastOpeningBracketAt,
                deleteTo: i,
                insert: "",
                rangesArr: rangesToDelete as any,
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
                `473 new \u001b[${33}m${`rangedOpeningTagsForDeletion`}\u001b[${39}m = ${JSON.stringify(
                  rangedOpeningTagsForDeletion,
                  null,
                  4
                )}`
              );
            // 3. stop the loop
            break;
          }
        }
      } else if (!tag.slashPresent) {
        // opening tag.
        DEV &&
          console.log(
            `487 \u001b[${31}m${`treatRangedTags():`}\u001b[${39}m opening ranged tag`
          );
        rangedOpeningTagsForDeletion.push(tag);
        DEV &&
          console.log(
            `492 pushed tag{} to \u001b[${33}m${`rangedOpeningTagsForDeletion`}\u001b[${39}m\nwhich is now equal to:\n${JSON.stringify(
              rangedOpeningTagsForDeletion,
              null,
              4
            )}`
          );
      }
    } else if (
      Array.isArray(opts.ignoreTagsWithTheirContents) &&
      checkIgnoreTagsWithTheirContents(i, opts, tag)
    ) {
      DEV && console.log(`503`);
      strip = false;
      DEV &&
        console.log(
          `507 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`strip`}\u001b[${39}m`} = ${JSON.stringify(
            strip,
            null,
            4
          )}`
        );
    }
  }

  function calculateWhitespaceToInsert(
    str2: string, // whole string
    currCharIdx: number, // current index
    fromIdx: null | number, // leftmost whitespace edge around tag
    toIdx: null | number, // rightmost whitespace edge around tag
    lastOpeningBracketAt: number, // tag actually starts here (<)
    lastClosingBracketAt: number // tag actually ends here (>)
  ): string {
    DEV &&
      console.log(
        `526 \u001b[${35}m${`calculateWhitespaceToInsert() called`}\u001b[${39}m`
      );
    DEV &&
      console.log(
        `530 calculateWhitespaceToInsert(): ${`\u001b[${33}m${`currCharIdx`}\u001b[${39}m`} = ${JSON.stringify(
          currCharIdx,
          null,
          0
        )}; ${`\u001b[${33}m${`str2[currCharIdx]`}\u001b[${39}m`} = ${JSON.stringify(
          str2[currCharIdx],
          null,
          0
        )}; ${`\u001b[${33}m${`str2[tag.leftOuterWhitespace]`}\u001b[${39}m`} = ${JSON.stringify(
          str2[tag.leftOuterWhitespace],
          null,
          0
        )}; ${`\u001b[${33}m${`str2[tag.leftOuterWhitespace - 1]`}\u001b[${39}m`} = ${JSON.stringify(
          str2[tag.leftOuterWhitespace - 1],
          null,
          0
        )}; ${`\u001b[${33}m${`fromIdx`}\u001b[${39}m`} = ${JSON.stringify(
          fromIdx,
          null,
          0
        )}; ${`\u001b[${33}m${`toIdx`}\u001b[${39}m`} = ${JSON.stringify(
          toIdx,
          null,
          0
        )}`
      );
    let strToEvaluateForLineBreaks = "";
    if (
      Number.isInteger(fromIdx) &&
      (fromIdx as number) < lastOpeningBracketAt
    ) {
      strToEvaluateForLineBreaks += str2.slice(
        fromIdx as number,
        lastOpeningBracketAt
      );
      DEV &&
        console.log(
          `567 strToEvaluateForLineBreaks = ${JSON.stringify(
            strToEvaluateForLineBreaks,
            null,
            0
          )} (length ${
            strToEvaluateForLineBreaks.length
          }; sliced [${fromIdx}, ${lastOpeningBracketAt}])`
        );
    }
    if (
      Number.isInteger(toIdx) &&
      (toIdx as number) > lastClosingBracketAt + 1
    ) {
      // limit whitespace that follows the tag, stop at linebreak. That's to make
      // the algorithm composable - we include linebreaks in front but not after.
      let temp = str2.slice(lastClosingBracketAt + 1, toIdx as number);
      if (temp.includes("\n") && isOpeningAt(toIdx as number, str2)) {
        strToEvaluateForLineBreaks += " ";
      } else {
        strToEvaluateForLineBreaks += temp;
      }
      DEV &&
        console.log(
          `590 strToEvaluateForLineBreaks = ${JSON.stringify(
            strToEvaluateForLineBreaks,
            null,
            0
          )} (length ${strToEvaluateForLineBreaks.length}; sliced [${
            lastClosingBracketAt + 1
          }, ${toIdx}])`
        );
    }
    DEV &&
      console.log(
        `601 strToEvaluateForLineBreaks = ${JSON.stringify(
          strToEvaluateForLineBreaks,
          null,
          0
        )} (length ${strToEvaluateForLineBreaks.length})`
      );
    if (!punctuation.has(str2[currCharIdx]) && str2[currCharIdx] !== "!") {
      let foundLineBreaks = strToEvaluateForLineBreaks.match(/\n/g);
      if (Array.isArray(foundLineBreaks) && foundLineBreaks.length) {
        if (foundLineBreaks.length === 1) {
          return "\n";
        }
        if (foundLineBreaks.length === 2) {
          return "\n\n";
        }
        // return three line breaks maximum
        return "\n\n\n";
      }
      // default spacer - a single space
      return " ";
    }
    // default case: space
    return "";
  }

  function calculateHrefToBeInserted(opts: Opts): void {
    if (
      opts.dumpLinkHrefsNearby.enabled &&
      hrefDump.tagName &&
      hrefDump.tagName === tag.name &&
      tag.lastOpeningBracketAt &&
      ((hrefDump.openingTagEnds &&
        tag.lastOpeningBracketAt > hrefDump.openingTagEnds) ||
        !hrefDump.openingTagEnds)
    ) {
      hrefInsertionActive = true;
      DEV &&
        console.log(
          `639 calculateHrefToBeInserted(): hrefInsertionActive = "${hrefInsertionActive}"`
        );
    }

    if (hrefInsertionActive) {
      let lineBreaks = opts.dumpLinkHrefsNearby.putOnNewLine ? "\n\n" : "";
      stringToInsertAfter = `${lineBreaks}${hrefDump.hrefValue}${lineBreaks}`;
      DEV &&
        console.log(
          `648 calculateHrefToBeInserted(): stringToInsertAfter = ${stringToInsertAfter}`
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
    opts: Opts,
    tag2: Obj
  ): boolean {
    if (opts.ignoreTagsWithTheirContents.includes("*")) {
      DEV && console.log(`670 checkIgnoreTagsWithTheirContents(): RETURN TRUE`);
      return true;
    }
    // edge case - two opening ranged tags in sequence
    // <table>... <tr>... <tr>... ... </tr> </table>
    //             #1      #2           #1
    //
    // in such case, we treat #1 as normal tag, we don't ignore
    // anything for it, only for #2. It's to prevent a loophole.
    let nextOpeningPos = str.indexOf(`<${tag2.name}`, i);
    // TODO: replace below with regexp:
    let nextClosingPos = str.indexOf(`</${tag2.name}`, i);
    if (
      // EITHER it's an opening tag
      (!tag2.slashPresent &&
        // and there's no closing
        nextClosingPos === -1) ||
      // OR it's a closing tag
      (tag2.slashPresent &&
        // and there haven't been any opening tag encountered so far
        !rangedOpeningTagsForIgnoring.some(
          (tagObj) => tagObj.name === tag2.name
        )) ||
      // OR both opening and closing tags follow further
      (nextClosingPos > -1 &&
        nextOpeningPos > -1 &&
        // and that opening is before next closing
        nextOpeningPos < nextClosingPos)
    ) {
      DEV &&
        console.log(`700 checkIgnoreTagsWithTheirContents(): RETURN FALSE`);
      return false;
    }
    DEV &&
      console.log(
        `705 checkIgnoreTagsWithTheirContents(): RETURN ${opts.ignoreTagsWithTheirContents.includes(
          tag2.name
        )}`
      );
    return opts.ignoreTagsWithTheirContents.includes(tag2.name);
  }

  // validation
  // ===========================================================================
  if (typeof str !== "string") {
    throw new TypeError(
      `string-strip-html/stripHtml(): [THROW_ID_01] Input must be string! Currently it's: ${(typeof str).toLowerCase()}, equal to:\n${JSON.stringify(
        str,
        null,
        4
      )}`
    );
  }
  if (originalOpts && !isObj(originalOpts)) {
    throw new TypeError(
      `string-strip-html/stripHtml(): [THROW_ID_02] Optional Options Object must be a plain object! Currently it's: ${(typeof originalOpts).toLowerCase()}, equal to:\n${JSON.stringify(
        originalOpts,
        null,
        4
      )}`
    );
  }

  // eslint-disable-next-line consistent-return
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

  // prep opts
  // ===========================================================================
  let opts: Opts = { ...defaults, ...originalOpts };

  if (Object.prototype.hasOwnProperty.call(opts, "returnRangesOnly")) {
    throw new TypeError(
      `string-strip-html/stripHtml(): [THROW_ID_03] opts.returnRangesOnly has been removed from the API since v.5 release.`
    );
  }

  // filter non-string or whitespace entries from the following arrays or turn
  // them into arrays:
  opts.ignoreTags = prepHopefullyAnArray(opts.ignoreTags, "opts.ignoreTags");
  opts.onlyStripTags = prepHopefullyAnArray(
    opts.onlyStripTags,
    "opts.onlyStripTags"
  );

  // let's define the onlyStripTagsMode. Since opts.onlyStripTags can cancel
  // out the entries in opts.onlyStripTags, it can be empty but this mode has
  // to be switched on:
  let onlyStripTagsMode = !!opts.onlyStripTags.length;

  // if both opts.onlyStripTags and opts.ignoreTags are set, latter is respected,
  // we simply exclude ignored tags from the opts.onlyStripTags.
  if (opts.onlyStripTags.length && opts.ignoreTags.length) {
    opts.onlyStripTags = without(opts.onlyStripTags, ...opts.ignoreTags);
  }

  if (!isObj(opts.dumpLinkHrefsNearby)) {
    opts.dumpLinkHrefsNearby = { ...defaults.dumpLinkHrefsNearby };
  }
  // Object.assign doesn't deep merge, so we take care of opts.dumpLinkHrefsNearby:
  opts.dumpLinkHrefsNearby = defaults.dumpLinkHrefsNearby;
  if (
    originalOpts &&
    Object.prototype.hasOwnProperty.call(originalOpts, "dumpLinkHrefsNearby") &&
    existy(originalOpts.dumpLinkHrefsNearby)
  ) {
    /* istanbul ignore else */
    if (isObj(originalOpts.dumpLinkHrefsNearby)) {
      opts.dumpLinkHrefsNearby = {
        ...defaults.dumpLinkHrefsNearby,
        ...originalOpts.dumpLinkHrefsNearby,
      };
    } else if (originalOpts.dumpLinkHrefsNearby) {
      // checking to omit value as number zero
      throw new TypeError(
        `string-strip-html/stripHtml(): [THROW_ID_04] Optional Options Object's key dumpLinkHrefsNearby was set to ${typeof originalOpts.dumpLinkHrefsNearby}, equal to ${JSON.stringify(
          originalOpts.dumpLinkHrefsNearby,
          null,
          4
        )}. The only allowed value is a plain object. See the API reference.`
      );
    }
  }

  if (!opts.stripTogetherWithTheirContents) {
    opts.stripTogetherWithTheirContents = [];
  } else if (
    typeof opts.stripTogetherWithTheirContents === "string" &&
    (opts.stripTogetherWithTheirContents as string).length
  ) {
    opts.stripTogetherWithTheirContents = [opts.stripTogetherWithTheirContents];
  }

  let somethingCaught: Obj = {};
  if (
    opts.stripTogetherWithTheirContents &&
    Array.isArray(opts.stripTogetherWithTheirContents) &&
    opts.stripTogetherWithTheirContents.length &&
    !opts.stripTogetherWithTheirContents.every((el, i) => {
      if (!(typeof el === "string")) {
        somethingCaught.el = el;
        somethingCaught.i = i;
        return false;
      }
      return true;
    })
  ) {
    throw new TypeError(
      `string-strip-html/stripHtml(): [THROW_ID_05] Optional Options Object's key stripTogetherWithTheirContents was set to contain not just string elements! For example, element at index ${
        somethingCaught.i
      } has a value ${
        somethingCaught.el
      } which is not string but ${(typeof somethingCaught.el).toLowerCase()}.`
    );
  }

  // prep the opts.cb
  DEV && console.log(`836 opts.cb type = ${typeof opts.cb}`);
  if (!opts.cb) {
    opts.cb = ({ rangesArr, proposedReturn }) => {
      if (proposedReturn) {
        (rangesArr as any).push(...proposedReturn);
      }
    };
  }

  DEV &&
    console.log(
      `847 string-strip-html: final ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
        opts,
        null,
        4
      )}; ${`\u001b[${33}m${`input`}\u001b[${39}m`} = "${str}"`
    );

  // if the links have to be on a new line, we need to increase the allowance for line breaks
  // in Ranges class, it's the ranges-push API setting opts.limitLinebreaksCount
  // see https://www.npmjs.com/package/ranges-push#optional-options-object
  let rangesToDelete = new Ranges({
    limitToBeAddedWhitespace: true,
    limitLinebreaksCount: 2,
  });

  // TODO: it's chummy - ranges will be unreliable if initial str has changed
  // use ranges-ent-decode
  if (!opts.skipHtmlDecoding) {
    while (str !== decode(str, { scope: "strict" })) {
      // eslint-disable-next-line no-param-reassign
      str = decode(str, { scope: "strict" });
    }
  }

  // step 1.
  // ===========================================================================

  for (let i = 0, len = str.length; i < len; i++) {
    DEV &&
      console.log(
        `\u001b[${36}m${`===============================`}\u001b[${39}m \u001b[${35}m${`str[ ${i} ] = ${`\u001b[${31}m${
          str[i] && str[i].trim() === ""
            ? str[i] === null
              ? "null"
              : str[i] === "\n"
              ? "line break"
              : str[i] === "\t"
              ? "tab"
              : "space"
            : str[i]
        }\u001b[${39}m`}`}\u001b[${39}m \u001b[${36}m${`===============================`}\u001b[${39}m`
      );

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
    if (str[i] === "%" && str[i - 1] === "{" && str.includes("%}", i + 1)) {
      i = str.indexOf("%}", i) - 1;
      DEV &&
        console.log(
          `912 offset i = ${i}; then ${`\u001b[${32}m${`CONTINUE`}\u001b[${39}m`}`
        );
      continue;
    }

    // catch the closing bracket of dirty tags with missing opening brackets
    // -------------------------------------------------------------------------
    if (isClosingAt(i)) {
      DEV && console.log(`920 closing bracket caught`);
      // tend cases where opening bracket of a tag is missing:
      if ((!tag || Object.keys(tag).length < 2) && i > 1) {
        DEV && console.log("923 TRAVERSE BACKWARDS");

        // traverse backwards either until start of string or ">" is found
        for (let y = i; y--; ) {
          DEV &&
            console.log(`\u001b[${35}m${`str[${y}] = ${str[y]}`}\u001b[${39}m`);
          if (str[y - 1] === undefined || isClosingAt(y)) {
            DEV && console.log("930 BREAK");

            let startingPoint = str[y - 1] === undefined ? y : y + 1;
            let culprit = str.slice(startingPoint, i + 1);
            DEV &&
              console.log(
                `936 CULPRIT: "${`\u001b[${31}m${culprit}\u001b[${39}m`}"`
              );

            // Check if the culprit starts with a tag that's more likely a tag
            // name (like "body" or "article"). Single-letter tag names are excluded
            // because they can be plausible, ie. in math texts and so on.
            // Nobody uses puts comparison signs between words like: "article > ",
            // but single letter names can be plausible: "a > b" in math.

            DEV &&
              console.log(
                `947 "${trim(
                  (culprit as any)
                    .trim()
                    .split(/\s+/)
                    .filter((val2: string) => val2.trim())
                    .filter((_val3: string, i3: number) => i3 === 0),
                  "/>"
                )}"`
              );

            if (
              str !== `<${trim(culprit.trim(), "/>")}>` && // recursion prevention
              [...definitelyTagNames].some(
                (val) =>
                  trim(
                    (culprit as any)
                      .trim()
                      .split(/\s+/)
                      .filter((val2: string) => val2.trim())
                      .filter((_val3: string, i3: number) => i3 === 0),
                    "/>"
                  ).toLowerCase() === val
              ) &&
              stripHtml(`<${culprit.trim()}>`, opts).result === ""
            ) {
              /* istanbul ignore else */
              if (
                !allTagLocations.length ||
                allTagLocations[allTagLocations.length - 1][0] !==
                  tag.lastOpeningBracketAt
              ) {
                allTagLocations.push([startingPoint, i + 1]);
                DEV &&
                  console.log(
                    `981 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                      tag.lastOpeningBracketAt
                    }, ${tag.lastClosingBracketAt + 1}] to allTagLocations`
                  );
              }

              /* istanbul ignore else */
              if (
                !filteredTagLocations.length ||
                filteredTagLocations[filteredTagLocations.length - 1][0] !==
                  tag.lastOpeningBracketAt
              ) {
                filteredTagLocations.push([startingPoint, i + 1]);
                DEV &&
                  console.log(
                    `996 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                      tag.lastOpeningBracketAt
                    }, ${tag.lastClosingBracketAt + 1}] to filteredTagLocations`
                  );
              }

              let whiteSpaceCompensation = calculateWhitespaceToInsert(
                str,
                i,
                startingPoint,
                i + 1,
                startingPoint,
                i + 1
              );
              DEV &&
                console.log(
                  `1012 \u001b[${33}m${`SUBMIT RANGE #3: [${startingPoint}, ${
                    i + 1
                  }, "${whiteSpaceCompensation}"]`}\u001b[${39}m`
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
                  `1027 cb()-PUSHING [${startingPoint}, ${deleteUpTo}, "${whiteSpaceCompensation}"]`
                );
              opts.cb({
                tag: tag as any,
                deleteFrom: startingPoint,
                deleteTo: deleteUpTo,
                insert: whiteSpaceCompensation,
                rangesArr: rangesToDelete as any,
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
      str[i] === "/" &&
      !tag.quotes?.value &&
      Number.isInteger(tag.lastOpeningBracketAt) &&
      !Number.isInteger(tag.lastClosingBracketAt)
    ) {
      DEV &&
        console.log(
          `1058 \u001b[${33}m${`tag.slashPresent`}\u001b[${39}m = true`
        );
      tag.slashPresent = i;
    }

    // catch double or single quotes
    // -------------------------------------------------------------------------
    if (str[i] === '"' || str[i] === "'") {
      if (
        tag.nameStarts &&
        tag.quotes &&
        tag.quotes.value &&
        tag.quotes.value === str[i]
      ) {
        // 1. finish assembling the "attrObj{}"
        attrObj.valueEnds = i;
        attrObj.value = str.slice(attrObj.valueStarts, i);
        DEV &&
          console.log(
            `1077 PUSHING ${`\u001b[${33}m${`attrObj`}\u001b[${39}m`} = ${JSON.stringify(
              attrObj,
              null,
              4
            )}`
          );
        tag.attributes.push(attrObj);
        // reset:
        attrObj = {};
        // 2. finally, delete the quotes marker, we don't need it any more
        tag.quotes = undefined;
        // 3. if opts.dumpLinkHrefsNearby.enabled is on, catch href
        let hrefVal;
        if (
          opts.dumpLinkHrefsNearby.enabled &&
          // eslint-disable-next-line
          tag.attributes.some((obj: Obj) => {
            if (obj.name && obj.name.toLowerCase() === "href") {
              hrefVal = `${opts.dumpLinkHrefsNearby.wrapHeads || ""}${
                obj.value
              }${opts.dumpLinkHrefsNearby.wrapTails || ""}`;
              return true;
            }
          })
        ) {
          hrefDump = {
            tagName: tag.name,
            hrefValue: hrefVal as any,
            openingTagEnds: undefined,
          };
          DEV &&
            console.log(
              `1109 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`hrefDump`}\u001b[${39}m`} = ${JSON.stringify(
                hrefDump,
                null,
                4
              )}`
            );
        }
      } else if (!tag.quotes && tag.nameStarts) {
        // 1. if it's opening marker, record the type and location of quotes
        DEV &&
          console.log(
            `1120 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} tag.quotes = {}, tag.quotes.value = ${
              str[i]
            }, tag.quotes.start = ${i}`
          );
        tag.quotes = {};
        tag.quotes.value = str[i];
        tag.quotes.start = i;
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
              `1138 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrObj`}\u001b[${39}m`} = ${JSON.stringify(
                attrObj,
                null,
                4
              )}`
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
          `1159 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} \u001b[${33}m${`tag.nameEnds`}\u001b[${39}m = ${
            tag.nameEnds
          }`
        );
      // 2. extract the full name string
      /* istanbul ignore next */
      tag.name = str.slice(
        tag.nameStarts,
        tag.nameEnds +
          /* istanbul ignore next */
          (!isClosingAt(i) && str[i] !== "/" && str[i + 1] === undefined
            ? 1
            : 0)
      );
      DEV &&
        console.log(
          `1175 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} \u001b[${33}m${`tag.name`}\u001b[${39}m = ${
            tag.name
          }`
        );

      DEV &&
        console.log(
          `1182 ${`\u001b[${33}m${`tag`}\u001b[${39}m`} is currently = ${JSON.stringify(
            tag,
            null,
            4
          )}`
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

      if (isOpeningAt(i)) {
        // process it because we need to tackle this new tag
        DEV && console.log(`1202 opening bracket caught`);

        calculateHrefToBeInserted(opts);
        DEV &&
          console.log(
            `1207 ${`\u001b[${33}m${`stringToInsertAfter`}\u001b[${39}m`} = ${JSON.stringify(
              stringToInsertAfter,
              null,
              4
            )}`
          );

        // calculateWhitespaceToInsert() API:
        // str, // whole string
        // currCharIdx, // current index
        // fromIdx, // leftmost whitespace edge around tag
        // toIdx, // rightmost whitespace edge around tag
        // lastOpeningBracketAt, // tag actually starts here (<)
        // lastClosingBracketAt // tag actually ends here (>)
        let whiteSpaceCompensation = calculateWhitespaceToInsert(
          str,
          i,
          tag.leftOuterWhitespace,
          i,
          tag.lastOpeningBracketAt,
          i
        );

        DEV &&
          console.log(
            `1232 \u001b[${33}m${`cb()-PUSH: [${tag.leftOuterWhitespace}, ${i}, "${whiteSpaceCompensation}${stringToInsertAfter}${whiteSpaceCompensation}"]`}\u001b[${39}m`
          );
        DEV &&
          console.log(
            `1236 ${`\u001b[${33}m${`tag`}\u001b[${39}m`} = ${JSON.stringify(
              tag,
              null,
              4
            )}`
          );

        // only on pair tags, exclude the opening counterpart and closing
        // counterpart if whole pair is to be deleted
        if (
          opts.stripTogetherWithTheirContents.includes(tag.name) ||
          opts.stripTogetherWithTheirContents.includes("*")
        ) {
          DEV &&
            console.log(
              `1251 ${`\u001b[${33}m${`filteredTagLocations`}\u001b[${39}m`} BEFORE: ${JSON.stringify(
                filteredTagLocations,
                null,
                4
              )}`
            );
          /* istanbul ignore next */
          filteredTagLocations = filteredTagLocations.filter(
            ([from, upto]) => !(from === tag.leftOuterWhitespace && upto === i)
          );
          DEV &&
            console.log(
              `1263 ${`\u001b[${33}m${`filteredTagLocations`}\u001b[${39}m`} AFTER: ${JSON.stringify(
                filteredTagLocations,
                null,
                4
              )}`
            );
        }

        // DEV && console.log(
        //   `1011 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
        //     tag.leftOuterWhitespace
        //   }, ${i}] to filteredTagLocations`
        // );
        // filteredTagLocations.push([tag.leftOuterWhitespace, i]);

        opts.cb({
          tag: tag as Tag,
          deleteFrom: tag.leftOuterWhitespace,
          deleteTo: i,
          insert: `${whiteSpaceCompensation}${stringToInsertAfter}${whiteSpaceCompensation}`,
          rangesArr: rangesToDelete as any,
          proposedReturn: [
            tag.leftOuterWhitespace,
            i,
            `${whiteSpaceCompensation}${stringToInsertAfter}${whiteSpaceCompensation}`,
          ],
        });
        resetHrefMarkers();

        // also,
        treatRangedTags(i, opts, rangesToDelete);
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
          `1309 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} \u001b[${33}m${`attrObj.valueStarts`}\u001b[${39}m = ${
            attrObj.valueStarts
          }`
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
          `1328 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} \u001b[${33}m${`attrObj.equalsAt`}\u001b[${39}m = ${
            attrObj.equalsAt
          }`
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
        console.log("1352 PUSHED attrObj into tag.attributes, reset attrObj");
      attrObj = {};
    }

    // catch the ending of an attribute's name
    // -------------------------------------------------------------------------
    if (!tag.quotes && attrObj.nameStarts && !attrObj.nameEnds) {
      DEV && console.log("1359");
      if (!str[i].trim()) {
        attrObj.nameEnds = i;
        DEV &&
          console.log(
            `1364 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrObj.nameEnds`}\u001b[${39}m`} = ${JSON.stringify(
              attrObj.nameEnds,
              null,
              4
            )}`
          );
        attrObj.name = str.slice(attrObj.nameStarts, attrObj.nameEnds);
      } else if (str[i] === "=") {
        DEV && console.log(`1372 equal char clauses`);
        /* istanbul ignore else */
        if (!attrObj.equalsAt) {
          DEV && console.log(`1375 equal hasn't been met`);
          attrObj.nameEnds = i;
          DEV &&
            console.log(
              `1379 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrObj.nameEnds`}\u001b[${39}m`} = ${JSON.stringify(
                attrObj.nameEnds,
                null,
                4
              )}`
            );
          attrObj.equalsAt = i;
          DEV &&
            console.log(
              `1388 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrObj.equalsAt`}\u001b[${39}m`} = ${JSON.stringify(
                attrObj.equalsAt,
                null,
                4
              )}`
            );
          attrObj.name = str.slice(attrObj.nameStarts, attrObj.nameEnds);
        }
      } else if (str[i] === "/" || isClosingAt(i)) {
        DEV &&
          console.log(
            `1399 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrObj.nameEnds`}\u001b[${39}m`} = ${JSON.stringify(
              attrObj.nameEnds,
              null,
              4
            )}`
          );
        attrObj.nameEnds = i;
        attrObj.name = str.slice(attrObj.nameStarts, attrObj.nameEnds);
        DEV &&
          console.log(
            `1409 \u001b[${33}m${`PUSH attrObj and wipe`}\u001b[${39}m`
          );
        // if (!tag.attributes) {
        //   tag.attributes = [];
        // }
        tag.attributes.push(attrObj);
        attrObj = {};
      } else if (isOpeningAt(i)) {
        DEV &&
          console.log(
            `1419 \u001b[${33}m${`ATTR NAME ENDS WITH NEW TAG`}\u001b[${39}m - ${`\u001b[${31}m${`TODO`}\u001b[${39}m`}`
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
          `1446 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} \u001b[${33}m${`attrObj.nameStarts`}\u001b[${39}m = ${
            attrObj.nameStarts
          }`
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
            `1479 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} \u001b[${33}m${`tag.onlyPlausible`}\u001b[${39}m = ${
              tag.onlyPlausible
            }`
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
        tag.nameStarts = i;
        tag.nameContainsLetters = false;
        DEV &&
          console.log(
            `1498 \u001b[${33}m${`tag.nameStarts`}\u001b[${39}m = ${
              tag.nameStarts
            }`
          );
      }
    }

    // Catch letters in the tag name. Necessary to filter out false positives like "<------"
    if (
      tag.nameStarts &&
      !tag.quotes &&
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
      // kl <c:when test="${!empty ab.cd && ab.cd > 0.00}"> mn
      //                                          ^
      //                                        we're here, it's false ending
      //
      notWithinAttrQuotes(tag, str, i)
    ) {
      let itIsClosing = true;

      if (itIsClosing && tag.lastOpeningBracketAt !== undefined) {
        // 1. mark the index
        tag.lastClosingBracketAt = i;

        DEV &&
          console.log(
            `1535 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} tag.lastClosingBracketAt = ${
              tag.lastClosingBracketAt
            }`
          );
        // 2. reset the spacesChunkWhichFollowsTheClosingBracketEndsAt
        spacesChunkWhichFollowsTheClosingBracketEndsAt = null;
        // 3. push attrObj into tag.attributes[]
        if (Object.keys(attrObj).length) {
          DEV &&
            console.log(
              `1545 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} \u001b[${33}m${`attrObj`}\u001b[${39}m & reset`
            );
          // if (!tag.attributes) {
          //   tag.attributes = [];
          // }
          tag.attributes.push(attrObj);
          attrObj = {};
        }
        // 4. if opts.dumpLinkHrefsNearby.enabled is on and we just recorded an href,
        if (
          opts.dumpLinkHrefsNearby.enabled &&
          hrefDump.tagName &&
          !hrefDump.openingTagEnds
        ) {
          // finish assembling the hrefDump{}
          hrefDump.openingTagEnds = i; // or tag.lastClosingBracketAt, same
          DEV &&
            console.log(
              `1563 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`hrefDump`}\u001b[${39}m`} = ${JSON.stringify(
                hrefDump,
                null,
                4
              )}`
            );
        }
      }
    }

    // catch the ending of the tag
    // -------------------------------------------------------------------------
    // the tag is "released" into "rApply":

    if (tag.lastOpeningBracketAt !== undefined) {
      DEV && console.log(`1578 opening bracket has been met`);
      DEV &&
        console.log(
          `1581 FIY, ${`\u001b[${33}m${`tag.lastClosingBracketAt`}\u001b[${39}m`} = ${JSON.stringify(
            tag.lastClosingBracketAt,
            null,
            4
          )}`
        );
      if (tag.lastClosingBracketAt === undefined) {
        DEV && console.log(`1588 closing bracket hasn't been met`);
        if (
          tag.lastOpeningBracketAt < i &&
          !isOpeningAt(i) && // to prevent cases like "text <<<<<< text"
          (str[i + 1] === undefined || isOpeningAt(i + 1)) &&
          tag.nameContainsLetters
        ) {
          DEV && console.log(`1595 str[i + 1] = ${str[i + 1]}`);
          // find out the tag name earlier than dedicated tag name ending catching section:
          // if (str[i + 1] === undefined) {
          tag.name = str
            .slice(tag.nameStarts, tag.nameEnds ? tag.nameEnds : i + 1)
            .toLowerCase();
          DEV &&
            console.log(
              `1603 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`tag.name`}\u001b[${39}m`} = ${JSON.stringify(
                tag.name,
                null,
                4
              )}`
            );

          // submit tag to allTagLocations
          /* istanbul ignore else */
          if (
            !allTagLocations.length ||
            allTagLocations[allTagLocations.length - 1][0] !==
              tag.lastOpeningBracketAt
          ) {
            allTagLocations.push([tag.lastOpeningBracketAt, i + 1]);
            DEV &&
              console.log(
                `1620 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                  tag.lastOpeningBracketAt
                }, ${i + 1}] to allTagLocations`
              );
          }

          if (
            // if it's an ignored tag
            opts.ignoreTags.includes(tag.name) ||
            // or ignored ranged tag
            checkIgnoreTagsWithTheirContents(i, opts, tag) ||
            // it's not a known HTML tag and...
            (!definitelyTagNames.has(tag.name) &&
              // ...EITHER situation is suspicious
              (tag.onlyPlausible ||
                // ...OR user instructed to strip only definitely HTML
                opts.stripRecognisedHTMLOnly))
          ) {
            DEV &&
              console.log(
                `1640 Ignored tag - \u001b[${31}m${`WIPE AND RESET`}\u001b[${39}m`
              );
            tag = {};
            attrObj = {};
            continue;
          }

          // if the tag is only plausible (there's space after opening bracket) and it's not among
          // recognised tags, leave it as it is:

          DEV && console.log(`1650`);
          if (
            ((definitelyTagNames.has(tag.name) ||
              singleLetterTags.has(tag.name)) &&
              (tag.onlyPlausible === false ||
                (tag.onlyPlausible === true && tag.attributes.length))) ||
            str[i + 1] === undefined
          ) {
            calculateHrefToBeInserted(opts);
            DEV &&
              console.log(
                `1661 ${`\u001b[${33}m${`stringToInsertAfter`}\u001b[${39}m`} = ${JSON.stringify(
                  stringToInsertAfter,
                  null,
                  4
                )}`
              );

            let whiteSpaceCompensation = calculateWhitespaceToInsert(
              str,
              i,
              tag.leftOuterWhitespace,
              i + 1,
              tag.lastOpeningBracketAt,
              tag.lastClosingBracketAt
            );

            DEV &&
              console.log(
                `1679 \u001b[${33}m${`cb()-PUSH: [${tag.leftOuterWhitespace}, ${
                  i + 1
                }, "${whiteSpaceCompensation}${stringToInsertAfter}${whiteSpaceCompensation}"]`}\u001b[${39}m`
              );
            DEV &&
              console.log(
                `1685 ${`\u001b[${33}m${`tag`}\u001b[${39}m`} = ${JSON.stringify(
                  tag,
                  null,
                  4
                )}`
              );

            opts.cb({
              tag: tag as Tag,
              deleteFrom: tag.leftOuterWhitespace,
              deleteTo: i + 1,
              insert: `${whiteSpaceCompensation}${stringToInsertAfter}${whiteSpaceCompensation}`,
              rangesArr: rangesToDelete as any,
              proposedReturn: [
                tag.leftOuterWhitespace,
                i + 1,
                `${whiteSpaceCompensation}${stringToInsertAfter}${whiteSpaceCompensation}`,
              ],
            });
            resetHrefMarkers();

            // also,
            treatRangedTags(i, opts, rangesToDelete);
          }
          DEV && console.log(`1709`);

          /* istanbul ignore else */
          if (
            !filteredTagLocations.length ||
            (filteredTagLocations[filteredTagLocations.length - 1][0] !==
              tag.lastOpeningBracketAt &&
              filteredTagLocations[filteredTagLocations.length - 1][1] !==
                i + 1)
          ) {
            DEV && console.log(`1719`);

            // filter out opening/closing tag pair because whole chunk
            // from opening's opening to closing's closing will be pushed
            if (
              opts.stripTogetherWithTheirContents.includes(tag.name) ||
              opts.stripTogetherWithTheirContents.includes("*")
            ) {
              DEV &&
                console.log(
                  `1729 FIY, ${`\u001b[${33}m${`rangedOpeningTagsForDeletion`}\u001b[${39}m`} = ${JSON.stringify(
                    rangedOpeningTagsForDeletion,
                    null,
                    4
                  )}`
                );

              // get the last opening counterpart of the pair
              // iterate rangedOpeningTagsForDeletion from the, pick the first
              // ranged opening tag whose name is same like current, closing's
              let lastRangedOpeningTag: any;
              for (let z = rangedOpeningTagsForDeletion.length; z--; ) {
                /* istanbul ignore else */
                if (rangedOpeningTagsForDeletion[z].name === tag.name) {
                  lastRangedOpeningTag = rangedOpeningTagsForDeletion[z];
                  DEV &&
                    console.log(
                      `1746 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`lastRangedOpeningTag`}\u001b[${39}m`} = ${JSON.stringify(
                        lastRangedOpeningTag,
                        null,
                        4
                      )}`
                    );
                  DEV && console.log(`1752 BREAK`);
                }
              }

              /* istanbul ignore else */
              if (lastRangedOpeningTag) {
                DEV &&
                  console.log(
                    `1760 ${`\u001b[${33}m${`filteredTagLocations`}\u001b[${39}m`} BEFORE: ${JSON.stringify(
                      filteredTagLocations,
                      null,
                      4
                    )}`
                  );
                filteredTagLocations = filteredTagLocations.filter(
                  ([from]) => from !== lastRangedOpeningTag.lastOpeningBracketAt
                );
                DEV &&
                  console.log(
                    `1771 ${`\u001b[${33}m${`filteredTagLocations`}\u001b[${39}m`} AFTER: ${JSON.stringify(
                      filteredTagLocations,
                      null,
                      4
                    )}`
                  );

                filteredTagLocations.push([
                  lastRangedOpeningTag.lastOpeningBracketAt,
                  i + 1,
                ]);
                DEV &&
                  console.log(
                    `1784 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                      lastRangedOpeningTag.lastOpeningBracketAt
                    }, ${i + 1}] to filteredTagLocations`
                  );
              } else {
                /* istanbul ignore next */
                filteredTagLocations.push([tag.lastOpeningBracketAt, i + 1]);
                DEV &&
                  console.log(
                    `1793 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                      tag.lastOpeningBracketAt
                    }, ${i + 1}] to filteredTagLocations`
                  );
              }
            } else {
              // if it's not ranged tag, just push it as it is to filteredTagLocations
              filteredTagLocations.push([tag.lastOpeningBracketAt, i + 1]);
              DEV &&
                console.log(
                  `1803 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                    tag.lastOpeningBracketAt
                  }, ${i + 1}] to filteredTagLocations`
                );
            }
          }
        }
        DEV && console.log(`1810 end`);
      } else if (
        (i > tag.lastClosingBracketAt && str[i].trim()) ||
        str[i + 1] === undefined
      ) {
        DEV && console.log(`1815 closing bracket has been met`);
        // case 2. closing bracket HAS BEEN met
        // we'll look for a non-whitespace character and delete up to it
        // BUT, we'll wipe the tag object only if that non-whitespace character
        // is not a ">". This way we'll catch and delete sequences of closing brackets.

        // part 1.

        let endingRangeIndex = tag.lastClosingBracketAt === i ? i + 1 : i;
        DEV &&
          console.log(
            `1826 ${`\u001b[${33}m${`endingRangeIndex`}\u001b[${39}m`} = ${JSON.stringify(
              endingRangeIndex,
              null,
              4
            )}`
          );

        if (
          opts.trimOnlySpaces &&
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
            `1848 ${`\u001b[${33}m${`tag.name`}\u001b[${39}m`} = ${JSON.stringify(
              tag.name,
              null,
              4
            )}`
          );

        // submit tag to allTagLocations
        /* istanbul ignore else */
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
              `1868 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                tag.lastOpeningBracketAt
              }, ${tag.lastClosingBracketAt + 1}] to allTagLocations`
            );
        }

        // let's define the flags here to prevent repetition and
        // make it easier to nest logical clauses
        let ignoreTags = opts.ignoreTags.includes(tag.name);
        let ignoreTagsWithTheirContents = checkIgnoreTagsWithTheirContents(
          i,
          opts,
          tag
        );

        // if we should not strip this tag
        if (
          !strip ||
          (opts.stripRecognisedHTMLOnly &&
            !definitelyTagNames.has(tag.name.toLowerCase())) ||
          (!onlyStripTagsMode && (ignoreTags || ignoreTagsWithTheirContents)) ||
          (onlyStripTagsMode && !opts.onlyStripTags.includes(tag.name))
        ) {
          DEV && console.log(`1891`);
          // if the "strip" flag is not activated, if we're not already between
          // ranged ignored tags, activate the "strip" flag
          if (ignoreTagsWithTheirContents) {
            // it depends, is it an opening tag
            if (tag.slashPresent) {
              DEV && console.log(`1897 it's an closing closing ranged tag`);

              for (let y = rangedOpeningTagsForIgnoring.length; y--; ) {
                if (rangedOpeningTagsForIgnoring[y].name === tag.name) {
                  // 2. delete the reference to this tag
                  rangedOpeningTagsForIgnoring.splice(y, 1);
                  DEV &&
                    console.log(
                      `1905 new \u001b[${33}m${`rangedOpeningTagsForIgnoring`}\u001b[${39}m = ${JSON.stringify(
                        rangedOpeningTagsForIgnoring,
                        null,
                        4
                      )}`
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
                    `1922 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`strip`}\u001b[${39}m`} = ${JSON.stringify(
                      strip,
                      null,
                      4
                    )}`
                  );
              }
            } else {
              DEV && console.log(`1930 it's an opening closing ranged tag`);
              if (strip) {
                strip = false;
                DEV &&
                  console.log(
                    `1935 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`strip`}\u001b[${39}m`} = ${JSON.stringify(
                      strip,
                      null,
                      4
                    )}`
                  );
              }

              rangedOpeningTagsForIgnoring.push(tag);
              DEV &&
                console.log(
                  `1946 pushed tag{} to \u001b[${33}m${`rangedOpeningTagsForIgnoring`}\u001b[${39}m\nwhich is now equal to:\n${JSON.stringify(
                    rangedOpeningTagsForIgnoring,
                    null,
                    4
                  )}`
                );
            }
          }

          // ping the callback with nulls:
          opts.cb({
            tag: tag as Tag,
            deleteFrom: null,
            deleteTo: null,
            insert: null,
            rangesArr: rangesToDelete as any,
            proposedReturn: null,
          });

          // don't submit the tag onto "filteredTagLocations"

          // then reset:
          DEV &&
            console.log(
              `1970 Ignored tag - \u001b[${31}m${`WIPE AND RESET`}\u001b[${39}m`
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
          /* istanbul ignore else */
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
                `1997 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                  tag.lastOpeningBracketAt
                }, ${tag.lastClosingBracketAt + 1}] to filteredTagLocations`
              );
          }

          // if this was an ignored tag name, algorithm would have bailed earlier,
          // in stage "catch the ending of the tag name".

          let whiteSpaceCompensation = calculateWhitespaceToInsert(
            str,
            i,
            tag.leftOuterWhitespace,
            endingRangeIndex,
            tag.lastOpeningBracketAt,
            tag.lastClosingBracketAt
          );
          DEV &&
            console.log(
              `2016 ${`\u001b[${33}m${`whiteSpaceCompensation`}\u001b[${39}m`} = ${JSON.stringify(
                whiteSpaceCompensation,
                null,
                4
              )} (length: ${whiteSpaceCompensation.length})`
            );

          // calculate optional opts.dumpLinkHrefsNearby.enabled HREF to insert
          stringToInsertAfter = "";
          hrefInsertionActive = false;

          calculateHrefToBeInserted(opts);

          DEV &&
            console.log(
              `2031 ${`\u001b[${33}m${`stringToInsertAfter`}\u001b[${39}m`} = ${JSON.stringify(
                stringToInsertAfter,
                null,
                4
              )}`
            );
          let insert;
          if (isStr(stringToInsertAfter) && stringToInsertAfter.length) {
            insert = `${whiteSpaceCompensation}${stringToInsertAfter}${
              /* istanbul ignore next */
              whiteSpaceCompensation === "\n\n" ? "\n" : whiteSpaceCompensation
            }`;
            DEV &&
              console.log(
                `2045 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`insert`}\u001b[${39}m`} = ${JSON.stringify(
                  insert,
                  null,
                  4
                )}`
              );
          } else {
            insert = whiteSpaceCompensation;
            DEV &&
              console.log(
                `2055 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`insert`}\u001b[${39}m`} = ${JSON.stringify(
                  insert,
                  null,
                  4
                )}`
              );
          }

          if (
            tag.leftOuterWhitespace === 0 ||
            !right(str, endingRangeIndex - 1)
          ) {
            insert = "";
            DEV &&
              console.log(
                `2070 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`insert`}\u001b[${39}m`} = ${JSON.stringify(
                  insert,
                  null,
                  4
                )}`
              );
          }

          // pass the range onto the callback function, be it default or user's
          DEV &&
            console.log(
              `2081 \u001b[${33}m${`cb()-SUBMIT RANGE #2: [${
                tag.leftOuterWhitespace
              }, ${endingRangeIndex}, ${JSON.stringify(
                insert,
                null,
                0
              )}]`}\u001b[${39}m`
            );
          opts.cb({
            tag: tag as Tag,
            deleteFrom: tag.leftOuterWhitespace,
            deleteTo: endingRangeIndex,
            insert,
            rangesArr: rangesToDelete as any,
            proposedReturn: [tag.leftOuterWhitespace, endingRangeIndex, insert],
          });
          resetHrefMarkers();

          // also,
          treatRangedTags(i, opts, rangesToDelete);
        } else {
          DEV && console.log(`2102 \u001b[${33}m${`RESET tag{}`}\u001b[${39}m`);
          tag = {};
        }

        // part 2.
        if (!isClosingAt(i)) {
          DEV && console.log(`2108 \u001b[${33}m${`RESET tag{}`}\u001b[${39}m`);
          tag = {};
        }
      }
    }

    // catch an opening bracket
    // -------------------------------------------------------------------------
    if (
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
      DEV && console.log(`2149 caught opening bracket`);
      // cater sequences of opening brackets "<<<<div>>>"
      if (isClosingAt(right(str, i) as number)) {
        // cater cases like: "<><><>"
        DEV && console.log(`2153 cases like <><><>`);
        continue;
      } else {
        DEV && console.log(`2156 opening brackets else clauses`);
        // 1. Before (re)setting flags, check, do we have a case of a tag with a
        // missing closing bracket, and this is a new tag following it.

        DEV &&
          console.log(
            `2162 R1: ${!!tag.nameEnds}; R2: ${
              tag.nameEnds < i
            }; R3: ${!tag.lastClosingBracketAt}`
          );
        if (tag.nameEnds && tag.nameEnds < i && !tag.lastClosingBracketAt) {
          DEV && console.log(`2167`);
          DEV &&
            console.log(
              `2170 R1: ${!!tag.onlyPlausible}; R2: ${!definitelyTagNames.has(
                tag.name
              )}; R3: ${!singleLetterTags.has(tag.name)}; R4: ${!tag.attributes
                ?.length}`
            );
          if (
            (tag.onlyPlausible === true &&
              tag.attributes &&
              tag.attributes.length) ||
            tag.onlyPlausible === false
          ) {
            DEV && console.log(`2181`);
            // tag.onlyPlausible can be undefined too
            let whiteSpaceCompensation = calculateWhitespaceToInsert(
              str,
              i,
              tag.leftOuterWhitespace,
              i,
              tag.lastOpeningBracketAt,
              i
            );

            DEV &&
              console.log(
                `2194 cb()-PUSH range [${tag.leftOuterWhitespace}, ${i}, "${whiteSpaceCompensation}"]`
              );
            opts.cb({
              tag: tag as Tag,
              deleteFrom: tag.leftOuterWhitespace,
              deleteTo: i,
              insert: whiteSpaceCompensation,
              rangesArr: rangesToDelete as any,
              proposedReturn: [
                tag.leftOuterWhitespace,
                i,
                whiteSpaceCompensation,
              ],
            });

            // also,
            treatRangedTags(i, opts, rangesToDelete);

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
            console.log(`2227 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} tag`);
          tag.lastOpeningBracketAt = undefined;
          tag.name = undefined;
          tag.onlyPlausible = false;
          DEV &&
            console.log(
              `2233 NOW ${`\u001b[${33}m${`tag`}\u001b[${39}m`} = ${JSON.stringify(
                tag,
                null,
                4
              )}`
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
          // edges but until "\t" on the left and "\n" on the right IF opts.trimOnlySpaces is on.

          if (chunkOfWhitespaceStartsAt === null) {
            tag.leftOuterWhitespace = i;
          } else if (opts.trimOnlySpaces && chunkOfWhitespaceStartsAt === 0) {
            // if whitespace extends to the beginning of a string, there's a risk it might include
            // not only spaces. To fix that, switch to space-only range marker:

            /* istanbul ignore next */
            tag.leftOuterWhitespace = chunkOfSpacesStartsAt || i;
          } else {
            tag.leftOuterWhitespace = chunkOfWhitespaceStartsAt;
          }

          // tag.leftOuterWhitespace =
          //   chunkOfWhitespaceStartsAt === null ? i : chunkOfWhitespaceStartsAt;

          DEV &&
            console.log(
              `2270 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} \u001b[${33}m${`tag.leftOuterWhitespace`}\u001b[${39}m = ${
                tag.leftOuterWhitespace
              }; \u001b[${33}m${`tag.lastOpeningBracketAt`}\u001b[${39}m = ${
                tag.lastOpeningBracketAt
              }; \u001b[${33}m${`tag.slashPresent`}\u001b[${39}m = false`
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
                `2288 \u001b[${31}m${`███████████████████████████████████████`}\u001b[${39}m`
              );
            // make a note which one it is:
            let cdata = true;
            if (str[i + 2] === "-") {
              cdata = false;
            }
            DEV && console.log("2295 traversing forward");
            let closingFoundAt;
            for (let y = i; y < len; y++) {
              DEV &&
                console.log(
                  `${`\u001b[${33}m${`str[${y}]`}\u001b[${39}m`} = ${str[y]}`
                );
              if (
                (!closingFoundAt &&
                  cdata &&
                  `${str[y - 2]}${str[y - 1]}${str[y]}` === "]]>") ||
                (!cdata && `${str[y - 2]}${str[y - 1]}${str[y]}` === "-->")
              ) {
                closingFoundAt = y;
                DEV && console.log(`2309 closingFoundAt = ${closingFoundAt}`);
              }

              if (
                closingFoundAt &&
                ((closingFoundAt < y && str[y].trim()) ||
                  str[y + 1] === undefined)
              ) {
                DEV && console.log("2317 END detected");
                let rangeEnd = y;
                if (
                  (str[y + 1] === undefined && !str[y].trim()) ||
                  str[y] === ">"
                ) {
                  rangeEnd += 1;
                }

                // submit the tag
                /* istanbul ignore else */
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
                      `2339 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                        tag.lastOpeningBracketAt
                      }, ${closingFoundAt + 1}] to allTagLocations`
                    );
                }

                /* istanbul ignore else */
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
                      `2357 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                        tag.lastOpeningBracketAt
                      }, ${closingFoundAt + 1}] to filteredTagLocations`
                    );
                }

                let whiteSpaceCompensation = calculateWhitespaceToInsert(
                  str,
                  y,
                  tag.leftOuterWhitespace,
                  rangeEnd,
                  tag.lastOpeningBracketAt,
                  closingFoundAt
                );
                DEV &&
                  console.log(
                    `2373 cb()-PUSH range [${tag.leftOuterWhitespace}, ${rangeEnd}, "${whiteSpaceCompensation}"]`
                  );
                opts.cb({
                  tag: tag as Tag,
                  deleteFrom: tag.leftOuterWhitespace,
                  deleteTo: rangeEnd,
                  insert: whiteSpaceCompensation,
                  rangesArr: rangesToDelete as any,
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
    if (!str[i].trim()) {
      // 1. catch chunk boundaries:
      if (chunkOfWhitespaceStartsAt === null) {
        chunkOfWhitespaceStartsAt = i;
        DEV &&
          console.log(
            `2413 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} \u001b[${33}m${`chunkOfWhitespaceStartsAt`}\u001b[${39}m = ${chunkOfWhitespaceStartsAt}`
          );
        if (
          tag.lastOpeningBracketAt !== undefined &&
          tag.lastOpeningBracketAt < i &&
          tag.nameStarts &&
          tag.nameStarts < tag.lastOpeningBracketAt &&
          i === tag.lastOpeningBracketAt + 1 &&
          // insurance against tail part of ranged tag being deleted:
          !rangedOpeningTagsForDeletion.some(
            // eslint-disable-next-line no-loop-func
            (rangedTagObj) => rangedTagObj.name === tag.name
          )
        ) {
          DEV &&
            console.log(
              `2429 RESET ALL \u001b[${31}m${`███████████████████████████████████████`}\u001b[${39}m`
            );
          tag.onlyPlausible = true;
          tag.name = undefined;
          tag.nameStarts = undefined;
        }
      }
    } else if (chunkOfWhitespaceStartsAt !== null) {
      DEV && console.log("2437");
      // 1. piggyback the catching of the attributes with equal and no value
      if (
        !tag.quotes &&
        attrObj.equalsAt > chunkOfWhitespaceStartsAt - 1 &&
        attrObj.nameEnds &&
        attrObj.equalsAt > attrObj.nameEnds &&
        str[i] !== '"' &&
        str[i] !== "'"
      ) {
        /* istanbul ignore else */
        if (isObj(attrObj)) {
          DEV &&
            console.log(
              `2451 PUSHING ${`\u001b[${33}m${`attrObj`}\u001b[${39}m`} = ${JSON.stringify(
                attrObj,
                null,
                4
              )}`
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
          `2468 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} \u001b[${33}m${`chunkOfWhitespaceStartsAt`}\u001b[${39}m = ${chunkOfWhitespaceStartsAt}`
        );
    }

    // catch spaces-only chunks (needed for outer trim option opts.trimOnlySpaces)
    // -------------------------------------------------------------------------

    if (str[i] === " ") {
      // 1. catch spaces boundaries:
      if (chunkOfSpacesStartsAt === null) {
        chunkOfSpacesStartsAt = i;
        DEV &&
          console.log(
            `2481 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} \u001b[${33}m${`chunkOfSpacesStartsAt`}\u001b[${39}m = ${chunkOfSpacesStartsAt}`
          );
      }
    } else if (chunkOfSpacesStartsAt !== null) {
      // 2. reset the marker
      chunkOfSpacesStartsAt = null;
      DEV &&
        console.log(
          `2489 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} \u001b[${33}m${`chunkOfSpacesStartsAt`}\u001b[${39}m = ${chunkOfSpacesStartsAt}`
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
        `2505 ${`\u001b[${33}m${`rangedOpeningTagsForDeletion`}\u001b[${39}m`} = ${JSON.stringify(
          rangedOpeningTagsForDeletion,
          null,
          4
        )}`
      );
    DEV &&
      console.log(
        `2513 ${`\u001b[${33}m${`rangedOpeningTagsForIgnoring`}\u001b[${39}m`} = ${JSON.stringify(
          rangedOpeningTagsForIgnoring,
          null,
          4
        )}`
      );
    DEV &&
      console.log(
        `2521 ${`\u001b[${33}m${`filteredTagLocations`}\u001b[${39}m`} = ${JSON.stringify(
          filteredTagLocations,
          null,
          4
        )}`
      );
    DEV &&
      console.log(
        `2529 ${`\u001b[${33}m${`spacesChunkWhichFollowsTheClosingBracketEndsAt`}\u001b[${39}m`} = ${JSON.stringify(
          spacesChunkWhichFollowsTheClosingBracketEndsAt,
          null,
          4
        )}`
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
        `2544 ${`\u001b[${33}m${`hrefDump`}\u001b[${39}m`} = ${JSON.stringify(
          hrefDump,
          null,
          4
        )}`
      );
    DEV &&
      console.log(
        `2552 ${`\u001b[${33}m${`attrObj`}\u001b[${39}m`} = ${JSON.stringify(
          attrObj,
          null,
          4
        )}`
      );
    DEV &&
      console.log(
        `2560 ${
          Object.keys(tag).length
            ? `${`\u001b[${35}m${`tag`}\u001b[${39}m`} = ${Object.keys(tag)
                // eslint-disable-next-line no-loop-func
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
        }`
      );
    DEV &&
      console.log(
        `2581 ${`\u001b[${33}m${`strip`}\u001b[${39}m`} = ${`\u001b[${
          strip ? 32 : 31
        }m${JSON.stringify(strip, null, 0)}\u001b[${39}m`}`
      );
  }

  DEV && console.log("\n\n\n\n\n\n END \n\n\n\n\n\n");

  // trim but in ranges
  // first tackle the beginning on the string
  if (
    str &&
    // if only spaces were meant to be trimmed,
    ((opts.trimOnlySpaces &&
      // and first character is a space
      str[0] === " ") ||
      // if normal trim is requested
      (!opts.trimOnlySpaces &&
        // and the first character is whitespace character
        !str[0].trim()))
  ) {
    DEV && console.log(`2602 trim frontal part`);
    for (let i = 0, len = str.length; i < len; i++) {
      if (
        (opts.trimOnlySpaces && str[i] !== " ") ||
        (!opts.trimOnlySpaces && str[i].trim())
      ) {
        DEV && console.log(`2608 PUSH [0, ${i}]`);
        rangesToDelete.push([0, i]);
        break;
      } else if (!str[i + 1]) {
        // if end has been reached and whole string has been trimmable
        DEV && console.log(`2613 PUSH [0, ${i + 1}]`);
        rangesToDelete.push([0, i + 1]);
      }
    }
  }

  if (
    str &&
    // if only spaces were meant to be trimmed,
    ((opts.trimOnlySpaces &&
      // and last character is a space
      str[str.length - 1] === " ") ||
      // if normal trim is requested
      (!opts.trimOnlySpaces &&
        // and the last character is whitespace character
        !str[str.length - 1].trim()))
  ) {
    for (let i = str.length; i--; ) {
      if (
        (opts.trimOnlySpaces && str[i] !== " ") ||
        (!opts.trimOnlySpaces && str[i].trim())
      ) {
        DEV && console.log(`2635 PUSH [i + 1, ${str.length}]`);
        rangesToDelete.push([i + 1, str.length]);
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
  // "opts.trimOnlySpaces" of course.
  let curr = rangesToDelete.current();
  if ((!originalOpts || !originalOpts.cb) && curr) {
    // check front - the first range of gathered ranges, does it touch start (0)
    if (curr[0] && !curr[0][0]) {
      DEV &&
        console.log(
          `2657 ${`\u001b[${33}m${`the first range`}\u001b[${39}m`} = ${JSON.stringify(
            curr[0],
            null,
            4
          )}`
        );
      let startingIdx = curr[0][1];
      // check the character at str[startingIdx]
      DEV &&
        console.log(
          `2667 ${`\u001b[${33}m${`startingIdx`}\u001b[${39}m`} = ${JSON.stringify(
            startingIdx,
            null,
            4
          )}`
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
    if (curr[curr.length - 1] && curr[curr.length - 1][1] === str.length) {
      DEV &&
        console.log(
          `2687 ${`\u001b[${33}m${`the last range`}\u001b[${39}m`} = ${JSON.stringify(
            curr[curr.length - 1],
            null,
            4
          )}; str.length = ${str.length}`
        );
      let startingIdx = curr[curr.length - 1][0];
      // check character at str[startingIdx - 1]
      DEV &&
        console.log(
          `2697 ${`\u001b[${33}m${`startingIdx`}\u001b[${39}m`} = ${JSON.stringify(
            startingIdx,
            null,
            4
          )}`
        );
      // remove third element from the last range "what to add" - because
      // ranges will crop aggressively, covering all whitespace, but they
      // then restore missing spaces (in which case it's not missing).
      // We already have tight crop, we just need to remove that "what to add"
      // third element.

      // hard edit:

      /* istanbul ignore else */
      if (rangesToDelete.ranges) {
        let startingIdx2 =
          rangesToDelete.ranges[rangesToDelete.ranges.length - 1][0];

        if (
          str[startingIdx2 - 1] &&
          ((opts.trimOnlySpaces && str[startingIdx2 - 1] === " ") ||
            (!opts.trimOnlySpaces && !str[startingIdx2 - 1].trim()))
        ) {
          startingIdx2 -= 1;
        }

        let backupWhatToAdd =
          rangesToDelete.ranges[rangesToDelete.ranges.length - 1][2];

        rangesToDelete.ranges[rangesToDelete.ranges.length - 1] = [
          startingIdx2,
          rangesToDelete.ranges[rangesToDelete.ranges.length - 1][1],
        ];

        // for cases of opts.dumpLinkHrefsNearby
        if (backupWhatToAdd?.trim()) {
          rangesToDelete.ranges[rangesToDelete.ranges.length - 1].push(
            backupWhatToAdd.trimEnd() as any
          );
        }
      }
    }
  }

  let res: Res = {
    log: {
      timeTakenInMilliseconds: Date.now() - start,
    },
    result: rApply(str, rangesToDelete.current()),
    ranges: rangesToDelete.current(),
    allTagLocations,
    filteredTagLocations,
  };
  DEV &&
    console.log(
      `2753 ${`\u001b[${32}m${`FINAL RESULT`}\u001b[${39}m`} = ${JSON.stringify(
        res,
        null,
        4
      )}`
    );

  return res;
}

export { stripHtml, defaults, version, CbObj };
