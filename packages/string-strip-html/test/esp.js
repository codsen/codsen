import tap from "tap";
import { rApply } from "ranges-apply";
import { stripHtml } from "../dist/string-strip-html.esm";

// embedded expressions (e.g. Rails or Phoenix templates)
// -----------------------------------------------------------------------------

tap.test("01 - templating tags", (t) => {
  const input = `<div>My variable: <%= @var %></div>`;
  const result = "My variable: <%= @var %>";
  t.match(stripHtml(input), { result }, "01.01");
  t.match(rApply(input, stripHtml(input).ranges), result, "01.02");
  t.end();
});

tap.test("02", (t) => {
  const input = `<a href="https://example.com/test?param1=<%= @param1 %>&param2=<%= @param2 %>">click me</a>`;
  const result = "click me";
  t.match(stripHtml(input), { result }, "02.01");
  t.match(rApply(input, stripHtml(input).ranges), result, "02.02");
  t.end();
});

// jinja/nunjucks
// -----------------------------------------------------------------------------

tap.test("03 - templating tags - healthy nunjucks pair", (t) => {
  const input = `<div>My variable: {% if x %}</div>`;
  const result = "My variable: {% if x %}";
  t.match(stripHtml(input), { result }, "03.01");
  t.match(rApply(input, stripHtml(input).ranges), result, "03.02");
  t.end();
});

tap.test("04 - templating tags - unclosed nunjucks", (t) => {
  const input = `<div>My variable: {% if x</div>`;
  const result = "My variable: {% if x";
  t.match(stripHtml(input), { result }, "04.01");
  t.match(rApply(input, stripHtml(input).ranges), result, "04.02");
  t.end();
});
