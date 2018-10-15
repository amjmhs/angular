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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvdmlkZXJfY29tcGlsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci9zcmMvdmlld19jb21waWxlci9wcm92aWRlcl9jb21waWxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUtILDhDQUE0RTtBQUM1RSw4REFBc0Q7QUFDdEQsd0NBQTBDO0FBQzFDLG1EQUE2RDtBQUM3RCxnRUFBNkU7QUFHN0UscUJBQTRCLEdBQWtCLEVBQUUsV0FBd0I7SUFNdEUsSUFBSSxLQUFLLGVBQWlCLENBQUM7SUFDM0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUU7UUFDdEIsS0FBSywyQkFBMEIsQ0FBQztLQUNqQztJQUNELElBQUksV0FBVyxDQUFDLFlBQVksS0FBSyw4QkFBZSxDQUFDLGNBQWMsRUFBRTtRQUMvRCxLQUFLLDhCQUE2QixDQUFDO0tBQ3BDO0lBQ0QsSUFBSSxXQUFXLENBQUMsUUFBUSxFQUFFO1FBQ3hCLEtBQUssdUNBQWdDLENBQUM7S0FDdkM7SUFDRCxXQUFXLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxVQUFDLGFBQWE7UUFDL0MscURBQXFEO1FBQ3JELElBQUksYUFBYSxLQUFLLG9DQUFjLENBQUMsU0FBUztZQUMxQyxXQUFXLENBQUMsWUFBWSxLQUFLLDhCQUFlLENBQUMsU0FBUztZQUN0RCxXQUFXLENBQUMsWUFBWSxLQUFLLDhCQUFlLENBQUMsU0FBUyxFQUFFO1lBQzFELEtBQUssSUFBSSx1QkFBdUIsQ0FBQyxhQUFhLENBQUMsQ0FBQztTQUNqRDtJQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0csSUFBQTs7eUZBRStFLEVBRjlFLDhCQUFZLEVBQUUsd0JBQW9CLEVBQUUsc0JBQVEsQ0FFbUM7SUFDdEYsT0FBTztRQUNMLFlBQVksY0FBQTtRQUNaLEtBQUssRUFBRSxhQUFhLEVBQUUsUUFBUSxVQUFBO1FBQzlCLFNBQVMsRUFB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