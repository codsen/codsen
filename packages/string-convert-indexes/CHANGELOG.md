# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [6.0.18](https://github.com/codsen/codsen/compare/string-convert-indexes@6.0.17...string-convert-indexes@6.0.18) (2024-01-31)

**Note:** Version bump only for package string-convert-indexes

## 6.0.0 (2022-12-01)

### BREAKING CHANGES

- Minimum supported Node version is v14.18; we're dropping v12 support

## 5.1.0 (2022-08-12)

### Features

- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

## 5.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS `require()`

## 4.1.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 4.0.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 4.0.1 (2021-01-28)

### Fixed

- add `testStats` to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 4.0.0 (2021-01-23)

### Features

- rewrite in TS ([19c75f4](https://github.com/codsen/codsen/commit/19c75f4697abd85ff57adc9ad2462bb828f27792))

### BREAKING CHANGES

- there are no API changes, but we're bumping _major_ just in case

## 3.0.0 (2020-11-28)

Accidental version bump during migration to SourceHut. Sorry about that.

## 2.0.0 (2020-09-24)

### Features

- drop options, complete rewrite ([22acff5](https://gitlab.com/codsen/codsen/commit/22acff588eb832caf025a6c4b65d8c0303be202f))

### BREAKING CHANGES

- no more options input argument - it always throws now if inputs are wrong

## 2.0.0 (2020-09-20)

Complete rewrite. Dropping options, now program always throws if requested indexes are beyond the source length. Beside that, API-wise, nothing new.

## 1.10.0 (2020-02-01)

### Features

- remove a dependency, rebase a little ([56ec65d](https://gitlab.com/codsen/codsen/commit/56ec65d5e5c02e4f57bb67250d1cd17a9736f8d9))

## 1.9.44 (2019-10-02)

### Performance Improvements

- remove opts validation and orginal number packages, around 500x speed improv ([e2211c1](https://gitlab.com/codsen/codsen/commit/e2211c1))

## 1.9.0 (2019-01-20)

- Various documentation and setup tweaks after we migrated to monorepo
- Setup refresh: updated dependencies and all config files using automated tools

## 1.6.0 (2018-10-25)

- Update all dependencies
- Restore coveralls.io reporting
- Restore unit test linting

## 1.5.0 (2018-08-19)

- Rebase code to remove any `if (DEBUG)` statements - now `console.log` comments can be left in place - they will be removed during non-dev Rollup builds
- Refresh the setup - temporarily remove `nyc` and update all dependencies

## 1.4.0 (2018-06-29)

- Set up Rollup to remove comments from the code

## 1.3.0 (2018-06-16)

GitHub sold us out. In the meantime, we:

- Migrate to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- Drop BitHound (RIP) and Travis

## 1.2.0 (2018-05-10)

- Set up [Prettier](https://prettier.io)
- Remove `package.lock` and `.editorconfig`
- Wire up Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove from production code.
- Point the unit tests at the _ES modules_ build, which means that code coverage is correct now, without Babel functions being missed

## 1.1.0 (2017-12-27)

- Now, this library can convert the next index, right outside of the last character.

Imagine, you have a string, astral character `\uD834\uDF06`. Now describe its contents in terms of `String.slice()` range. That would be `[0, 2]`. Now, this index \#2 is outside of the string character indexes range! We have only `\uD834` at \#0 and `\uDF06` at \#1. There's no \#2!

Previously, this \#2 would have caused an error. Now it does not. We can actually calculate and convert the next character, right outside of the string too. After all, the calculation needs just the lengths of all the characters BEFORE it, and we have that!

Practically, this is very important feature, it means we now can convert the ranges that include string's last character.

## 1.0.0 (2017-12-25)

- First public release
