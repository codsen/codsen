# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 5.0.0 (2021-01-23)


### Bug Fixes

* correct the typo in the log.timeTakenInMilliseconds ([a95d86c](https://github.com/codsen/codsen/commit/a95d86c3af09df3ea8a56a312227c2ad90a51f43))
* correctly recognise single and double apostrophes within the text, outside tags ([182891a](https://github.com/codsen/codsen/commit/182891a8b5d157e38081569e02db8a8f2673be62))
* Empty media queries in tight scenarios not being removed completely ([f2d621a](https://github.com/codsen/codsen/commit/f2d621a4f7470240f657c7c3358dd4d0e0e74af4))
* fix a bug with consecutive style tags ignored first class' first char ([6de6cfc](https://github.com/codsen/codsen/commit/6de6cfc019e7bcaf56b34f04ae8b25fc688075ea)), closes [#36](https://github.com/codsen/codsen/issues/36)
* Fix the Create New Issue URLs ([f5a41bf](https://github.com/codsen/codsen/commit/f5a41bf16fd8f43de7f8e7de68da562821ddb960))
* recognise id= or class= in URLs as text ([f6fee78](https://github.com/codsen/codsen/commit/f6fee78fa2faf48766399ce5eb5b45b6a1c5a343)), closes [#45](https://github.com/codsen/codsen/issues/45)
* remove leading spaces in cleaned like class=" zz" and tighten up class/id recognition ([c5b256e](https://github.com/codsen/codsen/commit/c5b256efdb6a17f35df5384adacc05a0d320c546))
* stop removing "class" or "id" without following equals, completely (for now) ([6062e18](https://github.com/codsen/codsen/commit/6062e18fa392bcf4722c093125fc7b91abe6ca92)), closes [#27](https://github.com/codsen/codsen/issues/27)
* The comma bug where unused chunk was sandwiched by used chunks ([1f040e8](https://github.com/codsen/codsen/commit/1f040e87a97c137818d8fc67af53b4777134fc99))


### Features

* Add one more tag before which there will be a line break ([d178203](https://github.com/codsen/codsen/commit/d1782036b134102fd552d38d2d4f39c93195620b))
* Add perf measurement, comparing and recording ([239e063](https://github.com/codsen/codsen/commit/239e0636fad9141956f690130bec631f8027e28a))
* Change the default export to { comb } instead of function exported as default ([3f7f44a](https://github.com/codsen/codsen/commit/3f7f44a3ddd163b01c9fc64088e2472a1d303d85))
* If uglification was turned on, output legend under log.uglified ([f851c56](https://github.com/codsen/codsen/commit/f851c56505996733311a440be10be6ae691c49bf))
* improvements to algorithm when class is joined with a known ESP tag ([39cd11c](https://github.com/codsen/codsen/commit/39cd11c38aafe4bde8c864438a916e471289ae72))
* Initial release ([8db2df9](https://github.com/codsen/codsen/commit/8db2df9fb08d66cf6c7a75a57cdcd15a5ec12c1c))
* leave quoteless attributes intact, don't try to restore quotes ([1057464](https://github.com/codsen/codsen/commit/1057464487fbfee54441d6dfaff103d6e7ef8347))
* leave the trailing line break condition as it comes in, unless it's excessive (trim then) ([22c2b45](https://github.com/codsen/codsen/commit/22c2b4512e66e29173e2b5f12703b67bf1ad45e4)), closes [#40](https://github.com/codsen/codsen/issues/40)
* Merge modes via opts.mergeType ([2394464](https://github.com/codsen/codsen/commit/2394464976ce1970bcd31b45d9fd9955f4bbcc09))
* opts.removeCSSComments ([f4583e5](https://github.com/codsen/codsen/commit/f4583e5b7404f81eba1abafdc46cf04a2456c229))
* opts.reportProgressFunc ([7d3cc90](https://github.com/codsen/codsen/commit/7d3cc9045f2414b0d94d3befb660a48ba2dc7c9d))
* opts.reportProgressFuncFrom and opts.reportProgressFuncTo ([d9ac4d6](https://github.com/codsen/codsen/commit/d9ac4d6046815597ca65a983938542facdd239c2))
* Output object's new keys countBeforeCleaning and countAfterCleaning ([d89ca7c](https://github.com/codsen/codsen/commit/d89ca7c7015843cc0c2f087468ca645b1bd4d3b3))
* recognise bracket notation ([426c13a](https://github.com/codsen/codsen/commit/426c13a0224b0874c946d0062862907061650b32))
* recognise single-double-single/double-single-double quotes within attr values ([a0f62b4](https://github.com/codsen/codsen/commit/a0f62b474dbd630e54676ee66c41dd6530f0254e))
* rewrite in TS ([402f4a2](https://github.com/codsen/codsen/commit/402f4a2b2c30b98626c9fd918816c5bbcbcf33af))
* support for liquid template engine double curlies as CSS style values in head CSS ([573cb00](https://github.com/codsen/codsen/commit/573cb0068f1422022191e0d7915987813456b7ea))
* support quoteless attributes that come out of other minifiers ([11e898b](https://github.com/codsen/codsen/commit/11e898bf43c5a77e7543a6535954c4e5ee00e8cc))
* Uglification based on class/id characters but not class/id position in the reference array ([ba4e866](https://github.com/codsen/codsen/commit/ba4e866a48df82a2fbce82f599c73260ad8535d8))
* Uglification legend does not mention entries which were not uglified because of being whitelis ([39ded32](https://github.com/codsen/codsen/commit/39ded320b36ea1765ce2ec1d4a5e349574f88a80))


### BREAKING CHANGES

* Now you must consume importing or requiring { comb } instead of assigning to any
variable you like as before
* Second input argument, progressFn, was moved into opts.progressFn and opts was
placed into second input argument instead





## 4.1.0 (2020-12-11)

### Features

- leave quoteless attributes intact, don't try to restore quotes ([cf591db](https://git.sr.ht/~royston/codsen/commit/cf591dbbb91251cdfcfe640bfab2b82b6dc95d74))

## 4.0.5 (2020-12-09)

### Bug Fixes

- correct the typo in the log.timeTakenInMilliseconds ([ddc2dec](https://git.sr.ht/~royston/codsen/commit/ddc2decbe0997e0704db781e5bdc97f0b53d5054))

## 4.0.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

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
