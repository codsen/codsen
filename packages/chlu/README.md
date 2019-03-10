# Chlu

> CH-ange-L-og U-pdate - Automatically fix errors in your changelog file

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
- [What it does](#what-it-does)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```sh
npm i chlu
```

Here's what you'll get:

| Type                                                                                               | Key in `package.json` | Path               | Size  |
| -------------------------------------------------------------------------------------------------- | --------------------- | ------------------ | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`     | `main`                | `dist/chlu.cjs.js` | 19 KB |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`. | `module`              | `dist/chlu.esm.js` | 19 KB |

**[⬆ back to top](#)**

## What it does

`chlu` stands for CHangeLog Update. This library is the API for [`chlu-cli`](https://bitbucket.org/codsen/chlu-cli) which you should install with a `-g` flag. You probably should check it [instead](https://bitbucket.org/codsen/chlu-cli).

Diff links are useful for new starters in programming — they allow to see how the particular feature was implemented and _learn_.
Diff links are useful for regular consumers of npm libraries — they give more reassurance that the library is really maintained and provide a glimpse about its quality.

When I saw the diff links for the first time in somebody's CHANGELOG, I told myself, I must get one too. However, diff links are a pain to maintain, hence this library. Make sure you install [chlu-cli](https://bitbucket.org/codsen/chlu-cli) though. This one is just an API for it.

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](https://gitlab.com/codsen/codsen/issues/new?issue[title]=chlu%20package%20-%20put%20title%20here&issue[description]=%23%23%20chlu%0A%0Aput%20description%20here).
- If you want a new feature but can't code it up yourself, also [raise an issue](https://gitlab.com/codsen/codsen/issues/new?issue[title]=chlu%20package%20-%20put%20title%20here&issue[description]=%23%23%20chlu%0A%0Aput%20description%20here). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](https://gitlab.com/codsen/codsen/issues/new?issue[title]=chlu%20package%20-%20put%20title%20here&issue[description]=%23%23%20chlu%0A%0Aput%20description%20here). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command line application).

The npm script "`dev`", the `"dev": "rollup -c --dev --silent"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

Unit test #13 - uses changelog of **giu 0.13.4** to test automated error fixing, released under MIT License (MIT) Copyright © 2016-2018 Guillermo Grau Panea
Unit test #14 - uses changelog of **keystone 4.0.0-beta.5** to test automated error fixing, released under MIT License (MIT) Copyright © 2016 Jed Watson

[node-img]: https://img.shields.io/node/v/chlu.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/chlu
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/chlu
[cov-img]: https://img.shields.io/badge/coverage-87.6%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/chlu
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/chlu
[downloads-img]: https://img.shields.io/npm/dm/chlu.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/chlu
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/chlu
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
