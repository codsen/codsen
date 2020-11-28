# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 1.7.0 (2020-11-28)

### Bug Fixes

- Fix the Create New Issue URLs ([c5ee4a6](https://git.sr.ht/~royston/codsen/commits/c5ee4a61e9436099b0e20d20bca043c1b2c93f55))
- update to the latest meow v4 api - fixes aliases ([5a0a098](https://git.sr.ht/~royston/codsen/commits/5a0a098a3dd372f6147750d161f4fea7f1f81ef4))

### Features

- -t flag ([a9432cf](https://git.sr.ht/~royston/codsen/commits/a9432cf6c683644477ea5225119b76968dfcbe63))
- Add one more tag before which there will be a line break ([4f00871](https://git.sr.ht/~royston/codsen/commits/4f008715dcc2de7b2b52b67ce2e27728d5ffec37))
- atomic file write ([b9a3c2b](https://git.sr.ht/~royston/codsen/commits/b9a3c2b9daa5d54457f34065b1dd156c8436a7ea))
- improved messages when zero files found + promisified write function ([83d2bee](https://git.sr.ht/~royston/codsen/commits/83d2beea6f2fa0c19ada02f99bfbab550b7e6dab))
- Initial release ([4f35bfb](https://git.sr.ht/~royston/codsen/commits/4f35bfb167e54b1a0e5e8f01871293b262c67a76))

## 1.6.7 (2019-11-20)

### Bug Fixes

- update to the latest meow v4 api - fixes aliases ([5a0a098](https://gitlab.com/codsen/codsen/commit/5a0a098a3dd372f6147750d161f4fea7f1f81ef4))

## 1.6.0 (2019-10-05)

### Features

- -t flag ([a9432cf](https://gitlab.com/codsen/codsen/commit/a9432cf))

## 1.5.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 1.3.0 (2018-12-26)

- ✨ Implement **atomic file write** ([b9a3c2b](https://gitlab.com/codsen/codsen/tree/master/packages/js-row-num-cli/commits/b9a3c2b))
- ✨ Improved messages when zero files found + promisified write function ([83d2bee](https://gitlab.com/codsen/codsen/tree/master/packages/js-row-num-cli/commits/83d2bee))

## 1.2.0 (2018-09-20)

- ✨ Properly set the message when there were zero files to update
- ✨ Promisified the atomic write function

## 1.1.0 (2018-09-18)

- ✨ Now file writing is done [atomically](https://github.com/npm/write-file-atomic), the write operation now cannot be interrupted or "partially" performed. Practically, this means, it will be not possible to accidentally damage the processed `.js` file there's a clash between other programs (code editors, for example) reading it. I has happened to me in the past that `.js` file accidentally gets written to be blank. No more!
- ✨ Additionally, now we have a check implemented, is the freshly-read `.js` file not blank. If it's blank, nothing is written.

## 1.0.0 (2018-07-12)

- ✨ First public release
