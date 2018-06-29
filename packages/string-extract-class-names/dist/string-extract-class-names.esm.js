import replace from 'lodash.replace';
import without from 'lodash.without';
import flattenDeep from 'lodash.flattendeep';

function stringExtractClassNames(input) {
  if (input === undefined) {
    throw new Error();
  }
  function chopBeginning(str) {
    return replace(str, /[^.#]*/m, "");
  }
  function chopEnding(str) {
    return replace(str, /[ ~\\!@$%^&*()+=,/';:"?><[\]\\{}|`].*/g, "");
  }
  function existy(x) {
    return x != null;
  }
  let temp = input.replace(/[\0'"\\\n\r\v\t\b\f]/g, " ").split(/([.#])/);
  temp.forEach((el, i) => {
    if (el === "." || el === "#") {
      if (existy(temp[i + 1])) {
        temp[i + 1] = el + temp[i + 1];
      }
      temp[i] = "";
    }
  });
  temp.forEach((el, i) => {
    temp[i] = without(
      chopEnding(chopBeginning(temp[i])).split(/([.#][^.#]*)/),
      ""
    );
  });
  temp = flattenDeep(temp);
  temp = without(temp, ".", "#");
  return temp;
}

export default stringExtractClassNames;
