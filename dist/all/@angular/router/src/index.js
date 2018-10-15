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
var router_link_1 = require("./directives/router_link");
exports.RouterLink = router_link_1.RouterLink;
exports.RouterLinkWithHref = router_link_1.RouterLinkWithHref;
var router_link_active_1 = require("./directives/router_link_active");
exports.RouterLinkActive = router_link_active_1.RouterLinkActive;
var router_outlet_1 = require("./directives/router_outlet");
exports.RouterOutlet = router_outlet_1.RouterOutlet;
var events_1 = require("./events");
exports.ActivationEnd = events_1.ActivationEnd;
exports.ActivationStart = events_1.ActivationStart;
exports.ChildActivationEnd = events_1.ChildActivationEnd;
exports.ChildActivationStart = events_1.ChildActivationStart;
exports.GuardsCheckEnd = events_1.GuardsCheckEnd;
exports.GuardsCheckStart = events_1.GuardsCheckStart;
exports.NavigationCancel = events_1.NavigationCancel;
exports.NavigationEnd = events_1.NavigationEnd;
exports.NavigationError = events_1.NavigationError;
exports.NavigationStart = events_1.NavigationStart;
exports.ResolveEnd = events_1.ResolveEnd;
exports.ResolveStart = events_1.ResolveStart;
exports.RouteConfigLoadEnd = events_1.RouteConfigLoadEnd;
exports.RouteConfigLoadStart = events_1.RouteConfigLoadStart;
exports.RouterEvent = events_1.RouterEvent;
exports.RoutesRecognized = events_1.RoutesRecognized;
exports.Scroll = events_1.Scroll;
var route_reuse_strategy_1 = require("./route_reuse_strategy");
exports.RouteReuseStrategy = route_reuse_strategy_1.RouteReuseStrategy;
var router_1 = require("./router");
exports.Router = router_1.Router;
var router_config_loader_1 = require("./router_config_loader");
exports.ROUTES = router_config_loader_1.ROUTES;
var router_module_1 = require("./router_module");
exports.ROUTER_CONFIGURATION = router_module_1.ROUTER_CONFIGURATION;
exports.ROUTER_INITIALIZER = router_module_1.ROUTER_INITIALIZER;
exports.RouterModule = router_module_1.RouterModule;
exports.provideRoutes = router_module_1.provideRoutes;
var router_outlet_context_1 = require("./router_outlet_context");
exports.ChildrenOutletContexts = router_outlet_context_1.ChildrenOutletContexts;
exports.OutletContext = router_outlet_context_1.OutletContext;
var router_preloader_1 = require("./router_preloader");
exports.NoPreloading = router_preloader_1.NoPreloading;
exports.PreloadAllModules = router_preloader_1.PreloadAllModules;
exports.PreloadingStrategy = router_preloader_1.PreloadingStrategy;
exports.RouterPreloader = router_preloader_1.RouterPreloader;
var router_state_1 = require("./router_state");
exports.ActivatedRoute = router_state_1.ActivatedRoute;
exports.ActivatedRouteSnapshot = router_state_1.ActivatedRouteSnapshot;
exports.RouterState = router_state_1.RouterState;
exports.RouterStateSnapshot = router_state_1.RouterStateSnapshot;
var shared_1 = require("./shared");
exports.PRIMARY_OUTLET = shared_1.PRIMARY_OUTLET;
exports.convertToParamMap = shared_1.convertToParamMap;
var url_handling_strategy_1 = require("./url_handling_strategy");
exports.UrlHandlingStrategy = url_handling_strategy_1.UrlHandlingStrategy;
var url_tree_1 = require("./url_tree");
exports.DefaultUrlSerializer = url_tree_1.DefaultUrlSerializer;
exports.UrlSegment = url_tree_1.UrlSegment;
exports.UrlSegmentGroup = url_tree_1.UrlSegmentGroup;
exports.UrlSerializer = url_tree_1.UrlSerializer;
exports.UrlTree = url_tree_1.UrlTree;
var version_1 = require("./version");
exports.VERSION = version_1.VERSION;
__export(require("./private_export"));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9yb3V0ZXIvc3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7O0FBSUgsd0RBQXdFO0FBQWhFLG1DQUFBLFVBQVUsQ0FBQTtBQUFFLDJDQUFBLGtCQUFrQixDQUFBO0FBQ3RDLHNFQUFpRTtBQUF6RCxnREFBQSxnQkFBZ0IsQ0FBQTtBQUN4Qiw0REFBd0Q7QUFBaEQsdUNBQUEsWUFBWSxDQUFBO0FBQ3BCLG1DQUF5VDtBQUFqVCxpQ0FBQSxhQUFhLENBQUE7QUFBRSxtQ0FBQSxlQUFlLENBQUE7QUFBRSxzQ0FBQSxrQkFBa0IsQ0FBQTtBQUFFLHdDQUFBLG9CQUFvQixDQUFBO0FBQVMsa0NBQUEsY0FBYyxDQUFBO0FBQUUsb0NBQUEsZ0JBQWdCLENBQUE7QUFBRSxvQ0FBQSxnQkFBZ0IsQ0FBQTtBQUFFLGlDQUFBLGFBQWEsQ0FBQTtBQUFFLG1DQUFBLGVBQWUsQ0FBQTtBQUFFLG1DQUFBLGVBQWUsQ0FBQTtBQUFFLDhCQUFBLFVBQVUsQ0FBQTtBQUFFLGdDQUFBLFlBQVksQ0FBQTtBQUFFLHNDQUFBLGtCQUFrQixDQUFBO0FBQUUsd0NBQUEsb0JBQW9CLENBQUE7QUFBRSwrQkFBQSxXQUFXLENBQUE7QUFBRSxvQ0FBQSxnQkFBZ0IsQ0FBQTtBQUFFLDBCQUFBLE1BQU0sQ0FBQTtBQUV2UywrREFBK0U7QUFBbEQsb0RBQUEsa0JBQWtCLENBQUE7QUFDL0MsbUNBQWtEO0FBQXhCLDBCQUFBLE1BQU0sQ0FBQTtBQUNoQywrREFBOEM7QUFBdEMsd0NBQUEsTUFBTSxDQUFBO0FBQ2QsaURBQW9IO0FBQTlGLCtDQUFBLG9CQUFvQixDQUFBO0FBQUUsNkNBQUEsa0JBQWtCLENBQUE7QUFBRSx1Q0FBQSxZQUFZLENBQUE7QUFBRSx3Q0FBQSxhQUFhLENBQUE7QUFDM0YsaUVBQThFO0FBQXRFLHlEQUFBLHNCQUFzQixDQUFBO0FBQUUsZ0RBQUEsYUFBYSxDQUFBO0FBQzdDLHVEQUF3RztBQUFoRywwQ0FBQSxZQUFZLENBQUE7QUFBRSwrQ0FBQSxpQkFBaUIsQ0FBQTtBQUFFLGdEQUFBLGtCQUFrQixDQUFBO0FBQUUsNkNBQUEsZUFBZSxDQUFBO0FBQzVFLCtDQUF3RztBQUFoRyx3Q0FBQSxjQUFjLENBQUE7QUFBRSxnREFBQSxzQkFBc0IsQ0FBQTtBQUFFLHFDQUFBLFdBQVcsQ0FBQTtBQUFFLDZDQUFBLG1CQUFtQixDQUFBO0FBQ2hGLG1DQUE2RTtBQUFyRSxrQ0FBQSxjQUFjLENBQUE7QUFBb0IscUNBQUEsaUJBQWlCLENBQUE7QUFDM0QsaUVBQTREO0FBQXBELHNEQUFBLG1CQUFtQixDQUFBO0FBQzNCLHVDQUFxRztBQUE3RiwwQ0FBQSxvQkFBb0IsQ0FBQTtBQUFFLGdDQUFBLFVBQVUsQ0FBQTtBQUFFLHFDQUFBLGVBQWUsQ0FBQTtBQUFFLG1DQUFBLGFBQWEsQ0FBQTtBQUFFLDZCQUFBLE9BQU8sQ0FBQTtBQUNqRixxQ0FBa0M7QUFBMUIsNEJBQUEsT0FBTyxDQUFBO0FBRWYsc0NBQWlDIn0=