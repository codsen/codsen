/* eslint no-template-curly-in-string:0 */

import tap from "tap";
import ct from "../dist/codsen-tokenizer.esm";

// Responsys-like (RPL) templating languages
// https://docs.oracle.com/en/cloud/saas/marketing/responsys-like-user/Resources/RPL_Reference_Guide.pdf

const openingCurly = "\x7B";

tap.test(
  `01 - ${`\u001b[${35}m${`responsys-like`}\u001b[${39}m`} - one template tag`,
  (t) => {
    const gathered = [];
    ct("<h1>Hi ${profile.firstName}!</h1>", {
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
          end: 4,
          value: "<h1>",
          tagNameStartsAt: 1,
          tagNameEndsAt: 3,
          tagName: "h1",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [],
        },
        {
          type: "text",
          start: 4,
          end: 7,
          value: "Hi ",
        },
        {
          type: "esp",
          start: 7,
          end: 27,
          value: "${profile.firstName}",
          kind: null,
          head: "${",
          tail: "}",
        },
        {
          type: "text",
          start: 27,
          end: 28,
          value: "!",
        },
        {
          type: "tag",
          start: 28,
          end: 33,
          value: "</h1>",
          tagNameStartsAt: 30,
          tagNameEndsAt: 32,
          tagName: "h1",
          recognised: true,
          closing: true,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [],
        },
      ],
      "01.01"
    );
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${35}m${`responsys-like`}\u001b[${39}m`} - one attr, one tag`,
  (t) => {
    const gathered = [];
    ct('<a href="${latestProduct.url}">${latestProduct.name}</a>!', {
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
          end: 31,
          value: '<a href="${latestProduct.url}">',
          tagNameStartsAt: 1,
          tagNameEndsAt: 2,
          tagName: "a",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: false,
          kind: null,
          attribs: [
            {
              attribName: "href",
              attribNameRecognised: true,
              attribNameStartsAt: 3,
              attribNameEndsAt: 7,
              attribOpeningQuoteAt: 8,
              attribClosingQuoteAt: 29,
              attribValueRaw: "${latestProduct.url}",
              attribValue: [
                {
                  type: "esp",
                  start: 9,
                  end: 29,
                  value: "${latestProduct.url}",
                  kind: null,
                  head: "${",
                  tail: "}",
                },
              ],
              attribValueStartsAt: 9,
              attribValueEndsAt: 29,
              attribStart: 3,
              attribEnd: 30,
            },
          ],
        },
        {
          type: "esp",
          start: 31,
          end: 52,
          value: "${latestProduct.name}",
          kind: null,
          head: "${",
          tail: "}",
        },
        {
          type: "tag",
          start: 52,
          end: 56,
          value: "</a>",
          tagNameStartsAt: 54,
          tagNameEndsAt: 55,
          tagName: "a",
          recognised: true,
          closing: true,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [],
        },
        {
          type: "text",
          start: 56,
          end: 57,
          value: "!",
        },
      ],
      "02.01"
    );
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${35}m${`responsys-like`}\u001b[${39}m`} - if conditional minimal`,
  (t) => {
    const gathered = [];
    ct("<#if z>x</#if>", {
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
          end: 7,
          value: "<#if z>",
          kind: null,
          head: "<#",
          tail: ">",
        },
        {
          type: "text",
          start: 7,
          end: 8,
          value: "x",
        },
        {
          type: "esp",
          start: 8,
          end: 14,
          value: "</#if>",
          kind: null,
          head: "</#",
          tail: ">",
        },
      ],
      "03.01"
    );
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${35}m${`responsys-like`}\u001b[${39}m`} - if conditional, less than`,
  (t) => {
    const gathered = [];
    ct("<#if product.weight < 100>Light product</#if>", {
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
          end: 26,
          value: "<#if product.weight < 100>",
          kind: null,
          head: "<#",
          tail: ">",
        },
        {
          type: "text",
          start: 26,
          end: 39,
          value: "Light product",
        },
        {
          type: "esp",
          start: 39,
          end: 45,
          value: "</#if>",
          kind: null,
          head: "</#",
          tail: ">",
        },
      ],
      "04.01"
    );
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${35}m${`responsys-like`}\u001b[${39}m`} - if conditional, greater than`,
  (t) => {
    const gathered = [];
    ct("<#if product.weight > 100>Light product</#if>", {
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
          end: 26,
          value: "<#if product.weight > 100>",
          kind: null,
          head: "<#",
          tail: ">",
        },
        {
          type: "text",
          start: 26,
          end: 39,
          value: "Light product",
        },
        {
          type: "esp",
          start: 39,
          end: 45,
          value: "</#if>",
          kind: null,
          head: "</#",
          tail: ">",
        },
      ],
      "05.01"
    );
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${35}m${`responsys-like`}\u001b[${39}m`} - calculation inside a value`,
  (t) => {
    const gathered = [];
    ct("<td>${cargo.weight / 2 + 100}</td>", {
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
          end: 4,
          value: "<td>",
          tagNameStartsAt: 1,
          tagNameEndsAt: 3,
          tagName: "td",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [],
        },
        {
          type: "esp",
          start: 4,
          end: 29,
          value: "${cargo.weight / 2 + 100}",
          kind: null,
          head: "${",
          tail: "}",
        },
        {
          type: "tag",
          start: 29,
          end: 34,
          value: "</td>",
          tagNameStartsAt: 31,
          tagNameEndsAt: 33,
          tagName: "td",
          recognised: true,
          closing: true,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [],
        },
      ],
      "06.01"
    );
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${35}m${`responsys-like`}\u001b[${39}m`} - RPL list`,
  (t) => {
    const gathered = [];
    ct(
      `<ul>
<#list pens as stationary>
<li>$${openingCurly}stationary.name} for &pound;$${openingCurly}stationary.price}</li>
</#list>
</ul>`,
      {
        tagCb: (obj) => {
          gathered.push(obj);
        },
      }
    );
    t.match(
      gathered,
      [
        {
          type: "tag",
          start: 0,
          end: 4,
          value: "<ul>",
          tagNameStartsAt: 1,
          tagNameEndsAt: 3,
          tagName: "ul",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [],
        },
        {
          type: "text",
          start: 4,
          end: 5,
          value: "\n",
        },
        {
          type: "esp",
          start: 5,
          end: 31,
          value: "<#list pens as stationary>",
          kind: null,
          head: "<#",
          tail: ">",
        },
        {
          type: "text",
          start: 31,
          end: 32,
          value: "\n",
        },
        {
          type: "tag",
          start: 32,
          end: 36,
          value: "<li>",
          tagNameStartsAt: 33,
          tagNameEndsAt: 35,
          tagName: "li",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [],
        },
        {
          type: "esp",
          start: 36,
          end: 54,
          value: "${stationary.name}",
          kind: null,
          head: "${",
          tail: "}",
        },
        {
          type: "text",
          start: 54,
          end: 66,
          value: " for &pound;",
        },
        {
          type: "esp",
          start: 66,
          end: 85,
          value: "${stationary.price}",
          kind: null,
          head: "${",
          tail: "}",
        },
        {
          type: "tag",
          start: 85,
          end: 90,
          value: "</li>",
          tagNameStartsAt: 87,
          tagNameEndsAt: 89,
          tagName: "li",
          recognised: true,
          closing: true,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [],
        },
        {
          type: "text",
          start: 90,
          end: 91,
          value: "\n",
        },
        {
          type: "esp",
          start: 91,
          end: 99,
          value: "</#list>",
          kind: null,
          head: "</#",
          tail: ">",
        },
        {
          type: "text",
          start: 99,
          end: 100,
          value: "\n",
        },
        {
          type: "tag",
          start: 100,
          end: 105,
          value: "</ul>",
          tagNameStartsAt: 102,
          tagNameEndsAt: 104,
          tagName: "ul",
          recognised: true,
          closing: true,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [],
        },
      ],
      "07.01"
    );
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${35}m${`responsys-like`}\u001b[${39}m`} - RPL if`,
  (t) => {
    const gathered = [];
    ct(
      `<h1>
  Hi $${openingCurly}profile.user}<#if profile.user == "Leader Bob">, our CEO</#if>!
</h1>`,
      {
        tagCb: (obj) => {
          gathered.push(obj);
        },
      }
    );
    t.match(
      gathered,
      [
        {
          type: "tag",
          start: 0,
          end: 4,
          value: "<h1>",
          tagNameStartsAt: 1,
          tagNameEndsAt: 3,
          tagName: "h1",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [],
        },
        {
          type: "text",
          start: 4,
          end: 10,
          value: "\n  Hi ",
        },
        {
          type: "esp",
          start: 10,
          end: 25,
          value: "${profile.user}",
          kind: null,
          head: "${",
          tail: "}",
        },
        {
          type: "esp",
          start: 25,
          end: 59,
          value: '<#if profile.user == "Leader Bob">',
          kind: null,
          head: "<#",
          tail: ">",
        },
        {
          type: "text",
          start: 59,
          end: 68,
          value: ", our CEO",
        },
        {
          type: "esp",
          start: 68,
          end: 74,
          value: "</#if>",
          kind: null,
          head: "</#",
          tail: ">",
        },
        {
          type: "text",
          start: 74,
          end: 76,
          value: "!\n",
        },
        {
          type: "tag",
          start: 76,
          end: 81,
          value: "</h1>",
          tagNameStartsAt: 78,
          tagNameEndsAt: 80,
          tagName: "h1",
          recognised: true,
          closing: true,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [],
        },
      ],
      "08.01"
    );
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${35}m${`responsys-like`}\u001b[${39}m`} - RPL list`,
  (t) => {
    const gathered = [];
    ct(
      `We have these pencils:
<table>
  <tr><th>Brand<th>Price
  <#list pencils as pencil>
  <tr><td>&pound;$${openingCurly}pencil.name}<td>$${openingCurly}pencil.price}
  </#list>
</table>`,
      {
        tagCb: (obj) => {
          gathered.push(obj);
        },
      }
    );
    t.match(
      gathered,
      [
        {
          type: "text",
          start: 0,
          end: 23,
          value: "We have these pencils:\n",
        },
        {
          type: "tag",
          start: 23,
          end: 30,
          value: "<table>",
        },
        {
          type: "text",
          start: 30,
          end: 33,
          value: "\n  ",
        },
        {
          type: "tag",
          start: 33,
          end: 37,
          value: "<tr>",
        },
        {
          type: "tag",
          start: 37,
          end: 41,
          value: "<th>",
        },
        {
          type: "text",
          start: 41,
          end: 46,
          value: "Brand",
        },
        {
          type: "tag",
          start: 46,
          end: 50,
          value: "<th>",
        },
        {
          type: "text",
          start: 50,
          end: 58,
          value: "Price\n  ",
        },
        {
          type: "esp",
          start: 58,
          end: 83,
          value: "<#list pencils as pencil>",
          kind: null,
          head: "<#",
          tail: ">",
        },
        {
          type: "text",
          start: 83,
          end: 86,
          value: "\n  ",
        },
        {
          type: "tag",
          start: 86,
          end: 90,
          value: "<tr>",
        },
        {
          type: "tag",
          start: 90,
          end: 94,
          value: "<td>",
        },
        {
          type: "text",
          start: 94,
          end: 101,
          value: "&pound;",
        },
        {
          type: "esp",
          start: 101,
          end: 115,
          value: "${pencil.name}",
          kind: null,
          head: "${",
          tail: "}",
        },
        {
          type: "tag",
          start: 115,
          end: 119,
          value: "<td>",
        },
        {
          type: "esp",
          start: 119,
          end: 134,
          value: "${pencil.price}",
          kind: null,
          head: "${",
          tail: "}",
        },
        {
          type: "text",
          start: 134,
          end: 137,
          value: "\n  ",
        },
        {
          type: "esp",
          start: 137,
          end: 145,
          value: "</#list>",
          kind: null,
          head: "</#",
          tail: ">",
        },
        {
          type: "text",
          start: 145,
          end: 146,
          value: "\n",
        },
        {
          type: "tag",
          start: 146,
          end: 154,
          value: "</table>",
          closing: true,
        },
      ],
      "09.01"
    );
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${35}m${`responsys-like`}\u001b[${39}m`} - RPL include`,
  (t) => {
    const gathered = [];
    ct(
      `<td>
<#include "cms://path/to/footer.html">
</td>`,
      {
        tagCb: (obj) => {
          gathered.push(obj);
        },
      }
    );
    t.match(
      gathered,
      [
        {
          type: "tag",
          start: 0,
          end: 4,
          value: "<td>",
        },
        {
          type: "text",
          start: 4,
          end: 5,
          value: "\n",
        },
        {
          type: "esp",
          start: 5,
          end: 43,
          value: '<#include "cms://path/to/footer.html">',
          kind: null,
          head: "<#",
          tail: ">",
        },
        {
          type: "text",
          start: 43,
          end: 44,
          value: "\n",
        },
        {
          type: "tag",
          start: 44,
          end: 49,
          value: "</td>",
        },
      ],
      "10.01"
    );
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${35}m${`responsys-like`}\u001b[${39}m`} - RPL data`,
  (t) => {
    const gathered = [];
    ct(
      `<table>
<tr><th>Item</th><th>Totals</th></tr>
<#data orders as order>
  <#filter custid=profile.custId>
  <#fields orderId product_quantity unitPrice >
  <tr id="id$${openingCurly}order.orderId}">
  <td>$${openingCurly}order.product}</td>
  <td>$${openingCurly}order.unitPrice * order.quantity}</td>
  </tr>
</#data>
</table>`,
      {
        tagCb: (obj) => {
          gathered.push(obj);
        },
      }
    );
    t.match(
      gathered,
      [
        {
          type: "tag",
          start: 0,
          end: 7,
          value: "<table>",
        },
        {
          type: "text",
          start: 7,
          end: 8,
          value: "\n",
        },
        {
          type: "tag",
          start: 8,
          end: 12,
          value: "<tr>",
        },
        {
          type: "tag",
          start: 12,
          end: 16,
          value: "<th>",
        },
        {
          type: "text",
          start: 16,
          end: 20,
          value: "Item",
        },
        {
          type: "tag",
          start: 20,
          end: 25,
          value: "</th>",
        },
        {
          type: "tag",
          start: 25,
          end: 29,
          value: "<th>",
        },
        {
          type: "text",
          start: 29,
          end: 35,
          value: "Totals",
        },
        {
          type: "tag",
          start: 35,
          end: 40,
          value: "</th>",
        },
        {
          type: "tag",
          start: 40,
          end: 45,
          value: "</tr>",
        },
        {
          type: "text",
          start: 45,
          end: 46,
          value: "\n",
        },
        {
          type: "esp",
          start: 46,
          end: 69,
          value: "<#data orders as order>",
          kind: null,
          head: "<#",
          tail: ">",
        },
        {
          type: "text",
          start: 69,
          end: 72,
          value: "\n  ",
        },
        {
          type: "esp",
          start: 72,
          end: 103,
          value: "<#filter custid=profile.custId>",
          kind: null,
          head: "<#",
          tail: ">",
        },
        {
          type: "text",
          start: 103,
          end: 106,
          value: "\n  ",
        },
        {
          type: "esp",
          start: 106,
          end: 151,
          value: "<#fields orderId product_quantity unitPrice >",
          kind: null,
          head: "<#",
          tail: ">",
        },
        {
          type: "text",
          start: 151,
          end: 154,
          value: "\n  ",
        },
        {
          type: "tag",
          start: 154,
          end: 182,
          value: '<tr id="id${order.orderId}">',
          tagNameStartsAt: 155,
          tagNameEndsAt: 157,
          tagName: "tr",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: false,
          kind: null,
          attribs: [
            {
              attribName: "id",
              attribNameRecognised: true,
              attribNameStartsAt: 158,
              attribNameEndsAt: 160,
              attribOpeningQuoteAt: 161,
              attribClosingQuoteAt: 180,
              attribValueRaw: "id${order.orderId}",
              attribValue: [
                {
                  type: "text",
                  start: 162,
                  end: 164,
                  value: "id",
                },
                {
                  type: "esp",
                  start: 164,
                  end: 180,
                  value: "${order.orderId}",
                  kind: null,
                  head: "${",
                  tail: "}",
                },
              ],
              attribValueStartsAt: 162,
              attribValueEndsAt: 180,
              attribStart: 158,
              attribEnd: 181,
            },
          ],
        },
        {
          type: "text",
          start: 182,
          end: 185,
          value: "\n  ",
        },
        {
          type: "tag",
          start: 185,
          end: 189,
          value: "<td>",
        },
        {
          type: "esp",
          start: 189,
          end: 205,
          value: "${order.product}",
          kind: null,
          head: "${",
          tail: "}",
        },
        {
          type: "tag",
          start: 205,
          end: 210,
          value: "</td>",
        },
        {
          type: "text",
          start: 210,
          end: 213,
          value: "\n  ",
        },
        {
          type: "tag",
          start: 213,
          end: 217,
          value: "<td>",
        },
        {
          type: "esp",
          start: 217,
          end: 252,
          value: "${order.unitPrice * order.quantity}",
          kind: null,
          head: "${",
          tail: "}",
        },
        {
          type: "tag",
          start: 252,
          end: 257,
          value: "</td>",
        },
        {
          type: "text",
          start: 257,
          end: 260,
          value: "\n  ",
        },
        {
          type: "tag",
          start: 260,
          end: 265,
          value: "</tr>",
        },
        {
          type: "text",
          start: 265,
          end: 266,
          value: "\n",
        },
        {
          type: "esp",
          start: 266,
          end: 274,
          value: "</#data>",
          kind: null,
          head: "</#",
          tail: ">",
        },
        {
          type: "text",
          start: 274,
          end: 275,
          value: "\n",
        },
        {
          type: "tag",
          start: 275,
          end: 283,
          value: "</table>",
        },
      ],
      "11.01"
    );
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${35}m${`responsys-like`}\u001b[${39}m`} - multiple directives`,
  (t) => {
    const gathered = [];
    ct(
      `<p>We have these pencils:
<table border=1>
  <tr><th>Name<th>Price
  <#list pencils as pencil>
  <tr>
  <td>
  <#if pencil.size == "large"><font size="+1"></#if>
  $${openingCurly}pencil.name}
  <#if pencil.size == "large"></font></#if>
  <td>&pound;$${openingCurly}pencil.price}
  </#list>
</table>`,
      {
        tagCb: (obj) => {
          gathered.push(obj);
        },
      }
    );
    t.match(
      gathered,
      [
        {
          type: "tag",
          start: 0,
          end: 3,
          value: "<p>",
        },
        {
          type: "text",
          start: 3,
          end: 26,
          value: "We have these pencils:\n",
        },
        {
          type: "tag",
          start: 26,
          end: 42,
          value: "<table border=1>",
          attribs: [
            {
              attribName: "border",
              attribValue: [
                {
                  value: "1",
                },
              ],
            },
          ],
        },
        {
          type: "text",
          start: 42,
          end: 45,
          value: "\n  ",
        },
        {
          type: "tag",
          start: 45,
          end: 49,
          value: "<tr>",
        },
        {
          type: "tag",
          start: 49,
          end: 53,
          value: "<th>",
        },
        {
          type: "text",
          start: 53,
          end: 57,
          value: "Name",
        },
        {
          type: "tag",
          start: 57,
          end: 61,
          value: "<th>",
        },
        {
          type: "text",
          start: 61,
          end: 69,
          value: "Price\n  ",
        },
        {
          type: "esp",
          start: 69,
          end: 94,
          value: "<#list pencils as pencil>",
          kind: null,
          head: "<#",
          tail: ">",
        },
        {
          type: "text",
          start: 94,
          end: 97,
          value: "\n  ",
        },
        {
          type: "tag",
          start: 97,
          end: 101,
          value: "<tr>",
        },
        {
          type: "text",
          start: 101,
          end: 104,
          value: "\n  ",
        },
        {
          type: "tag",
          start: 104,
          end: 108,
          value: "<td>",
        },
        {
          type: "text",
          start: 108,
          end: 111,
          value: "\n  ",
        },
        {
          type: "esp",
          start: 111,
          end: 139,
          value: '<#if pencil.size == "large">',
          kind: null,
          head: "<#",
          tail: ">",
        },
        {
          type: "tag",
          start: 139,
          end: 155,
          value: '<font size="+1">',
          attribs: [
            {
              attribName: "size",
              attribValue: [
                {
                  value: "+1",
                },
              ],
            },
          ],
        },
        {
          type: "esp",
          start: 155,
          end: 161,
          value: "</#if>",
          kind: null,
          head: "</#",
          tail: ">",
        },
        {
          type: "text",
          start: 161,
          end: 164,
          value: "\n  ",
        },
        {
          type: "esp",
          start: 164,
          end: 178,
          value: "${pencil.name}",
          kind: null,
          head: "${",
          tail: "}",
        },
        {
          type: "text",
          start: 178,
          end: 181,
          value: "\n  ",
        },
        {
          type: "esp",
          start: 181,
          end: 209,
          value: '<#if pencil.size == "large">',
          kind: null,
          head: "<#",
          tail: ">",
        },
        {
          type: "tag",
          start: 209,
          end: 216,
          value: "</font>",
        },
        {
          type: "esp",
          start: 216,
          end: 222,
          value: "</#if>",
          kind: null,
          head: "</#",
          tail: ">",
        },
        {
          type: "text",
          start: 222,
          end: 225,
          value: "\n  ",
        },
        {
          type: "tag",
          start: 225,
          end: 229,
          value: "<td>",
        },
        {
          type: "text",
          start: 229,
          end: 236,
          value: "&pound;",
        },
        {
          type: "esp",
          start: 236,
          end: 251,
          value: "${pencil.price}",
          kind: null,
          head: "${",
          tail: "}",
        },
        {
          type: "text",
          start: 251,
          end: 254,
          value: "\n  ",
        },
        {
          type: "esp",
          start: 254,
          end: 262,
          value: "</#list>",
          kind: null,
          head: "</#",
          tail: ">",
        },
        {
          type: "text",
          start: 262,
          end: 263,
          value: "\n",
        },
        {
          type: "tag",
          start: 263,
          end: 271,
          value: "</table>",
        },
      ],
      "12.01"
    );
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${35}m${`responsys-like`}\u001b[${39}m`} - missing values`,
  (t) => {
    const gathered = [];
    ct('<h1>Hi ${profile.user!"Stranger"}!</h1>', {
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
          end: 4,
          value: "<h1>",
        },
        {
          type: "text",
          start: 4,
          end: 7,
          value: "Hi ",
        },
        {
          type: "esp",
          start: 7,
          end: 33,
          value: '${profile.user!"Stranger"}',
          kind: null,
          head: "${",
          tail: "}",
        },
        {
          type: "text",
          start: 33,
          end: 34,
          value: "!",
        },
        {
          type: "tag",
          start: 34,
          end: 39,
          value: "</h1>",
        },
      ],
      "13.01"
    );
    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${35}m${`responsys-like`}\u001b[${39}m`} - bracket notation`,
  (t) => {
    const gathered = [];
    ct(
      '${pencil.maker.name} - ${pencil["maker"].name} - ${pencil.maker.["name"]} - ${pencil["maker"]["name"]}',
      {
        tagCb: (obj) => {
          gathered.push(obj);
        },
      }
    );
    t.match(
      gathered,
      [
        {
          type: "esp",
          start: 0,
          end: 20,
          value: "${pencil.maker.name}",
          kind: null,
          head: "${",
          tail: "}",
        },
        {
          type: "text",
          start: 20,
          end: 23,
          value: " - ",
        },
        {
          type: "esp",
          start: 23,
          end: 46,
          value: '${pencil["maker"].name}',
          kind: null,
          head: "${",
          tail: "}",
        },
        {
          type: "text",
          start: 46,
          end: 49,
          value: " - ",
        },
        {
          type: "esp",
          start: 49,
          end: 73,
          value: '${pencil.maker.["name"]}',
          kind: null,
          head: "${",
          tail: "}",
        },
        {
          type: "text",
          start: 73,
          end: 76,
          value: " - ",
        },
        {
          type: "esp",
          start: 76,
          end: 102,
          value: '${pencil["maker"]["name"]}',
          kind: null,
          head: "${",
          tail: "}",
        },
      ],
      "14.01"
    );
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${35}m${`responsys-like`}\u001b[${39}m`} - expression in value`,
  (t) => {
    const gathered = [];
    ct('${"${name}${name}${name}${name}"}', {
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
          end: 33,
          value: '${"${name}${name}${name}${name}"}',
          kind: null,
          head: "${",
          tail: "}",
        },
      ],
      "15.01"
    );
    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${35}m${`responsys-like`}\u001b[${39}m`} - string concat`,
  (t) => {
    const gathered = [];
    ct("${user + user + user + user}", {
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
          end: 28,
          value: "${user + user + user + user}",
          kind: null,
          head: "${",
          tail: "}",
        },
      ],
      "16.01"
    );
    t.end();
  }
);

tap.test(
  `17 - ${`\u001b[${35}m${`responsys-like`}\u001b[${39}m`} - concat of sequences`,
  (t) => {
    const gathered = [];
    ct(
      `<#list ["Joe", "Moe"] + ["Anna", "Hannah"] as user>
- $${openingCurly}user}
</#list>`,
      {
        tagCb: (obj) => {
          gathered.push(obj);
        },
      }
    );
    t.match(
      gathered,
      [
        {
          type: "esp",
          start: 0,
          end: 51,
          value: '<#list ["Joe", "Moe"] + ["Anna", "Hannah"] as user>',
          kind: null,
          head: "<#",
          tail: ">",
        },
        {
          type: "text",
          start: 51,
          end: 54,
          value: "\n- ",
        },
        {
          type: "esp",
          start: 54,
          end: 61,
          value: "${user}",
          kind: null,
          head: "${",
          tail: "}",
        },
        {
          type: "text",
          start: 61,
          end: 62,
          value: "\n",
        },
        {
          type: "esp",
          start: 62,
          end: 70,
          value: "</#list>",
          kind: null,
          head: "</#",
          tail: ">",
        },
      ],
      "17.01"
    );
    t.end();
  }
);

tap.test(
  `18 - ${`\u001b[${35}m${`responsys-like`}\u001b[${39}m`} - brackets to be pretending part of opening`,
  (t) => {
    const gathered = [];
    ct("${(y/4)?int}", {
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
          end: 12,
          value: "${(y/4)?int}",
          kind: null,
          head: "${",
          tail: "}",
        },
      ],
      "18.01"
    );
    t.end();
  }
);

tap.test(
  `19 - ${`\u001b[${35}m${`responsys-like`}\u001b[${39}m`} - convert to int`,
  (t) => {
    const gathered = [];
    ct(
      "${(y/4)?int} - ${2.2?int} - ${2.999?int} - ${-2.2?int} - ${-2.999?int}",
      {
        tagCb: (obj) => {
          gathered.push(obj);
        },
      }
    );
    t.match(
      gathered,
      [
        {
          type: "esp",
          start: 0,
          end: 12,
          value: "${(y/4)?int}",
          kind: null,
          head: "${",
          tail: "}",
        },
        {
          type: "text",
          start: 12,
          end: 15,
          value: " - ",
        },
        {
          type: "esp",
          start: 15,
          end: 25,
          value: "${2.2?int}",
          kind: null,
          head: "${",
          tail: "}",
        },
        {
          type: "text",
          start: 25,
          end: 28,
          value: " - ",
        },
        {
          type: "esp",
          start: 28,
          end: 40,
          value: "${2.999?int}",
          kind: null,
          head: "${",
          tail: "}",
        },
        {
          type: "text",
          start: 40,
          end: 43,
          value: " - ",
        },
        {
          type: "esp",
          start: 43,
          end: 54,
          value: "${-2.2?int}",
          kind: null,
          head: "${-",
          tail: "}",
        },
        {
          type: "text",
          start: 54,
          end: 57,
          value: " - ",
        },
        {
          type: "esp",
          start: 57,
          end: 70,
          value: "${-2.999?int}",
          kind: null,
          head: "${-",
          tail: "}",
        },
      ],
      "19.01"
    );
    t.end();
  }
);

tap.test(
  `20 - ${`\u001b[${35}m${`responsys-like`}\u001b[${39}m`} - comparison`,
  (t) => {
    const gathered = [];
    ct(
      `<#if brand = "Mercedes">
 It is Mercedes
</#if>
<#if brand != "Mercedes">
 It is not Mercedes
</#if>`,
      {
        tagCb: (obj) => {
          gathered.push(obj);
        },
      }
    );
    t.match(
      gathered,
      [
        {
          type: "esp",
          start: 0,
          end: 24,
          value: '<#if brand = "Mercedes">',
          kind: null,
          head: "<#",
          tail: ">",
        },
        {
          type: "text",
          start: 24,
          end: 41,
          value: "\n It is Mercedes\n",
        },
        {
          type: "esp",
          start: 41,
          end: 47,
          value: "</#if>",
          kind: null,
          head: "</#",
          tail: ">",
        },
        {
          type: "text",
          start: 47,
          end: 48,
          value: "\n",
        },
        {
          type: "esp",
          start: 48,
          end: 73,
          value: '<#if brand != "Mercedes">',
          kind: null,
          head: "<#",
          tail: ">",
        },
        {
          type: "text",
          start: 73,
          end: 94,
          value: "\n It is not Mercedes\n",
        },
        {
          type: "esp",
          start: 94,
          end: 100,
          value: "</#if>",
          kind: null,
          head: "</#",
          tail: ">",
        },
      ],
      "20.01"
    );
    t.end();
  }
);

tap.test(
  `21 - ${`\u001b[${35}m${`responsys-like`}\u001b[${39}m`} - comment`,
  (t) => {
    const gathered = [];
    ct(`<#-- z -->`, {
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
          end: 10,
          value: "<#-- z -->",
          kind: null,
          head: "<#--",
          tail: "-->",
        },
      ],
      "21.01"
    );
    t.end();
  }
);

tap.test(
  `22 - ${`\u001b[${35}m${`responsys-like`}\u001b[${39}m`} - logical ops`,
  (t) => {
    const gathered = [];
    ct(
      `<#if count < 10 && color = "sports">
 We have less than 10 cars, and they are sports.
</#if>
<#if !all_red> <#-- here all_red must be a boolean -->
 Not all are red.
</#if>`,
      {
        tagCb: (obj) => {
          gathered.push(obj);
        },
      }
    );
    t.match(
      gathered,
      [
        {
          type: "esp",
          start: 0,
          end: 36,
          value: '<#if count < 10 && color = "sports">',
          kind: null,
          head: "<#",
          tail: ">",
        },
        {
          type: "text",
          start: 36,
          end: 86,
          value: "\n We have less than 10 cars, and they are sports.\n",
        },
        {
          type: "esp",
          start: 86,
          end: 92,
          value: "</#if>",
          kind: null,
          head: "</#",
          tail: ">",
        },
        {
          type: "text",
          start: 92,
          end: 93,
          value: "\n",
        },
        {
          type: "esp",
          start: 93,
          end: 107,
          value: "<#if !all_red>",
          kind: null,
          head: "<#",
          tail: ">",
        },
        {
          type: "text",
          start: 107,
          end: 108,
          value: " ",
        },
        {
          type: "esp",
          start: 108,
          end: 147,
          value: "<#-- here all_red must be a boolean -->",
          kind: null,
          head: "<#--",
          tail: "-->",
        },
        {
          type: "text",
          start: 147,
          end: 166,
          value: "\n Not all are red.\n",
        },
        {
          type: "esp",
          start: 166,
          end: 172,
          value: "</#if>",
          kind: null,
          head: "</#",
          tail: ">",
        },
      ],
      "22.01"
    );
    t.end();
  }
);

tap.test(
  `23 - ${`\u001b[${35}m${`responsys-like`}\u001b[${39}m`} - refs to a file`,
  (t) => {
    const gathered = [];
    ct("${file1?upper_case?html}${file2?upper_case?html}", {
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
          end: 24,
          value: "${file1?upper_case?html}",
          kind: null,
          head: "${",
          tail: "}",
        },
        {
          type: "esp",
          start: 24,
          end: 48,
          value: "${file2?upper_case?html}",
          kind: null,
          head: "${",
          tail: "}",
        },
      ],
      "23.01"
    );
    t.end();
  }
);

tap.test(
  `24 - ${`\u001b[${35}m${`responsys-like`}\u001b[${39}m`} - calling methods`,
  (t) => {
    const gathered = [];
    ct("${avg(3, 5)}", {
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
          end: 12,
          value: "${avg(3, 5)}",
          kind: null,
          head: "${",
          tail: "}",
        },
      ],
      "24.01"
    );
    t.end();
  }
);

tap.test(
  `25 - ${`\u001b[${35}m${`responsys-like`}\u001b[${39}m`} - missing value test operator`,
  (t) => {
    const gathered = [];
    ct(
      `<#if xml.pens.pencil??>
  Pencil found
<#else>
  Pencil not found
</#if>`,
      {
        tagCb: (obj) => {
          gathered.push(obj);
        },
      }
    );
    t.match(
      gathered,
      [
        {
          type: "esp",
          start: 0,
          end: 23,
          value: "<#if xml.pens.pencil??>",
          kind: null,
          head: "<#",
          tail: ">",
        },
        {
          type: "text",
          start: 23,
          end: 39,
          value: "\n  Pencil found\n",
        },
        {
          type: "esp",
          start: 39,
          end: 46,
          value: "<#else>",
          kind: null,
          head: "<#",
          tail: ">",
        },
        {
          type: "text",
          start: 46,
          end: 66,
          value: "\n  Pencil not found\n",
        },
        {
          type: "esp",
          start: 66,
          end: 72,
          value: "</#if>",
          kind: null,
          head: "</#",
          tail: ">",
        },
      ],
      "25.01"
    );
    t.end();
  }
);
