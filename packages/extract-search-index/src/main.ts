import { stripHtml } from "string-strip-html";
import { unfancy } from "string-unfancy";
import { version as v } from "../package.json";

const version: string = v;

function extract(str: string): string {
  // Insurance
  if (typeof str !== "string") {
    throw new Error(
      `extract-search-index: [THROW_ID_01] The input is not string! It was given as ${JSON.stringify(
        str,
        null,
        4,
      )} (typeof is ${typeof str})`,
    );
  }

  return [
    // Remove duplicated words using Set
    ...new Set(
      stripHtml(
        unfancy(
          str
            .split("")
            // remove surrogates and any emoji
            .map((char) => (char.charCodeAt(0) < 55291 ? char : " "))
            .join(""),
        ),
        {
          stripTogetherWithTheirContents: [
            "script",
            "style",
            "xml",
            "code",
            "pre",
          ],
        },
      )
        .result.toLowerCase()

        // remove url's - https://stackoverflow.com/a/3809435/3943954
        .replace(
          /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g,
          "",
        )
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
