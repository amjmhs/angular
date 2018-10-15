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
var util_1 = require("@angular/core/src/util");
var testing_1 = require("@angular/core/testing");
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
function mockSystem(modules) {
    return {
        'import': function (target) {
            testing_internal_1.expect(modules[target]).not.toBe(undefined);
            return Promise.resolve(modules[target]);
        }
    };
}
{
    testing_internal_1.describe('SystemJsNgModuleLoader', function () {
        var oldSystem = null;
        testing_internal_1.beforeEach(function () {
            oldSystem = util_1.global['System'];
            util_1.global['System'] = mockSystem({
                'test.ngfactory': { 'default': 'test module factory', 'NamedNgFactory': 'test NamedNgFactory' },
                'prefixed/test/suffixed': { 'NamedNgFactory': 'test module factory' }
            });
        });
        testing_internal_1.afterEach(function () { util_1.global['System'] = oldSystem; });
        testing_internal_1.it('loads a default factory by appending the factory suffix', testing_1.async(function () {
            var loader = new core_1.SystemJsNgModuleLoader(new core_1.Compiler());
            loader.load('test').then(function (contents) { testing_internal_1.expect(contents).toBe('test module factory'); });
        }));
        testing_internal_1.it('loads a named factory by appending the factory suffix', testing_1.async(function () {
            var loader = new core_1.SystemJsNgModuleLoader(new core_1.Compiler());
            loader.load('test#Named').then(function (contents) {
                testing_internal_1.expect(contents).toBe('test NamedNgFactory');
            });
        }));
        testing_internal_1.it('loads a named factory with a configured prefix and suffix', testing_1.async(function () {
            var loader = new core_1.SystemJsNgModuleLoader(new core_1.Compiler(), {
                factoryPathPrefix: 'prefixed/',
                factoryPathSuffix: '/suffixed',
            });
            loader.load('test#Named').then(function (contents) {
                testing_internal_1.expect(contents).toBe('test module factory');
            });
        }));
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzdGVtX25nX21vZHVsZV9mYWN0b3J5X2xvYWRlcl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L2xpbmtlci9zeXN0ZW1fbmdfbW9kdWxlX2ZhY3RvcnlfbG9hZGVyX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxzQ0FBK0Q7QUFDL0QsK0NBQThDO0FBQzlDLGlEQUE0QztBQUM1QywrRUFBdUc7QUFFdkcsb0JBQW9CLE9BQWdDO0lBQ2xELE9BQU87UUFDTCxRQUFRLEVBQUUsVUFBQyxNQUFjO1lBQ3ZCLHlCQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUM1QyxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDMUMsQ0FBQztLQUNGLENBQUM7QUFDSixDQUFDO0FBRUQ7SUFDRSwyQkFBUSxDQUFDLHdCQUF3QixFQUFFO1FBQ2pDLElBQUksU0FBUyxHQUFRLElBQUksQ0FBQztRQUMxQiw2QkFBVSxDQUFDO1lBQ1QsU0FBUyxHQUFHLGFBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUM3QixhQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsVUFBVSxDQUFDO2dCQUM1QixnQkFBZ0IsRUFDWixFQUFDLFNBQVMsRUFBRSxxQkFBcUIsRUFBRSxnQkFBZ0IsRUFBRSxxQkFBcUIsRUFBQztnQkFDL0Usd0JBQXdCLEVBQUUsRUFBQyxnQkFBZ0IsRUFBRSxxQkFBcUIsRUFBQzthQUNwRSxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUNILDRCQUFTLENBQUMsY0FBUSxhQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFbkQscUJBQUUsQ0FBQyx5REFBeUQsRUFBRSxlQUFLLENBQUM7WUFDL0QsSUFBTSxNQUFNLEdBQUcsSUFBSSw2QkFBc0IsQ0FBQyxJQUFJLGVBQVEsRUFBRSxDQUFDLENBQUM7WUFDMUQsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQ3BCLFVBQUEsUUFBUSxJQUFNLHlCQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLHFCQUE0QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1RSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ1AscUJBQUUsQ0FBQyx1REFBdUQsRUFBRSxlQUFLLENBQUM7WUFDN0QsSUFBTSxNQUFNLEdBQUcsSUFBSSw2QkFBc0IsQ0FBQyxJQUFJLGVBQVEsRUFBRSxDQUFDLENBQUM7WUFDMUQsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxRQUFRO2dCQUNyQyx5QkFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxxQkFBNEIsQ0FBQyxDQUFDO1lBQ3RELENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNQLHFCQUFFLENBQUMsMkRBQTJELEVBQUUsZUFBSyxDQUFDO1lBQ2pFLElBQU0sTUFBTSxHQUFHLElBQUksNkJBQXNCLENBQUMsSUFBSSxlQUFRLEVBQUUsRUFBRTtnQkFDeEQsaUJBQWlCLEVBQUUsV0FBVztnQkFDOUIsaUJBQWlCLEVBQUUsV0FBVzthQUMvQixDQUFDLENBQUM7WUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLFFBQVE7Z0JBQ3JDLHlCQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLHFCQUE0QixDQUFDLENBQUM7WUFDdEQsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ1QsQ0FBQyxDQUFDLENBQUM7Q0FDSiJ9