import { test } from "uvu";
import { equal } from "uvu/assert";

import { isJSP } from "../dist/regex-is-jsp.esm.js";

test("01 - standalone closing markers are not JSP evidence", () => {
  equal(isJSP().test("%>"), false, "01.01");
  equal(isJSP().test("%> text %> %>"), false, "01.02");
  equal(isJSP().test("<p>Score: 100%>90%</p>"), false, "01.03");
});

test("02 - every classic JSP opening remains recognized", () => {
  equal(isJSP().test("<% int count = 0; %>"), true, "02.01");
  equal(isJSP().test("<%= name %>"), true, "02.02");
  equal(isJSP().test("<%! int count = 0; %>"), true, "02.03");
  equal(isJSP().test('<%@ page contentType="text/html" %>'), true, "02.04");
  equal(isJSP().test("<%-- A JSP comment --%>"), true, "02.05");
});

test("03 - an opening marker accepts an unfinished editor fragment", () => {
  equal(isJSP().test("<%"), true, "03.01");
});

test("04 - JSP openings remain visible in HTML script and style", () => {
  equal(
    isJSP().test('<script>const name = "<%= name %>";</script>'),
    true,
    "04.01",
  );
  equal(isJSP().test("<style>.x{color:<%= color %>;}</style>"), true, "04.02");
});

test("05 - global matching returns classic openings without closers", () => {
  equal(
    "<% code; %><%= value %><%! int value; %><%@ page %><%-- note --%> %>".match(
      isJSP(),
    ),
    ["<%", "<%", "<%", "<%", "<%"],
    "05.01",
  );
});

test("06 - factory calls keep independent match positions", () => {
  const first = isJSP();
  equal(first.test("<%= name %>"), true, "06.01");
  const second = isJSP();
  equal(first === second, false, "06.02");
  equal(second.lastIndex, 0, "06.03");
  equal(second.test("<%= name %>"), true, "06.04");
});

test.run();
