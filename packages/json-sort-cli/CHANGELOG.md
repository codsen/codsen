# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.15.10](https://gitlab.com/codsen/codsen/compare/json-sort-cli@1.15.9...json-sort-cli@1.15.10) (2020-03-24)

**Note:** Version bump only for package json-sort-cli





## 1.15.3 (2019-12-09)

### Bug Fixes

- update to the latest meow api, no more short aliases ([412bdd4](https://gitlab.com/codsen/codsen/commit/412bdd432dbcc9e23a585132f8d24d2e95efa08e))

## 1.15.1 (2019-11-20)

### Bug Fixes

- update to the v4 meow api, aliases were broken until now ([5c80a05](https://gitlab.com/codsen/codsen/commit/5c80a05ad29bd0a3d489ecaaee5c9ab39db1eaaa))

## 1.15.0 (2019-11-18)

### Features

- cI mode - fixes [#21](https://gitlab.com/codsen/codsen/issues/21) - plus few more tweaks ([bc93a0f](https://gitlab.com/codsen/codsen/commit/bc93a0fd011073db2da87744b219e24983d9fa8d))

## 1.15.0 (2019-11-15)

### Features

- `-i` or `--indentationCount` — lets you choose how many indentations you want. Unless `-t` or `--tabs` is used, that many spaces will be used. Default is 1 tab or 2 spaces.
- Clarified the output for `-d` or `--dry` — we only list the filtered files. The list does not mean that filtered JSON files will be sorted or need to be sorted or anything else. This flag is used to check what files you're about to process.
- `-c` or `--ci` — fix #21 — as per [@widerin](https://gitlab.com/widerin) request, CI mode only checks all files, would their sorted versions differ from the inputs.
  If any files would be different after sorting, this CLI lists them and exits with a non-zero code.
  If all is fine, all files seem to be sorted, it doesn't write, only confirms with a message and exits with a zero code.
- `-s` or `--silent` now is truly silent — when it's enabled, nothing is output to the terminal and you can tell the outcome only by the exit code (normally, a red or green character in front of the current line in the terminal).

## 1.14.0 (2019-08-08)

### Features

- skip all package.json files if -p/--pack flag is given ([0e7d5e1](https://gitlab.com/codsen/codsen/commit/0e7d5e1)), closes [#13](https://gitlab.com/codsen/codsen/issues/13)

## 1.13.0 (2019-06-18)

### Features

- Sorts package.json keeping recommended key order ([edb7f1d](https://gitlab.com/codsen/codsen/commit/edb7f1d))

## 1.12.0 (2019-04-10)

### Features

- Allow JSON files to contain topmost element as array not just plain object ([09e066f](https://gitlab.com/codsen/codsen/commit/09e066f))
- Flag -a instructs to sort all arrays which contain only string elements ([7fb34ac](https://gitlab.com/codsen/codsen/commit/7fb34ac))

## 1.11.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 1.10.0 (2018-12-26)

- ✨ Added `-s` (`--silent`) flag ([294dc8b](https://gitlab.com/codsen/codsen/tree/master/packages/json-sort-cli/commits/294dc8b))
- ✨ Address single/plural cases in unsortable files ([345d3d1](https://gitlab.com/codsen/codsen/tree/master/packages/json-sort-cli/commits/345d3d1))
- ✨ Exclude DS_Store and other system files by default ([02f0b31](https://gitlab.com/codsen/codsen/tree/master/packages/json-sort-cli/commits/02f0b31))
- ✨ Labeling improvement ([f81653d](https://gitlab.com/codsen/codsen/tree/master/packages/json-sort-cli/commits/f81653d))
- ✨ Setup improvements, unit tests and deep sort ([5dff488](https://gitlab.com/codsen/codsen/tree/master/packages/json-sort-cli/commits/5dff488))
- ✨ Silent mode, more unit tests and improved reporting ([f43fcca](https://gitlab.com/codsen/codsen/tree/master/packages/json-sort-cli/commits/f43fcca))

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
- 💥 Removed `-d`/`--dry` mode. It's too much hassle to maintain it, after all, the operation performed on files is not deleting anything. Dry mode is normally used for risky operations, to test first. In our case there's no risk. Files come out the same, just with sorted keys.

## 1.4.0 (2018-05-23)

- ✨ Added unit tests. First time ever I pulled off completely async test files, [writen](https://github.com/sindresorhus/tempy) in some random temporary folder somewhere within the system folders. This is first the first CLI app of mine that has proper unit tests.
- ✨ Input is deeply traversed now and all plain objects no matter how deep are sorted.
- ✨ Removed Babel and whole transpiling process.
- ✨ Removed [Listr](https://www.npmjs.com/package/listr) and silent mode option. Silent mode is the only and default mode now.
- ✨ Removed `package-lock.json` and `.editorconfig`
- ✨ Set up [Prettier](https://prettier.io/)

## 1.3.0 (2018-01-30)

- ✨ Added `-s` or `--silent` flag. When enabled, shows only one row's output. Handy when there are many files.

## 1.2.0 (2017-12-14)

- ✨ Now if input contains only folder's name, non-JSON's are filtered-out. Basically, now this CLI is dumb-proofed, you can feed any paths and globs, containing or not containing JSON's.

## 1.1.0 (2017-12-11)

- ✨ Now serving transpiled code, aiming at Node `v.4`

## 1.0.0 (2017-10-12)

- ✨ First public release
