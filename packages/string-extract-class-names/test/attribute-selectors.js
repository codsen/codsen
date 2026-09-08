import { test } from "uvu";
import { equal, throws } from "uvu/assert";

import {
  extract,
  extractCssSelectorTokens,
} from "../dist/string-extract-class-names.esm.js";

test("01 - attribute names are decoded CSS identifiers", () => {
  const str = String.raw`[cl\61 ss=foo][\69 d="a,b"]`;
  equal(
    extract(str),
    {
      res: [".foo", "#a,b"],
      ranges: [
        [10, 13],
        [22, 25],
      ],
    },
    "01.01",
  );
  equal(
    extractCssSelectorTokens(str),
    [
      { value: ".foo", raw: "foo", range: [10, 13] },
      { value: "#a,b", raw: "a,b", range: [22, 25] },
    ],
    "01.02",
  );
  equal(
    extract(String.raw`[\000043LASS=foo][i\000064=bar]`).res,
    [".foo", "#bar"],
    "01.03",
  );
  equal(extract(String.raw`[cl\61 ssy=foo][\69 dx=bar]`).res, [], "01.04");
});

test("02 - quoted values need not be CSS identifiers", () => {
  const str = '[class="123"][class="a:b"][class="a,b"]';
  equal(
    extract(str),
    {
      res: [".123", ".a:b", ".a,b"],
      ranges: [
        [8, 11],
        [21, 24],
        [34, 37],
      ],
    },
    "02.01",
  );
  equal(
    extractCssSelectorTokens(str).map(({ value }) => value),
    [".123", ".a:b", ".a,b"],
    "02.02",
  );
  equal(extract("[class=123][class=a:b][id=a,b]").res, [], "02.03");
});

test("03 - string continuations preserve raw spans and decoded identity", () => {
  for (const newline of ["\n", "\r", "\r\n", "\f"]) {
    const raw = `a\\${newline}b`;
    const str = `[class="${raw}"]`;
    equal(
      extract(str),
      { res: [`.${raw}`], ranges: [[8, 8 + raw.length]] },
      "03.01",
    );
    equal(
      extractCssSelectorTokens(str),
      [{ value: ".ab", raw, range: [8, 8 + raw.length] }],
      "03.02",
    );
    equal(extract(`[class="a${newline}b"]`).res, [], "03.03");
  }
});

test("04 - inventories preserve class operators and exact ID values", () => {
  equal(
    extractCssSelectorTokens(
      String.raw`[class="a\20 b"][class~="a\20 b"][class^=a][id~=x]`,
    ),
    [
      { value: ".a", raw: "a", range: [8, 9] },
      { value: ".b", raw: "b", range: [13, 14] },
    ],
    "04.01",
  );
  equal(
    extract('[id=" x "][id="a b"]'),
    { res: ["#x"], ranges: [[6, 7]] },
    "04.02",
  );
  equal(
    extractCssSelectorTokens('[id=" x "][id="a b"]'),
    [
      { value: "# x ", raw: " x ", range: [5, 8] },
      { value: "#a b", raw: "a b", range: [15, 18] },
    ],
    "04.03",
  );
  equal(extractCssSelectorTokens('[class=""][id=""]'), [], "04.04");
});

test("05 - canonical values are decoded once at the CSS layer", () => {
  const str = String.raw`[class="&copy;"][class="\26 copy;"] .a\,b #\31 x`;
  const tokens = extractCssSelectorTokens(str);
  equal(
    tokens.map(({ value }) => value),
    [".&copy;", ".&copy;", ".a,b", "#1x"],
    "05.01",
  );
  equal(
    tokens.map(({ raw, range }) => [raw, str.slice(...range)]),
    tokens.map(({ raw }) => [raw, raw]),
    "05.02",
  );
});

test("06 - hex escapes retain string source ranges and Unicode recovery", () => {
  for (const cssEscape of [
    "\\3a ",
    "\\03a ",
    "\\003a ",
    "\\0003a ",
    "\\00003a ",
  ]) {
    const raw = `a${cssEscape}b`;
    equal(
      extractCssSelectorTokens(`[class="${raw}"]`),
      [{ value: ".a:b", raw, range: [8, 8 + raw.length] }],
      "06.01",
    );
  }
  equal(
    extractCssSelectorTokens(
      String.raw`[class="\0 \d800 \110000 \1f600 "]`,
    ).map(({ value }) => value),
    [".���😀"],
    "06.02",
  );
  equal(
    extractCssSelectorTokens('[id="a\\\r\nb"]').map(({ value }) => value),
    ["#ab"],
    "06.03",
  );
});

test("07 - semantic helper validates its input and handles empty inventories", () => {
  throws(
    () => extractCssSelectorTokens(null),
    /string-extract-class-names\/extractCssSelectorTokens\(\): \[THROW_ID_05\]/,
    "07.01",
  );
  equal(extractCssSelectorTokens(""), [], "07.02");
  equal(extractCssSelectorTokens("div:hover"), [], "07.03");
});

test.run();
