# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.9.48](https://gitlab.com/codsen/codsen/compare/string-unfancy@3.9.47...string-unfancy@3.9.48) (2019-11-18)

**Note:** Version bump only for package string-unfancy





## 3.9.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 3.3.0 (2018-10-26)

- ✨ Update all dependencies
- ✨ Restore coveralls.io reporting
- ✨ Restore unit test linting

## 3.2.0 (2018-06-16)

GitHub sold us out. In the meantime, we:

- ✨ Migrate to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Drop BitHound (RIP) and Travis
- ✨ Update the header image with thicker arrows and pretend-to-be-invisible depiction of NBSP which is invisible and nobody has any idea how it should look 👀

## 3.1.0 (2018-05-25)

- ✨ Set up [Prettier](https://prettier.io) on a custom ESLint rule set.
- ✨ Remove `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — there's no need to comment-out `console.log` statements or care about them not spilling into production. Now it's done automatically.
- ✨ Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed. This is important because now code coverage is real again and now there are no excuses not to perfect it.

## 3.0.0 (2017-12-13)

- 🔧 Rebased in ES Modules
- 🔧 Now we generate three builds: CommonJS, UMD and ES Modules. All are wired up to `package.json` and WebPack/Rollup should automatically switch to ES Modules-one.

## 2.1.0 (2017-09-19)

- 🔧 The main export is now served transpiled.
- 🔧 Switched to ESLint, stopped using JS Standard.

## 2.0.1 (2017-09-01)

- ✨ Added a transpiled version in `/es5/` folder.

## 2.0.0 (2017-07-21)

- 🔧 Improved the algorithm. Actually we don't need to care about emoji and characters that are made up of two Unicode characters (surrogates). This makes it unnecessary to split the string into an array of characters.
- 🔧 API is now more strict, if the input is not `string` or it's missing completely, it will `throw`.

## 1.0.0 (2017-06-26)

- ✨ First public release
