import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import { rApply } from "ranges-apply";

import { stripHtml } from "./util/noLog.js";

// embedded expressions (e.g. Rails or Phoenix templates)
// -----------------------------------------------------------------------------

test("01 - templating tags", () => {
  let input = "<div>My variable: <%= @var %></div>";
  let intended = "My variable: <%= @var %>";
  equal(stripHtml(input).result, intended, "01.01");
  equal(rApply(input, stripHtml(input).ranges), intended, "01.02");
});

test("02", () => {
  let input =
    '<a href="https://example.com/test?param1=<%= @param1 %>&param2=<%= @param2 %>">click me</a>';
  let intended = "click me";
  equal(stripHtml(input).result, intended, "02.01");
  equal(rApply(input, stripHtml(input).ranges), intended, "02.02");
});

// jinja/nunjucks
// -----------------------------------------------------------------------------

test("03 - templating tags - healthy nunjucks pair", () => {
  let input = "<div>My variable: {% if x %}</div>";
  let intended = "My variable: {% if x %}";
  equal(stripHtml(input).result, intended, "03.01");
  equal(rApply(input, stripHtml(input).ranges), intended, "03.02");
});

test("04 - templating tags - unclosed nunjucks", () => {
  let input = "<div>My variable: {% if x</div>";
  let intended = "My variable: {% if x";
  equal(stripHtml(input).result, intended, "04.01");
  equal(rApply(input, stripHtml(input).ranges), intended, "04.02");
});

test.run();
