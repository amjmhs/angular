"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_1 = require("@angular/compiler");
var util_1 = require("../util");
var environment_1 = require("./environment");
var fields_1 = require("./fields");
var util_2 = require("./util");
function compilePipe(type, meta) {
    var def = null;
    Object.defineProperty(type, fields_1.NG_PIPE_DEF, {
        get: function () {
            if (def === null) {
                var sourceMapUrl = "ng://" + util_1.stringify(type) + "/ngPipeDef.js";
                var name_1 = type.name;
                var res = compiler_1.compilePipeFromMetadata({
                    name: name_1,
                    type: new compiler_1.WrappedNodeExpr(type),
                    deps: util_2.reflectDependencies(type),
                    pipeName: meta.name,
                    pure: meta.pure !== undefined ? meta.pure : true,
                });
                def = compiler_1.jitExpression(res.expression, environment_1.angularCoreEnv, sourceMapUrl);
            }
            return def;
        }
    });
}
exports.compilePipe = compilePipe;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL3JlbmRlcjMvaml0L3BpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCw4Q0FBc0c7QUFJdEcsZ0NBQWtDO0FBRWxDLDZDQUE2QztBQUM3QyxtQ0FBcUM7QUFDckMsK0JBQTJDO0FBRTNDLHFCQUE0QixJQUFlLEVBQUUsSUFBVTtJQUNyRCxJQUFJLEdBQUcsR0FBUSxJQUFJLENBQUM7SUFDcEIsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsb0JBQVcsRUFBRTtRQUN2QyxHQUFHLEVBQUU7WUFDSCxJQUFJLEdBQUcsS0FBSyxJQUFJLEVBQUU7Z0JBQ2hCLElBQU0sWUFBWSxHQUFHLFVBQVEsZ0JBQVMsQ0FBQyxJQUFJLENBQUMsa0JBQWUsQ0FBQztnQkFFNUQsSUFBTSxNQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztnQkFDdkIsSUFBTSxHQUFHLEdBQUcsa0NBQXVCLENBQUM7b0JBQ2xDLElBQUksUUFBQTtvQkFDSixJQUFJLEVBQUUsSUFBSSwwQkFBZSxDQUFDLElBQUksQ0FBQztvQkFDL0IsSUFBSSxFQUFFLDBCQUFtQixDQUFDLElBQUksQ0FBQztvQkFDL0IsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJO29CQUNuQixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUk7aUJBQ2pELENBQUMsQ0FBQztnQkFFSCxHQUFHLEdBQUcsd0JBQWEsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLDRCQUFjLEVBQUUsWUFBWSxDQUFDLENBQUM7YUFDbkU7WUFDRCxPQUFPLEdBQUcsQ0FBQztRQUNiLENBQUM7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDO0FBckJELGtDQXFCQyJ9