import { test } from "uvu";
import { equal } from "uvu/assert";

import { detectLang } from "../dist/detect-templating-language.esm.js";

test("01 - closing markers alone do not identify a template language", () => {
  equal(detectLang("%}"), { name: null }, "01.01");
  equal(detectLang("}}"), { name: null }, "01.02");
  equal(detectLang("%>"), { name: null }, "01.03");
  equal(detectLang("%} }} %> text }} %} %>"), { name: null }, "01.04");
});

test("02 - nested JSON and CSS braces do not identify a template language", () => {
  equal(detectLang('{"outer":{"inner":1}}'), { name: null }, "02.01");
  equal(detectLang("@media screen{.x{color:red}}"), { name: null }, "02.02");
});

test("03 - a JSP report with JavaScript closing braces stays JSP", () => {
  equal(
    detectLang(
      '<%@ page contentType="text/html" %><script>function report(){if(true){return 1;}}</script>',
    ),
    { name: "JSP" },
    "03.01",
  );
  equal(
    detectLang(
      '<style>@media screen{.report{color:red}}</style><%@ page contentType="text/html" %>',
    ),
    { name: "JSP" },
    "03.02",
  );
});

test("04 - a percentage comparison does not identify JSP", () => {
  equal(detectLang("<p>Score: 100%>90%</p>"), { name: null }, "04.01");
});

test("05 - every classic JSP opening remains recognized", () => {
  equal(detectLang("<% int count = 0; %>"), { name: "JSP" }, "05.01");
  equal(detectLang("<%= name %>"), { name: "JSP" }, "05.02");
  equal(detectLang("<%! int count = 0; %>"), { name: "JSP" }, "05.03");
  equal(
    detectLang('<%@ page contentType="text/html" %>'),
    { name: "JSP" },
    "05.04",
  );
  equal(detectLang("<%-- A JSP comment --%>"), { name: "JSP" }, "05.05");
});

test("06 - opening markers accept unfinished editor fragments", () => {
  equal(detectLang("{%"), { name: "Nunjucks" }, "06.01");
  equal(detectLang("{{"), { name: "Nunjucks" }, "06.02");
  equal(detectLang("<%"), { name: "JSP" }, "06.03");
});

test("07 - family syntax remains visible in HTML script and style", () => {
  equal(
    detectLang('<script>const name = "{{ user.name }}";</script>'),
    { name: "Nunjucks" },
    "07.01",
  );
  equal(
    detectLang("<style>.x{color:{{ color }};}</style>"),
    { name: "Nunjucks" },
    "07.02",
  );
});

test("08 - JSP syntax remains visible in HTML script and style", () => {
  equal(
    detectLang('<script>const name = "<%= name %>";</script>'),
    { name: "JSP" },
    "08.01",
  );
  equal(
    detectLang("<style>.x{color:<%= color %>;}</style>"),
    { name: "JSP" },
    "08.02",
  );
});

test("09 - mixed family and JSP openings retain family precedence", () => {
  equal(
    detectLang("{{ name }} <% int count = 0; %>"),
    { name: "Nunjucks" },
    "09.01",
  );
  equal(
    detectLang("<% int count = 0; %> {{ name }}"),
    { name: "Nunjucks" },
    "09.02",
  );
  equal(detectLang('{{ "<%= name %>" }}'), { name: "Nunjucks" }, "09.03");
  equal(
    detectLang("{{ \"<%@ page contentType='text/html' %>\" }}"),
    { name: "Nunjucks" },
    "09.04",
  );
  equal(
    detectLang("{# <jsp:useBean/> #}{{ value }}"),
    { name: "Nunjucks" },
    "09.05",
  );
  equal(
    detectLang('{% set ns = namespace(value="<%= name %>") %}'),
    { name: "Jinja" },
    "09.06",
  );
});

test.run();
