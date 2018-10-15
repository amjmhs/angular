"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var hammer_gestures_1 = require("@angular/platform-browser/src/dom/events/hammer_gestures");
{
    testing_internal_1.describe('HammerGesturesPlugin', function () {
        var plugin;
        var fakeConsole;
        if (isNode)
            return;
        testing_internal_1.beforeEach(function () { fakeConsole = { warn: jasmine.createSpy('console.warn') }; });
        testing_internal_1.describe('with no custom loader', function () {
            testing_internal_1.beforeEach(function () {
                plugin = new hammer_gestures_1.HammerGesturesPlugin(document, new hammer_gestures_1.HammerGestureConfig(), fakeConsole);
            });
            testing_internal_1.it('should implement addGlobalEventListener', function () {
                spyOn(plugin, 'addEventListener').and.callFake(function () { });
                testing_internal_1.expect(function () {
                    plugin.addGlobalEventListener('document', 'swipe', function () { });
                }).not.toThrowError();
            });
            testing_internal_1.it('should warn user and do nothing when Hammer.js not loaded', function () {
                testing_internal_1.expect(plugin.supports('swipe')).toBe(false);
                testing_internal_1.expect(fakeConsole.warn)
                    .toHaveBeenCalledWith("The \"swipe\" event cannot be bound because Hammer.JS is not " +
                    "loaded and no custom loader has been specified.");
            });
        });
        testing_internal_1.describe('with a custom loader', function () {
            // Use a fake custom loader for tests, with helper functions to resolve or reject.
            var loader;
            var resolveLoader;
            var failLoader;
            // Arbitrary element and listener for testing.
            var someElement;
            var someListener;
            // Keep track of whatever value is in `window.Hammer` before the test so it can be
            // restored afterwards so that this test doesn't care whether Hammer is actually loaded.
            var originalHammerGlobal;
            // Fake Hammer instance ("mc") used to test the underlying event registration.
            var fakeHammerInstance;
            // Inject the NgZone so that we can make it available to the plugin through a fake
            // EventManager.
            var ngZone;
            testing_internal_1.beforeEach(testing_1.inject([core_1.NgZone], function (z) { ngZone = z; }));
            testing_internal_1.beforeEach(function () {
                originalHammerGlobal = window.Hammer;
                window.Hammer = undefined;
                fakeHammerInstance = {
                    on: jasmine.createSpy('mc.on'),
                    off: jasmine.createSpy('mc.off'),
                };
                loader = function () { return new Promise(function (resolve, reject) {
                    resolveLoader = resolve;
                    failLoader = reject;
                }); };
                // Make the hammer config return a fake hammer instance
                var hammerConfig = new hammer_gestures_1.HammerGestureConfig();
                spyOn(hammerConfig, 'buildHammer').and.returnValue(fakeHammerInstance);
                plugin = new hammer_gestures_1.HammerGesturesPlugin(document, hammerConfig, fakeConsole, loader);
                // Use a fake EventManager that has access to the NgZone.
                plugin.manager = { getZone: function () { return ngZone; } };
                someElement = document.createElement('div');
                someListener = function () { };
            });
            testing_internal_1.afterEach(function () { window.Hammer = originalHammerGlobal; });
            testing_internal_1.it('should not log a warning when HammerJS is not loaded', function () {
                plugin.addEventListener(someElement, 'swipe', function () { });
                testing_internal_1.expect(fakeConsole.warn).not.toHaveBeenCalled();
            });
            testing_internal_1.it('should defer registering an event until Hammer is loaded', testing_1.fakeAsync(function () {
                plugin.addEventListener(someElement, 'swipe', someListener);
                testing_internal_1.expect(fakeHammerInstance.on).not.toHaveBeenCalled();
                window.Hammer = {};
                resolveLoader();
                testing_1.tick();
                testing_internal_1.expect(fakeHammerInstance.on).toHaveBeenCalledWith('swipe', jasmine.any(Function));
            }));
            testing_internal_1.it('should cancel registration if an event is removed before being added', testing_1.fakeAsync(function () {
                var deregister = plugin.addEventListener(someElement, 'swipe', someListener);
                deregister();
                window.Hammer = {};
                resolveLoader();
                testing_1.tick();
                testing_internal_1.expect(fakeHammerInstance.on).not.toHaveBeenCalled();
            }));
            testing_internal_1.it('should remove a listener after Hammer is loaded', testing_1.fakeAsync(function () {
                var removeListener = plugin.addEventListener(someElement, 'swipe', someListener);
                window.Hammer = {};
                resolveLoader();
                testing_1.tick();
                removeListener();
                testing_internal_1.expect(fakeHammerInstance.off).toHaveBeenCalledWith('swipe', jasmine.any(Function));
            }));
            testing_internal_1.it('should log a warning when the loader fails', testing_1.fakeAsync(function () {
                plugin.addEventListener(someElement, 'swipe', function () { });
                failLoader();
                testing_1.tick();
                testing_internal_1.expect(fakeConsole.warn)
                    .toHaveBeenCalledWith("The \"swipe\" event cannot be bound because the custom Hammer.JS loader failed.");
            }));
            testing_internal_1.it('should load a warning if the loader resolves and Hammer is not present', testing_1.fakeAsync(function () {
                plugin.addEventListener(someElement, 'swipe', function () { });
                resolveLoader();
                testing_1.tick();
                testing_internal_1.expect(fakeConsole.warn)
                    .toHaveBeenCalledWith("The custom HAMMER_LOADER completed, but Hammer.JS is not present.");
            }));
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFtbWVyX2dlc3R1cmVzX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS1icm93c2VyL3Rlc3QvZG9tL2V2ZW50cy9oYW1tZXJfZ2VzdHVyZXNfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILHNDQUFxQztBQUNyQyxpREFBOEQ7QUFDOUQsK0VBQXdHO0FBRXhHLDRGQUFvSDtBQUVwSDtJQUNFLDJCQUFRLENBQUMsc0JBQXNCLEVBQUU7UUFDL0IsSUFBSSxNQUE0QixDQUFDO1FBQ2pDLElBQUksV0FBZ0IsQ0FBQztRQUNyQixJQUFJLE1BQU07WUFBRSxPQUFPO1FBRW5CLDZCQUFVLENBQUMsY0FBUSxXQUFXLEdBQUcsRUFBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFL0UsMkJBQVEsQ0FBQyx1QkFBdUIsRUFBRTtZQUNoQyw2QkFBVSxDQUFDO2dCQUNULE1BQU0sR0FBRyxJQUFJLHNDQUFvQixDQUFDLFFBQVEsRUFBRSxJQUFJLHFDQUFtQixFQUFFLEVBQUUsV0FBVyxDQUFDLENBQUM7WUFDdEYsQ0FBQyxDQUFDLENBQUM7WUFFSCxxQkFBRSxDQUFDLHlDQUF5QyxFQUFFO2dCQUM1QyxLQUFLLENBQUMsTUFBTSxFQUFFLGtCQUFrQixDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxjQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUV6RCx5QkFBTSxDQUFDO29CQUNMLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLGNBQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQy9ELENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUN4QixDQUFDLENBQUMsQ0FBQztZQUVILHFCQUFFLENBQUMsMkRBQTJE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