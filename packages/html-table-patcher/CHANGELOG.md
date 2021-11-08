# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [5.0.5](https://github.com/codsen/codsen/compare/html-table-patcher@5.0.4...html-table-patcher@5.0.5) (2021-11-08)

**Note:** Version bump only for package html-table-patcher





## 5.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS require()

## 4.1.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 4.0.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 4.0.1 (2021-01-28)

### Bug Fixes

- add testStats to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 4.0.0 (2021-01-23)

### Features

- rewrite in TS ([1b15101](https://github.com/codsen/codsen/commit/1b15101124ee8ac7935fae96381c2903436bf6eb))

There are no API changes but we're bumping _major_ just in case.

## 3.0.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 2.0.0 (2020-05-11)

### Features

**Complete rewrite. But no changes to API. Still bumping major.**

- rewrite ([ef39ee9](https://gitlab.com/codsen/codsen/commit/ef39ee9b51f4a53a52ed186d52bc289e6b08dbd7))

We switched to all in-house components:

- `codsen-parser` ([npm](https://www.npmjs.com/package/codsen-parser)/[monorepo](https://gitlab.com/codsen/codsen/tree/master/packages/codsen-parser/)) — produces AST
- `ast-monkey-traverse-with-lookahead` ([npm](https://www.npmjs.com/package/ast-monkey-traverse-with-lookahead)/[monorepo](https://gitlab.com/codsen/codsen/tree/master/packages/ast-monkey-traverse-with-lookahead/)) — traverses that AST
- `ranges-push` ([npm](https://www.npmjs.com/package/ranges-push)/[monorepo](https://gitlab.com/codsen/codsen/tree/master/packages/ranges-push/)) — records what needs to be done in source code while traversing AST
- `ranges-apply` ([npm](https://www.npmjs.com/package/ranges-apply)/[monorepo](https://gitlab.com/codsen/codsen/tree/master/packages/ranges-apply/)) — performs all amends in string in one go when finished traversing AST

As a result, UMD bundle is half-the size (was 191KB minified, now 87KB)!

### BREAKING CHANGES

- no changes in API

## 1.1.13 (2019-08-08)

### Bug Fixes

- fix breaking unit test, colspan number should be string not number ([ee381ee](https://gitlab.com/codsen/codsen/commit/ee381ee))

## 1.1.9 (2019-07-24)

### Bug Fixes

- Add missing node globals, necessary for UMD build ([b917068](https://gitlab.com/codsen/codsen/commit/b917068))
- Rollup globals plugin was missing in builds which errorred out the UMD builds ([2f8ee25](https://gitlab.com/codsen/codsen/commit/2f8ee25))

## 1.1.0 (2019-06-18)

### Features

- Adds basic level of colspans ([75308e6](https://gitlab.com/codsen/codsen/commit/75308e6))
- Complete recode using parsing ([0e31c43](https://gitlab.com/codsen/codsen/commit/0e31c43))
- GUI with wired up UMD tap ([e1e0648](https://gitlab.com/codsen/codsen/commit/e1e0648))
- Harden the API and tap the html-dom-parser as parser instead because former broke Rollup UMD b ([f27ac6d](https://gitlab.com/codsen/codsen/commit/f27ac6d))
- opts.cssStylesContent ([58b6a4f](https://gitlab.com/codsen/codsen/commit/58b6a4f))
- Precautions against children tables nested at deeper levels ([ced7d36](https://gitlab.com/codsen/codsen/commit/ced7d36))
- Tap's styling ([6487e7b](https://gitlab.com/codsen/codsen/commit/6487e7b))
- Tighten the quotes detection clauses ([a25774e](https://gitlab.com/codsen/codsen/commit/a25774e))

## 0.5.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 0.3.0 (2018-12-26)

- ✨ Comments skip ([4afb7c4](https://gitlab.com/codsen/codsen/tree/master/packages/html-table-patcher/commits/4afb7c4))
- ✨ Improvements to tag recognition algorithm ([d265d1e](https://gitlab.com/codsen/codsen/tree/master/packages/html-table-patcher/commits/d265d1e))

## 0.2.0 (2018-10-28)

- ✨ Now HTML commented-out code between tags will not be wrapped with tags. If there's just commented-out code between tags, nothing will be added. If there is mixed content, comments will be stripped-out and non-commented-out code will be wrapped with extra table cells.
- ✨ Updated all dependencies
- ✨ Restored unit test coverage tracking: reporting in terminal and coveralls.io
- ✨ Restored unit test linting

## 0.1.0 (2018-08-12)

- ✨ First public release
