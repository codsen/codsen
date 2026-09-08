import { test } from "uvu";
import { equal } from "uvu/assert";

import { detectLang } from "../dist/detect-templating-language.esm.js";

test("01 - namespace evidence must start a live set statement", () => {
  equal(
    [
      "{% set ns = namespace(total=0) %}",
      "{% set ns = namespace \t(total=0) %}",
      "{{ set ns = namespace() }}",
      "{% if set ns = namespace() %}",
    ].map((input) => detectLang(input).name),
    ["Jinja", "Jinja", "Nunjucks", "Nunjucks"],
    "01.01",
  );
});

test("02 - namespace text in prose and string literals is not live evidence", () => {
  equal(
    [
      "<p>set x = namespace()</p>{{ title }}",
      '{{ "set x = namespace()" }}',
      '{% set text = "set x = namespace()" %}',
      '{{ {"text": "set x = namespace()"} }}',
    ].map((input) => detectLang(input).name),
    ["Nunjucks", "Nunjucks", "Nunjucks", "Nunjucks"],
    "02.01",
  );
});

test("03 - comments hide namespace and format evidence", () => {
  equal(
    [
      "{# {% set ns = namespace() %} #}{{ value }}",
      '{# "%.2f"|format(price) #}{{ title }}',
    ].map((input) => detectLang(input).name),
    ["Nunjucks", "Nunjucks"],
    "03.01",
  );
});

test("04 - raw blocks hide their namespace and format examples", () => {
  equal(
    [
      "{% raw %}{% set ns = namespace() %}{% endraw %}",
      '{%- raw -%}{{ "%.2f"|format(price) }}{%- endraw -%}',
    ].map((input) => detectLang(input).name),
    ["Nunjucks", "Nunjucks"],
    "04.01",
  );
});

test("05 - verbatim blocks hide their namespace and format examples", () => {
  equal(
    [
      "{% verbatim %}{% set ns = namespace() %}{% endverbatim %}",
      '{%- verbatim -%}{{ "%s"|format(name) }}{%- endverbatim -%}',
    ].map((input) => detectLang(input).name),
    ["Nunjucks", "Nunjucks"],
    "05.01",
  );
});

test("06 - scanning resumes after literal blocks despite fake openers inside", () => {
  equal(
    [
      "{% raw %}{{ title }}{% endraw %}{% set ns = namespace() %}",
      '{% verbatim %}{{ title }}{% endverbatim %}{{ "%s"|format(name) }}',
      "{% raw %}{% set broken = ' {% endraw %}{{ title }}",
    ].map((input) => detectLang(input).name),
    ["Jinja", "Jinja", "Nunjucks"],
    "06.01",
  );
});

test("07 - plus and minus whitespace controls preserve live evidence", () => {
  equal(
    [
      "{%- set ns = namespace(total=0) -%}",
      "{%+ set ns = namespace(total=0) +%}",
      '{{- "%s"|format(name) -}}',
      '{{+ "%s"|format(name) +}}',
    ].map((input) => detectLang(input).name),
    ["Jinja", "Jinja", "Jinja", "Jinja"],
    "07.01",
  );
});

test("08 - quoted closing and comment delimiters do not end namespace tokens", () => {
  equal(
    [
      '{% set ns = namespace(value="%}") %}',
      String.raw`{% set ns = namespace(value="\"%} {# #}") %}`,
    ].map((input) => detectLang(input).name),
    ["Jinja", "Jinja"],
    "08.01",
  );
});

test("09 - namespace identifiers use the supported ASCII scope", () => {
  equal(
    [
      "{% set ns_1 = namespace() %}",
      "{% set café = namespace() %}",
      "{% set 状态 = namespace() %}",
    ].map((input) => detectLang(input).name),
    ["Jinja", "Nunjucks", "Nunjucks"],
    "09.01",
  );
});

test("10 - incomplete tokens do not provide Jinja-specific evidence", () => {
  equal(
    [
      "{% set ns = namespace(",
      '{{ "%s"|format(name)',
      '{{ "%s|format(name) }}',
      "{% set ns = namespace %}",
    ].map((input) => detectLang(input).name),
    ["Nunjucks", "Nunjucks", "Nunjucks", "Nunjucks"],
    "10.01",
  );
});

test("11 - literal printf conversions provide format evidence", () => {
  equal(
    [
      '{{ "%s"|format(name) }}',
      '{{ "%.2f"|format(price) }}',
      '{{ "Balance for %s: %.2f"|format(name,price) }}',
      '{{ "%(name)s"|format(name=name) }}',
      '{{ "%(user(name))s"|format(**{"user(name)": name}) }}',
    ].map((input) => detectLang(input).name),
    ["Jinja", "Jinja", "Jinja", "Jinja", "Jinja"],
    "11.01",
  );
});

test("12 - format filters accept whitespace around their call markers", () => {
  equal(
    ['{{ "%s" | format (name) }}', '{{ "%.2f" \t|\n format \t(price) }}'].map(
      (input) => detectLang(input).name,
    ),
    ["Jinja", "Jinja"],
    "12.01",
  );
});

test("13 - escaped quotes and literal expression closers stay inside strings", () => {
  equal(
    [
      '{{ "}} %s"|format(name) }}',
      String.raw`{{ "\"}} %s"|format(name) }}`,
      String.raw`{{ '\' }} %s'|format(name) }}`,
    ].map((input) => detectLang(input).name),
    ["Jinja", "Jinja", "Jinja"],
    "13.01",
  );
});

