import { expect } from 'chai';
import deepFreeze from 'deep-freeze';

import DuckFactory from '../src';



describe("DuckFactory", ()=>{
    describe(".getActionCreators", ()=> {
        it("exposes an boject with actions creators, corresponding to the keys in the object sent to the creator, " +
            "where the actioncreator's arguments are the reducer arguments", () => {
            const duckFactory = new DuckFactory("duck/test1/", {}, {
                setHey: (state, {ya}) => ({hey: ya}),
                doubleHey: (state) => ({hey: state.hey * 2}),
                insertSecondAndThirdAsWhoaYeah: (state, {first, second, third}) => {
                    return {
                        ...state,
                        hey: first,
                        whoa: second,
                        yeah: "Yeah: " + third,
                    };
                },
            }, true, true);

            const action1 = duckFactory.getActionCreators().setHey(2, 42, 777);

            expect(action1).to.deep.equal({
                type: "duck/test1/setHey",
                ya: 2,
            });

            const action2 = duckFactory.getActionCreators().doubleHey(2, 42, 777);

            expect(action2).to.deep.equal({
                type: "duck/test1/doubleHey",
            });

            const action3 = duckFactory.getActionCreators().insertSecondAndThirdAsWhoaYeah(2, 42, 777);

            expect(action3).to.deep.equal({
                type: "duck/test1/insertSecondAndThirdAsWhoaYeah",
                first: 2,
                second: 42,
                third: 777,
            });
        });
    });

    describe(".getReducers", ()=>{
        it("Takes input action map ( actionName --> reducerFunction ) and exposes a working reducer", ()=>{
            const duckFactory = new DuckFactory("duck/test2/", {}, {
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

            const actions = duckFactory.getActionCreators();
            const reducer = duckFactory.getReducer();

            const STATE = deepFreeze({hey: 37});
            expect(STATE).to.deep.equal({hey: 37});

            let reduced = reducer(STATE, actions.setHey(42));
            expect(reduced).to.deep.equal({hey: 42});

            reduced = reducer(reduced, actions.doubleHey());
            expect(reduced).to.deep.equal({hey: 84});

            reduced = reducer(reduced, actions.insertWhoaYeah(6, 19));
            expect(reduced).to.deep.equal({
                hey: 84,
                whoa: 6,
                yeah: "Yeah 19",
            });
        });
    });

    describe(".getTypes", ()=> {
        it("exposes a map between the action creator name and the type of the action it creates", ()=>{
            const duckFactory = new DuckFactory("duck/test3/", {}, {
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
    });
});
