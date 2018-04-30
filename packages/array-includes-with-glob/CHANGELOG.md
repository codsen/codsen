# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [2.2.0] - 2018-04-29

### Changed

* ✨ Set up Prettier
* ✨ Removed `package.lock` and `.editorconfig`
* ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove them during the builds.

## [2.1.0] - 2018-02-11

### Changed

* ✨ Up until now the [matcher.js](https://github.com/sindresorhus/matcher) which was driving the wildcard matching was not-case sensitive. Today they released case-sensitive option and we are setting it on. This will ensure the consistency in matching results.

## [2.0.0] - 2017-12-08

### Changed

* ✨ Removed JS Standard and switched to raw ESLint with `airbnb-base` config. That's because ESLint is always up-to-date (unlike JS Standard which might consume half-year-old ESLint like it does now) and also because `airbnb-*` configs have more rules active. I overrode the setting for semicolons, of course.

Bumping major just in case it breaks somebody's API. But I don't think it will.

## [1.5.0] - 2017-07-23

### Changed

* ✨ Removed `object-assign` from deps, switched to native `Object.assign`
* ✨ Set all dev deps except Standard to be latest (`*`) to save time updating them

### Updated

* All deps

## [1.4.0] - 2017-04-23 Sunday evening

### Changed

* ✨ There are some finshy things happening with string wildcard libraries. Namely, [wildcard](https://www.npmjs.com/package/wildcard) and [wildstring](https://www.npmjs.com/package/wildstring). I was using `wildstring` until I in another of my libraries discovered that it does not support leading wildcards, that is when asterisk is the first character! WTF!!! Same case with `wildcard` too. Proof's [here](https://runkit.com/58fd11151dc1c60013c79f85/58fd132d15bef7001293f41a) and there are other [issues](https://github.com/DamonOehlman/wildcard/issues/9) with its API as well!!!
  SOLUTION: switched to Sindre Sorhus' [matcher](https://www.npmjs.com/package/matcher). Small amendments (order of arguments) and one find-and-replace on the method `isMatch`. Problem solved!

## [1.3.0] - 2017-04-23

### Added

* ✨ You can provide an array (second argument) of strings to check, is ANY of them found in the source (first argument).
* ✨ Alternatively, you can set the matching to request that ALL elements from second argument array must be found in the source array (first argument).

## [1.2.0] - 2017-04-22

### Added

* ✨ Now the input can be not only array, but string as well. It will be converted into an array first and then processed.

## 1.0.0 - 2017-04-22

### New

* ✨ First public release

[1.2.0]: https://github.com/codsen/array-includes-with-glob/compare/v1.0.0...v1.2.0
[1.3.0]: https://github.com/codsen/array-includes-with-glob/compare/v1.2.0...v1.3.0
[1.4.0]: https://github.com/codsen/array-includes-with-glob/compare/v1.3.0...v1.4.0
[1.5.0]: https://github.com/codsen/array-includes-with-glob/compare/v1.4.0...v1.5.0
[2.0.0]: https://github.com/codsen/array-includes-with-glob/compare/v1.5.4...v2.0.0
[2.1.0]: https://github.com/codsen/array-includes-with-glob/compare/v2.0.7...v2.1.0
[2.2.0]: https://github.com/codsen/array-includes-with-glob/compare/v2.1.0...v2.2.0
