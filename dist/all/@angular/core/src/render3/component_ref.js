"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var injection_token_1 = require("../di/injection_token");
var injector_1 = require("../di/injector");
var component_factory_1 = require("../linker/component_factory");
var component_factory_resolver_1 = require("../linker/component_factory_resolver");
var element_ref_1 = require("../linker/element_ref");
var api_1 = require("../render/api");
var assert_1 = require("./assert");
var component_1 = require("./component");
var instructions_1 = require("./instructions");
var renderer_1 = require("./interfaces/renderer");
var view_1 = require("./interfaces/view");
var view_ref_1 = require("./view_ref");
var ComponentFactoryResolver = /** @class */ (function (_super) {
    __extends(ComponentFactoryResolver, _super);
    function ComponentFactoryResolver() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ComponentFactoryResolver.prototype.resolveComponentFactory = function (component) {
        ngDevMode && assert_1.assertComponentType(component);
        var componentDef = component.ngComponentDef;
        return new ComponentFactory(componentDef);
    };
    return ComponentFactoryResolver;
}(component_factory_resolver_1.ComponentFactoryResolver));
exports.ComponentFactoryResolver = ComponentFactoryResolver;
function toRefArray(map) {
    var array = [];
    for (var nonMinified in map) {
        if (map.hasOwnProperty(nonMinified)) {
            var minified = map[nonMinified];
            array.push({ propName: minified, templateName: nonMinified });
        }
    }
    return array;
}
/**
 * Default {@link RootContext} for all components rendered with {@link renderComponent}.
 */
exports.ROOT_CONTEXT = new injection_token_1.InjectionToken('ROOT_CONTEXT_TOKEN', { providedIn: 'root', factory: function () { return component_1.createRootContext(injector_1.inject(exports.SCHEDULER)); } });
/**
 * A change detection scheduler token for {@link RootContext}. This token is the default value used
 * for the default `RootContext` found in the {@link ROOT_CONTEXT} token.
 */
exports.SCHEDULER = new injection_token_1.InjectionToken('SCHEDULER_TOKEN', { providedIn: 'root', factory: function () { return requestAnimationFrame.bind(window); } });
/**
 * Render3 implementation of {@link viewEngine_ComponentFactory}.
 */
