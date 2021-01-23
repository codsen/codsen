# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 2.0.0 (2021-01-23)


### Bug Fixes

* 11 / 677 ([66e8508](https://github.com/codsen/codsen/commit/66e85081df6bf19450c1df3b9f396743073be549))
* 12 / 923 ([8bec6ec](https://github.com/codsen/codsen/commit/8bec6ecd5084903470ca52cc8e6520e65c82bd83))
* 14 / 923 ([02445a8](https://github.com/codsen/codsen/commit/02445a8745e42b1711233ded5a2fb6b01ec58650))
* 3 / 1021 ([cb0874e](https://github.com/codsen/codsen/commit/cb0874e0322c91f43ee9143aa034c01aab91da9a))
* 3 / 929 ([17ccb27](https://github.com/codsen/codsen/commit/17ccb270121a4173f818565fd730f0ff3bbdab55))
* 5/553 ([7606ea2](https://github.com/codsen/codsen/commit/7606ea265b185a6bad3a42b3b02b2110048eb503))
* 6 / 923 ([7b43a4c](https://github.com/codsen/codsen/commit/7b43a4c222a200f3a67ca8f1ff98ea172dd4054a))
* 7 / 929 ([a24b0f0](https://github.com/codsen/codsen/commit/a24b0f0960dd63f8b4606fdf084dbdbab90a5c3d))
* 7/553 ([6c2baf3](https://github.com/codsen/codsen/commit/6c2baf3e1b9749b3fddf7c4feaf87168f4fe0827))
* 8 / 923 ([eeeb849](https://github.com/codsen/codsen/commit/eeeb849e5d6864b3186163a0a89d20c0f88f9873))
* correctly interpret equal chars inside urls ([14d0228](https://github.com/codsen/codsen/commit/14d0228786ab1dec9c3d93c02cc89b76db44cd95))
* fix few false positive cases ([656dd79](https://github.com/codsen/codsen/commit/656dd79ee51730a391389d64ee8a41812e899002))
* make all 01.* group tests pass ([8170b43](https://github.com/codsen/codsen/commit/8170b436b3a1673625065b2cf7ed0491910c6ebb))
* make all 08.* group tests pass ([f60857a](https://github.com/codsen/codsen/commit/f60857ad0d86a555bc199beae18087764c21477b))
* make all 1021 tests pass ([9934874](https://github.com/codsen/codsen/commit/9934874fa0a72a0c56e68b5356caae67648553b9))
* make all tests pass ([8bf7068](https://github.com/codsen/codsen/commit/8bf7068b0cf570f702e352e12de1738fe736d8bc))


### Features

* algorithm improvements ([773b516](https://github.com/codsen/codsen/commit/773b5162645d42b5b15bfa216e6b4d60c2ce6acc))
* improve the mismatching quote recognition ([f9c5f1b](https://github.com/codsen/codsen/commit/f9c5f1bb9a4a17c3b673da5b45a1b7637cc6aa14))
* improve the safeguards against legit equal characters ([c34b0e9](https://github.com/codsen/codsen/commit/c34b0e9d0bc9b7b9000de7c6e383f36405c710c2))
* improvements to mismatching HTML attribute quote pair recognition ([a47bcb5](https://github.com/codsen/codsen/commit/a47bcb56a13a851ec33bf88a342a0c4236380ff6))
* initial scaffolding ([79abae3](https://github.com/codsen/codsen/commit/79abae36c3b0fb31b803d761f5989dacd4ab7bd3))
* insurance against the Killer Triplet ([7482cc2](https://github.com/codsen/codsen/commit/7482cc289f52fd8843d7a00a07e3b985849bab87))
* recognise missing tag closing brackets ([bc55d49](https://github.com/codsen/codsen/commit/bc55d497320eed8d18177113318a3be22e145027))
* recognise nested rogue quote pairs inside attr values ([c8ff4ee](https://github.com/codsen/codsen/commit/c8ff4eee9bc5697e38d1720385315522460ef10e))
* recognise repeated (even spaced) equal signs in front of attributes ([4616b6f](https://github.com/codsen/codsen/commit/4616b6f51044ddd872571f97c948713b33960650))
* rewrite in TS, start using named exports ([6a8cf5a](https://github.com/codsen/codsen/commit/6a8cf5aa6a6eb1c678513c39a6d0efe16e07d6bf))
* starting index is not on a quote; attribute is missing opening quote ([3d526b7](https://github.com/codsen/codsen/commit/3d526b7ad0a0f57d2e0459d29437545a08aaed86))


### BREAKING CHANGES

* previously: "import isAttrClosing from ..." - now "import { isAttrClosing } from
..."





## 1.5.0 (2020-12-11)

### Bug Fixes

- correctly interpret equal chars inside urls ([71f8dcf](https://git.sr.ht/~royston/codsen/commit/71f8dcf33eb1df1e6781979720ae5e0420a062f8))

### Features

- improve the safeguards against legit equal characters ([d1b34fa](https://git.sr.ht/~royston/codsen/commit/d1b34fa89bd07e03bdb407477a02fa1bc6f119b9))

## 1.4.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 1.3.0 (2020-10-12)

### Features

- algorithm improvements ([e2b2471](https://gitlab.com/codsen/codsen/commit/e2b2471cd069ca242f3c906542750016ce5f2385))
- recognise nested rogue quote pairs inside attr values ([7366a63](https://gitlab.com/codsen/codsen/commit/7366a6300f8ce2a4b6d5df63c9a910f505c64116))

## 1.2.0 (2020-05-17)

### Features

- insurance against the Killer Triplet ([21c64a2](https://gitlab.com/codsen/codsen/commit/21c64a2fbba5c2e5edc2cdb1fcfbd2c81c6ee67a))

## 1.1.0 (2020-04-13)

### Features

- initial scaffolding ([5968866](https://gitlab.com/codsen/codsen/commit/5968866db6702dba9031b7633e3be92eb0d62d5c))
- improve the mismatching quote recognition ([967bd66](https://gitlab.com/codsen/codsen/commit/967bd66ee2a9b4ff9414d1cca715569f5c677ff6))
- improvements to mismatching HTML attribute quote pair recognition ([050dbe0](https://gitlab.com/codsen/codsen/commit/050dbe02569d98c2741aca00fed990004c22eeb2))
- recognise missing tag closing brackets ([2639868](https://gitlab.com/codsen/codsen/commit/26398686dfffafd069fd25577f69009d5a27f2f9))
- recognise repeated (even spaced) equal signs in front of attributes ([a1fa244](https://gitlab.com/codsen/codsen/commit/a1fa2444167c5471e04860af9d3ec15f946a2489))
- starting index is not on a quote; attribute is missing opening quote ([795d3a8](https://gitlab.com/codsen/codsen/commit/795d3a85e3a3a0b46b2ce3f62e93ee3db8f0610e))
