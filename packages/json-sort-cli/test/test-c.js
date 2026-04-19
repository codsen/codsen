// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import path from "node:path";
import { execa, execaCommand } from "execa";
import fs from "fs-extra";
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
  test(`01 - one sorted file, LF, --lineEnding === ${JSON.stringify(
    ciLFlag,
    null,
    0,
  )}`, async () => {
    let sortedFile = '{\n  "a": 1,\n  "z": 2\n}\n';
    // prove the file is of the right format, LF
    ok(sortedFile.includes("\n"), "01.01");
    not.ok(sortedFile.includes("\r"), "01.03"); // <-- covers CRLF too

    let tempFolder = temporaryDirectory();
    // const tempFolder = "temp";
    fs.ensureDirSync(path.resolve(tempFolder));
    fs.writeFileSync(path.join(tempFolder, "sortme.json"), sortedFile);

    if (ciLFlagIdx < 2) {
      // happy path cases, LF will be good
      let output = await execa("./cli.js", [
        tempFolder,
        "-c",
        ...ciLFlag,
      ]).catch((err) => {
        throw new Error(err);
      });
      equal(output.exitCode, 0, "01.01");
    } else {
      // should throw, so we need to catch
      await execa("./cli.js", [tempFolder, "-c", ...ciLFlag])
        .then(() => {
          // this clause should never be reached
          not.ok("execa should have exited with non-zero code");
        })
        .catch((err) => {
          equal(err.exitCode, 9, "01.02");
        });
    }

    equal(
      fs.readFileSync(path.join(tempFolder, "sortme.json"), "utf8"),
      sortedFile,
      "01.03",
    );
  });
});

[
  [], // no -l flag
  ["-l", "crlf"],
  ["-l", "lf"],
  ["-l", "cr"],
].forEach((ciLFlag, ciLFlagIdx) => {
  test(`02 - one sorted file, CRLF, --lineEnding === ${JSON.stringify(
    ciLFlag,
    null,
    0,
  )}`, async () => {
    let sortedFile = '{\r\n  "a": 1,\r\n  "z": 2\r\n}\r\n';
    // prove the file is of the right format, CRLF
    ok(sortedFile.includes("\r\n"), "02.01");

    let tempFolder = temporaryDirectory();
    // const tempFolder = "temp";
    fs.ensureDirSync(path.resolve(tempFolder));
    fs.writeFileSync(path.join(tempFolder, "sortme.json"), sortedFile);

    if (ciLFlagIdx < 2) {
      // happy-path cases, CRLF
      let output = await execa("./cli.js", [
        tempFolder,
        "-c",
        ...ciLFlag,
      ]).catch((err) => {
        throw new Error(err);
      });
      equal(output.exitCode, 0, "02.01");
    } else {
      // should throw, so we need to catch
      await execa("./cli.js", [tempFolder, "-c", ...ciLFlag])
        .then(() => {
          // this clause should never be reached
          not.ok("execa should have exited with non-zero code");
        })
        .catch((err) => {
          equal(err.exitCode, 9, "02.02");
        });
    }

    equal(
      fs.readFileSync(path.join(tempFolder, "sortme.json"), "utf8"),
      sortedFile,
      "02.03",
    );
  });
});

[
  [], // no -l flag
  ["-l", "cr"],
  ["-l", "crlf"],
  ["-l", "lf"],
].forEach((ciLFlag, ciLFlagIdx) => {
  test(`03 - one sorted file, CR, --lineEnding === ${JSON.stringify(
    ciLFlag,
    null,
    0,
  )}`, async () => {
    let sortedFile = '{\r  "a": 1,\r  "z": 2\r}\r';
    // prove the file is of the right format, CR
    ok(sortedFile.includes("\r"), "03.01");
    not.ok(sortedFile.includes("\n"), "01.03"); // <-- covers CRLF too

    let tempFolder = temporaryDirectory();
    // const tempFolder = "temp";
    fs.ensureDirSync(path.resolve(tempFolder));
    fs.writeFileSync(path.join(tempFolder, "sortme.json"), sortedFile);

    if (ciLFlagIdx < 2) {
      let output = await execa("./cli.js", [
        tempFolder,
        "-c",
        ...ciLFlag,
      ]).catch((err) => {
        throw new Error(err);
      });
      equal(output.exitCode, 0, "03.01");
    } else {
      // should throw, so we need to catch
      await execa("./cli.js", [tempFolder, "-c", ...ciLFlag])
        .then(() => {
          // this clause should never be reached
          not.ok("execa should have exited with non-zero code");
        })
        .catch((err) => {
          equal(err.exitCode, 9, "03.02");
        });
    }

    equal(
      fs.readFileSync(path.join(tempFolder, "sortme.json"), "utf8"),
      sortedFile,
      "03.03",
    );
  });
});

