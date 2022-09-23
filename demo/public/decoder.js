(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('path'), require('fs'), require('crypto')) :
	typeof define === 'function' && define.amd ? define(['path', 'fs', 'crypto'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.path, global.fs, global.crypto$1));
})(this, (function (path, fs, crypto$1) { 'use strict';

	function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

	var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
	var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
	var crypto__default = /*#__PURE__*/_interopDefaultLegacy(crypto$1);

	function commonjsRequire () {
		throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var decoder = createCommonjsModule(function (module) {
	  var Module = typeof Module != "undefined" ? Module : {};
	  var Module = {};

	  Module.print = function (text) {
	    console.log("Jessibuca: [worker]:", text);
	  };

	  Module.printErr = function (text) {
	    console.warn("Jessibuca: [worker]:", text);
	    postMessage({
	      cmd: "wasmError",
	      message: text
	    });
	  };

	  var moduleOverrides = Object.assign({}, Module);
	  var thisProgram = "./this.program";

	  var ENVIRONMENT_IS_WEB = typeof window == "object";
	  var ENVIRONMENT_IS_WORKER = typeof importScripts == "function";
	  var ENVIRONMENT_IS_NODE = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string";
	  var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;

	  if (Module["ENVIRONMENT"]) {
	    throw new Error("Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -sENVIRONMENT=web or -sENVIRONMENT=node)");
	  }

	  var scriptDirectory = "";

	  function locateFile(path) {
	    if (Module["locateFile"]) {
	      return Module["locateFile"](path, scriptDirectory);
	    }

	    return scriptDirectory + path;
	  }

	  var read_, readAsync, readBinary;

	  var fs;
	  var nodePath;
	  var requireNodeFS;

	  if (ENVIRONMENT_IS_NODE) {
	    if (!(typeof process == "object" && typeof commonjsRequire == "function")) throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");

	    if (ENVIRONMENT_IS_WORKER) {
	      scriptDirectory = path__default["default"].dirname(scriptDirectory) + "/";
	    } else {
	      scriptDirectory = __dirname + "/";
	    }

	    requireNodeFS = () => {
	      if (!nodePath) {
	        fs = fs__default["default"];
	        nodePath = path__default["default"];
	      }
	    };

	    read_ = function shell_read(filename, binary) {
	      requireNodeFS();
	      filename = nodePath["normalize"](filename);
	      return fs.readFileSync(filename, binary ? undefined : "utf8");
	    };

	    readBinary = filename => {
	      var ret = read_(filename, true);

	      if (!ret.buffer) {
	        ret = new Uint8Array(ret);
	      }

	      assert(ret.buffer);
	      return ret;
	    };

	    readAsync = (filename, onload, onerror) => {
	      requireNodeFS();
	      filename = nodePath["normalize"](filename);
	      fs.readFile(filename, function (err, data) {
	        if (err) onerror(err);else onload(data.buffer);
	      });
	    };

	    if (process["argv"].length > 1) {
	      thisProgram = process["argv"][1].replace(/\\/g, "/");
	    }

	    process["argv"].slice(2);

	    {
	      module["exports"] = Module;
	    }

	    process["on"]("uncaughtException", function (ex) {
	      if (!(ex instanceof ExitStatus)) {
	        throw ex;
	      }
	    });
	    process["on"]("unhandledRejection", function (reason) {
	      throw reason;
	    });

	    Module["inspect"] = function () {
	      return "[Emscripten Module object]";
	    };
	  } else if (ENVIRONMENT_IS_SHELL) {
	    if (typeof process == "object" && typeof commonjsRequire === "function" || typeof window == "object" || typeof importScripts == "function") throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");

	    if (typeof read != "undefined") {
	      read_ = function shell_read(f) {
	        return read(f);
	      };
	    }

	    readBinary = function readBinary(f) {
	      let data;

	      if (typeof readbuffer == "function") {
	        return new Uint8Array(readbuffer(f));
	      }

	      data = read(f, "binary");
	      assert(typeof data == "object");
	      return data;
	    };

	    readAsync = function readAsync(f, onload, onerror) {
	      setTimeout(() => onload(readBinary(f)), 0);
	    };

	    if (typeof scriptArgs != "undefined") {
	      scriptArgs;
	    }

	    if (typeof print != "undefined") {
	      if (typeof console == "undefined") console = {};
	      console.log = print;
	      console.warn = console.error = typeof printErr != "undefined" ? printErr : print;
	    }
	  } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
	    if (ENVIRONMENT_IS_WORKER) {
	      scriptDirectory = self.location.href;
	    } else if (typeof document != "undefined" && document.currentScript) {
	      scriptDirectory = document.currentScript.src;
	    }

	    if (scriptDirectory.indexOf("blob:") !== 0) {
	      scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1);
	    } else {
	      scriptDirectory = "";
	    }

	    if (!(typeof window == "object" || typeof importScripts == "function")) throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");
	    {
	      read_ = url => {
	        var xhr = new XMLHttpRequest();
	        xhr.open("GET", url, false);
	        xhr.send(null);
	        return xhr.responseText;
	      };

	      if (ENVIRONMENT_IS_WORKER) {
	        readBinary = url => {
	          var xhr = new XMLHttpRequest();
	          xhr.open("GET", url, false);
	          xhr.responseType = "arraybuffer";
	          xhr.send(null);
	          return new Uint8Array(xhr.response);
	        };
	      }

	      readAsync = (url, onload, onerror) => {
	        var xhr = new XMLHttpRequest();
	        xhr.open("GET", url, true);
	        xhr.responseType = "arraybuffer";

	        xhr.onload = () => {
	          if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
	            onload(xhr.response);
	            return;
	          }

	          onerror();
	        };

	        xhr.onerror = onerror;
	        xhr.send(null);
	      };
	    }
	  } else {
	    throw new Error("environment detection error");
	  }

	  var out = Module["print"] || console.log.bind(console);
	  var err = Module["printErr"] || console.warn.bind(console);
	  Object.assign(Module, moduleOverrides);
	  moduleOverrides = null;
	  checkIncomingModuleAPI();
	  if (Module["arguments"]) ;
	  legacyModuleProp("arguments", "arguments_");
	  if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
	  legacyModuleProp("thisProgram", "thisProgram");
	  if (Module["quit"]) ;
	  legacyModuleProp("quit", "quit_");
	  assert(typeof Module["memoryInitializerPrefixURL"] == "undefined", "Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead");
	  assert(typeof Module["pthreadMainPrefixURL"] == "undefined", "Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead");
	  assert(typeof Module["cdInitializerPrefixURL"] == "undefined", "Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead");
	  assert(typeof Module["filePackagePrefixURL"] == "undefined", "Module.filePackagePrefixURL option was removed, use Module.locateFile instead");
	  assert(typeof Module["read"] == "undefined", "Module.read option was removed (modify read_ in JS)");
	  assert(typeof Module["readAsync"] == "undefined", "Module.readAsync option was removed (modify readAsync in JS)");
	  assert(typeof Module["readBinary"] == "undefined", "Module.readBinary option was removed (modify readBinary in JS)");
	  assert(typeof Module["setWindowTitle"] == "undefined", "Module.setWindowTitle option was removed (modify setWindowTitle in JS)");
	  assert(typeof Module["TOTAL_MEMORY"] == "undefined", "Module.TOTAL_MEMORY has been renamed Module.INITIAL_MEMORY");
	  legacyModuleProp("read", "read_");
	  legacyModuleProp("readAsync", "readAsync");
	  legacyModuleProp("readBinary", "readBinary");
	  legacyModuleProp("setWindowTitle", "setWindowTitle");
	  assert(!ENVIRONMENT_IS_SHELL, "shell environment detected but not enabled at build time.  Add 'shell' to `-sENVIRONMENT` to enable.");

	  function warnOnce(text) {
	    if (!warnOnce.shown) warnOnce.shown = {};

	    if (!warnOnce.shown[text]) {
	      warnOnce.shown[text] = 1;
	      err(text);
	    }
	  }

	  function legacyModuleProp(prop, newName) {
	    if (!Object.getOwnPropertyDescriptor(Module, prop)) {
	      Object.defineProperty(Module, prop, {
	        configurable: true,
	        get: function () {
	          abort("Module." + prop + " has been replaced with plain " + newName + " (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)");
	        }
	      });
	    }
	  }

	  function ignoredModuleProp(prop) {
	    if (Object.getOwnPropertyDescriptor(Module, prop)) {
	      abort("`Module." + prop + "` was supplied but `" + prop + "` not included in INCOMING_MODULE_JS_API");
	    }
	  }

	  function unexportedMessage(sym, isFSSybol) {
	    var msg = "'" + sym + "' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)";

	    if (isFSSybol) {
	      msg += ". Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you";
	    }

	    return msg;
	  }

	  function unexportedRuntimeSymbol(sym, isFSSybol) {
	    if (!Object.getOwnPropertyDescriptor(Module, sym)) {
	      Object.defineProperty(Module, sym, {
	        configurable: true,
	        get: function () {
	          abort(unexportedMessage(sym, isFSSybol));
	        }
	      });
	    }
	  }

	  function unexportedRuntimeFunction(sym, isFSSybol) {
	    if (!Object.getOwnPropertyDescriptor(Module, sym)) {
	      Module[sym] = () => abort(unexportedMessage(sym, isFSSybol));
	    }
	  }

	  var wasmBinary;
	  if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
	  legacyModuleProp("wasmBinary", "wasmBinary");
	  Module["noExitRuntime"] || true;
	  legacyModuleProp("noExitRuntime", "noExitRuntime");

	  if (typeof WebAssembly != "object") {
	    abort("no native wasm support detected");
	  }

	  var wasmMemory;
	  var ABORT = false;

	  function assert(condition, text) {
	    if (!condition) {
	      abort("Assertion failed" + (text ? ": " + text : ""));
	    }
	  }
	  var UTF8Decoder = typeof TextDecoder != "undefined" ? new TextDecoder("utf8") : undefined;

	  function UTF8ArrayToString(heapOrArray, idx, maxBytesToRead) {
	    var endIdx = idx + maxBytesToRead;
	    var endPtr = idx;

	    while (heapOrArray[endPtr] && !(endPtr >= endIdx)) ++endPtr;

	    if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
	      return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
	    } else {
	      var str = "";

	      while (idx < endPtr) {
	        var u0 = heapOrArray[idx++];

	        if (!(u0 & 128)) {
	          str += String.fromCharCode(u0);
	          continue;
	        }

	        var u1 = heapOrArray[idx++] & 63;

	        if ((u0 & 224) == 192) {
	          str += String.fromCharCode((u0 & 31) << 6 | u1);
	          continue;
	        }

	        var u2 = heapOrArray[idx++] & 63;

	        if ((u0 & 240) == 224) {
	          u0 = (u0 & 15) << 12 | u1 << 6 | u2;
	        } else {
	          if ((u0 & 248) != 240) warnOnce("Invalid UTF-8 leading byte 0x" + u0.toString(16) + " encountered when deserializing a UTF-8 string in wasm memory to a JS string!");
	          u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heapOrArray[idx++] & 63;
	        }

	        if (u0 < 65536) {
	          str += String.fromCharCode(u0);
	        } else {
	          var ch = u0 - 65536;
	          str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
	        }
	      }
	    }

	    return str;
	  }

	  function UTF8ToString(ptr, maxBytesToRead) {
	    return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";
	  }

	  function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
	    if (!(maxBytesToWrite > 0)) return 0;
	    var startIdx = outIdx;
	    var endIdx = outIdx + maxBytesToWrite - 1;

	    for (var i = 0; i < str.length; ++i) {
	      var u = str.charCodeAt(i);

	      if (u >= 55296 && u <= 57343) {
	        var u1 = str.charCodeAt(++i);
	        u = 65536 + ((u & 1023) << 10) | u1 & 1023;
	      }

	      if (u <= 127) {
	        if (outIdx >= endIdx) break;
	        heap[outIdx++] = u;
	      } else if (u <= 2047) {
	        if (outIdx + 1 >= endIdx) break;
	        heap[outIdx++] = 192 | u >> 6;
	        heap[outIdx++] = 128 | u & 63;
	      } else if (u <= 65535) {
	        if (outIdx + 2 >= endIdx) break;
	        heap[outIdx++] = 224 | u >> 12;
	        heap[outIdx++] = 128 | u >> 6 & 63;
	        heap[outIdx++] = 128 | u & 63;
	      } else {
	        if (outIdx + 3 >= endIdx) break;
	        if (u > 1114111) warnOnce("Invalid Unicode code point 0x" + u.toString(16) + " encountered when serializing a JS string to a UTF-8 string in wasm memory! (Valid unicode code points should be in range 0-0x10FFFF).");
	        heap[outIdx++] = 240 | u >> 18;
	        heap[outIdx++] = 128 | u >> 12 & 63;
	        heap[outIdx++] = 128 | u >> 6 & 63;
	        heap[outIdx++] = 128 | u & 63;
	      }
	    }

	    heap[outIdx] = 0;
	    return outIdx - startIdx;
	  }

	  function stringToUTF8(str, outPtr, maxBytesToWrite) {
	    assert(typeof maxBytesToWrite == "number", "stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!");
	    return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
	  }

	  function lengthBytesUTF8(str) {
	    var len = 0;

	    for (var i = 0; i < str.length; ++i) {
	      var u = str.charCodeAt(i);
	      if (u >= 55296 && u <= 57343) u = 65536 + ((u & 1023) << 10) | str.charCodeAt(++i) & 1023;
	      if (u <= 127) ++len;else if (u <= 2047) len += 2;else if (u <= 65535) len += 3;else len += 4;
	    }

	    return len;
	  }

	  var UTF16Decoder = typeof TextDecoder != "undefined" ? new TextDecoder("utf-16le") : undefined;

	  function UTF16ToString(ptr, maxBytesToRead) {
	    assert(ptr % 2 == 0, "Pointer passed to UTF16ToString must be aligned to two bytes!");
	    var endPtr = ptr;
	    var idx = endPtr >> 1;
	    var maxIdx = idx + maxBytesToRead / 2;

	    while (!(idx >= maxIdx) && HEAPU16[idx]) ++idx;

	    endPtr = idx << 1;

	    if (endPtr - ptr > 32 && UTF16Decoder) {
	      return UTF16Decoder.decode(HEAPU8.subarray(ptr, endPtr));
	    } else {
	      var str = "";

	      for (var i = 0; !(i >= maxBytesToRead / 2); ++i) {
	        var codeUnit = HEAP16[ptr + i * 2 >> 1];
	        if (codeUnit == 0) break;
	        str += String.fromCharCode(codeUnit);
	      }

	      return str;
	    }
	  }

	  function stringToUTF16(str, outPtr, maxBytesToWrite) {
	    assert(outPtr % 2 == 0, "Pointer passed to stringToUTF16 must be aligned to two bytes!");
	    assert(typeof maxBytesToWrite == "number", "stringToUTF16(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!");

	    if (maxBytesToWrite === undefined) {
	      maxBytesToWrite = 2147483647;
	    }

	    if (maxBytesToWrite < 2) return 0;
	    maxBytesToWrite -= 2;
	    var startPtr = outPtr;
	    var numCharsToWrite = maxBytesToWrite < str.length * 2 ? maxBytesToWrite / 2 : str.length;

	    for (var i = 0; i < numCharsToWrite; ++i) {
	      var codeUnit = str.charCodeAt(i);
	      HEAP16[outPtr >> 1] = codeUnit;
	      outPtr += 2;
	    }

	    HEAP16[outPtr >> 1] = 0;
	    return outPtr - startPtr;
	  }

	  function lengthBytesUTF16(str) {
	    return str.length * 2;
	  }

	  function UTF32ToString(ptr, maxBytesToRead) {
	    assert(ptr % 4 == 0, "Pointer passed to UTF32ToString must be aligned to four bytes!");
	    var i = 0;
	    var str = "";

	    while (!(i >= maxBytesToRead / 4)) {
	      var utf32 = HEAP32[ptr + i * 4 >> 2];
	      if (utf32 == 0) break;
	      ++i;

	      if (utf32 >= 65536) {
	        var ch = utf32 - 65536;
	        str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
	      } else {
	        str += String.fromCharCode(utf32);
	      }
	    }

	    return str;
	  }

	  function stringToUTF32(str, outPtr, maxBytesToWrite) {
	    assert(outPtr % 4 == 0, "Pointer passed to stringToUTF32 must be aligned to four bytes!");
	    assert(typeof maxBytesToWrite == "number", "stringToUTF32(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!");

	    if (maxBytesToWrite === undefined) {
	      maxBytesToWrite = 2147483647;
	    }

	    if (maxBytesToWrite < 4) return 0;
	    var startPtr = outPtr;
	    var endPtr = startPtr + maxBytesToWrite - 4;

	    for (var i = 0; i < str.length; ++i) {
	      var codeUnit = str.charCodeAt(i);

	      if (codeUnit >= 55296 && codeUnit <= 57343) {
	        var trailSurrogate = str.charCodeAt(++i);
	        codeUnit = 65536 + ((codeUnit & 1023) << 10) | trailSurrogate & 1023;
	      }

	      HEAP32[outPtr >> 2] = codeUnit;
	      outPtr += 4;
	      if (outPtr + 4 > endPtr) break;
	    }

	    HEAP32[outPtr >> 2] = 0;
	    return outPtr - startPtr;
	  }

	  function lengthBytesUTF32(str) {
	    var len = 0;

	    for (var i = 0; i < str.length; ++i) {
	      var codeUnit = str.charCodeAt(i);
	      if (codeUnit >= 55296 && codeUnit <= 57343) ++i;
	      len += 4;
	    }

	    return len;
	  }

	  function allocateUTF8(str) {
	    var size = lengthBytesUTF8(str) + 1;

	    var ret = _malloc(size);

	    if (ret) stringToUTF8Array(str, HEAP8, ret, size);
	    return ret;
	  }

	  function writeAsciiToMemory(str, buffer, dontAddNull) {
	    for (var i = 0; i < str.length; ++i) {
	      assert(str.charCodeAt(i) === (str.charCodeAt(i) & 255));
	      HEAP8[buffer++ >> 0] = str.charCodeAt(i);
	    }

	    if (!dontAddNull) HEAP8[buffer >> 0] = 0;
	  }

	  var buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;

	  function updateGlobalBufferAndViews(buf) {
	    buffer = buf;
	    Module["HEAP8"] = HEAP8 = new Int8Array(buf);
	    Module["HEAP16"] = HEAP16 = new Int16Array(buf);
	    Module["HEAP32"] = HEAP32 = new Int32Array(buf);
	    Module["HEAPU8"] = HEAPU8 = new Uint8Array(buf);
	    Module["HEAPU16"] = HEAPU16 = new Uint16Array(buf);
	    Module["HEAPU32"] = HEAPU32 = new Uint32Array(buf);
	    Module["HEAPF32"] = HEAPF32 = new Float32Array(buf);
	    Module["HEAPF64"] = HEAPF64 = new Float64Array(buf);
	  }

	  var TOTAL_STACK = 5242880;
	  if (Module["TOTAL_STACK"]) assert(TOTAL_STACK === Module["TOTAL_STACK"], "the stack size can no longer be determined at runtime");
	  var INITIAL_MEMORY = Module["INITIAL_MEMORY"] || 67108864;
	  legacyModuleProp("INITIAL_MEMORY", "INITIAL_MEMORY");
	  assert(INITIAL_MEMORY >= TOTAL_STACK, "INITIAL_MEMORY should be larger than TOTAL_STACK, was " + INITIAL_MEMORY + "! (TOTAL_STACK=" + TOTAL_STACK + ")");
	  assert(typeof Int32Array != "undefined" && typeof Float64Array !== "undefined" && Int32Array.prototype.subarray != undefined && Int32Array.prototype.set != undefined, "JS engine does not provide full typed array support");
	  assert(!Module["wasmMemory"], "Use of `wasmMemory` detected.  Use -sIMPORTED_MEMORY to define wasmMemory externally");
	  assert(INITIAL_MEMORY == 67108864, "Detected runtime INITIAL_MEMORY setting.  Use -sIMPORTED_MEMORY to define wasmMemory dynamically");
	  var wasmTable;

	  function writeStackCookie() {
	    var max = _emscripten_stack_get_end();

	    assert((max & 3) == 0);
	    HEAP32[max >> 2] = 34821223;
	    HEAP32[max + 4 >> 2] = 2310721022;
	    HEAP32[0] = 1668509029;
	  }

	  function checkStackCookie() {
	    if (ABORT) return;

	    var max = _emscripten_stack_get_end();

	    var cookie1 = HEAPU32[max >> 2];
	    var cookie2 = HEAPU32[max + 4 >> 2];

	    if (cookie1 != 34821223 || cookie2 != 2310721022) {
	      abort("Stack overflow! Stack cookie has been overwritten, expected hex dwords 0x89BACDFE and 0x2135467, but received 0x" + cookie2.toString(16) + " 0x" + cookie1.toString(16));
	    }

	    if (HEAP32[0] !== 1668509029) abort("Runtime error: The application has corrupted its heap memory area (address zero)!");
	  }

	  (function () {
	    var h16 = new Int16Array(1);
	    var h8 = new Int8Array(h16.buffer);
	    h16[0] = 25459;
	    if (h8[0] !== 115 || h8[1] !== 99) throw "Runtime error: expected the system to be little-endian! (Run with -sSUPPORT_BIG_ENDIAN to bypass)";
	  })();

	  var __ATPRERUN__ = [];
	  var __ATINIT__ = [];
	  var __ATPOSTRUN__ = [];
	  var runtimeInitialized = false;

	  function preRun() {
	    if (Module["preRun"]) {
	      if (typeof Module["preRun"] == "function") Module["preRun"] = [Module["preRun"]];

	      while (Module["preRun"].length) {
	        addOnPreRun(Module["preRun"].shift());
	      }
	    }

	    callRuntimeCallbacks(__ATPRERUN__);
	  }

	  function initRuntime() {
	    checkStackCookie();
	    assert(!runtimeInitialized);
	    runtimeInitialized = true;
	    if (!Module["noFSInit"] && !FS.init.initialized) FS.init();
	    FS.ignorePermissions = false;
	    callRuntimeCallbacks(__ATINIT__);
	  }

	  function postRun() {
	    checkStackCookie();

	    if (Module["postRun"]) {
	      if (typeof Module["postRun"] == "function") Module["postRun"] = [Module["postRun"]];

	      while (Module["postRun"].length) {
	        addOnPostRun(Module["postRun"].shift());
	      }
	    }

	    callRuntimeCallbacks(__ATPOSTRUN__);
	  }

	  function addOnPreRun(cb) {
	    __ATPRERUN__.unshift(cb);
	  }

	  function addOnInit(cb) {
	    __ATINIT__.unshift(cb);
	  }

	  function addOnPostRun(cb) {
	    __ATPOSTRUN__.unshift(cb);
	  }

	  assert(Math.imul, "This browser does not support Math.imul(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
	  assert(Math.fround, "This browser does not support Math.fround(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
	  assert(Math.clz32, "This browser does not support Math.clz32(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
	  assert(Math.trunc, "This browser does not support Math.trunc(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
	  var runDependencies = 0;
	  var runDependencyWatcher = null;
	  var dependenciesFulfilled = null;
	  var runDependencyTracking = {};

	  function getUniqueRunDependency(id) {
	    var orig = id;

	    while (1) {
	      if (!runDependencyTracking[id]) return id;
	      id = orig + Math.random();
	    }
	  }

	  function addRunDependency(id) {
	    runDependencies++;

	    if (Module["monitorRunDependencies"]) {
	      Module["monitorRunDependencies"](runDependencies);
	    }

	    if (id) {
	      assert(!runDependencyTracking[id]);
	      runDependencyTracking[id] = 1;

	      if (runDependencyWatcher === null && typeof setInterval != "undefined") {
	        runDependencyWatcher = setInterval(function () {
	          if (ABORT) {
	            clearInterval(runDependencyWatcher);
	            runDependencyWatcher = null;
	            return;
	          }

	          var shown = false;

	          for (var dep in runDependencyTracking) {
	            if (!shown) {
	              shown = true;
	              err("still waiting on run dependencies:");
	            }

	            err("dependency: " + dep);
	          }

	          if (shown) {
	            err("(end of list)");
	          }
	        }, 1e4);
	      }
	    } else {
	      err("warning: run dependency added without ID");
	    }
	  }

	  function removeRunDependency(id) {
	    runDependencies--;

	    if (Module["monitorRunDependencies"]) {
	      Module["monitorRunDependencies"](runDependencies);
	    }

	    if (id) {
	      assert(runDependencyTracking[id]);
	      delete runDependencyTracking[id];
	    } else {
	      err("warning: run dependency removed without ID");
	    }

	    if (runDependencies == 0) {
	      if (runDependencyWatcher !== null) {
	        clearInterval(runDependencyWatcher);
	        runDependencyWatcher = null;
	      }

	      if (dependenciesFulfilled) {
	        var callback = dependenciesFulfilled;
	        dependenciesFulfilled = null;
	        callback();
	      }
	    }
	  }

	  function abort(what) {
	    {
	      if (Module["onAbort"]) {
	        Module["onAbort"](what);
	      }
	    }
	    what = "Aborted(" + what + ")";
	    err(what);
	    ABORT = true;
	    var e = new WebAssembly.RuntimeError(what);
	    throw e;
	  }

	  var dataURIPrefix = "data:application/octet-stream;base64,";

	  function isDataURI(filename) {
	    return filename.startsWith(dataURIPrefix);
	  }

	  function isFileURI(filename) {
	    return filename.startsWith("file://");
	  }

	  function createExportWrapper(name, fixedasm) {
	    return function () {
	      var displayName = name;
	      var asm = fixedasm;

	      if (!fixedasm) {
	        asm = Module["asm"];
	      }

	      assert(runtimeInitialized, "native function `" + displayName + "` called before runtime initialization");

	      if (!asm[name]) {
	        assert(asm[name], "exported native function `" + displayName + "` not found");
	      }

	      return asm[name].apply(null, arguments);
	    };
	  }

	  var wasmBinaryFile;
	  wasmBinaryFile = "decoder.wasm";

	  if (!isDataURI(wasmBinaryFile)) {
	    wasmBinaryFile = locateFile(wasmBinaryFile);
	  }

	  function getBinary(file) {
	    try {
	      if (file == wasmBinaryFile && wasmBinary) {
	        return new Uint8Array(wasmBinary);
	      }

	      if (readBinary) {
	        return readBinary(file);
	      } else {
	        throw "both async and sync fetching of the wasm failed";
	      }
	    } catch (err) {
	      abort(err);
	    }
	  }

	  function getBinaryPromise() {
	    if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
	      if (typeof fetch == "function" && !isFileURI(wasmBinaryFile)) {
	        return fetch(wasmBinaryFile, {
	          credentials: "same-origin"
	        }).then(function (response) {
	          if (!response["ok"]) {
	            throw "failed to load wasm binary file at '" + wasmBinaryFile + "'";
	          }

	          return response["arrayBuffer"]();
	        }).catch(function () {
	          return getBinary(wasmBinaryFile);
	        });
	      } else {
	        if (readAsync) {
	          return new Promise(function (resolve, reject) {
	            readAsync(wasmBinaryFile, function (response) {
	              resolve(new Uint8Array(response));
	            }, reject);
	          });
	        }
	      }
	    }

	    return Promise.resolve().then(function () {
	      return getBinary(wasmBinaryFile);
	    });
	  }

	  function createWasm() {
	    var info = {
	      "env": asmLibraryArg,
	      "wasi_snapshot_preview1": asmLibraryArg
	    };

	    function receiveInstance(instance, module) {
	      var exports = instance.exports;
	      Module["asm"] = exports;
	      wasmMemory = Module["asm"]["memory"];
	      assert(wasmMemory, "memory not found in wasm exports");
	      updateGlobalBufferAndViews(wasmMemory.buffer);
	      wasmTable = Module["asm"]["__indirect_function_table"];
	      assert(wasmTable, "table not found in wasm exports");
	      addOnInit(Module["asm"]["__wasm_call_ctors"]);
	      removeRunDependency("wasm-instantiate");
	    }

	    addRunDependency("wasm-instantiate");
	    var trueModule = Module;

	    function receiveInstantiationResult(result) {
	      assert(Module === trueModule, "the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?");
	      trueModule = null;
	      receiveInstance(result["instance"]);
	    }

	    function instantiateArrayBuffer(receiver) {
	      return getBinaryPromise().then(function (binary) {
	        return WebAssembly.instantiate(binary, info);
	      }).then(function (instance) {
	        return instance;
	      }).then(receiver, function (reason) {
	        err("failed to asynchronously prepare wasm: " + reason);

	        if (isFileURI(wasmBinaryFile)) {
	          err("warning: Loading from a file URI (" + wasmBinaryFile + ") is not supported in most browsers. See https://emscripten.org/docs/getting_started/FAQ.html#how-do-i-run-a-local-webserver-for-testing-why-does-my-program-stall-in-downloading-or-preparing");
	        }

	        abort(reason);
	      });
	    }

	    function instantiateAsync() {
	      if (!wasmBinary && typeof WebAssembly.instantiateStreaming == "function" && !isDataURI(wasmBinaryFile) && !isFileURI(wasmBinaryFile) && typeof fetch == "function") {
	        return fetch(wasmBinaryFile, {
	          credentials: "same-origin"
	        }).then(function (response) {
	          var result = WebAssembly.instantiateStreaming(response, info);
	          return result.then(receiveInstantiationResult, function (reason) {
	            err("wasm streaming compile failed: " + reason);
	            err("falling back to ArrayBuffer instantiation");
	            return instantiateArrayBuffer(receiveInstantiationResult);
	          });
	        });
	      } else {
	        return instantiateArrayBuffer(receiveInstantiationResult);
	      }
	    }

	    if (Module["instantiateWasm"]) {
	      try {
	        var exports = Module["instantiateWasm"](info, receiveInstance);
	        return exports;
	      } catch (e) {
	        err("Module.instantiateWasm callback failed with error: " + e);
	        return false;
	      }
	    }

	    instantiateAsync();
	    return {};
	  }

	  var tempDouble;
	  var tempI64;

	  function callRuntimeCallbacks(callbacks) {
	    while (callbacks.length > 0) {
	      var callback = callbacks.shift();

	      if (typeof callback == "function") {
	        callback(Module);
	        continue;
	      }

	      var func = callback.func;

	      if (typeof func == "number") {
	        if (callback.arg === undefined) {
	          getWasmTableEntry(func)();
	        } else {
	          getWasmTableEntry(func)(callback.arg);
	        }
	      } else {
	        func(callback.arg === undefined ? null : callback.arg);
	      }
	    }
	  }

	  function demangle(func) {
	    warnOnce("warning: build with -sDEMANGLE_SUPPORT to link in libcxxabi demangling");
	    return func;
	  }

	  function demangleAll(text) {
	    var regex = /\b_Z[\w\d_]+/g;
	    return text.replace(regex, function (x) {
	      var y = demangle(x);
	      return x === y ? x : y + " [" + x + "]";
	    });
	  }

	  function getWasmTableEntry(funcPtr) {
	    return wasmTable.get(funcPtr);
	  }

	  function jsStackTrace() {
	    var error = new Error();

	    if (!error.stack) {
	      try {
	        throw new Error();
	      } catch (e) {
	        error = e;
	      }

	      if (!error.stack) {
	        return "(no stack trace available)";
	      }
	    }

	    return error.stack.toString();
	  }

	  function setErrNo(value) {
	    HEAP32[___errno_location() >> 2] = value;
	    return value;
	  }

	  var PATH = {
	    isAbs: path => path.charAt(0) === "/",
	    splitPath: filename => {
	      var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
	      return splitPathRe.exec(filename).slice(1);
	    },
	    normalizeArray: (parts, allowAboveRoot) => {
	      var up = 0;

	      for (var i = parts.length - 1; i >= 0; i--) {
	        var last = parts[i];

	        if (last === ".") {
	          parts.splice(i, 1);
	        } else if (last === "..") {
	          parts.splice(i, 1);
	          up++;
	        } else if (up) {
	          parts.splice(i, 1);
	          up--;
	        }
	      }

	      if (allowAboveRoot) {
	        for (; up; up--) {
	          parts.unshift("..");
	        }
	      }

	      return parts;
	    },
	    normalize: path => {
	      var isAbsolute = PATH.isAbs(path),
	          trailingSlash = path.substr(-1) === "/";
	      path = PATH.normalizeArray(path.split("/").filter(p => !!p), !isAbsolute).join("/");

	      if (!path && !isAbsolute) {
	        path = ".";
	      }

	      if (path && trailingSlash) {
	        path += "/";
	      }

	      return (isAbsolute ? "/" : "") + path;
	    },
	    dirname: path => {
	      var result = PATH.splitPath(path),
	          root = result[0],
	          dir = result[1];

	      if (!root && !dir) {
	        return ".";
	      }

	      if (dir) {
	        dir = dir.substr(0, dir.length - 1);
	      }

	      return root + dir;
	    },
	    basename: path => {
	      if (path === "/") return "/";
	      path = PATH.normalize(path);
	      path = path.replace(/\/$/, "");
	      var lastSlash = path.lastIndexOf("/");
	      if (lastSlash === -1) return path;
	      return path.substr(lastSlash + 1);
	    },
	    join: function () {
	      var paths = Array.prototype.slice.call(arguments, 0);
	      return PATH.normalize(paths.join("/"));
	    },
	    join2: (l, r) => {
	      return PATH.normalize(l + "/" + r);
	    }
	  };

	  function getRandomDevice() {
	    if (typeof crypto == "object" && typeof crypto["getRandomValues"] == "function") {
	      var randomBuffer = new Uint8Array(1);
	      return function () {
	        crypto.getRandomValues(randomBuffer);
	        return randomBuffer[0];
	      };
	    } else if (ENVIRONMENT_IS_NODE) {
	      try {
	        var crypto_module = crypto__default["default"];
	        return function () {
	          return crypto_module["randomBytes"](1)[0];
	        };
	      } catch (e) {}
	    }

	    return function () {
	      abort("no cryptographic support found for randomDevice. consider polyfilling it if you want to use something insecure like Math.random(), e.g. put this in a --pre-js: var crypto = { getRandomValues: function(array) { for (var i = 0; i < array.length; i++) array[i] = (Math.random()*256)|0 } };");
	    };
	  }

	  var PATH_FS = {
	    resolve: function () {
	      var resolvedPath = "",
	          resolvedAbsolute = false;

	      for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
	        var path = i >= 0 ? arguments[i] : FS.cwd();

	        if (typeof path != "string") {
	          throw new TypeError("Arguments to path.resolve must be strings");
	        } else if (!path) {
	          return "";
	        }

	        resolvedPath = path + "/" + resolvedPath;
	        resolvedAbsolute = PATH.isAbs(path);
	      }

	      resolvedPath = PATH.normalizeArray(resolvedPath.split("/").filter(p => !!p), !resolvedAbsolute).join("/");
	      return (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
	    },
	    relative: (from, to) => {
	      from = PATH_FS.resolve(from).substr(1);
	      to = PATH_FS.resolve(to).substr(1);

	      function trim(arr) {
	        var start = 0;

	        for (; start < arr.length; start++) {
	          if (arr[start] !== "") break;
	        }

	        var end = arr.length - 1;

	        for (; end >= 0; end--) {
	          if (arr[end] !== "") break;
	        }

	        if (start > end) return [];
	        return arr.slice(start, end - start + 1);
	      }

	      var fromParts = trim(from.split("/"));
	      var toParts = trim(to.split("/"));
	      var length = Math.min(fromParts.length, toParts.length);
	      var samePartsLength = length;

	      for (var i = 0; i < length; i++) {
	        if (fromParts[i] !== toParts[i]) {
	          samePartsLength = i;
	          break;
	        }
	      }

	      var outputParts = [];

	      for (var i = samePartsLength; i < fromParts.length; i++) {
	        outputParts.push("..");
	      }

	      outputParts = outputParts.concat(toParts.slice(samePartsLength));
	      return outputParts.join("/");
	    }
	  };
	  var TTY = {
	    ttys: [],
	    init: function () {},
	    shutdown: function () {},
	    register: function (dev, ops) {
	      TTY.ttys[dev] = {
	        input: [],
	        output: [],
	        ops: ops
	      };
	      FS.registerDevice(dev, TTY.stream_ops);
	    },
	    stream_ops: {
	      open: function (stream) {
	        var tty = TTY.ttys[stream.node.rdev];

	        if (!tty) {
	          throw new FS.ErrnoError(43);
	        }

	        stream.tty = tty;
	        stream.seekable = false;
	      },
	      close: function (stream) {
	        stream.tty.ops.flush(stream.tty);
	      },
	      flush: function (stream) {
	        stream.tty.ops.flush(stream.tty);
	      },
	      read: function (stream, buffer, offset, length, pos) {
	        if (!stream.tty || !stream.tty.ops.get_char) {
	          throw new FS.ErrnoError(60);
	        }

	        var bytesRead = 0;

	        for (var i = 0; i < length; i++) {
	          var result;

	          try {
	            result = stream.tty.ops.get_char(stream.tty);
	          } catch (e) {
	            throw new FS.ErrnoError(29);
	          }

	          if (result === undefined && bytesRead === 0) {
	            throw new FS.ErrnoError(6);
	          }

	          if (result === null || result === undefined) break;
	          bytesRead++;
	          buffer[offset + i] = result;
	        }

	        if (bytesRead) {
	          stream.node.timestamp = Date.now();
	        }

	        return bytesRead;
	      },
	      write: function (stream, buffer, offset, length, pos) {
	        if (!stream.tty || !stream.tty.ops.put_char) {
	          throw new FS.ErrnoError(60);
	        }

	        try {
	          for (var i = 0; i < length; i++) {
	            stream.tty.ops.put_char(stream.tty, buffer[offset + i]);
	          }
	        } catch (e) {
	          throw new FS.ErrnoError(29);
	        }

	        if (length) {
	          stream.node.timestamp = Date.now();
	        }

	        return i;
	      }
	    },
	    default_tty_ops: {
	      get_char: function (tty) {
	        if (!tty.input.length) {
	          var result = null;

	          if (ENVIRONMENT_IS_NODE) {
	            var BUFSIZE = 256;
	            var buf = Buffer.alloc(BUFSIZE);
	            var bytesRead = 0;

	            try {
	              bytesRead = fs.readSync(process.stdin.fd, buf, 0, BUFSIZE, -1);
	            } catch (e) {
	              if (e.toString().includes("EOF")) bytesRead = 0;else throw e;
	            }

	            if (bytesRead > 0) {
	              result = buf.slice(0, bytesRead).toString("utf-8");
	            } else {
	              result = null;
	            }
	          } else if (typeof window != "undefined" && typeof window.prompt == "function") {
	            result = window.prompt("Input: ");

	            if (result !== null) {
	              result += "\n";
	            }
	          } else if (typeof readline == "function") {
	            result = readline();

	            if (result !== null) {
	              result += "\n";
	            }
	          }

	          if (!result) {
	            return null;
	          }

	          tty.input = intArrayFromString(result, true);
	        }

	        return tty.input.shift();
	      },
	      put_char: function (tty, val) {
	        if (val === null || val === 10) {
	          out(UTF8ArrayToString(tty.output, 0));
	          tty.output = [];
	        } else {
	          if (val != 0) tty.output.push(val);
	        }
	      },
	      flush: function (tty) {
	        if (tty.output && tty.output.length > 0) {
	          out(UTF8ArrayToString(tty.output, 0));
	          tty.output = [];
	        }
	      }
	    },
	    default_tty1_ops: {
	      put_char: function (tty, val) {
	        if (val === null || val === 10) {
	          err(UTF8ArrayToString(tty.output, 0));
	          tty.output = [];
	        } else {
	          if (val != 0) tty.output.push(val);
	        }
	      },
	      flush: function (tty) {
	        if (tty.output && tty.output.length > 0) {
	          err(UTF8ArrayToString(tty.output, 0));
	          tty.output = [];
	        }
	      }
	    }
	  };

	  function zeroMemory(address, size) {
	    HEAPU8.fill(0, address, address + size);
	  }

	  function alignMemory(size, alignment) {
	    assert(alignment, "alignment argument is required");
	    return Math.ceil(size / alignment) * alignment;
	  }

	  function mmapAlloc(size) {
	    size = alignMemory(size, 65536);

	    var ptr = _emscripten_builtin_memalign(65536, size);

	    if (!ptr) return 0;
	    zeroMemory(ptr, size);
	    return ptr;
	  }

	  var MEMFS = {
	    ops_table: null,
	    mount: function (mount) {
	      return MEMFS.createNode(null, "/", 16384 | 511, 0);
	    },
	    createNode: function (parent, name, mode, dev) {
	      if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
	        throw new FS.ErrnoError(63);
	      }

	      if (!MEMFS.ops_table) {
	        MEMFS.ops_table = {
	          dir: {
	            node: {
	              getattr: MEMFS.node_ops.getattr,
	              setattr: MEMFS.node_ops.setattr,
	              lookup: MEMFS.node_ops.lookup,
	              mknod: MEMFS.node_ops.mknod,
	              rename: MEMFS.node_ops.rename,
	              unlink: MEMFS.node_ops.unlink,
	              rmdir: MEMFS.node_ops.rmdir,
	              readdir: MEMFS.node_ops.readdir,
	              symlink: MEMFS.node_ops.symlink
	            },
	            stream: {
	              llseek: MEMFS.stream_ops.llseek
	            }
	          },
	          file: {
	            node: {
	              getattr: MEMFS.node_ops.getattr,
	              setattr: MEMFS.node_ops.setattr
	            },
	            stream: {
	              llseek: MEMFS.stream_ops.llseek,
	              read: MEMFS.stream_ops.read,
	              write: MEMFS.stream_ops.write,
	              allocate: MEMFS.stream_ops.allocate,
	              mmap: MEMFS.stream_ops.mmap,
	              msync: MEMFS.stream_ops.msync
	            }
	          },
	          link: {
	            node: {
	              getattr: MEMFS.node_ops.getattr,
	              setattr: MEMFS.node_ops.setattr,
	              readlink: MEMFS.node_ops.readlink
	            },
	            stream: {}
	          },
	          chrdev: {
	            node: {
	              getattr: MEMFS.node_ops.getattr,
	              setattr: MEMFS.node_ops.setattr
	            },
	            stream: FS.chrdev_stream_ops
	          }
	        };
	      }

	      var node = FS.createNode(parent, name, mode, dev);

	      if (FS.isDir(node.mode)) {
	        node.node_ops = MEMFS.ops_table.dir.node;
	        node.stream_ops = MEMFS.ops_table.dir.stream;
	        node.contents = {};
	      } else if (FS.isFile(node.mode)) {
	        node.node_ops = MEMFS.ops_table.file.node;
	        node.stream_ops = MEMFS.ops_table.file.stream;
	        node.usedBytes = 0;
	        node.contents = null;
	      } else if (FS.isLink(node.mode)) {
	        node.node_ops = MEMFS.ops_table.link.node;
	        node.stream_ops = MEMFS.ops_table.link.stream;
	      } else if (FS.isChrdev(node.mode)) {
	        node.node_ops = MEMFS.ops_table.chrdev.node;
	        node.stream_ops = MEMFS.ops_table.chrdev.stream;
	      }

	      node.timestamp = Date.now();

	      if (parent) {
	        parent.contents[name] = node;
	        parent.timestamp = node.timestamp;
	      }

	      return node;
	    },
	    getFileDataAsTypedArray: function (node) {
	      if (!node.contents) return new Uint8Array(0);
	      if (node.contents.subarray) return node.contents.subarray(0, node.usedBytes);
	      return new Uint8Array(node.contents);
	    },
	    expandFileStorage: function (node, newCapacity) {
	      var prevCapacity = node.contents ? node.contents.length : 0;
	      if (prevCapacity >= newCapacity) return;
	      var CAPACITY_DOUBLING_MAX = 1024 * 1024;
	      newCapacity = Math.max(newCapacity, prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125) >>> 0);
	      if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256);
	      var oldContents = node.contents;
	      node.contents = new Uint8Array(newCapacity);
	      if (node.usedBytes > 0) node.contents.set(oldContents.subarray(0, node.usedBytes), 0);
	    },
	    resizeFileStorage: function (node, newSize) {
	      if (node.usedBytes == newSize) return;

	      if (newSize == 0) {
	        node.contents = null;
	        node.usedBytes = 0;
	      } else {
	        var oldContents = node.contents;
	        node.contents = new Uint8Array(newSize);

	        if (oldContents) {
	          node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes)));
	        }

	        node.usedBytes = newSize;
	      }
	    },
	    node_ops: {
	      getattr: function (node) {
	        var attr = {};
	        attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
	        attr.ino = node.id;
	        attr.mode = node.mode;
	        attr.nlink = 1;
	        attr.uid = 0;
	        attr.gid = 0;
	        attr.rdev = node.rdev;

	        if (FS.isDir(node.mode)) {
	          attr.size = 4096;
	        } else if (FS.isFile(node.mode)) {
	          attr.size = node.usedBytes;
	        } else if (FS.isLink(node.mode)) {
	          attr.size = node.link.length;
	        } else {
	          attr.size = 0;
	        }

	        attr.atime = new Date(node.timestamp);
	        attr.mtime = new Date(node.timestamp);
	        attr.ctime = new Date(node.timestamp);
	        attr.blksize = 4096;
	        attr.blocks = Math.ceil(attr.size / attr.blksize);
	        return attr;
	      },
	      setattr: function (node, attr) {
	        if (attr.mode !== undefined) {
	          node.mode = attr.mode;
	        }

	        if (attr.timestamp !== undefined) {
	          node.timestamp = attr.timestamp;
	        }

	        if (attr.size !== undefined) {
	          MEMFS.resizeFileStorage(node, attr.size);
	        }
	      },
	      lookup: function (parent, name) {
	        throw FS.genericErrors[44];
	      },
	      mknod: function (parent, name, mode, dev) {
	        return MEMFS.createNode(parent, name, mode, dev);
	      },
	      rename: function (old_node, new_dir, new_name) {
	        if (FS.isDir(old_node.mode)) {
	          var new_node;

	          try {
	            new_node = FS.lookupNode(new_dir, new_name);
	          } catch (e) {}

	          if (new_node) {
	            for (var i in new_node.contents) {
	              throw new FS.ErrnoError(55);
	            }
	          }
	        }

	        delete old_node.parent.contents[old_node.name];
	        old_node.parent.timestamp = Date.now();
	        old_node.name = new_name;
	        new_dir.contents[new_name] = old_node;
	        new_dir.timestamp = old_node.parent.timestamp;
	        old_node.parent = new_dir;
	      },
	      unlink: function (parent, name) {
	        delete parent.contents[name];
	        parent.timestamp = Date.now();
	      },
	      rmdir: function (parent, name) {
	        var node = FS.lookupNode(parent, name);

	        for (var i in node.contents) {
	          throw new FS.ErrnoError(55);
	        }

	        delete parent.contents[name];
	        parent.timestamp = Date.now();
	      },
	      readdir: function (node) {
	        var entries = [".", ".."];

	        for (var key in node.contents) {
	          if (!node.contents.hasOwnProperty(key)) {
	            continue;
	          }

	          entries.push(key);
	        }

	        return entries;
	      },
	      symlink: function (parent, newname, oldpath) {
	        var node = MEMFS.createNode(parent, newname, 511 | 40960, 0);
	        node.link = oldpath;
	        return node;
	      },
	      readlink: function (node) {
	        if (!FS.isLink(node.mode)) {
	          throw new FS.ErrnoError(28);
	        }

	        return node.link;
	      }
	    },
	    stream_ops: {
	      read: function (stream, buffer, offset, length, position) {
	        var contents = stream.node.contents;
	        if (position >= stream.node.usedBytes) return 0;
	        var size = Math.min(stream.node.usedBytes - position, length);
	        assert(size >= 0);

	        if (size > 8 && contents.subarray) {
	          buffer.set(contents.subarray(position, position + size), offset);
	        } else {
	          for (var i = 0; i < size; i++) buffer[offset + i] = contents[position + i];
	        }

	        return size;
	      },
	      write: function (stream, buffer, offset, length, position, canOwn) {
	        assert(!(buffer instanceof ArrayBuffer));

	        if (buffer.buffer === HEAP8.buffer) {
	          canOwn = false;
	        }

	        if (!length) return 0;
	        var node = stream.node;
	        node.timestamp = Date.now();

	        if (buffer.subarray && (!node.contents || node.contents.subarray)) {
	          if (canOwn) {
	            assert(position === 0, "canOwn must imply no weird position inside the file");
	            node.contents = buffer.subarray(offset, offset + length);
	            node.usedBytes = length;
	            return length;
	          } else if (node.usedBytes === 0 && position === 0) {
	            node.contents = buffer.slice(offset, offset + length);
	            node.usedBytes = length;
	            return length;
	          } else if (position + length <= node.usedBytes) {
	            node.contents.set(buffer.subarray(offset, offset + length), position);
	            return length;
	          }
	        }

	        MEMFS.expandFileStorage(node, position + length);

	        if (node.contents.subarray && buffer.subarray) {
	          node.contents.set(buffer.subarray(offset, offset + length), position);
	        } else {
	          for (var i = 0; i < length; i++) {
	            node.contents[position + i] = buffer[offset + i];
	          }
	        }

	        node.usedBytes = Math.max(node.usedBytes, position + length);
	        return length;
	      },
	      llseek: function (stream, offset, whence) {
	        var position = offset;

	        if (whence === 1) {
	          position += stream.position;
	        } else if (whence === 2) {
	          if (FS.isFile(stream.node.mode)) {
	            position += stream.node.usedBytes;
	          }
	        }

	        if (position < 0) {
	          throw new FS.ErrnoError(28);
	        }

	        return position;
	      },
	      allocate: function (stream, offset, length) {
	        MEMFS.expandFileStorage(stream.node, offset + length);
	        stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length);
	      },
	      mmap: function (stream, address, length, position, prot, flags) {
	        if (address !== 0) {
	          throw new FS.ErrnoError(28);
	        }

	        if (!FS.isFile(stream.node.mode)) {
	          throw new FS.ErrnoError(43);
	        }

	        var ptr;
	        var allocated;
	        var contents = stream.node.contents;

	        if (!(flags & 2) && contents.buffer === buffer) {
	          allocated = false;
	          ptr = contents.byteOffset;
	        } else {
	          if (position > 0 || position + length < contents.length) {
	            if (contents.subarray) {
	              contents = contents.subarray(position, position + length);
	            } else {
	              contents = Array.prototype.slice.call(contents, position, position + length);
	            }
	          }

	          allocated = true;
	          ptr = mmapAlloc(length);

	          if (!ptr) {
	            throw new FS.ErrnoError(48);
	          }

	          HEAP8.set(contents, ptr);
	        }

	        return {
	          ptr: ptr,
	          allocated: allocated
	        };
	      },
	      msync: function (stream, buffer, offset, length, mmapFlags) {
	        if (!FS.isFile(stream.node.mode)) {
	          throw new FS.ErrnoError(43);
	        }

	        if (mmapFlags & 2) {
	          return 0;
	        }

	        MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
	        return 0;
	      }
	    }
	  };

	  function asyncLoad(url, onload, onerror, noRunDep) {
	    var dep = !noRunDep ? getUniqueRunDependency("al " + url) : "";
	    readAsync(url, function (arrayBuffer) {
	      assert(arrayBuffer, 'Loading data file "' + url + '" failed (no arrayBuffer).');
	      onload(new Uint8Array(arrayBuffer));
	      if (dep) removeRunDependency(dep);
	    }, function (event) {
	      if (onerror) {
	        onerror();
	      } else {
	        throw 'Loading data file "' + url + '" failed.';
	      }
	    });
	    if (dep) addRunDependency(dep);
	  }

	  var ERRNO_MESSAGES = {
	    0: "Success",
	    1: "Arg list too long",
	    2: "Permission denied",
	    3: "Address already in use",
	    4: "Address not available",
	    5: "Address family not supported by protocol family",
	    6: "No more processes",
	    7: "Socket already connected",
	    8: "Bad file number",
	    9: "Trying to read unreadable message",
	    10: "Mount device busy",
	    11: "Operation canceled",
	    12: "No children",
	    13: "Connection aborted",
	    14: "Connection refused",
	    15: "Connection reset by peer",
	    16: "File locking deadlock error",
	    17: "Destination address required",
	    18: "Math arg out of domain of func",
	    19: "Quota exceeded",
	    20: "File exists",
	    21: "Bad address",
	    22: "File too large",
	    23: "Host is unreachable",
	    24: "Identifier removed",
	    25: "Illegal byte sequence",
	    26: "Connection already in progress",
	    27: "Interrupted system call",
	    28: "Invalid argument",
	    29: "I/O error",
	    30: "Socket is already connected",
	    31: "Is a directory",
	    32: "Too many symbolic links",
	    33: "Too many open files",
	    34: "Too many links",
	    35: "Message too long",
	    36: "Multihop attempted",
	    37: "File or path name too long",
	    38: "Network interface is not configured",
	    39: "Connection reset by network",
	    40: "Network is unreachable",
	    41: "Too many open files in system",
	    42: "No buffer space available",
	    43: "No such device",
	    44: "No such file or directory",
	    45: "Exec format error",
	    46: "No record locks available",
	    47: "The link has been severed",
	    48: "Not enough core",
	    49: "No message of desired type",
	    50: "Protocol not available",
	    51: "No space left on device",
	    52: "Function not implemented",
	    53: "Socket is not connected",
	    54: "Not a directory",
	    55: "Directory not empty",
	    56: "State not recoverable",
	    57: "Socket operation on non-socket",
	    59: "Not a typewriter",
	    60: "No such device or address",
	    61: "Value too large for defined data type",
	    62: "Previous owner died",
	    63: "Not super-user",
	    64: "Broken pipe",
	    65: "Protocol error",
	    66: "Unknown protocol",
	    67: "Protocol wrong type for socket",
	    68: "Math result not representable",
	    69: "Read only file system",
	    70: "Illegal seek",
	    71: "No such process",
	    72: "Stale file handle",
	    73: "Connection timed out",
	    74: "Text file busy",
	    75: "Cross-device link",
	    100: "Device not a stream",
	    101: "Bad font file fmt",
	    102: "Invalid slot",
	    103: "Invalid request code",
	    104: "No anode",
	    105: "Block device required",
	    106: "Channel number out of range",
	    107: "Level 3 halted",
	    108: "Level 3 reset",
	    109: "Link number out of range",
	    110: "Protocol driver not attached",
	    111: "No CSI structure available",
	    112: "Level 2 halted",
	    113: "Invalid exchange",
	    114: "Invalid request descriptor",
	    115: "Exchange full",
	    116: "No data (for no delay io)",
	    117: "Timer expired",
	    118: "Out of streams resources",
	    119: "Machine is not on the network",
	    120: "Package not installed",
	    121: "The object is remote",
	    122: "Advertise error",
	    123: "Srmount error",
	    124: "Communication error on send",
	    125: "Cross mount point (not really error)",
	    126: "Given log. name not unique",
	    127: "f.d. invalid for this operation",
	    128: "Remote address changed",
	    129: "Can   access a needed shared lib",
	    130: "Accessing a corrupted shared lib",
	    131: ".lib section in a.out corrupted",
	    132: "Attempting to link in too many libs",
	    133: "Attempting to exec a shared library",
	    135: "Streams pipe error",
	    136: "Too many users",
	    137: "Socket type not supported",
	    138: "Not supported",
	    139: "Protocol family not supported",
	    140: "Can't send after socket shutdown",
	    141: "Too many references",
	    142: "Host is down",
	    148: "No medium (in tape drive)",
	    156: "Level 2 not synchronized"
	  };
	  var ERRNO_CODES = {};
	  var FS = {
	    root: null,
	    mounts: [],
	    devices: {},
	    streams: [],
	    nextInode: 1,
	    nameTable: null,
	    currentPath: "/",
	    initialized: false,
	    ignorePermissions: true,
	    ErrnoError: null,
	    genericErrors: {},
	    filesystems: null,
	    syncFSRequests: 0,
	    lookupPath: function (path) {
	      let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	      path = PATH_FS.resolve(FS.cwd(), path);
	      if (!path) return {
	        path: "",
	        node: null
	      };
	      var defaults = {
	        follow_mount: true,
	        recurse_count: 0
	      };
	      opts = Object.assign(defaults, opts);

	      if (opts.recurse_count > 8) {
	        throw new FS.ErrnoError(32);
	      }

	      var parts = PATH.normalizeArray(path.split("/").filter(p => !!p), false);
	      var current = FS.root;
	      var current_path = "/";

	      for (var i = 0; i < parts.length; i++) {
	        var islast = i === parts.length - 1;

	        if (islast && opts.parent) {
	          break;
	        }

	        current = FS.lookupNode(current, parts[i]);
	        current_path = PATH.join2(current_path, parts[i]);

	        if (FS.isMountpoint(current)) {
	          if (!islast || islast && opts.follow_mount) {
	            current = current.mounted.root;
	          }
	        }

	        if (!islast || opts.follow) {
	          var count = 0;

	          while (FS.isLink(current.mode)) {
	            var link = FS.readlink(current_path);
	            current_path = PATH_FS.resolve(PATH.dirname(current_path), link);
	            var lookup = FS.lookupPath(current_path, {
	              recurse_count: opts.recurse_count + 1
	            });
	            current = lookup.node;

	            if (count++ > 40) {
	              throw new FS.ErrnoError(32);
	            }
	          }
	        }
	      }

	      return {
	        path: current_path,
	        node: current
	      };
	    },
	    getPath: node => {
	      var path;

	      while (true) {
	        if (FS.isRoot(node)) {
	          var mount = node.mount.mountpoint;
	          if (!path) return mount;
	          return mount[mount.length - 1] !== "/" ? mount + "/" + path : mount + path;
	        }

	        path = path ? node.name + "/" + path : node.name;
	        node = node.parent;
	      }
	    },
	    hashName: (parentid, name) => {
	      var hash = 0;

	      for (var i = 0; i < name.length; i++) {
	        hash = (hash << 5) - hash + name.charCodeAt(i) | 0;
	      }

	      return (parentid + hash >>> 0) % FS.nameTable.length;
	    },
	    hashAddNode: node => {
	      var hash = FS.hashName(node.parent.id, node.name);
	      node.name_next = FS.nameTable[hash];
	      FS.nameTable[hash] = node;
	    },
	    hashRemoveNode: node => {
	      var hash = FS.hashName(node.parent.id, node.name);

	      if (FS.nameTable[hash] === node) {
	        FS.nameTable[hash] = node.name_next;
	      } else {
	        var current = FS.nameTable[hash];

	        while (current) {
	          if (current.name_next === node) {
	            current.name_next = node.name_next;
	            break;
	          }

	          current = current.name_next;
	        }
	      }
	    },
	    lookupNode: (parent, name) => {
	      var errCode = FS.mayLookup(parent);

	      if (errCode) {
	        throw new FS.ErrnoError(errCode, parent);
	      }

	      var hash = FS.hashName(parent.id, name);

	      for (var node = FS.nameTable[hash]; node; node = node.name_next) {
	        var nodeName = node.name;

	        if (node.parent.id === parent.id && nodeName === name) {
	          return node;
	        }
	      }

	      return FS.lookup(parent, name);
	    },
	    createNode: (parent, name, mode, rdev) => {
	      assert(typeof parent == "object");
	      var node = new FS.FSNode(parent, name, mode, rdev);
	      FS.hashAddNode(node);
	      return node;
	    },
	    destroyNode: node => {
	      FS.hashRemoveNode(node);
	    },
	    isRoot: node => {
	      return node === node.parent;
	    },
	    isMountpoint: node => {
	      return !!node.mounted;
	    },
	    isFile: mode => {
	      return (mode & 61440) === 32768;
	    },
	    isDir: mode => {
	      return (mode & 61440) === 16384;
	    },
	    isLink: mode => {
	      return (mode & 61440) === 40960;
	    },
	    isChrdev: mode => {
	      return (mode & 61440) === 8192;
	    },
	    isBlkdev: mode => {
	      return (mode & 61440) === 24576;
	    },
	    isFIFO: mode => {
	      return (mode & 61440) === 4096;
	    },
	    isSocket: mode => {
	      return (mode & 49152) === 49152;
	    },
	    flagModes: {
	      "r": 0,
	      "r+": 2,
	      "w": 577,
	      "w+": 578,
	      "a": 1089,
	      "a+": 1090
	    },
	    modeStringToFlags: str => {
	      var flags = FS.flagModes[str];

	      if (typeof flags == "undefined") {
	        throw new Error("Unknown file open mode: " + str);
	      }

	      return flags;
	    },
	    flagsToPermissionString: flag => {
	      var perms = ["r", "w", "rw"][flag & 3];

	      if (flag & 512) {
	        perms += "w";
	      }

	      return perms;
	    },
	    nodePermissions: (node, perms) => {
	      if (FS.ignorePermissions) {
	        return 0;
	      }

	      if (perms.includes("r") && !(node.mode & 292)) {
	        return 2;
	      } else if (perms.includes("w") && !(node.mode & 146)) {
	        return 2;
	      } else if (perms.includes("x") && !(node.mode & 73)) {
	        return 2;
	      }

	      return 0;
	    },
	    mayLookup: dir => {
	      var errCode = FS.nodePermissions(dir, "x");
	      if (errCode) return errCode;
	      if (!dir.node_ops.lookup) return 2;
	      return 0;
	    },
	    mayCreate: (dir, name) => {
	      try {
	        var node = FS.lookupNode(dir, name);
	        return 20;
	      } catch (e) {}

	      return FS.nodePermissions(dir, "wx");
	    },
	    mayDelete: (dir, name, isdir) => {
	      var node;

	      try {
	        node = FS.lookupNode(dir, name);
	      } catch (e) {
	        return e.errno;
	      }

	      var errCode = FS.nodePermissions(dir, "wx");

	      if (errCode) {
	        return errCode;
	      }

	      if (isdir) {
	        if (!FS.isDir(node.mode)) {
	          return 54;
	        }

	        if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
	          return 10;
	        }
	      } else {
	        if (FS.isDir(node.mode)) {
	          return 31;
	        }
	      }

	      return 0;
	    },
	    mayOpen: (node, flags) => {
	      if (!node) {
	        return 44;
	      }

	      if (FS.isLink(node.mode)) {
	        return 32;
	      } else if (FS.isDir(node.mode)) {
	        if (FS.flagsToPermissionString(flags) !== "r" || flags & 512) {
	          return 31;
	        }
	      }

	      return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
	    },
	    MAX_OPEN_FDS: 4096,
	    nextfd: function () {
	      let fd_start = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
	      let fd_end = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : FS.MAX_OPEN_FDS;

	      for (var fd = fd_start; fd <= fd_end; fd++) {
	        if (!FS.streams[fd]) {
	          return fd;
	        }
	      }

	      throw new FS.ErrnoError(33);
	    },
	    getStream: fd => FS.streams[fd],
	    createStream: (stream, fd_start, fd_end) => {
	      if (!FS.FSStream) {
	        FS.FSStream = function () {
	          this.shared = {};
	        };

	        FS.FSStream.prototype = {
	          object: {
	            get: function () {
	              return this.node;
	            },
	            set: function (val) {
	              this.node = val;
	            }
	          },
	          isRead: {
	            get: function () {
	              return (this.flags & 2097155) !== 1;
	            }
	          },
	          isWrite: {
	            get: function () {
	              return (this.flags & 2097155) !== 0;
	            }
	          },
	          isAppend: {
	            get: function () {
	              return this.flags & 1024;
	            }
	          },
	          flags: {
	            get: function () {
	              return this.shared.flags;
	            },
	            set: function (val) {
	              this.shared.flags = val;
	            }
	          },
	          position: {
	            get function() {
	              return this.shared.position;
	            },

	            set: function (val) {
	              this.shared.position = val;
	            }
	          }
	        };
	      }

	      stream = Object.assign(new FS.FSStream(), stream);
	      var fd = FS.nextfd(fd_start, fd_end);
	      stream.fd = fd;
	      FS.streams[fd] = stream;
	      return stream;
	    },
	    closeStream: fd => {
	      FS.streams[fd] = null;
	    },
	    chrdev_stream_ops: {
	      open: stream => {
	        var device = FS.getDevice(stream.node.rdev);
	        stream.stream_ops = device.stream_ops;

	        if (stream.stream_ops.open) {
	          stream.stream_ops.open(stream);
	        }
	      },
	      llseek: () => {
	        throw new FS.ErrnoError(70);
	      }
	    },
	    major: dev => dev >> 8,
	    minor: dev => dev & 255,
	    makedev: (ma, mi) => ma << 8 | mi,
	    registerDevice: (dev, ops) => {
	      FS.devices[dev] = {
	        stream_ops: ops
	      };
	    },
	    getDevice: dev => FS.devices[dev],
	    getMounts: mount => {
	      var mounts = [];
	      var check = [mount];

	      while (check.length) {
	        var m = check.pop();
	        mounts.push(m);
	        check.push.apply(check, m.mounts);
	      }

	      return mounts;
	    },
	    syncfs: (populate, callback) => {
	      if (typeof populate == "function") {
	        callback = populate;
	        populate = false;
	      }

	      FS.syncFSRequests++;

	      if (FS.syncFSRequests > 1) {
	        err("warning: " + FS.syncFSRequests + " FS.syncfs operations in flight at once, probably just doing extra work");
	      }

	      var mounts = FS.getMounts(FS.root.mount);
	      var completed = 0;

	      function doCallback(errCode) {
	        assert(FS.syncFSRequests > 0);
	        FS.syncFSRequests--;
	        return callback(errCode);
	      }

	      function done(errCode) {
	        if (errCode) {
	          if (!done.errored) {
	            done.errored = true;
	            return doCallback(errCode);
	          }

	          return;
	        }

	        if (++completed >= mounts.length) {
	          doCallback(null);
	        }
	      }

	      mounts.forEach(mount => {
	        if (!mount.type.syncfs) {
	          return done(null);
	        }

	        mount.type.syncfs(mount, populate, done);
	      });
	    },
	    mount: (type, opts, mountpoint) => {
	      if (typeof type == "string") {
	        throw type;
	      }

	      var root = mountpoint === "/";
	      var pseudo = !mountpoint;
	      var node;

	      if (root && FS.root) {
	        throw new FS.ErrnoError(10);
	      } else if (!root && !pseudo) {
	        var lookup = FS.lookupPath(mountpoint, {
	          follow_mount: false
	        });
	        mountpoint = lookup.path;
	        node = lookup.node;

	        if (FS.isMountpoint(node)) {
	          throw new FS.ErrnoError(10);
	        }

	        if (!FS.isDir(node.mode)) {
	          throw new FS.ErrnoError(54);
	        }
	      }

	      var mount = {
	        type: type,
	        opts: opts,
	        mountpoint: mountpoint,
	        mounts: []
	      };
	      var mountRoot = type.mount(mount);
	      mountRoot.mount = mount;
	      mount.root = mountRoot;

	      if (root) {
	        FS.root = mountRoot;
	      } else if (node) {
	        node.mounted = mount;

	        if (node.mount) {
	          node.mount.mounts.push(mount);
	        }
	      }

	      return mountRoot;
	    },
	    unmount: mountpoint => {
	      var lookup = FS.lookupPath(mountpoint, {
	        follow_mount: false
	      });

	      if (!FS.isMountpoint(lookup.node)) {
	        throw new FS.ErrnoError(28);
	      }

	      var node = lookup.node;
	      var mount = node.mounted;
	      var mounts = FS.getMounts(mount);
	      Object.keys(FS.nameTable).forEach(hash => {
	        var current = FS.nameTable[hash];

	        while (current) {
	          var next = current.name_next;

	          if (mounts.includes(current.mount)) {
	            FS.destroyNode(current);
	          }

	          current = next;
	        }
	      });
	      node.mounted = null;
	      var idx = node.mount.mounts.indexOf(mount);
	      assert(idx !== -1);
	      node.mount.mounts.splice(idx, 1);
	    },
	    lookup: (parent, name) => {
	      return parent.node_ops.lookup(parent, name);
	    },
	    mknod: (path, mode, dev) => {
	      var lookup = FS.lookupPath(path, {
	        parent: true
	      });
	      var parent = lookup.node;
	      var name = PATH.basename(path);

	      if (!name || name === "." || name === "..") {
	        throw new FS.ErrnoError(28);
	      }

	      var errCode = FS.mayCreate(parent, name);

	      if (errCode) {
	        throw new FS.ErrnoError(errCode);
	      }

	      if (!parent.node_ops.mknod) {
	        throw new FS.ErrnoError(63);
	      }

	      return parent.node_ops.mknod(parent, name, mode, dev);
	    },
	    create: (path, mode) => {
	      mode = mode !== undefined ? mode : 438;
	      mode &= 4095;
	      mode |= 32768;
	      return FS.mknod(path, mode, 0);
	    },
	    mkdir: (path, mode) => {
	      mode = mode !== undefined ? mode : 511;
	      mode &= 511 | 512;
	      mode |= 16384;
	      return FS.mknod(path, mode, 0);
	    },
	    mkdirTree: (path, mode) => {
	      var dirs = path.split("/");
	      var d = "";

	      for (var i = 0; i < dirs.length; ++i) {
	        if (!dirs[i]) continue;
	        d += "/" + dirs[i];

	        try {
	          FS.mkdir(d, mode);
	        } catch (e) {
	          if (e.errno != 20) throw e;
	        }
	      }
	    },
	    mkdev: (path, mode, dev) => {
	      if (typeof dev == "undefined") {
	        dev = mode;
	        mode = 438;
	      }

	      mode |= 8192;
	      return FS.mknod(path, mode, dev);
	    },
	    symlink: (oldpath, newpath) => {
	      if (!PATH_FS.resolve(oldpath)) {
	        throw new FS.ErrnoError(44);
	      }

	      var lookup = FS.lookupPath(newpath, {
	        parent: true
	      });
	      var parent = lookup.node;

	      if (!parent) {
	        throw new FS.ErrnoError(44);
	      }

	      var newname = PATH.basename(newpath);
	      var errCode = FS.mayCreate(parent, newname);

	      if (errCode) {
	        throw new FS.ErrnoError(errCode);
	      }

	      if (!parent.node_ops.symlink) {
	        throw new FS.ErrnoError(63);
	      }

	      return parent.node_ops.symlink(parent, newname, oldpath);
	    },
	    rename: (old_path, new_path) => {
	      var old_dirname = PATH.dirname(old_path);
	      var new_dirname = PATH.dirname(new_path);
	      var old_name = PATH.basename(old_path);
	      var new_name = PATH.basename(new_path);
	      var lookup, old_dir, new_dir;
	      lookup = FS.lookupPath(old_path, {
	        parent: true
	      });
	      old_dir = lookup.node;
	      lookup = FS.lookupPath(new_path, {
	        parent: true
	      });
	      new_dir = lookup.node;
	      if (!old_dir || !new_dir) throw new FS.ErrnoError(44);

	      if (old_dir.mount !== new_dir.mount) {
	        throw new FS.ErrnoError(75);
	      }

	      var old_node = FS.lookupNode(old_dir, old_name);
	      var relative = PATH_FS.relative(old_path, new_dirname);

	      if (relative.charAt(0) !== ".") {
	        throw new FS.ErrnoError(28);
	      }

	      relative = PATH_FS.relative(new_path, old_dirname);

	      if (relative.charAt(0) !== ".") {
	        throw new FS.ErrnoError(55);
	      }

	      var new_node;

	      try {
	        new_node = FS.lookupNode(new_dir, new_name);
	      } catch (e) {}

	      if (old_node === new_node) {
	        return;
	      }

	      var isdir = FS.isDir(old_node.mode);
	      var errCode = FS.mayDelete(old_dir, old_name, isdir);

	      if (errCode) {
	        throw new FS.ErrnoError(errCode);
	      }

	      errCode = new_node ? FS.mayDelete(new_dir, new_name, isdir) : FS.mayCreate(new_dir, new_name);

	      if (errCode) {
	        throw new FS.ErrnoError(errCode);
	      }

	      if (!old_dir.node_ops.rename) {
	        throw new FS.ErrnoError(63);
	      }

	      if (FS.isMountpoint(old_node) || new_node && FS.isMountpoint(new_node)) {
	        throw new FS.ErrnoError(10);
	      }

	      if (new_dir !== old_dir) {
	        errCode = FS.nodePermissions(old_dir, "w");

	        if (errCode) {
	          throw new FS.ErrnoError(errCode);
	        }
	      }

	      FS.hashRemoveNode(old_node);

	      try {
	        old_dir.node_ops.rename(old_node, new_dir, new_name);
	      } catch (e) {
	        throw e;
	      } finally {
	        FS.hashAddNode(old_node);
	      }
	    },
	    rmdir: path => {
	      var lookup = FS.lookupPath(path, {
	        parent: true
	      });
	      var parent = lookup.node;
	      var name = PATH.basename(path);
	      var node = FS.lookupNode(parent, name);
	      var errCode = FS.mayDelete(parent, name, true);

	      if (errCode) {
	        throw new FS.ErrnoError(errCode);
	      }

	      if (!parent.node_ops.rmdir) {
	        throw new FS.ErrnoError(63);
	      }

	      if (FS.isMountpoint(node)) {
	        throw new FS.ErrnoError(10);
	      }

	      parent.node_ops.rmdir(parent, name);
	      FS.destroyNode(node);
	    },
	    readdir: path => {
	      var lookup = FS.lookupPath(path, {
	        follow: true
	      });
	      var node = lookup.node;

	      if (!node.node_ops.readdir) {
	        throw new FS.ErrnoError(54);
	      }

	      return node.node_ops.readdir(node);
	    },
	    unlink: path => {
	      var lookup = FS.lookupPath(path, {
	        parent: true
	      });
	      var parent = lookup.node;

	      if (!parent) {
	        throw new FS.ErrnoError(44);
	      }

	      var name = PATH.basename(path);
	      var node = FS.lookupNode(parent, name);
	      var errCode = FS.mayDelete(parent, name, false);

	      if (errCode) {
	        throw new FS.ErrnoError(errCode);
	      }

	      if (!parent.node_ops.unlink) {
	        throw new FS.ErrnoError(63);
	      }

	      if (FS.isMountpoint(node)) {
	        throw new FS.ErrnoError(10);
	      }

	      parent.node_ops.unlink(parent, name);
	      FS.destroyNode(node);
	    },
	    readlink: path => {
	      var lookup = FS.lookupPath(path);
	      var link = lookup.node;

	      if (!link) {
	        throw new FS.ErrnoError(44);
	      }

	      if (!link.node_ops.readlink) {
	        throw new FS.ErrnoError(28);
	      }

	      return PATH_FS.resolve(FS.getPath(link.parent), link.node_ops.readlink(link));
	    },
	    stat: (path, dontFollow) => {
	      var lookup = FS.lookupPath(path, {
	        follow: !dontFollow
	      });
	      var node = lookup.node;

	      if (!node) {
	        throw new FS.ErrnoError(44);
	      }

	      if (!node.node_ops.getattr) {
	        throw new FS.ErrnoError(63);
	      }

	      return node.node_ops.getattr(node);
	    },
	    lstat: path => {
	      return FS.stat(path, true);
	    },
	    chmod: (path, mode, dontFollow) => {
	      var node;

	      if (typeof path == "string") {
	        var lookup = FS.lookupPath(path, {
	          follow: !dontFollow
	        });
	        node = lookup.node;
	      } else {
	        node = path;
	      }

	      if (!node.node_ops.setattr) {
	        throw new FS.ErrnoError(63);
	      }

	      node.node_ops.setattr(node, {
	        mode: mode & 4095 | node.mode & ~4095,
	        timestamp: Date.now()
	      });
	    },
	    lchmod: (path, mode) => {
	      FS.chmod(path, mode, true);
	    },
	    fchmod: (fd, mode) => {
	      var stream = FS.getStream(fd);

	      if (!stream) {
	        throw new FS.ErrnoError(8);
	      }

	      FS.chmod(stream.node, mode);
	    },
	    chown: (path, uid, gid, dontFollow) => {
	      var node;

	      if (typeof path == "string") {
	        var lookup = FS.lookupPath(path, {
	          follow: !dontFollow
	        });
	        node = lookup.node;
	      } else {
	        node = path;
	      }

	      if (!node.node_ops.setattr) {
	        throw new FS.ErrnoError(63);
	      }

	      node.node_ops.setattr(node, {
	        timestamp: Date.now()
	      });
	    },
	    lchown: (path, uid, gid) => {
	      FS.chown(path, uid, gid, true);
	    },
	    fchown: (fd, uid, gid) => {
	      var stream = FS.getStream(fd);

	      if (!stream) {
	        throw new FS.ErrnoError(8);
	      }

	      FS.chown(stream.node, uid, gid);
	    },
	    truncate: (path, len) => {
	      if (len < 0) {
	        throw new FS.ErrnoError(28);
	      }

	      var node;

	      if (typeof path == "string") {
	        var lookup = FS.lookupPath(path, {
	          follow: true
	        });
	        node = lookup.node;
	      } else {
	        node = path;
	      }

	      if (!node.node_ops.setattr) {
	        throw new FS.ErrnoError(63);
	      }

	      if (FS.isDir(node.mode)) {
	        throw new FS.ErrnoError(31);
	      }

	      if (!FS.isFile(node.mode)) {
	        throw new FS.ErrnoError(28);
	      }

	      var errCode = FS.nodePermissions(node, "w");

	      if (errCode) {
	        throw new FS.ErrnoError(errCode);
	      }

	      node.node_ops.setattr(node, {
	        size: len,
	        timestamp: Date.now()
	      });
	    },
	    ftruncate: (fd, len) => {
	      var stream = FS.getStream(fd);

	      if (!stream) {
	        throw new FS.ErrnoError(8);
	      }

	      if ((stream.flags & 2097155) === 0) {
	        throw new FS.ErrnoError(28);
	      }

	      FS.truncate(stream.node, len);
	    },
	    utime: (path, atime, mtime) => {
	      var lookup = FS.lookupPath(path, {
	        follow: true
	      });
	      var node = lookup.node;
	      node.node_ops.setattr(node, {
	        timestamp: Math.max(atime, mtime)
	      });
	    },
	    open: (path, flags, mode, fd_start, fd_end) => {
	      if (path === "") {
	        throw new FS.ErrnoError(44);
	      }

	      flags = typeof flags == "string" ? FS.modeStringToFlags(flags) : flags;
	      mode = typeof mode == "undefined" ? 438 : mode;

	      if (flags & 64) {
	        mode = mode & 4095 | 32768;
	      } else {
	        mode = 0;
	      }

	      var node;

	      if (typeof path == "object") {
	        node = path;
	      } else {
	        path = PATH.normalize(path);

	        try {
	          var lookup = FS.lookupPath(path, {
	            follow: !(flags & 131072)
	          });
	          node = lookup.node;
	        } catch (e) {}
	      }

	      var created = false;

	      if (flags & 64) {
	        if (node) {
	          if (flags & 128) {
	            throw new FS.ErrnoError(20);
	          }
	        } else {
	          node = FS.mknod(path, mode, 0);
	          created = true;
	        }
	      }

	      if (!node) {
	        throw new FS.ErrnoError(44);
	      }

	      if (FS.isChrdev(node.mode)) {
	        flags &= ~512;
	      }

	      if (flags & 65536 && !FS.isDir(node.mode)) {
	        throw new FS.ErrnoError(54);
	      }

	      if (!created) {
	        var errCode = FS.mayOpen(node, flags);

	        if (errCode) {
	          throw new FS.ErrnoError(errCode);
	        }
	      }

	      if (flags & 512) {
	        FS.truncate(node, 0);
	      }

	      flags &= ~(128 | 512 | 131072);
	      var stream = FS.createStream({
	        node: node,
	        path: FS.getPath(node),
	        flags: flags,
	        seekable: true,
	        position: 0,
	        stream_ops: node.stream_ops,
	        ungotten: [],
	        error: false
	      }, fd_start, fd_end);

	      if (stream.stream_ops.open) {
	        stream.stream_ops.open(stream);
	      }

	      if (Module["logReadFiles"] && !(flags & 1)) {
	        if (!FS.readFiles) FS.readFiles = {};

	        if (!(path in FS.readFiles)) {
	          FS.readFiles[path] = 1;
	        }
	      }

	      return stream;
	    },
	    close: stream => {
	      if (FS.isClosed(stream)) {
	        throw new FS.ErrnoError(8);
	      }

	      if (stream.getdents) stream.getdents = null;

	      try {
	        if (stream.stream_ops.close) {
	          stream.stream_ops.close(stream);
	        }
	      } catch (e) {
	        throw e;
	      } finally {
	        FS.closeStream(stream.fd);
	      }

	      stream.fd = null;
	    },
	    isClosed: stream => {
	      return stream.fd === null;
	    },
	    llseek: (stream, offset, whence) => {
	      if (FS.isClosed(stream)) {
	        throw new FS.ErrnoError(8);
	      }

	      if (!stream.seekable || !stream.stream_ops.llseek) {
	        throw new FS.ErrnoError(70);
	      }

	      if (whence != 0 && whence != 1 && whence != 2) {
	        throw new FS.ErrnoError(28);
	      }

	      stream.position = stream.stream_ops.llseek(stream, offset, whence);
	      stream.ungotten = [];
	      return stream.position;
	    },
	    read: (stream, buffer, offset, length, position) => {
	      if (length < 0 || position < 0) {
	        throw new FS.ErrnoError(28);
	      }

	      if (FS.isClosed(stream)) {
	        throw new FS.ErrnoError(8);
	      }

	      if ((stream.flags & 2097155) === 1) {
	        throw new FS.ErrnoError(8);
	      }

	      if (FS.isDir(stream.node.mode)) {
	        throw new FS.ErrnoError(31);
	      }

	      if (!stream.stream_ops.read) {
	        throw new FS.ErrnoError(28);
	      }

	      var seeking = typeof position != "undefined";

	      if (!seeking) {
	        position = stream.position;
	      } else if (!stream.seekable) {
	        throw new FS.ErrnoError(70);
	      }

	      var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
	      if (!seeking) stream.position += bytesRead;
	      return bytesRead;
	    },
	    write: (stream, buffer, offset, length, position, canOwn) => {
	      if (length < 0 || position < 0) {
	        throw new FS.ErrnoError(28);
	      }

	      if (FS.isClosed(stream)) {
	        throw new FS.ErrnoError(8);
	      }

	      if ((stream.flags & 2097155) === 0) {
	        throw new FS.ErrnoError(8);
	      }

	      if (FS.isDir(stream.node.mode)) {
	        throw new FS.ErrnoError(31);
	      }

	      if (!stream.stream_ops.write) {
	        throw new FS.ErrnoError(28);
	      }

	      if (stream.seekable && stream.flags & 1024) {
	        FS.llseek(stream, 0, 2);
	      }

	      var seeking = typeof position != "undefined";

	      if (!seeking) {
	        position = stream.position;
	      } else if (!stream.seekable) {
	        throw new FS.ErrnoError(70);
	      }

	      var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
	      if (!seeking) stream.position += bytesWritten;
	      return bytesWritten;
	    },
	    allocate: (stream, offset, length) => {
	      if (FS.isClosed(stream)) {
	        throw new FS.ErrnoError(8);
	      }

	      if (offset < 0 || length <= 0) {
	        throw new FS.ErrnoError(28);
	      }

	      if ((stream.flags & 2097155) === 0) {
	        throw new FS.ErrnoError(8);
	      }

	      if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) {
	        throw new FS.ErrnoError(43);
	      }

	      if (!stream.stream_ops.allocate) {
	        throw new FS.ErrnoError(138);
	      }

	      stream.stream_ops.allocate(stream, offset, length);
	    },
	    mmap: (stream, address, length, position, prot, flags) => {
	      if ((prot & 2) !== 0 && (flags & 2) === 0 && (stream.flags & 2097155) !== 2) {
	        throw new FS.ErrnoError(2);
	      }

	      if ((stream.flags & 2097155) === 1) {
	        throw new FS.ErrnoError(2);
	      }

	      if (!stream.stream_ops.mmap) {
	        throw new FS.ErrnoError(43);
	      }

	      return stream.stream_ops.mmap(stream, address, length, position, prot, flags);
	    },
	    msync: (stream, buffer, offset, length, mmapFlags) => {
	      if (!stream || !stream.stream_ops.msync) {
	        return 0;
	      }

	      return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags);
	    },
	    munmap: stream => 0,
	    ioctl: (stream, cmd, arg) => {
	      if (!stream.stream_ops.ioctl) {
	        throw new FS.ErrnoError(59);
	      }

	      return stream.stream_ops.ioctl(stream, cmd, arg);
	    },
	    readFile: function (path) {
	      let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	      opts.flags = opts.flags || 0;
	      opts.encoding = opts.encoding || "binary";

	      if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
	        throw new Error('Invalid encoding type "' + opts.encoding + '"');
	      }

	      var ret;
	      var stream = FS.open(path, opts.flags);
	      var stat = FS.stat(path);
	      var length = stat.size;
	      var buf = new Uint8Array(length);
	      FS.read(stream, buf, 0, length, 0);

	      if (opts.encoding === "utf8") {
	        ret = UTF8ArrayToString(buf, 0);
	      } else if (opts.encoding === "binary") {
	        ret = buf;
	      }

	      FS.close(stream);
	      return ret;
	    },
	    writeFile: function (path, data) {
	      let opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
	      opts.flags = opts.flags || 577;
	      var stream = FS.open(path, opts.flags, opts.mode);

	      if (typeof data == "string") {
	        var buf = new Uint8Array(lengthBytesUTF8(data) + 1);
	        var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
	        FS.write(stream, buf, 0, actualNumBytes, undefined, opts.canOwn);
	      } else if (ArrayBuffer.isView(data)) {
	        FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn);
	      } else {
	        throw new Error("Unsupported data type");
	      }

	      FS.close(stream);
	    },
	    cwd: () => FS.currentPath,
	    chdir: path => {
	      var lookup = FS.lookupPath(path, {
	        follow: true
	      });

	      if (lookup.node === null) {
	        throw new FS.ErrnoError(44);
	      }

	      if (!FS.isDir(lookup.node.mode)) {
	        throw new FS.ErrnoError(54);
	      }

	      var errCode = FS.nodePermissions(lookup.node, "x");

	      if (errCode) {
	        throw new FS.ErrnoError(errCode);
	      }

	      FS.currentPath = lookup.path;
	    },
	    createDefaultDirectories: () => {
	      FS.mkdir("/tmp");
	      FS.mkdir("/home");
	      FS.mkdir("/home/web_user");
	    },
	    createDefaultDevices: () => {
	      FS.mkdir("/dev");
	      FS.registerDevice(FS.makedev(1, 3), {
	        read: () => 0,
	        write: (stream, buffer, offset, length, pos) => length
	      });
	      FS.mkdev("/dev/null", FS.makedev(1, 3));
	      TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
	      TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
	      FS.mkdev("/dev/tty", FS.makedev(5, 0));
	      FS.mkdev("/dev/tty1", FS.makedev(6, 0));
	      var random_device = getRandomDevice();
	      FS.createDevice("/dev", "random", random_device);
	      FS.createDevice("/dev", "urandom", random_device);
	      FS.mkdir("/dev/shm");
	      FS.mkdir("/dev/shm/tmp");
	    },
	    createSpecialDirectories: () => {
	      FS.mkdir("/proc");
	      var proc_self = FS.mkdir("/proc/self");
	      FS.mkdir("/proc/self/fd");
	      FS.mount({
	        mount: () => {
	          var node = FS.createNode(proc_self, "fd", 16384 | 511, 73);
	          node.node_ops = {
	            lookup: (parent, name) => {
	              var fd = +name;
	              var stream = FS.getStream(fd);
	              if (!stream) throw new FS.ErrnoError(8);
	              var ret = {
	                parent: null,
	                mount: {
	                  mountpoint: "fake"
	                },
	                node_ops: {
	                  readlink: () => stream.path
	                }
	              };
	              ret.parent = ret;
	              return ret;
	            }
	          };
	          return node;
	        }
	      }, {}, "/proc/self/fd");
	    },
	    createStandardStreams: () => {
	      if (Module["stdin"]) {
	        FS.createDevice("/dev", "stdin", Module["stdin"]);
	      } else {
	        FS.symlink("/dev/tty", "/dev/stdin");
	      }

	      if (Module["stdout"]) {
	        FS.createDevice("/dev", "stdout", null, Module["stdout"]);
	      } else {
	        FS.symlink("/dev/tty", "/dev/stdout");
	      }

	      if (Module["stderr"]) {
	        FS.createDevice("/dev", "stderr", null, Module["stderr"]);
	      } else {
	        FS.symlink("/dev/tty1", "/dev/stderr");
	      }

	      var stdin = FS.open("/dev/stdin", 0);
	      var stdout = FS.open("/dev/stdout", 1);
	      var stderr = FS.open("/dev/stderr", 1);
	      assert(stdin.fd === 0, "invalid handle for stdin (" + stdin.fd + ")");
	      assert(stdout.fd === 1, "invalid handle for stdout (" + stdout.fd + ")");
	      assert(stderr.fd === 2, "invalid handle for stderr (" + stderr.fd + ")");
	    },
	    ensureErrnoError: () => {
	      if (FS.ErrnoError) return;

	      FS.ErrnoError = function ErrnoError(errno, node) {
	        this.node = node;

	        this.setErrno = function (errno) {
	          this.errno = errno;

	          for (var key in ERRNO_CODES) {
	            if (ERRNO_CODES[key] === errno) {
	              this.code = key;
	              break;
	            }
	          }
	        };

	        this.setErrno(errno);
	        this.message = ERRNO_MESSAGES[errno];

	        if (this.stack) {
	          Object.defineProperty(this, "stack", {
	            value: new Error().stack,
	            writable: true
	          });
	          this.stack = demangleAll(this.stack);
	        }
	      };

	      FS.ErrnoError.prototype = new Error();
	      FS.ErrnoError.prototype.constructor = FS.ErrnoError;
	      [44].forEach(code => {
	        FS.genericErrors[code] = new FS.ErrnoError(code);
	        FS.genericErrors[code].stack = "<generic error, no stack>";
	      });
	    },
	    staticInit: () => {
	      FS.ensureErrnoError();
	      FS.nameTable = new Array(4096);
	      FS.mount(MEMFS, {}, "/");
	      FS.createDefaultDirectories();
	      FS.createDefaultDevices();
	      FS.createSpecialDirectories();
	      FS.filesystems = {
	        "MEMFS": MEMFS
	      };
	    },
	    init: (input, output, error) => {
	      assert(!FS.init.initialized, "FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)");
	      FS.init.initialized = true;
	      FS.ensureErrnoError();
	      Module["stdin"] = input || Module["stdin"];
	      Module["stdout"] = output || Module["stdout"];
	      Module["stderr"] = error || Module["stderr"];
	      FS.createStandardStreams();
	    },
	    quit: () => {
	      FS.init.initialized = false;

	      ___stdio_exit();

	      for (var i = 0; i < FS.streams.length; i++) {
	        var stream = FS.streams[i];

	        if (!stream) {
	          continue;
	        }

	        FS.close(stream);
	      }
	    },
	    getMode: (canRead, canWrite) => {
	      var mode = 0;
	      if (canRead) mode |= 292 | 73;
	      if (canWrite) mode |= 146;
	      return mode;
	    },
	    findObject: (path, dontResolveLastLink) => {
	      var ret = FS.analyzePath(path, dontResolveLastLink);

	      if (ret.exists) {
	        return ret.object;
	      } else {
	        return null;
	      }
	    },
	    analyzePath: (path, dontResolveLastLink) => {
	      try {
	        var lookup = FS.lookupPath(path, {
	          follow: !dontResolveLastLink
	        });
	        path = lookup.path;
	      } catch (e) {}

	      var ret = {
	        isRoot: false,
	        exists: false,
	        error: 0,
	        name: null,
	        path: null,
	        object: null,
	        parentExists: false,
	        parentPath: null,
	        parentObject: null
	      };

	      try {
	        var lookup = FS.lookupPath(path, {
	          parent: true
	        });
	        ret.parentExists = true;
	        ret.parentPath = lookup.path;
	        ret.parentObject = lookup.node;
	        ret.name = PATH.basename(path);
	        lookup = FS.lookupPath(path, {
	          follow: !dontResolveLastLink
	        });
	        ret.exists = true;
	        ret.path = lookup.path;
	        ret.object = lookup.node;
	        ret.name = lookup.node.name;
	        ret.isRoot = lookup.path === "/";
	      } catch (e) {
	        ret.error = e.errno;
	      }

	      return ret;
	    },
	    createPath: (parent, path, canRead, canWrite) => {
	      parent = typeof parent == "string" ? parent : FS.getPath(parent);
	      var parts = path.split("/").reverse();

	      while (parts.length) {
	        var part = parts.pop();
	        if (!part) continue;
	        var current = PATH.join2(parent, part);

	        try {
	          FS.mkdir(current);
	        } catch (e) {}

	        parent = current;
	      }

	      return current;
	    },
	    createFile: (parent, name, properties, canRead, canWrite) => {
	      var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name);
	      var mode = FS.getMode(canRead, canWrite);
	      return FS.create(path, mode);
	    },
	    createDataFile: (parent, name, data, canRead, canWrite, canOwn) => {
	      var path = name;

	      if (parent) {
	        parent = typeof parent == "string" ? parent : FS.getPath(parent);
	        path = name ? PATH.join2(parent, name) : parent;
	      }

	      var mode = FS.getMode(canRead, canWrite);
	      var node = FS.create(path, mode);

	      if (data) {
	        if (typeof data == "string") {
	          var arr = new Array(data.length);

	          for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);

	          data = arr;
	        }

	        FS.chmod(node, mode | 146);
	        var stream = FS.open(node, 577);
	        FS.write(stream, data, 0, data.length, 0, canOwn);
	        FS.close(stream);
	        FS.chmod(node, mode);
	      }

	      return node;
	    },
	    createDevice: (parent, name, input, output) => {
	      var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name);
	      var mode = FS.getMode(!!input, !!output);
	      if (!FS.createDevice.major) FS.createDevice.major = 64;
	      var dev = FS.makedev(FS.createDevice.major++, 0);
	      FS.registerDevice(dev, {
	        open: stream => {
	          stream.seekable = false;
	        },
	        close: stream => {
	          if (output && output.buffer && output.buffer.length) {
	            output(10);
	          }
	        },
	        read: (stream, buffer, offset, length, pos) => {
	          var bytesRead = 0;

	          for (var i = 0; i < length; i++) {
	            var result;

	            try {
	              result = input();
	            } catch (e) {
	              throw new FS.ErrnoError(29);
	            }

	            if (result === undefined && bytesRead === 0) {
	              throw new FS.ErrnoError(6);
	            }

	            if (result === null || result === undefined) break;
	            bytesRead++;
	            buffer[offset + i] = result;
	          }

	          if (bytesRead) {
	            stream.node.timestamp = Date.now();
	          }

	          return bytesRead;
	        },
	        write: (stream, buffer, offset, length, pos) => {
	          for (var i = 0; i < length; i++) {
	            try {
	              output(buffer[offset + i]);
	            } catch (e) {
	              throw new FS.ErrnoError(29);
	            }
	          }

	          if (length) {
	            stream.node.timestamp = Date.now();
	          }

	          return i;
	        }
	      });
	      return FS.mkdev(path, mode, dev);
	    },
	    forceLoadFile: obj => {
	      if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;

	      if (typeof XMLHttpRequest != "undefined") {
	        throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
	      } else if (read_) {
	        try {
	          obj.contents = intArrayFromString(read_(obj.url), true);
	          obj.usedBytes = obj.contents.length;
	        } catch (e) {
	          throw new FS.ErrnoError(29);
	        }
	      } else {
	        throw new Error("Cannot load without read() or XMLHttpRequest.");
	      }
	    },
	    createLazyFile: (parent, name, url, canRead, canWrite) => {
	      function LazyUint8Array() {
	        this.lengthKnown = false;
	        this.chunks = [];
	      }

	      LazyUint8Array.prototype.get = function LazyUint8Array_get(idx) {
	        if (idx > this.length - 1 || idx < 0) {
	          return undefined;
	        }

	        var chunkOffset = idx % this.chunkSize;
	        var chunkNum = idx / this.chunkSize | 0;
	        return this.getter(chunkNum)[chunkOffset];
	      };

	      LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
	        this.getter = getter;
	      };

	      LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
	        var xhr = new XMLHttpRequest();
	        xhr.open("HEAD", url, false);
	        xhr.send(null);
	        if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
	        var datalength = Number(xhr.getResponseHeader("Content-length"));
	        var header;
	        var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
	        var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
	        var chunkSize = 1024 * 1024;
	        if (!hasByteServing) chunkSize = datalength;

	        var doXHR = (from, to) => {
	          if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
	          if (to > datalength - 1) throw new Error("only " + datalength + " bytes available! programmer error!");
	          var xhr = new XMLHttpRequest();
	          xhr.open("GET", url, false);
	          if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
	          xhr.responseType = "arraybuffer";

	          if (xhr.overrideMimeType) {
	            xhr.overrideMimeType("text/plain; charset=x-user-defined");
	          }

	          xhr.send(null);
	          if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);

	          if (xhr.response !== undefined) {
	            return new Uint8Array(xhr.response || []);
	          } else {
	            return intArrayFromString(xhr.responseText || "", true);
	          }
	        };

	        var lazyArray = this;
	        lazyArray.setDataGetter(chunkNum => {
	          var start = chunkNum * chunkSize;
	          var end = (chunkNum + 1) * chunkSize - 1;
	          end = Math.min(end, datalength - 1);

	          if (typeof lazyArray.chunks[chunkNum] == "undefined") {
	            lazyArray.chunks[chunkNum] = doXHR(start, end);
	          }

	          if (typeof lazyArray.chunks[chunkNum] == "undefined") throw new Error("doXHR failed!");
	          return lazyArray.chunks[chunkNum];
	        });

	        if (usesGzip || !datalength) {
	          chunkSize = datalength = 1;
	          datalength = this.getter(0).length;
	          chunkSize = datalength;
	          out("LazyFiles on gzip forces download of the whole file when length is accessed");
	        }

	        this._length = datalength;
	        this._chunkSize = chunkSize;
	        this.lengthKnown = true;
	      };

	      if (typeof XMLHttpRequest != "undefined") {
	        if (!ENVIRONMENT_IS_WORKER) throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
	        var lazyArray = new LazyUint8Array();
	        Object.defineProperties(lazyArray, {
	          length: {
	            get: function () {
	              if (!this.lengthKnown) {
	                this.cacheLength();
	              }

	              return this._length;
	            }
	          },
	          chunkSize: {
	            get: function () {
	              if (!this.lengthKnown) {
	                this.cacheLength();
	              }

	              return this._chunkSize;
	            }
	          }
	        });
	        var properties = {
	          isDevice: false,
	          contents: lazyArray
	        };
	      } else {
	        var properties = {
	          isDevice: false,
	          url: url
	        };
	      }

	      var node = FS.createFile(parent, name, properties, canRead, canWrite);

	      if (properties.contents) {
	        node.contents = properties.contents;
	      } else if (properties.url) {
	        node.contents = null;
	        node.url = properties.url;
	      }

	      Object.defineProperties(node, {
	        usedBytes: {
	          get: function () {
	            return this.contents.length;
	          }
	        }
	      });
	      var stream_ops = {};
	      var keys = Object.keys(node.stream_ops);
	      keys.forEach(key => {
	        var fn = node.stream_ops[key];

	        stream_ops[key] = function forceLoadLazyFile() {
	          FS.forceLoadFile(node);
	          return fn.apply(null, arguments);
	        };
	      });

	      stream_ops.read = (stream, buffer, offset, length, position) => {
	        FS.forceLoadFile(node);
	        var contents = stream.node.contents;
	        if (position >= contents.length) return 0;
	        var size = Math.min(contents.length - position, length);
	        assert(size >= 0);

	        if (contents.slice) {
	          for (var i = 0; i < size; i++) {
	            buffer[offset + i] = contents[position + i];
	          }
	        } else {
	          for (var i = 0; i < size; i++) {
	            buffer[offset + i] = contents.get(position + i);
	          }
	        }

	        return size;
	      };

	      node.stream_ops = stream_ops;
	      return node;
	    },
	    createPreloadedFile: (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) => {
	      var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
	      var dep = getUniqueRunDependency("cp " + fullname);

	      function processData(byteArray) {
	        function finish(byteArray) {
	          if (preFinish) preFinish();

	          if (!dontCreateFile) {
	            FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
	          }

	          if (onload) onload();
	          removeRunDependency(dep);
	        }

	        if (Browser.handledByPreloadPlugin(byteArray, fullname, finish, () => {
	          if (onerror) onerror();
	          removeRunDependency(dep);
	        })) {
	          return;
	        }

	        finish(byteArray);
	      }

	      addRunDependency(dep);

	      if (typeof url == "string") {
	        asyncLoad(url, byteArray => processData(byteArray), onerror);
	      } else {
	        processData(url);
	      }
	    },
	    indexedDB: () => {
	      return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
	    },
	    DB_NAME: () => {
	      return "EM_FS_" + window.location.pathname;
	    },
	    DB_VERSION: 20,
	    DB_STORE_NAME: "FILE_DATA",
	    saveFilesToDB: (paths, onload, onerror) => {
	      onload = onload || (() => {});

	      onerror = onerror || (() => {});

	      var indexedDB = FS.indexedDB();

	      try {
	        var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
	      } catch (e) {
	        return onerror(e);
	      }

	      openRequest.onupgradeneeded = () => {
	        out("creating db");
	        var db = openRequest.result;
	        db.createObjectStore(FS.DB_STORE_NAME);
	      };

	      openRequest.onsuccess = () => {
	        var db = openRequest.result;
	        var transaction = db.transaction([FS.DB_STORE_NAME], "readwrite");
	        var files = transaction.objectStore(FS.DB_STORE_NAME);
	        var ok = 0,
	            fail = 0,
	            total = paths.length;

	        function finish() {
	          if (fail == 0) onload();else onerror();
	        }

	        paths.forEach(path => {
	          var putRequest = files.put(FS.analyzePath(path).object.contents, path);

	          putRequest.onsuccess = () => {
	            ok++;
	            if (ok + fail == total) finish();
	          };

	          putRequest.onerror = () => {
	            fail++;
	            if (ok + fail == total) finish();
	          };
	        });
	        transaction.onerror = onerror;
	      };

	      openRequest.onerror = onerror;
	    },
	    loadFilesFromDB: (paths, onload, onerror) => {
	      onload = onload || (() => {});

	      onerror = onerror || (() => {});

	      var indexedDB = FS.indexedDB();

	      try {
	        var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
	      } catch (e) {
	        return onerror(e);
	      }

	      openRequest.onupgradeneeded = onerror;

	      openRequest.onsuccess = () => {
	        var db = openRequest.result;

	        try {
	          var transaction = db.transaction([FS.DB_STORE_NAME], "readonly");
	        } catch (e) {
	          onerror(e);
	          return;
	        }

	        var files = transaction.objectStore(FS.DB_STORE_NAME);
	        var ok = 0,
	            fail = 0,
	            total = paths.length;

	        function finish() {
	          if (fail == 0) onload();else onerror();
	        }

	        paths.forEach(path => {
	          var getRequest = files.get(path);

	          getRequest.onsuccess = () => {
	            if (FS.analyzePath(path).exists) {
	              FS.unlink(path);
	            }

	            FS.createDataFile(PATH.dirname(path), PATH.basename(path), getRequest.result, true, true, true);
	            ok++;
	            if (ok + fail == total) finish();
	          };

	          getRequest.onerror = () => {
	            fail++;
	            if (ok + fail == total) finish();
	          };
	        });
	        transaction.onerror = onerror;
	      };

	      openRequest.onerror = onerror;
	    },
	    absolutePath: () => {
	      abort("FS.absolutePath has been removed; use PATH_FS.resolve instead");
	    },
	    createFolder: () => {
	      abort("FS.createFolder has been removed; use FS.mkdir instead");
	    },
	    createLink: () => {
	      abort("FS.createLink has been removed; use FS.symlink instead");
	    },
	    joinPath: () => {
	      abort("FS.joinPath has been removed; use PATH.join instead");
	    },
	    mmapAlloc: () => {
	      abort("FS.mmapAlloc has been replaced by the top level function mmapAlloc");
	    },
	    standardizePath: () => {
	      abort("FS.standardizePath has been removed; use PATH.normalize instead");
	    }
	  };
	  var SYSCALLS = {
	    DEFAULT_POLLMASK: 5,
	    calculateAt: function (dirfd, path, allowEmpty) {
	      if (PATH.isAbs(path)) {
	        return path;
	      }

	      var dir;

	      if (dirfd === -100) {
	        dir = FS.cwd();
	      } else {
	        var dirstream = FS.getStream(dirfd);
	        if (!dirstream) throw new FS.ErrnoError(8);
	        dir = dirstream.path;
	      }

	      if (path.length == 0) {
	        if (!allowEmpty) {
	          throw new FS.ErrnoError(44);
	        }

	        return dir;
	      }

	      return PATH.join2(dir, path);
	    },
	    doStat: function (func, path, buf) {
	      try {
	        var stat = func(path);
	      } catch (e) {
	        if (e && e.node && PATH.normalize(path) !== PATH.normalize(FS.getPath(e.node))) {
	          return -54;
	        }

	        throw e;
	      }

	      HEAP32[buf >> 2] = stat.dev;
	      HEAP32[buf + 4 >> 2] = 0;
	      HEAP32[buf + 8 >> 2] = stat.ino;
	      HEAP32[buf + 12 >> 2] = stat.mode;
	      HEAP32[buf + 16 >> 2] = stat.nlink;
	      HEAP32[buf + 20 >> 2] = stat.uid;
	      HEAP32[buf + 24 >> 2] = stat.gid;
	      HEAP32[buf + 28 >> 2] = stat.rdev;
	      HEAP32[buf + 32 >> 2] = 0;
	      tempI64 = [stat.size >>> 0, (tempDouble = stat.size, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 40 >> 2] = tempI64[0], HEAP32[buf + 44 >> 2] = tempI64[1];
	      HEAP32[buf + 48 >> 2] = 4096;
	      HEAP32[buf + 52 >> 2] = stat.blocks;
	      HEAP32[buf + 56 >> 2] = stat.atime.getTime() / 1e3 | 0;
	      HEAP32[buf + 60 >> 2] = 0;
	      HEAP32[buf + 64 >> 2] = stat.mtime.getTime() / 1e3 | 0;
	      HEAP32[buf + 68 >> 2] = 0;
	      HEAP32[buf + 72 >> 2] = stat.ctime.getTime() / 1e3 | 0;
	      HEAP32[buf + 76 >> 2] = 0;
	      tempI64 = [stat.ino >>> 0, (tempDouble = stat.ino, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 80 >> 2] = tempI64[0], HEAP32[buf + 84 >> 2] = tempI64[1];
	      return 0;
	    },
	    doMsync: function (addr, stream, len, flags, offset) {
	      var buffer = HEAPU8.slice(addr, addr + len);
	      FS.msync(stream, buffer, offset, len, flags);
	    },
	    doMknod: function (path, mode, dev) {
	      switch (mode & 61440) {
	        case 32768:
	        case 8192:
	        case 24576:
	        case 4096:
	        case 49152:
	          break;

	        default:
	          return -28;
	      }

	      FS.mknod(path, mode, dev);
	      return 0;
	    },
	    doReadlink: function (path, buf, bufsize) {
	      if (bufsize <= 0) return -28;
	      var ret = FS.readlink(path);
	      var len = Math.min(bufsize, lengthBytesUTF8(ret));
	      var endChar = HEAP8[buf + len];
	      stringToUTF8(ret, buf, bufsize + 1);
	      HEAP8[buf + len] = endChar;
	      return len;
	    },
	    doAccess: function (path, amode) {
	      if (amode & ~7) {
	        return -28;
	      }

	      var lookup = FS.lookupPath(path, {
	        follow: true
	      });
	      var node = lookup.node;

	      if (!node) {
	        return -44;
	      }

	      var perms = "";
	      if (amode & 4) perms += "r";
	      if (amode & 2) perms += "w";
	      if (amode & 1) perms += "x";

	      if (perms && FS.nodePermissions(node, perms)) {
	        return -2;
	      }

	      return 0;
	    },
	    doReadv: function (stream, iov, iovcnt, offset) {
	      var ret = 0;

	      for (var i = 0; i < iovcnt; i++) {
	        var ptr = HEAP32[iov >> 2];
	        var len = HEAP32[iov + 4 >> 2];
	        iov += 8;
	        var curr = FS.read(stream, HEAP8, ptr, len, offset);
	        if (curr < 0) return -1;
	        ret += curr;
	        if (curr < len) break;
	      }

	      return ret;
	    },
	    doWritev: function (stream, iov, iovcnt, offset) {
	      var ret = 0;

	      for (var i = 0; i < iovcnt; i++) {
	        var ptr = HEAP32[iov >> 2];
	        var len = HEAP32[iov + 4 >> 2];
	        iov += 8;
	        var curr = FS.write(stream, HEAP8, ptr, len, offset);
	        if (curr < 0) return -1;
	        ret += curr;
	      }

	      return ret;
	    },
	    varargs: undefined,
	    get: function () {
	      assert(SYSCALLS.varargs != undefined);
	      SYSCALLS.varargs += 4;
	      var ret = HEAP32[SYSCALLS.varargs - 4 >> 2];
	      return ret;
	    },
	    getStr: function (ptr) {
	      var ret = UTF8ToString(ptr);
	      return ret;
	    },
	    getStreamFromFD: function (fd) {
	      var stream = FS.getStream(fd);
	      if (!stream) throw new FS.ErrnoError(8);
	      return stream;
	    }
	  };

	  function ___syscall_fcntl64(fd, cmd, varargs) {
	    SYSCALLS.varargs = varargs;

	    try {
	      var stream = SYSCALLS.getStreamFromFD(fd);

	      switch (cmd) {
	        case 0:
	          {
	            var arg = SYSCALLS.get();

	            if (arg < 0) {
	              return -28;
	            }

	            var newStream;
	            newStream = FS.createStream(stream, arg);
	            return newStream.fd;
	          }

	        case 1:
	        case 2:
	          return 0;

	        case 3:
	          return stream.flags;

	        case 4:
	          {
	            var arg = SYSCALLS.get();
	            stream.flags |= arg;
	            return 0;
	          }

	        case 5:
	          {
	            var arg = SYSCALLS.get();
	            var offset = 0;
	            HEAP16[arg + offset >> 1] = 2;
	            return 0;
	          }

	        case 6:
	        case 7:
	          return 0;

	        case 16:
	        case 8:
	          return -28;

	        case 9:
	          setErrNo(28);
	          return -1;

	        default:
	          {
	            return -28;
	          }
	      }
	    } catch (e) {
	      if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
	      return -e.errno;
	    }
	  }

	  function ___syscall_openat(dirfd, path, flags, varargs) {
	    SYSCALLS.varargs = varargs;

	    try {
	      path = SYSCALLS.getStr(path);
	      path = SYSCALLS.calculateAt(dirfd, path);
	      var mode = varargs ? SYSCALLS.get() : 0;
	      return FS.open(path, flags, mode).fd;
	    } catch (e) {
	      if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
	      return -e.errno;
	    }
	  }

	  function __embind_register_bigint(primitiveType, name, size, minRange, maxRange) {}

	  function getShiftFromSize(size) {
	    switch (size) {
	      case 1:
	        return 0;

	      case 2:
	        return 1;

	      case 4:
	        return 2;

	      case 8:
	        return 3;

	      default:
	        throw new TypeError("Unknown type size: " + size);
	    }
	  }

	  function embind_init_charCodes() {
	    var codes = new Array(256);

	    for (var i = 0; i < 256; ++i) {
	      codes[i] = String.fromCharCode(i);
	    }

	    embind_charCodes = codes;
	  }

	  var embind_charCodes = undefined;

	  function readLatin1String(ptr) {
	    var ret = "";
	    var c = ptr;

	    while (HEAPU8[c]) {
	      ret += embind_charCodes[HEAPU8[c++]];
	    }

	    return ret;
	  }

	  var awaitingDependencies = {};
	  var registeredTypes = {};
	  var typeDependencies = {};
	  var char_0 = 48;
	  var char_9 = 57;

	  function makeLegalFunctionName(name) {
	    if (undefined === name) {
	      return "_unknown";
	    }

	    name = name.replace(/[^a-zA-Z0-9_]/g, "$");
	    var f = name.charCodeAt(0);

	    if (f >= char_0 && f <= char_9) {
	      return "_" + name;
	    }

	    return name;
	  }

	  function createNamedFunction(name, body) {
	    name = makeLegalFunctionName(name);
	    return new Function("body", "return function " + name + "() {\n" + '    "use strict";' + "    return body.apply(this, arguments);\n" + "};\n")(body);
	  }

	  function extendError(baseErrorType, errorName) {
	    var errorClass = createNamedFunction(errorName, function (message) {
	      this.name = errorName;
	      this.message = message;
	      var stack = new Error(message).stack;

	      if (stack !== undefined) {
	        this.stack = this.toString() + "\n" + stack.replace(/^Error(:[^\n]*)?\n/, "");
	      }
	    });
	    errorClass.prototype = Object.create(baseErrorType.prototype);
	    errorClass.prototype.constructor = errorClass;

	    errorClass.prototype.toString = function () {
	      if (this.message === undefined) {
	        return this.name;
	      } else {
	        return this.name + ": " + this.message;
	      }
	    };

	    return errorClass;
	  }

	  var BindingError = undefined;

	  function throwBindingError(message) {
	    throw new BindingError(message);
	  }

	  var InternalError = undefined;

	  function throwInternalError(message) {
	    throw new InternalError(message);
	  }

	  function whenDependentTypesAreResolved(myTypes, dependentTypes, getTypeConverters) {
	    myTypes.forEach(function (type) {
	      typeDependencies[type] = dependentTypes;
	    });

	    function onComplete(typeConverters) {
	      var myTypeConverters = getTypeConverters(typeConverters);

	      if (myTypeConverters.length !== myTypes.length) {
	        throwInternalError("Mismatched type converter count");
	      }

	      for (var i = 0; i < myTypes.length; ++i) {
	        registerType(myTypes[i], myTypeConverters[i]);
	      }
	    }

	    var typeConverters = new Array(dependentTypes.length);
	    var unregisteredTypes = [];
	    var registered = 0;
	    dependentTypes.forEach((dt, i) => {
	      if (registeredTypes.hasOwnProperty(dt)) {
	        typeConverters[i] = registeredTypes[dt];
	      } else {
	        unregisteredTypes.push(dt);

	        if (!awaitingDependencies.hasOwnProperty(dt)) {
	          awaitingDependencies[dt] = [];
	        }

	        awaitingDependencies[dt].push(() => {
	          typeConverters[i] = registeredTypes[dt];
	          ++registered;

	          if (registered === unregisteredTypes.length) {
	            onComplete(typeConverters);
	          }
	        });
	      }
	    });

	    if (0 === unregisteredTypes.length) {
	      onComplete(typeConverters);
	    }
	  }

	  function registerType(rawType, registeredInstance) {
	    let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	    if (!("argPackAdvance" in registeredInstance)) {
	      throw new TypeError("registerType registeredInstance requires argPackAdvance");
	    }

	    var name = registeredInstance.name;

	    if (!rawType) {
	      throwBindingError('type "' + name + '" must have a positive integer typeid pointer');
	    }

	    if (registeredTypes.hasOwnProperty(rawType)) {
	      if (options.ignoreDuplicateRegistrations) {
	        return;
	      } else {
	        throwBindingError("Cannot register type '" + name + "' twice");
	      }
	    }

	    registeredTypes[rawType] = registeredInstance;
	    delete typeDependencies[rawType];

	    if (awaitingDependencies.hasOwnProperty(rawType)) {
	      var callbacks = awaitingDependencies[rawType];
	      delete awaitingDependencies[rawType];
	      callbacks.forEach(cb => cb());
	    }
	  }

	  function __embind_register_bool(rawType, name, size, trueValue, falseValue) {
	    var shift = getShiftFromSize(size);
	    name = readLatin1String(name);
	    registerType(rawType, {
	      name: name,
	      "fromWireType": function (wt) {
	        return !!wt;
	      },
	      "toWireType": function (destructors, o) {
	        return o ? trueValue : falseValue;
	      },
	      "argPackAdvance": 8,
	      "readValueFromPointer": function (pointer) {
	        var heap;

	        if (size === 1) {
	          heap = HEAP8;
	        } else if (size === 2) {
	          heap = HEAP16;
	        } else if (size === 4) {
	          heap = HEAP32;
	        } else {
	          throw new TypeError("Unknown boolean type size: " + name);
	        }

	        return this["fromWireType"](heap[pointer >> shift]);
	      },
	      destructorFunction: null
	    });
	  }

	  function ClassHandle_isAliasOf(other) {
	    if (!(this instanceof ClassHandle)) {
	      return false;
	    }

	    if (!(other instanceof ClassHandle)) {
	      return false;
	    }

	    var leftClass = this.$$.ptrType.registeredClass;
	    var left = this.$$.ptr;
	    var rightClass = other.$$.ptrType.registeredClass;
	    var right = other.$$.ptr;

	    while (leftClass.baseClass) {
	      left = leftClass.upcast(left);
	      leftClass = leftClass.baseClass;
	    }

	    while (rightClass.baseClass) {
	      right = rightClass.upcast(right);
	      rightClass = rightClass.baseClass;
	    }

	    return leftClass === rightClass && left === right;
	  }

	  function shallowCopyInternalPointer(o) {
	    return {
	      count: o.count,
	      deleteScheduled: o.deleteScheduled,
	      preservePointerOnDelete: o.preservePointerOnDelete,
	      ptr: o.ptr,
	      ptrType: o.ptrType,
	      smartPtr: o.smartPtr,
	      smartPtrType: o.smartPtrType
	    };
	  }

	  function throwInstanceAlreadyDeleted(obj) {
	    function getInstanceTypeName(handle) {
	      return handle.$$.ptrType.registeredClass.name;
	    }

	    throwBindingError(getInstanceTypeName(obj) + " instance already deleted");
	  }

	  var finalizationRegistry = false;

	  function detachFinalizer(handle) {}

	  function runDestructor($$) {
	    if ($$.smartPtr) {
	      $$.smartPtrType.rawDestructor($$.smartPtr);
	    } else {
	      $$.ptrType.registeredClass.rawDestructor($$.ptr);
	    }
	  }

	  function releaseClassHandle($$) {
	    $$.count.value -= 1;
	    var toDelete = 0 === $$.count.value;

	    if (toDelete) {
	      runDestructor($$);
	    }
	  }

	  function downcastPointer(ptr, ptrClass, desiredClass) {
	    if (ptrClass === desiredClass) {
	      return ptr;
	    }

	    if (undefined === desiredClass.baseClass) {
	      return null;
	    }

	    var rv = downcastPointer(ptr, ptrClass, desiredClass.baseClass);

	    if (rv === null) {
	      return null;
	    }

	    return desiredClass.downcast(rv);
	  }

	  var registeredPointers = {};

	  function getInheritedInstanceCount() {
	    return Object.keys(registeredInstances).length;
	  }

	  function getLiveInheritedInstances() {
	    var rv = [];

	    for (var k in registeredInstances) {
	      if (registeredInstances.hasOwnProperty(k)) {
	        rv.push(registeredInstances[k]);
	      }
	    }

	    return rv;
	  }

	  var deletionQueue = [];

	  function flushPendingDeletes() {
	    while (deletionQueue.length) {
	      var obj = deletionQueue.pop();
	      obj.$$.deleteScheduled = false;
	      obj["delete"]();
	    }
	  }

	  var delayFunction = undefined;

	  function setDelayFunction(fn) {
	    delayFunction = fn;

	    if (deletionQueue.length && delayFunction) {
	      delayFunction(flushPendingDeletes);
	    }
	  }

	  function init_embind() {
	    Module["getInheritedInstanceCount"] = getInheritedInstanceCount;
	    Module["getLiveInheritedInstances"] = getLiveInheritedInstances;
	    Module["flushPendingDeletes"] = flushPendingDeletes;
	    Module["setDelayFunction"] = setDelayFunction;
	  }

	  var registeredInstances = {};

	  function getBasestPointer(class_, ptr) {
	    if (ptr === undefined) {
	      throwBindingError("ptr should not be undefined");
	    }

	    while (class_.baseClass) {
	      ptr = class_.upcast(ptr);
	      class_ = class_.baseClass;
	    }

	    return ptr;
	  }

	  function getInheritedInstance(class_, ptr) {
	    ptr = getBasestPointer(class_, ptr);
	    return registeredInstances[ptr];
	  }

	  function makeClassHandle(prototype, record) {
	    if (!record.ptrType || !record.ptr) {
	      throwInternalError("makeClassHandle requires ptr and ptrType");
	    }

	    var hasSmartPtrType = !!record.smartPtrType;
	    var hasSmartPtr = !!record.smartPtr;

	    if (hasSmartPtrType !== hasSmartPtr) {
	      throwInternalError("Both smartPtrType and smartPtr must be specified");
	    }

	    record.count = {
	      value: 1
	    };
	    return attachFinalizer(Object.create(prototype, {
	      $$: {
	        value: record
	      }
	    }));
	  }

	  function RegisteredPointer_fromWireType(ptr) {
	    var rawPointer = this.getPointee(ptr);

	    if (!rawPointer) {
	      this.destructor(ptr);
	      return null;
	    }

	    var registeredInstance = getInheritedInstance(this.registeredClass, rawPointer);

	    if (undefined !== registeredInstance) {
	      if (0 === registeredInstance.$$.count.value) {
	        registeredInstance.$$.ptr = rawPointer;
	        registeredInstance.$$.smartPtr = ptr;
	        return registeredInstance["clone"]();
	      } else {
	        var rv = registeredInstance["clone"]();
	        this.destructor(ptr);
	        return rv;
	      }
	    }

	    function makeDefaultHandle() {
	      if (this.isSmartPointer) {
	        return makeClassHandle(this.registeredClass.instancePrototype, {
	          ptrType: this.pointeeType,
	          ptr: rawPointer,
	          smartPtrType: this,
	          smartPtr: ptr
	        });
	      } else {
	        return makeClassHandle(this.registeredClass.instancePrototype, {
	          ptrType: this,
	          ptr: ptr
	        });
	      }
	    }

	    var actualType = this.registeredClass.getActualType(rawPointer);
	    var registeredPointerRecord = registeredPointers[actualType];

	    if (!registeredPointerRecord) {
	      return makeDefaultHandle.call(this);
	    }

	    var toType;

	    if (this.isConst) {
	      toType = registeredPointerRecord.constPointerType;
	    } else {
	      toType = registeredPointerRecord.pointerType;
	    }

	    var dp = downcastPointer(rawPointer, this.registeredClass, toType.registeredClass);

	    if (dp === null) {
	      return makeDefaultHandle.call(this);
	    }

	    if (this.isSmartPointer) {
	      return makeClassHandle(toType.registeredClass.instancePrototype, {
	        ptrType: toType,
	        ptr: dp,
	        smartPtrType: this,
	        smartPtr: ptr
	      });
	    } else {
	      return makeClassHandle(toType.registeredClass.instancePrototype, {
	        ptrType: toType,
	        ptr: dp
	      });
	    }
	  }

	  function attachFinalizer(handle) {
	    if ("undefined" === typeof FinalizationRegistry) {
	      attachFinalizer = handle => handle;

	      return handle;
	    }

	    finalizationRegistry = new FinalizationRegistry(info => {
	      console.warn(info.leakWarning.stack.replace(/^Error: /, ""));
	      releaseClassHandle(info.$$);
	    });

	    attachFinalizer = handle => {
	      var $$ = handle.$$;
	      var hasSmartPtr = !!$$.smartPtr;

	      if (hasSmartPtr) {
	        var info = {
	          $$: $$
	        };
	        var cls = $$.ptrType.registeredClass;
	        info.leakWarning = new Error("Embind found a leaked C++ instance " + cls.name + " <0x" + $$.ptr.toString(16) + ">.\n" + "We'll free it automatically in this case, but this functionality is not reliable across various environments.\n" + "Make sure to invoke .delete() manually once you're done with the instance instead.\n" + "Originally allocated");

	        if ("captureStackTrace" in Error) {
	          Error.captureStackTrace(info.leakWarning, RegisteredPointer_fromWireType);
	        }

	        finalizationRegistry.register(handle, info, handle);
	      }

	      return handle;
	    };

	    detachFinalizer = handle => finalizationRegistry.unregister(handle);

	    return attachFinalizer(handle);
	  }

	  function ClassHandle_clone() {
	    if (!this.$$.ptr) {
	      throwInstanceAlreadyDeleted(this);
	    }

	    if (this.$$.preservePointerOnDelete) {
	      this.$$.count.value += 1;
	      return this;
	    } else {
	      var clone = attachFinalizer(Object.create(Object.getPrototypeOf(this), {
	        $$: {
	          value: shallowCopyInternalPointer(this.$$)
	        }
	      }));
	      clone.$$.count.value += 1;
	      clone.$$.deleteScheduled = false;
	      return clone;
	    }
	  }

	  function ClassHandle_delete() {
	    if (!this.$$.ptr) {
	      throwInstanceAlreadyDeleted(this);
	    }

	    if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) {
	      throwBindingError("Object already scheduled for deletion");
	    }

	    detachFinalizer(this);
	    releaseClassHandle(this.$$);

	    if (!this.$$.preservePointerOnDelete) {
	      this.$$.smartPtr = undefined;
	      this.$$.ptr = undefined;
	    }
	  }

	  function ClassHandle_isDeleted() {
	    return !this.$$.ptr;
	  }

	  function ClassHandle_deleteLater() {
	    if (!this.$$.ptr) {
	      throwInstanceAlreadyDeleted(this);
	    }

	    if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) {
	      throwBindingError("Object already scheduled for deletion");
	    }

	    deletionQueue.push(this);

	    if (deletionQueue.length === 1 && delayFunction) {
	      delayFunction(flushPendingDeletes);
	    }

	    this.$$.deleteScheduled = true;
	    return this;
	  }

	  function init_ClassHandle() {
	    ClassHandle.prototype["isAliasOf"] = ClassHandle_isAliasOf;
	    ClassHandle.prototype["clone"] = ClassHandle_clone;
	    ClassHandle.prototype["delete"] = ClassHandle_delete;
	    ClassHandle.prototype["isDeleted"] = ClassHandle_isDeleted;
	    ClassHandle.prototype["deleteLater"] = ClassHandle_deleteLater;
	  }

	  function ClassHandle() {}

	  function ensureOverloadTable(proto, methodName, humanName) {
	    if (undefined === proto[methodName].overloadTable) {
	      var prevFunc = proto[methodName];

	      proto[methodName] = function () {
	        if (!proto[methodName].overloadTable.hasOwnProperty(arguments.length)) {
	          throwBindingError("Function '" + humanName + "' called with an invalid number of arguments (" + arguments.length + ") - expects one of (" + proto[methodName].overloadTable + ")!");
	        }

	        return proto[methodName].overloadTable[arguments.length].apply(this, arguments);
	      };

	      proto[methodName].overloadTable = [];
	      proto[methodName].overloadTable[prevFunc.argCount] = prevFunc;
	    }
	  }

	  function exposePublicSymbol(name, value, numArguments) {
	    if (Module.hasOwnProperty(name)) {
	      if (undefined === numArguments || undefined !== Module[name].overloadTable && undefined !== Module[name].overloadTable[numArguments]) {
	        throwBindingError("Cannot register public name '" + name + "' twice");
	      }

	      ensureOverloadTable(Module, name, name);

	      if (Module.hasOwnProperty(numArguments)) {
	        throwBindingError("Cannot register multiple overloads of a function with the same number of arguments (" + numArguments + ")!");
	      }

	      Module[name].overloadTable[numArguments] = value;
	    } else {
	      Module[name] = value;

	      if (undefined !== numArguments) {
	        Module[name].numArguments = numArguments;
	      }
	    }
	  }

	  function RegisteredClass(name, constructor, instancePrototype, rawDestructor, baseClass, getActualType, upcast, downcast) {
	    this.name = name;
	    this.constructor = constructor;
	    this.instancePrototype = instancePrototype;
	    this.rawDestructor = rawDestructor;
	    this.baseClass = baseClass;
	    this.getActualType = getActualType;
	    this.upcast = upcast;
	    this.downcast = downcast;
	    this.pureVirtualFunctions = [];
	  }

	  function upcastPointer(ptr, ptrClass, desiredClass) {
	    while (ptrClass !== desiredClass) {
	      if (!ptrClass.upcast) {
	        throwBindingError("Expected null or instance of " + desiredClass.name + ", got an instance of " + ptrClass.name);
	      }

	      ptr = ptrClass.upcast(ptr);
	      ptrClass = ptrClass.baseClass;
	    }

	    return ptr;
	  }

	  function constNoSmartPtrRawPointerToWireType(destructors, handle) {
	    if (handle === null) {
	      if (this.isReference) {
	        throwBindingError("null is not a valid " + this.name);
	      }

	      return 0;
	    }

	    if (!handle.$$) {
	      throwBindingError('Cannot pass "' + _embind_repr(handle) + '" as a ' + this.name);
	    }

	    if (!handle.$$.ptr) {
	      throwBindingError("Cannot pass deleted object as a pointer of type " + this.name);
	    }

	    var handleClass = handle.$$.ptrType.registeredClass;
	    var ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
	    return ptr;
	  }

	  function genericPointerToWireType(destructors, handle) {
	    var ptr;

	    if (handle === null) {
	      if (this.isReference) {
	        throwBindingError("null is not a valid " + this.name);
	      }

	      if (this.isSmartPointer) {
	        ptr = this.rawConstructor();

	        if (destructors !== null) {
	          destructors.push(this.rawDestructor, ptr);
	        }

	        return ptr;
	      } else {
	        return 0;
	      }
	    }

	    if (!handle.$$) {
	      throwBindingError('Cannot pass "' + _embind_repr(handle) + '" as a ' + this.name);
	    }

	    if (!handle.$$.ptr) {
	      throwBindingError("Cannot pass deleted object as a pointer of type " + this.name);
	    }

	    if (!this.isConst && handle.$$.ptrType.isConst) {
	      throwBindingError("Cannot convert argument of type " + (handle.$$.smartPtrType ? handle.$$.smartPtrType.name : handle.$$.ptrType.name) + " to parameter type " + this.name);
	    }

	    var handleClass = handle.$$.ptrType.registeredClass;
	    ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);

	    if (this.isSmartPointer) {
	      if (undefined === handle.$$.smartPtr) {
	        throwBindingError("Passing raw pointer to smart pointer is illegal");
	      }

	      switch (this.sharingPolicy) {
	        case 0:
	          if (handle.$$.smartPtrType === this) {
	            ptr = handle.$$.smartPtr;
	          } else {
	            throwBindingError("Cannot convert argument of type " + (handle.$$.smartPtrType ? handle.$$.smartPtrType.name : handle.$$.ptrType.name) + " to parameter type " + this.name);
	          }

	          break;

	        case 1:
	          ptr = handle.$$.smartPtr;
	          break;

	        case 2:
	          if (handle.$$.smartPtrType === this) {
	            ptr = handle.$$.smartPtr;
	          } else {
	            var clonedHandle = handle["clone"]();
	            ptr = this.rawShare(ptr, Emval.toHandle(function () {
	              clonedHandle["delete"]();
	            }));

	            if (destructors !== null) {
	              destructors.push(this.rawDestructor, ptr);
	            }
	          }

	          break;

	        default:
	          throwBindingError("Unsupporting sharing policy");
	      }
	    }

	    return ptr;
	  }

	  function nonConstNoSmartPtrRawPointerToWireType(destructors, handle) {
	    if (handle === null) {
	      if (this.isReference) {
	        throwBindingError("null is not a valid " + this.name);
	      }

	      return 0;
	    }

	    if (!handle.$$) {
	      throwBindingError('Cannot pass "' + _embind_repr(handle) + '" as a ' + this.name);
	    }

	    if (!handle.$$.ptr) {
	      throwBindingError("Cannot pass deleted object as a pointer of type " + this.name);
	    }

	    if (handle.$$.ptrType.isConst) {
	      throwBindingError("Cannot convert argument of type " + handle.$$.ptrType.name + " to parameter type " + this.name);
	    }

	    var handleClass = handle.$$.ptrType.registeredClass;
	    var ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
	    return ptr;
	  }

	  function simpleReadValueFromPointer(pointer) {
	    return this["fromWireType"](HEAPU32[pointer >> 2]);
	  }

	  function RegisteredPointer_getPointee(ptr) {
	    if (this.rawGetPointee) {
	      ptr = this.rawGetPointee(ptr);
	    }

	    return ptr;
	  }

	  function RegisteredPointer_destructor(ptr) {
	    if (this.rawDestructor) {
	      this.rawDestructor(ptr);
	    }
	  }

	  function RegisteredPointer_deleteObject(handle) {
	    if (handle !== null) {
	      handle["delete"]();
	    }
	  }

	  function init_RegisteredPointer() {
	    RegisteredPointer.prototype.getPointee = RegisteredPointer_getPointee;
	    RegisteredPointer.prototype.destructor = RegisteredPointer_destructor;
	    RegisteredPointer.prototype["argPackAdvance"] = 8;
	    RegisteredPointer.prototype["readValueFromPointer"] = simpleReadValueFromPointer;
	    RegisteredPointer.prototype["deleteObject"] = RegisteredPointer_deleteObject;
	    RegisteredPointer.prototype["fromWireType"] = RegisteredPointer_fromWireType;
	  }

	  function RegisteredPointer(name, registeredClass, isReference, isConst, isSmartPointer, pointeeType, sharingPolicy, rawGetPointee, rawConstructor, rawShare, rawDestructor) {
	    this.name = name;
	    this.registeredClass = registeredClass;
	    this.isReference = isReference;
	    this.isConst = isConst;
	    this.isSmartPointer = isSmartPointer;
	    this.pointeeType = pointeeType;
	    this.sharingPolicy = sharingPolicy;
	    this.rawGetPointee = rawGetPointee;
	    this.rawConstructor = rawConstructor;
	    this.rawShare = rawShare;
	    this.rawDestructor = rawDestructor;

	    if (!isSmartPointer && registeredClass.baseClass === undefined) {
	      if (isConst) {
	        this["toWireType"] = constNoSmartPtrRawPointerToWireType;
	        this.destructorFunction = null;
	      } else {
	        this["toWireType"] = nonConstNoSmartPtrRawPointerToWireType;
	        this.destructorFunction = null;
	      }
	    } else {
	      this["toWireType"] = genericPointerToWireType;
	    }
	  }

	  function replacePublicSymbol(name, value, numArguments) {
	    if (!Module.hasOwnProperty(name)) {
	      throwInternalError("Replacing nonexistant public symbol");
	    }

	    if (undefined !== Module[name].overloadTable && undefined !== numArguments) {
	      Module[name].overloadTable[numArguments] = value;
	    } else {
	      Module[name] = value;
	      Module[name].argCount = numArguments;
	    }
	  }

	  function dynCallLegacy(sig, ptr, args) {
	    assert("dynCall_" + sig in Module, "bad function pointer type - no table for sig '" + sig + "'");

	    if (args && args.length) {
	      assert(args.length === sig.substring(1).replace(/j/g, "--").length);
	    } else {
	      assert(sig.length == 1);
	    }

	    var f = Module["dynCall_" + sig];
	    return args && args.length ? f.apply(null, [ptr].concat(args)) : f.call(null, ptr);
	  }

	  function dynCall(sig, ptr, args) {
	    if (sig.includes("j")) {
	      return dynCallLegacy(sig, ptr, args);
	    }

	    assert(getWasmTableEntry(ptr), "missing table entry in dynCall: " + ptr);
	    return getWasmTableEntry(ptr).apply(null, args);
	  }

	  function getDynCaller(sig, ptr) {
	    assert(sig.includes("j"), "getDynCaller should only be called with i64 sigs");
	    var argCache = [];
	    return function () {
	      argCache.length = 0;
	      Object.assign(argCache, arguments);
	      return dynCall(sig, ptr, argCache);
	    };
	  }

	  function embind__requireFunction(signature, rawFunction) {
	    signature = readLatin1String(signature);

	    function makeDynCaller() {
	      if (signature.includes("j")) {
	        return getDynCaller(signature, rawFunction);
	      }

	      return getWasmTableEntry(rawFunction);
	    }

	    var fp = makeDynCaller();

	    if (typeof fp != "function") {
	      throwBindingError("unknown function pointer with signature " + signature + ": " + rawFunction);
	    }

	    return fp;
	  }

	  var UnboundTypeError = undefined;

	  function getTypeName(type) {
	    var ptr = ___getTypeName(type);

	    var rv = readLatin1String(ptr);

	    _free(ptr);

	    return rv;
	  }

	  function throwUnboundTypeError(message, types) {
	    var unboundTypes = [];
	    var seen = {};

	    function visit(type) {
	      if (seen[type]) {
	        return;
	      }

	      if (registeredTypes[type]) {
	        return;
	      }

	      if (typeDependencies[type]) {
	        typeDependencies[type].forEach(visit);
	        return;
	      }

	      unboundTypes.push(type);
	      seen[type] = true;
	    }

	    types.forEach(visit);
	    throw new UnboundTypeError(message + ": " + unboundTypes.map(getTypeName).join([", "]));
	  }

	  function __embind_register_class(rawType, rawPointerType, rawConstPointerType, baseClassRawType, getActualTypeSignature, getActualType, upcastSignature, upcast, downcastSignature, downcast, name, destructorSignature, rawDestructor) {
	    name = readLatin1String(name);
	    getActualType = embind__requireFunction(getActualTypeSignature, getActualType);

	    if (upcast) {
	      upcast = embind__requireFunction(upcastSignature, upcast);
	    }

	    if (downcast) {
	      downcast = embind__requireFunction(downcastSignature, downcast);
	    }

	    rawDestructor = embind__requireFunction(destructorSignature, rawDestructor);
	    var legalFunctionName = makeLegalFunctionName(name);
	    exposePublicSymbol(legalFunctionName, function () {
	      throwUnboundTypeError("Cannot construct " + name + " due to unbound types", [baseClassRawType]);
	    });
	    whenDependentTypesAreResolved([rawType, rawPointerType, rawConstPointerType], baseClassRawType ? [baseClassRawType] : [], function (base) {
	      base = base[0];
	      var baseClass;
	      var basePrototype;

	      if (baseClassRawType) {
	        baseClass = base.registeredClass;
	        basePrototype = baseClass.instancePrototype;
	      } else {
	        basePrototype = ClassHandle.prototype;
	      }

	      var constructor = createNamedFunction(legalFunctionName, function () {
	        if (Object.getPrototypeOf(this) !== instancePrototype) {
	          throw new BindingError("Use 'new' to construct " + name);
	        }

	        if (undefined === registeredClass.constructor_body) {
	          throw new BindingError(name + " has no accessible constructor");
	        }

	        var body = registeredClass.constructor_body[arguments.length];

	        if (undefined === body) {
	          throw new BindingError("Tried to invoke ctor of " + name + " with invalid number of parameters (" + arguments.length + ") - expected (" + Object.keys(registeredClass.constructor_body).toString() + ") parameters instead!");
	        }

	        return body.apply(this, arguments);
	      });
	      var instancePrototype = Object.create(basePrototype, {
	        constructor: {
	          value: constructor
	        }
	      });
	      constructor.prototype = instancePrototype;
	      var registeredClass = new RegisteredClass(name, constructor, instancePrototype, rawDestructor, baseClass, getActualType, upcast, downcast);
	      var referenceConverter = new RegisteredPointer(name, registeredClass, true, false, false);
	      var pointerConverter = new RegisteredPointer(name + "*", registeredClass, false, false, false);
	      var constPointerConverter = new RegisteredPointer(name + " const*", registeredClass, false, true, false);
	      registeredPointers[rawType] = {
	        pointerType: pointerConverter,
	        constPointerType: constPointerConverter
	      };
	      replacePublicSymbol(legalFunctionName, constructor);
	      return [referenceConverter, pointerConverter, constPointerConverter];
	    });
	  }

	  function heap32VectorToArray(count, firstElement) {
	    var array = [];

	    for (var i = 0; i < count; i++) {
	      array.push(HEAP32[(firstElement >> 2) + i]);
	    }

	    return array;
	  }

	  function runDestructors(destructors) {
	    while (destructors.length) {
	      var ptr = destructors.pop();
	      var del = destructors.pop();
	      del(ptr);
	    }
	  }

	  function __embind_register_class_constructor(rawClassType, argCount, rawArgTypesAddr, invokerSignature, invoker, rawConstructor) {
	    assert(argCount > 0);
	    var rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
	    invoker = embind__requireFunction(invokerSignature, invoker);
	    whenDependentTypesAreResolved([], [rawClassType], function (classType) {
	      classType = classType[0];
	      var humanName = "constructor " + classType.name;

	      if (undefined === classType.registeredClass.constructor_body) {
	        classType.registeredClass.constructor_body = [];
	      }

	      if (undefined !== classType.registeredClass.constructor_body[argCount - 1]) {
	        throw new BindingError("Cannot register multiple constructors with identical number of parameters (" + (argCount - 1) + ") for class '" + classType.name + "'! Overload resolution is currently only performed using the parameter count, not actual type info!");
	      }

	      classType.registeredClass.constructor_body[argCount - 1] = () => {
	        throwUnboundTypeError("Cannot construct " + classType.name + " due to unbound types", rawArgTypes);
	      };

	      whenDependentTypesAreResolved([], rawArgTypes, function (argTypes) {
	        argTypes.splice(1, 0, null);
	        classType.registeredClass.constructor_body[argCount - 1] = craftInvokerFunction(humanName, argTypes, null, invoker, rawConstructor);
	        return [];
	      });
	      return [];
	    });
	  }

	  function new_(constructor, argumentList) {
	    if (!(constructor instanceof Function)) {
	      throw new TypeError("new_ called with constructor type " + typeof constructor + " which is not a function");
	    }

	    var dummy = createNamedFunction(constructor.name || "unknownFunctionName", function () {});
	    dummy.prototype = constructor.prototype;
	    var obj = new dummy();
	    var r = constructor.apply(obj, argumentList);
	    return r instanceof Object ? r : obj;
	  }

	  function craftInvokerFunction(humanName, argTypes, classType, cppInvokerFunc, cppTargetFunc) {
	    var argCount = argTypes.length;

	    if (argCount < 2) {
	      throwBindingError("argTypes array size mismatch! Must at least get return value and 'this' types!");
	    }

	    var isClassMethodFunc = argTypes[1] !== null && classType !== null;
	    var needsDestructorStack = false;

	    for (var i = 1; i < argTypes.length; ++i) {
	      if (argTypes[i] !== null && argTypes[i].destructorFunction === undefined) {
	        needsDestructorStack = true;
	        break;
	      }
	    }

	    var returns = argTypes[0].name !== "void";
	    var argsList = "";
	    var argsListWired = "";

	    for (var i = 0; i < argCount - 2; ++i) {
	      argsList += (i !== 0 ? ", " : "") + "arg" + i;
	      argsListWired += (i !== 0 ? ", " : "") + "arg" + i + "Wired";
	    }

	    var invokerFnBody = "return function " + makeLegalFunctionName(humanName) + "(" + argsList + ") {\n" + "if (arguments.length !== " + (argCount - 2) + ") {\n" + "throwBindingError('function " + humanName + " called with ' + arguments.length + ' arguments, expected " + (argCount - 2) + " args!');\n" + "}\n";

	    if (needsDestructorStack) {
	      invokerFnBody += "var destructors = [];\n";
	    }

	    var dtorStack = needsDestructorStack ? "destructors" : "null";
	    var args1 = ["throwBindingError", "invoker", "fn", "runDestructors", "retType", "classParam"];
	    var args2 = [throwBindingError, cppInvokerFunc, cppTargetFunc, runDestructors, argTypes[0], argTypes[1]];

	    if (isClassMethodFunc) {
	      invokerFnBody += "var thisWired = classParam.toWireType(" + dtorStack + ", this);\n";
	    }

	    for (var i = 0; i < argCount - 2; ++i) {
	      invokerFnBody += "var arg" + i + "Wired = argType" + i + ".toWireType(" + dtorStack + ", arg" + i + "); // " + argTypes[i + 2].name + "\n";
	      args1.push("argType" + i);
	      args2.push(argTypes[i + 2]);
	    }

	    if (isClassMethodFunc) {
	      argsListWired = "thisWired" + (argsListWired.length > 0 ? ", " : "") + argsListWired;
	    }

	    invokerFnBody += (returns ? "var rv = " : "") + "invoker(fn" + (argsListWired.length > 0 ? ", " : "") + argsListWired + ");\n";

	    if (needsDestructorStack) {
	      invokerFnBody += "runDestructors(destructors);\n";
	    } else {
	      for (var i = isClassMethodFunc ? 1 : 2; i < argTypes.length; ++i) {
	        var paramName = i === 1 ? "thisWired" : "arg" + (i - 2) + "Wired";

	        if (argTypes[i].destructorFunction !== null) {
	          invokerFnBody += paramName + "_dtor(" + paramName + "); // " + argTypes[i].name + "\n";
	          args1.push(paramName + "_dtor");
	          args2.push(argTypes[i].destructorFunction);
	        }
	      }
	    }

	    if (returns) {
	      invokerFnBody += "var ret = retType.fromWireType(rv);\n" + "return ret;\n";
	    }

	    invokerFnBody += "}\n";
	    args1.push(invokerFnBody);
	    var invokerFunction = new_(Function, args1).apply(null, args2);
	    return invokerFunction;
	  }

	  function __embind_register_class_function(rawClassType, methodName, argCount, rawArgTypesAddr, invokerSignature, rawInvoker, context, isPureVirtual) {
	    var rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
	    methodName = readLatin1String(methodName);
	    rawInvoker = embind__requireFunction(invokerSignature, rawInvoker);
	    whenDependentTypesAreResolved([], [rawClassType], function (classType) {
	      classType = classType[0];
	      var humanName = classType.name + "." + methodName;

	      if (methodName.startsWith("@@")) {
	        methodName = Symbol[methodName.substring(2)];
	      }

	      if (isPureVirtual) {
	        classType.registeredClass.pureVirtualFunctions.push(methodName);
	      }

	      function unboundTypesHandler() {
	        throwUnboundTypeError("Cannot call " + humanName + " due to unbound types", rawArgTypes);
	      }

	      var proto = classType.registeredClass.instancePrototype;
	      var method = proto[methodName];

	      if (undefined === method || undefined === method.overloadTable && method.className !== classType.name && method.argCount === argCount - 2) {
	        unboundTypesHandler.argCount = argCount - 2;
	        unboundTypesHandler.className = classType.name;
	        proto[methodName] = unboundTypesHandler;
	      } else {
	        ensureOverloadTable(proto, methodName, humanName);
	        proto[methodName].overloadTable[argCount - 2] = unboundTypesHandler;
	      }

	      whenDependentTypesAreResolved([], rawArgTypes, function (argTypes) {
	        var memberFunction = craftInvokerFunction(humanName, argTypes, classType, rawInvoker, context);

	        if (undefined === proto[methodName].overloadTable) {
	          memberFunction.argCount = argCount - 2;
	          proto[methodName] = memberFunction;
	        } else {
	          proto[methodName].overloadTable[argCount - 2] = memberFunction;
	        }

	        return [];
	      });
	      return [];
	    });
	  }

	  function validateThis(this_, classType, humanName) {
	    if (!(this_ instanceof Object)) {
	      throwBindingError(humanName + ' with invalid "this": ' + this_);
	    }

	    if (!(this_ instanceof classType.registeredClass.constructor)) {
	      throwBindingError(humanName + ' incompatible with "this" of type ' + this_.constructor.name);
	    }

	    if (!this_.$$.ptr) {
	      throwBindingError("cannot call emscripten binding method " + humanName + " on deleted object");
	    }

	    return upcastPointer(this_.$$.ptr, this_.$$.ptrType.registeredClass, classType.registeredClass);
	  }

	  function __embind_register_class_property(classType, fieldName, getterReturnType, getterSignature, getter, getterContext, setterArgumentType, setterSignature, setter, setterContext) {
	    fieldName = readLatin1String(fieldName);
	    getter = embind__requireFunction(getterSignature, getter);
	    whenDependentTypesAreResolved([], [classType], function (classType) {
	      classType = classType[0];
	      var humanName = classType.name + "." + fieldName;
	      var desc = {
	        get: function () {
	          throwUnboundTypeError("Cannot access " + humanName + " due to unbound types", [getterReturnType, setterArgumentType]);
	        },
	        enumerable: true,
	        configurable: true
	      };

	      if (setter) {
	        desc.set = () => {
	          throwUnboundTypeError("Cannot access " + humanName + " due to unbound types", [getterReturnType, setterArgumentType]);
	        };
	      } else {
	        desc.set = v => {
	          throwBindingError(humanName + " is a read-only property");
	        };
	      }

	      Object.defineProperty(classType.registeredClass.instancePrototype, fieldName, desc);
	      whenDependentTypesAreResolved([], setter ? [getterReturnType, setterArgumentType] : [getterReturnType], function (types) {
	        var getterReturnType = types[0];
	        var desc = {
	          get: function () {
	            var ptr = validateThis(this, classType, humanName + " getter");
	            return getterReturnType["fromWireType"](getter(getterContext, ptr));
	          },
	          enumerable: true
	        };

	        if (setter) {
	          setter = embind__requireFunction(setterSignature, setter);
	          var setterArgumentType = types[1];

	          desc.set = function (v) {
	            var ptr = validateThis(this, classType, humanName + " setter");
	            var destructors = [];
	            setter(setterContext, ptr, setterArgumentType["toWireType"](destructors, v));
	            runDestructors(destructors);
	          };
	        }

	        Object.defineProperty(classType.registeredClass.instancePrototype, fieldName, desc);
	        return [];
	      });
	      return [];
	    });
	  }

	  var emval_free_list = [];
	  var emval_handle_array = [{}, {
	    value: undefined
	  }, {
	    value: null
	  }, {
	    value: true
	  }, {
	    value: false
	  }];

	  function __emval_decref(handle) {
	    if (handle > 4 && 0 === --emval_handle_array[handle].refcount) {
	      emval_handle_array[handle] = undefined;
	      emval_free_list.push(handle);
	    }
	  }

	  function count_emval_handles() {
	    var count = 0;

	    for (var i = 5; i < emval_handle_array.length; ++i) {
	      if (emval_handle_array[i] !== undefined) {
	        ++count;
	      }
	    }

	    return count;
	  }

	  function get_first_emval() {
	    for (var i = 5; i < emval_handle_array.length; ++i) {
	      if (emval_handle_array[i] !== undefined) {
	        return emval_handle_array[i];
	      }
	    }

	    return null;
	  }

	  function init_emval() {
	    Module["count_emval_handles"] = count_emval_handles;
	    Module["get_first_emval"] = get_first_emval;
	  }

	  var Emval = {
	    toValue: handle => {
	      if (!handle) {
	        throwBindingError("Cannot use deleted val. handle = " + handle);
	      }

	      return emval_handle_array[handle].value;
	    },
	    toHandle: value => {
	      switch (value) {
	        case undefined:
	          return 1;

	        case null:
	          return 2;

	        case true:
	          return 3;

	        case false:
	          return 4;

	        default:
	          {
	            var handle = emval_free_list.length ? emval_free_list.pop() : emval_handle_array.length;
	            emval_handle_array[handle] = {
	              refcount: 1,
	              value: value
	            };
	            return handle;
	          }
	      }
	    }
	  };

	  function __embind_register_emval(rawType, name) {
	    name = readLatin1String(name);
	    registerType(rawType, {
	      name: name,
	      "fromWireType": function (handle) {
	        var rv = Emval.toValue(handle);

	        __emval_decref(handle);

	        return rv;
	      },
	      "toWireType": function (destructors, value) {
	        return Emval.toHandle(value);
	      },
	      "argPackAdvance": 8,
	      "readValueFromPointer": simpleReadValueFromPointer,
	      destructorFunction: null
	    });
	  }

	  function _embind_repr(v) {
	    if (v === null) {
	      return "null";
	    }

	    var t = typeof v;

	    if (t === "object" || t === "array" || t === "function") {
	      return v.toString();
	    } else {
	      return "" + v;
	    }
	  }

	  function floatReadValueFromPointer(name, shift) {
	    switch (shift) {
	      case 2:
	        return function (pointer) {
	          return this["fromWireType"](HEAPF32[pointer >> 2]);
	        };

	      case 3:
	        return function (pointer) {
	          return this["fromWireType"](HEAPF64[pointer >> 3]);
	        };

	      default:
	        throw new TypeError("Unknown float type: " + name);
	    }
	  }

	  function __embind_register_float(rawType, name, size) {
	    var shift = getShiftFromSize(size);
	    name = readLatin1String(name);
	    registerType(rawType, {
	      name: name,
	      "fromWireType": function (value) {
	        return value;
	      },
	      "toWireType": function (destructors, value) {
	        if (typeof value != "number" && typeof value != "boolean") {
	          throw new TypeError('Cannot convert "' + _embind_repr(value) + '" to ' + this.name);
	        }

	        return value;
	      },
	      "argPackAdvance": 8,
	      "readValueFromPointer": floatReadValueFromPointer(name, shift),
	      destructorFunction: null
	    });
	  }

	  function integerReadValueFromPointer(name, shift, signed) {
	    switch (shift) {
	      case 0:
	        return signed ? function readS8FromPointer(pointer) {
	          return HEAP8[pointer];
	        } : function readU8FromPointer(pointer) {
	          return HEAPU8[pointer];
	        };

	      case 1:
	        return signed ? function readS16FromPointer(pointer) {
	          return HEAP16[pointer >> 1];
	        } : function readU16FromPointer(pointer) {
	          return HEAPU16[pointer >> 1];
	        };

	      case 2:
	        return signed ? function readS32FromPointer(pointer) {
	          return HEAP32[pointer >> 2];
	        } : function readU32FromPointer(pointer) {
	          return HEAPU32[pointer >> 2];
	        };

	      default:
	        throw new TypeError("Unknown integer type: " + name);
	    }
	  }

	  function __embind_register_integer(primitiveType, name, size, minRange, maxRange) {
	    name = readLatin1String(name);

	    if (maxRange === -1) {
	      maxRange = 4294967295;
	    }

	    var shift = getShiftFromSize(size);

	    var fromWireType = value => value;

	    if (minRange === 0) {
	      var bitshift = 32 - 8 * size;

	      fromWireType = value => value << bitshift >>> bitshift;
	    }

	    var isUnsignedType = name.includes("unsigned");

	    var checkAssertions = (value, toTypeName) => {
	      if (typeof value != "number" && typeof value != "boolean") {
	        throw new TypeError('Cannot convert "' + _embind_repr(value) + '" to ' + toTypeName);
	      }

	      if (value < minRange || value > maxRange) {
	        throw new TypeError('Passing a number "' + _embind_repr(value) + '" from JS side to C/C++ side to an argument of type "' + name + '", which is outside the valid range [' + minRange + ", " + maxRange + "]!");
	      }
	    };

	    var toWireType;

	    if (isUnsignedType) {
	      toWireType = function (destructors, value) {
	        checkAssertions(value, this.name);
	        return value >>> 0;
	      };
	    } else {
	      toWireType = function (destructors, value) {
	        checkAssertions(value, this.name);
	        return value;
	      };
	    }

	    registerType(primitiveType, {
	      name: name,
	      "fromWireType": fromWireType,
	      "toWireType": toWireType,
	      "argPackAdvance": 8,
	      "readValueFromPointer": integerReadValueFromPointer(name, shift, minRange !== 0),
	      destructorFunction: null
	    });
	  }

	  function __embind_register_memory_view(rawType, dataTypeIndex, name) {
	    var typeMapping = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array];
	    var TA = typeMapping[dataTypeIndex];

	    function decodeMemoryView(handle) {
	      handle = handle >> 2;
	      var heap = HEAPU32;
	      var size = heap[handle];
	      var data = heap[handle + 1];
	      return new TA(buffer, data, size);
	    }

	    name = readLatin1String(name);
	    registerType(rawType, {
	      name: name,
	      "fromWireType": decodeMemoryView,
	      "argPackAdvance": 8,
	      "readValueFromPointer": decodeMemoryView
	    }, {
	      ignoreDuplicateRegistrations: true
	    });
	  }

	  function __embind_register_std_string(rawType, name) {
	    name = readLatin1String(name);
	    var stdStringIsUTF8 = name === "std::string";
	    registerType(rawType, {
	      name: name,
	      "fromWireType": function (value) {
	        var length = HEAPU32[value >> 2];
	        var str;

	        if (stdStringIsUTF8) {
	          var decodeStartPtr = value + 4;

	          for (var i = 0; i <= length; ++i) {
	            var currentBytePtr = value + 4 + i;

	            if (i == length || HEAPU8[currentBytePtr] == 0) {
	              var maxRead = currentBytePtr - decodeStartPtr;
	              var stringSegment = UTF8ToString(decodeStartPtr, maxRead);

	              if (str === undefined) {
	                str = stringSegment;
	              } else {
	                str += String.fromCharCode(0);
	                str += stringSegment;
	              }

	              decodeStartPtr = currentBytePtr + 1;
	            }
	          }
	        } else {
	          var a = new Array(length);

	          for (var i = 0; i < length; ++i) {
	            a[i] = String.fromCharCode(HEAPU8[value + 4 + i]);
	          }

	          str = a.join("");
	        }

	        _free(value);

	        return str;
	      },
	      "toWireType": function (destructors, value) {
	        if (value instanceof ArrayBuffer) {
	          value = new Uint8Array(value);
	        }

	        var getLength;
	        var valueIsOfTypeString = typeof value == "string";

	        if (!(valueIsOfTypeString || value instanceof Uint8Array || value instanceof Uint8ClampedArray || value instanceof Int8Array)) {
	          throwBindingError("Cannot pass non-string to std::string");
	        }

	        if (stdStringIsUTF8 && valueIsOfTypeString) {
	          getLength = () => lengthBytesUTF8(value);
	        } else {
	          getLength = () => value.length;
	        }

	        var length = getLength();

	        var ptr = _malloc(4 + length + 1);

	        HEAPU32[ptr >> 2] = length;

	        if (stdStringIsUTF8 && valueIsOfTypeString) {
	          stringToUTF8(value, ptr + 4, length + 1);
	        } else {
	          if (valueIsOfTypeString) {
	            for (var i = 0; i < length; ++i) {
	              var charCode = value.charCodeAt(i);

	              if (charCode > 255) {
	                _free(ptr);

	                throwBindingError("String has UTF-16 code units that do not fit in 8 bits");
	              }

	              HEAPU8[ptr + 4 + i] = charCode;
	            }
	          } else {
	            for (var i = 0; i < length; ++i) {
	              HEAPU8[ptr + 4 + i] = value[i];
	            }
	          }
	        }

	        if (destructors !== null) {
	          destructors.push(_free, ptr);
	        }

	        return ptr;
	      },
	      "argPackAdvance": 8,
	      "readValueFromPointer": simpleReadValueFromPointer,
	      destructorFunction: function (ptr) {
	        _free(ptr);
	      }
	    });
	  }

	  function __embind_register_std_wstring(rawType, charSize, name) {
	    name = readLatin1String(name);
	    var decodeString, encodeString, getHeap, lengthBytesUTF, shift;

	    if (charSize === 2) {
	      decodeString = UTF16ToString;
	      encodeString = stringToUTF16;
	      lengthBytesUTF = lengthBytesUTF16;

	      getHeap = () => HEAPU16;

	      shift = 1;
	    } else if (charSize === 4) {
	      decodeString = UTF32ToString;
	      encodeString = stringToUTF32;
	      lengthBytesUTF = lengthBytesUTF32;

	      getHeap = () => HEAPU32;

	      shift = 2;
	    }

	    registerType(rawType, {
	      name: name,
	      "fromWireType": function (value) {
	        var length = HEAPU32[value >> 2];
	        var HEAP = getHeap();
	        var str;
	        var decodeStartPtr = value + 4;

	        for (var i = 0; i <= length; ++i) {
	          var currentBytePtr = value + 4 + i * charSize;

	          if (i == length || HEAP[currentBytePtr >> shift] == 0) {
	            var maxReadBytes = currentBytePtr - decodeStartPtr;
	            var stringSegment = decodeString(decodeStartPtr, maxReadBytes);

	            if (str === undefined) {
	              str = stringSegment;
	            } else {
	              str += String.fromCharCode(0);
	              str += stringSegment;
	            }

	            decodeStartPtr = currentBytePtr + charSize;
	          }
	        }

	        _free(value);

	        return str;
	      },
	      "toWireType": function (destructors, value) {
	        if (!(typeof value == "string")) {
	          throwBindingError("Cannot pass non-string to C++ string type " + name);
	        }

	        var length = lengthBytesUTF(value);

	        var ptr = _malloc(4 + length + charSize);

	        HEAPU32[ptr >> 2] = length >> shift;
	        encodeString(value, ptr + 4, length + charSize);

	        if (destructors !== null) {
	          destructors.push(_free, ptr);
	        }

	        return ptr;
	      },
	      "argPackAdvance": 8,
	      "readValueFromPointer": simpleReadValueFromPointer,
	      destructorFunction: function (ptr) {
	        _free(ptr);
	      }
	    });
	  }

	  function __embind_register_void(rawType, name) {
	    name = readLatin1String(name);
	    registerType(rawType, {
	      isVoid: true,
	      name: name,
	      "argPackAdvance": 0,
	      "fromWireType": function () {
	        return undefined;
	      },
	      "toWireType": function (destructors, o) {
	        return undefined;
	      }
	    });
	  }

	  function __emscripten_date_now() {
	    return Date.now();
	  }

	  function requireRegisteredType(rawType, humanName) {
	    var impl = registeredTypes[rawType];

	    if (undefined === impl) {
	      throwBindingError(humanName + " has unknown type " + getTypeName(rawType));
	    }

	    return impl;
	  }

	  function __emval_as(handle, returnType, destructorsRef) {
	    handle = Emval.toValue(handle);
	    returnType = requireRegisteredType(returnType, "emval::as");
	    var destructors = [];
	    var rd = Emval.toHandle(destructors);
	    HEAP32[destructorsRef >> 2] = rd;
	    return returnType["toWireType"](destructors, handle);
	  }

	  var emval_symbols = {};

	  function getStringOrSymbol(address) {
	    var symbol = emval_symbols[address];

	    if (symbol === undefined) {
	      return readLatin1String(address);
	    }

	    return symbol;
	  }

	  var emval_methodCallers = [];

	  function __emval_call_void_method(caller, handle, methodName, args) {
	    caller = emval_methodCallers[caller];
	    handle = Emval.toValue(handle);
	    methodName = getStringOrSymbol(methodName);
	    caller(handle, methodName, null, args);
	  }

	  function __emval_addMethodCaller(caller) {
	    var id = emval_methodCallers.length;
	    emval_methodCallers.push(caller);
	    return id;
	  }

	  function __emval_lookupTypes(argCount, argTypes) {
	    var a = new Array(argCount);

	    for (var i = 0; i < argCount; ++i) {
	      a[i] = requireRegisteredType(HEAP32[(argTypes >> 2) + i], "parameter " + i);
	    }

	    return a;
	  }

	  var emval_registeredMethods = [];

	  function __emval_get_method_caller(argCount, argTypes) {
	    var types = __emval_lookupTypes(argCount, argTypes);

	    var retType = types[0];
	    var signatureName = retType.name + "_$" + types.slice(1).map(function (t) {
	      return t.name;
	    }).join("_") + "$";
	    var returnId = emval_registeredMethods[signatureName];

	    if (returnId !== undefined) {
	      return returnId;
	    }

	    var params = ["retType"];
	    var args = [retType];
	    var argsList = "";

	    for (var i = 0; i < argCount - 1; ++i) {
	      argsList += (i !== 0 ? ", " : "") + "arg" + i;
	      params.push("argType" + i);
	      args.push(types[1 + i]);
	    }

	    var functionName = makeLegalFunctionName("methodCaller_" + signatureName);
	    var functionBody = "return function " + functionName + "(handle, name, destructors, args) {\n";
	    var offset = 0;

	    for (var i = 0; i < argCount - 1; ++i) {
	      functionBody += "    var arg" + i + " = argType" + i + ".readValueFromPointer(args" + (offset ? "+" + offset : "") + ");\n";
	      offset += types[i + 1]["argPackAdvance"];
	    }

	    functionBody += "    var rv = handle[name](" + argsList + ");\n";

	    for (var i = 0; i < argCount - 1; ++i) {
	      if (types[i + 1]["deleteObject"]) {
	        functionBody += "    argType" + i + ".deleteObject(arg" + i + ");\n";
	      }
	    }

	    if (!retType.isVoid) {
	      functionBody += "    return retType.toWireType(destructors, rv);\n";
	    }

	    functionBody += "};\n";
	    params.push(functionBody);
	    var invokerFunction = new_(Function, params).apply(null, args);
	    returnId = __emval_addMethodCaller(invokerFunction);
	    emval_registeredMethods[signatureName] = returnId;
	    return returnId;
	  }

	  function __emval_incref(handle) {
	    if (handle > 4) {
	      emval_handle_array[handle].refcount += 1;
	    }
	  }

	  function __emval_run_destructors(handle) {
	    var destructors = Emval.toValue(handle);
	    runDestructors(destructors);

	    __emval_decref(handle);
	  }

	  function __emval_take_value(type, argv) {
	    type = requireRegisteredType(type, "_emval_take_value");
	    var v = type["readValueFromPointer"](argv);
	    return Emval.toHandle(v);
	  }

	  function __gmtime_js(time, tmPtr) {
	    var date = new Date(HEAP32[time >> 2] * 1e3);
	    HEAP32[tmPtr >> 2] = date.getUTCSeconds();
	    HEAP32[tmPtr + 4 >> 2] = date.getUTCMinutes();
	    HEAP32[tmPtr + 8 >> 2] = date.getUTCHours();
	    HEAP32[tmPtr + 12 >> 2] = date.getUTCDate();
	    HEAP32[tmPtr + 16 >> 2] = date.getUTCMonth();
	    HEAP32[tmPtr + 20 >> 2] = date.getUTCFullYear() - 1900;
	    HEAP32[tmPtr + 24 >> 2] = date.getUTCDay();
	    var start = Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0);
	    var yday = (date.getTime() - start) / (1e3 * 60 * 60 * 24) | 0;
	    HEAP32[tmPtr + 28 >> 2] = yday;
	  }

	  function __localtime_js(time, tmPtr) {
	    var date = new Date(HEAP32[time >> 2] * 1e3);
	    HEAP32[tmPtr >> 2] = date.getSeconds();
	    HEAP32[tmPtr + 4 >> 2] = date.getMinutes();
	    HEAP32[tmPtr + 8 >> 2] = date.getHours();
	    HEAP32[tmPtr + 12 >> 2] = date.getDate();
	    HEAP32[tmPtr + 16 >> 2] = date.getMonth();
	    HEAP32[tmPtr + 20 >> 2] = date.getFullYear() - 1900;
	    HEAP32[tmPtr + 24 >> 2] = date.getDay();
	    var start = new Date(date.getFullYear(), 0, 1);
	    var yday = (date.getTime() - start.getTime()) / (1e3 * 60 * 60 * 24) | 0;
	    HEAP32[tmPtr + 28 >> 2] = yday;
	    HEAP32[tmPtr + 36 >> 2] = -(date.getTimezoneOffset() * 60);
	    var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
	    var winterOffset = start.getTimezoneOffset();
	    var dst = (summerOffset != winterOffset && date.getTimezoneOffset() == Math.min(winterOffset, summerOffset)) | 0;
	    HEAP32[tmPtr + 32 >> 2] = dst;
	  }

	  function __mktime_js(tmPtr) {
	    var date = new Date(HEAP32[tmPtr + 20 >> 2] + 1900, HEAP32[tmPtr + 16 >> 2], HEAP32[tmPtr + 12 >> 2], HEAP32[tmPtr + 8 >> 2], HEAP32[tmPtr + 4 >> 2], HEAP32[tmPtr >> 2], 0);
	    var dst = HEAP32[tmPtr + 32 >> 2];
	    var guessedOffset = date.getTimezoneOffset();
	    var start = new Date(date.getFullYear(), 0, 1);
	    var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
	    var winterOffset = start.getTimezoneOffset();
	    var dstOffset = Math.min(winterOffset, summerOffset);

	    if (dst < 0) {
	      HEAP32[tmPtr + 32 >> 2] = Number(summerOffset != winterOffset && dstOffset == guessedOffset);
	    } else if (dst > 0 != (dstOffset == guessedOffset)) {
	      var nonDstOffset = Math.max(winterOffset, summerOffset);
	      var trueOffset = dst > 0 ? dstOffset : nonDstOffset;
	      date.setTime(date.getTime() + (trueOffset - guessedOffset) * 6e4);
	    }

	    HEAP32[tmPtr + 24 >> 2] = date.getDay();
	    var yday = (date.getTime() - start.getTime()) / (1e3 * 60 * 60 * 24) | 0;
	    HEAP32[tmPtr + 28 >> 2] = yday;
	    HEAP32[tmPtr >> 2] = date.getSeconds();
	    HEAP32[tmPtr + 4 >> 2] = date.getMinutes();
	    HEAP32[tmPtr + 8 >> 2] = date.getHours();
	    HEAP32[tmPtr + 12 >> 2] = date.getDate();
	    HEAP32[tmPtr + 16 >> 2] = date.getMonth();
	    return date.getTime() / 1e3 | 0;
	  }

	  function _tzset_impl(timezone, daylight, tzname) {
	    var currentYear = new Date().getFullYear();
	    var winter = new Date(currentYear, 0, 1);
	    var summer = new Date(currentYear, 6, 1);
	    var winterOffset = winter.getTimezoneOffset();
	    var summerOffset = summer.getTimezoneOffset();
	    var stdTimezoneOffset = Math.max(winterOffset, summerOffset);
	    HEAP32[timezone >> 2] = stdTimezoneOffset * 60;
	    HEAP32[daylight >> 2] = Number(winterOffset != summerOffset);

	    function extractZone(date) {
	      var match = date.toTimeString().match(/\(([A-Za-z ]+)\)$/);
	      return match ? match[1] : "GMT";
	    }

	    var winterName = extractZone(winter);
	    var summerName = extractZone(summer);
	    var winterNamePtr = allocateUTF8(winterName);
	    var summerNamePtr = allocateUTF8(summerName);

	    if (summerOffset < winterOffset) {
	      HEAP32[tzname >> 2] = winterNamePtr;
	      HEAP32[tzname + 4 >> 2] = summerNamePtr;
	    } else {
	      HEAP32[tzname >> 2] = summerNamePtr;
	      HEAP32[tzname + 4 >> 2] = winterNamePtr;
	    }
	  }

	  function __tzset_js(timezone, daylight, tzname) {
	    if (__tzset_js.called) return;
	    __tzset_js.called = true;

	    _tzset_impl(timezone, daylight, tzname);
	  }

	  function _abort() {
	    abort("native code called abort()");
	  }

	  function reallyNegative(x) {
	    return x < 0 || x === 0 && 1 / x === -Infinity;
	  }

	  function convertI32PairToI53(lo, hi) {
	    assert(hi === (hi | 0));
	    return (lo >>> 0) + hi * 4294967296;
	  }

	  function convertU32PairToI53(lo, hi) {
	    return (lo >>> 0) + (hi >>> 0) * 4294967296;
	  }

	  function reSign(value, bits) {
	    if (value <= 0) {
	      return value;
	    }

	    var half = bits <= 32 ? Math.abs(1 << bits - 1) : Math.pow(2, bits - 1);

	    if (value >= half && (bits <= 32 || value > half)) {
	      value = -2 * half + value;
	    }

	    return value;
	  }

	  function unSign(value, bits) {
	    if (value >= 0) {
	      return value;
	    }

	    return bits <= 32 ? 2 * Math.abs(1 << bits - 1) + value : Math.pow(2, bits) + value;
	  }

	  function formatString(format, varargs) {
	    assert((varargs & 3) === 0);
	    var textIndex = format;
	    var argIndex = varargs;

	    function prepVararg(ptr, type) {
	      if (type === "double" || type === "i64") {
	        if (ptr & 7) {
	          assert((ptr & 7) === 4);
	          ptr += 4;
	        }
	      } else {
	        assert((ptr & 3) === 0);
	      }

	      return ptr;
	    }

	    function getNextArg(type) {
	      var ret;
	      argIndex = prepVararg(argIndex, type);

	      if (type === "double") {
	        ret = Number(HEAPF64[argIndex >> 3]);
	        argIndex += 8;
	      } else if (type == "i64") {
	        ret = [HEAP32[argIndex >> 2], HEAP32[argIndex + 4 >> 2]];
	        argIndex += 8;
	      } else {
	        assert((argIndex & 3) === 0);
	        type = "i32";
	        ret = HEAP32[argIndex >> 2];
	        argIndex += 4;
	      }

	      return ret;
	    }

	    var ret = [];
	    var curr, next, currArg;

	    while (1) {
	      var startTextIndex = textIndex;
	      curr = HEAP8[textIndex >> 0];
	      if (curr === 0) break;
	      next = HEAP8[textIndex + 1 >> 0];

	      if (curr == 37) {
	        var flagAlwaysSigned = false;
	        var flagLeftAlign = false;
	        var flagAlternative = false;
	        var flagZeroPad = false;
	        var flagPadSign = false;

	        flagsLoop: while (1) {
	          switch (next) {
	            case 43:
	              flagAlwaysSigned = true;
	              break;

	            case 45:
	              flagLeftAlign = true;
	              break;

	            case 35:
	              flagAlternative = true;
	              break;

	            case 48:
	              if (flagZeroPad) {
	                break flagsLoop;
	              } else {
	                flagZeroPad = true;
	                break;
	              }

	            case 32:
	              flagPadSign = true;
	              break;

	            default:
	              break flagsLoop;
	          }

	          textIndex++;
	          next = HEAP8[textIndex + 1 >> 0];
	        }

	        var width = 0;

	        if (next == 42) {
	          width = getNextArg("i32");
	          textIndex++;
	          next = HEAP8[textIndex + 1 >> 0];
	        } else {
	          while (next >= 48 && next <= 57) {
	            width = width * 10 + (next - 48);
	            textIndex++;
	            next = HEAP8[textIndex + 1 >> 0];
	          }
	        }

	        var precisionSet = false,
	            precision = -1;

	        if (next == 46) {
	          precision = 0;
	          precisionSet = true;
	          textIndex++;
	          next = HEAP8[textIndex + 1 >> 0];

	          if (next == 42) {
	            precision = getNextArg("i32");
	            textIndex++;
	          } else {
	            while (1) {
	              var precisionChr = HEAP8[textIndex + 1 >> 0];
	              if (precisionChr < 48 || precisionChr > 57) break;
	              precision = precision * 10 + (precisionChr - 48);
	              textIndex++;
	            }
	          }

	          next = HEAP8[textIndex + 1 >> 0];
	        }

	        if (precision < 0) {
	          precision = 6;
	          precisionSet = false;
	        }

	        var argSize;

	        switch (String.fromCharCode(next)) {
	          case "h":
	            var nextNext = HEAP8[textIndex + 2 >> 0];

	            if (nextNext == 104) {
	              textIndex++;
	              argSize = 1;
	            } else {
	              argSize = 2;
	            }

	            break;

	          case "l":
	            var nextNext = HEAP8[textIndex + 2 >> 0];

	            if (nextNext == 108) {
	              textIndex++;
	              argSize = 8;
	            } else {
	              argSize = 4;
	            }

	            break;

	          case "L":
	          case "q":
	          case "j":
	            argSize = 8;
	            break;

	          case "z":
	          case "t":
	          case "I":
	            argSize = 4;
	            break;

	          default:
	            argSize = null;
	        }

	        if (argSize) textIndex++;
	        next = HEAP8[textIndex + 1 >> 0];

	        switch (String.fromCharCode(next)) {
	          case "d":
	          case "i":
	          case "u":
	          case "o":
	          case "x":
	          case "X":
	          case "p":
	            {
	              var signed = next == 100 || next == 105;
	              argSize = argSize || 4;
	              currArg = getNextArg("i" + argSize * 8);
	              var argText;

	              if (argSize == 8) {
	                currArg = next == 117 ? convertU32PairToI53(currArg[0], currArg[1]) : convertI32PairToI53(currArg[0], currArg[1]);
	              }

	              if (argSize <= 4) {
	                var limit = Math.pow(256, argSize) - 1;
	                currArg = (signed ? reSign : unSign)(currArg & limit, argSize * 8);
	              }

	              var currAbsArg = Math.abs(currArg);
	              var prefix = "";

	              if (next == 100 || next == 105) {
	                argText = reSign(currArg, 8 * argSize).toString(10);
	              } else if (next == 117) {
	                argText = unSign(currArg, 8 * argSize).toString(10);
	                currArg = Math.abs(currArg);
	              } else if (next == 111) {
	                argText = (flagAlternative ? "0" : "") + currAbsArg.toString(8);
	              } else if (next == 120 || next == 88) {
	                prefix = flagAlternative && currArg != 0 ? "0x" : "";

	                if (currArg < 0) {
	                  currArg = -currArg;
	                  argText = (currAbsArg - 1).toString(16);
	                  var buffer = [];

	                  for (var i = 0; i < argText.length; i++) {
	                    buffer.push((15 - parseInt(argText[i], 16)).toString(16));
	                  }

	                  argText = buffer.join("");

	                  while (argText.length < argSize * 2) argText = "f" + argText;
	                } else {
	                  argText = currAbsArg.toString(16);
	                }

	                if (next == 88) {
	                  prefix = prefix.toUpperCase();
	                  argText = argText.toUpperCase();
	                }
	              } else if (next == 112) {
	                if (currAbsArg === 0) {
	                  argText = "(nil)";
	                } else {
	                  prefix = "0x";
	                  argText = currAbsArg.toString(16);
	                }
	              }

	              if (precisionSet) {
	                while (argText.length < precision) {
	                  argText = "0" + argText;
	                }
	              }

	              if (currArg >= 0) {
	                if (flagAlwaysSigned) {
	                  prefix = "+" + prefix;
	                } else if (flagPadSign) {
	                  prefix = " " + prefix;
	                }
	              }

	              if (argText.charAt(0) == "-") {
	                prefix = "-" + prefix;
	                argText = argText.substr(1);
	              }

	              while (prefix.length + argText.length < width) {
	                if (flagLeftAlign) {
	                  argText += " ";
	                } else {
	                  if (flagZeroPad) {
	                    argText = "0" + argText;
	                  } else {
	                    prefix = " " + prefix;
	                  }
	                }
	              }

	              argText = prefix + argText;
	              argText.split("").forEach(function (chr) {
	                ret.push(chr.charCodeAt(0));
	              });
	              break;
	            }

	          case "f":
	          case "F":
	          case "e":
	          case "E":
	          case "g":
	          case "G":
	            {
	              currArg = getNextArg("double");
	              var argText;

	              if (isNaN(currArg)) {
	                argText = "nan";
	                flagZeroPad = false;
	              } else if (!isFinite(currArg)) {
	                argText = (currArg < 0 ? "-" : "") + "inf";
	                flagZeroPad = false;
	              } else {
	                var isGeneral = false;
	                var effectivePrecision = Math.min(precision, 20);

	                if (next == 103 || next == 71) {
	                  isGeneral = true;
	                  precision = precision || 1;
	                  var exponent = parseInt(currArg.toExponential(effectivePrecision).split("e")[1], 10);

	                  if (precision > exponent && exponent >= -4) {
	                    next = (next == 103 ? "f" : "F").charCodeAt(0);
	                    precision -= exponent + 1;
	                  } else {
	                    next = (next == 103 ? "e" : "E").charCodeAt(0);
	                    precision--;
	                  }

	                  effectivePrecision = Math.min(precision, 20);
	                }

	                if (next == 101 || next == 69) {
	                  argText = currArg.toExponential(effectivePrecision);

	                  if (/[eE][-+]\d$/.test(argText)) {
	                    argText = argText.slice(0, -1) + "0" + argText.slice(-1);
	                  }
	                } else if (next == 102 || next == 70) {
	                  argText = currArg.toFixed(effectivePrecision);

	                  if (currArg === 0 && reallyNegative(currArg)) {
	                    argText = "-" + argText;
	                  }
	                }

	                var parts = argText.split("e");

	                if (isGeneral && !flagAlternative) {
	                  while (parts[0].length > 1 && parts[0].includes(".") && (parts[0].slice(-1) == "0" || parts[0].slice(-1) == ".")) {
	                    parts[0] = parts[0].slice(0, -1);
	                  }
	                } else {
	                  if (flagAlternative && argText.indexOf(".") == -1) parts[0] += ".";

	                  while (precision > effectivePrecision++) parts[0] += "0";
	                }

	                argText = parts[0] + (parts.length > 1 ? "e" + parts[1] : "");
	                if (next == 69) argText = argText.toUpperCase();

	                if (currArg >= 0) {
	                  if (flagAlwaysSigned) {
	                    argText = "+" + argText;
	                  } else if (flagPadSign) {
	                    argText = " " + argText;
	                  }
	                }
	              }

	              while (argText.length < width) {
	                if (flagLeftAlign) {
	                  argText += " ";
	                } else {
	                  if (flagZeroPad && (argText[0] == "-" || argText[0] == "+")) {
	                    argText = argText[0] + "0" + argText.slice(1);
	                  } else {
	                    argText = (flagZeroPad ? "0" : " ") + argText;
	                  }
	                }
	              }

	              if (next < 97) argText = argText.toUpperCase();
	              argText.split("").forEach(function (chr) {
	                ret.push(chr.charCodeAt(0));
	              });
	              break;
	            }

	          case "s":
	            {
	              var arg = getNextArg("i8*");
	              var argLength = arg ? _strlen(arg) : "(null)".length;
	              if (precisionSet) argLength = Math.min(argLength, precision);

	              if (!flagLeftAlign) {
	                while (argLength < width--) {
	                  ret.push(32);
	                }
	              }

	              if (arg) {
	                for (var i = 0; i < argLength; i++) {
	                  ret.push(HEAPU8[arg++ >> 0]);
	                }
	              } else {
	                ret = ret.concat(intArrayFromString("(null)".substr(0, argLength), true));
	              }

	              if (flagLeftAlign) {
	                while (argLength < width--) {
	                  ret.push(32);
	                }
	              }

	              break;
	            }

	          case "c":
	            {
	              if (flagLeftAlign) ret.push(getNextArg("i8"));

	              while (--width > 0) {
	                ret.push(32);
	              }

	              if (!flagLeftAlign) ret.push(getNextArg("i8"));
	              break;
	            }

	          case "n":
	            {
	              var ptr = getNextArg("i32*");
	              HEAP32[ptr >> 2] = ret.length;
	              break;
	            }

	          case "%":
	            {
	              ret.push(curr);
	              break;
	            }

	          default:
	            {
	              for (var i = startTextIndex; i < textIndex + 2; i++) {
	                ret.push(HEAP8[i >> 0]);
	              }
	            }
	        }

	        textIndex += 2;
	      } else {
	        ret.push(curr);
	        textIndex += 1;
	      }
	    }

	    return ret;
	  }

	  function traverseStack(args) {
	    if (!args || !args.callee || !args.callee.name) {
	      return [null, "", ""];
	    }

	    args.callee.toString();
	    var funcname = args.callee.name;
	    var str = "(";
	    var first = true;

	    for (var i in args) {
	      var a = args[i];

	      if (!first) {
	        str += ", ";
	      }

	      first = false;

	      if (typeof a == "number" || typeof a == "string") {
	        str += a;
	      } else {
	        str += "(" + typeof a + ")";
	      }
	    }

	    str += ")";
	    var caller = args.callee.caller;
	    args = caller ? caller.arguments : [];
	    if (first) str = "";
	    return [args, funcname, str];
	  }

	  function _emscripten_get_callstack_js(flags) {
	    var callstack = jsStackTrace();
	    var iThisFunc = callstack.lastIndexOf("_emscripten_log");
	    var iThisFunc2 = callstack.lastIndexOf("_emscripten_get_callstack");
	    var iNextLine = callstack.indexOf("\n", Math.max(iThisFunc, iThisFunc2)) + 1;
	    callstack = callstack.slice(iNextLine);

	    if (flags & 32) {
	      warnOnce("EM_LOG_DEMANGLE is deprecated; ignoring");
	    }

	    if (flags & 8 && typeof emscripten_source_map == "undefined") {
	      warnOnce('Source map information is not available, emscripten_log with EM_LOG_C_STACK will be ignored. Build with "--pre-js $EMSCRIPTEN/src/emscripten-source-map.min.js" linker flag to add source map loading to code.');
	      flags ^= 8;
	      flags |= 16;
	    }

	    var stack_args = null;

	    if (flags & 128) {
	      stack_args = traverseStack(arguments);

	      while (stack_args[1].includes("_emscripten_")) stack_args = traverseStack(stack_args[0]);
	    }

	    var lines = callstack.split("\n");
	    callstack = "";
	    var newFirefoxRe = new RegExp("\\s*(.*?)@(.*?):([0-9]+):([0-9]+)");
	    var firefoxRe = new RegExp("\\s*(.*?)@(.*):(.*)(:(.*))?");
	    var chromeRe = new RegExp("\\s*at (.*?) \\((.*):(.*):(.*)\\)");

	    for (var l in lines) {
	      var line = lines[l];
	      var symbolName = "";
	      var file = "";
	      var lineno = 0;
	      var column = 0;
	      var parts = chromeRe.exec(line);

	      if (parts && parts.length == 5) {
	        symbolName = parts[1];
	        file = parts[2];
	        lineno = parts[3];
	        column = parts[4];
	      } else {
	        parts = newFirefoxRe.exec(line);
	        if (!parts) parts = firefoxRe.exec(line);

	        if (parts && parts.length >= 4) {
	          symbolName = parts[1];
	          file = parts[2];
	          lineno = parts[3];
	          column = parts[4] | 0;
	        } else {
	          callstack += line + "\n";
	          continue;
	        }
	      }

	      var haveSourceMap = false;

	      if (flags & 8) {
	        var orig = emscripten_source_map.originalPositionFor({
	          line: lineno,
	          column: column
	        });
	        haveSourceMap = orig && orig.source;

	        if (haveSourceMap) {
	          if (flags & 64) {
	            orig.source = orig.source.substring(orig.source.replace(/\\/g, "/").lastIndexOf("/") + 1);
	          }

	          callstack += "    at " + symbolName + " (" + orig.source + ":" + orig.line + ":" + orig.column + ")\n";
	        }
	      }

	      if (flags & 16 || !haveSourceMap) {
	        if (flags & 64) {
	          file = file.substring(file.replace(/\\/g, "/").lastIndexOf("/") + 1);
	        }

	        callstack += (haveSourceMap ? "     = " + symbolName : "    at " + symbolName) + " (" + file + ":" + lineno + ":" + column + ")\n";
	      }

	      if (flags & 128 && stack_args[0]) {
	        if (stack_args[1] == symbolName && stack_args[2].length > 0) {
	          callstack = callstack.replace(/\s+$/, "");
	          callstack += " with values: " + stack_args[1] + stack_args[2] + "\n";
	        }

	        stack_args = traverseStack(stack_args[0]);
	      }
	    }

	    callstack = callstack.replace(/\s+$/, "");
	    return callstack;
	  }

	  function _emscripten_log_js(flags, str) {
	    if (flags & 24) {
	      str = str.replace(/\s+$/, "");
	      str += (str.length > 0 ? "\n" : "") + _emscripten_get_callstack_js(flags);
	    }

	    if (flags & 1) {
	      if (flags & 4) {
	        console.error(str);
	      } else if (flags & 2) {
	        console.warn(str);
	      } else if (flags & 512) {
	        console.info(str);
	      } else if (flags & 256) {
	        console.debug(str);
	      } else {
	        console.log(str);
	      }
	    } else if (flags & 6) {
	      err(str);
	    } else {
	      out(str);
	    }
	  }

	  function _emscripten_log(flags, format, varargs) {
	    var result = formatString(format, varargs);
	    var str = UTF8ArrayToString(result, 0);

	    _emscripten_log_js(flags, str);
	  }

	  function _emscripten_get_heap_max() {
	    return 2147483648;
	  }

	  function emscripten_realloc_buffer(size) {
	    try {
	      wasmMemory.grow(size - buffer.byteLength + 65535 >>> 16);
	      updateGlobalBufferAndViews(wasmMemory.buffer);
	      return 1;
	    } catch (e) {
	      err("emscripten_realloc_buffer: Attempted to grow heap from " + buffer.byteLength + " bytes to " + size + " bytes, but got error: " + e);
	    }
	  }

	  function _emscripten_resize_heap(requestedSize) {
	    var oldSize = HEAPU8.length;
	    requestedSize = requestedSize >>> 0;
	    assert(requestedSize > oldSize);

	    var maxHeapSize = _emscripten_get_heap_max();

	    if (requestedSize > maxHeapSize) {
	      err("Cannot enlarge memory, asked to go up to " + requestedSize + " bytes, but the limit is " + maxHeapSize + " bytes!");
	      return false;
	    }

	    let alignUp = (x, multiple) => x + (multiple - x % multiple) % multiple;

	    for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
	      var overGrownHeapSize = oldSize * (1 + .2 / cutDown);
	      overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
	      var newSize = Math.min(maxHeapSize, alignUp(Math.max(requestedSize, overGrownHeapSize), 65536));
	      var replacement = emscripten_realloc_buffer(newSize);

	      if (replacement) {
	        return true;
	      }
	    }

	    err("Failed to grow the heap from " + oldSize + " bytes to " + newSize + " bytes, not enough memory!");
	    return false;
	  }

	  var ENV = {};

	  function getExecutableName() {
	    return thisProgram || "./this.program";
	  }

	  function getEnvStrings() {
	    if (!getEnvStrings.strings) {
	      var lang = (typeof navigator == "object" && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8";
	      var env = {
	        "USER": "web_user",
	        "LOGNAME": "web_user",
	        "PATH": "/",
	        "PWD": "/",
	        "HOME": "/home/web_user",
	        "LANG": lang,
	        "_": getExecutableName()
	      };

	      for (var x in ENV) {
	        if (ENV[x] === undefined) delete env[x];else env[x] = ENV[x];
	      }

	      var strings = [];

	      for (var x in env) {
	        strings.push(x + "=" + env[x]);
	      }

	      getEnvStrings.strings = strings;
	    }

	    return getEnvStrings.strings;
	  }

	  function _environ_get(__environ, environ_buf) {
	    var bufSize = 0;
	    getEnvStrings().forEach(function (string, i) {
	      var ptr = environ_buf + bufSize;
	      HEAP32[__environ + i * 4 >> 2] = ptr;
	      writeAsciiToMemory(string, ptr);
	      bufSize += string.length + 1;
	    });
	    return 0;
	  }

	  function _environ_sizes_get(penviron_count, penviron_buf_size) {
	    var strings = getEnvStrings();
	    HEAP32[penviron_count >> 2] = strings.length;
	    var bufSize = 0;
	    strings.forEach(function (string) {
	      bufSize += string.length + 1;
	    });
	    HEAP32[penviron_buf_size >> 2] = bufSize;
	    return 0;
	  }

	  function _fd_close(fd) {
	    try {
	      var stream = SYSCALLS.getStreamFromFD(fd);
	      FS.close(stream);
	      return 0;
	    } catch (e) {
	      if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
	      return e.errno;
	    }
	  }

	  function _fd_fdstat_get(fd, pbuf) {
	    try {
	      var stream = SYSCALLS.getStreamFromFD(fd);
	      var type = stream.tty ? 2 : FS.isDir(stream.mode) ? 3 : FS.isLink(stream.mode) ? 7 : 4;
	      HEAP8[pbuf >> 0] = type;
	      return 0;
	    } catch (e) {
	      if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
	      return e.errno;
	    }
	  }

	  function _fd_read(fd, iov, iovcnt, pnum) {
	    try {
	      var stream = SYSCALLS.getStreamFromFD(fd);
	      var num = SYSCALLS.doReadv(stream, iov, iovcnt);
	      HEAP32[pnum >> 2] = num;
	      return 0;
	    } catch (e) {
	      if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
	      return e.errno;
	    }
	  }

	  function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {
	    try {
	      var stream = SYSCALLS.getStreamFromFD(fd);
	      var HIGH_OFFSET = 4294967296;
	      var offset = offset_high * HIGH_OFFSET + (offset_low >>> 0);
	      var DOUBLE_LIMIT = 9007199254740992;

	      if (offset <= -DOUBLE_LIMIT || offset >= DOUBLE_LIMIT) {
	        return -61;
	      }

	      FS.llseek(stream, offset, whence);
	      tempI64 = [stream.position >>> 0, (tempDouble = stream.position, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[newOffset >> 2] = tempI64[0], HEAP32[newOffset + 4 >> 2] = tempI64[1];
	      if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null;
	      return 0;
	    } catch (e) {
	      if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
	      return e.errno;
	    }
	  }

	  function _fd_write(fd, iov, iovcnt, pnum) {
	    try {
	      var stream = SYSCALLS.getStreamFromFD(fd);
	      var num = SYSCALLS.doWritev(stream, iov, iovcnt);
	      HEAP32[pnum >> 2] = num;
	      return 0;
	    } catch (e) {
	      if (typeof FS == "undefined" || !(e instanceof FS.ErrnoError)) throw e;
	      return e.errno;
	    }
	  }

	  function _setTempRet0(val) {
	  }

	  var FSNode = function (parent, name, mode, rdev) {
	    if (!parent) {
	      parent = this;
	    }

	    this.parent = parent;
	    this.mount = parent.mount;
	    this.mounted = null;
	    this.id = FS.nextInode++;
	    this.name = name;
	    this.mode = mode;
	    this.node_ops = {};
	    this.stream_ops = {};
	    this.rdev = rdev;
	  };

	  var readMode = 292 | 73;
	  var writeMode = 146;
	  Object.defineProperties(FSNode.prototype, {
	    read: {
	      get: function () {
	        return (this.mode & readMode) === readMode;
	      },
	      set: function (val) {
	        val ? this.mode |= readMode : this.mode &= ~readMode;
	      }
	    },
	    write: {
	      get: function () {
	        return (this.mode & writeMode) === writeMode;
	      },
	      set: function (val) {
	        val ? this.mode |= writeMode : this.mode &= ~writeMode;
	      }
	    },
	    isFolder: {
	      get: function () {
	        return FS.isDir(this.mode);
	      }
	    },
	    isDevice: {
	      get: function () {
	        return FS.isChrdev(this.mode);
	      }
	    }
	  });
	  FS.FSNode = FSNode;
	  FS.staticInit();
	  ERRNO_CODES = {
	    "EPERM": 63,
	    "ENOENT": 44,
	    "ESRCH": 71,
	    "EINTR": 27,
	    "EIO": 29,
	    "ENXIO": 60,
	    "E2BIG": 1,
	    "ENOEXEC": 45,
	    "EBADF": 8,
	    "ECHILD": 12,
	    "EAGAIN": 6,
	    "EWOULDBLOCK": 6,
	    "ENOMEM": 48,
	    "EACCES": 2,
	    "EFAULT": 21,
	    "ENOTBLK": 105,
	    "EBUSY": 10,
	    "EEXIST": 20,
	    "EXDEV": 75,
	    "ENODEV": 43,
	    "ENOTDIR": 54,
	    "EISDIR": 31,
	    "EINVAL": 28,
	    "ENFILE": 41,
	    "EMFILE": 33,
	    "ENOTTY": 59,
	    "ETXTBSY": 74,
	    "EFBIG": 22,
	    "ENOSPC": 51,
	    "ESPIPE": 70,
	    "EROFS": 69,
	    "EMLINK": 34,
	    "EPIPE": 64,
	    "EDOM": 18,
	    "ERANGE": 68,
	    "ENOMSG": 49,
	    "EIDRM": 24,
	    "ECHRNG": 106,
	    "EL2NSYNC": 156,
	    "EL3HLT": 107,
	    "EL3RST": 108,
	    "ELNRNG": 109,
	    "EUNATCH": 110,
	    "ENOCSI": 111,
	    "EL2HLT": 112,
	    "EDEADLK": 16,
	    "ENOLCK": 46,
	    "EBADE": 113,
	    "EBADR": 114,
	    "EXFULL": 115,
	    "ENOANO": 104,
	    "EBADRQC": 103,
	    "EBADSLT": 102,
	    "EDEADLOCK": 16,
	    "EBFONT": 101,
	    "ENOSTR": 100,
	    "ENODATA": 116,
	    "ETIME": 117,
	    "ENOSR": 118,
	    "ENONET": 119,
	    "ENOPKG": 120,
	    "EREMOTE": 121,
	    "ENOLINK": 47,
	    "EADV": 122,
	    "ESRMNT": 123,
	    "ECOMM": 124,
	    "EPROTO": 65,
	    "EMULTIHOP": 36,
	    "EDOTDOT": 125,
	    "EBADMSG": 9,
	    "ENOTUNIQ": 126,
	    "EBADFD": 127,
	    "EREMCHG": 128,
	    "ELIBACC": 129,
	    "ELIBBAD": 130,
	    "ELIBSCN": 131,
	    "ELIBMAX": 132,
	    "ELIBEXEC": 133,
	    "ENOSYS": 52,
	    "ENOTEMPTY": 55,
	    "ENAMETOOLONG": 37,
	    "ELOOP": 32,
	    "EOPNOTSUPP": 138,
	    "EPFNOSUPPORT": 139,
	    "ECONNRESET": 15,
	    "ENOBUFS": 42,
	    "EAFNOSUPPORT": 5,
	    "EPROTOTYPE": 67,
	    "ENOTSOCK": 57,
	    "ENOPROTOOPT": 50,
	    "ESHUTDOWN": 140,
	    "ECONNREFUSED": 14,
	    "EADDRINUSE": 3,
	    "ECONNABORTED": 13,
	    "ENETUNREACH": 40,
	    "ENETDOWN": 38,
	    "ETIMEDOUT": 73,
	    "EHOSTDOWN": 142,
	    "EHOSTUNREACH": 23,
	    "EINPROGRESS": 26,
	    "EALREADY": 7,
	    "EDESTADDRREQ": 17,
	    "EMSGSIZE": 35,
	    "EPROTONOSUPPORT": 66,
	    "ESOCKTNOSUPPORT": 137,
	    "EADDRNOTAVAIL": 4,
	    "ENETRESET": 39,
	    "EISCONN": 30,
	    "ENOTCONN": 53,
	    "ETOOMANYREFS": 141,
	    "EUSERS": 136,
	    "EDQUOT": 19,
	    "ESTALE": 72,
	    "ENOTSUP": 138,
	    "ENOMEDIUM": 148,
	    "EILSEQ": 25,
	    "EOVERFLOW": 61,
	    "ECANCELED": 11,
	    "ENOTRECOVERABLE": 56,
	    "EOWNERDEAD": 62,
	    "ESTRPIPE": 135
	  };
	  embind_init_charCodes();
	  BindingError = Module["BindingError"] = extendError(Error, "BindingError");
	  InternalError = Module["InternalError"] = extendError(Error, "InternalError");
	  init_ClassHandle();
	  init_embind();
	  init_RegisteredPointer();
	  UnboundTypeError = Module["UnboundTypeError"] = extendError(Error, "UnboundTypeError");
	  init_emval();

	  function intArrayFromString(stringy, dontAddNull, length) {
	    var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
	    var u8array = new Array(len);
	    var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
	    if (dontAddNull) u8array.length = numBytesWritten;
	    return u8array;
	  }

	  function checkIncomingModuleAPI() {
	    ignoredModuleProp("fetchSettings");
	  }

	  var asmLibraryArg = {
	    "__syscall_fcntl64": ___syscall_fcntl64,
	    "__syscall_openat": ___syscall_openat,
	    "_embind_register_bigint": __embind_register_bigint,
	    "_embind_register_bool": __embind_register_bool,
	    "_embind_register_class": __embind_register_class,
	    "_embind_register_class_constructor": __embind_register_class_constructor,
	    "_embind_register_class_function": __embind_register_class_function,
	    "_embind_register_class_property": __embind_register_class_property,
	    "_embind_register_emval": __embind_register_emval,
	    "_embind_register_float": __embind_register_float,
	    "_embind_register_integer": __embind_register_integer,
	    "_embind_register_memory_view": __embind_register_memory_view,
	    "_embind_register_std_string": __embind_register_std_string,
	    "_embind_register_std_wstring": __embind_register_std_wstring,
	    "_embind_register_void": __embind_register_void,
	    "_emscripten_date_now": __emscripten_date_now,
	    "_emval_as": __emval_as,
	    "_emval_call_void_method": __emval_call_void_method,
	    "_emval_decref": __emval_decref,
	    "_emval_get_method_caller": __emval_get_method_caller,
	    "_emval_incref": __emval_incref,
	    "_emval_run_destructors": __emval_run_destructors,
	    "_emval_take_value": __emval_take_value,
	    "_gmtime_js": __gmtime_js,
	    "_localtime_js": __localtime_js,
	    "_mktime_js": __mktime_js,
	    "_tzset_js": __tzset_js,
	    "abort": _abort,
	    "emscripten_log": _emscripten_log,
	    "emscripten_resize_heap": _emscripten_resize_heap,
	    "environ_get": _environ_get,
	    "environ_sizes_get": _environ_sizes_get,
	    "fd_close": _fd_close,
	    "fd_fdstat_get": _fd_fdstat_get,
	    "fd_read": _fd_read,
	    "fd_seek": _fd_seek,
	    "fd_write": _fd_write,
	    "setTempRet0": _setTempRet0
	  };
	  createWasm();

	  Module["___wasm_call_ctors"] = createExportWrapper("__wasm_call_ctors");

	  var _free = Module["_free"] = createExportWrapper("free");

	  var _malloc = Module["_malloc"] = createExportWrapper("malloc");

	  var _strlen = Module["_strlen"] = createExportWrapper("strlen");

	  var ___errno_location = Module["___errno_location"] = createExportWrapper("__errno_location");

	  var ___getTypeName = Module["___getTypeName"] = createExportWrapper("__getTypeName");

	  Module["___embind_register_native_and_builtin_types"] = createExportWrapper("__embind_register_native_and_builtin_types");

	  var ___stdio_exit = Module["___stdio_exit"] = createExportWrapper("__stdio_exit");

	  var _emscripten_builtin_memalign = Module["_emscripten_builtin_memalign"] = createExportWrapper("emscripten_builtin_memalign");

	  var _emscripten_stack_init = Module["_emscripten_stack_init"] = function () {
	    return (_emscripten_stack_init = Module["_emscripten_stack_init"] = Module["asm"]["emscripten_stack_init"]).apply(null, arguments);
	  };

	  Module["_emscripten_stack_get_free"] = function () {
	    return (Module["_emscripten_stack_get_free"] = Module["asm"]["emscripten_stack_get_free"]).apply(null, arguments);
	  };

	  Module["_emscripten_stack_get_base"] = function () {
	    return (Module["_emscripten_stack_get_base"] = Module["asm"]["emscripten_stack_get_base"]).apply(null, arguments);
	  };

	  var _emscripten_stack_get_end = Module["_emscripten_stack_get_end"] = function () {
	    return (_emscripten_stack_get_end = Module["_emscripten_stack_get_end"] = Module["asm"]["emscripten_stack_get_end"]).apply(null, arguments);
	  };

	  Module["stackSave"] = createExportWrapper("stackSave");
	  Module["stackRestore"] = createExportWrapper("stackRestore");
	  Module["stackAlloc"] = createExportWrapper("stackAlloc");
	  Module["dynCall_ijiii"] = createExportWrapper("dynCall_ijiii");
	  Module["dynCall_viiijj"] = createExportWrapper("dynCall_viiijj");
	  Module["dynCall_jij"] = createExportWrapper("dynCall_jij");
	  Module["dynCall_jii"] = createExportWrapper("dynCall_jii");
	  Module["dynCall_jiji"] = createExportWrapper("dynCall_jiji");

	  Module["_ff_h264_cabac_tables"] = 112940;

	  unexportedRuntimeFunction("intArrayFromString", false);
	  unexportedRuntimeFunction("intArrayToString", false);
	  unexportedRuntimeFunction("ccall", false);
	  unexportedRuntimeFunction("cwrap", false);
	  unexportedRuntimeFunction("setValue", false);
	  unexportedRuntimeFunction("getValue", false);
	  unexportedRuntimeFunction("allocate", false);
	  unexportedRuntimeFunction("UTF8ArrayToString", false);
	  unexportedRuntimeFunction("UTF8ToString", false);
	  unexportedRuntimeFunction("stringToUTF8Array", false);
	  unexportedRuntimeFunction("stringToUTF8", false);
	  unexportedRuntimeFunction("lengthBytesUTF8", false);
	  unexportedRuntimeFunction("stackTrace", false);
	  unexportedRuntimeFunction("addOnPreRun", false);
	  unexportedRuntimeFunction("addOnInit", false);
	  unexportedRuntimeFunction("addOnPreMain", false);
	  unexportedRuntimeFunction("addOnExit", false);
	  unexportedRuntimeFunction("addOnPostRun", false);
	  unexportedRuntimeFunction("writeStringToMemory", false);
	  unexportedRuntimeFunction("writeArrayToMemory", false);
	  unexportedRuntimeFunction("writeAsciiToMemory", false);
	  unexportedRuntimeFunction("addRunDependency", true);
	  unexportedRuntimeFunction("removeRunDependency", true);
	  unexportedRuntimeFunction("FS_createFolder", false);
	  unexportedRuntimeFunction("FS_createPath", true);
	  unexportedRuntimeFunction("FS_createDataFile", true);
	  unexportedRuntimeFunction("FS_createPreloadedFile", true);
	  unexportedRuntimeFunction("FS_createLazyFile", true);
	  unexportedRuntimeFunction("FS_createLink", false);
	  unexportedRuntimeFunction("FS_createDevice", true);
	  unexportedRuntimeFunction("FS_unlink", true);
	  unexportedRuntimeFunction("getLEB", false);
	  unexportedRuntimeFunction("getFunctionTables", false);
	  unexportedRuntimeFunction("alignFunctionTables", false);
	  unexportedRuntimeFunction("registerFunctions", false);
	  unexportedRuntimeFunction("addFunction", false);
	  unexportedRuntimeFunction("removeFunction", false);
	  unexportedRuntimeFunction("prettyPrint", false);
	  unexportedRuntimeFunction("dynCall", false);
	  unexportedRuntimeFunction("getCompilerSetting", false);
	  unexportedRuntimeFunction("print", false);
	  unexportedRuntimeFunction("printErr", false);
	  unexportedRuntimeFunction("getTempRet0", false);
	  unexportedRuntimeFunction("setTempRet0", false);
	  unexportedRuntimeFunction("callMain", false);
	  unexportedRuntimeFunction("abort", false);
	  unexportedRuntimeFunction("keepRuntimeAlive", false);
	  unexportedRuntimeFunction("ptrToString", false);
	  unexportedRuntimeFunction("zeroMemory", false);
	  unexportedRuntimeFunction("stringToNewUTF8", false);
	  unexportedRuntimeFunction("emscripten_realloc_buffer", false);
	  unexportedRuntimeFunction("ENV", false);
	  unexportedRuntimeFunction("ERRNO_CODES", false);
	  unexportedRuntimeFunction("ERRNO_MESSAGES", false);
	  unexportedRuntimeFunction("setErrNo", false);
	  unexportedRuntimeFunction("inetPton4", false);
	  unexportedRuntimeFunction("inetNtop4", false);
	  unexportedRuntimeFunction("inetPton6", false);
	  unexportedRuntimeFunction("inetNtop6", false);
	  unexportedRuntimeFunction("readSockaddr", false);
	  unexportedRuntimeFunction("writeSockaddr", false);
	  unexportedRuntimeFunction("DNS", false);
	  unexportedRuntimeFunction("getHostByName", false);
	  unexportedRuntimeFunction("Protocols", false);
	  unexportedRuntimeFunction("Sockets", false);
	  unexportedRuntimeFunction("getRandomDevice", false);
	  unexportedRuntimeFunction("traverseStack", false);
	  unexportedRuntimeFunction("UNWIND_CACHE", false);
	  unexportedRuntimeFunction("convertPCtoSourceLocation", false);
	  unexportedRuntimeFunction("readAsmConstArgsArray", false);
	  unexportedRuntimeFunction("readAsmConstArgs", false);
	  unexportedRuntimeFunction("mainThreadEM_ASM", false);
	  unexportedRuntimeFunction("jstoi_q", false);
	  unexportedRuntimeFunction("jstoi_s", false);
	  unexportedRuntimeFunction("getExecutableName", false);
	  unexportedRuntimeFunction("listenOnce", false);
	  unexportedRuntimeFunction("autoResumeAudioContext", false);
	  unexportedRuntimeFunction("dynCallLegacy", false);
	  unexportedRuntimeFunction("getDynCaller", false);
	  unexportedRuntimeFunction("dynCall", false);
	  unexportedRuntimeFunction("setWasmTableEntry", false);
	  unexportedRuntimeFunction("getWasmTableEntry", false);
	  unexportedRuntimeFunction("handleException", false);
	  unexportedRuntimeFunction("runtimeKeepalivePush", false);
	  unexportedRuntimeFunction("runtimeKeepalivePop", false);
	  unexportedRuntimeFunction("callUserCallback", false);
	  unexportedRuntimeFunction("maybeExit", false);
	  unexportedRuntimeFunction("safeSetTimeout", false);
	  unexportedRuntimeFunction("asmjsMangle", false);
	  unexportedRuntimeFunction("asyncLoad", false);
	  unexportedRuntimeFunction("alignMemory", false);
	  unexportedRuntimeFunction("mmapAlloc", false);
	  unexportedRuntimeFunction("reallyNegative", false);
	  unexportedRuntimeFunction("unSign", false);
	  unexportedRuntimeFunction("reSign", false);
	  unexportedRuntimeFunction("formatString", false);
	  unexportedRuntimeFunction("PATH", false);
	  unexportedRuntimeFunction("PATH_FS", false);
	  unexportedRuntimeFunction("SYSCALLS", false);
	  unexportedRuntimeFunction("getSocketFromFD", false);
	  unexportedRuntimeFunction("getSocketAddress", false);
	  unexportedRuntimeFunction("JSEvents", false);
	  unexportedRuntimeFunction("registerKeyEventCallback", false);
	  unexportedRuntimeFunction("specialHTMLTargets", false);
	  unexportedRuntimeFunction("maybeCStringToJsString", false);
	  unexportedRuntimeFunction("findEventTarget", false);
	  unexportedRuntimeFunction("findCanvasEventTarget", false);
	  unexportedRuntimeFunction("getBoundingClientRect", false);
	  unexportedRuntimeFunction("fillMouseEventData", false);
	  unexportedRuntimeFunction("registerMouseEventCallback", false);
	  unexportedRuntimeFunction("registerWheelEventCallback", false);
	  unexportedRuntimeFunction("registerUiEventCallback", false);
	  unexportedRuntimeFunction("registerFocusEventCallback", false);
	  unexportedRuntimeFunction("fillDeviceOrientationEventData", false);
	  unexportedRuntimeFunction("registerDeviceOrientationEventCallback", false);
	  unexportedRuntimeFunction("fillDeviceMotionEventData", false);
	  unexportedRuntimeFunction("registerDeviceMotionEventCallback", false);
	  unexportedRuntimeFunction("screenOrientation", false);
	  unexportedRuntimeFunction("fillOrientationChangeEventData", false);
	  unexportedRuntimeFunction("registerOrientationChangeEventCallback", false);
	  unexportedRuntimeFunction("fillFullscreenChangeEventData", false);
	  unexportedRuntimeFunction("registerFullscreenChangeEventCallback", false);
	  unexportedRuntimeFunction("registerRestoreOldStyle", false);
	  unexportedRuntimeFunction("hideEverythingExceptGivenElement", false);
	  unexportedRuntimeFunction("restoreHiddenElements", false);
	  unexportedRuntimeFunction("setLetterbox", false);
	  unexportedRuntimeFunction("currentFullscreenStrategy", false);
	  unexportedRuntimeFunction("restoreOldWindowedStyle", false);
	  unexportedRuntimeFunction("softFullscreenResizeWebGLRenderTarget", false);
	  unexportedRuntimeFunction("doRequestFullscreen", false);
	  unexportedRuntimeFunction("fillPointerlockChangeEventData", false);
	  unexportedRuntimeFunction("registerPointerlockChangeEventCallback", false);
	  unexportedRuntimeFunction("registerPointerlockErrorEventCallback", false);
	  unexportedRuntimeFunction("requestPointerLock", false);
	  unexportedRuntimeFunction("fillVisibilityChangeEventData", false);
	  unexportedRuntimeFunction("registerVisibilityChangeEventCallback", false);
	  unexportedRuntimeFunction("registerTouchEventCallback", false);
	  unexportedRuntimeFunction("fillGamepadEventData", false);
	  unexportedRuntimeFunction("registerGamepadEventCallback", false);
	  unexportedRuntimeFunction("registerBeforeUnloadEventCallback", false);
	  unexportedRuntimeFunction("fillBatteryEventData", false);
	  unexportedRuntimeFunction("battery", false);
	  unexportedRuntimeFunction("registerBatteryEventCallback", false);
	  unexportedRuntimeFunction("setCanvasElementSize", false);
	  unexportedRuntimeFunction("getCanvasElementSize", false);
	  unexportedRuntimeFunction("demangle", false);
	  unexportedRuntimeFunction("demangleAll", false);
	  unexportedRuntimeFunction("jsStackTrace", false);
	  unexportedRuntimeFunction("stackTrace", false);
	  unexportedRuntimeFunction("getEnvStrings", false);
	  unexportedRuntimeFunction("checkWasiClock", false);
	  unexportedRuntimeFunction("writeI53ToI64", false);
	  unexportedRuntimeFunction("writeI53ToI64Clamped", false);
	  unexportedRuntimeFunction("writeI53ToI64Signaling", false);
	  unexportedRuntimeFunction("writeI53ToU64Clamped", false);
	  unexportedRuntimeFunction("writeI53ToU64Signaling", false);
	  unexportedRuntimeFunction("readI53FromI64", false);
	  unexportedRuntimeFunction("readI53FromU64", false);
	  unexportedRuntimeFunction("convertI32PairToI53", false);
	  unexportedRuntimeFunction("convertU32PairToI53", false);
	  unexportedRuntimeFunction("dlopenMissingError", false);
	  unexportedRuntimeFunction("setImmediateWrapped", false);
	  unexportedRuntimeFunction("clearImmediateWrapped", false);
	  unexportedRuntimeFunction("polyfillSetImmediate", false);
	  unexportedRuntimeFunction("uncaughtExceptionCount", false);
	  unexportedRuntimeFunction("exceptionLast", false);
	  unexportedRuntimeFunction("exceptionCaught", false);
	  unexportedRuntimeFunction("ExceptionInfo", false);
	  unexportedRuntimeFunction("exception_addRef", false);
	  unexportedRuntimeFunction("exception_decRef", false);
	  unexportedRuntimeFunction("Browser", false);
	  unexportedRuntimeFunction("setMainLoop", false);
	  unexportedRuntimeFunction("wget", false);
	  unexportedRuntimeFunction("FS", false);
	  unexportedRuntimeFunction("MEMFS", false);
	  unexportedRuntimeFunction("TTY", false);
	  unexportedRuntimeFunction("PIPEFS", false);
	  unexportedRuntimeFunction("SOCKFS", false);
	  unexportedRuntimeFunction("_setNetworkCallback", false);
	  unexportedRuntimeFunction("tempFixedLengthArray", false);
	  unexportedRuntimeFunction("miniTempWebGLFloatBuffers", false);
	  unexportedRuntimeFunction("heapObjectForWebGLType", false);
	  unexportedRuntimeFunction("heapAccessShiftForWebGLHeap", false);
	  unexportedRuntimeFunction("GL", false);
	  unexportedRuntimeFunction("emscriptenWebGLGet", false);
	  unexportedRuntimeFunction("computeUnpackAlignedImageSize", false);
	  unexportedRuntimeFunction("emscriptenWebGLGetTexPixelData", false);
	  unexportedRuntimeFunction("emscriptenWebGLGetUniform", false);
	  unexportedRuntimeFunction("webglGetUniformLocation", false);
	  unexportedRuntimeFunction("webglPrepareUniformLocationsBeforeFirstUse", false);
	  unexportedRuntimeFunction("webglGetLeftBracePos", false);
	  unexportedRuntimeFunction("emscriptenWebGLGetVertexAttrib", false);
	  unexportedRuntimeFunction("writeGLArray", false);
	  unexportedRuntimeFunction("AL", false);
	  unexportedRuntimeFunction("SDL_unicode", false);
	  unexportedRuntimeFunction("SDL_ttfContext", false);
	  unexportedRuntimeFunction("SDL_audio", false);
	  unexportedRuntimeFunction("SDL", false);
	  unexportedRuntimeFunction("SDL_gfx", false);
	  unexportedRuntimeFunction("GLUT", false);
	  unexportedRuntimeFunction("EGL", false);
	  unexportedRuntimeFunction("GLFW_Window", false);
	  unexportedRuntimeFunction("GLFW", false);
	  unexportedRuntimeFunction("GLEW", false);
	  unexportedRuntimeFunction("IDBStore", false);
	  unexportedRuntimeFunction("runAndAbortIfError", false);
	  unexportedRuntimeFunction("InternalError", false);
	  unexportedRuntimeFunction("BindingError", false);
	  unexportedRuntimeFunction("UnboundTypeError", false);
	  unexportedRuntimeFunction("PureVirtualError", false);
	  unexportedRuntimeFunction("init_embind", false);
	  unexportedRuntimeFunction("throwInternalError", false);
	  unexportedRuntimeFunction("throwBindingError", false);
	  unexportedRuntimeFunction("throwUnboundTypeError", false);
	  unexportedRuntimeFunction("ensureOverloadTable", false);
	  unexportedRuntimeFunction("exposePublicSymbol", false);
	  unexportedRuntimeFunction("replacePublicSymbol", false);
	  unexportedRuntimeFunction("extendError", false);
	  unexportedRuntimeFunction("createNamedFunction", false);
	  unexportedRuntimeFunction("registeredInstances", false);
	  unexportedRuntimeFunction("getBasestPointer", false);
	  unexportedRuntimeFunction("registerInheritedInstance", false);
	  unexportedRuntimeFunction("unregisterInheritedInstance", false);
	  unexportedRuntimeFunction("getInheritedInstance", false);
	  unexportedRuntimeFunction("getInheritedInstanceCount", false);
	  unexportedRuntimeFunction("getLiveInheritedInstances", false);
	  unexportedRuntimeFunction("registeredTypes", false);
	  unexportedRuntimeFunction("awaitingDependencies", false);
	  unexportedRuntimeFunction("typeDependencies", false);
	  unexportedRuntimeFunction("registeredPointers", false);
	  unexportedRuntimeFunction("registerType", false);
	  unexportedRuntimeFunction("whenDependentTypesAreResolved", false);
	  unexportedRuntimeFunction("embind_charCodes", false);
	  unexportedRuntimeFunction("embind_init_charCodes", false);
	  unexportedRuntimeFunction("readLatin1String", false);
	  unexportedRuntimeFunction("getTypeName", false);
	  unexportedRuntimeFunction("heap32VectorToArray", false);
	  unexportedRuntimeFunction("requireRegisteredType", false);
	  unexportedRuntimeFunction("getShiftFromSize", false);
	  unexportedRuntimeFunction("integerReadValueFromPointer", false);
	  unexportedRuntimeFunction("enumReadValueFromPointer", false);
	  unexportedRuntimeFunction("floatReadValueFromPointer", false);
	  unexportedRuntimeFunction("simpleReadValueFromPointer", false);
	  unexportedRuntimeFunction("runDestructors", false);
	  unexportedRuntimeFunction("new_", false);
	  unexportedRuntimeFunction("craftInvokerFunction", false);
	  unexportedRuntimeFunction("embind__requireFunction", false);
	  unexportedRuntimeFunction("tupleRegistrations", false);
	  unexportedRuntimeFunction("structRegistrations", false);
	  unexportedRuntimeFunction("genericPointerToWireType", false);
	  unexportedRuntimeFunction("constNoSmartPtrRawPointerToWireType", false);
	  unexportedRuntimeFunction("nonConstNoSmartPtrRawPointerToWireType", false);
	  unexportedRuntimeFunction("init_RegisteredPointer", false);
	  unexportedRuntimeFunction("RegisteredPointer", false);
	  unexportedRuntimeFunction("RegisteredPointer_getPointee", false);
	  unexportedRuntimeFunction("RegisteredPointer_destructor", false);
	  unexportedRuntimeFunction("RegisteredPointer_deleteObject", false);
	  unexportedRuntimeFunction("RegisteredPointer_fromWireType", false);
	  unexportedRuntimeFunction("runDestructor", false);
	  unexportedRuntimeFunction("releaseClassHandle", false);
	  unexportedRuntimeFunction("finalizationRegistry", false);
	  unexportedRuntimeFunction("detachFinalizer_deps", false);
	  unexportedRuntimeFunction("detachFinalizer", false);
	  unexportedRuntimeFunction("attachFinalizer", false);
	  unexportedRuntimeFunction("makeClassHandle", false);
	  unexportedRuntimeFunction("init_ClassHandle", false);
	  unexportedRuntimeFunction("ClassHandle", false);
	  unexportedRuntimeFunction("ClassHandle_isAliasOf", false);
	  unexportedRuntimeFunction("throwInstanceAlreadyDeleted", false);
	  unexportedRuntimeFunction("ClassHandle_clone", false);
	  unexportedRuntimeFunction("ClassHandle_delete", false);
	  unexportedRuntimeFunction("deletionQueue", false);
	  unexportedRuntimeFunction("ClassHandle_isDeleted", false);
	  unexportedRuntimeFunction("ClassHandle_deleteLater", false);
	  unexportedRuntimeFunction("flushPendingDeletes", false);
	  unexportedRuntimeFunction("delayFunction", false);
	  unexportedRuntimeFunction("setDelayFunction", false);
	  unexportedRuntimeFunction("RegisteredClass", false);
	  unexportedRuntimeFunction("shallowCopyInternalPointer", false);
	  unexportedRuntimeFunction("downcastPointer", false);
	  unexportedRuntimeFunction("upcastPointer", false);
	  unexportedRuntimeFunction("validateThis", false);
	  unexportedRuntimeFunction("char_0", false);
	  unexportedRuntimeFunction("char_9", false);
	  unexportedRuntimeFunction("makeLegalFunctionName", false);
	  unexportedRuntimeFunction("emval_handle_array", false);
	  unexportedRuntimeFunction("emval_free_list", false);
	  unexportedRuntimeFunction("emval_symbols", false);
	  unexportedRuntimeFunction("init_emval", false);
	  unexportedRuntimeFunction("count_emval_handles", false);
	  unexportedRuntimeFunction("get_first_emval", false);
	  unexportedRuntimeFunction("getStringOrSymbol", false);
	  unexportedRuntimeFunction("Emval", false);
	  unexportedRuntimeFunction("emval_newers", false);
	  unexportedRuntimeFunction("craftEmvalAllocator", false);
	  unexportedRuntimeFunction("emval_get_global", false);
	  unexportedRuntimeFunction("emval_methodCallers", false);
	  unexportedRuntimeFunction("emval_registeredMethods", false);
	  unexportedRuntimeFunction("warnOnce", false);
	  unexportedRuntimeFunction("stackSave", false);
	  unexportedRuntimeFunction("stackRestore", false);
	  unexportedRuntimeFunction("stackAlloc", false);
	  unexportedRuntimeFunction("AsciiToString", false);
	  unexportedRuntimeFunction("stringToAscii", false);
	  unexportedRuntimeFunction("UTF16ToString", false);
	  unexportedRuntimeFunction("stringToUTF16", false);
	  unexportedRuntimeFunction("lengthBytesUTF16", false);
	  unexportedRuntimeFunction("UTF32ToString", false);
	  unexportedRuntimeFunction("stringToUTF32", false);
	  unexportedRuntimeFunction("lengthBytesUTF32", false);
	  unexportedRuntimeFunction("allocateUTF8", false);
	  unexportedRuntimeFunction("allocateUTF8OnStack", false);
	  Module["writeStackCookie"] = writeStackCookie;
	  Module["checkStackCookie"] = checkStackCookie;
	  unexportedRuntimeSymbol("ALLOC_NORMAL", false);
	  unexportedRuntimeSymbol("ALLOC_STACK", false);
	  var calledRun;

	  function ExitStatus(status) {
	    this.name = "ExitStatus";
	    this.message = "Program terminated with exit(" + status + ")";
	    this.status = status;
	  }

	  dependenciesFulfilled = function runCaller() {
	    if (!calledRun) run();
	    if (!calledRun) dependenciesFulfilled = runCaller;
	  };

	  function stackCheckInit() {
	    _emscripten_stack_init();

	    writeStackCookie();
	  }

	  function run(args) {

	    if (runDependencies > 0) {
	      return;
	    }

	    stackCheckInit();
	    preRun();

	    if (runDependencies > 0) {
	      return;
	    }

	    function doRun() {
	      if (calledRun) return;
	      calledRun = true;
	      Module["calledRun"] = true;
	      if (ABORT) return;
	      initRuntime();
	      if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
	      assert(!Module["_main"], 'compiled without a main, but one is present. if you added it from JS, use Module["onRuntimeInitialized"]');
	      postRun();
	    }

	    if (Module["setStatus"]) {
	      Module["setStatus"]("Running...");
	      setTimeout(function () {
	        setTimeout(function () {
	          Module["setStatus"]("");
	        }, 1);
	        doRun();
	      }, 1);
	    } else {
	      doRun();
	    }

	    checkStackCookie();
	  }

	  Module["run"] = run;

	  if (Module["preInit"]) {
	    if (typeof Module["preInit"] == "function") Module["preInit"] = [Module["preInit"]];

	    while (Module["preInit"].length > 0) {
	      Module["preInit"].pop()();
	    }
	  }

	  run();
	  module.exports = Module;
	});

	var createWebGL = ((gl, openWebglAlignment) => {
	  var vertexShaderScript = ['attribute vec4 vertexPos;', 'attribute vec4 texturePos;', 'varying vec2 textureCoord;', 'void main()', '{', 'gl_Position = vertexPos;', 'textureCoord = texturePos.xy;', '}'].join('\n');
	  var fragmentShaderScript = ['precision highp float;', 'varying highp vec2 textureCoord;', 'uniform sampler2D ySampler;', 'uniform sampler2D uSampler;', 'uniform sampler2D vSampler;', 'const mat4 YUV2RGB = mat4', '(', '1.1643828125, 0, 1.59602734375, -.87078515625,', '1.1643828125, -.39176171875, -.81296875, .52959375,', '1.1643828125, 2.017234375, 0, -1.081390625,', '0, 0, 0, 1', ');', 'void main(void) {', 'highp float y = texture2D(ySampler,  textureCoord).r;', 'highp float u = texture2D(uSampler,  textureCoord).r;', 'highp float v = texture2D(vSampler,  textureCoord).r;', 'gl_FragColor = vec4(y, u, v, 1) * YUV2RGB;', '}'].join('\n');

	  if (openWebglAlignment) {
	    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
	  }

	  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	  gl.shaderSource(vertexShader, vertexShaderScript);
	  gl.compileShader(vertexShader);

	  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
	    console.log('Vertex shader failed to compile: ' + gl.getShaderInfoLog(vertexShader));
	  }

	  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	  gl.shaderSource(fragmentShader, fragmentShaderScript);
	  gl.compileShader(fragmentShader);

	  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
	    console.log('Fragment shader failed to compile: ' + gl.getShaderInfoLog(fragmentShader));
	  }

	  var program = gl.createProgram();
	  gl.attachShader(program, vertexShader);
	  gl.attachShader(program, fragmentShader);
	  gl.linkProgram(program);

	  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
	    console.log('Program failed to compile: ' + gl.getProgramInfoLog(program));
	  }

	  gl.useProgram(program); // initBuffers

	  var vertexPosBuffer = gl.createBuffer();
	  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer);
	  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1, 1, -1, 1, 1, -1, -1, -1]), gl.STATIC_DRAW);
	  var vertexPosRef = gl.getAttribLocation(program, 'vertexPos');
	  gl.enableVertexAttribArray(vertexPosRef);
	  gl.vertexAttribPointer(vertexPosRef, 2, gl.FLOAT, false, 0, 0);
	  var texturePosBuffer = gl.createBuffer();
	  gl.bindBuffer(gl.ARRAY_BUFFER, texturePosBuffer);
	  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1, 0, 0, 0, 1, 1, 0, 1]), gl.STATIC_DRAW);
	  var texturePosRef = gl.getAttribLocation(program, 'texturePos');
	  gl.enableVertexAttribArray(texturePosRef);
	  gl.vertexAttribPointer(texturePosRef, 2, gl.FLOAT, false, 0, 0);

	  function _initTexture(name, index) {
	    var textureRef = gl.createTexture();
	    gl.bindTexture(gl.TEXTURE_2D, textureRef);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	    gl.bindTexture(gl.TEXTURE_2D, null);
	    gl.uniform1i(gl.getUniformLocation(program, name), index);
	    return textureRef;
	  }

	  var yTextureRef = _initTexture('ySampler', 0);

	  var uTextureRef = _initTexture('uSampler', 1);

	  var vTextureRef = _initTexture('vSampler', 2);

	  return {
	    render: function (w, h, y, u, v) {
	      gl.viewport(0, 0, w, h);
	      gl.activeTexture(gl.TEXTURE0);
	      gl.bindTexture(gl.TEXTURE_2D, yTextureRef);
	      gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, w, h, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, y);
	      gl.activeTexture(gl.TEXTURE1);
	      gl.bindTexture(gl.TEXTURE_2D, uTextureRef);
	      gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, w / 2, h / 2, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, u);
	      gl.activeTexture(gl.TEXTURE2);
	      gl.bindTexture(gl.TEXTURE_2D, vTextureRef);
	      gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, w / 2, h / 2, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, v);
	      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	    },
	    destroy: function () {
	      try {
	        gl.deleteProgram(program);
	        gl.deleteBuffer(vertexPosBuffer);
	        gl.deleteBuffer(texturePosBuffer);
	        gl.deleteTexture(yTextureRef);
	        gl.deleteTexture(uTextureRef);
	        gl.deleteBuffer(vTextureRef);
	      } catch (e) {// console.error(e);
	      }
	    }
	  };
	});

	// 播放协议
	const PLAYER_PLAY_PROTOCOL = {
	  websocket: 0,
	  fetch: 1,
	  webrtc: 2
	};
	const DEMUX_TYPE = {
	  flv: 'flv',
	  m7s: 'm7s'
	};
	const FILE_SUFFIX = {
	  mp4: 'mp4',
	  webm: 'webm'
	};

	const DEFAULT_PLAYER_OPTIONS = {
	  videoBuffer: 1000,
	  //1000ms  1 second
	  videoBufferDelay: 1000,
	  // 1000ms
	  isResize: true,
	  isFullResize: false,
	  //
	  isFlv: false,
	  debug: false,
	  hotKey: false,
	  // 快捷键
	  loadingTimeout: 10,
	  // loading timeout
	  heartTimeout: 5,
	  // heart timeout
	  timeout: 10,
	  // second
	  loadingTimeoutReplay: true,
	  // loading timeout replay. default is true
	  heartTimeoutReplay: false,
	  // heart timeout replay.
	  loadingTimeoutReplayTimes: 3,
	  // loading timeout replay fail times
	  heartTimeoutReplayTimes: 3,
	  // heart timeout replay fail times
	  supportDblclickFullscreen: false,
	  // support double click toggle fullscreen
	  showBandwidth: false,
	  // show band width
	  keepScreenOn: false,
	  //
	  isNotMute: false,
	  //
	  hasAudio: true,
	  //  has audio
	  hasVideo: true,
	  // has video
	  operateBtns: {
	    fullscreen: false,
	    screenshot: false,
	    play: false,
	    audio: false,
	    record: false
	  },
	  controlAutoHide: false,
	  // control auto hide
	  hasControl: false,
	  loadingText: '',
	  // loading Text
	  background: '',
	  decoder: 'decoder.js',
	  url: '',
	  // play url
	  rotate: 0,
	  //
	  // text: '',
	  forceNoOffscreen: true,
	  // 默认是不采用
	  hiddenAutoPause: false,
	  //
	  protocol: PLAYER_PLAY_PROTOCOL.fetch,
	  demuxType: DEMUX_TYPE.flv,
	  // demux type
	  useWCS: false,
	  //
	  wcsUseVideoRender: true,
	  // 默认设置为true
	  useMSE: false,
	  //
	  useOffscreen: false,
	  //
	  autoWasm: true,
	  // 自动降级到 wasm 模式
	  wasmDecodeErrorReplay: true,
	  // 解码失败重新播放。
	  openWebglAlignment: false,
	  //  https://github.com/langhuihui/jessibuca/issues/152
	  wasmDecodeAudioSyncVideo: false,
	  // wasm 解码之后音视频同步
	  recordType: FILE_SUFFIX.webm
	};
	const WORKER_CMD_TYPE = {
	  init: 'init',
	  initVideo: 'initVideo',
	  render: 'render',
	  playAudio: 'playAudio',
	  initAudio: 'initAudio',
	  kBps: 'kBps',
	  decode: 'decode',
	  audioCode: 'audioCode',
	  videoCode: 'videoCode',
	  wasmError: 'wasmError'
	};
	const MEDIA_TYPE = {
	  audio: 1,
	  video: 2
	};
	const WORKER_SEND_TYPE = {
	  init: 'init',
	  decode: 'decode',
	  audioDecode: 'audioDecode',
	  videoDecode: 'videoDecode',
	  close: 'close',
	  updateConfig: 'updateConfig'
	}; //
	const ENCODED_VIDEO_TYPE = {
	  key: 'key',
	  delta: 'delta'
	};

	var screenfull = createCommonjsModule(function (module) {
	/*!
	* screenfull
	* v5.1.0 - 2020-12-24
	* (c) Sindre Sorhus; MIT License
	*/
	(function () {

		var document = typeof window !== 'undefined' && typeof window.document !== 'undefined' ? window.document : {};
		var isCommonjs = module.exports;

		var fn = (function () {
			var val;

			var fnMap = [
				[
					'requestFullscreen',
					'exitFullscreen',
					'fullscreenElement',
					'fullscreenEnabled',
					'fullscreenchange',
					'fullscreenerror'
				],
				// New WebKit
				[
					'webkitRequestFullscreen',
					'webkitExitFullscreen',
					'webkitFullscreenElement',
					'webkitFullscreenEnabled',
					'webkitfullscreenchange',
					'webkitfullscreenerror'

				],
				// Old WebKit
				[
					'webkitRequestFullScreen',
					'webkitCancelFullScreen',
					'webkitCurrentFullScreenElement',
					'webkitCancelFullScreen',
					'webkitfullscreenchange',
					'webkitfullscreenerror'

				],
				[
					'mozRequestFullScreen',
					'mozCancelFullScreen',
					'mozFullScreenElement',
					'mozFullScreenEnabled',
					'mozfullscreenchange',
					'mozfullscreenerror'
				],
				[
					'msRequestFullscreen',
					'msExitFullscreen',
					'msFullscreenElement',
					'msFullscreenEnabled',
					'MSFullscreenChange',
					'MSFullscreenError'
				]
			];

			var i = 0;
			var l = fnMap.length;
			var ret = {};

			for (; i < l; i++) {
				val = fnMap[i];
				if (val && val[1] in document) {
					for (i = 0; i < val.length; i++) {
						ret[fnMap[0][i]] = val[i];
					}
					return ret;
				}
			}

			return false;
		})();

		var eventNameMap = {
			change: fn.fullscreenchange,
			error: fn.fullscreenerror
		};

		var screenfull = {
			request: function (element, options) {
				return new Promise(function (resolve, reject) {
					var onFullScreenEntered = function () {
						this.off('change', onFullScreenEntered);
						resolve();
					}.bind(this);

					this.on('change', onFullScreenEntered);

					element = element || document.documentElement;

					var returnPromise = element[fn.requestFullscreen](options);

					if (returnPromise instanceof Promise) {
						returnPromise.then(onFullScreenEntered).catch(reject);
					}
				}.bind(this));
			},
			exit: function () {
				return new Promise(function (resolve, reject) {
					if (!this.isFullscreen) {
						resolve();
						return;
					}

					var onFullScreenExit = function () {
						this.off('change', onFullScreenExit);
						resolve();
					}.bind(this);

					this.on('change', onFullScreenExit);

					var returnPromise = document[fn.exitFullscreen]();

					if (returnPromise instanceof Promise) {
						returnPromise.then(onFullScreenExit).catch(reject);
					}
				}.bind(this));
			},
			toggle: function (element, options) {
				return this.isFullscreen ? this.exit() : this.request(element, options);
			},
			onchange: function (callback) {
				this.on('change', callback);
			},
			onerror: function (callback) {
				this.on('error', callback);
			},
			on: function (event, callback) {
				var eventName = eventNameMap[event];
				if (eventName) {
					document.addEventListener(eventName, callback, false);
				}
			},
			off: function (event, callback) {
				var eventName = eventNameMap[event];
				if (eventName) {
					document.removeEventListener(eventName, callback, false);
				}
			},
			raw: fn
		};

		if (!fn) {
			if (isCommonjs) {
				module.exports = {isEnabled: false};
			} else {
				window.screenfull = {isEnabled: false};
			}

			return;
		}

		Object.defineProperties(screenfull, {
			isFullscreen: {
				get: function () {
					return Boolean(document[fn.fullscreenElement]);
				}
			},
			element: {
				enumerable: true,
				get: function () {
					return document[fn.fullscreenElement];
				}
			},
			isEnabled: {
				enumerable: true,
				get: function () {
					// Coerce to boolean in case of old WebKit
					return Boolean(document[fn.fullscreenEnabled]);
				}
			}
		});

		if (isCommonjs) {
			module.exports = screenfull;
		} else {
			window.screenfull = screenfull;
		}
	})();
	});
	screenfull.isEnabled;

	(() => {
	  try {
	    if (typeof WebAssembly === "object" && typeof WebAssembly.instantiate === "function") {
	      const module = new WebAssembly.Module(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));
	      if (module instanceof WebAssembly.Module) return new WebAssembly.Instance(module) instanceof WebAssembly.Instance;
	    }
	  } catch (e) {}

	  return false;
	})();
	function formatVideoDecoderConfigure(avcC) {
	  let codecArray = avcC.subarray(1, 4);
	  let codecString = "avc1.";

	  for (let j = 0; j < 3; j++) {
	    let h = codecArray[j].toString(16);

	    if (h.length < 2) {
	      h = "0" + h;
	    }

	    codecString += h;
	  }

	  return {
	    codec: codecString,
	    description: avcC
	  };
	}

	if (!Date.now) Date.now = function () {
	  return new Date().getTime();
	};

	decoder.postRun = function () {
	  var buffer = [];
	  var tempAudioBuffer = [];
	  var wcsVideoDecoder = {};

	  if ("VideoEncoder" in self) {
	    wcsVideoDecoder = {
	      hasInit: false,
	      isEmitInfo: false,
	      offscreenCanvas: null,
	      offscreenCanvasCtx: null,
	      decoder: new VideoDecoder({
	        output: function (videoFrame) {
	          if (!wcsVideoDecoder.isEmitInfo) {
	            decoder$1.opt.debug && console.log('Jessibuca: [worker] Webcodecs Video Decoder initSize');
	            postMessage({
	              cmd: WORKER_CMD_TYPE.initVideo,
	              w: videoFrame.codedWidth,
	              h: videoFrame.codedHeight
	            });
	            wcsVideoDecoder.isEmitInfo = true;
	            wcsVideoDecoder.offscreenCanvas = new OffscreenCanvas(videoFrame.codedWidth, videoFrame.codedHeight);
	            wcsVideoDecoder.offscreenCanvasCtx = wcsVideoDecoder.offscreenCanvas.getContext("2d");
	          }

	          wcsVideoDecoder.offscreenCanvasCtx.drawImage(videoFrame, 0, 0, videoFrame.codedWidth, videoFrame.codedHeight);
	          let image_bitmap = wcsVideoDecoder.offscreenCanvas.transferToImageBitmap();
	          postMessage({
	            cmd: WORKER_CMD_TYPE.render,
	            buffer: image_bitmap,
	            delay: decoder$1.delay,
	            ts: 0
	          }, [image_bitmap]);
	          setTimeout(function () {
	            if (videoFrame.close) {
	              videoFrame.close();
	            } else {
	              videoFrame.destroy();
	            }
	          }, 100);
	        },
	        error: function (error) {
	          console.error(error);
	        }
	      }),
	      decode: function (payload, ts) {
	        const isIFrame = payload[0] >> 4 === 1;

	        if (!wcsVideoDecoder.hasInit) {
	          if (isIFrame && payload[1] === 0) {
	            const videoCodec = payload[0] & 0x0F;
	            decoder$1.setVideoCodec(videoCodec);
	            const config = formatVideoDecoderConfigure(payload.slice(5));
	            wcsVideoDecoder.decoder.configure(config);
	            wcsVideoDecoder.hasInit = true;
	          }
	        } else {
	          const chunk = new EncodedVideoChunk({
	            data: payload.slice(5),
	            timestamp: ts,
	            type: isIFrame ? ENCODED_VIDEO_TYPE.key : ENCODED_VIDEO_TYPE.delta
	          });
	          wcsVideoDecoder.decoder.decode(chunk);
	        }
	      },

	      reset() {
	        wcsVideoDecoder.hasInit = false;
	        wcsVideoDecoder.isEmitInfo = false;
	        wcsVideoDecoder.offscreenCanvas = null;
	        wcsVideoDecoder.offscreenCanvasCtx = null;
	      }

	    };
	  }

	  var decoder$1 = {
	    opt: {
	      debug: DEFAULT_PLAYER_OPTIONS.debug,
	      useOffscreen: DEFAULT_PLAYER_OPTIONS.useOffscreen,
	      useWCS: DEFAULT_PLAYER_OPTIONS.useWCS,
	      videoBuffer: DEFAULT_PLAYER_OPTIONS.videoBuffer,
	      openWebglAlignment: DEFAULT_PLAYER_OPTIONS.openWebglAlignment,
	      videoBufferDelay: DEFAULT_PLAYER_OPTIONS.videoBufferDelay
	    },
	    useOffscreen: function () {
	      return decoder$1.opt.useOffscreen && typeof OffscreenCanvas != 'undefined';
	    },
	    initAudioPlanar: function (channels, samplerate) {
	      postMessage({
	        cmd: WORKER_CMD_TYPE.initAudio,
	        sampleRate: samplerate,
	        channels: channels
	      });
	      var outputArray = [];
	      var remain = 0;

	      this.playAudioPlanar = function (data, len, ts) {
	        var frameCount = len;
	        var origin = [];
	        var start = 0;

	        for (var channel = 0; channel < 2; channel++) {
	          var fp = decoder.HEAPU32[(data >> 2) + channel] >> 2;
	          origin[channel] = decoder.HEAPF32.subarray(fp, fp + frameCount);
	        }

	        if (remain) {
	          len = 1024 - remain;

	          if (frameCount >= len) {
	            outputArray[0] = Float32Array.of(...tempAudioBuffer[0], ...origin[0].subarray(0, len));

	            if (channels == 2) {
	              outputArray[1] = Float32Array.of(...tempAudioBuffer[1], ...origin[1].subarray(0, len));
	            }

	            postMessage({
	              cmd: WORKER_CMD_TYPE.playAudio,
	              buffer: outputArray,
	              ts
	            }, outputArray.map(x => x.buffer));
	            start = len;
	            frameCount -= len;
	          } else {
	            remain += frameCount;
	            tempAudioBuffer[0] = Float32Array.of(...tempAudioBuffer[0], ...origin[0]);

	            if (channels == 2) {
	              tempAudioBuffer[1] = Float32Array.of(...tempAudioBuffer[1], ...origin[1]);
	            }

	            return;
	          }
	        }

	        for (remain = frameCount; remain >= 1024; remain -= 1024) {
	          outputArray[0] = origin[0].slice(start, start += 1024);

	          if (channels == 2) {
	            outputArray[1] = origin[1].slice(start - 1024, start);
	          }

	          postMessage({
	            cmd: WORKER_CMD_TYPE.playAudio,
	            buffer: outputArray,
	            ts
	          }, outputArray.map(x => x.buffer));
	        }

	        if (remain) {
	          tempAudioBuffer[0] = origin[0].slice(start);

	          if (channels == 2) {
	            tempAudioBuffer[1] = origin[1].slice(start);
	          }
	        }
	      };
	    },
	    setVideoCodec: function (code) {
	      postMessage({
	        cmd: WORKER_CMD_TYPE.videoCode,
	        code
	      });
	    },
	    setAudioCodec: function (code) {
	      postMessage({
	        cmd: WORKER_CMD_TYPE.audioCode,
	        code
	      });
	    },
	    setVideoSize: function (w, h) {
	      postMessage({
	        cmd: WORKER_CMD_TYPE.initVideo,
	        w: w,
	        h: h
	      });
	      var size = w * h;
	      var qsize = size >> 2;

	      if (decoder$1.useOffscreen()) {
	        this.offscreenCanvas = new OffscreenCanvas(w, h);
	        this.offscreenCanvasGL = this.offscreenCanvas.getContext("webgl");
	        this.webglObj = createWebGL(this.offscreenCanvasGL, decoder$1.opt.openWebglAlignment);

	        this.draw = function (ts, y, u, v) {
	          const yData = decoder.HEAPU8.subarray(y, y + size);
	          const uData = decoder.HEAPU8.subarray(u, u + qsize);
	          const vData = decoder.HEAPU8.subarray(v, v + qsize); // if (isGreenYUV(Uint8Array.from(yData))) {
	          //     decoder.opt.debug && console.log('Jessibuca: [worker]: draw offscreenCanvas is green yuv');
	          //     return
	          // }

	          this.webglObj.render(w, h, yData, uData, vData);
	          let image_bitmap = this.offscreenCanvas.transferToImageBitmap();
	          postMessage({
	            cmd: WORKER_CMD_TYPE.render,
	            buffer: image_bitmap,
	            delay: this.delay,
	            ts
	          }, [image_bitmap]);
	        };
	      } else {
	        this.draw = function (ts, y, u, v) {
	          const yData = Uint8Array.from(decoder.HEAPU8.subarray(y, y + size));
	          const uData = Uint8Array.from(decoder.HEAPU8.subarray(u, u + qsize));
	          const vData = Uint8Array.from(decoder.HEAPU8.subarray(v, v + qsize)); // if (isGreenYUV(yData)) {
	          //     decoder.opt.debug && console.log('Jessibuca: [worker]: draw is green yuv');
	          //     return
	          // }

	          const outputArray = [yData, uData, vData];
	          postMessage({
	            cmd: WORKER_CMD_TYPE.render,
	            output: outputArray,
	            delay: this.delay,
	            ts
	          }, outputArray.map(x => x.buffer));
	        };
	      }
	    },
	    getDelay: function (timestamp) {
	      if (!timestamp) {
	        return -1;
	      }

	      if (!this.firstTimestamp) {
	        this.firstTimestamp = timestamp;
	        this.startTimestamp = Date.now();
	        this.delay = -1;
	      } else {
	        if (timestamp) {
	          const localTimestamp = Date.now() - this.startTimestamp;
	          const timeTimestamp = timestamp - this.firstTimestamp;

	          if (localTimestamp >= timeTimestamp) {
	            this.delay = localTimestamp - timeTimestamp;
	          } else {
	            this.delay = timeTimestamp - localTimestamp;
	          }
	        }
	      }

	      return this.delay;
	    },
	    resetDelay: function () {
	      this.firstTimestamp = null;
	      this.startTimestamp = null;
	      this.delay = -1;
	    },
	    init: function () {
	      decoder$1.opt.debug && console.log('Jessibuca: [worker] init');

	      const _doDecode = data => {
	        // decoder.opt.debug && console.log('Jessibuca: [worker]: _doDecode');
	        if (decoder$1.opt.useWCS && decoder$1.useOffscreen() && data.type === MEDIA_TYPE.video && wcsVideoDecoder.decode) {
	          wcsVideoDecoder.decode(data.payload, data.ts);
	        } else {
	          // decoder.opt.debug && console.log('Jessibuca: [worker]: _doDecode  wasm');
	          data.decoder.decode(data.payload, data.ts);
	        }
	      };

	      const loop = () => {
	        if (buffer.length) {
	          if (this.dropping) {
	            // // dropping
	            data = buffer.shift(); //

	            if (data.type === MEDIA_TYPE.audio && data.payload[1] === 0) {
	              _doDecode(data);
	            }

	            while (!data.isIFrame && buffer.length) {
	              // dropping
	              data = buffer.shift(); //

	              if (data.type === MEDIA_TYPE.audio && data.payload[1] === 0) {
	                _doDecode(data);
	              }
	            }

	            if (data.isIFrame) {
	              this.dropping = false;

	              _doDecode(data);
	            }
	          } else {
	            var data = buffer[0];

	            if (this.getDelay(data.ts) === -1) {
	              // decoder.opt.debug && console.log('Jessibuca: [worker]: common dumex delay is -1');
	              buffer.shift();

	              _doDecode(data);
	            } else if (this.delay > decoder$1.opt.videoBuffer + decoder$1.opt.videoBufferDelay) {
	              // decoder.opt.debug && console.log('Jessibuca: [worker]:', `delay is ${this.delay}, set dropping is true`);
	              this.resetDelay();
	              this.dropping = true;
	            } else {
	              while (buffer.length) {
	                data = buffer[0];

	                if (this.getDelay(data.ts) > decoder$1.opt.videoBuffer) {
	                  // decoder.opt.debug && console.log('Jessibuca: [worker]:', `delay is ${this.delay}, decode`);
	                  buffer.shift();

	                  _doDecode(data);
	                } else {
	                  // decoder.opt.debug && console.log('Jessibuca: [worker]:', `delay is ${this.delay},opt.videoBuffer is ${decoder.opt.videoBuffer}`);
	                  break;
	                }
	              }
	            }
	          }
	        }
	      };

	      this.stopId = setInterval(loop, 10);
	    },
	    close: function () {
	      decoder$1.opt.debug && console.log('Jessibuca: [worker]: close');
	      clearInterval(this.stopId);
	      this.stopId = null;
	      audioDecoder.clear && audioDecoder.clear();
	      videoDecoder.clear && videoDecoder.clear();
	      wcsVideoDecoder.reset && wcsVideoDecoder.reset();
	      this.firstTimestamp = null;
	      this.startTimestamp = null;
	      this.delay = -1;
	      this.dropping = false;

	      if (this.webglObj) {
	        this.webglObj.destroy();
	        this.offscreenCanvas = null;
	        this.offscreenCanvasGL = null;
	        this.offscreenCanvasCtx = null;
	      }

	      buffer = [];
	      tempAudioBuffer = [];
	      delete this.playAudioPlanar;
	      delete this.draw;
	    },
	    pushBuffer: function (bufferData, options) {
	      // 音频
	      if (options.type === MEDIA_TYPE.audio) {
	        buffer.push({
	          ts: options.ts,
	          payload: bufferData,
	          decoder: audioDecoder,
	          type: MEDIA_TYPE.audio
	        });
	      } else if (options.type === MEDIA_TYPE.video) {
	        buffer.push({
	          ts: options.ts,
	          payload: bufferData,
	          decoder: videoDecoder,
	          type: MEDIA_TYPE.video,
	          isIFrame: options.isIFrame
	        });
	      }
	    }
	  };
	  var audioDecoder = new decoder.AudioDecoder(decoder$1);
	  var videoDecoder = new decoder.VideoDecoder(decoder$1);
	  postMessage({
	    cmd: WORKER_SEND_TYPE.init
	  });

	  self.onmessage = function (event) {
	    var msg = event.data;

	    switch (msg.cmd) {
	      case WORKER_SEND_TYPE.init:
	        try {
	          decoder$1.opt = Object.assign(decoder$1.opt, JSON.parse(msg.opt));
	        } catch (e) {}

	        audioDecoder.sample_rate = msg.sampleRate;
	        decoder$1.init();
	        break;

	      case WORKER_SEND_TYPE.decode:
	        decoder$1.pushBuffer(msg.buffer, msg.options);
	        break;

	      case WORKER_SEND_TYPE.audioDecode:
	        audioDecoder.decode(msg.buffer, msg.ts);
	        break;

	      case WORKER_SEND_TYPE.videoDecode:
	        videoDecoder.decode(msg.buffer, msg.ts);
	        break;

	      case WORKER_SEND_TYPE.close:
	        decoder$1.close();
	        break;

	      case WORKER_SEND_TYPE.updateConfig:
	        decoder$1.opt[msg.key] = msg.value;
	        break;
	    }
	  };
	};

}));
//# sourceMappingURL=decoder.js.map
