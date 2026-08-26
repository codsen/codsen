import { rMerge } from "ranges-merge";

rMerge(
  [
    [1, 2],
    [0, 1],
  ],
  { progressFn: false },
);
