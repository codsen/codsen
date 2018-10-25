# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [2.7.0] - 2018-10-25

- ✨ Updated all dependencies
- ✨ Restored coveralls.io reporting
- ✨ Restored unit test linting

## [2.6.0] - 2018-08-29

- ✨ Now second argument, ranges array, can be `null`. This means, output of [ranges-push](https://www.npmjs.com/package/ranges-push) classes method`.current()` can be fed directly into this library without even checking. If it's null, original string will be returned.

## [2.5.0] - 2018-08-16

- ✨ Now we merge all input ranges using [ranges-merge](https://www.npmjs.com/package/ranges-merge) because it's necessary for algorithm and we can't rely on user to always provide merged ranges only.

## [2.4.0] - 2018-08-11

- ✨ Updated error labels
- ✨ Updated all dependencies
- ✨ Removed AVA ES linting rules and `nyc` code coverage build steps because we migrated to Babel v.7 and `nyc` breaks

## [2.3.0] - 2018-06-18

- ✨ Renamed to `ranges-apply` and migrated to Bitbucket.

## [2.2.0] - 2018-05-11

### Improved

- ✨ Set up [Prettier](https://prettier.io)
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove from production code.
- ✨ Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed

## [2.1.0] - 2018-02-13

### Added

- ✨ Now accepts a single range as well, not only array of ranges.

## [2.0.0] - 2017-11-02

### Added

- ✨ The main source now is in ES2015 modules with `import`/`export`.
- ✨ Implemented Rollup to generate 3 flavours of this package: CommonJS, UMD and ESM `module` with `import`/`export`.

## [1.4.0] - 2017-09-19

### Changed

- 🔧 Switching to ESLint on `airbnb-base` preset with semicolons-off override. JS Standard is rubbish because it's too relaxed and it's been using half-year-old ESLint. Actually it's even flagged as insecure by BitHound at the moment because of shell.js dependency two levels deep. ESLint itself is fine however.

### Removed

- Options, third input argument. It did nothing and I was expecting to add options, but now I don't want any. I removed the unused code related to options.

## [1.3.0] - 2017-08-30

### Changed

- 🔧 OK, so after replacing ES6 template strings, the `let`s stopped minification of [emailcomb](https://emailcomb.com). I came up with idea to transpile the source to `/es5/index.js`, after publishing it should be available for consumption via `require('string-replace-slices-array/es5')`. Let's see how it goes.
- 🔧 I restored all template strings as they were in `v1.1.0`.
- 🔧 Tweaked the npm scripts, so ES5 version is generated as a pre-commit step.

## [1.2.0] - 2017-08-29

### Changed

- 🔧 Guys, strange stuff. I was generating a production build of [emailcomb](https://emailcomb.com) and it refused to minify this library because of the first backtick in the ES6 template strings. So, I replaced them with ES5 code. Let's see how it will go. Geez!

## [1.1.0] - 2017-08-16

### Fixed

- 🔧 Now allowing zeros as values in ranges too. Sorry about that, the integer-checking library was not accepting zeros. Fixed now.

## 1.0.0 - 2017-07-25

### New

- ✨ First public release

[2.7.0]: https://bitbucket.org/codsen/ranges-apply/branches/compare/v2.7.0%0Dv2.6.0#diff
[2.6.0]: https://bitbucket.org/codsen/ranges-apply/branches/compare/v2.6.0%0Dv2.5.1#diff
[2.5.0]: https://bitbucket.org/codsen/ranges-apply/branches/compare/v2.5.0%0Dv2.4.1#diff
[2.4.0]: https://bitbucket.org/codsen/ranges-apply/branches/compare/v2.4.0%0Dv2.3.2#diff
[2.3.0]: https://bitbucket.org/codsen/ranges-apply/branches/compare/v2.3.0%0Dv2.2.2#diff
[2.2.0]: https://bitbucket.org/codsen/ranges-apply/branches/compare/v2.2.0%0Dv2.1.0#diff
[2.1.0]: https://bitbucket.org/codsen/ranges-apply/branches/compare/v2.1.0%0Dv2.0.14#diff
[2.0.0]: https://bitbucket.org/codsen/ranges-apply/branches/compare/v2.0.0%0Dv1.4.0#diff
[1.4.0]: https://bitbucket.org/codsen/ranges-apply/branches/compare/v1.4.0%0Dv1.3.1#diff
[1.3.0]: https://bitbucket.org/codsen/ranges-apply/branches/compare/v1.3.0%0Dv1.2.0#diff
[1.2.0]: https://bitbucket.org/codsen/ranges-apply/branches/compare/v1.2.0%0Dv1.1.0#diff
[1.1.0]: https://bitbucket.org/codsen/ranges-apply/branches/compare/v1.1.0%0Dv1.0.5#diff
