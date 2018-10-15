"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var iterable_differs_1 = require("@angular/core/src/change_detection/differs/iterable_differs");
var spies_1 = require("../../spies");
{
    describe('IterableDiffers', function () {
        var factory1;
        var factory2;
        var factory3;
        beforeEach(function () {
            factory1 = new spies_1.SpyIterableDifferFactory();
            factory2 = new spies_1.SpyIterableDifferFactory();
            factory3 = new spies_1.SpyIterableDifferFactory();
        });
        it('should throw when no suitable implementation found', function () {
            var differs = new iterable_differs_1.IterableDiffers([]);
            expect(function () { return differs.find('some object'); })
                .toThrowError(/Cannot find a differ supporting object 'some object'/);
        });
        it('should return the first suitable implementation', function () {
            factory1.spy('supports').and.returnValue(false);
            factory2.spy('supports').and.returnValue(true);
            factory3.spy('supports').and.returnValue(true);
            var differs = iterable_differs_1.IterableDiffers.create([factory1, factory2, factory3]);
            expect(differs.find('some object')).toBe(factory2);
        });
        it('should copy over differs from the parent repo', function () {
            factory1.spy('supports').and.returnValue(true);
            factory2.spy('supports').and.returnValue(false);
            var parent = iterable_differs_1.IterableDiffers.create([factory1]);
            var child = iterable_differs_1.IterableDiffers.create([factory2], parent);
            expect(child.factories).toEqual([factory2, factory1]);
        });
        describe('.extend()', function () {
            it('should throw if calling extend when creating root injector', function () {
                var injector = core_1.Injector.create([iterable_differs_1.IterableDiffers.extend([])]);
                expect(function () { return injector.get(iterable_differs_1.IterableDiffers); })
                    .toThrowError(/Cannot extend IterableDiffers without a parent injector/);
            });
            it('should extend di-inherited differs', function () {
                var parent = new iterable_differs_1.IterableDiffers([factory1]);
                var injector = core_1.Injector.create([{ provide: iterable_differs_1.IterableDiffers, useValue: parent }]);
                var childInjector = core_1.Injector.create([iterable_differs_1.IterableDiffers.extend([factory2])], injector);
                expect(injector.get(iterable_differs_1.IterableDiffers).factories).toEqual([factory1]);
                expect(childInjector.get(iterable_differs_1.IterableDiffers).factories).toEqual([
                    factory2, factory1
                ]);
            });
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlcmFibGVfZGlmZmVyc19zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L2NoYW5nZV9kZXRlY3Rpb24vZGlmZmVycy9pdGVyYWJsZV9kaWZmZXJzX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxzQ0FBdUM7QUFDdkMsZ0dBQTRGO0FBRTVGLHFDQUFxRDtBQUVyRDtJQUNFLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRTtRQUMxQixJQUFJLFFBQWEsQ0FBQztRQUNsQixJQUFJLFFBQWEsQ0FBQztRQUNsQixJQUFJLFFBQWEsQ0FBQztRQUVsQixVQUFVLENBQUM7WUFDVCxRQUFRLEdBQUcsSUFBSSxnQ0FBd0IsRUFBRSxDQUFDO1lBQzFDLFFBQVEsR0FBRyxJQUFJLGdDQUF3QixFQUFFLENBQUM7WUFDMUMsUUFBUSxHQUFHLElBQUksZ0NBQXdCLEVBQUUsQ0FBQztRQUM1QyxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxvREFBb0QsRUFBRTtZQUN2RCxJQUFNLE9BQU8sR0FBRyxJQUFJLGtDQUFlLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDeEMsTUFBTSxDQUFDLGNBQU0sT0FBQSxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUEzQixDQUEyQixDQUFDO2lCQUNwQyxZQUFZLENBQUMsc0RBQXNELENBQUMsQ0FBQztRQUM1RSxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxpREFBaUQsRUFBRTtZQUNwRCxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDaEQsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQy9DLFFBQVEsQ0FBQyxHQUFHLENB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