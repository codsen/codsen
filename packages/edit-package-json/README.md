# edit-package-json

> Edit package.json without parsing, as string, to keep the formatting intact

<div class="package-badges">
  <a href="https://www.npmjs.com/package/edit-package-json" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/edit-package-json" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://git.sr.ht/~royston/codsen/tree/master/packages/edit-package-json" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-sourcehut-blue?style=flat-square" alt="page on sourcehut">
  </a>
  <a href="https://npmcharts.com/compare/edit-package-json?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/edit-package-json.svg?style=flat-square" alt="Downloads per month">
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

```bash
npm i edit-package-json
```

## Quick Take

```js
import { strict as assert } from "assert";
import { set, del } from "dist/edit-package-json.esm";

// edit JSON as string
assert.equal(
  set(
    `{
  "name": "test",
  "dependencies": {
    "ranges-apply": "^2.0.0",
    "string-left-right": "^2.3.30"
  },
  "devDependencies": {}
}`,
    "dependencies.ranges-apply", // path to amend
    "^3.2.2" // new value
  ),
  `{
  "name": "test",
  "dependencies": {
    "ranges-apply": "^3.2.2",
    "string-left-right": "^2.3.30"
  },
  "devDependencies": {}
}`
);

// edit from JSON string
assert.equal(
  del(
    `{
  "name": "test",
  "dependencies": {
    "ranges-apply": "^2.0.0",
    "string-left-right": "^2.3.30"
  },
  "devDependencies": {}
}`,
    "devDependencies" // path to delete
  ),
  `{
  "name": "test",
  "dependencies": {
    "ranges-apply": "^2.0.0",
    "string-left-right": "^2.3.30"
  }
}`
);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/edit-package-json/) for a full description of the API and examples.

## Licence

MIT License

Copyright (c) 2010-2020 Roy Revelt and other contributors

Passes adapted .set() unit tests from https://github.com/mariocasciaro/object-path/blob/master/test.js, MIT Licence Copyright (c) 2015 Mario Casciaro

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
