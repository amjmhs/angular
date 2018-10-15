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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
var reflection_1 = require("../../src/reflection/reflection");
var decorators_1 = require("../../src/util/decorators");
var DecoratedParent = /** @class */ (function () {
    function DecoratedParent() {
    }
    return DecoratedParent;
}());
var DecoratedChild = /** @class */ (function (_super) {
    __extends(DecoratedChild, _super);
    function DecoratedChild() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DecoratedChild;
}(DecoratedParent));
{
    var TerminalDecorator_1 = decorators_1.makeDecorator('TerminalDecorator', function (data) { return (__assign({ terminal: true }, data)); });
    var TestDecorator_1 = decorators_1.makeDecorator('TestDecorator', function (data) { return data; }, Object, function (fn) { return fn.Terminal = TerminalDecorator_1; });
    describe('Property decorators', function () {
        // https://github.com/angular/angular/issues/12224
        it('should work on the "watch" property', function () {
            var Prop = decorators_1.makePropDecorator('Prop', function (value) { return ({ value: value }); });
            var TestClass = /** @class */ (function () {
                function TestClass() {
                }
                __decorate([
                    Prop('firefox!'),
                    __metadata("design:type", Object)
                ], TestClass.prototype, "watch", void 0);
                return TestClass;
            }());
            var p = reflection_1.reflector.propMetadata(TestClass);
            expect(p['watch']).toEqual([new Prop('firefox!')]);
        });
        it('should work with any default plain values', function () {
            var Default = decorators_1.makePropDecorator('Default', function (data) { return ({ value: data != null ? data : 5 }); });
            expect(new Default(0)['value']).toEqual(0);
        });
        it('should work with any object values', function () {
            // make sure we don't walk up the prototype chain
            var Default = decorators_1.makePropDecorator('Default', function (data) { return (__assign({ value: 5 }, data)); });
            var value = Object.create({ value: 10 });
            expect(new Default(value)['value']).toEqual(5);
        });
    });
    describe('decorators', function () {
        it('should invoke as decorator', function () {
            function Type() { }
            TestDecorator_1({ marker: 'WORKS' })(Type);
            var annotations = Type[decorators_1.ANNOTATIONS];
            expect(annotations[0].marker).toEqual('WORKS');
        });
        it('should invoke as new', function () {
            var annotation = new TestDecorator_1({ marker: 'WORKS' });
            expect(annotation instanceof TestDecorator_1).toEqual(true);
            expect(annotation.marker).toEqual('WORKS');
        });
        it('should not apply decorators from the prototype chain', function () {
            TestDecorator_1({ marker: 'parent' })(DecoratedParent);
            TestDecorator_1({ marker: 'child' })(DecoratedChild);
            var annotations = DecoratedChild[decorators_1.ANNOTATIONS];
            expect(annotations.length).toBe(1);
            expect(annotations[0].marker).toEqual('child');
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVjb3JhdG9yc19zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L3V0aWwvZGVjb3JhdG9yc19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsOERBQTBEO0FBQzFELHdEQUF3RjtBQUV4RjtJQUFBO0lBQXVCLENBQUM7SUFBRCxzQkFBQztBQUFELENBQUMsQUFBeEIsSUFBd0I7QUFDeEI7SUFBNkIsa0NBQWU7SUFBNUM7O0lBQThDLENBQUM7SUFBRCxxQkFBQztBQUFELENBQUMsQUFBL0MsQ0FBNkIsZUFBZSxHQUFHO0FBRS9DO0lBQ0UsSUFBTSxtQkFBaUIsR0FDbkIsMEJBQWEsQ0FBQyxtQkFBbUIsRUFBRSxVQUFDLElBQVMsSUFBSyxPQUFBLFlBQUUsUUFBUSxFQUFFLElBQUksSUFBSyxJQUFJLEVBQUUsRUFBM0IsQ0FBMkIsQ0FBQyxDQUFDO0lBQ25GLElBQU0sZUFBYSxHQUFHLDBCQUFhLENBQy9CLGVBQWUsRUFBRSxVQUFDLElBQVMsSUFBSyxPQUFBLElBQUksRUFBSixDQUFJLEVBQUUsTUFBTSxFQUFFLFVBQUMsRUFBTyxJQUFLLE9BQUEsRUFBRSxDQUFDLFFBQVEsR0FBRyxtQkFBaUIsRUFBL0IsQ0FBK0IsQ0FBQyxDQUFDO0lBRWhHLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRTtRQUM5QixrREFBa0Q7UUFDbEQsRUFBRSxDQUFDLHFDQUFxQyxFQUFFO1lBQ3hDLElBQU0sSUFBSSxHQUFHLDhCQUFpQixDQUFDLE1BQU0sRUFBRSxVQUFDLEtBQVUsSUFBSyxPQUFBLENBQUMsRUFBQyxLQUFLLE9BQUEsRUFBQyxDQUFDLEVBQVQsQ0FBUyxDQUFDLENBQUM7WUFFbEU7Z0JBQUE7Z0JBR0EsQ0FBQztnQkFEQztvQkFEQyxJQUFJLENBQUMsVUFBVSxDQUFDOzt3REFDTjtnQkFDYixn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