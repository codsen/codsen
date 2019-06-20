import { version } from "../package.json";
const isArr = Array.isArray;

// adds digits until single digit or digit less than 26 is reached
// 234 => 2 + 3 + 4 => 9
// 990 => 9 + 9 + 0 => 18 => 18 (because 18 < 26, we're already within range)
function extract(num) {
  // console.log("\n---------");
  // console.log(`009 extract() called on ${num}, limit ${limit}`);
  if (num < 26) {
    return num;
  }
  while (num > 9) {
    num = Array.from(String(num)).reduce((accum, curr) => {
      return accum + Number.parseInt(curr);
    }, 0);
    // console.log(`017 extract() calculated new num = ${num}`);

    if (num < 26) {
      return num;
    }
  }
}

// tells code point of a given id number
function tellcp(str, idNum) {
  return str.codePointAt(idNum);
}

// main function - converts n-th string in a given reference array of strings
function uglifyById(refArr, idNum) {
  return uglifyArr(refArr)[idNum];
}

// converts whole array into array uglified names
function uglifyArr(arr) {
  const letters = "abcdefghijklmnopqrstuvwxyz";

  // final array we'll assemble and eventually return
  const res = [];

  // quick end
  if (!isArr(arr) || !arr.length) {
    return arr;
  }

  const gatheredSoFar = [];
  // let singleCounts = 0;
  // let doubleCounts = 0;
  // let tripleCounts = 0;
  // let quadrupleCounts = 0;
  let previousResCount;
  for (let id = 0, len = arr.length; id < len; id++) {
    previousResCount = res.length;
    // console.log(`old previousResCount = ${previousResCount}`);
    const prefix = `.#`.includes(arr[id][0]) ? arr[id][0] : "";

    const nums = [
      extract(Array.from(arr[id]).reduce((acc, curr) => acc + tellcp(curr), 0)),
      extract(
        Array.from(arr[id]).reduce(
          (acc, curr) =>
            acc < 1000 ? acc * tellcp(curr) : extract(acc * tellcp(curr) - 1),
          1
        )
      ),
      extract(
        Array.from(arr[id]).reduce(
          (acc, curr) => extract(acc * tellcp(curr) + 1),
          1
        )
      )
    ];
    nums.push(extract(nums[0] + 11));
    nums.push(extract(nums[1] + 12));
    nums.push(extract(nums[2] + 13));

    nums.push(extract(nums[0] * nums[1]));
    nums.push(extract(nums[1] * nums[2]));
    nums.push(extract(nums[2] * nums[0]));

    nums.push(extract(nums[0] * nums[1] + 11));
    nums.push(extract(nums[1] * nums[0] + 12));
    nums.push(extract(nums[2] * nums[1] + 13));

    nums.push(extract((nums[0] + 1) * (nums[1] + 2)));
    nums.push(extract((nums[1] + 2) * (nums[1] + 3)));
    nums.push(extract((nums[2] + 3) * (nums[0] + 4)));

    // console.log(
    //   `${`\u001b[${33}m${`nums`}\u001b[${39}m`} = ${JSON.stringify(
    //     nums,
    //     null,
    //     0
    //   )}`
    // );

    let calculated;
    do {
      // console.log("===================================");
      if (!gatheredSoFar.length) {
        gatheredSoFar.push(0);
        // console.log(`105 push 0`);
      } else {
        // console.log(
        //   `108 gatheredSoFar = ${`\u001b[${36}m${JSON.stringify(
        //     gatheredSoFar,
        //     null,
        //     0
        //   )}\u001b[${39}m`}`
        // );
        let i = 0;
        let bumpNext = false;
        while (i < gatheredSoFar.length) {
          // console.log(
          //   `118 ---- looping ${i}th element = ${
          //     gatheredSoFar[i]
          //   } out of ${JSON.stringify(gatheredSoFar, null, 0)} ----`
          // );
          if (bumpNext) {
            bumpNext = false;
            // console.log(`124 bumpNext = false`);
          }

          // gatheredSoFar[i]
          if (gatheredSoFar[i] < nums.length - 1) {
            gatheredSoFar[i] += 1;
            // console.log(
            //   `131 gatheredSoFar[${i}] = ${JSON.stringify(
            //     gatheredSoFar[i],
            //     null,
            //     0
            //   )}; then BREAK`
            // );
            break;
          } else {
            gatheredSoFar[i] = 0;
            // console.log(`140 gatheredSoFar[${i}] = 0`);
            if (gatheredSoFar[i + 1] === undefined) {
              gatheredSoFar.push(0);
              // console.log(`143 push 0; then BREAK`);
              break;
            } else {
              bumpNext = true;
              // console.log(`147 bumpNext = true`);
            }
          }
          i++;
        }
      }
      calculated = `${prefix}${gatheredSoFar
        .map(id => letters[nums[id]])
        .join("")}`;
    } while (res.includes(calculated));

    // if (gatheredSoFar.length === 1) {
    //   singleCounts++;
    // } else if (gatheredSoFar.length === 2) {
    //   doubleCounts++;
    // } else if (gatheredSoFar.length === 3) {
    //   tripleCounts++;
    // } else if (gatheredSoFar.length === 4) {
    //   quadrupleCounts++;
    // }
    res.push(`${prefix}${gatheredSoFar.map(id => letters[nums[id]]).join("")}`);
    if (res.length === previousResCount) {
      throw new Error("string-uglify: [THROW_ID_01] internal error!");
    } else {
      previousResCount = res.length;
      // console.log(`new previousResCount = ${previousResCount}`);
    }
  }
  // console.log("-----");

  // console.log(
  //   `178 FINAL ${`\u001b[${33}m${`res.length`}\u001b[${39}m`} = ${JSON.stringify(
  //     res.length,
  //     null,
  //     4
  //   )} (${
  //     res.length
  //   }); singles: ${singleCounts}; doubles: ${doubleCounts}; triples: ${tripleCounts}; quadruples: ${quadrupleCounts}`
  // );
  return res;
}

// main export
export { uglifyById, uglifyArr, version };
