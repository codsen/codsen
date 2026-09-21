import { test } from "uvu";
import { equal } from "uvu/assert";

import { comb } from "./util/util.js";

const yahooSource = String.raw`<html><head><style>.\& .yahoo\:text-white { color: white }</style></head><body><p class="yahoo:text-white">hi</p></body></html>`;

test("01 - preserves the Yahoo selector with Maizzle's escaped whitelist", () => {
  const whitelist = Object.freeze([String.raw`.\&*`]);
  const opts = Object.freeze({ whitelist });
  const actual = comb(yahooSource, opts);

  equal(actual.result, yahooSource, "01.01");
  equal(actual.allInHead, [".&", ".yahoo:text-white"], "01.02");
  equal(actual.allInBody, [".yahoo:text-white"], "01.03");
  equal(actual.deletedFromHead, [], "01.04");
  equal(actual.deletedFromBody, [], "01.05");
  equal(actual.countBeforeCleaning, 2, "01.06");
  equal(actual.countAfterCleaning, 2, "01.07");
  equal(actual.log.uglified, null, "01.08");
  equal(opts, { whitelist: [String.raw`.\&*`] }, "01.09");
});

test("02 - accepts the equivalent canonical whitelist as a string", () => {
  const actual = comb(yahooSource, { whitelist: ".&*" });

  equal(actual.result, yahooSource, "02.01");
  equal(actual.deletedFromHead, [], "02.02");
  equal(actual.deletedFromBody, [], "02.03");
});

test("03 - uglifies the live descendant while preserving the Yahoo wrapper", () => {
  const actual = comb(yahooSource, {
    whitelist: [String.raw`.\&*`],
    uglify: true,
  });

  equal(actual.log.uglified.length, 1, "03.01");
  equal(actual.log.uglified[0][0], ".yahoo:text-white", "03.02");
  const name = actual.log.uglified[0][1].slice(1);
  equal(
    actual.result,
    String.raw`<html><head><style>.\& .${name} { color: white }</style></head><body><p class="${name}">hi</p></body></html>`,
    "03.03",
  );
  equal(actual.deletedFromHead, [], "03.04");
  equal(actual.deletedFromBody, [], "03.05");
  equal(actual.countAfterCleaning, 2, "03.06");
});

test("04 - preserves live descendants of external class and ID wrappers", () => {
  const source =
    '<style>.external .content{color:red}#wrapper #title{color:blue}</style><p class="content" id="title">hi</p>';
  const actual = comb(source, { whitelist: [".external", "#wrapper"] });

  equal(actual.result, source, "04.01");
  equal(
    actual.allInHead,
    [".content", ".external", "#title", "#wrapper"],
    "04.02",
  );
  equal(actual.allInBody, [".content", "#title"], "04.03");
  equal(actual.deletedFromHead, [], "04.04");
  equal(actual.deletedFromBody, [], "04.05");
  equal(actual.countBeforeCleaning, 4, "04.06");
  equal(actual.countAfterCleaning, 4, "04.07");
});

test("05 - removes missing descendants and adjacent selectors inside media rules", () => {
  const actual = comb(
    String.raw`<style>@media screen{.\& .used,.\& .missing,.gone{color:red}}</style><p class="used">hi</p>`,
    { whitelist: [String.raw`.\&*`] },
  );

  equal(
    actual.result,
    String.raw`<style>@media screen{.\& .used{color:red}}</style><p class="used">hi</p>`,
    "05.01",
  );
  equal(actual.deletedFromHead, [".gone", ".missing"], "05.02");
  equal(actual.deletedFromBody, [], "05.03");
  equal(actual.countBeforeCleaning, 4, "05.04");
  equal(actual.countAfterCleaning, 2, "05.05");
});

test("06 - still removes an absent wrapper when no whitelist is supplied", () => {
  const actual = comb(
    String.raw`<style>.\& .used{color:red}</style><p class="used">hi</p>`,
  );

  equal(actual.result, "<p>hi</p>", "06.01");
  equal(actual.deletedFromHead, [".&", ".used"], "06.02");
  equal(actual.deletedFromBody, [".used"], "06.03");
  equal(actual.countBeforeCleaning, 2, "06.04");
  equal(actual.countAfterCleaning, 0, "06.05");
});

test("07 - an escaped whitelist star matches only the literal star identity", () => {
  const actual = comb(
    String.raw`<style>.\* .star-target{color:red}.unused{color:blue}</style><p class="star-target body-only">hi</p>`,
    { whitelist: [String.raw`.\*`] },
  );

  equal(
    actual.result,
    String.raw`<style>.\* .star-target{color:red}</style><p class="star-target">hi</p>`,
    "07.01",
  );
  equal(actual.deletedFromHead, [".unused"], "07.02");
  equal(actual.deletedFromBody, [".body-only"], "07.03");
  equal(actual.countAfterCleaning, 2, "07.04");
});

test("08 - matches whitelist identities case-sensitively when retaining descendants", () => {
  const actual = comb(
    '<style>.Wrapper .used{color:red}.wrapper .other{color:blue}</style><p class="used other">hi</p>',
    { whitelist: [".Wrapper", ""] },
  );

  equal(
    actual.result,
    '<style>.Wrapper .used{color:red}</style><p class="used">hi</p>',
    "08.01",
  );
  equal(actual.deletedFromHead, [".other", ".wrapper"], "08.02");
  equal(actual.deletedFromBody, [".other"], "08.03");
  equal(actual.countAfterCleaning, 2, "08.04");
});

test("09 - treats negative whitelist patterns as independent predicates", () => {
  const source =
    '<style>.outside .outside-target{color:red}</style><p class="outside-target">hi</p>';
  const actual = comb(source, { whitelist: [".outside", "!.outside*"] });

  equal(actual.result, source, "09.01");
  equal(actual.deletedFromHead, [], "09.02");
  equal(actual.deletedFromBody, [], "09.03");
  equal(actual.countAfterCleaning, 2, "09.04");
});

test.run();
