import tap from "tap";
import ct from "../dist/codsen-tokenizer.esm";

// head css styles
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${36}m${`basics`}\u001b[${39}m`} - root level css declarations`,
  (t) => {
    const gathered = [];
    ct(
      `<head>
<style type="text/css">
.unused1[z] {a:1;}
.used[z] {a:2;}
</style>
</head>
<body class="  used  "><a class="used unused3">z</a>
</body>`,
      {
        tagCb: (obj) => {
          if (obj.type === "rule") {
            gathered.push(obj);
          }
        },
      }
    );

    t.same(
      gathered,
      [
        {
          type: "rule",
          start: 31,
          end: 49,
          left: 29,
          value: ".unused1[z] {a:1;}",
          openingCurlyAt: 43,
          closingCurlyAt: 48,
          selectorsStart: 31,
          selectorsEnd: 42,
          selectors: [
            {
              value: ".unused1[z]",
              selectorStarts: 31,
              selectorEnds: 42,
            },
          ],
        },
        {
          type: "rule",
          start: 50,
          end: 65,
          left: 48,
          value: ".used[z] {a:2;}",
          openingCurlyAt: 59,
          closingCurlyAt: 64,
          selectorsStart: 50,
          selectorsEnd: 58,
          selectors: [
            {
              value: ".used[z]",
              selectorStarts: 50,
              selectorEnds: 58,
            },
          ],
        },
      ],
      "01"
    );
    t.end();
  }
);

tap.test(`02 - ${`\u001b[${36}m${`basics`}\u001b[${39}m`} - @media`, (t) => {
  const gathered = [];
  ct(
    `<head>
<style type="text/css">
@namespace url(z);
@media (max-width: 600px) {
  .xx[z] {a:1;}
}
</style>
</head>
<body  class="  zz  "><a   class="yy zz">z</a>
</body>`,
    {
      tagCb: (obj) => {
        if (obj.type === "rule") {
          gathered.push(obj);
        }
      },
    }
  );

  t.same(
    gathered,
    [
      {
        type: "rule",
        start: 80,
        end: 93,
        value: ".xx[z] {a:1;}",
        left: 76,
        openingCurlyAt: 87,
        closingCurlyAt: 92,
        selectorsStart: 80,
        selectorsEnd: 86,
        selectors: [
          {
            value: ".xx[z]",
            selectorStarts: 80,
            selectorEnds: 86,
          },
        ],
      },
    ],
    "02"
  );
  t.end();
});
