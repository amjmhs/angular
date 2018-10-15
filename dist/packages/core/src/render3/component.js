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
import { assertComponentType, assertDefined } from './assert';
import { queueInitHooks, queueLifecycleHooks } from './hooks';
import { CLEAN_PROMISE, ROOT_DIRECTIVE_INDICES, _getComponentHostLElementNode, baseDirectiveCreate, createLViewData, createTView, detectChangesInternal, enterView, executeInitAndContentHooks, getRootView, hostElement, initChangeDetectorIfExisting, leaveView, locateHostElement, setHostBindings, } from './instructions';
import { domRendererFactory3 } from './interfaces/renderer';
import { INJECTOR, CONTEXT, TVIEW } from './interfaces/view';
import { stringify } from './util';
/**
 * Options that control how the component should be bootstrapped.
 * @record
 */
export function CreateComponentOptions() { }
/**
 * Which renderer factory to use.
 * @type {?|undefined}
 */
CreateComponentOptions.prototype.rendererFactory;
/**
 * A custom sanitizer instance
 * @type {?|undefined}
 */
CreateComponentOptions.prototype.sanitizer;
/**
 * Host element on which the component will be bootstrapped. If not specified,
 * the component definition's `tag` is used to query the existing DOM for the
 * element to bootstrap.
 * @type {?|undefined}
 */
CreateComponentOptions.prototype.host;
/**
 * Module injector for the component. If unspecified, the injector will be NULL_INJECTOR.
 * @type {?|undefined}
 */
CreateComponentOptions.prototype.injector;
/**
 * List of features to be applied to the created component. Features are simply
 * functions that decorate a component with a certain behavior.
 *
 * Typically, the features in this list are features that cannot be added to the
 * other features list in the component definition because they rely on other factors.
 *
 * Example: `RootLifecycleHooks` is a function that adds lifecycle hook capabilities
 * to root components in a tree-shakable way. It cannot be added to the component
 * features list because there's no way of knowing when the component will be used as
 * a root component.
 * @type {?|undefined}
 */
CreateComponentOptions.prototype.hostFeatures;
/**
 * A function which is used to schedule change detection work in the future.
 *
 * When marking components as dirty, it is necessary to schedule the work of
 * change detection in the future. This is done to coalesce multiple
 * {\@link markDirty} calls into a single changed detection processing.
 *
 * The default value of the scheduler is the `requestAnimationFrame` function.
 *
 * It is also useful to override this function for testing purposes.
 * @type {?|undefined}
 */
CreateComponentOptions.prototype.scheduler;
/** @type {?} */
export const NULL_INJECTOR = {
    get: (token, notFoundValue) => {
        throw new Error('NullInjector: Not found: ' + stringify(token));
    }
};
/**
 * Bootstraps a Component into an existing host element and returns an instance
 * of the component.
 *
 * Use this function to bootstrap a component into the DOM tree. Each invocation
 * of this function will create a separate tree of components, injectors and
 * change detection cycles and lifetimes. To dynamically insert a new component
 * into an existing tree such that it shares the same injection, change detection
 * and object lifetime, use {\@link ViewContainer#createComponent}.
 *
 * @template T
 * @param {?} componentType Component to bootstrap
 * @param {?=} opts
 * @return {?}
 */
