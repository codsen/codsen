import tap from "tap";
import { stripHtml } from "../dist/string-strip-html.esm.js";

// JSP's
// -----------------------------------------------------------------------------

tap.test("01", (t) => {
  const input = `kl <c:when test="\${ab > cd}"> mn`;
  t.match(stripHtml(input), { result: input }, "01");
  t.end();
});

tap.test("02", (t) => {
  const input = `kl <c:when test="\${ab < cd}"> mn`;
  t.match(stripHtml(input), { result: input }, "02");
  t.end();
});

tap.test("03", (t) => {
  const input = `kl <c:when test="\${!empty ab.cd && ab.cd > 0.00}"> mn`;
  t.match(stripHtml(input), { result: input }, "03");
  t.end();
});

tap.test("04", (t) => {
  const input = `kl <c:when test="\${!empty ab.cd && ab.cd < 0.00}"> mn`;
  t.match(stripHtml(input), { result: input }, "04");
  t.end();
});

tap.test("05", (t) => {
  const input = `<%@ taglib prefix = "fmt" uri = "http://java.sun.com/jsp/jstl/fmt" %>`;
  t.match(stripHtml(input), { result: input }, "05");
  t.end();
});

tap.test("06", (t) => {
  const input = `kl <fmt:blablabla> mn`;
  t.match(stripHtml(input), { result: input }, "06");
  t.end();
});

tap.test("07", (t) => {
  const input = `kl <sql:blablabla> mn`;
  t.match(stripHtml(input), { result: input }, "07");
  t.end();
});

tap.test("08", (t) => {
  const input = `kl <x:blablabla> mn`;
  t.match(stripHtml(input), { result: input }, "08");
  t.end();
});

tap.test("09", (t) => {
  const input = `kl <fn:blablabla> mn`;
  t.match(stripHtml(input), { result: input }, "09");
  t.end();
});
