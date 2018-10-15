"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var animations_1 = require("@angular/animations");
var browser_1 = require("@angular/animations/browser");
var shared_1 = require("@angular/animations/browser/src/render/shared");
var util_1 = require("@angular/animations/browser/src/util");
var testing_1 = require("@angular/animations/browser/testing");
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var animations_2 = require("@angular/platform-browser/animations");
var directives_1 = require("../../src/metadata/directives");
var testing_2 = require("../../testing");
var fake_async_1 = require("../../testing/src/fake_async");
(function () {
    // these tests are only mean't to be run within the DOM (for now)
    if (isNode)
        return;
    describe('animation query tests', function () {
        function getLog() {
            return testing_1.MockAnimationDriver.log;
        }
        function resetLog() { testing_1.MockAnimationDriver.log = []; }
        beforeEach(function () {
            resetLog();
            testing_2.TestBed.configureTestingModule({
                providers: [{ provide: browser_1.AnimationDriver, useClass: testing_1.MockAnimationDriver }],
                imports: [animations_2.BrowserAnimationsModule, common_1.CommonModule]
            });
        });
        describe('query()', function () {
            it('should be able to query all elements that contain animation triggers via @*', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                    }
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            template: "\n            <div [@parent]=\"exp0\">\n              <div class=\"a\" [@a]=\"exp1\"></div>\n              <div class=\"b\" [@b]=\"exp2\"></div>\n              <section>\n                <div class=\"c\" @c></div>\n              </section>\n            </div>\n          ",
                            animations: [
                                animations_1.trigger('parent', [
                                    animations_1.transition('* => go', [
                                        animations_1.query('@*', [
                                            animations_1.style({ backgroundColor: 'blue' }),
                                            animations_1.animate(1000, animations_1.style({ backgroundColor: 'red' })),
                                        ]),
                                    ]),
                                ]),
                                animations_1.trigger('a', [
                                    animations_1.transition('* => 1', [
                                        animations_1.animate(1000, animations_1.style({ opacity: 0 }))
                                    ]),
                                ]),
                                animations_1.trigger('b', [
                                    animations_1.transition('* => 1', [
                                        animations_1.animate(1000, animations_1.style({ opacity: 0 })),
                                        animations_1.query('.b-inner', [
                                            animations_1.animate(1000, animations_1.style({ opacity: 0 }))
                                        ]),
                                    ]),
                                ]),
                                animations_1.trigger('c', [
                                    animations_1.transition('* => 1', [
                                        animations_1.animate(1000, animations_1.style({ opacity: 0 }))
                                    ]),
                                ]),
                            ]
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp0 = 'go';
                fixture.detectChanges();
                var players = getLog();
                expect(players.length).toEqual(3); // a,b,c
                resetLog();
                var p1 = players[0], p2 = players[1], p3 = players[2];
                expect(p1.element.classList.contains('a')).toBeTruthy();
                expect(p2.element.classList.contains('b')).toBeTruthy();
                expect(p3.element.classList.contains('c')).toBeTruthy();
            });
            it('should be able to query currently animating elements via :animating', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                    }
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            template: "\n            <div [@parent]=\"exp0\">\n              <div class=\"a\" [@a]=\"exp1\"></div>\n              <div class=\"b\" [@b]=\"exp2\">\n                <div class=\"b-inner\"></div>\n              </div>\n              <div class=\"c\" [@c]=\"exp3\"></div>\n            </div>\n          ",
                            animations: [
                                animations_1.trigger('parent', [
                                    animations_1.transition('* => go', [
                                        animations_1.query(':animating', [
                                            animations_1.style({ backgroundColor: 'blue' }),
                                            animations_1.animate(1000, animations_1.style({ backgroundColor: 'red' })),
                                        ]),
                                    ]),
                                ]),
                                animations_1.trigger('a', [
                                    animations_1.transition('* => 1', [
                                        animations_1.animate(1000, animations_1.style({ opacity: 0 }))
                                    ]),
                                ]),
                                animations_1.trigger('b', [
                                    animations_1.transition('* => 1', [
                                        animations_1.animate(1000, animations_1.style({ opacity: 0 })),
                                        animations_1.query('.b-inner', [
                                            animations_1.animate(1000, animations_1.style({ opacity: 0 }))
                                        ]),
                                    ]),
                                ]),
                                animations_1.trigger('c', [
                                    animations_1.transition('* => 1', [
                                        animations_1.animate(1000, animations_1.style({ opacity: 0 }))
                                    ]),
                                ]),
                            ]
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp0 = '';
                cmp.exp1 = 1;
                cmp.exp2 = 1;
                // note that exp3 is skipped here
                fixture.detectChanges();
                var players = getLog();
                expect(players.length).toEqual(3); // a,b,b-inner and not c
                resetLog();
                cmp.exp0 = 'go';
                fixture.detectChanges();
                var expectedKeyframes = [
                    { backgroundColor: 'blue', offset: 0 },
                    { backgroundColor: 'red', offset: 1 },
                ];
                players = getLog();
                expect(players.length).toEqual(3);
                var p1 = players[0], p2 = players[1], p3 = players[2];
                expect(p1.element.classList.contains('a')).toBeTruthy();
                expect(p1.keyframes).toEqual(expectedKeyframes);
                expect(p2.element.classList.contains('b')).toBeTruthy();
                expect(p2.keyframes).toEqual(expectedKeyframes);
                expect(p3.element.classList.contains('b-inner')).toBeTruthy();
                expect(p3.keyframes).toEqual(expectedKeyframes);
            });
            it('should be able to query triggers directly by name', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                    }
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            template: "\n            <div [@myAnimation]=\"exp0\">\n              <div class=\"f1\" @foo></div>\n              <div class=\"f2\" [@foo]></div>\n              <div class=\"f3\" [@foo]=\"exp1\"></div>\n              <div class=\"b1\" @bar></div>\n              <div class=\"b2\" [@bar]></div>\n              <div class=\"b3\" [@bar]=\"exp2\"></div>\n            </div>\n          ",
                            animations: [
                                animations_1.trigger('foo', []),
                                animations_1.trigger('bar', []),
                                animations_1.trigger('myAnimation', [
                                    animations_1.transition('* => foo', [
                                        animations_1.query('@foo', [
                                            animations_1.animate(1000, animations_1.style({ color: 'red' })),
                                        ]),
                                    ]),
                                    animations_1.transition('* => bar', [
                                        animations_1.query('@bar', [
                                            animations_1.animate(1000, animations_1.style({ color: 'blue' })),
                                        ]),
                                    ])
                                ]),
                            ]
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                fixture.detectChanges();
                engine.flush();
                resetLog();
                cmp.exp0 = 'foo';
                fixture.detectChanges();
                engine.flush();
                var players = getLog();
                expect(players.length).toEqual(3);
                var p1 = players[0], p2 = players[1], p3 = players[2];
                resetLog();
                expect(p1.element.classList.contains('f1')).toBeTruthy();
                expect(p2.element.classList.contains('f2')).toBeTruthy();
                expect(p3.element.classList.contains('f3')).toBeTruthy();
                cmp.exp0 = 'bar';
                fixture.detectChanges();
                engine.flush();
                players = getLog();
                expect(players.length).toEqual(3);
                var p4 = players[0], p5 = players[1], p6 = players[2];
                resetLog();
                expect(p4.element.classList.contains('b1')).toBeTruthy();
                expect(p5.element.classList.contains('b2')).toBeTruthy();
                expect(p6.element.classList.contains('b3')).toBeTruthy();
            });
            it('should be able to query all active animations using :animating in a query', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                        this.items = [0, 1, 2, 3, 4];
                    }
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            template: "\n            <div [@myAnimation]=\"exp\" #parent>\n              <div *ngFor=\"let item of items\" class=\"item e-{{ item }}\">\n              </div>\n            </div>\n          ",
                            animations: [
                                animations_1.trigger('myAnimation', [
                                    animations_1.transition('* => a', [
                                        animations_1.query('.item:nth-child(odd)', [
                                            animations_1.style({ opacity: 0 }),
                                            animations_1.animate(1000, animations_1.style({ opacity: 1 })),
                                        ]),
                                    ]),
                                    animations_1.transition('* => b', [
                                        animations_1.query('.item:animating', [
                                            animations_1.style({ opacity: 1 }),
                                            animations_1.animate(1000, animations_1.style({ opacity: 0 })),
                                        ]),
                                    ]),
                                ]),
                            ]
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = 'a';
                fixture.detectChanges();
                engine.flush();
                var players = getLog();
                expect(players.length).toEqual(3);
                resetLog();
                cmp.exp = 'b';
                fixture.detectChanges();
                engine.flush();
                players = getLog();
                expect(players.length).toEqual(3);
                expect(players[0].element.classList.contains('e-0')).toBeTruthy();
                expect(players[1].element.classList.contains('e-2')).toBeTruthy();
                expect(players[2].element.classList.contains('e-4')).toBeTruthy();
            });
            it('should be able to query all actively queued animation triggers via `@*:animating`', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                    }
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            template: "\n            <div [@parent]=\"exp0\">\n              <div class=\"c1\" [@child]=\"exp1\"></div>\n              <div class=\"c2\" [@child]=\"exp2\"></div>\n              <div class=\"c3\" [@child]=\"exp3\"></div>\n              <div class=\"c4\" [@child]=\"exp4\"></div>\n              <div class=\"c5\" [@child]=\"exp5\"></div>\n            </div>\n          ",
                            animations: [
                                animations_1.trigger('parent', [
                                    animations_1.transition('* => *', [
                                        animations_1.query('@*:animating', [animations_1.animate(1000, animations_1.style({ background: 'red' }))], { optional: true }),
                                    ]),
                                ]),
                                animations_1.trigger('child', [
                                    animations_1.transition('* => *', []),
                                ])
                            ]
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp1 = 0;
                cmp.exp2 = 0;
                cmp.exp3 = 0;
                cmp.exp4 = 0;
                cmp.exp5 = 0;
                fixture.detectChanges();
                cmp.exp0 = 0;
                fixture.detectChanges();
                var players = engine.players;
                cancelAllPlayers(players);
                cmp.exp2 = 1;
                cmp.exp4 = 1;
                fixture.detectChanges();
                cmp.exp0 = 1;
                fixture.detectChanges();
                players = engine.players;
                cancelAllPlayers(players);
                expect(players.length).toEqual(3);
                cmp.exp1 = 2;
                cmp.exp2 = 2;
                cmp.exp3 = 2;
                cmp.exp4 = 2;
                cmp.exp5 = 2;
                fixture.detectChanges();
                cmp.exp0 = 2;
                fixture.detectChanges();
                players = engine.players;
                cancelAllPlayers(players);
                expect(players.length).toEqual(6);
                cmp.exp0 = 3;
                fixture.detectChanges();
                players = engine.players;
                cancelAllPlayers(players);
                expect(players.length).toEqual(1);
            });
            it('should collect styles for the same elements between queries', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                        this.items = [0, 1, 2];
                    }
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            template: "\n            <div [@myAnimation]=\"exp\">\n              <header></header>\n              <footer></footer>\n            </div>\n          ",
                            animations: [
                                animations_1.trigger('myAnimation', [
                                    animations_1.transition('* => go', [
                                        animations_1.query(':self, header, footer', animations_1.style({ opacity: '0.01' })),
                                        animations_1.animate(1000, animations_1.style({ opacity: '1' })),
                                        animations_1.query('header, footer', [
                                            animations_1.stagger(500, [
                                                animations_1.animate(1000, animations_1.style({ opacity: '1' }))
                                            ])
                                        ])
                                    ])
                                ])
                            ]
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = 'go';
                fixture.detectChanges();
                engine.flush();
                var players = getLog();
                expect(players.length).toEqual(6);
                var p1 = players[0], p2 = players[1], p3 = players[2], p4 = players[3], p5 = players[4], p6 = players[5];
                expect(p1.delay).toEqual(0);
                expect(p1.duration).toEqual(0);
                expect(p1.keyframes).toEqual([
                    { opacity: '0.01', offset: 0 },
                    { opacity: '0.01', offset: 1 },
                ]);
                expect(p2.delay).toEqual(0);
                expect(p2.duration).toEqual(0);
                expect(p2.keyframes).toEqual([
                    { opacity: '0.01', offset: 0 },
                    { opacity: '0.01', offset: 1 },
                ]);
                expect(p3.delay).toEqual(0);
                expect(p3.duration).toEqual(0);
                expect(p3.keyframes).toEqual([
                    { opacity: '0.01', offset: 0 },
                    { opacity: '0.01', offset: 1 },
                ]);
                expect(p4.delay).toEqual(0);
                expect(p4.duration).toEqual(1000);
                expect(p4.keyframes).toEqual([
                    { opacity: '0.01', offset: 0 },
                    { opacity: '1', offset: 1 },
                ]);
                expect(p5.delay).toEqual(1000);
                expect(p5.duration).toEqual(1000);
                expect(p5.keyframes).toEqual([
                    { opacity: '0.01', offset: 0 },
                    { opacity: '1', offset: 1 },
                ]);
                expect(p6.delay).toEqual(1500);
                expect(p6.duration).toEqual(1000);
                expect(p6.keyframes).toEqual([
                    { opacity: '0.01', offset: 0 },
                    { opacity: '1', offset: 1 },
                ]);
            });
            it('should retain style values when :self is used inside of a query', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                    }
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            template: "\n            <div [@myAnimation]=\"exp\"></div>\n          ",
                            animations: [animations_1.trigger('myAnimation', [animations_1.transition('* => go', [
                                        animations_1.query(':self', animations_1.style({ opacity: '0.5' })),
                                        animations_1.animate(1000, animations_1.style({ opacity: '1' }))
                                    ])])]
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = 'go';
                fixture.detectChanges();
                engine.flush();
                var players = getLog();
                expect(players.length).toEqual(2);
                var p1 = players[0], p2 = players[1];
                expect(p1.delay).toEqual(0);
                expect(p1.duration).toEqual(0);
                expect(p1.keyframes).toEqual([{ opacity: '0.5', offset: 0 }, { opacity: '0.5', offset: 1 }]);
                expect(p2.delay).toEqual(0);
                expect(p2.duration).toEqual(1000);
                expect(p2.keyframes).toEqual([{ opacity: '0.5', offset: 0 }, { opacity: '1', offset: 1 }]);
            });
            it('should properly apply stagger after various other steps within a query', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                        this.items = [0, 1, 2];
                    }
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            template: "\n            <div [@myAnimation]=\"exp\">\n              <header></header>\n              <footer></footer>\n            </div>\n          ",
                            animations: [
                                animations_1.trigger('myAnimation', [
                                    animations_1.transition('* => go', [
                                        animations_1.query(':self, header, footer', [
                                            animations_1.style({ opacity: '0' }),
                                            animations_1.animate(1000, animations_1.style({ opacity: '0.3' })),
                                            animations_1.animate(1000, animations_1.style({ opacity: '0.6' })),
                                            animations_1.stagger(500, [
                                                animations_1.animate(1000, animations_1.style({ opacity: '1' }))
                                            ])
                                        ])
                                    ])
                                ])
                            ]
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = 'go';
                fixture.detectChanges();
                engine.flush();
                var players = getLog();
                expect(players.length).toEqual(3);
                var p1 = players[0], p2 = players[1], p3 = players[2];
                expect(p1.delay).toEqual(0);
                expect(p1.duration).toEqual(3000);
                expect(p2.delay).toEqual(0);
                expect(p2.duration).toEqual(3500);
                expect(p3.delay).toEqual(0);
                expect(p3.duration).toEqual(4000);
            });
            it('should properly apply pre styling before a stagger is issued', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                        this.items = [0, 1, 2, 3, 4];
                    }
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            template: "\n          <div [@myAnimation]=\"exp\">\n            <div *ngFor=\"let item of items\" class=\"item\">\n              {{ item }}\n            </div>\n          </div>\n        ",
                            animations: [
                                animations_1.trigger('myAnimation', [
                                    animations_1.transition('* => go', [
                                        animations_1.query(':enter', [
                                            animations_1.style({ opacity: 0 }),
                                            animations_1.stagger(100, [
                                                animations_1.animate(1000, animations_1.style({ opacity: 1 })),
                                            ]),
                                        ]),
                                    ]),
                                ]),
                            ]
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = 'go';
                fixture.detectChanges();
                engine.flush();
                var players = getLog();
                expect(players.length).toEqual(5);
                for (var i = 0; i < players.length; i++) {
                    var player = players[i];
                    var kf = player.keyframes;
                    var limit = kf.length - 1;
                    var staggerDelay = 100 * i;
                    var duration = 1000 + staggerDelay;
                    expect(kf[0]).toEqual({ opacity: '0', offset: 0 });
                    if (limit > 1) {
                        var offsetAtStaggerDelay = staggerDelay / duration;
                        expect(kf[1]).toEqual({ opacity: '0', offset: offsetAtStaggerDelay });
                    }
                    expect(kf[limit]).toEqual({ opacity: '1', offset: 1 });
                    expect(player.duration).toEqual(duration);
                }
            });
            it('should apply a full stagger step delay if the timing data is left undefined', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                        this.items = [0, 1, 2, 3, 4];
                    }
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            template: "\n          <div [@myAnimation]=\"exp\">\n            <div *ngFor=\"let item of items\" class=\"item\">\n              {{ item }}\n            </div>\n          </div>\n        ",
                            animations: [animations_1.trigger('myAnimation', [animations_1.transition('* => go', [animations_1.query('.item', [animations_1.stagger('full', [
                                                animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: .5 })),
                                                animations_1.animate(500, animations_1.style({ opacity: 1 }))
                                            ])])])])]
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = 'go';
                fixture.detectChanges();
                engine.flush();
                var players = getLog();
                expect(players.length).toEqual(5);
                var p1 = players[0], p2 = players[1], p3 = players[2], p4 = players[3], p5 = players[4];
                expect(p1.delay).toEqual(0);
                expect(p2.delay).toEqual(1500);
                expect(p3.delay).toEqual(3000);
                expect(p4.delay).toEqual(4500);
                expect(p5.delay).toEqual(6000);
            });
            it('should persist inner sub trigger styles once their animation is complete', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                    }
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            template: "\n            <div @parent *ngIf=\"exp1\">\n              <div class=\"child\" [@child]=\"exp2\"></div>\n            </div>\n          ",
                            animations: [
                                animations_1.trigger('parent', [
                                    animations_1.transition(':enter', [
                                        animations_1.query('.child', [
                                            animations_1.animateChild(),
                                        ]),
                                    ]),
                                ]),
                                animations_1.trigger('child', [
                                    animations_1.state('*, void', animations_1.style({ height: '0px' })),
                                    animations_1.state('b', animations_1.style({ height: '444px' })),
                                    animations_1.transition('* => *', animations_1.animate(500)),
                                ]),
                            ]
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp1 = true;
                cmp.exp2 = 'b';
                fixture.detectChanges();
                engine.flush();
                var players = getLog();
                expect(players.length).toEqual(1);
                var player = players[0];
                expect(player.keyframes).toEqual([
                    { height: '0px', offset: 0 }, { height: '444px', offset: 1 }
                ]);
                player.finish();
                expect(player.element.style.height).toEqual('444px');
            });
            it('should find newly inserted items in the component via :enter', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                        this.items = [0, 1, 2];
                    }
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            template: "\n            <div @myAnimation>\n              <div *ngFor=\"let item of items\" class=\"child\">\n                {{ item }}\n              </div>\n            </div>\n          ",
                            animations: [animations_1.trigger('myAnimation', [
                                    animations_1.transition(':enter', [
                                        animations_1.query(':enter', [
                                            animations_1.style({ opacity: 0 }),
                                            animations_1.animate(1000, animations_1.style({ opacity: .5 })),
                                        ]),
                                    ]),
                                ])]
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                fixture.detectChanges();
                engine.flush();
                var players = getLog();
                expect(players.length).toEqual(3);
                var p1 = players[0], p2 = players[1], p3 = players[2];
                expect(p1.element.innerText.trim()).toEqual('0');
                expect(p2.element.innerText.trim()).toEqual('1');
                expect(p3.element.innerText.trim()).toEqual('2');
                players.forEach(function (p) {
                    expect(p.keyframes).toEqual([{ opacity: '0', offset: 0 }, { opacity: '0.5', offset: 1 }]);
                });
            });
            it('should cleanup :enter and :leave artifacts from nodes when any animation sequences fail to be built', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                        this.items = [];
                    }
                    __decorate([
                        core_1.ViewChild('container'),
                        __metadata("design:type", Object)
                    ], Cmp.prototype, "container", void 0);
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            template: "\n            <div [@myAnimation]=\"items.length\" class=\"parent\" #container>\n              <div *ngFor=\"let item of items\" class=\"child\">\n                {{ item }}\n              </div>\n              <div *ngIf=\"items.length == 0\" class=\"child\">Leave!</div>\n            </div>\n          ",
                            animations: [
                                animations_1.trigger('myAnimation', [
                                    animations_1.transition('* => 0', []),
                                    animations_1.transition('* => *', [
                                        animations_1.query('.child:enter', [
                                            animations_1.style({ opacity: 0 }),
                                            animations_1.animate(1000, animations_1.style({ opacity: 1 })),
                                        ]),
                                        animations_1.query('.incorrect-child:leave', [
                                            animations_1.animate(1000, animations_1.style({ opacity: 0 })),
                                        ]),
                                    ]),
                                ]),
                            ]
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.items = [];
                fixture.detectChanges();
                cmp.items = [0, 1, 2, 3, 4];
                expect(function () { fixture.detectChanges(); }).toThrow();
                var children = cmp.container.nativeElement.querySelectorAll('.child');
                expect(children.length).toEqual(5);
                for (var i = 0; i < children.length; i++) {
                    var child = children[i];
                    expect(child.classList.contains(util_1.ENTER_CLASSNAME)).toBe(false);
                    expect(child.classList.contains(util_1.LEAVE_CLASSNAME)).toBe(false);
                }
            });
            it('should find elements that have been removed via :leave', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                        this.items = [4, 2, 0];
                    }
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            template: "\n            <div [@myAnimation]=\"exp\" class=\"parent\">\n              <div *ngFor=\"let item of items\" class=\"child\">\n                {{ item }}\n              </div>\n            </div>\n          ",
                            animations: [animations_1.trigger('myAnimation', [
                                    animations_1.transition('a => b', [animations_1.query(':leave', [animations_1.style({ opacity: 1 }), animations_1.animate(1000, animations_1.style({ opacity: .5 }))])]),
                                ])]
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = 'a';
                fixture.detectChanges();
                engine.flush();
                resetLog();
                cmp.exp = 'b';
                cmp.items = [];
                fixture.detectChanges();
                engine.flush();
                var players = getLog();
                expect(players.length).toEqual(3);
                var p1 = players[0], p2 = players[1], p3 = players[2];
                expect(p1.element.innerText.trim()).toEqual('4');
                expect(p2.element.innerText.trim()).toEqual('2');
                expect(p3.element.innerText.trim()).toEqual('0');
                players.forEach(function (p) {
                    expect(p.keyframes).toEqual([{ opacity: '1', offset: 0 }, { opacity: '0.5', offset: 1 }]);
                });
            });
            it('should find :enter nodes that have been inserted around non enter nodes', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                        this.items = [];
                    }
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            template: "\n            <div [@myAnimation]=\"exp\" class=\"parent\">\n              <div *ngFor=\"let item of items\" class=\"child\">\n                {{ item }}\n              </div>\n            </div>\n          ",
                            animations: [animations_1.trigger('myAnimation', [
                                    animations_1.transition('* => go', [animations_1.query(':enter', [animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: 1 }))])]),
                                ])]
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = 'no';
                cmp.items = [2];
                fixture.detectChanges();
                engine.flush();
                resetLog();
                cmp.exp = 'go';
                cmp.items = [0, 1, 2, 3, 4];
                fixture.detectChanges();
                engine.flush();
                var players = getLog();
                expect(players.length).toEqual(4);
                var p1 = players[0], p2 = players[1], p3 = players[2], p4 = players[3];
                expect(p1.element.innerText.trim()).toEqual('0');
                expect(p2.element.innerText.trim()).toEqual('1');
                expect(p3.element.innerText.trim()).toEqual('3');
                expect(p4.element.innerText.trim()).toEqual('4');
            });
            it('should find :enter/:leave nodes that are nested inside of ng-container elements', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                    }
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            template: "\n            <div [@myAnimation]=\"items.length\" class=\"parent\">\n              <ng-container *ngFor=\"let item of items\">\n                <section>\n                  <div *ngIf=\"item % 2 == 0\">even {{ item }}</div>\n                  <div *ngIf=\"item % 2 == 1\">odd {{ item }}</div>\n                </section>\n              </ng-container>\n            </div>\n          ",
                            animations: [animations_1.trigger('myAnimation', [
                                    animations_1.transition('0 => 5', [
                                        animations_1.query(':enter', [
                                            animations_1.style({ opacity: '0' }),
                                            animations_1.animate(1000, animations_1.style({ opacity: '1' }))
                                        ])
                                    ]),
                                    animations_1.transition('5 => 0', [
                                        animations_1.query(':leave', [
                                            animations_1.style({ opacity: '1' }),
                                            animations_1.animate(1000, animations_1.style({ opacity: '0' }))
                                        ])
                                    ]),
                                ])]
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.items = [];
                fixture.detectChanges();
                engine.flush();
                resetLog();
                cmp.items = [0, 1, 2, 3, 4];
                fixture.detectChanges();
                engine.flush();
                var players = getLog();
                expect(players.length).toEqual(5);
                for (var i = 0; i < 5; i++) {
                    var player = players[i];
                    expect(player.keyframes).toEqual([
                        { opacity: '0', offset: 0 },
                        { opacity: '1', offset: 1 },
                    ]);
                    var elm = player.element;
                    var text = i % 2 == 0 ? "even " + i : "odd " + i;
                    expect(elm.innerText.trim()).toEqual(text);
                }
                resetLog();
                cmp.items = [];
                fixture.detectChanges();
                engine.flush();
                players = getLog();
                expect(players.length).toEqual(5);
                for (var i = 0; i < 5; i++) {
                    var player = players[i];
                    expect(player.keyframes).toEqual([
                        { opacity: '1', offset: 0 },
                        { opacity: '0', offset: 1 },
                    ]);
                    var elm = player.element;
                    var text = i % 2 == 0 ? "even " + i : "odd " + i;
                    expect(elm.innerText.trim()).toEqual(text);
                }
            });
            it('should properly cancel items that were queried into a former animation and pass in the associated styles into the follow-up players per element', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                    }
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            template: "\n            <div [@myAnimation]=\"exp\" class=\"parent\">\n              <div *ngFor=\"let item of items\" class=\"child\">\n                {{ item }}\n              </div>\n            </div>\n          ",
                            animations: [animations_1.trigger('myAnimation', [
                                    animations_1.transition('* => on', [
                                        animations_1.query(':enter', [animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: 1 }))]),
                                        animations_1.query(':enter', [animations_1.style({ width: 0 }), animations_1.animate(1000, animations_1.style({ height: 200 }))])
                                    ]),
                                    animations_1.transition('* => off', [
                                        animations_1.query(':leave', [animations_1.animate(1000, animations_1.style({ width: 0 }))]),
                                        animations_1.query(':leave', [animations_1.animate(1000, animations_1.style({ opacity: 0 }))])
                                    ]),
                                ])]
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = 'on';
                cmp.items = [0, 1, 2, 3, 4];
                fixture.detectChanges();
                engine.flush();
                var previousPlayers = getLog();
                expect(previousPlayers.length).toEqual(10);
                resetLog();
                cmp.exp = 'off';
                cmp.items = [0, 1, 2];
                fixture.detectChanges();
                engine.flush();
                var players = getLog();
                expect(players.length).toEqual(4);
                var p1 = players[0], p2 = players[1], p3 = players[2], p4 = players[3];
                // p1 && p2 are the starting players for item3 and item4
                expect(p1.previousStyles)
                    .toEqual({ opacity: animations_1.AUTO_STYLE, width: animations_1.AUTO_STYLE, height: animations_1.AUTO_STYLE });
                expect(p2.previousStyles)
                    .toEqual({ opacity: animations_1.AUTO_STYLE, width: animations_1.AUTO_STYLE, height: animations_1.AUTO_STYLE });
                // p3 && p4 are the following players for item3 and item4
                expect(p3.previousStyles).toEqual({});
                expect(p4.previousStyles).toEqual({});
            });
            it('should not remove a parent container if its contents are queried into by an ancestor element', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                        this.exp1 = '';
                        this.exp2 = true;
                    }
                    __decorate([
                        core_1.ViewChild('ancestor'),
                        __metadata("design:type", Object)
                    ], Cmp.prototype, "ancestorElm", void 0);
                    __decorate([
                        core_1.ViewChild('parent'),
                        __metadata("design:type", Object)
                    ], Cmp.prototype, "parentElm", void 0);
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            template: "\n            <div [@myAnimation]=\"exp1\" class=\"ancestor\" #ancestor>\n              <div class=\"parent\" *ngIf=\"exp2\" #parent>\n                <div class=\"child\"></div>\n                <div class=\"child\"></div>\n              </div>\n            </div>\n          ",
                            animations: [
                                animations_1.trigger('myAnimation', [
                                    animations_1.transition('* => go', [
                                        animations_1.query('.child', [
                                            animations_1.style({ opacity: 0 }),
                                            animations_1.animate(1000, animations_1.style({ opacity: 1 })),
                                        ]),
                                    ]),
                                ]),
                            ]
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                fixture.detectChanges();
                engine.flush();
                resetLog();
                var ancestorElm = cmp.ancestorElm.nativeElement;
                var parentElm = cmp.parentElm.nativeElement;
                cmp.exp1 = 'go';
                cmp.exp2 = false;
                fixture.detectChanges();
                engine.flush();
                expect(ancestorElm.contains(parentElm)).toBe(true);
                var players = getLog();
                expect(players.length).toEqual(2);
                var p1 = players[0], p2 = players[1];
                expect(parentElm.contains(p1.element)).toBe(true);
                expect(parentElm.contains(p2.element)).toBe(true);
                cancelAllPlayers(players);
                expect(ancestorElm.contains(parentElm)).toBe(false);
            });
            it('should only retain a to-be-removed node if the inner queried items are apart of an animation issued by an ancestor', fake_async_1.fakeAsync(function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                        this.exp1 = '';
                        this.exp2 = '';
                        this.parentExp = true;
                    }
                    __decorate([
                        core_1.ViewChild('ancestor'),
                        __metadata("design:type", Object)
                    ], Cmp.prototype, "ancestorElm", void 0);
                    __decorate([
                        core_1.ViewChild('parent'),
                        __metadata("design:type", Object)
                    ], Cmp.prototype, "parentElm", void 0);
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            template: "\n            <div [@one]=\"exp1\" [@two]=\"exp2\" class=\"ancestor\" #ancestor>\n              <header>hello</header>\n              <div class=\"parent\" *ngIf=\"parentExp\" #parent>\n                <div class=\"child\">child</div>\n              </div>\n            </div>\n          ",
                            animations: [
                                animations_1.trigger('one', [
                                    animations_1.transition('* => go', [
                                        animations_1.query('.child', [
                                            animations_1.style({ height: '100px' }),
                                            animations_1.animate(1000, animations_1.style({ height: '0px' })),
                                        ]),
                                    ]),
                                ]),
                                animations_1.trigger('two', [
                                    animations_1.transition('* => go', [animations_1.query('header', [
                                            animations_1.style({ width: '100px' }),
                                            animations_1.animate(1000, animations_1.style({ width: '0px' })),
                                        ])]),
                                ]),
                            ]
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                fixture.detectChanges();
                engine.flush();
                resetLog();
                var ancestorElm = cmp.ancestorElm.nativeElement;
                var parentElm = cmp.parentElm.nativeElement;
                expect(ancestorElm.contains(parentElm)).toBe(true);
                cmp.exp1 = 'go';
                fixture.detectChanges();
                engine.flush();
                expect(ancestorElm.contains(parentElm)).toBe(true);
                var onePlayers = getLog();
                expect(onePlayers.length).toEqual(1); // element.child
                var childPlayer = onePlayers[0];
                var childPlayerComplete = false;
                childPlayer.onDone(function () { return childPlayerComplete = true; });
                resetLog();
                fake_async_1.flushMicrotasks();
                expect(childPlayerComplete).toBe(false);
                cmp.exp2 = 'go';
                cmp.parentExp = false;
                fixture.detectChanges();
                engine.flush();
                var twoPlayers = getLog();
                expect(twoPlayers.length).toEqual(1); // the header element
                expect(ancestorElm.contains(parentElm)).toBe(false);
                expect(childPlayerComplete).toBe(true);
            }));
            it('should finish queried players in an animation when the next animation takes over', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                    }
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            template: "\n            <div [@myAnimation]=\"exp\" class=\"parent\">\n              <div *ngFor=\"let item of items\" class=\"child\">\n                {{ item }}\n              </div>\n            </div>\n          ",
                            animations: [animations_1.trigger('myAnimation', [
                                    animations_1.transition('* => on', [
                                        animations_1.query(':enter', [animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: 1 }))]),
                                    ]),
                                    animations_1.transition('* => off', [])
                                ])]
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = 'on';
                cmp.items = [0, 1, 2, 3, 4];
                fixture.detectChanges();
                engine.flush();
                var players = getLog();
                expect(players.length).toEqual(5);
                var count = 0;
                players.forEach(function (p) { p.onDone(function () { return count++; }); });
                expect(count).toEqual(0);
                cmp.exp = 'off';
                fixture.detectChanges();
                engine.flush();
                expect(count).toEqual(5);
            });
            it('should finish queried players when the previous player is finished', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                    }
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            template: "\n            <div [@myAnimation]=\"exp\" class=\"parent\">\n              <div *ngFor=\"let item of items\" class=\"child\">\n                {{ item }}\n              </div>\n            </div>\n          ",
                            animations: [animations_1.trigger('myAnimation', [
                                    animations_1.transition('* => on', [
                                        animations_1.query(':enter', [animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: 1 }))]),
                                    ]),
                                    animations_1.transition('* => off', [])
                                ])]
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = 'on';
                cmp.items = [0, 1, 2, 3, 4];
                fixture.detectChanges();
                engine.flush();
                var players = getLog();
                expect(players.length).toEqual(5);
                var count = 0;
                players.forEach(function (p) { p.onDone(function () { return count++; }); });
                expect(count).toEqual(0);
                expect(engine.players.length).toEqual(1);
                engine.players[0].finish();
                expect(count).toEqual(5);
            });
            it('should allow multiple triggers to animate on queried elements at the same time', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                    }
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            template: "\n            <div [@one]=\"exp1\" [@two]=\"exp2\" class=\"parent\">\n              <div *ngFor=\"let item of items\" class=\"child\">\n                {{ item }}\n              </div>\n            </div>\n          ",
                            animations: [
                                animations_1.trigger('one', [
                                    animations_1.transition('* => on', [
                                        animations_1.query('.child', [
                                            animations_1.style({ width: '0px' }),
                                            animations_1.animate(1000, animations_1.style({ width: '100px' }))
                                        ])
                                    ]),
                                    animations_1.transition('* => off', [])
                                ]),
                                animations_1.trigger('two', [
                                    animations_1.transition('* => on', [
                                        animations_1.query('.child:nth-child(odd)', [
                                            animations_1.style({ height: '0px' }),
                                            animations_1.animate(1000, animations_1.style({ height: '100px' }))
                                        ])
                                    ]),
                                    animations_1.transition('* => off', [])
                                ])
                            ]
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp1 = 'on';
                cmp.items = [0, 1, 2, 3, 4];
                fixture.detectChanges();
                engine.flush();
                var players = getLog();
                expect(players.length).toEqual(5);
                var count = 0;
                players.forEach(function (p) { p.onDone(function () { return count++; }); });
                resetLog();
                expect(count).toEqual(0);
                cmp.exp2 = 'on';
                fixture.detectChanges();
                engine.flush();
                expect(count).toEqual(0);
                players = getLog();
                expect(players.length).toEqual(3);
                players.forEach(function (p) { p.onDone(function () { return count++; }); });
                cmp.exp1 = 'off';
                fixture.detectChanges();
                engine.flush();
                expect(count).toEqual(5);
                cmp.exp2 = 'off';
                fixture.detectChanges();
                engine.flush();
                expect(count).toEqual(8);
            });
            it('should cancel inner queried animations if a trigger state value changes, but isn\'t detected as a valid transition', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                    }
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            template: "\n            <div [@myAnimation]=\"exp\" class=\"parent\">\n              <div *ngFor=\"let item of items\" class=\"child\">\n                {{ item }}\n              </div>\n            </div>\n          ",
                            animations: [animations_1.trigger('myAnimation', [animations_1.transition('* => on', [
                                        animations_1.query(':enter', [animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: 1 }))]),
                                    ])])]
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = 'on';
                cmp.items = [0, 1, 2, 3, 4];
                fixture.detectChanges();
                engine.flush();
                var players = getLog();
                expect(players.length).toEqual(5);
                var count = 0;
                players.forEach(function (p) { p.onDone(function () { return count++; }); });
                expect(count).toEqual(0);
                cmp.exp = 'off';
                fixture.detectChanges();
                engine.flush();
                expect(count).toEqual(5);
            });
            it('should allow for queried items to restore their styling back to the original state via animate(time, "*")', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                    }
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            template: "\n            <div [@myAnimation]=\"exp\" class=\"parent\">\n              <div *ngFor=\"let item of items\" class=\"child\">\n                {{ item }}\n              </div>\n            </div>\n          ",
                            animations: [
                                animations_1.trigger('myAnimation', [
                                    animations_1.transition('* => on', [
                                        animations_1.query(':enter', [
                                            animations_1.style({ opacity: '0', width: '0px', height: '0px' }),
                                            animations_1.animate(1000, animations_1.style({ opacity: '1' })),
                                            animations_1.animate(1000, animations_1.style(['*', { height: '200px' }]))
                                        ])
                                    ])
                                ])
                            ]
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = 'on';
                cmp.items = [0, 1, 2];
                fixture.detectChanges();
                engine.flush();
                var players = getLog();
                expect(players.length).toEqual(3);
                players.forEach(function (p) {
                    expect(p.keyframes).toEqual([
                        { opacity: '0', width: '0px', height: '0px', offset: 0 },
                        { opacity: '1', width: '0px', height: '0px', offset: .5 },
                        { opacity: animations_1.AUTO_STYLE, width: animations_1.AUTO_STYLE, height: '200px', offset: 1 }
                    ]);
                });
            });
            it('should query elements in sub components that do not contain animations using the :enter selector', function () {
                var ParentCmp = /** @class */ (function () {
                    function ParentCmp() {
                    }
                    __decorate([
                        core_1.ViewChild('child'),
                        __metadata("design:type", Object)
                    ], ParentCmp.prototype, "child", void 0);
                    ParentCmp = __decorate([
                        core_1.Component({
                            selector: 'parent-cmp',
                            template: "\n            <div [@myAnimation]=\"exp\">\n              <child-cmp #child></child-cmp>\n            </div>\n          ",
                            animations: [animations_1.trigger('myAnimation', [animations_1.transition('* => on', [animations_1.query(':enter', [animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: 1 }))])])])]
                        })
                    ], ParentCmp);
                    return ParentCmp;
                }());
                var ChildCmp = /** @class */ (function () {
                    function ChildCmp() {
                        this.items = [];
                    }
                    ChildCmp = __decorate([
                        core_1.Component({
                            selector: 'child-cmp',
                            template: "\n            <div *ngFor=\"let item of items\">\n              {{ item }}\n            </div>\n          "
                        })
                    ], ChildCmp);
                    return ChildCmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [ParentCmp, ChildCmp] });
                var fixture = testing_2.TestBed.createComponent(ParentCmp);
                var cmp = fixture.componentInstance;
                fixture.detectChanges();
                cmp.exp = 'on';
                cmp.child.items = [1, 2, 3];
                fixture.detectChanges();
                var players = getLog();
                expect(players.length).toEqual(3);
                expect(players[0].element.innerText.trim()).toEqual('1');
                expect(players[1].element.innerText.trim()).toEqual('2');
                expect(players[2].element.innerText.trim()).toEqual('3');
            });
            it('should query elements in sub components that do not contain animations using the :leave selector', function () {
                var ParentCmp = /** @class */ (function () {
                    function ParentCmp() {
                    }
                    __decorate([
                        core_1.ViewChild('child'),
                        __metadata("design:type", Object)
                    ], ParentCmp.prototype, "child", void 0);
                    ParentCmp = __decorate([
                        core_1.Component({
                            selector: 'parent-cmp',
                            template: "\n            <div [@myAnimation]=\"exp\">\n              <child-cmp #child></child-cmp>\n            </div>\n          ",
                            animations: [animations_1.trigger('myAnimation', [animations_1.transition('* => on', [animations_1.query(':leave', [animations_1.animate(1000, animations_1.style({ opacity: 0 }))])])])]
                        })
                    ], ParentCmp);
                    return ParentCmp;
                }());
                var ChildCmp = /** @class */ (function () {
                    function ChildCmp() {
                        this.items = [];
                    }
                    ChildCmp = __decorate([
                        core_1.Component({
                            selector: 'child-cmp',
                            template: "\n            <div *ngFor=\"let item of items\">\n              {{ item }}\n            </div>\n          "
                        })
                    ], ChildCmp);
                    return ChildCmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [ParentCmp, ChildCmp] });
                var fixture = testing_2.TestBed.createComponent(ParentCmp);
                var cmp = fixture.componentInstance;
                cmp.child.items = [4, 5, 6];
                fixture.detectChanges();
                cmp.exp = 'on';
                cmp.child.items = [];
                fixture.detectChanges();
                var players = getLog();
                expect(players.length).toEqual(3);
                expect(players[0].element.innerText.trim()).toEqual('4');
                expect(players[1].element.innerText.trim()).toEqual('5');
                expect(players[2].element.innerText.trim()).toEqual('6');
            });
            describe('options.limit', function () {
                it('should limit results when a limit value is passed into the query options', function () {
                    var Cmp = /** @class */ (function () {
                        function Cmp() {
                            this.items = [];
                        }
                        Cmp = __decorate([
                            core_1.Component({
                                selector: 'cmp',
                                template: "\n             <div [@myAnimation]=\"exp\">\n              <div *ngFor=\"let item of items\" class=\"item\">\n                {{ item }}\n              </div>\n             </div>\n          ",
                                animations: [
                                    animations_1.trigger('myAnimation', [
                                        animations_1.transition('* => go', [
                                            animations_1.query('.item', [
                                                animations_1.style({ opacity: 0 }),
                                                animations_1.animate('1s', animations_1.style({ opacity: 1 })),
                                            ], { limit: 2 }),
                                        ]),
                                    ]),
                                ]
                            })
                        ], Cmp);
                        return Cmp;
                    }());
                    testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                    var fixture = testing_2.TestBed.createComponent(Cmp);
                    var cmp = fixture.componentInstance;
                    cmp.items = ['a', 'b', 'c', 'd', 'e'];
                    fixture.detectChanges();
                    cmp.exp = 'go';
                    fixture.detectChanges();
                    var players = getLog();
                    expect(players.length).toEqual(2);
                    expect(players[0].element.innerText.trim()).toEqual('a');
                    expect(players[1].element.innerText.trim()).toEqual('b');
                });
                it('should support negative limit values by pulling in elements from the end of the query', function () {
                    var Cmp = /** @class */ (function () {
                        function Cmp() {
                            this.items = [];
                        }
                        Cmp = __decorate([
                            core_1.Component({
                                selector: 'cmp',
                                template: "\n             <div [@myAnimation]=\"exp\">\n              <div *ngFor=\"let item of items\" class=\"item\">\n                {{ item }}\n              </div>\n             </div>\n          ",
                                animations: [
                                    animations_1.trigger('myAnimation', [
                                        animations_1.transition('* => go', [
                                            animations_1.query('.item', [
                                                animations_1.style({ opacity: 0 }),
                                                animations_1.animate('1s', animations_1.style({ opacity: 1 })),
                                            ], { limit: -3 }),
                                        ]),
                                    ]),
                                ]
                            })
                        ], Cmp);
                        return Cmp;
                    }());
                    testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                    var fixture = testing_2.TestBed.createComponent(Cmp);
                    var cmp = fixture.componentInstance;
                    cmp.items = ['a', 'b', 'c', 'd', 'e'];
                    fixture.detectChanges();
                    cmp.exp = 'go';
                    fixture.detectChanges();
                    var players = getLog();
                    expect(players.length).toEqual(3);
                    expect(players[0].element.innerText.trim()).toEqual('c');
                    expect(players[1].element.innerText.trim()).toEqual('d');
                    expect(players[2].element.innerText.trim()).toEqual('e');
                });
            });
        });
        describe('sub triggers', function () {
            it('should animate a sub trigger that exists in an inner element in the template', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                    }
                    __decorate([
                        core_1.ViewChild('parent'),
                        __metadata("design:type", Object)
                    ], Cmp.prototype, "elm1", void 0);
                    __decorate([
                        core_1.ViewChild('child'),
                        __metadata("design:type", Object)
                    ], Cmp.prototype, "elm2", void 0);
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            template: "\n            <div #parent class=\"parent\" [@parent]=\"exp1\">\n              <div #child class=\"child\" [@child]=\"exp2\"></div>\n            </div>\n          ",
                            animations: [
                                animations_1.trigger('parent', [animations_1.transition('* => go1', [
                                        animations_1.style({ width: '0px' }), animations_1.animate(1000, animations_1.style({ width: '100px' })),
                                        animations_1.query('.child', [animations_1.animateChild()])
                                    ])]),
                                animations_1.trigger('child', [animations_1.transition('* => go2', [
                                        animations_1.style({ height: '0px' }),
                                        animations_1.animate(1000, animations_1.style({ height: '100px' })),
                                    ])])
                            ]
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp1 = 'go1';
                cmp.exp2 = 'go2';
                fixture.detectChanges();
                engine.flush();
                var elm1 = cmp.elm1;
                var elm2 = cmp.elm2;
                var _a = getLog(), p1 = _a[0], p2 = _a[1];
                expect(p1.delay).toEqual(0);
                expect(p1.element).toEqual(elm1.nativeElement);
                expect(p1.duration).toEqual(1000);
                expect(p1.keyframes).toEqual([{ width: '0px', offset: 0 }, { width: '100px', offset: 1 }]);
                expect(p2.delay).toEqual(0);
                expect(p2.element).toEqual(elm2.nativeElement);
                expect(p2.duration).toEqual(2000);
                expect(p2.keyframes).toEqual([
                    { height: '0px', offset: 0 }, { height: '0px', offset: .5 }, { height: '100px', offset: 1 }
                ]);
            });
            it('should run and operate a series of triggers on a list of elements with overridden timing data', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                        this.items = [0, 1, 2, 3, 4];
                    }
                    __decorate([
                        core_1.ViewChild('parent'),
                        __metadata("design:type", Object)
                    ], Cmp.prototype, "elm", void 0);
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            template: "\n            <div #parent class=\"parent\" [@parent]=\"exp\">\n              <div class=\"item\" *ngFor=\"let item of items\" @child></div>\n            </div>\n          ",
                            animations: [
                                animations_1.trigger('parent', [animations_1.transition('* => go', [
                                        animations_1.style({ opacity: '0' }), animations_1.animate(1000, animations_1.style({ opacity: '1' })),
                                        animations_1.query('.item', [animations_1.animateChild({ duration: '2.5s', delay: '500ms' })]),
                                        animations_1.animate(1000, animations_1.style({ opacity: '0' }))
                                    ])]),
                                animations_1.trigger('child', [animations_1.transition(':enter', [
                                        animations_1.style({ height: '0px' }),
                                        animations_1.animate(1000, animations_1.style({ height: '100px' })),
                                    ])])
                            ]
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = 'go';
                fixture.detectChanges();
                engine.flush();
                var parent = cmp.elm.nativeElement;
                var elements = parent.querySelectorAll('.item');
                var players = getLog();
                expect(players.length).toEqual(7);
                var pA = players[0], pc1 = players[1], pc2 = players[2], pc3 = players[3], pc4 = players[4], pc5 = players[5], pZ = players[6];
                expect(pA.element).toEqual(parent);
                expect(pA.delay).toEqual(0);
                expect(pA.duration).toEqual(1000);
                expect(pc1.element).toEqual(elements[0]);
                expect(pc1.delay).toEqual(0);
                expect(pc1.duration).toEqual(4000);
                expect(pc2.element).toEqual(elements[1]);
                expect(pc2.delay).toEqual(0);
                expect(pc2.duration).toEqual(4000);
                expect(pc3.element).toEqual(elements[2]);
                expect(pc3.delay).toEqual(0);
                expect(pc3.duration).toEqual(4000);
                expect(pc4.element).toEqual(elements[3]);
                expect(pc4.delay).toEqual(0);
                expect(pc4.duration).toEqual(4000);
                expect(pc5.element).toEqual(elements[4]);
                expect(pc5.delay).toEqual(0);
                expect(pc5.duration).toEqual(4000);
                expect(pZ.element).toEqual(parent);
                expect(pZ.delay).toEqual(4000);
                expect(pZ.duration).toEqual(1000);
            });
            it('should silently continue if a sub trigger is animated that doesn\'t exist', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                        this.items = [0, 1, 2, 3, 4];
                    }
                    __decorate([
                        core_1.ViewChild('parent'),
                        __metadata("design:type", Object)
                    ], Cmp.prototype, "elm", void 0);
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            template: "\n            <div #parent class=\"parent\" [@parent]=\"exp\">\n              <div class=\"child\"></div>\n            </div>\n          ",
                            animations: [animations_1.trigger('parent', [animations_1.transition('* => go', [
                                        animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: 1 })),
                                        animations_1.query('.child', [animations_1.animateChild({ duration: '1s' })]),
                                        animations_1.animate(1000, animations_1.style({ opacity: 0 }))
                                    ])])]
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = 'go';
                fixture.detectChanges();
                engine.flush();
                var parent = cmp.elm.nativeElement;
                var players = getLog();
                expect(players.length).toEqual(2);
                var pA = players[0], pZ = players[1];
                expect(pA.element).toEqual(parent);
                expect(pA.delay).toEqual(0);
                expect(pA.duration).toEqual(1000);
                expect(pZ.element).toEqual(parent);
                expect(pZ.delay).toEqual(1000);
                expect(pZ.duration).toEqual(1000);
            });
            it('should silently continue if a sub trigger is animated that doesn\'t contain a trigger that is setup for animation', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                    }
                    __decorate([
                        core_1.ViewChild('parent'),
                        __metadata("design:type", Object)
                    ], Cmp.prototype, "elm", void 0);
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            template: "\n            <div #parent class=\"parent\" [@parent]=\"exp1\">\n              <div [@child]=\"exp2\" class=\"child\"></div>\n            </div>\n          ",
                            animations: [
                                animations_1.trigger('child', [animations_1.transition('a => z', [animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: 1 }))])]),
                                animations_1.trigger('parent', [animations_1.transition('a => z', [
                                        animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: 1 })),
                                        animations_1.query('.child', [animations_1.animateChild({ duration: '1s' })]),
                                        animations_1.animate(1000, animations_1.style({ opacity: 0 }))
                                    ])])
                            ]
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp1 = 'a';
                cmp.exp2 = 'a';
                fixture.detectChanges();
                engine.flush();
                resetLog();
                cmp.exp1 = 'z';
                fixture.detectChanges();
                engine.flush();
                var parent = cmp.elm.nativeElement;
                var players = getLog();
                expect(players.length).toEqual(2);
                var pA = players[0], pZ = players[1];
                expect(pA.element).toEqual(parent);
                expect(pA.delay).toEqual(0);
                expect(pA.duration).toEqual(1000);
                expect(pZ.element).toEqual(parent);
                expect(pZ.delay).toEqual(1000);
                expect(pZ.duration).toEqual(1000);
            });
            it('should animate all sub triggers on the element at the same time', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                    }
                    __decorate([
                        core_1.ViewChild('parent'),
                        __metadata("design:type", Object)
                    ], Cmp.prototype, "elm", void 0);
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            template: "\n            <div #parent class=\"parent\" [@parent]=\"exp1\">\n              <div [@w]=\"exp2\" [@h]=\"exp2\" class=\"child\"></div>\n            </div>\n          ",
                            animations: [
                                animations_1.trigger('w', [
                                    animations_1.transition('* => go', [
                                        animations_1.style({ width: 0 }),
                                        animations_1.animate(1800, animations_1.style({ width: '100px' }))
                                    ])
                                ]),
                                animations_1.trigger('h', [
                                    animations_1.transition('* => go', [
                                        animations_1.style({ height: 0 }),
                                        animations_1.animate(1500, animations_1.style({ height: '100px' }))
                                    ])
                                ]),
                                animations_1.trigger('parent', [
                                    animations_1.transition('* => go', [
                                        animations_1.style({ opacity: 0 }),
                                        animations_1.animate(1000, animations_1.style({ opacity: 1 })),
                                        animations_1.query('.child', [
                                            animations_1.animateChild()
                                        ]),
                                        animations_1.animate(1000, animations_1.style({ opacity: 0 }))
                                    ])
                                ])
                            ]
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp1 = 'go';
                cmp.exp2 = 'go';
                fixture.detectChanges();
                engine.flush();
                var players = getLog();
                expect(players.length).toEqual(4);
                var pA = players[0], pc1 = players[1], pc2 = players[2], pZ = players[3];
                expect(pc1.delay).toEqual(0);
                expect(pc1.duration).toEqual(2800);
                expect(pc2.delay).toEqual(0);
                expect(pc2.duration).toEqual(2500);
                expect(pZ.delay).toEqual(2800);
                expect(pZ.duration).toEqual(1000);
            });
            it('should skip a sub animation when a zero duration value is passed in', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                    }
                    __decorate([
                        core_1.ViewChild('parent'),
                        __metadata("design:type", Object)
                    ], Cmp.prototype, "elm", void 0);
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            template: "\n            <div #parent class=\"parent\" [@parent]=\"exp1\">\n              <div [@child]=\"exp2\" class=\"child\"></div>\n            </div>\n          ",
                            animations: [
                                animations_1.trigger('child', [animations_1.transition('* => go', [animations_1.style({ width: 0 }), animations_1.animate(1800, animations_1.style({ width: '100px' }))])]),
                                animations_1.trigger('parent', [animations_1.transition('* => go', [
                                        animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: 1 })),
                                        animations_1.query('.child', [animations_1.animateChild({ duration: '0' })]),
                                        animations_1.animate(1000, animations_1.style({ opacity: 0 }))
                                    ])])
                            ]
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp1 = 'go';
                cmp.exp2 = 'go';
                fixture.detectChanges();
                engine.flush();
                var players = getLog();
                expect(players.length).toEqual(2);
                var pA = players[0], pZ = players[1];
                expect(pA.delay).toEqual(0);
                expect(pA.duration).toEqual(1000);
                expect(pZ.delay).toEqual(1000);
                expect(pZ.duration).toEqual(1000);
            });
            it('should only allow a sub animation to be used up by a parent trigger once', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                    }
                    __decorate([
                        core_1.ViewChild('parent'),
                        __metadata("design:type", Object)
                    ], Cmp.prototype, "elm", void 0);
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            template: "\n            <div [@parent]=\"exp1\" class=\"parent1\" #parent>\n              <div [@parent]=\"exp1\" class=\"parent2\">\n                <div [@child]=\"exp2\" class=\"child\">\n                </div>\n              </div>\n            </div>\n          ",
                            animations: [
                                animations_1.trigger('parent', [animations_1.transition('* => go', [
                                        animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: 1 })),
                                        animations_1.query('.child', animations_1.animateChild())
                                    ])]),
                                animations_1.trigger('child', [animations_1.transition('* => go', [animations_1.style({ opacity: 0 }), animations_1.animate(1800, animations_1.style({ opacity: 1 }))])])
                            ]
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp1 = 'go';
                cmp.exp2 = 'go';
                fixture.detectChanges();
                engine.flush();
                var players = getLog();
                expect(players.length).toEqual(3);
                var p1 = players[0], p2 = players[1], p3 = players[2];
                // parent2 is evaluated first because it is inside of parent1
                expect(p1.element.classList.contains('parent2')).toBeTruthy();
                expect(p2.element.classList.contains('child')).toBeTruthy();
                expect(p3.element.classList.contains('parent1')).toBeTruthy();
            });
            it('should emulate a leave animation on the nearest sub host elements when a parent is removed', fake_async_1.fakeAsync(function () {
                var ParentCmp = /** @class */ (function () {
                    function ParentCmp() {
                        this.exp = true;
                    }
                    ParentCmp.prototype.animateStart = function (event) {
                        if (event.toState == 'void') {
                            this.childEvent = event;
                        }
                    };
                    __decorate([
                        core_1.ViewChild('child'),
                        __metadata("design:type", Object)
                    ], ParentCmp.prototype, "childElm", void 0);
                    ParentCmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            template: "\n            <div @parent *ngIf=\"exp\" class=\"parent1\" #parent>\n              <child-cmp #child @leave (@leave.start)=\"animateStart($event)\"></child-cmp>\n            </div>\n          ",
                            animations: [
                                animations_1.trigger('leave', [
                                    animations_1.transition(':leave', [animations_1.animate(1000, animations_1.style({ color: 'gold' }))]),
                                ]),
                                animations_1.trigger('parent', [
                                    animations_1.transition(':leave', [animations_1.query(':leave', animations_1.animateChild())]),
                                ]),
                            ]
                        })
                    ], ParentCmp);
                    return ParentCmp;
                }());
                var ChildCmp = /** @class */ (function () {
                    function ChildCmp() {
                        this.animate = true;
                    }
                    ChildCmp.prototype.animateStart = function (event) {
                        if (event.toState == 'void') {
                            this.childEvent = event;
                        }
                    };
                    __decorate([
                        core_1.HostBinding('@child'),
                        __metadata("design:type", Object)
                    ], ChildCmp.prototype, "animate", void 0);
                    __decorate([
                        directives_1.HostListener('@child.start', ['$event']),
                        __metadata("design:type", Function),
                        __metadata("design:paramtypes", [Object]),
                        __metadata("design:returntype", void 0)
                    ], ChildCmp.prototype, "animateStart", null);
                    ChildCmp = __decorate([
                        core_1.Component({
                            selector: 'child-cmp',
                            template: '...',
                            animations: [
                                animations_1.trigger('child', [
                                    animations_1.transition(':leave', [animations_1.animate(1000, animations_1.style({ color: 'gold' }))]),
                                ]),
                            ]
                        })
                    ], ChildCmp);
                    return ChildCmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [ParentCmp, ChildCmp] });
                var fixture = testing_2.TestBed.createComponent(ParentCmp);
                var cmp = fixture.componentInstance;
                fixture.detectChanges();
                var childCmp = cmp.childElm;
                cmp.exp = false;
                fixture.detectChanges();
                fake_async_1.flushMicrotasks();
                expect(cmp.childEvent.toState).toEqual('void');
                expect(cmp.childEvent.totalTime).toEqual(1000);
                expect(childCmp.childEvent.toState).toEqual('void');
                expect(childCmp.childEvent.totalTime).toEqual(1000);
            }));
            it('should emulate a leave animation on a sub component\'s inner elements when a parent leave animation occurs with animateChild', function () {
                var ParentCmp = /** @class */ (function () {
                    function ParentCmp() {
                        this.exp = true;
                    }
                    ParentCmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            template: "\n            <div @myAnimation *ngIf=\"exp\" class=\"parent\">\n              <child-cmp></child-cmp>\n            </div>\n          ",
                            animations: [
                                animations_1.trigger('myAnimation', [
                                    animations_1.transition(':leave', [
                                        animations_1.query('@*', animations_1.animateChild()),
                                    ]),
                                ]),
                            ]
                        })
                    ], ParentCmp);
                    return ParentCmp;
                }());
                var ChildCmp = /** @class */ (function () {
                    function ChildCmp() {
                    }
                    ChildCmp = __decorate([
                        core_1.Component({
                            selector: 'child-cmp',
                            template: "\n               <section>\n                 <div class=\"inner-div\" @myChildAnimation></div>\n               </section>\n             ",
                            animations: [
                                animations_1.trigger('myChildAnimation', [
                                    animations_1.transition(':leave', [
                                        animations_1.style({ opacity: 0 }),
                                        animations_1.animate('1s', animations_1.style({ opacity: 1 })),
                                    ]),
                                ]),
                            ]
                        })
                    ], ChildCmp);
                    return ChildCmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [ParentCmp, ChildCmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(ParentCmp);
                var cmp = fixture.componentInstance;
                cmp.exp = true;
                fixture.detectChanges();
                cmp.exp = false;
                fixture.detectChanges();
                var players = getLog();
                expect(players.length).toEqual(1);
                var player = players[0];
                expect(player.element.classList.contains('inner-div')).toBeTruthy();
                expect(player.keyframes).toEqual([
                    { opacity: '0', offset: 0 },
                    { opacity: '1', offset: 1 },
                ]);
            });
            it('should not cause a removal of inner @trigger DOM nodes when a parent animation occurs', fake_async_1.fakeAsync(function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                        this.exp = true;
                    }
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            template: "\n            <div @parent *ngIf=\"exp\" class=\"parent\">\n              this <div @child>child</div>\n            </div>\n          ",
                            animations: [
                                animations_1.trigger('parent', [
                                    animations_1.transition(':leave', [
                                        animations_1.style({ opacity: 0 }),
                                        animations_1.animate('1s', animations_1.style({ opacity: 1 })),
                                    ]),
                                ]),
                                animations_1.trigger('child', [
                                    animations_1.transition('* => something', [
                                        animations_1.style({ opacity: 0 }),
                                        animations_1.animate('1s', animations_1.style({ opacity: 1 })),
                                    ]),
                                ]),
                            ]
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = true;
                fixture.detectChanges();
                fake_async_1.flushMicrotasks();
                cmp.exp = false;
                fixture.detectChanges();
                fake_async_1.flushMicrotasks();
                var players = getLog();
                expect(players.length).toEqual(1);
                var element = players[0].element;
                expect(element.innerText.trim()).toMatch(/this\s+child/mg);
            }));
            it('should only mark outermost *directive nodes :enter and :leave when inserts and removals occur', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                    }
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            animations: [
                                animations_1.trigger('anim', [
                                    animations_1.transition('* => enter', [
                                        animations_1.query(':enter', [animations_1.animate(1000, animations_1.style({ color: 'red' }))]),
                                    ]),
                                    animations_1.transition('* => leave', [
                                        animations_1.query(':leave', [animations_1.animate(1000, animations_1.style({ color: 'blue' }))]),
                                    ]),
                                ]),
                            ],
                            template: "\n            <section class=\"container\" [@anim]=\"exp ? 'enter' : 'leave'\">\n              <div class=\"a\" *ngIf=\"exp\">\n                <div class=\"b\" *ngIf=\"exp\">\n                  <div class=\"c\" *ngIf=\"exp\">\n                    text\n                  </div>\n                </div>\n              </div>\n              <div>\n                <div class=\"d\" *ngIf=\"exp\">\n                  text2\n                </div>\n              </div>\n            </section>\n          "
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                var container = fixture.elementRef.nativeElement;
                cmp.exp = true;
                fixture.detectChanges();
                engine.flush();
                var players = getLog();
                resetLog();
                expect(players.length).toEqual(2);
                var p1 = players[0], p2 = players[1];
                expect(p1.element.classList.contains('a'));
                expect(p2.element.classList.contains('d'));
                cmp.exp = false;
                fixture.detectChanges();
                engine.flush();
                players = getLog();
                resetLog();
                expect(players.length).toEqual(2);
                var p3 = players[0], p4 = players[1];
                expect(p3.element.classList.contains('a'));
                expect(p4.element.classList.contains('d'));
            });
            it('should collect multiple root levels of :enter and :leave nodes', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                        this.page1 = false;
                        this.page2 = false;
                        this.loading = false;
                    }
                    Object.defineProperty(Cmp.prototype, "title", {
                        get: function () {
                            if (this.page1) {
                                return 'hello from page1';
                            }
                            return 'greetings from page2';
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(Cmp.prototype, "status", {
                        get: function () {
                            if (this.loading)
                                return 'loading';
                            if (this.page1)
                                return 'page1';
                            if (this.page2)
                                return 'page2';
                            return '';
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            animations: [
                                animations_1.trigger('pageAnimation', [
                                    animations_1.transition(':enter', []),
                                    animations_1.transition('* => *', [
                                        animations_1.query(':leave', [
                                            animations_1.animate('1s', animations_1.style({ opacity: 0 }))
                                        ], { optional: true }),
                                        animations_1.query(':enter', [
                                            animations_1.animate('1s', animations_1.style({ opacity: 1 }))
                                        ], { optional: true })
                                    ])
                                ])
                            ],
                            template: "\n            <div [@pageAnimation]=\"status\">\n              <header>\n                <div *ngIf=\"!loading\" class=\"title\">{{ title }}</div>\n                <div *ngIf=\"loading\" class=\"loading\">loading...</div>\n              </header>\n              <section>\n                <div class=\"page\">\n                  <div *ngIf=\"page1\" class=\"page1\">\n                    <div *ngIf=\"true\">page 1</div>\n                  </div>\n                  <div *ngIf=\"page2\" class=\"page2\">\n                    <div *ngIf=\"true\">page 2</div>\n                  </div>\n                </div>\n              </section>\n            </div>\n          "
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.loading = true;
                fixture.detectChanges();
                engine.flush();
                var players = getLog();
                resetLog();
                cancelAllPlayers(players);
                cmp.page1 = true;
                cmp.loading = false;
                fixture.detectChanges();
                engine.flush();
                var p1;
                var p2;
                var p3;
                players = getLog();
                expect(players.length).toEqual(3);
                p1 = players[0], p2 = players[1], p3 = players[2];
                expect(p1.element.classList.contains('loading')).toBe(true);
                expect(p2.element.classList.contains('title')).toBe(true);
                expect(p3.element.classList.contains('page1')).toBe(true);
                resetLog();
                cancelAllPlayers(players);
                cmp.page1 = false;
                cmp.loading = true;
                fixture.detectChanges();
                players = getLog();
                cancelAllPlayers(players);
                expect(players.length).toEqual(3);
                p1 = players[0], p2 = players[1], p3 = players[2];
                expect(p1.element.classList.contains('title')).toBe(true);
                expect(p2.element.classList.contains('page1')).toBe(true);
                expect(p3.element.classList.contains('loading')).toBe(true);
                resetLog();
                cancelAllPlayers(players);
                cmp.page2 = true;
                cmp.loading = false;
                fixture.detectChanges();
                engine.flush();
                players = getLog();
                expect(players.length).toEqual(3);
                p1 = players[0], p2 = players[1], p3 = players[2];
                expect(p1.element.classList.contains('loading')).toBe(true);
                expect(p2.element.classList.contains('title')).toBe(true);
                expect(p3.element.classList.contains('page2')).toBe(true);
            });
            it('should emulate leave animation callbacks for all sub elements that have leave triggers within the component', fake_async_1.fakeAsync(function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                        this.log = [];
                    }
                    Cmp.prototype.callback = function (event) {
                        this.log.push(event.element.getAttribute('data-name') + '-' + event.phaseName);
                    };
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            animations: [
                                animations_1.trigger('parent', []), animations_1.trigger('child', []),
                                animations_1.trigger('childWithAnimation', [
                                    animations_1.transition(':leave', [
                                        animations_1.animate(1000, animations_1.style({ background: 'red' })),
                                    ]),
                                ])
                            ],
                            template: "\n            <div data-name=\"p\" class=\"parent\" @parent *ngIf=\"exp\" (@parent.start)=\"callback($event)\" (@parent.done)=\"callback($event)\">\n              <div data-name=\"c1\" @child (@child.start)=\"callback($event)\" (@child.done)=\"callback($event)\"></div>\n              <div data-name=\"c2\" @child (@child.start)=\"callback($event)\" (@child.done)=\"callback($event)\"></div>\n              <div data-name=\"c3\" @childWithAnimation (@childWithAnimation.start)=\"callback($event)\" (@childWithAnimation.done)=\"callback($event)\"></div>\n            </div>\n          "
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = true;
                fixture.detectChanges();
                fake_async_1.flushMicrotasks();
                cmp.log = [];
                cmp.exp = false;
                fixture.detectChanges();
                fake_async_1.flushMicrotasks();
                expect(cmp.log).toEqual([
                    'c1-start', 'c1-done', 'c2-start', 'c2-done', 'p-start', 'c3-start', 'c3-done',
                    'p-done'
                ]);
            }));
            it('should build, but not run sub triggers when a parent animation is scheduled', function () {
                var ParentCmp = /** @class */ (function () {
                    function ParentCmp() {
                    }
                    __decorate([
                        core_1.ViewChild('child'),
                        __metadata("design:type", Object)
                    ], ParentCmp.prototype, "childCmp", void 0);
                    ParentCmp = __decorate([
                        core_1.Component({
                            selector: 'parent-cmp',
                            animations: [animations_1.trigger('parent', [animations_1.transition('* => *', [animations_1.animate(1000, animations_1.style({ opacity: 0 }))])])],
                            template: '<div [@parent]="exp"><child-cmp #child></child-cmp></div>'
                        })
                    ], ParentCmp);
                    return ParentCmp;
                }());
                var ChildCmp = /** @class */ (function () {
                    function ChildCmp() {
                    }
                    ChildCmp = __decorate([
                        core_1.Component({
                            selector: 'child-cmp',
                            animations: [animations_1.trigger('child', [animations_1.transition('* => *', [animations_1.animate(1000, animations_1.style({ color: 'red' }))])])],
                            template: '<div [@child]="exp"></div>'
                        })
                    ], ChildCmp);
                    return ChildCmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [ParentCmp, ChildCmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(ParentCmp);
                fixture.detectChanges();
                engine.flush();
                resetLog();
                var cmp = fixture.componentInstance;
                var childCmp = cmp.childCmp;
                cmp.exp = 1;
                childCmp.exp = 1;
                fixture.detectChanges();
                engine.flush();
                // we have 2 players, but the child is not used even though
                // it is created.
                var players = getLog();
                expect(players.length).toEqual(2);
                expect(engine.players.length).toEqual(1);
                expect(engine.players[0].getRealPlayer()).toBe(players[1]);
            });
            it('should fire and synchronize the start/done callbacks on sub triggers even if they are not allowed to animate within the animation', fake_async_1.fakeAsync(function () {
                var ParentCmp = /** @class */ (function () {
                    function ParentCmp() {
                        this.log = [];
                        this.remove = false;
                    }
                    ParentCmp.prototype.track = function (event) { this.log.push(event.triggerName + "-" + event.phaseName); };
                    __decorate([
                        core_1.ViewChild('child'),
                        __metadata("design:type", Object)
                    ], ParentCmp.prototype, "childCmp", void 0);
                    ParentCmp = __decorate([
                        core_1.Component({
                            selector: 'parent-cmp',
                            animations: [
                                animations_1.trigger('parent', [
                                    animations_1.transition('* => go', [
                                        animations_1.style({ height: '0px' }),
                                        animations_1.animate(1000, animations_1.style({ height: '100px' })),
                                    ]),
                                ]),
                            ],
                            template: "\n            <div *ngIf=\"!remove\"\n                 [@parent]=\"exp\"\n                 (@parent.start)=\"track($event)\"\n                 (@parent.done)=\"track($event)\">\n                 <child-cmp #child></child-cmp>\n            </div>\n          "
                        })
                    ], ParentCmp);
                    return ParentCmp;
                }());
                var ChildCmp = /** @class */ (function () {
                    function ChildCmp() {
                        this.log = [];
                    }
                    ChildCmp.prototype.track = function (event) { this.log.push(event.triggerName + "-" + event.phaseName); };
                    ChildCmp = __decorate([
                        core_1.Component({
                            selector: 'child-cmp',
                            animations: [
                                animations_1.trigger('child', [
                                    animations_1.transition('* => go', [
                                        animations_1.style({ width: '0px' }),
                                        animations_1.animate(1000, animations_1.style({ width: '100px' })),
                                    ]),
                                ]),
                            ],
                            template: "\n            <div [@child]=\"exp\"\n                 (@child.start)=\"track($event)\"\n                 (@child.done)=\"track($event)\"></div>\n          "
                        })
                    ], ChildCmp);
                    return ChildCmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [ParentCmp, ChildCmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(ParentCmp);
                fixture.detectChanges();
                fake_async_1.flushMicrotasks();
                var cmp = fixture.componentInstance;
                var child = cmp.childCmp;
                expect(cmp.log).toEqual(['parent-start', 'parent-done']);
                expect(child.log).toEqual(['child-start', 'child-done']);
                cmp.log = [];
                child.log = [];
                cmp.exp = 'go';
                cmp.childCmp.exp = 'go';
                fixture.detectChanges();
                fake_async_1.flushMicrotasks();
                expect(cmp.log).toEqual(['parent-start']);
                expect(child.log).toEqual(['child-start']);
                var players = engine.players;
                expect(players.length).toEqual(1);
                players[0].finish();
                expect(cmp.log).toEqual(['parent-start', 'parent-done']);
                expect(child.log).toEqual(['child-start', 'child-done']);
                cmp.log = [];
                child.log = [];
                cmp.remove = true;
                fixture.detectChanges();
                fake_async_1.flushMicrotasks();
                expect(cmp.log).toEqual(['parent-start', 'parent-done']);
                expect(child.log).toEqual(['child-start', 'child-done']);
            }));
            it('should fire and synchronize the start/done callbacks on multiple blocked sub triggers', fake_async_1.fakeAsync(function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                        this.parent1Exp = '';
                        this.parent2Exp = '';
                        this.child1Exp = '';
                        this.child2Exp = '';
                        this.log = [];
                    }
                    Cmp.prototype.track = function (event) { this.log.push(event.triggerName + "-" + event.phaseName); };
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'cmp',
                            animations: [
                                animations_1.trigger('parent1', [
                                    animations_1.transition('* => go, * => go-again', [
                                        animations_1.style({ opacity: 0 }),
                                        animations_1.animate('1s', animations_1.style({ opacity: 1 })),
                                    ]),
                                ]),
                                animations_1.trigger('parent2', [
                                    animations_1.transition('* => go, * => go-again', [
                                        animations_1.style({ lineHeight: '0px' }),
                                        animations_1.animate('1s', animations_1.style({ lineHeight: '10px' })),
                                    ]),
                                ]),
                                animations_1.trigger('child1', [
                                    animations_1.transition('* => go, * => go-again', [
                                        animations_1.style({ width: '0px' }),
                                        animations_1.animate('1s', animations_1.style({ width: '100px' })),
                                    ]),
                                ]),
                                animations_1.trigger('child2', [
                                    animations_1.transition('* => go, * => go-again', [
                                        animations_1.style({ height: '0px' }),
                                        animations_1.animate('1s', animations_1.style({ height: '100px' })),
                                    ]),
                                ]),
                            ],
                            template: "\n               <div [@parent1]=\"parent1Exp\" (@parent1.start)=\"track($event)\"\n                    [@parent2]=\"parent2Exp\" (@parent2.start)=\"track($event)\">\n                 <div [@child1]=\"child1Exp\" (@child1.start)=\"track($event)\"\n                      [@child2]=\"child2Exp\" (@child2.start)=\"track($event)\"></div>\n               </div>\n          "
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                fixture.detectChanges();
                fake_async_1.flushMicrotasks();
                var cmp = fixture.componentInstance;
                cmp.log = [];
                cmp.parent1Exp = 'go';
                cmp.parent2Exp = 'go';
                cmp.child1Exp = 'go';
                cmp.child2Exp = 'go';
                fixture.detectChanges();
                fake_async_1.flushMicrotasks();
                expect(cmp.log).toEqual(['parent1-start', 'parent2-start', 'child1-start', 'child2-start']);
                cmp.parent1Exp = 'go-again';
                cmp.parent2Exp = 'go-again';
                cmp.child1Exp = 'go-again';
                cmp.child2Exp = 'go-again';
                fixture.detectChanges();
                fake_async_1.flushMicrotasks();
            }));
            it('should stretch the starting keyframe of a child animation queries are issued by the parent', function () {
                var ParentCmp = /** @class */ (function () {
                    function ParentCmp() {
                    }
                    __decorate([
                        core_1.ViewChild('child'),
                        __metadata("design:type", Object)
                    ], ParentCmp.prototype, "childCmp", void 0);
                    ParentCmp = __decorate([
                        core_1.Component({
                            selector: 'parent-cmp',
                            animations: [animations_1.trigger('parent', [animations_1.transition('* => *', [animations_1.animate(1000, animations_1.style({ color: 'red' })), animations_1.query('@child', animations_1.animateChild())])])],
                            template: '<div [@parent]="exp"><child-cmp #child></child-cmp></div>'
                        })
                    ], ParentCmp);
                    return ParentCmp;
                }());
                var ChildCmp = /** @class */ (function () {
                    function ChildCmp() {
                    }
                    ChildCmp = __decorate([
                        core_1.Component({
                            selector: 'child-cmp',
                            animations: [animations_1.trigger('child', [animations_1.transition('* => *', [animations_1.style({ color: 'blue' }), animations_1.animate(1000, animations_1.style({ color: 'red' }))])])],
                            template: '<div [@child]="exp" class="child"></div>'
                        })
                    ], ChildCmp);
                    return ChildCmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [ParentCmp, ChildCmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(ParentCmp);
                fixture.detectChanges();
                engine.flush();
                resetLog();
                var cmp = fixture.componentInstance;
                var childCmp = cmp.childCmp;
                cmp.exp = 1;
                childCmp.exp = 1;
                fixture.detectChanges();
                engine.flush();
                expect(engine.players.length).toEqual(1); // child player, parent cover, parent player
                var groupPlayer = engine.players[0].getRealPlayer();
                var childPlayer = groupPlayer.players.find(function (player) {
                    if (player instanceof testing_1.MockAnimationPlayer) {
                        return shared_1.matchesElement(player.element, '.child');
                    }
                    return false;
                });
                var keyframes = childPlayer.keyframes.map(function (kf) {
                    delete kf['offset'];
                    return kf;
                });
                expect(keyframes.length).toEqual(3);
                var k1 = keyframes[0], k2 = keyframes[1], k3 = keyframes[2];
                expect(k1).toEqual(k2);
            });
            it('should allow a parent trigger to control child triggers across multiple template boundaries even if there are no animations in between', function () {
                var ParentCmp = /** @class */ (function () {
                    function ParentCmp() {
                    }
                    __decorate([
                        core_1.ViewChild('child'),
                        __metadata("design:type", Object)
                    ], ParentCmp.prototype, "innerCmp", void 0);
                    ParentCmp = __decorate([
                        core_1.Component({
                            selector: 'parent-cmp',
                            animations: [
                                animations_1.trigger('parentAnimation', [
                                    animations_1.transition('* => go', [
                                        animations_1.query(':self, @grandChildAnimation', animations_1.style({ opacity: 0 })),
                                        animations_1.animate(1000, animations_1.style({ opacity: 1 })),
                                        animations_1.query('@grandChildAnimation', [
                                            animations_1.animate(1000, animations_1.style({ opacity: 1 })),
                                            animations_1.animateChild(),
                                        ]),
                                    ]),
                                ]),
                            ],
                            template: '<div [@parentAnimation]="exp"><child-cmp #child></child-cmp></div>'
                        })
                    ], ParentCmp);
                    return ParentCmp;
                }());
                var ChildCmp = /** @class */ (function () {
                    function ChildCmp() {
                    }
                    __decorate([
                        core_1.ViewChild('grandchild'),
                        __metadata("design:type", Object)
                    ], ChildCmp.prototype, "innerCmp", void 0);
                    ChildCmp = __decorate([
                        core_1.Component({ selector: 'child-cmp', template: '<grandchild-cmp #grandchild></grandchild-cmp>' })
                    ], ChildCmp);
                    return ChildCmp;
                }());
                var GrandChildCmp = /** @class */ (function () {
                    function GrandChildCmp() {
                    }
                    GrandChildCmp = __decorate([
                        core_1.Component({
                            selector: 'grandchild-cmp',
                            animations: [
                                animations_1.trigger('grandChildAnimation', [
                                    animations_1.transition('* => go', [
                                        animations_1.style({ width: '0px' }),
                                        animations_1.animate(1000, animations_1.style({ width: '200px' })),
                                    ]),
                                ]),
                            ],
                            template: '<div [@grandChildAnimation]="exp"></div>'
                        })
                    ], GrandChildCmp);
                    return GrandChildCmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [ParentCmp, ChildCmp, GrandChildCmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(ParentCmp);
                fixture.detectChanges();
                engine.flush();
                resetLog();
                var cmp = fixture.componentInstance;
                var grandChildCmp = cmp.innerCmp.innerCmp;
                cmp.exp = 'go';
                grandChildCmp.exp = 'go';
                fixture.detectChanges();
                engine.flush();
                var players = getLog();
                expect(players.length).toEqual(5);
                var p1 = players[0], p2 = players[1], p3 = players[2], p4 = players[3], p5 = players[4];
                expect(p5.keyframes).toEqual([
                    { offset: 0, width: '0px' }, { offset: .67, width: '0px' }, { offset: 1, width: '200px' }
                ]);
            });
            it('should scope :enter queries between sub animations', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                    }
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'cmp',
                            animations: [
                                animations_1.trigger('parent', [
                                    animations_1.transition(':enter', animations_1.group([
                                        animations_1.sequence([
                                            animations_1.style({ opacity: 0 }),
                                            animations_1.animate(1000, animations_1.style({ opacity: 1 })),
                                        ]),
                                        animations_1.query(':enter @child', animations_1.animateChild()),
                                    ])),
                                ]),
                                animations_1.trigger('child', [
                                    animations_1.transition(':enter', [
                                        animations_1.query(':enter .item', [animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: 1 }))]),
                                    ]),
                                ]),
                            ],
                            template: "\n               <div @parent *ngIf=\"exp1\" class=\"container\">\n                 <div *ngIf=\"exp2\">\n                   <div @child>\n                     <div *ngIf=\"exp3\">\n                       <div class=\"item\"></div>\n                     </div>\n                   </div>\n                 </div>\n               </div>\n             "
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var fixture = testing_2.TestBed.createComponent(Cmp);
                fixture.detectChanges();
                resetLog();
                var cmp = fixture.componentInstance;
                cmp.exp1 = true;
                cmp.exp2 = true;
                cmp.exp3 = true;
                fixture.detectChanges();
                var players = getLog();
                expect(players.length).toEqual(2);
                var p1 = players[0], p2 = players[1];
                expect(p1.element.classList.contains('container')).toBeTruthy();
                expect(p2.element.classList.contains('item')).toBeTruthy();
            });
            it('should scope :leave queries between sub animations', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                    }
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'cmp',
                            animations: [
                                animations_1.trigger('parent', [
                                    animations_1.transition(':leave', animations_1.group([
                                        animations_1.sequence([
                                            animations_1.style({ opacity: 0 }),
                                            animations_1.animate(1000, animations_1.style({ opacity: 1 })),
                                        ]),
                                        animations_1.query(':leave @child', animations_1.animateChild()),
                                    ])),
                                ]),
                                animations_1.trigger('child', [
                                    animations_1.transition(':leave', [
                                        animations_1.query(':leave .item', [animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: 1 }))]),
                                    ]),
                                ]),
                            ],
                            template: "\n               <div @parent *ngIf=\"exp1\" class=\"container\">\n                 <div *ngIf=\"exp2\">\n                   <div @child>\n                     <div *ngIf=\"exp3\">\n                       <div class=\"item\"></div>\n                     </div>\n                   </div>\n                 </div>\n               </div>\n             "
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp1 = true;
                cmp.exp2 = true;
                cmp.exp3 = true;
                fixture.detectChanges();
                resetLog();
                cmp.exp1 = false;
                fixture.detectChanges();
                var players = getLog();
                expect(players.length).toEqual(2);
                var p1 = players[0], p2 = players[1];
                expect(p1.element.classList.contains('container')).toBeTruthy();
                expect(p2.element.classList.contains('item')).toBeTruthy();
            });
        });
        describe('animation control flags', function () {
            describe('[@.disabled]', function () {
                it('should allow a parent animation to query and animate inner nodes that are in a disabled region', function () {
                    var Cmp = /** @class */ (function () {
                        function Cmp() {
                            this.exp = '';
                            this.disableExp = false;
                        }
                        Cmp = __decorate([
                            core_1.Component({
                                selector: 'some-cmp',
                                template: "\n              <div [@myAnimation]=\"exp\">\n                <div [@.disabled]=\"disabledExp\">\n                  <div class=\"header\"></div>\n                  <div class=\"footer\"></div>\n                </div>\n              </div>\n            ",
                                animations: [
                                    animations_1.trigger('myAnimation', [
                                        animations_1.transition('* => go', [
                                            animations_1.query('.header', animations_1.animate(750, animations_1.style({ opacity: 0 }))),
                                            animations_1.query('.footer', animations_1.animate(250, animations_1.style({ opacity: 0 }))),
                                        ]),
                                    ]),
                                ]
                            })
                        ], Cmp);
                        return Cmp;
                    }());
                    testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                    var fixture = testing_2.TestBed.createComponent(Cmp);
                    var cmp = fixture.componentInstance;
                    cmp.disableExp = true;
                    fixture.detectChanges();
                    resetLog();
                    cmp.exp = 'go';
                    fixture.detectChanges();
                    var players = getLog();
                    expect(players.length).toEqual(2);
                    var p1 = players[0], p2 = players[1];
                    expect(p1.duration).toEqual(750);
                    expect(p1.element.classList.contains('header'));
                    expect(p2.duration).toEqual(250);
                    expect(p2.element.classList.contains('footer'));
                });
                it('should allow a parent animation to query and animate sub animations that are in a disabled region', function () {
                    var Cmp = /** @class */ (function () {
                        function Cmp() {
                            this.exp = '';
                            this.disableExp = false;
                        }
                        Cmp = __decorate([
                            core_1.Component({
                                selector: 'some-cmp',
                                template: "\n              <div class=\"parent\" [@parentAnimation]=\"exp\">\n                <div [@.disabled]=\"disabledExp\">\n                  <div class=\"child\" [@childAnimation]=\"exp\"></div>\n                </div>\n              </div>\n            ",
                                animations: [
                                    animations_1.trigger('parentAnimation', [
                                        animations_1.transition('* => go', [
                                            animations_1.query('@childAnimation', animations_1.animateChild()),
                                            animations_1.animate(1000, animations_1.style({ opacity: 0 }))
                                        ]),
                                    ]),
                                    animations_1.trigger('childAnimation', [
                                        animations_1.transition('* => go', [animations_1.animate(500, animations_1.style({ opacity: 0 }))]),
                                    ]),
                                ]
                            })
                        ], Cmp);
                        return Cmp;
                    }());
                    testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                    var fixture = testing_2.TestBed.createComponent(Cmp);
                    var cmp = fixture.componentInstance;
                    cmp.disableExp = true;
                    fixture.detectChanges();
                    resetLog();
                    cmp.exp = 'go';
                    fixture.detectChanges();
                    var players = getLog();
                    expect(players.length).toEqual(2);
                    var p1 = players[0], p2 = players[1];
                    expect(p1.duration).toEqual(500);
                    expect(p1.element.classList.contains('child'));
                    expect(p2.duration).toEqual(1000);
                    expect(p2.element.classList.contains('parent'));
                });
            });
        });
    });
})();
function cancelAllPlayers(players) {
    players.forEach(function (p) { return p.destroy(); });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uX3F1ZXJ5X2ludGVncmF0aW9uX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3Rlc3QvYW5pbWF0aW9uL2FuaW1hdGlvbl9xdWVyeV9pbnRlZ3JhdGlvbl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsa0RBQTBNO0FBQzFNLHVEQUE4RTtBQUM5RSx3RUFBNkU7QUFDN0UsNkRBQXNGO0FBQ3RGLCtEQUE2RjtBQUM3RiwwQ0FBNkM7QUFDN0Msc0NBQWdFO0FBQ2hFLG1FQUE2RTtBQUU3RSw0REFBMkQ7QUFDM0QseUNBQXNDO0FBQ3RDLDJEQUF3RTtBQUd4RSxDQUFDO0lBQ0MsaUVBQWlFO0lBQ2pFLElBQUksTUFBTTtRQUFFLE9BQU87SUFFbkIsUUFBUSxDQUFDLHVCQUF1QixFQUFFO1FBQ2hDO1lBQ0UsT0FBTyw2QkFBbUIsQ0FBQyxHQUE0QixDQUFDO1FBQzFELENBQUM7UUFFRCxzQkFBc0IsNkJBQW1CLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFckQsVUFBVSxDQUFDO1lBQ1QsUUFBUSxFQUFFLENBQUM7WUFDWCxpQkFBTyxDQUFDLHNCQUFzQixDQUFDO2dCQUM3QixTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSx5QkFBZSxFQUFFLFFBQVEsRUFBRSw2QkFBbUIsRUFBQyxDQUFDO2dCQUN0RSxPQUFPLEVBQUUsQ0FBQyxvQ0FBdUIsRUFBRSxxQkFBWSxDQUFDO2FBQ2pELENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLFNBQVMsRUFBRTtZQUNsQixFQUFFLENBQUMsNkVBQTZFLEVBQUU7Z0JBcURoRjtvQkFBQTtvQkFJQSxDQUFDO29CQUpLLEdBQUc7d0JBcERSLGdCQUFTLENBQUM7NEJBQ1QsUUFBUSxFQUFFLFNBQVM7NEJBQ25CLFFB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QyxDQUFDLENBQUM7Z0JBRTNCLElBQUEsZUFBRSxFQUFFLGVBQUUsRUFBRSxlQUFFLEVBQUUsZUFBRSxFQUFFLGVBQUUsRUFBRSxlQUFFLENBQVk7Z0JBRXpDLE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM1QixNQUFNLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDL0IsTUFBTSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUM7b0JBQzNCLEVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO29CQUM1QixFQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBQztpQkFDN0IsQ0FBQyxDQUFDO2dCQUVILE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM1QixNQUFNLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDL0IsTUFBTSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUM7b0JBQzNCLEVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO29CQUM1QixFQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBQztpQkFDN0IsQ0FBQyxDQUFDO2dCQUVILE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM1QixNQUFNLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDL0IsTUFBTSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUM7b0JBQzNCLEVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO29CQUM1QixFQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBQztpQkFDN0IsQ0FBQyxDQUFDO2dCQUVILE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM1QixNQUFNLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDbEMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUM7b0JBQzNCLEVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO29CQUM1QixFQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBQztpQkFDMUIsQ0FBQyxDQUFDO2dCQUVILE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUMvQixNQUFNLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDbEMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUM7b0JBQzNCLEVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO29CQUM1QixFQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBQztpQkFDMUIsQ0FBQyxDQUFDO2dCQUVILE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUMvQixNQUFNLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDbEMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUM7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