/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { identifierName } from '../compile_metadata';
import * as o from '../output/output_ast';
import { error } from '../util';
import { compileFactoryFunction, dependenciesFromGlobalMetadata } from './r3_factory';
import { Identifiers as R3 } from './r3_identifiers';
/**
 * @record
 */
export function R3PipeMetadata() { }
/** @type {?} */
R3PipeMetadata.prototype.name;
/** @type {?} */
R3PipeMetadata.prototype.type;
/** @type {?} */
R3PipeMetadata.prototype.pipeName;
/** @type {?} */
R3PipeMetadata.prototype.deps;
/** @type {?} */
R3PipeMetadata.prototype.pure;
/**
 * @record
 */
export function R3PipeDef() { }
/** @type {?} */
R3PipeDef.prototype.expression;
/** @type {?} */
R3PipeDef.prototype.type;
/**
 * @param {?} metadata
 * @return {?}
 */
export function compilePipeFromMetadata(metadata) {
    /** @type {?} */
    const definitionMapValues = [];
    // e.g. `name: 'myPipe'`
    definitionMapValues.push({ key: 'name', value: o.literal(metadata.pipeName), quoted: false });
    // e.g. `type: MyPipe`
    definitionMapValues.push({ key: 'type', value: metadata.type, quoted: false });
    /** @type {?} */
    const templateFactory = compileFactoryFunction({
        name: metadata.name,
        fnOrClass: metadata.type,
        deps: metadata.deps,
        useNew: true,
        injectFn: R3.directiveInject,
    });
    definitionMapValues.push({ key: 'factory', value: templateFactory, quoted: false });
    // e.g. `pure: true`
    definitionMapValues.push({ key: 'pure', value: o.literal(metadata.pure), quoted: false });
    /** @type {?} */
    const expression = o.importExpr(R3.definePipe).callFn([o.literalMap(definitionMapValues)]);
    /** @type {?} */
    const type = new o.ExpressionType(o.importExpr(R3.PipeDef, [
        new o.ExpressionType(metadata.type),
        new o.ExpressionType(new o.LiteralExpr(metadata.pipeName)),
    ]));
    return { expression, type };
}
/**
 * Write a pipe definition to the output context.
 * @param {?} outputCtx
 * @param {?} pipe
 * @param {?} reflector
 * @return {?}
 */
export function compilePipeFromRender2(outputCtx, pipe, reflector) {
    /** @type {?} */
    const definitionMapValues = [];
    /** @type {?} */
    const name = identifierName(pipe.type);
    if (!name) {
        return error(`Cannot resolve the name of ${pipe.type}`);
    }
    /** @type {?} */
    const metadata = {
        name,
        pipeName: pipe.name,
        type: outputCtx.importExpr(pipe.type.reference),
        deps: dependenciesFromGlobalMetadata(pipe.type, outputCtx, reflector),
        pure: pipe.pure,
    };
    /** @type {?} */
    const res = compilePipeFromMetadata(metadata);
    /** @type {?} */
    const definitionField = outputCtx.constantPool.propertyNameOf(3 /* Pipe */);
    outputCtx.statements.push(new o.ClassStmt(name, null, /* fields */ [new o.ClassField(definitionField, /* type */ o.INFERRED_TYPE, /* modifiers */ [o.StmtModifier.Static], /* initializer */ res.expression)], /* getters */ [], /* constructorMethod */ new o.ClassMethod(null, [], []), /* methods */ []));
}
//# sourceMappingURL=r3_pipe_compiler.js.map