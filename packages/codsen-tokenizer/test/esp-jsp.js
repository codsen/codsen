/* eslint no-template-curly-in-string:0 */

import tap from "tap";
import { tokenizer as ct } from "../dist/codsen-tokenizer.esm.js";

// JSP (Java Server Pages) templating tags

// const openingCurly = "\x7B";

tap.test(`01 - JSP c: with \${ reminding a Responsys tag`, (t) => {
  const gathered = [];
  const input = '<c:set var="someList" value="${jspProp.someList}" />';
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.match(
    gathered,
    [
      {
        type: "esp",
        start: 0,
        end: 52,
        value: input,
        head: "<",
        headStartsAt: 0,
        headEndsAt: 1,
        tail: "/>",
        tailStartsAt: 50,
        tailEndsAt: 52,
      },
    ],
    "01"
  );
  t.end();
});

tap.test(`02 - JSP scriptlet`, (t) => {
  const gathered = [];
  const input = "<% code fragment %>";
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.match(
    gathered,
    [
      {
        type: "esp",
        start: 0,
        end: 19,
        value: "<% code fragment %>",
        head: "<%",
        headStartsAt: 0,
        headEndsAt: 2,
        tail: "%>",
        tailStartsAt: 17,
        tailEndsAt: 19,
      },
    ],
    "02"
  );
  t.end();
});

tap.test(`03 - JSP scriptlet`, (t) => {
  const gathered = [];
  const input = `<% out.println("Your IP: " + request.getRemoteAddr()); %>`;
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.match(
    gathered,
    [
      {
        type: "esp",
        start: 0,
        end: 57,
        value: input,
        head: "<%",
        headStartsAt: 0,
        headEndsAt: 2,
        tail: "%>",
        tailStartsAt: 55,
        tailEndsAt: 57,
      },
    ],
    "03"
  );
  t.end();
});

