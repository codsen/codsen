import objectPath from "object-path";
import { set, del } from "../../dist/edit-package-json.esm.js";

function setter(t, source, result, path, val, idNum, isInvalidJson = false) {
  // 01.
  t.equal(
    set(source, path, val),
    result,
    `${idNum}.01 - string is identical after set`
  );

  // we can process invalid JSON too!
  if (!isInvalidJson) {
    // 02. parsed versions we just compared must be deep-equal
    t.strictSame(
      JSON.parse(set(source, path, val)),
      JSON.parse(result),
      `${idNum}.02 - both parsed parties are deep-equal`
    );

    // 03. result is equivalent to (JSON.parse + object-path.set())
    const temp = JSON.parse(source);
    objectPath.set(temp, path, val);
    t.strictSame(
      temp,
      JSON.parse(result),
      `${idNum}.03 - objectPath set is deep-equal`
    );
  }
}

function deleter(t, source, result, path, idNum) {
  // 01.
  t.equal(
    del(source, path),
    result,
    `${idNum}.01 - string is identical after set`
  );

  // 02. compare parsed
  t.strictSame(
    JSON.parse(del(source, path)),
    JSON.parse(result),
    `${idNum}.02 - both parsed parties are deep-equal`
  );

  // 03. if we did the deed manually, it would be the same if both were parsed
  const temp = JSON.parse(source);
  objectPath.del(temp, path);
  t.strictSame(
    temp,
    JSON.parse(result),
    `${idNum}.03 - objectPath del is deep-equal`
  );
}

export { setter, deleter };
