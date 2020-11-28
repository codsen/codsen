# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 2.9.0 (2020-11-28)

### Bug Fixes

- Fix the Create New Issue URLs ([c5ee4a6](https://git.sr.ht/~royston/codsen/commits/c5ee4a61e9436099b0e20d20bca043c1b2c93f55))

### Features

- add granular options to trim (or not) each whitespace type ([c12e5b3](https://git.sr.ht/~royston/codsen/commits/c12e5b3c1a9ae41fb80a38591dad6ea02ffc6153))
- Add one more tag before which there will be a line break ([4f00871](https://git.sr.ht/~royston/codsen/commits/4f008715dcc2de7b2b52b67ce2e27728d5ffec37))
- Initial release ([4f35bfb](https://git.sr.ht/~royston/codsen/commits/4f35bfb167e54b1a0e5e8f01871293b262c67a76))
- opts.classicTrim, returns plain object now ([0fe61a1](https://git.sr.ht/~royston/codsen/commits/0fe61a1a1f52e8490b492c646a5fa9d70bc87aad))

## 2.8.0 (2019-09-11)

### Features

- add granular options to trim (or not) each whitespace type ([c12e5b3](https://gitlab.com/codsen/codsen/commit/c12e5b3))

## 2.7.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 2.3.0 (2018-12-26)

- ✨ Add `opts.classicTrim`

## 2.2.0 (2018-10-26)

- ✨ Updated all dependencies
- ✨ Restored coveralls.io reporting
- ✨ Restored unit test linting

## 2.1.0 (2018-10-15)

- ✨ Updated all dependencies and restored unit test coverage tracking: reporting in terminal and coveralls.io

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

- ✨ PLUS, added `opts.classicTrim`. It's the same as `String.trim()` except you get both string and corresponding ranges. Native `String.trim()` does not give the latter.

## 1.2.0 (2018-06-16)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis

## 1.1.0 (2018-05-25)

- ✨ Set up [Prettier](https://prettier.io) on a custom ESLint rule set.
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — there's no need to comment-out `console.log` statements or care about them not spilling into production. Now it's done automatically.
- ✨ Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed. It is important because now code coverage is real again and now there are no excuses not to perfect it.

## 1.0.0 (2018-02-13)

- ✨ First public release
