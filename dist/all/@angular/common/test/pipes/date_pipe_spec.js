"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var en_1 = require("@angular/common/locales/en");
var en_2 = require("@angular/common/locales/extra/en");
var pipe_resolver_1 = require("@angular/compiler/src/pipe_resolver");
var compiler_reflector_1 = require("@angular/platform-browser-dynamic/src/compiler_reflector");
{
    var date_1;
    describe('DatePipe', function () {
        var isoStringWithoutTime = '2015-01-01';
        var pipe;
        // Check the transformation of a date into a pattern
        function expectDateFormatAs(date, pattern, output) {
            expect(pipe.transform(date, pattern)).toEqual(output);
        }
        beforeAll(function () { common_1.registerLocaleData(en_1.default, en_2.default); });
        beforeEach(function () {
            date_1 = new Date(2015, 5, 15, 9, 3, 1, 550);
            pipe = new common_1.DatePipe('en-US');
        });
        it('should be marked as pure', function () {
            expect(new pipe_resolver_1.PipeResolver(new compiler_reflector_1.JitReflector()).resolve(common_1.DatePipe).pure).toEqual(true);
        });
        describe('supports', function () {
            it('should support date', function () { expect(function () { return pipe.transform(date_1); }).not.toThrow(); });
            it('should support int', function () { expect(function () { return pipe.transform(123456789); }).not.toThrow(); });
            it('should support numeric strings', function () { expect(function () { return pipe.transform('123456789'); }).not.toThrow(); });
            it('should support decimal strings', function () { expect(function () { return pipe.transform('123456789.11'); }).not.toThrow(); });
            it('should support ISO string', function () { return expect(function () { return pipe.transform('2015-06-15T21:43:11Z'); }).not.toThrow(); });
            it('should return null for empty string', function () { expect(pipe.transform('')).toEqual(null); });
            it('should return null for NaN', function () { expect(pipe.transform(Number.NaN)).toEqual(null); });
            it('should support ISO string without time', function () { expect(function () { return pipe.transform(isoStringWithoutTime); }).not.toThrow(); });
            it('should not support other objects', function () { expect(function () { return pipe.transform({}); }).toThrowError(/InvalidPipeArgument/); });
        });
        describe('transform', function () {
            it('should use "mediumDate" as the default format', function () { return expect(pipe.transform('2017-01-11T10:14:39+0000')).toEqual('Jan 11, 2017'); });
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZV9waXBlX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21tb24vdGVzdC9waXBlcy9kYXRlX3BpcGVfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILDBDQUE2RDtBQUM3RCxpREFBa0Q7QUFDbEQsdURBQTZEO0FBQzdELHFFQUFpRTtBQUNqRSwrRkFBc0Y7QUFFdEY7SUFDRSxJQUFJLE1BQVUsQ0FBQztJQUNmLFFBQVEsQ0FBQyxVQUFVLEVBQUU7UUFDbkIsSUFBTSxvQkFBb0IsR0FBRyxZQUFZLENBQUM7UUFDMUMsSUFBSSxJQUFjLENBQUM7UUFFbkIsb0RBQW9EO1FBQ3BELDRCQUE0QixJQUFtQixFQUFFLE9BQVksRUFBRSxNQUFjO1lBQzNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN4RCxDQUFDO1FBRUQsU0FBUyxDQUFDLGNBQVEsMkJBQWtCLENBQUMsWUFBUSxFQUFFLFlBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFbEUsVUFBVSxDQUFDO1lBQ1QsTUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQzNDLElBQUksR0FBRyxJQUFJLGlCQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDL0IsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsMEJBQTBCLEVBQUU7WUFDN0IsTUFBTSxDQUFDLElBQUksNEJBQVksQ0FBQyxJQUFJLGlDQUFZLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxpQkFBUSxDQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3RGLENBQUMsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLFVBQVUsRUFBRTtZQUNuQixFQUFFLENBQUMscUJBQXFCLEVBQUUsY0FBUSxNQUFNLENBQUMsY0FBTSxPQUFBLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBSSxDQUFDLEVBQXBCLENBQW9CLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUV2RixFQUFFLENBQUMsb0JBQW9CLEVBQUUsY0FBUSxNQUFNLENBQUMsY0FBTSxPQUFBLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEVBQXpCLENBQXlCLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUUzRixFQUFFLENBQUMsZ0NBQWdDLEVBQ2hDLGNBQVEsTUFBTSxDQUFDLGNBQU0sT0FBQSxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxFQUEzQixDQUEyQixDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFdkUsRUFBRSxDQUFDLGdDQUFnQyxFQUNoQyxjQUFRLE1BQU0sQ0FBQyxjQUFNLE9BQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsRUFBOUIsQ0FBOEIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRTFFLEVBQUUsQ0FBQywyQkFBMkIsRUFDM0IsY0FBTSxPQUFBLE1BQU0sQ0FBQyxjQUFNLE9BQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxzQkFBc0IsQ0FBQyxFQUF0QyxDQUFzQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxFQUFsRSxDQUFrRSxDQUFDLENBQUM7WUFFN0UsRUFBRSxDQUFDLHFDQUFxQyxFQUNyQyxjQUFRLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFeEQsRUFBRSxDQUFDLDRCQUE0QixFQUFFLGNBQVEsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFOUYsRUFBRSxDQUFDLHdDQUF3QyxFQUN4QyxjQUFRLE1BQU0sQ0FBQyxjQUFNLE9BQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQyxFQUFwQyxDQUFvQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFaEYsRUFBRSxDQUFDLGtDQUFrQyxFQUNsQyxjQUFRLE1BQU0sQ0FBQyxjQUFNLE9BQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsRUFBbEIsQ0FBa0IsQ0FBQyxDQUFDLFlBQVksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEYsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsV0FBVyxFQUFFO1lBQ3BCLEVBQUUsQ0FBQywrQ0FBK0MsRUFDL0MsY0FBTSxPQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLDBCQUEwQixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLEVBQTFFLENBQTBFLENBQUMsQ0FBQztRQUN2RixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0NBQ0oifQ==