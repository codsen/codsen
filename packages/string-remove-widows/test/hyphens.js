// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import {
  removeWidows,
  // version
} from "../dist/string-remove-widows.esm.js";
import {
  encodedNbspCss,
  encodedNbspHtml,
  encodedNbspJs,
  rawMdash,
  rawNdash,
  rawnbsp,
} from "./util.js";

const languages = ["html`, `css`, `js"];
const encodedNbsps = [encodedNbspHtml, encodedNbspCss, encodedNbspJs];
// const eolTypes = ["LF`, `CR`, `CRLF"];

// hyphens
// -----------------------------------------------------------------------------

test(`01 - opts.hyphens - in front of dashes`, () => {
  [rawMdash, rawNdash, "-"].forEach((oneOfDashes) => {
    languages.forEach((targetLanguage, i) => {
      equal(
        removeWidows(
          `Here is a very long line of text ${oneOfDashes} not too long though`,
          {
            convertEntities: false,
            hyphens: true,
            targetLanguage,
            minCharCount: 5,
          },
        ).res,
        `Here is a very long line of text${rawnbsp}${oneOfDashes} not too long${rawnbsp}though`,
        `01.01 - 01 -${oneOfDashes} - ${targetLanguage}`,
      );
      equal(
        removeWidows(
          `Here is a very long line of text ${oneOfDashes} not too long though`,
          {
            convertEntities: true,
            hyphens: true,
            targetLanguage,
            minCharCount: 5,
          },
        ).res,
        `Here is a very long line of text${encodedNbsps[i]}${oneOfDashes} not too long${encodedNbsps[i]}though`,
        `01.02 - 02 -${oneOfDashes} - ${targetLanguage}`,
      );
      equal(
        removeWidows(
          `Here is a very long line of text ${oneOfDashes} not too long though`,
          {
            convertEntities: false,
            hyphens: false,
            targetLanguage,
            minCharCount: 5,
          },
        ).res,
        `Here is a very long line of text ${oneOfDashes} not too long${rawnbsp}though`,
        `01.03 - 03 -${oneOfDashes} - ${targetLanguage}`,
      );
      equal(
        removeWidows(
          `Here is a very long line of text ${oneOfDashes} not too long though`,
          {
            convertEntities: true,
            hyphens: false,
            targetLanguage,
            minCharCount: 5,
          },
        ).res,
        `Here is a very long line of text ${oneOfDashes} not too long${encodedNbsps[i]}though`,
        `01.04 - 04 -${oneOfDashes} - ${targetLanguage}`,
      );
    });
  });
});

test(`02 - opts.hyphens - hyphen is minus where currency follows`, () => {
  [rawMdash, rawNdash, "-"].forEach((oneOfDashes, y) => {
    languages.forEach((targetLanguage, i) => {
      equal(
        removeWidows(`Discount: ${oneOfDashes}&pound;10.00`, {
          convertEntities: false,
          hyphens: true,
          targetLanguage,
          minCharCount: 5,
        }).res,
        `Discount: ${oneOfDashes}&pound;10.00`,
        `02.01 - 0${i + y} - ${oneOfDashes} - ${targetLanguage}`,
      );
    });
  });
});

test(`03 - opts.hyphens - with ${encodedNbspHtml} and double space`, () => {
  languages.forEach((targetLanguage, i) => {
    equal(
      removeWidows("HOORAY  &mdash;  IT&rsquo;S HERE", {
        convertEntities: true,
        hyphens: true,
        targetLanguage,
        minCharCount: 5,
      }).res,
      `HOORAY${encodedNbsps[i]}&mdash;  IT&rsquo;S${encodedNbsps[i]}HERE`,
      `03.01 - 0${i} - ${targetLanguage}`,
    );
  });
});

test.run();
