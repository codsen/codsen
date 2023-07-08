<h1 align="center">seo-editor</h1>

<p align="center">Copywriting keyword to-do list automation</p>

<p align="center">
  <a href="https://codsen.com/os/seo-editor" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://www.npmjs.com/package/seo-editor" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/seo-editor" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/seo-editor?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/seo-editor.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://codsen.com/os/seo-editor/changelog" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/changelog-here-brightgreen?style=flat-square" alt="changelog">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT Licence">
</p>

## Install

This package is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).

```bash
npm i seo-editor
```

## Quick Take

```js
import { strict as assert } from "assert";

import { editor, version } from "seo-editor";

// Powers the UI of codsen.com/tools/seo-editor

// there's also a non-deterministic "log" key containing calculation statistics
const { todoLines, todoTotal, completion, chunkWordCounts } = editor(
  `
- apple
- banana
- cucumber
`,
  `
I ate a banana and a cucumber.
  `,
);
assert.deepEqual(
  { todoLines, todoTotal, completion, chunkWordCounts },
  {
    todoLines: [
      { extracted: "", counts: [], length: 0, lengthCompensation: 0 },
      { extracted: "apple", counts: [0], length: 5, lengthCompensation: 3 },
      { extracted: "banana", counts: [1], length: 6, lengthCompensation: 2 },
      {
        extracted: "cucumber",
        counts: [1],
        length: 8,
        lengthCompensation: 0,
      },
      { extracted: "", counts: [], length: 0, lengthCompensation: 0 },
    ],
    todoTotal: 3,
    completion: [2],
    chunkWordCounts: [7],
  },
);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/seo-editor/) for a full description of the API.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License.

Copyright © 2010-2023 Roy Revelt and other contributors.

<p align="center"><img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center"></p>
