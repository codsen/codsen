# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.4.0] - 2018-08-17

- ✨ Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis
- ✨ Added unit tests. Finally! The API already had unit tests but CLI wrapper didn't. Now it has.

## [1.3.0] - 2018-05-26

- ✨ Removing transpiling. It's not relevant to modern machines running modern Node.
- ✨ Setup improvements - Prettier, removing `.package-lock` and other small bits

## [1.2.0] - 2017-12-09

- ✨ Set up transpiling. Not everybody will be using Node `6.8.0` and above so ES6 source code might be an issue. Now, transpiled version is served.

## [1.1.0] - 2017-12-06

- ✨ Removed JS Standard and set up raw ESLint on `airbnb-base` config with semicolons turned off
- ✨ Rehaul of many other setup files

## 1.0.0 - 2017-08-27

- First public release

[1.1.0]: https://bitbucket.org/codsen/email-all-chars-within-ascii-cli/branches/compare/v1.1.0%0Dv1.0.3#diff
[1.2.0]: https://bitbucket.org/codsen/email-all-chars-within-ascii-cli/branches/compare/v1.2.0%0Dv1.1.0#diff
[1.3.0]: https://bitbucket.org/codsen/email-all-chars-within-ascii-cli/branches/compare/v1.3.0%0Dv1.2.5#diff
[1.4.0]: https://bitbucket.org/codsen/email-all-chars-within-ascii-cli/branches/compare/v1.4.0%0Dv1.3.0#diff
