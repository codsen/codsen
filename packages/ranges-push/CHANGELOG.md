# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 7.3.0 (2026-09-01)

### Bug Fixes

- accept declared replacement indexes ([afb11c5](https://github.com/codsen/codsen/commit/afb11c52d948f0627842d2aa56696cc34ab52f60))
- align adjacent range value merging ([a812fd7](https://github.com/codsen/codsen/commit/a812fd7c5569a08a20b460519cf191bb32f0d011))
- align range input and output types ([1a13db6](https://github.com/codsen/codsen/commit/1a13db665fe2f9e77c6b5fd509980c87e5a57baf))
- normalize constructor options ([6c3a70c](https://github.com/codsen/codsen/commit/6c3a70c54572ec520afca64217cd9d5dad8369e5))
- preserve contained null range insertions ([2d9efe3](https://github.com/codsen/codsen/commit/2d9efe35a95079b63ba5b91a5a3d2047b599acd8))
- preserve zero insertion at index zero ([b854dbc](https://github.com/codsen/codsen/commit/b854dbcf5b5cb84753dc9a16859fe7d118c77353))
- validate ranges before mutation ([8cee677](https://github.com/codsen/codsen/commit/8cee6779cb54f7c843c6d9f797dd2cd97569948f))

### Features

- perf improvements ([e3e4d8e](https://github.com/codsen/codsen/commit/e3e4d8ede2add7e4b0e2369e1f69b0bd030a35c5))

### Performance Improvements

- add ranges-push diagnostics ([43a3d92](https://github.com/codsen/codsen/commit/43a3d92aca132269423c860ce0cb419fa52d1fba))
- bound first range coverage checks ([71be193](https://github.com/codsen/codsen/commit/71be1938b8838e562a24e02d83680119cb120ec1))
- cache unchanged current ranges ([a4a40af](https://github.com/codsen/codsen/commit/a4a40af94eefef05b889c6f486831275720a4146))
- streamline range ingestion ([c147d35](https://github.com/codsen/codsen/commit/c147d35c7b1d24d6c7906b4d32e568b915cbb942))

## 7.2.1 (2026-08-22)

### Performance Improvements

- optimise package hot paths and JSON editing ([f3112bd](https://github.com/codsen/codsen/commit/f3112bd7fc0d7c9bc09312d3744c950691d72ca5))

## 7.2.0 (2026-08-19)

### Bug Fixes

- make validation diagnostics safe ([7b01074](https://github.com/codsen/codsen/commit/7b0107476f12734aeb8e82852ba980b187280110))
- resolve various review findings ([b60e9ee](https://github.com/codsen/codsen/commit/b60e9eeb499af94685cfb87b4970fe025be1fc10))
- retire direct publish aliases ([f98e31e](https://github.com/codsen/codsen/commit/f98e31eb89bc185471225664e610b55f34fbf648))
- standardise internal merge option validation ([5697f44](https://github.com/codsen/codsen/commit/5697f44f4ca5c8fe53c32d6680582f4803022868))
- validate constructor options and range errs ([94de194](https://github.com/codsen/codsen/commit/94de194cf08161cdb6e9427b94dd21c22d4e90fc))

### Features

- add codsen-glob and migrate glob consumers ([5595a2b](https://github.com/codsen/codsen/commit/5595a2b267eaa6cb60072d037aef00b7a28edd42))
- refresh the tooling and generate with the latest dependencies ([781f802](https://github.com/codsen/codsen/commit/781f802911066a82a4533b0e5a3fcbd742d0dd83))
- replace string-strip-html's per-tag range re-merge with a ranges-push predicate ([913a9f6](https://github.com/codsen/codsen/commit/913a9f6323e5d4b7f95c9f282e0dacfcf145c128))

### Reverts

- Revert "Merge pull request #128 from codsen/release/npm-32198404552-1" ([5baeeaa](https://github.com/codsen/codsen/commit/5baeeaaa677b86f1eaa6396cadf3aea32b06416e)), closes [#128](https://github.com/codsen/codsen/issues/128)
- Revert "Merge pull request #127 from codsen/release/npm-32194020886-1" ([5f1e94d](https://github.com/codsen/codsen/commit/5f1e94deef910ce735266b16aeee08a76de7a862)), closes [#127](https://github.com/codsen/codsen/issues/127)

## 7.0.0 (2022-12-01)

### BREAKING CHANGES

- Minimum supported Node version is v14.18; we're dropping v12 support

## 6.2.0 (2022-08-12)

### Features

- export types ([2a9bfce](https://github.com/codsen/codsen/commit/2a9bfce036ed6d20afaecba1d4ccb922fd3f2958))
- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

## 6.1.2 (2022-04-18)

### Fixed

- tweak types ([275af61](https://github.com/codsen/codsen/commit/275af6157971be62636ff7a9c95c7bd800ef009d))

## 6.1.0 (2022-04-11)

### Features

- export defaults and version ([1107244](https://github.com/codsen/codsen/commit/1107244b45eff96ac1fc4ab992031ede0d10ba8c))

## 6.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS `require()`

## 5.1.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 5.0.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 5.0.1 (2021-01-28)

### Fixed

- add `testStats` to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 5.0.0 (2021-01-23)

### Features

- rewrite in TS, start using named exports ([8e75edf](https://github.com/codsen/codsen/commit/8e75edfac935f4f27604bb0b9731bd0ea4f2e7ec))

### BREAKING CHANGES

- previously you'd consume like: `import Ranges from ...` - now `import { Ranges } from ...`

## 4.0.0 (2020-11-28)

Accidental version bump during migration to SourceHut. Sorry about that.

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

- restores back as it was before, no changes to `opts.limitToBeAddedWhitespace` ([f0b36f3](https://gitlab.com/codsen/codsen/commit/f0b36f3))

## 3.4.0 (2019-09-04)

### Features

- accept nulls among pushed values, do not throw, just do nothing ([4badda3](https://gitlab.com/codsen/codsen/commit/4badda3))

## 3.3.0 (2019-08-08)

### Features

- `opts.mergeType` ([7efa4db](https://gitlab.com/codsen/codsen/commit/7efa4db))

## 3.2.0 (2019-06-18)

### Features

- Remove `check-types-mini` for perf reasons and also to reduce Lerna `ECYCLE` warnings ([50be5d8](https://gitlab.com/codsen/codsen/commit/50be5d8))

## 3.1.0 (2019-06-01)

### Features

- `ranges.replace()` ([f0a2de0](https://gitlab.com/codsen/codsen/commit/f0a2de0))

## 2.16.0 (2019-01-20)

- Various documentation and setup tweaks after we migrated to monorepo
- Setup refresh: updated dependencies and all config files using automated tools

## 2.13.0 (2018-12-26)

- Harden the type checks just in case ([106ae7a](https://gitlab.com/codsen/codsen/tree/master/packages/ranges-push/commits/106ae7a))
- Implement throw pinning in unit tests ([6b8c789](https://gitlab.com/codsen/codsen/tree/master/packages/ranges-push/commits/6b8c789))
- Omit the 3rd argument when it's equal to an empty string ([343c153](https://gitlab.com/codsen/codsen/tree/master/packages/ranges-push/commits/343c153))
- Add `opts.limitLinebreaksCount` ([55eedfa](https://gitlab.com/codsen/codsen/tree/master/packages/ranges-push/commits/55eedfa))

## 2.12.0 (2018-10-25)

- Updated all dependencies
- Restored coveralls.io reporting
- Restored unit test linting

## 2.11.0 (2018-07-26)

- If third argument is an empty string, now it's being completely omitted. This is necessary for unit tests' sanity. Otherwise, it's impossible to `deepEqual`-match.

## 2.10.0 (2018-07-03)

- Added `opts.limitLinebreaksCount` - this will allow double line breaks resulting in an empty row between the content lines.

## 2.9.0 (2018-06-18)

- Rename to `ranges-push` and migrate to Bitbucket

## 2.8.0 (2018-05-19)

- Fixed second input argument throw error message reporting. Previously, when second argument was of a wrong type, the first argument's details were reported which caused confusion. Fixed now.
- Throw error pinning in unit tests. Otherwise we would not be able to prove this feature above is correctly implemented. Both before and after were throwing an error. The correctness is distinguished by _which_ error exactly, (first arg's wrong type) `THROW_ID_09` or (newly added second arg's wrong type) `THROW_ID_10`. I'd go as far as to say, if _throw pinning_ was implemented at the beginning, this bug would not have happened.

## 2.7.0 (2018-05-11)

Setup refresh.

- Set up [Prettier](https://prettier.io)
- Removed `package.lock` and `.editorconfig`
- Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove them from production code.
- Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed

## 2.6.0 (2018-02-24)

- If `null` is being `.push`ed, nothing happens. It won't `throw` from now on.

## 2.5.0 (2018-02-10)

- Now accepts output of another slices class (its `.current()` output) as the first input argument. Now, it won't throw an error that second argument is missing, provided the validation of the array from the 1st argument passes.

  In practice, I'm going to use it in [string-remove-duplicate-heads-tails](https://www.npmjs.com/package/string-remove-duplicate-heads-tails) for example, where I there will be two-step process. Range comes in as a plausible range, then we traverse further and if further ranges are found, that plausible-one is merged into the real ranges slices array class. This merging up until now was a problem - it could only be done iterating one array and `.push`ing each range one-by-one into another slices array.

- 🔧 Because of the above I had to rewrite the whole validation and error throwing part. All unit tests are the same and more were added, so there shoud not be any breaking changes.

## 2.4.0 (2018-01-18)

- `opts.limitToBeAddedWhitespace` now also collapses the leading and trailing whitespace. If any chunk of leading whitespace (anything that would get `trim()`'med) contain line break `\n`, it's turned into `\n`. Otherwise, it's turned into single space.

```js
// does nothing to trimmed strings:
'aaa' => 'aaa'
// if leading or trailing whitespace doesn't contain \n, collapse to a single space
'  aaa   ' => ' aaa '
// otherwise, collapse to a single \n
'     \n\n   aaa  \n\n\n    ' => '\naaa\n'
```

## 2.3.0 (2018-01-16)

- `.push` as an alias for `.add`. Both do the same thing. I thought the name of this package has "push" so why there is no such method? Until now, that is.

## 2.2.0 (2017-12-29)

- When third argument is `null`, any merged range results will have there `null`.

## 2.1.0 (2017-12-20)

- `opts.limitToBeAddedWhitespace` - makes life easier when cleaning HTML. Now, chunk ranges can contain any amount of whitespace - the `current()` will run `string-collapse` on the to-be-inserted, third argument. Now, if there are any line breaks among the whitespace characters, the result will be a single line break instead. Basically, when this setting is active, only space or linebreak will be inserted in place of deleted range.

What this feature gives you is you can activate it and freely push chunks of string in, extracting whitespace along it and pushing it too. You don't need to care about excessive amount of it - this library will truncate it automatically. It's very handy when stripping strings from [HTML tags](https://www.npmjs.com/package/string-strip-html) for example.

## 2.0.0 (2017-12-05)

- Rewrite in ES modules
- Now serving three builds: CommonJS, UMD and ES modules, all wired up to appropriate end-points on `package.json`
- If you have two ranges where second-one completely overlaps the first-one and the first has third argument, something to insert in its place, that third argument will be discarded upon merge.

  Let's say you got these two ranges:

  ```js
  [
    [5, 6, " "],
    [1, 10],
  ];
  ```

  Previously, result would be `[1, 10, ' ']`. Now result will be `[1, 10]`. This is logical, because each range should take care to consider its vicinity. If `[1, 10]` came in without instructions to add something in its place, we assume this was intentional.

## 1.6.0 (2017-09-25)

- Actually serving the transpiled version as default. Sorry about that. Now the transpiled source is wired to `package.json` `main`. The proper Rollup setup (UMD, ESJ and ESM builds) is in coming next.

## 1.5.0 (2017-09-18)

- Separated the merging function into a separate library, [ranges-merge](https://www.npmjs.com/package/ranges-merge).

## 1.4.0 (2017-09-12)

- Separated ranges sorting function into a [separate library](https://www.npmjs.com/package/ranges-sort) because it will be needed in [Detergent](https://www.npmjs.com/package/detergent).
- Replaced JS Standard with ESLint on `airbnb-base` config with two exceptions: 1. no semicolons and 2. allow plus-plus in `for`-loops. For posterity JS Standard has been neglected by its maintainers, currently it's using half-year old version of ESLint, and doesn't tap to majority of its rules. After activating ESLint, it found some style issues that needed fixing. I like that.

## 1.3.0 (2017-08-30)

- Transpiled version is available from the folder `/es5/`.

## 1.2.0 (2017-08-16)

- 🔧 The input validation was not passing through the zero indexes for `.add()` because natural number checks were not including zero. Sorted now.

## 1.1.0 (2017-07-31)

- An improvement to the algorithm which doesn't change API: sorting and merging is now done upon querying `.current()`, not during `.add()`. This guarantees maximum data precision, especially if you don't do any `.add()` after calling `.current()` and processing the slices array using [string-replace-slices-array](https://www.npmjs.com/package/ranges-apply).

## 1.0.0 (2017-07-28)

- First public release
