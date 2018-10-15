"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var util_1 = require("../util");
var trustedEmptyColor;
var trustedGreyColor;
var TreeComponent = /** @class */ (function () {
    function TreeComponent() {
        this.data = util_1.emptyTree;
    }
    Object.defineProperty(TreeComponent.prototype, "bgColor", {
        get: function () { return this.data.depth % 2 ? trustedEmptyColor : trustedGreyColor; },
        enumerable: true,
        configurable: true
    });
    return TreeComponent;
}());
exports.TreeComponent = TreeComponent;
var viewFlags = 0 /* None */;
function TreeComponent_Host() {
    return core_1.ɵvid(viewFlags, [
        core_1.ɵeld(0, 0 /* None */, null, null, 1, 'tree', null, null, null, null, TreeComponent_0),
        core_1.ɵdid(1, 32768 /* Component */, null, 0, TreeComponent, []),
    ]);
}
function TreeComponent_1() {
    return core_1.ɵvid(viewFlags, [
        core_1.ɵeld(0, 0 /* None */, null, null, 1, 'tree', null, null, null, null, TreeComponent_0),
        core_1.ɵdid(1, 32768 /* Component */, null, 0, TreeComponent, [], { data: [0, 'data'] }),
    ], function (check, view) {
        var cmp = view.component;
        check(view, 1, 0 /* Inline */, cmp.data.left);
    });
}
function TreeComponent_2() {
    return core_1.ɵvid(viewFlags, [
        core_1.ɵeld(0, 0 /* None */, null, null, 1, 'tree', null, null, null, null, TreeComponent_0),
        core_1.ɵdid(1, 32768 /* Component */, null, 0, TreeComponent, [], { data: [0, 'data'] }),
    ], function (check, view) {
        var cmp = view.component;
        check(view, 1, 0 /* Inline */, cmp.data.left);
    });
}
function TreeComponent_0() {
    return core_1.ɵvid(viewFlags, [
        core_1.ɵeld(0, 0 /* None */, null, null, 1, 'span', null, [[4 /* TypeElementStyle */, 'backgroundColor', null]]),
        core_1.ɵted(1, null, [' ', ' ']),
        core_1.ɵand(16777216 /* EmbeddedViews */, null, null, 1, null, TreeComponent_1),
        core_1.ɵdid(3, 0 /* None */, null, 0, common_1.NgIf, [core_1.ViewContainerRef, core_1.TemplateRef], { ngIf: [0, 'ngIf'] }),
        core_1.ɵand(16777216 /* EmbeddedViews */, null, null, 1, null, TreeComponent_2),
        core_1.ɵdid(5, 0 /* None */, null, 0, common_1.NgIf, [core_1.ViewContainerRef, core_1.TemplateRef], { ngIf: [0, 'ngIf'] }),
    ], function (check, view) {
        var cmp = view.component;
        check(view, 3, 0 /* Inline */, cmp.data.left != null);
        check(view, 5, 0 /* Inline */, cmp.data.right != null);
    }, function (check, view) {
        var cmp = view.component;
        check(view, 0, 0 /* Inline */, cmp.bgColor);
        check(view, 1, 0 /* Inline */, cmp.data.value);
    });
}
var AppModule = /** @class */ (function () {
    function AppModule() {
        core_1.ɵinitServicesIfNeeded();
        this.sanitizer = new platform_browser_1.ɵDomSanitizerImpl(document);
        this.renderer2 = new platform_browser_1.ɵDomRendererFactory2(null, null);
        trustedEmptyColor = this.sanitizer.bypassSecurityTrustStyle('');
        trustedGreyColor = this.sanitizer.bypassSecurityTrustStyle('grey');
        this.componentFactory =
            core_1.ɵccf('#root', TreeComponent, TreeComponent_Host, {}, {}, []);
    }
    AppModule.prototype.get = function (token, notFoundValue) {
        if (notFoundValue === void 0) { notFoundValue = core_1.Injector.THROW_IF_NOT_FOUND; }
        switch (token) {
            case core_1.RendererFactory2:
                return this.renderer2;
            case core_1.Sanitizer:
                return this.sanitizer;
            case core_1.RootRenderer:
            case core_1.ErrorHandler:
                return null;
            case core_1.NgModuleRef:
                return this;
        }
        return core_1.Injector.NULL.get(token, notFoundValue);
    };
    AppModule.prototype.bootstrap = function () {
        this.componentRef =
            this.componentFactory.create(core_1.Injector.NULL, [], this.componentFactory.selector, this);
    };
    AppModule.prototype.tick = function () { this.componentRef.changeDetectorRef.detectChanges(); };
    Object.defineProperty(AppModule.prototype, "injector", {
        get: function () { return this; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModule.prototype, "componentFactoryResolver", {
        get: function () { return null; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppModule.prototype, "instance", {
        get: function () { return this; },
        enumerable: true,
        configurable: true
    });
    AppModule.prototype.destroy = function () { };
    AppModule.prototype.onDestroy = function (callback) { };
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvYmVuY2htYXJrcy9zcmMvdHJlZS9uZzJfbmV4dC90cmVlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsMENBQXFDO0FBQ3JDLHNDQUF1Z0I7QUFDdmdCLDhEQUF3STtBQUV4SSxnQ0FBNEM7QUFFNUMsSUFBSSxpQkFBNEIsQ0FBQztBQUNqQyxJQUFJLGdCQUEyQixDQUFDO0FBRWhDO0lBQUE7UUFDRSxTQUFJLEdBQWEsZ0JBQVMsQ0FBQztJQUU3QixDQUFDO0lBREMsc0JBQUksa0NBQU87YUFBWCxjQUFnQixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFDdEYsb0JBQUM7QUFBRCxDQUFDLEFBSEQsSUFHQztBQUhZLHNDQUFhO0FBSzFCLElBQUksU0FBUyxlQUFpQixDQUFDO0FBRS9CO0lBQ0UsT0FBTyxXQUFPLENBQUMsU0FBUyxFQUFFO1FBQ3hCLFdBQVUsQ0FBQyxDQUFDLGdCQUFrQixJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLGVBQWUsQ0FBQztRQUM3RixXQUFZLENBQUMsQ0FBQyx5QkFBdUIsSUFBSSxFQUFFLENBQUMsRUFBRSxhQUFhLEVBQUUsRUFBRSxDQUFDO0tBQ2pFLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFRDtJQUNFLE9BQU8sV0FBTyxDQUNWLFNBQVMsRUFDVDtRQUNFLFdBQVUsQ0FDTixDQUFDLGdCQUFrQixJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxF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