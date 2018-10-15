"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tags_1 = require("./tags");
var XmlTagDefinition = /** @class */ (function () {
    function XmlTagDefinition() {
        this.closedByParent = false;
        this.contentType = tags_1.TagContentType.PARSABLE_DATA;
        this.isVoid = false;
        this.ignoreFirstLf = false;
        this.canSelfClose = true;
    }
    XmlTagDefinition.prototype.requireExtraParent = function (currentParent) { return false; };
    XmlTagDefinition.prototype.isClosedByChild = function (name) { return false; };
    return XmlTagDefinition;
}());
exports.XmlTagDefinition = XmlTagDefinition;
var _TAG_DEFINITION = new XmlTagDefinition();
function getXmlTagDefinition(tagName) {
    return _TAG_DEFINITION;
}
exports.getXmlTagDefinition = getXmlTagDefinition;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieG1sX3RhZ3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci9zcmMvbWxfcGFyc2VyL3htbF90YWdzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsK0JBQXFEO0FBRXJEO0lBQUE7UUFDRSxtQkFBYyxHQUFZLEtBQUssQ0FBQztRQU9oQyxnQkFBVyxHQUFtQixxQkFBYyxDQUFDLGFBQWEsQ0FBQztRQUMzRCxXQUFNLEdBQVksS0FBSyxDQUFDO1FBQ3hCLGtCQUFhLEdBQVksS0FBSyxDQUFDO1FBQy9CLGlCQUFZLEdBQVksSUFBSSxDQUFDO0lBSy9CLENBQUM7SUFIQyw2Q0FBa0IsR0FBbEIsVUFBbUIsYUFBcUIsSUFBYSxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFFcEUsMENBQWUsR0FBZixVQUFnQixJQUFZLElBQWEsT0FBTyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQzFELHVCQUFDO0FBQUQsQ0FBQyxBQWhCRCxJQWdCQztBQWhCWSw0Q0FBZ0I7QUFrQjdCLElBQU0sZUFBZSxHQUFHLElBQUksZ0JBQWdCLEVBQUUsQ0FBQztBQUUvQyw2QkFBb0MsT0FBZTtJQUNqRCxPQUFPLGVBQWUsQ0FBQztBQUN6QixDQUFDO0FBRkQsa0RBRUMifQ==