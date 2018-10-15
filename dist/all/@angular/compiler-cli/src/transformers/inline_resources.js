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
var index_1 = require("../metadata/index");
var PRECONDITIONS_TEXT = 'angularCompilerOptions.enableResourceInlining requires all resources to be statically resolvable.';
function getResourceLoader(host, containingFileName) {
    return {
        get: function (url) {
            if (typeof url !== 'string') {
                throw new Error('templateUrl and stylesUrl must be string literals. ' + PRECONDITIONS_TEXT);
            }
            var fileName = host.resourceNameToFileName(url, containingFileName);
            if (fileName) {
                var content = host.loadResource(fileName);
                if (typeof content !== 'string') {
                    throw new Error('Cannot handle async resource. ' + PRECONDITIONS_TEXT);
                }
                return content;
            }
            throw new Error("Failed to resolve " + url + " from " + containingFileName + ". " + PRECONDITIONS_TEXT);
        }
    };
}
var InlineResourcesMetadataTransformer = /** @class */ (function () {
    function InlineResourcesMetadataTransformer(host) {
        this.host = host;
    }
    InlineResourcesMetadataTransformer.prototype.start = function (sourceFile) {
        var _this = this;
        var loader = getResourceLoader(this.host, sourceFile.fileName);
        return function (value, node) {
            if (index_1.isClassMetadata(value) && ts.isClassDeclaration(node) && value.decorators) {
                value.decorators.forEach(function (d) {
                    if (index_1.isMetadataSymbolicCallExpression(d) &&
                        index_1.isMetadataImportedSymbolReferenceExpression(d.expression) &&
                        d.expression.module === '@angular/core' && d.expression.name === 'Component' &&
                        d.arguments) {
                        d.arguments = d.arguments.map(_this.updateDecoratorMetadata.bind(_this, loader));
                    }
                });
            }
            return value;
        };
    };
    InlineResourcesMetadataTransformer.prototype.updateDecoratorMetadata = function (loader, arg) {
        if (arg['templateUrl']) {
            arg['template'] = loader.get(arg['templateUrl']);
            delete arg.templateUrl;
        }
        var styles = arg['styles'] || [];
        var styleUrls = arg['styleUrls'] || [];
        if (!Array.isArray(styles))
            throw new Error('styles should be an array');
        if (!Array.isArray(styleUrls))
            throw new Error('styleUrls should be an array');
        styles.push.apply(styles, styleUrls.map(function (styleUrl) { return loader.get(styleUrl); }));
        if (styles.length > 0) {
            arg['styles'] = styles;
            delete arg.styleUrls;
        }
        return arg;
    };
    return InlineResourcesMetadataTransformer;
}());
exports.InlineResourcesMetadataTransformer = InlineResourcesMetadataTransformer;
function getInlineResourcesTransformFactory(program, host) {
    return function (context) { return function (sourceFile) {
        var loader = getResourceLoader(host, sourceFile.fileName);
        var visitor = function (node) {
            // Components are always classes; skip any other node
            if (!ts.isClassDeclaration(node)) {
                return node;
            }
            // Decorator case - before or without decorator downleveling
            // @Component()
            var newDecorators = ts.visitNodes(node.decorators, function (node) {
                if (isComponentDecorator(node, program.getTypeChecker())) {
                    return updateDecorator(node, loader);
                }
                return node;
            });
            // Annotation case - after decorator downleveling
            // static decorators: {type: Function, args?: any[]}[]
            var newMembers = ts.visitNodes(node.members, function (node) { return updateAnnotations(node, loader, program.getTypeChecker()); });
            // Create a new AST subtree with our modifications
            return ts.updateClassDeclaration(node, newDecorators, node.modifiers, node.name, node.typeParameters, node.heritageClauses || [], newMembers);
        };
        return ts.visitEachChild(sourceFile, visitor, context);
    }; };
}
exports.getInlineResourcesTransformFactory = getInlineResourcesTransformFactory;
/**
 * Update a Decorator AST node to inline the resources
 * @param node the @Component decorator
 * @param loader provides access to load resources
 */
