"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var rxjs_1 = require("rxjs");
var component_factory_strategy_1 = require("../src/component-factory-strategy");
describe('ComponentFactoryNgElementStrategy', function () {
    var factory;
    var strategy;
    var injector;
    var componentRef;
    var applicationRef;
    beforeEach(function () {
        factory = new FakeComponentFactory();
        componentRef = factory.componentRef;
        applicationRef = jasmine.createSpyObj('applicationRef', ['attachView']);
        injector = jasmine.createSpyObj('injector', ['get']);
        injector.get.and.returnValue(applicationRef);
        strategy = new component_factory_strategy_1.ComponentNgElementStrategy(factory, injector);
    });
    it('should create a new strategy from the factory', function () {
        var factoryResolver = jasmine.createSpyObj('factoryResolver', ['resolveComponentFactory']);
        factoryResolver.resolveComponentFactory.and.returnValue(factory);
        injector.get.and.returnValue(factoryResolver);
        var strategyFactory = new component_factory_strategy_1.ComponentNgElementStrategyFactory(FakeComponent, injector);
        expect(strategyFactory.create(injector)).toBeTruthy();
    });
    describe('after connected', function () {
        beforeEach(function () {
            // Set up an initial value to make sure it is passed to the component
            strategy.setInputValue('fooFoo', 'fooFoo-1');
            strategy.connect(document.createElement('div'));
        });
        it('should attach the component to the view', function () { expect(applicationRef.attachView).toHaveBeenCalledWith(componentRef.hostView); });
        it('should detect changes', function () { expect(componentRef.changeDetectorRef.detectChanges).toHaveBeenCalled(); });
        it('should listen to output events', function () {
            var events = [];
            strategy.events.subscribe(function (e) { return events.push(e); });
            componentRef.instance.output1.next('output-1a');
            componentRef.instance.output1.next('output-1b');
            componentRef.instance.output2.next('output-2a');
            expect(events).toEqual([
                { name: 'templateOutput1', value: 'output-1a' },
                { name: 'templateOutput1', value: 'output-1b' },
                { name: 'templateOutput2', value: 'output-2a' },
            ]);
        });
        it('should initialize the component with initial values', function () {
            expect(strategy.getInputValue('fooFoo')).toBe('fooFoo-1');
            expect(componentRef.instance.fooFoo).toBe('fooFoo-1');
        });
        it('should call ngOnChanges with the change', function () {
            expectSimpleChanges(componentRef.instance.simpleChanges[0], { fooFoo: new core_1.SimpleChange(undefined, 'fooFoo-1', false) });
        });
    });
    it('should not call ngOnChanges if not present on the component', function () {
        factory.componentRef.instance = new FakeComponentWithoutNgOnChanges();
        // Should simply succeed without problems (did not try to call ngOnChanges)
        strategy.connect(document.createElement('div'));
    });
    describe('when inputs change and not connected', function () {
        it('should cache the value', function () {
            strategy.setInputValue('fooFoo', 'fooFoo-1');
            expect(strategy.getInputValue('fooFoo')).toBe('fooFoo-1');
            // Sanity check: componentRef isn't changed since its not even on the strategy
            expect(componentRef.instance.fooFoo).toBe(undefined);
        });
        it('should not detect changes', testing_1.fakeAsync(function () {
            strategy.setInputValue('fooFoo', 'fooFoo-1');
            testing_1.tick(16); // scheduler waits 16ms if RAF is unavailable
            expect(componentRef.changeDetectorRef.detectChanges).not.toHaveBeenCalled();
        }));
    });
    describe('when inputs change and is connected', function () {
        beforeEach(function () { strategy.connect(document.createElement('div')); });
        it('should be set on the component instance', function () {
            strategy.setInputValue('fooFoo', 'fooFoo-1');
            expect(componentRef.instance.fooFoo).toBe('fooFoo-1');
            expect(strategy.getInputValue('fooFoo')).toBe('fooFoo-1');
        });
        it('should detect changes', testing_1.fakeAsync(function () {
            // Connect detected changes automatically
            expect(componentRef.changeDetectorRef.detectChanges).toHaveBeenCalledTimes(1);
            strategy.setInputValue('fooFoo', 'fooFoo-1');
            testing_1.tick(16); // scheduler waits 16ms if RAF is unavailable
            expect(componentRef.changeDetectorRef.detectChanges).toHaveBeenCalledTimes(2);
        }));
        it('should detect changes once for multiple input changes', testing_1.fakeAsync(function () {
            // Connect detected changes automatically
            expect(componentRef.changeDetectorRef.detectChanges).toHaveBeenCalledTimes(1);
            strategy.setInputValue('fooFoo', 'fooFoo-1');
            strategy.setInputValue('barBar', 'barBar-1');
            testing_1.tick(16); // scheduler waits 16ms if RAF is unavailable
            expect(componentRef.changeDetectorRef.detectChanges).toHaveBeenCalledTimes(2);
        }));
        it('should call ngOnChanges', testing_1.fakeAsync(function () {
            strategy.setInputValue('fooFoo', 'fooFoo-1');
            testing_1.tick(16); // scheduler waits 16ms if RAF is unavailable
            expectSimpleChanges(componentRef.instance.simpleChanges[0], { fooFoo: new core_1.SimpleChange(undefined, 'fooFoo-1', true) });
        }));
        it('should call ngOnChanges once for multiple input changes', testing_1.fakeAsync(function () {
            strategy.setInputValue('fooFoo', 'fooFoo-1');
            strategy.setInputValue('barBar', 'barBar-1');
            testing_1.tick(16); // scheduler waits 16ms if RAF is unavailable
            expectSimpleChanges(componentRef.instance.simpleChanges[0], {
                fooFoo: new core_1.SimpleChange(undefined, 'fooFoo-1', true),
                barBar: new core_1.SimpleChange(undefined, 'barBar-1', true)
            });
        }));
        it('should call ngOnChanges twice for changes in different rounds with previous values', testing_1.fakeAsync(function () {
            strategy.setInputValue('fooFoo', 'fooFoo-1');
            strategy.setInputValue('barBar', 'barBar-1');
            testing_1.tick(16); // scheduler waits 16ms if RAF is unavailable
            expectSimpleChanges(componentRef.instance.simpleChanges[0], {
                fooFoo: new core_1.SimpleChange(undefined, 'fooFoo-1', true),
                barBar: new core_1.SimpleChange(undefined, 'barBar-1', true)
            });
            strategy.setInputValue('fooFoo', 'fooFoo-2');
            strategy.setInputValue('barBar', 'barBar-2');
            testing_1.tick(16); // scheduler waits 16ms if RAF is unavailable
            expectSimpleChanges(componentRef.instance.simpleChanges[1], {
                fooFoo: new core_1.SimpleChange('fooFoo-1', 'fooFoo-2', false),
                barBar: new core_1.SimpleChange('barBar-1', 'barBar-2', false)
            });
        }));
    });
    describe('disconnect', function () {
        it('should be able to call if not connected', testing_1.fakeAsync(function () {
            strategy.disconnect();
            // Sanity check: the strategy doesn't have an instance of the componentRef anyways
            expect(componentRef.destroy).not.toHaveBeenCalled();
        }));
        it('should destroy the component after the destroy delay', testing_1.fakeAsync(function () {
            strategy.connect(document.createElement('div'));
            strategy.disconnect();
            expect(componentRef.destroy).not.toHaveBeenCalled();
            testing_1.tick(10);
            expect(componentRef.destroy).toHaveBeenCalledTimes(1);
        }));
        it('should be able to call it multiple times but only destroy once', testing_1.fakeAsync(function () {
            strategy.connect(document.createElement('div'));
            strategy.disconnect();
            strategy.disconnect();
            expect(componentRef.destroy).not.toHaveBeenCalled();
            testing_1.tick(10);
            expect(componentRef.destroy).toHaveBeenCalledTimes(1);
            strategy.disconnect();
            expect(componentRef.destroy).toHaveBeenCalledTimes(1);
        }));
    });
});
var FakeComponentWithoutNgOnChanges = /** @class */ (function () {
    function FakeComponentWithoutNgOnChanges() {
        this.output1 = new rxjs_1.Subject();
        this.output2 = new rxjs_1.Subject();
    }
    return FakeComponentWithoutNgOnChanges;
}());
exports.FakeComponentWithoutNgOnChanges = FakeComponentWithoutNgOnChanges;
var FakeComponent = /** @class */ (function () {
    function FakeComponent() {
        this.output1 = new rxjs_1.Subject();
        this.output2 = new rxjs_1.Subject();
        // Keep track of the simple changes passed to ngOnChanges
        this.simpleChanges = [];
    }
    FakeComponent.prototype.ngOnChanges = function (simpleChanges) { this.simpleChanges.push(simpleChanges); };
    return FakeComponent;
}());
exports.FakeComponent = FakeComponent;
var FakeComponentFactory = /** @class */ (function (_super) {
    __extends(FakeComponentFactory, _super);
    function FakeComponentFactory() {
        var _this = _super.call(this) || this;
        _this.componentRef = jasmine.createSpyObj('componentRef', ['instance', 'changeDetectorRef', 'hostView', 'destroy']);
        _this.componentRef.instance = new FakeComponent();
        _this.componentRef.changeDetectorRef =
            jasmine.createSpyObj('changeDetectorRef', ['detectChanges']);
        return _this;
    }
    Object.defineProperty(FakeComponentFactory.prototype, "selector", {
        get: function () { return 'fake-component'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FakeComponentFactory.prototype, "componentType", {
        get: function () { return FakeComponent; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FakeComponentFactory.prototype, "ngContentSelectors", {
        get: function () { return ['content-1', 'content-2']; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FakeComponentFactory.prototype, "inputs", {
        get: function () {
            return [
                { propName: 'fooFoo', templateName: 'fooFoo' },
                { propName: 'barBar', templateName: 'my-bar-bar' },
            ];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FakeComponentFactory.prototype, "outputs", {
        get: function () {
            return [
                { propName: 'output1', templateName: 'templateOutput1' },
                { propName: 'output2', templateName: 'templateOutput2' },
            ];
        },
        enumerable: true,
        configurable: true
    });
    FakeComponentFactory.prototype.create = function (injector, projectableNodes, rootSelectorOrNode, ngModule) {
        return this.componentRef;
    };
    return FakeComponentFactory;
}(core_1.ComponentFactory));
exports.FakeComponentFactory = FakeComponentFactory;
function expectSimpleChanges(actual, expected) {
    Object.keys(actual).forEach(function (key) { expect(expected[key]).toBeTruthy("Change included additional key " + key); });
    Object.keys(expected).forEach(function (key) {
        expect(actual[key]).toBeTruthy("Change should have included key " + key);
        if (actual[key]) {
            expect(actual[key].previousValue).toBe(expected[key].previousValue);
            expect(actual[key].currentValue).toBe(expected[key].currentValue);
            expect(actual[key].firstChange).toBe(expected[key].firstChange);
        }
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcG9uZW50LWZhY3Rvcnktc3RyYXRlZ3lfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2VsZW1lbnRzL3Rlc3QvY29tcG9uZW50LWZhY3Rvcnktc3RyYXRlZ3lfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBdUg7QUFDdkgsaURBQXNEO0FBQ3RELDZCQUE2QjtBQUU3QixnRkFBZ0g7QUFHaEgsUUFBUSxDQUFDLG1DQUFtQyxFQUFFO0lBQzVDLElBQUksT0FBNkIsQ0FBQztJQUNsQyxJQUFJLFFBQW9DLENBQUM7SUFFekMsSUFBSSxRQUFhLENBQUM7SUFDbEIsSUFBSSxZQUFpQixDQUFDO0lBQ3RCLElBQUksY0FBbUIsQ0FBQztJQUV4QixVQUFVLENBQUM7UUFDVCxPQUFPLEdBQUcsSUFBSSxvQkFBb0IsRUFBRSxDQUFDO1FBQ3JDLFlBQVksR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDO1FBRXBDLGNBQWMsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLGdCQUFnQixFQUFFLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztRQUN4RSxRQUFRLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3JELFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUU3QyxRQUFRLEdBQUcsSUFBSSx1REFBMEIsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDL0QsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsK0NBQStDLEVBQUU7UUFDbEQsSUFBTSxlQUFlLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQztRQUM3RixlQUFlLENBQUMsdUJBQXVC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