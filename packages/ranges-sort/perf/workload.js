import { rSort } from "../dist/ranges-sort.esm.js";

// Setup is outside the timed function. Freezing every level catches accidental
// mutation and keeps every benchmark iteration on the same representative data.
const representativeRanges = Object.freeze(
  [
    [48, 52, "omega"],
    [5, 9, "first tie"],
    [0, 2],
    [19, 24, null],
    [5, 7],
    [31, 34, "wide"],
    [12, 18],
    [5, 9, "second tie"],
    [2, 4],
    [48, 50],
    [7, 11],
    [1, 3, "lead"],
    [24, 29],
    [12, 15, "short"],
    [40, 45],
    [31, 33],
    [16, 20],
    [5, 9, "third tie"],
    [29, 31],
    [8, 10],
    [22, 27],
    [3, 6],
    [35, 39],
    [12, 18, "second twelve"],
    [50, 55],
    [14, 17],
    [26, 30],
    [9, 13],
    [40, 44, "shorter"],
    [18, 21],
    [0, 1, "prefix"],
    [55, 60],
  ].map((range) => Object.freeze(range)),
);

const testme = () => rSort(representativeRanges);

export { representativeRanges, testme };
