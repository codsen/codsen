// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { execa, execaCommand } from "execa";
import { temporaryDirectory } from "tempy";
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

// import pMap from "p-map";
// import pack from "../package.json";
// import {
//   testFileContents,
//   sortedTestFileContents,
//   testFilePaths,
//   sortedTabbedTestFileContents,
//   minifiedContents,
//   prettifiedContents,
// } from "./util/data.js";

// -----------------------------------------------------------------------------

// SORTED

[
  [], // no -l flag
  ["-l", "lf"],
  ["-l", "crlf"],
  ["-l", "cr"],
].forEach((ciLFlag, ciLFlagIdx) => {
  const testNumber = String(ciLFlagIdx + 1).padStart(2, "0");

  test(`${testNumber} - one sorted file, LF, --lineEnding === ${JSON.stringify(
    ciLFlag,
    null,
    0,
  )}`, async () => {
    let sortedFile = '{\n  "a": 1,\n  "z": 2\n}\n';
    // prove the file is of the right format, LF
    ok(sortedFile.includes("\n"), `${testNumber}.01`);
    not.ok(sortedFile.includes("\r"), `${testNumber}.03`); // <-- covers CRLF too

    let tempFolder = temporaryDirectory();
    // const tempFolder = "temp";
    mkdirSync(path.resolve(tempFolder), { recursive: true });
    writeFileSync(path.join(tempFolder, "sortme.json"), sortedFile);

    if (ciLFlagIdx < 2) {
      // happy path cases, LF will be good
      let output = await execa("./cli.js", [
        tempFolder,
        "-c",
        ...ciLFlag,
      ]).catch((err) => {
        throw new Error(err);
      });
      equal(output.exitCode, 0, `${testNumber}.01`);
    } else {
      // should throw, so we need to catch
      await execa("./cli.js", [tempFolder, "-c", ...ciLFlag])
        .then(() => {
          // this clause should never be reached
          not.ok("execa should have exited with non-zero code");
        })
        .catch((err) => {
          equal(err.exitCode, 9, `${testNumber}.02`);
        });
    }

    equal(
      readFileSync(path.join(tempFolder, "sortme.json"), "utf8"),
      sortedFile,
      `${testNumber}.03`,
    );
  });
});

[
  [], // no -l flag
  ["-l", "crlf"],
  ["-l", "lf"],
  ["-l", "cr"],
].forEach((ciLFlag, ciLFlagIdx) => {
  const testNumber = String(ciLFlagIdx + 5).padStart(2, "0");

  test(`${testNumber} - one sorted file, CRLF, --lineEnding === ${JSON.stringify(
    ciLFlag,
    null,
    0,
  )}`, async () => {
    let sortedFile = '{\r\n  "a": 1,\r\n  "z": 2\r\n}\r\n';
    // prove the file is of the right format, CRLF
    ok(sortedFile.includes("\r\n"), `${testNumber}.01`);

    let tempFolder = temporaryDirectory();
    // const tempFolder = "temp";
    mkdirSync(path.resolve(tempFolder), { recursive: true });
    writeFileSync(path.join(tempFolder, "sortme.json"), sortedFile);

    if (ciLFlagIdx < 2) {
      // happy-path cases, CRLF
      let output = await execa("./cli.js", [
        tempFolder,
        "-c",
        ...ciLFlag,
      ]).catch((err) => {
        throw new Error(err);
      });
      equal(output.exitCode, 0, `${testNumber}.01`);
    } else {
      // should throw, so we need to catch
      await execa("./cli.js", [tempFolder, "-c", ...ciLFlag])
        .then(() => {
          // this clause should never be reached
          not.ok("execa should have exited with non-zero code");
        })
        .catch((err) => {
          equal(err.exitCode, 9, `${testNumber}.02`);
        });
    }

    equal(
      readFileSync(path.join(tempFolder, "sortme.json"), "utf8"),
      sortedFile,
      `${testNumber}.03`,
    );
  });
});

