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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var testing_2 = require("@angular/platform-browser-dynamic/testing");
var dom_adapter_1 = require("@angular/platform-browser/src/dom/dom_adapter");
var dom_renderer_1 = require("@angular/platform-browser/src/dom/dom_renderer");
var testing_3 = require("@angular/platform-browser/testing");
var browser_util_1 = require("@angular/platform-browser/testing/src/browser_util");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
var client_message_broker_1 = require("../../../src/web_workers/shared/client_message_broker");
var render_store_1 = require("../../../src/web_workers/shared/render_store");
var serializer_1 = require("../../../src/web_workers/shared/serializer");
var service_message_broker_1 = require("../../../src/web_workers/shared/service_message_broker");
var renderer_1 = require("../../../src/web_workers/ui/renderer");
var renderer_2 = require("../../../src/web_workers/worker/renderer");
var web_worker_test_util_1 = require("../shared/web_worker_test_util");
var lastCreatedRenderer;
{
    describe('Web Worker Renderer v2', function () {
        // Don't run on server...
        if (!dom_adapter_1.getDOM().supportsDOMEvents())
            return;
        // TODO(tbosch): investigate why this is failing on iOS7 for unrelated reasons
        // Note: it's hard to debug this as SauceLabs starts with iOS8. Maybe drop
        // iOS7 altogether?
        if (browser_util_1.browserDetection.isIOS7)
            return;
        var uiRenderStore;
        var wwRenderStore;
        beforeEach(function () { return core_1.destroyPlatform(); });
        afterEach(function () { return core_1.destroyPlatform(); });
        beforeEach(function () {
            // UI side
            uiRenderStore = new render_store_1.RenderStore();
            var uiInjector = new testing_1.TestBed();
            uiInjector.platform = testing_2.platformBrowserDynamicTesting();
            uiInjector.ngModule = testing_3.BrowserTestingModule;
            uiInjector.configureTestingModule({
                providers: [
                    serializer_1.Serializer,
                    { provide: render_store_1.RenderStore, useValue: uiRenderStore },
                    dom_renderer_1.DomRendererFactory2,
                    { provide: core_1.RendererFactory2, useExisting: dom_renderer_1.DomRendererFactory2 },
                ]
            });
            var uiSerializer = uiInjector.get(serializer_1.Serializer);
            var domRendererFactory = uiInjector.get(core_1.RendererFactory2);
            // Worker side
            lastCreatedRenderer = null;
            wwRenderStore = new render_store_1.RenderStore();
            testing_1.TestBed.configureTestingModule({
                declarations: [MyComp2],
                providers: [
                    serializer_1.Serializer,
                    { provide: render_store_1.RenderStore, useValue: wwRenderStore },
                    {
                        provide: core_1.RendererFactory2,
                        useFactory: function (wwSerializer) { return createWebWorkerRendererFactory2(wwSerializer, uiSerializer, domRendererFactory, uiRenderStore, wwRenderStore); },
                        deps: [serializer_1.Serializer],
                    },
                ],
            });
        });
        function getRenderElement(workerEl) {
            var id = wwRenderStore.serialize(workerEl);
            return uiRenderStore.deserialize(id);
        }
        it('should update text nodes', function () {
            var fixture = testing_1.TestBed.overrideTemplate(MyComp2, '<div>{{ctxProp}}</div>').createComponent(MyComp2);
            var renderEl = getRenderElement(fixture.nativeElement);
            matchers_1.expect(renderEl).toHaveText('');
            fixture.componentInstance.ctxProp = 'Hello World!';
            fixture.detectChanges();
            matchers_1.expect(renderEl).toHaveText('Hello World!');
        });
        it('should update any element property/attributes/class/style(s) independent of the compilation on the root element and other elements', function () {
            var fixture = testing_1.TestBed.overrideTemplate(MyComp2, '<input [title]="y" style="position:absolute">')
                .createComponent(MyComp2);
            var checkSetters = function (componentRef, workerEl) {
                matchers_1.expect(lastCreatedRenderer).not.toBeNull();
                var el = getRenderElement(workerEl);
                lastCreatedRenderer.setProperty(workerEl, 'tabIndex', 1);
                matchers_1.expect(el.tabIndex).toEqual(1);
                lastCreatedRenderer.addClass(workerEl, 'a');
                matchers_1.expect(dom_adapter_1.getDOM().hasClass(el, 'a')).toBe(true);
                lastCreatedRenderer.removeClass(workerEl, 'a');
                matchers_1.expect(dom_adapter_1.getDOM().hasClass(el, 'a')).toBe(false);
                lastCreatedRenderer.setStyle(workerEl, 'width', '10px');
                matchers_1.expect(dom_adapter_1.getDOM().getStyle(el, 'width')).toEqual('10px');
                lastCreatedRenderer.removeStyle(workerEl, 'width');
                matchers_1.expect(dom_adapter_1.getDOM().getStyle(el, 'width')).toEqual('');
                lastCreatedRenderer.setAttribute(workerEl, 'someattr', 'someValue');
                matchers_1.expect(dom_adapter_1.getDOM().getAttribute(el, 'someattr')).toEqual('someValue');
            };
            // root element
            checkSetters(fixture.componentRef, fixture.nativeElement);
            // nested elements
            checkSetters(fixture.componentRef, fixture.debugElement.children[0].nativeElement);
        });
        it('should update any template comment property/attributes', function () {
            var fixture = testing_1.TestBed.overrideTemplate(MyComp2, '<ng-container *ngIf="ctxBoolProp"></ng-container>')
                .createComponent(MyComp2);
            fixture.componentInstance.ctxBoolProp = true;
            fixture.detectChanges();
            var el = getRenderElement(fixture.nativeElement);
            matchers_1.expect(dom_adapter_1.getDOM().getInnerHTML(el)).toContain('"ng-reflect-ng-if": "true"');
        });
        it('should add and remove fragments', function () {
            var fixture = testing_1.TestBed
                .overrideTemplate(MyComp2, '<ng-container *ngIf="ctxBoolProp">hello</ng-container>')
                .createComponent(MyComp2);
            var rootEl = getRenderElement(fixture.nativeElement);
            matchers_1.expect(rootEl).toHaveText('');
            fixture.componentInstance.ctxBoolProp = true;
            fixture.detectChanges();
            matchers_1.expect(rootEl).toHaveText('hello');
            fixture.componentInstance.ctxBoolProp = false;
            fixture.detectChanges();
            matchers_1.expect(rootEl).toHaveText('');
        });
        if (dom_adapter_1.getDOM().supportsDOMEvents()) {
            it('should listen to events', function () {
                var fixture = testing_1.TestBed.overrideTemplate(MyComp2, '<input (change)="ctxNumProp = 1">')
                    .createComponent(MyComp2);
                var el = fixture.debugElement.children[0];
                browser_util_1.dispatchEvent(getRenderElement(el.nativeElement), 'change');
                matchers_1.expect(fixture.componentInstance.ctxNumProp).toBe(1);
                fixture.destroy();
            });
        }
    });
}
var MyComp2 = /** @class */ (function () {
    function MyComp2() {
        this.ctxProp = 'initial value';
        this.ctxNumProp = 0;
        this.ctxBoolProp = false;
    }
    MyComp2 = __decorate([
        core_1.Component({ selector: 'my-comp' })
    ], MyComp2);
    return MyComp2;
}());
function createWebWorkerBrokerFactory(messageBuses, wwSerializer, uiSerializer, domRendererFactory, uiRenderStore) {
    var uiMessageBus = messageBuses.ui;
    var wwMessageBus = messageBuses.worker;
    // set up the worker side
    var wwBrokerFactory = new client_message_broker_1.ClientMessageBrokerFactory(wwMessageBus, wwSerializer);
    // set up the ui side
    var uiBrokerFactory = new service_message_broker_1.ServiceMessageBrokerFactory(uiMessageBus, uiSerializer);
    var renderer = new renderer_1.MessageBasedRenderer2(uiBrokerFactory, uiMessageBus, uiSerializer, uiRenderStore, domRendererFactory);
    renderer.start();
    return wwBrokerFactory;
}
function createWebWorkerRendererFactory2(workerSerializer, uiSerializer, domRendererFactory, uiRenderStore, workerRenderStore) {
    var messageBuses = web_worker_test_util_1.createPairedMessageBuses();
    var brokerFactory = createWebWorkerBrokerFactory(messageBuses, workerSerializer, uiSerializer, domRendererFactory, uiRenderStore);
    var rendererFactory = new RenderFactory(brokerFactory, messageBuses.worker, workerSerializer, workerRenderStore);
    return rendererFactory;
}
var RenderFactory = /** @class */ (function (_super) {
    __extends(RenderFactory, _super);
    function RenderFactory() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RenderFactory.prototype.createRenderer = function (element, type) {
        lastCreatedRenderer = _super.prototype.createRenderer.call(this, element, type);
        return lastCreatedRenderer;
    };
    return RenderFactory;
}(renderer_2.WebWorkerRendererFactory2));
function isOldIE() {
    // note that this only applies to older IEs (not edge)
    return window.document['documentMode'] ? true : false;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVuZGVyZXJfdjJfaW50ZWdyYXRpb25fc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3BsYXRmb3JtLXdlYndvcmtlci90ZXN0L3dlYl93b3JrZXJzL3dvcmtlci9yZW5kZXJlcl92Ml9pbnRlZ3JhdGlvbl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVILHNDQUFtSDtBQUNuSCxpREFBOEM7QUFDOUMscUVBQXdGO0FBQ3hGLDZFQUFxRTtBQUNyRSwrRUFBbUY7QUFDbkYsNkRBQXVFO0FBQ3ZFLG1GQUFtRztBQUNuRywyRUFBc0U7QUFFdEUsK0ZBQWlHO0FBQ2pHLDZFQUF5RTtBQUN6RSx5RUFBc0U7QUFDdEUsaUdBQW1HO0FBQ25HLGlFQUEyRTtBQUMzRSxxRUFBbUY7QUFDbkYsdUVBQTRGO0FBRTVGLElBQUksbUJBQThCLENBQUM7QUFFbkM7SUFDRSxRQUFRLENBQUMsd0JBQXdCLEVBQUU7UUFDakMseUJBQXlCO1FBQ3pCLElBQUksQ0FBQyxvQkFBTSxFQUFFLENBQUMsaUJBQWlCLEVBQUU7WUFBRSxPQUFPO1FBQzFDLDhFQUE4RTtRQUM5RSwwRUFBMEU7UUFDMUUsbUJBQW1CO1FBQ25CLElBQUksK0JBQWdCLENBQUMsTUFBTTtZQUFFLE9BQU87UUFFcEMsSUFBSSxhQUEwQixDQUFDO1FBQy9CLElBQUksYUFBMEIsQ0FBQztRQUUvQixVQUFVLENBQUMsY0FBTSxPQUFBLHNCQUFlLEVBQUUsRUFBakIsQ0FBaUIsQ0FBQyxDQUFDO1FBQ3BDLFNBQVMsQ0FBQyxjQUFNLE9BQUEsc0JBQWUsRUFBRSxFQUFqQixDQUFpQixDQUFDLENBQUM7UUFFbkMsVUFBVSxDQUFDO1lBQ1QsVUFBVTtZQUNWLGFBQWEsR0FBRyxJQUFJLDBCQUFXLEVBQUUsQ0FBQztZQUNsQyxJQUFNLFVBQVUsR0FBRyxJQUFJLGlCQUFPLEVBQUUs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