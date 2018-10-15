"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var base_response_options_1 = require("@angular/http/src/base_response_options");
var static_response_1 = require("@angular/http/src/static_response");
{
    testing_internal_1.describe('Response', function () {
        testing_internal_1.it('should be ok for 200 statuses', function () {
            testing_internal_1.expect(new static_response_1.Response(new base_response_options_1.ResponseOptions({ status: 200 })).ok).toEqual(true);
            testing_internal_1.expect(new static_response_1.Response(new base_response_options_1.ResponseOptions({ status: 299 })).ok).toEqual(true);
        });
        testing_internal_1.it('should not be ok for non 200 statuses', function () {
            testing_internal_1.expect(new static_response_1.Response(new base_response_options_1.ResponseOptions({ status: 199 })).ok).toEqual(false);
            testing_internal_1.expect(new static_response_1.Response(new base_response_options_1.ResponseOptions({ status: 300 })).ok).toEqual(false);
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljX3Jlc3BvbnNlX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9odHRwL3Rlc3Qvc3RhdGljX3Jlc3BvbnNlX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCwrRUFBZ0Y7QUFFaEYsaUZBQXdFO0FBQ3hFLHFFQUEyRDtBQUkzRDtJQUNFLDJCQUFRLENBQUMsVUFBVSxFQUFFO1FBQ25CLHFCQUFFLENBQUMsK0JBQStCLEVBQUU7WUFDbEMseUJBQU0sQ0FBQyxJQUFJLDBCQUFRLENBQUMsSUFBSSx1Q0FBZSxDQUFDLEVBQUMsTUFBTSxFQUFFLEdBQUcsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDMUUseUJBQU0sQ0FBQyxJQUFJLDBCQUFRLENBQUMsSUFBSSx1Q0FBZSxDQUFDLEVBQUMsTUFBTSxFQUFFLEdBQUcsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUUsQ0FBQyxDQUFDLENBQUM7UUFFSCxxQkFBRSxDQUFDLHVDQUF1QyxFQUFFO1lBQzFDLHlCQUFNLENBQUMsSUFBSSwwQkFBUSxDQUFDLElBQUksdUNBQWUsQ0FBQyxFQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzNFLHlCQUFNLENBQUMsSUFBSSwwQkFBUSxDQUFDLElBQUksdUNBQWUsQ0FBQyxFQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzdFLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7Q0FDSiJ9