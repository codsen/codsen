# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.0.15](https://github.com/codsen/codsen/compare/ast-compare@4.0.14...ast-compare@4.0.15) (2023-06-05)

**Note:** Version bump only for package ast-compare

## 4.0.0 (2022-12-01)

### BREAKING CHANGES

- Minimum supported Node version is v14.18; we're dropping v12 support

## 3.2.0 (2022-08-12)

### Features

- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

## 3.1.3 (2022-04-18)

### Fixed

- tweak types ([0454269](https://github.com/codsen/codsen/commit/0454269e8831fcea5078e6d28429947fa8ab369d))

## 3.1.0 (2022-04-10)

### Features

- export defaults and version ([191d365](https://github.com/codsen/codsen/commit/191d36502877ef73e8c981bb668b3348ed4c2876))

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

- rewrite in TS and start using named exports ([6a75380](https://github.com/codsen/codsen/commit/6a75380a2141e476126a592fe879ebd5ffef5fab))

### BREAKING CHANGES

- previously you'd import like: `import compare from ...` - now do: `import { compare } from ...`

## 1.14.0 (2020-11-28)

Accidental version bump during migration to SourceHut. Sorry about that.

## 1.13.0 (2020-01-26)

### Features

- make the run 11 times faster ([a9ea3f0](https://gitlab.com/codsen/codsen/commit/a9ea3f0da6aa752dac9987aef81cbd047d965ced))

## 1.12.19 (2019-10-07)

### Performance Improvements

- remove `check-types-mini` ([0503752](https://gitlab.com/codsen/codsen/commit/0503752))

## 1.12.0 (2019-06-29)

### Features

- add perf measurement, recording and historical comparison ([8266d21](https://gitlab.com/codsen/codsen/commit/8266d21))

## 1.11.0 (2019-01-20)

- various documentation and setup tweaks after we migrated to monorepo
- updated dependencies and all config files using automated tools

## 1.7.0 (2018-12-26)

- `opts.useWildcards` ([d541cab](https://gitlab.com/codsen/codsen/tree/master/packages/ast-compare/commits/d541cab))

## 1.6.0 (2018-10-12)

- Updated all dependencies and restored unit test coverage tracking, both via terminal and via coveralls.io

## 1.5.0 (2018-06-13)

GitHub sold us out. In the meantime, we:

- Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- Dropped BitHound (RIP) and Travis
- Removed `package-lock`

## 1.4.0 (2018-05-14)

### Improvements

- Now pointing unit tests at ES Modules build, not CommonJS-one. This means, unit test coverage will be correct (higher) because there won't be any missing rows that Babel added which are impossible to cover.
- Tweaks to ava [config](https://github.com/avajs/ava/blob/master/docs/recipes/es-modules.md) in `package.json`, properly enabling the `dev` Rollup builds.

## 1.3.0 (2018-05-01)

### Features

- Set up [Prettier](https://prettier.io)
- Removed `package.lock` and `.editorconfig`
- Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove them during the builds.

## 1.2.0 (2018-02-11)

### Features

- `opts.useWildcards` is driven by [matcher](https://github.com/sindresorhus/matcher) and `matcher` up until today was case-insensitive. Today they released the case-sensitive mode and we switched to that. Now all behaviour in wildcards should match non-glob behaviour, case-wise.

## 1.1.0 (2017-10-29)

### Features

- `opts.useWildcards` (off by default)

## 1.0.0 (2017-10-24)

### Features

- Public release
