import { expect } from 'chai';

import DuckFactory from '../src';

const duckFactory = new DuckFactory("DKTST", {}, true);

describe("DuckFactory", ()=>{
    describe(".makeActionCreator", ()=>{
        it("uses the actioncreator to create actions as expected, with arguments", ()=>{
            const actionCreator = duckFactory.makeActionCreator(
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
            const actionCreator = duckFactory.makeActionCreator(
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

});
