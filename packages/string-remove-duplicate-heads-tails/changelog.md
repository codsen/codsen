# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## 2.5.0 - 2018-06-11

GitHub sold us out. In the meantime, we:

- ✨ Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis
- ✨ Removed `package-lock`

## 2.4.0 - 2018-05-16

- ✨ Tapped dependency [string-match-left-right](https://github.com/codsen/string-match-left-right) with its new `{relaxedApi: true}` option. This prevents `throw` errors in some edge case scenarios.

## 2.3.0 - 2018-05-15

- ✨ Set up [Prettier](https://prettier.io)
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove from production code.
- ✨ Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed

## 2.2.0 - 2018-03-27

- ✨ Relaxed the API - if the input is non-string, it's just returned back.
- ✨ Switched from raw ESLint on `airbnb-base` preset to raw ESLint and Prettier.

## 2.1.0 - 2018-02-14

- ✨ Trimming now touches only spaces. Line breaks, tabs and non-breaking spaces are not touched.

## 2.0.0 - 2018-02-13

- ✨ Rewrote the whole thing. Added more unit tests.

## 1.0.0 - 2018-01-11

- ✨ First public release
