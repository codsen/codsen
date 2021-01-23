# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 0.16.0 (2021-01-23)


### Bug Fixes

* Bail early if CLI app is detected, stop assembling Rollup config ([84210fa](https://github.com/codsen/codsen/commit/84210fa88fc793e05d9c57f71ece0a2669bf717a))
* Fix the Create New Issue URLs ([f5a41bf](https://github.com/codsen/codsen/commit/f5a41bf16fd8f43de7f8e7de68da562821ddb960))
* fix the json files as external dependencies in rollup configs ([eb3253b](https://github.com/codsen/codsen/commit/eb3253b33708561c4b12fd84c338a22e1b5b2af1))
* remove pify dependency which is unused here ([2f0c3af](https://github.com/codsen/codsen/commit/2f0c3af3c7bebf5ffd003858abcbae59d9e8f214))
* Remove unused getUserInfo ([d472e51](https://github.com/codsen/codsen/commit/d472e51ed9673b83366522d218549e4a692f0eed))


### Features

* Adapt codebase to support GitLab + hard write package.json keys from config ([be47ca5](https://github.com/codsen/codsen/commit/be47ca53a9847e2fbfa6525b008eb32dfae40379))
* add insurance against consumed variable name matching package's name ([529488c](https://github.com/codsen/codsen/commit/529488c1a033c2a9f2bd7a48283047d574897d45))
* add nyc/istanbul ignore comments to be retained during the cleanup in Rollup builds ([1813c00](https://github.com/codsen/codsen/commit/1813c0071baa6a1530b9e2b0c78746289b66aacf))
* Customise the EMLint letter case ([598285f](https://github.com/codsen/codsen/commit/598285febcac1777e20f49dd3d371042a37a4a47))
* Early exit if private package is detected ([6b8ed2a](https://github.com/codsen/codsen/commit/6b8ed2adc71b258f85e1403d285a06606292bef8))
* Exclude non-CLI devdeps from CLI packages ([70b9dfc](https://github.com/codsen/codsen/commit/70b9dfcbcca1fca89c769091da33587e66d67f20))
* Fix the dependency versions caching ([4a0f0be](https://github.com/codsen/codsen/commit/4a0f0be126b675c890ce8ecb174abc69a22c8b86))
* Fix TOC slugs to suit GitLab ([c6be7bd](https://github.com/codsen/codsen/commit/c6be7bdc78a9659eb7d9231dbb606afa4022256d))
* Improvements to issue presets ([7fea794](https://github.com/codsen/codsen/commit/7fea7949f9c831232e49d8001bfb7d4ba15504c9))
* Initial release ([3e9eb06](https://github.com/codsen/codsen/commit/3e9eb06e2caea78aea6722615c11ed7b92e69345))
* rebase heavily, prepare for TS, remove many deps, simplify the setup ([fa7ad89](https://github.com/codsen/codsen/commit/fa7ad89678a2613730108e9e39641c2053ac0d9c))
* stop managing package.json scripts automatically on special packages (such as EMLint) ([3af12d6](https://github.com/codsen/codsen/commit/3af12d6b53d367c328a22e4790b339c6539bbcb0))
* switch to sort-package-json (from format-package) ([33af735](https://github.com/codsen/codsen/commit/33af7357c9b685dee009a2480545386a539d4be0))
* tap @rollup/plugin-babel instead in the generator ([75c9d7b](https://github.com/codsen/codsen/commit/75c9d7b77cf11d60e861d1adf80f7f0205fe35c3))
* unrecognised file/folder entries for npmignore are now manually set ([b264814](https://github.com/codsen/codsen/commit/b264814d633243fdd88fb86bda217c8cd303a9a0))
* When generating rollup config, add node globals if they're requested in devdependencies in pac ([c15149d](https://github.com/codsen/codsen/commit/c15149da18fc2464c65dfa6afe1215ddb7ee9279))
* when there are no dependencies, don't show "Deps in 2D" badge, show "no deps" badge ([ce3410a](https://github.com/codsen/codsen/commit/ce3410ac99d42313173d6fed2994943196e754c4))





## 0.16.0 (2020-12-16)

We edited the lect CLI sporadically over years and never had a rebasing, a reorganisation. Well, that time has came. All functions were separated into files within `./src/`. Also, all file writes are now [atomic](https://www.npmjs.com/package/write-file-atomic).

Removed:

- various package.json-based lect settings — now package.json is used mainly for whitelisting `devdeps` and setting the import example string for instructions.
- many packages, both unused and (previously) used

Added:

- the whole pipeline is now tailored for TypeScript, Rollup config is generated accordingly

## 0.15.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 0.14.0 (2020-09-15)

### Features

- switch from `format-package` to `sort-package-json` ([4c0df1c](https://gitlab.com/codsen/codsen/commit/4c0df1c25d4cdf85c40d497965f0f968eec006a1))

## 0.13.0 (2020-05-06)

### Features

- tap @rollup/plugin-babel instead in the generator ([05dd7d9](https://gitlab.com/codsen/codsen/commit/05dd7d9b16f7882cf9ec8548db8e6ca02f86e0a7))

## 0.12.0 (2020-01-26)

### Features

- when there are no dependencies, don't show "Deps in 2D" badge, show "no deps" badge ([4f31c56](https://gitlab.com/codsen/codsen/commit/4f31c56e284b0420dc01bffa057e1fe4556c77e2))

## 0.11.0 (2019-11-18)

### Features

- stop managing package.json scripts automatically on special packages (such as EMLint) ([9e0b9b8](https://gitlab.com/codsen/codsen/commit/9e0b9b86d876086e5f7f6ef76304c771d0cc9a3c))

## 0.10.2 (2019-10-21)

### Bug Fixes

- fix the json files as external dependencies in rollup configs ([2c85f82](https://gitlab.com/codsen/codsen/commit/2c85f82e41a4af8cbf56edb610eeb5daec9292b2))

## 0.10.0 (2019-10-05)

### Bug Fixes

- remove pify dependency which is unused here ([30a0fb2](https://gitlab.com/codsen/codsen/commit/30a0fb2))

### Features

- add nyc/istanbul ignore comments to be retained during the cleanup in Rollup builds ([9dbd43f](https://gitlab.com/codsen/codsen/commit/9dbd43f))

## 0.9.0 (2019-07-24)

### Features

- add insurance against consumed variable name matching package's name ([414a52f](https://gitlab.com/codsen/codsen/commit/414a52f))
- When generating rollup config, add node globals if they're requested in devdependencies in pac ([1ec2e6a](https://gitlab.com/codsen/codsen/commit/1ec2e6a))

## 0.8.0 (2019-07-19)

### Features

- Early exit if private package is detected ([cc956d8](https://gitlab.com/codsen/codsen/commit/cc956d8))

## 0.7.0 (2019-06-01)

### Bug Fixes

- Bail early if CLI app is detected, stop assembling Rollup config ([a141172](https://gitlab.com/codsen/codsen/commit/a141172))
- Remove unused getUserInfo ([a07ac61](https://gitlab.com/codsen/codsen/commit/a07ac61))

### Features

- Exclude non-CLI devdeps from CLI packages ([20afe7a](https://gitlab.com/codsen/codsen/commit/20afe7a))

## 0.6.0 (2019-06-01)

### Features

- Fix the dependency versions caching ([439c97d](https://gitlab.com/codsen/codsen/commit/439c97d))
- Improvements to issue presets ([0e2c2eb](https://gitlab.com/codsen/codsen/commit/0e2c2eb))

## 0.5.0 (2019-02-05)

### Features

- Customise the EMLint letter case ([43a4d85](https://gitlab.com/codsen/codsen/commit/43a4d85))
- Fix TOC slugs to suit GitLab ([4264c07](https://gitlab.com/codsen/codsen/commit/4264c07))

## 0.4.0 (2019-02-01)

### Features

- Adapt codebase to support GitLab + hard write package.json keys from config ([254b415](https://gitlab.com/codsen/codsen/commit/254b415))

## 0.3.0 (2019-01-27)

### Features

- Initial release ([35292b8](https://gitlab.com/codsen/codsen/tree/master/packages/lect/commits/35292b8))

## 0.2.0 (2019-01-27)

### Features

- Initial release ([35292b8](https://gitlab.com/codsen/codsen/tree/master/packages/lect/commits/35292b8))

## Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## 0.1.0 - 2019-01-27

### New

- First public release
