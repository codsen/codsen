import { scanReference } from "html-entity-codec";
import { type CssToken, readCssToken } from "string-extract-class-names";

export interface CssSourceMapping {
  decodedFrom: number;
  decodedTo: number;
  from: number;
  to: number;
}

export interface DecodedCssView {
  source: string;
  mappings: CssSourceMapping[];
}

export interface CssRegion {
  start: number;
  end: number;
  inline: boolean;
  quote: '"' | "'" | null;
  source: string;
  decoded?: DecodedCssView;
}

export interface CssCommentToken {
  from: number;
  to: number;
  region: CssRegion;
  closed: boolean;
  replacement: "" | "/**/";
  canExpand: boolean;
}

export interface CssAnalysis {
  escapeRanges: [number, number][];
  opaqueRanges: [number, number][];
  commentTokens: CssCommentToken[];
  inlineReferenceRanges: [number, number][];
  commentBoundaryRanges: [number, number][];
}

function isAsciiWhitespace(char: string | undefined): boolean {
  return (
    char === " " ||
    char === "\t" ||
    char === "\n" ||
    char === "\f" ||
    char === "\r"
  );
}

function asciiLowerCase(str: string): string {
  return str.replace(/[A-Z]/g, (char) => char.toLowerCase());
}

function tagEndsAt(str: string, start: number): number {
  let quote: '"' | "'" | null = null;
  for (let cursor = start; cursor < str.length; cursor++) {
    if (quote) {
      if (str[cursor] === quote) quote = null;
    } else if (str[cursor] === '"' || str[cursor] === "'") {
      quote = str[cursor] as '"' | "'";
    } else if (str[cursor] === ">") {
      return cursor;
    }
  }
  return str.length;
}

function rawTextEndsAt(str: string, start: number, name: string): number {
  for (
    let cursor = str.indexOf("</", start);
    cursor !== -1;
    cursor = str.indexOf("</", cursor + 2)
  ) {
    const afterName = cursor + name.length + 2;
    if (
      asciiLowerCase(str.slice(cursor + 2, afterName)) === name &&
      (isAsciiWhitespace(str[afterName]) ||
        str[afterName] === "/" ||
        str[afterName] === ">")
    ) {
      return cursor;
    }
  }
  return str.length;
}

