import { promises } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execa } from "execa";
import { temporaryDirectoryTask } from "tempy";
import { test } from "uvu";
import { equal, match, not, ok } from "uvu/assert";
import { UpdateVersionsError, updateVersions } from "../cli.js";
import { major, updatedDependencySpec } from "../dependency-spec.js";

const cliUrl = new URL("../cli.js", import.meta.url);
const cliPath = fileURLToPath(cliUrl);

function childOptions(cwd) {
  let env = { ...process.env, NO_UPDATE_NOTIFIER: "1" };
  delete env.FORCE_COLOR;
  delete env.NO_COLOR;
  return { cwd, env, extendEnv: false, timeout: 10000 };
}

async function writeJson(filename, value) {
  await promises.writeFile(filename, JSON.stringify(value, null, 2));
}

async function captureFailure(options) {
  try {
    await updateVersions(options);
  } catch (error) {
    return error;
  }
  throw new Error("Expected updateVersions to reject");
}

async function runScript(cwd, script) {
  return execa(
    process.execPath,
    ["--input-type=module", "--eval", script],
    childOptions(cwd),
  );
}

test("01 - dependency helpers preserve path and non-version selectors", () => {
  for (let current of ["workspace:../sibling", "workspace:./vendor"]) {
    let parsed = { kind: "workspace-path" };
    equal(updatedDependencySpec(parsed, current, "2.0.0"), current, "01.01");
  }
  let current = "workspace:next";
  let parsed = { kind: "workspace-selector", selector: "next" };
  equal(updatedDependencySpec(parsed, current, "2.0.0"), current, "01.02");
  equal(major("workspace:^12.3.4"), "12", "01.03");
  equal(major("latest"), "latest", "01.04");
  equal(major(null), null, "01.05");
  equal(major(12), 12, "01.06");
});

test("02 - discovery failures preserve non-Error causes", async () => {
  await temporaryDirectoryTask(async (cwd) => {
    let error = await captureFailure({
      cwd,
      effects: {
        findPackageJsons: async () => {
          throw "injected discovery failure";
        },
      },
    });
    ok(error instanceof UpdateVersionsError);
    equal(error.errors[0].phase, "package discovery", "02.01");
    equal(error.errors[0].path, cwd, "02.02");
    equal(error.errors[0].cause, "injected discovery failure", "02.03");
    match(error.message, /Nothing was written/);
  });
});

test("03 - unusable registry metadata cannot trigger writes", async () => {
  await temporaryDirectoryTask(async (cwd) => {
    let filename = path.join(cwd, "package.json");
    let original = JSON.stringify({ dependencies: { alpha: "^1.0.0" } });
    await promises.writeFile(filename, original);
    for (let metadata of [null, {}, { version: 123 }, { version: "" }]) {
      let error = await captureFailure({
        cwd,
        fetchPackage: async () => metadata,
      });
      equal(error.errors[0].phase, "registry lookup", "03.01");
      match(error.errors[0].message, /alpha returned no version/);
      equal(await promises.readFile(filename, "utf8"), original, "03.02");
    }
  });
});

test("04 - dependency cleanup retains unrelated lect entries and file specs", async () => {
  await temporaryDirectoryTask(async (cwd) => {
    let filename = path.join(cwd, "package.json");
    await writeJson(filename, {
      name: "fixture",
      dependencies: { alpha: "file:../alpha", beta: "^1.0.0" },
      devDependencies: { gamma: "file:./gamma" },
      lect: { various: { devDependencies: ["unrelated", "alpha", "other"] } },
    });
    let updated = await updateVersions({
      cwd,
      fetchPackage: async (name) => ({ name, version: "2.0.0" }),
    });
    let received = JSON.parse(await promises.readFile(filename, "utf8"));
    equal(
      received.lect.various.devDependencies,
      ["unrelated", "other"],
      "04.01",
    );
    equal(
      received.dependencies,
      { alpha: "file:../alpha", beta: "^2.0.0" },
      "04.02",
    );
    equal(received.devDependencies, { gamma: "file:./gamma" }, "04.03");
    equal(updated, { beta: "2.0.0" }, "04.04");
  });
});

