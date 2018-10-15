"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var api_1 = require("../transformers/api");
var util_1 = require("../transformers/util");
function translateDiagnostics(host, untranslatedDiagnostics) {
    var ts = [];
    var ng = [];
    untranslatedDiagnostics.forEach(function (diagnostic) {
        if (diagnostic.file && diagnostic.start && util_1.GENERATED_FILES.test(diagnostic.file.fileName)) {
            // We need to filter out diagnostics about unused functions as
            // they are in fact referenced by nobody and only serve to surface
            // type check errors.
            if (diagnostic.code === /* ... is declared but never used */ 6133) {
                return;
            }
            var span = sourceSpanOf(host, diagnostic.file, diagnostic.start);
            if (span) {
                var fileName = span.start.file.url;
                ng.push({
                    messageText: diagnosticMessageToString(diagnostic.messageText),
                    category: diagnostic.category, span: span,
                    source: api_1.SOURCE,
                    code: api_1.DEFAULT_ERROR_CODE
                });
            }
        }
        else {
            ts.push(diagnostic);
        }
    });
    return { ts: ts, ng: ng };
}
exports.translateDiagnostics = translateDiagnostics;
function sourceSpanOf(host, source, start) {
    var _a = ts.getLineAndCharacterOfPosition(source, start), line = _a.line, character = _a.character;
    return host.parseSourceSpanOf(source.fileName, line, character);
}
function diagnosticMessageToString(message) {
    return ts.flattenDiagnosticMessageText(message, '\n');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNsYXRlX2RpYWdub3N0aWNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3NyYy9kaWFnbm9zdGljcy90cmFuc2xhdGVfZGlhZ25vc3RpY3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFHSCwrQkFBaUM7QUFFakMsMkNBQTJFO0FBQzNFLDZDQUFxRDtBQU1yRCw4QkFDSSxJQUFtQixFQUFFLHVCQUFxRDtJQUU1RSxJQUFNLEVBQUUsR0FBb0IsRUFBRSxDQUFDO0lBQy9CLElBQU0sRUFBRSxHQUFpQixFQUFFLENBQUM7SUFFNUIsdUJBQXVCLENBQUMsT0FBTyxDQUFDLFVBQUMsVUFBVTtRQUN6QyxJQUFJLFVBQVUsQ0FBQyxJQUFJLElBQUksVUFBVSxDQUFDLEtBQUssSUFBSSxzQkFBZSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQ3pGLDhEQUE4RDtZQUM5RCxrRUFBa0U7WUFDbEUscUJBQXFCO1lBQ3JCLElBQUksVUFBVSxDQUFDLElBQUksS0FBSyxvQ0FBb0MsQ0FBQyxJQUFJLEVBQUU7Z0JBQ2pFLE9BQU87YUFDUjtZQUNELElBQU0sSUFBSSxHQUFHLFlBQVksQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDbkUsSUFBSSxJQUFJLEVBQUU7Z0JBQ1IsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO2dCQUNyQyxFQUFFLENBQUMsSUFBSSxDQUFDO29CQUNOLFdBQVcsRUFBRSx5QkFBeUIsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDO29CQUM5RCxRQUFRLEVBQUUsVUFBVSxDQUFDLFFBQVEsRUFBRSxJQUFJLE1BQUE7b0JBQ25DLE1BQU0sRUFBRSxZQUFNO29CQUNkLElBQUksRUFBRSx3QkFBa0I7aUJBQ3pCLENBQUMsQ0FBQzthQUNKO1NBQ0Y7YUFBTTtZQUNMLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDckI7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUNILE9BQU8sRUFBQyxFQUFFLElBQUEsRUFBRSxFQUFFLElBQUEsRUFBQyxDQUFDO0FBQ2xCLENBQUM7QUE3QkQsb0RBNkJDO0FBRUQsc0JBQXNCLElBQW1CLEVBQUUsTUFBcUIsRUFBRSxLQUFhO0lBRXZFLElBQUEsb0RBQW1FLEVBQWxFLGNBQUksRUFBRSx3QkFBUyxDQUFvRDtJQUMxRSxPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNsRSxDQUFDO0FBRUQsbUNBQW1DLE9BQTJDO0lBQzVFLE9BQU8sRUFBRSxDQUFDLDRCQUE0QixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN4RCxDQUFDIn0=