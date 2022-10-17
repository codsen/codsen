# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 6.2.0 (2022-08-12)

### Features

- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

# 6.1.0 (2022-04-11)

### Features

- export defaults and version ([1107244](https://github.com/codsen/codsen/commit/1107244b45eff96ac1fc4ab992031ede0d10ba8c))

## 6.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS require()

## 5.1.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 5.0.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 5.0.3 (2021-02-07)

### Bug Fixes

- passed ranges can be null ([ed082b8](https://github.com/codsen/codsen/commit/ed082b8b87aec7e909e1b523ab70e9debeabb00b))

## 5.0.1 (2021-01-28)

### Bug Fixes

- add testStats to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 5.0.0 (2021-01-23)

### Features

- rewrite in TS and start using named exports ([202b763](https://github.com/codsen/codsen/commit/202b763cd2219d6beae0d346237b538789f4d67f))

### BREAKING CHANGES

- previously: `import rApply from ...` - now `import { rApply } from ...`

## 4.0.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 3.2.0 (2020-09-07)

### Bug Fixes

- make all tests pass ([d86cf1b](https://gitlab.com/codsen/codsen/commit/d86cf1bca9b0ac38e5bf141ed4ffd44c935ef51c))

### Features

- discard any nulls among ranges ([2a09e88](https://gitlab.com/codsen/codsen/commit/2a09e88fb3a7b50be255b4cfb265bf0b8542e4ee))

## 3.1.5 (2020-04-26)

### Bug Fixes

- harden the eslint rules set and make all tests pass ([3b593b4](https://gitlab.com/codsen/codsen/commit/3b593b495f645005780a26ab8d719aa7d1846dd0))

## 3.1.0 (2020-01-26)

### Features

- remove a dependency, speed up the program by 130% ([b787194](https://gitlab.com/codsen/codsen/commit/b787194c39e2e688fc50d63795412ba5339692fd))

## 2.12.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 2.9.0 (2018-12-26)

- ✨ Add 3rd input arg - progressFn ([f6735e2](https://gitlab.com/codsen/codsen/tree/master/packages/ranges-apply/commits/f6735e2))
- ✨ Accept `null` as second input argument, instead of ranges ([0c59484](https://gitlab.com/codsen/codsen/tree/master/packages/ranges-apply/commits/0c59484))
- ✨ [`ranges-merge`](https://www.npmjs.com/package/ranges-merge) (sort + merge) is applied by default now to prevent errors on unsorted ranges ([35e3c4b](https://gitlab.com/codsen/codsen/tree/master/packages/ranges-apply/commits/35e3c4b))

## 2.8.0 (2018-11-29)

- ✨ Added third argument, `progressFn` — it reports progress, feeding natural numbers meaning percentage done to any function that is in the third input argument.
- ✨ Pinned all the throws on all unit tests. "Pinning unit test throws" means we not just assert the fact that function threw, but match the throw's error message too. This gives more assurance:

  1. When there are many cases when an algorithm can throw and generic "function threw" assertion is used, a unit test can anticipate one throw to be thrown but another was thrown. Generic "function threw" assertions would still pass, throw is throw after all. But not pinned throws:
  2. It's easier to sort unit tests this way (order by throw ID) in a test file
  3. It's easier to perfect the unit test coverage when throws can be easier identified.
  4. It's faster to comprehend a number compared to a sentence. "THROW_ID_01" is faster to comprehend than a full title (which can differ from other title by a single word). At the end of the day, being less tired means achieving more.

  ```js
  const error1 = t.throws(() => {
    repl();
  });
  t.match(error1.message, /THROW_ID_01/);
  ```

## 2.7.0 (2018-10-25)

- ✨ Updated all dependencies
- ✨ Restored coveralls.io reporting
- ✨ Restored unit test linting

## 2.6.0 (2018-08-29)

- ✨ Now second argument, ranges array, can be `null`. This means, output of [ranges-push](https://www.npmjs.com/package/ranges-push) classes method`.current()` can be fed directly into this library without even checking. If it's null, original string will be returned.

## 2.5.0 (2018-08-16)

- ✨ Now we merge all input ranges using [ranges-merge](https://www.npmjs.com/package/ranges-merge) because it's necessary for algorithm and we can't rely on user to always provide merged ranges only.

## 2.4.0 (2018-08-11)

- ✨ Updated error labels
- ✨ Updated all dependencies
- ✨ Removed AVA ES linting rules and `nyc` code coverage build steps because we migrated to Babel v.7 and `nyc` breaks

## 2.3.0 (2018-06-18)

- ✨ Renamed to `ranges-apply` and migrated to Bitbucket.

## 2.2.0 (2018-05-11)

- ✨ Set up [Prettier](https://prettier.io)
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove from production code.
- ✨ Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed

## 2.1.0 (2018-02-13)

- ✨ Now accepts a single range as well, not only array of ranges.

## 2.0.0 (2017-11-02)

- ✨ The main source now is in ES2015 modules with `import`/`export`.
- ✨ Implemented Rollup to generate 3 flavours of this package: CommonJS, UMD and ESM `module` with `import`/`export`.

## 1.4.0 (2017-09-19)

- 🔧 Switching to ESLint on `airbnb-base` preset with semicolons-off override. JS Standard is rubbish because it's too relaxed and it's been using half-year-old ESLint. Actually it's even flagged as insecure by BitHound at the moment because of shell.js dependency two levels deep. ESLint itself is fine however.
- 💥 Removed _options_, the third input argument. It did nothing and I was expecting to add options, but now I don't want any. I removed the unused code related to options.

## 1.3.0 (2017-08-30)

- 🔧 OK, so after replacing ES6 template strings, the `let`s stopped minification of [emailcomb](https://emailcomb.com). I came up with idea to transpile the source to `/es5/index.js`, after publishing it should be available for consumption via `require('string-replace-slices-array/es5')`. Let's see how it goes.
- 🔧 I restored all template strings as they were in `v1.1.0`.
- 🔧 Tweaked the npm scripts, so ES5 version is generated as a pre-commit step.

## 1.2.0 (2017-08-29)

- 🔧 Guys, strange stuff. I was generating a production build of [emailcomb](https://emailcomb.com) and it refused to minify this library because of the first backtick in the ES6 template strings. So, I replaced them with ES5 code. Let's see how it will go.

## 1.1.0 (2017-08-16)

- 🔧 Now allowing zeros as values in ranges too. Sorry about that, the integer-checking library was not accepting zeros. Fixed now.

## 1.0.0 (2017-07-25)

- ✨ First public release
