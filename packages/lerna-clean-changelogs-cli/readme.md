# lerna-clean-changelogs-cli

> CLI application to cleanse the lerna-generated changelogs

[![Minimum Node version required][node-img]][node-url]
[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

Other siblings of this package:

- API of this package ("string-in, string-out" function): [lerna-clean-changelogs](https://www.npmjs.com/package/lerna-clean-changelogs)

## Table of Contents

- [Install](#markdown-header-install)
- [Purpose](#markdown-header-purpose)
- [Updating it](#markdown-header-updating-it)
- [Contributing](#markdown-header-contributing)
- [Licence](#markdown-header-licence)

## Install

This is a CLI application so install it globally:

```bash
npm i -g lerna-clean-changelogs-cli
```

then call it one of two ways:

```bash
$ lcc
$ lernacleanchangelog
```

PS. That dollar sign above just means it's a terminal. Never type that dollar sign!

**[⬆ back to top](#)**

## Purpose

This application will performs the following cleaning steps on all encountered `changelog.md`'s:

1. It removes bump-only changelog entries that `conventional-changelog` generates. There can be many reasons For example:

   ```
   **Note:** Version bump only for package ranges-apply
   ```

   These will be deleted along with their headings.

2. It removes diff links from headings. Change the following:

   ```
   ## [2.9.1](https://gitlab.com/codsen/codsen/tree/master/packages/ranges-apply/compare/ranges-apply@2.9.0...ranges-apply@2.9.1) (2018-12-27)
   ```

   into:

   ```
   ## 2.9.1 (2018-12-27)
   ```

   We need to do that because those links don't work on BitBucket and, generally, are _a noise_.

3. Remove `h1` headings and turn them into `h2`, with the exception of the first, main heading of the changelog.

   For exampe, change the following:

   ```
   # [2.0.0](https://gitlab.com/codsen/codsen/tree/master/packages/ranges-apply/compare/ranges-apply@2.0.0...ranges-apply@1.9.1) (2018-12-27)
   ```

   into:

   ```
   ## 2.0.0 (2018-12-27)
   ```

   (notice how a second hash character added, beside link being removed)

---

We might add more cleaning features in later releases.

**[⬆ back to top](#)**

## Updating it

When you install it globally, it will check occasionally, are there newer versions available, and if so, will show a message nagging you to update. It's the [same update notifier](https://www.npmjs.com/package/update-notifier) that AVA and [npm](https://www.npmjs.com/package/npm) themselves use!

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](https:/gitlab.com/codsen/codsen/issues/new?title=lerna-clean-changelogs-cli%20package%20-%20put%20title%20here).
- If you want a new feature but can't code it up yourself, also [raise an issue](https:/gitlab.com/codsen/codsen/issues/new?title=lerna-clean-changelogs-cli%20package%20-%20put%20title%20here). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](https:/gitlab.com/codsen/codsen/issues/new?title=lerna-clean-changelogs-cli%20package%20-%20put%20title%20here). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command line application).

The npm script "`dev`", the `"dev": "rollup -c --dev --silent"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/lerna-clean-changelogs-cli.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/lerna-clean-changelogs-cli
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/lerna-clean-changelogs-cli
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/lerna-clean-changelogs-cli
[downloads-img]: https://img.shields.io/npm/dm/lerna-clean-changelogs-cli.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/lerna-clean-changelogs-cli
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
