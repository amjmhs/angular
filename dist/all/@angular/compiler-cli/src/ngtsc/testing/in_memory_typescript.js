"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var ts = require("typescript");
function makeProgram(files) {
    var host = new InMemoryHost();
    files.forEach(function (file) { return host.writeFile(file.name, file.contents); });
    var rootNames = files.map(function (file) { return host.getCanonicalFileName(file.name); });
    var program = ts.createProgram(rootNames, { noLib: true, experimentalDecorators: true, moduleResolution: ts.ModuleResolutionKind.NodeJs }, host);
    var diags = program.getSyntacticDiagnostics().concat(program.getSemanticDiagnostics());
    if (diags.length > 0) {
        throw new Error("Typescript diagnostics failed! " + diags.map(function (diag) { return diag.messageText; }).join(', '));
    }
    return { program: program, host: host };
}
exports.makeProgram = makeProgram;
var InMemoryHost = /** @class */ (function () {
    function InMemoryHost() {
        this.fileSystem = new Map();
    }
    InMemoryHost.prototype.getSourceFile = function (fileName, languageVersion, onError, shouldCreateNewSourceFile) {
        var contents = this.fileSystem.get(this.getCanonicalFileName(fileName));
        if (contents === undefined) {
            onError && onError("File does not exist: " + this.getCanonicalFileName(fileName) + ")");
            return undefined;
        }
        return ts.createSourceFile(fileName, contents, languageVersion, undefined, ts.ScriptKind.TS);
    };
    InMemoryHost.prototype.getDefaultLibFileName = function (options) { return '/lib.d.ts'; };
    InMemoryHost.prototype.writeFile = function (fileName, data, writeByteOrderMark, onError, sourceFiles) {
        this.fileSystem.set(this.getCanonicalFileName(fileName), data);
    };
    InMemoryHost.prototype.getCurrentDirectory = function () { return '/'; };
    InMemoryHost.prototype.getDirectories = function (dir) {
        var fullDir = this.getCanonicalFileName(dir) + '/';
        var dirSet = new Set(Array
            // Look at all paths known to the host.
            .from(this.fileSystem.keys())
            // Filter out those that aren't under the requested directory.
            .filter(function (candidate) { return candidate.startsWith(fullDir); })
            // Relativize the rest by the requested directory.
            .map(function (candidate) { return candidate.substr(fullDir.length); })
            // What's left are dir/.../file.txt entries, and file.txt entries.
            // Get the dirname, which
            // yields '.' for the latter and dir/... for the former.
            .map(function (candidate) { return path.dirname(candidate); })
            // Filter out the '.' entries, which were files.
            .filter(function (candidate) { return candidate !== '.'; })
            // Finally, split on / and grab the first entry.
            .map(function (candidate) { return candidate.split('/', 1)[0]; }));
        // Get the resulting values out of the Set.
        return Array.from(dirSet);
    };
    InMemoryHost.prototype.getCanonicalFileName = function (fileName) {
        return path.posix.normalize(this.getCurrentDirectory() + "/" + fileName);
    };
    InMemoryHost.prototype.useCaseSensitiveFileNames = function () { return true; };
    InMemoryHost.prototype.getNewLine = function () { return '\n'; };
    InMemoryHost.prototype.fileExists = function (fileName) { return this.fileSystem.has(fileName); };
    InMemoryHost.prototype.readFile = function (fileName) { return this.fileSystem.get(fileName); };
    return InMemoryHost;
}());
exports.InMemoryHost = InMemoryHost;
function bindingNameEquals(node, name) {
    if (ts.isIdentifier(node)) {
        return node.text === name;
    }
    return false;
}
function getDeclaration(program, fileName, name, assert) {
    var sf = program.getSourceFile(fileName);
    if (!sf) {
        throw new Error("No such file: " + fileName);
    }
    var chosenDecl = null;
    sf.statements.forEach(function (stmt) {
        if (chosenDecl !== null) {
            return;
        }
        else if (ts.isVariableStatement(stmt)) {
            stmt.declarationList.declarations.forEach(function (decl) {
                if (bindingNameEquals(decl.name, name)) {
                    chosenDecl = decl;
                }
            });
        }
        else if (ts.isClassDeclaration(stmt) || ts.isFunctionDeclaration(stmt)) {
            if (stmt.name !== undefined && stmt.name.text === name) {
                chosenDecl = stmt;
            }
        }
    });
    chosenDecl = chosenDecl;
    if (chosenDecl === null) {
        throw new Error("No such symbol: " + name + " in " + fileName);
    }
    if (!assert(chosenDecl)) {
        throw new Error("Symbol " + name + " from " + fileName + " is a " + ts.SyntaxKind[chosenDecl.kind]);
    }
    return chosenDecl;
}
exports.getDeclaration = getDeclaration;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5fbWVtb3J5X3R5cGVzY3JpcHQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndHNjL3Rlc3RpbmcvaW5fbWVtb3J5X3R5cGVzY3JpcHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCwyQkFBNkI7QUFDN0IsK0JBQWlDO0FBRWpDLHFCQUE0QixLQUF5QztJQUVuRSxJQUFNLElBQUksR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO0lBQ2hDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJLElBQUksT0FBQSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUF4QyxDQUF3QyxDQUFDLENBQUM7SUFFaEUsSUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFBLElBQUksSUFBSSxPQUFBLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQXBDLENBQW9DLENBQUMsQ0FBQztJQUMxRSxJQUFNLE9BQU8sR0FBRyxFQUFFLENBQUMsYUFBYSxDQUM1QixTQUFTLEVBQ1QsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLHNCQUFzQixFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxFQUFFLENBQUMsb0JBQW9CLENBQUMsTUFBTSxFQUFDLEVBQzdGLElBQUksQ0FBQyxDQUFDO0lBQ1YsSUFBTSxLQUFLLEdBQU8sT0FBTyxDQUFDLHVCQUF1QixFQUFFLFFBQUssT0FBTyxDQUFDLHNCQUFzQixFQUFFLENBQUMsQ0FBQztJQUMxRixJQUFJLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1FBQ3BCLE1BQU0sSUFBSSxLQUFLLENBQ1gsb0NBQWtDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQSxJQUFJLElBQUksT0FBQSxJQUFJLENBQUMsV0FBVyxFQUFoQixDQUFnQixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBRyxDQUFDLENBQUM7S0FDekY7SUFDRCxPQUFPLEVBQUMsT0FBTyxTQUFBLEVBQUUsSUFBSSxNQUFBLEVBQUMsQ0FBQztBQUN6QixDQUFDO0FBaEJELGtDQWdCQztBQUVEO0lBQUE7UUFDVSxlQUFVLEdBQUcsSUFBSSxHQUFHLEVBQWtCLENBQUM7SUEwRGpELENBQUM7SUF4REMsb0NBQWEsR0FBYixVQUNJLFFBQWdCLEVBQUUsZUFBZ0MsRUFDbEQsT0FBK0MsRUFDL0MseUJBQTZDO1FBQy9DLElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQzFFLElBQUksUUFBUSxLQUFLLFNBQVMsRUFBRTtZQUMxQixPQUFPLElBQUksT0FBTyxDQUFDLDBCQUF3QixJQUFJLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLE1BQUcsQ0FBQyxDQUFDO1lBQ25GLE9BQU8sU0FBUyxDQUFDO1NBQ2xCO1FBQ0QsT0FBTyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxlQUFlLEVBQUUsU0FBUyxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDL0YsQ0FBQztJQUVELDRDQUFxQixHQUFyQixVQUFzQixPQUEyQixJQUFZLE9BQU8sV0FBVyxDQUFDLENBQUMsQ0FBQztJQUVsRixnQ0FBUyxHQUFULFVBQ0ksUUFBZ0IsRUFBRSxJQUFZLEVBQUUsa0JBQTRCLEVBQzVELE9BQStDLEVBQy9DLFdBQTBDO1FBQzVDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNqRSxDQUFDO0lBRUQsMENBQW1CLEdBQW5CLGNBQWdDLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUU3QyxxQ0FBYyxHQUFkLFVBQWUsR0FBVztRQUN4QixJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBQ3JELElBQU0sTUFBTSxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUs7WUFDRCx1Q0FBdUM7YUFDdEMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDN0IsOERBQThEO2FBQzdELE1BQU0sQ0FBQyxVQUFBLFNBQVMsSUFBSSxPQUFBLFNBQVMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQTdCLENBQTZCLENBQUM7WUFDbkQsa0RBQWtEO2FBQ2pELEdBQUcsQ0FBQyxVQUFBLFNBQVMsSUFBSSxPQUFBLFNBQVMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFoQyxDQUFnQyxDQUFDO1lBQ25ELGtFQUFrRTtZQUNsRSx5QkFBeUI7WUFDekIsd0RBQXdEO2FBQ3ZELEdBQUcsQ0FBQyxVQUFBLFNBQVMsSUFBSSxPQUFBLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQXZCLENBQXVCLENBQUM7WUFDMUMsZ0RBQWdEO2FBQy9DLE1BQU0sQ0FBQyxVQUFBLFNBQVMsSUFBSSxPQUFBLFNBQVMsS0FBSyxHQUFHLEVBQWpCLENBQWlCLENBQUM7WUFDdkMsZ0RBQWdEO2FBQy9DLEdBQUcsQ0FBQyxVQUFBLFNBQVMsSUFBSSxPQUFBLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUExQixDQUEwQixDQUFDLENBQUMsQ0FBQztRQUUxRSwyQ0FBMkM7UUFDM0MsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRCwyQ0FBb0IsR0FBcEIsVUFBcUIsUUFBZ0I7UUFDbkMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBSSxJQUFJLENBQUMsbUJBQW1CLEVBQUUsU0FBSSxRQUFVLENBQUMsQ0FBQztJQUMzRSxDQUFDO0lBRUQsZ0RBQXlCLEdBQXpCLGNBQXVDLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQztJQUVyRCxpQ0FBVSxHQUFWLGNBQXVCLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQztJQUVyQyxpQ0FBVSxHQUFWLFVBQVcsUUFBZ0IsSUFBYSxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUUvRSwrQkFBUSxHQUFSLFVBQVMsUUFBZ0IsSUFBc0IsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEYsbUJBQUM7QUFBRCxDQUFDLEFBM0RELElBMkRDO0FBM0RZLG9DQUFZO0FBNkR6QiwyQkFBMkIsSUFBb0IsRUFBRSxJQUFZO0lBQzNELElBQUksRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUN6QixPQUFPLElBQUksQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDO0tBQzNCO0lBQ0QsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDO0FBRUQsd0JBQ0ksT0FBbUIsRUFBRSxRQUFnQixFQUFFLElBQVksRUFBRSxNQUFrQztJQUN6RixJQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzNDLElBQUksQ0FBQyxFQUFFLEVBQUU7UUFDUCxNQUFNLElBQUksS0FBSyxDQUFDLG1CQUFpQixRQUFVLENBQUMsQ0FBQztLQUM5QztJQUVELElBQUksVUFBVSxHQUF3QixJQUFJLENBQUM7SUFFM0MsRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJO1FBQ3hCLElBQUksVUFBVSxLQUFLLElBQUksRUFBRTtZQUN2QixPQUFPO1NBQ1I7YUFBTSxJQUFJLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN2QyxJQUFJLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJO2dCQUM1QyxJQUFJLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQUU7b0JBQ3RDLFVBQVUsR0FBRyxJQUFJLENBQUM7aUJBQ25CO1lBQ0gsQ0FBQyxDQUFDLENBQUM7U0FDSjthQUFNLElBQUksRUFBRSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN4RSxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssU0FBUyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLElBQUksRUFBRTtnQkFDdEQsVUFBVSxHQUFHLElBQUksQ0FBQzthQUNuQjtTQUNGO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFFSCxVQUFVLEdBQUcsVUFBbUMsQ0FBQztJQUVqRCxJQUFJLFVBQVUsS0FBSyxJQUFJLEVBQUU7UUFDdkIsTUFBTSxJQUFJLEtBQUssQ0FBQyxxQkFBbUIsSUFBSSxZQUFPLFFBQVUsQ0FBQyxDQUFDO0tBQzNEO0lBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsRUFBRTtRQUN2QixNQUFNLElBQUksS0FBSyxDQUFDLFlBQVUsSUFBSSxjQUFTLFFBQVEsY0FBUyxFQUFFLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUcsQ0FBQyxDQUFDO0tBQzNGO0lBRUQsT0FBTyxVQUFVLENBQUM7QUFDcEIsQ0FBQztBQW5DRCx3Q0FtQ0MifQ==