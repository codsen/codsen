# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 2.1.0 (2022-08-12)

### Features

- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

## 2.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS require()

## 1.6.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 1.5.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 1.5.1 (2021-01-28)

### Fixed

- add testStats to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 1.5.0 (2021-01-23)

### Features

- rewrite in TS ([0f277f0](https://github.com/codsen/codsen/commit/0f277f08543f600999a60c9499b91bef76a71b28))

## 1.4.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

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
