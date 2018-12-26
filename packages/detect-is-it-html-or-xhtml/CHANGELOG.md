## [3.3.0] (2018-10-17)

- ✨ Updated all dependencies
- ✨ Restored unit test coverage tracking: reporting in terminal and coveralls.io
- ✨ Restored unit test linting

## [3.2.0] (2018-06-11)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis
- ✨ Removed `package-lock`

## [3.1.0] (2018-05-03)

- ✨ Set up [Prettier](https://prettier.io)
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — Rollup will remove from production code.

# [3.0.0] (2017-12-09)

### Changed

- ✨ Rebased in ES node_modules
- ✨ Set up the Rollup (nice rhyming). Now we generate CommonJS, UMD and ES Module (native code) builds.
- ✨ Set up raw ESLint on `airbnb-base` preset with semicolons off. Also linting for AVA unit tests.

## 2.0.0 - 2017-03-02

### Changed

- ✨ In order to prevent accidental input argument mutation when object is given, now we're throwing a type error when the input argument is present, but of a wrong type. That's enough to warrant a major API change under semver.

[3.0.0]: https://bitbucket.org/codsen/detect-is-it-html-or-xhtml/branches/compare/v3.0.0%0Dv2.0.2#diff
[3.1.0]: https://bitbucket.org/codsen/detect-is-it-html-or-xhtml/branches/compare/v3.1.0%0Dv3.0.4#diff
[3.2.0]: https://bitbucket.org/codsen/detect-is-it-html-or-xhtml/branches/compare/v3.2.0%0Dv3.1.1#diff
[3.3.0]: https://bitbucket.org/codsen/detect-is-it-html-or-xhtml/branches/compare/v3.3.0%0Dv3.2.2#diff
