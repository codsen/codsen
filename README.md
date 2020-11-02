# Codsen

> A lerna monorepo for our 116 npm libraries 📦📦📦

## 📚 Documentation

Please [visit codsen.com](https://codsen.com/os/) for an overview and full documentation of all packages.

## 🤝 Contributing
- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?title=put%20package%20name%20here%20-%20put%20issue%20title%20here>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?title=put%20package%20name%20here%20-%20put%20issue%20title%20here>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?title=put%20package%20name%20here%20-%20put%20issue%20title%20here>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#codsen)**

## 💼 Licence

MIT License

Copyright (c) 2010-2020 Roy Revelt and other contributors

**[⬆ back to top](#codsen)**
