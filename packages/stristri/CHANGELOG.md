# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.0.4](https://github.com/codsen/codsen/compare/stristri@4.0.3...stristri@4.0.4) (2021-11-04)

**Note:** Version bump only for package stristri





## 4.0.3 (2021-11-02)

### Bug Fixes

- bump TS and separate ESLint plugins away from this monorepo ([b1ebce1](https://github.com/codsen/codsen/commit/b1ebce1637d8c41c2d848fc24b0ba4058865bd5d))

### Features

- migrate to ES Modules ([c579dff](https://github.com/codsen/codsen/commit/c579dff3b23205e383035ca10ddcec671e35d0fe))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS require()

## 4.0.1 (2021-09-13)

### Bug Fixes

- bump TS and separate ESLint plugins away from this monorepo ([2e07d42](https://github.com/codsen/codsen/commit/2e07d424222b6ffedf5fb45c83ad453627ec2904))

## 4.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS require()

## 3.2.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 3.1.7 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 3.1.0 (2021-03-14)

### Features

- separate the inline <script> contents - add a new option, "js" ([b7aac4b](https://github.com/codsen/codsen/commit/b7aac4b0b8490fad2bd8ec8ec232ae4a8de7867c))

## 3.0.1 (2021-01-28)

### Bug Fixes

- add testStats to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 3.0.0 (2021-01-23)

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
