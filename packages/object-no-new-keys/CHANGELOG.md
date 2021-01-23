# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 3.0.0 (2021-01-23)


### Bug Fixes

* Fix the Create New Issue URLs ([f5a41bf](https://github.com/codsen/codsen/commit/f5a41bf16fd8f43de7f8e7de68da562821ddb960))


### Features

* Add one more tag before which there will be a line break ([d178203](https://github.com/codsen/codsen/commit/d1782036b134102fd552d38d2d4f39c93195620b))
* Initial release ([8db2df9](https://github.com/codsen/codsen/commit/8db2df9fb08d66cf6c7a75a57cdcd15a5ec12c1c))
* rebase a little bit, remove a dependency, improve the input arg validation ([54cc009](https://github.com/codsen/codsen/commit/54cc009f3244efa03008011e4f7214dcc499ace0))
* remove option type checking to make program run around 54 times faster ([d6a0b91](https://github.com/codsen/codsen/commit/d6a0b91fcbe5fe38790efd2ec7223784e3ced6f3))
* rewrite in TS, start using named exports ([589c048](https://github.com/codsen/codsen/commit/589c048c11cdfc8a8a112f042b96af33edb331eb))


### BREAKING CHANGES

* previously: "import noNewKeys from ..." - now "import { noNewKeys } from ..."





## 2.10.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 2.9.0 (2020-02-01)

### Features

- rebase a little bit, remove a dependency, improve the input arg validation ([7718957](https://gitlab.com/codsen/codsen/commit/77189572e18e032c74c95a909144636c9a9f96af))

## 2.8.0 (2019-10-02)

- ✨ Remove option type checking to make program run around 54 times faster ([5acc5f6](https://gitlab.com/codsen/codsen/commit/5acc5f6))

## 2.7.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 2.3.0 (2018-10-24)

- ✨ Updated all dependencies
- ✨ Restored coveralls.io reporting
- ✨ Restored unit test linting

## 2.2.0 (2018-06-16)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to Bitbucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis

## 2.1.0 (2018-05-26)

- ✨ Set up [Prettier](https://prettier.io) on a custom ESLint rule set.
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — there's no need to comment-out `console.log` statements or care about them not spilling into production. Now it's done automatically.
- ✨ Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed. This is important because now code coverage is real again and now there are no excuses not to perfect it.

## 2.0.0 (2017-12-12)

- ✨ Rebased in ES Modules
- ✨ Set up Rollup. Now we generate and serve three builds: CommonJS, UMD and ES Modules.
- ✨ Whole setup overhaul to match my latest understanding how things should be set.

## 1.1.0 (2017-07-25)

- ✨ Since mode is integer, some people might pass integer as a third argument (instead of if passing plain object, `{mode: 1||2}`. I added a human-friendly error message which explains it's wrong if it's happens.

- `object-assign` from dependencies, switched to native ES6 `Object.assign`
- `type-detect` replacing it with 10 times lighter `lodash.isplainobject`

## 1.0.0 (2017-05-15)

- First public release
