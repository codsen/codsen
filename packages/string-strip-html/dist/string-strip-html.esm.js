/**
 * string-strip-html
 * Strips HTML tags from strings. No parser, accepts mixed sources.
 * Version: 6.3.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-strip-html/
 */

import rangesApply from 'ranges-apply';
import Ranges from 'ranges-push';
import isObj from 'lodash.isplainobject';
import trim from 'lodash.trim';
import without from 'lodash.without';
import ent from 'ent';
import { right } from 'string-left-right';

function characterSuitableForNames(char) {
  return /[-_A-Za-z0-9]/.test(char);
}
function prepHopefullyAnArray(something, name) {
  if (!something) {
    return [];
  }
  if (Array.isArray(something)) {
    return something.filter((val) => typeof val === "string" && val.trim());
  }
  if (typeof something === "string") {
    return something.trim() ? [something] : [];
  }
  throw new TypeError(
    `string-strip-html/stripHtml(): [THROW_ID_03] ${name} must be array containing zero or more strings or something falsey. Currently it's equal to: ${something}, that a type of ${typeof something}.`
  );
}

function stripHtml(str, originalOpts) {
  const start = Date.now();
  const definitelyTagNames = new Set([
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
  const singleLetterTags = new Set(["a", "b", "i", "p", "q", "s", "u"]);
  const punctuation = new Set([
    ".",
    ",",
    "?",
    ";",
    ")",
    "\u2026",
    '"',
    "\u00BB",
  ]);
  const stripTogetherWithTheirContentsDefaults = new Set([
    "script",
    "style",
    "xml",
  ]);
  const rangedOpeningTags = [];
  const allTagLocations = [];
  let filteredTagLocations = [];
  let tag;
  function resetTag() {
    tag = { attributes: [] };
  }
  resetTag();
  let chunkOfWhitespaceStartsAt = null;
  let chunkOfSpacesStartsAt = null;
  let attrObj = {};
  let hrefDump = {};
  let stringToInsertAfter = "";
  let hrefInsertionActive;
  let spacesChunkWhichFollowsTheClosingBracketEndsAt = null;
  function existy(x) {
    return x != null;
  }
  function isStr(something) {
    return typeof something === "string";
  }
  function treatRangedTags(i, opts, rangesToDelete) {
    if (
      Array.isArray(opts.stripTogetherWithTheirContents) &&
      (opts.stripTogetherWithTheirContents.includes(tag.name) ||
        opts.stripTogetherWithTheirContents.includes("*"))
    ) {
      if (
        Array.isArray(rangedOpeningTags) &&
        rangedOpeningTags.some(
          (obj) => obj.name === tag.name && obj.lastClosingBracketAt < i
        )
      ) {
        for (let y = rangedOpeningTags.length; y--; ) {
          if (rangedOpeningTags[y].name === tag.name) {
            /* istanbul ignore else */
            if (
              opts.stripTogetherWithTheirContents.includes(tag.name) ||
              opts.stripTogetherWithTheirContents.includes("*")
            ) {
              filteredTagLocations = filteredTagLocations.filter(
                ([from, upto]) =>
                  (from < rangedOpeningTags[y].lastOpeningBracketAt ||
                    from >= i + 1) &&
                  (upto <= rangedOpeningTags[y].lastOpeningBracketAt ||
                    upto > i + 1)
              );
            }
            let endingIdx = i + 1;
            if (tag.lastClosingBracketAt) {
              endingIdx = tag.lastClosingBracketAt + 1;
            }
            filteredTagLocations.push([
              rangedOpeningTags[y].lastOpeningBracketAt,
              endingIdx,
            ]);
            if (punctuation.has(str[i])) {
              opts.cb({
                tag,
                deleteFrom: rangedOpeningTags[y].lastOpeningBracketAt,
                deleteTo: i + 1,
                insert: null,
                rangesArr: rangesToDelete,
                proposedReturn: [
                  rangedOpeningTags[y].lastOpeningBracketAt,
                  i,
                  null,
                ],
              });
            } else {
              opts.cb({
                tag,
                deleteFrom: rangedOpeningTags[y].lastOpeningBracketAt,
                deleteTo: i,
                insert: "",
                rangesArr: rangesToDelete,
                proposedReturn: [
                  rangedOpeningTags[y].lastOpeningBracketAt,
                  i,
                  "",
                ],
              });
            }
            rangedOpeningTags.splice(y, 1);
            break;
          }
        }
      } else {
        rangedOpeningTags.push(tag);
      }
    }
  }
  function calculateWhitespaceToInsert(
    str2,
    currCharIdx,
    fromIdx,
    toIdx,
    lastOpeningBracketAt,
    lastClosingBracketAt
  ) {
    let strToEvaluateForLineBreaks = "";
    if (fromIdx < lastOpeningBracketAt) {
      strToEvaluateForLineBreaks += str2.slice(fromIdx, lastOpeningBracketAt);
    }
    if (toIdx > lastClosingBracketAt + 1) {
      const temp = str2.slice(lastClosingBracketAt + 1, toIdx);
      if (temp.includes("\n") && str2[toIdx] === "<") {
        strToEvaluateForLineBreaks += " ";
      } else {
        strToEvaluateForLineBreaks += temp;
      }
    }
    if (!punctuation.has(str2[currCharIdx]) && str2[currCharIdx] !== "!") {
      const foundLineBreaks = strToEvaluateForLineBreaks.match(/\n/g);
      if (Array.isArray(foundLineBreaks) && foundLineBreaks.length) {
        if (foundLineBreaks.length === 1) {
          return "\n";
        }
        if (foundLineBreaks.length === 2) {
          return "\n\n";
        }
        return "\n\n\n";
      }
      return " ";
    }
    return "";
  }
  function calculateHrefToBeInserted(opts) {
    if (
      opts.dumpLinkHrefsNearby.enabled &&
      Object.keys(hrefDump).length &&
      hrefDump.tagName === tag.name &&
      tag.lastOpeningBracketAt &&
      ((hrefDump.openingTagEnds &&
        tag.lastOpeningBracketAt > hrefDump.openingTagEnds) ||
        !hrefDump.openingTagEnds)
    ) {
      hrefInsertionActive = true;
    }
    if (hrefInsertionActive) {
      const lineBreaks = opts.dumpLinkHrefsNearby.putOnNewLine ? "\n\n" : "";
      stringToInsertAfter = `${lineBreaks}${hrefDump.hrefValue}${lineBreaks}`;
    }
  }
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
  function resetHrefMarkers() {
    if (hrefInsertionActive) {
      hrefDump = {};
      hrefInsertionActive = false;
    }
  }
  const defaults = {
    ignoreTags: [],
    onlyStripTags: [],
    stripTogetherWithTheirContents: [...stripTogetherWithTheirContentsDefaults],
    skipHtmlDecoding: false,
    trimOnlySpaces: false,
    dumpLinkHrefsNearby: {
      enabled: false,
      putOnNewLine: false,
      wrapHeads: "",
      wrapTails: "",
    },
    cb: null,
  };
  const opts = { ...defaults, ...originalOpts };
  if (Object.prototype.hasOwnProperty.call(opts, "returnRangesOnly")) {
    throw new TypeError(
      `string-strip-html/stripHtml(): [THROW_ID_03] opts.returnRangesOnly has been removed from the API since v.5 release.`
    );
  }
  opts.ignoreTags = prepHopefullyAnArray(opts.ignoreTags, "opts.ignoreTags");
  opts.onlyStripTags = prepHopefullyAnArray(
    opts.onlyStripTags,
    "opts.onlyStripTags"
  );
  const onlyStripTagsMode = !!opts.onlyStripTags.length;
  if (opts.onlyStripTags.length && opts.ignoreTags.length) {
    opts.onlyStripTags = without(opts.onlyStripTags, ...opts.ignoreTags);
  }
  if (!isObj(opts.dumpLinkHrefsNearby)) {
    opts.dumpLinkHrefsNearby = { ...defaults.dumpLinkHrefsNearby };
  }
  opts.dumpLinkHrefsNearby = defaults.dumpLinkHrefsNearby;
  if (
    isObj(originalOpts) &&
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
    opts.stripTogetherWithTheirContents.length > 0
  ) {
    opts.stripTogetherWithTheirContents = [opts.stripTogetherWithTheirContents];
  }
  const somethingCaught = {};
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
  if (!opts.cb) {
    opts.cb = ({ rangesArr, proposedReturn }) => {
      rangesArr.push(...proposedReturn);
    };
  }
  const rangesToDelete = new Ranges({
    limitToBeAddedWhitespace: true,
    limitLinebreaksCount: 2,
  });
  if (!opts.skipHtmlDecoding) {
    while (str !== ent.decode(str)) {
      str = ent.decode(str);
    }
  }
  for (let i = 0, len = str.length; i < len; i++) {
    if (
      Object.keys(tag).length > 1 &&
      tag.lastClosingBracketAt &&
      tag.lastClosingBracketAt < i &&
      str[i] !== " " &&
      spacesChunkWhichFollowsTheClosingBracketEndsAt === null
    ) {
      spacesChunkWhichFollowsTheClosingBracketEndsAt = i;
    }
    if (str[i] === ">") {
      if ((!tag || Object.keys(tag).length < 2) && i > 1) {
        for (let y = i; y--; ) {
          if (str[y - 1] === undefined || str[y] === ">") {
            const startingPoint = str[y - 1] === undefined ? y : y + 1;
            const culprit = str.slice(startingPoint, i + 1);
            if (
              str !== `<${trim(culprit.trim(), "/>")}>` &&
              [...definitelyTagNames].some(
                (val) =>
                  trim(
                    culprit
                      .trim()
                      .split(/\s+/)
                      .filter((val2) => val2.trim())
                      .filter((val3, i3) => i3 === 0),
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
              }
              /* istanbul ignore else */
              if (
                !filteredTagLocations.length ||
                filteredTagLocations[filteredTagLocations.length - 1][0] !==
                  tag.lastOpeningBracketAt
              ) {
                filteredTagLocations.push([startingPoint, i + 1]);
              }
              const whiteSpaceCompensation = calculateWhitespaceToInsert(
                str,
                i,
                startingPoint,
                i + 1,
                startingPoint,
                i + 1
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
              opts.cb({
                tag,
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
    if (
      str[i] === "/" &&
      !(tag.quotes && tag.quotes.value) &&
      Number.isInteger(tag.lastOpeningBracketAt) &&
      !Number.isInteger(tag.lastClosingBracketAt)
    ) {
      tag.slashPresent = i;
    }
    if (str[i] === '"' || str[i] === "'") {
      if (
        tag.nameStarts &&
        tag.quotes &&
        tag.quotes.value &&
        tag.quotes.value === str[i]
      ) {
        attrObj.valueEnds = i;
        attrObj.value = str.slice(attrObj.valueStarts, i);
        tag.attributes.push(attrObj);
        attrObj = {};
        tag.quotes = undefined;
        let hrefVal;
        if (
          opts.dumpLinkHrefsNearby.enabled &&
          tag.attributes.some((obj) => {
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
            hrefValue: hrefVal,
          };
        }
      } else if (!tag.quotes && tag.nameStarts) {
        tag.quotes = {};
        tag.quotes.value = str[i];
        tag.quotes.start = i;
        if (
          attrObj.nameStarts &&
          attrObj.nameEnds &&
          attrObj.nameEnds < i &&
          attrObj.nameStarts < i &&
          !attrObj.valueStarts
        ) {
          attrObj.name = str.slice(attrObj.nameStarts, attrObj.nameEnds);
        }
      }
    }
    if (
      tag.nameStarts !== undefined &&
      tag.nameEnds === undefined &&
      (!str[i].trim() || !characterSuitableForNames(str[i]))
    ) {
      tag.nameEnds = i;
      tag.name = str.slice(
        tag.nameStarts,
        tag.nameEnds +
          /* istanbul ignore next */
          (str[i] !== ">" && str[i] !== "/" && str[i + 1] === undefined ? 1 : 0)
      );
      if (
        (str[tag.nameStarts - 1] !== "!" &&
          !tag.name.replace(/-/g, "").length) ||
        /^\d+$/.test(tag.name[0])
      ) {
        tag = {};
        continue;
      }
      if (str[i] === "<") {
        calculateHrefToBeInserted(opts);
        const whiteSpaceCompensation = calculateWhitespaceToInsert(
          str,
          i,
          tag.leftOuterWhitespace,
          i,
          tag.lastOpeningBracketAt,
          i
        );
        if (
          opts.stripTogetherWithTheirContents.includes(tag.name) ||
          opts.stripTogetherWithTheirContents.includes("*")
        ) {
          /* istanbul ignore next */
          filteredTagLocations = filteredTagLocations.filter(
            ([from, upto]) => !(from === tag.leftOuterWhitespace && upto === i)
          );
        }
        opts.cb({
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
        });
        resetHrefMarkers();
        treatRangedTags(i, opts, rangesToDelete);
      }
    }
    if (
      tag.quotes &&
      tag.quotes.start &&
      tag.quotes.start < i &&
      !tag.quotes.end &&
      attrObj.nameEnds &&
      attrObj.equalsAt &&
      !attrObj.valueStarts
    ) {
      attrObj.valueStarts = i;
    }
    if (
      !tag.quotes &&
      attrObj.nameEnds &&
      str[i] === "=" &&
      !attrObj.valueStarts &&
      !attrObj.equalsAt
    ) {
      attrObj.equalsAt = i;
    }
    if (
      !tag.quotes &&
      attrObj.nameStarts &&
      attrObj.nameEnds &&
      !attrObj.valueStarts &&
      str[i].trim() &&
      str[i] !== "="
    ) {
      tag.attributes.push(attrObj);
      attrObj = {};
    }
    if (!tag.quotes && attrObj.nameStarts && !attrObj.nameEnds) {
      if (!str[i].trim()) {
        attrObj.nameEnds = i;
        attrObj.name = str.slice(attrObj.nameStarts, attrObj.nameEnds);
      } else if (str[i] === "=") {
        /* istanbul ignore else */
        if (!attrObj.equalsAt) {
          attrObj.nameEnds = i;
          attrObj.equalsAt = i;
          attrObj.name = str.slice(attrObj.nameStarts, attrObj.nameEnds);
        }
      } else if (str[i] === "/" || str[i] === ">") {
        attrObj.nameEnds = i;
        attrObj.name = str.slice(attrObj.nameStarts, attrObj.nameEnds);
        tag.attributes.push(attrObj);
        attrObj = {};
      } else if (str[i] === "<") {
        attrObj.nameEnds = i;
        attrObj.name = str.slice(attrObj.nameStarts, attrObj.nameEnds);
        tag.attributes.push(attrObj);
        attrObj = {};
      }
    }
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
    }
    if (
      tag.lastOpeningBracketAt !== null &&
      tag.lastOpeningBracketAt < i &&
      str[i] === "/" &&
      tag.onlyPlausible
    ) {
      tag.onlyPlausible = false;
    }
    if (
      tag.lastOpeningBracketAt !== null &&
      tag.lastOpeningBracketAt < i &&
      str[i] !== "/"
    ) {
      if (tag.onlyPlausible === undefined) {
        if ((!str[i].trim() || str[i] === "<") && !tag.slashPresent) {
          tag.onlyPlausible = true;
        } else {
          tag.onlyPlausible = false;
        }
      }
      if (
        str[i].trim() &&
        tag.nameStarts === undefined &&
        str[i] !== "<" &&
        str[i] !== "/" &&
        str[i] !== ">" &&
        str[i] !== "!"
      ) {
        tag.nameStarts = i;
        tag.nameContainsLetters = false;
      }
    }
    if (
      tag.nameStarts &&
      !tag.quotes &&
      str[i].toLowerCase() !== str[i].toUpperCase()
    ) {
      tag.nameContainsLetters = true;
    }
    if (str[i] === ">") {
      if (tag.lastOpeningBracketAt !== undefined) {
        tag.lastClosingBracketAt = i;
        spacesChunkWhichFollowsTheClosingBracketEndsAt = null;
        if (Object.keys(attrObj).length) {
          tag.attributes.push(attrObj);
          attrObj = {};
        }
        if (
          opts.dumpLinkHrefsNearby.enabled &&
          hrefDump.tagName &&
          !hrefDump.openingTagEnds
        ) {
          hrefDump.openingTagEnds = i;
        }
      }
    }
    if (tag.lastOpeningBracketAt !== undefined) {
      if (tag.lastClosingBracketAt === undefined) {
        if (
          tag.lastOpeningBracketAt < i &&
          str[i] !== "<" &&
          (str[i + 1] === undefined || str[i + 1] === "<") &&
          tag.nameContainsLetters
        ) {
          tag.name = str
            .slice(tag.nameStarts, tag.nameEnds ? tag.nameEnds : i + 1)
            .toLowerCase();
          /* istanbul ignore else */
          if (
            !allTagLocations.length ||
            allTagLocations[allTagLocations.length - 1][0] !==
              tag.lastOpeningBracketAt
          ) {
            allTagLocations.push([tag.lastOpeningBracketAt, i + 1]);
          }
          if (
            opts.ignoreTags.includes(tag.name) ||
            (tag.onlyPlausible && !definitelyTagNames.has(tag.name))
          ) {
            tag = {};
            attrObj = {};
            continue;
          }
          if (
            ((definitelyTagNames.has(tag.name) ||
              singleLetterTags.has(tag.name)) &&
              (tag.onlyPlausible === false ||
                (tag.onlyPlausible === true && tag.attributes.length))) ||
            str[i + 1] === undefined
          ) {
            calculateHrefToBeInserted(opts);
            const whiteSpaceCompensation = calculateWhitespaceToInsert(
              str,
              i,
              tag.leftOuterWhitespace,
              i + 1,
              tag.lastOpeningBracketAt,
              tag.lastClosingBracketAt
            );
            opts.cb({
              tag,
              deleteFrom: tag.leftOuterWhitespace,
              deleteTo: i + 1,
              insert: `${whiteSpaceCompensation}${stringToInsertAfter}${whiteSpaceCompensation}`,
              rangesArr: rangesToDelete,
              proposedReturn: [
                tag.leftOuterWhitespace,
                i + 1,
                `${whiteSpaceCompensation}${stringToInsertAfter}${whiteSpaceCompensation}`,
              ],
            });
            resetHrefMarkers();
            treatRangedTags(i, opts, rangesToDelete);
          }
          /* istanbul ignore else */
          if (
            !filteredTagLocations.length ||
            (filteredTagLocations[filteredTagLocations.length - 1][0] !==
              tag.lastOpeningBracketAt &&
              filteredTagLocations[filteredTagLocations.length - 1][1] !==
                i + 1)
          ) {
            if (
              opts.stripTogetherWithTheirContents.includes(tag.name) ||
              opts.stripTogetherWithTheirContents.includes("*")
            ) {
              let lastRangedOpeningTag;
              for (let z = rangedOpeningTags.length; z--; ) {
                /* istanbul ignore else */
                if (rangedOpeningTags[z].name === tag.name) {
                  lastRangedOpeningTag = rangedOpeningTags[z];
                }
              }
              /* istanbul ignore else */
              if (lastRangedOpeningTag) {
                filteredTagLocations = filteredTagLocations.filter(
                  ([from]) => from !== lastRangedOpeningTag.lastOpeningBracketAt
                );
                filteredTagLocations.push([
                  lastRangedOpeningTag.lastOpeningBracketAt,
                  i + 1,
                ]);
              } else {
                /* istanbul ignore next */
                filteredTagLocations.push([tag.lastOpeningBracketAt, i + 1]);
              }
            } else {
              filteredTagLocations.push([tag.lastOpeningBracketAt, i + 1]);
            }
          }
        }
      } else if (
        (i > tag.lastClosingBracketAt && str[i].trim()) ||
        str[i + 1] === undefined
      ) {
        let endingRangeIndex = tag.lastClosingBracketAt === i ? i + 1 : i;
        if (
          opts.trimOnlySpaces &&
          endingRangeIndex === len - 1 &&
          spacesChunkWhichFollowsTheClosingBracketEndsAt !== null &&
          spacesChunkWhichFollowsTheClosingBracketEndsAt < i
        ) {
          endingRangeIndex = spacesChunkWhichFollowsTheClosingBracketEndsAt;
        }
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
        }
        if (
          (!onlyStripTagsMode && opts.ignoreTags.includes(tag.name)) ||
          (onlyStripTagsMode && !opts.onlyStripTags.includes(tag.name))
        ) {
          opts.cb({
            tag,
            deleteFrom: null,
            deleteTo: null,
            insert: null,
            rangesArr: rangesToDelete,
            proposedReturn: [],
          });
          tag = {};
          attrObj = {};
        } else if (
          !tag.onlyPlausible ||
          (tag.attributes.length === 0 &&
            tag.name &&
            (definitelyTagNames.has(tag.name.toLowerCase()) ||
              singleLetterTags.has(tag.name.toLowerCase()))) ||
          (tag.attributes &&
            tag.attributes.some((attrObj2) => attrObj2.equalsAt))
        ) {
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
          }
          const whiteSpaceCompensation = calculateWhitespaceToInsert(
            str,
            i,
            tag.leftOuterWhitespace,
            endingRangeIndex,
            tag.lastOpeningBracketAt,
            tag.lastClosingBracketAt
          );
          stringToInsertAfter = "";
          hrefInsertionActive = false;
          calculateHrefToBeInserted(opts);
          let insert;
          if (isStr(stringToInsertAfter) && stringToInsertAfter.length) {
            insert = `${whiteSpaceCompensation}${stringToInsertAfter}${
              /* istanbul ignore next */
              whiteSpaceCompensation === "\n\n" ? "\n" : whiteSpaceCompensation
            }`;
          } else {
            insert = whiteSpaceCompensation;
          }
          if (
            tag.leftOuterWhitespace === 0 ||
            !right(str, endingRangeIndex - 1)
          ) {
            insert = "";
          }
          opts.cb({
            tag,
            deleteFrom: tag.leftOuterWhitespace,
            deleteTo: endingRangeIndex,
            insert,
            rangesArr: rangesToDelete,
            proposedReturn: [tag.leftOuterWhitespace, endingRangeIndex, insert],
          });
          resetHrefMarkers();
          treatRangedTags(i, opts, rangesToDelete);
        } else {
          tag = {};
        }
        if (str[i] !== ">") {
          tag = {};
        }
      }
    }
    if (
      str[i] === "<" &&
      str[i - 1] !== "<" &&
      !`'"`.includes(str[i + 1]) &&
      (!`'"`.includes(str[i + 2]) || /\w/.test(str[i + 1]))
    ) {
      if (str[right(str, i)] === ">") {
        continue;
      } else {
        if (tag.nameEnds && tag.nameEnds < i && !tag.lastClosingBracketAt) {
          if (
            (tag.onlyPlausible === true &&
              tag.attributes &&
              tag.attributes.length) ||
            tag.onlyPlausible === false
          ) {
            const whiteSpaceCompensation = calculateWhitespaceToInsert(
              str,
              i,
              tag.leftOuterWhitespace,
              i,
              tag.lastOpeningBracketAt,
              i
            );
            opts.cb({
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
            });
            treatRangedTags(i, opts, rangesToDelete);
            tag = {};
            attrObj = {};
          }
        }
        if (
          tag.lastOpeningBracketAt !== undefined &&
          tag.onlyPlausible &&
          tag.name &&
          !tag.quotes
        ) {
          tag.lastOpeningBracketAt = undefined;
          tag.name = undefined;
          tag.onlyPlausible = false;
        }
        if (
          (tag.lastOpeningBracketAt === undefined || !tag.onlyPlausible) &&
          !tag.quotes
        ) {
          tag.lastOpeningBracketAt = i;
          tag.slashPresent = false;
          tag.attributes = [];
          if (chunkOfWhitespaceStartsAt === null) {
            tag.leftOuterWhitespace = i;
          } else if (opts.trimOnlySpaces && chunkOfWhitespaceStartsAt === 0) {
            /* istanbul ignore next */
            tag.leftOuterWhitespace = chunkOfSpacesStartsAt || i;
          } else {
            tag.leftOuterWhitespace = chunkOfWhitespaceStartsAt;
          }
          if (
            `${str[i + 1]}${str[i + 2]}${str[i + 3]}` === "!--" ||
            `${str[i + 1]}${str[i + 2]}${str[i + 3]}${str[i + 4]}${str[i + 5]}${
              str[i + 6]
            }${str[i + 7]}${str[i + 8]}` === "![CDATA["
          ) {
            let cdata = true;
            if (str[i + 2] === "-") {
              cdata = false;
            }
            let closingFoundAt;
            for (let y = i; y < len; y++) {
              if (
                (!closingFoundAt &&
                  cdata &&
                  `${str[y - 2]}${str[y - 1]}${str[y]}` === "]]>") ||
                (!cdata && `${str[y - 2]}${str[y - 1]}${str[y]}` === "-->")
              ) {
                closingFoundAt = y;
              }
              if (
                closingFoundAt &&
                ((closingFoundAt < y && str[y].trim()) ||
                  str[y + 1] === undefined)
              ) {
                let rangeEnd = y;
                if (
                  (str[y + 1] === undefined && !str[y].trim()) ||
                  str[y] === ">"
                ) {
                  rangeEnd += 1;
                }
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
                }
                const whiteSpaceCompensation = calculateWhitespaceToInsert(
                  str,
                  y,
                  tag.leftOuterWhitespace,
                  rangeEnd,
                  tag.lastOpeningBracketAt,
                  closingFoundAt
                );
                opts.cb({
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
                });
                i = y - 1;
                if (str[y] === ">") {
                  i = y;
                }
                tag = {};
                attrObj = {};
                break;
              }
            }
          }
        }
      }
    }
    if (str[i].trim() === "") {
      if (chunkOfWhitespaceStartsAt === null) {
        chunkOfWhitespaceStartsAt = i;
        if (
          tag.lastOpeningBracketAt !== undefined &&
          tag.lastOpeningBracketAt < i &&
          tag.nameStarts &&
          tag.nameStarts < tag.lastOpeningBracketAt &&
          i === tag.lastOpeningBracketAt + 1 &&
          !rangedOpeningTags.some(
            (rangedTagObj) => rangedTagObj.name === tag.name
          )
        ) {
          tag.onlyPlausible = true;
          tag.name = undefined;
          tag.nameStarts = undefined;
        }
      }
    } else if (chunkOfWhitespaceStartsAt !== null) {
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
          tag.attributes.push(attrObj);
        }
        attrObj = {};
        tag.equalsSpottedAt = undefined;
      }
      chunkOfWhitespaceStartsAt = null;
    }
    if (str[i] === " ") {
      if (chunkOfSpacesStartsAt === null) {
        chunkOfSpacesStartsAt = i;
      }
    } else if (chunkOfSpacesStartsAt !== null) {
      chunkOfSpacesStartsAt = null;
    }
  }
  if (
    str &&
    ((opts.trimOnlySpaces &&
      str[0] === " ") ||
      (!opts.trimOnlySpaces &&
        !str[0].trim()))
  ) {
    for (let i = 0, len = str.length; i < len; i++) {
      if (
        (opts.trimOnlySpaces && str[i] !== " ") ||
        (!opts.trimOnlySpaces && str[i].trim())
      ) {
        rangesToDelete.push([0, i]);
        break;
      } else if (!str[i + 1]) {
        rangesToDelete.push([0, i + 1]);
      }
    }
  }
  if (
    str &&
    ((opts.trimOnlySpaces &&
      str[str.length - 1] === " ") ||
      (!opts.trimOnlySpaces &&
        !str[str.length - 1].trim()))
  ) {
    for (let i = str.length; i--; ) {
      if (
        (opts.trimOnlySpaces && str[i] !== " ") ||
        (!opts.trimOnlySpaces && str[i].trim())
      ) {
        rangesToDelete.push([i + 1, str.length]);
        break;
      }
    }
  }
  if ((!originalOpts || !originalOpts.cb) && rangesToDelete.current()) {
    if (rangesToDelete.current()[0] && !rangesToDelete.current()[0][0]) {
      const startingIdx = rangesToDelete.current()[0][1];
      rangesToDelete.current();
      rangesToDelete.ranges[0] = [
        rangesToDelete.ranges[0][0],
        rangesToDelete.ranges[0][1],
      ];
    }
    if (
      rangesToDelete.current()[rangesToDelete.current().length - 1] &&
      rangesToDelete.current()[rangesToDelete.current().length - 1][1] ===
        str.length
    ) {
      const startingIdx = rangesToDelete.current()[
        rangesToDelete.current().length - 1
      ][0];
      rangesToDelete.current();
      let startingIdx2 =
        rangesToDelete.ranges[rangesToDelete.ranges.length - 1][0];
      if (
        str[startingIdx2 - 1] &&
        ((opts.trimOnlySpaces && str[startingIdx2 - 1] === " ") ||
          (!opts.trimOnlySpaces && !str[startingIdx2 - 1].trim()))
      ) {
        startingIdx2 -= 1;
      }
      const backupWhatToAdd =
        rangesToDelete.ranges[rangesToDelete.ranges.length - 1][2];
      rangesToDelete.ranges[rangesToDelete.ranges.length - 1] = [
        startingIdx2,
        rangesToDelete.ranges[rangesToDelete.ranges.length - 1][1],
      ];
      if (backupWhatToAdd && backupWhatToAdd.trim()) {
        rangesToDelete.ranges[rangesToDelete.ranges.length - 1].push(
          backupWhatToAdd.trimEnd()
        );
      }
    }
  }
  const res = {
    log: {
      timeTakenInMilliseconds: Date.now() - start,
    },
    result: rangesApply(str, rangesToDelete.current()),
    ranges: rangesToDelete.current(),
    allTagLocations,
    filteredTagLocations,
  };
  return res;
}

export default stripHtml;
