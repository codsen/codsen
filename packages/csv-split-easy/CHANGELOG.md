# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 7.2.5 (2026-09-09)

### Bug Fixes

- **csv-split-easy:** accept plain options from other realms ([e4f167b](https://github.com/codsen/codsen/commit/e4f167b638e950e7daeaab505e4302a90a678fa3))
- **csv-split-easy:** preserve quoted multiline field content ([2500899](https://github.com/codsen/codsen/commit/2500899139c6638e704527eeaf1543c08330f69a))
- **csv-split-easy:** reset record state before quoted fields ([6dab51d](https://github.com/codsen/codsen/commit/6dab51d2c196730b0276327e9a79744649e3952f))

## 7.2.4 (2026-09-06)

### Performance Improvements

- Recorded a 30.09% higher normalized benchmark score than v7.1.3 (141,101 → 183,563).

## 7.2.2 (2026-08-22)

### Performance Improvements

- optimise package hot paths and JSON editing ([f3112bd](https://github.com/codsen/codsen/commit/f3112bd7fc0d7c9bc09312d3744c950691d72ca5))

## 7.2.0 (2026-08-19)

### Bug Fixes

- make validation diagnostics safe ([7b01074](https://github.com/codsen/codsen/commit/7b0107476f12734aeb8e82852ba980b187280110))
- require a plain options object ([30d6e8a](https://github.com/codsen/codsen/commit/30d6e8a28d4cb0ca2add95b762b9e01552da10f9))
- resolve various review findings ([b60e9ee](https://github.com/codsen/codsen/commit/b60e9eeb499af94685cfb87b4970fe025be1fc10))
- retire direct publish aliases ([f98e31e](https://github.com/codsen/codsen/commit/f98e31eb89bc185471225664e610b55f34fbf648))

### Features

- add codsen-glob and migrate glob consumers ([5595a2b](https://github.com/codsen/codsen/commit/5595a2b267eaa6cb60072d037aef00b7a28edd42))
- refresh the tooling and generate with the latest dependencies ([781f802](https://github.com/codsen/codsen/commit/781f802911066a82a4533b0e5a3fcbd742d0dd83))
- support custom CSV delimiters ([b5a4e57](https://github.com/codsen/codsen/commit/b5a4e57a94f8179b69cc56b2d50fdecfedc0d908))

## 7.0.0 (2022-12-01)

### BREAKING CHANGES

- Minimum supported Node version is v14.18; we're dropping v12 support

## 6.1.0 (2022-08-12)

### Features

- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

## 6.0.20 (2022-07-26)

### Performance Improvements

- Recorded a 5.62% higher normalized benchmark score than v6.0.19 (182,858 → 193,132).

## 6.0.18 (2022-05-04)

### Performance Improvements

- Recorded a 102.77% higher normalized benchmark score than v6.0.17 (108,101 → 219,199).

## 6.0.17 (2022-04-18)

### Fixed

- tweak types ([6be1471](https://github.com/codsen/codsen/commit/6be147170191b503b074cc60732eed5147509bfb))

## 6.0.16 (2022-04-17)

### Performance Improvements

- Recorded a 22.68% higher normalized benchmark score than v6.0.15 (101,680 → 124,743).

## 6.0.15 (2022-04-11)

### Performance Improvements

- Recorded a 6.28% higher normalized benchmark score than v6.0.14 (95,669 → 101,680).

## 6.0.13 (2022-03-21)

### Performance Improvements

- Recorded a 17.58% higher normalized benchmark score than v6.0.12 (122,854 → 144,452).

## 6.0.10 (2021-12-24)

### Performance Improvements

- Recorded a 5.28% higher normalized benchmark score than v6.0.9 (153,358 → 161,454).

## 6.0.9 (2021-12-24)

### Performance Improvements

- Recorded a 47.17% higher normalized benchmark score than v6.0.8 (104,204 → 153,358).

## 6.0.7 (2021-11-30)

### Performance Improvements

- Recorded a 16.72% higher normalized benchmark score than v6.0.5 (184,478 → 215,323).

## 6.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS `require()`

## 5.1.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 5.0.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 5.0.1 (2021-01-28)

### Fixed

- add `testStats` to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 5.0.0 (2021-01-23)

### Features

- rewrite in TS, start using named exports ([c7b2268](https://github.com/codsen/codsen/commit/c7b226840e6f49464d2e1ebf3486ea4d8fd86b26))

### BREAKING CHANGES

- previously: `import splitEasy from ...` - now `import { splitEasy } from ...`

## 4.0.0 (2020-11-28)

Accidental version bump during migration to SourceHut. Sorry about that.

## 3.1.0 (2020-09-27)

### Features

- rebase, split tests into separate files and add examples ([18e0373](https://gitlab.com/codsen/codsen/commit/18e0373c01f4e2cd4af2ceaf1b4719954b054291))

## 3.0.37 (2019-10-05)

### Performance Improvements

- remove check-types-mini ([4eae010](https://gitlab.com/codsen/codsen/commit/4eae010))

## 2.6.0 (2019-01-20)

- Various documentation and setup tweaks after we migrated to monorepo
- Setup refresh: updated dependencies and all config files using automated tools

## 2.4.0 (2018-10-17)

- Updated all dependencies
- Restored unit test coverage tracking: reporting in terminal and coveralls.io
- Restored unit test linting

## 2.3.0 (2018-06-11)

GitHub sold us out. In the meantime, we:

- Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- Dropped BitHound (RIP) and Travis
- Removed `package-lock`

## 2.2.0 (2018-05-03)

- Set up [Prettier](https://prettier.io)
- Removed `package.lock` and `.editorconfig`
- Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove from production code.

## 2.1.0 (2018-03-06)

- PR \#3 from [@mac-](https://github.com/mac-) now caters double quotes wrapping double quotes, used as a means of escaping code
- 🔧 Updated dependencies. Rollup is continuously improving and build sizes are getting smaller.

## 2.0.0 (2017-11-08)

- Rewrote in ES modules, set up the Rollup
- Removes Standard and set up raw ESLint on `airbnb-base` config with semicolons off
- Additional checks on options object

## 1.3.0 (2017-08-16)

- `opts.removeThousandSeparatorsFromNumbers`. On by default. That's `string-remove-thousand-separators` ([npm](https://www.npmjs.com/package/string-remove-thousand-separators), [GitLab](https://gitlab.com/codsen/codsen/tree/master/packages/string-remove-thousand-separators)) internally doing it.
- `opts.padSingleDecimalPlaceNumbers`. On by default. `10.2` → `10.20`.
- `opts.forceUKStyle`. Off by default. `10,15` → `10.15`.

## 1.2.0 (2017-08-13)

- Now algorithm skips empty rows, where each column within the row contains only empty space.

## 1.1.0 (2017-08-13)

- Automatic trimming of all leading and trailing whitespace. Some IDE's (like Atom) add a trailing empty line at the end of a file. If you opened a CSV and saved it over, such IDE's would a trailing empty line. `csv-split-easy` automatically trims all whitespace in front and in the end of an incoming string now, so such whitespace should not be an issue now.

## 1.0.0 (2017-08-13)

- First public release
