import { pathNext } from "./util/pathNext";
import { pathPrev } from "./util/pathPrev";
import { pathUp } from "./util/pathUp";
import { parentItem } from "./util/parent";
import { version as v } from "../package.json";

const version: string = v;

// -----------------------------------------------------------------------------

export { pathNext, pathPrev, pathUp, parentItem as parent, version };
