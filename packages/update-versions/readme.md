# update-versions

> Like npm-check-updates but supports Lerna monorepos and enforces strict semver values

[![Minimum Node version required][node-img]][node-url]
[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

- [Install](#install)
- [The Problem](#the-problem)
- [The Solution](#the-solution)
- [Extras](#extras)
- [Ingredients](#ingredients)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

`npm i -g update-versions`, then call it typing:

`upd`

This is a CLI (command line) application, that's why you install it with `-g` flag.
Alternatively, you can also run it without installing, using `npx update-versions`:

`npx update-versions`

**[⬆ back to top](#)**

## The Problem

[`npm-check-updates`](https://www.npmjs.com/package/npm-check-updates) is great, except:

- It does not work on _Lerna monorepos_, that is, you can't call it from the root of your monorepo and update all packages. But `update-versions` can do that.
- It will not enforce `^x.y.z` semver notation, whatever flag you give. `update-versions` can do that too.

`update-versions` works both on normal packages with `node_modules` folder and single `package.json` as well as monorepos where there is `package.json` in the root and many packages deeper in a subfolder(s).

**[⬆ back to top](#)**

## The Solution

If it's called within a root of Lerna monorepo, it will detect all package locations, smartly ping all dependencies (both normal and `devDependencies`) using npm's [`pacote`](https://www.npmjs.com/package/pacote) and update the versions in package.json.

By _smartly_ we mean:

- Operations are all asynchronous
- npm is called once per unique dependency, results are cached. The more the same dependencies, the faster it will run.
- No updates — no `package.json` overwrite.
- It's automated and doesn't even need to read your lerna config to find all packages
- Algorithm skips all folders at or within `node_modules`

**[⬆ back to top](#)**

## Extras

- Each `package.json` is [sorted](https://www.npmjs.com/package/format-package) considering classic `package.json` key order (dependencies at the bottom etc.)
- Any `gitHead` keys will be removed from all `package.json`. `gitHead` are bad and happen when `lerna publish` goes wrong.
- If algorithm encounters `node_modules` it won't touch that folder (or deeper inside). This guarantees all your symlinks will be intact.
- Thanks to `log-update` the log footprint is as minimal as possible, to save space
- Thanks to `update-notifier` CLI will pester you to update if newer version is released
- Rumors are speading `update-versions` should work on Windows too

PS. We are using `update-versions` to maintain itself — our [monorepo](https://bitbucket.org/codsen/codsen/src/master/) version updates are driven by this very CLI and it is part of the [monorepo](https://bitbucket.org/codsen/codsen/src/master/).

**[⬆ back to top](#)**

## Ingredients

Only the finest dependencies are used:

| Dependency                                                                   | Purpose                                                                                                                                           |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`format-package`](https://www.npmjs.com/package/format-package)             | Puts all keys in package.json in good order                                                                                                       |
| [`fs-extra`](https://www.npmjs.com/package/fs-extra)                         | We want it for `fs` ops but with promises                                                                                                         |
| [`globby`](https://www.npmjs.com/package/globby)                             | Globbing utility from Mr. Sorhus                                                                                                                  |
| [`lodash.isplainobject`](https://www.npmjs.com/package/lodash.isplainobject) | To surely identify plain objects                                                                                                                  |
| [`log-symbols`](https://www.npmjs.com/package/log-symbols)                   | Success icon. From Mr. Sorhus.                                                                                                                    |
| [`log-update`](https://www.npmjs.com/package/log-update)                     | Allows to overwrite current line in terminal. From Mr. Sorhus too.                                                                                |
| [`meow`](https://www.npmjs.com/package/meow)                                 | CLI helper from Mr. Sorhus                                                                                                                        |
| [`pacote`](https://www.npmjs.com/package/pacote)                             | npm own's app - pings npm, fetches latest version                                                                                                 |
| [`update-notifier`](https://www.npmjs.com/package/update-notifier)           | Pesters users if CLI is not up-to-date. npm use it too.                                                                                           |
| [`write-json-file`](https://www.npmjs.com/package/write-json-file)           | Atomically writes JSON. [Prevents](<https://en.wikipedia.org/wiki/Atomicity_(database_systems)>) broken files if/when write operation goes wrong. |

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](https:/gitlab.com/codsen/codsen/issues/new?issue[title]=update-versions%20package%20-%20put%20title%20here&issue[description]=%23%23%20update-versions%0A%0Aput%20description%20here).
- If you want a new feature but can't code it up yourself, also [raise an issue](https:/gitlab.com/codsen/codsen/issues/new?issue[title]=update-versions%20package%20-%20put%20title%20here&issue[description]=%23%23%20update-versions%0A%0Aput%20description%20here). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](https:/gitlab.com/codsen/codsen/issues/new?issue[title]=update-versions%20package%20-%20put%20title%20here&issue[description]=%23%23%20update-versions%0A%0Aput%20description%20here). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command line application).

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
