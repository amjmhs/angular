"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var platform_browser_1 = require("@angular/platform-browser");
var testing_2 = require("@angular/private/testing");
var browser_1 = require("../../platform-browser/src/browser");
var application_module_1 = require("../src/application_module");
var ng_module_ref_1 = require("../src/render3/ng_module_ref");
describe('ApplicationRef bootstrap', function () {
    var HelloWorldComponent = /** @class */ (function () {
        function HelloWorldComponent() {
            this.log = [];
            this.name = 'World';
        }
        HelloWorldComponent.prototype.ngOnInit = function () { this.log.push('OnInit'); };
        HelloWorldComponent.prototype.ngDoCheck = function () { this.log.push('DoCheck'); };
        HelloWorldComponent.ngComponentDef = core_1.ɵdefineComponent({
            type: HelloWorldComponent,
            selectors: [['hello-world']],
            factory: function () { return new HelloWorldComponent(); },
            template: function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    core_1.ɵE(0, 'div');
                    core_1.ɵT(1);
                    core_1.ɵe();
                }
                if (rf & 2 /* Update */) {
                    core_1.ɵt(1, core_1.ɵi1('Hello ', ctx.name, ''));
                }
            }
        });
        return HelloWorldComponent;
    }());
    var MyAppModule = /** @class */ (function () {
        function MyAppModule() {
        }
        MyAppModule.ngInjectorDef = core_1.defineInjector({ factory: function () { return new MyAppModule(); }, imports: [platform_browser_1.BrowserModule] });
        MyAppModule.ngModuleDef = defineNgModule({ bootstrap: [HelloWorldComponent] });
        return MyAppModule;
    }());
    it('should bootstrap hello world', testing_2.withBody('<hello-world></hello-world>', function () { return __awaiter(_this, void 0, void 0, function () {
        var MyAppModuleFactory, moduleRef, appRef, helloWorldComponent, registry;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    MyAppModuleFactory = new ng_module_ref_1.NgModuleFactory(MyAppModule);
                    return [4 /*yield*/, testing_1.getTestBed().platform.bootstrapModuleFactory(MyAppModuleFactory, { ngZone: 'noop' })];
                case 1:
                    moduleRef = _a.sent();
                    appRef = moduleRef.injector.get(core_1.ApplicationRef);
                    helloWorldComponent = appRef.components[0].instance;
                    expect(document.body.innerHTML).toEqual('<hello-world><div>Hello World</div></hello-world>');
                    // TODO(jasonaden): Get with Kara on lifecycle hooks
                    //  expect(helloWorldComponent.log).toEqual(['OnInit', 'DoCheck']);
                    helloWorldComponent.name = 'Mundo';
                    appRef.tick();
                    expect(document.body.innerHTML).toEqual('<hello-world><div>Hello Mundo</div></hello-world>');
                    registry = testing_1.getTestBed().get(core_1.TestabilityRegistry);
                    registry.unregisterAllApplications();
                    return [2 /*return*/];
            }
        });
    }); }));
});
/////////////////////////////////////////////////////////
// These go away when Compiler is ready
platform_browser_1.BrowserModule.ngInjectorDef = core_1.defineInjector({
    factory: function BrowserModule_Factory() {
        return new platform_browser_1.BrowserModule(core_1.inject(platform_browser_1.BrowserModule, 8 /* Optional */ | 4 /* SkipSelf */));
    },
    imports: [core_1.ApplicationModule],
    providers: browser_1.BROWSER_MODULE_PROVIDERS
});
core_1.ApplicationModule.ngInjectorDef = core_1.defineInjector({
    factory: function ApplicationModule_Factory() {
        return new core_1.ApplicationModule(core_1.inject(core_1.ApplicationRef));
    },
    providers: application_module_1.APPLICATION_MODULE_PROVIDERS
});
function defineNgModule(_a) {
    var bootstrap = _a.bootstrap;
    return { bootstrap: bootstrap || [], };
}
exports.defineNgModule = defineNgModule;
/////////////////////////////////////////////////////////
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbGljYXRpb25fcmVmX2ludGVncmF0aW9uX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3Rlc3QvYXBwbGljYXRpb25fcmVmX2ludGVncmF0aW9uX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsaUJBdUZBOztBQXZGQSxzQ0FBOFc7QUFDOVcsaURBQWlEO0FBQ2pELDhEQUFnRztBQUNoRyxvREFBa0Q7QUFFbEQsOERBQTRFO0FBQzVFLGdFQUF1RTtBQUN2RSw4REFBNkQ7QUFFN0QsUUFBUSxDQUFDLDBCQUEwQixFQUFFO0lBQ25DO1FBQUE7WUFDRSxRQUFHLEdBQWEsRUFBRSxDQUFDO1lBQ25CLFNBQUksR0FBRyxPQUFPLENBQUM7UUFvQmpCLENBQUM7UUFIQyxzQ0FBUSxHQUFSLGNBQW1CLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUU3Qyx1Q0FBUyxHQUFULGNBQW9CLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQWxCeEMsa0NBQWMsR0FBRyx1QkFBZSxDQUFDO1lBQ3RDLElBQUksRUFBRSxtQkFBbUI7WUFDekIsU0FBUyxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUM1QixPQUFPLEVBQUUsY0FBTSxPQUFBLElBQUksbUJBQW1CLEVBQUUsRUFBekIsQ0FBeUI7WUFDeEMsUUFBUSxFQUFFLFVBQVMsRUFBZSxFQUFFLEdBQXdCO2dCQUMxRCxJQUFJLEVBQUUsaUJBQXFCLEVBQUU7b0JBQzNCLFNBQVksQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7b0JBQ3ZCLFNBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDUixTQUFVLEVBQUUsQ0FB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