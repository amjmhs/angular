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
{
    describe('ViewChild', function () {
        beforeEach(function () {
            testing_1.TestBed.configureTestingModule({
                declarations: [ViewChildTypeSelectorComponent, ViewChildStringSelectorComponent, Simple],
                schemas: [core_1.NO_ERRORS_SCHEMA],
            });
        });
        it('should support type selector', function () {
            testing_1.TestBed.overrideComponent(ViewChildTypeSelectorComponent, { set: { template: "<simple [marker]=\"'1'\"></simple><simple [marker]=\"'2'\"></simple>" } });
            var view = testing_1.TestBed.createComponent(ViewChildTypeSelectorComponent);
            view.detectChanges();
            expect(view.componentInstance.child).toBeDefined();
            expect(view.componentInstance.child.marker).toBe('1');
        });
        it('should support string selector', function () {
            testing_1.TestBed.overrideComponent(ViewChildStringSelectorComponent, { set: { template: "<simple #child></simple>" } });
            var view = testing_1.TestBed.createComponent(ViewChildStringSelectorComponent);
            view.detectChanges();
            expect(view.componentInstance.child).toBeDefined();
        });
    });
    describe('ViewChildren', function () {
        beforeEach(function () {
            testing_1.TestBed.configureTestingModule({
                declarations: [ViewChildrenTypeSelectorComponent, ViewChildrenStringSelectorComponent, Simple],
                schemas: [core_1.NO_ERRORS_SCHEMA],
            });
        });
        it('should support type selector', function () {
            testing_1.TestBed.overrideComponent(ViewChildrenTypeSelectorComponent, { set: { template: "<simple></simple><simple></simple>" } });
            var view = testing_1.TestBed.createComponent(ViewChildrenTypeSelectorComponent);
            view.detectChanges();
            expect(view.componentInstance.children).toBeDefined();
            expect(view.componentInstance.children.length).toBe(2);
        });
        it('should support string selector', function () {
            testing_1.TestBed.overrideComponent(ViewChildrenStringSelectorComponent, { set: { template: "<simple #child1></simple><simple #child2></simple>" } });
            var view = testing_1.TestBed.configureTestingModule({ schemas: [core_1.NO_ERRORS_SCHEMA] })
                .createComponent(ViewChildrenStringSelectorComponent);
            view.detectChanges();
            expect(view.componentInstance.children).toBeDefined();
            expect(view.componentInstance.children.length).toBe(2);
        });
    });
}
var Simple = /** @class */ (function () {
    function Simple() {
    }
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], Simple.prototype, "marker", void 0);
    Simple = __decorate([
        core_1.Directive({ selector: 'simple' })
    ], Simple);
    return Simple;
}());
var ViewChildTypeSelectorComponent = /** @class */ (function () {
    function ViewChildTypeSelectorComponent() {
    }
    __decorate([
        core_1.ViewChild(Simple),
        __metadata("design:type", Simple)
    ], ViewChildTypeSelectorComponent.prototype, "child", void 0);
    ViewChildTypeSelectorComponent = __decorate([
        core_1.Component({ selector: 'view-child-type-selector', template: '' })
    ], ViewChildTypeSelectorComponent);
    return ViewChildTypeSelectorComponent;
}());
var ViewChildStringSelectorComponent = /** @class */ (function () {
    function ViewChildStringSelectorComponent() {
    }
    __decorate([
        core_1.ViewChild('child'),
        __metadata("design:type", core_1.ElementRef)
    ], ViewChildStringSelectorComponent.prototype, "child", void 0);
    ViewChildStringSelectorComponent = __decorate([
        core_1.Component({ selector: 'view-child-string-selector', template: '' })
    ], ViewChildStringSelectorComponent);
    return ViewChildStringSelectorComponent;
}());
var ViewChildrenTypeSelectorComponent = /** @class */ (function () {
    function ViewChildrenTypeSelectorComponent() {
    }
    __decorate([
        core_1.ViewChildren(Simple),
        __metadata("design:type", core_1.QueryList)
    ], ViewChildrenTypeSelectorComponent.prototype, "children", void 0);
    ViewChildrenTypeSelectorComponent = __decorate([
        core_1.Component({ selector: 'view-children-type-selector', template: '' })
    ], ViewChildrenTypeSelectorComponent);
    return ViewChildrenTypeSelectorComponent;
}());
var ViewChildrenStringSelectorComponent = /** @class */ (function () {
    function ViewChildrenStringSelectorComponent() {
    }
    __decorate([
        core_1.ViewChildren('child1 , child2'),
        __metadata("design:type", core_1.QueryList)
    ], ViewChildrenStringSelectorComponent.prototype, "children", void 0);
    ViewChildrenStringSelectorComponent = __decorate([
        core_1.Component({ selector: 'view-child-string-selector', template: '' })
    ], ViewChildrenStringSelectorComponent);
    return ViewChildrenStringSelectorComponent;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdC9tZXRhZGF0YS9kaV9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7O0FBRUgsc0NBQTRIO0FBQzVILGlEQUE4QztBQUU5QztJQUNFLFFBQVEsQ0FBQyxXQUFXLEVBQUU7UUFDcEIsVUFBVSxDQUFDO1lBQ1QsaUJBQU8sQ0FBQyxzQkFBc0IsQ0FBQztnQkFDN0IsWUFBWSxFQUFFLENBQUMsOEJBQThCLEVBQUUsZ0NBQWdDLEVBQUUsTUFBTSxDQUFDO2dCQUN4RixPQUFPLEVBQUUsQ0FBQyx1QkFBZ0IsQ0FBQzthQUM1QixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyw4QkFBOEIsRUFBRTtZQUNqQyxpQkFBTyxDQUFDLGlCQUFpQixDQUNyQiw4QkFBOEIsRUFDOUIsRUFBQyxHQUFHLEVBQUUsRUFBQyxRQUFRLEVBQUUsc0VBQWtFLEVBQUMsRUFBQyxDQUFDLENBQUM7WUFDM0YsSUFBTSxJQUFJLEdBQUcsaUJBQU8sQ0FBQyxlQUFlLENBQUMsOEJBQThCLENBQUMsQ0FBQztZQUVyRSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDckIsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNuRCxNQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDeEQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsZ0NBQWdDLEVBQUU7WUFDbkMsaUJBQU8sQ0FBQyxpQkFBaUIsQ0FDckIsZ0NBQWdDLEVBQUUsRUFBQyxHQUFHLEVBQUUsRUFBQyxRQUFRLEVBQUUsMEJBQTBCLEVBQUMsRUFBQyxDQUFDLENBQUM7WUFDckYsSUFBTSxJQUFJLEdBQUcsaUJBQU8sQ0FBQyxlQUFlLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztZQUV2RSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDckIsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNyRCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLGNBQWMsRUFBRTtRQUN2QixVQUFVLENBQUM7WUFDVCxpQkFBTyxDQUFDLHNCQUFzQixDQUFDO2dCQUM3QixZQUFZLEVBQ1IsQ0FBQyxpQ0FBaUMsRUFBRSxtQ0FBbUMsRUFBRSxNQUFNLENBQUM7Z0JBQ3BGLE9BQU8sRUFBRSxDQUFDLHVCQUFnQixDQUFDO2FBQzVCLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDhCQUE4QixFQUFFO1lBQ2pDLGlCQUFPLENBQUMsaUJBQWlCLENBQ3JCLGlDQUFpQyxFQUNqQyxFQUFDLEdBQUcsRUFBRSxFQUFDLFFBQVEsRUFBRSxvQ0FBb0MsRUFBQyxFQUFDLENBQUMsQ0FBQztZQUU3RCxJQUFNLElBQUksR0FBRyxpQkFBTyxDQUFDLGVBQWUsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO1lBQ3hFLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUNyQixNQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ3RELE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6RCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxnQ0FBZ0MsRUFBRTtZQUNuQyxpQkFBTyxDQUFDLGlCQUFpQixDQUNyQixtQ0FBbUMsRUFDbkMsRUFBQyxHQUFHLEVBQUUsRUFBQyxRQUFRLEVBQUUsb0RBQW9ELEVBQUMsRUFBQyxDQUFDLENBQUM7WUFDN0UsSUFBTSxJQUFJLEdBQUcsaUJBQU8sQ0FBQyxzQkFBc0IsQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLHVCQUFnQixDQUFDLEVBQUMsQ0FBQztpQkFDeEQsZUFBZSxDQUFDLG1DQUFtQyxDQUFDLENBQUM7WUFDdkUsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ3JCLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDdEQsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXpELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7Q0FDSjtBQUlEO0lBQUE7SUFHQSxDQUFDO0lBRFU7UUFBUixZQUFLLEVBQUU7OzBDQUFrQjtJQUZ0QixNQUFNO1FBRFgsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUMsQ0FBQztPQUMxQixNQUFNLENBR1g7SUFBRCxhQUFDO0NBQUEsQUFIRCxJQUdDO0FBR0Q7SUFBQTtJQUdBLENBQUM7SUFEb0I7UUFBbEIsZ0JBQVMsQ0FBQyxNQUFNLENBQUM7a0NBQVUsTUFBTTtpRUFBQztJQUYvQiw4QkFBOEI7UUFEbkMsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSwwQkFBMEIsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFDLENBQUM7T0FDMUQsOEJBQThCLENBR25DO0lBQUQscUNBQUM7Q0FBQSxBQUhELElBR0M7QUFHRDtJQUFBO0lBR0EsQ0FBQztJQURxQjtRQUFuQixnQkFBUyxDQUFDLE9BQU8sQ0FBQztrQ0FBVSxpQkFBVTttRUFBQztJQUZwQyxnQ0FBZ0M7UUFEckMsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSw0QkFBNEIsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFDLENBQUM7T0FDNUQsZ0NBQWdDLENBR3JDO0lBQUQsdUNBQUM7Q0FBQSxBQUhELElBR0M7QUFHRDtJQUFBO0lBR0EsQ0FBQztJQUR1QjtRQUFyQixtQkFBWSxDQUFDLE1BQU0sQ0FBQztrQ0FBYSxnQkFBUzt1RUFBUztJQUZoRCxpQ0FBaUM7UUFEdEMsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSw2QkFBNkIsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFDLENBQUM7T0FDN0QsaUNBQWlDLENBR3RDO0lBQUQsd0NBQUM7Q0FBQSxBQUhELElBR0M7QUFHRDtJQUFBO0lBSUEsQ0FBQztJQURrQztRQUFoQyxtQkFBWSxDQUFDLGlCQUFpQixDQUFDO2tDQUFhLGdCQUFTO3lFQUFhO0lBSC9ELG1DQUFtQztRQUR4QyxnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLDRCQUE0QixFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUMsQ0FBQztPQUM1RCxtQ0FBbUMsQ0FJeEM7SUFBRCwwQ0FBQztDQUFBLEFBSkQsSUFJQyJ9