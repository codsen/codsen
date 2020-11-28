# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 2.12.0 (2020-11-28)


### Bug Fixes

* Fix the Create New Issue URLs ([c5ee4a6](https://git.sr.ht/~royston/codsen/commits/c5ee4a61e9436099b0e20d20bca043c1b2c93f55))


### Features

* Add one more tag before which there will be a line break ([4f00871](https://git.sr.ht/~royston/codsen/commits/4f008715dcc2de7b2b52b67ce2e27728d5ffec37))
* allow any types in override object key values ([af4f99d](https://git.sr.ht/~royston/codsen/commits/af4f99d5660462706a91c299bfbf4d4df5ad2bfa))
* Initial release ([4f35bfb](https://git.sr.ht/~royston/codsen/commits/4f35bfb167e54b1a0e5e8f01871293b262c67a76))





## 2.11.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 2.5.0 (2018-12-26)

- ✨ Allow any types in override object key values ([af4f99d](https://gitlab.com/codsen/codsen/tree/master/packages/object-boolean-combinations/commits/af4f99d))

## 2.4.0 (2018-10-24)

- ✨ Updated all dependencies
- ✨ Restored coveralls.io reporting
- ✨ Restored unit test linting

## 2.3.0 (2018-07-25)

- ✨ Allow override object key values to be of any type
- ✨ Small improvements to the setup

## 2.2.0 (2018-06-16)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to Bitbucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis

## 2.1.0 (2018-05-17)

### Changed

- ✨ Set up [Prettier](https://prettier.io) on a custom ESLint rules, dropped `airbnb-base`
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove from production code.
- ✨ Now unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed

## 2.0.0 (2017-12-12)

### Changed

- ✨ Rebased the source in ES Modules
- ✨ Set up Rollup and now we are generating three builds: CommonJS, UMD and ES Modules (native code).
- ✨ Small tweaks to the code, no changes to the API.

**PS. Bumping the major version just in case it breaks something. But it should not.**
