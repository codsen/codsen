import fs from "fs-extra";
import tap from "tap";
import path from "path";
import execa from "execa";
import tempy from "tempy";

//                                  *
//                                  *
//                                  *
//                                  *
//                                  *
//
//                                  1
//
//                                  *
//                                  *
//                                  *
//                                  *
//                                  *

tap.test("01 - there are no usable files at all", async (t) => {
  const tempFolder = tempy.directory();
  fs.ensureDirSync(path.resolve(tempFolder));
  const processedFileContents = fs
    .writeFile(path.join(tempFolder, "file.md"), "zzz")
    .then(() =>
      execa(`cd ${tempFolder} && ${path.join(__dirname, "../", "cli.js")}`, {
        shell: true,
      })
    )
    .then(() => fs.readFile(path.join(tempFolder, "file.md"), "utf8"))
    .catch((err) => t.fail(err));
  // confirm that the existing file is intact:
  t.strictSame(await processedFileContents, "zzz", "01");
  t.end();
});

//                                  *
//                                  *
//                                  *
//                                  *
//                                  *
//
//                                  2
//
//                                  *
//                                  *
//                                  *
//                                  *
//                                  *

tap.test(
  "02 - only changelog present in the root - default (not --loud)",
  async (t) => {
    const originalChangelog = `# Seed Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.4.0] - 2017-05-09
### Added
- blablabla

## [1.3.0] - 2017-04-20
### Added
- blablabla
- blablabla
### Improved
- blablabla
### Updated
- Readme
### Unchanged
- Code coverage is still 100%

## [1.2.0] - 2017-04-20
### Added
- blablabla
- blablabla
### Improved
- blablabla
### Updated
- Readme
### Unchanged
- Code coverage is still 100%

## [1.1.0] - 2017-04-20
### Added
- blablabla
- blablabla
### Improved
- blablabla
### Updated
- Readme
### Unchanged
- Code coverage is still 100%

## 1.0.0 - 2017-04-03
### New
- First public release

[1.4.0]: https://github.com/codsen/WRONG/compare/v1.3.0...v1.4.0
[1.2.0]: https://github.com/codsen/WRONG/compare/v1.1.1...v1.2.0
`;

    const intendedChangelog = `# Seed Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.4.0] - 2017-05-09
### Added
- blablabla

## [1.3.0] - 2017-04-20
### Added
- blablabla
- blablabla
### Improved
- blablabla
### Updated
- Readme
### Unchanged
- Code coverage is still 100%

## [1.2.0] - 2017-04-20
### Added
- blablabla
- blablabla
### Improved
- blablabla
### Updated
- Readme
### Unchanged
- Code coverage is still 100%

## [1.1.0] - 2017-04-20
### Added
- blablabla
- blablabla
### Improved
- blablabla
### Updated
- Readme
### Unchanged
- Code coverage is still 100%

## 1.0.0 - 2017-04-03
### New
- First public release

[1.4.0]: https://github.com/codsen/WRONG/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/codsen/WRONG/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/codsen/WRONG/compare/v1.1.1...v1.2.0
[1.1.0]: https://github.com/codsen/WRONG/compare/v1.0.0...v1.1.0
`;

    // 1. fetch us an empty, random, temporary folder:

    // Re-route the test files into `temp/` folder instead for easier access when
    // troubleshooting. Just comment out one of two:
    const tempFolder = tempy.directory();
    // const tempFolder = "temp";
    fs.ensureDirSync(path.resolve(tempFolder));

    // 2. asynchronously write all test files
    const processedFileContents = fs
      .writeFile(path.join(tempFolder, "changelog.md"), originalChangelog)
      .then(() =>
        execa(`cd ${tempFolder} && ${path.join(__dirname, "../", "cli.js")}`, {
          shell: true,
        })
      )
      .then(() => fs.readFile(path.join(tempFolder, "changelog.md"), "utf8"))
      .catch((err) => t.fail(err));

    t.strictSame(await processedFileContents, intendedChangelog, "02");
    t.end();
  }
);

//                                  *
//                                  *
//                                  *
//                                  *
//                                  *
//
//                                  3
//
//                                  *
//                                  *
//                                  *
//                                  *
//                                  *

