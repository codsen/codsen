# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 7.13.1 (2021-01-28)

### Bug Fixes

- add testStats to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 7.13.0 (2021-01-23)

### Features

- rewrite in TS ([136fc5f](https://github.com/codsen/codsen/commit/136fc5fadf6fc8ad0a969e33ea3db2a125adbb7e))

## 7.12.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 7.11.0 (2020-01-26)

### Features

- remove two dependencies and "info" mode which never worked ([89c06f4](https://gitlab.com/codsen/codsen/commit/89c06f4b8db591fc7d6b9f6cfeb287495985a04d))

## 7.10.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 7.6.0 (2018-10-14)

- ✨ Updated all dependencies and restored coverage tracking both via terminal when testing and through coveralls.io

## 7.5.0 (2018-06-10)

- ✨ Moved to BitBucket. GitHub sold us out.
- ✨ Removed Travis and BitHound (RIP), enabled Codacy (for code quality audit)
- ✨ Removed `package-lock`

## 7.4.0 (2018-05-02)

### Added

- ✨ Set up [Prettier](https://prettier.io)
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove from production code.

## 7.3.0 (2018-01-03)

### Added

- ✨ Updated to the latest release of `ast-monkey-traverse` ([npm](https://www.npmjs.com/package/ast-monkey-traverse), [GitLab](https://gitlab.com/codsen/codsen/tree/master/packages/ast-monkey-traverse)) which gives the `innerObj.path` in the callback object. The path is exactly the same notation as per popular [object-path](https://www.npmjs.com/package/object-path) and you can feed `innerObj.path` to `object-path`, you'd get `current`. However, this enables us to traverse up the tree, following the path. That's the reason why I added this feature - to traverse the AST up to root when resolving variables in [json-variables](https://www.npmjs.com/package/json-variables).

## 7.2.0 (2017-12-23)

### Changed

- ✨ Separated `traverse()` into a standalone library, `ast-monkey-traverse` ([npm](https://www.npmjs.com/package/ast-monkey-traverse), [GitLab](https://gitlab.com/codsen/codsen/tree/master/packages/ast-monkey-traverse)) and then tapped it

## 7.1.0 (2017-10-29)

### Added

- ✨ `find()` and `del()` methods previously were using string-to-string comparisons. I replaced `lodash.isequal` with `ast-compare` ([npm](https://www.npmjs.com/package/ast-compare), [GitLab](https://gitlab.com/codsen/codsen/tree/master/packages/ast-compare)) running in strict mode with wildcards enabled. Now you can use [matcher](https://github.com/sindresorhus/matcher/) API when querying the keys or values.
- ✨ Some rebasing done to improve the algorithm's performance. For example, `find()` and `del()` previously matched the actual content first, then checked `opts.only` conditions. It was not effective because why perform a check if `opts.only` is not satisfied anyway? Now, `opts.only` checks, is it of a desired type, and if so, continues to compare the values.

## 7.0.0 (2017-10-23)

### Changed

- ✨ The main source now is in ES2015 modules with `import`/`export`.
- ✨ Implemented Rollup to generate 3 flavours of this package: CommonJS, UMD and ESM `module` with `import`/`export`.

## 6.4.0 (2017-09-19)

### Removed

- 🔧 JS Standard and replaced it with raw ESLint on `airbnb-base` config, with override to ban semicolons.

## 6.3.0 (2017-07-29)

### Removed

- 🔧 Removed `object-assign` and replaced it with ES6 native `Object.assign`.

## 6.2.0 (2017-06-18)

### Removed

- 🔧 Removed `monkey.existy()` from the exported methods list. It's not used any more as checks are done stricly against `undefined`. Now `null` can be a valid value, as per JSON data types spec.

## 6.1.0 (2017-06-18)

### Added

- ✨ Added checkTypes() onto drop(). Missed it this morning. Now all sorted.

## 6.0.0 (2017-06-18)

BREAKING CHANGES

JSON spec allows objects to have `null` in values. However, the traversal algotithm has not (until now) considered that. The key in an array would have `val` reported as `null` - same as (theoretical) object that has `null` as key's value.

This now changes.

**Now, the absence of value will be marked with `undefined`. Checking does a key/value pair have a value should be done checking if value is not `undefined`.**

This changes how you interact with `traversal()` function. Sorry about this breaking change, but it's part of my major drive to have all my libraries to support JSON spec. And in JSON, objects can have `null` values.

### Changed

- 🔧 Absence of value during traversal (as is the case when traversing arrays) is now marked as `undefined`. Previously it was `null`. This will surely break all the algorithms that use `monkey.traverse()`. On a positive side, once you migrate your code to `ast-monkey` v6, you'll be able to support `null` in object key values, as per JSON spec.

### Added

- ✨ `opts.only` is now present on all relevant `ast-monkey`'s methods and allows you to describe in natural language do you want to query only objects, or arrays or both. Previously it was only both. Supported values for `opts.only` are quite wide:

```js
// keywords for `opts.only` to query only objects:
["object", "objects", "obj", "ob", "o"][
  // keywords for `opts.only` to query only arrays:
  ("array", "arrays", "arr", "aray", "arr", "a")
][
  // keywords for `opts.only` to query both:
  ("any",
  "all",
  "everything",
  "both",
  "either",
  "each",
  "whatever",
  "whatevs",
  "e")
];
```

## 5.5.0 (2017-06-17)

Hardened the API, namely, all added more validations to options object key values.

### Added

- ✨ Recoded all options objects' validations, on each method. Preparing for next big secret feature. We'll need this.

## 5.4.0 (2017-06-10)

### Added

- ✨ [Holes in arrays](http://speakingjs.com/es5/ch18.html#array_holes) were skipped in `traverse()` as if they didn't exist. Now I push it further, `traverse()` will silently delete any holes in arrays it encounters. I think this feature a no-brainer since array holes have no use in JS.

## 5.3.0 (2017-05-15)

### Added

- ✨ Set `standard` to be consumer under normal semver range, not _the latest_ in order to prevent surprises in the future. Which happened as late as v10.

## 5.2.0 (2017-05-15)

### Added

- ✨ Tighetened the API in cases when `monkey()` inputs are missing or falsey.

## 5.1.0 (2017-05-02)

### Added

- ✨ `innerObj.parent` to `traverse()`. Now you can query sibling elements. I needed this for `json-variables` ([npm](https://www.npmjs.com/package/json-variables), [GitLab](https://gitlab.com/codsen/codsen/tree/master/packages/json-variables)) to allow variables lookup at deeper levels, not only at the root. 🦄

## 5.0.0 (2017-04-30)

After spending nearly whole Sunday testing [v4], I discovered that passing `undefined` as an instruction to delete is wrong, because how do you pass the message that the current item is an array? Previously, when there were no `null` values allowed, null in the value meant array, but also, when received as a result of `traverse()` it meant an instruction to delete. Now we can't touch `null` because it's a legitimate value! So we switched to `undefined`. But we can't use it for both as an instruction to delete AND as a marker of an array, because that way we will not be able to delete from arrays.

### Changed

- 🔧 Internally, the message to delete in `traverse()` is now `NaN`.

### Unchanged

- 🔧 All the methods stay the same. I just rewired all internal messaging to use `NaN` instead of `undefined` as an instruction for `traverse()` to delete.

## 4.0.0 (2017-04-30)

The good thing about being not popular is you can make breaking changes and very few (if anybody) will care. I will make use of this privilege and do some cardinal yet necessary API changes.

### Changed

- 🔧 Removing options from `traverse()`. It's not necessary any more. See below why.
- 🔧 When particular node is to be deleted, the message (function's `return` value) previously was `null`. This is not effective as JSON objects can have `null` values and this means `monkey.traverse()` does not know, is it value `null` being returned recursively, or is it an instruction coming from deeper resursions to delete current thing. That's why I decided to move onto `undefined` as a _deletion message_ — it can't be a JSON value, and it does not belong among the object values — it's perfect format for a deletion message.

### Unchanged

- 🔧 All the methods stay the same. I just rewired all internal messaging to use `undefined` instead of `null` as an instruction for `traverse()` to delete.

## 3.3.0 (2017-04-29)

### Added

- `🐒.traverse()` gets _options_! ✨ Optional `opts.nullDeletes===false` now let's you to write `null` values during traversal. Previously on all cases (and currently during default `opts.nullDeletes===true`) `null` would be interpreted as an instruction to delete the current piece of AST. Now you can essentially turn off the deletion in favor of being able to write `null` as value. For the record, `null` is a valid JSON value type. 🦄

## 3.2.0 (2017-04-04)

### Added

- ✨ Imagine, you're using `🐒.traverse()` ([ast-monkey on npm](https://www.npmjs.com/package/ast-monkey#traverse)/[ast-monkey on GitLab](https://gitlab.com/codsen/codsen/tree/master/packages/ast-monkey#traverse)) on the following piece of AST:

```js
{
  title: ['something', 'anything'],
  title_data: {
    subtitle: 'text',
    submarine: 'ship'
  }
}
```

When you'll be traversing the array, `['something', 'anything']`, you'll have access to the **key name**, `title`, via `innerObj.topmostKey` on the callback. ✨

I needed this feature for `json-variables` ([npm](https://www.npmjs.com/package/json-variables), [GitLab](https://gitlab.com/codsen/codsen/tree/master/packages/json-variables)) where I wanted to access `title_data` key, same-named key except with appended string, at the same level as parent. This does not affect any unit tests, it's a handy extra information piece which was always there, only just now tapped. 👍

## 3.1.0 (2017-04-01) International Fools day No tricks here though

### Improved

- 🔧 All this Saturday morning I worked on `🐒.traverse()`. Yesterday night I discovered that when you delete something on `traverse()`, the traversal reports extra non-existing nodes. The solution is not so elementary. Yes, the iterator was not being reduced in the `for` loop - `i--` was missing - but there were also more fixes necessary to implement for this to work. Now when you want to instruct `traverse()` to delete current node, you have to pass `null` (`undefined` won't work). I believe that's how everybody were using it anyway, so it doesn't warrant major semver bump. ✨

### Added

- ✨ Added `traverse()` unit tests, namely, `09.x` group.

### Unchanged

- Unit test coverage stays solid 100% lines.

## 3.0.0 (2017-03-20)

### Changed

BREAKING API CHANGES.

- 🔧 `flatten()` method renamed to `arrayFirstOnly()` to reflect better what this does. The real "flatten" is [object-flatten-all-arrays](https://www.npmjs.com/package/object-flatten-all-arrays) and while it could be rewritten in `ast-monkey`, it goes against the overall flow of the `ast-monkey`'s algorithm — 🐒 goes horizontal, by branch, while `flatten-all-arrays` goes vertically, by array, all keys at once. The new `arrayFirstOnly()` is easy feature because it simply filters the first element of each array encountered during the traversal.

### Added

- ✨ Exposed `.traverse()` too; shielded its inner API with another function (one input arguement-less now)

## 2.9.0 (2017-03-09) International recursive alrorithms day

### Added

- ✨ `.flatten()`
- ✨ related unit tests.

### Changed

- `.info()` now returns the input, not `undefined`. This doesn't warrant major version bump because method was for logging only and nothing changes in this aspect.

## 2.8.0 (2017-03-02)

### Added

- ✨ Now cloning all arguments in main `🐒()` and auxiliary `traverse()` functions' input object args to prevent any accidental mutation. **This is big and very important.**

## 2.7.0 (2017-02-20)

### Tweaks

- Replaced spread operator with lodash equivalent to avoid unnecessary Babel use 😌

## 2.6.0 (2017-02-19) Actual day of NTFS invention

### Added

- ✨ Incoming input is cloned upon receiving and clone is used instead, so that original input is not mutated. This is very important. ✨

## 2.5.0 (2017-02-18)

### Added

- ✨ Rebased the requirements for `opts.key` or `opts.val` to exist, now `find()` and `del()` are combined.

## 2.4.0 (2017-02-18)

### Added

- ✨ Enforcing the {index: ?} to be provided for `drop()`. ✨

## 2.3.0 (2017-02-18)

### Added

- ✨ Added `index` key to each of `find()` result object. 👌

## 2.2.0 (2017-02-16) International software testers commemoration day

### Added

- ✨ Added `del()` method which deletes pieces from AST's by key or by value or by both. It leaves empty stumps and does not clean after deletion.

## 2.0.0 (2017-02-16)

### Changed

- 🔧 Major API change. Initial release's `get()` didn't make sense. It was returning a "synthetic" object with a separate keys containing info about fetched piece of AST, not the piece itself. This meant, it was not possible to actually _get_ the whole intact piece! Now, I am simply returning the whole finding from `get()`. That's it. 😌
