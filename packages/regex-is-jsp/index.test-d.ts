import { expectType } from "tsd";
import isJSP = require(".");

expectType<RegExp>(isJSP());
