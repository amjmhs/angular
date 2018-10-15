"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var extract_projectable_nodes_1 = require("../src/extract-projectable-nodes");
describe('extractProjectableNodes()', function () {
    var elem;
    var childNodes;
    var expectProjectableNodes = function (matches) {
        var selectors = Object.keys(matches);
        var expected = selectors.map(function (selector) {
            var matchingIndices = matches[selector];
            return matchingIndices.map(function (idx) { return childNodes[idx]; });
        });
        expect(extract_projectable_nodes_1.extractProjectableNodes(elem, selectors)).toEqual(expected);
    };
    var test = function (matches) { return function () { return expectProjectableNodes(matches); }; };
    beforeEach(function () {
        elem = document.createElement('div');
        elem.innerHTML = '<div class="foo" first="">' +
            '<span class="bar"></span>' +
            '</div>' +
            '<span id="bar"></span>' +
            '<!-- Comment -->' +
            'Text' +
            '<blink class="foo" id="quux"></blink>' +
            'More text';
        childNodes = Array.prototype.slice.call(elem.childNodes);
    });
    it('should match each node to the corresponding selector', test({
        '[first]': [0],
        '#bar': [1],
        '#quux': [4],
    }));
    it('should ignore non-matching nodes', test({
        '.zoo': [],
    }));
    it('should only match top-level child nodes', test({
        'span': [1],
        '.bar': [],
    }));
    it('should support complex selectors', test({
        '.foo:not(div)': [4],
        'div + #bar': [1],
    }));
    it('should match each node with the first matching selector', test({
        'div': [0],
        '.foo': [4],
        'blink': [],
    }));
    describe('(with wildcard selector)', function () {
        it('should match non-element nodes to `*` (but still ignore comments)', test({
            'div,span,blink': [0, 1, 4],
            '*': [2, 3, 5],
        }));
        it('should match otherwise unmatched nodes to `*`', test({
            'div,blink': [0, 4],
            '*': [1, 2, 3, 5],
        }));
        it('should give higher priority to `*` (eve if it appears first)', test({
            '*': [2, 3, 5],
            'div,span,blink': [0, 1, 4],
        }));
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0cmFjdC1wcm9qZWN0YWJsZS1ub2Rlc19zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZWxlbWVudHMvdGVzdC9leHRyYWN0LXByb2plY3RhYmxlLW5vZGVzX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCw4RUFBeUU7QUFFekUsUUFBUSxDQUFDLDJCQUEyQixFQUFFO0lBQ3BDLElBQUksSUFBaUIsQ0FBQztJQUN0QixJQUFJLFVBQW9CLENBQUM7SUFFekIsSUFBTSxzQkFBc0IsR0FBRyxVQUFDLE9BQXVDO1FBQ3JFLElBQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdkMsSUFBTSxRQUFRLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFBLFFBQVE7WUFDckMsSUFBTSxlQUFlLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzFDLE9BQU8sZUFBZSxDQUFDLEdBQUcsQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFBLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBZixDQUFlLENBQUMsQ0FBQztRQUNyRCxDQUFDLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxtREFBdUIsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDckUsQ0FBQyxDQUFDO0lBQ0YsSUFBTSxJQUFJLEdBQUcsVUFBQyxPQUF1QyxJQUFLLE9BQUEsY0FBTSxPQUFBLHNCQUFzQixDQUFDLE9BQU8sQ0FBQyxFQUEvQixDQUErQixFQUFyQyxDQUFxQyxDQUFDO0lBRWhHLFVBQVUsQ0FBQztRQUNULElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxTQUFTLEdBQUcsNEJBQTRCO1lBQ3pDLDJCQUEyQjtZQUMzQixRQUFRO1lBQ1Isd0JBQXdCO1lBQ3hCLGtCQUFrQjtZQUNsQixNQUFNO1lBQ04sdUNBQXVDO1lBQ3ZDLFdBQVcsQ0FBQztRQUNoQixVQUFVLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUMzRCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxzREFBc0QsRUFBRSxJQUFJLENBQUM7UUFDM0QsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2QsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ1gsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ2IsQ0FBQyxDQUFDLENBQUM7SUFFUCxFQUFFLENBQUMsa0NBQWtDLEVBQUUsSUFBSSxDQUFDO1FBQ3ZDLE1BQU0sRUFBRSxFQUFFO0tBQ1gsQ0FBQyxDQUFDLENBQUM7SUFFUCxFQUFFLENBQUMseUNBQXlDLEVBQUUsSUFBSSxDQUFDO1FBQzlDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNYLE1BQU0sRUFBRSxFQUFFO0tBQ1gsQ0FBQyxDQUFDLENBQUM7SUFFUCxFQUFFLENBQUMsa0NBQWtDLEVBQUUsSUFBSSxDQUFDO1FBQ3ZDLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNwQixZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDbEIsQ0FBQyxDQUFDLENBQUM7SUFFUCxFQUFFLENBQUMseURBQXlELEVBQUUsSUFBSSxDQUFDO1FBQzlELEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNWLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNYLE9BQU8sRUFBRSxFQUFFO0tBQ1osQ0FBQyxDQUFDLENBQUM7SUFFUCxRQUFRLENBQUMsMEJBQTBCLEVBQUU7UUFDbkMsRUFBRSxDQUFDLG1FQUFtRSxFQUFFLElBQUksQ0FBQztZQUN4RSxnQkFBZ0IsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzNCLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ2YsQ0FBQyxDQUFDLENBQUM7UUFFUCxFQUFFLENBQUMsK0NBQStDLEVBQUUsSUFBSSxDQUFDO1lBQ3BELFdBQVcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDbkIsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ2xCLENBQUMsQ0FBQyxDQUFDO1FBRVAsRUFBRSxDQUFDLDhEQUE4RCxFQUFFLElBQUksQ0FBQztZQUNuRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNkLGdCQUFnQixFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDNUIsQ0FBQyxDQUFDLENBQUM7SUFDVCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIn0=