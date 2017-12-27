# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.1.0] - 2017-12-27
### Added
- ✨ Now, this library can convert the next index, right outside of the last character.

Imagine, you have a string, astral character `\uD834\uDF06`.
Now describe its contents in terms of `String.slice()` range.
That would be `[0, 2]`. Now, this index \#2 is outside of the string character
indexes range! We have only `\uD834` at \#0 and `\uDF06` at \#1. There's no \#2!

Previously, this \#2 would have caused an error. Now it does not. We can actually
calculate and convert the next character, right outside of the string too. After
all, the calculation needs just the lengths of all the characters BEFORE it, and
we have that!

Practically, this is very important feature, it means we now can convert the ranges
that include string's last character.

## 1.0.0 - 2017-12-25
### New
- ✨ First public release

[1.1.0]: https://github.com/codsen/string-convert-indexes/compare/v1.0.0...v1.1.0
