# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 3.9.0 (2019-01-11)

### Features

- Add one more tag before which there will be a line break ([4f00871](https://bitbucket.org/codsen/codsen/src/master/packages/arrayiffy-if-string/commits/4f00871))

## 3.8.0 (2019-01-08)

### Features

- Add one more tag before which there will be a line break ([4f00871](https://bitbucket.org/codsen/codsen/src/master/packages/arrayiffy-if-string/commits/4f00871))

## 3.7.0 (2019-01-08)

### Features

- Add one more tag before which there will be a line break ([4f00871](https://bitbucket.org/codsen/codsen/src/master/packages/arrayiffy-if-string/commits/4f00871))

## 3.6.0 (2019-01-08)

### Features

- Add one more tag before which there will be a line break ([4f00871](https://bitbucket.org/codsen/codsen/src/master/packages/arrayiffy-if-string/commits/4f00871))

## 3.5.0 (2019-01-07)

### Features

- Add one more tag before which there will be a line break ([4f00871](https://bitbucket.org/codsen/codsen/src/master/packages/arrayiffy-if-string/commits/4f00871))

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

## 3.0.0 (2017-11-22)

### Changed

- ✨ Rewrote in ES modules, now serving UMD, Common JS and native ES modules builds. Bumping major just in case.
- ✨ Removed JS Standard and switched to raw ESLint on `airbnb-base` preset, with no-semicolon override.

## 1.0.0 (2017-05-22)

- ✨ First public release
