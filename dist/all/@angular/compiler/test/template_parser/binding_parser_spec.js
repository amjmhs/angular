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
var testing_1 = require("@angular/core/testing");
var element_schema_registry_1 = require("../../src/schema/element_schema_registry");
var binding_parser_1 = require("../../src/template_parser/binding_parser");
{
    describe('BindingParser', function () {
        var registry;
        beforeEach(testing_1.inject([element_schema_registry_1.ElementSchemaRegistry], function (_registry) { registry = _registry; }));
        describe('possibleSecurityContexts', function () {
            function hrefSecurityContexts(selector) {
                return binding_parser_1.calcPossibleSecurityContexts(registry, selector, 'href', false);
            }
            it('should return a single security context if the selector as an element name', function () { expect(hrefSecurityContexts('a')).toEqual([core_1.SecurityContext.URL]); });
            it('should return the possible security contexts if the selector has no element name', function () {
                expect(hrefSecurityContexts('[myDir]')).toEqual([
                    core_1.SecurityContext.NONE, core_1.SecurityContext.URL, core_1.SecurityContext.RESOURCE_URL
                ]);
            });
            it('should exclude possible elements via :not', function () {
                expect(hrefSecurityContexts('[myDir]:not(link):not(base)')).toEqual([
                    core_1.SecurityContext.NONE, core_1.SecurityContext.URL
                ]);
            });
            it('should not exclude possible narrowed elements via :not', function () {
                expect(hrefSecurityContexts('[myDir]:not(link.someClass):not(base.someClass)')).toEqual([
                    core_1.SecurityContext.NONE, core_1.SecurityContext.URL, core_1.SecurityContext.RESOURCE_URL
                ]);
            });
            it('should return SecurityContext.NONE if there are no possible elements', function () { expect(hrefSecurityContexts('img:not(img)')).toEqual([core_1.SecurityContext.NONE]); });
            it('should return the union of the possible security contexts if multiple selectors are specified', function () {
                expect(binding_parser_1.calcPossibleSecurityContexts(registry, 'a,link', 'href', false)).toEqual([
                    core_1.SecurityContext.URL, core_1.SecurityContext.RESOURCE_URL
                ]);
            });
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmluZGluZ19wYXJzZXJfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3Rlc3QvdGVtcGxhdGVfcGFyc2VyL2JpbmRpbmdfcGFyc2VyX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxzQ0FBOEM7QUFDOUMsaURBQTZDO0FBRTdDLG9GQUErRTtBQUMvRSwyRUFBc0Y7QUFFdEY7SUFDRSxRQUFRLENBQUMsZUFBZSxFQUFFO1FBQ3hCLElBQUksUUFBK0IsQ0FBQztRQUVwQyxVQUFVLENBQUMsZ0JBQU0sQ0FDYixDQUFDLCtDQUFxQixDQUFDLEVBQUUsVUFBQyxTQUFnQyxJQUFPLFFBQVEsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRS9GLFFBQVEsQ0FBQywwQkFBMEIsRUFBRTtZQUNuQyw4QkFBOEIsUUFBZ0I7Z0JBQzVDLE9BQU8sNkNBQTRCLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDekUsQ0FBQztZQUVELEVBQUUsQ0FBQyw0RUFBNEUsRUFDNUUsY0FBUSxNQUFNLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxzQkFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVoRixFQUFFLENBQUMsa0ZBQWtGLEVBQUU7Z0JBQ3JGLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztvQkFDOUMsc0JBQWUsQ0FBQyxJQUFJLEVBQUUsc0JBQWUsQ0FBQyxHQUFHLEVBQUUsc0JBQWUsQ0FBQyxZQUFZO2lCQUN4RSxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQywyQ0FBMkMsRUFBRTtnQkFDOUMsTUFBTSxDQUFDLG9CQUFvQixDQUFDLDZCQUE2QixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7b0JBQ2xFLHNCQUFlLENBQUMsSUFBSSxFQUFFLHNCQUFlLENBQUMsR0FBRztpQkFDMUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsd0RBQXdELEVBQUU7Z0JBQzNELE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxpREFBaUQsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO29CQUN0RixzQkFBZSxDQUFDLElBQUksRUFBRSxzQkFBZSxDQUFDLEdBQUcsRUFBRSxzQkFBZSxDQUFDLFlBQVk7aUJBQ3hFLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLHNFQUFzRSxFQUN0RSxjQUFRLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLHNCQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRTVGLEVBQUUsQ0FBQywrRkFBK0YsRUFDL0Y7Z0JBQ0UsTUFBTSxDQUFDLDZDQUE0QixDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO29CQUM5RSxzQkFBZSxDQUFDLEdBQUcsRUFBRSxzQkFBZSxDQUFDLFlBQVk7aUJBQ2xELENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ1IsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztDQUNKIn0=