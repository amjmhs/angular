"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var node_emitter_1 = require("./node_emitter");
/**
 * Returns a transformer that adds the requested static methods specified by modules.
 */
function getAngularClassTransformerFactory(modules) {
    if (modules.length === 0) {
        // If no modules are specified, just return an identity transform.
        return function () { return function (sf) { return sf; }; };
    }
    var moduleMap = new Map(modules.map(function (m) { return [m.fileName, m]; }));
    return function (context) {
        return function (sourceFile) {
            var module = moduleMap.get(sourceFile.fileName);
            if (module && module.statements.length > 0) {
                var newSourceFile = node_emitter_1.updateSourceFile(sourceFile, module, context)[0];
                return newSourceFile;
            }
            return sourceFile;
        };
    };
}
exports.getAngularClassTransformerFactory = getAngularClassTransformerFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicjNfdHJhbnNmb3JtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3NyYy90cmFuc2Zvcm1lcnMvcjNfdHJhbnNmb3JtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBS0gsK0NBQWdEO0FBS2hEOztHQUVHO0FBQ0gsMkNBQWtELE9BQXdCO0lBQ3hFLElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDeEIsa0VBQWtFO1FBQ2xFLE9BQU8sY0FBTSxPQUFBLFVBQUEsRUFBRSxJQUFJLE9BQUEsRUFBRSxFQUFGLENBQUUsRUFBUixDQUFRLENBQUM7S0FDdkI7SUFDRCxJQUFNLFNBQVMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUEwQixVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsRUFBZixDQUFlLENBQUMsQ0FBQyxDQUFDO0lBQ3RGLE9BQU8sVUFBUyxPQUFpQztRQUMvQyxPQUFPLFVBQVMsVUFBeUI7WUFDdkMsSUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDbEQsSUFBSSxNQUFNLElBQUksTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUNuQyxJQUFBLCtFQUFhLENBQWtEO2dCQUN0RSxPQUFPLGFBQWEsQ0FBQzthQUN0QjtZQUNELE9BQU8sVUFBVSxDQUFDO1FBQ3BCLENBQUMsQ0FBQztJQUNKLENBQUMsQ0FBQztBQUNKLENBQUM7QUFoQkQsOEVBZ0JDIn0=