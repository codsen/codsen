# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 4.0.0 (2021-01-23)


### Bug Fixes

* Add missing node globals, necessary for UMD build ([1063b23](https://github.com/codsen/codsen/commit/1063b237f048f57feb70ee1e5be82e891ab7b803))
* fix breaking unit test, colspan number should be string not number ([e168d10](https://github.com/codsen/codsen/commit/e168d10cef6c17359eafcee234aac0a266e360d3))
* Fix the Create New Issue URLs ([f5a41bf](https://github.com/codsen/codsen/commit/f5a41bf16fd8f43de7f8e7de68da562821ddb960))
* Rollup globals plugin was missing in builds which errorred out the UMD builds ([8e73d45](https://github.com/codsen/codsen/commit/8e73d45ad9f8114921cf7cd4eb3508aca27f2d0b))


### Features

* Add one more tag before which there will be a line break ([d178203](https://github.com/codsen/codsen/commit/d1782036b134102fd552d38d2d4f39c93195620b))
* Adds basic level of colspans ([8724428](https://github.com/codsen/codsen/commit/87244280aa1c39d6f028b51a98c7e95a1929fb4f))
* comments skip ([e549682](https://github.com/codsen/codsen/commit/e549682813080f01fe4b1b2fc10c6bd9e240a3ee))
* Complete recode using parsing ([e8c5aa1](https://github.com/codsen/codsen/commit/e8c5aa16773b549b57bef9d602130dd1ca043b6a))
* GUI with wired up UMD tap ([d3b16fe](https://github.com/codsen/codsen/commit/d3b16fe93de82bf0d31c900c437860dd45ea05ac))
* Harden the API and tap the html-dom-parser as parser instead because former broke Rollup UMD b ([d0ea374](https://github.com/codsen/codsen/commit/d0ea3745be499bf18485c2a402a3d852adea88eb))
* Implement localstorage so that all textboxes are not wiped after a refresh ([02bb185](https://github.com/codsen/codsen/commit/02bb18570e3d8b1362d25c4ca1d0e98ae7351eca))
* improvements to tag recognition algorithm ([07e041f](https://github.com/codsen/codsen/commit/07e041fb5a4d787a6586e259e1dbdf178fedf43b))
* Initial release ([8db2df9](https://github.com/codsen/codsen/commit/8db2df9fb08d66cf6c7a75a57cdcd15a5ec12c1c))
* Merge modes via opts.mergeType ([2394464](https://github.com/codsen/codsen/commit/2394464976ce1970bcd31b45d9fd9955f4bbcc09))
* opts.cssStylesContent ([bc09546](https://github.com/codsen/codsen/commit/bc0954673d2cc623cc4b0352d73c7d33bdb999ba))
* Precautions against children tables nested at deeper levels ([6991e77](https://github.com/codsen/codsen/commit/6991e77fc01c6fe2f13424b930ec022279aa70a1))
* rewrite ([6deb969](https://github.com/codsen/codsen/commit/6deb96987ef4c6e5a2799886730a0e62c26c9e28))
* rewrite in TS ([1b15101](https://github.com/codsen/codsen/commit/1b15101124ee8ac7935fae96381c2903436bf6eb))
* Tap's styling ([da04603](https://github.com/codsen/codsen/commit/da04603a52954636d7820cb12e571e974104ed21))
* Tighten the quotes detection clauses ([5cf10a5](https://github.com/codsen/codsen/commit/5cf10a5dd3bd89e21aaf64624434b59a1e98ccac))


### BREAKING CHANGES

* rewrite
* Second input argument, progressFn, was moved into opts.progressFn and opts was
placed into second input argument instead





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
