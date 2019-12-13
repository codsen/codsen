# email-homey

> Generate homepage in the Browsersync root with links/screenshots to all your email templates

[![Minimum Node version required][node-img]][node-url]
[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

- [Install](#install)
- [Use it](#use-it)
- [What it does](#what-it-does)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i -g email-homey
```

Then, call it from the command line using keyword:

```bash
homey
```

## Use it

Once installed, call it in the root of your templates projects:

```bash
homey "dist"
```

## What it does

`email-homey` helps to generate a homepage with a list of all your email templates.

It will expect that all your email templates will be located within a certain folder.

Specifically, `email-homey` will scan a all subfolder names of the path you give it (like `dist` in the example above) and will go inside that folder, look for `seed.html`, copy it into `index.html` (overwriting if such file already exists) and inside that file, replace word `'magicFoldersList'` with a list of folder names (maintaining correct indentation).

This is all you need to be able to pull off a homepage driven by a [Vue.js](https://vuejs.org/). An HTML file with Vue.js script can't query your hard drive and find the subfolder names. For that we need Node. Once Vue.js _has_ the list of folder names (in an array), it can generate a table of templates.

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=email-homey%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aemail-homey%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=email-homey%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aemail-homey%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=email-homey%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aemail-homey%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev --silent"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/email-homey.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/email-homey
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/email-homey
[cov-img]: https://img.shields.io/badge/coverage-92%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/email-homey
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/email-homey
[downloads-img]: https://img.shields.io/npm/dm/email-homey.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/email-homey
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
