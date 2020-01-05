# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
