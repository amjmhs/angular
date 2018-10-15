"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var errors_1 = require("@angular/core/src/errors");
var index_1 = require("@angular/core/src/view/index");
var testing_1 = require("@angular/core/testing");
var dom_adapter_1 = require("@angular/platform-browser/src/dom/dom_adapter");
var helper_1 = require("./helper");
{
    describe("View Providers", function () {
        describe('create', function () {
            var instance;
            var SomeService = /** @class */ (function () {
                function SomeService(dep) {
                    this.dep = dep;
                    instance = this;
                }
                return SomeService;
            }());
            beforeEach(function () { instance = null; });
            it('should create providers eagerly', function () {
                helper_1.createAndGetRootNodes(helper_1.compViewDef([
                    index_1.elementDef(0, 0 /* None */, null, null, 1, 'span'),
                    index_1.directiveDef(1, 0 /* None */, null, 0, SomeService, [])
                ]));
                expect(instance instanceof SomeService).toBe(true);
            });
            it('should create providers lazily', function () {
                var lazy = undefined;
                var LazyService = /** @class */ (function () {
                    function LazyService() {
                        lazy = this;
                    }
                    return LazyService;
                }());
                helper_1.createAndGetRootNodes(helper_1.compViewDef([
                    index_1.elementDef(0, 0 /* None */, null, null, 2, 'span'),
                    index_1.providerDef(512 /* TypeClassProvider */ | 4096 /* LazyProvider */, null, LazyService, LazyService, []),
                    index_1.directiveDef(2, 0 /* None */, null, 0, SomeService, [core_1.Injector])
                ]));
                expect(lazy).toBeUndefined();
                instance.dep.get(LazyService);
                expect(lazy instanceof LazyService).toBe(true);
            });
            it('should create value providers', function () {
                helper_1.createAndGetRootNodes(helper_1.compViewDef([
                    index_1.elementDef(0, 0 /* None */, null, null, 2, 'span'),
                    index_1.providerDef(256 /* TypeValueProvider */, null, 'someToken', 'someValue', []),
                    index_1.directiveDef(2, 0 /* None */, null, 0, SomeService, ['someToken']),
                ]));
                expect(instance.dep).toBe('someValue');
            });
            it('should create factory providers', function () {
                function someFactory() { return 'someValue'; }
                helper_1.createAndGetRootNodes(helper_1.compViewDef([
                    index_1.elementDef(0, 0 /* None */, null, null, 2, 'span'),
                    index_1.providerDef(1024 /* TypeFactoryProvider */, null, 'someToken', someFactory, []),
                    index_1.directiveDef(2, 0 /* None */, null, 0, SomeService, ['someToken']),
                ]));
                expect(instance.dep).toBe('someValue');
            });
            it('should create useExisting providers', function () {
                helper_1.createAndGetRootNodes(helper_1.compViewDef([
                    index_1.elementDef(0, 0 /* None */, null, null, 3, 'span'),
                    index_1.providerDef(256 /* TypeValueProvider */, null, 'someExistingToken', 'someValue', []),
                    index_1.providerDef(2048 /* TypeUseExistingProvider */, null, 'someToken', null, ['someExistingToken']),
                    index_1.directiveDef(3, 0 /* None */, null, 0, SomeService, ['someToken']),
                ]));
                expect(instance.dep).toBe('someValue');
            });
            it('should add a DebugContext to errors in provider factories', function () {
                var SomeService = /** @class */ (function () {
                    function SomeService() {
                        throw new Error('Test');
                    }
                    return SomeService;
                }());
                var err;
                try {
                    helper_1.createRootView(helper_1.compViewDef([
                        index_1.elementDef(0, 0 /* None */, null, null, 1, 'div', null, null, null, null, function () { return helper_1.compViewDef([index_1.textDef(0, null, ['a'])]); }),
                        index_1.directiveDef(1, 32768 /* Component */, null, 0, SomeService, [])
                    ]), testing_1.TestBed.get(core_1.Injector), [], dom_adapter_1.getDOM().createElement('div'));
                }
                catch (e) {
                    err = e;
                }
                expect(err).toBeTruthy();
                expect(err.message).toBe('Test');
                var debugCtx = errors_1.getDebugContext(err);
                expect(debugCtx.view).toBeTruthy();
                expect(debugCtx.nodeIndex).toBe(1);
            });
            describe('deps', function () {
                var Dep = /** @class */ (function () {
                    function Dep() {
                    }
                    return Dep;
                }());
                it('should inject deps from the same element', function () {
                    helper_1.createAndGetRootNodes(helper_1.compViewDef([
                        index_1.elementDef(0, 0 /* None */, null, null, 2, 'span'),
                        index_1.directiveDef(1, 0 /* None */, null, 0, Dep, []),
                        index_1.directiveDef(2, 0 /* None */, null, 0, SomeService, [Dep])
                    ]));
                    expect(instance.dep instanceof Dep).toBeTruthy();
                });
                it('should inject deps from a parent element', function () {
                    helper_1.createAndGetRootNodes(helper_1.compViewDef([
                        index_1.elementDef(0, 0 /* None */, null, null, 3, 'span'),
                        index_1.directiveDef(1, 0 /* None */, null, 0, Dep, []),
                        index_1.elementDef(2, 0 /* None */, null, null, 1, 'span'),
                        index_1.directiveDef(3, 0 /* None */, null, 0, SomeService, [Dep])
                    ]));
                    expect(instance.dep instanceof Dep).toBeTruthy();
                });
                it('should not inject deps from sibling root elements', function () {
                    var rootElNodes = [
                        index_1.elementDef(0, 0 /* None */, null, null, 1, 'span'),
                        index_1.directiveDef(1, 0 /* None */, null, 0, Dep, []),
                        index_1.elementDef(2, 0 /* None */, null, null, 1, 'span'),
                        index_1.directiveDef(3, 0 /* None */, null, 0, SomeService, [Dep]),
                    ];
                    expect(function () { return helper_1.createAndGetRootNodes(helper_1.compViewDef(rootElNodes)); })
                        .toThrowError('StaticInjectorError(DynamicTestModule)[SomeService -> Dep]: \n' +
                        '  StaticInjectorError(Platform: core)[SomeService -> Dep]: \n' +
                        '    NullInjectorError: No provider for Dep!');
                    var nonRootElNodes = [
                        index_1.elementDef(0, 0 /* None */, null, null, 4, 'span'),
                        index_1.elementDef(1, 0 /* None */, null, null, 1, 'span'),
                        index_1.directiveDef(2, 0 /* None */, null, 0, Dep, []),
                        index_1.elementDef(3, 0 /* None */, null, null, 1, 'span'),
                        index_1.directiveDef(4, 0 /* None */, null, 0, SomeService, [Dep]),
                    ];
                    expect(function () { return helper_1.createAndGetRootNodes(helper_1.compViewDef(nonRootElNodes)); })
                        .toThrowError('StaticInjectorError(DynamicTestModule)[SomeService -> Dep]: \n' +
                        '  StaticInjectorError(Platform: core)[SomeService -> Dep]: \n' +
                        '    NullInjectorError: No provider for Dep!');
                });
                it('should inject from a parent element in a parent view', function () {
                    helper_1.createAndGetRootNodes(helper_1.compViewDef([
                        index_1.elementDef(0, 0 /* None */, null, null, 1, 'div', null, null, null, null, function () { return helper_1.compViewDef([
                            index_1.elementDef(0, 0 /* None */, null, null, 1, 'span'),
                            index_1.directiveDef(1, 0 /* None */, null, 0, SomeService, [Dep])
                        ]); }),
                        index_1.directiveDef(1, 32768 /* Component */, null, 0, Dep, []),
                    ]));
                    expect(instance.dep instanceof Dep).toBeTruthy();
                });
                it('should throw for missing dependencies', function () {
                    expect(function () { return helper_1.createAndGetRootNodes(helper_1.compViewDef([
                        index_1.elementDef(0, 0 /* None */, null, null, 1, 'span'),
                        index_1.directiveDef(1, 0 /* None */, null, 0, SomeService, ['nonExistingDep'])
                    ])); })
                        .toThrowError('StaticInjectorError(DynamicTestModule)[nonExistingDep]: \n' +
                        '  StaticInjectorError(Platform: core)[nonExistingDep]: \n' +
                        '    NullInjectorError: No provider for nonExistingDep!');
                });
                it('should use null for optional missing dependencies', function () {
                    helper_1.createAndGetRootNodes(helper_1.compViewDef([
                        index_1.elementDef(0, 0 /* None */, null, null, 1, 'span'),
                        index_1.directiveDef(1, 0 /* None */, null, 0, SomeService, [[2 /* Optional */, 'nonExistingDep']])
                    ]));
                    expect(instance.dep).toBe(null);
                });
                it('should skip the current element when using SkipSelf', function () {
                    helper_1.createAndGetRootNodes(helper_1.compViewDef([
                        index_1.elementDef(0, 0 /* None */, null, null, 4, 'span'),
                        index_1.providerDef(256 /* TypeValueProvider */, null, 'someToken', 'someParentValue', []),
                        index_1.elementDef(2, 0 /* None */, null, null, 2, 'span'),
                        index_1.providerDef(256 /* TypeValueProvider */, null, 'someToken', 'someValue', []),
                        index_1.directiveDef(4, 0 /* None */, null, 0, SomeService, [[1 /* SkipSelf */, 'someToken']])
                    ]));
                    expect(instance.dep).toBe('someParentValue');
                });
                it('should ask the root injector', testing_1.withModule({ providers: [{ provide: 'rootDep', useValue: 'rootValue' }] }, function () {
                    helper_1.createAndGetRootNodes(helper_1.compViewDef([
                        index_1.elementDef(0, 0 /* None */, null, null, 1, 'span'),
                        index_1.directiveDef(1, 0 /* None */, null, 0, SomeService, ['rootDep'])
                    ]));
                    expect(instance.dep).toBe('rootValue');
                }));
                describe('builtin tokens', function () {
                    it('should inject ViewContainerRef', function () {
                        helper_1.createAndGetRootNodes(helper_1.compViewDef([
                            index_1.anchorDef(16777216 /* EmbeddedViews */, null, null, 1),
                            index_1.directiveDef(1, 0 /* None */, null, 0, SomeService, [core_1.ViewContainerRef]),
                        ]));
                        expect(instance.dep.createEmbeddedView).toBeTruthy();
                    });
                    it('should inject TemplateRef', function () {
                        helper_1.createAndGetRootNodes(helper_1.compViewDef([
                            index_1.anchorDef(0 /* None */, null, null, 1, null, helper_1.compViewDefFactory([index_1.anchorDef(0 /* None */, null, null, 0)])),
                            index_1.directiveDef(1, 0 /* None */, null, 0, SomeService, [core_1.TemplateRef]),
                        ]));
                        expect(instance.dep.createEmbeddedView).toBeTruthy();
                    });
                    it('should inject ElementRef', function () {
                        var view = helper_1.createAndGetRootNodes(helper_1.compViewDef([
                            index_1.elementDef(0, 0 /* None */, null, null, 1, 'span'),
                            index_1.directiveDef(1, 0 /* None */, null, 0, SomeService, [core_1.ElementRef]),
                        ])).view;
                        expect(instance.dep.nativeElement).toBe(index_1.asElementData(view, 0).renderElement);
                    });
                    it('should inject Injector', function () {
                        var view = helper_1.createAndGetRootNodes(helper_1.compViewDef([
                            index_1.elementDef(0, 0 /* None */, null, null, 1, 'span'),
                            index_1.directiveDef(1, 0 /* None */, null, 0, SomeService, [core_1.Injector]),
                        ])).view;
                        expect(instance.dep.get(SomeService)).toBe(instance);
                    });
                    it('should inject ChangeDetectorRef for non component providers', function () {
                        var view = helper_1.createAndGetRootNodes(helper_1.compViewDef([
                            index_1.elementDef(0, 0 /* None */, null, null, 1, 'span'),
                            index_1.directiveDef(1, 0 /* None */, null, 0, SomeService, [core_1.ChangeDetectorRef])
                        ])).view;
                        expect(instance.dep._view).toBe(view);
                    });
                    it('should inject ChangeDetectorRef for component providers', function () {
                        var _a = helper_1.createAndGetRootNodes(helper_1.compViewDef([
                            index_1.elementDef(0, 0 /* None */, null, null, 1, 'div', null, null, null, null, function () { return helper_1.compViewDef([
                                index_1.elementDef(0, 0 /* None */, null, null, 0, 'span'),
                            ]); }),
                            index_1.directiveDef(1, 32768 /* Component */, null, 0, SomeService, [core_1.ChangeDetectorRef]),
                        ])), view = _a.view, rootNodes = _a.rootNodes;
                        var compView = index_1.asElementData(view, 0).componentView;
                        expect(instance.dep._view).toBe(compView);
                    });
                    it('should inject RendererV1', function () {
                        helper_1.createAndGetRootNodes(helper_1.compViewDef([
                            index_1.elementDef(0, 0 /* None */, null, null, 1, 'span', null, null, null, null, function () { return helper_1.compViewDef([index_1.anchorDef(0 /* None */, null, null, 0)]); }),
                            index_1.directiveDef(1, 32768 /* Component */, null, 0, SomeService, [core_1.Renderer])
                        ]));
                        expect(instance.dep.createElement).toBeTruthy();
                    });
                    it('should inject Renderer2', function () {
                        helper_1.createAndGetRootNodes(helper_1.compViewDef([
                            index_1.elementDef(0, 0 /* None */, null, null, 1, 'span', null, null, null, null, function () { return helper_1.compViewDef([index_1.anchorDef(0 /* None */, null, null, 0)]); }),
                            index_1.directiveDef(1, 32768 /* Component */, null, 0, SomeService, [core_1.Renderer2])
                        ]));
                        expect(instance.dep.createElement).toBeTruthy();
                    });
                });
            });
        });
        describe('data binding', function () {
            helper_1.ARG_TYPE_VALUES.forEach(function (inlineDynamic) {
                it("should update via strategy " + inlineDynamic, function () {
                    var instance = undefined;
                    var SomeService = /** @class */ (function () {
                        function SomeService() {
                            instance = this;
                        }
                        return SomeService;
                    }());
                    var _a = helper_1.createAndGetRootNodes(helper_1.compViewDef([
                        index_1.elementDef(0, 0 /* None */, null, null, 1, 'span'),
                        index_1.directiveDef(1, 0 /* None */, null, 0, SomeService, [], { a: [0, 'a'], b: [1, 'b'] })
                    ], function (check, view) {
                        helper_1.checkNodeInlineOrDynamic(check, view, 1, inlineDynamic, ['v1', 'v2']);
                    })), view = _a.view, rootNodes = _a.rootNodes;
                    index_1.Services.checkAndUpdateView(view);
                    expect(instance.a).toBe('v1');
                    expect(instance.b).toBe('v2');
                    var el = rootNodes[0];
                    expect(dom_adapter_1.getDOM().getAttribute(el, 'ng-reflect-a')).toBe('v1');
                });
            });
        });
        describe('outputs', function () {
            it('should listen to provider events', function () {
                var emitter = new core_1.EventEmitter();
                var unsubscribeSpy;
                var SomeService = /** @class */ (function () {
                    function SomeService() {
                        this.emitter = {
                            subscribe: function (callback) {
                                var subscription = emitter.subscribe(callback);
                                unsubscribeSpy = spyOn(subscription, 'unsubscribe').and.callThrough();
                                return subscription;
                            }
                        };
                    }
                    return SomeService;
                }());
                var handleEvent = jasmine.createSpy('handleEvent');
                var _a = helper_1.createAndGetRootNodes(helper_1.compViewDef([
                    index_1.elementDef(0, 0 /* None */, null, null, 1, 'span', null, null, null, handleEvent),
                    index_1.directiveDef(1, 0 /* None */, null, 0, SomeService, [], null, { emitter: 'someEventName' })
                ])), view = _a.view, rootNodes = _a.rootNodes;
                emitter.emit('someEventInstance');
                expect(handleEvent).toHaveBeenCalledWith(view, 'someEventName', 'someEventInstance');
                index_1.Services.destroyView(view);
                expect(unsubscribeSpy).toHaveBeenCalled();
            });
            it('should report debug info on event errors', function () {
                var handleErrorSpy = spyOn(testing_1.TestBed.get(core_1.ErrorHandler), 'handleError');
                var emitter = new core_1.EventEmitter();
                var SomeService = /** @class */ (function () {
                    function SomeService() {
                        this.emitter = emitter;
                    }
                    return SomeService;
                }());
                var _a = helper_1.createAndGetRootNodes(helper_1.compViewDef([
                    index_1.elementDef(0, 0 /* None */, null, null, 1, 'span', null, null, null, function () { throw new Error('Test'); }),
                    index_1.directiveDef(1, 0 /* None */, null, 0, SomeService, [], null, { emitter: 'someEventName' })
                ])), view = _a.view, rootNodes = _a.rootNodes;
                emitter.emit('someEventInstance');
                var err = handleErrorSpy.calls.mostRecent().args[0];
                expect(err).toBeTruthy();
                var debugCtx = errors_1.getDebugContext(err);
                expect(debugCtx.view).toBe(view);
                // events are emitted with the index of the element, not the index of the provider.
                expect(debugCtx.nodeIndex).toBe(0);
            });
        });
        describe('lifecycle hooks', function () {
            it('should call the lifecycle hooks in the right order', function () {
                var instanceCount = 0;
                var log = [];
                var SomeService = /** @class */ (function () {
                    function SomeService() {
                        this.id = instanceCount++;
                    }
                    SomeService.prototype.ngOnInit = function () { log.push(this.id + "_ngOnInit"); };
                    SomeService.prototype.ngDoCheck = function () { log.push(this.id + "_ngDoCheck"); };
                    SomeService.prototype.ngOnChanges = function () { log.push(this.id + "_ngOnChanges"); };
                    SomeService.prototype.ngAfterContentInit = function () { log.push(this.id + "_ngAfterContentInit"); };
                    SomeService.prototype.ngAfterContentChecked = function () { log.push(this.id + "_ngAfterContentChecked"); };
                    SomeService.prototype.ngAfterViewInit = function () { log.push(this.id + "_ngAfterViewInit"); };
                    SomeService.prototype.ngAfterViewChecked = function () { log.push(this.id + "_ngAfterViewChecked"); };
                    SomeService.prototype.ngOnDestroy = function () { log.push(this.id + "_ngOnDestroy"); };
                    return SomeService;
                }());
                var allFlags = 65536 /* OnInit */ | 262144 /* DoCheck */ | 524288 /* OnChanges */ |
                    1048576 /* AfterContentInit */ | 2097152 /* AfterContentChecked */ | 4194304 /* AfterViewInit */ |
                    8388608 /* AfterViewChecked */ | 131072 /* OnDestroy */;
                var _a = helper_1.createAndGetRootNodes(helper_1.compViewDef([
                    index_1.elementDef(0, 0 /* None */, null, null, 3, 'span'),
                    index_1.directiveDef(1, allFlags, null, 0, SomeService, [], { a: [0, 'a'] }),
                    index_1.elementDef(2, 0 /* None */, null, null, 1, 'span'),
                    index_1.directiveDef(3, allFlags, null, 0, SomeService, [], { a: [0, 'a'] })
                ], function (check, view) {
                    check(view, 1, 0 /* Inline */, 'someValue');
                    check(view, 3, 0 /* Inline */, 'someValue');
                })), view = _a.view, rootNodes = _a.rootNodes;
                index_1.Services.checkAndUpdateView(view);
                // Note: After... hooks are called bottom up.
                expect(log).toEqual([
                    '0_ngOnChanges',
                    '0_ngOnInit',
                    '0_ngDoCheck',
                    '1_ngOnChanges',
                    '1_ngOnInit',
                    '1_ngDoCheck',
                    '1_ngAfterContentInit',
                    '1_ngAfterContentChecked',
                    '0_ngAfterContentInit',
                    '0_ngAfterContentChecked',
                    '1_ngAfterViewInit',
                    '1_ngAfterViewChecked',
                    '0_ngAfterViewInit',
                    '0_ngAfterViewChecked',
                ]);
                log = [];
                index_1.Services.checkAndUpdateView(view);
                // Note: After... hooks are called bottom up.
                expect(log).toEqual([
                    '0_ngDoCheck', '1_ngDoCheck', '1_ngAfterContentChecked', '0_ngAfterContentChecked',
                    '1_ngAfterViewChecked', '0_ngAfterViewChecked'
                ]);
                log = [];
                index_1.Services.destroyView(view);
                // Note: ngOnDestroy ist called bottom up.
                expect(log).toEqual(['1_ngOnDestroy', '0_ngOnDestroy']);
            });
            it('should call ngOnChanges with the changed values and the non minified names', function () {
                var changesLog = [];
                var currValue = 'v1';
                var SomeService = /** @class */ (function () {
                    function SomeService() {
                    }
                    SomeService.prototype.ngOnChanges = function (changes) {
                        changesLog.push(changes['nonMinifiedA']);
                    };
                    return SomeService;
                }());
                var _a = helper_1.createAndGetRootNodes(helper_1.compViewDef([
                    index_1.elementDef(0, 0 /* None */, null, null, 1, 'span'),
                    index_1.directiveDef(1, 524288 /* OnChanges */, null, 0, SomeService, [], { a: [0, 'nonMinifiedA'] })
                ], function (check, view) { check(view, 1, 0 /* Inline */, currValue); })), view = _a.view, rootNodes = _a.rootNodes;
                index_1.Services.checkAndUpdateView(view);
                expect(changesLog).toEqual([new core_1.SimpleChange(undefined, 'v1', true)]);
                currValue = 'v2';
                changesLog = [];
                index_1.Services.checkAndUpdateView(view);
                expect(changesLog).toEqual([new core_1.SimpleChange('v1', 'v2', false)]);
            });
            it('should add a DebugContext to errors in provider afterXXX lifecycles', function () {
                var SomeService = /** @class */ (function () {
                    function SomeService() {
                    }
                    SomeService.prototype.ngAfterContentChecked = function () { throw new Error('Test'); };
                    return SomeService;
                }());
                var _a = helper_1.createAndGetRootNodes(helper_1.compViewDef([
                    index_1.elementDef(0, 0 /* None */, null, null, 1, 'span'),
                    index_1.directiveDef(1, 2097152 /* AfterContentChecked */, null, 0, SomeService, [], { a: [0, 'a'] }),
                ])), view = _a.view, rootNodes = _a.rootNodes;
                var err;
                try {
                    index_1.Services.checkAndUpdateView(view);
                }
                catch (e) {
                    err = e;
                }
                expect(err).toBeTruthy();
                expect(err.message).toBe('Test');
                var debugCtx = errors_1.getDebugContext(err);
                expect(debugCtx.view).toBe(view);
                expect(debugCtx.nodeIndex).toBe(1);
            });
            it('should add a DebugContext to errors inServices.destroyView', function () {
                var SomeService = /** @class */ (function () {
                    function SomeService() {
                    }
                    SomeService.prototype.ngOnDestroy = function () { throw new Error('Test'); };
                    return SomeService;
                }());
                var _a = helper_1.createAndGetRootNodes(helper_1.compViewDef([
                    index_1.elementDef(0, 0 /* None */, null, null, 1, 'span'),
                    index_1.directiveDef(1, 131072 /* OnDestroy */, null, 0, SomeService, [], { a: [0, 'a'] }),
                ])), view = _a.view, rootNodes = _a.rootNodes;
                var err;
                try {
                    index_1.Services.destroyView(view);
                }
                catch (e) {
                    err = e;
                }
                expect(err).toBeTruthy();
                expect(err.message).toBe('Test');
                var debugCtx = errors_1.getDebugContext(err);
                expect(debugCtx.view).toBe(view);
                expect(debugCtx.nodeIndex).toBe(1);
            });
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvdmlkZXJfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdC92aWV3L3Byb3ZpZGVyX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxzQ0FBb1I7QUFDcFIsbURBQXlEO0FBQ3pELHNEQUFtSztBQUNuSyxpREFBMEQ7QUFDMUQsNkVBQXFFO0FBRXJFLG1DQUEySTtBQUUzSTtJQUNFLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtRQUV6QixRQUFRLENBQUMsUUFBUSxFQUFFO1lBQ2pCLElBQUksUUFBcUIsQ0FBQztZQUUxQjtnQkFDRSxxQkFBbUIsR0FBUTtvQkFBUixRQUFHLEdBQUgsR0FBRyxDQUFLO29CQUFJLFFBQVEsR0FBRyxJQUFJLENBQUM7Z0JBQUMsQ0FBQztnQkFDbkQsa0JBQUM7WUFBRCxDQUFDLEFBRkQsSUFFQztZQUVELFVBQVUsQ0FBQyxjQUFRLFFBQVEsR0FBRyxJQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUV6QyxFQUFFLENBQUMsaUNBQWlDLEVBQUU7Z0JBQ3BDLDhCQUFxQixDQUFDLG9CQUFXLENBQUM7b0JBQ2hDLGtCQUFVLENBQUMsQ0FBQyxnQkFBa0IsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDO29CQUNwRCxvQkFBWSxDQUFDLENBQUMsZ0JBQWtCLElBQUksRUFBRSxDQUFDLEVBQUUsV0FBVyxFQUFFLEVBQUUsQ0FBQztpQkFDMUQsQ0FBQyxDQUFDLENBQUM7Z0JBRUosTUFBTSxDQUFDLFFBQVEsWUFBWSxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDckQsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsZ0NBQWdDLEVBQUU7Z0JBQ25DLElBQUksSUFBSSxHQUFnQixTQUFXLENBQUM7Z0JBQ3BDO29CQUNFO3dCQUFnQixJQUFJLEdB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