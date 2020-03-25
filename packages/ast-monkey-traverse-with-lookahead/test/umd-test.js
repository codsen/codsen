const t = require("tap");
const traverse1 = require("../dist/ast-monkey-traverse-with-lookahead.umd");

t.test(`"UMD build works fine"`, (t) => {
  const input = [
    {
      a: "b",
    },
    {
      c: "d",
    },
    {
      e: "f",
    },
  ];
  const gathered = [];

  traverse1(input, (key1, val1, innerObj) => {
    gathered.push([key1, val1, innerObj]);
  });
  // console.log(
  //   `- 01.01 ${`\u001b[${33}m${`gathered`}\u001b[${39}m`} = ${JSON.stringify(
  //     gathered,
  //     null,
  //     4
  //   )}`
  // );

  t.same(
    gathered,
    [
      // ===================
      [
        {
          a: "b",
        },
        null,
        {
          depth: 0,
          path: "0",
          parent: [
            {
              a: "b",
            },
            {
              c: "d",
            },
            {
              e: "f",
            },
          ],
          parentType: "array",
        },
      ],
      // ===================
      [
        "a",
        "b",
        {
          depth: 1,
          path: "0.a",
          parent: {
            a: "b",
          },
          parentType: "object",
        },
      ],
      // ===================
      [
        {
          c: "d",
        },
        null,
        {
          depth: 0,
          path: "1",
          parent: [
            {
              a: "b",
            },
            {
              c: "d",
            },
            {
              e: "f",
            },
          ],
          parentType: "array",
        },
      ],
      // ===================
      [
        "c",
        "d",
        {
          depth: 1,
          path: "1.c",
          parent: {
            c: "d",
          },
          parentType: "object",
        },
      ],
      // ===================
      [
        {
          e: "f",
        },
        null,
        {
          depth: 0,
          path: "2",
          parent: [
            {
              a: "b",
            },
            {
              c: "d",
            },
            {
              e: "f",
            },
          ],
          parentType: "array",
        },
      ],
      // ===================
      [
        "e",
        "f",
        {
          depth: 1,
          path: "2.e",
          parent: {
            e: "f",
          },
          parentType: "object",
        },
      ],
      // ===================
    ],
    "01.01"
  );
  t.end();
});
