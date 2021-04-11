# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.5.11](https://github.com/codsen/codsen/compare/eslint-plugin-row-num@1.5.10...eslint-plugin-row-num@1.5.11) (2021-04-11)


### Reverts

* Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))





## 1.5.1 (2021-02-14)

### Bug Fixes

- fix the backtick blocks under TS parser ([56b9bb3](https://github.com/codsen/codsen/commit/56b9bb3c34539bcd2c17e601ec0d1803d8317c4a))
- remove circular JSON stringify ([2dc8145](https://github.com/codsen/codsen/commit/2dc81451fbfcf667f4931411447d0b41c1eabfb8))

## 1.5.0 (2021-02-09)

### Features

- add support for @typescript-eslint/parser and TS code in general ([53deb16](https://github.com/codsen/codsen/commit/53deb16d869e5d761a9cdc4bb71788a13a33890a))

## 1.4.1 (2021-01-28)

### Bug Fixes

- add testStats to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 1.4.0 (2021-01-23)

### Features

- rewrite in TS ([e0b483e](https://github.com/codsen/codsen/commit/e0b483e153fec00b94a198058e315f902c2d5d61))

## 1.3.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 1.2.0 (2020-05-06)

Normally, here, all non-CLI packages have sources in ES Modules and are being bundled using Rollup into CJS, ESM and UMD builds. Up to now, I kept the setup in CJS, keeping the file setup the same as some influential people on the npm.

Problem is, eslint plugins are not special snowflakes! We can use ES modules import/export in source files! We can publish UMD builds of them too! Imagine, an online plugin tester web app could show how linting works! UMD build served from npm CDN!

We'll start "Rolling up" this and all upcoming eslint plugins!

### Features

- rebase in ES modules and set up Rollup ([f8f9298](https://gitlab.com/codsen/codsen/commit/f8f929842cc5870fa4fcaf93cc2da2d6ba09466f))

## 1.1.1 (2019-12-14)

### Bug Fixes

- set up Tap as a test runner, write many more unit tests and fix all remaining issues ([58e1471](https://gitlab.com/codsen/codsen/commit/58e147195282077df7ad20efb00dac95976ac24d))

## 1.1.0 (2019-12-09)

### Features

- initial release ([6be989e](https://gitlab.com/codsen/codsen/commit/6be989ee0df3f06661a2319dc990c39d1c3e682f))
