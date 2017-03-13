import check from './check';

import functionArgNames from './functionArgNames';

const canLog =  window && window.console;

// --------------------------------------------------------------------  General helpers


const buildPrefix = prefix => {
    if (prefix != null && (typeof prefix) !== 'string') {
        throw Error("Prefix must be null/undefined, or a string");
    }

    if (prefix == null || (prefix === "") || (prefix === "/")) {
        return "";
    }

    if (prefix.slice(-1) === '/') {
        return prefix;
    }

    return prefix + "/";
};


let actionNum = 0;
const getActionType = (prefix, actionName) =>
    buildPrefix(prefix) +
    ((actionName == null || actionName === "") ?
        "" + (actionNum++) :
        actionName);




const makeActionCreator = (actionType, actionArgumentNames = [], checkAndLog, logBuilt) => {
    const action = {type: actionType};

    if (typeof actionArgumentNames === 'string') {
        return (arg) => {
            if (checkAndLog) {
                if (arg == null) {
                    console.warn("The generic action '" + actionType + "' is expected to be created with an argument object, not:",
                       JSON.stringify(arg), " - Creating empty action:", action);
                    return action;

                } else if (typeof arg !== 'object' || Array.isArray(arg)) {
                    throw Error("The generic action '" + actionType + "' is expected to be created with an argument object, not: " +
                        JSON.stringify(arg) + ". Aborting.");
                }
            }

            const newAction = { ...action, ...arg };

            if (logBuilt) {
                console.log("New generic reducer action:", newAction);
            }

            return newAction;
        }

    } else {
        return (...args) => {
            actionArgumentNames.forEach( (key, idx) => { action[key] = args[idx]; } );
            if (logBuilt) {
                console.log("New reducer action:", action);
            }
            return action;
        };
    }
};



const buildMaps = (prefix, actionAndReducerMap, checkAndWarn, logBuilt) => {
    const actionCreatorMap = {};
    const reducerMap = {};
    const typeMap = {};

    Object.keys(actionAndReducerMap).forEach( actionName => {

        const actionType = getActionType(prefix, actionName);
        let reducerFunction = actionAndReducerMap[actionName];
        const actionArgumentNames = getReducerArgNames(reducerFunction, actionType) || [];

        if (checkAndWarn) {
            check(actionType, reducerFunction);
        }

        actionCreatorMap[actionName] = makeActionCreator(actionType, actionArgumentNames, checkAndWarn, logBuilt);
        reducerMap[actionType] = reducerFunction;
        typeMap[actionName] = actionType;

        if (logBuilt) {
            if (typeof actionArgumentNames === 'string') {
                console.log("Generic reducer actionCreator: " + actionName + "(" + actionArgumentNames + ")   " +
                    "--->   type: '" + actionType + "'");

            } else {
                console.log("Reducer actionCreator: " + actionName + "(" + actionArgumentNames.join(", ") + ")   " +
                    "--->   type: '" + actionType + "'");
            }
        }
    });

    return [actionCreatorMap, reducerMap, typeMap];
};



// -------------------------------------------------------------  Reducer-specific helpers

const getReducerArgNames = (reducerFunc, actionType) => {
    if (reducerFunc != null) {
        const reducerArgs = functionArgNames.getArgs(reducerFunc);
        if (reducerArgs && reducerArgs.length > 1) {
            const secondArg = reducerArgs[1];

            const refArgs = functionArgNames.getRefs(reducerFunc, secondArg);

            return refArgs || reducerArgs[1];
        }
    }
    return [];
};

export const makeReducer = (reducerTable, initialState) =>
    (state = initialState, action = {}) => {
        const reducer = reducerTable[action.type];
        return (reducer) ? reducer(state, action) : state;
    };







//------------------------------------------------------------  Entry: class

/**
 *  Creates an action-actioncreator-reducer unified complex: a redux duck.
 */
class DuckFactory {
    constructor(actionTypePrefix, initialState, actionAndReducerMap, checkAndWarn = true, logBuilt = false) {
        if (actionAndReducerMap == null || (typeof actionAndReducerMap !== 'object')) {
            throw Error("Can't create a duck without actionAndReducerMap: action creator name --> reducer function");
        }

        const [actionCreatorMap, reducerMap, typeMap] = buildMaps(
            actionTypePrefix, actionAndReducerMap, checkAndWarn, logBuilt && canLog);

        this._actionCreators = actionCreatorMap;
        this._reducer = makeReducer(reducerMap, initialState);
        this._types = typeMap;

        this.getReducer = this.getReducer.bind(this);
        this.getActionCreators = this.getActionCreators.bind(this);
        this.getTypes = this.getTypes.bind(this);
    }

    getReducer() { return this._reducer; }
    getActionCreators() { return this._actionCreators; }
    getTypes() { return this._types; }

}
export default DuckFactory;
