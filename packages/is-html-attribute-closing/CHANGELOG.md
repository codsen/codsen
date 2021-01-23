# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 2.0.0 (2021-01-23)

### Features

- rewrite in TS, start using named exports ([6a8cf5a](https://github.com/codsen/codsen/commit/6a8cf5aa6a6eb1c678513c39a6d0efe16e07d6bf))

### BREAKING CHANGES

- previously, you'd consume like: `import isAttrClosing from ...` - now `import { isAttrClosing } from ...`

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
