# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.8.0] - 2017-09-24
### Changed
- Removed JS Standard and swiched to raw ESLint on `airbnb-base` preset with config override to ban semicolons.
- Made all linting checks to pass
- Tweaked readme
- Added gif files to `npmignore` so they don't get `npm i`nstalled
- Updated bithound config to reflect the new setup

## [1.7.0] - 2017-08-22
### Added
- More badges to `readme`
### Updated
- Deps and `package.json`

## [1.6.0] - 2017-07-23
### Updated
- Updated to the latest API, adding recognition of the dates in titles in format `2014/04-15`

## [1.5.0] - 2017-07-22
### Updated
- Updated to the latest API, adding improved recognition of the titles
- Documentation with up-to-date author's name

### Added
- `npmignore`

## [1.4.0] - 2017-06-29
### Updated
Updated all dependencies

## [1.3.0] - 2017-06-29
### Added
Updated to the new version of the API package, CHLU, enabling new features:

- Improved algorithm, reducing the change of false positives when versions are mentioned within the text.

## [1.2.0] - 2017-06-23
### Added
Updated to the new version of the API package, CHLU, enabling new features:

- Automatic title linking
- Unused footer link removal

## [1.1.0] - 2017-05-19
### Added
- Set up the `update-notifier`

## 1.0.0 - 2017-05-17
### New
- First public release

[1.1.0]: https://github.com/codsen/chlu-cli/compare/v1.0.0...v1.1.0
[1.2.0]: https://github.com/codsen/chlu-cli/compare/v1.1.0...v1.2.0
[1.3.0]: https://github.com/codsen/chlu-cli/compare/v1.2.0...v1.3.0
[1.4.0]: https://github.com/codsen/chlu-cli/compare/v1.3.0...v1.4.0
[1.5.0]: https://github.com/codsen/chlu-cli/compare/v1.4.0...v1.5.0
[1.6.0]: https://github.com/codsen/chlu-cli/compare/v1.5.0...v1.6.0
[1.7.0]: https://github.com/codsen/chlu-cli/compare/v1.6.0...v1.7.0
[1.8.0]: https://github.com/codsen/chlu-cli/compare/v1.7.0...v1.8.0
