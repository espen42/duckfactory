'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.makeReducer = undefined;

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _check = require('./check');

var _check2 = _interopRequireDefault(_check);

var _functionArgNames = require('./functionArgNames');

var _functionArgNames2 = _interopRequireDefault(_functionArgNames);

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
    var logBuilt = arguments[2];
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
};

var buildMaps = function buildMaps(prefix, actionAndReducerMap, checkAndWarn, logBuilt) {
    var actionCreatorMap = {};
    var reducerMap = {};
    var typeMap = {};

    (0, _keys2.default)(actionAndReducerMap).forEach(function (actionName) {

        var actionType = getActionType(prefix, actionName);
        var reducerFunction = actionAndReducerMap[actionName];
        var actionArgumentNames = getReducerArgNames(reducerFunction, actionType) || [];

        if (checkAndWarn) {
            (0, _check2.default)(actionType, actionArgumentNames, reducerFunction);
        }

        actionCreatorMap[actionName] = makeActionCreator(actionType, actionArgumentNames, logBuilt);
        reducerMap[actionType] = reducerFunction;
        typeMap[actionName] = actionType;

        if (logBuilt) {
            console.log("Reducer actionCreator: " + actionName + "(" + actionArgumentNames.join(", ") + ")   " + "--->   type: '" + actionType + "'");
        }
    });

    return [actionCreatorMap, reducerMap, typeMap];
};

// -------------------------------------------------------------  Reducer-specific helpers

var getReducerArgNames = function getReducerArgNames(reducerFunc, actionType) {
    if (reducerFunc != null) {
        var reducerArgs = _functionArgNames2.default.getArgs(reducerFunc);

        if (reducerArgs.length > 1) {
            var secondArg = reducerArgs[1];
            if (secondArg.substr(0, 4) === "_ref") {
                var refArgs = _functionArgNames2.default.getRefs(reducerFunc, secondArg);
                if (refArgs == null) {
                    console.warn("Possible flaw in duck action '" + actionType + "': the reducer function expects a deconstructed object ( e.g. {name1, name2, name3} ) as its " + "second argument, but this seems empty");
                }
                return refArgs || [];
            }
        }
    }
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