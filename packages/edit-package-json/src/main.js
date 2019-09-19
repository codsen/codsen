const isArr = Array.isArray;
function isStr(something) {
  return typeof something === "string";
}
function stringifyPath(something) {
  if (isArr(something)) {
    return something.join(".");
  } else if (isStr(something)) {
    return something;
  }
  return String(something);
}

function isNotEscpe(str, idx) {
  return idx !== "\\" || str[idx - 2] === "\\";
}

function set(str, path, valToInsert) {
  if (!isStr(str) || !str.length) {
    throw new Error(
      `edit-package-json: [THROW_ID_01] first input argument must be a non-empty string. It was given as ${JSON.stringify(
        str,
        null,
        4
      )} (type ${typeof str})`
    );
  }

  // bad characters
  const badChars = ["{", "}", "[", "]", ":"];

  let calculatedValueToInsert = valToInsert;
  // if string is passed and it's not wrapped with double quotes,
  // we must wrap it with quotes, we can't write it to JSON like that!
  if (
    isStr(valToInsert) &&
    !valToInsert.startsWith(`"`) &&
    !valToInsert.startsWith(`{`)
  ) {
    calculatedValueToInsert = `"${valToInsert}"`;
  }

  let currentlyWithinObject = false;
  let currentlyWithinArray = false;

  // this mode is activated to instruct that the value must be replaced,
  // no matter how deeply nested it is. It is activated once the path is matched.
  // When this is on, we stop iterating each key/value and we capture only
  // the whole value.
  let replaceThisValue = false;

  let keyStartedAt;
  let keyEndedAt;
  let valueStartedAt;
  let valueEndedAt;
  let keyName;
  let keyValue;

  function reset() {
    keyStartedAt = null;
    keyEndedAt = null;
    valueStartedAt = null;
    valueEndedAt = null;
    keyName = null;
    keyValue = null;
  }
  reset();

  // we keep it as array so that we can array.push/array.pop to go levels up and down
  const currentPath = [];

  const len = str.length;
  for (let i = 0; i < len; i++) {
    //
    //
    //
    //
    //                    TOP
    //
    //
    //
    //

    // Logging:
    // ███████████████████████████████████████
    console.log(
      `\n\u001b[${36}m${`===============================`}\u001b[${39}m \u001b[${35}m${`str[ ${i} ] = ${
        str[i] && str[i].trim().length
          ? str[i]
          : JSON.stringify(str[i], null, 0)
      }`}\u001b[${39}m \u001b[${36}m${`===============================`}\u001b[${39}m\n`
    );

    if (
      str[i] === "{" &&
      str[i - 1] !== "\\" &&
      !currentlyWithinObject &&
      !replaceThisValue
    ) {
      currentlyWithinObject = true;
      console.log(
        `102 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`currentlyWithinObject`}\u001b[${39}m`} = ${currentlyWithinObject}`
      );
    }

    if (
      str[i] === "}" &&
      str[i - 1] !== "\\" &&
      currentlyWithinObject &&
      !replaceThisValue
    ) {
      currentlyWithinObject = false;
      console.log(
        `114 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`currentlyWithinObject`}\u001b[${39}m`} = ${currentlyWithinObject}`
      );
    }

    if (
      str[i] === "[" &&
      str[i - 1] !== "\\" &&
      !currentlyWithinArray &&
      !replaceThisValue
    ) {
      currentlyWithinArray = true;
      console.log(
        `126 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`currentlyWithinArray`}\u001b[${39}m`} = ${currentlyWithinArray}`
      );
    }

    if (
      str[i] === "]" &&
      str[i - 1] !== "\\" &&
      currentlyWithinArray &&
      !replaceThisValue
    ) {
      currentlyWithinArray = false;
      console.log(
        `138 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`currentlyWithinArray`}\u001b[${39}m`} = ${currentlyWithinArray}`
      );

      currentPath.pop();
      console.log(
        `143 POP path, now = ${JSON.stringify(currentPath, null, 4)}`
      );

      console.log(`146 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`}`);
      reset();
    }

    //
    //
    //
    //
    //
    //
    //
    //
    //             MIDDLE
    //
    //
    //
    //
    //
    //
    //
    //

    // catch the start of a value
    // in arrays, there are no keys, only values
    if (
      !replaceThisValue &&
      !valueStartedAt &&
      str[i].trim().length &&
      !badChars.includes(str[i]) &&
      (currentlyWithinArray || (!currentlyWithinArray && keyName))
    ) {
      if (currentlyWithinArray) {
        currentPath.push(0);
        console.log(
          `180 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} zero to path, now = ${JSON.stringify(
            currentPath,
            null,
            0
          )}`
        );
      }

      valueStartedAt = i;
      console.log(
        `190 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`valueStartedAt`}\u001b[${39}m`} = ${valueStartedAt}`
      );

      // for arrays, this is the beginning of what to replace
      if (
        currentlyWithinArray &&
        (stringifyPath(path) === currentPath.join(".") ||
          currentPath.join(".").endsWith(`.${stringifyPath(path)}`))
      ) {
        replaceThisValue = true;
        console.log(
          `201 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`replaceThisValue`}\u001b[${39}m`} = ${replaceThisValue}`
        );
      }
    }

    // catch the end of a value
    if (
      !replaceThisValue &&
      (currentlyWithinArray || (!currentlyWithinArray && keyName)) &&
      valueStartedAt &&
      valueStartedAt < i &&
      !valueEndedAt &&
      ((str[valueStartedAt] === `"` && str[i] === `"` && str[i - 1] !== `\\`) ||
        ((str[valueStartedAt] !== `"` && !str[i].trim().length) ||
          ["}", ","].includes(str[i])))
    ) {
      keyValue = str.slice(
        valueStartedAt,
        str[valueStartedAt] === `"` ? i + 1 : i
      );
      console.log(
        `222 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`keyValue`}\u001b[${39}m`} = ${keyValue}`
      );
      valueEndedAt = i;
      console.log(
        `226 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`valueEndedAt`}\u001b[${39}m`} = ${valueEndedAt}`
      );
    }

    // catch the start of a key
    if (
      !replaceThisValue &&
      !currentlyWithinArray &&
      str[i] === `"` &&
      str[i - 1] !== `\\` &&
      !keyName &&
      !keyStartedAt &&
      !keyEndedAt &&
      str[i + 1]
    ) {
      keyStartedAt = i + 1;
      console.log(
        `243 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`keyStartedAt`}\u001b[${39}m`} = ${keyStartedAt}`
      );
    }

    // catch the end of a key
    if (
      !replaceThisValue &&
      !currentlyWithinArray &&
      str[i] === `"` &&
      str[i - 1] !== `\\` &&
      !keyEndedAt &&
      keyStartedAt &&
      !valueStartedAt &&
      keyStartedAt < i
    ) {
      keyEndedAt = i + 1;
      keyName = str.slice(keyStartedAt, i);
      console.log(
        `261 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`keyEndedAt`}\u001b[${39}m`} = ${keyEndedAt};  ${`\u001b[${33}m${`keyName`}\u001b[${39}m`} = ${keyName}`
      );

      // set the path
      currentPath.push(keyName);
      console.log(
        `267 PUSH to path, now = ${JSON.stringify(currentPath, null, 4)}`
      );

      // array cases don't come here so there are no conditionals for currentlyWithinArray
      if (
        stringifyPath(path) === currentPath.join(".") ||
        currentPath.join(".").endsWith(`.${stringifyPath(path)}`)
      ) {
        replaceThisValue = true;
        console.log(
          `277 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`replaceThisValue`}\u001b[${39}m`} = ${replaceThisValue}`
        );
      }
    }

    // catch the end of a key-value pair
    if (
      !replaceThisValue &&
      valueEndedAt &&
      i >= valueEndedAt &&
      str[i].trim().length
    ) {
      console.log(`289 ${`\u001b[${36}m${`██`}\u001b[${39}m`}`);
      if (str[i] === ",") {
        console.log(`291 comma caught`);

        if (currentlyWithinArray) {
          currentPath[currentPath.length - 1] =
            currentPath[currentPath.length - 1] + 1;
          console.log(
            `297 BUMP index of last path digit, now = ${JSON.stringify(
              currentPath,
              null,
              4
            )}`
          );
        } else {
          currentPath.pop();
          console.log(
            `306 POP path, now = ${JSON.stringify(currentPath, null, 4)}`
          );
        }

        console.log(`310 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`}`);
        reset();
      } else if (str[i] === "}") {
        console.log(`313 closing curlie caught`);

        // also reset but don't touch the path - rabbit hole goes deeper
        console.log(`316 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`}`);
        reset();

        currentPath.pop();
        currentPath.pop();

        console.log(
          `323 POP path twice, now = ${JSON.stringify(currentPath, null, 4)}`
        );
      }
    }

    // catch plain object as a value
    if (
      !replaceThisValue &&
      str[i] === "{" &&
      isStr(keyName) &&
      !valueStartedAt &&
      !keyValue
    ) {
      // also reset but don't touch the path - rabbit hole goes deeper
      console.log(`337 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`}`);
      reset();
    }

    // catch the start of the value when replaceThisValue is on
    if (
      str[i].trim().length &&
      replaceThisValue &&
      !valueStartedAt &&
      i > keyEndedAt &&
      ![":"].includes(str[i])
    ) {
      valueStartedAt = i;
      console.log(
        `351 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`valueStartedAt`}\u001b[${39}m`} = ${valueStartedAt}`
      );
    }

    // catch the end of the value when replaceThisValue is on
    if (replaceThisValue && valueStartedAt && i > valueStartedAt) {
      console.log(`357 within catching the end clauses`);

      if (
        (str[valueStartedAt] === "[" && str[i] === "]") ||
        (str[valueStartedAt] === "{" && str[i] === "}") ||
        (str[valueStartedAt] === `"` && str[i] === `"`) ||
        (str[valueStartedAt].trim().length &&
          (!str[i].trim().length ||
            (badChars.includes(str[i]) && isNotEscpe(str, i - 1))))
      ) {
        // 1. replacing bracket or curlie ranges
        console.log(`368 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`}`);
        return `${str.slice(
          0,
          valueStartedAt
        )}${calculatedValueToInsert}${str.slice(
          i + (str[i].trim().length ? 1 : 0)
        )}`;
      }
      // 2. replace non-quoted values
    }

    //
    //
    //
    //
    //
    //
    //
    //
    //
    //              BOTTOM
    //
    //
    //
    //
    //
    //
    //
    //

    console.log(`----------------`);
    console.log(
      `${`\u001b[${
        currentlyWithinObject ? 32 : 31
      }m${`currentlyWithinObject`}\u001b[${39}m`}; ${`\u001b[${
        currentlyWithinArray ? 32 : 31
      }m${`currentlyWithinArray`}\u001b[${39}m`}; ${`\u001b[${
        replaceThisValue ? 32 : 31
      }m${`replaceThisValue`}\u001b[${39}m`}`
    );
    console.log(`current path: ${currentPath.join(".")}`);
    console.log(
      `${`\u001b[${33}m${`keyName`}\u001b[${39}m`} = ${keyName}; ${`\u001b[${33}m${`keyValue`}\u001b[${39}m`} = ${keyValue}; ${`\u001b[${33}m${`keyStartedAt`}\u001b[${39}m`} = ${keyStartedAt}; ${`\u001b[${33}m${`keyEndedAt`}\u001b[${39}m`} = ${keyEndedAt}; ${`\u001b[${33}m${`valueStartedAt`}\u001b[${39}m`} = ${valueStartedAt}; ${`\u001b[${33}m${`valueEndedAt`}\u001b[${39}m`} = ${valueEndedAt}`
    );
  }
  console.log(
    `\n\u001b[${36}m${`===============================`}\u001b[${39}m`
  );

  return str;
}

export { set };
