# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 3.0.0 (2021-01-23)


### Features

* add opts.reportProgressFunc, remove reported ranges ([20cddb8](https://github.com/codsen/codsen/commit/20cddb8bf8e6f6a88a86382aaf05d61a79199fa3))
* initial release ([16e3e7f](https://github.com/codsen/codsen/commit/16e3e7f8d5aac9277623463ce2a797b87cfcb1b0))
* recognise JS code within script tags ([9cdbfd9](https://github.com/codsen/codsen/commit/9cdbfd96ee8e2a18d221e04d503a116e8b8c4bf1))
* report log of time taken ([3877cf9](https://github.com/codsen/codsen/commit/3877cf9ddee5071ae9c4d1f0f1e5d76bd4121a63))
* rewrite in TS ([bffdb9b](https://github.com/codsen/codsen/commit/bffdb9bc670f5164795ec1c4a100b81b3e5e6b04))


### BREAKING CHANGES

* ranges are not reported in result any more because it's too resource taxing to
calculate the collapsed result ranges on top of del





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
