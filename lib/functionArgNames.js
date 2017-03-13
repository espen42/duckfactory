'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/** Returns an array with the names of the direct names of a function (e.g. for the function a = (b, c) => {}
 *  getFunctionArgNames(a) will return ["b", "c"]).
 *
 *  Credit: https://davidwalsh.name/javascript-arguments
 */
var getFunctionArgNames = function getFunctionArgNames(func) {
    var args = func.toString().match(/function\s.*?\(([^)]*)\)/)[1];
    return args.split(',').map(function (arg) {
        return arg.replace(/\/\*.*\*\//, '').trim();
    }).filter(function (arg) {
        return arg;
    });
};

/** Returns an array with the names of the INDIRECT names of the fields of a function's argument object
 *  (e.g. for the function a = (b, c) => {}
  */
var getFunctionRefsNames = function getFunctionRefsNames(func, ref) {
    var funcStr = func.toString();

    // Isolates and removes the intro, expecting "function <name>(<variables>) { var" or returning null
    var prePattern = new RegExp("function .*? ?\\(.*?\\)\\s*\\{\\s*var ", 'g');
    var promisingIntro = funcStr.match(prePattern);
    if (promisingIntro == null || promisingIntro.length === 0) {
        return null;
    }
    var promisingBody = funcStr.substr(promisingIntro[0].length);

    // Isolates and keeps everything before the first semicolon or closing curly bracket, or returning null
    var postPattern = new RegExp("[\\s\\S]*?[;\\}]", 'g');
    var singledOutIntro = promisingBody.match(postPattern);
    if (singledOutIntro == null || singledOutIntro.length === 0) {
        return null;
    }
    var singledOutBody = singledOutIntro[0];

    // Keeps all instances of "X = <ref>.X", and makes and returns a list of all X'es.
    var pattern = new RegExp("([a-zA-Z0-9_]+?) ?= ?" + ref + "\\.([a-zA-Z0-9_]+)[\\,\\;]?", 'g');
    var matches = singledOutBody.match(pattern);
    return matches && matches.map(function (arg) {
        return arg.split("=")[1].trim().split(".")[1].split(",")[0].split(";")[0];
    });
};

exports.default = {
    getArgs: getFunctionArgNames,
    getRefs: getFunctionRefsNames
};