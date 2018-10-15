"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var angular = require("@angular/upgrade/src/common/angular1");
var downgrade_component_adapter_1 = require("@angular/upgrade/src/common/downgrade_component_adapter");
var test_helpers_1 = require("./test_helpers");
test_helpers_1.withEachNg1Version(function () {
    describe('DowngradeComponentAdapter', function () {
        describe('groupNodesBySelector', function () {
            it('should return an array of node collections for each selector', function () {
                var contentNodes = test_helpers_1.nodes('<div class="x"><span>div-1 content</span></div>' +
                    '<input type="number" name="myNum">' +
                    '<input type="date" name="myDate">' +
                    '<span>span content</span>' +
                    '<div class="x"><span>div-2 content</span></div>');
                var selectors = ['input[type=date]', 'span', '.x'];
                var projectableNodes = downgrade_component_adapter_1.groupNodesBySelector(selectors, contentNodes);
                expect(projectableNodes[0]).toEqual(test_helpers_1.nodes('<input type="date" name="myDate">'));
                expect(projectableNodes[1]).toEqual(test_helpers_1.nodes('<span>span content</span>'));
                expect(projectableNodes[2])
                    .toEqual(test_helpers_1.nodes('<div class="x"><span>div-1 content</span></div>' +
                    '<div class="x"><span>div-2 content</span></div>'));
            });
            it('should collect up unmatched nodes for the wildcard selector', function () {
                var contentNodes = test_helpers_1.nodes('<div class="x"><span>div-1 content</span></div>' +
                    '<input type="number" name="myNum">' +
                    '<input type="date" name="myDate">' +
                    '<span>span content</span>' +
                    '<div class="x"><span>div-2 content</span></div>');
                var selectors = ['.x', '*', 'input[type=date]'];
                var projectableNodes = downgrade_component_adapter_1.groupNodesBySelector(selectors, contentNodes);
                expect(projectableNodes[0])
                    .toEqual(test_helpers_1.nodes('<div class="x"><span>div-1 content</span></div>' +
                    '<div class="x"><span>div-2 content</span></div>'));
                expect(projectableNodes[1])
                    .toEqual(test_helpers_1.nodes('<input type="number" name="myNum">' +
                    '<span>span content</span>'));
                expect(projectableNodes[2]).toEqual(test_helpers_1.nodes('<input type="date" name="myDate">'));
            });
            it('should return an array of empty arrays if there are no nodes passed in', function () {
                var selectors = ['.x', '*', 'input[type=date]'];
                var projectableNodes = downgrade_component_adapter_1.groupNodesBySelector(selectors, []);
                expect(projectableNodes).toEqual([[], [], []]);
            });
            it('should return an empty array for each selector that does not match', function () {
                var contentNodes = test_helpers_1.nodes('<div class="x"><span>div-1 content</span></div>' +
                    '<input type="number" name="myNum">' +
                    '<input type="date" name="myDate">' +
                    '<span>span content</span>' +
                    '<div class="x"><span>div-2 content</span></div>');
                var projectableNodes = downgrade_component_adapter_1.groupNodesBySelector([], contentNodes);
                expect(projectableNodes).toEqual([]);
                var noMatchSelectorNodes = downgrade_component_adapter_1.groupNodesBySelector(['.not-there'], contentNodes);
                expect(noMatchSelectorNodes).toEqual([[]]);
            });
        });
        describe('testability', function () {
            var adapter;
            var content;
            var compiler;
            var registry;
            var element;
            var mockScope = /** @class */ (function () {
                function mockScope() {
                    this.destroyListeners = [];
                    this.$id = 'mockScope';
                }
                mockScope.prototype.$new = function () { return this; };
                mockScope.prototype.$watch = function (exp, fn) {
                    return function () { };
                };
                mockScope.prototype.$on = function (event, fn) {
                    if (event === '$destroy' && fn) {
                        this.destroyListeners.push(fn);
                    }
                    return function () { };
                };
                mockScope.prototype.$destroy = function () {
                    var listener;
                    while ((listener = this.destroyListeners.shift()))
                        listener();
                };
                mockScope.prototype.$apply = function (exp) {
                    return function () { };
                };
                mockScope.prototype.$digest = function () {
                    return function () { };
                };
                mockScope.prototype.$evalAsync = function (exp, locals) {
                    return function () { };
                };
                return mockScope;
            }());
            function getAdaptor() {
                var attrs = undefined;
                var scope; // mock
                var ngModel = undefined;
                var parentInjector; // testbed
                var $injector = undefined;
                var $compile = undefined;
                var $parse = undefined;
                var componentFactory; // testbed
                var wrapCallback = function (cb) { return cb; };
                content = "\n          <h1> new component </h1>\n          <div> a great component </div>\n          <comp></comp>\n        ";
                element = angular.element(content);
                scope = new mockScope();
                var NewComponent = /** @class */ (function () {
                    function NewComponent() {
                    }
                    NewComponent = __decorate([
                        core_1.Component({
                            selector: 'comp',
                            template: '',
                        })
                    ], NewComponent);
                    return NewComponent;
                }());
                var NewModule = /** @class */ (function () {
                    function NewModule() {
                    }
                    NewModule = __decorate([
                        core_1.NgModule({
                            providers: [{ provide: 'hello', useValue: 'component' }],
                            declarations: [NewComponent],
                            entryComponents: [NewComponent],
                        })
                    ], NewModule);
                    return NewModule;
                }());
                var modFactory = compiler.compileModuleSync(NewModule);
                var module = modFactory.create(testing_1.TestBed);
                componentFactory = module.componentFactoryResolver.resolveComponentFactory(NewComponent);
                parentInjector = testing_1.TestBed;
                return new downgrade_component_adapter_1.DowngradeComponentAdapter(element, attrs, scope, ngModel, parentInjector, $injector, $compile, $parse, componentFactory, wrapCallback);
            }
            beforeEach(function () {
                compiler = testing_1.TestBed.get(core_1.Compiler);
                registry = testing_1.TestBed.get(core_1.TestabilityRegistry);
                adapter = getAdaptor();
            });
            beforeEach(function () { return registry.unregisterAllApplications(); });
            afterEach(function () { return registry.unregisterAllApplications(); });
            it('should add testabilities hook when creating components', function () {
                var registry = testing_1.TestBed.get(core_1.TestabilityRegistry);
                adapter.createComponent([]);
                expect(registry.getAllTestabilities().length).toEqual(1);
                adapter = getAdaptor(); // get a new adaptor to creat a new component
                adapter.createComponent([]);
                expect(registry.getAllTestabilities().length).toEqual(2);
            });
            it('should remove the testability hook when destroy a component', function () {
                var registry = testing_1.TestBed.get(core_1.TestabilityRegistry);
                expect(registry.getAllTestabilities().length).toEqual(0);
                adapter.createComponent([]);
                expect(registry.getAllTestabilities().length).toEqual(1);
                adapter.registerCleanup();
                element.remove();
                expect(registry.getAllTestabilities().length).toEqual(0);
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG93bmdyYWRlX2NvbXBvbmVudF9hZGFwdGVyX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy91cGdyYWRlL3Rlc3QvY29tbW9uL2Rvd25ncmFkZV9jb21wb25lbnRfYWRhcHRlcl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsc0NBQTZHO0FBQzdHLGlEQUE4QztBQUM5Qyw4REFBZ0U7QUFDaEUsdUdBQXdIO0FBRXhILCtDQUF5RDtBQUV6RCxpQ0FBa0IsQ0FBQztJQUNqQixRQUFRLENBQUMsMkJBQTJCLEVBQUU7UUFDcEMsUUFBUSxDQUFDLHNCQUFzQixFQUFFO1lBQy9CLEVBQUUsQ0FBQyw4REFBOEQsRUFBRTtnQkFDakUsSUFBTSxZQUFZLEdBQUcsb0JBQUssQ0FDdEIsaURBQWlEO29CQUNqRCxvQ0FBb0M7b0JBQ3BDLG1DQUFtQztvQkFDbkMsMkJBQTJCO29CQUMzQixpREFBaUQsQ0FBQyxDQUFDO2dCQUV2RCxJQUFNLFNBQVMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDckQsSUFBTSxnQkFBZ0IsR0FBRyxrREFBb0IsQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLENBQUM7Z0JBQ3ZFLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxvQkFBSyxDQUFDLG1DQUFtQyxDQUFDLENBQUMsQ0FBQztnQkFDaEYsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLG9CQUFLLENBQUMsMkJBQTJCLENBQUMsQ0FBQyxDQUFDO2dCQUN4RSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ3RCLE9BQU8sQ0FBQyxvQkFBSyxDQUNWLGlEQUFpRDtvQkFDakQsaURBQWlELENBQUMsQ0FB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