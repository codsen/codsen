import { set, traverse } from "ast-monkey";

function isStr(something) {
  return typeof something === "string";
}
function mandatory(i) {
  throw new Error(
    `string-convert-indexes: [THROW_ID_01*] Missing ${i}th parameter!`
  );
}

function prep(something) {
  if (typeof something === "string") {
    return parseInt(something, 10);
  }
  return something;
}
function customSort(arr) {
  return arr.sort((a, b) => {
    if (prep(a.val) < prep(b.val)) {
      return -1;
    }
    if (prep(a.val) > prep(b.val)) {
      return 1;
    }
    // val's must be equal
    return 0;
  });
}

// inner function, common for both external API's methods that does the job:
function strConvertIndexes(mode, str, indexes, originalOpts) {
  //
  // insurance
  // ---------
  if (!isStr(str) || str.length === 0) {
    throw new TypeError(
      `string-convert-indexes: [THROW_ID_02] the first input argument, input string, must be a non-zero-length string! Currently it's: ${typeof str}, equal to:\n${str}`
    );
  }
  if (originalOpts && typeof originalOpts !== "object") {
    throw new TypeError(
      `string-convert-indexes: [THROW_ID_03] the third input argument, Optional Options Object, must be a plain object! Currently it's: ${typeof originalOpts}, equal to:\n${originalOpts}`
    );
  }
  // prep the opts
  const defaults = {
    throwIfAnyOfTheIndexesAreOutsideOfTheReferenceString: true,
  };
  const opts = Object.assign({}, defaults, originalOpts);

  // this simple counter will later act as the "address" to each finding and will
  // be used in set() method to convert the value at this "address" within tree:
  const data = { id: 0 };

  // during the first traversal we'll gather the list of natural number values
  // and their "addresses", id numbers used internally within ast-monkey.
  let toDoList = [];

  // STEP 1.
  // ---------------------------------------------------------------------------

  // if it's a number, there's no need to traverse:
  if ((Number.isInteger(indexes) && indexes >= 0) || /^\d*$/.test(indexes)) {
    toDoList = [
      {
        id: 1,
        val: indexes,
      },
    ];
  } else {
    // traverse the indexes and compile the sorted list of them, along with their "addresses",
    // or id numbers, by which they can later be called using "ast-monkey":
    indexes = traverse(indexes, (key, val) => {
      data.id += 1;
      data.val = val !== undefined ? val : key;
      if (
        (Number.isInteger(data.val) && data.val >= 0) ||
        /^\d*$/.test(data.val)
      ) {
        toDoList.push({ ...data });
      }
      return data.val;
    });
  }

  // STEP 2.
  // ---------------------------------------------------------------------------
  // sort the toDoList by string indexes, that is, toDoList[?].val, and account
  // for cases when the value is numeric string:

  // if there's nothing to work upon, bail:
  if (toDoList.length === 0) {
    return indexes;
  }
  toDoList = customSort(toDoList);
  console.log(`STEP 2. FINAL toDoList = ${JSON.stringify(toDoList, null, 4)}`);

  // STEP 3.
  // ---------------------------------------------------------------------------
  // traverse the input string and covert all indexes:
  //
  // astral chars have first character: from 55296 to 56319
  // and second character: from 56320 to 57343

  let unicodeIndex = -1;
  let surrogateDetected = false;
  for (let i = 0, len = str.length; i <= len; i++) {
    console.log(`---------------------------------------- ${str[i]}  (${i})`);
    console.log(
      `* surrogateDetected was ${JSON.stringify(surrogateDetected, null, 4)}`
    );
    console.log(
      `114 * unicodeIndex was ${JSON.stringify(unicodeIndex, null, 4)}`
    );
    //
    //    PART 1. Bean-counting
    //    =====================
    //
    // so the JS native index is "i"
    // we just need to keep track of Unicode character count

    if (str[i] === undefined) {
      // this means it's the first character outside of the input characters.
      // we can convert it nonetheless.
      unicodeIndex += 1;
    } else if (str[i].charCodeAt(0) >= 55296 && str[i].charCodeAt(0) <= 57343) {
      // if it's one of surrogate pair characters:

      // if there is no preceding surrogate:
      if (surrogateDetected !== true) {
        unicodeIndex += 1;
        console.log(
          `134 ! unicodeIndex now ${JSON.stringify(unicodeIndex, null, 4)}`
        );
        surrogateDetected = true;
        console.log(
          `138 ! surrogateDetected now ${JSON.stringify(
            surrogateDetected,
            null,
            4
          )}`
        );
      } else {
        // if there is preceding surrogate - don't bump the Unicode char counter

        // but reset the flag, because astral symbols come in pairs
        surrogateDetected = false;
        console.log(
          `150 ! surrogateDetected now ${JSON.stringify(
            surrogateDetected,
            null,
            4
          )}`
        );
      }
    } else {
      // not surrogate:

      // bump the counter:
      unicodeIndex += 1;
      console.log(
        `163 ! unicodeIndex now ${JSON.stringify(unicodeIndex, null, 4)}`
      );
      // reset the flag:
      if (surrogateDetected === true) {
        surrogateDetected = false;
        console.log(
          `169 ! surrogateDetected now ${JSON.stringify(
            surrogateDetected,
            null,
            4
          )}`
        );
      }
    }

    console.log(`\n---> unicodeIndex:      ${unicodeIndex}`);
    console.log(`---> surrogateDetected: ${surrogateDetected}\n`);

    //       PART 2. Action
    //       ==============
    //
    // take the first object from toDoList and convert its index
    if (mode === "n") {
      // native to Unicode conversion

      // there can be multiple values in the toDoList with the same index that
      // needs to be converting, thus we need to loop the toDoList
      for (let y = 0, leny = toDoList.length; y < leny; y++) {
        if (prep(toDoList[y].val) === i) {
          toDoList[y].res = isStr(toDoList[y].val)
            ? String(unicodeIndex)
            : unicodeIndex;
        } else if (prep(toDoList[y].val) > i) {
          break; // since toDoList is sorted, all other values will be not smaller too
        }
      }
    } else {
      // Unicode to native conversion

      // same start, loop the toDoList
      for (let y = 0, leny = toDoList.length; y < leny; y++) {
        // this second condition prevents from the event happening twice, on
        // each of the surrogates, and on that second occurence overwriting the
        // index "i" with "i+1" which leads to an error. Astral character at
        // zero index position would get converted to index native index one.
        if (
          prep(toDoList[y].val) === unicodeIndex &&
          toDoList[y].res === undefined
        ) {
          toDoList[y].res = isStr(toDoList[y].val) ? String(i) : i;
        } else if (prep(toDoList[y].val) > unicodeIndex) {
          break; // since toDoList is sorted, all other values will be not smaller too
        }
      }
    }

    // if it's the reference string's last character being traversed, check,
    // does its index cover the largest of the toDoList index (last element),
    // because if it does not, this means somebody is trying to convert the index
    // without giving enough characters in the reference string to calculate the
    // conversion:
    if (
      opts.throwIfAnyOfTheIndexesAreOutsideOfTheReferenceString &&
      i === len - 1 &&
      ((mode === "n" && prep(toDoList[toDoList.length - 1].val) > len) ||
        (mode === "u" &&
          prep(toDoList[toDoList.length - 1].val) > unicodeIndex + 1))
    ) {
      if (mode === "n") {
        throw new Error(
          `string-convert-indexes: [THROW_ID_05] the reference string has native JS string indexes going only upto ${i}, but you are trying to convert an index larger than that, ${prep(
            toDoList[toDoList.length - 1].val
          )}`
        );
      } else {
        throw new Error(
          `string-convert-indexes: [THROW_ID_06] the reference string has Unicode character count going only upto ${unicodeIndex}, but you are trying to convert an index larger than that, ${prep(
            toDoList[toDoList.length - 1].val
          )}`
        );
      }
    }
  }

  //       PART 3. Result
  //       ==============

  console.log("\n\n\n");
  console.log(`251 FINAL toDoList = ${JSON.stringify(toDoList, null, 4)}`);

  if ((Number.isInteger(indexes) && indexes >= 0) || /^\d*$/.test(indexes)) {
    return toDoList[0].res !== undefined ? toDoList[0].res : toDoList[0].val;
  }

  // The result's base is original indexes from the input. Clone it.
  console.log(
    `259 ███████████████████████████████████████ CLONING indexes = ${indexes}, typeof ${
      Array.isArray(indexes) ? "array" : `${typeof indexes}`
    }`
  );
  let res = Array.from(indexes);

  // backwards-loop the toDoList for efficiency, mutate the res on each step:
  for (let z = toDoList.length; z--; ) {
    // we will use the "set" method from ast-monkey, which sets the value by id number:
    res = set(res, {
      index: toDoList[z].id,
      val: toDoList[z].res !== undefined ? toDoList[z].res : toDoList[z].val,
    });
  }

  return res;
}

function nativeToUnicode(str = mandatory(1), indexes = mandatory(2), opts) {
  return strConvertIndexes("n", str, indexes, opts);
}

function unicodeToNative(str = mandatory(1), indexes = mandatory(2), opts) {
  return strConvertIndexes("u", str, indexes, opts);
}

export { nativeToUnicode, unicodeToNative };
