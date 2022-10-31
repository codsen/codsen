import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { removeWidows } from "../dist/string-remove-widows.esm.js";
import {
  rawnbsp,
  encodedNbspHtml,
  encodedNbspCss,
  encodedNbspJs,
  // rawNdash,
  // rawMdash,
} from "./util.js";

// const languages = ["html`, `css`, `js"];
// const encodedNbsps = [encodedNbspHtml, encodedNbspCss, encodedNbspJs];
// const eolTypes = ["LF`, `CR`, `CRLF"];

// -----------------------------------------------------------------------------
// opts.UKPostcodes
// -----------------------------------------------------------------------------

test(`01 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - properly formatted UK postcode, in caps`, () => {
  equal(
    removeWidows(`Some text SW1A 1AA and some more text.`, {
      UKPostcodes: false,
      minCharCount: 5,
    }).res,
    `Some text SW1A 1AA and some more${encodedNbspHtml}text.`,
    "01.01"
  );
});

test(`02 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - properly formatted UK postcode, in caps`, () => {
  equal(
    removeWidows(`Some text SW1A 1AA and some more text.`, {
      UKPostcodes: true,
      minCharCount: 5,
    }).res,
    `Some text SW1A${encodedNbspHtml}1AA and some more${encodedNbspHtml}text.`,
    "02.01"
  );
});

test(`03 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - properly formatted UK postcode, in caps`, () => {
  equal(
    removeWidows(`Some text SW1A 1AA and some more text.`, {
      UKPostcodes: true,
      convertEntities: false,
      minCharCount: 5,
    }).res,
    `Some text SW1A${rawnbsp}1AA and some more${rawnbsp}text.`,
    "03.01"
  );
});

test(`04 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - properly formatted UK postcode, in caps`, () => {
  equal(
    removeWidows(`Some text SW1A 1AA and some more text.`, {
      UKPostcodes: true,
      convertEntities: true,
      targetLanguage: `css`,
      minCharCount: 5,
    }).res,
    `Some text SW1A${encodedNbspCss}1AA and some more${encodedNbspCss}text.`,
    "04.01"
  );
});

test(`05 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - multiple properly formatted postcodes`, () => {
  equal(
    removeWidows(
      `Some text SW1A 1AA and some more text SW1A 1AA and some more text.`,
      { UKPostcodes: false }
    ).res,
    `Some text SW1A 1AA and some more text SW1A 1AA and some more${encodedNbspHtml}text.`,
    "05.01"
  );
});

test(`06 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - multiple properly formatted postcodes`, () => {
  equal(
    removeWidows(
      `Some text SW1A 1AA and some more text SW1A 1AA and some more text.`,
      { UKPostcodes: true }
    ).res,
    `Some text SW1A${encodedNbspHtml}1AA and some more text SW1A${encodedNbspHtml}1AA and some more${encodedNbspHtml}text.`,
    "06.01"
  );
});

test(`07 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - line ends with a postcode (full stop)`, () => {
  equal(
    removeWidows(`This very long line of text ends with a postcode SW1A 1AA.`, {
      UKPostcodes: false,
      minCharCount: 5,
    }).res,
    `This very long line of text ends with a postcode SW1A${encodedNbspHtml}1AA.`,
    "07.01"
  );
});

test(`08 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - line ends with a postcode (full stop)`, () => {
  equal(
    removeWidows(`Postcode SW1A 1AA.`, {
      UKPostcodes: false,
      minCharCount: 5,
    }).res,
    `Postcode SW1A 1AA.`,
    "08.01"
  );
});

test(`09 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - line ends with a postcode (full stop)`, () => {
  equal(
    removeWidows(`This very long line of text ends with a postcode SW1A 1AA.`, {
      UKPostcodes: true,
      minCharCount: 5,
    }).res,
    `This very long line of text ends with a postcode SW1A${encodedNbspHtml}1AA.`,
    "09.01"
  );
});

