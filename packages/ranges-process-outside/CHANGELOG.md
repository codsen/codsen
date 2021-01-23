# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 4.0.0 (2021-01-23)


### Bug Fixes

* Fix the Create New Issue URLs ([f5a41bf](https://github.com/codsen/codsen/commit/f5a41bf16fd8f43de7f8e7de68da562821ddb960))


### Features

* Change of the API - ranges are inverted and each character called via cb() ([722382c](https://github.com/codsen/codsen/commit/722382c8aa523c13a5f6d321b6e353343bda7029))
* Initial release ([318aaac](https://github.com/codsen/codsen/commit/318aaac22ff2736cf16904ccdb144f6ddbf2eea9))
* Merge modes via opts.mergeType ([2394464](https://github.com/codsen/codsen/commit/2394464976ce1970bcd31b45d9fd9955f4bbcc09))
* Offsets ([3f36ac4](https://github.com/codsen/codsen/commit/3f36ac4598a92907acc6dc966a5370004392445d))
* rewrite in TS, start using named exports ([292a653](https://github.com/codsen/codsen/commit/292a653459851cdc03a9efdf476fafcfeb6cff46))
* support for emoji ([ae063a4](https://github.com/codsen/codsen/commit/ae063a438540f7ad42b8427e4313237d7241acc3))


### BREAKING CHANGES

* previously you'd consume like: "import rProcessOutside from ..." - now: "import {
rProcessOutside } from ..."
* Second input argument, progressFn, was moved into opts.progressFn and opts was
placed into second input argument instead





## 3.0.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 2.2.0 (2019-08-18)

### Features

- support for emoji ([825fae5](https://gitlab.com/codsen/codsen/commit/825fae5))

## 2.1.0 (2019-06-01)

### Features

- Change of the API - ranges are inverted and each character called via cb() ([cd2e2be](https://gitlab.com/codsen/codsen/commit/cd2e2be))
- Offsets ([7ae4a8c](https://gitlab.com/codsen/codsen/commit/7ae4a8c))

## 1.0.0 (2018-01-23)

- ✨ Initial release
