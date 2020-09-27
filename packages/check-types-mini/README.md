# check-types-mini

> Check the types of your options object's values after user has customised them

<div class="package-badges">
  <a href="https://www.npmjs.com/package/check-types-mini" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/check-types-mini" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-Codsen-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://gitlab.com/codsen/codsen/tree/master/packages/check-types-mini" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-GitLab-blue?style=flat-square" alt="page on GitLab">
  </a>
  <a href="https://npmcharts.com/compare/check-types-mini?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/check-types-mini.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://prettier.io" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/badge/code_style-prettier-brightgreen.svg?style=flat-square" alt="Code style: prettier">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT License">
</div>

## Install

```bash
npm i check-types-mini
```

## Quick Take

```js
import { strict as assert } from "assert";
import checkTypesMini from "check-types-mini";

assert.throws(() => {
  checkTypesMini(
    checkTypesMini(
      {
        // object to check
        option1: "setting1",
        option2: "false",
        option3: false,
      },
      {
        // reference defaults object
        option1: "setting1",
        option2: false,
        option3: false,
      }
    ),
    /not boolean but string/g
  );
});
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/check-types-mini/) for a full description of the API and examples.

## Licence

MIT License

Copyright (c) 2010-2020 Roy Revelt and other contributors

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
