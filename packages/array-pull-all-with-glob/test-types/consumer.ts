import { pull } from "array-pull-all-with-glob";

const result: string[] = pull(["keep", "remove"], "remove", null);
const readonlySource = ["keep", "remove"] as const;
const readonlyPatterns = ["remove"] as const;
const readonlyResult: string[] = pull(readonlySource, readonlyPatterns);

void [result, readonlyResult];
