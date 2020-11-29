# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 4.9.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 4.8.1 (2019-10-05)

### Performance Improvements

- remove unused check-types-mini from deps list ([53f78a6](https://gitlab.com/codsen/codsen/commit/53f78a6))

## 4.8.0 (2019-10-02)

### Features

- remove check-types-mini and replace type-detect with lodash.isplainobject ([31936bf](https://gitlab.com/codsen/codsen/commit/31936bf))

## 4.8.0 (2019-09-26)

- ✨ Replace "type-detect" with "lodash.isplainobject"
- ✨ Remove `check-types-mini` to make things run faster. 76 times to be precise.

## 4.7.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 4.3.0 (2018-10-24)

- ✨ Updated all dependencies
- ✨ Restored coveralls.io reporting
- ✨ Restored unit test linting

## 4.2.0 (2018-06-16)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to Bitbucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis

## 4.1.0 (2018-05-26)

- ✨ Set up [Prettier](https://prettier.io) on a custom ESLint rule set.
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — there's no need to comment-out `console.log` statements or care about them not spilling into production. Now it's done automatically.
- ✨ Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed. This is important because now code coverage is real again and now there are no excuses not to perfect it.

## 4.0.0 (2017-12-12)

- ✨ Rebased in ES Modules
- ✨ Set up Rollup. Now we generate three builds: CommonJS, UMD and ES Modules.
- ✨ Major setup overhaul and deps refresh.

## 3.1.0 (2017-05-12)

- ✨ `opts.flattenArraysContainingStringsToBeEmpty` now lets you flatten object values which have arrays which have strings into empty arrays. This is important. Trust me. No, seriously.

## 3.0.0 (2017-03-17)

- ✨ Recoded all the core, improving the algorithm and making everything cleaner (hope so).
- ✨ Pinned JS Standard not to be the latest, to avoid sudden linting issues coming from nowhere and blocking builds when a new version of JS Standard is released.
- ✨ Even more tests.
- ✨ Unit test coverage is still a solid 100%.
