import { expectType } from "tsd";
import isJinjaSpecific = require(".");

expectType<RegExp>(isJinjaSpecific());
