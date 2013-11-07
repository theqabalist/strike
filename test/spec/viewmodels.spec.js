describe("The Bowling SheetViewModel", function () {
    "use strict";

    var viewmodel = null;

    beforeEach(module("bowling"));

    beforeEach(inject(function($rootScope, $controller) {
            var scope = $rootScope.$new();

            $controller("SheetViewModel", {$scope: scope});
            viewmodel = scope;
    }));

    beforeEach(function () {
        spyOn(bowling.vm, "currentFrameInFrameSet");
    });

    it("Should be able to discern if a given frame is the current frame.", function () {
        bowling.vm.currentFrameInFrameSet.and.returnValue(0);
        expect(viewmodel.isCurrentFrame(0)).toBe(true);
        expect(bowling.vm.currentFrameInFrameSet.calls.count()).toBe(1);

        bowling.vm.currentFrameInFrameSet.and.returnValue(1);
        expect(viewmodel.isCurrentFrame(0)).toBe(false);
        expect(viewmodel.isCurrentFrame(1)).toBe(true);
        expect(bowling.vm.currentFrameInFrameSet.calls.count()).toBe(3);
    });

    it("Should be able to discern if a given frame is disabled.", function () {
        bowling.vm.currentFrameInFrameSet.and.returnValue(0);
        expect(viewmodel.isDisabledFrame(0)).toBe(false);
        expect(viewmodel.isDisabledFrame(1)).toBe(true);
        expect(bowling.vm.currentFrameInFrameSet.calls.count()).toBe(2);

        bowling.vm.currentFrameInFrameSet.and.returnValue(1);
        expect(viewmodel.isDisabledFrame(0)).toBe(false);
        expect(viewmodel.isDisabledFrame(1)).toBe(false);
        expect(viewmodel.isDisabledFrame(2)).toBe(true);
        expect(viewmodel.isDisabledFrame(3)).toBe(true);
    });
});
