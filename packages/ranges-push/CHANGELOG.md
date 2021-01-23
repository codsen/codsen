# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 5.0.0 (2021-01-23)


### Bug Fixes

* Fix the Create New Issue URLs ([f5a41bf](https://github.com/codsen/codsen/commit/f5a41bf16fd8f43de7f8e7de68da562821ddb960))


### Features

* accept nulls among pushed values, do not throw, just do nothing ([8c49019](https://github.com/codsen/codsen/commit/8c490199bf6221db3287ea8aca127bd6ca0c4337))
* Add one more tag before which there will be a line break ([d178203](https://github.com/codsen/codsen/commit/d1782036b134102fd552d38d2d4f39c93195620b))
* hardening the type checks just in case ([dfab56a](https://github.com/codsen/codsen/commit/dfab56a67c3a49d37893597b934ab8a71c1df398))
* implement throw pinning in unit tests ([1a02084](https://github.com/codsen/codsen/commit/1a02084e1a0dfc4b602d9232506d8c3a6e7faa15))
* improved whitespace insertion algorithm ([4a3f0b3](https://github.com/codsen/codsen/commit/4a3f0b333907a913004f379244b52c770b190256))
* Initial release ([8db2df9](https://github.com/codsen/codsen/commit/8db2df9fb08d66cf6c7a75a57cdcd15a5ec12c1c))
* Merge modes via opts.mergeType ([2394464](https://github.com/codsen/codsen/commit/2394464976ce1970bcd31b45d9fd9955f4bbcc09))
* non-breaking spaces are now retained when pushing with whitespace limiter option on ([d44190a](https://github.com/codsen/codsen/commit/d44190ad22ada2f4c39b07d80262f71fd847d793))
* omit the 3rd argument when it's equal to an empty string ([ffe917d](https://github.com/codsen/codsen/commit/ffe917d298acf0789eb5762ceca59f0ddb726986))
* opts.limitLinebreaksCount ([c9ca23d](https://github.com/codsen/codsen/commit/c9ca23d45bb45499f1c2eed53e6a0380cb42961b))
* opts.mergeType ([758d4db](https://github.com/codsen/codsen/commit/758d4db949c18368b1d23e001ce5eb593423b0ff))
* ranges.replace() ([fc05132](https://github.com/codsen/codsen/commit/fc05132b6d00325d835b01240710824c67f47804))
* Remove check-types-mini for perf reasons and also to reduce Lerna ECYCLE warnings ([7e3eebb](https://github.com/codsen/codsen/commit/7e3eebbcf8a888e3cb6e221a28e58d072181432c))
* remove couple dependencies and rebase a little bit ([d27d0b8](https://github.com/codsen/codsen/commit/d27d0b8a48e7363effc5eb377ccb3b919f2129bd))
* rewrite in TS, start using named exports ([8e75edf](https://github.com/codsen/codsen/commit/8e75edfac935f4f27604bb0b9731bd0ea4f2e7ec))


### Reverts

* restores back as it was before, no changes to opts.limitToBeAddedWhitespace ([a725c73](https://github.com/codsen/codsen/commit/a725c73117d8a7b82cad5da6d009e618fd686b06))


### BREAKING CHANGES

* previously you'd consume like: "import Ranges from ..." - now "import { Ranges }
from ..."
* Second input argument, progressFn, was moved into opts.progressFn and opts was
placed into second input argument instead





## 4.0.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 3.7.0 (2020-02-01)

### Features

- remove couple dependencies and rebase a little bit ([616b47d](https://gitlab.com/codsen/codsen/commit/616b47df0ef6a5a72f766d690b0169608e39a4d9))

## 3.6.0 (2019-09-14)

### Features

- non-breaking spaces are now retained when pushing with whitespace limiter option on ([2de001d](https://gitlab.com/codsen/codsen/commit/2de001d))

## 3.5.0 (2019-09-11)

### Features

- improved whitespace insertion algorithm ([b8c4463](https://gitlab.com/codsen/codsen/commit/b8c4463))

### Reverts

- restores back as it was before, no changes to opts.limitToBeAddedWhitespace ([f0b36f3](https://gitlab.com/codsen/codsen/commit/f0b36f3))

## 3.4.0 (2019-09-04)

### Features

- accept nulls among pushed values, do not throw, just do nothing ([4badda3](https://gitlab.com/codsen/codsen/commit/4badda3))

## 3.3.0 (2019-08-08)

### Features

- opts.mergeType ([7efa4db](https://gitlab.com/codsen/codsen/commit/7efa4db))

## 3.2.0 (2019-06-18)

### Features

- Remove check-types-mini for perf reasons and also to reduce Lerna ECYCLE warnings ([50be5d8](https://gitlab.com/codsen/codsen/commit/50be5d8))

## 3.1.0 (2019-06-01)

### Features

- ranges.replace() ([f0a2de0](https://gitlab.com/codsen/codsen/commit/f0a2de0))

## 2.16.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 2.13.0 (2018-12-26)

- ✨ Harden the type checks just in case ([106ae7a](https://gitlab.com/codsen/codsen/tree/master/packages/ranges-push/commits/106ae7a))
- ✨ Implement throw pinning in unit tests ([6b8c789](https://gitlab.com/codsen/codsen/tree/master/packages/ranges-push/commits/6b8c789))
- ✨ Omit the 3rd argument when it's equal to an empty string ([343c153](https://gitlab.com/codsen/codsen/tree/master/packages/ranges-push/commits/343c153))
- ✨ Add `opts.limitLinebreaksCount` ([55eedfa](https://gitlab.com/codsen/codsen/tree/master/packages/ranges-push/commits/55eedfa))

## 2.12.0 (2018-10-25)

- ✨ Updated all dependencies
- ✨ Restored coveralls.io reporting
- ✨ Restored unit test linting

## 2.11.0 (2018-07-26)

- ✨ If third argument is an empty string, now it's being completely omited. This is necessary for unit tests' sanity. Otherwise, it's impossible to `deepEqual`-match.

## 2.10.0 (2018-07-03)

- ✨ Added `opts.limitLinebreaksCount` - this will allow double linebreaks resulting in an empty row between the content lines.

## 2.9.0 (2018-06-18)

- ✨ Rename to `ranges-push` and migrate to Bitbucket

## 2.8.0 (2018-05-19)

- ✨ Fixed second input argument throw error message reporting. Previously, when second argument was of a wrong type, the first argument's details were reported which caused confusion. Fixed now.
- ✨ Throw error pinning in unit tests. Otherwise we would not be able to prove this feature above is correctly implemented. Both before and after were throwing an error. The correctness is distinguished by _which_ error exactly, (first arg's wrong type) `THROW_ID_09` or (newly added second arg's wrong type) `THROW_ID_10`. I'd go as far as to say, if _throw pinning_ was implemented at the beginning, this bug would not have happened.

## 2.7.0 (2018-05-11)

Setup refresh.

- ✨ Set up [Prettier](https://prettier.io)
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove them from production code.
- ✨ Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed

## 2.6.0 (2018-02-24)

- ✨ Chillax™ feature. If `null` is being `.push`ed, nothing happens. It won't `throw` from now on.

## 2.5.0 (2018-02-10)

- ✨ Now accepts output of another slices class (its `.current()` output) as the first input argument. Now, it won't throw an error that second argument is missing, provided the validation of the array from the 1st argument passes.

  In practice, I'm going to use it in [string-remove-duplicate-heads-tails](https://www.npmjs.com/package/string-remove-duplicate-heads-tails) for example, where I there will be two-step process. Range comes in as a plausible range, then we traverse further and if further ranges are found, that plausible-one is merged into the real ranges slices array class. This merging up until now was a problem - it could only be done iterating one array and `.push`ing each range one-by-one into another slices array.

- 🔧 Because of the above I had to rewrite the whole validation and error throwing part. All unit tests are the same and more were added, so there shoud not be any breaking changes.

## 2.4.0 (2018-01-18)

- ✨ `opts.limitToBeAddedWhitespace` now also collapses the leading and trailing whitespace. If any chunk of leading whitespace (anything that would get `trim()`'med) contain line break `\n`, it's turned into `\n`. Otherwise, it's turned into single space.

```js
// does nothing to trimmed strings:
'aaa' => 'aaa'
// if leading or trailing whitespace doesn't contain \n, collapse to a single space
'  aaa   ' => ' aaa '
// otherwise, collapse to a single \n
'     \n\n   aaa  \n\n\n    ' => '\naaa\n'
```

## 2.3.0 (2018-01-16)

- ✨ `.push` as an alias for `.add`. Both do the same thing. I thought the name of this package has "push" so why there is no such method? Until now, that is.

## 2.2.0 (2017-12-29)

- ✨ When third argument is `null`, any merged range results will have there `null`.

## 2.1.0 (2017-12-20)

- ✨ `opts.limitToBeAddedWhitespace` - makes life easier when cleaning HTML. Now, chunk ranges can contain any amount of whitespace - the `current()` will run `string-collapse` on the to-be-inserted, third argument. Now, if there are any line breaks among the whitespace characters, the result will be a single line break instead. Basically, when this setting is active, only space or linebreak will be inserted in place of deleted range.

What this feature gives you is you can activate it and freely push chunks of string in, extracting whitespace along it and pushing it too. You don't need to care about excessive amount of it - this library will truncate it automatically. It's very handy when stripping strings from [HTML tags](https://www.npmjs.com/package/string-strip-html) for example.

## 2.0.0 (2017-12-05)

- ✨ Rewrite in ES modules
- ✨ Now serving three builds: CommonJS, UMD and ES modules, all wired up to appropriate end-points on `package.json`
- ✨ If you have two ranges where second-one completely overlaps the first-one and the first has third argument, something to insert in its place, that third argument will be discarded upon merge.

  Let's say you got these two ranges:

  ```js
  [
    [5, 6, " "],
    [1, 10],
  ];
  ```

  Previously, result would be `[1, 10, ' ']`. Now result will be `[1, 10]`. This is logical, because each range should take care to consider its vicinity. If `[1, 10]` came in without instructions to add something in its place, we assume this was intentional.

## 1.6.0 (2017-09-25)

- ✨ Actually serving the transpiled version as default. Sorry about that. Now the transpiled source is wired to `package.json` `main`. The proper Rollup setup (UMD, ESJ and ESM builds) is in coming next.

## 1.5.0 (2017-09-18)

- ✨ Separated the merging function into a separate library, [ranges-merge](https://www.npmjs.com/package/ranges-merge).

## 1.4.0 (2017-09-12)

- ✨ Separated ranges sorting function into a [separate library](https://www.npmjs.com/package/ranges-sort) because it will be needed in [Detergent](https://www.npmjs.com/package/detergent).
- ✨ Replaced JS Standard with ESLint on `airbnb-base` config with two exceptions: 1. no semicolons and 2. allow plus-plus in `for`-loops. For posterity JS Standard has been neglected by its maintainers, currently it's using half-year old version of ESLint, and doesn't tap to majority of its rules. After activating ESLint, it found some style issues that needed fixing. I like that.

## 1.3.0 (2017-08-30)

- ✨ Transpiled version is available from the folder `/es5/`.

## 1.2.0 (2017-08-16)

- 🔧 The input validation was not passing through the zero indexes for `.add()` because natural number checks were not including zero. Sorted now.

## 1.1.0 (2017-07-31)

- ✨ An improvement to the algorithm which doesn't change API: sorting and merging is now done upon querying `.current()`, not during `.add()`. This guarantees maximum data precision, especially if you don't do any `.add()` after calling `.current()` and processing the slices array using [string-replace-slices-array](https://www.npmjs.com/package/ranges-apply).

## 1.0.0 (2017-07-28)

- ✨ First public release
