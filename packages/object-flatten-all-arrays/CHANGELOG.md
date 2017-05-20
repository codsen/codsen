# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [3.1.0] - 2017-05-12
### Added
- options — `opts.flattenArraysContainingStringsToBeEmpty` now lets you flatten object values which have arrays which have strings into empty arrays. This is important. Trust me. No, seriously.

## [3.0.0] - 2017-03-17
### Changed
- Recoded all the core, improving the algorithm and making everything cleaner (hope so).
- Pinned JS Standard not to be the latest, to avoid sudden linting issues coming from nowhere and blocking builds when a new version of JS Standard is released.

### Added
- Even more tests.

### Unchanged
- Unit test coverage is still a solid 100%.

[3.0.0]: https://github.com/codsen/object-flatten-all-arrays/compare/v2.0.0...v3.0.0
[3.1.0]: https://github.com/codsen/object-flatten-all-arrays/compare/v3.0.0...v3.1.0
