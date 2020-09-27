# string-fix-broken-named-entities

> Finds and fixes common and not so common broken named HTML entities, returns ranges array of fixes

<div class="package-badges">
  <a href="https://www.npmjs.com/package/string-fix-broken-named-entities" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/string-fix-broken-named-entities" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-Codsen-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://gitlab.com/codsen/codsen/tree/master/packages/string-fix-broken-named-entities" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-GitLab-blue?style=flat-square" alt="page on GitLab">
  </a>
  <a href="https://npmcharts.com/compare/string-fix-broken-named-entities?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/string-fix-broken-named-entities.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://prettier.io" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/badge/code_style-prettier-brightgreen.svg?style=flat-square" alt="Code style: prettier">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT License">
</div>

## Install

```bash
npm i string-fix-broken-named-entities
```

## Quick Take

```js
import { strict as assert } from "assert";
import fixEnt from "string-fix-broken-named-entities";
import applyR from "ranges-apply";

const source = "&nsp;x&nsp;y&nsp;";

// returns Ranges notation, see codsen.com/ranges/
assert.deepEqual(fixEnt(source), [
  [0, 5, "&nbsp;"],
  [6, 11, "&nbsp;"],
  [12, 17, "&nbsp;"],
]);

// render result from ranges using "ranges-apply":
assert.equal(applyR(source, fixEnt(source)), "&nbsp;x&nbsp;y&nbsp;");
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/string-fix-broken-named-entities/) for a full description of the API and examples.

## Licence

MIT License

Copyright (c) 2010-2020 Roy Revelt and other contributors

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
