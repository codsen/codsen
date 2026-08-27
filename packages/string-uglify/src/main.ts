import { version as v } from "../package.json";

const version: string = v;

declare let DEV: boolean;

// tells code point of a given id number
function tellCP(str: string, idNum = 0): number {
  return str.codePointAt(idNum) || 0;
}

function firstCodePoint(str: string, idNum = 0): string {
  const codePoint = str.codePointAt(idNum);
  if (codePoint === undefined) {
    return "";
  }
  return str.slice(idNum, idNum + (codePoint > 0xffff ? 2 : 1));
}

function encodeCollisionOrdinal(ordinal: number, alphabet: string): string {
  let value = ordinal;
  let result = "";
  do {
    result = alphabet[value % alphabet.length] + result;
    value = Math.floor(value / alphabet.length);
  } while (value > 0);
  return result;
}

export interface Obj {
  [key: string]: any;
}

function assertArray(
  value: unknown,
  functionName: "uglifyArr" | "uglifyById",
): asserts value is unknown[] {
  let isArray = false;
  try {
    isArray = Array.isArray(value);
  } catch {
    // A revoked Proxy must still produce this package's deliberate error.
  }

  if (!isArray) {
    throw new TypeError(
      `string-uglify/${functionName}(): [THROW_ID_01] The first input argument must be an array of strings. It was given as type ${value === null ? "null" : typeof value}.`,
    );
  }
}

function throwInvalidArrayMember(
  functionName: "uglifyArr" | "uglifyById",
  index: number,
  member?: unknown,
  unreadable = false,
): never {
  throw new TypeError(
    unreadable
      ? `string-uglify/${functionName}(): [THROW_ID_02] The first input argument contains an unreadable item at index ${index}.`
      : `string-uglify/${functionName}(): [THROW_ID_02] The first input argument contains a non-string item at index ${index} (type ${typeof member}).`,
  );
}

function assertStringArray(
  value: unknown,
  functionName: "uglifyById",
): asserts value is string[] {
  assertArray(value, functionName);

  const arr = value as unknown[];
  let length = 0;
  try {
    length = arr.length;
  } catch {
    throw new TypeError(
      `string-uglify/${functionName}(): [THROW_ID_02] The first input argument must be a readable array of strings.`,
    );
  }

  for (let index = 0; index < length; index += 1) {
    let member: unknown;
    try {
      member = arr[index];
    } catch {
      throwInvalidArrayMember(functionName, index, undefined, true);
    }
    if (typeof member !== "string") {
      throwInvalidArrayMember(functionName, index, member);
    }
  }
}

