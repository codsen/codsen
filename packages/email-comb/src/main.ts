import { pull } from "array-pull-all-with-glob";
import {
  compareFn,
  detectEol,
  type EolChar,
  formatDiagnosticValue,
  hasOwnProp,
  intersection,
  isPlainObject as isObj,
  match,
  pullAll,
  uniq,
} from "codsen-utils";
import type { Opts as HtmlCrushOpts } from "html-crush";
import { crush } from "html-crush";
import { decode as decodeHtmlEntities } from "html-entity-codec";
import { rApply } from "ranges-apply";
import { Ranges } from "ranges-push";
import { emptyCondCommentRegex } from "regex-empty-conditional-comments";
import {
  type CssSelectorToken,
  type CssToken,
  decodeCssSelector,
  extractCssSelectorTokens,
  readCssSelectorToken,
  readCssToken,
} from "string-extract-class-names";
import { left, right } from "string-left-right";
import { matchLeft, matchRight, matchRightIncl } from "string-match-left-right";
import { expander } from "string-range-expander";
import { uglifyArr } from "string-uglify";
import type { Range } from "../../../ops/typedefs/common";

import { version as v } from "../package.json";
import {
  asciiLowerCase,
  type CssRegion,
  createCssRegion,
  findStyleEnd,
  removeEmptyWrappers,
} from "./css";
import { collectNestedStyleRules, type NestedStyleRule } from "./css-nesting";

import {
  type HtmlAttributeToken,
  readHtmlAttributeTokens,
} from "./html-attribute-tokens";

import {
  type Quote,
  serializeCssIdentifier,
  serializeCssString,
  serializeHtmlAttribute,
} from "./serialize";

const version: string = v;
const labelOrOutputOpeningTagRegex = /<(?:label|output)(?:[\t\n\f\r />])/i;

declare let DEV: boolean;

function isWhitespace(char: string | undefined): boolean {
  if (!char) {
    return false;
  }

  const charCode = char.charCodeAt(0);

  return (
    charCode === 32 ||
    (charCode >= 9 && charCode <= 13) ||
    (charCode > 127 && char.trim() === "")
  );
}

function isHtmlAsciiWhitespace(char: string | undefined): boolean {
  if (!char) {
    return false;
  }

  const charCode = char.charCodeAt(0);

  return (
    charCode === 32 ||
    charCode === 9 ||
    charCode === 10 ||
    charCode === 12 ||
    charCode === 13
  );
}

function extractCanonicalSelectors(
  str: string,
  protectedSelectors?: Set<string>,
): string[] {
  let result: string[] = [];
  let hasFunction = false;
  for (let i = 0; i < str.length; ) {
    if (str[i] === "[") {
      let closingAt = cssAttributeEndsAt(str, i);
      if (closingAt !== null) {
        for (const token of attributeSelectorQueue(str, i))
          result.push(token.value);
        i = closingAt + 1;
        continue;
      }
    }
    if (str[i] === "." || str[i] === "#") {
      let token = readCssSelectorToken(str, i);
      if (token) {
        result.push(token.value);
        i = token.range[1];
        continue;
      }
    }
    const token = readCssToken(str, i) as CssToken;
    if (token.kind === "function") hasFunction = true;
    i = token.range[1];
  }
  // A flat inventory cannot prove :not(), :is(), :has() or another functional
  // selector unused. Keep every participating identity until tree-aware
  // matching can prove which alternatives or exclusions apply.
  if (hasFunction && protectedSelectors) {
    for (const selector of result) protectedSelectors.add(selector);
  }
  return result;
}

interface AttributeSelectorQueueItem {
  endsAt: number;
  marker: "." | "#";
  startsAt: number;
  value: string;
  quote: Quote;
}

function readSelectorInRegion(
  str: string,
  index: number,
  region?: CssRegion,
): CssSelectorToken | null {
  if (!region) return readCssSelectorToken(str, index);
  let token = readCssSelectorToken(region.source, index - region.start);
  if (token)
    token.range = [
      token.range[0] + region.start,
      token.range[1] + region.start,
    ];
  return token;
}

function cssAttributeEndsAt(str: string, start: number): number | null {
  for (let i = start + 1; i < str.length; ) {
    let token = readCssToken(str, i) as CssToken;
    if (token.kind === "delimiter" && token.value === "]") {
      return i;
    }
    i = token.range[1];
  }
  return null;
}

function attributeSelectorQueue(
  str: string,
  openingAt: number,
  region?: CssRegion,
): AttributeSelectorQueueItem[] {
  if (region)
    return attributeSelectorQueue(region.source, openingAt - region.start).map(
      (token) => ({
        ...token,
        startsAt: token.startsAt + region.start,
        endsAt: token.endsAt + region.start,
      }),
    );
  let closingAt = cssAttributeEndsAt(str, openingAt);
  if (closingAt === null) {
    return [];
  }
  let nameAt = openingAt + 1;
  while (isHtmlAsciiWhitespace(str[nameAt])) {
    nameAt++;
  }
  let name = readCssToken(str, nameAt);
  if (
    name?.kind !== "identifier" ||
    !["class", "id"].includes(asciiLowerCase(name.value))
  ) {
    return [];
  }
  let valueAt = str.indexOf("=", name.range[1]) + 1;
  while (isHtmlAsciiWhitespace(str[valueAt])) valueAt++;
  let quote: Quote =
    str[valueAt] === '"' || str[valueAt] === "'"
      ? (str[valueAt] as Quote)
      : null;
  return extractCssSelectorTokens(str.slice(openingAt, closingAt + 1)).map(
    (token) => ({
      startsAt: openingAt + token.range[0],
      endsAt: openingAt + token.range[1],
      marker: token.value[0] as "." | "#",
      value: token.value,
      quote,
    }),
  );
}

function htmlTagEndsAt(str: string, start: number): number {
  let quote: string | null = null;
  for (let i = start; i < str.length; i++) {
    if (quote) {
      if (str[i] === quote) quote = null;
    } else if (str[i] === '"' || str[i] === "'") {
      quote = str[i];
    } else if (str[i] === ">") {
      return i;
    }
  }
  return -1;
}

interface StyleTagRegion {
  start: number;
  end: number;
  closingEnd: number;
}

function collectStyleTags(
  str: string,
  rawTextRanges?: Map<number, number>,
): Map<number, StyleTagRegion> {
  let tags = new Map<number, StyleTagRegion>();
  for (
    let cursor = str.indexOf("<");
    cursor !== -1;
    cursor = str.indexOf("<", cursor + 1)
  ) {
    if (str.startsWith("<!--", cursor)) {
      // Conditional comments can contain the email's actual style elements.
      let conditional =
        asciiLowerCase(str.slice(cursor, cursor + 7)) === "<!--[if";
      let close = str.indexOf(conditional ? ">" : "-->", cursor + 4);
      if (close === -1) break;
      cursor = close + (conditional ? 0 : 2);
      continue;
    }
    let tag = /^<([a-z][a-z0-9:-]*)(?=[\t\n\f\r />])/i.exec(str.slice(cursor));
    if (!tag) continue;
    let start = htmlTagEndsAt(str, cursor + tag[0].length) + 1;
    if (!start) break;
    let name = asciiLowerCase(tag[1]);
    if (name !== "style") {
      cursor = start - 1;
      if (name === "plaintext") {
        rawTextRanges?.set(start, str.length);
        break;
      }
      if (
        [
          "script",
          "textarea",
          "title",
          "xmp",
          "iframe",
          "noembed",
          "noframes",
        ].includes(name)
      ) {
        let closing = new RegExp(`</${name}(?=[\\t\\n\\f\\r />])`, "gi");
        closing.lastIndex = start;
        let close = closing.exec(str);
        rawTextRanges?.set(start, close ? close.index : str.length);
        if (!close) break;
        cursor = htmlTagEndsAt(str, close.index);
        if (cursor === -1) break;
      }
      continue;
    }
    let end = findStyleEnd(str, start);
    let closingEnd = end < str.length ? htmlTagEndsAt(str, end) : -1;
    tags.set(cursor, { start, end, closingEnd });
    cursor = closingEnd === -1 ? str.length : closingEnd;
  }
  return tags;
}

function removeEmptyCssWrappers(
  str: string,
  emptyStyleReplacement: string,
): string {
  let ranges: Range[] = [];
  for (let [openingAt, { start, end, closingEnd }] of collectStyleTags(str)) {
    let css = removeEmptyWrappers(str.slice(start, end));
    if (!css.trim() && closingEnd !== -1) {
      let from = openingAt;
      while (from && isWhitespace(str[from - 1])) from--;
      ranges.push([from, closingEnd + 1, emptyStyleReplacement]);
    } else if (css !== str.slice(start, end)) {
      ranges.push([start, end, css]);
    }
  }
  return rApply(str, ranges);
}

function isTemplateBraceAt(str: string, index: number): boolean {
  return (
    (str[index] === "{" || str[index] === "}") &&
    (str[index - 1] === str[index] ||
      str[index + 1] === str[index] ||
      str[index - 1] === "%" ||
      str[index + 1] === "%")
  );
}

function characterSuitableForBodyToken(
  char: string,
  quoteless: boolean,
  quote: '"' | "'" | null = null,
  templateBrace = false,
): boolean {
  if (!char || isHtmlAsciiWhitespace(char)) {
    return false;
  }

  return quoteless
    ? char !== '"' &&
        char !== "'" &&
        char !== "`" &&
        char !== "=" &&
        char !== "<" &&
        char !== ">"
    : char !== quote && !templateBrace;
}

function cleanBlankLines(str: string, backend: HeadsAndTailsObj[]): string {
  const blankLineRegex = /\r?\n\s+\r?\n/g;
  let blankLineMatch = blankLineRegex.exec(str);
  if (!blankLineMatch) {
    return str;
  }

  const protectedPairs = backend.filter(
    ({ heads, tails }) => heads.length && tails.length,
  );
  let backendTails: string | null = null;
  let comment = false;
  let lastOutputAt = 0;
  const output: string[] = [];
  let quote: '"' | "'" | null = null;
  let protectedAttributeQuote = false;
  let protectedStyle = false;
  let rawTag: "script" | "style" | null = null;
  let tagStartedAt: number | null = null;

  for (let i = 0; i < str.length; i++) {
    if (blankLineMatch?.index === i) {
      const replacement =
        protectedAttributeQuote || (rawTag === "style" && protectedStyle)
          ? blankLineMatch[0]
          : tagStartedAt !== null && !comment && backendTails === null
            ? ""
            : rawTag === "style"
              ? " "
              : rawTag || comment
                ? blankLineMatch[0]
                : blankLineMatch[0].includes("\r\n")
                  ? "\r\n"
                  : "\n";
      output.push(str.slice(lastOutputAt, i), replacement);
      lastOutputAt = i + blankLineMatch[0].length;
      i += blankLineMatch[0].length - 1;
      blankLineMatch = blankLineRegex.exec(str);
      continue;
    }

    if (backendTails !== null) {
      if (str.startsWith(backendTails, i)) {
        i += backendTails.length - 1;
        backendTails = null;
      }
      continue;
    }

    const backendPair = protectedPairs.length
      ? protectedPairs.find(({ heads }) => str.startsWith(heads, i))
      : undefined;
    if (backendPair) {
      i += backendPair.heads.length - 1;
      backendTails = backendPair.tails;
      continue;
    }

    if (comment) {
      if (str.startsWith("-->", i)) {
        i += 2;
        comment = false;
      }
      continue;
    }

    if (rawTag) {
      const closingTag = `</${rawTag}`;
      if (
        str[i] === "<" &&
        str.slice(i, i + closingTag.length).toLowerCase() === closingTag &&
        (isHtmlAsciiWhitespace(str[i + closingTag.length]) ||
          str[i + closingTag.length] === ">")
      ) {
        rawTag = null;
        tagStartedAt = i;
      }
      continue;
    }

    if (tagStartedAt !== null) {
      if (quote) {
        if (str[i] === quote) {
          quote = null;
          protectedAttributeQuote = false;
        }
      } else if (str[i] === '"' || str[i] === "'") {
        protectedAttributeQuote = /(?:^|\s)(?:style|class|id)\s*=\s*$/i.test(
          str.slice(tagStartedAt, i),
        );
        quote = str[i] as '"' | "'";
      } else if (str[i] === ">") {
        const openingTagName = str
          .slice(tagStartedAt, i + 1)
          .match(/^<\s*([a-z][a-z\d:-]*)/i)?.[1]
          ?.toLowerCase();
        if (openingTagName === "script" || openingTagName === "style") {
          rawTag = openingTagName;
          if (rawTag === "style") {
            const css = str.slice(i + 1, findStyleEnd(str, i + 1));
            protectedStyle = css.includes("\\") || css.includes("/*");
          }
        }
        tagStartedAt = null;
      }
      continue;
    }

    if (str.startsWith("<!--", i)) {
      i += 3;
      comment = true;
    } else if (
      str[i] === "<" &&
      (str[i + 1] === "!" ||
        str[i + 1] === "?" ||
        str[i + 1] === "/" ||
        /[a-z]/i.test(str[i + 1] || ""))
    ) {
      tagStartedAt = i;
    }
  }

  output.push(str.slice(lastOutputAt));
  return output.join("");
}

function collectNextClosingBrackets(str: string): Int32Array {
  const closingBrackets = new Int32Array(str.length);
  let closingBracketAt = -1;

  for (let i = str.length - 1; i >= 0; i--) {
    if (str[i] === ">") {
      closingBracketAt = i;
    }
    closingBrackets[i] = closingBracketAt;
  }

  return closingBrackets;
}

interface NumValObj {
  [key: string]: number;
}

export interface HeadsAndTailsObj {
  heads: string;
  tails: string;
}

type BodyAttributeName = "class" | "id" | "style";

interface BodyAttribute {
  tokens?: HtmlAttributeToken[];
  empty: boolean;
  equalsAt: number;
  hasPrecedingUnquotedAttribute: boolean;
  name: BodyAttributeName;
  nameEndsAt: number;
  nameStartsAt: number;
  quote: '"' | "'" | null;
  quoteless: boolean;
  valueEndsAt: number;
  valueStartsAt: number;
}

