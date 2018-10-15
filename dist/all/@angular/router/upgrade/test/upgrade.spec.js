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
var testing_1 = require("@angular/core/testing");
var router_1 = require("@angular/router");
var upgrade_1 = require("@angular/router/upgrade");
var static_1 = require("@angular/upgrade/static");
describe('setUpLocationSync', function () {
    var upgradeModule;
    var RouterMock;
    var LocationMock;
    beforeEach(function () {
        RouterMock = jasmine.createSpyObj('Router', ['navigateByUrl']);
        LocationMock = jasmine.createSpyObj('Location', ['normalize']);
        testing_1.TestBed.configureTestingModule({
            providers: [
                static_1.UpgradeModule, { provide: router_1.Router, useValue: RouterMock },
                { provide: common_1.Location, useValue: LocationMock }
            ],
        });
        upgradeModule = testing_1.TestBed.get(static_1.UpgradeModule);
        upgradeModule.$injector = {
            get: jasmine.createSpy('$injector.get').and.returnValue({ '$on': function () { return undefined; } })
        };
    });
    it('should throw an error if the UpgradeModule.bootstrap has not been called', function () {
        upgradeModule.$injector = null;
        expect(function () { return upgrade_1.setUpLocationSync(upgradeModule); }).toThrowError("\n        RouterUpgradeInitializer can be used only after UpgradeModule.bootstrap has been called.\n        Remove RouterUpgradeInitializer and call setUpLocationSync after UpgradeModule.bootstrap.\n      ");
    });
    it('should get the $rootScope from AngularJS and set an $on watch on $locationChangeStart', function () {
        var $rootScope = jasmine.createSpyObj('$rootScope', ['$on']);
        upgradeModule.$injector.get.and.callFake(function (name) { return (name === '$rootScope') && $rootScope; });
        upgrade_1.setUpLocationSync(upgradeModule);
        expect($rootScope.$on).toHaveBeenCalledTimes(1);
        expect($rootScope.$on).toHaveBeenCalledWith('$locationChangeStart', jasmine.any(Function));
    });
    it('should navigate by url every time $locationChangeStart is broadcasted', function () {
        var url = 'https://google.com';
        var pathname = '/custom/route';
        var normalizedPathname = 'foo';
        var query = '?query=1&query2=3';
        var hash = '#new/hash';
        var $rootScope = jasmine.createSpyObj('$rootScope', ['$on']);
        upgradeModule.$injector.get.and.returnValue($rootScope);
        LocationMock.normalize.and.returnValue(normalizedPathname);
        upgrade_1.setUpLocationSync(upgradeModule);
        var callback = $rootScope.$on.calls.argsFor(0)[1];
        callback({}, url + pathname + query + hash, '');
        expect(LocationMock.normalize).toHaveBeenCalledTimes(1);
        expect(LocationMock.normalize).toHaveBeenCalledWith(pathname);
        expect(RouterMock.navigateByUrl).toHaveBeenCalledTimes(1);
        expect(RouterMock.navigateByUrl).toHaveBeenCalledWith(normalizedPathname + query + hash);
    });
    it('should work correctly on browsers that do not start pathname with `/`', function () {
        var anchorProto = HTMLAnchorElement.prototype;
        var originalDescriptor = Object.getOwnPropertyDescriptor(anchorProto, 'pathname');
        Object.defineProperty(anchorProto, 'pathname', { get: function () { return 'foo/bar'; } });
        try {
            var $rootScope = jasmine.createSpyObj('$rootScope', ['$on']);
            upgradeModule.$injector.get.and.returnValue($rootScope);
            upgrade_1.setUpLocationSync(upgradeModule);
            var callback = $rootScope.$on.calls.argsFor(0)[1];
            callback({}, '', '');
            expect(LocationMock.normalize).toHaveBeenCalledWith('/foo/bar');
        }
        finally {
            Object.defineProperty(anchorProto, 'pathname', originalDescriptor);
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBncmFkZS5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcm91dGVyL3VwZ3JhZGUvdGVzdC91cGdyYWRlLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCwwQ0FBeUM7QUFDekMsaURBQThDO0FBQzlDLDBDQUF1QztBQUN2QyxtREFBMEQ7QUFDMUQsa0RBQXNEO0FBRXRELFFBQVEsQ0FBQyxtQkFBbUIsRUFBRTtJQUM1QixJQUFJLGFBQTRCLENBQUM7SUFDakMsSUFBSSxVQUFlLENBQUM7SUFDcEIsSUFBSSxZQUFpQixDQUFDO0lBRXRCLFVBQVUsQ0FBQztRQUNULFVBQVUsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7UUFDL0QsWUFBWSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztRQUUvRCxpQkFBTyxDQUFDLHNCQUFzQixDQUFDO1lBQzdCLFNBQVMsRUFBRTtnQkFDVCxzQkFBYSxFQUFFLEVBQUMsT0FBTyxFQUFFLGVBQU0sRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFDO2dCQUN0RCxFQUFDLE9BQU8sRUFBRSxpQkFBUSxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUM7YUFDNUM7U0FDRixDQUFDLENBQUM7UUFFSCxhQUFhLEdBQUcsaUJBQU8sQ0FBQyxHQUFHLENBQUMsc0JBQWEsQ0FBQyxDQUFDO1FBQzNDLGFBQWEsQ0FBQyxTQUFTLEdBQUc7WUFDeEIsR0FBRyxFQUFFLE9BQU8sQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxFQUFDLEtBQUssRUFBRSxjQUFNLE9BQUEsU0FBUyxFQUFULENBQVMsRUFBQyxDQUFDO1NBQ2xGLENBQUM7SUFDSixDQUFDLENBQUMsQ0FBQztJQUVI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