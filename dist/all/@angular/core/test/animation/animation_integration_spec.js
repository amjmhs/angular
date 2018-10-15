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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
var testing_1 = require("@angular/animations/browser/testing");
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var animations_2 = require("@angular/platform-browser/animations");
var dom_adapter_1 = require("@angular/platform-browser/src/dom/dom_adapter");
var testing_2 = require("../../testing");
var DEFAULT_NAMESPACE_ID = 'id';
var DEFAULT_COMPONENT_ID = '1';
(function () {
    // these tests are only mean't to be run within the DOM (for now)
    if (isNode)
        return;
    describe('animation tests', function () {
        function getLog() {
            return testing_1.MockAnimationDriver.log;
        }
        function resetLog() { testing_1.MockAnimationDriver.log = []; }
        beforeEach(function () {
            resetLog();
            testing_2.TestBed.configureTestingModule({
                providers: [{ provide: browser_1.AnimationDriver, useClass: testing_1.MockAnimationDriver }],
                imports: [animations_2.BrowserAnimationsModule]
            });
        });
        describe('animation modules', function () {
            it('should hint at BrowserAnimationsModule being used', function () {
                testing_2.TestBed.resetTestingModule();
                testing_2.TestBed.configureTestingModule({ declarations: [SharedAnimationCmp], imports: [animations_2.BrowserAnimationsModule] });
                var fixture = testing_2.TestBed.createComponent(SharedAnimationCmp);
                var cmp = fixture.componentInstance;
                expect(cmp.animationType).toEqual('BrowserAnimations');
            });
            it('should hint at NoopAnimationsModule being used', function () {
                testing_2.TestBed.resetTestingModule();
                testing_2.TestBed.configureTestingModule({ declarations: [SharedAnimationCmp], imports: [animations_2.NoopAnimationsModule] });
                var fixture = testing_2.TestBed.createComponent(SharedAnimationCmp);
                var cmp = fixture.componentInstance;
                expect(cmp.animationType).toEqual('NoopAnimations');
            });
        });
        var SharedAnimationCmp = /** @class */ (function () {
            function SharedAnimationCmp(animationType) {
                this.animationType = animationType;
            }
            SharedAnimationCmp = __decorate([
                core_1.Component({ template: '<p>template text</p>' }),
                __param(0, core_1.Inject(animations_2.ANIMATION_MODULE_TYPE)),
                __metadata("design:paramtypes", [String])
            ], SharedAnimationCmp);
            return SharedAnimationCmp;
        }());
        describe('fakeAsync testing', function () {
            it('should only require one flushMicrotasks call to kick off animation callbacks', testing_2.fakeAsync(function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                        this.exp = false;
                        this.status = '';
                    }
                    Cmp.prototype.cb = function (status) { this.status = status; };
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'cmp',
                            template: "\n            <div [@myAnimation]=\"exp\" (@myAnimation.start)=\"cb('start')\" (@myAnimation.done)=\"cb('done')\"></div>\n          ",
                            animations: [animations_1.trigger('myAnimation', [animations_1.transition('* => on, * => off', [animations_1.animate(1000, animations_1.style({ opacity: 1 }))])])]
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = 'on';
                fixture.detectChanges();
                expect(cmp.status).toEqual('');
                testing_2.flushMicrotasks();
                expect(cmp.status).toEqual('start');
                var player = testing_1.MockAnimationDriver.log.pop();
                player.finish();
                expect(cmp.status).toEqual('done');
                cmp.status = '';
                cmp.exp = 'off';
                fixture.detectChanges();
                expect(cmp.status).toEqual('');
                player = testing_1.MockAnimationDriver.log.pop();
                player.finish();
                expect(cmp.status).toEqual('');
                testing_2.flushMicrotasks();
                expect(cmp.status).toEqual('done');
            }));
            it('should always run .start callbacks before .done callbacks even for noop animations', testing_2.fakeAsync(function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                        this.exp = false;
                        this.log = [];
                    }
                    Cmp.prototype.cb = function (status) { this.log.push(status); };
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'cmp',
                            template: "\n                <div [@myAnimation]=\"exp\" (@myAnimation.start)=\"cb('start')\" (@myAnimation.done)=\"cb('done')\"></div>\n          ",
                            animations: [
                                animations_1.trigger('myAnimation', [
                                    animations_1.transition('* => go', []),
                                ]),
                            ]
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = 'go';
                fixture.detectChanges();
                expect(cmp.log).toEqual([]);
                testing_2.flushMicrotasks();
                expect(cmp.log).toEqual(['start', 'done']);
            }));
            it('should emit the correct totalTime value for a noop-animation', testing_2.fakeAsync(function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                        this.exp = false;
                        this.log = [];
                    }
                    Cmp.prototype.cb = function (event) { this.log.push(event); };
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'cmp',
                            template: "\n                <div [@myAnimation]=\"exp\" (@myAnimation.start)=\"cb($event)\" (@myAnimation.done)=\"cb($event)\"></div>\n          ",
                            animations: [
                                animations_1.trigger('myAnimation', [
                                    animations_1.transition('* => go', [
                                        animations_1.animate('1s', animations_1.style({ opacity: 0 })),
                                    ]),
                                ]),
                            ]
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({
                    declarations: [Cmp],
                    providers: [
                        { provide: browser_1.AnimationDriver, useClass: browser_1.ɵNoopAnimationDriver },
                    ],
                });
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = 'go';
                fixture.detectChanges();
                expect(cmp.log).toEqual([]);
                testing_2.flushMicrotasks();
                expect(cmp.log.length).toEqual(2);
                var _a = cmp.log, start = _a[0], end = _a[1];
                expect(start.totalTime).toEqual(1000);
                expect(end.totalTime).toEqual(1000);
            }));
        });
        describe('component fixture integration', function () {
            describe('whenRenderingDone', function () {
                it('should wait until the animations are finished until continuing', testing_2.fakeAsync(function () {
                    var Cmp = /** @class */ (function () {
                        function Cmp() {
                            this.exp = false;
                        }
                        Cmp = __decorate([
                            core_1.Component({
                                selector: 'cmp',
                                template: "\n              <div [@myAnimation]=\"exp\"></div>\n            ",
                                animations: [animations_1.trigger('myAnimation', [animations_1.transition('* => on', [animations_1.animate(1000, animations_1.style({ opacity: 1 }))])])]
                            })
                        ], Cmp);
                        return Cmp;
                    }());
                    testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                    var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                    var fixture = testing_2.TestBed.createComponent(Cmp);
                    var cmp = fixture.componentInstance;
                    var isDone = false;
                    fixture.whenRenderingDone().then(function () { return isDone = true; });
                    expect(isDone).toBe(false);
                    cmp.exp = 'on';
                    fixture.detectChanges();
                    engine.flush();
                    expect(isDone).toBe(false);
                    var players = engine.players;
                    expect(players.length).toEqual(1);
                    players[0].finish();
                    expect(isDone).toBe(false);
                    testing_2.flushMicrotasks();
                    expect(isDone).toBe(true);
                }));
                it('should wait for a noop animation to finish before continuing', testing_2.fakeAsync(function () {
                    var Cmp = /** @class */ (function () {
                        function Cmp() {
                            this.exp = false;
                        }
                        Cmp = __decorate([
                            core_1.Component({
                                selector: 'cmp',
                                template: "\n              <div [@myAnimation]=\"exp\"></div>\n            ",
                                animations: [animations_1.trigger('myAnimation', [animations_1.transition('* => on', [animations_1.animate(1000, animations_1.style({ opacity: 1 }))])])]
                            })
                        ], Cmp);
                        return Cmp;
                    }());
                    testing_2.TestBed.configureTestingModule({
                        providers: [{ provide: browser_1.AnimationDriver, useClass: browser_1.ɵNoopAnimationDriver }],
                        declarations: [Cmp]
                    });
                    var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                    var fixture = testing_2.TestBed.createComponent(Cmp);
                    var cmp = fixture.componentInstance;
                    var isDone = false;
                    fixture.whenRenderingDone().then(function () { return isDone = true; });
                    expect(isDone).toBe(false);
                    cmp.exp = 'off';
                    fixture.detectChanges();
                    engine.flush();
                    expect(isDone).toBe(false);
                    testing_2.flushMicrotasks();
                    expect(isDone).toBe(true);
                }));
                it('should wait for active animations to finish even if they have already started', testing_2.fakeAsync(function () {
                    var Cmp = /** @class */ (function () {
                        function Cmp() {
                            this.exp = false;
                        }
                        Cmp = __decorate([
                            core_1.Component({
                                selector: 'cmp',
                                template: "\n                <div [@myAnimation]=\"exp\"></div>\n              ",
                                animations: [animations_1.trigger('myAnimation', [animations_1.transition('* => on', [animations_1.animate(1000, animations_1.style({ opacity: 1 }))])])]
                            })
                        ], Cmp);
                        return Cmp;
                    }());
                    testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                    var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                    var fixture = testing_2.TestBed.createComponent(Cmp);
                    var cmp = fixture.componentInstance;
                    cmp.exp = 'on';
                    fixture.detectChanges();
                    engine.flush();
                    var players = engine.players;
                    expect(players.length).toEqual(1);
                    var isDone = false;
                    fixture.whenRenderingDone().then(function () { return isDone = true; });
                    testing_2.flushMicrotasks();
                    expect(isDone).toBe(false);
                    players[0].finish();
                    testing_2.flushMicrotasks();
                    expect(isDone).toBe(true);
                }));
            });
        });
        describe('animation triggers', function () {
            it('should trigger a state change animation from void => state', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                        this.exp = false;
                    }
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'if-cmp',
                            template: "\n          <div *ngIf=\"exp\" [@myAnimation]=\"exp\"></div>\n        ",
                            animations: [animations_1.trigger('myAnimation', [animations_1.transition('void => *', [animations_1.style({ 'opacity': '0' }), animations_1.animate(500, animations_1.style({ 'opacity': '1' }))])])],
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
                engine.flush();
                expect(getLog().length).toEqual(1);
                expect(getLog().pop().keyframes).toEqual([
                    { offset: 0, opacity: '0' }, { offset: 1, opacity: '1' }
                ]);
            });
            it('should allow a transition to use a function to determine what method to run', function () {
                var valueToMatch = '';
                var capturedElement;
                var transitionFn = function (fromState, toState, element) {
                    capturedElement = element;
                    return toState == valueToMatch;
                };
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                        this.exp = '';
                    }
                    __decorate([
                        core_1.ViewChild('element'),
                        __metadata("design:type", Object)
                    ], Cmp.prototype, "element", void 0);
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'if-cmp',
                            template: '<div #element [@myAnimation]="exp"></div>',
                            animations: [
                                animations_1.trigger('myAnimation', [animations_1.transition(transitionFn, [animations_1.style({ opacity: 0 }), animations_1.animate(1234, animations_1.style({ opacity: 1 }))])]),
                            ]
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                valueToMatch = cmp.exp = 'something';
                fixture.detectChanges();
                var element = cmp.element.nativeElement;
                var players = getLog();
                expect(players.length).toEqual(1);
                var p1 = players[0];
                expect(p1.totalTime).toEqual(1234);
                expect(capturedElement).toEqual(element);
                resetLog();
                valueToMatch = 'something-else';
                cmp.exp = 'this-wont-match';
                fixture.detectChanges();
                players = getLog();
                expect(players.length).toEqual(0);
            });
            it('should allow a transition to use a function to determine what method to run and expose any parameter values', function () {
                var transitionFn = function (fromState, toState, element, params) {
                    return params['doMatch'] == true;
                };
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                        this.doMatch = false;
                        this.exp = '';
                    }
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'if-cmp',
                            template: '<div [@myAnimation]="{value:exp, params: {doMatch:doMatch}}"></div>',
                            animations: [
                                animations_1.trigger('myAnimation', [animations_1.transition(transitionFn, [animations_1.style({ opacity: 0 }), animations_1.animate(3333, animations_1.style({ opacity: 1 }))])]),
                            ]
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.doMatch = true;
                fixture.detectChanges();
                var players = getLog();
                expect(players.length).toEqual(1);
                var p1 = players[0];
                expect(p1.totalTime).toEqual(3333);
                resetLog();
                cmp.doMatch = false;
                cmp.exp = 'this-wont-match';
                fixture.detectChanges();
                players = getLog();
                expect(players.length).toEqual(0);
            });
            it('should allow a state value to be `0`', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                        this.exp = false;
                    }
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'if-cmp',
                            template: "\n            <div [@myAnimation]=\"exp\"></div>\n          ",
                            animations: [animations_1.trigger('myAnimation', [
                                    animations_1.transition('0 => 1', [animations_1.style({ height: '0px' }), animations_1.animate(1234, animations_1.style({ height: '100px' }))]),
                                    animations_1.transition('* => 1', [animations_1.style({ width: '0px' }), animations_1.animate(4567, animations_1.style({ width: '100px' }))])
                                ])]
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = 0;
                fixture.detectChanges();
                engine.flush();
                resetLog();
                cmp.exp = 1;
                fixture.detectChanges();
                engine.flush();
                expect(getLog().length).toEqual(1);
                var player = getLog().pop();
                expect(player.duration).toEqual(1234);
            });
            it('should always cancel the previous transition if a follow-up transition is not matched', testing_2.fakeAsync(function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                    }
                    Cmp.prototype.callback = function (event) {
                        if (event.phaseName == 'done') {
                            this.doneEvent = event;
                        }
                        else {
                            this.startEvent = event;
                        }
                    };
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'if-cmp',
                            template: "\n          <div [@myAnimation]=\"exp\" (@myAnimation.start)=\"callback($event)\" (@myAnimation.done)=\"callback($event)\"></div>\n        ",
                            animations: [animations_1.trigger('myAnimation', [animations_1.transition('a => b', [animations_1.style({ 'opacity': '0' }), animations_1.animate(500, animations_1.style({ 'opacity': '1' }))])])],
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
                expect(getLog().length).toEqual(0);
                expect(engine.players.length).toEqual(0);
                testing_2.flushMicrotasks();
                expect(cmp.startEvent.toState).toEqual('a');
                expect(cmp.startEvent.totalTime).toEqual(0);
                expect(cmp.startEvent.toState).toEqual('a');
                expect(cmp.startEvent.totalTime).toEqual(0);
                resetLog();
                cmp.exp = 'b';
                fixture.detectChanges();
                engine.flush();
                var players = getLog();
                expect(players.length).toEqual(1);
                expect(engine.players.length).toEqual(1);
                testing_2.flushMicrotasks();
                expect(cmp.startEvent.toState).toEqual('b');
                expect(cmp.startEvent.totalTime).toEqual(500);
                expect(cmp.startEvent.toState).toEqual('b');
                expect(cmp.startEvent.totalTime).toEqual(500);
                resetLog();
                var completed = false;
                players[0].onDone(function () { return completed = true; });
                cmp.exp = 'c';
                fixture.detectChanges();
                engine.flush();
                expect(engine.players.length).toEqual(0);
                expect(getLog().length).toEqual(0);
                testing_2.flushMicrotasks();
                expect(cmp.startEvent.toState).toEqual('c');
                expect(cmp.startEvent.totalTime).toEqual(0);
                expect(cmp.startEvent.toState).toEqual('c');
                expect(cmp.startEvent.totalTime).toEqual(0);
                expect(completed).toBe(true);
            }));
            it('should always fire inner callbacks even if no animation is fired when a view is inserted', testing_2.fakeAsync(function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                        this.exp = false;
                        this.log = [];
                    }
                    Cmp.prototype.track = function (event) { this.log.push(event.triggerName + "-" + event.phaseName); };
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'if-cmp',
                            template: "\n          <div *ngIf=\"exp\">\n            <div @myAnimation (@myAnimation.start)=\"track($event)\" (@myAnimation.done)=\"track($event)\"></div>\n          </div>\n        ",
                            animations: [
                                animations_1.trigger('myAnimation', []),
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
                testing_2.flushMicrotasks();
                expect(cmp.log).toEqual([]);
                cmp.exp = true;
                fixture.detectChanges();
                testing_2.flushMicrotasks();
                expect(cmp.log).toEqual(['myAnimation-start', 'myAnimation-done']);
            }));
            it('should only turn a view removal as into `void` state transition', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                        this.exp1 = false;
                        this.exp2 = false;
                    }
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'if-cmp',
                            template: "\n          <div *ngIf=\"exp1\" [@myAnimation]=\"exp2\"></div>\n        ",
                            animations: [animations_1.trigger('myAnimation', [
                                    animations_1.transition('void <=> *', [animations_1.style({ width: '0px' }), animations_1.animate(1000, animations_1.style({ width: '100px' }))]),
                                    animations_1.transition('* => *', [animations_1.style({ height: '0px' }), animations_1.animate(1000, animations_1.style({ height: '100px' }))]),
                                ])]
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                function resetState() {
                    cmp.exp2 = 'something';
                    fixture.detectChanges();
                    engine.flush();
                    resetLog();
                }
                cmp.exp1 = true;
                cmp.exp2 = null;
                fixture.detectChanges();
                engine.flush();
                expect(getLog().pop().keyframes).toEqual([
                    { offset: 0, width: '0px' }, { offset: 1, width: '100px' }
                ]);
                resetState();
                cmp.exp2 = false;
                fixture.detectChanges();
                engine.flush();
                expect(getLog().pop().keyframes).toEqual([
                    { offset: 0, height: '0px' }, { offset: 1, height: '100px' }
                ]);
                resetState();
                cmp.exp2 = 0;
                fixture.detectChanges();
                engine.flush();
                expect(getLog().pop().keyframes).toEqual([
                    { offset: 0, height: '0px' }, { offset: 1, height: '100px' }
                ]);
                resetState();
                cmp.exp2 = '';
                fixture.detectChanges();
                engine.flush();
                expect(getLog().pop().keyframes).toEqual([
                    { offset: 0, height: '0px' }, { offset: 1, height: '100px' }
                ]);
                resetState();
                cmp.exp2 = undefined;
                fixture.detectChanges();
                engine.flush();
                expect(getLog().pop().keyframes).toEqual([
                    { offset: 0, height: '0px' }, { offset: 1, height: '100px' }
                ]);
                resetState();
                cmp.exp1 = false;
                cmp.exp2 = 'abc';
                fixture.detectChanges();
                engine.flush();
                expect(getLog().pop().keyframes).toEqual([
                    { offset: 0, width: '0px' }, { offset: 1, width: '100px' }
                ]);
            });
            it('should stringify boolean triggers to `1` and `0`', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                        this.exp = false;
                    }
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'if-cmp',
                            template: "\n          <div [@myAnimation]=\"exp\"></div>\n        ",
                            animations: [animations_1.trigger('myAnimation', [
                                    animations_1.transition('void => 1', [animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: 1 }))]),
                                    animations_1.transition('1 => 0', [animations_1.style({ opacity: 1 }), animations_1.animate(1000, animations_1.style({ opacity: 0 }))])
                                ])]
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
                engine.flush();
                expect(getLog().pop().keyframes).toEqual([
                    { offset: 0, opacity: '0' }, { offset: 1, opacity: '1' }
                ]);
                cmp.exp = false;
                fixture.detectChanges();
                engine.flush();
                expect(getLog().pop().keyframes).toEqual([
                    { offset: 0, opacity: '1' }, { offset: 1, opacity: '0' }
                ]);
            });
            it('should understand boolean values as `true` and `false` for transition animations', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                        this.exp = false;
                    }
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'if-cmp',
                            template: "\n          <div [@myAnimation]=\"exp\"></div>\n        ",
                            animations: [
                                animations_1.trigger('myAnimation', [
                                    animations_1.transition('true => false', [
                                        animations_1.style({ opacity: 0 }),
                                        animations_1.animate(1234, animations_1.style({ opacity: 1 })),
                                    ]),
                                    animations_1.transition('false => true', [
                                        animations_1.style({ opacity: 1 }),
                                        animations_1.animate(4567, animations_1.style({ opacity: 0 })),
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
                cmp.exp = true;
                fixture.detectChanges();
                cmp.exp = false;
                fixture.detectChanges();
                var players = getLog();
                expect(players.length).toEqual(1);
                var player = players[0];
                expect(player.duration).toEqual(1234);
            });
            it('should understand boolean values as `true` and `false` for transition animations and apply the corresponding state() value', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                        this.exp = false;
                    }
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'if-cmp',
                            template: "\n          <div [@myAnimation]=\"exp\"></div>\n        ",
                            animations: [
                                animations_1.trigger('myAnimation', [
                                    animations_1.state('true', animations_1.style({ color: 'red' })),
                                    animations_1.state('false', animations_1.style({ color: 'blue' })),
                                    animations_1.transition('true <=> false', [
                                        animations_1.animate(1000, animations_1.style({ color: 'gold' })),
                                        animations_1.animate(1000),
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
                cmp.exp = false;
                fixture.detectChanges();
                cmp.exp = true;
                fixture.detectChanges();
                var players = getLog();
                expect(players.length).toEqual(1);
                var player = players[0];
                expect(player.keyframes).toEqual([
                    { color: 'blue', offset: 0 },
                    { color: 'gold', offset: 0.5 },
                    { color: 'red', offset: 1 },
                ]);
            });
            it('should not throw an error if a trigger with the same name exists in separate components', function () {
                var Cmp1 = /** @class */ (function () {
                    function Cmp1() {
                    }
                    Cmp1 = __decorate([
                        core_1.Component({ selector: 'cmp1', template: '...', animations: [animations_1.trigger('trig', [])] })
                    ], Cmp1);
                    return Cmp1;
                }());
                var Cmp2 = /** @class */ (function () {
                    function Cmp2() {
                    }
                    Cmp2 = __decorate([
                        core_1.Component({ selector: 'cmp2', template: '...', animations: [animations_1.trigger('trig', [])] })
                    ], Cmp2);
                    return Cmp2;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp1, Cmp2] });
                var cmp1 = testing_2.TestBed.createComponent(Cmp1);
                var cmp2 = testing_2.TestBed.createComponent(Cmp2);
            });
            describe('host bindings', function () {
                it('should trigger a state change animation from state => state on the component host element', testing_2.fakeAsync(function () {
                    var Cmp = /** @class */ (function () {
                        function Cmp() {
                            this.exp = 'a';
                        }
                        __decorate([
                            core_1.HostBinding('@myAnimation'),
                            __metadata("design:type", Object)
                        ], Cmp.prototype, "exp", void 0);
                        Cmp = __decorate([
                            core_1.Component({
                                selector: 'my-cmp',
                                template: '...',
                                animations: [animations_1.trigger('myAnimation', [animations_1.transition('a => b', [animations_1.style({ 'opacity': '0' }), animations_1.animate(500, animations_1.style({ 'opacity': '1' }))])])],
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
                    expect(getLog().length).toEqual(0);
                    cmp.exp = 'b';
                    fixture.detectChanges();
                    engine.flush();
                    expect(getLog().length).toEqual(1);
                    var data = getLog().pop();
                    expect(data.element).toEqual(fixture.elementRef.nativeElement);
                    expect(data.keyframes).toEqual([{ offset: 0, opacity: '0' }, { offset: 1, opacity: '1' }]);
                }));
                // nonAnimationRenderer => animationRenderer
                it('should trigger a leave animation when the inner components host binding updates', testing_2.fakeAsync(function () {
                    var ParentCmp = /** @class */ (function () {
                        function ParentCmp() {
                            this.exp = true;
                        }
                        ParentCmp = __decorate([
                            core_1.Component({
                                selector: 'parent-cmp',
                                template: "\n                <child-cmp *ngIf=\"exp\"></child-cmp>\n              "
                            })
                        ], ParentCmp);
                        return ParentCmp;
                    }());
                    var ChildCmp = /** @class */ (function () {
                        function ChildCmp() {
                            this.hostAnimation = true;
                        }
                        __decorate([
                            core_1.HostBinding('@host'),
                            __metadata("design:type", Object)
                        ], ChildCmp.prototype, "hostAnimation", void 0);
                        ChildCmp = __decorate([
                            core_1.Component({
                                selector: 'child-cmp',
                                template: '...',
                                animations: [animations_1.trigger('host', [animations_1.transition(':leave', [animations_1.style({ opacity: 1 }), animations_1.animate(1000, animations_1.style({ opacity: 0 }))])])]
                            })
                        ], ChildCmp);
                        return ChildCmp;
                    }());
                    testing_2.TestBed.configureTestingModule({ declarations: [ParentCmp, ChildCmp] });
                    var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                    var fixture = testing_2.TestBed.createComponent(ParentCmp);
                    var cmp = fixture.componentInstance;
                    fixture.detectChanges();
                    engine.flush();
                    expect(getLog().length).toEqual(0);
                    cmp.exp = false;
                    fixture.detectChanges();
                    expect(fixture.debugElement.nativeElement.children.length).toBe(1);
                    engine.flush();
                    expect(getLog().length).toEqual(1);
                    var player = getLog()[0];
                    expect(player.keyframes).toEqual([
                        { opacity: '1', offset: 0 },
                        { opacity: '0', offset: 1 },
                    ]);
                    player.finish();
                    expect(fixture.debugElement.nativeElement.children.length).toBe(0);
                }));
                // animationRenderer => nonAnimationRenderer
                it('should trigger a leave animation when the outer components element binding updates on the host component element', testing_2.fakeAsync(function () {
                    var ParentCmp = /** @class */ (function () {
                        function ParentCmp() {
                            this.exp = true;
                        }
                        ParentCmp = __decorate([
                            core_1.Component({
                                selector: 'parent-cmp',
                                animations: [animations_1.trigger('host', [animations_1.transition(':leave', [animations_1.style({ opacity: 1 }), animations_1.animate(1000, animations_1.style({ opacity: 0 }))])])],
                                template: "\n                <child-cmp *ngIf=\"exp\" @host></child-cmp>\n              "
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
                                template: '...',
                            })
                        ], ChildCmp);
                        return ChildCmp;
                    }());
                    testing_2.TestBed.configureTestingModule({ declarations: [ParentCmp, ChildCmp] });
                    var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                    var fixture = testing_2.TestBed.createComponent(ParentCmp);
                    var cmp = fixture.componentInstance;
                    fixture.detectChanges();
                    engine.flush();
                    expect(getLog().length).toEqual(0);
                    cmp.exp = false;
                    fixture.detectChanges();
                    expect(fixture.debugElement.nativeElement.children.length).toBe(1);
                    engine.flush();
                    expect(getLog().length).toEqual(1);
                    var player = getLog()[0];
                    expect(player.keyframes).toEqual([
                        { opacity: '1', offset: 0 },
                        { opacity: '0', offset: 1 },
                    ]);
                    player.finish();
                    testing_2.flushMicrotasks();
                    expect(fixture.debugElement.nativeElement.children.length).toBe(0);
                }));
                // animationRenderer => animationRenderer
                it('should trigger a leave animation when both the inner and outer components trigger on the same element', testing_2.fakeAsync(function () {
                    var ParentCmp = /** @class */ (function () {
                        function ParentCmp() {
                            this.exp = true;
                        }
                        ParentCmp = __decorate([
                            core_1.Component({
                                selector: 'parent-cmp',
                                animations: [animations_1.trigger('host', [animations_1.transition(':leave', [animations_1.style({ height: '100px' }), animations_1.animate(1000, animations_1.style({ height: '0px' }))])])],
                                template: "\n                <child-cmp *ngIf=\"exp\" @host></child-cmp>\n              "
                            })
                        ], ParentCmp);
                        return ParentCmp;
                    }());
                    var ChildCmp = /** @class */ (function () {
                        function ChildCmp() {
                            this.hostAnimation = true;
                        }
                        __decorate([
                            core_1.HostBinding('@host'),
                            __metadata("design:type", Object)
                        ], ChildCmp.prototype, "hostAnimation", void 0);
                        ChildCmp = __decorate([
                            core_1.Component({
                                selector: 'child-cmp',
                                template: '...',
                                animations: [animations_1.trigger('host', [animations_1.transition(':leave', [animations_1.style({ width: '100px' }), animations_1.animate(1000, animations_1.style({ width: '0px' }))])])]
                            })
                        ], ChildCmp);
                        return ChildCmp;
                    }());
                    testing_2.TestBed.configureTestingModule({ declarations: [ParentCmp, ChildCmp] });
                    var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                    var fixture = testing_2.TestBed.createComponent(ParentCmp);
                    var cmp = fixture.componentInstance;
                    fixture.detectChanges();
                    engine.flush();
                    expect(getLog().length).toEqual(0);
                    cmp.exp = false;
                    fixture.detectChanges();
                    expect(fixture.debugElement.nativeElement.children.length).toBe(1);
                    engine.flush();
                    expect(getLog().length).toEqual(2);
                    var _a = getLog(), p1 = _a[0], p2 = _a[1];
                    expect(p1.keyframes).toEqual([
                        { width: '100px', offset: 0 },
                        { width: '0px', offset: 1 },
                    ]);
                    expect(p2.keyframes).toEqual([
                        { height: '100px', offset: 0 },
                        { height: '0px', offset: 1 },
                    ]);
                    p1.finish();
                    p2.finish();
                    testing_2.flushMicrotasks();
                    expect(fixture.debugElement.nativeElement.children.length).toBe(0);
                }));
                it('should not throw when the host element is removed and no animation triggers', testing_2.fakeAsync(function () {
                    var ParentCmp = /** @class */ (function () {
                        function ParentCmp() {
                            this.exp = true;
                        }
                        ParentCmp = __decorate([
                            core_1.Component({
                                selector: 'parent-cmp',
                                template: "\n                <child-cmp *ngIf=\"exp\"></child-cmp>\n              "
                            })
                        ], ParentCmp);
                        return ParentCmp;
                    }());
                    var ChildCmp = /** @class */ (function () {
                        function ChildCmp() {
                            this.hostAnimation = 'a';
                        }
                        __decorate([
                            core_1.HostBinding('@host'),
                            __metadata("design:type", Object)
                        ], ChildCmp.prototype, "hostAnimation", void 0);
                        ChildCmp = __decorate([
                            core_1.Component({
                                selector: 'child-cmp',
                                template: '...',
                                animations: [animations_1.trigger('host', [animations_1.transition('a => b', [animations_1.style({ height: '100px' })])])],
                            })
                        ], ChildCmp);
                        return ChildCmp;
                    }());
                    testing_2.TestBed.configureTestingModule({ declarations: [ParentCmp, ChildCmp] });
                    var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                    var fixture = testing_2.TestBed.createComponent(ParentCmp);
                    var cmp = fixture.componentInstance;
                    fixture.detectChanges();
                    expect(fixture.debugElement.nativeElement.children.length).toBe(1);
                    engine.flush();
                    expect(getLog().length).toEqual(0);
                    cmp.exp = false;
                    fixture.detectChanges();
                    engine.flush();
                    testing_2.flushMicrotasks();
                    expect(getLog().length).toEqual(0);
                    expect(fixture.debugElement.nativeElement.children.length).toBe(0);
                    testing_2.flushMicrotasks();
                    expect(fixture.debugElement.nativeElement.children.length).toBe(0);
                }));
                it('should properly evaluate pre/auto-style values when components are inserted/removed which contain host animations', testing_2.fakeAsync(function () {
                    var ParentCmp = /** @class */ (function () {
                        function ParentCmp() {
                            this.items = [1, 2, 3, 4, 5];
                        }
                        ParentCmp = __decorate([
                            core_1.Component({
                                selector: 'parent-cmp',
                                template: "\n                <child-cmp *ngFor=\"let item of items\"></child-cmp>\n              "
                            })
                        ], ParentCmp);
                        return ParentCmp;
                    }());
                    var ChildCmp = /** @class */ (function () {
                        function ChildCmp() {
                            this.hostAnimation = 'a';
                        }
                        __decorate([
                            core_1.HostBinding('@host'),
                            __metadata("design:type", Object)
                        ], ChildCmp.prototype, "hostAnimation", void 0);
                        ChildCmp = __decorate([
                            core_1.Component({
                                selector: 'child-cmp',
                                template: '... child ...',
                                animations: [animations_1.trigger('host', [animations_1.transition(':leave', [animations_1.animate(1000, animations_1.style({ opacity: 0 }))])])]
                            })
                        ], ChildCmp);
                        return ChildCmp;
                    }());
                    testing_2.TestBed.configureTestingModule({ declarations: [ParentCmp, ChildCmp] });
                    var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                    var fixture = testing_2.TestBed.createComponent(ParentCmp);
                    var cmp = fixture.componentInstance;
                    var element = fixture.nativeElement;
                    fixture.detectChanges();
                    cmp.items = [0, 2, 4, 6]; // 1,3,5 get removed
                    fixture.detectChanges();
                    var items = element.querySelectorAll('child-cmp');
                    for (var i = 0; i < items.length; i++) {
                        var item = items[i];
                        expect(item.style['display']).toBeFalsy();
                    }
                }));
            });
            it('should cancel and merge in mid-animation styles into the follow-up animation, but only for animation keyframes that start right away', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                        this.exp = false;
                    }
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            template: "\n          <div [@myAnimation]=\"exp\"></div>\n        ",
                            animations: [animations_1.trigger('myAnimation', [
                                    animations_1.transition('a => b', [
                                        animations_1.style({ 'opacity': '0' }),
                                        animations_1.animate(500, animations_1.style({ 'opacity': '1' })),
                                    ]),
                                    animations_1.transition('b => c', [
                                        animations_1.group([
                                            animations_1.animate(500, animations_1.style({ 'width': '100px' })),
                                            animations_1.animate(500, animations_1.style({ 'height': '100px' })),
                                        ]),
                                        animations_1.animate(500, animations_1.keyframes([
                                            animations_1.style({ 'opacity': '0' }),
                                            animations_1.style({ 'opacity': '1' })
                                        ]))
                                    ]),
                                ])],
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
                expect(getLog().length).toEqual(0);
                resetLog();
                cmp.exp = 'b';
                fixture.detectChanges();
                engine.flush();
                expect(getLog().length).toEqual(1);
                resetLog();
                cmp.exp = 'c';
                fixture.detectChanges();
                engine.flush();
                var players = getLog();
                expect(players.length).toEqual(3);
                var p1 = players[0], p2 = players[1], p3 = players[2];
                expect(p1.previousStyles).toEqual({ opacity: animations_1.AUTO_STYLE });
                expect(p2.previousStyles).toEqual({ opacity: animations_1.AUTO_STYLE });
                expect(p3.previousStyles).toEqual({});
            });
            it('should provide the styling of previous players that are grouped', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                        this.exp = false;
                    }
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            template: "\n          <div [@myAnimation]=\"exp\"></div>\n        ",
                            animations: [animations_1.trigger('myAnimation', [
                                    animations_1.transition('1 => 2', [
                                        animations_1.group([
                                            animations_1.animate(500, animations_1.style({ 'width': '100px' })),
                                            animations_1.animate(500, animations_1.style({ 'height': '100px' })),
                                        ]),
                                        animations_1.animate(500, animations_1.keyframes([
                                            animations_1.style({ 'opacity': '0' }),
                                            animations_1.style({ 'opacity': '1' })
                                        ]))
                                    ]),
                                    animations_1.transition('2 => 3', [
                                        animations_1.style({ 'opacity': '0' }),
                                        animations_1.animate(500, animations_1.style({ 'opacity': '1' })),
                                    ]),
                                ])],
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
                cmp.exp = '1';
                fixture.detectChanges();
                engine.flush();
                expect(getLog().length).toEqual(0);
                resetLog();
                cmp.exp = '2';
                fixture.detectChanges();
                engine.flush();
                expect(getLog().length).toEqual(3);
                resetLog();
                cmp.exp = '3';
                fixture.detectChanges();
                engine.flush();
                var players = getLog();
                expect(players.length).toEqual(1);
                var player = players[0];
                var pp = player.previousPlayers;
                expect(pp.length).toEqual(3);
                expect(pp[0].currentSnapshot).toEqual({ width: animations_1.AUTO_STYLE });
                expect(pp[1].currentSnapshot).toEqual({ height: animations_1.AUTO_STYLE });
                expect(pp[2].currentSnapshot).toEqual({ opacity: animations_1.AUTO_STYLE });
            });
            it('should provide the styling of previous players that are grouped and queried and make sure match the players with the correct elements', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                        this.exp = false;
                    }
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            template: "\n          <div class=\"container\" [@myAnimation]=\"exp\">\n            <div class=\"inner\"></div>\n          </div>\n        ",
                            animations: [
                                animations_1.trigger('myAnimation', [
                                    animations_1.transition('1 => 2', [
                                        animations_1.style({ fontSize: '10px' }),
                                        animations_1.query('.inner', [
                                            animations_1.style({ fontSize: '20px' }),
                                        ]),
                                        animations_1.animate('1s', animations_1.style({ fontSize: '100px' })),
                                        animations_1.query('.inner', [
                                            animations_1.animate('1s', animations_1.style({ fontSize: '200px' })),
                                        ]),
                                    ]),
                                    animations_1.transition('2 => 3', [
                                        animations_1.animate('1s', animations_1.style({ fontSize: '0px' })),
                                        animations_1.query('.inner', [
                                            animations_1.animate('1s', animations_1.style({ fontSize: '0px' })),
                                        ]),
                                    ]),
                                ]),
                            ],
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                fixture.detectChanges();
                cmp.exp = '1';
                fixture.detectChanges();
                resetLog();
                cmp.exp = '2';
                fixture.detectChanges();
                resetLog();
                cmp.exp = '3';
                fixture.detectChanges();
                var players = getLog();
                expect(players.length).toEqual(2);
                var _a = players, p1 = _a[0], p2 = _a[1];
                var pp1 = p1.previousPlayers;
                expect(p1.element.classList.contains('container')).toBeTruthy();
                for (var i = 0; i < pp1.length; i++) {
                    expect(pp1[i].element).toEqual(p1.element);
                }
                var pp2 = p2.previousPlayers;
                expect(p2.element.classList.contains('inner')).toBeTruthy();
                for (var i = 0; i < pp2.length; i++) {
                    expect(pp2[i].element).toEqual(p2.element);
                }
            });
            it('should properly balance styles between states even if there are no destination state styles', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                        this.exp = false;
                    }
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            template: "\n            <div @myAnimation *ngIf=\"exp\"></div>\n          ",
                            animations: [animations_1.trigger('myAnimation', [
                                    animations_1.state('void', animations_1.style({ opacity: 0, width: '0px', height: '0px' })),
                                    animations_1.transition(':enter', animations_1.animate(1000))
                                ])]
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
                engine.flush();
                var p1 = getLog()[0];
                expect(p1.keyframes).toEqual([
                    { opacity: '0', width: '0px', height: '0px', offset: 0 },
                    { opacity: animations_1.AUTO_STYLE, width: animations_1.AUTO_STYLE, height: animations_1.AUTO_STYLE, offset: 1 }
                ]);
            });
            it('should not apply the destination styles if the final animate step already contains styles', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                        this.exp = false;
                    }
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            template: "\n            <div @myAnimation *ngIf=\"exp\"></div>\n          ",
                            animations: [animations_1.trigger('myAnimation', [
                                    animations_1.state('void', animations_1.style({ color: 'red' })), animations_1.state('*', animations_1.style({ color: 'blue' })),
                                    animations_1.transition(':enter', [animations_1.style({ fontSize: '0px ' }), animations_1.animate(1000, animations_1.style({ fontSize: '100px' }))])
                                ])]
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
                engine.flush();
                var players = getLog();
                expect(players.length).toEqual(1);
                // notice how the final color is NOT blue
                expect(players[0].keyframes).toEqual([
                    { fontSize: '0px', color: 'red', offset: 0 },
                    { fontSize: '100px', color: 'red', offset: 1 }
                ]);
            });
            it('should invoke an animation trigger that is state-less', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                        this.items = [];
                    }
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            template: "\n            <div *ngFor=\"let item of items\" @myAnimation></div>\n          ",
                            animations: [animations_1.trigger('myAnimation', [animations_1.transition(':enter', [animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: 1 }))])])]
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.items = [1, 2, 3, 4, 5];
                fixture.detectChanges();
                engine.flush();
                expect(getLog().length).toEqual(5);
                for (var i = 0; i < 5; i++) {
                    var item = getLog()[i];
                    expect(item.duration).toEqual(1000);
                    expect(item.keyframes).toEqual([{ opacity: '0', offset: 0 }, { opacity: '1', offset: 1 }]);
                }
            });
            it('should retain styles on the element once the animation is complete', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                    }
                    __decorate([
                        core_1.ViewChild('green'),
                        __metadata("design:type", Object)
                    ], Cmp.prototype, "element", void 0);
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            template: "\n            <div #green @green></div>\n          ",
                            animations: [animations_1.trigger('green', [
                                    animations_1.state('*', animations_1.style({ backgroundColor: 'green' })), animations_1.transition('* => *', animations_1.animate(500))
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
                var player = engine.players.pop();
                player.finish();
                expect(dom_adapter_1.getDOM().hasStyle(cmp.element.nativeElement, 'background-color', 'green'))
                    .toBeTruthy();
            });
            it('should retain state styles when the underlying DOM structure changes even if there are no insert/remove animations', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                        this.colorExp = 'green';
                        this.items = [0, 1, 2, 3];
                    }
                    Cmp.prototype.reorder = function () {
                        var temp = this.items[0];
                        this.items[0] = this.items[1];
                        this.items[1] = temp;
                    };
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            template: "\n            <div class=\"item\" *ngFor=\"let item of items\" [@color]=\"colorExp\">\n              {{ item }}\n            </div>\n          ",
                            animations: [animations_1.trigger('color', [animations_1.state('green', animations_1.style({ backgroundColor: 'green' }))])]
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                fixture.detectChanges();
                var elements = fixture.nativeElement.querySelectorAll('.item');
                assertBackgroundColor(elements[0], 'green');
                assertBackgroundColor(elements[1], 'green');
                assertBackgroundColor(elements[2], 'green');
                assertBackgroundColor(elements[3], 'green');
                elements[0].title = '0a';
                elements[1].title = '1a';
                cmp.reorder();
                fixture.detectChanges();
                elements = fixture.nativeElement.querySelectorAll('.item');
                assertBackgroundColor(elements[0], 'green');
                assertBackgroundColor(elements[1], 'green');
                assertBackgroundColor(elements[2], 'green');
                assertBackgroundColor(elements[3], 'green');
                function assertBackgroundColor(element, color) {
                    expect(element.style.getPropertyValue('background-color')).toEqual(color);
                }
            });
            it('should retain state styles when the underlying DOM structure changes even if there are insert/remove animations', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                        this.colorExp = 'green';
                        this.items = [0, 1, 2, 3];
                    }
                    Cmp.prototype.reorder = function () {
                        var temp = this.items[0];
                        this.items[0] = this.items[1];
                        this.items[1] = temp;
                    };
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            template: "\n            <div class=\"item\" *ngFor=\"let item of items\" [@color]=\"colorExp\">\n              {{ item }}\n            </div>\n          ",
                            animations: [animations_1.trigger('color', [
                                    animations_1.transition('* => *', animations_1.animate(500)),
                                    animations_1.state('green', animations_1.style({ backgroundColor: 'green' }))
                                ])]
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                fixture.detectChanges();
                getLog().forEach(function (p) { return p.finish(); });
                var elements = fixture.nativeElement.querySelectorAll('.item');
                assertBackgroundColor(elements[0], 'green');
                assertBackgroundColor(elements[1], 'green');
                assertBackgroundColor(elements[2], 'green');
                assertBackgroundColor(elements[3], 'green');
                elements[0].title = '0a';
                elements[1].title = '1a';
                cmp.reorder();
                fixture.detectChanges();
                getLog().forEach(function (p) { return p.finish(); });
                elements = fixture.nativeElement.querySelectorAll('.item');
                assertBackgroundColor(elements[0], 'green');
                assertBackgroundColor(elements[1], 'green');
                assertBackgroundColor(elements[2], 'green');
                assertBackgroundColor(elements[3], 'green');
                function assertBackgroundColor(element, color) {
                    expect(element.style.getPropertyValue('background-color')).toEqual(color);
                }
            });
            it('should animate removals of nodes to the `void` state for each animation trigger, but treat all auto styles as pre styles', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                        this.exp = true;
                        this.exp2 = 'state';
                    }
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            template: "\n            <div *ngIf=\"exp\" class=\"ng-if\" [@trig1]=\"exp2\" @trig2></div>\n          ",
                            animations: [
                                animations_1.trigger('trig1', [animations_1.transition('state => void', [animations_1.animate(1000, animations_1.style({ opacity: 0 }))])]),
                                animations_1.trigger('trig2', [animations_1.transition(':leave', [animations_1.animate(1000, animations_1.style({ width: '0px' }))])])
                            ]
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
                engine.flush();
                resetLog();
                var element = dom_adapter_1.getDOM().querySelector(fixture.nativeElement, '.ng-if');
                assertHasParent(element, true);
                cmp.exp = false;
                fixture.detectChanges();
                engine.flush();
                assertHasParent(element, true);
                expect(getLog().length).toEqual(2);
                var player2 = getLog().pop();
                var player1 = getLog().pop();
                expect(player2.keyframes).toEqual([
                    { width: animations_1.ɵPRE_STYLE, offset: 0 },
                    { width: '0px', offset: 1 },
                ]);
                expect(player1.keyframes).toEqual([
                    { opacity: animations_1.ɵPRE_STYLE, offset: 0 }, { opacity: '0', offset: 1 }
                ]);
                player2.finish();
                player1.finish();
                assertHasParent(element, false);
            });
            it('should properly cancel all existing animations when a removal occurs', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                    }
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            template: "\n            <div *ngIf=\"exp\" [@myAnimation]=\"exp\"></div>\n          ",
                            animations: [
                                animations_1.trigger('myAnimation', [
                                    animations_1.transition('* => go', [animations_1.style({ width: '0px' }), animations_1.animate(1000, animations_1.style({ width: '100px' }))]),
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
                expect(getLog().length).toEqual(1);
                var player1 = getLog()[0];
                resetLog();
                var finished = false;
                player1.onDone(function () { return finished = true; });
                var destroyed = false;
                player1.onDestroy(function () { return destroyed = true; });
                cmp.exp = null;
                fixture.detectChanges();
                engine.flush();
                expect(finished).toBeTruthy();
                expect(destroyed).toBeTruthy();
            });
            it('should not run inner child animations when a parent is set to be removed', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                        this.exp = true;
                        this.exp2 = '0';
                    }
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            template: "\n            <div *ngIf=\"exp\" class=\"parent\" >\n              <div [@myAnimation]=\"exp2\"></div>\n            </div>\n          ",
                            animations: [animations_1.trigger('myAnimation', [animations_1.transition('a => b', [animations_1.animate(1000, animations_1.style({ width: '0px' }))])])]
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = true;
                cmp.exp2 = 'a';
                fixture.detectChanges();
                engine.flush();
                resetLog();
                cmp.exp = false;
                cmp.exp2 = 'b';
                fixture.detectChanges();
                engine.flush();
                expect(getLog().length).toEqual(0);
            });
            it('should cancel all active inner child animations when a parent removal animation is set to go', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                    }
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            template: "\n            <div *ngIf=\"exp1\" @parent>\n              <div [@child]=\"exp2\" class=\"child1\"></div>\n              <div [@child]=\"exp2\" class=\"child2\"></div>\n            </div>\n          ",
                            animations: [
                                animations_1.trigger('parent', [animations_1.transition(':leave', [animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: 1 }))])]),
                                animations_1.trigger('child', [animations_1.transition('a => b', [animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: 1 }))])])
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
                cmp.exp2 = 'a';
                fixture.detectChanges();
                engine.flush();
                resetLog();
                cmp.exp2 = 'b';
                fixture.detectChanges();
                engine.flush();
                var players = getLog();
                expect(players.length).toEqual(2);
                var p1 = players[0], p2 = players[1];
                var count = 0;
                p1.onDone(function () { return count++; });
                p2.onDone(function () { return count++; });
                cmp.exp1 = false;
                fixture.detectChanges();
                engine.flush();
                expect(count).toEqual(2);
            });
            it('should destroy inner animations when a parent node is set for removal', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                    }
                    __decorate([
                        core_1.ViewChild('parent'),
                        __metadata("design:type", Object)
                    ], Cmp.prototype, "parentElement", void 0);
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            template: "\n            <div #parent class=\"parent\">\n              <div [@child]=\"exp\" class=\"child1\"></div>\n              <div [@child]=\"exp\" class=\"child2\"></div>\n            </div>\n          ",
                            animations: [animations_1.trigger('child', [animations_1.transition('a => b', [animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: 1 }))])])]
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                var someTrigger = animations_1.trigger('someTrigger', []);
                var hostElement = fixture.nativeElement;
                engine.register(DEFAULT_NAMESPACE_ID, hostElement);
                engine.registerTrigger(DEFAULT_COMPONENT_ID, DEFAULT_NAMESPACE_ID, hostElement, someTrigger.name, someTrigger);
                cmp.exp = 'a';
                fixture.detectChanges();
                engine.flush();
                resetLog();
                cmp.exp = 'b';
                fixture.detectChanges();
                engine.flush();
                var players = getLog();
                expect(players.length).toEqual(2);
                var p1 = players[0], p2 = players[1];
                var count = 0;
                p1.onDone(function () { return count++; });
                p2.onDone(function () { return count++; });
                engine.onRemove(DEFAULT_NAMESPACE_ID, cmp.parentElement.nativeElement, null);
                expect(count).toEqual(2);
            });
            it('should allow inner removals to happen when a non removal-based parent animation is set to animate', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                    }
                    __decorate([
                        core_1.ViewChild('parent'),
                        __metadata("design:type", Object)
                    ], Cmp.prototype, "parent", void 0);
                    __decorate([
                        core_1.ViewChild('child'),
                        __metadata("design:type", Object)
                    ], Cmp.prototype, "child", void 0);
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            template: "\n            <div #parent [@parent]=\"exp1\" class=\"parent\">\n              <div #child *ngIf=\"exp2\" class=\"child\"></div>\n            </div>\n          ",
                            animations: [animations_1.trigger('parent', [animations_1.transition('a => b', [animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: 1 }))])])]
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp1 = 'a';
                cmp.exp2 = true;
                fixture.detectChanges();
                engine.flush();
                resetLog();
                cmp.exp1 = 'b';
                fixture.detectChanges();
                engine.flush();
                var player = getLog()[0];
                var p = cmp.parent.nativeElement;
                var c = cmp.child.nativeElement;
                expect(p.contains(c)).toBeTruthy();
                cmp.exp2 = false;
                fixture.detectChanges();
                engine.flush();
                expect(p.contains(c)).toBeFalsy();
                player.finish();
                expect(p.contains(c)).toBeFalsy();
            });
            it('should make inner removals wait until a parent based removal animation has finished', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                    }
                    __decorate([
                        core_1.ViewChild('parent'),
                        __metadata("design:type", Object)
                    ], Cmp.prototype, "parent", void 0);
                    __decorate([
                        core_1.ViewChild('child1'),
                        __metadata("design:type", Object)
                    ], Cmp.prototype, "child1Elm", void 0);
                    __decorate([
                        core_1.ViewChild('child2'),
                        __metadata("design:type", Object)
                    ], Cmp.prototype, "child2Elm", void 0);
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            template: "\n            <div #parent *ngIf=\"exp1\" @parent class=\"parent\">\n              <div #child1 *ngIf=\"exp2\" class=\"child1\"></div>\n              <div #child2 *ngIf=\"exp2\" class=\"child2\"></div>\n            </div>\n          ",
                            animations: [animations_1.trigger('parent', [animations_1.transition(':leave', [animations_1.style({ opacity: 0 }), animations_1.animate(1000, animations_1.style({ opacity: 1 }))])])]
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp1 = true;
                cmp.exp2 = true;
                fixture.detectChanges();
                engine.flush();
                resetLog();
                var p = cmp.parent.nativeElement;
                var c1 = cmp.child1Elm.nativeElement;
                var c2 = cmp.child2Elm.nativeElement;
                cmp.exp1 = false;
                cmp.exp2 = false;
                fixture.detectChanges();
                engine.flush();
                expect(p.contains(c1)).toBeTruthy();
                expect(p.contains(c2)).toBeTruthy();
                cmp.exp2 = false;
                fixture.detectChanges();
                engine.flush();
                expect(p.contains(c1)).toBeTruthy();
                expect(p.contains(c2)).toBeTruthy();
            });
            it('should detect trigger changes based on object.value properties', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                    }
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            template: "\n            <div [@myAnimation]=\"{value:exp}\"></div>\n          ",
                            animations: [
                                animations_1.trigger('myAnimation', [
                                    animations_1.transition('* => 1', [animations_1.animate(1234, animations_1.style({ opacity: 0 }))]),
                                    animations_1.transition('* => 2', [animations_1.animate(5678, animations_1.style({ opacity: 0 }))]),
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
                cmp.exp = '1';
                fixture.detectChanges();
                engine.flush();
                var players = getLog();
                expect(players.length).toEqual(1);
                expect(players[0].duration).toEqual(1234);
                resetLog();
                cmp.exp = '2';
                fixture.detectChanges();
                engine.flush();
                players = getLog();
                expect(players.length).toEqual(1);
                expect(players[0].duration).toEqual(5678);
            });
            it('should not render animations when the object expression value is the same as it was previously', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                    }
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            template: "\n            <div [@myAnimation]=\"{value:exp,params:params}\"></div>\n          ",
                            animations: [
                                animations_1.trigger('myAnimation', [
                                    animations_1.transition('* => *', [animations_1.animate(1234, animations_1.style({ opacity: 0 }))]),
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
                cmp.exp = '1';
                cmp.params = {};
                fixture.detectChanges();
                engine.flush();
                var players = getLog();
                expect(players.length).toEqual(1);
                expect(players[0].duration).toEqual(1234);
                resetLog();
                cmp.exp = '1';
                cmp.params = {};
                fixture.detectChanges();
                engine.flush();
                players = getLog();
                expect(players.length).toEqual(0);
            });
            it('should update the final state styles when params update even if the expression hasn\'t changed', testing_2.fakeAsync(function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                    }
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            template: "\n            <div [@myAnimation]=\"{value:exp,params:{color:color}}\"></div>\n          ",
                            animations: [
                                animations_1.trigger('myAnimation', [
                                    animations_1.state('*', animations_1.style({ color: '{{ color }}' }), { params: { color: 'black' } }),
                                    animations_1.transition('* => 1', animations_1.animate(500))
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
                cmp.exp = '1';
                cmp.color = 'red';
                fixture.detectChanges();
                var player = getLog()[0];
                var element = player.element;
                player.finish();
                testing_2.flushMicrotasks();
                expect(dom_adapter_1.getDOM().hasStyle(element, 'color', 'red')).toBeTruthy();
                cmp.exp = '1';
                cmp.color = 'blue';
                fixture.detectChanges();
                resetLog();
                testing_2.flushMicrotasks();
                expect(dom_adapter_1.getDOM().hasStyle(element, 'color', 'blue')).toBeTruthy();
                cmp.exp = '1';
                cmp.color = null;
                fixture.detectChanges();
                resetLog();
                testing_2.flushMicrotasks();
                expect(dom_adapter_1.getDOM().hasStyle(element, 'color', 'black')).toBeTruthy();
            }));
            it('should substitute in values if the provided state match is an object with values', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                    }
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            template: "\n            <div [@myAnimation]=\"exp\"></div>\n          ",
                            animations: [animations_1.trigger('myAnimation', [animations_1.transition('a => b', [animations_1.style({ opacity: '{{ start }}' }), animations_1.animate(1000, animations_1.style({ opacity: '{{ end }}' }))], buildParams({ start: '0', end: '1' }))])]
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = { value: 'a' };
                fixture.detectChanges();
                engine.flush();
                resetLog();
                cmp.exp = { value: 'b', params: { start: .3, end: .6 } };
                fixture.detectChanges();
                engine.flush();
                var player = getLog().pop();
                expect(player.keyframes).toEqual([
                    { opacity: '0.3', offset: 0 }, { opacity: '0.6', offset: 1 }
                ]);
            });
            it('should retain substituted styles on the element once the animation is complete if referenced in the final state', testing_2.fakeAsync(function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                    }
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            template: "\n            <div [@myAnimation]=\"{value:exp, params: { color: color }}\"></div>\n          ",
                            animations: [
                                animations_1.trigger('myAnimation', [
                                    animations_1.state('start', animations_1.style({
                                        color: '{{ color }}',
                                        fontSize: '{{ fontSize }}px',
                                        width: '{{ width }}'
                                    }), { params: { color: 'red', fontSize: '200', width: '10px' } }),
                                    animations_1.state('final', animations_1.style({ color: '{{ color }}', fontSize: '{{ fontSize }}px', width: '888px' }), { params: { color: 'green', fontSize: '50', width: '100px' } }),
                                    animations_1.transition('start => final', animations_1.animate(500)),
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
                cmp.exp = 'start';
                cmp.color = 'red';
                fixture.detectChanges();
                resetLog();
                cmp.exp = 'final';
                cmp.color = 'blue';
                fixture.detectChanges();
                var players = getLog();
                expect(players.length).toEqual(1);
                var p1 = players[0];
                expect(p1.keyframes).toEqual([
                    { color: 'red', fontSize: '200px', width: '10px', offset: 0 },
                    { color: 'blue', fontSize: '50px', width: '888px', offset: 1 }
                ]);
                var element = p1.element;
                p1.finish();
                testing_2.flushMicrotasks();
                expect(dom_adapter_1.getDOM().hasStyle(element, 'color', 'blue')).toBeTruthy();
                expect(dom_adapter_1.getDOM().hasStyle(element, 'fontSize', '50px')).toBeTruthy();
                expect(dom_adapter_1.getDOM().hasStyle(element, 'width', '888px')).toBeTruthy();
            }));
            it('should only evaluate final state param substitutions from the expression and state values and not from the transition options ', testing_2.fakeAsync(function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                    }
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'ani-cmp',
                            template: "\n            <div [@myAnimation]=\"exp\"></div>\n          ",
                            animations: [
                                animations_1.trigger('myAnimation', [
                                    animations_1.state('start', animations_1.style({
                                        width: '{{ width }}',
                                        height: '{{ height }}',
                                    }), { params: { width: '0px', height: '0px' } }),
                                    animations_1.state('final', animations_1.style({
                                        width: '{{ width }}',
                                        height: '{{ height }}',
                                    }), { params: { width: '100px', height: '100px' } }),
                                    animations_1.transition('start => final', [animations_1.animate(500)], { params: { width: '333px', height: '666px' } }),
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
                cmp.exp = 'start';
                fixture.detectChanges();
                resetLog();
                cmp.exp = 'final';
                fixture.detectChanges();
                var players = getLog();
                expect(players.length).toEqual(1);
                var p1 = players[0];
                expect(p1.keyframes).toEqual([
                    { width: '0px', height: '0px', offset: 0 },
                    { width: '100px', height: '100px', offset: 1 },
                ]);
                var element = p1.element;
                p1.finish();
                testing_2.flushMicrotasks();
                expect(dom_adapter_1.getDOM().hasStyle(element, 'width', '100px')).toBeTruthy();
                expect(dom_adapter_1.getDOM().hasStyle(element, 'height', '100px')).toBeTruthy();
            }));
            it('should not flush animations twice when an inner component runs change detection', function () {
                var OuterCmp = /** @class */ (function () {
                    function OuterCmp() {
                        this.exp = null;
                    }
                    OuterCmp.prototype.update = function () { this.exp = 'go'; };
                    OuterCmp.prototype.ngDoCheck = function () {
                        if (this.exp == 'go') {
                            this.inner.update();
                        }
                    };
                    __decorate([
                        core_1.ViewChild('inner'),
                        __metadata("design:type", Object)
                    ], OuterCmp.prototype, "inner", void 0);
                    OuterCmp = __decorate([
                        core_1.Component({
                            selector: 'outer-cmp',
                            template: "\n            <div *ngIf=\"exp\" @outer></div>\n            <inner-cmp #inner></inner-cmp>\n          ",
                            animations: [animations_1.trigger('outer', [animations_1.transition(':enter', [animations_1.style({ opacity: 0 }), animations_1.animate('1s', animations_1.style({ opacity: 1 }))])])]
                        })
                    ], OuterCmp);
                    return OuterCmp;
                }());
                var InnerCmp = /** @class */ (function () {
                    function InnerCmp(_ref) {
                        this._ref = _ref;
                    }
                    InnerCmp.prototype.update = function () {
                        this.exp = 'go';
                        this._ref.detectChanges();
                    };
                    InnerCmp = __decorate([
                        core_1.Component({
                            selector: 'inner-cmp',
                            template: "\n            <div *ngIf=\"exp\" @inner></div>\n          ",
                            animations: [animations_1.trigger('inner', [animations_1.transition(':enter', [
                                        animations_1.style({ opacity: 0 }),
                                        animations_1.animate('1s', animations_1.style({ opacity: 1 })),
                                    ])])]
                        }),
                        __metadata("design:paramtypes", [core_1.ChangeDetectorRef])
                    ], InnerCmp);
                    return InnerCmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [OuterCmp, InnerCmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(OuterCmp);
                var cmp = fixture.componentInstance;
                fixture.detectChanges();
                expect(getLog()).toEqual([]);
                cmp.update();
                fixture.detectChanges();
                var players = getLog();
                expect(players.length).toEqual(2);
            });
            describe('transition aliases', function () {
                describe(':increment', function () {
                    it('should detect when a value has incremented', function () {
                        var Cmp = /** @class */ (function () {
                            function Cmp() {
                                this.exp = 0;
                            }
                            Cmp = __decorate([
                                core_1.Component({
                                    selector: 'if-cmp',
                                    template: "\n          <div [@myAnimation]=\"exp\"></div>\n        ",
                                    animations: [
                                        animations_1.trigger('myAnimation', [
                                            animations_1.transition(':increment', [
                                                animations_1.animate(1234, animations_1.style({ background: 'red' })),
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
                        fixture.detectChanges();
                        var players = getLog();
                        expect(players.length).toEqual(0);
                        cmp.exp++;
                        fixture.detectChanges();
                        players = getLog();
                        expect(players.length).toEqual(1);
                        expect(players[0].duration).toEqual(1234);
                        resetLog();
                        cmp.exp = 5;
                        fixture.detectChanges();
                        players = getLog();
                        expect(players.length).toEqual(1);
                        expect(players[0].duration).toEqual(1234);
                    });
                });
                describe(':decrement', function () {
                    it('should detect when a value has decremented', function () {
                        var Cmp = /** @class */ (function () {
                            function Cmp() {
                                this.exp = 5;
                            }
                            Cmp = __decorate([
                                core_1.Component({
                                    selector: 'if-cmp',
                                    template: "\n          <div [@myAnimation]=\"exp\"></div>\n        ",
                                    animations: [
                                        animations_1.trigger('myAnimation', [
                                            animations_1.transition(':decrement', [
                                                animations_1.animate(1234, animations_1.style({ background: 'red' })),
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
                        fixture.detectChanges();
                        var players = getLog();
                        expect(players.length).toEqual(0);
                        cmp.exp--;
                        fixture.detectChanges();
                        players = getLog();
                        expect(players.length).toEqual(1);
                        expect(players[0].duration).toEqual(1234);
                        resetLog();
                        cmp.exp = 0;
                        fixture.detectChanges();
                        players = getLog();
                        expect(players.length).toEqual(1);
                        expect(players[0].duration).toEqual(1234);
                    });
                });
            });
            it('should animate nodes properly when they have been re-ordered', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                        this.items = [
                            { value: '1', count: 0 },
                            { value: '2', count: 0 },
                            { value: '3', count: 0 },
                            { value: '4', count: 0 },
                            { value: '5', count: 0 },
                        ];
                    }
                    Cmp.prototype.reOrder = function () {
                        this.items = [
                            this.items[4],
                            this.items[1],
                            this.items[3],
                            this.items[0],
                            this.items[2],
                        ];
                    };
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'if-cmp',
                            template: "\n                <div *ngFor=\"let item of items\" [class]=\"'class-' + item.value\">\n                  <div [@myAnimation]=\"item.count\">\n                    {{ item.value }}\n                  </div>\n                </div>\n              ",
                            animations: [
                                animations_1.trigger('myAnimation', [
                                    animations_1.state('0', animations_1.style({ opacity: 0 })), animations_1.state('1', animations_1.style({ opacity: 0.4 })),
                                    animations_1.state('2', animations_1.style({ opacity: 0.8 })), animations_1.transition('* => 1, * => 2', [animations_1.animate(1000)])
                                ]),
                            ]
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                var one = cmp.items[0];
                var two = cmp.items[1];
                one.count++;
                fixture.detectChanges();
                cmp.reOrder();
                fixture.detectChanges();
                resetLog();
                one.count++;
                two.count++;
                fixture.detectChanges();
                var players = getLog();
                expect(players.length).toEqual(2);
            });
        });
        describe('animation listeners', function () {
            it('should trigger a `start` state change listener for when the animation changes state from void => state', testing_2.fakeAsync(function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                        var _this = this;
                        this.exp = false;
                        this.callback = function (event) { _this.event = event; };
                    }
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'if-cmp',
                            template: "\n          <div *ngIf=\"exp\" [@myAnimation]=\"exp\" (@myAnimation.start)=\"callback($event)\"></div>\n        ",
                            animations: [animations_1.trigger('myAnimation', [animations_1.transition('void => *', [animations_1.style({ 'opacity': '0' }), animations_1.animate(500, animations_1.style({ 'opacity': '1' }))])])],
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = 'true';
                fixture.detectChanges();
                testing_2.flushMicrotasks();
                expect(cmp.event.triggerName).toEqual('myAnimation');
                expect(cmp.event.phaseName).toEqual('start');
                expect(cmp.event.totalTime).toEqual(500);
                expect(cmp.event.fromState).toEqual('void');
                expect(cmp.event.toState).toEqual('true');
            }));
            it('should trigger a `done` state change listener for when the animation changes state from a => b', testing_2.fakeAsync(function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                        var _this = this;
                        this.exp = false;
                        this.callback = function (event) { _this.event = event; };
                    }
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'if-cmp',
                            template: "\n          <div *ngIf=\"exp\" [@myAnimation123]=\"exp\" (@myAnimation123.done)=\"callback($event)\"></div>\n        ",
                            animations: [animations_1.trigger('myAnimation123', [animations_1.transition('* => b', [animations_1.style({ 'opacity': '0' }), animations_1.animate(999, animations_1.style({ 'opacity': '1' }))])])],
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = 'b';
                fixture.detectChanges();
                engine.flush();
                expect(cmp.event).toBeFalsy();
                var player = engine.players.pop();
                player.finish();
                testing_2.flushMicrotasks();
                expect(cmp.event.triggerName).toEqual('myAnimation123');
                expect(cmp.event.phaseName).toEqual('done');
                expect(cmp.event.totalTime).toEqual(999);
                expect(cmp.event.fromState).toEqual('void');
                expect(cmp.event.toState).toEqual('b');
            }));
            it('should handle callbacks for multiple triggers running simultaneously', testing_2.fakeAsync(function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                        var _this = this;
                        this.exp1 = false;
                        this.exp2 = false;
                        // tslint:disable:semicolon
                        this.callback1 = function (event) { _this.event1 = event; };
                        // tslint:disable:semicolon
                        this.callback2 = function (event) { _this.event2 = event; };
                    }
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'if-cmp',
                            template: "\n          <div [@ani1]=\"exp1\" (@ani1.done)=\"callback1($event)\"></div>\n          <div [@ani2]=\"exp2\" (@ani2.done)=\"callback2($event)\"></div>\n        ",
                            animations: [
                                animations_1.trigger('ani1', [
                                    animations_1.transition('* => a', [animations_1.style({ 'opacity': '0' }), animations_1.animate(999, animations_1.style({ 'opacity': '1' }))]),
                                ]),
                                animations_1.trigger('ani2', [
                                    animations_1.transition('* => b', [animations_1.style({ 'width': '0px' }), animations_1.animate(999, animations_1.style({ 'width': '100px' }))]),
                                ])
                            ],
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp1 = 'a';
                cmp.exp2 = 'b';
                fixture.detectChanges();
                engine.flush();
                expect(cmp.event1).toBeFalsy();
                expect(cmp.event2).toBeFalsy();
                var player1 = engine.players[0];
                var player2 = engine.players[1];
                player1.finish();
                player2.finish();
                expect(cmp.event1).toBeFalsy();
                expect(cmp.event2).toBeFalsy();
                testing_2.flushMicrotasks();
                expect(cmp.event1.triggerName).toBeTruthy('ani1');
                expect(cmp.event2.triggerName).toBeTruthy('ani2');
            }));
            it('should handle callbacks for multiple triggers running simultaneously on the same element', testing_2.fakeAsync(function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                        var _this = this;
                        this.exp1 = false;
                        this.exp2 = false;
                        this.callback1 = function (event) { _this.event1 = event; };
                        this.callback2 = function (event) { _this.event2 = event; };
                    }
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'if-cmp',
                            template: "\n          <div [@ani1]=\"exp1\" (@ani1.done)=\"callback1($event)\" [@ani2]=\"exp2\" (@ani2.done)=\"callback2($event)\"></div>\n        ",
                            animations: [
                                animations_1.trigger('ani1', [
                                    animations_1.transition('* => a', [animations_1.style({ 'opacity': '0' }), animations_1.animate(999, animations_1.style({ 'opacity': '1' }))]),
                                ]),
                                animations_1.trigger('ani2', [
                                    animations_1.transition('* => b', [animations_1.style({ 'width': '0px' }), animations_1.animate(999, animations_1.style({ 'width': '100px' }))]),
                                ])
                            ],
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp1 = 'a';
                cmp.exp2 = 'b';
                fixture.detectChanges();
                engine.flush();
                expect(cmp.event1).toBeFalsy();
                expect(cmp.event2).toBeFalsy();
                var player1 = engine.players[0];
                var player2 = engine.players[1];
                player1.finish();
                player2.finish();
                expect(cmp.event1).toBeFalsy();
                expect(cmp.event2).toBeFalsy();
                testing_2.flushMicrotasks();
                expect(cmp.event1.triggerName).toBeTruthy('ani1');
                expect(cmp.event2.triggerName).toBeTruthy('ani2');
            }));
            it('should handle a leave animation for multiple triggers even if not all triggers have their own leave transition specified', testing_2.fakeAsync(function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                        this.exp = false;
                    }
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'if-cmp',
                            template: "\n               <div *ngIf=\"exp\" @foo @bar>123</div>\n             ",
                            animations: [
                                animations_1.trigger('foo', [
                                    animations_1.transition(':enter', [
                                        animations_1.style({ opacity: 0 }),
                                        animations_1.animate(1000, animations_1.style({ opacity: 1 })),
                                    ]),
                                ]),
                                animations_1.trigger('bar', [
                                    animations_1.transition(':leave', [
                                        animations_1.animate(1000, animations_1.style({ opacity: 0 })),
                                    ]),
                                ])
                            ],
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var elm = fixture.elementRef.nativeElement;
                var cmp = fixture.componentInstance;
                cmp.exp = true;
                fixture.detectChanges();
                var players = getLog();
                expect(players.length).toEqual(1);
                var p1 = players[0];
                p1.finish();
                testing_2.flushMicrotasks();
                expect(elm.innerText.trim()).toEqual('123');
                resetLog();
                cmp.exp = false;
                fixture.detectChanges();
                players = getLog();
                expect(players.length).toEqual(1);
                p1 = players[0];
                p1.finish();
                testing_2.flushMicrotasks();
                expect(elm.innerText.trim()).toEqual('');
            }));
            it('should trigger a state change listener for when the animation changes state from void => state on the host element', testing_2.fakeAsync(function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                        var _this = this;
                        this.exp = false;
                        this.callback = function (event) { _this.event = event; };
                    }
                    __decorate([
                        core_1.HostBinding('@myAnimation2'),
                        __metadata("design:type", Object)
                    ], Cmp.prototype, "exp", void 0);
                    __decorate([
                        core_1.HostListener('@myAnimation2.start', ['$event']),
                        __metadata("design:type", Object)
                    ], Cmp.prototype, "callback", void 0);
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'my-cmp',
                            template: "...",
                            animations: [animations_1.trigger('myAnimation2', [animations_1.transition('void => *', [animations_1.style({ 'opacity': '0' }), animations_1.animate(1000, animations_1.style({ 'opacity': '1' }))])])],
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = 'TRUE';
                fixture.detectChanges();
                testing_2.flushMicrotasks();
                expect(cmp.event.triggerName).toEqual('myAnimation2');
                expect(cmp.event.phaseName).toEqual('start');
                expect(cmp.event.totalTime).toEqual(1000);
                expect(cmp.event.fromState).toEqual('void');
                expect(cmp.event.toState).toEqual('TRUE');
            }));
            it('should always fire callbacks even when a transition is not detected', testing_2.fakeAsync(function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                        var _this = this;
                        this.log = [];
                        this.callback = function (event) { return _this.log.push(event.phaseName + " => " + event.toState); };
                    }
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'my-cmp',
                            template: "\n              <div [@myAnimation]=\"exp\" (@myAnimation.start)=\"callback($event)\" (@myAnimation.done)=\"callback($event)\"></div>\n            ",
                            animations: [animations_1.trigger('myAnimation', [])]
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({
                    providers: [{ provide: browser_1.AnimationDriver, useClass: browser_1.ɵNoopAnimationDriver }],
                    declarations: [Cmp]
                });
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = 'a';
                fixture.detectChanges();
                testing_2.flushMicrotasks();
                expect(cmp.log).toEqual(['start => a', 'done => a']);
                cmp.log = [];
                cmp.exp = 'b';
                fixture.detectChanges();
                testing_2.flushMicrotasks();
                expect(cmp.log).toEqual(['start => b', 'done => b']);
            }));
            it('should fire callback events for leave animations even if there is no leave transition', testing_2.fakeAsync(function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                        var _this = this;
                        this.exp = false;
                        this.log = [];
                        this.callback = function (event) {
                            var state = event.toState || '_default_';
                            _this.log.push(event.phaseName + " => " + state);
                        };
                    }
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'my-cmp',
                            template: "\n              <div *ngIf=\"exp\" @myAnimation (@myAnimation.start)=\"callback($event)\" (@myAnimation.done)=\"callback($event)\"></div>\n            ",
                            animations: [animations_1.trigger('myAnimation', [])]
                        })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({
                    providers: [{ provide: browser_1.AnimationDriver, useClass: browser_1.ɵNoopAnimationDriver }],
                    declarations: [Cmp]
                });
                var fixture = testing_2.TestBed.createComponent(Cmp);
                var cmp = fixture.componentInstance;
                cmp.exp = true;
                fixture.detectChanges();
                testing_2.flushMicrotasks();
                expect(cmp.log).toEqual(['start => _default_', 'done => _default_']);
                cmp.log = [];
                cmp.exp = false;
                fixture.detectChanges();
                testing_2.flushMicrotasks();
                expect(cmp.log).toEqual(['start => void', 'done => void']);
            }));
            it('should fire callbacks on a sub animation once it starts and finishes', testing_2.fakeAsync(function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                        this.log = [];
                    }
                    Cmp.prototype.cb = function (name, event) { this.log.push(name); };
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'my-cmp',
                            template: "\n              <div class=\"parent\"\n                  [@parent]=\"exp1\"\n                  (@parent.start)=\"cb('parent-start',$event)\"\n                  (@parent.done)=\"cb('parent-done', $event)\">\n                <div class=\"child\"\n                  [@child]=\"exp2\"\n                  (@child.start)=\"cb('child-start',$event)\"\n                  (@child.done)=\"cb('child-done', $event)\"></div>\n              </div>\n            ",
                            animations: [
                                animations_1.trigger('parent', [
                                    animations_1.transition('* => go', [
                                        animations_1.style({ width: '0px' }),
                                        animations_1.animate(1000, animations_1.style({ width: '100px' })),
                                        animations_1.query('.child', [
                                            animations_1.animateChild({ duration: '1s' }),
                                        ]),
                                        animations_1.animate(1000, animations_1.style({ width: '0px' })),
                                    ]),
                                ]),
                                animations_1.trigger('child', [
                                    animations_1.transition('* => go', [
                                        animations_1.style({ height: '0px' }),
                                        animations_1.animate(1000, animations_1.style({ height: '100px' })),
                                    ]),
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
                testing_2.flushMicrotasks();
                expect(cmp.log).toEqual(['parent-start', 'child-start']);
                cmp.log = [];
                var players = getLog();
                expect(players.length).toEqual(3);
                var p1 = players[0], p2 = players[1], p3 = players[2];
                p1.finish();
                testing_2.flushMicrotasks();
                expect(cmp.log).toEqual([]);
                p2.finish();
                testing_2.flushMicrotasks();
                expect(cmp.log).toEqual([]);
                p3.finish();
                testing_2.flushMicrotasks();
                expect(cmp.log).toEqual(['parent-done', 'child-done']);
            }));
            it('should fire callbacks and collect the correct the totalTime and element details for any queried sub animations', testing_2.fakeAsync(function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                        this.log = [];
                        this.events = {};
                        this.items = [0, 1, 2, 3];
                    }
                    Cmp.prototype.cb = function (name, phase, event) {
                        this.log.push(name + '-' + phase);
                        this.events[name] = event;
                    };
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'my-cmp',
                            template: "\n              <div class=\"parent\" [@parent]=\"exp\" (@parent.done)=\"cb('all','done', $event)\">\n                <div *ngFor=\"let item of items\"\n                     class=\"item item-{{ item }}\"\n                     @child\n                     (@child.start)=\"cb('c-' + item, 'start', $event)\"\n                     (@child.done)=\"cb('c-' + item, 'done', $event)\">\n                  {{ item }}\n                </div>\n              </div>\n            ",
                            animations: [
                                animations_1.trigger('parent', [
                                    animations_1.transition('* => go', [
                                        animations_1.style({ opacity: 0 }),
                                        animations_1.animate('1s', animations_1.style({ opacity: 1 })),
                                        animations_1.query('.item', [
                                            animations_1.style({ opacity: 0 }),
                                            animations_1.animate(1000, animations_1.style({ opacity: 1 }))
                                        ]),
                                        animations_1.query('.item', [
                                            animations_1.animateChild({ duration: '1.8s', delay: '300ms' })
                                        ])
                                    ])
                                ]),
                                animations_1.trigger('child', [
                                    animations_1.transition(':enter', [
                                        animations_1.style({ opacity: 0 }),
                                        animations_1.animate(1500, animations_1.style({ opacity: 1 }))
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
                testing_2.flushMicrotasks();
                expect(cmp.log).toEqual(['c-0-start', 'c-1-start', 'c-2-start', 'c-3-start']);
                cmp.log = [];
                var players = getLog();
                // 1 + 4 + 4 = 9 players
                expect(players.length).toEqual(9);
                var _a = getLog(), pA = _a[0], pq1a = _a[1], pq1b = _a[2], pq1c = _a[3], pq1d = _a[4], pq2a = _a[5], pq2b = _a[6], pq2c = _a[7], pq2d = _a[8];
                pA.finish();
                pq1a.finish();
                pq1b.finish();
                pq1c.finish();
                pq1d.finish();
                testing_2.flushMicrotasks();
                expect(cmp.log).toEqual([]);
                pq2a.finish();
                pq2b.finish();
                pq2c.finish();
                pq2d.finish();
                testing_2.flushMicrotasks();
                expect(cmp.log).toEqual(['all-done', 'c-0-done', 'c-1-done', 'c-2-done', 'c-3-done']);
                expect(cmp.events['c-0'].totalTime).toEqual(4100); // 1000 + 1000 + 1800 + 300
                expect(cmp.events['c-0'].element.innerText.trim()).toEqual('0');
                expect(cmp.events['c-1'].totalTime).toEqual(4100);
                expect(cmp.events['c-1'].element.innerText.trim()).toEqual('1');
                expect(cmp.events['c-2'].totalTime).toEqual(4100);
                expect(cmp.events['c-2'].element.innerText.trim()).toEqual('2');
                expect(cmp.events['c-3'].totalTime).toEqual(4100);
                expect(cmp.events['c-3'].element.innerText.trim()).toEqual('3');
            }));
        });
        describe('animation control flags', function () {
            describe('[@.disabled]', function () {
                it('should disable child animations when set to true', function () {
                    var Cmp = /** @class */ (function () {
                        function Cmp() {
                            this.exp = false;
                            this.disableExp = false;
                        }
                        Cmp = __decorate([
                            core_1.Component({
                                selector: 'if-cmp',
                                template: "\n              <div [@.disabled]=\"disableExp\">\n                <div [@myAnimation]=\"exp\"></div>\n              </div>\n            ",
                                animations: [
                                    animations_1.trigger('myAnimation', [
                                        animations_1.transition('* => 1, * => 2', [
                                            animations_1.animate(1234, animations_1.style({ width: '100px' })),
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
                    fixture.detectChanges();
                    resetLog();
                    cmp.disableExp = true;
                    cmp.exp = '1';
                    fixture.detectChanges();
                    var players = getLog();
                    expect(players.length).toEqual(0);
                    cmp.disableExp = false;
                    cmp.exp = '2';
                    fixture.detectChanges();
                    players = getLog();
                    expect(players.length).toEqual(1);
                    expect(players[0].totalTime).toEqual(1234);
                });
                it('should ensure state() values are applied when an animation is disabled', function () {
                    var Cmp = /** @class */ (function () {
                        function Cmp() {
                            this.exp = false;
                            this.disableExp = false;
                        }
                        __decorate([
                            core_1.ViewChild('elm'),
                            __metadata("design:type", Object)
                        ], Cmp.prototype, "element", void 0);
                        Cmp = __decorate([
                            core_1.Component({
                                selector: 'if-cmp',
                                template: "\n              <div [@.disabled]=\"disableExp\">\n                <div [@myAnimation]=\"exp\" #elm></div>\n              </div>\n            ",
                                animations: [
                                    animations_1.trigger('myAnimation', [
                                        animations_1.state('1', animations_1.style({ height: '100px' })), animations_1.state('2', animations_1.style({ height: '200px' })),
                                        animations_1.state('3', animations_1.style({ height: '300px' })), animations_1.transition('* => *', animations_1.animate(500))
                                    ]),
                                ]
                            })
                        ], Cmp);
                        return Cmp;
                    }());
                    testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                    var fixture = testing_2.TestBed.createComponent(Cmp);
                    var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                    function assertHeight(element, height) {
                        expect(element.style['height']).toEqual(height);
                    }
                    var cmp = fixture.componentInstance;
                    var element = cmp.element.nativeElement;
                    fixture.detectChanges();
                    cmp.disableExp = true;
                    cmp.exp = '1';
                    fixture.detectChanges();
                    assertHeight(element, '100px');
                    cmp.exp = '2';
                    fixture.detectChanges();
                    assertHeight(element, '200px');
                    cmp.exp = '3';
                    fixture.detectChanges();
                    assertHeight(element, '300px');
                });
                it('should disable animations for the element that they are disabled on', function () {
                    var Cmp = /** @class */ (function () {
                        function Cmp() {
                            this.exp = false;
                            this.disableExp = false;
                        }
                        Cmp = __decorate([
                            core_1.Component({
                                selector: 'if-cmp',
                                template: "\n              <div [@.disabled]=\"disableExp\" [@myAnimation]=\"exp\"></div>\n            ",
                                animations: [
                                    animations_1.trigger('myAnimation', [
                                        animations_1.transition('* => 1, * => 2', [
                                            animations_1.animate(1234, animations_1.style({ width: '100px' })),
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
                    fixture.detectChanges();
                    resetLog();
                    cmp.disableExp = true;
                    cmp.exp = '1';
                    fixture.detectChanges();
                    var players = getLog();
                    expect(players.length).toEqual(0);
                    resetLog();
                    cmp.disableExp = false;
                    cmp.exp = '2';
                    fixture.detectChanges();
                    players = getLog();
                    expect(players.length).toEqual(1);
                    expect(players[0].totalTime).toEqual(1234);
                });
                it('should respect inner disabled nodes once a parent becomes enabled', function () {
                    var Cmp = /** @class */ (function () {
                        function Cmp() {
                            this.disableParentExp = false;
                            this.disableChildExp = false;
                            this.exp = '';
                        }
                        Cmp = __decorate([
                            core_1.Component({
                                selector: 'if-cmp',
                                template: "\n              <div [@.disabled]=\"disableParentExp\">\n                <div [@.disabled]=\"disableChildExp\">\n                  <div [@myAnimation]=\"exp\"></div>\n                </div>\n              </div>\n            ",
                                animations: [animations_1.trigger('myAnimation', [animations_1.transition('* => 1, * => 2, * => 3', [animations_1.animate(1234, animations_1.style({ width: '100px' }))])])]
                            })
                        ], Cmp);
                        return Cmp;
                    }());
                    testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                    var fixture = testing_2.TestBed.createComponent(Cmp);
                    var cmp = fixture.componentInstance;
                    fixture.detectChanges();
                    resetLog();
                    cmp.disableParentExp = true;
                    cmp.disableChildExp = true;
                    cmp.exp = '1';
                    fixture.detectChanges();
                    var players = getLog();
                    expect(players.length).toEqual(0);
                    cmp.disableParentExp = false;
                    cmp.exp = '2';
                    fixture.detectChanges();
                    players = getLog();
                    expect(players.length).toEqual(0);
                    cmp.disableChildExp = false;
                    cmp.exp = '3';
                    fixture.detectChanges();
                    players = getLog();
                    expect(players.length).toEqual(1);
                });
                it('should properly handle dom operations when disabled', function () {
                    var Cmp = /** @class */ (function () {
                        function Cmp() {
                            this.disableExp = false;
                            this.exp = false;
                        }
                        __decorate([
                            core_1.ViewChild('parent'),
                            __metadata("design:type", Object)
                        ], Cmp.prototype, "parentElm", void 0);
                        Cmp = __decorate([
                            core_1.Component({
                                selector: 'if-cmp',
                                template: "\n              <div [@.disabled]=\"disableExp\" #parent>\n                <div *ngIf=\"exp\" @myAnimation></div>\n              </div>\n            ",
                                animations: [
                                    animations_1.trigger('myAnimation', [
                                        animations_1.transition(':enter', [
                                            animations_1.style({ opacity: 0 }),
                                            animations_1.animate(1234, animations_1.style({ opacity: 1 })),
                                        ]),
                                        animations_1.transition(':leave', [
                                            animations_1.animate(1234, animations_1.style({ opacity: 0 })),
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
                    var parent = cmp.parentElm.nativeElement;
                    cmp.exp = true;
                    fixture.detectChanges();
                    expect(getLog().length).toEqual(0);
                    expect(parent.childElementCount).toEqual(1);
                    cmp.exp = false;
                    fixture.detectChanges();
                    expect(getLog().length).toEqual(0);
                    expect(parent.childElementCount).toEqual(0);
                });
                it('should properly resolve animation event listeners when disabled', testing_2.fakeAsync(function () {
                    var Cmp = /** @class */ (function () {
                        function Cmp() {
                            this.disableExp = false;
                            this.exp = '';
                        }
                        Cmp = __decorate([
                            core_1.Component({
                                selector: 'if-cmp',
                                template: "\n              <div [@.disabled]=\"disableExp\">\n                <div [@myAnimation]=\"exp\" (@myAnimation.start)=\"startEvent=$event\" (@myAnimation.done)=\"doneEvent=$event\"></div>\n              </div>\n            ",
                                animations: [
                                    animations_1.trigger('myAnimation', [
                                        animations_1.transition('* => 1, * => 2', [animations_1.style({ opacity: 0 }), animations_1.animate(9876, animations_1.style({ opacity: 1 }))]),
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
                    expect(cmp.startEvent).toBeFalsy();
                    expect(cmp.doneEvent).toBeFalsy();
                    cmp.exp = '1';
                    fixture.detectChanges();
                    testing_2.flushMicrotasks();
                    expect(cmp.startEvent.totalTime).toEqual(9876);
                    expect(cmp.startEvent.disabled).toBeTruthy();
                    expect(cmp.doneEvent.totalTime).toEqual(9876);
                    expect(cmp.doneEvent.disabled).toBeTruthy();
                    cmp.exp = '2';
                    cmp.disableExp = false;
                    fixture.detectChanges();
                    testing_2.flushMicrotasks();
                    expect(cmp.startEvent.totalTime).toEqual(9876);
                    expect(cmp.startEvent.disabled).toBeFalsy();
                    // the done event isn't fired because it's an actual animation
                }));
                it('should work when there are no animations on the component handling the disable/enable flag', function () {
                    var ParentCmp = /** @class */ (function () {
                        function ParentCmp() {
                            this.child = null;
                            this.disableExp = false;
                        }
                        __decorate([
                            core_1.ViewChild('child'),
                            __metadata("design:type", Object)
                        ], ParentCmp.prototype, "child", void 0);
                        ParentCmp = __decorate([
                            core_1.Component({
                                selector: 'parent-cmp',
                                template: "\n              <div [@.disabled]=\"disableExp\">\n                <child-cmp #child></child-cmp>\n              </div>\n                "
                            })
                        ], ParentCmp);
                        return ParentCmp;
                    }());
                    var ChildCmp = /** @class */ (function () {
                        function ChildCmp() {
                            this.exp = '';
                        }
                        ChildCmp = __decorate([
                            core_1.Component({
                                selector: 'child-cmp',
                                template: "\n                <div [@myAnimation]=\"exp\"></div>\n                ",
                                animations: [animations_1.trigger('myAnimation', [animations_1.transition('* => go, * => goAgain', [animations_1.style({ opacity: 0 }), animations_1.animate('1s', animations_1.style({ opacity: 1 }))])])]
                            })
                        ], ChildCmp);
                        return ChildCmp;
                    }());
                    testing_2.TestBed.configureTestingModule({ declarations: [ParentCmp, ChildCmp] });
                    var fixture = testing_2.TestBed.createComponent(ParentCmp);
                    var cmp = fixture.componentInstance;
                    cmp.disableExp = true;
                    fixture.detectChanges();
                    resetLog();
                    var child = cmp.child;
                    child.exp = 'go';
                    fixture.detectChanges();
                    expect(getLog().length).toEqual(0);
                    resetLog();
                    cmp.disableExp = false;
                    child.exp = 'goAgain';
                    fixture.detectChanges();
                    expect(getLog().length).toEqual(1);
                });
                it('should treat the property as true when the expression is missing', function () {
                    var Cmp = /** @class */ (function () {
                        function Cmp() {
                            this.exp = '';
                        }
                        Cmp = __decorate([
                            core_1.Component({
                                selector: 'parent-cmp',
                                animations: [
                                    animations_1.trigger('myAnimation', [
                                        animations_1.transition('* => go', [
                                            animations_1.style({ opacity: 0 }),
                                            animations_1.animate(500, animations_1.style({ opacity: 1 })),
                                        ]),
                                    ]),
                                ],
                                template: "\n              <div @.disabled>\n                <div [@myAnimation]=\"exp\"></div>\n              </div>\n                "
                            })
                        ], Cmp);
                        return Cmp;
                    }());
                    testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                    var fixture = testing_2.TestBed.createComponent(Cmp);
                    var cmp = fixture.componentInstance;
                    fixture.detectChanges();
                    resetLog();
                    cmp.exp = 'go';
                    fixture.detectChanges();
                    expect(getLog().length).toEqual(0);
                });
                it('should respect parent/sub animations when the respective area in the DOM is disabled', testing_2.fakeAsync(function () {
                    var Cmp = /** @class */ (function () {
                        function Cmp() {
                            this.disableExp = false;
                            this.exp = '';
                            this.items = [];
                            this.doneLog = [];
                        }
                        Cmp.prototype.onDone = function (event) { this.doneLog.push(event); };
                        __decorate([
                            core_1.ViewChild('container'),
                            __metadata("design:type", Object)
                        ], Cmp.prototype, "container", void 0);
                        Cmp = __decorate([
                            core_1.Component({
                                selector: 'parent-cmp',
                                animations: [
                                    animations_1.trigger('parent', [
                                        animations_1.transition('* => empty', [
                                            animations_1.style({ opacity: 0 }),
                                            animations_1.query('@child', [
                                                animations_1.animateChild(),
                                            ]),
                                            animations_1.animate('1s', animations_1.style({ opacity: 1 })),
                                        ]),
                                    ]),
                                    animations_1.trigger('child', [
                                        animations_1.transition(':leave', [
                                            animations_1.animate('1s', animations_1.style({ opacity: 0 })),
                                        ]),
                                    ]),
                                ],
                                template: "\n              <div [@.disabled]=\"disableExp\" #container>\n                <div [@parent]=\"exp\" (@parent.done)=\"onDone($event)\">\n                  <div class=\"item\" *ngFor=\"let item of items\" @child (@child.done)=\"onDone($event)\"></div>\n                </div>\n              </div>\n                "
                            })
                        ], Cmp);
                        return Cmp;
                    }());
                    testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                    var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
                    var fixture = testing_2.TestBed.createComponent(Cmp);
                    var cmp = fixture.componentInstance;
                    cmp.disableExp = true;
                    cmp.items = [0, 1, 2, 3, 4];
                    fixture.detectChanges();
                    testing_2.flushMicrotasks();
                    cmp.exp = 'empty';
                    cmp.items = [];
                    cmp.doneLog = [];
                    fixture.detectChanges();
                    testing_2.flushMicrotasks();
                    var elms = cmp.container.nativeElement.querySelectorAll('.item');
                    expect(elms.length).toEqual(0);
                    expect(cmp.doneLog.length).toEqual(6);
                }));
            });
        });
        describe('animation normalization', function () {
            it('should convert hyphenated properties to camelcase by default', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                        this.exp = false;
                    }
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'cmp',
                            template: "\n               <div [@myAnimation]=\"exp\"></div>\n             ",
                            animations: [
                                animations_1.trigger('myAnimation', [
                                    animations_1.transition('* => go', [
                                        animations_1.style({ 'background-color': 'red', height: '100px', fontSize: '100px' }),
                                        animations_1.animate('1s', animations_1.style({ 'background-color': 'blue', height: '200px', fontSize: '200px' })),
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
                cmp.exp = 'go';
                fixture.detectChanges();
                var players = getLog();
                expect(players.length).toEqual(1);
                expect(players[0].keyframes).toEqual([
                    { backgroundColor: 'red', height: '100px', fontSize: '100px', offset: 0 },
                    { backgroundColor: 'blue', height: '200px', fontSize: '200px', offset: 1 },
                ]);
            });
            it('should convert hyphenated properties to camelcase by default that are auto/pre style properties', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                        this.exp = false;
                    }
                    Cmp = __decorate([
                        core_1.Component({
                            selector: 'cmp',
                            template: "\n               <div [@myAnimation]=\"exp\"></div>\n             ",
                            animations: [
                                animations_1.trigger('myAnimation', [
                                    animations_1.transition('* => go', [
                                        animations_1.style({ 'background-color': animations_1.AUTO_STYLE, 'font-size': '100px' }),
                                        animations_1.animate('1s', animations_1.style({ 'background-color': 'blue', 'font-size': animations_1.ɵPRE_STYLE })),
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
                cmp.exp = 'go';
                fixture.detectChanges();
                var players = getLog();
                expect(players.length).toEqual(1);
                expect(players[0].keyframes).toEqual([
                    { backgroundColor: animations_1.AUTO_STYLE, fontSize: '100px', offset: 0 },
                    { backgroundColor: 'blue', fontSize: animations_1.ɵPRE_STYLE, offset: 1 },
                ]);
            });
        });
        it('should throw neither state() or transition() are used inside of trigger()', function () {
            var Cmp = /** @class */ (function () {
                function Cmp() {
                    this.exp = false;
                }
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'if-cmp',
                        template: "\n          <div [@myAnimation]=\"exp\"></div>\n        ",
                        animations: [animations_1.trigger('myAnimation', [animations_1.animate(1000, animations_1.style({ width: '100px' }))])]
                    })
                ], Cmp);
                return Cmp;
            }());
            testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
            expect(function () { testing_2.TestBed.createComponent(Cmp); })
                .toThrowError(/only state\(\) and transition\(\) definitions can sit inside of a trigger\(\)/);
        });
        it('should combine multiple errors together into one exception when an animation fails to be built', function () {
            var Cmp = /** @class */ (function () {
                function Cmp() {
                    this.fooExp = false;
                    this.barExp = false;
                }
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'if-cmp',
                        template: "\n          <div [@foo]=\"fooExp\" [@bar]=\"barExp\"></div>\n        ",
                        animations: [
                            animations_1.trigger('foo', [
                                animations_1.transition(':enter', []),
                                animations_1.transition('* => *', [
                                    animations_1.query('foo', animations_1.animate(1000, animations_1.style({ background: 'red' }))),
                                ]),
                            ]),
                            animations_1.trigger('bar', [
                                animations_1.transition(':enter', []),
                                animations_1.transition('* => *', [
                                    animations_1.query('bar', animations_1.animate(1000, animations_1.style({ background: 'blue' }))),
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
            cmp.fooExp = 'go';
            cmp.barExp = 'go';
            var errorMsg = '';
            try {
                fixture.detectChanges();
            }
            catch (e) {
                errorMsg = e.message;
            }
            expect(errorMsg).toMatch(/@foo has failed due to:/);
            expect(errorMsg).toMatch(/`query\("foo"\)` returned zero elements/);
            expect(errorMsg).toMatch(/@bar has failed due to:/);
            expect(errorMsg).toMatch(/`query\("bar"\)` returned zero elements/);
        });
        it('should not throw an error if styles overlap in separate transitions', function () {
            var Cmp = /** @class */ (function () {
                function Cmp() {
                    this.exp = false;
                }
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'if-cmp',
                        template: "\n          <div [@myAnimation]=\"exp\"></div>\n        ",
                        animations: [
                            animations_1.trigger('myAnimation', [
                                animations_1.transition('void => *', [
                                    animations_1.style({ opacity: 0 }),
                                    animations_1.animate('0.5s 1s', animations_1.style({ opacity: 1 })),
                                ]),
                                animations_1.transition('* => void', [animations_1.animate(1000, animations_1.style({ height: 0 })), animations_1.animate(1000, animations_1.style({ opacity: 0 }))]),
                            ]),
                        ]
                    })
                ], Cmp);
                return Cmp;
            }());
            testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
            expect(function () { testing_2.TestBed.createComponent(Cmp); }).not.toThrowError();
        });
        it('should continue to clean up DOM-related animation artificats even if a compiler-level error is thrown midway', function () {
            var Cmp = /** @class */ (function () {
                function Cmp() {
                    this.exp = false;
                }
                __decorate([
                    core_1.ViewChild('contents'),
                    __metadata("design:type", Object)
                ], Cmp.prototype, "contents", void 0);
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'if-cmp',
                        animations: [
                            animations_1.trigger('foo', [
                                animations_1.transition('* => something', []),
                            ]),
                        ],
                        template: "\n          value = {{ foo[bar] }}\n          <div #contents>\n            <div *ngIf=\"exp\">1</div>\n            <div *ngIf=\"exp\" @foo>2</div>\n            <div *ngIf=\"exp\" [@foo]=\"'123'\">3</div>\n          </div>\n        ",
                    })
                ], Cmp);
                return Cmp;
            }());
            testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
            var engine = testing_2.TestBed.get(browser_1.ɵAnimationEngine);
            var fixture = testing_2.TestBed.createComponent(Cmp);
            var runCD = function () { return fixture.detectChanges(); };
            var cmp = fixture.componentInstance;
            cmp.exp = true;
            expect(runCD).toThrow();
            var contents = cmp.contents.nativeElement;
            expect(contents.innerText.replace(/\s+/gm, '')).toEqual('123');
            cmp.exp = false;
            expect(runCD).toThrow();
            expect(contents.innerText.trim()).toEqual('');
        });
        describe('errors for not using the animation module', function () {
            beforeEach(function () {
                testing_2.TestBed.configureTestingModule({
                    providers: [{ provide: core_1.RendererFactory2, useExisting: platform_browser_1.ɵDomRendererFactory2 }],
                });
            });
            it('should throw when using an @prop binding without the animation module', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                    }
                    Cmp = __decorate([
                        core_1.Component({ template: "<div [@myAnimation]=\"true\"></div>" })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                var comp = testing_2.TestBed.createComponent(Cmp);
                expect(function () { return comp.detectChanges(); })
                    .toThrowError('Found the synthetic property @myAnimation. Please include either "BrowserAnimationsModule" or "NoopAnimationsModule" in your application.');
            });
            it('should throw when using an @prop listener without the animation module', function () {
                var Cmp = /** @class */ (function () {
                    function Cmp() {
                    }
                    Cmp = __decorate([
                        core_1.Component({ template: "<div (@myAnimation.start)=\"a = true\"></div>" })
                    ], Cmp);
                    return Cmp;
                }());
                testing_2.TestBed.configureTestingModule({ declarations: [Cmp] });
                expect(function () { return testing_2.TestBed.createComponent(Cmp); })
                    .toThrowError('Found the synthetic listener @myAnimation.start. Please include either "BrowserAnimationsModule" or "NoopAnimationsModule" in your application.');
            });
        });
    });
})();
function assertHasParent(element, yes) {
    var parent = dom_adapter_1.getDOM().parentElement(element);
    if (yes) {
        expect(parent).toBeTruthy();
    }
    else {
        expect(parent).toBeFalsy();
    }
}
function buildParams(params) {
    return { params: params };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uX2ludGVncmF0aW9uX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3Rlc3QvYW5pbWF0aW9uL2FuaW1hdGlvbl9pbnRlZ3JhdGlvbl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsa0RBQW1PO0FBQ25PLHVEQUEySDtBQUMzSCwrREFBNkY7QUFDN0Ysc0NBQTJIO0FBQzNILDhEQUErRDtBQUMvRCxtRUFBMEg7QUFDMUgsNkVBQXFFO0FBRXJFLHlDQUFrRTtBQUVsRSxJQUFNLG9CQUFvQixHQUFHLElBQUksQ0FBQztBQUNsQyxJQUFNLG9CQUFvQixHQUFHLEdBQUcsQ0FBQztBQUVqQyxDQUFDO0lBQ0MsaUVBQWlFO0lBQ2pFLElBQUksTUFBTTtRQUFFLE9BQU87SUFFbkIsUUFBUSxDQUFDLGlCQUFpQixFQUFFO1FBQzFCO1lBQ0UsT0FBTyw2QkFBbUIsQ0FBQyxHQUE0QixDQUFDO1FBQzFELENBQUM7UUFFRCxzQkFBc0IsNkJBQW1CLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFckQsVUFBVSxDQUFDO1lBQ1QsUUFBUSxFQUFFLENBQUM7WUFDWCxpQkFBTyxDQUFDLHNCQUFzQixDQUFDO2dCQUM3QixTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSx5QkFBZSxFQUFFLFFBQVEsRUFBRSw2QkFBbUIsRUFBQyxDQUFDO2dCQUN0RSxPQUFPLEVBQUUsQ0FBQyxvQ0FBdUIsQ0FBQzthQUNuQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyxtQkFBbUIsRUFBRTtZQUM1QixFQUFFLENBQUMsbURBQW1ELEVBQUU7Z0JBQ3RELGlCQUFPLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztnQkFDN0IsaUJBQU8sQ0FBQyxzQkFBc0IsQ0FDMUIsRUFBQyxZQUFZ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