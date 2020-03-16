# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.9.0](https://gitlab.com/codsen/codsen/compare/codsen-tokenizer@2.8.0...codsen-tokenizer@2.9.0) (2020-03-16)


### Bug Fixes

* add missing value, token.recognised on the broken tags ([95fd011](https://gitlab.com/codsen/codsen/commit/95fd011fa0e9d9a17ce6fb9806a152670880e0db))
* correct the incomplete simple opening HTML tag token ([08620a6](https://gitlab.com/codsen/codsen/commit/08620a6bd11309e623d0ecd8bad6f8a3d870310e))
* fix correct opening simple HTML comment ranges ([04b88bc](https://gitlab.com/codsen/codsen/commit/04b88bcc3eed6db8a12ceb8d73088342edac776d))
* recognise repeated opening brackets in comment tags ([6d22f81](https://gitlab.com/codsen/codsen/commit/6d22f81b5a0061aef4c969570ea00379e29fb86d))


### Features

* algorithm improvements and some housekeeping ([c479af9](https://gitlab.com/codsen/codsen/commit/c479af90b5bfb1c81dd5733224ecafa1703bc9b7))
* detect opening "if" kind comments without opening square bracket ([607fc23](https://gitlab.com/codsen/codsen/commit/607fc237d33dff4b1702303fc0b74bcd19f4cace))
* improve the recognition to "not" kind conditional opening without closing bracket ([23d6771](https://gitlab.com/codsen/codsen/commit/23d677141b967c6380fb490b72d88955b3e5634c))
* recognise missing opening brackets ([a182bb1](https://gitlab.com/codsen/codsen/commit/a182bb15b95b3c93d6b6d8ba94eff0807d935311))
* recognise tags abruptly ended after tag name ([6398167](https://gitlab.com/codsen/codsen/commit/639816701b826d126eeb633face549b7ffd995a5))





## 2.8.0 (2020-02-24)

### Bug Fixes

- a donothing skip was missing ([b79dafc](https://gitlab.com/codsen/codsen/commit/b79dafce493277df6f68fa9bd9e067e25468fa9e))
- make all tests pass ([2c48aa1](https://gitlab.com/codsen/codsen/commit/2c48aa10247aa81e3defc750853ee7ba52b247c4))
- recognise rule chunks without curly braces (very likely broken) ([f4245a3](https://gitlab.com/codsen/codsen/commit/f4245a3d5ed91c5e5713f4519ff31645ce841b9f))
- set the extracted selector's value to be trimmed in the end too ([1efc1bd](https://gitlab.com/codsen/codsen/commit/1efc1bd7beae29359deacb49fc01d16c86910d0c))
- set XML closing tag kind ([b1ab96f](https://gitlab.com/codsen/codsen/commit/b1ab96f33140bfd0a358a1d5a0fba5eaa43b02f6))

### Features

- add token.value ([3a85934](https://gitlab.com/codsen/codsen/commit/3a859341ca31845d93fc581223cb89cf4ef73cdd))
- allow spaces between comment tokens ([902e5cc](https://gitlab.com/codsen/codsen/commit/902e5cc77a27ff9cf399568c2454f6c5f2459c2e))
- improvements to `startsComment` detection function from util ([9c0e0c0](https://gitlab.com/codsen/codsen/commit/9c0e0c092fc739dabc4b22c913756191c064f2b6))
- include more erroneous comment tag cases to be recognised ([ea41247](https://gitlab.com/codsen/codsen/commit/ea4124782107e508d94f2dca08492001c1359256))
- recognise conditional "evewyehere except" comments (type="comment", kind="not") ([e310798](https://gitlab.com/codsen/codsen/commit/e310798c5e9e10944a9a7f8d72ea838f7cca8501))
- recognise more broken tags and broken comment tags ([72e1e32](https://gitlab.com/codsen/codsen/commit/72e1e3263be167ffa80fdd51a462ed0fa4e6d273))
- recognise outlook/ie conditional comments (kind "only", type "comment") ([5ef68fa](https://gitlab.com/codsen/codsen/commit/5ef68fa793400923e7074f6c62b213b0d6fb361e))
- recognise rogue closing quotes in css ([3be0ec5](https://gitlab.com/codsen/codsen/commit/3be0ec5d70f68b56c104f85adbe6de3ee3ba0ed3))
- simple comment tokens recognised both opening and closing ([bd53904](https://gitlab.com/codsen/codsen/commit/bd5390479e6e38d4b56b48358263e66d0ad42071))

## 2.7.0 (2020-02-09)

### Bug Fixes

- don't ping last undefined character to charCb ([284b50c](https://gitlab.com/codsen/codsen/commit/284b50cdfd968c26b2858a0efd2697a7a7d67d90))
- turn off styleStarts ([def78e0](https://gitlab.com/codsen/codsen/commit/def78e04f960261381c16408bcd19bfe73d77c4c))

### Features

- "rule" token type ([e95c9ab](https://gitlab.com/codsen/codsen/commit/e95c9ab0f9e0fd2d1df629aa13d75d317b310c61))
- extend loop range until length + 1 ([8095bb9](https://gitlab.com/codsen/codsen/commit/8095bb9b5527125c06e61e904c914533f4fff9eb))
- improvements to cdata tag recognition ([b84491b](https://gitlab.com/codsen/codsen/commit/b84491ba6197d75b4614b54f399b3f06621e5e7b))
- single-layer at rules with nested whitespace (text) tokens ([3bc51b5](https://gitlab.com/codsen/codsen/commit/3bc51b5f651fab92985bfe39a7fb7c70ad2425e5))
- tighten up opts input check types ([3b80e1d](https://gitlab.com/codsen/codsen/commit/3b80e1dcccad69c74ca959d7035a8f038baddbb7))

## 2.6.0 (2020-02-01)

### Features

- improvements to unclosed tag recognition ([d861dd4](https://gitlab.com/codsen/codsen/commit/d861dd40fedabb21f922e8ced1bfb45982e407d4))
- missing HTML closing bracket ([c858340](https://gitlab.com/codsen/codsen/commit/c858340f9a95beff746303ca0ac3649f75ab0167))

## 2.5.0 (2020-01-01)

### Bug Fixes

- whole attribute's value can't be an opening or closing ESP lump ([051f2b6](https://gitlab.com/codsen/codsen/commit/051f2b609ea83daab5ba97d3821aac5625b9b9b0))

### Features

- further improvements to attribute value recognition ([313f091](https://gitlab.com/codsen/codsen/commit/313f09175ab393715dcb64ba27d2aa6c09723e1a))

## 2.4.0 (2019-12-27)

### Features

- add recognised attribute flag, "attribNameRecognised" ([71cbe64](https://gitlab.com/codsen/codsen/commit/71cbe6458102263ee5f503d9c288db573f3084e9))
- improvements to the broken attribute recognition algorithm ([408a3c6](https://gitlab.com/codsen/codsen/commit/408a3c6573c8043de2e43aafd4c519bb8973b5fd))
- recognise attribute values not wrapped in quotes ([1b3abcd](https://gitlab.com/codsen/codsen/commit/1b3abcd2ffe5d53eb9dd4f9c7a18b3490f6db1a4))
- recognise missing closing quotes of attribute values ([c39dfde](https://gitlab.com/codsen/codsen/commit/c39dfdec9f86056f463c45bb22e9013603f33cec))
- report tagName as lowercased, for consistency, ranges are still available ([e69efc6](https://gitlab.com/codsen/codsen/commit/e69efc6f9de520584ea808a53de631ec0356cf50))

## 2.3.1 (2019-12-21)

### Bug Fixes

- false positive - repeated percentage within attribute's value pretending to be an ESP tag ([ec36476](https://gitlab.com/codsen/codsen/commit/ec3647690728b99109b2c9ff44407229a283f336))
- html empty attributes logic fix ([a3e507d](https://gitlab.com/codsen/codsen/commit/a3e507d0b29baa3d6d7f92996d97b0c3af076db8))
- recognise rgb() with empty brackets as value of an attr ([69746ec](https://gitlab.com/codsen/codsen/commit/69746ecee702a499c9bdf72d1353a13e812a7504))

## 2.3.0 (2019-12-14)

### Features

- algorithm improvements and more tests ([4d6cf46](https://gitlab.com/codsen/codsen/commit/4d6cf46990a9caf49541767601e6f7ac2a8ab782))

## 2.2.0 (2019-12-09)

### Bug Fixes

- add all h\* tags to recognised list, fix the digit from being skipped ([43cae4f](https://gitlab.com/codsen/codsen/commit/43cae4f95b34f675768b2b2d8b256928a69e8ddc))

### Features

- algorithm improvements, especially around esp literals ([3183d4e](https://gitlab.com/codsen/codsen/commit/3183d4ea3ba32310d4d91e109fcd9cb09c552f55))
- html tag attribute recognition ([5892120](https://gitlab.com/codsen/codsen/commit/5892120458f57c6a8e6442a03f43b8efb58501a2))

## 2.1.0 (2019-11-27)

### Bug Fixes

- fix score calculation ([3601ce2](https://gitlab.com/codsen/codsen/commit/3601ce282fb3f186531198ffb61ad41c1bb3e31b))
- report doctype as recognised ([6967044](https://gitlab.com/codsen/codsen/commit/6967044c5f4649feb6c1194ceb4d8ce4ac4a7741))

### Features

- eSP tag recognition improvements ([5b1c0af](https://gitlab.com/codsen/codsen/commit/5b1c0afe7c2bc9d605e4db1caffc63104a50c995))
- improved broken cdata and doctype recognition ([98880dc](https://gitlab.com/codsen/codsen/commit/98880dc94316681f86d1ef635bbf3212b1dc7936))
- improvements to ESP tag recognition algorithm ([f135f16](https://gitlab.com/codsen/codsen/commit/f135f16984a6383e3efbb9cca8eb9911f0fc67fb))
- report wrong case tag names as recognised (so that we can catch them later in emlint) ([bbd56ec](https://gitlab.com/codsen/codsen/commit/bbd56ecfcbf0d3eabe6f28b1331be0804395fb37))

## 2.0.0 (2019-11-20)

### Features

- character callback ([d8ffbbd](https://gitlab.com/codsen/codsen/commit/d8ffbbde9a07644dbc961f7650f10dd2053b2dfc))
- recognised tags ([f1960f8](https://gitlab.com/codsen/codsen/commit/f1960f8ffa6ebf1f50eb85d6b5b52188d7659d44))

### BREAKING CHANGES

- options argument is now pushed by one place further

## 1.3.0 (2019-11-18)

### Bug Fixes

- improve void tag detection by moving calculation to where tag name is calculated ([5ea548f](https://gitlab.com/codsen/codsen/commit/5ea548f580f6ea6df3e8b72d036781b3bff09d8b))

### Features

- don't end esp token as easily, ensure it's closed using a character from estimated tails ([56d65be](https://gitlab.com/codsen/codsen/commit/56d65be7a46472a914ce8ef3fbb459e6baf706b4))
- void tags are determined evaluating tag's name, not presence of slash ([57d8b4c](https://gitlab.com/codsen/codsen/commit/57d8b4cb81abc4f3dec5cb0dc6d0898bb09806c3))

## 1.2.0 (2019-11-11)

### Features

- self-closing html tags ([afaff20](https://gitlab.com/codsen/codsen/commit/afaff20539623d463e759d1a78a1ba6a45b7f0aa))
- split test groups into files and report tag name for html tokens ([014e792](https://gitlab.com/codsen/codsen/commit/014e792786f69fa09d4771c8e24ea5d90c8a8b75))

## 1.1.0 (2019-11-02)

### Features

- css token type ([d617fb1](https://gitlab.com/codsen/codsen/commit/d617fb1e3d99e5b1b1fdf7a303a86f6af640298d))
- doctype and xml recognition ([3f92f64](https://gitlab.com/codsen/codsen/commit/3f92f646a67d2d458c6323a1b668d415ff9149e8))
- heuristic esp tag recognition ([8ee7df7](https://gitlab.com/codsen/codsen/commit/8ee7df774eed779e6c0abcd4732646fc57138ede))
- opts.reportProgressFunc ([5cc4838](https://gitlab.com/codsen/codsen/commit/5cc4838a7c94428ace4e29defbcfa10188a94867))
- recognise content within quotes ([c6cbc97](https://gitlab.com/codsen/codsen/commit/c6cbc97ad6b021ca90437730f70c43134f761d84))
- support esp code nested in other types and uneven count of quotes there ([399f48b](https://gitlab.com/codsen/codsen/commit/399f48b407845ae0324521ff68b6525c79a10961))
- tap "is-html-tag-opening" to make algorithm more resilient ([1c19b48](https://gitlab.com/codsen/codsen/commit/1c19b48c750b0357bb4d96d7e42099ae7dcb6e2a))
- init ([61e53c3](https://gitlab.com/codsen/codsen/commit/61e53c360cb75326994f6c0664b9d10e14242507))

## 1.0.0 (2019-11-01)

- ✨ First public release.
