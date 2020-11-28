# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 1.7.0 (2020-11-28)

### Bug Fixes

- disable min char count setting so it's off by default ([60aa23c](https://git.sr.ht/~royston/codsen/commits/60aa23c86ba4184eb96a7ab1c6253bd376a5bef8))
- fix a case where nbsp could be replaced with itself ([7ca664a](https://git.sr.ht/~royston/codsen/commits/7ca664af2ab4c2408b4639cfd5331762698699e5))
- fix word count bug when raw non-breaking spaces are involved ([9201be0](https://git.sr.ht/~royston/codsen/commits/9201be02b3b929fda73f6f7b70ee3503bf698954))
- further twaks to m-dash rules ([bec2683](https://git.sr.ht/~royston/codsen/commits/bec268370f10c9daa0891894c7eeb3f9a0f0a15c))
- properly recognise single line breaks, not counts are reset correctly ([ec5578b](https://git.sr.ht/~royston/codsen/commits/ec5578be5cc481c3b44cdcf8ec300643d9b7e794))
- remove rogue require() which was present instead of import ([233a8d1](https://git.sr.ht/~royston/codsen/commits/233a8d11d70f62c7a521e97207acfdb3b64d5f63))

### Features

- add opts.ignore option "all" ([a02dc78](https://git.sr.ht/~royston/codsen/commits/a02dc78559289bca2f9150a743642b41941ac70d))
- add opts.tagRanges ([662bd6e](https://git.sr.ht/~royston/codsen/commits/662bd6eb3881d34997aa76a94c3f8bf43928a9cd))
- enforce that nbsp's in front of dashes would be added only if whitespace follows that dash ([9b23232](https://git.sr.ht/~royston/codsen/commits/9b232323954ec0d162b56b317d8bdddf72511340))
- harden the linting rules set and rebase a little ([2988292](https://git.sr.ht/~royston/codsen/commits/29882925c521853f4458112b72669ec8b2a0cb5b))
- improvements to the algorithm ([8a37c1d](https://git.sr.ht/~royston/codsen/commits/8a37c1d95014837ebff49da5aa8d535bad679149))
- init ([29000b2](https://git.sr.ht/~royston/codsen/commits/29000b28c8daa9de545457d3ababd9fcfb3f68bd))
- opts.reportProgressFuncFrom and opts.reportProgressFuncTo ([751c8d7](https://git.sr.ht/~royston/codsen/commits/751c8d79edb575dd09ec5ea69b7a5ebd55bd1915))
- reporting res.whatWasDone - widow removal, decoding or both or neither ([630a08d](https://git.sr.ht/~royston/codsen/commits/630a08de1a26d719c8f15f20b5f5e52eb8a41d19))

## 1.6.0 (2020-04-26)

### Features

- harden the linting rules set and rebase a little ([2988292](https://gitlab.com/codsen/codsen/commit/29882925c521853f4458112b72669ec8b2a0cb5b))

## 1.5.2 (2019-10-21)

### Bug Fixes

- remove rogue require() which was present instead of import ([233a8d1](https://gitlab.com/codsen/codsen/commit/233a8d11d70f62c7a521e97207acfdb3b64d5f63))

## 1.5.0 (2019-10-02)

### Bug Fixes

- fix a case where nbsp could be replaced with itself ([7ca664a](https://gitlab.com/codsen/codsen/commit/7ca664a))

### Features

- reporting res.whatWasDone - widow removal, decoding or both or neither ([630a08d](https://gitlab.com/codsen/codsen/commit/630a08d))

## 1.4.0 (2019-09-11)

### Bug Fixes

- properly recognise single line breaks, not counts are reset correctly ([ec5578b](https://gitlab.com/codsen/codsen/commit/ec5578b))

### Features

- add opts.ignore option "all" ([a02dc78](https://gitlab.com/codsen/codsen/commit/a02dc78))
- improvements to the algorithm ([8a37c1d](https://gitlab.com/codsen/codsen/commit/8a37c1d))

## 1.3.0 (2019-09-04)

### Features

- add opts.tagRanges ([662bd6e](https://gitlab.com/codsen/codsen/commit/662bd6e))

## 1.2.0 (2019-08-18)

### Bug Fixes

- disable min char count setting so it's off by default ([60aa23c](https://gitlab.com/codsen/codsen/commit/60aa23c))
- further twaks to m-dash rules ([bec2683](https://gitlab.com/codsen/codsen/commit/bec2683))

### Features

- enforce that nbsp's in front of dashes would be added only if whitespace follows that dash ([9b23232](https://gitlab.com/codsen/codsen/commit/9b23232))

## 1.1.0 (2019-08-08)

### Features

- init ([29000b2](https://gitlab.com/codsen/codsen/commit/29000b2))
- opts.reportProgressFuncFrom and opts.reportProgressFuncTo ([751c8d7](https://gitlab.com/codsen/codsen/commit/751c8d7))

## 1.0.0 (2019-08-07)

- ✨ First public release
