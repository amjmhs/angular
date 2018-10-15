"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ts = require("typescript");
const annotations_1 = require("./annotations");
const metadata_1 = require("./metadata");
const resource_loader_1 = require("./resource_loader");
const transform_1 = require("./transform");
class NgtscProgram {
    constructor(rootNames, options, host, oldProgram) {
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
    getTsProgram() { return this.tsProgram; }
    getTsOptionDiagnostics(cancellationToken) {
        return this.tsProgram.getOptionsDiagnostics(cancellationToken);
    }
    getNgOptionDiagnostics(cancellationToken) {
        return [];
    }
    getTsSyntacticDiagnostics(sourceFile, cancellationToken) {
        return this.tsProgram.getSyntacticDiagnostics(sourceFile, cancellationToken);
    }
    getNgStructuralDiagnostics(cancellationToken) {
        return [];
    }
    getTsSemanticDiagnostics(sourceFile, cancellationToken) {
        return this.tsProgram.getSemanticDiagnostics(sourceFile, cancellationToken);
    }
    getNgSemanticDiagnostics(fileName, cancellationToken) {
        return [];
    }
    loadNgStructureAsync() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.compilation === undefined) {
                this.compilation = this.makeCompilation();
                yield this.tsProgram.getSourceFiles()
                    .filter(file => !file.fileName.endsWith('.d.ts'))
                    .map(file => this.compilation.analyzeAsync(file))
                    .filter((result) => result !== undefined);
            }
        });
    }
    listLazyRoutes(entryRoute) {
        throw new Error('Method not implemented.');
    }
    getLibrarySummaries() {
        throw new Error('Method not implemented.');
    }
    getEmittedGeneratedFiles() {
        throw new Error('Method not implemented.');
    }
    getEmittedSourceFiles() {
        throw new Error('Method not implemented.');
    }
    emit(opts) {
        const emitCallback = opts && opts.emitCallback || defaultEmitCallback;
        if (this.compilation === undefined) {
            this.compilation = this.makeCompilation();
            this.tsProgram.getSourceFiles()
                .filter(file => !file.fileName.endsWith('.d.ts'))
                .forEach(file => this.compilation.analyzeSync(file));
        }
        // Since there is no .d.ts transformation API, .d.ts files are transformed during write.
        const writeFile = (fileName, data, writeByteOrderMark, onError, sourceFiles) => {
            if (fileName.endsWith('.d.ts')) {
                data = sourceFiles.reduce((data, sf) => this.compilation.transformedDtsFor(sf.fileName, data, fileName), data);
            }
            this.host.writeFile(fileName, data, writeByteOrderMark, onError, sourceFiles);
        };
        // Run the emit, including a custom transformer that will downlevel the Ivy decorators in code.
        const emitResult = emitCallback({
            program: this.tsProgram,
            host: this.host,
            options: this.options,
            emitOnlyDtsFiles: false, writeFile,
            customTransformers: {
                before: [transform_1.ivyTransformFactory(this.compilation, this.reflector, this.coreImportsFrom)],
            },
        });
        return emitResult;
    }
    makeCompilation() {
        const checker = this.tsProgram.getTypeChecker();
        const scopeRegistry = new annotations_1.SelectorScopeRegistry(checker, this.reflector);
        // Set up the IvyCompilation, which manages state for the Ivy transformer.
        const handlers = [
            new annotations_1.ComponentDecoratorHandler(checker, this.reflector, scopeRegistry, this.isCore, this.resourceLoader),
            new annotations_1.DirectiveDecoratorHandler(checker, this.reflector, scopeRegistry, this.isCore),
            new annotations_1.InjectableDecoratorHandler(this.reflector, this.isCore),
            new annotations_1.NgModuleDecoratorHandler(checker, this.reflector, scopeRegistry, this.isCore),
            new annotations_1.PipeDecoratorHandler(checker, this.reflector, scopeRegistry, this.isCore),
        ];
        return new transform_1.IvyCompilation(handlers, checker, this.reflector, this.coreImportsFrom);
    }
    get reflector() {
        if (this._reflector === undefined) {
            this._reflector = new metadata_1.TypeScriptReflectionHost(this.tsProgram.getTypeChecker());
        }
        return this._reflector;
    }
    get coreImportsFrom() {
        if (this._coreImportsFrom === undefined) {
            this._coreImportsFrom = this.isCore && getR3SymbolsFile(this.tsProgram) || null;
        }
        return this._coreImportsFrom;
    }
    get isCore() {
        if (this._isCore === undefined) {
            this._isCore = isAngularCorePackage(this.tsProgram);
        }
        return this._isCore;
    }
}
exports.NgtscProgram = NgtscProgram;
const defaultEmitCallback = ({ program, targetSourceFile, writeFile, cancellationToken, emitOnlyDtsFiles, customTransformers }) => program.emit(targetSourceFile, writeFile, cancellationToken, emitOnlyDtsFiles, customTransformers);
function mergeEmitResults(emitResults) {
    const diagnostics = [];
    let emitSkipped = false;
    const emittedFiles = [];
    for (const er of emitResults) {
        diagnostics.push(...er.diagnostics);
        emitSkipped = emitSkipped || er.emitSkipped;
        emittedFiles.push(...(er.emittedFiles || []));
    }
    return { diagnostics, emitSkipped, emittedFiles };
}
/**
 * Find the 'r3_symbols.ts' file in the given `Program`, or return `null` if it wasn't there.
 */
function getR3SymbolsFile(program) {
    return program.getSourceFiles().find(file => file.fileName.indexOf('r3_symbols.ts') >= 0) || null;
}
/**
 * Determine if the given `Program` is @angular/core.
 */
function isAngularCorePackage(program) {
    // Look for its_just_angular.ts somewhere in the program.
    const r3Symbols = getR3SymbolsFile(program);
    if (r3Symbols === null) {
        return false;
    }
    // Look for the constant ITS_JUST_ANGULAR in that file.
    return r3Symbols.statements.some(stmt => {
        // The statement must be a variable declaration statement.
        if (!ts.isVariableStatement(stmt)) {
            return false;
        }
        // It must be exported.
        if (stmt.modifiers === undefined ||
            !stmt.modifiers.some(mod => mod.kind === ts.SyntaxKind.ExportKeyword)) {
            return false;
        }
        // It must declare ITS_JUST_ANGULAR.
        return stmt.declarationList.declarations.some(decl => {
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
//# sourceMappingURL=program.js.map