# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [2.3.0] - 2017-02-18
### New
- Added `index` key to each of `find()` result object.

## [2.2.0] - 2017-02-16
### New
- Added `del()` method which deletes pieces from AST's by key or by value or by both. It leaves empty stumps and does not clean after deletion.

## [2.0.0] - 2017-02-16
### Changed
- Major API change. Initial release's `get()` didn't make sense. It was returning a "synthetic" object with a separate keys containing info about fetched piece of AST, not the piece itself. This meant, it was not possible to actually _get_ the whole intact piece! Now, I am simply returning the whole finding from `get()`. That's it.

[2.0.0]: https://github.com/code-and-send/ast-monkey/compare/v1.0.1...v2.0.0
[2.2.0]: https://github.com/code-and-send/ast-monkey/compare/v2.1.0...v2.2.0
