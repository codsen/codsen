# Bastardised AVA

Regular AVA doesn't suit our needs so we have to tweak it a little bit:

- 🔧 removed `import-local` from CLI first landing script to [make it work for Lerna](https://github.com/sindresorhus/import-local/issues/6) because it didn't cope with monorepos \[now fixed by AVA's maintainers]
- 💥 new feature — if string `avaonly` is present in any of test files, that test file will be isolated — it saves time when running large projects with many test files
- 💥 new feature — if you put `.only` on any of assertions, the first unit test file with assertion containing `.only` will be picked by AVA and only that file's assertions with `.only` will be ran. For comparison, the Official AVA will run all test files each time, won't isolate the ones with `.only`.
- 🔧 removed everything Typescript-related
- 🔧 short-circuited its unit tests not to be ran during `npm run test`, to save rounds when publishing real monorepo packages
- 🔧 removed `react` from devDependencies — 😼💥⚡️
- 🔧 removed `updateNotifier` — it's not relevant any more

### ORIGINAL LICENCE:

MIT License — Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)
Tweaks also under MIT License — Copyright (c) 2015-2019 Roy Revelt and other contributors
