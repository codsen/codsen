# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 7.1.0 (2025-10-15)

### Features

- if value to be added is a number, keep it as is, don't stringify ([ce3e1a5](https://github.com/codsen/codsen/commit/ce3e1a525998ca3c0abf0142affef95b14cd1990))

## 7.0.0 (2022-12-01)

### BREAKING CHANGES

- Minimum supported Node version is v14.18; we're dropping v12 support

## 6.1.0 (2022-08-12)

### Features

- export types ([5172d54](https://github.com/codsen/codsen/commit/5172d540025b4234ca804b657a7c56868b0d29e1))
- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

## 6.0.15 (2022-05-04)

### Fixed

- improve types ([ea1210f](https://github.com/codsen/codsen/commit/ea1210f44efdb0ab205ebe5be3f87d9f8d8562d9))

## 6.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS `require()`

## 5.4.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 5.3.0 (2021-04-11)

### Features

- export the array of all possibly-reported rule names, `allRules` ([7e16a96](https://github.com/codsen/codsen/commit/7e16a966ddbb4bba625b9ce1456d8b2ba10d6f1c))

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 5.2.0 (2021-03-25)

### Features

- improve the matching algorithm when there are competing fixing choices ([ce43906](https://github.com/codsen/codsen/commit/ce43906e3f22bb7590a6b017271c5933ed5a2bf9))

## 5.1.0 (2021-03-23)

### Fixed

- fix a case with entity without semi, reporting of raw amps in front ([8e25561](https://github.com/codsen/codsen/commit/8e25561295ecf944880a2a205eef58313b6a9e68))
- more fixes for `opts.textAmpersandCatcherCb` ([1bbdf3a](https://github.com/codsen/codsen/commit/1bbdf3ab2d338458147c6e442d52a848cf0952b0))
- tend a falsy `opts.cb` ([8626c30](https://github.com/codsen/codsen/commit/8626c308ac5155abd163b5d6ecf52e5e7500c587))
- tweaks for `opts.textAmpersandCatcherCb` ([18d4805](https://github.com/codsen/codsen/commit/18d480571be6108ad5e55208ddf801d95afe3dc7))

### Features

- `opts.textAmpersandCatcherCb` and tweak rule names to conform to emlint better ([27f2518](https://github.com/codsen/codsen/commit/27f251800d8a7d6bd35772eec239d6422ef27141))

## 5.0.1 (2021-01-28)

### Fixed

- add `testStats` to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 5.0.0 (2021-01-23)

### Features

- rewrite in TS, start using named exports ([13b81a3](https://github.com/codsen/codsen/commit/13b81a378ff995fd1e3721c8aa9c6500373fe584))

### BREAKING CHANGES

- previously you'd consume like: `import fixEnt from ...` - now `import { fixEnt } from ...`

## 4.0.0 (2020-11-28)

Accidental version bump during migration to SourceHut. Sorry about that.

## 3.0.0 (2020-05-06)

### Fixed

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

- release `opts.entityCatcherCb` - change it to ping only healthy entities + documentation ([d7a76b2](https://gitlab.com/codsen/codsen/commit/d7a76b2948da41eec6054579b51ad595c07af965))

## 2.4.3 (2019-09-11)

### Fixed

- algorithm tweaks ([fe71a2a](https://gitlab.com/codsen/codsen/commit/fe71a2a))
- treat clean nbsp sequences correctly ([061de0d](https://gitlab.com/codsen/codsen/commit/061de0d))

## 2.4.0 (2019-08-24)

### Fixed

- fix &prnsim to be recognised correctly ([fd4df75](https://gitlab.com/codsen/codsen/commit/fd4df75))
- further named entity recognition fixes ([feef62b](https://gitlab.com/codsen/codsen/commit/feef62b))
- recognise false positive &nspar and also wire up false-positive array to be checked ([c5d2d2d](https://gitlab.com/codsen/codsen/commit/c5d2d2d))

### Features

- improved recognition of joined named html entities without semicolons ([4aa96f7](https://gitlab.com/codsen/codsen/commit/4aa96f7))

## 2.3.0 (2019-06-01)

### Features

- Algorithm improvements and more unit tests ([23d8596](https://gitlab.com/codsen/codsen/commit/23d8596))
- Avoid false positives when adding missing ampersand onto named HTML entities ([5b48388](https://gitlab.com/codsen/codsen/commit/5b48388))
- Loosen amp fixes when ampersand is present ([49238ff](https://gitlab.com/codsen/codsen/commit/49238ff))
- Make fixing algorithm more conservative, tap the list of uncertain entities ([1806c12](https://gitlab.com/codsen/codsen/commit/1806c12))
- Move the known adhoc broken entity patterns above all-entity matching part ([c9350fa](https://gitlab.com/codsen/codsen/commit/c9350fa))
- `opts.entityCatcherCb` ([cb77ae9](https://gitlab.com/codsen/codsen/commit/cb77ae9))
- Programmatic tests to cover entity letter case errors and making them pass ([f3dc471](https://gitlab.com/codsen/codsen/commit/f3dc471))
- Supports numeric entities, both decimal and hex ([d07d5c4](https://gitlab.com/codsen/codsen/commit/d07d5c4))
- wrong case and whitespace recognition on all named HTML entities ([942d2cf](https://gitlab.com/codsen/codsen/commit/942d2cf))

## 2.2.0 (2019-04-06)

### Fixed

- Align nbsp missing semicol error with other entities, use -malformed-nbsp ([12420e5](https://gitlab.com/codsen/codsen/commit/12420e5))
- Before recoding missing semicolon check part ([ad3394f](https://gitlab.com/codsen/codsen/commit/ad3394f))
- Checks for all named HTML entities, missing ampersands or semicolon recognition ([7762556](https://gitlab.com/codsen/codsen/commit/7762556))
- Full support of all named HTML entities - missing semicolons or ampersands ([c0b92c5](https://gitlab.com/codsen/codsen/commit/c0b92c5))
- Rebase to use all-named-html-entities instead of plain list array of entities ([434945a](https://gitlab.com/codsen/codsen/commit/434945a))
- Rudimentary protection against CSS false positive display:block ([8c14b90](https://gitlab.com/codsen/codsen/commit/8c14b90))
- Separate numeric entities for releases later ([1942303](https://gitlab.com/codsen/codsen/commit/1942303))

## 2.1.0 (2019-03-17)

### Fixed

- Properly recognise false cases for double-encoded entity scenarios ([0b3eed2](https://gitlab.com/codsen/codsen/commit/0b3eed2))

### Features

- Algorithm improvements ([daa1149](https://gitlab.com/codsen/codsen/commit/daa1149))
- Improvements to recognise malformed entities and multiple encoding ([1ef1698](https://gitlab.com/codsen/codsen/commit/1ef1698))

## 2.0.0 (2019-03-04)

### Features

- Make `opts.progressFn` + `opts.decode` combo to be more precise ([f599a29](https://gitlab.com/codsen/codsen/commit/f599a29))
- Add `opts.cb` ([8f34d1c](https://gitlab.com/codsen/codsen/commit/8f34d1c))
- Add `opts.progressFn` ([869e3f0](https://gitlab.com/codsen/codsen/commit/869e3f0))

## 1.6.0 (2019-01-27)

- Add `opts.decode` ([ae22fea](https://gitlab.com/codsen/codsen/tree/master/packages/string-fix-broken-named-entities/commits/ae22fea))

## 1.4.0 (2019-01-20)

- Various documentation and setup tweaks after we migrated to monorepo
- Setup refresh: updated dependencies and all config files using automated tools

## 1.1.0 (2018-10-25)

- Update all dependencies
- Restore coveralls.io reporting
- Restore unit test linting

## 1.0.0 (2018-08-29)

- First public release
