# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.2.0] - 2018-09-20

- ✨ Properly set the message when there were zero files to update
- ✨ Promisified the atomic write function

## [1.1.0] - 2018-09-18

- ✨ Now file writing is done [atomically](https://github.com/npm/write-file-atomic), the write operation now cannot be interrupted or "partially" performed. Practically, this means, it will be not possible to accidentally damage the processed `.js` file there's a clash between other programs (code editors, for example) reading it. I has happened to me in the past that `.js` file accidentally gets written to be blank. No more!
- ✨ Additionally, now we have a check implemented, is the freshly-read `.js` file not blank. If it's blank, nothing is written.

## 1.0.0 - 2018-07-12

- ✨ First public release

[1.2.0]: https://bitbucket.org/codsen/js-row-num-cli/branches/compare/v1.2.0%0Dv1.1.1#diff
[1.1.0]: https://bitbucket.org/codsen/js-row-num-cli/branches/compare/v1.1.0%0Dv1.0.2#diff
