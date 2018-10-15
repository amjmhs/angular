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
import { APP_BASE_HREF, HashLocationStrategy, LOCATION_INITIALIZED, Location, LocationStrategy, PathLocationStrategy, PlatformLocation, ViewportScroller } from '@angular/common';
import { ANALYZE_FOR_ENTRY_COMPONENTS, APP_BOOTSTRAP_LISTENER, APP_INITIALIZER, ApplicationRef, Compiler, Inject, Injectable, InjectionToken, Injector, NgModule, NgModuleFactoryLoader, NgProbeToken, Optional, SkipSelf, SystemJsNgModuleLoader } from '@angular/core';
import { ɵgetDOM as getDOM } from '@angular/platform-browser';
import { Subject, of } from 'rxjs';
import { EmptyOutletComponent } from './components/empty_outlet';
import { RouterLink, RouterLinkWithHref } from './directives/router_link';
import { RouterLinkActive } from './directives/router_link_active';
import { RouterOutlet } from './directives/router_outlet';
import { RouteReuseStrategy } from './route_reuse_strategy';
import { Router } from './router';
import { ROUTES } from './router_config_loader';
import { ChildrenOutletContexts } from './router_outlet_context';
import { NoPreloading, PreloadAllModules, PreloadingStrategy, RouterPreloader } from './router_preloader';
import { RouterScroller } from './router_scroller';
import { ActivatedRoute } from './router_state';
import { UrlHandlingStrategy } from './url_handling_strategy';
import { DefaultUrlSerializer, UrlSerializer } from './url_tree';
import { flatten } from './utils/collection';
/** *
 * \@description
 *
 * Contains a list of directives
 *
 *
  @type {?} */
const ROUTER_DIRECTIVES = [RouterOutlet, RouterLink, RouterLinkWithHref, RouterLinkActive, EmptyOutletComponent];
/** *
 * \@description
 *
 * Is used in DI to configure the router.
 *
 *
  @type {?} */
export const ROUTER_CONFIGURATION = new InjectionToken('ROUTER_CONFIGURATION');
/** *
 * \@docsNotRequired
  @type {?} */
export const ROUTER_FORROOT_GUARD = new InjectionToken('ROUTER_FORROOT_GUARD');
/** @type {?} */
export const ROUTER_PROVIDERS = [
    Location,
    { provide: UrlSerializer, useClass: DefaultUrlSerializer },
    {
        provide: Router,
        useFactory: setupRouter,
        deps: [
            ApplicationRef, UrlSerializer, ChildrenOutletContexts, Location, Injector,
            NgModuleFactoryLoader, Compiler, ROUTES, ROUTER_CONFIGURATION,
            [UrlHandlingStrategy, new Optional()], [RouteReuseStrategy, new Optional()]
        ]
    },
    ChildrenOutletContexts,
    { provide: ActivatedRoute, useFactory: rootRoute, deps: [Router] },
    { provide: NgModuleFactoryLoader, useClass: SystemJsNgModuleLoader },
    RouterPreloader,
    NoPreloading,
    PreloadAllModules,
    { provide: ROUTER_CONFIGURATION, useValue: { enableTracing: false } },
];
/**
 * @return {?}
 */
export function routerNgProbeToken() {
    return new NgProbeToken('Router', Router);
}
/**
 * \@usageNotes
 *
 * RouterModule can be imported multiple times: once per lazily-loaded bundle.
 * Since the router deals with a global shared resource--location, we cannot have
 * more than one router service active.
 *
 * That is why there are two ways to create the module: `RouterModule.forRoot` and
 * `RouterModule.forChild`.
 *
 * * `forRoot` creates a module that contains all the directives, the given routes, and the router
 *   service itself.
 * * `forChild` creates a module that contains all the directives and the given routes, but does not
 *   include the router service.
 *
 * When registered at the root, the module should be used as follows
 *
 * ```
 * \@NgModule({
 *   imports: [RouterModule.forRoot(ROUTES)]
 * })
 * class MyNgModule {}
 * ```
 *
 * For submodules and lazy loaded submodules the module should be used as follows:
 *
 * ```
 * \@NgModule({
 *   imports: [RouterModule.forChild(ROUTES)]
 * })
 * class MyNgModule {}
 * ```
 *
 * \@description
 *
 * Adds router directives and providers.
 *
 * Managing state transitions is one of the hardest parts of building applications. This is
 * especially true on the web, where you also need to ensure that the state is reflected in the URL.
 * In addition, we often want to split applications into multiple bundles and load them on demand.
 * Doing this transparently is not trivial.
 *
 * The Angular router solves these problems. Using the router, you can declaratively specify
 * application states, manage state transitions while taking care of the URL, and load bundles on
 * demand.
 *
 * [Read this developer guide](https://angular.io/docs/ts/latest/guide/router.html) to get an
 * overview of how the router should be used.
 *
 *
 */
