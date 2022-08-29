# seo-editor

> Markdown editor which automates the keyword counting

<div class="package-badges">
  <a href="https://www.npmjs.com/package/seo-editor" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/seo-editor" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/seo-editor" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/seo-editor?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/seo-editor.svg?style=flat-square" alt="Downloads per month">
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

This package is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).

```bash
npm i seo-editor
```

## Quick Take

```js
import { strict as assert } from "assert";

import { editor, version } from "seo-editor";

// Powers the UI of codsen.com/tools/seo-editor

// there's also "log" which reports time spent which is not deterministic
const { result, todoTotal, completion, chunkWordCounts } = editor(
  `
- apple
- banana
- cucumber
`,
  `
I ate a banana and a cucumber.
  `
);
assert.deepEqual(
  { result, todoTotal, completion, chunkWordCounts },
  {
    result: [
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
  }
);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/seo-editor/) for a full description of the API.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License

Copyright (c) 2010-2022 Roy Revelt and other contributors

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
