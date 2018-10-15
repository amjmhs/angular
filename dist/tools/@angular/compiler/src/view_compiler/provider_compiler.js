"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var identifiers_1 = require("../identifiers");
var lifecycle_reflector_1 = require("../lifecycle_reflector");
var o = require("../output/output_ast");
var value_util_1 = require("../output/value_util");
var template_ast_1 = require("../template_parser/template_ast");
function providerDef(ctx, providerAst) {
    var flags = 0 /* None */;
    if (!providerAst.eager) {
        flags |= 4096 /* LazyProvider */;
    }
    if (providerAst.providerType === template_ast_1.ProviderAstType.PrivateService) {
        flags |= 8192 /* PrivateProvider */;
    }
    if (providerAst.isModule) {
        flags |= 1073741824 /* TypeModuleProvider */;
    }
    providerAst.lifecycleHooks.forEach(function (lifecycleHook) {
        // for regular providers, we only support ngOnDestroy
        if (lifecycleHook === lifecycle_reflector_1.LifecycleHooks.OnDestroy ||
            providerAst.providerType === template_ast_1.ProviderAstType.Directive ||
            providerAst.providerType === template_ast_1.ProviderAstType.Component) {
            flags |= lifecycleHookToNodeFlag(lifecycleHook);
        }
    });
    var _a = providerAst.multiProvider ?
        multiProviderDef(ctx, flags, providerAst.providers) :
        singleProviderDef(ctx, flags, providerAst.providerType, providerAst.providers[0]), providerExpr = _a.providerExpr, providerFlags = _a.flags, depsExpr = _a.depsExpr;
    return {
        providerExpr: providerExpr,
        flags: providerFlags, depsExpr: depsExpr,
        tokenExpr: tokenExpr(ctx, providerAst.token),
    };
}
exports.providerDef = providerDef;
function multiProviderDef(ctx, flags, providers) {
    var allDepDefs = [];
    var allParams = [];
    var exprs = providers.map(function (provider, providerIndex) {
        var expr;
        if (provider.useClass) {
            var depExprs = convertDeps(providerIndex, provider.deps || provider.useClass.diDeps);
            expr = ctx.importExpr(provider.useClass.reference).instantiate(depExprs);
        }
        else if (provider.useFactory) {
            var depExprs = convertDeps(providerIndex, provider.deps || provider.useFactory.diDeps);
            expr = ctx.importExpr(provider.useFactory.reference).callFn(depExprs);
        }
        else if (provider.useExisting) {
            var depExprs = convertDeps(providerIndex, [{ token: provider.useExisting }]);
            expr = depExprs[0];
        }
        else {
            expr = value_util_1.convertValueToOutputAst(ctx, provider.useValue);
        }
        return expr;
    });
    var providerExpr = o.fn(allParams, [new o.ReturnStatement(o.literalArr(exprs))], o.INFERRED_TYPE);
    return {
        providerExpr: providerExpr,
        flags: flags | 1024 /* TypeFactoryProvider */,
        depsExpr: o.literalArr(allDepDefs)
    };
    function convertDeps(providerIndex, deps) {
        return deps.map(function (dep, depIndex) {
            var paramName = "p" + providerIndex + "_" + depIndex;
            allParams.push(new o.FnParam(paramName, o.DYNAMIC_TYPE));
            allDepDefs.push(depDef(ctx, dep));
            return o.variable(paramName);
        });
    }
}
function singleProviderDef(ctx, flags, providerType, providerMeta) {
    var providerExpr;
    var deps;
    if (providerType === template_ast_1.ProviderAstType.Directive || providerType === template_ast_1.ProviderAstType.Component) {
        providerExpr = ctx.importExpr(providerMeta.useClass.reference);
        flags |= 16384 /* TypeDirective */;
        deps = providerMeta.deps || providerMeta.useClass.diDeps;
    }
    else {
        if (providerMeta.useClass) {
            providerExpr = ctx.importExpr(providerMeta.useClass.reference);
            flags |= 512 /* TypeClassProvider */;
            deps = providerMeta.deps || providerMeta.useClass.diDeps;
        }
        else if (providerMeta.useFactory) {
            providerExpr = ctx.importExpr(providerMeta.useFactory.reference);
            flags |= 1024 /* TypeFactoryProvider */;
            deps = providerMeta.deps || providerMeta.useFactory.diDeps;
        }
        else if (providerMeta.useExisting) {
            providerExpr = o.NULL_EXPR;
            flags |= 2048 /* TypeUseExistingProvider */;
            deps = [{ token: providerMeta.useExisting }];
        }
        else {
            providerExpr = value_util_1.convertValueToOutputAst(ctx, providerMeta.useValue);
            flags |= 256 /* TypeValueProvider */;
            deps = [];
        }
    }
    var depsExpr = o.literalArr(deps.map(function (dep) { return depDef(ctx, dep); }));
    return { providerExpr: providerExpr, flags: flags, depsExpr: depsExpr };
}
function tokenExpr(ctx, tokenMeta) {
    return tokenMeta.identifier ? ctx.importExpr(tokenMeta.identifier.reference) :
        o.literal(tokenMeta.value);
}
function depDef(ctx, dep) {
    // Note: the following fields have already been normalized out by provider_analyzer:
    // - isAttribute, isHost
    var expr = dep.isValue ? value_util_1.convertValueToOutputAst(ctx, dep.value) : tokenExpr(ctx, dep.token);
    var flags = 0 /* None */;
    if (dep.isSkipSelf) {
        flags |= 1 /* SkipSelf */;
    }
    if (dep.isOptional) {
        flags |= 2 /* Optional */;
    }
    if (dep.isSelf) {
        flags |= 4 /* Self */;
    }
    if (dep.isValue) {
        flags |= 8 /* Value */;
    }
    return flags === 0 /* None */ ? expr : o.literalArr([o.literal(flags), expr]);
}
exports.depDef = depDef;
function lifecycleHookToNodeFlag(lifecycleHook) {
    var nodeFlag = 0 /* None */;
    switch (lifecycleHook) {
        case lifecycle_reflector_1.LifecycleHooks.AfterContentChecked:
            nodeFlag = 2097152 /* AfterContentChecked */;
            break;
        case lifecycle_reflector_1.LifecycleHooks.AfterContentInit:
            nodeFlag = 1048576 /* AfterContentInit */;
            break;
        case lifecycle_reflector_1.LifecycleHooks.AfterViewChecked:
            nodeFlag = 8388608 /* AfterViewChecked */;
            break;
        case lifecycle_reflector_1.LifecycleHooks.AfterViewInit:
            nodeFlag = 4194304 /* AfterViewInit */;
            break;
        case lifecycle_reflector_1.LifecycleHooks.DoCheck:
            nodeFlag = 262144 /* DoCheck */;
            break;
        case lifecycle_reflector_1.LifecycleHooks.OnChanges:
            nodeFlag = 524288 /* OnChanges */;
            break;
        case lifecycle_reflector_1.LifecycleHooks.OnDestroy:
            nodeFlag = 131072 /* OnDestroy */;
            break;
        case lifecycle_reflector_1.LifecycleHooks.OnInit:
            nodeFlag = 65536 /* OnInit */;
            break;
    }
    return nodeFlag;
}
exports.lifecycleHookToNodeFlag = lifecycleHookToNodeFlag;
function componentFactoryResolverProviderDef(reflector, ctx, flags, entryComponents) {
    var entryComponentFactories = entryComponents.map(function (entryComponent) { return ctx.importExpr(entryComponent.componentFactory); });
    var token = identifiers_1.createTokenForExternalReference(reflector, identifiers_1.Identifiers.ComponentFactoryResolver);
    var classMeta = {
        diDeps: [
            { isValue: true, value: o.literalArr(entryComponentFactories) },
            { token: token, isSkipSelf: true, isOptional: true },
            { token: identifiers_1.createTokenForExternalReference(reflector, identifiers_1.Identifiers.NgModuleRef) },
        ],
        lifecycleHooks: [],
        reference: reflector.resolveExternalReference(identifiers_1.Identifiers.CodegenComponentFactoryResolver)
    };
    var _a = singleProviderDef(ctx, flags, template_ast_1.ProviderAstType.PrivateService, {
        token: token,
        multi: false,
        useClass: classMeta,
    }), providerExpr = _a.providerExpr, providerFlags = _a.flags, depsExpr = _a.depsExpr;
    return { providerExpr: providerExpr, flags: providerFlags, depsExpr: depsExpr, tokenExpr: tokenExpr(ctx, token) };
}
exports.componentFactoryResolverProviderDef = componentFactoryResolverProviderDef;
//# sourceMappingURL=provider_compiler.js.map