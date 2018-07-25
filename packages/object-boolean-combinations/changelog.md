# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [2.3.0] - 2018-07-25

- ✨ Allow override object key values to be of any type
- ✨ Small improvements to the setup

## [2.2.0] - 2018-06-16

GitHub sold us out. In the meantime, we:

- ✨ Migrated to Bitbucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis

## [2.1.0] - 2018-05-17

### Changed

- ✨ Set up [Prettier](https://prettier.io) on a custom ESLint rules, dropped `airbnb-base`
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove from production code.
- ✨ Now unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed

## 2.0.0 - 2017-12-12

### Changed

- ✨ Rebased the source in ES Modules
- ✨ Set up Rollup and now we are generating three builds: CommonJS, UMD and ES Modules (native code).
- ✨ Small tweaks to the code, no changes to the API.

Bumping the major version just in case it breaks something. But it should not.

[2.1.0]: https://bitbucket.org/codsen/object-boolean-combinations/branches/compare/v2.1.0%0Dv2.0.5#diff
[2.2.0]: https://bitbucket.org/codsen/object-boolean-combinations/branches/compare/v2.2.0%0Dv2.1.1#diff
[2.3.0]: https://bitbucket.org/codsen/object-boolean-combinations/branches/compare/v2.3.0%0Dv2.2.1#diff
