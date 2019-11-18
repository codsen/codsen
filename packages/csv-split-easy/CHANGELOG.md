# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.0.41](https://gitlab.com/codsen/codsen/compare/csv-split-easy@3.0.40...csv-split-easy@3.0.41) (2019-11-18)

**Note:** Version bump only for package csv-split-easy





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
