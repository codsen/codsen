# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 3.0.0 (2020-11-28)

### Bug Fixes

- Fix the Create New Issue URLs ([c5ee4a6](https://git.sr.ht/~royston/codsen/commits/c5ee4a61e9436099b0e20d20bca043c1b2c93f55))
- fix the regression of letters in front of digits not causing a bailout ([d141967](https://git.sr.ht/~royston/codsen/commits/d14196750fa3b83d049bbd573fe0851ef150120f))

### Features

- Add one more tag before which there will be a line break ([4f00871](https://git.sr.ht/~royston/codsen/commits/4f008715dcc2de7b2b52b67ce2e27728d5ffec37))
- Add perf measurement, recording and historic comparison ([83b2bee](https://git.sr.ht/~royston/codsen/commits/83b2bee64cee548fdbc5b69bff6fa40cd394e052))
- Initial release ([4f35bfb](https://git.sr.ht/~royston/codsen/commits/4f35bfb167e54b1a0e5e8f01871293b262c67a76))
- Merge modes via opts.mergeType ([7fb1c5f](https://git.sr.ht/~royston/codsen/commits/7fb1c5f319aa41ea54c68eed004ab2dfdc7425bf))
- Perf improvements due to more relaxed API - now skips excessive input arg validations ([a50e46f](https://git.sr.ht/~royston/codsen/commits/a50e46f9670b5fd3a514959d75cefa3499ad0444))

### BREAKING CHANGES

- Second input argument, progressFn, was moved into opts.progressFn and opts was
placed into second input argument instead

## 2.1.27 (2019-12-14)

### Bug Fixes

- fix the regression of letters in front of digits not causing a bailout ([d141967](https://gitlab.com/codsen/codsen/commit/d14196750fa3b83d049bbd573fe0851ef150120f))

## 2.1.0 (2019-06-29)

### Features

- Add perf measurement, recording and historic comparison ([83b2bee](https://gitlab.com/codsen/codsen/commit/83b2bee))
- Perf improvements due to more relaxed API - now skips excessive input arg validations ([a50e46f](https://gitlab.com/codsen/codsen/commit/a50e46f))

## 1.3.0 (2018-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 1.1.0 (2018-12-14)

- ✨ Restore ava linting
- ✨ General setup refresh

## 1.0.0 (2018-10-11)

- ✨ Initial release
