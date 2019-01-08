# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.9.0](https://bitbucket.org/codsen/codsen/src/master/packages/ranges-merge/compare/ranges-merge@3.8.6...ranges-merge@3.9.0) (2019-01-08)

### Features

- Add one more tag before which there will be a line break ([4f00871](https://bitbucket.org/codsen/codsen/src/master/packages/ranges-merge/commits/4f00871))

## [3.8.6](https://bitbucket.org/codsen/codsen/src/master/packages/ranges-merge/compare/ranges-merge@3.8.5...ranges-merge@3.8.6) (2019-01-02)

**Note:** Version bump only for package ranges-merge

## [3.8.5](https://bitbucket.org/codsen/codsen/src/master/packages/ranges-merge/compare/ranges-merge@3.8.4...ranges-merge@3.8.5) (2019-01-01)

**Note:** Version bump only for package ranges-merge

## [3.8.4](https://bitbucket.org/codsen/codsen/src/master/packages/ranges-merge/compare/ranges-merge@3.8.3...ranges-merge@3.8.4) (2018-12-29)

**Note:** Version bump only for package ranges-merge

## [3.8.3](https://bitbucket.org/codsen/codsen/src/master/packages/ranges-merge/compare/ranges-merge@3.8.2...ranges-merge@3.8.3) (2018-12-29)

**Note:** Version bump only for package ranges-merge

## [3.8.2](https://bitbucket.org/codsen/codsen/src/master/packages/ranges-merge/compare/ranges-merge@3.8.1...ranges-merge@3.8.2) (2018-12-27)

**Note:** Version bump only for package ranges-merge

## [3.8.1](https://bitbucket.org/codsen/codsen/src/master/packages/ranges-merge/compare/ranges-merge@3.8.0...ranges-merge@3.8.1) (2018-12-27)

**Note:** Version bump only for package ranges-merge

# 3.8.0 (2018-12-26)

### Features

- improvements against input argument mutation ([924c7ae](https://bitbucket.org/codsen/codsen/src/master/packages/ranges-merge/commits/924c7ae))
- removes ranges with no third arg with identical start and end points ([707553b](https://bitbucket.org/codsen/codsen/src/master/packages/ranges-merge/commits/707553b))

## 3.7.0 (2018-11-29)

- ✨ Second input argument - `progressFn` is added, it will report percentage done so far. It's used in worker setups.

## 3.6.0 (2018-10-25)

- ✨ Updated all dependencies
- ✨ Restored coveralls.io reporting
- ✨ Restored unit test linting

## 3.5.0 (2018-08-17)

- ✨ Apparently the input arguments were mutated on some cases. That's fixed now.

## 3.4.0 (2018-08-16)

- ✨ Now, ranges with identical starting and ending points with no third argument (nothing to add) will be removed. They're futile anyway. It's like saying at this index... and saying nothing else.

## 3.3.0 (2018-06-11)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis
- ✨ Removed `package-lock`

## 3.2.0 (2018-05-26)

- ✨ Set up [Prettier](https://prettier.io) on a custom ESLint rule set.
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — there's no need to comment-out `console.log` statements or care about them not spilling into production. Now it's done automatically.
- ✨ Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed. This is important because now code coverage is real again and now there are no excuses not to perfect it.

## 3.1.0 (2017-12-29)

- ✨ If third argument is `null` on any side being merged, output is always `null`. This will stand for explicit "no" to remove any content to be added. Sibling [libraries](https://github.com/codsen/string-slices-array-push) will tap this feature.

Previously `null` would have been turned into a string and shown/concatenated like that which was meaningless and kindof erroneous. We never used `null` anyway. That's why this is not a major semver bump but minor - it's only a feature, an extension of the API.

# 3.0.0 (2017-12-05)

- ✨ If you have two ranges where second-one completely overlaps the first-one and the first has third argument, something to insert in its place, that third argument will be discarded upon merge.

Let's say you got these two ranges:

```js
[[5, 6, " "], [1, 10]];
```

Previously, result would be `[1, 10, ' ']`. Now result will be `[1, 10]`. This is logical, because each range should take care to consider its vicinity. If `[1, 10]` came in without instructions to add something in its place, we assume this was intentional.

This change is logical and natural but I'm bumping major version just in case it breaks somebody's unit tests.

# 2.0.0 (2017-12-04)

- ✨ Rebased the source in ES Modules
- ✨ Set up Rollup and now we are generating three builds: CommonJS, UMD and ES Modules (native code).

## 1.0.0 (2017-09-18)

- First public release
