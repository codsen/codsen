# string-remove-widows

> Helps to prevent widow words in a text

<div class="package-badges">
  <a href="https://www.npmjs.com/package/string-remove-widows" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/string-remove-widows" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-Codsen-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://gitlab.com/codsen/codsen/tree/master/packages/string-remove-widows" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-GitLab-blue?style=flat-square" alt="page on GitLab">
  </a>
  <a href="https://npmcharts.com/compare/string-remove-widows?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/string-remove-widows.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://prettier.io" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/badge/code_style-prettier-brightgreen.svg?style=flat-square" alt="Code style: prettier">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT License">
</div>

## Install

```bash
npm i string-remove-widows
```

## Quick Take

```js
import { strict as assert } from "assert";
import { removeWidows } from "string-remove-widows";

const result = removeWidows("Some text with many words on one line.");

// time taken can vary so we'll set it to zero:
result.log.timeTakenInMiliseconds = 0;

assert.deepEqual(result, {
  log: {
    timeTakenInMiliseconds: 0,
  },
  ranges: [[32, 33, "&nbsp;"]], // see codsen.com/ranges/
  res: "Some text with many words on one&nbsp;line.",
  whatWasDone: {
    convertEntities: false,
    removeWidows: true,
  },
});
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/string-remove-widows/) for a full description of the API and examples.

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
