// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { codsenCLI } from "../dist/codsen-utils.esm.js";

// helpers
// -----------------------------------------------------------------------------

const pkg = {
  name: "demo-cli",
  version: "1.2.3",
  description: "A demo program",
  bin: { demo: "cli.js" },
};

// runs the given callback with console.log and process.exit stubbed out, so
// that showHelp()/showVersion() can be observed instead of killing the runner
function trap(fn) {
  let logged = [];
  let exitCode;
  let origLog = console.log;
  let origExit = process.exit;
  console.log = (...args) => {
    logged.push(args.join(" "));
  };
  process.exit = (code) => {
    exitCode = code;
    throw new Error("__stubbed_exit__");
  };
  let result;
  let threw = false;
  try {
    result = fn();
  } catch (err) {
    if (err.message !== "__stubbed_exit__") {
      console.log = origLog;
      process.exit = origExit;
      throw err;
    }
    threw = true;
  } finally {
    console.log = origLog;
    process.exit = origExit;
  }
  return { logged, exitCode, result, exited: threw };
}

// wraps codsenCLI so tests don't have to repeat the boilerplate
function cli(argv, flags = {}, extras = {}) {
  return codsenCLI("  Usage\n    $ demo\n", {
    argv,
    flags,
    pkg,
    autoHelp: false,
    autoVersion: false,
    ...extras,
  });
}

// -----------------------------------------------------------------------------

test("01 - positional input only", () => {
  let res = cli(["a.json", "b.json"]);
  equal(res.input, ["a.json", "b.json"], "01.01");
  equal(res.flags, {}, "01.02");
  equal(res.pkg, pkg, "01.03");
});

test("02 - no arguments at all", () => {
  let res = cli([]);
  equal(res.input, [], "02.01");
  equal(res.flags, {}, "02.02");
});

test("03 - long boolean flag", () => {
  let flags = { tabs: { type: "boolean", shortFlag: "t" } };
  equal(cli(["--tabs"], flags).flags, { tabs: true }, "03.01");
  equal(cli([], flags).flags, { tabs: false }, "03.02");
});

test("04 - long flag with a separate value", () => {
  let flags = { trigger: { type: "string", shortFlag: "r" } };
  let res = cli(["--trigger", "log", "a.js"], flags);
  equal(res.flags, { trigger: "log" }, "04.01");
  equal(res.input, ["a.js"], "04.02");
});

test("05 - long flag with an inline value", () => {
  let flags = { pad: { type: "number", shortFlag: "p" } };
  equal(cli(["--pad=2"], flags).flags, { pad: 2 }, "05.01");
  equal(cli(["--pad=2.5"], flags).flags, { pad: 2.5 }, "05.02");
  equal(cli(["--pad=-3"], flags).flags, { pad: -3 }, "05.03");
});

test("06 - a boolean flag will not swallow the next token", () => {
  let flags = { normalise: { type: "boolean", shortFlag: "n" } };
  let res = cli(["--normalise", "data"], flags);
  equal(res.flags, { normalise: true }, "06.01");
  equal(res.input, ["data"], "06.02");
});

test('07 - but "true"/"false" after a boolean flag is taken as its value', () => {
  let flags = { overwrite: { type: "boolean", shortFlag: "o" } };
  equal(
    cli(["--overwrite", "false"], flags).flags,
    { overwrite: false },
    "07.01",
  );
  equal(
    cli(["--overwrite", "true"], flags).flags,
    { overwrite: true },
    "07.02",
  );
  equal(cli(["--overwrite", "false"], flags).input, [], "07.03");
});

test("08 - --no- prefix negates", () => {
  let flags = { tabs: { type: "boolean", shortFlag: "t", default: true } };
  equal(cli(["--no-tabs"], flags).flags, { tabs: false }, "08.01");
  equal(cli([], flags).flags, { tabs: true }, "08.02");
  // an undeclared flag can be negated too
  equal(cli(["--no-colour"]).flags, { colour: false }, "08.03");
});

test("09 - --no- on a multiple flag yields an array", () => {
  let flags = { ignore: { type: "string", shortFlag: "i", isMultiple: true } };
  equal(cli(["--no-ignore"], flags).flags, { ignore: [false] }, "09.01");
});

test("10 - short boolean flag", () => {
  let flags = { tabs: { type: "boolean", shortFlag: "t" } };
  equal(cli(["-t"], flags).flags, { tabs: true }, "10.01");
});

