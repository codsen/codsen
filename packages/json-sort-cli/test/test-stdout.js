import { spawn, spawnSync } from "node:child_process";
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { temporaryDirectory } from "tempy";
import { test } from "uvu";
import { equal, match } from "uvu/assert";

const cliPath = path.resolve("cli.js");
const compactJson = '{"z":1,"a":{"d":4,"b":2}}';
const sortedJson = `{
  "a": {
    "b": 2,
    "d": 4
  },
  "z": 1
}
`;

function childEnvironment() {
  const environment = { ...process.env, NO_UPDATE_NOTIFIER: "1" };
  delete environment.FORCE_COLOR;
  delete environment.NO_COLOR;
  return environment;
}

function runCli(directory, input, ...arguments_) {
  return spawnSync(process.execPath, [cliPath, ...arguments_], {
    cwd: directory,
    encoding: "utf8",
    env: childEnvironment(),
    input,
    maxBuffer: 100_000_000,
    shell: false,
  });
}

test("01 - piped JSON produces only sorted JSON", () => {
  const directory = temporaryDirectory();
  const result = runCli(directory, compactJson);

  equal(result.status, 0, "01.01");
  equal(result.stdout, sortedJson, "01.02");
  equal(result.stderr, "", "01.03");
  equal(readdirSync(directory), [], "01.04");
});

test('02 - "-" reads stdin and supports formatting options', () => {
  const directory = temporaryDirectory();
  const result = runCli(
    directory,
    '["z","a"]',
    "-",
    "--arrays",
    "--tabs",
    "--indentationCount",
    "1",
    "--lineEnding",
    "crlf",
  );

  equal(result.status, 0, "02.01");
  equal(result.stdout, '[\r\n\t"a",\r\n\t"z"\r\n]\r\n', "02.02");
  equal(result.stderr, "", "02.03");
  equal(readdirSync(directory), [], "02.04");
});

test("03 - --stdout reads one file without changing it", () => {
  const directory = temporaryDirectory();
  const inputPath = path.join(directory, "input.json");
  writeFileSync(inputPath, compactJson);

  const result = runCli(directory, undefined, "input.json", "--stdout");

  equal(result.status, 0, "03.01");
  equal(result.stdout, sortedJson, "03.02");
  equal(result.stderr, "", "03.03");
  equal(readFileSync(inputPath, "utf8"), compactJson, "03.04");
  equal(readdirSync(directory), ["input.json"], "03.05");
});

test("04 - a named package.json keeps its special key order", () => {
  const directory = temporaryDirectory();
  const inputPath = path.join(directory, "package.json");
  const source = '{"zzz":1,"version":"1.0.0","name":"fixture"}';
  writeFileSync(inputPath, source);

  const result = runCli(directory, undefined, "package.json", "--stdout");

  equal(result.status, 0, "04.01");
  equal(
    result.stdout,
    '{\n  "name": "fixture",\n  "version": "1.0.0",\n  "zzz": 1\n}\n',
    "04.02",
  );
  equal(result.stderr, "", "04.03");
  equal(readFileSync(inputPath, "utf8"), source, "04.04");
});

test("05 - malformed stdin fails without writing or partial stdout", () => {
  const directory = temporaryDirectory();
  const sentinelPath = path.join(directory, "sentinel.json");
  const sentinel = '{"z":1,"a":2}';
  writeFileSync(sentinelPath, sentinel);

  const result = runCli(directory, '{"a":}');

  equal(result.status, 1, "05.01");
  equal(result.stdout, "", "05.02");
  match(result.stderr, /-: parse failed:.*THROW_ID_01/su, "05.03");
  equal(readFileSync(sentinelPath, "utf8"), sentinel, "05.04");
});

test("06 - invalid UTF-8 stdin fails without replacement characters", () => {
  const directory = temporaryDirectory();
  const result = runCli(
    directory,
    Buffer.from([0x7b, 0x22, 0x61, 0x22, 0x3a, 0x22, 0x80, 0x22, 0x7d]),
  );

  equal(result.status, 1, "06.01");
  equal(result.stdout, "", "06.02");
  match(result.stderr, /Input is not valid UTF-8/u, "06.03");
  equal(readdirSync(directory), [], "06.04");
});

test("07 - zero-byte piped stdin never triggers recursive writes", () => {
  const directory = temporaryDirectory();
  const inputPath = path.join(directory, "input.json");
  writeFileSync(inputPath, compactJson);

  const result = runCli(directory, Buffer.alloc(0));

  equal(result.status, 1, "07.01");
  equal(result.stdout, "", "07.02");
  match(result.stderr, /Expected a JSON value/u, "07.03");
  equal(readFileSync(inputPath, "utf8"), compactJson, "07.04");
});

