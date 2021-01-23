# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 7.0.0 (2021-01-23)


### Bug Fixes

* Fix the Create New Issue URLs ([f5a41bf](https://github.com/codsen/codsen/commit/f5a41bf16fd8f43de7f8e7de68da562821ddb960))


### Features

* Add one more tag before which there will be a line break ([d178203](https://github.com/codsen/codsen/commit/d1782036b134102fd552d38d2d4f39c93195620b))
* discard any null ranges when merging ([3448894](https://github.com/codsen/codsen/commit/3448894ce0042c9551d10806163a4f4fc173fbf0))
* improvements against input argument mutation ([e9b7d7d](https://github.com/codsen/codsen/commit/e9b7d7d3270b4409f3f92237f4b7cd7eefb1dc91))
* Initial release ([8db2df9](https://github.com/codsen/codsen/commit/8db2df9fb08d66cf6c7a75a57cdcd15a5ec12c1c))
* Merge modes via opts.mergeType ([2394464](https://github.com/codsen/codsen/commit/2394464976ce1970bcd31b45d9fd9955f4bbcc09))
* Move progressFn, second argument into to opts object ([dd56251](https://github.com/codsen/codsen/commit/dd562511fc81635a7e83f6fef0386118152f7a55))
* opts.joinRangesThatTouchEdges ([df79c09](https://github.com/codsen/codsen/commit/df79c09dac98821c70982e6bcbfef3ae9d3bfb80))
* remove a dependency, rebase a little ([6f71602](https://github.com/codsen/codsen/commit/6f7160237416327213b7020a8ea81a18f452abc3))
* removes ranges with no third arg with identical start and end points ([4632b0e](https://github.com/codsen/codsen/commit/4632b0e892b4e7f6ddc52f87592b6ec572c22ec7))
* return null instead of empty array ([4cd0ac2](https://github.com/codsen/codsen/commit/4cd0ac20cfcb67b2e2889af47021502baef08876))
* rewrite in TS and start using named exports ([3fdf215](https://github.com/codsen/codsen/commit/3fdf2155ff9c0a20661f81b4d679956cd49c989d))
* simplify with unary plus operator ([61fb747](https://github.com/codsen/codsen/commit/61fb747ed53522a514fc1ff3c59c2c13ce39e348))
* Tweak API to correctly interpret opts.processFn given as an empty plain object ([16574df](https://github.com/codsen/codsen/commit/16574df4d7054edab5eccef6e166e47e604135a5))


### BREAKING CHANGES

* previously: "import rMerge from ..." - now "import { rMerge } from ..."
* return null instead of empty array
* Second input argument, progressFn, was moved into opts.progressFn and opts was
placed into second input argument instead





## 6.2.0 (2020-11-29)

### Features

- simplify with unary plus operator ([39a9f57](https://git.sr.ht/~royston/codsen/commit/39a9f57fd3f8387bec2db70b7e514581184f7803))

## 6.1.0 (2020-11-29)

### Features

- simplify with unary plus operator ([39a9f57](https://git.sr.ht/~royston/codsen/commit/39a9f57fd3f8387bec2db70b7e514581184f7803))

## 6.0.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 5.0.0 (2020-09-07)

### Features

- discard any null ranges when merging ([ae51bce](https://gitlab.com/codsen/codsen/commit/ae51bce0bcbdb4012548887a31633eaafda5dfdc))
- return null instead of empty array ([27fa708](https://gitlab.com/codsen/codsen/commit/27fa70879ef0fb65594ffa55de17a26d64353186))

### BREAKING CHANGES

- return null instead of empty array

## 4.3.0 (2020-02-01)

### Features

- remove a dependency, rebase a little ([625ba18](https://gitlab.com/codsen/codsen/commit/625ba1871fe12efe1f36fbbb4f67b7025d5905a9))

## 4.2.0 (2019-06-01)

### Features

- Tweak API to correctly interpret opts.processFn given as an empty plain object ([bcedd6e](https://gitlab.com/codsen/codsen/commit/bcedd6e))

## 4.1.0 (2019-03-17)

### Features

- opts.joinRangesThatTouchEdges ([40cf7e6](https://gitlab.com/codsen/codsen/commit/40cf7e6))

## 3.12.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 3.8.0 (2018-12-26)

- ✨ Improvements against input argument mutation ([924c7ae](https://gitlab.com/codsen/codsen/tree/master/packages/ranges-merge/commits/924c7ae))
- ✨ Removes ranges with no third arg with identical start and end points ([707553b](https://gitlab.com/codsen/codsen/tree/master/packages/ranges-merge/commits/707553b))

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

## 3.0.0 (2017-12-05)

- ✨ If you have two ranges where second-one completely overlaps the first-one and the first has third argument, something to insert in its place, that third argument will be discarded upon merge.

Let's say you got these two ranges:

```js
[
  [5, 6, " "],
  [1, 10],
];
```

Previously, result would be `[1, 10, ' ']`. Now result will be `[1, 10]`. This is logical, because each range should take care to consider its vicinity. If `[1, 10]` came in without instructions to add something in its place, we assume this was intentional.

This change is logical and natural but I'm bumping major version just in case it breaks somebody's unit tests.

## 2.0.0 (2017-12-04)

- ✨ Rebased the source in ES Modules
- ✨ Set up Rollup and now we are generating three builds: CommonJS, UMD and ES Modules (native code).

## 1.0.0 (2017-09-18)

- First public release
