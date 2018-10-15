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
import { tokenReference } from '../compile_metadata';
/**
 * @record
 */
export function LazyRoute() { }
/** @type {?} */
LazyRoute.prototype.module;
/** @type {?} */
LazyRoute.prototype.route;
/** @type {?} */
LazyRoute.prototype.referencedModule;
/**
 * @param {?} moduleMeta
 * @param {?} reflector
 * @return {?}
 */
export function listLazyRoutes(moduleMeta, reflector) {
    /** @type {?} */
    const allLazyRoutes = [];
    for (const { provider, module } of moduleMeta.transitiveModule.providers) {
        if (tokenReference(provider.token) === reflector.ROUTES) {
            /** @type {?} */
            const loadChildren = _collectLoadChildren(provider.useValue);
            for (const route of loadChildren) {
                allLazyRoutes.push(parseLazyRoute(route, reflector, module.reference));
            }
        }
    }
    return allLazyRoutes;
}
/**
 * @param {?} routes
 * @param {?=} target
 * @return {?}
 */
function _collectLoadChildren(routes, target = []) {
    if (typeof routes === 'string') {
        target.push(routes);
    }
    else if (Array.isArray(routes)) {
        for (const route of routes) {
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
/**
 * @param {?} route
 * @param {?} reflector
 * @param {?=} module
 * @return {?}
 */
export function parseLazyRoute(route, reflector, module) {
    const [routePath, routeName] = route.split('#');
    /** @type {?} */
    const referencedModule = reflector.resolveExternalReference({
        moduleName: routePath,
        name: routeName,
    }, module ? module.filePath : undefined);
    return { route: route, module: module || referencedModule, referencedModule };
}
//# sourceMappingURL=lazy_routes.js.map