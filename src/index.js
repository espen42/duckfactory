import check from './check';

import getActionFields from './actionFields';

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
    if (typeof actionArgumentNames === 'string') {
        return (arg) => {
            const action = {type: actionType};
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
        };

    } else {
        return (...args) => {
            const action = {type: actionType};
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
        const reducerFunction = actionAndReducerMap[actionName];
        const actionFields = getReducerActionFields(reducerFunction, actionType);

        if (checkAndWarn) {
            check(reducerFunction, actionType, actionFields);
        }

        actionCreatorMap[actionName] = makeActionCreator(actionType, actionFields, checkAndWarn, logBuilt);
        reducerMap[actionType] = reducerFunction;
        typeMap[actionName] = actionType;

        if (logBuilt) {
            if (typeof actionFields === 'string') {
                console.log("Generic reducer actionCreator: " + actionName + "(" + actionFields + ")   " +
                    "--->   type: '" + actionType + "'");

            } else {
                console.log("Reducer actionCreator: " + actionName + "(" + actionFields.join(", ") + ")   " +
                    "--->   type: '" + actionType + "'");
            }
        }
    });

    return [actionCreatorMap, reducerMap, typeMap];
};



// -------------------------------------------------------------  Reducer-specific helpers

const getReducerActionFields = (reducerFunc, actionType) => {
    return (reducerFunc != null) ?
        getActionFields(reducerFunc, actionType) || [] :
        [];
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
