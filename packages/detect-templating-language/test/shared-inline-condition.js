import { test } from "uvu";
import { equal } from "uvu/assert";

import { detectLang } from "../dist/detect-templating-language.esm.js";

test("01 - compact inline conditionals retain the Nunjucks fallback", () => {
  equal(
    detectLang("{{'yes' if active else 'no'}}"),
    { name: "Nunjucks" },
    "01.01",
  );
  equal(
    detectLang('{{"yes" if active else "no"}}'),
    { name: "Nunjucks" },
    "01.02",
  );
});

test("02 - spaced inline conditionals retain the Nunjucks fallback", () => {
  equal(
    detectLang("{{ 'yes' if active else 'no' }}"),
    { name: "Nunjucks" },
    "02.01",
  );
  equal(
    detectLang('{{ "yes" if active else "no" }}'),
    { name: "Nunjucks" },
    "02.02",
  );
});

test("03 - omitting else retains the Nunjucks fallback", () => {
  equal(detectLang("{{'yes' if active}}"), { name: "Nunjucks" }, "03.01");
  equal(detectLang('{{ "yes" if active }}'), { name: "Nunjucks" }, "03.02");
});

test("04 - longer inline strings and punctuation retain the fallback", () => {
  equal(
    detectLang("{{ 'Status: open!' if active else 'Status: closed.' }}"),
    { name: "Nunjucks" },
    "04.01",
  );
  equal(
    detectLang('{{ "It\'s open!" if active else "Not yet..." }}'),
    { name: "Nunjucks" },
    "04.02",
  );
});

test("05 - namespace and number formatting still refine the result to Jinja", () => {
  equal(
    detectLang(
      "{% set ns = namespace(total=0) %}{{'yes' if active else 'no'}}",
    ),
    { name: "Jinja" },
    "05.01",
  );
  equal(
    detectLang("{{ '%.2f'|format(total) if active else 'disabled' }}"),
    { name: "Jinja" },
    "05.02",
  );
});

test.run();
