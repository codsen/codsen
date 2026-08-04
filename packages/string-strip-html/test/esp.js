// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { rApply } from "ranges-apply";
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

// embedded expressions (e.g. Rails or Phoenix templates)
// -----------------------------------------------------------------------------

test("001 - templating tags", () => {
  let input = "<div>My variable: <%= @var %></div>";
  let intended = "My variable: <%= @var %>";
  equal(stripHtml(input).result, intended, "001.01");
  equal(rApply(input, stripHtml(input).ranges), intended, "001.02");
});

test("002", () => {
  let input =
    '<a href="https://example.com/test?param1=<%= @param1 %>&param2=<%= @param2 %>">click me</a>';
  let intended = "click me";
  equal(stripHtml(input).result, intended, "002.01");
  equal(rApply(input, stripHtml(input).ranges), intended, "002.02");
});

// jinja/nunjucks
// -----------------------------------------------------------------------------

test("003 - templating tags - healthy nunjucks pair", () => {
  let input = "<div>My variable: {% if x %}</div>";
  let intended = "My variable: {% if x %}";
  equal(stripHtml(input).result, intended, "003.01");
  equal(rApply(input, stripHtml(input).ranges), intended, "003.02");
});

test("004 - templating tags - unclosed nunjucks", () => {
  let input = "<div>My variable: {% if x</div>";
  let intended = "My variable: {% if x";
  equal(stripHtml(input).result, intended, "004.01");
  equal(rApply(input, stripHtml(input).ranges), intended, "004.02");
});

test.run();