test("11 - short flag with a separate value", () => {
  let flags = { lineEnding: { type: "string", shortFlag: "l" } };
  equal(cli(["-l", "cr"], flags).flags, { lineEnding: "cr" }, "11.01");
});

test("12 - short flag with an inline value", () => {
  let flags = { pad: { type: "number", shortFlag: "p" } };
  equal(cli(["-p=2"], flags).flags, { pad: 2 }, "12.01");
});

test("13 - short flag with a glued numeric value", () => {
  let flags = { pad: { type: "number", shortFlag: "p" } };
  equal(cli(["-p2"], flags).flags, { pad: 2 }, "13.01");
  equal(cli(["-p2.5"], flags).flags, { pad: 2.5 }, "13.02");
});

test('14 - short flag and value arriving as one argument, "-i 3"', () => {
  let flags = { indentationCount: { type: "number", shortFlag: "i" } };
  equal(cli(["-i 3"], flags).flags, { indentationCount: 3 }, "14.01");
});

test("15 - short flag with a glued string value", () => {
  let flags = { lineEnding: { type: "string", shortFlag: "l" } };
  equal(cli(["-lcr", "x.json"], flags).flags, { lineEnding: "cr" }, "15.01");
  equal(cli(["-lcr", "x.json"], flags).input, ["x.json"], "15.02");
});

test("16 - bundled short booleans", () => {
  let flags = {
    tabs: { type: "boolean", shortFlag: "t" },
    arrays: { type: "boolean", shortFlag: "a" },
    silent: { type: "boolean", shortFlag: "s" },
  };
  equal(
    cli(["-tas", "x.json"], flags).flags,
    { tabs: true, arrays: true, silent: true },
    "16.01",
  );
  equal(cli(["-tas", "x.json"], flags).input, ["x.json"], "16.02");
});

test("17 - last flag of a bundle claims the following value", () => {
  let flags = {
    tabs: { type: "boolean", shortFlag: "t" },
    lineEnding: { type: "string", shortFlag: "l" },
  };
  equal(
    cli(["-tl", "crlf"], flags).flags,
    { tabs: true, lineEnding: "crlf" },
    "17.01",
  );
});

test("18 - camelCase flag names accept both spellings", () => {
  let flags = { indentationCount: { type: "number", shortFlag: "i" } };
  equal(
    cli(["--indentation-count", "5"], flags).flags,
    { indentationCount: 5 },
    "18.01",
  );
  equal(
    cli(["--indentationCount", "5"], flags).flags,
    { indentationCount: 5 },
    "18.02",
  );
  equal(
    cli(["--indentation-count=5"], flags).flags,
    { indentationCount: 5 },
    "18.03",
  );
});

test("19 - an undeclared dashed flag is camelCased", () => {
  equal(cli(["--dry-run"]).flags, { dryRun: true }, "19.01");
  equal(cli(["--a-b-c", "x"]).flags, { aBC: "x" }, "19.02");
});

test("20 - bare typed flags fall back to a per-type blank", () => {
  let res = cli(["--str", "--num", "--bool", "--none"], {
    str: { type: "string" },
    num: { type: "number" },
    bool: { type: "boolean" },
  });
  equal(res.flags.str, "", "20.01");
  equal(res.flags.num, undefined, "20.02");
  equal(res.flags.bool, true, "20.03");
  equal(res.flags.none, true, "20.04");
});

test("21 - values are coerced to the declared type", () => {
  let flags = {
    num: { type: "number" },
    str: { type: "string" },
    bool: { type: "boolean" },
  };
  let res = cli(["--num=7", "--str=7", "--bool=true"], flags);
  equal(res.flags.num, 7, "21.01");
  equal(res.flags.str, "7", "21.02");
  equal(res.flags.bool, true, "21.03");
  equal(cli(["--bool=nope"], flags).flags.bool, false, "21.04");
  // an undeclared flag keeps its raw string
  equal(cli(["--what=7"]).flags.what, "7", "21.05");
});

test("22 - isMultiple collects every occurrence", () => {
  let flags = { ignore: { type: "string", shortFlag: "i", isMultiple: true } };
  equal(
    cli(["-i", "a.b", "-i", "c.d"], flags).flags,
    { ignore: ["a.b", "c.d"] },
    "22.01",
  );
  equal(cli(["-i", "a.b"], flags).flags, { ignore: ["a.b"] }, "22.02");
  // absent, it defaults to an empty array
  equal(cli([], flags).flags, { ignore: [] }, "22.03");
});

