import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { isJinjaNunjucksRegex } from "../dist/regex-is-jinja-nunjucks.esm.js";

test("is not nunjucks or jinja", () => {
  not.match("", isJinjaNunjucksRegex(), "01.01");
  not.match("\n", isJinjaNunjucksRegex(), "01.02");
  not.match("abc", isJinjaNunjucksRegex(), "01.03");
  not.match("<html><div></html>", isJinjaNunjucksRegex(), "01.04");
});

test("variables", () => {
  match("{{count}}", isJinjaNunjucksRegex(), "02.01");
  match("{{count }}", isJinjaNunjucksRegex(), "02.02");
  match("{{ count}}", isJinjaNunjucksRegex(), "02.03");
  match("{{ count }}", isJinjaNunjucksRegex(), "02.04");
  match("{{ count | length }}", isJinjaNunjucksRegex(), "02.05");
  match("<div>{{ count }}</div>", isJinjaNunjucksRegex(), "02.06");

  match("{{ foo.bar }}", isJinjaNunjucksRegex(), "02.07");
  match('{{ foo["bar"] }}', isJinjaNunjucksRegex(), "02.08");

  match("{{ foo | title }}", isJinjaNunjucksRegex(), "02.09");
  match('{{ foo | join(",") }}', isJinjaNunjucksRegex(), "02.10");
  match(
    '{{ foo | replace("foo", "bar") | capitalize }}',
    isJinjaNunjucksRegex(),
    "02.11",
  );
});

test("logic", () => {
  match("abc {% if something %}", isJinjaNunjucksRegex(), "03.01");
  match("abc {%- if something %}", isJinjaNunjucksRegex(), "03.02");
  match("abc {% if something -%}", isJinjaNunjucksRegex(), "03.03");
  match("abc {%- if something -%}", isJinjaNunjucksRegex(), "03.04");
});

test("nunjucks with template inheritance", () => {
  match(
    `{% block header %}
This is the default content
{% endblock %}

<section class="left">
  {% block left %}{% endblock %}
</section>

<section class="right">
  {% block right %}
  This is more content
  {% endblock %}
</section>
`,
    isJinjaNunjucksRegex(),
    "04.01",
  );
});

test.run();
