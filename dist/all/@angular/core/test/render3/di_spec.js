"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
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
var core_1 = require("@angular/core");
var definition_1 = require("../../src/render3/definition");
var di_1 = require("../../src/render3/di");
var index_1 = require("../../src/render3/index");
var instructions_1 = require("../../src/render3/instructions");
var render_util_1 = require("./render_util");
describe('di', function () {
    describe('no dependencies', function () {
        it('should create directive with no deps', function () {
            var Directive = /** @class */ (function () {
                function Directive() {
                    this.value = 'Created';
                }
                Directive.ngDirectiveDef = index_1.defineDirective({
                    type: Directive,
                    selectors: [['', 'dir', '']],
                    factory: function () { return new Directive; },
                    exportAs: 'dir'
                });
                return Directive;
            }());
            /** <div dir #dir="dir"> {{ dir.value }}  </div> */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'div', ['dir', ''], ['dir', 'dir']);
                    {
                        instructions_1.text(2);
                    }
                    instructions_1.elementEnd();
                }
                var tmp;
                if (rf & 2 /* Update */) {
                    tmp = instructions_1.load(1);
                    instructions_1.textBinding(2, instructions_1.bind(tmp.value));
                }
            }
            expect(render_util_1.renderToHtml(Template, {}, [Directive])).toEqual('<div dir="">Created</div>');
        });
    });
    describe('directive injection', function () {
        var log = [];
        var DirB = /** @class */ (function () {
            function DirB() {
                this.value = 'DirB';
                log.push(this.value);
            }
            DirB.ngDirectiveDef = index_1.defineDirective({
                selectors: [['', 'dirB', '']],
                type: DirB,
                factory: function () { return new DirB(); },
                features: [index_1.PublicFeature]
            });
            return DirB;
        }());
        beforeEach(function () { return log = []; });
        it('should create directive with intra view dependencies', function () {
            var DirA = /** @class */ (function () {
                function DirA() {
                    this.value = 'DirA';
                }
                DirA.ngDirectiveDef = index_1.defineDirective({
                    type: DirA,
                    selectors: [['', 'dirA', '']],
                    factory: function () { return new DirA(); },
                    features: [index_1.PublicFeature]
                });
                return DirA;
            }());
            var DirC = /** @class */ (function () {
                function DirC(a, b) {
                    this.value = a.value + b.value;
                }
                DirC.ngDirectiveDef = index_1.defineDirective({
                    type: DirC,
                    selectors: [['', 'dirC', '']],
                    factory: function () { return new DirC(index_1.directiveInject(DirA), index_1.directiveInject(DirB)); },
                    exportAs: 'dirC'
                });
                return DirC;
            }());
            /**
             * <div dirA>
             *  <span dirB dirC #dir="dirC"> {{ dir.value }} </span>
             * </div>
             */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'div', ['dirA', '']);
                    {
                        instructions_1.elementStart(1, 'span', ['dirB', '', 'dirC', ''], ['dir', 'dirC']);
                        {
                            instructions_1.text(3);
                        }
                        instructions_1.elementEnd();
                    }
                    instructions_1.elementEnd();
                }
                var tmp;
                if (rf & 2 /* Update */) {
                    tmp = instructions_1.load(2);
                    instructions_1.textBinding(3, instructions_1.bind(tmp.value));
                }
            }
            var defs = [DirA, DirB, DirC];
            expect(render_util_1.renderToHtml(Template, {}, defs))
                .toEqual('<div dira=""><span dirb="" dirc="">DirADirB</span></div>');
        });
        it('should instantiate injected directives first', function () {
            var DirA = /** @class */ (function () {
                function DirA(dir) {
                    log.push("DirA (dep: " + dir.value + ")");
                }
                DirA.ngDirectiveDef = index_1.defineDirective({
                    selectors: [['', 'dirA', '']],
                    type: DirA,
                    factory: function () { return new DirA(index_1.directiveInject(DirB)); },
                });
                return DirA;
            }());
            /** <div dirA dirB></div> */
            var App = render_util_1.createComponent('app', function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'div', ['dirA', '', 'dirB', '']);
                    instructions_1.elementEnd();
                }
            }, [DirA, DirB]);
            var fixture = new render_util_1.ComponentFixture(App);
            expect(log).toEqual(['DirB', 'DirA (dep: DirB)']);
        });
        it('should instantiate injected directives before components', function () {
            var Comp = /** @class */ (function () {
                function Comp(dir) {
                    log.push("Comp (dep: " + dir.value + ")");
                }
                Comp.ngComponentDef = definition_1.defineComponent({
                    selectors: [['comp']],
                    type: Comp,
                    factory: function () { return new Comp(index_1.directiveInject(DirB)); },
                    template: function (ctx, fm) { }
                });
                return Comp;
            }());
            /** <comp dirB></comp> */
            var App = render_util_1.createComponent('app', function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'comp', ['dirB', '']);
                    instructions_1.elementEnd();
                }
            }, [Comp, DirB]);
            var fixture = new render_util_1.ComponentFixture(App);
            expect(log).toEqual(['DirB', 'Comp (dep: DirB)']);
        });
        it('should inject directives in the correct order in a for loop', function () {
            var DirA = /** @class */ (function () {
                function DirA(dir) {
                    log.push("DirA (dep: " + dir.value + ")");
                }
                DirA.ngDirectiveDef = index_1.defineDirective({
                    selectors: [['', 'dirA', '']],
                    type: DirA,
                    factory: function () { return new DirA(index_1.directiveInject(DirB)); }
                });
                return DirA;
            }());
            /**
             * % for(let i = 0; i < 3; i++) {
             *   <div dirA dirB></div>
             * % }
             */
            var App = render_util_1.createComponent('app', function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.container(0);
                }
                instructions_1.containerRefreshStart(0);
                {
                    for (var i = 0; i < 3; i++) {
                        if (instructions_1.embeddedViewStart(0)) {
                            instructions_1.elementStart(0, 'div', ['dirA', '', 'dirB', '']);
                            instructions_1.elementEnd();
                        }
                        instructions_1.embeddedViewEnd();
                    }
                }
                instructions_1.containerRefreshEnd();
            }, [DirA, DirB]);
            var fixture = new render_util_1.ComponentFixture(App);
            expect(log).toEqual(['DirB', 'DirA (dep: DirB)', 'DirB', 'DirA (dep: DirB)', 'DirB', 'DirA (dep: DirB)']);
        });
        it('should instantiate directives with multiple out-of-order dependencies', function () {
            var DirA = /** @class */ (function () {
                function DirA() {
                    this.value = 'DirA';
                    log.push(this.value);
                }
                DirA.ngDirectiveDef = index_1.defineDirective({
                    selectors: [['', 'dirA', '']],
                    type: DirA,
                    factory: function () { return new DirA(); },
                    features: [index_1.PublicFeature]
                });
                return DirA;
            }());
            var DirB = /** @class */ (function () {
                function DirB(dirA, dirC) {
                    log.push("DirB (deps: " + dirA.value + " and " + dirC.value + ")");
                }
                DirB.ngDirectiveDef = index_1.defineDirective({
                    selectors: [['', 'dirB', '']],
                    type: DirB,
                    factory: function () { return new DirB(index_1.directiveInject(DirA), index_1.directiveInject(DirC)); }
                });
                return DirB;
            }());
            var DirC = /** @class */ (function () {
                function DirC() {
                    this.value = 'DirC';
                    log.push(this.value);
                }
                DirC.ngDirectiveDef = index_1.defineDirective({
                    selectors: [['', 'dirC', '']],
                    type: DirC,
                    factory: function () { return new DirC(); },
                    features: [index_1.PublicFeature]
                });
                return DirC;
            }());
            /** <div dirA dirB dirC></div> */
            var App = render_util_1.createComponent('app', function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'div', ['dirA', '', 'dirB', '', 'dirC', '']);
                    instructions_1.elementEnd();
                }
            }, [DirA, DirB, DirC]);
            var fixture = new render_util_1.ComponentFixture(App);
            expect(log).toEqual(['DirA', 'DirC', 'DirB (deps: DirA and DirC)']);
        });
        it('should instantiate in the correct order for complex case', function () {
            var Comp = /** @class */ (function () {
                function Comp(dir) {
                    log.push("Comp (dep: " + dir.value + ")");
                }
                Comp.ngComponentDef = definition_1.defineComponent({
                    selectors: [['comp']],
                    type: Comp,
                    factory: function () { return new Comp(index_1.directiveInject(DirD)); },
                    template: function (ctx, fm) { }
                });
                return Comp;
            }());
            var DirA = /** @class */ (function () {
                function DirA(dir) {
                    this.value = 'DirA';
                    log.push("DirA (dep: " + dir.value + ")");
                }
                DirA.ngDirectiveDef = index_1.defineDirective({
                    selectors: [['', 'dirA', '']],
                    type: DirA,
                    factory: function () { return new DirA(index_1.directiveInject(DirC)); },
                    features: [index_1.PublicFeature]
                });
                return DirA;
            }());
            var DirC = /** @class */ (function () {
                function DirC(dir) {
                    this.value = 'DirC';
                    log.push("DirC (dep: " + dir.value + ")");
                }
                DirC.ngDirectiveDef = index_1.defineDirective({
                    selectors: [['', 'dirC', '']],
                    type: DirC,
                    factory: function () { return new DirC(index_1.directiveInject(DirB)); },
                    features: [index_1.PublicFeature]
                });
                return DirC;
            }());
            var DirD = /** @class */ (function () {
                function DirD(dir) {
                    this.value = 'DirD';
                    log.push("DirD (dep: " + dir.value + ")");
                }
                DirD.ngDirectiveDef = index_1.defineDirective({
                    selectors: [['', 'dirD', '']],
                    type: DirD,
                    factory: function () { return new DirD(index_1.directiveInject(DirA)); },
                    features: [index_1.PublicFeature]
                });
                return DirD;
            }());
            /** <comp dirA dirB dirC dirD></comp> */
            var App = render_util_1.createComponent('app', function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'comp', ['dirA', '', 'dirB', '', 'dirC', '', 'dirD', '']);
                    instructions_1.elementEnd();
                }
            }, [Comp, DirA, DirB, DirC, DirD]);
            var fixture = new render_util_1.ComponentFixture(App);
            expect(log).toEqual(['DirB', 'DirC (dep: DirB)', 'DirA (dep: DirC)', 'DirD (dep: DirA)', 'Comp (dep: DirD)']);
        });
        it('should instantiate in correct order with mixed parent and peer dependencies', function () {
            var DirA = /** @class */ (function () {
                function DirA(dirB, app) {
                    log.push("DirA (deps: " + dirB.value + " and " + app.value + ")");
                }
                DirA.ngDirectiveDef = index_1.defineDirective({
                    selectors: [['', 'dirA', '']],
                    type: DirA,
                    factory: function () { return new DirA(index_1.directiveInject(DirB), index_1.directiveInject(App)); },
                });
                return DirA;
            }());
            var App = /** @class */ (function () {
                function App() {
                    this.value = 'App';
                }
                App.ngComponentDef = definition_1.defineComponent({
                    selectors: [['app']],
                    type: App,
                    factory: function () { return new App(); },
                    /** <div dirA dirB dirC></div> */
                    template: function (rf, ctx) {
                        if (rf & 1 /* Create */) {
                            instructions_1.elementStart(0, 'div', ['dirA', '', 'dirB', '', 'dirC', 'dirC']);
                            instructions_1.elementEnd();
                        }
                    },
                    directives: [DirA, DirB],
                    features: [index_1.PublicFeature],
                });
                return App;
            }());
            var fixture = new render_util_1.ComponentFixture(App);
            expect(log).toEqual(['DirB', 'DirA (deps: DirB and App)']);
        });
        it('should not use a parent when peer dep is available', function () {
            var count = 1;
            var DirA = /** @class */ (function () {
                function DirA(dirB) {
                    log.push("DirA (dep: DirB - " + dirB.count + ")");
                }
                DirA.ngDirectiveDef = index_1.defineDirective({
                    selectors: [['', 'dirA', '']],
                    type: DirA,
                    factory: function () { return new DirA(index_1.directiveInject(DirB)); },
                });
                return DirA;
            }());
            var DirB = /** @class */ (function () {
                function DirB() {
                    log.push("DirB");
                    this.count = count++;
                }
                DirB.ngDirectiveDef = index_1.defineDirective({
                    selectors: [['', 'dirB', '']],
                    type: DirB,
                    factory: function () { return new DirB(); },
                    features: [index_1.PublicFeature],
                });
                return DirB;
            }());
            /** <div dirA dirB></div> */
            var Parent = render_util_1.createComponent('parent', function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'div', ['dirA', '', 'dirB', '']);
                    instructions_1.elementEnd();
                }
            }, [DirA, DirB]);
            /** <parent dirB></parent> */
            var App = render_util_1.createComponent('app', function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'parent', ['dirB', '']);
                    instructions_1.elementEnd();
                }
            }, [Parent, DirB]);
            var fixture = new render_util_1.ComponentFixture(App);
            expect(log).toEqual(['DirB', 'DirB', 'DirA (dep: DirB - 2)']);
        });
        it('should create instance even when no injector present', function () {
            var MyService = /** @class */ (function () {
                function MyService() {
                    this.value = 'MyService';
                }
                MyService.ngInjectableDef = core_1.defineInjectable({ providedIn: 'root', factory: function () { return new MyService(); } });
                return MyService;
            }());
            var MyComponent = /** @class */ (function () {
                function MyComponent(myService) {
                    this.myService = myService;
                }
                MyComponent.ngComponentDef = definition_1.defineComponent({
                    type: MyComponent,
                    selectors: [['my-component']],
                    factory: function () { return new MyComponent(index_1.directiveInject(MyService)); },
                    template: function (rf, ctx) {
                        if (rf & 1 /* Create */) {
                            instructions_1.text(0);
                        }
                        if (rf & 2 /* Update */) {
                            instructions_1.textBinding(0, instructions_1.bind(ctx.myService.value));
                        }
                    }
                });
                return MyComponent;
            }());
            var fixture = new render_util_1.ComponentFixture(MyComponent);
            fixture.update();
            expect(fixture.html).toEqual('MyService');
        });
        it('should throw if directive is not found anywhere', function () {
            var Dir = /** @class */ (function () {
                function Dir(siblingDir) {
                }
                Dir.ngDirectiveDef = index_1.defineDirective({
                    selectors: [['', 'dir', '']],
                    type: Dir,
                    factory: function () { return new Dir(index_1.directiveInject(OtherDir)); },
                    features: [index_1.PublicFeature]
                });
                return Dir;
            }());
            var OtherDir = /** @class */ (function () {
                function OtherDir() {
                }
                OtherDir.ngDirectiveDef = index_1.defineDirective({
                    selectors: [['', 'other', '']],
                    type: OtherDir,
                    factory: function () { return new OtherDir(); },
                    features: [index_1.PublicFeature]
                });
                return OtherDir;
            }());
            /** <div dir></div> */
            var App = render_util_1.createComponent('app', function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'div', ['dir', '']);
                    instructions_1.elementEnd();
                }
            }, [Dir, OtherDir]);
            expect(function () { return new render_util_1.ComponentFixture(App); }).toThrowError(/Injector: NOT_FOUND \[OtherDir\]/);
        });
        it('should throw if directive is not found in ancestor tree', function () {
            var Dir = /** @class */ (function () {
                function Dir(siblingDir) {
                }
                Dir.ngDirectiveDef = index_1.defineDirective({
                    selectors: [['', 'dir', '']],
                    type: Dir,
                    factory: function () { return new Dir(index_1.directiveInject(OtherDir)); },
                    features: [index_1.PublicFeature]
                });
                return Dir;
            }());
            var OtherDir = /** @class */ (function () {
                function OtherDir() {
                }
                OtherDir.ngDirectiveDef = index_1.defineDirective({
                    selectors: [['', 'other', '']],
                    type: OtherDir,
                    factory: function () { return new OtherDir(); },
                    features: [index_1.PublicFeature]
                });
                return OtherDir;
            }());
            /**
             * <div other></div>
             * <div dir></div>
             */
            var App = render_util_1.createComponent('app', function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'div', ['other', '']);
                    instructions_1.elementEnd();
                    instructions_1.elementStart(1, 'div', ['dir', '']);
                    instructions_1.elementEnd();
                }
            }, [Dir, OtherDir]);
            expect(function () { return new render_util_1.ComponentFixture(App); }).toThrowError(/Injector: NOT_FOUND \[OtherDir\]/);
        });
        it('should throw if directives try to inject each other', function () {
            var DirA = /** @class */ (function () {
                function DirA(dir) {
                }
                DirA.ngDirectiveDef = index_1.defineDirective({
                    selectors: [['', 'dirA', '']],
                    type: DirA,
                    factory: function () { return new DirA(index_1.directiveInject(DirB)); },
                    features: [index_1.PublicFeature]
                });
                return DirA;
            }());
            var DirB = /** @class */ (function () {
                function DirB(dir) {
                }
                DirB.ngDirectiveDef = index_1.defineDirective({
                    selectors: [['', 'dirB', '']],
                    type: DirB,
                    factory: function () { return new DirB(index_1.directiveInject(DirA)); },
                    features: [index_1.PublicFeature]
                });
                return DirB;
            }());
            /** <div dirA dirB></div> */
            var App = render_util_1.createComponent('app', function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'div', ['dirA', '', 'dirB', '']);
                    instructions_1.elementEnd();
                }
            }, [DirA, DirB]);
            expect(function () { return new render_util_1.ComponentFixture(App); }).toThrowError(/Cannot instantiate cyclic dependency!/);
        });
        it('should throw if directive tries to inject itself', function () {
            var Dir = /** @class */ (function () {
                function Dir(dir) {
                }
                Dir.ngDirectiveDef = index_1.defineDirective({
                    selectors: [['', 'dir', '']],
                    type: Dir,
                    factory: function () { return new Dir(index_1.directiveInject(Dir)); },
                    features: [index_1.PublicFeature]
                });
                return Dir;
            }());
            /** <div dir></div> */
            var App = render_util_1.createComponent('app', function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'div', ['dir', '']);
                    instructions_1.elementEnd();
                }
            }, [Dir]);
            expect(function () { return new render_util_1.ComponentFixture(App); }).toThrowError(/Cannot instantiate cyclic dependency!/);
        });
        describe('flags', function () {
            var DirB = /** @class */ (function () {
                function DirB() {
                }
                DirB.ngDirectiveDef = index_1.defineDirective({
                    type: DirB,
                    selectors: [['', 'dirB', '']],
                    factory: function () { return new DirB(); },
                    inputs: { value: 'dirB' },
                    features: [index_1.PublicFeature]
                });
                return DirB;
            }());
            it('should not throw if dependency is @Optional', function () {
                var dirA;
                var DirA = /** @class */ (function () {
                    function DirA(dirB) {
                        this.dirB = dirB;
                    }
                    DirA.ngDirectiveDef = index_1.defineDirective({
                        type: DirA,
                        selectors: [['', 'dirA', '']],
                        factory: function () { return dirA = new DirA(index_1.directiveInject(DirB, 8 /* Optional */)); }
                    });
                    DirA = __decorate([
                        __param(0, core_1.Optional()),
                        __metadata("design:paramtypes", [Object])
                    ], DirA);
                    return DirA;
                }());
                /** <div dirA></div> */
                var App = render_util_1.createComponent('app', function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.elementStart(0, 'div', ['dirA', '']);
                        instructions_1.elementEnd();
                    }
                }, [DirA, DirB]);
                expect(function () {
                    var fixture = new render_util_1.ComponentFixture(App);
                    expect(dirA.dirB).toEqual(null);
                }).not.toThrow();
            });
            it('should not throw if dependency is @Optional but defined elsewhere', function () {
                var dirA;
                var DirA = /** @class */ (function () {
                    function DirA(dirB) {
                        this.dirB = dirB;
                    }
                    DirA.ngDirectiveDef = index_1.defineDirective({
                        type: DirA,
                        selectors: [['', 'dirA', '']],
                        factory: function () { return dirA = new DirA(index_1.directiveInject(DirB, 8 /* Optional */)); }
                    });
                    DirA = __decorate([
                        __param(0, core_1.Optional()),
                        __metadata("design:paramtypes", [Object])
                    ], DirA);
                    return DirA;
                }());
                /**
                 * <div dirB></div>
                 * <div dirA></div>
                 */
                var App = render_util_1.createComponent('app', function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.elementStart(0, 'div', ['dirB', '']);
                        instructions_1.elementEnd();
                        instructions_1.elementStart(1, 'div', ['dirA', '']);
                        instructions_1.elementEnd();
                    }
                }, [DirA, DirB]);
                expect(function () {
                    var fixture = new render_util_1.ComponentFixture(App);
                    expect(dirA.dirB).toEqual(null);
                }).not.toThrow();
            });
            it('should skip the current node with @SkipSelf', function () {
                var dirA;
                var DirA = /** @class */ (function () {
                    function DirA(dirB) {
                        this.dirB = dirB;
                    }
                    DirA.ngDirectiveDef = index_1.defineDirective({
                        type: DirA,
                        selectors: [['', 'dirA', '']],
                        factory: function () { return dirA = new DirA(index_1.directiveInject(DirB, 4 /* SkipSelf */)); }
                    });
                    DirA = __decorate([
                        __param(0, core_1.SkipSelf()),
                        __metadata("design:paramtypes", [DirB])
                    ], DirA);
                    return DirA;
                }());
                /** <div dirA dirB="self"></div> */
                var Comp = render_util_1.createComponent('comp', function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.elementStart(0, 'div', ['dirA', '', 'dirB', 'self']);
                        instructions_1.elementEnd();
                    }
                }, [DirA, DirB]);
                /* <comp dirB="parent"></comp> */
                var App = render_util_1.createComponent('app', function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.elementStart(0, 'comp', ['dirB', 'parent']);
                        instructions_1.elementEnd();
                    }
                }, [Comp, DirB]);
                var fixture = new render_util_1.ComponentFixture(App);
                expect(dirA.dirB.value).toEqual('parent');
            });
            it('should check only the current node with @Self', function () {
                var dirA;
                var DirA = /** @class */ (function () {
                    function DirA(dirB) {
                        this.dirB = dirB;
                    }
                    DirA.ngDirectiveDef = index_1.defineDirective({
                        type: DirA,
                        selectors: [['', 'dirA', '']],
                        factory: function () { return dirA = new DirA(index_1.directiveInject(DirB, 2 /* Self */)); }
                    });
                    DirA = __decorate([
                        __param(0, core_1.Self()),
                        __metadata("design:paramtypes", [DirB])
                    ], DirA);
                    return DirA;
                }());
                /**
                 * <div dirB>
                 *   <div dirA></div>
                 * </div>
                 */
                var App = render_util_1.createComponent('app', function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.elementStart(0, 'div', ['dirB', '']);
                        instructions_1.elementStart(1, 'div', ['dirA', '']);
                        instructions_1.elementEnd();
                        instructions_1.elementEnd();
                    }
                }, [DirA, DirB]);
                expect(function () {
                    var fixture = new render_util_1.ComponentFixture(App);
                }).toThrowError(/Injector: NOT_FOUND \[DirB\]/);
            });
            it('should check only the current node with @Self even with false positive', function () {
                var dirA;
                var DirA = /** @class */ (function () {
                    function DirA(dirB) {
                        this.dirB = dirB;
                    }
                    DirA.ngDirectiveDef = index_1.defineDirective({
                        type: DirA,
                        selectors: [['', 'dirA', '']],
                        factory: function () { return dirA = new DirA(index_1.directiveInject(DirB, 2 /* Self */)); }
                    });
                    DirA = __decorate([
                        __param(0, core_1.Self()),
                        __metadata("design:paramtypes", [DirB])
                    ], DirA);
                    return DirA;
                }());
                var DirC = render_util_1.createDirective('dirC');
                /**
                 * <div dirB>
                 *   <div dirA dirC></div>
                 * </div>
                 */
                var App = render_util_1.createComponent('app', function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.elementStart(0, 'div', ['dirB', '']);
                        instructions_1.elementStart(1, 'div', ['dirA', '', 'dirC', '']);
                        instructions_1.elementEnd();
                        instructions_1.elementEnd();
                    }
                }, [DirA, DirB, DirC]);
                expect(function () {
                    DirA['__NG_ELEMENT_ID__'] = 1;
                    DirC['__NG_ELEMENT_ID__'] = 257;
                    var fixture = new render_util_1.ComponentFixture(App);
                }).toThrowError(/Injector: NOT_FOUND \[DirB\]/);
            });
            it('should not pass component boundary with @Host', function () {
                var dirA;
                var DirA = /** @class */ (function () {
                    function DirA(dirB) {
                        this.dirB = dirB;
                    }
                    DirA.ngDirectiveDef = index_1.defineDirective({
                        type: DirA,
                        selectors: [['', 'dirA', '']],
                        factory: function () { return dirA = new DirA(index_1.directiveInject(DirB, 1 /* Host */)); }
                    });
                    DirA = __decorate([
                        __param(0, core_1.Host()),
                        __metadata("design:paramtypes", [DirB])
                    ], DirA);
                    return DirA;
                }());
                /** <div dirA></div> */
                var Comp = render_util_1.createComponent('comp', function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.elementStart(0, 'div', ['dirA', '']);
                        instructions_1.elementEnd();
                    }
                }, [DirA, DirB]);
                /* <comp dirB></comp> */
                var App = render_util_1.createComponent('app', function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.elementStart(0, 'comp', ['dirB', '']);
                        instructions_1.elementEnd();
                    }
                }, [Comp, DirB]);
                expect(function () {
                    var fixture = new render_util_1.ComponentFixture(App);
                }).toThrowError(/Injector: NOT_FOUND \[DirB\]/);
            });
        });
    });
    describe('ElementRef', function () {
        it('should create directive with ElementRef dependencies', function () {
            var Directive = /** @class */ (function () {
                function Directive(elementRef) {
                    this.elementRef = elementRef;
                    this.value = elementRef.constructor.name;
                }
                Directive.ngDirectiveDef = index_1.defineDirective({
                    type: Directive,
                    selectors: [['', 'dir', '']],
                    factory: function () { return new Directive(index_1.injectElementRef()); },
                    features: [index_1.PublicFeature],
                    exportAs: 'dir'
                });
                return Directive;
            }());
            var DirectiveSameInstance = /** @class */ (function () {
                function DirectiveSameInstance(elementRef, directive) {
                    this.value = elementRef === directive.elementRef;
                }
                DirectiveSameInstance.ngDirectiveDef = index_1.defineDirective({
                    type: DirectiveSameInstance,
                    selectors: [['', 'dirSame', '']],
                    factory: function () { return new DirectiveSameInstance(index_1.injectElementRef(), index_1.directiveInject(Directive)); },
                    exportAs: 'dirSame'
                });
                return DirectiveSameInstance;
            }());
            /**
             * <div dir dirSame #dirSame="dirSame" #dir="dir">
             *   {{ dir.value }} - {{ dirSame.value }}
             * </div>
             */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'div', ['dir', '', 'dirSame', ''], ['dirSame', 'dirSame', 'dir', 'dir']);
                    {
                        instructions_1.text(3);
                    }
                    instructions_1.elementEnd();
                }
                var tmp1;
                var tmp2;
                if (rf & 2 /* Update */) {
                    tmp1 = instructions_1.load(1);
                    tmp2 = instructions_1.load(2);
                    instructions_1.textBinding(3, instructions_1.interpolation2('', tmp2.value, '-', tmp1.value, ''));
                }
            }
            var defs = [Directive, DirectiveSameInstance];
            expect(render_util_1.renderToHtml(Template, {}, defs))
                .toEqual('<div dir="" dirsame="">ElementRef-true</div>');
        });
    });
    describe('TemplateRef', function () {
        it('should create directive with TemplateRef dependencies', function () {
            var Directive = /** @class */ (function () {
                function Directive(templateRef) {
                    this.templateRef = templateRef;
                    this.value = templateRef.constructor.name;
                }
                Directive.ngDirectiveDef = index_1.defineDirective({
                    type: Directive,
                    selectors: [['', 'dir', '']],
                    factory: function () { return new Directive(index_1.injectTemplateRef()); },
                    features: [index_1.PublicFeature],
                    exportAs: 'dir'
                });
                return Directive;
            }());
            var DirectiveSameInstance = /** @class */ (function () {
                function DirectiveSameInstance(templateRef, directive) {
                    this.value = templateRef === directive.templateRef;
                }
                DirectiveSameInstance.ngDirectiveDef = index_1.defineDirective({
                    type: DirectiveSameInstance,
                    selectors: [['', 'dirSame', '']],
                    factory: function () { return new DirectiveSameInstance(index_1.injectTemplateRef(), index_1.directiveInject(Directive)); },
                    exportAs: 'dirSame'
                });
                return DirectiveSameInstance;
            }());
            /**
             * <ng-template dir dirSame #dir="dir" #dirSame="dirSame">
             *   {{ dir.value }} - {{ dirSame.value }}
             * </ng-template>
             */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.container(0, function () {
                    }, undefined, ['dir', '', 'dirSame', ''], ['dir', 'dir', 'dirSame', 'dirSame']);
                    instructions_1.text(3);
                }
                var tmp1;
                var tmp2;
                if (rf & 2 /* Update */) {
                    tmp1 = instructions_1.load(1);
                    tmp2 = instructions_1.load(2);
                    instructions_1.textBinding(3, instructions_1.interpolation2('', tmp1.value, '-', tmp2.value, ''));
                }
            }
            var defs = [Directive, DirectiveSameInstance];
            expect(render_util_1.renderToHtml(Template, {}, defs)).toEqual('TemplateRef-true');
        });
    });
    describe('ViewContainerRef', function () {
        it('should create directive with ViewContainerRef dependencies', function () {
            var Directive = /** @class */ (function () {
                function Directive(viewContainerRef) {
                    this.viewContainerRef = viewContainerRef;
                    this.value = viewContainerRef.constructor.name;
                }
                Directive.ngDirectiveDef = index_1.defineDirective({
                    type: Directive,
                    selectors: [['', 'dir', '']],
                    factory: function () { return new Directive(index_1.injectViewContainerRef()); },
                    features: [index_1.PublicFeature],
                    exportAs: 'dir'
                });
                return Directive;
            }());
            var DirectiveSameInstance = /** @class */ (function () {
                function DirectiveSameInstance(viewContainerRef, directive) {
                    this.value = viewContainerRef === directive.viewContainerRef;
                }
                DirectiveSameInstance.ngDirectiveDef = index_1.defineDirective({
                    type: DirectiveSameInstance,
                    selectors: [['', 'dirSame', '']],
                    factory: function () { return new DirectiveSameInstance(index_1.injectViewContainerRef(), index_1.directiveInject(Directive)); },
                    exportAs: 'dirSame'
                });
                return DirectiveSameInstance;
            }());
            /**
             * <div dir dirSame #dir="dir" #dirSame="dirSame">
             *   {{ dir.value }} - {{ dirSame.value }}
             * </div>
             */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'div', ['dir', '', 'dirSame', ''], ['dir', 'dir', 'dirSame', 'dirSame']);
                    {
                        instructions_1.text(3);
                    }
                    instructions_1.elementEnd();
                }
                var tmp1;
                var tmp2;
                if (rf & 2 /* Update */) {
                    tmp1 = instructions_1.load(1);
                    tmp2 = instructions_1.load(2);
                    instructions_1.textBinding(3, instructions_1.interpolation2('', tmp1.value, '-', tmp2.value, ''));
                }
            }
            var defs = [Directive, DirectiveSameInstance];
            expect(render_util_1.renderToHtml(Template, {}, defs))
                .toEqual('<div dir="" dirsame="">ViewContainerRef-true</div>');
        });
    });
    describe('ChangeDetectorRef', function () {
        var dir;
        var dirSameInstance;
        var comp;
        var MyComp = /** @class */ (function () {
            function MyComp(cdr) {
                this.cdr = cdr;
            }
            MyComp.ngComponentDef = definition_1.defineComponent({
                type: MyComp,
                selectors: [['my-comp']],
                factory: function () { return comp = new MyComp(index_1.injectChangeDetectorRef()); },
                template: function (rf, ctx) {
                    if (rf & 1 /* Create */) {
                        instructions_1.projectionDef();
                        instructions_1.projection(0);
                    }
                }
            });
            return MyComp;
        }());
        var Directive = /** @class */ (function () {
            function Directive(cdr) {
                this.cdr = cdr;
                this.value = cdr.constructor.name;
            }
            Directive.ngDirectiveDef = index_1.defineDirective({
                type: Directive,
                selectors: [['', 'dir', '']],
                factory: function () { return dir = new Directive(index_1.injectChangeDetectorRef()); },
                features: [index_1.PublicFeature],
                exportAs: 'dir'
            });
            return Directive;
        }());
        var DirectiveSameInstance = /** @class */ (function () {
            function DirectiveSameInstance(cdr) {
                this.cdr = cdr;
            }
            DirectiveSameInstance.ngDirectiveDef = index_1.defineDirective({
                type: DirectiveSameInstance,
                selectors: [['', 'dirSame', '']],
                factory: function () { return dirSameInstance = new DirectiveSameInstance(index_1.injectChangeDetectorRef()); }
            });
            return DirectiveSameInstance;
        }());
        var IfDirective = /** @class */ (function () {
            function IfDirective(template, vcr) {
                this.template = template;
                this.vcr = vcr;
                /* @Input */
                this.myIf = true;
            }
            IfDirective.prototype.ngOnChanges = function () {
                if (this.myIf) {
                    this.vcr.createEmbeddedView(this.template);
                }
            };
            IfDirective.ngDirectiveDef = index_1.defineDirective({
                type: IfDirective,
                selectors: [['', 'myIf', '']],
                factory: function () { return new IfDirective(index_1.injectTemplateRef(), index_1.injectViewContainerRef()); },
                inputs: { myIf: 'myIf' },
                features: [index_1.PublicFeature, index_1.NgOnChangesFeature]
            });
            return IfDirective;
        }());
        var directives = [MyComp, Directive, DirectiveSameInstance, IfDirective];
        it('should inject current component ChangeDetectorRef into directives on components', function () {
            /** <my-comp dir dirSameInstance #dir="dir"></my-comp> {{ dir.value }} */
            var MyApp = render_util_1.createComponent('my-app', function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'my-comp', ['dir', '', 'dirSame', ''], ['dir', 'dir']);
                    instructions_1.elementEnd();
                    instructions_1.text(2);
                }
                var tmp;
                if (rf & 2 /* Update */) {
                    tmp = instructions_1.load(1);
                    instructions_1.textBinding(2, instructions_1.bind(tmp.value));
                }
            }, directives);
            var app = render_util_1.renderComponent(MyApp);
            // ChangeDetectorRef is the token, ViewRef has historically been the constructor
            expect(render_util_1.toHtml(app)).toEqual('<my-comp dir="" dirsame=""></my-comp>ViewRef');
            expect(comp.cdr.context).toBe(comp);
            expect(dir.cdr).toBe(comp.cdr);
            expect(dir.cdr).toBe(dirSameInstance.cdr);
        });
        it('should inject host component ChangeDetectorRef into directives on elements', function () {
            var MyApp = /** @class */ (function () {
                function MyApp(cdr) {
                    this.cdr = cdr;
                }
                MyApp.ngComponentDef = definition_1.defineComponent({
                    type: MyApp,
                    selectors: [['my-app']],
                    factory: function () { return new MyApp(index_1.injectChangeDetectorRef()); },
                    /** <div dir dirSameInstance #dir="dir"> {{ dir.value }} </div> */
                    template: function (rf, ctx) {
                        if (rf & 1 /* Create */) {
                            instructions_1.elementStart(0, 'div', ['dir', '', 'dirSame', ''], ['dir', 'dir']);
                            {
                                instructions_1.text(2);
                            }
                            instructions_1.elementEnd();
                        }
                        var tmp;
                        if (rf & 2 /* Update */) {
                            tmp = instructions_1.load(1);
                            instructions_1.textBinding(2, instructions_1.bind(tmp.value));
                        }
                    },
                    directives: directives
                });
                return MyApp;
            }());
            var app = render_util_1.renderComponent(MyApp);
            expect(render_util_1.toHtml(app)).toEqual('<div dir="" dirsame="">ViewRef</div>');
            expect(app.cdr.context).toBe(app);
            expect(dir.cdr).toBe(app.cdr);
            expect(dir.cdr).toBe(dirSameInstance.cdr);
        });
        it('should inject host component ChangeDetectorRef into directives in ContentChildren', function () {
            var MyApp = /** @class */ (function () {
                function MyApp(cdr) {
                    this.cdr = cdr;
                }
                MyApp.ngComponentDef = definition_1.defineComponent({
                    type: MyApp,
                    selectors: [['my-app']],
                    factory: function () { return new MyApp(index_1.injectChangeDetectorRef()); },
                    /**
                     * <my-comp>
                     *   <div dir dirSameInstance #dir="dir"></div>
                     * </my-comp>
                     * {{ dir.value }}
                     */
                    template: function (rf, ctx) {
                        if (rf & 1 /* Create */) {
                            instructions_1.elementStart(0, 'my-comp');
                            {
                                instructions_1.elementStart(1, 'div', ['dir', '', 'dirSame', ''], ['dir', 'dir']);
                                instructions_1.elementEnd();
                            }
                            instructions_1.elementEnd();
                            instructions_1.text(3);
                        }
                        var tmp = instructions_1.load(2);
                        if (rf & 2 /* Update */) {
                            instructions_1.textBinding(3, instructions_1.bind(tmp.value));
                        }
                    },
                    directives: directives
                });
                return MyApp;
            }());
            var app = render_util_1.renderComponent(MyApp);
            expect(render_util_1.toHtml(app)).toEqual('<my-comp><div dir="" dirsame=""></div></my-comp>ViewRef');
            expect(app.cdr.context).toBe(app);
            expect(dir.cdr).toBe(app.cdr);
            expect(dir.cdr).toBe(dirSameInstance.cdr);
        });
        it('should inject host component ChangeDetectorRef into directives in embedded views', function () {
            var MyApp = /** @class */ (function () {
                function MyApp(cdr) {
                    this.cdr = cdr;
                    this.showing = true;
                }
                MyApp.ngComponentDef = definition_1.defineComponent({
                    type: MyApp,
                    selectors: [['my-app']],
                    factory: function () { return new MyApp(index_1.injectChangeDetectorRef()); },
                    /**
                     * % if (showing) {
                     *   <div dir dirSameInstance #dir="dir"> {{ dir.value }} </div>
                     * % }
                     */
                    template: function (rf, ctx) {
                        if (rf & 1 /* Create */) {
                            instructions_1.container(0);
                        }
                        if (rf & 2 /* Update */) {
                            instructions_1.containerRefreshStart(0);
                            {
                                if (ctx.showing) {
                                    var rf1 = instructions_1.embeddedViewStart(0);
                                    if (rf1 & 1 /* Create */) {
                                        instructions_1.elementStart(0, 'div', ['dir', '', 'dirSame', ''], ['dir', 'dir']);
                                        {
                                            instructions_1.text(2);
                                        }
                                        instructions_1.elementEnd();
                                    }
                                    var tmp = void 0;
                                    if (rf1 & 2 /* Update */) {
                                        tmp = instructions_1.load(1);
                                        instructions_1.textBinding(2, instructions_1.bind(tmp.value));
                                    }
                                }
                                instructions_1.embeddedViewEnd();
                            }
                            instructions_1.containerRefreshEnd();
                        }
                    },
                    directives: directives
                });
                return MyApp;
            }());
            var app = render_util_1.renderComponent(MyApp);
            expect(render_util_1.toHtml(app)).toEqual('<div dir="" dirsame="">ViewRef</div>');
            expect(app.cdr.context).toBe(app);
            expect(dir.cdr).toBe(app.cdr);
            expect(dir.cdr).toBe(dirSameInstance.cdr);
        });
        it('should inject host component ChangeDetectorRef into directives on containers', function () {
            var MyApp = /** @class */ (function () {
                function MyApp(cdr) {
                    this.cdr = cdr;
                    this.showing = true;
                }
                MyApp.ngComponentDef = definition_1.defineComponent({
                    type: MyApp,
                    selectors: [['my-app']],
                    factory: function () { return new MyApp(index_1.injectChangeDetectorRef()); },
                    /** <div *myIf="showing" dir dirSameInstance #dir="dir"> {{ dir.value }} </div> */
                    template: function (rf, ctx) {
                        if (rf & 1 /* Create */) {
                            instructions_1.container(0, C1, undefined, ['myIf', 'showing']);
                        }
                        if (rf & 2 /* Update */) {
                            instructions_1.containerRefreshStart(0);
                            instructions_1.containerRefreshEnd();
                        }
                        function C1(rf1, ctx1) {
                            if (rf1 & 1 /* Create */) {
                                instructions_1.elementStart(0, 'div', ['dir', '', 'dirSame', ''], ['dir', 'dir']);
                                {
                                    instructions_1.text(2);
                                }
                                instructions_1.elementEnd();
                            }
                            var tmp;
                            if (rf1 & 2 /* Update */) {
                                tmp = instructions_1.load(1);
                                instructions_1.textBinding(2, instructions_1.bind(tmp.value));
                            }
                        }
                    },
                    directives: directives
                });
                return MyApp;
            }());
            var app = render_util_1.renderComponent(MyApp);
            expect(render_util_1.toHtml(app)).toEqual('<div dir="" dirsame="">ViewRef</div>');
            expect(app.cdr.context).toBe(app);
            expect(dir.cdr).toBe(app.cdr);
            expect(dir.cdr).toBe(dirSameInstance.cdr);
        });
    });
    describe('@Attribute', function () {
        it('should inject attribute', function () {
            var exist = 'wrong';
            var nonExist = 'wrong';
            var MyApp = render_util_1.createComponent('my-app', function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'div', ['exist', 'existValue', 'other', 'ignore']);
                    exist = di_1.injectAttribute('exist');
                    nonExist = di_1.injectAttribute('nonExist');
                }
            });
            var fixture = new render_util_1.ComponentFixture(MyApp);
            expect(exist).toEqual('existValue');
            expect(nonExist).toEqual(undefined);
        });
        // https://stackblitz.com/edit/angular-8ytqkp?file=src%2Fapp%2Fapp.component.ts
        it('should not inject attributes representing bindings and outputs', function () {
            var exist = 'wrong';
            var nonExist = 'wrong';
            var MyApp = render_util_1.createComponent('my-app', function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'div', ['exist', 'existValue', 1 /* SelectOnly */, 'nonExist']);
                    exist = di_1.injectAttribute('exist');
                    nonExist = di_1.injectAttribute('nonExist');
                }
            });
            var fixture = new render_util_1.ComponentFixture(MyApp);
            expect(exist).toEqual('existValue');
            expect(nonExist).toEqual(undefined);
        });
        it('should not accidentally inject attributes representing bindings and outputs', function () {
            var exist = 'wrong';
            var nonExist = 'wrong';
            var MyApp = render_util_1.createComponent('my-app', function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'div', [
                        'exist', 'existValue', 1 /* SelectOnly */, 'binding1', 'nonExist', 'binding2'
                    ]);
                    exist = di_1.injectAttribute('exist');
                    nonExist = di_1.injectAttribute('nonExist');
                }
            });
            var fixture = new render_util_1.ComponentFixture(MyApp);
            expect(exist).toEqual('existValue');
            expect(nonExist).toEqual(undefined);
        });
    });
    describe('inject', function () {
        describe('bloom filter', function () {
            var di;
            beforeEach(function () {
                di = {};
                di.bf0 = 0;
                di.bf1 = 0;
                di.bf2 = 0;
                di.bf3 = 0;
                di.bf4 = 0;
                di.bf5 = 0;
                di.bf6 = 0;
                di.bf7 = 0;
                di.bf3 = 0;
                di.cbf0 = 0;
                di.cbf1 = 0;
                di.cbf2 = 0;
                di.cbf3 = 0;
                di.cbf4 = 0;
                di.cbf5 = 0;
                di.cbf6 = 0;
                di.cbf7 = 0;
            });
            function bloomState() {
                return [di.bf7, di.bf6, di.bf5, di.bf4, di.bf3, di.bf2, di.bf1, di.bf0];
            }
            it('should add values', function () {
                di_1.bloomAdd(di, { __NG_ELEMENT_ID__: 0 });
                expect(bloomState()).toEqual([0, 0, 0, 0, 0, 0, 0, 1]);
                di_1.bloomAdd(di, { __NG_ELEMENT_ID__: 32 + 1 });
                expect(bloomState()).toEqual([0, 0, 0, 0, 0, 0, 2, 1]);
                di_1.bloomAdd(di, { __NG_ELEMENT_ID__: 64 + 2 });
                expect(bloomState()).toEqual([0, 0, 0, 0, 0, 4, 2, 1]);
                di_1.bloomAdd(di, { __NG_ELEMENT_ID__: 96 + 3 });
                expect(bloomState()).toEqual([0, 0, 0, 0, 8, 4, 2, 1]);
                di_1.bloomAdd(di, { __NG_ELEMENT_ID__: 128 + 4 });
                expect(bloomState()).toEqual([0, 0, 0, 16, 8, 4, 2, 1]);
                di_1.bloomAdd(di, { __NG_ELEMENT_ID__: 160 + 5 });
                expect(bloomState()).toEqual([0, 0, 32, 16, 8, 4, 2, 1]);
                di_1.bloomAdd(di, { __NG_ELEMENT_ID__: 192 + 6 });
                expect(bloomState()).toEqual([0, 64, 32, 16, 8, 4, 2, 1]);
                di_1.bloomAdd(di, { __NG_ELEMENT_ID__: 224 + 7 });
                expect(bloomState()).toEqual([128, 64, 32, 16, 8, 4, 2, 1]);
            });
            it('should query values', function () {
                di_1.bloomAdd(di, { __NG_ELEMENT_ID__: 0 });
                di_1.bloomAdd(di, { __NG_ELEMENT_ID__: 32 });
                di_1.bloomAdd(di, { __NG_ELEMENT_ID__: 64 });
                di_1.bloomAdd(di, { __NG_ELEMENT_ID__: 96 });
                di_1.bloomAdd(di, { __NG_ELEMENT_ID__: 127 });
                di_1.bloomAdd(di, { __NG_ELEMENT_ID__: 161 });
                di_1.bloomAdd(di, { __NG_ELEMENT_ID__: 188 });
                di_1.bloomAdd(di, { __NG_ELEMENT_ID__: 223 });
                di_1.bloomAdd(di, { __NG_ELEMENT_ID__: 255 });
                expect(di_1.bloomFindPossibleInjector(di, 0, 0 /* Default */)).toEqual(di);
                expect(di_1.bloomFindPossibleInjector(di, 1, 0 /* Default */)).toEqual(null);
                expect(di_1.bloomFindPossibleInjector(di, 32, 0 /* Default */)).toEqual(di);
                expect(di_1.bloomFindPossibleInjector(di, 64, 0 /* Default */)).toEqual(di);
                expect(di_1.bloomFindPossibleInjector(di, 96, 0 /* Default */)).toEqual(di);
                expect(di_1.bloomFindPossibleInjector(di, 127, 0 /* Default */)).toEqual(di);
                expect(di_1.bloomFindPossibleInjector(di, 161, 0 /* Default */)).toEqual(di);
                expect(di_1.bloomFindPossibleInjector(di, 188, 0 /* Default */)).toEqual(di);
                expect(di_1.bloomFindPossibleInjector(di, 223, 0 /* Default */)).toEqual(di);
                expect(di_1.bloomFindPossibleInjector(di, 255, 0 /* Default */)).toEqual(di);
            });
        });
        it('should inject from parent view', function () {
            var ParentDirective = render_util_1.createDirective('parentDir');
            var ChildDirective = /** @class */ (function () {
                function ChildDirective(parent) {
                    this.parent = parent;
                    this.value = parent.constructor.name;
                }
                ChildDirective.ngDirectiveDef = index_1.defineDirective({
                    type: ChildDirective,
                    selectors: [['', 'childDir', '']],
                    factory: function () { return new ChildDirective(index_1.directiveInject(ParentDirective)); },
                    features: [index_1.PublicFeature],
                    exportAs: 'childDir'
                });
                return ChildDirective;
            }());
            var Child2Directive = /** @class */ (function () {
                function Child2Directive(parent, child) {
                    this.value = parent === child.parent;
                }
                Child2Directive.ngDirectiveDef = index_1.defineDirective({
                    selectors: [['', 'child2Dir', '']],
                    type: Child2Directive,
                    factory: function () { return new Child2Directive(index_1.directiveInject(ParentDirective), index_1.directiveInject(ChildDirective)); },
                    exportAs: 'child2Dir'
                });
                return Child2Directive;
            }());
            /**
             * <div parentDir>
             *    <span childDir child2Dir #child1="childDir" #child2="child2Dir">
             *      {{ child1.value }} - {{ child2.value }}
             *    </span>
             * </div>
             */
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'div', ['parentDir', '']);
                    {
                        instructions_1.container(1);
                    }
                    instructions_1.elementEnd();
                }
                if (rf & 2 /* Update */) {
                    instructions_1.containerRefreshStart(1);
                    {
                        var rf1 = instructions_1.embeddedViewStart(0);
                        if (rf1 & 1 /* Create */) {
                            instructions_1.elementStart(0, 'span', ['childDir', '', 'child2Dir', ''], ['child1', 'childDir', 'child2', 'child2Dir']);
                            {
                                instructions_1.text(3);
                            }
                            instructions_1.elementEnd();
                        }
                        var tmp1 = void 0;
                        var tmp2 = void 0;
                        if (rf & 2 /* Update */) {
                            tmp1 = instructions_1.load(1);
                            tmp2 = instructions_1.load(2);
                            instructions_1.textBinding(3, instructions_1.interpolation2('', tmp1.value, '-', tmp2.value, ''));
                        }
                        instructions_1.embeddedViewEnd();
                    }
                    instructions_1.containerRefreshEnd();
                }
            }
            var defs = [ChildDirective, Child2Directive, ParentDirective];
            expect(render_util_1.renderToHtml(Template, {}, defs))
                .toEqual('<div parentdir=""><span child2dir="" childdir="">Directive-true</span></div>');
        });
        it('should inject from module Injector', function () {
        });
    });
    describe('getOrCreateNodeInjector', function () {
        it('should handle initial undefined state', function () {
            var contentView = instructions_1.createLViewData(null, instructions_1.createTView(-1, null, null, null, null), null, 2 /* CheckAlways */);
            var oldView = instructions_1.enterView(contentView, null);
            try {
                var parent_1 = instructions_1.createLNode(0, 3 /* Element */, null, null, null, null);
                // Simulate the situation where the previous parent is not initialized.
                // This happens on first bootstrap because we don't init existing values
                // so that we have smaller HelloWorld.
                parent_1.tNode.parent = undefined;
                var injector = di_1.getOrCreateNodeInjector(); // TODO: Review use of `any` here (#19904)
                expect(injector).not.toBe(null);
            }
            finally {
                instructions_1.leaveView(oldView);
            }
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdC9yZW5kZXIzL2RpX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBMEo7QUFHMUosMkRBQTZEO0FBQzdELDJDQUFtSDtBQUNuSCxpREFBa007QUFDbE0sK0RBQThTO0FBTTlTLDZDQUF3SDtBQUV4SCxRQUFRLENBQUMsSUFBSSxFQUFFO0lBQ2IsUUFBUSxDQUFDLGlCQUFpQixFQUFFO1FBQzFCLEVBQUUsQ0FBQyxzQ0FBc0MsRUFBRTtZQUN6QztnQkFBQTtvQkFDRSxVQUFLLEdBQVcsU0FBUyxDQUFDO2dCQU81QixDQUFDO2dCQU5RLHdCQUFjLEdBQUcsdUJBQWUsQ0FBQztvQkFDdEMsSUFBSSxFQUFFLFNBQVM7b0JBQ2YsU0FBUyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUM1QixPQUFPLEVBQUUsY0FBTSxPQUFBLElBQUksU0FBUyxFQUFiLENBQWE7b0JBQzVCLFFBQVEsRUFBRSxLQUFLO2lCQUNoQixDQUFDLENBQUM7Z0JBQ0wsZ0JBQUM7YUFBQSxBQVJELElBUUM7WUFFRCxtREFBbUQ7WUFDbkQsa0JBQWtCLEVBQWUsRUFBRSxHQUFRO2dCQUN6QyxJQUFJLEVBQUUsaUJBQXFCLEVBQUU7b0JBQzNCLDJCQUFZLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUNwRDt3QkFBRSxtQkFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUFFO29CQUNaLHlCQUFVLEVBQUUsQ0FBQztpQkFDZDtnQkFDRCxJQUFJLEdBQVEsQ0FBQztnQkFDYixJQUFJLEVBQUUsaUJBQXFCLEVBQUU7b0JB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QyxDQUFDLENBQUMsQ0FBQztnQkFDdkQsYUFBUSxDQUFDLEVBQUUsRUFBRSxFQUFFLGlCQUFpQixFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQVMsQ0FBQyxDQUFDO2dCQUNuRCxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdkQsYUFBUSxDQUFDLEVBQUUsRUFBRSxFQUFFLGlCQUFpQixFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQVMsQ0FBQyxDQUFDO2dCQUNuRCxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdkQsYUFBUSxDQUFDLEVBQUUsRUFBRSxFQUFFLGlCQUFpQixFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQVMsQ0FBQyxDQUFDO2dCQUNuRCxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdkQsYUFBUSxDQUFDLEVBQUUsRUFBRSxFQUFFLGlCQUFpQixFQUFFLEdBQUcsR0FBRyxDQUFDLEVBQVMsQ0FBQyxDQUFDO2dCQUNwRCxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEQsYUFBUSxDQUFDLEVB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