tap.test(
  "03 - package + changelog in the root - default (not --loud)",
  async (t) => {
    const originalChangelog = `# Seed Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.4.0] - 2017-05-09
### Added
- blablabla

## [1.3.0] - 2017-04-20
### Added
- blablabla
- blablabla
### Improved
- blablabla
### Updated
- Readme
### Unchanged
- Code coverage is still 100%

## [1.2.0] - 2017-04-20
### Added
- blablabla
- blablabla
### Improved
- blablabla
### Updated
- Readme
### Unchanged
- Code coverage is still 100%

## [1.1.0] - 2017-04-20
### Added
- blablabla
- blablabla
### Improved
- blablabla
### Updated
- Readme
### Unchanged
- Code coverage is still 100%

## 1.0.0 - 2017-04-03
### New
- First public release

[1.4.0]: https://github.com/codsen/WRONG/compare/v1.3.0...v1.4.0
[1.2.0]: https://github.com/codsen/WRONG/compare/v1.1.1...v1.2.0
`;

    const intendedChangelog = `# Seed Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.4.0] - 2017-05-09
### Added
- blablabla

## [1.3.0] - 2017-04-20
### Added
- blablabla
- blablabla
### Improved
- blablabla
### Updated
- Readme
### Unchanged
- Code coverage is still 100%

## [1.2.0] - 2017-04-20
### Added
- blablabla
- blablabla
### Improved
- blablabla
### Updated
- Readme
### Unchanged
- Code coverage is still 100%

## [1.1.0] - 2017-04-20
### Added
- blablabla
- blablabla
### Improved
- blablabla
### Updated
- Readme
### Unchanged
- Code coverage is still 100%

## 1.0.0 - 2017-04-03
### New
- First public release

[1.4.0]: https://github.com/codsen/correct-lib/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/codsen/correct-lib/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/codsen/correct-lib/compare/v1.1.1...v1.2.0
[1.1.0]: https://github.com/codsen/correct-lib/compare/v1.0.0...v1.1.0
`;

    const inputPackageJson = {
      name: "correct-lib",
      version: "1.3.0",
      description: "Does many fancy things",
      main: "index.js",
      scripts: {
        coverage: "nyc report --reporter=text-lcov | coveralls",
        precommit: "npm test",
        test: "standard && nyc --reporter=html --reporter=text ava",
      },
      repository: {
        type: "git",
        url: "https://github.com/codsen/correct-lib.git",
      },
      keywords: [],
      author: {
        name: "Roy Revelt",
        email: "roy@codsen.com",
        url: "codsen.com",
      },
      license: "MIT",
      bugs: {
        url: "https://github.com/codsen/correct-lib/issues",
      },
      homepage: "https://github.com/codsen/correct-lib#readme",
      dependencies: {},
      devDependencies: {},
    };

    // 1. fetch us an empty, random, temporary folder:

    // Re-route the test files into `temp/` folder instead for easier access when
    // troubleshooting. Just comment out one of two:
    const tempFolder = tempy.directory();
    // const tempFolder = "temp";
    fs.ensureDirSync(path.resolve(tempFolder));

    // 2. asynchronously write all test files
    const processedFileContents = fs
      .writeFile(path.join(tempFolder, "changelog.md"), originalChangelog)
      .then(() =>
        fs.writeJson(path.join(tempFolder, "package.json"), inputPackageJson, {
          spaces: 2,
        })
      )
      .then(() =>
        execa(`cd ${tempFolder} && ${path.join(__dirname, "../", "cli.js")}`, {
          shell: true,
        })
      )
      .then(() => fs.readFile(path.join(tempFolder, "changelog.md"), "utf8"))
      .catch((err) => t.fail(err));

    t.strictSame(await processedFileContents, intendedChangelog, "03");
    t.end();
  }
);

//                                  *
//                                  *
//                                  *
//                                  *
//                                  *
//
//                                  4
//
//                                  *
//                                  *
//                                  *
//                                  *
//                                  *

tap.test("04 - only changelog present in the root - loud", async (t) => {
  const originalChangelog = `# Seed Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.4.0] - 2017-05-09
### Added
- blablabla

## [1.3.0] - 2017-04-20
### Added
- blablabla
- blablabla
### Improved
- blablabla
### Updated
- Readme
### Unchanged
- Code coverage is still 100%

## [1.2.0] - 2017-04-20
### Added
- blablabla
- blablabla
### Improved
- blablabla
### Updated
- Readme
### Unchanged
- Code coverage is still 100%

## [1.1.0] - 2017-04-20
### Added
- blablabla
- blablabla
### Improved
- blablabla
### Updated
- Readme
### Unchanged
- Code coverage is still 100%

## 1.0.0 - 2017-04-03
### New
- First public release

[1.4.0]: https://github.com/codsen/WRONG/compare/v1.3.0...v1.4.0
[1.2.0]: https://github.com/codsen/WRONG/compare/v1.1.1...v1.2.0
`;

  const intendedChangelog = `# Seed Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.4.0] - 2017-05-09
### Added
- blablabla

## [1.3.0] - 2017-04-20
### Added
- blablabla
- blablabla
### Improved
- blablabla
### Updated
- Readme
### Unchanged
- Code coverage is still 100%

## [1.2.0] - 2017-04-20
### Added
- blablabla
- blablabla
### Improved
- blablabla
### Updated
- Readme
### Unchanged
- Code coverage is still 100%

## [1.1.0] - 2017-04-20
### Added
- blablabla
- blablabla
### Improved
- blablabla
### Updated
- Readme
### Unchanged
- Code coverage is still 100%

## 1.0.0 - 2017-04-03
### New
- First public release

[1.4.0]: https://github.com/codsen/WRONG/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/codsen/WRONG/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/codsen/WRONG/compare/v1.1.1...v1.2.0
[1.1.0]: https://github.com/codsen/WRONG/compare/v1.0.0...v1.1.0
`;

  // 1. fetch us an empty, random, temporary folder:

  // Re-route the test files into `temp/` folder instead for easier access when
  // troubleshooting. Just comment out one of two:
  const tempFolder = tempy.directory();
  // const tempFolder = "temp";
  fs.ensureDirSync(path.resolve(tempFolder));

  // 2. asynchronously write all test files
  const processedFileContents = fs
    .writeFile(path.join(tempFolder, "changelog.md"), originalChangelog)
    .then(() =>
      execa(
        `cd ${tempFolder} && ${path.join(__dirname, "../", "cli.js")} --loud`,
        { shell: true }
      )
    )
    .then(() => fs.readFile(path.join(tempFolder, "changelog.md"), "utf8"))
    .catch((err) => t.fail(err));

  t.strictSame(await processedFileContents, intendedChangelog, "04");
  t.end();
});

