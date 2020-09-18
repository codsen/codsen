# string-find-malformed

> Search for a malformed string. Think of Levenshtein distance but in search.

<div class="package-badges">
  <a href="https://www.npmjs.com/package/string-find-malformed" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/string-find-malformed" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-Codsen-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://gitlab.com/codsen/codsen/tree/master/packages/string-find-malformed" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-GitLab-blue?style=flat-square" alt="page on GitLab">
  </a>
  <a href="https://npmcharts.com/compare/string-find-malformed?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/string-find-malformed.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://prettier.io" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/badge/code_style-prettier-brightgreen.svg?style=flat-square" alt="Code style: prettier">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT License">
</div>

## Install

```bash
npm i string-find-malformed
```

## Quick Take

```js
import { strict as assert } from "assert";
import strFindMalformed from "string-find-malformed";

// Below, we look for dodgy cases of `<!--`
const gathered = [];
strFindMalformed(
  "<div><!-something--></div>",
  "<!--",
  // your callback function:
  (obj) => {
    gathered.push(obj);
  },
  {
    maxDistance: 1, // Levenshtein distance
  }
);
assert.deepEqual(gathered, [
  {
    idxFrom: 5,
    idxTo: 8,
  },
]);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/string-find-malformed/) for a full description of the API and examples.

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