function updateDecorator(node, loader) {
    if (!ts.isCallExpression(node.expression)) {
        // User will get an error somewhere else with bare @Component
        return node;
    }
    var expr = node.expression;
    var newArguments = updateComponentProperties(expr.arguments, loader);
    return ts.updateDecorator(node, ts.updateCall(expr, expr.expression, expr.typeArguments, newArguments));
}
/**
 * Update an Annotations AST node to inline the resources
 * @param node the static decorators property
 * @param loader provides access to load resources
 * @param typeChecker provides access to symbol table
 */
function updateAnnotations(node, loader, typeChecker) {
    // Looking for a member of this shape:
    // PropertyDeclaration called decorators, with static modifier
    // Initializer is ArrayLiteralExpression
    // One element is the Component type, its initializer is the @angular/core Component symbol
    // One element is the component args, its initializer is the Component arguments to change
    // e.g.
    //   static decorators: {type: Function, args?: any[]}[] =
    //   [{
    //     type: Component,
    //     args: [{
    //       templateUrl: './my.component.html',
    //       styleUrls: ['./my.component.css'],
    //     }],
    //   }];
    if (!ts.isPropertyDeclaration(node) || // ts.ModifierFlags.Static &&
        !ts.isIdentifier(node.name) || node.name.text !== 'decorators' || !node.initializer ||
        !ts.isArrayLiteralExpression(node.initializer)) {
        return node;
    }
    var newAnnotations = node.initializer.elements.map(function (annotation) {
        // No-op if there's a non-object-literal mixed in the decorators values
        if (!ts.isObjectLiteralExpression(annotation))
            return annotation;
        var decoratorType = annotation.properties.find(function (p) { return isIdentifierNamed(p, 'type'); });
        // No-op if there's no 'type' property, or if it's not initialized to the Component symbol
        if (!decoratorType || !ts.isPropertyAssignment(decoratorType) ||
            !ts.isIdentifier(decoratorType.initializer) ||
            !isComponentSymbol(decoratorType.initializer, typeChecker)) {
            return annotation;
        }
        var newAnnotation = annotation.properties.map(function (prop) {
            // No-op if this isn't the 'args' property or if it's not initialized to an array
            if (!isIdentifierNamed(prop, 'args') || !ts.isPropertyAssignment(prop) ||
                !ts.isArrayLiteralExpression(prop.initializer))
                return prop;
            var newDecoratorArgs = ts.updatePropertyAssignment(prop, prop.name, ts.createArrayLiteral(updateComponentProperties(prop.initializer.elements, loader)));
            return newDecoratorArgs;
        });
        return ts.updateObjectLiteral(annotation, newAnnotation);
    });
    return ts.updateProperty(node, node.decorators, node.modifiers, node.name, node.questionToken, node.type, ts.updateArrayLiteral(node.initializer, newAnnotations));
}
function isIdentifierNamed(p, name) {
    return !!p.name && ts.isIdentifier(p.name) && p.name.text === name;
}
/**
 * Check that the node we are visiting is the actual Component decorator defined in @angular/core.
 */
function isComponentDecorator(node, typeChecker) {
    if (!ts.isCallExpression(node.expression)) {
        return false;
    }
    var callExpr = node.expression;
    var identifier;
    if (ts.isIdentifier(callExpr.expression)) {
        identifier = callExpr.expression;
    }
    else {
        return false;
    }
    return isComponentSymbol(identifier, typeChecker);
}
function isComponentSymbol(identifier, typeChecker) {
    // Only handle identifiers, not expressions
    if (!ts.isIdentifier(identifier))
        return false;
    // NOTE: resolver.getReferencedImportDeclaration would work as well but is internal
    var symbol = typeChecker.getSymbolAtLocation(identifier);
    if (!symbol || !symbol.declarations || !symbol.declarations.length) {
        console.error("Unable to resolve symbol '" + identifier.text + "' in the program, does it type-check?");
        return false;
    }
    var declaration = symbol.declarations[0];
    if (!declaration || !ts.isImportSpecifier(declaration)) {
        return false;
    }
    var name = (declaration.propertyName || declaration.name).text;
    // We know that parent pointers are set because we created the SourceFile ourselves.
    // The number of parent references here match the recursion depth at this point.
    var moduleId = declaration.parent.parent.parent.moduleSpecifier.text;
    return moduleId === '@angular/core' && name === 'Component';
}
/**
 * For each property in the object literal, if it's templateUrl or styleUrls, replace it
 * with content.
 * @param node the arguments to @Component() or args property of decorators: [{type:Component}]
 * @param loader provides access to the loadResource method of the host
 * @returns updated arguments
 */
