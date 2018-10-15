"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var serializer_1 = require("@angular/platform-webworker/src/web_workers/shared/serializer");
var platform_location_1 = require("@angular/platform-webworker/src/web_workers/worker/platform_location");
var web_worker_test_util_1 = require("../shared/web_worker_test_util");
var spies_1 = require("./spies");
{
    describe('WebWorkerPlatformLocation', function () {
        var uiBus = null;
        var workerBus = null;
        var broker = null;
        var TEST_LOCATION = new serializer_1.LocationType('http://www.example.com', 'http', 'example.com', 'example.com', '80', '/', '', '', 'http://www.example.com');
        function createWebWorkerPlatformLocation(loc) {
            broker.spy('runOnService')
                .and.callFake(function (args, returnType) {
                if (args.method === 'getLocation') {
                    return Promise.resolve(loc);
                }
            });
            var factory = new web_worker_test_util_1.MockMessageBrokerFactory(broker);
            return new platform_location_1.WebWorkerPlatformLocation(factory, workerBus, null);
        }
        function testPushOrReplaceState(pushState) {
            var platformLocation = createWebWorkerPlatformLocation(null);
            var TITLE = 'foo';
            var URL = 'http://www.example.com/foo';
            web_worker_test_util_1.expectBrokerCall(broker, pushState ? 'pushState' : 'replaceState', [null, TITLE, URL]);
            if (pushState) {
                platformLocation.pushState(null, TITLE, URL);
            }
            else {
                platformLocation.replaceState(null, TITLE, URL);
            }
        }
        beforeEach(function () {
            var buses = web_worker_test_util_1.createPairedMessageBuses();
            uiBus = buses.ui;
            workerBus = buses.worker;
            workerBus.initChannel('ng-Router');
            uiBus.initChannel('ng-Router');
            broker = new spies_1.SpyMessageBroker();
        });
        it('should throw if getBaseHrefFromDOM is called', function () {
            var platformLocation = createWebWorkerPlatformLocation(null);
            expect(function () { return platformLocation.getBaseHrefFromDOM(); }).toThrowError();
        });
        it('should get location on init', function () {
            var platformLocation = createWebWorkerPlatformLocation(null);
            web_worker_test_util_1.expectBrokerCall(broker, 'getLocation');
            platformLocation.init();
        });
        it('should throw if set pathname is called before init finishes', function () {
            var platformLocation = createWebWorkerPlatformLocation(null);
            platformLocation.init();
            expect(function () { return platformLocation.pathname = 'TEST'; }).toThrowError();
        });
        it('should send pathname to render thread', function (done) {
            var platformLocation = createWebWorkerPlatformLocation(TEST_LOCATION);
            platformLocation.init().then(function (_) {
                var PATHNAME = '/test';
                web_worker_test_util_1.expectBrokerCall(broker, 'setPathname', [PATHNAME]);
                platformLocation.pathname = PATHNAME;
                done();
            });
        });
        it('should send pushState to render thread', function () { testPushOrReplaceState(true); });
        it('should send replaceState to render thread', function () { testPushOrReplaceState(false); });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhdGZvcm1fbG9jYXRpb25fc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3BsYXRmb3JtLXdlYndvcmtlci90ZXN0L3dlYl93b3JrZXJzL3dvcmtlci9wbGF0Zm9ybV9sb2NhdGlvbl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBS0gsNEZBQTRHO0FBQzVHLDBHQUErRztBQUUvRyx1RUFBb0g7QUFFcEgsaUNBQXlDO0FBRXpDO0lBQ0UsUUFBUSxDQUFDLDJCQUEyQixFQUFFO1FBQ3BDLElBQUksS0FBSyxHQUFlLElBQU0sQ0FBQztRQUMvQixJQUFJLFNBQVMsR0FBZSxJQUFNLENBQUM7UUFDbkMsSUFBSSxNQUFNLEdBQVEsSUFBSSxDQUFDO1FBRXZCLElBQU0sYUFBYSxHQUFHLElBQUkseUJBQVksQ0FDbEMsd0JBQXdCLEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUNqRix3QkFBd0IsQ0FBQyxDQUFDO1FBRzlCLHlDQUF5QyxHQUFpQjtZQUN4RCxNQUFNLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQztpQkFDckIsR0FBRyxDQUFDLFFBQVEsQ0FBQyxVQUFDLElBQWlCLEVBQUUsVUFBc0M7Z0JBQ3RFLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxhQUFhLEVBQUU7b0JBQ2pDLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFDN0I7WUFDSCxDQUFDLENBQUMsQ0FBQztZQUNQLElBQU0sT0FBTyxHQUFHLElBQUksK0NBQXdCLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDckQsT0FBTyxJQUFJLDZDQUF5QixDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsSUFBTSxDQUFDLENBQUM7UUFDbkUsQ0FBQztRQUVELGdDQUFnQyxTQUFrQjtZQUNo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