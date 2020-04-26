#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const f = require("..");

const testme = () =>
  f(
    {
      title: [
        "something",
        "Some text %%_subtitle_%%",
        "%%_submarine_%%",
        "anything",
      ],
      title_data: {
        subtitle: "text",
        submarine: "ship",
      },
    },
    {
      heads: "%%_",
      tails: "_%%",
      lookForDataContainers: true,
      dataContainerIdentifierTails: "_data",
      wrapHeadsWith: "{",
      wrapTailsWith: "}",
      dontWrapVars: ["*zzz", "*le", "*yyy"],
      preventDoubleWrapping: true,
      wrapGlobalFlipSwitch: true,
    }
  );

// action
runPerf(testme, callerDir);
