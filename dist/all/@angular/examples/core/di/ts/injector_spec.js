"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var MockRootScopeInjector = /** @class */ (function () {
    function MockRootScopeInjector(parent) {
        this.parent = parent;
    }
    MockRootScopeInjector.prototype.get = function (token, defaultValue, flags) {
        if (flags === void 0) { flags = 0 /* Default */; }
        if (token.ngInjectableDef && token.ngInjectableDef.providedIn === 'root') {
            var old = core_1.ɵsetCurrentInjector(this);
            try {
                return token.ngInjectableDef.factory();
            }
            finally {
                core_1.ɵsetCurrentInjector(old);
            }
        }
        return this.parent.get(token, defaultValue, flags);
    };
    return MockRootScopeInjector;
}());
{
    describe('injector metadata examples', function () {
        it('works', function () {
            // #docregion Injector
            var injector = core_1.Injector.create({ providers: [{ provide: 'validToken', useValue: 'Value' }] });
            expect(injector.get('validToken')).toEqual('Value');
            expect(function () { return injector.get('invalidToken'); }).toThrowError();
            expect(injector.get('invalidToken', 'notFound')).toEqual('notFound');
            // #enddocregion
        });
        it('injects injector', function () {
            // #docregion injectInjector
            var injector = core_1.Injector.create({ providers: [] });
            expect(injector.get(core_1.Injector)).toBe(injector);
            // #enddocregion
        });
        it('should infer type', function () {
            // #docregion InjectionToken
            var BASE_URL = new core_1.InjectionToken('BaseUrl');
            var injector = core_1.Injector.create({ providers: [{ provide: BASE_URL, useValue: 'http://localhost' }] });
            var url = injector.get(BASE_URL);
            // here `url` is inferred to be `string` because `BASE_URL` is `InjectionToken<string>`.
            expect(url).toBe('http://localhost');
            // #enddocregion
        });
        it('injects a tree-shakeable InjectionToken', function () {
            var MyDep = /** @class */ (function () {
                function MyDep() {
                }
                return MyDep;
            }());
            var injector = new MockRootScopeInjector(core_1.Injector.create({ providers: [{ provide: MyDep, deps: [] }] }));
            // #docregion ShakableInjectionToken
            var MyService = /** @class */ (function () {
                function MyService(myDep) {
                    this.myDep = myDep;
                }
                return MyService;
            }());
            var MY_SERVICE_TOKEN = new core_1.InjectionToken('Manually constructed MyService', {
                providedIn: 'root',
                factory: function () { return new MyService(core_1.inject(MyDep)); },
            });
            var instance = injector.get(MY_SERVICE_TOKEN);
            expect(instance instanceof MyService).toBeTruthy();
            expect(instance.myDep instanceof MyDep).toBeTruthy();
            // #enddocregion
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5qZWN0b3Jfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2V4YW1wbGVzL2NvcmUvZGkvdHMvaW5qZWN0b3Jfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHNDQUE2SDtBQUU3SDtJQUNFLCtCQUFxQixNQUFnQjtRQUFoQixXQUFNLEdBQU4sTUFBTSxDQUFVO0lBQUcsQ0FBQztJQUV6QyxtQ0FBRyxHQUFILFVBQ0ksS0FBZ0MsRUFBRSxZQUFrQixFQUNwRCxLQUF3QztRQUF4QyxzQkFBQSxFQUFBLHVCQUF3QztRQUMxQyxJQUFLLEtBQWEsQ0FBQyxlQUFlLElBQUssS0FBYSxDQUFDLGVBQWUsQ0FBQyxVQUFVLEtBQUssTUFBTSxFQUFFO1lBQzFGLElBQU0sR0FBRyxHQUFHLDBCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3JDLElBQUk7Z0JBQ0YsT0FBUSxLQUFhLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxDQUFDO2FBQ2pEO29CQUFTO2dCQUNSLDBCQUFrQixDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3pCO1NBQ0Y7UUFDRCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUNILDRCQUFDO0FBQUQsQ0FBQyxBQWhCRCxJQWdCQztBQUVEO0lBQ0UsUUFBUSxDQUFDLDRCQUE0QixFQUFFO1FBQ3JDLEVBQUUsQ0FBQyxPQUFPLEVBQUU7WUFDVixzQkFBc0I7WUFDdEIsSUFBTSxRQUFRLEdBQ1YsZUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7WUFDL0UsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDcEQsTUFBTSxDQUFDLGNBQU0sT0FBQSxRQUFRLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxFQUE1QixDQUE0QixDQUFDLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDMUQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3JFLGdCQUFnQjtRQUNsQixDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxrQkFBa0IsRUFBRTtZQUNyQiw0QkFBNEI7WUFDNUIsSUFBTSxRQUFRLEdBQUcsZUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFDLFNBQVMsRUFBRSxFQUFFLEVBQUMsQ0FBQyxDQUFDO1lBQ2xELE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGVBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzlDLGdCQUFnQjtRQUNsQixDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxtQkFBbUIsRUFBRTtZQUN0Qiw0QkFBNEI7WUFDNUIsSUFBTSxRQUFRLEdBQUcsSUFBSSxxQkFBYyxDQUFTLFNBQVMsQ0FBQyxDQUFDO1lBQ3ZELElBQU0sUUFBUSxHQUNWLGVBQVEsQ0FBQyxNQUFNLENBQUMsRUFBQyxTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLGtCQUFrQixFQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7WUFDdEYsSUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNuQyx3RkFBd0Y7WUFDeEYsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBQ3JDLGdCQUFnQjtRQUNsQixDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyx5Q0FBeUMsRUFBRTtZQUM1QztnQkFBQTtnQkFBYSxDQUFDO2dCQUFELFlBQUM7WUFBRCxDQUFDLEFBQWQsSUFBYztZQUNkLElBQU0sUUFBUSxHQUNWLElBQUkscUJBQXFCLENBQUMsZUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztZQUUxRixvQ0FBb0M7WUFDcEM7Z0JBQ0UsbUJBQXFCLEtBQVk7b0JBQVosVUFBSyxHQUFMLEtBQUssQ0FBTztnQkFBRyxDQUFDO2dCQUN2QyxnQkFBQztZQUFELENBQUMsQUFGRCxJQUVDO1lBRUQsSUFBTSxnQkFBZ0IsR0FBRyxJQUFJLHFCQUFjLENBQVksZ0NBQWdDLEVBQUU7Z0JBQ3ZGLFVBQVUsRUFBRSxNQUFNO2dCQUNsQixPQUFPLEVBQUUsY0FBTSxPQUFBLElBQUksU0FBUyxDQUFDLGFBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUE1QixDQUE0QjthQUM1QyxDQUFDLENBQUM7WUFFSCxJQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDaEQsTUFBTSxDQUFDLFFBQVEsWUFBWSxTQUFTLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUNuRCxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssWUFBWSxLQUFLLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUNyRCxnQkFBZ0I7UUFDbEIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztDQUNKIn0=