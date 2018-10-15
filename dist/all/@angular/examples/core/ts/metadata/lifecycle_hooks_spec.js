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
var testing_1 = require("@angular/core/testing");
(function () {
    describe('lifecycle hooks examples', function () {
        it('should work with ngOnInit', function () {
            // #docregion OnInit
            var MyComponent = /** @class */ (function () {
                function MyComponent() {
                }
                MyComponent.prototype.ngOnInit = function () {
                    // ...
                };
                MyComponent = __decorate([
                    core_1.Component({ selector: 'my-cmp', template: "..." })
                ], MyComponent);
                return MyComponent;
            }());
            // #enddocregion
            expect(createAndLogComponent(MyComponent)).toEqual([['ngOnInit', []]]);
        });
        it('should work with ngDoCheck', function () {
            // #docregion DoCheck
            var MyComponent = /** @class */ (function () {
                function MyComponent() {
                }
                MyComponent.prototype.ngDoCheck = function () {
                    // ...
                };
                MyComponent = __decorate([
                    core_1.Component({ selector: 'my-cmp', template: "..." })
                ], MyComponent);
                return MyComponent;
            }());
            // #enddocregion
            expect(createAndLogComponent(MyComponent)).toEqual([['ngDoCheck', []]]);
        });
        it('should work with ngAfterContentChecked', function () {
            // #docregion AfterContentChecked
            var MyComponent = /** @class */ (function () {
                function MyComponent() {
                }
                MyComponent.prototype.ngAfterContentChecked = function () {
                    // ...
                };
                MyComponent = __decorate([
                    core_1.Component({ selector: 'my-cmp', template: "..." })
                ], MyComponent);
                return MyComponent;
            }());
            // #enddocregion
            expect(createAndLogComponent(MyComponent)).toEqual([['ngAfterContentChecked', []]]);
        });
        it('should work with ngAfterContentInit', function () {
            // #docregion AfterContentInit
            var MyComponent = /** @class */ (function () {
                function MyComponent() {
                }
                MyComponent.prototype.ngAfterContentInit = function () {
                    // ...
                };
                MyComponent = __decorate([
                    core_1.Component({ selector: 'my-cmp', template: "..." })
                ], MyComponent);
                return MyComponent;
            }());
            // #enddocregion
            expect(createAndLogComponent(MyComponent)).toEqual([['ngAfterContentInit', []]]);
        });
        it('should work with ngAfterViewChecked', function () {
            // #docregion AfterViewChecked
            var MyComponent = /** @class */ (function () {
                function MyComponent() {
                }
                MyComponent.prototype.ngAfterViewChecked = function () {
                    // ...
                };
                MyComponent = __decorate([
                    core_1.Component({ selector: 'my-cmp', template: "..." })
                ], MyComponent);
                return MyComponent;
            }());
            // #enddocregion
            expect(createAndLogComponent(MyComponent)).toEqual([['ngAfterViewChecked', []]]);
        });
        it('should work with ngAfterViewInit', function () {
            // #docregion AfterViewInit
            var MyComponent = /** @class */ (function () {
                function MyComponent() {
                }
                MyComponent.prototype.ngAfterViewInit = function () {
                    // ...
                };
                MyComponent = __decorate([
                    core_1.Component({ selector: 'my-cmp', template: "..." })
                ], MyComponent);
                return MyComponent;
            }());
            // #enddocregion
            expect(createAndLogComponent(MyComponent)).toEqual([['ngAfterViewInit', []]]);
        });
        it('should work with ngOnDestroy', function () {
            // #docregion OnDestroy
            var MyComponent = /** @class */ (function () {
                function MyComponent() {
                }
                MyComponent.prototype.ngOnDestroy = function () {
                    // ...
                };
                MyComponent = __decorate([
                    core_1.Component({ selector: 'my-cmp', template: "..." })
                ], MyComponent);
                return MyComponent;
            }());
            // #enddocregion
            expect(createAndLogComponent(MyComponent)).toEqual([['ngOnDestroy', []]]);
        });
        it('should work with ngOnChanges', function () {
            // #docregion OnChanges
            var MyComponent = /** @class */ (function () {
                function MyComponent() {
                }
                MyComponent.prototype.ngOnChanges = function (changes) {
                    // changes.prop contains the old and the new value...
                };
                __decorate([
                    core_1.Input(),
                    __metadata("design:type", Number)
                ], MyComponent.prototype, "prop", void 0);
                MyComponent = __decorate([
                    core_1.Component({ selector: 'my-cmp', template: "..." })
                ], MyComponent);
                return MyComponent;
            }());
            // #enddocregion
            var log = createAndLogComponent(MyComponent, ['prop']);
            expect(log.length).toBe(1);
            expect(log[0][0]).toBe('ngOnChanges');
            var changes = log[0][1][0];
            expect(changes['prop'].currentValue).toBe(true);
        });
    });
    function createAndLogComponent(clazz, inputs) {
        if (inputs === void 0) { inputs = []; }
        var log = [];
        createLoggingSpiesFromProto(clazz, log);
        var inputBindings = inputs.map(function (input) { return "[" + input + "] = true"; }).join(' ');
        var ParentComponent = /** @class */ (function () {
            function ParentComponent() {
            }
            ParentComponent = __decorate([
                core_1.Component({ template: "<my-cmp " + inputBindings + "></my-cmp>" })
            ], ParentComponent);
            return ParentComponent;
        }());
        var fixture = testing_1.TestBed.configureTestingModule({ declarations: [ParentComponent, clazz] })
            .createComponent(ParentComponent);
        fixture.detectChanges();
        fixture.destroy();
        return log;
    }
    function createLoggingSpiesFromProto(clazz, log) {
        var proto = clazz.prototype;
        Object.keys(proto).forEach(function (method) {
            proto[method] = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                log.push([method, args]);
            };
        });
    }
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlmZWN5Y2xlX2hvb2tzX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9leGFtcGxlcy9jb3JlL3RzL21ldGFkYXRhL2xpZmVjeWNsZV9ob29rc19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7O0FBRUgsc0NBQW1MO0FBQ25MLGlEQUE4QztBQUU5QyxDQUFDO0lBQ0MsUUFBUSxDQUFDLDBCQUEwQixFQUFFO1FBQ25DLEVBQUUsQ0FBQywyQkFBMkIsRUFBRTtZQUM5QixvQkFBb0I7WUFFcEI7Z0JBQUE7Z0JBSUEsQ0FBQztnQkFIQyw4QkFBUSxHQUFSO29CQUNFLE1BQU07Z0JBQ1IsQ0FBQztnQkFIRyxXQUFXO29CQURoQixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFDLENBQUM7bUJBQzNDLFdBQVcsQ0FJaEI7Z0JBQUQsa0JBQUM7YUFBQSxBQUpELElBSUM7WUFDRCxnQkFBZ0I7WUFFaEIsTUFBTSxDQUFDLHFCQUFxQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pFLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDRCQUE0QixFQUFFO1lBQy9CLHFCQUFxQjtZQUVyQjtnQkFBQTtnQkFJQSxDQUFDO2dCQUhDLCtCQUFTLEdBQVQ7b0JBQ0UsTUFBTTtnQkFDUixDQUFDO2dCQUhHLFdBQVc7b0JBRGhCLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUMsQ0FBQzttQkFDM0MsV0FBVyxDQUloQjtnQkFBRCxrQkFBQzthQUFBLEFBSkQsSUFJQztZQUNELGdCQUFnQjtZQUVoQixNQUFNLENBQUMscUJBQXFCLENBQUMsV0FB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