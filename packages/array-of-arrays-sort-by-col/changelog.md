# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [2.0.0] - 2017-05-05

### Changed

Complete rewrite.

* ✨ Now it's sorting by "rippling" from the chosen column (default `0`). Always, first goes value to the first value left, then, first value to the right. After that, "ripple" is expanded and the next value outside to the left is checked, then, one to the right. This is repeated until there are no values to compare both on the left and on the right.

The previous versions' unit tests will pass mainly, this "rippling" sort first of all concerns the cases where the sorting "axis" is in the middle of sub-arrays and we want the existent values to "clump" around the axis, raising to the top.

For example, the `1` should be on top of `null` if sorting "axis" is third column where `7`'s are:

```
...
    null      1       7    null    null
    null   null       7    null    null
...
```

* ✨ Plus, first time ever, I pointed unit tests at ES Modules build.
* ✨ Plus, first time ever, I turned off Babel for ES Modules build. In turn, first time ever the code coverage appears correct. No more uncovered functions that Babel added!

## 1.0.0 - 2017-04-04

### New

* ✨ Public release

[2.0.0]: https://github.com/codsen/array-of-arrays-sort-by-col/compare/v1.0.4...v2.0.0
