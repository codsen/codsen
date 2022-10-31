import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { isJSP } from "../dist/regex-is-jsp.esm.js";

test("01 is not JSP", () => {
  not.match(``, isJSP(), "01.01");
  not.match(`\n`, isJSP(), "01.02");
  not.match(`abc`, isJSP(), "01.03");
  not.match(`<html><div></html>`, isJSP(), "01.04");
});

test("02 scriptlet", () => {
  match(`<% code fragment %>`, isJSP(), "02.01");
  match(
    `<% out.println("Your IP: " + request.getRemoteAddisJSP()); %>`,
    isJSP(),
    "02.02"
  );
});

test("03 declarations", () => {
  match(`<%! declaration; %>`, isJSP(), "03.01");
  match(`<%! int i = 0; %>`, isJSP(), "03.02");
  match(`<%! int a, b, c; %>`, isJSP(), "03.03");
  match(`<%! Circle a = new Circle(1.0); %>`, isJSP(), "03.04");
});

test("04 expressions", () => {
  match(`<%= expression %>`, isJSP(), "04.01");
  match(
    `<p>Today's date: <%= (new java.util.Date()).toLocaleString()%></p>`,
    isJSP(),
    "04.02"
  );
});

test("05 comments", () => {
  match(`<%-- This is JSP comment --%>`, isJSP(), "05.01");
});

test("06 directives", () => {
  match(`<%@ directive attribute="value" %>`, isJSP(), "06.01");
  match(`<%@ page blablabla %>`, isJSP(), "06.02");
  match(`<%@ taglib blablabla %>`, isJSP(), "06.03");
  match(`<%@ include blablabla %>`, isJSP(), "06.04");
});

test("07 JSP actions", () => {
  match(`<jsp:action_name attribute="value" />`, isJSP(), "07.01");
});

test("08 wrapper tag", () => {
  match(
    `<%@tag description="Simple Wrapper Tag" pageEncoding="UTF-8"%>`,
    isJSP(),
    "08.01"
  );
});

test("09 use bean", () => {
  match(
    `<jsp:useBean id = "name" class = "package.class" />`,
    isJSP(),
    "09.01"
  );
});

test("10 cms", () => {
  match(`<cms:enable-ade />`, isJSP(), "10.01");
});

test("11 taglib", () => {
  match(`<%@taglib prefix="t" tagdir="/WEB-INF/tags" %>`, isJSP(), "11.01");
});

test("12 prop mentioning JSP", () => {
  match(
    `\${jspProp.cardTypeName} **** **** **** \${jspProp.cardNumber}`,
    isJSP(),
    "12.01"
  );
});

test("13 c:", () => {
  match(`<c:if test="\${!empty something}">`, isJSP(), "13.01");
});

test("14 IF-ELSE", () => {
  match(
    `<%! int day = 1; %>
<html>
   <head><title>Example</title></head>
   <body>
      <% if (day == 1 || day == 7) { %>
         <p>Weekend</p>
      <% } else { %>
         <p>Not weekend</p>
      <% } %>
   </body>
</html> `,
    isJSP(),
    "14.01"
  );
});

test.run();