// UNSORTED

test("04 - one unsorted file", async () => {
  let unsortedFile = '{\n  "z": 1,\n  "a": 2\n}\n';

  let tempFolder = temporaryDirectory();
  // const tempFolder = "temp";
  fs.ensureDirSync(path.resolve(tempFolder));
  fs.writeFileSync(path.join(tempFolder, "sortme.json"), unsortedFile);

  await execa("./cli.js", [tempFolder, "-c"])
    .then(() => {
      // this clause should never be reached
      not.ok("execa should have exited with non-zero code");
    })
    .catch((err) => {
      equal(err.exitCode, 9, "04.01 - 02");
    });

  equal(
    fs.readFileSync(path.join(tempFolder, "sortme.json"), "utf8"),
    unsortedFile,
    "04.02",
  );
});

test("05 - 'dry' flag trumps 'ci' flag", async () => {
  let unsortedFile = '{\n  "z": 1,\n  "a": 2\n}\n';

  let tempFolder = temporaryDirectory();
  // const tempFolder = "temp";
  fs.ensureDirSync(path.resolve(tempFolder));
  fs.writeFileSync(path.join(tempFolder, "sortme.json"), unsortedFile);

  let output = await execa("./cli.js", [tempFolder, "-c", "-d"]).catch(
    (err) => {
      throw new Error(err);
    },
  );

  match(output.stdout, /try to sort/, "05.01");
  equal(output.exitCode, 0, "05.01");
  equal(
    fs.readFileSync(path.join(tempFolder, "sortme.json"), "utf8"),
    unsortedFile,
    "05.02",
  );
});

test("06 - 'dry', arg order is backwards", async () => {
  let unsortedFile = '{\n  "z": 1,\n  "a": 2\n}\n';

  let tempFolder = temporaryDirectory();
  // const tempFolder = "temp";
  fs.ensureDirSync(path.resolve(tempFolder));
  fs.writeFileSync(path.join(tempFolder, "sortme.json"), unsortedFile);

  let output = await execa("./cli.js", ["-d", tempFolder]).catch((err) => {
    throw new Error(err);
  });

  match(output.stdout, /try to sort/, "06.01");
  equal(output.exitCode, 0, "06.01");
  equal(
    fs.readFileSync(path.join(tempFolder, "sortme.json"), "utf8"),
    unsortedFile,
    "06.02",
  );
});

test("07 - errors out when unsorted array within json, --ci & --arrays flags", async () => {
  let tempFolder = temporaryDirectory();
  // const tempFolder = "temp";
  fs.ensureDirSync(path.resolve(tempFolder));
  let pathOfTheTestfile = path.join(tempFolder, "sortme.json");

  fs.writeFileSync(
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

  equal(output.exitCode, 9, "07.01");
  match(output.stdout, /Unsorted files:/, "07.02");
});

test("08 - unsorted array within json, --ci flag", async () => {
  let tempFolder = temporaryDirectory();
  // const tempFolder = "temp";
  fs.ensureDirSync(path.resolve(tempFolder));
  let pathOfTheTestfile = path.join(tempFolder, "sortme.json");

  fs.writeFileSync(
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

  equal(output.exitCode, 0, "08.01");
  match(output.stdout, /All files were already sorted/, "08.02");
});

test("09 - sorted nested plain object, --ci flag", async () => {
  let tempFolder = temporaryDirectory();
  // const tempFolder = "temp";
  fs.ensureDirSync(path.resolve(tempFolder));
  let pathOfTheTestfile = path.join(tempFolder, "sortme.json");

  fs.writeFileSync(
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

  equal(output.exitCode, 0, "09.01");
  match(output.stdout, /All files were already sorted/, "09.02");
});

test("10 - unsorted nested plain object, --ci flag", async () => {
  let tempFolder = temporaryDirectory();
  // const tempFolder = "temp";
  fs.ensureDirSync(path.resolve(tempFolder));
  let pathOfTheTestfile = path.join(tempFolder, "sortme.json");

  fs.writeFileSync(
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

  equal(output.exitCode, 9, "10.01");
  match(output.stdout, /Unsorted files/, "10.02");
  match(output.stdout, /sortme\.json/, "10.03");
});

test("11 - but requested copious tabs, --ci flag", async () => {
  let tempFolder = temporaryDirectory();
  // const tempFolder = "temp";
  fs.ensureDirSync(path.resolve(tempFolder));
  let pathOfTheTestfile = path.join(tempFolder, "sortme.json");

  fs.writeFileSync(
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

  equal(output.exitCode, 9, "11.01");
  match(output.stdout, /Unsorted files/, "11.02");
  match(output.stdout, /sortme\.json/, "11.03");
});

test.run();
