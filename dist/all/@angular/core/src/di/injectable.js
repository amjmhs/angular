"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var ivy_switch_1 = require("../ivy_switch");
var reflection_capabilities_1 = require("../reflection/reflection_capabilities");
var decorators_1 = require("../util/decorators");
var property_1 = require("../util/property");
var defs_1 = require("./defs");
var injector_1 = require("./injector");
var GET_PROPERTY_NAME = {};
var USE_VALUE = property_1.getClosureSafeProperty({ provide: String, useValue: GET_PROPERTY_NAME }, GET_PROPERTY_NAME);
var EMPTY_ARRAY = [];
function convertInjectableProviderToFactory(type, provider) {
    if (!provider) {
        var reflectionCapabilities = new reflection_capabilities_1.ReflectionCapabilities();
        var deps_1 = reflectionCapabilities.parameters(type);
        // TODO - convert to flags.
        return function () { return new (type.bind.apply(type, [void 0].concat(injector_1.injectArgs(deps_1))))(); };
    }
    if (USE_VALUE in provider) {
        var valueProvider_1 = provider;
        return function () { return valueProvider_1.useValue; };
    }
    else if (provider.useExisting) {
        var existingProvider_1 = provider;
        return function () { return injector_1.inject(existingProvider_1.useExisting); };
    }
    else if (provider.useFactory) {
        var factoryProvider_1 = provider;
        return function () { return factoryProvider_1.useFactory.apply(factoryProvider_1, injector_1.injectArgs(factoryProvider_1.deps || EMPTY_ARRAY)); };
    }
    else if (provider.useClass) {
        var classProvider_1 = provider;
        var deps_2 = provider.deps;
        if (!deps_2) {
            var reflectionCapabilities = new reflection_capabilities_1.ReflectionCapabilities();
            deps_2 = reflectionCapabilities.parameters(type);
        }
        return function () {
            var _a;
            return new ((_a = classProvider_1.useClass).bind.apply(_a, [void 0].concat(injector_1.injectArgs(deps_2))))();
        };
    }
    else {
        var deps_3 = provider.deps;
        if (!deps_3) {
            var reflectionCapabilities = new reflection_capabilities_1.ReflectionCapabilities();
            deps_3 = reflectionCapabilities.parameters(type);
        }
        return function () { return new (type.bind.apply(type, [void 0].concat(injector_1.injectArgs(deps_3))))(); };
    }
}
exports.convertInjectableProviderToFactory = convertInjectableProviderToFactory;
/**
 * Supports @Injectable() in JIT mode for Render2.
 */
