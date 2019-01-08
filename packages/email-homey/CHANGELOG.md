# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.5.0](https://bitbucket.org/codsen/codsen/src/master/packages/email-homey/compare/email-homey@2.1.4...email-homey@2.5.0) (2019-01-08)

### Features

- Add one more tag before which there will be a line break ([4f00871](https://bitbucket.org/codsen/codsen/src/master/packages/email-homey/commits/4f00871))

# [2.4.0](https://bitbucket.org/codsen/codsen/src/master/packages/email-homey/compare/email-homey@2.1.4...email-homey@2.4.0) (2019-01-08)

### Features

- Add one more tag before which there will be a line break ([4f00871](https://bitbucket.org/codsen/codsen/src/master/packages/email-homey/commits/4f00871))

## [2.1.4](https://bitbucket.org/codsen/codsen/src/master/packages/email-homey/compare/email-homey@2.1.3...email-homey@2.1.4) (2018-12-29)

**Note:** Version bump only for package email-homey

## [2.1.3](https://bitbucket.org/codsen/codsen/src/master/packages/email-homey/compare/email-homey@2.1.2...email-homey@2.1.3) (2018-12-29)

**Note:** Version bump only for package email-homey

## [2.1.2](https://bitbucket.org/codsen/codsen/src/master/packages/email-homey/compare/email-homey@2.1.1...email-homey@2.1.2) (2018-12-27)

**Note:** Version bump only for package email-homey

## 2.1.1 (2018-12-26)

**Note:** Version bump only for package email-homey

## 2.1.0 (2018-06-21)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to Bitbucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis

# 2.0.0 (2018-05-04)

### Changed

- ✨ Complete rewrite. Now, the only thing `homey` does is it compiles the list of folder names from the input path, then replaces the given placeholder in a given file with the array of the paths to those folder names.

  In practice, Vue.js could drive the homepage and contain all the parts within a single HTML file. All it needs is a list of template folder paths. Vue.js can't "look around" in your file system. You have to give it the list of hardcoded folder names to "bake" into the HTML homepage.

  This means, setup will be simpler now. There's no more two files ("loop-me.html" and "template.html") and everything is more straightforward.

- ✨ Added unit tests!

## 1.8.0 (2017-09-24)

### Changed

- Removed JS Standard and swiched to raw ESLint on `airbnb-base` preset with config override to ban semicolons.
- Made all linting checks to pass
- Tweaked readme
- Added gif files to `npmignore` so they don't get `npm i`nstalled
- Updated bithound config to reflect the new setup

## 1.7.0 (2017-08-22)

### Added

- More badges to `readme`

### Updated

- Deps and `package.json`

## 1.6.0 (2017-07-23)

### Updated

- Updated to the latest API, adding recognition of the dates in titles in format `2014/04-15`

## 1.5.0 (2017-07-22)

### Updated

- Updated to the latest API, adding improved recognition of the titles
- Documentation with up-to-date author's name

### Added

- `npmignore`

## 1.4.0 (2017-06-29)

### Updated

Updated all dependencies

## 1.3.0 (2017-06-29)

### Added

Updated to the new version of the API package, CHLU, enabling new features:

- Improved algorithm, reducing the change of false positives when versions are mentioned within the text.

## 1.2.0 (2017-06-23)

### Added

Updated to the new version of the API package, CHLU, enabling new features:

- Automatic title linking
- Unused footer link removal

## 1.1.0 (2017-05-19)

### Added

- Set up the `update-notifier`

## 1.0.0 (2017-05-17)

- First public release