test("23 - isMultiple honours an explicit default", () => {
  let flags = {
    ignore: { type: "string", isMultiple: true, default: ["zz"] },
  };
  equal(cli([], flags).flags, { ignore: ["zz"] }, "23.01");
});

test("24 - a non-multiple flag is last-one-wins", () => {
  let flags = { pad: { type: "number", shortFlag: "p" } };
  equal(cli(["-p", "1", "-p", "2"], flags).flags, { pad: 2 }, "24.01");
});

test("25 - declared booleans default to false", () => {
  let flags = { a: { type: "boolean" }, b: { type: "string" } };
  let res = cli([], flags);
  equal(res.flags.a, false, "25.01");
  equal(Object.hasOwn(res.flags, "b"), false, "25.02");
});

test("26 - booleanDefault is configurable", () => {
  let flags = { a: { type: "boolean" } };
  equal(cli([], flags, { booleanDefault: true }).flags, { a: true }, "26.01");
  // explicitly undefined leaves declared booleans unset
  equal(cli([], flags, { booleanDefault: undefined }).flags, {}, "26.02");
});

test("27 - an explicit default beats booleanDefault", () => {
  let flags = { a: { type: "boolean", default: true } };
  equal(cli([], flags).flags, { a: true }, "27.01");
  equal(cli(["--no-a"], flags).flags, { a: false }, "27.02");
});

test("28 - everything after -- is input", () => {
  let res = cli(["a.json", "--", "-t", "--tabs", "b.json"], {
    tabs: { type: "boolean", shortFlag: "t" },
  });
  equal(res.input, ["a.json", "-t", "--tabs", "b.json"], "28.01");
  equal(res.flags, { tabs: false }, "28.02");
});

test("29 - a bare -- at the very end contributes nothing", () => {
  equal(cli(["a.json", "--"]).input, ["a.json"], "29.01");
});

test("30 - negative numbers are input, not flags", () => {
  equal(cli(["-3"]).input, ["-3"], "30.01");
  equal(cli(["a", "-3.5", "b"]).input, ["a", "-3.5", "b"], "30.02");
  equal(cli(["-3"]).flags, {}, "30.03");
});

test("31 - a negative number can be a flag's value", () => {
  let flags = { pad: { type: "number", shortFlag: "p" } };
  equal(cli(["-p", "-3"], flags).flags, { pad: -3 }, "31.01");
  equal(cli(["--pad", "-3"], flags).flags, { pad: -3 }, "31.02");
});

test("32 - a flag will not swallow the flag after it", () => {
  let flags = {
    pad: { type: "number", shortFlag: "p" },
    tabs: { type: "boolean", shortFlag: "t" },
  };
  let res = cli(["--pad", "--tabs"], flags);
  equal(res.flags, { pad: undefined, tabs: true }, "32.01");
});

test("33 - a lone dash is treated as a value", () => {
  let flags = { pad: { type: "string", shortFlag: "p" } };
  equal(cli(["--pad", "-"], flags).flags, { pad: "-" }, "33.01");
});

test("34 - a trailing flag with nothing after it", () => {
  let flags = { pad: { type: "string", shortFlag: "p" } };
  equal(cli(["-p"], flags).flags, { pad: "" }, "34.01");
  equal(cli(["--pad"], flags).flags, { pad: "" }, "34.02");
});

test("35 - undeclared flags are kept", () => {
  let res = cli(["-v", "-h", "--extras"]);
  equal(res.flags, { v: true, h: true, extras: true }, "35.01");
});

test("36 - an undeclared flag takes the next token as a value", () => {
  equal(cli(["--extras", "**"]).flags, { extras: "**" }, "36.01");
  equal(cli(["--extras", "**"]).input, [], "36.02");
  // ... unless it comes first
  equal(cli(["**", "--extras"]).input, ["**"], "36.03");
  equal(cli(["**", "--extras"]).flags, { extras: true }, "36.04");
});

test("37 - short flags map onto their long names only", () => {
  let flags = { overwrite: { type: "boolean", shortFlag: "o" } };
  let res = cli(["-o"], flags);
  equal(res.flags, { overwrite: true }, "37.01");
  equal(Object.hasOwn(res.flags, "o"), false, "37.02");
});

