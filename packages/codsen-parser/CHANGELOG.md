# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 0.8.0 (2020-11-28)


### Bug Fixes

* correctly nest empty tags ([380c268](https://git.sr.ht/~royston/codsen/commits/380c26893d8cd05e2d07c7d6110167183cf8cce0))
* harden the eslint rules set, make all tests pass and rebase a little ([40cf4b9](https://git.sr.ht/~royston/codsen/commits/40cf4b9dcb2dd1beca40d4ad4f72a9c9b07c5ad4))
* missing tag opening rule - demand that closing tag's previous tag would be not closing ([ceff20b](https://git.sr.ht/~royston/codsen/commits/ceff20b01d27debd4e789150504e7488c9fdbc12))
* nested tags ([5846347](https://git.sr.ht/~royston/codsen/commits/584634757cf5514f3db9c3b20c211f7f855aa7e8))
* nesting fix - closing tags don't next text tokens that follow ([de384b5](https://git.sr.ht/~royston/codsen/commits/de384b5a3e89f6521cc4c080da1f9de3ebe96f4f))
* tend the layer endings properly ([c563d2a](https://git.sr.ht/~royston/codsen/commits/c563d2a73955a5d45ec4af54b34a2de36ae72ce5))
* update tests to the latest tokenizer api ([5b46ff0](https://git.sr.ht/~royston/codsen/commits/5b46ff094d714bf25ceaf1808fa201a7dd9334b8))


### Features

* algorithm improvements for broken tag pairs ([0a65546](https://git.sr.ht/~royston/codsen/commits/0a65546f4b2f0b9427dca646a6b8a69e2f6f1d3c))
* algorithm improvements to tackle cases of rogue tag being in place of another tag ([6dde396](https://git.sr.ht/~royston/codsen/commits/6dde3963d2c745f6270b0d4f005ae2f426cae886))
* assembles AST of nested tags ([2a85a06](https://git.sr.ht/~royston/codsen/commits/2a85a06afd1e9d9512c63ce5e5f86ee636caa1d2))
* catch even more broken closing comment cases ([edf1bae](https://git.sr.ht/~royston/codsen/commits/edf1baed7fbed1fb4d90162f1e27bc1e0eec6563))
* don't nest under rogue opening tags ([54e0947](https://git.sr.ht/~royston/codsen/commits/54e0947d3fd6de81347345571c6d04669124865b))
* don't put tag names that dont have closings into layers ([58f528c](https://git.sr.ht/~royston/codsen/commits/58f528c69bde19885ec6eb44d7bbc59782fc80ea))
* empty tag pair, one opening one closing tag ([47b212d](https://git.sr.ht/~royston/codsen/commits/47b212d2ba3c479ae5df422b58883cd99d7adae4))
* extend missing closing tag rules to comment tags ([50996e5](https://git.sr.ht/~royston/codsen/commits/50996e56ceafdb0ed6474d023b5971ec8cc266a9))
* first case of missing closing tag, `<table><tr><td>x</td></tr>` ([ce439f0](https://git.sr.ht/~royston/codsen/commits/ce439f09d815c1ad9c94ce806030f5020fec44f9))
* improve the algorithm to recognise missing closing tag ([c56363f](https://git.sr.ht/~royston/codsen/commits/c56363f7b78d38dde8e76c4c73bb2af755392bcb))
* improve the comment tag recognition, also broken "->" recognition ([49a2ddc](https://git.sr.ht/~royston/codsen/commits/49a2ddc9b6f6e14c3c9e36c03c2352e90149979e))
* init ([310c617](https://git.sr.ht/~royston/codsen/commits/310c6174d21cb95fc87507e0a611f29968d6d1ba))
* nest commment tags how it should be done ([5f132a4](https://git.sr.ht/~royston/codsen/commits/5f132a45e20eb7bd8ec0472a8094a6350d76ced7))
* new error rule, `tag-void-frontal-slash` ([6a93052](https://git.sr.ht/~royston/codsen/commits/6a930521f5a7f11f0a57183006d19bae29c013ff))
* new error, `tag-missing-opening` ([a24adae](https://git.sr.ht/~royston/codsen/commits/a24adae568c75079f8205df198c95bcb1c66d524))
* push all kinds of opening tokens into layers, not just comment-type ([2dc552d](https://git.sr.ht/~royston/codsen/commits/2dc552de19d720841463f3aec585532015726c4d))
* recognise malformed front part of "not" kind comment in preceding text token ([b388754](https://git.sr.ht/~royston/codsen/commits/b388754b0a1a54e92ae94e47d0b7f0d14b2a7b4c))
* recognise malformed opening comment tag's first part within nested preceding token ([71092b6](https://git.sr.ht/~royston/codsen/commits/71092b695dd54b8230045af8a4379bd9fa4e20a4))
* rewire tokenizer results to both feed the program and the callbacks in the opts ([e090822](https://git.sr.ht/~royston/codsen/commits/e09082273f9cd82c0f40c48b2079536be8819689))
* update to the latest tokenizer algorithm ([6d92c43](https://git.sr.ht/~royston/codsen/commits/6d92c430d23a116a7c4a643b3caf92b1c785a515))
* update to the tokenizer's latest api ([29134fa](https://git.sr.ht/~royston/codsen/commits/29134fa826203dda8dac40863253a8415b23484f))





## 0.7.9 (2020-10-19)

### Bug Fixes

- update tests to the latest tokenizer api ([5b46ff0](https://gitlab.com/codsen/codsen/commit/5b46ff094d714bf25ceaf1808fa201a7dd9334b8))

## 0.7.0 (2020-05-24)

### Features

- update to the latest tokenizer algorithm ([6d92c43](https://gitlab.com/codsen/codsen/commit/6d92c430d23a116a7c4a643b3caf92b1c785a515))

## 0.6.5 (2020-05-11)

### Bug Fixes

- nesting fix - closing tags don't next text tokens that follow ([de384b5](https://gitlab.com/codsen/codsen/commit/de384b5a3e89f6521cc4c080da1f9de3ebe96f4f))

## 0.6.2 (2020-04-26)

### Bug Fixes

- harden the eslint rules set, make all tests pass and rebase a little ([40cf4b9](https://gitlab.com/codsen/codsen/commit/40cf4b9dcb2dd1beca40d4ad4f72a9c9b07c5ad4))

## 0.6.0 (2020-04-19)

### Features

- don't nest under rogue opening tags ([54e0947](https://gitlab.com/codsen/codsen/commit/54e0947d3fd6de81347345571c6d04669124865b))

## 0.5.0 (2020-04-04)

### Bug Fixes

- tend the layer endings properly ([c563d2a](https://gitlab.com/codsen/codsen/commit/c563d2a73955a5d45ec4af54b34a2de36ae72ce5))

### Features

- algorithm improvements to tackle cases of rogue tag being in place of another tag ([6dde396](https://gitlab.com/codsen/codsen/commit/6dde3963d2c745f6270b0d4f005ae2f426cae886))
- don't put tag names that dont have closings into layers ([58f528c](https://gitlab.com/codsen/codsen/commit/58f528c69bde19885ec6eb44d7bbc59782fc80ea))
- first case of missing closing tag, `<table><tr><td>x</td></tr>` ([ce439f0](https://gitlab.com/codsen/codsen/commit/ce439f09d815c1ad9c94ce806030f5020fec44f9))
- improve the algorithm to recognise missing closing tag ([c56363f](https://gitlab.com/codsen/codsen/commit/c56363f7b78d38dde8e76c4c73bb2af755392bcb))
- push all kinds of opening tokens into layers, not just comment-type ([2dc552d](https://gitlab.com/codsen/codsen/commit/2dc552de19d720841463f3aec585532015726c4d))

## 0.4.0 (2020-03-24)

### Bug Fixes

- correctly nest empty tags ([380c268](https://gitlab.com/codsen/codsen/commit/380c26893d8cd05e2d07c7d6110167183cf8cce0))

### Features

- new error rule, `tag-void-frontal-slash` ([6a93052](https://gitlab.com/codsen/codsen/commit/6a930521f5a7f11f0a57183006d19bae29c013ff))

## 0.3.0 (2020-03-16)

### Features

- catch even more broken closing comment cases ([edf1bae](https://gitlab.com/codsen/codsen/commit/edf1baed7fbed1fb4d90162f1e27bc1e0eec6563))
- improve the comment tag recognition, also broken "->" recognition ([49a2ddc](https://gitlab.com/codsen/codsen/commit/49a2ddc9b6f6e14c3c9e36c03c2352e90149979e))
- recognise malformed front part of "not" kind comment in preceding text token ([b388754](https://gitlab.com/codsen/codsen/commit/b388754b0a1a54e92ae94e47d0b7f0d14b2a7b4c))
- recognise malformed opening comment tag's first part within nested preceding token ([71092b6](https://gitlab.com/codsen/codsen/commit/71092b695dd54b8230045af8a4379bd9fa4e20a4))

## 0.2.0 (2020-02-24)

### Bug Fixes

- missing tag opening rule - demand that closing tag's previous tag would be not closing ([ceff20b](https://gitlab.com/codsen/codsen/commit/ceff20b01d27debd4e789150504e7488c9fdbc12))
- nested tags ([5846347](https://gitlab.com/codsen/codsen/commit/584634757cf5514f3db9c3b20c211f7f855aa7e8))

### Features

- empty tag pair, one opening one closing tag ([47b212d](https://gitlab.com/codsen/codsen/commit/47b212d2ba3c479ae5df422b58883cd99d7adae4))
- extend missing closing tag rules to comment tags ([50996e5](https://gitlab.com/codsen/codsen/commit/50996e56ceafdb0ed6474d023b5971ec8cc266a9))
- nest commment tags how it should be done ([5f132a4](https://gitlab.com/codsen/codsen/commit/5f132a45e20eb7bd8ec0472a8094a6350d76ced7))
- update to the tokenizer's latest api ([29134fa](https://gitlab.com/codsen/codsen/commit/29134fa826203dda8dac40863253a8415b23484f))

## 0.1.0 (2020-02-09)

### Features

- algorithm improvements for broken tag pairs ([0a65546](https://gitlab.com/codsen/codsen/commit/0a65546f4b2f0b9427dca646a6b8a69e2f6f1d3c))
- assembles AST of nested tags ([2a85a06](https://gitlab.com/codsen/codsen/commit/2a85a06afd1e9d9512c63ce5e5f86ee636caa1d2))
- init ([310c617](https://gitlab.com/codsen/codsen/commit/310c6174d21cb95fc87507e0a611f29968d6d1ba))
- new error, `tag-missing-opening` ([a24adae](https://gitlab.com/codsen/codsen/commit/a24adae568c75079f8205df198c95bcb1c66d524))
- rewire tokenizer results to both feed the program and the callbacks in the opts ([e090822](https://gitlab.com/codsen/codsen/commit/e09082273f9cd82c0f40c48b2079536be8819689))

## Change Log

## 0.0.1 (2020-02-02)

- ✨ First public release.
