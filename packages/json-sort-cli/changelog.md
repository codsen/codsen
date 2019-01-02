# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.10.5](https://bitbucket.org/codsen/codsen/src/master/packages/json-sort-cli/compare/json-sort-cli@1.10.4...json-sort-cli@1.10.5) (2019-01-01)

**Note:** Version bump only for package json-sort-cli





## [1.10.4](https://bitbucket.org/codsen/codsen/src/master/packages/json-sort-cli/compare/json-sort-cli@1.10.3...json-sort-cli@1.10.4) (2018-12-29)

**Note:** Version bump only for package json-sort-cli





## [1.10.3](https://bitbucket.org/codsen/codsen/src/master/packages/json-sort-cli/compare/json-sort-cli@1.10.2...json-sort-cli@1.10.3) (2018-12-29)

**Note:** Version bump only for package json-sort-cli





## [1.10.2](https://bitbucket.org/codsen/codsen/src/master/packages/json-sort-cli/compare/json-sort-cli@1.10.1...json-sort-cli@1.10.2) (2018-12-27)

**Note:** Version bump only for package json-sort-cli





## [1.10.1](https://bitbucket.org/codsen/codsen/src/master/packages/json-sort-cli/compare/json-sort-cli@1.10.0...json-sort-cli@1.10.1) (2018-12-27)

**Note:** Version bump only for package json-sort-cli





# 1.10.0 (2018-12-26)


### Features

* -s (--silent) flag ([294dc8b](https://bitbucket.org/codsen/codsen/src/master/packages/json-sort-cli/commits/294dc8b))
* address single/plural cases in unsortable files ([345d3d1](https://bitbucket.org/codsen/codsen/src/master/packages/json-sort-cli/commits/345d3d1))
* exclude DS_Store and other system files by default ([02f0b31](https://bitbucket.org/codsen/codsen/src/master/packages/json-sort-cli/commits/02f0b31))
* labeling improvement ([f81653d](https://bitbucket.org/codsen/codsen/src/master/packages/json-sort-cli/commits/f81653d))
* setup improvements, unit tests and deep sort ([5dff488](https://bitbucket.org/codsen/codsen/src/master/packages/json-sort-cli/commits/5dff488))
* silent mode, more unit tests and improved reporting ([f43fcca](https://bitbucket.org/codsen/codsen/src/master/packages/json-sort-cli/commits/f43fcca))





## 1.9.0 (2018-08-19)

- 💥 Temporarily removing the `nyc` because it broke the ava builds after switching to Babel v.7
- ✨ Updated all dependencies and refreshed the readme

## 1.8.0 (2018-06-11)

- ✨ `v5` ESLint is sensitive if being called on files that don't exist. Previously we were quite liberal about the locations of unit test files. Our ESLint configs were targeting multiple locations, attempting to find some unit tests. Now this approach will cause errors so we moved all unit test files to `/test/` folder.
- ✨ Also, temporarily removing `ava` ESLint plugin because it broke on ESLin `v.5`.

## 1.7.0 (2018-06-11)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis
- ✨ Removed `package-lock`

## 1.6.0 (2018-05-29)

- ✨ Excluded `.DS_Store` and other system files by default

## 1.5.0 (2018-05-27)

- ✨ Sorts dot files too, as long as they pass the JSON parser and don't contain evil extensions like `yml`, `yaml` or `toml`.
- ✨ Restored `-s`/`--silent` mode. When it's on, only report of two lines is shown: successful and failed counts. When it's off (default), one row per sorted file output after each attempt to sort (successful or not), then the same report of two line in the end is shown.
- ✨ Unit tests for all modes: `--version`, `--help`, `-tabs`.
- ✨ Support for broken JSON files. If the file is broken and parser throws an error, that error will be reported in the report but other files won't be affected by this.

### Removed

- ✨ `-d`/`--dry` mode. It's too much hassle to maintain it, after all, the operation performed on files is not deleting anything. Dry mode is normally used for risky operations, to test first. In our case there's no risk. Files come out the same, just with sorted keys.

## 1.4.0 (2018-05-23)

### Added

- ✨ Unit tests. First time ever I pulled off completely async test files, [writen](https://github.com/sindresorhus/tempy) in some random temporary folder somewhere within the system folders. This is first the first CLI app of mine that has proper unit tests.
- ✨ Input is deeply traversed now and all plain objects no matter how deep are sorted.
- ✨ Removed Babel and whole transpiling process.
- ✨ Removed [Listr](https://www.npmjs.com/package/listr) and silent mode option. Silent mode is the only and default mode now.
- ✨ Removed `package-lock.json` and `.editorconfig`
- ✨ Set up [Prettier](https://prettier.io/)

## 1.3.0 (2018-01-30)

### Added

- ✨ `-s` or `--silent` flag. When enabled, shows only one row's output. Handy when there are many files.

## 1.2.0 (2017-12-14)

### Added

- ✨ Now if input contains only folder's name, non-JSON's are filtered-out. Basically, now this CLI is dumb-proofed, you can feed any paths and globs, containing or not containing JSON's.

## 1.1.0 (2017-12-11)

- ✨ Now serving transpiled code, aiming at Node `v.4`

## 1.0.0 (2017-10-12)

- First public release
