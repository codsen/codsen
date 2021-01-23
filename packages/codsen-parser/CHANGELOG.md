# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 0.9.0 (2021-01-23)


### Bug Fixes

* correctly nest empty tags ([63c40e5](https://github.com/codsen/codsen/commit/63c40e580a219d86c8e247b510d233b2ce80b15e))
* harden the eslint rules set, make all tests pass and rebase a little ([8c026c2](https://github.com/codsen/codsen/commit/8c026c2101f16ad45d82011e686bfa1d8ab1c33f))
* missing tag opening rule - demand that closing tag's previous tag would be not closing ([8d55b75](https://github.com/codsen/codsen/commit/8d55b75fa1129d5ee667524cdf7a0e624ceeb045))
* nested tags ([1aec4c9](https://github.com/codsen/codsen/commit/1aec4c9cb0fcf511661060a160278dce680f3229))
* nesting fix - closing tags don't next text tokens that follow ([5348ed2](https://github.com/codsen/codsen/commit/5348ed2b931870a8ad2be4a26713e956ccfbc2bc))
* tend the layer endings properly ([8fe96ba](https://github.com/codsen/codsen/commit/8fe96ba6613733c5cba9672330c55dcf7e442661))
* update tests to the latest tokenizer api ([83221e1](https://github.com/codsen/codsen/commit/83221e14b41d91ca571bd124177d34e92cd58f3f))


### Features

* algorithm improvements for broken tag pairs ([96d79de](https://github.com/codsen/codsen/commit/96d79de2a4c55691e723171d28c8a6cf263ed34b))
* algorithm improvements to tackle cases of rogue tag being in place of another tag ([2144190](https://github.com/codsen/codsen/commit/214419095a250be33b42c91d0f67d4c62097d380))
* assembles AST of nested tags ([aeb76e0](https://github.com/codsen/codsen/commit/aeb76e0d7d177034c41dbba88fd648a5218023f4))
* catch even more broken closing comment cases ([a051292](https://github.com/codsen/codsen/commit/a051292306b933c2ac62d1f55a669afc925cce97))
* don't nest under rogue opening tags ([e8e1d7b](https://github.com/codsen/codsen/commit/e8e1d7b9e58520a32ec41a8296a77e268de2db71))
* don't put tag names that dont have closings into layers ([eefea2e](https://github.com/codsen/codsen/commit/eefea2ebfff2ddc01e6b30d46ce0857ee3164706))
* empty tag pair, one opening one closing tag ([2080dce](https://github.com/codsen/codsen/commit/2080dce52359343609360810f08f557ea9f1f530))
* extend missing closing tag rules to comment tags ([903b108](https://github.com/codsen/codsen/commit/903b1085b6ed08584543d0502543ebb0f72abd27))
* first case of missing closing tag, `<table><tr><td>x</td></tr>` ([55138be](https://github.com/codsen/codsen/commit/55138be38ca28acbea7de2be193a424b9a05c6c5))
* improve the algorithm to recognise missing closing tag ([35db247](https://github.com/codsen/codsen/commit/35db2476a3ed49905c5256b4ed1475f86d5fea2c))
* improve the comment tag recognition, also broken "->" recognition ([7fb073f](https://github.com/codsen/codsen/commit/7fb073f12826806d1840db918fd5f71e2d0a8e51))
* init ([523b45f](https://github.com/codsen/codsen/commit/523b45f6589debb318f6d548de461935649df18e))
* nest commment tags how it should be done ([3a24373](https://github.com/codsen/codsen/commit/3a24373ee9d587b319e62fafd12e5385bd6ef1da))
* new error rule, `tag-void-frontal-slash` ([36ab424](https://github.com/codsen/codsen/commit/36ab42488cc29718c69ff732373d53e7037e462a))
* new error, `tag-missing-opening` ([9af98b6](https://github.com/codsen/codsen/commit/9af98b6b95c35768cda29ceddb4fbabd98460461))
* push all kinds of opening tokens into layers, not just comment-type ([666b071](https://github.com/codsen/codsen/commit/666b07143d3e6c78ca07878061cddb8fc0603903))
* recognise malformed front part of "not" kind comment in preceding text token ([5e9ffd7](https://github.com/codsen/codsen/commit/5e9ffd75716c8ba06b657d5b6a8637288b904c31))
* recognise malformed opening comment tag's first part within nested preceding token ([16432d7](https://github.com/codsen/codsen/commit/16432d73cfbd270501473e704621224aae353cf4))
* rewire tokenizer results to both feed the program and the callbacks in the opts ([fb56f48](https://github.com/codsen/codsen/commit/fb56f48212f590e276469e7c270a8cdda1828a08))
* update to the latest tokenizer algorithm ([5e2b294](https://github.com/codsen/codsen/commit/5e2b294dc3294d3031b60e1fed158fe56f74408a))
* update to the tokenizer's latest api ([c344f55](https://github.com/codsen/codsen/commit/c344f55d1143d539bd08f4d3cfa923dba3bbfaf3))





## 0.8.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

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
