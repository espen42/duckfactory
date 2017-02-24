"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof2 = require("babel-runtime/helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _set = require("babel-runtime/core-js/set");

var _set2 = _interopRequireDefault(_set);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var validArgPattern = "^(?!(?:" + "do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|" + "class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|" + "finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$)" + "[$A-Z\\_a-z][$A-Z\\_a-z0-9]*$";
var validArgNames = new RegExp(validArgPattern);

var takenActionNames = new _set2.default();
var checkActionName = function checkActionName(actionName) {
    console.log("Checking actionName:", actionName);
    if (typeof actionName !== 'string' && typeof actionName !== 'number') {
        throw Error("Action name can't be " + (0, _stringify2.default)(actionName) + " (" + (typeof actionName === "undefined" ? "undefined" : (0, _typeof3.default)(actionName)) + "). " + "Only strings or numbers are allowed.");
    }
    if (takenActionNames.has(actionName)) {
        throw Error("Action name " + (0, _stringify2.default)(actionName) + " is already taken. Action names must be unique. " + "Existing names are: " + (0, _stringify2.default)(takenActionNames));
    }
    takenActionNames.add(actionName);
};

// Credit: https://davidwalsh.name/javascript-arguments
var getFunctionArgNames = function getFunctionArgNames(func) {
    var args = func.toString().match(/function\s.*?\(([^)]*)\)/)[1];
    return args.split(',').map(function (arg) {
        return arg.replace(/\/\*.*\*\//, '').trim();
    }).filter(function (arg) {
        return arg;
    });
};

var getFunctionRefsNames = function getFunctionRefsNames(func, ref) {
    var pattern = new RegExp(ref + "\\.([a-zA-Z0-9_]+)[\\,\\;]", 'g');
    var args = func.toString().match(pattern);
    return args && args.map(function (arg) {
        return arg.slice(ref.length + 1, arg.length - 1);
    });
};

var checkActionArgumentNames = function checkActionArgumentNames(actionArgumentNames, actionType) {
    var acceptedNames = new _set2.default();
    actionArgumentNames.forEach(function (name) {
        if (name === "type") {
            throw Error("Illegal action argument name for action '" + actionType + "' - an argument can't be called " + "'type', since that's internally reserved.");
        }
        if (acceptedNames.has(name)) {
            throw Error("Duplicate action argument name '" + name + "' for action '" + actionType + "'.");
        }
        if (name.match(validArgNames) == null) {
            throw Error("Illegal action argument name for action '" + actionType + "' - an argument can't be called '" + name + "'.");
        }
        acceptedNames.add(name);
    });
};

// The action can have arguments that the reducer doesn't use. But the action must have all arguments
// that the reducer uses!
var checkHealthy = function checkHealthy(actionType, argumentNames, func, functionIsReducer) {
    var healthy = true;

    checkActionName(actionType);

    var actionArgumentNames = argumentNames || [];
    if (func != null) {
        var reducerArgs = getFunctionArgNames(func);
        //console.log("reducerFunction args:", JSON.stringify(reducerArgs));

        checkActionArgumentNames(actionArgumentNames, actionType);

        var argIndex = functionIsReducer ? 1 : 0;
        var nth = functionIsReducer ? "second" : "first";
        var funcType = functionIsReducer ? "reducer function" : "saga generator";

        if (functionIsReducer && reducerArgs[0] != "state") {
            console.warn("Possibly flawed action '" + actionType + "': the reducer function should take state as its first argument");
            healthy = false;
        }

        if (reducerArgs.length > argIndex) {
            if (reducerArgs[argIndex].substr(0, 4) === "_ref") {
                var refArgs = getFunctionRefsNames(func, reducerArgs[argIndex]);
                //console.log("refArgs:", refArgs);
                if (refArgs == null) {
                    console.warn("Possibly flawed action '" + actionType + "': the " + funcType + " expects a deconstructed object ( {name1, name2, name3} etc) as its " + nth + " argument, but this seems empty");
                    healthy = false;
                } else {
                    refArgs.forEach(function (arg) {
                        if (actionArgumentNames.indexOf(arg) === -1) {
                            throw Error("Missing action arguments for action '" + actionType + "': the " + funcType + " expects an action argument '" + arg + "', but this is not among the " + "arguments names of the action (" + (0, _stringify2.default)(actionArgumentNames) + ").");
                        }
                    });
                }
            } else if (reducerArgs[argIndex] !== "action") {
                console.warn("Possibly flawed reducer for action " + actionType + ": the " + funcType + " expected 'action' as the name of its " + nth + " argument");
                healthy = false;
            }
        }
    }

    return healthy;
};

exports.default = {
    reducerDuck: function reducerDuck(actionType, actionArgumentNames, sagaGenerator) {
        return checkHealthy(actionType, actionArgumentNames, sagaGenerator, true);
    },
    sagaGoose: function sagaGoose(actionType, actionArgumentNames, sagaGenerator) {
        return checkHealthy(actionType, actionArgumentNames, sagaGenerator, false);
    }
};