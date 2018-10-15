"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var animations_1 = require("@angular/animations");
var animation_1 = require("../../src/dsl/animation");
var animation_ast_builder_1 = require("../../src/dsl/animation_ast_builder");
var testing_1 = require("../../testing");
function createDiv() {
    return document.createElement('div');
}
{
    describe('Animation', function () {
        // these tests are only mean't to be run within the DOM (for now)
        if (isNode)
            return;
        var rootElement;
        var subElement1;
        var subElement2;
        beforeEach(function () {
            rootElement = createDiv();
            subElement1 = createDiv();
            subElement2 = createDiv();
            document.body.appendChild(rootElement);
            rootElement.appendChild(subElement1);
            rootElement.appendChild(subElement2);
        });
        afterEach(function () { document.body.removeChild(rootElement); });
        describe('validation', function () {
            it('should throw an error if one or more but not all keyframes() styles contain offsets', function () {
                var steps = animations_1.animate(1000, animations_1.keyframes([
                    animations_1.style({ opacity: 0 }),
                    animations_1.style({ opacity: 1, offset: 1 }),
                ]));
                expect(function () { validateAndThrowAnimationSequence(steps); })
                    .toThrowError(/Not all style\(\) steps within the declared keyframes\(\) contain offsets/);
            });
            it('should throw an error if not all offsets are between 0 and 1', function () {
                var steps = animations_1.animate(1000, animations_1.keyframes([
                    animations_1.style({ opacity: 0, offset: -1 }),
                    animations_1.style({ opacity: 1, offset: 1 }),
                ]));
                expect(function () {
                    validateAndThrowAnimationSequence(steps);
                }).toThrowError(/Please ensure that all keyframe offsets are between 0 and 1/);
                steps = animations_1.animate(1000, animations_1.keyframes([
                    animations_1.style({ opacity: 0, offset: 0 }),
                    animations_1.style({ opacity: 1, offset: 1.1 }),
                ]));
                expect(function () {
                    validateAndThrowAnimationSequence(steps);
                }).toThrowError(/Please ensure that all keyframe offsets are between 0 and 1/);
            });
            it('should throw an error if a smaller offset shows up after a bigger one', function () {
                var steps = animations_1.animate(1000, animations_1.keyframes([
                    animations_1.style({ opacity: 0, offset: 1 }),
                    animations_1.style({ opacity: 1, offset: 0 }),
                ]));
                expect(function () {
                    validateAndThrowAnimationSequence(steps);
                }).toThrowError(/Please ensure that all keyframe offsets are in order/);
            });
            it('should throw an error if any styles overlap during parallel animations', function () {
                var steps = animations_1.group([
                    animations_1.sequence([
                        // 0 -> 2000ms
                        animations_1.style({ opacity: 0 }), animations_1.animate('500ms', animations_1.style({ opacity: .25 })),
                        animations_1.animate('500ms', animations_1.style({ opacity: .5 })), animations_1.animate('500ms', animations_1.style({ opacity: .75 })),
                        animations_1.animate('500ms', animations_1.style({ opacity: 1 }))
                    ]),
                    animations_1.animate('1s 500ms', animations_1.keyframes([
                        // 0 -> 1500ms
                        animations_1.style({ width: 0 }),
                        animations_1.style({ opacity: 1, width: 1000 }),
                    ]))
                ]);
                expect(function () { validateAndThrowAnimationSequence(steps); })
                    .toThrowError(/The CSS property "opacity" that exists between the times of "0ms" and "2000ms" is also being animated in a parallel animation between the times of "0ms" and "1500ms"/);
            });
            it('should not throw an error if animations overlap in different query levels within different transitions', function () {
                var steps = animations_1.trigger('myAnimation', [
                    animations_1.transition('a => b', animations_1.group([
                        animations_1.query('h1', animations_1.animate('1s', animations_1.style({ opacity: 0 }))),
                        animations_1.query('h2', animations_1.animate('1s', animations_1.style({ opacity: 1 }))),
                    ])),
                    animations_1.transition('b => a', animations_1.group([
                        animations_1.query('h1', animations_1.animate('1s', animations_1.style({ opacity: 0 }))),
                        animations_1.query('h2', animations_1.animate('1s', animations_1.style({ opacity: 1 }))),
                    ])),
                ]);
                expect(function () { return validateAndThrowAnimationSequence(steps); }).not.toThrow();
            });
            it('should not allow triggers to be defined with a prefixed `@` symbol', function () {
                var steps = animations_1.trigger('@foo', []);
                expect(function () { return validateAndThrowAnimationSequence(steps); })
                    .toThrowError(/animation triggers cannot be prefixed with an `@` sign \(e\.g\. trigger\('@foo', \[...\]\)\)/);
            });
            it('should throw an error if an animation time is invalid', function () {
                var steps = [animations_1.animate('500xs', animations_1.style({ opacity: 1 }))];
                expect(function () {
                    validateAndThrowAnimationSequence(steps);
                }).toThrowError(/The provided timing value "500xs" is invalid/);
                var steps2 = [animations_1.animate('500ms 500ms 500ms ease-out', animations_1.style({ opacity: 1 }))];
                expect(function () {
                    validateAndThrowAnimationSequence(steps2);
                }).toThrowError(/The provided timing value "500ms 500ms 500ms ease-out" is invalid/);
            });
            it('should throw if negative durations are used', function () {
                var steps = [animations_1.animate(-1000, animations_1.style({ opacity: 1 }))];
                expect(function () {
                    validateAndThrowAnimationSequence(steps);
                }).toThrowError(/Duration values below 0 are not allowed for this animation step/);
                var steps2 = [animations_1.animate('-1s', animations_1.style({ opacity: 1 }))];
                expect(function () {
                    validateAndThrowAnimationSequence(steps2);
                }).toThrowError(/Duration values below 0 are not allowed for this animation step/);
            });
            it('should throw if negative delays are used', function () {
                var steps = [animations_1.animate('1s -500ms', animations_1.style({ opacity: 1 }))];
                expect(function () {
                    validateAndThrowAnimationSequence(steps);
                }).toThrowError(/Delay values below 0 are not allowed for this animation step/);
                var steps2 = [animations_1.animate('1s -0.5s', animations_1.style({ opacity: 1 }))];
                expect(function () {
                    validateAndThrowAnimationSequence(steps2);
                }).toThrowError(/Delay values below 0 are not allowed for this animation step/);
            });
            it('should throw if keyframes() is not used inside of animate()', function () {
                var steps = [animations_1.keyframes([])];
                expect(function () {
                    validateAndThrowAnimationSequence(steps);
                }).toThrowError(/keyframes\(\) must be placed inside of a call to animate\(\)/);
                var steps2 = [animations_1.group([animations_1.keyframes([])])];
                expect(function () {
                    validateAndThrowAnimationSequence(steps2);
                }).toThrowError(/keyframes\(\) must be placed inside of a call to animate\(\)/);
            });
            it('should throw if dynamic style substitutions are used without defaults within state() definitions', function () {
                var steps = [
                    animations_1.state('final', animations_1.style({
                        'width': '{{ one }}px',
                        'borderRadius': '{{ two }}px {{ three }}px',
                    })),
                ];
                expect(function () { validateAndThrowAnimationSequence(steps); })
                    .toThrowError(/state\("final", ...\) must define default values for all the following style substitutions: one, two, three/);
                var steps2 = [animations_1.state('panfinal', animations_1.style({
                        'color': '{{ greyColor }}',
                        'borderColor': '1px solid {{ greyColor }}',
                        'backgroundColor': '{{ redColor }}',
                    }), { params: { redColor: 'maroon' } })];
                expect(function () { validateAndThrowAnimationSequence(steps2); })
                    .toThrowError(/state\("panfinal", ...\) must define default values for all the following style substitutions: greyColor/);
            });
            it('should throw an error if an invalid CSS property is used in the animation', function () {
                var steps = [animations_1.animate(1000, animations_1.style({ abc: '500px' }))];
                expect(function () { validateAndThrowAnimationSequence(steps); })
                    .toThrowError(/The provided animation property "abc" is not a supported CSS property for animations/);
            });
            it('should allow a vendor-prefixed property to be used in an animation sequence without throwing an error', function () {
                var steps = [
                    animations_1.style({ webkitTransform: 'translateX(0px)' }),
                    animations_1.animate(1000, animations_1.style({ webkitTransform: 'translateX(100px)' }))
                ];
                expect(function () { return validateAndThrowAnimationSequence(steps); }).not.toThrow();
            });
            it('should allow for old CSS properties (like transform) to be auto-prefixed by webkit', function () {
                var steps = [
                    animations_1.style({ transform: 'translateX(-100px)' }),
                    animations_1.animate(1000, animations_1.style({ transform: 'translateX(500px)' }))
                ];
                expect(function () { return validateAndThrowAnimationSequence(steps); }).not.toThrow();
            });
        });
        describe('keyframe building', function () {
            describe('style() / animate()', function () {
                it('should produce a balanced series of keyframes given a sequence of animate steps', function () {
                    var steps = [
                        animations_1.style({ width: 0 }), animations_1.animate(1000, animations_1.style({ height: 50 })),
                        animations_1.animate(1000, animations_1.style({ width: 100 })), animations_1.animate(1000, animations_1.style({ height: 150 })),
                        animations_1.animate(1000, animations_1.style({ width: 200 }))
                    ];
                    var players = invokeAnimationSequence(rootElement, steps);
                    expect(players[0].keyframes).toEqual([
                        { height: animations_1.AUTO_STYLE, width: 0, offset: 0 },
                        { height: 50, width: 0, offset: .25 },
                        { height: 50, width: 100, offset: .5 },
                        { height: 150, width: 100, offset: .75 },
                        { height: 150, width: 200, offset: 1 },
                    ]);
                });
                it('should fill in missing starting steps when a starting `style()` value is not used', function () {
                    var steps = [animations_1.animate(1000, animations_1.style({ width: 999 }))];
                    var players = invokeAnimationSequence(rootElement, steps);
                    expect(players[0].keyframes).toEqual([
                        { width: animations_1.AUTO_STYLE, offset: 0 }, { width: 999, offset: 1 }
                    ]);
                });
                it('should merge successive style() calls together before an animate() call', function () {
                    var steps = [
                        animations_1.style({ width: 0 }), animations_1.style({ height: 0 }), animations_1.style({ width: 200 }), animations_1.style({ opacity: 0 }),
                        animations_1.animate(1000, animations_1.style({ width: 100, height: 400, opacity: 1 }))
                    ];
                    var players = invokeAnimationSequence(rootElement, steps);
                    expect(players[0].keyframes).toEqual([
                        { width: 200, height: 0, opacity: 0, offset: 0 },
                        { width: 100, height: 400, opacity: 1, offset: 1 }
                    ]);
                });
                it('should not merge in successive style() calls to the previous animate() keyframe', function () {
                    var steps = [
                        animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: .5 })), animations_1.style({ opacity: .6 }),
                        animations_1.animate(1000, animations_1.style({ opacity: 1 }))
                    ];
                    var players = invokeAnimationSequence(rootElement, steps);
                    var keyframes = humanizeOffsets(players[0].keyframes, 4);
                    expect(keyframes).toEqual([
                        { opacity: 0, offset: 0 },
                        { opacity: .5, offset: .4998 },
                        { opacity: .6, offset: .5002 },
                        { opacity: 1, offset: 1 },
                    ]);
                });
                it('should support an easing value that uses cubic-bezier(...)', function () {
                    var steps = [
                        animations_1.style({ opacity: 0 }),
                        animations_1.animate('1s cubic-bezier(.29, .55 ,.53 ,1.53)', animations_1.style({ opacity: 1 }))
                    ];
                    var player = invokeAnimationSequence(rootElement, steps)[0];
                    var firstKeyframe = player.keyframes[0];
                    var firstKeyframeEasing = firstKeyframe['easing'];
                    expect(firstKeyframeEasing.replace(/\s+/g, '')).toEqual('cubic-bezier(.29,.55,.53,1.53)');
                });
            });
            describe('sequence()', function () {
                it('should not produce extra timelines when multiple sequences are used within each other', function () {
                    var steps = [
                        animations_1.style({ width: 0 }),
                        animations_1.animate(1000, animations_1.style({ width: 100 })),
                        animations_1.sequence([
                            animations_1.animate(1000, animations_1.style({ width: 200 })),
                            animations_1.sequence([
                                animations_1.animate(1000, animations_1.style({ width: 300 })),
                            ]),
                        ]),
                        animations_1.animate(1000, animations_1.style({ width: 400 })),
                        animations_1.sequence([
                            animations_1.animate(1000, animations_1.style({ width: 500 })),
                        ]),
                    ];
                    var players = invokeAnimationSequence(rootElement, steps);
                    expect(players.length).toEqual(1);
                    var player = players[0];
                    expect(player.keyframes).toEqual([
                        { width: 0, offset: 0 }, { width: 100, offset: .2 }, { width: 200, offset: .4 },
                        { width: 300, offset: .6 }, { width: 400, offset: .8 }, { width: 500, offset: 1 }
                    ]);
                });
                it('should create a new timeline after a sequence if group() or keyframe() commands are used within', function () {
                    var steps = [
                        animations_1.style({ width: 100, height: 100 }), animations_1.animate(1000, animations_1.style({ width: 150, height: 150 })),
                        animations_1.sequence([
                            animations_1.group([
                                animations_1.animate(1000, animations_1.style({ height: 200 })),
                            ]),
                            animations_1.animate(1000, animations_1.keyframes([animations_1.style({ width: 180 }), animations_1.style({ width: 200 })]))
                        ]),
                        animations_1.animate(1000, animations_1.style({ width: 500, height: 500 }))
                    ];
                    var players = invokeAnimationSequence(rootElement, steps);
                    expect(players.length).toEqual(4);
                    var finalPlayer = players[players.length - 1];
                    expect(finalPlayer.keyframes).toEqual([
                        { width: 200, height: 200, offset: 0 }, { width: 500, height: 500, offset: 1 }
                    ]);
                });
                it('should push the start of a sequence if a delay option is provided', function () {
                    var steps = [
                        animations_1.style({ width: '0px' }), animations_1.animate(1000, animations_1.style({ width: '100px' })),
                        animations_1.sequence([
                            animations_1.animate(1000, animations_1.style({ width: '200px' })),
                        ], { delay: 500 })
                    ];
                    var players = invokeAnimationSequence(rootElement, steps);
                    var finalPlayer = players[players.length - 1];
                    expect(finalPlayer.keyframes).toEqual([
                        { width: '100px', offset: 0 },
                        { width: '200px', offset: 1 },
                    ]);
                    expect(finalPlayer.delay).toEqual(1500);
                });
            });
            describe('substitutions', function () {
                it('should allow params to be substituted even if they are not defaulted in a reusable animation', function () {
                    var myAnimation = animations_1.animation([
                        animations_1.style({ left: '{{ start }}' }),
                        animations_1.animate(1000, animations_1.style({ left: '{{ end }}' })),
                    ]);
                    var steps = [
                        animations_1.useAnimation(myAnimation, { params: { start: '0px', end: '100px' } }),
                    ];
                    var players = invokeAnimationSequence(rootElement, steps, {});
                    expect(players.length).toEqual(1);
                    var player = players[0];
                    expect(player.keyframes).toEqual([
                        { left: '0px', offset: 0 },
                        { left: '100px', offset: 1 },
                    ]);
                });
                it('should substitute in timing values', function () {
                    function makeAnimation(exp, options) {
                        var steps = [animations_1.style({ opacity: 0 }), animations_1.animate(exp, animations_1.style({ opacity: 1 }))];
                        return invokeAnimationSequence(rootElement, steps, options);
                    }
                    var players = makeAnimation('{{ duration }}', buildParams({ duration: '1234ms' }));
                    expect(players[0].duration).toEqual(1234);
                    players = makeAnimation('{{ duration }}', buildParams({ duration: '9s 2s' }));
                    expect(players[0].duration).toEqual(11000);
                    players = makeAnimation('{{ duration }} 1s', buildParams({ duration: '1.5s' }));
                    expect(players[0].duration).toEqual(2500);
                    players = makeAnimation('{{ duration }} {{ delay }}', buildParams({ duration: '1s', delay: '2s' }));
                    expect(players[0].duration).toEqual(3000);
                });
                it('should allow multiple substitutions to occur within the same style value', function () {
                    var steps = [
                        animations_1.style({ borderRadius: '100px 100px' }),
                        animations_1.animate(1000, animations_1.style({ borderRadius: '{{ one }}px {{ two }}' })),
                    ];
                    var players = invokeAnimationSequence(rootElement, steps, buildParams({ one: '200', two: '400px' }));
                    expect(players[0].keyframes).toEqual([
                        { offset: 0, borderRadius: '100px 100px' }, { offset: 1, borderRadius: '200px 400px' }
                    ]);
                });
                it('should substitute in values that are defined as parameters for inner areas of a sequence', function () {
                    var steps = animations_1.sequence([
                        animations_1.sequence([
                            animations_1.sequence([
                                animations_1.style({ height: '{{ x0 }}px' }),
                                animations_1.animate(1000, animations_1.style({ height: '{{ x2 }}px' })),
                            ], buildParams({ x2: '{{ x1 }}3' })),
                        ], buildParams({ x1: '{{ x0 }}2' })),
                    ], buildParams({ x0: '1' }));
                    var players = invokeAnimationSequence(rootElement, steps);
                    expect(players.length).toEqual(1);
                    var player = players[0];
                    expect(player.keyframes).toEqual([
                        { offset: 0, height: '1px' }, { offset: 1, height: '123px' }
                    ]);
                });
                it('should substitute in values that are defined as parameters for reusable animations', function () {
                    var anim = animations_1.animation([
                        animations_1.style({ height: '{{ start }}' }),
                        animations_1.animate(1000, animations_1.style({ height: '{{ end }}' })),
                    ]);
                    var steps = animations_1.sequence([
                        animations_1.sequence([
                            animations_1.useAnimation(anim, buildParams({ start: '{{ a }}', end: '{{ b }}' })),
                        ], buildParams({ a: '100px', b: '200px' })),
                    ], buildParams({ a: '0px' }));
                    var players = invokeAnimationSequence(rootElement, steps);
                    expect(players.length).toEqual(1);
                    var player = players[0];
                    expect(player.keyframes).toEqual([
                        { offset: 0, height: '100px' }, { offset: 1, height: '200px' }
                    ]);
                });
                it('should throw an error when an input variable is not provided when invoked and is not a default value', function () {
                    expect(function () { return invokeAnimationSequence(rootElement, [animations_1.style({ color: '{{ color }}' })]); })
                        .toThrowError(/Please provide a value for the animation param color/);
                    expect(function () { return invokeAnimationSequence(rootElement, [
                        animations_1.style({ color: '{{ start }}' }),
                        animations_1.animate('{{ time }}', animations_1.style({ color: '{{ end }}' })),
                    ], buildParams({ start: 'blue', end: 'red' })); })
                        .toThrowError(/Please provide a value for the animation param time/);
                });
            });
            describe('keyframes()', function () {
                it('should produce a sub timeline when `keyframes()` is used within a sequence', function () {
                    var steps = [
                        animations_1.animate(1000, animations_1.style({ opacity: .5 })), animations_1.animate(1000, animations_1.style({ opacity: 1 })),
                        animations_1.animate(1000, animations_1.keyframes([animations_1.style({ height: 0 }), animations_1.style({ height: 100 }), animations_1.style({ height: 50 })])),
                        animations_1.animate(1000, animations_1.style({ height: 0, opacity: 0 }))
                    ];
                    var players = invokeAnimationSequence(rootElement, steps);
                    expect(players.length).toEqual(3);
                    var player0 = players[0];
                    expect(player0.delay).toEqual(0);
                    expect(player0.keyframes).toEqual([
                        { opacity: animations_1.AUTO_STYLE, offset: 0 },
                        { opacity: .5, offset: .5 },
                        { opacity: 1, offset: 1 },
                    ]);
                    var subPlayer = players[1];
                    expect(subPlayer.delay).toEqual(2000);
                    expect(subPlayer.keyframes).toEqual([
                        { height: 0, offset: 0 },
                        { height: 100, offset: .5 },
                        { height: 50, offset: 1 },
                    ]);
                    var player1 = players[2];
                    expect(player1.delay).toEqual(3000);
                    expect(player1.keyframes).toEqual([
                        { opacity: 1, height: 50, offset: 0 }, { opacity: 0, height: 0, offset: 1 }
                    ]);
                });
                it('should propagate inner keyframe style data to the parent timeline if used afterwards', function () {
                    var steps = [
                        animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: .5 })),
                        animations_1.animate(1000, animations_1.style({ opacity: 1 })), animations_1.animate(1000, animations_1.keyframes([
                            animations_1.style({ color: 'red' }),
                            animations_1.style({ color: 'blue' }),
                        ])),
                        animations_1.animate(1000, animations_1.style({ color: 'green', opacity: 0 }))
                    ];
                    var players = invokeAnimationSequence(rootElement, steps);
                    var finalPlayer = players[players.length - 1];
                    expect(finalPlayer.keyframes).toEqual([
                        { opacity: 1, color: 'blue', offset: 0 }, { opacity: 0, color: 'green', offset: 1 }
                    ]);
                });
                it('should feed in starting data into inner keyframes if used in an style step beforehand', function () {
                    var steps = [
                        animations_1.animate(1000, animations_1.style({ opacity: .5 })), animations_1.animate(1000, animations_1.keyframes([
                            animations_1.style({ opacity: .8, offset: .5 }),
                            animations_1.style({ opacity: 1, offset: 1 }),
                        ]))
                    ];
                    var players = invokeAnimationSequence(rootElement, steps);
                    expect(players.length).toEqual(2);
                    var topPlayer = players[0];
                    expect(topPlayer.keyframes).toEqual([
                        { opacity: animations_1.AUTO_STYLE, offset: 0 }, { opacity: .5, offset: 1 }
                    ]);
                    var subPlayer = players[1];
                    expect(subPlayer.keyframes).toEqual([
                        { opacity: .5, offset: 0 }, { opacity: .8, offset: 0.5 }, { opacity: 1, offset: 1 }
                    ]);
                });
                it('should set the easing value as an easing value for the entire timeline', function () {
                    var steps = [
                        animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: .5 })),
                        animations_1.animate('1s ease-out', animations_1.keyframes([animations_1.style({ opacity: .8, offset: .5 }), animations_1.style({ opacity: 1, offset: 1 })]))
                    ];
                    var player = invokeAnimationSequence(rootElement, steps)[1];
                    expect(player.easing).toEqual('ease-out');
                });
                it('should combine the starting time + the given delay as the delay value for the animated keyframes', function () {
                    var steps = [
                        animations_1.style({ opacity: 0 }), animations_1.animate(500, animations_1.style({ opacity: .5 })),
                        animations_1.animate('1s 2s ease-out', animations_1.keyframes([animations_1.style({ opacity: .8, offset: .5 }), animations_1.style({ opacity: 1, offset: 1 })]))
                    ];
                    var player = invokeAnimationSequence(rootElement, steps)[1];
                    expect(player.delay).toEqual(2500);
                });
                it('should not leak in additional styles used later on after keyframe styles have already been declared', function () {
                    var steps = [
                        animations_1.animate(1000, animations_1.style({ height: '50px' })),
                        animations_1.animate(2000, animations_1.keyframes([
                            animations_1.style({ left: '0', top: '0', offset: 0 }),
                            animations_1.style({ left: '40%', top: '50%', offset: .33 }),
                            animations_1.style({ left: '60%', top: '80%', offset: .66 }),
                            animations_1.style({ left: 'calc(100% - 100px)', top: '100%', offset: 1 }),
                        ])),
                        animations_1.group([animations_1.animate('2s', animations_1.style({ width: '200px' }))]),
                        animations_1.animate('2s', animations_1.style({ height: '300px' })),
                        animations_1.group([animations_1.animate('2s', animations_1.style({ height: '500px', width: '500px' }))])
                    ];
                    var players = invokeAnimationSequence(rootElement, steps);
                    expect(players.length).toEqual(5);
                    var firstPlayerKeyframes = players[0].keyframes;
                    expect(firstPlayerKeyframes[0]['width']).toBeFalsy();
                    expect(firstPlayerKeyframes[1]['width']).toBeFalsy();
                    expect(firstPlayerKeyframes[0]['height']).toEqual(animations_1.AUTO_STYLE);
                    expect(firstPlayerKeyframes[1]['height']).toEqual('50px');
                    var keyframePlayerKeyframes = players[1].keyframes;
                    expect(keyframePlayerKeyframes[0]['width']).toBeFalsy();
                    expect(keyframePlayerKeyframes[0]['height']).toBeFalsy();
                    var groupPlayerKeyframes = players[2].keyframes;
                    expect(groupPlayerKeyframes[0]['width']).toEqual(animations_1.AUTO_STYLE);
                    expect(groupPlayerKeyframes[1]['width']).toEqual('200px');
                    expect(groupPlayerKeyframes[0]['height']).toBeFalsy();
                    expect(groupPlayerKeyframes[1]['height']).toBeFalsy();
                    var secondToFinalAnimatePlayerKeyframes = players[3].keyframes;
                    expect(secondToFinalAnimatePlayerKeyframes[0]['width']).toBeFalsy();
                    expect(secondToFinalAnimatePlayerKeyframes[1]['width']).toBeFalsy();
                    expect(secondToFinalAnimatePlayerKeyframes[0]['height']).toEqual('50px');
                    expect(secondToFinalAnimatePlayerKeyframes[1]['height']).toEqual('300px');
                    var finalAnimatePlayerKeyframes = players[4].keyframes;
                    expect(finalAnimatePlayerKeyframes[0]['width']).toEqual('200px');
                    expect(finalAnimatePlayerKeyframes[1]['width']).toEqual('500px');
                    expect(finalAnimatePlayerKeyframes[0]['height']).toEqual('300px');
                    expect(finalAnimatePlayerKeyframes[1]['height']).toEqual('500px');
                });
                it('should respect offsets if provided directly within the style data', function () {
                    var steps = animations_1.animate(1000, animations_1.keyframes([
                        animations_1.style({ opacity: 0, offset: 0 }), animations_1.style({ opacity: .6, offset: .6 }),
                        animations_1.style({ opacity: 1, offset: 1 })
                    ]));
                    var players = invokeAnimationSequence(rootElement, steps);
                    expect(players.length).toEqual(1);
                    var player = players[0];
                    expect(player.keyframes).toEqual([
                        { opacity: 0, offset: 0 }, { opacity: .6, offset: .6 }, { opacity: 1, offset: 1 }
                    ]);
                });
                it('should respect offsets if provided directly within the style metadata type', function () {
                    var steps = animations_1.animate(1000, animations_1.keyframes([
                        { type: 6 /* Style */, offset: 0, styles: { opacity: 0 } },
                        { type: 6 /* Style */, offset: .4, styles: { opacity: .4 } },
                        { type: 6 /* Style */, offset: 1, styles: { opacity: 1 } },
                    ]));
                    var players = invokeAnimationSequence(rootElement, steps);
                    expect(players.length).toEqual(1);
                    var player = players[0];
                    expect(player.keyframes).toEqual([
                        { opacity: 0, offset: 0 }, { opacity: .4, offset: .4 }, { opacity: 1, offset: 1 }
                    ]);
                });
            });
            describe('group()', function () {
                it('should properly tally style data within a group() for use in a follow-up animate() step', function () {
                    var steps = [
                        animations_1.style({ width: 0, height: 0 }), animations_1.animate(1000, animations_1.style({ width: 20, height: 50 })),
                        animations_1.group([animations_1.animate('1s 1s', animations_1.style({ width: 200 })), animations_1.animate('1s', animations_1.style({ height: 500 }))]),
                        animations_1.animate(1000, animations_1.style({ width: 1000, height: 1000 }))
                    ];
                    var players = invokeAnimationSequence(rootElement, steps);
                    expect(players.length).toEqual(4);
                    var player0 = players[0];
                    expect(player0.duration).toEqual(1000);
                    expect(player0.keyframes).toEqual([
                        { width: 0, height: 0, offset: 0 }, { width: 20, height: 50, offset: 1 }
                    ]);
                    var gPlayer1 = players[1];
                    expect(gPlayer1.duration).toEqual(2000);
                    expect(gPlayer1.delay).toEqual(1000);
                    expect(gPlayer1.keyframes).toEqual([
                        { width: 20, offset: 0 }, { width: 20, offset: .5 }, { width: 200, offset: 1 }
                    ]);
                    var gPlayer2 = players[2];
                    expect(gPlayer2.duration).toEqual(1000);
                    expect(gPlayer2.delay).toEqual(1000);
                    expect(gPlayer2.keyframes).toEqual([
                        { height: 50, offset: 0 }, { height: 500, offset: 1 }
                    ]);
                    var player1 = players[3];
                    expect(player1.duration).toEqual(1000);
                    expect(player1.delay).toEqual(3000);
                    expect(player1.keyframes).toEqual([
                        { width: 200, height: 500, offset: 0 }, { width: 1000, height: 1000, offset: 1 }
                    ]);
                });
                it('should support groups with nested sequences', function () {
                    var steps = [animations_1.group([
                            animations_1.sequence([
                                animations_1.style({ opacity: 0 }),
                                animations_1.animate(1000, animations_1.style({ opacity: 1 })),
                            ]),
                            animations_1.sequence([
                                animations_1.style({ width: 0 }),
                                animations_1.animate(1000, animations_1.style({ width: 200 })),
                            ])
                        ])];
                    var players = invokeAnimationSequence(rootElement, steps);
                    expect(players.length).toEqual(2);
                    var gPlayer1 = players[0];
                    expect(gPlayer1.delay).toEqual(0);
                    expect(gPlayer1.keyframes).toEqual([
                        { opacity: 0, offset: 0 },
                        { opacity: 1, offset: 1 },
                    ]);
                    var gPlayer2 = players[1];
                    expect(gPlayer1.delay).toEqual(0);
                    expect(gPlayer2.keyframes).toEqual([{ width: 0, offset: 0 }, { width: 200, offset: 1 }]);
                });
                it('should respect delays after group entries', function () {
                    var steps = [
                        animations_1.style({ width: 0, height: 0 }), animations_1.animate(1000, animations_1.style({ width: 50, height: 50 })), animations_1.group([
                            animations_1.animate(1000, animations_1.style({ width: 100 })),
                            animations_1.animate(1000, animations_1.style({ height: 100 })),
                        ]),
                        animations_1.animate('1s 1s', animations_1.style({ height: 200, width: 200 }))
                    ];
                    var players = invokeAnimationSequence(rootElement, steps);
                    expect(players.length).toEqual(4);
                    var finalPlayer = players[players.length - 1];
                    expect(finalPlayer.delay).toEqual(2000);
                    expect(finalPlayer.duration).toEqual(2000);
                    expect(finalPlayer.keyframes).toEqual([
                        { width: 100, height: 100, offset: 0 },
                        { width: 100, height: 100, offset: .5 },
                        { width: 200, height: 200, offset: 1 },
                    ]);
                });
                it('should respect delays after multiple calls to group()', function () {
                    var steps = [
                        animations_1.group([animations_1.animate('2s', animations_1.style({ opacity: 1 })), animations_1.animate('2s', animations_1.style({ width: '100px' }))]),
                        animations_1.animate(2000, animations_1.style({ width: 0, opacity: 0 })),
                        animations_1.group([animations_1.animate('2s', animations_1.style({ opacity: 1 })), animations_1.animate('2s', animations_1.style({ width: '200px' }))]),
                        animations_1.animate(2000, animations_1.style({ width: 0, opacity: 0 }))
                    ];
                    var players = invokeAnimationSequence(rootElement, steps);
                    var middlePlayer = players[2];
                    expect(middlePlayer.delay).toEqual(2000);
                    expect(middlePlayer.duration).toEqual(2000);
                    var finalPlayer = players[players.length - 1];
                    expect(finalPlayer.delay).toEqual(6000);
                    expect(finalPlayer.duration).toEqual(2000);
                });
                it('should push the start of a group if a delay option is provided', function () {
                    var steps = [
                        animations_1.style({ width: '0px', height: '0px' }),
                        animations_1.animate(1500, animations_1.style({ width: '100px', height: '100px' })),
                        animations_1.group([
                            animations_1.animate(1000, animations_1.style({ width: '200px' })),
                            animations_1.animate(2000, animations_1.style({ height: '200px' })),
                        ], { delay: 300 })
                    ];
                    var players = invokeAnimationSequence(rootElement, steps);
                    var finalWidthPlayer = players[players.length - 2];
                    var finalHeightPlayer = players[players.length - 1];
                    expect(finalWidthPlayer.delay).toEqual(1800);
                    expect(finalWidthPlayer.keyframes).toEqual([
                        { width: '100px', offset: 0 },
                        { width: '200px', offset: 1 },
                    ]);
                    expect(finalHeightPlayer.delay).toEqual(1800);
                    expect(finalHeightPlayer.keyframes).toEqual([
                        { height: '100px', offset: 0 },
                        { height: '200px', offset: 1 },
                    ]);
                });
            });
            describe('query()', function () {
                it('should delay the query operation if a delay option is provided', function () {
                    var steps = [
                        animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: 1 })),
                        animations_1.query('div', [
                            animations_1.style({ width: 0 }),
                            animations_1.animate(500, animations_1.style({ width: 200 })),
                        ], { delay: 200 })
                    ];
                    var players = invokeAnimationSequence(rootElement, steps);
                    var finalPlayer = players[players.length - 1];
                    expect(finalPlayer.delay).toEqual(1200);
                });
                it('should throw an error when an animation query returns zero elements', function () {
                    var steps = [animations_1.query('somethingFake', [animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: 1 }))])];
                    expect(function () { invokeAnimationSequence(rootElement, steps); })
                        .toThrowError(/`query\("somethingFake"\)` returned zero elements\. \(Use `query\("somethingFake", \{ optional: true \}\)` if you wish to allow this\.\)/);
                });
                it('should allow a query to be skipped if it is set as optional and returns zero elements', function () {
                    var steps = [animations_1.query('somethingFake', [animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: 1 }))], { optional: true })];
                    expect(function () { invokeAnimationSequence(rootElement, steps); }).not.toThrow();
                    var steps2 = [animations_1.query('fakeSomethings', [animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: 1 }))], { optional: true })];
                    expect(function () { invokeAnimationSequence(rootElement, steps2); }).not.toThrow();
                });
                it('should delay the query operation if a delay option is provided', function () {
                    var steps = [
                        animations_1.style({ opacity: 0 }), animations_1.animate(1300, animations_1.style({ opacity: 1 })),
                        animations_1.query('div', [
                            animations_1.style({ width: 0 }),
                            animations_1.animate(500, animations_1.style({ width: 200 })),
                        ], { delay: 300 })
                    ];
                    var players = invokeAnimationSequence(rootElement, steps);
                    var fp1 = players[players.length - 2];
                    var fp2 = players[players.length - 1];
                    expect(fp1.delay).toEqual(1600);
                    expect(fp2.delay).toEqual(1600);
                });
            });
            describe('timing values', function () {
                it('should properly combine an easing value with a delay into a set of three keyframes', function () {
                    var steps = [animations_1.style({ opacity: 0 }), animations_1.animate('3s 1s ease-out', animations_1.style({ opacity: 1 }))];
                    var player = invokeAnimationSequence(rootElement, steps)[0];
                    expect(player.keyframes).toEqual([
                        { opacity: 0, offset: 0 }, { opacity: 0, offset: .25, easing: 'ease-out' },
                        { opacity: 1, offset: 1 }
                    ]);
                });
                it('should allow easing values to exist for each animate() step', function () {
                    var steps = [
                        animations_1.style({ width: 0 }), animations_1.animate('1s linear', animations_1.style({ width: 10 })),
                        animations_1.animate('2s ease-out', animations_1.style({ width: 20 })), animations_1.animate('1s ease-in', animations_1.style({ width: 30 }))
                    ];
                    var players = invokeAnimationSequence(rootElement, steps);
                    expect(players.length).toEqual(1);
                    var player = players[0];
                    expect(player.keyframes).toEqual([
                        { width: 0, offset: 0, easing: 'linear' }, { width: 10, offset: .25, easing: 'ease-out' },
                        { width: 20, offset: .75, easing: 'ease-in' }, { width: 30, offset: 1 }
                    ]);
                });
                it('should produce a top-level timeline only for the duration that is set as before a group kicks in', function () {
                    var steps = [
                        animations_1.style({ width: 0, height: 0, opacity: 0 }),
                        animations_1.animate('1s', animations_1.style({ width: 100, height: 100, opacity: .2 })), animations_1.group([
                            animations_1.animate('500ms 1s', animations_1.style({ width: 500 })), animations_1.animate('1s', animations_1.style({ height: 500 })),
                            animations_1.sequence([
                                animations_1.animate(500, animations_1.style({ opacity: .5 })),
                                animations_1.animate(500, animations_1.style({ opacity: .6 })),
                                animations_1.animate(500, animations_1.style({ opacity: .7 })),
                                animations_1.animate(500, animations_1.style({ opacity: 1 })),
                            ])
                        ])
                    ];
                    var player = invokeAnimationSequence(rootElement, steps)[0];
                    expect(player.duration).toEqual(1000);
                    expect(player.delay).toEqual(0);
                });
                it('should offset group() and keyframe() timelines with a delay which is the current time of the previous player when called', function () {
                    var steps = [
                        animations_1.style({ width: 0, height: 0 }),
                        animations_1.animate('1500ms linear', animations_1.style({ width: 10, height: 10 })), animations_1.group([
                            animations_1.animate(1000, animations_1.style({ width: 500, height: 500 })),
                            animations_1.animate(2000, animations_1.style({ width: 500, height: 500 }))
                        ]),
                        animations_1.animate(1000, animations_1.keyframes([
                            animations_1.style({ width: 200 }),
                            animations_1.style({ width: 500 }),
                        ]))
                    ];
                    var players = invokeAnimationSequence(rootElement, steps);
                    expect(players[0].delay).toEqual(0); // top-level animation
                    expect(players[1].delay).toEqual(1500); // first entry in group()
                    expect(players[2].delay).toEqual(1500); // second entry in group()
                    expect(players[3].delay).toEqual(3500); // animate(...keyframes())
                });
            });
            describe('state based data', function () {
                it('should create an empty animation if there are zero animation steps', function () {
                    var steps = [];
                    var fromStyles = [{ background: 'blue', height: 100 }];
                    var toStyles = [{ background: 'red' }];
                    var player = invokeAnimationSequence(rootElement, steps, {}, fromStyles, toStyles)[0];
                    expect(player.duration).toEqual(0);
                    expect(player.keyframes).toEqual([]);
                });
                it('should produce an animation from start to end between the to and from styles if there are animate steps in between', function () {
                    var steps = [animations_1.animate(1000)];
                    var fromStyles = [{ background: 'blue', height: 100 }];
                    var toStyles = [{ background: 'red' }];
                    var players = invokeAnimationSequence(rootElement, steps, {}, fromStyles, toStyles);
                    expect(players[0].keyframes).toEqual([
                        { background: 'blue', height: 100, offset: 0 },
                        { background: 'red', height: animations_1.AUTO_STYLE, offset: 1 }
                    ]);
                });
                it('should produce an animation from start to end between the to and from styles if there are animate steps in between with an easing value', function () {
                    var steps = [animations_1.animate('1s ease-out')];
                    var fromStyles = [{ background: 'blue' }];
                    var toStyles = [{ background: 'red' }];
                    var players = invokeAnimationSequence(rootElement, steps, {}, fromStyles, toStyles);
                    expect(players[0].keyframes).toEqual([
                        { background: 'blue', offset: 0, easing: 'ease-out' },
                        { background: 'red', offset: 1 }
                    ]);
                });
            });
        });
    });
}
function humanizeOffsets(keyframes, digits) {
    if (digits === void 0) { digits = 3; }
    return keyframes.map(function (keyframe) {
        keyframe['offset'] = Number(parseFloat(keyframe['offset']).toFixed(digits));
        return keyframe;
    });
}
function invokeAnimationSequence(element, steps, locals, startingStyles, destinationStyles, subInstructions) {
    if (locals === void 0) { locals = {}; }
    if (startingStyles === void 0) { startingStyles = []; }
    if (destinationStyles === void 0) { destinationStyles = []; }
    var driver = new testing_1.MockAnimationDriver();
    return new animation_1.Animation(driver, steps)
        .buildTimelines(element, startingStyles, destinationStyles, locals, subInstructions);
}
function validateAndThrowAnimationSequence(steps) {
    var driver = new testing_1.MockAnimationDriver();
    var errors = [];
    var ast = animation_ast_builder_1.buildAnimationAst(driver, steps, errors);
    if (errors.length) {
        throw new Error(errors.join('\n'));
    }
}
function buildParams(params) {
    return { params: params };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9hbmltYXRpb25zL2Jyb3dzZXIvdGVzdC9kc2wvYW5pbWF0aW9uX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7O0dBTUc7QUFDSCxrREFBK047QUFFL04scURBQWtEO0FBQ2xELDZFQUFzRTtBQUd0RSx5Q0FBa0Q7QUFFbEQ7SUFDRSxPQUFPLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdkMsQ0FBQztBQUVEO0lBQ0UsUUFBUSxDQUFDLFdBQVcsRUFBRTtRQUNwQixpRUFBaUU7UUFDakUsSUFBSSxNQUFNO1lBQUUsT0FBTztRQUVuQixJQUFJLFdBQWdCLENBQUM7UUFDckIsSUFBSSxXQUFnQixDQUFDO1FBQ3JCLElBQUksV0FBZ0IsQ0FBQztRQUVyQixVQUFVLENBQUM7WUFDVCxXQUFXLEdBQUcsU0FBUyxFQUFFLENBQUM7WUFDMUIsV0FBVyxHQUFHLFNBQVMsRUFBRSxDQUFDO1lBQzFCLFdBQVcsR0FBRyxTQUFTLEVBQUUsQ0FBQztZQUMxQixRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUN2QyxXQUFXLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ3JDLFdBQVcsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFDLENBQUM7UUFFSCxTQUFTLENBQUMsY0FBUSxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTdELFFBQVEsQ0FBQyxZQUFZLEVBQUU7WUFDckIsRUFBRSxDQUFDLHFGQUFxRixFQUNyRjtnQkFDRSxJQUFNLEtBQUssR0FBRyxvQkFBTyxDQUFDLElBQUksRUFBRSxzQkFBUyxDQUFDO29CQUNkLGtCQUFL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