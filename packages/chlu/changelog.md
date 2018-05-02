# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/) and
[Keep a Changelog](http://keepachangelog.com/) spec.

## [2.10.0] - 2018-05-03

### Updated

### Added

* ✨ Set up [Prettier](https://prettier.io)
* ✨ Removed `package.lock` and `.editorconfig`
* ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove from production code.

## [2.9.0] - 2018-03-10

### Updated

* ✨ Switched from deprecated [posthtml-ast-contains-only-empty-space](https://github.com/codsen/posthtml-ast-contains-only-empty-space) to fresh [ast-contains-only-empty-space](https://github.com/codsen/ast-contains-only-empty-space)
* ✨ Updated all dependencies
* 💥 Removing UMD build - nobody's gonna use this library in a browser

## [2.8.0] - 2018-01-23

### Added

* ✨ Test-fodder libraries' licences at the bottom of readme
* ✨ Updated all depdendencies

## [2.7.0] - 2017-12-08

### Improved

* ✨ Set up Rollup and now we generate 3 flavours: CommonJS, UMD and ES Modules. Source is now in ES Modules.

## [2.6.0] - 2017-11-27

### Changed

* ✨ Removed JS Standard and switched to raw ESLint on `airbnb-base` preset, with no-semicolons override.
* ✨ Since JS Standard is lagging on checks, I had to make some rebasing too.
* ✨ Tweaked the algorithm, specifically the part which identifies the titles (like `## [2.6.0] - 2017-11-27` above this bullet list, as opposed to the link lines in the footer). Now it's required for a title to have a `#` to be considered a title.

## [2.5.0] - 2017-07-23

### Added

* ✨ Now mixed marker dates such as `2014/04-20` are recognised. Updated unit tests accordingly. Thanks to [dehumanize-date](https://github.com/ForbesLindesay/dehumanize-date/commit/7b4a27477a2bfdb614a4eb74c7972d5eea529480) by [forbeslindsay](https://github.com/ForbesLindesay).

## [2.4.0] - 2017-07-22

### Added

* ✨ Now when date in title is unrecognised, cleaning of the title will still happen: letter "v" in front of version digits will be removed (if it exists), whatever-date will be trimmed out of usual separators like minus, dash etc and separated by a single minus-dash.
* ✨ Did I mention, new erroneous title format `## v0.3.17 / 2016-03-23` is recognised and fixed automatically? It's letter `v` and/or dash separating the version and date.
* ✨ Copyrights and licences in README mentioning real-life changelogs used in unit tests.

### Changed

* All Lodash deps are now set to `*`, _the latest_.
* Removed bunch of irrelevant lines from unit test dummy package.json's
* Updated the documentation and licence with the up-to-date author name

## [2.3.0] - 2017-07-04

### Added

* ✨ Now supports `[YANKED]`, `YANKED`, `[yanked]` and `yanked` in the titles. Exactly as per [keepachangelog](http://keepachangelog.com/) spec.

## [2.2.0] - 2017-06-29

### Added

* ✨ Avoids false positives coming from semver pattern used within regular text
* ✨ Improved date extraction what will lead to less unrecognised dates in title

## [2.1.1] - 2017-06-28

### Added

* ✨ Added n-dash, m-dash, tab, comma, full stop and non-breaking space to the list of what's being trimmed after link titles. This means, bigger variation of non-standard titles would get recognised and there will be less chance that the remainder will not get recognised by `dehumanize-date`.

## [2.0.0] - 2017-06-26

### Changed

* ✨ Merged getRepoInfo and setRepoInfo. This might prevent some bugs when both algorithms are not the same. I anticipate to improve getter/setter algorithms in the future and it's easier when both are within the same function. The only difference between getter and setter is presence of second argument - if it's not provided, it's get. If it is, it's set.

### Added

* ✨ Footer link versions within GitHub magic diff links are validated and fixed if necessary. Fixes in include wrong versions (before and/or after), missing or multiple letters `v` before version and complete rubbish within any of the parts of the footer link (like text instead of diff link's version, in the URL).
* ✨ Empty lines between footer versions are deleted.
* ✨ Added safeguards against some edge cases where footer links are broken but in a sneaky way similar to real-ones, like `[3.0.0.]: whatever`. Now they're recognised and removed (and new-ones, correct-ones are generated if needed).

## [1.3.0] - 2017-06-23

### Added

* ✨ Now GitHub magic diff links will be added for all titles except the smallest version-one.
* ✨ Chlu will remove unused footer links. For now, only the links from recognised headers are cleaned (what should cover all normal use cases compliant with keepachangelog.com).

## [1.2.0] - 2017-05-19

### Added

* ✨ If the empty row above footer links is missing, it will be added.

## [1.1.0] - 2017-05-17

### Added

* ✨ Changelog. Ha!
* ✨ Improved the algorithm of adding missing links, case when mid-range links are missing now leaves footer links in a correct order.
* ✨ More unit tests to maintain a total 100% coverage.
* ✨ Improved readme

## 1.0.0 - 2017-05-16

### New

* 🌟 First public release

[1.1.0]: https://github.com/codsen/chlu/compare/v1.0.0...v1.1.0
[1.2.0]: https://github.com/codsen/chlu/compare/v1.1.0...v1.2.0
[1.3.0]: https://github.com/codsen/chlu/compare/v1.2.0...v1.3.0
[2.0.0]: https://github.com/codsen/chlu/compare/v1.3.0...v2.0.0
[2.1.1]: https://github.com/codsen/chlu/compare/v2.0.0...v2.1.1
[2.2.0]: https://github.com/codsen/chlu/compare/v2.1.1...v2.2.0
[2.3.0]: https://github.com/codsen/chlu/compare/v2.2.1...v2.3.0
[2.4.0]: https://github.com/codsen/chlu/compare/v2.3.0...v2.4.0
[2.5.0]: https://github.com/codsen/chlu/compare/v2.4.0...v2.5.0
[2.6.0]: https://github.com/codsen/chlu/compare/v2.5.0...v2.6.0
[2.7.0]: https://github.com/codsen/chlu/compare/v2.6.0...v2.7.0
[2.8.0]: https://github.com/codsen/chlu/compare/v2.7.0...v2.8.0
[2.9.0]: https://github.com/codsen/chlu/compare/v2.8.0...v2.9.0
[2.10.0]: https://github.com/codsen/chlu/compare/v2.9.0...v2.10.0
