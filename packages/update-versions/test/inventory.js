import path from "node:path";
import { test } from "uvu";
import { equal, ok } from "uvu/assert";
import { UpdateVersionsError, updateVersions } from "../cli.js";

test("01 - inventory collects failures in order before registry lookups or writes", async () => {
  const events = [];
  let registryCalls = 0;
  let writes = 0;
  let failure;
  try {
    await updateVersions({
      fetchPackage: async () => {
        registryCalls += 1;
      },
      effects: {
        findPackageJsons: async () => [
          "unreadable.json",
          "invalid.json",
          "valid.json",
        ],
        readTextFile: async (filename) => {
          const name = path.basename(filename);
          if (name === "upd.config.json") {
            return "{}";
          }
          events.push(`start ${name}`);
          await Promise.resolve();
          events.push(`end ${name}`);
          if (name === "unreadable.json") {
            throw new Error("read failed");
          }
          return name === "invalid.json"
            ? "{"
            : '{"name":"valid","dependencies":{"external":"^1.0.0"}}';
        },
        writeTextFile: async () => {
          writes += 1;
        },
      },
    });
  } catch (error) {
    failure = error;
  }
  ok(failure instanceof UpdateVersionsError, "01.01");
  equal(
    events,
    [
      "start unreadable.json",
      "end unreadable.json",
      "start invalid.json",
      "end invalid.json",
      "start valid.json",
      "end valid.json",
    ],
    "01.02",
  );
  equal(
    failure.errors.map(({ phase, path: filename }) => [phase, filename]),
    [
      ["package read", "unreadable.json"],
      ["package parse", "invalid.json"],
    ],
    "01.03",
  );
  equal(failure.unchangedFiles, ["valid.json"], "01.04");
  equal(registryCalls, 0, "01.05");
  equal(writes, 0, "01.06");
});

test.run();
