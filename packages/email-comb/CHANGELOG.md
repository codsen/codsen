# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 5.1.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 5.0.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 5.0.14 (2021-04-04)

### Bug Fixes

- recognise Nunjucks/Jinja within head CSS [@font-face](https://github.com/font-face) ([4fd803b](https://github.com/codsen/codsen/commit/4fd803bbb0734c192309e95bbafbd1d029e07571))

## 5.0.7 (2021-03-07)

### Bug Fixes

- correct the name of the package in the throw messages ([2d1ad58](https://github.com/codsen/codsen/commit/2d1ad58a8d48c98d56abf88e351bae39fe8d9e42))

## 5.0.1 (2021-01-28)

### Bug Fixes

- add testStats to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 5.0.0 (2021-01-23)

### Features

- rewrite in TS ([402f4a2](https://github.com/codsen/codsen/commit/402f4a2b2c30b98626c9fd918816c5bbcbcf33af))

### BREAKING CHANGES

- Now you must consume like `import { comb } from ...`

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
