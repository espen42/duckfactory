'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _functionArgNames = require('./functionArgNames');

var _functionArgNames2 = _interopRequireDefault(_functionArgNames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var takenActionNames = new _set2.default();
var checkActionName = function checkActionName(actionName) {
    if (typeof actionName !== 'string' && typeof actionName !== 'number') {
        throw Error("Action name can't be " + (0, _stringify2.default)(actionName) + " (" + (typeof actionName === 'undefined' ? 'undefined' : (0, _typeof3.default)(actionName)) + "). " + "Only strings or numbers are allowed.");
    }
    if (takenActionNames.has(actionName)) {
        throw Error("Action name " + (0, _stringify2.default)(actionName) + " is already taken. Action names must be unique. " + "Existing names are: " + (0, _stringify2.default)(takenActionNames));
    }
    takenActionNames.add(actionName);
};

var checkActionArgumentNames = function checkActionArgumentNames(actionArgumentNames, actionType) {
    actionArgumentNames.forEach(function (name) {
        if (name === "type") {
            throw Error("Illegal action argument name for action '" + actionType + "' - an argument can't be called " + "'type', since that's internally reserved.");
        }
    });
};

exports.default = function (actionType) {
    var actionArgumentNames = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var func = arguments[2];

    var healthy = true;

    checkActionName(actionType);

    if (func != null) {
        var reducerArgs = _functionArgNames2.default.getArgs(func);

        checkActionArgumentNames(actionArgumentNames, actionType);

        if (reducerArgs[0] != "state") {
            console.warn("Possibly flawed action '" + actionType + "': the reducer function should take state as its first argument");
            healthy = false;
        }

        if (reducerArgs.length > 1) {
            if (reducerArgs[1].substr(0, 4) === "_ref") {
                var refArgs = _functionArgNames2.default.getRefs(func, reducerArgs[1]);
                if (refArgs == null) {
                    console.warn("Possibly flawed action '" + actionType + "': the reducer function expects a deconstructed object (eg. {name1, name2, name3} ) " + "as its second argument, but this seems empty");
                    healthy = false;
                }
            }
        }
    }

    return healthy;
};

/*
    Check for non-deconstructed action argument?

 } else if (reducerArgs[1] !== "action") {
 console.warn("Possibly flawed reducer for action " + actionType +
 ": the " + funcType + " expected 'action' as the name of its " + nth + " argument");
 healthy = false;
 }
 }
 }

 //*/