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
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
{
    describe('SlicePipe', function () {
        var list;
        var str;
        var pipe;
        beforeEach(function () {
            list = [1, 2, 3, 4, 5];
            str = 'tuvwxyz';
            pipe = new common_1.SlicePipe();
        });
        describe('supports', function () {
            it('should support strings', function () { matchers_1.expect(function () { return pipe.transform(str, 0); }).not.toThrow(); });
            it('should support lists', function () { matchers_1.expect(function () { return pipe.transform(list, 0); }).not.toThrow(); });
            it('should not support other objects', function () { matchers_1.expect(function () { return pipe.transform({}, 0); }).toThrow(); });
        });
        describe('transform', function () {
            it('should return null if the value is null', function () { matchers_1.expect(pipe.transform(null, 1)).toBe(null); });
            it('should return all items after START index when START is positive and END is omitted', function () {
                matchers_1.expect(pipe.transform(list, 3)).toEqual([4, 5]);
                matchers_1.expect(pipe.transform(str, 3)).toEqual('wxyz');
            });
            it('should return last START items when START is negative and END is omitted', function () {
                matchers_1.expect(pipe.transform(list, -3)).toEqual([3, 4, 5]);
                matchers_1.expect(pipe.transform(str, -3)).toEqual('xyz');
            });
            it('should return all items between START and END index when START and END are positive', function () {
                matchers_1.expect(pipe.transform(list, 1, 3)).toEqual([2, 3]);
                matchers_1.expect(pipe.transform(str, 1, 3)).toEqual('uv');
            });
            it('should return all items between START and END from the end when START and END are negative', function () {
                matchers_1.expect(pipe.transform(list, -4, -2)).toEqual([2, 3]);
                matchers_1.expect(pipe.transform(str, -4, -2)).toEqual('wx');
            });
            it('should return an empty value if START is greater than END', function () {
                matchers_1.expect(pipe.transform(list, 4, 2)).toEqual([]);
                matchers_1.expect(pipe.transform(str, 4, 2)).toEqual('');
            });
            it('should return an empty value if START greater than input length', function () {
                matchers_1.expect(pipe.transform(list, 99)).toEqual([]);
                matchers_1.expect(pipe.transform(str, 99)).toEqual('');
            });
            it('should return entire input if START is negative and greater than input length', function () {
                matchers_1.expect(pipe.transform(list, -99)).toEqual([1, 2, 3, 4, 5]);
                matchers_1.expect(pipe.transform(str, -99)).toEqual('tuvwxyz');
            });
            it('should not modify the input list', function () {
                matchers_1.expect(pipe.transform(list, 2)).toEqual([3, 4, 5]);
                matchers_1.expect(list).toEqual([1, 2, 3, 4, 5]);
            });
        });
        describe('integration', function () {
            var TestComp = /** @class */ (function () {
                function TestComp() {
                }
                TestComp = __decorate([
                    core_1.Component({ selector: 'test-comp', template: '{{(data | slice:1).join(",") }}' })
                ], TestComp);
                return TestComp;
            }());
            beforeEach(function () {
                testing_1.TestBed.configureTestingModule({ declarations: [TestComp], imports: [common_1.CommonModule] });
            });
            it('should work with mutable arrays', testing_1.async(function () {
                var fixture = testing_1.TestBed.createComponent(TestComp);
                var mutable = [1, 2];
                fixture.componentInstance.data = mutable;
                fixture.detectChanges();
                matchers_1.expect(fixture.nativeElement).toHaveText('2');
                mutable.push(3);
                fixture.detectChanges();
                matchers_1.expect(fixture.nativeElement).toHaveText('2,3');
            }));
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpY2VfcGlwZV9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tbW9uL3Rlc3QvcGlwZXMvc2xpY2VfcGlwZV9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7O0FBRUgsMENBQXdEO0FBQ3hELHNDQUF3QztBQUN4QyxpREFBcUQ7QUFDckQsMkVBQXNFO0FBRXRFO0lBQ0UsUUFBUSxDQUFDLFdBQVcsRUFBRTtRQUNwQixJQUFJLElBQWMsQ0FBQztRQUNuQixJQUFJLEdBQVcsQ0FBQztRQUNoQixJQUFJLElBQWUsQ0FBQztRQUVwQixVQUFVLENBQUM7WUFDVCxJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDdkIsR0FBRyxHQUFHLFNBQVMsQ0FBQztZQUNoQixJQUFJLEdBQUcsSUFBSSxrQkFBUyxFQUFFLENBQUM7UUFDekIsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsVUFBVSxFQUFFO1lBQ25CLEVBQUUsQ0FBQyx3QkFBd0IsRUFBRSxjQUFRLGlCQUFNLENBQUMsY0FBTSxPQUFBLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUF0QixDQUFzQixDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUYsRUFBRSxDQUFDLHNCQUFzQixFQUFFLGNBQVEsaUJBQU0sQ0FBQyxjQUFNLE9BQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQXZCLENBQXVCLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUUzRixFQUFFLENBQUMsa0NBQWtDLEVBQ2xDLGNBQVEsaUJBQU0sQ0FBQyxjQUFNLE9B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