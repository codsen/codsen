# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [6.0.7](https://github.com/codsen/codsen/compare/easy-replace@6.0.6...easy-replace@6.0.7) (2023-09-11)

**Note:** Version bump only for package easy-replace

## 6.0.0 (2022-12-01)

### BREAKING CHANGES

- Minimum supported Node version is v14.18; we're dropping v12 support

## 5.1.0 (2022-08-12)

### Features

- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

## 5.0.16 (2022-04-23)

### Fixed

- tweak types ([b854d68](https://github.com/codsen/codsen/commit/b854d68477f239bf15a85343aa769ff9a54e2183))

## 5.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS `require()`

## 4.1.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 4.0.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 4.0.1 (2021-01-28)

### Fixed

- add `testStats` to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 4.0.0 (2021-01-23)

### Features

- rewrite in TS, start using named exports ([a6516a3](https://github.com/codsen/codsen/commit/a6516a3f0cf4e20eefbdd68f3233b6c775d94738))

### BREAKING CHANGES

- previously you'd consume like: `import er from ...` - now: `import { er } from ...`

## 3.9.0 (2020-11-28)

Accidental version bump during migration to SourceHut. Sorry about that.

## 3.8.0 (2020-09-27)

### Features

- add examples and sort the coverage ([c826fae](https://gitlab.com/codsen/codsen/commit/c826faed665614dc5b0716bdf1dbfa07e0b81170))

## 3.9.0 (2019-01-20)

- Various documentation and setup tweaks after we migrated to monorepo
- Setup refresh: updated dependencies and all config files using automated tools

## 3.3.0 (2018-10-17)

- Updated all dependencies
- Restored unit test coverage tracking: reporting in terminal and coveralls.io
- Restored unit test linting

## 3.2.0 (2018-06-11)

GitHub sold us out. In the meantime, we:

- Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- Dropped BitHound (RIP) and Travis
- Removed `package-lock`

## 3.1.0 (2018-05-17)

- Set up [Prettier](https://prettier.io) on custom ESLint rules
- Removed `package.lock` and `.editorconfig`
- Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove from production code.
- Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed

## 3.0.0 (2017-12-09)

### Features

- Rebased in ES Modules
- Set up the Rollup (nice rhyme). Now serving three builds: CommonJS, UMD and ES Module. all wired-up to separate package.json keys. This way, Rollup and WebPack can tap ES Modules instead of CommonJS. This also solves problems with transpiling. CommonJS is transpiled, ES Modules are not. No more problems with `create-react-app` not being able to uglify the source in ES6.

API didn't change, it actually became even more flexible. `main`, `module` and `browser` keys in `package.json` lead to different build flavours.

## 2.12.0 (2017-09-15)

### Fixed

- Removed JS Standard and moved onto ESLint with tweaked AirBnB preset with semicolons off. Blimey, so many issues were reported by ESLint that JS Standard missed!

## 2.11.0 (2017-09-09)

### Features

- Prevented defaults object's mutation. Don't know if it affects the final result anyhow, (looking from unit tests, it does not).

## 2.10.0 (2017-07-08)

Fresh morning and fresh head yields new improvements.

### Features

- Improved the main search algorithm to better account for edge cases where there are missing inputs.

## 2.9.0 (2017-07-07)

### Features

- Case insensitive searches/replacement/deletion. Set `opts.i` plain object's keys to `true`.
- Swapped all `foreach` loops with old `for`'s, that should make this library tiny bit faster.
- Added `continue`'s and `break`'s, so loops should terminate earlier, at the first moment when algorithm detects first false match. This should, in theory, relieve us from redundant calculations when the outcome is already decided. In other words, this library _should_ run faster.
- Bunch of new tests to maintain 100% code coverage.

## 2.8.0 (2017-07-05)

### Features

- Changelog. Ha!
- Tapped `check-types-mini` to enforce the input types better.

## 2.7.0 (2017-02-17)

### Changes

- Various minor updates including BitHound config.

## 2.6.0 (2017-02-17)

### Changes

- Code refresh: updated some info and all deps.

## 2.5.0 (2016-12-23)

### Features

- JS Standard precommit hook and unit test coverage.

## 2.4.0 (2016-11-16)

### Changes

- Now tapping Lodash functions one-by-one.

## 2.0.0 (2016-09-20)

### Changes

- Complete rewrite.

## 1.0.0 (2016-08-25)

- 🌟 First public release
