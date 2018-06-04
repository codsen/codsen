# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.6.0] - 2018-05-29

### Added

- ✨ Excluded `.DS_Store` and other system files by default

## [1.5.0] - 2018-05-27

### Added

- ✨ Sorts dot files too, as long as they pass the JSON parser and don't contain evil extensions like `yml`, `yaml` or `toml`.
- ✨ Restored `-s`/`--silent` mode. When it's on, only report of two lines is shown: successful and failed counts. When it's off (default), one row per sorted file output after each attempt to sort (successful or not), then the same report of two line in the end is shown.
- ✨ Unit tests for all modes: `--version`, `--help`, `-tabs`.
- ✨ Support for broken JSON files. If the file is broken and parser throws an error, that error will be reported in the report but other files won't be affected by this.

### Removed

- ✨ `-d`/`--dry` mode. It's too much hassle to maintain it, after all, the operation performed on files is not deleting anything. Dry mode is normally used for risky operations, to test first. In our case there's no risk. Files come out the same, just with sorted keys.

## [1.4.0] - 2018-05-23

### Added

- ✨ Unit tests. First time ever I pulled off completely async test files, [writen](https://github.com/sindresorhus/tempy) in some random temporary folder somewhere within the system folders. This is first the first CLI app of mine that has proper unit tests.
- ✨ Input is deeply traversed now and all plain objects no matter how deep are sorted.
- ✨ Removed Babel and whole transpiling process.
- ✨ Removed [Listr](https://www.npmjs.com/package/listr) and silent mode option. Silent mode is the only and default mode now.
- ✨ Removed `package-lock.json` and `.editorconfig`
- ✨ Set up [Prettier](https://prettier.io/)

## [1.3.0] - 2018-01-30

### Added

- ✨ `-s` or `--silent` flag. When enabled, shows only one row's output. Handy when there are many files.

## [1.2.0] - 2017-12-14

### Added

- ✨ Now if input contains only folder's name, non-JSON's are filtered-out. Basically, now this CLI is dumb-proofed, you can feed any paths and globs, containing or not containing JSON's.

## [1.1.0] - 2017-12-11

### New

- ✨ Now serving transpiled code, aiming at Node `v.4`

## 1.0.0 - 2017-10-12

### New

- First public release

[1.1.0]: https://github.com/codsen/json-sort-cli/compare/v1.0.0...v1.1.0
[1.2.0]: https://github.com/codsen/json-sort-cli/compare/v1.1.0...v1.2.0
[1.3.0]: https://github.com/codsen/json-sort-cli/compare/v1.2.0...v1.3.0
[1.4.0]: https://github.com/codsen/json-sort-cli/compare/v1.3.0...v1.4.0
[1.5.0]: https://github.com/codsen/json-sort-cli/compare/v1.4.0...v1.5.0
[1.6.0]: https://github.com/codsen/json-sort-cli/compare/v1.5.0...v1.6.0
