# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 2.8.0 (2020-11-28)

### Bug Fixes

- Fix the Create New Issue URLs ([c5ee4a6](https://git.sr.ht/~royston/codsen/commits/c5ee4a61e9436099b0e20d20bca043c1b2c93f55))

### Features

- Add one more tag before which there will be a line break ([4f00871](https://git.sr.ht/~royston/codsen/commits/4f008715dcc2de7b2b52b67ce2e27728d5ffec37))
- Initial release ([4f35bfb](https://git.sr.ht/~royston/codsen/commits/4f35bfb167e54b1a0e5e8f01871293b262c67a76))
- some rebasing and examples ([7fc5cf5](https://git.sr.ht/~royston/codsen/commits/7fc5cf5885d32f1d289ec13ace27c313f9e203ae))
- supplement the getter's result with path ([1594a36](https://git.sr.ht/~royston/codsen/commits/1594a36e9dd799f9bcbaf379fc054b1dd55cbd67))

## 2.7.0 (2020-09-27)

### Features

- some rebasing and examples ([7fc5cf5](https://gitlab.com/codsen/codsen/commit/7fc5cf5885d32f1d289ec13ace27c313f9e203ae))

## 2.2.0 (2018-12-26)

### Features

- Supplement the getter's result with path ([1594a36](https://gitlab.com/codsen/codsen/tree/master/packages/ast-get-values-by-key/commits/1594a36))

## 2.1.0 (2018-10-13)

- ✨ Updated all dependencies and restored coverage tracking both via terminal when testing and through coveralls.io

## 2.0.0 (2018-09-27)

🔨 Major API changes: now the result is not array of strings, but array of plain objects, where previous string is under key `val`. This lets us get another key - `path` of that value.

Setter method behaves the same.

## 1.3.0 (2018-06-13)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis
- ✨ Removed `package-lock`

## 1.2.0 (2018-05-14)

### Improved

- ✨ Now pointing unit tests at ES Modules build, not CommonJS-one. This means, unit test coverage will be correct (higher) because there won't be any missing rows that Babel added which are impossible to cover.
- ✨ Tweaks to ava [config](https://github.com/avajs/ava/blob/master/docs/recipes/es-modules.md) in `package.json`, properly enabling the `dev` Rollup builds.

## 1.1.0 (2018-05-02)

### Added

- ✨ Set up [Prettier](https://prettier.io)
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove from production code.

## 1.0.0 (2018-03-11)

- ✨ First public release
