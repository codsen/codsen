import tap from "tap";
import { rApply } from "ranges-apply";
import { stripHtml } from "../dist/string-strip-html.esm";

// <%= @var %>
// -----------------------------------------------------------------------------

tap.test("01 - templating tags", (t) => {
  const input = `<div>My variable: <%= @var %></div>`;
  const result = "My variable: <%= @var %>";
  t.match(stripHtml(input), { result }, "01.01");
  t.match(rApply(input, stripHtml(input).ranges), result, "01.02");
  t.end();
});

tap.only("02", (t) => {
  const input = `<a href="https://example.com/test?param1=<%= @param1 %>&param2=<%= @param2 %>">click me</a>`;
  const result = "click me";
  t.match(stripHtml(input), { result }, "01.01");
  t.match(rApply(input, stripHtml(input).ranges), result, "01.02");
  t.end();
});
