/**
 * string-strip-html
 * Strips HTML tags from strings. Detects legit unencoded brackets.
 * Version: 4.3.14
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-strip-html
 */

import rangesApply from 'ranges-apply';
import Ranges from 'ranges-push';
import isObj from 'lodash.isplainobject';
import trim from 'lodash.trim';
import without from 'lodash.without';
import ent from 'ent';
import { right } from 'string-left-right';

function stripHtml(str, originalOpts) {
  const isArr = Array.isArray;
  const definitelyTagNames = [
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
    "xml"
  ];
  const singleLetterTags = ["a", "b", "i", "p", "q", "s", "u"];
  const punctuation = [".", ",", "?", ";", ")", "\u2026", '"', "\u00BB"];
  const stripTogetherWithTheirContentsDefaults = ["script", "style", "xml"];
  let tag = { attributes: [] };
  let chunkOfWhitespaceStartsAt = null;
  let chunkOfSpacesStartsAt = null;
  const rangedOpeningTags = [];
  let attrObj = {};
  let hrefDump = {};
  let stringToInsertAfter = "";
  let hrefInsertionActive;
  let spacesChunkWhichFollowsTheClosingBracketEndsAt = null;
  function existy(x) {
    return x != null;
  }
  function isValidAttributeCharacter(char) {
    if (char.charCodeAt(0) >= 0 && char.charCodeAt(0) <= 31) {
      return false;
    } else if (char.charCodeAt(0) >= 127 && char.charCodeAt(0) <= 159) {
      return false;
    } else if (char.charCodeAt(0) === 32) {
      return false;
    } else if (char.charCodeAt(0) === 34) {
      return false;
    } else if (char.charCodeAt(0) === 39) {
      return false;
    } else if (char.charCodeAt(0) === 62) {
      return false;
    } else if (char.charCodeAt(0) === 47) {
      return false;
    } else if (char.charCodeAt(0) === 61) {
      return false;
    } else if (
      (char.charCodeAt(0) >= 64976 && char.charCodeAt(0) <= 65007) ||
      char.charCodeAt(0) === 65534 ||
      char.charCodeAt(0) === 65535 ||
      (char.charCodeAt(0) === 55359 && char.charCodeAt(1) === 57342) ||
      (char.charCodeAt(0) === 55359 && char.charCodeAt(1) === 57343) ||
      (char.charCodeAt(0) === 55423 && char.charCodeAt(1) === 57342) ||
      (char.charCodeAt(0) === 55423 && char.charCodeAt(1) === 57343) ||
      (char.charCodeAt(0) === 55487 && char.charCodeAt(1) === 57342) ||
      (char.charCodeAt(0) === 55487 && char.charCodeAt(1) === 57343) ||
      (char.charCodeAt(0) === 55551 && char.charCodeAt(1) === 57342) ||
      (char.charCodeAt(0) === 55551 && char.charCodeAt(1) === 57343) ||
      (char.charCodeAt(0) === 55615 && char.charCodeAt(1) === 57342) ||
      (char.charCodeAt(0) === 55615 && char.charCodeAt(1) === 57343) ||
      (char.charCodeAt(0) === 55679 && char.charCodeAt(1) === 57342) ||
      (char.charCodeAt(0) === 55679 && char.charCodeAt(1) === 57343) ||
      (char.charCodeAt(0) === 55743 && char.charCodeAt(1) === 57342) ||
      (char.charCodeAt(0) === 55743 && char.charCodeAt(1) === 57343) ||
      (char.charCodeAt(0) === 55807 && char.charCodeAt(1) === 57342) ||
      (char.charCodeAt(0) === 55807 && char.charCodeAt(1) === 57343) ||
      (char.charCodeAt(0) === 55871 && char.charCodeAt(1) === 57342) ||
      (char.charCodeAt(0) === 55871 && char.charCodeAt(1) === 57343) ||
      (char.charCodeAt(0) === 55935 && char.charCodeAt(1) === 57342) ||
      (char.charCodeAt(0) === 55935 && char.charCodeAt(1) === 57343) ||
      (char.charCodeAt(0) === 55999 && char.charCodeAt(1) === 57342) ||
      (char.charCodeAt(0) === 55999 && char.charCodeAt(1) === 57343) ||
      (char.charCodeAt(0) === 56063 && char.charCodeAt(1) === 57342) ||
      (char.charCodeAt(0) === 56063 && char.charCodeAt(1) === 57343) ||
      (char.charCodeAt(0) === 56127 && char.charCodeAt(1) === 57342) ||
      (char.charCodeAt(0) === 56127 && char.charCodeAt(1) === 57343) ||
      (char.charCodeAt(0) === 56191 && char.charCodeAt(1) === 57342) ||
      (char.charCodeAt(0) === 56191 && char.charCodeAt(1) === 57343) ||
      (char.charCodeAt(0) === 56255 && char.charCodeAt(1) === 57342) ||
      (char.charCodeAt(0) === 56255 && char.charCodeAt(1) === 57343) ||
      (char.charCodeAt(0) === 56319 && char.charCodeAt(1) === 57342) ||
      (char.charCodeAt(0) === 56319 && char.charCodeAt(1) === 57343)
    ) {
      return false;
    }
    return true;
  }
  function treatRangedTags(i) {
    if (opts.stripTogetherWithTheirContents.includes(tag.name)) {
      if (
        isArr(rangedOpeningTags) &&
        rangedOpeningTags.some(
          obj => obj.name === tag.name && obj.lastClosingBracketAt < i
        )
      ) {
        for (let y = rangedOpeningTags.length; y--; ) {
          if (rangedOpeningTags[y].name === tag.name) {
            if (punctuation.includes(str[i])) {
              opts.cb({
                tag,
                deleteFrom: rangedOpeningTags[y].lastOpeningBracketAt,
                deleteTo: i,
                insert: null,
                rangesArr: rangesToDelete,
                proposedReturn: [
                  rangedOpeningTags[y].lastOpeningBracketAt,
                  i,
                  null
                ]
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
                  ""
                ]
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
    str,
    currCharIdx,
    fromIdx,
    toIdx,
    lastOpeningBracketAt,
    lastClosingBracketAt
  ) {
    let strToEvaluateForLineBreaks = "";
    if (fromIdx < lastOpeningBracketAt) {
      strToEvaluateForLineBreaks += str.slice(fromIdx, lastOpeningBracketAt);
    }
    if (toIdx > lastClosingBracketAt + 1) {
      const temp = str.slice(lastClosingBracketAt + 1, toIdx);
      if (temp.includes("\n") && str[toIdx] === "<") {
        strToEvaluateForLineBreaks += " ";
      } else {
        strToEvaluateForLineBreaks += temp;
      }
    }
    if (
      !punctuation.includes(str[currCharIdx]) &&
      str[currCharIdx] !== "!"
    ) {
      const foundLineBreaks = strToEvaluateForLineBreaks.match(/\n/g);
      if (isArr(foundLineBreaks) && foundLineBreaks.length) {
        if (foundLineBreaks.length === 1) {
          return "\n";
        } else if (foundLineBreaks.length === 2) {
          return "\n\n";
        }
        return "\n\n\n";
      }
      return " ";
    }
    return "";
  }
  function calculateHrefToBeInserted() {
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
  function characterSuitableForNames(char) {
    return /[-_A-Za-z0-9]/.test(char);
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
  if (
    originalOpts !== undefined &&
    originalOpts !== null &&
    !isObj(originalOpts)
  ) {
    throw new TypeError(
      `string-strip-html/stripHtml(): [THROW_ID_02] Optional Options Object must be a plain object! Currently it's: ${(typeof originalOpts).toLowerCase()}, equal to:\n${JSON.stringify(
        originalOpts,
        null,
        4
      )}`
    );
  }
  function prepHopefullyAnArray(something, name) {
    if (!something) {
      return [];
    } else if (isArr(something)) {
      return something.filter(val => isStr(val) && val.trim().length > 0);
    } else if (isStr(something)) {
      if (something.length) {
        return [something];
      }
      return [];
    } else if (!isArr(something)) {
      throw new TypeError(
        `string-strip-html/stripHtml(): [THROW_ID_03] ${name} must be array containing zero or more strings or something falsey. Currently it's equal to: ${something}, that a type of ${typeof something}.`
      );
    }
  }
  function isStr(something) {
    return typeof something === "string";
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
    stripTogetherWithTheirContents: stripTogetherWithTheirContentsDefaults,
    skipHtmlDecoding: false,
    returnRangesOnly: false,
    trimOnlySpaces: false,
    dumpLinkHrefsNearby: {
      enabled: false,
      putOnNewLine: false,
      wrapHeads: "",
      wrapTails: ""
    },
    cb: null
  };
  const opts = Object.assign({}, defaults, originalOpts);
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
    opts.dumpLinkHrefsNearby = Object.assign({}, defaults.dumpLinkHrefsNearby);
  }
  if (typeof opts.ignoreTags === "string") {
    if (opts.ignoreTags.length === 0) {
      opts.ignoreTags = [];
    } else {
      opts.ignoreTags = [opts.ignoreTags];
    }
  }
  opts.dumpLinkHrefsNearby = defaults.dumpLinkHrefsNearby;
  if (
    isObj(originalOpts) &&
    Object.prototype.hasOwnProperty.call(originalOpts, "dumpLinkHrefsNearby") &&
    existy(originalOpts.dumpLinkHrefsNearby)
  ) {
    if (isObj(originalOpts.dumpLinkHrefsNearby)) {
      opts.dumpLinkHrefsNearby = Object.assign(
        {},
        defaults.dumpLinkHrefsNearby,
        originalOpts.dumpLinkHrefsNearby
      );
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
  if (
    !opts.dumpLinkHrefsNearby ||
    (isObj(opts.dumpLinkHrefsNearby) &&
      !Object.keys(opts.dumpLinkHrefsNearby).length)
  ) {
    opts.dumpLinkHrefsNearby = Object.assign({}, defaults.dumpLinkHrefsNearby);
  }
  if (!isArr(opts.stripTogetherWithTheirContents)) {
    opts.stripTogetherWithTheirContents = [];
  }
  const somethingCaught = {};
  if (
    opts.stripTogetherWithTheirContents &&
    isArr(opts.stripTogetherWithTheirContents) &&
    opts.stripTogetherWithTheirContents.length > 0 &&
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
      `string-strip-html/stripHtml(): [THROW_ID_06] Optional Options Object's key stripTogetherWithTheirContents was set to contain not just string elements! For example, element at index ${
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
    limitLinebreaksCount: 2
  });
  if (str === "" || str.trim() === "") {
    return str;
  }
  if (!opts.skipHtmlDecoding) {
    while (str !== ent.decode(str)) {
      str = ent.decode(str);
    }
  }
  if (!opts.trimOnlySpaces) {
    str = str.trim();
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
              definitelyTagNames.some(
                val =>
                  trim(
                    culprit
                      .trim()
                      .split(" ")
                      .filter(val => val.trim().length !== 0)
                      .filter((val, i) => i === 0),
                    "/>"
                  ).toLowerCase() === val
              ) &&
              stripHtml(`<${culprit.trim()}>`, opts) === ""
            ) {
              const whiteSpaceCompensation = calculateWhitespaceToInsert(
                str,
                i,
                startingPoint,
                i + 1,
                startingPoint,
                i + 1
              );
              let deleteUpTo = i + 1;
              if (
                str[deleteUpTo] !== undefined &&
                str[deleteUpTo].trim().length === 0
              ) {
                for (let z = deleteUpTo; z < len; z++) {
                  if (str[z].trim().length !== 0) {
                    deleteUpTo = z;
                    break;
                  }
                  if (str[z + 1] === undefined) {
                    deleteUpTo = z + 1;
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
                  whiteSpaceCompensation
                ]
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
      tag.lastOpeningBracketAt !== undefined &&
      tag.lastClosingBracketAt === undefined
    ) {
      tag.slashPresent = i;
    }
    if (
      tag.nameStarts &&
      tag.nameStarts < i &&
      !tag.quotes &&
      punctuation.includes(str[i]) &&
      !attrObj.equalsAt &&
      tag.attributes &&
      tag.attributes.length === 0 &&
      !tag.lastClosingBracketAt
    ) {
      tag = {};
      tag.attributes = [];
      attrObj = {};
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
          tag.attributes.some(obj => {
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
            hrefValue: hrefVal
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
      (str[i].trim().length === 0 || !characterSuitableForNames(str[i]))
    ) {
      tag.nameEnds = i;
      tag.name = str.slice(
        tag.nameStarts,
        tag.nameEnds +
          (str[i] !== ">" && str[i] !== "/" && str[i + 1] === undefined ? 1 : 0)
      );
      if (
        str[tag.nameStarts - 1] !== "!" &&
        tag.name.replace(/-/g, "").length === 0
      ) {
        tag = {};
        continue;
      }
      if (str[i] === "<") {
        calculateHrefToBeInserted();
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
          insert: `${whiteSpaceCompensation}${stringToInsertAfter}${whiteSpaceCompensation}`,
          rangesArr: rangesToDelete,
          proposedReturn: [
            tag.leftOuterWhitespace,
            i,
            `${whiteSpaceCompensation}${stringToInsertAfter}${whiteSpaceCompensation}`
          ]
        });
        resetHrefMarkers();
        treatRangedTags(i);
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
      if (attrObj.valueEnds) ; else {
        attrObj.valueStarts = i;
      }
    }
    if (
      !tag.quotes &&
      attrObj.nameEnds &&
      str[i] === "=" &&
      !attrObj.valueStarts
    ) {
      if (!attrObj.equalsAt) {
        attrObj.equalsAt = i;
      }
    }
    if (
      !tag.quotes &&
      attrObj.nameStarts &&
      attrObj.nameEnds &&
      !attrObj.valueStarts &&
      str[i].trim().length !== 0 &&
      str[i] !== "="
    ) {
      tag.attributes.push(attrObj);
      attrObj = {};
    }
    if (!tag.quotes && attrObj.nameStarts && !attrObj.nameEnds) {
      if (str[i].trim().length === 0) {
        attrObj.nameEnds = i;
        attrObj.name = str.slice(attrObj.nameStarts, attrObj.nameEnds);
      } else if (str[i] === "=") {
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
      } else if (str[i] === "<" || !isValidAttributeCharacter(str[i])) {
        attrObj.nameEnds = i;
        attrObj.name = str.slice(attrObj.nameStarts, attrObj.nameEnds);
        tag.attributes.push(attrObj);
        attrObj = {};
      }
    }
    if (
      !tag.quotes &&
      tag.nameEnds < i &&
      str[i] !== ">" &&
      str[i] !== "/" &&
      str[i] !== "!" &&
      str[i - 1].trim().length === 0 &&
      str[i].trim().length !== 0 &&
      !attrObj.nameStarts &&
      !tag.lastClosingBracketAt
    ) {
      if (
        isValidAttributeCharacter(`${str[i]}${str[i + 1]}`) &&
        str[i] !== "<"
      ) {
        attrObj.nameStarts = i;
      } else if (tag.onlyPlausible && str[i] !== "<") {
        tag = {};
      }
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
        if (
          (str[i].trim().length === 0 || str[i] === "<") &&
          !tag.slashPresent
        ) {
          tag.onlyPlausible = true;
        } else {
          tag.onlyPlausible = false;
        }
      }
      if (
        str[i].trim().length !== 0 &&
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
          if (
            opts.ignoreTags.includes(tag.name) ||
            (tag.onlyPlausible && !definitelyTagNames.includes(tag.name))
          ) {
            tag = {};
            attrObj = {};
            continue;
          }
          if (
            (definitelyTagNames.concat(singleLetterTags).includes(tag.name) &&
              (tag.onlyPlausible === false ||
                (tag.onlyPlausible === true && tag.attributes.length))) ||
            str[i + 1] === undefined
          ) {
            calculateHrefToBeInserted();
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
                `${whiteSpaceCompensation}${stringToInsertAfter}${whiteSpaceCompensation}`
              ]
            });
            resetHrefMarkers();
            treatRangedTags(i);
          }
        }
      } else if (
        (i > tag.lastClosingBracketAt && str[i].trim().length !== 0) ||
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
            proposedReturn: []
          });
          tag = {};
          attrObj = {};
        } else if (
          !tag.onlyPlausible ||
          (tag.attributes.length === 0 &&
            tag.name &&
            definitelyTagNames
              .concat(singleLetterTags)
              .includes(tag.name.toLowerCase())) ||
          (tag.attributes && tag.attributes.some(attrObj => attrObj.equalsAt))
        ) {
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
          calculateHrefToBeInserted();
          let insert;
          if (isStr(stringToInsertAfter) && stringToInsertAfter.length) {
            insert = `${whiteSpaceCompensation}${stringToInsertAfter}${
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
          if (
            insert &&
            insert.length > 1 &&
            !insert.trim().length &&
            !insert.includes("\n") &&
            !insert.includes("\r")
          ) {
            insert = " ";
          }
          opts.cb({
            tag,
            deleteFrom: tag.leftOuterWhitespace,
            deleteTo: endingRangeIndex,
            insert,
            rangesArr: rangesToDelete,
            proposedReturn: [tag.leftOuterWhitespace, endingRangeIndex, insert]
          });
          resetHrefMarkers();
          treatRangedTags(i);
        } else {
          tag = {};
        }
        if (str[i] !== ">") {
          tag = {};
        }
      }
    }
    if (str[i] === "<" && str[i - 1] !== "<") {
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
                whiteSpaceCompensation
              ]
            });
            treatRangedTags(i);
            tag = {};
            attrObj = {};
          } else if (
            tag.onlyPlausible &&
            !definitelyTagNames.concat(singleLetterTags).includes(tag.name) &&
            !(tag.attributes && tag.attributes.length)
          ) {
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
            let closingFoundAt = undefined;
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
                ((closingFoundAt < y && str[y].trim().length !== 0) ||
                  str[y + 1] === undefined)
              ) {
                let rangeEnd = y;
                if (
                  (str[y + 1] === undefined && str[y].trim().length === 0) ||
                  str[y] === ">"
                ) {
                  rangeEnd += 1;
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
                    whiteSpaceCompensation
                  ]
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
            rangedTagObj => rangedTagObj.name === tag.name
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
  if (rangesToDelete.current()) {
    if (opts.returnRangesOnly) {
      return rangesToDelete.current();
    }
    const untrimmedRes = rangesApply(str, rangesToDelete.current());
    if (opts.trimOnlySpaces) {
      return trim(untrimmedRes, " ");
    }
    return untrimmedRes.trim();
  } else if (opts.returnRangesOnly) {
    return [];
  }
  if (opts.trimOnlySpaces) {
    return trim(str, " ");
  }
  return str.trim();
}

export default stripHtml;
