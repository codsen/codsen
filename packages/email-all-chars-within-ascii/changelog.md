# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [2.0.0] - 2017-12-05
### Added
- ✨ Rebased in ES modules
- ✨ Set up Rollup (nice ryming) to serve CommonJS, UMD and ES Module builds
- ✨ Refreshed all deps
- ✨ Edited readme a bit

Bumping major just in case somebody's API breaks. But it should not break.

## [1.3.0] - 2017-09-19
### Changed
- 🔧 Switching to raw ESLint with `airbnb-base` config with no-semicolons override. For posterity, JS Standard sucks - it's neglected by maintainers (consumes half-year-old version of ESLint), it's flagged as insecure by BitHound (because of `shell.js` two levels deep in dependencies) and doesn't have as much rules active as `airbnb` presets.

## [1.2.0] - 2017-09-04
### New
- ✨ `opts.checkLineLength` will throw is lines are more than 999 chars in length. See the [SMTP spec](https://tools.ietf.org/html/rfc821).

## [1.1.0] - 2017-08-27
### New
- ✨ `opts.messageOnly` throws only a message. Used in [CLI](https://github.com/codsen/email-all-chars-within-ascii-cli/) version of this lib.

## 1.0.0 - 2017-08-24
### New
- ✨ First public release

[2.0.0]: https://github.com/codsen/email-all-chars-within-ascii/compare/v1.3.0...v2.0.0
[1.3.0]: https://github.com/codsen/email-all-chars-within-ascii/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/codsen/email-all-chars-within-ascii/compare/v1.1.1...v1.2.0
[1.1.0]: https://github.com/codsen/email-all-chars-within-ascii/compare/v1.0.0...v1.1.0
