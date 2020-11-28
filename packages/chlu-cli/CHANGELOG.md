# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 1.17.0 (2020-11-28)


### Bug Fixes

* fix the CLI to make it read package.json files properly ([6caaffc](https://git.sr.ht/~royston/codsen/commits/6caaffc89720aecdf9d6862d8406f42e53f570a2))
* Fix the Create New Issue URLs ([c5ee4a6](https://git.sr.ht/~royston/codsen/commits/c5ee4a61e9436099b0e20d20bca043c1b2c93f55))
* update to the latest v4 meow api, fix aliases ([66fda3d](https://git.sr.ht/~royston/codsen/commits/66fda3dc8973938f0b947cef684cc0c16c2d95ad))


### Features

* Add one more tag before which there will be a line break ([4f00871](https://git.sr.ht/~royston/codsen/commits/4f008715dcc2de7b2b52b67ce2e27728d5ffec37))
* add unit tests ([0692e46](https://git.sr.ht/~royston/codsen/commits/0692e4647cd05e5ecff882ee80c82d682db70ed5))
* atomic file writing ([82f1065](https://git.sr.ht/~royston/codsen/commits/82f106512f60c08d0c3cbee5abdbb0a3f6c2715d))
* bitbucket support ([ea95929](https://git.sr.ht/~royston/codsen/commits/ea95929d3897d0722628521405bc10d692932c11))
* Initial release ([4f35bfb](https://git.sr.ht/~royston/codsen/commits/4f35bfb167e54b1a0e5e8f01871293b262c67a76))
* recognises Bitbucket and more ([d541303](https://git.sr.ht/~royston/codsen/commits/d541303f9cea244de8795241d6a8126832bcdae8))





## 1.16.50 (2019-11-20)

### Bug Fixes

- update to the latest v4 meow api, fix aliases ([66fda3d](https://gitlab.com/codsen/codsen/commit/66fda3dc8973938f0b947cef684cc0c16c2d95ad))

## 1.16.38 (2019-08-15)

### Bug Fixes

- fix the CLI to make it read package.json files properly ([6caaffc](https://gitlab.com/codsen/codsen/commit/6caaffc))

## 1.16.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 1.13.0 (2018-12-26)

- ✨ Add unit tests ([0692e46](https://gitlab.com/codsen/codsen/tree/master/packages/chlu-cli/commits/0692e46))
- ✨ Add atomic file writing ([82f1065](https://gitlab.com/codsen/codsen/tree/master/packages/chlu-cli/commits/82f1065))
- ✨ Add Bitbucket support ([ea95929](https://gitlab.com/codsen/codsen/tree/master/packages/chlu-cli/commits/ea95929))
- ✨ Now recognises Bitbucket and more ([d541303](https://gitlab.com/codsen/codsen/tree/master/packages/chlu-cli/commits/d541303))

## 1.12.0 (2018-10-14)

- ✨ Set up file writing to be atomic
- ✨ Updated all dependencies and restored unit test coverage tracking: reporting in terminal and coveralls.io

## 1.11.0 (2018-07-24)

- ✨ Added unit tests. Couldn't get the unit test coverage only for lines which get triggered when CLI fails to write because I can't programmatically trigger disk write failures. Otherwise, it's 100% coverage.

## 1.10.0 (2018-07-14)

- ✨ Migrated this repo to Bitbucket and made it to automatically detect and generate the correct Bitbucket links
- ✨ Tapped `fs-extra` and rewrote everything in Promises
- ✨ It taps the Git data (if available) to make the diff links more precise: the "from" tag's version is picked not from existing titles in changelog (where only minor releases are often mentioned) but from real, previous patch release (which can be done way later than the last release, mentioned in changelog). This means, diff link contents will have less info about meaningless maintenance (patch) updates.
- ✨ Alongside, developed and tapped the API's, `chlu` diff link correction.

## 1.9.0 (2018-05-03)

- ✨ Set up [Prettier](https://prettier.io)
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove them during the builds.
- ✨ Stopped transpiling to ES5, dropped Babel and bumped the Node engines to `>=8`

## 1.8.0 (2017-09-24)

### Changed

- ✨ Removed JS Standard and swiched to raw ESLint on `airbnb-base` preset with config override to ban semicolons.
- ✨ Made all linting checks to pass
- ✨ Tweaked readme
- ✨ Added gif files to `npmignore` so they don't get `npm i`nstalled
- ✨ Updated bithound config to reflect the new setup

## 1.7.0 (2017-08-22)

### Added

- ✨ More badges to `readme`

### Updated

- ✨ Deps and `package.json`

## 1.6.0 (2017-07-23)

### Updated

- ✨ Updated to the latest API, adding recognition of the dates in titles in format `2014/04-15`

## 1.5.0 (2017-07-22)

### Updated

- ✨ Updated to the latest API, adding improved recognition of the titles
- ✨ Documentation with up-to-date author's name

### Added

- ✨ `npmignore`

## 1.4.0 (2017-06-29)

### Updated

Updated all dependencies

## 1.3.0 (2017-06-29)

### Added

Updated to the new version of the API package, CHLU, enabling new features:

- ✨ Improved algorithm, reducing the change of false positives when versions are mentioned within the text.

## 1.2.0 (2017-06-23)

### Added

Updated to the new version of the API package, CHLU, enabling new features:

- ✨ Automatic title linking
- ✨ Unused footer link removal

## 1.1.0 (2017-05-19)

### Added

- ✨ Set up the `update-notifier`

## 1.0.0 (2017-05-17)

- ✨ First public release
