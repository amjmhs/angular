"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module
 * @description
 * Entry point for all APIs of the compiler package.
 *
 * <div class="callout is-critical">
 *   <header>Unstable APIs</header>
 *   <p>
 *     All compiler apis are currently considered experimental and private!
 *   </p>
 *   <p>
 *     We expect the APIs in this package to keep on changing. Do not rely on them.
 *   </p>
 * </div>
 */
var core = require("./core");
exports.core = core;
__export(require("./version"));
__export(require("./template_parser/template_ast"));
var config_1 = require("./config");
exports.CompilerConfig = config_1.CompilerConfig;
exports.preserveWhitespacesDefault = config_1.preserveWhitespacesDefault;
__export(require("./compile_metadata"));
__export(require("./aot/compiler_factory"));
__export(require("./aot/compiler"));
__export(require("./aot/generated_file"));
__export(require("./aot/formatted_error"));
__export(require("./aot/static_reflector"));
__export(require("./aot/static_symbol"));
__export(require("./aot/static_symbol_resolver"));
__export(require("./aot/summary_resolver"));
var util_1 = require("./aot/util");
exports.isLoweredSymbol = util_1.isLoweredSymbol;
exports.createLoweredSymbol = util_1.createLoweredSymbol;
__export(require("./ast_path"));
__export(require("./summary_resolver"));
var identifiers_1 = require("./identifiers");
exports.Identifiers = identifiers_1.Identifiers;
var compiler_1 = require("./jit/compiler");
exports.JitCompiler = compiler_1.JitCompiler;
__export(require("./compile_reflector"));
__export(require("./url_resolver"));
__export(require("./resource_loader"));
var constant_pool_1 = require("./constant_pool");
exports.ConstantPool = constant_pool_1.ConstantPool;
var directive_resolver_1 = require("./directive_resolver");
exports.DirectiveResolver = directive_resolver_1.DirectiveResolver;
var pipe_resolver_1 = require("./pipe_resolver");
exports.PipeResolver = pipe_resolver_1.PipeResolver;
var ng_module_resolver_1 = require("./ng_module_resolver");
exports.NgModuleResolver = ng_module_resolver_1.NgModuleResolver;
var interpolation_config_1 = require("./ml_parser/interpolation_config");
exports.DEFAULT_INTERPOLATION_CONFIG = interpolation_config_1.DEFAULT_INTERPOLATION_CONFIG;
exports.InterpolationConfig = interpolation_config_1.InterpolationConfig;
__export(require("./schema/element_schema_registry"));
__export(require("./i18n/index"));
__export(require("./directive_normalizer"));
__export(require("./expression_parser/ast"));
__export(require("./expression_parser/lexer"));
__export(require("./expression_parser/parser"));
__export(require("./metadata_resolver"));
__export(require("./ml_parser/ast"));
__export(require("./ml_parser/html_parser"));
__export(require("./ml_parser/html_tags"));
__export(require("./ml_parser/interpolation_config"));
__export(require("./ml_parser/tags"));
var ng_module_compiler_1 = require("./ng_module_compiler");
exports.NgModuleCompiler = ng_module_compiler_1.NgModuleCompiler;
var output_ast_1 = require("./output/output_ast");
exports.ArrayType = output_ast_1.ArrayType;
exports.AssertNotNull = output_ast_1.AssertNotNull;
exports.BinaryOperator = output_ast_1.BinaryOperator;
exports.BinaryOperatorExpr = output_ast_1.BinaryOperatorExpr;
exports.BuiltinMethod = output_ast_1.BuiltinMethod;
exports.BuiltinType = output_ast_1.BuiltinType;
exports.BuiltinTypeName = output_ast_1.BuiltinTypeName;
exports.BuiltinVar = output_ast_1.BuiltinVar;
exports.CastExpr = output_ast_1.CastExpr;
exports.ClassField = output_ast_1.ClassField;
exports.ClassMethod = output_ast_1.ClassMethod;
exports.ClassStmt = output_ast_1.ClassStmt;
exports.CommaExpr = output_ast_1.CommaExpr;
exports.CommentStmt = output_ast_1.CommentStmt;
exports.ConditionalExpr = output_ast_1.ConditionalExpr;
exports.DeclareFunctionStmt = output_ast_1.DeclareFunctionStmt;
exports.DeclareVarStmt = output_ast_1.DeclareVarStmt;
exports.Expression = output_ast_1.Expression;
exports.ExpressionStatement = output_ast_1.ExpressionStatement;
exports.ExpressionType = output_ast_1.ExpressionType;
exports.ExternalExpr = output_ast_1.ExternalExpr;
exports.ExternalReference = output_ast_1.ExternalReference;
exports.FunctionExpr = output_ast_1.FunctionExpr;
exports.IfStmt = output_ast_1.IfStmt;
exports.InstantiateExpr = output_ast_1.InstantiateExpr;
exports.InvokeFunctionExpr = output_ast_1.InvokeFunctionExpr;
exports.InvokeMethodExpr = output_ast_1.InvokeMethodExpr;
exports.JSDocCommentStmt = output_ast_1.JSDocCommentStmt;
exports.LiteralArrayExpr = output_ast_1.LiteralArrayExpr;
exports.LiteralExpr = output_ast_1.LiteralExpr;
exports.LiteralMapExpr = output_ast_1.LiteralMapExpr;
exports.MapType = output_ast_1.MapType;
exports.NotExpr = output_ast_1.NotExpr;
exports.ReadKeyExpr = output_ast_1.ReadKeyExpr;
exports.ReadPropExpr = output_ast_1.ReadPropExpr;
exports.ReadVarExpr = output_ast_1.ReadVarExpr;
exports.ReturnStatement = output_ast_1.ReturnStatement;
exports.ThrowStmt = output_ast_1.ThrowStmt;
exports.TryCatchStmt = output_ast_1.TryCatchStmt;
exports.Type = output_ast_1.Type;
exports.WrappedNodeExpr = output_ast_1.WrappedNodeExpr;
exports.WriteKeyExpr = output_ast_1.WriteKeyExpr;
exports.WritePropExpr = output_ast_1.WritePropExpr;
exports.WriteVarExpr = output_ast_1.WriteVarExpr;
exports.StmtModifier = output_ast_1.StmtModifier;
exports.Statement = output_ast_1.Statement;
exports.TypeofExpr = output_ast_1.TypeofExpr;
exports.collectExternalReferences = output_ast_1.collectExternalReferences;
var abstract_emitter_1 = require("./output/abstract_emitter");
exports.EmitterVisitorContext = abstract_emitter_1.EmitterVisitorContext;
__export(require("./output/ts_emitter"));
__export(require("./parse_util"));
__export(require("./schema/dom_element_schema_registry"));
__export(require("./selector"));
__export(require("./style_compiler"));
__export(require("./template_parser/template_parser"));
var view_compiler_1 = require("./view_compiler/view_compiler");
exports.ViewCompiler = view_compiler_1.ViewCompiler;
var util_2 = require("./util");
exports.getParseErrors = util_2.getParseErrors;
exports.isSyntaxError = util_2.isSyntaxError;
exports.syntaxError = util_2.syntaxError;
exports.Version = util_2.Version;
__export(require("./injectable_compiler_2"));
var r3_jit_1 = require("./render3/r3_jit");
exports.jitExpression = r3_jit_1.jitExpression;
var r3_factory_1 = require("./render3/r3_factory");
exports.R3ResolvedDependencyType = r3_factory_1.R3ResolvedDependencyType;
var r3_module_compiler_1 = require("./render3/r3_module_compiler");
exports.compileInjector = r3_module_compiler_1.compileInjector;
exports.compileNgModule = r3_module_compiler_1.compileNgModule;
var r3_pipe_compiler_1 = require("./render3/r3_pipe_compiler");
exports.compilePipeFromMetadata = r3_pipe_compiler_1.compilePipeFromMetadata;
var template_1 = require("./render3/view/template");
exports.makeBindingParser = template_1.makeBindingParser;
exports.parseTemplate = template_1.parseTemplate;
var compiler_2 = require("./render3/view/compiler");
exports.compileComponentFromMetadata = compiler_2.compileComponentFromMetadata;
exports.compileDirectiveFromMetadata = compiler_2.compileDirectiveFromMetadata;
exports.parseHostBindings = compiler_2.parseHostBindings;
// This file only reexports content of the `src` folder. Keep it that way.
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci9zcmMvY29tcGlsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7QUFFSDs7Ozs7Ozs7Ozs7Ozs7R0FjRztBQUVILDZCQUErQjtBQUV2QixvQkFBSTtBQUVaLCtCQUEwQjtBQUMxQixvREFBK0M7QUFDL0MsbUNBQW9FO0FBQTVELGtDQUFBLGNBQWMsQ0FBQTtBQUFFLDhDQUFBLDBCQUEwQixDQUFBO0FBQ2xELHdDQUFtQztBQUNuQyw0Q0FBdUM7QUFDdkMsb0NBQStCO0FBQy9CLDBDQUFxQztBQUdyQywyQ0FBc0M7QUFFdEMsNENBQXVDO0FBQ3ZDLHlDQUFvQztBQUNwQyxrREFBNkM7QUFDN0MsNENBQXVDO0FBQ3ZDLG1DQUFnRTtBQUF4RCxpQ0FBQSxlQUFlLENBQUE7QUFBRSxxQ0FBQSxtQkFBbUIsQ0FBQTtBQUU1QyxnQ0FBMkI7QUFDM0Isd0NBQW1DO0FBQ25DLDZDQUEwQztBQUFsQyxvQ0FBQSxXQUFXLENBQUE7QUFDbkIsMkNBQTJDO0FBQW5DLGlDQUFBLFdBQVcsQ0FBQTtBQUNuQix5Q0FBb0M7QUFDcEMsb0NBQStCO0FBQy9CLHVDQUFrQztBQUNsQyxpREFBNkM7QUFBckMsdUNBQUEsWUFBWSxDQUFBO0FBQ3BCLDJEQUF1RDtBQUEvQyxpREFBQSxpQkFBaUIsQ0FBQTtBQUN6QixpREFBNkM7QUFBckMsdUNBQUEsWUFBWSxDQUFBO0FBQ3BCLDJEQUFzRDtBQUE5QyxnREFBQSxnQkFBZ0IsQ0FBQTtBQUN4Qix5RUFBbUc7QUFBM0YsOERBQUEsNEJBQTRCLENBQUE7QUFBRSxxREFBQSxtQkFBbUIsQ0FBQTtBQUN6RCxzREFBaUQ7QUFDakQsa0NBQTZCO0FBQzdCLDRDQUF1QztBQUN2Qyw2Q0FBd0M7QUFDeEMsK0NBQTBDO0FBQzFDLGdEQUEyQztBQUMzQyx5Q0FBb0M7QUFDcEMscUNB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