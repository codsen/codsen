# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 3.0.0 (2020-11-28)

### Bug Fixes

- Fix the Create New Issue URLs ([c5ee4a6](https://git.sr.ht/~royston/codsen/commits/c5ee4a61e9436099b0e20d20bca043c1b2c93f55))

### Features

- Add one more tag before which there will be a line break ([4f00871](https://git.sr.ht/~royston/codsen/commits/4f008715dcc2de7b2b52b67ce2e27728d5ffec37))
- If ranges exceed reference string length, result is cropped (as opposed to error) ([c05d954](https://git.sr.ht/~royston/codsen/commits/c05d95412e0d24858e264b96f9ac83856cac8a7d))
- Initial release ([4f35bfb](https://git.sr.ht/~royston/codsen/commits/4f35bfb167e54b1a0e5e8f01871293b262c67a76))
- Merge modes via opts.mergeType ([7fb1c5f](https://git.sr.ht/~royston/codsen/commits/7fb1c5f319aa41ea54c68eed004ab2dfdc7425bf))
- null instead of ranges array produces whole input string ([e3ff153](https://git.sr.ht/~royston/codsen/commits/e3ff1535d64e36f568c62ee634e1dc2241b9d7b4))
- opts.skipChecks and precautionary measures when it's on ([b129666](https://git.sr.ht/~royston/codsen/commits/b129666500cbb3f3d680f1584afdbf348106dc07))

### Performance Improvements

- remove check-types-mini and ordinal numbers dependencies ([e62326c](https://git.sr.ht/~royston/codsen/commits/e62326c1bfb1ad92504749e5071982641899894d))

### BREAKING CHANGES

- Second input argument, progressFn, was moved into opts.progressFn and opts was
placed into second input argument instead

## 2.1.22 (2019-10-02)

### Performance Improvements

- remove check-types-mini and ordinal numbers dependencies ([e62326c](https://gitlab.com/codsen/codsen/commit/e62326c))

## 2.1.0 (2019-06-01)

### Features

- If ranges exceed reference string length, result is cropped (as opposed to error) ([c05d954](https://gitlab.com/codsen/codsen/commit/c05d954))
- null instead of ranges array produces whole input string ([e3ff153](https://gitlab.com/codsen/codsen/commit/e3ff153))
- opts.skipChecks and precautionary measures when it's on ([b129666](https://gitlab.com/codsen/codsen/commit/b129666))

## 1.4.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 1.1.0 (2018-10-25)

- ✨ Updated all dependencies
- ✨ Restored coveralls.io reporting
- ✨ Restored unit test linting

## 1.0.0 (2018-06-09)

- ✨ Initial release
