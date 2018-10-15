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
var t = require("@angular/core/testing/src/testing_internal");
var dom_sanitization_service_1 = require("../../src/security/dom_sanitization_service");
{
    t.describe('DOM Sanitization Service', function () {
        t.it('accepts resource URL values for resource contexts', function () {
            var svc = new dom_sanitization_service_1.DomSanitizerImpl(null);
            var resourceUrl = svc.bypassSecurityTrustResourceUrl('http://hello/world');
            t.expect(svc.sanitize(core_1.SecurityContext.URL, resourceUrl)).toBe('http://hello/world');
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tX3Nhbml0aXphdGlvbl9zZXJ2aWNlX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS1icm93c2VyL3Rlc3Qvc2VjdXJpdHkvZG9tX3Nhbml0aXphdGlvbl9zZXJ2aWNlX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxzQ0FBOEM7QUFDOUMsOERBQWdFO0FBRWhFLHdGQUE2RTtBQUU3RTtJQUNFLENBQUMsQ0FBQyxRQUFRLENBQUMsMEJBQTBCLEVBQUU7UUFDckMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxtREFBbUQsRUFBRTtZQUN4RCxJQUFNLEdBQUcsR0FBRyxJQUFJLDJDQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3ZDLElBQU0sV0FBVyxHQUFHLEdBQUcsQ0FBQyw4QkFBOEIsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1lBQzdFLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxzQkFBZSxDQUFDLEdBQUcsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBQ3RGLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7Q0FDSiJ9