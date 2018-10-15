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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var di_1 = require("@angular/core/src/di");
var testability_1 = require("@angular/core/src/testability/testability");
var ng_zone_1 = require("@angular/core/src/zone/ng_zone");
var testing_1 = require("@angular/core/testing");
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var util_1 = require("../../src/util");
// Schedules a microtasks (using a resolved promise .then())
function microTask(fn) {
    util_1.scheduleMicroTask(function () {
        // We do double dispatch so that we  can wait for scheduleMicrotask in the Testability when
        // NgZone becomes stable.
        util_1.scheduleMicroTask(fn);
    });
}
var MockNgZone = /** @class */ (function (_super) {
    __extends(MockNgZone, _super);
    function MockNgZone() {
        var _this = _super.call(this, { enableLongStackTrace: false }) || this;
        _this.onUnstable = new core_1.EventEmitter(false);
        _this.onStable = new core_1.EventEmitter(false);
        return _this;
    }
    MockNgZone.prototype.unstable = function () { this.onUnstable.emit(null); };
    MockNgZone.prototype.stable = function () { this.onStable.emit(null); };
    MockNgZone = __decorate([
        di_1.Injectable(),
        __metadata("design:paramtypes", [])
    ], MockNgZone);
    return MockNgZone;
}(ng_zone_1.NgZone));
{
    testing_internal_1.describe('Testability', function () {
        var testability;
        var execute;
        var execute2;
        var updateCallback;
        var ngZone;
        testing_internal_1.beforeEach(testing_1.async(function () {
            ngZone = new MockNgZone();
            testability = new testability_1.Testability(ngZone);
            execute = new testing_internal_1.SpyObject().spy('execute');
            execute2 = new testing_internal_1.SpyObject().spy('execute');
            updateCallback = new testing_internal_1.SpyObject().spy('execute');
        }));
        testing_internal_1.describe('Pending count logic', function () {
            testing_internal_1.it('should start with a pending count of 0', function () { testing_internal_1.expect(testability.getPendingRequestCount()).toEqual(0); });
            testing_internal_1.it('should fire whenstable callbacks if pending count is 0', testing_1.async(function () {
                testability.whenStable(execute);
                microTask(function () { testing_internal_1.expect(execute).toHaveBeenCalled(); });
            }));
            testing_internal_1.it('should not fire whenstable callbacks synchronously if pending count is 0', function () {
                testability.whenStable(execute);
                testing_internal_1.expect(execute).not.toHaveBeenCalled();
            });
            testing_internal_1.it('should not call whenstable callbacks when there are pending counts', testing_1.async(function () {
                testability.increasePendingRequestCount();
                testability.increasePendingRequestCount();
                testability.whenStable(execute);
                microTask(function () {
                    testing_internal_1.expect(execute).not.toHaveBeenCalled();
                    testability.decreasePendingRequestCount();
                    microTask(function () { testing_internal_1.expect(execute).not.toHaveBeenCalled(); });
                });
            }));
            testing_internal_1.it('should fire whenstable callbacks when pending drops to 0', testing_1.async(function () {
                testability.increasePendingRequestCount();
                testability.whenStable(execute);
                microTask(function () {
                    testing_internal_1.expect(execute).not.toHaveBeenCalled();
                    testability.decreasePendingRequestCount();
                    microTask(function () { testing_internal_1.expect(execute).toHaveBeenCalled(); });
                });
            }));
            testing_internal_1.it('should not fire whenstable callbacks synchronously when pending drops to 0', testing_1.async(function () {
                testability.increasePendingRequestCount();
                testability.whenStable(execute);
                testability.decreasePendingRequestCount();
                testing_internal_1.expect(execute).not.toHaveBeenCalled();
            }));
            testing_internal_1.it('should fire whenstable callbacks with didWork if pending count is 0', testing_1.async(function () {
                microTask(function () {
                    testability.whenStable(execute);
                    microTask(function () { testing_internal_1.expect(execute).toHaveBeenCalledWith(false); });
                });
            }));
            testing_internal_1.it('should fire whenstable callbacks with didWork when pending drops to 0', testing_1.async(function () {
                testability.increasePendingRequestCount();
                testability.whenStable(execute);
                testability.decreasePendingRequestCount();
                microTask(function () {
                    testing_internal_1.expect(execute).toHaveBeenCalledWith(true);
                    testability.whenStable(execute2);
                    microTask(function () { testing_internal_1.expect(execute2).toHaveBeenCalledWith(false); });
                });
            }));
        });
        testing_internal_1.describe('NgZone callback logic', function () {
            testing_internal_1.describe('whenStable with timeout', function () {
                testing_internal_1.it('should list pending tasks when the timeout is hit', testing_1.fakeAsync(function () {
                    var id = ngZone.run(function () { return setTimeout(function () { }, 1000); });
                    testability.whenStable(execute, 200);
                    testing_internal_1.expect(execute).not.toHaveBeenCalled();
                    testing_1.tick(200);
                    testing_internal_1.expect(execute).toHaveBeenCalled();
                    var tasks = execute.calls.mostRecent().args[1];
                    testing_internal_1.expect(tasks.length).toEqual(1);
                    testing_internal_1.expect(tasks[0].delay).toEqual(1000);
                    testing_internal_1.expect(tasks[0].source).toEqual('setTimeout');
                    testing_internal_1.expect(tasks[0].isPeriodic).toEqual(false);
                    clearTimeout(id);
                }));
                testing_internal_1.it('should fire if Angular is already stable', testing_1.async(function () {
                    testability.whenStable(execute, 200);
                    microTask(function () { testing_internal_1.expect(execute).toHaveBeenCalled(); });
                }));
                testing_internal_1.it('should fire when macroTasks are cancelled', testing_1.fakeAsync(function () {
                    var id = ngZone.run(function () { return setTimeout(function () { }, 1000); });
                    testability.whenStable(execute, 500);
                    testing_1.tick(200);
                    ngZone.run(function () { return clearTimeout(id); });
                    // fakeAsync doesn't trigger NgZones whenStable
                    ngZone.stable();
                    testing_1.tick(1);
                    testing_internal_1.expect(execute).toHaveBeenCalled();
                }));
                testing_internal_1.it('calls the done callback when angular is stable', testing_1.fakeAsync(function () {
                    var timeout1Done = false;
                    ngZone.run(function () { return setTimeout(function () { return timeout1Done = true; }, 500); });
                    testability.whenStable(execute, 1000);
                    testing_1.tick(600);
                    ngZone.stable();
                    testing_1.tick();
                    testing_internal_1.expect(timeout1Done).toEqual(true);
                    testing_internal_1.expect(execute).toHaveBeenCalled();
                    // Should cancel the done timeout.
                    testing_1.tick(500);
                    ngZone.stable();
                    testing_1.tick();
                    testing_internal_1.expect(execute.calls.count()).toEqual(1);
                }));
                testing_internal_1.it('calls update when macro tasks change', testing_1.fakeAsync(function () {
                    var timeout1Done = false;
                    var timeout2Done = false;
                    ngZone.run(function () { return setTimeout(function () { return timeout1Done = true; }, 500); });
                    testing_1.tick();
                    testability.whenStable(execute, 1000, updateCallback);
                    testing_1.tick(100);
                    ngZone.run(function () { return setTimeout(function () { return timeout2Done = true; }, 300); });
                    testing_internal_1.expect(updateCallback.calls.count()).toEqual(1);
                    testing_1.tick(600);
                    testing_internal_1.expect(timeout1Done).toEqual(true);
                    testing_internal_1.expect(timeout2Done).toEqual(true);
                    testing_internal_1.expect(updateCallback.calls.count()).toEqual(3);
                    testing_internal_1.expect(execute).toHaveBeenCalled();
                    var update1 = updateCallback.calls.all()[0].args[0];
                    testing_internal_1.expect(update1[0].delay).toEqual(500);
                    var update2 = updateCallback.calls.all()[1].args[0];
                    testing_internal_1.expect(update2[0].delay).toEqual(500);
                    testing_internal_1.expect(update2[1].delay).toEqual(300);
                }));
                testing_internal_1.it('cancels the done callback if the update callback returns true', testing_1.fakeAsync(function () {
                    var timeoutDone = false;
                    ngZone.unstable();
                    execute2.and.returnValue(true);
                    testability.whenStable(execute, 1000, execute2);
                    testing_1.tick(100);
                    ngZone.run(function () { return setTimeout(function () { return timeoutDone = true; }, 500); });
                    ngZone.stable();
                    testing_internal_1.expect(execute2).toHaveBeenCalled();
                    testing_1.tick(500);
                    ngZone.stable();
                    testing_1.tick();
                    testing_internal_1.expect(execute).not.toHaveBeenCalled();
                }));
            });
            testing_internal_1.it('should fire whenstable callback if event is already finished', testing_1.fakeAsync(function () {
                ngZone.unstable();
                ngZone.stable();
                testability.whenStable(execute);
                testing_1.tick();
                testing_internal_1.expect(execute).toHaveBeenCalled();
            }));
            testing_internal_1.it('should not fire whenstable callbacks synchronously if event is already finished', function () {
                ngZone.unstable();
                ngZone.stable();
                testability.whenStable(execute);
                testing_internal_1.expect(execute).not.toHaveBeenCalled();
            });
            testing_internal_1.it('should fire whenstable callback when event finishes', testing_1.fakeAsync(function () {
                ngZone.unstable();
                testability.whenStable(execute);
                testing_1.tick();
                testing_internal_1.expect(execute).not.toHaveBeenCalled();
                ngZone.stable();
                testing_1.tick();
                testing_internal_1.expect(execute).toHaveBeenCalled();
            }));
            testing_internal_1.it('should not fire whenstable callbacks synchronously when event finishes', function () {
                ngZone.unstable();
                testability.whenStable(execute);
                ngZone.stable();
                testing_internal_1.expect(execute).not.toHaveBeenCalled();
            });
            testing_internal_1.it('should not fire whenstable callback when event did not finish', testing_1.fakeAsync(function () {
                ngZone.unstable();
                testability.increasePendingRequestCount();
                testability.whenStable(execute);
                testing_1.tick();
                testing_internal_1.expect(execute).not.toHaveBeenCalled();
                testability.decreasePendingRequestCount();
                testing_1.tick();
                testing_internal_1.expect(execute).not.toHaveBeenCalled();
                ngZone.stable();
                testing_1.tick();
                testing_internal_1.expect(execute).toHaveBeenCalled();
            }));
            testing_internal_1.it('should not fire whenstable callback when there are pending counts', testing_1.fakeAsync(function () {
                ngZone.unstable();
                testability.increasePendingRequestCount();
                testability.increasePendingRequestCount();
                testability.whenStable(execute);
                testing_1.tick();
                testing_internal_1.expect(execute).not.toHaveBeenCalled();
                ngZone.stable();
                testing_1.tick();
                testing_internal_1.expect(execute).not.toHaveBeenCalled();
                testability.decreasePendingRequestCount();
                testing_1.tick();
                testing_internal_1.expect(execute).not.toHaveBeenCalled();
                testability.decreasePendingRequestCount();
                testing_1.tick();
                testing_internal_1.expect(execute).toHaveBeenCalled();
            }));
            testing_internal_1.it('should fire whenstable callback with didWork if event is already finished', testing_1.fakeAsync(function () {
                ngZone.unstable();
                ngZone.stable();
                testability.whenStable(execute);
                testing_1.tick();
                testing_internal_1.expect(execute).toHaveBeenCalledWith(true);
                testability.whenStable(execute2);
                testing_1.tick();
                testing_internal_1.expect(execute2).toHaveBeenCalledWith(false);
            }));
            testing_internal_1.it('should fire whenstable callback with didwork when event finishes', testing_1.fakeAsync(function () {
                ngZone.unstable();
                testability.whenStable(execute);
                testing_1.tick();
                ngZone.stable();
                testing_1.tick();
                testing_internal_1.expect(execute).toHaveBeenCalledWith(true);
                testability.whenStable(execute2);
                testing_1.tick();
                testing_internal_1.expect(execute2).toHaveBeenCalledWith(false);
            }));
        });
    });
    testing_internal_1.describe('TestabilityRegistry', function () {
        var testability1;
        var testability2;
        var registry;
        var ngZone;
        testing_internal_1.beforeEach(testing_1.async(function () {
            ngZone = new MockNgZone();
            testability1 = new testability_1.Testability(ngZone);
            testability2 = new testability_1.Testability(ngZone);
            registry = new testability_1.TestabilityRegistry();
        }));
        testing_internal_1.describe('unregister testability', function () {
            testing_internal_1.it('should remove the testability when unregistering an existing testability', function () {
                registry.registerApplication('testability1', testability1);
                registry.registerApplication('testability2', testability2);
                registry.unregisterApplication('testability2');
                testing_internal_1.expect(registry.getAllTestabilities().length).toEqual(1);
                testing_internal_1.expect(registry.getTestability('testability1')).toEqual(testability1);
            });
            testing_internal_1.it('should remain the same when unregistering a non-existing testability', function () {
                testing_internal_1.expect(registry.getAllTestabilities().length).toEqual(0);
                registry.registerApplication('testability1', testability1);
                registry.registerApplication('testability2', testability2);
                registry.unregisterApplication('testability3');
                testing_internal_1.expect(registry.getAllTestabilities().length).toEqual(2);
                testing_internal_1.expect(registry.getTestability('testability1')).toEqual(testability1);
                testing_internal_1.expect(registry.getTestability('testability2')).toEqual(testability2);
            });
            testing_internal_1.it('should remove all the testability when unregistering all testabilities', function () {
                registry.registerApplication('testability1', testability1);
                registry.registerApplication('testability2', testability2);
                registry.unregisterAllApplications();
                testing_internal_1.expect(registry.getAllTestabilities().length).toEqual(0);
            });
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdGFiaWxpdHlfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdC90ZXN0YWJpbGl0eS90ZXN0YWJpbGl0eV9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVILHNDQUEyQztBQUMzQywyQ0FBZ0Q7QUFDaEQseUVBQTZHO0FBQzdHLDBEQUFzRDtBQUN0RCxpREFBb0U7QUFDcEUsK0VBQXVHO0FBRXZHLHVDQUFpRDtBQUVqRCw0REFBNEQ7QUFDNUQsbUJBQW1CLEVBQVk7SUFDN0Isd0JBQWlCLENBQUM7UUFDaEIsMkZBQTJGO1FBQzNGLHlCQUF5QjtRQUN6Qix3QkFBaUIsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN4QixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFHRDtJQUF5Qiw4QkFBTTtJQU83QjtRQUFBLFlBQ0Usa0JBQU0sRUFBQyxvQkFBb0IsRUFBRSxLQUFLLEVBQUMsQ0FBQyxTQUdyQztRQUZDLEtBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxtQkFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzFDLEtBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxtQkFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDOztJQUMxQyxDQUFDO0lBRUQsNkJBQVEsR0FBUixjQUFtQixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFaEQsMkJBQU0sR0FBTixjQUFpQixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFmeEMsVUFBVTtRQURmLGVBQVUsRUFBRTs7T0FDUCxVQUFVLENBZ0JmO0lBQUQsaUJBQUM7Q0FBQSxBQWhCRCxDQUF5QixnQkFBTSxHQWdCOUI7QUFFRDtJQUNFLDJCQUFRLENBQUMsYUFBYSxFQUFF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