test("05 - atomic writes recreate a file removed after inventory", async () => {
  await temporaryDirectoryTask(async (cwd) => {
    let filename = path.join(cwd, "package.json");
    await writeJson(filename, { name: "fixture", gitHead: "obsolete" });
    await updateVersions({
      cwd,
      effects: {
        readTextFile: async (requested, encoding) => {
          let contents = await promises.readFile(requested, encoding);
          if (requested === filename) {
            await promises.unlink(filename);
          }
          return contents;
        },
      },
    });
    equal(
      JSON.parse(await promises.readFile(filename, "utf8")),
      { name: "fixture" },
      "05.01",
    );
    equal(await promises.readdir(cwd), ["package.json"], "05.02");
  });
});

test("06 - failed atomic replacement removes its temporary file", async () => {
  await temporaryDirectoryTask(async (cwd) => {
    let filename = path.join(cwd, "package.json");
    await writeJson(filename, { name: "fixture", gitHead: "obsolete" });
    let error = await captureFailure({
      cwd,
      effects: {
        readTextFile: async (requested, encoding) => {
          let contents = await promises.readFile(requested, encoding);
          if (requested === filename) {
            await promises.unlink(filename);
            await promises.mkdir(filename);
          }
          return contents;
        },
      },
    });
    equal(error.errors[0].phase, "package write", "06.01");
    equal(await promises.readdir(cwd), ["package.json"], "06.02");
    ok((await promises.stat(filename)).isDirectory());
    equal(await promises.readdir(filename), [], "06.03");
  });
});

test("07 - help and version take precedence over other CLI arguments", async () => {
  await temporaryDirectoryTask(async (cwd) => {
    let manifest = JSON.parse(
      await promises.readFile(
        new URL("../package.json", import.meta.url),
        "utf8",
      ),
    );
    for (let flag of ["-v", "--version"]) {
      let result = await execa(
        process.execPath,
        [cliPath, flag, "ignored.json"],
        childOptions(cwd),
      );
      equal(result.stdout, manifest.version, "07.01");
      equal(result.stderr, "", "07.02");
    }
    for (let flag of ["-h", "--help"]) {
      let result = await execa(
        process.execPath,
        [cliPath, flag, "ignored.json"],
        childOptions(cwd),
      );
      match(result.stdout, /Usage:/);
      match(result.stdout, /Optional upd.config.json:/);
      equal(result.stderr, "", "07.03");
    }
    equal(await promises.readdir(cwd), [], "07.04");
  });
});

test("08 - importing from eval or an unresolved entrypoint has no effects", async () => {
  await temporaryDirectoryTask(async (cwd) => {
    for (let setup of ["", 'process.argv[1] = "missing-entrypoint.js";']) {
      let result = await runScript(
        cwd,
        `${setup} await import(${JSON.stringify(cliUrl.href)});`,
      );
      equal(result.stdout, "", "08.01");
      equal(result.stderr, "", "08.02");
      equal(await promises.readdir(cwd), [], "08.03");
    }
  });
});

test("09 - configuration validates every invalid list and pin component", async () => {
  await temporaryDirectoryTask(async (cwd) => {
    for (let [config, expected] of [
      [{ z: true, a: true }, /unsupported properties: a, z/],
      [{ noMajorBumping: [123] }, /THROW_ID_04/],
      [{ noMajorBumping: [""] }, /THROW_ID_04/],
      [{ pin: { "": "1.0.0" } }, /THROW_ID_06/],
      [{ pin: { alpha: "" } }, /THROW_ID_06/],
    ]) {
      await writeJson(path.join(cwd, "upd.config.json"), config);
      let error = await captureFailure({ cwd });
      equal(error.errors[0].phase, "config validation", "09.01");
      match(error.errors[0].message, expected);
    }
  });
});

test("10 - local packages without versions stay unchanged", async () => {
  await temporaryDirectoryTask(async (cwd) => {
    await promises.mkdir(path.join(cwd, "local"));
    await writeJson(path.join(cwd, "local/package.json"), { name: "local" });
    let filename = path.join(cwd, "package.json");
    let original = JSON.stringify({
      devDependencies: {
        local: "workspace:^1.0.0",
        pinned: "2.0.0",
        "pinned-path": "workspace:^1.0.0",
      },
      lect: { various: { devDependencies: "not-an-array" } },
    });
    await promises.writeFile(filename, original);
    await writeJson(path.join(cwd, "upd.config.json"), {
      pin: { pinned: "2.0.0", "pinned-path": "workspace:../sibling" },
    });
    let updated = await updateVersions({ cwd });
    equal(updated, {}, "10.01");
    equal(await promises.readFile(filename, "utf8"), original, "10.02");
  });
});

