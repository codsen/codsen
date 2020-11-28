# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 1.13.0 (2020-11-28)

### Bug Fixes

- Fix the Create New Issue URLs ([c5ee4a6](https://git.sr.ht/~royston/codsen/commits/c5ee4a61e9436099b0e20d20bca043c1b2c93f55))

### Features

- add `innerObj.parentKey` ([cc4ff6e](https://git.sr.ht/~royston/codsen/commits/cc4ff6ef6007f144574a29f9c42783462459cacc))
- Add a new key, parentType in a callback innerObj ([6e16b99](https://git.sr.ht/~royston/codsen/commits/6e16b996bc6d15319403d4ad6ab3e8eda15c249a))
- Add one more tag before which there will be a line break ([4f00871](https://git.sr.ht/~royston/codsen/commits/4f008715dcc2de7b2b52b67ce2e27728d5ffec37))
- Initial release ([4f35bfb](https://git.sr.ht/~royston/codsen/commits/4f35bfb167e54b1a0e5e8f01871293b262c67a76))
- stopping functionality ([ca17aa1](https://git.sr.ht/~royston/codsen/commits/ca17aa105824d1dc26bd2a23eae6a3c5aa2a5f24))

## 1.12.0 (2019-11-27)

### Features

- stopping functionality ([ca17aa1](https://gitlab.com/codsen/codsen/commit/ca17aa105824d1dc26bd2a23eae6a3c5aa2a5f24))

## 1.11.0 (2019-01-31)

### Features

- Add a new key, `parentType` in a callback `innerObj` ([6e16b99](https://gitlab.com/codsen/codsen/commit/6e16b99))

## 1.10.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 1.4.0 (2018-10-13)

- ✨ Updated all dependencies and restored coverage tracking both via terminal when testing and through coveralls.io

## 1.3.0 (2018-06-11)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis
- ✨ Removed `package-lock`

## 1.2.0 (2018-05-02)

- ✨ Set up [Prettier](https://prettier.io)
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove from production code.

## 1.1.0 (2018-01-03)

- ✨ New key in the `innerObj` callback - `innerObj.path`. It's interoperable with [object-path](https://www.npmjs.com/package/object-path).

## 1.0.1 (2017-12-22)

- ✨ First public release.