var ComponentFactory = /** @class */ (function (_super) {
    __extends(ComponentFactory, _super);
    function ComponentFactory(componentDef) {
        var _this = _super.call(this) || this;
        _this.componentDef = componentDef;
        _this.componentType = componentDef.type;
        _this.selector = componentDef.selectors[0][0];
        _this.ngContentSelectors = [];
        return _this;
    }
    Object.defineProperty(ComponentFactory.prototype, "inputs", {
        get: function () {
            return toRefArray(this.componentDef.inputs);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ComponentFactory.prototype, "outputs", {
        get: function () {
            return toRefArray(this.componentDef.outputs);
        },
        enumerable: true,
        configurable: true
    });
    ComponentFactory.prototype.create = function (injector, projectableNodes, rootSelectorOrNode, ngModule) {
        var isInternalRootView = rootSelectorOrNode === undefined;
        var rendererFactory = ngModule ? ngModule.injector.get(api_1.RendererFactory2) : renderer_1.domRendererFactory3;
        var hostNode = isInternalRootView ?
            instructions_1.elementCreate(this.selector, rendererFactory.createRenderer(null, this.componentDef.rendererType)) :
            instructions_1.locateHostElement(rendererFactory, rootSelectorOrNode);
        // The first index of the first selector is the tag name.
        var componentTag = this.componentDef.selectors[0][0];
        var rootContext = ngModule && !isInternalRootView ?
            ngModule.injector.get(exports.ROOT_CONTEXT) :
            component_1.createRootContext(requestAnimationFrame.bind(window));
        // Create the root view. Uses empty TView and ContentTemplate.
        var rootView = instructions_1.createLViewData(rendererFactory.createRenderer(hostNode, this.componentDef.rendererType), instructions_1.createTView(-1, null, null, null, null), rootContext, this.componentDef.onPush ? 4 /* Dirty */ : 2 /* CheckAlways */);
        rootView[view_1.INJECTOR] = ngModule && ngModule.injector || null;
        // rootView is the parent when bootstrapping
        var oldView = instructions_1.enterView(rootView, null);
        var component;
        var elementNode;
        try {
            if (rendererFactory.begin)
                rendererFactory.begin();
            // Create element node at index 0 in data array
            elementNode = instructions_1.hostElement(componentTag, hostNode, this.componentDef);
            // Create directive instance with factory() and store at index 0 in directives array
            rootContext.components.push(component = instructions_1.baseDirectiveCreate(0, this.componentDef.factory(), this.componentDef));
            instructions_1.initChangeDetectorIfExisting(elementNode.nodeInjector, component, elementNode.data);
            // TODO: should LifecycleHooksFeature and other host features be generated by the compiler and
            // executed here?
            // Angular 5 reference: https://stackblitz.com/edit/lifecycle-hooks-vcref
            component_1.LifecycleHooksFeature(component, this.componentDef);
            // Transform the arrays of native nodes into a LNode structure that can be consumed by the
            // projection instruction. This is needed to support the reprojection of these nodes.
            if (projectableNodes) {
                var index = 0;
                var projection = elementNode.tNode.projection = [];
                for (var i = 0; i < projectableNodes.length; i++) {
                    var nodeList = projectableNodes[i];
                    var firstTNode = null;
                    var previousTNode = null;
                    for (var j = 0; j < nodeList.length; j++) {
                        var lNode = instructions_1.createLNode(++index, 3 /* Element */, nodeList[j], null, null);
                        if (previousTNode) {
                            previousTNode.next = lNode.tNode;
                        }
                        else {
                            firstTNode = lNode.tNode;
                        }
                        previousTNode = lNode.tNode;
                    }
                    projection.push(firstTNode);
                }
            }
            // Execute the template in creation mode only, and then turn off the CreationMode flag
            instructions_1.renderEmbeddedTemplate(elementNode, elementNode.data[view_1.TVIEW], component, 1 /* Create */);
            elementNode.data[view_1.FLAGS] &= ~1 /* CreationMode */;
        }
        finally {
            instructions_1.enterView(oldView, null);
            if (rendererFactory.end)
                rendererFactory.end();
        }
        var componentRef = new ComponentRef(this.componentType, component, rootView, injector, hostNode);
        if (isInternalRootView) {
            // The host element of the internal root view is attached to the component's host view node
            componentRef.hostView._lViewNode.tNode.child = elementNode.tNode;
        }
        return componentRef;
    };
    return ComponentFactory;
}(component_factory_1.ComponentFactory));
exports.ComponentFactory = ComponentFactory;
/**
 * Represents an instance of a Component created via a {@link ComponentFactory}.
 *
 * `ComponentRef` provides access to the Component Instance as well other objects related to this
 * Component Instance and allows you to destroy the Component Instance via the {@link #destroy}
 * method.
 *
 */
var ComponentRef = /** @class */ (function (_super) {
    __extends(ComponentRef, _super);
    function ComponentRef(componentType, instance, rootView, injector, hostNode) {
        var _this = _super.call(this) || this;
        _this.destroyCbs = [];
        _this.instance = instance;
        /* TODO(jasonaden): This is incomplete, to be adjusted in follow-up PR. Notes from Kara:When
         * ViewRef.detectChanges is called from ApplicationRef.tick, it will call detectChanges at the
         * component instance level. I suspect this means that lifecycle hooks and host bindings on the
         * given component won't work (as these are always called at the level above a component).
         *
         * In render2, ViewRef.detectChanges uses the root view instance for view checks, not the
         * component instance. So passing in the root view (1 level above the component) is sufficient.
         * We might  want to think about creating a fake component for the top level? Or overwrite
         * detectChanges with a function that calls tickRootContext? */
        _this.hostView = _this.changeDetectorRef = new view_ref_1.ViewRef(rootView, instance);
        _this.hostView._lViewNode = instructions_1.createLNode(-1, 2 /* View */, null, null, null, rootView);
        _this.injector = injector;
        _this.location = new element_ref_1.ElementRef(hostNode);
        _this.componentType = componentType;
        return _this;
    }
    ComponentRef.prototype.destroy = function () {
        ngDevMode && assert_1.assertDefined(this.destroyCbs, 'NgModule already destroyed');
        this.destroyCbs.forEach(function (fn) { return fn(); });
        this.destroyCbs = null;
    };
    ComponentRef.prototype.onDestroy = function (callback) {
        ngDevMode && assert_1.assertDefined(this.destroyCbs, 'NgModule already destroyed');
        this.destroyCbs.push(callback);
    };
    return ComponentRef;
}(component_factory_1.ComponentRef));
exports.ComponentRef = ComponentRef;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcG9uZW50X3JlZi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL3JlbmRlcjMvY29tcG9uZW50X3JlZi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7QUFHSCx5REFBcUQ7QUFDckQsMkNBQWdEO0FBQ2hELGlFQUFxSTtBQUNySSxtRkFBcUg7QUFDckgscURBQWlEO0FBRWpELHFDQUErQztBQUcvQyxtQ0FBNEQ7QUFDNUQseUNBQXFFO0FBQ3JFLCtDQUE4TTtBQUc5TSxrREFBb0U7QUFDcEUsMENBQTZGO0FBQzdGLHVDQUFtQztBQUVuQztJQUE4Qyw0Q0FBbUM7SUFBakY7O0lBTUEsQ0FBQztJQUxDLDBEQUF1QixHQUF2QixVQUEyQixTQUFrQjtRQUMzQyxTQUFTLElBQUksNEJBQW1CLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDNUMsSUFBTSxZQUFZLEdBQUksU0FBOEIsQ0FBQyxjQUFjLENBQUM7UUFDcEUsT0FBTyxJQUFJLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFDSCwrQkFBQztBQUFELENBQUMsQUFORCxDQUE4QyxxREFBbUMsR0FNaEY7QUFOWSw0REFBd0I7QUFRckMsb0JBQW9CLEdBQTRCO0lBQzlDLElBQU0sS0FBSyxHQUFnRCxFQUFFLENBQUM7SUFDOUQsS0FBSyxJQUFJLFdBQVcsSUFBSSxHQUFHLEVBQUU7UUFDM0IsSUFBSSxHQUFHLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxFQUFFO1lBQ25DLElBQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNsQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFDLENBQUMsQ0FBQztTQUM3RDtLQUNGO0lBQ0QsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDO0FB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