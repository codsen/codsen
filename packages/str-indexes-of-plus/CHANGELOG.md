# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.0.3](https://github.com/codsen/codsen/compare/str-indexes-of-plus@4.0.2...str-indexes-of-plus@4.0.3) (2021-11-02)


### Bug Fixes

* bump TS and separate ESLint plugins away from this monorepo ([b1ebce1](https://github.com/codsen/codsen/commit/b1ebce1637d8c41c2d848fc24b0ba4058865bd5d))


### Features

* migrate to ES Modules ([c579dff](https://github.com/codsen/codsen/commit/c579dff3b23205e383035ca10ddcec671e35d0fe))


### BREAKING CHANGES

* programs now are in ES Modules and won't work with Common JS require()





## 4.0.1 (2021-09-13)

### Bug Fixes

- bump TS and separate ESLint plugins away from this monorepo ([2e07d42](https://github.com/codsen/codsen/commit/2e07d424222b6ffedf5fb45c83ad453627ec2904))

## 4.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS require()

## 3.1.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 3.0.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 3.0.1 (2021-01-28)

### Bug Fixes

- add testStats to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 3.0.0 (2021-01-23)

### Features

- rewrite in TS and start using named exports ([2bde77a](https://github.com/codsen/codsen/commit/2bde77abe537122e26a85491345f0285f7fe9495))

### BREAKING CHANGES

- previously: `import strIndexesOfPlus from ...` - now `import { strIndexesOfPlus } from ...`

## 2.11.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 2.10.0 (2020-02-01)

### Features

- remove the last dependency ([d2e66d1](https://gitlab.com/codsen/codsen/commit/d2e66d1c7c82bbf18cf2d4e4c01d4299f75092ce))

## 2.9.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 2.3.0 (2018-10-25)

- ✨ Update all dependencies
- ✨ Restore coveralls.io reporting
- ✨ Restore unit test linting

## 2.2.0 (2018-06-16)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis

## 2.1.0 (2018-05-26)

- ✨ Set up [Prettier](https://prettier.io) on a custom ESLint rule set.
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — there's no need to comment-out `console.log` statements or care about them not spilling into production. Now it's done automatically.
- ✨ Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed. This is important because now code coverage is real again and now there are no excuses not to perfect it.

## 2.0.0 (2017-12-03)

- ✨ Rebased the source to be in ES modules
- ✨ Set up Rollup to generate three flavours: CommonJS, UMD and native ES Modules (source)
- ✨ Removed JS Standard because it's a wrapper and therefore it sucks. Switched to raw ESLint on `airbnb-base` preset and turned off semicolons. Fixed all newly-found issues.
- ✨ Updated many other files including readme.

## 1.0.0 (2017-03-23)

- ✨ First public release
