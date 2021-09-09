#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.js";

// setup
import { jVar } from "../dist/json-variables.esm.js";

const testme = () =>
  jVar(
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
