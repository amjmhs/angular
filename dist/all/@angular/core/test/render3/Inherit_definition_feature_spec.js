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
var core_1 = require("../../src/core");
var inherit_definition_feature_1 = require("../../src/render3/features/inherit_definition_feature");
var index_1 = require("../../src/render3/index");
describe('InheritDefinitionFeature', function () {
    it('should inherit lifecycle hooks', function () {
        var SuperDirective = /** @class */ (function () {
            function SuperDirective() {
            }
            SuperDirective.prototype.ngOnInit = function () { };
            SuperDirective.prototype.ngOnDestroy = function () { };
            SuperDirective.prototype.ngAfterContentInit = function () { };
            SuperDirective.prototype.ngAfterContentChecked = function () { };
            SuperDirective.prototype.ngAfterViewInit = function () { };
            SuperDirective.prototype.ngAfterViewChecked = function () { };
            SuperDirective.prototype.ngDoCheck = function () { };
            return SuperDirective;
        }());
        var SubDirective = /** @class */ (function (_super) {
            __extends(SubDirective, _super);
            function SubDirective() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            SubDirective.prototype.ngAfterViewInit = function () { };
            SubDirective.prototype.ngAfterViewChecked = function () { };
            SubDirective.prototype.ngDoCheck = function () { };
            SubDirective.ngDirectiveDef = index_1.defineDirective({
                type: SubDirective,
                selectors: [['', 'subDir', '']],
                factory: function () { return new SubDirective(); },
                features: [inherit_definition_feature_1.InheritDefinitionFeature]
            });
            return SubDirective;
        }(SuperDirective));
        var finalDef = SubDirective.ngDirectiveDef;
        expect(finalDef.onInit).toBe(SuperDirective.prototype.ngOnInit);
        expect(finalDef.onDestroy).toBe(SuperDirective.prototype.ngOnDestroy);
        expect(finalDef.afterContentChecked).toBe(SuperDirective.prototype.ngAfterContentChecked);
        expect(finalDef.afterContentInit).toBe(SuperDirective.prototype.ngAfterContentInit);
        expect(finalDef.afterViewChecked).toBe(SubDirective.prototype.ngAfterViewChecked);
        expect(finalDef.afterViewInit).toBe(SubDirective.prototype.ngAfterViewInit);
        expect(finalDef.doCheck).toBe(SubDirective.prototype.ngDoCheck);
    });
    it('should inherit inputs', function () {
        // tslint:disable-next-line:class-as-namespace
        var SuperDirective = /** @class */ (function () {
            function SuperDirective() {
            }
            SuperDirective.ngDirectiveDef = index_1.defineDirective({
                inputs: {
                    superFoo: ['foo', 'declaredFoo'],
                    superBar: 'bar',
                    superBaz: 'baz',
                },
                type: SuperDirective,
                selectors: [['', 'superDir', '']],
                factory: function () { return new SuperDirective(); },
            });
            return SuperDirective;
        }());
        // tslint:disable-next-line:class-as-namespace
        var SubDirective = /** @class */ (function (_super) {
            __extends(SubDirective, _super);
            function SubDirective() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            SubDirective.ngDirectiveDef = index_1.defineDirective({
                type: SubDirective,
                inputs: {
                    subBaz: 'baz',
                    subQux: 'qux',
                },
                selectors: [['', 'subDir', '']],
                factory: function () { return new SubDirective(); },
                features: [inherit_definition_feature_1.InheritDefinitionFeature]
            });
            return SubDirective;
        }(SuperDirective));
        var subDef = SubDirective.ngDirectiveDef;
        expect(subDef.inputs).toEqual({
            foo: 'superFoo',
            bar: 'superBar',
            baz: 'subBaz',
            qux: 'subQux',
        });
        expect(subDef.declaredInputs).toEqual({
            declaredFoo: 'superFoo',
            bar: 'superBar',
            baz: 'subBaz',
            qux: 'subQux',
        });
    });
    it('should inherit outputs', function () {
        // tslint:disable-next-line:class-as-namespace
        var SuperDirective = /** @class */ (function () {
            function SuperDirective() {
            }
            SuperDirective.ngDirectiveDef = index_1.defineDirective({
                outputs: {
                    superFoo: 'foo',
                    superBar: 'bar',
                    superBaz: 'baz',
                },
                type: SuperDirective,
                selectors: [['', 'superDir', '']],
                factory: function () { return new SuperDirective(); },
            });
            return SuperDirective;
        }());
        // tslint:disable-next-line:class-as-namespace
        var SubDirective = /** @class */ (function (_super) {
            __extends(SubDirective, _super);
            function SubDirective() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            SubDirective.ngDirectiveDef = index_1.defineDirective({
                type: SubDirective,
                outputs: {
                    subBaz: 'baz',
                    subQux: 'qux',
                },
                selectors: [['', 'subDir', '']],
                factory: function () { return new SubDirective(); },
                features: [inherit_definition_feature_1.InheritDefinitionFeature]
            });
            return SubDirective;
        }(SuperDirective));
        var subDef = SubDirective.ngDirectiveDef;
        expect(subDef.outputs).toEqual({
            foo: 'superFoo',
            bar: 'superBar',
            baz: 'subBaz',
            qux: 'subQux',
        });
    });
    it('should compose hostBindings', function () {
        var log = [];
        // tslint:disable-next-line:class-as-namespace
        var SuperDirective = /** @class */ (function () {
            function SuperDirective() {
            }
            SuperDirective.ngDirectiveDef = index_1.defineDirective({
                type: SuperDirective,
                selectors: [['', 'superDir', '']],
                hostBindings: function (directiveIndex, elementIndex) {
                    log.push(['super', directiveIndex, elementIndex]);
                },
                factory: function () { return new SuperDirective(); },
            });
            return SuperDirective;
        }());
        // tslint:disable-next-line:class-as-namespace
        var SubDirective = /** @class */ (function (_super) {
            __extends(SubDirective, _super);
            function SubDirective() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            SubDirective.ngDirectiveDef = index_1.defineDirective({
                type: SubDirective,
                selectors: [['', 'subDir', '']],
                hostBindings: function (directiveIndex, elementIndex) {
                    log.push(['sub', directiveIndex, elementIndex]);
                },
                factory: function () { return new SubDirective(); },
                features: [inherit_definition_feature_1.InheritDefinitionFeature]
            });
            return SubDirective;
        }(SuperDirective));
        var subDef = SubDirective.ngDirectiveDef;
        subDef.hostBindings(1, 2);
        expect(log).toEqual([['super', 1, 2], ['sub', 1, 2]]);
    });
    it('should throw if inheriting a component from a directive', function () {
        // tslint:disable-next-line:class-as-namespace
        var SuperComponent = /** @class */ (function () {
            function SuperComponent() {
            }
            SuperComponent.ngComponentDef = index_1.defineComponent({
                type: SuperComponent,
                template: function () { },
                selectors: [['', 'superDir', '']],
                factory: function () { return new SuperComponent(); }
            });
            return SuperComponent;
        }());
        expect(function () {
            // tslint:disable-next-line:class-as-namespace
            var SubDirective = /** @class */ (function (_super) {
                __extends(SubDirective, _super);
                function SubDirective() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                SubDirective.ngDirectiveDef = index_1.defineDirective({
                    type: SubDirective,
                    selectors: [['', 'subDir', '']],
                    factory: function () { return new SubDirective(); },
                    features: [inherit_definition_feature_1.InheritDefinitionFeature]
                });
                return SubDirective;
            }(SuperComponent));
        }).toThrowError('Directives cannot inherit Components');
    });
    it('should run inherited features', function () {
        var log = [];
        // tslint:disable-next-line:class-as-namespace
        var SuperDirective = /** @class */ (function () {
            function SuperDirective() {
            }
            SuperDirective.ngDirectiveDef = index_1.defineDirective({
                type: SuperDirective,
                selectors: [['', 'superDir', '']],
                factory: function () { return new SuperDirective(); },
                features: [
                    function (arg) { log.push('super1', arg); },
                    function (arg) { log.push('super2', arg); },
                ]
            });
            return SuperDirective;
        }());
        var SubDirective = /** @class */ (function (_super) {
            __extends(SubDirective, _super);
            function SubDirective() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.baz = new core_1.EventEmitter();
                _this.qux = new core_1.EventEmitter();
                return _this;
            }
            SubDirective.ngDirectiveDef = index_1.defineDirective({
                type: SubDirective,
                selectors: [['', 'subDir', '']],
                factory: function () { return new SubDirective(); },
                features: [inherit_definition_feature_1.InheritDefinitionFeature, function (arg) { log.push('sub1', arg); }]
            });
            __decorate([
                core_1.Output(),
                __metadata("design:type", Object)
            ], SubDirective.prototype, "baz", void 0);
            __decorate([
                core_1.Output(),
                __metadata("design:type", Object)
            ], SubDirective.prototype, "qux", void 0);
            return SubDirective;
        }(SuperDirective));
        var superDef = SuperDirective.ngDirectiveDef;
        var subDef = SubDirective.ngDirectiveDef;
        expect(log).toEqual([
            'super1',
            superDef,
            'super2',
            superDef,
            'super1',
            subDef,
            'super2',
            subDef,
            'sub1',
            subDef,
        ]);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5oZXJpdF9kZWZpbml0aW9uX2ZlYXR1cmVfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdC9yZW5kZXIzL0luaGVyaXRfZGVmaW5pdGlvbl9mZWF0dXJlX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsdUNBQTRHO0FBQzVHLG9HQUErRjtBQUMvRixpREFBbUg7QUFFbkgsUUFBUSxDQUFDLDBCQUEwQixFQUFFO0lBQ25DLEVBQUUsQ0FBQyxnQ0FBZ0MsRUFBRTtRQUNuQztZQUFBO1lBUUEsQ0FBQztZQVBDLGlDQUFRLEdBQVIsY0FBWSxDQUFDO1lBQ2Isb0NBQVcsR0FBWCxjQUFlLENBQUM7WUFDaEIsMkNBQWtCLEdBQWxCLGNBQXNCLENBQUM7WUFDdkIsOENBQXFCLEdBQXJCLGNBQXlCLENBQUM7WUFDMUIsd0NBQWUsR0FBZixjQUFtQixDQUFDO1lBQ3BCLDJDQUFrQixHQUFsQixjQUFzQixDQUFDO1lBQ3ZCLGtDQUFTLEdBQVQsY0FBYSxDQUFDO1lBQ2hCLHFCQUFDO1FBQUQsQ0FBQyxBQVJELElBUUM7UUFFRDtZQUEyQixnQ0FBYztZQUF6Qzs7WUFXQSxDQUFDO1lBVkMsc0NBQWUsR0FBZixjQUFtQixDQUFDO1lBQ3BCLHlDQUFrQixHQUFsQixjQUFzQixDQUFDO1lBQ3ZCLGdDQUFTLEdBQVQsY0FBYSxDQUFDO1lBRVAsMkJBQWMsR0FBRyx1QkFBZSxDQUFDO2dCQUN0QyxJQUFJLEVBQUUsWUFBWTtnQkFDbEIsU0FBUyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUMvQixPQUFPLEVBQUUsY0FBTSxPQUFBLElBQUksWUFBWSxFQUFFLEVBQWxCLENBQWtCO2dCQUNqQyxRQUFRLEVBQUUsQ0FBQyxxREFBd0IsQ0FBQzthQUNyQyxDQUFDLENB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