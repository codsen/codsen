import { pull } from "array-pull-all-with-glob";

const result: string[] = pull(["keep", "remove"], "remove", null);

void result;
