import {
  formatDiagnosticValue,
  isLetter,
  isPlainObject,
  rawMDash,
  rawNbsp,
  rawNDash,
} from "codsen-utils";
import { rApply } from "ranges-apply";
import { Ranges } from "ranges-push";
import { left, right } from "string-left-right";
import type { Ranges as RangesType } from "../../../ops/typedefs/common";

import { version as v } from "../package.json";
import {
  encodedMdashHtml,
  encodedMdashJs,
  encodedNbspCss,
  encodedNbspHtml,
  encodedNbspJs,
  encodedNdashHtml,
  encodedNdashJs,
  headsAndTailsHexo,
  headsAndTailsHugo,
  headsAndTailsJinja,
  knownHTMLTags,
} from "./util";

const version: string = v;

declare let DEV: boolean;

export interface Obj {
  [key: string]: any;
}

export interface HeadsAndTailsObj {
  readonly heads: string | readonly string[];
  readonly tails: string | readonly string[];
}

export type CountThreshold = number | false | null;
export type IgnorePreset =
  | "all"
  | "hexo"
  | "hugo"
  | "jinja"
  | "liquid"
  | "nunjucks";
export type IgnoreEntry = HeadsAndTailsObj | IgnorePreset;
export type TagRange =
  | readonly [from: number, to: number]
  | readonly [
      from: number,
      to: number,
      whatToInsert: string | null | undefined,
    ];

interface ResolvedMarker {
  heads: string | string[];
  tails: string | string[];
}

export interface Opts {
  removeWidowPreventionMeasures: boolean;
  convertEntities: boolean;
  targetLanguage: "html" | "css" | "js";
  UKPostcodes: boolean;
  hyphens: boolean;
  minWordCount: CountThreshold;
  minCharCount: CountThreshold;
  ignore: IgnorePreset | readonly IgnoreEntry[];
  /** Receives finite, strictly increasing integer percentages within the inclusive configured bounds. */
  reportProgressFunc: false | null | ((percDone: number) => void);
  /** Inclusive progress lower bound; an integer from 0 through 100. */
  reportProgressFuncFrom: number;
  /** Inclusive progress upper bound; an integer from 0 through 100. */
  reportProgressFuncTo: number;
  /** Opaque half-open ranges. Overlong ends are clipped; an optional third range value is ignored. */
  tagRanges: readonly TagRange[] | null;
}

type PublicDefaults = Readonly<
  Omit<Opts, "ignore" | "tagRanges"> & {
    ignore: readonly IgnoreEntry[];
    tagRanges: readonly TagRange[];
  }
>;

interface ResolvedOpts
  extends Omit<Opts, "ignore" | "reportProgressFunc" | "tagRanges"> {
  ignore: ResolvedMarker[];
  reportProgressFunc: null | ((percDone: number) => void);
  tagRanges: [number, number][];
}

const defaultMinWordCount = 4;
const defaultMinCharCount = 5;

const internalDefaults: ResolvedOpts = {
  removeWidowPreventionMeasures: false,
  convertEntities: true, // encode?
  targetLanguage: "html", // encode in what? [html, css, js]
  UKPostcodes: false, // replace space in UK postcodes?
  hyphens: true, // replace space with non-breaking space in front of dash
  minWordCount: defaultMinWordCount, // if there are less words than this in chunk, skip
  minCharCount: defaultMinCharCount, // if there are less characters than this in chunk, skip
  ignore: [], // put {heads: "{{", tails: "}}"} or presets: "jinja", "nunjucks", "hugo", "hexo"
  reportProgressFunc: null, // reporting progress function
  reportProgressFuncFrom: 0,
  reportProgressFuncTo: 100,
  tagRanges: [],
};

const defaults: PublicDefaults = Object.freeze({
  ...internalDefaults,
  ignore: Object.freeze([]) as readonly IgnoreEntry[],
  tagRanges: Object.freeze([]) as readonly TagRange[],
});

const encodedDashTokens = [
  encodedNdashHtml,
  encodedNdashJs,
  encodedMdashHtml,
  encodedMdashJs,
] as const;

export interface Res {
  res: string;
  ranges: RangesType;
  /** Best-effort elapsed time for user-facing completion feedback. */
  log: {
    timeTakenInMilliseconds: number;
  };
  /** Operations that changed the final output. */
  whatWasDone: {
    removeWidows: boolean;
    convertEntities: boolean;
  };
  /** Options which could affect this input, independently of their current setting. */
  applicableOpts: {
    removeWidows: boolean;
    convertEntities: boolean;
  };
}

const plainTextFastPathExclusions =
  /[&\\\u00a0\u2013\u2014\r\n<>/0-9-]/;

function removeWidowsFromPlainTextWithDefaults(
  str: string,
  start: number,
): Res {
  let wordCount = 0;
  let charCount = 0;
  let openWhitespaceStartedAt: number | undefined;
  let lastWhitespaceStartedAt: number | undefined;
  let lastWhitespaceEndedAt: number | undefined;

  for (let i = 0; i < str.length; i += 1) {
    if (str[i].trim()) {
      charCount += 1;
      if (!str[i - 1]?.trim()) {
        wordCount += 1;
      }
      if (openWhitespaceStartedAt !== undefined) {
        lastWhitespaceStartedAt = openWhitespaceStartedAt;
        lastWhitespaceEndedAt = i;
        openWhitespaceStartedAt = undefined;
      }
    } else if (
      str[i - 1]?.trim() &&
      !(
        str[i - 1]?.toLowerCase() === "r" &&
        (str[i - 2]?.toLowerCase() === "b" ||
          str[i - 2]?.toLowerCase() === "h")
      )
    ) {
      let nextNonWhitespace = i + 1;
      while (
        nextNonWhitespace < str.length &&
        !str[nextNonWhitespace].trim()
      ) {
        nextNonWhitespace += 1;
      }
      if (nextNonWhitespace < str.length) {
        openWhitespaceStartedAt = i;
      }
    }
  }

  let hasCandidate = false;
  let ranges: RangesType = null;
  let result = str;
  if (
    lastWhitespaceStartedAt !== undefined &&
    lastWhitespaceEndedAt !== undefined &&
    wordCount >= defaultMinWordCount &&
    charCount >= defaultMinCharCount
  ) {
    hasCandidate = true;
    ranges = [
      [lastWhitespaceStartedAt, lastWhitespaceEndedAt, encodedNbspHtml],
    ];
    result = `${str.slice(
      0,
      lastWhitespaceStartedAt,
    )}${encodedNbspHtml}${str.slice(lastWhitespaceEndedAt)}`;
  }

  return {
    res: result,
    ranges,
    log: { timeTakenInMilliseconds: Date.now() - start },
    whatWasDone: {
      removeWidows: hasCandidate,
      convertEntities: false,
    },
    applicableOpts: {
      removeWidows: hasCandidate,
      convertEntities: hasCandidate,
    },
  };
}

