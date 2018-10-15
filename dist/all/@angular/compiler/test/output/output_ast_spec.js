"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var o = require("../../src/output/output_ast");
{
    describe('OutputAst', function () {
        describe('collectExternalReferences', function () {
            it('should find expressions of variable types', function () {
                var ref1 = new o.ExternalReference('aModule', 'name1');
                var ref2 = new o.ExternalReference('aModule', 'name2');
                var stmt = o.variable('test').set(o.NULL_EXPR).toDeclStmt(o.importType(ref1, [o.importType(ref2)]));
                expect(o.collectExternalReferences([stmt])).toEqual([ref1, ref2]);
            });
        });
        describe('comments', function () {
            it('different JSDocCommentStmt should not be equivalent', function () {
                var comment1 = new o.JSDocCommentStmt([{ text: 'text' }]);
                var comment2 = new o.JSDocCommentStmt([{ text: 'text2' }]);
                var comment3 = new o.JSDocCommentStmt([{ tagName: "desc" /* Desc */, text: 'text2' }]);
                var comment4 = new o.JSDocCommentStmt([{ text: 'text2' }, { text: 'text3' }]);
                expect(comment1.isEquivalent(comment2)).toBeFalsy();
                expect(comment1.isEquivalent(comment3)).toBeFalsy();
                expect(comment1.isEquivalent(comment4)).toBeFalsy();
                expect(comment2.isEquivalent(comment3)).toBeFalsy();
                expect(comment2.isEquivalent(comment4)).toBeFalsy();
                expect(comment3.isEquivalent(comment4)).toBeFalsy();
                expect(comment1.isEquivalent(comment1)).toBeTruthy();
            });
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3V0cHV0X2FzdF9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvdGVzdC9vdXRwdXQvb3V0cHV0X2FzdF9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsK0NBQWlEO0FBRWpEO0lBQ0UsUUFBUSxDQUFDLFdBQVcsRUFBRTtRQUNwQixRQUFRLENBQUMsMkJBQTJCLEVBQUU7WUFDcEMsRUFBRSxDQUFDLDJDQUEyQyxFQUFFO2dCQUM5QyxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQ3pELElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLGlCQUFpQixDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDekQsSUFBTSxJQUFJLEdBQ04sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQ1QsSUFBSSxDQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRXJGLE1BQU0sQ0FBQyxDQUFDLENBQUMseUJBQXlCLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDcEUsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyxVQUFVLEVBQUU7WUFDbkIsRUFBRSxDQUFDLHFEQUFxRCxFQUFFO2dCQUN4RCxJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUMsQ0FBQztnQkFDMUQsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxFQUFDLElBQUksRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzNELElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsRUFBQyxPQUFPLG1CQUFxQixFQUFFLElBQUksRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pGLElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsRUFBQyxJQUFJLEVBQUUsT0FBTyxFQUFDLEVBQUUsRUFBQyxJQUFJLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUU1RSxNQUFNLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO2dCQUNwRCxNQUFNLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO2dCQUNwRCxNQUFNLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO2dCQUNwRCxNQUFNLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO2dCQUNwRCxNQUFNLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO2dCQUNwRCxNQUFNLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO2dCQUNwRCxNQUFNLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ3ZELENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztDQUNKIn0=