import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

// JSP's
// -----------------------------------------------------------------------------

test("01", () => {
  let input = `kl <c:when test="\${ab > cd}"> mn`;
  equal(stripHtml(input).result, input, "01.01");
});

test("02", () => {
  let input = `kl <c:when test="\${ab < cd}"> mn`;
  equal(stripHtml(input).result, input, "02.01");
});

test("03", () => {
  let input = `kl <c:when test="\${!empty ab.cd && ab.cd > 0.00}"> mn`;
  equal(stripHtml(input).result, input, "03.01");
});

test("04", () => {
  let input = `kl <c:when test="\${!empty ab.cd && ab.cd < 0.00}"> mn`;
  equal(stripHtml(input).result, input, "04.01");
});

test("05", () => {
  let input = `<%@ taglib prefix = "fmt" uri = "http://java.sun.com/jsp/jstl/fmt" %>`;
  equal(stripHtml(input).result, input, "05.01");
});

test("06", () => {
  let input = `kl <fmt:blablabla> mn`;
  equal(stripHtml(input).result, input, "06.01");
});

test("07", () => {
  let input = `kl <sql:blablabla> mn`;
  equal(stripHtml(input).result, input, "07.01");
});

test("08", () => {
  let input = `kl <x:blablabla> mn`;
  equal(stripHtml(input).result, input, "08.01");
});

test("09", () => {
  let input = `kl <fn:blablabla> mn`;
  equal(stripHtml(input).result, input, "09.01");
});

test.run();