test("08 - --stdout rejects multiple resolved files atomically", () => {
  const directory = temporaryDirectory();
  const firstPath = path.join(directory, "first.json");
  const secondPath = path.join(directory, "second.json");
  writeFileSync(firstPath, compactJson);
  writeFileSync(secondPath, compactJson);

  const result = runCli(directory, undefined, "*.json", "--stdout");

  equal(result.status, 1, "08.01");
  equal(result.stdout, "", "08.02");
  match(result.stderr, /requires exactly one input; found 2/u, "08.03");
  equal(readFileSync(firstPath, "utf8"), compactJson, "08.04");
  equal(readFileSync(secondPath, "utf8"), compactJson, "08.05");
});

test("09 - stdin cannot be combined with a file source", () => {
  const directory = temporaryDirectory();
  const inputPath = path.join(directory, "input.json");
  writeFileSync(inputPath, compactJson);

  const result = runCli(directory, compactJson, "input.json", "-", "--stdout");

  equal(result.status, 1, "09.01");
  equal(result.stdout, "", "09.02");
  match(result.stderr, /cannot be combined with file paths/u, "09.03");
  equal(readFileSync(inputPath, "utf8"), compactJson, "09.04");
});

test("10 - checking, dry-run and silent modes cannot print JSON", () => {
  const directory = temporaryDirectory();
  const inputPath = path.join(directory, "input.json");
  writeFileSync(inputPath, compactJson);
  const argumentSets = [
    ["input.json", "--stdout", "--ci"],
    ["input.json", "--stdout", "--dry"],
    ["input.json", "--stdout", "--silent"],
  ];
  const results = argumentSets.map((arguments_) =>
    runCli(directory, undefined, ...arguments_),
  );

  equal(
    results.map(({ status }) => status),
    [1, 1, 1],
    "10.01",
  );
  equal(
    results.map(({ stdout }) => stdout),
    ["", "", ""],
    "10.02",
  );
  match(results[0].stderr, /--ci cannot be used/u, "10.03");
  match(results[1].stderr, /--dry cannot be used/u, "10.04");
  equal(results[2].stderr, "", "10.05");
  equal(readFileSync(inputPath, "utf8"), compactJson, "10.06");
});

test("11 - stdin-only invocations can enable array sorting", () => {
  const directory = temporaryDirectory();
  const result = runCli(directory, '["z","a"]', "--arrays");

  equal(result.status, 0, "11.01");
  equal(result.stdout, '[\n  "a",\n  "z"\n]\n', "11.02");
  equal(result.stderr, "", "11.03");
});

test("12 - --stdout reports an unmatched path as an error", () => {
  const directory = temporaryDirectory();
  mkdirSync(path.join(directory, "empty"));
  const result = runCli(directory, undefined, "empty", "--stdout");

  equal(result.status, 1, "12.01");
  equal(result.stdout, "", "12.02");
  match(result.stderr, /requires exactly one input; found 0/u, "12.03");
  equal(readdirSync(directory), ["empty"], "12.04");
});

test("13 - an early-closing stdout consumer doesn't cause EPIPE failure", async () => {
  const directory = temporaryDirectory();
  const child = spawn(process.execPath, [cliPath], {
    cwd: directory,
    env: childEnvironment(),
    stdio: ["pipe", "pipe", "pipe"],
  });
  let stderr = "";
  child.stderr.setEncoding("utf8");
  child.stderr.on("data", (chunk) => {
    stderr += chunk;
  });

  const closed = new Promise((resolve, reject) => {
    child.once("error", reject);
    child.stdout.once("data", () => {
      child.stdout.destroy();
    });
    child.once("close", (status, signal) => {
      resolve({ signal, status });
    });
  });
  child.stdin.end(`{"z":"${"x".repeat(5_000_000)}","a":1}`);

  equal(await closed, { signal: null, status: 0 }, "13.01");
  equal(stderr, "", "13.02");
  equal(readdirSync(directory), [], "13.03");
});

test("14 - stdout errors other than EPIPE still fail", () => {
  const directory = temporaryDirectory();
  const wrapper = `
process.argv = [process.execPath, ${JSON.stringify(cliPath)}];
process.stdout.write = () => {
  setImmediate(() => {
    process.stdout.emit(
      "error",
      Object.assign(new Error("injected stdout failure"), { code: "EIO" }),
    );
  });
};
await import(${JSON.stringify(pathToFileURL(cliPath).href)});
`;
  const result = spawnSync(
    process.execPath,
    ["--input-type=module", "--eval", wrapper],
    {
      cwd: directory,
      encoding: "utf8",
      env: childEnvironment(),
      input: compactJson,
    },
  );

  equal(result.status, 1, "14.01");
  equal(result.stdout, "", "14.02");
  equal(result.stderr, "✨ json-sort-cli: injected stdout failure\n", "14.03");
  equal(readdirSync(directory), [], "14.04");
});

test.run();