// HTML boundaries are authoritative even when CSS has an unfinished string,
// comment, escape, or block. Attribute offsets exclude their HTML quotes.
export function collectCssRegions(str: string): CssRegion[] {
  const regions: CssRegion[] = [];
  for (
    let openingAt = str.indexOf("<");
    openingAt !== -1;
    openingAt = str.indexOf("<", openingAt + 1)
  ) {
    if (str.startsWith("<!--", openingAt)) {
      const conditional = /^<!--\[if[\t\n\f\r (!]/i.test(
        str.slice(openingAt, openingAt + 8),
      );
      if (conditional) {
        const end = str.indexOf(">", openingAt + 7);
        if (end === -1) break;
        openingAt = end;
      } else if (str.startsWith("<!-->", openingAt)) {
        // Downlevel-revealed conditional comments use this empty comment.
        openingAt += 4;
      } else if (str.startsWith("<!--->", openingAt)) {
        openingAt += 5;
      } else {
        let end = str.indexOf("--", openingAt + 4);
        while (
          end !== -1 &&
          str[end + 2] !== ">" &&
          !(str[end + 2] === "!" && str[end + 3] === ">")
        ) {
          end = str.indexOf("--", end + 1);
        }
        if (end === -1) break;
        openingAt = end + (str[end + 2] === "!" ? 3 : 2);
      }
      continue;
    }

    if (
      str[openingAt + 1] === "/" ||
      str[openingAt + 1] === "!" ||
      str[openingAt + 1] === "?"
    ) {
      openingAt = tagEndsAt(str, openingAt + 2);
      continue;
    }
    if (!/[a-z]/i.test(str[openingAt + 1] || "")) continue;

    let cursor = openingAt + 1;
    const nameFrom = cursor;
    while (
      cursor < str.length &&
      !isAsciiWhitespace(str[cursor]) &&
      str[cursor] !== "/" &&
      str[cursor] !== ">"
    ) {
      cursor++;
    }
    const tagName = asciiLowerCase(str.slice(nameFrom, cursor));
    let styleAttributeSeen = false;

    while (cursor < str.length) {
      while (isAsciiWhitespace(str[cursor])) cursor++;
      if (str[cursor] === ">") break;
      if (str[cursor] === "/" && str[cursor + 1] === ">") {
        cursor++;
        break;
      }

      const attributeFrom = cursor;
      while (
        cursor < str.length &&
        !isAsciiWhitespace(str[cursor]) &&
        !"=/>".includes(str[cursor])
      ) {
        cursor++;
      }
      if (cursor === attributeFrom) {
        cursor++;
        continue;
      }
      const attributeName = asciiLowerCase(str.slice(attributeFrom, cursor));
      const capture = attributeName === "style" && !styleAttributeSeen;
      if (attributeName === "style") styleAttributeSeen = true;
      while (isAsciiWhitespace(str[cursor])) cursor++;
      if (str[cursor] !== "=") continue;
      cursor++;
      while (isAsciiWhitespace(str[cursor])) cursor++;

      let quote: '"' | "'" | null = null;
      if (str[cursor] === '"' || str[cursor] === "'") {
        quote = str[cursor] as '"' | "'";
        cursor++;
      }
      const start = cursor;
      if (quote) {
        const close = str.indexOf(quote, cursor);
        cursor = close === -1 ? str.length : close;
      } else {
        // In HTML an unquoted value includes slashes, backslashes, and quotes;
        // only ASCII whitespace or '>' ends it, despite other parse errors.
        while (
          cursor < str.length &&
          !isAsciiWhitespace(str[cursor]) &&
          str[cursor] !== ">"
        ) {
          cursor++;
        }
      }
      if (capture) {
        regions.push({
          start,
          end: cursor,
          inline: true,
          quote,
          source: str.slice(start, cursor),
        });
      }
      if (quote && str[cursor] === quote) cursor++;
    }

    openingAt = cursor;
    if (cursor >= str.length || tagName === "plaintext") break;
    if (
      tagName === "style" ||
      tagName === "script" ||
      tagName === "textarea" ||
      tagName === "title" ||
      tagName === "xmp" ||
      tagName === "iframe" ||
      tagName === "noembed" ||
      tagName === "noframes"
    ) {
      const start = cursor + 1;
      const end = rawTextEndsAt(str, start, tagName);
      if (tagName === "style") {
        regions.push({
          start,
          end,
          inline: false,
          quote: null,
          source: str.slice(start, end),
        });
      }
      openingAt =
        end === str.length ? end : tagEndsAt(str, end + tagName.length + 2);
    }
  }
  return regions;
}

function decodeInlineCss(region: CssRegion): DecodedCssView {
  const raw = region.source;
  const mappings: CssSourceMapping[] = [];
  if (!raw.includes("&") && !raw.includes("\r") && !raw.includes("\u0000")) {
    return { source: raw, mappings };
  }
  const parts: string[] = [];
  let from = 0;
  let decodedLength = 0;
  for (let cursor = 0; cursor < raw.length; ) {
    const code = raw.charCodeAt(cursor);
    let replacement: string | undefined;
    let to = cursor + 1;
    if (code === 38) {
      const reference = scanReference(raw, cursor, { context: "attribute" });
      if (reference) {
        replacement = reference.value;
        to = reference.end;
      }
    } else if (code === 13) {
      // HTML preprocesses literal line endings before decoding references.
      // A CR emitted by a reference above is therefore left as a CR.
      replacement = "\n";
      if (raw.charCodeAt(to) === 10) to++;
    } else if (code === 0) {
      replacement = "\uFFFD";
    }

    if (replacement !== undefined) {
      const plain = raw.slice(from, cursor);
      parts.push(plain, replacement);
      decodedLength += plain.length;
      mappings.push({
        decodedFrom: decodedLength,
        decodedTo: decodedLength + replacement.length,
        from: region.start + cursor,
        to: region.start + to,
      });
      decodedLength += replacement.length;
      from = to;
    }
    cursor = to;
  }
  parts.push(raw.slice(from));
  return { source: parts.join(""), mappings };
}

function rawOffset(region: CssRegion, offset: number, end: boolean): number {
  const mappings = region.decoded?.mappings;
  if (!mappings?.length) return region.start + offset;
  let low = 0;
  let high = mappings.length;
  while (low < high) {
    const middle = (low + high) >>> 1;
    if (mappings[middle].decodedFrom <= offset) low = middle + 1;
    else high = middle;
  }
  if (!low) return region.start + offset;
  const mapping = mappings[low - 1];
  if (offset === mapping.decodedFrom) return mapping.from;
  if (offset < mapping.decodedTo) return end ? mapping.to : mapping.from;
  return mapping.to + offset - mapping.decodedTo;
}

function mergeRanges(ranges: [number, number][]): [number, number][] {
  ranges.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const merged: [number, number][] = [];
  for (const range of ranges) {
    const previous = merged[merged.length - 1];
    if (previous && range[0] <= previous[1]) {
      previous[1] = Math.max(previous[1], range[1]);
    } else {
      merged.push(range);
    }
  }
  return merged;
}

export function getCssAnalysis(regions: CssRegion[]): CssAnalysis {
  const escapeRanges: [number, number][] = [];
  const opaqueRanges: [number, number][] = [];
  const commentTokens: CssCommentToken[] = [];
  const inlineReferenceRanges: [number, number][] = [];
  const commentBoundaryRanges: [number, number][] = [];
  for (const region of regions) {
    if (region.inline) {
      region.decoded ||= decodeInlineCss(region);
      if (region.source.includes("&")) {
        inlineReferenceRanges.push([region.start, region.end]);
      }
    }
    // Style-element raw text is CSS source, never HTML reference syntax.
    const source = region.inline
      ? (region.decoded as DecodedCssView).source
      : region.source;
    let escapedTokenBefore = false;
    let previousToken: CssToken | null = null;
    let previousSignificantToken: CssToken | null = null;
    for (let cursor = 0; cursor < source.length; ) {
      const token = readCssToken(source, cursor);
      if (!token) break;
      const data =
        token.kind === "string" ||
        token.kind === "bad-string" ||
        token.kind === "url" ||
        token.kind === "bad-url";
      const escaped =
        token.kind !== "comment" &&
        (token.kind !== "delimiter" || token.raw === "\\") &&
        token.kind !== "whitespace" &&
        token.raw.includes("\\");
      const protectedWhitespace =
        escapedTokenBefore && token.kind === "whitespace";
      if (data || escaped || protectedWhitespace || token.kind === "comment") {
        const from = rawOffset(region, token.range[0], false);
        const to = rawOffset(region, token.range[1], true);
        if (data || escaped || protectedWhitespace)
          escapeRanges.push([from, to]);
        if (data || escaped) opaqueRanges.push([from, to]);
        if (token.kind === "comment") {
          const nextToken = readCssToken(source, token.range[1]);
          const nextSignificantToken =
            nextToken?.kind === "whitespace"
              ? readCssToken(source, nextToken.range[1])
              : nextToken;
          // These punctuators cannot join an adjacent token. Other apparent
          // boundaries include numbers, hashes, functions and selector data;
          // the partial reader deliberately does not classify all of those.
          const canExpand =
            !previousSignificantToken ||
            !nextSignificantToken ||
            [previousSignificantToken, nextSignificantToken].some(
              (neighbor) =>
                neighbor?.kind === "delimiter" &&
                "{};,".includes(neighbor.raw),
            );
          const separated =
            previousToken?.kind === "whitespace" ||
            (nextToken?.kind === "whitespace" &&
              !previousToken?.raw.includes("\\"));
          // A colon stays a delimiter, but expanding through whitespace beside
          // it could change a descendant pseudo-selector into a compound one.
          const adjacentColon = [previousToken, nextToken].some(
            (neighbor) =>
              neighbor?.kind === "delimiter" && neighbor.raw === ":",
          );
          const replacement =
            canExpand || separated || adjacentColon ? "" : "/**/";
          if (!canExpand) {
            let boundaryFrom = token.range[0];
            let boundaryTo = token.range[1];
            while (isAsciiWhitespace(source[boundaryFrom - 1])) boundaryFrom--;
            while (isAsciiWhitespace(source[boundaryTo])) boundaryTo++;
            commentBoundaryRanges.push([
              rawOffset(region, boundaryFrom, false),
              rawOffset(region, boundaryTo, true),
            ]);
          }
          commentTokens.push({
            from,
            to,
            region,
            closed: token.raw.length >= 4 && token.raw.endsWith("*/"),
            replacement,
            canExpand,
          });
        }
      }
      escapedTokenBefore = escaped || token.kind === "bad-string";
      previousToken = token;
      if (token.kind !== "whitespace") previousSignificantToken = token;
      cursor = token.range[1];
    }
  }
  commentTokens.sort((a, b) => a.from - b.from || a.to - b.to);
  return {
    escapeRanges: mergeRanges(escapeRanges),
    opaqueRanges: mergeRanges(opaqueRanges),
    commentTokens,
    inlineReferenceRanges: mergeRanges(inlineReferenceRanges),
    commentBoundaryRanges: mergeRanges(commentBoundaryRanges),
  };
}
