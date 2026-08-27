import { version as v } from "../package.json";
import { parent } from "./util/parent";
import { pathNext } from "./util/pathNext";
import { pathPrev } from "./util/pathPrev";
import { pathUp } from "./util/pathUp";

const version: string = v;

// -----------------------------------------------------------------------------

export { parent, pathNext, pathPrev, pathUp, version };
