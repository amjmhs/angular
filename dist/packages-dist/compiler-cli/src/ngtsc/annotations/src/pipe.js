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
const metadata_1 = require("../../metadata");
const util_1 = require("./util");
class PipeDecoratorHandler {
    constructor(checker, reflector, scopeRegistry, isCore) {
        this.checker = checker;
        this.reflector = reflector;
        this.scopeRegistry = scopeRegistry;
        this.isCore = isCore;
    }
    detect(decorator) {
        return decorator.find(decorator => decorator.name === 'Pipe' && (this.isCore || util_1.isAngularCore(decorator)));
    }
    analyze(clazz, decorator) {
        if (clazz.name === undefined) {
            throw new Error(`@Pipes must have names`);
        }
        const name = clazz.name.text;
        const type = new compiler_1.WrappedNodeExpr(clazz.name);
        if (decorator.args === null) {
            throw new Error(`@Pipe must be called`);
        }
        const meta = util_1.unwrapExpression(decorator.args[0]);
        if (!ts.isObjectLiteralExpression(meta)) {
            throw new Error(`Decorator argument must be literal.`);
        }
        const pipe = metadata_1.reflectObjectLiteral(meta);
        if (!pipe.has('name')) {
            throw new Error(`@Pipe decorator is missing name field`);
        }
        const pipeName = metadata_1.staticallyResolve(pipe.get('name'), this.reflector, this.checker);
        if (typeof pipeName !== 'string') {
            throw new Error(`@Pipe.name must be a string`);
        }
        this.scopeRegistry.registerPipe(clazz, pipeName);
        let pure = true;
        if (pipe.has('pure')) {
            const pureValue = metadata_1.staticallyResolve(pipe.get('pure'), this.reflector, this.checker);
            if (typeof pureValue !== 'boolean') {
                throw new Error(`@Pipe.pure must be a boolean`);
            }
            pure = pureValue;
        }
        return {
            analysis: {
                name,
                type,
                pipeName,
                deps: util_1.getConstructorDependencies(clazz, this.reflector, this.isCore), pure,
            }
        };
    }
    compile(node, analysis) {
        const res = compiler_1.compilePipeFromMetadata(analysis);
        return {
            name: 'ngPipeDef',
            initializer: res.expression,
            statements: [],
            type: res.type,
        };
    }
}
exports.PipeDecoratorHandler = PipeDecoratorHandler;
//# sourceMappingURL=pipe.js.map