[
  [], // no -l flag
  ["-l", "cr"],
  ["-l", "crlf"],
  ["-l", "lf"],
].forEach((ciLFlag, ciLFlagIdx) => {
  const testNumber = String(ciLFlagIdx + 9).padStart(2, "0");

  test(`${testNumber} - one sorted file, CR, --lineEnding === ${JSON.stringify(
    ciLFlag,
    null,
    0,
  )}`, async () => {
    let sortedFile = '{\r  "a": 1,\r  "z": 2\r}\r';
    // prove the file is of the right format, CR
    ok(sortedFile.includes("\r"), `${testNumber}.01`);
    not.ok(sortedFile.includes("\n"), `${testNumber}.03`); // <-- covers CRLF too

    let tempFolder = temporaryDirectory();
    // const tempFolder = "temp";
    mkdirSync(path.resolve(tempFolder), { recursive: true });
    writeFileSync(path.join(tempFolder, "sortme.json"), sortedFile);

    if (ciLFlagIdx < 2) {
      let output = await execa("./cli.js", [
        tempFolder,
        "-c",
        ...ciLFlag,
      ]).catch((err) => {
        throw new Error(err);
      });
      equal(output.exitCode, 0, `${testNumber}.01`);
    } else {
      // should throw, so we need to catch
      await execa("./cli.js", [tempFolder, "-c", ...ciLFlag])
        .then(() => {
          // this clause should never be reached
          not.ok("execa should have exited with non-zero code");
        })
        .catch((err) => {
          equal(err.exitCode, 9, `${testNumber}.02`);
        });
    }

    equal(
      readFileSync(path.join(tempFolder, "sortme.json"), "utf8"),
      sortedFile,
      `${testNumber}.03`,
    );
  });
});

// UNSORTED

test("13 - one unsorted file", async () => {
  let unsortedFile = '{\n  "z": 1,\n  "a": 2\n}\n';

  let tempFolder = temporaryDirectory();
  // const tempFolder = "temp";
  mkdirSync(path.resolve(tempFolder), { recursive: true });
  writeFileSync(path.join(tempFolder, "sortme.json"), unsortedFile);

  await execa("./cli.js", [tempFolder, "-c"])
    .then(() => {
      // this clause should never be reached
      not.ok("execa should have exited with non-zero code");
    })
    .catch((err) => {
      equal(err.exitCode, 9, "13.01");
    });

  equal(
    readFileSync(path.join(tempFolder, "sortme.json"), "utf8"),
    unsortedFile,
    "13.02",
  );
});

test("14 - 'dry' flag trumps 'ci' flag", async () => {
  let unsortedFile = '{\n  "z": 1,\n  "a": 2\n}\n';

  let tempFolder = temporaryDirectory();
  // const tempFolder = "temp";
  mkdirSync(path.resolve(tempFolder), { recursive: true });
  writeFileSync(path.join(tempFolder, "sortme.json"), unsortedFile);

  let output = await execa("./cli.js", [tempFolder, "-c", "-d"]).catch(
    (err) => {
      throw new Error(err);
    },
  );

  match(output.stdout, /try to sort/, "14.01");
  equal(output.exitCode, 0, "14.01");
  equal(
    readFileSync(path.join(tempFolder, "sortme.json"), "utf8"),
    unsortedFile,
    "14.02",
  );
});

test("15 - 'dry', arg order is backwards", async () => {
  let unsortedFile = '{\n  "z": 1,\n  "a": 2\n}\n';

  let tempFolder = temporaryDirectory();
  // const tempFolder = "temp";
  mkdirSync(path.resolve(tempFolder), { recursive: true });
  writeFileSync(path.join(tempFolder, "sortme.json"), unsortedFile);

  let output = await execa("./cli.js", ["-d", tempFolder]).catch((err) => {
    throw new Error(err);
  });

  match(output.stdout, /try to sort/, "15.01");
  equal(output.exitCode, 0, "15.01");
  equal(
    readFileSync(path.join(tempFolder, "sortme.json"), "utf8"),
    unsortedFile,
    "15.02",
  );
});

