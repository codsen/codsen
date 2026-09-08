import { readCssToken } from "string-extract-class-names";

export interface CssRegion {
  start: number;
  end: number;
  inline: boolean;
  quote: '"' | "'" | null;
  source: string;
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

export function getCssEscapeRanges(regions: CssRegion[]): [number, number][] {
  const ranges: [number, number][] = [];
  for (const region of regions) {
    if (!region.source.includes("\\")) continue;
    let escapedTokenBefore = false;
    for (let cursor = 0; cursor < region.source.length; ) {
      const token = readCssToken(region.source, cursor);
      if (!token) break;
      const escaped =
        token.kind !== "comment" &&
        (token.kind !== "delimiter" || token.raw === "\\") &&
        token.kind !== "whitespace" &&
        token.raw.includes("\\");
      if (escaped || (escapedTokenBefore && token.kind === "whitespace")) {
        ranges.push([
          region.start + token.range[0],
          region.start + token.range[1],
        ]);
      }
      escapedTokenBefore = escaped;
      cursor = token.range[1];
    }
  }
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
