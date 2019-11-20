# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
