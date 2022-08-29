import { version as v } from "../package.json";

const version: string = v;

declare let DEV: boolean;

export interface Opts {
  cb: () => string;
}

export interface Res {
  result: {
    extracted: string;
    counts: number[];
    length: number;
    lengthCompensation: number;
  }[];
  chunkWordCounts: number[];
  todoTotal: number;
  completion: number[];
  log: {
    timeTakenInMilliseconds: number;
  };
}

export function isLetter(str: unknown): boolean {
  return (
    typeof str === "string" &&
    str.length === 1 &&
    str.toUpperCase() !== str.toLowerCase()
  );
}

export function setLengthCompensation(
  resultArr: Res["result"],
  receivedMaxLen: number
) {
  for (let i = resultArr.length; i--; ) {
    DEV &&
      console.log(
        `041 ${`\u001b[${36}m${`----`}\u001b[${39}m`} ${`\u001b[${33}m${`resultArr[${i}]`}\u001b[${39}m`} = ${JSON.stringify(
          resultArr[i],
          null,
          4
        )}`
      );
    if (!resultArr[i]?.counts?.length) {
      DEV &&
        console.log(
          `050 ${`\u001b[${36}m${`----`}\u001b[${39}m`} ${`\u001b[${31}m${`break`}\u001b[${39}m`}`
        );
      break;
    } else {
      resultArr[i].lengthCompensation = receivedMaxLen - resultArr[i].length;
    }
  }
  return resultArr;
}

/*!
 * word-regex <https://github.com/jonschlinkert/word-regex>
 *
 * Copyright (c) 2015 Jon Schlinkert.
 * Licensed under the MIT license.
 */
const wordRegex =
  /[a-zA-Z0-9_'\u0392-\u03c9\u0400-\u04FF\u0027]+|[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af\u0400-\u04FF]+|[\u00E4\u00C4\u00E5\u00C5\u00F6\u00D6]+|[\u0531-\u0556\u0561-\u0586\u0559\u055A\u055B]+|\w+/g;

/**
 * removes markdown headings and citation blocks
 * @param str input
 */
function prepChunk(str: string): string {
  return str
    .split(/\r?\n/)
    .filter(
      (line) => !line.trim().startsWith("#") && !line.trim().startsWith(">")
    )
    .join("\n")
    .trim();
}

/**
 * Tells, is line a suitable to-do entry
 * @param lineStr
 * @returns boolean
 */
function isSuitable(lineStr: string): boolean {
  return typeof lineStr === "string" && lineStr.trim().startsWith("- ");
}

function editor(todo = "", copy = "", opts?: Partial<Opts>): Res {
  let start = Date.now();
  DEV &&
    console.log(
      `096 received ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
        opts,
        null,
        4
      )}`
    );

  let chunksArr = copy
    .split(/---+/)
    .map((ch) => prepChunk(ch).toLowerCase())
    .filter((ch) => ch.trim());
  DEV &&
    console.log(
      `${`\u001b[${33}m${`chunksArr`}\u001b[${39}m`} = ${JSON.stringify(
        chunksArr,
        null,
        4
      )}`
    );

  let result: Res["result"] = [];
  let maxLen = 0;

  let todoTotal = 0;
  let completion = chunksArr.length ? chunksArr.map(() => 0) : [0];
  DEV &&
    console.log(
      `123 initial ${`\u001b[${33}m${`completion`}\u001b[${39}m`} = ${JSON.stringify(
        completion,
        null,
        4
      )}`
    );

  let todoLines = todo.toLowerCase().split(/\r?\n/);

  // early exit
  if (!todo.trim()) {
    return {
      result: [],
      chunkWordCounts: chunksArr.map(
        (chunk) => chunk.match(wordRegex)?.length || 0
      ),
      todoTotal: 0,
      completion: chunksArr.length ? chunksArr.map(() => 0) : [0],
      log: {
        timeTakenInMilliseconds: Date.now() - start,
      },
    };
  }

  todoLines.forEach((lineStr, i) => {
    DEV &&
      console.log(
        `150 ${`\u001b[${36}m${`███████████████████████████████████████`}\u001b[${39}m`} ${`\u001b[${33}m${i}\u001b[${39}m`} ${lineStr}`
      );
    if (isSuitable(lineStr)) {
      DEV &&
        console.log(
          `155 ${`\u001b[${32}m${`suitable todo line`}\u001b[${39}m`}`
        );
      todoTotal++;

      let extracted = lineStr.trim().slice(2).trim();
      let { length } = extracted;
      DEV &&
        console.log(
          `163 ${`\u001b[${33}m${`extracted`}\u001b[${39}m`} = ${JSON.stringify(
            extracted,
            null,
            4
          )}`
        );
      maxLen = Math.max(maxLen, extracted.length);
      DEV &&
        console.log(
          `172 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`lengthCompensation`}\u001b[${39}m`} = ${JSON.stringify(
            maxLen,
            null,
            4
          )}`
        );
      result.push({
        extracted,
        length,
        counts: chunksArr.map((chunk, chunkIdx) => {
          DEV && console.log(`182 ██`);
          DEV && console.log(`183 chunk: ${JSON.stringify(chunk, null, 4)}`);
          // quick exit if string does not include our string
          if (!chunk.includes(extracted)) {
            DEV &&
              console.log(
                `188 ${`\u001b[${31}m${`"${extracted}" not found`}\u001b[${39}m`}`
              );
            DEV &&
              console.log(`191 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} 0`);
            return 0;
          }
          DEV &&
            console.log(
              `196 ${`\u001b[${32}m${`"${extracted}" found`}\u001b[${39}m`}`
            );
          // we need to count all instances
          let total = 0;
          let startIdx = 0;
          while (chunk.includes(extracted, startIdx)) {
            let findingStartsAt = chunk.indexOf(extracted, startIdx);
            DEV &&
              console.log(
                `205 ${`\u001b[${33}m${`findingStartsAt`}\u001b[${39}m`} = ${JSON.stringify(
                  findingStartsAt,
                  null,
                  4
                )}`
              );
            DEV &&
              console.log(
                `213 in front: idx ${findingStartsAt - 1}; follows: idx ${
                  findingStartsAt + extracted.length
                }`
              );
            if (
              // ensure there's no letter in front, for example
              // we don't match "lake" in "Blake":
              !isLetter(chunk[findingStartsAt - 1]) &&
              !isLetter(chunk[findingStartsAt + extracted.length])
            ) {
              total += 1;
              DEV &&
                console.log(
                  `226 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`total`}\u001b[${39}m`} = ${JSON.stringify(
                    total,
                    null,
                    4
                  )}`
                );
            }
            // offset the search start, prepare for next finding
            DEV &&
              console.log(
                `236 OLD ${`\u001b[${33}m${`startIdx`}\u001b[${39}m`} = ${JSON.stringify(
                  startIdx,
                  null,
                  4
                )}`
              );
            startIdx += findingStartsAt + extracted.length;
            DEV &&
              console.log(
                `245 NEW ${`\u001b[${33}m${`startIdx`}\u001b[${39}m`} = ${JSON.stringify(
                  startIdx,
                  null,
                  4
                )}`
              );
          }

          if (total) {
            completion[chunkIdx] += 1;
          }

          DEV &&
            console.log(
              `259 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} ${total}`
            );
          return total;
        }),
        lengthCompensation: maxLen,
      });
      DEV &&
        console.log(
          `267 now ${`\u001b[${33}m${`result`}\u001b[${39}m`} = ${JSON.stringify(
            result,
            null,
            4
          )}`
        );
    } else {
      // traverse objects backwards and set their lengthCompensation
      DEV &&
        console.log(
          `277 ██ ${`\u001b[${33}m${`result`}\u001b[${39}m`} = ${JSON.stringify(
            result,
            null,
            4
          )}`
        );
      if (result[~-result.length]?.counts.length) {
        DEV &&
          console.log(
            `286 ${`\u001b[${35}m${`traverse backwards`}\u001b[${39}m`}`
          );
        DEV &&
          console.log(
            `290 ${`\u001b[${32}m${`BEFORE`}\u001b[${39}m`} ${`\u001b[${33}m${`result`}\u001b[${39}m`} = ${JSON.stringify(
              result,
              null,
              4
            )}; maxLen = ${maxLen}`
          );
        result = setLengthCompensation(result, maxLen);
        DEV &&
          console.log(
            `299 ${`\u001b[${32}m${`AFTER`}\u001b[${39}m`} ${`\u001b[${33}m${`result`}\u001b[${39}m`} = ${JSON.stringify(
              result,
              null,
              4
            )}`
          );
      }

      DEV &&
        console.log(
          `309 ${`\u001b[${31}m${`skip this todo line`}\u001b[${39}m`}`
        );
      result.push({
        extracted: "",
        counts: [],
        length: 0,
        lengthCompensation: 0,
      });

      maxLen = 0;
    }
    DEV &&
      console.log(
        `322 ending ${`\u001b[${33}m${`lengthCompensation`}\u001b[${39}m`} = ${JSON.stringify(
          maxLen,
          null,
          4
        )}`
      );
  });

  // Since the patching of all "lengthCompensation" gets triggered
  // on a non-workable line, we need to tacke a case where workable
  // line leads to end of string.

  DEV &&
    console.log(
      `336 FINAL ${`\u001b[${33}m${`result`}\u001b[${39}m`} = ${JSON.stringify(
        result,
        null,
        4
      )}`
    );

  DEV &&
    console.log(
      `345 LAST TODO LINE ${`\u001b[${33}m${`todoLines`}\u001b[${39}m`} = ${JSON.stringify(
        todoLines[~-todoLines.length],
        null,
        4
      )}`
    );

  // if the last line in todo is suitable, this means the lengthCompensation
  // of its own and any surrounding entries above hasn't been set
  if (isSuitable(todoLines[~-todoLines.length])) {
    DEV &&
      console.log(
        `357 todo's leading to EOL! ${`\u001b[${32}m${`traverse backwards`}\u001b[${39}m`}`
      );
    DEV &&
      console.log(
        `361 ${`\u001b[${32}m${`BEFORE`}\u001b[${39}m`} ${`\u001b[${33}m${`result`}\u001b[${39}m`} = ${JSON.stringify(
          result,
          null,
          4
        )}; maxLen = ${maxLen}`
      );
    result = setLengthCompensation(result, maxLen);
    DEV &&
      console.log(
        `370 ${`\u001b[${32}m${`AFTER`}\u001b[${39}m`} ${`\u001b[${33}m${`result`}\u001b[${39}m`} = ${JSON.stringify(
          result,
          null,
          4
        )}`
      );
  }

  return {
    result,
    chunkWordCounts: chunksArr.map(
      (chunk) => chunk.match(wordRegex)?.length || 0
    ),
    todoTotal,
    completion,
    log: {
      timeTakenInMilliseconds: Date.now() - start,
    },
  };
}

// main export
export { editor, version };
