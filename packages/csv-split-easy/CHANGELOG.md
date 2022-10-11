# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 6.1.0 (2022-08-12)

### Features

- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

## 6.0.17 (2022-04-18)

### Bug Fixes

- tweak types ([6be1471](https://github.com/codsen/codsen/commit/6be147170191b503b074cc60732eed5147509bfb))

## 6.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS require()

## 5.1.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 5.0.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 5.0.1 (2021-01-28)

### Bug Fixes

- add testStats to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 5.0.0 (2021-01-23)

### Features

- rewrite in TS, start using named exports ([c7b2268](https://github.com/codsen/codsen/commit/c7b226840e6f49464d2e1ebf3486ea4d8fd86b26))

### BREAKING CHANGES

- previously: `import splitEasy from ...` - now `import { splitEasy } from ...`

## 4.0.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 3.1.0 (2020-09-27)

### Features

- rebase, split tests into separate files and add examples ([18e0373](https://gitlab.com/codsen/codsen/commit/18e0373c01f4e2cd4af2ceaf1b4719954b054291))

## 3.0.37 (2019-10-05)

### Performance Improvements

- remove check-types-mini ([4eae010](https://gitlab.com/codsen/codsen/commit/4eae010))

## 2.6.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 2.4.0 (2018-10-17)

- ✨ Updated all dependencies
- ✨ Restored unit test coverage tracking: reporting in terminal and coveralls.io
- ✨ Restored unit test linting

## 2.3.0 (2018-06-11)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis
- ✨ Removed `package-lock`

## 2.2.0 (2018-05-03)

- ✨ Set up [Prettier](https://prettier.io)
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove from production code.

## 2.1.0 (2018-03-06)

- ✨ PR \#3 from [@mac-](https://github.com/mac-) now caters double quotes wrapping double quotes, used as a means of escaping code
- 🔧 Updated dependencies. Rollup is continuously improving and build sizes are getting smaller.

## 2.0.0 (2017-11-08)

- ✨ Rewrote in ES modules, set up the Rollup
- ✨ Removes Standard and set up raw ESLint on `airbnb-base` config with semicolons off
- ✨ Additional checks on options object

## 1.3.0 (2017-08-16)

- ✨ `opts.removeThousandSeparatorsFromNumbers`. On by default. That's `string-remove-thousand-separators` ([npm](https://www.npmjs.com/package/string-remove-thousand-separators), [GitLab](https://gitlab.com/codsen/codsen/tree/master/packages/string-remove-thousand-separators)) internally doing it.
- ✨ `opts.padSingleDecimalPlaceNumbers`. On by default. `10.2` → `10.20`.
- ✨ `opts.forceUKStyle`. Off by default. `10,15` → `10.15`.

## 1.2.0 (2017-08-13)

- ✨ Now algorithm skips empty rows, where each column within the row contains only empty space.

## 1.1.0 (2017-08-13)

- ✨ Automatic trimming of all leading and trailing whitespace. Some IDE's (like Atom) add a trailing empty line at the end of a file. If you opened a CSV and saved it over, such IDE's would a trailing empty line. `csv-split-easy` automatically trims all whitespace in front and in the end of an incoming string now, so such whitespace should not be an issue now.

## 1.0.0 (2017-08-13)

- ✨ First public release
