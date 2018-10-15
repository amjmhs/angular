"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var testing_internal_1 = require("../../../core/testing/src/testing_internal");
var html_parser_1 = require("../../src/ml_parser/html_parser");
var template_preparser_1 = require("../../src/template_parser/template_preparser");
{
    testing_internal_1.describe('preparseElement', function () {
        var htmlParser;
        testing_internal_1.beforeEach(testing_internal_1.inject([html_parser_1.HtmlParser], function (_htmlParser) { htmlParser = _htmlParser; }));
        function preparse(html) {
            return template_preparser_1.preparseElement(htmlParser.parse(html, 'TestComp').rootNodes[0]);
        }
        testing_internal_1.it('should detect script elements', testing_internal_1.inject([html_parser_1.HtmlParser], function (htmlParser) {
            testing_internal_1.expect(preparse('<script>').type).toBe(template_preparser_1.PreparsedElementType.SCRIPT);
        }));
        testing_internal_1.it('should detect style elements', testing_internal_1.inject([html_parser_1.HtmlParser], function (htmlParser) {
            testing_internal_1.expect(preparse('<style>').type).toBe(template_preparser_1.PreparsedElementType.STYLE);
        }));
        testing_internal_1.it('should detect stylesheet elements', testing_internal_1.inject([html_parser_1.HtmlParser], function (htmlParser) {
            testing_internal_1.expect(preparse('<link rel="stylesheet">').type).toBe(template_preparser_1.PreparsedElementType.STYLESHEET);
            testing_internal_1.expect(preparse('<link rel="stylesheet" href="someUrl">').hrefAttr).toEqual('someUrl');
            testing_internal_1.expect(preparse('<link rel="someRel">').type).toBe(template_preparser_1.PreparsedElementType.OTHER);
        }));
        testing_internal_1.it('should detect ng-content elements', testing_internal_1.inject([html_parser_1.HtmlParser], function (htmlParser) {
            testing_internal_1.expect(preparse('<ng-content>').type).toBe(template_preparser_1.PreparsedElementType.NG_CONTENT);
        }));
        testing_internal_1.it('should normalize ng-content.select attribute', testing_internal_1.inject([html_parser_1.HtmlParser], function (htmlParser) {
            testing_internal_1.expect(preparse('<ng-content>').selectAttr).toEqual('*');
            testing_internal_1.expect(preparse('<ng-content select>').selectAttr).toEqual('*');
            testing_internal_1.expect(preparse('<ng-content select="*">').selectAttr).toEqual('*');
        }));
        testing_internal_1.it('should extract ngProjectAs value', function () {
            testing_internal_1.expect(preparse('<p ngProjectAs="el[attr].class"></p>').projectAs).toEqual('el[attr].class');
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGVfcHJlcGFyc2VyX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci90ZXN0L3RlbXBsYXRlX3BhcnNlci90ZW1wbGF0ZV9wcmVwYXJzZXJfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILCtFQUFvRztBQUVwRywrREFBMkQ7QUFDM0QsbUZBQXFIO0FBRXJIO0lBQ0UsMkJBQVEsQ0FBQyxpQkFBaUIsRUFBRTtRQUMxQixJQUFJLFVBQXNCLENBQUM7UUFDM0IsNkJBQVUsQ0FBQyx5QkFBTSxDQUFDLENBQUMsd0JBQVUsQ0FBQyxFQUFFLFVBQUMsV0FBdUIsSUFBTyxVQUFVLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUU3RixrQkFBa0IsSUFBWTtZQUM1QixPQUFPLG9DQUFlLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBWSxDQUFDLENBQUM7UUFDckYsQ0FBQztRQUVELHFCQUFFLENBQUMsK0JBQStCLEVBQUUseUJBQU0sQ0FBQyxDQUFDLHdCQUFVLENBQUMsRUFBRSxVQUFDLFVBQXNCO1lBQzNFLHlCQUFNLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyx5Q0FBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN0RSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRVAscUJBQUUsQ0FBQyw4QkFBOEIsRUFBRSx5QkFBTSxDQUFDLENBQUMsd0JBQVUsQ0FBQyxFQUFFLFVBQUMsVUFBc0I7WUFDMUUseUJBQU0sQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLHlDQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3BFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFUCxxQkFBRSxDQUFDLG1DQUFtQyxFQUFFLHlCQUFNLENBQUMsQ0FBQyx3QkFBVSxDQUFDLEVBQUUsVUFBQyxVQUFzQjtZQUMvRSx5QkFBTSxDQUFDLFFBQVEsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyx5Q0FBb0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUN2Rix5QkFBTSxDQUFDLFFBQVEsQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN2Rix5QkFBTSxDQUFDLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyx5Q0FBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNqRixDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRVAscUJBQUUsQ0FBQyxtQ0FBbUMsRUFBRSx5QkFBTSxDQUFDLENBQUMsd0JBQVUsQ0FBQyxFQUFFLFVBQUMsVUFBc0I7WUFDL0UseUJBQU0sQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLHlDQUFvQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzlFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFUCxxQkFBRSxDQUFDLDhDQUE4QyxFQUM5Qyx5QkFBTSxDQUFDLENBQUMsd0JBQVUsQ0FBQyxFQUFFLFVBQUMsVUFBc0I7WUFDMUMseUJBQU0sQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3pELHlCQUFNLENBQUMsUUFBUSxDQUFDLHFCQUFxQixDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2hFLHlCQUFNLENBQUMsUUFBUSxDQUFDLHlCQUF5QixDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3RFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFUCxxQkFBRSxDQUFDLGtDQUFrQyxFQUFFO1lBQ3JDLHlCQUFNLENBQUMsUUFBUSxDQUFDLHNDQUFzQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDL0YsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztDQUNKIn0=