# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 3.2.1 (2026-09-06)

### Bug Fixes

- **all-named-html-entities:** generate and verify entity indexes ([64db7e7](https://github.com/codsen/codsen/commit/64db7e715a04c57af3ecbd884d4bdfdb79cbac5d))
- **all-named-html-entities:** generate canonical data from a pinned WHATWG snapshot ([799db7c](https://github.com/codsen/codsen/commit/799db7c0412fbe5e1e3326b59c6ad5bf29af6b91))

### Performance Improvements

- optimise package hot paths and JSON editing ([f3112bd](https://github.com/codsen/codsen/commit/f3112bd7fc0d7c9bc09312d3744c950691d72ca5))

## 3.2.0 (2026-08-19)

### Bug Fixes

- resolve various review findings ([b60e9ee](https://github.com/codsen/codsen/commit/b60e9eeb499af94685cfb87b4970fe025be1fc10))
- retire direct publish aliases ([f98e31e](https://github.com/codsen/codsen/commit/f98e31eb89bc185471225664e610b55f34fbf648))

### Features

- add codsen-glob and migrate glob consumers ([5595a2b](https://github.com/codsen/codsen/commit/5595a2b267eaa6cb60072d037aef00b7a28edd42))
- refresh the tooling and generate with the latest dependencies ([781f802](https://github.com/codsen/codsen/commit/781f802911066a82a4533b0e5a3fcbd742d0dd83))

### Performance Improvements

- Recorded a 7.6% higher normalized benchmark score than v3.1.3 (8,616,614 → 9,271,372).

## 3.1.3 (2026-01-15)

### Performance Improvements

- Recorded a 30.05% higher normalized benchmark score than v3.0.21 (6,625,757 → 8,616,614).

## 3.0.0 (2022-12-01)

### BREAKING CHANGES

- Minimum supported Node version is v14.18; we're dropping v12 support

## 2.1.0 (2022-08-12)

### Features

- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

## 2.0.16 (2022-08-01)

### Performance Improvements

- Recorded a 9.25% higher normalized benchmark score than v2.0.15 (16,108,801 → 17,598,268).

## 2.0.14 (2022-07-05)

### Performance Improvements

- Recorded a 57.3% higher normalized benchmark score than v2.0.13 (10,830,503 → 17,035,967).

## 2.0.13 (2022-04-18)

### Performance Improvements

- Recorded a 27.14% higher normalized benchmark score than v2.0.12 (8,518,818 → 10,830,503).

## 2.0.12 (2022-01-22)

### Performance Improvements

- Recorded a 16.17% higher normalized benchmark score than v2.0.11 (7,333,346 → 8,518,818).

## 2.0.9 (2021-12-24)

### Performance Improvements

- Recorded a 18.69% higher normalized benchmark score than v2.0.8 (10,437,145 → 12,387,608).

## 2.0.7 (2021-11-30)

### Performance Improvements

- Recorded a 115.76% higher normalized benchmark score than v2.0.5 (6,533,228 → 14,096,349).

## 2.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS `require()`

## 1.6.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 1.5.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 1.5.1 (2021-01-28)

### Fixed

- add `testStats` to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 1.5.0 (2021-01-23)

### Features

- rewrite in TS ([0f277f0](https://github.com/codsen/codsen/commit/0f277f08543f600999a60c9499b91bef76a71b28))

## 1.4.0 (2020-11-28)

Accidental version bump during migration to SourceHut. Sorry about that.

## 1.3.0 (2020-05-06)

### Features

- add sets `allNamedEntitiesSetOnly` and `allNamedEntitiesSetOnlyCaseInsensitive` ([84de965](https://gitlab.com/codsen/codsen/commit/84de965ae31eee50d3c08733f9750a8fbe8a7299))

## 1.2.3 (2019-09-11)

### Fixed

- loosen few common entities to allow more fixing cases ([87ff4f6](https://gitlab.com/codsen/codsen/commit/87ff4f6))

## 1.2.0 (2019-08-24)

### Features

- generate the list of non-email-friendly entities from scratch ([971e8a8](https://gitlab.com/codsen/codsen/commit/971e8a8))

## 1.1.0 (2019-06-01)

### Features

- Add &poud; to the list of recognised broken HTML entities ([759aa9f](https://gitlab.com/codsen/codsen/commit/759aa9f))
- Add a list of entities which are dangerous to add missing semicolon (uncertain.json) ([c783a6e](https://gitlab.com/codsen/codsen/commit/c783a6e))
- Add a list of named HTML entities not commonly supported among email consumption software ([2bc2c25](https://gitlab.com/codsen/codsen/commit/2bc2c25))
- Add more broken entities, sort the list and improve unit tests ([18e0b54](https://gitlab.com/codsen/codsen/commit/18e0b54))
- entStartsWithCaseInsensitive and entEndsWithCaseInsensitive ([b1e657b](https://gitlab.com/codsen/codsen/commit/b1e657b))
- Export all entities ([34b480a](https://gitlab.com/codsen/codsen/commit/34b480a))
- Export brokenNamedEntities ([e6a986b](https://gitlab.com/codsen/codsen/commit/e6a986b))
- minLength and maxLength of all known named HTML entities ([ec4d154](https://gitlab.com/codsen/codsen/commit/ec4d154))
- Remove broken nbsp's from the known broken entities list and start a new list ([2b532fd](https://gitlab.com/codsen/codsen/commit/2b532fd))
- Uncertain entities and other tweaks ([c13a254](https://gitlab.com/codsen/codsen/commit/c13a254))

## 1.0.0 (2019-04-02)

- First public release
