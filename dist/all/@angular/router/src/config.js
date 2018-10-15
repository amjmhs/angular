"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var empty_outlet_1 = require("./components/empty_outlet");
var shared_1 = require("./shared");
var LoadedRouterConfig = /** @class */ (function () {
    function LoadedRouterConfig(routes, module) {
        this.routes = routes;
        this.module = module;
    }
    return LoadedRouterConfig;
}());
exports.LoadedRouterConfig = LoadedRouterConfig;
function validateConfig(config, parentPath) {
    if (parentPath === void 0) { parentPath = ''; }
    // forEach doesn't iterate undefined values
    for (var i = 0; i < config.length; i++) {
        var route = config[i];
        var fullPath = getFullPath(parentPath, route);
        validateNode(route, fullPath);
    }
}
exports.validateConfig = validateConfig;
function validateNode(route, fullPath) {
    if (!route) {
        throw new Error("\n      Invalid configuration of route '" + fullPath + "': Encountered undefined route.\n      The reason might be an extra comma.\n\n      Example:\n      const routes: Routes = [\n        { path: '', redirectTo: '/dashboard', pathMatch: 'full' },\n        { path: 'dashboard',  component: DashboardComponent },, << two commas\n        { path: 'detail/:id', component: HeroDetailComponent }\n      ];\n    ");
    }
    if (Array.isArray(route)) {
        throw new Error("Invalid configuration of route '" + fullPath + "': Array cannot be specified");
    }
    if (!route.component && !route.children && !route.loadChildren &&
        (route.outlet && route.outlet !== shared_1.PRIMARY_OUTLET)) {
        throw new Error("Invalid configuration of route '" + fullPath + "': a componentless route without children or loadChildren cannot have a named outlet set");
    }
    if (route.redirectTo && route.children) {
        throw new Error("Invalid configuration of route '" + fullPath + "': redirectTo and children cannot be used together");
    }
    if (route.redirectTo && route.loadChildren) {
        throw new Error("Invalid configuration of route '" + fullPath + "': redirectTo and loadChildren cannot be used together");
    }
    if (route.children && route.loadChildren) {
        throw new Error("Invalid configuration of route '" + fullPath + "': children and loadChildren cannot be used together");
    }
    if (route.redirectTo && route.component) {
        throw new Error("Invalid configuration of route '" + fullPath + "': redirectTo and component cannot be used together");
    }
    if (route.path && route.matcher) {
        throw new Error("Invalid configuration of route '" + fullPath + "': path and matcher cannot be used together");
    }
    if (route.redirectTo === void 0 && !route.component && !route.children && !route.loadChildren) {
        throw new Error("Invalid configuration of route '" + fullPath + "'. One of the following must be provided: component, redirectTo, children or loadChildren");
    }
    if (route.path === void 0 && route.matcher === void 0) {
        throw new Error("Invalid configuration of route '" + fullPath + "': routes must have either a path or a matcher specified");
    }
    if (typeof route.path === 'string' && route.path.charAt(0) === '/') {
        throw new Error("Invalid configuration of route '" + fullPath + "': path cannot start with a slash");
    }
    if (route.path === '' && route.redirectTo !== void 0 && route.pathMatch === void 0) {
        var exp = "The default value of 'pathMatch' is 'prefix', but often the intent is to use 'full'.";
        throw new Error("Invalid configuration of route '{path: \"" + fullPath + "\", redirectTo: \"" + route.redirectTo + "\"}': please provide 'pathMatch'. " + exp);
    }
    if (route.pathMatch !== void 0 && route.pathMatch !== 'full' && route.pathMatch !== 'prefix') {
        throw new Error("Invalid configuration of route '" + fullPath + "': pathMatch can only be set to 'prefix' or 'full'");
    }
    if (route.children) {
        validateConfig(route.children, fullPath);
    }
}
function getFullPath(parentPath, currentRoute) {
    if (!currentRoute) {
        return parentPath;
    }
    if (!parentPath && !currentRoute.path) {
        return '';
    }
    else if (parentPath && !currentRoute.path) {
        return parentPath + "/";
    }
    else if (!parentPath && currentRoute.path) {
        return currentRoute.path;
    }
    else {
        return parentPath + "/" + currentRoute.path;
    }
}
/**
 * Makes a copy of the config and adds any default required properties.
 */
function standardizeConfig(r) {
    var children = r.children && r.children.map(standardizeConfig);
    var c = children ? __assign({}, r, { children: children }) : __assign({}, r);
    if (!c.component && (children || c.loadChildren) && (c.outlet && c.outlet !== shared_1.PRIMARY_OUTLET)) {
        c.component = empty_outlet_1.EmptyOutletComponent;
    }
    return c;
}
exports.standardizeConfig = standardizeConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcm91dGVyL3NyYy9jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7OztBQUlILDBEQUErRDtBQUMvRCxtQ0FBd0M7QUFzWHhDO0lBQ0UsNEJBQW1CLE1BQWUsRUFBUyxNQUF3QjtRQUFoRCxXQUFNLEdBQU4sTUFBTSxDQUFTO1FBQVMsV0FBTSxHQUFOLE1BQU0sQ0FBa0I7SUFBRyxDQUFDO0lBQ3pFLHlCQUFDO0FBQUQsQ0FBQyxBQUZELElBRUM7QUFGWSxnREFBa0I7QUFJL0Isd0JBQStCLE1BQWMsRUFBRSxVQUF1QjtJQUF2QiwyQkFBQSxFQUFBLGVBQXVCO0lBQ3BFLDJDQUEyQztJQUMzQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUN0QyxJQUFNLEtBQUssR0FBVSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0IsSUFBTSxRQUFRLEdBQVcsV0FBVyxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN4RCxZQUFZLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQy9CO0FBQ0gsQ0FBQztBQVBELHdDQU9DO0FBRUQsc0JBQXNCLEtBQVksRUFBRSxRQUFnQjtJQUNsRCxJQUFJLENBQUMsS0FBSyxFQUFFO1FBQ1YsTUFBTSxJQUFJLEtBQUssQ0FBQyw2Q0FDb0IsUUFBUSxvV0FTM0MsQ0FBQyxDQUFDO0tBQ0o7SUFDRCxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDeEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxxQ0FBbUMsUUFBUSxpQ0FBOEIsQ0FBQyxDQUFDO0tBQzVGO0lBQ0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLElBQUksQ0FBQyxLQUFL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