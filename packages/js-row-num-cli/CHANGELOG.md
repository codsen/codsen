# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 1.8.0 (2021-01-23)


### Bug Fixes

* Fix the Create New Issue URLs ([f5a41bf](https://github.com/codsen/codsen/commit/f5a41bf16fd8f43de7f8e7de68da562821ddb960))
* update to the latest meow v4 api - fixes aliases ([c4c17cd](https://github.com/codsen/codsen/commit/c4c17cd9e4bb90d991fb2b3ec79b6cf6df4e7cc3))


### Features

* -t flag ([15e51fb](https://github.com/codsen/codsen/commit/15e51fbd23ccecd734bded4b2a206d233fe3a4a9))
* Add one more tag before which there will be a line break ([d178203](https://github.com/codsen/codsen/commit/d1782036b134102fd552d38d2d4f39c93195620b))
* atomic file write ([c6b5f28](https://github.com/codsen/codsen/commit/c6b5f281df88e251060803620210d8e836692827))
* improved messages when zero files found + promisified write function ([0035dcc](https://github.com/codsen/codsen/commit/0035dcca4d0f846e68b0d5bd2b1f92c1d3582685))
* Initial release ([8db2df9](https://github.com/codsen/codsen/commit/8db2df9fb08d66cf6c7a75a57cdcd15a5ec12c1c))





## 1.7.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

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