export class RouterModule {
    /**
     * @param {?} guard
     * @param {?} router
     */
    constructor(guard, router) { }
    /**
     * Creates a module with all the router providers and directives. It also optionally sets up an
     * application listener to perform an initial navigation.
     *
     * Options (see `ExtraOptions`):
     * * `enableTracing` makes the router log all its internal events to the console.
     * * `useHash` enables the location strategy that uses the URL fragment instead of the history
     * API.
     * * `initialNavigation` disables the initial navigation.
     * * `errorHandler` provides a custom error handler.
     * * `preloadingStrategy` configures a preloading strategy (see `PreloadAllModules`).
     * * `onSameUrlNavigation` configures how the router handles navigation to the current URL. See
     * `ExtraOptions` for more details.
     * * `paramsInheritanceStrategy` defines how the router merges params, data and resolved data
     * from parent to child routes.
     * @param {?} routes
     * @param {?=} config
     * @return {?}
     */
    static forRoot(routes, config) {
        return {
            ngModule: RouterModule,
            providers: [
                ROUTER_PROVIDERS,
                provideRoutes(routes),
                {
                    provide: ROUTER_FORROOT_GUARD,
                    useFactory: provideForRootGuard,
                    deps: [[Router, new Optional(), new SkipSelf()]]
                },
                { provide: ROUTER_CONFIGURATION, useValue: config ? config : {} },
                {
                    provide: LocationStrategy,
                    useFactory: provideLocationStrategy,
                    deps: [
                        PlatformLocation, [new Inject(APP_BASE_HREF), new Optional()], ROUTER_CONFIGURATION
                    ]
                },
                {
                    provide: RouterScroller,
                    useFactory: createRouterScroller,
                    deps: [Router, ViewportScroller, ROUTER_CONFIGURATION]
                },
                {
                    provide: PreloadingStrategy,
                    useExisting: config && config.preloadingStrategy ? config.preloadingStrategy :
                        NoPreloading
                },
                { provide: NgProbeToken, multi: true, useFactory: routerNgProbeToken },
                provideRouterInitializer(),
            ],
        };
    }
    /**
     * Creates a module with all the router directives and a provider registering routes.
     * @param {?} routes
     * @return {?}
     */
    static forChild(routes) {
        return { ngModule: RouterModule, providers: [provideRoutes(routes)] };
    }
}
RouterModule.decorators = [
    { type: NgModule, args: [{
                declarations: ROUTER_DIRECTIVES,
                exports: ROUTER_DIRECTIVES,
                entryComponents: [EmptyOutletComponent]
            },] },
];
/** @nocollapse */
RouterModule.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [ROUTER_FORROOT_GUARD,] }] },
    { type: Router, decorators: [{ type: Optional }] }
];
/**
 * @param {?} router
 * @param {?} viewportScroller
 * @param {?} config
 * @return {?}
 */
export function createRouterScroller(router, viewportScroller, config) {
    if (config.scrollOffset) {
        viewportScroller.setOffset(config.scrollOffset);
    }
    return new RouterScroller(router, viewportScroller, config);
}
/**
 * @param {?} platformLocationStrategy
 * @param {?} baseHref
 * @param {?=} options
 * @return {?}
 */
export function provideLocationStrategy(platformLocationStrategy, baseHref, options = {}) {
    return options.useHash ? new HashLocationStrategy(platformLocationStrategy, baseHref) :
        new PathLocationStrategy(platformLocationStrategy, baseHref);
}
/**
 * @param {?} router
 * @return {?}
 */
export function provideForRootGuard(router) {
    if (router) {
        throw new Error(`RouterModule.forRoot() called twice. Lazy loaded modules should use RouterModule.forChild() instead.`);
    }
    return 'guarded';
}
/**
 * \@description
 *
 * Registers routes.
 *
 * \@usageNotes
 * ### Example
 *
 * ```
 * \@NgModule({
 *   imports: [RouterModule.forChild(ROUTES)],
 *   providers: [provideRoutes(EXTRA_ROUTES)]
 * })
 * class MyNgModule {}
 * ```
 *
 *
 * @param {?} routes
 * @return {?}
 */
