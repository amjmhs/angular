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
var ts = require("typescript");
var evaluator_1 = require("./evaluator");
var schema_1 = require("./schema");
var symbols_1 = require("./symbols");
var isStatic = function (node) { return ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Static; };
/**
 * Collect decorator metadata from a TypeScript module.
 */
var MetadataCollector = /** @class */ (function () {
    function MetadataCollector(options) {
        if (options === void 0) { options = {}; }
        this.options = options;
    }
    /**
     * Returns a JSON.stringify friendly form describing the decorators of the exported classes from
     * the source file that is expected to correspond to a module.
     */
    MetadataCollector.prototype.getMetadata = function (sourceFile, strict, substituteExpression) {
        var _this = this;
        if (strict === void 0) { strict = false; }
        var locals = new symbols_1.Symbols(sourceFile);
        var nodeMap = new Map();
        var composedSubstituter = substituteExpression && this.options.substituteExpression ?
            function (value, node) {
                return _this.options.substituteExpression(substituteExpression(value, node), node);
            } :
            substituteExpression;
        var evaluatorOptions = substituteExpression ? __assign({}, this.options, { substituteExpression: composedSubstituter }) :
            this.options;
        var metadata;
        var evaluator = new evaluator_1.Evaluator(locals, nodeMap, evaluatorOptions, function (name, value) {
            if (!metadata)
                metadata = {};
            metadata[name] = value;
        });
        var exports = undefined;
        function objFromDecorator(decoratorNode) {
            return evaluator.evaluateNode(decoratorNode.expression);
        }
        function recordEntry(entry, node) {
            if (composedSubstituter) {
                entry = composedSubstituter(entry, node);
            }
            return evaluator_1.recordMapEntry(entry, node, nodeMap, sourceFile);
        }
        function errorSym(message, node, context) {
            return evaluator_1.errorSymbol(message, node, context, sourceFile);
        }
        function maybeGetSimpleFunction(functionDeclaration) {
            if (functionDeclaration.name && functionDeclaration.name.kind == ts.SyntaxKind.Identifier) {
                var nameNode = functionDeclaration.name;
                var functionName = nameNode.text;
                var functionBody = functionDeclaration.body;
                if (functionBody && functionBody.statements.length == 1) {
                    var statement = functionBody.statements[0];
                    if (statement.kind === ts.SyntaxKind.ReturnStatement) {
                        var returnStatement = statement;
                        if (returnStatement.expression) {
                            var func = {
                                __symbolic: 'function',
                                parameters: namesOf(functionDeclaration.parameters),
                                value: evaluator.evaluateNode(returnStatement.expression)
                            };
                            if (functionDeclaration.parameters.some(function (p) { return p.initializer != null; })) {
                                func.defaults = functionDeclaration.parameters.map(function (p) { return p.initializer && evaluator.evaluateNode(p.initializer); });
                            }
                            return recordEntry({ func: func, name: functionName }, functionDeclaration);
                        }
                    }
                }
            }
        }
        function classMetadataOf(classDeclaration) {
            var result = { __symbolic: 'class' };
            function getDecorators(decorators) {
                if (decorators && decorators.length)
                    return decorators.map(function (decorator) { return objFromDecorator(decorator); });
                return undefined;
            }
            function referenceFrom(node) {
                var result = evaluator.evaluateNode(node);
                if (schema_1.isMetadataError(result) || schema_1.isMetadataSymbolicReferenceExpression(result) ||
                    schema_1.isMetadataSymbolicSelectExpression(result)) {
                    return result;
                }
                else {
                    return errorSym('Symbol reference expected', node);
                }
            }
            // Add class parents
            if (classDeclaration.heritageClauses) {
                classDeclaration.heritageClauses.forEach(function (hc) {
                    if (hc.token === ts.SyntaxKind.ExtendsKeyword && hc.types) {
                        hc.types.forEach(function (type) { return result.extends = referenceFrom(type.expression); });
                    }
                });
            }
            // Add arity if the type is generic
            var typeParameters = classDeclaration.typeParameters;
            if (typeParameters && typeParameters.length) {
                result.arity = typeParameters.length;
            }
            // Add class decorators
            if (classDeclaration.decorators) {
                result.decorators = getDecorators(classDeclaration.decorators);
            }
            // member decorators
            var members = null;
            function recordMember(name, metadata) {
                if (!members)
                    members = {};
                var data = members.hasOwnProperty(name) ? members[name] : [];
                data.push(metadata);
                members[name] = data;
            }
            // static member
            var statics = null;
            function recordStaticMember(name, value) {
                if (!statics)
                    statics = {};
                statics[name] = value;
            }
            for (var _i = 0, _a = classDeclaration.members; _i < _a.length; _i++) {
                var member = _a[_i];
                var isConstructor = false;
                switch (member.kind) {
                    case ts.SyntaxKind.Constructor:
                    case ts.SyntaxKind.MethodDeclaration:
                        isConstructor = member.kind === ts.SyntaxKind.Constructor;
                        var method = member;
                        if (isStatic(method)) {
                            var maybeFunc = maybeGetSimpleFunction(method);
                            if (maybeFunc) {
                                recordStaticMember(maybeFunc.name, maybeFunc.func);
                            }
                            continue;
                        }
                        var methodDecorators = getDecorators(method.decorators);
                        var parameters = method.parameters;
                        var parameterDecoratorData = [];
                        var parametersData = [];
                        var hasDecoratorData = false;
                        var hasParameterData = false;
                        for (var _b = 0, parameters_1 = parameters; _b < parameters_1.length; _b++) {
                            var parameter = parameters_1[_b];
                            var parameterData = getDecorators(parameter.decorators);
                            parameterDecoratorData.push(parameterData);
                            hasDecoratorData = hasDecoratorData || !!parameterData;
                            if (isConstructor) {
                                if (parameter.type) {
                                    parametersData.push(referenceFrom(parameter.type));
                                }
                                else {
                                    parametersData.push(null);
                                }
                                hasParameterData = true;
                            }
                        }
                        var data_1 = { __symbolic: isConstructor ? 'constructor' : 'method' };
                        var name_1 = isConstructor ? '__ctor__' : evaluator.nameOf(member.name);
                        if (methodDecorators) {
                            data_1.decorators = methodDecorators;
                        }
                        if (hasDecoratorData) {
                            data_1.parameterDecorators = parameterDecoratorData;
                        }
                        if (hasParameterData) {
                            data_1.parameters = parametersData;
                        }
                        if (!schema_1.isMetadataError(name_1)) {
                            recordMember(name_1, data_1);
                        }
                        break;
                    case ts.SyntaxKind.PropertyDeclaration:
                    case ts.SyntaxKind.GetAccessor:
                    case ts.SyntaxKind.SetAccessor:
                        var property = member;
                        if (isStatic(property)) {
                            var name_2 = evaluator.nameOf(property.name);
                            if (!schema_1.isMetadataError(name_2)) {
                                if (property.initializer) {
                                    var value = evaluator.evaluateNode(property.initializer);
                                    recordStaticMember(name_2, value);
                                }
                                else {
                                    recordStaticMember(name_2, errorSym('Variable not initialized', property.name));
                                }
                            }
                        }
                        var propertyDecorators = getDecorators(property.decorators);
                        if (propertyDecorators) {
                            var name_3 = evaluator.nameOf(property.name);
                            if (!schema_1.isMetadataError(name_3)) {
                                recordMember(name_3, { __symbolic: 'property', decorators: propertyDecorators });
                            }
                        }
                        break;
                }
            }
            if (members) {
                result.members = members;
            }
            if (statics) {
                result.statics = statics;
            }
            return recordEntry(result, classDeclaration);
        }
        // Collect all exported symbols from an exports clause.
        var exportMap = new Map();
        ts.forEachChild(sourceFile, function (node) {
            switch (node.kind) {
                case ts.SyntaxKind.ExportDeclaration:
                    var exportDeclaration = node;
                    var moduleSpecifier = exportDeclaration.moduleSpecifier, exportClause = exportDeclaration.exportClause;
                    if (!moduleSpecifier) {
                        // If there is a module specifier there is also an exportClause
                        exportClause.elements.forEach(function (spec) {
                            var exportedAs = spec.name.text;
                            var name = (spec.propertyName || spec.name).text;
                            exportMap.set(name, exportedAs);
                        });
                    }
            }
        });
        var isExport = function (node) {
            return sourceFile.isDeclarationFile || ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export;
        };
        var isExportedIdentifier = function (identifier) {
            return identifier && exportMap.has(identifier.text);
        };
        var isExported = function (node) {
            return isExport(node) || isExportedIdentifier(node.name);
        };
        var exportedIdentifierName = function (identifier) {
            return identifier && (exportMap.get(identifier.text) || identifier.text);
        };
        var exportedName = function (node) { return exportedIdentifierName(node.name); };
        // Pre-declare classes and functions
        ts.forEachChild(sourceFile, function (node) {
            switch (node.kind) {
                case ts.SyntaxKind.ClassDeclaration:
                    var classDeclaration = node;
                    if (classDeclaration.name) {
                        var className = classDeclaration.name.text;
                        if (isExported(classDeclaration)) {
                            locals.define(className, { __symbolic: 'reference', name: exportedName(classDeclaration) });
                        }
                        else {
                            locals.define(className, errorSym('Reference to non-exported class', node, { className: className }));
                        }
                    }
                    break;
                case ts.SyntaxKind.InterfaceDeclaration:
                    var interfaceDeclaration = node;
                    if (interfaceDeclaration.name) {
                        var interfaceName = interfaceDeclaration.name.text;
                        // All references to interfaces should be converted to references to `any`.
                        locals.define(interfaceName, { __symbolic: 'reference', name: 'any' });
                    }
                    break;
                case ts.SyntaxKind.FunctionDeclaration:
                    var functionDeclaration = node;
                    if (!isExported(functionDeclaration)) {
                        // Report references to this function as an error.
                        var nameNode = functionDeclaration.name;
                        if (nameNode && nameNode.text) {
                            locals.define(nameNode.text, errorSym('Reference to a non-exported function', nameNode, { name: nameNode.text }));
                        }
                    }
                    break;
            }
        });
        ts.forEachChild(sourceFile, function (node) {
            switch (node.kind) {
                case ts.SyntaxKind.ExportDeclaration:
                    // Record export declarations
                    var exportDeclaration = node;
                    var moduleSpecifier = exportDeclaration.moduleSpecifier, exportClause = exportDeclaration.exportClause;
                    if (!moduleSpecifier) {
                        // no module specifier -> export {propName as name};
                        if (exportClause) {
                            exportClause.elements.forEach(function (spec) {
                                var name = spec.name.text;
                                // If the symbol was not already exported, export a reference since it is a
                                // reference to an import
                                if (!metadata || !metadata[name]) {
                                    var propNode = spec.propertyName || spec.name;
                                    var value = evaluator.evaluateNode(propNode);
                                    if (!metadata)
                                        metadata = {};
                                    metadata[name] = recordEntry(value, node);
                                }
                            });
                        }
                    }
                    if (moduleSpecifier && moduleSpecifier.kind == ts.SyntaxKind.StringLiteral) {
                        // Ignore exports that don't have string literals as exports.
                        // This is allowed by the syntax but will be flagged as an error by the type checker.
                        var from = moduleSpecifier.text;
                        var moduleExport = { from: from };
                        if (exportClause) {
                            moduleExport.export = exportClause.elements.map(function (spec) { return spec.propertyName ? { name: spec.propertyName.text, as: spec.name.text } :
                                spec.name.text; });
                        }
                        if (!exports)
                            exports = [];
                        exports.push(moduleExport);
                    }
                    break;
                case ts.SyntaxKind.ClassDeclaration:
                    var classDeclaration = node;
                    if (classDeclaration.name) {
                        if (isExported(classDeclaration)) {
                            var name_4 = exportedName(classDeclaration);
                            if (name_4) {
                                if (!metadata)
                                    metadata = {};
                                metadata[name_4] = classMetadataOf(classDeclaration);
                            }
                        }
                    }
                    // Otherwise don't record metadata for the class.
                    break;
                case ts.SyntaxKind.TypeAliasDeclaration:
                    var typeDeclaration = node;
                    if (typeDeclaration.name && isExported(typeDeclaration)) {
                        var name_5 = exportedName(typeDeclaration);
                        if (name_5) {
                            if (!metadata)
                                metadata = {};
                            metadata[name_5] = { __symbolic: 'interface' };
                        }
                    }
                    break;
                case ts.SyntaxKind.InterfaceDeclaration:
                    var interfaceDeclaration = node;
                    if (interfaceDeclaration.name && isExported(interfaceDeclaration)) {
                        var name_6 = exportedName(interfaceDeclaration);
                        if (name_6) {
                            if (!metadata)
                                metadata = {};
                            metadata[name_6] = { __symbolic: 'interface' };
                        }
                    }
                    break;
                case ts.SyntaxKind.FunctionDeclaration:
                    // Record functions that return a single value. Record the parameter
                    // names substitution will be performed by the StaticReflector.
                    var functionDeclaration = node;
                    if (isExported(functionDeclaration) && functionDeclaration.name) {
                        var name_7 = exportedName(functionDeclaration);
                        var maybeFunc = maybeGetSimpleFunction(functionDeclaration);
                        if (name_7) {
                            if (!metadata)
                                metadata = {};
                            metadata[name_7] =
                                maybeFunc ? recordEntry(maybeFunc.func, node) : { __symbolic: 'function' };
                        }
                    }
                    break;
                case ts.SyntaxKind.EnumDeclaration:
                    var enumDeclaration = node;
                    if (isExported(enumDeclaration)) {
                        var enumValueHolder = {};
                        var enumName = exportedName(enumDeclaration);
                        var nextDefaultValue = 0;
                        var writtenMembers = 0;
                        for (var _i = 0, _a = enumDeclaration.members; _i < _a.length; _i++) {
                            var member = _a[_i];
                            var enumValue = void 0;
                            if (!member.initializer) {
                                enumValue = nextDefaultValue;
                            }
                            else {
                                enumValue = evaluator.evaluateNode(member.initializer);
                            }
                            var name_8 = undefined;
                            if (member.name.kind == ts.SyntaxKind.Identifier) {
                                var identifier = member.name;
                                name_8 = identifier.text;
                                enumValueHolder[name_8] = enumValue;
                                writtenMembers++;
                            }
                            if (typeof enumValue === 'number') {
                                nextDefaultValue = enumValue + 1;
                            }
                            else if (name_8) {
                                nextDefaultValue = {
                                    __symbolic: 'binary',
                                    operator: '+',
                                    left: {
                                        __symbolic: 'select',
                                        expression: recordEntry({ __symbolic: 'reference', name: enumName }, node), name: name_8
                                    }
                                };
                            }
                            else {
                                nextDefaultValue =
                                    recordEntry(errorSym('Unsupported enum member name', member.name), node);
                            }
                        }
                        if (writtenMembers) {
                            if (enumName) {
                                if (!metadata)
                                    metadata = {};
                                metadata[enumName] = recordEntry(enumValueHolder, node);
                            }
                        }
                    }
                    break;
                case ts.SyntaxKind.VariableStatement:
                    var variableStatement = node;
                    var _loop_1 = function (variableDeclaration) {
                        if (variableDeclaration.name.kind == ts.SyntaxKind.Identifier) {
                            var nameNode = variableDeclaration.name;
                            var varValue = void 0;
                            if (variableDeclaration.initializer) {
                                varValue = evaluator.evaluateNode(variableDeclaration.initializer);
                            }
                            else {
                                varValue = recordEntry(errorSym('Variable not initialized', nameNode), nameNode);
                            }
                            var exported = false;
                            if (isExport(variableStatement) || isExport(variableDeclaration) ||
                                isExportedIdentifier(nameNode)) {
                                var name_9 = exportedIdentifierName(nameNode);
                                if (name_9) {
                                    if (!metadata)
                                        metadata = {};
                                    metadata[name_9] = recordEntry(varValue, node);
                                }
                                exported = true;
                            }
                            if (typeof varValue == 'string' || typeof varValue == 'number' ||
                                typeof varValue == 'boolean') {
                                locals.define(nameNode.text, varValue);
                                if (exported) {
                                    locals.defineReference(nameNode.text, { __symbolic: 'reference', name: nameNode.text });
                                }
                            }
                            else if (!exported) {
                                if (varValue && !schema_1.isMetadataError(varValue)) {
                                    locals.define(nameNode.text, recordEntry(varValue, node));
                                }
                                else {
                                    locals.define(nameNode.text, recordEntry(errorSym('Reference to a local symbol', nameNode, { name: nameNode.text }), node));
                                }
                            }
                        }
                        else {
                            // Destructuring (or binding) declarations are not supported,
                            // var {<identifier>[, <identifier>]+} = <expression>;
                            //   or
                            // var [<identifier>[, <identifier}+] = <expression>;
                            // are not supported.
                            var report_1 = function (nameNode) {
                                switch (nameNode.kind) {
                                    case ts.SyntaxKind.Identifier:
                                        var name_10 = nameNode;
                                        var varValue = errorSym('Destructuring not supported', name_10);
                                        locals.define(name_10.text, varValue);
                                        if (isExport(node)) {
                                            if (!metadata)
                                                metadata = {};
                                            metadata[name_10.text] = varValue;
                                        }
                                        break;
                                    case ts.SyntaxKind.BindingElement:
                                        var bindingElement = nameNode;
                                        report_1(bindingElement.name);
                                        break;
                                    case ts.SyntaxKind.ObjectBindingPattern:
                                    case ts.SyntaxKind.ArrayBindingPattern:
                                        var bindings = nameNode;
                                        bindings.elements.forEach(report_1);
                                        break;
                                }
                            };
                            report_1(variableDeclaration.name);
                        }
                    };
                    for (var _b = 0, _c = variableStatement.declarationList.declarations; _b < _c.length; _b++) {
                        var variableDeclaration = _c[_b];
                        _loop_1(variableDeclaration);
                    }
                    break;
            }
        });
        if (metadata || exports) {
            if (!metadata)
                metadata = {};
            else if (strict) {
                validateMetadata(sourceFile, nodeMap, metadata);
            }
            var result = {
                __symbolic: 'module',
                version: this.options.version || schema_1.METADATA_VERSION, metadata: metadata
            };
            if (sourceFile.moduleName)
                result.importAs = sourceFile.moduleName;
            if (exports)
                result.exports = exports;
            return result;
        }
    };
    return MetadataCollector;
}());
exports.MetadataCollector = MetadataCollector;
// This will throw if the metadata entry given contains an error node.
function validateMetadata(sourceFile, nodeMap, metadata) {
    var locals = new Set(['Array', 'Object', 'Set', 'Map', 'string', 'number', 'any']);
    function validateExpression(expression) {
        if (!expression) {
            return;
        }
        else if (Array.isArray(expression)) {
            expression.forEach(validateExpression);
        }
        else if (typeof expression === 'object' && !expression.hasOwnProperty('__symbolic')) {
            Object.getOwnPropertyNames(expression).forEach(function (v) { return validateExpression(expression[v]); });
        }
        else if (schema_1.isMetadataError(expression)) {
            reportError(expression);
        }
        else if (schema_1.isMetadataGlobalReferenceExpression(expression)) {
            if (!locals.has(expression.name)) {
                var reference = metadata[expression.name];
                if (reference) {
                    validateExpression(reference);
                }
            }
        }
        else if (schema_1.isFunctionMetadata(expression)) {
            validateFunction(expression);
        }
        else if (schema_1.isMetadataSymbolicExpression(expression)) {
            switch (expression.__symbolic) {
                case 'binary':
                    var binaryExpression = expression;
                    validateExpression(binaryExpression.left);
                    validateExpression(binaryExpression.right);
                    break;
                case 'call':
                case 'new':
                    var callExpression = expression;
                    validateExpression(callExpression.expression);
                    if (callExpression.arguments)
                        callExpression.arguments.forEach(validateExpression);
                    break;
                case 'index':
                    var indexExpression = expression;
                    validateExpression(indexExpression.expression);
                    validateExpression(indexExpression.index);
                    break;
                case 'pre':
                    var prefixExpression = expression;
                    validateExpression(prefixExpression.operand);
                    break;
                case 'select':
                    var selectExpression = expression;
                    validateExpression(selectExpression.expression);
                    break;
                case 'spread':
                    var spreadExpression = expression;
                    validateExpression(spreadExpression.expression);
                    break;
                case 'if':
                    var ifExpression = expression;
                    validateExpression(ifExpression.condition);
                    validateExpression(ifExpression.elseExpression);
                    validateExpression(ifExpression.thenExpression);
                    break;
            }
        }
    }
    function validateMember(classData, member) {
        if (member.decorators) {
            member.decorators.forEach(validateExpression);
        }
        if (schema_1.isMethodMetadata(member) && member.parameterDecorators) {
            member.parameterDecorators.forEach(validateExpression);
        }
        // Only validate parameters of classes for which we know that are used with our DI
        if (classData.decorators && schema_1.isConstructorMetadata(member) && member.parameters) {
            member.parameters.forEach(validateExpression);
        }
    }
    function validateClass(classData) {
        if (classData.decorators) {
            classData.decorators.forEach(validateExpression);
        }
        if (classData.members) {
            Object.getOwnPropertyNames(classData.members)
                .forEach(function (name) { return classData.members[name].forEach(function (m) { return validateMember(classData, m); }); });
        }
        if (classData.statics) {
            Object.getOwnPropertyNames(classData.statics).forEach(function (name) {
                var staticMember = classData.statics[name];
                if (schema_1.isFunctionMetadata(staticMember)) {
                    validateExpression(staticMember.value);
                }
                else {
                    validateExpression(staticMember);
                }
            });
        }
    }
    function validateFunction(functionDeclaration) {
        if (functionDeclaration.value) {
            var oldLocals = locals;
            if (functionDeclaration.parameters) {
                locals = new Set(oldLocals.values());
                if (functionDeclaration.parameters)
                    functionDeclaration.parameters.forEach(function (n) { return locals.add(n); });
            }
            validateExpression(functionDeclaration.value);
            locals = oldLocals;
        }
    }
    function shouldReportNode(node) {
        if (node) {
            var nodeStart = node.getStart();
            return !(node.pos != nodeStart &&
                sourceFile.text.substring(node.pos, nodeStart).indexOf('@dynamic') >= 0);
        }
        return true;
    }
    function reportError(error) {
        var node = nodeMap.get(error);
        if (shouldReportNode(node)) {
            var lineInfo = error.line != undefined ?
                error.character != undefined ? ":" + (error.line + 1) + ":" + (error.character + 1) :
                    ":" + (error.line + 1) :
                '';
            throw new Error("" + sourceFile.fileName + lineInfo + ": Metadata collected contains an error that will be reported at runtime: " + expandedMessage(error) + ".\n  " + JSON.stringify(error));
        }
    }
    Object.getOwnPropertyNames(metadata).forEach(function (name) {
        var entry = metadata[name];
        try {
            if (schema_1.isClassMetadata(entry)) {
                validateClass(entry);
            }
        }
        catch (e) {
            var node = nodeMap.get(entry);
            if (shouldReportNode(node)) {
                if (node) {
                    var _a = sourceFile.getLineAndCharacterOfPosition(node.getStart()), line = _a.line, character = _a.character;
                    throw new Error(sourceFile.fileName + ":" + (line + 1) + ":" + (character + 1) + ": Error encountered in metadata generated for exported symbol '" + name + "': \n " + e.message);
                }
                throw new Error("Error encountered in metadata generated for exported symbol " + name + ": \n " + e.message);
            }
        }
    });
}
// Collect parameter names from a function.
function namesOf(parameters) {
    var result = [];
    function addNamesOf(name) {
        if (name.kind == ts.SyntaxKind.Identifier) {
            var identifier = name;
            result.push(identifier.text);
        }
        else {
            var bindingPattern = name;
            for (var _i = 0, _a = bindingPattern.elements; _i < _a.length; _i++) {
                var element = _a[_i];
                var name_11 = element.name;
                if (name_11) {
                    addNamesOf(name_11);
                }
            }
        }
    }
    for (var _i = 0, parameters_2 = parameters; _i < parameters_2.length; _i++) {
        var parameter = parameters_2[_i];
        addNamesOf(parameter.name);
    }
    return result;
}
function expandedMessage(error) {
    switch (error.message) {
        case 'Reference to non-exported class':
            if (error.context && error.context.className) {
                return "Reference to a non-exported class " + error.context.className + ". Consider exporting the class";
            }
            break;
        case 'Variable not initialized':
            return 'Only initialized variables and constants can be referenced because the value of this variable is needed by the template compiler';
        case 'Destructuring not supported':
            return 'Referencing an exported destructured variable or constant is not supported by the template compiler. Consider simplifying this to avoid destructuring';
        case 'Could not resolve type':
            if (error.context && error.context.typeName) {
                return "Could not resolve type " + error.context.typeName;
            }
            break;
        case 'Function call not supported':
            var prefix = error.context && error.context.name ? "Calling function '" + error.context.name + "', f" : 'F';
            return prefix +
                'unction calls are not supported. Consider replacing the function or lambda with a reference to an exported function';
        case 'Reference to a local symbol':
            if (error.context && error.context.name) {
                return "Reference to a local (non-exported) symbol '" + error.context.name + "'. Consider exporting the symbol";
            }
    }
    return error.message;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sbGVjdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3NyYy9tZXRhZGF0YS9jb2xsZWN0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7OztBQUVILCtCQUFpQztBQUVqQyx5Q0FBbUU7QUFDbkUsbUNBQXUxQjtBQUN2MUIscUNBQWtDO0FBRWxDLElBQU0sUUFBUSxHQUFHLFVBQUMsSUFBYSxJQUFLLE9BQUEsRUFBRSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUEzRCxDQUEyRCxDQUFDO0FBNEJoRzs7R0FFRztBQUNIO0lBQ0UsMkJBQW9CLE9BQThCO1FBQTlCLHdCQUFBLEVBQUEsWUFBOEI7UUFBOUIsWUFBTyxHQUFQLE9BQU8sQ0FBdUI7SUFBRyxDQUFDO0lBRXREOzs7T0FHRztJQUNJLHVDQUFXLEdBQWxCLFVBQ0ksVUFBeUIsRUFBRSxNQUF1QixFQUNsRCxvQkFBNkU7UUFGakYsaUJBMmZDO1FBMWY4Qix1QkFBQSxFQUFBLGNBQXVCO1FBR3BELElBQU0sTUFBTSxHQUFHLElBQUksaUJBQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN2QyxJQUFNLE9BQU8sR0FDVCxJQUFJLEdBQUcsRUFBMkUsQ0FBQztRQUN2RixJQUFNLG1CQUFtQixHQUFHLG9CQUFvQixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQztZQUNuRixVQUFDLEtBQW9CLEVBQUUsSUFBYTtnQkFDaEMsT0FBQSxLQUFJLENBQUMsT0FBTyxDQUFDLG9CQUFzQixDQUFDLG9CQUFvQixDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUM7WUFBNUUsQ0FBNEUsQ0FBQyxDQUFDO1lBQ2xGLG9CQUFvQixDQUFDO1FBQ3pCLElBQU0sZ0JBQWdCLEdBQUcsb0JB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