export function renderComponent(componentType /* Type as workaround for: Microsoft/TypeScript/issues/4881 */, opts = {}) {
    ngDevMode && assertComponentType(componentType);
    /** @type {?} */
    const rendererFactory = opts.rendererFactory || domRendererFactory3;
    /** @type {?} */
    const sanitizer = opts.sanitizer || null;
    /** @type {?} */
    const componentDef = /** @type {?} */ ((/** @type {?} */ (componentType)).ngComponentDef);
    if (componentDef.type != componentType)
        componentDef.type = componentType;
    /** @type {?} */
    let component;
    /** @type {?} */
    const componentTag = /** @type {?} */ (((/** @type {?} */ ((componentDef.selectors))[0]))[0]);
    /** @type {?} */
    const hostNode = locateHostElement(rendererFactory, opts.host || componentTag);
    /** @type {?} */
    const rootContext = createRootContext(opts.scheduler || requestAnimationFrame.bind(window));
    /** @type {?} */
    const rootView = createLViewData(rendererFactory.createRenderer(hostNode, componentDef.rendererType), createTView(-1, null, null, null, null), rootContext, componentDef.onPush ? 4 /* Dirty */ : 2 /* CheckAlways */);
    rootView[INJECTOR] = opts.injector || null;
    /** @type {?} */
    const oldView = enterView(rootView, /** @type {?} */ ((null)));
    /** @type {?} */
    let elementNode;
    try {
        if (rendererFactory.begin)
            rendererFactory.begin();
        // Create element node at index 0 in data array
        elementNode = hostElement(componentTag, hostNode, componentDef, sanitizer);
        // Create directive instance with factory() and store at index 0 in directives array
        rootContext.components.push(component = /** @type {?} */ (baseDirectiveCreate(0, componentDef.factory(), componentDef)));
        initChangeDetectorIfExisting(elementNode.nodeInjector, component, /** @type {?} */ ((elementNode.data)));
        opts.hostFeatures && opts.hostFeatures.forEach((feature) => feature(component, componentDef));
        executeInitAndContentHooks();
        setHostBindings(ROOT_DIRECTIVE_INDICES);
        detectChangesInternal(/** @type {?} */ (elementNode.data), elementNode, component);
    }
    finally {
        leaveView(oldView);
        if (rendererFactory.end)
            rendererFactory.end();
    }
    return component;
}
/**
 * @param {?} scheduler
 * @return {?}
 */
export function createRootContext(scheduler) {
    return {
        components: [],
        scheduler: scheduler,
        clean: CLEAN_PROMISE,
    };
}
/**
 * Used to enable lifecycle hooks on the root component.
 *
 * Include this feature when calling `renderComponent` if the root component
 * you are rendering has lifecycle hooks defined. Otherwise, the hooks won't
 * be called properly.
 *
 * Example:
 *
 * ```
 * renderComponent(AppComponent, {features: [RootLifecycleHooks]});
 * ```
 * @param {?} component
 * @param {?} def
 * @return {?}
 */
export function LifecycleHooksFeature(component, def) {
    /** @type {?} */
    const elementNode = _getComponentHostLElementNode(component);
    /** @type {?} */
    const tView = elementNode.view[TVIEW];
    queueInitHooks(0, def.onInit, def.doCheck, tView);
    queueLifecycleHooks(elementNode.tNode.flags, tView);
}
/**
 * Retrieve the root context for any component by walking the parent `LView` until
 * reaching the root `LView`.
 *
 * @param {?} component any component
 * @return {?}
 */
function getRootContext(component) {
    /** @type {?} */
    const rootContext = /** @type {?} */ (getRootView(component)[CONTEXT]);
    ngDevMode && assertDefined(rootContext, 'rootContext');
    return rootContext;
}
/**
 * Retrieve the host element of the component.
 *
 * Use this function to retrieve the host element of the component. The host
 * element is the element which the component is associated with.
 *
 * @template T
 * @param {?} component Component for which the host element should be retrieved.
 * @return {?}
 */
export function getHostElement(component) {
    return /** @type {?} */ (_getComponentHostLElementNode(component).native);
}
/**
 * Retrieves the rendered text for a given component.
 *
 * This function retrieves the host element of a component and
 * and then returns the `textContent` for that element. This implies
 * that the text returned will include re-projected content of
 * the component as well.
 *
 * @param {?} component The component to return the content text for.
 * @return {?}
 */
export function getRenderedText(component) {
    /** @type {?} */
    const hostElement = getHostElement(component);
    return hostElement.textContent || '';
}
/**
 * Wait on component until it is rendered.
 *
 * This function returns a `Promise` which is resolved when the component's
 * change detection is executed. This is determined by finding the scheduler
 * associated with the `component`'s render tree and waiting until the scheduler
 * flushes. If nothing is scheduled, the function returns a resolved promise.
 *
 * Example:
 * ```
 * await whenRendered(myComponent);
 * ```
 *
 * @param {?} component Component to wait upon
 * @return {?} Promise which resolves when the component is rendered.
 */
export function whenRendered(component) {
    return getRootContext(component).clean;
}
//# sourceMappingURL=component.js.map