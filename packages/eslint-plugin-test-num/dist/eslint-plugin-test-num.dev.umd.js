/**
 * eslint-plugin-test-num
 * ESLint plugin to update unit test numbers automatically
 * Version: 1.1.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/eslint-plugin-test-num
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = global || self, global.eslintPluginTestNum = factory());
}(this, (function () { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var objectPath = createCommonjsModule(function (module) {
	  (function (root, factory) {
	    /*istanbul ignore next:cant test*/

	    {
	      module.exports = factory();
	    }
	  })(commonjsGlobal, function () {

	    var toStr = Object.prototype.toString;

	    function hasOwnProperty(obj, prop) {
	      if (obj == null) {
	        return false;
	      } //to handle objects with null prototypes (too edge case?)


	      return Object.prototype.hasOwnProperty.call(obj, prop);
	    }

	    function isEmpty(value) {
	      if (!value) {
	        return true;
	      }

	      if (isArray(value) && value.length === 0) {
	        return true;
	      } else if (typeof value !== 'string') {
	        for (var i in value) {
	          if (hasOwnProperty(value, i)) {
	            return false;
	          }
	        }

	        return true;
	      }

	      return false;
	    }

	    function toString(type) {
	      return toStr.call(type);
	    }

	    function isObject(obj) {
	      return typeof obj === 'object' && toString(obj) === "[object Object]";
	    }

	    var isArray = Array.isArray || function (obj) {
	      /*istanbul ignore next:cant test*/
	      return toStr.call(obj) === '[object Array]';
	    };

	    function isBoolean(obj) {
	      return typeof obj === 'boolean' || toString(obj) === '[object Boolean]';
	    }

	    function getKey(key) {
	      var intKey = parseInt(key);

	      if (intKey.toString() === key) {
	        return intKey;
	      }

	      return key;
	    }

	    function factory(options) {
	      options = options || {};

	      var objectPath = function (obj) {
	        return Object.keys(objectPath).reduce(function (proxy, prop) {
	          if (prop === 'create') {
	            return proxy;
	          }
	          /*istanbul ignore else*/


	          if (typeof objectPath[prop] === 'function') {
	            proxy[prop] = objectPath[prop].bind(objectPath, obj);
	          }

	          return proxy;
	        }, {});
	      };

	      function hasShallowProperty(obj, prop) {
	        return options.includeInheritedProps || typeof prop === 'number' && Array.isArray(obj) || hasOwnProperty(obj, prop);
	      }

	      function getShallowProperty(obj, prop) {
	        if (hasShallowProperty(obj, prop)) {
	          return obj[prop];
	        }
	      }

	      function set(obj, path, value, doNotReplace) {
	        if (typeof path === 'number') {
	          path = [path];
	        }

	        if (!path || path.length === 0) {
	          return obj;
	        }

	        if (typeof path === 'string') {
	          return set(obj, path.split('.').map(getKey), value, doNotReplace);
	        }

	        var currentPath = path[0];
	        var currentValue = getShallowProperty(obj, currentPath);

	        if (path.length === 1) {
	          if (currentValue === void 0 || !doNotReplace) {
	            obj[currentPath] = value;
	          }

	          return currentValue;
	        }

	        if (currentValue === void 0) {
	          //check if we assume an array
	          if (typeof path[1] === 'number') {
	            obj[currentPath] = [];
	          } else {
	            obj[currentPath] = {};
	          }
	        }

	        return set(obj[currentPath], path.slice(1), value, doNotReplace);
	      }

	      objectPath.has = function (obj, path) {
	        if (typeof path === 'number') {
	          path = [path];
	        } else if (typeof path === 'string') {
	          path = path.split('.');
	        }

	        if (!path || path.length === 0) {
	          return !!obj;
	        }

	        for (var i = 0; i < path.length; i++) {
	          var j = getKey(path[i]);

	          if (typeof j === 'number' && isArray(obj) && j < obj.length || (options.includeInheritedProps ? j in Object(obj) : hasOwnProperty(obj, j))) {
	            obj = obj[j];
	          } else {
	            return false;
	          }
	        }

	        return true;
	      };

	      objectPath.ensureExists = function (obj, path, value) {
	        return set(obj, path, value, true);
	      };

	      objectPath.set = function (obj, path, value, doNotReplace) {
	        return set(obj, path, value, doNotReplace);
	      };

	      objectPath.insert = function (obj, path, value, at) {
	        var arr = objectPath.get(obj, path);
	        at = ~~at;

	        if (!isArray(arr)) {
	          arr = [];
	          objectPath.set(obj, path, arr);
	        }

	        arr.splice(at, 0, value);
	      };

	      objectPath.empty = function (obj, path) {
	        if (isEmpty(path)) {
	          return void 0;
	        }

	        if (obj == null) {
	          return void 0;
	        }

	        var value, i;

	        if (!(value = objectPath.get(obj, path))) {
	          return void 0;
	        }

	        if (typeof value === 'string') {
	          return objectPath.set(obj, path, '');
	        } else if (isBoolean(value)) {
	          return objectPath.set(obj, path, false);
	        } else if (typeof value === 'number') {
	          return objectPath.set(obj, path, 0);
	        } else if (isArray(value)) {
	          value.length = 0;
	        } else if (isObject(value)) {
	          for (i in value) {
	            if (hasShallowProperty(value, i)) {
	              delete value[i];
	            }
	          }
	        } else {
	          return objectPath.set(obj, path, null);
	        }
	      };

	      objectPath.push = function (obj, path
	      /*, values */
	      ) {
	        var arr = objectPath.get(obj, path);

	        if (!isArray(arr)) {
	          arr = [];
	          objectPath.set(obj, path, arr);
	        }

	        arr.push.apply(arr, Array.prototype.slice.call(arguments, 2));
	      };

	      objectPath.coalesce = function (obj, paths, defaultValue) {
	        var value;

	        for (var i = 0, len = paths.length; i < len; i++) {
	          if ((value = objectPath.get(obj, paths[i])) !== void 0) {
	            return value;
	          }
	        }

	        return defaultValue;
	      };

	      objectPath.get = function (obj, path, defaultValue) {
	        if (typeof path === 'number') {
	          path = [path];
	        }

	        if (!path || path.length === 0) {
	          return obj;
	        }

	        if (obj == null) {
	          return defaultValue;
	        }

	        if (typeof path === 'string') {
	          return objectPath.get(obj, path.split('.'), defaultValue);
	        }

	        var currentPath = getKey(path[0]);
	        var nextObj = getShallowProperty(obj, currentPath);

	        if (nextObj === void 0) {
	          return defaultValue;
	        }

	        if (path.length === 1) {
	          return nextObj;
	        }

	        return objectPath.get(obj[currentPath], path.slice(1), defaultValue);
	      };

	      objectPath.del = function del(obj, path) {
	        if (typeof path === 'number') {
	          path = [path];
	        }

	        if (obj == null) {
	          return obj;
	        }

	        if (isEmpty(path)) {
	          return obj;
	        }

	        if (typeof path === 'string') {
	          return objectPath.del(obj, path.split('.'));
	        }

	        var currentPath = getKey(path[0]);

	        if (!hasShallowProperty(obj, currentPath)) {
	          return obj;
	        }

	        if (path.length === 1) {
	          if (isArray(obj)) {
	            obj.splice(currentPath, 1);
	          } else {
	            delete obj[currentPath];
	          }
	        } else {
	          return objectPath.del(obj[currentPath], path.slice(1));
	        }

	        return obj;
	      };

	      return objectPath;
	    }

	    var mod = factory();
	    mod.create = factory;
	    mod.withInheritedProps = factory({
	      includeInheritedProps: true
	    });
	    return mod;
	  });
	});

	function _defineProperty(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function ownKeys(object, enumerableOnly) {
	  var keys = Object.keys(object);

	  if (Object.getOwnPropertySymbols) {
	    var symbols = Object.getOwnPropertySymbols(object);
	    if (enumerableOnly) symbols = symbols.filter(function (sym) {
	      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
	    });
	    keys.push.apply(keys, symbols);
	  }

	  return keys;
	}

	function _objectSpread2(target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i] != null ? arguments[i] : {};

	    if (i % 2) {
	      ownKeys(Object(source), true).forEach(function (key) {
	        _defineProperty(target, key, source[key]);
	      });
	    } else if (Object.getOwnPropertyDescriptors) {
	      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
	    } else {
	      ownKeys(Object(source)).forEach(function (key) {
	        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
	      });
	    }
	  }

	  return target;
	}

	function prep(str, originalOpts) {
	  // console.log(
	  //   `003 prep(): ${`\u001b[${32}m${`RECEIVED`}\u001b[${39}m`} >>>${str}<<<`
	  // );

	  /* istanbul ignore if */
	  if (typeof str !== "string" || !str.length) {
	    return;
	  }

	  var defaults = {
	    offset: 0
	  };

	  var opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts); // console.log(
	  //   `015 prep(): final ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
	  //     opts,
	  //     null,
	  //     4
	  //   )}`
	  // );
	  // So it's a non-empty string. Traverse!


	  var digitsChunkStartsAt = null;
	  var lastDigitAt; // console.log(
	  //   `028 prep(): ${`\u001b[${36}m${`traverse starts`}\u001b[${39}m`}`
	  // );

	  for (var i = 0, len = str.length; i <= len; i++) {
	    // console.log(
	    //   `032 prep(): ${`\u001b[${36}m${`======================== str[${i}]= ${`\u001b[${35}m${
	    //     str[i] && str[i].trim().length
	    //       ? str[i]
	    //       : JSON.stringify(str[i], null, 4)
	    //   }\u001b[${39}m`} ========================`}\u001b[${39}m`}`
	    // );
	    // catch the end of the digit chunk
	    // -------------------------------------------------------------------------
	    if ( // if chunk has been recorded as already started
	    digitsChunkStartsAt !== null && ( // and
	    // a) it's not a whitespace
	    str[i] && str[i].trim().length && // it's not a number
	    !/\d/.test(str[i]) && // and it's not a dot or hyphen
	    !["."].includes(str[i]) || // OR
	    // b) we reached the end (we traverse up to and including str.length,
	    // which is "undefined" character; notice i <= len in the loop above,
	    // normally it would be i < len)
	    !str[i])) {
	      // console.log(
	      //   `059 prep(): ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`}: "${JSON.stringify(
	      //     {
	      //       start: opts.offset + digitsChunkStartsAt,
	      //       end: opts.offset + lastDigitAt + 1,
	      //       value: str.slice(digitsChunkStartsAt, lastDigitAt + 1),
	      //     },
	      //     null,
	      //     4
	      //   )}"`
	      // );
	      return {
	        start: opts.offset + digitsChunkStartsAt,
	        end: opts.offset + lastDigitAt + 1,
	        value: str.slice(digitsChunkStartsAt, lastDigitAt + 1)
	      };
	    } // catch digits
	    // -------------------------------------------------------------------------


	    if (/^\d*$/.test(str[i])) {
	      // 1. note that
	      lastDigitAt = i; // 2. catch the start of the first digit

	      if ( // if chunk hasn't been recorded yet
	      digitsChunkStartsAt === null) {
	        digitsChunkStartsAt = i; // console.log(
	        //   `089 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`digitsChunkStartsAt`}\u001b[${39}m`} = ${JSON.stringify(
	        //     digitsChunkStartsAt,
	        //     null,
	        //     4
	        //   )}`
	        // );
	      }
	    } // catch false scenario cases where letters precede numbers
	    // -------------------------------------------------------------------------


	    if ( // chunk hasn't been detected yet:
	    digitsChunkStartsAt === null && // it's not whitespace:
	    str[i] && str[i].trim().length && // it's not dot or digit or some kind of quote:
	    !/[\d.'"`]/.test(str[i])) {
	      // console.log(`109 ${`\u001b[${31}m${`early bail`}\u001b[${39}m`}`);
	      return;
	    } // logging
	    // -------------------------------------------------------------------------
	    // console.log(" ");
	    // console.log(
	    //   `${`\u001b[${90}m${`██ digitsChunkStartsAt = ${digitsChunkStartsAt}`}\u001b[${39}m`}`
	    // );
	    // console.log(
	    //   `${`\u001b[${90}m${`██ lastDigitAt = ${lastDigitAt}`}\u001b[${39}m`}`
	    // );
	    // console.log(`${`\u001b[${90}m${`----------------`}\u001b[${39}m`}`);

	  }
	}

	/* eslint no-cond-assign: 0 */
	// compiled from https://node-tap.org/docs/api/asserts/

	var messageIsSecondArg = new Set(["ok", "notOk", "true", "false", "assert", "assertNot", "error", "ifErr", "ifError", "rejects", // "rejects" message can be 2nd or 3rd arg!!!
	"resolves", "resolveMatchSnapshot", "throws", // "throws" message can be 2nd or 3rd arg!!!
	"throw", // "throw" message can be 2nd or 3rd arg!!!
	"doesNotThrow", "notThrow", "expectUncaughtException" // "expectUncaughtException" message can be 2nd or 3rd arg!!!
	]); // compiled from https://node-tap.org/docs/api/asserts/

	var messageIsThirdArg = new Set(["emits", "rejects", // "rejects" message can be 2nd or 3rd arg!!!
	"resolveMatch", "throws", // "throws" message can be 2nd or 3rd arg!!!
	"throw", // "throw" message can be 2nd or 3rd arg!!!
	"expectUncaughtException", // "expectUncaughtException" message can be 2nd or 3rd arg!!!
	"equal", "equals", "isEqual", "is", "strictEqual", "strictEquals", "strictIs", "isStrict", "isStrictly", "notEqual", "inequal", "notEqual", "notEquals", "notStrictEqual", "notStrictEquals", "isNotEqual", "isNot", "doesNotEqual", "isInequal", "same", "equivalent", "looseEqual", "looseEquals", "deepEqual", "deepEquals", "isLoose", "looseIs", "notSame", "inequivalent", "looseInequal", "notDeep", "deepInequal", "notLoose", "looseNot", "strictSame", "strictEquivalent", "strictDeepEqual", "sameStrict", "deepIs", "isDeeply", "isDeep", "strictDeepEquals", "strictNotSame", "strictInequivalent", "strictDeepInequal", "notSameStrict", "deepNot", "notDeeply", "strictDeepInequals", "notStrictSame", "hasStrict", "match", "has", "hasFields", "matches", "similar", "like", "isLike", "includes", "include", "contains", "notMatch", "dissimilar", "unsimilar", "notSimilar", "unlike", "isUnlike", "notLike", "isNotLike", "doesNotHave", "isNotSimilar", "isDissimilar", "type", "isa", "isA"]);

	var create = function create(context) {
	  // console.log(
	  //   `117 ${`\u001b[${33}m${`███████████████████████████████████████`}\u001b[${39}m`}`
	  // );
	  var counter = 0;
	  return {
	    ExpressionStatement: function ExpressionStatement(node) {
	      if (objectPath.get(node, "expression.type") === "CallExpression" && ["test", "only", "skip"].includes(objectPath.get(node, "expression.callee.property.name")) && ["TemplateLiteral", "Literal"].includes(objectPath.get(node, "expression.arguments.0.type"))) {
	        // console.log(" ");
	        // console.log("-------------------------------");
	        // console.log(" ");
	        counter += 1; // console.log(
	        //   `${`\u001b[${33}m${`node.expression`}\u001b[${39}m`} #${`${counter}`.padStart(
	        //     2,
	        //     "0"
	        //   )}: ${node.expression.start}-${node.expression.end}`
	        // );

	        var testOrderNumber = "".concat(counter).padStart(2, "0"); // TACKLE THE FIRST ARG
	        // ████████████████████
	        // for example, the "09" in:
	        // t.test("09 - something", (t) => ...)
	        // it will be under "TemplateLiteral" node if backticks were used,
	        // for example:
	        // t.test(`09 - something`, (t) => ...) or "Literal" if quotes were used,
	        // for example:
	        // t.test("09 - something", (t) => ...)

	        var finalDigitChunk;

	        if (!finalDigitChunk && objectPath.get(node, "expression.arguments.0.type") === "TemplateLiteral" && objectPath.has(node, "expression.arguments.0.quasis.0.value.raw")) {
	          // console.log(" ");
	          // console.log(" ");
	          // console.log(
	          //   `167 ${`\u001b[${34}m${`██ TemplateLiteral caught!`}\u001b[${39}m`}`
	          // );
	          //
	          // console.log(
	          //   `171 node.expression.arguments[0].quasis[0].value.raw: "${node.expression.arguments[0].quasis[0].value.raw}"`
	          // );
	          var _ref = prep(objectPath.get(node, "expression.arguments.0.quasis.0.value.raw"), {
	            offset: objectPath.get(node, "expression.arguments.0.quasis.0.start"),
	            returnRangesOnly: true
	          }) || {},
	              start = _ref.start,
	              end = _ref.end,
	              value = _ref.value;

	          if (start && end && value && value !== testOrderNumber) {
	            // console.log(
	            //   `182 ${`\u001b[${33}m${`value`}\u001b[${39}m`} = ${JSON.stringify(
	            //     value,
	            //     null,
	            //     4
	            //   )}`
	            // );
	            // console.log("!==");
	            // console.log(
	            //   `190 ${`\u001b[${33}m${`testOrderNumber`}\u001b[${39}m`} = ${JSON.stringify(
	            //     testOrderNumber,
	            //     null,
	            //     4
	            //   )}`
	            // );
	            finalDigitChunk = {
	              start: start,
	              end: end,
	              value: testOrderNumber
	            }; // console.log(
	            //   `199 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`finalDigitChunk`}\u001b[${39}m`} = ${JSON.stringify(
	            //     finalDigitChunk,
	            //     null,
	            //     4
	            //   )}`
	            // );
	          }
	        }

	        if (!finalDigitChunk && node.expression.arguments[0].type === "Literal" && node.expression.arguments[0].raw) {
	          // console.log(" ");
	          // console.log(" ");
	          // console.log(
	          //   `216 ${`\u001b[${34}m${`██ Literal caught!`}\u001b[${39}m`}`
	          // );
	          var _ref2 = prep(node.expression.arguments[0].raw, {
	            offset: node.expression.arguments[0].start,
	            returnRangesOnly: true
	          }) || {},
	              _start = _ref2.start,
	              _end = _ref2.end,
	              _value = _ref2.value;

	          if (_start && _end && _value && _value !== testOrderNumber) {
	            finalDigitChunk = {
	              start: _start,
	              end: _end,
	              value: testOrderNumber
	            }; // console.log(
	            //   `228 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`finalDigitChunk`}\u001b[${39}m`} = ${JSON.stringify(
	            //     finalDigitChunk,
	            //     null,
	            //     4
	            //   )}`
	            // );
	          }
	        } // TACKLE THE THIRD ARG
	        // ████████████████████
	        // for example, the "09" in:
	        // t.test(
	        //   "some name",
	        //   (t) => {
	        //     t.same(fix("z &angst; y"), [], "09");
	        //     t.end();
	        //   }
	        // );


	        if (!finalDigitChunk && objectPath.get(node, "expression.arguments.1.type") === "ArrowFunctionExpression" && objectPath.get(node, "expression.arguments.1.body.type") === "BlockStatement" && objectPath.get(node, "expression.arguments.1.body.body").length) {
	          // console.log(" ");
	          // console.log(" ");
	          // console.log(
	          //   `259 ${`\u001b[${34}m${`██ Third arg literal found!`}\u001b[${39}m`}`
	          // );
	          // let's find out, is it a single test clause or there are multiple
	          var subTestCount = "multiple";
	          var filteredExpressionStatements = {};

	          if ((filteredExpressionStatements = objectPath.get(node, "expression.arguments.1.body.body").filter(function (nodeObj) {
	            return nodeObj.type === "ExpressionStatement";
	          })).length === 2 && // ensure last expression is t.end:
	          objectPath.get(filteredExpressionStatements[filteredExpressionStatements.length - 1], "expression.callee.property.name") === "end") {
	            subTestCount = "single";
	          } // console.log(
	          //   `282 ${`\u001b[${33}m${`subTestCount`}\u001b[${39}m`} = ${JSON.stringify(
	          //     subTestCount,
	          //     null,
	          //     4
	          //   )}`
	          // );


	          var exprStatements = objectPath.get(node, "expression.arguments.1.body.body");
	          /* istanbul ignore else */

	          if (Array.isArray(exprStatements)) {
	            // loop through expression statements, t.* calls inside the (t) => {...}
	            // this counter is to count expression statements and whatnot
	            // within the "expression.arguments.1.body.body" path (array).
	            //
	            // For example, within:
	            // tap.test(`01 - a`, (t) => {
	            //
	            // one might have many bits:
	            // 1. const k = ...
	            // 2. t.match(... <----- true index - #1
	            // 3. const l = ...
	            // 4. t.match(... <----- true index - #2
	            // 5. const m = ...
	            // 6. t.match(... <----- true index - #3
	            //
	            // but this index system above is wrong, we count only assertions -
	            // only *.only, *.test and *.skip
	            //
	            // this counter below will be that index counter
	            //
	            var counter2 = 0;

	            for (var i = 0, len = exprStatements.length; i < len; i++) {
	              // console.log(
	              //   `321 ${`\u001b[${90}m${`=================================`}\u001b[${39}m`}`
	              // );
	              var assertsName = objectPath.get(exprStatements[i], "expression.callee.property.name");

	              if (!assertsName) {
	                // console.log(
	                //   `329 ${`\u001b[${31}m${`error - no assert name could be extracted! CONTINUE`}\u001b[${39}m`}`
	                // );
	                continue;
	              } // console.log(
	              //   `335 #${i} - assert: ${`\u001b[${36}m${assertsName}\u001b[${39}m`}, category: ${`\u001b[${36}m${
	              //     messageIsThirdArg.has(assertsName)
	              //       ? "III"
	              //       : messageIsSecondArg.has(assertsName)
	              //       ? "II"
	              //       : "n/a"
	              //   }\u001b[${39}m`}`
	              // );
	              // "message" argument's position is variable, sometimes it can be
	              // either 2nd or 3rd


	              var messageArgsPositionWeWillAimFor = void 0;

	              if ( // assertion's name is known to contain "message" as third arg
	              messageIsThirdArg.has(assertsName) && // and there is an argument present at that position
	              objectPath.has(exprStatements[i], "expression.arguments.2")) {
	                messageArgsPositionWeWillAimFor = 2; // zero-based count
	              } else if ( // assertion's name is known to contain "message" as second arg
	              messageIsSecondArg.has(assertsName) && // and there is an argument present at that position
	              objectPath.has(exprStatements[i], "expression.arguments.1")) {
	                messageArgsPositionWeWillAimFor = 1; // zero-based count
	              } // console.log(
	              //   `364 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`messageArgsPositionWeWillAimFor`}\u001b[${39}m`} = ${JSON.stringify(
	              //     messageArgsPositionWeWillAimFor,
	              //     null,
	              //     4
	              //   )}`
	              // );


	              if (messageArgsPositionWeWillAimFor) {
	                var _ret = function () {
	                  // console.log(
	                  //   `373 ${`\u001b[${90}m${`let's extract the value from "message" arg in assertion`}\u001b[${39}m`}`
	                  // );
	                  // the "message" can be Literal (single/double quotes) or
	                  // TemplateLiteral (backticks)
	                  var pathToMsgArgValue = void 0;
	                  var pathToMsgArgStart = void 0;
	                  /* istanbul ignore else */

	                  if (objectPath.get(exprStatements[i], "expression.arguments.".concat(messageArgsPositionWeWillAimFor, ".type")) === "TemplateLiteral") {
	                    pathToMsgArgValue = objectPath.get(exprStatements[i], "expression.arguments.".concat(messageArgsPositionWeWillAimFor, ".quasis.0.value.raw"));
	                    pathToMsgArgStart = objectPath.get(exprStatements[i], "expression.arguments.".concat(messageArgsPositionWeWillAimFor, ".quasis.0.start"));
	                    counter2 += 1;
	                  } else if (objectPath.get(exprStatements[i], "expression.arguments.".concat(messageArgsPositionWeWillAimFor, ".type")) === "Literal") {
	                    pathToMsgArgValue = objectPath.get(exprStatements[i], "expression.arguments.".concat(messageArgsPositionWeWillAimFor, ".raw"));
	                    pathToMsgArgStart = objectPath.get(exprStatements[i], "expression.arguments.".concat(messageArgsPositionWeWillAimFor, ".start"));
	                    counter2 += 1;
	                  }

	                  var _ref3 = prep(pathToMsgArgValue, {
	                    offset: pathToMsgArgStart,
	                    returnRangesOnly: true
	                  }) || {},
	                      start = _ref3.start,
	                      end = _ref3.end;

	                  if (!start || !end) {
	                    // console.log(
	                    //   `422 ${`\u001b[${31}m${`SKIP`}\u001b[${39}m`} - no value extracted`
	                    // );
	                    return "continue";
	                  } // console.log(
	                  //   `428 old: ${`\u001b[${35}m${pathToMsgArgValue}\u001b[${39}m`} (pathToMsgArgValue)`
	                  // );
	                  // console.log(
	                  //   `431 old prepped value: ${`\u001b[${35}m${
	                  //     prep(pathToMsgArgValue).value
	                  //   }\u001b[${39}m`}`
	                  // );


	                  var newValue = subTestCount === "single" ? testOrderNumber : "".concat(testOrderNumber, ".").concat("".concat(counter2).padStart(2, "0")); // console.log(
	                  //   `442 new: ${`\u001b[${35}m${newValue}\u001b[${39}m`}  range: ${`\u001b[${35}m${`[${start}, ${end}]`}\u001b[${39}m`}`
	                  // );

	                  if (prep(pathToMsgArgValue).value !== newValue) {
	                    // console.log(
	                    //   `447 ${`\u001b[${31}m${`MISMATCH!`}\u001b[${39}m`} reporting range [${start}, ${end}] to replace with a new value "${`\u001b[${35}m${newValue}\u001b[${39}m`}"`
	                    // );
	                    context.report({
	                      node: node,
	                      messageId: "correctTestNum",
	                      fix: function fix(fixerObj) {
	                        return fixerObj.replaceTextRange([start, end], newValue);
	                      }
	                    });
	                  }
	                }();

	                if (_ret === "continue") continue;
	              }
	            } // console.log(
	            //   `460 ${`\u001b[${90}m${`=================================`}\u001b[${39}m`}`
	            // );

	          }
	        } // console.log(" ");
	        // console.log(
	        //   `467 ${`\u001b[${32}m${`finally`}\u001b[${39}m`}, ${`\u001b[${33}m${`finalDigitChunk`}\u001b[${39}m`} = ${JSON.stringify(
	        //     finalDigitChunk,
	        //     null,
	        //     4
	        //   )}`
	        // );


	        if (finalDigitChunk) {
	          // console.log(
	          //   `476 ${`\u001b[${31}m${`MISMATCH!`}\u001b[${39}m`} reporting range [${
	          //     finalDigitChunk.start
	          //   }, ${
	          //     finalDigitChunk.end
	          //   }] to replace with a new value "${`\u001b[${35}m${
	          //     finalDigitChunk.value
	          //   }\u001b[${39}m`}"`
	          // );
	          context.report({
	            node: node,
	            messageId: "correctTestNum",
	            fix: function fix(fixerObj) {
	              return fixerObj.replaceTextRange([finalDigitChunk.start, finalDigitChunk.end], finalDigitChunk.value);
	            }
	          });
	        }
	      }
	    }
	  };
	};

	var correctTestNum = {
	  create: create,
	  meta: {
	    // docs: {
	    //   url: getDocumentationUrl(__filename),
	    // },
	    type: "suggestion",
	    messages: {
	      correctTestNum: "Update the test number."
	    },
	    fixable: "code" // or "code" or "whitespace"

	  }
	};

	var main = {
	  configs: {
	    recommended: {
	      plugins: ["test-num"],
	      rules: {
	        "no-console": "off",
	        "test-num/correct-test-num": "error"
	      }
	    }
	  },
	  rules: {
	    "correct-test-num": correctTestNum
	  }
	};

	return main;

})));
