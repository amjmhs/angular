"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var by_1 = require("@angular/platform-browser/src/dom/debug/by");
var browser_util_1 = require("@angular/platform-browser/testing/src/browser_util");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
var dom_renderer_1 = require("../../src/dom/dom_renderer");
{
    describe('DefaultDomRendererV2', function () {
        if (isNode)
            return;
        var renderer;
        beforeEach(function () {
            testing_1.TestBed.configureTestingModule({
                declarations: [
                    TestCmp, SomeApp, CmpEncapsulationEmulated, CmpEncapsulationNative, CmpEncapsulationNone,
                    CmpEncapsulationNative
                ]
            });
            renderer = testing_1.TestBed.createComponent(TestCmp).componentInstance.renderer;
        });
        describe('setAttribute', function () {
            describe('with namespace', function () {
                it('xmlns', function () { return shouldSetAttributeWithNs('xmlns'); });
                it('xml', function () { return shouldSetAttributeWithNs('xml'); });
                it('svg', function () { return shouldSetAttributeWithNs('svg'); });
                it('xhtml', function () { return shouldSetAttributeWithNs('xhtml'); });
                it('xlink', function () { return shouldSetAttributeWithNs('xlink'); });
                it('unknown', function () {
                    var div = document.createElement('div');
                    matchers_1.expect(div.hasAttribute('unknown:name')).toBe(false);
                    renderer.setAttribute(div, 'name', 'value', 'unknown');
                    matchers_1.expect(div.getAttribute('unknown:name')).toBe('value');
                });
                function shouldSetAttributeWithNs(namespace) {
                    var namespaceUri = dom_renderer_1.NAMESPACE_URIS[namespace];
                    var div = document.createElement('div');
                    matchers_1.expect(div.hasAttributeNS(namespaceUri, 'name')).toBe(false);
                    renderer.setAttribute(div, 'name', 'value', namespace);
                    matchers_1.expect(div.getAttributeNS(namespaceUri, 'name')).toBe('value');
                }
            });
        });
        describe('removeAttribute', function () {
            describe('with namespace', function () {
                it('xmlns', function () { return shouldRemoveAttributeWithNs('xmlns'); });
                it('xml', function () { return shouldRemoveAttributeWithNs('xml'); });
                it('svg', function () { return shouldRemoveAttributeWithNs('svg'); });
                it('xhtml', function () { return shouldRemoveAttributeWithNs('xhtml'); });
                it('xlink', function () { return shouldRemoveAttributeWithNs('xlink'); });
                it('unknown', function () {
                    var div = document.createElement('div');
                    div.setAttribute('unknown:name', 'value');
                    matchers_1.expect(div.hasAttribute('unknown:name')).toBe(true);
                    renderer.removeAttribute(div, 'name', 'unknown');
                    matchers_1.expect(div.hasAttribute('unknown:name')).toBe(false);
                });
                function shouldRemoveAttributeWithNs(namespace) {
                    var namespaceUri = dom_renderer_1.NAMESPACE_URIS[namespace];
                    var div = document.createElement('div');
                    div.setAttributeNS(namespaceUri, namespace + ":name", 'value');
                    matchers_1.expect(div.hasAttributeNS(namespaceUri, 'name')).toBe(true);
                    renderer.removeAttribute(div, 'name', namespace);
                    matchers_1.expect(div.hasAttributeNS(namespaceUri, 'name')).toBe(false);
                }
            });
        });
        // other browsers don't support shadow dom
        if (browser_util_1.browserDetection.isChromeDesktop) {
            it('should allow to style components with emulated encapsulation and no encapsulation inside of components with shadow DOM', function () {
                var fixture = testing_1.TestBed.createComponent(SomeApp);
                var cmp = fixture.debugElement.query(by_1.By.css('cmp-native')).nativeElement;
                var native = cmp.shadowRoot.querySelector('.native');
                matchers_1.expect(window.getComputedStyle(native).color).toEqual('rgb(255, 0, 0)');
                var emulated = cmp.shadowRoot.querySelector('.emulated');
                matchers_1.expect(window.getComputedStyle(emulated).color).toEqual('rgb(0, 0, 255)');
                var none = cmp.shadowRoot.querySelector('.none');
                matchers_1.expect(window.getComputedStyle(none).color).toEqual('rgb(0, 255, 0)');
            });
        }
    });
}
var CmpEncapsulationNative = /** @class */ (function () {
    function CmpEncapsulationNative() {
    }
    CmpEncapsulationNative = __decorate([
        core_1.Component({
            selector: 'cmp-native',
            template: "<div class=\"native\"></div><cmp-emulated></cmp-emulated><cmp-none></cmp-none>",
            styles: [".native { color: red; }"],
            encapsulation: core_1.ViewEncapsulation.Native
        })
    ], CmpEncapsulationNative);
    return CmpEncapsulationNative;
}());
var CmpEncapsulationEmulated = /** @class */ (function () {
    function CmpEncapsulationEmulated() {
    }
    CmpEncapsulationEmulated = __decorate([
        core_1.Component({
            selector: 'cmp-emulated',
            template: "<div class=\"emulated\"></div>",
            styles: [".emulated { color: blue; }"],
            encapsulation: core_1.ViewEncapsulation.Emulated
        })
    ], CmpEncapsulationEmulated);
    return CmpEncapsulationEmulated;
}());
var CmpEncapsulationNone = /** @class */ (function () {
    function CmpEncapsulationNone() {
    }
    CmpEncapsulationNone = __decorate([
        core_1.Component({
            selector: 'cmp-none',
            template: "<div class=\"none\"></div>",
            styles: [".none { color: lime; }"],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], CmpEncapsulationNone);
    return CmpEncapsulationNone;
}());
var CmpEncapsulationShadow = /** @class */ (function () {
    function CmpEncapsulationShadow() {
    }
    CmpEncapsulationShadow = __decorate([
        core_1.Component({
            selector: 'cmp-shadow',
            template: "<div class=\"shadow\"></div><cmp-emulated></cmp-emulated><cmp-none></cmp-none>",
            styles: [".native { color: red; }"],
            encapsulation: core_1.ViewEncapsulation.ShadowDom
        })
    ], CmpEncapsulationShadow);
    return CmpEncapsulationShadow;
}());
var SomeApp = /** @class */ (function () {
    function SomeApp() {
    }
    SomeApp = __decorate([
        core_1.Component({
            selector: 'some-app',
            template: "\n\t  <cmp-native></cmp-native>\n\t  <cmp-emulated></cmp-emulated>\n\t  <cmp-none></cmp-none>\n  ",
        })
    ], SomeApp);
    return SomeApp;
}());
exports.SomeApp = SomeApp;
var TestCmp = /** @class */ (function () {
    function TestCmp(renderer) {
        this.renderer = renderer;
    }
    TestCmp = __decorate([
        core_1.Component({ selector: 'test-cmp', template: '' }),
        __metadata("design:paramtypes", [core_1.Renderer2])
    ], TestCmp);
    return TestCmp;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tX3JlbmRlcmVyX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS1icm93c2VyL3Rlc3QvZG9tL2RvbV9yZW5kZXJlcl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsc0NBQXNFO0FBQ3RFLGlEQUE4QztBQUM5QyxpRUFBOEQ7QUFDOUQsbUZBQW9GO0FBQ3BGLDJFQUFzRTtBQUN0RSwyREFBMEQ7QUFFMUQ7SUFDRSxRQUFRLENBQUMsc0JBQXNCLEVBQUU7UUFDL0IsSUFBSSxNQUFNO1lBQUUsT0FBTztRQUNuQixJQUFJLFFBQW1CLENBQUM7UUFFeEIsVUFBVSxDQUFDO1lBQ1QsaUJBQU8sQ0FBQyxzQkFBc0IsQ0FBQztnQkFDN0IsWUFBWSxFQUFFO29CQUNaLE9BQU8sRUFBRSxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsc0JBQXNCLEVBQUUsb0JBQW9CO29CQUN4RixzQkFBc0I7aUJBQ3ZCO2FBQ0YsQ0FBQyxDQUFDO1lBQ0gsUUFBUSxHQUFHLGlCQUFPLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQztRQUN6RSxDQUFDLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyxjQUFjLEVBQUU7WUFDdkIsUUFBUSxDQUFDLGdCQUFnQixFQUFFO2dCQUN6QixFQUFFLENBQUMsT0FBTyxFQUFFLGNBQU0sT0FBQSx3QkFBd0IsQ0FBQyxPQUFPLENBQUMsRUFBakMsQ0FBaUMsQ0FBQyxDQUFDO2dCQUNyRCxFQUFFLENBQUMsS0FBSyxFQUFFLGNBQU0sT0FBQSx3QkFBd0IsQ0FBQyxLQUFLLENBQUMsRUFBL0IsQ0FBK0IsQ0FBQyxDQUFDO2dCQUNqRCxFQUFFLENBQUMsS0FBSyxFQUFFLGNBQU0sT0FBQSx3QkFBd0IsQ0FBQyxLQUFLLENBQUMsRUFBL0IsQ0FBK0IsQ0FBQyxDQUFDO2dC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