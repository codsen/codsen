# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.0.6](https://github.com/codsen/codsen/compare/array-of-arrays-sort-by-col@3.0.5...array-of-arrays-sort-by-col@3.0.6) (2021-02-27)

**Note:** Version bump only for package array-of-arrays-sort-by-col





## 3.0.1 (2021-01-28)

### Bug Fixes

- add testStats to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 3.0.0 (2021-01-23)

### Features

- rewrite in TS, start using named exports ([cbaa3b3](https://github.com/codsen/codsen/commit/cbaa3b3ec3d86bdcabb785a4afd37bcc0aff2612))

### BREAKING CHANGES

- previously: `import sortBySubarray from ...` - now `import { sortByCol } from ...`

## 2.13.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 2.12.0 (2020-01-26)

### Features

- remove all dependencies ([1536b15](https://gitlab.com/codsen/codsen/commit/1536b15b5870727cc3de2b90de079dd027db895b))

## 2.11.0 (2019-06-29)

### Features

- Add perf measurement, recording and historical comparison ([eb6fb04](https://gitlab.com/codsen/codsen/commit/eb6fb04))

## 2.10.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 2.4.0 (2018-12-26)

### Features

- ✨ cater null values too ([38fa255](https://gitlab.com/codsen/codsen/tree/master/packages/array-of-arrays-sort-by-col/commits/38fa255))
- ✨ rippling sort from arbitrary axis column ([38d850f](https://gitlab.com/codsen/codsen/tree/master/packages/array-of-arrays-sort-by-col/commits/38d850f))

## 2.3.0 (2018-12-14)

- ✨ Updated all dependencies and restored AVA linting, added licence to the top of each built file

## 2.2.0 (2018-10-12)

- ✨ Updated all dependencies and restored coverage reporting both in terminal and sending to coveralls

## 2.1.0 (2017-06-15)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis
- ✨ Removed `package-lock`

## 2.0.0 (2017-05-05)

Complete rewrite.

- ✨ Now it's sorting by "rippling" from the chosen column (default `0`). Always, first goes value to the first value left, then, first value to the right. After that, "ripple" is expanded and the next value outside to the left is checked, then, one to the right. This is repeated until there are no values to compare both on the left and on the right.

The previous versions' unit tests will pass mainly, this "rippling" sort first of all concerns the cases where the sorting "axis" is in the middle of sub-arrays and we want the existent values to "clump" around the axis, raising to the top.

For example, the `1` should be on top of `null` if sorting "axis" is third column where `7`'s are:

```
...
    null      1       7    null    null
    null   null       7    null    null
...
```

- ✨ Plus, first time ever, I pointed unit tests at ES Modules build.
- ✨ Plus, first time ever, I turned off Babel for ES Modules build. In turn, first time ever the code coverage appears correct. No more uncovered functions that Babel added!

## 1.0.0 (2017-04-04)

- ✨ Public release
