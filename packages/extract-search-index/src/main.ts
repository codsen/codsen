import { formatDiagnosticValue } from "codsen-utils";
import { decode } from "html-entity-codec";
import { stripHtml } from "string-strip-html";
import { unfancy } from "string-unfancy";
import { version as v } from "../package.json";
import { removeUrls } from "./urls";

const version: string = v;

function stripMarkup(str: string): string {
  return str.includes("<")
    ? stripHtml(str, {
        skipHtmlDecoding: true,
        stripTogetherWithTheirContents: [
          "script",
          "style",
          "xml",
          "code",
          "pre",
        ],
      }).result
    : str;
}

function extract(str: string): string {
  // Insurance
  if (typeof str !== "string") {
    throw new Error(
      `extract-search-index/extract(): [THROW_ID_01] The input is not string! It was given as ${formatDiagnosticValue(str, 4)} (typeof is ${typeof str})`,
    );
  }

  // Attribute delimiters belong to the original HTML, before text decoding.
  let text = stripMarkup(str);
  while (text.includes("&")) {
    const decoded = decode(text);
    if (decoded === text) break;
    // Retain the existing interpretation of recursively encoded HTML as markup.
    text = stripMarkup(decoded);
  }

  // ASCII cannot change under NFC; decoding has already reached a fixed point.
  const hasNonAscii = /[\u0080-\uFFFF]/.test(text);
  text = unfancy(hasNonAscii ? text.normalize("NFC") : text, {
    preserveCombiningMarks: true,
  }).toLowerCase();
  if (hasNonAscii) text = text.normalize("NFC");

  return [
    // Remove duplicated words using Set
    ...new Set(
      removeUrls(text)
        // Decode first, and recognize complete URLs before separating characters.
        .replace(/[\uD800-\uDFFF]/g, " ")
        // remove newlines, and punctuation
        .replace(
          /\.|,|;|:|"|\+|=|'|`|\^|\?|!|\/|\(|\)|{|}|>|<|#|-|–|—|\n|\r|\t|\[|\]|\d/g,
          " ",
        )
        // split by whitespace
        .split(/\s+/),
    ),
  ]
    .filter(
      (keyw) =>
        ![
          "a",
          "all",
          "am",
          "an",
          "and",
          "as",
          "at",
          "be",
          "but",
          "d",
          "do",
          "for",
          "has",
          "i",
          "if",
          "in",
          "is",
          "it",
          "ll",
          "me",
          "my",
          "no",
          "not",
          "of",
          "off",
          "on",
          "or",
          "s",
          "so",
          "to",
          "up",
          "ve",
          "was",
          "we",
          "you",
          "the",
        ].includes(keyw) && keyw.length > 1,
    )
    .filter((val) => !val.includes("\\"))
    .join(" ")
    .trim();
}

export { extract, version };
