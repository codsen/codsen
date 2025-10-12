# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 4.0.30 (2025-10-12)

**Note:** Version bump only for package ast-monkey-traverse-with-lookahead

## 4.0.0 (2022-12-01)

### BREAKING CHANGES

- Minimum supported Node version is v14.18; we're dropping v12 support

## 3.1.0 (2022-08-12)

### Features

- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

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

## 2.0.1 (2021-01-28)

### Fixed

- add `testStats` to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 2.0.0 (2021-01-23)

### Features

- rewrite in TS and start using named exports ([09d3598](https://github.com/codsen/codsen/commit/09d35981a4d99597a3db4faf60dba3d247949739))

### BREAKING CHANGES

- previously you'd consume like: `import traverse from ...` - now: `import { traverse } from ...`

## 1.2.0 (2020-11-28)

Accidental version bump during migration to SourceHut. Sorry about that.

## 1.1.0 (2020-04-04)

### Features

- init ([f806c99](https://gitlab.com/codsen/codsen/commit/f806c9960d7edecc17e353d59ca9965966cf331d))
- lookaheads ([d9acc8b](https://gitlab.com/codsen/codsen/commit/d9acc8b338a8911327148e13e2c8098c809257e5))

## 1.0.0 (2020-03-26)

- First public release.
