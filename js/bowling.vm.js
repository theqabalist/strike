var bowling = _.merge(bowling || {}, (function (window, _, undefined) {
    "use strict";

    var vm = (function (window, _, undefined) {

        var generateEmptyFrameSet = function () {
            var frames = [];
            _.times(10, function(){
                frames.push({});
            });
            return frames;
        };

        var frameSetToThrows = function (frameset) {
            var nestedScores = framesToScoreGroups(frameset),
                numericGroups = specialCharactersToNumbers(nestedScores),
                flattenedScores = _.flatten(numericGroups),
                firstEmpty = _.findIndex(flattenedScores, function (item) {
                    return _.isNaN(item) || _.isUndefined(item); }),
                takeValue = firstEmpty === -1 ? 999 : firstEmpty,
                scores = _.take(flattenedScores, takeValue);
                return scores;
        };

        var framesToScoreGroups = function (frameset) {
            var groupMapper = multimethod(tenthFrameDispatch,{
                    tenth: function (frame) {
                        return [
                            frame.first,
                            frame.second,
                            frame.third
                        ];
                    },
                    default: function (frame) {
                        var frameGroup = [frame.first];
                        if(!isStrikeChar(frame.first)) {
                            frameGroup.push(frame.second);
                        }
                        return frameGroup;
                    }
                });

            return _.map(frameset, groupMapper);
        };

        var isStrikeChar = function (string) {
            return string === "x" ||
                   string === "X";
        };

        var specialCharactersToNumbers = function (frameGroups) {
            var mapper = multimethod(tenthFrameDispatch,{
                tenth: function (group) {
                    return _.map(group, function (item, index, coll) {
                        if(isStrikeChar(item)) { return 10; }
                        if(isSpareChar(item)) { return 10-coll[index-1]; }
                        return parseInt(item, 10) || undefined;
                    });
                },
                default: function (group) {
                    var firstNum = parseInt(group[0], 10),
                    secondNum = parseInt(group[1], 10);
                    if(isStrikeChar(group[0])) {
                    return [10];
                    }
                    if(isSpareChar(group[1])) {
                        return [firstNum, 10-firstNum];
                    }
                    return [firstNum, secondNum];
                }
            });

            return _.map(frameGroups, mapper);
        };

        var isSpareChar = function (string) { return string === "/"; };

        var tenthFrameDispatch = function (group, index) {
            return index === 9 ? "tenth" : "default";
        };

        var recombineFramesWithNewTotals = function (frameSet, totals) {
            var zipperMapper = multimethod(tenthFrameDispatch,{
                    tenth: function (frame, index) {
                        return {
                            first: frame.first,
                            second: frame.second,
                            third: frame.third,
                            total: totals[index]
                        };
                    },
                    default: function (frame, index) {
                        return {
                            first: frame.first,
                            second: frame.second,
                            total: totals[index]
                        };
                    }
                });

            return _.map(frameSet, zipperMapper);
        };

        var sanitizeFrames = function (frameSet) {
            var sanityMapper = multimethod(tenthFrameDispatch,{
                    tenth: sanitizeTenthFrame,
                    default: sanitizeNormalFrame
                });

            return _.map(frameSet, sanityMapper);
        };

        var sanitizeNormalFrame = multimethod(function (frame) {
            var signal = [];

            if(isStrikeChar(frame.first)) { signal.push("strike"); }
            else { signal.push("default"); }

            if(isStrikeChar(frame.second)) { signal.push("strike"); }
            else if (isSpareChar(frame.second)) { signal.push("spare"); }
            else { signal.push("default"); }

            return signal;
        },{
            strike_strike: function (frame) {
                return {
                    first: frame.first
                };
            },
            strike_spare: function (frame) {
                return {
                    first: frame.first
                };
            },
            strike_default: function (frame) {
                return {
                    first: frame.first
                };
            },
            default_strike: function (frame) {
                return sanitizeNormalFrame({
                    first: frame.first,
                    second: "/"
                });
            },
            default_spare: function (frame) {
                var first = parseInt(frame.first, 10) || undefined,
                    second = first ? "/" : undefined;
                return {
                    first: first,
                    second: second
                };
            },
            default_default: function (frame) {
                var first = parseInt(frame.first, 10) || undefined,
                    second = first ? parseInt(frame.second, 10) || undefined : undefined;

                if(first + second >= 10) { second = "/"; }

                return {
                    first: first,
                    second: second
                };
            }
        });

        var sanitizeTenthFrame = multimethod(function (frame) {
            var signal = [];
            if(isStrikeChar(frame.first)) { signal.push("strike");}
            else { signal.push("default"); }

            if(isStrikeChar(frame.second)) { signal.push("strike"); }
            else if(isSpareChar(frame.second)) { signal.push("spare"); }
            else { signal.push("default"); }

            if(isStrikeChar(frame.third)) { signal.push("strike"); }
            else if(isSpareChar(frame.third)) { signal.push("spare"); }
            else { signal.push("default"); }
            return signal;
        },{
            strike_strike_strike: function (frame) {
                return {
                    first: frame.first,
                    second: frame.second,
                    third: frame.third
                };
            },
            strike_strike_spare: function (frame) {
                return {
                    first: frame.first,
                    second: frame.second
                };
            },
            strike_strike_default: function (frame) {
                return {
                    first: frame.first,
                    second: frame.second,
                    third: parseInt(frame.third, 10) || undefined,
                };
            },
            strike_spare_strike: function (frame) {
                return {
                    first: frame.first
                };
            },
            strike_spare_spare: function (frame) {
                return {
                    first: frame.first
                };
            },
            strike_spare_default: function (frame) {
                return {
                    first: frame.first
                };
            },
            strike_default_strike: function (frame) {
                return sanitizeTenthFrame({
                    first: frame.first,
                    second: frame.second,
                    third: "/"
                });
            },
            strike_default_spare: function (frame) {
                var second = parseInt(frame.second, 10) || undefined,
                    third = second ? "/" : undefined;
                return {
                    first: frame.first,
                    second: second,
                    third: third
                };
            },
            strike_default_default: function (frame) {
                var second = parseInt(frame.second, 10) || undefined,
                    third = second ? parseInt(frame.third, 10) : undefined;

                if (second + third >= 10) { third = "/"; }

                return {
                    first: frame.first,
                    second: second,
                    third: third
                };
            },
            default_strike_strike: function (frame) {
                var first = parseInt(frame.first, 10) || undefined,
                    second = first ? "/" : undefined,
                    third = second ? "x" : undefined;

                return {
                    first: first,
                    second: second,
                    third: third
                };
            },
            default_strike_spare: function (frame) {
                var first = parseInt(frame.first, 10) || undefined,
                    second = first ? "/" : undefined;

                return {
                    first: first,
                    second: second
                };
            },
            default_strike_default: function (frame) {
                var first = parseInt(frame.first, 10) || undefined,
                    second = first ? "/" : undefined,
                    third = second ? (parseInt(frame.third, 10) || undefined) : undefined;

                return {
                    first: first,
                    second: second,
                    third: third
                };
            },
            default_spare_strike: function (frame) {
                var first = parseInt(frame.first, 10) || undefined,
                    second = first ? "/" : undefined,
                    third = second ? "x" : undefined;

                return {
                    first: first,
                    second: second,
                    third: third
                };
            },
            default_spare_spare: function (frame) {
                var first = parseInt(frame.first, 10) || undefined,
                    second = first ? "/" : undefined,
                    third = second ? "x" : undefined;

                return {
                    first: first,
                    second: second,
                    third: third
                };
            },
            default_spare_default: function (frame) {
                var first = parseInt(frame.first, 10) || undefined,
                    second = first ? "/" : undefined,
                    third = second ? (parseInt(frame.third, 10) || undefined) : undefined;

                return {
                    first: first,
                    second: second,
                    third: third
                };
            },
            default_default_strike: function (frame) {
                var first = parseInt(frame.first, 10) || undefined,
                    second = first ? parseInt(frame.second, 10) || undefined : undefined,
                    third = second ? "/" : undefined;

                if (first + second >= 10) {
                    second = "/";
                    third = "x";
                }

                return {
                    first: first,
                    second: second,
                    third: third
                };
            },
            default_default_spare: function (frame) {
                var first = parseInt(frame.first, 10) || undefined,
                    second = first ? parseInt(frame.second, 10) || undefined : undefined,
                    third = second ? "/" : undefined;

                if (first + second >= 10) {
                    second = "/";
                    third = "x";
                }

                return {
                    first: first,
                    second: second,
                    third: third
                };
            },
            default_default_default: function (frame) {
                var first = parseInt(frame.first, 10) || undefined,
                    second = first ? parseInt(frame.second, 10) || undefined : undefined,
                    third;

                if (first + second >= 10) {
                    second = "/";
                    third = parseInt(frame.third, 10) || undefined;
                }

                return {
                    first: first,
                    second: second,
                    third: third
                };
            },
        });

        var currentFrameInFrameSet = function (frameSet) {
            var emptyFrame = _.indexOf(_.map(frameSet, function (frame, index) {
                return frameIsFull(frameSet[index]);
            }), false);
            return emptyFrame === -1 ? 9 : emptyFrame;
        };

        var frameIsFull = function (frame) {
            var frameIsNotMissingAThrow = !(_.isUndefined(frame.first) || _.isUndefined(frame.second));

            return frameIsAStrike(frame) || frameIsNotMissingAThrow;
        };

        var frameIsAStrike = function (frame) {
            frame = frame || {};
            return frame.first === "x" || frame.first === "X";
        };

        return {
            currentFrameInFrameSet: currentFrameInFrameSet,
            frameIsAStrike: frameIsAStrike,
            frameSetToThrows: frameSetToThrows,
            generateEmptyFrameSet: generateEmptyFrameSet,
            sanitizeFrames: sanitizeFrames,
            recombineFramesWithNewTotals: recombineFramesWithNewTotals
        };

    })(window, _);

    return {
        vm: vm
    };

})(window, _));
