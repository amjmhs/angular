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
var translator_1 = require("./translator");
/**
 * Processes .d.ts file text and adds static field declarations, with types.
 */
var DtsFileTransformer = /** @class */ (function () {
    function DtsFileTransformer(coreImportsFrom) {
        this.coreImportsFrom = coreImportsFrom;
        this.ivyFields = new Map();
        this.imports = new translator_1.ImportManager(coreImportsFrom !== null);
    }
    /**
     * Track that a static field was added to the code for a class.
     */
    DtsFileTransformer.prototype.recordStaticField = function (name, decls) { this.ivyFields.set(name, decls); };
    /**
     * Process the .d.ts text for a file and add any declarations which were recorded.
     */
    DtsFileTransformer.prototype.transform = function (dts, tsPath) {
        var _this = this;
        var dtsFile = ts.createSourceFile('out.d.ts', dts, ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);
        for (var i = dtsFile.statements.length - 1; i >= 0; i--) {
            var stmt = dtsFile.statements[i];
            if (ts.isClassDeclaration(stmt) && stmt.name !== undefined &&
                this.ivyFields.has(stmt.name.text)) {
                var decls = this.ivyFields.get(stmt.name.text);
                var before = dts.substring(0, stmt.end - 1);
                var after = dts.substring(stmt.end - 1);
                dts = before +
                    decls
                        .map(function (decl) {
                        var type = translator_1.translateType(decl.type, _this.imports);
                        return "    static " + decl.name + ": " + type + ";\n";
                    })
                        .join('') +
                    after;
            }
        }
        var imports = this.imports.getAllImports(tsPath, this.coreImportsFrom);
        if (imports.length !== 0) {
            dts = imports.map(function (i) { return "import * as " + i.as + " from '" + i.name + "';\n"; }).join('') + dts;
        }
        return dts;
    };
    return DtsFileTransformer;
}());
exports.DtsFileTransformer = DtsFileTransformer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVjbGFyYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndHNjL3RyYW5zZm9ybS9zcmMvZGVjbGFyYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCwrQkFBaUM7QUFLakMsMkNBQTBEO0FBSTFEOztHQUVHO0FBQ0g7SUFJRSw0QkFBb0IsZUFBbUM7UUFBbkMsb0JBQWUsR0FBZixlQUFlLENBQW9CO1FBSC9DLGNBQVMsR0FBRyxJQUFJLEdBQUcsRUFBMkIsQ0FBQztRQUlyRCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksMEJBQWEsQ0FBQyxlQUFlLEtBQUssSUFBSSxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUVEOztPQUVHO0lBQ0gsOENBQWlCLEdBQWpCLFVBQWtCLElBQVksRUFBRSxLQUFzQixJQUFVLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFbEc7O09BRUc7SUFDSCxzQ0FBUyxHQUFULFVBQVUsR0FBVyxFQUFFLE1BQWM7UUFBckMsaUJBNkJDO1FBNUJDLElBQU0sT0FBTyxHQUNULEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRTFGLEtBQUssSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDdkQsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuQyxJQUFJLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLFNBQVM7Z0JBQ3RELElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ3RDLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFHLENBQUM7Z0JBQ25ELElBQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQzlDLElBQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFFMUMsR0FBRyxHQUFHLE1BQU07b0JBQ1IsS0FBSzt5QkFDQSxHQUFHLENBQUMsVUFBQSxJQUFJO3dCQUNQLElBQU0sSUFBSSxHQUFHLDBCQUFhLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7d0JBQ3BELE9BQU8sZ0JBQWMsSUFBSSxDQUFDLElBQUksVUFBSyxJQUFJLFFBQUssQ0FBQztvQkFDL0MsQ0FBQyxDQUFDO3lCQUNELElBQUksQ0FBQyxFQUFFLENBQUM7b0JBQ2IsS0FBSyxDQUFDO2FBQ1g7U0FDRjtRQUVELElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDekUsSUFBSSxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUN4QixHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLGlCQUFlLENBQUMsQ0FBQyxFQUFFLGVBQVUsQ0FBQyxDQUFDLElBQUksU0FBTSxFQUF6QyxDQUF5QyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQztTQUNsRjtRQUVELE9BQU8sR0FBRyxDQUFDO0lBQ2IsQ0FBQztJQUNILHlCQUFDO0FBQUQsQ0FBQyxBQTlDRCxJQThDQztBQTlDWSxnREFBa0IifQ==