// help text
// -----------------------------------------------------------------------------

test("38 - help text carries the description and keeps its indentation", () => {
  let res = codsenCLI("\n  Usage\n    $ demo\n\n  Options\n    -h  Help\n", {
    argv: [],
    pkg,
  });
  equal(
    res.help,
    "\n  A demo program\n\n  Usage\n    $ demo\n\n  Options\n    -h  Help\n",
    "38.01",
  );
});

test("39 - over-indented help text is dedented back to helpIndent", () => {
  let res = codsenCLI("\n      Usage\n        $ demo\n", {
    argv: [],
    pkg: { version: "1.0.0" },
  });
  equal(res.help, "\n  Usage\n    $ demo\n", "39.01");
});

test("40 - helpIndent is configurable", () => {
  let res = codsenCLI("\n  Usage\n    $ demo\n", {
    argv: [],
    pkg: { version: "1.0.0" },
    helpIndent: 4,
  });
  equal(res.help, "\n    Usage\n      $ demo\n", "40.01");
});

test("41 - single-line help text is left alone", () => {
  let res = codsenCLI("Usage: demo", {
    argv: [],
    pkg: { version: "1.0.0" },
  });
  equal(res.help, "\nUsage: demo\n", "41.01");
});

test("42 - description with no help text", () => {
  let res = codsenCLI("", { argv: [], pkg });
  equal(res.help, "\nA demo program\n", "42.01");
});

test("43 - no help text and no description", () => {
  let res = codsenCLI("", { argv: [], pkg: { version: "1.0.0" } });
  equal(res.help, "\n", "43.01");
});

test("44 - description can be switched off, or overridden", () => {
  equal(
    codsenCLI("Usage", { argv: [], pkg, description: false }).help,
    "\nUsage\n",
    "44.01",
  );
  equal(
    codsenCLI("Usage", { argv: [], pkg, description: "Other" }).help,
    "\n  Other\n\nUsage\n",
    "44.02",
  );
});

test("45 - trailing tabs are trimmed off the help text", () => {
  let res = codsenCLI("\n  Usage\n\t\t\n", {
    argv: [],
    pkg: { version: "1.0.0" },
  });
  equal(res.help, "\n  Usage\n", "45.01");
});

// version, showHelp, showVersion
// -----------------------------------------------------------------------------

test("46 - version comes off the package.json", () => {
  let { logged, exitCode } = trap(() => cli([]).showVersion());
  equal(logged, ["1.2.3"], "46.01");
  equal(exitCode, 0, "46.02");
});

test("47 - version can be given explicitly", () => {
  let { logged } = trap(() => cli([], {}, { version: "9.9.9" }).showVersion());
  equal(logged, ["9.9.9"], "47.01");
});

test("48 - a package.json with no version", () => {
  let { logged } = trap(() =>
    codsenCLI("h", { argv: [], pkg: {} }).showVersion(),
  );
  equal(logged, ["No version found"], "48.01");
});

test("49 - showHelp defaults to exit code 2", () => {
  let { logged, exitCode } = trap(() => cli([]).showHelp());
  match(logged[0], /Usage/, "49.01");
  equal(exitCode, 2, "49.01");
});

test("50 - showHelp takes an exit code", () => {
  let { exitCode } = trap(() => cli([]).showHelp(0));
  equal(exitCode, 0, "50.01");
});

test("51 - --version on its own prints the version and exits", () => {
  let { logged, exitCode, exited } = trap(() =>
    codsenCLI("h", { argv: ["--version"], pkg }),
  );
  equal(logged, ["1.2.3"], "51.01");
  equal(exitCode, 0, "51.02");
  equal(exited, true, "51.03");
});

test("52 - --help on its own prints the help and exits 0", () => {
  let { logged, exitCode, exited } = trap(() =>
    codsenCLI("\n  Usage\n    $ demo\n", { argv: ["--help"], pkg }),
  );
  match(logged[0], /Usage/, "52.01");
  equal(exitCode, 0, "52.01");
  equal(exited, true, "52.02");
});

test("53 - a short -v/-h resolves to the declared long flag", () => {
  let flags = {
    version: { type: "boolean", shortFlag: "v" },
    help: { type: "boolean", shortFlag: "h" },
  };
  let a = trap(() => codsenCLI("h", { argv: ["-v"], pkg, flags }));
  equal(a.logged, ["1.2.3"], "53.01");
  let b = trap(() =>
    codsenCLI("\n  Usage\n  x\n", { argv: ["-h"], pkg, flags }),
  );
  match(b.logged[0], /Usage/, "53.02");
});

