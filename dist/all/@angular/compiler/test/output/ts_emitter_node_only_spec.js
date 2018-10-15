"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_1 = require("@angular/compiler");
var o = require("@angular/compiler/src/output/output_ast");
var ts_emitter_1 = require("@angular/compiler/src/output/ts_emitter");
var parse_util_1 = require("@angular/compiler/src/parse_util");
var source_map_util_1 = require("@angular/compiler/testing/src/output/source_map_util");
var someGenFilePath = 'somePackage/someGenFile';
{
    // Not supported features of our OutputAst in TS:
    // - real `const` like in Dart
    // - final fields
    describe('TypeScriptEmitter', function () {
        var emitter;
        var someVar;
        beforeEach(function () {
            emitter = new ts_emitter_1.TypeScriptEmitter();
            someVar = o.variable('someVar');
        });
        function emitSourceMap(stmt, preamble) {
            var stmts = Array.isArray(stmt) ? stmt : [stmt];
            var source = emitter.emitStatements(someGenFilePath, stmts, preamble);
            return source_map_util_1.extractSourceMap(source);
        }
        describe('source maps', function () {
            it('should emit an inline source map', function () {
                var source = new compiler_1.ParseSourceFile(';;;var', 'in.js');
                var startLocation = new compiler_1.ParseLocation(source, 0, 0, 3);
                var endLocation = new compiler_1.ParseLocation(source, 7, 0, 6);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHNfZW1pdHRlcl9ub2RlX29ubHlfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3Rlc3Qvb3V0cHV0L3RzX2VtaXR0ZXJfbm9kZV9vbmx5X3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCw4Q0FBaUU7QUFFakUsMkRBQTZEO0FBRTdELHNFQUEwRTtBQUMxRSwrREFBaUU7QUFFakUsd0ZBQTJHO0FBRTNHLElBQU0sZUFBZSxHQUFHLHlCQUF5QixDQUFDO0FBRWxEO0lBQ0UsaURBQWlEO0lBQ2pELDhCQUE4QjtJQUM5QixpQkFBaUI7SUFFakIsUUFBUSxDQUFDLG1CQUFtQixFQUFFO1FBQzVCLElBQUksT0FBMEIsQ0FBQztRQUMvQixJQUFJLE9BQXNCLENBQUM7UUFFM0IsVUFBVSxDQUFDO1lBQ1QsT0FBTyxHQUFHLElBQUksOEJBQWlCLEVBQUUsQ0FBQztZQUNsQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNsQyxDQUFDLENBQUMsQ0FBQztRQUVILHVCQUF1QixJQUFpQyxFQUFFLFFBQWlCO1lBQ3pFLElBQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsRCxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLGVBQWUsRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDeEUsT0FBTyxrQ0FBZ0IsQ0FBQyxNQUFNLENBQUcsQ0FBQztRQUNwQyxDQUFDO1FBRUQsUUFBUSxDQUFDLGFBQWEsRUFBRTtZQUN0QixFQUFFLENBQUMsa0NBQWtDLEVBQUU7Z0JBQ3JDLElBQU0sTUFBTSxHQUFHLElBQUksMEJBQWUsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQ3RELElBQU0sYUFBYSxHQUFHLElBQUksd0JBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDekQsSUFBTSxXQUFXLEdBQUcsSUFBSSx3QkFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUN2RCxJQUFNLFVBQVUsR0FBRyxJQUFJLDRCQUFlLENBQUMsYUFBYSxFQUFFLFdBQVcsQ0FBQyxDQUFDO2dCQUNuRSxJQUFNLE9BQU8sR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7Z0JBQ3hELElBQU0sRUFBRSxHQUFHLGFBQWEsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUscUJBQXFCLENBQUMsQ0FBQztnQkFFbEUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxlQUFlLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDdkQsTUFBTSxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDbkQsTUFBTSxDQUFDLHFDQUFtQixDQUFDLEVBQUUsRUFBRSxFQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUM7cUJBQ2hELE9BQU8sQ0FBQyxFQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQztZQUN0RCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7Q0FDSiJ9