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
var metadata_overrider_1 = require("@angular/platform-browser-dynamic/testing/src/metadata_overrider");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
var SomeMetadata = /** @class */ (function () {
    function SomeMetadata(options) {
        this.plainProp = options.plainProp;
        this._getterProp = options.getterProp;
        this.arrayProp = options.arrayProp;
    }
    Object.defineProperty(SomeMetadata.prototype, "getterProp", {
        get: function () { return this._getterProp; },
        enumerable: true,
        configurable: true
    });
    return SomeMetadata;
}());
var OtherMetadata = /** @class */ (function (_super) {
    __extends(OtherMetadata, _super);
    function OtherMetadata(options) {
        var _this = _super.call(this, {
            plainProp: options.plainProp,
            getterProp: options.getterProp,
            arrayProp: options.arrayProp
        }) || this;
        _this.otherPlainProp = options.otherPlainProp;
        return _this;
    }
    return OtherMetadata;
}(SomeMetadata));
{
    describe('metadata overrider', function () {
        var overrider;
        beforeEach(function () { overrider = new metadata_overrider_1.MetadataOverrider(); });
        it('should return a new instance with the same values', function () {
            var oldInstance = new SomeMetadata({ plainProp: 'somePlainProp', getterProp: 'someInput' });
            var newInstance = overrider.overrideMetadata(SomeMetadata, oldInstance, {});
            matchers_1.expect(newInstance).not.toBe(oldInstance);
            matchers_1.expect(newInstance).toBeAnInstanceOf(SomeMetadata);
            matchers_1.expect(newInstance).toEqual(oldInstance);
        });
        it('should set individual properties and keep others', function () {
            var oldInstance = new SomeMetadata({ plainProp: 'somePlainProp', getterProp: 'someGetterProp' });
            var newInstance = overrider.overrideMetadata(SomeMetadata, oldInstance, { set: { plainProp: 'newPlainProp' } });
            matchers_1.expect(newInstance)
                .toEqual(new SomeMetadata({ plainProp: 'newPlainProp', getterProp: 'someGetterProp' }));
        });
        describe('add properties', function () {
            it('should replace non array values', function () {
                var oldInstance = new SomeMetadata({ plainProp: 'somePlainProp', getterProp: 'someGetterProp' });
                var newInstance = overrider.overrideMetadata(SomeMetadata, oldInstance, { add: { plainProp: 'newPlainProp' } });
                matchers_1.expect(newInstance)
                    .toEqual(new SomeMetadata({ plainProp: 'newPlainProp', getterProp: 'someGetterProp' }));
            });
            it('should add to array values', function () {
                var oldInstance = new SomeMetadata({ arrayProp: ['a'] });
                var newInstance = overrider.overrideMetadata(SomeMetadata, oldInstance, { add: { arrayProp: ['b'] } });
                matchers_1.expect(newInstance).toEqual(new SomeMetadata({ arrayProp: ['a', 'b'] }));
            });
        });
        describe('remove', function () {
            it('should set values to undefined if their value matches', function () {
                var oldInstance = new SomeMetadata({ plainProp: 'somePlainProp', getterProp: 'someGetterProp' });
                var newInstance = overrider.overrideMetadata(SomeMetadata, oldInstance, { remove: { plainProp: 'somePlainProp' } });
                matchers_1.expect(newInstance)
                    .toEqual(new SomeMetadata({ plainProp: undefined, getterProp: 'someGetterProp' }));
            });
            it('should leave values if their value does not match', function () {
                var oldInstance = new SomeMetadata({ plainProp: 'somePlainProp', getterProp: 'someGetterProp' });
                var newInstance = overrider.overrideMetadata(SomeMetadata, oldInstance, { remove: { plainProp: 'newPlainProp' } });
                matchers_1.expect(newInstance)
                    .toEqual(new SomeMetadata({ plainProp: 'somePlainProp', getterProp: 'someGetterProp' }));
            });
            it('should remove a value from an array', function () {
                var oldInstance = new SomeMetadata({ arrayProp: ['a', 'b', 'c'], getterProp: 'someGetterProp' });
                var newInstance = overrider.overrideMetadata(SomeMetadata, oldInstance, { remove: { arrayProp: ['a', 'c'] } });
                matchers_1.expect(newInstance)
                    .toEqual(new SomeMetadata({ arrayProp: ['b'], getterProp: 'someGetterProp' }));
            });
            it('should support types as values', function () {
                var Class1 = /** @class */ (function () {
                    function Class1() {
                    }
                    return Class1;
                }());
                var Class2 = /** @class */ (function () {
                    function Class2() {
                    }
                    return Class2;
                }());
                var Class3 = /** @class */ (function () {
                    function Class3() {
                    }
                    return Class3;
                }());
                var instance1 = new SomeMetadata({ arrayProp: [Class1, Class2, Class3] });
                var instance2 = overrider.overrideMetadata(SomeMetadata, instance1, { remove: { arrayProp: [Class1] } });
                matchers_1.expect(instance2).toEqual(new SomeMetadata({ arrayProp: [Class2, Class3] }));
                var instance3 = overrider.overrideMetadata(SomeMetadata, instance2, { remove: { arrayProp: [Class3] } });
                matchers_1.expect(instance3).toEqual(new SomeMetadata({ arrayProp: [Class2] }));
            });
        });
        describe('subclasses', function () {
            it('should set individual properties and keep others', function () {
                var oldInstance = new OtherMetadata({
                    plainProp: 'somePlainProp',
                    getterProp: 'someGetterProp',
                    otherPlainProp: 'newOtherProp'
                });
                var newInstance = overrider.overrideMetadata(OtherMetadata, oldInstance, { set: { plainProp: 'newPlainProp' } });
                matchers_1.expect(newInstance).toEqual(new OtherMetadata({
                    plainProp: 'newPlainProp',
                    getterProp: 'someGetterProp',
                    otherPlainProp: 'newOtherProp'
                }));
            });
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0YWRhdGFfb3ZlcnJpZGVyX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS1icm93c2VyLWR5bmFtaWMvdGVzdC9tZXRhZGF0YV9vdmVycmlkZXJfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7QUFFSCx1R0FBbUc7QUFDbkcsMkVBQXNFO0FBWXRFO0lBTUUsc0JBQVksT0FBeUI7UUFDbkMsSUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsU0FBVyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDLFVBQVksQ0FBQztRQUN4QyxJQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxTQUFXLENBQUM7SUFDdkMsQ0FBQztJQVBELHNCQUFJLG9DQUFVO2FBQWQsY0FBMkIsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFRdkQsbUJBQUM7QUFBRCxDQUFDLEFBWEQsSUFXQztBQUVEO0lBQTRCLGlDQUFZO0lBR3RDLHVCQUFZLE9BQTBCO1FBQXRDLFlBQ0Usa0JBQU07WUFDSixTQUFTLEVBQUUsT0FBTyxDQUFDLFNBQVM7WUFDNUIsVUFBVSxFQUFFLE9BQU8sQ0FBQyxVQUFVO1lBQzlCLFNBQVMsRUFBRSxPQUFPLENBQUMsU0FBUztTQUM3QixDQUFDLFNBR0g7UUFEQyxLQUFJLENBQUMsY0FBYyxHQUFHLE9BQU8sQ0FBQyxjQUFnQixDQUFDOztJQUNqRCxDQUFDO0lBQ0gsb0JBQUM7QUFBRCxDQUFDLEFBWkQsQ0FBNEIsWUFBWSxHQVl2QztBQUVEO0lBQ0UsUUFBUSxDQUFDLG9CQUFvQixFQUFFO1FBQzdCLElBQUksU0FBNEIsQ0FBQztRQUVqQyxVQUFVLENBQUMsY0FBUSxTQUFTLEdBQUcsSUFBSSxzQ0FBaUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFF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