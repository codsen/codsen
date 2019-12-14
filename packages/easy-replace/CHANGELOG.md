# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.7.52](https://gitlab.com/codsen/codsen/compare/easy-replace@3.7.51...easy-replace@3.7.52) (2019-12-14)

**Note:** Version bump only for package easy-replace





## 3.9.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 3.3.0 (2018-10-17)

- ✨ Updated all dependencies
- ✨ Restored unit test coverage tracking: reporting in terminal and coveralls.io
- ✨ Restored unit test linting

## 3.2.0 (2018-06-11)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis
- ✨ Removed `package-lock`

## 3.1.0 (2018-05-17)

- ✨ Set up [Prettier](https://prettier.io) on custom ESLint rules
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove from production code.
- ✨ Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed

## 3.0.0 (2017-12-09)

### Added

- ✨ Rebased in ES Modules
- ✨ Set up the Rollup (nice rhyme). Now serving three builds: CommonJS, UMD and ES Module. all wired-up to separate package.json keys. This way, Rollup and WebPack can tap ES Modules instead of CommonJS. This also solves problems with transpiling. CommonJS is transpiled, ES Modules are not. No more problems with `create-react-app` not being able to uglify the source in ES6.

API didn't change, it actually became even more flexible. `main`, `module` and `browser` keys in `package.json` lead to different build flavours.

## 2.12.0 (2017-09-15)

### Removed

- Removed JS Standard and moved onto ESLint with tweaked AirBnB preset with semicolons off. Blimey, so many issues were reported by ESLint that JS Standard missed!

## 2.11.0 (2017-09-09)

### Added

- Prevented defaults object's mutation. Don't know if it affects the final result anyhow, (looking from unit tests, it does not).

## 2.10.0 (2017-07-08)

Fresh morning and fresh head yields new improvements.

### Added

- Improved the main search algorithm to better account for edge cases where there are missing inputs.

## 2.9.0 (2017-07-07)

### Added

- Case insensitive searches/replacement/deletion. Set `opts.i` plain object's keys to `true`.
- Swapped all `foreach` loops with old `for`'s, that should make this library tiny bit faster.
- Added `continue`'s and `break`'s, so loops should terminate earlier, at the first moment when algorithm detects first false match. This should, in theory, relieve us from redundant calculations when the outcome is already decided. In other words, this library _should_ run faster.
- Bunch of new tests to maintain 100% code coverage.

## 2.8.0 (2017-07-05)

### Added

- ✨ Changelog. Ha!
- Tapped `check-types-mini` to enforce the input types better.

## 2.7.0 (2017-02-17)

### Changed

- Various minor updates including BitHound config.

## 2.6.0 (2017-02-17)

### Changed

- Code refresh: updated some info and all deps.

## 2.5.0 (2016-12-23)

### Added

- JS Standard precommit hook and unit test coverage.

## 2.4.0 (2016-11-16)

### Changed

- Now tapping Lodash functions one-by-one.

## 2.0.0 (2016-09-20)

### Changed

- Complete rewrite.

## 1.0.0 (2016-08-25)

- 🌟 First public release
