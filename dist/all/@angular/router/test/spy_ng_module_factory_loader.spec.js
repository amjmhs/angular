"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var router_testing_module_1 = require("../testing/src/router_testing_module");
describe('SpyNgModuleFactoryLoader', function () {
    it('should invoke the compiler when the setter is called', function () {
        var expected = Promise.resolve('returned');
        var compiler = { compileModuleAsync: function () { } };
        spyOn(compiler, 'compileModuleAsync').and.returnValue(expected);
        var r = new router_testing_module_1.SpyNgModuleFactoryLoader(compiler);
        r.stubbedModules = { 'one': 'someModule' };
        expect(compiler.compileModuleAsync).toHaveBeenCalledWith('someModule');
        expect(r.stubbedModules['one']).toBe(expected);
    });
    it('should return the created promise', function () {
        var expected = Promise.resolve('returned');
        var compiler = { compileModuleAsync: function () { return expected; } };
        var r = new router_testing_module_1.SpyNgModuleFactoryLoader(compiler);
        r.stubbedModules = { 'one': 'someModule' };
        expect(r.load('one')).toBe(expected);
    });
    it('should return a rejected promise when given an invalid path', testing_1.fakeAsync(function () {
        var r = new router_testing_module_1.SpyNgModuleFactoryLoader(null);
        var error = null;
        r.load('two').catch(function (e) { return error = e; });
        testing_1.tick();
        expect(error).toEqual(new Error('Cannot find module two'));
    }));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3B5X25nX21vZHVsZV9mYWN0b3J5X2xvYWRlci5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcm91dGVyL3Rlc3Qvc3B5X25nX21vZHVsZV9mYWN0b3J5X2xvYWRlci5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsaURBQXNEO0FBQ3RELDhFQUE4RTtBQUU5RSxRQUFRLENBQUMsMEJBQTBCLEVBQUU7SUFDbkMsRUFBRSxDQUFDLHNEQUFzRCxFQUFFO1FBQ3pELElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDN0MsSUFBTSxRQUFRLEdBQVEsRUFBQyxrQkFBa0IsRUFBRSxjQUFPLENBQUMsRUFBQyxDQUFDO1FBQ3JELEtBQUssQ0FBQyxRQUFRLEVBQUUsb0JBQW9CLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRWhFLElBQU0sQ0FBQyxHQUFHLElBQUksZ0RBQXdCLENBQU0sUUFBUSxDQUFDLENBQUM7UUFDdEQsQ0FBQyxDQUFDLGNBQWMsR0FBRyxFQUFDLEtBQUssRUFBRSxZQUFZLEVBQUMsQ0FBQztRQUV6QyxNQUFNLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLENBQUMsb0JBQW9CLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDdkUsTUFBTSxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDakQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsbUNBQW1DLEVBQUU7UUFDdEMsSUFBTSxRQUFRLEdBQVEsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNsRCxJQUFNLFFBQVEsR0FBUSxFQUFDLGtCQUFrQixFQUFFLGNBQU0sT0FBQSxRQUFRLEVBQVIsQ0FBUSxFQUFDLENBQUM7UUFFM0QsSUFBTSxDQUFDLEdBQUcsSUFBSSxnREFBd0IsQ0FBTSxRQUFRLENBQUMsQ0FBQztRQUN0RCxDQUFDLENBQUMsY0FBYyxHQUFHLEVBQUMsS0FBSyxFQUFFLFlBQVksRUFBQyxDQUFDO1FBRXpDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3ZDLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDZEQUE2RCxFQUFFLG1CQUFTLENBQUM7UUFDdkUsSUFBTSxDQUFDLEdBQUcsSUFBSSxnREFBd0IsQ0FBTSxJQUFJLENBQUMsQ0FBQztRQUVsRCxJQUFJLEtBQUssR0FBUSxJQUFJLENBQUM7UUFDdEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBQyxDQUFNLElBQUssT0FBQSxLQUFLLEdBQUcsQ0FBQyxFQUFULENBQVMsQ0FBQyxDQUFDO1FBRTNDLGNBQUksRUFBRSxDQUFDO1FBRVAsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUM7SUFDN0QsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNULENBQUMsQ0FBQyxDQUFDIn0=