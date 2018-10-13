# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.4.0] - 2018-10-13

- ✨ Updated all dependencies and restored coverage tracking both via terminal when testing and through coveralls.io

## [1.3.0] - 2018-06-13

GitHub sold us out. In the meantime, we:

- ✨ Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis
- ✨ Removed `package-lock`

## [1.2.0] - 2018-05-14

### Improved

- ✨ Now pointing unit tests at ES Modules build, not CommonJS-one. This means unit test coverage will be correct (higher) because there won't be any missing rows that Babel added which are impossible to cover.
- ✨ Tweaks to ava [config](https://github.com/avajs/ava/blob/master/docs/recipes/es-modules.md) in `package.json`, properly enabling the `dev` Rollup builds.

## [1.1.0] - 2018-05-01

### Added

- ✨ Set up [Prettier](https://prettier.io)
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove them during the builds.

## 1.0.0 - 2018-03-10

### New

- First public release

[1.4.0]: https://bitbucket.org/codsen/ast-contains-only-empty-space/branches/compare/v1.4.0%0Dv1.3.3#diff
[1.3.0]: https://bitbucket.org/codsen/ast-contains-only-empty-space/branches/compare/v1.3.0%0Dv1.2.2#diff
[1.2.0]: https://bitbucket.org/codsen/ast-contains-only-empty-space/branches/compare/v1.2.0%0Dv1.1.1#diff
[1.1.0]: https://bitbucket.org/codsen/ast-contains-only-empty-space/branches/compare/v1.1.0%0Dv1.0.2#diff
