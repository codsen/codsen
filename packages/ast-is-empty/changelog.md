# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.3.0] - 2018-10-13

- ✨ Updated all dependencies and restored coverage tracking both via terminal when testing and through coveralls.io

## [1.2.0] - 2018-06-13

GitHub sold us out. In the meantime, we:

- ✨ Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis

## [1.1.0] - 2018-05-02

### Added

- ✨ Set up [Prettier](https://prettier.io)
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove from production code.

## 1.0.0 - 2018-03-11

### New

- ✨ First public release.

[1.3.0]: https://bitbucket.org/codsen/ast-is-empty/branches/compare/v1.3.0%0Dv1.2.2#diff
[1.2.0]: https://bitbucket.org/codsen/ast-is-empty/branches/compare/v1.2.0%0Dv1.1.1#diff
[1.1.0]: https://bitbucket.org/codsen/ast-is-empty/branches/compare/v1.1.0%0Dv1.0.1#diff
