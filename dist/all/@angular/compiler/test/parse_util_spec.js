"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var parse_util_1 = require("../src/parse_util");
{
    describe('ParseError', function () {
        it('should reflect the level in the message', function () {
            var file = new parse_util_1.ParseSourceFile("foo\nbar\nfoo", 'url');
            var start = new parse_util_1.ParseLocation(file, 4, 1, 0);
            var end = new parse_util_1.ParseLocation(file, 6, 1, 2);
            var span = new parse_util_1.ParseSourceSpan(start, end);
            var fatal = new parse_util_1.ParseError(span, 'fatal', parse_util_1.ParseErrorLevel.ERROR);
            expect(fatal.toString()).toEqual('fatal ("foo\n[ERROR ->]bar\nfoo"): url@1:0');
            var warning = new parse_util_1.ParseError(span, 'warning', parse_util_1.ParseErrorLevel.WARNING);
            expect(warning.toString()).toEqual('warning ("foo\n[WARNING ->]bar\nfoo"): url@1:0');
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VfdXRpbF9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvdGVzdC9wYXJzZV91dGlsX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxnREFBK0c7QUFFL0c7SUFDRSxRQUFRLENBQUMsWUFBWSxFQUFFO1FBQ3JCLEVBQUUsQ0FBQyx5Q0FBeUMsRUFBRTtZQUM1QyxJQUFNLElBQUksR0FBRyxJQUFJLDRCQUFlLENBQUMsZUFBZSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3pELElBQU0sS0FBSyxHQUFHLElBQUksMEJBQWEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUMvQyxJQUFNLEdBQUcsR0FBRyxJQUFJLDBCQUFhLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDN0MsSUFBTSxJQUFJLEdBQUcsSUFBSSw0QkFBZSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztZQUU3QyxJQUFNLEtBQUssR0FBRyxJQUFJLHVCQUFVLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSw0QkFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ25FLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsNENBQTRDLENBQUMsQ0FBQztZQUUvRSxJQUFNLE9BQU8sR0FBRyxJQUFJLHVCQUFVLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSw0QkFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3pFLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsZ0RBQWdELENBQUMsQ0FBQztRQUN2RixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0NBQ0oifQ==