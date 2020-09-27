/* eslint import/extensions:0 */

// Quick Take

import { strict as assert } from "assert";
import traverse from "../dist/ast-monkey-traverse-with-lookahead.esm.js";

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

// callback interface:
traverse(
  input,
  (key1, val1, innerObj) => {
    gathered.push([key1, val1, innerObj]);
  },
  1 // <---------------- report one upcoming value
);

assert.deepEqual(gathered, [
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
]);
