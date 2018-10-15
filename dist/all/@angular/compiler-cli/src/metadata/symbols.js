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
var Symbols = /** @class */ (function () {
    function Symbols(sourceFile) {
        this.sourceFile = sourceFile;
        this.references = new Map();
    }
    Symbols.prototype.resolve = function (name, preferReference) {
        return (preferReference && this.references.get(name)) || this.symbols.get(name);
    };
    Symbols.prototype.define = function (name, value) { this.symbols.set(name, value); };
    Symbols.prototype.defineReference = function (name, value) {
        this.references.set(name, value);
    };
    Symbols.prototype.has = function (name) { return this.symbols.has(name); };
    Object.defineProperty(Symbols.prototype, "symbols", {
        get: function () {
            var result = this._symbols;
            if (!result) {
                result = this._symbols = new Map();
                populateBuiltins(result);
                this.buildImports();
            }
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Symbols.prototype.buildImports = function () {
        var _this = this;
        var symbols = this._symbols;
        // Collect the imported symbols into this.symbols
        var stripQuotes = function (s) { return s.replace(/^['"]|['"]$/g, ''); };
        var visit = function (node) {
            switch (node.kind) {
                case ts.SyntaxKind.ImportEqualsDeclaration:
                    var importEqualsDeclaration = node;
                    if (importEqualsDeclaration.moduleReference.kind ===
                        ts.SyntaxKind.ExternalModuleReference) {
                        var externalReference = importEqualsDeclaration.moduleReference;
                        if (externalReference.expression) {
                            // An `import <identifier> = require(<module-specifier>);
                            if (!externalReference.expression.parent) {
                                // The `parent` field of a node is set by the TypeScript binder (run as
                                // part of the type checker). Setting it here allows us to call `getText()`
                                // even if the `SourceFile` was not type checked (which looks for `SourceFile`
                                // in the parent chain). This doesn't damage the node as the binder unconditionally
                                // sets the parent.
                                externalReference.expression.parent = externalReference;
                                externalReference.parent = _this.sourceFile;
                            }
                            var from_1 = stripQuotes(externalReference.expression.getText());
                            symbols.set(importEqualsDeclaration.name.text, { __symbolic: 'reference', module: from_1 });
                            break;
                        }
                    }
                    symbols.set(importEqualsDeclaration.name.text, { __symbolic: 'error', message: "Unsupported import syntax" });
                    break;
                case ts.SyntaxKind.ImportDeclaration:
                    var importDecl = node;
                    if (!importDecl.importClause) {
                        // An `import <module-specifier>` clause which does not bring symbols into scope.
                        break;
                    }
                    if (!importDecl.moduleSpecifier.parent) {
                        // See note above in the `ImportEqualDeclaration` case.
                        importDecl.moduleSpecifier.parent = importDecl;
                        importDecl.parent = _this.sourceFile;
                    }
                    var from = stripQuotes(importDecl.moduleSpecifier.getText());
                    if (importDecl.importClause.name) {
                        // An `import <identifier> form <module-specifier>` clause. Record the default symbol.
                        symbols.set(importDecl.importClause.name.text, { __symbolic: 'reference', module: from, default: true });
                    }
                    var bindings = importDecl.importClause.namedBindings;
                    if (bindings) {
                        switch (bindings.kind) {
                            case ts.SyntaxKind.NamedImports:
                                // An `import { [<identifier> [, <identifier>] } from <module-specifier>` clause
                                for (var _i = 0, _a = bindings.elements; _i < _a.length; _i++) {
                                    var binding = _a[_i];
                                    symbols.set(binding.name.text, {
                                        __symbolic: 'reference',
                                        module: from,
                                        name: binding.propertyName ? binding.propertyName.text : binding.name.text
                                    });
                                }
                                break;
                            case ts.SyntaxKind.NamespaceImport:
                                // An `input * as <identifier> from <module-specifier>` clause.
                                symbols.set(bindings.name.text, { __symbolic: 'reference', module: from });
                                break;
                        }
                    }
                    break;
            }
            ts.forEachChild(node, visit);
        };
        if (this.sourceFile) {
            ts.forEachChild(this.sourceFile, visit);
        }
    };
    return Symbols;
}());
exports.Symbols = Symbols;
function populateBuiltins(symbols) {
    // From lib.core.d.ts (all "define const")
    ['Object', 'Function', 'String', 'Number', 'Array', 'Boolean', 'Map', 'NaN', 'Infinity', 'Math',
        'Date', 'RegExp', 'Error', 'Error', 'EvalError', 'RangeError', 'ReferenceError', 'SyntaxError',
        'TypeError', 'URIError', 'JSON', 'ArrayBuffer', 'DataView', 'Int8Array', 'Uint8Array',
        'Uint8ClampedArray', 'Uint16Array', 'Int16Array', 'Int32Array', 'Uint32Array', 'Float32Array',
        'Float64Array']
        .forEach(function (name) { return symbols.set(name, { __symbolic: 'reference', name: name }); });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ltYm9scy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbWV0YWRhdGEvc3ltYm9scy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILCtCQUFpQztBQUlqQztJQUtFLGlCQUFvQixVQUF5QjtRQUF6QixlQUFVLEdBQVYsVUFBVSxDQUFlO1FBRnJDLGVBQVUsR0FBRyxJQUFJLEdBQUcsRUFBK0MsQ0FBQztJQUU1QixDQUFDO0lBRWpELHlCQUFPLEdBQVAsVUFBUSxJQUFZLEVBQUUsZUFBeUI7UUFDN0MsT0FBTyxDQUFDLGVBQWUsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xGLENBQUM7SUFFRCx3QkFBTSxHQUFOLFVBQU8sSUFBWSxFQUFFLEtBQW9CLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM3RSxpQ0FBZSxHQUFmLFVBQWdCLElBQVksRUFBRSxLQUEwQztRQUN0RSxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUVELHFCQUFHLEdBQUgsVUFBSSxJQUFZLElBQWEsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFN0Qsc0JBQVksNEJBQU87YUFBbkI7WUFDRSxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1lBQzNCLElBQUksQ0FBQyxNQUFNLEVBQUU7Z0JBQ1gsTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxHQUFHLEVBQXlCLENB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