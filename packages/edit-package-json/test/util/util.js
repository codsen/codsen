import objectPath from "object-path";

import { del, set } from "../../dist/edit-package-json.esm.js";

function setter(
  equal,
  source,
  result,
  path,
  val,
  idNum,
  isInvalidJson = false,
) {
  // 01.
  equal(
    set(source, path, val),
    result,
    `${idNum}.01 - string is identical after set`,
  );

  // we can process invalid JSON too!
  if (!isInvalidJson) {
    // 02. parsed versions we just compared must be deep-equal
    equal(
      JSON.parse(set(source, path, val)),
      JSON.parse(result),
      `${idNum}.02 - both parsed parties are deep-equal`,
    );

    // 03. result is equivalent to (JSON.parse + object-path.set())
    //
    // Round-tripped through JSON, because setting a path past the end of an
    // array leaves object-path with holes, and a hole is not a value dequal can
    // match against the null it has to become the moment it is written out.
    // This library produces JSON text, so JSON is the only shape worth
    // comparing in.
    let temp = JSON.parse(source);
    objectPath.set(temp, path, val);
    equal(
      JSON.parse(JSON.stringify(temp)),
      JSON.parse(result),
      `${idNum}.03 - objectPath set is deep-equal`,
    );
  }
}

function deleter(equal, source, result, path, idNum) {
  // 01.
  equal(
    del(source, path),
    result,
    `${idNum}.01 - string is identical after set`,
  );

  // 02. compare parsed
  equal(
    JSON.parse(del(source, path)),
    JSON.parse(result),
    `${idNum}.02 - both parsed parties are deep-equal`,
  );

  // 03. if we did the deed manually, it would be the same if both were parsed
  let temp = JSON.parse(source);
  objectPath.del(temp, path);
  equal(temp, JSON.parse(result), `${idNum}.03 - objectPath del is deep-equal`);
}

export { deleter, setter };
