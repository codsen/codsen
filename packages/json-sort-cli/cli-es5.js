#!/usr/bin/env node
'use strict';

// VARS
// -----------------------------------------------------------------------------

var chalk = require('chalk');
var globby = require('globby');
var meow = require('meow');
var path = require('path');
var updateNotifier = require('update-notifier');
var uniq = require('lodash.uniq');
var isDirectory = require('is-d');
var pReduce = require('p-reduce');
var Listr = require('listr');
var loadJsonFile = require('load-json-file');
var writeJsonFile = require('write-json-file');

var _console = console,
    log = _console.log;

var cli = meow('\n  Usage\n    $ jsonsort YOURFILE.json\n    $ sortjson YOURFILE.json\n    $ sortjson templatesfolder1 templatesfolder2 package.json\n  or, just type "csvsort" and it will let you pick a file.\n\n  Options\n    -n, --nodemodules   Don\'t ignore any node_modules folders and package-lock.json\'s\n    -t, --tabs          Use tabs for JSON file indentation\n    -d, --dry           Dry run - only list the found JSON files, don\'t sort or write\n    -h, --help          Shows this help\n    -v, --version       Shows the version of your json-sort-cli\n    -s, --silent        Lists only one row when job has been done (or failed)\n\n  Example\n    Call anywhere using glob patterns. If you put them as string, this library\n    will parse globs. If you put as system globs without quotes, your shell will expand them.\n', {
  alias: {
    n: 'nodemodules',
    t: 'tabs',
    a: 'silent'
  }
});
updateNotifier({ pkg: cli.pkg }).notify();

// FUNCTIONS
// -----------------------------------------------------------------------------

function readSortAndWriteOverFile(oneOfPaths) {
  return loadJsonFile(oneOfPaths).then(function (jsonContent) {
    return writeJsonFile(oneOfPaths, jsonContent, { indent: cli.flags.t ? '\t' : 2, detectIndent: true, sortKeys: true });
  }, function (rejectionReason) {
    return Promise.reject(Error(rejectionReason));
  });
}

// Step #0. take care of -v and -h flags that are left out in meow.
// -----------------------------------------------------------------------------

if (cli.flags.v) {
  log(cli.pkg.version);
  process.exit(0);
} else if (cli.flags.h) {
  log(cli.help);
  process.exit(0);
}

// Step #1. set up the cli
// -----------------------------------------------------------------------------

var input = cli.input;
// if the folder/file name follows the flag (for example "-d "templates1"),
// that name will be put under the flag's key value, not into cli.input.
// That's handy for certain types of CLI apps, but not this one, as in our case
// the flags position does not matter, they don't affect the keywords that follow.

if (cli.flags) {
  Object.keys(cli.flags).forEach(function (flag) {
    if (typeof cli.flags[flag] === 'string') {
      input = input.concat(cli.flags[flag]);
    }
  });
}

// Step #2. query the glob and follow the pipeline
// -----------------------------------------------------------------------------

globby(input).then(function (resolvedPathsArray) {
  // flip out of the pipeline if there are no paths resolved
  if (resolvedPathsArray.length === 0) {
    log('' + chalk.grey('✨  json-sort-cli: ') + chalk.red('The inputs don\'t lead to any json files! Exiting.'));
    process.exit(0);
  }
  return resolvedPathsArray;
})
// glob each directory, reduce'ing all results (in promise shape) until all are resolved
.then(function (resolvedPathsArray) {
  return pReduce(resolvedPathsArray, function (concattedTotal, singleDirOrFilePath) {
    return concattedTotal.concat(isDirectory(singleDirOrFilePath).then(function (bool) {
      return bool ? globby(path.join(singleDirOrFilePath, '**/*.json'), '!node_modules') : [singleDirOrFilePath];
    }));
  }, []
  // then reduce again, now actually concatenating them all together
  ).then(function (received) {
    return pReduce(received, function (total, single) {
      return total.concat(single);
    }, []);
  });
}).then(function (res) {
  return !cli.flags.n ? res.filter(function (oneOfPaths) {
    return !oneOfPaths.includes('node_modules') && !oneOfPaths.includes('package-lock.json');
  }) : res;
}).then(function (paths) {
  return paths.filter(function (singlePath) {
    return path.extname(singlePath) === '.json';
  });
}).then(function (received) {
  if (cli.flags.d) {
    log('' + chalk.grey('✨ json-sort-cli: ') + chalk.yellow('We\'d sort the following files:') + '\n' + received.join('\n'));
  } else {
    // console.log(`outcome #2: received = ${JSON.stringify(received, null, 4)}`)
    if (cli.flags.s) {
      // silent mode:
      return pReduce(received, function (previousValue, currentValue) {
        return readSortAndWriteOverFile(currentValue).then(function () {
          return previousValue + 1;
        }).catch(function (err) {
          log('' + chalk.grey('✨  json-sort-cli: ') + chalk.red('Could not write out the sorted file:') + ' ' + err);
          return previousValue;
        });
      }, 0).then(function (count) {
        log('' + chalk.grey('✨ json-sort-cli: ') + chalk.green(count + ' files sorted'));
      });
    }
    // non-silent mode - Listr
    var tasks = new Listr(uniq(received).map(function (onePath) {
      return {
        title: onePath,
        task: function task() {
          return readSortAndWriteOverFile(onePath);
        }
      };
    }), { exitOnError: false });
    tasks.run().catch(function (err) {
      log('' + chalk.grey('✨  json-sort-cli: ') + chalk.red('Oops!') + ' ' + err);
    });
  }
  return Promise.resolve();
}).catch(function (err) {
  log('' + chalk.grey('✨  json-sort-cli: ') + chalk.red('Oops!') + ' ' + err);
});
