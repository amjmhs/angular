"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var o = require("../output/output_ast");
var output_jit_1 = require("../output/output_jit");
/**
 * Implementation of `CompileReflector` which resolves references to @angular/core
 * symbols at runtime, according to a consumer-provided mapping.
 *
 * Only supports `resolveExternalReference`, all other methods throw.
 */
var R3JitReflector = /** @class */ (function () {
    function R3JitReflector(context) {
        this.context = context;
    }
    R3JitReflector.prototype.resolveExternalReference = function (ref) {
        // This reflector only handles @angular/core imports.
        if (ref.moduleName !== '@angular/core') {
            throw new Error("Cannot resolve external reference to " + ref.moduleName + ", only references to @angular/core are supported.");
        }
        if (!this.context.hasOwnProperty(ref.name)) {
            throw new Error("No value provided for @angular/core symbol '" + ref.name + "'.");
        }
        return this.context[ref.name];
    };
    R3JitReflector.prototype.parameters = function (typeOrFunc) { throw new Error('Not implemented.'); };
    R3JitReflector.prototype.annotations = function (typeOrFunc) { throw new Error('Not implemented.'); };
    R3JitReflector.prototype.shallowAnnotations = function (typeOrFunc) { throw new Error('Not implemented.'); };
    R3JitReflector.prototype.tryAnnotations = function (typeOrFunc) { throw new Error('Not implemented.'); };
    R3JitReflector.prototype.propMetadata = function (typeOrFunc) { throw new Error('Not implemented.'); };
    R3JitReflector.prototype.hasLifecycleHook = function (type, lcProperty) { throw new Error('Not implemented.'); };
    R3JitReflector.prototype.guards = function (typeOrFunc) { throw new Error('Not implemented.'); };
    R3JitReflector.prototype.componentModuleUrl = function (type, cmpMetadata) { throw new Error('Not implemented.'); };
    return R3JitReflector;
}());
/**
 * JIT compiles an expression and returns the result of executing that expression.
 *
 * @param def the definition which will be compiled and executed to get the value to patch
 * @param context an object map of @angular/core symbol names to symbols which will be available in
 * the context of the compiled expression
 * @param sourceUrl a URL to use for the source map of the compiled expression
 * @param constantPool an optional `ConstantPool` which contains constants used in the expression
 */
function jitExpression(def, context, sourceUrl, constantPool) {
    // The ConstantPool may contain Statements which declare variables used in the final expression.
    // Therefore, its statements need to precede the actual JIT operation. The final statement is a
    // declaration of $def which is set to the expression being compiled.
    var statements = (constantPool !== undefined ? constantPool.statements : []).concat([
        new o.DeclareVarStmt('$def', def, undefined, [o.StmtModifier.Exported]),
    ]);
    var res = output_jit_1.jitStatements(sourceUrl, statements, new R3JitReflector(context), false);
    return res['$def'];
}
exports.jitExpression = jitExpression;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicjNfaml0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvc3JjL3JlbmRlcjMvcjNfaml0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBSUgsd0NBQTBDO0FBQzFDLG1EQUFtRDtBQUVuRDs7Ozs7R0FLRztBQUNIO0lBQ0Usd0JBQW9CLE9BQTZCO1FBQTdCLFlBQU8sR0FBUCxPQUFPLENBQXNCO0lBQUcsQ0FBQztJQUVyRCxpREFBd0IsR0FBeEIsVUFBeUIsR0FBd0I7UUFDL0MscURBQXFEO1FBQ3JELElBQUksR0FBRyxDQUFDLFVBQVUsS0FBSyxlQUFlLEVBQUU7WUFDdEMsTUFBTSxJQUFJLEtBQUssQ0FDWCwwQ0FBd0MsR0FBRyxDQUFDLFVBQVUsc0RBQW1ELENBQUMsQ0FBQztTQUNoSDtRQUNELElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsSUFBTSxDQUFDLEVBQUU7WUFDNUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxpREFBK0MsR0FBRyxDQUFDLElBQUssT0FBSSxDQUFDLENBQUM7U0FDL0U7UUFDRCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQU0sQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFRCxtQ0FBVSxHQUFWLFVBQVcsVUFBZSxJQUFhLE1BQU0sSUFBSSxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFN0Usb0NBQVcsR0FBWCxVQUFZLFVBQWUsSUFBVyxNQUFNLElBQUksS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRTVFLDJDQUFrQixHQUFsQixVQUFtQixVQUFlLElBQVcsTUFBTSxJQUFJLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVuRix1Q0FBYyxHQUFkLFVBQWUsVUFBZSxJQUFXLE1BQU0sSUFBSSxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFL0UscUNBQVksR0FBWixVQUFhLFVBQWUsSUFBNkIsTUFBTSxJQUFJLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUUvRix5Q0FBZ0IsR0FBaEIsVUFBaUIsSUFBUyxFQUFFLFVBQWtCLElBQWEsTUFBTSxJQUFJLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVqRywrQkFBTSxHQUFOLFVBQU8sVUFBZSxJQUEyQixNQUFNLElBQUksS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRXZGLDJDQUFrQixHQUFsQixVQUFtQixJQUFTLEVBQUUsV0FBZ0IsSUFBWSxNQUFNLElBQUksS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xHLHFCQUFDO0FBQUQsQ0FBQyxBQTlCRCxJQThCQztBQUVEOzs7Ozs7OztHQVFHO0FBQ0gsdUJBQ0ksR0FBaUIsRUFBRSxPQUE2QixFQUFFLFNBQWlCLEVBQ25FLFlBQTJCO0lBQzdCLGdHQUFnRztJQUNoRywrRkFBK0Y7SUFDL0YscUVBQXFFO0lBQ3JFLElBQU0sVUFBVSxHQUNYLENBQUMsWUFBWSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQzlELElBQUksQ0FBQyxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7TUFDeEUsQ0FBQztJQUVGLElBQU0sR0FBRyxHQUFHLDBCQUFhLENBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxJQUFJLGNBQWMsQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNyRixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNyQixDQUFDO0FBYkQsc0NBYUMifQ==