function preR3InjectableCompile(injectableType, options) {
    if (options && options.providedIn !== undefined && injectableType.ngInjectableDef === undefined) {
        injectableType.ngInjectableDef = defs_1.defineInjectable({
            providedIn: options.providedIn,
            factory: convertInjectableProviderToFactory(injectableType, options),
        });
    }
}
/**
* Injectable decorator and metadata.
*
* @Annotation
*/
exports.Injectable = decorators_1.makeDecorator('Injectable', undefined, undefined, undefined, function (type, meta) {
    return (ivy_switch_1.R3_COMPILE_INJECTABLE || preR3InjectableCompile)(type, meta);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5qZWN0YWJsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL2RpL2luamVjdGFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCw0Q0FBb0Q7QUFDcEQsaUZBQTZFO0FBRTdFLGlEQUFxRTtBQUNyRSw2Q0FBd0Q7QUFFeEQsK0JBQXVFO0FBQ3ZFLHVDQUE4QztBQUc5QyxJQUFNLGlCQUFpQixHQUFHLEVBQVMsQ0FBQztBQUNwQyxJQUFNLFNBQVMsR0FBRyxpQ0FBc0IsQ0FDcEMsRUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxpQkFBaUIsRUFBQyxFQUFFLGlCQUFpQixDQUFDLENBQUM7QUEyQ3ZFLElBQU0sV0FBVyxHQUFVLEVBQUUsQ0FBQztBQUU5Qiw0Q0FDSSxJQUFlLEVBQUUsUUFBNkI7SUFDaEQsSUFBSSxDQUFDLFFBQVEsRUFBRTtRQUNiLElBQU0sc0JBQXNCLEdBQUcsSUFBSSxnREFBc0IsRUFBRSxDQUFDO1FBQzVELElBQU0sTUFBSSxHQUFHLHNCQUFzQixDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNyRCwyQkFBMkI7UUFDM0IsT0FBTyxjQUFNLFlBQUksSUFBSSxZQUFKLElBQUksa0JBQUkscUJBQVUsQ0FBQyxNQUFhLENBQUMsT0FBckMsQ0FBc0MsQ0FBQztLQUNyRDtJQUVELElBQUksU0FBUyxJQUFJLFFBQVEsRUFBRTtRQUN6QixJQUFNLGVBQWEsR0FBSSxRQUE4QixDQUFDO1FBQ3RELE9BQU8sY0FBTSxPQUFBLGVBQWEsQ0FBQyxRQUFRLEVBQXRCLENBQXNCLENBQUM7S0FDckM7U0FBTSxJQUFLLFFBQWlDLENBQUMsV0FBVyxFQUFFO1FBQ3pELElBQU0sa0JBQWdCLEdBQUksUUFBaUMsQ0FBQztRQUM1RCxPQUFPLGNBQU0sT0FBQSxpQkFBTSxDQUFDLGtCQUFnQixDQUFDLFdBQVcsQ0FBQyxFQUFwQyxDQUFvQyxDQUFDO0tBQ25EO1NBQU0sSUFBSyxRQUFnQyxDQUFDLFVBQVUsRUFBRTtRQUN2RCxJQUFNLGlCQUFlLEdBQUksUUFBZ0MsQ0FBQztRQUMxRCxPQUFPLGNBQU0sT0FBQSxpQkFBZSxDQUFDLFVBQVUsT0FBMUIsaUJBQWUsRUFBZSxxQkFBVSxDQUFDLGlCQUFlLENBQUMsSUFBSSxJQUFJLFdBQVcsQ0FBQyxHQUE3RSxDQUE4RSxDQUFDO0tBQzdGO1NBQU0sSUFBSyxRQUF3RCxDQUFDLFFBQVEsRUFBRTtRQUM3RSxJQUFNLGVBQWEsR0FBSSxRQUF3RCxDQUFDO1FBQ2hGLElBQUksTUFBSSxHQUFJLFFBQW9DLENBQUMsSUFBSSxDQUFDO1FBQ3RELElBQUksQ0FBQyxNQUFJLEVBQUU7WUFDVCxJQUFNLHNCQUFzQixHQUFHLElBQUksZ0RBQXNCLEVBQUUsQ0FBQztZQUM1RCxNQUFJLEdBQUcsc0JBQXNCLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ2hEO1FBQ0QsT0FBTzs7WUFBTSxZQUFJLENBQUEsS0FBQSxlQUFhLENBQUMsUUFBUSxDQUFBLGdDQUFJLHFCQUFVLENBQUMsTUFBSSxDQUFDO1FBQTlDLENBQStDLENBQUM7S0FDOUQ7U0FBTTtRQUNMLElBQUksTUFBSSxHQUFJLFFBQW9DLENBQUMsSUFBSSxDQUFDO1FBQ3RELElBQUksQ0FBQyxNQUFJLEVBQUU7WUFDVCxJQUFNLHNCQUFzQixHQUFHLElBQUksZ0RBQXNCLEVBQUUsQ0FBQztZQUM1RCxNQUFJLEdBQUcsc0JBQXNCLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ2hEO1FBQ0QsT0FBTyxjQUFNLFlBQUksSUFBSSxZQUFKLElBQUksa0JBQUkscUJBQVUsQ0FBQyxNQUFNLENBQUMsT0FBOUIsQ0FBK0IsQ0FBQztLQUM5QztBQUNILENBQUM7QUFsQ0QsZ0ZBa0NDO0FBRUQ7O0dBRUc7QUFDSCxnQ0FDSSxjQUFtQyxFQUNuQyxPQUFxRTtJQUN2RSxJQUFJLE9BQU8sSUFBSSxPQUFPLENBQUMsVUFBVSxLQUFLLFNBQVMsSUFBSSxjQUFjLENBQUMsZUFBZSxLQUFLLFNBQVMsRUFBRTtRQUMvRixjQUFjLENBQUMsZUFBZSxHQUFHLHVCQUFnQixDQUFDO1lBQ2hELFVBQVUsRUFBRSxPQUFPLENBQUMsVUFBVTtZQUM5QixPQUFPLEVBQUUsa0NBQWtDLENBQUMsY0FBYyxFQUFFLE9BQU8sQ0FBQztTQUNyRSxDQUFDLENBQUM7S0FDSjtBQUNILENBQUM7QUFFRDs7OztFQUlFO0FBQ1csUUFBQSxVQUFVLEdBQXdCLDBCQUFhLENBQ3hELFlBQVksRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFDN0MsVUFBQyxJQUFlLEVBQUUsSUFBZ0I7SUFDOUIsT0FBQSxDQUFDLGtDQUFxQixJQUFJLHNCQUFzQixDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztBQUE3RCxDQUE2RCxDQUFDLENBQUMifQ==