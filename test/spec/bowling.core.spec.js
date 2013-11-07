describe("bowling.core", function () {
    "use strict";

    var scenarios = {
        simpleGame: {
            scores: [1,2, 3,4, 5,1, 2,3, 4,5, 1,2, 3,4, 5,1, 2,3, 4,5],
            groups: [[1,2],[3,4],[5,1],[2,3],[4,5],[1,2],[3,4],[5,1],[2,3],[4,5]],
            totals: [3,10,16,21,30,33,40,46,51,60]
        },
        spareGame: {
            scores: [1,9, 2,5, 1,9, 2,5, 1,9, 2,5, 1,9, 2,5, 1,9, 2,5],
            totals: [12, 19, 31, 38, 50, 57, 69, 76, 88, 95]
        },
        strikeGame: {
            scores: [1,5,10,1,5,10,1,5,10,1,5,10,1,5,9,0],
            groups: [[1,5],[10],[1,5],[10],[1,5],[10],[1,5],[10],[1,5],[9,0]],
            totals: [6,22,28,44,50,66,72,88,94,103]
        },
        mixedGame: {
            scores: [0,10,10,0,10,10,0,10,10,0,10,10,0,10,9,0],
            groups: [[0,10],[10],[0,10],[10],[0,10],[10],[0,10],[10],[0,10],[9,0]],
            totals: [20,40,60,80,100,120,140,160,179,188]
        },
        partialSimpleGame: {
            scores: [1,2,3,4,5],
            totals: [3,10,15]
        },
        partialMixedGames: {
            scores: [9,0,10,5,5],
            totals: [9,29]
        },
        qaTest1: {
            scores: [10,10,10],
            totals: [30]
        },
        qaTest2: {
            scores: [10,5,5,2],
            groups: [[10],[5,5],[2]],
            totals: [20,32,34]
        }
    };


    describe("bowling.core.groupThrows", function() {
        _.forEach(scenarios, function(scenario, key) {
            if(!_.isUndefined(scenario.groups))
            {
                it("should be able to group "+key, function () {
                    expect(bowling.core.groupThrows(scenario.scores)).toEqual(scenario.groups);
                });
            }
        });
    });

    describe("bowling.core.convertThrowsToTotals", function() {
        _.forEach(scenarios, function(scenario, key) {
            it("should be able to handle "+key, function () {
                expect(bowling.core.convertThrowsToTotals(scenario.scores)).toEqual(scenario.totals);
            });
        });
    });
});
