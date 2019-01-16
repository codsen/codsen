# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.9.2](https://bitbucket.org/codsen/codsen/src/master/packages/arrayiffy-if-string/compare/arrayiffy-if-string@3.9.1...arrayiffy-if-string@3.9.2) (2019-01-15)

**Note:** Version bump only for package arrayiffy-if-string

## [3.9.1](https://bitbucket.org/codsen/codsen/src/master/packages/arrayiffy-if-string/compare/arrayiffy-if-string@3.9.0...arrayiffy-if-string@3.9.1) (2019-01-13)

**Note:** Version bump only for package arrayiffy-if-string

# [3.9.0](https://bitbucket.org/codsen/codsen/src/master/packages/arrayiffy-if-string/compare/arrayiffy-if-string@3.4.8...arrayiffy-if-string@3.9.0) (2019-01-11)

### Features

- Add one more tag before which there will be a line break ([4f00871](https://bitbucket.org/codsen/codsen/src/master/packages/arrayiffy-if-string/commits/4f00871))

# [3.8.0](https://bitbucket.org/codsen/codsen/src/master/packages/arrayiffy-if-string/compare/arrayiffy-if-string@3.4.8...arrayiffy-if-string@3.8.0) (2019-01-08)

### Features

- Add one more tag before which there will be a line break ([4f00871](https://bitbucket.org/codsen/codsen/src/master/packages/arrayiffy-if-string/commits/4f00871))

# [3.7.0](https://bitbucket.org/codsen/codsen/src/master/packages/arrayiffy-if-string/compare/arrayiffy-if-string@3.4.8...arrayiffy-if-string@3.7.0) (2019-01-08)

### Features

- Add one more tag before which there will be a line break ([4f00871](https://bitbucket.org/codsen/codsen/src/master/packages/arrayiffy-if-string/commits/4f00871))

# [3.6.0](https://bitbucket.org/codsen/codsen/src/master/packages/arrayiffy-if-string/compare/arrayiffy-if-string@3.4.8...arrayiffy-if-string@3.6.0) (2019-01-08)

### Features

- Add one more tag before which there will be a line break ([4f00871](https://bitbucket.org/codsen/codsen/src/master/packages/arrayiffy-if-string/commits/4f00871))

# [3.5.0](https://bitbucket.org/codsen/codsen/src/master/packages/arrayiffy-if-string/compare/arrayiffy-if-string@3.4.8...arrayiffy-if-string@3.5.0) (2019-01-07)

### Features

- Add one more tag before which there will be a line break ([4f00871](https://bitbucket.org/codsen/codsen/src/master/packages/arrayiffy-if-string/commits/4f00871))

## [3.4.8](https://bitbucket.org/codsen/codsen/src/master/packages/arrayiffy-if-string/compare/arrayiffy-if-string@3.4.7...arrayiffy-if-string@3.4.8) (2019-01-02)

**Note:** Version bump only for package arrayiffy-if-string

## [3.4.7](https://bitbucket.org/codsen/codsen/src/master/packages/arrayiffy-if-string/compare/arrayiffy-if-string@3.4.6...arrayiffy-if-string@3.4.7) (2019-01-01)

**Note:** Version bump only for package arrayiffy-if-string

## [3.4.6](https://bitbucket.org/codsen/codsen/src/master/packages/arrayiffy-if-string/compare/arrayiffy-if-string@3.4.5...arrayiffy-if-string@3.4.6) (2018-12-29)

**Note:** Version bump only for package arrayiffy-if-string

## [3.4.5](https://bitbucket.org/codsen/codsen/src/master/packages/arrayiffy-if-string/compare/arrayiffy-if-string@3.4.4...arrayiffy-if-string@3.4.5) (2018-12-29)

**Note:** Version bump only for package arrayiffy-if-string

## [3.4.4](https://bitbucket.org/codsen/codsen/src/master/packages/arrayiffy-if-string/compare/arrayiffy-if-string@3.4.3...arrayiffy-if-string@3.4.4) (2018-12-27)

**Note:** Version bump only for package arrayiffy-if-string

## [3.4.3](https://bitbucket.org/codsen/codsen/src/master/packages/arrayiffy-if-string/compare/arrayiffy-if-string@3.4.2...arrayiffy-if-string@3.4.3) (2018-12-27)

**Note:** Version bump only for package arrayiffy-if-string

## 3.4.2 (2018-12-26)

**Note:** Version bump only for package arrayiffy-if-string

## 3.4.0 (2018-10-12)

- ✨ Updated all dependencies and restored coverage tracking both via terminal when testing and through coveralls.io

## 3.3.0 (2018-06-15)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis
- ✨ Removed `package-lock`

## 3.2.0 (2018-05-14)

### Improved

- ✨ Now pointing unit tests at ES Modules build, not CommonJS-one. This means, unit test coverage will be correct (higher) because there won't be any missing rows that Babel added which are impossible to cover.
- ✨ Tweaks to ava [config](https://github.com/avajs/ava/blob/master/docs/recipes/es-modules.md) in `package.json`, properly enabling the `dev` Rollup builds.

## 3.1.0 (2018-04-29)

- ✨ Set up [Prettier](https://prettier.io)
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove them during the builds.

# 3.0.0 (2017-11-22)

### Changed

- ✨ Rewrote in ES modules, now serving UMD, Common JS and native ES modules builds. Bumping major just in case.
- ✨ Removed JS Standard and switched to raw ESLint on `airbnb-base` preset, with no-semicolon override.

## 1.0.0 (2017-05-22)

- ✨ First public release
