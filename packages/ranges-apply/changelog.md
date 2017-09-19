# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

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

[1.4.0]: https://github.com/codsen/string-replace-slices-array/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/codsen/string-replace-slices-array/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/codsen/string-replace-slices-array/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/codsen/string-replace-slices-array/compare/v1.0.0...v1.1.0
