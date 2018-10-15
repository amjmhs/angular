"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A `PropertyBinding` represents a mapping between a property name
 * and an attribute name. It is parsed from a string of the form
 * `"prop: attr"`; or simply `"propAndAttr" where the property
 * and attribute have the same identifier.
 */
var PropertyBinding = /** @class */ (function () {
    function PropertyBinding(prop, attr) {
        this.prop = prop;
        this.attr = attr;
        this.parseBinding();
    }
    PropertyBinding.prototype.parseBinding = function () {
        this.bracketAttr = "[" + this.attr + "]";
        this.parenAttr = "(" + this.attr + ")";
        this.bracketParenAttr = "[(" + this.attr + ")]";
        var capitalAttr = this.attr.charAt(0).toUpperCase() + this.attr.substr(1);
        this.onAttr = "on" + capitalAttr;
        this.bindAttr = "bind" + capitalAttr;
        this.bindonAttr = "bindon" + capitalAttr;
    };
    return PropertyBinding;
}());
exports.PropertyBinding = PropertyBinding;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcG9uZW50X2luZm8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy91cGdyYWRlL3N0YXRpYy9zcmMvY29tbW9uL2NvbXBvbmVudF9pbmZvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUg7Ozs7O0dBS0c7QUFDSDtJQWNFLHlCQUFtQixJQUFZLEVBQVMsSUFBWTtRQUFqQyxTQUFJLEdBQUosSUFBSSxDQUFRO1FBQVMsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUFJLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUFDLENBQUM7SUFFdEUsc0NBQVksR0FBcEI7UUFDRSxJQUFJLENBQUMsV0FBVyxHQUFHLE1BQUksSUFBSSxDQUFDLElBQUksTUFBRyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxTQUFTLEdBQUcsTUFBSSxJQUFJLENBQUMsSUFBSSxNQUFHLENBQUM7UUFDbEMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLE9BQUssSUFBSSxDQUFDLElBQUksT0FBSSxDQUFDO1FBQzNDLElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVFLElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBSyxXQUFhLENBQUM7UUFDakMsSUFBSSxDQUFDLFFBQVEsR0FBRyxTQUFPLFdBQWEsQ0FBQztRQUNyQyxJQUFJLENBQUMsVUFBVSxHQUFHLFdBQVMsV0FBYSxDQUFDO0lBQzNDLENBQUM7SUFDSCxzQkFBQztBQUFELENBQUMsQUF6QkQsSUF5QkM7QUF6QlksMENBQWUifQ==