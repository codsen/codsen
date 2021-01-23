# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 3.0.0 (2021-01-23)


### Bug Fixes

* Fix the Create New Issue URLs ([f5a41bf](https://github.com/codsen/codsen/commit/f5a41bf16fd8f43de7f8e7de68da562821ddb960))


### Features

* Add one more tag before which there will be a line break ([d178203](https://github.com/codsen/codsen/commit/d1782036b134102fd552d38d2d4f39c93195620b))
* Add perf measurement, recording and historical comparison ([a291e75](https://github.com/codsen/codsen/commit/a291e75fc9f69ae74b1d42e7a4facd32ec83f366))
* cater null values too ([38fa255](https://github.com/codsen/codsen/commit/38fa2557d669fef608ea9be7c0ece7d80ebf4fc7))
* Initial release ([8db2df9](https://github.com/codsen/codsen/commit/8db2df9fb08d66cf6c7a75a57cdcd15a5ec12c1c))
* remove all dependencies ([f8766b9](https://github.com/codsen/codsen/commit/f8766b90788d5916c1446d2b43cb34d94c2ac1b8))
* rewrite in TS, start using named exports ([cbaa3b3](https://github.com/codsen/codsen/commit/cbaa3b3ec3d86bdcabb785a4afd37bcc0aff2612))
* rippling sort from arbitrary axis column ([38d850f](https://github.com/codsen/codsen/commit/38d850f3f74d71ad69993f4a076f6584354625da))


### BREAKING CHANGES

* previously: "import sortBySubarray from ..." - now "import { sortByCol } from ..."





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
