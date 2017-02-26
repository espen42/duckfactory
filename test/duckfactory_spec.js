import { expect } from 'chai';

import DuckFactory from '../src';

const duckFactory = new DuckFactory("DKTST", {}, true);

describe("DuckFactory", ()=>{
    describe("._makeActionCreator", ()=>{
        it("uses the actioncreator to create actions as expected, with arguments", ()=>{
            const actionCreator = duckFactory._makeActionCreator(
                "ACTION1",
                ["woop", "wheee", "ohyes"],
                (state, {woop, wheee, ohyes})=>{ console.log("Gosh darn it to heck!!!!"); },
            );

            const action = actionCreator(2, 42, 666);
            expect(action).to.deep.equal({
                type: "DKTST_ACTION1",
                woop: 2,
                wheee: 42,
                ohyes: 666,
            });
        });


        it("tolerates excessive number of action arguments, compared to the actionCreator actionArgumentNames", ()=>{
            const actionCreator = duckFactory._makeActionCreator(
                "ACTION2",
                ["woop", "wheee", "ohyes"],
                (state, {woop, wheee, ohyes})=>{ console.log("Awright"); }
            );

            const action = actionCreator(2, 42, 99, 47, 101);
            expect(action).to.deep.equal({
                type: "DKTST_ACTION2",
                woop: 2,
                wheee: 42,
                ohyes: 99,
            });
        });
    });

    describe("Construction with actionAndReducerMap", ()=>{
        it("Takes input action maps ( actionName --> reducerFunction ) and replaces the value in the actionmap with" +
            "an appropriate action creator", ()=>{

            const actions1 = {
                setHey: (state, {ya}) => ({hey: ya}),
                doubleHey: (state) => ({hey: state.hey * 2}),
                insertWhoaYeah: (state, {whoa, yeah}) => {
                    return {
                        ...state,
                        whoa: whoa,
                        yeah: "Yeah: " + yeah,
                    };
                },
            };

            new DuckFactory("DKTST2", {hey: 5}, actions1);

            console.log("setHey:", actions1.setHey(42));
            console.log("doubleHey:", actions1.doubleHey());
            console.log("insertWhoaYeah:", actions1.insertWhoaYeah(6, 19));

        });


        it("tolerates excessive number of action arguments, compared to the actionCreator actionArgumentNames", ()=>{

            //const duckFactory3 = new DuckFactory("DKTST3", {}, true);
        });
    });
});