test(`10 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - ${`\u001b[${33}m${`js`}\u001b[${39}m`} - line ends with a postcode (full stop)`, () => {
  equal(
    removeWidows(`This very long line of text ends with a postcode SW1A 1AA.`, {
      targetLanguage: `js`,
      UKPostcodes: false,
      minCharCount: 5,
    }).res,
    `This very long line of text ends with a postcode SW1A${encodedNbspJs}1AA.`,
    "10.01"
  );
});

test(`11 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - ${`\u001b[${33}m${`js`}\u001b[${39}m`} - line ends with a postcode (full stop) - default minimum word count (4) kicks in`, () => {
  equal(
    removeWidows(`Postcode SW1A 1AA.`, {
      targetLanguage: `js`,
      UKPostcodes: false,
      minCharCount: 5,
    }).res,
    `Postcode SW1A 1AA.`,
    "11.01"
  );
});

test(`12 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - ${`\u001b[${33}m${`js`}\u001b[${39}m`} - line ends with a postcode (full stop)`, () => {
  equal(
    removeWidows(`This very long line of text ends with a postcode SW1A 1AA.`, {
      targetLanguage: `js`,
      UKPostcodes: true,
      minCharCount: 5,
    }).res,
    `This very long line of text ends with a postcode SW1A${encodedNbspJs}1AA.`,
    "12.01"
  );
});

test(`13 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - ${`\u001b[${33}m${`js`}\u001b[${39}m`} - line ends with a postcode (full stop)`, () => {
  equal(
    removeWidows(`This very long line of text ends with a postcode SW1A 1AA.`, {
      targetLanguage: `js`,
      UKPostcodes: true,
      convertEntities: false,
      minCharCount: 5,
    }).res,
    `This very long line of text ends with a postcode SW1A${rawnbsp}1AA.`,
    "13.01"
  );
});

test(`14 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - ${`\u001b[${33}m${`js`}\u001b[${39}m`} - line ends with a postcode (full stop)`, () => {
  equal(
    removeWidows(`This very long line of text ends with a postcode SW1A 1AA.`, {
      targetLanguage: `js`,
      UKPostcodes: true,
      convertEntities: false,
      removeWidowPreventionMeasures: true,
      minCharCount: 5,
    }).res,
    `This very long line of text ends with a postcode SW1A 1AA.`,
    "14.01"
  );
});

test(`15 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - ${`\u001b[${33}m${`js`}\u001b[${39}m`} - line ends with a postcode (full stop)`, () => {
  equal(
    removeWidows(`This very long line of text ends with a postcode SW1A 1AA.`, {
      targetLanguage: `js`,
      UKPostcodes: true,
      convertEntities: false,
      removeWidowPreventionMeasures: true,
      minCharCount: 5,
    }).res,
    `This very long line of text ends with a postcode SW1A 1AA.`,
    "15.01"
  );
});

test(`16 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - vs. removeWidowPreventionMeasures`, () => {
  equal(
    removeWidows(`This very long line of text ends with a postcode SW1A 1AA.`, {
      removeWidowPreventionMeasures: true,
      UKPostcodes: false,
      minCharCount: 5,
    }).res,
    `This very long line of text ends with a postcode SW1A 1AA.`,
    "16.01"
  );
});

test(`17 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - vs. removeWidowPreventionMeasures`, () => {
  equal(
    removeWidows(
      `This very long line of text ends with a postcode SW1A${rawnbsp}1AA.`,
      {
        removeWidowPreventionMeasures: true,
        UKPostcodes: true,
        minCharCount: 5,
      }
    ).res,
    `This very long line of text ends with a postcode SW1A 1AA.`,
    "17.01"
  );
});

test(`18 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - vs. removeWidowPreventionMeasures`, () => {
  equal(
    removeWidows(`This very long line of text ends with a postcode SW1A 1AA.`, {
      removeWidowPreventionMeasures: false,
      UKPostcodes: false,
      minCharCount: 5,
    }).res,
    `This very long line of text ends with a postcode SW1A${encodedNbspHtml}1AA.`,
    "18.01"
  );
});

test(`19 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - vs. removeWidowPreventionMeasures`, () => {
  equal(
    removeWidows(
      `This very long line of text ends with a postcode SW1A${rawnbsp}1AA.`,
      {
        removeWidowPreventionMeasures: false,
        UKPostcodes: true,
        minCharCount: 5,
      }
    ).res,
    `This very long line of text ends with a postcode SW1A${encodedNbspHtml}1AA.`,
    "19.01"
  );
});

test(`20 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - properly formatted UK postcode, horse emoji`, () => {
  equal(
    removeWidows(
      `\uD83E\uDD84 some text text text SW1A 1AA more text text text \uD83E\uDD84 aaa`,
      {
        UKPostcodes: true,
        convertEntities: true,
        minCharCount: 5,
      }
    ).res,
    `\uD83E\uDD84 some text text text SW1A${encodedNbspHtml}1AA more text text text \uD83E\uDD84${encodedNbspHtml}aaa`,
    "20.01"
  );
});

test(`21 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - properly formatted UK postcode, horse emoji`, () => {
  equal(
    removeWidows(
      `\uD83E\uDD84 some text text text SW1A 1AA more text text text \uD83E\uDD84 aaa`,
      {
        UKPostcodes: true,
        convertEntities: false,
        minCharCount: 5,
      }
    ).res,
    `\uD83E\uDD84 some text text text SW1A${rawnbsp}1AA more text text text \uD83E\uDD84${rawnbsp}aaa`,
    "21.01"
  );
});

test(`22 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - properly formatted UK postcode, horse emoji`, () => {
  equal(
    removeWidows(
      `\uD83E\uDD84 some text text text SW1A 1AA more text text text \uD83E\uDD84 aaa`,
      {
        UKPostcodes: false,
        convertEntities: true,
        minCharCount: 5,
      }
    ).res,
    `\uD83E\uDD84 some text text text SW1A 1AA more text text text \uD83E\uDD84${encodedNbspHtml}aaa`,
    "22.01"
  );
});

test(`23 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - properly formatted UK postcode, horse emoji`, () => {
  equal(
    removeWidows(
      `\uD83E\uDD84 some text text text SW1A 1AA more text text text \uD83E\uDD84 aaa`,
      {
        UKPostcodes: false,
        convertEntities: false,
        minCharCount: 5,
      }
    ).res,
    `\uD83E\uDD84 some text text text SW1A 1AA more text text text \uD83E\uDD84${rawnbsp}aaa`,
    "23.01"
  );
});

test(`24 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - improperly formatted UK postcode`, () => {
  equal(
    removeWidows(`Some text SW1A 1Aa and some more text.`, {
      UKPostcodes: false,
      convertEntities: true,
      minCharCount: 5,
    }).res,
    `Some text SW1A 1Aa and some more${encodedNbspHtml}text.`,
    "24.01"
  );
});

test(`25 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - improperly formatted UK postcode`, () => {
  equal(
    removeWidows(`Some text SW1A 1Aa and some more text.`, {
      UKPostcodes: true,
      convertEntities: true,
      minCharCount: 5,
    }).res,
    `Some text SW1A 1Aa and some more${encodedNbspHtml}text.`,
    "25.01"
  );
});

test(`26 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - properly formatted UK postcode, in caps`, () => {
  equal(
    removeWidows(`Some text SW1A 1AA and some more text.`, {
      UKPostcodes: false,
      convertEntities: false,
      minCharCount: 5,
    }).res,
    `Some text SW1A 1AA and some more${rawnbsp}text.`,
    "26.01"
  );
});

test(`27 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - properly formatted UK postcode, in caps`, () => {
  equal(
    removeWidows(`Some text SW1A 1AA and some more text.`, {
      UKPostcodes: true,
      convertEntities: false,
      minCharCount: 5,
    }).res,
    `Some text SW1A${rawnbsp}1AA and some more${rawnbsp}text.`,
    "27.01"
  );
});

test(`28 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - multiple properly formatted postcodes`, () => {
  equal(
    removeWidows(
      `Some text SW1A 1AA and some more text SW1A 1AA and some more text.`,
      {
        UKPostcodes: false,
        convertEntities: false,
      }
    ).res,
    `Some text SW1A 1AA and some more text SW1A 1AA and some more\u00A0text.`,
    "28.01"
  );
});

test(`29 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - multiple properly formatted postcodes`, () => {
  equal(
    removeWidows(
      `Some text SW1A 1AA and some more text SW1A 1AA and some more text.`,
      {
        UKPostcodes: true,
        convertEntities: false,
      }
    ).res,
    `Some text SW1A${rawnbsp}1AA and some more text SW1A${rawnbsp}1AA and some more${rawnbsp}text.`,
    "29.01"
  );
});

test(`30 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - properly formatted UK postcode, some emoji`, () => {
  equal(
    removeWidows(
      `\uD83E\uDD84 some text text text SW1A 1AA more text text text \uD83E\uDD84 aaa`,
      {
        UKPostcodes: false,
        convertEntities: false,
        minCharCount: 5,
      }
    ).res,
    `\uD83E\uDD84 some text text text SW1A 1AA more text text text \uD83E\uDD84\u00A0aaa`,
    "30.01"
  );
});

test(`31 - \u001b[${36}m${`opts.UKPostcodes`}\u001b[${39}m - properly formatted UK postcode, some emoji`, () => {
  equal(
    removeWidows(
      `\uD83E\uDD84 some text text text SW1A 1AA more text text text \uD83E\uDD84 aaa`,
      {
        UKPostcodes: true,
        convertEntities: false,
        minCharCount: 5,
      }
    ).res,
    `\uD83E\uDD84 some text text text SW1A\u00A01AA more text text text \uD83E\uDD84\u00A0aaa`,
    "31.01"
  );
});

test.run();
