# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [3.4.0] - 2017-08-28
### Added
- Relaxed the requirements and made single character selector names to pass.

## [3.3.0] - 2017-01-01
### Added

- Recognises `\n`, `\t` and other escaped JS characters
- Doesn't extract empty classes and id's (`.` and `#`)
- Doesn't extract any classes or id's that are one character long

## [3.2.0] - 2016-12-27
### Updated

- Readme updates

## [3.1.0] - 2016-12-23
### Added

- Standard JS precommit hooks to enforce code style

## 3.0.0 - 2016-11-19
### Changed

Algorithm change.

## v.2.0.0 - 2016-11-09
### Change 1.

Breaking changes — instead of giving the first class or id as string, now we're outputting the array of them:

Previously:
```js
extract('div.class-one.class-two a[target=_blank]', '#')
// => '.class-one'
extract('div#id.class a[target=_blank]', '#')
// => '#id'
```

Now:

```js
extract('div#id.class a[target=_blank]', '#')
// => ['#id', '.class']
```

Once the space is encountered, there won't be any more additions to the array.

### Change 2.

There is no second argument any more, to choose between id's or classes. Since array can contain a mix of classes and id's, it's unpractical to impose any other restrictions upon user any more.

This library will detect the first clump of class(es)/array(s), will put each into an array, discarding everything else around.

[3.0.0]: https://github.com/codsen/string-extract-class-names/compare/v2.2.0...v3.0.0
[3.1.0]: https://github.com/codsen/string-extract-class-names/compare/v3.0.0...v3.1.0
[3.2.0]: https://github.com/codsen/string-extract-class-names/compare/v3.1.0...v3.2.0
[3.3.0]: https://github.com/codsen/string-extract-class-names/compare/v3.2.0...v3.3.0
[3.4.0]: https://github.com/codsen/string-extract-class-names/compare/v3.3.0...v3.4.0
