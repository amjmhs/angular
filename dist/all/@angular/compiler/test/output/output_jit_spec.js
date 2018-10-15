"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var abstract_emitter_1 = require("@angular/compiler/src/output/abstract_emitter");
var o = require("@angular/compiler/src/output/output_ast");
var output_jit_1 = require("@angular/compiler/src/output/output_jit");
var compiler_reflector_1 = require("@angular/platform-browser-dynamic/src/compiler_reflector");
var anotherModuleUrl = 'somePackage/someOtherPath';
{
    describe('Output JIT', function () {
        describe('regression', function () {
            it('should generate unique argument names', function () {
                var externalIds = new Array(10).fill(1).map(function (_, index) {
                    return new o.ExternalReference(anotherModuleUrl, "id_" + index + "_", { name: "id_" + index + "_" });
                });
                var externalIds1 = new Array(10).fill(1).map(function (_, index) { return new o.ExternalReference(anotherModuleUrl, "id_" + index + "_1", { name: "id_" + index + "_1" }); });
                var ctx = abstract_emitter_1.EmitterVisitorContext.createRoot();
                var converter = new output_jit_1.JitEmitterVisitor(new compiler_reflector_1.JitReflector());
                converter.visitAllStatements([o.literalArr(externalIds1.concat(externalIds).map(function (id) { return o.importExpr(id); })).toStmt()], ctx);
                var args = converter.getArgs();
                expect(Object.keys(args).length).toBe(20);
            });
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3V0cHV0X2ppdF9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvdGVzdC9vdXRwdXQvb3V0cHV0X2ppdF9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsa0ZBQW9GO0FBQ3BGLDJEQUE2RDtBQUM3RCxzRUFBMEU7QUFDMUUsK0ZBQXNGO0FBRXRGLElBQU0sZ0JBQWdCLEdBQUcsMkJBQTJCLENBQUM7QUFFckQ7SUFDRSxRQUFRLENBQUMsWUFBWSxFQUFFO1FBQ3JCLFFBQVEsQ0FBQyxZQUFZLEVBQUU7WUFDckIsRUFBRSxDQUFDLHVDQUF1QyxFQUFFO2dCQUMxQyxJQUFNLFdBQVcsR0FBRyxJQUFJLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUN6QyxVQUFDLENBQUMsRUFBRSxLQUFLO29CQUNMLE9BQUEsSUFBSSxDQUFDLENBQUMsaUJBQWlCLENBQUMsZ0JBQWdCLEVBQUUsUUFBTSxLQUFLLE1BQUcsRUFBRSxFQUFDLElBQUksRUFBRSxRQUFNLEtBQUssTUFBRyxFQUFDLENBQUM7Z0JBQWpGLENBQWlGLENBQUMsQ0FBQztnQkFDM0YsSUFBTSxZQUFZLEdBQUcsSUFBSSxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FDMUMsVUFBQyxDQUFDLEVBQUUsS0FBSyxJQUFLLE9BQUEsSUFBSSxDQUFDLENBQUMsaUJBQWlCLENBQ2pDLGdCQUFnQixFQUFFLFFBQU0sS0FBSyxPQUFJLEVBQUUsRUFBQyxJQUFJLEVBQUUsUUFBTSxLQUFLLE9BQUksRUFBQyxDQUFDLEVBRGpELENBQ2lELENBQUMsQ0FBQztnQkFDckUsSUFBTSxHQUFHLEdBQUcsd0NBQXFCLENBQUMsVUFBVSxFQUFFLENBQUM7Z0JBQy9DLElBQU0sU0FBUyxHQUFHLElBQUksOEJBQWlCLENBQUMsSUFBSSxpQ0FBWSxFQUFFLENBQUMsQ0FBQztnQkFDNUQsU0FBUyxDQUFDLGtCQUFrQixDQUN4QixDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUssWUFBWSxRQUFLLFdBQVcsRUFBRSxHQUFHLENBQUMsVUFBQSxFQUFFLElBQUksT0FBQSxDQUFDLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFoQixDQUFnQixDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUN0RixHQUFHLENBQUMsQ0FBQztnQkFDVCxJQUFNLElBQUksR0FBRyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQ2pDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUM1QyxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7Q0FDSiJ9