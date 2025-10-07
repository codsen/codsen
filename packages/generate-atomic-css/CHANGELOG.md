# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 3.0.29 (2025-10-07)

**Note:** Version bump only for package generate-atomic-css

## 3.0.0 (2022-12-01)

### BREAKING CHANGES

- Minimum supported Node version is v14.18; we're dropping v12 support

## 2.2.0 (2022-08-12)

### Features

- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

## 2.1.1 (2022-04-18)

### Fixed

- tweak types ([abf7641](https://github.com/codsen/codsen/commit/abf76412cc8669f04481bdc17c26350b030a8389))

## 2.1.0 (2022-04-11)

### Fixed

- use Partial, every opts key is optional ([844685c](https://github.com/codsen/codsen/commit/844685ca133e107bb10c46c75c6cba70a7a5a8f3))

### Features

- export defaults and version ([1107244](https://github.com/codsen/codsen/commit/1107244b45eff96ac1fc4ab992031ede0d10ba8c))

## 2.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS `require()`

## 1.5.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 1.4.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 1.4.1 (2021-01-28)

### Fixed

- add `testStats` to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 1.4.0 (2021-01-23)

### Features

- rewrite in TS ([8bbd4c4](https://github.com/codsen/codsen/commit/8bbd4c4baef778fd6399f9165df07d93e3913fd7))

## 1.3.0 (2020-11-28)

Accidental version bump during migration to SourceHut. Sorry about that.

## 1.2.3 (2019-07-24)

### Fixed

- closing curlies were not recognised if they were placed on a new line - fixed now ([c81eb14](https://gitlab.com/codsen/codsen/commit/c81eb14))

## 1.2.0 (2019-07-15)

### Features

- Complete extractFromToSource with unit tests ([4ac3634](https://gitlab.com/codsen/codsen/commit/4ac3634))
- Improvements to multiple CSS rule generation and recognition in config ([b780889](https://gitlab.com/codsen/codsen/commit/b780889))
- Improvements to the padding algorithm ([21ac50f](https://gitlab.com/codsen/codsen/commit/21ac50f))
- Separate extractFromToSource() into a standalone, exported function ([af27f89](https://gitlab.com/codsen/codsen/commit/af27f89))

## 1.1.0 (2019-07-06)

### Fixed

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

- First public release
