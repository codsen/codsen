import fs from "fs-extra";
import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import path from "path";
import { fileURLToPath } from "url";
import { execa, execaCommand } from "execa";
import { temporaryDirectory } from "tempy";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const aPackageJson = `{
  "name": "a",
  "main": "dist/a.cjs.js",
  "module": "dist/a.esm.js",
  "browser": "dist/a.umd.js"
}`;

const bPackageJson = `{
  "name": "b",
  "version": "1.0.0",
  "main": "dist/b.cjs.js",
  "module": "dist/b.esm.js",
  "browser": "dist/b.umd.js"
}`;

const cPackageJson = `{
  "name": "c",
  "version": "2.0.0",
  "bin": {
    "launchc": "cli.js",
    "claunch": "cli.js"
  }
}`;

//                                  *
//                                  *
//                                  *
//                                  *
//                                  *
//
//                                01.01
//
//                                  *
//                                  *
//                                  *
//                                  *
//                                  *

test(`01 - ${`\u001b[${35}m${"errors"}\u001b[${39}m`} - requested package does not exist (ERROR_01)`, async () => {
  // Re-route the test files into `temp/` folder instead for easier access when
  // troubleshooting. Just comment out one of two:
  // const tempFolder = "temp";
  let tempFolder = temporaryDirectory();
  fs.ensureDirSync(path.resolve(tempFolder));
  fs.ensureDirSync(path.resolve(tempFolder, "a", "node_modules"));
  fs.ensureDirSync(path.resolve(tempFolder, "b", "node_modules"));

  //

  let cleanupMsg = await fs
    .writeFile(path.join(tempFolder, "a", "package.json"), aPackageJson)
    .then(() =>
      fs.writeFile(path.join(tempFolder, "b", "package.json"), bPackageJson),
    )
    .then(() =>
      execa(
        `cd ${path.resolve(path.join(tempFolder, "a"))} && ${path.join(
          __dirname,
          "../",
          "cli.js",
        )} oodles`, // requesting to link monorepo package "oodles"
        {
          shell: true,
        },
      ),
    )
    .then((execasMsg) => {
      match(execasMsg.stdout, /ERROR_01/, "01.01.01");
      match(execasMsg.stdout, /not found!/, "01.01.02");
    })
    .then(() =>
      execaCommand(`rm -rf ${tempFolder}`, {
        shell: true,
      }),
    );

  equal(cleanupMsg.exitCode, 0, "01.01");
});

//                                  *
//                                  *
//                                  *
//                                  *
//                                  *
//
//                                01.02
//
//                                  *
//                                  *
//                                  *
//                                  *
//                                  *

test(`02 - ${`\u001b[${35}m${"errors"}\u001b[${39}m`} - couldn't read a's package.json (ERROR_02)`, async () => {
  // Re-route the test files into `temp/` folder instead for easier access when
  // troubleshooting. Just comment out one of two:
  // const tempFolder = "temp";
  let tempFolder = temporaryDirectory();
  fs.ensureDirSync(path.resolve(tempFolder));
  fs.ensureDirSync(path.resolve(tempFolder, "a", "node_modules"));
  fs.ensureDirSync(path.resolve(tempFolder, "b", "node_modules"));

  //

  let cleanupMsg = await fs
    .writeFile(path.join(tempFolder, "b", "package.json"), bPackageJson)
    .then(() =>
      execa(
        `cd ${path.resolve(path.join(tempFolder, "a"))} && ${path.join(
          __dirname,
          "../",
          "cli.js",
        )} b`,
        {
          shell: true,
        },
      ),
    )
    .then((execasMsg) => {
      match(execasMsg.stdout, /ERROR_02/, "01.02.01");
      match(execasMsg.stdout, /package.json/, "01.02.02");
      match(execasMsg.stdout, /doesn't exist/, "01.02.03");
    })
    .then(() =>
      execaCommand(`rm -rf ${tempFolder}`, {
        shell: true,
      }),
    );

  equal(cleanupMsg.exitCode, 0, "02.01");
});

//                                  *
//                                  *
//                                  *
//                                  *
//                                  *
//
//                                01.03
//
//                                  *
//                                  *
//                                  *
//                                  *
//                                  *

test(`03 - ${`\u001b[${35}m${"errors"}\u001b[${39}m`} - couldn't read b's package.json (ERROR_03)`, async () => {
  // Re-route the test files into `temp/` folder instead for easier access when
  // troubleshooting. Just comment out one of two:
  // const tempFolder = "temp";
  let tempFolder = temporaryDirectory();
  fs.ensureDirSync(path.resolve(tempFolder));
  fs.ensureDirSync(path.resolve(tempFolder, "a", "node_modules"));
  fs.ensureDirSync(path.resolve(tempFolder, "b", "node_modules"));

  //

  let cleanupMsg = await fs
    .writeFile(path.join(tempFolder, "a", "package.json"), aPackageJson)
    .then(() =>
      execa(
        `cd ${path.resolve(path.join(tempFolder, "a"))} && ${path.join(
          __dirname,
          "../",
          "cli.js",
        )} b`,
        {
          shell: true,
        },
      ),
    )
    .then((execasMsg) => {
      match(execasMsg.stdout, /ERROR_03/, "01.03.01");
      match(execasMsg.stdout, /package.json/, "01.03.02");
      match(execasMsg.stdout, /doesn't exist/, "01.03.03");
    })
    .then(() =>
      execaCommand(`rm -rf ${tempFolder}`, {
        shell: true,
      }),
    );

  equal(cleanupMsg.exitCode, 0, "03.01");
});

//                                  *
//                                  *
//                                  *
//                                  *
//                                  *
//
//                                01.04
//
//                                  *
//                                  *
//                                  *
//                                  *
//                                  *

test(`04 - ${`\u001b[${35}m${"errors"}\u001b[${39}m`} - normal dep, symlink already exists (ERROR_04)`, async () => {
  // Re-route the test files into `temp/` folder instead for easier access when
  // troubleshooting. Just comment out one of two:
  // const tempFolder = "temp";
  let tempFolder = temporaryDirectory();
  fs.ensureDirSync(path.resolve(tempFolder));
  fs.ensureDirSync(path.resolve(tempFolder, "a", "node_modules"));
  fs.ensureDirSync(path.resolve(tempFolder, "b", "node_modules"));

  //

  let cleanupMsg = await fs
    .writeFile(path.join(tempFolder, "a", "package.json"), aPackageJson)
    .then(() =>
      fs.writeFile(path.join(tempFolder, "b", "package.json"), bPackageJson),
    )
    .then(() =>
      execa(
        `ln -s ${path.resolve(path.join(tempFolder, "b"))} ${path.resolve(
          path.join(tempFolder, "a", "node_modules", "b"),
        )}`,
        {
          shell: true,
        },
      ),
    )
    .then(() =>
      execa(
        `cd ${path.resolve(path.join(tempFolder, "a"))} && ${path.join(
          __dirname,
          "../",
          "cli.js",
        )} b`, // requesting to link monorepo package "b"
        {
          shell: true,
        },
      ),
    )
    .then((execasMsg) => {
      match(execasMsg.stdout, /ERROR_05/, "01.04.01");
      match(execasMsg.stdout, /symlink already exists/, "01.04.02");
    })
    .then(() =>
      execaCommand(`rm -rf ${tempFolder}`, {
        shell: true,
      }),
    );

  equal(cleanupMsg.exitCode, 0, "04.01");
});

//                                  *
//                                  *
//                                  *
//                                  *
//                                  *
//
//                                01.05
//
//                                  *
//                                  *
//                                  *
//                                  *
//                                  *

test(`05 - ${`\u001b[${35}m${"errors"}\u001b[${39}m`} - error while trying to parse package.json (ERROR_06)`, async () => {
  // Re-route the test files into `temp/` folder instead for easier access when
  // troubleshooting. Just comment out one of two:
  // const tempFolder = "temp";
  let tempFolder = temporaryDirectory();
  fs.ensureDirSync(path.resolve(tempFolder));
  fs.ensureDirSync(path.resolve(tempFolder, "a", "node_modules"));
  fs.ensureDirSync(path.resolve(tempFolder, "b", "node_modules"));

  //

  let cleanupMsg = await fs
    .writeFile(path.join(tempFolder, "a", "package.json"), aPackageJson)
    .then(() =>
      fs.writeFile(path.join(tempFolder, "b", "package.json"), "{{{{{"),
    )
    .then(() =>
      execa(
        `cd ${path.resolve(path.join(tempFolder, "a"))} && ${path.join(
          __dirname,
          "../",
          "cli.js",
        )} b`,
        {
          shell: true,
        },
      ),
    )
    .then((execasMsg) => {
      match(execasMsg.stdout, /ERROR_06/, "01.05.01");
      match(execasMsg.stdout, /package.json/, "01.05.02");
      match(
        execasMsg.stdout,
        /Something went wrong trying to read/,
        "01.05.03",
      );
    })
    .then(() =>
      execaCommand(`rm -rf ${tempFolder}`, {
        shell: true,
      }),
    );

  equal(cleanupMsg.exitCode, 0, "05.01");
});

//                                  *
//                                  *
//                                  *
//                                  *
//                                  *
//
//                                01.06
//
//                                  *
//                                  *
//                                  *
//                                  *
//                                  *

test(`06 - ${`\u001b[${35}m${"errors"}\u001b[${39}m`} - dep is a CLI, one of symlinks already exists (ERROR_08)`, async () => {
  // Re-route the test files into `temp/` folder instead for easier access when
  // troubleshooting. Just comment out one of two:
  // const tempFolder = "temp";
  let tempFolder = temporaryDirectory();
  fs.ensureDirSync(path.resolve(tempFolder));
  fs.ensureDirSync(path.resolve(tempFolder, "a", "node_modules/.bin/"));
  fs.ensureDirSync(path.resolve(tempFolder, "c", "node_modules"));

  //

  let cleanupMsg = await fs
    .writeFile(path.join(tempFolder, "a", "package.json"), aPackageJson)
    .then(() =>
      fs.writeFile(path.join(tempFolder, "c", "package.json"), cPackageJson),
    )
    .then(() =>
      fs.writeFile(path.join(tempFolder, "c", "cli.js"), "this is c's cli.js"),
    )
    .then(() =>
      execa(
        `ln -s ${path.resolve(
          path.join(tempFolder, "c", "cli.js"),
        )} ${path.resolve(
          path.join(tempFolder, "a", "node_modules", ".bin", "launchc"),
        )}`,
        {
          shell: true,
        },
      ),
    )
    .then(() =>
      execa(
        `cd ${path.resolve(path.join(tempFolder, "a"))} && ${path.join(
          __dirname,
          "../",
        )}/cli.js c`, // requesting to link monorepo package "b"
        {
          shell: true,
        },
      ),
    )
    .then((execasMsg) => {
      match(execasMsg.stdout, /ERROR_08/, "01.06.01");
      match(execasMsg.stdout, /launchc already exists/, "01.06.02");
      match(execasMsg.stdout, /Success!/, "01.06.03");
      match(execasMsg.stdout, /was linked/, "01.06.04");
    })
    .then(() =>
      execaCommand(`rm -rf ${tempFolder}`, {
        shell: true,
      }),
    );

  equal(cleanupMsg.exitCode, 0, "06.01");
});

//                                  *
//                                  *
//                                  *
//                                  *
//                                  *
//
//                                01.07
//
//                                  *
//                                  *
//                                  *
//                                  *
//                                  *

test(`07 - ${`\u001b[${35}m${"errors"}\u001b[${39}m`} - package.json had no main/module/browser/bin fields (ERROR_10)`, async () => {
  // Re-route the test files into `temp/` folder instead for easier access when
  // troubleshooting. Just comment out one of two:
  // const tempFolder = "temp";
  let tempFolder = temporaryDirectory();
  fs.ensureDirSync(path.resolve(tempFolder));
  fs.ensureDirSync(path.resolve(tempFolder, "a", "node_modules/.bin/"));
  fs.ensureDirSync(path.resolve(tempFolder, "b", "node_modules"));

  //

  let cleanupMsg = await fs
    .writeFile(path.join(tempFolder, "a", "package.json"), aPackageJson)
    .then(() =>
      fs.writeFile(
        path.join(tempFolder, "b", "package.json"),
        '{"tralla": true}',
      ),
    )
    .then(() =>
      execa(
        `cd ${path.resolve(path.join(tempFolder, "a"))} && ${path.join(
          __dirname,
          "../",
          "cli.js",
        )} b`,
        {
          shell: true,
        },
      ),
    )
    .then((execasMsg) => {
      match(execasMsg.stdout, /ERROR_10/, "01.07.01");
      match(execasMsg.stdout, /package.json/, "01.07.02");
      match(execasMsg.stdout, /didn't have any of the keys/, "01.07.03");
    })
    .then(() =>
      execaCommand(`rm -rf ${tempFolder}`, {
        shell: true,
      }),
    );

  equal(cleanupMsg.exitCode, 0, "07.01");
});

//                                  *
//                                  *
//                                  *
//                                  *
//                                  *
//
//                                02.01
//
//                                  *
//                                  *
//                                  *
//                                  *
//                                  *

test(`08 - ${`\u001b[${33}m${"main functionality"}\u001b[${39}m`} - links normal deps`, async () => {
  // Re-route the test files into `temp/` folder instead for easier access when
  // troubleshooting. Just comment out one of two:
  // const tempFolder = "temp";
  let tempFolder = temporaryDirectory();
  fs.ensureDirSync(path.resolve(tempFolder));
  fs.ensureDirSync(path.resolve(tempFolder, "a", "node_modules"));
  fs.ensureDirSync(path.resolve(tempFolder, "b", "node_modules"));

  //

  let cleanupMsg = await fs
    .writeFile(path.join(tempFolder, "a", "package.json"), aPackageJson)
    .then(() =>
      fs.writeFile(path.join(tempFolder, "b", "package.json"), bPackageJson),
    )
    .then(() =>
      execa(
        `cd ${path.resolve(path.join(tempFolder, "a"))} && ${path.join(
          __dirname,
          "../",
          "cli.js",
        )} b`,
        {
          shell: true,
        },
      ),
    )
    .then((execasMsg) => {
      match(execasMsg.stdout, /Success/, "02.01.01");
      match(execasMsg.stdout, /b/, "02.01.02");
      match(execasMsg.stdout, /linked!/, "02.01.03");
    })
    .then(() => fs.readJson(path.join(tempFolder, "a", "package.json")))
    .then((packageContents) => {
      equal(packageContents.dependencies.b, "^1.0.0", "02.01.04");
    })
    .then(() =>
      execaCommand(`rm -rf ${tempFolder}`, {
        shell: true,
      }),
    );

  equal(cleanupMsg.exitCode, 0, "08.01");
});

test(`09 - ${`\u001b[${33}m${"main functionality"}\u001b[${39}m`} - links CLI deps`, async () => {
  // Re-route the test files into `temp/` folder instead for easier access when
  // troubleshooting. Just comment out one of two:
  // const tempFolder = "temp";
  let tempFolder = temporaryDirectory();
  fs.ensureDirSync(path.resolve(tempFolder));
  fs.ensureDirSync(path.resolve(tempFolder, "a", "node_modules/.bin/"));
  fs.ensureDirSync(path.resolve(tempFolder, "c", "node_modules"));

  //

  let cleanupMsg = await fs
    .writeFile(path.join(tempFolder, "a", "package.json"), aPackageJson)
    .then(() =>
      fs.writeFile(path.join(tempFolder, "c", "cli.js"), "this is c's cli.js"),
    )
    .then(() =>
      fs.writeFile(path.join(tempFolder, "c", "package.json"), cPackageJson),
    )
    .then(() =>
      execa(
        `cd ${path.resolve(path.join(tempFolder, "a"))} && ${path.join(
          __dirname,
          "../",
          "cli.js",
        )} c`,
        {
          shell: true,
        },
      ),
    )
    .then((execasMsg) => {
      match(execasMsg.stdout, /Success/, "02.02.01");
      match(execasMsg.stdout, /claunch/, "02.02.02");
      match(execasMsg.stdout, /launchc/, "02.02.03");
      match(execasMsg.stdout, /linked!/, "02.02.04");
    })
    .then(() => fs.readJson(path.join(tempFolder, "a", "package.json"), "utf8"))
    .then((packageContents) => {
      equal(packageContents.dependencies.c, "^2.0.0", "02.02.05");
    })
    .then(() =>
      execaCommand(`rm -rf ${tempFolder}`, {
        shell: true,
      }),
    );

  equal(cleanupMsg.exitCode, 0, "09.01");
});

test(`10 - ${`\u001b[${33}m${"main functionality"}\u001b[${39}m`} - links normal deps, adds them as devDependencies, -d flag`, async () => {
  // Re-route the test files into `temp/` folder instead for easier access when
  // troubleshooting. Just comment out one of two:
  // const tempFolder = "temp";
  let tempFolder = temporaryDirectory();
  fs.ensureDirSync(path.resolve(tempFolder));
  fs.ensureDirSync(path.resolve(tempFolder, "a", "node_modules"));
  fs.ensureDirSync(path.resolve(tempFolder, "b", "node_modules"));

  //

  let cleanupMsg = await fs
    .writeFile(path.join(tempFolder, "a", "package.json"), aPackageJson)
    .then(() =>
      fs.writeFile(path.join(tempFolder, "b", "package.json"), bPackageJson),
    )
    .then(() =>
      execa(
        `cd ${path.resolve(path.join(tempFolder, "a"))} && ${path.join(
          __dirname,
          "../",
          "cli.js",
        )} b -d`,
        {
          shell: true,
        },
      ),
    )
    .then((execasMsg) => {
      match(execasMsg.stdout, /Success/, "02.03.01");
      match(execasMsg.stdout, /b/, "02.03.02");
      match(execasMsg.stdout, /linked!/, "02.03.03");
    })
    .then(() => fs.readJson(path.join(tempFolder, "a", "package.json")))
    .then((packageContents) => {
      equal(packageContents.dependencies, undefined, "02.03.04");
      equal(packageContents.devDependencies.b, "^1.0.0", "02.03.05");
    })
    .then(() =>
      execaCommand(`rm -rf ${tempFolder}`, {
        shell: true,
      }),
    );

  equal(cleanupMsg.exitCode, 0, "10.01");
});

test(`11 - ${`\u001b[${33}m${"main functionality"}\u001b[${39}m`} - links normal deps, adds them as devDependencies, --dev flag`, async () => {
  // Re-route the test files into `temp/` folder instead for easier access when
  // troubleshooting. Just comment out one of two:
  // const tempFolder = "temp";
  let tempFolder = temporaryDirectory();
  fs.ensureDirSync(path.resolve(tempFolder));
  fs.ensureDirSync(path.resolve(tempFolder, "a", "node_modules"));
  fs.ensureDirSync(path.resolve(tempFolder, "b", "node_modules"));

  //

  let cleanupMsg = await fs
    .writeFile(path.join(tempFolder, "a", "package.json"), aPackageJson)
    .then(() =>
      fs.writeFile(path.join(tempFolder, "b", "package.json"), bPackageJson),
    )
    .then(() =>
      execa(
        `cd ${path.resolve(path.join(tempFolder, "a"))} && ${path.join(
          __dirname,
          "../",
          "cli.js",
        )} b --dev`,
        {
          shell: true,
        },
      ),
    )
    .then((execasMsg) => {
      match(execasMsg.stdout, /Success/, "02.04.01");
      match(execasMsg.stdout, /b/, "02.04.02");
      match(execasMsg.stdout, /linked!/, "02.04.03");
    })
    .then(() => fs.readJson(path.join(tempFolder, "a", "package.json")))
    .then((packageContents) => {
      equal(packageContents.dependencies, undefined, "02.04.04");
      equal(packageContents.devDependencies.b, "^1.0.0", "02.04.05");
    })
    .then(() =>
      execaCommand(`rm -rf ${tempFolder}`, {
        shell: true,
      }),
    );

  equal(cleanupMsg.exitCode, 0, "11.01");
});

test.run();
