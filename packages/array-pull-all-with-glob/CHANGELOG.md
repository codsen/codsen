# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [4.6.0] - 2018-08-23

- ✨ Now we allow the second input argument to be a string or an array of zero or more strings

## [4.5.0] - 2018-06-11

GitHub sold us out. In the meantime, we:

- ✨ Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis
- ✨ Removed `package-lock`

## [4.4.0] - 2018-05-14

- ✨ Now pointing unit tests at ES Modules build, not CommonJS-one. This means, unit test coverage will be correct (higher) because there won't be any missing rows that Babel added which are impossible to cover.
- ✨ Tweaks to ava [config](https://github.com/avajs/ava/blob/master/docs/recipes/es-modules.md) in `package.json`, properly enabling the `dev` Rollup builds.

## [4.3.0] - 2018-04-29

- ✨ Set up Prettier
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove them during the builds.

## [4.2.0] - 2018-02-11

- ✨ `opts.caseSensitive`, directly controlling today's new released [matcher's](https://www.npmjs.com/package/matcher) same feature. Case sensitive is on by default now, but you can turn it off if you're dealing with file system stuff for example. It's best to be case-insensitive in those cases.

Also, I set up [check-types-mini](https://bitbucket.org/codsen/check-types-mini) to patrol the opts' types. Just in case consumers misbehave.

## [4.1.0] - 2018-01-21

- ✨ Shortened the error source function paths in error messages. There's no point to report the name of the main function when there's only one function. The package name will suffice.

## [4.0.0] - 2017-10-23

- ✨ The main source now is in ES2015 modules with `import`/`export`.
- ✨ Implemented Rollup to generate 3 flavours of this package: CommonJS, UMD and ESM `module` with `import`/`export`.

## [3.1.0] - 2017-08-31

- ✨ Now generating transpiled version within `/es5/` folder, which you can require like that, `var pull = require('array-pull-all-with-glob/es5')`

## [3.0.0] - 2017-08-25

- ✨ Switched to [matcher](https://github.com/sindresorhus/matcher/) to do all the globbing.

- 💥 Removed dependency on `lodash.clonedeep`
- 💥 Removed dependency on `lodash.replace`
- 🔧 Made the API slightly more strict, not allowing non-string elements within arrays.

## 2.0.0 - 2017-03-02

- 🔧 Simple thing, but, technically, a major API change. Input arguments are not mutated any more.
- 🔧 New unit tests to guarantee that.
- 🔧 Tightened the API with insurance against missing args or wrong types in the input. Now if the main input is missing, it will throw. If first argument (remove from where) is present, but second (what to remove) is missing, first arguement is returned. It's called being nice with others (libraries).
- ✨ Added changelog.md

[4.6.0]: https://bitbucket.org/codsen/array-pull-all-with-glob/branches/compare/v4.6.0%0Dv4.5.2#diff
[4.5.0]: https://bitbucket.org/codsen/array-pull-all-with-glob/branches/compare/v4.5.0%0Dv4.4.1#diff
[4.4.0]: https://bitbucket.org/codsen/array-pull-all-with-glob/branches/compare/v4.4.0%0Dv4.3.3#diff
[4.3.0]: https://bitbucket.org/codsen/array-pull-all-with-glob/branches/compare/v4.3.0%0Dv4.2.0#diff
[4.2.0]: https://bitbucket.org/codsen/array-pull-all-with-glob/branches/compare/v4.2.0%0Dv4.1.0#diff
[4.1.0]: https://bitbucket.org/codsen/array-pull-all-with-glob/branches/compare/v4.1.0%0Dv4.0.5#diff
[4.0.0]: https://bitbucket.org/codsen/array-pull-all-with-glob/branches/compare/v4.0.0%0Dv3.1.0#diff
[3.1.0]: https://bitbucket.org/codsen/array-pull-all-with-glob/branches/compare/v3.1.0%0Dv3.0.2#diff
[3.0.0]: https://bitbucket.org/codsen/array-pull-all-with-glob/branches/compare/v3.0.0%0Dv2.0.6#diff
