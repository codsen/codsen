# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
