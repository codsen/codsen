# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 4.0.0 (2020-11-28)


### Bug Fixes

* algorithm tweaks ([fe71a2a](https://git.sr.ht/~royston/codsen/commits/fe71a2a485c687c296648d88d38fea8e1daa94dc))
* Align nbsp missing semicol error with other entities, use -malformed-nbsp ([12420e5](https://git.sr.ht/~royston/codsen/commits/12420e5b4a606012df0a2edf2b09940ddf676d09))
* fix &prnsim to be recognised correctly ([fd4df75](https://git.sr.ht/~royston/codsen/commits/fd4df75cf10703e2749c2e47bfaa947d27dec474))
* Fix the Create New Issue URLs ([c5ee4a6](https://git.sr.ht/~royston/codsen/commits/c5ee4a61e9436099b0e20d20bca043c1b2c93f55))
* further named entity recognition fixes ([feef62b](https://git.sr.ht/~royston/codsen/commits/feef62bea677f5106e068dbba045a2968aa86986))
* measure distance on more lenient Levenshtein l=2 by source entity which is present ([afb99d6](https://git.sr.ht/~royston/codsen/commits/afb99d681813bd9c13d53b7ab3b6d3bb1ac5539f))
* Properly recognise false cases for double-encoded entity scenarios ([0b3eed2](https://git.sr.ht/~royston/codsen/commits/0b3eed200c18d1a11b347192fe775d0c04093261))
* recognise false positive &nspar and also wire up false-positive array to be checked ([c5d2d2d](https://git.sr.ht/~royston/codsen/commits/c5d2d2d1f8badb6b08052dfddc9d4666849984fe))
* treat clean nbsp sequences correctly ([061de0d](https://git.sr.ht/~royston/codsen/commits/061de0d62ae2aedfd96e7c5c124b2652571576e0))


### Features

* add more eslint rules and make them pass, rebase a little as well ([6e5e19f](https://git.sr.ht/~royston/codsen/commits/6e5e19ff3487e35dda79ad0a03e2117bc759c05d))
* Add one more tag before which there will be a line break ([4f00871](https://git.sr.ht/~royston/codsen/commits/4f008715dcc2de7b2b52b67ce2e27728d5ffec37))
* Add opts.decode ([ae22fea](https://git.sr.ht/~royston/codsen/commits/ae22feae9ce42315c8e6fd1047da7ef5108d7bf0))
* Algorithm improvements ([daa1149](https://git.sr.ht/~royston/codsen/commits/daa1149fdee75c9e0bb115555784b106f23042c7))
* Algorithm improvements - WIP - 7 tests failing ([40f0a5d](https://git.sr.ht/~royston/codsen/commits/40f0a5d771120bcd57aa7b60da4541a7c9051392))
* Algorithm improvements and more unit tests ([23d8596](https://git.sr.ht/~royston/codsen/commits/23d85967f95d04f637e0ae088cc607939175fac6))
* Avoid false positives when adding missing ampersand onto named HTML entities ([5b48388](https://git.sr.ht/~royston/codsen/commits/5b4838841f1fbc0b2617d04cf12424b85c171811))
* Before recoding missing semicolon check part ([ad3394f](https://git.sr.ht/~royston/codsen/commits/ad3394f2284d6fe656f6f458ee3ef74b8d0e680b))
* big refactor, levenshtein on all entities, more tests ([671dd5e](https://git.sr.ht/~royston/codsen/commits/671dd5e5b157e0f0419e438ed9113ebcb788133b))
* Checks for all named HTML entities, missing ampersands or semicolon recognition ([7762556](https://git.sr.ht/~royston/codsen/commits/7762556f551711db3717e30cafd8c65456986ae2))
* Full support of all named HTML entities - missing semicolons or ampersands ([c0b92c5](https://git.sr.ht/~royston/codsen/commits/c0b92c5495341f29d2aceb475fed33f9c80f9335))
* improved recognition of sandwitched named html entities without semicolons ([4aa96f7](https://git.sr.ht/~royston/codsen/commits/4aa96f76396f4a684ce8c5fc13c9a051a274995d))
* Improvements to recognise malformed entities and multiple encoding ([1ef1698](https://git.sr.ht/~royston/codsen/commits/1ef1698b7e0dc9935e994963ec540e4b4df6c98e))
* Initial release ([4f35bfb](https://git.sr.ht/~royston/codsen/commits/4f35bfb167e54b1a0e5e8f01871293b262c67a76))
* Loosen amp fixes when ampersand is present ([49238ff](https://git.sr.ht/~royston/codsen/commits/49238ffe31e66c2cf3e4fb380660f99a6a494103))
* Make fixing algorithm more conservative, tap the list of uncertain entities ([1806c12](https://git.sr.ht/~royston/codsen/commits/1806c12fa8aa4e317d1d24b58df5752a3c357ff0))
* Make opts.progressFn + opts.decode combo to be more precise ([f599a29](https://git.sr.ht/~royston/codsen/commits/f599a29cfd740e850b64b58c7da9bdbc1047e54c))
* Merge modes via opts.mergeType ([7fb1c5f](https://git.sr.ht/~royston/codsen/commits/7fb1c5f319aa41ea54c68eed004ab2dfdc7425bf))
* Missing semicolon recognition on all entities - WIP - 8 failing ([31170b2](https://git.sr.ht/~royston/codsen/commits/31170b2cf0c37d9b3e0ccc47cd9e1230f1155310))
* Move the known adhoc broken entity patterns above all-entity matching part ([c9350fa](https://git.sr.ht/~royston/codsen/commits/c9350fa625b40d6bd446e641fa87f223051129fa))
* opts.cb ([8f34d1c](https://git.sr.ht/~royston/codsen/commits/8f34d1c0224dabf80820323a8a24fdc903e7821e))
* opts.entityCatcherCb ([cb77ae9](https://git.sr.ht/~royston/codsen/commits/cb77ae9ec6c3cdd0b53fa5cf5ea01256e549e081))
* opts.progressFn ([869e3f0](https://git.sr.ht/~royston/codsen/commits/869e3f0b0d4d3b598f7a5ec202d02140583cbff9))
* Programmatic tests to cover entity letter case errors and making them pass ([f3dc471](https://git.sr.ht/~royston/codsen/commits/f3dc47185fc4e3e5600d3913f8eb245497078444))
* Rebase to use all-named-html-entities instead of plain list array of entities ([434945a](https://git.sr.ht/~royston/codsen/commits/434945a5ec34bc6c5faeb60fda4cc5dc23a930e5))
* release opts.entityCatcherCb - change it to ping only healthy entities + documentation ([d7a76b2](https://git.sr.ht/~royston/codsen/commits/d7a76b2948da41eec6054579b51ad595c07af965))
* Rudimentary protection against CSS false positive display:block ([8c14b90](https://git.sr.ht/~royston/codsen/commits/8c14b90fe69999d266f6465a90a656cf33028272))
* Separate numeric entities for releases later ([1942303](https://git.sr.ht/~royston/codsen/commits/194230390fc234ba1552ecba6d1786141e96387b))
* Supports numeric entities, both decimal and hex ([d07d5c4](https://git.sr.ht/~royston/codsen/commits/d07d5c4db4ee17fd7fbbefb778b8043a21e0a3c4))
* WIP - 10 tests failing ([92237cd](https://git.sr.ht/~royston/codsen/commits/92237cd8d2ee01133941db79545ed8746e0fd370))
* WIP - 11 tests failing ([695a9e9](https://git.sr.ht/~royston/codsen/commits/695a9e99dc8dd2b5392bd0151e392fb0298c9492))
* WIP - 3 failing ([40db536](https://git.sr.ht/~royston/codsen/commits/40db536a4919415f8b142412e5e78e83fb849478))
* WIP - 4 failing ([82aee92](https://git.sr.ht/~royston/codsen/commits/82aee929d88e80b8c3e8429dafd7e9e3ab75c116))
* WIP - 5 failing ([910f983](https://git.sr.ht/~royston/codsen/commits/910f9830b9ca074afec5a8e5a708249cec526c72))
* WIP - callback guaranteed to always match non-callback result ([2ac4c60](https://git.sr.ht/~royston/codsen/commits/2ac4c600649646ea06bd8ea683ca74e0f2cc09fa))
* WIP - improvements to malformed nbsp and multiple encoding recognition ([dc6c5e6](https://git.sr.ht/~royston/codsen/commits/dc6c5e67f3646e6c18bbfbe1308462975a14ce39))
* WIP - rebasing, aiming to support missing semicols or ampersands on all entities ([271e5ee](https://git.sr.ht/~royston/codsen/commits/271e5ee08c47d7d995103b04be86dd67e85d76fe))
* wrong case and whitespace recognition on all named HTML entities ([942d2cf](https://git.sr.ht/~royston/codsen/commits/942d2cf80126a2ae7f8f0dea4d23b7d2f724da6f))


### Performance Improvements

* beef up code sample used in perf tests to cover more cases + wipe historical perf records ([39998c6](https://git.sr.ht/~royston/codsen/commits/39998c6073d0f89aa74444da393f942868fe6c49))


### BREAKING CHANGES

* less of crazy nbsp cases will be covered, essentially nbsp's from now on are like
all other entities - treated the same
* Second input argument, progressFn, was moved into opts.progressFn and opts was
placed into second input argument instead





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
