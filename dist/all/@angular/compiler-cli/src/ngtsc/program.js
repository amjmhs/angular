"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var annotations_1 = require("./annotations");
var metadata_1 = require("./metadata");
var resource_loader_1 = require("./resource_loader");
var transform_1 = require("./transform");
var NgtscProgram = /** @class */ (function () {
    function NgtscProgram(rootNames, options, host, oldProgram) {
        this.options = options;
        this.host = host;
        this.compilation = undefined;
        this._coreImportsFrom = undefined;
        this._reflector = undefined;
        this._isCore = undefined;
        this.resourceLoader = host.readResource !== undefined ?
            new resource_loader_1.HostResourceLoader(host.readResource.bind(host)) :
            new resource_loader_1.FileResourceLoader();
        this.tsProgram =
            ts.createProgram(rootNames, options, host, oldProgram && oldProgram.getTsProgram());
    }
    NgtscProgram.prototype.getTsProgram = function () { return this.tsProgram; };
    NgtscProgram.prototype.getTsOptionDiagnostics = function (cancellationToken) {
        return this.tsProgram.getOptionsDiagnostics(cancellationToken);
    };
    NgtscProgram.prototype.getNgOptionDiagnostics = function (cancellationToken) {
        return [];
    };
    NgtscProgram.prototype.getTsSyntacticDiagnostics = function (sourceFile, cancellationToken) {
        return this.tsProgram.getSyntacticDiagnostics(sourceFile, cancellationToken);
    };
    NgtscProgram.prototype.getNgStructuralDiagnostics = function (cancellationToken) {
        return [];
    };
    NgtscProgram.prototype.getTsSemanticDiagnostics = function (sourceFile, cancellationToken) {
        return this.tsProgram.getSemanticDiagnostics(sourceFile, cancellationToken);
    };
    NgtscProgram.prototype.getNgSemanticDiagnostics = function (fileName, cancellationToken) {
        return [];
    };
    NgtscProgram.prototype.loadNgStructureAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.compilation === undefined)) return [3 /*break*/, 2];
                        this.compilation = this.makeCompilation();
                        return [4 /*yield*/, this.tsProgram.getSourceFiles()
                                .filter(function (file) { return !file.fileName.endsWith('.d.ts'); })
                                .map(function (file) { return _this.compilation.analyzeAsync(file); })
                                .filter(function (result) { return result !== undefined; })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    NgtscProgram.prototype.listLazyRoutes = function (entryRoute) {
        throw new Error('Method not implemented.');
    };
    NgtscProgram.prototype.getLibrarySummaries = function () {
        throw new Error('Method not implemented.');
    };
    NgtscProgram.prototype.getEmittedGeneratedFiles = function () {
        throw new Error('Method not implemented.');
    };
    NgtscProgram.prototype.getEmittedSourceFiles = function () {
        throw new Error('Method not implemented.');
    };
    NgtscProgram.prototype.emit = function (opts) {
        var _this = this;
        var emitCallback = opts && opts.emitCallback || defaultEmitCallback;
        if (this.compilation === undefined) {
            this.compilation = this.makeCompilation();
            this.tsProgram.getSourceFiles()
                .filter(function (file) { return !file.fileName.endsWith('.d.ts'); })
                .forEach(function (file) { return _this.compilation.analyzeSync(file); });
        }
        // Since there is no .d.ts transformation API, .d.ts files are transformed during write.
        var writeFile = function (fileName, data, writeByteOrderMark, onError, sourceFiles) {
            if (fileName.endsWith('.d.ts')) {
                data = sourceFiles.reduce(function (data, sf) { return _this.compilation.transformedDtsFor(sf.fileName, data, fileName); }, data);
            }
            _this.host.writeFile(fileName, data, writeByteOrderMark, onError, sourceFiles);
        };
        // Run the emit, including a custom transformer that will downlevel the Ivy decorators in code.
        var emitResult = emitCallback({
            program: this.tsProgram,
            host: this.host,
            options: this.options,
            emitOnlyDtsFiles: false, writeFile: writeFile,
            customTransformers: {
                before: [transform_1.ivyTransformFactory(this.compilation, this.reflector, this.coreImportsFrom)],
            },
        });
        return emitResult;
    };
    NgtscProgram.prototype.makeCompilation = function () {
        var checker = this.tsProgram.getTypeChecker();
        var scopeRegistry = new annotations_1.SelectorScopeRegistry(checker, this.reflector);
        // Set up the IvyCompilation, which manages state for the Ivy transformer.
        var handlers = [
            new annotations_1.ComponentDecoratorHandler(checker, this.reflector, scopeRegistry, this.isCore, this.resourceLoader),
            new annotations_1.DirectiveDecoratorHandler(checker, this.reflector, scopeRegistry, this.isCore),
            new annotations_1.InjectableDecoratorHandler(this.reflector, this.isCore),
            new annotations_1.NgModuleDecoratorHandler(checker, this.reflector, scopeRegistry, this.isCore),
            new annotations_1.PipeDecoratorHandler(checker, this.reflector, scopeRegistry, this.isCore),
        ];
        return new transform_1.IvyCompilation(handlers, checker, this.reflector, this.coreImportsFrom);
    };
    Object.defineProperty(NgtscProgram.prototype, "reflector", {
        get: function () {
            if (this._reflector === undefined) {
                this._reflector = new metadata_1.TypeScriptReflectionHost(this.tsProgram.getTypeChecker());
            }
            return this._reflector;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgtscProgram.prototype, "coreImportsFrom", {
        get: function () {
            if (this._coreImportsFrom === undefined) {
                this._coreImportsFrom = this.isCore && getR3SymbolsFile(this.tsProgram) || null;
            }
            return this._coreImportsFrom;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgtscProgram.prototype, "isCore", {
        get: function () {
            if (this._isCore === undefined) {
                this._isCore = isAngularCorePackage(this.tsProgram);
            }
            return this._isCore;
        },
        enumerable: true,
        configurable: true
    });
    return NgtscProgram;
}());
exports.NgtscProgram = NgtscProgram;
var defaultEmitCallback = function (_a) {
    var program = _a.program, targetSourceFile = _a.targetSourceFile, writeFile = _a.writeFile, cancellationToken = _a.cancellationToken, emitOnlyDtsFiles = _a.emitOnlyDtsFiles, customTransformers = _a.customTransformers;
    return program.emit(targetSourceFile, writeFile, cancellationToken, emitOnlyDtsFiles, customTransformers);
};
function mergeEmitResults(emitResults) {
    var diagnostics = [];
    var emitSkipped = false;
    var emittedFiles = [];
    for (var _i = 0, emitResults_1 = emitResults; _i < emitResults_1.length; _i++) {
        var er = emitResults_1[_i];
        diagnostics.push.apply(diagnostics, er.diagnostics);
        emitSkipped = emitSkipped || er.emitSkipped;
        emittedFiles.push.apply(emittedFiles, (er.emittedFiles || []));
    }
    return { diagnostics: diagnostics, emitSkipped: emitSkipped, emittedFiles: emittedFiles };
}
/**
 * Find the 'r3_symbols.ts' file in the given `Program`, or return `null` if it wasn't there.
 */
function getR3SymbolsFile(program) {
    return program.getSourceFiles().find(function (file) { return file.fileName.indexOf('r3_symbols.ts') >= 0; }) || null;
}
/**
 * Determine if the given `Program` is @angular/core.
 */
function isAngularCorePackage(program) {
    // Look for its_just_angular.ts somewhere in the program.
    var r3Symbols = getR3SymbolsFile(program);
    if (r3Symbols === null) {
        return false;
    }
    // Look for the constant ITS_JUST_ANGULAR in that file.
    return r3Symbols.statements.some(function (stmt) {
        // The statement must be a variable declaration statement.
        if (!ts.isVariableStatement(stmt)) {
            return false;
        }
        // It must be exported.
        if (stmt.modifiers === undefined ||
            !stmt.modifiers.some(function (mod) { return mod.kind === ts.SyntaxKind.ExportKeyword; })) {
            return false;
        }
        // It must declare ITS_JUST_ANGULAR.
        return stmt.declarationList.declarations.some(function (decl) {
            // The declaration must match the name.
            if (!ts.isIdentifier(decl.name) || decl.name.text !== 'ITS_JUST_ANGULAR') {
                return false;
            }
            // It must initialize the variable to true.
            if (decl.initializer === undefined || decl.initializer.kind !== ts.SyntaxKind.TrueKeyword) {
                return false;
            }
            // This definition matches.
            return true;
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3JhbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvcHJvZ3JhbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBSUgsK0JBQWlDO0FBSWpDLDZDQUFzTTtBQUV0TSx1Q0FBb0Q7QUFDcEQscURBQXlFO0FBQ3pFLHlDQUFnRTtBQUVoRTtJQVNFLHNCQUNJLFNBQWdDLEVBQVUsT0FBNEIsRUFDOUQsSUFBc0IsRUFBRSxVQUF3QjtRQURkLFlBQU8sR0FBUCxPQUFPLENBQXFCO1FBQzlELFNBQUksR0FBSixJQUFJLENBQWtCO1FBUjFCLGdCQUFXLEdBQTZCLFNBQVMsQ0FBQztRQUVsRCxxQkFBZ0IsR0FBaUMsU0FBUyxDQUFDO1FBQzNELGVBQVUsR0FBdUMsU0FBUyxDQUFDO1FBQzNELFlBQU8sR0FBc0IsU0FBUyxDQUFDO1FBSzdDLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLFlBQVksS0FBSyxTQUFTLENBQUMsQ0FBQztZQUNuRCxJQUFJLG9DQUFrQixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0RCxJQUFJLG9DQUFrQixFQUFFLENBQUM7UUFFN0IsSUFBSSxDQUFDLFNBQVM7WUFDVixFQUFFLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLFVBQVUsSUFBSSxVQUFVLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQztJQUMxRixDQUFDO0lBRUQsbUNBQVksR0FBWixjQUE2QixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBRXJELDZDQUFzQixHQUF0QixVQUF1QixpQkFDUztRQUM5QixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMscUJB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