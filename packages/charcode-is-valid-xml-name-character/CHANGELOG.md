# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.0.3](https://github.com/codsen/codsen/compare/charcode-is-valid-xml-name-character@2.0.2...charcode-is-valid-xml-name-character@2.0.3) (2021-11-02)


### Bug Fixes

* bump TS and separate ESLint plugins away from this monorepo ([b1ebce1](https://github.com/codsen/codsen/commit/b1ebce1637d8c41c2d848fc24b0ba4058865bd5d))


### Features

* migrate to ES Modules ([c579dff](https://github.com/codsen/codsen/commit/c579dff3b23205e383035ca10ddcec671e35d0fe))


### BREAKING CHANGES

* programs now are in ES Modules and won't work with Common JS require()





## 2.0.1 (2021-09-13)

### Bug Fixes

- bump TS and separate ESLint plugins away from this monorepo ([2e07d42](https://github.com/codsen/codsen/commit/2e07d424222b6ffedf5fb45c83ad453627ec2904))

## 2.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS require()

## 1.13.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 1.12.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 1.12.1 (2021-01-28)

### Bug Fixes

- add testStats to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 1.12.0 (2021-01-23)

### Features

- rewrite in TS ([ab146b1](https://github.com/codsen/codsen/commit/ab146b16666536d09242a901c12eb4542a108ab2))

## 1.11.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 1.10.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 1.7.0 (2018-12-26)

- ✨ Add function aliases with more human-friendly names ([9cb319b](https://gitlab.com/codsen/codsen/tree/master/packages/charcode-is-valid-xml-name-character/commits/9cb319b))

## 1.6.0 (2018-10-14)

- ✨ Updated all dependencies and restored unit test coverage tracking: reporting in terminal and coveralls.io

## 1.5.0 (2018-06-11)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis
- ✨ Removed `package-lock`

## 1.4.0 (2018-05-31)

- ✨ I found myself looking again and again at the spec, double-checking which function name `isProduction4` or `isProduction4a` is for the first character, which is for second character onwards. To make life easier, I decided to supplement exported function with aliase keys `validFirstChar` and `validSecondCharOnwards` which are the same functions but named more sensibly.

## 1.3.0 (2018-05-03)

- ✨ Set up [Prettier](https://prettier.io)
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove them during the builds.

## 1.2.0 (2018-02-16)

### Added

- ✨ First checking lowercase letters, then the rest.

## 1.1.0 (2018-02-06)

- ✨ Tapped the dependency `ranges-is-index-within` ([npm](https://www.npmjs.com/package/ranges-is-index-within), [GitLab](https://gitlab.com/codsen/codsen/tree/master/packages/ranges-is-index-within)) with sorting turned off to save resources. (`opts.skipIncomingRangeSorting` setting)

## 1.0.0 (2018-02-05)

- ✨ First public release
