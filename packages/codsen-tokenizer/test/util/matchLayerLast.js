import tap from "tap";
import matchLayerLast from "../../src/util/matchLayerLast";

// match last
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${36}m${`match last`}\u001b[${39}m`} - no layers given`,
  (t) => {
    const valueToMatch = "${";
    const layers = [];
    const matchFirstInstead = undefined;
    t.is(
      matchLayerLast(valueToMatch, layers, matchFirstInstead),
      undefined,
      "01"
    );
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${36}m${`match last`}\u001b[${39}m`} - simple layer is matching`,
  (t) => {
    const valueToMatch = `"`;
    const layers = [
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
    const matchFirstInstead = undefined;
    t.is(
      matchLayerLast(valueToMatch, layers, matchFirstInstead),
      undefined,
      "02"
    );
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${36}m${`match last`}\u001b[${39}m`} - esp layer is matching`,
  (t) => {
    const valueToMatch = "%}";
    const layers = [
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
    const matchFirstInstead = undefined;
    const lengthResponse = 2; // because valueToMatch, %} has length of 2
    t.is(
      matchLayerLast(valueToMatch, layers, matchFirstInstead),
      lengthResponse,
      "03"
    );
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${36}m${`match last`}\u001b[${39}m`} - esp layer is not matching`,
  (t) => {
    const valueToMatch = "zz";
    const layers = [
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
    const matchFirstInstead = undefined;
    const lengthResponse = undefined;
    t.is(
      matchLayerLast(valueToMatch, layers, matchFirstInstead),
      lengthResponse,
      "04"
    );
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${36}m${`match last`}\u001b[${39}m`} - extra dash - Nunjucks collapse instruction`,
  (t) => {
    const valueToMatch = "-%}";
    const layers = [
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
    const matchFirstInstead = undefined;
    const lengthResponse = 3; // because valueToMatch, -%} has length of 3
    t.is(
      matchLayerLast(valueToMatch, layers, matchFirstInstead),
      lengthResponse,
      "05"
    );
    t.end();
  }
);

// match first
// -----------------------------------------------------------------------------

tap.test(
  `06 - ${`\u001b[${33}m${`match first`}\u001b[${39}m`} - no layers given`,
  (t) => {
    const valueToMatch = "${";
    const layers = [];
    const matchFirstInstead = true;
    t.is(
      matchLayerLast(valueToMatch, layers, matchFirstInstead),
      undefined,
      "06"
    );
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${33}m${`match first`}\u001b[${39}m`} - simple layer is matching`,
  (t) => {
    const valueToMatch = `"`;
    const layers = [
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
    const matchFirstInstead = true;
    t.is(
      matchLayerLast(valueToMatch, layers, matchFirstInstead),
      undefined,
      "07"
    );
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${33}m${`match first`}\u001b[${39}m`} - esp layer is matching`,
  (t) => {
    const valueToMatch = "%}";
    const layers = [
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
    const matchFirstInstead = true;
    const lengthResponse = 2; // because valueToMatch, %} has length of 2
    t.is(
      matchLayerLast(valueToMatch, layers, matchFirstInstead),
      lengthResponse,
      "08"
    );
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${33}m${`match first`}\u001b[${39}m`} - esp layer is not matching`,
  (t) => {
    const valueToMatch = "zz";
    const layers = [
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
    const matchFirstInstead = true;
    const lengthResponse = undefined;
    t.is(
      matchLayerLast(valueToMatch, layers, matchFirstInstead),
      lengthResponse,
      "09"
    );
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${33}m${`match first`}\u001b[${39}m`} - esp layer is 1 char less`,
  (t) => {
    const valueToMatch = "-%}";
    const layers = [
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
    const matchFirstInstead = true;
    const lengthResponse = 3; // because valueToMatch, -%} has length of 3
    t.is(
      matchLayerLast(valueToMatch, layers, matchFirstInstead),
      lengthResponse,
      "10"
    );
    t.end();
  }
);
