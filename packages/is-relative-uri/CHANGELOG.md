# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.0.11](https://github.com/codsen/codsen/compare/is-relative-uri@4.0.10...is-relative-uri@4.0.11) (2022-01-11)

**Note:** Version bump only for package is-relative-uri





## 4.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS require()

## 3.1.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 3.0.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 3.0.1 (2021-01-28)

### Bug Fixes

- add testStats to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 3.0.0 (2021-01-23)

### Features

- rewrite in TS, start using named exports ([3fd9024](https://github.com/codsen/codsen/commit/3fd9024adfb009998283f0c2fafcd17a930d0573))

### BREAKING CHANGES

- previously: `import isRel from ...` - now `import { isRel } from ...`

## 2.0.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 1.0.0 (2020-01-11)

### Features

- algorithm improvements and more unit tests ([c0b51d4](https://gitlab.com/codsen/codsen/commit/c0b51d489b02159377a73f76edbc8e68411b5195))
- dot dot not-slash ([5ce819d](https://gitlab.com/codsen/codsen/commit/5ce819d3053133f4b4728f0ccc8fde34650f5ff1))
- init ([7d0891a](https://gitlab.com/codsen/codsen/commit/7d0891a1679aa10d9c30757f6e82f84d53c151c1))
- more hash-checks ([5689915](https://gitlab.com/codsen/codsen/commit/5689915d279696cb9f9a2491f8fbf2fc60c25da8))
- opts.flagUpUrisWithSchemes ([063d601](https://gitlab.com/codsen/codsen/commit/063d601cd740f041daf934cedd1c944e4cd53e30))

### BREAKING CHANGES

- init

## 1.0.0 (2020-01-12)

- ✨ First public release
