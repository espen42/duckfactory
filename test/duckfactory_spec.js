import { expect } from 'chai';

import DuckFactory from '../src';

const duckFactory = new DuckFactory("duck/test/", {}, {
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

describe("DuckFactory", ()=>{
    describe(".getActionCreators().action", ()=>{
        it("uses the actioncreator to create actions as expected, with arguments", ()=>{

            const action1 = duckFactory.getActionCreators().setHey(2, 42, 777);

            expect(action1).to.deep.equal({
                type: "duck/test/setHey",
                ya: 2,
            });

            const action2 = duckFactory.getActionCreators().doubleHey(2, 42, 777);

            expect(action2).to.deep.equal({
                type: "duck/test/doubleHey",
            });

            const action3 = duckFactory.getActionCreators().insertSecondAndThirdAsWhoaYeah(2, 42, 777);

            expect(action3).to.deep.equal({
                type: "duck/test/insertSecondAndThirdAsWhoaYeah",
                first: 2,
                second: 42,
                third: 777,
            });
        });


        /*it("tolerates excessive number of action arguments, compared to the actionCreator actionArgumentNames", ()=>{
            const duckFactory = new DuckFactory("duck/test/", {}, {
                ACTION2: (state, {woop, wheee, ohyes}) => {
                    console.log("Okay");
                    return state;
                },
            }, true, true);


            const action = duckFactory.getActionCreators().ACTION2(2, 42, 99, 47, 101);
            expect(action).to.deep.equal({
                type: "duck/test/ACTION2",
                woop: 2,
                wheee: 42,
                ohyes: 99,
            });
        });
    });

    describe("Construction with an actionAndReducerMap", ()=>{
        it("Takes input action map ( actionName --> reducerFunction ) and replaces the value in the actionmap with" +
            "an appropriate action creator", ()=>{
            const duckFactory = new DuckFactory("duck/test/", {}, {
                setHey: (state, {ya}) => ({hey: ya}),
                doubleHey: (state) => ({hey: state.hey * 2}),
                insertWhoaYeah: (state, {whoa, yeah}) => {
                    return {
                        ...state,
                        whoa: whoa,
                        yeah: "Yeah: " + yeah,
                    };
                },
            }, true, true);

            const actions1 = ;

            new DuckFactory("DKTST2", {hey: 5}, actions1);

            console.log("setHey:", actions1.setHey(42));
            console.log("doubleHey:", actions1.doubleHey());
            console.log("insertWhoaYeah:", actions1.insertWhoaYeah(6, 19));

        });


        it("tolerates excessive number of action arguments, compared to the actionCreator actionArgumentNames", ()=>{

            //const duckFactory3 = new DuckFactory("DKTST3", {}, true);
        });//*/
    });
});
