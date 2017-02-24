import { expect } from 'chai';

import DuckFactory from '../src';

const duckFactory = new DuckFactory("DKTST", {}, true);

describe("DuckFactory", ()=>{
    describe(".makeActionCreator", ()=>{

        describe("", ()=>{
            it("uses the actioncreator to create actions as expected, with arguments", ()=>{
                const actionCreator = duckFactory.makeActionCreator(
                    "PERKELE1",
                    ["woop", "wheee", "satanperkele"],
                    (state, {woop, wheee, satanperkele})=>{ console.log("Gosh darn it to heck!!!!"); },
                );

                const action = actionCreator(2, 42, 666);
                expect(action).to.deep.equal({
                    type: "DKTST_PERKELE1",
                    woop: 2,
                    wheee: 42,
                    satanperkele: 666,
                });
            });


            it("tolerates excessive number of action arguments, compared to the actionCreator actionArgumentNames", ()=>{
                const actionCreator = duckFactory.makeActionCreator(
                    "PERKELE5",
                    ["woop", "wheee", "sataniperkele"],
                    (state, {woop, wheee, sataniperkele})=>{ console.log("Awright"); }
                );

                const action = actionCreator(2, 42, 99, 47, 101);
                expect(action).to.deep.equal({
                    type: "DKTST_PERKELE5",
                    woop: 2,
                    wheee: 42,
                    sataniperkele: 99,
                });
            });
        });
    });

});
