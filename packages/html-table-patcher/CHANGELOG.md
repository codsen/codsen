# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.1.7](https://gitlab.com/codsen/codsen/compare/html-table-patcher@1.1.6...html-table-patcher@1.1.7) (2019-07-19)

**Note:** Version bump only for package html-table-patcher





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
