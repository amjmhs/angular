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
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var config_1 = require("./config");
var shared_1 = require("./shared");
var url_tree_1 = require("./url_tree");
var collection_1 = require("./utils/collection");
var NoMatch = /** @class */ (function () {
    function NoMatch(segmentGroup) {
        this.segmentGroup = segmentGroup || null;
    }
    return NoMatch;
}());
var AbsoluteRedirect = /** @class */ (function () {
    function AbsoluteRedirect(urlTree) {
        this.urlTree = urlTree;
    }
    return AbsoluteRedirect;
}());
function noMatch(segmentGroup) {
    return new rxjs_1.Observable(function (obs) { return obs.error(new NoMatch(segmentGroup)); });
}
function absoluteRedirect(newTree) {
    return new rxjs_1.Observable(function (obs) { return obs.error(new AbsoluteRedirect(newTree)); });
}
function namedOutletsRedirect(redirectTo) {
    return new rxjs_1.Observable(function (obs) { return obs.error(new Error("Only absolute redirects can have named outlets. redirectTo: '" + redirectTo + "'")); });
}
function canLoadFails(route) {
    return new rxjs_1.Observable(function (obs) { return obs.error(shared_1.navigationCancelingError("Cannot load children because the guard of the route \"path: '" + route.path + "'\" returned false")); });
}
/**
 * Returns the `UrlTree` with the redirection applied.
 *
 * Lazy modules are loaded along the way.
 */
