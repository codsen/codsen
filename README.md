# Codsen

> A lerna monorepo for our 121 npm packages 📦📦📦

## 📚 Documentation

Please [visit codsen.com](https://codsen.com/os/) for an overview and full documentation of all packages.

## 👓 Spec

- Monorepo is managed by [Lerna](https://github.com/lerna/lerna) and [Lect](https://codsen.com/os/lect/) our CLI helper.
- All programs (non-CLI's) here are in Typescript, built with Rollup.
- All CLI's are in CommonJS and shipped like that.
- The _peculiars_, Gulp task, ESLint rules and so on, vary.
- Unit tests are run by [Tap](https://node-tap.org/), coverage is built-in, perf benchmarks with all the past check measurements are in `/packages/*/perf/`.

## 🐛 Issue Tracker

For bugs, feature requests and so on, use the [Issue Tracker](https://github.com/codsen/codsen/issues/new/choose).

## 💼 Licence

MIT License

Copyright (c) 2010-2021 Roy Revelt and other contributors
