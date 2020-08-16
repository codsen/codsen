# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.12.9](https://gitlab.com/codsen/codsen/compare/array-of-arrays-sort-by-col@2.12.8...array-of-arrays-sort-by-col@2.12.9) (2020-08-16)

**Note:** Version bump only for package array-of-arrays-sort-by-col





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
