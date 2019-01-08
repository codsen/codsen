# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.6.0](https://bitbucket.org/codsen/codsen/src/master/packages/detect-is-it-html-or-xhtml/compare/detect-is-it-html-or-xhtml@3.3.5...detect-is-it-html-or-xhtml@3.6.0) (2019-01-08)


### Features

* Add one more tag before which there will be a line break ([4f00871](https://bitbucket.org/codsen/codsen/src/master/packages/detect-is-it-html-or-xhtml/commits/4f00871))





# [3.5.0](https://bitbucket.org/codsen/codsen/src/master/packages/detect-is-it-html-or-xhtml/compare/detect-is-it-html-or-xhtml@3.3.5...detect-is-it-html-or-xhtml@3.5.0) (2019-01-08)

### Features

- Add one more tag before which there will be a line break ([4f00871](https://bitbucket.org/codsen/codsen/src/master/packages/detect-is-it-html-or-xhtml/commits/4f00871))

# [3.4.0](https://bitbucket.org/codsen/codsen/src/master/packages/detect-is-it-html-or-xhtml/compare/detect-is-it-html-or-xhtml@3.3.5...detect-is-it-html-or-xhtml@3.4.0) (2019-01-07)

### Features

- Add one more tag before which there will be a line break ([4f00871](https://bitbucket.org/codsen/codsen/src/master/packages/detect-is-it-html-or-xhtml/commits/4f00871))

## [3.3.5](https://bitbucket.org/codsen/codsen/src/master/packages/detect-is-it-html-or-xhtml/compare/detect-is-it-html-or-xhtml@3.3.4...detect-is-it-html-or-xhtml@3.3.5) (2019-01-01)

**Note:** Version bump only for package detect-is-it-html-or-xhtml

## [3.3.4](https://bitbucket.org/codsen/codsen/src/master/packages/detect-is-it-html-or-xhtml/compare/detect-is-it-html-or-xhtml@3.3.3...detect-is-it-html-or-xhtml@3.3.4) (2018-12-29)

**Note:** Version bump only for package detect-is-it-html-or-xhtml

## [3.3.3](https://bitbucket.org/codsen/codsen/src/master/packages/detect-is-it-html-or-xhtml/compare/detect-is-it-html-or-xhtml@3.3.2...detect-is-it-html-or-xhtml@3.3.3) (2018-12-29)

**Note:** Version bump only for package detect-is-it-html-or-xhtml

## [3.3.2](https://bitbucket.org/codsen/codsen/src/master/packages/detect-is-it-html-or-xhtml/compare/detect-is-it-html-or-xhtml@3.3.1...detect-is-it-html-or-xhtml@3.3.2) (2018-12-27)

**Note:** Version bump only for package detect-is-it-html-or-xhtml

## 3.3.1 (2018-12-26)

**Note:** Version bump only for package detect-is-it-html-or-xhtml

## 3.3.0 (2018-10-17)

- ✨ Updated all dependencies
- ✨ Restored unit test coverage tracking: reporting in terminal and coveralls.io
- ✨ Restored unit test linting

## 3.2.0 (2018-06-11)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis
- ✨ Removed `package-lock`

## 3.1.0 (2018-05-03)

- ✨ Set up [Prettier](https://prettier.io)
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove from production code.

# 3.0.0 (2017-12-09)

### Changed

- ✨ Rebased in ES node_modules
- ✨ Set up the Rollup (nice rhyming). Now we generate CommonJS, UMD and ES Module (native code) builds.
- ✨ Set up raw ESLint on `airbnb-base` preset with semicolons off. Also linting for AVA unit tests.

## 2.0.0 (2017-03-02)

### Changed

- ✨ In order to prevent accidental input argument mutation when object is given, now we're throwing a type error when the input argument is present, but of a wrong type. That's enough to warrant a major API change under semver.
