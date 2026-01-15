# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 5.1.3 (2026-01-15)

**Note:** Version bump only for package array-includes-with-glob

## 5.1.0 (2025-10-15)

### Features

- if value to be added is a number, keep it as is, don't stringify ([ce3e1a5](https://github.com/codsen/codsen/commit/ce3e1a525998ca3c0abf0142affef95b14cd1990))

## 5.0.0 (2022-12-01)

### BREAKING CHANGES

- Minimum supported Node version is v14.18; we're dropping v12 support

## 4.1.0 (2022-08-12)

### Features

- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

## 4.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS `require()`

## 3.1.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 3.0.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 3.0.1 (2021-01-28)

### Fixed

- add `testStats` to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 3.0.0 (2021-01-23)

### Features

- Rewrite in TypeScript, start using named exports

### BREAKING CHANGES

- Previously, you'd consume by: `import includesWithGlob from ...", now use: `import { includesWithGlob } from ...`

## 2.13.0 (2020-11-28)

Accidental version bump during migration to SourceHut. Sorry about that.

## 2.12.0 (2019-06-29)

### Features

- Add perf measurement, tracking and historical comparison ([b7f73ad](https://gitlab.com/codsen/codsen/commit/b7f73ad))

## 2.11.0 (2019-01-20)

- Various documentation and setup tweaks after we migrated to monorepo
- Setup refresh: updated dependencies and all config files using automated tools

## 2.5.0 (2018-12-14)

- 🔧 Restored AVA linting, updated all dependencies, added licence to the top of each built file

## 2.4.0 (2018-10-12)

- Updated all dependencies and restored coverage reporting both in terminal and sending to coveralls

## 2.3.0 (2018-05-11)

- Pointed AVA unit tests to ES Modules build, as opposed to previously transpiled CommonJS-one. This means, now unit test code coverage is correct.

## 2.2.0 (2018-04-29)

- Set up Prettier
- Removed `package.lock` and `.editorconfig`
- Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove them during the builds.

## 2.1.0 (2018-02-11)

- Up until now the [matcher.js](https://github.com/sindresorhus/matcher) which was driving the wildcard matching was not-case sensitive. Today they released case-sensitive option and we are setting it on. This will ensure the consistency in matching results.

## 2.0.0 (2017-12-08)

- Removed JS Standard and switched to raw ESLint with `airbnb-base` config. That's because ESLint is always up-to-date (unlike JS Standard which might consume half-year-old ESLint like it does now) and also because `airbnb-*` configs have more rules active. I overrode the setting for semicolons, of course.

Bumping major just in case it breaks somebody's API. But I don't think it will.

## 1.5.0 (2017-07-23)

- Removed `object-assign` from deps, switched to native `Object.assign`
- Set all dev deps except Standard to be latest (`*`) to save time updating them
- Updated All deps

## 1.4.0 (2017-04-23) Sunday evening

- There are some finshy things happening with string wildcard libraries. Namely, [wildcard](https://www.npmjs.com/package/wildcard) and [wildstring](https://www.npmjs.com/package/wildstring). I was using `wildstring` until I in another of my libraries discovered that it does not support leading wildcards, that is when asterisk is the first character! WTF!!! Same case with `wildcard` too. Proof's [here](https://runkit.com/58fd11151dc1c60013c79f85/58fd132d15bef7001293f41a) and there are other [issues](https://github.com/DamonOehlman/wildcard/issues/9) with its API as well!!!
  SOLUTION: switched to Sindre Sorhus' [matcher](https://www.npmjs.com/package/matcher). Small amendments (order of arguments) and one find-and-replace on the method `isMatch`. Problem solved!

## 1.3.0 (2017-04-23)

- You can provide an array (second argument) of strings to check, is ANY of them found in the source (first argument).
- Alternatively, you can set the matching to request that ALL elements from second argument array must be found in the source array (first argument).

## 1.2.0 (2017-04-22)

- Now the input can be not only array, but string as well. It will be converted into an array first and then processed.

## 1.0.0 (2017-04-22)

- First public release
