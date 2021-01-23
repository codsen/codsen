# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 5.0.0 (2021-01-23)


### Bug Fixes

* algorithm tweaks ([22801a3](https://github.com/codsen/codsen/commit/22801a3ed8234d291087896c675cb3acd75d60cf))
* Align nbsp missing semicol error with other entities, use -malformed-nbsp ([5e2b8e5](https://github.com/codsen/codsen/commit/5e2b8e5ae67b0bfabcc67735a9859e35e79949b3))
* fix &prnsim to be recognised correctly ([0193928](https://github.com/codsen/codsen/commit/01939289fa39ca48a701b55b2d5b68cfc47e261c))
* Fix the Create New Issue URLs ([f5a41bf](https://github.com/codsen/codsen/commit/f5a41bf16fd8f43de7f8e7de68da562821ddb960))
* further named entity recognition fixes ([29ff75a](https://github.com/codsen/codsen/commit/29ff75a43e15977ca3dc7b528a7b74231d8aa678))
* measure distance on more lenient Levenshtein l=2 by source entity which is present ([f31e5e7](https://github.com/codsen/codsen/commit/f31e5e7d3856ac149e82f14f1f942e1a99442ac7))
* Properly recognise false cases for double-encoded entity scenarios ([19f25fa](https://github.com/codsen/codsen/commit/19f25fa79fea5406ed5ac68d28725479b6c86a07))
* recognise false positive &nspar and also wire up false-positive array to be checked ([520e092](https://github.com/codsen/codsen/commit/520e092cd899a03c93c408a8c982cbcadbf7ca99))
* treat clean nbsp sequences correctly ([b19a1cd](https://github.com/codsen/codsen/commit/b19a1cd6b4bb8d647362b0333ceebf8bacd06f33))


### Features

* add more eslint rules and make them pass, rebase a little as well ([5b2d18d](https://github.com/codsen/codsen/commit/5b2d18db42671aa534109da275ee4e34cb143957))
* Add one more tag before which there will be a line break ([d178203](https://github.com/codsen/codsen/commit/d1782036b134102fd552d38d2d4f39c93195620b))
* Add opts.decode ([88b99dc](https://github.com/codsen/codsen/commit/88b99dc1f12ff0bd4a71069ae2292712d8cbceca))
* Algorithm improvements ([f29322f](https://github.com/codsen/codsen/commit/f29322fe5c07f4457fe8cc3d676d236b0c3317e9))
* Algorithm improvements - WIP - 7 tests failing ([2e579e6](https://github.com/codsen/codsen/commit/2e579e68cd91672727b69e726812021eba4c3e22))
* Algorithm improvements and more unit tests ([7f06397](https://github.com/codsen/codsen/commit/7f063977fa6d661e2ac9664370d0b08862f171b0))
* Avoid false positives when adding missing ampersand onto named HTML entities ([70d7b49](https://github.com/codsen/codsen/commit/70d7b49c30d482676a3961cffb153d879441e051))
* Before recoding missing semicolon check part ([cf19b7e](https://github.com/codsen/codsen/commit/cf19b7ecb365308f282fcf5b13efc813e0373a07))
* big refactor, levenshtein on all entities, more tests ([4bec739](https://github.com/codsen/codsen/commit/4bec7392397540263e2cf13ee0d7a3aac1977c71))
* Checks for all named HTML entities, missing ampersands or semicolon recognition ([3476c9c](https://github.com/codsen/codsen/commit/3476c9c6de215e7dc0260242917e0f8121573ffc))
* Full support of all named HTML entities - missing semicolons or ampersands ([c51f460](https://github.com/codsen/codsen/commit/c51f460a932c82b688a2326feeab64a66b870bd3))
* improved recognition of sandwitched named html entities without semicolons ([2371e05](https://github.com/codsen/codsen/commit/2371e05882aa4b226e9113ae0321a7417300a1fa))
* Improvements to recognise malformed entities and multiple encoding ([c33ca81](https://github.com/codsen/codsen/commit/c33ca81d40a78d6185d91c5ce9e61608bb26a996))
* Initial release ([8db2df9](https://github.com/codsen/codsen/commit/8db2df9fb08d66cf6c7a75a57cdcd15a5ec12c1c))
* Loosen amp fixes when ampersand is present ([6d9cd40](https://github.com/codsen/codsen/commit/6d9cd40a37ed7296729deec1f6f0624cb54f7dac))
* Make fixing algorithm more conservative, tap the list of uncertain entities ([aacc916](https://github.com/codsen/codsen/commit/aacc9166f6ccb1a443f4ef5f1eae17a2e9a52e27))
* Make opts.progressFn + opts.decode combo to be more precise ([0e18ff8](https://github.com/codsen/codsen/commit/0e18ff8e3d736b67ab25db92b20d1bb0cd842d53))
* Merge modes via opts.mergeType ([2394464](https://github.com/codsen/codsen/commit/2394464976ce1970bcd31b45d9fd9955f4bbcc09))
* Missing semicolon recognition on all entities - WIP - 8 failing ([a192516](https://github.com/codsen/codsen/commit/a1925163dace78a194d947b7799ad65be16cc356))
* Move the known adhoc broken entity patterns above all-entity matching part ([4f1d99b](https://github.com/codsen/codsen/commit/4f1d99b3ee1b094003e1a06a0251fe3e0bc8258a))
* opts.cb ([470ad8b](https://github.com/codsen/codsen/commit/470ad8b7a9a7801e7a988e662436ec5f8045f06b))
* opts.entityCatcherCb ([afe0077](https://github.com/codsen/codsen/commit/afe0077a2555f5c646c35ba255368748b25e98c2))
* opts.progressFn ([3f5229c](https://github.com/codsen/codsen/commit/3f5229cfd86d2ae3735fcc22847c40e590d64749))
* Programmatic tests to cover entity letter case errors and making them pass ([70c9ef0](https://github.com/codsen/codsen/commit/70c9ef0e256bcd064f05fc109c8e3f1ebde8c6b7))
* Rebase to use all-named-html-entities instead of plain list array of entities ([819d1a1](https://github.com/codsen/codsen/commit/819d1a1ad70edc2e30db46d8ed209f5be4526b4a))
* release opts.entityCatcherCb - change it to ping only healthy entities + documentation ([1fd29c6](https://github.com/codsen/codsen/commit/1fd29c6d3c05b9ce7af6b51f960304dd9d41b6af))
* rewrite in TS, start using named exports ([13b81a3](https://github.com/codsen/codsen/commit/13b81a378ff995fd1e3721c8aa9c6500373fe584))
* Rudimentary protection against CSS false positive display:block ([5a43c76](https://github.com/codsen/codsen/commit/5a43c7699c418f250e87e75a90fdc494ca31d816))
* Separate numeric entities for releases later ([dda0f5f](https://github.com/codsen/codsen/commit/dda0f5fb63b0551d174771d5faaccb612320a90a))
* Supports numeric entities, both decimal and hex ([3802d9e](https://github.com/codsen/codsen/commit/3802d9e228d3818ceeaf5ed17a389709c1ba3b29))
* WIP - 10 tests failing ([9b73840](https://github.com/codsen/codsen/commit/9b738409a7e2adc98f0544e02fca2dfd5c377037))
* WIP - 11 tests failing ([76bb500](https://github.com/codsen/codsen/commit/76bb500681d91861f73c611c30c26faff44600e7))
* WIP - 3 failing ([1411d50](https://github.com/codsen/codsen/commit/1411d50dee005dea176f3e0bdd8dea231ea2df47))
* WIP - 4 failing ([7a427f0](https://github.com/codsen/codsen/commit/7a427f04d0f1e8dc64bfcb56a53432a103bb9067))
* WIP - 5 failing ([e9aa3c4](https://github.com/codsen/codsen/commit/e9aa3c44e317e52ad3f31cbb61d296d5766d3c81))
* WIP - callback guaranteed to always match non-callback result ([7a86520](https://github.com/codsen/codsen/commit/7a865203e6b2e9ff90488959c43ae3da29671586))
* WIP - improvements to malformed nbsp and multiple encoding recognition ([84479a0](https://github.com/codsen/codsen/commit/84479a09b78782916486a30405535f9dd02e10cb))
* WIP - rebasing, aiming to support missing semicols or ampersands on all entities ([120a7eb](https://github.com/codsen/codsen/commit/120a7eb7951afe3dcc6b91a38ae899869ae4c5e1))
* wrong case and whitespace recognition on all named HTML entities ([96c5db1](https://github.com/codsen/codsen/commit/96c5db1100f581d4214c5c474ca00d9cfa9d71fd))


### Performance Improvements

* beef up code sample used in perf tests to cover more cases + wipe historical perf records ([c74886a](https://github.com/codsen/codsen/commit/c74886afc9d28d8aa968f4b0ea949e21c963b8a9))


### BREAKING CHANGES

* previously you'd consume like: "import fixEnt from ..." - now "import { fixEnt }
from ..."
* less of crazy nbsp cases will be covered, essentially nbsp's from now on are like
all other entities - treated the same
* Second input argument, progressFn, was moved into opts.progressFn and opts was
placed into second input argument instead





## 4.0.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 3.0.0 (2020-05-06)

### Bug Fixes

- measure distance on more lenient Levenshtein l=2 by source entity which is present ([afb99d6](https://gitlab.com/codsen/codsen/commit/afb99d681813bd9c13d53b7ab3b6d3bb1ac5539f))

### Features

- big refactor, levenshtein on all entities, more tests ([671dd5e](https://gitlab.com/codsen/codsen/commit/671dd5e5b157e0f0419e438ed9113ebcb788133b))

### BREAKING CHANGES

- less of crazy nbsp cases will be covered, essentially nbsp's from now on are like
  all other entities - treated the same

## 3.0.0

Rebase.

Previously, the `&nbsp;` detection was more sophisticated than the rest of the entities'. We were using a home-brew analogue of Levenshtein's distance but tuned to all the possible and impossible peculiarities of fat-finger cases.

It was impossible to scale the algorithm to all other entities.

We re-coded all the logic to use Levenshtein distance — **for all entities**, including `nbsp` — and removed all the DIY Levenshtein clauses of `nbsp`

API doesn't change but we bump major because the code has been changed drastically and in theory that opens new opportunities to bugs.

But all existing unit tests pass and more have been added.

## 2.6.0 (2020-04-26)

### Features

- add more eslint rules and make them pass, rebase a little as well ([6e5e19f](https://gitlab.com/codsen/codsen/commit/6e5e19ff3487e35dda79ad0a03e2117bc759c05d))

## 2.5.0 (2019-11-21)

### Features

- release opts.entityCatcherCb - change it to ping only healthy entities + documentation ([d7a76b2](https://gitlab.com/codsen/codsen/commit/d7a76b2948da41eec6054579b51ad595c07af965))

## 2.4.3 (2019-09-11)

### Bug Fixes

- algorithm tweaks ([fe71a2a](https://gitlab.com/codsen/codsen/commit/fe71a2a))
- treat clean nbsp sequences correctly ([061de0d](https://gitlab.com/codsen/codsen/commit/061de0d))

## 2.4.0 (2019-08-24)

### Bug Fixes

- fix &prnsim to be recognised correctly ([fd4df75](https://gitlab.com/codsen/codsen/commit/fd4df75))
- further named entity recognition fixes ([feef62b](https://gitlab.com/codsen/codsen/commit/feef62b))
- recognise false positive &nspar and also wire up false-positive array to be checked ([c5d2d2d](https://gitlab.com/codsen/codsen/commit/c5d2d2d))

### Features

- improved recognition of sandwitched named html entities without semicolons ([4aa96f7](https://gitlab.com/codsen/codsen/commit/4aa96f7))

## 2.3.0 (2019-06-01)

### Features

- Algorithm improvements and more unit tests ([23d8596](https://gitlab.com/codsen/codsen/commit/23d8596))
- Avoid false positives when adding missing ampersand onto named HTML entities ([5b48388](https://gitlab.com/codsen/codsen/commit/5b48388))
- Loosen amp fixes when ampersand is present ([49238ff](https://gitlab.com/codsen/codsen/commit/49238ff))
- Make fixing algorithm more conservative, tap the list of uncertain entities ([1806c12](https://gitlab.com/codsen/codsen/commit/1806c12))
- Move the known adhoc broken entity patterns above all-entity matching part ([c9350fa](https://gitlab.com/codsen/codsen/commit/c9350fa))
- opts.entityCatcherCb ([cb77ae9](https://gitlab.com/codsen/codsen/commit/cb77ae9))
- Programmatic tests to cover entity letter case errors and making them pass ([f3dc471](https://gitlab.com/codsen/codsen/commit/f3dc471))
- Supports numeric entities, both decimal and hex ([d07d5c4](https://gitlab.com/codsen/codsen/commit/d07d5c4))
- wrong case and whitespace recognition on all named HTML entities ([942d2cf](https://gitlab.com/codsen/codsen/commit/942d2cf))

## 2.2.0 (2019-04-06)

### Bug Fixes

- Align nbsp missing semicol error with other entities, use -malformed-nbsp ([12420e5](https://gitlab.com/codsen/codsen/commit/12420e5))
- Before recoding missing semicolon check part ([ad3394f](https://gitlab.com/codsen/codsen/commit/ad3394f))
- Checks for all named HTML entities, missing ampersands or semicolon recognition ([7762556](https://gitlab.com/codsen/codsen/commit/7762556))
- Full support of all named HTML entities - missing semicolons or ampersands ([c0b92c5](https://gitlab.com/codsen/codsen/commit/c0b92c5))
- Rebase to use all-named-html-entities instead of plain list array of entities ([434945a](https://gitlab.com/codsen/codsen/commit/434945a))
- Rudimentary protection against CSS false positive display:block ([8c14b90](https://gitlab.com/codsen/codsen/commit/8c14b90))
- Separate numeric entities for releases later ([1942303](https://gitlab.com/codsen/codsen/commit/1942303))

## 2.1.0 (2019-03-17)

### Bug Fixes

- Properly recognise false cases for double-encoded entity scenarios ([0b3eed2](https://gitlab.com/codsen/codsen/commit/0b3eed2))

### Features

- Algorithm improvements ([daa1149](https://gitlab.com/codsen/codsen/commit/daa1149))
- Improvements to recognise malformed entities and multiple encoding ([1ef1698](https://gitlab.com/codsen/codsen/commit/1ef1698))

## 2.0.0 (2019-03-04)

### Features

- ✨ Make opts.progressFn + opts.decode combo to be more precise ([f599a29](https://gitlab.com/codsen/codsen/commit/f599a29))
- ✨ Add `opts.cb` ([8f34d1c](https://gitlab.com/codsen/codsen/commit/8f34d1c))
- ✨ Add `opts.progressFn` ([869e3f0](https://gitlab.com/codsen/codsen/commit/869e3f0))

## 1.6.0 (2019-01-27)

- ✨ Add opts.decode ([ae22fea](https://gitlab.com/codsen/codsen/tree/master/packages/string-fix-broken-named-entities/commits/ae22fea))

## 1.4.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 1.1.0 (2018-10-25)

- ✨ Update all dependencies
- ✨ Restore coveralls.io reporting
- ✨ Restore unit test linting

## 1.0.0 (2018-08-29)

- ✨ First public release
