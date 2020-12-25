import tap from "tap";
import { isJinjaNunjucksRegex } from "../dist/regex-is-jinja-nunjucks.esm";

tap.test("is not nunjucks or jinja", (t) => {
  t.notMatch(``, isJinjaNunjucksRegex(), "01.01");
  t.notMatch(`\n`, isJinjaNunjucksRegex(), "01.02");
  t.notMatch(`abc`, isJinjaNunjucksRegex(), "01.03");
  t.notMatch(`<html><div></html>`, isJinjaNunjucksRegex(), "01.04");
  t.end();
});

tap.test("variables", (t) => {
  t.match(`{{count}}`, isJinjaNunjucksRegex(), "02.01");
  t.match(`{{count }}`, isJinjaNunjucksRegex(), "02.02");
  t.match(`{{ count}}`, isJinjaNunjucksRegex(), "02.03");
  t.match(`{{ count }}`, isJinjaNunjucksRegex(), "02.04");
  t.match(`{{ count | length }}`, isJinjaNunjucksRegex(), "02.05");
  t.match(`<div>{{ count }}</div>`, isJinjaNunjucksRegex(), "02.06");

  t.match(`{{ foo.bar }}`, isJinjaNunjucksRegex(), "02.07");
  t.match(`{{ foo["bar"] }}`, isJinjaNunjucksRegex(), "02.08");

  t.match(`{{ foo | title }}`, isJinjaNunjucksRegex(), "02.09");
  t.match(`{{ foo | join(",") }}`, isJinjaNunjucksRegex(), "02.10");
  t.match(
    `{{ foo | replace("foo", "bar") | capitalize }}`,
    isJinjaNunjucksRegex(),
    "02.11"
  );
  t.end();
});

tap.test("logic", (t) => {
  t.match(`abc {% if something %}`, isJinjaNunjucksRegex(), "03.01");
  t.match(`abc {%- if something %}`, isJinjaNunjucksRegex(), "03.02");
  t.match(`abc {% if something -%}`, isJinjaNunjucksRegex(), "03.03");
  t.match(`abc {%- if something -%}`, isJinjaNunjucksRegex(), "03.04");
  t.end();
});

tap.test("nunjucks with template inheritance", (t) => {
  t.match(
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
    "04"
  );
  t.end();
});
