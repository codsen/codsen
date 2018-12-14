# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [0.5.0] - 2018-12-14

- ✨ Added licence banner at the top of each built file (all files in `dist/` folder)
- ✨ Improved readme file

## [0.4.0] - 2018-12-13

- ✨ Delete whitespace within `<script>` tag, before closing `</script>`.
- ✨ Added unit tests minifying a handful of real-world websites. If URL fetch succeeds and source HTML is a string and not an empty-one, we minify with couple settings and measure, are results less than or equal to the original sources.

## [0.3.0] - 2018-12-12

- ✨ Improvements to whitespace control in front of `<script>` tag when some options are on.

## [0.2.0] - 2018-12-11

- ✨ Program will not touch:
  * CDATA blocks
  * `<pre><code>...</code></pre>` blocks
  * `<script>` tag contents

## 0.1.0 - 2018-12-10

- ✨ First public release

[0.5.0]: https://bitbucket.org/codsen/html-crush/branches/compare/v0.5.0%0Dv0.4.0#diff
[0.4.0]: https://bitbucket.org/codsen/html-crush/branches/compare/v0.4.0%0Dv0.3.0#diff
[0.3.0]: https://bitbucket.org/codsen/html-crush/branches/compare/v0.3.0%0Dv0.2.1#diff
[0.2.0]: https://bitbucket.org/codsen/html-crush/branches/compare/v0.2.0%0Dv0.1.3#diff
