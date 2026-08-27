import { trimSpaces, type Res } from "string-trim-spaces-only";

const result: Res = trimSpaces("  value  ");
const rangeCount: number = result.ranges.length;
const firstBoundary: number | undefined = result.ranges[0]?.[0];

void rangeCount;
void firstBoundary;
