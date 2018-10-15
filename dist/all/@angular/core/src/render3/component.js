"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = require("./assert");
var hooks_1 = require("./hooks");
var instructions_1 = require("./instructions");
var renderer_1 = require("./interfaces/renderer");
var view_1 = require("./interfaces/view");
var util_1 = require("./util");
// TODO: A hack to not pull in the NullInjector from @angular/core.
exports.NULL_INJECTOR = {
    get: function (token, notFoundValue) {
        throw new Error('NullInjector: Not found: ' + util_1.stringify(token));
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
 * and object lifetime, use {@link ViewContainer#createComponent}.
 *
 * @param componentType Component to bootstrap
 * @param options Optional parameters which control bootstrapping
 */
function renderComponent(componentType /* Type as workaround for: Microsoft/TypeScript/issues/4881 */, opts) {
    if (opts === void 0) { opts = {}; }
    ngDevMode && assert_1.assertComponentType(componentType);
    var rendererFactory = opts.rendererFactory || renderer_1.domRendererFactory3;
    var sanitizer = opts.sanitizer || null;
    var componentDef = componentType.ngComponentDef;
    if (componentDef.type != componentType)
        componentDef.type = componentType;
    var component;
    // The first index of the first selector is the tag name.
    var componentTag = componentDef.selectors[0][0];
    var hostNode = instructions_1.locateHostElement(rendererFactory, opts.host || componentTag);
    var rootContext = createRootContext(opts.scheduler || requestAnimationFrame.bind(window));
    var rootView = instructions_1.createLViewData(rendererFactory.createRenderer(hostNode, componentDef.rendererType), instructions_1.createTView(-1, null, null, null, null), rootContext, componentDef.onPush ? 4 /* Dirty */ : 2 /* CheckAlways */);
    rootView[view_1.INJECTOR] = opts.injector || null;
    var oldView = instructions_1.enterView(rootView, null);
    var elementNode;
    try {
        if (rendererFactory.begin)
            rendererFactory.begin();
        // Create element node at index 0 in data array
        elementNode = instructions_1.hostElement(componentTag, hostNode, componentDef, sanitizer);
        // Create directive instance with factory() and store at index 0 in directives array
        rootContext.components.push(component = instructions_1.baseDirectiveCreate(0, componentDef.factory(), componentDef));
        instructions_1.initChangeDetectorIfExisting(elementNode.nodeInjector, component, elementNode.data);
        opts.hostFeatures && opts.hostFeatures.forEach(function (feature) { return feature(component, componentDef); });
        instructions_1.executeInitAndContentHooks();
        instructions_1.setHostBindings(instructions_1.ROOT_DIRECTIVE_INDICES);
        instructions_1.detectChangesInternal(elementNode.data, elementNode, component);
    }
    finally {
        instructions_1.leaveView(oldView);
        if (rendererFactory.end)
            rendererFactory.end();
    }
    return component;
}
exports.renderComponent = renderComponent;
function createRootContext(scheduler) {
    return {
        components: [],
        scheduler: scheduler,
        clean: instructions_1.CLEAN_PROMISE,
    };
}
exports.createRootContext = createRootContext;
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
 */
function LifecycleHooksFeature(component, def) {
    var elementNode = instructions_1._getComponentHostLElementNode(component);
    // Root component is always created at dir index 0
    var tView = elementNode.view[view_1.TVIEW];
    hooks_1.queueInitHooks(0, def.onInit, def.doCheck, tView);
    hooks_1.queueLifecycleHooks(elementNode.tNode.flags, tView);
}
exports.LifecycleHooksFeature = LifecycleHooksFeature;
/**
 * Retrieve the root context for any component by walking the parent `LView` until
 * reaching the root `LView`.
 *
 * @param component any component
 */
function getRootContext(component) {
    var rootContext = instructions_1.getRootView(component)[view_1.CONTEXT];
    ngDevMode && assert_1.assertDefined(rootContext, 'rootContext');
    return rootContext;
}
/**
 * Retrieve the host element of the component.
 *
 * Use this function to retrieve the host element of the component. The host
 * element is the element which the component is associated with.
 *
 * @param component Component for which the host element should be retrieved.
 */
function getHostElement(component) {
    return instructions_1._getComponentHostLElementNode(component).native;
}
exports.getHostElement = getHostElement;
/**
 * Retrieves the rendered text for a given component.
 *
 * This function retrieves the host element of a component and
 * and then returns the `textContent` for that element. This implies
 * that the text returned will include re-projected content of
 * the component as well.
 *
 * @param component The component to return the content text for.
 */
function getRenderedText(component) {
    var hostElement = getHostElement(component);
    return hostElement.textContent || '';
}
exports.getRenderedText = getRenderedText;
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
 * @param component Component to wait upon
 * @returns Promise which resolves when the component is rendered.
 */
function whenRendered(component) {
    return getRootContext(component).clean;
}
exports.whenRendered = whenRendered;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zcmMvcmVuZGVyMy9jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFRSCxtQ0FBNEQ7QUFDNUQsaUNBQTREO0FBQzVELCtDQUE2VDtBQUc3VCxrREFBc0Y7QUFDdEYsMENBQStGO0FBQy9GLCtCQUFpQztBQWlEakMsbUVBQW1FO0FBQ3RELFFBQUEsYUFBYSxHQUFhO0lBQ3JDLEdBQUcsRUFBRSxVQUFDLEtBQVUsRUFBRSxhQUFtQjtRQUNuQyxNQUFNLElBQUksS0FBSyxDQUFDLDJCQUEyQixHQUFHLGdCQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUNsRSxDQUFDO0NBQ0YsQ0FBQztBQUVGOzs7Ozs7Ozs7Ozs7R0FZRztBQUNILHlCQUNJLGFBQ1csQ0FBQSw4REFBOEQsRUFFekUsSUFBaUM7SUFBakMscUJBQUEsRUFBQSxTQUFpQztJQUNuQyxTQUFTLElBQUksNEJBQW1CLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDaEQsSUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLGVBQWUsSUFBSSw4QkFBbUIsQ0FBQztJQUNwRSxJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQztJQUN6QyxJQUFNLFlBQVksR0FDYixhQUFrQyxDQUFDLGNBQXlDLENBQUM7SUFDbEYsSUFBSSxZQUFZLENBQUMsSUFBSSxJQUFJLGFBQWE7UUFBRSxZQUFZLENBQUMsSUFBSSxHQUFHLGFBQWEsQ0FBQztJQUMxRSxJQUFJLFNBQVksQ0FBQztJQUNqQix5REFBeUQ7SUFDekQsSUFBTSxZQUFZLEdBQUcsWUFBWSxDQUFDLFNBQVcsQ0FBQyxDQUFDLENBQUcsQ0FBQyxDQUFDLENBQVcsQ0FBQztJQUNoRSxJQUFNLFFBQVEsR0FBRyxnQ0FBaUIsQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLElBQUksSUFBSSxZQUFZLENBQUMsQ0FBQztJQUMvRSxJQUFNLFdBQVcsR0FBRyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLHFCQUFxQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBRTVGLElBQU0sUUFBUSxHQUFjLDhCQUFlLENBQ3ZDLGVBQWUsQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUFFLFlBQVksQ0FBQyxZQUFZLENBQUMsRUFDbkUsMEJBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxXQUFXLEVBQ3BELFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxlQUFrQixDQUFDLG9CQUF1QixDQUFDLENBQUM7SUFDckUsUUFBUSxDQUFDLGVBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDO0lBRTNDLElBQU0sT0FBTyxHQUFHLHdCQUFTLENBQUMsUUFBUSxFQUFFLElBQU0sQ0FBQyxDQUFDO0lBQzVDLElBQUksV0FBeUIsQ0FBQztJQUM5QixJQUFJO1FBQ0YsSUFBSSxlQUFlLENBQUMsS0FBSztZQUFFLGVBQWUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUVuRCwrQ0FBK0M7UUFDL0MsV0FBVyxHQUFHLDBCQUFXLENBQUMsWUFBWSxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFFM0Usb0ZBQW9GO1FBQ3BGLFdBQVcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUN2QixTQUFTLEdBQUcsa0NBQW1CLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxPQUFPLEVBQUUsRUFBRSxZQUFZLENBQU0sQ0FBQyxDQUFDO1FBQ25GLDJDQUE0QixDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUUsU0FBUyxFQUFFLFdBQVcsQ0FBQyxJQUFNLENBQUMsQ0FBQztRQUV0RixJQUFJLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFVBQUMsT0FBTyxJQUFLLE9BQUEsT0FBTyxDQUFDLFNBQVMsRUFBRSxZQUFZLENBQUMsRUFBaEMsQ0FBZ0MsQ0FBQyxDQUFDO1FBRTlGLHlDQUEwQixFQUFFLENBQUM7UUFDN0IsOEJBQWUsQ0FBQyxxQ0FBc0IsQ0FBQyxDQUFDO1FBQ3hDLG9DQUFxQixDQUFDLFdBQVcsQ0FBQyxJQUFpQixFQUFFLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQztLQUM5RTtZQUFTO1FBQ1Isd0JBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNuQixJQUFJLGVBQWUsQ0FBQyxHQUFHO1lBQUUsZUFBZSxDQUFDLEdBQUcsRUFBRSxDQUFDO0tBQ2hEO0lBRUQsT0FBTyxTQUFTLENBQUM7QUFDbkIsQ0FBQztBQS9DRCwwQ0ErQ0M7QUFFRCwyQkFBa0MsU0FBdUM7SUFDdkUsT0FBTztRQUNMLFVBQVUsRUFBRSxFQUFFO1FBQ2QsU0FBUyxFQUFFLFNBQVM7UUFDcEIsS0FBSyxFQUFFLDRCQUFhO0tBQ3JCLENBQUM7QUFDSixDQUFDO0FBTkQsOENBTUM7QUFFRDs7Ozs7Ozs7Ozs7O0dBWUc7QUFDSCwrQkFBc0MsU0FBYyxFQUFFLEdBQThCO0lBQ2xGLElBQU0sV0FBVyxHQUFHLDRDQUE2QixDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBRTdELGtEQUFrRDtJQUNsRCxJQUFNLEtBQUssR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLFlBQUssQ0FBQyxDQUFDO0lBQ3RDLHNCQUFjLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNsRCwyQkFBbUIsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztBQUN0RCxDQUFDO0FBUEQsc0RBT0M7QUFFRDs7Ozs7R0FLRztBQUNILHdCQUF3QixTQUFjO0lBQ3BDLElBQU0sV0FBVyxHQUFHLDBCQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsY0FBTyxDQUFnQixDQUFDO0lBQ25FLFNBQVMsSUFBSSxzQkFBYSxDQUFDLFdBQVcsRUFBRSxhQUFhLENBQUMsQ0FBQztJQUN2RCxPQUFPLFdBQVcsQ0FBQztBQUNyQixDQUFDO0FBRUQ7Ozs7Ozs7R0FPRztBQUNILHdCQUFrQyxTQUFZO0lBQzVDLE9BQU8sNENBQTZCLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBYSxDQUFDO0FBQ2hFLENBQUM7QUFGRCx3Q0FFQztBQUVEOzs7Ozs7Ozs7R0FTRztBQUNILHlCQUFnQyxTQUFjO0lBQzVDLElBQU0sV0FBVyxHQUFHLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUM5QyxPQUFPLFdBQVcsQ0FBQyxXQUFXLElBQUksRUFBRSxDQUFDO0FBQ3ZDLENBQUM7QUFIRCwwQ0FHQztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUNILHNCQUE2QixTQUFjO0lBQ3pDLE9BQU8sY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssQ0FBQztBQUN6QyxDQUFDO0FBRkQsb0NBRUMifQ==