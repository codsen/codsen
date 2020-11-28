# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 0.15.0 (2020-11-28)

### Bug Fixes

- Bail early if CLI app is detected, stop assembling Rollup config ([a141172](https://git.sr.ht/~royston/codsen/commits/a141172a887437f34c735ac8d95afce8d7363dfe))
- Fix the Create New Issue URLs ([c5ee4a6](https://git.sr.ht/~royston/codsen/commits/c5ee4a61e9436099b0e20d20bca043c1b2c93f55))
- fix the json files as external dependencies in rollup configs ([2c85f82](https://git.sr.ht/~royston/codsen/commits/2c85f82e41a4af8cbf56edb610eeb5daec9292b2))
- remove pify dependency which is unused here ([30a0fb2](https://git.sr.ht/~royston/codsen/commits/30a0fb2197bef40814c80b16da886c7dfd638cda))
- Remove unused getUserInfo ([a07ac61](https://git.sr.ht/~royston/codsen/commits/a07ac610bf836dbcd0726e12ea7665764f8f9976))

### Features

- Adapt codebase to support GitLab + hard write package.json keys from config ([254b415](https://git.sr.ht/~royston/codsen/commits/254b415a251030cef3b76e0f6338ca7640d7f734))
- add insurance against consumed variable name matching package's name ([414a52f](https://git.sr.ht/~royston/codsen/commits/414a52ff9641e2d2e669659306b67e70a2f6adcc))
- add nyc/istanbul ignore comments to be retained during the cleanup in Rollup builds ([9dbd43f](https://git.sr.ht/~royston/codsen/commits/9dbd43fbb7e2a37bc96696d4c923bde42acd939b))
- Customise the EMLint letter case ([43a4d85](https://git.sr.ht/~royston/codsen/commits/43a4d85cc99846b3482b49308c4e9a72496f4e0d))
- Early exit if private package is detected ([cc956d8](https://git.sr.ht/~royston/codsen/commits/cc956d8e2bda7ad76576192da871112be803a257))
- Exclude non-CLI devdeps from CLI packages ([20afe7a](https://git.sr.ht/~royston/codsen/commits/20afe7ab480731e8717c54f5c674279e3dc6a8b7))
- Fix the dependency versions caching ([439c97d](https://git.sr.ht/~royston/codsen/commits/439c97d9aa93f8aa1c9e148cf2977940c9b7d12e))
- Fix TOC slugs to suit GitLab ([4264c07](https://git.sr.ht/~royston/codsen/commits/4264c07db1ab81e1bee31257be2b5ed2c1622ea7))
- Improvements to issue presets ([0e2c2eb](https://git.sr.ht/~royston/codsen/commits/0e2c2ebb8c36b938d54af87e43d7b029f30ad16d))
- Initial release ([35292b8](https://git.sr.ht/~royston/codsen/commits/35292b84de5a861ed32b17d8923e662e0d9a8022))
- stop managing package.json scripts automatically on special packages (such as EMLint) ([9e0b9b8](https://git.sr.ht/~royston/codsen/commits/9e0b9b86d876086e5f7f6ef76304c771d0cc9a3c))
- switch to sort-package-json (from format-package) ([4c0df1c](https://git.sr.ht/~royston/codsen/commits/4c0df1c25d4cdf85c40d497965f0f968eec006a1))
- tap @rollup/plugin-babel instead in the generator ([05dd7d9](https://git.sr.ht/~royston/codsen/commits/05dd7d9b16f7882cf9ec8548db8e6ca02f86e0a7))
- When generating rollup config, add node globals if they're requested in devdependencies in pac ([1ec2e6a](https://git.sr.ht/~royston/codsen/commits/1ec2e6a7dbfc31384caca548a8240a8f4a687488))
- when there are no dependencies, don't show "Deps in 2D" badge, show "no deps" badge ([4f31c56](https://git.sr.ht/~royston/codsen/commits/4f31c56e284b0420dc01bffa057e1fe4556c77e2))

## 0.14.0 (2020-09-15)

### Features

- switch to sort-package-json (from format-package) ([4c0df1c](https://gitlab.com/codsen/codsen/commit/4c0df1c25d4cdf85c40d497965f0f968eec006a1))

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
