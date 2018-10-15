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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var animations_1 = require("@angular/animations");
var common_1 = require("@angular/common");
var http_1 = require("@angular/common/http");
var testing_1 = require("@angular/common/http/testing");
var core_1 = require("@angular/core");
var testing_2 = require("@angular/core/testing");
var http_2 = require("@angular/http");
var testing_3 = require("@angular/http/testing");
var platform_browser_1 = require("@angular/platform-browser");
var dom_adapter_1 = require("@angular/platform-browser/src/dom/dom_adapter");
var platform_server_1 = require("@angular/platform-server");
var operators_1 = require("rxjs/operators");
var MyServerApp = /** @class */ (function () {
    function MyServerApp() {
    }
    MyServerApp = __decorate([
        core_1.Component({ selector: 'app', template: "Works!" })
    ], MyServerApp);
    return MyServerApp;
}());
var ExampleModule = /** @class */ (function () {
    function ExampleModule() {
    }
    ExampleModule = __decorate([
        core_1.NgModule({
            bootstrap: [MyServerApp],
            declarations: [MyServerApp],
            imports: [platform_server_1.ServerModule],
            providers: [
                testing_3.MockBackend,
                { provide: http_2.XHRBackend, useExisting: testing_3.MockBackend },
            ]
        })
    ], ExampleModule);
    return ExampleModule;
}());
function getTitleRenderHook(doc) {
    return function () {
        // Set the title as part of the render hook.
        doc.title = 'RenderHook';
    };
}
function exceptionRenderHook() {
    throw new Error('error');
}
function getMetaRenderHook(doc) {
    return function () {
        // Add a meta tag before rendering the document.
        var metaElement = doc.createElement('meta');
        metaElement.setAttribute('name', 'description');
        doc.head.appendChild(metaElement);
    };
}
var RenderHookModule = /** @class */ (function () {
    function RenderHookModule() {
    }
    RenderHookModule = __decorate([
        core_1.NgModule({
            bootstrap: [MyServerApp],
            declarations: [MyServerApp],
            imports: [platform_browser_1.BrowserModule.withServerTransition({ appId: 'render-hook' }), platform_server_1.ServerModule],
            providers: [
                { provide: platform_server_1.BEFORE_APP_SERIALIZED, useFactory: getTitleRenderHook, multi: true, deps: [platform_browser_1.DOCUMENT] },
            ]
        })
    ], RenderHookModule);
    return RenderHookModule;
}());
var MultiRenderHookModule = /** @class */ (function () {
    function MultiRenderHookModule() {
    }
    MultiRenderHookModule = __decorate([
        core_1.NgModule({
            bootstrap: [MyServerApp],
            declarations: [MyServerApp],
            imports: [platform_browser_1.BrowserModule.withServerTransition({ appId: 'render-hook' }), platform_server_1.ServerModule],
            providers: [
                { provide: platform_server_1.BEFORE_APP_SERIALIZED, useFactory: getTitleRenderHook, multi: true, deps: [platform_browser_1.DOCUMENT] },
                { provide: platform_server_1.BEFORE_APP_SERIALIZED, useValue: exceptionRenderHook, multi: true },
                { provide: platform_server_1.BEFORE_APP_SERIALIZED, useFactory: getMetaRenderHook, multi: true, deps: [platform_browser_1.DOCUMENT] },
            ]
        })
    ], MultiRenderHookModule);
    return MultiRenderHookModule;
}());
var MyServerApp2 = /** @class */ (function () {
    function MyServerApp2() {
    }
    MyServerApp2 = __decorate([
        core_1.Component({ selector: 'app', template: "Works too!" })
    ], MyServerApp2);
    return MyServerApp2;
}());
var ExampleModule2 = /** @class */ (function () {
    function ExampleModule2() {
    }
    ExampleModule2 = __decorate([
        core_1.NgModule({ declarations: [MyServerApp2], imports: [platform_server_1.ServerModule], bootstrap: [MyServerApp2] })
    ], ExampleModule2);
    return ExampleModule2;
}());
var TitleApp = /** @class */ (function () {
    function TitleApp(title) {
        this.title = title;
    }
    TitleApp.prototype.ngOnInit = function () { this.title.setTitle('Test App Title'); };
    TitleApp = __decorate([
        core_1.Component({ selector: 'app', template: "" }),
        __metadata("design:paramtypes", [platform_browser_1.Title])
    ], TitleApp);
    return TitleApp;
}());
var TitleAppModule = /** @class */ (function () {
    function TitleAppModule() {
    }
    TitleAppModule = __decorate([
        core_1.NgModule({ declarations: [TitleApp], imports: [platform_server_1.ServerModule], bootstrap: [TitleApp] })
    ], TitleAppModule);
    return TitleAppModule;
}());
var MyAsyncServerApp = /** @class */ (function () {
    function MyAsyncServerApp() {
        this.text = '';
        this.h1 = '';
    }
    MyAsyncServerApp.prototype.track = function () { console.error('scroll'); };
    MyAsyncServerApp.prototype.ngOnInit = function () {
        var _this = this;
        Promise.resolve(null).then(function () { return setTimeout(function () {
            _this.text = 'Works!';
            _this.h1 = 'fine';
        }, 10); });
    };
    __decorate([
        core_1.HostListener('window:scroll'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], MyAsyncServerApp.prototype, "track", null);
    MyAsyncServerApp = __decorate([
        core_1.Component({ selector: 'app', template: '{{text}}<h1 [innerText]="h1"></h1>' })
    ], MyAsyncServerApp);
    return MyAsyncServerApp;
}());
var AsyncServerModule = /** @class */ (function () {
    function AsyncServerModule() {
    }
    AsyncServerModule = __decorate([
        core_1.NgModule({
            declarations: [MyAsyncServerApp],
            imports: [platform_browser_1.BrowserModule.withServerTransition({ appId: 'async-server' }), platform_server_1.ServerModule],
            bootstrap: [MyAsyncServerApp]
        })
    ], AsyncServerModule);
    return AsyncServerModule;
}());
var SVGComponent = /** @class */ (function () {
    function SVGComponent() {
    }
    SVGComponent = __decorate([
        core_1.Component({ selector: 'app', template: '<svg><use xlink:href="#clear"></use></svg>' })
    ], SVGComponent);
    return SVGComponent;
}());
var SVGServerModule = /** @class */ (function () {
    function SVGServerModule() {
    }
    SVGServerModule = __decorate([
        core_1.NgModule({
            declarations: [SVGComponent],
            imports: [platform_browser_1.BrowserModule.withServerTransition({ appId: 'svg-server' }), platform_server_1.ServerModule],
            bootstrap: [SVGComponent]
        })
    ], SVGServerModule);
    return SVGServerModule;
}());
var MyAnimationApp = /** @class */ (function () {
    function MyAnimationApp(builder) {
        this.builder = builder;
        this.state = 'active';
        this.text = 'Works!';
    }
    MyAnimationApp = __decorate([
        core_1.Component({
            selector: 'app',
            template: "<div [@myAnimation]=\"state\">{{text}}</div>",
            animations: [animations_1.trigger('myAnimation', [
                    animations_1.state('void', animations_1.style({ 'opacity': '0' })),
                    animations_1.state('active', animations_1.style({
                        'opacity': '1',
                        'font-weight': 'bold',
                        'transform': 'translate3d(0, 0, 0)',
                    })),
                    animations_1.transition('void => *', [animations_1.animate('0ms')]),
                ])]
        }),
        __metadata("design:paramtypes", [animations_1.AnimationBuilder])
    ], MyAnimationApp);
    return MyAnimationApp;
}());
var AnimationServerModule = /** @class */ (function () {
    function AnimationServerModule() {
    }
    AnimationServerModule = __decorate([
        core_1.NgModule({
            declarations: [MyAnimationApp],
            imports: [platform_browser_1.BrowserModule.withServerTransition({ appId: 'anim-server' }), platform_server_1.ServerModule],
            bootstrap: [MyAnimationApp]
        })
    ], AnimationServerModule);
    return AnimationServerModule;
}());
var MyStylesApp = /** @class */ (function () {
    function MyStylesApp() {
    }
    MyStylesApp = __decorate([
        core_1.Component({
            selector: 'app',
            template: "<div>Works!</div>",
            styles: ['div {color: blue; } :host { color: red; }']
        })
    ], MyStylesApp);
    return MyStylesApp;
}());
var ExampleStylesModule = /** @class */ (function () {
    function ExampleStylesModule() {
    }
    ExampleStylesModule = __decorate([
        core_1.NgModule({
            declarations: [MyStylesApp],
            imports: [platform_browser_1.BrowserModule.withServerTransition({ appId: 'example-styles' }), platform_server_1.ServerModule],
            bootstrap: [MyStylesApp]
        })
    ], ExampleStylesModule);
    return ExampleStylesModule;
}());
var HttpBeforeExampleModule = /** @class */ (function () {
    function HttpBeforeExampleModule() {
    }
    HttpBeforeExampleModule = __decorate([
        core_1.NgModule({
            bootstrap: [MyServerApp],
            declarations: [MyServerApp],
            imports: [http_2.HttpModule, platform_server_1.ServerModule],
            providers: [
                testing_3.MockBackend,
                { provide: http_2.XHRBackend, useExisting: testing_3.MockBackend },
            ]
        })
    ], HttpBeforeExampleModule);
    return HttpBeforeExampleModule;
}());
exports.HttpBeforeExampleModule = HttpBeforeExampleModule;
var HttpAfterExampleModule = /** @class */ (function () {
    function HttpAfterExampleModule() {
    }
    HttpAfterExampleModule = __decorate([
        core_1.NgModule({
            bootstrap: [MyServerApp],
            declarations: [MyServerApp],
            imports: [platform_server_1.ServerModule, http_2.HttpModule],
            providers: [
                testing_3.MockBackend,
                { provide: http_2.XHRBackend, useExisting: testing_3.MockBackend },
            ]
        })
    ], HttpAfterExampleModule);
    return HttpAfterExampleModule;
}());
exports.HttpAfterExampleModule = HttpAfterExampleModule;
var HttpClientExampleModule = /** @class */ (function () {
    function HttpClientExampleModule() {
    }
    HttpClientExampleModule = __decorate([
        core_1.NgModule({
            bootstrap: [MyServerApp],
            declarations: [MyServerApp],
            imports: [platform_server_1.ServerModule, http_1.HttpClientModule, testing_1.HttpClientTestingModule],
        })
    ], HttpClientExampleModule);
    return HttpClientExampleModule;
}());
exports.HttpClientExampleModule = HttpClientExampleModule;
var MyHttpInterceptor = /** @class */ (function () {
    function MyHttpInterceptor(http) {
        this.http = http;
    }
    MyHttpInterceptor.prototype.intercept = function (req, next) {
        return next.handle(req);
    };
    MyHttpInterceptor = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], MyHttpInterceptor);
    return MyHttpInterceptor;
}());
exports.MyHttpInterceptor = MyHttpInterceptor;
var HttpInterceptorExampleModule = /** @class */ (function () {
    function HttpInterceptorExampleModule() {
    }
    HttpInterceptorExampleModule = __decorate([
        core_1.NgModule({
            bootstrap: [MyServerApp],
            declarations: [MyServerApp],
            imports: [platform_server_1.ServerModule, http_1.HttpClientModule, testing_1.HttpClientTestingModule],
            providers: [
                { provide: http_1.HTTP_INTERCEPTORS, multi: true, useClass: MyHttpInterceptor },
            ],
        })
    ], HttpInterceptorExampleModule);
    return HttpInterceptorExampleModule;
}());
exports.HttpInterceptorExampleModule = HttpInterceptorExampleModule;
var ImageApp = /** @class */ (function () {
    function ImageApp() {
    }
    ImageApp = __decorate([
        core_1.Component({ selector: 'app', template: "<img [src]=\"'link'\">" })
    ], ImageApp);
    return ImageApp;
}());
var ImageExampleModule = /** @class */ (function () {
    function ImageExampleModule() {
    }
    ImageExampleModule = __decorate([
        core_1.NgModule({ declarations: [ImageApp], imports: [platform_server_1.ServerModule], bootstrap: [ImageApp] })
    ], ImageExampleModule);
    return ImageExampleModule;
}());
var NativeEncapsulationApp = /** @class */ (function () {
    function NativeEncapsulationApp() {
    }
    NativeEncapsulationApp = __decorate([
        core_1.Component({
            selector: 'app',
            template: 'Native works',
            encapsulation: core_1.ViewEncapsulation.Native,
            styles: [':host { color: red; }']
        })
    ], NativeEncapsulationApp);
    return NativeEncapsulationApp;
}());
var NativeExampleModule = /** @class */ (function () {
    function NativeExampleModule() {
    }
    NativeExampleModule = __decorate([
        core_1.NgModule({
            declarations: [NativeEncapsulationApp],
            imports: [platform_browser_1.BrowserModule.withServerTransition({ appId: 'test' }), platform_server_1.ServerModule],
            bootstrap: [NativeEncapsulationApp]
        })
    ], NativeExampleModule);
    return NativeExampleModule;
}());
var MyChildComponent = /** @class */ (function () {
    function MyChildComponent() {
    }
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], MyChildComponent.prototype, "attr", void 0);
    MyChildComponent = __decorate([
        core_1.Component({ selector: 'my-child', template: 'Works!' })
    ], MyChildComponent);
    return MyChildComponent;
}());
var MyHostComponent = /** @class */ (function () {
    function MyHostComponent() {
    }
    MyHostComponent = __decorate([
        core_1.Component({ selector: 'app', template: '<my-child [attr]="false"></my-child>' })
    ], MyHostComponent);
    return MyHostComponent;
}());
var FalseAttributesModule = /** @class */ (function () {
    function FalseAttributesModule() {
    }
    FalseAttributesModule = __decorate([
        core_1.NgModule({
            declarations: [MyHostComponent, MyChildComponent],
            bootstrap: [MyHostComponent],
            imports: [platform_server_1.ServerModule, platform_browser_1.BrowserModule.withServerTransition({ appId: 'false-attributes' })]
        })
    ], FalseAttributesModule);
    return FalseAttributesModule;
}());
var MyInputComponent = /** @class */ (function () {
    function MyInputComponent() {
        this.name = '';
    }
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], MyInputComponent.prototype, "name", void 0);
    MyInputComponent = __decorate([
        core_1.Component({ selector: 'app', template: '<input [name]="name">' })
    ], MyInputComponent);
    return MyInputComponent;
}());
var NameModule = /** @class */ (function () {
    function NameModule() {
    }
    NameModule = __decorate([
        core_1.NgModule({
            declarations: [MyInputComponent],
            bootstrap: [MyInputComponent],
            imports: [platform_server_1.ServerModule, platform_browser_1.BrowserModule.withServerTransition({ appId: 'name-attributes' })]
        })
    ], NameModule);
    return NameModule;
}());
var HTMLTypesApp = /** @class */ (function () {
    function HTMLTypesApp(doc) {
        this.html = '<b>foo</b> bar';
    }
    HTMLTypesApp = __decorate([
        core_1.Component({ selector: 'app', template: '<div [innerHTML]="html"></div>' }),
        __param(0, core_1.Inject(platform_browser_1.DOCUMENT)),
        __metadata("design:paramtypes", [Document])
    ], HTMLTypesApp);
    return HTMLTypesApp;
}());
var HTMLTypesModule = /** @class */ (function () {
    function HTMLTypesModule() {
    }
    HTMLTypesModule = __decorate([
        core_1.NgModule({
            declarations: [HTMLTypesApp],
            imports: [platform_browser_1.BrowserModule.withServerTransition({ appId: 'inner-html' }), platform_server_1.ServerModule],
            bootstrap: [HTMLTypesApp]
        })
    ], HTMLTypesModule);
    return HTMLTypesModule;
}());
var TEST_KEY = platform_browser_1.makeStateKey('test');
var STRING_KEY = platform_browser_1.makeStateKey('testString');
var TransferComponent = /** @class */ (function () {
    function TransferComponent(transferStore) {
        this.transferStore = transferStore;
    }
    TransferComponent.prototype.ngOnInit = function () { this.transferStore.set(TEST_KEY, 10); };
    TransferComponent = __decorate([
        core_1.Component({ selector: 'app', template: 'Works!' }),
        __metadata("design:paramtypes", [platform_browser_1.TransferState])
    ], TransferComponent);
    return TransferComponent;
}());
var EscapedComponent = /** @class */ (function () {
    function EscapedComponent(transferStore) {
        this.transferStore = transferStore;
    }
    EscapedComponent.prototype.ngOnInit = function () {
        this.transferStore.set(STRING_KEY, '</script><script>alert(\'Hello&\' + "World");');
    };
    EscapedComponent = __decorate([
        core_1.Component({ selector: 'esc-app', template: 'Works!' }),
        __metadata("design:paramtypes", [platform_browser_1.TransferState])
    ], EscapedComponent);
    return EscapedComponent;
}());
var TransferStoreModule = /** @class */ (function () {
    function TransferStoreModule() {
    }
    TransferStoreModule = __decorate([
        core_1.NgModule({
            bootstrap: [TransferComponent],
            declarations: [TransferComponent],
            imports: [
                platform_browser_1.BrowserModule.withServerTransition({ appId: 'transfer' }),
                platform_server_1.ServerModule,
                platform_server_1.ServerTransferStateModule,
            ]
        })
    ], TransferStoreModule);
    return TransferStoreModule;
}());
var EscapedTransferStoreModule = /** @class */ (function () {
    function EscapedTransferStoreModule() {
    }
    EscapedTransferStoreModule = __decorate([
        core_1.NgModule({
            bootstrap: [EscapedComponent],
            declarations: [EscapedComponent],
            imports: [
                platform_browser_1.BrowserModule.withServerTransition({ appId: 'transfer' }),
                platform_server_1.ServerModule,
                platform_server_1.ServerTransferStateModule,
            ]
        })
    ], EscapedTransferStoreModule);
    return EscapedTransferStoreModule;
}());
var MyHiddenComponent = /** @class */ (function () {
    function MyHiddenComponent() {
        this.name = '';
    }
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], MyHiddenComponent.prototype, "name", void 0);
    MyHiddenComponent = __decorate([
        core_1.Component({ selector: 'app', template: '<input [hidden]="true"><input [hidden]="false">' })
    ], MyHiddenComponent);
    return MyHiddenComponent;
}());
var HiddenModule = /** @class */ (function () {
    function HiddenModule() {
    }
    HiddenModule = __decorate([
        core_1.NgModule({
            declarations: [MyHiddenComponent],
            bootstrap: [MyHiddenComponent],
            imports: [platform_server_1.ServerModule, platform_browser_1.BrowserModule.withServerTransition({ appId: 'hidden-attributes' })]
        })
    ], HiddenModule);
    return HiddenModule;
}());
(function () {
    if (dom_adapter_1.getDOM().supportsDOMEvents())
        return; // NODE only
    describe('platform-server integration', function () {
        beforeEach(function () {
            if (core_1.getPlatform())
                core_1.destroyPlatform();
        });
        it('should bootstrap', testing_2.async(function () {
            var platform = platform_server_1.platformDynamicServer([{ provide: platform_server_1.INITIAL_CONFIG, useValue: { document: '<app></app>' } }]);
            platform.bootstrapModule(ExampleModule).then(function (moduleRef) {
                expect(common_1.isPlatformServer(moduleRef.injector.get(core_1.PLATFORM_ID))).toBe(true);
                var doc = moduleRef.injector.get(platform_browser_1.DOCUMENT);
                expect(doc.head).toBe(dom_adapter_1.getDOM().querySelector(doc, 'head'));
                expect(doc.body).toBe(dom_adapter_1.getDOM().querySelector(doc, 'body'));
                expect(dom_adapter_1.getDOM().getText(doc.documentElement)).toEqual('Works!');
                platform.destroy();
            });
        }));
        it('should allow multiple platform instances', testing_2.async(function () {
            var platform = platform_server_1.platformDynamicServer([{ provide: platform_server_1.INITIAL_CONFIG, useValue: { document: '<app></app>' } }]);
            var platform2 = platform_server_1.platformDynamicServer([{ provide: platform_server_1.INITIAL_CONFIG, useValue: { document: '<app></app>' } }]);
            platform.bootstrapModule(ExampleModule).then(function (moduleRef) {
                var doc = moduleRef.injector.get(platform_browser_1.DOCUMENT);
                expect(dom_adapter_1.getDOM().getText(doc.documentElement)).toEqual('Works!');
                platform.destroy();
            });
            platform2.bootstrapModule(ExampleModule2).then(function (moduleRef) {
                var doc = moduleRef.injector.get(platform_browser_1.DOCUMENT);
                expect(dom_adapter_1.getDOM().getText(doc.documentElement)).toEqual('Works too!');
                platform2.destroy();
            });
        }));
        it('adds title to the document using Title service', testing_2.async(function () {
            var platform = platform_server_1.platformDynamicServer([{
                    provide: platform_server_1.INITIAL_CONFIG,
                    useValue: { document: '<html><head><title></title></head><body><app></app></body></html>' }
                }]);
            platform.bootstrapModule(TitleAppModule).then(function (ref) {
                var state = ref.injector.get(platform_server_1.PlatformState);
                var doc = ref.injector.get(platform_browser_1.DOCUMENT);
                var title = dom_adapter_1.getDOM().querySelector(doc, 'title');
                expect(dom_adapter_1.getDOM().getText(title)).toBe('Test App Title');
                expect(state.renderToString()).toContain('<title>Test App Title</title>');
            });
        }));
        it('should get base href from document', testing_2.async(function () {
            var platform = platform_server_1.platformDynamicServer([{
                    provide: platform_server_1.INITIAL_CONFIG,
                    useValue: { document: '<html><head><base href="/"></head><body><app></app></body></html>' }
                }]);
            platform.bootstrapModule(ExampleModule).then(function (moduleRef) {
                var location = moduleRef.injector.get(common_1.PlatformLocation);
                expect(location.getBaseHrefFromDOM()).toEqual('/');
                platform.destroy();
            });
        }));
        it('adds styles with ng-transition attribute', testing_2.async(function () {
            var platform = platform_server_1.platformDynamicServer([{
                    provide: platform_server_1.INITIAL_CONFIG,
                    useValue: { document: '<html><head></head><body><app></app></body></html>' }
                }]);
            platform.bootstrapModule(ExampleStylesModule).then(function (ref) {
                var doc = ref.injector.get(platform_browser_1.DOCUMENT);
                var head = dom_adapter_1.getDOM().getElementsByTagName(doc, 'head')[0];
                var styles = head.children;
                expect(styles.length).toBe(1);
                expect(dom_adapter_1.getDOM().getText(styles[0])).toContain('color: red');
                expect(dom_adapter_1.getDOM().getAttribute(styles[0], 'ng-transition')).toBe('example-styles');
            });
        }));
        it('copies known properties to attributes', testing_2.async(function () {
            var platform = platform_server_1.platformDynamicServer([{ provide: platform_server_1.INITIAL_CONFIG, useValue: { document: '<app></app>' } }]);
            platform.bootstrapModule(ImageExampleModule).then(function (ref) {
                var appRef = ref.injector.get(core_1.ApplicationRef);
                var app = appRef.components[0].location.nativeElement;
                var img = dom_adapter_1.getDOM().getElementsByTagName(app, 'img')[0];
                expect(img.attributes['src'].value).toEqual('link');
            });
        }));
        describe('PlatformLocation', function () {
            it('is injectable', testing_2.async(function () {
                var platform = platform_server_1.platformDynamicServer([{ provide: platform_server_1.INITIAL_CONFIG, useValue: { document: '<app></app>' } }]);
                platform.bootstrapModule(ExampleModule).then(function (appRef) {
                    var location = appRef.injector.get(common_1.PlatformLocation);
                    expect(location.pathname).toBe('/');
                    platform.destroy();
                });
            }));
            it('is configurable via INITIAL_CONFIG', function () {
                platform_server_1.platformDynamicServer([{
                        provide: platform_server_1.INITIAL_CONFIG,
                        useValue: { document: '<app></app>', url: 'http://test.com/deep/path?query#hash' }
                    }])
                    .bootstrapModule(ExampleModule)
                    .then(function (appRef) {
                    var location = appRef.injector.get(common_1.PlatformLocation);
                    expect(location.pathname).toBe('/deep/path');
                    expect(location.search).toBe('?query');
                    expect(location.hash).toBe('#hash');
                });
            });
            it('handles empty search and hash portions of the url', function () {
                platform_server_1.platformDynamicServer([{
                        provide: platform_server_1.INITIAL_CONFIG,
                        useValue: { document: '<app></app>', url: 'http://test.com/deep/path' }
                    }])
                    .bootstrapModule(ExampleModule)
                    .then(function (appRef) {
                    var location = appRef.injector.get(common_1.PlatformLocation);
                    expect(location.pathname).toBe('/deep/path');
                    expect(location.search).toBe('');
                    expect(location.hash).toBe('');
                });
            });
            it('pushState causes the URL to update', testing_2.async(function () {
                var platform = platform_server_1.platformDynamicServer([{ provide: platform_server_1.INITIAL_CONFIG, useValue: { document: '<app></app>' } }]);
                platform.bootstrapModule(ExampleModule).then(function (appRef) {
                    var location = appRef.injector.get(common_1.PlatformLocation);
                    location.pushState(null, 'Test', '/foo#bar');
                    expect(location.pathname).toBe('/foo');
                    expect(location.hash).toBe('#bar');
                    platform.destroy();
                });
            }));
            it('allows subscription to the hash state', function (done) {
                var platform = platform_server_1.platformDynamicServer([{ provide: platform_server_1.INITIAL_CONFIG, useValue: { document: '<app></app>' } }]);
                platform.bootstrapModule(ExampleModule).then(function (appRef) {
                    var location = appRef.injector.get(common_1.PlatformLocation);
                    expect(location.pathname).toBe('/');
                    location.onHashChange(function (e) {
                        expect(e.type).toBe('hashchange');
                        expect(e.oldUrl).toBe('/');
                        expect(e.newUrl).toBe('/foo#bar');
                        platform.destroy();
                        done();
                    });
                    location.pushState(null, 'Test', '/foo#bar');
                });
            });
        });
        describe('render', function () {
            var doc;
            var called;
            var expectedOutput = '<html><head></head><body><app ng-version="0.0.0-PLACEHOLDER">Works!<h1 innertext="fine">fine</h1></app></body></html>';
            beforeEach(function () {
                // PlatformConfig takes in a parsed document so that it can be cached across requests.
                doc = '<html><head></head><body><app></app></body></html>';
                called = false;
                global['window'] = undefined;
                global['document'] = undefined;
            });
            afterEach(function () { expect(called).toBe(true); });
            it('using long form should work', testing_2.async(function () {
                var platform = platform_server_1.platformDynamicServer([{ provide: platform_server_1.INITIAL_CONFIG, useValue: { document: doc } }]);
                platform.bootstrapModule(AsyncServerModule)
                    .then(function (moduleRef) {
                    var applicationRef = moduleRef.injector.get(core_1.ApplicationRef);
                    return applicationRef.isStable.pipe(operators_1.first(function (isStable) { return isStable; }))
                        .toPromise();
                })
                    .then(function (b) {
                    expect(platform.injector.get(platform_server_1.PlatformState).renderToString()).toBe(expectedOutput);
                    platform.destroy();
                    called = true;
                });
            }));
            it('using renderModule should work', testing_2.async(function () {
                platform_server_1.renderModule(AsyncServerModule, { document: doc }).then(function (output) {
                    expect(output).toBe(expectedOutput);
                    called = true;
                });
            }));
            it('using renderModuleFactory should work', testing_2.async(testing_2.inject([core_1.PlatformRef], function (defaultPlatform) {
                var compilerFactory = defaultPlatform.injector.get(core_1.CompilerFactory, null);
                var moduleFactory = compilerFactory.createCompiler().compileModuleSync(AsyncServerModule);
                platform_server_1.renderModuleFactory(moduleFactory, { document: doc }).then(function (output) {
                    expect(output).toBe(expectedOutput);
                    called = true;
                });
            })));
            it('works with SVG elements', testing_2.async(function () {
                platform_server_1.renderModule(SVGServerModule, { document: doc }).then(function (output) {
                    expect(output).toBe('<html><head></head><body><app ng-version="0.0.0-PLACEHOLDER">' +
                        '<svg><use xlink:href="#clear"></use></svg></app></body></html>');
                    called = true;
                });
            }));
            it('works with animation', testing_2.async(function () {
                platform_server_1.renderModule(AnimationServerModule, { document: doc }).then(function (output) {
                    expect(output).toContain('Works!');
                    expect(output).toContain('ng-trigger-myAnimation');
                    expect(output).toContain('opacity:1;');
                    expect(output).toContain('transform:translate3d(0, 0, 0);');
                    expect(output).toContain('font-weight:bold;');
                    called = true;
                });
            }));
            it('should handle ViewEncapsulation.Native', testing_2.async(function () {
                platform_server_1.renderModule(NativeExampleModule, { document: doc }).then(function (output) {
                    expect(output).not.toBe('');
                    expect(output).toContain('color: red');
                    called = true;
                });
            }));
            it('sets a prefix for the _nghost and _ngcontent attributes', testing_2.async(function () {
                platform_server_1.renderModule(ExampleStylesModule, { document: doc }).then(function (output) {
                    expect(output).toMatch(/<html><head><style ng-transition="example-styles">div\[_ngcontent-sc\d+\] {color: blue; } \[_nghost-sc\d+\] { color: red; }<\/style><\/head><body><app _nghost-sc\d+="" ng-version="0.0.0-PLACEHOLDER"><div _ngcontent-sc\d+="">Works!<\/div><\/app><\/body><\/html>/);
                    called = true;
                });
            }));
            it('should handle false values on attributes', testing_2.async(function () {
                platform_server_1.renderModule(FalseAttributesModule, { document: doc }).then(function (output) {
                    expect(output).toBe('<html><head></head><body><app ng-version="0.0.0-PLACEHOLDER">' +
                        '<my-child ng-reflect-attr="false">Works!</my-child></app></body></html>');
                    called = true;
                });
            }));
            it('should handle element property "name"', testing_2.async(function () {
                platform_server_1.renderModule(NameModule, { document: doc }).then(function (output) {
                    expect(output).toBe('<html><head></head><body><app ng-version="0.0.0-PLACEHOLDER">' +
                        '<input name=""></app></body></html>');
                    called = true;
                });
            }));
            it('should work with sanitizer to handle "innerHTML"', testing_2.async(function () {
                // Clear out any global states. These should be set when platform-server
                // is initialized.
                global.Node = undefined;
                global.Document = undefined;
                platform_server_1.renderModule(HTMLTypesModule, { document: doc }).then(function (output) {
                    expect(output).toBe('<html><head></head><body><app ng-version="0.0.0-PLACEHOLDER">' +
                        '<div><b>foo</b> bar</div></app></body></html>');
                    called = true;
                });
            }));
            it('should handle element property "hidden"', testing_2.async(function () {
                platform_server_1.renderModule(HiddenModule, { document: doc }).then(function (output) {
                    expect(output).toBe('<html><head></head><body><app ng-version="0.0.0-PLACEHOLDER">' +
                        '<input hidden=""><input></app></body></html>');
                    called = true;
                });
            }));
            it('should call render hook', testing_2.async(function () {
                platform_server_1.renderModule(RenderHookModule, { document: doc }).then(function (output) {
                    // title should be added by the render hook.
                    expect(output).toBe('<html><head><title>RenderHook</title></head><body>' +
                        '<app ng-version="0.0.0-PLACEHOLDER">Works!</app></body></html>');
                    called = true;
                });
            }));
            it('should call multiple render hooks', testing_2.async(function () {
                var consoleSpy = spyOn(console, 'warn');
                platform_server_1.renderModule(MultiRenderHookModule, { document: doc }).then(function (output) {
                    // title should be added by the render hook.
                    expect(output).toBe('<html><head><title>RenderHook</title><meta name="description"></head>' +
                        '<body><app ng-version="0.0.0-PLACEHOLDER">Works!</app></body></html>');
                    expect(consoleSpy).toHaveBeenCalled();
                    called = true;
                });
            }));
        });
        describe('http', function () {
            it('can inject Http', testing_2.async(function () {
                var platform = platform_server_1.platformDynamicServer([{ provide: platform_server_1.INITIAL_CONFIG, useValue: { document: '<app></app>' } }]);
                platform.bootstrapModule(ExampleModule).then(function (ref) {
                    expect(ref.injector.get(http_2.Http) instanceof http_2.Http).toBeTruthy();
                });
            }));
            it('can make Http requests', testing_2.async(function () {
                var platform = platform_server_1.platformDynamicServer([{ provide: platform_server_1.INITIAL_CONFIG, useValue: { document: '<app></app>' } }]);
                platform.bootstrapModule(ExampleModule).then(function (ref) {
                    var mock = ref.injector.get(testing_3.MockBackend);
                    var http = ref.injector.get(http_2.Http);
                    ref.injector.get(core_1.NgZone).run(function () {
                        core_1.NgZone.assertInAngularZone();
                        mock.connections.subscribe(function (mc) {
                            core_1.NgZone.assertInAngularZone();
                            expect(mc.request.url).toBe('http://localhost/testing');
                            mc.mockRespond(new http_2.Response(new http_2.ResponseOptions({ body: 'success!', status: 200 })));
                        });
                        http.get('http://localhost/testing').subscribe(function (resp) {
                            core_1.NgZone.assertInAngularZone();
                            expect(resp.text()).toBe('success!');
                        });
                    });
                });
            }));
            it('requests are macrotasks', testing_2.async(function () {
                var platform = platform_server_1.platformDynamicServer([{ provide: platform_server_1.INITIAL_CONFIG, useValue: { document: '<app></app>' } }]);
                platform.bootstrapModule(ExampleModule).then(function (ref) {
                    var mock = ref.injector.get(testing_3.MockBackend);
                    var http = ref.injector.get(http_2.Http);
                    expect(ref.injector.get(core_1.NgZone).hasPendingMacrotasks).toBeFalsy();
                    ref.injector.get(core_1.NgZone).run(function () {
                        core_1.NgZone.assertInAngularZone();
                        mock.connections.subscribe(function (mc) {
                            expect(ref.injector.get(core_1.NgZone).hasPendingMacrotasks).toBeTruthy();
                            mc.mockRespond(new http_2.Response(new http_2.ResponseOptions({ body: 'success!', status: 200 })));
                        });
                        http.get('http://localhost/testing').subscribe(function (resp) {
                            expect(resp.text()).toBe('success!');
                        });
                    });
                });
            }));
            it('works when HttpModule is included before ServerModule', testing_2.async(function () {
                var platform = platform_server_1.platformDynamicServer([{ provide: platform_server_1.INITIAL_CONFIG, useValue: { document: '<app></app>' } }]);
                platform.bootstrapModule(HttpBeforeExampleModule).then(function (ref) {
                    var mock = ref.injector.get(testing_3.MockBackend);
                    var http = ref.injector.get(http_2.Http);
                    expect(ref.injector.get(core_1.NgZone).hasPendingMacrotasks).toBeFalsy();
                    ref.injector.get(core_1.NgZone).run(function () {
                        core_1.NgZone.assertInAngularZone();
                        mock.connections.subscribe(function (mc) {
                            expect(ref.injector.get(core_1.NgZone).hasPendingMacrotasks).toBeTruthy();
                            mc.mockRespond(new http_2.Response(new http_2.ResponseOptions({ body: 'success!', status: 200 })));
                        });
                        http.get('http://localhost/testing').subscribe(function (resp) {
                            expect(resp.text()).toBe('success!');
                        });
                    });
                });
            }));
            it('works when HttpModule is included after ServerModule', testing_2.async(function () {
                var platform = platform_server_1.platformDynamicServer([{ provide: platform_server_1.INITIAL_CONFIG, useValue: { document: '<app></app>' } }]);
                platform.bootstrapModule(HttpAfterExampleModule).then(function (ref) {
                    var mock = ref.injector.get(testing_3.MockBackend);
                    var http = ref.injector.get(http_2.Http);
                    expect(ref.injector.get(core_1.NgZone).hasPendingMacrotasks).toBeFalsy();
                    ref.injector.get(core_1.NgZone).run(function () {
                        core_1.NgZone.assertInAngularZone();
                        mock.connections.subscribe(function (mc) {
                            expect(ref.injector.get(core_1.NgZone).hasPendingMacrotasks).toBeTruthy();
                            mc.mockRespond(new http_2.Response(new http_2.ResponseOptions({ body: 'success!', status: 200 })));
                        });
                        http.get('http://localhost/testing').subscribe(function (resp) {
                            expect(resp.text()).toBe('success!');
                        });
                    });
                });
            }));
            it('throws when given a relative URL', testing_2.async(function () {
                var platform = platform_server_1.platformDynamicServer([{ provide: platform_server_1.INITIAL_CONFIG, useValue: { document: '<app></app>' } }]);
                platform.bootstrapModule(ExampleModule).then(function (ref) {
                    var http = ref.injector.get(http_2.Http);
                    expect(function () { return http.get('/testing'); })
                        .toThrowError('URLs requested via Http on the server must be absolute. URL: /testing');
                });
            }));
        });
        describe('HttpClient', function () {
            it('can inject HttpClient', testing_2.async(function () {
                var platform = platform_server_1.platformDynamicServer([{ provide: platform_server_1.INITIAL_CONFIG, useValue: { document: '<app></app>' } }]);
                platform.bootstrapModule(HttpClientExampleModule).then(function (ref) {
                    expect(ref.injector.get(http_1.HttpClient) instanceof http_1.HttpClient).toBeTruthy();
                });
            }));
            it('can make HttpClient requests', testing_2.async(function () {
                var platform = platform_server_1.platformDynamicServer([{ provide: platform_server_1.INITIAL_CONFIG, useValue: { document: '<app></app>' } }]);
                platform.bootstrapModule(HttpClientExampleModule).then(function (ref) {
                    var mock = ref.injector.get(testing_1.HttpTestingController);
                    var http = ref.injector.get(http_1.HttpClient);
                    ref.injector.get(core_1.NgZone).run(function () {
                        http.get('http://localhost/testing').subscribe(function (body) {
                            core_1.NgZone.assertInAngularZone();
                            expect(body).toEqual('success!');
                        });
                        mock.expectOne('http://localhost/testing').flush('success!');
                    });
                });
            }));
            it('requests are macrotasks', testing_2.async(function () {
                var platform = platform_server_1.platformDynamicServer([{ provide: platform_server_1.INITIAL_CONFIG, useValue: { document: '<app></app>' } }]);
                platform.bootstrapModule(HttpClientExampleModule).then(function (ref) {
                    var mock = ref.injector.get(testing_1.HttpTestingController);
                    var http = ref.injector.get(http_1.HttpClient);
                    ref.injector.get(core_1.NgZone).run(function () {
                        http.get('http://localhost/testing').subscribe(function (body) {
                            expect(body).toEqual('success!');
                        });
                        expect(ref.injector.get(core_1.NgZone).hasPendingMacrotasks).toBeTruthy();
                        mock.expectOne('http://localhost/testing').flush('success!');
                        expect(ref.injector.get(core_1.NgZone).hasPendingMacrotasks).toBeFalsy();
                    });
                });
            }));
            it('can use HttpInterceptor that injects HttpClient', function () {
                var platform = platform_server_1.platformDynamicServer([{ provide: platform_server_1.INITIAL_CONFIG, useValue: { document: '<app></app>' } }]);
                platform.bootstrapModule(HttpInterceptorExampleModule).then(function (ref) {
                    var mock = ref.injector.get(testing_1.HttpTestingController);
                    var http = ref.injector.get(http_1.HttpClient);
                    ref.injector.get(core_1.NgZone).run(function () {
                        http.get('http://localhost/testing').subscribe(function (body) {
                            core_1.NgZone.assertInAngularZone();
                            expect(body).toEqual('success!');
                        });
                        mock.expectOne('http://localhost/testing').flush('success!');
                    });
                });
            });
        });
        describe('ServerTransferStoreModule', function () {
            var called = false;
            var defaultExpectedOutput = '<html><head></head><body><app ng-version="0.0.0-PLACEHOLDER">Works!</app><script id="transfer-state" type="application/json">{&q;test&q;:10}</script></body></html>';
            beforeEach(function () { called = false; });
            afterEach(function () { expect(called).toBe(true); });
            it('adds transfer script tag when using renderModule', testing_2.async(function () {
                platform_server_1.renderModule(TransferStoreModule, { document: '<app></app>' }).then(function (output) {
                    expect(output).toBe(defaultExpectedOutput);
                    called = true;
                });
            }));
            it('adds transfer script tag when using renderModuleFactory', testing_2.async(testing_2.inject([core_1.PlatformRef], function (defaultPlatform) {
                var compilerFactory = defaultPlatform.injector.get(core_1.CompilerFactory, null);
                var moduleFactory = compilerFactory.createCompiler().compileModuleSync(TransferStoreModule);
                platform_server_1.renderModuleFactory(moduleFactory, { document: '<app></app>' }).then(function (output) {
                    expect(output).toBe(defaultExpectedOutput);
                    called = true;
                });
            })));
            it('cannot break out of <script> tag in serialized output', testing_2.async(function () {
                platform_server_1.renderModule(EscapedTransferStoreModule, {
                    document: '<esc-app></esc-app>'
                }).then(function (output) {
                    expect(output).toBe('<html><head></head><body><esc-app ng-version="0.0.0-PLACEHOLDER">Works!</esc-app>' +
                        '<script id="transfer-state" type="application/json">' +
                        '{&q;testString&q;:&q;&l;/script&g;&l;script&g;' +
                        'alert(&s;Hello&a;&s; + \\&q;World\\&q;);&q;}</script></body></html>');
                    called = true;
                });
            }));
        });
    });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWdyYXRpb25fc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3BsYXRmb3JtLXNlcnZlci90ZXN0L2ludGVncmF0aW9uX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7QUFFSCxrREFBaUc7QUFDakcsMENBQWtGO0FBQ2xGLDZDQUEySTtBQUMzSSx3REFBNEY7QUFDNUYsc0NBQTROO0FBQzVOLGlEQUE2RDtBQUM3RCxzQ0FBc0Y7QUFDdEYsaURBQWtFO0FBQ2xFLDhEQUFnSDtBQUNoSCw2RUFBcUU7QUFDckUsNERBQWlNO0FBRWpNLDRDQUFxQztBQUdyQztJQUFBO0lBQ0EsQ0FBQztJQURLLFdBQVc7UUFEaEIsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBQyxDQUFDO09BQzNDLFdBQVcsQ0FDaEI7SUFBRCxrQkFBQztDQUFBLEFBREQsSUFDQztBQVdEO0lBQUE7SUFDQSxDQUFDO0lBREssYUFBYTtRQVRsQixlQUFRLENBQUM7WUFDUixTQUFTLEVBQUUsQ0FBQyxXQUFXLENBQUM7WUFDeEIsWUFBWSxFQUFFLENBQUMsV0FBVyxDQUFDO1lBQzNCLE9BQU8sRUFBRSxDQUFDLDhCQUFZLENBQUM7WUFDdkIsU0FBUyxFQUFFO2dCQUNULHFCQUFXO2dCQUNYLEVBQUMsT0FBTyxFQUFFLGlCQUFVLEVBQUUsV0FBVyxFQUFFLHFCQUFXLEVBQUM7YUFDaEQ7U0FDRixDQUFDO09BQ0ksYUFBYSxDQUNsQjtJQUFELG9CQUFDO0NBQUEsQUFERCxJQUNDO0FBRUQsNEJBQTRCLEdBQVE7SUFDbEMsT0FBTztRQUNMLDRDQUE0QztRQUM1QyxHQUFHLENBQUMsS0FBSyxHQUFHLFlBQVksQ0FBQztJQUMzQixDQUFDLENBQUM7QUFDSixDQUFDO0FBRUQ7SUFDRSxNQUFNLElBQUksS0FBSyxDQUFDLE9BQU8s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