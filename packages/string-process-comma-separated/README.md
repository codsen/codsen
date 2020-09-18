# string-process-comma-separated

> Extracts chunks from possibly comma or whatever-separated string

<div class="package-badges">
  <a href="https://www.npmjs.com/package/string-process-comma-separated" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/string-process-comma-separated" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-Codsen-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://gitlab.com/codsen/codsen/tree/master/packages/string-process-comma-separated" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-GitLab-blue?style=flat-square" alt="page on GitLab">
  </a>
  <a href="https://npmcharts.com/compare/string-process-comma-separated?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/string-process-comma-separated.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://prettier.io" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/badge/code_style-prettier-brightgreen.svg?style=flat-square" alt="Code style: prettier">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT License">
</div>

## Install

```bash
npm i string-process-comma-separated
```

## Quick Take

```js
import { strict as assert } from "assert";
import processCommaSeparated from "string-process-comma-separated";

const gatheredChunks = [];
const gatheredErrors = [];
const rawnbsp = "\u00a0";

// it's a callback-interface:
processCommaSeparated(`<FRAMESET rows=" ,,\t50% ,${rawnbsp} 50% ,\t\t,">`, {
  from: 16, // <- beginning of the attribute's value
  to: 35, // <- ending of the attribute's value
  separator: ",",
  cb: (idxFrom, idxTo) => {
    gatheredChunks.push([idxFrom, idxTo]);
  },
  errCb: (ranges, message) => {
    gatheredErrors.push({ ranges, message });
  },
});

assert.deepEqual(gatheredChunks, [
  [20, 23],
  [27, 30],
]);

assert.deepEqual(gatheredErrors, [
  { ranges: [[16, 17]], message: "Remove whitespace." },
  { ranges: [[17, 18]], message: "Remove separator." },
  { ranges: [[18, 19]], message: "Remove separator." },
  { ranges: [[19, 20]], message: "Remove whitespace." },
  { ranges: [[23, 24]], message: "Remove whitespace." },
  { ranges: [[25, 27]], message: "Remove whitespace." },
  { ranges: [[30, 31]], message: "Remove whitespace." },
  { ranges: [[32, 34]], message: "Remove whitespace." },
  { ranges: [[31, 32]], message: "Remove separator." },
  { ranges: [[34, 35]], message: "Remove separator." },
]);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/string-process-comma-separated/) for a full description of the API and examples.

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
