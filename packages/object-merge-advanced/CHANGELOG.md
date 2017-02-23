# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [2.0.0] - 2017-02-23
### Changed
- Major API change. Input argument objects are not mutated any more. Function first clones what it later uses.
- Adding tests for input argument mutation (`3.x` group).
- All auxiliary functions are ported inside the main exported function. Looks cleaner.

[2.0.0]: https://github.com/code-and-send/object-merge-advanced/compare/v1.6.0...v2.0.0
