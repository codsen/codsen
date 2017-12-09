#!/usr/bin/env node
'use strict';

// VARS
// -----------------------------------------------------------------------------

var chalk = require('chalk');
var within = require('email-all-chars-within-ascii');
var fs = require('fs');
var globby = require('globby');
var inquirer = require('inquirer');

var _console = console,
    log = _console.log;

var meow = require('meow');
var path = require('path');
var updateNotifier = require('update-notifier');
var pullAll = require('lodash.pullall');
var uniq = require('lodash.uniq');

var isArr = Array.isArray;

var state = {};
state.toDoList = []; // default
var ui = new inquirer.ui.BottomBar();
var cli = meow('\n  Usage\n    $ withinascii YOURFILE.html\n  or, just type "withinascii" and it will let you pick a file.\n\n  Options\n    -h, --help        Shows this help\n    -v, --version     Shows the version of your email-all-chars-within-ascii-cli\n\n  Instructions\n    Just call it in the folder where your file is located or provide a path\n');
updateNotifier({ pkg: cli.pkg }).notify();

// FUNCTIONS
// -----------------------------------------------------------------------------

function isStr(something) {
  return typeof something === 'string';
}

function offerAListOfFilesToPickFrom() {
  var allFilesHere = globby.sync('./*.*');
  if (allFilesHere.length === 0) {
    return Promise.reject(new Error('\nemail-all-chars-within-ascii-cli: Alas, computer couldn\'t find any files in this folder and bailed on us!'));
  }
  ui.log.write(chalk.grey('To quit, press CTRL+C'));
  var questions = [{
    type: 'list',
    name: 'file',
    message: 'Which file would you like to check?',
    choices: allFilesHere
  }];
  ui.log.write(chalk.yellow('Please pick a file:'));
  return inquirer.prompt(questions).then(function (answer) {
    return {
      toDoList: [path.basename(answer.file)]
    };
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

// Step #1. gather the to-do list of files.
// -----------------------------------------------------------------------------

if (cli.input.length > 0) {
  state.toDoList = cli.input;
}

// we anticipate the can be multiple, potentially-false flags mixed with valid file names
if (Object.keys(cli.flags).length !== 0) {
  // each non-boolean cli.flags value must be added to the `toDoList`
  Object.keys(cli.flags).forEach(function (key) {
    if (typeof cli.flags[key] !== 'boolean') {
      if (!isArr(cli.flags[key])) {
        state.toDoList.push(cli.flags[key]);
      } else {
        state.toDoList = state.toDoList.concat(cli.flags[key].filter(function (val) {
          return isStr(val);
        }));
      }
    }
  });
  state.toDoList = uniq(state.toDoList);
}

// Step #2. create a promise variable and assign it to one of the promises,
// depending on was the acceptable file passed via args or queries afterwards.
// -----------------------------------------------------------------------------
var thePromise = void 0;
if (state.toDoList.length === 0 && Object.keys(cli.flags).length === 0) {
  // ---------------------------------  1  -------------------------------------
  // if no arguments were given, offer a list:
  thePromise = offerAListOfFilesToPickFrom(state);
} else if (state.toDoList.map(function (onePath) {
  return path.resolve(onePath);
}).filter(fs.existsSync).length > 0) {
  // ---------------------------------  2  -------------------------------------
  // basically achieving: (!fs.existsSync)
  var erroneous = pullAll(state.toDoList.map(function (onePath) {
    return path.resolve(onePath);
  }), state.toDoList.map(function (onePath) {
    return path.resolve(onePath);
  }).filter(fs.existsSync)).map(function (singlePath) {
    return path.basename(singlePath);
  }); // then filtering file names-only

  // write the list of unrecognised file names into the console:
  if (erroneous.length > 0) {
    log(chalk.hex('#888888')('\nemail-all-chars-within-ascii-cli:  ') + chalk.red('Alas, the following file' + (erroneous.length > 1 ? 's don\'t' : ' doesn\'t') + ' exist: "' + erroneous.join('", "') + '"'));
  }

  // remove non-existing paths from toDoList:
  state.toDoList = state.toDoList.map(function (onePath) {
    return path.resolve(onePath);
  }).filter(fs.existsSync);

  // create the final promise variable we're going to use later:
  thePromise = Promise.resolve(state);
} else {
  // ---------------------------------  3  -------------------------------------
  log(chalk.yellow('\nemail-all-chars-within-ascii-cli: Computer didn\'t recognise any files in your input!'));

  // if there were no valid path in the arguments, query the files from the
  // existing CSV's in the current folder:
  thePromise = offerAListOfFilesToPickFrom(state);
}

// Step #3.
// -----------------------------------------------------------------------------

thePromise.then(function (receivedState) {
  var noErrors = true;
  receivedState.toDoList.forEach(function (requestedCSVsPath) {
    // read the file
    // existence of template.html
    var filesContents = '';
    var fileNameInfo = '';
    if (receivedState.toDoList.length > 0) {
      fileNameInfo = path.basename(requestedCSVsPath) + ' ';
    }
    try {
      filesContents = String(fs.readFileSync(requestedCSVsPath));
      try {
        within(filesContents, { messageOnly: true });
        log(chalk.hex('#888888')('\nemail-all-chars-within-ascii-cli:  ') + fileNameInfo + chalk.green('ALL OK'));
      } catch (e2) {
        var msg = e2.toString();
        if (msg.slice(0, 7) === 'Error: ') {
          msg = msg.slice(7);
        }
        log(chalk.hex('#888888')('\nemail-all-chars-within-ascii-cli:  ') + fileNameInfo + chalk.red(msg));
        noErrors = false;
      }
    } catch (e1) {
      log(chalk.hex('#888888')('\nemail-all-chars-within-ascii-cli:  ') + chalk.red('Alas, computer couldn\'t fetch the file "' + path.basename(requestedCSVsPath) + '" you requested and bailed on us!'));
    }
  });
  process.exit(noErrors ? 0 : 1);
});