test("16 - errors out when unsorted array within json, --ci & --arrays flags", async () => {
  let tempFolder = temporaryDirectory();
  // const tempFolder = "temp";
  mkdirSync(path.resolve(tempFolder), { recursive: true });
  let pathOfTheTestfile = path.join(tempFolder, "sortme.json");

  writeFileSync(
    pathOfTheTestfile,
    `{
  "keywords": [
    "utility",
    "app",
    "cli"
  ]
}`,
  );

  let output = await execa("./cli.js", [tempFolder, "--ci", "--arrays"])
    .then(() => {
      // this line should never be reached
      not.ok("execa didn't exit with the non-zero code");
    })
    .catch((err) => err);
  await execaCommand(`rm -rf ${tempFolder}`).catch((err) => {
    throw new Error(err);
  });

  equal(output.exitCode, 9, "16.01");
  match(output.stdout, /Unsorted files:/, "16.02");
});

test("17 - unsorted array within json, --ci flag", async () => {
  let tempFolder = temporaryDirectory();
  // const tempFolder = "temp";
  mkdirSync(path.resolve(tempFolder), { recursive: true });
  let pathOfTheTestfile = path.join(tempFolder, "sortme.json");

  writeFileSync(
    pathOfTheTestfile,
    `{
  "keywords": [
    "utility",
    "app",
    "cli"
  ]
}`,
  );

  let output = await execa("./cli.js", [tempFolder, "--ci"]).catch((err) => {
    throw new Error(err);
  });
  await execaCommand(`rm -rf ${tempFolder}`).catch((err) => {
    throw new Error(err);
  });

  equal(output.exitCode, 0, "17.01");
  match(output.stdout, /All files were already sorted/, "17.02");
});

test("18 - sorted nested plain object, --ci flag", async () => {
  let tempFolder = temporaryDirectory();
  // const tempFolder = "temp";
  mkdirSync(path.resolve(tempFolder), { recursive: true });
  let pathOfTheTestfile = path.join(tempFolder, "sortme.json");

  writeFileSync(
    pathOfTheTestfile,
    `{
  "a": {
    "b": "c",
    "d": "e"
  }
}`,
  );

  let output = await execa("./cli.js", [tempFolder, "--ci"]).catch((err) => {
    throw new Error(err);
  });
  await execaCommand(`rm -rf ${tempFolder}`).catch((err) => {
    throw new Error(err);
  });

  equal(output.exitCode, 0, "18.01");
  match(output.stdout, /All files were already sorted/, "18.02");
});

test("19 - unsorted nested plain object, --ci flag", async () => {
  let tempFolder = temporaryDirectory();
  // const tempFolder = "temp";
  mkdirSync(path.resolve(tempFolder), { recursive: true });
  let pathOfTheTestfile = path.join(tempFolder, "sortme.json");

  writeFileSync(
    pathOfTheTestfile,
    `{
  "a": {
    "d": "e",
    "b": "c"
  }
}`,
  );

  let output = await execa("./cli.js", [tempFolder, "--ci"])
    .then(() => {
      // this line should never be reached
      not.ok("execa didn't exit with the non-zero code");
    })
    .catch((err) => err);
  // await execaCommand(`rm -rf ${tempFolder}`).catch((err) => {throw new Error(err)});

  equal(output.exitCode, 9, "19.01");
  match(output.stdout, /Unsorted files/, "19.02");
  match(output.stdout, /sortme\.json/, "19.03");
});

test("20 - but requested copious tabs, --ci flag", async () => {
  let tempFolder = temporaryDirectory();
  // const tempFolder = "temp";
  mkdirSync(path.resolve(tempFolder), { recursive: true });
  let pathOfTheTestfile = path.join(tempFolder, "sortme.json");

  writeFileSync(
    pathOfTheTestfile,
    `{
  "a": {
    "b": "c",
    "d": "e"
  }
}`,
  );

  let output = await execa("./cli.js", [tempFolder, "-c", "-t", "-i 3"])
    .then(() => {
      // this line should never be reached
      not.ok("execa didn't exit with the non-zero code");
    })
    .catch((err) => err);
  // await execaCommand(`rm -rf ${tempFolder}`).catch((err) => {throw new Error(err)});

  equal(output.exitCode, 9, "20.01");
  match(output.stdout, /Unsorted files/, "20.02");
  match(output.stdout, /sortme\.json/, "20.03");
});

test.run();
