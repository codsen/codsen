# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 5.7.0 (2019-01-31)

### Features

- Correctly behave if object has a key which has a value equal to literal undefined ([5c28021](https://gitlab.com/codsen/codsen/commit/5c28021))

## 5.6.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 5.2.0 (2018-12-26)

### Bug Fixes

- 🐛 Pull pullAllWithGlob inline because it was causing circular dependency clashes ([2948a28](https://gitlab.com/codsen/codsen/tree/master/packages/check-types-mini/commits/2948a28))

### Features

- ✨ Matcher under opts.ignorePaths and opts.ignoreKeys ([4648ad5](https://gitlab.com/codsen/codsen/tree/master/packages/check-types-mini/commits/4648ad5))
- ✨ `opts.ignorePaths` and nested opts support ([c1128d6](https://gitlab.com/codsen/codsen/tree/master/packages/check-types-mini/commits/c1128d6))
- ✨ `opts.schema` can now be given in nested formatting too ([d102784](https://gitlab.com/codsen/codsen/tree/master/packages/check-types-mini/commits/d102784))
- ✨ schema ignores with types 'any' and 'whatever' now apply to all children nodes of that path ([568eb33](https://gitlab.com/codsen/codsen/tree/master/packages/check-types-mini/commits/568eb33))

## 5.1.0 (2018-10-15)

- ✨ `opts.schema` now can be given in nested order as well, for example, given as:

```js
{
  schema: {
    option1: { somekey: "any" },
    option2: "whatever"
  }
}
```

instead of:

```js
{
  schema: {
    "option1.somekey": "any",
    option2: "whatever"
  }
}
```

## 5.0.0 (2018-10-13)

- 💥 BREAKING CHANGES - if you use schema and "blanket" values "any" or "whatever" for any paths, now that will apply to all children nodes of that path.

For example, if you have options object:

```js
{
  oodles: {
    enabled: true;
  }
}
```

and if you use `check-types-mini` to check its types and if you pass the following options object to `check-types-mini`:

```js
{
  schema: {
    oodles: "any";
  }
}
```

then, both paths `oodles` and `oodles.enabled` will not be checked. Previously, you had to explicitly instruct each children node to be skipped OR those children nodes had to be referenced in defaults. I found that tedious and in come cases, impossible to solve - sometimes random nested value might be passed in the options as _something to be written_. Then, it's impossible to anticipate what keys/paths user has gave.

Technically, this is a breaking change, warranting **a major semver release**.

## 4.1.0 (2018-08-23)

- ✨ Implemented [matcher](https://www.npmjs.com/package/matcher) on `opts.ignorePaths` and `opts.ignoreKeys`. Now we can use wildcards in both.
- 🔧 Now keys that are covered by `opts.ignoreKeys` won't be flagged up as not covered by schema or a reference object. Previously, every key had to be covered, `opts.ignoreKeys` was only regarding the type comparison which was skipped. I know, that's illogical, it was a bug and it's now fixed. Sorry about that.

## 4.0.0 (2018-07-03)

I felt a need for this feature since the very beginning but only now the API's of my librarires started to become complex-enough to warrant nested options' objects.

- ✨ Now, we accept and enforce _nested options objects_. For example, you can have defaults as:

  ```js
  {
    oodles: {
      noodles: true;
    }
  }
  ```

  and if user customised your options object to the following, `check-types-mini` will throw:

  ```js
  {
    oodles: {
      noodles: "zzz"; //
    }
  }
  // => oodles.noodles is a string, not Boolean
  ```

- ✨ Also, rebased the code quite substantially, with some new deps and some old deps removed.
- ✨ `opts.ignorePaths` because now `opts.ignoreKeys` is not enough - what if key names are called the same in different nested opts object key's value child object key's values?
- ✨ Implemented _throw pinning_. It's fancy term meaning all internal errors are named with an ID and all unit tests are not just checking, _does it throw_ but _does it throw the particular error_, because it can _throw_ but _throw at wrong place_ that would be a defect, yet unit test would pass. As a side effect, this doesn't lock the throw error messages in the unit tests. Since we pin against the ID, we can tweak the error messages' text as much as we want as long as ID is kept the same.

## 3.4.0 (2018-06-10)

GitHub sold us out. God bless their souls and the new billionaire. In the meantime, we:

- ✨ Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis

## 3.3.0 (2018-05-11)

- ✨ Now unit tests point to ES Modules build. This means, code coverage will be correct from now on... No more missed Babel functions...

## 3.2.0 (2018-05-02)

- ✨ Set up [Prettier](https://prettier.io)
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove from production code.

## 3.1.0 (2018-01-29)

- ✨ `true` and `false` as precise types in `opts.schema`
- 💥 Removed `lodash.includes` (replaced with `Array.includes`)

## 3.0.0 (2017-12-08)

- 🔧 Rebased all the source to be in ES Modules.
- ✨ Set up Rollup and generate three flavours of the distribution: CommonJS, UMD and ES Modules (native source)

Bumping major just in case. API is the same, just when you consume from Rollup setups, `package.json` key entry `module` will be recognised and ES Modules build will be used natively. You'll get all the benefits of ES Modules, like tree-shaking.

## 2.7.0 (2017-10-14)

- 🔧 Moved to Babel's `babel-preset-env` preset, created `.babelrc` config file.
- 🔧 Set up to run unit tests against the transpiled version

## 2.6.0 (2017-09-19)

- 🔧 Now serving the main export transpiled, straight from root, `index-es5.js`.

## 2.5.0 (2017-09-12)

- 🔧 Removed JS Standard and replaced it with raw ESLint running on `airbnb-base` preset, with two exceptions: 1. no semicolons; 2. allow plus-plus in `for` loops.

## 2.4.0 (2017-08-07)

### Updated

- 📖 **Readme**. I was thinking, we don't even need to use `lodash.clonedeep`, because the defaults are always flat, plain objects. Since `Object.assign` takes many sources, it makes our life simpler:

```js
opts = Object.assign({}, defaults, opts)
checkTypes(opts, defaults <...>)
```

- Removed dependency on `lodash.clonedeep`. We are using flat default objects, so `Object.assign({}, ...)` will suffice.
- Removed redundant cloning of `Object.keys` in `Object.keys(ref).concat(` - the `concat` does not mutate the inputs, so I don't know what I was thinking when I coded that. Anyway, it's sorted now.
- Added some line breaks on the IF conditions to make them more readable.

## 2.3.0 (2017-07-20)

- All deps and removed few redundant ones, switching to ES6 counterparts.
- Name in documentation and licenses
- Added .npmignore

## 2.2.0 (2017-07-04)

### Added

- ✨ Now `opts.schema` understands `opts.acceptArrays` setting: if the latter is `true`, that array will be traversed and each key will be matched against the types supplied in `opts.schema`. No more errors telling that array does not match the required type when `opts.acceptArrays` is on and all types inside that array match the types required by `opts.schema`.
- More unit tests. Coverage is still solid 100%.

Funny, I discovered this issue when I tried to set up `check-types-mini` on `easy-replace` ([npm](https://www.npmjs.com/package/easy-replace), [GitLab](https://gitlab.com/codsen/codsen/tree/master/packages/easy-replace)). Like they say, eat what you cook - the easiest way to discover issues is to use your own software. Especially, in production.

## 2.1.0 (2017-06-18)

### Added

- ✨ Now, the errors which are caused by misconfiguration of the `check-types-mini` itself will reference it as a source of an error. Once this library is configured correctly, then the errors can be personalised as per `opts.msg`.

## 2.0.0 (2017-06-12)

### Changed

- ✨ BREAKING API CHANGES. Third argument `msg` moved to `opts.msg`. Fourth argument `optsVarName` moved to `opts.optsVarName`. That was the right thing to do. Sorry for any hassle updating.

## 1.6.0 (2017-06-11)

### Added

- ✨ `opts.schema` - let's you enforce any schema you want for any key. Case-insensitive, just put types. `object` means plain object, not `array`. `whatever`, and `any` are also valid values. Algorithm will check the `opts.schema` first, then if the keys does not exist there, will check its type in `defaults`.

## 1.5.0 (2017-06-11)

### Changed

- 🔧 Fixed a bug involving `null` values. I overused `existy()`, in this case, using it to check existence of a key in an Object. The right way is to use `.hasOwnProperty`. Silly me. {facepalm}
- 🔧 Now `opts.enforceStrictKeyset` checks both ways, the keysets of both object and reference object have to match _strictly_. Previously I tried to cheat and check only one direction, assuming the object will be `object-assign`'ed from the reference. But this morning I was thinking, what it isn't? For me it's easy to close this error rabbit-hole, so let's do it.

## 1.4.0 (2017-06-10)

### Added

- ✨ `opts.enforceStrictKeyset` will now by default `throw` if there are any keys in the options object, that don't exist in the reference object.

## 1.3.0 (2017-05-22)

### Added

- ✨ `opts.acceptArrays` will accept arrays too, if they contain only the same type elements as the one that's being checked.
- ✨ `opts.acceptArraysIgnore` - lets you ignore per-key level when `opts.acceptArrays` is on. 👍

## 1.2.0 (2017-05-15)

### Added

- `opts.ignoreKeys` won't throw now if input is a single string.

## 1.1.0 (2017-05-15)

### Added

- ✨ `opts.ignoreKeys`

## 1.0.0 (2017-05-15)

- First public release
