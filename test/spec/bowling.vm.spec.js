describe("bowling.vm", function () {
    "use strict";

    describe("bowling.vm.generateEmptyFrameSet", function() {
        it("should be able to make an empty frame set.", function () {
            var frameSet = bowling.vm.generateEmptyFrameSet();
            expect(frameSet.length).toEqual(10);
            _.forEach(frameSet, function (frame) {
                expect(_.isEmpty(frame));
            });
        });
    });

    describe("bowling.vm.frameSetToThrows", function () {
        var frameSet;

        beforeEach(function () {
            frameSet = bowling.vm.generateEmptyFrameSet();
        });

        it("should be able to convert a basic viewmodel frameset into a throwset.", function () {
            frameSet[0] = {first: "1", second: "2"};
            frameSet[1] = {first: "3", second: "4"};
            expect(bowling.vm.frameSetToThrows(frameSet)).toEqual([1,2,3,4]);
        });

        it("should be able to convert frames with totals greater than 10 to 10 max.", function () {
            frameSet[0] = {first: "9", second: "9"};
            expect(bowling.vm.frameSetToThrows(frameSet)).toEqual([9,1]);
        });

        it("should be able to handle 0s gracefully.", function () {
            frameSet[0] = {first: "0", second: "/"};
            expect(bowling.vm.frameSetToThrows(frameSet)).toEqual([0,10]);
        });
    });

    describe("bowling.vm.frameIsAStrike", function () {
        it("should be able to tell if a frame is not a strike.", function () {
            var frame = { first: "1", second: "2" };
            expect(bowling.vm.frameIsAStrike(frame)).toBe(false);
        });

        it("should be able to tell if a frame is a strike.", function () {
            var frame = { first: "x" };
            expect(bowling.vm.frameIsAStrike(frame)).toBe(true);
        });

        it("should be able to tell if a frame is a strike (variant).", function () {
            var frame = { first: "X" };
            expect(bowling.vm.frameIsAStrike(frame)).toBe(true);
        });
    });

    describe("bowling.vm.currentFrameInFrameSet", function () {
        it("should be able to tell the current frame in a frameset.", function () {
            var set = bowling.vm.generateEmptyFrameSet();

            expect(bowling.vm.currentFrameInFrameSet(set)).toBe(0);

            set[0] = { first: "1", second: "2" };

            expect(bowling.vm.currentFrameInFrameSet(set)).toBe(1);
        });
    });

    describe("bowling.vm.recombineFramesWithNewTotals", function() {
        it("should be able to place totals on frameset with no totals.", function () {
            var set = bowling.vm.generateEmptyFrameSet(),
                totals = [4];

            set[0] = { first: "1", second: "3" };

            expect(bowling.vm.recombineFramesWithNewTotals(set,totals)[0].total).toBe(4);
        });

        it("should be able to replace totals that already exist.", function () {
            var set = bowling.vm.generateEmptyFrameSet(),
                totals = [2,3],
                recombined;

            set[0] = { first: "1", second: "1", total: 0 };
            set[1] = { first: "1", second: "0", total: 0 };
            set[2] = { first: "1", second: "0", total: 0 };

            recombined = bowling.vm.recombineFramesWithNewTotals(set, totals);
            expect(recombined[0].total).toBe(2);
            expect(recombined[1].total).toBe(3);
            expect(recombined[2].total).toBe(undefined);
        });
    });
});
