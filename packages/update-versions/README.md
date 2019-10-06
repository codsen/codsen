# update-versions

> Like npm-check-updates but supports Lerna monorepos and enforces strict semver values

[![Minimum Node version required][node-img]][node-url]
[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

![update](https://glcdn.githack.com/codsen/codsen/raw/master/packages/update-versions/media/upd.gif)

## Table of Contents

- [Install](#install)
- [Purpose](#purpose)
- [Opinionated part 1](#opinionated-part-1)
- [Opinionated part 2](#opinionated-part-2)
- [Opinionated part 3](#opinionated-part-3)
- [Conclusion](#conclusion)
- [All Extras](#all-extras)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i -g update-versions
```

Then, call it from the command line using keyword:

```bash
upd
```

## Purpose

This is a very opinionated CLI to keep dependencies in monorepos up-to-date.

It is aimed specifically at monorepos full of npm packages (as opposed to React component monorepos and similar).

It assumed you'll always want to update all dependencies to the latest and patch any bugs right away.

This CLI will:

- Update all dependencies according to npm
- Replace `*` with `^x.x.x` automatically
- Replace all dependency version ranges without `^` to have `^`

This CLI is a good idea in Lerna monorepos full of owned npm packages (where you bump versions often and effortlessly) but a bad idea in React SPA's (where single minor update might break many things and updating dependencies is a big, complex deal).

**[⬆ back to top](#)**

## Opinionated part 1

Lerna `bootstrap` will not work properly if each dependency is not prefixed with `^`, as in `^x.y.z`. It's hard to manually enforce that all monorepo packages should have all dependencies in this format. `update-versions` will force this format.

**One exception** - if its dependency's value starts with `file:`

**[⬆ back to top](#)**

## Opinionated part 2

If any dependency is listed on both `dependencies` and `devDependencies`, it will be removed from the latter list.

## Opinionated part 3

If Lerna build goes wrong, key called `gitHead` is created in `package.json`. Lerna normally cleans it up but if things go wrong, key might be left there. This CLI removes key called `gitHead` if such exists, in every processed `package.json`.

**[⬆ back to top](#)**

## Conclusion

Because of the features mentioned above, this package is slower than alternatives, `yarn` or `npm-check-updates` or whatever.

I prefer slower but single tool instead of faster but multiple.

If you don't like something above, don't use `update-versions`.

**[⬆ back to top](#)**

## All Extras

- Any `gitHead` keys will be removed from all `package.json`. `gitHead` are bad and happen when `lerna publish` goes wrong.
- If algorithm encounters `node_modules` it won't touch that folder (or deeper inside). This guarantees all your symlinks will be intact.
- Thanks to `log-update` the log footprint is as minimal as possible, to save space
- Thanks to `update-notifier` CLI will pester you to update if newer version is released

PS. We are using `update-versions` to maintain itself — our [monorepo](https://gitlab.com/codsen/codsen/) version updates are driven by this very CLI.

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=update-versions%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aupdate-versions%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=update-versions%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aupdate-versions%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=update-versions%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aupdate-versions%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev --silent"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/update-versions.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/update-versions
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/update-versions
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/update-versions
[downloads-img]: https://img.shields.io/npm/dm/update-versions.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/update-versions
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
