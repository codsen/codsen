<h1 align="center">rehype-responsive-tables</h1>

<p align="center">Rehype plugin to stack the first column cells above their rows.</p>

<p align="center">
  <a href="https://codsen.com/os/rehype-responsive-tables" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://www.npmjs.com/package/rehype-responsive-tables" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/rehype-responsive-tables" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/rehype-responsive-tables?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/rehype-responsive-tables.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://codsen.com/os/rehype-responsive-tables/changelog" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/changelog-here-brightgreen?style=flat-square" alt="changelog">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT Licence">
  <a href="https://codsen.com/os/rehype-responsive-tables/play"><img src="https://img.shields.io/badge/playground-here-brightgreen?style=flat-square" alt="playground"></a>
</p>

## Install

This package is not pure ESM, you can `require` it.

```bash
npm i rehype-responsive-tables
```

## Quick Take

```js
import { strict as assert } from "assert";
import { rehype } from "rehype";
import rehypeFormat from "rehype-format";
import rehypeResponsiveTables from "rehype-responsive-tables";

let input = `
<table>
  <tbody>
    <tr>
      <td>a</td>
      <td>b</td>
      <td>c</td>
    </tr>
  </tbody>
</table>
`;

let intended = `
<table class="rrt-table">
  <tbody>
    <tr class="rrt-new-tr">
      <td class="rrt-del-td"></td>
      <td colspan="2"><span class="rrt-new-tr__span-top">a</span></td>
    </tr>
    <tr>
      <td class="rrt-del-td">a</td>
      <td>b</td>
      <td>c</td>
    </tr>
  </tbody>
</table>
`;

assert.equal(
  rehype()
    .data("settings", { fragment: true })
    .use(rehypeResponsiveTables, {
      tableClassName: "rrt-table",
    })
    .use(rehypeFormat)
    .processSync(input)
    .toString(),
  intended,
);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/rehype-responsive-tables/) for a full description of the API. Also, try the [GUI playground](https://codsen.com/os/rehype-responsive-tables/play).

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License.

Copyright © 2010-2023 Roy Revelt and other contributors.

<p align="center"><img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center"></p>
