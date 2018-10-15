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
var r3_identifiers_1 = require("./r3_identifiers");
/**
 * Write a Renderer2 compatibility module factory to the output context.
 */
function compileModuleFactory(outputCtx, module, backPatchReferenceOf, resolver) {
    var ngModuleFactoryVar = compile_metadata_1.identifierName(module.type) + "NgFactory";
    var parentInjector = 'parentInjector';
    var createFunction = o.fn([new o.FnParam(parentInjector, o.DYNAMIC_TYPE)], [new o.IfStmt(o.THIS_EXPR.prop(r3_identifiers_1.Identifiers.PATCH_DEPS).notIdentical(o.literal(true, o.INFERRED_TYPE)), [
            o.THIS_EXPR.prop(r3_identifiers_1.Identifiers.PATCH_DEPS).set(o.literal(true, o.INFERRED_TYPE)).toStmt(),
            backPatchReferenceOf(module.type).callFn([]).toStmt()
        ])], o.INFERRED_TYPE, null, ngModuleFactoryVar + "_Create");
    var moduleFactoryLiteral = o.literalMap([
        { key: 'moduleType', value: outputCtx.importExpr(module.type.reference), quoted: false },
        { key: 'create', value: createFunction, quoted: false }
    ]);
    outputCtx.statements.push(o.variable(ngModuleFactoryVar).set(moduleFactoryLiteral).toDeclStmt(o.DYNAMIC_TYPE, [
        o.StmtModifier.Exported, o.StmtModifier.Final
    ]));
}
exports.compileModuleFactory = compileModuleFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicjNfbW9kdWxlX2ZhY3RvcnlfY29tcGlsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci9zcmMvcmVuZGVyMy9yM19tb2R1bGVfZmFjdG9yeV9jb21waWxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHdEQUFpRztBQUVqRyx3Q0FBMEM7QUFHMUMsbURBQW1EO0FBRW5EOztHQUVHO0FBQ0gsOEJBQ0ksU0FBd0IsRUFBRSxNQUErQixFQUN6RCxvQkFBbUUsRUFDbkUsUUFBaUM7SUFDbkMsSUFBTSxrQkFBa0IsR0FBTSxpQ0FBYyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBVyxDQUFDO0lBRXJFLElBQU0sY0FBYyxHQUFHLGdCQUFnQixDQUFDO0lBQ3hDLElBQU0sY0FBYyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQ3ZCLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsRUFDL0MsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQ1QsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsNEJBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLEVBQzlFO1lBQ0UsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsNEJBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFO1lBQzlFLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFO1NBQ3RELENBQUMsQ0FBQyxFQUNQLENBQUMsQ0FBQyxhQUFhLEVBQUUsSUFBSSxFQUFLLGtCQUFrQixZQUFTLENBQUMsQ0FBQztJQUUzRCxJQUFNLG9CQUFvQixHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUM7UUFDeEMsRUFBQyxHQUFHLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxTQUFTLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBQztRQUN0RixFQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFDO0tBQ3RELENBQUMsQ0FBQztJQUVILFNBQVMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUNyQixDQUFDLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxZQUFZLEVBQUU7UUFDbEYsQ0FBQyxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxLQUFLO0tBQzlDLENBQUMsQ0FBQyxDQUFDO0FBQ1YsQ0FBQztBQTFCRCxvREEwQkMifQ==