# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.2.0](https://gitlab.com/codsen/codsen/compare/html-crush@1.1.1...html-crush@1.2.0) (2019-06-01)


### Features

* Delete leading whitespace inside inline CSS ([614d11b](https://gitlab.com/codsen/codsen/commit/614d11b))





## 1.1.0 (2019-06-01)

### Features

- Inline CSS minification ([0518f05](https://gitlab.com/codsen/codsen/commit/0518f05))
- Only replace linebreaks when result will be smaller in size, not the same ([a431686](https://gitlab.com/codsen/codsen/commit/a431686))

## 1.0.11 (2019-04-06)

### Bug Fixes

- Algorithm improvement not to break in front of `</a>` to prevent accidentally adding new spaces ([8939654](https://gitlab.com/codsen/codsen/commit/8939654))

## 0.8.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 0.7.0 (2019-01-11)

- ✨ Add one more tag before which there will be a line break ([4f00871](https://gitlab.com/codsen/codsen/tree/master/packages/html-crush/commits/4f00871))

## 0.6.0 (2018-12-26)

- ✨ Add licence block at the top of built files in dist/ folder ([cb2c259](https://gitlab.com/codsen/codsen/tree/master/packages/html-crush/commits/cb2c259))
- ✨ Add more logging for doNothing state ([25262e5](https://gitlab.com/codsen/codsen/tree/master/packages/html-crush/commits/25262e5))
- ✨ Do not touch CDATA blocks ([920e9d9](https://gitlab.com/codsen/codsen/tree/master/packages/html-crush/commits/920e9d9))
- ✨ Don't minify script tags contents ([557e8fa](https://gitlab.com/codsen/codsen/tree/master/packages/html-crush/commits/557e8fa))
- ✨ Don't touch code within pre-code blocks ([d32c092](https://gitlab.com/codsen/codsen/tree/master/packages/html-crush/commits/d32c092))
- ✨ Fetch a handful of real websites and minify them for tests ([f7e8153](https://gitlab.com/codsen/codsen/tree/master/packages/html-crush/commits/f7e8153))
- ✨ Remove whitespace within `<script>` blocks, in front of `</script>` ([d1efb20](https://gitlab.com/codsen/codsen/tree/master/packages/html-crush/commits/d1efb20))
- ✨ Treat the whitespace in front of `<script>` ([75d85dc](https://gitlab.com/codsen/codsen/tree/master/packages/html-crush/commits/75d85dc))

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
  - CDATA blocks
  - `<pre><code>...</code></pre>` blocks
  - `<script>` tag contents

## 0.1.0 (2018-12-10)

- ✨ First public release
