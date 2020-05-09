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
          tail: "}$",
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
                  tail: "}$",
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
          tail: "}$",
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
    t.match(gathered, [], "06.01");
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
    t.match(gathered, [], "07.01");
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
    t.match(gathered, [], "08.01");
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
  <tr><td>$${openingCurly}pencil.name}<td>$${openingCurly}pencil.price} Euros
  </#list>
</table>`,
      {
        tagCb: (obj) => {
          gathered.push(obj);
        },
      }
    );
    t.match(gathered, [], "09.01");
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
    t.match(gathered, [], "10.01");
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
    t.match(gathered, [], "11.01");
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
    t.match(gathered, [], "12.01");
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
    t.match(gathered, [], "13.01");
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
    t.match(gathered, [], "14.01");
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
    t.match(gathered, [], "15.01");
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
    t.match(gathered, [], "16.01");
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
    t.match(gathered, [], "17.01");
    t.end();
  }
);

tap.test(
  `18 - ${`\u001b[${35}m${`responsys-like`}\u001b[${39}m`} - convert to int`,
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
    t.match(gathered, [], "18.01");
    t.end();
  }
);

tap.test(
  `19 - ${`\u001b[${35}m${`responsys-like`}\u001b[${39}m`} - comparison`,
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
    t.match(gathered, [], "19.01");
    t.end();
  }
);

tap.test(
  `20 - ${`\u001b[${35}m${`responsys-like`}\u001b[${39}m`} - logical ops`,
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
    t.match(gathered, [], "20.01");
    t.end();
  }
);

tap.test(
  `21 - ${`\u001b[${35}m${`responsys-like`}\u001b[${39}m`} - refs to a file`,
  (t) => {
    const gathered = [];
    ct("${file?upper_case?html}", {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.match(gathered, [], "21.01");
    t.end();
  }
);

tap.test(
  `22 - ${`\u001b[${35}m${`responsys-like`}\u001b[${39}m`} - calling methods`,
  (t) => {
    const gathered = [];
    ct("${avg(3, 5)}", {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.match(gathered, [], "22.01");
    t.end();
  }
);

tap.test(
  `23 - ${`\u001b[${35}m${`responsys-like`}\u001b[${39}m`} - missing value test operator`,
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
    t.match(gathered, [], "23.01");
    t.end();
  }
);