test("54 - auto help/version only fire when they are the sole argument", () => {
  let res = codsenCLI("h", { argv: ["--version", "extra"], pkg });
  equal(res.flags.version, "extra", "54.01");
  let res2 = codsenCLI("h", {
    argv: ["--help"],
    pkg,
    flags: { help: { type: "boolean" } },
    autoHelp: false,
  });
  equal(res2.flags.help, true, "54.02");
  let res3 = codsenCLI("h", {
    argv: ["--version"],
    pkg,
    flags: { version: { type: "boolean" } },
    autoVersion: false,
  });
  equal(res3.flags.version, true, "54.03");
});

test("55 - auto help does not fire when there is input", () => {
  let res = codsenCLI("h", {
    argv: ["file.json", "--help"],
    pkg,
    flags: { help: { type: "boolean", shortFlag: "h" } },
  });
  equal(res.flags.help, true, "55.01");
  equal(res.input, ["file.json"], "55.02");
});

// process title
// -----------------------------------------------------------------------------

test("56 - process title comes off the bin field", () => {
  let original = process.title;
  codsenCLI("h", { argv: [], pkg: { name: "a-cli", bin: { aaa: "cli.js" } } });
  equal(process.title, "aaa", "56.01");

  codsenCLI("h", { argv: [], pkg: { name: "b-cli", bin: "cli.js" } });
  equal(process.title, "b-cli", "56.02");

  // a string bin on a scoped package uses the unscoped half
  codsenCLI("h", { argv: [], pkg: { name: "@scope/c-cli", bin: "cli.js" } });
  equal(process.title, "c-cli", "56.03");

  // no bin at all, fall back to the package name
  codsenCLI("h", { argv: [], pkg: { name: "d-cli" } });
  equal(process.title, "d-cli", "56.04");

  // an empty bin object, likewise
  codsenCLI("h", { argv: [], pkg: { name: "e-cli", bin: {} } });
  equal(process.title, "e-cli", "56.05");

  // nothing to go on - the title is left as it was
  codsenCLI("h", { argv: [], pkg: {} });
  equal(process.title, "e-cli", "56.06");

  process.title = original;
});

// defaults
// -----------------------------------------------------------------------------

test("57 - argv defaults to process.argv", () => {
  let original = process.argv;
  process.argv = ["node", "cli.js", "a.json", "-t"];
  let res = codsenCLI("h", {
    pkg,
    flags: { tabs: { type: "boolean", shortFlag: "t" } },
  });
  process.argv = original;
  equal(res.input, ["a.json"], "57.01");
  equal(res.flags, { tabs: true }, "57.02");
});

test("58 - called with no arguments at all", () => {
  let original = process.argv;
  process.argv = ["node", "cli.js"];
  let res = codsenCLI();
  process.argv = original;
  equal(res.input, [], "58.01");
  equal(res.flags, {}, "58.02");
  equal(res.help, "\n", "58.03");
  equal(res.pkg, {}, "58.04");
});

test("59 - works without newer globals when argv is explicit", () => {
  const globalObject = globalThis;
  const globalThisDescriptor = Object.getOwnPropertyDescriptor(
    globalObject,
    "globalThis",
  );
  const processDescriptor = Object.getOwnPropertyDescriptor(
    globalObject,
    "process",
  );
  const hasOwnDescriptor = Object.getOwnPropertyDescriptor(Object, "hasOwn");

  Reflect.deleteProperty(globalObject, "process");
  Reflect.deleteProperty(Object, "hasOwn");
  Reflect.deleteProperty(globalObject, "globalThis");

  let flags;
  try {
    flags = codsenCLI("", {
      argv: [],
      flags: {
        a: { type: "boolean" },
        b: { type: "string", default: "x" },
      },
      booleanDefault: undefined,
      autoHelp: false,
      autoVersion: false,
    }).flags;
  } finally {
    Object.defineProperty(globalObject, "globalThis", globalThisDescriptor);
    Object.defineProperty(globalObject, "process", processDescriptor);
    Object.defineProperty(Object, "hasOwn", hasOwnDescriptor);
  }

  equal(flags, { b: "x" }, "59.01");
});

test.run();
