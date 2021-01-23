# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 2.0.0 (2021-01-23)


### Bug Fixes

* require that tag name would not be followed by equal sign ([68debb1](https://github.com/codsen/codsen/commit/68debb1243dd01b30a91c4761626c2852149df1a))


### Features

* add more tests and finally fix the dashes in front of tag names ([17caba6](https://github.com/codsen/codsen/commit/17caba60fb7b1b896a6b125652edde23735e732d))
* add one more type of char arrangement - slash in front, confirmed tag name follows ([1a05137](https://github.com/codsen/codsen/commit/1a05137bdd084e4047fff9312c90d324b6a50b17))
* add type checks and split tests into multiple files ([082f707](https://github.com/codsen/codsen/commit/082f707d86e58ab920cb3de7cac0aa4ea09de834))
* improve the algorithm to include way more broken tag cases ([2e3e365](https://github.com/codsen/codsen/commit/2e3e365135f8c70946339b9e86575c944b4d2fa7))
* improve the broken tag recognition, set up more exhaustive tests ([8b4b64e](https://github.com/codsen/codsen/commit/8b4b64e4265a536c99979f9d4043aac4e5797d19)), closes [#1](https://github.com/codsen/codsen/issues/1)
* init ([bd8693f](https://github.com/codsen/codsen/commit/bd8693f97aaa88260bea6c3cb10860411f3a3bfa))
* loosen the requirements for the character that follows recognised tag name sequence ([acbba3b](https://github.com/codsen/codsen/commit/acbba3b7494ef8e6ba7675ef25e796a9505cc56b))
* make the requirements more strict for when opening bracket is missing ([b7f518c](https://github.com/codsen/codsen/commit/b7f518ca78b0fde2d74040418aa6f535c420812b))
* opts.allowCustomTagNames ([86c0647](https://github.com/codsen/codsen/commit/86c0647effe975c6d958a1f0467a22f5692e1f2b))
* opts.skipOpeningBracket ([71750a5](https://github.com/codsen/codsen/commit/71750a5a67e1a86ba70e08a6df30518b1fb731d5))
* recognise any html tags which start with bracket followed by a known tag name ([b344e1c](https://github.com/codsen/codsen/commit/b344e1cd8e61739f97bf110004604c6b0a8f4571))
* recognise tags that have attributes with no quotes ([9d08723](https://github.com/codsen/codsen/commit/9d0872314a57a8497dbacbd359d63f00959b34a9))
* recognise unknown html attributes with dashes ([8471709](https://github.com/codsen/codsen/commit/84717095d879b666f450d92769e1abe85ca8baf4))
* require that tag names matched if !opts.allowCustomTagNames ([5572e4c](https://github.com/codsen/codsen/commit/5572e4c52d85c5bcc57d632c2c11f83bde5b1b57))
* require that tag names would not start with a dash (messes up broken comment tag logic) ([eab2823](https://github.com/codsen/codsen/commit/eab2823bf7f069bdd7285c075399c79dfd08fc13))
* rewrite in TS, start using named exports ([7842225](https://github.com/codsen/codsen/commit/7842225bff3505a6c154a2f80089e2ae6a9aedc1))


### Performance Improvements

* improve from 1.91 opts/sec to 186.179 opts/sec in one branch ([b177fee](https://github.com/codsen/codsen/commit/b177fee855ba14e2a19f3aeca7dabe174ea5c396))


### BREAKING CHANGES

* previously: "import isOpening from ..." - now "import { isOpening } from ..."





## 1.10.1 (2020-12-15)

### Performance Improvements

- improve from 1.91 opts/sec to 186.179 opts/sec in one branch ([eadc8ee](https://git.sr.ht/~royston/codsen/commit/eadc8eeabb6d2ddbd3fb0fdbaef50aab0608e3c3))

## 1.10.0 (2020-12-13)

### Features

- improve the broken tag recognition, set up more exhaustive tests ([811a166](https://git.sr.ht/~royston/codsen/commit/811a16616851db6b379966de6da7c99c5b36f195)), closes [#1](https://git.sr.ht/~royston/codsen/issues/1)

## 1.9.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 1.8.0 (2020-09-07)

### Features

- add type checks and split tests into multiple files ([6a40e8b](https://gitlab.com/codsen/codsen/commit/6a40e8bb4c70b85fd7301b69379091b4b2dd8172))

## 1.7.0 (2020-03-16)

### Bug Fixes

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

- ✨ First public release
