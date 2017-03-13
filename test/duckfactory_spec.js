import { expect } from 'chai';
import deepFreeze from 'deep-freeze';

import DuckFactory from '../lib';



describe("duckfactory", ()=>{
    describe(".getActionCreators", ()=> {
    
        /** The first argument of the reducer function will be treated as the incoming state in the reducer, and will
         *  therefore be ignored by the action creator.
         *
         *  The basic syntax is to provide the first state argument, and a second argument that is a destructured object
         *  as demonstrated here. The content of the destructured object will be the arguments of the action creator:
         */
        it("exposes an object with actions creators, corresponding to the keys in the object sent to the creator, " +
            "where the actioncreator's arguments are the reducer function's second argument object, destructured", () => {
            
            const duckFactory = new DuckFactory("duck/test1", {}, {
                setHey: (state, {ya}) => ({hey: ya}),
                doubleHey: (state) => ({hey: state.hey * 2}),
                // Note that while first, second and third become the three direct arguments for the action creator below, the {first, second, third} object is ONE argument in the definition here.
                insertSecondAndThirdAsWhoaYeah: (state, {first, second, third}) => {
                    return {
                        ...state,
                        hey: first,
                        whoa: second,
                        yeah: "Yeah: " + third,
                    };
                },
            }, true, true);

            const actions = duckFactory.getActionCreators();



            expect( actions.setHey(2, 42, 777) ).to.deep.equal({
                type: "duck/test1/setHey",
                ya: 2,
            });

            expect( actions.doubleHey(2, 42, 777) ).to.deep.equal({
                type: "duck/test1/doubleHey",
            });

            expect( actions.insertSecondAndThirdAsWhoaYeah(2, 42, 777) ).to.deep.equal({
                type: "duck/test1/insertSecondAndThirdAsWhoaYeah",
                first: 2,
                second: 42,
                third: 777,
            });
            
            

            expect( actions.setHey() ).to.deep.equal({
                type: "duck/test1/setHey",
                ya: undefined,
            });

            expect( actions.doubleHey() ).to.deep.equal({
                type: "duck/test1/doubleHey",
            });

            expect( actions.insertSecondAndThirdAsWhoaYeah() ).to.deep.equal({
                type: "duck/test1/insertSecondAndThirdAsWhoaYeah",
                first: undefined,
                second: undefined,
                third: undefined,
            });
        });
        
        // If the reducer function has no second object (or even no first), the action creator will not take any args
        // (or more specifically; will ignore any args) and the action will only carry the action type.
        it("creates a nullary action creator if there is no second argument in the reducer function", ()=>{
            const duckFactory = new DuckFactory("duck/testNullary", {}, {
                            onlyState: (state) => ({...state, nothing: "addedtonothing"}),
                            notEvenState: () => ({nothing: "willcomefromnothingohokaythen"}),
                        }, true, true);
                        
            const actions = duckFactory.getActionCreators();

            expect(actions.onlyState()).to.deep.equal({
                type: "duck/testNullary/onlyState",
            });
            
            expect(actions.onlyState(42)).to.deep.equal({
                type: "duck/testNullary/onlyState",
            });
            

            expect(actions.notEvenState()).to.deep.equal({
                type: "duck/testNullary/notEvenState",
            });
            
            expect(actions.notEvenState(42)).to.deep.equal({
                type: "duck/testNullary/notEvenState",
            });
            
        });
        
        
        
        /** If the reducer function has a second object but it's NOT a deconstructed object, the action creator will be
         *  more generic: it will treat the second argument as the entire action object coming in to the reducer.
         *
         *  While it will therefore be preferable if the second argument is called 'action' to make that clear, the
         *  name won't actually matter as long as it's consistently used in the reducer function.
         *
         *  The argument sent in to the action creator will be expected to be an object, which won't have any 'type' key
         *  but can otherwise have any shape - the action object will simply be the argument object with...
         *
         *     type: <actionType>
         *
         *  ...added. Handling the content with then be completely up to the reducer.
         */
        it("creates a generic action creator if the second argument of the reducer function is not a deconstructed " +
            "object", ()=>{
            const duckFactory = new DuckFactory("duck/testGeneric", {}, {
                takeAction: (state, action) => ({
                    ...state,
                    hey: action.hey,
                    inside: action.inside,
                }),
            }, true, true);
                                
            const actions = duckFactory.getActionCreators();

            expect(actions.takeAction()).to.deep.equal({
                type: "duck/testGeneric/takeAction",
            });
            
            expect(actions.takeAction({ hey: 45, inside: "suchagreatgame", ignored: "bythereducer" })).to.deep.equal({
                type: "duck/testGeneric/takeAction",
                hey: 45,
                inside: "suchagreatgame",
                ignored: "bythereducer"
            });
            
            expect(actions.takeAction({
                completely: "different",
                arguments: "but",
                thatt: "only",
                matters: "to",
                the: "reducer",
                so: "the",
                actioncreator: "is",
                fine: "withthis"
            })).to.deep.equal({
                type: "duck/testGeneric/takeAction",
                completely: "different",
                arguments: "but",
                thatt: "only",
                matters: "to",
                the: "reducer",
                so: "the",
                actioncreator: "is",
                fine: "withthis"
            });
            
            expect( () => { return actions.setNothing(666); }).to.throw(Error);  // Fails because the action creator needs an object argument, not a number
            expect( () => { return actions.setNothing("nope"); }).to.throw(Error);  // Fails because the action creator needs an object argument, not a string, etc
            expect( () => { return actions.setNothing({ type: "nonono" }); }).to.throw(Error);  // Fails because the object can't have a 'type' key - it's reserved for redux.
        });
        
        
        // If the reducer function definition has a second argument and then more after that, the third and rest of them will be ignored by the action creator
        it("will not carry any arguments beyond the second one (no matter if the second one is a deconstructed object " +
            "or just an ordinary, generic one)", ()=>{
	        const duckFactory = new DuckFactory("duck/testSurplus", {}, {
	            insertWhoaYeah: (state, {whoa, yeah}, ignorable) => ({
	                ...state,
	                whoa: whoa,
	                yeah: "Yeah " + yeah,
	            }),
	            
	            generic: (state, action, nevermind) => ({
	                ...state,
	                whoa: action.whoa,
	                yeah: "Yeah " + action.yeah,
	            }),
	        }, true, true);

            const actions = duckFactory.getActionCreators();

	        expect( actions.insertWhoaYeah(2, 42) ).to.deep.equal({
	            type: "duck/testSurplus/insertWhoaYeah",
	            whoa: 2,
	            yeah: 42,
	        });
	        
	        expect( actions.insertWhoaYeah(2, 42, 1234) ).to.deep.equal({
	            type: "duck/testSurplus/insertWhoaYeah",
	            whoa: 2,
	            yeah: 42,
	        });
	        
	        expect( actions.generic({oki: 2, doki: 42}) ).to.deep.equal({
	            type: "duck/testSurplus/generic",
	            oki: 2,
	            doki: 42,
	        });
	        
	        expect( actions.generic({oki: 2, doki: 42}, {poky: 1234}) ).to.deep.equal({
	            type: "duck/testSurplus/generic",
                oki: 2,
                doki: 42,
	        });
	        expect( actions.generic({oki: 2, doki: 42}, "smoky") ).to.deep.equal({
	            type: "duck/testSurplus/generic",
                oki: 2,
                doki: 42,
	        });
	       
	    });
    });

    describe(".getReducers", ()=>{
        it("Takes input action map ( actionName --> reducerFunction ) and exposes a working reducer", ()=>{
            const duckFactory = new DuckFactory("duck/test2", {}, {
                setHey: (state, {ya}) => ({hey: ya}),
                
                doubleHey: (state) => ({hey: state.hey * 2}),
                
                insertWhoaYeah: (state, {whoa, yeah}) => ({
                    ...state,
                    whoa: whoa,
                    yeah: "Yeah " + yeah,
                }),
                
                notEvenState: () => ({ wasReset: true }),
                
                generic: (state, action) => ({
                    ...state,
                    whoa: action.whoa,
                    yeah: "Yeah " + action.yeah,
                    
                }),
            }, true, true);
		
            const actions = duckFactory.getActionCreators();                // Examples of resulting actions below:
            const reducer = duckFactory.getReducer();

            const STATE = deepFreeze({hey: 37});

            let reduced = reducer(STATE, actions.setHey(42) );               // action: {type: 'duck/test2/setHey', ya: 42}
            expect(reduced).to.deep.equal({hey: 42});

            reduced = reducer(reduced, actions.doubleHey() );                // action: {type: 'duck/test2/doubleHey'}
            expect(reduced).to.deep.equal({hey: 84});

            reduced = reducer(reduced, actions.insertWhoaYeah(6, 19) );     // {type: 'duck/test2/insertWhoaYeah', whoa: 6, yeah: 19}
            expect(reduced).to.deep.equal({
                hey: 84,
                whoa: 6,
                yeah: "Yeah 19",
            });
            
            reduced = reducer(reduced, actions.notEvenState() );            // {type: 'duck/test2/notEvenState'}
            expect(reduced).to.deep.equal({
                wasReset: true,
            });
            
            reduced = reducer(reduced, actions.generic( {some: "new", irrelevant: "content"}) );   // {type: 'duck/test2/generic', some: "new", irrelevant: "content"}
            expect(reduced).to.deep.equal({
                wasReset: true,
                whoa: undefined,
                yeah: "Yeah undefined",
            });
            
            reduced = reducer(reduced, actions.generic( {whoa: "much", yeah: "better"}) );   // {type: 'duck/test2/generic', whoa: "much", yeah: "better"}
            expect(reduced).to.deep.equal({
                wasReset: true,
                whoa: "much",
                yeah: "Yeah better",
            });
        });
    });



    describe(".getTypes", ()=> {
        it("exposes a map between the action creator name and the type of the action it creates", ()=>{
            const duckFactory = new DuckFactory("duck/test3", {}, {
                setHey: (state, {ya}) => ({hey: ya}),
                doubleHey: (state) => ({hey: state.hey * 2}),
                insertWhoaYeah: (state, {whoa, yeah}) => {
                    return {
                        ...state,
                        whoa: whoa,
                        yeah: "Yeah " + yeah,
                    };
                },
            }, true, true);

            const types = duckFactory.getTypes();
            expect(types.setHey).to.equal("duck/test3/setHey");
            expect(types.doubleHey).to.equal("duck/test3/doubleHey");
            expect(types.insertWhoaYeah).to.equal("duck/test3/insertWhoaYeah");
        });

        it("makes sure the actiontype is sensible if prefix is null", ()=>{
            const duckFactory = new DuckFactory(null, {}, {
                setHeyGlobal1: (state, {ya}) => ({hey: ya}),
                doubleHeyGlobal1: (state) => ({hey: state.hey * 2}),
                insertWhoaYeahGlobal1: (state, {whoa, yeah}) => {
                    return {
                        ...state,
                        whoa: whoa,
                        yeah: "Yeah " + yeah,
                    };
                },
            }, true, true);

            const types = duckFactory.getTypes();
            expect(types.setHeyGlobal1).to.equal("setHeyGlobal1");
            expect(types.doubleHeyGlobal1).to.equal("doubleHeyGlobal1");
            expect(types.insertWhoaYeahGlobal1).to.equal("insertWhoaYeahGlobal1");
        });

        it("makes sure the actiontype is sensible if prefix is en empty string", ()=>{
            const duckFactory = new DuckFactory("", {}, {
                setHeyGlobal2: (state, {ya}) => ({hey: ya}),
                doubleHeyGlobal2: (state) => ({hey: state.hey * 2}),
                insertWhoaYeahGlobal2: (state, {whoa, yeah}) => {
                    return {
                        ...state,
                        whoa: whoa,
                        yeah: "Yeah " + yeah,
                    };
                },
            }, true, true);

            const types = duckFactory.getTypes();
            expect(types.setHeyGlobal2).to.equal("setHeyGlobal2");
            expect(types.doubleHeyGlobal2).to.equal("doubleHeyGlobal2");
            expect(types.insertWhoaYeahGlobal2).to.equal("insertWhoaYeahGlobal2");
        });

        it("makes sure the actiontype doesn't end up containing a double slash if prefix ends with a slash", ()=>{
            const duckFactory = new DuckFactory("hey/", {}, {
                setHey: (state, {ya}) => ({hey: ya}),
                doubleHey: (state) => ({hey: state.hey * 2}),
                insertWhoaYeah: (state, {whoa, yeah}) => {
                    return {
                        ...state,
                        whoa: whoa,
                        yeah: "Yeah " + yeah,
                    };
                },
            }, true, true);

            const types = duckFactory.getTypes();
            expect(types.setHey).to.equal("hey/setHey");
            expect(types.doubleHey).to.equal("hey/doubleHey");
            expect(types.insertWhoaYeah).to.equal("hey/insertWhoaYeah");
        });

        it("makes sure the actiontype is sensible even if prefix is only a slash", ()=>{
            const duckFactory = new DuckFactory("/", {}, {
                setHeyGlobal3: (state, {ya}) => ({hey: ya}),
                doubleHeyGlobal3: (state) => ({hey: state.hey * 2}),
                insertWhoaYeahGlobal3: (state, {whoa, yeah}) => {
                    return {
                        ...state,
                        whoa: whoa,
                        yeah: "Yeah " + yeah,
                    };
                },
            }, true, true);

            const types = duckFactory.getTypes();
            expect(types.setHeyGlobal3).to.equal("setHeyGlobal3");
            expect(types.doubleHeyGlobal3).to.equal("doubleHeyGlobal3");
            expect(types.insertWhoaYeahGlobal3).to.equal("insertWhoaYeahGlobal3");
        });

        it("rejects non-string prefixes (other than null/undefined)", ()=>{
            expect( ()=>{
                new DuckFactory({thisIs: "wrong"}, {}, {
                    setHeyGlobal4: (state, {ya}) => ({hey: ya}),
                    doubleHeyGlobal4: (state) => ({hey: state.hey * 2}),
                    insertWhoaYeahGlobal4: (state, {whoa, yeah}) => {
                        return {
                            ...state,
                            whoa: whoa,
                            yeah: "Yeah " + yeah,
                        };
                    },
                }, true, true);
            }).to.throw(Error);

            expect( ()=>{
                new DuckFactory(["also", "bad"], {}, {
                    setHeyGlobal5: (state, {ya}) => ({hey: ya}),
                    doubleHeyGlobal5: (state) => ({hey: state.hey * 2}),
                    insertWhoaYeahGlobal5: (state, {whoa, yeah}) => {
                        return {
                            ...state,
                            whoa: whoa,
                            yeah: "Yeah " + yeah,
                        };
                    },
                }, true, true);
            }).to.throw(Error);

            expect( ()=>{
                new DuckFactory(840, {}, {
                    setHeyGlobal6: (state, {ya}) => ({hey: ya}),
                    doubleHeyGlobal6: (state) => ({hey: state.hey * 2}),
                    insertWhoaYeahGlobal6: (state, {whoa, yeah}) => {
                        return {
                            ...state,
                            whoa: whoa,
                            yeah: "Yeah " + yeah,
                        };
                    },
                }, true, true);
            }).to.throw(Error);

        });

        it("throws an error if all produced action types are not globally unique, " +
            "even across different duckfactories", ()=>{
            expect( ()=>{
                new DuckFactory("this/is", {}, {
                    unique: (state, {ya}) => ({hey: ya}),
                }, true, true);

                new DuckFactory("this/is", {}, {
                    okay: (state, {ya}) => ({hey: ya}),
                }, true, true);

                new DuckFactory("this/is/also", {}, {
                    unique: (state, {ya}) => ({hey: ya}),
                }, true, true);

                new DuckFactory("this/is/also", {}, {
                    okay: (state, {ya}) => ({hey: ya}),
                }, true, true);

            }).to.not.throw(Error);

            expect( ()=>{
                new DuckFactory("this/is", {}, {
                    notUnique: (state, {ya}) => ({hey: ya}),
                }, true, true);

                new DuckFactory("this/is", {}, {
                    notUnique: (state, {ya}) => ({hey: ya}),
                }, true, true);

            }).to.throw(Error);
        });
    });
});
