# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 1.11.0 (2019-01-31)

### Features

- Add a new key, `parentType` in a callback `innerObj` ([6e16b99](https://gitlab.com/codsen/codsen/commit/6e16b99))

## 1.10.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 1.4.0 (2018-10-13)

- ✨ Updated all dependencies and restored coverage tracking both via terminal when testing and through coveralls.io

## 1.3.0 (2018-06-11)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis
- ✨ Removed `package-lock`

## 1.2.0 (2018-05-02)

- ✨ Set up [Prettier](https://prettier.io)
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove from production code.

## 1.1.0 (2018-01-03)

- ✨ New key in the `innerObj` callback - `innerObj.path`. It's interoperable with [object-path](https://www.npmjs.com/package/object-path).

## 1.0.1 (2017-12-22)

- ✨ First public release.
