import { expectType } from "tsd";
import isJinjaNunjucksRegex = require(".");

expectType<RegExp>(isJinjaNunjucksRegex());
