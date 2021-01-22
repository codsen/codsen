# tap-parse-string-to-object

> Parses raw Tap: string-to-object or stream-to-a-promise-of-an-object

<div class="package-badges">
  <a href="https://www.npmjs.com/package/tap-parse-string-to-object" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/tap-parse-string-to-object" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/tap-parse-string-to-object" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/tap-parse-string-to-object?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/tap-parse-string-to-object.svg?style=flat-square" alt="Downloads per month">
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
npm i tap-parse-string-to-object
```

## Quick Take

```js
import { strict as assert } from "assert";
import { parseTap } from "tap-parse-string-to-object";

// synchronous parsing (there's also async, see in examples)
assert.deepEqual(
  parseTap(`TAP version 13
ok 1 - test/test.js # time=22.582ms { # Subtest: 01.01 - string input
ok 1 - 01.01.01
ok 2 - 01.01.02
1..2
ok 1 - 01.01 - string input # time=7.697ms

 # Subtest: 01.02 - non-string input
ok 1 - 01.02.01
ok 2 - 01.02.02
ok 3 - 01.02.03
ok 4 - 01.02.04
ok 5 - 01.02.05
1..5
ok 2 - 01.02 - non-string input # time=2.791ms

 1..2 # time=22.582ms
}

ok 2 - test/umd-test.js # time=16.522ms { # Subtest: UMD build works fine
ok 1 - should be equivalent
1..1
ok 1 - UMD build works fine # time=10.033ms

 1..1 # time=16.522ms
}

1..2

# time=1816.082ms
`),
  {
    ok: true,
    assertsTotal: 8,
    assertsPassed: 8,
    assertsFailed: 0,
    suitesTotal: 2,
    suitesPassed: 2,
    suitesFailed: 0,
  }
);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/tap-parse-string-to-object/) for a full description of the API and examples.

## Licence

MIT License

Copyright (c) 2010-2021 Roy Revelt and other contributors


<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">

