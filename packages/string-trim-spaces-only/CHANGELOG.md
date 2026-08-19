# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 5.0.0 (2022-12-01)

### BREAKING CHANGES

- Minimum supported Node version is v14.18; we're dropping v12 support

## 4.1.0 (2022-08-12)

### Features

- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

## 4.0.13 (2022-04-18)

### Fixed

- tweak types ([e1e4166](https://github.com/codsen/codsen/commit/e1e4166157c90b0a8561b1d4c65defeffae84112))

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

- rewrite in TS, start using named exports ([f1af4d2](https://github.com/codsen/codsen/commit/f1af4d2eecbda15edc33f9b9080bc99f495cbd3a))

### BREAKING CHANGES

- previously: `import trimSpaces from ...` - now `import { trimSpaces } from ...`

## 2.9.0 (2020-11-28)

Accidental version bump during migration to SourceHut. Sorry about that.

## 2.8.0 (2019-09-11)

### Features

- add granular options to trim (or not) each whitespace type ([c12e5b3](https://gitlab.com/codsen/codsen/commit/c12e5b3))

## 2.7.0 (2019-01-20)

- Various documentation and setup tweaks after we migrated to monorepo
- Setup refresh: updated dependencies and all config files using automated tools

## 2.3.0 (2018-12-26)

- Add `opts.classicTrim`

## 2.2.0 (2018-10-26)

- Updated all dependencies
- Restored coveralls.io reporting
- Restored unit test linting

## 2.1.0 (2018-10-15)

- Updated all dependencies and restored unit test coverage tracking: reporting in terminal and coveralls.io

## 2.0.0 (2018-07-26)

- 📦 API change: now the result is not a string but a plain object, for example:

```js
{
  res: "",
  ranges: [[0, 1]]
}
```

The trimmed string that was previously returned is now returned under key `res`.
Additionally, we also supply ranges of what was deleted under key `ranges`.

Additionally, now only string input is allowed. Non-string input will cause error `throw`s. We need to make API stricter because output type is different from the input type (string vs plain object) and if an accidentally wrong type, a plain object was given, if we returned it without causing an error, it could be interpreted as a valid output type and cause errors when keys `res` or `ranges` would not be found (or worse, found and consumed from a wrong place)!

- PLUS, added `opts.classicTrim`. It's the same as `String.trim()` except you get both string and corresponding ranges. Native `String.trim()` does not give the latter.

## 1.2.0 (2018-06-16)

GitHub sold us out. In the meantime, we:

- Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- Dropped BitHound (RIP) and Travis

## 1.1.0 (2018-05-25)

- Set up [Prettier](https://prettier.io) on a custom ESLint rule set.
- Removed `package.lock` and `.editorconfig`
- Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — there's no need to comment-out `console.log` statements or care about them not spilling into production. Now it's done automatically.
- Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed. It is important because now code coverage is real again and now there are no excuses not to perfect it.

## 1.0.0 (2018-02-13)

- First public release
