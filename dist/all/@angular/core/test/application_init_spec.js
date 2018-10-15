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
var application_init_1 = require("../src/application_init");
var testing_1 = require("../testing");
{
    describe('ApplicationInitStatus', function () {
        describe('no initializers', function () {
            it('should return true for `done`', testing_1.async(testing_1.inject([application_init_1.ApplicationInitStatus], function (status) {
                status.runInitializers();
                expect(status.done).toBe(true);
            })));
            it('should return a promise that resolves immediately for `donePromise`', testing_1.async(testing_1.inject([application_init_1.ApplicationInitStatus], function (status) {
                status.runInitializers();
                status.donePromise.then(function () { expect(status.done).toBe(true); });
            })));
        });
        describe('with async initializers', function () {
            var resolve;
            var promise;
            var completerResolver = false;
            beforeEach(function () {
                var initializerFactory = function (injector) {
                    return function () {
                        var initStatus = injector.get(application_init_1.ApplicationInitStatus);
                        initStatus.donePromise.then(function () { expect(completerResolver).toBe(true); });
                    };
                };
                promise = new Promise(function (res) { resolve = res; });
                testing_1.TestBed.configureTestingModule({
                    providers: [
                        { provide: application_init_1.APP_INITIALIZER, multi: true, useValue: function () { return promise; } },
                        {
                            provide: application_init_1.APP_INITIALIZER,
                            multi: true,
                            useFactory: initializerFactory,
                            deps: [core_1.Injector]
                        },
                    ]
                });
            });
            it('should update the status once all async initializers are done', testing_1.async(testing_1.inject([application_init_1.ApplicationInitStatus], function (status) {
                status.runInitializers();
                setTimeout(function () {
                    completerResolver = true;
                    resolve(null);
                });
                expect(status.done).toBe(false);
                status.donePromise.then(function () {
                    expect(status.done).toBe(true);
                    expect(completerResolver).toBe(true);
                });
            })));
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbGljYXRpb25faW5pdF9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L2FwcGxpY2F0aW9uX2luaXRfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILHNDQUF1QztBQUN2Qyw0REFBK0U7QUFDL0Usc0NBQWtEO0FBRWxEO0lBQ0UsUUFBUSxDQUFDLHVCQUF1QixFQUFFO1FBQ2hDLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRTtZQUUxQixFQUFFLENBQUMsK0JBQStCLEVBQy9CLGVBQUssQ0FBQyxnQkFBTSxDQUFDLENBQUMsd0NBQXFCLENBQUMsRUFBRSxVQUFDLE1BQTZCO2dCQUNqRSxNQUFjLENBQUMsZUFBZSxFQUFFLENBQUM7Z0JBQ2xDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2pDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVSLEVBQUUsQ0FBQyxxRUFBcUUsRUFDckUsZUFBSyxDQUFDLGdCQUFNLENBQUMsQ0FBQyx3Q0FBcUIsQ0FBQyxFQUFFLFVBQUMsTUFBNkI7Z0JBQ2pFLE1BQWMsQ0FBQyxlQUFlLEVBQUUsQ0FBQztnQkFDbEMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsY0FBUSxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNWLENBQUMsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLHlCQUF5QixFQUFFO1lBQ2xDLElBQUksT0FBOEIsQ0FBQztZQUNuQyxJQUFJLE9BQXFCLENBQUM7WUFDMUIsSUFBSSxpQkFBaUIsR0FBRyxLQUFLLENBQUM7WUFDOUIsVUFBVSxDQUFDO2dCQUNULElBQUksa0JBQWtCLEdBQUcsVUFBQyxRQUFrQjtvQkFDMUMsT0FBTzt3QkFDTCxJQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLHdDQUFxQixDQUFDLENBQUM7d0JBQ3ZELFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGNBQVEsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQy9FLENBQUMsQ0FBQztnQkFDSixDQUFDLENBQUM7Z0JBQ0YsT0FBTyxHQUFHLElBQUksT0FBTyxDQUFDLFVBQUMsR0FBRyxJQUFPLE9BQU8sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbkQsaUJBQU8sQ0FBQyxzQkFBc0IsQ0FBQztvQkFDN0IsU0FBUyxFQUFFO3dCQUNULEVBQUMsT0FBTyxFQUFFLGtDQUFlLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsY0FBTSxPQUFBLE9BQU8sRUFBUCxDQUFPLEVBQUM7d0JBQ2hFOzRCQUNFLE9BQU8sRUFBRSxrQ0FBZTs0QkFDeEIsS0FBSyxFQUFFLElBQUk7NEJBQ1gsVUFBVSxFQUFFLGtCQUFrQjs0QkFDOUIsSUFBSSxFQUFFLENBQUMsZUFBUSxDQUFDO3lCQUNqQjtxQkFDRjtpQkFDRixDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQywrREFBK0QsRUFDL0QsZUFBSyxDQUFDLGdCQUFNLENBQUMsQ0FBQyx3Q0FBcUIsQ0FBQyxFQUFFLFVBQUMsTUFBNkI7Z0JBQ2pFLE1BQWMsQ0FBQyxlQUFlLEVBQUUsQ0FBQztnQkFFbEMsVUFBVSxDQUFDO29CQUNULGlCQUFpQixHQUFHLElBQUksQ0FBQztvQkFDekIsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNoQixDQUFDLENBQUMsQ0FBQztnQkFFSCxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDaEMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7b0JBQ3RCLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUMvQixNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3ZDLENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ1YsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztDQUNKIn0=