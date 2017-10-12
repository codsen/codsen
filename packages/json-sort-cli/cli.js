#!/usr/bin/env node

// VARS
// -----------------------------------------------------------------------------

const chalk = require('chalk')
const globby = require('globby')
const meow = require('meow')
const path = require('path')
const updateNotifier = require('update-notifier')
const uniq = require('lodash.uniq')
const isDirectory = require('is-d')
const pReduce = require('p-reduce')
const Listr = require('listr')
const loadJsonFile = require('load-json-file')
const writeJsonFile = require('write-json-file')

const { log } = console
const cli = meow(`
  Usage
    $ jsonsort YOURFILE.json
    $ sortjson YOURFILE.json
    $ sortjson templatesfolder1 templatesfolder2 package.json
  or, just type "csvsort" and it will let you pick a file.

  Options
    -n, --nodemodules   Don't ignore any node_modules folders and package-lock.json's
    -t, --tabs          Use tabs for JSON file indentation
    -d, --dry           Dry run - only list the found JSON files, don't sort or write
    -h, --help          Shows this help
    -v, --version       Shows the version of your json-sort-cli

  Example
    Call anywhere using glob patterns. If you put them as string, this library
    will parse globs. If you put as system globs without quotes, your shell will expand them.
`, {
    alias: {
      n: 'nodemodules',
      t: 'tabs',
    },
  })
updateNotifier({ pkg: cli.pkg }).notify()

// FUNCTIONS
// -----------------------------------------------------------------------------

function readSortAndWriteOverFile(oneOfPaths) {
  return loadJsonFile(oneOfPaths)
    .then(
      jsonContent => writeJsonFile(oneOfPaths, jsonContent, { indent: cli.flags.t ? '\t' : 2, detectIndent: true, sortKeys: true }),
      rejectionReason => Promise.reject(Error(rejectionReason)),
    )
}

// Step #0. take care of -v and -h flags that are left out in meow.
// -----------------------------------------------------------------------------

if (cli.flags.v) {
  log(cli.pkg.version)
  process.exit(0)
} else if (cli.flags.h) {
  log(cli.help)
  process.exit(0)
}

// Step #1. set up the cli
// -----------------------------------------------------------------------------

let { input } = cli
// if the folder/file name follows the flag (for example "-d "templates1"),
// that name will be put under the flag's key value, not into cli.input.
// That's handy for certain types of CLI apps, but not this one, as in our case
// the flags position does not matter, they don't affect the keywords that follow.
if (cli.flags) {
  Object.keys(cli.flags).forEach((flag) => {
    if (typeof cli.flags[flag] === 'string') {
      input = input.concat(cli.flags[flag])
    }
  })
}

// Step #2. query the glob and follow the pipeline
// -----------------------------------------------------------------------------

globby(input)
  .then((resolvedPathsArray) => {
    // flip out of the pipeline if there are no paths resolved
    if (resolvedPathsArray.length === 0) {
      log(`${chalk.grey('✨  json-sort-cli: ')}${chalk.red('The inputs don\'t lead to any json files! Exiting.')}`)
      process.exit(0)
    }
    return resolvedPathsArray
  })
  // glob each directory, reduce'ing all results (in promise shape) until all are resolved
  .then(resolvedPathsArray => pReduce(
    resolvedPathsArray,
    (concattedTotal, singleDirOrFilePath) => concattedTotal
      .concat(isDirectory(singleDirOrFilePath).then(bool => (
        bool ?
          globby(path.join(singleDirOrFilePath, '**/*.json'), '!node_modules') :
          [singleDirOrFilePath]
      ))),
    [],
    // then reduce again, now actually concatenating them all together
  ).then(received => pReduce(
    received,
    (total, single) => total.concat(single),
    [],
  ))).then(res =>
    (!cli.flags.n ? res.filter(oneOfPaths => (!oneOfPaths.includes('node_modules')) && !oneOfPaths.includes('package-lock.json')) : res))
  .then((received) => {
    if (cli.flags.d) {
      log(`${chalk.grey('✨  json-sort-cli: ')}${chalk.yellow('We\'d sort the following files:')}\n${received.join('\n')}`)
    } else {
      // console.log(`outcome #2: received = ${JSON.stringify(received, null, 4)}`)
      const tasks = new Listr(uniq(received).map(onePath => ({
        title: onePath,
        task: () => readSortAndWriteOverFile(onePath),
      })), { exitOnError: false })
      tasks.run().catch((err) => {
        log(`${chalk.grey('✨  json-sort-cli: ')}${chalk.red('Oops!')} ${err}`)
      })
    }
  })
  .catch((err) => {
    log(`${chalk.grey('✨  json-sort-cli: ')}${chalk.red('Oops!')} ${err}`)
  })
