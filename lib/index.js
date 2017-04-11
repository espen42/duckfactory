'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.makeReducer = undefined;

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _check = require('./check');

var _check2 = _interopRequireDefault(_check);

var _actionFields = require('./actionFields');

var _actionFields2 = _interopRequireDefault(_actionFields);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var canLog = window && window.console;

// --------------------------------------------------------------------  General helpers


var buildPrefix = function buildPrefix(prefix) {
    if (prefix != null && typeof prefix !== 'string') {
        throw Error("Prefix must be null/undefined, or a string");
    }

    if (prefix == null || prefix === "" || prefix === "/") {
        return "";
    }

    if (prefix.slice(-1) === '/') {
        return prefix;
    }

    return prefix + "/";
};

var actionNum = 0;
var getActionType = function getActionType(prefix, actionName) {
    return buildPrefix(prefix) + (actionName == null || actionName === "" ? "" + actionNum++ : actionName);
};

var makeActionCreator = function makeActionCreator(actionType) {
    var actionArgumentNames = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var checkAndLog = arguments[2];
    var logBuilt = arguments[3];

    if (typeof actionArgumentNames === 'string') {
        return function (arg) {
            var action = { type: actionType };
            if (checkAndLog) {
                if (arg == null) {
                    console.warn("The generic action '" + actionType + "' is expected to be created with an argument object, not:", (0, _stringify2.default)(arg), " - Creating empty action:", action);
                    return action;
                } else if ((typeof arg === 'undefined' ? 'undefined' : (0, _typeof3.default)(arg)) !== 'object' || Array.isArray(arg)) {
                    throw Error("The generic action '" + actionType + "' is expected to be created with an argument object, not: " + (0, _stringify2.default)(arg) + ". Aborting.");
                }
            }

            var newAction = (0, _extends3.default)({}, action, arg);

            if (logBuilt) {
                console.log("New generic reducer action:", newAction);
            }

            return newAction;
        };
    } else {
        return function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            var action = { type: actionType };
            actionArgumentNames.forEach(function (key, idx) {
                action[key] = args[idx];
            });
            if (logBuilt) {
                console.log("New reducer action:", action);
            }
            return action;
        };
    }
};

var buildMaps = function buildMaps(prefix, actionAndReducerMap, checkAndWarn, logBuilt) {
    var actionCreatorMap = {};
    var reducerMap = {};
    var typeMap = {};

    (0, _keys2.default)(actionAndReducerMap).forEach(function (actionName) {

        var actionType = getActionType(prefix, actionName);
        var reducerFunction = actionAndReducerMap[actionName];
        var actionFields = getReducerActionFields(reducerFunction, actionType);

        if (checkAndWarn) {
            (0, _check2.default)(reducerFunction, actionType, actionFields);
        }

        actionCreatorMap[actionName] = makeActionCreator(actionType, actionFields, checkAndWarn, logBuilt);
        reducerMap[actionType] = reducerFunction;
        typeMap[actionName] = actionType;

        if (logBuilt) {
            if (typeof actionFields === 'string') {
                console.log("Generic reducer actionCreator: " + actionName + "(" + actionFields + ")   " + "--->   type: '" + actionType + "'");
            } else {
                console.log("Reducer actionCreator: " + actionName + "(" + actionFields.join(", ") + ")   " + "--->   type: '" + actionType + "'");
            }
        }
    });

    return [actionCreatorMap, reducerMap, typeMap];
};

// -------------------------------------------------------------  Reducer-specific helpers

var getReducerActionFields = function getReducerActionFields(reducerFunc, actionType) {
    return reducerFunc != null ? (0, _actionFields2.default)(reducerFunc, actionType) || [] : [];
};

var makeReducer = exports.makeReducer = function makeReducer(reducerTable, initialState) {
    return function () {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
        var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var reducer = reducerTable[action.type];
        return reducer ? reducer(state, action) : state;
    };
};

//------------------------------------------------------------  Entry: class

/**
 *  Creates an action-actioncreator-reducer unified complex: a redux duck.
 */

var DuckFactory = function () {
    function DuckFactory(actionTypePrefix, initialState, actionAndReducerMap) {
        var checkAndWarn = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
        var logBuilt = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
        (0, _classCallCheck3.default)(this, DuckFactory);

        if (actionAndReducerMap == null || (typeof actionAndReducerMap === 'undefined' ? 'undefined' : (0, _typeof3.default)(actionAndReducerMap)) !== 'object') {
            throw Error("Can't create a duck without actionAndReducerMap: action creator name --> reducer function");
        }

        var _buildMaps = buildMaps(actionTypePrefix, actionAndReducerMap, checkAndWarn, logBuilt && canLog),
            _buildMaps2 = (0, _slicedToArray3.default)(_buildMaps, 3),
            actionCreatorMap = _buildMaps2[0],
            reducerMap = _buildMaps2[1],
            typeMap = _buildMaps2[2];

        this._actionCreators = actionCreatorMap;
        this._reducer = makeReducer(reducerMap, initialState);
        this._types = typeMap;

        this.getReducer = this.getReducer.bind(this);
        this.getActionCreators = this.getActionCreators.bind(this);
        this.getTypes = this.getTypes.bind(this);
    }

    (0, _createClass3.default)(DuckFactory, [{
        key: 'getReducer',
        value: function getReducer() {
            return this._reducer;
        }
    }, {
        key: 'getActionCreators',
        value: function getActionCreators() {
            return this._actionCreators;
        }
    }, {
        key: 'getTypes',
        value: function getTypes() {
            return this._types;
        }
    }]);
    return DuckFactory;
}();

exports.default = DuckFactory;