// converts whole array into array uglified names
function uglifyArr(arr: string[]): string[] {
  assertArray(arr, "uglifyArr");

  let letters = "abcdefghijklmnopqrstuvwxyz";
  let lettersAndNumbers = "abcdefghijklmnopqrstuvwxyz0123456789";

  let singleClasses: Obj = {
    a: false,
    b: false,
    c: false,
    d: false,
    e: false,
    f: false,
    g: false,
    h: false,
    i: false,
    j: false,
    k: false,
    l: false,
    m: false,
    n: false,
    o: false,
    p: false,
    q: false,
    r: false,
    s: false,
    t: false,
    u: false,
    v: false,
    w: false,
    x: false,
    y: false,
    z: false,
  };
  let singleIds: Obj = {
    a: false,
    b: false,
    c: false,
    d: false,
    e: false,
    f: false,
    g: false,
    h: false,
    i: false,
    j: false,
    k: false,
    l: false,
    m: false,
    n: false,
    o: false,
    p: false,
    q: false,
    r: false,
    s: false,
    t: false,
    u: false,
    v: false,
    w: false,
    x: false,
    y: false,
    z: false,
  };
  let singleNameOnly: Obj = {
    a: false,
    b: false,
    c: false,
    d: false,
    e: false,
    f: false,
    g: false,
    h: false,
    i: false,
    j: false,
    k: false,
    l: false,
    m: false,
    n: false,
    o: false,
    p: false,
    q: false,
    r: false,
    s: false,
    t: false,
    u: false,
    v: false,
    w: false,
    x: false,
    y: false,
    z: false,
  };

  // final array we'll assemble and eventually return
  let res: string[] = [];

  // quick end
  if (!arr.length) {
    return [];
  }

  // Linear scans win on the small selector lists most callers pass, while
  // indexed lookups avoid quadratic work on larger CSS inventories.
  const generatedNames = arr.length >= 48 ? new Set<string>() : undefined;
  const generatedByOriginal = generatedNames
    ? new Map<string, string>()
    : undefined;
  let collisionOrdinals: Map<string, number> | undefined;

  for (let id = 0, len = arr.length; id < len; id++) {
    const originalName: unknown = arr[id];
    if (typeof originalName !== "string") {
      throwInvalidArrayMember("uglifyArr", id, originalName);
    }

    // insurance against duplicate reference array values
    let previousResult: string | undefined;
    if (generatedByOriginal) {
      previousResult = generatedByOriginal.get(originalName);
    } else {
      const firstIndex = arr.indexOf(originalName);
      if (firstIndex < id) {
        previousResult = res[firstIndex];
      }
    }
    if (previousResult !== undefined) {
      // push again the calculated value from "res":
      res.push(previousResult);
      continue;
    }

    let prefix = `.#`.includes(originalName[0]) ? originalName[0] : "";
    let codePointSum = 0;
    let codePointCount = 0;
    for (const character of originalName) {
      codePointSum += tellCP(character);
      codePointCount += 1;
    }
    const nameCodePointCount = codePointCount - (prefix ? 1 : 0);

    if (nameCodePointCount < 3) {
      let val = originalName;
      if (!(generatedNames ? generatedNames.has(val) : res.includes(val))) {
        res.push(val);
        if (generatedNames && generatedByOriginal) {
          generatedNames.add(val);
          generatedByOriginal.set(originalName, val);
        }

        // the first candidates for single-character value are 2-char long classes:
        const firstNameCodePoint = firstCodePoint(val, prefix ? 1 : 0);
        if (val.startsWith(".") && nameCodePointCount === 1) {
          // mark the letter as used
          singleClasses[firstNameCodePoint] = true;
        } else if (val.startsWith("#") && nameCodePointCount === 1) {
          // mark the letter as used
          singleIds[firstNameCodePoint] = true;
        } else if (
          !val.startsWith(".") &&
          !val.startsWith("#") &&
          nameCodePointCount === 1
        ) {
          // mark the letter as used
          singleNameOnly[firstNameCodePoint] = true;
        }
        continue;
      }
    }

    let generated = `${prefix}${letters[codePointSum % letters.length]}${
      lettersAndNumbers[codePointSum % lettersAndNumbers.length]
    }`;

    if (
      generatedNames ? generatedNames.has(generated) : res.includes(generated)
    ) {
      collisionOrdinals ||= new Map<string, number>();
      const ordinal = collisionOrdinals.get(generated) || 0;
      collisionOrdinals.set(generated, ordinal + 1);
      generated += encodeCollisionOrdinal(ordinal, lettersAndNumbers);
    }

    res.push(generated);
    if (generatedNames && generatedByOriginal) {
      generatedNames.add(generated);
      generatedByOriginal.set(originalName, generated);
    }
    if (
      generated.startsWith(".") &&
      generated.length === 2 &&
      singleClasses[generated.slice(1)] === false
    ) {
      singleClasses[generated.slice(1)] = true;
    } else if (
      generated.startsWith("#") &&
      generated.length === 2 &&
      singleIds[generated.slice(1)] === false
    ) {
      singleIds[generated.slice(1)] = true;
    } else if (
      !generated.startsWith(".") &&
      !generated.startsWith("#") &&
      generated.length === 1 &&
      singleNameOnly[generated] === false
    ) {
      singleNameOnly[generated] = true;
    }
  }

  DEV &&
    console.log(
      `${`\u001b[${33}m${`singleClasses`}\u001b[${39}m`} = ${JSON.stringify(
        singleClasses,
        null,
        4,
      )}\n${`\u001b[${33}m${`singleIds`}\u001b[${39}m`} = ${JSON.stringify(
        singleIds,
        null,
        4,
      )}\n${`\u001b[${33}m${`singleNameOnly`}\u001b[${39}m`} = ${JSON.stringify(
        singleNameOnly,
        null,
        4,
      )}`,
    );

  // loop through all uglified values again and if the one letter name that
  // matches current name's first letter (considering it might be id, class or
  // just name), shorten that value up to that single letter.
  for (let i = 0, len = res.length; i < len; i++) {
    DEV && console.log("----------------------------------------");
    DEV &&
      console.log(
        `processing res[i] = ${`\u001b[${36}m${res[i]}\u001b[${39}m`}`,
      );
    if (res[i].startsWith(".")) {
      const firstNameCodePoint = firstCodePoint(res[i], 1);
      // if particular class name starts with a letter which hasn't been taken
      if (!singleClasses[firstNameCodePoint]) {
        singleClasses[firstNameCodePoint] = res[i];
        DEV &&
          console.log(
            `shortened ${`\u001b[${33}m${res[i]}\u001b[${39}m`} to ${`\u001b[${33}m.${firstNameCodePoint}\u001b[${39}m`}; set ${`\u001b[${33}m${`singleClasses[${firstNameCodePoint}]`}\u001b[${39}m`} = ${
              singleClasses[firstNameCodePoint]
            }`,
          );
        res[i] = `.${firstNameCodePoint}`;
      } else if (singleClasses[firstNameCodePoint] === res[i]) {
        DEV &&
          console.log(
            `res[i] = ${res[i]} will also be shortened to .${firstNameCodePoint}`,
          );
        // This means, particular class name was repeated in the list and
        // was shortened. We must shorten it to the same value.
        res[i] = `.${firstNameCodePoint}`;
      }
    } else if (res[i].startsWith("#")) {
      const firstNameCodePoint = firstCodePoint(res[i], 1);
      if (!singleIds[firstNameCodePoint]) {
        singleIds[firstNameCodePoint] = res[i];
        DEV &&
          console.log(
            `shortened ${`\u001b[${33}m${res[i]}\u001b[${39}m`} to ${`\u001b[${33}m#${firstNameCodePoint}\u001b[${39}m`};`,
          );
        res[i] = `#${firstNameCodePoint}`;
      } else if (singleIds[firstNameCodePoint] === res[i]) {
        // This means, particular id name was repeated in the list and
        // was shortened. We must shorten it to the same value.
        res[i] = `#${firstNameCodePoint}`;
      }
    } else if (!res[i].startsWith(".") && !res[i].startsWith("#")) {
      const firstNameCodePoint = firstCodePoint(res[i]);
      if (!singleNameOnly[firstNameCodePoint]) {
        singleNameOnly[firstNameCodePoint] = res[i];
        DEV &&
          console.log(
            `shortened ${`\u001b[${33}m${res[i]}\u001b[${39}m`} to ${`\u001b[${33}m${firstNameCodePoint}\u001b[${39}m`}`,
          );
        res[i] = firstNameCodePoint;
      } else if (singleNameOnly[firstNameCodePoint] === res[i]) {
        // This means, particular id name was repeated in the list and
        // was shortened. We must shorten it to the same value.
        res[i] = firstNameCodePoint;
      }
    }
  }

  return res;
}

// main function - converts n-th string in a given reference array of strings
function uglifyById(refArr: string[], idNum: number): string {
  assertStringArray(refArr, "uglifyById");

  if (!Number.isInteger(idNum)) {
    throw new TypeError(
      `string-uglify/uglifyById(): [THROW_ID_03] The second input argument, idNum, must be an integer. It was given as type ${idNum === null ? "null" : typeof idNum}${typeof idNum === "number" ? ` with value ${String(idNum)}` : ""}.`,
    );
  }
  if (idNum < 0 || idNum >= refArr.length) {
    throw new RangeError(
      `string-uglify/uglifyById(): [THROW_ID_04] The second input argument, idNum, must point to an item in refArr. It was given as ${idNum}, while refArr contains ${refArr.length} item${refArr.length === 1 ? "" : "s"}.`,
    );
  }
  return uglifyArr(refArr)[idNum];
}

// main export
export { uglifyArr, uglifyById, version };
