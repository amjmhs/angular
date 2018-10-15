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
var html_info_1 = require("../src/html_info");
describe('html_info', function () {
    var domRegistry = new compiler_1.DomElementSchemaRegistry();
    it('should have the same elements as the dom registry', function () {
        // If this test fails, replace the SCHEMA constant in html_info with the one
        // from dom_element_schema_registry and also verify the code to interpret
        // the schema is the same.
        var domElements = domRegistry.allKnownElementNames();
        var infoElements = html_info_1.SchemaInformation.instance.allKnownElements();
        var uniqueToDom = uniqueElements(infoElements, domElements);
        var uniqueToInfo = uniqueElements(domElements, infoElements);
        expect(uniqueToDom).toEqual([]);
        expect(uniqueToInfo).toEqual([]);
    });
    it('should have at least a sub-set of properties', function () {
        var elements = html_info_1.SchemaInformation.instance.allKnownElements();
        for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
            var element = elements_1[_i];
            for (var _a = 0, _b = html_info_1.SchemaInformation.instance.propertiesOf(element); _a < _b.length; _a++) {
                var prop = _b[_a];
                expect(domRegistry.hasProperty(element, prop, []));
            }
        }
    });
});
function uniqueElements(a, b) {
    var s = new Set();
    for (var _i = 0, a_1 = a; _i < a_1.length; _i++) {
        var aItem = a_1[_i];
        s.add(aItem);
    }
    var result = [];
    var reported = new Set();
    for (var _a = 0, b_1 = b; _a < b_1.length; _a++) {
        var bItem = b_1[_a];
        if (!s.has(bItem) && !reported.has(bItem)) {
            reported.add(bItem);
            result.push(bItem);
        }
    }
    return result;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHRtbF9pbmZvX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sYW5ndWFnZS1zZXJ2aWNlL3Rlc3QvaHRtbF9pbmZvX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCw4Q0FBMkQ7QUFDM0QsOENBQW1EO0FBRW5ELFFBQVEsQ0FBQyxXQUFXLEVBQUU7SUFDcEIsSUFBTSxXQUFXLEdBQUcsSUFBSSxtQ0FBd0IsRUFBRSxDQUFDO0lBRW5ELEVBQUUsQ0FBQyxtREFBbUQsRUFBRTtRQUN0RCw0RUFBNEU7UUFDNUUseUVBQXlFO1FBQ3pFLDBCQUEwQjtRQUMxQixJQUFNLFdBQVcsR0FBRyxXQUFXLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztRQUN2RCxJQUFNLFlBQVksR0FBRyw2QkFBaUIsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUNuRSxJQUFNLFdBQVcsR0FBRyxjQUFjLENBQUMsWUFBWSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQzlELElBQU0sWUFBWSxHQUFHLGNBQWMsQ0FBQyxXQUFXLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDL0QsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNoQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ25DLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDhDQUE4QyxFQUFFO1FBQ2pELElBQU0sUUFBUSxHQUFHLDZCQUFpQixDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBQy9ELEtBQXNCLFVBQVEsRUFBUixxQkFBUSxFQUFSLHNCQUFRLEVBQVIsSUFBUSxFQUFFO1lBQTNCLElBQU0sT0FBTyxpQkFBQTtZQUNoQixLQUFtQixVQUFnRCxFQUFoRCxLQUFBLDZCQUFpQixDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLEVBQWhELGNBQWdELEVBQWhELElBQWdELEVBQUU7Z0JBQWhFLElBQU0sSUFBSSxTQUFBO2dCQUNiLE1BQU0sQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUNwRDtTQUNGO0lBQ0gsQ0FBQyxDQUFDLENBQUM7QUFFTCxDQUFDLENBQUMsQ0FBQztBQUVILHdCQUEyQixDQUFNLEVBQUUsQ0FBTTtJQUN2QyxJQUFNLENBQUMsR0FBRyxJQUFJLEdBQUcsRUFBSyxDQUFDO0lBQ3ZCLEtBQW9CLFVBQUMsRUFBRCxPQUFDLEVBQUQsZUFBQyxFQUFELElBQUMsRUFBRTtRQUFsQixJQUFNLEtBQUssVUFBQTtRQUNkLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDZDtJQUNELElBQU0sTUFBTSxHQUFRLEVBQUUsQ0FBQztJQUN2QixJQUFNLFFBQVEsR0FBRyxJQUFJLEdBQUcsRUFBSyxDQUFDO0lBQzlCLEtBQW9CLFVBQUMsRUFBRCxPQUFDLEVBQUQsZUFBQyxFQUFELElBQUMsRUFBRTtRQUFsQixJQUFNLEtBQUssVUFBQTtRQUNkLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUN6QyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3BCLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDcEI7S0FDRjtJQUNELE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUMifQ==