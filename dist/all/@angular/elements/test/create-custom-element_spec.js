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
var platform_browser_1 = require("@angular/platform-browser");
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var rxjs_1 = require("rxjs");
var create_custom_element_1 = require("../src/create-custom-element");
if (typeof customElements !== 'undefined') {
    describe('createCustomElement', function () {
        var NgElementCtor;
        var strategy;
        var strategyFactory;
        var injector;
        beforeAll(function (done) {
            core_1.destroyPlatform();
            platform_browser_dynamic_1.platformBrowserDynamic()
                .bootstrapModule(TestModule)
                .then(function (ref) {
                injector = ref.injector;
                strategyFactory = new TestStrategyFactory();
                strategy = strategyFactory.testStrategy;
                NgElementCtor = create_custom_element_1.createCustomElement(TestComponent, { injector: injector, strategyFactory: strategyFactory });
                // The `@webcomponents/custom-elements/src/native-shim.js` polyfill allows us to create
                // new instances of the NgElement which extends HTMLElement, as long as we define it.
                customElements.define('test-element', NgElementCtor);
            })
                .then(done, done.fail);
        });
        afterAll(function () { return core_1.destroyPlatform(); });
        it('should use a default strategy for converting component inputs', function () {
            expect(NgElementCtor.observedAttributes).toEqual(['foo-foo', 'barbar']);
        });
        it('should send input values from attributes when connected', function () {
            var element = new NgElementCtor(injector);
            element.setAttribute('foo-foo', 'value-foo-foo');
            element.setAttribute('barbar', 'value-barbar');
            element.connectedCallback();
            expect(strategy.connectedElement).toBe(element);
            expect(strategy.getInputValue('fooFoo')).toBe('value-foo-foo');
            expect(strategy.getInputValue('barBar')).toBe('value-barbar');
        });
        it('should listen to output events after connected', function () {
            var element = new NgElementCtor(injector);
            element.connectedCallback();
            var eventValue = null;
            element.addEventListener('some-event', function (e) { return eventValue = e.detail; });
            strategy.events.next({ name: 'some-event', value: 'event-value' });
            expect(eventValue).toEqual('event-value');
        });
        it('should not listen to output events after disconnected', function () {
            var element = new NgElementCtor(injector);
            element.connectedCallback();
            element.disconnectedCallback();
            expect(strategy.disconnectCalled).toBe(true);
            var eventValue = null;
            element.addEventListener('some-event', function (e) { return eventValue = e.detail; });
            strategy.events.next({ name: 'some-event', value: 'event-value' });
            expect(eventValue).toEqual(null);
        });
        it('should properly set getters/setters on the element', function () {
            var element = new NgElementCtor(injector);
            element.fooFoo = 'foo-foo-value';
            element.barBar = 'barBar-value';
            expect(strategy.inputs.get('fooFoo')).toBe('foo-foo-value');
            expect(strategy.inputs.get('barBar')).toBe('barBar-value');
        });
    });
}
// Helpers
var TestComponent = /** @class */ (function () {
    function TestComponent() {
        this.fooFoo = 'foo';
        this.bazBaz = new core_1.EventEmitter();
        this.quxQux = new core_1.EventEmitter();
    }
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], TestComponent.prototype, "fooFoo", void 0);
    __decorate([
        core_1.Input('barbar'),
        __metadata("design:type", String)
    ], TestComponent.prototype, "barBar", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], TestComponent.prototype, "bazBaz", void 0);
    __decorate([
        core_1.Output('quxqux'),
        __metadata("design:type", Object)
    ], TestComponent.prototype, "quxQux", void 0);
    TestComponent = __decorate([
        core_1.Component({
            selector: 'test-component',
            template: 'TestComponent|foo({{ fooFoo }})|bar({{ barBar }})',
        })
    ], TestComponent);
    return TestComponent;
}());
var TestModule = /** @class */ (function () {
    function TestModule() {
    }
    TestModule.prototype.ngDoBootstrap = function () { };
    TestModule = __decorate([
        core_1.NgModule({
            imports: [platform_browser_1.BrowserModule],
            declarations: [TestComponent],
            entryComponents: [TestComponent],
        })
    ], TestModule);
    return TestModule;
}());
var TestStrategy = /** @class */ (function () {
    function TestStrategy() {
        this.connectedElement = null;
        this.disconnectCalled = false;
        this.inputs = new Map();
        this.events = new rxjs_1.Subject();
    }
    TestStrategy.prototype.connect = function (element) { this.connectedElement = element; };
    TestStrategy.prototype.disconnect = function () { this.disconnectCalled = true; };
    TestStrategy.prototype.getInputValue = function (propName) { return this.inputs.get(propName); };
    TestStrategy.prototype.setInputValue = function (propName, value) { this.inputs.set(propName, value); };
    return TestStrategy;
}());
exports.TestStrategy = TestStrategy;
var TestStrategyFactory = /** @class */ (function () {
    function TestStrategyFactory() {
        this.testStrategy = new TestStrategy();
    }
    TestStrategyFactory.prototype.create = function () { return this.testStrategy; };
    return TestStrategyFactory;
}());
exports.TestStrategyFactory = TestStrategyFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLWN1c3RvbS1lbGVtZW50X3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9lbGVtZW50cy90ZXN0L2NyZWF0ZS1jdXN0b20tZWxlbWVudF9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7O0FBRUgsc0NBQTBHO0FBQzFHLDhEQUF3RDtBQUN4RCw4RUFBeUU7QUFDekUsNkJBQTZCO0FBRTdCLHNFQUF1RjtBQVF2RixJQUFJLE9BQU8sY0FBYyxLQUFLLFdBQVcsRUFBRTtJQUN6QyxRQUFRLENBQUMscUJBQXFCLEVBQUU7UUFDOUIsSUFBSSxhQUErQyxDQUFDO1FBQ3BELElBQUksUUFBc0IsQ0FBQztRQUMzQixJQUFJLGVBQW9DLENBQUM7UUFDekMsSUFBSSxRQUFrQixDQUFDO1FBRXZCLFNBQVMsQ0FBQyxVQUFBLElBQUk7WUFDWixzQkFBZSxFQUFFLENBQUM7WUFDbEIsaURBQXNCLEVBQUU7aUJBQ25CLGVBQWUsQ0FBQyxVQUFVLENBQUM7aUJBQzNCLElBQUksQ0FBQyxVQUFBLEdBQUc7Z0JBQ1AsUUFBUSxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUM7Z0JBQ3hCLGVBQWUsR0FBRyxJQUFJLG1CQUFtQixFQUFFLENBQUM7Z0JBQzVDLFFBQVEsR0FBRyxlQUFlLENBQUMsWUFBWSxDQUFDO2dCQUV4QyxhQUFhLEdBQUcsMkNBQW1CLENBQUMsYUFBYSxFQUFFLEVBQUMsUUFBUSxVQUFBLEVBQUUsZUFBZSxpQkFBQSxFQUFDLENBQUMsQ0FBQztnQkFFaEYsdUZBQXVGO2dCQUN2RixxRkFBcUY7Z0JBQ3JGLGNBQWMsQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1lBQ3ZELENBQUMsQ0FBQztpQkFDRCxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM3QixDQUFDLENBQUMsQ0FBQztR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