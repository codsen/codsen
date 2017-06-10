# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [5.4.0] - 2017-06-10
### Added
- [Holes in arrays](http://speakingjs.com/es5/ch18.html#array_holes) were skipped in `traverse()` as if they didn't exist. Now I push it further, `traverse()` will silently delete any holes in arrays it encounters. I think this feature a no-brainer since array holes have no use in JS.

## [5.3.0] - 2017-05-15
### Added
- Set `standard` to be consumer under normal semver range, not _the latest_ in order to prevent surprises in the future. Which happened as late as v10.

## [5.2.0] - 2017-05-15
### Added
- Tighetened the API in cases when `monkey()` inputs are missing or falsey.

## [5.1.0] - 2017-05-02

### Added
- `innerObj.parent` to `traverse()`. Now you can query sibling elements. I needed this for [json-variables](https://github.com/codsen/json-variables) to allow variables lookup at deeper levels, not only at the root. 🦄

## [5.0.0] - 2017-04-30

After spending nearly whole Sunday testing [v4], I discovered that passing `undefined` as an instruction to delete is wrong, because how do you pass the message that the current item is an array? Previously, when there were no `null` values allowed, null in the value meant array, but also, when received as a result of `traverse()` it meant an instruction to delete. Now we can't touch `null` because it's a legitimate value! So we switched to `undefined`. But we can't use it for both as an instruction to delete AND as a marker of an array, because that way we will not be able to delete from arrays.

### Changed
- Internally, the message to delete in `traverse()` is now `NaN`.
### Unchanged
- All the methods stay the same. I just rewired all internal messaging to use `NaN` instead of `undefined` as an instruction for `traverse()` to delete.

## [4.0.0] - 2017-04-30

The good thing about being not popular is you can make breaking changes and very few (if anybody) will care. I will make use of this privilege and do some cardinal yet necessary API changes.

### Changed
- Removing options from `traverse()`. It's not necessary any more. See below why.
- When particular node is to be deleted, the message (function's `return` value) previously was `null`. This is not effective as JSON objects can have `null` values and this means `monkey.traverse()` does not know, is it value `null` being returned recursively, or is it an instruction coming from deeper resursions to delete current thing. That's why I decided to move onto `undefined` as a _deletion message_ — it can't be a JSON value, and it does not belong among the object values — it's perfect format for a deletion message.

### Unchanged
- All the methods stay the same. I just rewired all internal messaging to use `undefined` instead of `null` as an instruction for `traverse()` to delete.

## [3.3.0] - 2017-04-29
### Added
- `🐒.traverse()` gets _options_! ✨ Optional `opts.nullDeletes===false` now let's you to write `null` values during traversal. Previously on all cases (and currently during default `opts.nullDeletes===true`) `null` would be interpreted as an instruction to delete the current piece of AST. Now you can essentially turn off the deletion in favor of being able to write `null` as value. For the record, `null` is a valid JSON value type. 🦄

## [3.2.0] - 2017-04-04
### Added
- Imagine, you're using [`🐒.traverse()`](https://github.com/codsen/ast-monkey#traverse) on the following piece of AST:

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

I needed this feature for [json-variables](https://github.com/codsen/json-variables) where I wanted to access `title_data` key, same-named key except with appended string, at the same level as parent. This does not affect any unit tests, it's a handy extra information piece which was always there, only just now tapped. 👍

## [3.1.0] - 2017-04-01 International Fools day. No tricks here though.
### Improved
- All this Saturday morning I worked on `🐒.traverse()`. Yesterday night I discovered that when you delete something on `traverse()`, the traversal reports extra non-existing nodes. The solution is not so elementary. Yes, the iterator was not being reduced in the `for` loop — `i--` was missing — but there were also more fixes necessary to implement for this to work. Now when you want to instruct `traverse()` to delete current node, you have to pass `null` (`undefined` won't work). I believe that's how everybody were using it anyway, so it doesn't warrant major semver bump. ✨
### Added
- Added `traverse()` unit tests, namely, `09.x` group.
### Unchanged
- Unit test coverage stays solid 100% lines.

## [3.0.0] - 2017-03-20
### Changed
BREAKING API CHANGES.
- `flatten()` method renamed to `arrayFirstOnly()` to reflect better what this does. The real "flatten" is [object-flatten-all-arrays](https://www.npmjs.com/package/object-flatten-all-arrays) and while it could be rewritten in `ast-monkey`, it goes against the overall flow of the `ast-monkey`'s algorithm — 🐒 goes horizontal, by branch, while `flatten-all-arrays` goes vertically, by array, all keys at once. The new `arrayFirstOnly()` is easy feature because it simply filters the first element of each array encountered during the traversal.
### Added
- Exposed `.traverse()` too; shielded its inner API with another function (one input arguement-less now)

## [2.9.0] - 2017-03-09 International recursive alrorithms day
### Added
- `.flatten()` ✨
- related unit tests.

### Changed
- `.info()` now returns the input, not `undefined`. This doesn't warrant major version bump because method was for logging only and nothing changes in this aspect.

## [2.8.0] - 2017-03-02
### Added
- Now cloning all arguments in main `🐒()` and auxiliary `traverse()` functions' input object args to prevent any accidental mutation. **This is big and very important.**

## [2.7.0] - 2017-02-20
### Tweaks
- Replaced spread operator with lodash equivalent to avoid unnecessary Babel use 😌

## [2.6.0] - 2017-02-19 Actual day of NTFS invention
### New
- Incoming input is cloned upon receiving and clone is used instead, so that original input is not mutated. This is very important. ✨

## [2.5.0] - 2017-02-18
### New
- Rebased the requirements for `opts.key` or `opts.val` to exist, now `find()` and `del()` are combined.

## [2.4.0] - 2017-02-18
### New
- Enforcing the {index: ?} to be provided for `drop()`. ✨

## [2.3.0] - 2017-02-18
### New
- Added `index` key to each of `find()` result object. 👌

## [2.2.0] - 2017-02-16 International software testers commemoration day
### New
- Added `del()` method which deletes pieces from AST's by key or by value or by both. It leaves empty stumps and does not clean after deletion.

## [2.0.0] - 2017-02-16
### Changed
- Major API change. Initial release's `get()` didn't make sense. It was returning a "synthetic" object with a separate keys containing info about fetched piece of AST, not the piece itself. This meant, it was not possible to actually _get_ the whole intact piece! Now, I am simply returning the whole finding from `get()`. That's it. 😌

[2.0.0]: https://github.com/codsen/ast-monkey/compare/v1.0.1...v2.0.0
[2.2.0]: https://github.com/codsen/ast-monkey/compare/v2.1.0...v2.2.0
[2.3.0]: https://github.com/codsen/ast-monkey/compare/v2.2.0...v2.3.0
[2.4.0]: https://github.com/codsen/ast-monkey/compare/v2.3.0...v2.4.0
[2.5.0]: https://github.com/codsen/ast-monkey/compare/v2.4.0...v2.5.0
[2.6.0]: https://github.com/codsen/ast-monkey/compare/v2.5.0...v2.6.0
[2.7.0]: https://github.com/codsen/ast-monkey/compare/v2.6.0...v2.7.0
[2.8.0]: https://github.com/codsen/ast-monkey/compare/v2.7.0...v2.8.0
[2.9.0]: https://github.com/codsen/ast-monkey/compare/v2.8.0...v2.9.0
[3.0.0]: https://github.com/codsen/ast-monkey/compare/v2.9.0...v3.0.0
[3.1.0]: https://github.com/codsen/ast-monkey/compare/v3.0.0...v3.1.0
[3.2.0]: https://github.com/codsen/ast-monkey/compare/v3.1.0...v3.2.0
[3.3.0]: https://github.com/codsen/ast-monkey/compare/v3.2.2...v3.3.0
[4.0.0]: https://github.com/codsen/ast-monkey/compare/v3.3.0...v4.0.0
[5.0.0]: https://github.com/codsen/ast-monkey/compare/v4.0.0...v5.0.0
[v4]: https://github.com/codsen/ast-monkey/compare/v3.3.0...v4.0.0
[5.1.0]: https://github.com/codsen/ast-monkey/compare/v5.0.0...v5.1.0
[5.2.0]: https://github.com/codsen/ast-monkey/compare/v5.1.0...v5.2.0
[5.3.0]: https://github.com/codsen/ast-monkey/compare/v5.2.0...v5.3.0
[5.4.0]: https://github.com/codsen/ast-monkey/compare/v5.3.0...v5.4.0
