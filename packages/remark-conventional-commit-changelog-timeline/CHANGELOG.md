# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 4.0.0 (2026-09-06)

### Bug Fixes

- **remark-conventional-commit-changelog-timeline:** replace semver-regex ([2d60ca5](https://github.com/codsen/codsen/commit/2d60ca5d829b2f12e507cfe003fe708792de142b))

### Features

- **remark-conventional-commit-changelog-timeline:** render changelogs directly ([2de0031](https://github.com/codsen/codsen/commit/2de003104a18fcfe9059bf5d4f8228c58a34a1b2))

### BREAKING CHANGES

- **remark-conventional-commit-changelog-timeline:** The default export now accepts a Markdown string and returns HTML instead of a Unified plugin. Remove dateDivLocale, dateDivMarkup, defaults, Opts, and DateParamsObj. Dates use the fixed codsen.com format.

## 4.0.0 (2026-09-05)

### Features

- Render Codsen changelog Markdown directly as timeline HTML with no dependencies.

### BREAKING CHANGES

- Replace the Unified plugin with `changelogTimeline(markdown)`, returning an HTML string. Remove locale and markup callbacks, the `defaults` export, and option types. Dates now use the fixed codsen.com format. See [the migration guide](https://codsen.com/os/remark-conventional-commit-changelog-timeline#migrate-to-version4).

### Migration instructions to version 4

Version 4 renders Codsen changelog Markdown directly to an HTML string:

```js
import changelogTimeline from "remark-conventional-commit-changelog-timeline";

const html = changelogTimeline(markdown);
```

Replace the Unified pipeline previously used to render the changelog with this
call. Remove `.value` access: the result is already a string. Remove the
`dateDivLocale` and `dateDivMarkup` options and imports of `defaults`, `Opts`,
and `DateParamsObj`.

Dates now match codsen.com: `2022-08-12` becomes
`12 Aug <span>2022</span>` inside `.release-date`. September is `Sept`. Dates
are independent of the machine's locale and time zone. Existing timeline CSS
classes and section emojis remain available.

The supported format is the one used by Codsen's historical changelogs:

- Plain or linked stable release headings with a date, under `#`, `##`, or
  `###`.
- Change sections, paragraphs, unordered and ordered lists, nested lists,
  fenced code, blockquotes, and horizontal rules.
- Inline code, `**strong**`, `*emphasis*` or `_emphasis_`, inline links, and
  HTTP or HTTPS autolinks.
- Numeric character references and the named references `amp`, `lt`, `gt`,
  `quot`, `apos`, `nbsp`, and `hellip` used by this format.

This is a focused changelog renderer. Tables, images, reference links, raw HTML,
and the full CommonMark grammar are outside its contract. Raw HTML is escaped.
Use a general Markdown renderer for other document formats. Empty input returns
an empty string. Nonempty output has a leading and trailing newline.

Typography is a separate editorial step. The website's data generator still
applies `remark-typography` before calling the renderer. The package itself
does not alter quotes, dashes, or word spacing.

The function is synchronous and returns only the HTML. The small release-note
documents it targets do not need callback-driven formatting or progress APIs.

## 3.3.3 (2026-09-01)

### Bug Fixes

- **remark-typography:** preserve phrasing context ([371dd5e](https://github.com/codsen/codsen/commit/371dd5e98481277017d90182e33125a96f179abd))

## 3.3.0 (2026-08-19)

### Bug Fixes

- resolve various review findings ([b60e9ee](https://github.com/codsen/codsen/commit/b60e9eeb499af94685cfb87b4970fe025be1fc10))
- retire direct publish aliases ([f98e31e](https://github.com/codsen/codsen/commit/f98e31eb89bc185471225664e610b55f34fbf648))
- tweak deps ([bd41b1f](https://github.com/codsen/codsen/commit/bd41b1fd6a892ab3b939775abd800273cdc3f77a))
- type raw changelog markup explicitly ([b5ead07](https://github.com/codsen/codsen/commit/b5ead07e1dcfbd468afae3d8cb2e3802205c18e4))

### Features

- refresh the tooling and generate with the latest dependencies ([781f802](https://github.com/codsen/codsen/commit/781f802911066a82a4533b0e5a3fcbd742d0dd83))

## 3.1.0 (2023-05-21)

### Features

- move the source back to monorepo, update deps ([6f470d9](https://github.com/codsen/codsen/commit/6f470d9d863736fbed9b1fc653421b8ad7c267a1))

## 3.0.7 (2023-03-12)

### Bug Fixes

- move out of parked ([f9a1e1b](https://github.com/codsen/codsen/commit/f9a1e1b27e97cb665f8b841b3a773265c1ccbac6))

## 3.0.0 (2022-12-01)

### Features

- remove pure-ESM setup ([1cf14c4](https://github.com/codsen/codsen/commit/1cf14c4707f1f5141c2d04051e7263c9bff8f57c))

### BREAKING CHANGES

- you can `require` this package now; also minimum Node requirements are v14.18 or
  above

## 2.0.0 (2022-10-26)

### Features

- allow date customisation ([4d90331](https://github.com/codsen/codsen/commit/4d903316809d6632753a8a33f7d9a007a94b89e4))

### BREAKING CHANGES

- implement a callback interface to fully customise the date `div` contents

## 1.2.0 (2022-10-23)

### Features

- wrap emoji with a `span` ([9d9e25f](https://github.com/codsen/codsen/commit/9d9e25f86fb333a60d5f2fff7f0f293bb5620c63))

## 1.1.0 (2022-10-23)

### Features

- add more emoji and stop using word bugs in patch bumps ([90a1d0e](https://github.com/codsen/codsen/commit/90a1d0ef1132f0976502ea55d42a9a06ca986d24))

## 1.0.1 (2022-10-22)

### Fixed

- init ([61d8011](https://github.com/codsen/codsen/commit/61d8011adcbd4c49642ba7e7a3e3c50feb460ef9))
