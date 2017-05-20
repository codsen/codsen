# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.8.0] - 2017-03-03
### Updated
- Updated deps, Codsen name change, installed `standard` as dev-dependency (was missing previously).

## [1.7.0] - 2017-03-03
### Updated
- Updated dependencies, consuming normal version ranges.

## [1.6.0] - 2017-02-17
### Added
- Table of Contents to README

### Tweaked
- Updated company's name
- Updated dep version ranges to consume latest in package.json
- Updated BitHound config accordingly too
- Added extension to LICENSE

## [1.5.0] - 2017-01-25
### Added
- Calling Lodash functions each separately, to cut the total file size
- Calling Lodash functions using `*` version flag, the latest, to save time later when Lodash is updated
- Adding more input folder's path pre-processing. Now it can have slashes or not have them. Also, if somebody uses Node notation, `./folder`, it will work as well
- Improved Readme
- Set up JS Standard check on Husky calling on all commits (and failing commit if any files don't pass JS Standard)

[1.5.0]: https://github.com/codsen/email-homey/compare/v1.4.0...v1.5.0
[1.6.0]: https://github.com/codsen/email-homey/compare/v1.5.0...v1.6.0
[1.7.0]: https://github.com/codsen/email-homey/compare/v1.6.0...v1.7.0
[1.8.0]: https://github.com/codsen/email-homey/compare/v1.7.0...v1.8.0