function updateComponentProperties(args, loader) {
    if (args.length !== 1) {
        // User should have gotten a type-check error because @Component takes one argument
        return args;
    }
    var componentArg = args[0];
    if (!ts.isObjectLiteralExpression(componentArg)) {
        // User should have gotten a type-check error because @Component takes an object literal
        // argument
        return args;
    }
    var newProperties = [];
    var newStyleExprs = [];
    componentArg.properties.forEach(function (prop) {
        if (!ts.isPropertyAssignment(prop) || ts.isComputedPropertyName(prop.name)) {
            newProperties.push(prop);
            return;
        }
        switch (prop.name.text) {
            case 'styles':
                if (!ts.isArrayLiteralExpression(prop.initializer)) {
                    throw new Error('styles takes an array argument');
                }
                newStyleExprs.push.apply(newStyleExprs, prop.initializer.elements);
                break;
            case 'styleUrls':
                if (!ts.isArrayLiteralExpression(prop.initializer)) {
                    throw new Error('styleUrls takes an array argument');
                }
                newStyleExprs.push.apply(newStyleExprs, prop.initializer.elements.map(function (expr) {
                    if (!ts.isStringLiteral(expr) && !ts.isNoSubstitutionTemplateLiteral(expr)) {
                        throw new Error('Can only accept string literal arguments to styleUrls. ' + PRECONDITIONS_TEXT);
                    }
                    var styles = loader.get(expr.text);
                    return ts.createLiteral(styles);
                }));
                break;
            case 'templateUrl':
                if (!ts.isStringLiteral(prop.initializer) &&
                    !ts.isNoSubstitutionTemplateLiteral(prop.initializer)) {
                    throw new Error('Can only accept a string literal argument to templateUrl. ' + PRECONDITIONS_TEXT);
                }
                var template = loader.get(prop.initializer.text);
                newProperties.push(ts.updatePropertyAssignment(prop, ts.createIdentifier('template'), ts.createLiteral(template)));
                break;
            default:
                newProperties.push(prop);
        }
    });
    // Add the non-inline styles
    if (newStyleExprs.length > 0) {
        var newStyles = ts.createPropertyAssignment(ts.createIdentifier('styles'), ts.createArrayLiteral(newStyleExprs));
        newProperties.push(newStyles);
    }
    return ts.createNodeArray([ts.updateObjectLiteral(componentArg, newProperties)]);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5saW5lX3Jlc291cmNlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvdHJhbnNmb3JtZXJzL2lubGluZV9yZXNvdXJjZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCwrQkFBaUM7QUFFakMsMkNBQWdLO0FBSWhLLElBQU0sa0JBQWtCLEdBQ3BCLG1HQUFtRyxDQUFDO0FBWXhHLDJCQUEyQixJQUFtQixFQUFFLGtCQUEwQjtJQUN4RSxPQUFPO1FBQ0wsR0FBRyxFQUFILFVBQUksR0FBMkI7WUFDN0IsSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLEVBQUU7Z0JBQzNCLE1BQU0sSUFBSSxLQUFLLENBQUMscURBQXFELEdBQUcsa0JBQWtCLENBQUMsQ0FBQzthQUM3RjtZQUFDLElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxHQUFHLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztZQUN4RSxJQUFJLFFBQVEsRUFBRTtnQkFDWixJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUM1QyxJQUFJLE9BQU8sT0FBTyxLQUFLLFFBQVEsRUFBRTtvQkFDL0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxnQ0FBZ0MsR0FBRyxrQkFBa0IsQ0FBQyxDQUFDO2lCQUN4RTtnQkFDRCxPQUFPLE9BQU8sQ0FBQzthQUNoQjtZQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsdUJBQXFCLEdBQUcsY0FBUyxrQkFBa0IsVUFBSyxrQkFBb0IsQ0FBQyxDQUFDO1FBQ2xHLENBQUM7S0FDRixDQUFDO0FBQ0osQ0FBQztBQUVEO0lBQ0UsNENBQW9CLElBQW1CO1FBQW5CLFNBQUksR0FBSixJQUFJLENBQWU7SUFBRyxDQUFDO0lBRTNDLGtEQUFLLEdBQUwsVUFBTSxVQUF5QjtRQUEvQixpQkFlQztRQWRDLElBQU0s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