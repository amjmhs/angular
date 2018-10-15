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
var platform_browser_1 = require("@angular/platform-browser");
var dom_adapter_1 = require("@angular/platform-browser/src/dom/dom_adapter");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
{
    describe('title service', function () {
        var doc;
        var initialTitle;
        var titleService;
        beforeEach(function () {
            doc = dom_adapter_1.getDOM().createHtmlDocument();
            initialTitle = dom_adapter_1.getDOM().getTitle(doc);
            titleService = new platform_browser_1.Title(doc);
        });
        afterEach(function () { dom_adapter_1.getDOM().setTitle(doc, initialTitle); });
        it('should allow reading initial title', function () { matchers_1.expect(titleService.getTitle()).toEqual(initialTitle); });
        it('should set a title on the injected document', function () {
            titleService.setTitle('test title');
            matchers_1.expect(dom_adapter_1.getDOM().getTitle(doc)).toEqual('test title');
            matchers_1.expect(titleService.getTitle()).toEqual('test title');
        });
        it('should reset title to empty string if title not provided', function () {
            titleService.setTitle(null);
            matchers_1.expect(dom_adapter_1.getDOM().getTitle(doc)).toEqual('');
        });
    });
    describe('integration test', function () {
        var DependsOnTitle = /** @class */ (function () {
            function DependsOnTitle(title) {
                this.title = title;
            }
            DependsOnTitle = __decorate([
                core_1.Injectable(),
                __metadata("design:paramtypes", [platform_browser_1.Title])
            ], DependsOnTitle);
            return DependsOnTitle;
        }());
        beforeEach(function () {
            testing_1.TestBed.configureTestingModule({
                imports: [platform_browser_1.BrowserModule],
                providers: [DependsOnTitle],
            });
        });
        it('should inject Title service when using BrowserModule', function () { matchers_1.expect(testing_1.TestBed.get(DependsOnTitle).title).toBeAnInstanceOf(platform_browser_1.Title); });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGl0bGVfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3BsYXRmb3JtLWJyb3dzZXIvdGVzdC9icm93c2VyL3RpdGxlX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBeUM7QUFDekMsaURBQThDO0FBQzlDLDhEQUErRDtBQUMvRCw2RUFBcUU7QUFDckUsMkVBQXNFO0FBRXRFO0lBQ0UsUUFBUSxDQUFDLGVBQWUsRUFBRTtRQUN4QixJQUFJLEdBQWEsQ0FBQztRQUNsQixJQUFJLFlBQW9CLENBQUM7UUFDekIsSUFBSSxZQUFtQixDQUFDO1FBRXhCLFVBQVUsQ0FBQztZQUNULEdBQUcsR0FBRyxvQkFBTSxFQUFFLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUNwQyxZQUFZLEdBQUcsb0JBQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN0QyxZQUFZLEdBQUcsSUFBSSx3QkFBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2hDLENBQUMsQ0FBQyxDQUFDO1FBRUgsU0FBUyxDQUFDLGNBQVEsb0JBQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUUzRCxFQUFFLENBQUMsb0NBQW9DLEVBQ3BDLGNBQVEsaUJBQU0sQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVyRSxFQUFFLENBQUMsNkNBQTZDLEVBQUU7WUFDaEQsWUFBWSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNwQyxpQkFBTSxDQUFDLG9CQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDckQsaUJBQU0sQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDeEQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsMERBQTBELEVBQUU7WUFDN0QsWUFBWSxDQUFDLFFBQVEsQ0FBQyxJQUFNLENBQUMsQ0FBQztZQUM5QixpQkFBTSxDQUFDLG9CQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDN0MsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxrQkFBa0IsRUFBRTtRQUczQjtZQUNFLHdCQUFtQixLQUFZO2dCQUFaLFVBQUssR0FBTCxLQUFLLENBQU87WUFBRyxDQUFDO1lBRC9CLGNBQWM7Z0JBRG5CLGlCQUFVLEVBQUU7aURBRWUsd0JBQUs7ZUFEM0IsY0FBYyxDQUVuQjtZQUFELHFCQUFDO1NBQUEsQUFGRCxJQUVDO1FBRUQsVUFBVSxDQUFDO1lBQ1QsaUJBQU8sQ0FBQyxzQkFBc0IsQ0FBQztnQkFDN0IsT0FBTyxFQUFFLENBQUMsZ0NBQWEsQ0FBQztnQkFDeEIsU0FBUyxFQUFFLENBQUMsY0FBYyxDQUFDO2FBQzVCLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHNEQUFzRCxFQUN0RCxjQUFRLGlCQUFNLENBQUMsaUJBQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsd0JBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbkYsQ0FBQyxDQUFDLENBQUM7Q0FDSiJ9