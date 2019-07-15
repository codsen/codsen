# AVA

Regular AVA doesn't suit our needs so we have to tweak it a little bit:

* 🔧 removed `import-local` from CLI first landing script to [make it work for Lerna](https://github.com/sindresorhus/import-local/issues/6)
* 💥 new feature — if string `avaonly` is present in any of test files, that test file will be isolated — it saves time when running large projects with many test files
* 💥 new feature — `.only` in any of the test files will isolate that file only. At the beginning AVA behaved that way until around v1, even if you added `.only` to an assertion on one file, it would still run other test files
* 🔧 removed everything Typescript-related
* 🔧 short-circuited its unit tests not to be ran, to save rounds when publishing real monorepo packages
* 🔧 removed `react` from devDependencies — geez
* 🔧 removed `updateNotifier` — it's not relevant any more

### ORIGINAL LICENCE:
MIT License — Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

AVA's original MIT licence file left intact in the folder's root
