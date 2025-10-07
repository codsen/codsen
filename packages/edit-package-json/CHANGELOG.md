# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 0.8.18 (2024-01-05)

### Bug Fixes

- fix a peculiar case of nested empty arrays ([878c4b0](https://github.com/codsen/codsen/commit/878c4b0335fc36591508c7ee6c88fc26ba8e0695)), closes [#89](https://github.com/codsen/codsen/issues/89)

## 0.8.0 (2022-12-01)

### BREAKING CHANGES

- Minimum supported Node version is v14.18; we're dropping v12 support

## 0.7.0 (2022-08-12)

### Features

- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

## 0.6.0 (2022-04-11)

### Features

- export defaults and version ([1107244](https://github.com/codsen/codsen/commit/1107244b45eff96ac1fc4ab992031ede0d10ba8c))

## 0.5.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS `require()`

## 0.4.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 0.3.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 0.3.1 (2021-01-28)

### Fixed

- add `testStats` to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 0.3.0 (2021-01-23)

### Features

- rewrite in TS ([b79616e](https://github.com/codsen/codsen/commit/b79616eb745d4ed367d9bc8778a71102b1eaa69c))

## 0.2.0 (2020-11-28)

Accidental version bump during migration to SourceHut. Sorry about that.

## 0.1.24 (2020-04-26)

### Fixed

- harden the eslint rules set, make all tests pass and rebase a tad ([e3bee37](https://gitlab.com/codsen/codsen/commit/e3bee37319d31f480a7d25e74c0168dacb64addd))

## 0.1.5 (2019-10-23)

### Fixed

- fix the missing tests and enable all synthetic tests on all package.json's in monorepo ([b08c76a](https://gitlab.com/codsen/codsen/commit/b08c76a51546f9e02450e9bbd8eb3e52be1ecfe4))

## 0.1.4 (2019-10-21)

### Fixed

- algorithm improvements, many cases fixed ([30a6cf8](https://gitlab.com/codsen/codsen/commit/30a6cf8ff639059507935ff348d4d9700ca8fec7))

## 0.1.3 (2019-10-09)

### Fixed

- few bug fixes involving arrays, comments and quoted chunks ([337c7ca](https://gitlab.com/codsen/codsen/commit/337c7cad0935d7b1b2449d6b69175f5a3c02b8c4))

## 0.1.2 (2019-10-05)

### Fixed

- fix array element deletion ([49e2124](https://gitlab.com/codsen/codsen/commit/49e2124))
- fix certain nested combinations + set up real-file based fixtures on a separate test file ([456a7f6](https://gitlab.com/codsen/codsen/commit/456a7f6))

## 0.1.0 (2019-09-23)

### Features

- complete the set() method, can't write new paths yet, only amend existing-ones ([2c6a430](https://gitlab.com/codsen/codsen/commit/2c6a430))
- del method to delete existing paths in JSON ([e29eae1](https://gitlab.com/codsen/codsen/commit/e29eae1))
- escaping of JSON-illegal strings like quotes ([dde3c5e](https://gitlab.com/codsen/codsen/commit/dde3c5e))
- make nested array/plain object state recognition reliable and precise ([9d51916](https://gitlab.com/codsen/codsen/commit/9d51916))

## 1.0.0 (2019-09-21)

- First public release
