# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 5.1.0 (2021-05-24)


### Features

* config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))





## 5.0.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 5.0.1 (2021-01-28)

### Bug Fixes

- add testStats to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 5.0.0 (2021-01-23)

### Features

- rewrite in TS, use named exports ([359c5ff](https://github.com/codsen/codsen/commit/359c5ff3df749c18b39dc48d07ccb8029d915fa5))

### BREAKING CHANGES

- Previously, a default export was used: `import pullAllWithGlob from ...`. Now use the named export: `import { pull } from ...`

## 4.13.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 4.12.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 4.7.0 (2018-10-12)

- ✨ Updated all dependencies and restored the coverage tracking both in unit tests and via coveralls.io

## 4.6.0 (2018-08-23)

- ✨ Now we allow the second input argument to be a string or an array of zero or more strings

## 4.5.0 (2018-06-11)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis
- ✨ Removed `package-lock`

## 4.4.0 (2018-05-14)

- ✨ Now pointing unit tests at ES Modules build, not CommonJS-one. This means, unit test coverage will be correct (higher) because there won't be any missing rows that Babel added which are impossible to cover.
- ✨ Tweaks to ava [config](https://github.com/avajs/ava/blob/master/docs/recipes/es-modules.md) in `package.json`, properly enabling the `dev` Rollup builds.

## 4.3.0 (2018-04-29)

- ✨ Set up Prettier
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove them during the builds.

## 4.2.0 (2018-02-11)

- ✨ `opts.caseSensitive`, directly controlling today's new released [matcher's](https://www.npmjs.com/package/matcher) same feature. Case sensitive is on by default now, but you can turn it off if you're dealing with file system stuff for example. It's best to be case-insensitive in those cases.

Also, I set up `check-types-mini` ([npm](https://www.npmjs.com/package/check-types-mini), [GitLab](https://gitlab.com/codsen/codsen/tree/master/packages/check-types-mini)) to patrol the opts' types. Just in case consumers misbehave.

## 4.1.0 (2018-01-21)

- ✨ Shortened the error source function paths in error messages. There's no point to report the name of the main function when there's only one function. The package name will suffice.

## 4.0.0 (2017-10-23)

- ✨ The main source now is in ES2015 modules with `import`/`export`.
- ✨ Implemented Rollup to generate 3 flavours of this package: CommonJS, UMD and ESM `module` with `import`/`export`.

## 3.1.0 (2017-08-31)

- ✨ Now generating transpiled version within `/es5/` folder, which you can require like that, `var pull = require('array-pull-all-with-glob/es5')`

## 3.0.0 (2017-08-25)

- ✨ Switched to [matcher](https://github.com/sindresorhus/matcher/) to do all the globbing.

- 💥 Removed dependency on `lodash.clonedeep`
- 💥 Removed dependency on `lodash.replace`
- 🔧 Made the API slightly more strict, not allowing non-string elements within arrays.

## 2.0.0 (2017-03-02)

- 🔧 Simple thing, but, technically, a major API change. Input arguments are not mutated any more.
- 🔧 New unit tests to guarantee that.
- 🔧 Tightened the API with insurance against missing args or wrong types in the input. Now if the main input is missing, it will throw. If first argument (remove from where) is present, but second (what to remove) is missing, first arguement is returned. It's called being nice with others (libraries).
- ✨ Added changelog.md
