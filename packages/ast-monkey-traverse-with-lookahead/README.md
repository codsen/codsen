# ast-monkey-traverse-with-lookahead

> Utility library to traverse AST, reports upcoming values

<div class="package-badges">
  <a href="https://www.npmjs.com/package/ast-monkey-traverse-with-lookahead" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/ast-monkey-traverse-with-lookahead" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/ast-monkey-traverse-with-lookahead" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/ast-monkey-traverse-with-lookahead?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/ast-monkey-traverse-with-lookahead.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://prettier.io" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/badge/code_style-prettier-brightgreen.svg?style=flat-square" alt="Code style: prettier">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT License">
  <a href="https://liberamanifesto.com" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/badge/libera-manifesto-lightgrey.svg?style=flat-square" alt="libera manifesto">
  </a>
</div>

## Install

The latest version is **ESM only**: Node 12+ is needed to use it and it must be `import`ed instead of `require`d. If your project is not on ESM yet and you want to use `require`, use an older version of this program, `2.1.0`.

```bash
npm i ast-monkey-traverse-with-lookahead
```

## Quick Take

```js
import { strict as assert } from "assert";

import { traverse } from "ast-monkey-traverse-with-lookahead";

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
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/ast-monkey-traverse-with-lookahead/) for a full description of the API.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License

Copyright (c) 2010-2022 Roy Revelt and other contributors

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
