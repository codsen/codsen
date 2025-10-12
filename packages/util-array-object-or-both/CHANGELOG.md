# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 5.0.26 (2025-10-12)

**Note:** Version bump only for package util-array-object-or-both

## 5.0.0 (2022-12-01)

### BREAKING CHANGES

- Minimum supported Node version is v14.18; we're dropping v12 support

## 4.2.0 (2022-08-12)

### Features

- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

## 4.1.2 (2022-04-18)

### Fixed

- tweak types ([fa71185](https://github.com/codsen/codsen/commit/fa71185b561d052379bbbed0a20ee025f8c929be))

## 4.1.0 (2022-04-10)

### Features

- export defaults and version ([1107244](https://github.com/codsen/codsen/commit/1107244b45eff96ac1fc4ab992031ede0d10ba8c))

## 4.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS `require()`

## 3.1.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 3.0.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 3.0.1 (2021-01-28)

### Fixed

- add `testStats` to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 3.0.0 (2021-01-23)

### Features

- rewrite in TS and start using named exports ([e97fcc8](https://github.com/codsen/codsen/commit/e97fcc80d97a812a70d75a28bb2697b995ae9e26))

### BREAKING CHANGES

- previously: `import arrObjOrBoth from ...` - now `import { arrObjOrBoth } from ...`

## 2.7.58 (2020-04-26)

### Fixed

- harden the eslint rules set and make all unit tests pass ([8821ee5](https://gitlab.com/codsen/codsen/commit/8821ee5ecbe697217133c7dce03f5dc119770591))

## 2.7.44 (2019-10-02)

### Performance Improvements

- remove check-types-mini for around 500x speed improvement ([4f69441](https://gitlab.com/codsen/codsen/commit/4f69441))

## 2.7.0 (2019-01-20)

- Various documentation and setup tweaks after we migrated to monorepo
- Setup refresh: updated dependencies and all config files using automated tools

## 2.3.0 (2018-10-26)

- Updated all dependencies
- Restored coveralls.io reporting
- Restored unit test linting

## 2.2.0 (2018-06-16)

GitHub sold us out. In the meantime, we:

- Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- Dropped BitHound (RIP) and Travis

## 2.1.0 (2018-05-25)

- Set up [Prettier](https://prettier.io) on a custom ESLint rule set.
- Remove `package.lock` and `.editorconfig`
- Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — there's no need to comment-out `console.log` statements or care about them not spilling into production. Now it's done automatically.
- Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed. This is important because now code coverage is real again and now there are no excuses not to perfect it.

## 2.0.0 (2017-12-13)

- Rebased in ES Modules
- Set up Rollup. Now we serve three builds: CommonJS, UMD and ES Module.

## 1.2.0 (2017-09-20)

- 💥 Dropped JS Standard and switched to raw ESLint on `airbnb-base` preset. Of course, with overrides to ban semicolons and allow plus-plus in loops.

## 1.1.0 (2017-08-09)

- 💥 Replaced `object-assign` with native ES6 `Object.assign`
- 💥 We don't need `lodash.clonedeep` either, we can just `Object.assign` onto a empty object literal because `Object.assign` sources are not mutated.

## 1.0.0 (2017-06-13)

- First public release
