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
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
{
    describe('ngPlural', function () {
        var fixture;
        function getComponent() { return fixture.componentInstance; }
        function detectChangesAndExpectText(text) {
            fixture.detectChanges();
            matchers_1.expect(fixture.nativeElement).toHaveText(text);
        }
        afterEach(function () { fixture = null; });
        beforeEach(function () {
            testing_1.TestBed.configureTestingModule({
                declarations: [TestComponent],
                providers: [{ provide: common_1.NgLocalization, useClass: TestLocalization }],
                imports: [common_1.CommonModule]
            });
        });
        it('should display the template according to the exact value', testing_1.async(function () {
            var template = '<ul [ngPlural]="switchValue">' +
                '<ng-template ngPluralCase="=0"><li>you have no messages.</li></ng-template>' +
                '<ng-template ngPluralCase="=1"><li>you have one message.</li></ng-template>' +
                '</ul>';
            fixture = createTestComponent(template);
            getComponent().switchValue = 0;
            detectChangesAndExpectText('you have no messages.');
            getComponent().switchValue = 1;
            detectChangesAndExpectText('you have one message.');
        }));
        it('should display the template according to the exact numeric value', testing_1.async(function () {
            var template = '<div>' +
                '<ul [ngPlural]="switchValue">' +
                '<ng-template ngPluralCase="0"><li>you have no messages.</li></ng-template>' +
                '<ng-template ngPluralCase="1"><li>you have one message.</li></ng-template>' +
                '</ul></div>';
            fixture = createTestComponent(template);
            getComponent().switchValue = 0;
            detectChangesAndExpectText('you have no messages.');
            getComponent().switchValue = 1;
            detectChangesAndExpectText('you have one message.');
        }));
        // https://github.com/angular/angular/issues/9868
        // https://github.com/angular/angular/issues/9882
        it('should not throw when ngPluralCase contains expressions', testing_1.async(function () {
            var template = '<ul [ngPlural]="switchValue">' +
                '<ng-template ngPluralCase="=0"><li>{{ switchValue }}</li></ng-template>' +
                '</ul>';
            fixture = createTestComponent(template);
            getComponent().switchValue = 0;
            matchers_1.expect(function () { return fixture.detectChanges(); }).not.toThrow();
        }));
        it('should be applicable to <ng-container> elements', testing_1.async(function () {
            var template = '<ng-container [ngPlural]="switchValue">' +
                '<ng-template ngPluralCase="=0">you have no messages.</ng-template>' +
                '<ng-template ngPluralCase="=1">you have one message.</ng-template>' +
                '</ng-container>';
            fixture = createTestComponent(template);
            getComponent().switchValue = 0;
            detectChangesAndExpectText('you have no messages.');
            getComponent().switchValue = 1;
            detectChangesAndExpectText('you have one message.');
        }));
        it('should display the template according to the category', testing_1.async(function () {
            var template = '<ul [ngPlural]="switchValue">' +
                '<ng-template ngPluralCase="few"><li>you have a few messages.</li></ng-template>' +
                '<ng-template ngPluralCase="many"><li>you have many messages.</li></ng-template>' +
                '</ul>';
            fixture = createTestComponent(template);
            getComponent().switchValue = 2;
            detectChangesAndExpectText('you have a few messages.');
            getComponent().switchValue = 8;
            detectChangesAndExpectText('you have many messages.');
        }));
        it('should default to other when no matches are found', testing_1.async(function () {
            var template = '<ul [ngPlural]="switchValue">' +
                '<ng-template ngPluralCase="few"><li>you have a few messages.</li></ng-template>' +
                '<ng-template ngPluralCase="other"><li>default message.</li></ng-template>' +
                '</ul>';
            fixture = createTestComponent(template);
            getComponent().switchValue = 100;
            detectChangesAndExpectText('default message.');
        }));
        it('should prioritize value matches over category matches', testing_1.async(function () {
            var template = '<ul [ngPlural]="switchValue">' +
                '<ng-template ngPluralCase="few"><li>you have a few messages.</li></ng-template>' +
                '<ng-template ngPluralCase="=2">you have two messages.</ng-template>' +
                '</ul>';
            fixture = createTestComponent(template);
            getComponent().switchValue = 2;
            detectChangesAndExpectText('you have two messages.');
            getComponent().switchValue = 3;
            detectChangesAndExpectText('you have a few messages.');
        }));
    });
}
var TestLocalization = /** @class */ (function (_super) {
    __extends(TestLocalization, _super);
    function TestLocalization() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TestLocalization.prototype.getPluralCategory = function (value) {
        if (value > 1 && value < 4) {
            return 'few';
        }
        if (value >= 4 && value < 10) {
            return 'many';
        }
        return 'other';
    };
    TestLocalization = __decorate([
        core_1.Injectable()
    ], TestLocalization);
    return TestLocalization;
}(common_1.NgLocalization));
var TestComponent = /** @class */ (function () {
    function TestComponent() {
        this.switchValue = null;
    }
    TestComponent = __decorate([
        core_1.Component({ selector: 'test-cmp', template: '' })
    ], TestComponent);
    return TestComponent;
}());
function createTestComponent(template) {
    return testing_1.TestBed.overrideComponent(TestComponent, { set: { template: template } })
        .createComponent(TestComponent);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfcGx1cmFsX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21tb24vdGVzdC9kaXJlY3RpdmVzL25nX3BsdXJhbF9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVILDBDQUE2RDtBQUM3RCxzQ0FBb0Q7QUFDcEQsaURBQXVFO0FBQ3ZFLDJFQUFzRTtBQUV0RTtJQUNFLFFBQVEsQ0FBQyxVQUFVLEVBQUU7UUFDbkIsSUFBSSxPQUE4QixDQUFDO1FBRW5DLDBCQUF5QyxPQUFPLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7UUFFNUUsb0NBQXVDLElBQVk7WUFDakQsT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ3hCLGlCQUFNLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqRCxDQUFDO1FBRUQsU0FBUyxDQUFDLGNBQVEsT0FBTyxHQUFHLElBQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXZDLFVBQVUsQ0FBQztZQUNULGlCQUFPLENBQUMsc0JBQXNCLENBQUM7Z0JBQzdCLFlBQVksRUFBRSxDQUFDLGFBQWEsQ0FBQztnQkFDN0IsU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsdUJBQWMsRUFBRSxRQUFRLEVBQUUsZ0JBQWdCLEVBQUMsQ0FBQztnQkFDbEUsT0FBTyxFQUFFLENBQUMscUJBQVksQ0FBQzthQUN4QixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywwREFBMEQsRUFBRSxlQUFLLENBQUM7WUFDaEUsSUFBTSxRQUFRLEdBQUcsK0JBQStCO2dCQUM1Qyw2RUFBNkU7Z0JBQzdFLDZFQUE2RTtnQkFDN0UsT0FBTyxDQUFDO1lBRVosT0FBTyxHQUFHLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRXhDLFlBQVksRUFBRSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUM7WUFDL0IsMEJBQTBCLENBQUMsdUJBQXVCLENBQUMsQ0FBQztZQUVwRCxZQUFZLEVBQUUsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDO1lBQy9CLDBCQUEwQixDQUFDLHVCQUF1QixDQUFDLENBQUM7UUFDdEQsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVQLEVBQUUsQ0FBQyxrRUFBa0UsRUFBRSxlQUFLLENBQUM7WUFDeEUsSUFBTSxRQUFRLEdBQUcsT0FBTztnQkFDcEIsK0JBQStCO2dCQUMvQiw0RUFBNEU7Z0JBQzVFLDRFQUE0RTtnQkFDNUUsYUFBYSxDQUFDO1lBRWxCLE9BQU8sR0FBRyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUV4QyxZQUFZLEVBQUUsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDO1lBQy9CLDBCQUEwQixDQUFDLHVCQUF1QixDQUFDLENBQUM7WUFFcEQsWUFBWSxFQUFFLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztZQUMvQiwwQkFBMEIsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1FBQ3RELENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFUCxpREFBaUQ7UUFDakQsaURBQWlEO1FBQ2pELEVBQUUsQ0FBQyx5REFBeUQsRUFBRSxlQUFLLENBQUM7WUFDL0QsSUFBTSxRQUFRLEdBQUcsK0JBQStCO2dCQUM1Qyx5RUFBeUU7Z0JBQ3pFLE9BQU8sQ0FBQztZQUVaLE9BQU8sR0FBRyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUV4QyxZQUFZLEVBQUUsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDO1lBQy9CLGlCQUFNLENBQUMsY0FBTSxPQUFBLE9BQU8sQ0FBQyxhQUFhLEVBQUUsRUFBdkIsQ0FBdUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUN0RCxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBR1AsRUFBRSxDQUFDLGlEQUFpRCxFQUFFLGVBQUssQ0FBQztZQUN2RCxJQUFNLFFBQVEsR0FBRyx5Q0FBeUM7Z0JBQ3RELG9FQUFvRTtnQkFDcEUsb0VBQW9FO2dCQUNwRSxpQkFBaUIsQ0FBQztZQUV0QixPQUFPLEdBQUcsbUJBQW1CLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFeEMsWUFBWSxFQUFFLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztZQUMvQiwwQkFBMEIsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1lBRXBELFlBQVksRUFBRSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUM7WUFDL0IsMEJBQTBCLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUN0RCxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRVAsRUFBRSxDQUFDLHVEQUF1RCxFQUFFLGVBQUssQ0FBQztZQUM3RCxJQUFNLFFBQVEsR0FBRywrQkFBK0I7Z0JBQzVDLGlGQUFpRjtnQkFDakYsaUZBQWlGO2dCQUNqRixPQUFPLENBQUM7WUFFWixPQUFPLEdBQUcsbUJBQW1CLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFeEMsWUFBWSxFQUFFLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztZQUMvQiwwQkFBMEIsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1lBRXZELFlBQVksRUFBRSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUM7WUFDL0IsMEJBQTBCLENBQUMseUJBQXlCLENBQUMsQ0FBQztRQUN4RCxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRVAsRUFBRSxDQUFDLG1EQUFtRCxFQUFFLGVBQUssQ0FBQztZQUN6RCxJQUFNLFFBQVEsR0FBRywrQkFBK0I7Z0JBQzVDLGlGQUFpRjtnQkFDakYsMkVBQTJFO2dCQUMzRSxPQUFPLENBQUM7WUFFWixPQUFPLEdBQUcsbUJBQW1CLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFeEMsWUFBWSxFQUFFLENBQUMsV0FBVyxHQUFHLEdBQUcsQ0FBQztZQUNqQywwQkFBMEIsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ2pELENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFUCxFQUFFLENBQUMsdURBQXVELEVBQUUsZUFBSyxDQUFDO1lBQzdELElBQU0sUUFBUSxHQUFHLCtCQUErQjtnQkFDNUMsaUZBQWlGO2dCQUNqRixxRUFBcUU7Z0JBQ3JFLE9BQU8sQ0FBQztZQUVaLE9BQU8sR0FBRyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUV4QyxZQUFZLEVBQUUsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDO1lBQy9CLDBCQUEwQixDQUFDLHdCQUF3QixDQUFDLENBQUM7WUFFckQsWUFBWSxFQUFFLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztZQUMvQiwwQkFBMEIsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1FBQ3pELENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDVCxDQUFDLENBQUMsQ0FBQztDQUNKO0FBR0Q7SUFBK0Isb0NBQWM7SUFBN0M7O0lBWUEsQ0FBQztJQVhDLDRDQUFpQixHQUFqQixVQUFrQixLQUFhO1FBQzdCLElBQUksS0FBSyxHQUFHLENBQUMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFO1lBQzFCLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFFRCxJQUFJLEtBQUssSUFBSSxDQUFDLElBQUksS0FBSyxHQUFHLEVBQUUsRUFBRTtZQUM1QixPQUFPLE1BQU0sQ0FBQztTQUNmO1FBRUQsT0FBTyxPQUFPLENBQUM7SUFDakIsQ0FBQztJQVhHLGdCQUFnQjtRQURyQixpQkFBVSxFQUFFO09BQ1AsZ0JBQWdCLENBWXJCO0lBQUQsdUJBQUM7Q0FBQSxBQVpELENBQStCLHVCQUFjLEdBWTVDO0FBR0Q7SUFEQTtRQUVFLGdCQUFXLEdBQWdCLElBQUksQ0FBQztJQUNsQyxDQUFDO0lBRkssYUFBYTtRQURsQixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFDLENBQUM7T0FDMUMsYUFBYSxDQUVsQjtJQUFELG9CQUFDO0NBQUEsQUFGRCxJQUVDO0FBRUQsNkJBQTZCLFFBQWdCO0lBQzNDLE9BQU8saUJBQU8sQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLEVBQUUsRUFBQyxHQUFHLEVBQUUsRUFBQyxRQUFRLEVBQUUsUUFBUSxFQUFDLEVBQUMsQ0FBQztTQUN2RSxlQUFlLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDdEMsQ0FBQyJ9