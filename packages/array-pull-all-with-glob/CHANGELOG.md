# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## 2.0.0 - 2017-03-02
### Changed
- Simple thing, but, technically, a major API change. Input arguments are not mutated any more.
- New unit tests to guarantee that.
- Tightened the API with insurance against missing args or wrong types in the input. Now if the main input is missing, it will throw. If first argument (remove from where) is present, but second (what to remove) is missing, first arguement is returned. It's called being nice with others (libraries).

### Added
- Changelog.md

[2.0.0]: https://github.com/codsen/array-pull-all-with-glob/compare/v1.4.1...v2.0.0
