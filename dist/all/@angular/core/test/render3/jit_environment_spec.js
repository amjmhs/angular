"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var r3_identifiers_1 = require("@angular/compiler/src/render3/r3_identifiers");
var environment_1 = require("../../src/render3/jit/environment");
var INTERFACE_EXCEPTIONS = new Set([
    'ɵComponentDef',
    'ɵDirectiveDef',
    'ɵInjectorDef',
    'ɵNgModuleDef',
    'ɵPipeDef',
]);
describe('r3 jit environment', function () {
    // This test keeps render3/jit/environment and r3_identifiers in the compiler in sync, ensuring
    // that if the compiler writes a reference to a render3 symbol, it will be resolvable at runtime
    // in JIT mode.
    it('should support all r3 symbols', function () {
        Object
            // Map over the static properties of Identifiers.
            .keys(r3_identifiers_1.Identifiers)
            .map(function (key) { return r3_identifiers_1.Identifiers[key]; })
            // A few such properties are string constants. Ignore them, and focus on ExternalReferences.
            .filter(isExternalReference)
            // Some references are to interface types. Only take properties which have runtime values.
            .filter(function (sym) { return !INTERFACE_EXCEPTIONS.has(sym.name); })
            .forEach(function (sym) {
            // Assert that angularCoreEnv has a reference to the runtime symbol.
            expect(environment_1.angularCoreEnv.hasOwnProperty(sym.name))
                .toBe(true, "Missing symbol " + sym.name + " in render3/jit/environment");
        });
    });
});
function isExternalReference(sym) {
    return typeof sym === 'object' && sym.name !== null && sym.moduleName !== null;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaml0X2Vudmlyb25tZW50X3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3Rlc3QvcmVuZGVyMy9qaXRfZW52aXJvbm1lbnRfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUdILCtFQUF5RTtBQUV6RSxpRUFBaUU7QUFFakUsSUFBTSxvQkFBb0IsR0FBRyxJQUFJLEdBQUcsQ0FBUztJQUMzQyxlQUFlO0lBQ2YsZUFBZTtJQUNmLGNBQWM7SUFDZCxjQUFjO0lBQ2QsVUFBVTtDQUNYLENBQUMsQ0FBQztBQUVILFFBQVEsQ0FBQyxvQkFBb0IsRUFBRTtJQUM3QiwrRkFBK0Y7SUFDL0YsZ0dBQWdHO0lBQ2hHLGVBQWU7SUFDZixFQUFFLENBQUMsK0JBQStCLEVBQUU7UUFDbEMsTUFBTTtZQUNGLGlEQUFpRDthQUNoRCxJQUFJLENBQUMsNEJBQVcsQ0FBQzthQUNqQixHQUFHLENBQUMsVUFBQSxHQUFHLElBQUksT0FBQyw0QkFBaUUsQ0FBQyxHQUFHLENBQUMsRUFBdkUsQ0FBdUUsQ0FBQztZQUNwRiw0RkFBNEY7YUFDM0YsTUFBTSxDQUFDLG1CQUFtQixDQUFDO1lBQzVCLDBGQUEwRjthQUN6RixNQUFNLENBQUMsVUFBQSxHQUFHLElBQUksT0FBQSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQW5DLENBQW1DLENBQUM7YUFDbEQsT0FBTyxDQUFDLFVBQUEsR0FBRztZQUNWLG9FQUFvRTtZQUNwRSxNQUFNLENBQUMsNEJBQWMsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUMxQyxJQUFJLENBQUMsSUFBSSxFQUFFLG9CQUFrQixHQUFHLENBQUMsSUFBSSxnQ0FBNkIsQ0FBQyxDQUFDO1FBQzNFLENBQUMsQ0FBQyxDQUFDO0lBQ1QsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVILDZCQUE2QixHQUErQjtJQUUxRCxPQUFPLE9BQU8sR0FBRyxLQUFLLFFBQVEsSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLElBQUksSUFBSSxHQUFHLENBQUMsVUFBVSxLQUFLLElBQUksQ0FBQztBQUNqRixDQUFDIn0=