var app = app || angular.module("bowling",[]);


app.controller("SheetViewModel", function ($scope) {
    "use strict";

    $scope.isDisabledFrame = function (index) {
        return bowling.vm.currentFrameInFrameSet($scope.frames) < index;
    };

    $scope.isDisabledCell = multimethod(function (index, cell) {
        if(index < 9) { return cell === "second" ? cell : "default"; }
    },{
        second: function (index) {
            return $scope.isDisabledFrame(index) || $scope.frameIsAStrike(index);
        },
        default: function (index) {
            return $scope.isDisabledFrame(index);
        }
    });

    $scope.isCurrentFrame = function (index) {
        return bowling.vm.currentFrameInFrameSet($scope.frames) === index;
    };

    $scope.frameIsAStrike = function (index) {
        return bowling.vm.frameIsAStrike($scope.frames[index]);
    };

    var frameSetComputeLoop = function (frameSet) {
        var saneFrames = bowling.vm.sanitizeFrames(frameSet),
            throws_ = bowling.vm.frameSetToThrows(frameSet),
            totals = bowling.core.convertThrowsToTotals(throws_);
        return bowling.vm.recombineFramesWithNewTotals(saneFrames, totals);
    };

    $scope.computeTotals = function () {
        $scope.frames = frameSetComputeLoop($scope.frames);
    };

    $scope.frames = bowling.vm.generateEmptyFrameSet();
    $scope.$watch("frames", $scope.computeTotals, true);
});
