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
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var router_1 = require("@angular/router");
var testing_2 = require("@angular/router/testing");
describe('Integration', function () {
    describe('routerLinkActive', function () {
        it('should not cause infinite loops in the change detection - #15825', testing_1.fakeAsync(function () {
            var SimpleCmp = /** @class */ (function () {
                function SimpleCmp() {
                }
                SimpleCmp = __decorate([
                    core_1.Component({ selector: 'simple', template: 'simple' })
                ], SimpleCmp);
                return SimpleCmp;
            }());
            var MyCmp = /** @class */ (function () {
                function MyCmp() {
                    this.show = false;
                }
                MyCmp = __decorate([
                    core_1.Component({
                        selector: 'some-root',
                        template: "\n        <div *ngIf=\"show\">\n          <ng-container *ngTemplateOutlet=\"tpl\"></ng-container>\n        </div>\n        <router-outlet></router-outlet>\n        <ng-template #tpl>\n          <a routerLink=\"/simple\" routerLinkActive=\"active\"></a>\n        </ng-template>"
                    })
                ], MyCmp);
                return MyCmp;
            }());
            var MyModule = /** @class */ (function () {
                function MyModule() {
                }
                MyModule = __decorate([
                    core_1.NgModule({
                        imports: [common_1.CommonModule, testing_2.RouterTestingModule],
                        declarations: [MyCmp, SimpleCmp],
                        entryComponents: [SimpleCmp],
                    })
                ], MyModule);
                return MyModule;
            }());
            testing_1.TestBed.configureTestingModule({ imports: [MyModule] });
            var router = testing_1.TestBed.get(router_1.Router);
            var fixture = createRoot(router, MyCmp);
            router.resetConfig([{ path: 'simple', component: SimpleCmp }]);
            router.navigateByUrl('/simple');
            advance(fixture);
            var instance = fixture.componentInstance;
            instance.show = true;
            expect(function () { return advance(fixture); }).not.toThrow();
        }));
        it('should set isActive right after looking at its children -- #18983', testing_1.fakeAsync(function () {
            var ComponentWithRouterLink = /** @class */ (function () {
                function ComponentWithRouterLink() {
                }
                ComponentWithRouterLink.prototype.addLink = function () {
                    this.container.createEmbeddedView(this.templateRef, { $implicit: '/simple' });
                };
                ComponentWithRouterLink.prototype.removeLink = function () { this.container.clear(); };
                __decorate([
                    core_1.ViewChild(core_1.TemplateRef),
                    __metadata("design:type", core_1.TemplateRef)
                ], ComponentWithRouterLink.prototype, "templateRef", void 0);
                __decorate([
                    core_1.ViewChild('container', { read: core_1.ViewContainerRef }),
                    __metadata("design:type", core_1.ViewContainerRef)
                ], ComponentWithRouterLink.prototype, "container", void 0);
                ComponentWithRouterLink = __decorate([
                    core_1.Component({
                        template: "\n          <div #rla=\"routerLinkActive\" routerLinkActive>\n            isActive: {{rla.isActive}}\n            \n            <ng-template let-data>\n              <a [routerLink]=\"data\">link</a>\n            </ng-template>\n\n            <ng-container #container></ng-container>\n          </div>\n        "
                    })
                ], ComponentWithRouterLink);
                return ComponentWithRouterLink;
            }());
            var SimpleCmp = /** @class */ (function () {
                function SimpleCmp() {
                }
                SimpleCmp = __decorate([
                    core_1.Component({ template: 'simple' })
                ], SimpleCmp);
                return SimpleCmp;
            }());
            testing_1.TestBed.configureTestingModule({
                imports: [testing_2.RouterTestingModule.withRoutes([{ path: 'simple', component: SimpleCmp }])],
                declarations: [ComponentWithRouterLink, SimpleCmp]
            });
            var router = testing_1.TestBed.get(router_1.Router);
            var fixture = createRoot(router, ComponentWithRouterLink);
            router.navigateByUrl('/simple');
            advance(fixture);
            fixture.componentInstance.addLink();
            fixture.detectChanges();
            fixture.componentInstance.removeLink();
            advance(fixture);
            advance(fixture);
            expect(fixture.nativeElement.innerHTML).toContain('isActive: false');
        }));
    });
});
function advance(fixture) {
    testing_1.tick();
    fixture.detectChanges();
}
function createRoot(router, type) {
    var f = testing_1.TestBed.createComponent(type);
    advance(f);
    router.initialNavigation();
    advance(f);
    return f;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVncmVzc2lvbl9pbnRlZ3JhdGlvbi5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcm91dGVyL3Rlc3QvcmVncmVzc2lvbl9pbnRlZ3JhdGlvbi5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7O0FBRUgsMENBQTZDO0FBQzdDLHNDQUFnSDtBQUNoSCxpREFBaUY7QUFFakYsMENBQXVDO0FBQ3ZDLG1EQUE0RDtBQUU1RCxRQUFRLENBQUMsYUFBYSxFQUFFO0lBRXRCLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRTtRQUMzQixFQUFFLENBQUMsa0VBQWtFLEVBQUUsbUJBQVMsQ0FBQztZQUU1RTtnQkFBQTtnQkFDQSxDQUFDO2dCQURLLFNBQVM7b0JBRGQsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBQyxDQUFDO21CQUM5QyxTQUFTLENBQ2Q7Z0JBQUQsZ0JBQUM7YUFBQSxBQURELElBQ0M7WUFhRDtnQkFYQTtvQkFZRSxTQUFJLEdBQVksS0FBSyxDQUFDO2dCQUN4QixDQUFDO2dCQUZLLEtBQUs7b0JBWFYsZ0JBQVMsQ0FBQzt3QkFDVCxRQUFRLEVBQUUsV0FBVzt3QkFDckIsUUFBUSxFQUFFLHNSQU9FO3FCQUNiLENBQUM7bUJBQ0ksS0FBSyxDQUVWO2dCQUFELFlBQUM7YUFBQSxBQUZELElBRUM7WUFPRDtnQkFBQTtnQkFDQSxDQUFDO2dCQURLLFFBQVE7b0JBTGIsZUFBUSxDQUFDO3dCQUNSLE9BQU8sRUFBRSxDQUFDLHFCQUFZLEVBQUUsNkJBQW1CLENBQUM7d0JBQzVDLFlBQVksRUFBRSxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUM7d0JBQ2hDLGVBQWUsRUFBRSxDQUFDLFNBQVMsQ0FBQztxQkFDN0IsQ0FBQzttQkFDSSxRQUFRLENBQ2I7Z0JBQUQsZUFBQzthQUFBLEFBREQsSUFDQztZQUVE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