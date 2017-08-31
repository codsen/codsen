# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.2.1] - 2017-09-01
### Removed
- Some inline `TODO` comments. They were actually redundant, the `unfancy` was already applied since `1.1.0
### Added
- A transpiled version in ES5 in `/es5/` folder.
- More badges in readme.

## [1.2.0] - 2017-08-07
### Added
- More unit tests. Everything indeed looks ok. So far. Knock knock knock on the wood.

## [1.1.0] - 2017-08-07
### Added
- ✨ `opts`. It goes with its train of options type enforcing using [check-types-mini](https://github.com/codsen/check-types-mini) to maintain the peace and sanity 🌈🦄.
- ✨ `opts.unfancyTheAltContents` is now on by default, but you can turn it off. It `trim`s your image ALT attribute contents and replaces all fancy characters with simpler equivalents. For example, curly quotes, m-dashes and so on. See the [string-unfancy](https://github.com/codsen/string-unfancy) which drives the replacement.

## 1.0.0 - 2017-08-05
### New
- First public release

[1.2.1]: https://github.com/codsen/html-img-alt/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/codsen/html-img-alt/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/codsen/html-img-alt/compare/v1.0.1...v1.1.0
