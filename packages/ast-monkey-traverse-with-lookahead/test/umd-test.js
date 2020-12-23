import tap from "tap";
import { traverse } from "../dist/ast-monkey-traverse-with-lookahead.umd";

tap.test(`"UMD build works fine"`, (t) => {
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

  traverse(
    input,
    (key1, val1, innerObj) => {
      gathered.push([key1, val1, innerObj]);
    },
    2 // <--- lookahead
  );

  t.strictSame(
    gathered,
    [
      // ===================
      [
        {
          a: "b",
        },
        undefined,
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
          next: [
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
            [
              {
                c: "d",
              },
              undefined,
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
          ],
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
          next: [
            [
              {
                c: "d",
              },
              undefined,
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
          ],
        },
      ],
      // ===================
      [
        {
          c: "d",
        },
        undefined,
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
          next: [
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
            [
              {
                e: "f",
              },
              undefined,
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
          ],
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
          next: [
            [
              {
                e: "f",
              },
              undefined,
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
          ],
        },
      ],
      // ===================
      [
        {
          e: "f",
        },
        undefined,
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
          next: [
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
          ],
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
          next: [],
        },
      ],
      // ===================
    ],
    "01"
  );
  t.end();
});
