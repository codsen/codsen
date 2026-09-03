import {
  mkdir,
  readdir,
  readFile,
  realpath,
  rename,
  stat,
  symlink,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { execa } from "execa";
import { temporaryDirectory } from "tempy";
import { test } from "uvu";
import { equal, match } from "uvu/assert";
import { processFiles } from "../process-files.js";

const cliPath = path.resolve("cli.js");
const quietEnvironment = { FORCE_COLOR: undefined, NO_COLOR: undefined };

test("01 - malformed options fail before file discovery", async () => {
  const directory = temporaryDirectory();
  const target = path.join(directory, "target.json");
  const sentinel = path.join(directory, "sentinel.json");
  await Promise.all([
    writeFile(target, '{"z":1,"a":2}'),
    writeFile(sentinel, '{"z":3,"a":4}'),
  ]);

  const unknown = await execa(cliPath, ["--arrys", "target.json"], {
    cwd: directory,
    env: quietEnvironment,
    reject: false,
  });
  equal(unknown.exitCode, 1, "01.01");
  match(unknown.stderr, /Unknown option --arrys/, "01.02");

  const missing = await execa(cliPath, ["--lineEnding", "target.json"], {
    cwd: directory,
    env: quietEnvironment,
    reject: false,
  });
  equal(missing.exitCode, 1, "01.03");
  match(missing.stderr, /lineEnding must be/, "01.04");
  equal(await readFile(target, "utf8"), '{"z":1,"a":2}', "01.05");
  equal(await readFile(sentinel, "utf8"), '{"z":3,"a":4}', "01.06");
});

test("02 - dry mode always takes precedence and remains silent", async () => {
  const directory = temporaryDirectory();
  const target = path.join(directory, "target.json");
  const source = '{"z":1,"a":2}';
  await writeFile(target, source);

  const result = await execa(
    cliPath,
    ["target.json", "--dry", "--silent", "--ci"],
    { cwd: directory, env: quietEnvironment, reject: false },
  );

  equal(result.exitCode, 0, "02.01");
  equal(result.stdout, "", "02.02");
  equal(result.stderr, "", "02.03");
  equal(await readFile(target, "utf8"), source, "02.04");
});

test("03 - exact path filters retain similarly named files", async () => {
  const directory = temporaryDirectory();
  const backupDirectory = path.join(directory, "node_modules_backup");
  await mkdir(backupDirectory);
  const files = [
    path.join(directory, "my-package-lock.json"),
    path.join(directory, "my-package.json"),
    path.join(backupDirectory, "data.json"),
  ];
  await Promise.all(files.map((file) => writeFile(file, '{"z":1,"a":2}')));

  const result = await execa(
    cliPath,
    [
      "my-package-lock.json",
      "my-package.json",
      "node_modules_backup",
      "--pack",
      "--silent",
    ],
    { cwd: directory, env: quietEnvironment, reject: false },
  );

  equal(result.exitCode, 0, "03.01");
  for (let index = 0; index < files.length; index += 1) {
    equal(
      await readFile(files[index], "utf8"),
      '{\n  "a": 2,\n  "z": 1\n}\n',
      `03.02 - file ${String(index + 1).padStart(2, "0")}`,
    );
  }
});

test("04 - discovered symbolic links cannot escape the selected root", async () => {
  if (process.platform === "win32") {
    return;
  }
  const directory = temporaryDirectory();
  const requested = path.join(directory, "requested");
  const outside = path.join(directory, "outside");
  await Promise.all([mkdir(requested), mkdir(outside)]);
  const external = path.join(outside, "external.json");
  const source = '{"z":1,"a":2}';
  await writeFile(external, source);
  await symlink(outside, path.join(requested, "linked"), "dir");

  const result = await execa(cliPath, ["requested", "--silent"], {
    cwd: directory,
    env: quietEnvironment,
    reject: false,
  });

  equal(result.exitCode, 0, "04.01");
  equal(await readFile(external, "utf8"), source, "04.02");
});

test("05 - canonical files are not rewritten", async () => {
  const directory = temporaryDirectory();
  const target = path.join(directory, "target.json");
  await writeFile(target, '{\n  "a": 1\n}\n');
  const before = await stat(target, { bigint: true });

  await processFiles([target]);

  const after = await stat(target, { bigint: true });
  equal(after.mtimeNs, before.mtimeNs, "05.01");
  equal(after.ino, before.ino, "05.02");
});

test("06 - a newer snapshot is never overwritten", async () => {
  const directory = temporaryDirectory();
  const target = path.join(directory, "target.json");
  const original = Buffer.from('{"z":1,"a":2}');
  const newer = '{"newer":true}\n';
  await writeFile(target, original);
  const originalStat = await stat(target, { bigint: true });
  const originalRealPath = await realpath(target);
  let receivedError;

  try {
    await processFiles([target], {
      read: async () => {
        await writeFile(target, newer);
        return {
          contents: original,
          realPath: originalRealPath,
          stat: originalStat,
        };
      },
    });
  } catch (error) {
    receivedError = error;
  }

  equal(receivedError?.failures[0].stage, "write", "06.01");
  match(
    receivedError?.failures[0].error.message,
    /changed after it was read/,
    "06.02",
  );
  equal(await readFile(target, "utf8"), newer, "06.03");
  equal((await readdir(directory)).length, 1, "06.04");
});

test("07 - outcomes are delivered before the next normal-mode file", async () => {
  const events = [];
  const canonical = '{\n  "a": 1\n}\n';

  await processFiles(["first.json", "second.json"], {
    onOutcome: ({ path: filePath }) => events.push(`outcome:${filePath}`),
    read: async (filePath) => {
      events.push(`read:${filePath}`);
      return canonical;
    },
  });

  equal(
    events,
    [
      "read:first.json",
      "outcome:first.json",
      "read:second.json",
      "outcome:second.json",
    ],
    "07.01",
  );
});

test("08 - callback failures don't interrupt independent files", async () => {
  let outcomes = 0;
  let receivedError;

  try {
    await processFiles(["first.json", "second.json"], {
      onOutcome: () => {
        outcomes += 1;
        throw new Error("observer failed");
      },
      read: async () => '{\n  "a": 1\n}\n',
    });
  } catch (error) {
    receivedError = error;
  }

  equal(outcomes, 2, "08.01");
  equal(receivedError?.message, "observer failed", "08.02");
});

test("09 - malformed UTF-8 is rejected without changing its bytes", async () => {
  const directory = temporaryDirectory();
  const target = path.join(directory, "target.json");
  const source = Buffer.from([
    0x7b, 0x22, 0x61, 0x22, 0x3a, 0x22, 0x80, 0x22, 0x7d,
  ]);
  await writeFile(target, source);
  let receivedError;

  try {
    await processFiles([target]);
  } catch (error) {
    receivedError = error;
  }

  equal(receivedError?.failures[0].stage, "decode", "09.01");
  equal(await readFile(target), source, "09.02");
});

test("10 - duplicate object members fail without changing the file", async () => {
  const directory = temporaryDirectory();
  const target = path.join(directory, "target.json");
  const source = '{"a":1,"a":2}';
  await writeFile(target, source);
  let receivedError;

  try {
    await processFiles([target]);
  } catch (error) {
    receivedError = error;
  }

  equal(receivedError?.failures[0].stage, "parse", "10.01");
  equal(await readFile(target, "utf8"), source, "10.02");
});

test("11 - invalid option forms share a fail-closed contract", async () => {
  const directory = temporaryDirectory();
  const target = path.join(directory, "target.json");
  const source = '{"z":1,"a":2}';
  await writeFile(target, source);
  const argumentSets = [
    ["-x", "target.json"],
    ["--arrays=true", "target.json"],
    ["--arrays", "--arrays", "target.json"],
    ["--lineEnding", "--ci", "target.json"],
    ["-l"],
    ["--lineEnding=", "target.json"],
    ["--indentationCount=-1", "target.json"],
    ["-i1.5", "target.json"],
    ["--lineEnding=bogus", "target.json"],
    ["--arrays"],
  ];
  const results = [];

  for (const arguments_ of argumentSets) {
    results.push(
      await execa(cliPath, arguments_, {
        cwd: directory,
        env: quietEnvironment,
        reject: false,
        stdin: "ignore",
      }),
    );
  }

  equal(
    results.map(({ exitCode }) => exitCode),
    argumentSets.map(() => 1),
    "11.01",
  );
  equal(
    results.every(({ stderr }) =>
      stderr.startsWith("json-sort-cli/parseArguments(): [THROW_ID_01]"),
    ),
    true,
    "11.02",
  );
  equal(await readFile(target, "utf8"), source, "11.03");
});

test("12 - attached flags and dash-prefixed paths remain available", async () => {
  const directory = temporaryDirectory();
  const dashPath = path.join(directory, "-target.json");
  const groupedPath = path.join(directory, "grouped.json");
  await Promise.all([
    writeFile(dashPath, '{"z":1,"a":2}'),
    writeFile(groupedPath, '["z","a"]'),
  ]);

  const dashResult = await execa(cliPath, ["--", "-target.json"], {
    cwd: directory,
    env: quietEnvironment,
    reject: false,
  });
  const groupedResult = await execa(
    cliPath,
    ["grouped.json", "-ati0", "-llf", "--silent"],
    { cwd: directory, env: quietEnvironment, reject: false },
  );

  equal(dashResult.exitCode, 0, "12.01");
  equal(groupedResult.exitCode, 0, "12.02");
  equal(
    await readFile(dashPath, "utf8"),
    '{\n  "a": 2,\n  "z": 1\n}\n',
    "12.03",
  );
  equal(await readFile(groupedPath, "utf8"), '["a","z"]\n', "12.04");
});

test("13 - silent mode suppresses success and failure streams", async () => {
  const directory = temporaryDirectory();
  await Promise.all([
    writeFile(path.join(directory, "malformed.json"), '{"a":}'),
    writeFile(path.join(directory, "unsorted.json"), '{"z":1,"a":2}'),
  ]);

  const malformed = await execa(cliPath, ["malformed.json", "--silent"], {
    cwd: directory,
    env: quietEnvironment,
    reject: false,
  });
  const ci = await execa(cliPath, ["unsorted.json", "--silent", "--ci"], {
    cwd: directory,
    env: quietEnvironment,
    reject: false,
  });

  equal(malformed.exitCode, 1, "13.01");
  equal(malformed.stdout, "", "13.02");
  equal(malformed.stderr, "", "13.03");
  equal(ci.exitCode, 9, "13.04");
  equal(ci.stdout, "", "13.05");
  equal(ci.stderr, "", "13.06");
});

test("14 - explicit symbolic links and non-files fail safely", async () => {
  if (process.platform === "win32") {
    return;
  }
  const directory = temporaryDirectory();
  const target = path.join(directory, "target.json");
  const link = path.join(directory, "link.json");
  await writeFile(target, '{"z":1,"a":2}');
  await symlink(target, link, "file");
  let linkError;
  let directoryError;

  try {
    await processFiles([link]);
  } catch (error) {
    linkError = error;
  }
  try {
    await processFiles([directory]);
  } catch (error) {
    directoryError = error;
  }

  equal(linkError?.failures[0].stage, "read", "14.01");
  match(linkError?.failures[0].error.message, /symbolic[- ]link/, "14.02");
  equal(directoryError?.failures[0].stage, "read", "14.03");
  match(directoryError?.failures[0].error.message, /non-file/, "14.04");
  equal(await readFile(target, "utf8"), '{"z":1,"a":2}', "14.05");
});

test("15 - unsafe custom reads cannot reach the default writer", async () => {
  let receivedError;

  try {
    await processFiles(["virtual.json"], {
      read: async () => '{"z":1,"a":2}',
    });
  } catch (error) {
    receivedError = error;
  }

  equal(receivedError?.failures[0].stage, "write", "15.01");
  match(
    receivedError?.failures[0].error.message,
    /without the original file snapshot/,
    "15.02",
  );
});

test("16 - unstringifiable thrown values keep a stable diagnostic", async () => {
  const thrown = {
    [Symbol.toPrimitive]() {
      throw new Error("cannot stringify");
    },
  };
  let receivedError;

  try {
    await processFiles(["virtual.json"], {
      parse: () => {
        throw thrown;
      },
      read: async () => "{}",
    });
  } catch (error) {
    receivedError = error;
  }

  equal(
    receivedError?.failures[0].error.message,
    "Unknown non-Error value",
    "16.01",
  );
  equal(receivedError?.failures[0].error.cause, thrown, "16.02");
});

test("17 - silent mode also suppresses argument failures", async () => {
  const result = await execa(cliPath, ["--unknown", "--silent"], {
    env: quietEnvironment,
    reject: false,
  });

  equal(result.exitCode, 1, "17.01");
  equal(result.stdout, "", "17.02");
  equal(result.stderr, "", "17.03");
});

test("18 - explicit symbolic-link directory roots are deliberate", async () => {
  if (process.platform === "win32") {
    return;
  }
  const directory = temporaryDirectory();
  const outside = path.join(directory, "outside");
  const linked = path.join(directory, "linked");
  await mkdir(outside);
  const external = path.join(outside, "external.json");
  const source = '{"z":1,"a":2}';
  await writeFile(external, source);
  await symlink(outside, linked, "dir");

  const exact = await execa(cliPath, ["linked", "--silent"], {
    cwd: directory,
    env: quietEnvironment,
    reject: false,
  });
  const globbed = await execa(cliPath, ["linked/*.json", "--silent"], {
    cwd: directory,
    env: quietEnvironment,
    reject: false,
  });

  equal(exact.exitCode, 0, "18.01");
  equal(exact.stdout, "", "18.02");
  equal(exact.stderr, "", "18.03");
  equal(globbed.exitCode, 0, "18.04");
  equal(globbed.stdout, "", "18.05");
  equal(globbed.stderr, "", "18.06");
  equal(
    await readFile(external, "utf8"),
    '{\n  "a": 2,\n  "z": 1\n}\n',
    "18.07",
  );
});

test("19 - an ancestor changed to a symbolic link fails before commit", async () => {
  if (process.platform === "win32") {
    return;
  }
  const directory = temporaryDirectory();
  const requested = path.join(directory, "requested");
  const moved = path.join(directory, "moved");
  const outside = path.join(directory, "outside");
  await Promise.all([mkdir(requested), mkdir(outside)]);
  const target = path.join(requested, "target.json");
  const movedTarget = path.join(moved, "target.json");
  const external = path.join(outside, "target.json");
  const original = Buffer.from('{"z":1,"a":2}');
  const sentinel = '{"outside":true}\n';
  await Promise.all([
    writeFile(target, original),
    writeFile(external, sentinel),
  ]);
  let receivedError;

  try {
    await processFiles([target], {
      read: async () => {
        const snapshot = {
          contents: await readFile(target),
          realPath: await realpath(target),
          stat: await stat(target, { bigint: true }),
        };
        await rename(requested, moved);
        await symlink(outside, requested, "dir");
        return snapshot;
      },
    });
  } catch (error) {
    receivedError = error;
  }

  equal(receivedError?.failures[0].stage, "write", "19.01");
  match(receivedError?.failures[0].error.message, /route changed/, "19.02");
  equal(await readFile(external, "utf8"), sentinel, "19.03");
  equal(await readFile(movedTarget), original, "19.04");
  equal(await readdir(outside), ["target.json"], "19.05");
});

test("20 - exact ignored basenames never become candidates", async () => {
  const directory = temporaryDirectory();
  const ignored = path.join(directory, ".DS_Store");
  const source = '{"z":1,"a":2}';
  await writeFile(ignored, source);

  const result = await execa(cliPath, [".DS_Store"], {
    cwd: directory,
    env: quietEnvironment,
    reject: false,
  });

  equal(result.exitCode, 0, "20.01");
  match(result.stdout, /don't lead to any JSON files/, "20.02");
  equal(await readFile(ignored, "utf8"), source, "20.03");
});

test.run();
