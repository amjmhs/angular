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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcG9uZW50X2luZm8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy91cGdyYWRlL3NyYy9jb21tb24vY29tcG9uZW50X2luZm8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSDs7Ozs7R0FLRztBQUNIO0lBY0UseUJBQW1CLElBQVksRUFBUyxJQUFZO1FBQWpDLFNBQUksR0FBSixJQUFJLENBQVE7UUFBUyxTQUFJLEdBQUosSUFBSSxDQUFRO1FBQUksSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQUMsQ0FBQztJQUV0RSxzQ0FBWSxHQUFwQjtRQUNFLElBQUksQ0FBQyxXQUFXLEdBQUcsTUFBSSxJQUFJLENBQUMsSUFBSSxNQUFHLENBQUM7UUFDcEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFJLElBQUksQ0FBQyxJQUFJLE1BQUcsQ0FBQztRQUNsQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsT0FBSyxJQUFJLENBQUMsSUFBSSxPQUFJLENBQUM7UUFDM0MsSUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUUsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFLLFdBQWEsQ0FBQztRQUNqQyxJQUFJLENBQUMsUUFBUSxHQUFHLFNBQU8sV0FBYSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxVQUFVLEdBQUcsV0FBUyxXQUFhLENBQUM7SUFDM0MsQ0FBQztJQUNILHNCQUFDO0FBQUQsQ0FBQyxBQXpCRCxJQXlCQztBQXpCWSwwQ0FBZSJ9