# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 4.0.0 (2020-11-28)

### Bug Fixes

- correctly recognise single and double apostrophes within the text, outside tags ([5f7f428](https://git.sr.ht/~royston/codsen/commits/5f7f428ac16343a11e526a41442a00d36ae04f10))
- Empty media queries in tight scenarios not being removed completely ([9c8e980](https://git.sr.ht/~royston/codsen/commits/9c8e98047b6e93d01c13e178b200aaff8365a762))
- fix a bug with consecutive style tags ignored first class' first char ([758ea97](https://git.sr.ht/~royston/codsen/commits/758ea970cd0911f7c04f6c209a515ee680b75c60)), closes [#36](https://git.sr.ht/~royston/codsen/issues/36)
- Fix the Create New Issue URLs ([c5ee4a6](https://git.sr.ht/~royston/codsen/commits/c5ee4a61e9436099b0e20d20bca043c1b2c93f55))
- recognise id= or class= in URLs as text ([547cf93](https://git.sr.ht/~royston/codsen/commits/547cf9345b7c9406f778d9988e0e3384aabb5d8b)), closes [#45](https://git.sr.ht/~royston/codsen/issues/45)
- remove leading spaces in cleaned like class=" zz" and tighten up class/id recognition ([a900e4e](https://git.sr.ht/~royston/codsen/commits/a900e4efbcb0a2910ab4d6e0a4c0cd78da01b970))
- stop removing "class" or "id" without following equals, completely (for now) ([c07cce5](https://git.sr.ht/~royston/codsen/commits/c07cce56d8633ef72ea9451617d8b06d96efc5db)), closes [#27](https://git.sr.ht/~royston/codsen/issues/27)
- The comma bug where unused chunk was sandwiched by used chunks ([cb6fa4c](https://git.sr.ht/~royston/codsen/commits/cb6fa4c2d4dff07c3f46355a862978c8bb338fa7))

### Features

- Add one more tag before which there will be a line break ([4f00871](https://git.sr.ht/~royston/codsen/commits/4f008715dcc2de7b2b52b67ce2e27728d5ffec37))
- Add perf measurement, comparing and recording ([44f7a9e](https://git.sr.ht/~royston/codsen/commits/44f7a9e44c2457d82a8f3d3e7b816d9ee0186e77))
- Change the default export to { comb } instead of function exported as default ([3db706e](https://git.sr.ht/~royston/codsen/commits/3db706e9eaa26f1ce1a9d3ef1da727b592ccc0d1))
- If uglification was turned on, output legend under log.uglified ([805ce2d](https://git.sr.ht/~royston/codsen/commits/805ce2d9978f5688ee4b4f26ad5abc0aa46364db))
- improvements to algorithm when class is joined with a known ESP tag ([366c13b](https://git.sr.ht/~royston/codsen/commits/366c13ba291ca46cce96495ba1c1985f3e56e6fa))
- Initial release ([4f35bfb](https://git.sr.ht/~royston/codsen/commits/4f35bfb167e54b1a0e5e8f01871293b262c67a76))
- leave the trailing line break condition as it comes in, unless it's excessive (trim then) ([f2dee90](https://git.sr.ht/~royston/codsen/commits/f2dee90a155f0e40f5d813d9b3e863ad9d154449)), closes [#40](https://git.sr.ht/~royston/codsen/issues/40)
- Merge modes via opts.mergeType ([7fb1c5f](https://git.sr.ht/~royston/codsen/commits/7fb1c5f319aa41ea54c68eed004ab2dfdc7425bf))
- opts.removeCSSComments ([b848d1c](https://git.sr.ht/~royston/codsen/commits/b848d1c5538b70de9f181b9c77e6917740294b92))
- opts.reportProgressFunc ([f5935fb](https://git.sr.ht/~royston/codsen/commits/f5935fb66fabf6fea245ef8ab416fed1bdee7b68))
- opts.reportProgressFuncFrom and opts.reportProgressFuncTo ([8734cc5](https://git.sr.ht/~royston/codsen/commits/8734cc5a80fdd18bd2837b4625ab37e8d8b1251d))
- Output object's new keys countBeforeCleaning and countAfterCleaning ([55b13e7](https://git.sr.ht/~royston/codsen/commits/55b13e73d3c7e6357a76389534e34304f755248e))
- recognise bracket notation ([ce0a0b1](https://git.sr.ht/~royston/codsen/commits/ce0a0b1006fdab8295e079457096132e045768a4))
- recognise single-double-single/double-single-double quotes within attr values ([3eeaf1e](https://git.sr.ht/~royston/codsen/commits/3eeaf1e6bd69673c95be7c077157b1377cac12e8))
- support for liquid template engine double curlies as CSS style values in head CSS ([819df36](https://git.sr.ht/~royston/codsen/commits/819df36841d0d3f14f6e09effc23f2ff1e949131))
- support quoteless attributes that come out of other minifiers ([9129fad](https://git.sr.ht/~royston/codsen/commits/9129fad0f531328b07588d1e8f013091d9c5ee49))
- Uglification based on class/id characters but not class/id position in the reference array ([c839977](https://git.sr.ht/~royston/codsen/commits/c83997796942bf21e123298c30265ee27074e366))
- Uglification legend does not mention entries which were not uglified because of being whitelis ([b6bacfc](https://git.sr.ht/~royston/codsen/commits/b6bacfcadd613f367541253ea4af70922242ce98))

### BREAKING CHANGES

- Now you must consume importing or requiring { comb } instead of assigning to any
variable you like as before
- Second input argument, progressFn, was moved into opts.progressFn and opts was
placed into second input argument instead

## 3.10.6 (2020-11-02)

### Bug Fixes

- recognise id= or class= in URLs as text ([547cf93](https://gitlab.com/codsen/codsen/commit/547cf9345b7c9406f778d9988e0e3384aabb5d8b)), closes [#45](https://gitlab.com/codsen/codsen/issues/45)

## 3.10.0 (2020-09-15)

### Features

- leave the trailing line break condition as it comes in, unless it's excessive (trim then) ([f2dee90](https://gitlab.com/codsen/codsen/commit/f2dee90a155f0e40f5d813d9b3e863ad9d154449)), closes [#40](https://gitlab.com/codsen/codsen/issues/40)

## 3.9.20 (2020-08-08)

### Bug Fixes

- fix a bug with consecutive style tags ignored first class' first char ([758ea97](https://gitlab.com/codsen/codsen/commit/758ea970cd0911f7c04f6c209a515ee680b75c60)), closes [#36](https://gitlab.com/codsen/codsen/issues/36)

## 3.9.17 (2020-05-24)

### Bug Fixes

- stop removing "class" or "id" without following equals, completely (for now) ([c07cce5](https://gitlab.com/codsen/codsen/commit/c07cce56d8633ef72ea9451617d8b06d96efc5db)), closes [#27](https://gitlab.com/codsen/codsen/issues/27)

## 3.9.0 (2020-01-26)

### Features

- improvements to algorithm when class is joined with a known ESP tag ([366c13b](https://gitlab.com/codsen/codsen/commit/366c13ba291ca46cce96495ba1c1985f3e56e6fa))

## 3.8.0 (2019-09-17)

### Bug Fixes

- correctly recognise single and double apostrophes within the text, outside tags ([5f7f428](https://gitlab.com/codsen/codsen/commit/5f7f428))

### Features

- recognise single-double-single/double-single-double quotes within attr values ([3eeaf1e](https://gitlab.com/codsen/codsen/commit/3eeaf1e))

## 3.7.1 (2019-09-11)

### Bug Fixes

- remove leading spaces in cleaned like class=" zz" and tighten up class/id recognition ([a900e4e](https://gitlab.com/codsen/codsen/commit/a900e4e))

## 3.7.0 (2019-09-04)

### Features

- recognise bracket notation ([ce0a0b1](https://gitlab.com/codsen/codsen/commit/ce0a0b1))

## 3.6.0 (2019-08-24)

### Features

- support quoteless attributes that come out of other minifiers ([9129fad](https://gitlab.com/codsen/codsen/commit/9129fad))

## 3.5.0 (2019-08-08)

### Features

- support for liquid template engine double curlies as CSS style values in head CSS ([819df36](https://gitlab.com/codsen/codsen/commit/819df36))

## 3.4.0 (2019-06-29)

### Features

- Add perf measurement, comparing and recording ([44f7a9e](https://gitlab.com/codsen/codsen/commit/44f7a9e))

## 3.3.0 (2019-06-25)

### Features

- Output object's new keys countBeforeCleaning and countAfterCleaning ([55b13e7](https://gitlab.com/codsen/codsen/commit/55b13e7))
- Uglification legend does not mention entries which were not uglified because of being whitelis ([b6bacfc](https://gitlab.com/codsen/codsen/commit/b6bacfc))

## 3.2.0 (2019-06-21)

### Features

- opts.removeCSSComments ([b848d1c](https://gitlab.com/codsen/codsen/commit/b848d1c))
- Uglification based on class/id characters but not class/id position in the reference array ([c839977](https://gitlab.com/codsen/codsen/commit/c839977))

## 3.1.0 (2019-06-18)

### Features

- If uglification was turned on, output legend under log.uglified ([805ce2d](https://gitlab.com/codsen/codsen/commit/805ce2d))
- opts.reportProgressFunc ([f5935fb](https://gitlab.com/codsen/codsen/commit/f5935fb))
- opts.reportProgressFuncFrom and opts.reportProgressFuncTo ([8734cc5](https://gitlab.com/codsen/codsen/commit/8734cc5))

## 3.0.0 (2019-06-01)

### Features

- Change the default export to { comb } instead of function exported as default ([3db706e](https://gitlab.com/codsen/codsen/commit/3db706e))

### BREAKING CHANGES

- Now you must consume importing or requiring { comb } instead of assigning to any
  variable you like as before

## 2.0.10 (2019-03-22)

### Bug Fixes

- The comma bug where unused chunk was sandwiched by used chunks ([cb6fa4c](https://gitlab.com/codsen/codsen/commit/cb6fa4c))

## 1.2.8 (2019-02-26)

### Bug Fixes

- Empty media queries in tight scenarios not being removed completely ([d4f1d8e](https://gitlab.com/codsen/codsen/commit/d4f1d8e))

## 1.2.7 (2019-02-10)

### Bug Fixes

- Fix the Create New Issue URLs ([c5ee4a6](https://gitlab.com/codsen/codsen/commit/c5ee4a6))

## 1.2.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 1.0.0 (2018-12-15)

- ✨ Renaming `email-remove-unused-css` to `email-comb` and resetting versions to `1.0.0`
