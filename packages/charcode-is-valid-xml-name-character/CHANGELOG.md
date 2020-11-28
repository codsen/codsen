# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 1.11.0 (2020-11-28)


### Bug Fixes

* Fix the Create New Issue URLs ([c5ee4a6](https://git.sr.ht/~royston/codsen/commits/c5ee4a61e9436099b0e20d20bca043c1b2c93f55))


### Features

* add function aliases with more human-friendly names ([9cb319b](https://git.sr.ht/~royston/codsen/commits/9cb319bd1d38ad0b6bb7b82314d36df3a38e668e))
* Add one more tag before which there will be a line break ([4f00871](https://git.sr.ht/~royston/codsen/commits/4f008715dcc2de7b2b52b67ce2e27728d5ffec37))
* Initial release ([4f35bfb](https://git.sr.ht/~royston/codsen/commits/4f35bfb167e54b1a0e5e8f01871293b262c67a76))





## 1.10.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 1.7.0 (2018-12-26)

- ✨ Add function aliases with more human-friendly names ([9cb319b](https://gitlab.com/codsen/codsen/tree/master/packages/charcode-is-valid-xml-name-character/commits/9cb319b))

## 1.6.0 (2018-10-14)

- ✨ Updated all dependencies and restored unit test coverage tracking: reporting in terminal and coveralls.io

## 1.5.0 (2018-06-11)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis
- ✨ Removed `package-lock`

## 1.4.0 (2018-05-31)

- ✨ I found myself looking again and again at the spec, double-checking which function name `isProduction4` or `isProduction4a` is for the first character, which is for second character onwards. To make life easier, I decided to supplement exported function with aliase keys `validFirstChar` and `validSecondCharOnwards` which are the same functions but named more sensibly.

## 1.3.0 (2018-05-03)

- ✨ Set up [Prettier](https://prettier.io)
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove them during the builds.

## 1.2.0 (2018-02-16)

### Added

- ✨ First checking lowercase letters, then the rest.

## 1.1.0 (2018-02-06)

- ✨ Tapped the dependency `ranges-is-index-within` ([npm](https://www.npmjs.com/package/ranges-is-index-within), [GitLab](https://gitlab.com/codsen/codsen/tree/master/packages/ranges-is-index-within)) with sorting turned off to save resources. (`opts.skipIncomingRangeSorting` setting)

## 1.0.0 (2018-02-05)

- ✨ First public release
