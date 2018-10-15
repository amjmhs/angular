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
var platform_browser_1 = require("@angular/platform-browser");
var util_1 = require("../util");
var trustedEmptyColor;
var trustedGreyColor;
function createTreeComponent(level, isLeaf) {
    var nextTreeEl = "tree" + (level + 1);
    var template = "<span [style.backgroundColor]=\"bgColor\"> {{data.value}} </span>";
    if (!isLeaf) {
        template +=
            "<" + nextTreeEl + " [data]='data.right'></" + nextTreeEl + "><" + nextTreeEl + " [data]='data.left'></" + nextTreeEl + ">";
    }
    var TreeComponent = /** @class */ (function () {
        function TreeComponent() {
        }
        Object.defineProperty(TreeComponent.prototype, "bgColor", {
            get: function () { return this.data.depth % 2 ? trustedEmptyColor : trustedGreyColor; },
            enumerable: true,
            configurable: true
        });
        __decorate([
            core_1.Input(),
            __metadata("design:type", util_1.TreeNode)
        ], TreeComponent.prototype, "data", void 0);
        TreeComponent = __decorate([
            core_1.Component({ selector: "tree" + level, template: template })
        ], TreeComponent);
        return TreeComponent;
    }());
    return TreeComponent;
}
var RootTreeComponent = /** @class */ (function () {
    function RootTreeComponent() {
        this.data = util_1.emptyTree;
    }
    __decorate([
        core_1.Input(),
        __metadata("design:type", util_1.TreeNode)
    ], RootTreeComponent.prototype, "data", void 0);
    RootTreeComponent = __decorate([
        core_1.Component({ selector: 'tree', template: "<tree0 *ngIf=\"data.left != null\" [data]='data'></tree0>" })
    ], RootTreeComponent);
    return RootTreeComponent;
}());
exports.RootTreeComponent = RootTreeComponent;
function createModule() {
    var components = [RootTreeComponent];
    for (var i = 0; i <= util_1.maxDepth; i++) {
        components.push(createTreeComponent(i, i === util_1.maxDepth));
    }
    var AppModule = /** @class */ (function () {
        function AppModule(sanitizer) {
            trustedEmptyColor = sanitizer.bypassSecurityTrustStyle('');
            trustedGreyColor = sanitizer.bypassSecurityTrustStyle('grey');
        }
        AppModule = __decorate([
            core_1.NgModule({ imports: [platform_browser_1.BrowserModule], bootstrap: [RootTreeComponent], declarations: [components] }),
            __metadata("design:paramtypes", [platform_browser_1.DomSanitizer])
        ], AppModule);
        return AppModule;
    }());
    return AppModule;
}
exports.AppModule = createModule();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvYmVuY2htYXJrcy9zcmMvdHJlZS9uZzJfc3RhdGljL3RyZWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBeUQ7QUFDekQsOERBQWlGO0FBRWpGLGdDQUFzRDtBQUV0RCxJQUFJLGlCQUE0QixDQUFDO0FBQ2pDLElBQUksZ0JBQTJCLENBQUM7QUFFaEMsNkJBQTZCLEtBQWEsRUFBRSxNQUFlO0lBQ3pELElBQU0sVUFBVSxHQUFHLFVBQU8sS0FBSyxHQUFDLENBQUMsQ0FBRSxDQUFDO0lBQ3BDLElBQUksUUFBUSxHQUFHLG1FQUFpRSxDQUFDO0lBQ2pGLElBQUksQ0FBQyxNQUFNLEVBQUU7UUFDWCxRQUFRO1lBQ0osTUFBSSxVQUFVLCtCQUEwQixVQUFVLFVBQUssVUFBVSw4QkFBeUIsVUFBVSxNQUFHLENBQUM7S0FDN0c7SUFHRDtRQUFBO1FBSUEsQ0FBQztRQURDLHNCQUFJLGtDQUFPO2lCQUFYLGNBQWdCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDOzs7V0FBQTtRQURwRjtZQURDLFlBQUssRUFBRTtzQ0FDRixlQUFRO21EQUFDO1FBRlgsYUFBYTtZQURsQixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLFNBQU8sS0FBTyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUMsQ0FBQztXQUNwRCxhQUFhLENBSWxCO1FBQUQsb0JBQUM7S0FBQSxBQUpELElBSUM7SUFFRCxPQUFPLGFBQWEsQ0FBQztBQUN2QixDQUFDO0FBR0Q7SUFEQTtRQUdFLFNBQUksR0FBYSxnQkFBUyxDQUFDO0lBQzdCLENBQUM7SUFEQztRQURDLFlBQUssRUFBRTtrQ0FDRixlQUFRO21EQUFhO0lBRmhCLGlCQUFpQjtRQUQ3QixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsMkRBQXlELEVBQUMsQ0FBQztPQUN0RixpQkFBaUIsQ0FHN0I7SUFBRCx3QkFBQztDQUFBLEFBSEQsSUFHQztBQUhZLDhDQUFpQjtBQUs5QjtJQUNFLElBQU0sVUFBVSxHQUFVLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUM5QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksZUFBUSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ2xDLFVBQVUsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxlQUFRLENBQUMsQ0FBQyxDQUFDO0tBQ3pEO0lBR0Q7UUFDRSxtQkFBWSxTQUF1QjtZQUNqQyxpQkFBaUIsR0FBRyxTQUFTLENBQUMsd0JBQXdCLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDM0QsZ0JBQWdCLEdBQUcsU0FBUyxDQUFDLHdCQUF3QixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2hFLENBQUM7UUFKRyxTQUFTO1lBRGQsZUFBUSxDQUFDLEVBQUMsT0FBTyxFQUFFLENBQUMsZ0NBQWEsQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLGlCQUFpQixDQUFDLEVBQUUsWUFBWSxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUMsQ0FBQzs2Q0FFeEUsK0JBQVk7V0FEL0IsU0FBUyxDQUtkO1FBQUQsZ0JBQUM7S0FBQSxBQUxELElBS0M7SUFFRCxPQUFPLFNBQVMsQ0FBQztBQUNuQixDQUFDO0FBRVksUUFBQSxTQUFTLEdBQUcsWUFBWSxFQUFFLENBQUMifQ==