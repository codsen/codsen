# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 1.1.0 (2019-03-09)

### Bug Fixes

- Prepare for ESP tag features ([9c74f3d](https://gitlab.com/codsen/codsen/commit/9c74f3d))

### Features

- Add all missing whitespace character rules ([00e8aed](https://gitlab.com/codsen/codsen/commit/00e8aed))
- Allow colons in tag names (allows Mailchimp templating tags) ([a5c42f9](https://gitlab.com/codsen/codsen/commit/a5c42f9))
- Ensure that all withinQuotes marking is correct, including in messed up code cases ([b359d35](https://gitlab.com/codsen/codsen/commit/b359d35))
- Extend rule tag-stray-character to both quotes and equal characters ([75fcfbf](https://gitlab.com/codsen/codsen/commit/75fcfbf))
- More improvements to script tag recognition, rudimentary processing inside JS code ([d5056e6](https://gitlab.com/codsen/codsen/commit/d5056e6))
- Recognise escaped quotes within JS code within script tags ([c984050](https://gitlab.com/codsen/codsen/commit/c984050))
- Recognise script tags ([de006d0](https://gitlab.com/codsen/codsen/commit/de006d0))
- Rule bad-character-grave-accent ([03cd767](https://gitlab.com/codsen/codsen/commit/03cd767))
- Rule bad-character-unencoded-non-breaking-space ([289396c](https://gitlab.com/codsen/codsen/commit/289396c))
- Rule bad-character-zero-width-space and some whitespace control tweaks ([c4b582c](https://gitlab.com/codsen/codsen/commit/c4b582c))
- Rules bad-cdata-whitespace and bad-cdata-tag-character-case ([b8982e9](https://gitlab.com/codsen/codsen/commit/b8982e9))
- Rules bad-character-line-separator, bad-character-unencoded-non-breaking-space and bad-character-zero-width-space ([555f6eb](https://gitlab.com/codsen/codsen/commit/555f6eb))
- Rules to flag up and delete all Unicode C1 group control characters ([c4b02c9](https://gitlab.com/codsen/codsen/commit/c4b02c9))
- Split off character-based rules because there are too many ([0411fa2](https://gitlab.com/codsen/codsen/commit/0411fa2))
