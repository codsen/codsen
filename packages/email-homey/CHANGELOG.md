# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 4.0.0 (2022-12-01)

### BREAKING CHANGES

- Minimum supported Node version is v14.18; we're dropping v12 support

## 3.1.0 (2022-08-12)

### Features

- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

## 3.0.1 (2021-11-02)

### Features

- migrate to ES Modules ([c579dff](https://github.com/codsen/codsen/commit/c579dff3b23205e383035ca10ddcec671e35d0fe))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS `require()`

## 3.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS `require()`

## 2.10.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 2.9.1 (2021-01-28)

### Fixed

- add `testStats` to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 2.7.0 (2019-01-20)

- Various documentation and setup tweaks after we migrated to monorepo
- Setup refresh: updated dependencies and all config files using automated tools

## 2.1.0 (2018-06-21)

GitHub sold us out. In the meantime, we:

- Migrated to Bitbucket (to host repo + perform CI) and Codacy (for code quality audit)
- Dropped BitHound (RIP) and Travis

## 2.0.0 (2018-05-04)

- Complete rewrite. Now, the only thing `homey` does is it compiles the list of folder names from the input path, then replaces the given placeholder in a given file with the array of the paths to those folder names.

  In practice, Vue.js could drive the homepage and contain all the parts within a single HTML file. All it needs is a list of template folder paths. Vue.js can't "look around" in your file system. You have to give it the list of hardcoded folder names to "bake" into the HTML homepage.

  This means, setup will be simpler now. There's no more two files ("loop-me.html" and "template.html") and everything is more straightforward.

- Added unit tests!

## 1.8.0 (2017-09-24)

- Removed JS Standard and swiched to raw ESLint on `airbnb-base` preset with config override to ban semicolons.
- Made all linting checks to pass
- Tweaked readme
- Added gif files to `npmignore` so they don't get `npm i`nstalled
- Updated bithound config to reflect the new setup

## 1.7.0 (2017-08-22)

- More badges to `readme`
- Updated all dependencies and `package.json`

## 1.6.0 (2017-07-23)

- Updated to the latest API, adding recognition of the dates in titles in format `2014/04-15`

## 1.5.0 (2017-07-22)

- Updated to the latest API, adding improved recognition of the titles
- Documentation with up-to-date author's name
- Added `.npmignore`

## 1.4.0 (2017-06-29)

- Updated all dependencies

## 1.3.0 (2017-06-29)

- Updated to the new version of the API package, CHLU, enabling new features: improved algorithm, reducing the change of false positives when versions are mentioned within the text.

## 1.2.0 (2017-06-23)

- Updated to the new version of the API package, CHLU, enabling new features: automatic title linking, unused footer link removal

## 1.1.0 (2017-05-19)

- Set up the `update-notifier`

## 1.0.0 (2017-05-17)

- First public release
