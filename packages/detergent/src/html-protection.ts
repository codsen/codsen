import type { Range as RangeTuple } from "ranges-push";
import {
  type CbObj,
  type Opts as StripHtmlOpts,
  stripHtml,
} from "string-strip-html";

type Span = [from: number, to: number];
type Range = RangeTuple<string | null | undefined>;

function isHtmlWhitespace(char: string | undefined): boolean {
  return (
    char === " " ||
    char === "\t" ||
    char === "\n" ||
    char === "\f" ||
    char === "\r"
  );
}

function tagEnd(str: string, start: number): number {
  let quote: string | null = null;
  let expectingValue = false;
  let unquotedValue = false;
  for (let i = start; i < str.length; i++) {
    const char = str[i];
    if (quote) {
      if (char === quote) quote = null;
    } else if (char === ">") {
      return i + 1;
    } else if (expectingValue) {
      if (!isHtmlWhitespace(char)) {
        expectingValue = false;
        if (char === '"' || char === "'") quote = char;
        else unquotedValue = true;
      }
    } else if (unquotedValue) {
      if (isHtmlWhitespace(char)) unquotedValue = false;
    } else if (char === "=") {
      expectingValue = true;
    }
  }
  return str.length;
}

function rawTextEnd(str: string, start: number, name: string): number {
  for (
    let i = str.indexOf("</", start);
    i !== -1;
    i = str.indexOf("</", i + 2)
  ) {
    const afterName = i + name.length + 2;
    if (
      str.slice(i + 2, afterName).toLowerCase() === name &&
      (isHtmlWhitespace(str[afterName]) ||
        str[afterName] === "/" ||
        str[afterName] === ">")
    ) {
      return i;
    }
  }
  return str.length;
}

function collectStyleRanges(str: string): Span[] {
  const ranges: Span[] = [];
  for (let i = str.indexOf("<"); i !== -1; i = str.indexOf("<", i + 1)) {
    if (str.startsWith("<!--", i)) {
      if (str.startsWith("<!-->", i)) {
        i += 4;
      } else if (str.startsWith("<!--->", i)) {
        i += 5;
      } else {
        let end = str.indexOf("--", i + 4);
        while (
          end !== -1 &&
          str[end + 2] !== ">" &&
          !(str[end + 2] === "!" && str[end + 3] === ">")
        ) {
          end = str.indexOf("--", end + 1);
        }
        if (end === -1) break;
        i = end + (str[end + 2] === "!" ? 3 : 2);
      }
      continue;
    }
    if (str.startsWith("<![CDATA[", i)) {
      const end = str.indexOf("]]>", i + 9);
      if (end === -1) break;
      i = end + 2;
      continue;
    }
    if (
      str[i + 1] === "!" ||
      str[i + 1] === "?" ||
      (str[i + 1] === "/" && /[a-z]/i.test(str[i + 2] || ""))
    ) {
      i = tagEnd(str, i + 2) - 1;
      continue;
    }
    if (!/[a-z]/i.test(str[i + 1] || "")) continue;

    let nameEnd = i + 2;
    while (
      nameEnd < str.length &&
      !isHtmlWhitespace(str[nameEnd]) &&
      str[nameEnd] !== "/" &&
      str[nameEnd] !== ">"
    ) {
      nameEnd++;
    }
    const name = str.slice(i + 1, nameEnd).toLowerCase();
    const end = tagEnd(str, nameEnd);
    if (str[end - 1] !== ">") break;
    i = end - 1;
    if (name === "plaintext") break;
    if (
      name === "style" ||
      name === "script" ||
      name === "textarea" ||
      name === "title" ||
      name === "xmp" ||
      name === "iframe" ||
      name === "noembed" ||
      name === "noframes"
    ) {
      const contentEnd = rawTextEnd(str, end, name);
      if (name === "style" && end < contentEnd) {
        ranges.push([end, contentEnd]);
      }
      if (contentEnd === str.length) break;
      i = tagEnd(str, contentEnd + name.length + 2) - 1;
    }
  }
  return ranges;
}

function mergeSpans(ranges: Span[]): Span[] {
  ranges.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const merged: Span[] = [];
  for (const range of ranges) {
    const previous = merged[merged.length - 1];
    if (previous && range[0] <= previous[1]) {
      if (range[1] > previous[1]) previous[1] = range[1];
    } else {
      merged.push([range[0], range[1]]);
    }
  }
  return merged;
}

function firstEndingAfter(ranges: Span[], index: number): Span | undefined {
  let low = 0;
  let high = ranges.length;
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (ranges[mid][1] <= index) low = mid + 1;
    else high = mid;
  }
  return ranges[low];
}

// Numeric fields on public tag and attribute tokens are source positions.
// Strings and boolean/null sentinels must retain their original values.
function offsetPositions<T extends object>(obj: T, offset: number): T {
  const shifted = { ...obj };
  for (const key in shifted) {
    const value = shifted[key];
    if (typeof value === "number") {
      shifted[key] = (value + offset) as T[typeof key];
    }
  }
  return shifted;
}

