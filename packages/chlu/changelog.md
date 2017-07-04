# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/) and
[keepachangelog](http://keepachangelog.com/) spec.

## [2.3.0] - 2017-07-04
### Added
- ✨ Now supports `[YANKED]`, `YANKED`, `[yanked]` and `yanked` in the titles. Exactly as per [keepachangelog](http://keepachangelog.com/) spec.
- ✨ Now supports emoji in the titles. Like this one above.

## [2.2.0] - 2017-06-29
### Added
- ✨ Avoids false positives coming from semver pattern used within regular text
- ✨ Improved date extraction what will lead to less unrecognised dates in title

## [2.1.1] - 2017-06-28
### Added
- ✨ Added n-dash, m-dash, tab, comma, full stop and non-breaking space to the list of what's being trimmed after link titles. This means, bigger variation of non-standard titles would get recognised and there will be less chance that the remainder will not get recognised by `dehumanize-date`.

## [2.0.0] - 2017-06-26
### Changed
- ✨ Merged getRepoInfo and setRepoInfo. This might prevent some bugs when both algorithms are not the same. I anticipate to improve getter/setter algorithms in the future and it's easier when both are within the same function. The only difference between getter and setter is presence of second argument - if it's not provided, it's get. If it is, it's set.
### Added
- ✨ Footer link versions within GitHub magic diff links are validated and fixed if necessary. Fixes in include wrong versions (before and/or after), missing or multiple letters `v` before version and complete rubbish within any of the parts of the footer link (like text instead of diff link's version, in the URL).
- ✨ Empty lines between footer versions are deleted.
- ✨ Added safeguards against some edge cases where footer links are broken but in a sneaky way similar to real-ones, like `[3.0.0.]: whatever`. Now they're recognised and removed (and new-ones, correct-ones are generated if needed).

## [1.3.0] - 2017-06-23
### Added
- ✨ Now GitHub magic diff links will be added for all titles except the smallest version-one.
- ✨ Chlu will remove unused footer links. For now, only the links from recognised headers are cleaned (what should cover all normal use cases compliant with keepachangelog.com).

## [1.2.0] - 2017-05-19
### Added
- ✨ If the empty row above footer links is missing, it will be added.

## [1.1.0] - 2017-05-17
### Added
- ✨ Changelog. Ha!
- ✨ Improved the algorithm of adding missing links, case when mid-range links are missing now leaves footer links in a correct order.
- ✨ More unit tests to maintain a total 100% coverage.
- ✨ Improved readme

## 1.0.0 - 2017-05-16
### New
- 🌟 First public release

[1.1.0]: https://github.com/codsen/chlu/compare/v1.0.0...v1.1.0
[1.2.0]: https://github.com/codsen/chlu/compare/v1.1.0...v1.2.0
[1.3.0]: https://github.com/codsen/chlu/compare/v1.2.0...v1.3.0
[2.0.0]: https://github.com/codsen/chlu/compare/v1.3.0...v2.0.0
[2.1.1]: https://github.com/codsen/chlu/compare/v2.0.0...v2.1.1
[2.2.0]: https://github.com/codsen/chlu/compare/v2.1.1...v2.2.0
[2.3.0]: https://github.com/codsen/chlu/compare/v2.2.1...v2.3.0