function applyRedirects(moduleInjector, configLoader, urlSerializer, urlTree, config) {
    return new ApplyRedirects(moduleInjector, configLoader, urlSerializer, urlTree, config).apply();
}
exports.applyRedirects = applyRedirects;
var ApplyRedirects = /** @class */ (function () {
    function ApplyRedirects(moduleInjector, configLoader, urlSerializer, urlTree, config) {
        this.configLoader = configLoader;
        this.urlSerializer = urlSerializer;
        this.urlTree = urlTree;
        this.config = config;
        this.allowRedirects = true;
        this.ngModule = moduleInjector.get(core_1.NgModuleRef);
    }
    ApplyRedirects.prototype.apply = function () {
        var _this = this;
        var expanded$ = this.expandSegmentGroup(this.ngModule, this.config, this.urlTree.root, shared_1.PRIMARY_OUTLET);
        var urlTrees$ = expanded$.pipe(operators_1.map(function (rootSegmentGroup) { return _this.createUrlTree(rootSegmentGroup, _this.urlTree.queryParams, _this.urlTree.fragment); }));
        return urlTrees$.pipe(operators_1.catchError(function (e) {
            if (e instanceof AbsoluteRedirect) {
                // after an absolute redirect we do not apply any more redirects!
                _this.allowRedirects = false;
                // we need to run matching, so we can fetch all lazy-loaded modules
                return _this.match(e.urlTree);
            }
            if (e instanceof NoMatch) {
                throw _this.noMatchError(e);
            }
            throw e;
        }));
    };
    ApplyRedirects.prototype.match = function (tree) {
        var _this = this;
        var expanded$ = this.expandSegmentGroup(this.ngModule, this.config, tree.root, shared_1.PRIMARY_OUTLET);
        var mapped$ = expanded$.pipe(operators_1.map(function (rootSegmentGroup) {
            return _this.createUrlTree(rootSegmentGroup, tree.queryParams, tree.fragment);
        }));
        return mapped$.pipe(operators_1.catchError(function (e) {
            if (e instanceof NoMatch) {
                throw _this.noMatchError(e);
            }
            throw e;
        }));
    };
    ApplyRedirects.prototype.noMatchError = function (e) {
        return new Error("Cannot match any routes. URL Segment: '" + e.segmentGroup + "'");
    };
    ApplyRedirects.prototype.createUrlTree = function (rootCandidate, queryParams, fragment) {
        var _a;
        var root = rootCandidate.segments.length > 0 ?
            new url_tree_1.UrlSegmentGroup([], (_a = {}, _a[shared_1.PRIMARY_OUTLET] = rootCandidate, _a)) :
            rootCandidate;
        return new url_tree_1.UrlTree(root, queryParams, fragment);
    };
    ApplyRedirects.prototype.expandSegmentGroup = function (ngModule, routes, segmentGroup, outlet) {
        if (segmentGroup.segments.length === 0 && segmentGroup.hasChildren()) {
            return this.expandChildren(ngModule, routes, segmentGroup)
                .pipe(operators_1.map(function (children) { return new url_tree_1.UrlSegmentGroup([], children); }));
        }
        return this.expandSegment(ngModule, segmentGroup, routes, segmentGroup.segments, outlet, true);
    };
    // Recursively expand segment groups for all the child outlets
    ApplyRedirects.prototype.expandChildren = function (ngModule, routes, segmentGroup) {
        var _this = this;
        return collection_1.waitForMap(segmentGroup.children, function (childOutlet, child) { return _this.expandSegmentGroup(ngModule, routes, child, childOutlet); });
    };
    ApplyRedirects.prototype.expandSegment = function (ngModule, segmentGroup, routes, segments, outlet, allowRedirects) {
        var _this = this;
        return rxjs_1.of.apply(void 0, routes).pipe(operators_1.map(function (r) {
            var expanded$ = _this.expandSegmentAgainstRoute(ngModule, segmentGroup, routes, r, segments, outlet, allowRedirects);
            return expanded$.pipe(operators_1.catchError(function (e) {
                if (e instanceof NoMatch) {
                    // TODO(i): this return type doesn't match the declared Observable<UrlSegmentGroup> -
                    // talk to Jason
                    return rxjs_1.of(null);
                }
                throw e;
            }));
        }), operators_1.concatAll(), operators_1.first(function (s) { return !!s; }), operators_1.catchError(function (e, _) {
            if (e instanceof rxjs_1.EmptyError || e.name === 'EmptyError') {
                if (_this.noLeftoversInUrl(segmentGroup, segments, outlet)) {
                    return rxjs_1.of(new url_tree_1.UrlSegmentGroup([], {}));
                }
                throw new NoMatch(segmentGroup);
            }
            throw e;
        }));
    };
    ApplyRedirects.prototype.noLeftoversInUrl = function (segmentGroup, segments, outlet) {
        return segments.length === 0 && !segmentGroup.children[outlet];
    };
    ApplyRedirects.prototype.expandSegmentAgainstRoute = function (ngModule, segmentGroup, routes, route, paths, outlet, allowRedirects) {
        if (getOutlet(route) !== outlet) {
            return noMatch(segmentGroup);
        }
        if (route.redirectTo === undefined) {
            return this.matchSegmentAgainstRoute(ngModule, segmentGroup, route, paths);
        }
        if (allowRedirects && this.allowRedirects) {
            return this.expandSegmentAgainstRouteUsingRedirect(ngModule, segmentGroup, routes, route, paths, outlet);
        }
        return noMatch(segmentGroup);
    };
    ApplyRedirects.prototype.expandSegmentAgainstRouteUsingRedirect = function (ngModule, segmentGroup, routes, route, segments, outlet) {
        if (route.path === '**') {
            return this.expandWildCardWithParamsAgainstRouteUsingRedirect(ngModule, routes, route, outlet);
        }
        return this.expandRegularSegmentAgainstRouteUsingRedirect(ngModule, segmentGroup, routes, route, segments, outlet);
    };
    ApplyRedirects.prototype.expandWildCardWithParamsAgainstRouteUsingRedirect = function (ngModule, routes, route, outlet) {
        var _this = this;
        var newTree = this.applyRedirectCommands([], route.redirectTo, {});
        if (route.redirectTo.startsWith('/')) {
            return absoluteRedirect(newTree);
        }
        return this.lineralizeSegments(route, newTree).pipe(operators_1.mergeMap(function (newSegments) {
            var group = new url_tree_1.UrlSegmentGroup(newSegments, {});
            return _this.expandSegment(ngModule, group, routes, newSegments, outlet, false);
        }));
    };
    ApplyRedirects.prototype.expandRegularSegmentAgainstRouteUsingRedirect = function (ngModule, segmentGroup, routes, route, segments, outlet) {
        var _this = this;
        var _a = match(segmentGroup, route, segments), matched = _a.matched, consumedSegments = _a.consumedSegments, lastChild = _a.lastChild, positionalParamSegments = _a.positionalParamSegments;
        if (!matched)
            return noMatch(segmentGroup);
        var newTree = this.applyRedirectCommands(consumedSegments, route.redirectTo, positionalParamSegments);
        if (route.redirectTo.startsWith('/')) {
            return absoluteRedirect(newTree);
        }
        return this.lineralizeSegments(route, newTree).pipe(operators_1.mergeMap(function (newSegments) {
            return _this.expandSegment(ngModule, segmentGroup, routes, newSegments.concat(segments.slice(lastChild)), outlet, false);
        }));
    };
    ApplyRedirects.prototype.matchSegmentAgainstRoute = function (ngModule, rawSegmentGroup, route, segments) {
        var _this = this;
        if (route.path === '**') {
            if (route.loadChildren) {
                return this.configLoader.load(ngModule.injector, route)
                    .pipe(operators_1.map(function (cfg) {
                    route._loadedConfig = cfg;
                    return new url_tree_1.UrlSegmentGroup(segments, {});
                }));
            }
            return rxjs_1.of(new url_tree_1.UrlSegmentGroup(segments, {}));
        }
        var _a = match(rawSegmentGroup, route, segments), matched = _a.matched, consumedSegments = _a.consumedSegments, lastChild = _a.lastChild;
        if (!matched)
            return noMatch(rawSegmentGroup);
        var rawSlicedSegments = segments.slice(lastChild);
        var childConfig$ = this.getChildConfig(ngModule, route);
        return childConfig$.pipe(operators_1.mergeMap(function (routerConfig) {
            var childModule = routerConfig.module;
            var childConfig = routerConfig.routes;
            var _a = split(rawSegmentGroup, consumedSegments, rawSlicedSegments, childConfig), segmentGroup = _a.segmentGroup, slicedSegments = _a.slicedSegments;
            if (slicedSegments.length === 0 && segmentGroup.hasChildren()) {
                var expanded$_1 = _this.expandChildren(childModule, childConfig, segmentGroup);
                return expanded$_1.pipe(operators_1.map(function (children) { return new url_tree_1.UrlSegmentGroup(consumedSegments, children); }));
            }
            if (childConfig.length === 0 && slicedSegments.length === 0) {
                return rxjs_1.of(new url_tree_1.UrlSegmentGroup(consumedSegments, {}));
            }
            var expanded$ = _this.expandSegment(childModule, segmentGroup, childConfig, slicedSegments, shared_1.PRIMARY_OUTLET, true);
            return expanded$.pipe(operators_1.map(function (cs) {
                return new url_tree_1.UrlSegmentGroup(consumedSegments.concat(cs.segments), cs.children);
            }));
        }));
    };
    ApplyRedirects.prototype.getChildConfig = function (ngModule, route) {
        var _this = this;
        if (route.children) {
            // The children belong to the same module
            return rxjs_1.of(new config_1.LoadedRouterConfig(route.children, ngModule));
        }
        if (route.loadChildren) {
            // lazy children belong to the loaded module
            if (route._loadedConfig !== undefined) {
                return rxjs_1.of(route._loadedConfig);
            }
            return runCanLoadGuard(ngModule.injector, route).pipe(operators_1.mergeMap(function (shouldLoad) {
                if (shouldLoad) {
                    return _this.configLoader.load(ngModule.injector, route)
                        .pipe(operators_1.map(function (cfg) {
                        route._loadedConfig = cfg;
                        return cfg;
                    }));
                }
                return canLoadFails(route);
            }));
        }
        return rxjs_1.of(new config_1.LoadedRouterConfig([], ngModule));
    };
    ApplyRedirects.prototype.lineralizeSegments = function (route, urlTree) {
        var res = [];
        var c = urlTree.root;
        while (true) {
            res = res.concat(c.segments);
            if (c.numberOfChildren === 0) {
                return rxjs_1.of(res);
            }
            if (c.numberOfChildren > 1 || !c.children[shared_1.PRIMARY_OUTLET]) {
                return namedOutletsRedirect(route.redirectTo);
            }
            c = c.children[shared_1.PRIMARY_OUTLET];
        }
    };
    ApplyRedirects.prototype.applyRedirectCommands = function (segments, redirectTo, posParams) {
        return this.applyRedirectCreatreUrlTree(redirectTo, this.urlSerializer.parse(redirectTo), segments, posParams);
    };
    ApplyRedirects.prototype.applyRedirectCreatreUrlTree = function (redirectTo, urlTree, segments, posParams) {
        var newRoot = this.createSegmentGroup(redirectTo, urlTree.root, segments, posParams);
        return new url_tree_1.UrlTree(newRoot, this.createQueryParams(urlTree.queryParams, this.urlTree.queryParams), urlTree.fragment);
    };
    ApplyRedirects.prototype.createQueryParams = function (redirectToParams, actualParams) {
        var res = {};
        collection_1.forEach(redirectToParams, function (v, k) {
            var copySourceValue = typeof v === 'string' && v.startsWith(':');
            if (copySourceValue) {
                var sourceName = v.substring(1);
                res[k] = actualParams[sourceName];
            }
            else {
                res[k] = v;
            }
        });
        return res;
    };
    ApplyRedirects.prototype.createSegmentGroup = function (redirectTo, group, segments, posParams) {
        var _this = this;
        var updatedSegments = this.createSegments(redirectTo, group.segments, segments, posParams);
        var children = {};
        collection_1.forEach(group.children, function (child, name) {
            children[name] = _this.createSegmentGroup(redirectTo, child, segments, posParams);
        });
        return new url_tree_1.UrlSegmentGroup(updatedSegments, children);
    };
    ApplyRedirects.prototype.createSegments = function (redirectTo, redirectToSegments, actualSegments, posParams) {
        var _this = this;
        return redirectToSegments.map(function (s) { return s.path.startsWith(':') ? _this.findPosParam(redirectTo, s, posParams) :
            _this.findOrReturn(s, actualSegments); });
    };
    ApplyRedirects.prototype.findPosParam = function (redirectTo, redirectToUrlSegment, posParams) {
        var pos = posParams[redirectToUrlSegment.path.substring(1)];
        if (!pos)
            throw new Error("Cannot redirect to '" + redirectTo + "'. Cannot find '" + redirectToUrlSegment.path + "'.");
        return pos;
    };
    ApplyRedirects.prototype.findOrReturn = function (redirectToUrlSegment, actualSegments) {
        var idx = 0;
        for (var _i = 0, actualSegments_1 = actualSegments; _i < actualSegments_1.length; _i++) {
            var s = actualSegments_1[_i];
            if (s.path === redirectToUrlSegment.path) {
                actualSegments.splice(idx);
                return s;
            }
            idx++;
        }
        return redirectToUrlSegment;
    };
    return ApplyRedirects;
}());
function runCanLoadGuard(moduleInjector, route) {
    var canLoad = route.canLoad;
    if (!canLoad || canLoad.length === 0)
        return rxjs_1.of(true);
    var obs = rxjs_1.from(canLoad).pipe(operators_1.map(function (injectionToken) {
        var guard = moduleInjector.get(injectionToken);
        return collection_1.wrapIntoObservable(guard.canLoad ? guard.canLoad(route) : guard(route));
    }));
    return collection_1.andObservables(obs);
}
function match(segmentGroup, route, segments) {
    if (route.path === '') {
        if ((route.pathMatch === 'full') && (segmentGroup.hasChildren() || segments.length > 0)) {
            return { matched: false, consumedSegments: [], lastChild: 0, positionalParamSegments: {} };
        }
        return { matched: true, consumedSegments: [], lastChild: 0, positionalParamSegments: {} };
    }
    var matcher = route.matcher || shared_1.defaultUrlMatcher;
    var res = matcher(segments, segmentGroup, route);
    if (!res) {
        return {
            matched: false,
            consumedSegments: [],
            lastChild: 0,
            positionalParamSegments: {},
        };
    }
    return {
        matched: true,
        consumedSegments: res.consumed,
        lastChild: res.consumed.length,
        positionalParamSegments: res.posParams,
    };
}
function split(segmentGroup, consumedSegments, slicedSegments, config) {
    if (slicedSegments.length > 0 &&
        containsEmptyPathRedirectsWithNamedOutlets(segmentGroup, slicedSegments, config)) {
        var s = new url_tree_1.UrlSegmentGroup(consumedSegments, createChildrenForEmptySegments(config, new url_tree_1.UrlSegmentGroup(slicedSegments, segmentGroup.children)));
        return { segmentGroup: mergeTrivialChildren(s), slicedSegments: [] };
    }
    if (slicedSegments.length === 0 &&
        containsEmptyPathRedirects(segmentGroup, slicedSegments, config)) {
        var s = new url_tree_1.UrlSegmentGroup(segmentGroup.segments, addEmptySegmentsToChildrenIfNeeded(segmentGroup, slicedSegments, config, segmentGroup.children));
        return { segmentGroup: mergeTrivialChildren(s), slicedSegments: slicedSegments };
    }
    return { segmentGroup: segmentGroup, slicedSegments: slicedSegments };
}
function mergeTrivialChildren(s) {
    if (s.numberOfChildren === 1 && s.children[shared_1.PRIMARY_OUTLET]) {
        var c = s.children[shared_1.PRIMARY_OUTLET];
        return new url_tree_1.UrlSegmentGroup(s.segments.concat(c.segments), c.children);
    }
    return s;
}
function addEmptySegmentsToChildrenIfNeeded(segmentGroup, slicedSegments, routes, children) {
    var res = {};
    for (var _i = 0, routes_1 = routes; _i < routes_1.length; _i++) {
        var r = routes_1[_i];
        if (isEmptyPathRedirect(segmentGroup, slicedSegments, r) && !children[getOutlet(r)]) {
            res[getOutlet(r)] = new url_tree_1.UrlSegmentGroup([], {});
        }
    }
    return __assign({}, children, res);
}
function createChildrenForEmptySegments(routes, primarySegmentGroup) {
    var res = {};
    res[shared_1.PRIMARY_OUTLET] = primarySegmentGroup;
    for (var _i = 0, routes_2 = routes; _i < routes_2.length; _i++) {
        var r = routes_2[_i];
        if (r.path === '' && getOutlet(r) !== shared_1.PRIMARY_OUTLET) {
            res[getOutlet(r)] = new url_tree_1.UrlSegmentGroup([], {});
        }
    }
    return res;
}
function containsEmptyPathRedirectsWithNamedOutlets(segmentGroup, segments, routes) {
    return routes.some(function (r) { return isEmptyPathRedirect(segmentGroup, segments, r) && getOutlet(r) !== shared_1.PRIMARY_OUTLET; });
}
function containsEmptyPathRedirects(segmentGroup, segments, routes) {
    return routes.some(function (r) { return isEmptyPathRedirect(segmentGroup, segments, r); });
}
function isEmptyPathRedirect(segmentGroup, segments, r) {
    if ((segmentGroup.hasChildren() || segments.length > 0) && r.pathMatch === 'full') {
        return false;
    }
    return r.path === '' && r.redirectTo !== undefined;
}
function getOutlet(route) {
    return route.outlet || shared_1.PRIMARY_OUTLET;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbHlfcmVkaXJlY3RzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcm91dGVyL3NyYy9hcHBseV9yZWRpcmVjdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7OztBQUVILHNDQUFvRDtBQUNwRCw2QkFBaUU7QUFDakUsNENBQTJFO0FBRTNFLG1DQUEyRDtBQUUzRCxtQ0FBNkY7QUFDN0YsdUNBQStFO0FBQy9FLGlEQUEyRjtBQUUzRjtJQUdFLGlCQUFZLFlBQThCO1FBQUksSUFBSSxDQUFDLFlBQVksR0FBRyxZQUFZLElBQUksSUFBSSxDQUFDO0lBQUMsQ0FBQztJQUMzRixjQUFDO0FBQUQsQ0FBQyxBQUpELElBSUM7QUFFRDtJQUNFLDBCQUFtQixPQUFnQjtRQUFoQixZQUFPLEdBQVAsT0FBTyxDQUFTO0lBQUcsQ0FBQztJQUN6Qyx1QkFBQztBQUFELENBQUMsQUFGRCxJQUVDO0FBRUQsaUJBQWlCLFlBQTZCO0lBQzVDLE9BQU8sSUFBSSxpQkFBVSxDQUNqQixVQUFDLEdBQThCLElBQUssT0FBQSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQXBDLENBQW9DLENBQUMsQ0FBQztBQUNoRixDQUFDO0FBRUQsMEJBQTBCLE9BQWdCO0lBQ3hDLE9BQU8sSUFBSSxpQkFBVSxDQUNqQixVQUFDLEdBQThCLElBQUssT0FBQSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBeEMsQ0FBd0MsQ0FBQyxDQUFDO0FBQ3BGLENBQUM7QUFFRCw4QkFBOEIsVUFBa0I7SUFDOUMsT0FBTyxJQUFJLGlCQUFVLENBQ2pCLFVBQUMsR0FBOEIsSUFBSyxPQUFBLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLENBQ25ELGtFQUFnRSxVQUFVLE1BQUcsQ0FBQyxDQUFDLEVBRC9D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