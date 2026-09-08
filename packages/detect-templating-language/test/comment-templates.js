import { test } from "uvu";
import { equal } from "uvu/assert";

import { detectLang } from "../dist/detect-templating-language.esm.js";

test("01 - a complete comment identifies the shared template family", () => {
  equal(detectLang("{# reviewer note #}"), { name: "Nunjucks" }, "01.01");
});

test("02 - an empty complete comment identifies the shared family", () => {
  equal(detectLang("{##}"), { name: "Nunjucks" }, "02.01");
});

test("03 - complete comments can contain newlines and Unicode text", () => {
  equal(
    ["{# first line\nsecond line #}", "{# café 状态 π #}"].map(
      (input) => detectLang(input).name,
    ),
    ["Nunjucks", "Nunjucks"],
    "03.01",
  );
});

test("04 - comment whitespace controls preserve family evidence", () => {
  equal(
    ["{#- note #}", "{# note -#}", "{#- note -#}"].map(
      (input) => detectLang(input).name,
    ),
    ["Nunjucks", "Nunjucks", "Nunjucks"],
    "04.01",
  );
});

test("05 - unfinished comment openers do not identify the family", () => {
  equal(
    ["{#", "{# note", "before {# note\nafter"].map(
      (input) => detectLang(input).name,
    ),
    [null, null, null],
    "05.01",
  );
});

test("06 - stray comment closers do not identify the family", () => {
  equal(
    ["#}", "note #}", "#} text #} #}"].map((input) => detectLang(input).name),
    [null, null, null],
    "06.01",
  );
});

test("07 - ordinary braces and hash characters are not comment evidence", () => {
  equal(
    [
      "{",
      "#",
      "{ / # / }",
      "# heading\nordinary report",
      "@media screen{#report{color:red}}",
      'function report(){return {title:"# note"};}',
    ].map((input) => detectLang(input).name),
    [null, null, null, null, null, null],
    "07.01",
  );
});

test("08 - Svelte block openers without comment closers remain unsupported", () => {
  equal(
    [
      "{#if ready}<p>Ready</p>{/if}",
      "{#each items as item}<p>{item.name}</p>{/each}",
    ].map((input) => detectLang(input).name),
    [null, null],
    "08.01",
  );
});

test("09 - namespace and format examples inside comments do not refine", () => {
  equal(
    [
      "{# {% set ns = namespace(total=0) %} #}",
      '{# "%.2f"|format(price) #}',
      '{# {{ "%s"|format(name) }} #}',
    ].map((input) => detectLang(input).name),
    ["Nunjucks", "Nunjucks", "Nunjucks"],
    "09.01",
  );
});

test("10 - classic JSP examples inside complete comments do not override", () => {
  equal(
    ["{# <%= name %> #}", '{# <%@ page contentType="text/html" %> #}'].map(
      (input) => detectLang(input).name,
    ),
    ["Nunjucks", "Nunjucks"],
    "10.01",
  );
});

test("11 - a live namespace outside a comment can refine the family", () => {
  equal(
    [
      "{# note #}{% set ns = namespace() %}",
      "{% set ns = namespace() %}{# note #}",
    ].map((input) => detectLang(input).name),
    ["Jinja", "Jinja"],
    "11.01",
  );
});

test("12 - a live format filter after a comment can refine the family", () => {
  equal(
    detectLang('{# note #}{{ "%s"|format(name) }}'),
    { name: "Jinja" },
    "12.01",
  );
});

test("13 - complete comments retain family precedence alongside actual JSP", () => {
  equal(
    ["{# note #}<%= name %>", "<%= name %>{# note #}"].map(
      (input) => detectLang(input).name,
    ),
    ["Nunjucks", "Nunjucks"],
    "13.01",
  );
});

test("14 - statement and expression opening fragments retain their behavior", () => {
  equal(
    ["{%", "{{"].map((input) => detectLang(input).name),
    ["Nunjucks", "Nunjucks"],
    "14.01",
  );
});

test("15 - complete shared statements and expressions retain their fallback", () => {
  equal(
    ["{{ user.name }}", "{% if ready %}Ready{% endif %}"].map(
      (input) => detectLang(input).name,
    ),
    ["Nunjucks", "Nunjucks"],
    "15.01",
  );
});

test("16 - multiple complete comments remain independent across calls", () => {
  const input = "{# first #} text {##}\n{# last #}";
  equal(detectLang(input), { name: "Nunjucks" }, "16.01");
  equal(detectLang(input), { name: "Nunjucks" }, "16.02");
});

test("17 - a long sequence of unfinished comment openers stays unsupported", () => {
  equal(detectLang("{#".repeat(24_000)), { name: null }, "17.01");
});

test.run();
