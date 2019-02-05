# html-table-patcher

> Wraps any content between TR/TD tags in additional rows/columns to appear in browser correctly

[![Minimum Node version required][node-img]][node-url]
[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

- [Install](#install)
- [Idea](#idea)
- [features](#features)
- [upcoming features](#upcoming-features)
- [API](#api)
- [The algorithm](#the-algorithm)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i html-table-patcher
```

```js
const patcher = require("html-table-patcher");

var res1 = patcher(`<table width="100%">
  zzz
  <tr>
    <td>
      something
    </td>
  </tr>
</table>`);
console.log("res1 = " + res1);
// res1 = <table width="100%"><tr><td>zzz</td></tr><tr>
//     <td>
//       something
//     </td>
//   </tr>
// </table>
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                             | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | -------------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/html-table-patcher.cjs.js` | 7 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/html-table-patcher.esm.js` | 8 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/html-table-patcher.umd.js` | 38 KB |

**[⬆ back to top](#)**

## Idea

Very often, templating languages (or PHP or Email Service Providers' back-end code) is inserted in-between the HTML table tags: between `table` and `tr`, between `tr` and `td` and so on. If you open such HTML in a browser, that inserted code will appear at wrong places because the browser will try to patch it up (but will do it incorrectly).

This library patches the HTML, so the browser in the correct places renders that code between the table cells.

The patched code is not meant for production by any means - it's for visual display in a browser only!

This library takes string and outputs string, so it's not an _end tool_, it's rather an API for a feature in other tools and browser plugins.

**[⬆ back to top](#)**

## features

- non-parsing - accepts any HTML, broken, mixed programming languages — anything
- wraps the code between TABLE and TR tags or between two TR tags with TR+TD

## upcoming features

- colspan/rowspan detection
- automatic whitespace detection
- ignoring HTML comments between tags

## API

String-in, string-out.

## The algorithm

This library does not use any parser. It traverses the input string, makes notes where relevant tags start and end, count the `<td>`'s per-row and wraps any code between `<table>` and `<tr>` with new rows with a correct `colspan` value. That's why we can aim to support any programming or templating languages embedded within the input HTML.

It should work on any ESP code (from MailChimp to Cheetah to Salesforce Marketing Cloud) or back-end programming language (from Jinja to Nunjucks to Java JSP's).

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](https:/gitlab.com/codsen/codsen/issues/new?issue[title]=html-table-patcher%20package%20-%20put%20title%20here&issue[description]=%23%23%20html-table-patcher%0A%0Aput%20description%20here).
- If you want a new feature but can't code it up yourself, also [raise an issue](https:/gitlab.com/codsen/codsen/issues/new?issue[title]=html-table-patcher%20package%20-%20put%20title%20here&issue[description]=%23%23%20html-table-patcher%0A%0Aput%20description%20here). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](https:/gitlab.com/codsen/codsen/issues/new?issue[title]=html-table-patcher%20package%20-%20put%20title%20here&issue[description]=%23%23%20html-table-patcher%0A%0Aput%20description%20here). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command line application).

The npm script "`dev`", the `"dev": "rollup -c --dev --silent"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/html-table-patcher.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/html-table-patcher
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/html-table-patcher
[cov-img]: https://img.shields.io/badge/coverage-90.29%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/html-table-patcher
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/html-table-patcher
[downloads-img]: https://img.shields.io/npm/dm/html-table-patcher.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/html-table-patcher
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/html-table-patcher
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
