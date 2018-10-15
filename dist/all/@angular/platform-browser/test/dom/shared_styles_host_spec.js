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
var dom_adapter_1 = require("@angular/platform-browser/src/dom/dom_adapter");
var shared_styles_host_1 = require("@angular/platform-browser/src/dom/shared_styles_host");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
{
    testing_internal_1.describe('DomSharedStylesHost', function () {
        var doc;
        var ssh;
        var someHost;
        testing_internal_1.beforeEach(function () {
            doc = dom_adapter_1.getDOM().createHtmlDocument();
            doc.title = '';
            ssh = new shared_styles_host_1.DomSharedStylesHost(doc);
            someHost = dom_adapter_1.getDOM().createElement('div');
        });
        testing_internal_1.it('should add existing styles to new hosts', function () {
            ssh.addStyles(['a {};']);
            ssh.addHost(someHost);
            matchers_1.expect(dom_adapter_1.getDOM().getInnerHTML(someHost)).toEqual('<style>a {};</style>');
        });
        testing_internal_1.it('should add new styles to hosts', function () {
            ssh.addHost(someHost);
            ssh.addStyles(['a {};']);
            matchers_1.expect(dom_adapter_1.getDOM().getInnerHTML(someHost)).toEqual('<style>a {};</style>');
        });
        testing_internal_1.it('should add styles only once to hosts', function () {
            ssh.addStyles(['a {};']);
            ssh.addHost(someHost);
            ssh.addStyles(['a {};']);
            matchers_1.expect(dom_adapter_1.getDOM().getInnerHTML(someHost)).toEqual('<style>a {};</style>');
        });
        testing_internal_1.it('should use the document head as default host', function () {
            ssh.addStyles(['a {};', 'b {};']);
            matchers_1.expect(doc.head).toHaveText('a {};b {};');
        });
        testing_internal_1.it('should remove style nodes on destroy', function () {
            ssh.addStyles(['a {};']);
            ssh.addHost(someHost);
            matchers_1.expect(dom_adapter_1.getDOM().getInnerHTML(someHost)).toEqual('<style>a {};</style>');
            ssh.ngOnDestroy();
            matchers_1.expect(dom_adapter_1.getDOM().getInnerHTML(someHost)).toEqual('');
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhcmVkX3N0eWxlc19ob3N0X3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS1icm93c2VyL3Rlc3QvZG9tL3NoYXJlZF9zdHlsZXNfaG9zdF9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsK0VBQW9GO0FBQ3BGLDZFQUFxRTtBQUNyRSwyRkFBeUY7QUFDekYsMkVBQXNFO0FBRXRFO0lBQ0UsMkJBQVEsQ0FBQyxxQkFBcUIsRUFBRTtRQUM5QixJQUFJLEdBQWEsQ0FBQztRQUNsQixJQUFJLEdBQXdCLENBQUM7UUFDN0IsSUFBSSxRQUFpQixDQUFDO1FBQ3RCLDZCQUFVLENBQUM7WUFDVCxHQUFHLEdBQUcsb0JBQU0sRUFBRSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFDcEMsR0FBRyxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7WUFDZixHQUFHLEdBQUcsSUFBSSx3Q0FBbUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNuQyxRQUFRLEdBQUcsb0JBQU0sRUFBRSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMzQyxDQUFDLENBQUMsQ0FBQztRQUVILHFCQUFFLENBQUMseUNBQXlDLEVBQUU7WUFDNUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDekIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN0QixpQkFBTSxDQUFDLG9CQUFNLEVBQUUsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUMxRSxDQUFDLENBQUMsQ0FBQztRQUVILHFCQUFFLENBQUMsZ0NBQWdDLEVBQUU7WUFDbkMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN0QixHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUN6QixpQkFBTSxDQUFDLG9CQUFNLEVBQUUsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUMxRSxDQUFDLENBQUMsQ0FBQztRQUVILHFCQUFFLENBQUMsc0NBQXNDLEVBQUU7WUFDekMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDekIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN0QixHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUN6QixpQkFBTSxDQUFDLG9CQUFNLEVBQUUsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUMxRSxDQUFDLENBQUMsQ0FBQztRQUVILHFCQUFFLENBQUMsOENBQThDLEVBQUU7WUFDakQsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLGlCQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUM1QyxDQUFDLENBQUMsQ0FBQztRQUVILHFCQUFFLENBQUMsc0NBQXNDLEVBQUU7WUFDekMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDekIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN0QixpQkFBTSxDQUFDLG9CQUFNLEVBQUUsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQztZQUV4RSxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDbEIsaUJBQU0sQ0FBQyxvQkFBTSxFQUFFLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3RELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7Q0FDSiJ9