function collectBodyAttributes(
  str: string,
  backend: HeadsAndTailsObj[],
  rawTextRanges?: Map<number, number>,
): Map<number, BodyAttribute> {
  if (!rawTextRanges) {
    rawTextRanges = new Map<number, number>();
    collectStyleTags(str, rawTextRanges);
  }
  const attributes = new Map<number, BodyAttribute>();
  const lowerStr = asciiLowerCase(str);
  const protectedPairs = backend.filter(
    ({ heads, tails }) => heads.length && tails.length,
  );
  let rawTag: "script" | "style" | null = null;
  const rawTextStarts = rawTextRanges.keys();
  let nextRawTextAt = rawTextStarts.next().value ?? str.length;

  const skipBackend = (index: number): number | null => {
    const pair = protectedPairs.find(({ heads }) =>
      str.startsWith(heads, index),
    );
    if (!pair) {
      return null;
    }
    const tailsAt = str.indexOf(pair.tails, index + pair.heads.length);
    return tailsAt === -1 ? str.length : tailsAt + pair.tails.length;
  };

  for (let i = 0; i < str.length; i++) {
    if (i >= nextRawTextAt) {
      // The HTML pre-pass records regions in source order. Avoid a map lookup
      // for every character, including after the final raw-text region.
      while (i > nextRawTextAt) {
        nextRawTextAt = rawTextStarts.next().value ?? str.length;
      }
      if (i === nextRawTextAt) {
        const rawTextEnd = rawTextRanges.get(i) as number;
        nextRawTextAt = rawTextStarts.next().value ?? str.length;
        if (rawTextEnd > i) {
          i = rawTextEnd - 1;
          continue;
        }
      }
    }
    if (rawTag) {
      const closingAt = lowerStr.indexOf(`</${rawTag}`, i);
      if (closingAt === -1) {
        break;
      }
      rawTag = null;
      i = closingAt - 1;
      continue;
    }

    if (str.startsWith("<!--", i)) {
      const closingAt = str.indexOf("-->", i + 4);
      if (closingAt === -1) {
        break;
      }
      i = closingAt + 2;
      continue;
    }

    if (str[i] !== "<") {
      continue;
    }

    let cursor = i + 1;
    while (isHtmlAsciiWhitespace(str[cursor])) {
      cursor += 1;
    }
    if (
      str[cursor] === "/" ||
      str[cursor] === "!" ||
      str[cursor] === "?" ||
      !/[a-z]/i.test(str[cursor] || "")
    ) {
      continue;
    }

    const tagNameStartsAt = cursor;
    while (
      str[cursor] &&
      !isHtmlAsciiWhitespace(str[cursor]) &&
      !"/>".includes(str[cursor])
    ) {
      cursor += 1;
    }
    const tagName = lowerStr.slice(tagNameStartsAt, cursor);
    let hasPrecedingUnquotedAttribute = false;

    while (cursor < str.length) {
      while (isHtmlAsciiWhitespace(str[cursor])) {
        cursor += 1;
      }
      if (str[cursor] === ">") {
        i = cursor;
        break;
      }
      if (str[cursor] === "/" && str[cursor + 1] === ">") {
        i = cursor + 1;
        break;
      }

      const nameStartsAt = cursor;
      while (
        str[cursor] &&
        !isHtmlAsciiWhitespace(str[cursor]) &&
        !"=/>".includes(str[cursor])
      ) {
        cursor += 1;
      }
      const nameEndsAt = cursor;
      if (nameStartsAt === nameEndsAt) {
        cursor += 1;
        continue;
      }

      const name = lowerStr.slice(nameStartsAt, nameEndsAt);
      while (isHtmlAsciiWhitespace(str[cursor])) {
        cursor += 1;
      }
      if (str[cursor] !== "=") {
        continue;
      }

      const equalsAt = cursor;
      cursor += 1;
      const whitespaceAfterEqualsStartsAt = cursor;
      while (isHtmlAsciiWhitespace(str[cursor])) {
        cursor += 1;
      }

      let prospectiveNameEndsAt = cursor;
      while (
        str[prospectiveNameEndsAt] &&
        !isHtmlAsciiWhitespace(str[prospectiveNameEndsAt]) &&
        !"=/>".includes(str[prospectiveNameEndsAt])
      ) {
        prospectiveNameEndsAt += 1;
      }
      let afterProspectiveName = prospectiveNameEndsAt;
      while (isHtmlAsciiWhitespace(str[afterProspectiveName])) {
        afterProspectiveName += 1;
      }
      const empty =
        str[cursor] === ">" ||
        (str[cursor] === "/" && str[cursor + 1] === ">") ||
        (cursor > whitespaceAfterEqualsStartsAt &&
          str[afterProspectiveName] === "=");

      let quote: '"' | "'" | null = null;
      let quoteless = true;
      if (!empty && (str[cursor] === '"' || str[cursor] === "'")) {
        quote = str[cursor] as '"' | "'";
        quoteless = false;
        cursor += 1;
      }
      const valueStartsAt = cursor;

      while (!empty && cursor < str.length) {
        const afterBackend = skipBackend(cursor);
        if (afterBackend !== null) {
          cursor = afterBackend;
          continue;
        }
        if (
          (quote && str[cursor] === quote) ||
          (!quote &&
            (isHtmlAsciiWhitespace(str[cursor]) ||
              `"'<=\``.includes(str[cursor]) ||
              str[cursor] === ">"))
        ) {
          break;
        }
        cursor += 1;
      }

      // A slash touching an unquoted value belongs to that value. Only a
      // slash after whitespace can mark the end of a self-closing start tag.
      const valueEndsAt = cursor;
      if (name === "class" || name === "id" || name === "style") {
        const rawValue =
          name === "style" ? "" : str.slice(valueStartsAt, valueEndsAt);
        const dynamic =
          /\{\{|\{%/.test(rawValue) ||
          protectedPairs.some(({ heads }) => rawValue.includes(heads));
        attributes.set(nameStartsAt, {
          tokens:
            name !== "style" && !empty && !dynamic
              ? readHtmlAttributeTokens(str, valueStartsAt, valueEndsAt, name)
              : undefined,
          empty,
          equalsAt,
          hasPrecedingUnquotedAttribute,
          name,
          nameEndsAt,
          nameStartsAt,
          quote,
          quoteless,
          valueEndsAt,
          valueStartsAt,
        });
      }

      if (quote && str[cursor] === quote) {
        cursor += 1;
      }
      hasPrecedingUnquotedAttribute ||= !quote && !empty;
    }

    if (tagName === "script" || tagName === "style") {
      rawTag = tagName;
    }
  }

  return attributes;
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

export interface InputOpts {
  whitelist?: string | string[];
  backend?: HeadsAndTailsObj[];
  uglify?: boolean | 0 | 1;
  removeHTMLComments?: boolean;
  removeCSSComments?: boolean;
  doNotRemoveHTMLCommentsWhoseOpeningTagContains?: string | string[];
  htmlCrushOpts?: Partial<HtmlCrushOpts>;
  reportProgressFunc?: null | false | 0 | ((percDone: number) => void);
  reportProgressFuncFrom?: number;
  reportProgressFuncTo?: number;
}

export type UglifyOpts = Omit<InputOpts, "uglify">;

type StringifiedLegend = [string, string];

export interface Res {
  /** Best-effort completion statistics for user-facing feedback.
   * Observational fields do not affect the transformation. */
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
function comb(str: string, opts?: InputOpts | null): Res {
  const start = Date.now();
  let finalIndexesToDelete = new Ranges<string | null | undefined>({
    limitToBeAddedWhitespace: true,
  });
  let currentChunksMinifiedSelectors = new Ranges<string | null | undefined>();
  let lineBreaksToDelete = new Ranges<string | null | undefined>();

  // PS. badChars is also used
  function characterSuitableForNames(char: string): boolean {
    const charCode = char.charCodeAt(0);

    return (
      char === "-" ||
      char === "_" ||
      (charCode >= 48 && charCode <= 57) ||
      (charCode >= 65 && charCode <= 90) ||
      (charCode >= 97 && charCode <= 122)
    ); // notice, there's no dot or hash!
  }

  interface BodyClassOrId {
    valuesStart: number | null;
    valueStart: number | null;
    nameStart: number | null;
    quoteless: boolean;
    quote: '"' | "'" | null;
  }
  function resetBodyClassOrId(initObj = {}): BodyClassOrId {
    return {
      valuesStart: null,
      valueStart: null,
      nameStart: null,
      quoteless: false,
      quote: null,
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
  let singleSelectorEndsAt: number | null;
  let singleSelectorQueue: AttributeSelectorQueueItem[] = [];

  // Used in marking is it class or id (because there's no dot/hash in front
  // when square bracket notation is used), for example:
  //
  // a[class="used"]{x:1;}
  //
  // in which case, singleSelectorType would be === "."
  let singleSelectorType: "." | "#" | undefined;
  let singleSelectorValue: string | undefined;
  let singleSelectorQuote: Quote = null;

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
  let round1RangeIndex = 0;

  // counters:
  let nonIndentationsWhitespaceLength = 0;
  let commentsLength = 0;

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

  // insurance
  if (typeof str !== "string") {
    throw new TypeError(
      `email-comb/comb(): [THROW_ID_01] Input must be string! Currently it's ${typeof str}`,
    );
  }
  let originalLength = str.length;

  if (opts && !isObj(opts)) {
    throw new TypeError(
      `email-comb/comb(): [THROW_ID_02] Options, second input argument, must be a plain object! Currently it's ${typeof opts}, equal to: ${formatDiagnosticValue(opts, 4)}`,
    );
  }
  let resolvedOpts = {
    ...defaults,
    ...opts,
    htmlCrushOpts: {
      ...defaults.htmlCrushOpts,
      ...(isObj(opts?.htmlCrushOpts) ? opts.htmlCrushOpts : {}),
    },
  } as Opts;
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
      `email-comb/comb(): [THROW_ID_03] resolvedOpts.whitelist should be an array, but it was customised to a wrong thing, ${formatDiagnosticValue(resolvedOpts.whitelist, 4)}`,
    );
  }
  if (
    resolvedOpts.whitelist.length &&
    !resolvedOpts.whitelist.every((el) => typeof el === "string")
  ) {
    throw new TypeError(
      `email-comb/comb(): [THROW_ID_04] resolvedOpts.whitelist array should contain only string-type elements. Currently we've got:\n${formatDiagnosticValue(resolvedOpts.whitelist, 4)}`,
    );
  }
  if (!Array.isArray(resolvedOpts.backend)) {
    throw new TypeError(
      `email-comb/comb(): [THROW_ID_05] resolvedOpts.backend should be an array, but it was customised to a wrong thing, ${formatDiagnosticValue(resolvedOpts.backend, 4)}`,
    );
  }
  if (
    resolvedOpts.backend.length &&
    resolvedOpts.backend.some((val) => !isObj(val))
  ) {
    throw new TypeError(
      `email-comb/comb(): [THROW_ID_06] resolvedOpts.backend array should contain only plain objects but it contains something else:\n${formatDiagnosticValue(resolvedOpts.backend, 4)}`,
    );
  }
  if (
    resolvedOpts.backend.length &&
    !resolvedOpts.backend.every(
      (obj) =>
        hasOwnProp(obj, "heads") &&
        typeof obj.heads === "string" &&
        hasOwnProp(obj, "tails") &&
        typeof obj.tails === "string",
    )
  ) {
    throw new TypeError(
      `email-comb/comb(): [THROW_ID_07] every object within resolvedOpts.backend should contain string values under keys "heads" and "tails". Whole "resolvedOpts.backend" value array is currently equal to:\n${formatDiagnosticValue(resolvedOpts.backend, 4)}`,
    );
  }
  if (typeof resolvedOpts.uglify !== "boolean") {
    if (resolvedOpts.uglify === 1 || resolvedOpts.uglify === 0) {
      resolvedOpts.uglify = !!resolvedOpts.uglify; // turn it into a Boolean
    } else {
      throw new TypeError(
        `email-comb/comb(): [THROW_ID_08] resolvedOpts.uglify should be a Boolean. Currently it's set to: ${formatDiagnosticValue(resolvedOpts.uglify, 4)}`,
      );
    }
  }
  if (
    resolvedOpts.reportProgressFunc &&
    typeof resolvedOpts.reportProgressFunc !== "function"
  ) {
    throw new TypeError(
      `email-comb/comb(): [THROW_ID_09] resolvedOpts.reportProgressFunc should be a function but it was given as :\n${formatDiagnosticValue(resolvedOpts.reportProgressFunc, 4)} (${typeof resolvedOpts.reportProgressFunc})`,
    );
  }

  if (
    !Array.isArray(resolvedOpts.doNotRemoveHTMLCommentsWhoseOpeningTagContains)
  ) {
    throw new TypeError(
      `email-comb/comb(): [THROW_ID_10] resolvedOpts.doNotRemoveHTMLCommentsWhoseOpeningTagContains should be an array, but it was customised to ${formatDiagnosticValue(resolvedOpts.doNotRemoveHTMLCommentsWhoseOpeningTagContains, 4)}`,
    );
  }
  if (
    !resolvedOpts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.every(
      (val) => typeof val === "string",
    )
  ) {
    throw new TypeError(
      `email-comb/comb(): [THROW_ID_11] resolvedOpts.doNotRemoveHTMLCommentsWhoseOpeningTagContains should contain only strings. Currently it's ${formatDiagnosticValue(resolvedOpts.doNotRemoveHTMLCommentsWhoseOpeningTagContains, 4)}`,
    );
  }
  if (typeof resolvedOpts.removeHTMLComments !== "boolean") {
    throw new TypeError(
      `email-comb/comb(): [THROW_ID_12] resolvedOpts.removeHTMLComments should be a Boolean. Currently it's ${formatDiagnosticValue(resolvedOpts.removeHTMLComments)}`,
    );
  }
  if (typeof resolvedOpts.removeCSSComments !== "boolean") {
    throw new TypeError(
      `email-comb/comb(): [THROW_ID_13] resolvedOpts.removeCSSComments should be a Boolean. Currently it's ${formatDiagnosticValue(resolvedOpts.removeCSSComments)}`,
    );
  }
  if (opts && hasOwnProp(opts, "htmlCrushOpts") && !isObj(opts.htmlCrushOpts)) {
    throw new TypeError(
      `email-comb/comb(): [THROW_ID_14] resolvedOpts.htmlCrushOpts should be a plain object. Currently it's ${formatDiagnosticValue(opts.htmlCrushOpts)}`,
    );
  }
  if (!Number.isFinite(resolvedOpts.reportProgressFuncFrom)) {
    throw new TypeError(
      `email-comb/comb(): [THROW_ID_15] resolvedOpts.reportProgressFuncFrom should be a finite number. Currently it's ${formatDiagnosticValue(resolvedOpts.reportProgressFuncFrom)}`,
    );
  }
  if (!Number.isFinite(resolvedOpts.reportProgressFuncTo)) {
    throw new TypeError(
      `email-comb/comb(): [THROW_ID_16] resolvedOpts.reportProgressFuncTo should be a finite number. Currently it's ${formatDiagnosticValue(resolvedOpts.reportProgressFuncTo)}`,
    );
  }
  if (resolvedOpts.reportProgressFuncFrom > resolvedOpts.reportProgressFuncTo) {
    throw new TypeError(
      `email-comb/comb(): [THROW_ID_17] resolvedOpts.reportProgressFuncFrom cannot be greater than resolvedOpts.reportProgressFuncTo. Currently they are ${resolvedOpts.reportProgressFuncFrom} and ${resolvedOpts.reportProgressFuncTo}`,
    );
  }

  resolvedOpts.whitelist = [...resolvedOpts.whitelist];
  resolvedOpts.backend = [...resolvedOpts.backend];
  resolvedOpts.doNotRemoveHTMLCommentsWhoseOpeningTagContains = [
    ...resolvedOpts.doNotRemoveHTMLCommentsWhoseOpeningTagContains,
  ].map((value) => value.toLowerCase());
  const idsReferencedByForAttributes = extractIdsReferencedByForAttributes(str);
  const idsReferencedByForAttributesSet = new Set(idsReferencedByForAttributes);
  if (!resolvedOpts.reportProgressFunc) {
    resolvedOpts.reportProgressFunc = null;
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

  // A run of blank lines inside tag syntax has to close up completely, which
  // test 02.03 in test/comments.js and 21.03 in test/basic.js both pin. In text
  // content, retain one line break so adjacent words cannot concatenate. Raw
  // script/style content and HTML comments are byte-preserved by this pre-pass;
  // configured backend regions retain one line break as their separator.
  str = cleanBlankLines(str.trim(), resolvedOpts.backend);
  // restore trailing newline
  if (trailingNewline) {
    str += trailingNewline;
  }

  let len = str.length;
  const rawTextRanges = new Map<number, number>();
  const styleTags = collectStyleTags(str, rawTextRanges);
  const bodyAttributes = collectBodyAttributes(
    str,
    resolvedOpts.backend,
    rawTextRanges,
  );
  const nextClosingBracketAt = collectNextClosingBrackets(str);
  const cssRegions = new Map<number, CssRegion>();
  const nestedStyleRules = new Map<number, NestedStyleRule>();
  const nestedSelectors = new Set<string>();
  let activeCssRegion: CssRegion | undefined;
  const cssFlagsAt = (index: number): number => {
    for (let region of cssRegions.values()) {
      if (index >= region.start && index < region.end)
        return region.flags[index - region.start];
    }
    return 0;
  };
  totalCounter += len;

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
        `${`\u001b[${33}m${`ceil`}\u001b[${39}m`} = ${JSON.stringify(
          ceil,
          null,
          4,
        )}`,
      );
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
  let bodyClassesToDeleteSet = new Set<string>();
  let lastPercentage = 0;
  let stateWithinBody;
  let stateWithinBodyInlineStyle: number | null;
  let stateWithinBodyInlineStyleEndsAt: number | null;
  let bodyIdsToDelete: string[] = [];
  let bodyIdsToDeleteSet = new Set<string>();
  let bodyIdsReferencedByForAttributes: string[] = [];
  let bodyIdsReferencedByForAttributesSet = new Set<string>();
  let bodyCssToDelete: string[] = [];
  let headCssToDelete: string[] = [];
  let headCssToDeleteSet = new Set<string>();
  let uglifiedBySelector = new Map<string, string>();
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
    singleSelectorEndsAt = null;
    singleSelectorQueue = [];
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
    stateWithinBodyInlineStyleEndsAt = null;
    activeCssRegion = undefined;
    singleSelectorValue = undefined;
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
    const rawTextStarts = rawTextRanges.keys();
    let nextRawTextAt = rawTextStarts.next().value ?? len;

    stepOuter: for (let i = 0; i < len; i++) {
      if (i >= nextRawTextAt) {
        while (i > nextRawTextAt) {
          nextRawTextAt = rawTextStarts.next().value ?? len;
        }
        if (i === nextRawTextAt) {
          const rawTextEnd = rawTextRanges.get(i) as number;
          nextRawTextAt = rawTextStarts.next().value ?? len;
          if (rawTextEnd > i) {
            // HTML raw-text and RCDATA contents cannot introduce tags,
            // attributes or HTML comments. Preserve their original contents.
            i = rawTextEnd - 1;
            whitespaceStartedAt = null;
            continue;
          }
        }
      }
      const cssFlags =
        activeCssRegion && i >= activeCssRegion.start && i < activeCssRegion.end
          ? activeCssRegion.flags[i - activeCssRegion.start]
          : 0;
      const cssOpaque = !!(cssFlags & 1);
      const cssStructural = !(cssFlags & 3);
      const chr = str[i];
      const chrCode = chr.charCodeAt(0);
      const chrIsWhitespace =
        chrCode === 32 ||
        (chrCode >= 9 && chrCode <= 13) ||
        (chrCode > 127 && chr.trim() === "");
      const bodyAttribute = bodyAttributes.get(i);

      // logging:
      if (round !== 9) {
        DEV &&
          console.log(
            `${`\u001b[${39}m${`---${`\u001b[${32}m round ${round} \u001b[${39}m`}-----------------------`}\u001b[${36}m`} str[${`\u001b[${35}m${i}\u001b[${39}m`}] = ${
              chr && !chrIsWhitespace ? chr : JSON.stringify(chr, null, 0)
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
              resolvedOpts.reportProgressFuncFrom +
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
        DEV && console.log(`activate "stateWithinStyleTag" state`);
        DEV &&
          console.log(
            `${`\u001b[${33}m${`styleStartedAt`}\u001b[${39}m`} = ${JSON.stringify(
              styleStartedAt,
              null,
              4,
            )}`,
          );
        DEV &&
          console.log(
            `${`\u001b[${33}m${`styleEndedAt`}\u001b[${39}m`} = ${JSON.stringify(
              styleEndedAt,
              null,
              4,
            )}`,
          );

        // ---------------------------------------------------------------------

        stateWithinStyleTag = true;
        stateWithinBody = false;
        stateWithinBodyInlineStyle = null;
        stateWithinBodyInlineStyleEndsAt = null;
      } else if (
        !stateWithinBody &&
        !stateWithinStyleTag &&
        bodyStartedAt !== null &&
        (styleStartedAt === null || styleStartedAt < i) &&
        (styleEndedAt === null || styleEndedAt < i)
      ) {
        DEV &&
          console.log(
            `activate "stateWithinBody" state (stateWithinBody was previously ${stateWithinBody})`,
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
          `${`\u001b[${33}m${`commentStartedAt`}\u001b[${39}m`} = ${JSON.stringify(
            commentStartedAt,
            null,
            4,
          )}`,
        );
      if (
        // it might be some piece of the comment, for example imagine
        // <a style="color: red;/*">z<id style="*/padding-top: 10px;">
        //                        ^            ^                    ^
        //                     false      also false              real
        // opening has been caught:
        stateWithinBodyInlineStyleEndsAt !== null &&
        i >= stateWithinBodyInlineStyleEndsAt
      ) {
        DEV &&
          console.log(
            `███████████████████████████████████████ INLINE STYLE END CAUGHT`,
          );
        stateWithinBodyInlineStyle = null;
        stateWithinBodyInlineStyleEndsAt = null;
        if (commentStartedAt !== null && doNothingUntil === "*/") {
          commentStartedAt = null;
          doNothing = false;
          doNothingUntil = null;
        }
        DEV &&
          console.log(
            `SET ${`\u001b[${33}m${`stateWithinBodyInlineStyle`}\u001b[${39}m`} = ${stateWithinBodyInlineStyle}`,
          );
      }

      // catch inline style's start, for example
      // <a style="zzz"
      //          ^
      //        this
      if (
        commentStartedAt === null &&
        stateWithinBodyInlineStyle === null &&
        bodyAttribute?.name === "style"
      ) {
        DEV &&
          console.log(
            `███████████████████████████████████████ INLINE STYLE START CAUGHT`,
          );
        stateWithinBodyInlineStyle = bodyAttribute.equalsAt;
        stateWithinBodyInlineStyleEndsAt = bodyAttribute.valueEndsAt;
        activeCssRegion = cssRegions.get(bodyAttribute.valueStartsAt);
        if (!activeCssRegion) {
          activeCssRegion = createCssRegion(
            str,
            bodyAttribute.valueStartsAt,
            bodyAttribute.valueEndsAt,
          );
          // Inline references can create CSS quotes. Until decoded mappings are
          // needed for edits, retain their contents conservatively.
          if (
            str
              .slice(bodyAttribute.valueStartsAt, bodyAttribute.valueEndsAt)
              .includes("&")
          ) {
            activeCssRegion.flags.fill(1);
          }
          cssRegions.set(bodyAttribute.valueStartsAt, activeCssRegion);
        }
        DEV &&
          console.log(
            `SET ${`\u001b[${33}m${`stateWithinBodyInlineStyle`}\u001b[${39}m`} = ${stateWithinBodyInlineStyle} (at character "${
              str[bodyAttribute.valueStartsAt]
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

      if (
        !doNothing &&
        !stateWithinStyleTag &&
        !cssOpaque &&
        (str[i] === '"' || str[i] === "'")
      ) {
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
                `SET ${`\u001b[${33}m${`currentlyWithinQuotes`}\u001b[${39}m`} = ${currentlyWithinQuotes}`,
              );
          }
        } else if (
          (str[i] === `"` &&
            str[right(str, i) as number] === `'` &&
            str[right(str, right(str, i)) as number] === `"`) ||
          (str[i] === `'` &&
            str[right(str, i) as number] === `"` &&
            str[right(str, right(str, i)) as number] === `'`)
        ) {
          i = right(str, right(str, i)) as number;
          DEV && console.log(`BUMP i=${right(str, right(str, i))}, step outer`);
          continue;
        } else if (currentlyWithinQuotes === str[i]) {
          currentlyWithinQuotes = null;
          DEV &&
            console.log(
              `${`\u001b[${31}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`currentlyWithinQuotes`}\u001b[${39}m`} = null`,
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
                `${`\u001b[${31}m${`██`}\u001b[${39}m`} SET ${`\u001b[${33}m${`styleAttributeStartedAt`}\u001b[${39}m`} = null`,
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
              `\u001b[${31}m${`something went wrong, doNothing is truthy but doNothingUntil is not set! Turning off doNothing back to false.`}\u001b[${39}m`,
            );
          doNothing = false;
          // just turn it off and move on.
        } else if (doNothingUntil && matchRightIncl(str, i, doNothingUntil)) {
          DEV && console.log(`doNothingUntil="${doNothingUntil}" MATCHED`);
          // Normally doNothingUntil is a single character.
          // However, when matching back-end characters, it can be multiple chars.
          // That's why above we can't compare with '===' and need the
          // "string-match-left-right" library.

          // 1. COMMENTS-RELATED SKIPS ARE TENDED SEPARATELY:
          if (commentStartedAt !== null) {
            // submit the comment characters range for deletion:

            // logging:
            DEV &&
              console.log(`CSS comment-block ends, let's tackle the doNothing`);

            commentStartedAt = null;
            DEV &&
              console.log(
                `SET ${`\u001b[${33}m${`commentStartedAt`}\u001b[${39}m`} = ${commentStartedAt}`,
              );
          }

          // 2. ALL OTHER CASES OF "DO-NOTHING":

          // offset the index:
          i = i + doNothingUntil.length - 1;
          DEV && console.log(`AFTER OFFSET, THE NEW i IS NOW: ${i}`);

          // Switch off the mode
          doNothingUntil = null;
          DEV &&
            console.log(
              `SET ${`\u001b[${33}m${`doNothingUntil`}\u001b[${39}m`} = ${doNothingUntil}`,
            );
          doNothing = false;
          DEV &&
            console.log(
              `SET ${`\u001b[${33}m${`doNothing`}\u001b[${39}m`} = ${doNothing}, then step out`,
            );
          continue;
        }
      }

      // head: pinpoint any <style... tag, anywhere within the given HTML
      // ================
      if (!doNothing && !stateWithinStyleTag && styleTags.has(i)) {
        checkingInsideCurlyBraces = true;
        DEV &&
          console.log(
            `SET ${`\u001b[${33}m${`checkingInsideCurlyBraces`}\u001b[${39}m`} = ${checkingInsideCurlyBraces}`,
          );

        DEV &&
          console.log(`\u001b[${36}m${`\n * style tag begins`}\u001b[${39}m`);
        if (!stateWithinStyleTag) {
          stateWithinStyleTag = true;
          DEV &&
            console.log(`SET stateWithinStyleTag = ${stateWithinStyleTag}`);
        }

        DEV &&
          console.log(
            `\u001b[${36}m${`\n marching forward until ">":`}\u001b[${39}m`,
          );
        totalCounter += 1;
        const styleTag = styleTags.get(i) as StyleTagRegion;
        const closingBracketAt = styleTag.start - 1;
        if (closingBracketAt !== -1) {
          DEV &&
            console.log(`\u001b[${36}m${` > found, stopping`}\u001b[${39}m`);
          styleStartedAt = closingBracketAt + 1;
          activeCssRegion = cssRegions.get(styleStartedAt);
          if (!activeCssRegion) {
            activeCssRegion = createCssRegion(
              str,
              styleStartedAt,
              styleTag.end,
            );
            cssRegions.set(styleStartedAt, activeCssRegion);
            for (const [start, rule] of collectNestedStyleRules(
              activeCssRegion,
            ))
              nestedStyleRules.set(start, rule);
          }
          ruleChunkStartedAt = closingBracketAt + 1;
          DEV &&
            console.log(
              `SET ${`\u001b[${33}m${`styleStartedAt`}\u001b[${39}m`} = ${styleStartedAt}; SET ${`\u001b[${33}m${`ruleChunkStartedAt`}\u001b[${39}m`} = ${ruleChunkStartedAt}`,
            );
        }
      }

      // head: pinpoint closing style tag, </style>
      // It's not that easy.
      // There can be whitespace to the left and right of closing slash.
      // ================
      const unclosedCssCommentWithinStyle =
        doNothing &&
        doNothingUntil === "*/" &&
        commentStartedAt !== null &&
        styleStartedAt !== null &&
        commentStartedAt >= styleStartedAt;
      if (
        (!doNothing || unclosedCssCommentWithinStyle) &&
        stateWithinStyleTag &&
        str[i] === "<" &&
        str[i + 1] === "/" &&
        str.slice(i + 2, i + 7).toLowerCase() === "style" &&
        (isHtmlAsciiWhitespace(str[i + 7]) || [">", "/"].includes(str[i + 7]))
      ) {
        // TODO: take care of any spaces around: 1. slash; 2. brackets

        styleEndedAt = i;
        DEV &&
          console.log(
            `SET ${`\u001b[${33}m${`checkingInsideCurlyBraces`}\u001b[${39}m`} = ${checkingInsideCurlyBraces}`,
          );
        DEV &&
          console.log(
            `SET ${`\u001b[${33}m${`styleEndedAt`}\u001b[${39}m`} = ${styleEndedAt}`,
          );

        // we don't need the chunk end tracking marker any more
        ruleChunkStartedAt = null;
        selectorChunkStartedAt = null;
        selectorChunkCanBeDeleted = false;
        singleSelectorStartedAt = null;
        singleSelectorEndsAt = null;
        singleSelectorQueue = [];
        singleSelectorType = undefined;
        singleSelectorValue = undefined;
        headWholeLineCanBeDeleted = true;
        lastKeptChunksCommaAt = null;
        onlyDeletedChunksFollow = false;
        insideCurlyBraces = false;
        curliesDepth = 0;
        currentlyWithinQuotes = null;
        whitespaceStartedAt = null;
        currentChunk = null;
        currentChunksMinifiedSelectors.wipe();
        checkingInsideCurlyBraces = false;

        if (
          commentStartedAt !== null &&
          styleStartedAt !== null &&
          commentStartedAt >= styleStartedAt
        ) {
          commentStartedAt = null;
          commentNearlyStartedAt = null;
          bogusHTMLComment = undefined;
        }
        if (unclosedCssCommentWithinStyle) {
          doNothing = false;
          doNothingUntil = null;
        }

        if (stateWithinStyleTag) {
          stateWithinStyleTag = false;
          DEV &&
            console.log(`SET stateWithinStyleTag = ${stateWithinStyleTag}`);
        }
      }

      // CSS permits legacy CDO/CDC markers around top-level rules. They are
      // not HTML comments enclosing those rules in a style raw-text region.
      if (
        !doNothing &&
        stateWithinStyleTag &&
        !insideCurlyBraces &&
        activeCssRegion?.tokens.has(i) &&
        (str.startsWith("<!--", i) || str.startsWith("-->", i)) &&
        asciiLowerCase(str.slice(i, i + 7)) !== "<!--[if"
      ) {
        let markerLength = str[i] === "<" ? 4 : 3;
        ruleChunkStartedAt = i + markerLength;
        selectorChunkStartedAt = null;
        whitespaceStartedAt = null;
        i += markerLength - 1;
        continue;
      }

      // Lexical comments have authoritative CSS-region boundaries. Retained
      // comments remain opaque in both rounds, including unfinished comments.
      const cssComment = !cssOpaque && activeCssRegion?.comments.get(i);
      if (!doNothing && cssComment) {
        if (round === 1 && resolvedOpts.removeCSSComments) {
          let from = cssComment.from;
          if (cssComment.canExpand) {
            const lineBreak = matchLeft(str, from, ["\r\n", "\n", "\r"]);
            if (typeof lineBreak === "string") {
              from = Math.max(
                activeCssRegion?.start ?? from,
                from - lineBreak.length,
              );
            }
          }
          if (
            cssComment.replacement !== str.slice(cssComment.from, cssComment.to)
          ) {
            finalIndexesToDelete.push(
              from,
              cssComment.to,
              cssComment.replacement,
            );
            commentsLength +=
              cssComment.to - cssComment.from - cssComment.replacement.length;
            nonIndentationsWhitespaceLength += cssComment.from - from;
          }
        }
        if (round === 2 && round1RangesClone) {
          while (
            round1RangeIndex < round1RangesClone.length &&
            round1RangesClone[round1RangeIndex][0] < cssComment.to
          ) {
            round1RangeIndex++;
          }
        }
        whitespaceStartedAt = null;
        i = cssComment.to - 1;
        continue;
      }

      // Preserve a complete nested style tree. Its selector identities still
      // participate in body retention, inventories and coordinated uglification.
      const nestedRule =
        nestedStyleRules.size &&
        !doNothing &&
        stateWithinStyleTag &&
        nestedStyleRules.get(i);
      if (nestedRule && activeCssRegion) {
        for (const [from, to] of nestedRule.preludes) {
          if (round === 1) {
            const prelude = str.slice(from, to);
            headSelectorsArr.push(prelude);
            for (const selector of extractCanonicalSelectors(prelude))
              nestedSelectors.add(selector);
          } else if (resolvedOpts.uglify) {
            for (let cursor = from; cursor < to; ) {
              const attribute = str[cursor] === "[";
              const selector = attribute
                ? undefined
                : readSelectorInRegion(str, cursor, activeCssRegion);
              const queue = attribute
                ? attributeSelectorQueue(str, cursor, activeCssRegion)
                : selector
                  ? [
                      {
                        startsAt: selector.range[0],
                        endsAt: selector.range[1],
                        value: selector.value,
                        marker: selector.value[0],
                        quote: null,
                      },
                    ]
                  : [];
              for (const token of queue) {
                const shortened = uglifiedBySelector.get(token.value);
                if (
                  shortened &&
                  shortened !== token.value &&
                  !bodyIdsReferencedByForAttributesSet.has(token.value) &&
                  !match(token.value, resolvedOpts.whitelist)
                ) {
                  const name = shortened.slice(1);
                  finalIndexesToDelete.push(
                    token.startsAt,
                    token.endsAt,
                    attribute
                      ? token.quote
                        ? serializeCssString(name, token.quote)
                        : serializeCssIdentifier(name)
                      : `${token.marker}${serializeCssIdentifier(name)}`,
                  );
                }
              }
              if (attribute) {
                const closing = cssAttributeEndsAt(str, cursor);
                if (closing !== null) {
                  cursor = closing + 1;
                  continue;
                }
              }
              cursor = selector
                ? selector.range[1]
                : (readCssToken(str, cursor) as CssToken).range[1];
            }
          }
        }
        if (round === 1 && resolvedOpts.removeCSSComments) {
          for (const comment of nestedRule.comments) {
            finalIndexesToDelete.push(
              comment.from,
              comment.to,
              comment.replacement,
            );
            commentsLength +=
              comment.to - comment.from - comment.replacement.length;
          }
        }
        if (round === 2 && round1RangesClone) {
          while (
            round1RangeIndex < round1RangesClone.length &&
            round1RangesClone[round1RangeIndex][0] < nestedRule.end
          )
            round1RangeIndex++;
        }
        ruleChunkStartedAt = nestedRule.end;
        selectorChunkStartedAt = null;
        selectorChunkCanBeDeleted = false;
        singleSelectorStartedAt = null;
        singleSelectorEndsAt = null;
        singleSelectorQueue = [];
        singleSelectorType = undefined;
        singleSelectorValue = undefined;
        headWholeLineCanBeDeleted = true;
        lastKeptChunksCommaAt = null;
        onlyDeletedChunksFollow = false;
        insideCurlyBraces = false;
        curliesDepth = 0;
        currentlyWithinQuotes = null;
        whitespaceStartedAt = null;
        currentChunk = null;
        currentChunksMinifiedSelectors.wipe();
        i = nestedRule.end - 1;
        continue;
      }

      // pinpoint "@"
      if (
        !doNothing &&
        stateWithinStyleTag &&
        cssStructural &&
        !insideCurlyBraces &&
        str[i] === "@"
      ) {
        DEV && console.log(`(i=${i})`);
        // since we are going to march forward, rest the whitespaceStartedAt
        // marker since it might not get reset otherwise
        if (whitespaceStartedAt) {
          whitespaceStartedAt = null;
        }

        let atToken = activeCssRegion?.tokens.get(i);
        let decodedAtName =
          atToken?.kind === "at-keyword" ? asciiLowerCase(atToken.value) : "";
        let matchedAtTagsName = [
          ...atRulesWhichMightWrapStyles,
          ...atRulesWhichNeedToBeIgnored,
        ].includes(decodedAtName)
          ? decodedAtName
          : false;
        let atNameLength = atToken ? atToken.range[1] - i - 1 : 0;
        if (typeof matchedAtTagsName === "string") {
          DEV && console.log(`@${matchedAtTagsName} detected`);
          let temp;

          // rare case when semicolon follows the at-tag - in that
          // case, we remove the at-rule because it's broken
          if (
            str[i + atNameLength + 1] === ";" ||
            (str[i + atNameLength + 1] &&
              isWhitespace(str[i + atNameLength + 1]) &&
              matchRight(str, i + atNameLength + 1, ";", {
                trimBeforeMatching: true,
                cb: (_char, _theRemainderOfTheString, index) => {
                  temp = index;
                  return true;
                },
              }))
          ) {
            DEV && console.log(`BLANK AT-RULE DETECTED`);
            finalIndexesToDelete.push(i, temp || i + atNameLength + 2);
          }

          // these can wrap styles and each other and their pesky curlies can throw
          // our algorithm off-track. We need to jump past the chunk from "@..."
          // to, and including, first curly bracket. But mind the dirty code cases.

          let ignoredBlockDepth = 0;
          for (
            let z = i + atNameLength + 1;
            z < (activeCssRegion?.end ?? len);
            z++
          ) {
            totalCounter++;
            let flags =
              activeCssRegion && z < activeCssRegion.end
                ? activeCssRegion.flags[z - activeCssRegion.start]
                : 0;
            if (flags & 3) continue;

            // Preserve the existing backend-template recovery inside preludes.
            let tails = str.startsWith("{{", z)
              ? "}}"
              : str.startsWith("{%", z)
                ? "%}"
                : "";
            if (tails && str.includes(tails, z + 2)) {
              z = str.indexOf(tails, z + 2) + tails.length - 1;
              continue;
            }
            if (ignoredBlockDepth) {
              if (str[z] === "{") ignoredBlockDepth++;
              if (str[z] === "}") ignoredBlockDepth--;
              if (!ignoredBlockDepth) {
                i = z;
                ruleChunkStartedAt = z + 1;
                continue stepOuter;
              }
              continue;
            }
            if (
              str[z] === "{" &&
              atRulesWhichNeedToBeIgnored.includes(matchedAtTagsName)
            ) {
              ignoredBlockDepth = 1;
              continue;
            }
            if (str[z] === "{" || str[z] === ";") {
              insideCurlyBraces = false;
              ruleChunkStartedAt = z + 1;
              i = z;
              continue stepOuter;
            }
            if (str[z] === "@" || str[z] === "<") {
              let prelude = str.slice(i, z);
              if (round === 1 && !/[{("']/.test(prelude)) {
                finalIndexesToDelete.push(i, z);
              }
              i = z - 1;
              ruleChunkStartedAt = z;
              continue stepOuter;
            }
          }
          if (activeCssRegion) {
            if (
              round === 1 &&
              !/[{("']/.test(str.slice(i, activeCssRegion.end))
            ) {
              finalIndexesToDelete.push(i, activeCssRegion.end);
            }
            i = activeCssRegion.end - 1;
            continue;
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
        cssStructural &&
        !currentlyWithinQuotes &&
        !curliesDepth
      ) {
        DEV &&
          console.log(
            `${`\u001b[${32}m${`██`}\u001b[${39}m`} pinpointing closing curly braces`,
          );

        // submit whole chunk for deletion if applicable:
        if (round === 2 && headWholeLineCanBeDeleted && ruleChunkStartedAt) {
          finalIndexesToDelete.push(ruleChunkStartedAt, i + 1);
          DEV &&
            console.log(
              `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${ruleChunkStartedAt}, ${
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
            `SET ${`\u001b[${33}m${`insideCurlyBraces`}\u001b[${39}m`} = false`,
          );

        DEV &&
          console.log(
            `FIY, \u001b[${31}m${`headWholeLineCanBeDeleted = ${headWholeLineCanBeDeleted}`}\u001b[${39}m; \u001b[${31}m${`lastKeptChunksCommaAt = ${lastKeptChunksCommaAt}`}\u001b[${39}m; \u001b[${31}m${`onlyDeletedChunksFollow = ${onlyDeletedChunksFollow}`}\u001b[${39}m
            `,
          );

        if (ruleChunkStartedAt) {
          ruleChunkStartedAt = i + 1;
          DEV &&
            console.log(
              `SET ${`\u001b[${33}m${`ruleChunkStartedAt`}\u001b[${39}m`} = ${ruleChunkStartedAt}`,
            );
        }

        // reset selectorChunkStartedAt:
        selectorChunkStartedAt = null;
        selectorChunkCanBeDeleted = false;
        headWholeLineCanBeDeleted = true;
        singleSelectorStartedAt = null;
        singleSelectorEndsAt = null;
        singleSelectorQueue = [];
        lastKeptChunksCommaAt = null;
        onlyDeletedChunksFollow = false;

        DEV &&
          console.log(
            `RESET: ${`\u001b[${33}m${`selectorChunkStartedAt`}\u001b[${39}m`} = null; ${`\u001b[${33}m${`singleSelectorStartedAt`}\u001b[${39}m`} = null; ${`\u001b[${33}m${`headWholeLineCanBeDeleted`}\u001b[${39}m`} = true;
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
          console.log(`catching the beginning/ending of CSS selectors in head`);
        // TODO: skip all false-positive characters within quotes, like curlies

        // PART 1.

        // catch the START of single selectors (for example, "#head-only-id-2")
        // any character, not permitted in CSS class/id names stops the recording
        if (singleSelectorStartedAt === null && !cssOpaque && !(cssFlags & 4)) {
          // catch the start of a single
          if (chr === "." || chr === "#") {
            let token = readSelectorInRegion(str, i, activeCssRegion);
            if (token) {
              singleSelectorStartedAt = i;
              singleSelectorEndsAt = token.range[1];
              DEV &&
                console.log(
                  `SET ${`\u001b[${33}m${`singleSelectorStartedAt`}\u001b[${39}m`} = ${singleSelectorStartedAt}`,
                );
            }
          } else if (chr === "[") {
            singleSelectorQueue = attributeSelectorQueue(
              str,
              i,
              activeCssRegion,
            );
            let firstAttributeSelector = singleSelectorQueue.shift();
            if (firstAttributeSelector) {
              singleSelectorStartedAt = firstAttributeSelector.startsAt;
              singleSelectorEndsAt = firstAttributeSelector.endsAt;
              singleSelectorType = firstAttributeSelector.marker;
              singleSelectorValue = firstAttributeSelector.value;
              singleSelectorQuote = firstAttributeSelector.quote;
              DEV &&
                console.log(
                  `SET attribute selector: ${`\u001b[${33}m${`singleSelectorStartedAt`}\u001b[${39}m`} = ${singleSelectorStartedAt}; ${`\u001b[${33}m${`singleSelectorEndsAt`}\u001b[${39}m`} = ${singleSelectorEndsAt}; ${`\u001b[${33}m${`singleSelectorType`}\u001b[${39}m`} = ${singleSelectorType}`,
                );
            }
          } else if (!chrIsWhitespace) {
            // logging:
            DEV && console.log("██");
            if (chr === "}" && cssStructural) {
              ruleChunkStartedAt = i + 1;
              currentChunk = null;
              DEV &&
                console.log(
                  `SET ${`\u001b[${33}m${`ruleChunkStartedAt`}\u001b[${39}m`} = ${
                    i + 1
                  }; ${`\u001b[${33}m${`currentChunk`}\u001b[${39}m`} = null;`,
                );
            } else if (chr === "<" && str[i + 1] === "!") {
              // catch comment blocks, probably Outlook conditional comments
              // like <!--[if mso]>
              DEV &&
                console.log(
                  `\u001b[${36}m${`conditional comment detected, traverse forward`}\u001b[${39}m`,
                );
              for (let y = i; y < len; y++) {
                totalCounter += 1;
                DEV &&
                  console.log(
                    `\u001b[${36}m${`-----str[${y}]=${str[y]}`}\u001b[${39}m`,
                  );
                if (
                  str[y] === "<" &&
                  str[y + 1] === "/" &&
                  str.slice(y + 2, y + 7).toLowerCase() === "style" &&
                  (isHtmlAsciiWhitespace(str[y + 7]) ||
                    [">", "/"].includes(str[y + 7]))
                ) {
                  i = y - 1;
                  continue stepOuter;
                }
                if (str[y] === ">") {
                  ruleChunkStartedAt = y + 1;
                  selectorChunkStartedAt = y + 1;
                  DEV &&
                    console.log(
                      `\u001b[${36}m${`ruleChunkStartedAt=${ruleChunkStartedAt}`}\u001b[${39}m; \u001b[${36}m${`selectorChunkStartedAt=${selectorChunkStartedAt}`}\u001b[${39}m; THEN BREAK`,
                    );
                  i = y;
                  continue stepOuter;
                }
              }
            } else if (str[i] === "," && cssStructural) {
              // it can be end of a tag, for example:
              // <style>
              // .a, li, .b, .c {}
              //       ^
              // we're here
              lastKeptChunksCommaAt = i;
              DEV &&
                console.log(
                  `SET ${`\u001b[${33}m${`lastKeptChunksCommaAt`}\u001b[${39}m`} = ${lastKeptChunksCommaAt}; ${`\u001b[${33}m${`onlyDeletedChunksFollow`}\u001b[${39}m`} = ${onlyDeletedChunksFollow};`,
                );
            }
          }
        }
        // catch the END of a single selectors
        else if (
          singleSelectorStartedAt !== null &&
          (singleSelectorEndsAt !== null
            ? i >= singleSelectorEndsAt
            : !characterSuitableForNames(chr))
        ) {
          let selectorEndsAt = singleSelectorEndsAt ?? i;
          let singleSelector = str.slice(
            singleSelectorStartedAt,
            selectorEndsAt,
          );
          let syntheticSelectorType = singleSelectorType;
          if (singleSelectorType) {
            singleSelector = `${singleSelectorType}${singleSelector}`;
            singleSelectorType = undefined;
          }
          singleSelector =
            singleSelectorValue ?? decodeCssSelector(singleSelector);
          singleSelectorValue = undefined;
          DEV &&
            console.log(
              `CARVED OUT A SINGLE SELECTOR'S NAME: "\u001b[${32}m${singleSelector}\u001b[${39}m"`,
            );

          if (
            round === 2 &&
            !selectorChunkCanBeDeleted &&
            headCssToDeleteSet.has(singleSelector)
          ) {
            selectorChunkCanBeDeleted = true;
            DEV &&
              console.log(
                `SET selectorChunkCanBeDeleted = true - ${`\u001b[${31}m${`CHUNK CAN BE DELETED`}\u001b[${39}m`}`,
              );
            onlyDeletedChunksFollow = true;
            DEV &&
              console.log(
                `SET ${`\u001b[${33}m${`onlyDeletedChunksFollow`}\u001b[${39}m`} = true`,
              );
          } else if (round === 2 && !selectorChunkCanBeDeleted) {
            DEV &&
              console.log(
                `${`\u001b[${32}m${`BTW, THIS CHUNK MIGHT BE RETAINED`}\u001b[${39}m`}`,
              );
            DEV &&
              console.log(
                `${`\u001b[${33}m${`resolvedOpts.whitelist`}\u001b[${39}m`} = ${JSON.stringify(
                  resolvedOpts.whitelist,
                  null,
                  4,
                )}`,
              );
            // 1. uglify part
            if (
              resolvedOpts.uglify &&
              !bodyIdsReferencedByForAttributesSet.has(singleSelector) &&
              (!Array.isArray(resolvedOpts.whitelist) ||
                !resolvedOpts.whitelist.length ||
                !match(singleSelector, resolvedOpts.whitelist))
            ) {
              let uglifiedSelector = uglifiedBySelector.get(singleSelector);
              // The allocator can shorten a two-code-point name to unsafe
              // punctuation or a leading digit. Preserve unchanged raw text;
              // serialize changed names for their actual destination syntax.
              if (
                uglifiedSelector !== undefined &&
                uglifiedSelector !== singleSelector
              ) {
                const name = uglifiedSelector.slice(1);
                uglifiedSelector = syntheticSelectorType
                  ? singleSelectorQuote
                    ? serializeCssString(name, singleSelectorQuote)
                    : serializeCssIdentifier(name)
                  : `${uglifiedSelector[0]}${serializeCssIdentifier(name)}`;
                currentChunksMinifiedSelectors.push(
                  singleSelectorStartedAt,
                  selectorEndsAt,
                  uglifiedSelector,
                );
              }
            }
            // 2. tend trailing comma issue (lastKeptChunksCommaAt and
            // onlyDeletedChunksFollow):
            if (chr === "," && cssStructural) {
              lastKeptChunksCommaAt = i;
              onlyDeletedChunksFollow = false;
              DEV &&
                console.log(
                  `SET ${`\u001b[${33}m${`lastKeptChunksCommaAt`}\u001b[${39}m`} = ${lastKeptChunksCommaAt}; ${`\u001b[${33}m${`onlyDeletedChunksFollow`}\u001b[${39}m`} = ${onlyDeletedChunksFollow};`,
                );
            } else {
              // IF it's whitespace, traverse forward, look for comma
            }
          }

          let nextAttributeSelector = singleSelectorQueue.shift();
          if (nextAttributeSelector) {
            singleSelectorStartedAt = nextAttributeSelector.startsAt;
            singleSelectorEndsAt = nextAttributeSelector.endsAt;
            singleSelectorType = nextAttributeSelector.marker;
            singleSelectorValue = nextAttributeSelector.value;
            singleSelectorQuote = nextAttributeSelector.quote;
          } else if (
            !cssOpaque &&
            !(cssFlags & 4) &&
            (chr === "." || chr === "#")
          ) {
            let token = readSelectorInRegion(str, i, activeCssRegion);
            if (token) {
              singleSelectorStartedAt = i;
              singleSelectorEndsAt = token.range[1];
              DEV &&
                console.log(
                  `${`\u001b[${33}m${`singleSelectorStartedAt`}\u001b[${39}m`} = ${singleSelectorStartedAt}`,
                );
            } else {
              singleSelectorStartedAt = null;
              singleSelectorEndsAt = null;
            }
          } else {
            singleSelectorStartedAt = null;
            singleSelectorEndsAt = null;
            singleSelectorType = undefined;
            DEV && console.log(`WIPE singleSelectorStartedAt = null`);
          }
        }

        // PART 2.

        // catch the selectorChunks (for example, #head-only-id-2.real-class-1[lang|en]):
        // only opening curly brace or comma stops the recording.
        if (selectorChunkStartedAt === null) {
          DEV && console.log(`catching the start of a chunk`);
          // catch the start of a chunk
          // if (chr === "." || chr === "#") {
          if (
            !chrIsWhitespace &&
            chr !== "}" &&
            chr !== ";" &&
            !(str[i] === "/" && str[i + 1] === "*")
          ) {
            // reset the deletion flag:
            selectorChunkCanBeDeleted = false;
            DEV &&
              console.log(
                `${`\u001b[${33}m${`selectorChunkCanBeDeleted`}\u001b[${39}m`} = ${selectorChunkCanBeDeleted}`,
              );

            // set the chunk's starting marker:
            selectorChunkStartedAt = i;
            DEV &&
              console.log(
                `${`\u001b[${33}m${`selectorChunkStartedAt`}\u001b[${39}m`} = ${selectorChunkStartedAt}`,
              );
          }
        }
        // catch the ending of a chunk
        else if (cssStructural && ",{".includes(chr)) {
          let sliceTo = whitespaceStartedAt || i;
          currentChunk = str.slice(selectorChunkStartedAt, sliceTo);
          DEV &&
            console.log(
              `${`\u001b[${33}m${`currentChunk`}\u001b[${39}m`} = ${JSON.stringify(
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
            match(currentChunk, strArrToMatchAgainstChunks)
          ) {
            selectorChunkCanBeDeleted = false;
            DEV &&
              console.log(
                `${`\u001b[${31}m${`██ CHUNK MATCHED ONE OF resolvedOpts.whitelist RAW STRINGS AND WON'T BE DELETED`}\u001b[${39}m`}`,
              );
            DEV &&
              console.log(
                `${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`selectorChunkCanBeDeleted`}\u001b[${39}m`} = ${selectorChunkCanBeDeleted}`,
              );
          }

          if (round === 1) {
            // delete whitespace in front of commas or more than two spaces
            // in front of opening curly braces:
            if (whitespaceStartedAt) {
              if (chr === "," && whitespaceStartedAt < i) {
                finalIndexesToDelete.push(whitespaceStartedAt, i);
                DEV &&
                  console.log(`PUSH WHITESPACE [${whitespaceStartedAt}, ${i}]`);
                nonIndentationsWhitespaceLength += i - whitespaceStartedAt;
              } else if (chr === "{" && whitespaceStartedAt < i - 1) {
                finalIndexesToDelete.push(whitespaceStartedAt, i - 1);
                DEV &&
                  console.log(
                    `PUSH WHITESPACE [${whitespaceStartedAt}, ${i - 1}]`,
                  );
                nonIndentationsWhitespaceLength += i - 1 - whitespaceStartedAt;
              }
            }

            headSelectorsArr.push(currentChunk);
            DEV &&
              console.log(
                `PUSH CHUNK "${`\u001b[${32}m${currentChunk}\u001b[${39}m`}" to headSelectorsArr which is now = ${JSON.stringify(
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
                `STARTING ${`\u001b[${33}m${`fromIndex`}\u001b[${39}m`} = ${fromIndex}`,
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
                  `\u001b[${36}m${`traverse backwards`}\u001b[${39}m`,
                );
              for (let y = selectorChunkStartedAt; y--; ) {
                totalCounter += 1;
                DEV &&
                  console.log(
                    `\u001b[${36}m${`----- str[${y}]=${str[y]}`}\u001b[${39}m`,
                  );
                if (
                  cssFlagsAt(y) & 3 ||
                  (!isWhitespace(str[y]) && str[y] !== ",")
                ) {
                  fromIndex = y + 1;
                  break;
                }
              }
              DEV &&
                console.log(
                  `SET ${`\u001b[${33}m${`fromIndex`}\u001b[${39}m`} = ${JSON.stringify(
                    fromIndex,
                    null,
                    4,
                  )}`,
                );

              // 2. if we're on the opening curly brace currently and there's
              // a space in front of it, we need to go back by 1 character
              // to retain that single space in front of opening curly.
              // Otherwise, we'd crop tightly up to curly which would be wrong.
              if (isWhitespace(str[i - 1])) {
                toIndex = i - 1;
              }
            } else if (chr === "," && isWhitespace(str[i + 1])) {
              for (let y = i + 1; y < len; y++) {
                totalCounter += 1;
                if (!isWhitespace(str[y])) {
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
                `ENDING ${`\u001b[${33}m${`fromIndex`}\u001b[${39}m`} = ${fromIndex}`,
              );
            DEV &&
              console.log(
                `ENDING ${`\u001b[${33}m${`toIndex`}\u001b[${39}m`} = ${toIndex}`,
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
                `${`\u001b[${33}m${`resToPush`}\u001b[${39}m`} = ${JSON.stringify(
                  resToPush,
                  null,
                  4,
                )}`,
              );

            (finalIndexesToDelete as any).push(...resToPush);
            DEV &&
              console.log(`PUSH CHUNK ${JSON.stringify(resToPush, null, 0)}`);

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
                  `${`\u001b[${32}m${`BTW, WHOLE LINE CAN'T BE DELETED NOW`}\u001b[${39}m`}`,
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
                  `${`\u001b[${31}m${`MERGE WITH FINAL INDEXES`}\u001b[${39}m`} - ${JSON.stringify(
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
                `WIPE ${`\u001b[${33}m${`selectorChunkStartedAt`}\u001b[${39}m`} = null`,
              );
          } else if (round === 2) {
            // the last chunk was reached so let's evaluate, can we delete
            // the whole "row":

            DEV &&
              console.log(
                `██ ${`\u001b[${33}m${`headWholeLineCanBeDeleted`}\u001b[${39}m`} = ${headWholeLineCanBeDeleted}`,
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
                  `${`\u001b[${33}m${`deleteUpTo`}\u001b[${39}m`} = ${JSON.stringify(
                    deleteUpTo,
                    null,
                    4,
                  )}`,
                );
              if ("\n\r".includes(str[lastKeptChunksCommaAt + 1])) {
                for (let y = lastKeptChunksCommaAt + 1; y < len; y++) {
                  if (!isWhitespace(str[y])) {
                    deleteUpTo = y;
                    break;
                  }
                }
              }

              finalIndexesToDelete.push(lastKeptChunksCommaAt, deleteUpTo);
              DEV &&
                console.log(
                  `PUSH COMMA [${lastKeptChunksCommaAt}, ${deleteUpTo}] (${str.slice(
                    lastKeptChunksCommaAt,
                    deleteUpTo,
                  )})`,
                );

              // reset:
              lastKeptChunksCommaAt = null;
              onlyDeletedChunksFollow = false;
              DEV &&
                console.log(
                  `RESET: lastKeptChunksCommaAt = null; onlyDeletedChunksFollow = false;`,
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
            `RESET ${`\u001b[${33}m${`selectorSinceLinebreakDetected`}\u001b[${39}m`} = false`,
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
        !stateWithinStyleTag &&
        !cssOpaque &&
        str[i] === "<" &&
        matchRight(str, i, "body", {
          i: true,
          trimBeforeMatching: true,
          cb: (char, _theRemainderOfTheString, index) => {
            // remove any whitespace after opening bracket of a body tag:
            if (round === 1) {
              if (
                char !== undefined &&
                (isWhitespace(char) || char === ">") &&
                typeof index === "number"
              ) {
                if (index - i > 5) {
                  DEV &&
                    console.log(
                      `${`\u001b[${33}m${`PUSH`}\u001b[${39}m`} [${i}, ${index}, "<body"]`,
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
            `\u001b[${36}m${`march forward to find the ending of the opening body tag:`}\u001b[${39}m`,
          );
        totalCounter += 1;
        const closingBracketAt = nextClosingBracketAt[i];
        if (closingBracketAt !== -1) {
          bodyStartedAt = closingBracketAt + 1;
          DEV &&
            console.log(
              `SET ${`\u001b[${33}m${`bodyStartedAt`}\u001b[${39}m`} = ${bodyStartedAt}`,
            );
        }
        DEV &&
          console.log(`\u001b[${36}m${`stop marching forward`}\u001b[${39}m`);
      }

      // catch the start of a style attribute within body
      // ================
      if (
        !doNothing &&
        !stateWithinStyleTag &&
        bodyAttribute?.name === "style"
      ) {
        styleAttributeStartedAt = bodyAttribute.valueStartsAt;
        DEV &&
          console.log(
            `${`\u001b[${33}m${`styleAttributeStartedAt`}\u001b[${39}m`} = ${styleAttributeStartedAt}`,
          );
      }

      // Static attributes use decoded HTML identities and retain raw spans.
      // Template-bearing values continue through the existing backend path.
      if (
        !doNothing &&
        !stateWithinStyleTag &&
        !currentlyWithinQuotes &&
        bodyAttribute?.tokens
      ) {
        const attribute = bodyAttribute;
        const tokens = attribute.tokens as HtmlAttributeToken[];
        const isClass = attribute.name === "class";
        const marker = isClass ? "." : "#";
        const attributeEndsAt =
          attribute.valueEndsAt +
          (attribute.quote && str[attribute.valueEndsAt] === attribute.quote
            ? 1
            : 0);
        if (round === 1) {
          for (const token of tokens) {
            (isClass ? bodyClassesArr : bodyIdsArr).push(
              `${marker}${token.value}`,
            );
          }
          if (attribute.nameEndsAt < attribute.equalsAt) {
            finalIndexesToDelete.push(attribute.nameEndsAt, attribute.equalsAt);
          }
          const openingAt = attribute.valueStartsAt - (attribute.quote ? 1 : 0);
          if (attribute.equalsAt + 1 < openingAt) {
            finalIndexesToDelete.push(attribute.equalsAt + 1, openingAt);
          }
        } else {
          const deleted = isClass ? bodyClassesToDeleteSet : bodyIdsToDeleteSet;
          const retained = tokens.filter(({ value }) => !deleted.has(value));
          if (!retained.length) {
            const range = expander({
              str,
              from: attribute.nameStartsAt,
              to: attributeEndsAt,
              ifRightSideIncludesThisThenCropTightly: "/>",
              wipeAllWhitespaceOnLeft: true,
            });
            finalIndexesToDelete.push(
              range[0],
              range[1],
              (str[range[0] - 1]?.trim() &&
                str[range[1]]?.trim() &&
                !"/>".includes(str[range[1]])) ||
                (str[range[1]] === "/" &&
                  attribute.hasPrecedingUnquotedAttribute)
                ? " "
                : "",
            );
          } else {
            // Remove complete semantic token runs, including encoded separators.
            // Keep one original gap between survivors so they cannot concatenate.
            let previous: HtmlAttributeToken | undefined;
            for (let tokenIndex = 0; tokenIndex < tokens.length; tokenIndex++) {
              const token = tokens[tokenIndex];
              if (deleted.has(token.value)) {
                const from = previous ? previous.to : attribute.valueStartsAt;
                while (
                  tokenIndex + 1 < tokens.length &&
                  deleted.has(tokens[tokenIndex + 1].value)
                )
                  tokenIndex++;
                const to =
                  tokenIndex + 1 === tokens.length
                    ? attribute.valueEndsAt
                    : previous
                      ? tokens[tokenIndex].to
                      : tokens[tokenIndex + 1].from;
                finalIndexesToDelete.push(from, to);
                continue;
              }
              const canonical = `${marker}${token.value}`;
              if (
                resolvedOpts.uglify &&
                !bodyIdsReferencedByForAttributesSet.has(canonical) &&
                !match(canonical, resolvedOpts.whitelist)
              ) {
                const replacement = uglifiedBySelector.get(canonical);
                if (replacement !== undefined && replacement !== canonical) {
                  finalIndexesToDelete.push(
                    token.from,
                    token.to,
                    serializeHtmlAttribute(
                      replacement.slice(1),
                      attribute.quote,
                    ),
                  );
                }
              }
              previous = token;
            }
            if (isClass) {
              // Only HTML class-list whitespace is insignificant. Preserve
              // encoded separators and every character of an exact ID value.
              const first = retained[0];
              const last = retained[retained.length - 1];
              nonIndentationsWhitespaceLength +=
                str
                  .slice(attribute.valueStartsAt, tokens[0].from)
                  .replace(/[^\t\n\f\r ]/g, "").length +
                str
                  .slice(tokens[tokens.length - 1].to, attribute.valueEndsAt)
                  .replace(/[^\t\n\f\r ]/g, "").length;
              if (first.from > attribute.valueStartsAt)
                finalIndexesToDelete.push(attribute.valueStartsAt, first.from);
              if (last.to < attribute.valueEndsAt)
                finalIndexesToDelete.push(last.to, attribute.valueEndsAt);
              for (
                let tokenIndex = 1;
                tokenIndex < tokens.length;
                tokenIndex++
              ) {
                const from = tokens[tokenIndex - 1].to;
                const to = tokens[tokenIndex].from;
                if (
                  !deleted.has(tokens[tokenIndex - 1].value) &&
                  !deleted.has(tokens[tokenIndex].value) &&
                  to > from + 1 &&
                  !str.slice(from, to).includes("&")
                ) {
                  finalIndexesToDelete.push(from + 1, to);
                  nonIndentationsWhitespaceLength += to - from - 1;
                }
              }
            }
          }
        }
        // The raw value has already been consumed, including HTML quotes.
        // Advance the first-round deletion cursor past any skipped syntax gaps.
        while (
          round === 2 &&
          round1RangesClone &&
          round1RangeIndex < round1RangesClone.length &&
          round1RangesClone[round1RangeIndex][0] < attributeEndsAt
        )
          round1RangeIndex++;
        i = attributeEndsAt - 1;
        whitespaceStartedAt = null;
        continue;
      }

      // catch the start of a class attribute within body
      // ================
      if (
        !doNothing &&
        !stateWithinStyleTag &&
        !currentlyWithinQuotes &&
        bodyAttribute?.name === "class"
      ) {
        DEV && console.log();
        let valuesStart: number | undefined = bodyAttribute.valueStartsAt;
        let quoteless = bodyAttribute.quoteless;
        let quote = bodyAttribute.quote;

        if (bodyAttribute.empty) {
          if (round === 1) {
            const calculatedRange = expander({
              str,
              from: bodyAttribute.nameStartsAt,
              to: bodyAttribute.valueStartsAt,
              ifRightSideIncludesThisThenCropTightly: "/>",
              wipeAllWhitespaceOnLeft: true,
            });
            (finalIndexesToDelete as any).push(
              ...calculatedRange,
              str[bodyAttribute.valueStartsAt] &&
                !"/>".includes(str[bodyAttribute.valueStartsAt])
                ? " "
                : "",
            );
          }
          valuesStart = undefined;
        } else if (round === 1) {
          if (bodyAttribute.nameEndsAt < bodyAttribute.equalsAt) {
            finalIndexesToDelete.push(
              bodyAttribute.nameEndsAt,
              bodyAttribute.equalsAt,
            );
          }
          const valueOpeningAt = bodyAttribute.quote
            ? bodyAttribute.valueStartsAt - 1
            : bodyAttribute.valueStartsAt;
          if (bodyAttribute.equalsAt + 1 < valueOpeningAt) {
            finalIndexesToDelete.push(
              bodyAttribute.equalsAt + 1,
              valueOpeningAt,
            );
          }
        }

        if (
          !bodyAttribute.empty &&
          valuesStart === undefined &&
          str[i + 5] === "="
        ) {
          if (str[i + 6] === '"' || str[i + 6] === "'") {
            valuesStart = i + 7;
            quote = str[i + 6] as '"' | "'";
            DEV && console.log(`SET valuesStart = ${valuesStart}`);
          } else if (characterSuitableForBodyToken(str[i + 6], true)) {
            valuesStart = i + 6;
            DEV && console.log(`SET valuesStart = ${valuesStart}`);
            quoteless = true;
          } else if (
            str[i + 6] &&
            (isWhitespace(str[i + 6]) || "/>".includes(str[i + 6]))
          ) {
            let calculatedRange = expander({
              str,
              from: i,
              to: i + 6,
              ifRightSideIncludesThisThenCropTightly: "/>",
              wipeAllWhitespaceOnLeft: true,
            });
            DEV &&
              console.log(`PUSH ${JSON.stringify(calculatedRange, null, 0)}`);
            (finalIndexesToDelete as any).push(...calculatedRange);
          }
        } else if (
          !bodyAttribute.empty &&
          valuesStart === undefined &&
          isWhitespace(str[i + 5])
        ) {
          // loop forward:
          for (let y = i + 5; y < len; y++) {
            totalCounter += 1;
            if (!isWhitespace(str[y])) {
              // 1. is it the "equals" character?
              if (str[y] === "=") {
                // 1-1. remove this gap:
                if (y > i + 5 && round === 1) {
                  DEV && console.log(`PUSH [${i + 5}, ${y}]`);
                  finalIndexesToDelete.push(i + 5, y);
                }

                // 1-2. check what's next:
                if ((str[y + 1] === '"' || str[y + 1] === "'") && str[y + 2]) {
                  // 1-2-1. we found where values start:
                  valuesStart = y + 2;
                  quote = str[y + 1] as '"' | "'";
                } else if (str[y + 1] && isWhitespace(str[y + 1])) {
                  // 1-2-2. traverse even more forward:
                  for (let z = y + 1; z < len; z++) {
                    totalCounter += 1;
                    if (!isWhitespace(str[z])) {
                      if (z > y + 1 && round === 1) {
                        DEV && console.log(`PUSH [${y + 1}, ${z}]`);
                        finalIndexesToDelete.push(y + 1, z);
                      }

                      if ((str[z] === '"' || str[z] === "'") && str[z + 1]) {
                        valuesStart = z + 1;
                        quote = str[z] as '"' | "'";
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
              //     `2332 PUSH ${JSON.stringify(calculatedRange, null, 0)}`
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
            `${`\u001b[${33}m${`valuesStart`}\u001b[${39}m`} = ${valuesStart}`,
          );

        if (valuesStart) {
          // 1. mark it
          bodyClass = resetBodyClassOrId({
            valuesStart,
            quoteless,
            quote,
            nameStart: i,
          });
          DEV &&
            console.log(
              `SET ${`\u001b[${33}m${`bodyClass`}\u001b[${39}m`} = ${JSON.stringify(
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
                `SET ${`\u001b[${33}m${`bodyItsTheFirstClassOrId`}\u001b[${39}m`} = true`,
              );
          } else if (round === 2) {
            // 2. reset the we-can-delete-whole-class/id marker:
            bodyClassOrIdCanBeDeleted = true;
            DEV &&
              console.log(
                `SET ${`\u001b[${33}m${`bodyClassOrIdCanBeDeleted`}\u001b[${39}m`} = true`,
              );
          }
        }
      }

      // catch the start of an id attribute within body
      // ================
      if (
        !doNothing &&
        !stateWithinStyleTag &&
        !currentlyWithinQuotes &&
        bodyAttribute?.name === "id"
      ) {
        DEV && console.log();
        let valuesStart: number | undefined = bodyAttribute.valueStartsAt;
        let quoteless = bodyAttribute.quoteless;
        let quote = bodyAttribute.quote;

        if (bodyAttribute.empty) {
          if (round === 1) {
            const calculatedRange = expander({
              str,
              from: bodyAttribute.nameStartsAt,
              to: bodyAttribute.valueStartsAt,
              ifRightSideIncludesThisThenCropTightly: "/>",
              wipeAllWhitespaceOnLeft: true,
            });
            (finalIndexesToDelete as any).push(
              ...calculatedRange,
              str[bodyAttribute.valueStartsAt] &&
                !"/>".includes(str[bodyAttribute.valueStartsAt])
                ? " "
                : "",
            );
          }
          valuesStart = undefined;
        } else if (round === 1) {
          if (bodyAttribute.nameEndsAt < bodyAttribute.equalsAt) {
            finalIndexesToDelete.push(
              bodyAttribute.nameEndsAt,
              bodyAttribute.equalsAt,
            );
          }
          const valueOpeningAt = bodyAttribute.quote
            ? bodyAttribute.valueStartsAt - 1
            : bodyAttribute.valueStartsAt;
          if (bodyAttribute.equalsAt + 1 < valueOpeningAt) {
            finalIndexesToDelete.push(
              bodyAttribute.equalsAt + 1,
              valueOpeningAt,
            );
          }
        }

        if (
          !bodyAttribute.empty &&
          valuesStart === undefined &&
          str[i + 2] === "="
        ) {
          if (str[i + 3] === '"' || str[i + 3] === "'") {
            valuesStart = i + 4;
            quote = str[i + 3] as '"' | "'";
            DEV && console.log(`SET valuesStart = ${valuesStart}`);
          } else if (characterSuitableForBodyToken(str[i + 3], true)) {
            valuesStart = i + 3;
            DEV && console.log(`SET valuesStart = ${valuesStart}`);
            quoteless = true;
          } else if (
            str[i + 3] &&
            (isWhitespace(str[i + 3]) || "/>".includes(str[i + 3]))
          ) {
            let calculatedRange = expander({
              str,
              from: i,
              to: i + 3,
              ifRightSideIncludesThisThenCropTightly: "/>",
              wipeAllWhitespaceOnLeft: true,
            });
            DEV &&
              console.log(`PUSH ${JSON.stringify(calculatedRange, null, 0)}`);
            (finalIndexesToDelete as any).push(...calculatedRange);
          }
        } else if (
          !bodyAttribute.empty &&
          valuesStart === undefined &&
          isWhitespace(str[i + 2])
        ) {
          // loop forward:
          for (let y = i + 2; y < len; y++) {
            totalCounter += 1;
            if (!isWhitespace(str[y])) {
              // 1. is it the "equals" character?
              if (str[y] === "=") {
                // 1-1. remove this gap:
                if (y > i + 2 && round === 1) {
                  DEV && console.log(`PUSH [${i + 2}, ${y}]`);
                  finalIndexesToDelete.push(i + 2, y);
                }

                // 1-2. check what's next:
                if ((str[y + 1] === '"' || str[y + 1] === "'") && str[y + 2]) {
                  // 1-2-1. we found where values start:
                  valuesStart = y + 2;
                  quote = str[y + 1] as '"' | "'";
                } else if (str[y + 1] && isWhitespace(str[y + 1])) {
                  // 1-2-2. traverse even more forward:
                  for (let z = y + 1; z < len; z++) {
                    totalCounter += 1;
                    if (!isWhitespace(str[z])) {
                      if (z > y + 1 && round === 1) {
                        DEV && console.log(`PUSH [${y + 1}, ${z}]`);
                        finalIndexesToDelete.push(y + 1, z);
                      }

                      if ((str[z] === '"' || str[z] === "'") && str[z + 1]) {
                        valuesStart = z + 1;
                        quote = str[z] as '"' | "'";
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
              //     `2476 PUSH ${JSON.stringify(calculatedRange, null, 0)}`
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
            `${`\u001b[${33}m${`valuesStart`}\u001b[${39}m`} = ${valuesStart}`,
          );

        if (valuesStart) {
          // 1. mark it
          bodyId = resetBodyClassOrId({
            valuesStart,
            quoteless,
            quote,
            nameStart: i,
          });
          DEV &&
            console.log(
              `SET ${`\u001b[${33}m${`bodyId`}\u001b[${39}m`} = ${JSON.stringify(
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
                `SET ${`\u001b[${33}m${`bodyItsTheFirstClassOrId`}\u001b[${39}m`} = true`,
              );
          } else if (round === 2) {
            // 2. reset the we-can-delete-whole-class/id marker:
            bodyClassOrIdCanBeDeleted = true;
            DEV &&
              console.log(
                `SET ${`\u001b[${33}m${`bodyClassOrIdCanBeDeleted`}\u001b[${39}m`} = true`,
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
              `SET ${`\u001b[${33}m${`doNothing`}\u001b[${39}m`} = true`,
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
              console.log(`PUSH ${JSON.stringify(calculatedRange, null, 4)}`);
            whitespaceStartedAt = null;
            DEV &&
              console.log(
                `SET ${`\u001b[${33}m${`whitespaceStartedAt`}\u001b[${39}m`} = null`,
              );
          } else if (whitespaceStartedAt) {
            whitespaceStartedAt = null;
          }

          // 3. set doNothingUntil to corresponding tails
          let matchedHeads = matchRightIncl(str, i, allHeads);
          DEV &&
            console.log(
              `${`\u001b[${33}m${`matchedHeads`}\u001b[${39}m`} = ${matchedHeads}`,
            );
          let findings = resolvedOpts.backend.find(
            (headsTailsObj) => headsTailsObj.heads === matchedHeads,
          );
          DEV &&
            console.log(
              `${`\u001b[${33}m${`findings`}\u001b[${39}m`} = ${JSON.stringify(
                findings,
                null,
                4,
              )}`,
            );
          if (findings?.tails) {
            doNothingUntil = findings.tails;
            DEV &&
              console.log(
                `SET ${`\u001b[${33}m${`doNothingUntil`}\u001b[${39}m`} = ${doNothingUntil}`,
              );
          }
        } else if (
          characterSuitableForBodyToken(
            chr,
            bodyClass.quoteless,
            bodyClass.quote,
            isTemplateBraceAt(str, i),
          )
        ) {
          // 1. mark the class' starting index
          bodyClass.valueStart = i;
          DEV &&
            console.log(
              `SET ${`\u001b[${33}m${`bodyClass.valueStart`}\u001b[${39}m`} = ${
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
                  `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} LEADING WHITESPACE [${
                    bodyClass.valuesStart
                  }, ${i}]`,
                );
              nonIndentationsWhitespaceLength += i - bodyClass.valuesStart;
              // 2. disable bodyItsTheFirstClassOrId flag so we won't waste resources on
              // further classes/id's:
              bodyItsTheFirstClassOrId = false;
              DEV &&
                console.log(
                  `SET ${`\u001b[${33}m${`bodyItsTheFirstClassOrId`}\u001b[${39}m`} = false`,
                );
            } else if (
              whitespaceStartedAt !== null &&
              whitespaceStartedAt < i - 1
            ) {
              // maybe there's whitespace between classes?
              finalIndexesToDelete.push(whitespaceStartedAt + 1, i);
              DEV &&
                console.log(
                  `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
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
        (!characterSuitableForBodyToken(
          chr,
          bodyClass.quoteless,
          bodyClass.quote,
          isTemplateBraceAt(str, i),
        ) ||
          (allTails && matchRightIncl(str, i, allTails)))
      ) {
        // insurance against ESP tag joined with a class
        // <table class="zzz-{{ loop.index }}">

        if (allHeads && matchRightIncl(str, i, allHeads)) {
          bodyClass.valueStart = null;
          DEV &&
            console.log(
              `SET ${`\u001b[${33}m${`bodyClass.valueStart`}\u001b[${39}m`} = null`,
            );

          bodyClass = resetBodyClassOrId();
          DEV && console.log(`RESET bodyClass`);

          let matchedHeads = matchRightIncl(str, i, allHeads);
          DEV &&
            console.log(
              `${`\u001b[${33}m${`matchedHeads`}\u001b[${39}m`} = ${matchedHeads}`,
            );
          let findings = resolvedOpts.backend.find(
            (headsTailsObj) => headsTailsObj.heads === matchedHeads,
          );
          DEV &&
            console.log(
              `${`\u001b[${33}m${`findings`}\u001b[${39}m`} = ${JSON.stringify(
                findings,
                null,
                4,
              )}`,
            );
          if (findings?.tails) {
            doNothingUntil = findings.tails;
            DEV &&
              console.log(
                `SET ${`\u001b[${33}m${`doNothingUntil`}\u001b[${39}m`} = ${doNothingUntil}`,
              );
          }
        } else {
          // Static portions beside backend expressions still decode before
          // class-list splitting; the expression itself remains on the legacy
          // opaque path. Only raw ampersands require this mapped fallback.
          const rawClass = str.slice(bodyClass.valueStart, i);
          if (rawClass.includes("&")) {
            const tokens = readHtmlAttributeTokens(
              str,
              bodyClass.valueStart,
              i,
              "class",
            );
            if (round === 1) {
              for (const token of tokens)
                bodyClassesArr.push(`.${token.value}`);
            } else {
              const retained = tokens.filter(
                ({ value }) => !bodyClassesToDeleteSet.has(value),
              );
              if (retained.length) bodyClassOrIdCanBeDeleted = false;
              let previous: HtmlAttributeToken | undefined;
              for (
                let tokenIndex = 0;
                tokenIndex < tokens.length;
                tokenIndex++
              ) {
                const token = tokens[tokenIndex];
                if (bodyClassesToDeleteSet.has(token.value)) {
                  const from = previous ? previous.to : bodyClass.valueStart;
                  while (
                    tokenIndex + 1 < tokens.length &&
                    bodyClassesToDeleteSet.has(tokens[tokenIndex + 1].value)
                  )
                    tokenIndex++;
                  const to =
                    tokenIndex + 1 === tokens.length
                      ? i
                      : previous
                        ? tokens[tokenIndex].to
                        : tokens[tokenIndex + 1].from;
                  finalIndexesToDelete.push(
                    from,
                    to,
                    str[from - 1]?.trim() &&
                      str[to]?.trim() &&
                      ((allTails && matchLeft(str, from, allTails)) ||
                        (allHeads && matchRightIncl(str, to, allHeads)))
                      ? " "
                      : "",
                  );
                } else {
                  const canonical = `.${token.value}`;
                  const replacement = uglifiedBySelector.get(canonical);
                  if (
                    resolvedOpts.uglify &&
                    replacement !== undefined &&
                    replacement !== canonical &&
                    !match(canonical, resolvedOpts.whitelist)
                  ) {
                    finalIndexesToDelete.push(
                      token.from,
                      token.to,
                      serializeHtmlAttribute(
                        replacement.slice(1),
                        bodyClass.quote,
                      ),
                    );
                  }
                  previous = token;
                }
              }
            }
          } else {
            // normal operations can continue
            const carvedClass = rawClass;
            const canonicalClass = rawClass;
            DEV &&
              console.log(
                `CARVED OUT BODY CLASS "${`\u001b[${32}m${carvedClass}\u001b[${39}m`}"`,
              );
            DEV &&
              console.log(
                `██ ${`\u001b[${33}m${`allTails`}\u001b[${39}m`} = ${JSON.stringify(
                  allTails,
                  null,
                  4,
                )}`,
              );
            // DEV && console.log(
            //   `2716 R1 = ${!!(allTails && matchRightIncl(str, i, allTails))}`
            // );
            // DEV && console.log(`2718 R2 = ${!!matchRightIncl(str, i, allTails)}`);
            // DEV && console.log(
            //   `2720 R3 = ${!!(allHeads && matchRightIncl(str, i, allHeads))}`
            // );

            if (round === 1) {
              bodyClassesArr.push(`.${canonicalClass}`);
              DEV &&
                console.log(
                  `\u001b[${35}m${`PUSH`}\u001b[${39}m slice ".${carvedClass}" to bodyClassesArr which becomes:\n${JSON.stringify(
                    bodyClassesArr,
                    null,
                    0,
                  )}`,
                );
            }
            // round 2
            else if (
              bodyClass.valueStart != null &&
              bodyClassesToDeleteSet.has(canonicalClass)
            ) {
              // submit this class for deletion
              DEV &&
                console.log(
                  `${`\u001b[${33}m${`carvedClass`}\u001b[${39}m`} = ${carvedClass}`,
                );
              DEV &&
                console.log(
                  `before expanding, ${`\u001b[${33}m${`bodyClass.valueStart`}\u001b[${39}m`} = ${JSON.stringify(
                    bodyClass.valueStart,
                    null,
                    0,
                  )}`,
                );

              let expandedRange = expander({
                str,
                from: bodyClass.valueStart,
                to:
                  bodyClass.quoteless && chr === ">" && str[i - 1] === "/"
                    ? i - 1
                    : i,
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
                    matchRightIncl(
                      str,
                      expandedRange[1],
                      allHeads as string[],
                    )))
              ) {
                whatToInsert = " ";
              }

              (finalIndexesToDelete as any).push(
                ...expandedRange,
                whatToInsert,
              );
              DEV &&
                console.log(
                  `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
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
                  `SET ${`\u001b[${33}m${`bodyClassOrIdCanBeDeleted`}\u001b[${39}m`} = false`,
                );

              // 2. uglify?
              if (
                resolvedOpts.uglify &&
                !(
                  Array.isArray(resolvedOpts.whitelist) &&
                  resolvedOpts.whitelist.length &&
                  match(`.${canonicalClass}`, resolvedOpts.whitelist)
                )
              ) {
                const replacement = uglifiedBySelector.get(
                  `.${canonicalClass}`,
                );
                if (
                  replacement !== undefined &&
                  replacement !== `.${canonicalClass}`
                ) {
                  finalIndexesToDelete.push(
                    bodyClass.valueStart,
                    i,
                    serializeHtmlAttribute(
                      replacement.slice(1),
                      bodyClass.quote,
                    ),
                  );
                }
              }
            }
          }

          bodyClass.valueStart = null;
          DEV &&
            console.log(
              `SET ${`\u001b[${33}m${`bodyClass.valueStart`}\u001b[${39}m`} = null`,
            );
        }
      }

      // catch the ending of an id name
      // ================
      if (
        !doNothing &&
        bodyId?.valueStart !== null &&
        i > bodyId.valueStart &&
        (!characterSuitableForBodyToken(
          chr,
          bodyId.quoteless,
          bodyId.quote,
          isTemplateBraceAt(str, i),
        ) ||
          (allTails && matchRightIncl(str, i, allTails)))
      ) {
        DEV && console.log();
        let carvedId = str.slice(bodyId.valueStart, i);
        const canonicalId = decodeHtmlEntities(carvedId, {
          context: "attribute",
        });
        DEV &&
          console.log(
            `CARVED OUT BODY ID "${`\u001b[${32}m${carvedId}\u001b[${39}m`}"`,
          );
        if (round === 1) {
          bodyIdsArr.push(`#${canonicalId}`);
          DEV &&
            console.log(
              `\u001b[${35}m${`PUSH`}\u001b[${39}m slice "${`#${carvedId}`}" to bodyIdsArr which is now:\n${JSON.stringify(
                bodyIdsArr,
                null,
                4,
              )}`,
            );
        }
        // round 2
        else if (
          bodyId.valueStart != null &&
          bodyIdsToDeleteSet.has(canonicalId)
        ) {
          // submit this id for deletion
          DEV &&
            console.log(
              `${`\u001b[${33}m${`carvedId`}\u001b[${39}m`} = ${carvedId}`,
            );
          DEV &&
            console.log(
              `before expanding, ${`\u001b[${33}m${`bodyId.valueStart`}\u001b[${39}m`} = ${JSON.stringify(
                bodyId.valueStart,
                null,
                4,
              )}`,
            );

          let expandedRange = expander({
            str,
            from: bodyId.valueStart,
            to:
              bodyId.quoteless && chr === ">" && str[i - 1] === "/" ? i - 1 : i,
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
            DEV && console.log(`REDUCE expandedRange[0] by one`);
          }

          (finalIndexesToDelete as any).push(...expandedRange);
          DEV &&
            console.log(
              `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
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
              `SET ${`\u001b[${33}m${`bodyClassOrIdCanBeDeleted`}\u001b[${39}m`} = false`,
            );
          DEV &&
            console.log(
              `${`\u001b[${33}m${`carvedId`}\u001b[${39}m`} = ${JSON.stringify(
                carvedId,
                null,
                4,
              )}`,
            );
          DEV &&
            console.log(
              `resolvedOpts.whitelist = ${JSON.stringify(
                resolvedOpts.whitelist,
                null,
                4,
              )}`,
            );
          DEV &&
            console.log(
              `match(#${carvedId}, resolvedOpts.whitelist) = ${match(
                `#${carvedId}`,
                resolvedOpts.whitelist,
              )}`,
            );

          // 2. uglify?
          if (
            resolvedOpts.uglify &&
            !bodyIdsReferencedByForAttributesSet.has(`#${canonicalId}`) &&
            !(
              Array.isArray(resolvedOpts.whitelist) &&
              resolvedOpts.whitelist.length &&
              match(`#${canonicalId}`, resolvedOpts.whitelist)
            )
          ) {
            const replacement = uglifiedBySelector.get(`#${canonicalId}`);
            if (
              replacement !== undefined &&
              replacement !== `#${canonicalId}`
            ) {
              finalIndexesToDelete.push(
                bodyId.valueStart,
                i,
                serializeHtmlAttribute(replacement.slice(1), bodyId.quote),
              );
            }
          }
        }

        bodyId.valueStart = null;
        DEV &&
          console.log(
            `SET ${`\u001b[${33}m${`bodyId.valueStart`}\u001b[${39}m`} = null`,
          );
      }

      // body: stop the class attribute's recording if closing single/double quote encountered
      // ================
      // TODO: replace chr check against any quote with exact quote that was previously recorded on opening
      if (
        !doNothing &&
        bodyClass.valuesStart != null &&
        ((!bodyClass.quoteless && chr === bodyClass.quote) ||
          (bodyClass.quoteless &&
            !characterSuitableForBodyToken(str[i], true))) &&
        i >= bodyClass.valuesStart
      ) {
        DEV && console.log();
        if (i === bodyClass.valuesStart) {
          DEV && console.log(`EMPTY CLASS DETECTED!`);
          if (round === 1) {
            DEV &&
              console.log(
                `PUSH ${JSON.stringify(
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
            const attributeEndsAt =
              bodyClass.quoteless && chr === ">" && str[i - 1] === "/"
                ? i - 1
                : `"'`.includes(str[i])
                  ? i + 1
                  : i;
            DEV &&
              console.log(
                `${`\u001b[${33}m${`initial range`}\u001b[${39}m`}: [${
                  bodyClass.nameStart
                }, ${attributeEndsAt}]`,
              );
            let expandedRange = expander({
              str,
              from: bodyClass.nameStart as number,
              to: attributeEndsAt,
              ifRightSideIncludesThisThenCropTightly: "/>",
              wipeAllWhitespaceOnLeft: true,
            });
            DEV &&
              console.log(
                `${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`expandedRange`}\u001b[${39}m`}: ${JSON.stringify(
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
                  `SET whatToInsert = " " because str[expandedRange[0] - 1] = str[${
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
                `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
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
                `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} TRAILING WHITESPACE [${whitespaceStartedAt}, ${i}]`,
              );
          }
        }

        // 2. reset the marker
        bodyClass = resetBodyClassOrId();
        DEV &&
          console.log(`RESET ${`\u001b[${33}m${`bodyClass`}\u001b[${39}m`}`);
      }

      // body: stop the id attribute's recording if closing single/double quote encountered
      // ================
      // TODO: replace chr check against any quote with exact quote that was previously
      if (
        !doNothing &&
        bodyId.valuesStart !== null &&
        ((!bodyId.quoteless && chr === bodyId.quote) ||
          (bodyId.quoteless && !characterSuitableForBodyToken(str[i], true))) &&
        i >= bodyId.valuesStart
      ) {
        DEV && console.log();
        if (i === bodyId.valuesStart) {
          DEV && console.log(`EMPTY ID DETECTED!`);
          if (round === 1) {
            DEV &&
              console.log(
                `[bodyId.nameStart=${bodyId.nameStart}, i+1=${i + 1}] => [${
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
                `PUSH ${JSON.stringify(
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
              from: bodyId.nameStart as number,
              to:
                bodyId.quoteless && chr === ">" && str[i - 1] === "/"
                  ? i - 1
                  : i + 1,
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
              DEV && console.log(`SET whatToInsert = " "`);
            }

            (finalIndexesToDelete as any).push(...expandedRange, whatToInsert);
            DEV &&
              console.log(
                `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
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
                `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} TRAILING WHITESPACE [${whitespaceStartedAt}, ${i}]`,
              );
          }
        }

        // reset the marker in either case
        bodyId = resetBodyClassOrId();
        DEV && console.log(`RESET ${`\u001b[${33}m${`bodyId`}\u001b[${39}m`}`);
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
              `SET ${`\u001b[${33}m${`doNothing`}\u001b[${39}m`} = true`,
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
              console.log(`PUSH ${JSON.stringify(calculatedRange, null, 4)}`);
            whitespaceStartedAt = null;
            DEV &&
              console.log(
                `SET ${`\u001b[${33}m${`whitespaceStartedAt`}\u001b[${39}m`} = null`,
              );
          } else if (whitespaceStartedAt) {
            whitespaceStartedAt = null;
          }

          // 3. set doNothingUntil to corresponding tails
          let matchedHeads = matchRightIncl(str, i, allHeads);
          DEV &&
            console.log(
              `${`\u001b[${33}m${`matchedHeads`}\u001b[${39}m`} = ${matchedHeads}`,
            );
          let findings = resolvedOpts.backend.find(
            (headsTailsObj) => headsTailsObj.heads === matchedHeads,
          );
          DEV &&
            console.log(
              `${`\u001b[${33}m${`findings`}\u001b[${39}m`} = ${JSON.stringify(
                findings,
                null,
                4,
              )}`,
            );
          if (findings?.tails) {
            doNothingUntil = findings.tails;
            DEV &&
              console.log(
                `SET ${`\u001b[${33}m${`doNothingUntil`}\u001b[${39}m`} = ${doNothingUntil}`,
              );
          }
        } else if (
          characterSuitableForBodyToken(
            chr,
            bodyId.quoteless,
            bodyId.quote,
            isTemplateBraceAt(str, i),
          )
        ) {
          // 1. mark the id's starting index
          bodyId.valueStart = i;
          DEV &&
            console.log(
              `SET ${`\u001b[${33}m${`bodyId.valueStart`}\u001b[${39}m`} = ${
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
                  `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                    bodyId.valuesStart
                  }, ${i}]`,
                );
              nonIndentationsWhitespaceLength += i - bodyId.valuesStart;
              // 2. disable bodyItsTheFirstClassOrId flag so we won't waste resources on
              // further classes/id's:
              bodyItsTheFirstClassOrId = false;
              DEV &&
                console.log(
                  `SET ${`\u001b[${33}m${`bodyItsTheFirstClassOrId`}\u001b[${39}m`} = false`,
                );
            } else if (
              whitespaceStartedAt !== null &&
              whitespaceStartedAt < i - 1
            ) {
              // maybe there's whitespace between classes?
              finalIndexesToDelete.push(whitespaceStartedAt + 1, i);
              DEV &&
                console.log(
                  `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
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
      if (!doNothing && !cssOpaque && round === 1) {
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
              `${`\u001b[${33}m${`str.slice(commentStartedAt, i)`}\u001b[${39}m`} = ${JSON.stringify(
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
                `SET ${`\u001b[${33}m${`canDelete`}\u001b[${39}m`} = ${canDelete}`,
              );
          }
          usedOnce = true;
          DEV &&
            console.log(
              `SET \u001b[${33}m${`usedOnce`}\u001b[${39}m = ${usedOnce}`,
            );
        }

        // 2. catch the HTML comments' ending
        // ==================================
        if (commentStartedAt !== null && str[i] === ">") {
          DEV && console.log(`II.`);
          DEV &&
            console.log(
              `BTW, ${`\u001b[${33}m${`canDelete`}\u001b[${39}m`} = ${JSON.stringify(
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
                  `PUSH COMMENT ${JSON.stringify(calculatedRange, null, 0)}`,
                );
              (finalIndexesToDelete as any).push(...calculatedRange);
              commentsLength += calculatedRange[1] - calculatedRange[0];
            }

            // reset the markers:
            commentStartedAt = null;
            bogusHTMLComment = undefined;
            DEV &&
              console.log(
                `RESET ${`\u001b[${33}m${`commentStartedAt`}\u001b[${39}m`} = null; ${`\u001b[${33}m${`bogusHTMLComment`}\u001b[${39}m`} = undefined`,
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
                  `PUSH BOGUS COMMENT ${JSON.stringify(
                    calculatedRange,
                    null,
                    0,
                  )}`,
                );
              (finalIndexesToDelete as any).push(...calculatedRange);
              commentsLength += calculatedRange[1] - calculatedRange[0];
            }

            // reset the markers:
            commentStartedAt = null;
            bogusHTMLComment = undefined;
            DEV &&
              console.log(
                `RESET ${`\u001b[${33}m${`commentStartedAt`}\u001b[${39}m`} = null; ${`\u001b[${33}m${`bogusHTMLComment`}\u001b[${39}m`} = undefined`,
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
            DEV && console.log(`III. catch HTML comments clauses`);
            DEV &&
              console.log(
                `${`\u001b[${33}m${`commentNearlyStartedAt`}\u001b[${39}m`} = ${JSON.stringify(
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
                  { i: true, trimBeforeMatching: true },
                )
              )
            ) {
              commentStartedAt = i;
              usedOnce = false;
              canDelete = true;
              DEV &&
                console.log(
                  `SET ${`\u001b[${33}m${`commentStartedAt`}\u001b[${39}m`} = ${commentStartedAt}; ${`\u001b[${33}m${`usedOnce`}\u001b[${39}m`} = ${usedOnce}; ${`\u001b[${33}m${`canDelete`}\u001b[${39}m`} = ${canDelete};`,
                );
            }

            // 3.2. detect, is it healthy or bogus comment (bogusHTMLComment = true/false)
            bogusHTMLComment = !(str[i + 2] === "-" && str[i + 3] === "-");
            DEV &&
              console.log(
                `SET ${`\u001b[${33}m${`bogusHTMLComment`}\u001b[${39}m`} = ${bogusHTMLComment}`,
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
      if (!doNothing && cssStructural && chr === "}" && curliesDepth) {
        curliesDepth -= 1;
        DEV && console.log(`REDUCE curliesDepth now = ${curliesDepth}`);
      }

      // pinpoint opening curly braces (in head styles), but not @media's.
      // ================
      if (
        !doNothing &&
        cssStructural &&
        chr === "{" &&
        checkingInsideCurlyBraces
      ) {
        if (!insideCurlyBraces) {
          // 1. flip the flag
          insideCurlyBraces = true;
          DEV &&
            console.log(
              `SET ${`\u001b[${33}m${`insideCurlyBraces`}\u001b[${39}m`} = true`,
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
                `PUSH LEADING WHITESPACE [${whitespaceStartedAt}, ${i}]`,
              );
          }
        } else {
          curliesDepth += 1;
          DEV && console.log(`BUMP curliesDepth now = ${curliesDepth}`);
        }
      }

      // catch the whitespace
      if (!doNothing) {
        if (chrIsWhitespace && !cssOpaque) {
          if (whitespaceStartedAt === null) {
            whitespaceStartedAt = i;
            // DEV && console.log(
            //   `3610 SET ${`\u001b[${33}m${`whitespaceStartedAt`}\u001b[${39}m`} = ${whitespaceStartedAt}`
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
        round1RangeIndex < round1RangesClone.length &&
        i === round1RangesClone[round1RangeIndex][0]
      ) {
        // offset index, essentially "jumping over" what was submitted for deletion in round 1
        DEV && console.log("3669\n");
        const temp = round1RangesClone[round1RangeIndex];
        round1RangeIndex += 1;
        DEV &&
          console.log(
            `${`\u001b[${33}m${`temp`}\u001b[${39}m`} = ${JSON.stringify(
              temp,
              null,
              0,
            )}`,
          );
        if (temp && temp[1] - 1 > i) {
          DEV &&
            console.log(
              `\u001b[${31}m${`██ OFFSET MAIN INDEX FROM ${i} TO ${
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
            `${`\u001b[${33}m${`commentNearlyStartedAt`}\u001b[${39}m`} = null`,
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
              `I ${`\u001b[${33}m${`temp`}\u001b[${39}m`} = ${JSON.stringify(
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
                `II. ${`\u001b[${33}m${`temp`}\u001b[${39}m`} = ${JSON.stringify(
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
              `SET ${`\u001b[${33}m${`i`}\u001b[${39}m`} = ${JSON.stringify(
                i,
                null,
                4,
              )}; THEN ${`\u001b[${32}m${`STEP OUT`}\u001b[${39}m`}`,
            );
        }
      }

      // LOGGING:
      // ================

      // NOTE: logging switch below
      /* if (round === 1) {
        if (stateWithinBody) {
          DEV &&
            console.log(
              `3746 bodyClass.valueStart=${bodyClass.valueStart}\nbodyId.valueStart=${bodyId.valueStart}\nbodyClass.valuesStart=${bodyClass.valuesStart}${bodyId.valuesStart}`
            );
          // logging:
          // DEV && console.log(
          //   `3750 ${`\u001b[${90}m${`bodyClassOrIdCanBeDeleted`}\u001b[${39}m`} = ${JSON.stringify(
          //     bodyClassOrIdCanBeDeleted,
          //     null,
          //     0
          //   )}`
          // );
          // DEV && console.log(
          //   `3757 ${`\u001b[${90}m${`whitespaceStartedAt`}\u001b[${39}m`} = ${JSON.stringify(
          //     whitespaceStartedAt,
          //     null,
          //     0
          //   )}`
          // );
          DEV &&
            console.log(
              `3765 bodyItsTheFirstClassOrId=${bodyItsTheFirstClassOrId}\nheadWholeLineCanBeDeleted=${headWholeLineCanBeDeleted}`
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
      bodyIdsReferencedByForAttributes = bodyIdsArr.filter((id) =>
        idsReferencedByForAttributesSet.has(id.slice(1)),
      );
      bodyIdsReferencedByForAttributesSet = new Set(
        bodyIdsReferencedByForAttributes,
      );

      DEV && console.log(`\u001b[${35}m${`\nAFTER STEP 1:`}\u001b[${39}m`);
      DEV &&
        console.log(
          `headSelectorsArr = ${JSON.stringify(headSelectorsArr, null, 4)}`,
        );
      DEV &&
        console.log(
          `bodyClassesArr = ${JSON.stringify(bodyClassesArr, null, 4)}`,
        );
      DEV && console.log(`bodyIdsArr = ${JSON.stringify(bodyIdsArr, null, 4)}`);
      DEV &&
        console.log(
          `allClassesAndIdsWithinBody = ${JSON.stringify(
            allClassesAndIdsWithinBody,
            null,
            4,
          )}`,
        );
      DEV &&
        console.log(
          `\nopts.whitelist = ${JSON.stringify(
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
          `\n\n███████████████████████████████████████\n\n${`\u001b[${32}m${`starting headSelectorsCount`}\u001b[${39}m`} = ${JSON.stringify(
            headSelectorsCount,
            null,
            4,
          )}`,
        );

      const protectedSelectors = nestedSelectors;
      const canonicalSelectorsByHeadChunk = headSelectorsArr.map((chunk) =>
        extractCanonicalSelectors(chunk, protectedSelectors),
      );
      canonicalSelectorsByHeadChunk.forEach((selectors) => {
        selectors.forEach((selector) => {
          if (hasOwnProp(headSelectorsCount, selector)) {
            headSelectorsCount[selector] += 1;
          } else {
            headSelectorsCount[selector] = 1;
          }
        });
      });
      DEV &&
        console.log(
          `\nheadSelectorsCount = ${JSON.stringify(
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
        canonicalSelectorsByHeadChunk.reduce(
          (arr, selectors) => arr.concat(selectors),
          [],
        ),
      );

      countBeforeCleaning = allClassesAndIdsWithinHead.length;

      DEV &&
        console.log(
          `${`\u001b[${33}m${`AFTER TRAVERSAL,\nallClassesAndIdsWithinHead`}\u001b[${39}m`} = ${JSON.stringify(
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

      const preppedHeadSelectorsArr: string[] = [];
      const preppedCanonicalSelectors: string[][] = [];
      const allClassesAndIdsWithinBodySet = new Set(allClassesAndIdsWithinBody);
      let deletedFromHeadArr = [];
      DEV &&
        console.log(
          `\u001b[${36}m${`LOOP preppedHeadSelectorsArr = ${JSON.stringify(
            preppedHeadSelectorsArr,
            null,
            4,
          )}`}\u001b[${39}m`,
        );
      for (let y = 0; y < headSelectorsArr.length; y++) {
        totalCounter += 1;
        DEV && console.log(`\u001b[${36}m${`------------`}\u001b[${39}m`);
        DEV &&
          console.log(
            `${`\u001b[${36}m${`██`}\u001b[${39}m`} headSelectorsArr[${y}] = ${JSON.stringify(
              headSelectorsArr[y],
              null,
              4,
            )}`,
          );
        const temp = canonicalSelectorsByHeadChunk[y];

        // intentional loose comparison !=, that's existy():
        if (
          headSelectorsArr[y] != null &&
          (!protectedSelectors.size ||
            !temp.some((selector) => protectedSelectors.has(selector))) &&
          !temp.every((el) => allClassesAndIdsWithinBodySet.has(el))
        ) {
          DEV &&
            console.log(
              `PUSH to deletedFromHeadArr[] [${JSON.stringify(temp, null, 4)}]`,
            );
          deletedFromHeadArr.push(...temp);
          DEV &&
            console.log(
              `deletedFromHeadArr becomes = ${JSON.stringify(
                deletedFromHeadArr,
                null,
                4,
              )}`,
            );
        } else {
          preppedHeadSelectorsArr.push(headSelectorsArr[y]);
          preppedCanonicalSelectors.push(temp);
        }
      }
      DEV && console.log(`\u001b[${36}m${`------------`}\u001b[${39}m`);

      deletedFromHeadArr = uniq(
        pull(deletedFromHeadArr, resolvedOpts.whitelist),
      );

      let preppedAllClassesAndIdsWithinHead: string[];
      if (preppedCanonicalSelectors.length) {
        preppedAllClassesAndIdsWithinHead = preppedCanonicalSelectors.reduce(
          (acc, selectors) => acc.concat(selectors),
          [],
        );
        DEV &&
          console.log(
            `${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`preppedAllClassesAndIdsWithinHead`}\u001b[${39}m`} = ${JSON.stringify(
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
          `OLD ${`\u001b[${32}m${`headCssToDelete`}\u001b[${39}m`} = ${JSON.stringify(
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
      ).filter(
        (selector) => !bodyIdsReferencedByForAttributesSet.has(selector),
      );
      DEV &&
        console.log(
          `${`\u001b[${32}m${`bodyCssToDelete`}\u001b[${39}m`} = ${JSON.stringify(
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
      if (protectedSelectors.size) {
        headCssToDelete = headCssToDelete.filter(
          (selector) => !protectedSelectors.has(selector),
        );
      }
      headCssToDeleteSet = new Set(headCssToDelete);
      DEV &&
        console.log(
          `NEW ${`\u001b[${32}m${`headCssToDelete`}\u001b[${39}m`} = ${JSON.stringify(
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
          `bodyClassesToDelete = ${JSON.stringify(
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
          `${`\u001b[${33}m${`bodyIdsToDelete`}\u001b[${39}m`} = ${JSON.stringify(
            bodyIdsToDelete,
            null,
            4,
          )}`,
        );

      DEV &&
        console.log(
          `CURRENT RANGES AFTER STEP 1: ${JSON.stringify(
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
          `${`\u001b[${33}m${`allClassesAndIdsThatWereCompletelyDeletedFromHead`}\u001b[${39}m`} = ${JSON.stringify(
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
      bodyClassesToDeleteSet = new Set(bodyClassesToDelete);
      bodyIdsToDeleteSet = new Set(bodyIdsToDelete);
      DEV &&
        console.log(
          `${`\u001b[${33}m${`bodyClassesToDelete`}\u001b[${39}m`} = ${JSON.stringify(
            bodyClassesToDelete,
            null,
            4,
          )}`,
        );

      let allClassesAndIdsWithinBodyThatWereWhitelisted = filterMatches(
        allClassesAndIdsWithinBody,
        resolvedOpts.whitelist,
      );
      DEV &&
        console.log(
          `${`\u001b[${31}m${`██ ██ ██`}\u001b[${39}m`} ${`\u001b[${33}m${`allClassesAndIdsWithinBodyThatWereWhitelisted`}\u001b[${39}m`} = ${JSON.stringify(
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
          `${`\u001b[${90}m${`bodyCssToDelete`}\u001b[${39}m`} = ${JSON.stringify(
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
        uglifiedBySelector = new Map(
          allClassesAndIdsWithinHeadFinal.map((selector, index) => [
            selector,
            allClassesAndIdsWithinHeadFinalUglified[index],
          ]),
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
                !bodyIdsReferencedByForAttributesSet.has(arr[0]) &&
                !resolvedOpts.whitelist.some((whitelistVal) =>
                  match(arr[0], whitelistVal),
                ),
            ) as StringifiedLegend[])
        : null;

      DEV &&
        console.log(
          `AFTER STEP 1, ${`\u001b[${33}m${`finalIndexesToDelete.current()`}\u001b[${39}m`} =
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
          `${`\u001b[${33}m${`uglified`}\u001b[${39}m`} = ${JSON.stringify(
            uglified,
            null,
            4,
          )}`,
        );

      const currentRound1Ranges = finalIndexesToDelete.current();
      // Round two mutates the accumulator, so retain an independent snapshot.
      round1RangesClone = currentRound1Ranges
        ? Array.from(currentRound1Ranges)
        : null;

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
          `allClassesAndIdsWithinHeadFinal = ${JSON.stringify(
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
  let currentFinalRanges = finalIndexesToDelete.current();

  DEV &&
    console.log(
      `BEFORE 3RD STEP PREP ${`\u001b[${33}m${`str`}\u001b[${39}m`} = "${str}"`,
    );

  DEV &&
    console.log(
      `AFTER 3RD ROUND, finalIndexesToDelete.current() = ${JSON.stringify(
        currentFinalRanges,
        null,
        4,
      )}`,
    );
  if (str.length && currentFinalRanges) {
    let finalRanges = currentFinalRanges;
    DEV &&
      console.log(
        `BEFORE CLEANING, ${`\u001b[${33}m${`finalRanges`}\u001b[${39}m`} = ${JSON.stringify(finalRanges, null, 4)}`,
      );
    // run the last check, if any of the ranges span between
    // comma and opening curly bracket, extend the range left,
    // to include the comma.
    finalRanges = finalRanges.map((range) => {
      DEV &&
        console.log(
          `███████████████████████████████████████ processing: ${JSON.stringify(range, null, 4)}`,
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
            `range[2]=${JSON.stringify(range[2])} charOnTheLeft = ${str[charOnTheLeft || 0]}(${charOnTheLeft}); charOnTheRight = ${str[charOnTheRight || 0]}(${charOnTheRight})`,
          );

        if (
          str[charOnTheLeft] === "," &&
          !(cssFlagsAt(charOnTheLeft) & 3) &&
          str[charOnTheRight] === "{" &&
          !(cssFlagsAt(charOnTheRight) & 3)
        ) {
          DEV &&
            console.log(
              `${`\u001b[${31}m${`CHANGED TO [${charOnTheLeft}, ${charOnTheRight}, ${JSON.stringify(range[2])}]`}\u001b[${39}m`}`,
            );
          return [charOnTheLeft, charOnTheRight, range[2]];
        }
      }
      return range;
    });
    DEV &&
      console.log(
        `AFTER CLEANING, ${`\u001b[${33}m${`finalRanges`}\u001b[${39}m`} = ${JSON.stringify(finalRanges, null, 4)}`,
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
      `${`\u001b[${33}m${`startingPercentageDone`}\u001b[${39}m`} = ${JSON.stringify(
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
  DEV && console.log("4467\n\n");
  DEV && console.log(`string after ROUND 3:\n${str}\n\n`);

  // final fixing:
  // =============

  // Remove wrappers only in actual style contents, never in strings or URLs.
  str = removeEmptyCssWrappers(str, trailingNewline || "\n");
  totalCounter += str.length;
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

  // Empty style tags were removed by the same HTML-bounded cleanup.
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
  if (resolvedOpts.removeHTMLComments) {
    str = str.replace(emptyCondCommentRegex(), "");
  }
  totalCounter += str.length;
  if (tempLen !== str.length) {
    commentsLength += tempLen - str.length;
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
  tempLen = str.length;
  str = crush(str, resolvedOpts.htmlCrushOpts).result;

  if (tempLen !== str.length) {
    nonIndentationsWhitespaceLength += Math.max(tempLen - str.length, 0);
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
      (isWhitespace(str[0]) || isWhitespace(str[str.length - 1])) &&
      str.length !== str.trim().length
    ) {
      nonIndentationsWhitespaceLength += str.length - str.trim().length;
    }
    str = str.trimLeft();
  }

  // Keep the established leading-space cleanup inside real HTML attributes.
  // A global replacement would also rewrite CSS strings or other attribute data.
  if (/ class=["'] /.test(str)) {
    const leadingSpaces: Range[] = [];
    for (const attribute of collectBodyAttributes(
      str,
      resolvedOpts.backend,
    ).values()) {
      if (
        attribute.name === "class" &&
        attribute.quote &&
        str[attribute.valueStartsAt] === " "
      ) {
        leadingSpaces.push([
          attribute.valueStartsAt,
          attribute.valueStartsAt + 1,
        ]);
      }
    }
    str = rApply(str, leadingSpaces);
  }

  DEV &&
    console.log(
      `${`\u001b[${33}m${`allClassesAndIdsWithinHeadFinal`}\u001b[${39}m`} = ${JSON.stringify(
        allClassesAndIdsWithinHeadFinal,
        null,
        4,
      )}`,
    );

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
      percentageReducedOfOriginal: originalLength
        ? Math.round(
            (Math.max(originalLength - str.length, 0) * 100) / originalLength,
          )
        : 0,
      nonIndentationsWhitespaceLength: Math.max(
        nonIndentationsWhitespaceLength,
        0,
      ),
      nonIndentationsTakeUpPercentageOfOriginal:
        originalLength && Math.max(nonIndentationsWhitespaceLength, 0)
          ? Math.round(
              (Math.max(nonIndentationsWhitespaceLength, 0) * 100) /
                originalLength,
            )
          : 0,
      commentsLength,
      commentsTakeUpPercentageOfOriginal:
        originalLength && commentsLength
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

/**
 * Remove unused CSS and uglify the remaining class and ID selectors.
 */
function uglify(str: string, opts?: UglifyOpts | null): Res {
  if (typeof str !== "string") {
    throw new TypeError(
      `email-comb/uglify(): [THROW_ID_01] Input must be string! Currently it's ${typeof str}`,
    );
  }
  if (opts !== null && opts !== undefined && !isObj(opts)) {
    throw new TypeError(
      `email-comb/uglify(): [THROW_ID_02] Options, second input argument, must be a plain object! Currently it's ${typeof opts}, equal to: ${formatDiagnosticValue(opts, 4)}`,
    );
  }

  return comb(str, { ...opts, uglify: true });
}

function extractIdsReferencedByForAttributes(str: string): string[] {
  if (!labelOrOutputOpeningTagRegex.test(str)) {
    return [];
  }

  let result: string[] = [];

  for (let i = 0; i < str.length; i++) {
    if (str[i] !== "<") {
      continue;
    }

    let tagNameLength = 0;
    if (
      str.slice(i + 1, i + 6).toLowerCase() === "label" &&
      (isHtmlAsciiWhitespace(str[i + 6]) || [">", "/"].includes(str[i + 6]))
    ) {
      tagNameLength = 5;
    } else if (
      str.slice(i + 1, i + 7).toLowerCase() === "output" &&
      (isHtmlAsciiWhitespace(str[i + 7]) || [">", "/"].includes(str[i + 7]))
    ) {
      tagNameLength = 6;
    } else {
      continue;
    }

    let quote: '"' | "'" | null = null;
    let tagEnd = i + tagNameLength + 1;
    for (; tagEnd < str.length; tagEnd++) {
      if (quote) {
        if (str[tagEnd] === quote) {
          quote = null;
        }
      } else if (str[tagEnd] === '"' || str[tagEnd] === "'") {
        quote = str[tagEnd] as '"' | "'";
      } else if (str[tagEnd] === ">") {
        break;
      }
    }
    if (tagEnd >= str.length) {
      break;
    }

    let cursor = i + tagNameLength + 1;
    let forAttributeSeen = false;
    while (cursor < tagEnd) {
      while (
        cursor < tagEnd &&
        (isHtmlAsciiWhitespace(str[cursor]) || str[cursor] === "/")
      ) {
        cursor += 1;
      }

      const attributeNameStartsAt = cursor;
      while (
        cursor < tagEnd &&
        !isHtmlAsciiWhitespace(str[cursor]) &&
        !["/", "="].includes(str[cursor])
      ) {
        cursor += 1;
      }
      if (attributeNameStartsAt === cursor) {
        cursor += 1;
        continue;
      }

      const attributeName = str
        .slice(attributeNameStartsAt, cursor)
        .toLowerCase();
      while (cursor < tagEnd && isHtmlAsciiWhitespace(str[cursor])) {
        cursor += 1;
      }

      let value: string | null = null;
      if (str[cursor] === "=") {
        cursor += 1;
        while (cursor < tagEnd && isHtmlAsciiWhitespace(str[cursor])) {
          cursor += 1;
        }

        if (str[cursor] === '"' || str[cursor] === "'") {
          const valueQuote = str[cursor];
          const valueStartsAt = ++cursor;
          while (cursor < tagEnd && str[cursor] !== valueQuote) {
            cursor += 1;
          }
          value = str.slice(valueStartsAt, cursor);
          if (cursor < tagEnd) {
            cursor += 1;
          }
        } else {
          const valueStartsAt = cursor;
          while (cursor < tagEnd && !isHtmlAsciiWhitespace(str[cursor])) {
            cursor += 1;
          }
          value = str.slice(valueStartsAt, cursor);
        }
      }

      if (attributeName === "for" && !forAttributeSeen) {
        forAttributeSeen = true;
        if (value) {
          for (const token of readHtmlAttributeTokens(
            value,
            0,
            value.length,
            tagNameLength === 5 ? "id" : "class",
          ))
            result.push(token.value);
        }
      }
    }

    i = tagEnd;
  }

  return uniq(result);
}

function filterMatches(
  inputs: readonly string[],
  patterns: string | readonly string[],
): string[] {
  return inputs.filter((input) => match(input, patterns));
}

export { comb, defaults, uglify, version };
