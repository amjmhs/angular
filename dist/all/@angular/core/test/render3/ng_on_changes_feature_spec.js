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
var core_1 = require("../../src/core");
var inherit_definition_feature_1 = require("../../src/render3/features/inherit_definition_feature");
var index_1 = require("../../src/render3/index");
describe('NgOnChangesFeature', function () {
    it('should patch class', function () {
        var MyDirective = /** @class */ (function () {
            function MyDirective() {
                this.log = [];
                this.valA = 'initValue';
            }
            Object.defineProperty(MyDirective.prototype, "valB", {
                get: function () { return 'works'; },
                set: function (value) { this.log.push(value); },
                enumerable: true,
                configurable: true
            });
            MyDirective.prototype.ngDoCheck = function () { this.log.push('ngDoCheck'); };
            MyDirective.prototype.ngOnChanges = function (changes) {
                this.log.push('ngOnChanges');
                this.log.push('valA', changes['valA']);
                this.log.push('valB', changes['valB']);
            };
            MyDirective.ngDirectiveDef = index_1.defineDirective({
                type: MyDirective,
                selectors: [['', 'myDir', '']],
                factory: function () { return new MyDirective(); },
                features: [index_1.NgOnChangesFeature],
                inputs: { valA: 'valA', valB: 'valB' }
            });
            return MyDirective;
        }());
        var myDir = MyDirective.ngDirectiveDef.factory();
        myDir.valA = 'first';
        expect(myDir.valA).toEqual('first');
        myDir.valB = 'second';
        expect(myDir.log).toEqual(['second']);
        expect(myDir.valB).toEqual('works');
        myDir.log.length = 0;
        MyDirective.ngDirectiveDef.doCheck.call(myDir);
        var changeA = new core_1.SimpleChange(undefined, 'first', true);
        var changeB = new core_1.SimpleChange(undefined, 'second', true);
        expect(myDir.log).toEqual(['ngOnChanges', 'valA', changeA, 'valB', changeB, 'ngDoCheck']);
    });
    it('should inherit the behavior from super class', function () {
        var log = [];
        var SuperDirective = /** @class */ (function () {
            function SuperDirective() {
                this.valA = 'initValue';
            }
            Object.defineProperty(SuperDirective.prototype, "valB", {
                get: function () { return 'works'; },
                set: function (value) { log.push(value); },
                enumerable: true,
                configurable: true
            });
            SuperDirective.prototype.ngDoCheck = function () { log.push('ngDoCheck'); };
            SuperDirective.prototype.ngOnChanges = function (changes) {
                log.push('ngOnChanges');
                log.push('valA', changes['valA']);
                log.push('valB', changes['valB']);
                log.push('valC', changes['valC']);
            };
            SuperDirective.ngDirectiveDef = index_1.defineDirective({
                type: SuperDirective,
                selectors: [['', 'superDir', '']],
                factory: function () { return new SuperDirective(); },
                features: [index_1.NgOnChangesFeature],
                inputs: { valA: 'valA', valB: 'valB' },
            });
            return SuperDirective;
        }());
        var SubDirective = /** @class */ (function (_super) {
            __extends(SubDirective, _super);
            function SubDirective() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.valC = 'initValue';
                return _this;
            }
            SubDirective.ngDirectiveDef = index_1.defineDirective({
                type: SubDirective,
                selectors: [['', 'subDir', '']],
                factory: function () { return new SubDirective(); },
                features: [inherit_definition_feature_1.InheritDefinitionFeature],
                inputs: { valC: 'valC' },
            });
            return SubDirective;
        }(SuperDirective));
        var myDir = SubDirective.ngDirectiveDef
            .factory();
        myDir.valA = 'first';
        expect(myDir.valA).toEqual('first');
        myDir.valB = 'second';
        expect(myDir.valB).toEqual('works');
        myDir.valC = 'third';
        expect(myDir.valC).toEqual('third');
        log.length = 0;
        SubDirective.ngDirectiveDef.doCheck.call(myDir);
        var changeA = new core_1.SimpleChange(undefined, 'first', true);
        var changeB = new core_1.SimpleChange(undefined, 'second', true);
        var changeC = new core_1.SimpleChange(undefined, 'third', true);
        expect(log).toEqual(['ngOnChanges', 'valA', changeA, 'valB', changeB, 'valC', changeC, 'ngDoCheck']);
    });
    it('should not run the parent doCheck if it is not called explicitly on super class', function () {
        var log = [];
        var SuperDirective = /** @class */ (function () {
            function SuperDirective() {
                this.valA = 'initValue';
            }
            SuperDirective.prototype.ngDoCheck = function () { log.push('ERROR: Child overrides it without super call'); };
            SuperDirective.prototype.ngOnChanges = function (changes) { log.push(changes.valA, changes.valB); };
            SuperDirective.ngDirectiveDef = index_1.defineDirective({
                type: SuperDirective,
                selectors: [['', 'superDir', '']],
                factory: function () { return new SuperDirective(); },
                features: [index_1.NgOnChangesFeature],
                inputs: { valA: 'valA' },
            });
            return SuperDirective;
        }());
        var SubDirective = /** @class */ (function (_super) {
            __extends(SubDirective, _super);
            function SubDirective() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.valB = 'initValue';
                return _this;
            }
            SubDirective.prototype.ngDoCheck = function () { log.push('sub ngDoCheck'); };
            SubDirective.ngDirectiveDef = index_1.defineDirective({
                type: SubDirective,
                selectors: [['', 'subDir', '']],
                factory: function () { return new SubDirective(); },
                features: [inherit_definition_feature_1.InheritDefinitionFeature],
                inputs: { valB: 'valB' },
            });
            return SubDirective;
        }(SuperDirective));
        var myDir = SubDirective.ngDirectiveDef
            .factory();
        myDir.valA = 'first';
        myDir.valB = 'second';
        SubDirective.ngDirectiveDef.doCheck.call(myDir);
        var changeA = new core_1.SimpleChange(undefined, 'first', true);
        var changeB = new core_1.SimpleChange(undefined, 'second', true);
        expect(log).toEqual([changeA, changeB, 'sub ngDoCheck']);
    });
    it('should run the parent doCheck if it is inherited from super class', function () {
        var log = [];
        var SuperDirective = /** @class */ (function () {
            function SuperDirective() {
                this.valA = 'initValue';
            }
            SuperDirective.prototype.ngDoCheck = function () { log.push('super ngDoCheck'); };
            SuperDirective.prototype.ngOnChanges = function (changes) { log.push(changes.valA, changes.valB); };
            SuperDirective.ngDirectiveDef = index_1.defineDirective({
                type: SuperDirective,
                selectors: [['', 'superDir', '']],
                factory: function () { return new SuperDirective(); },
                features: [index_1.NgOnChangesFeature],
                inputs: { valA: 'valA' },
            });
            return SuperDirective;
        }());
        var SubDirective = /** @class */ (function (_super) {
            __extends(SubDirective, _super);
            function SubDirective() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.valB = 'initValue';
                return _this;
            }
            SubDirective.ngDirectiveDef = index_1.defineDirective({
                type: SubDirective,
                selectors: [['', 'subDir', '']],
                factory: function () { return new SubDirective(); },
                features: [inherit_definition_feature_1.InheritDefinitionFeature],
                inputs: { valB: 'valB' },
            });
            return SubDirective;
        }(SuperDirective));
        var myDir = SubDirective.ngDirectiveDef
            .factory();
        myDir.valA = 'first';
        myDir.valB = 'second';
        SubDirective.ngDirectiveDef.doCheck.call(myDir);
        var changeA = new core_1.SimpleChange(undefined, 'first', true);
        var changeB = new core_1.SimpleChange(undefined, 'second', true);
        expect(log).toEqual([changeA, changeB, 'super ngDoCheck']);
    });
    it('should apply the feature to inherited properties if on sub class', function () {
        var log = [];
        var SuperDirective = /** @class */ (function () {
            function SuperDirective() {
                this.valC = 'initValue';
            }
            SuperDirective.ngDirectiveDef = index_1.defineDirective({
                type: SuperDirective,
                selectors: [['', 'subDir', '']],
                factory: function () { return new SuperDirective(); },
                features: [],
                inputs: { valC: 'valC' },
            });
            return SuperDirective;
        }());
        var SubDirective = /** @class */ (function (_super) {
            __extends(SubDirective, _super);
            function SubDirective() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.valA = 'initValue';
                return _this;
            }
            Object.defineProperty(SubDirective.prototype, "valB", {
                get: function () { return 'works'; },
                set: function (value) { log.push(value); },
                enumerable: true,
                configurable: true
            });
            SubDirective.prototype.ngDoCheck = function () { log.push('ngDoCheck'); };
            SubDirective.prototype.ngOnChanges = function (changes) {
                log.push('ngOnChanges');
                log.push('valA', changes['valA']);
                log.push('valB', changes['valB']);
                log.push('valC', changes['valC']);
            };
            SubDirective.ngDirectiveDef = index_1.defineDirective({
                type: SubDirective,
                selectors: [['', 'superDir', '']],
                factory: function () { return new SubDirective(); },
                // Inheritance must always be before OnChanges feature.
                features: [
                    inherit_definition_feature_1.InheritDefinitionFeature,
                    index_1.NgOnChangesFeature,
                ],
                inputs: { valA: 'valA', valB: 'valB' }
            });
            return SubDirective;
        }(SuperDirective));
        var myDir = SubDirective.ngDirectiveDef
            .factory();
        myDir.valA = 'first';
        expect(myDir.valA).toEqual('first');
        myDir.valB = 'second';
        expect(log).toEqual(['second']);
        expect(myDir.valB).toEqual('works');
        myDir.valC = 'third';
        expect(myDir.valC).toEqual('third');
        log.length = 0;
        SubDirective.ngDirectiveDef.doCheck.call(myDir);
        var changeA = new core_1.SimpleChange(undefined, 'first', true);
        var changeB = new core_1.SimpleChange(undefined, 'second', true);
        var changeC = new core_1.SimpleChange(undefined, 'third', true);
        expect(log).toEqual(['ngOnChanges', 'valA', changeA, 'valB', changeB, 'valC', changeC, 'ngDoCheck']);
    });
    it('correctly computes firstChange', function () {
        var MyDirective = /** @class */ (function () {
            function MyDirective() {
                this.log = [];
                this.valA = 'initValue';
            }
            MyDirective.prototype.ngOnChanges = function (changes) {
                this.log.push('valA', changes['valA']);
                this.log.push('valB', changes['valB']);
            };
            MyDirective.ngDirectiveDef = index_1.defineDirective({
                type: MyDirective,
                selectors: [['', 'myDir', '']],
                factory: function () { return new MyDirective(); },
                features: [index_1.NgOnChangesFeature],
                inputs: { valA: 'valA', valB: 'valB' }
            });
            return MyDirective;
        }());
        var myDir = MyDirective.ngDirectiveDef.factory();
        myDir.valA = 'first';
        myDir.valB = 'second';
        MyDirective.ngDirectiveDef.doCheck.call(myDir);
        var changeA1 = new core_1.SimpleChange(undefined, 'first', true);
        var changeB1 = new core_1.SimpleChange(undefined, 'second', true);
        expect(myDir.log).toEqual(['valA', changeA1, 'valB', changeB1]);
        myDir.log.length = 0;
        myDir.valA = 'third';
        MyDirective.ngDirectiveDef.doCheck.call(myDir);
        var changeA2 = new core_1.SimpleChange('first', 'third', false);
        expect(myDir.log).toEqual(['valA', changeA2, 'valB', undefined]);
    });
    it('should not create a getter when only a setter is originally defined', function () {
        var MyDirective = /** @class */ (function () {
            function MyDirective() {
                this.log = [];
            }
            Object.defineProperty(MyDirective.prototype, "onlySetter", {
                set: function (value) { this.log.push(value); },
                enumerable: true,
                configurable: true
            });
            MyDirective.prototype.ngOnChanges = function (changes) {
                this.log.push('ngOnChanges');
                this.log.push('onlySetter', changes['onlySetter']);
            };
            MyDirective.ngDirectiveDef = index_1.defineDirective({
                type: MyDirective,
                selectors: [['', 'myDir', '']],
                factory: function () { return new MyDirective(); },
                features: [index_1.NgOnChangesFeature],
                inputs: { onlySetter: 'onlySetter' }
            });
            return MyDirective;
        }());
        var myDir = MyDirective.ngDirectiveDef.factory();
        myDir.onlySetter = 'someValue';
        expect(myDir.onlySetter).toBeUndefined();
        MyDirective.ngDirectiveDef.doCheck.call(myDir);
        var changeSetter = new core_1.SimpleChange(undefined, 'someValue', true);
        expect(myDir.log).toEqual(['someValue', 'ngOnChanges', 'onlySetter', changeSetter]);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfb25fY2hhbmdlc19mZWF0dXJlX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3Rlc3QvcmVuZGVyMy9uZ19vbl9jaGFuZ2VzX2ZlYXR1cmVfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7QUFFSCx1Q0FBNEc7QUFDNUcsb0dBQStGO0FBQy9GLGlEQUFtSDtBQUVuSCxRQUFRLENBQUMsb0JBQW9CLEVBQUU7SUFDN0IsRUFBRSxDQUFDLG9CQUFvQixFQUFFO1FBQ3ZCO1lBQUE7Z0JBQ1MsUUFBRyxHQUErQixFQUFFLENBQUM7Z0JBQ3JDLFNBQUksR0FBVyxXQUFXLENBQUM7WUFtQnBDLENBQUM7WUFsQkMsc0JBQVcsNkJBQUk7cUJBRWYsY0FBb0IsT0FBTyxPQUFPLENBQUMsQ0FBQyxDQUFDO3FCQUZyQyxVQUFnQixLQUFhLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7ZUFBQTtZQUl4RCwrQkFBUyxHQUFULGNBQW9CLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqRCxpQ0FBVyxHQUFYLFVBQVksT0FBc0I7Z0JBQ2hDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUM3QixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUN6QyxDQUFDO1lBRU0sMEJBQWMsR0FBRyx1QkFBZSxDQUFDO2dCQUN0QyxJQUFJLEVBQUUsV0FBVztnQkFDakIsU0FBUyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUM5QixPQUFPLEVBQUUsY0FBTSxPQUFBLElBQUksV0FBVyxFQUFFLEVBQWpCLENBQWlCO2dCQUNoQyxRQUFRLEVBQUUsQ0FBQywwQkFBa0IsQ0FBQztnQkFDOUIsTUFBTSxFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFDO2FBQ3JDLENBQUMsQ0FBQztZQUNMLGtCQUFDO1NBQUEsQUFyQkQsSUFxQkM7UUFFRCxJQUFNLEtBQUssR0FDTixXQUFXLENBQUMsY0FBb0QsQ0FBQyxPQUFPLEVBQWlCLENBQUM7UUFDL0YsS0FBSyxDQUFDLElBQUksR0FBRyxPQUFPLENBQUM7UUFDckIsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDcEMsS0FBSyxDQUFDLElBQUksR0FBRyxRQUFRLENBQUM7UUFDdEIsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ3RDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3BDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUNwQixXQUFXLENBQUMsY0FBb0QsQ0FBQyxPQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3hGLElBQU0sT0FBTyxHQUFHLElBQUksbUJBQVksQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzNELElBQU0sT0FBTyxHQUFHLElBQUksbUJBQVksQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzVELE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsYUFBYSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDO0lBQzVGLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDhDQUE4QyxFQUFFO1FBQ2pELElBQU0sR0FBRyxHQUFVLEVBQUUsQ0FBQztRQUV0QjtZQUFBO2dCQUNFLFNBQUksR0FBRyxXQUFXLENBQUM7WUFxQnJCLENBQUM7WUFuQkMsc0JBQUksZ0NBQUk7cUJBRVIsY0FBYSxPQUFPLE9BQU8sQ0FBQyxDQUFDLENBQUM7cUJBRjlCLFVBQVMsS0FBYSxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7ZUFBQTtZQUk1QyxrQ0FBUyxHQUFULGNBQW9CLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVDLG9DQUFXLEdBQVgsVUFBWSxPQUFzQjtnQkFDaEMsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFDeEIsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2xDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNsQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNwQyxDQUFDO1lBRU0sNkJBQWMsR0FBRyx1QkFBZSxDQUFDO2dCQUN0QyxJQUFJLEVBQUUsY0FBYztnQkFDcEIsU0FBUyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsVUFBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUNqQyxPQUFPLEVBQUUsY0FBTSxPQUFBLElBQUksY0FBYyxFQUFFLEVBQXBCLENBQW9CO2dCQUNuQyxRQUFRLEVBQUUsQ0FBQywwQkFBa0IsQ0FBQztnQkFDOUIsTUFBTSxFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFDO2FBQ3JDLENBQUMsQ0FBQztZQUNMLHFCQUFDO1NBQUEsQUF0QkQsSUFzQkM7UUFFRDtZQUEyQixnQ0FBYztZQUF6QztnQkFBQSxxRUFVQztnQkFUQyxVQUFJLEdBQUcsV0FBVyxDQUFDOztZQVNyQixDQUFDO1lBUFEsMkJBQWMsR0FBRyx1QkFBZSxDQUFDO2dCQUN0QyxJQUFJLEVBQUUsWUFBWTtnQkFDbEIsU0FBUyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUMvQixPQUFPLEVBQUUsY0FBTSxPQUFBLElBQUksWUFBWSxFQUFFLEVBQWxCLENBQWtCO2dCQUNqQyxRQUFRLEVBQUUsQ0FBQyxxREFBd0IsQ0FBQztnQkFDcEMsTUFBTSxFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBQzthQUN2QixDQUFDLENBQUM7WUFDTCxtQkFBQztTQUFBLEFBVkQsQ0FBMkIsY0FBYyxHQVV4QztRQUVELElBQU0sS0FBSyxHQUFJLFlBQVksQ0FBQyxjQUFxRDthQUM5RCxPQUFPLEVBQWtCLENBQUM7UUFDN0MsS0FBSyxDQUFDLElBQUksR0FBRyxPQUFPLENBQUM7UUFDckIsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFcEMsS0FBSyxDQUFDLElBQUksR0FBRyxRQUFRLENBQUM7UUFDdEIsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFcEMsS0FBSyxDQUFDLElBQUksR0FBRyxPQUFPLENBQUM7UUFDckIsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFcEMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDZCxZQUFZLENBQUMsY0FBcUQsQ0FBQyxPQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzFGLElBQU0sT0FBTyxHQUFHLElBQUksbUJBQVksQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzNELElBQU0sT0FBTyxHQUFHLElBQUksbUJBQVksQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzVELElBQU0sT0FBTyxHQUFHLElBQUksbUJBQVksQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRTNELE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQ2YsQ0FBQyxhQUFhLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQztJQUN2RixDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxpRkFBaUYsRUFBRTtRQUNwRixJQUFNLEdBQUcsR0FBVSxFQUFFLENBQUM7UUFFdEI7WUFBQTtnQkFDRSxTQUFJLEdBQUcsV0FBVyxDQUFDO1lBWXJCLENBQUM7WUFWQyxrQ0FBUyxHQUFULGNBQW9CLEdBQUcsQ0FBQyxJQUFJLENBQUMsOENBQThDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDL0Usb0NBQVcsR0FBWCxVQUFZLE9BQXNCLElBQVUsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFNUUsNkJBQWMsR0FBRyx1QkFBZSxDQUFDO2dCQUN0QyxJQUFJLEVBQUUsY0FBYztnQkFDcEIsU0FBUyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsVUFBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUNqQyxPQUFPLEVBQUUsY0FBTSxPQUFBLElBQUksY0FBYyxFQUFFLEVBQXBCLENBQW9CO2dCQUNuQyxRQUFRLEVBQUUsQ0FBQywwQkFBa0IsQ0FBQztnQkFDOUIsTUFBTSxFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBQzthQUN2QixDQUFDLENBQUM7WUFDTCxxQkFBQztTQUFBLEFBYkQsSUFhQztRQUVEO1lBQTJCLGdDQUFjO1lBQXpDO2dCQUFBLHFFQVlDO2dCQVhDLFVBQUksR0FBRyxXQUFXLENBQUM7O1lBV3JCLENBQUM7WUFUQyxnQ0FBUyxHQUFULGNBQW9CLEdBQUcsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRXpDLDJCQUFjLEdBQUcsdUJBQWUsQ0FBQztnQkFDdEMsSUFBSSxFQUFFLFlBQVk7Z0JBQ2xCLFNBQVMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDL0IsT0FBTyxFQUFFLGNBQU0sT0FBQSxJQUFJLFlBQVksRUFBRSxFQUFsQixDQUFrQjtnQkFDakMsUUFBUSxFQUFFLENBQUMscURBQXdCLENBQUM7Z0JBQ3BDLE1BQU0sRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUM7YUFDdkIsQ0FBQyxDQUFDO1lBQ0wsbUJBQUM7U0FBQSxBQVpELENBQTJCLGNBQWMsR0FZeEM7UUFFRCxJQUFNLEtBQUssR0FBSSxZQUFZLENBQUMsY0FBcUQ7YUFDOUQsT0FBTyxFQUFrQixDQUFDO1FBQzdDLEtBQUssQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDO1FBQ3JCLEtBQUssQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDO1FBRXJCLFlBQVksQ0FBQyxjQUFxRCxDQUFDLE9BQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDMUYsSUFBTSxPQUFPLEdBQUcsSUFBSSxtQkFBWSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDM0QsSUFBTSxPQUFPLEdBQUcsSUFBSSxtQkFBWSxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDNUQsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQztJQUMzRCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxtRUFBbUUsRUFBRTtRQUN0RSxJQUFNLEdBQUcsR0FBVSxFQUFFLENBQUM7UUFFdEI7WUFBQTtnQkFDRSxTQUFJLEdBQUcsV0FBVyxDQUFDO1lBWXJCLENBQUM7WUFWQyxrQ0FBUyxHQUFULGNBQW9CLEdBQUcsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEQsb0NBQVcsR0FBWCxVQUFZLE9BQXNCLElBQVUsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFNUUsNkJBQWMsR0FBRyx1QkFBZSxDQUFDO2dCQUN0QyxJQUFJLEVBQUUsY0FBYztnQkFDcEIsU0FBUyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsVUFBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUNqQyxPQUFPLEVBQUUsY0FBTSxPQUFBLElBQUksY0FBYyxFQUFFLEVBQXBCLENBQW9CO2dCQUNuQyxRQUFRLEVBQUUsQ0FBQywwQkFBa0IsQ0FBQztnQkFDOUIsTUFBTSxFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBQzthQUN2QixDQUFDLENBQUM7WUFDTCxxQkFBQztTQUFBLEFBYkQsSUFhQztRQUVEO1lBQTJCLGdDQUFjO1lBQXpDO2dCQUFBLHFFQVVDO2dCQVRDLFVBQUksR0FBRyxXQUFXLENBQUM7O1lBU3JCLENBQUM7WUFQUSwyQkFBYyxHQUFHLHVCQUFlLENBQUM7Z0JBQ3RDLElBQUksRUFBRSxZQUFZO2dCQUNsQixTQUFTLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQy9CLE9BQU8sRUFBRSxjQUFNLE9BQUEsSUFBSSxZQUFZLEVBQUUsRUFBbEIsQ0FBa0I7Z0JBQ2pDLFFBQVEsRUFBRSxDQUFDLHFEQUF3QixDQUFDO2dCQUNwQyxNQUFNLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFDO2FBQ3ZCLENBQUMsQ0FBQztZQUNMLG1CQUFDO1NBQUEsQUFWRCxDQUEyQixjQUFjLEdBVXhDO1FBRUQsSUFBTSxLQUFLLEdBQUksWUFBWSxDQUFDLGNBQXFEO2FBQzlELE9BQU8sRUFBa0IsQ0FBQztRQUM3QyxLQUFLLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQztRQUNyQixLQUFLLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQztRQUVyQixZQUFZLENBQUMsY0FBcUQsQ0FBQyxPQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzFGLElBQU0sT0FBTyxHQUFHLElBQUksbUJBQVksQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzNELElBQU0sT0FBTyxHQUFHLElBQUksbUJBQVksQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzVELE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLGlCQUFpQixDQUFDLENBQUMsQ0FBQztJQUM3RCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxrRUFBa0UsRUFBRTtRQUNyRSxJQUFNLEdBQUcsR0FBVSxFQUFFLENBQUM7UUFFdEI7WUFBQTtnQkFDRSxTQUFJLEdBQUcsV0FBVyxDQUFDO1lBU3JCLENBQUM7WUFQUSw2QkFBYyxHQUFHLHVCQUFlLENBQUM7Z0JBQ3RDLElBQUksRUFBRSxjQUFjO2dCQUNwQixTQUFTLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQy9CLE9BQU8sRUFBRSxjQUFNLE9BQUEsSUFBSSxjQUFjLEVBQUUsRUFBcEIsQ0FBb0I7Z0JBQ25DLFFBQVEsRUFBRSxFQUFFO2dCQUNaLE1BQU0sRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUM7YUFDdkIsQ0FBQyxDQUFDO1lBQ0wscUJBQUM7U0FBQSxBQVZELElBVUM7UUFFRDtZQUEyQixnQ0FBYztZQUF6QztnQkFBQSxxRUEwQkM7Z0JBekJDLFVBQUksR0FBRyxXQUFXLENBQUM7O1lBeUJyQixDQUFDO1lBdkJDLHNCQUFJLDhCQUFJO3FCQUVSLGNBQWEsT0FBTyxPQUFPLENBQUMsQ0FBQyxDQUFDO3FCQUY5QixVQUFTLEtBQWEsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzs7O2VBQUE7WUFJNUMsZ0NBQVMsR0FBVCxjQUFvQixHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1QyxrQ0FBVyxHQUFYLFVBQVksT0FBc0I7Z0JBQ2hDLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQ3hCLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNsQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDbEMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDcEMsQ0FBQztZQUVNLDJCQUFjLEdBQUcsdUJBQWUsQ0FBQztnQkFDdEMsSUFBSSxFQUFFLFlBQVk7Z0JBQ2xCLFNBQVMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLFVBQVUsRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDakMsT0FBTyxFQUFFLGNBQU0sT0FBQSxJQUFJLFlBQVksRUFBRSxFQUFsQixDQUFrQjtnQkFDakMsdURBQXVEO2dCQUN2RCxRQUFRLEVBQUU7b0JBQ1IscURBQXdCO29CQUN4QiwwQkFBa0I7aUJBQ25CO2dCQUNELE1BQU0sRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBQzthQUNyQyxDQUFDLENBQUM7WUFDTCxtQkFBQztTQUFBLEFBMUJELENBQTJCLGNBQWMsR0EwQnhDO1FBRUQsSUFBTSxLQUFLLEdBQUksWUFBWSxDQUFDLGNBQXFEO2FBQzlELE9BQU8sRUFBa0IsQ0FBQztRQUM3QyxLQUFLLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQztRQUNyQixNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUVwQyxLQUFLLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQztRQUN0QixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUNoQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUVwQyxLQUFLLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQztRQUNyQixNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUVwQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUNkLFlBQVksQ0FBQyxjQUFxRCxDQUFDLE9BQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDMUYsSUFBTSxPQUFPLEdBQUcsSUFBSSxtQkFBWSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDM0QsSUFBTSxPQUFPLEdBQUcsSUFBSSxtQkFBWSxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDNUQsSUFBTSxPQUFPLEdBQUcsSUFBSSxtQkFBWSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDM0QsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FDZixDQUFDLGFBQWEsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDO0lBQ3ZGLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLGdDQUFnQyxFQUFFO1FBQ25DO1lBQUE7Z0JBQ1MsUUFBRyxHQUF5QyxFQUFFLENBQUM7Z0JBQy9DLFNBQUksR0FBVyxXQUFXLENBQUM7WUFnQnBDLENBQUM7WUFaQyxpQ0FBVyxHQUFYLFVBQVksT0FBc0I7Z0JBQ2hDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDdkMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3pDLENBQUM7WUFFTSwwQkFBYyxHQUFHLHVCQUFlLENBQUM7Z0JBQ3RDLElBQUksRUFBRSxXQUFXO2dCQUNqQixTQUFTLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQzlCLE9BQU8sRUFBRSxjQUFNLE9BQUEsSUFBSSxXQUFXLEVBQUUsRUFBakIsQ0FBaUI7Z0JBQ2hDLFFBQVEsRUFBRSxDQUFDLDBCQUFrQixDQUFDO2dCQUM5QixNQUFNLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUM7YUFDckMsQ0FBQyxDQUFDO1lBQ0wsa0JBQUM7U0FBQSxBQWxCRCxJQWtCQztRQUVELElBQU0sS0FBSyxHQUNOLFdBQVcsQ0FBQyxjQUFvRCxDQUFDLE9BQU8sRUFBaUIsQ0FBQztRQUMvRixLQUFLLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQztRQUNyQixLQUFLLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQztRQUNyQixXQUFXLENBQUMsY0FBb0QsQ0FBQyxPQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3hGLElBQU0sUUFBUSxHQUFHLElBQUksbUJBQVksQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzVELElBQU0sUUFBUSxHQUFHLElBQUksbUJBQVksQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzdELE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUVoRSxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDckIsS0FBSyxDQUFDLElBQUksR0FBRyxPQUFPLENBQUM7UUFDcEIsV0FBVyxDQUFDLGNBQW9ELENBQUMsT0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN4RixJQUFNLFFBQVEsR0FBRyxJQUFJLG1CQUFZLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUMzRCxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFDbkUsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMscUVBQXFFLEVBQUU7UUFDeEU7WUFBQTtnQkFDUyxRQUFHLEdBQStCLEVBQUUsQ0FBQztZQWdCOUMsQ0FBQztZQWRDLHNCQUFXLG1DQUFVO3FCQUFyQixVQUFzQixLQUFhLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7ZUFBQTtZQUU5RCxpQ0FBVyxHQUFYLFVBQVksT0FBc0I7Z0JBQ2hDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUM3QixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFDckQsQ0FBQztZQUVNLDBCQUFjLEdBQUcsdUJBQWUsQ0FBQztnQkFDdEMsSUFBSSxFQUFFLFdBQVc7Z0JBQ2pCLFNBQVMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDOUIsT0FBTyxFQUFFLGNBQU0sT0FBQSxJQUFJLFdBQVcsRUFBRSxFQUFqQixDQUFpQjtnQkFDaEMsUUFBUSxFQUFFLENBQUMsMEJBQWtCLENBQUM7Z0JBQzlCLE1BQU0sRUFBRSxFQUFDLFVBQVUsRUFBRSxZQUFZLEVBQUM7YUFDbkMsQ0FBQyxDQUFDO1lBQ0wsa0JBQUM7U0FBQSxBQWpCRCxJQWlCQztRQUVELElBQU0sS0FBSyxHQUNOLFdBQVcsQ0FBQyxjQUFvRCxDQUFDLE9BQU8sRUFBaUIsQ0FBQztRQUMvRixLQUFLLENBQUMsVUFBVSxHQUFHLFdBQVcsQ0FBQztRQUMvQixNQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3hDLFdBQVcsQ0FBQyxjQUFvRCxDQUFDLE9BQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEYsSUFBTSxZQUFZLEdBQUcsSUFBSSxtQkFBWSxDQUFDLFNBQVMsRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDcEUsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxXQUFXLEVBQUUsYUFBYSxFQUFFLFlBQVksRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDO0lBQ3RGLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==