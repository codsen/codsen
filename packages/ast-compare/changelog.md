# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.4.0] - 2018-05-14

### Improved

* ✨ Now pointing unit tests at ES Modules build, not CommonJS-one. This means, unit test coverage will be correct (higher) because there won't be any missing rows that Babel added which are impossible to cover.
* ✨ Tweaks to ava [config](https://github.com/avajs/ava/blob/master/docs/recipes/es-modules.md) in `package.json`, properly enabling the `dev` Rollup builds.

## [1.3.0] - 2018-05-01

### Added

* ✨ Set up [Prettier](https://prettier.io)
* ✨ Removed `package.lock` and `.editorconfig`
* ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove them during the builds.

## [1.2.0] - 2018-02-11

### Added

* ✨ `opts.useWildcards` is driven by [matcher](https://github.com/sindresorhus/matcher) and `matcher` up until today was case-insensitive. Today they released the case-sensitive mode and we switched to that. Now all behaviour in wildcards should match non-glob behaviour, case-wise.

## [1.1.0] - 2017-10-29

### Added

* ✨ `opts.useWildcards` (off by default)

## 1.0.0 - 2017-10-24

### Added

* ✨ Public release

[1.1.0]: https://github.com/codsen/ast-compare/compare/v1.0.0...v1.1.0
[1.2.0]: https://github.com/codsen/ast-compare/compare/v1.1.0...v1.2.0
[1.3.0]: https://github.com/codsen/ast-compare/compare/v1.2.2...v1.3.0
[1.4.0]: https://github.com/codsen/ast-compare/compare/v1.3.0...v1.4.0
