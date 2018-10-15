"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
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
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var dom_adapter_1 = require("@angular/platform-browser/src/dom/dom_adapter");
var dom_sanitization_service_1 = require("@angular/platform-browser/src/security/dom_sanitization_service");
{
    describe('jit', function () { declareTests({ useJit: true }); });
    describe('no jit', function () { declareTests({ useJit: false }); });
}
var SecuredComponent = /** @class */ (function () {
    function SecuredComponent() {
        this.ctxProp = 'some value';
    }
    SecuredComponent = __decorate([
        core_1.Component({ selector: 'my-comp', template: '' })
    ], SecuredComponent);
    return SecuredComponent;
}());
var OnPrefixDir = /** @class */ (function () {
    function OnPrefixDir() {
    }
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], OnPrefixDir.prototype, "onPrefixedProp", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], OnPrefixDir.prototype, "onclick", void 0);
    OnPrefixDir = __decorate([
        core_1.Directive({ selector: '[onPrefixedProp]' })
    ], OnPrefixDir);
    return OnPrefixDir;
}());
function declareTests(_a) {
    var useJit = _a.useJit;
    describe('security integration tests', function () {
        beforeEach(function () {
            testing_1.TestBed.configureCompiler({ useJit: useJit }).configureTestingModule({
                declarations: [
                    SecuredComponent,
                    OnPrefixDir,
                ]
            });
        });
        var originalLog;
        beforeEach(function () {
            originalLog = dom_adapter_1.getDOM().log;
            dom_adapter_1.getDOM().log = function (msg) { };
        });
        afterEach(function () { dom_adapter_1.getDOM().log = originalLog; });
        describe('events', function () {
            it('should disallow binding to attr.on*', function () {
                var template = "<div [attr.onclick]=\"ctxProp\"></div>";
                testing_1.TestBed.overrideComponent(SecuredComponent, { set: { template: template } });
                expect(function () { return testing_1.TestBed.createComponent(SecuredComponent); })
                    .toThrowError(/Binding to event attribute 'onclick' is disallowed for security reasons, please use \(click\)=.../);
            });
            it('should disallow binding to on* with NO_ERRORS_SCHEMA', function () {
                var template = "<div [onclick]=\"ctxProp\"></div>";
                testing_1.TestBed.overrideComponent(SecuredComponent, { set: { template: template } }).configureTestingModule({
                    schemas: [core_1.NO_ERRORS_SCHEMA]
                });
                expect(function () { return testing_1.TestBed.createComponent(SecuredComponent); })
                    .toThrowError(/Binding to event property 'onclick' is disallowed for security reasons, please use \(click\)=.../);
            });
            it('should disallow binding to on* unless it is consumed by a directive', function () {
                var template = "<div [onPrefixedProp]=\"ctxProp\" [onclick]=\"ctxProp\"></div>";
                testing_1.TestBed.overrideComponent(SecuredComponent, { set: { template: template } }).configureTestingModule({
                    schemas: [core_1.NO_ERRORS_SCHEMA]
                });
                // should not throw for inputs starting with "on"
                var cmp = undefined;
                expect(function () { return cmp = testing_1.TestBed.createComponent(SecuredComponent); }).not.toThrow();
                // must bind to the directive not to the property of the div
                var value = cmp.componentInstance.ctxProp = {};
                cmp.detectChanges();
                var div = cmp.debugElement.children[0];
                expect(div.injector.get(OnPrefixDir).onclick).toBe(value);
                expect(dom_adapter_1.getDOM().getProperty(div.nativeElement, 'onclick')).not.toBe(value);
                expect(dom_adapter_1.getDOM().hasAttribute(div.nativeElement, 'onclick')).toEqual(false);
            });
        });
        describe('safe HTML values', function () {
            it('should not escape values marked as trusted', function () {
                var template = "<a [href]=\"ctxProp\">Link Title</a>";
                testing_1.TestBed.overrideComponent(SecuredComponent, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(SecuredComponent);
                var sanitizer = testing_1.getTestBed().get(dom_sanitization_service_1.DomSanitizer);
                var e = fixture.debugElement.children[0].nativeElement;
                var ci = fixture.componentInstance;
                var trusted = sanitizer.bypassSecurityTrustUrl('javascript:alert(1)');
                ci.ctxProp = trusted;
                fixture.detectChanges();
                expect(dom_adapter_1.getDOM().getProperty(e, 'href')).toEqual('javascript:alert(1)');
            });
            it('should error when using the wrong trusted value', function () {
                var template = "<a [href]=\"ctxProp\">Link Title</a>";
                testing_1.TestBed.overrideComponent(SecuredComponent, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(SecuredComponent);
                var sanitizer = testing_1.getTestBed().get(dom_sanitization_service_1.DomSanitizer);
                var trusted = sanitizer.bypassSecurityTrustScript('javascript:alert(1)');
                var ci = fixture.componentInstance;
                ci.ctxProp = trusted;
                expect(function () { return fixture.detectChanges(); }).toThrowError(/Required a safe URL, got a Script/);
            });
            it('should warn when using in string interpolation', function () {
                var template = "<a href=\"/foo/{{ctxProp}}\">Link Title</a>";
                testing_1.TestBed.overrideComponent(SecuredComponent, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(SecuredComponent);
                var sanitizer = testing_1.getTestBed().get(dom_sanitization_service_1.DomSanitizer);
                var e = fixture.debugElement.children[0].nativeElement;
                var trusted = sanitizer.bypassSecurityTrustUrl('bar/baz');
                var ci = fixture.componentInstance;
                ci.ctxProp = trusted;
                fixture.detectChanges();
                expect(dom_adapter_1.getDOM().getProperty(e, 'href')).toMatch(/SafeValue(%20| )must(%20| )use/);
            });
        });
        describe('sanitizing', function () {
            function checkEscapeOfHrefProperty(fixture, isAttribute) {
                var e = fixture.debugElement.children[0].nativeElement;
                var ci = fixture.componentInstance;
                ci.ctxProp = 'hello';
                fixture.detectChanges();
                // In the browser, reading href returns an absolute URL. On the server side,
                // it just echoes back the property.
                var value = isAttribute ? dom_adapter_1.getDOM().getAttribute(e, 'href') : dom_adapter_1.getDOM().getProperty(e, 'href');
                expect(value).toMatch(/.*\/?hello$/);
                ci.ctxProp = 'javascript:alert(1)';
                fixture.detectChanges();
                value = isAttribute ? dom_adapter_1.getDOM().getAttribute(e, 'href') : dom_adapter_1.getDOM().getProperty(e, 'href');
                expect(value).toEqual('unsafe:javascript:alert(1)');
            }
            it('should escape unsafe properties', function () {
                var template = "<a [href]=\"ctxProp\">Link Title</a>";
                testing_1.TestBed.overrideComponent(SecuredComponent, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(SecuredComponent);
                checkEscapeOfHrefProperty(fixture, false);
            });
            it('should escape unsafe attributes', function () {
                var template = "<a [attr.href]=\"ctxProp\">Link Title</a>";
                testing_1.TestBed.overrideComponent(SecuredComponent, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(SecuredComponent);
                checkEscapeOfHrefProperty(fixture, true);
            });
            it('should escape unsafe properties if they are used in host bindings', function () {
                var HrefDirective = /** @class */ (function () {
                    function HrefDirective() {
                    }
                    __decorate([
                        core_1.HostBinding('href'), core_1.Input(),
                        __metadata("design:type", String)
                    ], HrefDirective.prototype, "dirHref", void 0);
                    HrefDirective = __decorate([
                        core_1.Directive({ selector: '[dirHref]' })
                    ], HrefDirective);
                    return HrefDirective;
                }());
                var template = "<a [dirHref]=\"ctxProp\">Link Title</a>";
                testing_1.TestBed.configureTestingModule({ declarations: [HrefDirective] });
                testing_1.TestBed.overrideComponent(SecuredComponent, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(SecuredComponent);
                checkEscapeOfHrefProperty(fixture, false);
            });
            it('should escape unsafe attributes if they are used in host bindings', function () {
                var HrefDirective = /** @class */ (function () {
                    function HrefDirective() {
                    }
                    __decorate([
                        core_1.HostBinding('attr.href'), core_1.Input(),
                        __metadata("design:type", String)
                    ], HrefDirective.prototype, "dirHref", void 0);
                    HrefDirective = __decorate([
                        core_1.Directive({ selector: '[dirHref]' })
                    ], HrefDirective);
                    return HrefDirective;
                }());
                var template = "<a [dirHref]=\"ctxProp\">Link Title</a>";
                testing_1.TestBed.configureTestingModule({ declarations: [HrefDirective] });
                testing_1.TestBed.overrideComponent(SecuredComponent, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(SecuredComponent);
                checkEscapeOfHrefProperty(fixture, true);
            });
            it('should escape unsafe style values', function () {
                var template = "<div [style.background]=\"ctxProp\">Text</div>";
                testing_1.TestBed.overrideComponent(SecuredComponent, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(SecuredComponent);
                var e = fixture.debugElement.children[0].nativeElement;
                var ci = fixture.componentInstance;
                // Make sure binding harmless values works.
                ci.ctxProp = 'red';
                fixture.detectChanges();
                // In some browsers, this will contain the full background specification, not just
                // the color.
                expect(dom_adapter_1.getDOM().getStyle(e, 'background')).toMatch(/red.*/);
                ci.ctxProp = 'url(javascript:evil())';
                fixture.detectChanges();
                // Updated value gets rejected, no value change.
                expect(dom_adapter_1.getDOM().getStyle(e, 'background')).not.toContain('javascript');
            });
            it('should escape unsafe SVG attributes', function () {
                var template = "<svg:circle [xlink:href]=\"ctxProp\">Text</svg:circle>";
                testing_1.TestBed.overrideComponent(SecuredComponent, { set: { template: template } });
                expect(function () { return testing_1.TestBed.createComponent(SecuredComponent); })
                    .toThrowError(/Can't bind to 'xlink:href'/);
            });
            it('should escape unsafe HTML values', function () {
                var template = "<div [innerHTML]=\"ctxProp\">Text</div>";
                testing_1.TestBed.overrideComponent(SecuredComponent, { set: { template: template } });
                var fixture = testing_1.TestBed.createComponent(SecuredComponent);
                var e = fixture.debugElement.children[0].nativeElement;
                var ci = fixture.componentInstance;
                // Make sure binding harmless values works.
                ci.ctxProp = 'some <p>text</p>';
                fixture.detectChanges();
                expect(dom_adapter_1.getDOM().getInnerHTML(e)).toEqual('some <p>text</p>');
                ci.ctxProp = 'ha <script>evil()</script>';
                fixture.detectChanges();
                expect(dom_adapter_1.getDOM().getInnerHTML(e)).toEqual('ha evil()');
                ci.ctxProp = 'also <img src="x" onerror="evil()"> evil';
                fixture.detectChanges();
                expect(dom_adapter_1.getDOM().getInnerHTML(e)).toEqual('also <img src="x"> evil');
                ci.ctxProp = 'also <iframe srcdoc="evil"></iframe> evil';
                fixture.detectChanges();
                expect(dom_adapter_1.getDOM().getInnerHTML(e)).toEqual('also  evil');
            });
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjdXJpdHlfaW50ZWdyYXRpb25fc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdC9saW5rZXIvc2VjdXJpdHlfaW50ZWdyYXRpb25fc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7OztBQUVILHNDQUF5RjtBQUN6RixpREFBNEU7QUFDNUUsNkVBQXFFO0FBQ3JFLDRHQUE2RjtBQUU3RjtJQUNFLFFBQVEsQ0FBQyxLQUFLLEVBQUUsY0FBUSxZQUFZLENBQUMsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRXpELFFBQVEsQ0FBQyxRQUFRLEVBQUUsY0FBUSxZQUFZLENBQUMsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0NBQzlEO0FBR0Q7SUFEQTtRQUVFLFlBQU8sR0FBUSxZQUFZLENBQUM7SUFDOUIsQ0FBQztJQUZLLGdCQUFnQjtRQURyQixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFDLENBQUM7T0FDekMsZ0JBQWdCLENBRXJCO0lBQUQsdUJBQUM7Q0FBQSxBQUZELElBRUM7QUFHRDtJQUFBO0lBR0EsQ0FBQztJQUZVO1FBQVIsWUFBSyxFQUFFOzt1REFBcUI7SUFDcEI7UUFBUixZQUFLLEVBQUU7O2dEQUFjO0lBRmxCLFdBQVc7UUFEaEIsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxrQkFBa0IsRUFBQyxDQUFDO09BQ3BDLFdBQVcsQ0FHaEI7SUFBRCxrQkFBQztDQUFBLEFBSEQsSUFHQztBQUVELHNCQUFzQixFQUEyQjtRQUExQixrQkFBTTtJQUMzQixRQUFRLENBQUMsNEJBQTRCLEVBQUU7UUFFckMsVUFBVSxDQUFDO1lBQ1QsaUJBQU8sQ0FBQyxpQkFB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