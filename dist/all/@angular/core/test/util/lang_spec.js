"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var lang_1 = require("@angular/core/src/util/lang");
var rxjs_1 = require("rxjs");
{
    describe('isPromise', function () {
        it('should be true for native Promises', function () { return expect(lang_1.isPromise(Promise.resolve(true))).toEqual(true); });
        it('should be true for thenables', function () { return expect(lang_1.isPromise({ then: function () { } })).toEqual(true); });
        it('should be false if "then" is not a function', function () { return expect(lang_1.isPromise({ then: 0 })).toEqual(false); });
        it('should be false if the argument has no "then" function', function () { return expect(lang_1.isPromise({})).toEqual(false); });
        it('should be false if the argument is undefined or null', function () {
            expect(lang_1.isPromise(undefined)).toEqual(false);
            expect(lang_1.isPromise(null)).toEqual(false);
        });
    });
    describe('isObservable', function () {
        it('should be true for an Observable', function () { return expect(lang_1.isObservable(rxjs_1.of(true))).toEqual(true); });
        it('should be true if the argument is the object with subscribe function', function () { return expect(lang_1.isObservable({ subscribe: function () { } })).toEqual(true); });
        it('should be false if the argument is undefined', function () { return expect(lang_1.isObservable(undefined)).toEqual(false); });
        it('should be false if the argument is null', function () { return expect(lang_1.isObservable(null)).toEqual(false); });
        it('should be false if the argument is an object', function () { return expect(lang_1.isObservable({})).toEqual(false); });
        it('should be false if the argument is a function', function () { return expect(lang_1.isObservable(function () { })).toEqual(false); });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFuZ19zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L3V0aWwvbGFuZ19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsb0RBQW9FO0FBQ3BFLDZCQUF5QjtBQUV6QjtJQUNFLFFBQVEsQ0FBQyxXQUFXLEVBQUU7UUFDcEIsRUFBRSxDQUFDLG9DQUFvQyxFQUNwQyxjQUFNLE9BQUEsTUFBTSxDQUFDLGdCQUFTLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUF0RCxDQUFzRCxDQUFDLENBQUM7UUFFakUsRUFBRSxDQUFDLDhCQUE4QixFQUFFLGNBQU0sT0FBQSxNQUFNLENBQUMsZ0JBQVMsQ0FBQyxFQUFDLElBQUksRUFBRSxjQUFPLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQWpELENBQWlELENBQUMsQ0FBQztRQUU1RixFQUFFLENBQUMsNkNBQTZDLEVBQzdDLGNBQU0sT0FBQSxNQUFNLENBQUMsZ0JBQVMsQ0FBQyxFQUFDLElBQUksRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUEzQyxDQUEyQyxDQUFDLENBQUM7UUFFdEQsRUFBRSxDQUFDLHdEQUF3RCxFQUN4RCxjQUFNLE9BQUEsTUFBTSxDQUFDLGdCQUFTLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQXBDLENBQW9DLENBQUMsQ0FBQztRQUUvQyxFQUFFLENBQUMsc0RBQXNELEVBQUU7WUFDekQsTUFBTSxDQUFDLGdCQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDNUMsTUFBTSxDQUFDLGdCQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDekMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxjQUFjLEVBQUU7UUFDdkIsRUFBRSxDQUFDLGtDQUFrQyxFQUFFLGNBQU0sT0FBQSxNQUFNLENBQUMsbUJBQVksQ0FBQyxTQUFFLENBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBN0MsQ0FBNkMsQ0FBQyxDQUFDO1FBRTVGLEVBQUUsQ0FBQyxzRUFBc0UsRUFDdEUsY0FBTSxPQUFBLE1BQU0sQ0FBQyxtQkFBWSxDQUFDLEVBQUMsU0FBUyxFQUFFLGNBQU8sQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBekQsQ0FBeUQsQ0FBQyxDQUFDO1FBRXBFLEVBQUUsQ0FBQyw4Q0FBOEMsRUFDOUMsY0FBTSxPQUFBLE1BQU0sQ0FBQyxtQkFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUE5QyxDQUE4QyxDQUFDLENBQUM7UUFFekQsRUFBRSxDQUFDLHlDQUF5QyxFQUFFLGNBQU0sT0FBQSxNQUFNLENBQUMsbUJBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBekMsQ0FBeUMsQ0FBQyxDQUFDO1FBRS9GLEVBQUUsQ0FBQyw4Q0FBOEMsRUFDOUMsY0FBTSxPQUFBLE1BQU0sQ0FBQyxtQkFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUF2QyxDQUF1QyxDQUFDLENBQUM7UUFFbEQsRUFBRSxDQUFDLCtDQUErQyxFQUMvQyxjQUFNLE9BQUEsTUFBTSxDQUFDLG1CQUFZLENBQUMsY0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBN0MsQ0FBNkMsQ0FBQyxDQUFDO0lBQzFELENBQUMsQ0FBQyxDQUFDO0NBQ0oifQ==