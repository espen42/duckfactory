## IMPORTANT: 
**A naughty bug has been discovered!** It causes a problem (loss of action creator arguments) when duckfactory is used in projects that use code mangling (code minification / uglification) for production with tools like webpack.

I'm currently working on this and will release a bugfix version when it's solved. **Until then I don't recommend using duckfactory (v1.2.6 or below) or goosefactory (version 1.2.7 or below) with production-mangled code.**


---

# Duckfactory
**Simple creation and use of redux ducks.**

[Redux](https://github.com/reactjs/redux) / [react redux](https://github.com/reactjs/react-redux) are great,
but can produce a lot of boilerplate and fragmented code as a project grows, even for simple functionality.

I really like the concept of [redux ducks](https://github.com/erikras/ducks-modular-redux),
as it aims to simplify and structure this:
Bundle the reducers with the actions that trigger them when they belong together - which they do most of the time.

Duckfactory tries to make it as easy as possible to create ducks and add functionality to a project if necessary,
while keeping the project code minimal, clean and readable.


## Installation
```
npm install duckfactory --save
```
or
```
yarn add duckfactory
```

## How does it work?

Give it a prefix string to group the actions, an initial state, an object with the names of action creators
and the reducers the actions should trigger.
It will then create an object that exposes ordinary redux action creators, reducers and action types.

### Constructor arguments:
- _actionTypePrefix_: a prefix string added before each action creator name, to produce the action type strings. Should be globally unique if you use more than one duckfactory (and/or <a href="https://github.com/espen42/goosefactory">goosefactory</a>). If empty or missing, no prefix will be added and the actioncreator names will be used as action types - then it's up to you to ensure your action types become unique.
- _initialState_: the reducer's initial state (for the state subtree that the duck should cover), 
- _actionAndReducerMap_: an object where the keys become the names of action creators, and the values are anonymous functions that become the corresponding reducer to the action creator. The reducer's arguments should be: _state_ as the first argument, and the second argument should be either missing (for reducers that don't require data from the action), or be an action object that is destructured into its keys (reducer argument example: (_state_, {_id_, _name_, _height_}) ). If it's a destructured object, the content of that will become the arguments of the action creator (actioncreator argument example: (_id_, _name_, _height_) ). 
- _checkAndWarn_: an optional boolean (default: true) that sets whether to check the duck for consistency: are the arguments correct? Does it produce actionTypes that are globally unique? Serious errors throw Errors, less serious ones only log a warning to the console.
- _logBuilt_: a last optional boolean (default: false) that sets whether to log some details about the produced action creators and actions. Handy for development, no need for it in prod.

### Exposed after creation:
After creation, the resulting duck exports as JS objects:
- _.getActionCreators()_: actionCreator-name → actionCreator-function
- _.getReducer()_: actionType → reducer-function
- _.getTypes()_: actionCreator name → actionType

These are used the same way as ordinary redux actions, action creators and reducers, export the reducer in the regular way to redux or combineReducers. Most of the time, you won't need the exported action types.



## Examples
...coming soon. Until then, take a look at _src/duckfactory_spec.js_

  
## Used with redux-sagas

The produced actions can of course be used to trigger redux sagas too.
But to make this part even easier, take a look at [Goosefactory](https://github.com/espen42/goosefactory) — a sibling
library made for redux-sagas instead of reducers. Duckfactories and Goosefactories work nicely with each other.
