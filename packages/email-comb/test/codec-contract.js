import { test } from "uvu";
import { equal } from "uvu/assert";
import { comb } from "../dist/email-comb.esm.js";

test("01 - uses forgiving attribute lookahead without repeated decoding", () => {
  for (const [value, identity] of [
    ["&copy=1", "&copy=1"],
    ["&copyx", "&copyx"],
    ["&copy", "©"],
    ["&amp;copy;", "&copy;"],
  ]) {
    const source = `<body><div class="${value}">x</div></body>`;
    const actual = comb(source, { whitelist: [`.${identity}`] });
    equal(actual.result, source, "01.01");
    equal(actual.allInBody, [`.${identity}`], "01.02");
  }
});

test("02 - corrects numeric references in selectors, ids and label associations", () => {
  for (const [reference, character] of [
    ["&#xD800;", "�"],
    ["&#x10FFFF;", "\u{10ffff}"],
  ]) {
    const source = `<style>.${character}{color:red}#${character}{display:block}</style><body><label for="${reference}">x</label><input id="${reference}" class="${reference}"></body>`;
    const actual = comb(source, { uglify: true, whitelist: [`.${character}`] });
    equal(actual.result, source, "02.01");
    equal(actual.allInBody, [`.${character}`, `#${character}`], "02.02");
    equal(actual.deletedFromHead, [], "02.03");
    equal(actual.log.uglified, [], "02.04");
  }
});

test.run();
