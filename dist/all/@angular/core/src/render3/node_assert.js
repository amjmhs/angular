"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = require("./assert");
function assertNodeType(node, type) {
    assert_1.assertDefined(node, 'should be called with a node');
    assert_1.assertEqual(node.tNode.type, type, "should be a " + typeName(type));
}
exports.assertNodeType = assertNodeType;
function assertNodeOfPossibleTypes(node) {
    var types = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        types[_i - 1] = arguments[_i];
    }
    assert_1.assertDefined(node, 'should be called with a node');
    var found = types.some(function (type) { return node.tNode.type === type; });
    assert_1.assertEqual(found, true, "Should be one of " + types.map(typeName).join(', '));
}
exports.assertNodeOfPossibleTypes = assertNodeOfPossibleTypes;
function typeName(type) {
    if (type == 1 /* Projection */)
        return 'Projection';
    if (type == 0 /* Container */)
        return 'Container';
    if (type == 2 /* View */)
        return 'View';
    if (type == 3 /* Element */)
        return 'Element';
    return '<unknown>';
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZV9hc3NlcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy9yZW5kZXIzL25vZGVfYXNzZXJ0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsbUNBQW9EO0FBR3BELHdCQUErQixJQUFXLEVBQUUsSUFBZTtJQUN6RCxzQkFBYSxDQUFDLElBQUksRUFBRSw4QkFBOEIsQ0FBQyxDQUFDO0lBQ3BELG9CQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLGlCQUFlLFFBQVEsQ0FBQyxJQUFJLENBQUcsQ0FBQyxDQUFDO0FBQ3RFLENBQUM7QUFIRCx3Q0FHQztBQUVELG1DQUEwQyxJQUFXO0lBQUUsZUFBcUI7U0FBckIsVUFBcUIsRUFBckIscUJBQXFCLEVBQXJCLElBQXFCO1FBQXJCLDhCQUFxQjs7SUFDMUUsc0JBQWEsQ0FBQyxJQUFJLEVBQUUsOEJBQThCLENBQUMsQ0FBQztJQUNwRCxJQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQUEsSUFBSSxJQUFJLE9BQUEsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssSUFBSSxFQUF4QixDQUF3QixDQUFDLENBQUM7SUFDM0Qsb0JBQVcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLHNCQUFvQixLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUcsQ0FBQyxDQUFDO0FBQ2pGLENBQUM7QUFKRCw4REFJQztBQUVELGtCQUFrQixJQUFlO0lBQy9CLElBQUksSUFBSSxzQkFBd0I7UUFBRSxPQUFPLFlBQVksQ0FBQztJQUN0RCxJQUFJLElBQUkscUJBQXVCO1FBQUUsT0FBTyxXQUFXLENBQUM7SUFDcEQsSUFBSSxJQUFJLGdCQUFrQjtRQUFFLE9BQU8sTUFBTSxDQUFDO0lBQzFDLElBQUksSUFBSSxtQkFBcUI7UUFBRSxPQUFPLFNBQVMsQ0FBQztJQUNoRCxPQUFPLFdBQVcsQ0FBQztBQUNyQixDQUFDIn0=