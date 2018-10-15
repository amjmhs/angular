"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var ts = require("typescript");
var symbols_1 = require("./symbols");
var typescript_version_1 = require("./typescript_version");
// In TypeScript 2.1 these flags moved
// These helpers work for both 2.0 and 2.1.
var isPrivate = ts.ModifierFlags ?
    (function (node) {
        return !!(ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Private);
    }) :
    (function (node) { return !!(node.flags & ts.NodeFlags.Private); });
var isReferenceType = ts.ObjectFlags ?
    (function (type) {
        return !!(type.flags & ts.TypeFlags.Object &&
            type.objectFlags & ts.ObjectFlags.Reference);
    }) :
    (function (type) { return !!(type.flags & ts.TypeFlags.Reference); });
function getSymbolQuery(program, checker, source, fetchPipes) {
    return new TypeScriptSymbolQuery(program, checker, source, fetchPipes);
}
exports.getSymbolQuery = getSymbolQuery;
function getClassMembers(program, checker, staticSymbol) {
    var declaration = getClassFromStaticSymbol(program, staticSymbol);
    if (declaration) {
        var type = checker.getTypeAtLocation(declaration);
        var node = program.getSourceFile(staticSymbol.filePath);
        if (node) {
            return new TypeWrapper(type, { node: node, program: program, checker: checker }).members();
        }
    }
}
exports.getClassMembers = getClassMembers;
function getClassMembersFromDeclaration(program, checker, source, declaration) {
    var type = checker.getTypeAtLocation(declaration);
    return new TypeWrapper(type, { node: source, program: program, checker: checker }).members();
}
exports.getClassMembersFromDeclaration = getClassMembersFromDeclaration;
function getClassFromStaticSymbol(program, type) {
    var source = program.getSourceFile(type.filePath);
    if (source) {
        return ts.forEachChild(source, function (child) {
            if (child.kind === ts.SyntaxKind.ClassDeclaration) {
                var classDeclaration = child;
                if (classDeclaration.name != null && classDeclaration.name.text === type.name) {
                    return classDeclaration;
                }
            }
        });
    }
    return undefined;
}
exports.getClassFromStaticSymbol = getClassFromStaticSymbol;
function getPipesTable(source, program, checker, pipes) {
    return new PipesTable(pipes, { program: program, checker: checker, node: source });
}
exports.getPipesTable = getPipesTable;
var TypeScriptSymbolQuery = /** @class */ (function () {
    function TypeScriptSymbolQuery(program, checker, source, fetchPipes) {
        this.program = program;
        this.checker = checker;
        this.source = source;
        this.fetchPipes = fetchPipes;
        this.typeCache = new Map();
    }
    TypeScriptSymbolQuery.prototype.getTypeKind = function (symbol) { return typeKindOf(this.getTsTypeOf(symbol)); };
    TypeScriptSymbolQuery.prototype.getBuiltinType = function (kind) {
        var result = this.typeCache.get(kind);
        if (!result) {
            var type = getBuiltinTypeFromTs(kind, { checker: this.checker, node: this.source, program: this.program });
            result =
                new TypeWrapper(type, { program: this.program, checker: this.checker, node: this.source });
            this.typeCache.set(kind, result);
        }
        return result;
    };
    TypeScriptSymbolQuery.prototype.getTypeUnion = function () {
        var types = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            types[_i] = arguments[_i];
        }
        // No API exists so return any if the types are not all the same type.
        var result = undefined;
        if (types.length) {
            result = types[0];
            for (var i = 1; i < types.length; i++) {
                if (types[i] != result) {
                    result = undefined;
                    break;
                }
            }
        }
        return result || this.getBuiltinType(symbols_1.BuiltinType.Any);
    };
    TypeScriptSymbolQuery.prototype.getArrayType = function (type) { return this.getBuiltinType(symbols_1.BuiltinType.Any); };
    TypeScriptSymbolQuery.prototype.getElementType = function (type) {
        if (type instanceof TypeWrapper) {
            var elementType = getTypeParameterOf(type.tsType, 'Array');
            if (elementType) {
                return new TypeWrapper(elementType, type.context);
            }
        }
    };
    TypeScriptSymbolQuery.prototype.getNonNullableType = function (symbol) {
        if (symbol instanceof TypeWrapper && (typeof this.checker.getNonNullableType == 'function')) {
            var tsType = symbol.tsType;
            var nonNullableType = this.checker.getNonNullableType(tsType);
            if (nonNullableType != tsType) {
                return new TypeWrapper(nonNullableType, symbol.context);
            }
            else if (nonNullableType == tsType) {
                return symbol;
            }
        }
        return this.getBuiltinType(symbols_1.BuiltinType.Any);
    };
    TypeScriptSymbolQuery.prototype.getPipes = function () {
        var result = this.pipesCache;
        if (!result) {
            result = this.pipesCache = this.fetchPipes();
        }
        return result;
    };
    TypeScriptSymbolQuery.prototype.getTemplateContext = function (type) {
        var context = { node: this.source, program: this.program, checker: this.checker };
        var typeSymbol = findClassSymbolInContext(type, context);
        if (typeSymbol) {
            var contextType = this.getTemplateRefContextType(typeSymbol);
            if (contextType)
                return new SymbolWrapper(contextType, context).members();
        }
    };
    TypeScriptSymbolQuery.prototype.getTypeSymbol = function (type) {
        var context = { node: this.source, program: this.program, checker: this.checker };
        var typeSymbol = findClassSymbolInContext(type, context);
        return typeSymbol && new SymbolWrapper(typeSymbol, context);
    };
    TypeScriptSymbolQuery.prototype.createSymbolTable = function (symbols) {
        var result = new MapSymbolTable();
        result.addAll(symbols.map(function (s) { return new DeclaredSymbol(s); }));
        return result;
    };
    TypeScriptSymbolQuery.prototype.mergeSymbolTable = function (symbolTables) {
        var result = new MapSymbolTable();
        for (var _i = 0, symbolTables_1 = symbolTables; _i < symbolTables_1.length; _i++) {
            var symbolTable = symbolTables_1[_i];
            result.addAll(symbolTable.values());
        }
        return result;
    };
    TypeScriptSymbolQuery.prototype.getSpanAt = function (line, column) {
        return spanAt(this.source, line, column);
    };
    TypeScriptSymbolQuery.prototype.getTemplateRefContextType = function (typeSymbol) {
        var type = this.checker.getTypeOfSymbolAtLocation(typeSymbol, this.source);
        var constructor = type.symbol && type.symbol.members &&
            getFromSymbolTable(type.symbol.members, '__constructor');
        if (constructor) {
            var constructorDeclaration = constructor.declarations[0];
            for (var _i = 0, _a = constructorDeclaration.parameters; _i < _a.length; _i++) {
                var parameter = _a[_i];
                var type_1 = this.checker.getTypeAtLocation(parameter.type);
                if (type_1.symbol.name == 'TemplateRef' && isReferenceType(type_1)) {
                    var typeReference = type_1;
                    if (typeReference.typeArguments && typeReference.typeArguments.length === 1) {
                        return typeReference.typeArguments[0].symbol;
                    }
                }
            }
        }
    };
    TypeScriptSymbolQuery.prototype.getTsTypeOf = function (symbol) {
        var type = this.getTypeWrapper(symbol);
        return type && type.tsType;
    };
    TypeScriptSymbolQuery.prototype.getTypeWrapper = function (symbol) {
        var type = undefined;
        if (symbol instanceof TypeWrapper) {
            type = symbol;
        }
        else if (symbol.type instanceof TypeWrapper) {
            type = symbol.type;
        }
        return type;
    };
    return TypeScriptSymbolQuery;
}());
function typeCallable(type) {
    var signatures = type.getCallSignatures();
    return signatures && signatures.length != 0;
}
function signaturesOf(type, context) {
    return type.getCallSignatures().map(function (s) { return new SignatureWrapper(s, context); });
}
function selectSignature(type, context, types) {
    // TODO: Do a better job of selecting the right signature.
    var signatures = type.getCallSignatures();
    return signatures.length ? new SignatureWrapper(signatures[0], context) : undefined;
}
var TypeWrapper = /** @class */ (function () {
    function TypeWrapper(tsType, context) {
        this.tsType = tsType;
        this.context = context;
        this.kind = 'type';
        this.language = 'typescript';
        this.type = undefined;
        this.container = undefined;
        this.public = true;
        if (!tsType) {
            throw Error('Internal: null type');
        }
    }
    Object.defineProperty(TypeWrapper.prototype, "name", {
        get: function () {
            var symbol = this.tsType.symbol;
            return (symbol && symbol.name) || '<anonymous>';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TypeWrapper.prototype, "callable", {
        get: function () { return typeCallable(this.tsType); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TypeWrapper.prototype, "nullable", {
        get: function () {
            return this.context.checker.getNonNullableType(this.tsType) != this.tsType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TypeWrapper.prototype, "definition", {
        get: function () {
            var symbol = this.tsType.getSymbol();
            return symbol ? definitionFromTsSymbol(symbol) : undefined;
        },
        enumerable: true,
        configurable: true
    });
    TypeWrapper.prototype.members = function () {
        return new SymbolTableWrapper(this.tsType.getProperties(), this.context);
    };
    TypeWrapper.prototype.signatures = function () { return signaturesOf(this.tsType, this.context); };
    TypeWrapper.prototype.selectSignature = function (types) {
        return selectSignature(this.tsType, this.context, types);
    };
    TypeWrapper.prototype.indexed = function (argument) { return undefined; };
    return TypeWrapper;
}());
var SymbolWrapper = /** @class */ (function () {
    function SymbolWrapper(symbol, context) {
        this.context = context;
        this.nullable = false;
        this.language = 'typescript';
        this.symbol = symbol && context && (symbol.flags & ts.SymbolFlags.Alias) ?
            context.checker.getAliasedSymbol(symbol) :
            symbol;
    }
    Object.defineProperty(SymbolWrapper.prototype, "name", {
        get: function () { return this.symbol.name; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SymbolWrapper.prototype, "kind", {
        get: function () { return this.callable ? 'method' : 'property'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SymbolWrapper.prototype, "type", {
        get: function () { return new TypeWrapper(this.tsType, this.context); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SymbolWrapper.prototype, "container", {
        get: function () { return getContainerOf(this.symbol, this.context); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SymbolWrapper.prototype, "public", {
        get: function () {
            // Symbols that are not explicitly made private are public.
            return !isSymbolPrivate(this.symbol);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SymbolWrapper.prototype, "callable", {
        get: function () { return typeCallable(this.tsType); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SymbolWrapper.prototype, "definition", {
        get: function () { return definitionFromTsSymbol(this.symbol); },
        enumerable: true,
        configurable: true
    });
    SymbolWrapper.prototype.members = function () {
        if (!this._members) {
            if ((this.symbol.flags & (ts.SymbolFlags.Class | ts.SymbolFlags.Interface)) != 0) {
                var declaredType = this.context.checker.getDeclaredTypeOfSymbol(this.symbol);
                var typeWrapper = new TypeWrapper(declaredType, this.context);
                this._members = typeWrapper.members();
            }
            else {
                this._members = new SymbolTableWrapper(this.symbol.members, this.context);
            }
        }
        return this._members;
    };
    SymbolWrapper.prototype.signatures = function () { return signaturesOf(this.tsType, this.context); };
    SymbolWrapper.prototype.selectSignature = function (types) {
        return selectSignature(this.tsType, this.context, types);
    };
    SymbolWrapper.prototype.indexed = function (argument) { return undefined; };
    Object.defineProperty(SymbolWrapper.prototype, "tsType", {
        get: function () {
            var type = this._tsType;
            if (!type) {
                type = this._tsType =
                    this.context.checker.getTypeOfSymbolAtLocation(this.symbol, this.context.node);
            }
            return type;
        },
        enumerable: true,
        configurable: true
    });
    return SymbolWrapper;
}());
var DeclaredSymbol = /** @class */ (function () {
    function DeclaredSymbol(declaration) {
        this.declaration = declaration;
        this.language = 'ng-template';
        this.nullable = false;
        this.public = true;
    }
    Object.defineProperty(DeclaredSymbol.prototype, "name", {
        get: function () { return this.declaration.name; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeclaredSymbol.prototype, "kind", {
        get: function () { return this.declaration.kind; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeclaredSymbol.prototype, "container", {
        get: function () { return undefined; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeclaredSymbol.prototype, "type", {
        get: function () { return this.declaration.type; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeclaredSymbol.prototype, "callable", {
        get: function () { return this.declaration.type.callable; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeclaredSymbol.prototype, "definition", {
        get: function () { return this.declaration.definition; },
        enumerable: true,
        configurable: true
    });
    DeclaredSymbol.prototype.members = function () { return this.declaration.type.members(); };
    DeclaredSymbol.prototype.signatures = function () { return this.declaration.type.signatures(); };
    DeclaredSymbol.prototype.selectSignature = function (types) {
        return this.declaration.type.selectSignature(types);
    };
    DeclaredSymbol.prototype.indexed = function (argument) { return undefined; };
    return DeclaredSymbol;
}());
var SignatureWrapper = /** @class */ (function () {
    function SignatureWrapper(signature, context) {
        this.signature = signature;
        this.context = context;
    }
    Object.defineProperty(SignatureWrapper.prototype, "arguments", {
        get: function () {
            return new SymbolTableWrapper(this.signature.getParameters(), this.context);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SignatureWrapper.prototype, "result", {
        get: function () { return new TypeWrapper(this.signature.getReturnType(), this.context); },
        enumerable: true,
        configurable: true
    });
    return SignatureWrapper;
}());
var SignatureResultOverride = /** @class */ (function () {
    function SignatureResultOverride(signature, resultType) {
        this.signature = signature;
        this.resultType = resultType;
    }
    Object.defineProperty(SignatureResultOverride.prototype, "arguments", {
        get: function () { return this.signature.arguments; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SignatureResultOverride.prototype, "result", {
        get: function () { return this.resultType; },
        enumerable: true,
        configurable: true
    });
    return SignatureResultOverride;
}());
/**
 * Indicates the lower bound TypeScript version supporting `SymbolTable` as an ES6 `Map`.
 * For lower versions, `SymbolTable` is implemented as a dictionary
 */
var MIN_TS_VERSION_SUPPORTING_MAP = '2.2';
exports.toSymbolTableFactory = function (tsVersion) { return function (symbols) {
    if (typescript_version_1.isVersionBetween(tsVersion, MIN_TS_VERSION_SUPPORTING_MAP)) {
        // ∀ Typescript version >= 2.2, `SymbolTable` is implemented as an ES6 `Map`
        var result_1 = new Map();
        for (var _i = 0, symbols_2 = symbols; _i < symbols_2.length; _i++) {
            var symbol = symbols_2[_i];
            result_1.set(symbol.name, symbol);
        }
        // First, tell the compiler that `result` is of type `any`. Then, use a second type assertion
        // to `ts.SymbolTable`.
        // Otherwise, `Map<string, ts.Symbol>` and `ts.SymbolTable` will be considered as incompatible
        // types by the compiler
        return result_1;
    }
    // ∀ Typescript version < 2.2, `SymbolTable` is implemented as a dictionary
    var result = {};
    for (var _a = 0, symbols_3 = symbols; _a < symbols_3.length; _a++) {
        var symbol = symbols_3[_a];
        result[symbol.name] = symbol;
    }
    return result;
}; };
function toSymbols(symbolTable) {
    if (!symbolTable)
        return [];
    var table = symbolTable;
    if (typeof table.values === 'function') {
        return Array.from(table.values());
    }
    var result = [];
    var own = typeof table.hasOwnProperty === 'function' ?
        function (name) { return table.hasOwnProperty(name); } :
        function (name) { return !!table[name]; };
    for (var name_1 in table) {
        if (own(name_1)) {
            result.push(table[name_1]);
        }
    }
    return result;
}
var SymbolTableWrapper = /** @class */ (function () {
    function SymbolTableWrapper(symbols, context) {
        this.context = context;
        symbols = symbols || [];
        if (Array.isArray(symbols)) {
            this.symbols = symbols;
            var toSymbolTable = exports.toSymbolTableFactory(ts.version);
            this.symbolTable = toSymbolTable(symbols);
        }
        else {
            this.symbols = toSymbols(symbols);
            this.symbolTable = symbols;
        }
    }
    Object.defineProperty(SymbolTableWrapper.prototype, "size", {
        get: function () { return this.symbols.length; },
        enumerable: true,
        configurable: true
    });
    SymbolTableWrapper.prototype.get = function (key) {
        var symbol = getFromSymbolTable(this.symbolTable, key);
        return symbol ? new SymbolWrapper(symbol, this.context) : undefined;
    };
    SymbolTableWrapper.prototype.has = function (key) {
        var table = this.symbolTable;
        return (typeof table.has === 'function') ? table.has(key) : table[key] != null;
    };
    SymbolTableWrapper.prototype.values = function () {
        var _this = this;
        return this.symbols.map(function (s) { return new SymbolWrapper(s, _this.context); });
    };
    return SymbolTableWrapper;
}());
var MapSymbolTable = /** @class */ (function () {
    function MapSymbolTable() {
        this.map = new Map();
        this._values = [];
    }
    Object.defineProperty(MapSymbolTable.prototype, "size", {
        get: function () { return this.map.size; },
        enumerable: true,
        configurable: true
    });
    MapSymbolTable.prototype.get = function (key) { return this.map.get(key); };
    MapSymbolTable.prototype.add = function (symbol) {
        if (this.map.has(symbol.name)) {
            var previous = this.map.get(symbol.name);
            this._values[this._values.indexOf(previous)] = symbol;
        }
        this.map.set(symbol.name, symbol);
        this._values.push(symbol);
    };
    MapSymbolTable.prototype.addAll = function (symbols) {
        for (var _i = 0, symbols_4 = symbols; _i < symbols_4.length; _i++) {
            var symbol = symbols_4[_i];
            this.add(symbol);
        }
    };
    MapSymbolTable.prototype.has = function (key) { return this.map.has(key); };
    MapSymbolTable.prototype.values = function () {
        // Switch to this.map.values once iterables are supported by the target language.
        return this._values;
    };
    return MapSymbolTable;
}());
var PipesTable = /** @class */ (function () {
    function PipesTable(pipes, context) {
        this.pipes = pipes;
        this.context = context;
    }
    Object.defineProperty(PipesTable.prototype, "size", {
        get: function () { return this.pipes.length; },
        enumerable: true,
        configurable: true
    });
    PipesTable.prototype.get = function (key) {
        var pipe = this.pipes.find(function (pipe) { return pipe.name == key; });
        if (pipe) {
            return new PipeSymbol(pipe, this.context);
        }
    };
    PipesTable.prototype.has = function (key) { return this.pipes.find(function (pipe) { return pipe.name == key; }) != null; };
    PipesTable.prototype.values = function () {
        var _this = this;
        return this.pipes.map(function (pipe) { return new PipeSymbol(pipe, _this.context); });
    };
    return PipesTable;
}());
// This matches .d.ts files that look like ".../<package-name>/<package-name>.d.ts",
var INDEX_PATTERN = /[\\/]([^\\/]+)[\\/]\1\.d\.ts$/;
var PipeSymbol = /** @class */ (function () {
    function PipeSymbol(pipe, context) {
        this.pipe = pipe;
        this.context = context;
        this.kind = 'pipe';
        this.language = 'typescript';
        this.container = undefined;
        this.callable = true;
        this.nullable = false;
        this.public = true;
    }
    Object.defineProperty(PipeSymbol.prototype, "name", {
        get: function () { return this.pipe.name; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PipeSymbol.prototype, "type", {
        get: function () { return new TypeWrapper(this.tsType, this.context); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PipeSymbol.prototype, "definition", {
        get: function () {
            var symbol = this.tsType.getSymbol();
            return symbol ? definitionFromTsSymbol(symbol) : undefined;
        },
        enumerable: true,
        configurable: true
    });
    PipeSymbol.prototype.members = function () { return EmptyTable.instance; };
    PipeSymbol.prototype.signatures = function () { return signaturesOf(this.tsType, this.context); };
    PipeSymbol.prototype.selectSignature = function (types) {
        var signature = selectSignature(this.tsType, this.context, types);
        if (types.length == 1) {
            var parameterType = types[0];
            if (parameterType instanceof TypeWrapper) {
                var resultType = undefined;
                switch (this.name) {
                    case 'async':
                        switch (parameterType.name) {
                            case 'Observable':
                            case 'Promise':
                            case 'EventEmitter':
                                resultType = getTypeParameterOf(parameterType.tsType, parameterType.name);
                                break;
                            default:
                                resultType = getBuiltinTypeFromTs(symbols_1.BuiltinType.Any, this.context);
                                break;
                        }
                        break;
                    case 'slice':
                        resultType = getTypeParameterOf(parameterType.tsType, 'Array');
                        break;
                }
                if (resultType) {
                    signature = new SignatureResultOverride(signature, new TypeWrapper(resultType, parameterType.context));
                }
            }
        }
        return signature;
    };
    PipeSymbol.prototype.indexed = function (argument) { return undefined; };
    Object.defineProperty(PipeSymbol.prototype, "tsType", {
        get: function () {
            var type = this._tsType;
            if (!type) {
                var classSymbol = this.findClassSymbol(this.pipe.type.reference);
                if (classSymbol) {
                    type = this._tsType = this.findTransformMethodType(classSymbol);
                }
                if (!type) {
                    type = this._tsType = getBuiltinTypeFromTs(symbols_1.BuiltinType.Any, this.context);
                }
            }
            return type;
        },
        enumerable: true,
        configurable: true
    });
    PipeSymbol.prototype.findClassSymbol = function (type) {
        return findClassSymbolInContext(type, this.context);
    };
    PipeSymbol.prototype.findTransformMethodType = function (classSymbol) {
        var classType = this.context.checker.getDeclaredTypeOfSymbol(classSymbol);
        if (classType) {
            var transform = classType.getProperty('transform');
            if (transform) {
                return this.context.checker.getTypeOfSymbolAtLocation(transform, this.context.node);
            }
        }
    };
    return PipeSymbol;
}());
function findClassSymbolInContext(type, context) {
    var sourceFile = context.program.getSourceFile(type.filePath);
    if (!sourceFile) {
        // This handles a case where an <packageName>/index.d.ts and a <packageName>/<packageName>.d.ts
        // are in the same directory. If we are looking for <packageName>/<packageName> and didn't
        // find it, look for <packageName>/index.d.ts as the program might have found that instead.
        var p = type.filePath;
        var m = p.match(INDEX_PATTERN);
        if (m) {
            var indexVersion = path.join(path.dirname(p), 'index.d.ts');
            sourceFile = context.program.getSourceFile(indexVersion);
        }
    }
    if (sourceFile) {
        var moduleSymbol = sourceFile.module || sourceFile.symbol;
        var exports_1 = context.checker.getExportsOfModule(moduleSymbol);
        return (exports_1 || []).find(function (symbol) { return symbol.name == type.name; });
    }
}
var EmptyTable = /** @class */ (function () {
    function EmptyTable() {
        this.size = 0;
    }
    EmptyTable.prototype.get = function (key) { return undefined; };
    EmptyTable.prototype.has = function (key) { return false; };
    EmptyTable.prototype.values = function () { return []; };
    EmptyTable.instance = new EmptyTable();
    return EmptyTable;
}());
function findTsConfig(fileName) {
    var dir = path.dirname(fileName);
    while (fs.existsSync(dir)) {
        var candidate = path.join(dir, 'tsconfig.json');
        if (fs.existsSync(candidate))
            return candidate;
        var parentDir = path.dirname(dir);
        if (parentDir === dir)
            break;
        dir = parentDir;
    }
}
function isBindingPattern(node) {
    return !!node && (node.kind === ts.SyntaxKind.ArrayBindingPattern ||
        node.kind === ts.SyntaxKind.ObjectBindingPattern);
}
function walkUpBindingElementsAndPatterns(node) {
    while (node && (node.kind === ts.SyntaxKind.BindingElement || isBindingPattern(node))) {
        node = node.parent;
    }
    return node;
}
function getCombinedNodeFlags(node) {
    node = walkUpBindingElementsAndPatterns(node);
    var flags = node.flags;
    if (node.kind === ts.SyntaxKind.VariableDeclaration) {
        node = node.parent;
    }
    if (node && node.kind === ts.SyntaxKind.VariableDeclarationList) {
        flags |= node.flags;
        node = node.parent;
    }
    if (node && node.kind === ts.SyntaxKind.VariableStatement) {
        flags |= node.flags;
    }
    return flags;
}
function isSymbolPrivate(s) {
    return !!s.valueDeclaration && isPrivate(s.valueDeclaration);
}
function getBuiltinTypeFromTs(kind, context) {
    var type;
    var checker = context.checker;
    var node = context.node;
    switch (kind) {
        case symbols_1.BuiltinType.Any:
            type = checker.getTypeAtLocation(setParents({
                kind: ts.SyntaxKind.AsExpression,
                expression: { kind: ts.SyntaxKind.TrueKeyword },
                type: { kind: ts.SyntaxKind.AnyKeyword }
            }, node));
            break;
        case symbols_1.BuiltinType.Boolean:
            type =
                checker.getTypeAtLocation(setParents({ kind: ts.SyntaxKind.TrueKeyword }, node));
            break;
        case symbols_1.BuiltinType.Null:
            type =
                checker.getTypeAtLocation(setParents({ kind: ts.SyntaxKind.NullKeyword }, node));
            break;
        case symbols_1.BuiltinType.Number:
            var numeric = { kind: ts.SyntaxKind.NumericLiteral };
            setParents({ kind: ts.SyntaxKind.ExpressionStatement, expression: numeric }, node);
            type = checker.getTypeAtLocation(numeric);
            break;
        case symbols_1.BuiltinType.String:
            type = checker.getTypeAtLocation(setParents({ kind: ts.SyntaxKind.NoSubstitutionTemplateLiteral }, node));
            break;
        case symbols_1.BuiltinType.Undefined:
            type = checker.getTypeAtLocation(setParents({
                kind: ts.SyntaxKind.VoidExpression,
                expression: { kind: ts.SyntaxKind.NumericLiteral }
            }, node));
            break;
        default:
            throw new Error("Internal error, unhandled literal kind " + kind + ":" + symbols_1.BuiltinType[kind]);
    }
    return type;
}
function setParents(node, parent) {
    node.parent = parent;
    ts.forEachChild(node, function (child) { return setParents(child, node); });
    return node;
}
function spanOf(node) {
    return { start: node.getStart(), end: node.getEnd() };
}
function shrink(span, offset) {
    if (offset == null)
        offset = 1;
    return { start: span.start + offset, end: span.end - offset };
}
function spanAt(sourceFile, line, column) {
    if (line != null && column != null) {
        var position_1 = ts.getPositionOfLineAndCharacter(sourceFile, line, column);
        var findChild = function findChild(node) {
            if (node.kind > ts.SyntaxKind.LastToken && node.pos <= position_1 && node.end > position_1) {
                var betterNode = ts.forEachChild(node, findChild);
                return betterNode || node;
            }
        };
        var node = ts.forEachChild(sourceFile, findChild);
        if (node) {
            return { start: node.getStart(), end: node.getEnd() };
        }
    }
}
function definitionFromTsSymbol(symbol) {
    var declarations = symbol.declarations;
    if (declarations) {
        return declarations.map(function (declaration) {
            var sourceFile = declaration.getSourceFile();
            return {
                fileName: sourceFile.fileName,
                span: { start: declaration.getStart(), end: declaration.getEnd() }
            };
        });
    }
}
function parentDeclarationOf(node) {
    while (node) {
        switch (node.kind) {
            case ts.SyntaxKind.ClassDeclaration:
            case ts.SyntaxKind.InterfaceDeclaration:
                return node;
            case ts.SyntaxKind.SourceFile:
                return undefined;
        }
        node = node.parent;
    }
}
function getContainerOf(symbol, context) {
    if (symbol.getFlags() & ts.SymbolFlags.ClassMember && symbol.declarations) {
        for (var _i = 0, _a = symbol.declarations; _i < _a.length; _i++) {
            var declaration = _a[_i];
            var parent_1 = parentDeclarationOf(declaration);
            if (parent_1) {
                var type = context.checker.getTypeAtLocation(parent_1);
                if (type) {
                    return new TypeWrapper(type, context);
                }
            }
        }
    }
}
function getTypeParameterOf(type, name) {
    if (type && type.symbol && type.symbol.name == name) {
        var typeArguments = type.typeArguments;
        if (typeArguments && typeArguments.length <= 1) {
            return typeArguments[0];
        }
    }
}
function typeKindOf(type) {
    if (type) {
        if (type.flags & ts.TypeFlags.Any) {
            return symbols_1.BuiltinType.Any;
        }
        else if (type.flags & (ts.TypeFlags.String | ts.TypeFlags.StringLike | ts.TypeFlags.StringLiteral)) {
            return symbols_1.BuiltinType.String;
        }
        else if (type.flags & (ts.TypeFlags.Number | ts.TypeFlags.NumberLike)) {
            return symbols_1.BuiltinType.Number;
        }
        else if (type.flags & (ts.TypeFlags.Undefined)) {
            return symbols_1.BuiltinType.Undefined;
        }
        else if (type.flags & (ts.TypeFlags.Null)) {
            return symbols_1.BuiltinType.Null;
        }
        else if (type.flags & ts.TypeFlags.Union) {
            // If all the constituent types of a union are the same kind, it is also that kind.
            var candidate = null;
            var unionType = type;
            if (unionType.types.length > 0) {
                candidate = typeKindOf(unionType.types[0]);
                for (var _i = 0, _a = unionType.types; _i < _a.length; _i++) {
                    var subType = _a[_i];
                    if (candidate != typeKindOf(subType)) {
                        return symbols_1.BuiltinType.Other;
                    }
                }
            }
            if (candidate != null) {
                return candidate;
            }
        }
        else if (type.flags & ts.TypeFlags.TypeParameter) {
            return symbols_1.BuiltinType.Unbound;
        }
    }
    return symbols_1.BuiltinType.Other;
}
function getFromSymbolTable(symbolTable, key) {
    var table = symbolTable;
    var symbol;
    if (typeof table.get === 'function') {
        // TS 2.2 uses a Map
        symbol = table.get(key);
    }
    else {
        // TS pre-2.2 uses an object
        symbol = table[key];
    }
    return symbol;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXNjcmlwdF9zeW1ib2xzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3NyYy9kaWFnbm9zdGljcy90eXBlc2NyaXB0X3N5bWJvbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFHSCx1QkFBeUI7QUFDekIsMkJBQTZCO0FBQzdCLCtCQUFpQztBQUVqQyxxQ0FBMEo7QUFDMUosMkRBQXNEO0FBRXRELHNDQUFzQztBQUN0QywyQ0FBMkM7QUFDM0MsSUFBTSxTQUFTLEdBQUksRUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ3pDLENBQUMsVUFBQyxJQUFhO1FBQ1YsT0FBQSxDQUFDLENBQUMsQ0FBRSxFQUFVLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLEdBQUksRUFBVSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUM7SUFBbEYsQ0FBa0YsQ0FBQyxDQUFDLENBQUM7SUFDMUYsQ0FBQyxVQUFDLElBQWEsSUFBSyxPQUFBLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUksRUFBVSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBOUMsQ0FBOEMsQ0FBQyxDQUFDO0FBRXhFLElBQU0sZUFBZSxHQUFJLEVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUM3QyxDQUFDLFVBQUMsSUFBYTtRQUNWLE9BQUEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBSSxFQUFVLENBQUMsU0FBUyxDQUFDLE1BQU07WUFDeEMsSUFBWSxDQUFDLFdBQVcsR0FBSSxFQUFVLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQztJQURqRSxDQUNpRSxDQUFDLENBQUMsQ0FBQztJQUN6RSxDQUFDLFVBQUMsSUFBYSxJQUFLLE9BQUEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBSSxFQUFVLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxFQUFoRCxDQUFnRCxDQUFDLENBQUM7QUFRMUUsd0JBQ0ksT0FBbUIsRUFBRSxPQUF1QixFQUFFLE1BQXFCLEVBQ25FLFVBQTZCO0lBQy9CLE9BQU8sSUFBSSxxQkFBcUIsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN6RSxDQUFDO0FBSkQsd0NBSUM7QUFFRCx5QkFDSSxPQUFtQixFQUFFLE9BQXVCLEVBQUUsWUFBMEI7SUFFMUUsSUFBTSxXQUFXLEdBQUcsd0JBQXdCLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQ3BFLElBQUksV0FBVyxFQUFFO1FBQ2YsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3BELElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzFELElBQUksSUFBSSxFQUFFO1lBQ1IsT0FBTyxJQUFJLFdBQVcsQ0FBQyxJQUFJLEVBQUUsRUFBQyxJQUFJLE1BQUEsRUFBRSxPQUFPLFNBQUEsRUFBRSxPQUFPLFNBQUEsRUFBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7U0FDbEU7S0FDRjtBQUNILENBQUM7QUFYRCwwQ0FXQztBQUVELHdDQUNJLE9BQW1CLEVBQUUsT0FBdUIsRUFBRSxNQUFxQixFQUNuRSxXQUFnQztJQUNsQyxJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDcEQsT0FBTyxJQUFJLFdBQVcsQ0FBQyxJQUFJLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLE9BQU8sU0FBQSxFQUFFLE9BQU8sU0FBQSxFQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUMzRSxDQUFDO0FBTEQsd0VBS0M7QUFFRCxrQ0FDSSxPQUFtQixFQUFFLElBQWtCO0lBQ3pDLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3BELElBQUksTUFBTSxFQUFFO1FBQ1YsT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxVQUFBLEtBQUs7WUFDbEMsSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLEVBQUU7Z0JBQ2pELElBQU0sZ0JBQWdCLEdBQUcsS0FBNEIsQ0FBQztnQkFDdEQsSUFBSSxnQkFBZ0IsQ0FBQyxJQUFJLElBQUksSUFBSSxJQUFJLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLElBQUksRUFBRTtvQkFDN0UsT0FBTyxnQkFBZ0IsQ0FBQztpQkFDekI7YUFDRjtRQUNILENBQUMsQ0FBcUMsQ0FBQztLQUN4QztJQUVELE9BQU8sU0FBUyxDQUFDO0FBQ25CLENBQUM7QUFmRCw0REFlQztBQUVELHVCQUNJLE1BQXFCLEVBQUUsT0FBbUIsRUFBRSxPQUF1QixFQUNuRSxLQUEyQjtJQUM3QixPQUFPLElBQUksVUFBVSxDQUFDLEtBQUssRUFBRSxFQUFDLE9BQU8sU0FBQSxFQUFFLE9BQU8sU0FBQSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDO0FBQ2pFLENBQUM7QUFKRCxzQ0FJQztBQUVEO0lBS0UsK0JBQ1ksT0FBbUIsRUFBVSxPQUF1QixFQUFVLE1BQXFCLEVBQ25GLFVBQTZCO1FBRDdCLFlBQU8sR0FBUCxPQUFPLENBQVk7UUFBVSxZQUFPLEdBQVAsT0FBTyxDQUFnQjtRQUFVLFdBQU0sR0FBTixNQUFNLENBQWU7UUFDbkYsZUFBVSxHQUFWLFVBQVUsQ0FBbUI7UUFOakMsY0FBUyxHQUFHLElBQUksR0FBRyxFQUF1QixDQUFDO0lBTVAsQ0FBQztJQUU3QywyQ0FBVyxHQUFYLFVBQVksTUFBYyxJQUFpQixPQUFPLFVBQVUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRXpGLDhDQUFjLEdBQWQsVUFBZSxJQUFpQjtRQUM5QixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN0QyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ1gsSUFBTSxJQUFJLEdBQUcsb0JBQW9CLENBQzdCLElBQUksRUFBRSxFQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFDLENBQUMsQ0FBQztZQUM3RSxNQUFNO2dCQUNGLElBQUksV0FBVyxDQUFDLElBQUksRUFBRSxFQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFDLENBQUMsQ0FBQztZQUM3RixJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7U0FDbEM7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBRUQsNENBQVksR0FBWjtRQUFhLGVBQWtCO2FBQWxCLFVBQWtCLEVBQWxCLHFCQUFrQixFQUFsQixJQUFrQjtZQUFsQiwwQkFBa0I7O1FBQzdCLHNFQUFzRTtRQUN0RSxJQUFJLE1BQU0sR0FBcUIsU0FBUyxDQUFDO1FBQ3pDLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRTtZQUNoQixNQUFNLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNyQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxNQUFNLEVBQUU7b0JBQ3RCLE1BQU0sR0FBRyxTQUFTLENBQUM7b0JBQ25CLE1BQU07aUJBQ1A7YUFDRjtTQUNGO1FBQ0QsT0FBTyxNQUFNLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxxQkFBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFRCw0Q0FBWSxHQUFaLFVBQWEsSUFBWSxJQUFZLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxxQkFBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVuRiw4Q0FBYyxHQUFkLFVBQWUsSUFBWTtRQUN6QixJQUFJLElBQUksWUFBWSxXQUFXLEVBQUU7WUFDL0IsSUFBTSxXQUFXLEdBQUcsa0JBQWtCLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztZQUM3RCxJQUFJLFdBQVcsRUFBRTtnQkFDZixPQUFPLElBQUksV0FBVyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDbkQ7U0FDRjtJQUNILENBQUM7SUFFRCxrREFBa0IsR0FBbEIsVUFBbUIsTUFBYztRQUMvQixJQUFJLE1BQU0sWUFBWSxXQUFXLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLElBQUksVUFBVSxDQUFDLEVBQUU7WUFDM0YsSUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUM3QixJQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ2hFLElBQUksZUFBZSxJQUFJLE1BQU0sRUFBRTtnQkFDN0IsT0FBTyxJQUFJLFdBQVcsQ0FBQyxlQUFlLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQ3pEO2lCQUFNLElBQUksZUFBZSxJQUFJLE1BQU0sRUFBRTtnQkFDcEMsT0FBTyxNQUFNLENBQUM7YUFDZjtTQUNGO1FBQ0QsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLHFCQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUVELHdDQUFRLEdBQVI7UUFDRSxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQzdCLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDWCxNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7U0FDOUM7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBRUQsa0RBQWtCLEdBQWxCLFVBQW1CLElBQWtCO1FBQ25DLElBQU0sT0FBTyxHQUFnQixFQUFDLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFDLENBQUM7UUFDL0YsSUFBTSxVQUFVLEdBQUcsd0JBQXdCLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzNELElBQUksVUFBVSxFQUFFO1lBQ2QsSUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLHlCQUF5QixDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQy9ELElBQUksV0FBVztnQkFBRSxPQUFPLElBQUksYUFBYSxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUMzRTtJQUNILENBQUM7SUFFRCw2Q0FBYSxHQUFiLFVBQWMsSUFBa0I7UUFDOUIsSUFBTSxPQUFPLEdBQWdCLEVBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUMsQ0FBQztRQUMvRixJQUFNLFVBQVUsR0FBRyx3QkFBd0IsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDM0QsT0FBTyxVQUFVLElBQUksSUFBSSxhQUFhLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFFRCxpREFBaUIsR0FBakIsVUFBa0IsT0FBNEI7UUFDNUMsSUFBTSxNQUFNLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQztRQUNwQyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxJQUFJLGNBQWMsQ0FBQyxDQUFDLENBQUMsRUFBckIsQ0FBcUIsQ0FBQyxDQUFDLENBQUM7UUFDdkQsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUVELGdEQUFnQixHQUFoQixVQUFpQixZQUEyQjtRQUMxQyxJQUFNLE1BQU0sR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO1FBQ3BDLEtBQTBCLFVBQVksRUFBWiw2QkFBWSxFQUFaLDBCQUFZLEVBQVosSUFBWSxFQUFFO1lBQW5DLElBQU0sV0FBVyxxQkFBQTtZQUNwQixNQUFNLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1NBQ3JDO1FBQ0QsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUVELHlDQUFTLEdBQVQsVUFBVSxJQUFZLEVBQUUsTUFBYztRQUNwQyxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRU8seURBQXlCLEdBQWpDLFVBQWtDLFVBQXFCO1FBQ3JELElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMseUJBQXlCLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM3RSxJQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTztZQUNsRCxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVMsRUFBRSxlQUFlLENBQUMsQ0FBQztRQUUvRCxJQUFJLFdBQVcsRUFBRTtZQUNmLElBQU0sc0JBQXNCLEdBQUcsV0FBVyxDQUFDLFlBQWMsQ0FBQyxDQUFDLENBQTJCLENBQUM7WUFDdkYsS0FBd0IsVUFBaUMsRUFBakMsS0FBQSxzQkFBc0IsQ0FBQyxVQUFVLEVBQWpDLGNBQWlDLEVBQWpDLElBQWlDLEVBQUU7Z0JBQXRELElBQU0sU0FBUyxTQUFBO2dCQUNsQixJQUFNLE1BQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxJQUFNLENBQUMsQ0FBQztnQkFDOUQsSUFBSSxNQUFJLENBQUMsTUFBUSxDQUFDLElBQUksSUFBSSxhQUFhLElBQUksZUFBZSxDQUFDLE1BQUksQ0FBQyxFQUFFO29CQUNoRSxJQUFNLGFBQWEsR0FBRyxNQUF3QixDQUFDO29CQUMvQyxJQUFJLGFBQWEsQ0FBQyxhQUFhLElBQUksYUFBYSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO3dCQUMzRSxPQUFPLGFBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO3FCQUM5QztpQkFDRjthQUNGO1NBQ0Y7SUFDSCxDQUFDO0lBRU8sMkNBQVcsR0FBbkIsVUFBb0IsTUFBYztRQUNoQyxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3pDLE9BQU8sSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDN0IsQ0FBQztJQUVPLDhDQUFjLEdBQXRCLFVBQXVCLE1BQWM7UUFDbkMsSUFBSSxJQUFJLEdBQTBCLFNBQVMsQ0FBQztRQUM1QyxJQUFJLE1BQU0sWUFBWSxXQUFXLEVBQUU7WUFDakMsSUFBSSxHQUFHLE1BQU0sQ0FBQztTQUNmO2FBQU0sSUFBSSxNQUFNLENBQUMsSUFBSSxZQUFZLFdBQVcsRUFBRTtZQUM3QyxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztTQUNwQjtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUNILDRCQUFDO0FBQUQsQ0FBQyxBQXhJRCxJQXdJQztBQUVELHNCQUFzQixJQUFhO0lBQ2pDLElBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBQzVDLE9BQU8sVUFBVSxJQUFJLFVBQVUsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDO0FBQzlDLENBQUM7QUFFRCxzQkFBc0IsSUFBYSxFQUFFLE9BQW9CO0lBQ3ZELE9BQU8sSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsSUFBSSxnQkFBZ0IsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLEVBQWhDLENBQWdDLENBQUMsQ0FBQztBQUM3RSxDQUFDO0FBRUQseUJBQXlCLElBQWEsRUFBRSxPQUFvQixFQUFFLEtBQWU7SUFFM0UsMERBQTBEO0lBQzFELElBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBQzVDLE9BQU8sVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztBQUN0RixDQUFDO0FBRUQ7SUFDRSxxQkFBbUIsTUFBZSxFQUFTLE9BQW9CO1FBQTVDLFdBQU0sR0FBTixNQUFNLENBQVM7UUFBUyxZQUFPLEdBQVAsT0FBTyxDQUFhO1FBVy9DLFNBQUksR0FBb0IsTUFBTSxDQUFDO1FBRS9CLGFBQVEsR0FBVyxZQUFZLENBQUM7UUFFaEMsU0FBSSxHQUFxQixTQUFTLENBQUM7UUFFbkMsY0FBUyxHQUFxQixTQUFTLENBQUM7UUFFeEMsV0FBTSxHQUFZLElBQUksQ0FBQztRQWxCckMsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNYLE1BQU0sS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUM7U0FDcEM7SUFDSCxDQUFDO0lBRUQsc0JBQUksNkJBQUk7YUFBUjtZQUNFLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO1lBQ2xDLE9BQU8sQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLGFBQWEsQ0FBQztRQUNsRCxDQUFDOzs7T0FBQTtJQVlELHNCQUFJLGlDQUFRO2FBQVosY0FBMEIsT0FBTyxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFFN0Qsc0JBQUksaUNBQVE7YUFBWjtZQUNFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDN0UsQ0FBQzs7O09BQUE7SUFFRCxzQkFBSSxtQ0FBVTthQUFkO1lBQ0UsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUN2QyxPQUFPLE1BQU0sQ0FBQyxDQUFDLENBQUMsc0JBQXNCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztRQUM3RCxDQUFDOzs7T0FBQTtJQUVELDZCQUFPLEdBQVA7UUFDRSxPQUFPLElBQUksa0JBQWtCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDM0UsQ0FBQztJQUVELGdDQUFVLEdBQVYsY0FBNEIsT0FBTyxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRTdFLHFDQUFlLEdBQWYsVUFBZ0IsS0FBZTtRQUM3QixPQUFPLGVBQWUsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVELDZCQUFPLEdBQVAsVUFBUSxRQUFnQixJQUFzQixPQUFPLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFDbkUsa0JBQUM7QUFBRCxDQUFDLEFBNUNELElBNENDO0FBRUQ7SUFVRSx1QkFBWSxNQUFpQixFQUFVLE9BQW9CO1FBQXBCLFlBQU8sR0FBUCxPQUFPLENBQWE7UUFIM0MsYUFBUSxHQUFZLEtBQUssQ0FBQztRQUMxQixhQUFRLEdBQVcsWUFBWSxDQUFDO1FBRzlDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxJQUFJLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3RFLE9BQU8sQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUMxQyxNQUFNLENBQUM7SUFDYixDQUFDO0lBRUQsc0JBQUksK0JBQUk7YUFBUixjQUFxQixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFFL0Msc0JBQUksK0JBQUk7YUFBUixjQUE4QixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFFN0Usc0JBQUksK0JBQUk7YUFBUixjQUErQixPQUFPLElBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFFbkYsc0JBQUksb0NBQVM7YUFBYixjQUFvQyxPQUFPLGNBQWMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBRXZGLHNCQUFJLGlDQUFNO2FBQVY7WUFDRSwyREFBMkQ7WUFDM0QsT0FBTyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdkMsQ0FBQzs7O09BQUE7SUFFRCxzQkFBSSxtQ0FBUTthQUFaLGNBQTBCLE9BQU8sWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBRTdELHNCQUFJLHFDQUFVO2FBQWQsY0FBK0IsT0FBTyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUU1RSwrQkFBTyxHQUFQO1FBQ0UsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDbEIsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDaEYsSUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUMvRSxJQUFNLFdBQVcsR0FBRyxJQUFJLFdBQVcsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNoRSxJQUFJLENBQUMsUUFBUSxHQUFHLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQzthQUN2QztpQkFBTTtnQkFDTCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksa0JBQWtCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFTLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQzdFO1NBQ0Y7UUFDRCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDdkIsQ0FBQztJQUVELGtDQUFVLEdBQVYsY0FBNEIsT0FBTyxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRTdFLHVDQUFlLEdBQWYsVUFBZ0IsS0FBZTtRQUM3QixPQUFPLGVBQWUsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVELCtCQUFPLEdBQVAsVUFBUSxRQUFnQixJQUFzQixPQUFPLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFFakUsc0JBQVksaUNBQU07YUFBbEI7WUFDRSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1lBQ3hCLElBQUksQ0FBQyxJQUFJLEVBQUU7Z0JBQ1QsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPO29CQUNmLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLHlCQUF5QixDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNwRjtZQUNELE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQzs7O09BQUE7SUFDSCxvQkFBQztBQUFELENBQUMsQUE5REQsSUE4REM7QUFFRDtJQU9FLHdCQUFvQixXQUE4QjtRQUE5QixnQkFBVyxHQUFYLFdBQVcsQ0FBbUI7UUFObEMsYUFBUSxHQUFXLGFBQWEsQ0FBQztRQUVqQyxhQUFRLEdBQVksS0FBSyxDQUFDO1FBRTFCLFdBQU0sR0FBWSxJQUFJLENBQUM7SUFFYyxDQUFDO0lBRXRELHNCQUFJLGdDQUFJO2FBQVIsY0FBYSxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFFNUMsc0JBQUksZ0NBQUk7YUFBUixjQUFhLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUU1QyxzQkFBSSxxQ0FBUzthQUFiLGNBQW9DLE9BQU8sU0FBUyxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFFdkQsc0JBQUksZ0NBQUk7YUFBUixjQUFhLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUU1QyxzQkFBSSxvQ0FBUTthQUFaLGNBQTBCLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFHbEUsc0JBQUksc0NBQVU7YUFBZCxjQUErQixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFFcEUsZ0NBQU8sR0FBUCxjQUF5QixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztJQUVsRSxtQ0FBVSxHQUFWLGNBQTRCLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRXhFLHdDQUFlLEdBQWYsVUFBZ0IsS0FBZTtRQUM3QixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRUQsZ0NBQU8sR0FBUCxVQUFRLFFBQWdCLElBQXNCLE9BQU8sU0FBUyxDQUFDLENBQUMsQ0FBQztJQUNuRSxxQkFBQztBQUFELENBQUMsQUEvQkQsSUErQkM7QUFFRDtJQUNFLDBCQUFvQixTQUF1QixFQUFVLE9BQW9CO1FBQXJELGNBQVMsR0FBVCxTQUFTLENBQWM7UUFBVSxZQUFPLEdBQVAsT0FBTyxDQUFhO0lBQUcsQ0FBQztJQUU3RSxzQkFBSSx1Q0FBUzthQUFiO1lBQ0UsT0FBTyxJQUFJLGtCQUFrQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUFFLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzlFLENBQUM7OztPQUFBO0lBRUQsc0JBQUksb0NBQU07YUFBVixjQUF1QixPQUFPLElBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUFFLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFDaEcsdUJBQUM7QUFBRCxDQUFDLEFBUkQsSUFRQztBQUVEO0lBQ0UsaUNBQW9CLFNBQW9CLEVBQVUsVUFBa0I7UUFBaEQsY0FBUyxHQUFULFNBQVMsQ0FBVztRQUFVLGVBQVUsR0FBVixVQUFVLENBQVE7SUFBRyxDQUFDO0lBRXhFLHNCQUFJLDhDQUFTO2FBQWIsY0FBK0IsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBRWpFLHNCQUFJLDJDQUFNO2FBQVYsY0FBdUIsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFDbEQsOEJBQUM7QUFBRCxDQUFDLEFBTkQsSUFNQztBQUVEOzs7R0FHRztBQUNILElBQU0sNkJBQTZCLEdBQUcsS0FBSyxDQUFDO0FBRS9CLFFBQUEsb0JBQW9CLEdBQUcsVUFBQyxTQUFpQixJQUFLLE9BQUEsVUFBQyxPQUFvQjtJQUM5RSxJQUFJLHFDQUFnQixDQUFDLFNBQVMsRUFBRSw2QkFBNkIsQ0FBQyxFQUFFO1FBQzlELDRFQUE0RTtRQUM1RSxJQUFNLFFBQU0sR0FBRyxJQUFJLEdBQUcsRUFBcUIsQ0FBQztRQUM1QyxLQUFxQixVQUFPLEVBQVAsbUJBQU8sRUFBUCxxQkFBTyxFQUFQLElBQU8sRUFBRTtZQUF6QixJQUFNLE1BQU0sZ0JBQUE7WUFDZixRQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7U0FDakM7UUFDRCw2RkFBNkY7UUFDN0YsdUJBQXVCO1FBQ3ZCLDhGQUE4RjtRQUM5Rix3QkFBd0I7UUFDeEIsT0FBNkIsUUFBTyxDQUFDO0tBQ3RDO0lBRUQsMkVBQTJFO0lBQzNFLElBQU0sTUFBTSxHQUFnQyxFQUFFLENBQUM7SUFDL0MsS0FBcUIsVUFBTyxFQUFQLG1CQUFPLEVBQVAscUJBQU8sRUFBUCxJQUFPLEVBQUU7UUFBekIsSUFBTSxNQUFNLGdCQUFBO1FBQ2YsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUM7S0FDOUI7SUFDRCxPQUE2QixNQUFPLENBQUM7QUFDdkMsQ0FBQyxFQXBCMEQsQ0FvQjFELENBQUM7QUFFRixtQkFBbUIsV0FBdUM7SUFDeEQsSUFBSSxDQUFDLFdBQVc7UUFBRSxPQUFPLEVBQUUsQ0FBQztJQUU1QixJQUFNLEtBQUssR0FBRyxXQUFrQixDQUFDO0lBRWpDLElBQUksT0FBTyxLQUFLLENBQUMsTUFBTSxLQUFLLFVBQVUsRUFBRTtRQUN0QyxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFnQixDQUFDO0tBQ2xEO0lBRUQsSUFBTSxNQUFNLEdBQWdCLEVBQUUsQ0FBQztJQUUvQixJQUFNLEdBQUcsR0FBRyxPQUFPLEtBQUssQ0FBQyxjQUFjLEtBQUssVUFBVSxDQUFDLENBQUM7UUFDcEQsVUFBQyxJQUFZLElBQUssT0FBQSxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxFQUExQixDQUEwQixDQUFDLENBQUM7UUFDOUMsVUFBQyxJQUFZLElBQUssT0FBQSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFiLENBQWEsQ0FBQztJQUVwQyxLQUFLLElBQU0sTUFBSSxJQUFJLEtBQUssRUFBRTtRQUN4QixJQUFJLEdBQUcsQ0FBQyxNQUFJLENBQUMsRUFBRTtZQUNiLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQUksQ0FBQyxDQUFDLENBQUM7U0FDMUI7S0FDRjtJQUNELE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUFFRDtJQUlFLDRCQUFZLE9BQTZDLEVBQVUsT0FBb0I7UUFBcEIsWUFBTyxHQUFQLE9BQU8sQ0FBYTtRQUNyRixPQUFPLEdBQUcsT0FBTyxJQUFJLEVBQUUsQ0FBQztRQUV4QixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDMUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7WUFDdkIsSUFBTSxhQUFhLEdBQUcsNEJBQW9CLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3ZELElBQUksQ0FBQyxXQUFXLEdBQUcsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQzNDO2FBQU07WUFDTCxJQUFJLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNsQyxJQUFJLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQztTQUM1QjtJQUNILENBQUM7SUFFRCxzQkFBSSxvQ0FBSTthQUFSLGNBQXFCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUVsRCxnQ0FBRyxHQUFILFVBQUksR0FBVztRQUNiLElBQU0sTUFBTSxHQUFHLGtCQUFrQixDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDekQsT0FBTyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksYUFBYSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztJQUN0RSxDQUFDO0lBRUQsZ0NBQUcsR0FBSCxVQUFJLEdBQVc7UUFDYixJQUFNLEtBQUssR0FBUSxJQUFJLENBQUMsV0FBVyxDQUFDO1FBQ3BDLE9BQU8sQ0FBQyxPQUFPLEtBQUssQ0FBQyxHQUFHLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUM7SUFDakYsQ0FBQztJQUVELG1DQUFNLEdBQU47UUFBQSxpQkFBd0Y7UUFBbkUsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLElBQUksYUFBYSxDQUFDLENBQUMsRUFBRSxLQUFJLENBQUMsT0FBTyxDQUFDLEVBQWxDLENBQWtDLENBQUMsQ0FBQztJQUFDLENBQUM7SUFDMUYseUJBQUM7QUFBRCxDQUFDLEFBOUJELElBOEJDO0FBRUQ7SUFBQTtRQUNVLFFBQUcsR0FBRyxJQUFJLEdBQUcsRUFBa0IsQ0FBQztRQUNoQyxZQUFPLEdBQWEsRUFBRSxDQUFDO0lBMkJqQyxDQUFDO0lBekJDLHNCQUFJLGdDQUFJO2FBQVIsY0FBcUIsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBRTVDLDRCQUFHLEdBQUgsVUFBSSxHQUFXLElBQXNCLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRWhFLDRCQUFHLEdBQUgsVUFBSSxNQUFjO1FBQ2hCLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQzdCLElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUcsQ0FBQztZQUM3QyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO1NBQ3ZEO1FBQ0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNsQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRUQsK0JBQU0sR0FBTixVQUFPLE9BQWlCO1FBQ3RCLEtBQXFCLFVBQU8sRUFBUCxtQkFBTyxFQUFQLHFCQUFPLEVBQVAsSUFBTyxFQUFFO1lBQXpCLElBQU0sTUFBTSxnQkFBQTtZQUNmLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDbEI7SUFDSCxDQUFDO0lBRUQsNEJBQUcsR0FBSCxVQUFJLEdBQVcsSUFBYSxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUV2RCwrQkFBTSxHQUFOO1FBQ0UsaUZBQWlGO1FBQ2pGLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN0QixDQUFDO0lBQ0gscUJBQUM7QUFBRCxDQUFDLEFBN0JELElBNkJDO0FBRUQ7SUFDRSxvQkFBb0IsS0FBMkIsRUFBVSxPQUFvQjtRQUF6RCxVQUFLLEdBQUwsS0FBSyxDQUFzQjtRQUFVLFlBQU8sR0FBUCxPQUFPLENBQWE7SUFBRyxDQUFDO0lBRWpGLHNCQUFJLDRCQUFJO2FBQVIsY0FBYSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFFeEMsd0JBQUcsR0FBSCxVQUFJLEdBQVc7UUFDYixJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFBLElBQUksSUFBSSxPQUFBLElBQUksQ0FBQyxJQUFJLElBQUksR0FBRyxFQUFoQixDQUFnQixDQUFDLENBQUM7UUFDdkQsSUFBSSxJQUFJLEVBQUU7WUFDUixPQUFPLElBQUksVUFBVSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDM0M7SUFDSCxDQUFDO0lBRUQsd0JBQUcsR0FBSCxVQUFJLEdBQVcsSUFBYSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQUEsSUFBSSxJQUFJLE9BQUEsSUFBSSxDQUFDLElBQUksSUFBSSxHQUFHLEVBQWhCLENBQWdCLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBRXZGLDJCQUFNLEdBQU47UUFBQSxpQkFBeUY7UUFBcEUsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFBLElBQUksSUFBSSxPQUFBLElBQUksVUFBVSxDQUFDLElBQUksRUFBRSxLQUFJLENBQUMsT0FBTyxDQUFDLEVBQWxDLENBQWtDLENBQUMsQ0FBQztJQUFDLENBQUM7SUFDM0YsaUJBQUM7QUFBRCxDQUFDLEFBZkQsSUFlQztBQUVELG9GQUFvRjtBQUNwRixJQUFNLGFBQWEsR0FBRywrQkFBK0IsQ0FBQztBQUV0RDtJQVVFLG9CQUFvQixJQUF3QixFQUFVLE9BQW9CO1FBQXRELFNBQUksR0FBSixJQUFJLENBQW9CO1FBQVUsWUFBTyxHQUFQLE9BQU8sQ0FBYTtRQVAxRCxTQUFJLEdBQW9CLE1BQU0sQ0FBQztRQUMvQixhQUFRLEdBQVcsWUFBWSxDQUFDO1FBQ2hDLGNBQVMsR0FBcUIsU0FBUyxDQUFDO1FBQ3hDLGFBQVEsR0FBWSxJQUFJLENBQUM7UUFDekIsYUFBUSxHQUFZLEtBQUssQ0FBQztRQUMxQixXQUFNLEdBQVksSUFBSSxDQUFDO0lBRXNDLENBQUM7SUFFOUUsc0JBQUksNEJBQUk7YUFBUixjQUFxQixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFFN0Msc0JBQUksNEJBQUk7YUFBUixjQUErQixPQUFPLElBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFFbkYsc0JBQUksa0NBQVU7YUFBZDtZQUNFLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDdkMsT0FBTyxNQUFNLENBQUMsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7UUFDN0QsQ0FBQzs7O09BQUE7SUFFRCw0QkFBTyxHQUFQLGNBQXlCLE9BQU8sVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFFdEQsK0JBQVUsR0FBVixjQUE0QixPQUFPLFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFN0Usb0NBQWUsR0FBZixVQUFnQixLQUFlO1FBQzdCLElBQUksU0FBUyxHQUFHLGVBQWUsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFHLENBQUM7UUFDcEUsSUFBSSxLQUFLLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtZQUNyQixJQUFNLGFBQWEsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDL0IsSUFBSSxhQUFhLFlBQVksV0FBVyxFQUFFO2dCQUN4QyxJQUFJLFVBQVUsR0FBc0IsU0FBUyxDQUFDO2dCQUM5QyxRQUFRLElBQUksQ0FBQyxJQUFJLEVBQUU7b0JBQ2pCLEtBQUssT0FBTzt3QkFDVixRQUFRLGFBQWEsQ0FBQyxJQUFJLEVBQUU7NEJBQzFCLEtBQUssWUFBWSxDQUFDOzRCQUNsQixLQUFLLFNBQVMsQ0FBQzs0QkFDZixLQUFLLGNBQWM7Z0NBQ2pCLFVBQVUsR0FBRyxrQkFBa0IsQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQ0FDMUUsTUFBTTs0QkFDUjtnQ0FDRSxVQUFVLEdBQUcsb0JBQW9CLENBQUMscUJBQVcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dDQUNqRSxNQUFNO3lCQUNUO3dCQUNELE1BQU07b0JBQ1IsS0FBSyxPQUFPO3dCQUNWLFVBQVUsR0FBRyxrQkFBa0IsQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO3dCQUMvRCxNQUFNO2lCQUNUO2dCQUNELElBQUksVUFBVSxFQUFFO29CQUNkLFNBQVMsR0FBRyxJQUFJLHVCQUF1QixDQUNuQyxTQUFTLEVBQUUsSUFBSSxXQUFXLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2lCQUNwRTthQUNGO1NBQ0Y7UUFDRCxPQUFPLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBRUQsNEJBQU8sR0FBUCxVQUFRLFFBQWdCLElBQXNCLE9BQU8sU0FBUyxDQUFDLENBQUMsQ0FBQztJQUVqRSxzQkFBWSw4QkFBTTthQUFsQjtZQUNFLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7WUFDeEIsSUFBSSxDQUFDLElBQUksRUFBRTtnQkFDVCxJQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUNuRSxJQUFJLFdBQVcsRUFBRTtvQkFDZixJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUMsV0FBVyxDQUFHLENBQUM7aUJBQ25FO2dCQUNELElBQUksQ0FBQyxJQUFJLEVBQUU7b0JBQ1QsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLEdBQUcsb0JBQW9CLENBQUMscUJBQVcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2lCQUMzRTthQUNGO1lBQ0QsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDOzs7T0FBQTtJQUVPLG9DQUFlLEdBQXZCLFVBQXdCLElBQWtCO1FBQ3hDLE9BQU8sd0JBQXdCLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRU8sNENBQXVCLEdBQS9CLFVBQWdDLFdBQXNCO1FBQ3BELElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLHVCQUF1QixDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzVFLElBQUksU0FBUyxFQUFFO1lBQ2IsSUFBTSxTQUFTLEdBQUcsU0FBUyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNyRCxJQUFJLFNBQVMsRUFBRTtnQkFDYixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLHlCQUF5QixDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3JGO1NBQ0Y7SUFDSCxDQUFDO0lBQ0gsaUJBQUM7QUFBRCxDQUFDLEFBdEZELElBc0ZDO0FBRUQsa0NBQWtDLElBQWtCLEVBQUUsT0FBb0I7SUFDeEUsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzlELElBQUksQ0FBQyxVQUFVLEVBQUU7UUFDZiwrRkFBK0Y7UUFDL0YsMEZBQTBGO1FBQzFGLDJGQUEyRjtRQUMzRixJQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBa0IsQ0FBQztRQUNsQyxJQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxFQUFFO1lBQ0wsSUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBQzlELFVBQVUsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUMxRDtLQUNGO0lBQ0QsSUFBSSxVQUFVLEVBQUU7UUFDZCxJQUFNLFlBQVksR0FBSSxVQUFrQixDQUFDLE1BQU0sSUFBSyxVQUFrQixDQUFDLE1BQU0sQ0FBQztRQUM5RSxJQUFNLFNBQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ2pFLE9BQU8sQ0FBQyxTQUFPLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsTUFBTSxJQUFJLE9BQUEsTUFBTSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxFQUF4QixDQUF3QixDQUFDLENBQUM7S0FDakU7QUFDSCxDQUFDO0FBRUQ7SUFBQTtRQUNrQixTQUFJLEdBQVcsQ0FBQyxDQUFDO0lBS25DLENBQUM7SUFKQyx3QkFBRyxHQUFILFVBQUksR0FBVyxJQUFzQixPQUFPLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFDeEQsd0JBQUcsR0FBSCxVQUFJLEdBQVcsSUFBYSxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDM0MsMkJBQU0sR0FBTixjQUFxQixPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDMUIsbUJBQVEsR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFDO0lBQ3JDLGlCQUFDO0NBQUEsQUFORCxJQU1DO0FBRUQsc0JBQXNCLFFBQWdCO0lBQ3BDLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDakMsT0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQ3pCLElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLGVBQWUsQ0FBQyxDQUFDO1FBQ2xELElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUM7WUFBRSxPQUFPLFNBQVMsQ0FBQztRQUMvQyxJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3BDLElBQUksU0FBUyxLQUFLLEdBQUc7WUFBRSxNQUFNO1FBQzdCLEdBQUcsR0FBRyxTQUFTLENBQUM7S0FDakI7QUFDSCxDQUFDO0FBRUQsMEJBQTBCLElBQWE7SUFDckMsT0FBTyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLG1CQUFtQjtRQUMvQyxJQUFJLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUN0RSxDQUFDO0FBRUQsMENBQTBDLElBQWE7SUFDckQsT0FBTyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsY0FBYyxJQUFJLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUU7UUFDckYsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFRLENBQUM7S0FDdEI7SUFFRCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7QUFFRCw4QkFBOEIsSUFBYTtJQUN6QyxJQUFJLEdBQUcsZ0NBQWdDLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFOUMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztJQUN2QixJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxtQkFBbUIsRUFBRTtRQUNuRCxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQVEsQ0FBQztLQUN0QjtJQUVELElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyx1QkFBdUIsRUFBRTtRQUMvRCxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQztRQUNwQixJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQVEsQ0FBQztLQUN0QjtJQUVELElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsRUFBRTtRQUN6RCxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQztLQUNyQjtJQUVELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQUVELHlCQUF5QixDQUFZO0lBQ25DLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDL0QsQ0FBQztBQUVELDhCQUE4QixJQUFpQixFQUFFLE9BQW9CO0lBQ25FLElBQUksSUFBYSxDQUFDO0lBQ2xCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUM7SUFDaEMsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztJQUMxQixRQUFRLElBQUksRUFBRTtRQUNaLEtBQUsscUJBQVcsQ0FBQyxHQUFHO1lBQ2xCLElBQUksR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUN6QjtnQkFDWixJQUFJLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxZQUFZO2dCQUNoQyxVQUFVLEVBQVcsRUFBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxXQUFXLEVBQUM7Z0JBQ3RELElBQUksRUFBVyxFQUFDLElBQUksRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBQzthQUNoRCxFQUNELElBQUksQ0FBQyxDQUFDLENBQUM7WUFDWCxNQUFNO1FBQ1IsS0FBSyxxQkFBVyxDQUFDLE9BQU87WUFDdEIsSUFBSTtnQkFDQSxPQUFPLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFVLEVBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsV0FBVyxFQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUM1RixNQUFNO1FBQ1IsS0FBSyxxQkFBVyxDQUFDLElBQUk7WUFDbkIsSUFBSTtnQkFDQSxPQUFPLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFVLEVBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsV0FBVyxFQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUM1RixNQUFNO1FBQ1IsS0FBSyxxQkFBVyxDQUFDLE1BQU07WUFDckIsSUFBTSxPQUFPLEdBQVksRUFBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxjQUFjLEVBQUMsQ0FBQztZQUM5RCxVQUFVLENBQU0sRUFBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxtQkFBbUIsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDdEYsSUFBSSxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUMxQyxNQUFNO1FBQ1IsS0FBSyxxQkFBVyxDQUFDLE1BQU07WUFDckIsSUFBSSxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FDNUIsVUFBVSxDQUFVLEVBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsNkJBQTZCLEVBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3BGLE1BQU07UUFDUixLQUFLLHFCQUFXLENBQUMsU0FBUztZQUN4QixJQUFJLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FDekI7Z0JBQ1osSUFBSSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsY0FBYztnQkFDbEMsVUFBVSxFQUFXLEVBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsY0FBYyxFQUFDO2FBQzFELEVBQ0QsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNYLE1BQU07UUFDUjtZQUNFLE1BQU0sSUFBSSxLQUFLLENBQUMsNENBQTBDLElBQUksU0FBSSxxQkFBVyxDQUFDLElBQUksQ0FBRyxDQUFDLENBQUM7S0FDMUY7SUFDRCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7QUFFRCxvQkFBdUMsSUFBTyxFQUFFLE1BQWU7SUFDN0QsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDckIsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsVUFBQSxLQUFLLElBQUksT0FBQSxVQUFVLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxFQUF2QixDQUF1QixDQUFDLENBQUM7SUFDeEQsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBRUQsZ0JBQWdCLElBQWE7SUFDM0IsT0FBTyxFQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBQyxDQUFDO0FBQ3RELENBQUM7QUFFRCxnQkFBZ0IsSUFBVSxFQUFFLE1BQWU7SUFDekMsSUFBSSxNQUFNLElBQUksSUFBSTtRQUFFLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDL0IsT0FBTyxFQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsR0FBRyxNQUFNLEVBQUMsQ0FBQztBQUM5RCxDQUFDO0FBRUQsZ0JBQWdCLFVBQXlCLEVBQUUsSUFBWSxFQUFFLE1BQWM7SUFDckUsSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLE1BQU0sSUFBSSxJQUFJLEVBQUU7UUFDbEMsSUFBTSxVQUFRLEdBQUcsRUFBRSxDQUFDLDZCQUE2QixDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDNUUsSUFBTSxTQUFTLEdBQUcsbUJBQW1CLElBQWE7WUFDaEQsSUFBSSxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxHQUFHLElBQUksVUFBUSxJQUFJLElBQUksQ0FBQyxHQUFHLEdBQUcsVUFBUSxFQUFFO2dCQUN0RixJQUFNLFVBQVUsR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztnQkFDcEQsT0FBTyxVQUFVLElBQUksSUFBSSxDQUFDO2FBQzNCO1FBQ0gsQ0FBQyxDQUFDO1FBRUYsSUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDcEQsSUFBSSxJQUFJLEVBQUU7WUFDUixPQUFPLEVBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFDLENBQUM7U0FDckQ7S0FDRjtBQUNILENBQUM7QUFFRCxnQ0FBZ0MsTUFBaUI7SUFDL0MsSUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQztJQUN6QyxJQUFJLFlBQVksRUFBRTtRQUNoQixPQUFPLFlBQVksQ0FBQyxHQUFHLENBQUMsVUFBQSxXQUFXO1lBQ2pDLElBQU0sVUFBVSxHQUFHLFdBQVcsQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUMvQyxPQUFPO2dCQUNMLFFBQVEsRUFBRSxVQUFVLENBQUMsUUFBUTtnQkFDN0IsSUFBSSxFQUFFLEVBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxRQUFRLEVBQUUsRUFBRSxHQUFHLEVBQUUsV0FBVyxDQUFDLE1BQU0sRUFBRSxFQUFDO2FBQ2pFLENBQUM7UUFDSixDQUFDLENBQUMsQ0FBQztLQUNKO0FBQ0gsQ0FBQztBQUVELDZCQUE2QixJQUFhO0lBQ3hDLE9BQU8sSUFBSSxFQUFFO1FBQ1gsUUFBUSxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ2pCLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQztZQUNwQyxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsb0JBQW9CO2dCQUNyQyxPQUFPLElBQUksQ0FBQztZQUNkLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxVQUFVO2dCQUMzQixPQUFPLFNBQVMsQ0FBQztTQUNwQjtRQUNELElBQUksR0FBRyxJQUFJLENBQUMsTUFBUSxDQUFDO0tBQ3RCO0FBQ0gsQ0FBQztBQUVELHdCQUF3QixNQUFpQixFQUFFLE9BQW9CO0lBQzdELElBQUksTUFBTSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsV0FBVyxJQUFJLE1BQU0sQ0FBQyxZQUFZLEVBQUU7UUFDekUsS0FBMEIsVUFBbUIsRUFBbkIsS0FBQSxNQUFNLENBQUMsWUFBWSxFQUFuQixjQUFtQixFQUFuQixJQUFtQixFQUFFO1lBQTFDLElBQU0sV0FBVyxTQUFBO1lBQ3BCLElBQU0sUUFBTSxHQUFHLG1CQUFtQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ2hELElBQUksUUFBTSxFQUFFO2dCQUNWLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsUUFBTSxDQUFDLENBQUM7Z0JBQ3ZELElBQUksSUFBSSxFQUFFO29CQUNSLE9BQU8sSUFBSSxXQUFXLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO2lCQUN2QzthQUNGO1NBQ0Y7S0FDRjtBQUNILENBQUM7QUFFRCw0QkFBNEIsSUFBYSxFQUFFLElBQVk7SUFDckQsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxJQUFJLEVBQUU7UUFDbkQsSUFBTSxhQUFhLEdBQWUsSUFBWSxDQUFDLGFBQWEsQ0FBQztRQUM3RCxJQUFJLGFBQWEsSUFBSSxhQUFhLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtZQUM5QyxPQUFPLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN6QjtLQUNGO0FBQ0gsQ0FBQztBQUVELG9CQUFvQixJQUF5QjtJQUMzQyxJQUFJLElBQUksRUFBRTtRQUNSLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTtZQUNqQyxPQUFPLHFCQUFXLENBQUMsR0FBRyxDQUFDO1NBQ3hCO2FBQU0sSUFDSCxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsRUFBRTtZQUM3RixPQUFPLHFCQUFXLENBQUMsTUFBTSxDQUFDO1NBQzNCO2FBQU0sSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUN2RSxPQUFPLHFCQUFXLENBQUMsTUFBTSxDQUFDO1NBQzNCO2FBQU0sSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUNoRCxPQUFPLHFCQUFXLENBQUMsU0FBUyxDQUFDO1NBQzlCO2FBQU0sSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUMzQyxPQUFPLHFCQUFXLENBQUMsSUFBSSxDQUFDO1NBQ3pCO2FBQU0sSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFO1lBQzFDLG1GQUFtRjtZQUNuRixJQUFJLFNBQVMsR0FBcUIsSUFBSSxDQUFDO1lBQ3ZDLElBQU0sU0FBUyxHQUFHLElBQW9CLENBQUM7WUFDdkMsSUFBSSxTQUFTLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQzlCLFNBQVMsR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMzQyxLQUFzQixVQUFlLEVBQWYsS0FBQSxTQUFTLENBQUMsS0FBSyxFQUFmLGNBQWUsRUFBZixJQUFlLEVBQUU7b0JBQWxDLElBQU0sT0FBTyxTQUFBO29CQUNoQixJQUFJLFNBQVMsSUFBSSxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUU7d0JBQ3BDLE9BQU8scUJBQVcsQ0FBQyxLQUFLLENBQUM7cUJBQzFCO2lCQUNGO2FBQ0Y7WUFDRCxJQUFJLFNBQVMsSUFBSSxJQUFJLEVBQUU7Z0JBQ3JCLE9BQU8sU0FBUyxDQUFDO2FBQ2xCO1NBQ0Y7YUFBTSxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxhQUFhLEVBQUU7WUFDbEQsT0FBTyxxQkFBVyxDQUFDLE9BQU8sQ0FBQztTQUM1QjtLQUNGO0lBQ0QsT0FBTyxxQkFBVyxDQUFDLEtBQUssQ0FBQztBQUMzQixDQUFDO0FBSUQsNEJBQTRCLFdBQTJCLEVBQUUsR0FBVztJQUNsRSxJQUFNLEtBQUssR0FBRyxXQUFrQixDQUFDO0lBQ2pDLElBQUksTUFBMkIsQ0FBQztJQUVoQyxJQUFJLE9BQU8sS0FBSyxDQUFDLEdBQUcsS0FBSyxVQUFVLEVBQUU7UUFDbkMsb0JBQW9CO1FBQ3BCLE1BQU0sR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ3pCO1NBQU07UUFDTCw0QkFBNEI7UUFDNUIsTUFBTSxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNyQjtJQUVELE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUMifQ==