# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [3.4.0] - 2017-10-02
### Added
- ✨ Now serving a transpiled version.
- ✨ Raw ESLint, removed JS Standard.

## [3.3.0] - 2017-08-21
### Added
- ✨ `opts.mergeArraysWithoutLineBreaks` to skip adding the `<br />`'s when merging arrays. The problem was that we do need the `br`'s but when rows are wrapped with conditional statements, those `br`'s end up _inside_ the conditional statements, so we need to turn off automatic addition of `br`'s because otherwise we would always see them.

Observe this data structure of an imaginary email template, in JSON:

```json
...
"text_field": [
  "%%_row1_line_%%",
  "%%_row2_line_%%",
  "%%_row3_line_%%"
],
"text_field_data": {
  "row1_line": "\n{% if %%-row1_var-%% %}%%_row1_var_%%<br />{% endif %}",
  "row2_line": "\n{% if %%-row2_var-%% %}%%_row2_var_%%<br />{% endif %}",
  "row3_line": "\n{% if %%-row3_var-%% %}%%_row3_var_%%<br />{% endif %}",
  "row1_var": "addressLine1",
  "row2_var": "addressLine2",
  "row3_var": "addressLine3"
},
...
```

With `opts.mergeArraysWithoutLineBreaks` off, the flatten function of this library would add line breaks to after `%%_row1_line_%%` and `%%_row2_line_%%`, but that's wrong, because they would end up outside of conditional statements. Actually, those `br`'s would even be redundant anyway, notice how `row1_line`, `row2_line` and `row3_line` already have `br`'s inside conditional Nunjucks statements...

## [3.2.0] - 2017-07-21
### Added
- ✨ More improvements to the array-within-array flattening scenarios.

## [3.1.0] - 2017-07-21
### Added
- ✨ When deeper level array is flattened referencing a string, result is the sum of all strings within the array, joined with a space, and each string wrapped according to wrapping settings.

For example, `['aaa', 'bbb', 'ccc']` referencing string 'zzz' would yield string `%%_aaa_%% %%_bbb_%% %%_ccc_%%` (that's default wrapping settings, which can be customised).

## [3.0.0] - 2017-04-27
### Changed
- 🔧 `opts.wrapHeads` is now `opts.wrapHeadsWith`
- 🔧 `opts.wrapTails` is now `opts.wrapTailsWith`

## [2.0.0] - 2017-04-25
### Changed
- 🔧 Major API change and major semver bump: `opts.dontWrapKeysStartingWith` and `opts.dontWrapKeysEndingWith` are now one key, `opts.dontWrapKeys` and the same (and better) result is achieved using wildcards (`*` symbols). Now you can have as many wildcards as you like, not only at the beginning or the ending of a string (or arrays of strings), but also anywhere in the middle too. Also you can set multiple wildcards in the same string.

## [1.2.0] - 2017-04-24
### Added
- ✨ Made the algorithm to be even more smarter: when the value has no spaces around already existing `heads` and `tails`, for example `{{value}}`, but you want, in general, to have a space around your wrappings, you set `heads` for for example: `{{ ` with a trailing space. Previously, this would have caused double wrapping. Now, `heads` and `tails` are trimmed before search, so go crazy with the white space!

## [1.1.0] - 2017-04-20
### Added
- ✨ New options setting `opts.ignore` which lets you skip flattening on an array (or a single string) of keys.
- ✨ New options setting `opts.whatToDoWhenReferenceIsMissing` which allows you to specify exactly what do you want to happen when the equivalent value in the reference (object/array/string/whatever) is falsey.
### Improved
- 🔧 Done some rebasing, for example, `util.arrayiffyString` now DRY'ies the code a bit.
### Updated
- Readme
### Unchanged
- Code coverage is still 100%

## 1.0.0 - 2017-04-03
### New
- ✨ First public release

[1.1.0]: https://github.com/codsen/object-flatten-referencing/compare/v1.0.1...v1.1.0
[1.2.0]: https://github.com/codsen/object-flatten-referencing/compare/v1.1.0...v1.2.0
[2.0.0]: https://github.com/codsen/object-flatten-referencing/compare/v1.2.0...v2.0.0
[3.0.0]: https://github.com/codsen/object-flatten-referencing/compare/v2.0.0...v3.0.0
[3.1.0]: https://github.com/codsen/object-flatten-referencing/compare/v3.0.0...v3.1.0
[3.2.0]: https://github.com/codsen/object-flatten-referencing/compare/v3.1.0...v3.2.0
[3.3.0]: https://github.com/codsen/object-flatten-referencing/compare/v3.2.0...v3.3.0
[3.4.0]: https://github.com/codsen/object-flatten-referencing/compare/v3.3.1...v3.4.0