export function provideRoutes(routes) {
    return [
        { provide: ANALYZE_FOR_ENTRY_COMPONENTS, multi: true, useValue: routes },
        { provide: ROUTES, multi: true, useValue: routes },
    ];
}
/** @typedef {?} */
var InitialNavigation;
export { InitialNavigation };
/**
 * \@description
 *
 * Represents options to configure the router.
 *
 *
 * @record
 */
export function ExtraOptions() { }
/**
 * Makes the router log all its internal events to the console.
 * @type {?|undefined}
 */
ExtraOptions.prototype.enableTracing;
/**
 * Enables the location strategy that uses the URL fragment instead of the history API.
 * @type {?|undefined}
 */
ExtraOptions.prototype.useHash;
/**
 * Disables the initial navigation.
 * @type {?|undefined}
 */
ExtraOptions.prototype.initialNavigation;
/**
 * A custom error handler.
 * @type {?|undefined}
 */
ExtraOptions.prototype.errorHandler;
/**
 * Configures a preloading strategy. See `PreloadAllModules`.
 * @type {?|undefined}
 */
ExtraOptions.prototype.preloadingStrategy;
/**
 * Define what the router should do if it receives a navigation request to the current URL.
 * By default, the router will ignore this navigation. However, this prevents features such
 * as a "refresh" button. Use this option to configure the behavior when navigating to the
 * current URL. Default is 'ignore'.
 * @type {?|undefined}
 */
ExtraOptions.prototype.onSameUrlNavigation;
/**
 * Configures if the scroll position needs to be restored when navigating back.
 *
 * * 'disabled'--does nothing (default).
 * * 'top'--set the scroll position to 0,0..
 * * 'enabled'--set the scroll position to the stored position. This option will be the default in
 * the future.
 *
 * When enabled, the router stores and restores scroll positions during navigation.
 * When navigating forward, the scroll position will be set to [0, 0], or to the anchor
 * if one is provided.
 *
 * You can implement custom scroll restoration behavior as follows.
 * ```typescript
 * class AppModule {
 *  constructor(router: Router, viewportScroller: ViewportScroller, store: Store<AppState>) {
 *    router.events.pipe(filter(e => e instanceof Scroll), switchMap(e => {
 *      return store.pipe(first(), timeout(200), map(() => e));
 *    }).subscribe(e => {
 *      if (e.position) {
 *        viewportScroller.scrollToPosition(e.position);
 *      } else if (e.anchor) {
 *        viewportScroller.scrollToAnchor(e.anchor);
 *      } else {
 *        viewportScroller.scrollToPosition([0, 0]);
 *      }
 *    });
 *  }
 * }
 * ```
 *
 * You can also implement component-specific scrolling like this:
 *
 * ```typescript
 * class ListComponent {
 *   list: any[];
 *   constructor(router: Router, viewportScroller: ViewportScroller, fetcher: ListFetcher) {
 *     const scrollEvents = router.events.filter(e => e instanceof Scroll);
 *     listFetcher.fetch().pipe(withLatestFrom(scrollEvents)).subscribe(([list, e]) => {
 *       this.list = list;
 *       if (e.position) {
 *         viewportScroller.scrollToPosition(e.position);
 *       } else {
 *         viewportScroller.scrollToPosition([0, 0]);
 *       }
 *     });
 *   }
 * }
 * @type {?|undefined}
 */
ExtraOptions.prototype.scrollPositionRestoration;
/**
 * Configures if the router should scroll to the element when the url has a fragment.
 *
 * * 'disabled'--does nothing (default).
 * * 'enabled'--scrolls to the element. This option will be the default in the future.
 *
 * Anchor scrolling does not happen on 'popstate'. Instead, we restore the position
 * that we stored or scroll to the top.
 * @type {?|undefined}
 */
ExtraOptions.prototype.anchorScrolling;
/**
 * Configures the scroll offset the router will use when scrolling to an element.
 *
 * When given a tuple with two numbers, the router will always use the numbers.
 * When given a function, the router will invoke the function every time it restores scroll
 * position.
 * @type {?|undefined}
 */
ExtraOptions.prototype.scrollOffset;
/**
 * Defines how the router merges params, data and resolved data from parent to child
 * routes. Available options are:
 *
 * - `'emptyOnly'`, the default, only inherits parent params for path-less or component-less
 *   routes.
 * - `'always'`, enables unconditional inheritance of parent params.
 * @type {?|undefined}
 */
