# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.9.0](https://bitbucket.org/codsen/codsen/src/master/packages/array-of-arrays-sort-by-col/compare/array-of-arrays-sort-by-col@2.4.6...array-of-arrays-sort-by-col@2.9.0) (2019-01-11)


### Features

* Add one more tag before which there will be a line break ([4f00871](https://bitbucket.org/codsen/codsen/src/master/packages/array-of-arrays-sort-by-col/commits/4f00871))





# [2.8.0](https://bitbucket.org/codsen/codsen/src/master/packages/array-of-arrays-sort-by-col/compare/array-of-arrays-sort-by-col@2.4.6...array-of-arrays-sort-by-col@2.8.0) (2019-01-08)

### Features

- Add one more tag before which there will be a line break ([4f00871](https://bitbucket.org/codsen/codsen/src/master/packages/array-of-arrays-sort-by-col/commits/4f00871))

# [2.7.0](https://bitbucket.org/codsen/codsen/src/master/packages/array-of-arrays-sort-by-col/compare/array-of-arrays-sort-by-col@2.4.6...array-of-arrays-sort-by-col@2.7.0) (2019-01-08)

### Features

- Add one more tag before which there will be a line break ([4f00871](https://bitbucket.org/codsen/codsen/src/master/packages/array-of-arrays-sort-by-col/commits/4f00871))

# [2.6.0](https://bitbucket.org/codsen/codsen/src/master/packages/array-of-arrays-sort-by-col/compare/array-of-arrays-sort-by-col@2.4.6...array-of-arrays-sort-by-col@2.6.0) (2019-01-08)

### Features

- Add one more tag before which there will be a line break ([4f00871](https://bitbucket.org/codsen/codsen/src/master/packages/array-of-arrays-sort-by-col/commits/4f00871))

## [2.4.6](https://bitbucket.org/codsen/codsen/src/master/packages/array-of-arrays-sort-by-col/compare/array-of-arrays-sort-by-col@2.4.5...array-of-arrays-sort-by-col@2.4.6) (2019-01-02)

**Note:** Version bump only for package array-of-arrays-sort-by-col

## [2.4.5](https://bitbucket.org/codsen/codsen/src/master/packages/array-of-arrays-sort-by-col/compare/array-of-arrays-sort-by-col@2.4.4...array-of-arrays-sort-by-col@2.4.5) (2019-01-01)

**Note:** Version bump only for package array-of-arrays-sort-by-col

## [2.4.4](https://bitbucket.org/codsen/codsen/src/master/packages/array-of-arrays-sort-by-col/compare/array-of-arrays-sort-by-col@2.4.3...array-of-arrays-sort-by-col@2.4.4) (2018-12-29)

**Note:** Version bump only for package array-of-arrays-sort-by-col

## [2.4.3](https://bitbucket.org/codsen/codsen/src/master/packages/array-of-arrays-sort-by-col/compare/array-of-arrays-sort-by-col@2.4.2...array-of-arrays-sort-by-col@2.4.3) (2018-12-29)

**Note:** Version bump only for package array-of-arrays-sort-by-col

## [2.4.2](https://bitbucket.org/codsen/codsen/src/master/packages/array-of-arrays-sort-by-col/compare/array-of-arrays-sort-by-col@2.4.1...array-of-arrays-sort-by-col@2.4.2) (2018-12-27)

**Note:** Version bump only for package array-of-arrays-sort-by-col

## [2.4.1](https://bitbucket.org/codsen/codsen/src/master/packages/array-of-arrays-sort-by-col/compare/array-of-arrays-sort-by-col@2.4.0...array-of-arrays-sort-by-col@2.4.1) (2018-12-27)

**Note:** Version bump only for package array-of-arrays-sort-by-col

# 2.4.0 (2018-12-26)

### Features

- cater null values too ([38fa255](https://bitbucket.org/codsen/codsen/src/master/packages/array-of-arrays-sort-by-col/commits/38fa255))
- rippling sort from arbitrary axis column ([38d850f](https://bitbucket.org/codsen/codsen/src/master/packages/array-of-arrays-sort-by-col/commits/38d850f))

## 2.3.0 (2018-12-14)

- ✨ Updated all dependencies and restored AVA linting, added licence to the top of each built file

## 2.2.0 (2018-10-12)

- ✨ Updated all dependencies and restored coverage reporting both in terminal and sending to coveralls

## 2.1.0 (2017-06-15)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis
- ✨ Removed `package-lock`

# 2.0.0 (2017-05-05)

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
