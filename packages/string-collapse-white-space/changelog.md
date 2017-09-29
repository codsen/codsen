# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [2.3.0] - 2017-09-29
### Added
- ✨ The main source now is in ES2015 modules with `import`/`export`.
- ✨ Implemented Rollup to generate 3 flavours of this package: CommonJS, UMD and ESM `module` with `import`/`export`.
- ✨ `opts.recogniseHTML` (default true) - if string contains HTML, whitespace around brackets will be collapsed completely, for example: `<  img` => `<img`, not `<  img` => `< img` as before. The "before" result _now_ would yield only with this new setting turned off. Total 118 opening HTML tags are recognised (with or without attributes).

## [2.2.0] - 2017-09-16
### Added
- ✨ `opts.trimLines` - activates trim per-line basis
- ✨ `opts.trimnbsp` - non-breaking spaces are trimmed too
- ✨ switched to ESLint on `airbnb-base` config, with 3 exceptions: 1. no semicolons; 2. plus-plus allowed in loops;

## [2.1.0] - 2017-09-03
### Added
- ✨ Correctly treats non-breaking spaces - they are not considered _collapsable_ or _trimmable_ now.

## [2.0.0] - 2017-09-03
### Changed
- ✨ This morning I didn't like yesterday's v.1 API at all, personally I think it was stupid. So, I simplified it and basically, recoded the whole thing.

## 1.0.0 - 2017-09-02
### New
- ✨ First public release

[2.3.0]: https://github.com/codsen/string-collapse-white-space/compare/v2.2.0...v2.3.0
[2.2.0]: https://github.com/codsen/string-collapse-white-space/compare/v2.1.0...v2.2.0
[2.1.0]: https://github.com/codsen/string-collapse-white-space/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/codsen/string-collapse-white-space/compare/v1.0.0...v2.0.0
