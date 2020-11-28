# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 4.0.0 (2020-11-28)


### Bug Fixes

* Fix the Create New Issue URLs ([c5ee4a6](https://git.sr.ht/~royston/codsen/commits/c5ee4a61e9436099b0e20d20bca043c1b2c93f55))


### Features

* Add one more tag before which there will be a line break ([4f00871](https://git.sr.ht/~royston/codsen/commits/4f008715dcc2de7b2b52b67ce2e27728d5ffec37))
* fixture mangling prevention using SHA hashes, 100% cov and some rebase ([0973579](https://git.sr.ht/~royston/codsen/commits/0973579ca57df0d2f641ff4a4fea2f6951b4f6fe))
* Initial release ([4f35bfb](https://git.sr.ht/~royston/codsen/commits/4f35bfb167e54b1a0e5e8f01871293b262c67a76))
* Merge modes via opts.mergeType ([7fb1c5f](https://git.sr.ht/~royston/codsen/commits/7fb1c5f319aa41ea54c68eed004ab2dfdc7425bf))
* rebase to point to es modules builds ([8d4635e](https://git.sr.ht/~royston/codsen/commits/8d4635edc84933f584a85112f14dabc33f0c51da))
* Switch to currency.js ([8a97e38](https://git.sr.ht/~royston/codsen/commits/8a97e3827babd03ccbf0ba3aa997df6a627dfce2))


### Performance Improvements

* removal dependency ordinal ([e8cd758](https://git.sr.ht/~royston/codsen/commits/e8cd758405f08e4250b5ccd3c2dab8e85c880a8b))


### BREAKING CHANGES

* Second input argument, progressFn, was moved into opts.progressFn and opts was
placed into second input argument instead





## 3.1.0 (2020-09-27)

### Features

- fixture mangling prevention using SHA hashes, 100% cov and some rebase ([0973579](https://gitlab.com/codsen/codsen/commit/0973579ca57df0d2f641ff4a4fea2f6951b4f6fe))

## 3.0.37 (2019-10-05)

### Performance Improvements

- removal dependency ordinal ([e8cd758](https://gitlab.com/codsen/codsen/commit/e8cd758))

## 2.7.0 (2019-02-26)

### Features

- Switch to currency.js ([0c2521b](https://gitlab.com/codsen/codsen/commit/0c2521b))

## 2.6.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 2.4.0 (2018-12-26)

- ✨ Rebase to point to es modules builds ([8d4635e](https://gitlab.com/codsen/codsen/tree/master/packages/csv-sort/commits/8d4635e))

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

## 2.0.0 (2017-11-12)

- 🔧 Rewrote in ES Modules and set up the Rollup to generate 3 flavours of it: CommonJS, UMD and ES Modules.

**PS.** Bumping major just in case the Rollup setup messes up somebody's API's (which it shouldn't but let's be on the safe side).

## 1.0.0 (2017-08-22)

- ✨ First public release
