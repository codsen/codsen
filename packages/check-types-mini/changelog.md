# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [2.7.0] - 2017-10-14
### Improved
- 🔧 Moved to Babel's `babel-preset-env` preset, created `.babelrc` config file.
- 🔧 Set up to run unit tests against the transpiled version

## [2.6.0] - 2017-09-19
### Changed
- Now serving the main export transpiled, straight from root, `index-es5.js`.

## [2.5.0] - 2017-09-12
### Changed
- Removed JS Standard and replaced it with raw ESLint running on `airbnb-base` preset, with two exceptions: 1. no semicolons; 2. allow plus-plus in `for` loops.

## [2.4.0] - 2017-08-07
### Updated
- **Readme**. I was thinking, we don't even need to use `lodash.clonedeep`, because the defaults are always flat, plain objects. Since `Object.assign` takes many sources, it makes our life simpler:

```js
opts = Object.assign({}, defaults, opts)
checkTypes(opts, defaults <...>)
```

### Removed
- Dependency on `lodash.clonedeep`. We are using flat default objects, so `Object.assign({}, ...)` will suffice.
- Redundant cloning of `Object.keys` in `Object.keys(ref).concat(` - the `concat` does not mutate the inputs, so I don't know what I was thinking when I coded that. Anyway, it's sorted now.

### Added
- Some line breaks on the IF conditions to make them more readable.

## [2.3.0] - 2017-07-20
### Updated
- All deps and removed few redundant ones, switching to ES6 counterparts.
- Name in documentation and licenses
### Added
- .npmignore

## [2.2.0] - 2017-07-04
### Added
- ✨ Now `opts.schema` understands `opts.acceptArrays` setting: if the latter is `true`, that array will be traversed and each key will be matched against the types supplied in `opts.schema`. No more errors telling that array does not match the required type when `opts.acceptArrays` is on and all types inside that array match the types required by `opts.schema`.
- More unit tests. Coverage is still solid 100%.

Funny, I discovered this issue when I tried to set up `check-types-mini` on [easy-replace](https://github.com/codsen/easy-replace). Like they say, eat what you cook - the easiest way to discover issues is to use your own software. Especially, in production.

## [2.1.0] - 2017-06-18
### Added
- ✨ Now, the errors which are caused by misconfiguration of the `check-types-mini` itself will reference it as a source of an error. Once this library is configured correctly, then the errors can be personalised as per `opts.msg`.

## [2.0.0] - 2017-06-12
### Changed
- ✨ BREAKING API CHANGES. Third argument `msg` moved to `opts.msg`. Fourth argument `optsVarName` moved to `opts.optsVarName`. That was the right thing to do. Sorry for any hassle updating.

## [1.6.0] - 2017-06-11
### Added
- ✨ `opts.schema` - let's you enforce any schema you want for any key. Case-insensitive, just put types. `object` means plain object, not `array`. `whatever`, and `any` are also valid values. Algorithm will check the `opts.schema` first, then if the keys does not exist there, will check its type in `defaults`.

## [1.5.0] - 2017-06-11
### Changed
- 🔧 Fixed a bug involving `null` values. I overused `existy()`, in this case, using it to check existence of a key in an Object. The right way is to use `.hasOwnProperty`. Silly me. {facepalm}
- 🔧 Now `opts.enforceStrictKeyset` checks both ways, the keysets of both object and reference object have to match _strictly_. Previously I tried to cheat and check only one direction, assuming the object will be `object-assign`'ed from the reference. But this morning I was thinking, what it isn't? For me it's easy to close this error rabbit-hole, so let's do it.

## [1.4.0] - 2017-06-10
### Added
- ✨ `opts.enforceStrictKeyset` will now by default `throw` if there are any keys in the options object, that don't exist in the reference object.

## [1.3.0] - 2017-05-22
### Added
- ✨ `opts.acceptArrays` will accept arrays too, if they contain only the same type elements as the one that's being checked.
- ✨ `opts.acceptArraysIgnore` - lets you ignore per-key level when `opts.acceptArrays` is on. 👍

## [1.2.0] - 2017-05-15
### Added
- `opts.ignoreKeys` won't throw now if input is a single string.

## [1.1.0] - 2017-05-15
### Added
- ✨ `opts.ignoreKeys`

## 1.0.0 - 2017-05-15
### New
- First public release

[1.1.0]: https://github.com/codsen/check-types-mini/compare/v1.0.1...v1.1.0
[1.2.0]: https://github.com/codsen/check-types-mini/compare/v1.1.0...v1.2.0
[1.3.0]: https://github.com/codsen/check-types-mini/compare/v1.2.2...v1.3.0
[1.4.0]: https://github.com/codsen/check-types-mini/compare/v1.3.0...v1.4.0
[1.5.0]: https://github.com/codsen/check-types-mini/compare/v1.4.0...v1.5.0
[1.6.0]: https://github.com/codsen/check-types-mini/compare/v1.5.0...v1.6.0
[2.0.0]: https://github.com/codsen/check-types-mini/compare/v1.6.0...v2.0.0
[2.1.0]: https://github.com/codsen/check-types-mini/compare/v2.0.0...v2.1.0
[2.2.0]: https://github.com/codsen/check-types-mini/compare/v2.1.0...v2.2.0
[2.3.0]: https://github.com/codsen/check-types-mini/compare/v2.2.0...v2.3.0
[2.4.0]: https://github.com/codsen/check-types-mini/compare/v2.3.0...v2.4.0
[2.5.0]: https://github.com/codsen/check-types-mini/compare/v2.4.0...v2.5.0
[2.6.0]: https://github.com/codsen/check-types-mini/compare/v2.5.0...v2.6.0
[2.7.0]: https://github.com/codsen/check-types-mini/compare/v2.6.0...v2.7.0