tap.test(`04 - declarations`, (t) => {
  [
    // spaced out:
    `<%! declaration; %>`,
    `<%! int i = 0; %>`,
    `<%! int a, b, c; %>`,
    `<%! Circle a = new Circle(1.0); %>`,
    // tight:
    `<%!declaration;%>`,
    `<%!int i = 0;%>`,
    `<%!int a, b, c;%>`,
    `<%!Circle a = new Circle(1.0);%>`,
  ].forEach((input) => {
    const gathered = [];
    ct(input, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.match(
      gathered,
      [
        {
          type: "esp",
          start: 0,
          end: input.length,
          value: input,
          head: "<%!",
          headStartsAt: 0,
          headEndsAt: 3,
          tail: "%>",
          tailStartsAt: input.length - 2,
          tailEndsAt: input.length,
        },
      ],
      input
    );
  });
  t.end();
});

tap.test(`05 - expressions`, (t) => {
  [
    // spaced out:
    `<%= expression %>`,
    `<%= (new java.util.Date()).toLocaleString() %>`,
    // tight:
    `<%=expression%>`,
    `<%=(new java.util.Date()).toLocaleString()%>`,
  ].forEach((input) => {
    const gathered = [];
    ct(input, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.match(
      gathered,
      [
        {
          type: "esp",
          start: 0,
          end: input.length,
          value: input,
          head: "<%=",
          headStartsAt: 0,
          headEndsAt: 3,
          tail: "%>",
          tailStartsAt: input.length - 2,
          tailEndsAt: input.length,
        },
      ],
      input
    );
  });
  t.end();
});

tap.test(`06 - mixed`, (t) => {
  const gathered = [];
  const input = `<p>Today's date: <%= (new java.util.Date()).toLocaleString()%></p>`;
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.match(
    gathered,
    [
      {
        type: "tag",
        start: 0,
        end: 3,
        value: "<p>",
        tagNameStartsAt: 1,
        tagNameEndsAt: 2,
        tagName: "p",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
      {
        type: "text",
        start: 3,
        end: 17,
        value: "Today's date: ",
      },
      {
        type: "esp",
        start: 17,
        end: 62,
        value: "<%= (new java.util.Date()).toLocaleString()%>",
        head: "<%=",
        headStartsAt: 17,
        headEndsAt: 20,
        tail: "%>",
        tailStartsAt: 60,
        tailEndsAt: 62,
      },
      {
        type: "tag",
        start: 62,
        end: 66,
        value: "</p>",
        tagNameStartsAt: 64,
        tagNameEndsAt: 65,
        tagName: "p",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
    ],
    "06"
  );
  t.end();
});

tap.test(`07 - comments`, (t) => {
  [
    // spaced out:
    `<%-- This is JSP comment --%>`,
    // tight:
    `<%--This is JSP comment--%>`,
  ].forEach((input) => {
    const gathered = [];
    ct(input, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.match(
      gathered,
      [
        {
          type: "esp",
          start: 0,
          end: input.length,
          value: input,
          head: "<%--",
          headStartsAt: 0,
          headEndsAt: 4,
          tail: "--%>",
          tailStartsAt: input.length - 4,
          tailEndsAt: input.length,
        },
      ],
      input
    );
  });
  t.end();
});

tap.test(`08 - directives`, (t) => {
  [
    // spaced out:
    `<%@ directive attribute="value" %>`,
    `<%@ page blablabla %>`,
    `<%@ taglib blablabla %>`,
    `<%@ include blablabla %>`,
    `<%@tag description="Simple Wrapper Tag" pageEncoding="UTF-8" %>`,
    `<%@taglib prefix="t" tagdir="/WEB-INF/tags" %>`,
    `<%@taglib prefix='t' tagdir='/WEB-INF/tags' %>`,
    // mismatching quotes:
    `<%@taglib prefix="t' tagdir='/WEB-INF/tags" %>`,
    `<%@taglib prefix="t' tagdir='/WEB-INF/tags' %>`,
    `<%@taglib prefix="t' tagdir='/WEB-INF/tags" %>`,
    // tight:
    `<%@directive attribute="value"%>`,
    `<%@page blablabla%>`,
    `<%@taglib blablabla%>`,
    `<%@include blablabla%>`,
    `<%@tag description="Simple Wrapper Tag" pageEncoding="UTF-8"%>`,
    `<%@taglib prefix="t" tagdir="/WEB-INF/tags"%>`,
    `<%@taglib prefix='t' tagdir='/WEB-INF/tags'%>`,
    // mismatching quotes:
    `<%@taglib prefix="t' tagdir='/WEB-INF/tags"%>`,
    `<%@taglib prefix="t' tagdir='/WEB-INF/tags'%>`,
    `<%@taglib prefix="t' tagdir='/WEB-INF/tags"%>`,
  ].forEach((input) => {
    const gathered = [];
    ct(input, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.match(
      gathered,
      [
        {
          type: "esp",
          start: 0,
          end: input.length,
          value: input,
          head: "<%@",
          headStartsAt: 0,
          headEndsAt: 3,
          tail: "%>",
          tailStartsAt: input.length - 2,
          tailEndsAt: input.length,
        },
      ],
      input
    );
  });
  t.end();
});

tap.test(`09 - JSP actions`, (t) => {
  const gathered = [];
  const input = `<jsp:action_name attribute="value"/>`;
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.match(
    gathered,
    [
      {
        type: "esp",
        start: 0,
        end: 36,
        value: input,
        head: "<",
        headStartsAt: 0,
        headEndsAt: 1,
        tail: "/>",
        tailStartsAt: 34,
        tailEndsAt: 36,
      },
    ],
    "09"
  );
  t.end();
});

tap.test(`10 - use bean`, (t) => {
  const gathered = [];
  const input = `<jsp:useBean id = "name" class = "package.class" />`;
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.match(
    gathered,
    [
      {
        type: "esp",
        start: 0,
        end: input.length,
        value: input,
        head: "<",
        headStartsAt: 0,
        headEndsAt: 1,
        tail: "/>",
        tailStartsAt: input.length - 2,
        tailEndsAt: input.length,
      },
    ],
    "10"
  );
  t.end();
});

tap.test(`11 - use cms`, (t) => {
  const gathered = [];
  const input = `<cms:enable-ade />`;
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.match(
    gathered,
    [
      {
        type: "esp",
        start: 0,
        end: input.length,
        value: input,
        head: "<",
        headStartsAt: 0,
        headEndsAt: 1,
        tail: "/>",
        tailStartsAt: input.length - 2,
        tailEndsAt: input.length,
      },
    ],
    "11"
  );
  t.end();
});

tap.test(`12 - standalone JSP prop`, (t) => {
  const gathered = [];
  const input =
    "<p>${jspProp.cardTypeName} **** **** **** ${jspProp.cardNumber}</p>";
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.match(
    gathered,
    [
      {
        type: "tag",
        start: 0,
        end: 3,
        value: "<p>",
        tagNameStartsAt: 1,
        tagNameEndsAt: 2,
        tagName: "p",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
      {
        type: "esp",
        start: 3,
        end: 26,
        value: "${jspProp.cardTypeName}",
        head: "${",
        headStartsAt: 3,
        headEndsAt: 5,
        tail: "}",
        tailStartsAt: 25,
        tailEndsAt: 26,
      },
      {
        type: "text",
        start: 26,
        end: 42,
        value: " **** **** **** ",
      },
      {
        type: "esp",
        start: 42,
        end: 63,
        value: "${jspProp.cardNumber}",
        head: "${",
        headStartsAt: 42,
        headEndsAt: 44,
        tail: "}",
        tailStartsAt: 62,
        tailEndsAt: 63,
      },
      {
        type: "tag",
        start: 63,
        end: 67,
        value: "</p>",
        tagNameStartsAt: 65,
        tagNameEndsAt: 66,
        tagName: "p",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      },
    ],
    "12"
  );
  t.end();
});

tap.test(`13 - c: without closing slash`, (t) => {
  const gathered = [];
  const input = `<c:if test="\${!empty something}">`;
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.match(
    gathered,
    [
      {
        type: "esp",
        start: 0,
        end: input.length,
        value: input,
        head: "<",
        headStartsAt: 0,
        headEndsAt: 1,
        tail: ">",
        tailStartsAt: input.length - 1,
        tailEndsAt: input.length,
      },
    ],
    "13"
  );
  t.end();
});

tap.test(`14 - IF-ELSE mixed with HTML`, (t) => {
  const gathered = [];
  const input = `<%! int day = 1; %>
<html>
   <head><title>Example</title></head>
   <body>
      <% if (day == 1 || day == 7) { %>
         <p>Weekend</p>
      <% } else { %>
         <p>Not weekend</p>
      <% } %>
   </body>
</html>`;
  ct(input, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.match(
    gathered,
    [
      {
        type: "esp",
        start: 0,
        end: 19,
        value: "<%! int day = 1; %>",
        head: "<%!",
        headStartsAt: 0,
        headEndsAt: 3,
        tail: "%>",
        tailStartsAt: 17,
        tailEndsAt: 19,
      },
      {
        type: "text",
        start: 19,
        end: 20,
        value: "\n",
      },
      {
        type: "tag",
        start: 20,
        end: 26,
        value: "<html>",
      },
      {
        type: "text",
        start: 26,
        end: 30,
        value: "\n   ",
      },
      {
        type: "tag",
        start: 30,
        end: 36,
        value: "<head>",
      },
      {
        type: "tag",
        start: 36,
        end: 43,
        value: "<title>",
      },
      {
        type: "text",
        start: 43,
        end: 50,
        value: "Example",
      },
      {
        type: "tag",
        start: 50,
        end: 58,
        value: "</title>",
      },
      {
        type: "tag",
        start: 58,
        end: 65,
        value: "</head>",
      },
      {
        type: "text",
        start: 65,
        end: 69,
        value: "\n   ",
      },
      {
        type: "tag",
        start: 69,
        end: 75,
        value: "<body>",
      },
      {
        type: "text",
        start: 75,
        end: 82,
        value: "\n      ",
      },
      {
        type: "esp",
        start: 82,
        end: 115,
        value: "<% if (day == 1 || day == 7) { %>",
        head: "<%",
        headStartsAt: 82,
        headEndsAt: 84,
        tail: "%>",
        tailStartsAt: 113,
        tailEndsAt: 115,
      },
      {
        type: "text",
        start: 115,
        end: 125,
        value: "\n         ",
      },
      {
        type: "tag",
        start: 125,
        end: 128,
        value: "<p>",
      },
      {
        type: "text",
        start: 128,
        end: 135,
        value: "Weekend",
      },
      {
        type: "tag",
        start: 135,
        end: 139,
        value: "</p>",
      },
      {
        type: "text",
        start: 139,
        end: 146,
        value: "\n      ",
      },
      {
        type: "esp",
        start: 146,
        end: 160,
        value: "<% } else { %>",
        head: "<%",
        headStartsAt: 146,
        headEndsAt: 148,
        tail: "%>",
        tailStartsAt: 158,
        tailEndsAt: 160,
      },
      {
        type: "text",
        start: 160,
        end: 170,
        value: "\n         ",
      },
      {
        type: "tag",
        start: 170,
        end: 173,
        value: "<p>",
      },
      {
        type: "text",
        start: 173,
        end: 184,
        value: "Not weekend",
      },
      {
        type: "tag",
        start: 184,
        end: 188,
        value: "</p>",
      },
      {
        type: "text",
        start: 188,
        end: 195,
        value: "\n      ",
      },
      {
        type: "esp",
        start: 195,
        end: 202,
        value: "<% } %>",
        head: "<%",
        headStartsAt: 195,
        headEndsAt: 197,
        tail: "%>",
        tailStartsAt: 200,
        tailEndsAt: 202,
      },
      {
        type: "text",
        start: 202,
        end: 206,
        value: "\n   ",
      },
      {
        type: "tag",
        start: 206,
        end: 213,
        value: "</body>",
      },
      {
        type: "text",
        start: 213,
        end: 214,
        value: "\n",
      },
      {
        type: "tag",
        start: 214,
        end: 221,
        value: "</html>",
      },
    ],
    "14"
  );
  t.end();
});
