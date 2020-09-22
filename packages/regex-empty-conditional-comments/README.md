# regex-empty-conditional-comments

> Regular expression for matching HTML empty conditional comments

<div class="package-badges">
  <a href="https://www.npmjs.com/package/regex-empty-conditional-comments" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/regex-empty-conditional-comments" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-Codsen-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://gitlab.com/codsen/codsen/tree/master/packages/regex-empty-conditional-comments" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-GitLab-blue?style=flat-square" alt="page on GitLab">
  </a>
  <a href="https://npmcharts.com/compare/regex-empty-conditional-comments?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/regex-empty-conditional-comments.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://prettier.io" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/badge/code_style-prettier-brightgreen.svg?style=flat-square" alt="Code style: prettier">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT License">
</div>

## Install

```bash
npm i regex-empty-conditional-comments
```

## Quick Take

```js
import { strict as assert } from "assert";
import emptyCondCommentRegex from "regex-empty-conditional-comments";

// empty comment which was meant to target Outlook-only
assert.equal(
  emptyCondCommentRegex().test(`<!--[if !mso]>
<![endif]-->`),
  true
);

// empty comment which was meant to target non-Outlook-only
assert.equal(
  emptyCondCommentRegex().test(`<!--[if !mso]><!-- -->
<!--<![endif]-->`),
  true
);

assert.equal(
  emptyCondCommentRegex().test(`<!--[if !mso]><!-- -->
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<!--<![endif]-->`),
  false
);

assert.equal(
  emptyCondCommentRegex().test(`<!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]-->`),
  false
);

assert.equal(
  emptyCondCommentRegex().exec("<html><!--[if !mso]><![endif]--><title>")[0],
  "<!--[if !mso]><![endif]-->"
);

assert.deepEqual(
  `<html> <!--[if !mso]><![endif]--> <title>text</title> <!--[if gte mso 9]>
<xml>
<![endif]-->`.match(emptyCondCommentRegex()),
  ["<!--[if !mso]><![endif]-->"]
);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/regex-empty-conditional-comments/) for a full description of the API and examples.

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
