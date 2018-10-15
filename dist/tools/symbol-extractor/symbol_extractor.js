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
var SymbolExtractor = /** @class */ (function () {
    function SymbolExtractor(path, contents) {
        this.path = path;
        this.contents = contents;
        this.actual = SymbolExtractor.parse(path, contents);
    }
    SymbolExtractor.symbolSort = function (a, b) {
        return a.name == b.name ? 0 : a.name < b.name ? -1 : 1;
    };
    SymbolExtractor.parse = function (path, contents) {
        var symbols = [];
        var source = ts.createSourceFile(path, contents, ts.ScriptTarget.Latest, true);
        var fnRecurseDepth = 0;
        function visitor(child) {
            // Left for easier debugging.
            // console.log('>>>', ts.SyntaxKind[child.kind]);
            switch (child.kind) {
                case ts.SyntaxKind.FunctionExpression:
                    fnRecurseDepth++;
                    if (fnRecurseDepth <= 1) {
                        ts.forEachChild(child, visitor);
                    }
                    fnRecurseDepth--;
                    break;
                case ts.SyntaxKind.SourceFile:
                case ts.SyntaxKind.VariableStatement:
                case ts.SyntaxKind.VariableDeclarationList:
                case ts.SyntaxKind.ExpressionStatement:
                case ts.SyntaxKind.CallExpression:
                case ts.SyntaxKind.ParenthesizedExpression:
                case ts.SyntaxKind.Block:
                case ts.SyntaxKind.PrefixUnaryExpression:
                    ts.forEachChild(child, visitor);
                    break;
                case ts.SyntaxKind.VariableDeclaration:
                    var varDecl = child;
                    if (varDecl.initializer && fnRecurseDepth !== 0) {
                        symbols.push({ name: varDecl.name.getText() });
                    }
                    if (fnRecurseDepth == 0 && isRollupExportSymbol(varDecl)) {
                        ts.forEachChild(child, visitor);
                    }
                    break;
                case ts.SyntaxKind.FunctionDeclaration:
                    var funcDecl = child;
                    funcDecl.name && symbols.push({ name: funcDecl.name.getText() });
                    break;
                default:
                // Left for easier debugging.
                // console.log('###', ts.SyntaxKind[child.kind], child.getText());
            }
            if (symbols.length && symbols[symbols.length - 1].name == 'type') {
                debugger;
            }
        }
        visitor(source);
        symbols.sort(SymbolExtractor.symbolSort);
        return symbols;
    };
    SymbolExtractor.diff = function (actual, expected) {
        if (typeof expected == 'string') {
            expected = JSON.parse(expected);
        }
        var diff = {};
        expected.forEach(function (nameOrSymbol) {
            diff[typeof nameOrSymbol == 'string' ? nameOrSymbol : nameOrSymbol.name] = 'missing';
        });
        actual.forEach(function (s) {
            if (diff[s.name] === 'missing') {
                delete diff[s.name];
            }
            else {
                diff[s.name] = 'extra';
            }
        });
        return diff;
    };
    SymbolExtractor.prototype.expect = function (expectedSymbols) {
        expect(SymbolExtractor.diff(this.actual, expectedSymbols)).toEqual({});
    };
    SymbolExtractor.prototype.compareAndPrintError = function (goldenFilePath, expected) {
        var _this = this;
        var passed = true;
        var diff = SymbolExtractor.diff(this.actual, expected);
        Object.keys(diff).forEach(function (key) {
            if (passed) {
                console.error("Expected symbols in '" + _this.path + "' did not match gold file.");
                passed = false;
            }
            console.error("   Symbol: " + key + " => " + diff[key]);
        });
        return passed;
    };
    return SymbolExtractor;
}());
exports.SymbolExtractor = SymbolExtractor;
function toSymbol(v) {
    return typeof v == 'string' ? { 'name': v } : v;
}
function toName(symbol) {
    return symbol.name;
}
/**
 * Detects if VariableDeclarationList is format `var ..., bundle = function(){}()`;
 *
 * Rollup produces this format when it wants to export symbols from a bundle.
 * @param child
 */
function isRollupExportSymbol(decl) {
    return !!(decl.initializer && decl.initializer.kind == ts.SyntaxKind.CallExpression) &&
        ts.isIdentifier(decl.name) && decl.name.text === 'bundle';
}
//# sourceMappingURL=symbol_extractor.js.map