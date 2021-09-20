# edit-package-json

> Edit package.json without parsing, as string, to keep the formatting intact

<div class="package-badges">
  <a href="https://www.npmjs.com/package/edit-package-json" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/edit-package-json" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/edit-package-json" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
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

This package is ESM only: Node 12+ is needed to use it and it must be imported instead of required:

```bash
npm i edit-package-json
```

If you need a legacy version which works with `require`, use version 0.4.0

## Quick Take

```js
import { strict as assert } from "assert";
import { set, del } from "edit-package-json";

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

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License

Copyright (c) 2010-2021 Roy Revelt and other contributors

Passes adapted .set() unit tests from https://github.com/mariocasciaro/object-path/blob/master/test.js, MIT Licence Copyright (c) 2015 Mario Casciaro

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
