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
var abstract_emitter_1 = require("./abstract_emitter");
var abstract_js_emitter_1 = require("./abstract_js_emitter");
var o = require("./output_ast");
var JavaScriptEmitter = /** @class */ (function () {
    function JavaScriptEmitter() {
    }
    JavaScriptEmitter.prototype.emitStatements = function (genFilePath, stmts, preamble) {
        if (preamble === void 0) { preamble = ''; }
        var converter = new JsEmitterVisitor();
        var ctx = abstract_emitter_1.EmitterVisitorContext.createRoot();
        converter.visitAllStatements(stmts, ctx);
        var preambleLines = preamble ? preamble.split('\n') : [];
        converter.importsWithPrefixes.forEach(function (prefix, importedModuleName) {
            // Note: can't write the real word for import as it screws up system.js auto detection...
            preambleLines.push("var " + prefix + " = req" +
                ("uire('" + importedModuleName + "');"));
        });
        var sm = ctx.toSourceMapGenerator(genFilePath, preambleLines.length).toJsComment();
        var lines = preambleLines.concat([ctx.toSource(), sm]);
        if (sm) {
            // always add a newline at the end, as some tools have bugs without it.
            lines.push('');
        }
        return lines.join('\n');
    };
    return JavaScriptEmitter;
}());
exports.JavaScriptEmitter = JavaScriptEmitter;
var JsEmitterVisitor = /** @class */ (function (_super) {
    __extends(JsEmitterVisitor, _super);
    function JsEmitterVisitor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.importsWithPrefixes = new Map();
        return _this;
    }
    JsEmitterVisitor.prototype.visitExternalExpr = function (ast, ctx) {
        var _a = ast.value, name = _a.name, moduleName = _a.moduleName;
        if (moduleName) {
            var prefix = this.importsWithPrefixes.get(moduleName);
            if (prefix == null) {
                prefix = "i" + this.importsWithPrefixes.size;
                this.importsWithPrefixes.set(moduleName, prefix);
            }
            ctx.print(ast, prefix + ".");
        }
        ctx.print(ast, name);
        return null;
    };
    JsEmitterVisitor.prototype.visitDeclareVarStmt = function (stmt, ctx) {
        _super.prototype.visitDeclareVarStmt.call(this, stmt, ctx);
        if (stmt.hasModifier(o.StmtModifier.Exported)) {
            ctx.println(stmt, exportVar(stmt.name));
        }
        return null;
    };
    JsEmitterVisitor.prototype.visitDeclareFunctionStmt = function (stmt, ctx) {
        _super.prototype.visitDeclareFunctionStmt.call(this, stmt, ctx);
        if (stmt.hasModifier(o.StmtModifier.Exported)) {
            ctx.println(stmt, exportVar(stmt.name));
        }
        return null;
    };
    JsEmitterVisitor.prototype.visitDeclareClassStmt = function (stmt, ctx) {
        _super.prototype.visitDeclareClassStmt.call(this, stmt, ctx);
        if (stmt.hasModifier(o.StmtModifier.Exported)) {
            ctx.println(stmt, exportVar(stmt.name));
        }
        return null;
    };
    return JsEmitterVisitor;
}(abstract_js_emitter_1.AbstractJsEmitterVisitor));
function exportVar(varName) {
    return "Object.defineProperty(exports, '" + varName + "', { get: function() { return " + varName + "; }});";
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNfZW1pdHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9vdXRwdXQvanNfZW1pdHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7QUFNSCx1REFBd0U7QUFDeEUsNkRBQStEO0FBQy9ELGdDQUFrQztBQUVsQztJQUFBO0lBc0JBLENBQUM7SUFyQkMsMENBQWMsR0FBZCxVQUFlLFdBQW1CLEVBQUUsS0FBb0IsRUFBRSxRQUFxQjtRQUFyQix5QkFBQSxFQUFBLGFBQXFCO1FBQzdFLElBQU0sU0FBUyxHQUFHLElBQUksZ0JBQWdCLEVBQUUsQ0FBQztRQUN6QyxJQUFNLEdBQUcsR0FBRyx3Q0FBcUIsQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUMvQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBRXpDLElBQU0sYUFBYSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQzNELFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsVUFBQyxNQUFNLEVBQUUsa0JBQWtCO1lBQy9ELHlGQUF5RjtZQUN6RixhQUFhLENBQUMsSUFBSSxDQUNkLFNBQU8sTUFBTSxXQUFRO2lCQUNyQixXQUFTLGtCQUFrQixRQUFLLENBQUEsQ0FBQyxDQUFDO1FBQ3hDLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLG9CQUFvQixDQUFDLFdBQVcsRUFBRSxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDckYsSUFBTSxLQUFLLEdBQU8sYUFBYSxTQUFFLEdBQUcsQ0FBQyxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUMsQ0FBQztRQUNyRCxJQUFJLEVBQUUsRUFBRTtZQUNOLHVFQUF1RTtZQUN2RSxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ2hCO1FBQ0QsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzFCLENBQUM7SUFDSCx3QkFBQztBQUFELENBQUMsQUF0QkQsSUFzQkM7QUF0QlksOENBQWlCO0FBd0I5QjtJQUErQixvQ0FBd0I7SUFBdkQ7UUFBQSxxRUFxQ0M7UUFwQ0MseUJBQW1CLEdBQUcsSUFBSSxHQUFHLEVBQWtCLENBQUM7O0lBb0NsRCxDQUFDO0lBbENDLDRDQUFpQixHQUFqQixVQUFrQixHQUFtQixFQUFFLEdBQTBCO1FBQ3pELElBQUEsY0FBOEIsRUFBN0IsY0FBSSxFQUFFLDBCQUFVLENBQWM7UUFDckMsSUFBSSxVQUFVLEVBQUU7WUFDZCxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3RELElBQUksTUFBTSxJQUFJLElBQUksRUFBRTtnQkFDbEIsTUFBTSxHQUFHLE1BQUksSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQU0sQ0FBQztnQkFDN0MsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7YUFDbEQ7WUFDRCxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBSyxNQUFNLE1BQUcsQ0FBQyxDQUFDO1NBQzlCO1FBQ0QsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsSUFBTSxDQUFDLENBQUM7UUFDdkIsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBQ0QsOENBQW1CLEdBQW5CLFVBQW9CLElBQXNCLEVBQUUsR0FBMEI7UUFDcEUsaUJBQU0sbUJBQW1CLFlBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3JDLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQzdDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztTQUN6QztRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUNELG1EQUF3QixHQUF4QixVQUF5QixJQUEyQixFQUFFLEdBQTBCO1FBQzlFLGlCQUFNLHdCQUF3QixZQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztRQUMxQyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUM3QyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7U0FDekM7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFDRCxnREFBcUIsR0FBckIsVUFBc0IsSUFBaUIsRUFBRSxHQUEwQjtRQUNqRSxpQkFBTSxxQkFBcUIsWUFBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDdkMsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDN0MsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1NBQ3pDO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBQ0gsdUJBQUM7QUFBRCxDQUFDLEFBckNELENBQStCLDhDQUF3QixHQXFDdEQ7QUFFRCxtQkFBbUIsT0FBZTtJQUNoQyxPQUFPLHFDQUFtQyxPQUFPLHNDQUFpQyxPQUFPLFdBQVEsQ0FBQztBQUNwRyxDQUFDIn0=