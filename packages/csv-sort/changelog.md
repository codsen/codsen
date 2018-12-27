# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.4.1](https://bitbucket.org/codsen/codsen/src/master/packages/csv-sort/compare/csv-sort@2.4.0...csv-sort@2.4.1) (2018-12-27)

**Note:** Version bump only for package csv-sort





# 2.4.0 (2018-12-26)


### Features

* rebase to point to es modules builds ([8d4635e](https://bitbucket.org/codsen/codsen/src/master/packages/csv-sort/commits/8d4635e))





## 2.3.0 (2018-10-17)

- ✨ Updated all dependencies and restored unit test coverage tracking: reporting in terminal and coveralls.io

## 2.2.0 (2018-06-14)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis

## 2.1.0 (2018-05-03)

- ✨ Set up [Prettier](https://prettier.io)
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove them during the builds.

# 2.0.0 (2017-11-12)

### Changed

- ✨ Rewrote in ES Modules and set up the Rollup to generate 3 flavours of it: CommonJS, UMD and ES Modules.

Bumping major just in case the Rollup setup messes up somebody's API's (which it shouldn't but let's be on the safe side).

## 1.0.0 (2017-08-22)

- ✨ First public release
