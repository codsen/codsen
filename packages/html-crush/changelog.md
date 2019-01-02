# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.6.8](https://bitbucket.org/codsen/codsen/src/master/packages/html-crush/compare/html-crush@0.6.7...html-crush@0.6.8) (2019-01-02)

**Note:** Version bump only for package html-crush





## [0.6.7](https://bitbucket.org/codsen/codsen/src/master/packages/html-crush/compare/html-crush@0.6.6...html-crush@0.6.7) (2019-01-01)

**Note:** Version bump only for package html-crush





## [0.6.6](https://bitbucket.org/codsen/codsen/src/master/packages/html-crush/compare/html-crush@0.6.5...html-crush@0.6.6) (2018-12-29)

**Note:** Version bump only for package html-crush





## [0.6.5](https://bitbucket.org/codsen/codsen/src/master/packages/html-crush/compare/html-crush@0.6.4...html-crush@0.6.5) (2018-12-29)

**Note:** Version bump only for package html-crush





## [0.6.4](https://bitbucket.org/codsen/codsen/src/master/packages/html-crush/compare/html-crush@0.6.3...html-crush@0.6.4) (2018-12-29)

**Note:** Version bump only for package html-crush





## [0.6.3](https://bitbucket.org/codsen/codsen/src/master/packages/html-crush/compare/html-crush@0.6.2...html-crush@0.6.3) (2018-12-29)

**Note:** Version bump only for package html-crush





## [0.6.2](https://bitbucket.org/codsen/codsen/src/master/packages/html-crush/compare/html-crush@0.6.1...html-crush@0.6.2) (2018-12-27)

**Note:** Version bump only for package html-crush





## [0.6.1](https://bitbucket.org/codsen/codsen/src/master/packages/html-crush/compare/html-crush@0.6.0...html-crush@0.6.1) (2018-12-27)

**Note:** Version bump only for package html-crush





# 0.6.0 (2018-12-26)


### Features

* add licence block at the top of built files in dist/ folder ([cb2c259](https://bitbucket.org/codsen/codsen/src/master/packages/html-crush/commits/cb2c259))
* add more logging for doNothing state ([25262e5](https://bitbucket.org/codsen/codsen/src/master/packages/html-crush/commits/25262e5))
* do not touch CDATA blocks ([920e9d9](https://bitbucket.org/codsen/codsen/src/master/packages/html-crush/commits/920e9d9))
* don't minify script tags contents ([557e8fa](https://bitbucket.org/codsen/codsen/src/master/packages/html-crush/commits/557e8fa))
* don't touch code within pre-code blocks ([d32c092](https://bitbucket.org/codsen/codsen/src/master/packages/html-crush/commits/d32c092))
* fetch handful of real websites and minify them for tests ([f7e8153](https://bitbucket.org/codsen/codsen/src/master/packages/html-crush/commits/f7e8153))
* remove whitespace within <script> blocks, in front of </script> ([d1efb20](https://bitbucket.org/codsen/codsen/src/master/packages/html-crush/commits/d1efb20))
* treat the whitespace in front of <script> ([75d85dc](https://bitbucket.org/codsen/codsen/src/master/packages/html-crush/commits/75d85dc))





## 0.5.0 (2018-12-14)

- ✨ Added licence banner at the top of each built file (all files in `dist/` folder)
- ✨ Improved readme file

## 0.4.0 (2018-12-13)

- ✨ Delete whitespace within `<script>` tag, before closing `</script>`.
- ✨ Added unit tests minifying a handful of real-world websites. If URL fetch succeeds and source HTML is a string and not an empty-one, we minify with couple settings and measure, are results less than or equal to the original sources.

## 0.3.0 (2018-12-12)

- ✨ Improvements to whitespace control in front of `<script>` tag when some options are on.

## 0.2.0 (2018-12-11)

- ✨ Program will not touch:
  * CDATA blocks
  * `<pre><code>...</code></pre>` blocks
  * `<script>` tag contents

## 0.1.0 (2018-12-10)

- ✨ First public release
