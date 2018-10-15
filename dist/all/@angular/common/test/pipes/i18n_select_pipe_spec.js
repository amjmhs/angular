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
var pipe_resolver_1 = require("@angular/compiler/src/pipe_resolver");
var compiler_reflector_1 = require("@angular/platform-browser-dynamic/src/compiler_reflector");
{
    describe('I18nSelectPipe', function () {
        var pipe = new common_1.I18nSelectPipe();
        var mapping = { 'male': 'Invite him.', 'female': 'Invite her.', 'other': 'Invite them.' };
        it('should be marked as pure', function () {
            expect(new pipe_resolver_1.PipeResolver(new compiler_reflector_1.JitReflector()).resolve(common_1.I18nSelectPipe).pure).toEqual(true);
        });
        describe('transform', function () {
            it('should return the "male" text if value is "male"', function () {
                var val = pipe.transform('male', mapping);
                expect(val).toEqual('Invite him.');
            });
            it('should return the "female" text if value is "female"', function () {
                var val = pipe.transform('female', mapping);
                expect(val).toEqual('Invite her.');
            });
            it('should return the "other" text if value is neither "male" nor "female"', function () { expect(pipe.transform('Anything else', mapping)).toEqual('Invite them.'); });
            it('should return an empty text if value is null or undefined', function () {
                expect(pipe.transform(null, mapping)).toEqual('');
                expect(pipe.transform(void 0, mapping)).toEqual('');
            });
            it('should throw on bad arguments', function () { expect(function () { return pipe.transform('male', 'hey'); }).toThrowError(); });
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaTE4bl9zZWxlY3RfcGlwZV9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tbW9uL3Rlc3QvcGlwZXMvaTE4bl9zZWxlY3RfcGlwZV9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsMENBQStDO0FBQy9DLHFFQUFpRTtBQUNqRSwrRkFBc0Y7QUFFdEY7SUFDRSxRQUFRLENBQUMsZ0JBQWdCLEVBQUU7UUFDekIsSUFBTSxJQUFJLEdBQW1CLElBQUksdUJBQWMsRUFBRSxDQUFDO1FBQ2xELElBQU0sT0FBTyxHQUFHLEVBQUMsTUFBTSxFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUUsYUFBYSxFQUFFLE9BQU8sRUFBRSxjQUFjLEVBQUMsQ0FBQztRQUUxRixFQUFFLENBQUMsMEJBQTBCLEVBQUU7WUFDN0IsTUFBTSxDQUFDLElBQUksNEJBQVksQ0FBQyxJQUFJLGlDQUFZLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyx1QkFBYyxDQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVGLENBQUMsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLFdBQVcsRUFBRTtZQUNwQixFQUFFLENBQUMsa0RBQWtELEVBQUU7Z0JBQ3JELElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUM1QyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ3JDLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLHNEQUFzRCxFQUFFO2dCQUN6RCxJQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDOUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUNyQyxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyx3RUFBd0UsRUFDeEUsY0FBUSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFlLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUV4RixFQUFFLENBQUMsMkRBQTJELEVBQUU7Z0JBQzlELE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDbEQsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDdEQsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsK0JBQStCLEVBQy9CLGNBQVEsTUFBTSxDQUFDLGNBQU0sT0FBQSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBTyxLQUFLLENBQUMsRUFBbEMsQ0FBa0MsQ0FBQyxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakYsQ0FBQyxDQUFDLENBQUM7SUFFTCxDQUFDLENBQUMsQ0FBQztDQUNKIn0=