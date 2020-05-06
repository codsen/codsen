# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 1.1.0 (2020-05-06)

### Features

- init ([928bb73](https://gitlab.com/codsen/codsen/commit/928bb73e3d2a036b5da65ed192f4982e5e8b60a7))

## 1.2.0

Normally, here, all non-CLI packages have sources in ES Modules and are being bundled using Rollup into CJS, ESM and UMD builds. Up to now, I kept the setup in CJS, keeping the file setup the same as some influential people on the npm.

Problem is, eslint plugins are not special snowflakes! We can use ES modules import/export in source files! We can publish UMD builds of them too! Imagine, an online plugin tester web app could show how linting works! UMD build served from npm CDN!

We'll start "Rolling up" this and all upcoming eslint plugins!

## 1.1.1 (2019-12-14)

### Bug Fixes

- set up Tap as a test runner, write many more unit tests and fix all remaining issues ([58e1471](https://gitlab.com/codsen/codsen/commit/58e147195282077df7ad20efb00dac95976ac24d))

## 1.1.0 (2019-12-09)

### Features

- initial release ([6be989e](https://gitlab.com/codsen/codsen/commit/6be989ee0df3f06661a2319dc990c39d1c3e682f))
