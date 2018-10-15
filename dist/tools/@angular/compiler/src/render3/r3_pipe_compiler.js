"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var compile_metadata_1 = require("../compile_metadata");
var o = require("../output/output_ast");
var util_1 = require("../util");
var r3_factory_1 = require("./r3_factory");
var r3_identifiers_1 = require("./r3_identifiers");
function compilePipeFromMetadata(metadata) {
    var definitionMapValues = [];
    // e.g. `name: 'myPipe'`
    definitionMapValues.push({ key: 'name', value: o.literal(metadata.pipeName), quoted: false });
    // e.g. `type: MyPipe`
    definitionMapValues.push({ key: 'type', value: metadata.type, quoted: false });
    var templateFactory = r3_factory_1.compileFactoryFunction({
        name: metadata.name,
        fnOrClass: metadata.type,
        deps: metadata.deps,
        useNew: true,
        injectFn: r3_identifiers_1.Identifiers.directiveInject,
    });
    definitionMapValues.push({ key: 'factory', value: templateFactory, quoted: false });
    // e.g. `pure: true`
    definitionMapValues.push({ key: 'pure', value: o.literal(metadata.pure), quoted: false });
    var expression = o.importExpr(r3_identifiers_1.Identifiers.definePipe).callFn([o.literalMap(definitionMapValues)]);
    var type = new o.ExpressionType(o.importExpr(r3_identifiers_1.Identifiers.PipeDef, [
        new o.ExpressionType(metadata.type),
        new o.ExpressionType(new o.LiteralExpr(metadata.pipeName)),
    ]));
    return { expression: expression, type: type };
}
exports.compilePipeFromMetadata = compilePipeFromMetadata;
/**
 * Write a pipe definition to the output context.
 */
function compilePipeFromRender2(outputCtx, pipe, reflector) {
    var definitionMapValues = [];
    var name = compile_metadata_1.identifierName(pipe.type);
    if (!name) {
        return util_1.error("Cannot resolve the name of " + pipe.type);
    }
    var metadata = {
        name: name,
        pipeName: pipe.name,
        type: outputCtx.importExpr(pipe.type.reference),
        deps: r3_factory_1.dependenciesFromGlobalMetadata(pipe.type, outputCtx, reflector),
        pure: pipe.pure,
    };
    var res = compilePipeFromMetadata(metadata);
    var definitionField = outputCtx.constantPool.propertyNameOf(3 /* Pipe */);
    outputCtx.statements.push(new o.ClassStmt(
    /* name */ name, 
    /* parent */ null, 
    /* fields */ [new o.ClassField(
        /* name */ definitionField, 
        /* type */ o.INFERRED_TYPE, 
        /* modifiers */ [o.StmtModifier.Static], 
        /* initializer */ res.expression)], 
    /* getters */ [], 
    /* constructorMethod */ new o.ClassMethod(null, [], []), 
    /* methods */ []));
}
exports.compilePipeFromRender2 = compilePipeFromRender2;
//# sourceMappingURL=r3_pipe_compiler.js.map