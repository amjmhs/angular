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
{
    describe('LowerCasePipe', function () {
        var pipe;
        beforeEach(function () { pipe = new common_1.LowerCasePipe(); });
        it('should return lowercase', function () { expect(pipe.transform('FOO')).toEqual('foo'); });
        it('should lowercase when there is a new value', function () {
            expect(pipe.transform('FOO')).toEqual('foo');
            expect(pipe.transform('BAr')).toEqual('bar');
        });
        it('should not support other objects', function () { expect(function () { return pipe.transform({}); }).toThrowError(); });
    });
    describe('TitleCasePipe', function () {
        var pipe;
        beforeEach(function () { pipe = new common_1.TitleCasePipe(); });
        it('should return titlecase', function () { expect(pipe.transform('foo')).toEqual('Foo'); });
        it('should return titlecase for subsequent words', function () { expect(pipe.transform('one TWO Three fouR')).toEqual('One Two Three Four'); });
        it('should support empty strings', function () { expect(pipe.transform('')).toEqual(''); });
        it('should persist whitespace', function () { expect(pipe.transform('one   two')).toEqual('One   Two'); });
        it('should titlecase when there is a new value', function () {
            expect(pipe.transform('bar')).toEqual('Bar');
            expect(pipe.transform('foo')).toEqual('Foo');
        });
        it('should not capitalize letter after the quotes', function () { expect(pipe.transform('it\'s complicated')).toEqual('It\'s Complicated'); });
        it('should not treat non-space character as a separator', function () {
            expect(pipe.transform('one,two,three')).toEqual('One,two,three');
            expect(pipe.transform('true|false')).toEqual('True|false');
            expect(pipe.transform('foo-vs-bar')).toEqual('Foo-vs-bar');
        });
        it('should support support all whitespace characters', function () {
            expect(pipe.transform('one\ttwo')).toEqual('One\tTwo');
            expect(pipe.transform('three\rfour')).toEqual('Three\rFour');
            expect(pipe.transform('five\nsix')).toEqual('Five\nSix');
        });
        it('should work properly for non-latin alphabet', function () {
            expect(pipe.transform('føderation')).toEqual('Føderation');
            expect(pipe.transform('poniedziałek')).toEqual('Poniedziałek');
            expect(pipe.transform('éric')).toEqual('Éric');
        });
        it('should not support other objects', function () { expect(function () { return pipe.transform({}); }).toThrowError(); });
    });
    describe('UpperCasePipe', function () {
        var pipe;
        beforeEach(function () { pipe = new common_1.UpperCasePipe(); });
        it('should return uppercase', function () { expect(pipe.transform('foo')).toEqual('FOO'); });
        it('should uppercase when there is a new value', function () {
            expect(pipe.transform('foo')).toEqual('FOO');
            expect(pipe.transform('bar')).toEqual('BAR');
        });
        it('should not support other objects', function () { expect(function () { return pipe.transform({}); }).toThrowError(); });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FzZV9jb252ZXJzaW9uX3BpcGVzX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21tb24vdGVzdC9waXBlcy9jYXNlX2NvbnZlcnNpb25fcGlwZXNfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILDBDQUE0RTtBQUU1RTtJQUNFLFFBQVEsQ0FBQyxlQUFlLEVBQUU7UUFDeEIsSUFBSSxJQUFtQixDQUFDO1FBRXhCLFVBQVUsQ0FBQyxjQUFRLElBQUksR0FBRyxJQUFJLHNCQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRWxELEVBQUUsQ0FBQyx5QkFBeUIsRUFBRSxjQUFRLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFdkYsRUFBRSxDQUFDLDRDQUE0QyxFQUFFO1lBQy9DLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzdDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQy9DLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLGtDQUFrQyxFQUNsQyxjQUFRLE1BQU0sQ0FBQyxjQUFNLE9BQUEsSUFBSSxDQUFDLFNBQVMsQ0FBTSxFQUFFLENBQUMsRUFBdkIsQ0FBdUIsQ0FBQyxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdEUsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsZUFBZSxFQUFFO1FBQ3hCLElBQUksSUFBbUIsQ0FBQztRQUV4QixVQUFVLENBQUMsY0FBUSxJQUFJLEdBQUcsSUFBSSxzQkFBYSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVsRCxFQUFFLENBQUMseUJBQXlCLEVBQUUsY0FBUSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXZGLEVBQUUsQ0FBQyw4Q0FBOEMsRUFDOUMsY0FBUSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUUxRixFQUFFLENBQUMsOEJBQThCLEVBQUUsY0FBUSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXRGLEVBQUUsQ0FBQywyQkFBMkIsRUFDM0IsY0FBUSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXhFLEVBQUUsQ0FBQyw0Q0FBNEMsRUFBRTtZQUMvQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM3QyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMvQyxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywrQ0FBK0MsRUFDL0MsY0FBUSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV4RixFQUFFLENBQUMscURBQXFELEVBQUU7WUFDeEQsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDakUsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDM0QsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDN0QsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsa0RBQWtELEVBQUU7WUFDckQsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDdkQsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDN0QsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDM0QsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsNkNBQTZDLEVBQUU7WUFDaEQsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDM0QsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDL0QsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDakQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsa0NBQWtDLEVBQ2xDLGNBQVEsTUFBTSxDQUFDLGNBQU0sT0FBQSxJQUFJLENBQUMsU0FBUyxDQUFNLEVBQUUsQ0FBQyxFQUF2QixDQUF1QixDQUFDLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN0RSxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxlQUFlLEVBQUU7UUFDeEIsSUFBSSxJQUFtQixDQUFDO1FBRXhCLFVBQVUsQ0FBQyxjQUFRLElBQUksR0FBRyxJQUFJLHNCQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRWxELEVBQUUsQ0FBQyx5QkFBeUIsRUFBRSxjQUFRLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFdkYsRUFBRSxDQUFDLDRDQUE0QyxFQUFFO1lBQy9DLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzdDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQy9DLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLGtDQUFrQyxFQUNsQyxjQUFRLE1BQU0sQ0FBQyxjQUFNLE9BQUEsSUFBSSxDQUFDLFNBQVMsQ0FBTSxFQUFFLENBQUMsRUFBdkIsQ0FBdUIsQ0FBQyxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdEUsQ0FBQyxDQUFDLENBQUM7Q0FDSiJ9