import tap from "tap";
import r from "../dist/regex-is-jinja-nunjucks.esm";

tap.test("is not nunjucks or jinja", (t) => {
  t.notMatch(``, r(), "01.01");
  t.notMatch(`\n`, r(), "01.02");
  t.notMatch(`abc`, r(), "01.03");
  t.notMatch(`<html><div></html>`, r(), "01.04");
  t.end();
});

tap.test("variables", (t) => {
  t.match(`{{count}}`, r(), "02.01");
  t.match(`{{count }}`, r(), "02.02");
  t.match(`{{ count}}`, r(), "02.03");
  t.match(`{{ count }}`, r(), "02.04");
  t.match(`{{ count | length }}`, r(), "02.05");
  t.match(`<div>{{ count }}</div>`, r(), "02.06");

  t.match(`{{ foo.bar }}`, r(), "02.07");
  t.match(`{{ foo["bar"] }}`, r(), "02.08");

  t.match(`{{ foo | title }}`, r(), "02.09");
  t.match(`{{ foo | join(",") }}`, r(), "02.10");
  t.match(`{{ foo | replace("foo", "bar") | capitalize }}`, r(), "02.11");
  t.end();
});

tap.test("logic", (t) => {
  t.match(`abc {% if something %}`, r(), "03.01");
  t.match(`abc {%- if something %}`, r(), "03.02");
  t.match(`abc {% if something -%}`, r(), "03.03");
  t.match(`abc {%- if something -%}`, r(), "03.04");
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
    r(),
    "04"
  );
  t.end();
});
