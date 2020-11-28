# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 3.0.0 (2020-11-28)

### Bug Fixes

- Add missing node globals, necessary for UMD build ([b917068](https://git.sr.ht/~royston/codsen/commits/b91706821c6267574eb34de49ea780fa0dbf21be))
- fix breaking unit test, colspan number should be string not number ([ee381ee](https://git.sr.ht/~royston/codsen/commits/ee381ee22077e1c9e54356ee99470993e16b2a9b))
- Fix the Create New Issue URLs ([c5ee4a6](https://git.sr.ht/~royston/codsen/commits/c5ee4a61e9436099b0e20d20bca043c1b2c93f55))
- Rollup globals plugin was missing in builds which errorred out the UMD builds ([2f8ee25](https://git.sr.ht/~royston/codsen/commits/2f8ee2595f00c5c023c96cc8d518ee6ffc33cc4f))

### Features

- Add one more tag before which there will be a line break ([4f00871](https://git.sr.ht/~royston/codsen/commits/4f008715dcc2de7b2b52b67ce2e27728d5ffec37))
- Adds basic level of colspans ([75308e6](https://git.sr.ht/~royston/codsen/commits/75308e6fb0794c556641144cee3cb3c8e75a2f9e))
- comments skip ([4afb7c4](https://git.sr.ht/~royston/codsen/commits/4afb7c460cdbaebe65a949e6091497332b9dbf13))
- Complete recode using parsing ([0e31c43](https://git.sr.ht/~royston/codsen/commits/0e31c434a2acbbc4bdbd25c83c3b5ca82c3da03b))
- GUI with wired up UMD tap ([e1e0648](https://git.sr.ht/~royston/codsen/commits/e1e0648652363b04cd5ac12f377c299dec497c41))
- Harden the API and tap the html-dom-parser as parser instead because former broke Rollup UMD b ([f27ac6d](https://git.sr.ht/~royston/codsen/commits/f27ac6d5f3065375e1c808efc7157a0a3c022738))
- improvements to tag recognition algorithm ([d265d1e](https://git.sr.ht/~royston/codsen/commits/d265d1ec8f1af42bc37a46bbb0b31e122b1ab992))
- Initial release ([4f35bfb](https://git.sr.ht/~royston/codsen/commits/4f35bfb167e54b1a0e5e8f01871293b262c67a76))
- Merge modes via opts.mergeType ([7fb1c5f](https://git.sr.ht/~royston/codsen/commits/7fb1c5f319aa41ea54c68eed004ab2dfdc7425bf))
- opts.cssStylesContent ([58b6a4f](https://git.sr.ht/~royston/codsen/commits/58b6a4feef069e2841195d0904657a5fa72905d5))
- Precautions against children tables nested at deeper levels ([ced7d36](https://git.sr.ht/~royston/codsen/commits/ced7d365d9dbcdc39bb1d4f6c1642f9e94b62b9e))
- rewrite ([ef39ee9](https://git.sr.ht/~royston/codsen/commits/ef39ee9b51f4a53a52ed186d52bc289e6b08dbd7))
- Tap's styling ([6487e7b](https://git.sr.ht/~royston/codsen/commits/6487e7bb7460b5edb684b97164bf15b90a653550))
- Tighten the quotes detection clauses ([a25774e](https://git.sr.ht/~royston/codsen/commits/a25774e1d4f9b6b25caee5e57b4799781184cdb4))

### BREAKING CHANGES

- rewrite
- Second input argument, progressFn, was moved into opts.progressFn and opts was
placed into second input argument instead

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
