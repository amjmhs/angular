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
var core_1 = require("@angular/core");
var component_factory_resolver_1 = require("@angular/core/src/linker/component_factory_resolver");
var testing_1 = require("@angular/core/testing");
var console_1 = require("../../src/console");
{
    describe('jit', function () { declareTests({ useJit: true }); });
    describe('no jit', function () { declareTests({ useJit: false }); });
}
var DummyConsole = /** @class */ (function () {
    function DummyConsole() {
        this.warnings = [];
    }
    DummyConsole.prototype.log = function (message) { };
    DummyConsole.prototype.warn = function (message) { this.warnings.push(message); };
    return DummyConsole;
}());
function declareTests(_a) {
    var useJit = _a.useJit;
    describe('@Component.entryComponents', function () {
        var console;
        beforeEach(function () {
            console = new DummyConsole();
            testing_1.TestBed.configureCompiler({ useJit: useJit, providers: [{ provide: console_1.Console, useValue: console }] });
            testing_1.TestBed.configureTestingModule({ declarations: [MainComp, ChildComp, NestedChildComp] });
        });
        it('should resolve ComponentFactories from the same component', function () {
            var compFixture = testing_1.TestBed.createComponent(MainComp);
            var mainComp = compFixture.componentInstance;
            expect(compFixture.componentRef.injector.get(core_1.ComponentFactoryResolver)).toBe(mainComp.cfr);
            var cf = mainComp.cfr.resolveComponentFactory(ChildComp);
            expect(cf.componentType).toBe(ChildComp);
        });
        it('should resolve ComponentFactories via ANALYZE_FOR_ENTRY_COMPONENTS', function () {
            testing_1.TestBed.resetTestingModule();
            testing_1.TestBed.configureTestingModule({ declarations: [CompWithAnalyzeEntryComponentsProvider, NestedChildComp, ChildComp] });
            var compFixture = testing_1.TestBed.createComponent(CompWithAnalyzeEntryComponentsProvider);
            var mainComp = compFixture.componentInstance;
            var cfr = compFixture.componentRef.injector.get(core_1.ComponentFactoryResolver);
            expect(cfr.resolveComponentFactory(ChildComp).componentType).toBe(ChildComp);
            expect(cfr.resolveComponentFactory(NestedChildComp).componentType).toBe(NestedChildComp);
        });
        it('should be able to get a component form a parent component (view hierarchy)', function () {
            testing_1.TestBed.overrideComponent(MainComp, { set: { template: '<child></child>' } });
            var compFixture = testing_1.TestBed.createComponent(MainComp);
            var childCompEl = compFixture.debugElement.children[0];
            var childComp = childCompEl.componentInstance;
            // declared on ChildComp directly
            expect(childComp.cfr.resolveComponentFactory(NestedChildComp).componentType)
                .toBe(NestedChildComp);
            // inherited from MainComp
            expect(childComp.cfr.resolveComponentFactory(ChildComp).componentType).toBe(ChildComp);
        });
        it('should not be able to get components from a parent component (content hierarchy)', function () {
            testing_1.TestBed.overrideComponent(MainComp, { set: { template: '<child><nested></nested></child>' } });
            testing_1.TestBed.overrideComponent(ChildComp, { set: { template: '<ng-content></ng-content>' } });
            var compFixture = testing_1.TestBed.createComponent(MainComp);
            var nestedChildCompEl = compFixture.debugElement.children[0].children[0];
            var nestedChildComp = nestedChildCompEl.componentInstance;
            expect(nestedChildComp.cfr.resolveComponentFactory(ChildComp).componentType)
                .toBe(ChildComp);
            expect(function () { return nestedChildComp.cfr.resolveComponentFactory(NestedChildComp); })
                .toThrow(component_factory_resolver_1.noComponentFactoryError(NestedChildComp));
        });
    });
}
var NestedChildComp = /** @class */ (function () {
    function NestedChildComp(cfr) {
        this.cfr = cfr;
    }
    NestedChildComp = __decorate([
        core_1.Component({ selector: 'nested', template: '' }),
        __metadata("design:paramtypes", [core_1.ComponentFactoryResolver])
    ], NestedChildComp);
    return NestedChildComp;
}());
var ChildComp = /** @class */ (function () {
    function ChildComp(cfr) {
        this.cfr = cfr;
    }
    ChildComp = __decorate([
        core_1.Component({ selector: 'child', entryComponents: [NestedChildComp], template: '' }),
        __metadata("design:paramtypes", [core_1.ComponentFactoryResolver])
    ], ChildComp);
    return ChildComp;
}());
var MainComp = /** @class */ (function () {
    function MainComp(cfr) {
        this.cfr = cfr;
    }
    MainComp = __decorate([
        core_1.Component({
            selector: 'main',
            entryComponents: [ChildComp],
            template: '',
        }),
        __metadata("design:paramtypes", [core_1.ComponentFactoryResolver])
    ], MainComp);
    return MainComp;
}());
var CompWithAnalyzeEntryComponentsProvider = /** @class */ (function () {
    function CompWithAnalyzeEntryComponentsProvider() {
    }
    CompWithAnalyzeEntryComponentsProvider = __decorate([
        core_1.Component({
            selector: 'comp-with-analyze',
            template: '',
            providers: [{
                    provide: core_1.ANALYZE_FOR_ENTRY_COMPONENTS,
                    multi: true,
                    useValue: [
                        { a: 'b', component: ChildComp },
                        { b: 'c', anotherComponent: NestedChildComp },
                    ]
                }]
        })
    ], CompWithAnalyzeEntryComponentsProvider);
    return CompWithAnalyzeEntryComponentsProvider;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50cnlfY29tcG9uZW50c19pbnRlZ3JhdGlvbl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L2xpbmtlci9lbnRyeV9jb21wb25lbnRzX2ludGVncmF0aW9uX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBZ0c7QUFDaEcsa0dBQTRGO0FBQzVGLGlEQUE4QztBQUU5Qyw2Q0FBMEM7QUFHMUM7SUFDRSxRQUFRLENBQUMsS0FBSyxFQUFFLGNBQVEsWUFBWSxDQUFDLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN6RCxRQUFRLENBQUMsUUFBUSxFQUFFLGNBQVEsWUFBWSxDQUFDLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztDQUM5RDtBQUVEO0lBQUE7UUFDUyxhQUFRLEdBQWEsRUFBRSxDQUFDO0lBSWpDLENBQUM7SUFGQywwQkFBRyxHQUFILFVBQUksT0FBZSxJQUFHLENBQUM7SUFDdkIsMkJBQUksR0FBSixVQUFLLE9BQWUsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEQsbUJBQUM7QUFBRCxDQUFDLEFBTEQsSUFLQztBQUVELHNCQUFzQixFQUEyQjtRQUExQixrQkFBTTtJQUMzQixRQUFRLENBQUMsNEJBQTRCLEVBQUU7UUFDckMsSUFBSSxPQUFxQixDQUFDO1FBQzFCLFVBQVUsQ0FBQztZQUNULE9BQU8sR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1lBQzdCLGlCQUFPLENBQUMsaUJBQWlCLENBQ3JCLEVBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxpQkFBTyxFQUFF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