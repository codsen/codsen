# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 8.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS require()

## 7.1.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 7.0.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 7.0.1 (2021-01-28)

### Bug Fixes

- add testStats to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 7.0.0 (2021-01-23)

### Features

- rewrite in TS and start using named exports ([3fdf215](https://github.com/codsen/codsen/commit/3fdf2155ff9c0a20661f81b4d679956cd49c989d))

### BREAKING CHANGES

- previously: `import rMerge from ...` - now `import { rMerge } from ...`

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
