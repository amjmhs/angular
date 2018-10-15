"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("../src/config");
var shared_1 = require("../src/shared");
describe('config', function () {
    describe('validateConfig', function () {
        it('should not throw when no errors', function () {
            expect(function () { return config_1.validateConfig([{ path: 'a', redirectTo: 'b' }, { path: 'b', component: ComponentA }]); })
                .not.toThrow();
        });
        it('should not throw when a matcher is provided', function () {
            expect(function () { return config_1.validateConfig([{ matcher: 'someFunc', component: ComponentA }]); })
                .not.toThrow();
        });
        it('should throw for undefined route', function () {
            expect(function () {
                config_1.validateConfig([{ path: 'a', component: ComponentA }, , { path: 'b', component: ComponentB }]);
            }).toThrowError(/Invalid configuration of route ''/);
        });
        it('should throw for undefined route in children', function () {
            expect(function () {
                config_1.validateConfig([{
                        path: 'a',
                        children: [
                            { path: 'b', component: ComponentB },
                            ,
                        ]
                    }]);
            }).toThrowError(/Invalid configuration of route 'a'/);
        });
        it('should throw when Array is passed', function () {
            expect(function () {
                config_1.validateConfig([
                    { path: 'a', component: ComponentA },
                    [{ path: 'b', component: ComponentB }, { path: 'c', component: ComponentC }]
                ]);
            }).toThrowError("Invalid configuration of route '': Array cannot be specified");
        });
        it('should throw when redirectTo and children are used together', function () {
            expect(function () {
                config_1.validateConfig([{ path: 'a', redirectTo: 'b', children: [{ path: 'b', component: ComponentA }] }]);
            })
                .toThrowError("Invalid configuration of route 'a': redirectTo and children cannot be used together");
        });
        it('should validate children and report full path', function () {
            expect(function () { return config_1.validateConfig([{ path: 'a', children: [{ path: 'b' }] }]); })
                .toThrowError("Invalid configuration of route 'a/b'. One of the following must be provided: component, redirectTo, children or loadChildren");
        });
        it('should properly report deeply nested path', function () {
            expect(function () { return config_1.validateConfig([{
                    path: 'a',
                    children: [{ path: 'b', children: [{ path: 'c', children: [{ path: 'd' }] }] }]
                }]); })
                .toThrowError("Invalid configuration of route 'a/b/c/d'. One of the following must be provided: component, redirectTo, children or loadChildren");
        });
        it('should throw when redirectTo and loadChildren are used together', function () {
            expect(function () { config_1.validateConfig([{ path: 'a', redirectTo: 'b', loadChildren: 'value' }]); })
                .toThrowError("Invalid configuration of route 'a': redirectTo and loadChildren cannot be used together");
        });
        it('should throw when children and loadChildren are used together', function () {
            expect(function () { config_1.validateConfig([{ path: 'a', children: [], loadChildren: 'value' }]); })
                .toThrowError("Invalid configuration of route 'a': children and loadChildren cannot be used together");
        });
        it('should throw when component and redirectTo are used together', function () {
            expect(function () { config_1.validateConfig([{ path: 'a', component: ComponentA, redirectTo: 'b' }]); })
                .toThrowError("Invalid configuration of route 'a': redirectTo and component cannot be used together");
        });
        it('should throw when path and matcher are used together', function () {
            expect(function () { config_1.validateConfig([{ path: 'a', matcher: 'someFunc', children: [] }]); })
                .toThrowError("Invalid configuration of route 'a': path and matcher cannot be used together");
        });
        it('should throw when path and matcher are missing', function () {
            expect(function () { config_1.validateConfig([{ component: null, redirectTo: 'b' }]); })
                .toThrowError("Invalid configuration of route '': routes must have either a path or a matcher specified");
        });
        it('should throw when none of component and children or direct are missing', function () {
            expect(function () { config_1.validateConfig([{ path: 'a' }]); })
                .toThrowError("Invalid configuration of route 'a'. One of the following must be provided: component, redirectTo, children or loadChildren");
        });
        it('should throw when path starts with a slash', function () {
            expect(function () {
                config_1.validateConfig([{ path: '/a', redirectTo: 'b' }]);
            }).toThrowError("Invalid configuration of route '/a': path cannot start with a slash");
        });
        it('should throw when emptyPath is used with redirectTo without explicitly providing matching', function () {
            expect(function () {
                config_1.validateConfig([{ path: '', redirectTo: 'b' }]);
            }).toThrowError(/Invalid configuration of route '{path: "", redirectTo: "b"}'/);
        });
        it('should throw when pathMatch is invalid', function () {
            expect(function () { config_1.validateConfig([{ path: 'a', pathMatch: 'invalid', component: ComponentB }]); })
                .toThrowError(/Invalid configuration of route 'a': pathMatch can only be set to 'prefix' or 'full'/);
        });
        it('should throw when path/outlet combination is invalid', function () {
            expect(function () { config_1.validateConfig([{ path: 'a', outlet: 'aux' }]); })
                .toThrowError(/Invalid configuration of route 'a': a componentless route without children or loadChildren cannot have a named outlet set/);
            expect(function () { return config_1.validateConfig([{ path: 'a', outlet: '', children: [] }]); }).not.toThrow();
            expect(function () { return config_1.validateConfig([{ path: 'a', outlet: shared_1.PRIMARY_OUTLET, children: [] }]); })
                .not.toThrow();
        });
        it('should not throw when path/outlet combination is valid', function () {
            expect(function () { config_1.validateConfig([{ path: 'a', outlet: 'aux', children: [] }]); }).not.toThrow();
            expect(function () {
                config_1.validateConfig([{ path: 'a', outlet: 'aux', loadChildren: 'child' }]);
            }).not.toThrow();
        });
    });
});
var ComponentA = /** @class */ (function () {
    function ComponentA() {
    }
    return ComponentA;
}());
var ComponentB = /** @class */ (function () {
    function ComponentB() {
    }
    return ComponentB;
}());
var ComponentC = /** @class */ (function () {
    function ComponentC() {
    }
    return ComponentC;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9yb3V0ZXIvdGVzdC9jb25maWcuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHdDQUE2QztBQUM3Qyx3Q0FBNkM7QUFFN0MsUUFBUSxDQUFDLFFBQVEsRUFBRTtJQUNqQixRQUFRLENBQUMsZ0JBQWdCLEVBQUU7UUFDekIsRUFBRSxDQUFDLGlDQUFpQyxFQUFFO1lBQ3BDLE1BQU0sQ0FDRixjQUFNLE9BQUEsdUJBQWMsQ0FBQyxDQUFDLEVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFDLEVBQUUsRUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUMsQ0FBQyxDQUFDLEVBQWxGLENBQWtGLENBQUM7aUJBQ3hGLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNyQixDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyw2Q0FBNkMsRUFBRTtZQUNoRCxNQUFNLENBQUMsY0FBTSxPQUFBLHVCQUFjLENBQUMsQ0FBQyxFQUFDLE9BQU8sRUFBTyxVQUFVLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBQyxDQUFDLENBQUMsRUFBbkUsQ0FBbUUsQ0FBQztpQkFDNUUsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3JCLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLGtDQUFrQyxFQUFFO1lBQ3JDLE1BQU0sQ0FBQztnQkFDTCx1QkFBYyxDQUNWLENBQUMsRUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUMsRUFBRSxBQUFELEVBQUcsRUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUMsQ0FBUSxDQUFDLENBQUM7WUFDekYsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLG1DQUFtQyxDQUFDLENBQUM7UUFDdkQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsOENBQThDLEVBQUU7WUFDakQsTUFBTSxDQUFDO2dCQUNMLHVCQUFjLENBQUMsQ0FBQzt3QkFDZCxJQUFJLEVBQUUsR0FBRzt3QkFDVCxRQUFRLEVBQUU7NEJBQ1IsRUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUM7NEJBQ2xDLEFBRG1DO3lCQUVwQztxQkFDRixDQUFRLENBQUMsQ0FBQztZQUNiLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO1FBQ3hELENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLG1DQUFtQyxFQUFFO1lBQ3RDLE1BQU0sQ0FBQztnQkFDTCx1QkFBYyxDQUFDO29CQUNiLEVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFDO29CQUNsQyxDQUFDLEVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFDLEVBQUUsRUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUMsQ0FBUTtpQkFDaEYsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLDhEQUE4RCxDQUFDLENBQUM7UUFDbEYsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsNkRBQTZELEVBQUU7WUFDaEUsTUFBTSxDQUFDO2dCQUNMLHVCQUFjLENBQ1YsQ0FBQyxFQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsVUFBVSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdEYsQ0FBQyxDQUFDO2lCQUNHLFlBQVksQ0FDVCxxRkFBcUYsQ0FBQyxDQUFDO1FBQ2pHLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLCtDQUErQyxFQUFFO1lBQ2xELE1BQU0sQ0FBQyxjQUFNLE9BQUEsdUJBQWMsQ0FBQyxDQUFDLEVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFDLElBQUksRUFBRSxHQUFHLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUF0RCxDQUFzRCxDQUFDO2lCQUMvRCxZQUFZLENBQ1QsOEhBQThILENBQUMsQ0FBQztRQUMxSSxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywyQ0FBMkMsRUFBRTtZQUM5QyxNQUFNLENBQUMsY0FBTSxPQUFBLHVCQUFjLENBQUMsQ0FBQztvQkFDcEIsSUFBSSxFQUFFLEdBQUc7b0JBQ1QsUUFBUSxFQUFFLENBQUMsRUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFDLElBQUksRUFBRSxHQUFHLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDO2lCQUMxRSxDQUFDLENBQUMsRUFIRyxDQUdILENBQUM7aUJBQ04sWUFBWSxDQUNULGtJQUFrSSxDQUFDLENBQUM7UUFDOUksQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsaUVBQWlFLEVBQUU7WUFDcEUsTUFBTSxDQUFDLGNBQVEsdUJBQWMsQ0FBQyxDQUFDLEVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ25GLFlBQVksQ0FDVCx5RkFBeUYsQ0FBQyxDQUFDO1FBQ3JHLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLCtEQUErRCxFQUFFO1lBQ2xFLE1BQU0sQ0FBQyxjQUFRLHVCQUFjLENBQUMsQ0FBQyxFQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxZQUFZLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNoRixZQUFZLENBQ1QsdUZBQXVGLENBQUMsQ0FBQztRQUNuRyxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyw4REFBOEQsRUFBRTtZQUNqRSxNQUFNLENBQUMsY0FBUSx1QkFBYyxDQUFDLENBQUMsRUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLEdBQUcsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDbkYsWUFBWSxDQUNULHNGQUFzRixDQUFDLENBQUM7UUFDbEcsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsc0RBQXNELEVBQUU7WUFDekQsTUFBTSxDQUFDLGNBQVEsdUJBQWMsQ0FBQyxDQUFDLEVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQU8sVUFBVSxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ25GLFlBQVksQ0FDVCw4RUFBOEUsQ0FBQyxDQUFDO1FBQzFGLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLGdEQUFnRCxFQUFFO1lBQ25ELE1BQU0sQ0FBQyxjQUFRLHVCQUFjLENBQUMsQ0FBQyxFQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLEdBQUcsRUFBQyxDQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDekUsWUFBWSxDQUNULDBGQUEwRixDQUFDLENBQUM7UUFDdEcsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsd0VBQXdFLEVBQUU7WUFDM0UsTUFBTSxDQUFDLGNBQVEsdUJBQWMsQ0FBQyxDQUFDLEVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDM0MsWUFBWSxDQUNULDRIQUE0SCxDQUFDLENBQUM7UUFDeEksQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsNENBQTRDLEVBQUU7WUFDL0MsTUFBTSxDQUFDO2dCQUNMLHVCQUFjLENBQUMsQ0FBTSxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLEdBQUcsRUFBQyxDQUFDLENBQUMsQ0FBQztZQUN2RCxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMscUVBQXFFLENBQUMsQ0FBQztRQUN6RixDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywyRkFBMkYsRUFDM0Y7WUFDRSxNQUFNLENBQUM7Z0JBQ0wsdUJBQWMsQ0FBQyxDQUFNLEVBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JELENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyw4REFBOEQsQ0FBQyxDQUFDO1FBQ2xGLENBQUMsQ0FBQyxDQUFDO1FBRU4sRUFBRSxDQUFDLHdDQUF3QyxFQUFFO1lBQzNDLE1BQU0sQ0FBQyxjQUFRLHVCQUFjLENBQUMsQ0FBQyxFQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUN4RixZQUFZLENBQ1QscUZBQXFGLENBQUMsQ0FBQztRQUNqRyxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxzREFBc0QsRUFBRTtZQUN6RCxNQUFNLENBQUMsY0FBUSx1QkFBYyxDQUFDLENBQUMsRUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQzFELFlBQVksQ0FDVCwySEFBMkgsQ0FBQyxDQUFDO1lBQ3JJLE1BQU0sQ0FBQyxjQUFNLE9BQUEsdUJBQWMsQ0FBQyxDQUFDLEVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUMsQ0FBQyxDQUFDLEVBQXZELENBQXVELENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDcEYsTUFBTSxDQUFDLGNBQU0sT0FBQSx1QkFBYyxDQUFDLENBQUMsRUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSx1QkFBYyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUMsQ0FBQyxDQUFDLEVBQW5FLENBQW1FLENBQUM7aUJBQzVFLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNyQixDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyx3REFBd0QsRUFBRTtZQUMzRCxNQUFNLENBQUMsY0FBUSx1QkFBYyxDQUFDLENBQUMsRUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUM1RixNQUFNLENBQUM7Z0JBQ0wsdUJBQWMsQ0FBQyxDQUFDLEVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdEUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ25CLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVIO0lBQUE7SUFBa0IsQ0FBQztJQUFELGlCQUFDO0FBQUQsQ0FBQyxBQUFuQixJQUFtQjtBQUNuQjtJQUFBO0lBQWtCLENBQUM7SUFBRCxpQkFBQztBQUFELENBQUMsQUFBbkIsSUFBbUI7QUFDbkI7SUFBQTtJQUFrQixDQUFDO0lBQUQsaUJBQUM7QUFBRCxDQUFDLEFBQW5CLElBQW1CIn0=