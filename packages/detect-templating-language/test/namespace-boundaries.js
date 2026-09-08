import { test } from "uvu";
import { equal } from "uvu/assert";

import { detectLang } from "../dist/detect-templating-language.esm.js";

test("01 - an embedded set keyword retains the Nunjucks fallback", () => {
  equal(
    detectLang("{% asset x = namespace() %}"),
    { name: "Nunjucks" },
    "01.01",
  );
  equal(
    detectLang("{% offset x = namespace() %}"),
    { name: "Nunjucks" },
    "01.02",
  );
});

test("02 - a missing keyword separator retains the Nunjucks fallback", () => {
  equal(detectLang("{% setx=namespace() %}"), { name: "Nunjucks" }, "02.01");
  equal(detectLang("{% setx = namespace() %}"), { name: "Nunjucks" }, "02.02");
});

test("03 - namespace assignments accept spaces, tabs and newlines", () => {
  equal(detectLang("{% set x = namespace() %}"), { name: "Jinja" }, "03.01");
  equal(detectLang("{% set\tx = namespace() %}"), { name: "Jinja" }, "03.02");
  equal(detectLang("{% set\nx = namespace() %}"), { name: "Jinja" }, "03.03");
});

test("04 - whitespace control preserves namespace assignment detection", () => {
  equal(
    detectLang("{%- set ns = namespace(total=0) -%}"),
    { name: "Jinja" },
    "04.01",
  );
  equal(
    detectLang("{%-set\tns=namespace(total=0)-%}"),
    { name: "Jinja" },
    "04.02",
  );
});

test("05 - a long identifier containing set retains the Nunjucks fallback", () => {
  const identifier = "set".repeat(16_000);
  equal(detectLang(`{{ ${identifier} }}`), { name: "Nunjucks" }, "05.01");
});

test("06 - incomplete namespace assignments retain the Nunjucks fallback", () => {
  equal(
    detectLang("{% set item namespace() %}"),
    { name: "Nunjucks" },
    "06.01",
  );
  equal(
    detectLang("{% set item = namespac() %}"),
    { name: "Nunjucks" },
    "06.02",
  );
});

test("07 - repeated calls keep namespace detection independent", () => {
  const input = "{% set ns = namespace() %}";
  equal(detectLang(input), { name: "Jinja" }, "07.01");
  equal(detectLang(input), { name: "Jinja" }, "07.02");
});

test.run();
