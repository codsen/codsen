# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 4.0.0 (2022-12-01)

### BREAKING CHANGES

- Minimum supported Node version is v14.18; we're dropping v12 support

## 3.1.0 (2022-08-12)

### Features

- export types ([dd81890](https://github.com/codsen/codsen/commit/dd81890caac1b1d7828065ec27d13d59afd876a5))
- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

## 3.0.15 (2022-04-18)

### Fixed

- tweak types ([6e721d2](https://github.com/codsen/codsen/commit/6e721d2872d07182718d0ab4e54e213e62a88b17))

## 3.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS `require()`

## 2.1.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 2.0.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 2.0.9 (2021-03-23)

### Fixed

- address the `opts.allowCustomTagNames` in context of malformed closing tags ([0a785fa](https://github.com/codsen/codsen/commit/0a785faa2a0e7821007fa9c9665bc247ac4cc6b2))
- better detection of missing opening bracket when slash + known tag name follows ([b569953](https://github.com/codsen/codsen/commit/b56995356d6b449851ba1fc4a9e4e1b7bc220770))

## 2.0.1 (2021-01-28)

### Fixed

- add `testStats` to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 2.0.0 (2021-01-23)

### Features

- rewrite in TS, start using named exports ([7842225](https://github.com/codsen/codsen/commit/7842225bff3505a6c154a2f80089e2ae6a9aedc1))

### BREAKING CHANGES

- previously, you'd consume like: `import isOpening from ...` - now `import { isOpening } from ...`

## 1.10.1 (2020-12-15)

### Performance Improvements

- improve from 1.91 opts/sec to 186.179 opts/sec in one branch ([eadc8ee](https://git.sr.ht/~royston/codsen/commit/eadc8eeabb6d2ddbd3fb0fdbaef50aab0608e3c3))

## 1.10.0 (2020-12-13)

### Features

- improve the broken tag recognition, set up more exhaustive tests ([811a166](https://git.sr.ht/~royston/codsen/commit/811a16616851db6b379966de6da7c99c5b36f195)), closes [#1](https://git.sr.ht/~royston/codsen/issues/1)

## 1.9.0 (2020-11-28)

Accidental version bump during migration to SourceHut. Sorry about that.

## 1.8.0 (2020-09-07)

### Features

- add type checks and split tests into multiple files ([6a40e8b](https://gitlab.com/codsen/codsen/commit/6a40e8bb4c70b85fd7301b69379091b4b2dd8172))

## 1.7.0 (2020-03-16)

### Fixed

- require that tag name would not be followed by equal sign ([9081082](https://gitlab.com/codsen/codsen/commit/9081082c8f0a4142c6c4941405b4b1b400d1e390))

### Features

- add more tests and finally fix the dashes in front of tag names ([2a36483](https://gitlab.com/codsen/codsen/commit/2a364831c4ba9c4ab86955d00ee0a458826eb04d))
- make the requirements more strict for when opening bracket is missing ([a672d99](https://gitlab.com/codsen/codsen/commit/a672d9966d28c65cb17c2d50bcd49e398982d967))
- `opts.skipOpeningBracket` ([6238e92](https://gitlab.com/codsen/codsen/commit/6238e923ddc1ca3e67d099134ffb1e3ca775d899))
- require that tag names matched if !opts.allowCustomTagNames ([0638865](https://gitlab.com/codsen/codsen/commit/0638865efe5c27429820e2cf4a64faee2ba35077))
- require that tag names would not start with a dash (messes up broken comment tag logic) ([e0ff061](https://gitlab.com/codsen/codsen/commit/e0ff061531e3e9de6ca86aa3055b255edb085b17))

## 1.6.0 (2020-02-09)

### Features

- `opts.allowCustomTagNames` ([1771e43](https://gitlab.com/codsen/codsen/commit/1771e431a356f96a745befdbfc7cdd5a9329b296))

## 1.5.0 (2019-12-27)

### Features

- recognise tags that have attributes with no quotes ([cfe677c](https://gitlab.com/codsen/codsen/commit/cfe677cf76c23a9a27ddd2f3fb6533cf7b366621))

## 1.4.0 (2019-12-21)

### Features

- recognise unknown html attributes with dashes ([d13d043](https://gitlab.com/codsen/codsen/commit/d13d043a22f4bc25f8d4fba627fce04c8d06baeb))

## 1.3.0 (2019-12-14)

### Features

- add one more type of char arrangement - slash in front, confirmed tag name follows ([8d1ecc9](https://gitlab.com/codsen/codsen/commit/8d1ecc913457ebce02a3b1559ddcb8726ab1284a))

## 1.2.0 (2019-11-18)

### Features

- improve the algorithm to include way more broken tag cases ([fd94b61](https://gitlab.com/codsen/codsen/commit/fd94b61d39c1a4e4e0275e4e57cbde4b884db4c1))
- loosen the requirements for the character that follows recognised tag name sequence ([6201e2b](https://gitlab.com/codsen/codsen/commit/6201e2b8a2048a64239bcf4893404eeaba3b3d2b))

## 1.1.0 (2019-11-02)

### Features

- init ([04dfb3b](https://gitlab.com/codsen/codsen/commit/04dfb3b1937ad472a6ed615e8ca479a37f8cb9bb))
- recognise any html tags which start with bracket followed by a known tag name ([3ac6327](https://gitlab.com/codsen/codsen/commit/3ac6327d2258a36322dc6d5411cb3b1dad392d3e))

## 1.0.0 (2019-11-01)

- First public release
