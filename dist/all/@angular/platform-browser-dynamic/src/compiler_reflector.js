"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_1 = require("@angular/compiler");
var core_1 = require("@angular/core");
exports.MODULE_SUFFIX = '';
var builtinExternalReferences = createBuiltinExternalReferencesMap();
var JitReflector = /** @class */ (function () {
    function JitReflector() {
        this.builtinExternalReferences = new Map();
        this.reflectionCapabilities = new core_1.ɵReflectionCapabilities();
    }
    JitReflector.prototype.componentModuleUrl = function (type, cmpMetadata) {
        var moduleId = cmpMetadata.moduleId;
        if (typeof moduleId === 'string') {
            var scheme = compiler_1.getUrlScheme(moduleId);
            return scheme ? moduleId : "package:" + moduleId + exports.MODULE_SUFFIX;
        }
        else if (moduleId !== null && moduleId !== void 0) {
            throw compiler_1.syntaxError("moduleId should be a string in \"" + core_1.ɵstringify(type) + "\". See https://goo.gl/wIDDiL for more information.\n" +
                "If you're using Webpack you should inline the template and the styles, see https://goo.gl/X2J8zc.");
        }
        return "./" + core_1.ɵstringify(type);
    };
    JitReflector.prototype.parameters = function (typeOrFunc) {
        return this.reflectionCapabilities.parameters(typeOrFunc);
    };
    JitReflector.prototype.tryAnnotations = function (typeOrFunc) { return this.annotations(typeOrFunc); };
    JitReflector.prototype.annotations = function (typeOrFunc) {
        return this.reflectionCapabilities.annotations(typeOrFunc);
    };
    JitReflector.prototype.shallowAnnotations = function (typeOrFunc) {
        throw new Error('Not supported in JIT mode');
    };
    JitReflector.prototype.propMetadata = function (typeOrFunc) {
        return this.reflectionCapabilities.propMetadata(typeOrFunc);
    };
    JitReflector.prototype.hasLifecycleHook = function (type, lcProperty) {
        return this.reflectionCapabilities.hasLifecycleHook(type, lcProperty);
    };
    JitReflector.prototype.guards = function (type) { return this.reflectionCapabilities.guards(type); };
    JitReflector.prototype.resolveExternalReference = function (ref) {
        return builtinExternalReferences.get(ref) || ref.runtime;
    };
    return JitReflector;
}());
exports.JitReflector = JitReflector;
function createBuiltinExternalReferencesMap() {
    var map = new Map();
    map.set(compiler_1.Identifiers.ANALYZE_FOR_ENTRY_COMPONENTS, core_1.ANALYZE_FOR_ENTRY_COMPONENTS);
    map.set(compiler_1.Identifiers.ElementRef, core_1.ElementRef);
    map.set(compiler_1.Identifiers.NgModuleRef, core_1.NgModuleRef);
    map.set(compiler_1.Identifiers.ViewContainerRef, core_1.ViewContainerRef);
    map.set(compiler_1.Identifiers.ChangeDetectorRef, core_1.ChangeDetectorRef);
    map.set(compiler_1.Identifiers.QueryList, core_1.QueryList);
    map.set(compiler_1.Identifiers.TemplateRef, core_1.TemplateRef);
    map.set(compiler_1.Identifiers.CodegenComponentFactoryResolver, core_1.ɵCodegenComponentFactoryResolver);
    map.set(compiler_1.Identifiers.ComponentFactoryResolver, core_1.ComponentFactoryResolver);
    map.set(compiler_1.Identifiers.ComponentFactory, core_1.ComponentFactory);
    map.set(compiler_1.Identifiers.ComponentRef, core_1.ComponentRef);
    map.set(compiler_1.Identifiers.NgModuleFactory, core_1.NgModuleFactory);
    map.set(compiler_1.Identifiers.createModuleFactory, core_1.ɵcmf);
    map.set(compiler_1.Identifiers.moduleDef, core_1.ɵmod);
    map.set(compiler_1.Identifiers.moduleProviderDef, core_1.ɵmpd);
    map.set(compiler_1.Identifiers.RegisterModuleFactoryFn, core_1.ɵregisterModuleFactory);
    map.set(compiler_1.Identifiers.Injector, core_1.Injector);
    map.set(compiler_1.Identifiers.ViewEncapsulation, core_1.ViewEncapsulation);
    map.set(compiler_1.Identifiers.ChangeDetectionStrategy, core_1.ChangeDetectionStrategy);
    map.set(compiler_1.Identifiers.SecurityContext, core_1.SecurityContext);
    map.set(compiler_1.Identifiers.LOCALE_ID, core_1.LOCALE_ID);
    map.set(compiler_1.Identifiers.TRANSLATIONS_FORMAT, core_1.TRANSLATIONS_FORMAT);
    map.set(compiler_1.Identifiers.inlineInterpolate, core_1.ɵinlineInterpolate);
    map.set(compiler_1.Identifiers.interpolate, core_1.ɵinterpolate);
    map.set(compiler_1.Identifiers.EMPTY_ARRAY, core_1.ɵEMPTY_ARRAY);
    map.set(compiler_1.Identifiers.EMPTY_MAP, core_1.ɵEMPTY_MAP);
    map.set(compiler_1.Identifiers.Renderer, core_1.Renderer);
    map.set(compiler_1.Identifiers.viewDef, core_1.ɵvid);
    map.set(compiler_1.Identifiers.elementDef, core_1.ɵeld);
    map.set(compiler_1.Identifiers.anchorDef, core_1.ɵand);
    map.set(compiler_1.Identifiers.textDef, core_1.ɵted);
    map.set(compiler_1.Identifiers.directiveDef, core_1.ɵdid);
    map.set(compiler_1.Identifiers.providerDef, core_1.ɵprd);
    map.set(compiler_1.Identifiers.queryDef, core_1.ɵqud);
    map.set(compiler_1.Identifiers.pureArrayDef, core_1.ɵpad);
    map.set(compiler_1.Identifiers.pureObjectDef, core_1.ɵpod);
    map.set(compiler_1.Identifiers.purePipeDef, core_1.ɵppd);
    map.set(compiler_1.Identifiers.pipeDef, core_1.ɵpid);
    map.set(compiler_1.Identifiers.nodeValue, core_1.ɵnov);
    map.set(compiler_1.Identifiers.ngContentDef, core_1.ɵncd);
    map.set(compiler_1.Identifiers.unwrapValue, core_1.ɵunv);
    map.set(compiler_1.Identifiers.createRendererType2, core_1.ɵcrt);
    map.set(compiler_1.Identifiers.createComponentFactory, core_1.ɵccf);
    return map;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZXJfcmVmbGVjdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcGxhdGZvcm0tYnJvd3Nlci1keW5hbWljL3NyYy9jb21waWxlcl9yZWZsZWN0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCw4Q0FBOEc7QUFDOUcsc0NBQTRvQjtBQUUvbkIsUUFBQSxhQUFhLEdBQUcsRUFBRSxDQUFDO0FBQ2hDLElBQU0seUJBQXlCLEdBQUcsa0NBQWtDLEVBQUUsQ0FBQztBQUV2RTtJQUdFO1FBRFEsOEJBQXlCLEdBQUcsSUFBSSxHQUFHLEVBQTBCLENBQUM7UUFDdEQsSUFBSSxDQUFDLHNCQUFzQixHQUFHLElBQUksOEJBQXNCLEVBQUUsQ0FBQztJQUFDLENBQUM7SUFDN0UseUNBQWtCLEdBQWxCLFVBQW1CLElBQVMsRUFBRSxXQUFzQjtRQUNsRCxJQUFNLFFBQVEsR0FBRyxXQUFXLENBQUMsUUFBUSxDQUFDO1FBRXRDLElBQUksT0FBTyxRQUFRLEtBQUssUUFBUSxFQUFFO1lBQ2hDLElBQU0sTUFBTSxHQUFHLHVCQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDdEMsT0FBTyxNQUFNLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsYUFBVyxRQUFRLEdBQUcscUJBQWUsQ0FBQztTQUNsRTthQUFNLElBQUksUUFBUSxLQUFLLElBQUksSUFBSSxRQUFRLEtBQUssS0FBSyxDQUFDLEVBQUU7WUFDbkQsTUFBTSxzQkFBVyxDQUNiLHNDQUFtQyxpQkFBUyxDQUFDLElBQUksQ0FBQywwREFBc0Q7Z0JBQ3hHLG1HQUFtRyxDQUFDLENBQUM7U0FDMUc7UUFFRCxPQUFPLE9BQUssaUJBQVMsQ0FBQyxJQUFJLENBQUcsQ0FBQztJQUNoQyxDQUFDO0lBQ0QsaUNBQVUsR0FBVixVQUFXLFVBQXdCO1FBQ2pDLE9BQU8sSUFBSSxDQUFDLHNCQUFzQixDQUFDLFVB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