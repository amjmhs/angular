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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicjNfcGlwZV9jb21waWxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9yZW5kZXIzL3IzX3BpcGVfY29tcGlsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCx3REFBd0U7QUFHeEUsd0NBQTBDO0FBQzFDLGdDQUE2QztBQUU3QywyQ0FBMEc7QUFDMUcsbURBQW1EO0FBZW5ELGlDQUF3QyxRQUF3QjtJQUM5RCxJQUFNLG1CQUFtQixHQUEwRCxFQUFFLENBQUM7SUFFdEYsd0JBQXdCO0lBQ3hCLG1CQUFtQixDQUFDLElBQUksQ0FBQyxFQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO0lBRTVGLHNCQUFzQjtJQUN0QixtQkFBbUIsQ0FBQyxJQUFJLENBQUMsRUFBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO0lBRTdFLElBQU0sZUFBZSxHQUFHLG1DQUFzQixDQUFDO1FBQzdDLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSTtRQUNuQixTQUFTLEVBQUUsUUFBUSxDQUFDLElBQUk7UUFDeEIsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJO1FBQ25CLE1BQU0sRUFBRSxJQUFJO1FBQ1osUUFBUSxFQUFFLDRCQUFFLENBQUMsZUFBZTtLQUM3QixDQUFDLENBQUM7SUFDSCxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsRUFBQyxHQUFHLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxlQUFlLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7SUFFbEYsb0JBQW9CO0lBQ3BCLG1CQUFtQixDQUFDLElBQUksQ0FBQyxFQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO0lBRXhGLElBQU0sVUFBVSxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsNEJBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzNGLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLDRCQUFFLENBQUMsT0FBTyxFQUFFO1FBQ3pELElBQUksQ0FBQyxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO1FBQ25DLElBQUksQ0FBQyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQzNELENBQUMsQ0FBQyxDQUFDO0lBQ0osT0FBTyxFQUFDLFVBQVUsWUFBQSxFQUFFLElBQUksTUFBQSxFQUFDLENBQUM7QUFDNUIsQ0FBQztBQTNCRCwwREEyQkM7QUFFRDs7R0FFRztBQUNILGdDQUNJLFNBQXdCLEVBQUUsSUFBeUIsRUFBRSxTQUEyQjtJQUNsRixJQUFNLG1CQUFtQixHQUEwRCxFQUFFLENBQUM7SUFFdEYsSUFBTSxJQUFJLEdBQUcsaUNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdkMsSUFBSSxDQUFDLElBQUksRUFBRTtRQUNULE9BQU8sWUFBSyxDQUFDLGdDQUE4QixJQUFJLENBQUMsSUFBTSxDQUFDLENBQUM7S0FDekQ7SUFFRCxJQUFNLFFBQVEsR0FBbUI7UUFDL0IsSUFBSSxNQUFBO1FBQ0osUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJO1FBQ25CLElBQUksRUFBRSxTQUFTLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQy9DLElBQUksRUFBRSwyQ0FBOEIsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUM7UUFDckUsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO0tBQ2hCLENBQUM7SUFFRixJQUFNLEdBQUcsR0FBRyx1QkFBdUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUU5QyxJQUFNLGVBQWUsR0FBRyxTQUFTLENBQUMsWUFBWSxDQUFDLGNBQWMsY0FBcUIsQ0FBQztJQUVuRixTQUFTLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTO0lBQ3JDLFVBQVUsQ0FBQyxJQUFJO0lBQ2YsWUFBWSxDQUFDLElBQUk7SUFDakIsWUFBWSxDQUFBLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVTtRQUN6QixVQUFVLENBQUMsZUFBZTtRQUMxQixVQUFVLENBQUMsQ0FBQyxDQUFDLGFBQWE7UUFDMUIsZUFBZSxDQUFBLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUM7UUFDdEMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3RDLGFBQWEsQ0FBQSxFQUFFO0lBQ2YsdUJBQXVCLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO0lBQ3ZELGFBQWEsQ0FBQSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3hCLENBQUM7QUFoQ0Qsd0RBZ0NDIn0=