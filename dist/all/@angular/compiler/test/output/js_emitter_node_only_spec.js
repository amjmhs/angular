"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var js_emitter_1 = require("@angular/compiler/src/output/js_emitter");
var o = require("@angular/compiler/src/output/output_ast");
var parse_util_1 = require("@angular/compiler/src/parse_util");
var source_map_util_1 = require("@angular/compiler/testing/src/output/source_map_util");
var someGenFilePath = 'somePackage/someGenFile';
{
    describe('JavaScriptEmitter', function () {
        var emitter;
        var someVar;
        beforeEach(function () { emitter = new js_emitter_1.JavaScriptEmitter(); });
        function emitSourceMap(stmt, preamble) {
            var stmts = Array.isArray(stmt) ? stmt : [stmt];
            var source = emitter.emitStatements(someGenFilePath, stmts, preamble);
            return source_map_util_1.extractSourceMap(source);
        }
        describe('source maps', function () {
            it('should emit an inline source map', function () {
                var source = new parse_util_1.ParseSourceFile(';;;var', 'in.js');
                var startLocation = new parse_util_1.ParseLocation(source, 0, 0, 3);
                var endLocation = new parse_util_1.ParseLocation(source, 7, 0, 6);
                var sourceSpan = new parse_util_1.ParseSourceSpan(startLocation, endLocation);
                var someVar = o.variable('someVar', null, sourceSpan);
                var sm = emitSourceMap(someVar.toStmt(), '/* MyPreamble \n */');
                expect(sm.sources).toEqual([someGenFilePath, 'in.js']);
                expect(sm.sourcesContent).toEqual([' ', ';;;var']);
                expect(source_map_util_1.originalPositionFor(sm, { line: 3, column: 0 }))
                    .toEqual({ line: 1, column: 3, source: 'in.js' });
            });
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNfZW1pdHRlcl9ub2RlX29ubHlfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3Rlc3Qvb3V0cHV0L2pzX2VtaXR0ZXJfbm9kZV9vbmx5X3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFJSCxzRUFBMEU7QUFDMUUsMkRBQTZEO0FBRTdELCtEQUFpRztBQUVqRyx3RkFBMkc7QUFFM0csSUFBTSxlQUFlLEdBQUcseUJBQXlCLENBQUM7QUFFbEQ7SUFDRSxRQUFRLENBQUMsbUJBQW1CLEVBQUU7UUFDNUIsSUFBSSxPQUEwQixDQUFDO1FBQy9CLElBQUksT0FBc0IsQ0FBQztRQUUzQixVQUFVLENBQUMsY0FBUSxPQUFPLEdBQUcsSUFBSSw4QkFBaUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFekQsdUJBQXVCLElBQWlDLEVBQUUsUUFBaUI7WUFDekUsSUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2xELElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsZUFBZSxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztZQUN4RSxPQUFPLGtDQUFnQixDQUFDLE1BQU0sQ0FBRyxDQUFDO1FBQ3BDLENBQUM7UUFFRCxRQUFRLENBQUMsYUFBYSxFQUFFO1lBQ3RCLEVBQUUsQ0FBQyxrQ0FBa0MsRUFBRTtnQkFDckMsSUFBTSxNQUFNLEdBQUcsSUFBSSw0QkFBZSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDdEQsSUFBTSxhQUFhLEdBQUcsSUFBSSwwQkFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUN6RCxJQUFNLFdBQVcsR0FBRyxJQUFJLDBCQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZELElBQU0sVUFBVSxHQUFHLElBQUksNEJBQWUsQ0FBQyxhQUFhLEVBQUUsV0FBVyxDQUFDLENBQUM7Z0JBQ25FLElBQU0sT0FBTyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQztnQkFDeEQsSUFBTSxFQUFFLEdBQUcsYUFBYSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO2dCQUVsRSxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGVBQWUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUN2RCxNQUFNLENBQUMsRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNuRCxNQUFNLENBQUMscUNBQW1CLENBQUMsRUFBRSxFQUFFLEVBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQztxQkFDaEQsT0FBTyxDQUFDLEVBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDO1lBQ3RELENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztDQUNKIn0=