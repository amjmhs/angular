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
var common_1 = require("@angular/common");
var pipe_resolver_1 = require("@angular/compiler/src/pipe_resolver");
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var compiler_reflector_1 = require("@angular/platform-browser-dynamic/src/compiler_reflector");
{
    testing_internal_1.describe('I18nPluralPipe', function () {
        var localization;
        var pipe;
        var mapping = {
            '=0': 'No messages.',
            '=1': 'One message.',
            'many': 'Many messages.',
            'other': 'There are # messages, that is #.',
        };
        testing_internal_1.beforeEach(function () {
            localization = new TestLocalization();
            pipe = new common_1.I18nPluralPipe(localization);
        });
        testing_internal_1.it('should be marked as pure', function () {
            testing_internal_1.expect(new pipe_resolver_1.PipeResolver(new compiler_reflector_1.JitReflector()).resolve(common_1.I18nPluralPipe).pure).toEqual(true);
        });
        testing_internal_1.describe('transform', function () {
            testing_internal_1.it('should return 0 text if value is 0', function () {
                var val = pipe.transform(0, mapping);
                testing_internal_1.expect(val).toEqual('No messages.');
            });
            testing_internal_1.it('should return 1 text if value is 1', function () {
                var val = pipe.transform(1, mapping);
                testing_internal_1.expect(val).toEqual('One message.');
            });
            testing_internal_1.it('should return category messages', function () {
                var val = pipe.transform(4, mapping);
                testing_internal_1.expect(val).toEqual('Many messages.');
            });
            testing_internal_1.it('should interpolate the value into the text where indicated', function () {
                var val = pipe.transform(6, mapping);
                testing_internal_1.expect(val).toEqual('There are 6 messages, that is 6.');
            });
            testing_internal_1.it('should use "" if value is undefined', function () {
                var val = pipe.transform(void (0), mapping);
                testing_internal_1.expect(val).toEqual('');
            });
            testing_internal_1.it('should not support bad arguments', function () { testing_internal_1.expect(function () { return pipe.transform(0, 'hey'); }).toThrowError(); });
        });
    });
}
var TestLocalization = /** @class */ (function (_super) {
    __extends(TestLocalization, _super);
    function TestLocalization() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TestLocalization.prototype.getPluralCategory = function (value) { return value > 1 && value < 6 ? 'many' : 'other'; };
    return TestLocalization;
}(common_1.NgLocalization));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaTE4bl9wbHVyYWxfcGlwZV9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tbW9uL3Rlc3QvcGlwZXMvaTE4bl9wbHVyYWxfcGlwZV9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztBQUVILDBDQUErRDtBQUMvRCxxRUFBaUU7QUFDakUsK0VBQTRGO0FBQzVGLCtGQUFzRjtBQUV0RjtJQUNFLDJCQUFRLENBQUMsZ0JBQWdCLEVBQUU7UUFDekIsSUFBSSxZQUE0QixDQUFDO1FBQ2pDLElBQUksSUFBb0IsQ0FBQztRQUV6QixJQUFNLE9BQU8sR0FBRztZQUNkLElBQUksRUFBRSxjQUFjO1lBQ3BCLElBQUksRUFBRSxjQUFjO1lBQ3BCLE1BQU0sRUFBRSxnQkFBZ0I7WUFDeEIsT0FBTyxFQUFFLGtDQUFrQztTQUM1QyxDQUFDO1FBRUYsNkJBQVUsQ0FBQztZQUNULFlBQVksR0FBRyxJQUFJLGdCQUFnQixFQUFFLENBQUM7WUFDdEMsSUFBSSxHQUFHLElBQUksdUJBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUMxQyxDQUFDLENBQUMsQ0FBQztRQUVILHFCQUFFLENBQUMsMEJBQTBCLEVBQUU7WUFDN0IseUJBQU0sQ0FBQyxJQUFJLDRCQUFZLENBQUMsSUFBSSxpQ0FBWSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsdUJBQWMsQ0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1RixDQUFDLENBQUMsQ0FBQztRQUVILDJCQUFRLENBQUMsV0FBVyxFQUFFO1lBQ3BCLHFCQUFFLENBQUMsb0NBQW9DLEVBQUU7Z0JBQ3ZDLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUN2Qyx5QkFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUN0QyxDQUFDLENBQUMsQ0FBQztZQUVILHFCQUFFLENBQUMsb0NBQW9DLEVBQUU7Z0JBQ3ZDLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUN2Qyx5QkFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUN0QyxDQUFDLENBQUMsQ0FBQztZQUVILHFCQUFFLENBQUMsaUNBQWlDLEVBQUU7Z0JBQ3BDLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUN2Qyx5QkFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ3hDLENBQUMsQ0FBQyxDQUFDO1lBRUgscUJBQUUsQ0FBQyw0REFBNEQsRUFBRTtnQkFDL0QsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQ3ZDLHlCQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7WUFDMUQsQ0FBQyxDQUFDLENBQUM7WUFFSCxxQkFBRSxDQUFDLHFDQUFxQyxFQUFFO2dCQUN4QyxJQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUksQ0FBQyxDQUFDLENBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDcEQseUJBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDMUIsQ0FBQyxDQUFDLENBQUM7WUFFSCxxQkFBRSxDQUFDLGtDQUFrQyxFQUNsQyxjQUFRLHlCQUFNLENBQUMsY0FBTSxPQUFBLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFPLEtBQUssQ0FBQyxFQUE3QixDQUE2QixDQUFDLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1RSxDQUFDLENBQUMsQ0FBQztJQUVMLENBQUMsQ0FBQyxDQUFDO0NBQ0o7QUFFRDtJQUErQixvQ0FBYztJQUE3Qzs7SUFFQSxDQUFDO0lBREMsNENBQWlCLEdBQWpCLFVBQWtCLEtBQWEsSUFBWSxPQUFPLEtBQUssR0FBRyxDQUFDLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ2hHLHVCQUFDO0FBQUQsQ0FBQyxBQUZELENBQStCLHVCQUFjLEdBRTVDIn0=