test("11 - progress output lists committed updates in sorted order", async () => {
  await temporaryDirectoryTask(async (cwd) => {
    await promises.mkdir(path.join(cwd, "local"));
    await writeJson(path.join(cwd, "local/package.json"), {
      name: "local",
      gitHead: "obsolete",
    });
    await writeJson(path.join(cwd, "package.json"), {
      dependencies: { zebra: "^1.0.0", alpha: "^1.0.0" },
    });
    let result = await runScript(
      cwd,
      `
      import { promises } from "node:fs";
      import { updateVersions } from ${JSON.stringify(cliUrl.href)};
      let releaseSlowWrite;
      let slowWrite = new Promise(resolve => { releaseSlowWrite = resolve; });
      await updateVersions({
        fetchPackage: async (name) => ({ name, version: "2.0.0" }),
        reportProgress: true,
        effects: {
          writeTextFile: async (filename, contents) => {
            if (filename.endsWith("local/package.json")) {
              await slowWrite;
            }
            await promises.writeFile(filename, contents);
            setImmediate(releaseSlowWrite);
          }
        }
      });
    `,
    );
    match(result.stdout, /50% done/);
    match(result.stdout, /all updated:\nalpha 2.0.0\nzebra 2.0.0/);
    equal(result.stderr, "", "11.01");
  });
});

test("12 - partial progress summaries list only committed updates", async () => {
  await temporaryDirectoryTask(async (cwd) => {
    for (let name of ["good", "bad-one", "bad-two"]) {
      await promises.mkdir(path.join(cwd, name));
      await writeJson(path.join(cwd, name, "package.json"), {
        name,
        dependencies: { [`${name}-dependency`]: "^1.0.0" },
      });
    }
    let result = await runScript(
      cwd,
      `
      import { promises } from "node:fs";
      import { updateVersions } from ${JSON.stringify(cliUrl.href)};
      try {
        await updateVersions({
          fetchPackage: async (name) => ({ name, version: "2.0.0" }),
          reportProgress: true,
          effects: {
            writeTextFile: async (filename, contents) => {
              if (filename.includes("bad-")) throw new Error("injected write failure");
              await promises.writeFile(filename, contents);
            }
          }
        });
      } catch (error) {
        console.error(error.message);
      }
    `,
    );
    match(
      result.stdout,
      /completed with 2 failures; 1 updated, 0 unchanged:\ngood-dependency 2.0.0/,
    );
    not.match(result.stdout, /all updated|up-to-date/);
    match(result.stderr, /2 errors; 1 file was updated/);
  });
});

test("13 - CLI reports plural metadata cleanup without registry access", async () => {
  await temporaryDirectoryTask(async (cwd) => {
    await promises.mkdir(path.join(cwd, "local"));
    for (let filename of ["package.json", "local/package.json"]) {
      await writeJson(path.join(cwd, filename), {
        name: filename,
        gitHead: "obsolete",
      });
    }
    let result = await execa(process.execPath, [cliPath], childOptions(cwd));
    match(
      result.stdout,
      /2 package.json files updated \(metadata cleanup only\)/,
    );
    equal(result.stderr, "", "13.01");
  });
});

test("14 - startup reports unexpected process failures without invented details", async () => {
  await temporaryDirectoryTask(async (cwd) => {
    for (let errorSource of [
      'new Error("injected cwd failure")',
      'new AggregateError([new Error("injected detail")], "injected cwd failure")',
    ]) {
      let error;
      try {
        await runScript(
          cwd,
          `
            process.argv[1] = ${JSON.stringify(cliPath)};
            process.cwd = () => { throw ${errorSource}; };
            await import(${JSON.stringify(cliUrl.href)});
          `,
        );
      } catch (received) {
        error = received;
      }
      equal(error.exitCode, 1, "14.01");
      equal(error.stdout, "", "14.02");
      match(error.stderr, /injected cwd failure/);
      if (errorSource.includes("AggregateError")) {
        match(error.stderr, /\[unknown\] unknown: injected detail/);
      } else {
        not.match(error.stderr, /\[unknown\]/);
      }
      equal(await promises.readdir(cwd), [], "14.03");
    }
  });
});

test.run();
