# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.0.31](https://github.com/codsen/codsen/compare/eslint-plugin-test-num-tbc@3.0.30...eslint-plugin-test-num-tbc@3.0.31) (2025-07-20)

**Note:** Version bump only for package eslint-plugin-test-num-tbc

## 3.0.0 (2022-12-01)

- update the test numbers within test-mixer `forEach` loops ([5905781](https://github.com/codsen/codsen/commit/59057813fd11e776f8662b153812f28ca896d77a))

### BREAKING CHANGES

- Minimum supported Node version is v14.18; we're dropping v12 support

## 2.2.0 (2022-11-07)

### Features

- fix tests on TS parser, wire up `configType: flat` in tests ([f2b3bef](https://github.com/codsen/codsen/commit/f2b3bef8faf3089cb38455ec7feb9c4b887dd8be))

## 2.1.0 (2022-11-03)

### Features

- migrate to monorepo, add support to uvu ([d0088be](https://github.com/codsen/codsen/commit/d0088be784b6483abe6d05ba2d5dd02dea35bf67))

## 2.0.1 (2021-09-12)

### Bug Fixes

- revert back from ES Modules, ESLint plugins can't be in ES Modules yet

## 2.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

## 1.6.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 1.5.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 1.5.5 (2021-02-14)

### Bug Fixes

- adapt to TS parser AST ([cfa7f86](https://github.com/codsen/codsen/commit/cfa7f86a9038eff9edffa2826076f2178720685f))
- correct certain cases where index starts at relative zero position ([a725be9](https://github.com/codsen/codsen/commit/a725be9a7f9b40c5afaca72d43f068dcc531501f))
- fix third arg insertion on TS parser ([e2eff7b](https://github.com/codsen/codsen/commit/e2eff7b10d6abeacee7f1a3f2b08a1b4bdfe12d1))

## 1.5.1 (2021-01-28)

### Bug Fixes

- add testStats to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 1.5.0 (2021-01-23)

### Features

- rewrite in TS ([06302c2](https://github.com/codsen/codsen/commit/06302c2014895c4287fcfd5429bbb39ca3cffb79))

## 1.4.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 1.3.0 (2020-05-11)

### Bug Fixes

- improve the test count calculation ([7372146](https://gitlab.com/codsen/codsen/commit/7372146df3832347f6c81bd8b6517ded1f9b8416))

### Features

- add t.todo to be recognised (besides usual t.test, t.only and t.skip) ([fa8f53e](https://gitlab.com/codsen/codsen/commit/fa8f53ec674f6bde9e95f32950787720bb3817bf))

## 1.2.0 (2020-05-08)

### Bug Fixes

- recognise and isolate t.test, t.only and t.skip from the rest and count appropriately ([59f4480](https://gitlab.com/codsen/codsen/commit/59f44800b7cfa699dbfbd1948d343f8362c59ef8))

### Features

- adds message argument (with correct value) if it's missing ([98a3896](https://gitlab.com/codsen/codsen/commit/98a38967ac3e5cf8a337bea4039029b8db424fbb))
- improvements to adding message arg ([192d60c](https://gitlab.com/codsen/codsen/commit/192d60c6acca8e533cff9408bfe9d2ffb02c5145))

## 1.1.1 (2020-05-07)

### Bug Fixes

- correctly recognise and skip non-test expression statements ([3b4fdfa](https://gitlab.com/codsen/codsen/commit/3b4fdfad9bebc76a574981c7a97e7cc7e43be1f3))

## 1.1.0 (2020-05-06)

### Features

- init ([928bb73](https://gitlab.com/codsen/codsen/commit/928bb73e3d2a036b5da65ed192f4982e5e8b60a7))
