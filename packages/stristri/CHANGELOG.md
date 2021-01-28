# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 3.0.1 (2021-01-28)


### Bug Fixes

* add testStats to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))





# 3.0.0 (2021-01-23)

### Features

- rewrite in TS ([bffdb9b](https://github.com/codsen/codsen/commit/bffdb9bc670f5164795ec1c4a100b81b3e5e6b04))

### BREAKING CHANGES

- there are no API changes but we're bumping _major_ just in case

## 2.0.0 (2020-12-09)

### Features

- add opts.reportProgressFunc, remove reported ranges ([5021681](https://git.sr.ht/~royston/codsen/commit/5021681dfc7bde4be6750f73daeb5b0448a39c4f))
- report log of time taken ([f9b575f](https://git.sr.ht/~royston/codsen/commit/f9b575fc7d7d09ddbb5d8f6914b73d6bfc366165))

### BREAKING CHANGES

- ranges are not reported in result any more because it's too resource taxing to
  calculate the collapsed result ranges on top of del

## 1.1.0 (2020-12-06)

### Features

- initial release ([03866cc](https://git.sr.ht/~royston/codsen/commit/03866cca2d5a5611179c9c79d61abfc49a56ce56))
