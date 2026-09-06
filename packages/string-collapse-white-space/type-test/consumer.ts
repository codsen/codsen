import {
  type Callback,
  type CbObj,
  collapse,
  type Range,
} from "string-collapse-white-space";

const callback: Callback = ({ suggested }) => {
  // @ts-expect-error unchanged whitespace has a null suggestion
  const unsafeStart: number = suggested[0];
  void unsafeStart;
  return suggested === null ? null : [suggested[0], suggested[1], "-"];
};
const nullableSuggestion: CbObj["suggested"] = null;
const suggestion: Range | null = nullableSuggestion;
const result: string = collapse("a b", { cb: callback }).result;
void suggestion;
void result;