function removeWidows(str: string, opts?: Partial<Opts>): Res {
  DEV &&
    console.log(
      `called removeWidows() on\n"${str}"\nusing opts = ${JSON.stringify(
        opts,
        null,
        4,
      )}`,
    );
  const start = Date.now();
  // insurance:
  if (typeof str !== "string") {
    if (str === undefined) {
      throw new Error(
        "string-remove-widows/removeWidows(): [THROW_ID_01] the first input argument is completely missing! It should be given as string.",
      );
    } else {
      throw new Error(
        `string-remove-widows/removeWidows(): [THROW_ID_02] the first input argument must be string! It was given as "${typeof str}", equal to:\n${formatDiagnosticValue(str, 4)}`,
      );
    }
  }

  if (opts !== undefined && !isPlainObject(opts)) {
    throw new Error(
      `string-remove-widows/removeWidows(): [THROW_ID_03] the second input argument, options object, should be a plain object but it was given as type ${typeof opts}, equal to ${formatDiagnosticValue(opts, 4)}`,
    );
  }

  if (opts === undefined && !plainTextFastPathExclusions.test(str)) {
    return removeWidowsFromPlainTextWithDefaults(str, start);
  }

  // consts

  let isArr = Array.isArray;
  let len = str.length;
  let rangesArr = new Ranges<string | null | undefined>({ mergeType: 2 });
  let punctuationCharsToConsiderWidowIssue = ["."];

  const leavePercForLastStage = 0.06; // in range of [0, 1]

  // vars

  let currentPercentageDone: number;
  let lastPercentage: number | undefined;
  let wordCount = 0; // counted per-chunk (paragraph)
  let charCount = 0; // counted per-character, per chunk (paragraph)

  let secondToLastWhitespaceStartedAt; // necessary to support whitespace at line ends
  let secondToLastWhitespaceEndedAt; // necessary to support whitespace at line ends
  let lastWhitespaceStartedAt;
  let lastWhitespaceEndedAt;
  let openWhitespaceStartedAt;
  let lastEncodedNbspStartedAt;
  let lastEncodedNbspEndedAt;
  let lastEncodedNbspHasFollowingWord = false;
  // let lineBreakCount;
  let doNothingUntil: string | string[] | undefined;
  let tagRangeCursor = 0;

  // requests to bump word count in the future:
  let bumpWordCountAt: number | undefined;
  let semanticWordBoundaryAt: number | undefined;
  let semanticWhitespaceStartAt: number | undefined;
  let suppressSourceWordBoundaryAt: number | undefined;

  // prep the resolvedOpts
  let resolvedOpts = resolveOptions(str, opts);

  // Now, strictly speaking, this program can remove widow words but also
  // it will decode any entities it encounters if option convertEntities is off.
  // We need an interface to report what actions were taken:
  let whatWasDone = {
    removeWidows: false,
    convertEntities: false,
  };

  let applicableOpts = {
    removeWidows: false,
    convertEntities: false,
  };
  const effectiveOperations = new Map<string, keyof typeof whatWasDone>();
  const convertEntitySensitiveRanges = new Set<string>();

  function rangeKey(from: number, to: number): string {
    return `${from}:${to}`;
  }

  function overlapsTagRange(from: number, to: number): boolean {
    if (!resolvedOpts.tagRanges.length || from >= to) {
      return false;
    }
    let low = 0;
    let high = resolvedOpts.tagRanges.length;
    while (low < high) {
      const middle = Math.floor((low + high) / 2);
      if (resolvedOpts.tagRanges[middle][1] <= from) {
        low = middle + 1;
      } else {
        high = middle;
      }
    }
    return Boolean(
      resolvedOpts.tagRanges[low] && resolvedOpts.tagRanges[low][0] < to,
    );
  }

  function startsWithOutsideTagRange(token: string, index: number): boolean {
    return (
      str.startsWith(token, index) &&
      !overlapsTagRange(index, index + token.length)
    );
  }

  const scanProgressTo =
    resolvedOpts.reportProgressFuncFrom +
    Math.floor(
      (resolvedOpts.reportProgressFuncTo -
        resolvedOpts.reportProgressFuncFrom) *
        (1 - leavePercForLastStage),
    );

  function reportProgress(value: number): void {
    if (!resolvedOpts.reportProgressFunc) {
      return;
    }
    const boundedValue = Math.max(
      resolvedOpts.reportProgressFuncFrom,
      Math.min(resolvedOpts.reportProgressFuncTo, Math.floor(value)),
    );
    if (lastPercentage === undefined || boundedValue > lastPercentage) {
      lastPercentage = boundedValue;
      resolvedOpts.reportProgressFunc(boundedValue);
    }
  }

  function push(finalStart: number, finalEnd: number): boolean {
    if (overlapsTagRange(finalStart, finalEnd)) {
      return false;
    }
    let finalWhatToInsert = rawNbsp;
    // calculate what to insert
    if (resolvedOpts.removeWidowPreventionMeasures) {
      finalWhatToInsert = " ";
    } else if (resolvedOpts.convertEntities) {
      finalWhatToInsert = encodedNbspHtml;
      if (resolvedOpts.targetLanguage === "css") {
        finalWhatToInsert = encodedNbspCss;
      } else if (resolvedOpts.targetLanguage === "js") {
        finalWhatToInsert = encodedNbspJs;
      }
    }
    const key = rangeKey(finalStart, finalEnd);
    const sourceIsNbsp = matchNbspToken(str, finalStart) === finalEnd;
    applicableOpts.removeWidows = true;
    if (sourceIsNbsp) {
      if (resolvedOpts.removeWidowPreventionMeasures) {
        convertEntitySensitiveRanges.delete(key);
      } else {
        convertEntitySensitiveRanges.add(key);
      }
    }
    if (str.slice(finalStart, finalEnd) !== finalWhatToInsert) {
      rangesArr.push(finalStart, finalEnd, finalWhatToInsert);
      effectiveOperations.set(
        key,
        sourceIsNbsp && finalWhatToInsert !== " "
          ? "convertEntities"
          : "removeWidows",
      );
      DEV &&
        console.log(
          `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${finalStart}, ${finalEnd}, "${finalWhatToInsert}"]`,
        );
      return true;
    }
    return false;
  }

  function resetAll(): void {
    wordCount = 0;
    charCount = 0;
    secondToLastWhitespaceStartedAt = undefined;
    secondToLastWhitespaceEndedAt = undefined;
    lastWhitespaceStartedAt = undefined;
    lastWhitespaceEndedAt = undefined;
    openWhitespaceStartedAt = undefined;
    lastEncodedNbspStartedAt = undefined;
    lastEncodedNbspEndedAt = undefined;
    lastEncodedNbspHasFollowingWord = false;
    // lineBreakCount = undefined;
  }

  resetAll();

  reportProgress(resolvedOpts.reportProgressFuncFrom);

  DEV &&
    console.log(
      `${`\u001b[${32}m${`USING`}\u001b[${39}m`} ${`\u001b[${33}m${`resolvedOpts`}\u001b[${39}m`} = ${JSON.stringify(
        resolvedOpts,
        null,
        4,
      )}`,
    );

  // iterate the string
  for (let i = 0; i <= len; i++) {
    //
    //
    //
    //
    //                    TOP
    //
    //
    //
    //

    // Logging:
    // ███████████████████████████████████████
    DEV &&
      console.log(
        `\n\u001b[${36}m${`===============================`}\u001b[${39}m \u001b[${35}m${`str[ ${i} ] = ${
          str[i]?.trim() ? str[i] : JSON.stringify(str[i], null, 0)
        }`}\u001b[${39}m \u001b[${36}m${`===============================`}\u001b[${39}m\n`,
      );

    if (resolvedOpts.reportProgressFunc) {
      currentPercentageDone =
        resolvedOpts.reportProgressFuncFrom +
        Math.floor(
          (len === 0 ? 1 : Math.min(i, len) / len) *
            (scanProgressTo - resolvedOpts.reportProgressFuncFrom),
        );
      reportProgress(currentPercentageDone);
    }

    while (
      resolvedOpts.tagRanges[tagRangeCursor] &&
      resolvedOpts.tagRanges[tagRangeCursor][1] <= i
    ) {
      tagRangeCursor += 1;
    }
    const currentTagRange = resolvedOpts.tagRanges[tagRangeCursor];
    if (currentTagRange && i >= currentTagRange[0] && i < currentTagRange[1]) {
      const semanticWhitespaceBeforeTag =
        bumpWordCountAt === currentTagRange[0] ||
        semanticWordBoundaryAt === currentTagRange[0] ||
        (semanticWhitespaceStartAt !== currentTagRange[0] &&
          suppressSourceWordBoundaryAt !== currentTagRange[0] &&
          !str[currentTagRange[0] - 1]?.trim());
      if (
        openWhitespaceStartedAt !== undefined &&
        i === currentTagRange[0] &&
        str[currentTagRange[1]]?.trim()
      ) {
        secondToLastWhitespaceStartedAt = lastWhitespaceStartedAt;
        secondToLastWhitespaceEndedAt = lastWhitespaceEndedAt;
        lastWhitespaceStartedAt = openWhitespaceStartedAt;
        lastWhitespaceEndedAt = i;
      }
      openWhitespaceStartedAt = undefined;
      if (
        bumpWordCountAt !== undefined &&
        bumpWordCountAt < currentTagRange[1]
      ) {
        bumpWordCountAt = undefined;
      }
      if (
        semanticWhitespaceStartAt !== undefined &&
        semanticWhitespaceStartAt < currentTagRange[1]
      ) {
        semanticWhitespaceStartAt = undefined;
      }
      if (
        semanticWordBoundaryAt !== undefined &&
        semanticWordBoundaryAt < currentTagRange[1]
      ) {
        semanticWordBoundaryAt = undefined;
      }
      if (
        suppressSourceWordBoundaryAt !== undefined &&
        suppressSourceWordBoundaryAt < currentTagRange[1]
      ) {
        suppressSourceWordBoundaryAt = undefined;
      }
      if (
        str[currentTagRange[1]]?.trim() &&
        semanticWhitespaceBeforeTag
      ) {
        semanticWordBoundaryAt = currentTagRange[1];
      }
      i = currentTagRange[1] - 1;
      continue;
    }

    const startsAtSemanticWordBoundary = semanticWordBoundaryAt === i;
    if (startsAtSemanticWordBoundary) {
      semanticWordBoundaryAt = undefined;
    }
    const sourceWordBoundaryIsSuppressed =
      suppressSourceWordBoundaryAt === i;
    if (sourceWordBoundaryIsSuppressed) {
      suppressSourceWordBoundaryAt = undefined;
    }
    const startsAtSemanticWhitespace = semanticWhitespaceStartAt === i;
    if (startsAtSemanticWhitespace) {
      semanticWhitespaceStartAt = undefined;
    }

    // detect templating language heads and tails
    if (
      !doNothingUntil &&
      isArr(resolvedOpts.ignore) &&
      resolvedOpts.ignore.length
    ) {
      resolvedOpts.ignore.some((valObj, y) => {
        if (
          (isArr(valObj.heads) &&
            valObj.heads.some((oneOfHeads) =>
              startsWithOutsideTagRange(oneOfHeads, i),
            )) ||
          (typeof valObj.heads === "string" &&
            startsWithOutsideTagRange(valObj.heads, i))
        ) {
          DEV &&
            console.log(`${`\u001b[${31}m${`heads detected!`}\u001b[${39}m`}`);
          openWhitespaceStartedAt = undefined;
          wordCount += 1;
          doNothingUntil = resolvedOpts.ignore[y].tails;
          DEV &&
            console.log(
              `${`\u001b[${90}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`doNothingUntil`}\u001b[${39}m`} = ${doNothingUntil}`,
            );
          return true;
        }
        return false;
      });
    }

    // if there was word count bump request issued in the past for current
    // index, do bump it:
    let wordCountBumpedAtCurrentIndex = false;
    if (
      !doNothingUntil &&
      bumpWordCountAt !== undefined &&
      bumpWordCountAt === i
    ) {
      DEV &&
        console.log(
          `FIY, ${`\u001b[${33}m${`bumpWordCountAt`}\u001b[${39}m`} = ${JSON.stringify(
            bumpWordCountAt,
            null,
            4,
          )}`,
        );

      wordCount += 1;
      if (lastEncodedNbspEndedAt !== undefined) {
        lastEncodedNbspHasFollowingWord = true;
      }
      bumpWordCountAt = undefined;
      wordCountBumpedAtCurrentIndex = true;
      DEV &&
        console.log(
          `${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`wordCount`}\u001b[${39}m`} = ${wordCount}; ${`\u001b[${33}m${`bumpWordCountAt`}\u001b[${39}m`} = ${bumpWordCountAt}`,
        );
    }

    // catch the end of whitespace (must be at the top)
    if (
      !doNothingUntil &&
      i &&
      str[i]?.trim() &&
      !str[i - 1]?.trim() &&
      openWhitespaceStartedAt !== undefined
    ) {
      secondToLastWhitespaceStartedAt = lastWhitespaceStartedAt;
      secondToLastWhitespaceEndedAt = lastWhitespaceEndedAt;
      lastWhitespaceStartedAt = openWhitespaceStartedAt;
      lastWhitespaceEndedAt = i;
      openWhitespaceStartedAt = undefined;
      DEV &&
        console.log(
          `${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`lastWhitespace`}\u001b[${39}m`} = [${lastWhitespaceStartedAt}, ${lastWhitespaceEndedAt}]`,
        );
    }

    const matchedEncodedNbspEnd: number | undefined =
      !doNothingUntil &&
      (str[i] === rawNbsp || str[i] === "&" || str[i] === "\\")
        ? matchNbspToken(str, i)
        : undefined;
    const encodedNbspEndedAt: number | undefined =
      matchedEncodedNbspEnd !== undefined &&
      !overlapsTagRange(i, matchedEncodedNbspEnd)
        ? matchedEncodedNbspEnd
        : undefined;
    if (encodedNbspEndedAt !== undefined) {
      lastEncodedNbspStartedAt = i;
      lastEncodedNbspEndedAt = encodedNbspEndedAt;
      lastEncodedNbspHasFollowingWord = false;
      const key = rangeKey(i, encodedNbspEndedAt);
      convertEntitySensitiveRanges.add(key);

      const entityReplacement = resolvedOpts.convertEntities
        ? resolvedOpts.targetLanguage === "css"
          ? `${encodedNbspCss}${
              isCssWhitespace(str[encodedNbspEndedAt]) ? " " : ""
            }`
          : resolvedOpts.targetLanguage === "js"
            ? encodedNbspJs
            : encodedNbspHtml
        : rawNbsp;
      if (str.slice(i, encodedNbspEndedAt) !== entityReplacement) {
        rangesArr.push(i, encodedNbspEndedAt, entityReplacement);
        effectiveOperations.set(key, "convertEntities");
        DEV &&
          console.log(
            `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${i}, ${encodedNbspEndedAt}, "${entityReplacement}"]`,
          );
      }

      if (
        str[encodedNbspEndedAt] &&
        !`\r\n`.includes(str[encodedNbspEndedAt]) &&
        !str[encodedNbspEndedAt].trim()
      ) {
        semanticWhitespaceStartAt = encodedNbspEndedAt;
      }

      if (
        encodedNbspEndedAt - i > 1 &&
        str[encodedNbspEndedAt]?.trim() &&
        matchNbspToken(str, encodedNbspEndedAt) === undefined
      ) {
        bumpWordCountAt = encodedNbspEndedAt;
      }
      i = encodedNbspEndedAt - 1;
      continue;
    }

    if (!doNothingUntil && str[i]?.trim()) {
      charCount += 1;
    }

    //
    //
    //
    //
    //
    //
    //
    //
    //             MIDDLE
    //
    //
    //
    //
    //
    //
    //
    //

    // catch dashes
    const matchedDashEnd: number | undefined =
      !doNothingUntil &&
      (str[i] === "-" ||
        str[i] === rawMDash ||
        str[i] === rawNDash ||
        str[i] === "&" ||
        str[i] === "\\")
        ? matchDashToken(str, i)
        : undefined;
    const dashEndedAt: number | undefined =
      matchedDashEnd !== undefined && !overlapsTagRange(i, matchedDashEnd)
        ? matchedDashEnd
        : undefined;
    if (dashEndedAt !== undefined) {
      const precedingNonWhitespace = left(str, i);
      if (
        !wordCountBumpedAtCurrentIndex &&
        (startsAtSemanticWordBoundary || !str[i - 1]?.trim())
      ) {
        wordCount += 1;
        if (lastEncodedNbspEndedAt !== undefined) {
          lastEncodedNbspHasFollowingWord = true;
        }
      }
      const dashPrecededByNbsp =
        lastEncodedNbspStartedAt !== undefined &&
        lastEncodedNbspEndedAt === i &&
        matchNbspToken(str, lastEncodedNbspStartedAt) === i;
      const dashCandidateStart =
        dashPrecededByNbsp && lastEncodedNbspStartedAt !== undefined
          ? lastEncodedNbspStartedAt
          : precedingNonWhitespace === null
            ? i
            : precedingNonWhitespace + 1;
      const dashHasSameParagraphPredecessor =
        precedingNonWhitespace !== null &&
        !str
          .slice(precedingNonWhitespace + 1, i)
          .split("")
          .some((char) => char === "\r" || char === "\n");
      const dashCanUsePrecedingWhitespace =
        dashEndedAt < len &&
        dashHasSameParagraphPredecessor &&
        !str[dashEndedAt]?.trim() &&
        (dashPrecededByNbsp ||
          (Boolean(str[i - 1]) &&
            !str[i - 1].trim() &&
            precedingNonWhitespace !== null)) &&
        !overlapsTagRange(dashCandidateStart, i);
      if (dashCanUsePrecedingWhitespace) {
        applicableOpts.removeWidows = true;
      }
      if (resolvedOpts.hyphens && dashCanUsePrecedingWhitespace) {
        DEV && console.log(`dash starts here`);
        push(dashCandidateStart, i);
      }
      if (str[i] === "\\" && isCssWhitespace(str[dashEndedAt - 1])) {
        if (
          str[dashEndedAt] &&
          !`\r\n`.includes(str[dashEndedAt]) &&
          !str[dashEndedAt].trim()
        ) {
          semanticWhitespaceStartAt = dashEndedAt;
        } else if (str[dashEndedAt]?.trim()) {
          suppressSourceWordBoundaryAt = dashEndedAt;
        }
      }
      i = dashEndedAt - 1;
      continue;
    }

    // catch the first letter of the first word
    if (
      !doNothingUntil &&
      !wordCountBumpedAtCurrentIndex &&
      str[i]?.trim() &&
      (startsAtSemanticWordBoundary ||
        (!sourceWordBoundaryIsSuppressed && !str[i - 1]?.trim()))
    ) {
      // 1. bump the word counter
      wordCount += 1;
      if (lastEncodedNbspEndedAt !== undefined) {
        lastEncodedNbspHasFollowingWord = true;
      }
      DEV &&
        console.log(
          `${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`wordCount`}\u001b[${39}m`} = ${wordCount}`,
        );
    }

    // catch the ending of paragraphs or the EOL - here's where the action happens
    if (
      !doNothingUntil &&
      (!str[i] ||
        `\r\n`.includes(str[i]) ||
        ((str[i] === "\n" ||
          str[i] === "\r" ||
          (str[i] === "\r" && str[i + 1] === "\n")) &&
          left(str, i) &&
          punctuationCharsToConsiderWidowIssue.includes(
            str[left(str, i) as number],
          )))
    ) {
      DEV &&
        console.log(`${`\u001b[${32}m${`██`}\u001b[${39}m`} PARAGRAPH ENDING!`);

      let finalStart;
      let finalEnd;

      // calculate start and end values
      if (
        lastWhitespaceStartedAt !== undefined &&
        lastWhitespaceEndedAt !== undefined &&
        lastEncodedNbspStartedAt !== undefined &&
        lastEncodedNbspEndedAt !== undefined &&
        lastEncodedNbspHasFollowingWord
      ) {
        DEV && console.log();
        if (lastWhitespaceStartedAt > lastEncodedNbspStartedAt) {
          finalStart = lastWhitespaceStartedAt;
          finalEnd = lastWhitespaceEndedAt;
        } else {
          finalStart = lastEncodedNbspStartedAt;
          finalEnd = lastEncodedNbspEndedAt;
        }
      } else if (
        lastWhitespaceStartedAt !== undefined &&
        lastWhitespaceEndedAt !== undefined
      ) {
        DEV && console.log();
        finalStart = lastWhitespaceStartedAt;
        finalEnd = lastWhitespaceEndedAt;
      } else if (
        lastEncodedNbspStartedAt !== undefined &&
        lastEncodedNbspEndedAt !== undefined &&
        lastEncodedNbspHasFollowingWord
      ) {
        DEV && console.log();
        finalStart = lastEncodedNbspStartedAt;
        finalEnd = lastEncodedNbspEndedAt;
      }

      // if by now the point to insert non-breaking space was not found,
      // give last chance to secondToLastWhitespaceStartedAt and
      // secondToLastWhitespaceEndedAt:
      if (
        (finalStart === undefined || finalEnd === undefined) &&
        secondToLastWhitespaceStartedAt !== undefined &&
        secondToLastWhitespaceEndedAt !== undefined
      ) {
        DEV && console.log();
        finalStart = secondToLastWhitespaceStartedAt;
        finalEnd = secondToLastWhitespaceEndedAt;
      }

      DEV && console.log(`finalStart = ${finalStart}; finalEnd = ${finalEnd}`);

      if (finalStart !== undefined && finalEnd !== undefined) {
        if (
          (!resolvedOpts.minWordCount ||
            wordCount >= resolvedOpts.minWordCount) &&
          (!resolvedOpts.minCharCount || charCount >= resolvedOpts.minCharCount)
        ) {
          if (!overlapsTagRange(finalStart, finalEnd)) {
            applicableOpts.removeWidows = true;
            DEV &&
              console.log(
                `${`\u001b[${32}m${`passed min length requirements`}\u001b[${39}m`}`,
              );
            push(finalStart, finalEnd);
          }
        }
      }

      resetAll();
      DEV && console.log(`${`\u001b[${31}m${`RESET`}\u001b[${39}m`}`);
    }

    // catch postcodes
    const charBeforePostcodeWhitespace = str.charCodeAt(i - 1);
    const postcodeMatch =
      !doNothingUntil &&
      str[i] &&
      !str[i].trim() &&
      !`\r\n`.includes(str[i]) &&
      str[i - 1]?.trim() &&
      ((charBeforePostcodeWhitespace >= 48 &&
        charBeforePostcodeWhitespace <= 57) ||
        (charBeforePostcodeWhitespace >= 65 &&
          charBeforePostcodeWhitespace <= 90))
        ? postcodeMatchAt(str, i)
        : undefined;
    if (
      postcodeMatch !== undefined &&
      !overlapsTagRange(postcodeMatch.tokenStart, postcodeMatch.tokenEnd)
    ) {
      applicableOpts.removeWidows = true;
      if (resolvedOpts.UKPostcodes) {
        DEV &&
          console.log(
            `POSTCODE caught: [${i}, ${postcodeMatch.whitespaceEnd}]`,
          );
        push(i, postcodeMatch.whitespaceEnd);
      }
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
    //              BOTTOM
    //
    //
    //
    //
    //
    //
    //
    //

    // catch the start of whitespace (must be at the bottom)
    //
    // either it's first whitespace character ever met, or we're overwriting an
    // old whitespace record and it's the first character of new whitespace chunk
    const whitespaceStartsHere =
      !doNothingUntil &&
      str[i] &&
      !`\r\n`.includes(str[i]) &&
      !str[i].trim() &&
      (startsAtSemanticWhitespace || str[i - 1]?.trim()) &&
      openWhitespaceStartedAt === undefined;
    const nextNonWhitespace = whitespaceStartsHere ? right(str, i) : null;
    const previousEndsWithBreakName =
      whitespaceStartsHere &&
      str[i - 1]?.toLowerCase() === "r" &&
      ["b", "h"].includes(str[i - 2]?.toLowerCase());
    const beforeKnownTag =
      whitespaceStartsHere &&
      str[i - 1] === "<" &&
      nextNonWhitespace !== null &&
      knownHTMLTags.some((tag) => str.startsWith(tag, nextNonWhitespace));

    if (
      whitespaceStartsHere &&
      nextNonWhitespace !== null &&
      !"/>".includes(str[nextNonWhitespace]) &&
      !previousEndsWithBreakName &&
      !beforeKnownTag
    ) {
      DEV && console.log();
      openWhitespaceStartedAt = i;

      DEV &&
        console.log(
          `${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`openWhitespaceStartedAt`}\u001b[${39}m`} = ${openWhitespaceStartedAt}`,
        );

      // 3. wipe the records of the last nbsp because they are not relevant
      if (
        lastEncodedNbspStartedAt !== undefined ||
        lastEncodedNbspEndedAt !== undefined
      ) {
        lastEncodedNbspStartedAt = undefined;
        lastEncodedNbspEndedAt = undefined;
        lastEncodedNbspHasFollowingWord = false;
        DEV &&
          console.log(
            `${`\u001b[${90}m${`RESET`}\u001b[${39}m`} lastEncodedNbspStartedAt, lastEncodedNbspEndedAt`,
          );
      }
    }

    // look for templating tails
    let matchedTail: string | undefined;
    if (doNothingUntil) {
      if (
        typeof doNothingUntil === "string" &&
        startsWithOutsideTagRange(doNothingUntil, i)
      ) {
        matchedTail = doNothingUntil;
      } else if (
        Array.isArray(doNothingUntil) &&
        doNothingUntil.some((value) => {
          if (startsWithOutsideTagRange(value, i)) {
            matchedTail = value;
            return true;
          }
          return false;
        })
      ) {
        // The matching array member is captured above.
      }
      if (matchedTail !== undefined) {
        let ignoredEnd: number = i + matchedTail.length;
        if (
          matchedTail.startsWith("{% end") ||
          matchedTail.startsWith("{%- end")
        ) {
          while (ignoredEnd < len && !str[ignoredEnd].trim()) {
            ignoredEnd += 1;
          }
          if (str.startsWith("-%}", ignoredEnd)) {
            ignoredEnd += 3;
          } else if (str.startsWith("%}", ignoredEnd)) {
            ignoredEnd += 2;
          }
        }
        if (!overlapsTagRange(i, ignoredEnd)) {
          doNothingUntil = undefined;
          const followingNbspEnd = matchNbspToken(str, ignoredEnd);
          if (
            str[ignoredEnd]?.trim() &&
            (followingNbspEnd === undefined ||
              overlapsTagRange(ignoredEnd, followingNbspEnd))
          ) {
            bumpWordCountAt = ignoredEnd;
          }
          DEV &&
            console.log(
              `RESET ${`\u001b[${33}m${`doNothingUntil`}\u001b[${39}m`}; ${`\u001b[${32}m${`BUMP`}\u001b[${39}m`} i: ${`\u001b[${33}m${i}\u001b[${39}m`}=>${`\u001b[${33}m${ignoredEnd - 1}\u001b[${39}m`}`,
            );
          i = ignoredEnd - 1;
        }
      }
    }

    // if it's a CR or LF, reset the word/letter counts
    if (str[i] && `\r\n`.includes(str[i])) {
      wordCount = 0;
      charCount = 0;
      DEV &&
        console.log(`RESET wordCount = ${wordCount}; charCount = ${charCount}`);
    }

    // logging after each loop's iteration:
    // ███████████████████████████████████████
    DEV &&
      console.log(
        `    \u001b[${90}m${`██ ██ ██ ██ ██ END ██ ██ ██ ██ ██`}\u001b[${39}m`,
      );
    DEV &&
      console.log(
        `${`\u001b[${90}m${`second-to-last whitespace: [${secondToLastWhitespaceStartedAt}, ${secondToLastWhitespaceEndedAt}]`}\u001b[${39}m`}`,
      );
    DEV &&
      console.log(
        `${`\u001b[${90}m${`last whitespace: [${lastWhitespaceStartedAt}, ${lastWhitespaceEndedAt}]`}\u001b[${39}m`}`,
      );
    DEV &&
      console.log(
        `${`\u001b[${90}m${`last encoded nbsp: [${lastEncodedNbspStartedAt}, ${lastEncodedNbspEndedAt}]`}\u001b[${39}m`}`,
      );
    DEV &&
      console.log(
        `${`\u001b[${90}m${`word count ${wordCount}; char count ${charCount}`}\u001b[${39}m`}${
          bumpWordCountAt
            ? `${`\u001b[${90}m${`;`}\u001b[${39}m`}${`\u001b[${90}m${` bumpWordCountAt = ${bumpWordCountAt}`}\u001b[${39}m`}`
            : ""
        }`,
      );
    DEV &&
      console.log(
        `${`\u001b[${90}m${`rangesArr: ${JSON.stringify(
          rangesArr.current(),
          null,
          0,
        )}`}\u001b[${39}m`}${
          doNothingUntil
            ? `\n${`\u001b[${31}m${`doNothingUntil = ${JSON.stringify(
                doNothingUntil,
                null,
                0,
              )}`}\u001b[${39}m`}`
            : ""
        }`,
      );

    //
    //
    //
    // end of the loop
  }

  DEV &&
    console.log(
      `string-remove-widows: ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`}:`,
    );
  const ranges = rangesArr.current();
  const result = rApply(
    str,
    ranges,
    resolvedOpts.reportProgressFunc
      ? (incomingPerc) => {
          currentPercentageDone =
            scanProgressTo +
            Math.floor(
              (incomingPerc / 100) *
                (resolvedOpts.reportProgressFuncTo - scanProgressTo),
            );
          DEV &&
            console.log(
              `${`\u001b[${33}m${`currentPercentageDone`}\u001b[${39}m`} = ${JSON.stringify(
                currentPercentageDone,
                null,
                4,
              )}`,
            );
          reportProgress(currentPercentageDone);
        }
      : undefined,
  );

  if (DEV) {
    result.split("").forEach((key, i) => {
      console.log(
        `${`\u001b[${33}m${`#${i}`}\u001b[${39}m`}: ${key} - ${key.charCodeAt(
          0,
        )}`,
      );
    });
  }

  for (const operation of effectiveOperations.values()) {
    whatWasDone[operation] = true;
  }
  applicableOpts.convertEntities =
    (applicableOpts.removeWidows &&
      !resolvedOpts.removeWidowPreventionMeasures) ||
    convertEntitySensitiveRanges.size > 0;

  return {
    res: result,
    ranges,
    log: { timeTakenInMilliseconds: Date.now() - start },
    whatWasDone,
    applicableOpts,
  };
}

function isCssHexDigit(char: string | undefined): boolean {
  return char !== undefined && /[0-9a-f]/i.test(char);
}

function isCssWhitespace(char: string | undefined): boolean {
  return char !== undefined && "\t\n\f\r ".includes(char);
}

function matchCssEscape(
  str: string,
  index: number,
  codePoint: number,
  consumeTerminator: boolean,
): number | undefined {
  if (str[index] !== "\\" || !isCssHexDigit(str[index + 1])) {
    return undefined;
  }
  let end = index + 1;
  while (end < str.length && end - index <= 6 && isCssHexDigit(str[end])) {
    end += 1;
  }
  if (Number.parseInt(str.slice(index + 1, end), 16) !== codePoint) {
    return undefined;
  }
  if (consumeTerminator && isCssWhitespace(str[end])) {
    if (str[end] === "\r" && str[end + 1] === "\n") {
      return end + 2;
    }
    return end + 1;
  }
  return end;
}

function matchNbspToken(str: string, index: number): number | undefined {
  const first = str[index];
  if (first === rawNbsp) {
    return index + 1;
  }
  if (
    first === "&" &&
    (str.startsWith(encodedNbspHtml, index) || str.startsWith("&#160;", index))
  ) {
    return index + 6;
  }
  if (first === "\\") {
    if (
      str[index + 1]?.toLowerCase() === "u" &&
      str[index + 2] === "0" &&
      str[index + 3] === "0" &&
      str[index + 4]?.toLowerCase() === "a" &&
      str[index + 5] === "0"
    ) {
      return index + 6;
    }
    return matchCssEscape(str, index, 0xa0, true);
  }
  return undefined;
}

function matchDashToken(str: string, index: number): number | undefined {
  const first = str[index];
  if (first === "-" || first === rawMDash || first === rawNDash) {
    return index + 1;
  }
  if (first === "&" || first === "\\") {
    for (const token of encodedDashTokens) {
      if (str.startsWith(token, index)) {
        return index + token.length;
      }
    }
    if (first === "\\") {
      return (
        matchCssEscape(str, index, 0x2013, true) ??
        matchCssEscape(str, index, 0x2014, true)
      );
    }
  }
  return undefined;
}

function isPostcodeTokenChar(char: string | undefined): boolean {
  if (char === undefined) {
    return false;
  }
  const code = char.charCodeAt(0);
  return (
    (code >= 48 && code <= 57) ||
    (code >= 65 && code <= 90) ||
    code === 95 ||
    (code >= 97 && code <= 122)
  );
}

const unicodeDecimalDigitRanges = [
  1632, 1641, 1776, 1785, 1984, 1993, 2406, 2415, 2534, 2543, 2662, 2671,
  2790, 2799, 2918, 2927, 3046, 3055, 3174, 3183, 3302, 3311, 3430, 3439,
  3558, 3567, 3664, 3673, 3792, 3801, 3872, 3881, 4160, 4169, 4240, 4249,
  6112, 6121, 6160, 6169, 6470, 6479, 6608, 6617, 6784, 6793, 6800, 6809,
  6992, 7001, 7088, 7097, 7232, 7241, 7248, 7257, 42528, 42537, 43216,
  43225, 43264, 43273, 43472, 43481, 43504, 43513, 43600, 43609, 44016,
  44025, 65296, 65305, 66720, 66729, 68912, 68921, 68928, 68937, 69734,
  69743, 69872, 69881, 69942, 69951, 70096, 70105, 70384, 70393, 70736,
  70745, 70864, 70873, 71248, 71257, 71360, 71369, 71376, 71395, 71472,
  71481, 71904, 71913, 72016, 72025, 72688, 72697, 72784, 72793, 73040,
  73049, 73120, 73129, 73184, 73193, 73552, 73561, 90416, 90425, 92768,
  92777, 92864, 92873, 93008, 93017, 93552, 93561, 118000, 118009,
  120782, 120831, 123200, 123209, 123632, 123641, 124144, 124153, 124401,
  124410, 125264, 125273, 130032, 130041,
] as const;

function codePointAt(str: string, index: number): string | undefined {
  const codePoint = str.codePointAt(index);
  return codePoint === undefined ? undefined : String.fromCodePoint(codePoint);
}

function codePointBefore(str: string, index: number): string | undefined {
  if (index <= 0) {
    return undefined;
  }
  const previousCodeUnit = str.charCodeAt(index - 1);
  return previousCodeUnit >= 0xdc00 &&
    previousCodeUnit <= 0xdfff &&
    index > 1
    ? str.slice(index - 2, index)
    : str[index - 1];
}

function isUnicodeDecimalDigit(char: string | undefined): boolean {
  if (char === undefined) {
    return false;
  }
  const codePoint = char.codePointAt(0) as number;
  let low = 0;
  let high = unicodeDecimalDigitRanges.length / 2 - 1;
  while (low <= high) {
    const middle = (low + high) >> 1;
    const start = unicodeDecimalDigitRanges[middle * 2];
    const end = unicodeDecimalDigitRanges[middle * 2 + 1];
    if (codePoint < start) {
      high = middle - 1;
    } else if (codePoint > end) {
      low = middle + 1;
    } else {
      return true;
    }
  }
  return false;
}

function isPostcodeBoundaryWordChar(char: string | undefined): boolean {
  return (
    char !== undefined &&
    (char === "_" || isLetter(char) || isUnicodeDecimalDigit(char))
  );
}

interface PostcodeMatch {
  whitespaceEnd: number;
  tokenStart: number;
  tokenEnd: number;
}

function postcodeMatchAt(
  str: string,
  whitespaceStart: number,
): PostcodeMatch | undefined {
  if (
    !str[whitespaceStart] ||
    `\r\n`.includes(str[whitespaceStart]) ||
    str[whitespaceStart].trim() ||
    !str[whitespaceStart - 1]?.trim()
  ) {
    return undefined;
  }

  const beforeWhitespace = str.charCodeAt(whitespaceStart - 1);
  if (
    !(
      (beforeWhitespace >= 48 && beforeWhitespace <= 57) ||
      (beforeWhitespace >= 65 && beforeWhitespace <= 90)
    )
  ) {
    return undefined;
  }

  let whitespaceEnd = whitespaceStart;
  while (
    str[whitespaceEnd] &&
    !str[whitespaceEnd].trim() &&
    !`\r\n`.includes(str[whitespaceEnd])
  ) {
    whitespaceEnd += 1;
  }
  if (!str[whitespaceEnd]) {
    return undefined;
  }
  const afterWhitespace = str.charCodeAt(whitespaceEnd);
  if (afterWhitespace < 48 || afterWhitespace > 57) {
    return undefined;
  }

  let outwardStart = whitespaceStart - 1;
  while (outwardStart >= 0 && isPostcodeTokenChar(str[outwardStart])) {
    outwardStart -= 1;
  }
  outwardStart += 1;

  let inwardEnd = whitespaceEnd;
  while (inwardEnd < str.length && isPostcodeTokenChar(str[inwardEnd])) {
    inwardEnd += 1;
  }

  if (
    isPostcodeBoundaryWordChar(codePointBefore(str, outwardStart)) ||
    isPostcodeBoundaryWordChar(codePointAt(str, inwardEnd))
  ) {
    return undefined;
  }

  return /^[A-Z]{1,2}[0-9][0-9A-Z]?$/.test(
    str.slice(outwardStart, whitespaceStart),
  ) && /^[0-9][A-Z]{2}$/.test(str.slice(whitespaceEnd, inwardEnd))
    ? {
        whitespaceEnd,
        tokenStart: outwardStart,
        tokenEnd: inwardEnd,
      }
    : undefined;
}

const optionNames: (keyof Opts)[] = [
  "removeWidowPreventionMeasures",
  "convertEntities",
  "targetLanguage",
  "UKPostcodes",
  "hyphens",
  "minWordCount",
  "minCharCount",
  "ignore",
  "reportProgressFunc",
  "reportProgressFuncFrom",
  "reportProgressFuncTo",
  "tagRanges",
];

function cloneMarker(marker: HeadsAndTailsObj): ResolvedMarker {
  return {
    heads: typeof marker.heads === "string" ? marker.heads : [...marker.heads],
    tails: typeof marker.tails === "string" ? marker.tails : [...marker.tails],
  };
}

function hasOwn(value: object, key: PropertyKey): boolean {
  return Object.getOwnPropertyDescriptor(value, key) !== undefined;
}

function isOwnEnumerable(value: object, key: PropertyKey): boolean {
  return Object.getOwnPropertyDescriptor(value, key)?.enumerable === true;
}

function inheritedEnumerableKey(value: object): string | undefined {
  for (const key in value) {
    if (!hasOwn(value, key)) {
      return key;
    }
  }
  return undefined;
}

function snapshotMarkerPart(value: unknown): string | string[] | undefined {
  if (typeof value === "string") {
    return value.length > 0 ? value : undefined;
  }
  if (!Array.isArray(value) || value.length === 0) {
    return undefined;
  }
  const result: string[] = [];
  for (let index = 0; index < value.length; index += 1) {
    if (!hasOwn(value, index)) {
      return undefined;
    }
    const member: unknown = value[index];
    if (typeof member !== "string" || member.length === 0) {
      return undefined;
    }
    result.push(member);
  }
  return result;
}

function appendIgnorePreset(
  result: ResolvedMarker[],
  value: string,
): string | undefined {
  const preset = value.trim().toLowerCase();
  if (
    !["all", "hexo", "hugo", "jinja", "liquid", "nunjucks"].includes(preset)
  ) {
    return `option "ignore" contains an unsupported preset ${JSON.stringify(value)}.`;
  }
  if (preset === "all") {
    result.push(
      ...headsAndTailsJinja.map(cloneMarker),
      ...headsAndTailsHexo.map(cloneMarker),
    );
  } else if (["nunjucks", "jinja", "liquid"].includes(preset)) {
    result.push(...headsAndTailsJinja.map(cloneMarker));
  } else if (preset === "hugo") {
    result.push(...headsAndTailsHugo.map(cloneMarker));
  } else {
    result.push(...headsAndTailsHexo.map(cloneMarker));
  }
  return undefined;
}

type NormalizedIgnore =
  | { ok: true; value: ResolvedMarker[] }
  | { ok: false; kind: "shape" | "preset"; detail: string };

function normalizeIgnore(value: unknown): NormalizedIgnore {
  const result: ResolvedMarker[] = [];
  if (typeof value === "string") {
    const presetError = appendIgnorePreset(result, value);
    return presetError
      ? { ok: false, kind: "preset", detail: presetError }
      : { ok: true, value: result };
  }
  if (!Array.isArray(value)) {
    return {
      ok: false,
      kind: "shape",
      detail: `option "ignore" must be a supported preset or an array of presets and { heads, tails } marker objects, but it was ${formatDiagnosticValue(value, 4)}.`,
    };
  }

  for (let index = 0; index < value.length; index += 1) {
    if (!hasOwn(value, index)) {
      return {
        ok: false,
        kind: "shape",
        detail: 'option "ignore" cannot contain sparse entries.',
      };
    }
    const entry: unknown = value[index];
    if (typeof entry === "string") {
      const presetError = appendIgnorePreset(result, entry);
      if (presetError) {
        return { ok: false, kind: "preset", detail: presetError };
      }
      continue;
    }
    if (
      !isPlainObject(entry) ||
      inheritedEnumerableKey(entry) !== undefined ||
      Object.getOwnPropertySymbols(entry).some((symbol) =>
        isOwnEnumerable(entry, symbol),
      )
    ) {
      return {
        ok: false,
        kind: "shape",
        detail: 'option "ignore" contains a malformed marker object.',
      };
    }
    const keys = Object.keys(entry);
    if (
      keys.length !== 2 ||
      !keys.includes("heads") ||
      !keys.includes("tails")
    ) {
      return {
        ok: false,
        kind: "shape",
        detail:
          'every custom ignore marker must contain only own "heads" and "tails" keys.',
      };
    }
    const marker = entry as Record<string, unknown>;
    const heads = snapshotMarkerPart(marker.heads);
    const tails = snapshotMarkerPart(marker.tails);
    if (heads === undefined || tails === undefined) {
      return {
        ok: false,
        kind: "shape",
        detail:
          "custom ignore marker heads and tails must be non-empty strings or dense arrays of non-empty strings.",
      };
    }
    result.push({ heads, tails });
  }

  return { ok: true, value: result };
}

type NormalizedTagRanges =
  | { ok: true; value: [number, number][] }
  | { ok: false; kind: "container" | "range"; detail: string };

function normalizeTagRanges(
  value: unknown,
  inputLength: number,
): NormalizedTagRanges {
  if (value === null) {
    return { ok: true, value: [] };
  }
  if (!Array.isArray(value)) {
    return {
      ok: false,
      kind: "container",
      detail: `option "tagRanges" must be null or an array of half-open ranges, but it was ${formatDiagnosticValue(value, 4)}.`,
    };
  }

  const sorted: [number, number][] = [];
  for (let index = 0; index < value.length; index += 1) {
    if (!hasOwn(value, index)) {
      return {
        ok: false,
        kind: "range",
        detail: 'option "tagRanges" cannot contain sparse entries.',
      };
    }
    const range: unknown = value[index];
    if (
      !Array.isArray(range) ||
      (range.length !== 2 && range.length !== 3) ||
      !hasOwn(range, 0) ||
      !hasOwn(range, 1) ||
      (range.length === 3 && !hasOwn(range, 2))
    ) {
      return {
        ok: false,
        kind: "range",
        detail:
          'every "tagRanges" member must be a dense two- or three-item range.',
      };
    }
    const from: unknown = range[0];
    const to: unknown = range[1];
    const insertion: unknown = range.length === 3 ? range[2] : undefined;
    if (
      !Number.isInteger(from) ||
      !Number.isInteger(to) ||
      (from as number) < 0 ||
      (from as number) >= (to as number) ||
      (range.length === 3 &&
        insertion !== null &&
        insertion !== undefined &&
        typeof insertion !== "string")
    ) {
      return {
        ok: false,
        kind: "range",
        detail:
          'every "tagRanges" member must be a non-negative half-open range with integer from/to values and from below to.',
      };
    }
    if ((from as number) < inputLength) {
      sorted.push([from as number, Math.min(to as number, inputLength)]);
    }
  }
  sorted.sort((leftRange, rightRange) =>
    leftRange[0] === rightRange[0]
      ? leftRange[1] - rightRange[1]
      : leftRange[0] - rightRange[0],
  );
  const result: [number, number][] = [];

  for (const range of sorted) {
    const previous = result[result.length - 1];
    if (previous && range[0] <= previous[1]) {
      previous[1] = Math.max(previous[1], range[1]);
    } else {
      result.push(range);
    }
  }

  return { ok: true, value: result };
}

function resolveOptions(str: string, opts?: Partial<Opts>): ResolvedOpts {
  if (opts === undefined) {
    return internalDefaults;
  }
  const rawInput = (opts ?? {}) as Record<string, unknown>;
  const ownKeys = Object.keys(rawInput);
  let inheritedKey: string | undefined;
  for (const key in rawInput) {
    if (!hasOwn(rawInput, key)) {
      inheritedKey = key;
      break;
    }
  }
  const unknownKey = ownKeys.find(
    (key) => !optionNames.includes(key as keyof Opts),
  );
  const enumerableSymbol = Object.getOwnPropertySymbols(rawInput).find(
    (symbol) => isOwnEnumerable(rawInput, symbol),
  );
  if (
    unknownKey !== undefined ||
    inheritedKey !== undefined ||
    enumerableSymbol !== undefined
  ) {
    const invalidKey =
      unknownKey ?? inheritedKey ?? String(enumerableSymbol as symbol);
    throw new TypeError(
      `string-remove-widows/removeWidows(): [THROW_ID_04] every option must be an own, known string key; received ${JSON.stringify(invalidKey)}.`,
    );
  }
  const input = Object.create(null) as Record<string, unknown>;
  for (const key of ownKeys) {
    input[key] = rawInput[key];
  }

  for (const key of [
    "removeWidowPreventionMeasures",
    "convertEntities",
    "UKPostcodes",
    "hyphens",
  ] as const) {
    if (key in input && typeof input[key] !== "boolean") {
      throw new TypeError(
        `string-remove-widows/removeWidows(): [THROW_ID_05] option ${JSON.stringify(key)} must be Boolean, but it was ${formatDiagnosticValue(input[key], 4)}.`,
      );
    }
  }

  if (
    "targetLanguage" in input &&
    !["html", "css", "js"].includes(input.targetLanguage as string)
  ) {
    throw new TypeError(
      `string-remove-widows/removeWidows(): [THROW_ID_06] option "targetLanguage" must be exactly "html", "css", or "js", but it was ${formatDiagnosticValue(input.targetLanguage, 4)}.`,
    );
  }

  for (const key of ["minWordCount", "minCharCount"] as const) {
    const value = input[key];
    if (
      key in input &&
      value !== false &&
      value !== null &&
      (typeof value !== "number" || !Number.isFinite(value) || value < 0)
    ) {
      throw new TypeError(
        `string-remove-widows/removeWidows(): [THROW_ID_07] option ${JSON.stringify(key)} must be a finite non-negative number, false, or null, but it was ${formatDiagnosticValue(value, 4)}.`,
      );
    }
  }

  const normalizedIgnore = normalizeIgnore(
    "ignore" in input ? input.ignore : internalDefaults.ignore,
  );
  if (!normalizedIgnore.ok) {
    if (normalizedIgnore.kind === "shape") {
      throw new TypeError(
        `string-remove-widows/removeWidows(): [THROW_ID_08] ${normalizedIgnore.detail}`,
      );
    }
    throw new TypeError(
      `string-remove-widows/removeWidows(): [THROW_ID_09] ${normalizedIgnore.detail}`,
    );
  }

  const progress =
    "reportProgressFunc" in input
      ? input.reportProgressFunc
      : internalDefaults.reportProgressFunc;
  if (
    progress !== false &&
    progress !== null &&
    typeof progress !== "function"
  ) {
    throw new TypeError(
      `string-remove-widows/removeWidows(): [THROW_ID_10] option "reportProgressFunc" must be a function, false, or null, but it was ${formatDiagnosticValue(progress, 4)}.`,
    );
  }

  for (const key of [
    "reportProgressFuncFrom",
    "reportProgressFuncTo",
  ] as const) {
    const value = key in input ? input[key] : internalDefaults[key];
    if (
      typeof value !== "number" ||
      !Number.isInteger(value) ||
      value < 0 ||
      value > 100
    ) {
      throw new TypeError(
        `string-remove-widows/removeWidows(): [THROW_ID_11] option ${JSON.stringify(key)} must be an integer from 0 through 100, but it was ${formatDiagnosticValue(value, 4)}.`,
      );
    }
  }
  const progressFrom =
    (input.reportProgressFuncFrom as number | undefined) ??
    internalDefaults.reportProgressFuncFrom;
  const progressTo =
    (input.reportProgressFuncTo as number | undefined) ??
    internalDefaults.reportProgressFuncTo;
  if (progressFrom > progressTo) {
    throw new RangeError(
      `string-remove-widows/removeWidows(): [THROW_ID_12] option "reportProgressFuncFrom" (${progressFrom}) must not exceed "reportProgressFuncTo" (${progressTo}).`,
    );
  }

  const normalizedTagRanges = normalizeTagRanges(
    "tagRanges" in input ? input.tagRanges : [],
    str.length,
  );
  if (!normalizedTagRanges.ok) {
    if (normalizedTagRanges.kind === "container") {
      throw new TypeError(
        `string-remove-widows/removeWidows(): [THROW_ID_13] ${normalizedTagRanges.detail}`,
      );
    }
    throw new TypeError(
      `string-remove-widows/removeWidows(): [THROW_ID_14] ${normalizedTagRanges.detail}`,
    );
  }

  return {
    removeWidowPreventionMeasures:
      (input.removeWidowPreventionMeasures as boolean | undefined) ??
      internalDefaults.removeWidowPreventionMeasures,
    convertEntities:
      (input.convertEntities as boolean | undefined) ??
      internalDefaults.convertEntities,
    targetLanguage:
      (input.targetLanguage as ResolvedOpts["targetLanguage"] | undefined) ??
      internalDefaults.targetLanguage,
    UKPostcodes:
      (input.UKPostcodes as boolean | undefined) ??
      internalDefaults.UKPostcodes,
    hyphens: (input.hyphens as boolean | undefined) ?? internalDefaults.hyphens,
    minWordCount:
      "minWordCount" in input
        ? (input.minWordCount as CountThreshold)
        : internalDefaults.minWordCount,
    minCharCount:
      "minCharCount" in input
        ? (input.minCharCount as CountThreshold)
        : internalDefaults.minCharCount,
    ignore: normalizedIgnore.value,
    reportProgressFunc:
      typeof progress === "function"
        ? (progress as (percDone: number) => void)
        : null,
    reportProgressFuncFrom: progressFrom,
    reportProgressFuncTo: progressTo,
    tagRanges: normalizedTagRanges.value,
  };
}

// main export
export { defaults, removeWidows, version };