function offsetCallback(obj: CbObj, offset: number): CbObj {
  if (!offset) return obj;
  const shiftedTag = offsetPositions(obj.tag, offset);
  const tag =
    shiftedTag.kind === "tag" && shiftedTag.status !== "inferred"
      ? {
          ...shiftedTag,
          attributes: shiftedTag.attributes.map((attribute) =>
            offsetPositions(attribute, offset),
          ),
        }
      : shiftedTag;
  return {
    ...obj,
    tag,
    deleteFrom:
      typeof obj.deleteFrom === "number" ? obj.deleteFrom + offset : null,
    deleteTo: typeof obj.deleteTo === "number" ? obj.deleteTo + offset : null,
    proposedReturn: obj.proposedReturn
      ? [
          obj.proposedReturn[0] + offset,
          obj.proposedReturn[1] + offset,
          obj.proposedReturn[2],
        ]
      : null,
  };
}

// Every range belongs to the latest source passed to refresh(). Explicit HTML
// normalization may edit tag markup; all prose transformations use these guards.
export class HtmlProtection {
  private source: string | null = null;
  private protectedRanges: Span[] = [];
  private callbackProtectedRanges: Span[] = [];
  private callbackRangesMerged = true;
  private retainedStyleRanges: Span[] = [];

  constructor(private readonly retainedStyle: boolean) {}

  get ranges(): Span[] {
    return this.protectedRanges;
  }

  get styleRanges(): Span[] {
    return this.retainedStyleRanges;
  }

  get callbackRanges(): Span[] {
    if (!this.callbackRangesMerged) {
      this.callbackProtectedRanges = mergeSpans(this.callbackProtectedRanges);
      this.callbackRangesMerged = true;
    }
    return this.callbackProtectedRanges;
  }

  refresh(str: string): void {
    if (str === this.source) return;
    this.source = str;
    this.protectedRanges = [];
    this.callbackProtectedRanges = [];
    this.callbackRangesMerged = true;
    this.retainedStyleRanges = [];
    if (!str.includes("<") && !str.includes(">")) return;

    const styleRanges = /<style[\t\n\f\r />]/i.test(str)
      ? collectStyleRanges(str)
      : [];
    if (this.retainedStyle) this.retainedStyleRanges = styleRanges;
    const ranges: Span[] = [...this.retainedStyleRanges];
    const callbackRanges: Span[] = [...styleRanges];
    let start = 0;

    // Parsing disjoint HTML segments prevents apparent tags in CSS strings from
    // swallowing the authoritative closing style tag or following real markup.
    const collectTags = (end: number): void => {
      if (start >= end) return;
      const source =
        start === 0 && end === str.length ? str : str.slice(start, end);
      if (!source.includes("<") && !source.includes(">")) return;
      stripHtml(source, {
        skipHtmlDecoding: true,
        cb: ({ tag }) => {
          if (tag.start < tag.end) {
            const range: Span = [start + tag.start, start + tag.end];
            callbackRanges.push(range);
            // An unfinished opening fragment remains eligible prose, while
            // the callback contract excludes every recognized token shape.
            if (
              tag.kind !== "tag" ||
              tag.status === "complete" ||
              (tag.status === "incomplete" && Boolean(tag.slashPresent))
            ) {
              ranges.push(range);
            }
          }
        },
      });
    };

    for (const range of styleRanges) {
      collectTags(range[0]);
      start = range[1];
    }
    collectTags(str.length);
    this.protectedRanges = mergeSpans(ranges);
    this.callbackProtectedRanges = callbackRanges;
    this.callbackRangesMerged = false;
  }

  forEachTag(cb: (obj: CbObj) => void, opts: Partial<StripHtmlOpts>): void {
    const str = this.source;
    if (!str) return;
    if (!this.retainedStyleRanges.length) {
      stripHtml(str, { ...opts, cb });
      return;
    }
    let start = 0;
    const collectTags = (end: number): void => {
      if (start >= end) return;
      stripHtml(str.slice(start, end), {
        ...opts,
        cb: (obj) => cb(offsetCallback(obj, start)),
      });
    };
    for (const range of this.retainedStyleRanges) {
      collectTags(range[0]);
      start = range[1];
    }
    collectTags(str.length);
  }

  contains(index: number): boolean {
    return this.intersects(index, index + 1);
  }

  containsStyle(index: number): boolean {
    const range = firstEndingAfter(this.retainedStyleRanges, index);
    return Boolean(range && range[0] <= index);
  }

  intersects(from: number, to: number): boolean {
    const range = firstEndingAfter(this.protectedRanges, from);
    return Boolean(range && (from === to ? range[0] < from : range[0] < to));
  }

  filter(ranges: Range[] | null): Range[] | null {
    if (!ranges?.length || !this.protectedRanges.length) return ranges;
    const filtered = ranges.filter(
      (range) => !this.intersects(range[0], range[1]),
    );
    return filtered.length ? filtered : null;
  }
}
