// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
/** biome-ignore-all lint/suspicious/noTemplateCurlyInString: these are various edge cases */
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

// JSP's
// -----------------------------------------------------------------------------

test("001", () => {
  let input = 'kl <c:when test="${ab > cd}"> mn';
  equal(stripHtml(input).result, input, "001.01");
});

test("002", () => {
  let input = 'kl <c:when test="${ab < cd}"> mn';
  equal(stripHtml(input).result, input, "002.01");
});

test("003", () => {
  let input = 'kl <c:when test="${!empty ab.cd && ab.cd > 0.00}"> mn';
  equal(stripHtml(input).result, input, "003.01");
});

test("004", () => {
  let input = 'kl <c:when test="${!empty ab.cd && ab.cd < 0.00}"> mn';
  equal(stripHtml(input).result, input, "004.01");
});

test("005", () => {
  let input =
    '<%@ taglib prefix = "fmt" uri = "http://java.sun.com/jsp/jstl/fmt" %>';
  equal(stripHtml(input).result, input, "005.01");
});

test("006", () => {
  let input = "kl <fmt:blablabla> mn";
  equal(stripHtml(input).result, input, "006.01");
});

test("007", () => {
  let input = "kl <sql:blablabla> mn";
  equal(stripHtml(input).result, input, "007.01");
});

test("008", () => {
  let input = "kl <x:blablabla> mn";
  equal(stripHtml(input).result, input, "008.01");
});

test("009", () => {
  let input = "kl <fn:blablabla> mn";
  equal(stripHtml(input).result, input, "009.01");
});

test.run();
