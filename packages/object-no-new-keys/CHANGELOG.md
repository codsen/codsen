# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [2.2.0] - 2018-06-16

GitHub sold us out. In the meantime, we:

- ✨ Migrated to Bitbucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis

## [2.1.0] - 2018-05-26

- ✨ Set up [Prettier](https://prettier.io) on a custom ESLint rule set.
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — there's no need to comment-out `console.log` statements or care about them not spilling into production. Now it's done automatically.
- ✨ Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed. This is important because now code coverage is real again and now there are no excuses not to perfect it.

## [2.0.0] - 2017-12-12

- ✨ Rebased in ES Modules
- ✨ Set up Rollup. Now we generate and serve three builds: CommonJS, UMD and ES Modules.
- ✨ Whole setup overhaul to match my latest understanding how things should be set.

## [1.1.0] - 2017-07-25

- ✨ Since mode is integer, some people might pass integer as a third argument (instead of if passing plain object, `{mode: 1||2}`. I added a human-friendly error message which explains it's wrong if it's happens.

- `object-assign` from dependencies, switched to native ES6 `Object.assign`
- `type-detect` replacing it with 10 times lighter `lodash.isplainobject`

## 1.0.0 - 2017-05-15

- First public release

[1.1.0]: https://bitbucket.org/codsen/object-no-new-keys/branches/compare/v1.1.0%0Dv1.0.3#diff
[2.0.0]: https://bitbucket.org/codsen/object-no-new-keys/branches/compare/v2.0.0%0Dv1.1.1#diff
[2.1.0]: https://bitbucket.org/codsen/object-no-new-keys/branches/compare/v2.1.0%0Dv2.0.5#diff
[2.2.0]: https://bitbucket.org/codsen/object-no-new-keys/branches/compare/v2.2.0%0Dv2.1.0#diff
