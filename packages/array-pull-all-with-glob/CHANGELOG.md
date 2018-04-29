# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [4.3.0] - 2018-04-29

### Changed

* ✨ Set up Prettier
* ✨ Removed `package.lock` and `.editorconfig`
* ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove them during the builds.

## [4.2.0] - 2018-02-11

### Added

* ✨ `opts.caseSensitive`, directly controlling today's new released [matcher's](https://www.npmjs.com/package/matcher) same feature. Case sensitive is on by default now, but you can turn it off if you're dealing with file system stuff for example. It's best to be case-insensitive in those cases.

Also, I set up [check-types-mini](https://github.com/codsen/check-types-mini) to patrol the opts' types. Just in case consumers misbehave.

## [4.1.0] - 2018-01-21

### Added

* ✨ Shortened the error source function paths in error messages. There's no point to report the name of the main function when there's only one function. The package name will suffice.

## [4.0.0] - 2017-10-23

### Changed

* ✨ The main source now is in ES2015 modules with `import`/`export`.
* ✨ Implemented Rollup to generate 3 flavours of this package: CommonJS, UMD and ESM `module` with `import`/`export`.

## [3.1.0] - 2017-08-31

### Added

* ✨ Now generating transpiled version within `/es5/` folder, which you can require like that, `var pull = require('array-pull-all-with-glob/es5')`

## [3.0.0] - 2017-08-25

### Added

* ✨ Switched to [matcher](https://github.com/sindresorhus/matcher/) to do all the globbing.

### Removed

* 💥 Dependency on `lodash.clonedeep`
* 💥 Dependency on `lodash.replace`

### Changed

* 🔧 Made the API slightly more strict, not allowing non-string elements within arrays.

## 2.0.0 - 2017-03-02

### Changed

* 🔧 Simple thing, but, technically, a major API change. Input arguments are not mutated any more.
* 🔧 New unit tests to guarantee that.
* 🔧 Tightened the API with insurance against missing args or wrong types in the input. Now if the main input is missing, it will throw. If first argument (remove from where) is present, but second (what to remove) is missing, first arguement is returned. It's called being nice with others (libraries).

### Added

* ✨ Changelog.md

[2.0.0]: https://github.com/codsen/array-pull-all-with-glob/compare/v1.4.1...v2.0.0
[3.0.0]: https://github.com/codsen/array-pull-all-with-glob/compare/v2.0.0...v3.0.0
[3.1.0]: https://github.com/codsen/array-pull-all-with-glob/compare/v3.0.0...v3.1.0
[4.0.0]: https://github.com/codsen/array-pull-all-with-glob/compare/v3.1.0...v4.0.0
[4.1.0]: https://github.com/codsen/array-pull-all-with-glob/compare/v4.0.0...v4.1.0
[4.2.0]: https://github.com/codsen/array-pull-all-with-glob/compare/v4.1.0...v4.2.0
[4.3.0]: https://github.com/codsen/array-pull-all-with-glob/compare/v4.2.0...v4.3.0
