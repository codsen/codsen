# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.7.9](https://gitlab.com/codsen/codsen/compare/is-html-tag-opening@1.7.8...is-html-tag-opening@1.7.9) (2020-05-11)

**Note:** Version bump only for package is-html-tag-opening





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
