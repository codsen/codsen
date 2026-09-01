// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { removeWidows } from "../dist/string-remove-widows.esm.js";
import {
  encodedNbspCss,
  encodedNbspHtml,
  encodedNbspJs,
  rawnbsp,
  // rawNdash,
  // rawMdash,
} from "./util.js";

const languages = ["html", "css", "js"];
const encodedNbsps = [encodedNbspHtml, encodedNbspCss, encodedNbspJs];
const eolTypes = ["LF", "CR", "CRLF"];

// -----------------------------------------------------------------------------
// line endings
// -----------------------------------------------------------------------------

test(`01 - line endings - does not mangle string with consistent line endings`, () => {
  ["\n", "\r", "\r\n"].forEach((eolType, idx) => {
    languages.forEach((targetLanguage, i) => {
      equal(
        removeWidows(
          `Here is a very long line of text${eolType}${eolType}Here is a another long line of text${eolType}${eolType}Here is a another long line of text`,
          {
            convertEntities: false,
            hyphens: true,
            targetLanguage,
            minCharCount: 5,
          },
        ).res,
        `Here is a very long line of${rawnbsp}text${eolType}${eolType}Here is a another long line of${rawnbsp}text${eolType}${eolType}Here is a another long line of${rawnbsp}text`,
        `01.01 - 01.0${1 + i + idx} - ${targetLanguage} - raw - two ${
          eolTypes[idx]
        }`,
      );
      equal(
        removeWidows(
          `Here is a very long line of text${eolType}${eolType}Here is a another long line of text${eolType}${eolType}Here is a another long line of text`,
          {
            convertEntities: true,
            hyphens: true,
            targetLanguage,
            minCharCount: 5,
          },
        ).res,
        `Here is a very long line of${encodedNbsps[i]}text${eolType}${eolType}Here is a another long line of${encodedNbsps[i]}text${eolType}${eolType}Here is a another long line of${encodedNbsps[i]}text`,
        `01.02 - 02.0${2 + i + idx} - ${targetLanguage} - encoded - two ${
          eolTypes[idx]
        }`,
      );

      // trailing line breaks:
      equal(
        removeWidows(
          `Here is a very long line of text${eolType}${eolType}Here is a another long line of text${eolType}${eolType}Here is a another long line of text${eolType}${eolType}`,
          {
            convertEntities: false,
            hyphens: true,
            targetLanguage,
            minCharCount: 5,
          },
        ).res,
        `Here is a very long line of${rawnbsp}text${eolType}${eolType}Here is a another long line of${rawnbsp}text${eolType}${eolType}Here is a another long line of${rawnbsp}text${eolType}${eolType}`,
        `01.03 - 03.0${3 + i + idx} - ${targetLanguage} - raw - two ${
          eolTypes[idx]
        } - trailing line breaks`,
      );
      equal(
        removeWidows(
          `Here is a very long line of text${eolType}${eolType}Here is a another long line of text${eolType}${eolType}Here is a another long line of text${eolType}${eolType}`,
          {
            convertEntities: true,
            hyphens: true,
            targetLanguage,
            minCharCount: 5,
          },
        ).res,
        `Here is a very long line of${encodedNbsps[i]}text${eolType}${eolType}Here is a another long line of${encodedNbsps[i]}text${eolType}${eolType}Here is a another long line of${encodedNbsps[i]}text${eolType}${eolType}`,
        `01.04 - 04.0${4 + i + idx} - ${targetLanguage} - encoded - two ${
          eolTypes[idx]
        } - trailing line breaks`,
      );
    });
  });
});

test.run();
