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

export default (actionType, actionArgumentNames = [], func) => {
    let healthy = true;

    checkActionName(actionType);

    if (func != null) {
        const reducerArgs = functionArgNames.getArgs(func);
        if (reducerArgs.length === 0) {
            console.warn("The action '" + actionType + "' triggers a nullary reducer function. Without state as its " +
                "first argument, note that this reducer will always erase any previous state instead of modifying it");
            healthy = false;

        } else if (reducerArgs.length > 1) {
            const refArgs = functionArgNames.getRefs(func, reducerArgs[1]);
            console.log("Action "+actionType+": refArgs =",refArgs);

            if (refArgs == null) {
                console.warn("Possibly flawed action '" + actionType +
                    "': the reducer function expects a deconstructed object (eg. {name1, name2, name3} ) " +
                    "as its second argument, but this seems empty");
                healthy = false;

            } else {
                checkActionArgumentNames(refArgs, actionType);
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
