"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_1 = require("@angular/compiler");
var ts = require("typescript");
var index_1 = require("../metadata/index");
var PartialModuleMetadataTransformer = /** @class */ (function () {
    function PartialModuleMetadataTransformer(modules) {
        this.moduleMap = new Map(modules.map(function (m) { return [m.fileName, m]; }));
    }
    PartialModuleMetadataTransformer.prototype.start = function (sourceFile) {
        var partialModule = this.moduleMap.get(sourceFile.fileName);
        if (partialModule) {
            var classMap_1 = new Map(partialModule.statements.filter(isClassStmt).map(function (s) { return [s.name, s]; }));
            if (classMap_1.size > 0) {
                return function (value, node) {
                    var _a;
                    // For class metadata that is going to be transformed to have a static method ensure the
                    // metadata contains a static declaration the new static method.
                    if (index_1.isClassMetadata(value) && node.kind === ts.SyntaxKind.ClassDeclaration) {
                        var classDeclaration = node;
                        if (classDeclaration.name) {
                            var partialClass = classMap_1.get(classDeclaration.name.text);
                            if (partialClass) {
                                for (var _i = 0, _b = partialClass.fields; _i < _b.length; _i++) {
                                    var field = _b[_i];
                                    if (field.name && field.modifiers &&
                                        field.modifiers.some(function (modifier) { return modifier === compiler_1.StmtModifier.Static; })) {
                                        value.statics = __assign({}, (value.statics || {}), (_a = {}, _a[field.name] = {}, _a));
                                    }
                                }
                            }
                        }
                    }
                    return value;
                };
            }
        }
    };
    return PartialModuleMetadataTransformer;
}());
exports.PartialModuleMetadataTransformer = PartialModuleMetadataTransformer;
function isClassStmt(v) {
    return v instanceof compiler_1.ClassStmt;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicjNfbWV0YWRhdGFfdHJhbnNmb3JtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3NyYy90cmFuc2Zvcm1lcnMvcjNfbWV0YWRhdGFfdHJhbnNmb3JtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7QUFFSCw4Q0FBb0Y7QUFDcEYsK0JBQWlDO0FBRWpDLDJDQUFvRztBQUlwRztJQUdFLDBDQUFZLE9BQXdCO1FBQ2xDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBMEIsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQWYsQ0FBZSxDQUFDLENBQUMsQ0FBQztJQUN2RixDQUFDO0lBRUQsZ0RBQUssR0FBTCxVQUFNLFVBQXlCO1FBQzdCLElBQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM5RCxJQUFJLGFBQWEsRUFBRTtZQUNqQixJQUFNLFVBQVEsR0FBRyxJQUFJLEdBQUcsQ0FDcEIsYUFBYSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsR0FBRyxDQUFzQixVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBWCxDQUFXLENBQUMsQ0FBQyxDQUFDO1lBQzdGLElBQUksVUFBUSxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUU7Z0JBQ3JCLE9BQU8sVUFBQyxLQUFvQixFQUFFLElBQWE7O29CQUN6Qyx3RkFBd0Y7b0JBQ3hGLGdFQUFnRTtvQkFDaEUsSUFBSSx1QkFBZSxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRTt3QkFDMUUsSUFBTSxnQkFBZ0IsR0FBRyxJQUEyQixDQUFDO3dCQUNyRCxJQUFJLGdCQUFnQixDQUFDLElBQUksRUFBRTs0QkFDekIsSUFBTSxZQUFZLEdBQUcsVUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7NEJBQzlELElBQUksWUFBWSxFQUFFO2dDQUNoQixLQUFvQixVQUFtQixFQUFuQixLQUFBLFlBQVksQ0FBQyxNQUFNLEVBQW5CLGNBQW1CLEVBQW5CLElBQW1CLEVBQUU7b0NBQXBDLElBQU0sS0FBSyxTQUFBO29DQUNkLElBQUksS0FBSyxDQUFDLElBQUksSUFBSSxLQUFLLENBQUMsU0FBUzt3Q0FDN0IsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBQSxRQUFRLElBQUksT0FBQSxRQUFRLEtBQUssdUJBQVksQ0FBQyxNQUFNLEVBQWhDLENBQWdDLENBQUMsRUFBRTt3Q0FDdEUsS0FBSyxDQUFDLE9BQU8sZ0JBQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxlQUFHLEtBQUssQ0FBQyxJQUFJLElBQUcsRUFBRSxNQUFDLENBQUM7cUNBQzlEO2lDQUNGOzZCQUNGO3lCQUNGO3FCQUNGO29CQUNELE9BQU8sS0FBSyxDQUFDO2dCQUNmLENBQUMsQ0FBQzthQUNIO1NBQ0Y7SUFDSCxDQUFDO0lBQ0gsdUNBQUM7QUFBRCxDQUFDLEFBbkNELElBbUNDO0FBbkNZLDRFQUFnQztBQXFDN0MscUJBQXFCLENBQVk7SUFDL0IsT0FBTyxDQUFDLFlBQVksb0JBQVMsQ0FBQztBQUNoQyxDQUFDIn0=