ExtraOptions.prototype.paramsInheritanceStrategy;
/**
 * A custom malformed uri error handler function. This handler is invoked when encodedURI contains
 * invalid character sequences. The default implementation is to redirect to the root url dropping
 * any path or param info. This function passes three parameters:
 *
 * - `'URIError'` - Error thrown when parsing a bad URL
 * - `'UrlSerializer'` - UrlSerializer that’s configured with the router.
 * - `'url'` -  The malformed URL that caused the URIError
 *
 * @type {?|undefined}
 */
ExtraOptions.prototype.malformedUriErrorHandler;
/**
 * Defines when the router updates the browser URL. The default behavior is to update after
 * successful navigation. However, some applications may prefer a mode where the URL gets
 * updated at the beginning of navigation. The most common use case would be updating the
 * URL early so if navigation fails, you can show an error message with the URL that failed.
 * Available options are:
 *
 * - `'deferred'`, the default, updates the browser URL after navigation has finished.
 * - `'eager'`, updates browser URL at the beginning of navigation.
 * @type {?|undefined}
 */
ExtraOptions.prototype.urlUpdateStrategy;
/**
 * Enables a bug fix that corrects relative link resolution in components with empty paths.
 * Example:
 *
 * ```
 * const routes = [
 *   {
 *     path: '',
 *     component: ContainerComponent,
 *     children: [
 *       { path: 'a', component: AComponent },
 *       { path: 'b', component: BComponent },
 *     ]
 *   }
 * ];
 * ```
 *
 * From the `ContainerComponent`, this will not work:
 *
 * `<a [routerLink]="['./a']">Link to A</a>`
 *
 * However, this will work:
 *
 * `<a [routerLink]="['../a']">Link to A</a>`
 *
 * In other words, you're required to use `../` rather than `./`. The current default in v6
 * is `legacy`, and this option will be removed in v7 to default to the corrected behavior.
 * @type {?|undefined}
 */
ExtraOptions.prototype.relativeLinkResolution;
/**
 * @param {?} ref
 * @param {?} urlSerializer
 * @param {?} contexts
 * @param {?} location
 * @param {?} injector
 * @param {?} loader
 * @param {?} compiler
 * @param {?} config
 * @param {?=} opts
 * @param {?=} urlHandlingStrategy
 * @param {?=} routeReuseStrategy
 * @return {?}
 */
export function setupRouter(ref, urlSerializer, contexts, location, injector, loader, compiler, config, opts = {}, urlHandlingStrategy, routeReuseStrategy) {
    /** @type {?} */
    const router = new Router(null, urlSerializer, contexts, location, injector, loader, compiler, flatten(config));
    if (urlHandlingStrategy) {
        router.urlHandlingStrategy = urlHandlingStrategy;
    }
    if (routeReuseStrategy) {
        router.routeReuseStrategy = routeReuseStrategy;
    }
    if (opts.errorHandler) {
        router.errorHandler = opts.errorHandler;
    }
    if (opts.malformedUriErrorHandler) {
        router.malformedUriErrorHandler = opts.malformedUriErrorHandler;
    }
    if (opts.enableTracing) {
        /** @type {?} */
        const dom = getDOM();
        router.events.subscribe((e) => {
            dom.logGroup(`Router Event: ${((/** @type {?} */ (e.constructor))).name}`);
            dom.log(e.toString());
            dom.log(e);
            dom.logGroupEnd();
        });
    }
    if (opts.onSameUrlNavigation) {
        router.onSameUrlNavigation = opts.onSameUrlNavigation;
    }
    if (opts.paramsInheritanceStrategy) {
        router.paramsInheritanceStrategy = opts.paramsInheritanceStrategy;
    }
    if (opts.urlUpdateStrategy) {
        router.urlUpdateStrategy = opts.urlUpdateStrategy;
    }
    if (opts.relativeLinkResolution) {
        router.relativeLinkResolution = opts.relativeLinkResolution;
    }
    return router;
}
/**
 * @param {?} router
 * @return {?}
 */
export function rootRoute(router) {
    return router.routerState.root;
}
/**
 * To initialize the router properly we need to do in two steps:
 *
 * We need to start the navigation in a APP_INITIALIZER to block the bootstrap if
 * a resolver or a guards executes asynchronously. Second, we need to actually run
 * activation in a BOOTSTRAP_LISTENER. We utilize the afterPreactivation
 * hook provided by the router to do that.
 *
 * The router navigation starts, reaches the point when preactivation is done, and then
 * pauses. It waits for the hook to be resolved. We then resolve it only in a bootstrap listener.
 */
