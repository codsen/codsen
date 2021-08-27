import tap from "tap";
import { isJSP } from "../dist/regex-is-jsp.esm.js";

tap.test("01 is not JSP", (t) => {
  t.notMatch(``, isJSP(), "01.01");
  t.notMatch(`\n`, isJSP(), "01.02");
  t.notMatch(`abc`, isJSP(), "01.03");
  t.notMatch(`<html><div></html>`, isJSP(), "01.04");
  t.end();
});

tap.test("02 scriptlet", (t) => {
  t.match(`<% code fragment %>`, isJSP(), "02.01");
  t.match(
    `<% out.println("Your IP: " + request.getRemoteAddisJSP()); %>`,
    isJSP(),
    "02.02"
  );
  t.end();
});

tap.test("03 declarations", (t) => {
  t.match(`<%! declaration; %>`, isJSP(), "03.01");
  t.match(`<%! int i = 0; %>`, isJSP(), "03.02");
  t.match(`<%! int a, b, c; %>`, isJSP(), "03.03");
  t.match(`<%! Circle a = new Circle(1.0); %>`, isJSP(), "03.04");
  t.end();
});

tap.test("04 expressions", (t) => {
  t.match(`<%= expression %>`, isJSP(), "04.01");
  t.match(
    `<p>Today's date: <%= (new java.util.Date()).toLocaleString()%></p>`,
    isJSP(),
    "04.02"
  );
  t.end();
});

tap.test("05 comments", (t) => {
  t.match(`<%-- This is JSP comment --%>`, isJSP(), "05");
  t.end();
});

tap.test("06 directives", (t) => {
  t.match(`<%@ directive attribute="value" %>`, isJSP(), "06.01");
  t.match(`<%@ page blablabla %>`, isJSP(), "06.02");
  t.match(`<%@ taglib blablabla %>`, isJSP(), "06.03");
  t.match(`<%@ include blablabla %>`, isJSP(), "06.04");
  t.end();
});

tap.test("07 JSP actions", (t) => {
  t.match(`<jsp:action_name attribute="value" />`, isJSP(), "07");
  t.end();
});

tap.test("08 wrapper tag", (t) => {
  t.match(
    `<%@tag description="Simple Wrapper Tag" pageEncoding="UTF-8"%>`,
    isJSP(),
    "08"
  );
  t.end();
});

tap.test("09 use bean", (t) => {
  t.match(`<jsp:useBean id = "name" class = "package.class" />`, isJSP(), "09");
  t.end();
});

tap.test("10 cms", (t) => {
  t.match(`<cms:enable-ade />`, isJSP(), "10");
  t.end();
});

tap.test("11 taglib", (t) => {
  t.match(`<%@taglib prefix="t" tagdir="/WEB-INF/tags" %>`, isJSP(), "11");
  t.end();
});

tap.test("12 prop mentioning JSP", (t) => {
  t.match(
    `\${jspProp.cardTypeName} **** **** **** \${jspProp.cardNumber}`,
    isJSP(),
    "12"
  );
  t.end();
});

tap.test("13 c:", (t) => {
  t.match(`<c:if test="\${!empty something}">`, isJSP(), "13");
  t.end();
});

tap.test("14 IF-ELSE", (t) => {
  t.match(
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
    "14"
  );
  t.end();
});
