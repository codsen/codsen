# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.2.11](https://gitlab.com/codsen/codsen/compare/eslint-plugin-row-num@1.2.10...eslint-plugin-row-num@1.2.11) (2020-09-07)

**Note:** Version bump only for package eslint-plugin-row-num





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