export class RouterInitializer {
    /**
     * @param {?} injector
     */
    constructor(injector) {
        this.injector = injector;
        this.initNavigation = false;
        this.resultOfPreactivationDone = new Subject();
    }
    /**
     * @return {?}
     */
    appInitializer() {
        /** @type {?} */
        const p = this.injector.get(LOCATION_INITIALIZED, Promise.resolve(null));
        return p.then(() => {
            /** @type {?} */
            let resolve = /** @type {?} */ ((null));
            /** @type {?} */
            const res = new Promise(r => resolve = r);
            /** @type {?} */
            const router = this.injector.get(Router);
            /** @type {?} */
            const opts = this.injector.get(ROUTER_CONFIGURATION);
            if (this.isLegacyDisabled(opts) || this.isLegacyEnabled(opts)) {
                resolve(true);
            }
            else if (opts.initialNavigation === 'disabled') {
                router.setUpLocationChangeListener();
                resolve(true);
            }
            else if (opts.initialNavigation === 'enabled') {
                router.hooks.afterPreactivation = () => {
                    // only the initial navigation should be delayed
                    if (!this.initNavigation) {
                        this.initNavigation = true;
                        resolve(true);
                        return this.resultOfPreactivationDone;
                        // subsequent navigations should not be delayed
                    }
                    else {
                        return /** @type {?} */ (of(null));
                    }
                };
                router.initialNavigation();
            }
            else {
                throw new Error(`Invalid initialNavigation options: '${opts.initialNavigation}'`);
            }
            return res;
        });
    }
    /**
     * @param {?} bootstrappedComponentRef
     * @return {?}
     */
    bootstrapListener(bootstrappedComponentRef) {
        /** @type {?} */
        const opts = this.injector.get(ROUTER_CONFIGURATION);
        /** @type {?} */
        const preloader = this.injector.get(RouterPreloader);
        /** @type {?} */
        const routerScroller = this.injector.get(RouterScroller);
        /** @type {?} */
        const router = this.injector.get(Router);
        /** @type {?} */
        const ref = this.injector.get(ApplicationRef);
        if (bootstrappedComponentRef !== ref.components[0]) {
            return;
        }
        if (this.isLegacyEnabled(opts)) {
            router.initialNavigation();
        }
        else if (this.isLegacyDisabled(opts)) {
            router.setUpLocationChangeListener();
        }
        preloader.setUpPreloading();
        routerScroller.init();
        router.resetRootComponentType(ref.componentTypes[0]);
        this.resultOfPreactivationDone.next(/** @type {?} */ ((null)));
        this.resultOfPreactivationDone.complete();
    }
    /**
     * @param {?} opts
     * @return {?}
     */
    isLegacyEnabled(opts) {
        return opts.initialNavigation === 'legacy_enabled' || opts.initialNavigation === true ||
            opts.initialNavigation === undefined;
    }
    /**
     * @param {?} opts
     * @return {?}
     */
    isLegacyDisabled(opts) {
        return opts.initialNavigation === 'legacy_disabled' || opts.initialNavigation === false;
    }
}
RouterInitializer.decorators = [
    { type: Injectable },
];
/** @nocollapse */
RouterInitializer.ctorParameters = () => [
    { type: Injector }
];
if (false) {
    /** @type {?} */
    RouterInitializer.prototype.initNavigation;
    /** @type {?} */
    RouterInitializer.prototype.resultOfPreactivationDone;
    /** @type {?} */
    RouterInitializer.prototype.injector;
}
/**
 * @param {?} r
 * @return {?}
 */
export function getAppInitializer(r) {
    return r.appInitializer.bind(r);
}
/**
 * @param {?} r
 * @return {?}
 */
export function getBootstrapListener(r) {
    return r.bootstrapListener.bind(r);
}
/** *
 * A token for the router initializer that will be called after the app is bootstrapped.
 *
 * \@experimental
  @type {?} */
export const ROUTER_INITIALIZER = new InjectionToken('Router Initializer');
/**
 * @return {?}
 */
export function provideRouterInitializer() {
    return [
        RouterInitializer,
        {
            provide: APP_INITIALIZER,
            multi: true,
            useFactory: getAppInitializer,
            deps: [RouterInitializer]
        },
        { provide: ROUTER_INITIALIZER, useFactory: getBootstrapListener, deps: [RouterInitializer] },
        { provide: APP_BOOTSTRAP_LISTENER, multi: true, useExisting: ROUTER_INITIALIZER },
    ];
}
//# sourceMappingURL=router_module.js.map