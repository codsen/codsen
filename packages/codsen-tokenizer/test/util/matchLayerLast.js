import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { util } from "../../dist/codsen-tokenizer.esm.js";

const { matchLayerLast } = util;

// match last
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${36}m${"match last"}\u001b[${39}m`} - no layers given`, () => {
  let valueToMatch = "${";
  let layers = [];
  let matchFirstInstead;
  is(
    matchLayerLast(valueToMatch, layers, matchFirstInstead),
    undefined,
    "01.01",
  );
});

test(`02 - ${`\u001b[${36}m${"match last"}\u001b[${39}m`} - simple layer is matching`, () => {
  let valueToMatch = '"';
  let layers = [
    {
      type: "simple",
      value: '"',
      position: 99,
    },
    {
      type: "esp",
      openingLump: "{%",
      guessedClosingLump: "%}",
      position: 200,
    },
  ];
  let matchFirstInstead;
  is(
    matchLayerLast(valueToMatch, layers, matchFirstInstead),
    undefined,
    "02.01",
  );
});

test(`03 - ${`\u001b[${36}m${"match last"}\u001b[${39}m`} - esp layer is matching`, () => {
  let valueToMatch = "%}";
  let layers = [
    {
      type: "simple",
      value: '"',
      position: 99,
    },
    {
      type: "esp",
      openingLump: "{%",
      guessedClosingLump: "%}",
      position: 200,
    },
  ];
  let matchFirstInstead;
  let lengthResponse = 2; // because valueToMatch, %} has length of 2
  is(
    matchLayerLast(valueToMatch, layers, matchFirstInstead),
    lengthResponse,
    "03.01",
  );
});

test(`04 - ${`\u001b[${36}m${"match last"}\u001b[${39}m`} - esp layer is not matching`, () => {
  let valueToMatch = "zz";
  let layers = [
    {
      type: "simple",
      value: '"',
      position: 99,
    },
    {
      type: "esp",
      openingLump: "{%",
      guessedClosingLump: "%}",
      position: 200,
    },
  ];
  let matchFirstInstead;
  let lengthResponse;
  is(
    matchLayerLast(valueToMatch, layers, matchFirstInstead),
    lengthResponse,
    "04.01",
  );
});

test(`05 - ${`\u001b[${36}m${"match last"}\u001b[${39}m`} - extra dash - Nunjucks collapse instruction`, () => {
  let valueToMatch = "-%}";
  let layers = [
    {
      type: "simple",
      value: '"',
      position: 5,
    },
    {
      type: "esp",
      openingLump: "{%",
      guessedClosingLump: "%}",
      position: 6,
    },
  ];
  let matchFirstInstead;
  let lengthResponse = 3; // because valueToMatch, -%} has length of 3
  is(
    matchLayerLast(valueToMatch, layers, matchFirstInstead),
    lengthResponse,
    "05.01",
  );
});

// match first
// -----------------------------------------------------------------------------

test(`06 - ${`\u001b[${33}m${"match first"}\u001b[${39}m`} - no layers given`, () => {
  let valueToMatch = "${";
  let layers = [];
  let matchFirstInstead = true;
  is(
    matchLayerLast(valueToMatch, layers, matchFirstInstead),
    undefined,
    "06.01",
  );
});

test(`07 - ${`\u001b[${33}m${"match first"}\u001b[${39}m`} - simple layer is matching`, () => {
  let valueToMatch = '"';
  let layers = [
    {
      type: "simple",
      value: '"',
      position: 99,
    },
    {
      type: "simple",
      value: '"',
      position: 200,
    },
  ];
  let matchFirstInstead = true;
  is(
    matchLayerLast(valueToMatch, layers, matchFirstInstead),
    undefined,
    "07.01",
  );
});

test(`08 - ${`\u001b[${33}m${"match first"}\u001b[${39}m`} - esp layer is matching`, () => {
  let valueToMatch = "%}";
  let layers = [
    {
      type: "esp",
      openingLump: "{%",
      guessedClosingLump: "%}",
      position: 99,
    },
    {
      type: "simple",
      value: '"',
      position: 200,
    },
  ];
  let matchFirstInstead = true;
  let lengthResponse = 2; // because valueToMatch, %} has length of 2
  is(
    matchLayerLast(valueToMatch, layers, matchFirstInstead),
    lengthResponse,
    "08.01",
  );
});

test(`09 - ${`\u001b[${33}m${"match first"}\u001b[${39}m`} - esp layer is not matching`, () => {
  let valueToMatch = "zz";
  let layers = [
    {
      type: "esp",
      openingLump: "{%",
      guessedClosingLump: "%}",
      position: 99,
    },
    {
      type: "simple",
      value: '"',
      position: 200,
    },
  ];
  let matchFirstInstead = true;
  let lengthResponse;
  is(
    matchLayerLast(valueToMatch, layers, matchFirstInstead),
    lengthResponse,
    "09.01",
  );
});

test(`10 - ${`\u001b[${33}m${"match first"}\u001b[${39}m`} - esp layer is 1 char less`, () => {
  let valueToMatch = "-%}";
  let layers = [
    {
      type: "esp",
      openingLump: "{%",
      guessedClosingLump: "%}",
      position: 99,
    },
    {
      type: "simple",
      value: '"',
      position: 200,
    },
  ];
  let matchFirstInstead = true;
  let lengthResponse = 3; // because valueToMatch, -%} has length of 3
  is(
    matchLayerLast(valueToMatch, layers, matchFirstInstead),
    lengthResponse,
    "10.01",
  );
});
