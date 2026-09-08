import { test } from "uvu";
import { equal } from "uvu/assert";

import { isJSP } from "../dist/regex-is-jsp.esm.js";

test("01 - renamed JSP prefixes supply namespace markers", () => {
  equal(
    isJSP().test('<j:root xmlns:j="http://java.sun.com/JSP/Page" />'),
    true,
    "01.01",
  );
  equal(
    isJSP().test("<page:root xmlns:page='http://java.sun.com/JSP/Page' />"),
    true,
    "01.02",
  );
});

test("02 - default JSP namespaces supply markers", () => {
  equal(
    isJSP().test('<root xmlns="http://java.sun.com/JSP/Page" />'),
    true,
    "02.01",
  );
  equal(
    isJSP().test("<root xmlns='http://java.sun.com/JSP/Page' />"),
    true,
    "02.02",
  );
});

test("03 - XML whitespace is allowed around the equals sign", () => {
  equal(
    isJSP().test('xmlns:j \t\r\n= \t\r\n"http://java.sun.com/JSP/Page"'),
    true,
    "03.01",
  );
  equal(
    isJSP().test("xmlns \n=\t'http://java.sun.com/JSP/Page'"),
    true,
    "03.02",
  );
});

test("04 - other whitespace cannot separate the declaration value", () => {
  equal(
    isJSP().test('xmlns:j\f="http://java.sun.com/JSP/Page"'),
    false,
    "04.01",
  );
  equal(
    isJSP().test('xmlns:j=\u00a0"http://java.sun.com/JSP/Page"'),
    false,
    "04.02",
  );
});

test("05 - the quoted URI must end exactly after Page", () => {
  equal(
    isJSP().test('xmlns:j="http://java.sun.com/JSP/Page/other"'),
    false,
    "05.01",
  );
  equal(
    isJSP().test("xmlns:j='http://java.sun.com/JSP/PageExtra'"),
    false,
    "05.02",
  );
  equal(
    isJSP().test('xmlns:j="http://java.sun.com/JSP/Page?query=value"'),
    false,
    "05.03",
  );
  equal(
    isJSP().test('xmlns:j="http://java.sun.com/JSP/Page "'),
    false,
    "05.04",
  );
  equal(
    isJSP().test('xmlns:j="https://java.sun.com/JSP/Page"'),
    false,
    "05.05",
  );
});

test("06 - the opening and closing quote must agree", () => {
  equal(
    isJSP().test("xmlns:j=\"http://java.sun.com/JSP/Page'"),
    false,
    "06.01",
  );
  equal(
    isJSP().test("xmlns:j='http://java.sun.com/JSP/Page\""),
    false,
    "06.02",
  );
  equal(isJSP().test('xmlns:j="http://java.sun.com/JSP/Page'), false, "06.03");
  equal(isJSP().test("xmlns:j=http://java.sun.com/JSP/Page"), false, "06.04");
});

test("07 - declaration names require xmlns and at most one prefix separator", () => {
  equal(
    isJSP().test('notxmlns:j="http://java.sun.com/JSP/Page"'),
    false,
    "07.01",
  );
  equal(
    isJSP().test('xmlnsOther="http://java.sun.com/JSP/Page"'),
    false,
    "07.02",
  );
  equal(isJSP().test('xmlns:="http://java.sun.com/JSP/Page"'), false, "07.03");
  equal(
    isJSP().test('xmlns:a:b="http://java.sun.com/JSP/Page"'),
    false,
    "07.04",
  );
});

test("08 - prefix markers include Unicode and punctuation used in XML names", () => {
  equal(
    isJSP().test('xmlns:页面="http://java.sun.com/JSP/Page"'),
    true,
    "08.01",
  );
  equal(
    isJSP().test('xmlns:page-one.two_3="http://java.sun.com/JSP/Page"'),
    true,
    "08.02",
  );
});

test("09 - substring markers do not require a live scoped element", () => {
  equal(
    isJSP().test('The declaration xmlns:j="http://java.sun.com/JSP/Page"'),
    true,
    "09.01",
  );
  equal(
    isJSP().test('<!-- xmlns:j="http://java.sun.com/JSP/Page" -->'),
    true,
    "09.02",
  );
  equal(
    isJSP().test('<root xmlns:j="http://java.sun.com/JSP/Page" />'),
    true,
    "09.03",
  );
});

test("10 - factory flags remain global and case insensitive", () => {
  const matcher = isJSP();
  equal(matcher.flags, "gi", "10.01");
  equal(matcher.test('XMLNS:J="HTTP://JAVA.SUN.COM/jsp/page"'), true, "10.02");
});

test("11 - match arrays preserve exact declaration and existing marker spans", () => {
  equal(
    "<%= name %><j:root xmlns:j = \"http://java.sun.com/JSP/Page\"><jsp:text/></j:root><root xmlns='http://java.sun.com/JSP/Page'/>".match(
      isJSP(),
    ),
    [
      "<%",
      'xmlns:j = "http://java.sun.com/JSP/Page"',
      "<jsp:",
      "xmlns='http://java.sun.com/JSP/Page'",
    ],
    "11.01",
  );
});

test("12 - independent factory calls retain separate match positions", () => {
  const source = 'xmlns:j="http://java.sun.com/JSP/Page"';
  const first = isJSP();
  equal(first.test(source), true, "12.01");
  equal(first.lastIndex, source.length, "12.02");
  const second = isJSP();
  equal(first === second, false, "12.03");
  equal(second.lastIndex, 0, "12.04");
  equal(second.exec(source)?.[0], source, "12.05");
});

test("13 - repeated declaration fragments and long prefixes remain bounded", () => {
  equal(
    isJSP().test(`${"xmlns:".repeat(16_000)}="http://java.sun.com/JSP/Page"`),
    false,
    "13.01",
  );
  equal(
    isJSP().test(
      `xmlns:${"page".repeat(16_000)}="http://java.sun.com/JSP/PageX"`,
    ),
    false,
    "13.02",
  );
  equal(
    isJSP().test(`${"xmlns:".repeat(16_000)}j="http://java.sun.com/JSP/Page"`),
    true,
    "13.03",
  );
});

test.run();