test("14 - literal comment and statement delimiters stay inside format strings", () => {
  equal(
    ['{{ "{# %s #}"|format(name) }}', '{{ "{%% %s %%}"|format(name) }}'].map(
      (input) => detectLang(input).name,
    ),
    ["Jinja", "Jinja"],
    "14.01",
  );
});

test("15 - nested dictionaries, parentheses and lists retain live formats", () => {
  equal(
    [
      '{{ {"a": {"b": 1}}["a"]["b"] ~ "%s"|format(name) }}',
      '{{ outer("%s"|format(name)) }}',
      '{{ ["%s"|format(name)][0] }}',
    ].map((input) => detectLang(input).name),
    ["Jinja", "Jinja", "Jinja"],
    "15.01",
  );
});

test("16 - a live format filter can appear in a statement expression", () => {
  equal(
    detectLang('{% set text = "%s"|format(name) %}'),
    { name: "Jinja" },
    "16.01",
  );
});

test("17 - prose and quoted format examples are not live calls", () => {
  equal(
    [
      '<p>"%.2f"|format(price)</p>{{ title }}',
      "{{ \"'%.2f'|format(price)\" }}",
      '{{ "%.2f|format(price)" }}',
    ].map((input) => detectLang(input).name),
    ["Nunjucks", "Nunjucks", "Nunjucks"],
    "17.01",
  );
});

test("18 - escaped percents require a separate live conversion", () => {
  equal(
    [
      '{{ "%%"|format() }}',
      '{{ "%%s"|format() }}',
      '{{ "100%%"|format() }}',
      '{{ "%% %s"|format(name) }}',
    ].map((input) => detectLang(input).name),
    ["Nunjucks", "Nunjucks", "Nunjucks", "Jinja"],
    "18.01",
  );
});

test("19 - every printf conversion in a literal must be valid", () => {
  equal(
    [
      '{{ "%.2%"|format(price) }}',
      '{{ "%0>2d"|format(price) }}',
      '{{ "%^10d"|format(price) }}',
      '{{ "%<10d"|format(price) }}',
      '{{ "%s %.2%"|format(name,price) }}',
      '{{ "%(name"|format(name=name) }}',
      '{{ "%s %"|format(name) }}',
    ].map((input) => detectLang(input).name),
    [
      "Nunjucks",
      "Nunjucks",
      "Nunjucks",
      "Nunjucks",
      "Nunjucks",
      "Nunjucks",
      "Nunjucks",
    ],
    "19.01",
  );
});

test("20 - valid conversion flags and literal suffixes remain supported", () => {
  equal(
    [
      '{{ "%x<4d"|format(price) }}',
      '{{ "%+.2f"|format(price) }}',
      '{{ "%02d"|format(price) }}',
      '{{ "%-10d"|format(price) }}',
      '{{ "%#x"|format(price) }}',
      '{{ "% d"|format(7) }}',
      '{{ "%*.*f"|format(8,2,price) }}',
      '{{ "%ld"|format(42) }}',
    ].map((input) => detectLang(input).name),
    ["Jinja", "Jinja", "Jinja", "Jinja", "Jinja", "Jinja", "Jinja", "Jinja"],
    "20.01",
  );
});

test("21 - format evidence requires a literal followed by the actual filter", () => {
  equal(
    [
      '{{ "%s" }}',
      "{{ pattern | format(value) }}",
      '{{ "%s"|formatSomething(name) }}',
      '{{ "%s".format(name) }}',
      '{{ "%s"|format }}',
    ].map((input) => detectLang(input).name),
    ["Nunjucks", "Nunjucks", "Nunjucks", "Nunjucks", "Nunjucks"],
    "21.01",
  );
});

test("22 - HTML script, style and attributes do not hide live template tokens", () => {
  equal(
    [
      '<script>const value = "{% set ns = namespace(total=0) %}";</script>',
      '<style>.a::before{content:"{{ "%s"|format(name) }}"}</style>',
      '<div title="{% set ns = namespace(total=0) %}">x</div>',
    ].map((input) => detectLang(input).name),
    ["Jinja", "Jinja", "Jinja"],
    "22.01",
  );
});

test("23 - uppercase marker spellings are not live Jinja syntax", () => {
  equal(
    [
      "{% SET ns = namespace() %}",
      "{% set ns = NAMESPACE() %}",
      '{{ "%s"|FORMAT(name) }}',
    ].map((input) => detectLang(input).name),
    ["Nunjucks", "Nunjucks", "Nunjucks"],
    "23.01",
  );
});

test("24 - literal Unicode text is supported without decoding escaped percents", () => {
  equal(
    [
      '{{ "状态：%s café"|format(name) }}',
      String.raw`{{ "\x25s"|format(name) }}`,
      String.raw`{{ "\045s"|format(name) }}`,
    ].map((input) => detectLang(input).name),
    ["Jinja", "Nunjucks", "Nunjucks"],
    "24.01",
  );
});

test("25 - mismatched brackets do not refine malformed tokens or hide later ones", () => {
  equal(
    [
      '{{ ("%s"|format(name)] }}',
      "{{ [) }}{% set ns = namespace() %}",
      '{{ [) }}{{ "%s"|format(name) }}',
    ].map((input) => detectLang(input).name),
    ["Nunjucks", "Jinja", "Jinja"],
    "25.01",
  );
});

test("26 - adjacent literals do not borrow a hint from only their final part", () => {
  equal(
    [
      '{{ "%.2%" "%s"|format(name) }}',
      '{{ "prefix " "%s"|format(name) }}',
      '{{ "%.2%" ~ "%s"|format(name) }}',
    ].map((input) => detectLang(input).name),
    ["Nunjucks", "Nunjucks", "Jinja"],
    "26.01",
  );
});

test.run();
