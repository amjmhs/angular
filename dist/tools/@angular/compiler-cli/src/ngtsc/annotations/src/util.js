"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const compiler_1 = require("@angular/compiler");
const ts = require("typescript");
function getConstructorDependencies(clazz, reflector, isCore) {
    const useType = [];
    const ctorParams = reflector.getConstructorParameters(clazz) || [];
    ctorParams.forEach((param, idx) => {
        let tokenExpr = param.type;
        let optional = false, self = false, skipSelf = false, host = false;
        let resolved = compiler_1.R3ResolvedDependencyType.Token;
        (param.decorators || []).filter(dec => isCore || isAngularCore(dec)).forEach(dec => {
            if (dec.name === 'Inject') {
                if (dec.args === null || dec.args.length !== 1) {
                    throw new Error(`Unexpected number of arguments to @Inject().`);
                }
                tokenExpr = dec.args[0];
            }
            else if (dec.name === 'Optional') {
                optional = true;
            }
            else if (dec.name === 'SkipSelf') {
                skipSelf = true;
            }
            else if (dec.name === 'Self') {
                self = true;
            }
            else if (dec.name === 'Host') {
                host = true;
            }
            else if (dec.name === 'Attribute') {
                if (dec.args === null || dec.args.length !== 1) {
                    throw new Error(`Unexpected number of arguments to @Attribute().`);
                }
                tokenExpr = dec.args[0];
                resolved = compiler_1.R3ResolvedDependencyType.Attribute;
            }
            else {
                throw new Error(`Unexpected decorator ${dec.name} on parameter.`);
            }
        });
        if (tokenExpr === null) {
            throw new Error(`No suitable token for parameter ${param.name || idx} of class ${clazz.name.text}`);
        }
        if (ts.isIdentifier(tokenExpr)) {
            const importedSymbol = reflector.getImportOfIdentifier(tokenExpr);
            if (importedSymbol !== null && importedSymbol.from === '@angular/core') {
                switch (importedSymbol.name) {
                    case 'ChangeDetectorRef':
                        resolved = compiler_1.R3ResolvedDependencyType.ChangeDetectorRef;
                        break;
                    case 'ElementRef':
                        resolved = compiler_1.R3ResolvedDependencyType.ElementRef;
                        break;
                    case 'Injector':
                        resolved = compiler_1.R3ResolvedDependencyType.Injector;
                        break;
                    case 'TemplateRef':
                        resolved = compiler_1.R3ResolvedDependencyType.TemplateRef;
                        break;
                    case 'ViewContainerRef':
                        resolved = compiler_1.R3ResolvedDependencyType.ViewContainerRef;
                        break;
                    default:
                    // Leave as a Token or Attribute.
                }
            }
        }
        const token = new compiler_1.WrappedNodeExpr(tokenExpr);
        useType.push({ token, optional, self, skipSelf, host, resolved });
    });
    return useType;
}
exports.getConstructorDependencies = getConstructorDependencies;
function referenceToExpression(ref, context) {
    const exp = ref.toExpression(context);
    if (exp === null) {
        throw new Error(`Could not refer to ${ts.SyntaxKind[ref.node.kind]}`);
    }
    return exp;
}
exports.referenceToExpression = referenceToExpression;
function isAngularCore(decorator) {
    return decorator.import !== null && decorator.import.from === '@angular/core';
}
exports.isAngularCore = isAngularCore;
/**
 * Unwrap a `ts.Expression`, removing outer type-casts or parentheses until the expression is in its
 * lowest level form.
 *
 * For example, the expression "(foo as Type)" unwraps to "foo".
 */
function unwrapExpression(node) {
    while (ts.isAsExpression(node) || ts.isParenthesizedExpression(node)) {
        node = node.expression;
    }
    return node;
}
exports.unwrapExpression = unwrapExpression;
//# sourceMappingURL=util.js.map