/* eslint no-template-curly-in-string:0 */

import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { tokenizer as ct } from "../dist/codsen-tokenizer.esm.js";

// Embedded Ruby (ERB) templates

test("01 - expression, no trim", () => {
  let gathered = [];
  ct("a<%= expression1 %>b<%= expression2 %>c", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  equal(
    gathered,
    [
      {
        type: "text",
        start: 0,
        end: 1,
        value: "a",
      },
      {
        type: "esp",
        start: 1,
        end: 19,
        value: "<%= expression1 %>",
        head: "<%=",
        headStartsAt: 1,
        headEndsAt: 4,
        tail: "%>",
        tailStartsAt: 17,
        tailEndsAt: 19,
      },
      {
        type: "text",
        start: 19,
        end: 20,
        value: "b",
      },
      {
        type: "esp",
        start: 20,
        end: 38,
        value: "<%= expression2 %>",
        head: "<%=",
        headStartsAt: 20,
        headEndsAt: 23,
        tail: "%>",
        tailStartsAt: 36,
        tailEndsAt: 38,
      },
      {
        type: "text",
        start: 38,
        end: 39,
        value: "c",
      },
    ],
    "01.01"
  );
});

test("02 - expression, trim", () => {
  let gathered = [];
  ct("a<%= expression1 -%>b<%= expression2 -%>c", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  equal(
    gathered,
    [
      {
        type: "text",
        start: 0,
        end: 1,
        value: "a",
      },
      {
        type: "esp",
        start: 1,
        end: 20,
        value: "<%= expression1 -%>",
        head: "<%=",
        headStartsAt: 1,
        headEndsAt: 4,
        tail: "-%>",
        tailStartsAt: 17,
        tailEndsAt: 20,
      },
      {
        type: "text",
        start: 20,
        end: 21,
        value: "b",
      },
      {
        type: "esp",
        start: 21,
        end: 40,
        value: "<%= expression2 -%>",
        head: "<%=",
        headStartsAt: 21,
        headEndsAt: 24,
        tail: "-%>",
        tailStartsAt: 37,
        tailEndsAt: 40,
      },
      {
        type: "text",
        start: 40,
        end: 41,
        value: "c",
      },
    ],
    "02.01"
  );
});

test("03 - code, no trim", () => {
  let gathered = [];
  ct("a<% code1 %>b<% code2 %>c", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  equal(
    gathered,
    [
      {
        type: "text",
        start: 0,
        end: 1,
        value: "a",
      },
      {
        type: "esp",
        start: 1,
        end: 12,
        value: "<% code1 %>",
        head: "<%",
        headStartsAt: 1,
        headEndsAt: 3,
        tail: "%>",
        tailStartsAt: 10,
        tailEndsAt: 12,
      },
      {
        type: "text",
        start: 12,
        end: 13,
        value: "b",
      },
      {
        type: "esp",
        start: 13,
        end: 24,
        value: "<% code2 %>",
        head: "<%",
        headStartsAt: 13,
        headEndsAt: 15,
        tail: "%>",
        tailStartsAt: 22,
        tailEndsAt: 24,
      },
      {
        type: "text",
        start: 24,
        end: 25,
        value: "c",
      },
    ],
    "03.01"
  );
});

test("04 - code, trim", () => {
  let gathered = [];
  ct("a<% code1 -%>b<% code2 -%>c", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  equal(
    gathered,
    [
      {
        type: "text",
        start: 0,
        end: 1,
        value: "a",
      },
      {
        type: "esp",
        start: 1,
        end: 13,
        value: "<% code1 -%>",
        head: "<%",
        headStartsAt: 1,
        headEndsAt: 3,
        tail: "-%>",
        tailStartsAt: 10,
        tailEndsAt: 13,
      },
      {
        type: "text",
        start: 13,
        end: 14,
        value: "b",
      },
      {
        type: "esp",
        start: 14,
        end: 26,
        value: "<% code2 -%>",
        head: "<%",
        headStartsAt: 14,
        headEndsAt: 16,
        tail: "-%>",
        tailStartsAt: 23,
        tailEndsAt: 26,
      },
      {
        type: "text",
        start: 26,
        end: 27,
        value: "c",
      },
    ],
    "04.01"
  );
});

test("05 - comment, no trim", () => {
  let gathered = [];
  ct("a<%# comment1 %>b<%# comment2 %>c", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  equal(
    gathered,
    [
      {
        type: "text",
        start: 0,
        end: 1,
        value: "a",
      },
      {
        type: "esp",
        start: 1,
        end: 16,
        value: "<%# comment1 %>",
        head: "<%#",
        headStartsAt: 1,
        headEndsAt: 4,
        tail: "%>",
        tailStartsAt: 14,
        tailEndsAt: 16,
      },
      {
        type: "text",
        start: 16,
        end: 17,
        value: "b",
      },
      {
        type: "esp",
        start: 17,
        end: 32,
        value: "<%# comment2 %>",
        head: "<%#",
        headStartsAt: 17,
        headEndsAt: 20,
        tail: "%>",
        tailStartsAt: 30,
        tailEndsAt: 32,
      },
      {
        type: "text",
        start: 32,
        end: 33,
        value: "c",
      },
    ],
    "05.01"
  );
});

test("06 - comment, trim", () => {
  let gathered = [];
  ct("a<%# comment1 -%>b<%# comment2 -%>c", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  equal(
    gathered,
    [
      {
        type: "text",
        start: 0,
        end: 1,
        value: "a",
      },
      {
        type: "esp",
        start: 1,
        end: 17,
        value: "<%# comment1 -%>",
        head: "<%#",
        headStartsAt: 1,
        headEndsAt: 4,
        tail: "-%>",
        tailStartsAt: 14,
        tailEndsAt: 17,
      },
      {
        type: "text",
        start: 17,
        end: 18,
        value: "b",
      },
      {
        type: "esp",
        start: 18,
        end: 34,
        value: "<%# comment2 -%>",
        head: "<%#",
        headStartsAt: 18,
        headEndsAt: 21,
        tail: "-%>",
        tailStartsAt: 31,
        tailEndsAt: 34,
      },
      {
        type: "text",
        start: 34,
        end: 35,
        value: "c",
      },
    ],
    "06.01"
  );
});

test("07 - various", () => {
  let gathered = [];
  ct("<% if @a_b -%>a<%# c-d e -%>", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  equal(
    gathered,
    [
      {
        type: "esp",
        start: 0,
        end: 14,
        value: "<% if @a_b -%>",
        head: "<%",
        headStartsAt: 0,
        headEndsAt: 2,
        tail: "-%>",
        tailStartsAt: 11,
        tailEndsAt: 14,
      },
      {
        type: "text",
        start: 14,
        end: 15,
        value: "a",
      },
      {
        type: "esp",
        start: 15,
        end: 28,
        value: "<%# c-d e -%>",
        head: "<%#",
        headStartsAt: 15,
        headEndsAt: 18,
        tail: "-%>",
        tailStartsAt: 25,
        tailEndsAt: 28,
      },
    ],
    "07.01"
  );
});

test("08", () => {
  let gathered = [];
  ct("a<% if @keys_enable -%>b", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  equal(
    gathered,
    [
      {
        type: "text",
        start: 0,
        end: 1,
        value: "a",
      },
      {
        type: "esp",
        start: 1,
        end: 23,
        value: "<% if @keys_enable -%>",
        head: "<%",
        headStartsAt: 1,
        headEndsAt: 3,
        tail: "-%>",
        tailStartsAt: 20,
        tailEndsAt: 23,
      },
      {
        type: "text",
        start: 23,
        end: 24,
        value: "b",
      },
    ],
    "08.01"
  );
});

test("09", () => {
  let gathered = [];
  ct(
    `<% if @keys_enable -%>
<%# Expression-printing tag -%>
keys <%= @keys_file %>
<% unless @keys_trusted.empty? -%>
trustedkey <%= @keys_trusted.join(' ') %>
<% end -%>`,
    {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    }
  );
  equal(
    gathered,
    [
      {
        type: "esp",
        start: 0,
        end: 22,
        value: "<% if @keys_enable -%>",
        head: "<%",
        headStartsAt: 0,
        headEndsAt: 2,
        tail: "-%>",
        tailStartsAt: 19,
        tailEndsAt: 22,
      },
      {
        type: "text",
        start: 22,
        end: 23,
        value: "\n",
      },
      {
        type: "esp",
        start: 23,
        end: 54,
        value: "<%# Expression-printing tag -%>",
        head: "<%#",
        headStartsAt: 23,
        headEndsAt: 26,
        tail: "-%>",
        tailStartsAt: 51,
        tailEndsAt: 54,
      },
      {
        type: "text",
        start: 54,
        end: 60,
        value: "\nkeys ",
      },
      {
        type: "esp",
        start: 60,
        end: 77,
        value: "<%= @keys_file %>",
        head: "<%=",
        headStartsAt: 60,
        headEndsAt: 63,
        tail: "%>",
        tailStartsAt: 75,
        tailEndsAt: 77,
      },
      {
        type: "text",
        start: 77,
        end: 78,
        value: "\n",
      },
      {
        type: "esp",
        start: 78,
        end: 112,
        value: "<% unless @keys_trusted.empty? -%>",
        head: "<%",
        headStartsAt: 78,
        headEndsAt: 80,
        tail: "-%>",
        tailStartsAt: 109,
        tailEndsAt: 112,
      },
      {
        type: "text",
        start: 112,
        end: 124,
        value: "\ntrustedkey ",
      },
      {
        type: "esp",
        start: 124,
        end: 154,
        value: "<%= @keys_trusted.join(' ') %>",
        head: "<%=",
        headStartsAt: 124,
        headEndsAt: 127,
        tail: "%>",
        tailStartsAt: 152,
        tailEndsAt: 154,
      },
      {
        type: "text",
        start: 154,
        end: 155,
        value: "\n",
      },
      {
        type: "esp",
        start: 155,
        end: 165,
        value: "<% end -%>",
        head: "<%",
        headStartsAt: 155,
        headEndsAt: 157,
        tail: "-%>",
        tailStartsAt: 162,
        tailEndsAt: 165,
      },
    ],
    "09.01"
  );
});

// ERB within HTML attributes

test("10 - two expressions as attr values", () => {
  let gathered = [];
  ct('<a href="https://abc?p1=<%= @p1 %>&p2=<%= @p2 %>">', {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  equal(
    gathered,
    [
      {
        type: "tag",
        start: 0,
        end: 50,
        value: '<a href="https://abc?p1=<%= @p1 %>&p2=<%= @p2 %>">',
        tagNameStartsAt: 1,
        tagNameEndsAt: 2,
        tagName: "a",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: false,
        kind: "inline",
        attribs: [
          {
            attribName: "href",
            attribNameRecognised: true,
            attribNameStartsAt: 3,
            attribNameEndsAt: 7,
            attribOpeningQuoteAt: 8,
            attribClosingQuoteAt: 48,
            attribValueRaw: "https://abc?p1=<%= @p1 %>&p2=<%= @p2 %>",
            attribValue: [
              {
                type: "text",
                start: 9,
                end: 24,
                value: "https://abc?p1=",
              },
              {
                type: "esp",
                start: 24,
                end: 34,
                value: "<%= @p1 %>",
                head: "<%=",
                headStartsAt: 24,
                headEndsAt: 27,
                tail: "%>",
                tailStartsAt: 32,
                tailEndsAt: 34,
              },
              {
                type: "text",
                start: 34,
                end: 38,
                value: "&p2=",
              },
              {
                type: "esp",
                start: 38,
                end: 48,
                value: "<%= @p2 %>",
                head: "<%=",
                headStartsAt: 38,
                headEndsAt: 41,
                tail: "%>",
                tailStartsAt: 46,
                tailEndsAt: 48,
              },
            ],
            attribValueStartsAt: 9,
            attribValueEndsAt: 48,
            attribStarts: 3,
            attribEnds: 49,
            attribLeft: 1,
          },
        ],
      },
    ],
    "10.01"
  );
});

test.run();
