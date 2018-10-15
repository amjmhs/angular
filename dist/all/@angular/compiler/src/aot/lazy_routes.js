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
function listLazyRoutes(moduleMeta, reflector) {
    var allLazyRoutes = [];
    for (var _i = 0, _a = moduleMeta.transitiveModule.providers; _i < _a.length; _i++) {
        var _b = _a[_i], provider = _b.provider, module_1 = _b.module;
        if (compile_metadata_1.tokenReference(provider.token) === reflector.ROUTES) {
            var loadChildren = _collectLoadChildren(provider.useValue);
            for (var _c = 0, loadChildren_1 = loadChildren; _c < loadChildren_1.length; _c++) {
                var route = loadChildren_1[_c];
                allLazyRoutes.push(parseLazyRoute(route, reflector, module_1.reference));
            }
        }
    }
    return allLazyRoutes;
}
exports.listLazyRoutes = listLazyRoutes;
function _collectLoadChildren(routes, target) {
    if (target === void 0) { target = []; }
    if (typeof routes === 'string') {
        target.push(routes);
    }
    else if (Array.isArray(routes)) {
        for (var _i = 0, routes_1 = routes; _i < routes_1.length; _i++) {
            var route = routes_1[_i];
            _collectLoadChildren(route, target);
        }
    }
    else if (routes.loadChildren) {
        _collectLoadChildren(routes.loadChildren, target);
    }
    else if (routes.children) {
        _collectLoadChildren(routes.children, target);
    }
    return target;
}
function parseLazyRoute(route, reflector, module) {
    var _a = route.split('#'), routePath = _a[0], routeName = _a[1];
    var referencedModule = reflector.resolveExternalReference({
        moduleName: routePath,
        name: routeName,
    }, module ? module.filePath : undefined);
    return { route: route, module: module || referencedModule, referencedModule: referencedModule };
}
exports.parseLazyRoute = parseLazyRoute;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF6eV9yb3V0ZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci9zcmMvYW90L2xhenlfcm91dGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsd0RBQTRFO0FBYzVFLHdCQUNJLFVBQW1DLEVBQUUsU0FBMEI7SUFDakUsSUFBTSxhQUFhLEdBQWdCLEVBQUUsQ0FBQztJQUN0QyxLQUFpQyxVQUFxQyxFQUFyQyxLQUFBLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQXJDLGNBQXFDLEVBQXJDLElBQXFDLEVBQUU7UUFBN0QsSUFBQSxXQUFrQixFQUFqQixzQkFBUSxFQUFFLG9CQUFNO1FBQzFCLElBQUksaUNBQWMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssU0FBUyxDQUFDLE1BQU0sRUFBRTtZQUN2RCxJQUFNLFlBQVksR0FBRyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDN0QsS0FBb0IsVUFBWSxFQUFaLDZCQUFZLEVBQVosMEJBQVksRUFBWixJQUFZLEVBQUU7Z0JBQTdCLElBQU0sS0FBSyxxQkFBQTtnQkFDZCxhQUFhLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLFFBQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2FBQ3hFO1NBQ0Y7S0FDRjtJQUNELE9BQU8sYUFBYSxDQUFDO0FBQ3ZCLENBQUM7QUFaRCx3Q0FZQztBQUVELDhCQUE4QixNQUFnQyxFQUFFLE1BQXFCO0lBQXJCLHVCQUFBLEVBQUEsV0FBcUI7SUFDbkYsSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLEVBQUU7UUFDOUIsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUNyQjtTQUFNLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUNoQyxLQUFvQixVQUFNLEVBQU4saUJBQU0sRUFBTixvQkFBTSxFQUFOLElBQU0sRUFBRTtZQUF2QixJQUFNLEtBQUssZUFBQTtZQUNkLG9CQUFvQixDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztTQUNyQztLQUNGO1NBQU0sSUFBSSxNQUFNLENBQUMsWUFBWSxFQUFFO1FBQzlCLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsTUFBTSxDQUFDLENBQUM7S0FDbkQ7U0FBTSxJQUFJLE1BQU0sQ0FBQyxRQUFRLEVBQUU7UUFDMUIsb0JBQW9CLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztLQUMvQztJQUNELE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUFFRCx3QkFDSSxLQUFhLEVBQUUsU0FBMEIsRUFBRSxNQUFxQjtJQUM1RCxJQUFBLHFCQUF5QyxFQUF4QyxpQkFBUyxFQUFFLGlCQUFTLENBQXFCO0lBQ2hELElBQU0sZ0JBQWdCLEdBQUcsU0FBUyxDQUFDLHdCQUF3QixDQUN2RDtRQUNFLFVBQVUsRUFBRSxTQUFTO1FBQ3JCLElBQUksRUFBRSxTQUFTO0tBQ2hCLEVBQ0QsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUMxQyxPQUFPLEVBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxJQUFJLGdCQUFnQixFQUFFLGdCQUFnQixrQkFBQSxFQUFDLENBQUM7QUFDOUUsQ0FBQztBQVZELHdDQVVDIn0=