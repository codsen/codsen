# AVA

Regular AVA doesn't suit our needs so we have to tweak it a little bit:

* 🔧 removed `import-local` from CLI first landing script to [make it work for Lerna](https://github.com/sindresorhus/import-local/issues/6)
* 💥 new feature — if string `avaonly` is present in any of test files, that test file will be isolated — it saves time when running large projects with many test files
* 💥 new feature — if you put `.only` on any of assertions, the first unit test file with assertion containing `.only` will be picked by AVA and only that assertion will be ran. This is at expense of performance. Around v.2 AVA messed this up and while it's more-or-less acceptable in traditional development ways where developer doesn't rely on console.log's, it's totally not acceptable in (my preferred) console.log-oriented dev style, where we nurture the console.log output and ship the source with logs. Mind you, distribution files, files that users consume, are cleaned out of any logs. It's just the source which generates dist files that has logs.
* 🔧 removed everything Typescript-related
* 🔧 short-circuited its unit tests not to be ran, to save rounds when publishing real monorepo packages
* 🔧 removed `react` from devDependencies — geez
* 🔧 removed `updateNotifier` — it's not relevant any more

### ORIGINAL LICENCE:
MIT License — Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

AVA's original MIT licence file left intact in the folder's root
