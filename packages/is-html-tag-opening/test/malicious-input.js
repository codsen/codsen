import { spawnSync } from "node:child_process";
import { test } from "uvu";
import { equal } from "uvu/assert";

import { isOpening } from "../dist/is-html-tag-opening.esm.js";

test("01 - malformed long names cannot cause excessive backtracking", () => {
  const moduleUrl = new URL(
    "../dist/is-html-tag-opening.esm.js",
    import.meta.url,
  ).href;
  // A separate process bounds a regression even if the recognizer blocks its
  // event loop. No naturally measured duration is asserted.
  const source = `
    import { isOpening } from ${JSON.stringify(moduleUrl)};
    const results = [];
    for (const allowCustomTagNames of [false, true]) {
      for (const skipOpeningBracket of [false, true]) {
        for (const prefix of ["<", "<div"]) {
          results.push(isOpening(prefix + "a".repeat(30000) + "!",
            skipOpeningBracket ? 1 : 0,
            { allowCustomTagNames, skipOpeningBracket }));
        }
      }
    }
    console.log(JSON.stringify(results));
  `;
  const result = spawnSync(
    process.execPath,
    ["--input-type=module", "-e", source],
    { encoding: "utf8", timeout: 5000 },
  );

  equal(result.status, 0, "01.01");
  equal(result.stdout.trim(), JSON.stringify(Array(8).fill(false)), "01.02");
});

test("02 - recognizes tags with slash-separated and adjoining attributes", () => {
  const inputs = [
    "<p/onclick=alert(1)>x</p>",
    '<p style="a"/onclick=alert(1)>x</p>',
    '<p style="a"onclick=alert(1)>x</p>',
    "<p\n/onclick=alert(1)>x</p>",
    '<div/onmouseover=alert(1) style="position:fixed;inset:0">x</div>',
    "<p///onclick=alert(1)>x</p>",
  ];

  equal(
    inputs.map((input) => isOpening(input)),
    inputs.map(() => true),
    "02.01",
  );
});

test("03 - preserves uppercase attribute suffixes in custom tag mode", () => {
  const inputs = [
    '<x a-A="v">',
    '<x a-ABC="v">',
    '<x a-b-A="v">',
    '<x a-aA="v">',
  ];

  equal(
    inputs.map((input) => isOpening(input, 0, { allowCustomTagNames: true })),
    inputs.map(() => true),
    "03.01",
  );
});

test("04 - ASCII and Unicode whitespace terminate in ESM and browser scripts", () => {
  const moduleUrl = new URL(
    "../dist/is-html-tag-opening.esm.js",
    import.meta.url,
  ).href;
  const browserUrl = new URL(
    "../dist/is-html-tag-opening.umd.js",
    import.meta.url,
  ).href;
  const source = `
    import { readFileSync } from "node:fs";
    import { runInNewContext } from "node:vm";
    import { isOpening } from ${JSON.stringify(moduleUrl)};
    const browser = {};
    runInNewContext(readFileSync(new URL(${JSON.stringify(browserUrl)}), "utf8"), browser);
    const results = [];
    for (const recognize of [isOpening, browser.isHtmlTagOpening.isOpening]) {
      const outcomes = [];
      for (const allowCustomTagNames of [false, true]) {
        for (const skipOpeningBracket of [false, true]) {
          for (const character of [" ", "\\u1680", "\\u3000", "\\uFEFF"]) {
            for (const prefix of ["<", "</", "<x ", "<x-y"]) {
              for (const suffix of ["!", '!="v">']) {
                outcomes.push(recognize(prefix + character.repeat(10000) + suffix,
                  skipOpeningBracket ? 1 : 0,
                  { allowCustomTagNames, skipOpeningBracket }));
              }
            }
          }
        }
      }
      results.push(outcomes.every(outcome => outcome === false));
    }
    console.log(JSON.stringify(results));
  `;
  const result = spawnSync(
    process.execPath,
    ["--input-type=module", "-e", source],
    { encoding: "utf8", timeout: 5000 },
  );

  equal(result.status, 0, "04.01");
  equal(result.stdout.trim(), "[true,true]", "04.02");
});

test("05 - preserves Unicode separators and optional custom attribute words", () => {
  const inputs = [
    '<x-y c="v">',
    '<x-y c d="v">',
    '<x-y c d e="v">',
    '<x-y\u1680c="v">',
    '<x-y\u1680c\u3000D="v">',
    '<x\u1680a-A="v">',
    "<\u1680>",
  ];

  equal(
    inputs.map((input) => isOpening(input, 0, { allowCustomTagNames: true })),
    [true, true, false, true, true, true, true],
    "05.01",
  );
});

test.run();
