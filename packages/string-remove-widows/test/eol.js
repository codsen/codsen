import tap from "tap";
import { removeWidows } from "../dist/string-remove-widows.esm";
import {
  rawnbsp,
  encodedNbspHtml,
  encodedNbspCss,
  encodedNbspJs,
  // rawNdash,
  // rawMdash,
} from "./util";

const languages = ["html`, `css`, `js"];
const encodedNbsps = [encodedNbspHtml, encodedNbspCss, encodedNbspJs];
const eolTypes = ["LF`, `CR`, `CRLF"];

// -----------------------------------------------------------------------------
// line endings
// -----------------------------------------------------------------------------

tap.test(
  `01 - \u001b[${34}m${`line endings`}\u001b[${39}m - does not mangle string with consistent line endings`,
  (t) => {
    ["\n`, `\r`, `\r\n"].forEach((eolType, idx) => {
      languages.forEach((targetLanguage, i) => {
        t.equal(
          removeWidows(
            `Here is a very long line of text${eolType}${eolType}Here is a another long line of text${eolType}${eolType}Here is a another long line of text`,
            {
              convertEntities: false,
              hyphens: true,
              targetLanguage,
              minCharCount: 5,
            }
          ).res,
          `Here is a very long line of${rawnbsp}text${eolType}${eolType}Here is a another long line of${rawnbsp}text${eolType}${eolType}Here is a another long line of${rawnbsp}text`,
          `04.01.01.0${1 + i + idx} - ${targetLanguage} - raw - two ${
            eolTypes[idx]
          }`
        );
        t.equal(
          removeWidows(
            `Here is a very long line of text${eolType}${eolType}Here is a another long line of text${eolType}${eolType}Here is a another long line of text`,
            {
              convertEntities: true,
              hyphens: true,
              targetLanguage,
              minCharCount: 5,
            }
          ).res,
          `Here is a very long line of${encodedNbsps[i]}text${eolType}${eolType}Here is a another long line of${encodedNbsps[i]}text${eolType}${eolType}Here is a another long line of${encodedNbsps[i]}text`,
          `04.01.02.0${2 + i + idx} - ${targetLanguage} - encoded - two ${
            eolTypes[idx]
          }`
        );

        // trailing line breaks:
        t.equal(
          removeWidows(
            `Here is a very long line of text${eolType}${eolType}Here is a another long line of text${eolType}${eolType}Here is a another long line of text${eolType}${eolType}`,
            {
              convertEntities: false,
              hyphens: true,
              targetLanguage,
              minCharCount: 5,
            }
          ).res,
          `Here is a very long line of${rawnbsp}text${eolType}${eolType}Here is a another long line of${rawnbsp}text${eolType}${eolType}Here is a another long line of${rawnbsp}text${eolType}${eolType}`,
          `04.01.03.0${3 + i + idx} - ${targetLanguage} - raw - two ${
            eolTypes[idx]
          } - trailing line breaks`
        );
        t.equal(
          removeWidows(
            `Here is a very long line of text${eolType}${eolType}Here is a another long line of text${eolType}${eolType}Here is a another long line of text${eolType}${eolType}`,
            {
              convertEntities: true,
              hyphens: true,
              targetLanguage,
              minCharCount: 5,
            }
          ).res,
          `Here is a very long line of${encodedNbsps[i]}text${eolType}${eolType}Here is a another long line of${encodedNbsps[i]}text${eolType}${eolType}Here is a another long line of${encodedNbsps[i]}text${eolType}${eolType}`,
          `04.01.04.0${4 + i + idx} - ${targetLanguage} - encoded - two ${
            eolTypes[idx]
          } - trailing line breaks`
        );
      });
    });
    t.end();
  }
);
