const validArgPattern = "^(?!(?:" +
    "do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|" +
    "class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|" +
    "finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$)" +
    "[$A-Z\\_a-z][$A-Z\\_a-z0-9]*$";
const validArgNames = new RegExp(validArgPattern);

const takenActionNames = new Set();
const checkActionName = actionName => {
    console.log("Checking actionName:", actionName);
    if ((typeof actionName) !== 'string' && (typeof actionName) !== 'number') {
        throw Error("Action name can't be " + JSON.stringify(actionName) + " (" + typeof actionName + "). " +
            "Only strings or numbers are allowed.");
    }
    if (takenActionNames.has(actionName)) {
        throw Error("Action name " + JSON.stringify(actionName) + " is already taken. Action names must be unique. " +
            "Existing names are: " + JSON.stringify(takenActionNames));
    }
    takenActionNames.add(actionName);
};

// Credit: https://davidwalsh.name/javascript-arguments
const getFunctionArgNames = (func) => {
    const args = func.toString().match(/function\s.*?\(([^)]*)\)/)[1];
    return args.split(',').map(function (arg) {
        return arg.replace(/\/\*.*\*\//, '').trim();
    }).filter(function (arg) {
        return arg;
    });
};

const getFunctionRefsNames = (func, ref) => {
    const pattern = new RegExp(ref + "\\.([a-zA-Z0-9_]+)[\\,\\;]", 'g');
    const args = func.toString().match(pattern);
    return args && args.map( arg => arg.slice(ref.length + 1, arg.length - 1));
};

const checkActionArgumentNames = (actionArgumentNames, actionType) => {
    const acceptedNames = new Set();
    actionArgumentNames.forEach( name => {
        if (name === "type") {
            throw Error("Illegal action argument name for action '" + actionType + "' - an argument can't be called " +
                "'type', since that's internally reserved.");
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
const checkHealthy = (actionType, actionArgumentNames = [], func, functionIsReducer) => {
    let healthy = true;

    checkActionName(actionType);

    if (func != null) {
        const reducerArgs = getFunctionArgNames(func);
        //console.log("reducerFunction args:", JSON.stringify(reducerArgs));

        checkActionArgumentNames(actionArgumentNames, actionType);

        const argIndex = functionIsReducer ? 1 : 0;
        const nth = functionIsReducer ? "second" : "first";
        const funcType = functionIsReducer ? "reducer function" : "saga generator";

        if (functionIsReducer && reducerArgs[0] != "state") {
            console.warn("Possibly flawed action '" + actionType +
                "': the reducer function should take state as its first argument");
            healthy = false;
        }

        if (reducerArgs.length > argIndex) {
            if (reducerArgs[argIndex].substr(0,4) === "_ref") {
                const refArgs = getFunctionRefsNames(func, reducerArgs[argIndex]);
                //console.log("refArgs:", refArgs);
                if (refArgs == null) {
                    console.warn("Possibly flawed action '" + actionType +
                        "': the " + funcType + " expects a deconstructed object ( {name1, name2, name3} etc) as its " +
                        nth + " argument, but this seems empty");
                    healthy = false;

                } else {
                    refArgs.forEach( arg => {
                        if (actionArgumentNames.indexOf(arg) === -1) {
                            throw Error("Missing action arguments for action '" + actionType +
                                "': the " + funcType + " expects an action argument '" + arg + "', but this is not among the " +
                                "arguments names of the action (" + JSON.stringify(actionArgumentNames) + ").");
                        }
                    });
                }

            } else if (reducerArgs[argIndex] !== "action") {
                console.warn("Possibly flawed reducer for action " + actionType +
                    ": the " + funcType + " expected 'action' as the name of its " + nth + " argument");
                healthy = false;
            }
        }
    }

    return healthy;
};

export default {
    reducerDuck: (actionType, actionArgumentNames, sagaGenerator) =>
        checkHealthy(actionType, actionArgumentNames, sagaGenerator, true),
    sagaGoose: (actionType, actionArgumentNames, sagaGenerator) =>
        checkHealthy(actionType, actionArgumentNames, sagaGenerator, false),
};
