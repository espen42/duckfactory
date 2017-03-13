import functionArgNames from './functionArgNames';


if (window) {
    if (!window.__takenActionNames__) {
        window.__takenActionNames__ = new Set();
    }
}
const takenActionNames = (window) ? window.__takenActionNames__ : new Set();

const checkActionName = actionName => {
    if ((typeof actionName) !== 'string') {
        throw Error("Action name can't be " + JSON.stringify(actionName) + " (" + typeof actionName + "). " +
            "Only strings allowed.");
    }
    if (takenActionNames.has(actionName)) {
        throw Error("Action name " + JSON.stringify(actionName) + " is already taken. Action names must be unique. " +
            "Existing names are: " + JSON.stringify(takenActionNames));
    }
    takenActionNames.add(actionName);
};

const checkActionArgumentNames = (actionArgumentNames, actionType) => {
    actionArgumentNames.forEach( name => {
        if (name === "type") {
            throw Error("Illegal action argument name for action '" + actionType + "' - an argument can't be called " +
                "'type', since that's internally reserved.");
        }
    });
};

export default (actionType, func) => {
    checkActionName(actionType);

    if (func != null) {
        const reducerArgs = functionArgNames.getArgs(func);
        if (reducerArgs.length === 0) {
            console.warn("The action '" + actionType + "' triggers a nullary reducer function. Without state as its " +
                "first argument, note that this reducer will always erase any previous state instead of modifying it");

        } else if (reducerArgs.length > 1) {
            const refArgs = functionArgNames.getRefs(func, reducerArgs[1]);
            //console.log("Action "+actionType+": refArgs =",refArgs);

            if (refArgs != null) {
                checkActionArgumentNames(refArgs, actionType);
            }

        }

    }
};

