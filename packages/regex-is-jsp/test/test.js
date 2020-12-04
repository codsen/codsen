import tap from "tap";
import r from "../dist/regex-is-jsp.esm";

tap.test("01 is not JSP", (t) => {
  t.notMatch(``, r(), "01.01");
  t.notMatch(`\n`, r(), "01.02");
  t.notMatch(`abc`, r(), "01.03");
  t.notMatch(`<html><div></html>`, r(), "01.04");
  t.end();
});

tap.test("02 scriptlet", (t) => {
  t.match(`<% code fragment %>`, r(), "02.01");
  t.match(
    `<% out.println("Your IP: " + request.getRemoteAddr()); %>`,
    r(),
    "02.02"
  );
  t.end();
});

tap.test("03 declarations", (t) => {
  t.match(`<%! declaration; %>`, r(), "03.01");
  t.match(`<%! int i = 0; %>`, r(), "03.02");
  t.match(`<%! int a, b, c; %>`, r(), "03.03");
  t.match(`<%! Circle a = new Circle(1.0); %>`, r(), "03.04");
  t.end();
});

tap.test("04 expressions", (t) => {
  t.match(`<%= expression %>`, r(), "04.01");
  t.match(
    `<p>Today's date: <%= (new java.util.Date()).toLocaleString()%></p>`,
    r(),
    "04.02"
  );
  t.end();
});

tap.test("05 comments", (t) => {
  t.match(`<%-- This is JSP comment --%>`, r(), "05");
  t.end();
});

tap.test("06 directives", (t) => {
  t.match(`<%@ directive attribute="value" %>`, r(), "06.01");
  t.match(`<%@ page blablabla %>`, r(), "06.02");
  t.match(`<%@ taglib blablabla %>`, r(), "06.03");
  t.match(`<%@ include blablabla %>`, r(), "06.04");
  t.end();
});

tap.test("07 JSP actions", (t) => {
  t.match(`<jsp:action_name attribute="value" />`, r(), "07");
  t.end();
});

tap.test("08 wrapper tag", (t) => {
  t.match(
    `<%@tag description="Simple Wrapper Tag" pageEncoding="UTF-8"%>`,
    r(),
    "08"
  );
  t.end();
});

tap.test("09 use bean", (t) => {
  t.match(`<jsp:useBean id = "name" class = "package.class" />`, r(), "09");
  t.end();
});

tap.test("10 cms", (t) => {
  t.match(`<cms:enable-ade />`, r(), "10");
  t.end();
});

tap.test("11 taglib", (t) => {
  t.match(`<%@taglib prefix="t" tagdir="/WEB-INF/tags" %>`, r(), "11");
  t.end();
});

tap.test("12 prop mentioning JSP", (t) => {
  t.match(
    `\${jspProp.cardTypeName} **** **** **** \${jspProp.cardNumber}`,
    r(),
    "12"
  );
  t.end();
});

tap.test("13 c:", (t) => {
  t.match(`<c:if test="\${!empty something}">`, r(), "13");
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
    r(),
    "14"
  );
  t.end();
});
