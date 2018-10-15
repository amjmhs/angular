"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var angular1_providers_1 = require("@angular/upgrade/static/src/static/angular1_providers");
{
    describe('upgrade angular1_providers', function () {
        describe('compileFactory', function () {
            it('should retrieve and return `$compile`', function () {
                var services = { $compile: 'foo' };
                var mockInjector = { get: function (name) { return services[name]; }, has: function () { return true; } };
                expect(angular1_providers_1.compileFactory(mockInjector)).toBe('foo');
            });
        });
        describe('injectorFactory', function () {
            it('should return the injector value that was previously set', function () {
                var mockInjector = { get: function () { }, has: function () { return false; } };
                angular1_providers_1.setTempInjectorRef(mockInjector);
                var injector = angular1_providers_1.injectorFactory();
                expect(injector).toBe(mockInjector);
            });
            it('should throw if the injector value has not been set yet', function () {
                var mockInjector = { get: function () { }, has: function () { return false; } };
                expect(angular1_providers_1.injectorFactory).toThrowError();
            });
            it('should unset the injector after the first call (to prevent memory leaks)', function () {
                var mockInjector = { get: function () { }, has: function () { return false; } };
                angular1_providers_1.setTempInjectorRef(mockInjector);
                angular1_providers_1.injectorFactory();
                expect(angular1_providers_1.injectorFactory).toThrowError(); // ...because it has been unset
            });
        });
        describe('parseFactory', function () {
            it('should retrieve and return `$parse`', function () {
                var services = { $parse: 'bar' };
                var mockInjector = { get: function (name) { return services[name]; }, has: function () { return true; } };
                expect(angular1_providers_1.parseFactory(mockInjector)).toBe('bar');
            });
        });
        describe('rootScopeFactory', function () {
            it('should retrieve and return `$rootScope`', function () {
                var services = { $rootScope: 'baz' };
                var mockInjector = { get: function (name) { return services[name]; }, has: function () { return true; } };
                expect(angular1_providers_1.rootScopeFactory(mockInjector)).toBe('baz');
            });
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhcjFfcHJvdmlkZXJzX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy91cGdyYWRlL3Rlc3Qvc3RhdGljL2FuZ3VsYXIxX3Byb3ZpZGVyc19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBR0gsNEZBQTBKO0FBRTFKO0lBQ0UsUUFBUSxDQUFDLDRCQUE0QixFQUFFO1FBQ3JDLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtZQUN6QixFQUFFLENBQUMsdUNBQXVDLEVBQUU7Z0JBQzFDLElBQU0sUUFBUSxHQUF5QixFQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUMsQ0FBQztnQkFDekQsSUFBTSxZQUFZLEdBQUcsRUFBQyxHQUFHLEVBQUUsVUFBQyxJQUFjLElBQVUsT0FBQSxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQWQsQ0FBYyxFQUFFLEdBQUcsRUFBRSxjQUFNLE9BQUEsSUFBSSxFQUFKLENBQUksRUFBQyxDQUFDO2dCQUVyRixNQUFNLENBQUMsbUNBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNuRCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLGlCQUFpQixFQUFFO1lBQzFCLEVBQUUsQ0FBQywwREFBMEQsRUFBRTtnQkFDN0QsSUFBTSxZQUFZLEdBQUcsRUFBQyxHQUFHLEVBQUUsY0FBTyxDQUFDLEVBQUUsR0FBRyxFQUFFLGNBQU0sT0FBQSxLQUFLLEVBQUwsQ0FBSyxFQUFDLENBQUM7Z0JBQ3ZELHVDQUFrQixDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUNqQyxJQUFNLFFBQVEsR0FBRyxvQ0FBZSxFQUFFLENBQUM7Z0JBQ25DLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDdEMsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMseURBQXlELEVBQUU7Z0JBQzVELElBQU0sWUFBWSxHQUFHLEVBQUMsR0FBRyxFQUFFLGNBQU8sQ0FBQyxFQUFFLEdBQUcsRUFBRSxjQUFNLE9BQUEsS0FBSyxFQUFMLENBQUssRUFBQyxDQUFDO2dCQUN2RCxNQUFNLENBQUMsb0NBQWUsQ0FBQyxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ3pDLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLDBFQUEwRSxFQUFFO2dCQUM3RSxJQUFNLFlBQVksR0FBRyxFQUFDLEdBQUcsRUFBRSxjQUFPLENBQUMsRUFBRSxHQUFHLEVBQUUsY0FBTSxPQUFBLEtBQUssRUFBTCxDQUFLLEVBQUMsQ0FBQztnQkFDdkQsdUNBQWtCLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQ2pDLG9DQUFlLEVBQUUsQ0FBQztnQkFDbEIsTUFBTSxDQUFDLG9DQUFlLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFFLCtCQUErQjtZQUMxRSxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLGNBQWMsRUFBRTtZQUN2QixFQUFFLENBQUMscUNBQXFDLEVBQUU7Z0JBQ3hDLElBQU0sUUFBUSxHQUF5QixFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUMsQ0FBQztnQkFDdkQsSUFBTSxZQUFZLEdBQUcsRUFBQyxHQUFHLEVBQUUsVUFBQyxJQUFjLElBQVUsT0FBQSxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQWQsQ0FBYyxFQUFFLEdBQUcsRUFBRSxjQUFNLE9BQUEsSUFBSSxFQUFKLENBQUksRUFBQyxDQUFDO2dCQUVyRixNQUFNLENBQUMsaUNBQVksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNqRCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLGtCQUFrQixFQUFFO1lBQzNCLEVBQUUsQ0FBQyx5Q0FBeUMsRUFBRTtnQkFDNUMsSUFBTSxRQUFRLEdBQXlCLEVBQUMsVUFBVSxFQUFFLEtBQUssRUFBQyxDQUFDO2dCQUMzRCxJQUFNLFlBQVksR0FBRyxFQUFDLEdBQUcsRUFBRSxVQUFDLElBQWMsSUFBVSxPQUFBLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBZCxDQUFjLEVBQUUsR0FBRyxFQUFFLGNBQU0sT0FBQSxJQUFJLEVBQUosQ0FBSSxFQUFDLENBQUM7Z0JBRXJGLE1BQU0sQ0FBQyxxQ0FBZ0IsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNyRCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7Q0FDSiJ9