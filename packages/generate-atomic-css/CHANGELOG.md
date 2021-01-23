# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 1.4.0 (2021-01-23)


### Bug Fixes

* closing curlies were not recognised if they were placed on a new line - fixed now ([138d49f](https://github.com/codsen/codsen/commit/138d49f87fc5c1baf6c53094e2ab40775591842e))
* Don't close the comment blocks above, it's not fully safe ([8a2f5f1](https://github.com/codsen/codsen/commit/8a2f5f19f37b982885b89459a1e92577b950a120))
* Fix cases when there is no $$$ in the input and there are heads/tails ([416cfc8](https://github.com/codsen/codsen/commit/416cfc8077e1e2d68007e94a7266252011e0df83))
* Fix the case when the only non-whitespace string is at zero index (falsey value) ([72f5014](https://github.com/codsen/codsen/commit/72f501412ecba361e6b9bbbc918a55a4dc50ca95))
* More tests and more improvements to edge case recognition ([f27ebe9](https://github.com/codsen/codsen/commit/f27ebe9107c382db857acae1855098e28e0fd6c8))
* Tightened the whitespace management part on the surrounding areas ([4d47fdb](https://github.com/codsen/codsen/commit/4d47fdba63f6e9eea089d4352197835c5bc8946d))
* WIP - 12 remaining ([f9ddcab](https://github.com/codsen/codsen/commit/f9ddcab411f2e4b05f4a9e6a1fe1ddd2739c3851))
* WIP - 13 failing ([a119931](https://github.com/codsen/codsen/commit/a11993104488f75e6bc07782326ff60e5b89c33e))
* WIP - 4 left ([dd1a757](https://github.com/codsen/codsen/commit/dd1a757a9b2f8ff226226c4527bb117ec33ccb7f))
* WIP - 5 left ([bd5a87e](https://github.com/codsen/codsen/commit/bd5a87e434630226c33e559c355081c6bec12b37))
* WIP - all tests pass ([310762c](https://github.com/codsen/codsen/commit/310762c4bf8fb290cc9dd3a3df7f1dbf5f320993))


### Features

* Add progress-reporting callback function to opts ([cea5009](https://github.com/codsen/codsen/commit/cea50094dca53064f9a371c9bdcae9bdf5f06c8b))
* Algorithm improvements to cover more dirty input cases ([28401f4](https://github.com/codsen/codsen/commit/28401f44acf774e1656171592cc91ba3c008df62))
* Complete extractFromToSource with unit tests ([72cb39b](https://github.com/codsen/codsen/commit/72cb39bacc09503666eae4bdf076e0b79b505cdb))
* Generated digit padding everywhere if possible ([082ba93](https://github.com/codsen/codsen/commit/082ba9337b7ce2921038af8dd3dddb01e5c0a0aa))
* Improvements to multiple CSS rule generation and recognition in config ([20eb6e4](https://github.com/codsen/codsen/commit/20eb6e4bf4b826df18d56d926cba449686bcead7))
* Improvements to the padding algorithm ([6e37134](https://github.com/codsen/codsen/commit/6e3713472ba23b756f528573c0cb2f5ac8263992))
* Make more unit tests pass ([ae5625a](https://github.com/codsen/codsen/commit/ae5625a50a0855d2be8522d26b3d4467be00d3dc))
* opts.pad ([868372f](https://github.com/codsen/codsen/commit/868372f5c05dcf2d6fa2efcc444391de54d460ef))
* Output the log ([0f0f124](https://github.com/codsen/codsen/commit/0f0f124010b9bc5e713f3639e2795c2bbe904311))
* rewrite in TS ([8bbd4c4](https://github.com/codsen/codsen/commit/8bbd4c4baef778fd6399f9165df07d93e3913fd7))
* Separate extractFromToSource() into a standalone, exported function ([a3decf3](https://github.com/codsen/codsen/commit/a3decf3b73ff94fa4eb90e0d17e1b80d66a6f744))
* Tackle input without any $$$ ([97567cc](https://github.com/codsen/codsen/commit/97567ccb0e2824ea3aee7c57519d4e2c6a00683d))





## 1.3.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 1.2.3 (2019-07-24)

### Bug Fixes

- closing curlies were not recognised if they were placed on a new line - fixed now ([c81eb14](https://gitlab.com/codsen/codsen/commit/c81eb14))

## 1.2.0 (2019-07-15)

### Features

- Complete extractFromToSource with unit tests ([4ac3634](https://gitlab.com/codsen/codsen/commit/4ac3634))
- Improvements to multiple CSS rule generation and recognition in config ([b780889](https://gitlab.com/codsen/codsen/commit/b780889))
- Improvements to the padding algorithm ([21ac50f](https://gitlab.com/codsen/codsen/commit/21ac50f))
- Separate extractFromToSource() into a standalone, exported function ([af27f89](https://gitlab.com/codsen/codsen/commit/af27f89))

## 1.1.0 (2019-07-06)

### Bug Fixes

- Don't close the comment blocks above, it's not fully safe ([5ce6230](https://gitlab.com/codsen/codsen/commit/5ce6230))
- Fix cases when there is no \$\$\$ in the input and there are heads/tails ([09ceccd](https://gitlab.com/codsen/codsen/commit/09ceccd))
- Fix the case when the only non-whitespace string is at zero index (falsey value) ([76fd296](https://gitlab.com/codsen/codsen/commit/76fd296))
- More tests and more improvements to edge case recognition ([4721b20](https://gitlab.com/codsen/codsen/commit/4721b20))
- Tightened the whitespace management part on the surrounding areas ([551a851](https://gitlab.com/codsen/codsen/commit/551a851))

### Features

- Add progress-reporting callback function to opts ([82e0d9b](https://gitlab.com/codsen/codsen/commit/82e0d9b))
- Algorithm improvements to cover more dirty input cases ([70190a6](https://gitlab.com/codsen/codsen/commit/70190a6))
- Generated digit padding everywhere if possible ([750e853](https://gitlab.com/codsen/codsen/commit/750e853))
- Make more unit tests pass ([177f05c](https://gitlab.com/codsen/codsen/commit/177f05c))
- opts.pad ([5d3e16a](https://gitlab.com/codsen/codsen/commit/5d3e16a))
- Output the log ([c729689](https://gitlab.com/codsen/codsen/commit/c729689))
- Tackle input without any \$\$\$ ([1dcaee4](https://gitlab.com/codsen/codsen/commit/1dcaee4))

## 1.0.0 (2018-06-28)

- ✨ First public release