//                                  *
//                                  *
//                                  *
//                                  *
//                                  *
//
//                                  5
//
//                                  *
//                                  *
//                                  *
//                                  *
//                                  *

tap.test("05 - package + changelog in the root - loud", async (t) => {
  const originalChangelog = `# Seed Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.4.0] - 2017-05-09
### Added
- blablabla

## [1.3.0] - 2017-04-20
### Added
- blablabla
- blablabla
### Improved
- blablabla
### Updated
- Readme
### Unchanged
- Code coverage is still 100%

## [1.2.0] - 2017-04-20
### Added
- blablabla
- blablabla
### Improved
- blablabla
### Updated
- Readme
### Unchanged
- Code coverage is still 100%

## [1.1.0] - 2017-04-20
### Added
- blablabla
- blablabla
### Improved
- blablabla
### Updated
- Readme
### Unchanged
- Code coverage is still 100%

## 1.0.0 - 2017-04-03
### New
- First public release

[1.4.0]: https://github.com/codsen/WRONG/compare/v1.3.0...v1.4.0
[1.2.0]: https://github.com/codsen/WRONG/compare/v1.1.1...v1.2.0
`;

  const intendedChangelog = `# Seed Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.4.0] - 2017-05-09
### Added
- blablabla

## [1.3.0] - 2017-04-20
### Added
- blablabla
- blablabla
### Improved
- blablabla
### Updated
- Readme
### Unchanged
- Code coverage is still 100%

## [1.2.0] - 2017-04-20
### Added
- blablabla
- blablabla
### Improved
- blablabla
### Updated
- Readme
### Unchanged
- Code coverage is still 100%

## [1.1.0] - 2017-04-20
### Added
- blablabla
- blablabla
### Improved
- blablabla
### Updated
- Readme
### Unchanged
- Code coverage is still 100%

## 1.0.0 - 2017-04-03
### New
- First public release

[1.4.0]: https://github.com/codsen/correct-lib/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/codsen/correct-lib/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/codsen/correct-lib/compare/v1.1.1...v1.2.0
[1.1.0]: https://github.com/codsen/correct-lib/compare/v1.0.0...v1.1.0
`;

  const inputPackageJson = {
    name: "correct-lib",
    version: "1.3.0",
    description: "Does many fancy things",
    main: "index.js",
    scripts: {
      coverage: "nyc report --reporter=text-lcov | coveralls",
      precommit: "npm test",
      test: "standard && nyc --reporter=html --reporter=text ava",
    },
    repository: {
      type: "git",
      url: "https://github.com/codsen/correct-lib.git",
    },
    keywords: [],
    author: {
      name: "Roy Revelt",
      email: "roy@codsen.com",
      url: "codsen.com",
    },
    license: "MIT",
    bugs: {
      url: "https://github.com/codsen/correct-lib/issues",
    },
    homepage: "https://github.com/codsen/correct-lib#readme",
    dependencies: {},
    devDependencies: {},
  };

  // 1. fetch us an empty, random, temporary folder:

  // Re-route the test files into `temp/` folder instead for easier access when
  // troubleshooting. Just comment out one of two:
  const tempFolder = tempy.directory();
  // const tempFolder = "temp";
  fs.ensureDirSync(path.resolve(tempFolder));

  // 2. asynchronously write all test files
  const processedFileContents = fs
    .writeFile(path.join(tempFolder, "changelog.md"), originalChangelog)
    .then(() =>
      fs.writeJson(path.join(tempFolder, "package.json"), inputPackageJson, {
        spaces: 2,
      })
    )
    .then(() =>
      execa(`cd ${tempFolder} && ${path.join(__dirname, "../", "cli.js")} -l`, {
        shell: true,
      })
    )
    .then(() => fs.readFile(path.join(tempFolder, "changelog.md"), "utf8"))
    .catch((err) => t.fail(err));

  t.strictSame(await processedFileContents, intendedChangelog, "05");
  t.end();
});

//                                  *
//                                  *
//                                  *
//                                  *
//                                  *
//
//                                  ?
//
//                                  *
//                                  *
//                                  *
//                                  *
//                                  *
