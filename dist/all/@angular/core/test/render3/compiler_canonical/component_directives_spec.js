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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("../../../src/core");
var $r3$ = require("../../../src/core_render3_private_export");
var render_util_1 = require("../render_util");
/// See: `normative.md`
describe('components & directives', function () {
    it('should instantiate directives', function () {
        var log = [];
        var ChildComponent = /** @class */ (function () {
            function ChildComponent() {
                log.push('ChildComponent');
            }
            ChildComponent_1 = ChildComponent;
            var ChildComponent_1;
            // NORMATIVE
            ChildComponent.ngComponentDef = $r3$.ɵdefineComponent({
                type: ChildComponent_1,
                selectors: [['child']],
                factory: function ChildComponent_Factory() { return new ChildComponent_1(); },
                template: function ChildComponent_Template(rf, ctx) {
                    if (rf & 1) {
                        $r3$.ɵT(0, 'child-view');
                    }
                }
            });
            ChildComponent = ChildComponent_1 = __decorate([
                core_1.Component({ selector: 'child', template: 'child-view' }),
                __metadata("design:paramtypes", [])
            ], ChildComponent);
            return ChildComponent;
        }());
        var SomeDirective = /** @class */ (function () {
            function SomeDirective() {
                log.push('SomeDirective');
            }
            SomeDirective_1 = SomeDirective;
            var SomeDirective_1;
            // NORMATIVE
            SomeDirective.ngDirectiveDef = $r3$.ɵdefineDirective({
                type: SomeDirective_1,
                selectors: [['', 'some-directive', '']],
                factory: function () { return new SomeDirective_1(); },
            });
            SomeDirective = SomeDirective_1 = __decorate([
                core_1.Directive({
                    selector: '[some-directive]',
                }),
                __metadata("design:paramtypes", [])
            ], SomeDirective);
            return SomeDirective;
        }());
        // Important: keep arrays outside of function to not create new instances.
        // NORMATIVE
        var $e0_attrs$ = ['some-directive', ''];
        // /NORMATIVE
        var MyComponent = /** @class */ (function () {
            function MyComponent() {
            }
            MyComponent_1 = MyComponent;
            var MyComponent_1;
            // NORMATIVE
            MyComponent.ngComponentDef = $r3$.ɵdefineComponent({
                type: MyComponent_1,
                selectors: [['my-component']],
                factory: function () { return new MyComponent_1(); },
                template: function (rf, ctx) {
                    if (rf & 1) {
                        $r3$.ɵEe(0, 'child', $e0_attrs$);
                        $r3$.ɵT(1, '!');
                    }
                }
            });
            MyComponent = MyComponent_1 = __decorate([
                core_1.Component({ selector: 'my-component', template: "<child some-directive></child>!" })
            ], MyComponent);
            return MyComponent;
        }());
        // NON-NORMATIVE (done by defineNgModule)
        MyComponent.ngComponentDef.directiveDefs = [
            ChildComponent.ngComponentDef, SomeDirective.ngDirectiveDef
        ];
        // /NON-NORMATIVE
        expect(renderComp(MyComponent)).toEqual('<child some-directive="">child-view</child>!');
        expect(log).toEqual(['ChildComponent', 'SomeDirective']);
    });
    it('should support host bindings', function () {
        var HostBindingDir = /** @class */ (function () {
            function HostBindingDir() {
                this.dirId = 'some id';
                // /NORMATIVE
            }
            HostBindingDir_1 = HostBindingDir;
            var HostBindingDir_1;
            // NORMATIVE
            HostBindingDir.ngDirectiveDef = $r3$.ɵdefineDirective({
                type: HostBindingDir_1,
                selectors: [['', 'hostBindingDir', '']],
                factory: function HostBindingDir_Factory() { return new HostBindingDir_1(); },
                hostBindings: function HostBindingDir_HostBindings(dirIndex, elIndex) {
                    $r3$.ɵp(elIndex, 'id', $r3$.ɵb($r3$.ɵd(dirIndex).dirId));
                }
            });
            __decorate([
                core_1.HostBinding('id'),
                __metadata("design:type", Object)
            ], HostBindingDir.prototype, "dirId", void 0);
            HostBindingDir = HostBindingDir_1 = __decorate([
                core_1.Directive({ selector: '[hostBindingDir]' })
            ], HostBindingDir);
            return HostBindingDir;
        }());
        var $e0_attrs$ = ['hostBindingDir', ''];
        var MyApp = /** @class */ (function () {
            function MyApp() {
            }
            MyApp_1 = MyApp;
            var MyApp_1;
            MyApp.ngComponentDef = $r3$.ɵdefineComponent({
                type: MyApp_1,
                selectors: [['my-app']],
                factory: function MyApp_Factory() { return new MyApp_1(); },
                template: function MyApp_Template(rf, ctx) {
                    if (rf & 1) {
                        $r3$.ɵEe(0, 'div', $e0_attrs$);
                    }
                }
            });
            MyApp = MyApp_1 = __decorate([
                core_1.Component({
                    selector: 'my-app',
                    template: "\n        <div hostBindingDir></div>\n      "
                })
            ], MyApp);
            return MyApp;
        }());
        // NON-NORMATIVE (done by defineNgModule)
        MyApp.ngComponentDef.directiveDefs =
            [HostBindingDir.ngDirectiveDef];
        // /NON-NORMATIVE
        expect(renderComp(MyApp)).toEqual("<div hostbindingdir=\"\" id=\"some id\"></div>");
    });
    it('should support host listeners', function () {
        var HostListenerDir = /** @class */ (function () {
            function HostListenerDir() {
            }
            HostListenerDir_1 = HostListenerDir;
            HostListenerDir.prototype.onClick = function () { };
            var HostListenerDir_1;
            // NORMATIVE
            HostListenerDir.ngDirectiveDef = $r3$.ɵdefineDirective({
                selectors: [['', 'hostListenerDir', '']],
                type: HostListenerDir_1,
                factory: function HostListenerDir_Factory() {
                    var $dir$ = new HostListenerDir_1();
                    $r3$.ɵL('click', function HostListenerDir_click_Handler(event) { $dir$.onClick(); });
                    return $dir$;
                },
            });
            __decorate([
                core_1.HostListener('click'),
                __metadata("design:type", Function),
                __metadata("design:paramtypes", []),
                __metadata("design:returntype", void 0)
            ], HostListenerDir.prototype, "onClick", null);
            HostListenerDir = HostListenerDir_1 = __decorate([
                core_1.Directive({ selector: '[hostlistenerDir]' })
            ], HostListenerDir);
            return HostListenerDir;
        }());
        var $e0_attrs$ = ['hostListenerDir', ''];
        var MyApp = /** @class */ (function () {
            function MyApp() {
            }
            MyApp_2 = MyApp;
            var MyApp_2;
            MyApp.ngComponentDef = $r3$.ɵdefineComponent({
                type: MyApp_2,
                selectors: [['my-app']],
                factory: function MyApp_Factory() { return new MyApp_2(); },
                template: function MyApp_Template(rf, ctx) {
                    if (rf & 1) {
                        $r3$.ɵE(0, 'button', $e0_attrs$);
                        $r3$.ɵT(1, 'Click');
                        $r3$.ɵe();
                    }
                }
            });
            MyApp = MyApp_2 = __decorate([
                core_1.Component({
                    selector: 'my-app',
                    template: "\n        <button hostListenerDir>Click</button>\n      "
                })
            ], MyApp);
            return MyApp;
        }());
        // NON-NORMATIVE (done by defineNgModule)
        MyApp.ngComponentDef.directiveDefs =
            [HostListenerDir.ngDirectiveDef];
        // /NON-NORMATIVE
        expect(renderComp(MyApp)).toEqual("<button hostlistenerdir=\"\">Click</button>");
    });
    it('should support setting of host attributes', function () {
        var HostAttributeDir = /** @class */ (function () {
            function HostAttributeDir() {
            }
            HostAttributeDir_1 = HostAttributeDir;
            var HostAttributeDir_1;
            // NORMATIVE
            HostAttributeDir.ngDirectiveDef = $r3$.ɵdefineDirective({
                selectors: [['', 'hostAttributeDir', '']],
                type: HostAttributeDir_1,
                factory: function HostAttributeDir_Factory() { return new HostAttributeDir_1(); },
                attributes: ['role', 'listbox']
            });
            HostAttributeDir = HostAttributeDir_1 = __decorate([
                core_1.Directive({ selector: '[hostAttributeDir]', host: { 'role': 'listbox' } })
            ], HostAttributeDir);
            return HostAttributeDir;
        }());
        var $e0_attrs$ = ['hostAttributeDir', ''];
        var MyApp = /** @class */ (function () {
            function MyApp() {
            }
            MyApp_3 = MyApp;
            var MyApp_3;
            MyApp.ngComponentDef = $r3$.ɵdefineComponent({
                type: MyApp_3,
                selectors: [['my-app']],
                factory: function MyApp_Factory() { return new MyApp_3(); },
                template: function MyApp_Template(rf, ctx) {
                    if (rf & 1) {
                        $r3$.ɵEe(0, 'div', $e0_attrs$);
                    }
                }
            });
            MyApp = MyApp_3 = __decorate([
                core_1.Component({
                    selector: 'my-app',
                    template: "\n        <div hostAttributeDir></div>\n      "
                })
            ], MyApp);
            return MyApp;
        }());
        // NON-NORMATIVE (done by defineNgModule)
        MyApp.ngComponentDef.directiveDefs =
            [HostAttributeDir.ngDirectiveDef];
        // /NON-NORMATIVE
        expect(renderComp(MyApp)).toEqual("<div hostattributedir=\"\" role=\"listbox\"></div>");
    });
    it('should support bindings of host attributes', function () {
        var HostBindingDir = /** @class */ (function () {
            function HostBindingDir() {
                this.label = 'some label';
                // /NORMATIVE
            }
            HostBindingDir_2 = HostBindingDir;
            var HostBindingDir_2;
            // NORMATIVE
            HostBindingDir.ngDirectiveDef = $r3$.ɵdefineDirective({
                type: HostBindingDir_2,
                selectors: [['', 'hostBindingDir', '']],
                factory: function HostBindingDir_Factory() { return new HostBindingDir_2(); },
                hostBindings: function HostBindingDir_HostBindings(dirIndex, elIndex) {
                    $r3$.ɵa(elIndex, 'aria-label', $r3$.ɵb($r3$.ɵd(dirIndex).label));
                }
            });
            __decorate([
                core_1.HostBinding('attr.aria-label'),
                __metadata("design:type", Object)
            ], HostBindingDir.prototype, "label", void 0);
            HostBindingDir = HostBindingDir_2 = __decorate([
                core_1.Directive({ selector: '[hostBindingDir]' })
            ], HostBindingDir);
            return HostBindingDir;
        }());
        var $e0_attrs$ = ['hostBindingDir', ''];
        var MyApp = /** @class */ (function () {
            function MyApp() {
            }
            MyApp_4 = MyApp;
            var MyApp_4;
            MyApp.ngComponentDef = $r3$.ɵdefineComponent({
                type: MyApp_4,
                selectors: [['my-app']],
                factory: function MyApp_Factory() { return new MyApp_4(); },
                template: function MyApp_Template(rf, ctx) {
                    if (rf & 1) {
                        $r3$.ɵEe(0, 'div', $e0_attrs$);
                    }
                }
            });
            MyApp = MyApp_4 = __decorate([
                core_1.Component({
                    selector: 'my-app',
                    template: "\n        <div hostBindingDir></div>\n      "
                })
            ], MyApp);
            return MyApp;
        }());
        // NON-NORMATIVE (done by defineNgModule)
        MyApp.ngComponentDef.directiveDefs =
            [HostBindingDir.ngDirectiveDef];
        // /NON-NORMATIVE
        expect(renderComp(MyApp)).toEqual("<div aria-label=\"some label\" hostbindingdir=\"\"></div>");
    });
    it('should support onPush components', function () {
        var MyComp = /** @class */ (function () {
            function MyComp() {
            }
            MyComp_1 = MyComp;
            var MyComp_1;
            // NORMATIVE
            MyComp.ngComponentDef = $r3$.ɵdefineComponent({
                type: MyComp_1,
                selectors: [['my-comp']],
                factory: function MyComp_Factory() { return new MyComp_1(); },
                template: function MyComp_Template(rf, ctx) {
                    if (rf & 1) {
                        $r3$.ɵT(0);
                    }
                    $r3$.ɵt(0, $r3$.ɵb(ctx.name));
                },
                inputs: { name: 'name' },
                changeDetection: core_1.ChangeDetectionStrategy.OnPush
            });
            __decorate([
                core_1.Input(),
                __metadata("design:type", String)
            ], MyComp.prototype, "name", void 0);
            MyComp = MyComp_1 = __decorate([
                core_1.Component({
                    selector: 'my-comp',
                    template: "\n        {{ name }}\n      ",
                    changeDetection: core_1.ChangeDetectionStrategy.OnPush
                })
            ], MyComp);
            return MyComp;
        }());
        var MyApp = /** @class */ (function () {
            function MyApp() {
                this.name = 'some name';
            }
            MyApp_5 = MyApp;
            var MyApp_5;
            MyApp.ngComponentDef = $r3$.ɵdefineComponent({
                type: MyApp_5,
                selectors: [['my-app']],
                factory: function MyApp_Factory() { return new MyApp_5(); },
                template: function MyApp_Template(rf, ctx) {
                    if (rf & 1) {
                        $r3$.ɵEe(0, 'my-comp');
                    }
                    if (rf & 2) {
                        $r3$.ɵp(0, 'name', $r3$.ɵb(ctx.name));
                    }
                }
            });
            MyApp = MyApp_5 = __decorate([
                core_1.Component({
                    selector: 'my-app',
                    template: "\n        <my-comp [name]=\"name\"></my-comp>\n      "
                })
            ], MyApp);
            return MyApp;
        }());
        // NON-NORMATIVE (done by defineNgModule)
        MyApp.ngComponentDef.directiveDefs =
            [MyComp.ngComponentDef];
        // /NON-NORMATIVE
        expect(renderComp(MyApp)).toEqual("<my-comp>some name</my-comp>");
    });
    xit('should support structural directives', function () {
        var log = [];
        var IfDirective = /** @class */ (function () {
            function IfDirective(template) {
                log.push('ifDirective');
            }
            IfDirective_1 = IfDirective;
            var IfDirective_1;
            // NORMATIVE
            IfDirective.ngDirectiveDef = $r3$.ɵdefineDirective({
                type: IfDirective_1,
                selectors: [['', 'if', '']],
                factory: function () { return new IfDirective_1($r3$.ɵinjectTemplateRef()); },
            });
            IfDirective = IfDirective_1 = __decorate([
                core_1.Directive({
                    selector: '[if]',
                }),
                __metadata("design:paramtypes", [core_1.TemplateRef])
            ], IfDirective);
            return IfDirective;
        }());
        // Important: keep arrays outside of function to not create new instances.
        // NORMATIVE
        var $e0_locals$ = ['foo', ''];
        // /NORMATIVE
        var MyComponent = /** @class */ (function () {
            function MyComponent() {
                this.salutation = 'Hello';
                // /NORMATIVE
            }
            MyComponent_2 = MyComponent;
            var MyComponent_2;
            // NORMATIVE
            MyComponent.ngComponentDef = $r3$.ɵdefineComponent({
                type: MyComponent_2,
                selectors: [['my-component']],
                factory: function () { return new MyComponent_2(); },
                template: function (rf, ctx) {
                    if (rf & 1) {
                        $r3$.ɵE(0, 'ul', null, $e0_locals$);
                        $r3$.ɵC(2, C1, '', ['if', '']);
                        $r3$.ɵe();
                    }
                    var $foo$ = $r3$.ɵld(1);
                    if (rf & 2) {
                        $r3$.ɵcR(2);
                        $r3$.ɵcr();
                    }
                    function C1(rf1, ctx1) {
                        if (rf1 & 1) {
                            $r3$.ɵE(0, 'li');
                            $r3$.ɵT(1);
                            $r3$.ɵe();
                        }
                        if (rf1 & 2) {
                            $r3$.ɵt(1, $r3$.ɵi2('', ctx.salutation, ' ', $foo$, ''));
                        }
                    }
                }
            });
            MyComponent = MyComponent_2 = __decorate([
                core_1.Component({ selector: 'my-component', template: "<ul #foo><li *if>{{salutation}} {{foo}}</li></ul>" })
            ], MyComponent);
            return MyComponent;
        }());
        expect(renderComp(MyComponent)).toEqual('<child some-directive="">child-view</child>!');
        expect(log).toEqual(['ChildComponent', 'SomeDirective']);
    });
    describe('value composition', function () {
        var MyArrayComp = /** @class */ (function () {
            function MyArrayComp() {
            }
            MyArrayComp_1 = MyArrayComp;
            var MyArrayComp_1;
            MyArrayComp.ngComponentDef = $r3$.ɵdefineComponent({
                type: MyArrayComp_1,
                selectors: [['my-array-comp']],
                factory: function MyArrayComp_Factory() { return new MyArrayComp_1(); },
                template: function MyArrayComp_Template(rf, ctx) {
                    if (rf & 1) {
                        $r3$.ɵT(0);
                    }
                    if (rf & 2) {
                        $r3$.ɵt(0, $r3$.ɵi2('', ctx.names[0], ' ', ctx.names[1], ''));
                    }
                },
                inputs: { names: 'names' }
            });
            __decorate([
                core_1.Input(),
                __metadata("design:type", Array)
            ], MyArrayComp.prototype, "names", void 0);
            MyArrayComp = MyArrayComp_1 = __decorate([
                core_1.Component({
                    selector: 'my-array-comp',
                    template: "\n          {{ names[0] }} {{ names[1] }}\n      "
                })
            ], MyArrayComp);
            return MyArrayComp;
        }());
        it('should support array literals of constants', function () {
            // NORMATIVE
            var $e0_arr$ = ['Nancy', 'Bess'];
            // /NORMATIVE
            var MyApp = /** @class */ (function () {
                function MyApp() {
                }
                MyApp_6 = MyApp;
                var MyApp_6;
                // NORMATIVE
                MyApp.ngComponentDef = $r3$.ɵdefineComponent({
                    type: MyApp_6,
                    selectors: [['my-app']],
                    factory: function MyApp_Factory() { return new MyApp_6(); },
                    template: function MyApp_Template(rf, ctx) {
                        if (rf & 1) {
                            $r3$.ɵEe(0, 'my-array-comp');
                        }
                        if (rf & 2) {
                            $r3$.ɵp(0, 'names', rf & 1 ? $e0_arr$ : $r3$.ɵNC);
                        }
                    }
                });
                MyApp = MyApp_6 = __decorate([
                    core_1.Component({
                        selector: 'my-app',
                        template: "\n        <my-array-comp [names]=\"['Nancy', 'Bess']\"></my-array-comp>\n      "
                    })
                ], MyApp);
                return MyApp;
            }());
            // NON-NORMATIVE (done by defineNgModule)
            MyApp.ngComponentDef.directiveDefs =
                [MyArrayComp.ngComponentDef];
            // /NON-NORMATIVE
            expect(renderComp(MyApp)).toEqual("<my-array-comp>Nancy Bess</my-array-comp>");
        });
        it('should support array literals of constants inside function calls', function () {
            // NORMATIVE
            var $e0_ff$ = function () { return ['Nancy', 'Bess']; };
            // /NORMATIVE
            var MyApp = /** @class */ (function () {
                function MyApp() {
                }
                MyApp_7 = MyApp;
                MyApp.prototype.someFn = function (arr) {
                    arr[0] = arr[0].toUpperCase();
                    return arr;
                };
                var MyApp_7;
                // NORMATIVE
                MyApp.ngComponentDef = $r3$.ɵdefineComponent({
                    type: MyApp_7,
                    selectors: [['my-app']],
                    factory: function MyApp_Factory() { return new MyApp_7(); },
                    template: function MyApp_Template(rf, ctx) {
                        if (rf & 1) {
                            $r3$.ɵEe(0, 'my-array-comp');
                            $r3$.ɵrS(1);
                        }
                        if (rf & 2) {
                            $r3$.ɵp(0, 'names', $r3$.ɵb(ctx.someFn($r3$.ɵf0(1, $e0_ff$))));
                        }
                    }
                });
                MyApp = MyApp_7 = __decorate([
                    core_1.Component({
                        selector: 'my-app',
                        template: "\n          <my-array-comp [names]=\"someFn(['Nancy', 'Bess'])\"></my-array-comp>\n        "
                    })
                ], MyApp);
                return MyApp;
            }());
            // NON-NORMATIVE (done by defineNgModule)
            MyApp.ngComponentDef.directiveDefs =
                [MyArrayComp.ngComponentDef];
            // /NON-NORMATIVE
            expect(renderComp(MyApp)).toEqual("<my-array-comp>NANCY Bess</my-array-comp>");
        });
        it('should support array literals of constants inside expressions', function () {
            var MyComp = /** @class */ (function () {
                function MyComp() {
                }
                MyComp_2 = MyComp;
                var MyComp_2;
                MyComp.ngComponentDef = $r3$.ɵdefineComponent({
                    type: MyComp_2,
                    selectors: [['my-comp']],
                    factory: function MyComp_Factory() { return new MyComp_2(); },
                    template: function MyComp_Template(rf, ctx) {
                        if (rf & 1) {
                            $r3$.ɵT(0);
                        }
                        if (rf & 2) {
                            // clang-format wants to break this line by changing the second 'ɵ' to an invalid
                            // unicode sequence.
                            // clang-format off
                            $r3$.ɵt(0, $r3$.ɵb(ctx.num));
                            // clang-format on
                        }
                    },
                    inputs: { num: 'num' }
                });
                MyComp = MyComp_2 = __decorate([
                    core_1.Component({ selector: 'my-comp', template: "{{ num }}" })
                ], MyComp);
                return MyComp;
            }());
            // NORMATIVE
            var $e0_ff$ = function () { return ['Nancy', 'Bess']; };
            // /NORMATIVE
            var MyApp = /** @class */ (function () {
                function MyApp() {
                }
                MyApp_8 = MyApp;
                var MyApp_8;
                // NORMATIVE
                MyApp.ngComponentDef = $r3$.ɵdefineComponent({
                    type: MyApp_8,
                    selectors: [['my-app']],
                    factory: function MyApp_Factory() { return new MyApp_8(); },
                    template: function MyApp_Template(rf, ctx) {
                        if (rf & 1) {
                            $r3$.ɵEe(0, 'my-comp');
                            $r3$.ɵrS(1);
                        }
                        if (rf & 2) {
                            $r3$.ɵp(0, 'num', $r3$.ɵb($r3$.ɵf0(1, $e0_ff$).length + 1));
                        }
                    }
                });
                MyApp = MyApp_8 = __decorate([
                    core_1.Component({
                        selector: 'my-app',
                        template: "\n          <my-comp [num]=\"['Nancy', 'Bess'].length + 1\"></my-comp>\n        "
                    })
                ], MyApp);
                return MyApp;
            }());
            // NON-NORMATIVE (done by defineNgModule)
            MyApp.ngComponentDef.directiveDefs =
                [MyComp.ngComponentDef];
            // /NON-NORMATIVE
            expect(renderComp(MyApp)).toEqual("<my-comp>3</my-comp>");
        });
        it('should support array literals', function () {
            // NORMATIVE
            var $e0_ff$ = function (v) { return ['Nancy', v]; };
            // /NORMATIVE
            var MyApp = /** @class */ (function () {
                function MyApp() {
                    this.customName = 'Bess';
                    // /NORMATIVE
                }
                MyApp_9 = MyApp;
                var MyApp_9;
                // NORMATIVE
                MyApp.ngComponentDef = $r3$.ɵdefineComponent({
                    type: MyApp_9,
                    selectors: [['my-app']],
                    factory: function MyApp_Factory() { return new MyApp_9(); },
                    template: function MyApp_Template(rf, ctx) {
                        if (rf & 1) {
                            $r3$.ɵEe(0, 'my-array-comp');
                            $r3$.ɵrS(2);
                        }
                        if (rf & 2) {
                            $r3$.ɵp(0, 'names', $r3$.ɵb($r3$.ɵf1(2, $e0_ff$, ctx.customName)));
                        }
                    }
                });
                MyApp = MyApp_9 = __decorate([
                    core_1.Component({
                        selector: 'my-app',
                        template: "\n        <my-array-comp [names]=\"['Nancy', customName]\"></my-array-comp>\n      "
                    })
                ], MyApp);
                return MyApp;
            }());
            // NON-NORMATIVE (done by defineNgModule)
            MyApp.ngComponentDef.directiveDefs =
                [MyArrayComp.ngComponentDef];
            // /NON-NORMATIVE
            expect(renderComp(MyApp)).toEqual("<my-array-comp>Nancy Bess</my-array-comp>");
        });
        it('should support 9+ bindings in array literals', function () {
            var MyComp = /** @class */ (function () {
                function MyComp() {
                }
                MyComp_3 = MyComp;
                var MyComp_3;
                MyComp.ngComponentDef = $r3$.ɵdefineComponent({
                    type: MyComp_3,
                    selectors: [['my-comp']],
                    factory: function MyComp_Factory() { return new MyComp_3(); },
                    template: function MyComp_Template(rf, ctx) {
                        if (rf & 1) {
                            $r3$.ɵT(0);
                            $r3$.ɵT(1);
                            $r3$.ɵT(2);
                            $r3$.ɵT(3);
                            $r3$.ɵT(4);
                            $r3$.ɵT(5);
                            $r3$.ɵT(6);
                            $r3$.ɵT(7);
                            $r3$.ɵT(8);
                            $r3$.ɵT(9);
                            $r3$.ɵT(10);
                            $r3$.ɵT(11);
                        }
                        if (rf & 2) {
                            $r3$.ɵt(0, $r3$.ɵb(ctx.names[0]));
                            $r3$.ɵt(1, $r3$.ɵb(ctx.names[1]));
                            $r3$.ɵt(2, $r3$.ɵb(ctx.names[2]));
                            $r3$.ɵt(3, $r3$.ɵb(ctx.names[3]));
                            $r3$.ɵt(4, $r3$.ɵb(ctx.names[4]));
                            $r3$.ɵt(5, $r3$.ɵb(ctx.names[5]));
                            $r3$.ɵt(6, $r3$.ɵb(ctx.names[6]));
                            $r3$.ɵt(7, $r3$.ɵb(ctx.names[7]));
                            $r3$.ɵt(8, $r3$.ɵb(ctx.names[8]));
                            $r3$.ɵt(9, $r3$.ɵb(ctx.names[9]));
                            $r3$.ɵt(10, $r3$.ɵb(ctx.names[10]));
                            $r3$.ɵt(11, $r3$.ɵb(ctx.names[11]));
                        }
                    },
                    inputs: { names: 'names' }
                });
                __decorate([
                    core_1.Input(),
                    __metadata("design:type", Array)
                ], MyComp.prototype, "names", void 0);
                MyComp = MyComp_3 = __decorate([
                    core_1.Component({
                        selector: 'my-comp',
                        template: "\n          {{ names[0] }}\n          {{ names[1] }}\n          {{ names[3] }}\n          {{ names[4] }}\n          {{ names[5] }}\n          {{ names[6] }}\n          {{ names[7] }}\n          {{ names[8] }}\n          {{ names[9] }}\n          {{ names[10] }}\n          {{ names[11] }}\n        "
                    })
                ], MyComp);
                return MyComp;
            }());
            // NORMATIVE
            var $e0_ff$ = function (v0, v1, v2, v3, v4, v5, v6, v7, v8) { return ['start-', v0, v1, v2, v3, v4, '-middle-', v5, v6, v7, v8, '-end']; };
            // /NORMATIVE
            var MyApp = /** @class */ (function () {
                function MyApp() {
                    this.n0 = 'a';
                    this.n1 = 'b';
                    this.n2 = 'c';
                    this.n3 = 'd';
                    this.n4 = 'e';
                    this.n5 = 'f';
                    this.n6 = 'g';
                    this.n7 = 'h';
                    this.n8 = 'i';
                    // /NORMATIVE
                }
                MyApp_10 = MyApp;
                var MyApp_10;
                // NORMATIVE
                MyApp.ngComponentDef = $r3$.ɵdefineComponent({
                    type: MyApp_10,
                    selectors: [['my-app']],
                    factory: function MyApp_Factory() { return new MyApp_10(); },
                    template: function MyApp_Template(rf, c) {
                        if (rf & 1) {
                            $r3$.ɵEe(0, 'my-comp');
                            $r3$.ɵrS(10);
                        }
                        if (rf & 2) {
                            $r3$.ɵp(0, 'names', $r3$.ɵb($r3$.ɵfV(10, $e0_ff$, [c.n0, c.n1, c.n2, c.n3, c.n4, c.n5, c.n6, c.n7, c.n8])));
                        }
                    }
                });
                MyApp = MyApp_10 = __decorate([
                    core_1.Component({
                        selector: 'my-app',
                        template: "\n        <my-comp [names]=\"['start-', n0, n1, n2, n3, n4, '-middle-', n5, n6, n7, n8, '-end']\">\n        </my-comp>\n      "
                    })
                ], MyApp);
                return MyApp;
            }());
            // NON-NORMATIVE (done by defineNgModule)
            MyApp.ngComponentDef.directiveDefs =
                [MyComp.ngComponentDef];
            // /NON-NORMATIVE
            expect(renderComp(MyApp)).toEqual("<my-comp>start-abcde-middle-fghi-end</my-comp>");
        });
        it('should support object literals', function () {
            var ObjectComp = /** @class */ (function () {
                function ObjectComp() {
                }
                ObjectComp_1 = ObjectComp;
                var ObjectComp_1;
                ObjectComp.ngComponentDef = $r3$.ɵdefineComponent({
                    type: ObjectComp_1,
                    selectors: [['object-comp']],
                    factory: function ObjectComp_Factory() { return new ObjectComp_1(); },
                    template: function ObjectComp_Template(rf, ctx) {
                        if (rf & 1) {
                            $r3$.ɵE(0, 'p');
                            $r3$.ɵT(1);
                            $r3$.ɵe();
                            $r3$.ɵE(2, 'p');
                            $r3$.ɵT(3);
                            $r3$.ɵe();
                        }
                        if (rf & 2) {
                            $r3$.ɵt(1, $r3$.ɵb(ctx.config['duration']));
                            $r3$.ɵt(3, $r3$.ɵb(ctx.config.animation));
                        }
                    },
                    inputs: { config: 'config' }
                });
                ObjectComp = ObjectComp_1 = __decorate([
                    core_1.Component({
                        selector: 'object-comp',
                        template: "\n          <p> {{ config['duration'] }} </p>\n          <p> {{ config.animation }} </p>\n        "
                    })
                ], ObjectComp);
                return ObjectComp;
            }());
            // NORMATIVE
            var $e0_ff$ = function (v) { return { 'duration': 500, animation: v }; };
            // /NORMATIVE
            var MyApp = /** @class */ (function () {
                function MyApp() {
                    this.name = 'slide';
                    // /NORMATIVE
                }
                MyApp_11 = MyApp;
                var MyApp_11;
                // NORMATIVE
                MyApp.ngComponentDef = $r3$.ɵdefineComponent({
                    type: MyApp_11,
                    selectors: [['my-app']],
                    factory: function MyApp_Factory() { return new MyApp_11(); },
                    template: function MyApp_Template(rf, ctx) {
                        if (rf & 1) {
                            $r3$.ɵEe(0, 'object-comp');
                            $r3$.ɵrS(2);
                        }
                        if (rf & 2) {
                            $r3$.ɵp(0, 'config', $r3$.ɵb($r3$.ɵf1(2, $e0_ff$, ctx.name)));
                        }
                    }
                });
                MyApp = MyApp_11 = __decorate([
                    core_1.Component({
                        selector: 'my-app',
                        template: "\n        <object-comp [config]=\"{'duration': 500, animation: name}\"></object-comp>\n      "
                    })
                ], MyApp);
                return MyApp;
            }());
            // NON-NORMATIVE (done by defineNgModule)
            MyApp.ngComponentDef.directiveDefs =
                [ObjectComp.ngComponentDef];
            // /NON-NORMATIVE
            expect(renderComp(MyApp)).toEqual("<object-comp><p>500</p><p>slide</p></object-comp>");
        });
        it('should support expressions nested deeply in object/array literals', function () {
            var NestedComp = /** @class */ (function () {
                function NestedComp() {
                }
                NestedComp_1 = NestedComp;
                var NestedComp_1;
                NestedComp.ngComponentDef = $r3$.ɵdefineComponent({
                    type: NestedComp_1,
                    selectors: [['nested-comp']],
                    factory: function NestedComp_Factory() { return new NestedComp_1(); },
                    template: function NestedComp_Template(rf, ctx) {
                        if (rf & 1) {
                            $r3$.ɵE(0, 'p');
                            $r3$.ɵT(1);
                            $r3$.ɵe();
                            $r3$.ɵE(2, 'p');
                            $r3$.ɵT(3);
                            $r3$.ɵe();
                            $r3$.ɵE(4, 'p');
                            $r3$.ɵT(5);
                            $r3$.ɵe();
                        }
                        if (rf & 2) {
                            $r3$.ɵt(1, $r3$.ɵb(ctx.config.animation));
                            $r3$.ɵt(3, $r3$.ɵb(ctx.config.actions[0].opacity));
                            $r3$.ɵt(5, $r3$.ɵb(ctx.config.actions[1].duration));
                        }
                    },
                    inputs: { config: 'config' }
                });
                NestedComp = NestedComp_1 = __decorate([
                    core_1.Component({
                        selector: 'nested-comp',
                        template: "\n          <p> {{ config.animation }} </p>\n          <p> {{config.actions[0].opacity }} </p>\n          <p> {{config.actions[1].duration }} </p>\n        "
                    })
                ], NestedComp);
                return NestedComp;
            }());
            // NORMATIVE
            var $e0_ff$ = function (v) { return { opacity: 1, duration: v }; };
            var $c0$ = { opacity: 0, duration: 0 };
            var $e0_ff_1$ = function (v) { return [$c0$, v]; };
            var $e0_ff_2$ = function (v1, v2) { return { animation: v1, actions: v2 }; };
            // /NORMATIVE
            var MyApp = /** @class */ (function () {
                function MyApp() {
                    this.name = 'slide';
                    this.duration = 100;
                    // /NORMATIVE
                }
                MyApp_12 = MyApp;
                var MyApp_12;
                // NORMATIVE
                MyApp.ngComponentDef = $r3$.ɵdefineComponent({
                    type: MyApp_12,
                    selectors: [['my-app']],
                    factory: function MyApp_Factory() { return new MyApp_12(); },
                    template: function MyApp_Template(rf, ctx) {
                        if (rf & 1) {
                            $r3$.ɵEe(0, 'nested-comp');
                            $r3$.ɵrS(7);
                        }
                        if (rf & 2) {
                            $r3$.ɵp(0, 'config', $r3$.ɵb($r3$.ɵf2(7, $e0_ff_2$, ctx.name, $r3$.ɵf1(4, $e0_ff_1$, $r3$.ɵf1(2, $e0_ff$, ctx.duration)))));
                        }
                    }
                });
                MyApp = MyApp_12 = __decorate([
                    core_1.Component({
                        selector: 'my-app',
                        template: "\n        <nested-comp [config]=\"{animation: name, actions: [{ opacity: 0, duration: 0}, {opacity: 1, duration: duration }]}\">\n        </nested-comp>\n      "
                    })
                ], MyApp);
                return MyApp;
            }());
            // NON-NORMATIVE (done by defineNgModule)
            MyApp.ngComponentDef.directiveDefs =
                [NestedComp.ngComponentDef];
            // /NON-NORMATIVE
            expect(renderComp(MyApp))
                .toEqual("<nested-comp><p>slide</p><p>0</p><p>100</p></nested-comp>");
        });
    });
});
function renderComp(type) {
    return render_util_1.toHtml(render_util_1.renderComponent(type));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcG9uZW50X2RpcmVjdGl2ZXNfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdC9yZW5kZXIzL2NvbXBpbGVyX2Nhbm9uaWNhbC9jb21wb25lbnRfZGlyZWN0aXZlc19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7O0FBRUgsMENBQXNUO0FBQ3RULCtEQUFpRTtBQUVqRSw4Q0FBdUQ7QUFJdkQsdUJBQXVCO0FBQ3ZCLFFBQVEsQ0FBQyx5QkFBeUIsRUFBRTtJQUtsQyxFQUFFLENBQUMsK0JBQStCLEVBQUU7UUFJbEMsSUFBTSxHQUFHLEdBQWEsRUFBRSxDQUFDO1FBRXpCO1lBQ0U7Z0JBQWdCLEdBQUcsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUFDLENBQUM7K0JBRHpDLGNBQWM7O1lBRWxCLFlBQVk7WUFDTCw2QkFBYyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztnQkFDNUMsSUFBSSxFQUFFLGdCQUFjO2dCQUNwQixTQUFTLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUN0QixPQUFPLEVBQUUsb0NBQW9DLE9BQU8sSUFBSSxnQkFBYyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUMzRSxRQUFRLEVBQUUsaUNBQWlDLEVBQWlCLEVBQUUsR0FBcUI7b0JBQ2pGLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRTt3QkFDVixJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxZQUFZLENBQUMsQ0FBQztxQkFDMUI7Z0JBQ0gsQ0FBQzthQUNGLENBQUMsQ0FBQztZQVpDLGNBQWM7Z0JBRG5CLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUMsQ0FBQzs7ZUFDakQsY0FBYyxDQWNuQjtZQUFELHFCQUFDO1NBQUEsQUFkRCxJQWNDO1FBS0Q7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Q0FBQyxDQUFDOzRCQUNYLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ1gsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDWCxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUNYLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ1gsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDWCxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDOzRCQUNaLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7eUJBQ2I7d0JBQ0QsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFOzRCQUNWLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ2xDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ2xDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ2xDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ2xDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ2xDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMs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