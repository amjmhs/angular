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
var ts = require("typescript");
function getConstructorDependencies(clazz, reflector, isCore) {
    var useType = [];
    var ctorParams = reflector.getConstructorParameters(clazz) || [];
    ctorParams.forEach(function (param, idx) {
        var tokenExpr = param.type;
        var optional = false, self = false, skipSelf = false, host = false;
        var resolved = compiler_1.R3ResolvedDependencyType.Token;
        (param.decorators || []).filter(function (dec) { return isCore || isAngularCore(dec); }).forEach(function (dec) {
            if (dec.name === 'Inject') {
                if (dec.args === null || dec.args.length !== 1) {
                    throw new Error("Unexpected number of arguments to @Inject().");
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
                    throw new Error("Unexpected number of arguments to @Attribute().");
                }
                tokenExpr = dec.args[0];
                resolved = compiler_1.R3ResolvedDependencyType.Attribute;
            }
            else {
                throw new Error("Unexpected decorator " + dec.name + " on parameter.");
            }
        });
        if (tokenExpr === null) {
            throw new Error("No suitable token for parameter " + (param.name || idx) + " of class " + clazz.name.text);
        }
        if (ts.isIdentifier(tokenExpr)) {
            var importedSymbol = reflector.getImportOfIdentifier(tokenExpr);
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
        var token = new compiler_1.WrappedNodeExpr(tokenExpr);
        useType.push({ token: token, optional: optional, self: self, skipSelf: skipSelf, host: host, resolved: resolved });
    });
    return useType;
}
exports.getConstructorDependencies = getConstructorDependencies;
function referenceToExpression(ref, context) {
    var exp = ref.toExpression(context);
    if (exp === null) {
        throw new Error("Could not refer to " + ts.SyntaxKind[ref.node.kind]);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvYW5ub3RhdGlvbnMvc3JjL3V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCw4Q0FBOEc7QUFDOUcsK0JBQWlDO0FBS2pDLG9DQUNJLEtBQTBCLEVBQUUsU0FBeUIsRUFDckQsTUFBZTtJQUNqQixJQUFNLE9BQU8sR0FBMkIsRUFBRSxDQUFDO0lBQzNDLElBQU0sVUFBVSxHQUFHLFNBQVMsQ0FBQyx3QkFBd0IsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDbkUsVUFBVSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUssRUFBRSxHQUFHO1FBQzVCLElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7UUFDM0IsSUFBSSxRQUFRLEdBQUcsS0FBSyxFQUFFLElBQUksR0FBRyxLQUFLLEVBQUUsUUFBUSxHQUFHLEtBQUssRUFBRSxJQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ25FLElBQUksUUFBUSxHQUFHLG1DQUF3QixDQUFDLEtBQUssQ0FBQztRQUM5QyxDQUFDLEtBQUssQ0FBQyxVQUFVLElBQUksRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUEsTUFBTSxJQUFJLGFBQWEsQ0FBQyxHQUFHLENBQUMsRUFBNUIsQ0FBNEIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFBLEdBQUc7WUFDOUUsSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFBRTtnQkFDekIsSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLElBQUksSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7b0JBQzlDLE1BQU0sSUFBSSxLQUFLLENBQUMsOENBQThDLENBQUMsQ0FBQztpQkFDakU7Z0JBQ0QsU0FBUyxH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