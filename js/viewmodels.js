var app = app || angular.module("bowling",[]);


app.controller("SheetViewModel", function ($scope) {
    "use strict";

    $scope.isDisabledFrame = function (index) {
        return bowling.vm.currentFrameInFrameSet($scope.frames) < index;
    };

    $scope.isCurrentFrame = function (index) {
        return bowling.vm.currentFrameInFrameSet($scope.frames) === index;
    };

    $scope.frameIsAStrike = function (index) {
        return bowling.vm.frameIsAStrike($scope.frames[index]);
    };

    var frameSetComputeLoop = function (frameSet) {
        var totals1 = bowling.vm.frameSetToThrows(frameSet),
            totals = bowling.core.convertThrowsToTotals(totals1);

        return bowling.vm.recombineFramesWithNewTotals(frameSet, totals);
    };

    $scope.computeTotals = function () {
        $scope.frames = frameSetComputeLoop($scope.frames);
    };

    $scope.frames = bowling.vm.generateEmptyFrameSet();
    $scope.$watch("frames", $scope.computeTotals, true);
});
